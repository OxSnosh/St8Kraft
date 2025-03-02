"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { checkOwnership } from "~~/utils/countryMinter";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { buySpies, getMaxSpyCount, getSpyCount, getSpyPrice } from "~~/utils/spies";
import { checkBalance } from "~~/utils/treasury";
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';

const BuySpies = () => {
  const { theme } = useTheme();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const { address: walletAddress } = useAccount();
  const searchParams = useSearchParams();
  const nationId = searchParams.get("id");
  const SpyContract = contractsData?.SpyContract;
  const TreasuryContract = contractsData?.TreasuryContract;

  const { writeContractAsync } = useWriteContract();

  const [spyDetails, setSpyDetails] = useState({
    warBucksBalance: "",
    spyCount: "",
    costPerSpy: "",
    getMaxSpyCount: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [cost, setCost] = useState<string | null>(null);
  const [amountInput, setAmountInput] = useState<string>("");

  useEffect(() => {
    const fetchBuySpyDetails = async () => {
      if (!nationId || !publicClient || !SpyContract) return;

      try {
        const warBuckBalance = await checkBalance(nationId, publicClient, TreasuryContract);
        const spyCount = await getSpyCount(nationId, publicClient, SpyContract);
        const spyCost = await getSpyPrice(nationId, publicClient, SpyContract);
        const maxSpyCount = await getMaxSpyCount(nationId, publicClient, SpyContract);

        setSpyDetails({
          warBucksBalance: (warBuckBalance / BigInt(10 ** 18)).toLocaleString(),
          spyCount: spyCount.toString(),
          costPerSpy: (spyCost).toString(),
          getMaxSpyCount: maxSpyCount.toString(),
        });

      } catch (error) {
        console.error("Error fetching infrastructure details:", error);
      }
    };

    fetchBuySpyDetails();
  }, [nationId, publicClient, SpyContract, TreasuryContract, refreshTrigger]);

  const handleCalculateCost = async (amount: any) => {
    if (!amount || !nationId || !publicClient || !SpyContract) {
      setErrorMessage("Please enter a valid level.");
      return;
    }

    try {
      const costPerSpy = BigInt(spyDetails.costPerSpy.replace(/,/g, ""));
      const cost = (BigInt(amount) * costPerSpy).toString();

      setCost(BigInt(costPerSpy).toString());

      setErrorMessage("");
    } catch (error) {
      console.error("Error calculating cost per spy:", error);
      setErrorMessage("Failed to calculate cost. Please try again.");
    }
  };

  const handleBuySpies = async (amount : any) => {
          
    if (!nationId || !publicClient || !SpyContract || !walletAddress || !cost) {
      setErrorMessage("Missing required information to proceed with the purchase.");
      return;
    }

    const contractData = contractsData.SpyContract;
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

        const data = contract.interface.encodeFunctionData("buySpies", [
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

        await buySpies(Number(amount), nationId, publicClient, SpyContract, writeContractAsync);
        setRefreshTrigger(!refreshTrigger);
        setErrorMessage("");
        alert("Spies purchased successfully!");

      } catch (error: any) {
        const errorMessage = parseRevertReason(error);
        console.error("Transaction failed:", errorMessage);
        alert(`Transaction failed: ${errorMessage}`);
      }
  }

  return (
    <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
        <h2 className="text-2xl font-bold text-primary-content text-center mb-4">🕵️ Buy Spies</h2>

        {/* Error Message */}
        {errorMessage && (
            <div className="mt-4 p-4 bg-error text-error-content rounded-lg shadow-md">
                {errorMessage}
            </div>
        )}

        {/* Spy Details Table */}
        <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
            <thead className="bg-primary text-primary-content">
                <tr>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Value</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(spyDetails).map(([key, value]) => (
                    <tr key={key} className="border-b border-neutral">
                        <td className="p-3 capitalize">{key.replace(/([A-Z])/g, " $1")}</td>
                        <td className="p-3">{value !== null ? value : "Loading..."}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Spy Purchase Section */}
        <div className="bg-base-200 p-4 rounded-lg shadow-md">
            <label className="block text-sm font-medium mb-2 text-primary-content">
                Enter Amount:
            </label>
            <input
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="input input-bordered w-full bg-base-100 text-base-content"
                placeholder="Enter amount to buy"
            />

            <button
                onClick={() => handleCalculateCost(amountInput)}
                className="btn btn-accent w-full mt-4"
            >
                🕵️ Calculate Spy Purchase Cost
            </button>

            {cost !== null && (
                <div className="mt-4 p-4 bg-info text-info-content rounded-lg shadow-md text-center">
                    <strong>Cost per Spy:</strong> {cost} War Bucks
                </div>
            )}

            {cost !== null && (
                <button
                    onClick={() => handleBuySpies(amountInput)}
                    className="btn btn-error w-full mt-4 text-lg"
                >
                    🕵️ Buy {amountInput} Spies for {Number(amountInput) * Number(cost)} War Bucks
                </button>
            )}
        </div>
    </div>
  );
};

export default BuySpies;
