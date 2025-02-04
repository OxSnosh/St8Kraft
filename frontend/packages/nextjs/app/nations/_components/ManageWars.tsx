import React, { use, useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import { usePublicClient, useAccount, useWriteContract } from 'wagmi';
import { getNationStrength } from "~~/utils/strength";
import { checkBalance } from "~~/utils/treasury";
import { getTechnologyCount } from "~~/utils/technology";
import { useSignMessage } from 'wagmi';
import { getDefendingSoldierCount, getDefendingTankCount } from "~~/utils/forces";
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
import { getSpyCount } from "~~/utils/spies";
import { getCruiseMissileCount } from "~~/utils/cruiseMissiles";
import { getNukeCount } from "~~/utils/missiles";
import { tokensOfOwner } from "~~/utils/countryMinter";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { declareWar, nationActiveWars } from "~~/utils/wars";
import { returnWarDetails } from "~~/utils/wars";
import { isWarActive, offerPeace, deployForcesToWar } from "~~/utils/wars";
import { groundAttack, blockade } from "~~/utils/attacks"
// import { relaySpyOperation } from "../../../../../../backend/scripts/spy_attack_relayer";


interface Nation {
    id: string;
    name: string;
}

interface NationComparisonTableProps {
    mintedNations: Nation[];
    handleNationChange: (nationId: string) => void;
    selectedNationForces: Record<string, any> | null;
    defendingNationForces: Record<string, any> | null;
    setDefendingNationDetails: (nationId: string) => void;
}

const NationComparisonTable: React.FC<NationComparisonTableProps> = ({ mintedNations, handleNationChange, selectedNationForces, defendingNationForces, setDefendingNationDetails }) => {
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
                <select onChange={e => handleNationChange(e.target.value)}>
                    <option value="">Attacking Nation</option>
                    {mintedNations.map(nation => (
                        <option key={nation.id} value={nation.id}>{nation.name}</option>
                    ))}
                </select>

                <div>Labels</div>

                <select onChange={e => setDefendingNationDetails(e.target.value)}>
                    <option value="">Select Target Nation</option>
                    {mintedNations.map(nation => (
                        <option key={nation.id} value={nation.id}>{nation.name}</option>
                    ))}
                </select>
            </div>

            <table border={1} cellPadding={10} style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th>Nation Details</th>
                        <th>Labels</th>
                        <th>Target Nation Details</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        { label: "Strength", key: "strength" },
                        { label: "Balance", key: "balance" },
                        { label: "Technology", key: "technology" },
                        { label: "Defending Soldiers", key: "defendingSoldiers" },
                        { label: "Defending Tanks", key: "defendingTanks" },
                        { label: "Yak9", key: "yak9" },
                        { label: "P51 Mustang", key: "p51Mustang" },
                        { label: "F86 Sabre", key: "f86Sabre" },
                        { label: "Mig15", key: "mig15" },
                        { label: "F100 Super Sabre", key: "f100SuperSabre" },
                        { label: "F35 Lightning", key: "f35Lightning" },
                        { label: "F15 Eagle", key: "f15Eagle" },
                        { label: "Su30 Mki", key: "su30Mki" },
                        { label: "F22 Raptor", key: "f22Raptor" },
                        { label: "Ah1 Cobra", key: "ah1Cobra" },
                        { label: "Ah64 Apache", key: "ah64Apache" },
                        { label: "Bristol Blenheim", key: "bristolBlenheim" },
                        { label: "B52 Mitchell", key: "b52Mitchell" },
                        { label: "B17g Flying Fortress", key: "b17gFlyingFortress" },
                        { label: "B52 Stratofortress", key: "b52Stratofortress" },
                        { label: "B2 Spirit", key: "b2Spirit" },
                        { label: "B1b Lancer", key: "b1bLancer" },
                        { label: "Tupolev Tu160", key: "tupolevTu160" },
                        { label: "Corvette", key: "corvette" },
                        { label: "Landing Ship", key: "landingShip" },
                        { label: "Battleship", key: "battleship" },
                        { label: "Cruiser", key: "cruiser" },
                        { label: "Frigate", key: "frigate" },
                        { label: "Destroyer", key: "destroyer" },
                        { label: "Submarine", key: "submarine" },
                        { label: "Aircraft Carrier", key: "aircraftCarrier" },
                        { label: "Cruise Missiles", key: "cruiseMissiles" },
                        { label: "Spies", key: "spies" },
                        { label: "Nukes", key: "nukes" }
                    ].map(item => (
                        <tr key={item.key}>
                            <td>{selectedNationForces ? selectedNationForces[item.key] : "-"}</td>
                            <td>{item.label}</td>
                            <td>{defendingNationForces ? defendingNationForces[item.key] : "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ManageWars = () => {
    const publicClient = usePublicClient();
    const { address: walletAddress } = useAccount();
    const contractsData = useAllContracts();
    const {writeContractAsync} = useWriteContract();
    const {signMessageAsync} = useSignMessage();

    const [mintedNations, setMintedNations] = useState<Nation[]>([]);
    const [selectedNationForces, setSelectedNationForces] = useState<Record<string, any>>({});
    const [selectedNationId, setSelectedNationId] = useState<string>("");
    const [defendingNationForces, setDefendingNationForces] = useState<Record<string, any>>({});
    const [defendingNationId, setDefendingNationId] = useState<string>("");
    const [activeWars, setActiveWars] = useState<string[]>([]);
    const [warDetails, setWarDetails] = useState<Record<string, any>>({});
    const [selectedWar, setSelectedWar] = useState<string>("");
    const [soldiersToDeploy, setSoldiersToDeploy] = useState<number>(0);
    const [tanksToDeploy, setTanksToDeploy] = useState<number>(0);
    const [attackType, setAttackType] = useState<number>(0);
    const [spyAttackType, setSpyAttackType] = useState<number>(0);


    useEffect(() => {
        const fetchMintedNations = async () => {
            if (walletAddress && contractsData?.CountryMinter && publicClient) {
                const ownedNations = await tokensOfOwner(walletAddress, publicClient, contractsData.CountryMinter);
                setMintedNations(ownedNations.map((id: string) => ({ id, name: `Nation ${id}` })));
            }
        };
        fetchMintedNations();
    }, [walletAddress, contractsData, publicClient]);

    const handleDeclareWar = async () => {
        await declareWar(selectedNationId, defendingNationId, contractsData.WarContract, writeContractAsync);
        const wars = await nationActiveWars(selectedNationId, publicClient, contractsData.WarContract);
        setActiveWars(Array.isArray(wars) ? wars : []);
    };

    const handleWarClick = (offenseId: string, defenseId: string, warId: string) => {
        setSelectedNationId(offenseId);
        setDefendingNationId(defenseId);
        setSelectedWar(warId);
    };

    useEffect(() => {
        const fetchActiveWars = async () => {
            if (selectedNationId) {
                const wars = await nationActiveWars(selectedNationId, contractsData.WarContract, publicClient);
                console.log("Active wars", wars);
                setActiveWars(wars);
            
                const details: Record<string, any> = {};
                for (const warIdRaw of wars) {
                    console.log("War ID", warIdRaw);
                    let warId = warIdRaw.toString();
                    console.log("War ID", warId);   
                    console.log(contractsData.WarContract);
                    console.log(publicClient);
                    const warDetail = await returnWarDetails(warId, contractsData.WarContract, publicClient);
                    console.log("War detail", warDetail);
                    details[warId] = warDetail;
                }
                console.log("War details", details);
                setWarDetails(details);
            }
        };
        fetchActiveWars();
    }, [selectedNationId, contractsData, publicClient]);

    const fetchIsWarActive = async (warId: string) => {
        const active = await isWarActive(warId, contractsData.WarContract, publicClient);
        return active;
    }

    const handleNationChange = async (nationId: string) => {
        const nationStrength = await getNationStrength(nationId, publicClient, contractsData.NationStrengthContract);
        const nationBalance = await checkBalance(nationId, publicClient, contractsData.TreasuryContract);
        const technologyCount = await getTechnologyCount(nationId, publicClient, contractsData.InfrastructureContract);
        const defendingSoldierCount = await getDefendingSoldierCount(nationId, publicClient, contractsData.ForcesContract);
        const defendingTankCount = await getDefendingTankCount(nationId, publicClient, contractsData.ForcesContract);
        const yak9count = await getYak9Count(nationId, publicClient, contractsData.FightersContract);
        const p51MustangCount = await getP51MustangCount(nationId, publicClient, contractsData.FightersContract);
        const f86SabreCount = await getF86SabreCount(nationId, publicClient, contractsData.FightersContract);
        const mig15Count = await getMig15Count(nationId, publicClient, contractsData.FightersContract);
        const f100SuperSabreCount = await getF100SuperSabreCount(nationId, publicClient, contractsData.FightersContract);
        const f35LightningCount = await getF35LightningCount(nationId, publicClient, contractsData.FightersContract);
        const f15EagleCount = await getF15EagleCount(nationId, publicClient, contractsData.FightersContract);
        const su30MkiCount = await getSu30MkiCount(nationId, publicClient, contractsData.FightersContract);
        const f22RaptorCount = await getF22RaptorCount(nationId, publicClient, contractsData.FightersContract);
        const ah1CobraCount = await getAh1CobraCount(nationId, publicClient, contractsData.BombersContract);
        const ah64ApacheCount = await getAh64ApacheCount(nationId, publicClient, contractsData.BombersContract);
        const bristolBlenheimCount = await getBristolBlenheimCount(nationId, publicClient, contractsData.BombersContract);
        const b52MitchellCount = await getB52MitchellCount(nationId, publicClient, contractsData.BombersContract);
        const b17gFlyingFortressCount = await getB17gFlyingFortressCount(nationId, publicClient, contractsData.BombersContract);
        const b52StratofortressCount = await getB52StratofortressCount(nationId, publicClient, contractsData.BombersContract);
        const b2SpiritCount = await getB2SpiritCount(nationId, publicClient, contractsData.BombersContract);
        const b1bLancerCount = await getB1bLancerCount(nationId, publicClient, contractsData.BombersContract);
        const tupolevTu160Count = await getTupolevTu160Count(nationId, publicClient, contractsData.BombersContract);
        const corvetteCount = await getCorvetteCount(nationId, publicClient, contractsData.NavyContract);
        const landingShipCount = await getLandingShipCount(nationId, publicClient, contractsData.NavyContract);
        const battleshipCount = await getBattleshipCount(nationId, publicClient, contractsData.NavyContract);
        const cruiserCount = await getCruiserCount(nationId, publicClient, contractsData.NavyContract);
        const frigateCount = await getFrigateCount(nationId, publicClient, contractsData.NavyContract2);
        const destroyerCount = await getDestroyerCount(nationId, publicClient, contractsData.NavyContract2);
        const submarineCount = await getSubmarineCount(nationId, publicClient, contractsData.NavyContract2);
        const aircraftCarrierCount = await getAircraftCarrierCount(nationId, publicClient, contractsData.NavyContract2);
        const cruiseMissileCount = await getCruiseMissileCount(nationId, publicClient, contractsData.MissilesContract);
        const spyCount = await getSpyCount(nationId, publicClient, contractsData.SpyContract);
        const nukeCount = await getNukeCount(nationId, publicClient, contractsData.MissilesContract);

        console.log("Selected nation", nationId);
        setSelectedNationId(nationId);

        setSelectedNationForces({
            strength: nationStrength.toString(),
            balance: Math.floor((Number(nationBalance)/10**18)),
            technology: technologyCount.toString(),
            defendingSoldiers: defendingSoldierCount.toString(),
            defendingTanks: defendingTankCount.toString(),
            yak9: yak9count.toString(),
            p51Mustang: p51MustangCount.toString(),
            f86Sabre: f86SabreCount.toString(),
            mig15: mig15Count.toString(),
            f100SuperSabre: f100SuperSabreCount.toString(),
            f35Lightning: f35LightningCount.toString(),
            f15Eagle: f15EagleCount.toString(),
            su30Mki: su30MkiCount.toString(),
            f22Raptor: f22RaptorCount.toString(),
            ah1Cobra: ah1CobraCount.toString(),
            ah64Apache: ah64ApacheCount.toString(),
            bristolBlenheim: bristolBlenheimCount.toString(),
            b52Mitchell: b52MitchellCount.toString(),
            b17gFlyingFortress: b17gFlyingFortressCount.toString(),
            b52Stratofortress: b52StratofortressCount.toString(),
            b2Spirit: b2SpiritCount.toString(),
            b1bLancer: b1bLancerCount.toString(),
            tupolevTu160: tupolevTu160Count.toString(),
            corvette: corvetteCount.toString(),
            landingShip: landingShipCount.toString(),
            battleship: battleshipCount.toString(),
            cruiser: cruiserCount.toString(),
            frigate: frigateCount.toString(),
            destroyer: destroyerCount.toString(),
            submarine: submarineCount.toString(),
            aircraftCarrier: aircraftCarrierCount.toString(),
            cruiseMissiles: cruiseMissileCount.toString(),
            spies: spyCount.toString(),
            nukes: nukeCount.toString()
        });
    };

    const setDefendingNationDetails = async (nationId: string) => {
        const nationStrength = await getNationStrength(nationId, publicClient, contractsData.NationStrengthContract);
        const nationBalance = await checkBalance(nationId, publicClient, contractsData.TreasuryContract);
        const technologyCount = await getTechnologyCount(nationId, publicClient, contractsData.InfrastructureContract);
        const defendingSoldierCount = await getDefendingSoldierCount(nationId, publicClient, contractsData.ForcesContract);
        const defendingTankCount = await getDefendingTankCount(nationId, publicClient, contractsData.ForcesContract);
        const yak9Count = await getYak9Count(nationId, publicClient, contractsData.FightersContract);
        const p51MustangCount = await getP51MustangCount(nationId, publicClient, contractsData.FightersContract);
        const f86SabreCount = await getF86SabreCount(nationId, publicClient, contractsData.FightersContract);
        const mig15Count = await getMig15Count(nationId, publicClient, contractsData.FightersContract);
        const f100SuperSabreCount = await getF100SuperSabreCount(nationId, publicClient, contractsData.FightersContract);
        const f35LightningCount = await getF35LightningCount(nationId, publicClient, contractsData.FightersContract);
        const f15EagleCount = await getF15EagleCount(nationId, publicClient, contractsData.FightersContract);
        const su30MkiCount = await getSu30MkiCount(nationId, publicClient, contractsData.FightersContract);
        const f22RaptorCount = await getF22RaptorCount(nationId, publicClient, contractsData.FightersContract);
        const ah1CobraCount = await getAh1CobraCount(nationId, publicClient, contractsData.BombersContract);
        const ah64ApacheCount = await getAh64ApacheCount(nationId, publicClient, contractsData.BombersContract);
        const bristolBlenheimCount = await getBristolBlenheimCount(nationId, publicClient, contractsData.BombersContract);
        const b52MitchellCount = await getB52MitchellCount(nationId, publicClient, contractsData.BombersContract);
        const b17gFlyingFortressCount = await getB17gFlyingFortressCount(nationId, publicClient, contractsData.BombersContract);
        const b52StratofortressCount = await getB52StratofortressCount(nationId, publicClient, contractsData.BombersContract);
        const b2SpiritCount = await getB2SpiritCount(nationId, publicClient, contractsData.BombersContract);
        const b1bLancerCount = await getB1bLancerCount(nationId, publicClient, contractsData.BombersContract);
        const tupolevTu160Count = await getTupolevTu160Count(nationId, publicClient, contractsData.BombersContract);
        const corvetteCount = await getCorvetteCount(nationId, publicClient, contractsData.NavyContract);
        const landingShipCount = await getLandingShipCount(nationId, publicClient, contractsData.NavyContract);
        const battleshipCount = await getBattleshipCount(nationId, publicClient, contractsData.NavyContract);
        const cruiserCount = await getCruiserCount(nationId, publicClient, contractsData.NavyContract);
        const frigateCount = await getFrigateCount(nationId, publicClient, contractsData.NavyContract2);
        const destroyerCount = await getDestroyerCount(nationId, publicClient, contractsData.NavyContract2);
        const submarineCount = await getSubmarineCount(nationId, publicClient, contractsData.NavyContract2);
        const aircraftCarrierCount = await getAircraftCarrierCount(nationId, publicClient, contractsData.NavyContract2);
        const cruiseMissileCount = await getCruiseMissileCount(nationId, publicClient, contractsData.MissilesContract);
        const spyCount = await getSpyCount(nationId, publicClient, contractsData.SpyContract);
        const nukeCount = await getNukeCount(nationId, publicClient, contractsData.MissilesContract);

        console.log("Defending nation", nationId);
        setDefendingNationId(nationId);

        setDefendingNationForces({
            strength: nationStrength.toString(),
            balance: Math.floor((Number(nationBalance)/10**18)),
            technology: technologyCount.toString(),
            defendingSoldiers: defendingSoldierCount.toString(),
            defendingTanks: defendingTankCount.toString(),
            yak9: yak9Count.toString(),
            p51Mustang: p51MustangCount.toString(),
            f86Sabre: f86SabreCount.toString(),
            mig15: mig15Count.toString(),
            f100SuperSabre: f100SuperSabreCount.toString(),
            f35Lightning: f35LightningCount.toString(),
            f15Eagle: f15EagleCount.toString(),
            su30Mki: su30MkiCount.toString(),
            f22Raptor: f22RaptorCount.toString(),
            ah1Cobra: ah1CobraCount.toString(),
            ah64Apache: ah64ApacheCount.toString(),
            bristolBlenheim: bristolBlenheimCount.toString(),
            b52Mitchell: b52MitchellCount.toString(),
            b17gFlyingFortress: b17gFlyingFortressCount.toString(),
            b52Stratofortress: b52StratofortressCount.toString(),
            b2Spirit: b2SpiritCount.toString(),
            b1bLancer: b1bLancerCount.toString(),
            tupolevTu160: tupolevTu160Count.toString(),
            corvette: corvetteCount.toString(),
            landingShip: landingShipCount.toString(),
            battleship: battleshipCount.toString(),
            cruiser: cruiserCount.toString(),
            frigate: frigateCount.toString(),
            destroyer: destroyerCount.toString(),
            submarine: submarineCount.toString(),
            aircraftCarrier: aircraftCarrierCount.toString(),
            cruiseMissiles: cruiseMissileCount.toString(),
            spies: spyCount.toString(),
            nukes: nukeCount.toString()
        });
    };

    const handleDeployForces = async () => {
        await deployForcesToWar(selectedNationId, selectedWar.toString(), soldiersToDeploy, tanksToDeploy, contractsData.WarContract, writeContractAsync);
    };

    const handleGroundAttack = async (warId: string, offenseId: string, defenseId: string, attackType: string) => {
        await groundAttack(warId.toString(), offenseId, defenseId, attackType, contractsData.GroundBattleContract, writeContractAsync);
    };

    const handleBlockade = async (offenseId: string, defenseId: string, warId: string, blockadeContract: any) => {
        await blockade(offenseId, defenseId, warId.toString(), blockadeContract, writeContractAsync);
    }

    const handleBreakBlockade = async (warId: string, offenseId: string, defenseId: string, breakBlockadeContract: any) => {
        await writeContractAsync({
            abi: breakBlockadeContract.abi,
            address: breakBlockadeContract.address,
            functionName: "breakBlockade",
            args: [warId, offenseId, defenseId],
        });
    }

    const handleNavalAttack = async (warId: string, offenseId: string, defenseId: string, navalAttackContract: any) => {
        await writeContractAsync({
            abi: navalAttackContract.abi,
            address: navalAttackContract.address,
            functionName: "navalAttack",
            args: [warId, offenseId, defenseId],
        });
    }

    const handleSpyAttack = async (offenseId: string, defenseId: string, attackType: any) => {
        const signature = await signMessageAsync({ message: "Spy Attack" });
        const hash = utils.hashMessage("Spy Attack")
        const inputData = {
            signature,
            messageHash: hash,
            callerNationId: Number(offenseId),
            defenderNationId: Number(defenseId),
            attackType: attackType
        }
        await relaySpyOperation(inputData)
    }

    return (
        <div>
            <h1>Manage Wars</h1>

            {Array.isArray(activeWars) && activeWars.length > 0 && (
                <div>
                    <h2>Active Wars:</h2>
                    <ul>
                        {activeWars.map((warId) => (
                            <li key={warId} onClick={() => handleWarClick(warDetails[warId][0], warDetails[warId][1], warId)} style={{ cursor: 'pointer' }}>
                                War ID: {warId}
                                {warDetails[warId] && (
                                    <div>
                                        <p>Offense Nation: Nation {warDetails[warId][0]}</p>
                                        <p>Defense Nation: Nation {warDetails[warId][1]}</p>
                                        <p>War Active: {warDetails[warId][2] ? "Yes" : "No"}</p>
                                        <p>Day Started: {warDetails[warId][3]}</p>
                                        <p>Offense Peace Offered: {warDetails[warId][5] ? "Yes" : "No"}</p>
                                        <p>Defense Peace Offered: {warDetails[warId][6] ? "Yes" : "No"}</p>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedNationId && defendingNationId && (
                <div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <button onClick={() => offerPeace(selectedNationId, selectedWar, contractsData.WarContract, writeContractAsync)}>Declare Peace</button>

                        <div>
                            <label>Soldiers to Deploy:</label>
                            <input type="number" value={soldiersToDeploy} onChange={(e) => setSoldiersToDeploy(Number(e.target.value))} />
                        </div>
                        <div>
                            <label>Tanks to Deploy:</label>
                            <input type="number" value={tanksToDeploy} onChange={(e) => setTanksToDeploy(Number(e.target.value))} />
                        </div>
                        <button onClick={handleDeployForces}>Deploy Forces</button>
                        <div>
                            <label>Attack Type</label>
                            <input type="number" value={attackType} onChange={(e) => setAttackType(Number(e.target.value))}/>
                        </div>
                        <button onClick={() => handleGroundAttack(selectedWar, selectedNationId, defendingNationId, attackType.toString())}>Ground Attack</button>
                        <button onClick={() => airStrike(selectedNationId, defendingNationId, contractsData.WarContract, writeContractAsync)}>Air Strike</button>
                        <button onClick={() => handleNavalAttack(selectedWar, selectedNationId, defendingNationId, contractsData.NavalAttackContract)}>Naval Attack</button>
                        <button onClick={() => handleBlockade(selectedNationId, defendingNationId, selectedWar, contractsData.NavalBlockadeContract)}>Blockade</button>
                        <button onClick={() => handleBreakBlockade(selectedWar.toString(), selectedNationId, defendingNationId, contractsData.BreakBlocadeContract)}>Break Blockade</button>
                        <button onClick={() => launchCruiseMissile(selectedNationId, defendingNationId, contractsData.WarContract, writeContractAsync)}>Launch Cruise Missile</button>
                        <button onClick={() => launchNuke(selectedNationId, defendingNationId, contractsData.WarContract, writeContractAsync)}>Nuke</button>
                        <div>
                            <label>Attack Type</label>
                            <input type="number" value={spyAttackType} onChange={(e) => setSpyAttackType(Number(e.target.value))}/>
                        </div>
                        <button onClick={() => handleSpyAttack(selectedNationId, defendingNationId, spyAttackType)}>Spy Attack</button>
                    </div>

                    <h3>Nation Details</h3>
                    <p>Selected Nation ID: {selectedNationId}</p>
                    <p>Defending Nation ID: {defendingNationId}</p>
                </div>
            )}

            <button onClick={handleDeclareWar} style={{ margin: "10px", padding: "10px", fontSize: "16px" }}>Declare War</button>

            <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
                <select onChange={(e) => setSelectedNationId(e.target.value)} value={selectedNationId}>
                    <option value="">Select Nation</option>
                    {mintedNations.map((nation) => (
                        <option key={nation.id} value={nation.id}>{nation.name}</option>
                    ))}
                </select>

                <select onChange={(e) => setDefendingNationId(e.target.value)} value={defendingNationId}>
                    <option value="">Select Target Nation</option>
                    {mintedNations.map((nation) => (
                        <option key={nation.id} value={nation.id}>{nation.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ManageWars;

