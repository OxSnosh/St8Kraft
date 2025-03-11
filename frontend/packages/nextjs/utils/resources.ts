
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
        { key: "viewAluminium", name: "Aluminium", link: "icons/aluminium.svg" },
        { key: "viewCattle", name: "Cattle", link: "icons/cattle.svg" },
        { key: "viewCoal", name: "Coal", link: "icons/coal.svg" },
        { key: "viewFish", name: "Fish", link: "icons/fish.svg" },
        { key: "viewFurs", name: "Furs", link: "icons/furs.svg" },
        { key: "viewGems", name: "Gems", link: "icons/gems.svg" },
        { key: "viewGold", name: "Gold", link: "icons/gold.svg" },
        { key: "viewIron", name: "Iron", link: "icons/iron.svg" },
        { key: "viewLead", name: "Lead", link: "icons/lead.svg" },
        { key: "viewLumber", name: "Lumber", link: "icons/lumber.svg" },
        { key: "viewMarble", name: "Marble", link: "icons/marble.svg" },
        { key: "viewOil", name: "Oil", link: "icons/oil.svg" },
        { key: "viewPigs", name: "Pigs", link: "icons/pigs.svg" },
        { key: "viewRubber", name: "Rubber", link: "icons/rubber.svg" },
        { key: "viewSilver", name: "Silver", link: "icons/silver.svg" },
        { key: "viewSpices", name: "Spices", link: "icons/spices.svg" },
        { key: "viewSugar", name: "Sugar", link: "icons/sugar.svg" },
        { key: "viewUranium", name: "Uranium", link: "icons/uranium.svg" },
        { key: "viewWater", name: "Water", link: "icons/water.svg" },
        { key: "viewWheat", name: "Wheat", link: "icons/wheat.svg" },
        { key: "viewWine", name: "Wine", link: "icons/wine.svg" },
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
      console.log("Resources from function:", resources);
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
            { key: "viewBeer", name: "Beer", link: "icons/beer.svg" },
            { key: "viewSteel", name: "Steel", link: "icons/steel.svg" },
            { key: "viewConstruction", name: "Construction", link: "icons/construction.svg" },
            { key: "viewFastFood", name: "Fast Food", link: "icons/fast-food.svg" },
            { key: "viewFineJewelry", name: "Fine Jewelry", link: "icons/fine-jewelry.svg" },
            { key: "viewScholars", name: "Scholars", link: "icons/scholars.svg" },
            { key: "viewAsphalt", name: "Asphalt", link: "icons/asphalt.svg" },
            { key: "viewAutomobiles", name: "Automobiles", link: "icons/automobiles.svg" },
            { key: "viewAffluentPopulation", name: "Affluent Population", link: "icons/affluent-population.svg" },
            { key: "viewMicrochips", name: "Microchips", link: "icons/microchips.svg" },
            { key: "viewRadiationCleanup", name: "Radiation Cleanup", link: "icons/radiation-cleanup.svg" },
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
      { key: 0, name: "Aluminium" },
      { key: 1, name: "Cattle" },
      { key: 2, name: "Coal" },
      { key: 3, name: "Fish" },
      { key: 4, name: "Furs" },
      { key: 5, name: "Gems" },
      { key: 6, name: "Gold" },
      { key: 7, name: "Iron" },
      { key: 8, name: "Lead" },
      { key: 9, name: "Lumber" },
      { key: 10, name: "Marble" },
      { key: 11, name: "Oil" },
      { key: 12, name: "Pigs" },
      { key: 13, name: "Rubber" },
      { key: 14, name: "Silver" },
      { key: 15, name: "Spices" },
      { key: 16, name: "Sugar" },
      { key: 17, name: "Uranium" },
      { key: 18, name: "Water" },
      { key: 19, name: "Wheat" },
      { key: 20, name: "Wine" },
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


