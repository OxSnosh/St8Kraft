
export const getCruiseMissileCount = async (
    nationId: string,
    publicClient: any,
    missilesContract: any
) => {
    if (!publicClient || !missilesContract || !nationId) {
        console.error("Missing required data: publicClient, forcesContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: missilesContract.abi,
        address: missilesContract.address,
        functionName: "getCruiseMissileCount",
        args: [nationId],
    });
}

export const getCruiseMissileCost = async (
    nationId: string,
    publicClient: any,
    missilesContract: any
) => {
    if (!publicClient || !missilesContract || !nationId) {
        console.error("Missing required data: publicClient, forcesContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: missilesContract.abi,
        address: missilesContract.address,
        functionName: "getCruiseMissileCost",
        args: [nationId],
    });
}

export const buyCruiseMissiles = async (
    amount: number,
    nationId: string,
    publicClient: any,
    missilesContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !missilesContract || !nationId) {
        console.error("Missing required data: publicClient, forcesContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: missilesContract.abi,
            address: missilesContract.address,
            functionName: "buyCruiseMissiles",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying cruise missiles:", error);
    }
}