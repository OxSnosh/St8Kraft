//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./CountryMinter.sol";
import "./Infrastructure.sol";
import "./Resources.sol";
import "./Improvements.sol";
import "./Wonders.sol";
import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TechnologyMarketContract is Ownable {
    address public countryMinter;
    address public infrastructure;
    address public resources;
    address public improvements3;
    address public wonders2;
    address public wonders3;
    address public wonders4;
    address public treasury;
    address public bonusResources;

    CountryMinter mint;
    ResourcesContract res;
    TreasuryContract tsy;
    ImprovementsContract3 imp3;
    WondersContract2 won2;
    WondersContract3 won3;
    WondersContract4 won4;
    InfrastructureContract inf;
    BonusResourcesContract bonus;

    function settings (
        address _resources,
        address _improvements3,
        address _infrastructure,
        address _wonders2,
        address _wonders3,
        address _wonders4,
        address _treasury,
        address _countryMinter,
        address _bonusResources
    ) public onlyOwner {
        resources = _resources;
        res = ResourcesContract(_resources);
        improvements3 = _improvements3;
        imp3 = ImprovementsContract3(_improvements3);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        wonders2 = _wonders2;
        won2 = WondersContract2(_wonders2);
        wonders3 = _wonders3;
        won3 = WondersContract3(_wonders3);
        wonders4 = _wonders4;
        won4 = WondersContract4(_wonders4);
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        bonusResources = _bonusResources;
        bonus = BonusResourcesContract(_bonusResources);
    }

    function buyTech(uint256 id, uint256 amount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 cost = getTechCost(id, amount);
        inf.increaseTechnologyFromMarket(id, amount);
        tsy.spendBalance(id, cost);
    }

    function getTechCost(uint256 id, uint256 amount) public view returns (uint256) {
        uint256 costPerLevel = getTechCostPerLevel(id);
        uint256 cost = (costPerLevel * amount);
        return cost;
    }

    function getTechCostPerLevel(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 currentTechAmount = inf.getTechnologyCount(id);
        uint256 baseCostPerLevel; 
        if (currentTechAmount < 5) {
            baseCostPerLevel = 100 * (10 ** 18);
        } else if (currentTechAmount < 8) {
            baseCostPerLevel = 120 * (10 ** 18);
        } else if (currentTechAmount < 10) {
            baseCostPerLevel = 130 * (10 ** 18);
        } else if (currentTechAmount < 15) {
            baseCostPerLevel = 140 * (10 ** 18);
        } else if (currentTechAmount < 30) {
            baseCostPerLevel = 160 * (10 ** 18);
        } else if (currentTechAmount < 50) {
            baseCostPerLevel = 180 * (10 ** 18);
        } else if (currentTechAmount < 75) {
            baseCostPerLevel = 200 * (10 ** 18);
        } else if (currentTechAmount < 100) {
            baseCostPerLevel = 220 * (10 ** 18);
        } else if (currentTechAmount < 150) {
            baseCostPerLevel = 240 * (10 ** 18);
        } else if (currentTechAmount < 200) {
            baseCostPerLevel = 260 * (10 ** 18);
        } else if (currentTechAmount < 250) {
            baseCostPerLevel = 300 * (10 ** 18);
        } else if (currentTechAmount < 300) {
            baseCostPerLevel = 400 * (10 ** 18);
        } else if (currentTechAmount < 400) {
            baseCostPerLevel = 500 * (10 ** 18);
        } else if (currentTechAmount < 500) {
            baseCostPerLevel = 600 * (10 ** 18);
        } else if (currentTechAmount < 600) {
            baseCostPerLevel = 700 * (10 ** 18);
        } else if (currentTechAmount < 700) {
            baseCostPerLevel = 800 * (10 ** 18);
        } else if (currentTechAmount < 1000) {
            baseCostPerLevel = 1100 * (10 ** 18);
        } else if (currentTechAmount < 2000) {
            baseCostPerLevel = 1600 * (10 ** 18);
        } else if (currentTechAmount < 3000) {
            baseCostPerLevel = 2100 * (10 ** 18);
        } else if (currentTechAmount < 4000) {
            baseCostPerLevel = 2600 * (10 ** 18);
        } else if (currentTechAmount < 5000) {
            baseCostPerLevel = 3100 * (10 ** 18);
        } else if (currentTechAmount < 6000) {
            baseCostPerLevel = 3600 * (10 ** 18);
        } else if (currentTechAmount < 7000) {
            baseCostPerLevel = 4100 * (10 ** 18);
        } else if (currentTechAmount < 8000) {
            baseCostPerLevel = 4600 * (10 ** 18);
        } else if (currentTechAmount < 9000) {
            baseCostPerLevel = 5100 * (10 ** 18);
        } else if (currentTechAmount < 10000) {
            baseCostPerLevel = 5600 * (10 ** 18);
        } else if (currentTechAmount < 15000) {
            baseCostPerLevel = 6600 * (10 ** 18);
        } else if (currentTechAmount < 20000) {
            baseCostPerLevel = 7600 * (10 ** 18);
        } else {
            baseCostPerLevel = 8600 * (10 ** 18);
        }
        uint256 costMultiplier = getTechCostMultiplier(id);
        uint256 costPerLevel = ((baseCostPerLevel * costMultiplier) / 100);
        return costPerLevel;
    }

    function getTechCostMultiplier(uint256 id) public view returns (uint256) {
        uint256 numberToSubtract = 0;
        bool isGold = res.viewGold(id);
        bool isMicrochips = bonus.viewMicrochips(id);
        uint256 universityCount = imp3.getUniversityCount(id);
        bool greatUniversity = won2.getGreatUniversity(id);
        bool isSpaceProgram = won4.getSpaceProgram(id);
        bool isNationalResearchLab = won3.getNationalResearchLab(id);
        if (isGold) {
            numberToSubtract += 5;
        }
        if (isMicrochips) {
            numberToSubtract += 8;
        }
        if (universityCount > 0) {
            numberToSubtract += (universityCount * 10);
        }
        if (greatUniversity) {
            numberToSubtract += 10;
        }
        if (isNationalResearchLab) {
            numberToSubtract += 3;
        }
        if (isSpaceProgram) {
            numberToSubtract += 3;
        }
        uint256 multiplier = (100 - numberToSubtract);
        return multiplier;
    }

    function destroyTech(uint256 id, uint256 amount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 currentTech = inf.getTechnologyCount(id);
        require((currentTech - amount) >= 0, "not enough tech");
        inf.decreaseTechnologyFromMarket(id, amount);
    }
}