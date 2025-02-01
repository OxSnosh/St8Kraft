
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


export const updateDefconLevel = async (
    nationId: string,
    publicClient: any,
    militaryContract: any,
    defconLevel: number,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !militaryContract || !nationId || !defconLevel) {
        console.log(publicClient, "publicClient")
        console.log(militaryContract, "militaryContract")
        console.log(nationId, "nationId")
        console.log(defconLevel, "defconLevel")
        console.error("Missing required data: publicClient, militaryContract, nationId, or defconLevel.");
        return;
    }

    return await writeContractAsync({
        abi: militaryContract.abi,
        address: militaryContract.address,
        functionName: "updateDefconLevel",
        args: [defconLevel, nationId],
    });
}

export const updateThreatLevel = async (
    nationId: string,
    publicClient: any,
    militaryContract: any,
    threatLevel: number,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !militaryContract || !nationId || !threatLevel) {
        console.log(publicClient, "publicClient")
        console.log(militaryContract, "militaryContract")
        console.log(nationId, "nationId")
        console.log(threatLevel, "threatLevel")
        console.error("Missing required data: publicClient, militaryContract, nationId, or threatLevel.");
        return;
    }

    return await writeContractAsync({
        abi: militaryContract.abi,
        address: militaryContract.address,
        functionName: "updateThreatLevel",
        args: [threatLevel, nationId],
    });
}

export const toggleWarPeacePreference = async (
    nationId: string,
    publicClient: any,
    militaryContract: any,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !militaryContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(militaryContract, "militaryContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, militaryContract, or nationId.");
        return;
    }

    return await writeContractAsync({
        abi: militaryContract.abi,
        address: militaryContract.address,
        functionName: "toggleWarPeacePreference",
        args: [nationId],
    });
}