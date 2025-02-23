
export const checkBalance = async (
    nationId: string,
    publicClient: any,
    treasuryContract: any
) => {
    if (!publicClient || !treasuryContract || !nationId) {
        console.error("Missing required data: publicClient, treasuryContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: treasuryContract.abi,
        address: treasuryContract.address,
        functionName: "checkBalance",
        args: [nationId],
    });
}

export const getDaysSinceLastBillsPaid = async (
    nationId: string,
    publicClient: any,
    treasuryContract: any
) => {
    if (!publicClient || !treasuryContract || !nationId) {
        console.error("Missing required data: publicClient, treasuryContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: treasuryContract.abi,
        address: treasuryContract.address,
        functionName: "getDaysSinceLastBillsPaid",
        args: [nationId],
    });
}

import { BigNumber } from "ethers";

export const addFunds = async (
    nationId: string,
    publicClient: any,
    treasuryContract: any,
    amount: BigNumber,  // Change `number` to `BigNumber`
    writeContractAsync: any
) => {
    console.log("addFunds", nationId, amount);
    console.log("publicClient", publicClient);
    console.log("treasuryContract", treasuryContract);
    console.log("writeContractAsync", writeContractAsync);
    if (!publicClient || !treasuryContract || !nationId) {
        console.error("Missing required data: publicClient, treasuryContract, or nationId.");
        return;
    }

    return await writeContractAsync({
        abi: treasuryContract.abi,
        address: treasuryContract.address,
        functionName: "addFunds",
        args: [amount, nationId],
    });
}

export const withdrawFunds = async (
    nationId: string,
    publicClient: any,
    treasuryContract: any,
    amount: BigNumber, // Change `number` to `BigNumber`
    writeContractAsync: any
) => {
    console.log("addFunds", nationId, amount);
    console.log("publicClient", publicClient);
    console.log("treasuryContract", treasuryContract);
    console.log("writeContractAsync", writeContractAsync);
    if (!publicClient || !treasuryContract || !nationId) {
        console.error("Missing required data: publicClient, treasuryContract, or nationId.");
        return;
    }

    return await writeContractAsync({
        abi: treasuryContract.abi,
        address: treasuryContract.address,
        functionName: "withdrawFunds",
        args: [amount, nationId], // Ensure amount is passed as BigNumber
    });
}
