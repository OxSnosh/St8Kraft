"use client";

import React, { useState, useEffect } from "react";
import { usePublicClient, useAccount, useWriteContract } from "wagmi";
import { useSearchParams } from "next/navigation";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useTheme } from "next-themes";
import { checkBalance, addFunds, withdrawFunds } from "~~/utils/treasury";
import { BigNumber } from "ethers";
import { checkOwnership } from "~~/utils/countryMinter";
import { balanceOf } from "~~/utils/warbucks";
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';

const DepositWithdraw = () => {
  const { theme } = useTheme();
  const { address: walletAddress } = useAccount();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const searchParams = useSearchParams();
  const CountryMinterContract = contractsData?.CountryMinter;
  const TreasuryContract = contractsData?.TreasuryContract;
  const WarBucks = contractsData?.WarBucks;

  const { writeContractAsync } = useWriteContract();
  const nationId = searchParams.get("id");

  const [formData, setFormData] = useState({
    withdrawFunds: "",
    depositFunds: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [balances, setBalances] = useState({ balance: "0", warBucksBalance: "0" });

  const updateFunctions: { 
    [key: string]: (nationId: string, publicClient: any, treasuryContract: any, amount: BigNumber, writeContractAsync: any) => Promise<any> 
  } = {
      withdrawFunds: withdrawFunds,
      depositFunds: addFunds,
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (field: string, value: string) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!nationId) {
        setErrorMessage("Nation ID not found.");
        setLoading(false);
        return;
    }
    if (!walletAddress) {
        setErrorMessage("Wallet not connected.");
        setLoading(false);
        return;
    }
    if (!publicClient || !TreasuryContract || !CountryMinterContract || !writeContractAsync) {
        setErrorMessage("Missing required dependencies to process the update.");
        setLoading(false);
        return;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();

        // Check ownership
        const owner = await checkOwnership(nationId, walletAddress, publicClient, CountryMinterContract);
        if (!owner) throw new Error("You do not own this nation.");

        // Determine the update function
        const updateFunction = updateFunctions[field as keyof typeof updateFunctions];
        if (!updateFunction) throw new Error(`Update function not found for ${field}`);

        // Convert value to BigNumber safely
        let scaledValue;
        try {
            scaledValue = ethers.utils.parseUnits(value, 18);
            if (scaledValue.gt(ethers.constants.MaxUint256)) {
                throw new Error("Value exceeds contract limit.");
            }
        } catch (error) {
            setErrorMessage("Invalid amount entered.");
            setLoading(false);
            return;
        }

        console.log(`Executing ${field} with: Nation ID: ${nationId}, Amount: ${scaledValue.toString()}`);

        // Execute transaction
        await updateFunction(nationId, publicClient, TreasuryContract, scaledValue, writeContractAsync);

        setSuccessMessage(`${field.replace(/([A-Z])/g, " $1")}: ${value}`);
        setFormData((prev) => ({ ...prev, [field]: "" }));
        fetchValues();
        setErrorMessage("");

    } catch (error: any) {
        const errorMessage = parseRevertReason(error) || error.message || `Failed to update ${field}.`;
        console.error("Transaction failed:", errorMessage);
        setErrorMessage(`Transaction failed: ${errorMessage}`);
    } finally {
        setLoading(false);
    }
};


  const formatBalance = (balance: string) => {
    const formatted = (BigInt(balance) / BigInt(10 ** 18)).toLocaleString();
    return formatted;
  };

  const fetchValues = async () => {
    if (!nationId || !walletAddress || !publicClient || !TreasuryContract || !WarBucks) return;

    try {
      const balance = await checkBalance(nationId, publicClient, TreasuryContract);
      const warBucksBalance = await balanceOf(walletAddress, publicClient, WarBucks);

      setBalances({ balance: balance.toString(), warBucksBalance: warBucksBalance.toString() });
    } catch (error) {
      console.error("Error fetching values:", error);
    }
  };

  useEffect(() => {
    fetchValues();
  }, [nationId, walletAddress]);

  return (
    <div className="w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
        <h2 className="text-2xl font-bold text-primary-content text-center mb-4">🏦 Manage Nation Funds</h2>
        <p className="text-sm text-center mb-4">Deposit or Withdraw WarBucks for your nation.</p>

        {/* Balance Table */}
        <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
            <thead className="bg-primary text-primary-content">
                <tr>
                    <th className="p-3 text-left">Nation Balance (WBX)</th>
                    <th className="p-3 text-left">Wallet Balance (WBX)</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-b border-neutral">
                    <td className="p-3">{formatBalance(balances.balance)}</td>
                    <td className="p-3">{formatBalance(balances.warBucksBalance)}</td>
                </tr>
            </tbody>
        </table>

        {/* Deposit & Withdraw Forms */}
        {Object.entries(formData).map(([key, value]) => (
            <form
                key={key}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(key, value);
                }}
                className="flex flex-col gap-4 mb-6 bg-base-200 p-4 rounded-lg shadow-md"
            >
                <label className="text-lg font-semibold text-primary">
                    {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                    type="text"
                    placeholder="Enter amount (WBX)"
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="input input-bordered w-full bg-base-100 text-base-content"
                />
                <button
                    type="submit"
                    className="btn btn-accent w-full"
                    disabled={loading}
                >
                    {loading ? "Processing..." : `${key.replace(/([A-Z])/g, " $1")}`}
                </button>
            </form>
        ))}

        {/* Success & Error Messages */}
        {successMessage && <p className="text-green-500 text-center mt-2">{successMessage}</p>}
        {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}
    </div>
  );
};

export default DepositWithdraw;
