import { useEffect, useState } from "react";
import { execute } from "~~/.graphclient";
import { useAccount, useWriteContract } from "wagmi";
import { GetReceivedMessagesDocument, GetSentMessagesDocument } from "~~/.graphclient";
import { Loader2 } from "lucide-react";
import { sendMessage } from "../../../utils/messaging";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useSearchParams } from "next/navigation";

const MessagesComponent = () => {
    const { address } = useAccount();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id") || "";
    
    interface Message {
        id: string;
        sender: string;
        receiver: string;
        message: string;
        transactionHash: string;
    }

    const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
    const [sentMessages, setSentMessages] = useState<Message[]>([]);
    const [toNationId, setToNationId] = useState("");
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const contractsData = useAllContracts();
    const { writeContractAsync } = useWriteContract();
    const messenger = contractsData?.Messenger;

    useEffect(() => {
        if (!address) return;
        fetchMessages();
    }, [address]);

    const fetchMessages = async () => {
        try {
            const { data: receivedData } = await execute(GetReceivedMessagesDocument, { receiver: address });
            const { data: sentData } = await execute(GetSentMessagesDocument, { sender: address });
            setReceivedMessages(receivedData?.messages || []);
            setSentMessages(sentData?.messages || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSendMessage = async () => {
        if (!toNationId || !messageText) {
            setStatusMessage("⚠️ Enter recipient Nation ID and message.");
            return;
        }
        setLoading(true);
        setStatusMessage("⏳ Sending message...");

        const tx = await sendMessage(nationId, toNationId, messageText, writeContractAsync, messenger);

        if (tx) {
            setStatusMessage(`✅ Message sent to Nation ${toNationId}! Tx: ${tx.hash}`);
            fetchMessages(); // Refresh messages
        } else {
            setStatusMessage("❌ Failed to send message.");
        }
        setLoading(false);
    };

    return (
        <div className="bg-aged-paper text-base-content p-6 rounded-lg shadow-center w-full max-w-md mx-auto border border-neutral">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">Nation Messages</h2>
            
            {/* SEND MESSAGE SECTION */}
            <div className="p-4 bg-base-200 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold text-primary mb-2 text-center">Send Message</h3>
                <input 
                    type="text" 
                    value={toNationId} 
                    onChange={(e) => setToNationId(e.target.value)} 
                    className="input input-bordered w-full mt-1 bg-base-100 text-base-content" 
                    placeholder="Enter recipient Nation ID" 
                />
                <textarea 
                    value={messageText} 
                    onChange={(e) => setMessageText(e.target.value)} 
                    className="textarea textarea-bordered w-full mt-2 bg-base-100 text-base-content" 
                    placeholder="Enter your message"
                />
                <button 
                    onClick={handleSendMessage} 
                    disabled={loading} 
                    className="btn btn-primary w-full flex justify-center items-center mt-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : "Send Message"}
                </button>
            </div>

            {/* RECEIVED MESSAGES SECTION */}
            <div className="p-4 bg-base-200 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold text-secondary mb-2 text-center">Received Messages</h3>
                {receivedMessages.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {receivedMessages.map((msg) => (
                            <li key={msg.id} className="text-base-content">
                                <strong>From:</strong> {msg.sender} <br />
                                <strong>Message:</strong> {msg.message} <br />
                                <strong>Tx:</strong> {msg.transactionHash}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-center">No received messages.</p>
                )}
            </div>

            {/* SENT MESSAGES SECTION */}
            <div className="p-4 bg-base-200 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-secondary mb-2 text-center">Sent Messages</h3>
                {sentMessages.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {sentMessages.map((msg) => (
                            <li key={msg.id} className="text-base-content">
                                <strong>To:</strong> {msg.receiver} <br />
                                <strong>Message:</strong> {msg.message} <br />
                                <strong>Tx:</strong> {msg.transactionHash}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-center">No sent messages.</p>
                )}
            </div>
            
            {/* STATUS MESSAGE */}
            {statusMessage && (
                <p className="mt-4 text-center text-sm text-secondary-content bg-secondary p-2 rounded-lg">
                    {statusMessage}
                </p>
            )}
        </div>
    );
};

export default MessagesComponent;
