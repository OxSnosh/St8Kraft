
export const getDefconLevel = async (
    nationId: string,
    publicClient: any,
    militaryContract: any
) => {
    if (!publicClient || !militaryContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(militaryContract, "strengthContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, strengthContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: militaryContract.abi,
        address: militaryContract.address,
        functionName: "getDefconLevel",
        args: [nationId],
    });
}

export const getThreatLevel = async (
    nationId: string,
    publicClient: any,
    militaryContract: any
) => {
    if (!publicClient || !militaryContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(militaryContract, "strengthContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, strengthContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: militaryContract.abi,
        address: militaryContract.address,
        functionName: "getThreatLevel",
        args: [nationId],
    });
}

export const getWarPeacePreference = async (
    nationId: string,
    publicClient: any,
    militaryContract: any
) => {
    if (!publicClient || !militaryContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(militaryContract, "strengthContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, strengthContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: militaryContract.abi,
        address: militaryContract.address,
        functionName: "getWarPeacePreference",
        args: [nationId],
    });
}

export const getDaysInPeaceMode = async (
    nationId: string,
    publicClient: any,
    militaryContract: any
) => {
    if (!publicClient || !militaryContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(militaryContract, "strengthContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, strengthContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: militaryContract.abi,
        address: militaryContract.address,
        functionName: "getDaysInPeaceMode",
        args: [nationId],
    });
}