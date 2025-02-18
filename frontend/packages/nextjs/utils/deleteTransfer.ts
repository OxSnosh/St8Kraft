


export const deleteNation = async (
    nationId: string,
    writeContractAsync: any,
    countryMinter: any
) => {
    try {
        
        // Send the delete transaction
        const tx = await writeContractAsync({
            abi: countryMinter.abi,
            address: countryMinter.address,
            functionName: "deleteNation",
            args: [nationId],
        })
        console.log(`Transaction sent: ${tx.hash}`);
        return tx;

    } catch (error) {

        console.error("Error deleting nation:", error);
        return false; // Failure
    }
}

export const transferNation = async (
    nationId: string,
    newOwnerAddress: string,
    writeContractAsync: any,
    countryMinter: any
) => {
    try {
        const tx = await writeContractAsync({
            abi: countryMinter.abi,
            address: countryMinter.address,
            functionName: "transferNation",
            args: [nationId, newOwnerAddress],
        });
        console.log(`Transaction sent: ${tx.hash}`);
        return tx;
    } catch (error) {
        console.error("Error transferring nation:", error);
        return false; 
    }
}