
export const getSoldierCount = async (
    nationId: string,
    publicClient: any,
    forcesContracat: any
) => {
    if (!publicClient || !forcesContracat || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(forcesContracat, "forcesContracat")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, forcesContracat, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: forcesContracat.abi,
        address: forcesContracat.address,
        functionName: "getSoldierCount",
        args: [nationId],
    });
}

export const getSoldierCost = async (
    nationId: string,
    publicClient: any,
    forcesContracat: any
) => {
    if (!publicClient || !forcesContracat || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(forcesContracat, "forcesContracat")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, forcesContracat, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: forcesContracat.abi,
        address: forcesContracat.address,
        functionName: "getSoldierCost",
        args: [nationId],
    });
}

export const getDefendingSoldierCount = async (
    nationId: string,
    publicClient: any,
    forcesContracat: any
) => {
    if (!publicClient || !forcesContracat || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(forcesContracat, "forcesContracat")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, forcesContracat, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: forcesContracat.abi,
        address: forcesContracat.address,
        functionName: "getDefendingSoldierCount",
        args: [nationId],
    });
}

export const getDeployedSoldierCount = async (
    nationId: string,
    publicClient: any,
    forcesContracat: any
) => {
    if (!publicClient || !forcesContracat || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(forcesContracat, "forcesContracat")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, forcesContracat, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: forcesContracat.abi,
        address: forcesContracat.address,
        functionName: "getDeployedSoldierCount",
        args: [nationId],
    });
}

export const getDefendingSoldierEfficiencyModifier = async (
    nationId: string,
    publicClient: any,
    forcesContracat: any
) => {
    if (!publicClient || !forcesContracat || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(forcesContracat, "forcesContracat")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, forcesContracat, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: forcesContracat.abi,
        address: forcesContracat.address,
        functionName: "getDefendingSoldierEfficiencyModifier",
        args: [nationId],
    });
}

export const getDeployedSoldierEfficiencyModifier = async (
    nationId: string,
    publicClient: any,
    forcesContracat: any
) => {
    if (!publicClient || !forcesContracat || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(forcesContracat, "forcesContracat")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, forcesContracat, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: forcesContracat.abi,
        address: forcesContracat.address,
        functionName: "getDeployedSoldierEfficiencyModifier",
        args: [nationId],
    });
}

export const getTankCount = async (
    nationId: string,
    publicClient: any,
    forcesContracat: any
) => {
    if (!publicClient || !forcesContracat || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(forcesContracat, "forcesContracat")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, forcesContracat, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: forcesContracat.abi,
        address: forcesContracat.address,
        functionName: "getTankCount",
        args: [nationId],
    });
}

export const getTankCost = async (
    nationId: string,
    publicClient: any,
    forcesContracat: any
) => {
    if (!publicClient || !forcesContracat || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(forcesContracat, "forcesContracat")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, forcesContracat, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: forcesContracat.abi,
        address: forcesContracat.address,
        functionName: "getTankCost",
        args: [nationId],
    });
}

export const getMaxTankCount = async (
    nationId: string,
    publicClient: any,
    forcesContracat: any
) => {
    if (!publicClient || !forcesContracat || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(forcesContracat, "forcesContracat")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, forcesContracat, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: forcesContracat.abi,
        address: forcesContracat.address,
        functionName: "getMaxTankCount",
        args: [nationId],
    });
}

export const getDefendingTankCount = async (
    nationId: string,
    publicClient: any,
    forcesContracat: any
) => {
    if (!publicClient || !forcesContracat || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(forcesContracat, "forcesContracat")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, forcesContracat, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: forcesContracat.abi,
        address: forcesContracat.address,
        functionName: "getDefendingTankCount",
        args: [nationId],
    });
}

export const getDeployedTankCount = async (
    nationId: string,
    publicClient: any,
    forcesContracat: any
) => {
    if (!publicClient || !forcesContracat || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(forcesContracat, "forcesContracat")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, forcesContracat, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: forcesContracat.abi,
        address: forcesContracat.address,
        functionName: "getDeployedTankCount",
        args: [nationId],
    });
}

export const getCasualties = async (
    nationId: string,
    publicClient: any,
    forcesContracat: any
) => {
    if (!publicClient || !forcesContracat || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(forcesContracat, "forcesContracat")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, forcesContracat, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: forcesContracat.abi,
        address: forcesContracat.address,
        functionName: "getCasualties",
        args: [nationId],
    });
}

export const buySoldiers = async (
    nationId: string,
    amount: number,
    publicClient: any,
    forcesContracat: any,
    writeContractAsync: any
) => {
    if (!publicClient || !forcesContracat || !nationId) {
        console.error("Missing required data: publicClient, forcesContracat, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: forcesContracat.abi,
            address: forcesContracat.address,
            functionName: "buySoldiers",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying soldiers:", error);
    }
}

export const buyTanks = async (
    nationId: string,
    amount: number,
    publicClient: any,
    forcesContracat: any,
    writeContractAsync: any
) => {
    if (!publicClient || !forcesContracat || !nationId) {
        console.error("Missing required data: publicClient, forcesContracat, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: forcesContracat.abi,
            address: forcesContracat.address,
            functionName: "buyTanks",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying tanks:", error);
    }
}

export const decommissionSoldiers = async (
    nationId: string,
    amount: number,
    publicClient: any,
    forcesContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !forcesContract || !nationId) {
        console.error("Missing required data: publicClient, forcesContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: forcesContract.abi,
            address: forcesContract.address,
            functionName: "decommissionSoldiers",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error decommissioning soldiers:", error);
    }
};

export const decommissionTanks = async (
    nationId: string,
    amount: number,
    publicClient: any,
    forcesContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !forcesContract || !nationId) {
        console.error("Missing required data: publicClient, forcesContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: forcesContract.abi,
            address: forcesContract.address,
            functionName: "decommissionTanks",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error decommissioning tanks:", error);
    }
};





