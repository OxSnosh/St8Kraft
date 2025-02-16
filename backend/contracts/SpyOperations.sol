//SPDX-License-Identifier: Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International
pragma solidity 0.8.17;

import "./Infrastructure.sol";
import "./Forces.sol";
import "./Military.sol";
import "./NationStrength.sol";
import "./Treasury.sol";
import "./CountryParameters.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "./KeeperFile.sol";
import "./Spies.sol";
import "./Missiles.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

///@title SpyOperationsContract
///@author OxSnosh
///@dev this contact inherits from openzeppelin's ownable contract
contract SpyOperationsContract is Ownable {

    uint256 public attackId;
    address public forces;
    address public spies;
    address public infrastructure;
    address public military;
    address public nationStrength;
    address public treasury;
    address public parameters;
    address public missiles;
    address public wonders1;
    address public wonders2;
    address public countryMinter;
    address public keeper;

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
    KeeperContract keep;
    SpyContract spy;

    struct SpyAttack {
        uint256 encryptedAttackerId;
        uint256 defenderId;
        uint256 attackType;
        bool attackThwarted;
        uint256 attackerId;
    }

    mapping(uint256 => SpyAttack) spyAttackIdToSpyAttack;
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_randomnessRequestIdToRandomWords;

    event randomNumbersRequested(uint256 indexed requestId);

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

    function settings2(address _keeper, address _spies) public onlyOwner {
        keeper = _keeper;
        keep = KeeperContract(_keeper);
        spies = _spies;
        spy = SpyContract(_spies);
    }

    ///@dev this functin is callable only by a nation owner and will allow a naton to conduct a spy operation
    ///@notice this function will allow a nation to conduct a spy operation against another nation
    ///@param defenderId is the id of the defending nation
    ///@param attackType the id of the attack as it is stored on this contract
    function checkSpyOperation(
        uint256 defenderId,
        uint256 attackType
    ) public view returns (bool) {
        uint256 infrastructureAmount = inf.getInfrastructureCount(defenderId);
        uint256 techAmount = inf.getTechnologyCount(defenderId);
        uint256 landAmount = inf.getLandCount(defenderId);
        if (attackType == 4) {
            require(
                landAmount >= 15,
                "defender does not have enough land to conduct operation"
            );
        }
        if (attackType == 10) {
            require(
                techAmount >= 15,
                "defender does not have enough tech to conduct operation"
            );
        }
        if (attackType == 13) {
            require(
                infrastructureAmount >= 15,
                "defender does not have enough infrastructure to conduct operation"
            );
        }
        uint256 nukeCount = mis.getNukeCount(defenderId);
        bool silo = won2.getHiddenNuclearMissileSilo(defenderId);
        if (attackType == 14) {
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
        return true;
    }


    function getAttackerSuccessScore(
        uint256 countryId
    ) public view returns (uint256) {
        uint256 spyCount = spy.getSpyCount(countryId);
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
        uint256 spyCount = spy.getSpyCount(countryId);
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

    event SpyAttackResults(
        uint256 indexed attackId,
        uint256 indexed attackerId,
        uint256 indexed defenderId,
        bool success,
        uint256 attackType
    );

    address relayer;

    function setRelayer(address _relayer) public onlyOwner {
        relayer = _relayer; 
    }

    modifier onlyRelayer() {
        require(msg.sender == relayer);
        _;
    }

    function spyAttack(bool success, uint256 attackType, uint256 defenderId, uint256 attackerId, uint256 cost, uint256 randomNumber) public onlyRelayer() {
        console.log("success", success);
        console.log("defenderId", defenderId);
        console.log("attackerId", attackerId);
        console.log("attackType", attackType);
        console.log("cost", cost);
        console.log("randomNumber", randomNumber);
        if (success) {
            tsy.spendBalance(attackerId, cost);
            emit SpyAttackResults (
                attackId,
                999999999,
                defenderId,
                true,
                attackType
            );
            completeSpyAttack(success, attackId, attackerId, defenderId, attackType, randomNumber);
        }
        attackId++;
    }

    function completeSpyAttack(
        bool success,
        uint256 _attackId,
        uint256 attackerId,
        uint256 defenderId,
        uint256 attackType,
        uint256 randomNumber
    ) internal {
        if (!success) {
            emit SpyAttackResults(
                _attackId,
                attackerId,
                defenderId,
                false,
                attackType
            );
        } else if (success) {
            if (attackType == 1) {
                destroyCruiseMissiles(defenderId, randomNumber);
            } else if (attackType == 2) {
                destroyDefendingTanks(defenderId, randomNumber);
            } else if (attackType == 3) {
                captureLand(defenderId, randomNumber);
            } else if (attackType == 4) {
                changeDesiredGovernment(defenderId, randomNumber);
            } else if (attackType == 5) {
                changeDesiredReligion(defenderId, randomNumber);
            } else if (attackType == 6) {
                changeThreatLevel(defenderId);
            } else if (attackType == 7) {
                changeDefconLevel(defenderId);
            } else if (attackType == 8) {
                destroySpies(defenderId, randomNumber);
            } else if (attackType == 9) {
                captueTechnology(defenderId, randomNumber);
            } else if (attackType == 10) {
                sabotogeTaxes(defenderId, randomNumber);
            } else if (attackType == 11) {
                destroyMoneyReserves(defenderId);
            } else if (attackType == 12) {
                captureInfrastructure(defenderId, randomNumber);
            } else {
                destroyNukes(defenderId);
            }
        }
    }

    function destroyCruiseMissiles(
        uint256 defenderId,
        uint256 randomNumber
    ) internal {
        uint256 randomNumber2 = (randomNumber % 5) + 1;
        mis.decreaseCruiseMissileCount(randomNumber2, defenderId);
    }

    function destroyDefendingTanks(
        uint256 defenderId,
        uint256 randomNumber
    ) internal {
        uint256 randomPercentage = ((randomNumber % 5) + 5);
        uint256 defendingTankCount = force.getDefendingTankCount(defenderId);
        uint256 tankAmountToDecrease = ((defendingTankCount * randomPercentage) /
            100);
        force.decreaseDefendingTankCount(tankAmountToDecrease, defenderId);
    }

    function captureLand(
        uint256 defenderId,
        uint256 randomNumber
    ) internal {
        uint256 randomNumberToDecreaseFromDefender = ((randomNumber % 10) +
            5);
        inf.decreaseLandCountFromSpyContract(defenderId, randomNumberToDecreaseFromDefender);
    }

    function changeDesiredGovernment(
        uint256 defenderId,
        uint256 randomNumber
    ) internal {
        uint256 governmentPreference = params.getGovernmentPreference(
            defenderId
        );
        uint256 newPreference = ((randomNumber % 10) + 1);
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
        uint256 randomNumber
    ) internal {
        uint256 religionPreference = params.getReligionPreference(defenderId);
        uint256 newPreference = ((randomNumber % 14) + 1);
        if (newPreference == religionPreference) {
            if (religionPreference == 1) {
                newPreference += 1;
            } else {
                newPreference -= 1;
            }
        }
        params.updateDesiredReligion(defenderId, newPreference);
    }

    function changeThreatLevel(
        uint256 defenderId
    ) internal {
        mil.setThreatLevelFromSpyContract(defenderId, 1);
    }

    function changeDefconLevel(
        uint256 defenderId
    ) internal {
        mil.setDefconLevelFromSpyContract(defenderId, 5);
    }

    function destroySpies(
        uint256 defenderId,
        uint256 randomNumber
    ) internal {
        uint256 spyCount = spy.getSpyCount(defenderId);
        uint256 spyCountToDestroy = ((randomNumber % 20) + 1);
        if (spyCountToDestroy > spyCount) {
            spyCountToDestroy = spyCount;
        }
        spy.decreaseDefenderSpyCount(spyCountToDestroy, defenderId);
    }

    function captueTechnology(
        uint256 defenderId,
        uint256 randomNumber
    ) internal {
        uint256 randomNumberToCapture = ((randomNumber % 10) + 5);
        inf.decreaseTechCountFromSpyContract(defenderId, randomNumberToCapture);
    }

    function sabotogeTaxes(
        uint256 defenderId,
        uint256 randomNumber
    ) internal {

        uint256 randomNumberToSetTaxes = ((randomNumber % 4) + 20);
        inf.setTaxRateFromSpyContract(defenderId, randomNumberToSetTaxes);
    }

    function destroyMoneyReserves(uint256 defenderId) internal {
        //max 5% or $10 million
        uint256 defenderBalance = tsy.checkBalance(defenderId);
        uint256 amountToDestroy;
        if (defenderBalance <= (20000000 * (10 ** 18))) {
            amountToDestroy = ((defenderBalance * 5) / 100);
        } else {
            amountToDestroy = (1000000 * (10 ** 18));
        }
        tsy.destroyBalance(defenderId, amountToDestroy);
    }

    function captureInfrastructure(
        uint256 defenderId,
        uint256 randomNumber
    ) internal {
        uint256 randomNumberToExchange = ((randomNumber % 10) + 5);
        inf.decreaseInfrastructureCountFromSpyContract(
            defenderId,
            randomNumberToExchange
        );
    }

    function destroyNukes(uint256 defenderId) internal {
        //max 1
        mis.decreaseNukeCountFromSpyContract(defenderId);
    }
}
