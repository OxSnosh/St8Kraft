
export const getSpyCount = async (
    nationId: string,
    publicClient: any,
    spyContract: any
) => {
    if (!publicClient || !spyContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(spyContract, "spyContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, spyContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: spyContract.abi,
        address: spyContract.address,
        functionName: "getSpyCount",
        args: [nationId],
    });
}