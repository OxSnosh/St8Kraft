import { getTaxablePopulationCount } from './taxes';
import { InfrastructureContract } from '../../../../backend/typechain-types/contracts/Infrastructure.sol/InfrastructureContract';

export const getInfrastructureCount = async (
    nationId: string,
    publicClient: any,
    infrastructureContract: any
) => {
    if (!publicClient || !infrastructureContract || !nationId) {
        console.error("Missing required data: publicClient, infrastructureContract, or nationId.");
        return;
    }

    try {
        const infrastructureCount = await publicClient.readContract({
            abi: infrastructureContract.abi,
            address: infrastructureContract.address,
            functionName: "getInfrastructureCount",
            args: [nationId],
        });

        return infrastructureCount;
    } catch (error) {
        console.error("Error fetching infrastructure count:", error);
    }
} 

export const getTotalPopulationCount = async (
    nationId: string,
    publicClient: any,
    infrastructureContract: any
) => {
    if (!publicClient || !infrastructureContract || !nationId) {
        console.error("Missing required data: publicClient, populationContract, or nationId.");
        return;
    }

    try {
        const populationCount = await publicClient.readContract({
            abi: infrastructureContract.abi,
            address: infrastructureContract.address,
            functionName: "getTotalPopulationCount",
            args: [nationId],
        });

        return populationCount;
    } catch (error) {
        console.error("Error fetching population count:", error);
    }
}

export const getInfrastructureCostPerLevel = async (
    nationId: string,
    publicClient: any,
    infrastructureMarketContract: any
) => {
    if (!publicClient || !infrastructureMarketContract || !nationId) {
        console.error("Missing required data: publicClient, infrastructureContract, or nationId.");
        return;
    }

    try {
        const costPerLevel = await publicClient.readContract({
            abi: infrastructureMarketContract.abi,
            address: infrastructureMarketContract.address,
            functionName: "getInfrastructureCostPerLevel",
            args: [nationId],
        });

        return costPerLevel;
    } catch (error) {
        console.error("Error fetching infrastructure cost per level:", error);
    }
}

export const getInfrastructureCost = async (
    nationId: string,
    level: number,
    publicClient: any,
    infrastructureMarketContract: any
) => {
    if (!publicClient || !infrastructureMarketContract || !nationId) {
        console.error("Missing required data: publicClient, infrastructureContract, or nationId.");
        return;
    }

    try {
        const cost = await publicClient.readContract({
            abi: infrastructureMarketContract.abi,
            address: infrastructureMarketContract.address,
            functionName: "getInfrastructureCost",
            args: [nationId, level],
        });

        return cost;
    } catch (error) {
        console.error("Error fetching infrastructure cost:", error);
    }
}

export const buyInfrastructure = async (
    nationId: string,
    level: number,
    publicClient: any,
    infrastructureMarketContract: any,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !infrastructureMarketContract || !nationId) {
        console.error("Missing required data: publicClient, infrastructureContract, or nationId.");
        return;
    }

    try {
        const result = await writeContractAsync({
            abi: infrastructureMarketContract.abi,
            address: infrastructureMarketContract.address,
            functionName: "buyInfrastructure",
            args: [nationId, level],
        });

        return result;
    } catch (error) {
        console.error("Error buying infrastructure:", error);
    }
}

export const setTaxRate = async (
    nationId: string,
    taxRate: number,
    InfrastructureContract: any,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!nationId || !InfrastructureContract) {
        console.error("Missing required data: nationId or InfrastructureContract.");
        return;
    }

    try {
        const result = await writeContractAsync({
            abi: InfrastructureContract.abi,
            address: InfrastructureContract.address,
            functionName: "setTaxRate",
            args: [nationId, taxRate],
        });

        return result;
    } catch (error) {
        console.error("Error setting tax rate:", error);
    }
}
