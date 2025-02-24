
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
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';

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

    // const handleBuyCruiseMissiles = async (amount : any) => {
        
    //     if (!nationId || !publicClient || !MissilesContract || !walletAddress || !cost) {
    //         setErrorMessage("Missing required information to proceed with the purchase.");
    //         return;
    //     }

    //     try {
    //         await buyCruiseMissiles(Number(amount), nationId, publicClient, MissilesContract, writeContractAsync);
    //         setRefreshTrigger(!refreshTrigger);
    //         setErrorMessage("");
    //         alert("Cruise Missiles purchased successfully!");
    //     } catch (error) {
    //         console.error("Error buying Cruise Missiles:", error);
    //         setErrorMessage("Failed to complete the purchase. Please try again.");
    //     }
    // };

    const handleBuyCruiseMissiles = async (amount : any) => {
                
        if (!nationId || !publicClient || !MissilesContract || !walletAddress || !cost) {
            setErrorMessage("Missing required information to proceed with the purchase.");
            return;
        }

        const contractData = contractsData.MissilesContract;
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

            const data = contract.interface.encodeFunctionData("buyCruiseMissiles", [
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

            await buyCruiseMissiles(Number(amount), nationId, publicClient, MissilesContract, writeContractAsync);
            setRefreshTrigger(!refreshTrigger);
            setErrorMessage("");
            alert("Cruise Missiles purchased successfully!");
            
        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error("Transaction failed:", errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    }

    return (
        <div className="w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">🚀 Buy Cruise Missiles</h2>
    
            {/* Error Message */}
            {errorMessage && (
                <div className="mt-4 p-4 bg-error text-error-content rounded-lg shadow-md">
                    {errorMessage}
                </div>
            )}
    
            {/* Cruise Missile Details Table */}
            <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
                <thead className="bg-primary text-primary-content">
                    <tr>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(cruiseMissileDetails).map(([key, value]) => (
                        <tr key={key} className="border-b border-neutral">
                            <td className="p-3 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                            <td className="p-3">{value !== null ? value : "Loading..."}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
    
            {/* Purchase Input & Actions */}
            <div className="bg-base-200 p-4 rounded-lg shadow-md">
                <label className="text-lg font-semibold text-primary block mb-2">Enter Amount:</label>
                <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="input input-bordered w-full bg-base-100 text-base-content mb-4"
                    placeholder="Enter amount to buy"
                />
                <button
                    onClick={() => handleCalculateCost(amountInput)}
                    className="btn btn-accent w-full mb-4"
                >
                    Calculate Cruise Missile Purchase Cost
                </button>
    
                {cost !== null && (
                    <div className="mt-4 p-4 bg-info text-info-content rounded-lg shadow-md">
                        Cost per Cruise Missile: {cost}
                    </div>
                )}
    
                {cost !== null && (
                    <button
                        onClick={() => handleBuyCruiseMissiles(amountInput)}
                        className="btn btn-success w-full mt-4"
                    >
                        Buy {amountInput} Cruise Missiles for {Number(amountInput) * Number(cost)} War Bucks
                    </button>
                )}
            </div>
        </div>
    );
    
};

export default BuyCruiseMissiles;