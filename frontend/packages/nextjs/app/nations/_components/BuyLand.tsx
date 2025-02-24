
"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { 
    getLandCount,
    getAreaOfInfluence,
    buyLand,
    getLandCost,
    getLandCostPerMile
} from "~~/utils/land";
import { checkBalance } from "~~/utils/treasury";
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';
import { useTheme } from "next-themes";

const BuyLand = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const InfrastructureContract = contractsData?.InfrastructureContract;
    const LandMarketContract = contractsData?.LandMarketContract;
    const CountryMinterContract = contractsData?.CountryMinter;
    const TreasuryContract = contractsData?.TreasuryContract;

    const { writeContractAsync } = useWriteContract();

    const [landDetails, setInfrastructureDetails] = useState({
        currentLandMiles: "",
        getAreaOfInfluence: "",
        currentWarBucksBalance: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const [levelInput, setLevelInput] = useState("");
    const [costPerLevel, setCostPerLevel] = useState<string | null>(null);
    const [totalCostFromContract, setTotalCostFromContract] = useState<string | null>(null);

    useEffect(() => {
        const fetchLandDetails = async () => {
            if (!nationId || !publicClient || !InfrastructureContract) return;

            try {
                const landAmount = await getLandCount(nationId, publicClient, InfrastructureContract);
                const areaOfInfluence = await getAreaOfInfluence(nationId, publicClient, InfrastructureContract);
                const warBuckBalance = await checkBalance(nationId, publicClient, TreasuryContract);

                setInfrastructureDetails({
                    currentLandMiles: landAmount.toString(),
                    getAreaOfInfluence: areaOfInfluence.toString(),
                    currentWarBucksBalance: (warBuckBalance / BigInt(10 ** 18)).toLocaleString(),
                });
            } catch (error) {
                console.error("Error fetching infrastructure details:", error);
            }
        };

        fetchLandDetails();
    }, [nationId, publicClient, InfrastructureContract, TreasuryContract, refreshTrigger]);

    const handleCalculateCost = async () => {
        if (!levelInput || !nationId || !publicClient || !LandMarketContract) {
            setErrorMessage("Please enter a valid level.");
            return;
        }

        try {
            const costPerLevel = await getLandCostPerMile(nationId, publicClient, LandMarketContract);
            const totalCostFromContract = await getLandCost(nationId, Number(levelInput), publicClient, LandMarketContract);

            setCostPerLevel((costPerLevel / BigInt(10 ** 18)).toString());
            setTotalCostFromContract((totalCostFromContract / BigInt(10 ** 18)).toString());

            setErrorMessage("");
        } catch (error) {
            console.error("Error calculating cost per level:", error);
            setErrorMessage("Failed to calculate cost. Please try again.");
        }
    };

    // const handleBuyLand = async () => {
    //     if (!nationId || !publicClient || !LandMarketContract || !walletAddress || !totalCostFromContract) {
    //         setErrorMessage("Missing required information to proceed with the purchase.");
    //         return;
    //     }

    //     try {
    //         await buyLand(nationId, Number(levelInput), publicClient, LandMarketContract, writeContractAsync);
    //         setRefreshTrigger(!refreshTrigger);
    //         setErrorMessage("");
    //         alert("Land purchased successfully!");
    //     } catch (error) {
    //         console.error("Error buying land:", error);
    //         setErrorMessage("Failed to complete the purchase. Please try again.");
    //     }
    // };

    const handleBuyLand = async () => {
        if (!nationId || !publicClient || !LandMarketContract || !walletAddress || !totalCostFromContract) {
            console.error("Missing required parameters for buy Land");
            setErrorMessage("Missing required parameters.");
            return;
        }

        const contractData = contractsData.LandMarketContract;
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

            const data = contract.interface.encodeFunctionData("buyLand", [
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
    
            await buyLand(nationId, Number(levelInput), publicClient, LandMarketContract, writeContractAsync);
            setRefreshTrigger(!refreshTrigger);
            setErrorMessage("");
            alert("Land purchased successfully!");

        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error("Transaction failed:", errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    }

    return (
        <div className="w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">🌍 Buy Land</h2>
    
            {/* Error Message */}
            {errorMessage && (
                <div className="p-4 bg-red-500 text-white rounded-lg shadow-md mb-4">
                    {errorMessage}
                </div>
            )}
    
            {/* Land Details Table */}
            <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
                <thead className="bg-primary text-primary-content">
                    <tr>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(landDetails).map(([key, value]) => (
                        <tr key={key} className="border-b border-neutral">
                            <td className="p-3 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                            <td className="p-3">{value !== null ? value : "Loading..."}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
    
            {/* Input for Land Purchase */}
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
                    Calculate Land Cost Per Level
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
    
                {/* Buy Land Button */}
                {totalCostFromContract !== null && (
                    <button
                        onClick={handleBuyLand}
                        className="btn btn-primary w-full mt-4"
                    >
                        Buy {levelInput} Land Miles
                    </button>
                )}
            </div>
        </div>
    );
};

export default BuyLand;