
"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { AbiCoder } from "ethers/lib/utils";
import { ethers } from "ethers";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { 
    getTechnologyCount,
    buyTechnology,
    getTechnologyCost,
    getTechnologyCostPerLevel,
    destroyTech
} from "~~/utils/technology";
import { checkBalance } from "~~/utils/treasury";
import { checkOwnership } from "~~/utils/countryMinter";
import { useTheme } from "next-themes";

const BuyTechnology = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const InfrastructureContract = contractsData?.InfrastructureContract;
    const TechnologyMarketContract = contractsData?.TechnologyMarketContract;
    const CountryMinterContract = contractsData?.CountryMinter;
    const TreasuryContract = contractsData?.TreasuryContract;

    const { writeContractAsync } = useWriteContract();

    const [infrastructureDetails, setInfrastructureDetails] = useState({
        currentTechnologyLevel: "",
        currentWarBucksBalance: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const [levelInput, setLevelInput] = useState("");
    const [costPerLevel, setCostPerLevel] = useState<string | null>(null);
    const [totalCost, setTotalCost] = useState<string | null>(null);
    const [destroyTechAmount, setDestroyTechAmount] = useState<string>("");
    const [totalCostFromContract, setTotalCostFromContract] = useState<string | null>(null);

    useEffect(() => {
        const fetchInfrastructureDetails = async () => {
            if (!nationId || !publicClient || !InfrastructureContract) return;

            try {
                const techAmount = await getTechnologyCount(nationId, publicClient, InfrastructureContract);
                const warBuckBalance = await checkBalance(nationId, publicClient, TreasuryContract);

                setInfrastructureDetails({
                    currentTechnologyLevel: techAmount.toString(),
                    currentWarBucksBalance: (warBuckBalance / BigInt(10 ** 18)).toLocaleString(),
                });
            } catch (error) {
                console.error("Error fetching infrastructure details:", error);
            }
        };

        fetchInfrastructureDetails();
    }, [nationId, publicClient, InfrastructureContract, TreasuryContract, refreshTrigger]);

    function parseRevertReason(error: any): string {
        if (error?.data) {
            try {
                if (error.data.startsWith("0x08c379a0")) {
                    const decoded = new AbiCoder().decode(
                        ["string"],
                        "0x" + error.data.slice(10)
                    );
                    return decoded[0]; // Extract revert message
                }
            } catch (decodeError) {
                return "Unknown revert reason";
            }
        }
        return error?.message || "Transaction failed";
    }

    const handleCalculateCost = async () => {
        if (!levelInput || !nationId || !publicClient || !TechnologyMarketContract) {
            setErrorMessage("Please enter a valid level.");
            return;
        }

        try {
            const costPerLevel = await getTechnologyCostPerLevel(nationId, publicClient, TechnologyMarketContract);
            const totalCostFromContract = await getTechnologyCost(nationId, Number(levelInput), publicClient, TechnologyMarketContract);

            setCostPerLevel((costPerLevel / BigInt(10 ** 18)).toString());
            setTotalCostFromContract((totalCostFromContract / BigInt(10 ** 18)).toString());

            setErrorMessage("");
        } catch (error) {
            console.error("Error calculating cost per level:", error);
            setErrorMessage("Failed to calculate cost. Please try again.");
        }
    };

    // const handleBuyTechnology = async () => {
    //     if (!nationId || !publicClient || !TechnologyMarketContract || !walletAddress || !totalCostFromContract) {
    //         setErrorMessage("Missing required information to proceed with the purchase.");
    //         return;
    //     }

    //     try {
    //         await buyTechnology(nationId, Number(levelInput), publicClient, TechnologyMarketContract, writeContractAsync);
    //         setRefreshTrigger(!refreshTrigger);
    //         setErrorMessage("");
    //         alert("Technology purchased successfully!");
    //     } catch (error) {
    //         console.error("Error buying technology:", error);
    //         setErrorMessage("Failed to complete the purchase. Please try again.");
    //     }
    // };

    const handleBuyTechnology = async () => {
        if (!nationId || !publicClient || !TechnologyMarketContract || !walletAddress || !totalCostFromContract) {
            console.error("Missing required parameters for buyTech");
            setErrorMessage("Missing required parameters.");
            return;
        }

        const contractData = contractsData.TechnologyMarketContract;
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

            const data = contract.interface.encodeFunctionData("buyTech", [
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
    
            await buyTechnology(nationId, Number(levelInput), publicClient, TechnologyMarketContract, writeContractAsync);
            
            setRefreshTrigger(!refreshTrigger);

            alert("Technology purchased successfully!");

        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error("Transaction failed:", errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    }

    const handleDestroyTechnology = async (amount: any) => {
        if (!amount || isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount of technology to destroy.");
            return;
        }
    
        if (!nationId || !publicClient || !TechnologyMarketContract) {
            alert("Missing required information.");
            return;
        }
    
        try {
            await destroyTech(nationId, Number(amount), publicClient, TechnologyMarketContract, writeContractAsync);
            alert(`Successfully destroyed ${amount} technology.`);
            setRefreshTrigger(!refreshTrigger);
        } catch (error) {
            console.error("Error destroying technology:", error);
            if (error instanceof Error) {
                alert(`Transaction failed: ${error.message}`);
            } else {
                alert("Transaction failed: Unknown error");
            }
        }
    };

    return (
        <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">🖥️ Buy Technology</h2>
    
            {/* Error Message */}
            {errorMessage && (
                <div className="p-4 bg-red-500 text-white rounded-lg shadow-md mb-4">
                    {errorMessage}
                </div>
            )}
    
            {/* Technology Details Table */}
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
    
            {/* Input for Tech Level Selection */}
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
                    Calculate Tech Cost Per Level
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
    
                {/* Buy Technology Button */}
                {totalCostFromContract !== null && (
                    <button
                        onClick={handleBuyTechnology}
                        className="btn btn-primary w-full mt-4"
                    >
                        Buy {levelInput} Tech
                    </button>
                )}
            </div>

            <div className="bg-base-200 p-4 rounded-lg shadow-md mt-6">
                <label className="text-lg font-semibold text-primary block mb-2">
                    Enter Amount of Tech to Destroy:
                </label>
                <input
                    type="number"
                    value={destroyTechAmount}
                    onChange={(e) => setDestroyTechAmount(e.target.value)}
                    className="input input-bordered w-full bg-base-100 text-base-content mb-4"
                    placeholder="Enter amount to destroy"
                />
                <button
                    onClick={() => {
                        if (nationId) {
                            destroyTech(nationId, Number(destroyTechAmount), publicClient, TechnologyMarketContract, writeContractAsync);
                        } else {
                            alert("Nation ID is missing.");
                        }
                    }}
                    className="btn btn-error w-full mt-4 text-lg"
                >
                    ⚙️ Destroy {destroyTechAmount} Technology
                </button>
            </div>
        </div>
    );
    
};

export default BuyTechnology;