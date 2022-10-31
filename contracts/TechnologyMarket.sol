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

    CountryMinter mint;
    ResourcesContract res;
    TreasuryContract tsy;
    ImprovementsContract3 imp3;
    WondersContract2 won2;
    WondersContract3 won3;
    WondersContract4 won4;
    InfrastructureContract inf;

    function settings (
        address _resources,
        address _improvements3,
        address _infrastructure,
        address _wonders2,
        address _wonders3,
        address _wonders4,
        address _treasury,
        address _countryMinter
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
    }

    function buyTech(uint256 id, uint256 amount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 currentTechAmount = inf.getTechnologyCount(id);
        uint256 baseCostPerTechLevel = getBaseTechCost(currentTechAmount);
        uint256 costMultiplier = getTechCostMultiplier(id);
        uint256 adjustedCostPerLevel = (baseCostPerTechLevel * costMultiplier);
        uint256 cost = amount * adjustedCostPerLevel;
        inf.increaseTechnologyFromMarket(id, amount);
        tsy.spendBalance(id, cost);
    }

    function getBaseTechCost(uint256 currentTechAmount)
        public
        pure
        returns (uint256)
    {
        if (currentTechAmount < 5) {
            return 100;
        } else if (currentTechAmount < 8) {
            return 120;
        } else if (currentTechAmount < 10) {
            return 130;
        } else if (currentTechAmount < 15) {
            return 140;
        } else if (currentTechAmount < 30) {
            return 160;
        } else if (currentTechAmount < 50) {
            return 180;
        } else if (currentTechAmount < 75) {
            return 200;
        } else if (currentTechAmount < 100) {
            return 220;
        } else if (currentTechAmount < 150) {
            return 240;
        } else if (currentTechAmount < 200) {
            return 260;
        } else if (currentTechAmount < 250) {
            return 300;
        } else if (currentTechAmount < 300) {
            return 400;
        } else if (currentTechAmount < 400) {
            return 500;
        } else if (currentTechAmount < 500) {
            return 600;
        } else if (currentTechAmount < 600) {
            return 700;
        } else if (currentTechAmount < 700) {
            return 800;
        } else if (currentTechAmount < 1000) {
            return 1100;
        } else if (currentTechAmount < 2000) {
            return 1600;
        } else if (currentTechAmount < 3000) {
            return 2100;
        } else if (currentTechAmount < 4000) {
            return 2600;
        } else if (currentTechAmount < 5000) {
            return 3100;
        } else if (currentTechAmount < 6000) {
            return 3600;
        } else if (currentTechAmount < 7000) {
            return 4100;
        } else if (currentTechAmount < 8000) {
            return 4600;
        } else if (currentTechAmount < 9000) {
            return 5100;
        } else if (currentTechAmount < 10000) {
            return 5600;
        } else if (currentTechAmount < 15000) {
            return 6600;
        } else if (currentTechAmount < 20000) {
            return 7600;
        } else {
            return 8600;
        }
    }

    function getTechCostMultiplier(uint256 id) public view returns (uint256) {
        uint256 numberToSubtract = 0;
        bool isGold = res.viewGold(id);
        bool isMicrochips = res.viewMicrochips(id);
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
}