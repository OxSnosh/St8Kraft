
export const proposeAid = async (
    idSender: string,
    idReceiver: string,
    techAid: any,
    balanceAid: any,
    soldierAid: any,
    aidContract: any,
    writeContractAsync: any
) => {
    if (!aidContract || !writeContractAsync) {
        console.error("Missing required data: aidContract, writeContractAsync");
        return;
    }

    try {
        const tx = await writeContractAsync({
            abi: aidContract.abi,
            address: aidContract.address,
            functionName: "proposeAid",
            args: [idSender, idReceiver, techAid, balanceAid, soldierAid],
        });
        return tx
    } catch (error) {
        console.error("Error proposing aid:", error);
    }
}

export const aidAvailable = (
    idNation: string,
    aidContract: any,
    publicClient: any
) => {
    if (!aidContract || !publicClient) {
        console.error("Missing required data: aidContract, publicClient");
        return;
    }

    try {
         const available = publicClient.readContract({
            abi: aidContract.abi,
            address: aidContract.address,
            functionName: "checkAidSlots",
            args: [idNation],
        });

        return available;

    } catch (error) {
        console.error("Error checking if aid is available:", error);
    }
}

export const proposalExpired = (
    idProposal: string,
    aidContract: any,
    publicClient: any
) => {
    if (!aidContract || !publicClient) {
        console.error("Missing required data: aidContract, publicClient");
        return;
    }

    try {
        const expired = publicClient.readContract({
            abi: aidContract.abi,
            address: aidContract.address,
            functionName: "proposalExpired",
            args: [idProposal],
        });

        return expired;

    } catch (error) {
        console.error("Error checking if proposal is expired:", error);
    }
}

export const acceptProposal = (
    proposalId: string,
    aidContract: any, 
    writeContractAsync: any
) => {
    if (!aidContract || !writeContractAsync) {
        console.error("Missing required data: aidContract, writeContractAsync");
        return;
    }

    if (!proposalId) {
        console.error("Invalid proposalId:", proposalId);
        return;
    }

    try {
        console.log("Accepting proposal with ID:", proposalId);  // Debugging line
        writeContractAsync({
            abi: aidContract.abi,
            address: aidContract.address,
            functionName: "acceptProposal",
            args: [proposalId], // Ensure conversion to BigInt
        });
    } catch (error) {
        console.error("Error accepting proposal:", error);
    }
};

export const cancelAid = (
    proposalId: string,
    aidContract: any,
    writeContractAsync: any
) => {
    if (!aidContract || !writeContractAsync) {
        console.error("Missing required data: aidContract, writeContractAsync");
        return;
    }

    try {
        writeContractAsync({
            abi: aidContract.abi,
            address: aidContract.address,
            functionName: "cancelAid",
            args: [proposalId],
        });

    } catch (error) {
        console.error("Error canceling aid:", error);
    }
}

export const getProposalsSent = (
    idSender: string,
    aidContract: any,
    publicClient: any
) => {
    if (!aidContract || !publicClient) {
        console.error("Missing required data: aidContract, publicClient");
        return;
    }

    try {
        const proposals = publicClient.readContract({
            abi: aidContract.abi,
            address: aidContract.address,
            functionName: "getProposalsSent",
            args: [idSender],
        });

        return proposals;

    } catch (error) {
        console.error("Error fetching proposals sent:", error);
    }
}

export const getProposalsReceived = (
    idReceiver: string,
    aidContract: any,
    publicClient: any
) => {
    if (!aidContract || !publicClient) {
        console.error("Missing required data: aidContract, publicClient");
        return;
    }

    try {
        const proposals = publicClient.readContract({
            abi: aidContract.abi,
            address: aidContract.address,
            functionName: "getProposalsReceived",
            args: [idReceiver],
        });

        return proposals;

    } catch (error) {
        console.error("Error fetching proposals received:", error);
    }
}

export const checkAidSlots = (
    idNation: string,
    aidContract: any,
    publicClient: any
) => {
    if (!aidContract || !publicClient) {
        console.error("Missing required data: aidContract, publicClient");
        return;
    }

    try {
        const slots = publicClient.readContract({
            abi: aidContract.abi,
            address: aidContract.address,
            functionName: "checkAidSlots",
            args: [idNation],
        });

        return slots;

    } catch (error) {
        console.error("Error checking aid slots:", error);
    }
}

