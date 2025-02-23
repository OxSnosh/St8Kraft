"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { AbiCoder } from "ethers/lib/utils";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import {
    voteForSenator,
    sanctionTeamMember,
    liftSanctionVote,
    isSenator
} from "~~/utils/senate";

const Senate = () => {
    const { theme } = useTheme();
    const allContractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();
    const searchParams = useSearchParams();
    const nationId = searchParams.get("id");

    const [team, setTeam] = useState<string>("");
    const [isUserSenator, setIsUserSenator] = useState(false);
    const [teamMemberId, setTeamMemberId] = useState("");
    const [senatorId, setSenatorId] = useState("");

    useEffect(() => {
        if (nationId) {
            fetchSenateDetails();
        }
    }, [nationId]);

    const fetchSenateDetails = async () => {
        if (!nationId || !publicClient || !allContractsData.SenateContract) return;

        try {
            const senatorStatus = await isSenator(nationId, allContractsData.SenateContract, publicClient);
            const teamData = await publicClient.readContract({
                abi: allContractsData.CountryParametersContract.abi,
                address: allContractsData.CountryParametersContract.address,
                functionName: "getTeam",
                args: [nationId],
            }) as string;

            setIsUserSenator(senatorStatus);
            setTeam(teamData);
        } catch (error) {
            console.error("Error fetching senate details:", error);
        }
    };

    function parseRevertReason(error: any): string {
        if (error?.data) {
            try {
                if (error.data.startsWith("0x08c379a0")) {
                    const decoded = new AbiCoder().decode(
                        ["string"],
                        "0x" + error.data.slice(10)
                    );
                    return decoded[0]; // Extract revert message
                }
            } catch (decodeError) {
                return "Unknown revert reason";
            }
        }
        return error?.message || "Transaction failed";
    }

    // const handleVoteForSenator = async () => {
    //     if (!nationId || !senatorId) return;

    //     try {
    //         await voteForSenator(nationId, senatorId, allContractsData.SenateContract, writeContractAsync);
    //         alert("Vote submitted!");
    //     } catch (error) {
    //         console.error("Error voting for senator:", error);
    //     }
    // };

    const handleVoteForSenator = async () => {
        if (!nationId || !senatorId) return;

        const contractData = allContractsData.SenateContract;
        const abi = contractData.abi;

        
        if (!contractData.address || !abi) {
            console.error("Contract address or ABI is missing");
            return;
        }
        
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();

            const contract = new ethers.Contract(contractData.address, abi as ethers.ContractInterface, signer);

            const data = contract.interface.encodeFunctionData("voteForSenator", [
                nationId,
                senatorId,
            ]);

            try {
                const result = await provider.call({
                    to: contract.address,
                    data: data,
                    from: userAddress,
                });
    
                console.log("Transaction Simulation Result:", result);
    
                if (result.startsWith("0x08c379a0")) {
                    const errorMessage = parseRevertReason({ data: result });
                    alert(`Transaction failed: ${errorMessage}`);
                    return;
                }

            } catch (error: any) {
                const errorMessage = parseRevertReason(error);
                console.error("Transaction simulation failed:", errorMessage);
                alert(`Transaction failed: ${errorMessage}`);
                return;            
            }
    
            const tx = await voteForSenator(nationId, senatorId, allContractsData.SenateContract, writeContractAsync);

            alert("Vote submitted!");

        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error("Transaction failed:", errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    }

    // const handleSanctionTeamMember = async () => {
    //     if (!nationId || !teamMemberId) return;

    //     try {
    //         await sanctionTeamMember(nationId, teamMemberId, allContractsData.SenateContract, writeContractAsync);
    //         alert("Sanction applied!");
    //     } catch (error) {
    //         console.error("Error sanctioning team member:", error);
    //     }
    // };

    const handleSanctionTeamMember = async () => {
        if (!nationId || !teamMemberId) return;

        const contractData = allContractsData.SenateContract;
        const abi = contractData.abi;

        
        if (!contractData.address || !abi) {
            console.error("Contract address or ABI is missing");
            return;
        }
        
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();

            const contract = new ethers.Contract(contractData.address, abi as ethers.ContractInterface, signer);

            const data = contract.interface.encodeFunctionData("sanctionTeamMember", [
                nationId,
                teamMemberId,
            ]);

            try {
                const result = await provider.call({
                    to: contract.address,
                    data: data,
                    from: userAddress,
                });
    
                console.log("Transaction Simulation Result:", result);
    
                if (result.startsWith("0x08c379a0")) {
                    const errorMessage = parseRevertReason({ data: result });
                    alert(`Transaction failed: ${errorMessage}`);
                    return;
                }

            } catch (error: any) {
                const errorMessage = parseRevertReason(error);
                console.error("Transaction simulation failed:", errorMessage);
                alert(`Transaction failed: ${errorMessage}`);
                return;            
            }
    
            const tx = await sanctionTeamMember(nationId, teamMemberId, allContractsData.SenateContract, writeContractAsync);
            alert("Sanction applied!");

        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error("Transaction failed:", errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    }

    // const handleLiftSanctionVote = async () => {
    //     if (!nationId || !teamMemberId) return;

    //     try {
    //         await liftSanctionVote(nationId, teamMemberId, allContractsData.SenateContract, writeContractAsync);
    //         alert("Sanction lifted!");
    //     } catch (error) {
    //         console.error("Error lifting sanction vote:", error);
    //     }
    // };

    const handleLiftSanctionVote = async () => {
        if (!nationId || !teamMemberId) return;

        const contractData = allContractsData.SenateContract;
        const abi = contractData.abi;

        
        if (!contractData.address || !abi) {
            console.error("Contract address or ABI is missing");
            return;
        }
        
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();

            const contract = new ethers.Contract(contractData.address, abi as ethers.ContractInterface, signer);

            const data = contract.interface.encodeFunctionData("liftSanctionVote", [
                nationId,
                teamMemberId,
            ]);

            try {
                const result = await provider.call({
                    to: contract.address,
                    data: data,
                    from: userAddress,
                });
    
                console.log("Transaction Simulation Result:", result);
    
                if (result.startsWith("0x08c379a0")) {
                    const errorMessage = parseRevertReason({ data: result });
                    alert(`Transaction failed: ${errorMessage}`);
                    return;
                }

            } catch (error: any) {
                const errorMessage = parseRevertReason(error);
                console.error("Transaction simulation failed:", errorMessage);
                alert(`Transaction failed: ${errorMessage}`);
                return;            
            }
    
            const tx = await liftSanctionVote(nationId, teamMemberId, allContractsData.SenateContract, writeContractAsync);
            alert("Sanction lifted!");

        } catch (error: any) {
            const errorMessage = parseRevertReason(error);
            console.error("Transaction failed:", errorMessage);
            alert(`Transaction failed: ${errorMessage}`);
        }
    }

    return (
        <div className="p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">Senate Management</h2>
    
            {/* Team Section */}
            {team && (
                <div className="p-4 bg-base-200 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-primary">Team:</h3>
                    <p className="text-base">{team}</p>
                    {isUserSenator && (
                        <p className="text-success-content font-semibold mt-2">
                            You are a senator of team {team}
                        </p>
                    )}
                </div>
            )}
    
            {/* Vote for Senator */}
            <div className="p-4 bg-base-200 rounded-lg shadow-md mt-4">
                <label className="block text-sm font-medium text-primary">Senator ID to Vote:</label>
                <input 
                    type="text" 
                    value={senatorId}
                    onChange={(e) => setSenatorId(e.target.value)}
                    className="input input-bordered w-full bg-base-100 text-base-content mt-1"
                    placeholder="Enter Senator ID"
                />
                <button 
                    onClick={handleVoteForSenator} 
                    className="btn btn-primary w-full mt-3"
                >
                    Vote for Senator
                </button>
            </div>
    
            {/* Actions for Senators */}
            {isUserSenator && (
                <div className="mt-4 p-4 bg-base-200 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-primary">Sanctions Management</h3>
    
                    <label className="block text-sm font-medium text-primary mt-2">Team Member ID:</label>
                    <input 
                        type="text" 
                        value={teamMemberId} 
                        onChange={(e) => setTeamMemberId(e.target.value)} 
                        className="input input-bordered w-full bg-base-100 text-base-content mt-1"
                        placeholder="Enter Team Member ID"
                    />
    
                    <div className="mt-3 flex gap-2">
                        <button 
                            onClick={handleSanctionTeamMember} 
                            className="btn btn-error flex-1"
                        >
                            Sanction Member
                        </button>
    
                        <button 
                            onClick={handleLiftSanctionVote} 
                            className="btn btn-success flex-1"
                        >
                            Lift Sanction
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Senate;
