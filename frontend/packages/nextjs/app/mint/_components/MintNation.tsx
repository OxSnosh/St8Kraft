"use client";

import React, { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract, useAccount, usePublicClient } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { keccak256 } from "viem";

export function MintNation() {
  const [form, setForm] = useState({
    rulerName: "",
    nationName: "",
    capitalCity: "",
    nationSlogan: "",
  });

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isPending, setIsPending] = useState(false);
  const [nations, setNations] = useState<Array<any>>([]);

  const { address: walletAddress } = useAccount();
  const contractsData = useAllContracts();
  const countryMinterContract = contractsData?.CountryMinter;
  const countryParametersContract = contractsData?.CountryParametersContract;

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const { data: txReceipt } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    const fetchNationDetails = async () => {
      if (!countryMinterContract || !walletAddress || !publicClient || !countryParametersContract) {
        console.error("Missing required data: countryMinterContract, walletAddress, or publicClient.");
        return;
      }

      try {
        // Fetch token IDs owned by the wallet
        const tokenIds = await publicClient.readContract({
          abi: countryMinterContract.abi,
          address: countryMinterContract.address,
          functionName: "tokensOfOwner",
          args: [walletAddress],
        });

        if (!Array.isArray(tokenIds) || tokenIds.length === 0) {
          console.warn("No tokens found for this wallet.");
          setNations([]);
          return;
        }

        console.log("Fetched Token IDs:", tokenIds);

        // Fetch nation details for each tokenId
        const details = await Promise.all(
          tokenIds.map(async (tokenId) => {
            const tokenIdString = tokenId.toString(); // Convert BigInt to string

            try {
              const nationName = await publicClient.readContract({
                abi: countryParametersContract.abi,
                address: countryParametersContract.address,
                functionName: "getNationName",
                args: [tokenIdString],
              });

              const rulerName = await publicClient.readContract({
                abi: countryParametersContract.abi,
                address: countryParametersContract.address,
                functionName: "getRulerName",
                args: [tokenIdString],
              });

              const capitalCity = await publicClient.readContract({
                abi: countryParametersContract.abi,
                address: countryParametersContract.address,
                functionName: "getCapital",
                args: [tokenIdString],
              });

              const nationSlogan = await publicClient.readContract({
                abi: countryParametersContract.abi,
                address: countryParametersContract.address,
                functionName: "getSlogan",
                args: [tokenIdString],
              });

              return { tokenId: tokenIdString, nationName, rulerName, capitalCity, nationSlogan };
            } catch (err) {
              console.error(`Error fetching details for token ${tokenIdString}:`, err);
              return { tokenId: tokenIdString, nationName: null, rulerName: null, capitalCity: null, nationSlogan: null };
            }
          })
        );

        console.log("Fetched Nation Details:", details);
        setNations(details);
      } catch (error) {
        console.error("Error fetching token IDs or nation details:", error);
      }
    };

    fetchNationDetails();
  }, [walletAddress, countryMinterContract, countryParametersContract, publicClient]);

  const handleWrite = async () => {
    if (!writeContractAsync || !countryMinterContract?.abi || !countryMinterContract?.address) {
      alert("Contract or connection is not ready. Please check your setup.");
      return;
    }
  
    if (!publicClient) {
      console.error("Public client is not initialized.");
      return;
    }
  
    try {
      setIsPending(true);
  
      const tx = await writeContractAsync({
        abi: countryMinterContract.abi,
        address: countryMinterContract.address,
        functionName: "generateCountry",
        args: [
          form.rulerName,
          form.nationName,
          form.capitalCity,
          form.nationSlogan,
        ],
      });
  
      setTxHash(tx); // Save the transaction hash
      alert("Transaction submitted!");
  
      // Wait for the transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
      console.log("Transaction receipt:", receipt);
  
      // Manually encode the Transfer event signature
      const transferEventSignature = keccak256(
        Buffer.from("Transfer(address,address,uint256)")
      );
  
      // Get the new token ID from the event logs
      const newTokenId = receipt.logs.find(
        (log) => log.topics[0] === transferEventSignature
      )?.topics[3]; // Topics[3] contains the token ID in Transfer events
  
      if (newTokenId) {
        const tokenIdString = BigInt(newTokenId).toString(); // Convert token ID from hex to string
  
        // Fetch details for the newly minted token
        const nationName = await publicClient.readContract({
          abi: countryParametersContract.abi,
          address: countryParametersContract.address,
          functionName: "getNationName",
          args: [tokenIdString],
        });
  
        const rulerName = await publicClient.readContract({
          abi: countryParametersContract.abi,
          address: countryParametersContract.address,
          functionName: "getRulerName",
          args: [tokenIdString],
        });
  
        const capitalCity = await publicClient.readContract({
          abi: countryParametersContract.abi,
          address: countryParametersContract.address,
          functionName: "getCapital",
          args: [tokenIdString],
        });
  
        const nationSlogan = await publicClient.readContract({
          abi: countryParametersContract.abi,
          address: countryParametersContract.address,
          functionName: "getSlogan",
          args: [tokenIdString],
        });
  
        // Add the new nation to the state
        setNations((prev) => [
          ...prev,
          { tokenId: tokenIdString, nationName, rulerName, capitalCity, nationSlogan },
        ]);
      }
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
          placeholder="Ruler Name"
          className="input input-primary"
          value={form.rulerName}
          onChange={(e) => setForm((prev) => ({ ...prev, rulerName: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Nation Name"
          className="input input-primary"
          value={form.nationName}
          onChange={(e) => setForm((prev) => ({ ...prev, nationName: e.target.value }))}
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
        {nations.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {nations.map(({ tokenId, nationName, rulerName, capitalCity, nationSlogan }) => (
              <div key={tokenId} className="card bg-base-100 shadow-md p-4">
                <p className="text-lg font-bold">Nation {tokenId}</p>
                <p>Ruler: {rulerName}</p>
                <p>Nation Name: {nationName}</p>
                <p>Capital: {capitalCity}</p>
                <p>Slogan: {nationSlogan}</p>
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


