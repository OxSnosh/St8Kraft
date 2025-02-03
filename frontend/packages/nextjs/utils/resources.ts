import { LinkToken__factory } from '../../../../backend/typechain-types/factories/@chainlink/contracts/src/v0.4/LinkToken__factory';

export const getResources = async (
    nationId: string,
    resourcesContract: any,
    publicClient: any
  ) => {
    const resources: string[] = [];

    if (!publicClient || !resourcesContract || !nationId) {
      console.error("Missing required data: publicClient, resourcesContract, or nationId.");
      return [];
    }

    try {
      const resourceNames = [
        { key: "viewAluminium", name: "Aluminium" },
        { key: "viewCattle", name: "Cattle" },
        { key: "viewCoal", name: "Coal" },
        { key: "viewFish", name: "Fish" },
        { key: "viewFurs", name: "Furs" },
        { key: "viewGems", name: "Gems" },
        { key: "viewGold", name: "Gold" },
        { key: "viewIron", name: "Iron" },
        { key: "viewLead", name: "Lead" },
        { key: "viewLumber", name: "Lumber" },
        { key: "viewMarble", name: "Marble" },
        { key: "viewOil", name: "Oil" },
        { key: "viewPigs", name: "Pigs" },
        { key: "viewRubber", name: "Rubber" },
        { key: "viewSilver", name: "Silver" },
        { key: "viewSpices", name: "Spices" },
        { key: "viewSugar", name: "Sugar" },
        { key: "viewUranium", name: "Uranium" },
        { key: "viewWater", name: "Water" },
        { key: "viewWheat", name: "Wheat" },
        { key: "viewWine", name: "Wine" },
      ];
  
      for (const { key, name } of resourceNames) {
        const hasResource = await publicClient.readContract({
          abi: resourcesContract.abi,
          address: resourcesContract.address,
          functionName: key,
          args: [nationId],
        });
  
        if (hasResource) {
          resources.push(name);
        }
      }

      return resources;
    } catch (error) {
      console.error("Error fetching resources:", error);
      return [];
    }
  };

export const getBonusResources = async ( 
    nationId : string,
    bonusResourcesContract: any,
    publicClient: any
) => {
    const bonusResources: string[] = [];

    if (!publicClient || !bonusResourcesContract || !nationId) {
        console.error("Missing required data: publicClient, bonusResourcesContract, or nationId.");
        return;
    }

    try {
        const bonusResourceNames = [
            { key: "viewBeer", name: "Beer" },
            { key: "viewSteel", name: "Steel" },
            { key: "viewConstruction", name: "Construction" },
            { key: "viewFastFood", name: "Fast Food" },
            { key: "viewFineJewelry", name: "Fine Jewelry" },
            { key: "viewScholars", name: "Scholars" },
            { key: "viewAsphalt", name: "Asphalt" },
            { key: "viewAutomobiles", name: "Automobiles" },
            { key: "viewAffluentPopulation", name: "Affluent Population" },
            { key: "viewMicrochips", name: "Microchips" },
            { key: "viewRadiationCleanup", name: "Radiation Cleanup" },
        ];

        for (const { key, name } of bonusResourceNames) {
            const hasBonusResource = await publicClient.readContract({
                abi: bonusResourcesContract.abi,
                address: bonusResourcesContract.address,
                functionName: key,
                args: [nationId],
            });

            if (hasBonusResource) {
                bonusResources.push(name);
            }
        }

        return bonusResources;
    } catch (error) {
        console.error("Error fetching bonus resources:", error);
        return [];
    }
}

export const getTradingPartners = async (
    nationIdArg: string, 
    resourcesContract: any, 
    publicClient: any): Promise<string[]> => {
  if (!resourcesContract || !publicClient || !nationIdArg) {
    console.log(resourcesContract, publicClient, nationIdArg);
    console.error("Missing required parameters in getTradingPartners.");
    return [];
  }

  try {
    const tradingPartners = await publicClient.readContract({
      abi: resourcesContract.abi,
      address: resourcesContract.address,
      functionName: "getTradingPartners",
      args: [nationIdArg],
    });
    return tradingPartners || [];
  } catch (error) {
    console.error("Error fetching trading partners:", error);
    return [];
  }
};

