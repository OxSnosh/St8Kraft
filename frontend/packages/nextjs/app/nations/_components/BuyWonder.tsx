"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { getWonders, buyWonder } from "~~/utils/wonders";
import { checkBalance } from "~~/utils/treasury";
import { useTheme } from "next-themes";
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';
import { contracts } from "~~/utils/scaffold-eth/contract";

const BuyWonder = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const WondersContract1 = contractsData?.WondersContract1;
    const WondersContract2 = contractsData?.WondersContract2;
    const WondersContract3 = contractsData?.WondersContract3;
    const WondersContract4 = contractsData?.WondersContract4;
    const TreasuryContract = contractsData?.TreasuryContract;
    const { writeContractAsync } = useWriteContract();

    const wonderKeyMapping = {
        agricultureDevelopmentProgram: "buyAgricultureDevelopmentProgram",
        airDefenseNetwork: "buyAirDefenseNetwork",
        centralIntelligenceAgency: "buyCentralIntelligenceAgency",
        disasterReliefAgency: "buyDisasterReliefAgency",
        empWeaponization: "buyEmpWeaponization",
        falloutShelterSystem: "buyFalloutShelterSystem",
        federalAidCommission: "buyFederalAidCommission",
        federalReserve: "buyFederalReserve",
        foreignAirForceBase: "buyForeignAirForceBase",
        foreignArmyBase: "buyForeignArmyBase",
        foreignNavalBase: "buyForeignNavalBase",
        greatMonument: "buyGreatMonument",
        greatTemple: "buyGreatTemple",
        greatUniversity: "buyGreatUniversity",
        hiddenNuclearMissileSilos: "buyHiddenNuclearMissileSilo",
        interCeptorMissileSystem: "buyInterceptorMissileSystem",
        internet: "buyInternet",
        interstateSystem: "buyInterstateSystem",
        manhattanProject: "buyManhattanProject",
        miningIndustryConsortium: "buyMiningIndustryConsortium",
        movieIndustry: "buyMovieIndustry",
        nationalCemetary: "buyNationalCemetary",
        nationalEnvironmentalOffice: "buyNationalEnvironmentalOffice",
        nationalResearchLab: "buyNationalResearchLab",
        nationalWarMemorial: "buyNationalWarMemorial",
        nuclearPowerPlant: "buyNuclearPowerPlant",
        pentagon: "buyPentagon",
        politicalLobbyist: "buyPoliticalLobbyist",
        scientificDevelopmentCenter: "buyScientificDevelopmentCenter",
        socialSecuritySystem: "buySocialSecuritySystem",
        spaceProgram: "buySpaceProgram",
        stockMarket: "buyStockMarket",
        strategicDefenseInitiative: "buyStrategicDefenseInitiative",
        superiorLogisticalSupport: "buySuperiorLogisticalSupport",
        universalHealthCare: "buyUniversalHealthCare",
        weaponsResearchCenter: "buyWeaponsResearchCenter"
    };

    const [wonderDetails, setWonderDetails] = useState<{ [key: string]: any }>({});

    // const handleBuyWonder = async (key: keyof typeof wonderKeyMapping) => {
    //     const wonderKey = wonderKeyMapping[key] || key;
    
    //     if (!nationId) {
    //         console.error("Nation ID is null");
    //         alert("Nation ID is missing.");
    //         return;
    //     }
    
    //     try {
    //         // Directly call buyWonder, just like your working function
    //         await buyWonder(
    //             nationId,
    //             wonderKey,
    //             publicClient,
    //             WondersContract1,
    //             WondersContract2,
    //             WondersContract3,
    //             WondersContract4,
    //             writeContractAsync
    //         );
    
    //         alert("Wonder purchased successfully!");
    //         window.location.reload();
    //     } catch (error) {
    //         console.error("Error purchasing wonder:", error);
    //         alert(`Transaction failed: ${(error as any).message || "Unknown error"}`);
    //     }
    // };

    const handleBuyWonder = async (key: keyof typeof wonderKeyMapping) => {
        console.log("Buying wonder:", key);
        
        const wonderKey = wonderKeyMapping[key] || key;
        
        console.log("Wonder key:", wonderKey);

        // Mapping of contracts to their respective wonder-buying functions
        const wonderMappings = {
            WonderContract1: [
                "buyAgriculturalDevelopmentProgram", "buyAntiAirDefenseNetwork",
                "buyCentralIntelligenceAgency", "buyDisasterReliefAgency",
                "buyEmpWeaponization", "buyFalloutShelterSystem", "buyFederalAidCommission",
                "buyFederalReserve", "buyForeignAirforceBase", "buyForeignArmyBase",
                "buyForeignNavalBase"
            ],
            WonderContract2: [
                "buyGreatMonument", "buyGreatTemple", "buyGreatUniversity",
                "buyHiddenNuclearMissileSilo", "buyInterceptorMissileSystem",
                "buyInternet", "buyInterstateSystem", "buyManhattanProject",
                "buyMiningIndustryConsortium"
            ],
            WonderContract3: [
                "buyMovieIndustry", "buyNationalCemetery", "buyNationalEnvironmentalOffice",
                "buyNationalResearchLab", "buyNationalWarMemorial", "buyNuclearPowerPlant",
                "buyPentagon", "buyPoliticalLobbyists", "buyScientificDevelopmentCenter"
            ],
            WonderContract4: [
                "buySocialSecuritySystem", "buySpaceProgram", "buyStockMarket",
                "buyStrategicDefenseInitiative", "buySuperiorLogisticalSupport",
                "buyUniversalHealthcare", "buyWeaponsResearchCenter"
            ]
        };
    
        // Identify which contract and function to use
        let selectedContractKey = null;
        let wonderIndex = -1;
        
        for (const [contractKey, wonders] of Object.entries(wonderMappings)) {
            const index = wonders.indexOf(wonderKey);
            if (index !== -1) {
                selectedContractKey = contractKey;
                wonderIndex = index + 1; // Contract functions typically start at ID 1
                break;
            }
        }
    
        console.log("Selected contract key:", selectedContractKey);
        console.log("Wonder index:", wonderIndex);

        if (!selectedContractKey || wonderIndex === -1) {
            console.error(`Wonder key "${wonderKey}" not found in any contract mapping.`);
            alert("Invalid wonder selection.");
            return;
        }
        
    
        if (!contractsData) {
            console.error("contractsData is undefined. Wait until it's available.");
            return;
        }
        
        let contractData;
        
        if (selectedContractKey === "WonderContract1") {
            console.log("Contract 1");
            contractData = contractsData?.WondersContract1;
        } else if (selectedContractKey === "WonderContract2") {
            console.log("Contract 2");
            contractData = contractsData?.WondersContract2;
        } else if (selectedContractKey === "WonderContract3") {
            console.log("Contract 3");
            contractData = contractsData?.WondersContract3;
        } else if (selectedContractKey === "WonderContract4") {
            console.log("Contract 4");
            contractData = contractsData?.WondersContract4;
        }
        
        console.log("Contract Data:", contractData);
        
        if (!contractData || !contractData.address || !contractData.abi) {
            console.error(`Contract data missing for ${selectedContractKey}`);
            return;
        }
    

        try {
            // Initialize Web3 Provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();
    
            // Initialize the correct contract
            const contract = new ethers.Contract(contractData.address, contractData.abi as ethers.ContractInterface, signer);
    
            // Encode function call data
            const data = contract.interface.encodeFunctionData(`buyWonder${selectedContractKey.slice(-1)}`, [nationId, wonderIndex]);

            console.log("Transaction Data:", data);
    
            // Simulate the transaction before sending
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
                    await buyWonder(
                        nationId,
                        wonderKey,
                        publicClient,
                        contractsData.WonderContract1,
                        contractsData.WonderContract2,
                        contractsData.WonderContract3,
                        contractsData.WonderContract4,
                        writeContractAsync
                    );
                    alert("Wonder purchased successfully!");
                    window.location.reload();
                } catch (txError) {
                    console.error("Error purchasing wonder:", txError);
                    alert(`Transaction failed: ${(txError as any).message || "Unknown error"}`);
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
    

    const fetchWonderDetails = async () => {
        if (!nationId || !publicClient || !WondersContract1 || !WondersContract2 || !WondersContract3 || !WondersContract4 || !TreasuryContract) return;

        try {
            const wonders = await getWonders(nationId, WondersContract1, WondersContract2, WondersContract3, WondersContract4, publicClient) || [];
            const warBuckBalance = await checkBalance(nationId, publicClient, TreasuryContract);

            const details: { [key: string]: any, warBucksBalance?: string } = {};

            wonders.forEach(wonder => {
                const key = wonder.name.charAt(0).toLowerCase() + wonder.name.slice(1).replace(/\s+/g, '');
                details[key] = true;
            });

            details["warBucksBalance"] = (warBuckBalance / BigInt(10 ** 18)).toLocaleString();

            setWonderDetails(details);
        } catch (error) {
            console.error("Error fetching wonder details:", error);
        }
    };

    useEffect(() => {
        fetchWonderDetails();
    }, [nationId, publicClient, WondersContract1, WondersContract2, WondersContract3, WondersContract4, TreasuryContract]);

    return (
        <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">🏛️ Wonder Details</h2>
    
            {/* Warbucks Balance */}
            <div className="text-lg text-center font-semibold bg-base-200 p-3 rounded-lg shadow-md mb-6">
                Warbucks Balance: {wonderDetails["warBucksBalance"] || "0"}
            </div>
    
            {/* Wonders Table */}
            <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
                <thead className="bg-primary text-primary-content">
                    <tr>
                        <th className="p-3 text-left">Wonder</th>
                        <th className="p-3 text-left">Owned Status</th>
                        <th className="p-3 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(wonderKeyMapping).map((key) => (
                        <tr key={key} className="border-b border-neutral">
                            <td className="p-3 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                            <td className="p-3">{wonderDetails[key] ? "Owned" : "Not Owned"}</td>
                            <td className="p-3">
                                <button
                                    onClick={() => handleBuyWonder(key as keyof typeof wonderKeyMapping)}
                                    disabled={wonderDetails[key]}
                                    className={`btn w-full ${wonderDetails[key] ? 'btn-disabled' : 'btn-success'}`}
                                >
                                    {wonderDetails[key] ? "Owned" : "Buy"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BuyWonder;