"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GetPostsDocument, execute } from "~~/.graphclient";
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";

interface Post {
  id: string;
  post: string;
}

const PostsTable = () => {
  const [postData, setPostData] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { address: walletAddress } = useAccount();
  const searchParams = useSearchParams();
  const nationId = searchParams.get("id");
  const [isOwner, setIsOwner] = useState(false);
  const [newPost, setNewPost] = useState("");

  const contractsData = useAllContracts();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const countryMinter = contractsData?.CountryMinter;
  const messenger = contractsData?.Messenger;

  useEffect(() => {
    const fetchAllPosts = async () => {
      console.log(execute, "EXECUTE")
      console.log(GetPostsDocument, "GETPOSTSDOCUMENT")
      if (!execute || !GetPostsDocument) {
        console.warn("Missing dependencies: execute or GetPostsDocument");
        return;
      }
  
      try {
        console.log("Fetching all posts...");

        console.log(nationId, "NATIONID")
  
        const { data: result, errors } = await execute(GetPostsDocument, {sender : nationId});
  
        console.log("Raw API Response:", result);
        console.log("GraphQL Errors (if any):", errors);
  
        if (errors) {
          console.error("GraphQL Error:", errors);
        }
  
        if (result?.posts?.length > 0) {
          setPostData(result.posts);
        } else {
          console.warn("No posts found.");
          setPostData([]);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(String(err));
      }
    };
  

      fetchAllPosts();
    
  }, [execute, nationId]);

  /** ✅ Check if the connected wallet owns the nation */
  useEffect(() => {
    const checkOwnership = async () => {
      if (!walletAddress || !nationId || !countryMinter || !publicClient) return;

      try {
        const isOwnerResponse = await publicClient.readContract({
          address: countryMinter.address,
          abi: countryMinter.abi,
          functionName: "checkOwnership",
          args: [nationId, walletAddress],
        });

        setIsOwner(Boolean(isOwnerResponse));
      } catch (err) {
        console.error("Error checking ownership:", err);
        setIsOwner(false);
      }
    };

    checkOwnership();
  }, [walletAddress, nationId, countryMinter, publicClient]);


  /** ✅ Handle post submission (FIXED) */
  const handlePostSubmit = async () => {
    if (!newPost.trim() || !nationId || !messenger) return;

    try {
      await writeContractAsync({
        abi: messenger.abi,
        address: messenger.address,
        functionName: "post",
        args: [nationId, newPost],
      });

      alert("Post submitted successfully!");
      setNewPost("");

    } catch (error) {
      console.error("Error submitting post:", error);
      setError("Failed to submit post.");
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="overflow-x-auto shadow-2xl rounded-xl w-full max-w-2xl">
        <table className="table bg-base-100 table-zebra w-full">
          <thead>
            <tr className="rounded-xl">
              <th className="bg-primary">All Posts</th>
            </tr>
          </thead>
          <tbody>
            {postData.length > 0 ? (
              postData.map((post) => (
                <tr key={post.id}>
                  <td>{post.post}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center text-gray-500">No posts found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostsTable;
