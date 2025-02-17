"use client";

import { useEffect, useState } from "react";
import { GetPostsDocument, execute } from "~~/.graphclient";
import { useAccount } from "wagmi";

const PostsTable = () => {
    const [postData, setPostData] = useState<any>([]);
    const [error, setError] = useState<any>(null);
    const { address: walletAddress } = useAccount();
  
    useEffect(() => {
      const fetchData = async () => {
        console.log("Fetching posts for sender:", walletAddress);
  
        if (!walletAddress || !execute || !GetPostsDocument) {
          console.warn("Missing dependencies: walletAddress, execute, or GetPostsDocument");
          return;
        }
  
        try {
          const { data: result } = await execute(GetPostsDocument, {
            sender: walletAddress, // Ensure this matches your schema
          });
  
          console.log("Full GraphQL Response:", result);
  
          if (!result || !result.posts) {
            console.error("No posts found.");
            return;
          }
  
          setPostData(result.posts);
        } catch (err) {
          console.error("Error fetching posts:", err);
          setError(err);
        }
      };
  
      if (walletAddress) fetchData();
    }, [walletAddress]);
  
    if (error) {
      return <p className="text-red-500">Error fetching posts</p>;
    }
  
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="overflow-x-auto shadow-2xl rounded-xl">
          <table className="table bg-base-100 table-zebra">
            <thead>
              <tr className="rounded-xl">
                <th className="bg-primary">Last 5 Posts from {walletAddress ? `${walletAddress.slice(0, 3)}...${walletAddress.slice(-5)}` : "N/A"}
                </th>
              </tr>
            </thead>
            <tbody>
              {postData.length > 0 ? (
                postData.slice(0, 5).map((post: any) => (
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