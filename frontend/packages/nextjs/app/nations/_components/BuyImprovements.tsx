"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { buyImprovement } from "~~/utils/improvements";
import { getImprovements } from "~~/utils/improvements";
import { checkBalance } from "~~/utils/treasury";
import { useTheme } from "next-themes";
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';

const BuyImprovement = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const ImprovementContract1 = contractsData?.ImprovementsContract1;
    const ImprovementContract2 = contractsData?.ImprovementsContract2;
    const ImprovementContract3 = contractsData?.ImprovementsContract3;
    const ImprovementContract4 = contractsData?.ImprovementsContract4;
    const TreasuryContract = contractsData?.TreasuryContract;
    const { writeContractAsync } = useWriteContract();

    interface ImprovementDetails {
        [key: string]: string;
    }

    const improvementKeyMapping: { [key: string]: string } = {
        airports: "buyAirport",
        barracks: "buyBarracks",
        borderFortifications: "buyBorderFortification",
        borderWalls: "buyBorderWall",
        banks: "buyBank",
        casinos: "buyCasino",
        churches: "buyChurch",
        drydocks: "buyDrydock",
        clinics: "buyClinic",
        factories: "buyFactory",
        foreignMinistries: "buyForeignMinistry",
        forwardOperatingBases: "buyForwardOperatingBase",
        guerillaCamps: "buyGuerillaCamp",
        harbors: "buyHarbor",
        hospitals: "buyHospital",
        intelAgencies: "buyIntelAgency",
        jails: "buyJail",
        laborCamps: "buyLaborCamp",
        prisons: "buyPrison",
        radiationContainmentChambers: "buyRadiationContainmentChamber",
        redLightDistricts: "buyRedLightDistrict",
        rehabilitationFacilities: "buyRehabilitationFacility",
        satellites: "buySatellite",
        schools: "buySchool",
        shipyards: "buyShipyard",
        stadiums: "buyStadium",
        universities: "buyUniversity",
        missileDefenseSystems: "buyMissileDefense",
        munitionsFactories: "buyMunitionsFactory",
        navalAcademies: "buyNavalAcademy",
        navalConstructionYards: "buyNavalConstructionYard",
        officesOfPropaganda: "buyOfficeOfPropaganda",
        policeHeadquarters: "buyPoliceHeadquarters"
    };

    const allImprovements = Object.keys(improvementKeyMapping);

    const defaultImprovementDetails: ImprovementDetails = allImprovements.reduce((acc: ImprovementDetails, key) => {
        acc[key] = "0";
        return acc;
    }, {});

    const [improvementDetails, setImprovementDetails] = useState<ImprovementDetails>({ ...defaultImprovementDetails });
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [purchaseAmounts, setPurchaseAmounts] = useState<{ [key: string]: number }>({});

    // const handleBuyImprovement = async (key: string) => {
    //     const amount = purchaseAmounts[key] || 1;
    //     const improvementKey = improvementKeyMapping[key] || key;

    //     console.log(improvementKey)
    //     if (nationId) {
    //         try {
    //             await buyImprovement(
    //                 nationId,
    //                 improvementKey,
    //                 amount,
    //                 publicClient,
    //                 ImprovementContract1,
    //                 ImprovementContract2,
    //                 ImprovementContract3,
    //                 ImprovementContract4,
    //                 writeContractAsync
    //             );

    //             window.location.reload();
    //         } catch (error) {
    //             console.error("Error purchasing improvement:", error);
    //         }
    //     } else {
    //         console.error("Nation ID is null");
    //     }
    // };

    const handleBuyImprovement = async (key: string) => {
        const amount = purchaseAmounts[key] || 1;
        const improvementKey: string = improvementKeyMapping[key] || key;
    
        // Mapping of improvements to their respective contract and function
        const improvementMappings = {
            ImprovementsContract1: [
                "buyAirport", "buyBarracks", "buyBorderFortification", "buyBorderWall",
                "buyBank", "buyBunker", "buyCasino", "buyChurch", "buyDrydock", "buyClinic", "buyFactory"
            ],
            ImprovementsContract2: [
                "buyForeignMinistry", "buyForwardOperatingBase", "buyGuerillaCamp", "buyHarbor",
                "buyHospital", "buyIntelAgency", "buyJail", "buyLaborCamp"
            ],
            ImprovementsContract3: [
                "buyPrison", "buyRadiationContainmentChamber", "buyRedLightDistrict",
                "buyRehabilitationFacility", "buySatellite", "buySchool", "buyShipyard",
                "buyStadium", "buyUniversity"
            ],
            ImprovementsContract4: [
                "buyMissileDefense", "buyMunitionsFactory", "buyNavalAcademy",
                "buyNavalConstructionYard", "buyOfficeOfPropaganda", "buyPoliceHeadquarters"
            ]
        };
    
        // Identify the correct contract and improvement index
        let selectedContractKey: keyof typeof contractsData | null = null;
        let improvementIndex = -1;
    
        for (const [contractKey, improvements] of Object.entries(improvementMappings)) {
            const index = improvements.indexOf(improvementKey as string);
            if (index !== -1) {
                selectedContractKey = contractKey as keyof typeof contractsData;
                improvementIndex = index + 1; // Improvement IDs start at 1
                break;
            }
        }
    
        if (!selectedContractKey || improvementIndex === -1) {
            console.error(`Improvement "${improvementKey}" not found in any contract mapping.`);
            alert("Invalid improvement selection.");
            return;
        }
    
        // Retrieve contract data
        const contractData = contractsData[selectedContractKey];
        if (!contractData || !contractData.address || !contractData.abi) {
            console.error(`Contract data missing for ${selectedContractKey}`);
            return;
        }
    
        try {
            // Initialize Web3 provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();
    
            // Initialize contract instance
            const contract = new ethers.Contract(contractData.address, contractData.abi as ethers.ContractInterface, signer);
    
            // Encode function call data
            const functionName = `buyImprovement${(selectedContractKey as string).slice(-1)}`;
            const data = contract.interface.encodeFunctionData(functionName, [nationId, improvementIndex, amount]);
    
            // Simulate the transaction
            try {
                const result = await provider.call({
                    to: contract.address,
                    data: data,
                    from: userAddress,
                });
    
                console.log("Transaction Simulation Result:", result);
    
                if (result.startsWith("0x08c379a0")) {
                    const errorMessage = parseRevertReason({ data: result });
                    alert(`Transaction failed: ${errorMessage}`);
                    return;
                }
            } catch (simulationError: any) {
                const errorMessage = parseRevertReason(simulationError);
                console.error("Transaction simulation failed:", errorMessage);
                alert(`Transaction failed: ${errorMessage}`);
                return;
            }
    
            // If the transaction simulation passes, proceed with the actual transaction
            if (nationId) {
                try {
                    await buyImprovement(
                        nationId,
                        improvementKey,
                        amount,
                        publicClient,
                        contractsData.ImprovementsContract1,
                        contractsData.ImprovementsContract2,
                        contractsData.ImprovementsContract3,
                        contractsData.ImprovementsContract4,
                        writeContractAsync
                    );
                    alert("Improvement purchased successfully!");
                    window.location.reload();

                } catch (txError) {
                    console.error("Error purchasing improvement:", txError);
                    if (txError instanceof Error) {
                        alert(`Transaction failed: ${txError.message}`);
                    } else {
                        alert("Transaction failed: Unknown error");
                    }
                }
            } else {
                console.error("Nation ID is null");
                alert("Nation ID is missing.");
            }
        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error("Transaction failed:", errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    };
    

    const fetchImprovementDetails = async () => {
        if (!nationId || !publicClient || !ImprovementContract1 || !ImprovementContract2 || !ImprovementContract3 || !ImprovementContract4 || !TreasuryContract) return;

        try {
            const improvements = await getImprovements(nationId, ImprovementContract1, ImprovementContract2, ImprovementContract3, ImprovementContract4, publicClient) || [];
            const warBuckBalance = await checkBalance(nationId, publicClient, TreasuryContract);

            const improvementDetails: ImprovementDetails = { ...defaultImprovementDetails };

            improvements.forEach(improvement => {
                const key = improvement.name.charAt(0).toLowerCase() + improvement.name.slice(1).replace(/\s+/g, '');
                improvementDetails[key] = improvement.improvementCount.toString();
            });

            improvementDetails["warBucksBalance"] = (warBuckBalance / BigInt(10 ** 18)).toLocaleString();

            setImprovementDetails(improvementDetails);
        } catch (error) {
            console.error("Error fetching infrastructure details:", error);
        }
    };

    useEffect(() => {
        fetchImprovementDetails();
    }, [nationId, publicClient, ImprovementContract1, ImprovementContract2, ImprovementContract3, ImprovementContract4, TreasuryContract, refreshTrigger]);

    return (
        <div className={`p-6 border-l-4 ${theme === 'dark' ? 'bg-gray-800 text-white border-green-400' : 'bg-gray-100 text-black border-green-500'}`}>
            <h3 className="text-lg font-semibold">Improvement Details</h3>

            <div className="mb-4">
                <strong>Warbucks Balance:</strong> {improvementDetails["warBucksBalance"] || "0"}
            </div>

            <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                    <tr className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                        <th className="border border-gray-300 px-4 py-2">Category</th>
                        <th className="border border-gray-300 px-4 py-2">Value</th>
                        <th className="border border-gray-300 px-4 py-2">Amount to Buy (1-5)</th>
                        <th className="border border-gray-300 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(improvementDetails).filter(([key]) => key !== "warBucksBalance").map(([key, value]) => (
                        <tr key={key} className="text-center">
                            <td className="border border-gray-300 px-4 py-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                            <td className="border border-gray-300 px-4 py-2">{value}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={purchaseAmounts[key] || 1}
                                    onChange={(e) => setPurchaseAmounts({ ...purchaseAmounts, [key]: Number(e.target.value) })}
                                    className="w-16 p-1 border rounded"
                                />
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    onClick={() => handleBuyImprovement(key)}
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    Buy
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BuyImprovement;
