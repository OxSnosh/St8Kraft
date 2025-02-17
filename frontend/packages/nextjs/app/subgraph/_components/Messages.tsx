"use client";

import { useEffect, useState } from "react";
import { GetRecievedMessagesDocument, GetSentMessagesDocument, execute } from "~~/.graphclient";
import { useAccount } from "wagmi";

export const RecievedMessagesTable = () => {
  const { address: walletAddress } = useAccount(); // Get the connected wallet address
  const [messages, setRecievedMessagesData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress || !execute || !GetRecievedMessagesDocument) {
        return;
      }
      try {
        const { data: result } = await execute(GetRecievedMessagesDocument, {
          reciever: walletAddress, // Pass the wallet address to the query
        });

        console.log("Messages Recieved", result);
        setRecievedMessagesData(result);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, [walletAddress]); // Re-fetch messages when wallet address changes

  if (error) {
    return <p className="text-red-500">Error fetching messages</p>;
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="table bg-base-100 table-zebra">
          <thead>
            <tr className="rounded-xl">
            <th className="bg-primary">INBOX for {walletAddress ? `${walletAddress.slice(0, 3)}...${walletAddress.slice(-5)}` : "N/A"}
            </th>
            </tr>
          </thead>
          <tbody>
            {messages?.messages?.slice(0, 5).map((message: any) => (
              <tr key={message.id}>
                <td>{message.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SentMessagesTable = () => {
  const { address: walletAddress } = useAccount(); 
  const [messages, setSentMessagesData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress || !execute || !GetSentMessagesDocument) {
        return;
      }
      try {
        const { data: result } = await execute(GetSentMessagesDocument, {
          sender: walletAddress,
        });

        console.log("Messages Sent", result?.messages);
        setSentMessagesData(result);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, [walletAddress]);

  if (error) {
    return <p className="text-red-500">Error fetching messages</p>;
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="table bg-base-100 table-zebra">
          <thead>
            <tr className="rounded-xl">
            <th className="bg-primary">Last 5 Sent Messages from {walletAddress ? `${walletAddress.slice(0, 3)}...${walletAddress.slice(-5)}` : "N/A"}
            </th>
            </tr>
          </thead>
          <tbody>
            {messages?.messages?.slice(0, 5).map((message: any) => (
              <tr key={message.id}>
                <td>{message.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
