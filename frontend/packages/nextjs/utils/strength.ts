
export const getNationStrength = async (
    nationId: string,
    publicClient: any,
    strengthContract: any
) => {
    if (!publicClient || !strengthContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(strengthContract, "strengthContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, strengthContract, or nationId.");
        return;
    }

    return publicClient.readContract({
        abi: strengthContract.abi,
        address: strengthContract.address,
        functionName: "getNationStrength",
        args: [nationId],
    });
}