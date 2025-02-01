

export const balanceOf = async (
    address: string,
    publicClient: any,
    warBucksContract: any
) => {
    if (!publicClient || !warBucksContract || !address) {
        console.log(publicClient, "publicClient")
        console.log(warBucksContract, "warBucksContract")
        console.log(address, "nationId")
        console.error("Missing required data: publicClient, warBucksContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: warBucksContract.abi,
        address: warBucksContract.address,
        functionName: "balanceOf",
        args: [address],
    });
}