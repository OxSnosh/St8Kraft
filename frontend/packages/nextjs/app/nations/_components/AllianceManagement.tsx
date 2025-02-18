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

    const AllianceContract = contractsData?.AllianceContract;
    const CountryMinter = contractsData?.CountryMinter;

    const [loading, setLoading] = useState(true);
    const [nations, setNations] = useState<{ id: string; name: string }[]>([]);
    const [selectedNation, setSelectedNation] = useState<string | null>(null);
    const [nationAlliance, setNationAlliance] = useState<string | null>(null);
    const [nationPlatoon, setNationPlatoon] = useState<string | null>(null);
    const [allianceMembers, setAllianceMembers] = useState<any[]>([]);
    const [joinRequests, setJoinRequests] = useState<any[]>([]);
    const [allianceName, setAllianceName] = useState<string>("");
    const [platoonId, setPlatoonId] = useState<string>("");
    const [adminNationId, setAdminNationId] = useState<string>("");
    const [selectedJoinRequest, setSelectedJoinRequest] = useState<string>("");

    useEffect(() => {
        fetchNations();
    }, [publicClient, AllianceContract, CountryMinter, walletAddress]);

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
        } catch (err) {
            console.error("Error fetching nations:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchNationAlliance = async () => {
        if (!selectedNation || !AllianceContract) return;
        try {
            const [alliance, platoon] = await getNationAllianceAndPlatoon(selectedNation, publicClient, AllianceContract);
            setNationAlliance(alliance);
            setNationPlatoon(platoon);
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
            const members = await getAllianceMembers(allianceId, publicClient, AllianceContract);
            setAllianceMembers(members);
        } catch (error) {
            console.error("Error fetching alliance members:", error);
        }
    };

    const fetchJoinRequests = async (allianceId: string) => {
        try {
            const requests = await getJoinRequests(allianceId, publicClient, AllianceContract);
            setJoinRequests(requests);
        } catch (error) {
            console.error("Error fetching join requests:", error);
        }
    };

    const handleCreateAlliance = async () => {
        if (!selectedNation || !allianceName) return;
        await createAlliance(selectedNation, allianceName, publicClient, AllianceContract, writeContractAsync);
        fetchNationAlliance();
    };

    const handleRequestToJoin = async (allianceId: string) => {
        if (!selectedNation) return;
        await requestToJoinAlliance(selectedNation, allianceId, publicClient, AllianceContract, writeContractAsync);
        fetchNationAlliance();
    };

    const handleApproveJoin = async () => {
        if (!nationAlliance || !selectedJoinRequest || !selectedNation) return;
        await approveNationJoin(nationAlliance, selectedJoinRequest, selectedNation, publicClient, AllianceContract, writeContractAsync);
        fetchNationAlliance();
    };

    const handleAssignPlatoon = async () => {
        if (!nationAlliance || !selectedNation || !platoonId) return;
        await assignNationToPlatoon(nationAlliance, selectedNation, platoonId, selectedNation, publicClient, AllianceContract, writeContractAsync);
        fetchNationAlliance();
    };

    const handleAddAdmin = async () => {
        if (!nationAlliance || !selectedNation || !adminNationId) return;
        await addAdmin(nationAlliance, adminNationId, selectedNation, publicClient, AllianceContract, writeContractAsync);
    };

    const handleRemoveAdmin = async () => {
        if (!nationAlliance || !selectedNation || !adminNationId) return;
        await removeAdmin(nationAlliance, adminNationId, selectedNation, publicClient, AllianceContract, writeContractAsync);
    };

    const handleRemoveNation = async (nationId: string) => {
        if (!nationAlliance || !selectedNation) return;
        await removeNationFromAlliance(nationAlliance, nationId, selectedNation, publicClient, AllianceContract, writeContractAsync);
        fetchNationAlliance();
    };

    return (
        <div className="w-5/6 p-6">
            <h2>Alliance Management</h2>
            
            <div>
                <h3>Select Your Nation</h3>
                <select onChange={(e) => setSelectedNation(e.target.value)} value={selectedNation || ""}>
                    <option value="">Select a Nation</option>
                    {nations.map((nation) => (
                        <option key={nation.id} value={nation.id}>{nation.name}</option>
                    ))}
                </select>
            </div>

            {selectedNation && (
                <>
                    <h3>Create an Alliance</h3>
                    <input type="text" placeholder="Alliance Name" value={allianceName} onChange={(e) => setAllianceName(e.target.value)} />
                    <button onClick={handleCreateAlliance}>Create</button>
                    
                    <h3>Join an Alliance</h3>
                    <input type="text" placeholder="Enter Alliance ID" onChange={(e) => handleRequestToJoin(e.target.value)} />
                    <button>Request to Join</button>

                    {nationAlliance && nationAlliance !== "0" && (
                        <>
                            <h3>Your Alliance: {nationAlliance}</h3>
                            <h4>Platoon: {nationPlatoon || "Not Assigned"}</h4>

                            <h3>Assign a Nation to a Platoon</h3>
                            <input type="text" placeholder="Platoon ID" value={platoonId} onChange={(e) => setPlatoonId(e.target.value)} />
                            <button onClick={handleAssignPlatoon}>Assign</button>

                            <h3>Alliance Members</h3>
                            <ul>
                                {allianceMembers.map(member => (
                                    <li key={member}>{member} <button onClick={() => handleRemoveNation(member)}>Remove</button></li>
                                ))}
                            </ul>

                            <h3>Join Requests</h3>
                            <select onChange={(e) => setSelectedJoinRequest(e.target.value)} value={selectedJoinRequest}>
                                <option value="">Select a Nation</option>
                                {joinRequests.map(request => (
                                    <option key={request} value={request}>{request}</option>
                                ))}
                            </select>
                            <button onClick={handleApproveJoin}>Approve</button>

                            <h3>Manage Admins</h3>
                            <input type="text" placeholder="Nation ID" value={adminNationId} onChange={(e) => setAdminNationId(e.target.value)} />
                            <button onClick={handleAddAdmin}>Add Admin</button>
                            <button onClick={handleRemoveAdmin}>Remove Admin</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default AllianceManagement;
