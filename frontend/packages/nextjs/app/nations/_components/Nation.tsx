"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { usePublicClient } from "wagmi";
import { getResources, getBonusResources, getTradingPartners } from '../../../utils/resources';

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
};

const NationDetailsPage = () => {
  const searchParams = useSearchParams();
  const nationId = searchParams.get("id");
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const countryParametersContract = contractsData?.CountryParametersContract;
  const treasuryContract = contractsData?.TreasuryContract;
  const taxesContract = contractsData?.TaxesContract;
  const billsContract = contractsData?.BillsContract;
  const infrastructureContract = contractsData?.InfrastructureContract;
  const crimeContract = contractsData?.CrimeContract;
  const resourcesContract = contractsData?.ResourcesContract;
  const bonusResourcesContract = contractsData?.BonusResourcesContract;

  const [nationDetails, setNationDetails] = useState<NationDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNationDetails = async () => {
      if (!publicClient || !countryParametersContract || !nationId) {
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

        const balance = Number(balanceRaw) / (10 ** 18);

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
        const bonusResources = await getBonusResources(tokenIdString, bonusResourcesContract, publicClient);
        const tradingPartners = await getTradingPartners(tokenIdString, resourcesContract, publicClient);
      
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

          alliance: (await publicClient.readContract({
            abi: countryParametersContract.abi,
            address: countryParametersContract.address,
            functionName: "getAlliance",
            args: [tokenIdString],
          })) as string,

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

          balance: balance.toString(),

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{nationDetails.nationName}</h1>
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm mb-6 table-fixed">
        <colgroup>
          <col style={{ width: "50%" }} />
          <col style={{ width: "50%" }} />
        </colgroup>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Ruler Name:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.rulerName || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Capital City:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.capitalCity || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Slogan:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.nationSlogan || "No slogan available"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Day Created:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.dayCreated || "Unknown"}</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-lg font-semibold mb-4">Government Information</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm mb-6 table-fixed">
        <colgroup>
          <col style={{ width: "50%" }} />
          <col style={{ width: "50%" }} />
        </colgroup>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Alliance:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.alliance || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Team:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.team || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Resources:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.resources?.join(", ") || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Bonus Resources:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.bonusResources?.join(", ") || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Trading Partners:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.tradingPartners?.join(", ") || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Government Type:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.government || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">National Religion:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.religion || "Unknown"}</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-lg font-semibold mb-4">Treasury</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm mb-6 table-fixed">
        <colgroup>
          <col style={{ width: "50%" }} />
          <col style={{ width: "50%" }} />
        </colgroup>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Nation Balance:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.balance || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Happiness:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.happiness || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Daily Income Per Citizen:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.dailyIncome || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Tax Rate:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.taxRate || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Taxable Population:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.taxablePopulation || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Taxes Collectible:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.taxesCollectible || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Last Tax Collection:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.lastTaxCollection || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Bills Payable:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.billsPayable || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Last Bill Payment:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.lastBillPayment || "Unknown"}</td>
          </tr>
        </tbody>
      </table>

      <h2 className="txt-lg font-semibold mb-4">Infrastructure</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm mb-6 table-fixed">
        <colgroup>
          <col style={{ width: "50%" }} />
          <col style={{ width: "50%" }} />
        </colgroup>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Technology Count:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.technologyCount || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Infrastructure Count:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.infrastructureCount || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Land Count:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.landCount || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Area of Influence:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.areaOfInfluence || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Total Population:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.totalPopulation || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Population Density:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.populationDensity || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Taxable Population:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.taxablePopulation || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Criminal Count:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.criminalCount || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Crime Prevention Score:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.crimePreventionScore || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Crime Index:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.crimeIndex || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Literacy Rate:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.literacyRate || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Rehabilitated Citizens:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.rehabilitatedCitizens || "Unknown"}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-semibold">Incarcerated Citizens:</td>
            <td className="border border-gray-300 px-4 py-2">{nationDetails.incarceratedCitizens || "Unknown"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NationDetailsPage;
