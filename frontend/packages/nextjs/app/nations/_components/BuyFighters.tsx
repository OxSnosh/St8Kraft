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
} from '~~/utils/fighters';
import { useTheme } from "next-themes";


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

    const handleBuyFighters = async (key: string) => {
        const amount = purchaseAmounts[key] || 1;
        const fighterKey = fighterKeyMapping[key] || key;

        if (!nationId) {
            console.error("Nation ID is null");
            return;
        }

        console.log("Buying fighters:", fighterKey, amount);

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
        <div className={`p-6 border-l-4 ${theme === 'dark' ? 'bg-gray-800 text-white border-green-400' : 'bg-gray-100 text-black border-green-500'}`}>
            <h3 className="text-lg font-semibold">Fighter Details</h3>

            <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                    <tr className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                        <th className="border border-gray-300 px-4 py-2">Category</th>
                        <th className="border border-gray-300 px-4 py-2">Value</th>
                        <th className="border border-gray-300 px-4 py-2">Amount to Buy</th>
                        <th className="border border-gray-300 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(fightersDetails).filter(([key]) => key !== "warBucksBalance").map(([key, value]) => (
                        <tr key={key} className="text-center">
                            <td className="border border-gray-300 px-4 py-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                            <td className="border border-gray-300 px-4 py-2">{value}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={purchaseAmounts[key] || 1}
                                    onChange={(e) => setPurchaseAmounts({ ...purchaseAmounts, [key]: Number(e.target.value) })}
                                    className="w-16 p-1 border rounded"
                                />
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    onClick={() => handleBuyFighters(key)}
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
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
