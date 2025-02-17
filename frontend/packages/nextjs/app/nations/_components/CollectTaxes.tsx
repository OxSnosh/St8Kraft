"use client";

import { useEffect, useState, useCallback } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { AbiCoder } from "ethers/lib/utils";
import { ethers } from "ethers";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { 
    getTaxesCollectible, 
    getDailyIncome, 
    getHappiness, 
    getTaxRate, 
    getTaxablePopulationCount, 
    collectTaxes 
} from "~~/utils/taxes";
import { checkOwnership } from "~~/utils/countryMinter";
import { getWarPeacePreference } from "~~/utils/military";
import { useTheme } from "next-themes";

const CollectTaxes = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const TaxesContract = contractsData?.TaxesContract;
    const InfrastructureContract = contractsData?.InfrastructureContract;
    const CountryMinterContract = contractsData?.CountryMinter;
    const MilitaryContract = contractsData?.MilitaryContract;

    const { writeContractAsync } = useWriteContract();

    const [taxDetails, setTaxDetails] = useState({
        taxesCollectible: "",
        dailyIncome: "",
        happiness: "",
        taxRate: "",
        taxablePopulationCount: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [prevTaxesCollectible, setPrevTaxesCollectible] = useState("");

    const fetchTaxDetails = useCallback(async () => {
        if (!nationId || !publicClient || !TaxesContract || !InfrastructureContract) return;

        try {
            const taxesRaw = await getTaxesCollectible(nationId, publicClient, TaxesContract);
            const dailyIncomeRaw = await getDailyIncome(nationId, publicClient, TaxesContract);
            const happinessRaw = await getHappiness(nationId, publicClient, TaxesContract);
            const taxRateRaw = await getTaxRate(nationId, publicClient, InfrastructureContract);
            const taxablePopulationCountRaw = await getTaxablePopulationCount(nationId, publicClient, InfrastructureContract);

            const taxesCollectible = (Number(taxesRaw[1]) / 10 ** 18).toLocaleString();

            setTaxDetails(prevDetails => ({
                ...prevDetails,
                taxesCollectible,
                dailyIncome: Number(dailyIncomeRaw).toLocaleString(),
                happiness: happinessRaw.toString(),
                taxRate: `${taxRateRaw}%`,
                taxablePopulationCount: taxablePopulationCountRaw[0].toString(),
            }));

            setPrevTaxesCollectible(taxesCollectible);
        } catch (error) {
            console.error("Error fetching tax details:", error);
        }
    }, [nationId, publicClient, TaxesContract, InfrastructureContract, prevTaxesCollectible]);

    useEffect(() => {
        fetchTaxDetails();
    }, [fetchTaxDetails]);

    function parseRevertReason(error: any): string {
        if (error?.data) {
            try {
                if (error.data.startsWith("0x08c379a0")) {
                    const decoded = new AbiCoder().decode(
                        ["string"],
                        "0x" + error.data.slice(10)
                    );
                    return decoded[0]; // Extract revert message
                }
            } catch (decodeError) {
                return "Unknown revert reason";
            }
        }
        return error?.message || "Transaction failed";
    }

    // const handleCollectTaxes = async () => {
    //     if (!nationId || !publicClient || !TaxesContract || !writeContractAsync) {
    //         setErrorMessage("Missing required parameters.");
    //         return;
    //     }

    //     try {
    //         await collectTaxes(nationId, publicClient, TaxesContract, writeContractAsync);
    //         setErrorMessage("");
    //         fetchTaxDetails();
    //     } catch (error) {
    //         let owner = walletAddress ? await checkOwnership(nationId, walletAddress, publicClient, CountryMinterContract) : false;
    //         let war = await getWarPeacePreference(nationId, publicClient, MilitaryContract);

    //         if (!owner) {
    //             setErrorMessage("You are not the ruler of this nation");
    //         } else if (!war) {
    //             setErrorMessage("You cannot collect taxes in peace mode");
    //         } else {
    //             setErrorMessage("Error collecting taxes");
    //         }

    //         setTimeout(() => setErrorMessage(""), 6000);
    //     }
    // };

    const handleCollectTaxes = async () => {
        if (!nationId || !publicClient || !TaxesContract || !writeContractAsync) {
            console.error("Missing required parameters for collectTaxes");
            setErrorMessage("Missing required parameters.");
            return;
        }

        const contractData = contractsData.TaxesContract;
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

            const data = contract.interface.encodeFunctionData("collectTaxes", [
                nationId
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
    
            await collectTaxes(nationId, publicClient, TaxesContract, writeContractAsync);

            fetchTaxDetails();

            alert("Taxes Collected!");

        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error("Transaction failed:", errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    }

    return (
        <div className={`p-6 border-l-4 ${theme === 'dark' ? 'bg-gray-800 text-white border-green-400' : 'bg-gray-100 text-black border-green-500'}`}>
            <h3 className="text-lg font-semibold">Collect Taxes</h3>
            <p className="text-sm">Collect taxes from your citizens.</p>

            {errorMessage && (
                <div className="mt-4 p-4 bg-red-500 text-white rounded">
                    {errorMessage}
                </div>
            )}

            <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                    <tr className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}` }>
                        <th className="border border-gray-300 px-4 py-2">Category</th>
                        <th className="border border-gray-300 px-4 py-2">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(taxDetails).map(([key, value]) => (
                        <tr key={key} className="text-center">
                            <td className="border border-gray-300 px-4 py-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                            <td className="border border-gray-300 px-4 py-2">{value || "Loading..."}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button 
                onClick={handleCollectTaxes} 
                className={`mt-4 px-4 py-2 rounded hover:opacity-80 ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'}`}
            >
                Collect Now
            </button>
        </div>
    );
};

export default CollectTaxes;