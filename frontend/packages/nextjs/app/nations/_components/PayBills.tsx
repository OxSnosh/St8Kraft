"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { AbiCoder } from "ethers/lib/utils";
import { ethers } from "ethers";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { payBills, getBillsPayable, calculateDailyBillsFromInfrastructure, calculateDailyBillsFromMilitary, calculateDailyBillsFromImprovements } from "~~/utils/bills"
import { checkOwnership } from "~~/utils/countryMinter";
import { useTheme } from "next-themes";
import { getDaysSinceLastBillsPaid } from "~~/utils/treasury";


const PayBills = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const BillsContract = contractsData?.BillsContract;
    const CountryMinterContract = contractsData?.CountryMinter;
    const TreasuryContract = contractsData?.TreasuryContract;
    
    const { writeContractAsync } = useWriteContract();

    const [taxDetails, setTaxDetails] = useState({
        billsPayable: "",
        daysSinceLastBillPayment: "",
        dailyBillsFromInfrastructure: "",
        dailyBillsFromMilitary: "",
        dailyBillsFromImprovements: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    const [refreshTrigger, setRefreshTrigger] = useState(false);

    useEffect(() => {
        const fetchBillsDetails = async () => {
            if (!nationId || !publicClient || !BillsContract || !TreasuryContract) return;

            try {
                const billsPayable = await getBillsPayable(nationId, publicClient, BillsContract);
                const billsFromInfrastructure = await calculateDailyBillsFromInfrastructure(nationId, publicClient, BillsContract);
                const billsFromMilitary = await calculateDailyBillsFromMilitary(nationId, publicClient, BillsContract);
                const billsFromImprovements = await calculateDailyBillsFromImprovements(nationId, publicClient, BillsContract);
                const daysSinceLastBillPayment = await getDaysSinceLastBillsPaid(nationId, publicClient, TreasuryContract);

                setTaxDetails({
                    billsPayable: (Number(billsPayable) / 10 ** 18).toLocaleString(),
                    daysSinceLastBillPayment: daysSinceLastBillPayment.toString(),
                    dailyBillsFromInfrastructure: (Number(billsFromInfrastructure) / 10** 18).toLocaleString(),
                    dailyBillsFromMilitary: (Number(billsFromMilitary) / 10**18).toLocaleString(),
                    dailyBillsFromImprovements: (Number(billsFromImprovements) / 10**18).toLocaleString(),
                });
            } catch (error) {
                console.error("Error fetching tax details:", error);
            }
        };

        fetchBillsDetails();
    }, [nationId, publicClient, BillsContract, TreasuryContract, refreshTrigger]);

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

    // const handlePayBills = async () => {
    //     if (!nationId || !publicClient || !BillsContract || !writeContractAsync) {
    //         console.error("Missing required parameters for payBills");
    //         setErrorMessage("Missing required parameters.");
    //         return;
    //     }

    //     try {
    //         const oldBillsPayable = await getBillsPayable(nationId, publicClient, BillsContract);

    //         await payBills(nationId, publicClient, BillsContract, writeContractAsync);

    //         const newBillsPayable = await getBillsPayable(nationId, publicClient, BillsContract);

    //         if (oldBillsPayable.toString() !== newBillsPayable.toString()) {
    //             setRefreshTrigger(prev => !prev);
    //         }

    //         setErrorMessage("");
    //     } catch (error) {
    //         if (!nationId) {
    //             throw new Error("Nation ID is undefined");
    //         }
    //         if (!walletAddress) {
    //             throw new Error("Wallet Address is undefined");
    //         }
    //         let owner = await checkOwnership(nationId, walletAddress, publicClient, CountryMinterContract);
    //         if (!owner) {
    //             setErrorMessage("You are not the ruler of this nation");
    //         } else {
    //             setErrorMessage("Error paying bills");
    //         }

    //         setTimeout(() => {
    //             setErrorMessage("");
    //         }, 6000);
    //     }
    // };

    const handlePayBills = async () => {
        if (!nationId || !publicClient || !BillsContract || !writeContractAsync) {
            console.error("Missing required parameters for payBills");
            setErrorMessage("Missing required parameters.");
            return;
        }

        const contractData = contractsData.BillsContract;
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

            const data = contract.interface.encodeFunctionData("payBills", [
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
    
            const oldBillsPayable = await getBillsPayable(nationId, publicClient, BillsContract);

            await payBills(nationId, publicClient, BillsContract, writeContractAsync);

            const newBillsPayable = await getBillsPayable(nationId, publicClient, BillsContract);

            if (oldBillsPayable.toString() !== newBillsPayable.toString()) {
                setRefreshTrigger(prev => !prev);
            }

            alert("Bills Paid!");

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
                            <td className="border border-gray-300 px-4 py-2">{value !== null ? value : "Loading..."}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button 
                onClick={handlePayBills} 
                className={`mt-4 px-4 py-2 rounded hover:opacity-80 ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'}`}
            >
                Pay Bills
            </button>
        </div>
    );
};

export default PayBills;