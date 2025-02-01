"use client";

import { useEffect, useState, useCallback } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
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

    const handleCollectTaxes = async () => {
        if (!nationId || !publicClient || !TaxesContract || !writeContractAsync) {
            setErrorMessage("Missing required parameters.");
            return;
        }

        try {
            await collectTaxes(nationId, publicClient, TaxesContract, writeContractAsync);
            setErrorMessage("");
            fetchTaxDetails();
        } catch (error) {
            let owner = walletAddress ? await checkOwnership(nationId, walletAddress, publicClient, CountryMinterContract) : false;
            let war = await getWarPeacePreference(nationId, publicClient, MilitaryContract);

            if (!owner) {
                setErrorMessage("You are not the ruler of this nation");
            } else if (!war) {
                setErrorMessage("You cannot collect taxes in peace mode");
            } else {
                setErrorMessage("Error collecting taxes");
            }

            setTimeout(() => setErrorMessage(""), 6000);
        }
    };

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