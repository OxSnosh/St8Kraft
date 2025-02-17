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
    getInfrastructureCostPerLevel
} from "~~/utils/infrastructure";
import { checkBalance } from "~~/utils/treasury";
import { checkOwnership } from "~~/utils/countryMinter";
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
    const CountryMinterContract = contractsData?.CountryMinter;
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

    // const handleBuyInfrastructure = async () => {
    //     if (!nationId || !publicClient || !InfrastructureMarketContract || !walletAddress || !totalCost) {
    //         setErrorMessage("Missing required information to proceed with the purchase.");
    //         return;
    //     }

    //     try {
    //         await buyInfrastructure(nationId, Number(levelInput), publicClient, InfrastructureMarketContract, writeContractAsync);
    //         setRefreshTrigger(!refreshTrigger);
    //         setErrorMessage("");
    //         alert("Infrastructure purchased successfully!");
    //     } catch (error) {
    //         console.error("Error buying infrastructure:", error);
    //         setErrorMessage("Failed to complete the purchase. Please try again.");
    //     }
    // };

    const handleBuyInfrastructure = async () => {
        if (!nationId || !publicClient || !InfrastructureMarketContract || !walletAddress || !totalCost) {
            console.error("Missing required parameters for buyInf");
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
            const userAddress = await signer.getAddress();

            const contract = new ethers.Contract(contractData.address, abi as ethers.ContractInterface, signer);

            const data = contract.interface.encodeFunctionData("buyInfrastructure", [
                nationId,
                Number(levelInput)
            ]);

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
    }

    return (
        <div className={`p-6 border-l-4 ${theme === 'dark' ? 'bg-gray-800 text-white border-green-400' : 'bg-gray-100 text-black border-green-500'}`}>
            <h3 className="text-lg font-semibold">Buy Infrastructure</h3>

            {errorMessage && (
                <div className="mt-4 p-4 bg-red-500 text-white rounded">
                    {errorMessage}
                </div>
            )}

            <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                    <tr className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                        <th className="border border-gray-300 px-4 py-2">Category</th>
                        <th className="border border-gray-300 px-4 py-2">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(infrastructureDetails).map(([key, value]) => (
                        <tr key={key} className="text-center">
                            <td className="border border-gray-300 px-4 py-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                            <td className="border border-gray-300 px-4 py-2">{value !== null ? value : "Loading..."}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Enter Level:</label>
                <input
                    type="number"
                    value={levelInput}
                    onChange={(e) => setLevelInput(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Enter level number"
                />
                <button
                    onClick={handleCalculateCost}
                    className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                    Calculate Infrastructure Cost Per Level
                </button>

                {costPerLevel !== null && (
                    <div className="mt-4 p-4 bg-blue-500 text-white rounded">
                        Cost per Level: {costPerLevel}
                    </div>
                )}
                {totalCostFromContract !== null && (
                    <div className="mt-4 p-4 bg-blue-500 text-white rounded">
                        Total Cost from Contract: {totalCostFromContract}
                    </div>
                )}
                {totalCostFromContract !== null && (
                    <button
                        onClick={handleBuyInfrastructure}
                        className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mt-4"
                    >
                        Buy {levelInput} Infrastructure
                    </button>
                )}
            </div>
        </div>
    );
};

export default BuyInfrastructure;