export const getPlayerResources = async (
  nationId: string,
  bonusResourcesContract: any,
  publicClient: any
) => {
  if (!publicClient || !bonusResourcesContract || !nationId) {
      console.error("Missing required data: publicClient, bonusResourcesContract, or nationId.");
      return [];
  }

  console.log("Fetching player resources for nation ID:", nationId);

  const resources = await publicClient.readContract({
      abi: bonusResourcesContract.abi,
      address: bonusResourcesContract.address,
      functionName: "getPlayerResources",
      args: [nationId],
  });

  if (!resources || !Array.isArray(resources)) {
      return [];
  }

  console.log("Resources:", resources);

  const resourceKey = [
      { key: 1, name: "Aluminium" },
      { key: 2, name: "Cattle" },
      { key: 3, name: "Coal" },
      { key: 4, name: "Fish" },
      { key: 5, name: "Furs" },
      { key: 6, name: "Gems" },
      { key: 7, name: "Gold" },
      { key: 8, name: "Iron" },
      { key: 9, name: "Lead" },
      { key: 10, name: "Lumber" },
      { key: 11, name: "Marble" },
      { key: 12, name: "Oil" },
      { key: 13, name: "Pigs" },
      { key: 14, name: "Rubber" },
      { key: 15, name: "Silver" },
      { key: 16, name: "Spices" },
      { key: 17, name: "Sugar" },
      { key: 18, name: "Uranium" },
      { key: 19, name: "Water" },
      { key: 20, name: "Wheat" },
      { key: 21, name: "Wine" },
  ];

  const playerResources: string[] = resources
      .map((resource) => {
          const resourceKeyItem = resourceKey.find((key) => key.key === Number(resource));
          return resourceKeyItem ? resourceKeyItem.name : null;
      })
      .filter((name) => name !== null) as string[];

  return playerResources.slice(0, 2);
};

export const proposeTrade = async (
  nationId : any, 
  partnerId : any,
  ResourcesContract: any, 
  writeContractAsync: any
) => {
  if (!ResourcesContract?.abi || !ResourcesContract?.address) {
      console.error("ResourcesContract ABI or address is missing.");
      return;
  }

  console.log("Proposing trade with:", nationId, partnerId); // Debug logs

  try {
      await writeContractAsync({
          address: ResourcesContract.address,
          abi: ResourcesContract.abi,
          functionName: "proposeTrade",  // Ensure this matches exactly with your contract
          args: [nationId, partnerId],   // Ensure this matches the function signature
      });
  } catch (error) {
      console.error("Error inside proposeTrade:", error);
  }
};

export const acceptTrade = async (
  proposingNationId: string,
  proposedNationId: string,
  resourcesContract: any,
  writeContractAsync: any
) => {
  console.log("Accepting trade with:", proposingNationId, proposedNationId);
  if ( !resourcesContract || !proposingNationId || !proposedNationId) {
    console.log(resourcesContract, "resourcesContract")
    console.log(proposingNationId, "proposingNationId")
    console.log(proposedNationId, "proposedNationId")
    console.error("Missing required data: publicClient, resourcesContract, proposingNationId, or proposedNationId.");
    return;
  }

  return await writeContractAsync({
    abi: resourcesContract.abi,
    address: resourcesContract.address,
    functionName: "fulfillTradingPartner",
    args: [proposedNationId, proposingNationId],
  });
}

export const cancelTrade = async (
  nationId: string,
  partnerId: string,
  resourcesContract: any,
  writeContractAsync: any
) => {
  console.log("Cancelling trade with:", nationId, partnerId);
  if ( !resourcesContract || !nationId || !partnerId) {
    console.log(resourcesContract, "resourcesContract")
    console.log(partnerId, "partnerId")
    console.log(nationId, "nationId")
    console.error("Missing required data: publicClient, resourcesContract, nationId, or partnerId.");
    return;
  }

  return await writeContractAsync({
    abi: resourcesContract.abi,
    address: resourcesContract.address,
    functionName: "cancelProposedTrade",
    args: [nationId, partnerId],
  });
}

export const getProposedTradingPartners = async (
  nationId: string,
  publicClient: any,
  resourcesContract: any,
) => {
  if (!publicClient || !resourcesContract || !nationId) {
    console.log(publicClient, "publicClient")
    console.log(resourcesContract, "resourcesContract")
    console.log(nationId, "nationId")
    console.error("Missing required data: publicClient, resourcesContract, or nationId.");
    return [];
  }
  console.log(publicClient, "publicClient")
  console.log(resourcesContract, "resourcesContract")
  console.log(nationId, "nationId")
  try {
    const tradingPartners = await publicClient.readContract({
      abi: resourcesContract.abi,
      address: resourcesContract.address,
      functionName: "getProposedTradingPartners",
      args: [nationId],
    });
    return tradingPartners || [];
  } catch (error) {
    console.error("Error fetching proposed trading partners:", error);
    return [];
  }
}

export const removeTradingPartner = async (
  nationId: string,
  partnerId: string,
  resourcesContract: any,
  writeContractAsync: any
) => {
  if (!resourcesContract || !nationId || !partnerId) {
    console.error("Missing required data: resourcesContract, nationId, or partnerId.");
    return;
  }

  return await writeContractAsync({
    abi: resourcesContract.abi,
    address: resourcesContract.address,
    functionName: "removeTradingPartner",
    args: [nationId, partnerId],
  });
}


