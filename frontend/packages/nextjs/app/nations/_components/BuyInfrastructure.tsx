"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { 
    getInfrastructureCount, 
    getInfrastructureCost, 
    buyInfrastructure, 
    getTotalPopulationCount, 
    getInfrastructureCostPerLevel,
    destroyInfrastructure,
} from "~~/utils/infrastructure";
import { checkBalance } from "~~/utils/treasury";
import { useTheme } from "next-themes";

const BuyInfrastructure = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const InfrastructureContract = contractsData?.InfrastructureContract;
    const InfrastructureMarketContract = contractsData?.InfrastructureMarketContract;
    const TreasuryContract = contractsData?.TreasuryContract;

    const { writeContractAsync } = useWriteContract();

    const [infrastructureDetails, setInfrastructureDetails] = useState({
        infrastructureAmount: "",
        totalPopulationCount: "",
        currentWarBucksBalance: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const [levelInput, setLevelInput] = useState("");
    const [destroyAmount, setDestroyAmount] = useState("");
    const [costPerLevel, setCostPerLevel] = useState<string | null>(null);
    const [totalCost, setTotalCost] = useState<string | null>(null);
    const [totalCostFromContract, setTotalCostFromContract] = useState<string | null>(null);

    useEffect(() => {
        const fetchInfrastructureDetails = async () => {
            if (!nationId || !publicClient || !InfrastructureContract) return;

            try {
                const infrastructureAmount = await getInfrastructureCount(nationId, publicClient, InfrastructureContract);
                const totalPopulationCount = await getTotalPopulationCount(nationId, publicClient, InfrastructureContract);
                const warBuckBalance = await checkBalance(nationId, publicClient, TreasuryContract);

                setInfrastructureDetails({
                    infrastructureAmount: infrastructureAmount.toString(),
                    totalPopulationCount: totalPopulationCount.toString(),
                    currentWarBucksBalance: (warBuckBalance / BigInt(10 ** 18)).toLocaleString(),
                });
            } catch (error) {
                console.error("Error fetching infrastructure details:", error);
            }
        };

        fetchInfrastructureDetails();
    }, [nationId, publicClient, InfrastructureContract, TreasuryContract, refreshTrigger]);

    const handleCalculateCost = async () => {
        if (!levelInput || !nationId || !publicClient || !InfrastructureMarketContract) {
            setErrorMessage("Please enter a valid level.");
            return;
        }

        try {
            const costPerLevel = await getInfrastructureCostPerLevel(nationId, publicClient, InfrastructureMarketContract);
            const totalCost = costPerLevel * BigInt(levelInput);
            const totalCostFromContract = await getInfrastructureCost(nationId, Number(levelInput), publicClient, InfrastructureMarketContract);

            setCostPerLevel((costPerLevel / BigInt(10 ** 18)).toString());
            setTotalCost(totalCost.toString());
            setTotalCostFromContract((totalCostFromContract / BigInt(10 ** 18)).toString());

            setErrorMessage("");
        } catch (error) {
            console.error("Error calculating cost per level:", error);
            setErrorMessage("Failed to calculate cost. Please try again.");
        }
    };

    const handleBuyInfrastructure = async () => {
        if (!nationId || !publicClient || !InfrastructureMarketContract || !walletAddress || !totalCost) {
            console.error("Missing required parameters for buyInfrastructure");
            setErrorMessage("Missing required parameters.");
            return;
        }

        const contractData = contractsData.InfrastructureMarketContract;
        const abi = contractData.abi;

        if (!contractData.address || !abi) {
            console.error("Contract address or ABI is missing");
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(contractData.address, abi as ethers.ContractInterface, signer);

            const data = contract.interface.encodeFunctionData("buyInfrastructure", [
                nationId,
                Number(levelInput),
            ]);

            try {
                const result = await provider.call({
                    to: contract.address,
                    data: data,
                    from: await signer.getAddress(),
                });

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

            await buyInfrastructure(nationId, Number(levelInput), publicClient, InfrastructureMarketContract, writeContractAsync);
            setRefreshTrigger(!refreshTrigger);
            setErrorMessage("");
            alert("Infrastructure purchased successfully!");

        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error("Transaction failed:", errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    };

    const handleDestroyInfrastructure = async () => {
        if (!nationId || !publicClient || !InfrastructureContract || !destroyAmount) {
            alert("Missing required parameters.");
            return;
        }

        try {
            await destroyInfrastructure(nationId, Number(destroyAmount), publicClient, InfrastructureContract, writeContractAsync);
            alert(`Successfully destroyed ${destroyAmount} infrastructure.`);
            setRefreshTrigger(!refreshTrigger);
        } catch (error) {
            console.error("Error destroying infrastructure:", error);
            alert("Transaction failed: Unable to destroy infrastructure.");
        }
    };

    return (
        <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">🏗️ Buy Infrastructure</h2>

            {/* Error Message */}
            {errorMessage && (
                <div className="p-4 bg-red-500 text-white rounded-lg shadow-md mb-4">
                    {errorMessage}
                </div>
            )}

            {/* Infrastructure Details Table */}
            <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
                <thead className="bg-primary text-primary-content">
                    <tr>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(infrastructureDetails).map(([key, value]) => (
                        <tr key={key} className="border-b border-neutral">
                            <td className="p-3 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                            <td className="p-3">{value !== null ? value : "Loading..."}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Input for Infrastructure Purchase */}
            <div className="bg-base-200 p-4 rounded-lg shadow-md">
                <label className="text-lg font-semibold text-primary block mb-2">Enter Level:</label>
                <input
                    type="number"
                    value={levelInput}
                    onChange={(e) => setLevelInput(e.target.value)}
                    className="input input-bordered w-full bg-base-100 text-base-content mb-4"
                    placeholder="Enter level number"
                />
                <button
                    onClick={handleCalculateCost}
                    className="btn btn-accent w-full"
                >
                    Calculate Infrastructure Cost Per Level
                </button>

                {/* Display Cost Calculations */}
                {costPerLevel !== null && (
                    <div className="mt-4 p-3 bg-blue-500 text-white rounded-lg shadow-md text-center">
                        Cost per Level: {costPerLevel}
                    </div>
                )}
                {totalCostFromContract !== null && (
                    <div className="mt-4 p-3 bg-blue-500 text-white rounded-lg shadow-md text-center">
                        Total Cost from Contract: {totalCostFromContract}
                    </div>
                )}

                {/* Buy Infrastructure Button */}
                {totalCostFromContract !== null && (
                    <button
                        onClick={handleBuyInfrastructure}
                        className="btn btn-primary w-full mt-4"
                    >
                        Buy {levelInput} Infrastructure
                    </button>
                )}
            </div>

            {/* Destroy Infrastructure */}
            <div className="bg-base-200 p-4 rounded-lg shadow-md mt-6">
                <label className="text-lg font-semibold text-primary block mb-2">Enter Amount to Destroy:</label>
                <input
                    type="number"
                    value={destroyAmount}
                    onChange={(e) => setDestroyAmount(e.target.value)}
                    className="input input-bordered w-full bg-base-100 text-base-content mb-4"
                    placeholder="Enter amount"
                />
                <button
                    onClick={handleDestroyInfrastructure}
                    className="btn btn-error w-full mt-4"
                >
                    Destroy {destroyAmount} Infrastructure
                </button>
            </div>
        </div>
    );
};

export default BuyInfrastructure;
