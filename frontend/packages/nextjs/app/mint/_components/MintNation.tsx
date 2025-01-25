"use client";

import React, { useState } from "react";
import { useReadContract, useWaitForTransactionReceipt, useWriteContract, useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";

export function MintNation() {
  const [form, setForm] = useState({
    nationName: "",
    rulerName: "",
    capitalCity: "",
    nationSlogan: "",
  });

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isPending, setIsPending] = useState(false);

  const { address: walletAddress } = useAccount(); // Get connected wallet address
  const contractsData = useAllContracts(); // Retrieve all contracts
  const countryMinterContract = contractsData?.CountryMinter; // Access the CountryMinter contract

  const { writeContractAsync } = useWriteContract();

  // Explicitly define the type for `ownedTokenIds`
  const { data: ownedTokenIds } = useReadContract<string[]>({
    abi: countryMinterContract?.abi,
    address: countryMinterContract?.address,
    functionName: "tokensOfOwner",
    args: walletAddress ? [walletAddress] : undefined, // Ensure `args` is passed as an array
    enabled: !!walletAddress, // Ensure the query only runs when a wallet is connected
  });

  const { data: txReceipt } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleWrite = async () => {
    if (!writeContractAsync || !countryMinterContract?.abi || !countryMinterContract?.address) {
      alert("Contract or connection is not ready. Please check your setup.");
      return;
    }

    try {
      setIsPending(true);

      const tx = await writeContractAsync({
        abi: countryMinterContract.abi,
        address: countryMinterContract.address,
        functionName: "generateCountry",
        args: [
          form.nationName,
          form.rulerName,
          form.capitalCity,
          form.nationSlogan,
        ],
      });

      setTxHash(tx); // Save the transaction hash
      alert("Transaction submitted!");
    } catch (error) {
      console.error("Error while minting the nation:", error);
      alert("An error occurred while minting the nation.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="text-center mt-8 bg-secondary p-10">
      <h1 className="text-4xl my-0">Mint A Nation</h1>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nation Name"
          className="input input-primary"
          value={form.nationName}
          onChange={(e) => setForm((prev) => ({ ...prev, nationName: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Ruler Name"
          className="input input-primary"
          value={form.rulerName}
          onChange={(e) => setForm((prev) => ({ ...prev, rulerName: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Capital City"
          className="input input-primary"
          value={form.capitalCity}
          onChange={(e) => setForm((prev) => ({ ...prev, capitalCity: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Nation Slogan"
          className="input input-primary"
          value={form.nationSlogan}
          onChange={(e) => setForm((prev) => ({ ...prev, nationSlogan: e.target.value }))}
        />
      </div>

      <div className="flex justify-between gap-2 mt-4">
        <button
          className="btn btn-primary"
          disabled={isPending || !writeContractAsync}
          onClick={handleWrite}
        >
          {isPending ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "Mint Nation"
          )}
        </button>
      </div>

      {txHash && (
        <div className="mt-4 text-left">
          <p className="font-medium">Transaction Hash:</p>
          <p>{txHash}</p>
          {txReceipt ? (
            <p className="text-green-500">Transaction confirmed in block: {txReceipt.blockNumber}</p>
          ) : (
            <p className="text-yellow-500">Waiting for confirmation...</p>
          )}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl">Your Minted Nations</h2>
        {ownedTokenIds?.length ? (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {ownedTokenIds.map((tokenId : any) => (
              <div key={tokenId} className="card bg-base-100 shadow-md p-4">
                <p className="text-lg font-bold">Nation #{tokenId}</p>
                <p>Details will be fetched from metadata...</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4">No nations minted yet.</p>
        )}
      </div>
    </div>
  );
}
