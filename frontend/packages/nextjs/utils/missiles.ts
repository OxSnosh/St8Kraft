
export const getCruiseMissileCount = async (
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
        functionName: "getCruiseMissileCount",
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