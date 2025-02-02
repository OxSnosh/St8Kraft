
"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { 
    getCruiseMissileCount,
    getCruiseMissileCost,
    buyCruiseMissiles
} from "~~/utils/cruiseMissiles";
import { checkBalance } from "~~/utils/treasury";
import { checkOwnership } from "~~/utils/countryMinter";
import { useTheme } from "next-themes";

const BuyCruiseMissiles = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const MissilesContract = contractsData?.MissilesContract;
    const TreasuryContract = contractsData?.TreasuryContract;
    // const CountryMinterContract = contractsData?.CountryMinter;
    // const InfrastructureContract = contractsData?.InfrastructureContract;

    const { writeContractAsync } = useWriteContract();

    const [cruiseMissileDetails, setCruiseMissileDetails] = useState({
        warBucksBalance: "",
        cruiseMissiles: "",
        costPerCruiseMissile: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const [cost, setCost] = useState<string | null>(null);
    const [amountInput, setAmountInput] = useState<string>("");

    useEffect(() => {
        const fetchBuyCruiseMissileDetails = async () => {
            if (!nationId || !publicClient || !MissilesContract) return;

            try {
                const warBuckBalance = await checkBalance(nationId, publicClient, TreasuryContract);
                const cruiseMissileCount = await getCruiseMissileCount(nationId, publicClient, MissilesContract);
                const cruiseMissileCost = await getCruiseMissileCost(nationId, publicClient, MissilesContract);

                console.log("War Buck Balance:", warBuckBalance);
                console.log("Cruise Missile Amount:", cruiseMissileCount);
                console.log("Cruise Missile Cost:", cruiseMissileCost);

                setCruiseMissileDetails({
                    warBucksBalance: (warBuckBalance / BigInt(10 ** 18)).toLocaleString(),
                    cruiseMissiles: cruiseMissileCount.toString(),
                    costPerCruiseMissile: (cruiseMissileCost / BigInt(10**18)).toString()
                });
            } catch (error) {
                console.error("Error fetching infrastructure details:", error);
            }
        };

        fetchBuyCruiseMissileDetails();
    }, [nationId, publicClient, MissilesContract, TreasuryContract, refreshTrigger]);

    const handleCalculateCost = async (amount : any) => {
        
        if (!amount || !nationId || !publicClient || !MissilesContract) {
            setErrorMessage("Please enter a valid level.");
            return;
        }

        try {
            const costPerMissile = BigInt(cruiseMissileDetails.costPerCruiseMissile.replace(/,/g, ''));
            const cost = (BigInt(amount) * costPerMissile).toString();

            console.log("Cost per tank:", costPerMissile);
            console.log("Total cost:", cost);

            setCost((BigInt(costPerMissile)).toString());

            setErrorMessage("");
        } catch (error) {
            console.error("Error calculating cost per level:", error);
            setErrorMessage("Failed to calculate cost. Please try again.");
        }
    };

    const handleBuyTanks = async (amount : any) => {
        
        if (!nationId || !publicClient || !MissilesContract || !walletAddress || !cost) {
            setErrorMessage("Missing required information to proceed with the purchase.");
            return;
        }

        try {
            await buyCruiseMissiles(Number(amount), nationId, publicClient, MissilesContract, writeContractAsync);
            setRefreshTrigger(!refreshTrigger);
            setErrorMessage("");
            alert("Cruise Missiles purchased successfully!");
        } catch (error) {
            console.error("Error buying Cruise Missiles:", error);
            setErrorMessage("Failed to complete the purchase. Please try again.");
        }
    };

    return (
        <div className={`p-6 border-l-4 ${theme === 'dark' ? 'bg-gray-800 text-white border-green-400' : 'bg-gray-100 text-black border-green-500'}`}>
            <h3 className="text-lg font-semibold">Buy Cruise Missiles</h3>

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
                    {Object.entries(cruiseMissileDetails).map(([key, value]) => (
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
                    Calculate Cruise Missile Purchase Cost
                </button>

                {cost !== null && (
                    <div className="mt-4 p-4 bg-blue-500 text-white rounded">
                        Cost per Cruise Missile: {cost}
                    </div>
                )}
                {cost !== null && (
                    <button
                        onClick={() => handleBuyTanks(amountInput)}
                        className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mt-4"
                    >
                        Buy {amountInput} Crise Missiles for {Number(amountInput) * Number(cost)} War Bucks
                    </button>
                )}
            </div>
        </div>
    );
};

export default BuyCruiseMissiles;