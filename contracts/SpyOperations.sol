//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "./Infrastructure.sol";
import "./Forces.sol";
import "./Military.sol";
import "./NationStrength.sol";
import "./Treasury.sol";
import "./CountryParameters.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "hardhat/console.sol";

///@title SpyOperationsContract
///@author OxSnosh
///@dev this contact inherits from openzeppelin's ownable contract
///@dev this contract inherits from chanlinks VRF contract
contract SpyOperationsContract is Ownable, VRFConsumerBaseV2 {
    uint256 public spyAttackId;
    address public forces;
    address public infrastructure;
    address public military;
    address public nationStrength;
    address public treasury;
    address public parameters;
    address public missiles;
    address public wonders1;
    address public countryMinter;

    //Chainlik Variables
    uint256[] private s_randomWords;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 3;

    ForcesContract force;
    InfrastructureContract inf;
    MilitaryContract mil;
    NationStrengthContract strength;
    TreasuryContract tsy;
    CountryParametersContract params;
    MissilesContract mis;
    WondersContract1 won1;
    CountryMinter mint;

    struct SpyAttack {
        uint256 attackerId;
        uint256 defenderId;
        uint256 attackType;
    }

    mapping(uint256 => SpyAttack) spyAttackIdToSpyAttack;
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;

    event randomNumbersRequested(uint256 indexed requestId);

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

    function settings (
        address _infrastructure,
        address _forces,
        address _military,
        address _nationStrength,
        address _wonders1,
        address _treasury,
        address _parameters,
        address _missiles,
        address _countryMinter
    ) public onlyOwner {
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        forces = _forces;
        force = ForcesContract(_forces);
        military = _military;
        mil = MilitaryContract(_military);
        nationStrength = _nationStrength;
        strength = NationStrengthContract(_nationStrength);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
        parameters = _parameters;
        params = CountryParametersContract(_parameters);
        missiles = _missiles;
        mis = MissilesContract(_missiles);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
    }

    function updateInfrastructureContract(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    ///@dev this functin is callable only by a nation owner and will allow a naton to conduct a spy operation
    ///@notice this function will allow a nation to conduct a spy operation against another nation
    ///@param attackerId is the id of the attacking nation
    ///@param defenderId is the id of the defending nation
    /**@param attackType is the type of attack
     * 1. gather intelligence
     * 2. destroy cruise missiles
     * 3. destroy defending tanks
     * 4. capture land
     * 5. change governemnt
     * 6. change religion
     * 7. chenge threat level
     * 8. change defcon
     * 9. destroy spies
     * 10. capture tech
     * 11. sabatoge taxes
     * 12. capture money reserves
     * 13. capture infrastructure
     * 14. destroy nukes
    */
    function conductSpyOperation(
        uint256 attackerId,
        uint256 defenderId,
        uint256 attackType
    ) public {
        bool isOwner = mint.checkOwnership(attackerId, msg.sender);
        require(isOwner, "!nation owner");
        bool warPreference = mil.getWarPeacePreference(defenderId);
        if (warPreference == false) {
            require(attackType == 1, "invalid attack type");
        }
        if (warPreference == true) {
            require(attackType >= 1, "invalid attack type");
            require(attackType <= 15, "invalid attack type");
        }
        uint256 attackerSpyCount = force.getSpyCount(attackerId);
        require(attackerSpyCount > 0, "you do not have spies to attack with");
        SpyAttack storage newSpyAttack = spyAttackIdToSpyAttack[spyAttackId];
        newSpyAttack.attackerId = attackerId;
        newSpyAttack.defenderId = defenderId;
        newSpyAttack.attackType = attackType;
        // spyAttackIdToSpyAttack[spyAttackId].attackerId = attackerId;
        // spyAttackIdToSpyAttack[spyAttackId].defenderId = defenderId;
        // spyAttackIdToSpyAttack[spyAttackId].attackType = attackType;
        fulfillRequest(spyAttackId);
        spyAttackId++;
    }

    //make internal
    function fulfillRequest(uint256 id) public {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToRequestIndex[requestId] = id;
        emit randomNumbersRequested(requestId);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        console.log(randomWords[0]);
        console.log(randomWords[1]);
        console.log(randomWords[2]);
        s_randomWords = randomWords;
        uint256 attackType = spyAttackIdToSpyAttack[requestNumber].attackType;
        uint256 attackerId = spyAttackIdToSpyAttack[requestNumber].attackerId;
        uint256 attackerSuccessScore = getAttackerSuccessScore(attackerId);
        uint256 defenderId = spyAttackIdToSpyAttack[requestNumber].defenderId;
        uint256 defenderSuccessScore = getDefenseSuccessScore(defenderId);
        uint256 totalSuccessScore = defenderSuccessScore + attackerSuccessScore;
        console.log(attackType, "attackType");
        console.log(attackerId, "attackerId");
        console.log(defenderId, "defenderId");
        uint256 randomSuccessNumber = (s_randomWords[0] % totalSuccessScore);
        console.log(randomSuccessNumber, "needs to be lower than", attackerSuccessScore);
        if (randomSuccessNumber <= attackerSuccessScore) {
            console.log("Success");
            uint256 randomNumber2 = randomWords[1];
            executeSpyOperation(
                attackerId,
                defenderId,
                attackType,
                requestNumber,
                randomNumber2
            );
        } else {
            force.decreaseAttackerSpyCount(attackerId);
            console.log("Mission Failed");
        }
    }

    function attackOdds(uint256 attackerId, uint256 defenderId) public view returns (uint256, uint256) {
        uint256 attackerSuccess = getAttackerSuccessScore(attackerId);
        uint256 defenderSuccess = getDefenseSuccessScore(defenderId);
        uint256 attackerOdds = ((attackerSuccess * 100) / (attackerSuccess + defenderSuccess));
        uint256 defenderOdds = ((defenderSuccess * 100) / (attackerSuccess + defenderSuccess));
        return (attackerOdds, defenderOdds);
    }

    function getAttackerSuccessScore(uint256 countryId)
        public
        view
        returns (uint256)
    {
        uint256 spyCount = force.getSpyCount(countryId);
        uint256 techAmount = inf.getTechnologyCount(countryId);
        uint256 attackSuccessScore = (spyCount + (techAmount / 15));
        bool cia = won1.getCentralIntelligenceAgency(countryId);
        if (cia) {
            attackSuccessScore = ((attackSuccessScore * 110) / 100);
        }
        return attackSuccessScore;
    }

    function getDefenseSuccessScore(uint256 countryId)
        public
        view
        returns (uint256)
    {
        uint256 spyCount = force.getSpyCount(countryId);
        uint256 techAmount = inf.getTechnologyCount(countryId);
        uint256 landAmount = inf.getLandCount(countryId);
        uint256 threatLevel = mil.getThreatLevel(countryId);
        uint256 defenseSuccessScoreGross = (spyCount +
            (techAmount / 20) +
            (landAmount / 70));
        uint256 defenseSuccessScore;
        if (threatLevel == 1) {
            defenseSuccessScore = ((defenseSuccessScoreGross * 75) / 100);
        } else if (threatLevel == 2) {
            defenseSuccessScore = ((defenseSuccessScoreGross * 90) / 100);
        } else if (threatLevel == 3) {
            defenseSuccessScore = defenseSuccessScoreGross;
        } else if (threatLevel == 4) {
            defenseSuccessScore = ((defenseSuccessScoreGross * 110) / 100);
        } else {
            defenseSuccessScore = ((defenseSuccessScoreGross * 125) / 100);
        }
        return defenseSuccessScore;
    }

    function executeSpyOperation(
        uint256 attackerId,
        uint256 defenderId,
        uint256 attackType,
        uint256 attackId,
        uint256 randomNumber2
    ) internal {
        console.log("Are we in the execute operation function?");
        uint256 defenderStrength = strength.getNationStrength(defenderId);
        if (attackType == 1) {
            uint256 cost = (200000 + (defenderStrength * 2));
            tsy.spendBalance(attackerId, cost);
            gatherIntelligence(); /*attackerId, defenderId, attackId*/
        } else if (attackType == 2) {
            console.log("did we get to attack type 2");
            uint256 cost = (100000 + (defenderStrength));
            console.log(cost);
            destroyCruiseMissiles(defenderId, /*attackId,*/ randomNumber2, attackerId);
            // tsy.spendBalance(attackerId, cost);
            // console.log("did we spend the $?");
        } else if (attackType == 3) {
            uint256 cost = (100000 + (defenderStrength * 2));
            tsy.spendBalance(attackerId, cost);
            destroyDefendingTanks(defenderId, attackId);
        } else if (attackType == 4) {
            uint256 cost = (100000 + (defenderStrength * 3));
            tsy.spendBalance(attackerId, cost);
            captureLand(attackerId, defenderId, attackId);
        } else if (attackType == 5) {
            uint256 cost = (100000 + (defenderStrength * 3));
            tsy.spendBalance(attackerId, cost);
            changeGovernment(defenderId, attackId);
        } else if (attackType == 6) {
            uint256 cost = (100000 + (defenderStrength * 3));
            tsy.spendBalance(attackerId, cost);
            changeReligion(defenderId, attackId);
        } else if (attackType == 7) {
            uint256 cost = (150000 + (defenderStrength));
            tsy.spendBalance(attackerId, cost);
            changeThreatLevel(defenderId, attackId);
        } else if (attackType == 8) {
            uint256 cost = (150000 + (defenderStrength * 5));
            tsy.spendBalance(attackerId, cost);
            changeDefconLevel(defenderId, attackId);
        } else if (attackType == 9) {
            uint256 cost = (250000 + (defenderStrength * 2));
            tsy.spendBalance(attackerId, cost);
            destroySpies(defenderId, attackId);
        } else if (attackType == 10) {
            uint256 cost = (300000 + (defenderStrength * 2));
            tsy.spendBalance(attackerId, cost);
            captueTechnology(attackerId, defenderId, attackId);
        } else if (attackType == 11) {
            uint256 cost = (100000 + (defenderStrength * 20));
            tsy.spendBalance(attackerId, cost);
            sabotogeTaxes(defenderId, attackId);
        } else if (attackType == 12) {
            uint256 cost = (300000 + (defenderStrength * 15));
            tsy.spendBalance(attackerId, cost);
            captureMoneyReserves(attackerId, defenderId);
        } else if (attackType == 13) {
            uint256 cost = (500000 + (defenderStrength * 5));
            tsy.spendBalance(attackerId, cost);
            captureInfrastructure(attackerId, defenderId, attackId);
        } else {
            uint256 cost = (500000 + (defenderStrength * 15));
            tsy.spendBalance(attackerId, cost);
            destroyNukes(defenderId);
        }
    }

    function gatherIntelligence() internal // uint256 attackerId,
    // uint256 defenderId,
    // uint256 attackId
    {

    }

    function destroyCruiseMissiles(uint256 defenderId, /*uint256 attackId,*/ uint256 randomNumber2, uint256 attackerId)
        internal
    {
        //random number between 3 and 5
        console.log("did we get to destroy cruise missiles function");
        // uint256[] storage randomNumbers = s_requestIndexToRandomWords[attackId];
        // console.log(randomNumbers[1]);
        // uint256 randomNumber = ((randomNumbers[1] % 3) + 2);
        console.log(randomNumber2);
        mis.decreaseCruiseMissileCount(randomNumber2, defenderId);
        console.log("missiles decreased?");
        uint256 defenderStrength = strength.getNationStrength(defenderId);
        uint256 cost = (100000 + (defenderStrength));
        console.log(cost);
        tsy.spendBalance(attackerId, cost);
        console.log("did we spend the $?");
    }

    function destroyDefendingTanks(uint256 defenderId, uint256 attackId)
        internal
    {
        //random number between 5% and 10%
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        uint256 randomNumber = ((randomNumbers[1] % 5) + 5);
        uint256 defendingTankCount = force.getDefendingTankCount(defenderId);
        uint256 tankAmountToDecrease = ((defendingTankCount * randomNumber) /
            100);
        force.decreaseDefendingTankCount(tankAmountToDecrease, defenderId);
    }

    function captureLand(
        uint256 attackerId,
        uint256 defenderId,
        uint256 attackId
    ) internal {
        //random number between 5 and 15
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        uint256 randomNumberToDecreaseFromDefender = ((randomNumbers[1] % 10) +
            5);
        uint256 randomNumberToAddToAttacker = ((randomNumbers[2]) %
            randomNumberToDecreaseFromDefender);
        uint256 landAmount = inf.getLandCount(defenderId);
        require(landAmount >= 15, "defender does not have enough land");
        inf.decreaseLandCount(defenderId, randomNumberToDecreaseFromDefender);
        inf.increaseLandCountFromSpyContract(
            attackerId,
            randomNumberToAddToAttacker
        );
    }

    function changeGovernment(uint256 defenderId, uint256 attackId) internal {
        //new government randomly chosen
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        uint256 governmentPreference = params.getGovernmentPreference(
            defenderId
        );
        uint256 newPreference = ((randomNumbers[1] % 10) + 1);
        if (newPreference == governmentPreference) {
            if (governmentPreference == 1) {
                newPreference += 1;
            } else {
                newPreference -= 1;
            }
        }
        params.updateDesiredGovernment(defenderId, newPreference);
    }

    function changeReligion(uint256 defenderId, uint256 attackId) internal {
        //new religion randomly chosen
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        uint256 religionPreference = params.getReligionPreference(defenderId);
        uint256 newPreference = ((randomNumbers[1] % 14) + 1);
        if (newPreference == religionPreference) {
            if (religionPreference == 1) {
                newPreference += 1;
            } else {
                newPreference -= 1;
            }
        }
        params.updateDesiredReligion(defenderId, newPreference);
    }

    function changeThreatLevel(uint256 defenderId, uint256 attackId) internal {
        //new level randomly chosen
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        uint256 threatLevel = mil.getThreatLevel(defenderId);
        uint256 newThreatLevel = ((randomNumbers[1] % 5) + 1);
        if (threatLevel == newThreatLevel) {
            if (threatLevel == 1) {
                newThreatLevel += 1;
            } else {
                newThreatLevel -= 1;
            }
        }
        mil.setThreatLevelFromSpyContract(defenderId, newThreatLevel);
    }

    function changeDefconLevel(uint256 defenderId, uint256 attackId) internal {
        //new level randomly chosen
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        uint256 defconLevel = mil.getDefconLevel(defenderId);
        uint256 newDefconLevel = ((randomNumbers[1] % 5) + 1);
        if (defconLevel == newDefconLevel) {
            if (defconLevel == 1) {
                newDefconLevel += 1;
            } else {
                newDefconLevel -= 1;
            }
        }
        mil.setDefconLevelFromSpyContract(defenderId, newDefconLevel);
    }

    function destroySpies(uint256 defenderId, uint256 attackId) internal {
        //max 20
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        uint256 spyCount = force.getSpyCount(defenderId);
        uint256 spyCountToDestroy = ((randomNumbers[1] % 20) + 1);
        if (spyCountToDestroy > spyCount) {
            spyCountToDestroy = spyCount;
        }
        force.decreaseDefenderSpyCount(spyCountToDestroy, defenderId);
    }

    function captueTechnology(
        uint256 attackerId,
        uint256 defenderId,
        uint256 attackId
    ) internal {
        //random number between 5 and 15
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        uint256 randomNumberToDecreaseFromDefender = ((randomNumbers[1] % 10) +
            5);
        uint256 randomNumberToAddToAttacker = ((randomNumbers[2]) %
            randomNumberToDecreaseFromDefender);
        uint256 techAmount = inf.getTechnologyCount(defenderId);
        require(techAmount >= 15, "defender does not have enough tech");
        inf.decreaseTechCountFromSpyContract(
            defenderId,
            randomNumberToDecreaseFromDefender
        );
        inf.increaseTechCountFromSpyContract(
            attackerId,
            randomNumberToAddToAttacker
        );
    }

    function sabotogeTaxes(uint256 defenderId, uint256 attackId) internal {
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        uint256 randomNumberToSetTaxes = ((randomNumbers[1] % 4) + 20);
        inf.setTaxRateFromSpyContract(defenderId, randomNumberToSetTaxes);
    }

    function captureMoneyReserves(uint256 attackerId, uint256 defenderId)
        internal
    {
        //max 5% or $10 million
        uint256 defenderBalance = tsy.checkBalance(defenderId);
        uint256 amountToTransfer;
        if (defenderBalance <= 200000000) {
            amountToTransfer = ((defenderBalance * 5) / 100);
        } else {
            amountToTransfer = 10000000;
        }
        tsy.transferBalance(attackerId, defenderId, amountToTransfer);
    }

    function captureInfrastructure(
        uint256 attackerId,
        uint256 defenderId,
        uint256 attackId
    ) internal {
        //random between 5 and 15
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        uint256 randomNumberToDecreaseFromDefender = ((randomNumbers[1] % 10) +
            5);
        uint256 randomNumberToAddToAttacker = ((randomNumbers[2]) %
            randomNumberToDecreaseFromDefender);
        uint256 infrastructureAmount = inf.getInfrastructureCount(defenderId);
        require(
            infrastructureAmount >= 15,
            "defender does not have enough infrastructure"
        );
        inf.decreaseInfrastructureCountFromSpyContract(
            defenderId,
            randomNumberToDecreaseFromDefender
        );
        inf.increaseInfrastructureCountFromSpyContract(
            attackerId,
            randomNumberToAddToAttacker
        );
    }

    function destroyNukes(uint256 defenderId) internal {
        //max 1
        mis.decreaseNukeCountFromSpyContract(defenderId);
    }
}
