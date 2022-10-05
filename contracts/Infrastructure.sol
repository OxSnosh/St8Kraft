//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Resources.sol";
import "./Improvements.sol";
import "./Wonders.sol";
import "./Treasury.sol";
import "./Forces.sol";
import "./CountryParameters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InfrastructureContract is Ownable {
    address public resources;
    address public improvements1;
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

    struct Infrastructure {
        uint256 landArea;
        uint256 technologyCount;
        uint256 infrastructureCount;
        uint256 taxRate;
        bool collectionNeededToChangeRate;
        uint256 populationCount;
        uint256 citizenCount;
        uint256 criminalCount;
        uint16 populationHappiness;
        uint16 crimeIndex;
    }

    mapping(uint256 => Infrastructure) public idToInfrastructure;
    mapping(uint256 => address) public idToOwnerInfrastructure;

    constructor(
        address _resources,
        address _improvements1,
        address _improvements3,
        address _wonders1,
        address _wonders2,
        address _wonders3,
        address _wonders4,
        address _treasury,
        address _parameters,
        address _forces,
        address _aid
    ) {
        resources = _resources;
        improvements1 = _improvements1;
        improvements3 = _improvements3;
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
        address _groundBattle
    ) public onlyOwner {
        spyAddress = _spyAddress;
        taxes = _tax;
        cruiseMissile = _cruiseMissile;
        nukeAddress = _nukeAddress;
        airBattle = _airBattle;
        groundBattle = _groundBattle;
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

    function generateInfrastructure(uint256 id, address nationOwner) public {
        Infrastructure memory newInfrastrusture = Infrastructure(
            20,
            0,
            20,
            16,
            false,
            0,
            0,
            0,
            0,
            0
        );
        idToInfrastructure[id] = newInfrastrusture;
        idToOwnerInfrastructure[id] = nationOwner;
    }

    function buyTech(uint256 id, uint256 amount) public {
        require(
            idToOwnerInfrastructure[id] == msg.sender,
            "caller not the nation owner"
        );
        uint256 currentTechAmount = getTechnologyCount(id);
        uint256 baseCostPerTechLevel = getBaseTechCost(currentTechAmount);
        uint256 costMultiplier = getTechCostMultiplier(id);
        uint256 adjustedCostPerLevel = (baseCostPerTechLevel * costMultiplier);
        uint256 cost = amount * adjustedCostPerLevel;
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

    modifier onlyAidContract() {
        require(msg.sender == aid);
        _;
    }

    function sendTech(
        uint256 idSender,
        uint256 idReciever,
        uint256 amount
    ) public onlyAidContract {
        uint256 balanceOfSender = idToInfrastructure[idSender].technologyCount;
        require(balanceOfSender >= amount, "sender does not have enought tech");
        idToInfrastructure[idSender].technologyCount -= amount;
        idToInfrastructure[idReciever].technologyCount += amount;
    }

    function buyInfrastructure(uint256 id, uint256 buyAmount) public {
        require(
            idToOwnerInfrastructure[id] == msg.sender,
            "caller not the nation owner"
        );
        uint256 currentInfrastructureAmount = getInfrastructureCount(id);
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
        uint256 adjustedCostPerLevel = (grossCostPerLevel * multiplier);
        uint256 cost = buyAmount * adjustedCostPerLevel;
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
            ironMultiplier = 6;
        }
        if (isMarble) {
            marbleMultiplier = 6;
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
            rubberMultiplier = 6;
        }
        if (isConstruction) {
            constructionMultiplier = 6;
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
        bool isAluminium = ResourcesContract(resources).viewAluminium(id);
        bool isCoal = ResourcesContract(resources).viewCoal(id);
        bool isSteel = ResourcesContract(resources).viewSteel(id);
        if (isAluminium) {
            aluminiumMultiplier = 6;
        }
        if (isCoal) {
            coalMultiplier = 6;
        }
        if (isSteel) {
            steelMultiplier = 6;
        }
        uint256 sumOfAdjustments = aluminiumMultiplier +
            coalMultiplier +
            steelMultiplier;
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

    function getLandCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 landAmount = idToInfrastructure[countryId].landArea;
        return landAmount;
    }

    function decreaseLandCount(uint256 countryId, uint256 amount)
        public
        onlySpyContract
    {
        idToInfrastructure[countryId].landArea -= amount;
    }

    function decreaseLandCountFromNukeContract(uint256 countryId)
        public
        onlyNukeContract
    {
        uint256 landAmount = idToInfrastructure[countryId].landArea;
        uint256 landAmountToDecrease = ((landAmount * 35) / 100);
        if (landAmountToDecrease > 150) {
            idToInfrastructure[countryId].landArea -= 150;
        } else {
            idToInfrastructure[countryId].landArea -= landAmountToDecrease;
        }
    }

    function increaseLandCount(uint256 countryId, uint256 amount)
        public
        onlySpyContract
    {
        idToInfrastructure[countryId].landArea += amount;
    }

    function getTechnologyCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 technologyAmount = idToInfrastructure[countryId]
            .technologyCount;
        return technologyAmount;
    }

    function decreaseTechCount(uint256 countryId, uint256 amount)
        public
        onlySpyContract
    {
        idToInfrastructure[countryId].technologyCount -= amount;
    }

    function decreaseTechCountFromCruiseMissileContract(
        uint256 countryId,
        uint256 amount
    ) public onlyCruiseMissileContract {
        idToInfrastructure[countryId].technologyCount -= amount;
    }

    function decreaseTechCountFromNukeContract(uint256 countryId)
        public
        onlyNukeContract
    {
        uint256 techAmount = idToInfrastructure[countryId].technologyCount;
        uint256 techAmountToDecrease = ((techAmount * 35) / 100);
        if (techAmountToDecrease > 50) {
            idToInfrastructure[countryId].technologyCount -= 50;
        } else {
            idToInfrastructure[countryId]
                .technologyCount -= techAmountToDecrease;
        }
    }

    function increaseTechCount(uint256 countryId, uint256 amount)
        public
        onlySpyContract
    {
        idToInfrastructure[countryId].technologyCount += amount;
    }

    function getInfrastructureCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 infrastructureAmount = idToInfrastructure[countryId]
            .infrastructureCount;
        return infrastructureAmount;
    }

    function decreaseInfrastructureCount(uint256 countryId, uint256 amount)
        public
        onlySpyContract
    {
        idToInfrastructure[countryId].infrastructureCount -= amount;
    }

    function decreaseInfrastructureCountFromCruiseMissileContract(
        uint256 countryId,
        uint256 amount
    ) public onlyCruiseMissileContract {
        idToInfrastructure[countryId].infrastructureCount -= amount;
    }

    function decreaseInfrastructureCountFromNukeContract(uint256 countryId)
        public
        onlyNukeContract
    {
        uint256 infrastructureAmount = idToInfrastructure[countryId]
            .infrastructureCount;
        uint256 infrastructureAmountToDecrease = ((infrastructureAmount * 35) /
            100);
        if (infrastructureAmountToDecrease > 150) {
            idToInfrastructure[countryId].infrastructureCount -= 150;
        } else {
            idToInfrastructure[countryId]
                .infrastructureCount -= infrastructureAmountToDecrease;
        }
    }

    function decreaseInfrastructureCountFromAirBattleContract(
        uint256 countryId,
        uint256 amountToDecrease
    ) public onlyAirBattle {
        uint256 infrastructureAmount = idToInfrastructure[countryId]
            .infrastructureCount;
        if (amountToDecrease >= infrastructureAmount) {
            idToInfrastructure[countryId].infrastructureCount = 0;
        } else {
            idToInfrastructure[countryId]
                .infrastructureCount -= amountToDecrease;
        }
    }

    function increaseInfrastructureCount(uint256 countryId, uint256 amount)
        public
        onlySpyContract
    {
        idToInfrastructure[countryId].infrastructureCount += amount;
    }

    function getTaxRate(uint256 id)
        public
        view
        returns (uint256 taxPercentage)
    {
        uint256 taxRate = idToInfrastructure[id].taxRate;
        return taxRate;
    }

    function setTaxRate(uint256 id, uint256 newTaxRate) public {
        require(
            idToInfrastructure[id].collectionNeededToChangeRate == false,
            "need to collect taxes before changing tax rate"
        );
        require(newTaxRate <= 28, "cannot tax above 28%");
        require(newTaxRate >= 15, "cannot tax below 15%");
        idToInfrastructure[id].taxRate = newTaxRate;
    }

    function setTaxRateFromSpyContract(uint256 id, uint256 newTaxRate)
        public
        onlySpyContract
    {
        require(newTaxRate <= 28, "cannot tax above 28%");
        require(newTaxRate >= 15, "cannot tax below 15%");
        idToInfrastructure[id].taxRate = newTaxRate;
        idToInfrastructure[id].collectionNeededToChangeRate = true;
    }

    function toggleCollectionNeededToChangeRate(uint256 id)
        public
        onlyTaxesContract
    {
        idToInfrastructure[id].collectionNeededToChangeRate = false;
    }

    function checkIfCollectionNeededToChangeRate(uint256 id)
        public
        view
        returns (bool)
    {
        bool collectionNeeded = idToInfrastructure[id]
            .collectionNeededToChangeRate;
        return collectionNeeded;
    }

    function getTotalPopulationCount(uint256 id) public view returns (uint256) {
        uint256 infra = getInfrastructureCount(id);
        uint256 population = (infra * 8);
        return population;
    }

    function transferLandAndTech(
        uint256 landMiles,
        uint256 techLevels,
        uint256 attackerId,
        uint256 defenderId
    ) public onlyGroundBattle {
        uint256 defenderLand = idToInfrastructure[defenderId].landArea;
        uint256 defenderTech = idToInfrastructure[defenderId].technologyCount;
        if(defenderLand <= landMiles) {
            idToInfrastructure[defenderId].landArea = 0;
            idToInfrastructure[attackerId].landArea += defenderLand;
        } else {
            idToInfrastructure[defenderId].landArea -= landMiles;
            idToInfrastructure[attackerId].landArea += landMiles;
        }
        if(defenderTech <= techLevels) {
            idToInfrastructure[defenderId].technologyCount = 0;
            idToInfrastructure[attackerId].technologyCount += defenderTech;
        } else {
            idToInfrastructure[defenderId].technologyCount = techLevels;
            idToInfrastructure[attackerId].technologyCount += techLevels;
        }
    }
}
