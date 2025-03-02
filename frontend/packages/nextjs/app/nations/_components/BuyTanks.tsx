
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
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';

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

            setCost((BigInt(costPerTank)).toString());

            setErrorMessage("");
        } catch (error) {
            console.error("Error calculating cost per level:", error);
            setErrorMessage("Failed to calculate cost. Please try again.");
        }
    };

    // const handleBuyTanks = async (amount : any) => {
        
    //     if (!nationId || !publicClient || !ForcesContract || !walletAddress || !cost) {
    //         setErrorMessage("Missing required information to proceed with the purchase.");
    //         return;
    //     }

    //     try {
    //         await buyTanks(nationId, Number(amount), publicClient, ForcesContract, writeContractAsync);
    //         setRefreshTrigger(!refreshTrigger);
    //         setErrorMessage("");
    //         alert("Tanks purchased successfully!");
    //     } catch (error) {
    //         console.error("Error buying land:", error);
    //         setErrorMessage("Failed to complete the purchase. Please try again.");
    //     }
    // };

    const handleBuyTanks = async (amount : any) => {
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

            const data = contract.interface.encodeFunctionData("buyTanks", [
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
    
            await buyTanks(nationId, Number(amount), publicClient, ForcesContract, writeContractAsync);
            setRefreshTrigger(!refreshTrigger);
            setErrorMessage("");
            alert("Tanks purchased successfully!");

        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error("Transaction failed:", errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    }

    return (
        <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">🛡️ Buy Tanks</h2>
    
            {/* Error Message Handling */}
            {errorMessage && (
                <div className="mt-4 p-4 bg-red-500 text-white rounded-lg shadow-md">
                    {errorMessage}
                </div>
            )}
    
            {/* Tanks Table */}
            <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
                <thead className="bg-primary text-primary-content">
                    <tr>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(tankDetails).map(([key, value]) => (
                        <tr key={key} className="border-b border-neutral">
                            <td className="p-3 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                            <td className="p-3">{value !== null ? value : "Loading..."}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
    
            {/* Tank Purchase Form */}
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
                    className="btn btn-accent w-full"
                >
                    Calculate Tank Purchase Cost
                </button>
    
                {cost !== null && (
                    <div className="mt-4 text-center text-lg font-semibold bg-blue-500 text-white p-3 rounded-lg shadow-md">
                        Cost per Tank: {cost}
                    </div>
                )}
    
                {cost !== null && (
                    <button
                        onClick={() => handleBuyTanks(amountInput)}
                        className="btn btn-primary w-full mt-4"
                    >
                        Buy {amountInput} Tanks for {Number(amountInput) * Number(cost)} War Bucks
                    </button>
                )}
            </div>
        </div>
    );
    
};

export default BuyTanks;