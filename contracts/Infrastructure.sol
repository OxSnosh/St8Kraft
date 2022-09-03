//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Resources.sol";
import "./Improvements.sol";
import "./Wonders.sol";
import "./Treasury.sol";

contract InfrastructureContract {
    uint256 private infrastructureId;
    address public resources;
    address public improvements3;
    address public wonders3;
    address public wonders4;
    address public treasury;

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
        address _improvements3,
        address _wonders3,
        address _wonders4,
        address _treasury
    ) {
        resources = _resources;
        improvements3 = _improvements3;
        wonders3 = _wonders3;
        wonders4 = _wonders4;
        treasury = _treasury;
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
        uint256 finalTechAmount = (currentTechAmount + amount);
        uint256 baseCostPerLevel = getBaseTechCost(finalTechAmount);
        uint256 costMultiplier = getCostMultiplier(id);
        uint256 adjustedCostPerLevel = (baseCostPerLevel * costMultiplier);
        uint256 cost = amount * adjustedCostPerLevel;
        TreasuryContract(treasury).spendBalance(id, cost);

    }

    function getBaseTechCost(uint256 finalTechAmount)
        public
        pure
        returns (uint256)
    {
        if (finalTechAmount < 5) {
            return 100;
        } else if (finalTechAmount < 8) {
            return 120;
        } else if (finalTechAmount < 10) {
            return 130;
        } else if (finalTechAmount < 15) {
            return 140;
        } else if (finalTechAmount < 30) {
            return 160;
        } else if (finalTechAmount < 50) {
            return 180;
        } else if (finalTechAmount < 75) {
            return 200;
        } else if (finalTechAmount < 100) {
            return 220;
        } else if (finalTechAmount < 150) {
            return 240;
        } else if (finalTechAmount < 200) {
            return 260;
        } else if (finalTechAmount < 250) {
            return 300;
        } else if (finalTechAmount < 300) {
            return 400;
        } else if (finalTechAmount < 400) {
            return 500;
        } else if (finalTechAmount < 500) {
            return 600;
        } else if (finalTechAmount < 600) {
            return 700;
        } else if (finalTechAmount < 700) {
            return 800;
        } else if (finalTechAmount < 1000) {
            return 1100;
        } else if (finalTechAmount < 2000) {
            return 1600;
        } else if (finalTechAmount < 3000) {
            return 2100;
        } else if (finalTechAmount < 4000) {
            return 2600;
        } else if (finalTechAmount < 5000) {
            return 3100;
        } else if (finalTechAmount < 6000) {
            return 3600;
        } else if (finalTechAmount < 7000) {
            return 4100;
        } else if (finalTechAmount < 8000) {
            return 4600;
        } else if (finalTechAmount < 9000) {
            return 5100;
        } else if (finalTechAmount < 10000) {
            return 5600;
        } else if (finalTechAmount < 15000) {
            return 6600;
        } else if (finalTechAmount < 20000) {
            return 7600;
        } else {
            return 8600;
        }
    }

    function getCostMultiplier(uint256 id) public view returns (uint256) {
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
