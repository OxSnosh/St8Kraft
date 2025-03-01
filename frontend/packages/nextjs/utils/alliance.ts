export const createAlliance = async (
    nationId: string,
    allianceName: string,
    publicClient: any,
    allianceContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !allianceContract || !nationId || !allianceName) {
        console.error("Public Client", publicClient);
        console.error("Alliance Contract", allianceContract);
        console.error("Nation ID", nationId);
        console.error("Alliance Name", allianceName);
        console.error("Missing required data: publicClient, allianceContract, nationId, or allianceName.");
        return;
    }

    try {
        await writeContractAsync({
            abi: allianceContract.abi,
            address: allianceContract.address,
            functionName: "createAlliance",
            args: [allianceName, nationId],
        });
    } catch (error) {
        console.error("Error creating alliance:", error);
    }
};

export const requestToJoinAlliance = async (
    nationId: string,
    allianceId: string,
    publicClient: any,
    allianceContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !allianceContract || !nationId || !allianceId) {
        console.error("Missing required data: publicClient, allianceContract, nationId, or allianceId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: allianceContract.abi,
            address: allianceContract.address,
            functionName: "requestToJoinAlliance",
            args: [allianceId, nationId],
        });
    } catch (error) {
        console.error("Error requesting to join alliance:", error);
    }
};

export const approveNationJoin = async (
    allianceId: string,
    nationId: string,
    callerNationId: string,
    publicClient: any,
    allianceContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !allianceContract || !nationId || !callerNationId || !allianceId) {
        console.error("Missing required data: publicClient, allianceContract, nationId, callerNationId, or allianceId.");
        return;
    }

    console.log("Approving nation to join alliance", allianceId, nationId, callerNationId);

    try {
        await writeContractAsync({
            abi: allianceContract.abi,
            address: allianceContract.address,
            functionName: "approveNationJoin",
            args: [allianceId, nationId, callerNationId],
        });

        console.log("Nation approved to join alliance", allianceId, nationId, callerNationId);
    } catch (error) {
        console.error("Error approving nation to join alliance:", error);
    }
};

export const removeNationFromAlliance = async (
    allianceId: string,
    nationId: string,
    callerNationId: string,
    publicClient: any,
    allianceContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !allianceContract || !nationId || !callerNationId || !allianceId) {
        console.error("Missing required data: publicClient, allianceContract, nationId, callerNationId, or allianceId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: allianceContract.abi,
            address: allianceContract.address,
            functionName: "removeNationFromAlliance",
            args: [allianceId, nationId, callerNationId],
        });
    } catch (error) {
        console.error("Error removing nation from alliance:", error);
    }
};

export const assignNationToPlatoon = async (
    allianceId: string,
    nationId: string,
    platoonId: string,
    callerNationId: string,
    publicClient: any,
    allianceContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !allianceContract || !nationId || !callerNationId || !allianceId || !platoonId) {
        console.error("Missing required data: publicClient, allianceContract, nationId, callerNationId, allianceId, or platoonId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: allianceContract.abi,
            address: allianceContract.address,
            functionName: "assignNationToPlatoon",
            args: [allianceId, nationId, platoonId, callerNationId],
        });
    } catch (error) {
        console.error("Error assigning nation to platoon:", error);
    }
};

export const addAdmin = async (
    allianceId: string,
    adminNationId: string,
    callerNationId: string,
    publicClient: any,
    allianceContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !allianceContract || !adminNationId || !callerNationId || !allianceId) {
        console.error("Missing required data: publicClient, allianceContract, adminNationId, callerNationId, or allianceId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: allianceContract.abi,
            address: allianceContract.address,
            functionName: "addAdmin",
            args: [allianceId, adminNationId, callerNationId],
        });
    } catch (error) {
        console.error("Error adding admin to alliance:", error);
    }
};

export const removeAdmin = async (
    allianceId: string,
    adminNationId: string,
    callerNationId: string,
    publicClient: any,
    allianceContract: any,
    writeContractAsync: any
) => {
    if (!publicClient || !allianceContract || !adminNationId || !callerNationId || !allianceId) {
        console.error("Missing required data: publicClient, allianceContract, adminNationId, callerNationId, or allianceId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: allianceContract.abi,
            address: allianceContract.address,
            functionName: "removeAdmin",
            args: [allianceId, adminNationId, callerNationId],
        });
    } catch (error) {
        console.error("Error removing admin from alliance:", error);
    }
};

export const getNationAlliance = async (
    nationId: string,
    publicClient: any,
    allianceContract: any
) => {
    if (!publicClient || !allianceContract || !nationId) {
        console.error("Missing required data: publicClient, allianceContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: allianceContract.abi,
        address: allianceContract.address,
        functionName: "getNationAlliance",
        args: [nationId],
    });
};

export const getNationAllianceAndPlatoon = async (
    nationId: string,
    publicClient: any,
    allianceContract: any
) => {
    if (!publicClient || !allianceContract || !nationId) {
        console.error("Missing required data: publicClient, allianceContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: allianceContract.abi,
        address: allianceContract.address,
        functionName: "getNationAllianceAndPlatoon",
        args: [nationId],
    });
};

export const getAllianceMembers = async (
    allianceId: string,
    publicClient: any,
    allianceContract: any
) => {
    if (!publicClient || !allianceContract || !allianceId) {
        console.error("Missing required data: publicClient, allianceContract, or allianceId.");
        return;
    }

    return await publicClient.readContract({
        abi: allianceContract.abi,
        address: allianceContract.address,
        functionName: "getAllianceMembers",
        args: [allianceId],
    });
};

export const getJoinRequests = async (
    allianceId: string,
    publicClient: any,
    allianceContract: any
) => {
    if (!publicClient || !allianceContract || !allianceId) {
        console.error("Missing required data: publicClient, allianceContract, or allianceId.");
        return;
    }

    console.log("Getting join requests for alliance", allianceId);

    return await publicClient.readContract({
        abi: allianceContract.abi,
        address: allianceContract.address,
        functionName: "getJoinRequests",
        args: [allianceId],
    });
};

export const isAdmin = async (
    allianceId: string,
    nationId: string,
    publicClient: any,
    allianceContract: any
) => {
    if (!publicClient || !allianceContract || !allianceId || !nationId) {
        console.error("Missing required data: publicClient, allianceContract, allianceId, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: allianceContract.abi,
        address: allianceContract.address,
        functionName: "isNationAllianceAdmin",
        args: [allianceId, nationId],
    });
}
