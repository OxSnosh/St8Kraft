//SPDX-License-Identifier: Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International
pragma solidity 0.8.17;

import "./CountryMinter.sol";
import "./Resources.sol";
import "./Treasury.sol";
import "./Infrastructure.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title LandMarketContract
///@author OxSnosh
///@notice this contract will allow a nation owner to purchase land
///@dev this contract inherits from openzeppelin's ownable contract
contract LandMarketContract is Ownable {
    address public countryMinter;
    address public resources;
    address public infrastructure;
    address public treasury;

    CountryMinter mint;
    ResourcesContract res;
    InfrastructureContract inf;
    TreasuryContract tsy;

    event LandPurchased(uint256 indexed id, uint256 indexed amount, uint256 indexed cost);

    event LandDestroyed(uint256 indexed id, uint256 indexed amount);

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
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

    ///@dev this is a public view function that will allow a nation owner to buy land
    ///@dev this function is only callable by the nation owner
    ///@notice this function will allow a nation owner to purchase land
    ///@param id is the nation id of the nation purchasing land
    ///@param amount is the amount of land being purchased
    function buyLand(uint256 id, uint256 amount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 cost = getLandCost(id, amount);
        inf.increaseLandCountFromMarket(id, amount);
        tsy.spendBalance(id, cost);
        emit LandPurchased(id, amount, cost);
    }

    ///@dev this is a public view function that will return the cost of a land purchase
    ///@dev this function multiplies the cost per level by the purchases amount
    ///@notice this function will return the cost of a land purchase
    ///@param id is the nation id of the nation buying land
    ///@param amount this is the amount of land being purchased
    ///@return uint256 this is the cost of the purchase
    function getLandCost(uint256 id, uint256 amount) public view returns (uint256) {
        uint256 costPerMile = getLandCostPerMile(id);
        uint256 cost = (costPerMile * amount);
        return cost;
    }

    ///@dev this is a public view functon that will return the land cost per mile
    ///@notice this function will return the cost of land per mile for a nation
    ///@notice cartain modifiers in the following functions will reduce the cost of land
    ///@param id this is the nation id making the purchase
    ///@return uint256 this is the cost per level of a land purchase
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

    ///@dev this function  will adjust the cost of land lower
    ///@dev this function is a public view function that will get called when land is quoted or purchased
    ///@notice this function will adjust the cost of land lower based on a nations resources, improvements and wonders
    ///@notice cattle will reduce the cost of land by 10%
    ///@notice fish will reduce the cost of land by 5%
    ///@notice rubber will reduce the cost of land by 10%
    ///@return uint256 this will be the multiplier reductions from this formula
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

    
    ///@dev this is a public function callable by the nation owner 
    ///@dev this function will allow a nation owner to destroy land
    ///@notice this function will allow a nation owner to destroy land
    ///@param id this is the nation id of the nation destroying land
    ///@param amount this is the amount of land being destroyed
    function destroyLand(uint256 id, uint256 amount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 currentLandAmount = inf.getLandCount(id);
        require((currentLandAmount - amount) >= 0, "not enough land");
        inf.decreaseLandCountFromMarket(id, amount);
        emit LandDestroyed(id, amount);
    }
}
