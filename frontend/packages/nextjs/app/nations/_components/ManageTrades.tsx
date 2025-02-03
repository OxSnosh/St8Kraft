"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { usePublicClient, useAccount, useWriteContract } from 'wagmi';

import { getResources, getBonusResources, getTradingPartners, getPlayerResources, proposeTrade, acceptTrade, cancelTrade, getProposedTradingPartners, removeTradingPartner } from '../../../utils/resources';
import { tokensOfOwner } from "~~/utils/countryMinter";

const ManageTrades = () => {
    const searchParams = useSearchParams();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();
    const { writeContractAsync } = useWriteContract();

    const ResourcesContract = contractsData?.ResourcesContract;
    const CountryMinter = contractsData?.CountryMinter;

    const [loading, setLoading] = useState(true);
    const [mintedNations, setMintedNations] = useState<{ id: string; name: string }[]>([]);
    const [selectedNationId, setSelectedNationId] = useState<string | null>(null);
    const [selectedNationResources, setSelectedNationResources] = useState<any>(null);
    const [tradingPartnerId, setTradingPartnerId] = useState<string>("");
    const [tradingPartnerResources, setTradingPartnerResources] = useState<any>(null);
    const [proposedTrades, setProposedTrades] = useState<any[]>([]);
    const [tradingPartners, setTradingPartners] = useState<any[]>([]);

    useEffect(() => {
        const fetchMintedNations = async () => {
            setLoading(true);
            if (!publicClient || !ResourcesContract || !CountryMinter) {
                console.error("Missing required data: publicClient, ResourcesContract, or CountryMinter.");
                setLoading(false);
                return;
            }
            if (!walletAddress) {
                console.error("Wallet address is undefined.");
                setLoading(false);
                return;
            }

            try {
                const ownedNations = await tokensOfOwner(walletAddress, publicClient, CountryMinter);
                const nations = ownedNations.map((tokenId: string) => ({
                    id: tokenId,
                    name: `Nation ${tokenId}`,
                }));
                console.log ("Nations:", nations);
                setMintedNations(nations);
            } catch (err) {
                console.error("Error fetching minted nations:", err);
                setMintedNations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMintedNations();
    }, [ResourcesContract, CountryMinter, publicClient, walletAddress]);

    useEffect(() => {
        if (selectedNationId) {
            fetchProposedTrades();
            fetchTradingPartners();
        }
    }, [selectedNationId]);

    const handleNationChange = async (nationId: string) => {
        setSelectedNationId(nationId);
        const resources: any = await fetchIndividualResources(nationId);
        setSelectedNationResources(resources);
    };

    const handleTradingPartnerFetch = async () => {
        if (tradingPartnerId) {
            const resources = await fetchIndividualResources(tradingPartnerId);
            setTradingPartnerResources(resources);
        }
    };

    const fetchIndividualResources = async (nationId: string) => {
        if (!ResourcesContract || !publicClient) {
            console.error("Missing required data: ResourcesContract or publicClient.");
            return;
        }
        const individualResources = await getPlayerResources(nationId, ResourcesContract, publicClient);
        return individualResources;    
    };

    const handleProposeTrade = async () => {
        console.log("Proposing trade...");
        console.log("Selected nation ID:", selectedNationId);
        console.log("Trading partner ID:", tradingPartnerId);
        console.log("Resources contract:", ResourcesContract);
        try {
            if (selectedNationId) {
                console.log("Selected nation ID:", selectedNationId);
                await proposeTrade(selectedNationId, tradingPartnerId, ResourcesContract, writeContractAsync);
            } else {
                console.error("Selected nation ID is null.");
            }
            fetchProposedTrades();
        } catch (error) {
            console.error("Failed to propose trade:", error);
        }
    };

    const handleAcceptTrade = async () => {
        try {
            console.log("Accepting trade");
            if (!ResourcesContract?.abi || !ResourcesContract?.address) {
                console.error("Missing contract ABI or address.");
                return;
            }

            console.log("Selected nation ID:", selectedNationId);
            console.log("Trading partner ID:", tradingPartnerId);
        
            await acceptTrade(
                selectedNationId!,
                tradingPartnerId,
                ResourcesContract,
                writeContractAsync
            );
            fetchProposedTrades();
            fetchTradingPartners();
        } catch (error) {
            console.error("Failed to accept trade:", error);
        }
    };

    const handleCancelTrade = async () => {
        try {
            console.log("Cancelling trade");
            if (!ResourcesContract?.abi || !ResourcesContract?.address) {
                console.error("Missing contract ABI or address.");
                return;
            }

            console.log("Selected nation ID:", selectedNationId);
            console.log("Trading partner ID:", tradingPartnerId);

            await cancelTrade(
                selectedNationId!,
                tradingPartnerId,
                ResourcesContract,
                writeContractAsync
            );
            fetchProposedTrades();
        } catch (error) {
            console.error("Failed to cancel trade:", error);
        }
    };

    const fetchProposedTrades = async () => {
        console.log("Fetching proposed trades...");
        console.log("Selected nation ID:", selectedNationId);

        if (selectedNationId) {
            console.log("Selected nation ID:", selectedNationId);
            const trades = await getProposedTradingPartners(selectedNationId, publicClient, ResourcesContract);
            console.log("Proposed trades:", trades);
            setProposedTrades(trades);
        } else {
            console.error("Selected nation ID is null.");
        }
    };

    const fetchTradingPartners = async () => {
        if (selectedNationId) {
            const partners = await getTradingPartners(selectedNationId, ResourcesContract, publicClient);
            setTradingPartners(partners);
        } else {
            console.error("Selected nation ID is null.");
        }
    };

    const handleRemoveTradingPartner = async () => {
        try {
            if (selectedNationId) {
                await removeTradingPartner(selectedNationId, tradingPartnerId, ResourcesContract, writeContractAsync);
                fetchTradingPartners();
            } else {
                console.error("Selected nation ID is null.");
            }
        } catch (error) {
            console.error("Failed to remove trading partner:", error);
        }
    };

    return (
        <div className="w-5/6 p-6">
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th>Your Nations</th>
                        <th>Trading Partner</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <select onChange={(e) => handleNationChange(e.target.value)} value={selectedNationId || ""}>
                                <option value="">Select a Nation</option>
                                {mintedNations.map((nation) => (
                                    <option key={nation.id} value={nation.id}>{nation.name}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <input
                                type="text"
                                placeholder="Enter Trading Partner Nation ID"
                                value={tradingPartnerId}
                                onChange={(e) => setTradingPartnerId(e.target.value)}
                            />
                            <button onClick={handleTradingPartnerFetch}>Fetch Resources</button>
                        </td>
                    </tr>
                    <tr>
                        <td>{selectedNationResources && <pre>{JSON.stringify(selectedNationResources, null, 2)}</pre>}</td>
                        <td>{tradingPartnerResources && <pre>{JSON.stringify(tradingPartnerResources, null, 2)}</pre>}</td>
                    </tr>
                </tbody>
            </table>

            {selectedNationId && tradingPartnerId && (
                <button onClick={handleProposeTrade}>Propose Trade</button>
            )}

            <h3>Proposed Trades</h3>
            <table>
                <tbody>
                    {proposedTrades.map((trade, index) => (
                        <tr key={index}>
                            <td>Trade ID: {trade.toString()}</td>
                            {walletAddress && (
                                <>
                                    <td>
                                        <button onClick={handleCancelTrade}>
                                            Cancel Trade
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={handleAcceptTrade}>
                                            Accept Trade
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Active Trading Partners</h3>
            <table>
                <tbody>
                    {tradingPartners.map((partner) => (
                        <tr key={partner.id}>
                            <td>{partner.name}</td>
                            <td><button onClick={() => handleRemoveTradingPartner()}>Remove Partner</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageTrades;
