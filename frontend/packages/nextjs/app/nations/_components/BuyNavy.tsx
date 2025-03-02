"use client";

import React, { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "../../../utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { checkBalance } from "../../../utils/treasury";
import {
    buyCorvette,
    buyLandingShip,
    buyBattleship,
    buyCruiser,
    buyFrigate,
    buyDestroyer,
    buySubmarine,
    buyAircraftCarrier,
    getCorvetteCount,
    getLandingShipCount,
    getBattleshipCount,
    getCruiserCount,
    getFrigateCount,
    getDestroyerCount,
    getSubmarineCount,
    getAircraftCarrierCount,
} from '../../../utils/navy';
import { useTheme } from "next-themes";
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';

const BuyNavy = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const NavyContract1 = contractsData?.NavyContract;
    const NavyContract2 = contractsData?.NavyContract2;
    const TreasuryContract = contractsData?.TreasuryContract;
    const { writeContractAsync } = useWriteContract();

    interface NavyDetails {
        [key: string]: string;
    }

    const navyKeyMapping: { [key: string]: string } = {
        corvette: "buyCorvette",
        landingShip: "buyLandingShip",
        battleship: "buyBattleship",
        cruiser: "buyCruiser",
        frigate: "buyFrigate",
        destroyer: "buyDestroyer",
        submarine: "buySubmarine",
        aircraftCarrier: "buyAircraftCarrier",
    };

    const allNavy = Object.keys(navyKeyMapping);

    const defaultNavyDetails: NavyDetails = { 
        corvette: "0",
        landingShip: "0",
        battleship: "0",
        cruiser: "0",
        frigate: "0",
        destroyer: "0",
        submarine: "0",
        aircraftCarrier: "0",
    };

    const [navyDetails, setNavyDetails] = useState<NavyDetails>({ ...defaultNavyDetails });
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [purchaseAmounts, setPurchaseAmounts] = useState<{ [key: string]: number }>({});

    // const handleBuyNavy = async (key: string) => {
    //     const amount = purchaseAmounts[key] || 1;
    //     const navyKey = navyKeyMapping[key] || key;

    //     if (!nationId) {
    //         console.error("Nation ID is null");
    //         return;
    //     }

    //     console.log("Buying navy:", navyKey, amount);

    //     if (navyKey == "buyCorvette") {
    //         await buyCorvette(nationId, amount, publicClient, NavyContract1, writeContractAsync);
    //     } else if (navyKey == "buyLandingShip") {
    //         await buyLandingShip(nationId, amount, publicClient, NavyContract1, writeContractAsync);
    //     } else if (navyKey == "buyBattleship") {
    //         await buyBattleship(nationId, amount, publicClient, NavyContract1, writeContractAsync);
    //     } else if (navyKey == "buyCruiser") {
    //         await buyCruiser(nationId, amount, publicClient, NavyContract1, writeContractAsync);
    //     } else if (navyKey == "buyFrigate") {
    //         await buyFrigate(nationId, amount, publicClient, NavyContract2, writeContractAsync);
    //     } else if (navyKey == "buyDestroyer") {
    //         await buyDestroyer(nationId, amount, publicClient, NavyContract2, writeContractAsync);
    //     } else if (navyKey == "buySubmarine") {
    //         await buySubmarine(nationId, amount, publicClient, NavyContract2, writeContractAsync);
    //     } else if (navyKey == "buyAircraftCarrier") {
    //         await buyAircraftCarrier(nationId, amount, publicClient, NavyContract2, writeContractAsync);
    //     } else {
    //         console.error("Invalid navy key");
    //     }
    // }

    const handleBuyNavy = async (key : string) => {
                    
        const amount = purchaseAmounts[key] || 1;
        const navyKey = navyKeyMapping[key] || key;

        if (!nationId) {
            console.error("Nation ID is null");
            return;
        }

        console.log("Buying navy:", navyKey, amount);

        const contractData1 = contractsData.NavyContract;
        const abi1 = contractData1.abi;
        
        if (!contractData1.address || !abi1) {
            console.error("Contract address or ABI is missing");
            return;
        }

        const contractData2 = contractsData.NavyContract2;
        const abi2 = contractData2.abi;

        if (!contractData2.address || !abi2) {
            console.error("Contract address or ABI is missing");
            return;
        }
        
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();

            const contract1 = new ethers.Contract(contractData1.address, abi1 as ethers.ContractInterface, signer);
            const contract2 = new ethers.Contract(contractData2.address, abi2 as ethers.ContractInterface, signer);

            let data;

            if (navyKey == "buyCorvette") {
                data = contract1.interface.encodeFunctionData("buyCorvette", [
                    Number(amount),
                    nationId,
                ]);
            } else if (navyKey == "buyLandingShip") {
                data = contract1.interface.encodeFunctionData("buyLandingShip", [
                    Number(amount),
                    nationId,
                ]);
            } else if (navyKey == "buyBattleship") {
                data = contract1.interface.encodeFunctionData("buyBattleship", [
                    Number(amount),
                    nationId,
                ]);
            } else if (navyKey == "buyCruiser") {
                data = contract1.interface.encodeFunctionData("buyCruiser", [
                    Number(amount),
                    nationId,
                ]);
            } else if (navyKey == "buyFrigate") {
                data = contract2.interface.encodeFunctionData("buyFrigate", [
                    Number(amount),
                    nationId,
                ]);
            } else if (navyKey == "buyDestroyer") {
                data = contract2.interface.encodeFunctionData("buyDestroyer", [
                    Number(amount),
                    nationId,
                ]);
            } else if (navyKey == "buySubmarine") {
                data = contract2.interface.encodeFunctionData("buySubmarine", [
                    Number(amount),
                    nationId,
                ]);
            } else if (navyKey == "buyAircraftCarrier") {
                data = contract2.interface.encodeFunctionData("buyAircraftCarrier", [
                    Number(amount),
                    nationId,
                ]);
            } else {
                console.error("Invalid navy key");
            }

            try {

                let result 

                if (navyKey == "buyCorvette" || navyKey == "buyLandingShip" || navyKey == "buyBattleship" || navyKey == "buyCruiser") {

                    result = await provider.call({
                        to: contract1.address,
                        data: data,
                        from: userAddress,
                    });

                } else {
                    
                    result = await provider.call({
                        to: contract2.address,
                        data: data,
                        from: userAddress,
                    });

                }

                console.log("Transaction Simulation Result:", result);

                if (result.startsWith("0x08c379a0")) {
                    const errorMessage = parseRevertReason({ data: result });
                    alert(`Transaction failed: ${errorMessage}`);
                    return;
                }

            } catch (error: any) {
                const errorMessage = parseRevertReason(error);
                console.error("Transaction simulation failed:", errorMessage);
                alert(`Transaction failed: ${errorMessage}`);
                return;            
            }

            if (navyKey == "buyCorvette") {
                await buyCorvette(nationId, amount, publicClient, NavyContract1, writeContractAsync);
            } else if (navyKey == "buyLandingShip") {
                await buyLandingShip(nationId, amount, publicClient, NavyContract1, writeContractAsync);
            } else if (navyKey == "buyBattleship") {
                await buyBattleship(nationId, amount, publicClient, NavyContract1, writeContractAsync);
            } else if (navyKey == "buyCruiser") {
                await buyCruiser(nationId, amount, publicClient, NavyContract1, writeContractAsync);
            } else if (navyKey == "buyFrigate") {
                await buyFrigate(nationId, amount, publicClient, NavyContract2, writeContractAsync);
            } else if (navyKey == "buyDestroyer") {
                await buyDestroyer(nationId, amount, publicClient, NavyContract2, writeContractAsync);
            } else if (navyKey == "buySubmarine") {
                await buySubmarine(nationId, amount, publicClient, NavyContract2, writeContractAsync);
            } else if (navyKey == "buyAircraftCarrier") {
                await buyAircraftCarrier(nationId, amount, publicClient, NavyContract2, writeContractAsync);
            } else {
                console.error("Invalid navy key");
            }
            alert("Navy purchased successfully!");
            
        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error("Transaction failed:", errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    }

    const fetchNavyDetails = async () => {
        if (!nationId || !publicClient || !NavyContract1 || !NavyContract2) return;

        try {

            const corvetteCount = await getCorvetteCount(nationId, publicClient, NavyContract1);
            const landingShipCount = await getLandingShipCount(nationId, publicClient, NavyContract1);
            const battleshipCount = await getBattleshipCount(nationId, publicClient, NavyContract1);
            const cruiserCount = await getCruiserCount(nationId, publicClient, NavyContract1);
            const frigateCount = await getFrigateCount(nationId, publicClient, NavyContract2);
            const destroyerCount = await getDestroyerCount(nationId, publicClient, NavyContract2);
            const submarineCount = await getSubmarineCount(nationId, publicClient, NavyContract2);
            const aircraftCarrierCount = await getAircraftCarrierCount(nationId, publicClient, NavyContract2);

            const navyDetails: NavyDetails = {
                corvette: corvetteCount.toString(),
                landingShip: landingShipCount.toString(),
                battleship: battleshipCount.toString(),
                cruiser: cruiserCount.toString(),
                frigate: frigateCount.toString(),
                destroyer: destroyerCount.toString(),
                submarine: submarineCount.toString(),
                aircraftCarrier: aircraftCarrierCount.toString(),
            };

            setNavyDetails(navyDetails);
        } catch (error) {
            console.error("Error fetching fighter details:", error);
        }
    }

    useEffect(() => {
        fetchNavyDetails();
    }, [nationId, publicClient, NavyContract1, NavyContract2, refreshTrigger]);

    return (
        <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">⚓ Navy Details</h2>
    
            {/* Navy Table */}
            <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
                <thead className="bg-primary text-primary-content">
                    <tr>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Value</th>
                        <th className="p-3 text-left">Amount to Buy</th>
                        <th className="p-3 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(navyDetails).filter(([key]) => key !== "warBucksBalance").map(([key, value]) => (
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
                                    className="input input-bordered w-16 bg-base-100 text-base-content text-center"
                                />
                            </td>
                            <td className="p-3">
                                <button
                                    onClick={() => handleBuyNavy(key)}
                                    className="btn btn-success"
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

export default BuyNavy;