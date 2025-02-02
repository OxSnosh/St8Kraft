
"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { 
    getTankCount,
    getTankCost,
    getMaxTankCount,
    buyTanks
} from "~~/utils/forces";
import { checkBalance } from "~~/utils/treasury";
import { checkOwnership } from "~~/utils/countryMinter";
import { getTotalPopulationCount } from "~~/utils/infrastructure";
import { useTheme } from "next-themes";

const BuyTanks = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const ForcesContract = contractsData?.ForcesContract;
    const InfrastructureContract = contractsData?.InfrastructureContract;
    const CountryMinterContract = contractsData?.CountryMinter;
    const TreasuryContract = contractsData?.TreasuryContract;

    const { writeContractAsync } = useWriteContract();

    const [tankDetails, setTankDetails] = useState({
        warBucksBalance: "",
        tanks: "",
        costPerTank: "",
        maxTankCount: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const [cost, setCost] = useState<string | null>(null);
    const [amountInput, setAmountInput] = useState<string>("");

    useEffect(() => {
        const fetchBuyTankDetails = async () => {
            if (!nationId || !publicClient || !InfrastructureContract) return;

            try {
                const warBuckBalance = await checkBalance(nationId, publicClient, TreasuryContract);
                const tankAmount = await getTankCount(nationId, publicClient, ForcesContract);
                const tankCost = await getTankCost(nationId, publicClient, ForcesContract);
                const maxTankCount = await getMaxTankCount(nationId, publicClient, ForcesContract);

                console.log("War Buck Balance:", warBuckBalance);
                console.log("Soldier Amount:", tankAmount);
                console.log("Soldier Cost:", tankCost);
                console.log("Max Tank Count:", maxTankCount);

                setTankDetails({
                    warBucksBalance: (warBuckBalance / BigInt(10 ** 18)).toLocaleString(),
                    tanks: tankAmount.toString(),
                    costPerTank: tankCost.toLocaleString(),
                    maxTankCount: maxTankCount.toString(),
                });
            } catch (error) {
                console.error("Error fetching infrastructure details:", error);
            }
        };

        fetchBuyTankDetails();
    }, [nationId, publicClient, InfrastructureContract, TreasuryContract, refreshTrigger]);

    const handleCalculateCost = async (amount : any) => {
        
        if (!amount || !nationId || !publicClient || !ForcesContract) {
            setErrorMessage("Please enter a valid level.");
            return;
        }

        try {
            const costPerTank = BigInt(tankDetails.costPerTank.replace(/,/g, ''));
            const cost = (BigInt(amount) * costPerTank).toString();

            console.log("Cost per tank:", costPerTank);
            console.log("Total cost:", cost);

            setCost((BigInt(costPerTank)).toString());

            setErrorMessage("");
        } catch (error) {
            console.error("Error calculating cost per level:", error);
            setErrorMessage("Failed to calculate cost. Please try again.");
        }
    };

    const handleBuyTanks = async (amount : any) => {
        
        if (!nationId || !publicClient || !ForcesContract || !walletAddress || !cost) {
            setErrorMessage("Missing required information to proceed with the purchase.");
            return;
        }

        try {
            await buyTanks(nationId, Number(amount), publicClient, ForcesContract, writeContractAsync);
            setRefreshTrigger(!refreshTrigger);
            setErrorMessage("");
            alert("Land purchased successfully!");
        } catch (error) {
            console.error("Error buying land:", error);
            setErrorMessage("Failed to complete the purchase. Please try again.");
        }
    };

    return (
        <div className={`p-6 border-l-4 ${theme === 'dark' ? 'bg-gray-800 text-white border-green-400' : 'bg-gray-100 text-black border-green-500'}`}>
            <h3 className="text-lg font-semibold">Buy Tanks</h3>

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
                    {Object.entries(tankDetails).map(([key, value]) => (
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
                    Calculate Tank Purchase Cost
                </button>

                {cost !== null && (
                    <div className="mt-4 p-4 bg-blue-500 text-white rounded">
                        Cost per Tank: {cost}
                    </div>
                )}
                {cost !== null && (
                    <button
                        onClick={() => handleBuyTanks(amountInput)}
                        className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mt-4"
                    >
                        Buy {amountInput} Tanks for {Number(amountInput) * Number(cost)} War Bucks
                    </button>
                )}
            </div>
        </div>
    );
};

export default BuyTanks;