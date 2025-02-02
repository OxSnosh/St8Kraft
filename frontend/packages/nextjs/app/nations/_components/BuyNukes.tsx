
"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { 
    getNukeCost,
    getNukeCount,
    buyNukes
} from "~~/utils/nukes";
import { checkBalance } from "~~/utils/treasury";
import { checkOwnership } from "~~/utils/countryMinter";
import { useTheme } from "next-themes";

const BuyNukes = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const MissilesContract = contractsData?.MissilesContract;
    const TreasuryContract = contractsData?.TreasuryContract;

    const { writeContractAsync } = useWriteContract();

    const [nukeDetails, setBuyNukeDetails] = useState({
        warBucksBalance: "",
        nukes: "",
        costPerNuke: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const [cost, setCost] = useState<string | null>(null);
    const [amountInput, setAmountInput] = useState<string>("");

    useEffect(() => {
        const fetchBuyNukeDetails = async () => {
            if (!nationId || !publicClient || !MissilesContract) return;

            try {
                const warBuckBalance = await checkBalance(nationId, publicClient, TreasuryContract);
                const nukeCount = await getNukeCount(nationId, publicClient, MissilesContract);
                const nukeCost = await getNukeCost(nationId, publicClient, MissilesContract);

                console.log("War Buck Balance:", warBuckBalance);
                console.log("Nuke Amount:", nukeCount);
                console.log("Nuke Cost:", nukeCost);

                setBuyNukeDetails({
                    warBucksBalance: (warBuckBalance / BigInt(10 ** 18)).toLocaleString(),
                    nukes: nukeCount.toString(),
                    costPerNuke: (nukeCost / BigInt(10**18)).toString()
                });  

                setCost(((nukeCost / BigInt(10**18))).toString());
            } catch (error) {
                console.error("Error fetching infrastructure details:", error);
            }
        };

        fetchBuyNukeDetails();
    }, [nationId, publicClient, MissilesContract, TreasuryContract, refreshTrigger]);

    const handleBuyNukes = async (amount : any) => {
        
        if (!nationId || !publicClient || !MissilesContract || !walletAddress || !cost) {
            setErrorMessage("Missing required information to proceed with the purchase.");
            return;
        }

        try {
            await buyNukes(nationId, publicClient, MissilesContract, writeContractAsync);
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
            <h3 className="text-lg font-semibold">Buy Nukes</h3>

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
                    {Object.entries(nukeDetails).map(([key, value]) => (
                        <tr key={key} className="text-center">
                            <td className="border border-gray-300 px-4 py-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                            <td className="border border-gray-300 px-4 py-2">{value !== null ? value : "Loading..."}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4">
                    <div className="mt-4 p-4 bg-blue-500 text-white rounded">
                        Cost per Nuke: {cost}
                    </div>
                    <button
                        onClick={() => handleBuyNukes(amountInput)}
                        className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mt-4"
                    >
                        Buy Nuke for {Number(cost)} War Bucks
                    </button>
            </div>
        </div>
    );
};

export default BuyNukes;