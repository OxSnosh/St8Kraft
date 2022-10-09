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

contract TechnologyMarketContract is Ownable {
    address public countryMinter;
    address public infrastructureAddress;
    address public resources;
    address public infrastructureMarket;
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
        address _infrastructureAddress
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
        infrastructureAddress = _infrastructureAddress;
        inf = InfrastructureContract(_infrastructureAddress);
    }

    function constructorContinued(
        address _wonders1,
        address _wonders2,
        address _wonders3,
        address _wonders4,
        address _treasury,
        address _parameters,
        address _forces,
        address _aid
    ) public onlyOwner {
        wonders1 = _wonders1;
        wonders2 = _wonders2;
        wonders3 = _wonders3;
        wonders4 = _wonders4;
        treasury = _treasury;
        parameters = _parameters;
        forces = _forces;
        aid = _aid;
    }

    function constructorContinued(
        address _spyAddress,
        address _tax,
        address _cruiseMissile,
        address _nukeAddress,
        address _airBattle,
        address _groundBattle,
        address _countryMinter
    ) public onlyOwner {
        spyAddress = _spyAddress;
        taxes = _tax;
        cruiseMissile = _cruiseMissile;
        nukeAddress = _nukeAddress;
        airBattle = _airBattle;
        groundBattle = _groundBattle;
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
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

    function buyTech(uint256 id, uint256 amount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 currentTechAmount = inf.getTechnologyCount(id);
        uint256 baseCostPerTechLevel = getBaseTechCost(currentTechAmount);
        uint256 costMultiplier = getTechCostMultiplier(id);
        uint256 adjustedCostPerLevel = (baseCostPerTechLevel * costMultiplier);
        uint256 cost = amount * adjustedCostPerLevel;
        inf.increaseTechnologyFromMarket(id, amount);
        TreasuryContract(treasury).spendBalance(id, cost);
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
        uint256 goldMultiplier = 0;
        uint256 microchipMultiplier = 0;
        uint256 universityMultiplier = 0;
        uint256 nationalResearchLabMultiplier = 0;
        uint256 spaceProgramMultiplier = 0;
        bool isGold = ResourcesContract(resources).viewGold(id);
        bool isMicrochips = ResourcesContract(resources).viewMicrochips(id);
        uint256 universityCount = ImprovementsContract3(improvements3)
            .getUniversityCount(id);
        bool isSpaceProgram = WondersContract4(wonders4).getSpaceProgram(id);
        bool isNationalResearchLab = WondersContract3(wonders3)
            .getNationalResearchLab(id);
        if (isGold) {
            goldMultiplier = 5;
        }
        if (isMicrochips) {
            microchipMultiplier = 8;
        }
        if (universityCount > 0) {
            universityMultiplier = (universityCount * 2);
        }
        if (isNationalResearchLab) {
            nationalResearchLabMultiplier = 3;
        }
        if (isSpaceProgram) {
            spaceProgramMultiplier = 3;
        }
        uint256 sumOfAdjustments = goldMultiplier +
            microchipMultiplier +
            universityMultiplier +
            nationalResearchLabMultiplier +
            spaceProgramMultiplier;
        uint256 multiplier = (100 - sumOfAdjustments);
        return multiplier;
    }
}