//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Resources.sol";
import "./Improvements.sol";
import "./Wonders.sol";
import "./Treasury.sol";
import "./CountrySettings.sol";

contract InfrastructureContract {
    uint256 private infrastructureId;
    address public resources;
    address public improvements1;
    address public improvements3;
    address public wonders2;
    address public wonders3;
    address public wonders4;
    address public treasury;
    address public countrySettings;

    struct Infrastructure {
        uint256 landCount;
        uint256 technologyCount;
        uint256 infrastructureCount;
        uint256 nationStrength;
        uint16 taxRate;
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
        address _wonders2,
        address _wonders3,
        address _wonders4,
        address _treasury,
        address _countrySettings
    ) {
        resources = _resources;
        improvements1 = _improvements1;
        improvements3 = _improvements3;
        wonders2 = _wonders2;
        wonders3 = _wonders3;
        wonders4 = _wonders4;
        treasury = _treasury;
        countrySettings = _countrySettings;
    }

    function generateInfrastructure() public {
        Infrastructure memory newInfrastrusture = Infrastructure(
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
        idToInfrastructure[infrastructureId] = newInfrastrusture;
        idToOwnerInfrastructure[infrastructureId] = msg.sender;
        infrastructureId++;
    }

    //how to graduate tech and infrastructure purchases
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
        //gold -5%
        //microchips -8%
        //-10% per university
        //national research lab -3%
        //space program  - 3%
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
        uint256 adjustments = (costAdjustments1 + costAdjustments2 + costAdjustments3);
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
        uint256 sumOfAdjustments = 
            lumberMultiplier +
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
        uint256 sumOfAdjustments = 
            rubberMultiplier +
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
        uint256 sumOfAdjustments = 
            aluminiumMultiplier +
            coalMultiplier +
            steelMultiplier;
        return sumOfAdjustments;
    }

    function checkAccomodativeGovernment(uint256 countryId)
        public
        view
        returns (bool)
    {
        uint256 governmentType = CountrySettingsContract(countrySettings)
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
        uint256 landAmount = idToInfrastructure[countryId].landCount;
        return landAmount;
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

    function getInfrastructureCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 infrastructureAmount = idToInfrastructure[countryId]
            .infrastructureCount;
        return infrastructureAmount;
    }

    function getNationStrength(uint256 countryId)
        public
        view
        returns (uint256 nationStrength)
    {
        uint256 strength = idToInfrastructure[countryId].nationStrength;
        return strength;
    }
}
