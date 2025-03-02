import React, { useEffect, useState } from "react";
import { usePublicClient, useAccount, useWriteContract } from 'wagmi';
import { ethers } from "ethers";
import { AbiCoder } from "ethers/lib/utils";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { nationActiveWars, returnWarDetails, offerPeace, deployForcesToWar } from "~~/utils/wars";
import { groundAttack } from "~~/utils/attacks";
import { tokensOfOwner } from "~~/utils/countryMinter";
import { getDefendingSoldierCount, getDefendingTankCount } from "~~/utils/forces";
import { getDeployedGroundForces } from "~~/utils/wars";
import { getCruiseMissileCount, getNukeCount } from "~~/utils/missiles";
import { launchCruiseMissileAttack } from "~~/utils/cruiseMissiles";
import { launchNuke } from "~~/utils/nukes";
import { 
    getYak9Count,
    getP51MustangCount,
    getF86SabreCount,
    getMig15Count,
    getF100SuperSabreCount,
    getF35LightningCount,
    getF15EagleCount,
    getSu30MkiCount,
    getF22RaptorCount,
 } from "~~/utils/fighters"
import { 
    getAh1CobraCount,
    getAh64ApacheCount,
    getBristolBlenheimCount,
    getB52MitchellCount,
    getB17gFlyingFortressCount,
    getB52StratofortressCount,
    getB2SpiritCount,
    getB1bLancerCount,
    getTupolevTu160Count,
} from "~~/utils/bombers"
import { 
    getCorvetteCount,
    getLandingShipCount,
    getBattleshipCount,
    getCruiserCount,
    getFrigateCount,
    getDestroyerCount,
    getSubmarineCount,
    getAircraftCarrierCount,
} from "~~/utils/navy"
import { launchAirBattle, blockade, breakBlockade, navalAttack } from "~~/utils/attacks";


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
    const [attackingNationId, setAttackingNationId] = useState<string | null>(null);
    const [defendingNationId, setDefendingNationId] = useState<string | null>(null);
    const [attackerPeaceOffered, setAttackerPeaceOffered] = useState<boolean>(false);
    const [defenderPeaceOffered, setDefenderPeaceOffered] = useState<boolean>(false);

    useEffect(() => {
        const fetchMintedNations = async () => {
            if (!walletAddress || !contractsData?.CountryMinter) return;
            const nations = await tokensOfOwner(walletAddress, publicClient, contractsData.CountryMinter);
            setMintedNations(nations.map((id: string) => ({ id, name: `Nation ${id}` })));
            if (nations.length > 0) setSelectedNation(nations[0].id);
        };

        fetchMintedNations();
    }, [walletAddress, contractsData, publicClient]);

    useEffect(() => {
        const fetchActiveWars = async () => {
            if (!selectedNation || !contractsData?.WarContract) return;

            // Reset active wars and war details when a new nation is selected
            setActiveWars([]);
            setWarDetails({});
            setSelectedWar(null);
            setAttackingNationId(null);
            setDefendingNationId(null);

            const wars = await nationActiveWars(selectedNation, contractsData.WarContract, publicClient);
            setActiveWars(wars);

            const details: Record<string, any> = {};
            for (const warId of wars) {
                const warDetail = await returnWarDetails(warId.toString(), contractsData.WarContract, publicClient);
                details[warId] = warDetail;
            }
            setWarDetails(details);
        };

        fetchActiveWars();
    }, [selectedNation, contractsData, publicClient]);

    const handleNationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedNation(e.target.value);

        // Reset selected war and war actions
        setSelectedWar(null);
        setAttackingNationId(null);
        setDefendingNationId(null);
    };

    const handleWarClick = (warId: string) => {
        if (!warDetails[warId]) return;
    
        const nation1 = warDetails[warId][0].toString();
        const nation2 = warDetails[warId][1].toString();
    
        let attacker, defender;
    
        if (selectedNation === nation1) {
            attacker = nation1;
            defender = nation2;
        } else {
            attacker = nation2;
            defender = nation1;
        }
    
        setSelectedWar(warId.toString());
        setAttackingNationId(attacker);
        setDefendingNationId(defender);
    };

    const returnPeaceOffered = async (warId: string) => {
        console.log("offense peace offered", warDetails[warId][5]);
        console.log("defense peace offered", warDetails[warId][6]);
        return warDetails[warId][5], warDetails[warId][6];
    }

    useEffect(() => {
        if (!selectedWar || !contractsData?.WarContract || !warDetails[selectedWar]) return;
    
        const fetchPeaceStatus = async () => {
            const nation1 = warDetails[selectedWar][0].toString();
            const nation2 = warDetails[selectedWar][1].toString();
    
            // Extract the peace offer statuses
            const offensePeace = Boolean(warDetails[selectedWar][5]); // Offense Peace Status
            const defensePeace = Boolean(warDetails[selectedWar][6]); // Defense Peace Status
    
            // Determine if the selected nation is nation1 (attacker) or nation2 (defender)
            const isSelectedNationAttacker = selectedNation === nation1;
            const isSelectedNationDefender = selectedNation === nation2;
    
            // Determine the opponent (not selected nation)
            const opponentNation = isSelectedNationAttacker ? nation2 : nation1;
    
            // Determine if the opponent has offered peace
            const opponentPeaceOffered = isSelectedNationAttacker ? defensePeace : offensePeace;
    
            // Set states based on whether the selected nation and the opponent have offered peace
            setAttackerPeaceOffered(isSelectedNationAttacker ? offensePeace : defensePeace);
            setDefenderPeaceOffered(opponentPeaceOffered);
        };
    
        fetchPeaceStatus();
    }, [selectedWar, selectedNation, contractsData, warDetails]);

    useEffect(() => {
        if (!selectedWar || !contractsData?.WarContract || !warDetails[selectedWar]) return;3
        if (!selectedNation || !defendingNationId) return;
    
        const fetchForces = async () => {
            const defenderSoldiers = await getDefendingSoldierCount(defendingNationId, publicClient, contractsData.ForcesContract);
            const defenderTanks = await getDefendingTankCount(defendingNationId, publicClient, contractsData.ForcesContract);

            console.log("Defender Soldiers:", defenderSoldiers);
            console.log("Attacker Soldiers:", defenderTanks);

            const attackerSoldiers = await getDefendingSoldierCount(selectedNation, publicClient, contractsData.ForcesContract);
            const attackerTanks = await getDefendingTankCount(selectedNation, publicClient, contractsData.ForcesContract);

            console.log("Defender Soldiers:", attackerSoldiers);
            console.log("Attacker Soldiers:", attackerTanks);

            const deployedForces = await getDeployedGroundForces(selectedWar, selectedNation, contractsData.WarContract, publicClient);

            console.log("Deployed Soldiers", deployedForces[0]);
            console.log("Deployed Tanks", deployedForces[1]);

            return { deployedForces, defenderSoldiers, defenderTanks, attackerSoldiers, attackerTanks };
        };
    
        fetchForces();
    }, [selectedWar, selectedNation, contractsData, warDetails]);
    
    // Peace Offer Card UI
    const PeaceOfferCard = () => {
        let peaceMessage = "";
        let buttonText = "";
        let showButton = true;
    
        if (!attackerPeaceOffered && !defenderPeaceOffered) {
            peaceMessage = "Be the first to offer peace.";
            buttonText = "Offer Peace";
        } else if (attackerPeaceOffered && !defenderPeaceOffered) {
            peaceMessage = "Awaiting opponent to accept peace offer.";
            showButton = false;
        } else if (!attackerPeaceOffered && defenderPeaceOffered) {
            peaceMessage = "Opponent has offered peace. Do you want to declare peace?";
            buttonText = "Declare Peace";
        }

        const handleOfferPeace = async () => {
            if (!selectedWar || !selectedNation || !defendingNationId) return;

            const contractData = contractsData.WarContract;
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

                const data = contract.interface.encodeFunctionData("offerPeace", [
                    selectedNation,
                    selectedWar
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
        
                const tx = await offerPeace(selectedNation, selectedWar, contractsData.WarContract, writeContractAsync);

            } catch (error: any) {
                const errorMessage = parseRevertReason(error);
                console.error("Transaction failed:", errorMessage);
                alert(`Transaction failed: ${errorMessage}`);
            }
        }
    
        if (!selectedWar || !selectedNation || !defendingNationId) return null;
        return (
            <div className="border border-blue-300 p-4 rounded-lg shadow-md mt-4">
                <h2 className="text-lg font-bold">Peace Negotiation</h2>
                <p>{peaceMessage}</p>
                {showButton && (
                    <button
                        onClick={() => handleOfferPeace()}
                        className="bg-blue-500 text-white p-2 rounded mt-2"
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        );
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

    const DeployForcesCard = () => {
        const [attackerSoldiers, setAttackerSoldiers] = useState<number>(0);
        const [attackerTanks, setAttackerTanks] = useState<number>(0);
        const [deployedSoldiers, setDeployedSoldiers] = useState<number>(0);
        const [deployedTanks, setDeployedTanks] = useState<number>(0);
        const [defenderSoldiers, setDefenderSoldiers] = useState<number>(0);
        const [defenderTanks, setDefenderTanks] = useState<number>(0);
        const [deploySoldiers, setDeploySoldiers] = useState<number>(0);
        const [deployTanks, setDeployTanks] = useState<number>(0);
    
        useEffect(() => {
            if (!selectedWar || !selectedNation || !defendingNationId) return;
    
            const fetchForces = async () => {
                const attackerSoldierCount = await getDefendingSoldierCount(selectedNation, publicClient, contractsData.ForcesContract);
                const attackerTankCount = await getDefendingTankCount(selectedNation, publicClient, contractsData.ForcesContract);
    
                const defenderSoldierCount = await getDefendingSoldierCount(defendingNationId, publicClient, contractsData.ForcesContract);
                const defenderTankCount = await getDefendingTankCount(defendingNationId, publicClient, contractsData.ForcesContract);
    
                const deployedForces = await getDeployedGroundForces(selectedWar, selectedNation, contractsData.WarContract, publicClient);
    
                setAttackerSoldiers(attackerSoldierCount.toString());
                setAttackerTanks(attackerTankCount.toString());
                setDeployedSoldiers(deployedForces[0].toString());
                setDeployedTanks(deployedForces[1].toString());
                setDefenderSoldiers(defenderSoldierCount.toString());
                setDefenderTanks(defenderTankCount.toString());
            };
    
            fetchForces();
        }, [selectedWar, selectedNation, defendingNationId]);
    

        const handleDeployForces = async () => {
            if (deploySoldiers <= 0 && deployTanks <= 0) return;
            if(!selectedWar || !selectedNation) return;

            const contractData = contractsData.WarContract;
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

                const data = contract.interface.encodeFunctionData("deployForcesToWar", [
                    selectedNation,
                    selectedWar,
                    deploySoldiers,
                    deployTanks
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
        
                const tx = await deployForcesToWar(selectedNation, selectedWar, deploySoldiers, deployTanks, contractsData.WarContract, writeContractAsync);
                
                const deployedForces = await getDeployedGroundForces(selectedWar, selectedNation, contractsData.WarContract, publicClient);
                setDeployedSoldiers(deployedForces[0]);
                setDeployedTanks(deployedForces[1]);
        
                setDeploySoldiers(0);
                setDeployTanks(0);
            } catch (error : any) {
                const errorMessage = parseRevertReason(error);
                console.error("Transaction failed:", errorMessage);
                alert(`Transaction failed: ${errorMessage}`);
            }
        };
    
        if (!selectedWar || !selectedNation || !defendingNationId) return null;
    
        return (
            <div className="border border-green-300 p-4 rounded-lg shadow-md mt-4">
                <h2 className="text-lg font-bold">Deploy Forces</h2>
    
                {/* Attacker Forces */}
                <p><strong>Your Total Soldiers:</strong> {attackerSoldiers}</p>
                <p><strong>Your Total Tanks:</strong> {attackerTanks}</p>
                <p><strong>Deployed Soldiers:</strong> {deployedSoldiers}</p>
                <p><strong>Deployed Tanks:</strong> {deployedTanks}</p>
    
                {/* Defender Forces */}
                <p><strong>Enemy Soldiers:</strong> {defenderSoldiers}</p>
                <p><strong>Enemy Tanks:</strong> {defenderTanks}</p>
    
                {/* Deployment Inputs */}
                <div className="mt-2">
                    <label className="block font-bold">Soldiers to Deploy:</label>
                    <input
                        type="number"
                        min="0"
                        max={attackerSoldiers - deployedSoldiers}
                        value={deploySoldiers}
                        onChange={(e) => setDeploySoldiers(Number(e.target.value))}
                        className="border p-2 w-full rounded"
                    />
                </div>
    
                <div className="mt-2">
                    <label className="block font-bold">Tanks to Deploy:</label>
                    <input
                        type="number"
                        min="0"
                        max={attackerTanks - deployedTanks}
                        value={deployTanks}
                        onChange={(e) => setDeployTanks(Number(e.target.value))}
                        className="border p-2 w-full rounded"
                    />
                </div>
    
                {/* Deploy Button */}
                <button 
                    onClick={handleDeployForces} 
                    className="bg-green-500 text-white p-2 rounded mt-4 w-full"
                    disabled={deploySoldiers <= 0 && deployTanks <= 0}
                >
                    Deploy Forces
                </button>
            </div>
        );
    };
    
    const GroundAttackCard = () => {
        const [attackType, setAttackType] = useState<number>(1);
    

        // const handleGroundAttack = async () => {
        //     if (!selectedWar || !selectedNation || !defendingNationId) return;
        //     if (attackType < 1 || attackType > 4) {
        //         alert("Please enter a valid attack type (1-4).");
        //         return;
        //     }
    
        //     await groundAttack(selectedWar, selectedNation, defendingNationId, attackType.toString(), contractsData.GroundBattleContract, writeContractAsync);
            
        //     alert(`Ground attack executed with attack type ${attackType}!`);
        // };
    
        // if (!selectedWar || !selectedNation || !defendingNationId) return null;

        const handleGroundAttack = async () => {
            if (!selectedNation || !defendingNationId || !selectedWar) {
                alert("Please select both an attacking and defending nation.");
                return;
            }

            if (attackType < 1 || attackType > 4) {
                alert("Please enter a valid attack type (1-4).");
                return;
            }
        
            try {
                const contractData = contractsData.GroundBattleContract;
                const abi = contractData.abi;
        
                if (!contractData.address || !abi) {
                    console.error("Contract address or ABI is missing");
                    return;
                }
        
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
        
                const contract = new ethers.Contract(contractData.address, abi as ethers.ContractInterface, signer);
        
                const data = contract.interface.encodeFunctionData("groundAttack", [
                    selectedWar,
                    selectedNation,
                    defendingNationId,
                    attackType.toString(),
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
        
                const tx = await groundAttack(selectedWar, selectedNation, defendingNationId, attackType.toString(), contractsData.GroundBattleContract, writeContractAsync);
        
            } catch (error: any) {
                const errorMessage = parseRevertReason(error);
                console.error("Error declaring war:", errorMessage);
                alert(`Failed to declare war: ${errorMessage}`);
            }
        };
    
        return (
            <div className="border border-red-400 p-4 rounded-lg shadow-md mt-4">
                <h2 className="text-lg font-bold">Ground Attack</h2>
    
                <p><strong>Attacking Nation:</strong> {selectedNation}</p>
                <p><strong>Defending Nation:</strong> {defendingNationId}</p>
    
                {/* Attack Type Input */}
                <div className="mt-2">
                    <label className="block font-bold">Select Attack Type (1-4):</label>
                    <input
                        type="number"
                        min="1"
                        max="4"
                        value={attackType}
                        onChange={(e) => setAttackType(Number(e.target.value))}
                        className="border p-2 w-full rounded"
                    />
                </div>
    
                {/* Ground Attack Button */}
                <button 
                    onClick={handleGroundAttack} 
                    className="bg-red-500 text-white p-2 rounded mt-4 w-full"
                    disabled={attackType < 1 || attackType > 4}
                >
                    Execute Ground Attack
                </button>
            </div>
        );
    };

    const CruiseMissileAttackCard = () => {
        const [cruiseMissileCount, setCruiseMissileCount] = useState<number>(0);
    
        useEffect(() => {
            if (!selectedNation || !contractsData?.MissilesContract) return;
    
            const fetchCruiseMissiles = async () => {
                const missileCount = await getCruiseMissileCount(selectedNation, publicClient, contractsData.MissilesContract);
                setCruiseMissileCount(missileCount);
            };
    
            fetchCruiseMissiles();
        }, [selectedNation, contractsData]);
    
        // const handleLaunchCruiseMissile = async () => {
        //     if (!selectedWar || !selectedNation || !defendingNationId || cruiseMissileCount <= 0) return;
    
        //     await launchCruiseMissileAttack(selectedNation, defendingNationId, selectedWar, contractsData.CruiseMissileContract, writeContractAsync);
    
        //     alert(`Cruise missile launched at ${defendingNationId}!`);
    
        //     // Refresh the missile count after launch
        //     const updatedMissileCount = await getCruiseMissileCount(selectedNation, publicClient, contractsData.MissilesContract);
        //     setCruiseMissileCount(updatedMissileCount);
        // };

        const handleLaunchCruiseMissile = async () => {
            if (!selectedNation || !defendingNationId || !selectedWar || cruiseMissileCount <= 0) { // Check if all required fields are filled
                alert("Please select both an attacking and defending nation.");
                return;
            }
        
            try {
                const contractData = contractsData.CruiseMissileContract; // Update Contract
                const abi = contractData.abi;
        
                if (!contractData.address || !abi) {
                    console.error("Contract address or ABI is missing");
                    return;
                }
        
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
        
                const contract = new ethers.Contract(contractData.address, abi as ethers.ContractInterface, signer);
        
                const data = contract.interface.encodeFunctionData("launchCruiseMissileAttack", [ //// update function and args
                    selectedNation,
                    defendingNationId,
                    selectedWar
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
        
                const tx = await await launchCruiseMissileAttack(selectedNation, defendingNationId, selectedWar, contractsData.CruiseMissileContract, writeContractAsync); //// update function call
        
                alert(`Cruise missile launched at ${defendingNationId}!`);
    
                // Refresh the missile count after launch
                const updatedMissileCount = await getCruiseMissileCount(selectedNation, publicClient, contractsData.MissilesContract);
                setCruiseMissileCount(updatedMissileCount);

            } catch (error: any) {
                const errorMessage = parseRevertReason(error);
                console.error("Error declaring war:", errorMessage);
                alert(`Failed to declare war: ${errorMessage}`);
            }
        };
    
        if (!selectedWar || !selectedNation || !defendingNationId) return null;
    
        return (
            <div className="border border-orange-500 p-4 rounded-lg shadow-md mt-4">
                <h2 className="text-lg font-bold">Launch Cruise Missile</h2>
    
                <p><strong>Your Cruise Missiles:</strong> {cruiseMissileCount}</p>
    
                {/* Launch Button */}
                <button
                    onClick={handleLaunchCruiseMissile}
                    className="bg-orange-500 text-white p-2 rounded mt-4 w-full"
                    disabled={cruiseMissileCount <= 0}
                >
                    {cruiseMissileCount > 0 ? "Launch Cruise Missile" : "No Missiles Available"}
                </button>
            </div>
        );
    };

    const NuclearMissileAttackCard = () => {
        const [nukeCount, setNukeCount] = useState<number>(0);
        const [attackType, setAttackType] = useState<number>(1);
    
        useEffect(() => {
            if (!selectedNation || !contractsData?.NukesContract) return;
    
            const fetchNukeCount = async () => {
                const count = await getNukeCount(selectedNation, publicClient, contractsData.MissilesContract);
                setNukeCount(count);
            };
    
            fetchNukeCount();
        }, [selectedNation, contractsData]);
    
        // const handleLaunchNuke = async () => {
        //     if (!selectedWar || !selectedNation || !defendingNationId || nukeCount <= 0) return;
        //     if (attackType < 1 || attackType > 4) {
        //         alert("Please enter a valid attack type (1-4).");
        //         return;
        //     }
    
        //     await launchNuke(selectedWar, selectedNation, defendingNationId, attackType.toString(), contractsData.NukesContract, writeContractAsync);
    
        //     alert(`Nuclear missile launched at ${defendingNationId} with attack type ${attackType}!`);
    
        //     // Refresh the nuke count after launch
        //     const updatedNukeCount = await getNukeCount(selectedNation, publicClient, contractsData.MissilesContract);
        //     setNukeCount(updatedNukeCount);
        // };

        const handleLaunchNuke = async () => { ////update function name
            if (!selectedNation || !defendingNationId || !selectedWar || nukeCount <= 0) { // Check if all required fields are filled
                alert("Please select both an attacking and defending nation.");
                return;
            }
        
            try {
                const contractData = contractsData.NukeContract; // Update Contract
                const abi = contractData.abi;
        
                if (!contractData.address || !abi) {
                    console.error("Contract address or ABI is missing");
                    return;
                }
        
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
        
                const contract = new ethers.Contract(contractData.address, abi as ethers.ContractInterface, signer);
        
                const data = contract.interface.encodeFunctionData("launchNuke", [ //// update function and args
                    selectedWar,
                    selectedNation,
                    defendingNationId,
                    attackType.toString()
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
        
                const tx = await launchNuke(selectedWar, selectedNation, defendingNationId, attackType.toString(), contractsData.NukesContract, writeContractAsync); //// update function call
        
                alert(`Nuclear missile launched at ${defendingNationId} with attack type ${attackType}!`);
    
                // Refresh the nuke count after launch
                const updatedNukeCount = await getNukeCount(selectedNation, publicClient, contractsData.MissilesContract);
                setNukeCount(updatedNukeCount);

            } catch (error: any) {
                const errorMessage = parseRevertReason(error);
                console.error("Error declaring war:", errorMessage);
                alert(`Failed to declare war: ${errorMessage}`);
            }
        };
    
        if (!selectedWar || !selectedNation || !defendingNationId) return null;
    
        return (
            <div className="border border-black p-4 rounded-lg shadow-md mt-4">
                <h2 className="text-lg font-bold">Launch Nuclear Missile</h2>
    
                <p><strong>Your Nukes:</strong> {nukeCount}</p>
    
                {/* Attack Type Input */}
                <div className="mt-2">
                    <label className="block font-bold">Select Attack Type (1-4):</label>
                    <input
                        type="number"
                        min="1"
                        max="4"
                        value={attackType}
                        onChange={(e) => setAttackType(Number(e.target.value))}
                        className="border p-2 w-full rounded"
                    />
                </div>
    
                {/* Launch Button */}
                <button
                    onClick={handleLaunchNuke}
                    className="bg-black text-white p-2 rounded mt-4 w-full"
                    disabled={nukeCount <= 0}
                >
                    {nukeCount > 0 ? "Launch Nuclear Missile" : "No Nukes Available"}
                </button>
            </div>
        );
    };
    
    const LaunchAirstrikeCard = () => {
        const [attackingFighters, setAttackingFighters] = useState<number[]>(Array(9).fill(0));
        const [attackingBombers, setAttackingBombers] = useState<number[]>(Array(9).fill(0));
        const [defenderFighters, setDefenderFighters] = useState<number[]>(Array(9).fill(0));
        const [ownedFighters, setOwnedFighters] = useState<number[]>(Array(9).fill(0));
        const [ownedBombers, setOwnedBombers] = useState<number[]>(Array(9).fill(0));
        const [totalSelected, setTotalSelected] = useState<number>(0);
    
        useEffect(() => {
            if (!selectedNation || !defendingNationId || !contractsData?.AirBattleContract) return;
    
            const fetchAircraftCounts = async () => {
                // Fetch Fighters
                const fighterCounts = await Promise.all([
                    getYak9Count(selectedNation, publicClient, contractsData.FightersContract),
                    getP51MustangCount(selectedNation, publicClient, contractsData.FightersContract),
                    getF86SabreCount(selectedNation, publicClient, contractsData.FightersContract),
                    getMig15Count(selectedNation, publicClient, contractsData.FightersContract),
                    getF100SuperSabreCount(selectedNation, publicClient, contractsData.FightersContract),
                    getF35LightningCount(selectedNation, publicClient, contractsData.FightersContract),
                    getF15EagleCount(selectedNation, publicClient, contractsData.FightersContract),
                    getSu30MkiCount(selectedNation, publicClient, contractsData.FightersContract),
                    getF22RaptorCount(selectedNation, publicClient, contractsData.FightersContract),
                ]);
                setOwnedFighters(fighterCounts);
    
                // Fetch Bombers
                const bomberCounts = await Promise.all([
                    getAh1CobraCount(selectedNation, publicClient, contractsData.BombersContract),
                    getAh64ApacheCount(selectedNation, publicClient, contractsData.BombersContract),
                    getBristolBlenheimCount(selectedNation, publicClient, contractsData.BombersContract),
                    getB52MitchellCount(selectedNation, publicClient, contractsData.BombersContract),
                    getB17gFlyingFortressCount(selectedNation, publicClient, contractsData.BombersContract),
                    getB52StratofortressCount(selectedNation, publicClient, contractsData.BombersContract),
                    getB2SpiritCount(selectedNation, publicClient, contractsData.BombersContract),
                    getB1bLancerCount(selectedNation, publicClient, contractsData.BombersContract),
                    getTupolevTu160Count(selectedNation, publicClient, contractsData.BombersContract),
                ]);
                setOwnedBombers(bomberCounts);
    
                // Fetch Defender Fighters
                const defenderFighterCounts = await Promise.all([
                    getYak9Count(defendingNationId, publicClient, contractsData.FightersContract),
                    getP51MustangCount(defendingNationId, publicClient, contractsData.FightersContract),
                    getF86SabreCount(defendingNationId, publicClient, contractsData.FightersContract),
                    getMig15Count(defendingNationId, publicClient, contractsData.FightersContract),
                    getF100SuperSabreCount(defendingNationId, publicClient, contractsData.FightersContract),
                    getF35LightningCount(defendingNationId, publicClient, contractsData.FightersContract),
                    getF15EagleCount(defendingNationId, publicClient, contractsData.FightersContract),
                    getSu30MkiCount(defendingNationId, publicClient, contractsData.FightersContract),
                    getF22RaptorCount(defendingNationId, publicClient, contractsData.FightersContract),
                ]);
                setDefenderFighters(defenderFighterCounts);
            };
    
            fetchAircraftCounts();
        }, [selectedNation, defendingNationId, contractsData]);
    
        // Ensure the total of all selected aircraft does not exceed 25
        const handleAircraftSelection = (index: number, type: "fighter" | "bomber", value: number) => {
            value = Math.max(0, value); // Ensure no negative numbers
            const maxValue = type === "fighter" ? ownedFighters[index] : ownedBombers[index];
            value = Math.min(value, maxValue); // Ensure does not exceed owned aircraft
    
            const newFighters = [...attackingFighters];
            const newBombers = [...attackingBombers];
    
            if (type === "fighter") newFighters[index] = value;
            else newBombers[index] = value;
    
            const newTotal = newFighters.reduce((sum, val) => sum + val, 0) + 
                             newBombers.reduce((sum, val) => sum + val, 0);
    
            if (newTotal > 25) return; // Prevent exceeding 25 aircraft
    
            setAttackingFighters(newFighters);
            setAttackingBombers(newBombers);
            setTotalSelected(newTotal);
        };
    
        // const handleLaunchAirstrike = async () => {
        //     if (!selectedWar || !selectedNation || !defendingNationId || totalSelected === 0) return;
    
        //     await launchAirBattle(
        //         selectedWar,
        //         selectedNation,
        //         defendingNationId,
        //         attackingFighters,
        //         attackingBombers,
        //         contractsData.AirBattleContract,
        //         writeContractAsync
        //     );
    
        //     alert(`Airstrike launched against ${defendingNationId} with ${totalSelected} aircraft!`);
        // };

        const handleLaunchAirstrike = async () => { ////update function name
            if (!selectedNation || !defendingNationId || !selectedWar || totalSelected === 0) { // Check if all required fields are filled
                alert("Please select both an attacking and defending nation.");
                return;
            }
        
            try {
                const contractData = contractsData.AirBattleContract; // Update Contract
                const abi = contractData.abi;
        
                if (!contractData.address || !abi) {
                    console.error("Contract address or ABI is missing");
                    return;
                }
        
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
        
                const contract = new ethers.Contract(contractData.address, abi as ethers.ContractInterface, signer);
        
                const data = contract.interface.encodeFunctionData("airBattle", [ //// update function and args
                    selectedWar,
                    selectedNation,
                    defendingNationId,
                    attackingFighters,
                    attackingBombers
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
        
                const tx = await launchAirBattle(
                    selectedWar,
                    selectedNation,
                    defendingNationId,
                    attackingFighters,
                    attackingBombers,
                    contractsData.AirBattleContract,
                    writeContractAsync
                ); //// update function call
        
                alert(`Air Strike launched at ${defendingNationId}!`);

            } catch (error: any) {
                const errorMessage = parseRevertReason(error);
                console.error("Error declaring war:", errorMessage);
                alert(`Failed to declare war: ${errorMessage}`);
            }
        };
    
        if (!selectedWar || !selectedNation || !defendingNationId) return null;
    
        return (
            <div className="border border-blue-500 p-4 rounded-lg shadow-md mt-4">
                <h2 className="text-lg font-bold">Launch Airstrike</h2>
    
                <p><strong>Your Fighters:</strong></p>
                {ownedFighters.map((count, index) => count > 0 && (
                    <div key={`fighter-${index}`} className="mt-2">
                        <label className="block font-bold">Fighter {index + 1}: ({count} available)</label>
                        <input
                            type="number"
                            min="0"
                            max={count}
                            value={attackingFighters[index]}
                            onChange={(e) => handleAircraftSelection(index, "fighter", Number(e.target.value))}
                            className="border p-2 w-full rounded"
                        />
                    </div>
                ))}
    
                <p><strong>Your Bombers:</strong></p>
                {ownedBombers.map((count, index) => count > 0 && (
                    <div key={`bomber-${index}`} className="mt-2">
                        <label className="block font-bold">Bomber {index + 1}: ({count} available)</label>
                        <input
                            type="number"
                            min="0"
                            max={count}
                            value={attackingBombers[index]}
                            onChange={(e) => handleAircraftSelection(index, "bomber", Number(e.target.value))}
                            className="border p-2 w-full rounded"
                        />
                    </div>
                ))}
    
                <p><strong>Defender's Fighters:</strong></p>
                {defenderFighters.map((count, index) => count > 0 && (
                    <p key={`defender-fighter-${index}`}>Fighter {index + 1}: {count}</p>
                ))}
    
                <p className="mt-2"><strong>Total Selected:</strong> {totalSelected}/25</p>
    
                {/* Launch Button */}
                <button
                    onClick={handleLaunchAirstrike}
                    className="bg-blue-500 text-white p-2 rounded mt-4 w-full"
                    disabled={totalSelected === 0}
                >
                    {totalSelected > 0 ? "Launch Airstrike" : "Select Aircraft"}
                </button>
            </div>
        );
    };
    
    const NavalWarfareCard = () => {
        const [attackingNavy, setAttackingNavy] = useState<number[]>(Array(8).fill(0));
        const [defendingNavy, setDefendingNavy] = useState<number[]>(Array(8).fill(0));
    
        useEffect(() => {
            if (!selectedNation || !defendingNationId || !contractsData?.NavalContract) return;
    
            const fetchNavalForces = async () => {
                // Fetch Attacking Nation's Navy
                const attackerNavy = await Promise.all([
                    getCorvetteCount(selectedNation, publicClient, contractsData.NavyContract),
                    getLandingShipCount(selectedNation, publicClient, contractsData.NavyContract),
                    getBattleshipCount(selectedNation, publicClient, contractsData.NavyContract),
                    getCruiserCount(selectedNation, publicClient, contractsData.NavyContract),
                    getFrigateCount(selectedNation, publicClient, contractsData.NavyContract),
                    getDestroyerCount(selectedNation, publicClient, contractsData.NavyContract),
                    getSubmarineCount(selectedNation, publicClient, contractsData.NavyContract),
                    getAircraftCarrierCount(selectedNation, publicClient, contractsData.NavyContract),
                ]);
                setAttackingNavy(attackerNavy);
    
                // Fetch Defending Nation's Navy
                const defenderNavy = await Promise.all([
                    getCorvetteCount(defendingNationId, publicClient, contractsData.NavyContract),
                    getLandingShipCount(defendingNationId, publicClient, contractsData.NavyContract),
                    getBattleshipCount(defendingNationId, publicClient, contractsData.NavyContract),
                    getCruiserCount(defendingNationId, publicClient, contractsData.NavyContract),
                    getFrigateCount(defendingNationId, publicClient, contractsData.NavyContract),
                    getDestroyerCount(defendingNationId, publicClient, contractsData.NavyContract),
                    getSubmarineCount(defendingNationId, publicClient, contractsData.NavyContract),
                    getAircraftCarrierCount(defendingNationId, publicClient, contractsData.NavyContract),
                ]);
                setDefendingNavy(defenderNavy);
            };
    
            fetchNavalForces();
        }, [selectedNation, defendingNationId, contractsData]);
    
        // const handleNavalAttack = async () => {
        //     if (!selectedWar || !selectedNation || !defendingNationId) return;
        //     await navalAttack(selectedWar, selectedNation, defendingNationId, contractsData.NavalAttackContract, writeContractAsync);
        //     alert(`Naval attack launched against ${defendingNationId}!`);
        // };

        const handleNavalAttack = async () => { ////update function name
            if (!selectedNation || !defendingNationId || !selectedWar) { // Check if all required fields are filled
                alert("Please select both an attacking and defending nation.");
                return;
            }
        
            try {
                const contractData = contractsData.NavalAttackContract; // Update Contract
                const abi = contractData.abi;
        
                if (!contractData.address || !abi) {
                    console.error("Contract address or ABI is missing");
                    return;
                }
        
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
        
                const contract = new ethers.Contract(contractData.address, abi as ethers.ContractInterface, signer);
        
                const data = contract.interface.encodeFunctionData("navalAttack", [ //// update function and args
                    selectedWar,
                    selectedNation,
                    defendingNationId,
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
        
                const tx = await navalAttack(selectedWar, selectedNation, defendingNationId, contractsData.NavalAttackContract, writeContractAsync); //// update function call
        
                alert(`Naval attack launched against ${defendingNationId}!`);

            } catch (error: any) {
                const errorMessage = parseRevertReason(error);
                console.error("Error declaring war:", errorMessage);
                alert(`Failed to declare war: ${errorMessage}`);
            }
        };
    
        // const handleBlockade = async () => {
        //     if (!selectedWar || !selectedNation || !defendingNationId) return;
        //     await blockade(selectedNation, defendingNationId, selectedWar, contractsData.NavalBlockadeContract, writeContractAsync);
        //     alert(`Blockade initiated against ${defendingNationId}!`);
        // };

        const handleBlockade = async () => { ////update function name
            if (!selectedNation || !defendingNationId || !selectedWar) { // Check if all required fields are filled
                alert("Please select both an attacking and defending nation.");
                return;
            }
        
            try {
                const contractData = contractsData.NavalBlockadeContract; // Update Contract
                const abi = contractData.abi;
        
                if (!contractData.address || !abi) {
                    console.error("Contract address or ABI is missing");
                    return;
                }
        
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
        
                const contract = new ethers.Contract(contractData.address, abi as ethers.ContractInterface, signer);
        
                const data = contract.interface.encodeFunctionData("blockade", [ //// update function and args
                    selectedNation,
                    defendingNationId,
                    selectedWar,
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
        
                const tx = await blockade(selectedNation, defendingNationId, selectedWar, contractsData.NavalBlockadeContract, writeContractAsync); //// update function call
        
                alert(`Blockade launched against ${defendingNationId}!`);

            } catch (error: any) {
                const errorMessage = parseRevertReason(error);
                console.error("Error declaring war:", errorMessage);
                alert(`Failed to declare war: ${errorMessage}`);
            }
        };
    
        // const handleBreakBlockade = async () => {
        //     if (!selectedWar || !selectedNation || !defendingNationId) return;
        //     await breakBlockade(selectedWar, selectedNation, defendingNationId, contractsData.BreakBlockadeContract, writeContractAsync);
        //     alert(`Attempting to break blockade from ${defendingNationId}!`);
        // };

        const handleBreakBlockade = async () => { ////update function name
            if (!selectedNation || !defendingNationId || !selectedWar) { // Check if all required fields are filled
                alert("Please select both an attacking and defending nation.");
                return;
            }
        
            try {
                const contractData = contractsData.BreakBlockadeContract; // Update Contract
                const abi = contractData.abi;
        
                if (!contractData.address || !abi) {
                    console.error("Contract address or ABI is missing");
                    return;
                }
        
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
        
                const contract = new ethers.Contract(contractData.address, abi as ethers.ContractInterface, signer);
        
                const data = contract.interface.encodeFunctionData("breakBlockade", [ //// update function and args
                    selectedWar,
                    selectedNation,
                    defendingNationId,
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
        
                const tx = await breakBlockade(selectedWar, selectedNation, defendingNationId, contractsData.BreakBlockadeContract, writeContractAsync); //// update function call
        
                alert(`Break Blockade attack launched against ${defendingNationId}!`);

            } catch (error: any) {
                const errorMessage = parseRevertReason(error);
                console.error("Error declaring war:", errorMessage);
                alert(`Failed to declare war: ${errorMessage}`);
            }
        };
    
        if (!selectedWar || !selectedNation || !defendingNationId) return null;
    
        return (
            <div className="font-special border border-blue-800 p-4 rounded-lg shadow-md mt-4">
                <h2 className="text-lg font-bold">Naval Warfare</h2>
    
                {/* Attacking Navy */}
                <p className="font-semibold mt-2">Your Navy:</p>
                {attackingNavy.map((count, index) => count > 0 && (
                    <p key={`attacker-navy-${index}`}>Naval Unit {index + 1}: {count}</p>
                ))}
    
                {/* Defending Navy */}
                <p className="font-semibold mt-2">Defender's Navy:</p>
                {defendingNavy.map((count, index) => count > 0 && (
                    <p key={`defender-navy-${index}`}>Naval Unit {index + 1}: {count}</p>
                ))}
    
                {/* Naval Actions */}
                <div className="mt-4 grid grid-cols-1 gap-2">
                    <button onClick={handleNavalAttack} className="bg-blue-500 text-white p-2 rounded w-full">Naval Attack</button>
                    <button onClick={handleBlockade} className="bg-gray-700 text-white p-2 rounded w-full">Blockade</button>
                    <button onClick={handleBreakBlockade} className="bg-yellow-500 text-white p-2 rounded w-full">Break Blockade</button>
                </div>
            </div>
        );
    };
    
    
    return (
        <div className="font-special w-5/6 p-6 bg-aged-paper text-base-content rounded-lg shadow-lg border border-primary">
            <h1 className="text-3xl font-bold text-primary-content text-center mb-4">Manage Wars</h1>
    
            {/* Nation Selection */}
            {mintedNations.length > 0 && (
                <div className="p-4 bg-base-200 rounded-lg shadow-md mb-4">
                    <label className="block text-lg font-semibold text-primary">Select Attacking Nation:</label>
                    <select
                        value={selectedNation || ""}
                        onChange={handleNationChange}
                        className="select select-bordered w-full bg-base-100 text-base-content mt-2"
                    >
                        <option value="">Select a Nation</option>
                        {mintedNations.map((nation) => (
                            <option key={nation.id} value={nation.id}>{nation.name}</option>
                        ))}
                    </select>
                </div>
            )}
    
            {/* Active Wars Card */}
            {activeWars.length > 0 && (
                <div className="p-4 bg-base-200 rounded-lg shadow-md border border-neutral mb-4">
                    <h2 className="text-xl font-bold text-primary mb-3">Active Wars</h2>
                    <div className="space-y-2">
                        {activeWars.map((warId) => (
                            <div 
                                key={warId} 
                                className="p-3 bg-base-100 border rounded-lg shadow-sm hover:bg-base-300 transition cursor-pointer"
                                onClick={() => handleWarClick(warId)}
                            >
                                <p><strong className="text-primary">War ID:</strong> {warId.toString()}</p>
                                {warDetails[warId] && (
                                    <>
                                        <p><strong className="text-secondary">Offense Nation:</strong> Nation {selectedNation}</p>
                                        <p><strong className="text-secondary">Defense Nation:</strong> Nation {defendingNationId}</p>
                                        <p><strong className="text-accent">Status:</strong> {warDetails[warId][2] ? "Active" : "Ended"}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
    
            {/* War Actions */}
            {selectedWar && selectedNation && defendingNationId && (
                <div className="p-6 bg-base-200 rounded-lg shadow-md border border-neutral">
                    <h2 className="text-xl font-bold text-primary mb-3">War Actions</h2>
                    <p><strong className="text-accent">War ID:</strong> {selectedWar}</p>
                    <p><strong className="text-secondary">Attacking Nation:</strong> {selectedNation}</p>
                    <p><strong className="text-secondary">Defending Nation:</strong> {defendingNationId}</p>
    
                    {/* War Actions Grid */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {/* Peace Negotiations - Full Width */}
                        <div className="col-span-full">
                            <PeaceOfferCard />
                        </div>
    
                        {/* Deploy Forces & Ground Attack */}
                        <DeployForcesCard />
                        <GroundAttackCard />
    
                        {/* Cruise Missile & Nuclear Attack */}
                        <CruiseMissileAttackCard />
                        <NuclearMissileAttackCard />
    
                        {/* Air Assault & Naval Warfare */}
                        <LaunchAirstrikeCard />
                        <NavalWarfareCard />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveWars;
