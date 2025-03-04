"use client";

import React, { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "../../../utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { parseRevertReason } from '../../../utils/errorHandling';
import {
    buyAh1Cobra, buyAh64Apache, buyBristolBlenheim, buyB52Mitchell, buyB17gFlyingFortress,
    buyB52Stratofortress, buyB2Spirit, buyB1bLancer, buyTupolevTu160,
    scrapAh1Cobra, scrapAh64Apache, scrapBristolBlenheim, scrapB52Mitchell,
    scrapB17gFlyingFortress, scrapB52Stratofortress, scrapB2Spirit,
    scrapB1bLancer, scrapTupolevTu160, getAh1CobraCount, getAh64ApacheCount,
    getBristolBlenheimCount, getB52MitchellCount, getB17gFlyingFortressCount,
    getB52StratofortressCount, getB2SpiritCount, getB1bLancerCount,
    getTupolevTu160Count
} from '../../../utils/bombers';
import { useTheme } from "next-themes";

const BuyBombers = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const { writeContractAsync } = useWriteContract();

    const bombersList = [
        { key: "ah1Cobra", buy: buyAh1Cobra, scrap: scrapAh1Cobra },
        { key: "ah64Apache", buy: buyAh64Apache, scrap: scrapAh64Apache },
        { key: "bristolBlenheim", buy: buyBristolBlenheim, scrap: scrapBristolBlenheim },
        { key: "b52Mitchell", buy: buyB52Mitchell, scrap: scrapB52Mitchell },
        { key: "b17gFlyingFortress", buy: buyB17gFlyingFortress, scrap: scrapB17gFlyingFortress },
        { key: "b52Stratofortress", buy: buyB52Stratofortress, scrap: scrapB52Stratofortress },
        { key: "b2Spirit", buy: buyB2Spirit, scrap: scrapB2Spirit },
        { key: "b1bLancer", buy: buyB1bLancer, scrap: scrapB1bLancer },
        { key: "tupolevTu160", buy: buyTupolevTu160, scrap: scrapTupolevTu160 },
    ];

    const [bomberDetails, setBomberDetails] = useState<{ [key: string]: string }>({});
    const [purchaseAmounts, setPurchaseAmounts] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const fetchBomberDetails = async () => {
            if (!nationId || !publicClient || !contractsData.BombersContract) return;
    
            try {
                const details = await Promise.all(
                    bombersList.map(async (bomber) => {
                        // Call getter functions instead of buy functions
                        const getCountFunction = {
                            ah1Cobra: getAh1CobraCount,
                            ah64Apache: getAh64ApacheCount,
                            bristolBlenheim: getBristolBlenheimCount,
                            b52Mitchell: getB52MitchellCount,
                            b17gFlyingFortress: getB17gFlyingFortressCount,
                            b52Stratofortress: getB52StratofortressCount,
                            b2Spirit: getB2SpiritCount,
                            b1bLancer: getB1bLancerCount,
                            tupolevTu160: getTupolevTu160Count,
                        }[bomber.key];
    
                        if (!getCountFunction) return { key: bomber.key, count: "0" };
    
                        const count = await getCountFunction(nationId, publicClient, contractsData.BombersContract);

                        return { key: bomber.key, count: count.toString() };
                    })
                );
    
                const detailsObject = details.reduce((acc, { key, count }) => {
                    acc[key] = count;
                    return acc;
                }, {} as { [key: string]: string });
    
                setBomberDetails(detailsObject);
            } catch (error) {
                console.error("Error fetching bomber details:", error);
            }
        };
    
        fetchBomberDetails();
    }, [nationId, publicClient, contractsData]);
    

    const handleTransaction = async (key: string, action: "buy" | "scrap") => {
        const amount = purchaseAmounts[key] || 1;
        if (!nationId) {
            console.error("Nation ID is null");
            return;
        }
    
        const bomber = bombersList.find((b) => b.key === key);
        if (!bomber) {
            console.error("Invalid bomber key:", key);
            return;
        }
    
        // Determine which marketplace to use
        const marketplace = ["b52Stratofortress", "b2Spirit", "b1bLancer", "tupolevTu160"].includes(key)
            ? contractsData.BombersMarketplace2
            : contractsData.BombersMarketplace1;
    
        try {
            if (action === "buy") {
                await bomber.buy(nationId, amount, publicClient, marketplace, writeContractAsync);
            } else {
                await bomber.scrap(nationId, amount, publicClient, contractsData.BombersContract, writeContractAsync);
            }
    
            alert(`Successfully ${action === "buy" ? "purchased" : "scrapped"} ${amount} ${key}`);
        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error(`Transaction failed: ${errorMessage}`);
            alert(`Transaction failed: ${errorMessage}`);
        }
    };

    return (
        <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">✈️ Bomber Details</h2>

            <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
                <thead className="bg-primary text-primary-content">
                    <tr>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Available</th>
                        <th className="p-3 text-left">Amount</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bombersList.map(({ key }) => (
                        <tr key={key} className="border-b border-neutral">
                            <td className="p-3 capitalize">{key.replace(/([A-Z])/g, " $1")}</td>
                            <td className="p-3">{bomberDetails[key] || "0"}</td>
                            <td className="p-3">
                                <input
                                    type="number"
                                    value={purchaseAmounts[key] || 1}
                                    onChange={(e) =>
                                        setPurchaseAmounts({ ...purchaseAmounts, [key]: Number(e.target.value) })
                                    }
                                    className="input input-bordered w-16 bg-base-100 text-base-content text-center"
                                />
                            </td>
                            <td className="p-3 flex gap-2">
                                <button
                                    onClick={() => handleTransaction(key, "buy")}
                                    className="btn btn-success"
                                >
                                    Buy
                                </button>
                                <button
                                    onClick={() => handleTransaction(key, "scrap")}
                                    className="btn btn-error"
                                >
                                    Scrap
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BuyBombers;
