"use client";

import React, { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "../../../utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { checkBalance } from "../../../utils/treasury";
import {
    buyAh1Cobra,
    buyAh64Apache,
    buyBristolBlenheim,
    buyB52Mitchell,
    buyB17gFlyingFortress,
    buyB52Stratofortress,
    buyB2Spirit,
    buyB1bLancer,
    buyTupolevTu160,
    getAh1CobraCount,
    getAh64ApacheCount,
    getBristolBlenheimCount,
    getB52MitchellCount,
    getB17gFlyingFortressCount,
    getB52StratofortressCount,
    getB2SpiritCount,
    getB1bLancerCount,
    getTupolevTu160Count
} from '../../../utils/bombers';
import { useTheme } from "next-themes";
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';


const BuyBombers = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const BombersContract = contractsData?.BombersContract;
    const BombersMarketplace1 = contractsData?.BombersMarketplace1;
    const BombersMarketplace2 = contractsData?.BombersMarketplace2;
    const TreasuryContract = contractsData?.TreasuryContract;
    const { writeContractAsync } = useWriteContract();

    interface BomberDetails {
        [key: string]: string;
    }

    const bomberKeyMapping: { [key: string]: string } = {
        ah1Cobra: "buyAh1Cobra",
        ah64Apache: "buyAh64Apache",
        bristolBlenheim: "buyBristolBlenheim",
        b52Mitchell: "buyB52Mitchell",
        b17gFlyingFortress: "buyB17gFlyingFortress",
        b52Stratofortress: "buyB52Stratofortress",
        b2Spirit: "buyB2Spirit",
        b1bLancer: "buyB1bLancer",
        tupolevTu160: "buyTupolevTu160",
    };

    const allBombers = Object.keys(bomberKeyMapping);

    const defaultBombersDetails: BomberDetails = { 
        ah1Cobra: "0",
        ah64Apache: "0",
        bristolBlenheim: "0",
        b52Mitchell: "0",
        b17gFlyingFortress: "0",
        b52Stratofortress: "0",
        b2Spirit: "0",
        b1bLancer: "0",
        tupolevTu160: "0",
    };

    const [bomberDetails, setBomberDetails] = useState<BomberDetails>({ ...defaultBombersDetails });
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [purchaseAmounts, setPurchaseAmounts] = useState<{ [key: string]: number }>({});

    // const handleBuyBombers = async (key: string) => {
    //     const amount = purchaseAmounts[key] || 1;
    //     const bomberKey = bomberKeyMapping[key] || key;

    //     if (!nationId) {
    //         console.error("Nation ID is null");
    //         return;
    //     }

    //     console.log("Buying bombers:", bomberKey, amount);

    //     if (bomberKey == "buyAh1Cobra") {
    //         await buyAh1Cobra(nationId, amount, publicClient, BombersMarketplace1, writeContractAsync);  
    //     } else if (bomberKey == "buyAh64Apache") {
    //         await buyAh64Apache(nationId, amount, publicClient, BombersMarketplace1, writeContractAsync);  
    //     } else if (bomberKey == "buyBristolBlenheim") {
    //         await buyBristolBlenheim(nationId, amount, publicClient, BombersMarketplace1, writeContractAsync);  
    //     } else if (bomberKey == "buyB52Mitchell") {
    //         await buyB52Mitchell(nationId, amount, publicClient, BombersMarketplace1, writeContractAsync);  
    //     } else if (bomberKey == "buyB17gFlyingFortress") {
    //         await buyB17gFlyingFortress(nationId, amount, publicClient, BombersMarketplace1, writeContractAsync);  
    //     } else if (bomberKey == "buyB52Stratofortress") {
    //         await buyB52Stratofortress(nationId, amount, publicClient, BombersMarketplace2, writeContractAsync);  
    //     } else if (bomberKey == "buyB2Spirit") {
    //         await buyB2Spirit(nationId, amount, publicClient, BombersMarketplace2, writeContractAsync);  
    //     } else if (bomberKey == "buyB1bLancer") {
    //         await buyB1bLancer(nationId, amount, publicClient, BombersMarketplace2, writeContractAsync);  
    //     } else if (bomberKey == "buyTupolevTu160") {
    //         await buyTupolevTu160(nationId, amount, publicClient, BombersMarketplace2, writeContractAsync);  
    //     } else {
    //         console.error("Invalid fighter key");
    //     }
    // }

    const handleBuyBombers = async (key : string) => {
                        
        const amount = purchaseAmounts[key] || 1;
        const bomberKey = bomberKeyMapping[key] || key;

        if (!nationId) {
            console.error("Nation ID is null");
            return;
        }

        console.log("Buying bombers:", bomberKey, amount);

        const contractData1 = contractsData.BombersMarketplace1;
        const abi1 = contractData1.abi;
        
        if (!contractData1.address || !abi1) {
            console.error("Contract address or ABI is missing");
            return;
        }

        const contractData2 = contractsData.BombersMarketplace2;
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

            if (bomberKey == "buyAh1Cobra" || bomberKey == "buyAh64Apache" || bomberKey == "buyBristolBlenheim" || bomberKey == "buyB52Mitchell" || bomberKey == "buyB17gFlyingFortress") {
                data = contract1.interface.encodeFunctionData(bomberKey, [amount, nationId]);
            } else {
                data = contract2.interface.encodeFunctionData(bomberKey, [amount, nationId]);
            }

            try {

                let result 

                if (bomberKey == "buyAh1Cobra" || bomberKey == "buyAh64Apache" || bomberKey == "buyBristolBlenheim" || bomberKey == "buyB52Mitchell" || bomberKey == "buyB17gFlyingFortress") {

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

            if (bomberKey == "buyAh1Cobra") {
                await buyAh1Cobra(nationId, amount, publicClient, BombersMarketplace1, writeContractAsync);  
            } else if (bomberKey == "buyAh64Apache") {
                await buyAh64Apache(nationId, amount, publicClient, BombersMarketplace1, writeContractAsync);  
            } else if (bomberKey == "buyBristolBlenheim") {
                await buyBristolBlenheim(nationId, amount, publicClient, BombersMarketplace1, writeContractAsync);  
            } else if (bomberKey == "buyB52Mitchell") {
                await buyB52Mitchell(nationId, amount, publicClient, BombersMarketplace1, writeContractAsync);  
            } else if (bomberKey == "buyB17gFlyingFortress") {
                await buyB17gFlyingFortress(nationId, amount, publicClient, BombersMarketplace1, writeContractAsync);  
            } else if (bomberKey == "buyB52Stratofortress") {
                await buyB52Stratofortress(nationId, amount, publicClient, BombersMarketplace2, writeContractAsync);  
            } else if (bomberKey == "buyB2Spirit") {
                await buyB2Spirit(nationId, amount, publicClient, BombersMarketplace2, writeContractAsync);  
            } else if (bomberKey == "buyB1bLancer") {
                await buyB1bLancer(nationId, amount, publicClient, BombersMarketplace2, writeContractAsync);  
            } else if (bomberKey == "buyTupolevTu160") {
                await buyTupolevTu160(nationId, amount, publicClient, BombersMarketplace2, writeContractAsync);  
            } else {
                console.error("Invalid Bomber key");
            }

            alert("Bombers purchased successfully!");
            
        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error("Transaction failed:", errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    }

    const fetchFighterDetails = async () => {
        if (!nationId || !publicClient || !BombersContract || !TreasuryContract) return;

        try {
            const ah1CobraCount = await getAh1CobraCount(nationId, publicClient, BombersContract);
            const ah64ApacheCount = await getAh64ApacheCount(nationId, publicClient, BombersContract);
            const bristolBlenheimCount = await getBristolBlenheimCount(nationId, publicClient, BombersContract);
            const b52MitchellCount = await getB52MitchellCount(nationId, publicClient, BombersContract);
            const b17gFlyingFortressCount = await getB17gFlyingFortressCount(nationId, publicClient, BombersContract);
            const b52StratofortressCount = await getB52StratofortressCount(nationId, publicClient, BombersContract);
            const b2SpiritCount = await getB2SpiritCount(nationId, publicClient, BombersContract);
            const b1bLancerCount = await getB1bLancerCount(nationId, publicClient, BombersContract);
            const tupolevTu160Count = await getTupolevTu160Count(nationId, publicClient, BombersContract);

            const bomberDetails: BomberDetails = {
                ah1Cobra: ah1CobraCount.toString(),
                ah64Apache: ah64ApacheCount.toString(),
                bristolBlenheim: bristolBlenheimCount.toString(),
                b52Mitchell: b52MitchellCount.toString(),
                b17gFlyingFortress: b17gFlyingFortressCount.toString(),
                b52Stratofortress: b52StratofortressCount.toString(),
                b2Spirit: b2SpiritCount.toString(),
                b1bLancer: b1bLancerCount.toString(),
                tupolevTu160: tupolevTu160Count.toString(),
            };

            setBomberDetails(bomberDetails);
        } catch (error) {
            console.error("Error fetching fighter details:", error);
        }
    }

    useEffect(() => {
        fetchFighterDetails();
    }, [nationId, publicClient, BombersContract, TreasuryContract, refreshTrigger]);

    return (
        <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">✈️ Bomber Details</h2>
    
            {/* Bombers Table */}
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
                    {Object.entries(bomberDetails).filter(([key]) => key !== "warBucksBalance").map(([key, value]) => (
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
                                    onClick={() => handleBuyBombers(key)}
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

export default BuyBombers;
