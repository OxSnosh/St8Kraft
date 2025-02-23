
"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { 
    getSoldierCount,
    getSoldierCost,
    buySoldiers
} from "~~/utils/forces";
import { checkBalance } from "~~/utils/treasury";
import { getTotalPopulationCount } from "~~/utils/infrastructure";
import { useTheme } from "next-themes";
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';

const BuySoldiers = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const ForcesContract = contractsData?.ForcesContract;
    const InfrastructureContract = contractsData?.InfrastructureContract;
    const TreasuryContract = contractsData?.TreasuryContract;

    const { writeContractAsync } = useWriteContract();

    const [soldierDetails, setSoldierDetails] = useState({
        warBucksBalance: "",
        soldiers: "",
        costPerSoldier: "",
        totalPopulation: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const [cost, setCost] = useState<string | null>(null);
    const [amountInput, setAmountInput] = useState<string>("");

    useEffect(() => {
        const fetchBuySoldiierDetails = async () => {
            if (!nationId || !publicClient || !InfrastructureContract) return;

            try {
                const warBuckBalance = await checkBalance(nationId, publicClient, TreasuryContract);
                const soldierAmount = await getSoldierCount(nationId, publicClient, ForcesContract);
                const soldierCost = await getSoldierCost(nationId, publicClient, ForcesContract);
                const totalPopulation = await getTotalPopulationCount(nationId, publicClient, InfrastructureContract);

                console.log("War Buck Balance:", warBuckBalance);
                console.log("Soldier Amount:", soldierAmount);
                console.log("Soldier Cost:", soldierCost);
                console.log("Total Population:", totalPopulation);

                setSoldierDetails({
                    warBucksBalance: (warBuckBalance / BigInt(10 ** 18)).toLocaleString(),
                    soldiers: soldierAmount.toString(),
                    costPerSoldier: soldierCost.toLocaleString(),
                    totalPopulation: totalPopulation.toString(),
                });
            } catch (error) {
                console.error("Error fetching infrastructure details:", error);
            }
        };

        fetchBuySoldiierDetails();
    }, [nationId, publicClient, InfrastructureContract, TreasuryContract, refreshTrigger]);

    const handleCalculateCost = async (amount : any) => {
        
        if (!amount || !nationId || !publicClient || !ForcesContract) {
            setErrorMessage("Please enter a valid level.");
            return;
        }

        try {
            const costPerSoldier = BigInt(soldierDetails.costPerSoldier.replace(/,/g, ''));
            const cost = (BigInt(amount) * costPerSoldier).toString();

            console.log("Cost per soldier:", costPerSoldier);
            console.log("Total cost:", cost);

            setCost((BigInt(costPerSoldier)).toString());

            setErrorMessage("");
        } catch (error) {
            console.error("Error calculating cost per level:", error);
            setErrorMessage("Failed to calculate cost. Please try again.");
        }
    };

    const handleBuySoldiers = async (amount : any) => {
        
        if (!nationId || !publicClient || !ForcesContract || !walletAddress || !cost) {
            setErrorMessage("Missing required information to proceed with the purchase.");
            return;
        }

        const contractData = contractsData.ForcesContract;
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

            const data = contract.interface.encodeFunctionData("buySoldiers", [
                Number(amount),
                nationId,
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
    
            await buySoldiers(nationId, Number(amount), publicClient, ForcesContract, writeContractAsync);
            setRefreshTrigger(!refreshTrigger);
            setErrorMessage("");
            alert("Soldiers purchased successfully!");

        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error("Transaction failed:", errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    }

    // const handleBuySoldiers = async (amount : any) => {
        
    //     if (!nationId || !publicClient || !ForcesContract || !walletAddress || !cost) {
    //         setErrorMessage("Missing required information to proceed with the purchase.");
    //         return;
    //     }

    //     try {
    //         await buySoldiers(nationId, Number(amount), publicClient, ForcesContract, writeContractAsync);
    //         setRefreshTrigger(!refreshTrigger);
    //         setErrorMessage("");
    //         alert("Land purchased successfully!");
    //     } catch (error) {
    //         console.error("Error buying land:", error);
    //         setErrorMessage("Failed to complete the purchase. Please try again.");
    //     }
    // };

    return (
        <div className={`p-6 border-l-4 ${theme === 'dark' ? 'bg-gray-800 text-white border-green-400' : 'bg-gray-100 text-black border-green-500'}`}>
            <h3 className="text-lg font-semibold">Buy Soldiers</h3>

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
                    {Object.entries(soldierDetails).map(([key, value]) => (
                        <tr key={key} className="text-center">
                            <td className="border border-gray-300 px-4 py-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                            <td className="border border-gray-300 px-4 py-2">{value !== null ? value : "Loading..."}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Enter Amount:</label>
                <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Enter amount to buy"
                />
                <button
                    onClick={() => handleCalculateCost(amountInput)}
                    className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                    Calculate Soldier Purchase Cost
                </button>

                {cost !== null && (
                    <div className="mt-4 p-4 bg-blue-500 text-white rounded">
                        Cost per Soldier: {cost}
                    </div>
                )}
                {cost !== null && (
                    <button
                        onClick={() => handleBuySoldiers(amountInput)}
                        className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mt-4"
                    >
                        Buy {amountInput} Soldiers for {Number(amountInput) * Number(cost)} War Bucks
                    </button>
                )}
            </div>
        </div>
    );
};

export default BuySoldiers;