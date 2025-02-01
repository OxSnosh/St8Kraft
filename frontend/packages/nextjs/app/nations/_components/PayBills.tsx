"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { payBills, getBillsPayable, calculateDailyBillsFromInfrastructure, calculateDailyBillsFromMilitary, calculateDailyBillsFromImprovements } from "~~/utils/bills"
import { checkOwnership } from "~~/utils/countryMinter";
import { useTheme } from "next-themes";


const PayBills = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const BillsContract = contractsData?.BillsContract;
    const InfrastructureContract = contractsData?.InfrastructureContract;
    const CountryMinterContract = contractsData?.CountryMinter;
    const MilitaryContract = contractsData?.MilitaryContract;
    
    const { writeContractAsync } = useWriteContract();

    const [taxDetails, setTaxDetails] = useState({
        billsPayable: "",
        billsFromInfrastructure: "",
        billsFromMilitary: "",
        billsFromImprovements: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchTaxDetails = async () => {
            if (!nationId || !publicClient || !BillsContract || !InfrastructureContract) return;

            try {
                const billsPayable = await getBillsPayable(nationId, publicClient, BillsContract);
                const billsFromInfrastructure = await calculateDailyBillsFromInfrastructure(nationId, publicClient, BillsContract);
                const billsFromMilitary = await calculateDailyBillsFromMilitary(nationId, publicClient, BillsContract);
                const billsFromImprovements = await calculateDailyBillsFromImprovements(nationId, publicClient, BillsContract);

                console.log("billsPayable", billsPayable);
                console.log("billsFromInfrastructure", billsFromInfrastructure);
                console.log("billsFromMilitary", billsFromMilitary);
                console.log("billsFromImprovements", billsFromImprovements);

                setTaxDetails({
                    billsPayable: (Number(billsPayable) / 10 ** 18).toLocaleString(),
                    billsFromInfrastructure: (Number(billsFromInfrastructure).toLocaleString()),
                    billsFromMilitary: (Number(billsFromMilitary).toLocaleString()),
                    billsFromImprovements: (Number(billsFromImprovements).toLocaleString()),
                });
            } catch (error) {
                console.error("Error fetching tax details:", error);
            }
        };

        fetchTaxDetails();
    }, [nationId, publicClient, BillsContract, InfrastructureContract]);

    const handlePayBills = async () => {
        if (!nationId || !publicClient || !BillsContract || !writeContractAsync) {
            console.error("Missing required parameters for collectTaxes");
            setErrorMessage("Missing required parameters.");
            return;
        }
    
        try {
            await payBills(nationId, publicClient, BillsContract, writeContractAsync);

            setErrorMessage("");
        } catch (error) {
    
            if (!nationId) {
                throw new Error("Nation ID is undefined");
            }
            if (!walletAddress) {
                throw new Error("Waller Address is undefined");
            }
            let owner = await checkOwnership(nationId, walletAddress, publicClient, CountryMinterContract);
            if (!owner) {
                setErrorMessage("You are not the ruler of this nation");
            } else {    
                setErrorMessage("Error paying bills");
            }

            setTimeout(() => {
                setErrorMessage("");
            }, 6000);
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
                            <td className="border border-gray-300 px-4 py-2">{value !== null ? value : "Loading..."}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button 
                onClick={handlePayBills} 
                className={`mt-4 px-4 py-2 rounded hover:opacity-80 ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'}`}
            >
                Collect Now
            </button>
        </div>
    );
};

export default PayBills;