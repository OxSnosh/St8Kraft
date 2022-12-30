//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./CountryMinter.sol";
import "./Resources.sol";
import "./Improvements.sol";
import "./Infrastructure.sol";
import "./Wonders.sol";
import "./Treasury.sol";
import "./CountryParameters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InfrastructureMarketContract is Ownable {
    address public countryMinter;
    address public resources;
    address public infrastructure;
    address public improvements1;
    address public wonders2;
    address public wonders3;
    address public treasury;
    address public parameters;

    CountryMinter mint;
    ResourcesContract res;
    ImprovementsContract1 imp1;
    WondersContract2 won2;
    WondersContract3 won3;
    CountryParametersContract param;
    InfrastructureContract inf;
    TreasuryContract tsy;

    function settings(
        address _resources,
        address _parameters,
        address _improvements1,
        address _countryMinter,
        address _wonders2,
        address _wonders3,
        address _treasury,
        address _infrastructure
    ) public onlyOwner {
        resources = _resources;
        res = ResourcesContract(_resources);
        parameters = _parameters;
        param = CountryParametersContract(_parameters);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        wonders2 = _wonders2;
        won2 = WondersContract2(_wonders2);
        wonders3 = _wonders3;
        won3 = WondersContract3(_wonders3);
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
    }

    function buyInfrastructure(uint256 id, uint256 buyAmount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 costPerLevel = getInfrastructureCostPerLevel(id);
        uint256 cost = buyAmount * costPerLevel;
        inf.increaseInfrastructureFromMarket(id, buyAmount);
        tsy.spendBalance(id, cost);
    }

    function getInfrastructureCostPerLevel(
        uint256 id
    ) public view returns (uint256) {
        uint256 grossCost;
        uint256 currentInfrastructureAmount = inf.getInfrastructureCount(id);
        if (currentInfrastructureAmount < 20) {
            grossCost = 500;
        } else if (currentInfrastructureAmount < 100) {
            grossCost = ((currentInfrastructureAmount * 12) + 500);
        } else if (currentInfrastructureAmount < 200) {
            grossCost = ((currentInfrastructureAmount * 15) + 500);
        } else if (currentInfrastructureAmount < 1000) {
            grossCost = ((currentInfrastructureAmount * 20) + 500);
        } else if (currentInfrastructureAmount < 3000) {
            grossCost = ((currentInfrastructureAmount * 25) + 500);
        } else if (currentInfrastructureAmount < 4000) {
            grossCost = ((currentInfrastructureAmount * 30) + 500);
        } else if (currentInfrastructureAmount < 5000) {
            grossCost = ((currentInfrastructureAmount * 40) + 500);
        } else if (currentInfrastructureAmount < 8000) {
            grossCost = ((currentInfrastructureAmount * 60) + 500);
        } else if (currentInfrastructureAmount < 15000) {
            grossCost = ((currentInfrastructureAmount * 70) + 500);
        } else {
            grossCost = ((currentInfrastructureAmount * 80) + 500);
        }
        uint256 costAdjustments1 = getInfrastructureCostMultiplier1(id);
        uint256 costAdjustments2 = getInfrastructureCostMultiplier2(id);
        uint256 costAdjustments3 = getInfrastructureCostMultiplier3(id);
        uint256 adjustments = (costAdjustments1 +
            costAdjustments2 +
            costAdjustments3);
        uint256 multiplier = (100 - adjustments);
        uint256 adjustedCostPerLevel = ((grossCost * multiplier));
        return adjustedCostPerLevel * (10**18);
    }

    function getInfrastructureCostMultiplier1(
        uint256 id
    ) public view returns (uint256) {
        uint256 lumberMultiplier = 0;
        uint256 ironMultiplier = 0;
        uint256 marbleMultiplier = 0;
        bool isLumber = res.viewLumber(id);
        bool isIron = res.viewIron(id);
        bool isMarble = res.viewMarble(id);
        if (isLumber) {
            lumberMultiplier = 6;
        }
        if (isIron) {
            ironMultiplier = 5;
        }
        if (isMarble) {
            marbleMultiplier = 10;
        }
        uint256 sumOfAdjustments = lumberMultiplier +
            ironMultiplier +
            marbleMultiplier;
        return sumOfAdjustments;
    }

    function getInfrastructureCostMultiplier2(
        uint256 id
    ) public view returns (uint256) {
        uint256 rubberMultiplier = 0;
        uint256 constructionMultiplier = 0;
        uint256 insterstateSystemMultiplier = 0;
        uint256 accomodativeGovernmentMultiplier = 0;
        uint256 factoryMultiplier = 0;
        bool isRubber = res.viewRubber(id);
        bool isConstruction = res.viewConstruction(id);
        bool isInterstateSystem = won2.getInterstateSystem(id);
        bool isAccomodativeGovernment = checkAccomodativeGovernment(id);
        uint256 factoryCount = imp1.getFactoryCount(id);
        bool scientificDevelopmentCenter = won3.getScientificDevelopmentCenter(
            id
        );
        if (isRubber) {
            rubberMultiplier = 3;
        }
        if (isConstruction) {
            constructionMultiplier = 5;
        }
        if (isInterstateSystem) {
            insterstateSystemMultiplier = 8;
        }
        if (isAccomodativeGovernment) {
            accomodativeGovernmentMultiplier = 5;
        }
        if (factoryCount > 0) {
            if (!scientificDevelopmentCenter) {
                factoryMultiplier = (factoryCount * 8);
            } else if (scientificDevelopmentCenter) {
                factoryMultiplier = (factoryCount * 10);
            }
        }
        uint256 sumOfAdjustments = rubberMultiplier +
            constructionMultiplier +
            insterstateSystemMultiplier +
            accomodativeGovernmentMultiplier +
            factoryMultiplier;
        return sumOfAdjustments;
    }

    function getInfrastructureCostMultiplier3(
        uint256 id
    ) public view returns (uint256) {
        uint256 aluminiumMultiplier = 0;
        uint256 coalMultiplier = 0;
        uint256 steelMultiplier = 0;
        uint256 asphaltMultiplier = 0;
        bool isAluminium = res.viewAluminium(id);
        bool isCoal = res.viewCoal(id);
        bool isSteel = res.viewSteel(id);
        bool isAsphalt = res.viewAsphalt(id);
        if (isAluminium) {
            aluminiumMultiplier = 7;
        }
        if (isCoal) {
            coalMultiplier = 4;
        }
        if (isSteel) {
            steelMultiplier = 2;
        }
        if (isAsphalt) {
            asphaltMultiplier = 5;
        }
        uint256 sumOfAdjustments = (aluminiumMultiplier +
            coalMultiplier +
            steelMultiplier +
            asphaltMultiplier);
        return sumOfAdjustments;
    }

    function checkAccomodativeGovernment(
        uint256 countryId
    ) public view returns (bool) {
        uint256 governmentType = param.getGovernmentType(countryId);
        if (
            governmentType == 2 ||
            governmentType == 5 ||
            governmentType == 6 ||
            governmentType == 7 ||
            governmentType == 8 ||
            governmentType == 9
        ) {
            return true;
        }
        return false;
    }

    function destroyInfrastructure(uint256 id, uint256 amount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 currentInfrastructureAmount = inf.getInfrastructureCount(id);
        require(
            (currentInfrastructureAmount - amount) >= 0,
            "not enough infrastructure"
        );
        inf.decreaseInfrastructureFromMarket(id, amount);
    }
}
