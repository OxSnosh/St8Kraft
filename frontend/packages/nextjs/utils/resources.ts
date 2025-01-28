type Resources = string[]
type BonusResources = string[]
type TradingPartners = string[]

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
    const bonusResources: BonusResources = [];

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