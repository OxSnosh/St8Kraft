//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./CountryMinter.sol";
import "./Resources.sol";
import "./Improvements.sol";
import "./Wonders.sol";
import "./Treasury.sol";
import "./Forces.sol";
import "./CountryParameters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LandMarketContract is Ownable {
    address public countryMinter;
    address public resources;
    address public infrastructure;
    address public infrastructureMarket;
    address public techMarket;
    address public improvements1;
    address public improvements2;
    address public improvements3;
    address public wonders1;
    address public wonders2;
    address public wonders3;
    address public wonders4;
    address public forces;
    address public treasury;
    address public aid;
    address public parameters;
    address public spyAddress;
    address public taxes;
    address public cruiseMissile;
    address public nukeAddress;
    address public airBattle;
    address public groundBattle;

    CountryMinter mint;
    ResourcesContract res;
    ImprovementsContract1 imp1;
    ImprovementsContract2 imp2;
    ImprovementsContract3 imp3;
    InfrastructureContract inf;

    constructor(
        address _resources,
        address _improvements1,
        address _improvements2,
        address _improvements3,
        address _infrastructureMarket,
        address _techMarket,
        address _countryMinter,
        address _infrastructure
    ) {
        resources = _resources;
        res = ResourcesContract(_resources);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        improvements2 = _improvements2;
        imp2 = ImprovementsContract2(_improvements2);
        improvements3 = _improvements3;
        imp3 = ImprovementsContract3(_improvements3);
        infrastructureMarket = _infrastructureMarket;
        techMarket = _techMarket;
        countryMinter = _countryMinter;
        infrastructure = _infrastructure;        
    }

    modifier onlySpyContract() {
        require(
            msg.sender == spyAddress,
            "only spy contract can call this function"
        );
        _;
    }

    modifier onlyTaxesContract() {
        require(
            msg.sender == taxes,
            "only tax contract can call this function"
        );
        _;
    }

    modifier onlyCruiseMissileContract() {
        require(
            msg.sender == cruiseMissile,
            "only callable from cruise missile contract"
        );
        _;
    }

    modifier onlyNukeContract() {
        require(
            msg.sender == nukeAddress,
            "only callable from cruise missile contract"
        );
        _;
    }

    modifier onlyAirBattle() {
        require(
            msg.sender == airBattle,
            "function only callable from Air Battle contract"
        );
        _;
    }

    modifier onlyGroundBattle() {
        require(
            msg.sender == groundBattle,
            "function only callable from Ground Battle contract"
        );
        _;
    }

    modifier onlyInfrastructureMarket() {
        require(
            msg.sender == infrastructureMarket,
            "function only callable from infrastructure marketplace"
        );
        _;
    }

    modifier onlyTechMarket() {
        require(
            msg.sender == techMarket,
            "function only callable from infrastructure marketplace"
        );
        _;
    }

    function buyLand(uint256 id, uint256 amount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 costPerMile = getLandCostPerMile(id);
        uint256 purchasePriceMultiplier = getLandPriceMultiplier(id);
        uint256 adjustedCostPerMile = ((costPerMile * purchasePriceMultiplier) /
            100);
        uint256 cost = (amount * adjustedCostPerMile);
        inf.increaseLandCountFromMarket(id, amount);
        TreasuryContract(treasury).spendBalance(id, cost);
    }

    function getLandCostPerMile(uint256 id) public view returns (uint256) {
        uint256 currentLand = inf.getLandCount(id);
        uint256 costPerLevel = 400;
        if (currentLand > 30) {
            costPerLevel = (400 + (currentLand * 2));
        } else if (currentLand > 100) {
            costPerLevel = (400 + (currentLand * 3));
        } else if (currentLand > 200) {
            costPerLevel = (400 + (currentLand * 5));
        } else if (currentLand > 250) {
            costPerLevel = (400 + (currentLand * 10));
        } else if (currentLand > 300) {
            costPerLevel = (400 + (currentLand * 15));
        } else if (currentLand > 400) {
            costPerLevel = (400 + (currentLand * 20));
        } else if (currentLand > 500) {
            costPerLevel = (400 + (currentLand * 25));
        } else if (currentLand > 800) {
            costPerLevel = (400 + (currentLand * 30));
        } else if (currentLand > 1200) {
            costPerLevel = (400 + (currentLand * 35));
        } else if (currentLand > 2000) {
            costPerLevel = (400 + (currentLand * 40));
        } else if (currentLand > 3000) {
            costPerLevel = (400 + (currentLand * 45));
        } else if (currentLand > 4000) {
            costPerLevel = (400 + (currentLand * 55));
        } else {
            costPerLevel = (400 + (currentLand * 75));
        }
        return costPerLevel;
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
}