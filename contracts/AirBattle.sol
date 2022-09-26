//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./War.sol";
import "./Fighters.sol";
import "./Bombers.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract AirBattleContract is Ownable, VRFConsumerBaseV2 {
    uint256 airBattleId;
    address warAddress;
    address fighterAddress;
    address bomberAddress;
    //fighter strength
    uint256 yak9Strength = 1;
    uint256 p51MustangStrength = 2;
    uint256 f86SabreStrength = 3;
    uint256 mig15Strength = 4;
    uint256 f100SuperSabreStrength = 5;
    uint256 f35LightningStrength = 6;
    uint256 f15EagleStrength = 7;
    uint256 su30MkiStrength = 8;
    uint256 f22RaptorStrength = 9;
    //bomber strength
    uint256 ah1CobraStrength = 1;
    uint256 ah64ApacheStrength = 2;
    uint256 bristolBlenheimStrength = 3;
    uint256 b52MitchellStrength = 4;
    uint256 b17gFlyingFortressStrength = 5;
    uint256 b52StratofortressStrength = 6;
    uint256 b2SpiritStrength = 7;
    uint256 b1bLancerStrength = 8;
    uint256 tupolevTu160Strength = 9;

    WarContract war;
    FightersContract fighter;
    BombersContract bomber;

    struct FightersToBattle {
        uint256 yak9Count;
        uint256 p51MustangCount;
        uint256 f86SabreCount;
        uint256 mig15Count;
        uint256 f100SuperSabreCount;
        uint256 f35LightningCount;
        uint256 f15EagleCount;
        uint256 su30MkiCount;
        uint256 f22RaptorCount;
        uint256 strength;
        uint256 countryId;
        uint256 warId;
    }

    struct BombersToBattle {
        uint256 ah1CobraCount;
        uint256 ah64ApacheCount;
        uint256 bristolBlenheimCount;
        uint256 b52MitchellCount;
        uint256 b17gFlyingFortressCount;
        uint256 b52StratofortressCount;
        uint256 b2SpiritCount;
        uint256 b1bLancerCount;
        uint256 tupolevTu160Count;
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
    uint32 private constant NUM_WORDS = 1;

    mapping(uint256 => FightersToBattle) airBattleIdToAttackerFighters;
    mapping(uint256 => BombersToBattle) airBattleIdToAttackerBombers;
    mapping(uint256 => uint256[]) airBattleIdToAttackerFighterChanceArray;
    mapping(uint256 => uint256[]) airBattleIdToAttackerFighterTypeArray;
    mapping(uint256 => uint256[]) airBattleIdToAttackerBomberChanceArray;
    mapping(uint256 => uint256[]) airBattleIdToAttackerBomberTypeArray;
    mapping(uint256 => uint256) airBattleIdToAttackerFighterCumulativeOdds;
    mapping(uint256 => uint256) airBattleIdToAttackerBomberCumulativeOdds;

    mapping(uint256 => FightersToBattle) airBattleIdToDefenderFighters;
    mapping(uint256 => BombersToBattle) airBattleIdToDefenderBombers;
    mapping(uint256 => uint256[]) airBattleIdToDefenderFighterChanceArray;
    mapping(uint256 => uint256[]) airBattleIdToDefenderFighterTypeArray;
    mapping(uint256 => uint256[]) airBattleIdToDefenderBomberChanceArray;
    mapping(uint256 => uint256[]) airBattleIdToDefenderBomberTypeArray;
    mapping(uint256 => uint256) airBattleIdToDefenderFighterCumulativeOdds;
    mapping(uint256 => uint256) airBattleIdToDefenderBomberCumulativeOdds;

    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;

    constructor(
        address _warAddress,
        address _fighter,
        address _bomber,
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        warAddress = _warAddress;
        fighterAddress = _fighter;
        fighter = FightersContract(_fighter);
        bomberAddress = _bomber;
        bomber = BombersContract(_bomber);
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function airBattle(
        uint256 warId,
        uint256 attackerId,
        uint256 defenderId
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
        generateAttackerFighterStruct(warId, airBattleId, attackerId);
        generateAttackerBomberStruct(warId, airBattleId, attackerId);
        generateDefenderFighterStruct(warId, airBattleId, defenderId);
        generateDefenderBomberStruct(warId, airBattleId, defenderId);
        generateAttackerFighterChanceArray(airBattleId);
        generateAttackerBomberChanceArray(airBattleId);
        generateDefenderFighterChanceArray(airBattleId);
        generateDefenderBomberChanceArray(airBattleId);
        fulfillRequest(airBattleId);
        airBattleId++;
    }

    function generateAttackerFighterStruct(
        uint256 warId,
        uint256 battleId,
        uint256 attackerId
    ) internal {
        uint256 yak9Count = fighter.getYak9Count(attackerId);
        uint256 p51MustangCount = fighter.getP51MustangCount(attackerId);
        uint256 f86SabreCount = fighter.getF86SabreCount(attackerId);
        uint256 mig15Count = fighter.getMig15Count(attackerId);
        uint256 f100SuperSabreCount = fighter.getF100SuperSabreCount(
            attackerId
        );
        uint256 f35LightningCount = fighter.getF35LightningCount(attackerId);
        uint256 f15EagleCount = fighter.getF15EagleCount(attackerId);
        uint256 su30MkiCount = fighter.getSu30MkiCount(attackerId);
        uint256 f22RaptorCount = fighter.getF22RaptorCount(attackerId);
        uint256 attackerFighterStrength = getAttackerFighterStrength(battleId);
        FightersToBattle memory newFighters = FightersToBattle(
            yak9Count,
            p51MustangCount,
            f86SabreCount,
            mig15Count,
            f100SuperSabreCount,
            f35LightningCount,
            f15EagleCount,
            su30MkiCount,
            f22RaptorCount,
            attackerFighterStrength,
            attackerId,
            warId
        );
        airBattleIdToAttackerFighters[battleId] = newFighters;
    }

    function generateAttackerBomberStruct(
        uint256 warId,
        uint256 battleId,
        uint256 attackerId
    ) internal {
        uint256 ah1CobraCount = bomber.getAh1CobraCount(attackerId);
        uint256 ah64ApacheCount = bomber.getAh64ApacheCount(attackerId);
        uint256 bristolBlenheimCount = bomber.getBristolBlenheimCount(
            attackerId
        );
        uint256 b52MitchellCount = bomber.getB52MitchellCount(attackerId);
        uint256 b17gFlyingFortressCount = bomber.getB17gFlyingFortressCount(
            attackerId
        );
        uint256 b52StratofortressCount = bomber.getB52StratofortressCount(
            attackerId
        );
        uint256 b2SpiritCount = bomber.getB2SpiritCount(attackerId);
        uint256 b1bLancerCount = bomber.getB1bLancer(attackerId);
        uint256 tupolevTu160Count = bomber.getTupolevTu160(attackerId);
        uint256 attackerBomberStrength = getAttackerBomberStrength(battleId);
        BombersToBattle memory newBombers = BombersToBattle(
            ah1CobraCount,
            ah64ApacheCount,
            bristolBlenheimCount,
            b52MitchellCount,
            b17gFlyingFortressCount,
            b52StratofortressCount,
            b2SpiritCount,
            b1bLancerCount,
            tupolevTu160Count,
            attackerBomberStrength,
            attackerId,
            warId
        );
        airBattleIdToAttackerBombers[battleId] = newBombers;
    }

    function generateDefenderFighterStruct(
        uint256 warId,
        uint256 battleId,
        uint256 defenderId
    ) internal {
        uint256 yak9Count = fighter.getYak9Count(defenderId);
        uint256 p51MustangCount = fighter.getP51MustangCount(defenderId);
        uint256 f86SabreCount = fighter.getF86SabreCount(defenderId);
        uint256 mig15Count = fighter.getMig15Count(defenderId);
        uint256 f100SuperSabreCount = fighter.getF100SuperSabreCount(
            defenderId
        );
        uint256 f35LightningCount = fighter.getF35LightningCount(defenderId);
        uint256 f15EagleCount = fighter.getF15EagleCount(defenderId);
        uint256 su30MkiCount = fighter.getSu30MkiCount(defenderId);
        uint256 f22RaptorCount = fighter.getF22RaptorCount(defenderId);
        uint256 defenderFighterStrength = getDefenderFighterStrength(battleId);
        FightersToBattle memory newFighters = FightersToBattle(
            yak9Count,
            p51MustangCount,
            f86SabreCount,
            mig15Count,
            f100SuperSabreCount,
            f35LightningCount,
            f15EagleCount,
            su30MkiCount,
            f22RaptorCount,
            defenderFighterStrength,
            defenderId,
            warId
        );
        airBattleIdToDefenderFighters[battleId] = newFighters;
    }

    function generateDefenderBomberStruct(
        uint256 warId,
        uint256 battleId,
        uint256 defenderId
    ) public {
        uint256 ah1CobraCount = bomber.getAh1CobraCount(defenderId);
        uint256 ah64ApacheCount = bomber.getAh64ApacheCount(defenderId);
        uint256 bristolBlenheimCount = bomber.getBristolBlenheimCount(
            defenderId
        );
        uint256 b52MitchellCount = bomber.getB52MitchellCount(defenderId);
        uint256 b17gFlyingFortressCount = bomber.getB17gFlyingFortressCount(
            defenderId
        );
        uint256 b52StratofortressCount = bomber.getB52StratofortressCount(
            defenderId
        );
        uint256 b2SpiritCount = bomber.getB2SpiritCount(defenderId);
        uint256 b1bLancerCount = bomber.getB1bLancer(defenderId);
        uint256 tupolevTu160Count = bomber.getTupolevTu160(defenderId);
        uint256 defenderBomberStrength = getDefenderBomberStrength(battleId);
        BombersToBattle memory newBombers = BombersToBattle(
            ah1CobraCount,
            ah64ApacheCount,
            bristolBlenheimCount,
            b52MitchellCount,
            b17gFlyingFortressCount,
            b52StratofortressCount,
            b2SpiritCount,
            b1bLancerCount,
            tupolevTu160Count,
            defenderBomberStrength,
            defenderId,
            warId
        );
        airBattleIdToDefenderBombers[battleId] = newBombers;
    }

    function generateAttackerFighterChanceArray(uint256 battleId) internal {
        uint256[] storage chances = airBattleIdToAttackerFighterChanceArray[
            battleId
        ];
        uint256[] storage types = airBattleIdToAttackerFighterTypeArray[
            battleId
        ];
        uint256 cumulativeSum;
        //yak9Count,
        if (airBattleIdToAttackerFighters[battleId].yak9Count > 0) {
            uint256 yak9Odds = ((
                airBattleIdToAttackerFighters[battleId].yak9Count
            ) * (10 - yak9Strength));
            chances.push(yak9Odds);
            types.push(1);
            cumulativeSum = yak9Odds;
        }
        //p51MustangCount,
        if (airBattleIdToAttackerFighters[battleId].p51MustangCount > 0) {
            uint256 p51Odds = ((
                airBattleIdToAttackerFighters[battleId].p51MustangCount
            ) * (10 - p51MustangStrength));
            uint256 p51OddsToPush = (cumulativeSum + p51Odds);
            chances.push(p51OddsToPush);
            types.push(2);
            cumulativeSum = p51OddsToPush;
        }
        //f86SabreCount,
        if (airBattleIdToAttackerFighters[battleId].f86SabreCount > 0) {
            uint256 f86Odds = ((
                airBattleIdToAttackerFighters[battleId].f86SabreCount
            ) * (10 - f86SabreStrength));
            uint256 f86OddsToPush = (cumulativeSum + f86Odds);
            chances.push(f86OddsToPush);
            types.push(3);
            cumulativeSum = f86OddsToPush;
        }
        //mig15Count,
        if (airBattleIdToAttackerFighters[battleId].mig15Count > 0) {
            uint256 mig15Odds = ((
                airBattleIdToAttackerFighters[battleId].mig15Count
            ) * (10 - mig15Strength));
            uint256 mig15OddsToPush = (cumulativeSum + mig15Odds);
            chances.push(mig15OddsToPush);
            types.push(4);
            cumulativeSum = mig15OddsToPush;
        }
        //f100SuperSabreCount,
        if (airBattleIdToAttackerFighters[battleId].f100SuperSabreCount > 0) {
            uint256 f100Odds = ((
                airBattleIdToAttackerFighters[battleId].f100SuperSabreCount
            ) * (10 - f100SuperSabreStrength));
            uint256 f100OddsToPush = (cumulativeSum + f100Odds);
            chances.push(f100OddsToPush);
            types.push(5);
            cumulativeSum = f100OddsToPush;
        }
        //f35LightningCount,
        if (airBattleIdToAttackerFighters[battleId].f35LightningCount > 0) {
            uint256 f35Odds = ((
                airBattleIdToAttackerFighters[battleId].f35LightningCount
            ) * (10 - f35LightningStrength));
            uint256 f35OddsToPush = (cumulativeSum + f35Odds);
            chances.push(f35OddsToPush);
            types.push(6);
            cumulativeSum = f35OddsToPush;
        }
        //f15EagleCount,
        if (airBattleIdToAttackerFighters[battleId].f15EagleCount > 0) {
            uint256 f15Odds = ((
                airBattleIdToAttackerFighters[battleId].f15EagleCount
            ) * (10 - f15EagleStrength));
            uint256 f15OddsToPush = (cumulativeSum + f15Odds);
            chances.push(f15OddsToPush);
            types.push(7);
            cumulativeSum = f15OddsToPush;
        }
        //su30MkiCount,
        if (airBattleIdToAttackerFighters[battleId].su30MkiCount > 0) {
            uint256 su30Odds = ((
                airBattleIdToAttackerFighters[battleId].su30MkiCount
            ) * (10 - su30MkiStrength));
            uint256 su30OddsToPush = (cumulativeSum + su30Odds);
            chances.push(su30OddsToPush);
            types.push(8);
            cumulativeSum = su30OddsToPush;
        }
        //f22RaptorCount,
        if (airBattleIdToAttackerFighters[battleId].f22RaptorCount > 0) {
            uint256 f22Odds = ((
                airBattleIdToAttackerFighters[battleId].f22RaptorCount
            ) * (10 - f22RaptorStrength));
            uint256 f22OddsToPush = (cumulativeSum + f22Odds);
            chances.push(f22OddsToPush);
            types.push(9);
            cumulativeSum = f22OddsToPush;
        }
        airBattleIdToAttackerFighterChanceArray[battleId] = chances;
        airBattleIdToAttackerFighterTypeArray[battleId] = types;
        airBattleIdToAttackerFighterCumulativeOdds[battleId] = cumulativeSum;
    }

    function generateAttackerBomberChanceArray(uint256 battleId) internal {
        uint256[] storage chances = airBattleIdToAttackerBomberChanceArray[
            battleId
        ];
        uint256[] storage types = airBattleIdToAttackerBomberTypeArray[
            battleId
        ];
        uint256 cumulativeSum;
        //ah1CobraCount,
        if (airBattleIdToAttackerBombers[battleId].ah1CobraCount > 0) {
            uint256 ah1Odds = ((
                airBattleIdToAttackerBombers[battleId].ah1CobraCount
            ) * (10 - ah1CobraStrength));
            chances.push(ah1Odds);
            types.push(1);
            cumulativeSum = ah1Odds;
        }
        //ah64ApacheCount,
        if (airBattleIdToAttackerBombers[battleId].ah64ApacheCount > 0) {
            uint256 ah64Odds = ((
                airBattleIdToAttackerBombers[battleId].ah64ApacheCount
            ) * (10 - ah64ApacheStrength));
            uint256 ah64OddsToPush = (cumulativeSum + ah64Odds);
            chances.push(ah64OddsToPush);
            types.push(2);
            cumulativeSum = ah64OddsToPush;
        }
        //bristolBlenheimCount,
        if (airBattleIdToAttackerBombers[battleId].bristolBlenheimCount > 0) {
            uint256 bristolOdds = ((
                airBattleIdToAttackerBombers[battleId].bristolBlenheimCount
            ) * (10 - bristolBlenheimStrength));
            uint256 bristolOddsToPush = (cumulativeSum + bristolOdds);
            chances.push(bristolOddsToPush);
            types.push(3);
            cumulativeSum = bristolOddsToPush;
        }
        //b52MitchellCount,
        if (airBattleIdToAttackerBombers[battleId].b52MitchellCount > 0) {
            uint256 b52MOdds = ((
                airBattleIdToAttackerBombers[battleId].b52MitchellCount
            ) * (10 - b52MitchellStrength));
            uint256 b52MOddsToPush = (cumulativeSum + b52MOdds);
            chances.push(b52MOddsToPush);
            types.push(4);
            cumulativeSum = b52MOddsToPush;
        }
        //b17gFlyingFortressCount,
        if (
            airBattleIdToAttackerBombers[battleId].b17gFlyingFortressCount > 0
        ) {
            uint256 b17Odds = ((
                airBattleIdToAttackerBombers[battleId].b17gFlyingFortressCount
            ) * (10 - b17gFlyingFortressStrength));
            uint256 b17OddsToPush = (cumulativeSum + b17Odds);
            chances.push(b17OddsToPush);
            types.push(5);
            cumulativeSum = b17OddsToPush;
        }
        //b52StratofortressCount,
        if (airBattleIdToAttackerBombers[battleId].b52StratofortressCount > 0) {
            uint256 b52SOdds = ((
                airBattleIdToAttackerBombers[battleId].b52StratofortressCount
            ) * (10 - b52StratofortressStrength));
            uint256 b52SOddsToPush = (cumulativeSum + b52SOdds);
            chances.push(b52SOddsToPush);
            types.push(6);
            cumulativeSum = b52SOddsToPush;
        }
        //b2SpiritCount,
        if (airBattleIdToAttackerBombers[battleId].b2SpiritCount > 0) {
            uint256 b2SOdds = ((
                airBattleIdToAttackerBombers[battleId].b2SpiritCount
            ) * (10 - b2SpiritStrength));
            uint256 b2SOddsToPush = (cumulativeSum + b2SOdds);
            chances.push(b2SOddsToPush);
            types.push(7);
            cumulativeSum = b2SOddsToPush;
        }
        //b1bLancerCount,
        if (airBattleIdToAttackerBombers[battleId].b1bLancerCount > 0) {
            uint256 b1bOdds = ((
                airBattleIdToAttackerBombers[battleId].b1bLancerCount
            ) * (10 - b1bLancerStrength));
            uint256 b1bOddsToPush = (cumulativeSum + b1bOdds);
            chances.push(b1bOddsToPush);
            types.push(8);
            cumulativeSum = b1bOddsToPush;
        }
        //tupolevTu160Count,
        if (airBattleIdToAttackerBombers[battleId].tupolevTu160Count > 0) {
            uint256 tupolevOdds = ((
                airBattleIdToAttackerBombers[battleId].tupolevTu160Count
            ) * (10 - tupolevTu160Strength));
            uint256 tupolevOddsToPush = (cumulativeSum + tupolevOdds);
            chances.push(tupolevOddsToPush);
            types.push(9);
            cumulativeSum = tupolevOddsToPush;
        }
        airBattleIdToAttackerBomberChanceArray[battleId] = chances;
        airBattleIdToAttackerBomberTypeArray[battleId] = types;
        airBattleIdToAttackerBomberCumulativeOdds[battleId] = cumulativeSum;
    }

    function generateDefenderFighterChanceArray(uint256 battleId) internal {
        uint256[] storage chances = airBattleIdToDefenderFighterChanceArray[
            battleId
        ];
        uint256[] storage types = airBattleIdToDefenderFighterTypeArray[
            battleId
        ];
        uint256 cumulativeSum;
        //yak9Count,
        if (airBattleIdToDefenderFighters[battleId].yak9Count > 0) {
            uint256 yak9Odds = ((
                airBattleIdToDefenderFighters[battleId].yak9Count
            ) * (10 - yak9Strength));
            chances.push(yak9Odds);
            types.push(1);
            cumulativeSum = yak9Odds;
        }
        //p51MustangCount,
        if (airBattleIdToDefenderFighters[battleId].p51MustangCount > 0) {
            uint256 p51Odds = ((
                airBattleIdToDefenderFighters[battleId].p51MustangCount
            ) * (10 - p51MustangStrength));
            uint256 p51OddsToPush = (cumulativeSum + p51Odds);
            chances.push(p51OddsToPush);
            types.push(2);
            cumulativeSum = p51OddsToPush;
        }
        //f86SabreCount,
        if (airBattleIdToDefenderFighters[battleId].f86SabreCount > 0) {
            uint256 f86Odds = ((
                airBattleIdToDefenderFighters[battleId].f86SabreCount
            ) * (10 - f86SabreStrength));
            uint256 f86OddsToPush = (cumulativeSum + f86Odds);
            chances.push(f86OddsToPush);
            types.push(3);
            cumulativeSum = f86OddsToPush;
        }
        //mig15Count,
        if (airBattleIdToDefenderFighters[battleId].mig15Count > 0) {
            uint256 mig15Odds = ((
                airBattleIdToDefenderFighters[battleId].mig15Count
            ) * (10 - mig15Strength));
            uint256 mig15OddsToPush = (cumulativeSum + mig15Odds);
            chances.push(mig15OddsToPush);
            types.push(4);
            cumulativeSum = mig15OddsToPush;
        }
        //f100SuperSabreCount,
        if (airBattleIdToDefenderFighters[battleId].f100SuperSabreCount > 0) {
            uint256 f100Odds = ((
                airBattleIdToDefenderFighters[battleId].f100SuperSabreCount
            ) * (10 - f100SuperSabreStrength));
            uint256 f100OddsToPush = (cumulativeSum + f100Odds);
            chances.push(f100OddsToPush);
            types.push(5);
            cumulativeSum = f100OddsToPush;
        }
        //f35LightningCount,
        if (airBattleIdToDefenderFighters[battleId].f35LightningCount > 0) {
            uint256 f35Odds = ((
                airBattleIdToDefenderFighters[battleId].f35LightningCount
            ) * (10 - f35LightningStrength));
            uint256 f35OddsToPush = (cumulativeSum + f35Odds);
            chances.push(f35OddsToPush);
            types.push(6);
            cumulativeSum = f35OddsToPush;
        }
        //f15EagleCount,
        if (airBattleIdToDefenderFighters[battleId].f15EagleCount > 0) {
            uint256 f15Odds = ((
                airBattleIdToDefenderFighters[battleId].f15EagleCount
            ) * (10 - f15EagleStrength));
            uint256 f15OddsToPush = (cumulativeSum + f15Odds);
            chances.push(f15OddsToPush);
            types.push(7);
            cumulativeSum = f15OddsToPush;
        }
        //su30MkiCount,
        if (airBattleIdToDefenderFighters[battleId].su30MkiCount > 0) {
            uint256 su30Odds = ((
                airBattleIdToDefenderFighters[battleId].su30MkiCount
            ) * (10 - su30MkiStrength));
            uint256 su30OddsToPush = (cumulativeSum + su30Odds);
            chances.push(su30OddsToPush);
            types.push(8);
            cumulativeSum = su30OddsToPush;
        }
        //f22RaptorCount,
        if (airBattleIdToDefenderFighters[battleId].f22RaptorCount > 0) {
            uint256 f22Odds = ((
                airBattleIdToDefenderFighters[battleId].f22RaptorCount
            ) * (10 - f22RaptorStrength));
            uint256 f22OddsToPush = (cumulativeSum + f22Odds);
            chances.push(f22OddsToPush);
            types.push(9);
            cumulativeSum = f22OddsToPush;
        }
        airBattleIdToDefenderFighterChanceArray[battleId] = chances;
        airBattleIdToDefenderFighterTypeArray[battleId] = types;
        airBattleIdToDefenderFighterCumulativeOdds[battleId] = cumulativeSum;
    }

    function generateDefenderBomberChanceArray(uint256 battleId) internal {
        uint256[] storage chances = airBattleIdToDefenderBomberChanceArray[
            battleId
        ];
        uint256[] storage types = airBattleIdToDefenderBomberTypeArray[
            battleId
        ];
        uint256 cumulativeSum;
        //ah1CobraCount,
        if (airBattleIdToDefenderBombers[battleId].ah1CobraCount > 0) {
            uint256 ah1Odds = ((
                airBattleIdToDefenderBombers[battleId].ah1CobraCount
            ) * (10 - ah1CobraStrength));
            chances.push(ah1Odds);
            types.push(1);
            cumulativeSum = ah1Odds;
        }
        //ah64ApacheCount,
        if (airBattleIdToDefenderBombers[battleId].ah64ApacheCount > 0) {
            uint256 ah64Odds = ((
                airBattleIdToDefenderBombers[battleId].ah64ApacheCount
            ) * (10 - ah64ApacheStrength));
            uint256 ah64OddsToPush = (cumulativeSum + ah64Odds);
            chances.push(ah64OddsToPush);
            types.push(2);
            cumulativeSum = ah64OddsToPush;
        }
        //bristolBlenheimCount,
        if (airBattleIdToDefenderBombers[battleId].bristolBlenheimCount > 0) {
            uint256 bristolOdds = ((
                airBattleIdToDefenderBombers[battleId].bristolBlenheimCount
            ) * (10 - bristolBlenheimStrength));
            uint256 bristolOddsToPush = (cumulativeSum + bristolOdds);
            chances.push(bristolOddsToPush);
            types.push(3);
            cumulativeSum = bristolOddsToPush;
        }
        //b52MitchellCount,
        if (airBattleIdToDefenderBombers[battleId].b52MitchellCount > 0) {
            uint256 b52MOdds = ((
                airBattleIdToDefenderBombers[battleId].b52MitchellCount
            ) * (10 - b52MitchellStrength));
            uint256 b52MOddsToPush = (cumulativeSum + b52MOdds);
            chances.push(b52MOddsToPush);
            types.push(4);
            cumulativeSum = b52MOddsToPush;
        }
        //b17gFlyingFortressCount,
        if (
            airBattleIdToDefenderBombers[battleId].b17gFlyingFortressCount > 0
        ) {
            uint256 b17Odds = ((
                airBattleIdToDefenderBombers[battleId].b17gFlyingFortressCount
            ) * (10 - b17gFlyingFortressStrength));
            uint256 b17OddsToPush = (cumulativeSum + b17Odds);
            chances.push(b17OddsToPush);
            types.push(5);
            cumulativeSum = b17OddsToPush;
        }
        //b52StratofortressCount,
        if (airBattleIdToDefenderBombers[battleId].b52StratofortressCount > 0) {
            uint256 b52SOdds = ((
                airBattleIdToDefenderBombers[battleId].b52StratofortressCount
            ) * (10 - b52StratofortressStrength));
            uint256 b52SOddsToPush = (cumulativeSum + b52SOdds);
            chances.push(b52SOddsToPush);
            types.push(6);
            cumulativeSum = b52SOddsToPush;
        }
        //b2SpiritCount,
        if (airBattleIdToDefenderBombers[battleId].b2SpiritCount > 0) {
            uint256 b2SOdds = ((
                airBattleIdToDefenderBombers[battleId].b2SpiritCount
            ) * (10 - b2SpiritStrength));
            uint256 b2SOddsToPush = (cumulativeSum + b2SOdds);
            chances.push(b2SOddsToPush);
            types.push(7);
            cumulativeSum = b2SOddsToPush;
        }
        //b1bLancerCount,
        if (airBattleIdToDefenderBombers[battleId].b1bLancerCount > 0) {
            uint256 b1bOdds = ((
                airBattleIdToDefenderBombers[battleId].b1bLancerCount
            ) * (10 - b1bLancerStrength));
            uint256 b1bOddsToPush = (cumulativeSum + b1bOdds);
            chances.push(b1bOddsToPush);
            types.push(8);
            cumulativeSum = b1bOddsToPush;
        }
        //tupolevTu160Count,
        if (airBattleIdToDefenderBombers[battleId].tupolevTu160Count > 0) {
            uint256 tupolevOdds = ((
                airBattleIdToDefenderBombers[battleId].tupolevTu160Count
            ) * (10 - tupolevTu160Strength));
            uint256 tupolevOddsToPush = (cumulativeSum + tupolevOdds);
            chances.push(tupolevOddsToPush);
            types.push(9);
            cumulativeSum = tupolevOddsToPush;
        }
        airBattleIdToDefenderBomberChanceArray[battleId] = chances;
        airBattleIdToDefenderBomberTypeArray[battleId] = types;
        airBattleIdToDefenderBomberCumulativeOdds[battleId] = cumulativeSum;
    }

    function getAttackerFighterStrength(uint256 battleId)
        internal
        view
        returns (uint256)
    {
        uint256 _yak9Strength = airBattleIdToAttackerFighters[battleId].yak9Count * yak9Strength;
        uint256 _p51MustangStrength = airBattleIdToAttackerFighters[battleId].p51MustangCount * p51MustangStrength;
        uint256 _f86SabreStrength = airBattleIdToAttackerFighters[battleId].f86SabreCount * f86SabreStrength;
        uint256 _mig15Strength = airBattleIdToAttackerFighters[battleId].mig15Count * mig15Strength;
        uint256 _f100SuperSabreStrength = airBattleIdToAttackerFighters[battleId].f100SuperSabreCount * f100SuperSabreStrength;
        uint256 _f35LightningStrength = airBattleIdToAttackerFighters[battleId].f35LightningCount * f35LightningStrength;
        uint256 _f15EagleStrength = airBattleIdToAttackerFighters[battleId].f15EagleCount * f15EagleStrength;
        uint256 _su30MkiStrength = airBattleIdToAttackerFighters[battleId].su30MkiCount * su30MkiStrength;
        uint256 _f22RaptorStrength = airBattleIdToAttackerFighters[battleId].f22RaptorCount * f22RaptorStrength;
        uint256 strength = (
            _yak9Strength +
            _p51MustangStrength +
            _f86SabreStrength +
            _mig15Strength + 
            _f100SuperSabreStrength +
            _f35LightningStrength +
            _f15EagleStrength +
            _su30MkiStrength +
            _f22RaptorStrength
        );
        return strength;
    }

    function getAttackerBomberStrength(uint256 battleId)
        internal
        view
        returns (uint256)
    {}

    function getDefenderFighterStrength(uint256 battleId)
        internal
        view
        returns (uint256)
    {}

    function getDefenderBomberStrength(uint256 battleId)
        internal
        view
        returns (uint256)
    {}

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
    {}
}
