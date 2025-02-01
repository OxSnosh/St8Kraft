
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

export const addFunds = async (
    nationId: string,
    publicClient: any,
    treasuryContract: any,
    amount: number,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !treasuryContract || !nationId) {
        console.error("Missing required data: publicClient, treasuryContract, or nationId.");
        return;
    }

    return await writeContractAsync({
        abi: treasuryContract.abi,
        address: treasuryContract.address,
        functionName: "addFunds",
        args: [amount, nationId],
    });
}

export const withdrawFunds = async (
    nationId: string,
    publicClient: any,
    treasuryContract: any,
    amount: number,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !treasuryContract || !nationId) {
        console.error("Missing required data: publicClient, treasuryContract, or nationId.");
        return;
    }

    return await writeContractAsync({
        abi: treasuryContract.abi,
        address: treasuryContract.address,
        functionName: "withdrawFunds",
        args: [amount, nationId],
    });
}
