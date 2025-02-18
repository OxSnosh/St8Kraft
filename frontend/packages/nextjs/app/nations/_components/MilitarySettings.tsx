"use client";

import React, { useState, useEffect } from "react";
import { usePublicClient, useAccount, useWriteContract } from "wagmi";
import { useSearchParams } from "next/navigation";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useTheme } from "next-themes";
import { toggleWarPeacePreference, updateDefconLevel, updateThreatLevel, getWarPeacePreference } from "~~/utils/military";
import { checkBalance } from "~~/utils/treasury";
import { checkOwnership } from "~~/utils/countryMinter";
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';

const MilitarySettings = () => {
  const { theme } = useTheme();
  const { address: walletAddress } = useAccount();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const searchParams = useSearchParams();
  const CountryMinterContract = contractsData?.CountryMinter;
  const MilitaryContract = contractsData?.MilitaryContract;

  const { writeContractAsync } = useWriteContract();
  const nationId = searchParams.get("id");

  const [formData, setFormData] = useState({
    DEFCON: "",
    ThreatLevel: "",
  });
  const [warPeaceStatus, setWarPeaceStatus] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let  status : any

  useEffect(() => {
    const fetchWarPeaceStatus = async () => {
      console.log(nationId, MilitaryContract)
      if (nationId && MilitaryContract) {
        try {
          status = await getWarPeacePreference(nationId, publicClient, MilitaryContract);
          console.log("W/P STATUS", status)
          setWarPeaceStatus(status[0]);
        } catch (error) {
          console.error("Failed to fetch war/peace status", error);
        }
      }
    };
    fetchWarPeaceStatus();
  }, [nationId, MilitaryContract]);
  
  const updateFunctions: { [key: string]: Function } = {
    DEFCON: updateDefconLevel,
    ThreatLevel: updateThreatLevel,
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (field: keyof typeof formData, value: string) => {
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
    if (!publicClient || !MilitaryContract || !CountryMinterContract || !writeContractAsync) {
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
        if (!owner) {
            throw new Error("You do not own this nation.");
        }

        // Determine the update function
        const updateFunction = updateFunctions[field];
        if (!updateFunction) {
            throw new Error(`Update function not found for ${field}`);
        }

        // Simulate transaction before execution
        const contract = new ethers.Contract(MilitaryContract.address, MilitaryContract.abi as ethers.ContractInterface, signer);
        const data = contract.interface.encodeFunctionData(field, [nationId, value]);

        try {
            const result = await provider.call({
                to: MilitaryContract.address,
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
        await updateFunction(nationId, publicClient, MilitaryContract, value, writeContractAsync);

        setSuccessMessage(`${field.replace(/([A-Z])/g, " $1")} updated successfully to: ${value}`);
        setFormData((prev) => ({ ...prev, [field]: "" }));
        setErrorMessage(""); // Clear error message on success

    } catch (error: any) {
        const errorMessage = parseRevertReason(error) || error.message || `Failed to update ${field}.`;
        console.error("Transaction failed:", errorMessage);
        setErrorMessage(`Transaction failed: ${errorMessage}`);
    } finally {
        setLoading(false);
    }
};


const handleToggleWarPeace = async () => {
  setLoading(true);
  setErrorMessage("");

  // Early validation checks
  if (!nationId) {
      setErrorMessage("Nation ID not found.");
      setLoading(false);
      return;
  }
  if (!publicClient || !MilitaryContract || !writeContractAsync) {
      setErrorMessage("Missing required dependencies to toggle war/peace preference.");
      setLoading(false);
      return;
  }

  try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      // Simulate transaction before execution
      const contract = new ethers.Contract(MilitaryContract.address, MilitaryContract.abi as ethers.ContractInterface, signer);
      const data = contract.interface.encodeFunctionData("toggleWarPeacePreference", [nationId]);

      try {
          const result = await provider.call({
              to: MilitaryContract.address,
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
      await toggleWarPeacePreference(nationId, publicClient, MilitaryContract, writeContractAsync);

      // Fetch updated war/peace status
      const [isAtWar, daysLeft] = await getWarPeacePreference(nationId, publicClient, MilitaryContract);
      setWarPeaceStatus(isAtWar);

      setSuccessMessage(`War/peace preference updated successfully. ${isAtWar ? "Your nation is now at war." : "Your nation is now at peace."}`);
  } catch (error: any) {
      let errorMessage = parseRevertReason(error) || error.message || "Failed to toggle war/peace preference.";
      console.error("Transaction failed:", errorMessage);
      
      // Attempt to fetch cooldown period in case of error
      try {
          let daysLeft = "";
          if (nationId) {
              [, daysLeft] = await getWarPeacePreference(nationId, publicClient, MilitaryContract);
          }
          setErrorMessage(`Failed to toggle war/peace preference. You need to wait 7 days before switching back to peace mode. You have ${daysLeft} days remaining.`);
      } catch (innerError) {
          console.error("Failed to fetch cooldown period after error:", innerError);
          setErrorMessage(errorMessage); // Fallback to initial error message
      }
  } finally {
      setLoading(false);
  }
};


  return (
    <div
      className={`p-6 border-l-4 transition-all ${
        theme === "dark"
          ? "bg-gray-900 border-blue-500 text-white"
          : "bg-gray-100 border-blue-500 text-gray-900"
      }`}
    >
      <h3 className="text-lg font-semibold">Military Settings</h3>
      <p className="text-sm mb-4">Modify your nation's military settings below.</p>

      {/* War/Peace Status Display */}
      {warPeaceStatus !== null && (
        <div className="mb-4 p-4 rounded border shadow-sm">
          {warPeaceStatus ? (
            <p className="text-red-500 font-bold">Nation is ready for war</p>
          ) : (
            <p className="text-green-500 font-bold">Nation is in peace mode</p>
          )}
          <button
            onClick={handleToggleWarPeace}
            className={`mt-2 px-4 py-2 rounded transition-all ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            Toggle War/Peace
          </button>
        </div>
      )}

      {Object.entries(formData).map(([key, value]) => (
        <form
          key={key}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(key as keyof typeof formData, value);
          }}
          className="flex flex-col space-y-4 mb-4"
        >
          <label className="text-sm">{key.replace(/([A-Z])/g, " $1")}</label>
          <input
            type="text"
            placeholder={`Enter New ${key.replace(/([A-Z])/g, " $1")}`}
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
            {loading ? "Updating..." : `Update ${key.replace(/([A-Z])/g, " $1")}`}
          </button>
        </form>
      ))}

      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default MilitarySettings;
