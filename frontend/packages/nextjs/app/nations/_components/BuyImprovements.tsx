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

    const handleBuyImprovement = async (key: string) => {
        const amount = purchaseAmounts[key] || 1;
        const improvementKey = improvementKeyMapping[key] || key;

        if (nationId) {
            try {
                await buyImprovement(
                    nationId,
                    improvementKey,
                    amount,
                    publicClient,
                    ImprovementContract1,
                    ImprovementContract2,
                    ImprovementContract3,
                    ImprovementContract4,
                    writeContractAsync
                );

                window.location.reload();
            } catch (error) {
                console.error("Error purchasing improvement:", error);
            }
        } else {
            console.error("Nation ID is null");
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
