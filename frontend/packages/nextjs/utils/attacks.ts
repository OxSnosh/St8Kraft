
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
        const tx = await writeContractAsync({
            abi: groundBattleContract.abi,
            address: groundBattleContract.address,
            functionName: "groundAttack",
            args: [warId, nationId, defenderId, attackType],
        });

        return tx
    } catch (error) {
        console.error("Error attacking:", error);
    }
}

export const blockade = async (
    nationId: string,
    defenderId: string,
    warId: string,
    navalBlockadeContract: any,
    writeContractAsync: any,
) => {
    if (!nationId || !defenderId || !warId) {
        console.error("Missing required data: nationId, defenderId, or warId.");
        return;
    }

    try {
        return await writeContractAsync({
            abi: navalBlockadeContract.abi,
            address: navalBlockadeContract.address,
            functionName: "blockade",
            args: [nationId, defenderId, warId],
        });
    } catch (error) {
        console.error("Error blockading:", error);
    }
}

export const breakBlockade = async (
    warId: string,
    nationId: string,
    blockaderId: string,
    breakBlockadeContract: any,
    writeContractAsync: any,
) => {
    if (!nationId || !blockaderId || !warId) {
        console.error("Missing required data: nationId, defenderId, or warId.");
        return;
    }

    try {
        return await writeContractAsync({
            abi: breakBlockadeContract.abi,
            address: breakBlockadeContract.address,
            functionName: "breakBlockade",
            args: [warId, nationId, blockaderId],
        });
    } catch (error) {
        console.error("Error breaking blockade:", error);
    }
}

export const navalAttack = async (
    warId: string,
    nationId: string,
    defenderId: string,
    navalAttackContract: any,
    writeContractAsync: any,
) => {
    if (!warId || !nationId || !defenderId) {
        console.error("Missing required data: warId, nationId, or defenderId.");
        return;
    }

    try {
        const tx = await writeContractAsync({
            abi: navalAttackContract.abi,
            address: navalAttackContract.address,
            functionName: "navalAttack",
            args: [warId, nationId, defenderId],
        });
        return tx
    } catch (error) {
        console.error("Error launching naval attack:", error);
    }
}

export const launchAirBattle = async (
    warId: string,
    nationId: string,
    defenderId: string,
    attackingFighters: number[],
    attackingBombers: number[],
    airBattleContract: any,
    writeContractAsync: any,
) => {
    if (!warId || !nationId || !defenderId || !attackingFighters || !attackingBombers) {
        console.error("Missing required data: warId, nationId, defenderId, attackingFighters, or attackingBombers.");
        return;
    }

    try {
        const tx = await writeContractAsync({
            abi: airBattleContract.abi,
            address: airBattleContract.address,
            functionName: "airBattle",
            args: [warId, nationId, defenderId, attackingFighters, attackingBombers],
        });
        return tx
    } catch (error) {
        console.error("Error launching air battle:", error);
    }
}
