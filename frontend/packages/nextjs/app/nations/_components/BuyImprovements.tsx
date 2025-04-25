"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";
import { deleteImprovement } from "~~/utils/improvements";
import { getImprovements } from "~~/utils/improvements";
import { checkBalance } from "~~/utils/treasury";
import { useTheme } from "next-themes";
import { parseRevertReason } from "~~/utils/errorHandling";
import { simulateContract } from "wagmi/actions";
import { wagmiConfig } from "~~/utils/wagmiConfig";

const BuyImprovement = () => {
  const { theme } = useTheme();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const { address: walletAddress } = useAccount();
  const searchParams = useSearchParams();
  const nationId = searchParams.get("id");
  const { writeContractAsync } = useWriteContract();

  const improvementKeyMapping: { [key: string]: string } = {
    airports: "buyAirport",
    banks: "buyBank",
    barracks: "buyBarracks",
    borderFortifications: "buyBorderFortification",
    borderWalls: "buyBorderWall",
    bunker: "buyBunker",
    casinos: "buyCasino",
    churches: "buyChurch",
    clinics: "buyClinic",
    drydocks: "buyDrydock",
    factories: "buyFactory",
    foreignMinistries: "buyForeignMinistry",
    forwardOperatingBases: "buyForwardOperatingBase",
    guerillaCamps: "buyGuerillaCamp",
    harbors: "buyHarbor",
    hospitals: "buyHospital",
    intelAgencies: "buyIntelAgency",
    jails: "buyJail",
    laborCamps: "buyLaborCamp",
    prisons: "buyPrison",
    radiationContainmentChambers: "buyRadiationContainmentChamber",
    redLightDistricts: "buyRedLightDistrict",
    rehabilitationFacilities: "buyRehabilitationFacility",
    satellites: "buySatellite",
    schools: "buySchool",
    shipyards: "buyShipyard",
    stadiums: "buyStadium",
    universities: "buyUniversity",
    missileDefenseSystems: "buyMissileDefense",
    munitionsFactories: "buyMunitionsFactory",
    navalAcademies: "buyNavalAcademy",
    navalConstructionYards: "buyNavalConstructionYard",
    officesOfPropaganda: "buyOfficeOfPropaganda",
    policeHeadquarters: "buyPoliceHeadquarters",
  };

  const [improvementDetails, setImprovementDetails] = useState<{ [key: string]: string }>({});
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [purchaseAmounts, setPurchaseAmounts] = useState<{ [key: string]: number }>({});

  const handleBuyImprovement = async (key: string) => {
    const amount = purchaseAmounts[key] || 1;
    const improvementKey = improvementKeyMapping[key];

    if (!walletAddress || !nationId || !improvementKey || !contractsData) return;

    const contracts = [
      contractsData.ImprovementsContract1,
      contractsData.ImprovementsContract2,
      contractsData.ImprovementsContract3,
      contractsData.ImprovementsContract4,
    ];

    const mappings = [
      [
        "buyAirport", "buyBank", "buyBarracks", "buyBorderFortification",
        "buyBorderWall", "buyBunker", "buyCasino", "buyChurch", "buyClinic",
        "buyDrydock", "buyFactory"
      ],
      [
        "buyForeignMinistry", "buyForwardOperatingBase", "buyGuerillaCamp",
        "buyHarbor", "buyHospital", "buyIntelAgency", "buyJail", "buyLaborCamp"
      ],
      [
        "buyPrison", "buyRadiationContainmentChamber", "buyRedLightDistrict",
        "buyRehabilitationFacility", "buySatellite", "buySchool", "buyShipyard",
        "buyStadium", "buyUniversity"
      ],
      [
        "buyMissileDefense", "buyMunitionsFactory", "buyNavalAcademy",
        "buyNavalConstructionYard", "buyOfficeOfPropaganda", "buyPoliceHeadquarters"
      ]
    ];

    let selectedContract = null;
    let contractIndex = -1;
    let improvementIndex = -1;

    for (let i = 0; i < mappings.length; i++) {
      const index = mappings[i].indexOf(improvementKey);
      if (index !== -1) {
        selectedContract = contracts[i];
        contractIndex = i + 1;
        improvementIndex = index + 1;
        break;
      }
    }

    if (!selectedContract || contractIndex === -1 || improvementIndex === -1) {
      alert("Improvement function not found in contracts");
      return;
    }

    try {
      const { request } = await simulateContract(wagmiConfig, {
        abi: selectedContract.abi,
        address: selectedContract.address,
        functionName: `buyImprovement${contractIndex}`,
        args: [amount, nationId, improvementIndex],
        account: walletAddress,
      });

      const tx = await writeContractAsync(request);
      alert("Improvement purchased successfully!");
      setRefreshTrigger(!refreshTrigger);
    } catch (err: any) {
      const message = parseRevertReason(err);
      console.error("Transaction error:", err);
      alert(message || "Transaction failed");
    }
  };

  const handleDeleteImprovement = async (key: string) => {
    const amount = purchaseAmounts[key] || 1;
    const improvementKey = improvementKeyMapping[key]?.replace("buy", "delete") || key;

    if (nationId) {
      try {
        await deleteImprovement(
          nationId,
          improvementKey,
          amount,
          publicClient,
          contractsData.ImprovementsContract1,
          contractsData.ImprovementsContract2,
          contractsData.ImprovementsContract3,
          contractsData.ImprovementsContract4,
          writeContractAsync
        );
        alert("Improvement deleted successfully!");
        window.location.reload();
      } catch (txError) {
        console.error("Error deleting improvement:", txError);
        alert("Transaction failed: Unable to delete improvement.");
      }
    } else {
      alert("Nation ID is missing.");
    }
  };

  const fetchImprovementDetails = async () => {
    if (!nationId || !publicClient || !contractsData) return;

    try {
      const improvements = await getImprovements(
        nationId,
        contractsData.ImprovementsContract1,
        contractsData.ImprovementsContract2,
        contractsData.ImprovementsContract3,
        contractsData.ImprovementsContract4,
        publicClient
      );
      const warBuckBalance = await checkBalance(nationId, publicClient, contractsData.TreasuryContract);

      const details: { [key: string]: string } = {};

      improvements?.forEach((improvement) => {
        const key = improvement.name.charAt(0).toLowerCase() + improvement.name.slice(1).replace(/\s+/g, "");
        details[key] = improvement.improvementCount.toString();
      });

      details["warBucksBalance"] = (warBuckBalance / BigInt(10 ** 18)).toLocaleString();
      setImprovementDetails(details);
    } catch (error) {
      console.error("Error fetching infrastructure details:", error);
    }
  };

  useEffect(() => {
    fetchImprovementDetails();
  }, [nationId, publicClient, contractsData, refreshTrigger]);

  return (
    <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
      <h2 className="text-2xl font-bold text-primary-content text-center mb-4">🏗️ Manage Improvements</h2>
      <div className="text-lg text-center font-semibold bg-base-200 p-3 rounded-lg shadow-md mb-6">
        Warbucks Balance: {improvementDetails["warBucksBalance"] || "0"}
      </div>
      <table className="w-full border-collapse border border-neutral bg-base-200 rounded-lg shadow-md mb-6">
        <thead className="bg-primary text-primary-content">
          <tr>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Owned</th>
            <th className="p-3 text-left">Amount (1-5)</th>
            <th className="p-3 text-left">Buy</th>
            <th className="p-3 text-left">Delete</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(improvementKeyMapping).map((key) => (
            <tr key={key} className="border-b border-neutral">
              <td className="p-3 capitalize">{key.replace(/([A-Z])/g, " $1")}</td>
              <td className="p-3">{improvementDetails[key] || "0"}</td>
              <td className="p-3">
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={purchaseAmounts[key] || 1}
                  onChange={(e) => setPurchaseAmounts({ ...purchaseAmounts, [key]: Number(e.target.value) })}
                  className="input input-bordered w-16 bg-base-100 text-base-content"
                />
              </td>
              <td className="p-3">
                <button onClick={() => handleBuyImprovement(key)} className="btn btn-success w-full">
                  Buy
                </button>
              </td>
              <td className="p-3">
                {parseInt(improvementDetails[key] || "0") > 0 && (
                  <button onClick={() => handleDeleteImprovement(key)} className="btn btn-error w-full">
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

export default BuyImprovement;