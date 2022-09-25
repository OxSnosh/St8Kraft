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

    //Chainlik Variables
    uint256[] private s_randomWords;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 2;

    ForcesContract force;
    CountryMinter mint;
    WarContract war;
    InfrastructureContract inf;

    struct CruiseMissileAttack {
        uint256 warId;
        uint256 attackerId;
        uint256 defenderId;
        uint256 tanksDestroyed;
        uint256 technologyDestroyed;
        uint256 infrastructureDestroyed;
    }

    mappint(uint256 => CruiseMissileAttack) attackIdToCruiseMissile;
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;

    constructor(
        address _forces,
        address _countryMinter,
        address _war,
        address _infrastructure,
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
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
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
        uint256 missileCount = force.getCruiseMissileCount(attackerId);
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
        uint256 damageType = ((s_randomWords[0] % 3) + 1);
        if(damageType == 1) {
            destroyTanks(requestNumber);
        } else if (damageType == 2) {
            destroyTech(requestNumber);
        } else {
            destroyInfrastructure(requestNumber);
        }
    }

    function destroyTanks(uint256 attackId) internal {
        uint256 defenderId = attackIdToCruiseMissile[attackId].defenderId;
        uint256 tankCount = force.getDefendingTankCount(defenderId);
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        uint256 randomTankCount = (randomNumbers[1] % 15);
        if(tankCount <= randomTankCount) {
            force.decreaseDefendingTankCount(tankCount, defenderId);
        } else {
            force.decreaseDefendingTankCount(randomTankCount, defenderId);
        }
    }

    function destroyTech(uint256 attackId) internal {
        uint256 defenderId = attackIdToCruiseMissile[attackId].defenderId;
        uint256 techCount = inf.getTechnologyCount(defenderId);
        require(techCount >= 1, "not enought tech");
        // uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        // uint256 randomNumber = randomNumbers[1];
        inf.decreaseTechCountFromCruiseMissileContract(defenderId, 1);
    }

    function destroyInfrastructure(uint256 attackId) internal {
        uint256 defenderId = attackIdToCruiseMissile[attackId].defenderId;
        uint256 infrastructureCount = inf.getInfrastructureCount(defenderId);
        require(infrastructureCount >= 5, "not enough infrastructure");
        // uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        // uint256 randomNumber = (randomNumbers[1] % );
        inf.decreaseInfrastructureCountFromCruiseMissileContract(defenderId, 5);
    }


}
