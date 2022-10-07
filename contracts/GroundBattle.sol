//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./War.sol";
import "./Infrastructure.sol";
import "./Forces.sol";
import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract GroundBattleContract is Ownable, VRFConsumerBaseV2 {
    uint256 groundBattleId;
    address warAddress;
    address infrastructure;
    address forces;
    address treasury;
    uint256 soldierStrength = 1;
    uint256 tankStrength = 17;

    WarContract war;
    InfrastructureContract inf;
    ForcesContract force;
    TreasuryContract tsy;

    struct GroundForcesToBattle {
        uint256 attackType;
        uint256 soldierCount;
        uint256 tankCount;
        uint256 strength;
        uint256 countryId;
        uint256 warId;
    }

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

    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;

    constructor(
        address _warAddress,
        address _infrastructure,
        address _forces,
        address _treasury,
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        warAddress = _warAddress;
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        forces = _forces;
        force = ForcesContract(_forces);
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function groundAttack(
        uint256 warId,
        uint256 attackerId,
        uint256 defenderId,
        uint256 attackType
    ) internal {
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
        generateAttackerForcesStruct(
            warId,
            groundBattleId,
            attackerId,
            attackType
        );
        generateDefenderForcesStruct(warId, groundBattleId, defenderId);
        fulfillRequest(groundBattleId);
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
        //need efficiency modifier
        uint256 attackerForcesStrength = (soldiersDeployed +
            (17 * tanksDeployed));
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

    function generateDefenderForcesStruct(
        uint256 warId,
        uint256 battleId,
        uint256 defenderId
    ) internal {
        (uint256 soldiersDeployed, uint256 tanksDeployed) = war
            .getDeployedGroundForces(warId, defenderId);
        uint256 attackerForcesStrength = (soldiersDeployed +
            (17 * tanksDeployed));
        GroundForcesToBattle memory newGroundForces = GroundForcesToBattle(
            0,
            soldiersDeployed,
            tanksDeployed,
            attackerForcesStrength,
            defenderId,
            warId
        );
        groundBattleIdToAttackerForces[battleId] = newGroundForces;
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
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        s_randomWords = randomWords;
        uint256 attackerStrength = groundBattleIdToAttackerForces[requestNumber]
            .strength;
        uint256 defenderStrength = groundBattleIdToDefenderForces[requestNumber]
            .strength;
        uint256 cumulativeStrength = (attackerStrength + defenderStrength);
        uint256 randomNumberForOutcomeSelection = (s_randomWords[0] %
            cumulativeStrength);
        uint256 attackerSoldierLosses;
        uint256 attackerTankLosses;
        uint256 defenderSoldierLosses;
        uint256 defenderTankLosses;
        uint256 attackerId = groundBattleIdToAttackerForces[requestNumber].countryId;
        uint256 defenderId = groundBattleIdToDefenderForces[requestNumber].countryId;
        uint256 warId = groundBattleIdToAttackerForces[requestNumber].warId;
        if (randomNumberForOutcomeSelection <= attackerStrength) {
            (
            attackerSoldierLosses,
            attackerTankLosses,
            defenderSoldierLosses,
            defenderTankLosses
            )= attackVictory(requestNumber);
            collectSpoils(requestNumber, attackerId);
        } else if (randomNumberForOutcomeSelection > attackerStrength) {
            (
            attackerSoldierLosses,
            attackerTankLosses,
            defenderSoldierLosses,
            defenderTankLosses
            )= defenseVictory(requestNumber);
        }
        war.decreaseGroundBattleLosses(attackerSoldierLosses, attackerTankLosses, attackerId, warId);
        force.decreaseDeployedUnits(attackerSoldierLosses, attackerTankLosses, attackerId);
        force.decreaseDefendingUnits(defenderSoldierLosses, defenderTankLosses, defenderId);
    }

    function getPercentageLosses(uint256 battleId)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        uint256[] memory randomWords = s_requestIndexToRandomWords[battleId];
        uint256 outcomeModifierForWinnerSoldiers = randomWords[1];
        uint256 outcomeModifierForWinnerTanks = randomWords[2];
        uint256 winnerSoldierLossesPercentage;
        uint256 winnerTankLossesPercentage;
        (uint256 loserSoldierLossesPercentage,
        uint256 loserTankLossesPercentage) = getLoserPercentageLosses(battleId);
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
        return (
            winnerSoldierLossesPercentage,
            winnerTankLossesPercentage,
            loserSoldierLossesPercentage,
            loserTankLossesPercentage
        );
    }

    function getLoserPercentageLosses(uint256 battleId)
        public
        view
        returns (
            uint256,
            uint256
        )
    {
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
        return (
            loserSoldierLossesPercentage,
            loserTankLossesPercentage
        );
    }

    function attackVictory(uint256 battleId)
        internal
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
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
        uint256 attackerSoldierLosses = attackerSoldiers *
            winnerSoldierLossesPercentage;
        uint256 attackerTankLosses = attackerTanks * winnerTankLossesPercentage;
        uint256 defenderSoldierLosses = defenderSoldiers *
            loserSoldierLossesPercentage;
        uint256 defenderTankLosses = defenderTanks * loserTankLossesPercentage;
        return (
            attackerSoldierLosses,
            attackerTankLosses,
            defenderSoldierLosses,
            defenderTankLosses
        );
    }

    function defenseVictory(uint256 battleId)
        internal
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
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
        uint256 attackerSoldierLosses = attackerSoldiers *
            loserSoldierLossesPercentage;
        uint256 attackerTankLosses = attackerTanks * loserTankLossesPercentage;
        uint256 defenderSoldierLosses = defenderSoldiers *
            winnerSoldierLossesPercentage;
        uint256 defenderTankLosses = defenderTanks * winnerTankLossesPercentage;
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
        uint256 randomTechLevels;
        uint256 attackType = groundBattleIdToAttackerForces[battleId].attackType;
        if (attackType == 1) {
            randomBalancePercentage = (0 + (randomWords[5] % 10));
            randomLandMiles = (0 + (randomWords[6] % 3));
            randomTechLevels = (0 + (randomWords[7]) % 3);
        } else if (attackType == 2) {
            randomBalancePercentage = (5 + (randomWords[5] % 10));
            randomLandMiles = (2 + (randomWords[6] % 5));
            randomTechLevels = (2 + (randomWords[7]) % 3);
        } else if (attackType == 3) {
            randomBalancePercentage = (10 + (randomWords[5] % 15));
            randomLandMiles = (5 + (randomWords[6] % 5));
            randomTechLevels = (3 + (randomWords[7]) % 4);
        } else if (attackType == 4) {
            randomBalancePercentage = (10 + (randomWords[5] % 20));
            randomLandMiles = (7 + (randomWords[6] % 5));
            randomTechLevels = (5 + (randomWords[7]) % 4);
        }
        tsy.transferSpoils(randomBalancePercentage, attackerId, defenderId);
        inf.transferLandAndTech(randomLandMiles, randomTechLevels, attackerId, defenderId);
    }
}
