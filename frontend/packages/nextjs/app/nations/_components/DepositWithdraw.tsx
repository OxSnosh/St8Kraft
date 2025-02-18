"use client";

import React, { useState, useEffect } from "react";
import { usePublicClient, useAccount, useWriteContract } from "wagmi";
import { useSearchParams } from "next/navigation";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useTheme } from "next-themes";
import { checkBalance, addFunds, withdrawFunds } from "~~/utils/treasury";
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

  const updateFunctions: { [key: string]: (nationId: string, publicClient: any, treasuryContract: any, amount: number, writeContractAsync: (args: any) => Promise<any>) => Promise<any> } = {
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

    // Early validation checks
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

        const scaledValue = BigInt(value) * BigInt(10 ** 18);

        // Simulate transaction before execution
        const contract = new ethers.Contract(TreasuryContract.address, TreasuryContract.abi as ethers.ContractInterface, signer);
        const data = contract.interface.encodeFunctionData(field, [nationId, Number(scaledValue)]);

        try {
            const result = await provider.call({
                to: TreasuryContract.address,
                data: data,
                from: userAddress,
            });

            console.log("Transaction Simulation Result:", result);

            if (result.startsWith("0x08c379a0")) {
                const errorMessage = parseRevertReason({ data: result });
                setErrorMessage(`Transaction failed: ${errorMessage}`);
                setLoading(false);
                return;
            }
        } catch (simulationError: any) {
            const errorMessage = parseRevertReason(simulationError);
            console.error("Transaction simulation failed:", errorMessage);
            setErrorMessage(`Transaction failed: ${errorMessage}`);
            setLoading(false);
            return;
        }

        // Execute transaction if simulation passes
        await updateFunction(nationId, publicClient, TreasuryContract, Number(scaledValue), writeContractAsync);

        setSuccessMessage(`${field.replace(/([A-Z])/g, " $1")}: ${value}`);
        setFormData((prev) => ({ ...prev, [field]: "" }));
        fetchValues();
        setErrorMessage(""); // Clear error message on success

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
    <div
      className={`p-6 border-l-4 transition-all ${
        theme === "dark"
          ? "bg-gray-900 border-blue-500 text-white"
          : "bg-gray-100 border-blue-500 text-gray-900"
      }`}
    >
      <h3 className="text-lg font-semibold">Manage Nation Funds</h3>
      <p className="text-sm mb-4">Add or Withdraw WarBucks below</p>

      <table className="w-full mb-4 border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Nation Balance</th>
            <th className="border px-4 py-2">WarBucks Balance in Wallet</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">{formatBalance(balances.balance) || "0"}</td>
            <td className="border px-4 py-2">{formatBalance(balances.warBucksBalance) || "0"}</td>
          </tr>
        </tbody>
      </table>

      {Object.entries(formData).map(([key, value]) => (
        <form
          key={key}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(key, value);
          }}
          className="flex flex-col space-y-4 mb-4"
        >
          <label className="text-sm">{key.replace(/([A-Z])/g, " $1")}</label>
          <input
            type="text"
            placeholder={`Amount`}
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className={`p-2 border rounded ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded transition-all ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            disabled={loading}
          >
            {loading ? "Updating..." : `${key.replace(/([A-Z])/g, " $1")}`}
          </button>
        </form>
      ))}

      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default DepositWithdraw;
