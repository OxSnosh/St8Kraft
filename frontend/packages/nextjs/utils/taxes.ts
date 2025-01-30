import { useWriteContract } from 'wagmi';




export const getTaxesCollectible = async (
    nationId: string,
    publicClient: any,
    taxContract: any
) => {
    if (!publicClient || !taxContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(taxContract, "taxContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, taxContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: taxContract.abi,
        address: taxContract.address,
        functionName: "getTaxesCollectible",
        args: [nationId],
    });
}

export const collectTaxes = async (
    nationId: string,
    publicClient: any,
    taxContract: any,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !taxContract || !nationId) {
        console.error("Missing required data: publicClient, taxContract, or nationId.");
        return;
    }

    return await writeContractAsync({
        abi: taxContract.abi,
        address: taxContract.address,
        functionName: "collectTaxes",
        args: [nationId],
    });
};

export const getDailyIncome = async (
    nationId: string,
    publicClient: any,
    taxContract: any
) => {
    if (!publicClient || !taxContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(taxContract, "taxContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, taxContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: taxContract.abi,
        address: taxContract.address,
        functionName: "getDailyIncome",
        args: [nationId],
    });
}

export const getTaxRate = async (
    nationId: string,
    publicClient: any,
    infrastructureContract: any
) => {
    if (!publicClient || !infrastructureContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(infrastructureContract, "taxContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, taxContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: infrastructureContract.abi,
        address: infrastructureContract.address,
        functionName: "getTaxRate",
        args: [nationId],
    });
}

export const getTaxablePopulationCount = async (
    nationId: string,
    publicClient: any,
    infrastructureContract: any
) => {
    if (!publicClient || !infrastructureContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(infrastructureContract, "taxContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, taxContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: infrastructureContract.abi,
        address: infrastructureContract.address,
        functionName: "getTaxablePopulationCount",
        args: [nationId],
    });
}

export const getHappiness = async (
    nationId: string,
    publicClient: any,
    taxesContract: any
) => {
    if (!publicClient || !taxesContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(taxesContract, "taxContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, taxContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: taxesContract.abi,
        address: taxesContract.address,
        functionName: "getHappiness",
        args: [nationId],
    });
}

