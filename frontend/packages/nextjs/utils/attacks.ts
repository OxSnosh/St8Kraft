
export const groundAttack = async (
    warId: string,
    nationId: string,
    defenderId: string,
    attackType: string,
    groundBattleContract: any,
    writeContractAsync: any,
) => {
    if (!warId || !nationId || !defenderId || !attackType) {
        console.error("Missing required data: warId, nationId, defenderId, or attackType.");
        return;
    }

    try {
        return await writeContractAsync({
            abi: groundBattleContract.abi,
            address: groundBattleContract.address,
            functionName: "groundAttack",
            args: [warId, nationId, defenderId, attackType],
        });
    } catch (error) {
        console.error("Error attacking:", error);
    }
}

export const blockade = async (
    nationId: string,
    defenderId: string,
    warId: string,
    blockadeContract: any,
    writeContractAsync: any,
) => {
    if (!nationId || !defenderId || !warId) {
        console.error("Missing required data: nationId, defenderId, or warId.");
        return;
    }

    try {
        return await writeContractAsync({
            abi: blockadeContract.abi,
            address: blockadeContract.address,
            functionName: "blockade",
            args: [nationId, defenderId, warId],
        });
    } catch (error) {
        console.error("Error blockading:", error);
    }
}
