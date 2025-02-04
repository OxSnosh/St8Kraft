
export const declareWar = async (
    offenseId: string,
    defenseId: string,
    warContract: any,
    writeContractAsync: any
) => {
    if (!warContract || !offenseId || !defenseId) {
        console.error("Missing required data: warContract, offenseId, or defenseId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: warContract.abi,
            address: warContract.address,
            functionName: "declareWar",
            args: [offenseId, defenseId],
        });
    } catch (error) {
        console.error("Error declaring war:", error);
    }
}

export const offensiveWarsAmount = async (
    nationId: string,
    warContract: any,
    publicClient: any
) => {
    if (!warContract || !nationId) {
        console.error("Missing required data: warContract or nationId.");
        return;
    }

    try {
        return await publicClient.readContract({
            abi: warContract.abi,
            address: warContract.address,
            functionName: "offensiveWarLength",
            args: [nationId],
        });
    } catch (error) {
        console.error("Error fetching offensive wars amount:", error);
    }
}

export const checkStrength = async (
    offenseId: string,
    defenseId: string,
    warContract: any,
    publicClient: any
) => {
    if (!warContract || !offenseId || !defenseId) {
        console.error("Missing required data: warContract, offenseId, or defenseId.");
        return;
    }

    try {
        return await publicClient.readContract({
            abi: warContract.abi,
            address: warContract.address,
            functionName: "checkStrength",
            args: [offenseId, defenseId],
        });
    } catch (error) {
        console.error("Error checking strength:", error);
    }
}

export const offerPeace = async (
    offererId: string,
    warId: string,
    warContract: any,
    writeContractAsync: any
) => {
    if (!warContract || !offererId || !warId) {
        console.error("Missing required data: warContract, offerId, or warId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: warContract.abi,
            address: warContract.address,
            functionName: "offerPeace",
            args: [offererId, warId],
        });
    } catch (error) {
        console.error("Error offering peace:", error);
    }
}

export const returnWarDetails = async (warId : string, warContract: any, publicClient: any) => {
    console.log("RETURN WAR DETAILS")
    if (!warContract || !warId) {
        console.error("Missing required data: warContract or warId.");
        return;
    }
    console.log(warId, "warId")
    console.log(warContract, "warContract")
    console.log(publicClient, "publicClient")

    try {
        console.log("TRYING")
        const data = await publicClient.readContract({
            abi: warContract.abi,
            address: warContract.address,
            functionName: "returnWarDetails",
            args: [warId],
        });
        console.log(`War details for ID ${warId}:`, data);
        return data;
    } catch (error) {
        console.error(`Error fetching details for war ID ${warId}:`, error);
    }
};

export const isWarActive = async (
    warId: string,
    warContract: any,
    publicClient: any
) => {
    if (!warContract || !warId) {
        console.error("Missing required data: warContract or warId.");
        return;
    }

    try {
        return await publicClient.readContract({
            abi: warContract.abi,
            address: warContract.address,
            functionName: "isWarActive",
            args: [warId],
        });
    } catch (error) {
        console.error("Error checking if war is active:", error);
    }
}

export const isPeaceOffered = async (
    warId: string,
    warContract: any,
    publicClient: any
) => {
    if (!warContract || !warId) {
        console.error("Missing required data: warContract or warId.");
        return;
    }

    try {
        return await publicClient.readContract({
            abi: warContract.abi,
            address: warContract.address,
            functionName: "isPeaceOffered",
            args: [warId],
        });
    } catch (error) {
        console.error("Error checking if peace is offered:", error);
    }
}

export const getDaysLeft = async (
    warId: string,
    warContract: any,
    publicClient: any
) => {
    if (!warContract || !warId) {
        console.error("Missing required data: warContract or warId.");
        return;
    }

    try {
        return await publicClient.readContract({
            abi: warContract.abi,
            address: warContract.address,
            functionName: "getDaysLeft",
            args: [warId],
        });
    } catch (error) {
        console.error("Error fetching days left:", error);
    }
}

export const deployForcesToWar = async (
    nationId: string,
    warId: string,
    soldiers: number,
    tanks: number,
    warContract: any,
    writeContractAsync: any
) => {
    if (!warContract || !warId || !nationId) {
        console.error("Missing required data: warContract, warId, or nationId.");
        return;
    }

    console.log("are we here")
    try {
        await writeContractAsync({
            abi: warContract.abi,
            address: warContract.address,
            functionName: "deployForcesToWar",
            args: [nationId, warId, soldiers, tanks],
        });
    } catch (error) {
        console.error("Error deploying forces to war:", error);
    }
}

export const getDeployedGroundForces = async (
    warId: string,
    nationId: string,
    warContract: any,
    publicClient: any
) => {
    if (!warContract || !warId || !nationId) {
        console.error("Missing required data: warContract, warId, or nationId.");
        return;
    }

    try {
        return await publicClient.readContract({
            abi: warContract.abi,
            address: warContract.address,
            functionName: "getDeployedGroundForces",
            args: [warId, nationId],
        });
    } catch (error) {
        console.error("Error fetching deployed ground forces:", error);
    }
}

export const recallTroopsFromDeactivatedWars = async (
    nationId: string,
    warContract: any,
    writeContractAsync: any
) => {
    if (!warContract || !nationId) {
        console.error("Missing required data: warContract or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: warContract.abi,
            address: warContract.address,
            functionName: "recallTroopsFromDeactivatedWars",
            args: [nationId],
        });
    } catch (error) {
        console.error("Error recalling troops from deactivated wars:", error);
    }
} 

export const nationActiveWars = async (
    nationId: string,
    warContract: any,
    publicClient: any
) => {
    if (!warContract || !nationId) {
        console.error("Missing required data: warContract or nationId.");
        return;
    }

    try {
        return await publicClient.readContract({
            abi: warContract.abi,
            address: warContract.address,
            functionName: "nationActiveWarsReturn",
            args: [nationId],
        });
    } catch (error) {
        console.error("Error fetching nation active wars:", error);
    }
}


