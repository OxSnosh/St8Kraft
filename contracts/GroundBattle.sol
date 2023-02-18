//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "./War.sol";
import "./Infrastructure.sol";
import "./Forces.sol";
import "./Treasury.sol";
import "./Improvements.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "hardhat/console.sol";

///@title GroundBattleContract
///@author OxSnosh
///@dev this contract inherits from the openzeppelin ownable contract
///@dev this contract inherits from the chainlink vrf contract
contract GroundBattleContract is Ownable, VRFConsumerBaseV2 {
    uint256 groundBattleId;
    address warAddress;
    address infrastructure;
    address forces;
    address treasury;
    address improvements2;
    address improvements3;
    address wonders3;
    address wonders4;
    address countryMinter;

    uint256[] public todaysGroundBattles;

    WarContract war;
    InfrastructureContract inf;
    ForcesContract force;
    TreasuryContract tsy;
    ImprovementsContract2 imp2;
    ImprovementsContract3 imp3;
    WondersContract3 won3;
    WondersContract4 won4;
    CountryMinter mint;

    struct GroundForcesToBattle {
        uint256 attackType;
        uint256 soldierCount;
        uint256 tankCount;
        uint256 strength;
        uint256 countryId;
        uint256 warId;
    }

    struct BattleResults {
        uint256 nationId;
        uint256 soldierLosses;
        uint256 tankLosses;
        uint256 defenderId;
        uint256 defenderSoldierLosses;
        uint256 defenderTankLosses;
    }

    // struct GroundBattleCasualties {
    //     uint256 soldierCasualties;
    //     uint256 tankCasualties; 
    // }

    //Chainlik Variables
    uint256[] private s_randomWords;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 10;

    mapping(uint256 => GroundForcesToBattle) groundBattleIdToAttackerForces;
    mapping(uint256 => GroundForcesToBattle) groundBattleIdToDefenderForces;

    mapping(uint256 => BattleResults) groundBattleIdToBattleAttackerResults;
    mapping(uint256 => BattleResults) groundBattleIdToBattleDefenderResults;
    mapping(uint256 => bool) groundBattleIdToAtackerVictory;

    mapping(uint256 => uint256[]) idToRecentBattles;

    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;

    event randomNumbersRequested(uint256 indexed requestId);
    event randomNumbersFulfilled(
        uint256 indexed randomResource1,
        uint256 indexed randomResource2
    );
    event battleResults(
        uint256 indexed battleId,
        uint256 attackSolderLosses,
        uint256 attackTankLosses,
        uint256 defenderSoldierLosses,
        uint256 defenderTankLosses
    );

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function settings(
        address _warAddress,
        address _infrastructure,
        address _forces,
        address _treasury,
        address _countryMinter
    ) public onlyOwner {
        warAddress = _warAddress;
        war = WarContract(_warAddress);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        forces = _forces;
        force = ForcesContract(_forces);
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
    }

    function settings2(
        address _improvements2,
        address _improvements3,
        address _wonders3,
        address _wonders4
    ) public onlyOwner {
        improvements2 = _improvements2;
        imp2 = ImprovementsContract2(_improvements2);
        improvements3 = _improvements3;
        imp3 = ImprovementsContract3(_improvements3);
        wonders3 = _wonders3;
        won3 = WondersContract3(_wonders3);
        wonders4 = _wonders4;
        won4 = WondersContract4(_wonders4);
    }

    function updateWarContract(address newAddress) public onlyOwner {
        warAddress = newAddress;
        war = WarContract(newAddress);
    }

    function updateInfrastructureContract(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    function updateForcesContract(address newAddress) public onlyOwner {
        forces = newAddress;
        force = ForcesContract(newAddress);
    }

    function updateTreasuryContract(address newAddress) public onlyOwner {
        treasury = newAddress;
        tsy = TreasuryContract(newAddress);
    }

    function updateImprovemetsContract2(address newAddress) public onlyOwner {
        improvements2 = newAddress;
        imp2 = ImprovementsContract2(newAddress);
    }

    function updateImprovemetsContract3(address newAddress) public onlyOwner {
        improvements3 = newAddress;
        imp3 = ImprovementsContract3(newAddress);
    }

    function updateWondersContract3(address newAddress) public onlyOwner {
        wonders3 = newAddress;
        won3 = WondersContract3(newAddress);
    }

    function updateWondersContract4(address newAddress) public onlyOwner {
        wonders4 = newAddress;
        won4 = WondersContract4(newAddress);
    }

    function battleOdds(
        uint256 _warId,
        uint256 attackerId
    ) public view returns (uint256 attackerOdds, uint256 defenderOdds) {
        (uint256 warOffense, uint256 warDefense) = war.getInvolvedParties(
            _warId
        );
        uint256 attackerStrength;
        uint256 defenderStrength;
        uint256 attackerOddsOfVictory;
        uint256 defenderOddsOfVictory;
        if (attackerId == warOffense) {
            attackerStrength = getAttackerForcesStrength(warOffense, _warId);
            defenderStrength = getDefenderForcesStrength(warDefense, _warId);
            attackerOddsOfVictory = ((attackerStrength * 100) /
                (attackerStrength + defenderStrength));
            defenderOddsOfVictory = ((defenderStrength * 100) /
                (attackerStrength + defenderStrength));
        } else if (attackerId == warDefense) {
            attackerStrength = getAttackerForcesStrength(warDefense, _warId);
            defenderStrength = getDefenderForcesStrength(warOffense, _warId);
            attackerOddsOfVictory = ((attackerStrength * 100) /
                (attackerStrength + defenderStrength));
            defenderOddsOfVictory = ((defenderStrength * 100) /
                (attackerStrength + defenderStrength));
        }
        return (attackerOddsOfVictory, defenderOddsOfVictory);
    }

    ///@dev this is a public function callable only from a nation owner
    ///@dev this contract allows nations at war to launch a ground attack against each other
    ///@notice this contract allows nations at war to launch a ground attack against each other
    ///@param warId is the war id of the war between the 2 nations in the battle
    ///@param attackerId is the nation id of the attacking nation
    ///@param defenderId is the nation id of the defending nation
    ///@param attackType 1. planned 2. standard 3. aggressive 4. bezerk
    function groundAttack(
        uint256 warId,
        uint256 attackerId,
        uint256 defenderId,
        uint256 attackType
    ) public {
        bool isOwner = mint.checkOwnership(attackerId, msg.sender);
        require(isOwner, "!nation owner");
        bool isActiveWar = war.isWarActive(warId);
        require(isActiveWar, "!not active war");
        (uint256 warOffense, uint256 warDefense) = war.getInvolvedParties(
            warId
        );
        require(
            warOffense == attackerId || warOffense == defenderId,
            "invalid parameters"
        );
        require(
            warDefense == attackerId || warDefense == defenderId,
            "invalid parameters"
        );
        require(
            attackType == 1 ||
                attackType == 2 ||
                attackType == 3 ||
                attackType == 4,
            "invalid attack type"
        );
        generateAttackerForcesStruct(
            warId,
            groundBattleId,
            attackerId,
            attackType
        );
        generateDefenderForcesStruct(warId, groundBattleId, defenderId);
        // fulfillRequest(groundBattleId);
        todaysGroundBattles.push(groundBattleId);
        groundBattleId++;
    }

    function generateAttackerForcesStruct(
        uint256 warId,
        uint256 battleId,
        uint256 attackerId,
        uint256 attackType
    ) internal {
        (uint256 soldiersDeployed, uint256 tanksDeployed) = war
            .getDeployedGroundForces(warId, attackerId);
        uint256 attackerForcesStrength = getAttackerForcesStrength(
            attackerId,
            warId
        );
        GroundForcesToBattle memory newGroundForces = GroundForcesToBattle(
            attackType,
            soldiersDeployed,
            tanksDeployed,
            attackerForcesStrength,
            attackerId,
            warId
        );
        groundBattleIdToAttackerForces[battleId] = newGroundForces;
    }

    function returnAttackerForcesStruct(
        uint256 battleId
    )
        public
        view
        returns (uint256, uint256, uint256, uint256, uint256, uint256)
    {
        uint256 attackType = groundBattleIdToAttackerForces[battleId]
            .attackType;
        uint256 soldiersDeployed = groundBattleIdToAttackerForces[battleId]
            .soldierCount;
        uint256 tanksDeployed = groundBattleIdToAttackerForces[battleId]
            .tankCount;
        uint256 attackerForcesStrength = groundBattleIdToAttackerForces[
            battleId
        ].strength;
        uint256 attackerId = groundBattleIdToAttackerForces[battleId].countryId;
        uint256 warId = groundBattleIdToAttackerForces[battleId].warId;
        return (
            attackType,
            soldiersDeployed,
            tanksDeployed,
            attackerForcesStrength,
            attackerId,
            warId
        );
    }

    function generateDefenderForcesStruct(
        uint256 warId,
        uint256 battleId,
        uint256 defenderId
    ) internal {
        uint256 soldiers = force.getDefendingSoldierCount(defenderId);
        uint256 tanks = force.getDefendingTankCount(defenderId);
        uint256 defenderForcesStrength = getDefenderForcesStrength(
            defenderId,
            battleId
        );
        GroundForcesToBattle memory newGroundForces = GroundForcesToBattle(
            0,
            soldiers,
            tanks,
            defenderForcesStrength,
            defenderId,
            warId
        );
        groundBattleIdToDefenderForces[battleId] = newGroundForces;
    }

    function returnDefenderForcesStruct(
        uint256 battleId
    ) public view returns (uint256, uint256, uint256, uint256, uint256) {
        uint256 soldiersDefending = groundBattleIdToDefenderForces[battleId]
            .soldierCount;
        uint256 tanksDefending = groundBattleIdToDefenderForces[battleId]
            .tankCount;
        uint256 defendingForcesStrength = groundBattleIdToDefenderForces[
            battleId
        ].strength;
        uint256 defenderId = groundBattleIdToDefenderForces[battleId].countryId;
        uint256 warId = groundBattleIdToDefenderForces[battleId].warId;
        return (
            soldiersDefending,
            tanksDefending,
            defendingForcesStrength,
            defenderId,
            warId
        );
    }

    function getAttackerForcesStrength(
        uint256 attackerId,
        uint256 warId
    ) public view returns (uint256) {
        (, uint256 tanksDeployed) = war.getDeployedGroundForces(
            warId,
            attackerId
        );
        uint256 soldierEfficiency = getAttackingSoldierEfficiency(
            attackerId,
            warId
        );
        uint256 strength = (soldierEfficiency + (15 * tanksDeployed));
        uint256 mod = 100;
        bool pentagon = won3.getPentagon(attackerId);
        if (pentagon) {
            mod += 20;
        }
        bool logisticalSupport = won4.getSuperiorLogisticalSupport(attackerId);
        if (logisticalSupport) {
            mod += 10;
        }
        strength = ((strength * mod) / 100);
        return strength;
    }

    function getAttackingSoldierEfficiency(
        uint256 attackerId,
        uint256 _warId
    ) public view returns (uint256) {
        (uint256 attackingSoldiers, ) = war.getDeployedGroundForces(
            _warId,
            attackerId
        );
        uint256 attackingEfficiencyModifier = force
            .getDefendingSoldierEfficiencyModifier(attackerId);
        uint256 attackingSoldierEfficiency = ((attackingSoldiers *
            attackingEfficiencyModifier) / 100);
        return attackingSoldierEfficiency;
    }

    function getDefenderForcesStrength(
        uint256 defenderId,
        uint256 _warId
    ) public view returns (uint256) {
        uint256 soldierEfficiency = getDefendingSoldierEfficiency(defenderId);
        uint256 tanks = force.getDefendingTankCount(defenderId);
        uint256 strength = ((soldierEfficiency) + (17 * tanks));
        (uint256 warOffense, uint256 warDefense) = war.getInvolvedParties(
            _warId
        );
        uint256 attackerId;
        if (defenderId == warOffense) {
            attackerId = warDefense;
        } else if (defenderId == warDefense) {
            attackerId = warOffense;
        }
        uint256 officeOfPropagandaCount = imp3.getOfficeOfPropagandaCount(
            attackerId
        );
        bool pentagon = won3.getPentagon(defenderId);
        bool logisticalSupport = won4.getSuperiorLogisticalSupport(defenderId);
        uint256 mod = 100;
        if (officeOfPropagandaCount > 0) {
            mod -= (5 * officeOfPropagandaCount);
        }
        if (pentagon) {
            mod += 20;
        }
        if (logisticalSupport) {
            mod += 10;
        }
        strength = ((strength * mod) / 100);
        return strength;
    }

    function getDefendingSoldierEfficiency(
        uint256 id
    ) public view returns (uint256) {
        uint256 defendingSoldiers = force.getDefendingSoldierCount(id);
        uint256 defendingEfficiencyModifier = force
            .getDefendingSoldierEfficiencyModifier(id);
        uint256 defendingSoldierEfficiency = ((defendingSoldiers *
            defendingEfficiencyModifier) / 100);
        return defendingSoldierEfficiency;
    }

    function fulfillRequest(uint256 battleId) public {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToRequestIndex[requestId] = battleId;
        emit randomNumbersRequested(requestId);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        uint256 attackerStrength = groundBattleIdToAttackerForces[requestNumber]
            .strength;
        uint256 defenderStrength = groundBattleIdToDefenderForces[requestNumber]
            .strength;
        uint256 randomNumberForOutcomeSelection = (randomWords[0] %
            (attackerStrength + defenderStrength));
        uint256 attackerSoldierLosses;
        uint256 attackerTankLosses;
        uint256 defenderSoldierLosses;
        uint256 defenderTankLosses;
        uint256 attackerId = groundBattleIdToAttackerForces[requestNumber]
            .countryId;
        uint256 defenderId = groundBattleIdToDefenderForces[requestNumber]
            .countryId;
        uint256 warId = groundBattleIdToAttackerForces[requestNumber].warId;
        if (randomNumberForOutcomeSelection <= attackerStrength) {
            (
                attackerSoldierLosses,
                attackerTankLosses,
                defenderSoldierLosses,
                defenderTankLosses
            ) = attackVictory(requestNumber);
            collectSpoils(requestNumber, attackerId);
            groundBattleIdToAtackerVictory[requestNumber] = true;
            // console.log("did the results get here?");
        } else if (randomNumberForOutcomeSelection > attackerStrength) {
            (
                attackerSoldierLosses,
                attackerTankLosses,
                defenderSoldierLosses,
                defenderTankLosses
            ) = defenseVictory(requestNumber);
            // console.log(
            //     "soldier losses in battle function defense",
            //     attackerSoldierLosses,
            //     "defender soldier losses defensee",
            //     defenderSoldierLosses
            // );
            groundBattleIdToAtackerVictory[requestNumber] = false;
            // console.log("Request Number 2", requestNumber);
        }
        emit battleResults(
            requestNumber,
            attackerSoldierLosses,
            attackerTankLosses,
            defenderSoldierLosses,
            defenderTankLosses
        );
        // console.log("RESULTS LOGGED", attackerSoldierLosses, defenderSoldierLosses);
        BattleResults memory newBattleAttackerResults = BattleResults(
            attackerId,
            attackerSoldierLosses,
            attackerTankLosses,
            defenderId,
            defenderSoldierLosses,
            defenderTankLosses
        );
        groundBattleIdToBattleAttackerResults[
            requestNumber
        ] = newBattleAttackerResults;
        // BattleResults memory newBattleDefenderResults = BattleResults(
        //     defenderId,
        //     defenderSoldierLosses,
        //     defenderTankLosses
        // );
        // groundBattleIdToBattleDefenderResults[
        //     requestNumber
        // ] = newBattleDefenderResults;
        // completeBattleSequence(
        //     warId,
        //     attackerId,
        //     attackerSoldierLosses,
        //     attackerTankLosses,
        //     defenderId,
        //     defenderSoldierLosses,
        //     defenderTankLosses
        // );
        // console.log("RESULTS LOGGED 2", attackerSoldierLosses, defenderSoldierLosses);
        war.decreaseGroundBattleLosses(
            attackerSoldierLosses,
            attackerTankLosses,
            attackerId,
            warId
        );
        // console.log(
        //     "THIS",
        //     attackerSoldierLosses,
        //     attackerTankLosses,
        //     attackerId
        // );
        // console.log(
        //     "THIS 2",
        //     defenderSoldierLosses,
        //     defenderTankLosses,
        //     defenderId
        // );
        // force.increaseSoldierCasualtiesFromGroundBattle(
        //     attackerSoldierLosses,
        //     attackerId,
        //     defenderSoldierLosses,
        //     defenderId 
        // );
        // idToCasualties[attackerId].soldierCasualties += attackerSoldierLosses;
        // idToCasualties[attackerId].tankCasualties += attackerTankLosses;
        // idToCasualties[defenderId].soldierCasualties += attackerSoldierLosses;
        // idToCasualties[defenderId].tankCasualties += defenderTankLosses;
        // force.decreaseDefendingUnits(
        // );
        force.decreaseDeployedUnits(
            attackerSoldierLosses,
            attackerTankLosses,
            attackerId,
            defenderSoldierLosses,
            defenderTankLosses,
            defenderId
        );
        
        // force.addGroundBattle(requestNumber);
        // completeBattleSequence(requestNumber, warId);
    }

    // function completeBattleSequence(uint256 battleId, uint256 warId) internal {
    //     (
    //         uint256 attackerId,
    //         uint256 attackerSoldierLosses,
    //         uint256 attackerTankLosses,
    //         uint256 defenderId,
    //         uint256 defenderSoldierLosses,
    //         uint256 defenderTankLosses
    //     ) = returnBattleResults(battleId);
    //     // console.log(
    //     //     "THIS",
    //     //     attackerSoldierLosses,
    //     //     attackerTankLosses,
    //     //     attackerId
    //     // );
    //     // console.log(
    //     //     "THIS 2",
    //     //     defenderSoldierLosses,
    //     //     defenderTankLosses,
    //     //     defenderId
    //     // );
    // }

    function returnBattleResults(
        uint256 battleId
    )
        public
        view
        returns (uint256, uint256, uint256, uint256, uint256, uint256)
    {
        uint256 attackerId = groundBattleIdToBattleAttackerResults[battleId]
            .nationId;
        uint256 attackerSoldierLosses = groundBattleIdToBattleAttackerResults[
            battleId
        ].soldierLosses;
        uint256 attackerTankLosses = groundBattleIdToBattleAttackerResults[
            battleId
        ].tankLosses;
        uint256 defenderId = groundBattleIdToBattleAttackerResults[battleId]
            .defenderId;
        uint256 defenderSoldierLosses = groundBattleIdToBattleAttackerResults[
            battleId
        ].defenderSoldierLosses;
        uint256 defenderTankLosses = groundBattleIdToBattleAttackerResults[
            battleId
        ].defenderTankLosses;
        // console.log(attackerSoldierLosses, "attacker losses being returned");
        return (
            attackerId,
            attackerSoldierLosses,
            attackerTankLosses,
            defenderId,
            defenderSoldierLosses,
            defenderTankLosses
        );
    }

    function returnAttackVictorious(
        uint256 battleId
    ) public view returns (bool) {
        bool attackVictorious = groundBattleIdToAtackerVictory[battleId];
        return attackVictorious;
    }

    function getPercentageLosses(
        uint256 battleId
    ) public view returns (uint256, uint256, uint256, uint256) {
        uint256[] memory randomWords = s_requestIndexToRandomWords[battleId];
        uint256 outcomeModifierForWinnerSoldiers = randomWords[1];
        uint256 outcomeModifierForWinnerTanks = randomWords[2];
        uint256 winnerSoldierLossesPercentage;
        uint256 winnerTankLossesPercentage;
        (
            uint256 loserSoldierLossesPercentage,
            uint256 loserTankLossesPercentage
        ) = getLoserPercentageLosses(battleId);
        uint256 attackType = groundBattleIdToAttackerForces[battleId]
            .attackType;
        if (attackType == 1) {
            winnerSoldierLossesPercentage = (5 +
                (outcomeModifierForWinnerSoldiers % 10));
            winnerTankLossesPercentage = (5 +
                (outcomeModifierForWinnerTanks % 5));
        } else if (attackType == 2) {
            winnerSoldierLossesPercentage = (10 +
                (outcomeModifierForWinnerSoldiers % 10));
            winnerTankLossesPercentage = (10 +
                (outcomeModifierForWinnerTanks % 5));
        } else if (attackType == 3) {
            winnerSoldierLossesPercentage = (15 +
                (outcomeModifierForWinnerSoldiers % 15));
            winnerTankLossesPercentage = (15 +
                (outcomeModifierForWinnerTanks % 10));
        } else {
            winnerSoldierLossesPercentage = (25 +
                (outcomeModifierForWinnerSoldiers % 15));
            winnerTankLossesPercentage = (25 +
                (outcomeModifierForWinnerTanks % 10));
        }
        console.log(
            "winner soldier loss percentage",
            winnerSoldierLossesPercentage,
            "loser soldier loss percentage",
            loserSoldierLossesPercentage
        );
        return (
            winnerSoldierLossesPercentage,
            winnerTankLossesPercentage,
            loserSoldierLossesPercentage,
            loserTankLossesPercentage
        );
    }

    function getLoserPercentageLosses(
        uint256 battleId
    ) public view returns (uint256, uint256) {
        uint256[] memory randomWords = s_requestIndexToRandomWords[battleId];
        uint256 outcomeModifierForLoserSoldiers = randomWords[3];
        uint256 outcomeModifierForLoserTanks = randomWords[4];
        uint256 loserSoldierLossesPercentage;
        uint256 loserTankLossesPercentage;
        uint256 attackType = groundBattleIdToAttackerForces[battleId]
            .attackType;
        if (attackType == 1) {
            loserSoldierLossesPercentage = (20 +
                (outcomeModifierForLoserSoldiers % 10));
            loserTankLossesPercentage = (20 +
                (outcomeModifierForLoserTanks % 5));
        } else if (attackType == 2) {
            loserSoldierLossesPercentage = (30 +
                (outcomeModifierForLoserSoldiers % 15));
            loserTankLossesPercentage = (30 +
                (outcomeModifierForLoserTanks % 5));
        } else if (attackType == 3) {
            loserSoldierLossesPercentage = (35 +
                (outcomeModifierForLoserSoldiers % 20));
            loserTankLossesPercentage = (35 +
                (outcomeModifierForLoserTanks % 15));
        } else {
            loserSoldierLossesPercentage = (45 +
                (outcomeModifierForLoserSoldiers % 20));
            loserTankLossesPercentage = (45 +
                (outcomeModifierForLoserTanks % 15));
        }
        return (loserSoldierLossesPercentage, loserTankLossesPercentage);
    }

    function attackVictory(
        uint256 battleId
    ) internal view returns (uint256, uint256, uint256, uint256) {
        (
            uint256 winnerSoldierLossesPercentage,
            uint256 winnerTankLossesPercentage,
            uint256 loserSoldierLossesPercentage,
            uint256 loserTankLossesPercentage
        ) = getPercentageLosses(battleId);
        uint256 attackerSoldiers = groundBattleIdToAttackerForces[battleId]
            .soldierCount;
        uint256 attackerTanks = groundBattleIdToAttackerForces[battleId]
            .tankCount;
        uint256 defenderSoldiers = groundBattleIdToDefenderForces[battleId]
            .soldierCount;
        uint256 defenderTanks = groundBattleIdToDefenderForces[battleId]
            .tankCount;
        uint256 defenderSoldierLosses = ((defenderSoldiers *
            loserSoldierLossesPercentage) / 100);
        uint256 defenderTankLosses = ((defenderTanks *
            loserTankLossesPercentage) / 100);
        uint256 attackerSoldierLosses = ((attackerSoldiers *
            winnerSoldierLossesPercentage) / 100);
        uint256 attackerTankLosses = ((attackerTanks *
            winnerTankLossesPercentage) / 100);
        if (attackerSoldierLosses > (defenderSoldierLosses / 2)) {
            attackerSoldierLosses = (defenderSoldierLosses / 2);
        }
        if (attackerTankLosses > (defenderTankLosses / 2)) {
            attackerTankLosses = (defenderTankLosses / 2);
        }
        console.log(
            "attack victory attacker soldier losses",
            attackerSoldierLosses,
            "attack victory defender soldier losses",
            defenderSoldierLosses
        );
        return (
            attackerSoldierLosses,
            attackerTankLosses,
            defenderSoldierLosses,
            defenderTankLosses
        );
    }

    function defenseVictory(
        uint256 battleId
    ) internal view returns (uint256, uint256, uint256, uint256) {
        (
            uint256 winnerSoldierLossesPercentage,
            uint256 winnerTankLossesPercentage,
            uint256 loserSoldierLossesPercentage,
            uint256 loserTankLossesPercentage
        ) = getPercentageLosses(battleId);
        uint256 attackerSoldiers = groundBattleIdToAttackerForces[battleId]
            .soldierCount;
        uint256 attackerTanks = groundBattleIdToAttackerForces[battleId]
            .tankCount;
        uint256 defenderSoldiers = groundBattleIdToDefenderForces[battleId]
            .soldierCount;
        uint256 defenderTanks = groundBattleIdToDefenderForces[battleId]
            .tankCount;
        uint256 attackerSoldierLosses = ((attackerSoldiers *
            loserSoldierLossesPercentage) / 100);
        uint256 attackerTankLosses = ((attackerTanks *
            loserTankLossesPercentage) / 100);
        uint256 defenderSoldierLosses = ((defenderSoldiers *
            winnerSoldierLossesPercentage) / 100);
        uint256 defenderTankLosses = ((defenderTanks *
            winnerTankLossesPercentage) / 100);
        if (defenderSoldierLosses > (attackerSoldierLosses / 2)) {
            defenderSoldierLosses = (attackerSoldierLosses / 2);
        }
        if (defenderTankLosses > (attackerTankLosses / 2)) {
            defenderTankLosses = (attackerTankLosses / 2);
        }
        console.log(
            "defense victory attacker soldier losses",
            attackerSoldierLosses,
            "defense victory defender soldier losses",
            defenderSoldierLosses
        );
        return (
            attackerSoldierLosses,
            attackerTankLosses,
            defenderSoldierLosses,
            defenderTankLosses
        );
    }

    function collectSpoils(uint256 battleId, uint256 attackerId) public {
        uint256 defenderId = groundBattleIdToDefenderForces[battleId].countryId;
        uint256[] memory randomWords = s_requestIndexToRandomWords[battleId];
        uint256 randomBalancePercentage;
        uint256 randomLandMiles;
        uint256 randomInfrastructureMiles;
        uint256 attackType = groundBattleIdToAttackerForces[battleId]
            .attackType;
        uint256 fobCount = imp2.getForwardOperatingBaseCount(attackerId);
        uint256 attackModifier = 0;
        if (fobCount > 0) {
            attackModifier = (2 * fobCount);
        }
        if (attackType == 1) {
            randomBalancePercentage = (0 +
                attackModifier +
                (randomWords[5] % 10));
            randomLandMiles = (1 + fobCount + (randomWords[6] % 2));
            randomInfrastructureMiles = (1 + fobCount + ((randomWords[7]) % 2));
        } else if (attackType == 2) {
            randomBalancePercentage = (5 +
                attackModifier +
                (randomWords[5] % 10));
            randomLandMiles = (2 + fobCount + (randomWords[6] % 2));
            randomInfrastructureMiles = (2 + fobCount + ((randomWords[7]) % 2));
        } else if (attackType == 3) {
            randomBalancePercentage = (10 +
                attackModifier +
                (randomWords[5] % 15));
            randomLandMiles = (3 + fobCount + (randomWords[6] % 3));
            randomInfrastructureMiles = (3 + fobCount + ((randomWords[7]) % 3));
        } else if (attackType == 4) {
            randomBalancePercentage = (10 +
                attackModifier +
                (randomWords[5] % 20));
            randomLandMiles = (4 + fobCount + (randomWords[6] % 3));
            randomInfrastructureMiles = (4 + fobCount + ((randomWords[7]) % 3));
        }
        tsy.transferSpoils(randomBalancePercentage, battleId, attackerId, defenderId);
        inf.transferLandAndInfrastructure(
            randomLandMiles,
            randomInfrastructureMiles,
            attackerId,
            defenderId
        );
    }

    function returnTodaysGroundBattles() public view returns (uint256[] memory) {
        return todaysGroundBattles;
    }
}
