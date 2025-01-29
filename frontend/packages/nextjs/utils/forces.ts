
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



