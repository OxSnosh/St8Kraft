
export const getTechnologyCount = async (
    nationId: string,
    publicClient: any,
    infrastructureContract: any
) => {
    if (!publicClient || !infrastructureContract || !nationId) {
        console.error("Missing required data: publicClient, technologyContract, or nationId.");
        return;
    }

    try {
        const technologyCount = await publicClient.readContract({
            abi: infrastructureContract.abi,
            address: infrastructureContract.address,
            functionName: "getTechnologyCount",
            args: [nationId],
        });

        return technologyCount;
    } catch (error) {
        console.error("Error fetching technology count:", error);
    }
}

export const buyTechnology = async (
    nationId: string,
    amount: number,
    publicClient: any,
    technologyMarketContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !technologyMarketContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(technologyMarketContract, "technologyMarketContract")
        console.log(nationId, "nationId")
        console.log(amount, "amount")
        console.error("Missing required data: publicClient, technologyContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: technologyMarketContract.abi,
            address: technologyMarketContract.address,
            functionName: "buyTech",
            args: [nationId, amount],
        });
    } catch (error) {
        console.error("Error buying technology:", error);
    }
}

export const getTechnologyCost = async (
    nationId: string,
    level: number,
    publicClient: any,
    technologyMarketContract: any
) => {
    if (!publicClient || !technologyMarketContract || !nationId) {
        console.error("Missing required data: publicClient, infrastructureContract, or nationId.");
        return;
    }

    try {
        const cost = await publicClient.readContract({
            abi: technologyMarketContract.abi,
            address: technologyMarketContract.address,
            functionName: "getTechCost",
            args: [nationId, level],
        });

        return cost;
    } catch (error) {
        console.error("Error fetching technology cost:", error);
    }
}

export const getTechnologyCostPerLevel = async (
    nationId: string,
    publicClient: any,
    technologyMarketContract: any
) => {
    if (!publicClient || !technologyMarketContract || !nationId) {
        console.error("Missing required data: publicClient, technologyContract, or nationId.");
        return;
    }

    try {
        const costPerLevel = await publicClient.readContract({
            abi: technologyMarketContract.abi,
            address: technologyMarketContract.address,
            functionName: "getTechCostPerLevel",
            args: [nationId],
        });

        return costPerLevel;
    } catch (error) {
        console.error("Error fetching technology cost per level:", error);
    }
}


export const destroyTech = async (
    nationId: string,
    amount: number,
    publicClient: any,
    techContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !techContract || !nationId || !amount || amount <= 0) {
        console.error("Missing required data: publicClient, techContract, nationId, or amount.");
        return;
    }

    try {
        await writeContractAsync({
            abi: techContract.abi,
            address: techContract.address,
            functionName: "destroyTech",
            args: [nationId, amount],
        });

        console.log(`Successfully destroyed ${amount} technology for nation ${nationId}`);
        alert(`Successfully destroyed ${amount} technology.`);
    } catch (error) {
        console.error("Error destroying technology:", error);
        alert("Failed to destroy technology. Please try again.");
    }
};