//SPDX-License-Identifier: Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International
pragma solidity 0.8.17;

import "./Forces.sol";
import "./CountryMinter.sol";
import "./War.sol";
import "./Infrastructure.sol";
import "./Wonders.sol";
import "./Missiles.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "hardhat/console.sol";

///@title CruiseMissileContract
///@author OxSnosh
///@notice this contract will allow a nation owner to launch a cruise missile attack against another nation
///@dev this contract inherits from OpenZeppelin ownable and Chainlink VRF
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
    address public wonders2;

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
    WondersContract2 won2;

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

    event CruiseMissileLaunched(
        uint256 indexed attackId,
        uint256 indexed attackerId,
        uint256 indexed defenderId,
        uint256 warId
    );

    event CruiseMissileAttackResults(
        uint256 indexed attackId,
        uint256 indexed attackerId,
        uint256 indexed defenderId,
        bool landed,
        uint256 warId,
        uint256 damageTypeNumber
    );

    ///@dev this is the constructor that inherits chainlink variables to use chainlink VRF
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

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _forces,
        address _countryMinter,
        address _war,
        address _infrastructure,
        address _missiles
    ) public onlyOwner {
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
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings2(
        address _improvements1,
        address _improvements3,
        address _improvements4,
        address _wonders2
    ) public onlyOwner {
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        improvements3 = _improvements3;
        imp3 = ImprovementsContract3(_improvements3);
        improvements4 = _improvements4;
        imp4 = ImprovementsContract4(_improvements4);
        wonders2 = _wonders2;
        won2 = WondersContract2(_wonders2);
    }

    ///@dev this function is only callable by the contract owner
    function updateForcesContract(address newAddress) public onlyOwner {
        forces = newAddress;
        force = ForcesContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateCountryMinter(address newAddress) public onlyOwner {
        countryMinter = newAddress;
        mint = CountryMinter(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateWarContract(address newAddress) public onlyOwner {
        warAddress = newAddress;
        war = WarContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateInfrastructureContract(address newAddress) public onlyOwner {
        warAddress = newAddress;
        war = WarContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateMissilesContract(address newAddress) public onlyOwner {
        missiles = newAddress;
        mis = MissilesContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateImprovementsContract1(address newAddress) public onlyOwner {
        improvements1 = newAddress;
        imp1 = ImprovementsContract1(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateImprovementsContract3(address newAddress) public onlyOwner {
        improvements3 = newAddress;
        imp3 = ImprovementsContract3(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateImprovementsContract4(address newAddress) public onlyOwner {
        improvements4 = newAddress;
        imp4 = ImprovementsContract4(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateWondersContract2(address newAddress) public onlyOwner {
        wonders2 = newAddress;
        won2 = WondersContract2(newAddress);
    }

    ///@dev this is a public function that will allow a nation to launch a cruise missile attack against another nation
    ///@notice this function allows a nation owner to launch a cruise missile attack
    ///@notice can only attack another nation where war is currently declared
    ///@param attackerId is the ID of the attacking nation
    ///@param defenderId is the ID of the defendin nation
    ///@param warId is the ID for the war between the two nations
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
        (uint256 offense, uint256 defense) = war.getInvolvedParties(warId);
        require(
            (attackerId == offense && defenderId == defense) ||
                (attackerId == defense && defenderId == offense),
            "not involved in war"
        );
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
        emit CruiseMissileLaunched(
            cruiseMissileAttackId,
            attackerId,
            defenderId,
            warId
        );
        war.cancelPeaceOffersUponAttack(warId);
        fulfillRequest(cruiseMissileAttackId);
        cruiseMissileAttackId++;
    }

    ///@dev this is an internal function that will call the VRFCoordinator from randomness from chainlink
    ///@param id this is the ID of the cruise missile attack
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

    ///@dev this is the fnction that the ChainlinkVRF contract will call when it responds
    ///@dev this function randomly determine the outcome of the cruise missile attack
    ///@notice this function will randomly determine is the cruise missile attacke was successful
    ///@notice attacker satellites increase the odds of a successful attack
    ///@notice defender satellites and intercepor middile system will increase the odds of a missile attack being thwarted
    ///@notice a successful cruise missile attacke will reduce defender tanks, tech or infrastructure (type selected randomly)
    ///@param requestId id the ID number for the request made to the VRF contract
    ///@param randomWords is the random numbers that the ChainlinkVRF contract responds with
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        s_randomWords = randomWords;
        uint256 defenderId = attackIdToCruiseMissile[requestNumber].defenderId;
        uint256 attackerId = attackIdToCruiseMissile[requestNumber].attackerId;
        uint256 successOdds = getSuccessOdds(attackerId, defenderId);
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[
            requestNumber
        ];
        uint256 successNumber = (randomNumbers[0] % 100);
        uint256 damageTypeNumber = (randomNumbers[1] % 3);
        if (successNumber < successOdds) {
            emit CruiseMissileAttackResults(
                requestNumber,
                attackerId,
                defenderId,
                true,
                attackIdToCruiseMissile[requestNumber].warId,
                damageTypeNumber
            );
            if (damageTypeNumber == 0) {
                destroyTanks(requestNumber);
            } else if (damageTypeNumber == 1) {
                destroyTech(requestNumber);
            } else if (damageTypeNumber == 2) {
                destroyInfrastructure(requestNumber);
            }
        } else {
            emit CruiseMissileAttackResults(
                requestNumber,
                attackerId,
                defenderId,
                false,
                attackIdToCruiseMissile[requestNumber].warId,
                0
            );
        }
    }

    function getSuccessOdds(
        uint256 attackerId,
        uint256 defenderId
    ) public view returns (uint256) {
        uint256 successOdds = 75;
        uint256 defenderMissileDefenses = imp4.getMissileDefenseCount(
            defenderId
        );
        uint256 attackerSattelites = imp3.getSatelliteCount(attackerId);
        bool interceptor = won2.getInterceptorMissileSystem(defenderId);
        if (interceptor) {
            successOdds -= 25;
        }
        if (defenderMissileDefenses > 0) {
            successOdds -= (5 * defenderMissileDefenses);
        }
        if (attackerSattelites > 0) {
            successOdds += (5 * attackerSattelites);
        }
        return successOdds;
    }

    ///@dev this is the internal function that will determine the number of tanks destroyed in a cruise missile attack
    ///@notice this function will decrease the number of tanks of the defender in a successful cruise missile attack
    ///@notice attacker munitions factories will increase the damage inflicted by a cruise missile attack on tanks
    ///@notice defender bunkers will decrease the damage infilcted by a cruise missile attack on tanks
    ///@param attackId is the ID of the cruise missile attack
    function destroyTanks(uint256 attackId) internal {
        uint256 defenderId = attackIdToCruiseMissile[attackId].defenderId;
        uint256 attackerId = attackIdToCruiseMissile[attackId].attackerId;
        uint256 tankCount = force.getDefendingTankCount(defenderId);
        if (tankCount == 0) {
            destroyInfrastructure(attackId);
        } else {
            uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
            uint256 defenderBunkerCount = imp1.getBunkerCount(defenderId);
            uint256 attackerMunitionsFactory = imp4.getMunitionsFactoryCount(
                attackerId
            );
            uint256 randomTankCount = (10 +
                (randomNumbers[2] % 6) +
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
    }

    ///@dev this is an internal function that will decrease defender Tech in the event of a successful cruise missile launch
    ///@notice this function will decrease the tech of a defending nation in the event of a successful cruise missile attack
    ///@notice attacker munitions factories will increase the damage inflicted by a cruise missile attack on tech
    ///@notice defender bunkers will decrease the damage infilcted by a cruise missile attack on tech
    ///@param attackId is the ID of the cruise missile attack
    function destroyTech(uint256 attackId) internal {
        uint256 defenderId = attackIdToCruiseMissile[attackId].defenderId;
        uint256 attackerId = attackIdToCruiseMissile[attackId].attackerId;
        uint256 techCount = inf.getTechnologyCount(defenderId);
        if (techCount >= 5) {
            uint256 defenderBunkerCount = imp1.getBunkerCount(defenderId);
            uint256 attackerMunitionsFactory = imp4.getMunitionsFactoryCount(
                attackerId
            );
            uint256 amount = 6;
            if (defenderBunkerCount >= 1) {
                amount -= defenderBunkerCount;
            }
            if (attackerMunitionsFactory >= 1) {
                amount += attackerMunitionsFactory;
            }
            inf.decreaseTechCountFromCruiseMissileContract(defenderId, amount);
        }
    }

    ///@dev this is an internal function that will decrease defender Infrastructure in the event of a successful cruise missile attack
    ///@notice this function will decrease the infrastructure of a defending nation in the event of a successful cruise missile attack
    ///@notice attacker munitions factories will increase the damage inflicted by a cruise missile attack on infrastructure
    ///@notice defender bunkers will decrease the damage infilcted by a cruise missile attack on infrastructure
    ///@param attackId is the ID of the cruise missile attack
    function destroyInfrastructure(uint256 attackId) internal {
        uint256 defenderId = attackIdToCruiseMissile[attackId].defenderId;
        uint256 attackerId = attackIdToCruiseMissile[attackId].attackerId;
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[
            attackId
        ];
        uint256 defenderBunkerCount = imp1.getBunkerCount(defenderId);
        uint256 attackerMunitionsFactory = imp4.getMunitionsFactoryCount(
            attackerId
        );
        uint256 randomInfrastructureCount = 6;
        uint256 randomModulus = randomNumbers[2] % 6;
        randomInfrastructureCount += randomModulus;
        randomInfrastructureCount += attackerMunitionsFactory;
        randomInfrastructureCount -= defenderBunkerCount;
        inf.decreaseInfrastructureCountFromCruiseMissileContract(
            defenderId,
            randomInfrastructureCount
        );
    }
}
