"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { usePublicClient, useAccount } from "wagmi";

import { getResources, getBonusResources, getTradingPartners, getPlayerResources } from '../../../utils/resources';
import { tokensOfOwner } from "~~/utils/countryMinter";

const ManageTrades = () => {
    const searchParams = useSearchParams();
    const publicClient = usePublicClient();
    const contractsData = useAllContracts();
    const { address: walletAddress } = useAccount();

    const ResourcesContract = contractsData?.ResourcesContract;
    const CountryMinter = contractsData?.CountryMinter;

    const [loading, setLoading] = useState(true);
    const [mintedNations, setMintedNations] = useState<{ id: string; name: string }[]>([]);
    const [selectedNationId, setSelectedNationId] = useState<string | null>(null);
    const [selectedNationResources, setSelectedNationResources] = useState<any>(null);
    const [tradingPartnerId, setTradingPartnerId] = useState<string>("");
    const [tradingPartnerResources, setTradingPartnerResources] = useState<any>(null);

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

    const handleNationChange = async (nationId: string) => {
        setSelectedNationId(nationId);
        const resources = await fetchIndividualResources(nationId);
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
        console.log("Individual resources:", individualResources);

        return individualResources;    
    };

    if (loading) {
        return <div>Loading nation details...</div>;
    }

    return (
        <div className="w-5/6 p-6">
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Your Nations</th>
                        <th className="border border-gray-300 p-2">Trading Partner</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300 p-2">
                            <select
                                className="w-full p-2 border border-gray-300 rounded"
                                onChange={(e) => handleNationChange(e.target.value)}
                                value={selectedNationId || ""}
                            >
                                <option value="">Select a Nation</option>
                                {mintedNations.map((nation) => (
                                    <option key={nation.id} value={nation.id}>
                                        {nation.name}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td className="border border-gray-300 p-2">
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter Trading Partner Nation ID"
                                value={tradingPartnerId}
                                onChange={(e) => setTradingPartnerId(e.target.value)}
                            />
                            <button
                                className="mt-2 w-full p-2 bg-blue-500 text-white rounded"
                                onClick={handleTradingPartnerFetch}
                            >
                                Fetch Resources
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 p-2">
                            {selectedNationResources && (
                                <pre>{JSON.stringify(selectedNationResources, null, 2)}</pre>
                            )}
                        </td>
                        <td className="border border-gray-300 p-2">
                            {tradingPartnerResources && (
                                <pre>{JSON.stringify(tradingPartnerResources, null, 2)}</pre>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ManageTrades;
