"use client";

import React, { useEffect, useState } from "react";
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
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';

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

  const functionMappings: { [key: string]: string } = {
    rulerName: "setRulerName",
    nationName: "setNationName",
    capitalCity: "setCapitalCity",
    nationSlogan: "setNationSlogan",
    alliance: "setAlliance",
    team: "setTeam",
    government: "setGovernment",
    religion: "setReligion",
  };

  const stringFunctionFields = new Set([
    "rulerName",
    "nationName",
    "capitalCity",
    "nationSlogan",
    "alliance",
  ]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

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
    if (!countryParametersContract || !publicClient || !writeContractAsync) {
        setErrorMessage("Missing required dependencies to update nation details.");
        setLoading(false);
        return;
    }
    if (!value.trim()) {
        setErrorMessage(`${field.replace(/([A-Z])/g, " $1")} cannot be empty.`);
        setLoading(false);
        return;
    }



    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();

        // **Check ownership**
        const owner = await checkOwnership(nationId, walletAddress, publicClient, CountryMinterContract);
        if (!owner) {
            setErrorMessage("You do not own this nation.");
            setLoading(false);
            return;
        }

        const parsedNationId = parseInt(nationId, 10);
        if (isNaN(parsedNationId)) {
            setErrorMessage("Invalid nation ID: Not a number.");
            setLoading(false);
            return;
        }

        const balance = await checkBalance(walletAddress, publicClient, TreasuryContract);
        if (balance < 20000000 && (field === "rulerName" || field === "nationName")) {
          setErrorMessage("Insufficient balance to update " + field.replace(/([A-Z])/g, ' $1'));
          setLoading(false);
          return;
        }

        let formattedArgs: any[];

        if (["rulerName", "nationName", "capitalCity", "nationSlogan", "alliance"].includes(field)) {
            formattedArgs = [value, parsedNationId]; // ✅ Order: (value, uint)
        } else if (["team", "government", "religion"].includes(field)) {
            const parsedValue = parseInt(value, 10);
            if (isNaN(parsedValue)) {
                setErrorMessage(`Invalid number input for ${field}. Please enter a valid number.`);
                setLoading(false);
                return;
            }
            formattedArgs = [parsedNationId, parsedValue]; // ✅ Order: (uint, value)
        } else {
            setErrorMessage(`No matching function found for ${field}`);
            setLoading(false);
            return;
        }

        console.log(`Executing function: ${field} with params:`, formattedArgs);

        // ✅ Call the correct update function
        await updateFunctions[field](parsedNationId.toString(), publicClient, countryParametersContract, value, writeContractAsync);

        setSuccessMessage(`${field.replace(/([A-Z])/g, " $1")} updated successfully to: ${value}`);
        setFormData(prev => ({ ...prev, [field]: "" })); // Reset field after update
        setErrorMessage(""); // Clear any previous errors

    } catch (error: any) {
        const errorMessage = parseRevertReason(error) || error.message || `Failed to update ${field}.`;
        console.error("Transaction failed:", errorMessage);
        setErrorMessage(`Transaction failed: ${errorMessage}`);
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="font-special p-6 border-l-4 rounded-lg shadow-center bg-aged-paper text-base-content border-primary transition-all">
      <h3 className="text-2xl font-bold text-primary-content text-center"><a href="gameplay/#country-parameters">Update Nation Details</a></h3>
      <p className="text-sm text-center text-secondary-content mb-4">Modify your nation's attributes below.</p>


      {successMessage && (
        <p className="mt-4 text-center text-sm text-success-content bg-success p-2 rounded-lg">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="mt-4 text-center text-sm text-error-content bg-error p-2 rounded-lg">{errorMessage}</p>
      )}

      {Object.entries(formData).map(([key, value]) => (
        <form key={key} onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(key as keyof typeof formData, value);
          }} className="p-4 bg-base-200 rounded-lg shadow-md mb-4">
          <label className="text-sm font-semibold text-primary">{key.replace(/([A-Z])/g, ' $1')}</label>
          <input type="text" placeholder={`Enter New ${key.replace(/([A-Z])/g, ' $1')}`} value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="input input-bordered w-full bg-base-100 text-base-content mt-1"/>
          <button type="submit" className="btn btn-primary w-full mt-3 disabled:opacity-50" disabled={loading}>
            {loading ? "Updating..." : `Update ${key.replace(/([A-Z])/g, ' $1')}`}
          </button>
          {(key === "rulerName" || key === "nationName") && (
            <p className="text-xs text-warning mt-1">⚠️ Updating this will cost 20,000,000 WBX</p>
          )}
        </form>
      ))}
    </div>
  );
};

export default GovernmentDetails;
