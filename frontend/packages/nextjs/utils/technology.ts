
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

