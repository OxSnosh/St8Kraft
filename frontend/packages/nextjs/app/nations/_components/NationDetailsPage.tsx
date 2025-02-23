"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { usePublicClient, useAccount, useWriteContract } from "wagmi";

import { getResources, getBonusResources, getTradingPartners } from '../../../utils/resources';
import { getImprovements } from '../../../utils/improvements';
import { getWonders } from '../../../utils/wonders';
import { getEnvironmentScore } from "../../../utils/environment"
import { getNationStrength } from "../../../utils/strength";
import { getDefconLevel, getThreatLevel, getWarPeacePreference } from "~~/utils/military";
import { 
  getSoldierCount, 
  getTankCount, 
  getDefendingSoldierCount, 
  getDeployedSoldierCount,
  getDefendingSoldierEfficiencyModifier,
  getDefendingTankCount, 
  getDeployedTankCount,
  getCasualties
} from "../../../utils/forces"
import { getNationAllianceAndPlatoon } from "~~/utils/alliance";
import { getFighters } from "../../../utils/fighters"
import { getBombers } from "../../../utils/bombers"
import { getNavy } from "../../../utils/navy"
import { getCruiseMissileCount, getNukeCount } from "~~/utils/missiles";
import { getSpyCount } from "~~/utils/spies";
import { checkOwnership } from "~~/utils/countryMinter";
import PostsTable from "../../../app/subgraph/_components/Posts";
import { parseRevertReason } from '../../../utils/errorHandling';
import { ethers } from "ethers";

type NationDetails = {
  nationName: string | null;
  rulerName: string | null;
  capitalCity: string | null;
  nationSlogan: string | null;
  dayCreated: string | null;
  alliance: string | null;
  team: string | null;
  resources: string[] | null;
  bonusResources: string[] | null;
  tradingPartners: string[] | null;
  government: string | null;
  religion: string | null;
  balance: string | null;
  happiness: string | null;
  dailyIncome: string | null;
  taxRate: string | null;
  taxesCollectible: string | null;
  lastTaxCollection: string | null;
  billsPayable: string | null;
  lastBillPayment: string | null;
  technologyCount: string | null;
  infrastructureCount: string | null;
  landCount: string | null;
  areaOfInfluence: string | null;
  totalPopulation: string | null;
  taxablePopulation: string | null;
  criminalCount: string | null;
  crimePreventionScore: string | null;
  crimeIndex: string | null;
  literacyRate: string | null;
  rehabilitatedCitizens: string | null;
  incarceratedCitizens: string | null;
  populationDensity: string | null;
  improvements: { improvementCount: any; name: string }[];
  wonders: { wonderCount: any; name: string }[];
  environmentScore: string | null;
  strength: string | null;
  warPeacePreference: string | null;
  defconLevel: string | null;
  threatLevel: string | null;
  soldierCount: string | null;
  defendingSoldierCount: string | null;
  getDefendingSoldierEfficiencyModifier: string | null;
  deployedSoldierCount: string | null;
  tankCount: string | null;
  defendingTankCount: string | null;
  deployedTankCount: string | null;
  fighters: { fighterCount: any; name: string }[];
  bombers: { bomberCount: any; name: string }[];
  navy: { navyCount: any; name: string }[];
  cruiseMissiles: string | null;
  nukes: string | null;
  spies: string | null;
  soldierCasualties: string | null;
  tankCasualties: string | null;
};

type NationDetailsPageProps = {
  nationId: string;
  onPropeseTrade: () => void;
};

