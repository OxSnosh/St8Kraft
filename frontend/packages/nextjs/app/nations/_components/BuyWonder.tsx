"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { getWonders, buyWonder } from "~~/utils/wonders";
import { checkBalance } from "~~/utils/treasury";
import { useTheme } from "next-themes";

const BuyWonder = () => {
    const { theme } = useTheme();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");
    const WondersContract1 = contractsData?.WondersContract1;
    const WondersContract2 = contractsData?.WondersContract2;
    const WondersContract3 = contractsData?.WondersContract3;
    const WondersContract4 = contractsData?.WondersContract4;
    const TreasuryContract = contractsData?.TreasuryContract;
    const { writeContractAsync } = useWriteContract();

    const wonderKeyMapping = {
        agricultureDevelopmentProgram: "buyAgricultureDevelopmentProgram",
        airDefenseNetwork: "buyAirDefenseNetwork",
        centralIntelligenceAgency: "buyCentralIntelligenceAgency",
        disasterReliefAgency: "buyDisasterReliefAgency",
        empWeaponization: "buyEmpWeaponization",
        falloutShelterSystem: "buyFalloutShelterSystem",
        federalAidCommission: "buyFederalAidCommission",
        federalReserve: "buyFederalReserve",
        foreignAirForceBase: "buyForeignAirForceBase",
        foreignArmyBase: "buyForeignArmyBase",
        foreignNavalBase: "buyForeignNavalBase",
        greatMonument: "buyGreatMonument",
        greatTemple: "buyGreatTemple",
        greatUniversity: "buyGreatUniversity",
        hiddenNuclearMissileSilos: "buyHiddenNuclearMissileSilo",
        interCeptorMissileSystem: "buyInterceptorMissileSystem",
        internet: "buyInternet",
        interstateSystem: "buyInterstateSystem",
        manhattanProject: "buyManhattanProject",
        miningIndustryConsortium: "buyMiningIndustryConsortium",
        movieIndustry: "buyMovieIndustry",
        nationalCemetary: "buyNationalCemetary",
        nationalEnvironmentalOffice: "buyNationalEnvironmentalOffice",
        nationalResearchLab: "buyNationalResearchLab",
        nationalWarMemorial: "buyNationalWarMemorial",
        nuclearPowerPlant: "buyNuclearPowerPlant",
        pentagon: "buyPentagon",
        politicalLobbyist: "buyPoliticalLobbyist",
        scientificDevelopmentCenter: "buyScientificDevelopmentCenter",
        socialSecuritySystem: "buySocialSecuritySystem",
        spaceProgram: "buySpaceProgram",
        stockMarket: "buyStockMarket",
        strategicDefenseInitiative: "buyStrategicDefenseInitiative",
        superiorLogisticalSupport: "buySuperiorLogisticalSupport",
        universalHealthCare: "buyUniversalHealthCare",
        weaponsResearchCenter: "buyWeaponsResearchCenter"
    };

    const [wonderDetails, setWonderDetails] = useState<{ [key: string]: any }>({});

    const handleBuyWonder = async (key: keyof typeof wonderKeyMapping) => {
        const wonderKey = wonderKeyMapping[key] || key;

        if (nationId) {
            try {
                await buyWonder(
                    nationId,
                    wonderKey,
                    publicClient,
                    WondersContract1,
                    WondersContract2,
                    WondersContract3,
                    WondersContract4,
                    writeContractAsync
                );
                window.location.reload();
            } catch (error) {
                console.error("Error purchasing wonder:", error);
            }
        } else {
            console.error("Nation ID is null");
        }
    };

    const fetchWonderDetails = async () => {
        if (!nationId || !publicClient || !WondersContract1 || !WondersContract2 || !WondersContract3 || !WondersContract4 || !TreasuryContract) return;

        try {
            const wonders = await getWonders(nationId, WondersContract1, WondersContract2, WondersContract3, WondersContract4, publicClient) || [];
            const warBuckBalance = await checkBalance(nationId, publicClient, TreasuryContract);

            const details: { [key: string]: any, warBucksBalance?: string } = {};

            wonders.forEach(wonder => {
                const key = wonder.name.charAt(0).toLowerCase() + wonder.name.slice(1).replace(/\s+/g, '');
                details[key] = true;
            });

            details["warBucksBalance"] = (warBuckBalance / BigInt(10 ** 18)).toLocaleString();

            setWonderDetails(details);
        } catch (error) {
            console.error("Error fetching wonder details:", error);
        }
    };

    useEffect(() => {
        fetchWonderDetails();
    }, [nationId, publicClient, WondersContract1, WondersContract2, WondersContract3, WondersContract4, TreasuryContract]);

    return (
        <div className={`p-6 border-l-4 ${theme === 'dark' ? 'bg-gray-800 text-white border-green-400' : 'bg-gray-100 text-black border-green-500'}`}>
            <h3 className="text-lg font-semibold">Wonder Details</h3>

            <div className="mb-4">
                <strong>Warbucks Balance:</strong> {wonderDetails["warBucksBalance"] || "0"}
            </div>

            <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                    <tr className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                        <th className="border border-gray-300 px-4 py-2">Wonder</th>
                        <th className="border border-gray-300 px-4 py-2">Owned Status</th>
                        <th className="border border-gray-300 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(wonderKeyMapping).map((key) => (
                        <tr key={key} className="text-center">
                            <td className="border border-gray-300 px-4 py-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                            <td className="border border-gray-300 px-4 py-2">{wonderDetails[key] ? "Owned" : "Not Owned"}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    onClick={() => handleBuyWonder(key as keyof typeof wonderKeyMapping)}
                                    disabled={wonderDetails[key]}
                                    className={`px-3 py-1 rounded ${wonderDetails[key] ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                                >
                                    {wonderDetails[key] ? "Owned" : "Buy"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BuyWonder;