"use client";

import React, { useState } from "react";
import { usePublicClient, useAccount, useWriteContract } from "wagmi";
import { useSearchParams } from "next/navigation";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useTheme } from "next-themes";

import { 
  setRulerName,
  setNationName, 
  setCapitalCity, 
  setNationSlogan, 
  setAlliance, 
  setTeam, 
  setGovernment, 
  setReligion
} from "~~/utils/countryParameters";
import { checkBalance } from "~~/utils/treasury";
import { checkOwnership } from "~~/utils/countryMinter";

const GovernmentDetails = () => {
  const { theme } = useTheme();
  const { address: walletAddress } = useAccount();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const searchParams = useSearchParams();
  const countryParametersContract = contractsData?.CountryParametersContract;
  const TreasuryContract = contractsData?.TreasuryContract;
  const CountryMinterContract = contractsData?.CountryMinter;

  const { writeContractAsync } = useWriteContract();
  const nationId = searchParams.get("id");

  const [formData, setFormData] = useState({
    rulerName: "",
    nationName: "",
    capitalCity: "",
    nationSlogan: "",
    alliance: "",
    team: "",
    government: "",
    religion: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Map field names to their corresponding functions
  const updateFunctions: { [key: string]: Function } = {
    rulerName: setRulerName,
    nationName: setNationName,
    capitalCity: setCapitalCity,
    nationSlogan: setNationSlogan,
    alliance: setAlliance,
    team: setTeam,
    government: setGovernment,
    religion: setReligion,
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (field: keyof typeof formData, value: string) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (!nationId) throw new Error("Nation ID not found.");
      if (!walletAddress) throw new Error("Wallet not connected.");
      if (!countryParametersContract) throw new Error("Contract not available.");
      if (!value.trim()) throw new Error(`${field.replace(/([A-Z])/g, ' $1')} cannot be empty.`);

      let owner = await checkOwnership(nationId, walletAddress, publicClient, CountryMinterContract);
      if (!owner) throw new Error("You do not own this nation.");

      const balance = await checkBalance(nationId, publicClient, TreasuryContract);
      if (balance < BigInt(20000000) * BigInt(10 ** 18)) {
        throw new Error(`Insufficient balance. 20,000,000 WB required. You have ${balance / BigInt(10 ** 18)} WB.`);
      }

      const updateFunction = updateFunctions[field]; // ✅ Get the correct function from the mapping
      if (!updateFunction) throw new Error(`Update function not found for ${field}`);

      await updateFunction(nationId, publicClient, countryParametersContract, value, writeContractAsync);

      setSuccessMessage(`${field.replace(/([A-Z])/g, ' $1')} updated successfully to: ${value}`);
      setFormData(prev => ({ ...prev, [field]: "" })); // Reset field after update
    } catch (error: any) {
      setErrorMessage(error.message || `Failed to update ${field}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 border-l-4 transition-all ${theme === "dark" ? "bg-gray-900 border-blue-500 text-white" : "bg-gray-100 border-blue-500 text-gray-900"}`}>
      <h3 className="text-lg font-semibold">Update Nation Details</h3>
      <p className="text-sm mb-4">Modify your nation's attributes below.</p>

      {Object.entries(formData).map(([key, value]) => (
        <form 
          key={key} 
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(key as keyof typeof formData, value);
          }}
          className="flex flex-col space-y-4 mb-4"
        >
          <label className="text-sm">{key.replace(/([A-Z])/g, ' $1')}</label>
          <input
            type="text"
            placeholder={`Enter New ${key.replace(/([A-Z])/g, ' $1')}`}
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className={`p-2 border rounded ${theme === "dark" ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded transition-all ${theme === "dark" ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-600"} text-white`}
            disabled={loading}
          >
            {loading ? "Updating..." : `Update ${key.replace(/([A-Z])/g, ' $1')}`}
          </button>
        </form>
      ))}

      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default GovernmentDetails;
