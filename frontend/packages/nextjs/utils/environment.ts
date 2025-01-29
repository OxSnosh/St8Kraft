

export const getEnvironmentScore = async (
    nationId: string,
    publicClient: any,
    environmentContract: any
) => {
    if (!publicClient || !environmentContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(environmentContract, "environmentContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, environmentContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: environmentContract.abi,
        address: environmentContract.address,
        functionName: "getEnvironmentScore",
        args: [nationId],
    });
}