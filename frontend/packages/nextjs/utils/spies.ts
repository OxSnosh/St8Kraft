
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

export const getSpyPrice = async (
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
        functionName: "getSpyPrice",
        args: [],
    });
}

export const getMaxSpyCount = async (
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
        functionName: "getMaxSpyCount",
        args: [nationId],
    });
}

export const buySpies = async (
    amount: number,
    nationId: string,
    publicClient: any,
    spyContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !spyContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(spyContract, "spyContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, spyContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: spyContract.abi,
            address: spyContract.address,
            functionName: "buySpies",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying spies:", error);
    }
}