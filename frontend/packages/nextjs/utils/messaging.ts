

export const sendMessage = async (
    nationId: string,
    receiver: string,
    message: string,
    writeContractAsync: any,
    messenger: any
) => {
    if (!nationId || !receiver || !message) {
        console.error("Missing required data: nationId, receiver, or message.");
        return;
    }

    try {
        // Send the message
        const tx = await writeContractAsync({
            abi: messenger.abi,
            address: messenger.address,
            functionName: "sendMessage",
            args: [nationId, receiver, message],
        });
        console.log(`Transaction sent: ${tx.hash}`);
        return tx;
    } catch (error) {
        console.error("Error sending message:", error);
        return false; // Failure
    }
}