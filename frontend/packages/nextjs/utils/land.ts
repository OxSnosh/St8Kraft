
export const getLandCount = async (
    nationId: string,
    publicClient: any,
    infrastructreContract: any
) => {
    if (!publicClient || !infrastructreContract || !nationId) {
        console.error("Missing required data: publicClient, landContract, or nationId.");
        return;
    }

    try {
        const landCount = await publicClient.readContract({
            abi: infrastructreContract.abi,
            address: infrastructreContract.address,
            functionName: "getLandCount",
            args: [nationId],
        });

        return landCount;
    } catch (error) {
        console.error("Error fetching land count:", error);
    }
}

export const getAreaOfInfluence = async (
    nationId: string,
    publicClient: any,
    infrastructreContract: any
) => {
    if (!publicClient || !infrastructreContract || !nationId) {
        console.error("Missing required data: publicClient, landContract, or nationId.");
        return;
    }

    try {
        const areaOfInfluence = await publicClient.readContract({
            abi: infrastructreContract.abi,
            address: infrastructreContract.address,
            functionName: "getAreaOfInfluence",
            args: [nationId],
        });

        return areaOfInfluence;
    } catch (error) {
        console.error("Error fetching area of influence:", error);
    }
}

export const buyLand = async (
    nationId: string,
    amount: number,
    publicClient: any,
    landMarketContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !landMarketContract || !nationId) {
        console.error("Missing required data: publicClient, landMarketContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: landMarketContract.abi,
            address: landMarketContract.address,
            functionName: "buyLand",
            args: [nationId, amount],
        });
    } catch (error) {
        console.error("Error buying land:", error);
    }
}

export const getLandCost = async (
    nationId: string,
    level: number,
    publicClient: any,
    landMarketContract: any
) => {
    if (!publicClient || !landMarketContract || !nationId) {
        console.error("Missing required data: publicClient, landMarketContract, or nationId.");
        return;
    }

    try {
        const cost = await publicClient.readContract({
            abi: landMarketContract.abi,
            address: landMarketContract.address,
            functionName: "getLandCost",
            args: [nationId, level],
        });

        return cost;
    } catch (error) {
        console.error("Error fetching land cost:", error);
    }
}

export const getLandCostPerMile = async (
    nationId: string,
    publicClient: any,
    landMarketContract: any
) => {
    if (!publicClient || !landMarketContract || !nationId) {
        console.error("Missing required data: publicClient, landMarketContract, or nationId.");
        return;
    }

    try {
        const costPerLevel = await publicClient.readContract({
            abi: landMarketContract.abi,
            address: landMarketContract.address,
            functionName: "getLandCostPerMile",
            args: [nationId],
        });

        return costPerLevel;
    } catch (error) {
        console.error("Error fetching land cost per level:", error);
    }
}

export const destroyLand = async (
    nationId: string,
    amount: number,
    publicClient: any,
    landContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !landContract || !nationId) {
        console.error("Missing required data: publicClient, landContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: landContract.abi,
            address: landContract.address,
            functionName: "destroyLand",
            args: [nationId, amount],
        });

        console.log(`Successfully destroyed ${amount} land for Nation ID: ${nationId}`);
    } catch (error) {
        console.error("Error destroying land:", error);
    }
};




