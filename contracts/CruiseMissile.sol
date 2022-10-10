//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Forces.sol";
import "./CountryMinter.sol";
import "./War.sol";
import "./Infrastructure.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract CruiseMissileContract is Ownable, VRFConsumerBaseV2 {
    uint256 public cruiseMissileAttackId;
    address public forces;
    address public countryMinter;
    address public warAddress;
    address public infrastructure;
    address public missiles;
    address public improvements1;
    address public improvements3;
    address public improvements4;

    //Chainlik Variables
    uint256[] private s_randomWords;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 3;

    ForcesContract force;
    CountryMinter mint;
    WarContract war;
    InfrastructureContract inf;
    MissilesContract mis;
    ImprovementsContract1 imp1;
    ImprovementsContract3 imp3;
    ImprovementsContract4 imp4;

    struct CruiseMissileAttack {
        uint256 warId;
        uint256 attackerId;
        uint256 defenderId;
        uint256 tanksDestroyed;
        uint256 technologyDestroyed;
        uint256 infrastructureDestroyed;
    }

    mapping(uint256 => CruiseMissileAttack) attackIdToCruiseMissile;
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;

    constructor(
        address _forces,
        address _countryMinter,
        address _war,
        address _infrastructure,
        address _missiles,
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        forces = _forces;
        force = ForcesContract(_forces);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        warAddress = _war;
        war = WarContract(_war);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        missiles = _missiles;
        mis = MissilesContract(_missiles);
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function constructorContinued(
        address _improvements1,
        address _improvements3,
        address _improvements4
    ) public onlyOwner {
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        improvements3 = _improvements3;
        imp3 = ImprovementsContract3(_improvements3);
        improvements4 = _improvements4;
        imp4 = ImprovementsContract4(_improvements4);
    }

    function updateForcesContract(address newAddress) public onlyOwner {
        forces = newAddress;
        force = ForcesContract(newAddress);
    }

    function launchCruiseMissileAttack(
        uint256 attackerId,
        uint256 defenderId,
        uint256 warId
    ) public {
        bool isOwner = mint.checkOwnership(attackerId, msg.sender);
        require(isOwner, "!nation owner");
        uint256 missileCount = mis.getCruiseMissileCount(attackerId);
        require(missileCount > 0, "no cruise missiles");
        bool isWarActive = war.isWarActive(warId);
        require(isWarActive, "not active war");
        CruiseMissileAttack memory newAttack = CruiseMissileAttack(
            warId,
            attackerId,
            defenderId,
            0,
            0,
            0
        );
        war.incrementCruiseMissileAttack(warId, attackerId);
        attackIdToCruiseMissile[cruiseMissileAttackId] = newAttack;
        fulfillRequest(cruiseMissileAttackId);
        cruiseMissileAttackId++;
    }

    function fulfillRequest(uint256 id) internal {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToRequestIndex[requestId] = id;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        s_randomWords = randomWords;
        uint256 defenderId = attackIdToCruiseMissile[requestNumber].defenderId;
        uint256 attackerId = attackIdToCruiseMissile[requestNumber].attackerId;
        uint256 defenderMissileDefenses = imp4.getMissileDefenseCount(
            defenderId
        );
        uint256 attackerSattelites = imp3.getSatelliteCount(attackerId);
        uint256 successOdds = 75;
        if (defenderMissileDefenses > 0) {
            successOdds -= (5 * defenderMissileDefenses);
        }
        if (attackerSattelites > 0) {
            successOdds += (5 * attackerSattelites);
        }
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[
            requestNumber
        ];
        uint256 randomNumber = (randomNumbers[0] % 100);
        if (randomNumber < successOdds) {
            destroyTanks(requestNumber);
            destroyTech(requestNumber);
            destroyInfrastructure(requestNumber);
        } else {
            /* emit thwarted event */
        }
    }

    function destroyTanks(uint256 attackId) internal {
        uint256 defenderId = attackIdToCruiseMissile[attackId].defenderId;
        uint256 attackerId = attackIdToCruiseMissile[attackId].attackerId;
        uint256 tankCount = force.getDefendingTankCount(defenderId);
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        uint256 defenderBunkerCount = imp1.getBunkerCount(defenderId);
        uint256 attackerMunitionsFactory = imp4.getMunitionsFactoryCount(
            attackerId
        );
        uint256 randomTankCount = (10 +
            (randomNumbers[1] % 5) +
            attackerMunitionsFactory -
            defenderBunkerCount);
        if (tankCount <= randomTankCount) {
            force.decreaseDefendingTankCountFromCruiseMissileContract(
                tankCount,
                defenderId
            );
        } else {
            force.decreaseDefendingTankCountFromCruiseMissileContract(
                randomTankCount,
                defenderId
            );
        }
    }

    function destroyTech(uint256 attackId) internal {
        uint256 defenderId = attackIdToCruiseMissile[attackId].defenderId;
        uint256 attackerId = attackIdToCruiseMissile[attackId].attackerId;
        uint256 techCount = inf.getTechnologyCount(defenderId);
        if (techCount >= 2) {
            uint256 defenderBunkerCount = imp1.getBunkerCount(defenderId);
            uint256 attackerMunitionsFactory = imp4.getMunitionsFactoryCount(
                attackerId
            );
            uint256 amount = 1;
            if (defenderBunkerCount == 5) {
                amount -= 1;
            }
            if (attackerMunitionsFactory == 5) {
                amount += 1;
            }
            inf.decreaseTechCountFromCruiseMissileContract(defenderId, amount);
        }
    }

    function destroyInfrastructure(uint256 attackId) internal {
        uint256 defenderId = attackIdToCruiseMissile[attackId].defenderId;
        uint256 attackerId = attackIdToCruiseMissile[attackId].attackerId;
        uint256 infrastructureCount = inf.getInfrastructureCount(defenderId);
        if (infrastructureCount >= 15) {
            uint256[] memory randomNumbers = s_requestIndexToRandomWords[
                attackId
            ];
            uint256 defenderBunkerCount = imp1.getBunkerCount(defenderId);
            uint256 attackerMunitionsFactory = imp4.getMunitionsFactoryCount(
                attackerId
            );
            uint256 randomInfrastructureCount = (5 +
                (randomNumbers[2] % 5) +
                attackerMunitionsFactory -
                defenderBunkerCount);
            inf.decreaseInfrastructureCountFromCruiseMissileContract(
                defenderId,
                randomInfrastructureCount
            );
        }
    }
}
