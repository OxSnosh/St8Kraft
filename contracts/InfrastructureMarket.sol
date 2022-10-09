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

contract InfrastructureMarketContract is Ownable {
    address public countryMinter;
    address public resources;
    address public infrastructure;
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
        address _improvements3
    ) {
        resources = _resources;
        res = ResourcesContract(_resources);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        improvements2 = _improvements2;
        imp2 = ImprovementsContract2(_improvements2);
        improvements3 = _improvements3;
        imp3 = ImprovementsContract3(_improvements3);
    }
    
    function constructorContinued(
        address _wonders1,
        address _wonders2,
        address _wonders3,
        address _wonders4,
        address _treasury,
        address _parameters,
        address _forces,
        address _aid,
        address _infrastructure
    ) public onlyOwner {
        wonders1 = _wonders1;
        wonders2 = _wonders2;
        wonders3 = _wonders3;
        wonders4 = _wonders4;
        treasury = _treasury;
        parameters = _parameters;
        forces = _forces;
        aid = _aid;
        infrastructure = _infrastructure;
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

    function buyInfrastructure(uint256 id, uint256 buyAmount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 currentInfrastructureAmount = inf.getInfrastructureCount(id);
        uint256 grossCostPerLevel = getInfrastructureCostPerLevel(
            currentInfrastructureAmount
        );
        uint256 costAdjustments1 = getInfrastructureCostMultiplier1(id);
        uint256 costAdjustments2 = getInfrastructureCostMultiplier2(id);
        uint256 costAdjustments3 = getInfrastructureCostMultiplier3(id);
        uint256 adjustments = (costAdjustments1 +
            costAdjustments2 +
            costAdjustments3);
        uint256 multiplier = (100 - adjustments);
        //check amount of zeros below
        uint256 adjustedCostPerLevel = ((grossCostPerLevel * multiplier));
        uint256 cost = buyAmount * adjustedCostPerLevel;
        inf.increaseInfrastructureFromMarket(id, buyAmount);
        TreasuryContract(treasury).spendBalance(id, cost);
    }

    function getInfrastructureCostPerLevel(uint256 currentInfrastructureAmount)
        public
        pure
        returns (uint256)
    {
        if (currentInfrastructureAmount < 20) {
            return 500;
        } else if (currentInfrastructureAmount < 100) {
            uint256 grossCost = ((currentInfrastructureAmount * 12) + 500);
            return grossCost;
        } else if (currentInfrastructureAmount < 200) {
            uint256 grossCost = ((currentInfrastructureAmount * 15) + 500);
            return grossCost;
        } else if (currentInfrastructureAmount < 1000) {
            uint256 grossCost = ((currentInfrastructureAmount * 20) + 500);
            return grossCost;
        } else if (currentInfrastructureAmount < 3000) {
            uint256 grossCost = ((currentInfrastructureAmount * 25) + 500);
            return grossCost;
        } else if (currentInfrastructureAmount < 4000) {
            uint256 grossCost = ((currentInfrastructureAmount * 30) + 500);
            return grossCost;
        } else if (currentInfrastructureAmount < 5000) {
            uint256 grossCost = ((currentInfrastructureAmount * 40) + 500);
            return grossCost;
        } else if (currentInfrastructureAmount < 8000) {
            uint256 grossCost = ((currentInfrastructureAmount * 60) + 500);
            return grossCost;
        } else if (currentInfrastructureAmount < 15000) {
            uint256 grossCost = ((currentInfrastructureAmount * 70) + 500);
            return grossCost;
        } else {
            uint256 grossCost = ((currentInfrastructureAmount * 80) + 500);
            return grossCost;
        }
    }

    function getInfrastructureCostMultiplier1(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 lumberMultiplier = 0;
        uint256 ironMultiplier = 0;
        uint256 marbleMultiplier = 0;
        bool isLumber = ResourcesContract(resources).viewLumber(id);
        bool isIron = ResourcesContract(resources).viewIron(id);
        bool isMarble = ResourcesContract(resources).viewMarble(id);
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

    function getInfrastructureCostMultiplier2(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 rubberMultiplier = 0;
        uint256 constructionMultiplier = 0;
        uint256 insterstateSystemMultiplier = 0;
        uint256 accomodativeGovernmentMultiplier = 0;
        uint256 factoryMultiplier = 0;
        bool isRubber = ResourcesContract(resources).viewRubber(id);
        bool isConstruction = ResourcesContract(resources).viewConstruction(id);
        bool isInterstateSystem = WondersContract2(wonders2)
            .getInterstateSystem(id);
        bool isAccomodativeGovernment = checkAccomodativeGovernment(id);
        uint256 factoryCount = ImprovementsContract1(improvements1)
            .getFactoryCount(id);
        if (isRubber) {
            rubberMultiplier = 3;
        }
        if (isConstruction) {
            constructionMultiplier = 5;
        }
        if (isInterstateSystem) {
            insterstateSystemMultiplier = 6;
        }
        if (isAccomodativeGovernment) {
            accomodativeGovernmentMultiplier = 5;
        }
        if (factoryCount > 0) {
            factoryMultiplier = (factoryCount * 8);
        }
        uint256 sumOfAdjustments = rubberMultiplier +
            constructionMultiplier +
            insterstateSystemMultiplier +
            accomodativeGovernmentMultiplier +
            factoryMultiplier;
        return sumOfAdjustments;
    }

    function getInfrastructureCostMultiplier3(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 aluminiumMultiplier = 0;
        uint256 coalMultiplier = 0;
        uint256 steelMultiplier = 0;
        uint256 asphaltMultiplier = 0;
        bool isAluminium = ResourcesContract(resources).viewAluminium(id);
        bool isCoal = ResourcesContract(resources).viewCoal(id);
        bool isSteel = ResourcesContract(resources).viewSteel(id);
        bool isAsphalt = ResourcesContract(resources).viewAsphalt(id);
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

    function checkAccomodativeGovernment(uint256 countryId)
        public
        view
        returns (bool)
    {
        uint256 governmentType = CountryParametersContract(parameters)
            .getGovernmentType(countryId);
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
}