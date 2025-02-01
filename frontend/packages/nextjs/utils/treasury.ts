
export const checkBalance = async (
    nationId: string,
    publicClient: any,
    treasuryContract: any
) => {
    if (!publicClient || !treasuryContract || !nationId) {
        console.error("Missing required data: publicClient, treasuryContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: treasuryContract.abi,
        address: treasuryContract.address,
        functionName: "checkBalance",
        args: [nationId],
    });
}

export const getDaysSinceLastBillsPaid = async (
    nationId: string,
    publicClient: any,
    treasuryContract: any
) => {
    if (!publicClient || !treasuryContract || !nationId) {
        console.error("Missing required data: publicClient, treasuryContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: treasuryContract.abi,
        address: treasuryContract.address,
        functionName: "getDaysSinceLastBillsPaid",
        args: [nationId],
    });
}