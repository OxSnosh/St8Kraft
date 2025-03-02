"use client";

import React, { useEffect, useState } from "react";
import { usePublicClient, useAccount, useWriteContract } from 'wagmi';
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { getNationAlliance, getNationAllianceAndPlatoon, getAllianceMembers, getJoinRequests } from "~~/utils/alliance";
import { createAlliance, requestToJoinAlliance, approveNationJoin, assignNationToPlatoon, addAdmin, removeAdmin, removeNationFromAlliance, isAdmin as checkIsAdmin } from "~~/utils/alliance";

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
    const [currentNationAlliance, setCurrentNationAlliance] = useState<string | null>(null);
    const [currentNationPlatoon, setCurrentNationPlatoon] = useState<string | null>(null);
    const [currentNationAllianceName, setCurrentNationAllianceName] = useState<string | null>(null);
    const [allianceMembers, setAllianceMembers] = useState<any[]>([]);
    const [joinRequests, setJoinRequests] = useState<any[]>([]);
    const [allianceName, setAllianceName] = useState<string>("");
    const [platoonId, setPlatoonId] = useState<string>("");
    const [assignPlatoonNationId, setAssignPlatoonNationId] = useState<string>("");
    const [adminNationId, setAdminNationId] = useState<string>("");
    const [selectedJoinRequest, setSelectedJoinRequest] = useState<string>("");
    const [nationNames, setNationNames] = useState<{ [key: string]: string }>({});
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
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
            } catch (err) {
                console.error("Error fetching nations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNations();
    }, [publicClient, CountryParametersContract, CountryMinter, walletAddress]);

    useEffect(() => {
        if (!selectedNation || !CountryParametersContract) return;
    
        const fetchNationAlliance = async () => {
            try {
                const [alliance, platoon, allianceName] = await getNationAllianceAndPlatoon(selectedNation, publicClient, CountryParametersContract);
                setCurrentNationAlliance(alliance);
                setCurrentNationPlatoon(platoon);
                setCurrentNationAllianceName(allianceName);
                setIsAdmin(false);
                
                if (alliance !== "0") {
                    const members = await getAllianceMembers(alliance, publicClient, CountryParametersContract);
                    setAllianceMembers(members);
                    fetchJoinRequests(alliance);
                    
                    const adminStatus = await checkIsAdmin(alliance, selectedNation, publicClient, CountryParametersContract);
                    setIsAdmin(adminStatus);
                } else {
                    // Clear alliance members when no alliance exists
                    setAllianceMembers([]);
                }
            } catch (error) {
                console.error("Error fetching alliance data:", error);
            }
        };
    
        fetchNationAlliance();
    }, [selectedNation]);

    useEffect(() => {
        console.log("Updated State -> Alliance:", currentNationAlliance, "Platoon:", currentNationPlatoon, "Alliance Name:", currentNationAllianceName);
    }, [currentNationAlliance, currentNationPlatoon, currentNationAllianceName]);

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!currentNationAlliance || currentNationAlliance === "0" || !selectedNation) {
                setIsAdmin(false);
                return;
            }
    
            try {
                const adminStatus = await checkIsAdmin(currentNationAlliance, selectedNation, publicClient, CountryParametersContract);
                setIsAdmin(adminStatus);
            } catch (error) {
                console.error("Error checking admin status:", error);
                setIsAdmin(false);
            }
        };
    
        checkAdminStatus();
    }, [currentNationAlliance, selectedNation]); 

    useEffect(() => {
        const fetchAllNationNames = async () => {
            if (!publicClient || !CountryParametersContract || allianceMembers.length === 0) return;
            
            const missingMembers = allianceMembers.filter(member => !nationNames[member]);
            if (missingMembers.length === 0) return;
            
            try {
                const nationNamesArray = await Promise.all(
                    missingMembers.map(async (nationId) => {
                        try {
                            const name = await publicClient.readContract({
                                abi: CountryParametersContract.abi,
                                address: CountryParametersContract.address,
                                functionName: "getNationName",
                                args: [nationId],
                            });
                            return { [nationId]: name as string };
                        } catch {
                            return { [nationId]: "Unknown" };
                        }
                    })
                );

                const updatedNames = Object.assign({}, ...nationNamesArray);
                setNationNames(prev => ({ ...prev, ...updatedNames }));
            } catch (error) {
                console.error("Error fetching nation names:", error);
            }
        };

        fetchAllNationNames();
    }, [allianceMembers]);

    const fetchJoinRequests = async (allianceId: string) => {
        try {
            const requests = await getJoinRequests(allianceId, publicClient, CountryParametersContract);
            setJoinRequests(requests);
        } catch (error) {
            console.error("Error fetching join requests:", error);
        }
    };
    
    // Log the updated state whenever joinRequests changes
    useEffect(() => {
    }, [joinRequests]);

    const handleCreateAlliance = async () => {
        if (!selectedNation || !allianceName) {
            console.error("Missing required data: selectedNation or allianceName.");
            return;
        }
        await createAlliance(selectedNation, allianceName, publicClient, CountryParametersContract, writeContractAsync);
        // fetchNationAlliance();
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
        if (!currentNationAlliance || !selectedJoinRequest || !selectedNation) return;
        try {
            await approveNationJoin(currentNationAlliance, selectedJoinRequest, selectedNation, publicClient, CountryParametersContract, writeContractAsync);
            alert("Request approved!");
            // fetchNationAlliance();
        } catch (error) {
            console.error("Error approving join request:", error);
        }
    };

    const handleAssignPlatoon = async () => {
        if (!currentNationAlliance || !assignPlatoonNationId || !platoonId) return;
        if (currentNationAlliance && assignPlatoonNationId && platoonId && selectedNation) {
            await assignNationToPlatoon(currentNationAlliance, assignPlatoonNationId, platoonId, selectedNation, publicClient, CountryParametersContract, writeContractAsync);
        } else {
            console.error("Missing required data for assigning platoon.");
        }
    };

    const handleAddAdmin = async () => {
        if (!currentNationAlliance || !selectedNation || !adminNationId) return;
        await addAdmin(currentNationAlliance, adminNationId, selectedNation, publicClient, CountryParametersContract, writeContractAsync);
    };

    const handleRemoveAdmin = async () => {
        if (!currentNationAlliance || !selectedNation || !adminNationId) return;
        await removeAdmin(currentNationAlliance, adminNationId, selectedNation, publicClient, CountryParametersContract, writeContractAsync);
    };

    const handleRemoveNation = async (nationId: string) => {
        if (!currentNationAlliance || !selectedNation) return;
        await removeNationFromAlliance(currentNationAlliance, nationId, selectedNation, publicClient, CountryParametersContract, writeContractAsync);
        // fetchNationAlliance();
    };

    return (
        <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
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
    
                    {selectedNation && (
                        <>
                            {/* Alliance Info */}
                            <div className="p-4 bg-base-200 rounded-lg shadow-md mt-4">
                                <h3 className="text-lg font-semibold text-primary">Your Current Alliance</h3>
                                {currentNationAlliance && currentNationAlliance !== "0" ? (
                                    <>
                                        <p className="text-base text-secondary-content">
                                            Alliance ID: {currentNationAlliance.toString()}
                                        </p>
                                        <p className="text-base text-secondary-content">
                                            Alliance Name: {currentNationAllianceName}
                                        </p>
                                        <p className="text-sm font-medium mt-2">Platoon: {currentNationPlatoon?.toString() || "Not Assigned"}</p>
                                    </>
                                ) : (
                                    <p className="text-sm text-secondary-content mt-2">This nation is not part of any alliance.</p>
                                )}
                            </div>
    
                            {isAdmin && currentNationAlliance !== "0" && (
                                <>
                                    {/* Assign Platoon */}
                                    <div className="p-4 bg-base-200 rounded-lg shadow-md mt-4">
                                        <h3 className="text-lg font-semibold text-primary">Assign a Nation to a Platoon</h3>
                                        <input 
                                            type="text" 
                                            placeholder="Nation ID" 
                                            value={assignPlatoonNationId} 
                                            onChange={(e) => setAssignPlatoonNationId(e.target.value)} 
                                            className="input input-bordered w-full bg-base-100 text-base-content mt-2"
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Platoon ID" 
                                            value={platoonId} 
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
                            
                            {/* Alliance Members */}
                            <div className="p-4 bg-base-200 rounded-lg shadow-md mt-4">
                                <h3 className="text-lg font-semibold text-primary">Alliance Members</h3>
                                {Array.isArray(allianceMembers) && allianceMembers.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {allianceMembers.map((member) => (
                                            <li key={member} className="flex justify-between items-center mt-2">
                                                <span>{member.toString()}: {nationNames[member] || "Loading..."}</span>
                                                {isAdmin && (
                                                    <button 
                                                        onClick={() => handleRemoveNation(member)} 
                                                        className="btn btn-error btn-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-secondary-content mt-2">No members found.</p>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
    
};

export default AllianceManagement;
