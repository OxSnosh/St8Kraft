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
    <div className="text-center bg-secondary p-10 flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/mintnationspage.jpg')",
        backgroundSize: "2000px 2000px",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center -330px",
        width: "100vw",
        height: "2000px",
        position: "relative"
      }}>
      
      <div className="flex flex-col gap-4 w-full max-w-md" style={{ position: "absolute", top: "270px", left: "50%", transform: "translateX(-50%)" }}>
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
        <button
          className="btn btn-primary mt-6"
          disabled={isPending || !writeContractAsync}
          onClick={() => {}}
          style={{ alignSelf: "center" }}>
          {isPending ? <span className="loading loading-spinner loading-xs"></span> : <span style={{ fontSize: "24px", fontWeight: "bold" }}>Mint Nation</span>}
        </button>
      </div>
      
      <div className="w-full text-center text-white" style={{ marginTop: "2400px", paddingBottom: "100px" }}>
        {nations.length === 0 ? (
          <p>You do not have any minted nations yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {nations.map((nation, index) => (
              <div key={index} className="p-4 border rounded-lg font-orbitron"
                style={{
                  backgroundImage: "url('/minted_nation_card.jpg')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  width: "300px", /* Adjust to match the image dimensions */
                  height: "300px", /* Adjust to match the image dimensions */
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  textAlign: "center",
                  padding: "20px",
                }}>
                <p><strong>Nation {nation.tokenId}:</strong> {nation.nationName}</p>
                <p><strong>Ruler:</strong> {nation.rulerName}</p>
                <p><strong>Capital:</strong> {nation.capitalCity}</p>
                <p><strong>Slogan:</strong> {nation.nationSlogan}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
