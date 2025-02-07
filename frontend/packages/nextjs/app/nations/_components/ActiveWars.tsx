import React, { useEffect, useState } from "react";
import { usePublicClient, useAccount, useWriteContract } from 'wagmi';
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { nationActiveWars, returnWarDetails, offerPeace, deployForcesToWar } from "~~/utils/wars";
import { groundAttack, blockade } from "~~/utils/attacks";
import { tokensOfOwner } from "~~/utils/countryMinter";

const ActiveWars = () => {
    const publicClient = usePublicClient();
    const { address: walletAddress } = useAccount();
    const contractsData = useAllContracts();
    const { writeContractAsync } = useWriteContract();

    const [mintedNations, setMintedNations] = useState<{ id: string; name: string }[]>([]);
    const [selectedNation, setSelectedNation] = useState<string | null>(null);
    const [activeWars, setActiveWars] = useState<string[]>([]);
    const [warDetails, setWarDetails] = useState<Record<string, any>>({});
    const [selectedWar, setSelectedWar] = useState<string | null>(null);
    const [offenseNationId, setOffenseNationId] = useState<string | null>(null);
    const [defenseNationId, setDefenseNationId] = useState<string | null>(null);

    useEffect(() => {
        const fetchMintedNations = async () => {
            if (!walletAddress || !contractsData?.CountryMinter) return;
            const nations = await tokensOfOwner(walletAddress, publicClient, contractsData.CountryMinter);
            setMintedNations(nations.map((id: string) => ({ id, name: `Nation ${id}` })));
            if (nations.length > 0) setSelectedNation(nations[0].id); // Ensure we select the first nation
        };

        fetchMintedNations();
    }, [walletAddress, contractsData, publicClient]);

    useEffect(() => {
        const fetchActiveWars = async () => {
            if (!selectedNation || !contractsData?.WarContract) return;
            const wars = await nationActiveWars(selectedNation, contractsData.WarContract, publicClient);
            setActiveWars(wars);

            const details: Record<string, any> = {};
            for (const warId of wars) {
                const warDetail = await returnWarDetails(warId, contractsData.WarContract, publicClient);
                details[warId] = warDetail;
            }
            setWarDetails(details);
        };

        fetchActiveWars();
    }, [selectedNation, contractsData, publicClient]);

    const handleWarClick = (warId: string) => {
        console.log("Selected War:", warId);
        console.log("Offense Nation:", warDetails[warId][0]);
        console.log("Defense Nation:", warDetails[warId][1]);
        if (!warDetails[warId]) return;

        setSelectedWar(warId);
        setOffenseNationId(warDetails[warId][0]);
        setDefenseNationId(warDetails[warId][1]);

        console.log("Selected War:", warId);
        console.log("Offense Nation:", warDetails[warId][0]);
        console.log("Defense Nation:", warDetails[warId][1]);
    };

    return (
        <div>
            <h1>Manage Wars</h1>

            {/* Nation Selection */}
            {mintedNations.length > 0 && (
                <div className="mb-4">
                    <label className="block font-bold mb-2">Select Attacking Nation:</label>
                    <select
                        value={selectedNation || ""}
                        onChange={(e) => setSelectedNation(e.target.value)}
                        className="border p-2 rounded"
                    >
                        {mintedNations.map((nation) => (
                            <option key={nation.id} value={nation.id}>{nation.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Active Wars Card */}
            {activeWars.length > 0 && (
                <div className="border border-gray-300 p-4 rounded-lg shadow-md mb-4">
                    <h2 className="text-lg font-bold">Active Wars</h2>
                    {activeWars.map((warId) => (
                        <div 
                            key={warId} 
                            className="p-2 border-b last:border-0 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleWarClick(warId)}
                        >
                            <p><strong>War ID:</strong> {warId}</p>
                            {warDetails[warId] && (
                                <>
                                    <p><strong>Offense Nation:</strong> Nation {warDetails[warId][0]}</p>
                                    <p><strong>Defense Nation:</strong> Nation {warDetails[warId][1]}</p>
                                    <p><strong>Status:</strong> {warDetails[warId][2] ? "Active" : "Ended"}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* War Actions */}
            {selectedWar && offenseNationId && defenseNationId && (
                <div className="border border-gray-300 p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold">War Actions</h2>
                    <p><strong>War ID:</strong> {selectedWar}</p>
                    <p><strong>Attacking Nation:</strong> {offenseNationId}</p>
                    <p><strong>Defending Nation:</strong> {defenseNationId}</p>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <button onClick={() => offerPeace(offenseNationId, selectedWar, contractsData.WarContract, writeContractAsync)} className="bg-blue-500 text-white p-2 rounded">Declare Peace</button>
                        <button onClick={() => deployForcesToWar(offenseNationId, selectedWar, 100, 10, contractsData.WarContract, writeContractAsync)} className="bg-green-500 text-white p-2 rounded">Deploy Forces</button>
                        <button onClick={() => groundAttack(selectedWar, offenseNationId, defenseNationId, "1", contractsData.GroundBattleContract, writeContractAsync)} className="bg-red-500 text-white p-2 rounded">Ground Attack</button>
                        <button onClick={() => blockade(offenseNationId, defenseNationId, selectedWar, contractsData.NavalBlockadeContract, writeContractAsync)} className="bg-gray-500 text-white p-2 rounded">Blockade</button>
                        <button onClick={() => console.log("Air Strike")} className="bg-blue-700 text-white p-2 rounded">Air Strike</button>
                        <button onClick={() => console.log("Naval Attack")} className="bg-purple-500 text-white p-2 rounded">Naval Attack</button>
                        <button onClick={() => console.log("Break Blockade")} className="bg-yellow-500 text-white p-2 rounded">Break Blockade</button>
                        <button onClick={() => console.log("Launch Cruise Missile")} className="bg-orange-500 text-white p-2 rounded">Launch Cruise Missile</button>
                        <button onClick={() => console.log("Nuke")} className="bg-black text-white p-2 rounded">Nuke</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveWars;
