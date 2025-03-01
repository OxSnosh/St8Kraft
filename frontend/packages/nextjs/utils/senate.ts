import { Sen } from "next/font/google";


export const voteForSenator = async (
    voterId: string,
    senatorId: string,
    senateContract: any,
    writeContractAsync: any
) => {

    try {
        const tx = await writeContractAsync({
            abi: senateContract.abi,
            address: senateContract.address,
            functionName: "voteForSenator",
            args: [voterId, senatorId]
        });
        return tx;
    } catch (error) {
        console.error("voteForSenator error", error);
        return null;
    }

}

export const sanctionTeamMember = async (
    senatorId: string,
    teamMemberId: string,
    senateContract: any,
    writeContractAsync: any
) => {
    try {
        console.log("🔄 Calling contract method with:", { senatorId, teamMemberId });
        console.log("📜 Contract Details:", senateContract);

        // Ensure writeContractAsync is actually being called
        if (!writeContractAsync) {
            console.error("⚠️ writeContractAsync is undefined!");
            return null;
        }

        const tx = await writeContractAsync(
            ...senateContract,
            "sanctionTeamMember",
            [senatorId, teamMemberId]
        );

        console.log("✅ Transaction Sent:", tx);
        return tx;
    } catch (error) {
        console.error("❌ sanctionTeamMember error:", error);
        return null;
    }
};

export const liftSanctionVote = async (
    senatorId: string,
    teamMemberId: string,
    senateContract: any,
    writeContractAsync: any
) => {
    
    try {
        const tx = await writeContractAsync(
            senateContract,
            "liftSanctionVote",
            [senatorId, teamMemberId]
        );
        return tx;
    } catch (error) {
        console.error("liftSanctionVote error", error);
        return null;
    }

}

export const isSenator = async (
    nationId : string,
    SenateContract: any,
    PublicClient: any
) => {
    try{
        const isSenator = await PublicClient.readContract({
            abi: SenateContract.abi,
            address: SenateContract.address,
            functionName: "isSenator",
            args: [nationId]
        })
        return isSenator;
    } catch (error) {
        console.error("isSenator error", error);
        return null
    }
}

export const isSanctioned = async (
    idSender: string,
    idReceiver: string,
    SenateContract: any,
    PublicClient: any
) => {
    try{
        const isSanctioned = await PublicClient.readContract({
            abi: SenateContract.abi,
            address: SenateContract.address,
            functionName: "isSanctioned",
            args: [idSender, idReceiver]
        })
        return isSanctioned;
    } catch (error) {
        console.error("isSanctioned error", error);
        return null
    }
}

export const getSenators = async (
    SenateContract: any,
    PublicClient: any,
    team: string,
) => {
    try{
        const senators = await PublicClient.readContract({
            abi: SenateContract.abi,
            address: SenateContract.address,
            functionName: "getSenators",
            args: [team]
        })
        return senators;
    } catch (error) {
        console.error("getSenators error", error);
        return null
    }
}

export const getSenatorVotes = async (
    SenateContract: any,
    PublicClient: any,
    team: string,
) => {
    try{
        const sanctionVotes = await PublicClient.readContract({
            abi: SenateContract.abi,
            address: SenateContract.address,
            functionName: "getSenatorVotes",
            args: [team]
        })
        return sanctionVotes;
    } catch (error) {
        console.error("getSanctionVotes error", error);
        return null
    }
}


