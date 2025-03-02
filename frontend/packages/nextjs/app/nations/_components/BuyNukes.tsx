
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
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';

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

    // const handleBuyNukes = async (amount : any) => {
        
    //     if (!nationId || !publicClient || !MissilesContract || !walletAddress || !cost) {
    //         setErrorMessage("Missing required information to proceed with the purchase.");
    //         return;
    //     }

    //     try {
    //         await buyNukes(nationId, publicClient, MissilesContract, writeContractAsync);
    //         setRefreshTrigger(!refreshTrigger);
    //         setErrorMessage("");
    //         alert("Nuke purchased successfully!");
    //     } catch (error) {
    //         console.error("Error buying Cruise Missiles:", error);
    //         setErrorMessage("Failed to complete the purchase. Please try again.");
    //     }
    // };

    const handleBuyNukes = async (amount : any) => {
                
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

            const data = contract.interface.encodeFunctionData("buyNukes", [
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

            await buyNukes(nationId, publicClient, MissilesContract, writeContractAsync);
            setRefreshTrigger(!refreshTrigger);
            setErrorMessage("");
            alert("Nuke purchased successfully!");

        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error("Transaction failed:", errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    }

    return (
        <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">☢️ Buy Nukes</h2>
    
            {/* Error Message */}
            {errorMessage && (
                <div className="mt-4 p-4 bg-error text-error-content rounded-lg shadow-md">
                    {errorMessage}
                </div>
            )}
    
            {/* Nuke Details Table */}
            <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
                <thead className="bg-primary text-primary-content">
                    <tr>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(nukeDetails).map(([key, value]) => (
                        <tr key={key} className="border-b border-neutral">
                            <td className="p-3 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                            <td className="p-3">{value !== null ? value : "Loading..."}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
    
            {/* Nuke Purchase */}
            <div className="bg-base-200 p-4 rounded-lg shadow-md">
                {cost !== null && (
                    <div className="mt-4 p-4 bg-info text-info-content rounded-lg shadow-md text-center">
                        <strong>Cost per Nuke:</strong> {cost} War Bucks
                    </div>
                )}
    
                {cost !== null && (
                    <button
                        onClick={() => handleBuyNukes(amountInput)}
                        className="btn btn-error w-full mt-4 text-lg"
                    >
                        ☢️ Buy Nuke for {Number(cost)} War Bucks
                    </button>
                )}
            </div>
        </div>
    );
    
};

export default BuyNukes;