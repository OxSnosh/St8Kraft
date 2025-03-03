"use client";

import React, { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract, useAccount, usePublicClient } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { keccak256 } from "viem";
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';

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

      const contractData = contractsData.CountryMinter;
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

          const data = contract.interface.encodeFunctionData("generateCountry", [
              form.rulerName,
              form.nationName,
              form.capitalCity,
              form.nationSlogan,
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
      
          // Wait for the transaction receipt
          const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
      
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
          alert("Nation minted successfully!");
      } catch (error: any) {
          const errorMessage = parseRevertReason(error);
          console.error("Transaction failed:", errorMessage);
          alert(`Transaction failed: ${errorMessage}`);
      }
  }

  return (
    <div className="font-special text-center bg-secondary p-10 flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/mintnationspage_expanded.jpg')",
        backgroundSize: "5440px 3300px",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center -330px",
        width: "100vw",
        height: "2800px",
        position: "absolute",
        top: "0",
        left: "0"
      }}>
      
      <div className="flex flex-col gap-4 w-full max-w-md" style={{ position: "absolute", top: "270px", left: "47%", transform: "translateX(-50%)" }}>
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
          onClick={handleWrite}
          style={{ alignSelf: "center" } as React.CSSProperties}>
          {isPending ? <span className="loading loading-spinner loading-xs"></span> : <span style={{ fontSize: "24px", fontWeight: "bold" }}>Mint Nation</span>}
        </button>
      </div>
      
      <div className="w-full flex flex-col justify-center items-center text-white min-h-screen">
  {nations.length === 0 ? (
    <p className="text-center">You do not have any minted nations yet.</p>
  ) : (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-4"
      style={{ minHeight: "800px", marginTop: "800px" }}
    >
      {nations.map((nation, index) => (
        <a
          key={index}
          href={`/nations?id=${nation.tokenId}`}
          className="relative rounded-lg font-orbitron text-black text-center overflow-hidden"
          style={{
            width: "225px",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              backgroundImage: `url('/post-it-note.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              width: "100%",
              height: "100%",
            }}
          ></div>

          <div className="font-special relative z-10 bg-opacity-90 p-4 rounded-lg">
            <h3 className="text-xl font-special">
              {nation.tokenId} : {nation.nationName}
            </h3>
            <p>Ruler: {nation.rulerName}</p>
            <p>Capital: {nation.capitalCity}</p>
            <p>Slogan: {nation.nationSlogan}</p>
          </div>
        </a>
      ))}
    </div>
  )}
</div>

    </div>
  );
}
