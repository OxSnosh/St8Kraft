"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { buyImprovement, deleteImprovement } from "~~/utils/improvements";
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
        banks: "buyBank",
        barracks: "buyBarracks",
        borderFortifications: "buyBorderFortification",
        borderWalls: "buyBorderWall",
        bunker: "buyBunker",
        casinos: "buyCasino",
        churches: "buyChurch",
        clinics: "buyClinic",
        drydocks: "buyDrydock",
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
        const improvementKey: string = improvementKeyMapping[key];

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
                setRefreshTrigger(!refreshTrigger);
            } catch (txError) {
                console.error("Error purchasing improvement:", txError);
                alert("Transaction failed: Unable to purchase improvement.");
            }
        } else {
            alert("Nation ID is missing.");
        }
    };

    const handleDeleteImprovement = async (key: string) => {
        const amount = purchaseAmounts[key] || 1;
        const improvementKey: string = improvementKeyMapping[key]?.replace("buy", "delete") || key;

        if (nationId) {
            try {
                await deleteImprovement(
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
                alert("Improvement deleted successfully!");
                window.location.reload();
            } catch (txError) {
                console.error("Error deleting improvement:", txError);
                alert("Transaction failed: Unable to delete improvement.");
            }
        } else {
            alert("Nation ID is missing.");
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
        <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">🏗️ Manage Improvements</h2>

            {/* Warbucks Balance */}
            <div className="text-lg text-center font-semibold bg-base-200 p-3 rounded-lg shadow-md mb-6">
                Warbucks Balance: {improvementDetails["warBucksBalance"] || "0"}
            </div>

            {/* Improvements Table */}
            <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
                <thead className="bg-primary text-primary-content">
                    <tr>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Owned</th>
                        <th className="p-3 text-left">Amount (1-5)</th>
                        <th className="p-3 text-left">Buy</th>
                        <th className="p-3 text-left">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(improvementDetails)
                        .filter(([key]) => key !== "warBucksBalance")
                        .map(([key, value]) => (
                            <tr key={key} className="border-b border-neutral">
                                <td className="p-3 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                                <td className="p-3">{value}</td>
                                <td className="p-3">
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={purchaseAmounts[key] || 1}
                                        onChange={(e) => setPurchaseAmounts({ ...purchaseAmounts, [key]: Number(e.target.value) })}
                                        className="input input-bordered w-16 bg-base-100 text-base-content"
                                    />
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleBuyImprovement(key)}
                                        className="btn btn-success w-full"
                                    >
                                        Buy
                                    </button>
                                </td>
                                <td className="p-3">
                                    {parseInt(value) > 0 && (
                                        <button
                                            onClick={() => handleDeleteImprovement(key)}
                                            className="btn btn-error w-full"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );    
};

export default BuyImprovement;
