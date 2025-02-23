"use client";

import React, { useEffect, useState } from "react";
import { usePublicClient, useAccount, useWriteContract } from 'wagmi';
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { getNationAlliance, getNationAllianceAndPlatoon, getAllianceMembers, getJoinRequests } from "~~/utils/alliance";
import { createAlliance, requestToJoinAlliance, approveNationJoin, assignNationToPlatoon, addAdmin, removeAdmin, removeNationFromAlliance } from "~~/utils/alliance";

const AllianceManagement = () => {
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const { writeContractAsync } = useWriteContract();

    const CountryParametersContract = contractsData?.CountryParametersContract;
    const CountryMinter = contractsData?.CountryMinter;

    const [loading, setLoading] = useState(true);
    const [nations, setNations] = useState<{ id: string; name: string }[]>([]);
    const [selectedNation, setSelectedNation] = useState<string | null>(null);
    const [allianceToJoin, setAllianceToJoin] = useState<string | null>(null);
    const [nationAlliance, setNationAlliance] = useState<string | null>(null);
    const [nationPlatoon, setNationPlatoon] = useState<string | null>(null);
    const [nationAllianceName, setNationAllianceName] = useState<string | null>(null);
    const [allianceMembers, setAllianceMembers] = useState<any[]>([]);
    const [joinRequests, setJoinRequests] = useState<any[]>([]);
    const [allianceName, setAllianceName] = useState<string>("");
    const [platoonId, setPlatoonId] = useState<string>("");
    const [adminNationId, setAdminNationId] = useState<string>("");
    const [selectedJoinRequest, setSelectedJoinRequest] = useState<string>("");

    useEffect(() => {
        fetchNations();
    }, [publicClient, CountryParametersContract, CountryMinter, walletAddress]);

    useEffect(() => {
        if (selectedNation) {
            fetchNationAlliance();
        }
    }, [selectedNation]);

    const fetchNations = async () => {
        setLoading(true);
        if (!publicClient || !CountryMinter) {
            console.error("Missing required data: publicClient or CountryMinter.");
            setLoading(false);
            return;
        }
        try {
            const ownedNations = await publicClient.readContract({
                abi: CountryMinter.abi,
                address: CountryMinter.address,
                functionName: "tokensOfOwner",
                args: [walletAddress],
              });

            const formattedNations = (ownedNations as string[]).map((id: string) => ({ id, name: `Nation ${id}` }));
            setNations(formattedNations);
            if (allianceToJoin) {
                fetchJoinRequests(allianceToJoin);
            }
        } catch (err) {
            console.error("Error fetching nations:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchNationAlliance = async () => {
        if (!selectedNation || !CountryParametersContract) return;
        try {
            const [alliance, platoon, allianceName] = await getNationAllianceAndPlatoon(selectedNation, publicClient, CountryParametersContract);
            setNationAlliance(alliance);
            setNationPlatoon(platoon);
            setNationAllianceName(allianceName)
            if (alliance !== "0") {
                fetchAllianceMembers(alliance);
                fetchJoinRequests(alliance);
            }
        } catch (error) {
            console.error("Error fetching alliance data:", error);
        }
    };

    const fetchAllianceMembers = async (allianceId: string) => {
        try {
            const members = await getAllianceMembers(allianceId, publicClient, CountryParametersContract);
            setAllianceMembers(members);
        } catch (error) {
            console.error("Error fetching alliance members:", error);
        }
    };

    const fetchJoinRequests = async (allianceId: string) => {
        try {
            const requests = await getJoinRequests(allianceId, publicClient, CountryParametersContract);
            console.log("requests", requests);
            setJoinRequests(requests);
        } catch (error) {
            console.error("Error fetching join requests:", error);
        }
    };
    
    // Log the updated state whenever joinRequests changes
    useEffect(() => {
        console.log("Updated joinRequests:", joinRequests);
    }, [joinRequests]);

    const handleCreateAlliance = async () => {
        if (!selectedNation || !allianceName) {
            console.error("Missing required data: selectedNation or allianceName.");
            return;
        }
        await createAlliance(selectedNation, allianceName, publicClient, CountryParametersContract, writeContractAsync);
        fetchNationAlliance();
    };
    

    const handleRequestToJoin = async () => {
        if (!selectedNation || !allianceToJoin) return;
    
        try {
            // Send the transaction to join the alliance
            await requestToJoinAlliance(selectedNation, allianceToJoin, publicClient, CountryParametersContract, writeContractAsync);
    
            console.log("Transaction sent");
    
            // After the transaction is mined, fetch the updated join requests
            await fetchJoinRequests(allianceToJoin);
        } catch (error) {
            console.error("Error requesting to join alliance:", error);
        }
    };
    

    const handleApproveJoin = async () => {
        if (!nationAlliance || !selectedJoinRequest || !selectedNation) return;
        try {
            await approveNationJoin(nationAlliance, selectedJoinRequest, selectedNation, publicClient, CountryParametersContract, writeContractAsync);
            alert("Request approved!");
            fetchNationAlliance();
        } catch (error) {
            console.error("Error approving join request:", error);
        }
    };

    const handleAssignPlatoon = async () => {
        if (!nationAlliance || !selectedNation || !platoonId) return;
        await assignNationToPlatoon(nationAlliance, selectedNation, platoonId, selectedNation, publicClient, CountryParametersContract, writeContractAsync);
        fetchNationAlliance();
    };

    const handleAddAdmin = async () => {
        if (!nationAlliance || !selectedNation || !adminNationId) return;
        await addAdmin(nationAlliance, adminNationId, selectedNation, publicClient, CountryParametersContract, writeContractAsync);
    };

    const handleRemoveAdmin = async () => {
        if (!nationAlliance || !selectedNation || !adminNationId) return;
        await removeAdmin(nationAlliance, adminNationId, selectedNation, publicClient, CountryParametersContract, writeContractAsync);
    };

    const handleRemoveNation = async (nationId: string) => {
        if (!nationAlliance || !selectedNation) return;
        await removeNationFromAlliance(nationAlliance, nationId, selectedNation, publicClient, CountryParametersContract, writeContractAsync);
        fetchNationAlliance();
    };

    return (
        <div className="w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">Alliance Management</h2>
    
            {/* Select Nation */}
            <div className="p-4 bg-base-200 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-primary">Select Your Nation</h3>
                <select 
                    onChange={(e) => setSelectedNation(e.target.value)} 
                    value={selectedNation || ""}
                    className="select select-bordered w-full bg-base-100 text-base-content mt-2"
                >
                    <option value="">Select a Nation</option>
                    {nations.map((nation) => (
                        <option key={nation.id} value={nation.id}>{nation.name}</option>
                    ))}
                </select>
            </div>
    
            {selectedNation && (
                <>
                    {/* Create an Alliance */}
                    <div className="p-4 bg-base-200 rounded-lg shadow-md mt-4">
                        <h3 className="text-lg font-semibold text-primary">Create an Alliance</h3>
                        <input 
                            type="text" 
                            placeholder="Alliance Name" 
                            value={allianceName} 
                            onChange={(e) => setAllianceName(e.target.value)} 
                            className="input input-bordered w-full bg-base-100 text-base-content mt-2"
                        />
                        <button 
                            onClick={handleCreateAlliance} 
                            className="btn btn-primary w-full mt-3"
                        >
                            Create Alliance
                        </button>
                    </div>
    
                    {/* Join an Alliance */}
                    <div className="p-4 bg-base-200 rounded-lg shadow-md mt-4">
                        <h3 className="text-lg font-semibold text-primary">Join an Alliance</h3>
                        <input 
                            type="text" 
                            placeholder="Enter Alliance ID" 
                            onChange={(e) => setAllianceToJoin(e.target.value)} 
                            className="input input-bordered w-full bg-base-100 text-base-content mt-2"
                        />
                        <button 
                            onClick={handleRequestToJoin} 
                            className="btn btn-accent w-full mt-3"
                        >
                            Request to Join
                        </button>
                    </div>
    
                    {nationAlliance && nationAlliance !== "0" && (
                        <>
                            {/* Alliance Info */}
                            <div className="p-4 bg-base-200 rounded-lg shadow-md mt-4">
                                <h3 className="text-lg font-semibold text-primary">Your Alliance</h3>
                                <p className="text-base text-secondary-content">
                                    {nationAlliance.toString()}: {allianceName}
                                </p>
                                <h4 className="text-sm font-medium mt-2">Platoon: {nationPlatoon || "Not Assigned"}</h4>
                            </div>
    
                            {/* Assign Platoon */}
                            <div className="p-4 bg-base-200 rounded-lg shadow-md mt-4">
                                <h3 className="text-lg font-semibold text-primary">Assign a Nation to a Platoon</h3>
                                <input 
                                    type="text" 
                                    placeholder="Platoon ID" 
                                    value={platoonId.toString()} 
                                    onChange={(e) => setPlatoonId(e.target.value)} 
                                    className="input input-bordered w-full bg-base-100 text-base-content mt-2"
                                />
                                <button 
                                    onClick={handleAssignPlatoon} 
                                    className="btn btn-primary w-full mt-3"
                                >
                                    Assign Platoon
                                </button>
                            </div>
    
                            {/* Alliance Members */}
                            <div className="p-4 bg-base-200 rounded-lg shadow-md mt-4">
                                <h3 className="text-lg font-semibold text-primary">Alliance Members</h3>
                                {Array.isArray(allianceMembers) && allianceMembers.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {allianceMembers.map((member) => (
                                            <li key={member} className="flex justify-between items-center mt-2">
                                                <span>{member}</span>
                                                <button 
                                                    onClick={() => handleRemoveNation(member)} 
                                                    className="btn btn-error btn-sm"
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-secondary-content mt-2">No members found.</p>
                                )}
                            </div>
    
                            {/* Join Requests */}
                            <div className="p-4 bg-base-200 rounded-lg shadow-md mt-4">
                                <h3 className="text-lg font-semibold text-primary">Join Requests</h3>
                                <select 
                                    onChange={(e) => setSelectedJoinRequest(e.target.value)} 
                                    value={selectedJoinRequest.toString()}
                                    className="select select-bordered w-full bg-base-100 text-base-content mt-2"
                                >
                                    <option value="">Select a Nation</option>
                                    {Array.isArray(joinRequests) && joinRequests.length > 0 ? (
                                        joinRequests.map((request) => (
                                            <option key={request} value={request}>{request.toString()}</option>
                                        ))
                                    ) : (
                                        <option>No requests available</option>
                                    )}
                                </select>
                                <button 
                                    onClick={handleApproveJoin} 
                                    className="btn btn-success w-full mt-3"
                                >
                                    Approve Join Request
                                </button>
                            </div>
    
                            {/* Manage Admins */}
                            <div className="p-4 bg-base-200 rounded-lg shadow-md mt-4">
                                <h3 className="text-lg font-semibold text-primary">Manage Admins</h3>
                                <input 
                                    type="text" 
                                    placeholder="Nation ID" 
                                    value={adminNationId.toString()} 
                                    onChange={(e) => setAdminNationId(e.target.value)} 
                                    className="input input-bordered w-full bg-base-100 text-base-content mt-2"
                                />
                                <div className="mt-3 flex gap-2">
                                    <button 
                                        onClick={handleAddAdmin} 
                                        className="btn btn-accent flex-1"
                                    >
                                        Add Admin
                                    </button>
                                    <button 
                                        onClick={handleRemoveAdmin} 
                                        className="btn btn-error flex-1"
                                    >
                                        Remove Admin
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
    
};

export default AllianceManagement;