const NationDetailsPage = ({ nationId, onPropeseTrade }: NationDetailsPageProps) => {
  const searchParams = useSearchParams();
  const nationIdForPost = searchParams.get("id");
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const { address: walletAddress } = useAccount();
  const countryParametersContract = contractsData?.CountryParametersContract;
  const treasuryContract = contractsData?.TreasuryContract;
  const taxesContract = contractsData?.TaxesContract;
  const billsContract = contractsData?.BillsContract;
  const infrastructureContract = contractsData?.InfrastructureContract;
  const crimeContract = contractsData?.CrimeContract;
  const resourcesContract = contractsData?.ResourcesContract;
  const bonusResourcesContract = contractsData?.BonusResourcesContract;
  const improvementsContract1 = contractsData?.ImprovementsContract1;
  const improvementsContract2 = contractsData?.ImprovementsContract2;
  const improvementsContract3 = contractsData?.ImprovementsContract3;
  const improvementsContract4 = contractsData?.ImprovementsContract4;
  const wondersContract1 = contractsData?.WondersContract1;
  const wondersContract2 = contractsData?.WondersContract2;
  const wondersContract3 = contractsData?.WondersContract3;
  const wondersContract4 = contractsData?.WondersContract4;
  const environmentContract = contractsData?.EnvironmentContract;
  const strenghtContract = contractsData?.NationStrengthContract;
  const militaryContract = contractsData?.MilitaryContract;
  const forcesContract = contractsData?.ForcesContract;
  const fightersContract = contractsData?.FightersContract;
  const bombersContract = contractsData?.BombersContract;
  const navyContract = contractsData?.NavyContract;
  const navyContract2 = contractsData?.NavyContract2;
  const missilesContract = contractsData?.MissilesContract;
  const spiesContract = contractsData?.SpyContract;

  const [activeTab, setActiveTab] = useState("Government Information");

  const [nationDetails, setNationDetails] = useState<NationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showManageTrades, setShowManageTrades] = useState(false);
  const [message, setMessage] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const handleProposeTradeClick = () => {
    setShowManageTrades(true);
    if (onPropeseTrade) {
      onPropeseTrade();
    }
  };

  useEffect(() => {
    const fetchOwnership = async () => {
      if (!walletAddress || !publicClient || !contractsData?.CountryMinter) return;
      const owner = await checkOwnership(nationId, publicClient, contractsData.CountryMinter);
      setIsOwner(owner);
    };

    fetchOwnership();
  }, [walletAddress, nationId, publicClient, contractsData]);

  const checkOwnership = async (tokenId: string, publicClient: any, countryMinterContract: any) => {
    if (!publicClient || !countryMinterContract || !tokenId) {
      return;
    }

    const owner = await publicClient.readContract({
      abi: countryMinterContract.abi,
      address: countryMinterContract.address,
      functionName: "checkOwnership",
      args: [tokenId, walletAddress],
    });

    return owner 
  }

  const { writeContractAsync } = useWriteContract();

  const handlePostMessage = async () => {
    if (!nationIdForPost || !message || !contractsData?.Messenger || !walletAddress) {
      console.error("Missing required parameters for posting message.");
      alert("Missing required parameters.");
      return;
    }
  
    const contractData = contractsData.Messenger;
    const abi = contractData.abi;
  
    if (!contractData.address || !abi) {
      console.error("Contract address or ABI is missing.");
      alert("Contract configuration is missing.");
      return;
    }
  
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
  
      const contract = new ethers.Contract(contractData.address, abi as ethers.ContractInterface, signer);
  
      const data = contract.interface.encodeFunctionData("postMessage", [
        nationIdForPost,
        message,
      ]);
  
      try {
        // Simulating the transaction call
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
  
      // Sending the actual transaction
      await writeContractAsync({
        abi: contractData.abi,
        address: contractData.address,
        functionName: "postMessage",
        args: [nationIdForPost, message],
      });
  
      alert("Message posted successfully!");
      setMessage(""); // Clear message input
  
    } catch (error: any) {
      const errorMessage = parseRevertReason(error);
      console.error("Transaction failed:", errorMessage);
      alert(`Transaction failed: ${errorMessage}`);
    }
  };
  
  useEffect(() => {
    const fetchNationDetails = async () => {
      if (!publicClient || !countryParametersContract) {
        console.error("Missing required data: publicClient, countryParametersContract, or nationId.");
        setLoading(false);
        return;
      }

      try {
        const tokenIdString = nationId.toString();

        const balanceRaw = await publicClient.readContract({
          abi: treasuryContract.abi,
          address: treasuryContract.address,
          functionName: "checkBalance",
          args: [tokenIdString],
        }) as Number;

        const balance = BigInt(balanceRaw as unknown as bigint).toString();
        const formattedBalance = Number(balance) / 10 ** 18;

        const taxesCollectibleArray = (await publicClient.readContract({
          abi: taxesContract.abi,
          address: taxesContract.address,
          functionName: "getTaxesCollectible",
          args: [tokenIdString],
        })) as any[];

        const taxesCollectibleWihZeroes = taxesCollectibleArray[1]?.toString();
        const taxesCollectible = taxesCollectibleWihZeroes/(10 ** 18);

        const billsPayableRaw = (await publicClient.readContract({
          abi: billsContract.abi,
          address: billsContract.address,
          functionName: "getBillsPayable",
          args: [tokenIdString],
        })) as any;

        const billsPayableWithZeroes = billsPayableRaw.toString();
        const billsPayable = billsPayableWithZeroes/(10 ** 18);

        const taxablePopulationArray = (await publicClient.readContract({
          abi: infrastructureContract.abi,
          address: infrastructureContract.address,
          functionName: "getTaxablePopulationCount",
          args: [tokenIdString],
        })) as any[];

        const taxablePopulation = taxablePopulationArray[0]?.toString();

        const criminalArray = (await publicClient.readContract({
          abi: crimeContract.abi,
          address: crimeContract.address,
          functionName: "getCriminalCount",
          args: [tokenIdString],
        })) as any[];
        
        const lastTaxCollectionDays = String(
          await publicClient.readContract({
            abi: treasuryContract.abi,
            address: treasuryContract.address,
            functionName: "getDaysSinceLastTaxCollection",
            args: [tokenIdString],
          })
        );

        const lastTaxCollection = `${lastTaxCollectionDays} days ago`;

        const lastBillPaymentDays = String(
          await publicClient.readContract({
            abi: treasuryContract.abi,
            address: treasuryContract.address,
            functionName: "getDaysSinceLastBillsPaid",
            args: [tokenIdString],
          })
        );

        const lastBillPayment = `${lastBillPaymentDays} days ago`;

        const resources = await getResources(tokenIdString, resourcesContract, publicClient);
        console.log(resources, "RESOURCES")

        const bonusResources = await getBonusResources(tokenIdString, bonusResourcesContract, publicClient);

        const tradingPartners = await getTradingPartners(tokenIdString, resourcesContract, publicClient);

        const improvements = await getImprovements(tokenIdString, improvementsContract1, improvementsContract2, improvementsContract3, improvementsContract4, publicClient);

        const wonders = await getWonders(tokenIdString, wondersContract1, wondersContract2, wondersContract3, wondersContract4, publicClient)
        
        const environmentScore = await getEnvironmentScore(tokenIdString, publicClient, environmentContract)

        const strength = await getNationStrength(tokenIdString, publicClient, strenghtContract);

        const warPeacePreferenceBool = await getWarPeacePreference(tokenIdString, publicClient, militaryContract);

        let warPeacePreference : string
        if (!warPeacePreferenceBool[0]) {
          warPeacePreference = "Nation is in peace mode"
        } else {
          warPeacePreference = "Nation is ready for war!"
        }

        const defconLevel = await getDefconLevel(tokenIdString, publicClient, militaryContract);

        const threatLevel = await getThreatLevel(tokenIdString, publicClient, militaryContract);

        const soldierCount = await getSoldierCount(tokenIdString, publicClient, forcesContract);

        const defendingSoldierCount = await getDefendingSoldierCount(tokenIdString, publicClient, forcesContract);

        const deployedSoldierCount = await getDeployedSoldierCount(tokenIdString, publicClient, forcesContract);

        const defendingSoldierEfficiencyModifier = await getDefendingSoldierEfficiencyModifier(tokenIdString, publicClient, forcesContract);

        const tankCount = await getTankCount(tokenIdString, publicClient, forcesContract);

        const defendingTankCount = await getDefendingTankCount(tokenIdString, publicClient, forcesContract);

        const deployedTankCount = await getDeployedTankCount(tokenIdString, publicClient, forcesContract);

        const fighterCount = await getFighters(tokenIdString, publicClient, fightersContract);

        const bomberCount = await getBombers(tokenIdString, publicClient, bombersContract)

        const navy = await getNavy(tokenIdString, publicClient, navyContract, navyContract2)

        const cruiseMissiles = await getCruiseMissileCount(tokenIdString, publicClient, missilesContract)

        const nukes = await getNukeCount(tokenIdString, publicClient, missilesContract)

        const spies = await getSpyCount(tokenIdString, publicClient, spiesContract)

        const casualties = await getCasualties(tokenIdString, publicClient, forcesContract)

        const allianceDetails = await getNationAllianceAndPlatoon(tokenIdString, publicClient, countryParametersContract);

        const details: NationDetails = {
          nationName: (await publicClient.readContract({
            abi: countryParametersContract.abi,
            address: countryParametersContract.address,
            functionName: "getNationName",
            args: [tokenIdString],
          })) as string,

          rulerName: (await publicClient.readContract({
            abi: countryParametersContract.abi,
            address: countryParametersContract.address,
            functionName: "getRulerName",
            args: [tokenIdString],
          })) as string,

          capitalCity: (await publicClient.readContract({
            abi: countryParametersContract.abi,
            address: countryParametersContract.address,
            functionName: "getCapital",
            args: [tokenIdString],
          })) as string,

          nationSlogan: (await publicClient.readContract({
            abi: countryParametersContract.abi,
            address: countryParametersContract.address,
            functionName: "getSlogan",
            args: [tokenIdString],
          })) as string,

          dayCreated: String(
            await publicClient.readContract({
              abi: countryParametersContract.abi,
              address: countryParametersContract.address,
              functionName: "getDayCreated",
              args: [tokenIdString],
            })
          ),

          alliance : `${allianceDetails[0]}: ${allianceDetails[2]}` || null,

          team: String(
            await publicClient.readContract({
              abi: countryParametersContract.abi,
              address: countryParametersContract.address,
              functionName: "getTeam",
              args: [tokenIdString],
            })
          ),

          resources: resources || null,

          bonusResources: bonusResources || null,

          tradingPartners: tradingPartners.length > 0 ? tradingPartners : null,

          government: String(
            await publicClient.readContract({
              abi: countryParametersContract.abi,
              address: countryParametersContract.address,
              functionName: "getGovernmentType",
              args: [tokenIdString],
            })
          ),

          religion: String(
            await publicClient.readContract({
              abi: countryParametersContract.abi,
              address: countryParametersContract.address,
              functionName: "getReligionType",
              args: [tokenIdString],
            })
          ),

          balance: formattedBalance.toString(),

          happiness: String(
            await publicClient.readContract({
              abi: taxesContract.abi,
              address: taxesContract.address,
              functionName: "getHappiness",
              args: [tokenIdString],
            })
          ),

          dailyIncome: String(
            await publicClient.readContract({
              abi: taxesContract.abi,
              address: taxesContract.address,
              functionName: "getDailyIncome",
              args: [tokenIdString],
            })
          ),

          taxRate: String(
            await publicClient.readContract({
              abi: infrastructureContract.abi,
              address: infrastructureContract.address,
              functionName: "getTaxRate",
              args: [tokenIdString],
            })
          ),

          taxesCollectible : taxesCollectible.toString(), 

          billsPayable: billsPayable.toString(),

          technologyCount: String(
            await publicClient.readContract({
              abi: infrastructureContract.abi,
              address: infrastructureContract.address,
              functionName: "getTechnologyCount",
              args: [tokenIdString],
            })
          ),

          infrastructureCount: String(
            await publicClient.readContract({
              abi: infrastructureContract.abi,
              address: infrastructureContract.address,
              functionName: "getInfrastructureCount",
              args: [tokenIdString],
            })
          ),

          landCount: String(
            await publicClient.readContract({
              abi: infrastructureContract.abi,
              address: infrastructureContract.address,
              functionName: "getLandCount",
              args: [tokenIdString],
            })
          ),

          areaOfInfluence: String(
            await publicClient.readContract({
              abi: infrastructureContract.abi,
              address: infrastructureContract.address,
              functionName: "getAreaOfInfluence",
              args: [tokenIdString],
            })
          ),

          lastTaxCollection: lastTaxCollection,

          lastBillPayment: lastBillPayment,

          totalPopulation: String(
            await publicClient.readContract({
              abi: infrastructureContract.abi,
              address: infrastructureContract.address,
              functionName: "getTotalPopulationCount",
              args: [tokenIdString],
            })
          ),

          taxablePopulation: taxablePopulation.toString(),

          criminalCount: criminalArray[0]?.toString(),

          crimePreventionScore: String(
            await publicClient.readContract({
              abi: crimeContract.abi,
              address: crimeContract.address,
              functionName: "getCrimePreventionScore",
              args: [tokenIdString],
            })
          ),
          
          crimeIndex: String(
            await publicClient.readContract({
              abi: crimeContract.abi,
              address: crimeContract.address,
              functionName: "getCrimeIndex",
              args: [tokenIdString],
            })
          ),  

          literacyRate: String(
            await publicClient.readContract({
              abi: crimeContract.abi,
              address: crimeContract.address,
              functionName: "getLiteracy",
              args: [tokenIdString],
            })
          ),
          
          rehabilitatedCitizens: criminalArray[1]?.toString(),

          incarceratedCitizens: criminalArray[2]?.toString(),

          populationDensity: String(
            await publicClient.readContract({
              abi: taxesContract.abi,
              address: taxesContract.address,
              functionName: "checkPopulationDensity",
              args: [tokenIdString],
            })
          ),

          improvements: improvements || [],

          wonders: wonders || [],

          environmentScore: environmentScore.toString() || null,

          strength: strength.toString() || null,

          warPeacePreference: warPeacePreference || null,

          defconLevel: defconLevel.toString() || null,

          threatLevel: threatLevel.toString() || null,

          soldierCount: soldierCount.toString() || null,

          defendingSoldierCount: defendingSoldierCount.toString() || null,

          getDefendingSoldierEfficiencyModifier: defendingSoldierEfficiencyModifier.toString() || null,

          deployedSoldierCount: deployedSoldierCount.toString() || null,

          tankCount: tankCount.toString() || null,

          defendingTankCount: defendingTankCount.toString() || null,

          deployedTankCount: deployedTankCount.toString() || null,

          fighters: fighterCount || [],

          bombers: bomberCount || [],

          navy: navy || [],

          cruiseMissiles: cruiseMissiles.toString() || null,

          nukes: nukes.toString() || null,

          spies: spies.toString() || null,

          soldierCasualties: casualties[0]?.toString() || null,

          tankCasualties: casualties[1]?.toString() || null,
        };

        setNationDetails(details);
      } catch (err) {
        console.error("Error fetching nation details:", err);
        setNationDetails({
          nationName: null,
          rulerName: null,
          capitalCity: null,
          nationSlogan: null,
          dayCreated: null,
          alliance: null,
          team: null,
          resources: null,
          bonusResources: null,
          tradingPartners: null,
          government: null,
          religion: null,
          balance: null,
          happiness: null,
          dailyIncome: null,
          taxRate: null,
          taxesCollectible: null,
          lastTaxCollection: null,
          billsPayable: null,
          lastBillPayment: null,
          technologyCount: null,
          infrastructureCount: null,
          landCount: null,
          areaOfInfluence: null,
          totalPopulation: null,
          taxablePopulation: null,
          criminalCount: null,
          crimePreventionScore: null,
          crimeIndex: null,
          literacyRate: null,
          rehabilitatedCitizens: null,
          incarceratedCitizens: null,
          populationDensity: null,
          improvements: [],
          wonders: [],
          environmentScore: null,
          strength: null,
          warPeacePreference: null,
          defconLevel: null,
          threatLevel: null,
          soldierCount: null,
          defendingSoldierCount: null,
          getDefendingSoldierEfficiencyModifier: null,
          deployedSoldierCount: null,
          tankCount: null,
          defendingTankCount: null,
          deployedTankCount: null,
          fighters: [],
          bombers: [],
          navy: [],
          cruiseMissiles: null,
          nukes: null,
          spies: null,
          soldierCasualties: null,
          tankCasualties: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNationDetails();
  }, [nationId, countryParametersContract, publicClient]);

  if (loading) {
    return <div>Loading nation details...</div>;
  }

  if (!nationDetails || !nationDetails.nationName) {
    return <div>No details found for this nation.</div>;
  }

  const sections: { [key: string]: { label: string; value: string | number }[] } = {
    "Nation Overview": [
      { label: "Nation Name", value: nationDetails.nationName || "Unknown" },
      { label: "Ruler Name", value: nationDetails.rulerName || "Unknown" },
      { label: "Capital City", value: nationDetails.capitalCity || "Unknown" },
      { label: "Nation Slogan", value: nationDetails.nationSlogan || "No slogan available" },
      { label: "Day Created", value: nationDetails.dayCreated || "Unknown" },
    ],
    "Government Information": [
      { label: "Alliance", value: nationDetails.alliance || "Unknown" },
      { label: "Team", value: nationDetails.team || "Unknown" },
      { label: "Resources", value: nationDetails.resources?.join(", ") || "Unknown" },
      { label: "Bonus Resources", value: nationDetails.bonusResources?.join(", ") || "Unknown" },
      { label: "Trading Partners", value: nationDetails.tradingPartners?.join(", ") || "None" },
      { label: "Government Type", value: nationDetails.government || "Unknown" },
      { label: "National Religion", value: nationDetails.religion || "Unknown" },
    ],
    Treasury: [
      { label: "Nation Balance", value: nationDetails.balance ? Math.floor(Number(nationDetails.balance)) : "Unknown" },
      { label: "Happiness", value: nationDetails.happiness || "Unknown" },
      { label: "Daily Income Per Citizen", value: nationDetails.dailyIncome || "Unknown" },
      { label: "Tax Rate", value: nationDetails.taxRate || "Unknown" },
      { label: "Taxable Population", value: nationDetails.taxablePopulation || "Unknown" },
      { label: "Taxes Collectible", value: nationDetails.taxesCollectible || "Unknown" },
      { label: "Last Tax Collection", value: nationDetails.lastTaxCollection || "Unknown" },
      { label: "Bills Payable", value: nationDetails.billsPayable || "Unknown" },
      { label: "Last Bill Payment", value: nationDetails.lastBillPayment || "Unknown" },
    ],
    Military: [
      { label: "Nation Strength", value: nationDetails.strength || "Unknown" },
      { label: "War/Peace Preference", value: nationDetails.warPeacePreference || "Unknown" },
      { label: "Defcon Level", value: nationDetails.defconLevel || "Unknown" },
      { label: "Threat Level", value: nationDetails.threatLevel || "Unknown" },
      { label: "Soldier Count", value: nationDetails.soldierCount || "Unknown" },
      { label: "Tank Count", value: nationDetails.tankCount || "Unknown" },
      { label: "Nukes", value: nationDetails.nukes || "Unknown" },
      { label: "Spies", value: nationDetails.spies || "Unknown" },
      { label: "Soldier Casualties", value: nationDetails.soldierCasualties || "Unknown" },
      { label: "Tank Casualties", value: nationDetails.tankCasualties || "Unknown" },
    ],
    Infrastructure: [
      { label: "Technology Count", value: nationDetails.technologyCount || "Unknown" },
      { label: "Infrastructure Count", value: nationDetails.infrastructureCount || "Unknown" },
      { label: "Land Count", value: nationDetails.landCount || "Unknown" },
      { label: "Total Population", value: nationDetails.totalPopulation || "Unknown" },
      { label: "Population Density", value: nationDetails.populationDensity || "Unknown" },
      { label: "Crime Index", value: nationDetails.crimeIndex || "Unknown" },
      { label: "Literacy Rate", value: nationDetails.literacyRate || "Unknown" },
      { label: "Environment Score", value: nationDetails.environmentScore || "Unknown" },
    ],
  };

  const ResourceDisplay = () => {
    const resources = nationDetails.resources;
  
    if (!resources || resources.length === 0) {
      return <p>No resources available</p>; // Handle empty array case
    }
  
    return (
      <div className="flex flex-wrap gap-3 bg-base-100 p-3 rounded-lg">
        {resources.map((resource) => {
          const sanitizedResource = resource.toLowerCase().replace(/\s+/g, '-'); // Ensure correct filename formatting
          console.log(`Rendering resource: ${sanitizedResource}`); // Debugging log
  
          return (
            <div key={resource} className="tooltip" data-tip={resource}>
              <img 
                src={`/icons/${sanitizedResource}.svg`} 
                alt={resource} 
                className="w-10 h-10"
                onError={() => console.error(`Image failed to load: ${sanitizedResource}.svg`)}
              />
            </div>
          );
        })}
      </div>
    );
  };

    const BonusResourceDisplay = () => {
    const resources = nationDetails.bonusResources;

    if (!resources || resources.length === 0) {
      return <p>No bonus resources available</p>;
    }

    return (
      <div className="flex flex-wrap gap-3 bg-base-100 p-3 rounded-lg">
        {resources.map((resource) => {
          const sanitizedResource = resource.toLowerCase().replace(/\s+/g, '-');
          console.log(`Rendering bonus resource: ${sanitizedResource}`); // Debugging log

          return (
            <div key={resource} className="tooltip" data-tip={resource}>
              <img 
                src={`/icons/${sanitizedResource}.svg`} 
                alt={resource} 
                className="w-10 h-10"
                onError={() => console.error(`Image failed to load: ${sanitizedResource}.svg`)}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
      <div className="flex w-full p-6 bg-aged-paper text-base-content rounded-lg shadow-center">
          {/* Left Sidebar - News Carousel Tabs */}
          <div className="w-3/12 pr-4 border-r border-neutral flex flex-col gap-3">
              <h2 className="text-2xl font-bold text-primary-content text-center">Nation Details</h2>
              <div className="news-carousel-left flex flex-col gap-3">
                  <button
                      className={`news-carousel-tab px-4 py-4 text-lg text-center font-semibold rounded-lg shadow-md transition-all ${
                          activeTab === "All Details" ? "bg-primary text-primary-content" : "bg-base-200 hover:bg-base-300"
                      }`}
                      onClick={() => setActiveTab("All Details")}
                  >
                      📜 All Details
                  </button>
                  {Object.keys(sections).map((section: string) => (
                      <button
                          key={section}
                          className={`news-carousel-tab px-4 py-4 text-lg text-center font-semibold rounded-lg shadow-md transition-all ${
                              activeTab === section ? "bg-primary text-primary-content" : "bg-base-200 hover:bg-base-300"
                          }`}
                          onClick={() => setActiveTab(section)}
                      >
                          {section}
                      </button>
                  ))}
              </div>
          </div>

          {/* Center Content - Selected Tab Information */}
          <div className="w-7/12 px-6">
              <h2 className="text-2xl font-bold text-primary-content text-center mb-4">{activeTab}</h2>

              {activeTab === "All Details" ? (
                  /* Display all sections in one view */
                  Object.keys(sections).map((section) => (
                      <div key={section} className="mb-6">
                          <h3 className="text-xl font-semibold text-secondary mt-4">{section}</h3>
                          <div className="p-4 bg-base-200 rounded-lg shadow-md mt-2">
                              <table className="table-auto border-collapse border border-neutral w-full text-sm">
                                  <colgroup>
                                      <col style={{ width: "40%" }} />
                                      <col style={{ width: "60%" }} />
                                  </colgroup>
                                  <tbody>
                                      {sections[section].map(({ label, value }) => (
                                          <tr key={label}>
                                              <td className="border-neutral px-4 py-2 font-semibold">{label}:</td>
                                              <td className="border-neutral px-4 py-2">
                                                  {label === "Resources" && nationDetails.resources && <ResourceDisplay />}
                                                  {label === "Bonus Resources" && nationDetails.bonusResources && <BonusResourceDisplay />}
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  ))
              ) : (
                  /* Display selected section */
                  <div className="p-4 bg-base-200 rounded-lg shadow-md">
                      <table className="table-auto border-collapse w-full text-sm">
                          <colgroup>
                              <col style={{ width: "40%" }} />
                              <col style={{ width: "60%" }} />
                          </colgroup>
                          <tbody>
                              {sections[activeTab].map(({ label, value }) => (
                                  <tr key={label}>
                                      <td className="px-4 py-2 font-semibold">{label}:</td>
                                      <td className="px-4 py-2">
                                      <td className="px-4 py-2">
                                          {label === "Resources" && nationDetails.resources && <ResourceDisplay />}
                                          {label === "Bonus Resources" && nationDetails.bonusResources && <BonusResourceDisplay />}
                                          {label !== "Resources" && label !== "Bonus Resources" && value}
                                      </td>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}
          </div>

          {/* Right Sidebar - Nation Posts */}
          <div className="w-2/12 pl-4 border-l border-neutral">
              <h2 className="text-lg font-semibold text-primary-content mb-4 text-center">Nation Posts</h2>
              <PostsTable />
              
              {isOwner && (
                  <div className="mt-4 p-4 bg-base-200 rounded-lg shadow-md">
                      <textarea
                          className="w-full p-2 border rounded-lg bg-base-100 text-base-content"
                          placeholder="Create post..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                      />
                      <button 
                          className="mt-2 px-4 py-2 bg-primary text-primary-content rounded-lg shadow-md w-full hover:bg-primary/80"
                          onClick={handlePostMessage}
                      >
                          Create Post
                      </button>
                  </div>
              )}
          </div>
      </div>
  );
}

export default NationDetailsPage;