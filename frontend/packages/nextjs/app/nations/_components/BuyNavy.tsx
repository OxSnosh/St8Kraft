"use client";

import React, { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "../../../utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { 
    buyCorvette, buyLandingShip, buyBattleship, buyCruiser, 
    buyFrigate, buyDestroyer, buySubmarine, buyAircraftCarrier,
    getCorvetteCount, getLandingShipCount, getBattleshipCount, getCruiserCount, 
    getFrigateCount, getDestroyerCount, getSubmarineCount, getAircraftCarrierCount,
    scrapCorvette, scrapLandingShip, scrapBattleship, scrapCruiser, 
    scrapFrigate, scrapDestroyer, scrapSubmarine, scrapAircraftCarrier
} from '../../../utils/navy';
import { useTheme } from "next-themes";
import { ethers } from "ethers";

const BuyNavy = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const NavyContract1 = contractsData?.NavyContract;
    const NavyContract2 = contractsData?.NavyContract2;
    const { writeContractAsync } = useWriteContract();

    const navyList = [
        { key: "corvette", buy: buyCorvette, scrap: scrapCorvette },
        { key: "landingShip", buy: buyLandingShip, scrap: scrapLandingShip },
        { key: "battleship", buy: buyBattleship, scrap: scrapBattleship },
        { key: "cruiser", buy: buyCruiser, scrap: scrapCruiser },
        { key: "frigate", buy: buyFrigate, scrap: scrapFrigate },
        { key: "destroyer", buy: buyDestroyer, scrap: scrapDestroyer },
        { key: "submarine", buy: buySubmarine, scrap: scrapSubmarine },
        { key: "aircraftCarrier", buy: buyAircraftCarrier, scrap: scrapAircraftCarrier },
    ];

    const [navyDetails, setNavyDetails] = useState<{ [key: string]: string }>({});
    const [purchaseAmounts, setPurchaseAmounts] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const fetchNavyDetails = async () => {
            if (!nationId || !publicClient || !NavyContract1 || !NavyContract2) return;

            try {
                const details = await Promise.all(
                    navyList.map(async (ship) => {
                        const getCountFunction = {
                            corvette: getCorvetteCount,
                            landingShip: getLandingShipCount,
                            battleship: getBattleshipCount,
                            cruiser: getCruiserCount,
                            frigate: getFrigateCount,
                            destroyer: getDestroyerCount,
                            submarine: getSubmarineCount,
                            aircraftCarrier: getAircraftCarrierCount,
                        }[ship.key];

                        if (!getCountFunction) return { key: ship.key, count: "0" };

                        const count = await getCountFunction(nationId, publicClient, 
                            ["frigate", "destroyer", "submarine", "aircraftCarrier"].includes(ship.key) 
                                ? NavyContract2 
                                : NavyContract1
                        );

                        return { key: ship.key, count: count.toString() };
                    })
                );

                const detailsObject = details.reduce((acc, { key, count }) => {
                    acc[key] = count;
                    return acc;
                }, {} as { [key: string]: string });

                setNavyDetails(detailsObject);
            } catch (error) {
                console.error("Error fetching navy details:", error);
            }
        };

        fetchNavyDetails();
    }, [nationId, publicClient, NavyContract1, NavyContract2]);

    const handleTransaction = async (key: string, action: "buy" | "scrap") => {
        const amount = purchaseAmounts[key] || 1;
        if (!nationId) {
            console.error("Nation ID is null");
            return;
        }

        const navyShip = navyList.find((ship) => ship.key === key);
        if (!navyShip) {
            console.error("Invalid navy key:", key);
            return;
        }

        // Determine contract: First 4 use NavyContract1, Last 4 use NavyContract2
        const marketplace = ["frigate", "destroyer", "submarine", "aircraftCarrier"].includes(key)
            ? NavyContract2
            : NavyContract1;

        try {
            if (action === "buy") {
                await navyShip.buy(nationId, amount, publicClient, marketplace, writeContractAsync);
            } else {
                await navyShip.scrap(nationId, amount, publicClient, marketplace, writeContractAsync);
            }

            alert(`Successfully ${action === "buy" ? "purchased" : "scrapped"} ${amount} ${key}`);
        } catch (error: any) {
            console.error(`Transaction failed:`, error);
            alert(`Transaction failed: ${error.message || "Unknown error"}`);
        }
    };

    return (
        <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">⚓ Navy Details</h2>

            {/* Navy Table */}
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
                    {navyList.map(({ key }) => (
                        <tr key={key} className="border-b border-neutral">
                            <td className="p-3 capitalize">{key.replace(/([A-Z])/g, " $1")}</td>
                            <td className="p-3">{navyDetails[key] || "0"}</td>
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

export default BuyNavy;
