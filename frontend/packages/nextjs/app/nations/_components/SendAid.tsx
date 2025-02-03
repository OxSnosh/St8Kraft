import React, { useEffect, useState } from "react";
import { usePublicClient, useAccount, useWriteContract } from 'wagmi';
import {
    proposeAid,
    acceptProposal,
    cancelAid,
    getProposalsSent,
    getProposalsReceived,
    checkAidSlots
} from "~~/utils/aid";
import { getDefendingSoldierCount } from "~~/utils/forces";
import { checkBalance } from "~~/utils/treasury";
import { getTechnologyCount } from "~~/utils/technology";
import { tokensOfOwner } from "~~/utils/countryMinter";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

const WEI_IN_ETH = BigInt("1000000000000000000");

const ManageAid = () => {
    const publicClient = usePublicClient();
    const { address: walletAddress } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const contractsData = useAllContracts();

    const CountryMinter = contractsData?.CountryMinter;
    const InfrastructureContract = contractsData?.InfrastructureContract;
    const TreasuryContract = contractsData?.TreasuryContract;
    const ForcesContract = contractsData?.ForcesContract;
    const AidContract = contractsData?.AidContract;

    const [mintedNations, setMintedNations] = useState<{ id: string | number; name: string }[]>([]);
    const [selectedNationId, setSelectedNationId] = useState(null);
    const [aidBalances, setAidBalances] = useState<{ defendingSoldierCount: number; nationBalance: bigint; technologyCount: number } | null>(null);
    const [available, setAidSlots] = useState<number | null>(null);
    const [aidPartnerId, setAidPartnerId] = useState("");
    const [aidPartnerSlots, setAidPartnerSlots] = useState<number | null>(null);
    const [techAid, setTechAid] = useState(0);
    const [balanceAid, setBalanceAid] = useState(0);
    const [soldierAid, setSoldierAid] = useState(0);
    const [proposedAidSent, setProposedAidSent] = useState<(string | number | bigint)[]>([]);
    const [proposedAidReceived, setProposedAidReceived] = useState<(string | number | bigint)[]>([]);

    useEffect(() => {
        const fetchMintedNations = async () => {
            if (walletAddress && CountryMinter && publicClient) {
                const ownedNations = await tokensOfOwner(walletAddress, publicClient, CountryMinter);
                setMintedNations(ownedNations.map((id: string | number) => ({ id, name: `Nation ${id}` })));
            }
        };
        fetchMintedNations();
    }, [walletAddress, CountryMinter, publicClient]);

    const handleNationChange = async (nationId: any) => {
        setSelectedNationId(nationId);
        const defendingSoldierCount = await getDefendingSoldierCount(nationId, publicClient, ForcesContract);
        const nationBalance = await checkBalance(nationId, publicClient, TreasuryContract);
        const technologyCount = await getTechnologyCount(nationId, publicClient, InfrastructureContract);
        const available = await checkAidSlots(nationId, AidContract, publicClient);

        setAidSlots(available);
        setAidBalances({ defendingSoldierCount, nationBalance, technologyCount });

        const sentProposals = await getProposalsSent(nationId, AidContract, publicClient);
        const receivedProposals = await getProposalsReceived(nationId, AidContract, publicClient);
        setProposedAidSent(sentProposals);
        setProposedAidReceived(receivedProposals);
    };

    const handlePartnerChange = async (partnerId: string) => {
        setAidPartnerId(partnerId);
        const availableSlots = await checkAidSlots(partnerId, AidContract, publicClient);
        setAidPartnerSlots(availableSlots);
    };

    const handleProposeAid = async () => {
        if (selectedNationId && aidPartnerId) {
            const adjustedBalanceAid = BigInt(balanceAid) * WEI_IN_ETH;
            await proposeAid(selectedNationId, aidPartnerId, techAid, adjustedBalanceAid, soldierAid, AidContract, writeContractAsync);
            handleNationChange(selectedNationId);
        }
    };

    const handleAcceptAid = async (proposalId: string) => {
        await acceptProposal(proposalId, AidContract, writeContractAsync);
        handleNationChange(selectedNationId);
    };

    const handleCancelAid = async (proposalId: string) => {
        await cancelAid(proposalId, AidContract, writeContractAsync);
        handleNationChange(selectedNationId);
    };

    return (
        <div>
            <table border={1} cellPadding={10} style={{ borderCollapse: "collapse", textAlign: "center", width: "100%" }}>
                <thead>
                    <tr>
                        <th>Sending Nation</th>
                        <th>Aid Slots</th>
                        <th>Defending Soldiers</th>
                        <th>Nation Balance</th>
                        <th>Technology Count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <select onChange={e => handleNationChange(e.target.value)} value={selectedNationId || ""}>
                                <option value="">Select a Nation</option>
                                {mintedNations.map(nation => (
                                    <option key={nation.id} value={nation.id}>{nation.name}</option>
                                ))}
                            </select>
                        </td>
                        <td>{available !== null ? available.toString() : "-"}</td>
                        <td>{aidBalances ? aidBalances.defendingSoldierCount.toString() : "-"}</td>
                        <td>{aidBalances ? (aidBalances.nationBalance / WEI_IN_ETH).toString() : "-"}</td>
                        <td>{aidBalances ? aidBalances.technologyCount.toString() : "-"}</td>
                    </tr>
                </tbody>
            </table>

            <table border={1} cellPadding={10} style={{ borderCollapse: "collapse", textAlign: "center", width: "100%", marginTop: "10px" }}>
                <thead>
                    <tr>
                        <th>Recipient Nation ID</th>
                        <th>Soldiers to Send</th>
                        <th>Balance to Send</th>
                        <th>Tech to Send</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input placeholder="Recipient Nation ID" value={aidPartnerId} onChange={e => handlePartnerChange(e.target.value)} /></td>
                        <td><input type="number" placeholder="Soldiers to Send" value={soldierAid} onChange={e => setSoldierAid(Number(e.target.value))} /></td>
                        <td><input type="number" placeholder="Balance to Send" value={balanceAid} onChange={e => setBalanceAid(Number(e.target.value))} /></td>
                        <td><input type="number" placeholder="Tech to Send" value={techAid} onChange={e => setTechAid(Number(e.target.value))} /></td>
                    </tr>
                    <tr>
                        <td colSpan={5} style={{ textAlign: "center" }}>
                            <button onClick={handleProposeAid}>Propose Aid</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h3>Proposals Sent</h3>
            <table>
                <tbody>
                    {proposedAidSent.map((proposalId, index) => (
                        <tr key={index}>
                            <td>{proposalId.toString()}</td>
                            <td><button onClick={() => handleCancelAid(proposalId.toString())}>Cancel</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Proposals Received</h3>
            <table>
                <tbody>
                    {proposedAidReceived.map((proposalId, index) => (
                        <tr key={index}>
                            <td>{proposalId.toString()}</td>
                            <td><button onClick={() => handleAcceptAid(proposalId.toString())}>Accept</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageAid;
