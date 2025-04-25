"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { getWonders, deleteWonder } from "~~/utils/wonders";
import { checkBalance } from "~~/utils/treasury";
import { useTheme } from "next-themes";
import { parseRevertReason } from "~~/utils/errorHandling";
import { simulateContract } from "wagmi/actions";
import { wagmiConfig } from "~~/utils/wagmiConfig";

const BuyWonder = () => {
  const { theme } = useTheme();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const { address: walletAddress } = useAccount();
  const searchParams = useSearchParams();
  const nationId = searchParams.get("id");
  const { writeContractAsync } = useWriteContract();

  const wonderKeyMapping = {
    agricultureDevelopmentProgram: "buyAgriculturalDevelopmentProgram",
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
    weaponsResearchCenter: "buyWeaponsResearchCenter",
  };

  const [wonderDetails, setWonderDetails] = useState<{ [key: string]: any }>({});

  const handleBuyWonder = async (key: keyof typeof wonderKeyMapping) => {
    const wonderKey = wonderKeyMapping[key];
    if (!walletAddress || !nationId || !wonderKey || !contractsData) return;

    const wonderContracts = [
      contractsData.WondersContract1,
      contractsData.WondersContract2,
      contractsData.WondersContract3,
      contractsData.WondersContract4,
    ];

    const wonderMappings = [
      [
        "buyAgriculturalDevelopmentProgram",
        "buyAirDefenseNetwork",
        "buyCentralIntelligenceAgency",
        "buyDisasterReliefAgency",
        "buyEmpWeaponization",
        "buyFalloutShelterSystem",
        "buyFederalAidCommission",
        "buyFederalReserve",
        "buyForeignAirForceBase",
        "buyForeignArmyBase",
        "buyForeignNavalBase",
      ],
      [
        "buyGreatMonument",
        "buyGreatTemple",
        "buyGreatUniversity",
        "buyHiddenNuclearMissileSilo",
        "buyInterceptorMissileSystem",
        "buyInternet",
        "buyInterstateSystem",
        "buyManhattanProject",
        "buyMiningIndustryConsortium",
      ],
      [
        "buyMovieIndustry",
        "buyNationalCemetary",
        "buyNationalEnvironmentalOffice",
        "buyNationalResearchLab",
        "buyNationalWarMemorial",
        "buyNuclearPowerPlant",
        "buyPentagon",
        "buyPoliticalLobbyist",
        "buyScientificDevelopmentCenter",
      ],
      [
        "buySocialSecuritySystem",
        "buySpaceProgram",
        "buyStockMarket",
        "buyStrategicDefenseInitiative",
        "buySuperiorLogisticalSupport",
        "buyUniversalHealthCare",
        "buyWeaponsResearchCenter",
      ],
    ];

    let found = null;
    let contractIndex = -1;
    let wonderIndex = -1;

    for (let i = 0; i < wonderMappings.length; i++) {
      const index = wonderMappings[i].indexOf(wonderKey);
      if (index !== -1) {
        found = wonderContracts[i];
        contractIndex = i + 1;
        wonderIndex = index + 1;
        break;
      }
    }

    if (!found || contractIndex === -1 || wonderIndex === -1) {
      alert("Wonder function not found in contracts");
      return;
    }

    try {
      const { request } = await simulateContract(wagmiConfig, {
        abi: found.abi,
        address: found.address,
        functionName: `buyWonder${contractIndex}`,
        args: [nationId, wonderIndex],
        account: walletAddress,
      });

      const tx = await writeContractAsync(request);
      alert("Wonder purchased successfully!");
      window.location.reload();
    } catch (err: any) {
      const message = parseRevertReason(err);
      console.error("Transaction error:", err);
      alert(message || "Transaction failed");
    }
  };

  const handleDeleteWonder = async (key: keyof typeof wonderKeyMapping) => {
    const wonderKey = wonderKeyMapping[key]?.replace("buy", "delete");
    if (!nationId || !contractsData || !publicClient || !writeContractAsync) return;

    try {
      await deleteWonder(
        nationId,
        wonderKey,
        publicClient,
        contractsData.WondersContract1,
        contractsData.WondersContract2,
        contractsData.WondersContract3,
        contractsData.WondersContract4,
        writeContractAsync
      );
      alert("Wonder deleted successfully!");
      window.location.reload();
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert(err.message || "Delete transaction failed");
    }
  };

  const fetchWonderDetails = async () => {
    if (!nationId || !contractsData || !publicClient) return;
    try {
      const wonders = await getWonders(
        nationId,
        contractsData.WondersContract1,
        contractsData.WondersContract2,
        contractsData.WondersContract3,
        contractsData.WondersContract4,
        publicClient
      );
      const balance = await checkBalance(nationId, publicClient, contractsData.TreasuryContract);

      const details: any = {
        warBucksBalance: (balance / BigInt(10 ** 18)).toLocaleString(),
      };
      if (wonders) {
        wonders.forEach(w => {
          const key = w.name.charAt(0).toLowerCase() + w.name.slice(1).replace(/\s+/g, "");
          details[key] = true;
        });
      }
      setWonderDetails(details);
    } catch (err) {
      console.error("Error fetching wonder details:", err);
    }
  };

  useEffect(() => {
    fetchWonderDetails();
  }, [nationId, contractsData, publicClient]);

  return (
    <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
      <h2 className="text-2xl font-bold text-primary-content text-center mb-4">🏛️ Wonder Details</h2>
      <div className="text-lg text-center font-semibold bg-base-200 p-3 rounded-lg shadow-md mb-6">
        Warbucks Balance: {wonderDetails["warBucksBalance"] || "0"}
      </div>

      <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
        <thead className="bg-primary text-primary-content">
          <tr>
            <th className="p-3 text-left">Wonder</th>
            <th className="p-3 text-left">Owned Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(wonderKeyMapping).map((key) => (
            <tr key={key} className="border-b border-neutral">
              <td className="p-3 capitalize">{key.replace(/([A-Z])/g, " $1")}</td>
              <td className="p-3">{wonderDetails[key] ? "Owned" : "Not Owned"}</td>
              <td className="p-3 flex space-x-2">
                <button
                  onClick={() => handleBuyWonder(key as keyof typeof wonderKeyMapping)}
                  disabled={wonderDetails[key]}
                  className={`btn ${wonderDetails[key] ? "btn-disabled" : "btn-success"}`}
                >
                  {wonderDetails[key] ? "Owned" : "Buy"}
                </button>
                {wonderDetails[key] && (
                  <button
                    onClick={() => handleDeleteWonder(key as keyof typeof wonderKeyMapping)}
                    className="btn btn-error"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BuyWonder;