
export const getBillsPayable = async (
    nationId: string,
    publicClient: any,
    billsContract: any
) => {
    if (!publicClient || !billsContract || !nationId) {
        console.error("Missing required data: publicClient, treasuryContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: billsContract.abi,
        address: billsContract.address,
        functionName: "getBillsPayable",
        args: [nationId],
    });
}

export const payBills = async (
    nationId: string,
    publicClient: any,
    billsContract: any,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !billsContract || !nationId) {
        console.error("Missing required data: publicClient, treasuryContract, or nationId.");
        return;
    }

    return await writeContractAsync({
        abi: billsContract.abi,
        address: billsContract.address,
        functionName: "payBills",
        args: [nationId],
    });
}

export const calculateDailyBillsFromInfrastructure = async ( 
    nationId: string,
    publicClient: any,
    billsContract: any
) => {
    if (!publicClient || !billsContract || !nationId) {
        console.error("Missing required data: publicClient, treasuryContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: billsContract.abi,
        address: billsContract.address,
        functionName: "calculateDailyBillsFromInfrastructure",
        args: [nationId],
    });
}

export const calculateDailyBillsFromMilitary = async ( 
    nationId: string,
    publicClient: any,
    billsContract: any
) => {
    if (!publicClient || !billsContract || !nationId) {
        console.error("Missing required data: publicClient, treasuryContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: billsContract.abi,
        address: billsContract.address,
        functionName: "calculateDailyBillsFromMilitary",
        args: [nationId],
    });
}

export const calculateDailyBillsFromImprovements = async ( 
    nationId: string,
    publicClient: any,
    billsContract: any
) => {
    if (!publicClient || !billsContract || !nationId) {
        console.error("Missing required data: publicClient, treasuryContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: billsContract.abi,
        address: billsContract.address,
        functionName: "calculateDailyBillsFromImprovements",
        args: [nationId],
    });
}

