//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./CountryMinter.sol";
import "./Resources.sol";
import "./Treasury.sol";
import "./Infrastructure.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LandMarketContract is Ownable {
    address public countryMinter;
    address public resources;
    address public infrastructure;
    address public treasury;

    CountryMinter mint;
    ResourcesContract res;
    InfrastructureContract inf;
    TreasuryContract tsy;

    function settings(
        address _resources,
        address _countryMinter,
        address _infrastructure,
        address _treasury
    ) public onlyOwner {
        resources = _resources;
        res = ResourcesContract(_resources);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
    }

    function buyLand(uint256 id, uint256 amount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 cost = getLandCost(id, amount);
        inf.increaseLandCountFromMarket(id, amount);
        tsy.spendBalance(id, cost);
    }

    function getLandCost(uint256 id, uint256 amount) public view returns (uint256) {
        uint256 costPerMile = getLandCostPerMile(id);
        uint256 cost = (costPerMile * amount);
        return cost;
    }

    function getLandCostPerMile(uint256 id) public view returns (uint256) {
        uint256 currentLand = inf.getLandCount(id);
        uint256 costPerLevel = 400;
        if (currentLand < 30) {
            costPerLevel = (400 + (currentLand * 2));
        } else if (currentLand < 100) {
            costPerLevel = (400 + (currentLand * 3));
        } else if (currentLand < 200) {
            costPerLevel = (400 + (currentLand * 5));
        } else if (currentLand < 250) {
            costPerLevel = (400 + (currentLand * 10));
        } else if (currentLand < 300) {
            costPerLevel = (400 + (currentLand * 15));
        } else if (currentLand < 400) {
            costPerLevel = (400 + (currentLand * 20));
        } else if (currentLand < 500) {
            costPerLevel = (400 + (currentLand * 25));
        } else if (currentLand < 800) {
            costPerLevel = (400 + (currentLand * 30));
        } else if (currentLand < 1200) {
            costPerLevel = (400 + (currentLand * 35));
        } else if (currentLand < 2000) {
            costPerLevel = (400 + (currentLand * 40));
        } else if (currentLand < 3000) {
            costPerLevel = (400 + (currentLand * 45));
        } else if (currentLand < 4000) {
            costPerLevel = (400 + (currentLand * 55));
        } else {
            costPerLevel = (400 + (currentLand * 75));
        }
        uint256 purchasePriceMultiplier = getLandPriceMultiplier(id);
        uint256 adjustedCostPerMile = ((costPerLevel * purchasePriceMultiplier) /
            100);
        return adjustedCostPerMile * (10**18);
    }

    function getLandPriceMultiplier(uint256 id) public view returns (uint256) {
        uint256 multiplier = 100;
        bool cattle = res.viewCattle(id);
        if (cattle) {
            multiplier -= 10;
        }
        bool fish = res.viewFish(id);
        if (fish) {
            multiplier -= 5;
        }
        bool rubber = res.viewRubber(id);
        if (rubber) {
            multiplier -= 10;
        }
        return multiplier;
    }

    function destroyLand(uint256 id, uint256 amount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 currentLandAmount = inf.getLandCount(id);
        require((currentLandAmount - amount) >= 0, "not enough land");
        inf.decreaseLandCountFromMarket(id, amount);
    }
}
