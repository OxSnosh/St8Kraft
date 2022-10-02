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
        uint256 fighterStrength;
        uint256 bomberStrength;
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
    uint32 private constant NUM_WORDS = 100;

    mapping(uint256 => FightersToBattle) airBattleIdToAttackerFighters;
    mapping(uint256 => uint256[]) airBattleIdToAttackerFighterChanceArray;
    mapping(uint256 => uint256[]) airBattleIdToAttackerFighterTypeArray;
    mapping(uint256 => uint256[]) airBattleIdToAttackerFighterLosses;
    mapping(uint256 => uint256) airBattleIdToAttackerFighterCumulativeOdds;


    mapping(uint256 => FightersToBattle) airBattleIdToDefenderFighters;
    mapping(uint256 => uint256[]) airBattleIdToDefenderFighterChanceArray;
    mapping(uint256 => uint256[]) airBattleIdToDefenderFighterTypeArray;
    mapping(uint256 => uint256[]) airBattleIdToDefenderFighterLosses;
    mapping(uint256 => uint256) airBattleIdToDefenderFighterCumulativeOdds;

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
        generateDefenderFighterStruct(warId, airBattleId, defenderId);
        generateAttackerFighterChanceArray(airBattleId);
        generateDefenderFighterChanceArray(airBattleId);
        fulfillRequest(airBattleId);
        airBattleId++;
    }

    function generateAttackerFighterStruct(
        uint256 warId,
        uint256 battleId,
        uint256 attackerId
    ) internal {
        (uint256 yak9Count,
        uint256 p51MustangCount,
        uint256 f86SabreCount,
        uint256 mig15Count,
        uint256 f100SuperSabreCount
        ) = war.getDeployedFightersLowStrength(warId, attackerId);
        (
        uint256 f35LightningCount,
        uint256 f15EagleCount,
        uint256 su30MkiCount,
        uint256 f22RaptorCount
        ) = war.getDeployedFightersHighStrength(warId, attackerId);
        // uint256 yak9Count = fighter.getYak9Count(attackerId);
        // uint256 p51MustangCount = fighter.getP51MustangCount(attackerId);
        // uint256 f86SabreCount = fighter.getF86SabreCount(attackerId);
        // uint256 mig15Count = fighter.getMig15Count(attackerId);
        // uint256 f100SuperSabreCount = fighter.getF100SuperSabreCount(
        //     attackerId
        // );
        // uint256 f35LightningCount = fighter.getF35LightningCount(attackerId);
        // uint256 f15EagleCount = fighter.getF15EagleCount(attackerId);
        // uint256 su30MkiCount = fighter.getSu30MkiCount(attackerId);
        // uint256 f22RaptorCount = fighter.getF22RaptorCount(attackerId);
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
            0,
            0,
            attackerId,
            warId
        );
        airBattleIdToAttackerFighters[battleId] = newFighters;
        setAttackerFighterStrength(battleId);
        // setAttackerBomberStrength(battleId);
    }

    function generateDefenderFighterStruct(
        uint256 warId,
        uint256 battleId,
        uint256 defenderId
    ) internal {
        (uint256 yak9Count,
        uint256 p51MustangCount,
        uint256 f86SabreCount,
        uint256 mig15Count,
        uint256 f100SuperSabreCount
        ) = war.getDeployedFightersLowStrength(warId, defenderId);
        (
        uint256 f35LightningCount,
        uint256 f15EagleCount,
        uint256 su30MkiCount,
        uint256 f22RaptorCount
        ) = war.getDeployedFightersHighStrength(warId, defenderId);
        // uint256 yak9Count = fighter.getYak9Count(defenderId);
        // uint256 p51MustangCount = fighter.getP51MustangCount(defenderId);
        // uint256 f86SabreCount = fighter.getF86SabreCount(defenderId);
        // uint256 mig15Count = fighter.getMig15Count(defenderId);
        // uint256 f100SuperSabreCount = fighter.getF100SuperSabreCount(
        //     defenderId
        // );
        // uint256 f35LightningCount = fighter.getF35LightningCount(defenderId);
        // uint256 f15EagleCount = fighter.getF15EagleCount(defenderId);
        // uint256 su30MkiCount = fighter.getSu30MkiCount(defenderId);
        // uint256 f22RaptorCount = fighter.getF22RaptorCount(defenderId);
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
            0,
            0,
            defenderId,
            warId
        );
        airBattleIdToDefenderFighters[battleId] = newFighters;
        setDefenderFighterStrength(battleId);
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

    function setAttackerFighterStrength(uint256 battleId)
        internal
    {
        uint256 _yak9Strength = airBattleIdToAttackerFighters[battleId]
            .yak9Count * yak9Strength;
        uint256 _p51MustangStrength = airBattleIdToAttackerFighters[battleId]
            .p51MustangCount * p51MustangStrength;
        uint256 _f86SabreStrength = airBattleIdToAttackerFighters[battleId]
            .f86SabreCount * f86SabreStrength;
        uint256 _mig15Strength = airBattleIdToAttackerFighters[battleId]
            .mig15Count * mig15Strength;
        uint256 _f100SuperSabreStrength = airBattleIdToAttackerFighters[
            battleId
        ].f100SuperSabreCount * f100SuperSabreStrength;
        uint256 _f35LightningStrength = airBattleIdToAttackerFighters[battleId]
            .f35LightningCount * f35LightningStrength;
        uint256 _f15EagleStrength = airBattleIdToAttackerFighters[battleId]
            .f15EagleCount * f15EagleStrength;
        uint256 _su30MkiStrength = airBattleIdToAttackerFighters[battleId]
            .su30MkiCount * su30MkiStrength;
        uint256 _f22RaptorStrength = airBattleIdToAttackerFighters[battleId]
            .f22RaptorCount * f22RaptorStrength;
        uint256 strength = (_yak9Strength +
            _p51MustangStrength +
            _f86SabreStrength +
            _mig15Strength +
            _f100SuperSabreStrength +
            _f35LightningStrength +
            _f15EagleStrength +
            _su30MkiStrength +
            _f22RaptorStrength);
        airBattleIdToAttackerFighters[battleId].fighterStrength = strength;
    }

    function setDefenderFighterStrength(uint256 battleId)
        internal
    {
        uint256 _yak9Strength = airBattleIdToDefenderFighters[battleId]
            .yak9Count * yak9Strength;
        uint256 _p51MustangStrength = airBattleIdToDefenderFighters[battleId]
            .p51MustangCount * p51MustangStrength;
        uint256 _f86SabreStrength = airBattleIdToDefenderFighters[battleId]
            .f86SabreCount * f86SabreStrength;
        uint256 _mig15Strength = airBattleIdToDefenderFighters[battleId]
            .mig15Count * mig15Strength;
        uint256 _f100SuperSabreStrength = airBattleIdToDefenderFighters[
            battleId
        ].f100SuperSabreCount * f100SuperSabreStrength;
        uint256 _f35LightningStrength = airBattleIdToDefenderFighters[battleId]
            .f35LightningCount * f35LightningStrength;
        uint256 _f15EagleStrength = airBattleIdToDefenderFighters[battleId]
            .f15EagleCount * f15EagleStrength;
        uint256 _su30MkiStrength = airBattleIdToDefenderFighters[battleId]
            .su30MkiCount * su30MkiStrength;
        uint256 _f22RaptorStrength = airBattleIdToDefenderFighters[battleId]
            .f22RaptorCount * f22RaptorStrength;
        uint256 strength = (_yak9Strength +
            _p51MustangStrength +
            _f86SabreStrength +
            _mig15Strength +
            _f100SuperSabreStrength +
            _f35LightningStrength +
            _f15EagleStrength +
            _su30MkiStrength +
            _f22RaptorStrength);
        airBattleIdToDefenderFighters[battleId].fighterStrength = strength;
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
        uint256 numberBetweenZeroAndFive = (s_randomWords[0] % 2);
        uint256 losses = getLosses(requestNumber, numberBetweenZeroAndFive);
        for (uint256 i = 1; i < losses + 1; i++) {
            uint256 attackerFighterStrength = airBattleIdToAttackerFighters[
                requestNumber
            ].fighterStrength;
            uint256 attackerBomberStrength = airBattleIdToAttackerFighters[
                requestNumber
            ].bomberStrength;
            uint256 attackerStrength = (attackerFighterStrength +
                attackerBomberStrength);
            uint256 defenderFighterStrength = airBattleIdToDefenderFighters[
                requestNumber
            ].fighterStrength;
            if(attackerFighterStrength > 0) {
                if (defenderFighterStrength == 0 && attackerBomberStrength > 0) {
                    // runBombingCampaign(requestNumber);
                } else if (defenderFighterStrength == 0 && attackerBomberStrength == 0) {
                    break;
                } else if (defenderFighterStrength > 0) {
                    dogfight(requestNumber, i);
                } else {
                    break;
                }
            } else if (attackerFighterStrength == 0) {
                if (defenderFighterStrength == 0 && attackerBomberStrength > 0) {
                    // runBombingCampaign(requestNumber);
                } else if (defenderFighterStrength == 0 && attackerBomberStrength == 0) {
                    break;
                } else if (defenderFighterStrength > 0) {
                    // eliminateAttackerBombers(requestNumber);
                } else {
                    break;
                }
            }
        }
    }

    function getLosses(uint256 battleId, uint256 numberBetweenZeroAndFive)
        public
        view
        returns (uint256)
    {
        uint256 attackerId = airBattleIdToAttackerFighters[battleId].countryId;
        uint256 attackerFighterCount = getFighterCount(attackerId);
        uint256 attackerBomberCount = getBomberCount(attackerId);
        uint256 defenderId = airBattleIdToDefenderFighters[battleId].countryId;
        uint256 defenderFighterCount = getFighterCount(defenderId);
        uint256 defenderBomberCount = getBomberCount(defenderId);
        uint256 totalAircraft = (attackerFighterCount +
            attackerBomberCount +
            defenderFighterCount +
            defenderBomberCount);
        uint256 losses;
        if (totalAircraft < 4) {
            losses = 1;
        } else if (totalAircraft <= 8) {
            losses = 2;
        } else if (totalAircraft <= 15) {
            losses = 5;
        } else if (totalAircraft <= 30) {
            losses = (5 + numberBetweenZeroAndFive);
        } else if (totalAircraft <= 50) {
            losses = (10 + numberBetweenZeroAndFive);
        } else if (totalAircraft <= 70) {
            losses = (15 + numberBetweenZeroAndFive);
        } else if (totalAircraft <= 100) {
            losses = (20 + numberBetweenZeroAndFive);
        } else if (totalAircraft <= 150) {
            losses = (30 + numberBetweenZeroAndFive);
        } else {
            losses = (40 + numberBetweenZeroAndFive);
        }
        return losses;
    }

    function getFighterCount(uint256 countryId)
        internal
        view
        returns (uint256)
    {
        uint256 yak9Count = fighter.getYak9Count(countryId);
        uint256 p51MustangCount = fighter.getP51MustangCount(countryId);
        uint256 f86SabreCount = fighter.getF86SabreCount(countryId);
        uint256 mig15Count = fighter.getMig15Count(countryId);
        uint256 f100SuperSabreCount = fighter.getF100SuperSabreCount(countryId);
        uint256 f35LightningCount = fighter.getF35LightningCount(countryId);
        uint256 f15EagleCount = fighter.getF15EagleCount(countryId);
        uint256 su30MkiCount = fighter.getSu30MkiCount(countryId);
        uint256 f22RaptorCount = fighter.getF22RaptorCount(countryId);
        uint256 count = (yak9Count +
            p51MustangCount +
            f86SabreCount +
            mig15Count +
            f100SuperSabreCount +
            f35LightningCount +
            f15EagleCount +
            su30MkiCount +
            f22RaptorCount);
        return count;
    }

    function getBomberCount(uint256 countryId) internal view returns (uint256) {
        uint256 ah1CobraCount = bomber.getAh1CobraCount(countryId);
        uint256 ah64ApacheCount = bomber.getAh64ApacheCount(countryId);
        uint256 bristolBlenheimCount = bomber.getBristolBlenheimCount(
            countryId
        );
        uint256 b52MitchellCount = bomber.getB52MitchellCount(countryId);
        uint256 b17gFlyingFortressCount = bomber.getB17gFlyingFortressCount(
            countryId
        );
        uint256 b52StratofortressCount = bomber.getB52StratofortressCount(
            countryId
        );
        uint256 b2SpiritCount = bomber.getB2SpiritCount(countryId);
        uint256 b1bLancerCount = bomber.getB1bLancer(countryId);
        uint256 tupolevTu160Count = bomber.getTupolevTu160(countryId);
        uint256 count = (ah1CobraCount +
            ah64ApacheCount +
            bristolBlenheimCount +
            b52MitchellCount +
            b17gFlyingFortressCount +
            b52StratofortressCount +
            b2SpiritCount +
            b1bLancerCount +
            tupolevTu160Count);
        return count;
    }

    function dogfight(uint256 battleId, uint256 index) internal {
        uint256 attackerFighterStrength = airBattleIdToAttackerFighters[
            battleId
        ].fighterStrength;
        uint256 defenderFighterStrength = airBattleIdToDefenderFighters[
            battleId
        ].fighterStrength;
        uint256 totalDogfightStrength = (attackerFighterStrength +
            defenderFighterStrength);
        uint256[] memory randomWords = s_requestIndexToRandomWords[battleId];
        uint256 randomNumberForTeamSelection = (randomWords[index] %
            totalDogfightStrength);
        uint256 randomNumberForLossSelection = (randomWords[index + 46]);
        if (randomNumberForTeamSelection <= attackerFighterStrength) {
            generateLossForDefender(battleId, randomNumberForLossSelection);
        } else {
            generateLossForAttacker(battleId, randomNumberForLossSelection);
        }
    }

    function generateLossForDefender(
        uint256 battleId,
        uint256 randomNumberForLossSelection
    ) internal {
        uint256[] storage chanceArray = airBattleIdToDefenderFighterChanceArray[
            battleId
        ];
        uint256[] storage typeArray = airBattleIdToDefenderFighterTypeArray[
            battleId
        ];
        uint256 cumulativeValue = airBattleIdToDefenderFighterCumulativeOdds[
            battleId
        ];
        uint256 randomNumber = (randomNumberForLossSelection % cumulativeValue);
        uint256 fighterType;
        uint256 amountToDecrease;
        uint256 j;
        for (uint256 i; i < chanceArray.length; i++) {
            if (randomNumber <= chanceArray[i]) {
                fighterType = typeArray[i];
                amountToDecrease = getAmountToDecrease(fighterType);
                j = i;
                break;
            }
        }
        for (j; j < chanceArray.length; j++) {
            if (chanceArray[j] >= randomNumber) {
                chanceArray[j] -= amountToDecrease;
            }
        }
        airBattleIdToDefenderFighterCumulativeOdds[
            battleId
        ] -= amountToDecrease;
        uint256[] storage defenderLosses = airBattleIdToDefenderFighterLosses[
            battleId
        ];
        defenderLosses.push(fighterType);
        airBattleIdToDefenderFighters[battleId].fighterStrength -= fighterType;
    }

    function generateLossForAttacker(
        uint256 battleId,
        uint256 randomNumberForLossSelection
    ) internal {
        uint256[] storage chanceArray = airBattleIdToAttackerFighterChanceArray[
            battleId
        ];
        uint256[] storage typeArray = airBattleIdToAttackerFighterTypeArray[
            battleId
        ];
        uint256 cumulativeValue = airBattleIdToAttackerFighterCumulativeOdds[
            battleId
        ];
        uint256 randomNumber = (randomNumberForLossSelection % cumulativeValue);
        uint256 fighterType;
        uint256 amountToDecrease;
        uint256 j;
        for (uint256 i; i < chanceArray.length; i++) {
            if (randomNumber <= chanceArray[i]) {
                fighterType = typeArray[i];
                amountToDecrease = getAmountToDecrease(fighterType);
                j = i;
                break;
            }
        }
        for (j; j < chanceArray.length; j++) {
            if (chanceArray[j] >= randomNumber) {
                chanceArray[j] -= amountToDecrease;
            }
        }
        airBattleIdToAttackerFighterCumulativeOdds[
            battleId
        ] -= amountToDecrease;
        uint256[] storage attackerLosses = airBattleIdToAttackerFighterLosses[
            battleId
        ];
        attackerLosses.push(fighterType);
        airBattleIdToAttackerFighters[battleId].fighterStrength -= fighterType;
    }

    function getAmountToDecrease(uint256 fighterType)
        internal
        pure
        returns (uint256)
    {
        uint256 amountToDecrease;
        if (fighterType == 1) {
            amountToDecrease = 9;
        } else if (fighterType == 2) {
            amountToDecrease = 8;
        } else if (fighterType == 3) {
            amountToDecrease = 7;
        } else if (fighterType == 4) {
            amountToDecrease = 6;
        } else if (fighterType == 5) {
            amountToDecrease = 5;
        } else if (fighterType == 6) {
            amountToDecrease = 4;
        } else if (fighterType == 7) {
            amountToDecrease = 3;
        } else if (fighterType == 8) {
            amountToDecrease = 2;
        } else {
            amountToDecrease = 1;
        }
        return amountToDecrease;
    }
}
