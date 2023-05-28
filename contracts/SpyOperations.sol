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
    address public wonders2;
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
    WondersContract2 won2;
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

    function settings(
        address _infrastructure,
        address _forces,
        address _military,
        address _nationStrength,
        address _wonders1,
        address _wonders2,
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
        wonders2 = _wonders2;
        won2 = WondersContract2(_wonders2);
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
        uint256 infrastructureAmount = inf.getInfrastructureCount(defenderId);
        uint256 techAmount = inf.getTechnologyCount(defenderId);
        uint256 landAmount = inf.getLandCount(defenderId);
        if(attackType == 4) {
            require(
                landAmount >= 15,
                "defender does not have enough land to conduct operation"
            );
        }
        if(attackType == 10) {
            require(
                techAmount >= 15,
                "defender does not have enough tech to conduct operation"
            );
        }
        if(attackType == 13) {
            require(
                infrastructureAmount >= 15,
                "defender does not have enough infrastructure to conduct operation"
            );
        }
        uint256 nukeCount = mis.getNukeCount(defenderId);
        bool silo = won2.getHiddenNuclearMissileSilo(defenderId);
        if(attackType == 14) {
            if (silo) {
                require(
                    nukeCount >= 6,
                    "defender does not have enough nukes to conduct operation"
                );
            } else {
                require(
                    nukeCount >= 1,
                    "defender does not have enough nukes to conduct operation"
                );
            }
        }
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

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        s_randomWords = randomWords;
        uint256 attackType = spyAttackIdToSpyAttack[requestNumber].attackType;
        uint256 attackerId = spyAttackIdToSpyAttack[requestNumber].attackerId;
        uint256 attackerSuccessScore = getAttackerSuccessScore(attackerId);
        uint256 defenderId = spyAttackIdToSpyAttack[requestNumber].defenderId;
        uint256 defenderSuccessScore = getDefenseSuccessScore(defenderId);
        uint256 totalSuccessScore = defenderSuccessScore + attackerSuccessScore;
        uint256 randomSuccessNumber = (s_randomWords[0] % totalSuccessScore);
        if (randomSuccessNumber <= attackerSuccessScore) {
            console.log("Mission Success");
            executeSpyOperation(
                attackerId,
                defenderId,
                attackType,
                requestNumber
            );
        } else {
            force.decreaseAttackerSpyCount(attackerId);
            console.log("Mission Failed");
        }
    }

    function attackOdds(
        uint256 attackerId,
        uint256 defenderId
    ) public view returns (uint256, uint256) {
        uint256 attackerSuccess = getAttackerSuccessScore(attackerId);
        uint256 defenderSuccess = getDefenseSuccessScore(defenderId);
        uint256 attackerOdds = ((attackerSuccess * 100) /
            (attackerSuccess + defenderSuccess));
        uint256 defenderOdds = ((defenderSuccess * 100) /
            (attackerSuccess + defenderSuccess));
        return (attackerOdds, defenderOdds);
    }

    function getAttackerSuccessScore(
        uint256 countryId
    ) public view returns (uint256) {
        uint256 spyCount = force.getSpyCount(countryId);
        uint256 techAmount = inf.getTechnologyCount(countryId);
        uint256 attackSuccessScore = (spyCount + (techAmount / 15));
        bool cia = won1.getCentralIntelligenceAgency(countryId);
        if (cia) {
            attackSuccessScore = ((attackSuccessScore * 110) / 100);
        }
        bool accomodativeGovt = checkAccomodativeGovernment(countryId);
        if (accomodativeGovt) {
            attackSuccessScore = ((attackSuccessScore * 110) / 100);
        }
        return attackSuccessScore;
    }

    function checkAccomodativeGovernment(uint256 countryId)
        public
        view
        returns (bool)
    {
        uint256 government = params.getGovernmentType(
            countryId
        );
        if (
            government == 2 ||
            government == 7 ||
            government == 10
        ) {
            return true;
        } else {
            return false;
        }
    }

    function getDefenseSuccessScore(
        uint256 countryId
    ) public view returns (uint256) {
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
        uint256 attackId
    ) internal {
        uint256 defenderStrength = strength.getNationStrength(defenderId);
        if (attackType == 1) {
            uint256 cost = (200000 + (defenderStrength * 2));
            tsy.spendBalance(attackerId, cost);
            gatherIntelligence();
        } else if (attackType == 2) {
            uint256 cost = ((100000 + defenderStrength) * (10 ** 18));
            tsy.spendBalance(attackerId, cost);
            destroyCruiseMissiles(defenderId, attackId);
        } else if (attackType == 3) {
            uint256 cost = (100000 + (defenderStrength * 2) * (10 ** 18));
            tsy.spendBalance(attackerId, cost);
            destroyDefendingTanks(defenderId, attackId);
        } else if (attackType == 4) {
            uint256 cost = (100000 + (defenderStrength * 3) * (10 ** 18));
            tsy.spendBalance(attackerId, cost);
            captureLand(attackerId, defenderId, attackId);
        } else if (attackType == 5) {
            uint256 cost = (100000 + (defenderStrength * 3) * (10 ** 18));
            tsy.spendBalance(attackerId, cost);
            changeDesiredGovernment(defenderId, attackId);
        } else if (attackType == 6) {
            uint256 cost = (100000 + (defenderStrength * 3) * (10 ** 18));
            tsy.spendBalance(attackerId, cost);
            changeDesiredReligion(defenderId, attackId);
        } else if (attackType == 7) {
            uint256 cost = (150000 + (defenderStrength) * (10 ** 18));
            tsy.spendBalance(attackerId, cost);
            changeThreatLevel(defenderId, attackId);
        } else if (attackType == 8) {
            uint256 cost = (150000 + (defenderStrength * 5) * (10 ** 18));
            tsy.spendBalance(attackerId, cost);
            changeDefconLevel(defenderId, attackId);
        } else if (attackType == 9) {
            uint256 cost = (250000 + (defenderStrength * 2) * (10 ** 18));
            tsy.spendBalance(attackerId, cost);
            destroySpies(defenderId, attackId);
        } else if (attackType == 10) {
            uint256 cost = (300000 + (defenderStrength * 2) * (10 ** 18));
            tsy.spendBalance(attackerId, cost);
            captueTechnology(attackerId, defenderId, attackId);
        } else if (attackType == 11) {
            uint256 cost = (100000 + (defenderStrength * 20) * (10 ** 18));
            tsy.spendBalance(attackerId, cost);
            sabotogeTaxes(defenderId, attackId);
        } else if (attackType == 12) {
            uint256 cost = (300000 + (defenderStrength * 15) * (10 ** 18));
            tsy.spendBalance(attackerId, cost);
            captureMoneyReserves(attackerId, defenderId);
        } else if (attackType == 13) {
            uint256 cost = (500000 + (defenderStrength * 5) * (10 ** 18));
            tsy.spendBalance(attackerId, cost);
            captureInfrastructure(attackerId, defenderId, attackId);
        } else {
            uint256 cost = (500000 + (defenderStrength * 15) * (10 ** 18));
            tsy.spendBalance(attackerId, cost);
            destroyNukes(defenderId);
        }
    }

    function gatherIntelligence() internal // uint256 attackerId,
    // uint256 defenderId,
    // uint256 attackId
    {

    }

    function destroyCruiseMissiles(
        uint256 defenderId,
        uint256 attackId
    ) internal {
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        uint256 randomNumber2 = (randomNumbers[1] % 5) + 1;
        mis.decreaseCruiseMissileCount(randomNumber2, defenderId);
    }

    function destroyDefendingTanks(
        uint256 defenderId,
        uint256 attackId
    ) internal {
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
        inf.decreaseLandCount(defenderId, randomNumberToDecreaseFromDefender);
        inf.increaseLandCountFromSpyContract(
            attackerId,
            randomNumberToAddToAttacker
        );
    }

    function changeDesiredGovernment(
        uint256 defenderId,
        uint256 attackId
    ) internal {
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

    function changeDesiredReligion(
        uint256 defenderId,
        uint256 attackId
    ) internal {
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
        uint256 randomNumberToCapture = ((randomNumbers[1] % 10) + 5);
        inf.decreaseTechCountFromSpyContract(defenderId, randomNumberToCapture);
        inf.increaseTechCountFromSpyContract(attackerId, randomNumberToCapture);
    }

    function sabotogeTaxes(uint256 defenderId, uint256 attackId) internal {
        uint256[] memory randomNumbers = s_requestIndexToRandomWords[attackId];
        uint256 randomNumberToSetTaxes = ((randomNumbers[1] % 4) + 20);
        inf.setTaxRateFromSpyContract(defenderId, randomNumberToSetTaxes);
    }

    function captureMoneyReserves(
        uint256 attackerId,
        uint256 defenderId
    ) internal {
        //max 5% or $10 million
        uint256 defenderBalance = tsy.checkBalance(defenderId);
        uint256 amountToTransfer;
        if (defenderBalance <= (20000000 * (10 ** 18))) {
            amountToTransfer = ((defenderBalance * 5) / 100);
        } else {
            amountToTransfer = (1000000 * (10 ** 18));
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
        uint256 randomNumberToExchange = ((randomNumbers[1] % 10) + 5);
        inf.decreaseInfrastructureCountFromSpyContract(
            defenderId,
            randomNumberToExchange
        );
        inf.increaseInfrastructureCountFromSpyContract(
            attackerId,
            randomNumberToExchange
        );
    }

    function destroyNukes(uint256 defenderId) internal {
        //max 1
        mis.decreaseNukeCountFromSpyContract(defenderId);
    }
}
