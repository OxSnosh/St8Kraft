"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { checkBalance } from "~~/utils/treasury";
import { 
    buyYak9,
    buyP51Mustang,
    buyF86Sabre,
    buyMig15,
    buyF100SuperSabre,
    buyF35Lightning,
    buyF15Eagle,
    buySu30Mki,
    buyF22Raptor,
    getYak9Count,
    getP51MustangCount,
    getF86SabreCount,
    getMig15Count,
    getF100SuperSabreCount,
    getF35LightningCount,
    getF15EagleCount,
    getSu30MkiCount,
    getF22RaptorCount,
} from '../../../utils/fighters';
import { useTheme } from "next-themes";
import { ethers } from "ethers";
import { parseRevertReason } from '../../../utils/errorHandling';

const BuyFighters = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const FightersContract = contractsData?.FightersContract;
    const FightersMarketplace1 = contractsData?.FightersMarketplace1;
    const FightersMarketplace2 = contractsData?.FightersMarketplace2;
    const TreasuryContract = contractsData?.TreasuryContract;
    const { writeContractAsync } = useWriteContract();

    interface FightersDetails {
        [key: string]: string;
    }

    const fighterKeyMapping: { [key: string]: string } = {
        yak9: "buyYak9",
        p51Mustang: "buyP51Mustang",
        f86Sabre: "buyF86Sabre",
        mig15: "buyMig15",
        f100SuperSabre: "buyF100SuperSabre",
        f35Lightning: "buyF35Lightning",
        f15Eagle: "buyF15Eagle",
        su30Mki: "buySu30Mki",
        f22Raptor: "buyF22Raptor",
    };

    const allFighters = Object.keys(fighterKeyMapping);

    const defaultFighterDetails: FightersDetails = { 
        yak9: "", 
        p51Mustang: "", 
        f86Sabre: "", 
        mig15: "", 
        f100SuperSabre: "",
        f35Lightning: "",
        f15Eagle: "",
        su30Mki: "",
        f22Raptor: "",
    };

    const [fightersDetails, setFighterDetails] = useState<FightersDetails>({ ...defaultFighterDetails });
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [purchaseAmounts, setPurchaseAmounts] = useState<{ [key: string]: number }>({});

    // const handleBuyFighters = async (key: string) => {
    //     const amount = purchaseAmounts[key] || 1;
    //     const fighterKey = fighterKeyMapping[key] || key;

    //     if (!nationId) {
    //         console.error("Nation ID is null");
    //         return;
    //     }

    //     console.log("Buying fighters:", fighterKey, amount);

    //     if (fighterKey == "buyYak9") {
    //         try {
    //             await buyYak9(
    //                 nationId,
    //                 amount,
    //                 publicClient,
    //                 FightersMarketplace1,
    //                 writeContractAsync
    //             );
    //             window.location.reload();
    //         } catch (error) {
    //             console.error("Error purchasing fighter:", error);
    //         }
    //     } else if (fighterKey == "buyP51Mustang") {
    //         try {
    //             await buyP51Mustang(
    //                 nationId,
    //                 amount,
    //                 publicClient,
    //                 FightersMarketplace1,
    //                 writeContractAsync
    //             );
    //             window.location.reload();
    //         } catch (error) {
    //             console.error("Error purchasing fighter:", error);
    //         }
    //     } else if (fighterKey == "buyF86Sabre") {
    //         try {
    //             await buyF86Sabre(
    //                 nationId,
    //                 amount,
    //                 publicClient,
    //                 FightersMarketplace1,
    //                 writeContractAsync
    //             );
    //             window.location.reload();
    //         } catch (error) {
    //             console.error("Error purchasing fighter:", error);
    //         }
    //     } else if (fighterKey == "buyMig15") {
    //         try {
    //             await buyMig15(
    //                 nationId,
    //                 amount,
    //                 publicClient,
    //                 FightersMarketplace1,
    //                 writeContractAsync
    //             );
    //             window.location.reload();
    //         } catch (error) {
    //             console.error("Error purchasing fighter:", error);
    //         }
    //     } else if (fighterKey == "buyF100SuperSabre") {
    //         try {
    //             await buyF100SuperSabre(
    //                 nationId,
    //                 amount,
    //                 publicClient,
    //                 FightersMarketplace1,
    //                 writeContractAsync
    //             );
    //             window.location.reload();
    //         } catch (error) {
    //             console.error("Error purchasing fighter:", error);
    //         }
    //     } else if (fighterKey == "buyF35Lightning") {
    //         try {
    //             await buyF35Lightning(
    //                 nationId,
    //                 amount,
    //                 publicClient,
    //                 FightersMarketplace2,
    //                 writeContractAsync
    //             );
    //             window.location.reload();
    //         } catch (error) {
    //             console.error("Error purchasing fighter:", error);
    //         }
    //     } else if (fighterKey == "buyF15Eagle") {
    //         try {
    //             await buyF15Eagle(
    //                 nationId,
    //                 amount,
    //                 publicClient,
    //                 FightersMarketplace2,
    //                 writeContractAsync
    //             );
    //             window.location.reload();
    //         } catch (error) {
    //             console.error("Error purchasing fighter:", error);
    //         }
    //     } else if (fighterKey == "buySu30Mki") {
    //         try {
    //             await buySu30Mki(
    //                 nationId,
    //                 amount,
    //                 publicClient,
    //                 FightersMarketplace2,
    //                 writeContractAsync
    //             );
    //             window.location.reload();
    //         } catch (error) {
    //             console.error("Error purchasing fighter:", error);
    //         }
    //     } else if (fighterKey == "buyF22Raptor") {
    //         try {
    //             await buyF22Raptor(
    //                 nationId,
    //                 amount,
    //                 publicClient,
    //                 FightersMarketplace2,
    //                 writeContractAsync
    //             );
    //             window.location.reload();
    //         } catch (error) {
    //             console.error("Error purchasing fighter:", error);
    //         }
    //     } else {
    //         console.error("Invalid fighter key");
    //     }
    // }

    const handleBuyFighters = async (key : string) => {
                    
        const amount = purchaseAmounts[key] || 1;
        const fighterKey = fighterKeyMapping[key] || key;

        if (!nationId) {
            console.error("Nation ID is null");
            return;
        }

        console.log("Buying fighters:", fighterKey, amount);

        const contractData1 = contractsData.FightersMarketplace1;
        const abi1 = contractData1.abi;
        
        if (!contractData1.address || !abi1) {
            console.error("Contract address or ABI is missing");
            return;
        }

        const contractData2 = contractsData.FightersMarketplace2;
        const abi2 = contractData2.abi;

        if (!contractData2.address || !abi2) {
            console.error("Contract address or ABI is missing");
            return;
        }
        
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();

            const contract1 = new ethers.Contract(contractData1.address, abi1 as ethers.ContractInterface, signer);
            const contract2 = new ethers.Contract(contractData2.address, abi2 as ethers.ContractInterface, signer);

            let data;

            if (fighterKey == "buyYak9" || fighterKey == "buyP51Mustang" || fighterKey == "buyF86Sabre" || fighterKey == "buyMig15" || fighterKey == "buyF100SuperSabre") {
                data = contract1.interface.encodeFunctionData(fighterKey, [nationId, amount]);
            } else {
                data = contract2.interface.encodeFunctionData(fighterKey, [nationId, amount]);
            }

            try {

                let result 

                if (fighterKey == "buyYak9" || fighterKey == "buyP51Mustang" || fighterKey == "buyF86Sabre" || fighterKey == "buyMig15" || fighterKey == "buyF100SuperSabre") {

                    result = await provider.call({
                        to: contract1.address,
                        data: data,
                        from: userAddress,
                    });

                } else {
                    
                    result = await provider.call({
                        to: contract2.address,
                        data: data,
                        from: userAddress,
                    });

                }

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

            if (fighterKey == "buyYak9") {
                try {
                    await buyYak9(
                        nationId,
                        amount,
                        publicClient,
                        FightersMarketplace1,
                        writeContractAsync
                    );
                    window.location.reload();
                } catch (error) {
                    console.error("Error purchasing fighter:", error);
                }
            } else if (fighterKey == "buyP51Mustang") {
                try {
                    await buyP51Mustang(
                        nationId,
                        amount,
                        publicClient,
                        FightersMarketplace1,
                        writeContractAsync
                    );
                    window.location.reload();
                } catch (error) {
                    console.error("Error purchasing fighter:", error);
                }
            } else if (fighterKey == "buyF86Sabre") {
                try {
                    await buyF86Sabre(
                        nationId,
                        amount,
                        publicClient,
                        FightersMarketplace1,
                        writeContractAsync
                    );
                    window.location.reload();
                } catch (error) {
                    console.error("Error purchasing fighter:", error);
                }
            } else if (fighterKey == "buyMig15") {
                try {
                    await buyMig15(
                        nationId,
                        amount,
                        publicClient,
                        FightersMarketplace1,
                        writeContractAsync
                    );
                    window.location.reload();
                } catch (error) {
                    console.error("Error purchasing fighter:", error);
                }
            } else if (fighterKey == "buyF100SuperSabre") {
                try {
                    await buyF100SuperSabre(
                        nationId,
                        amount,
                        publicClient,
                        FightersMarketplace1,
                        writeContractAsync
                    );
                    window.location.reload();
                } catch (error) {
                    console.error("Error purchasing fighter:", error);
                }
            } else if (fighterKey == "buyF35Lightning") {
                try {
                    await buyF35Lightning(
                        nationId,
                        amount,
                        publicClient,
                        FightersMarketplace2,
                        writeContractAsync
                    );
                    window.location.reload();
                } catch (error) {
                    console.error("Error purchasing fighter:", error);
                }
            } else if (fighterKey == "buyF15Eagle") {
                try {
                    await buyF15Eagle(
                        nationId,
                        amount,
                        publicClient,
                        FightersMarketplace2,
                        writeContractAsync
                    );
                    window.location.reload();
                } catch (error) {
                    console.error("Error purchasing fighter:", error);
                }
            } else if (fighterKey == "buySu30Mki") {
                try {
                    await buySu30Mki(
                        nationId,
                        amount,
                        publicClient,
                        FightersMarketplace2,
                        writeContractAsync
                    );
                    window.location.reload();
                } catch (error) {
                    console.error("Error purchasing fighter:", error);
                }
            } else if (fighterKey == "buyF22Raptor") {
                try {
                    await buyF22Raptor(
                        nationId,
                        amount,
                        publicClient,
                        FightersMarketplace2,
                        writeContractAsync
                    );
                    window.location.reload();
                } catch (error) {
                    console.error("Error purchasing fighter:", error);
                }
            } else {
                console.error("Invalid fighter key");
            }

            alert("Fighters purchased successfully!");
            
        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error("Transaction failed:", errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    }

    const fetchFighterDetails = async () => {
        if (!nationId || !publicClient || !FightersContract || !TreasuryContract) return;

        try {
            const yak9Count = await getYak9Count(nationId, publicClient, FightersContract);
            const p51MustangCount = await getP51MustangCount(nationId, publicClient, FightersContract);
            const f86SabreCount = await getF86SabreCount(nationId, publicClient, FightersContract);
            const mig15Count = await getMig15Count(nationId, publicClient, FightersContract);
            const f100SuperSabreCount = await getF100SuperSabreCount(nationId, publicClient, FightersContract);
            const f35LightningCount = await getF35LightningCount(nationId, publicClient, FightersContract);
            const f15EagleCount = await getF15EagleCount(nationId, publicClient, FightersContract);
            const su30MkiCount = await getSu30MkiCount(nationId, publicClient, FightersContract);
            const f22RaptorCount = await getF22RaptorCount(nationId, publicClient, FightersContract);

            const fighterDetails: FightersDetails = {
                yak9: yak9Count.toString(),
                p51Mustang: p51MustangCount.toString(),
                f86Sabre: f86SabreCount.toString(),
                mig15: mig15Count.toString(),
                f100SuperSabre: f100SuperSabreCount.toString(),
                f35Lightning: f35LightningCount.toString(),
                f15Eagle: f15EagleCount.toString(),
                su30Mki: su30MkiCount.toString(),
                f22Raptor: f22RaptorCount.toString(),
            };

            setFighterDetails(fighterDetails);
        } catch (error) {
            console.error("Error fetching fighter details:", error);
        }
    }

    useEffect(() => {
        fetchFighterDetails();
    }, [nationId, publicClient, FightersContract, TreasuryContract, refreshTrigger]);

    return (
        <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">✈️ Fighter Details</h2>
    
            {/* Fighters Table */}
            <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
                <thead className="bg-primary text-primary-content">
                    <tr>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Value</th>
                        <th className="p-3 text-left">Amount to Buy</th>
                        <th className="p-3 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(fightersDetails).filter(([key]) => key !== "warBucksBalance").map(([key, value]) => (
                        <tr key={key} className="border-b border-neutral">
                            <td className="p-3 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                            <td className="p-3">{value}</td>
                            <td className="p-3">
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={purchaseAmounts[key] || 1}
                                    onChange={(e) => setPurchaseAmounts({ ...purchaseAmounts, [key]: Number(e.target.value) })}
                                    className="input input-bordered w-16 bg-base-100 text-base-content text-center"
                                />
                            </td>
                            <td className="p-3">
                                <button
                                    onClick={() => handleBuyFighters(key)}
                                    className="btn btn-success"
                                >
                                    Buy
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
};

export default BuyFighters;
