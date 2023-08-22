//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "./CountryMinter.sol";
import "./Resources.sol";
import "./Improvements.sol";
import "./Infrastructure.sol";
import "./Wonders.sol";
import "./Treasury.sol";
import "./CountryParameters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title InfrastructureMarketContract
///@author OxSnosh
///@notice this contract will allow a nation owner to buy Infrastructure
contract InfrastructureMarketContract is Ownable {
    address public countryMinter;
    address public resources;
    address public infrastructure;
    address public improvements1;
    address public wonders2;
    address public wonders3;
    address public treasury;
    address public parameters;
    address public bonusResources;

    CountryMinter mint;
    ResourcesContract res;
    ImprovementsContract1 imp1;
    WondersContract2 won2;
    WondersContract3 won3;
    CountryParametersContract param;
    InfrastructureContract inf;
    TreasuryContract tsy;
    BonusResourcesContract bonus;

    event InfrastructurePurchased(
        uint256 indexed countryId,
        uint256 indexed amount,
        uint256 indexed cost
    );

    event InfrastructureDestroyed(
        uint256 indexed countryId,
        uint256 indexed amount
    );

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _resources,
        address _parameters,
        address _improvements1,
        address _countryMinter,
        address _wonders2,
        address _wonders3,
        address _treasury,
        address _infrastructure,
        address _bonusResources
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
        bonusResources = _bonusResources;
        bonus = BonusResourcesContract(_bonusResources);
    }

    ///@dev this is a public view function that will allow a nation owner to buy infrastructure
    ///@dev this function is only callable by the nation owner
    ///@notice this function will allow a nation owner to purchase infrastructure
    ///@param id is the nation id of the nation purchasing infrastructure
    ///@param buyAmount is the amount of infrastructure being purchased
    function buyInfrastructure(uint256 id, uint256 buyAmount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 cost = getInfrastructureCost(id, buyAmount);
        inf.increaseInfrastructureFromMarket(id, buyAmount);
        tsy.spendBalance(id, cost);
        emit InfrastructurePurchased(id, buyAmount, cost);
    }

    ///@dev this is a public view function that will return the cost of an infrastructure purchase
    ///@dev this function multiplies the cost per level by the purchases amount
    ///@notice this function will return the cost of an infrastructure purchase
    ///@param id is the nation id of the nation buying infrastructure
    ///@param buyAmount this is the amount of infrastructure being purchased
    ///@return uint256 this is the cost of the purchase
    function getInfrastructureCost(uint256 id, uint256 buyAmount) public view returns (uint256) {
        uint256 costPerLevel = getInfrastructureCostPerLevel(id);
        uint256 cost = buyAmount * costPerLevel;
        return cost;
    }

    ///@dev this is a public view functon that will return the infrastructure cost per level
    ///@notice this function will return the cost of an infrastructure purchase per level
    ///@notice cartain modifiers in the following functions will reduce the cost of infrastructure
    ///@param id this is the nation id making the purchase
    ///@return uint256 this is the cost per level of an infrastructure purchase
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
        } else if (currentInfrastructureAmount < 2000) {
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
        uint256 adjustedCostPerLevel = ((grossCost * multiplier) / 100);
        return adjustedCostPerLevel * (10**18);
    }

    ///@dev this function is one of three functions that will adjust the cost of infrastructure lower
    ///@dev this function is a public view function that will get called when infrasturcture is quoted or purchased
    ///@notice this function is one of three functions that will adjust the cost of infrastructure lower based on a nations resources, improvements and wonders
    ///@notice lumber will reduce the cost of infrastructure by 6%
    ///@notice iron will reduce the cost of infrastructure by 5%
    ///@notice marble will reduce the cost of infrastructure by 10%
    ///@return uint256 this will be the multiplier reductions from this formula
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

    ///@dev this function is the second of three functions that will adjust the cost of infrastructure lower
    ///@dev this function is a public view function that will get called when infrasturcture is quoted or purchased
    ///@notice this function is the second of three functions that will adjust the cost of infrastructure lower based on a nations resources, improvements and wonders
    ///@notice rubber will reduce the cost of infrastructure by 3%
    ///@notice construction will reduce the cost of infrastructure by 5%
    ///@notice an interstate system will reduce the cost of infrastructure by 8%
    ///@notice certain accomodative governements will reduce the cost of infrastructure by 5%
    ///@notice factories without a scientific development center will reduce the cost of infrastructure by 8% and 10% with a scientific development center
    ///@return uint256 this will be the multiplier reductions from this formula
    function getInfrastructureCostMultiplier2(
        uint256 id
    ) public view returns (uint256) {
        uint256 rubberMultiplier = 0;
        uint256 constructionMultiplier = 0;
        uint256 insterstateSystemMultiplier = 0;
        uint256 accomodativeGovernmentMultiplier = 0;
        uint256 factoryMultiplier = 0;
        bool isRubber = res.viewRubber(id);
        bool isConstruction = bonus.viewConstruction(id);
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

    ///@dev this function is the third of three functions that will adjust the cost of infrastructure lower
    ///@dev this function is a public view function that will get called when infrasturcture is quoted or purchased
    ///@notice this function is the third of three functions that will adjust the cost of infrastructure lower based on a nations resources, improvements and wonders
    ///@notice aluminium will reduce the cost of infrastructure by 7%
    ///@notice coal will reduce the cost of infrastructure by 4%
    ///@notice steel will reduce the cost of infrastructure by 2%
    ///@notice asphalt will reduce the cost of infrastructure by 5%
    ///@return uint256 this will be the multiplier reductions from this formula
    function getInfrastructureCostMultiplier3(
        uint256 id
    ) public view returns (uint256) {
        uint256 multiplier = 0;
        bool isAluminium = res.viewAluminium(id);
        bool isCoal = res.viewCoal(id);
        bool isSteel = bonus.viewSteel(id);
        bool isAsphalt = bonus.viewAsphalt(id);
        if (isAluminium) {
            multiplier += 7;
        }
        if (isCoal) {
            multiplier += 4;
        }
        if (isSteel) {
            multiplier += 2;
        }
        if (isAsphalt) {
            multiplier += 5;
        }
        return multiplier;
    }

    ///@dev this is a public view function that will return a boolean value if a nations government type accomodates a reduced infrastructure cost
    ///@notice this function will check if the given nation has a governemnt type that accomodate a lower cost of infrastructure
    ///@param countryId is the nation ID of the country being queried
    ///@return bool will be true if the nation's government type accomodates a lower infrastructure cost
    function checkAccomodativeGovernment(
        uint256 countryId
    ) public view returns (bool) {
        uint256 governmentType = param.getGovernmentType(countryId);
        if (
            governmentType == 1 ||
            governmentType == 4 ||
            governmentType == 5 ||
            governmentType == 6 ||
            governmentType == 7 ||
            governmentType == 8
        ) {
            return true;
        }
        return false;
    }

    ///@dev this is a public function callable by the nation owner 
    ///@dev this function will allow a nation owner to destroy infrastructure
    ///@notice this function will allow a nation owner to destroy infrastructure
    ///@param id this is the nation id of the nation destroying infrastructure
    ///@param amount this is the amount of infrastructure being destroyed
    function destroyInfrastructure(uint256 id, uint256 amount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 currentInfrastructureAmount = inf.getInfrastructureCount(id);
        require(
            (currentInfrastructureAmount - amount) >= 0,
            "not enough infrastructure"
        );
        inf.decreaseInfrastructureFromMarket(id, amount);
        emit InfrastructureDestroyed(id, amount);
    }
}
