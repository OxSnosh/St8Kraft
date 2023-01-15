//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./War.sol";
import "./Fighters.sol";
import "./Bombers.sol";
import "./Infrastructure.sol";
import "./Forces.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

///@title AirBattleContract
///@author OxSnosh
///@dev this contract allows you to launch a bombing campaign against another nation
contract AirBattleContract is Ownable, VRFConsumerBaseV2 {
    uint256 airBattleId;
    address warAddress;
    address fighterAddress;
    address bomberAddress;
    address infrastructure;
    address forces;
    address missiles;
    address wonders1;
    address fighterLosses;
    address countryMinter;
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
    InfrastructureContract inf;
    ForcesContract force;
    MissilesContract mis;
    WondersContract1 won1;
    FighterLosses fighterLoss;
    CountryMinter mint;

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

    ///@dev this is the constructor funtion for the contact
    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    ///@dev this function is only callable by the owner
    ///@dev this function will be called right after deployment in order to set up contract pointers
    function settings (
        address _warAddress,
        address _fighter,
        address _bomber,
        address _infrastructure,
        address _forces,
        address _fighterLosses
    ) public onlyOwner {
        warAddress = _warAddress;
        fighterAddress = _fighter;
        fighter = FightersContract(_fighter);
        bomberAddress = _bomber;
        bomber = BombersContract(_bomber);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        forces = _forces;
        force = ForcesContract(_forces);
        fighterLosses = _fighterLosses;
        fighterLoss = FighterLosses(_fighterLosses);
    }

    ///@dev this function is only callable by the owner of the contract
    function updateWarAddress(address newAddress) public onlyOwner {
        warAddress = newAddress;
    }

    ///@dev this function is only callable by the owner of the contract
    function updateFighterAddress(address newAddress) public onlyOwner {
        fighterAddress = newAddress;
        fighter = FightersContract(newAddress);
    }

    ///@dev this function is only callable by the owner of the contract
    function updateBomberAddress(address newAddress) public onlyOwner {
        bomberAddress = newAddress;
        bomber = BombersContract(newAddress);
    }

    ///@dev this function is only callable by the owner of the contract
    function updateInfrastructureAddress(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    ///@dev this function is only callable by the owner of the contract
    function updateForcesAddress(address newAddress) public onlyOwner {
        forces = newAddress;
        force = ForcesContract(newAddress);
    }

    ///@dev this function is only callable by the owner of the contract
    function updateFighterLossesAddress(address newAddress) public onlyOwner {
        fighterLosses = newAddress;
        fighterLoss = FighterLosses(newAddress);
    }

    ///@dev this function is only callable by the owner of the contract
    function updateMissilesAddress(address newAddress) public onlyOwner {
        missiles = newAddress;
        mis = MissilesContract(newAddress);
    }

    ///@dev this function is only callable by the owner of the contract
    function updateWonders1Address(address newAddress) public onlyOwner {
        wonders1 = newAddress;
        won1 = WondersContract1(newAddress);
    }

    ///@dev this function is a public function 
    ///@notice this function allows one nation to launch a bombing campaign against another nation
    ///@notice can only be called if a war is active between the two nations
    ///@param warId is the ID of the current war between the two nations
    ///@param attackerId is the nation ID of the attacker nation
    ///@param defenderId is the nation ID of the defending nation 
    function airBattle(
        uint256 warId,
        uint256 attackerId,
        uint256 defenderId
    ) public {
        bool isOwner = mint.checkOwnership(attackerId, msg.sender);
        require (isOwner, "!nation owner");
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

    ///@dev this is an internal function that will 
    function generateAttackerFighterStruct(
        uint256 warId,
        uint256 battleId,
        uint256 attackerId
    ) internal {
        (
            uint256 yak9Count,
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
        uint256 yak9Count = fighter.getDefendingYak9Count(defenderId);
        uint256 p51MustangCount = fighter.getDefendingP51MustangCount(
            defenderId
        );
        uint256 f86SabreCount = fighter.getDefendingF86SabreCount(defenderId);
        uint256 mig15Count = fighter.getDefendingMig15Count(defenderId);
        uint256 f100SuperSabreCount = fighter.getDefendingF100SuperSabreCount(
            defenderId
        );
        uint256 f35LightningCount = fighter.getDefendingF35LightningCount(
            defenderId
        );
        uint256 f15EagleCount = fighter.getDefendingF15EagleCount(defenderId);
        uint256 su30MkiCount = fighter.getDefendingSu30MkiCount(defenderId);
        uint256 f22RaptorCount = fighter.getDefendingF22RaptorCount(defenderId);
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

    function setAttackerFighterStrength(uint256 battleId) internal {
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

    function setDefenderFighterStrength(uint256 battleId) internal {
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
            uint256 defenderFighterStrength = airBattleIdToDefenderFighters[
                requestNumber
            ].fighterStrength;
            uint256 countryId = airBattleIdToAttackerFighters[requestNumber]
                .countryId;
            uint256 warId = airBattleIdToAttackerFighters[requestNumber].warId;
            if (attackerFighterStrength > 0) {
                if (
                    defenderFighterStrength == 0 && attackerBomberStrength > 0
                ) {
                    runBombingCampaign(countryId, requestNumber, warId);
                } else if (
                    defenderFighterStrength == 0 && attackerBomberStrength == 0
                ) {
                    break;
                } else if (defenderFighterStrength > 0) {
                    dogfight(requestNumber, i);
                } else {
                    break;
                }
            } else if (attackerFighterStrength == 0) {
                if (
                    defenderFighterStrength == 0 && attackerBomberStrength > 0
                ) {
                    runBombingCampaign(countryId, requestNumber, warId);
                } else if (
                    defenderFighterStrength == 0 && attackerBomberStrength == 0
                ) {
                    break;
                } else if (defenderFighterStrength > 0) {
                    eliminateAttackerBombers(countryId, warId);
                } else {
                    break;
                }
            }
        }
        uint256[] memory attackerLosses = airBattleIdToAttackerFighterLosses[
            requestNumber
        ];
        uint256[] memory defenderLosses = airBattleIdToDefenderFighterLosses[
            requestNumber
        ];
        uint256 attackerId = airBattleIdToAttackerFighters[requestNumber]
            .countryId;
        uint256 defenderId = airBattleIdToDefenderFighters[requestNumber]
            .countryId;
        fighterLoss.decrementLosses(
            defenderLosses,
            defenderId,
            attackerLosses,
            attackerId
        );
        uint256 _warId = airBattleIdToAttackerFighters[requestNumber].warId;
        war.decrementLosses(
            _warId,
            defenderLosses,
            defenderId,
            attackerLosses,
            attackerId
        );
        war.addAirBattleCasualties(_warId, attackerId, attackerLosses.length);
        war.addAirBattleCasualties(_warId, defenderId, defenderLosses.length);
    }

    function getLosses(uint256 battleId, uint256 numberBetweenZeroAndFive)
        public
        view
        returns (uint256)
    {
        uint256 attackerFighterCount = getAttackingFighterCount(battleId);
        uint256 defenderFighterCount = getDefendingFighterCount(battleId);
        uint256 totalAircraft = (attackerFighterCount + defenderFighterCount);
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
        } else {
            losses = (30 + numberBetweenZeroAndFive);
        }
        return losses;
    }

    function getAttackingFighterCount(uint256 battleId)
        internal
        view
        returns (uint256)
    {
        uint256 yak9Count = airBattleIdToAttackerFighters[battleId].yak9Count;
        uint256 p51MustangCount = airBattleIdToAttackerFighters[battleId]
            .p51MustangCount;
        uint256 f86SabreCount = airBattleIdToAttackerFighters[battleId]
            .f86SabreCount;
        uint256 mig15Count = airBattleIdToAttackerFighters[battleId].mig15Count;
        uint256 additionalCount = getAdditionalAttackerFighterCount(battleId);
        uint256 count = (yak9Count +
            p51MustangCount +
            f86SabreCount +
            mig15Count +
            additionalCount);
        return count;
    }

    function getAdditionalAttackerFighterCount(uint256 battleId)
        internal
        view
        returns (uint256)
    {
        uint256 f100SuperSabreCount = airBattleIdToAttackerFighters[battleId]
            .f100SuperSabreCount;
        uint256 f35LightningCount = airBattleIdToAttackerFighters[battleId]
            .f35LightningCount;
        uint256 f15EagleCount = airBattleIdToAttackerFighters[battleId]
            .f15EagleCount;
        uint256 su30MkiCount = airBattleIdToAttackerFighters[battleId]
            .su30MkiCount;
        uint256 f22RaptorCount = airBattleIdToAttackerFighters[battleId]
            .f22RaptorCount;
        uint256 additionalCount = (f100SuperSabreCount +
            f35LightningCount +
            f15EagleCount +
            su30MkiCount +
            f22RaptorCount);
        return additionalCount;
    }

    function getDefendingFighterCount(uint256 battleId)
        internal
        view
        returns (uint256)
    {
        uint256 yak9Count = airBattleIdToDefenderFighters[battleId].yak9Count;
        uint256 p51MustangCount = airBattleIdToDefenderFighters[battleId]
            .p51MustangCount;
        uint256 f86SabreCount = airBattleIdToDefenderFighters[battleId]
            .f86SabreCount;
        uint256 mig15Count = airBattleIdToDefenderFighters[battleId].mig15Count;
        uint256 additionalCount = getAdditionalDefendingFighterCount(battleId);
        uint256 count = (yak9Count +
            p51MustangCount +
            f86SabreCount +
            mig15Count +
            additionalCount);
        return count;
    }

    function getAdditionalDefendingFighterCount(uint256 battleId)
        internal
        view
        returns (uint256)
    {
        uint256 f100SuperSabreCount = airBattleIdToDefenderFighters[battleId]
            .f100SuperSabreCount;
        uint256 f35LightningCount = airBattleIdToDefenderFighters[battleId]
            .f35LightningCount;
        uint256 f15EagleCount = airBattleIdToDefenderFighters[battleId]
            .f15EagleCount;
        uint256 su30MkiCount = airBattleIdToDefenderFighters[battleId]
            .su30MkiCount;
        uint256 f22RaptorCount = airBattleIdToDefenderFighters[battleId]
            .f22RaptorCount;
        uint256 additionalCount = (f100SuperSabreCount +
            f35LightningCount +
            f15EagleCount +
            su30MkiCount +
            f22RaptorCount);
        return additionalCount;
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

    function eliminateAttackerBombers(uint256 attackerId, uint256 warId)
        internal
    {
        (
            uint256 ah1CobraDeployed,
            uint256 ah64ApacheDeployed,
            uint256 bristolBlenheimDeployed,
            uint256 b52MitchellDeployed,
            uint256 b17gFlyingFortressDeployed
        ) = war.getDeployedBombersLowStrength(warId, attackerId);
        (
            uint256 b52StratofortressDeployed,
            uint256 b2SpiritDeployed,
            uint256 b1bLancerDeployed,
            uint256 tupolevTu160Deployed
        ) = war.getDeployedBombersHighStrength(warId, attackerId);
        war.resetDeployedBombers(warId, attackerId);
        bomber.decreaseDeployedAh1CobraCount(ah1CobraDeployed, attackerId);
        bomber.decreaseDeployedAh64ApacheCount(ah64ApacheDeployed, attackerId);
        bomber.decreaseDeployedBristolBlenheimCount(
            bristolBlenheimDeployed,
            attackerId
        );
        bomber.decreaseDeployedB52MitchellCount(
            b52MitchellDeployed,
            attackerId
        );
        bomber.decreaseDeployedB17gFlyingFortressCount(
            b17gFlyingFortressDeployed,
            attackerId
        );
        bomber.decreaseDeployedB52StratofortressCount(
            b52StratofortressDeployed,
            attackerId
        );
        bomber.decreaseDeployedB2SpiritCount(b2SpiritDeployed, attackerId);
        bomber.decreaseDeployedB1bLancerCount(b1bLancerDeployed, attackerId);
        bomber.decreaseDeployedTupolevTu160Count(
            tupolevTu160Deployed,
            attackerId
        );
    }

    function runBombingCampaign(
        uint256 attackerId,
        uint256 battleId,
        uint256 warId
    ) internal {
        uint256 attackerBomberStrength = getAttackerBomberStrength(
            attackerId,
            warId
        );
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[battleId];
        uint256 randomNumberForInfrastructure = ((randomNumbers[97] % 5) + 1);
        uint256 randomNumberForTanks = ((randomNumbers[98] % 5) + 1);
        uint256 randomNumberForCruiseMissiles = ((randomNumbers[99] % 2));
        uint256 infrastructureToDeduct = ((attackerBomberStrength / 30) +
            randomNumberForInfrastructure);
        uint256 tanksToDeduct = ((attackerBomberStrength / 15) +
            randomNumberForTanks);
        uint256 cruiseMissilesToDeduct = ((attackerBomberStrength / 50) +
            randomNumberForCruiseMissiles);
        uint256 mod = 100;
        uint256 defenderId = airBattleIdToDefenderFighters[battleId].countryId;
        bool antiAirDefenseNetwork = won1.getAntiAirDefenseNewtwork(defenderId);
        if (antiAirDefenseNetwork) {
            mod = 85;
        }
        infrastructureToDeduct = ((infrastructureToDeduct * mod) / 100);
        tanksToDeduct = ((tanksToDeduct * mod) / 100);
        cruiseMissilesToDeduct = ((cruiseMissilesToDeduct * mod) / 100);
        inf.decreaseInfrastructureCountFromAirBattleContract(
            defenderId,
            infrastructureToDeduct
        );
        force.decreaseDefendingTankCountFromAirBattleContract(
            defenderId,
            tanksToDeduct
        );
        mis.decreaseCruiseMissileCountFromAirBattleContract(
            defenderId,
            cruiseMissilesToDeduct
        );
    }

    function getAttackerBomberStrength(uint256 attackerId, uint256 warId)
        internal
        view
        returns (uint256)
    {
        (
            uint256 ah1CobraDeployed,
            uint256 ah64ApacheDeployed,
            uint256 bristolBlenheimDeployed,
            uint256 b52MitchellDeployed,
            uint256 b17gFlyingFortressDeployed
        ) = war.getDeployedBombersLowStrength(warId, attackerId);
        uint256 _ah1CobraStrength = ah1CobraDeployed * ah1CobraStrength;
        uint256 _ah64ApacheStrength = ah64ApacheDeployed * ah64ApacheStrength;
        uint256 _bristolBlenheimStrength = bristolBlenheimDeployed *
            bristolBlenheimStrength;
        uint256 _b52MitchellStrength = b52MitchellDeployed *
            b52MitchellStrength;
        uint256 _b17gFlyingFortressStrength = b17gFlyingFortressDeployed *
            b17gFlyingFortressStrength;
        uint256 additionalStrength = getAdditonalBomberStrength(
            attackerId,
            warId
        );
        uint256 strength = (_ah1CobraStrength +
            _ah64ApacheStrength +
            _bristolBlenheimStrength +
            _b52MitchellStrength +
            _b17gFlyingFortressStrength +
            additionalStrength);
        return strength;
    }

    function getAdditonalBomberStrength(uint256 attackerId, uint256 warId)
        internal
        view
        returns (uint256)
    {
        (
            uint256 b52StratofortressDeployed,
            uint256 b2SpiritDeployed,
            uint256 b1bLancerDeployed,
            uint256 tupolevTu160Deployed
        ) = war.getDeployedBombersHighStrength(warId, attackerId);
        uint256 _b52StratofortressStrength = b52StratofortressDeployed *
            b52StratofortressStrength;
        uint256 _b2SpiritStrength = b2SpiritDeployed * b2SpiritStrength;
        uint256 _b1bLancerStrength = b1bLancerDeployed * b1bLancerStrength;
        uint256 _tupolevTu160Strength = tupolevTu160Deployed *
            tupolevTu160Strength;
        uint256 strength = (_b52StratofortressStrength +
            _b2SpiritStrength +
            _b1bLancerStrength +
            _tupolevTu160Strength);
        return strength;
    }
}
