
export const buyNukes = async (
    nationId: string,
    publicClient: any,
    missileContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !missileContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(missileContract, "missileContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, missileContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: missileContract.abi,
            address: missileContract.address,
            functionName: "buyNukes",
            args: [nationId],
        });
    } catch (error) {
        console.error("Error buying nukes:", error);
    }
}

export const getNukeCost = async (
    nationId: string,
    publicClient: any,
    missileContract: any
) => {
    if (!publicClient || !missileContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(missileContract, "missileContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, missileContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: missileContract.abi,
        address: missileContract.address,
        functionName: "getNukeCost",
        args: [nationId],
    });
}

export const getNukeCount = async (
    nationId: string,
    publicClient: any,
    missileContract: any
) => {
    if (!publicClient || !missileContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(missileContract, "missileContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, missileContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: missileContract.abi,
        address: missileContract.address,
        functionName: "getNukeCount",
        args: [nationId],
    });
}