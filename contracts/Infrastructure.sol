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
    uint256 private infrastructureId;
    address public resources;
    address public improvements1;
    address public improvements3;
    address public wonders1;
    address public wonders2;
    address public wonders3;
    address public wonders4;
    address public forces;
    address public treasury;
    address public parameters;

    struct Infrastructure {
        uint256 landArea;
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
        address _wonders1,
        address _wonders2,
        address _wonders3,
        address _wonders4,
        address _treasury,
        address _parameters,
        address _forces
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
    }

    function generateInfrastructure() public {
        Infrastructure memory newInfrastrusture = Infrastructure(
            20,
            0,
            20,
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

    function getHappiness(uint256 id) public view returns (int256) {
        int256 compatabilityPoints = checkCompatability(id);
        int256 densityPoints = getDensityPoints(id);
        int256 taxRatePoints = getTaxRatePoints(id);
        int256 wonderPoints = getHappinessFromWonders(id);
        int256 technologyPoints = getTechnologyPoints(id);
        int256 pointsFromAge = getPointsFromNationAge(id);
        int256 pointsFromTrades = getPointsFromTrades(id);
        int256 pointsFromStability = getPointsFromMilitary(id);
        int256 happiness = (
            compatabilityPoints +
            densityPoints +
            taxRatePoints +
            wonderPoints +
            technologyPoints +
            pointsFromAge +
            pointsFromTrades +
            pointsFromStability
        );
        return happiness;
    }

    function checkCompatability(uint256 id)
        public
        view
        returns (int256 compatability)
    {
        uint256 religion = CountryParametersContract(parameters)
            .getReligionType(id);
        uint256 govType = CountryParametersContract(parameters)
            .getGovernmentType(id);
        uint256 preferredReligion = CountryParametersContract(parameters)
            .getReligionPreference(id);
        uint256 preferredGovernment = CountryParametersContract(parameters)
            .getGovernmentPreference(id);
        int256 religionPoints;
        int256 governmentPoints;
        if (religion == preferredReligion) {
            religionPoints = 1;
        }
        if (govType == preferredGovernment) {
            governmentPoints = 1;
        }
        int256 compatabilityPoints = (religionPoints + governmentPoints);
        return compatabilityPoints;
    }

    function checkPopulationDensity(uint256 id) public view returns (uint256) {
        uint256 landArea = idToInfrastructure[id].landArea;
        uint256 population = idToInfrastructure[id].populationCount;
        uint256 populationDensity = (population / landArea);
        return populationDensity;
    }

    function getDensityPoints(uint256 density) public pure returns (int256) {
        int256 densityPoints = 0;
        if (density < 70) {
            densityPoints = 1;
        }
        return densityPoints;
    }

    function getTaxRatePoints(uint256 id) public view returns (int256) {
        int256 taxPointsForHappiness;
        uint256 taxRate = getTaxRate(id);
        if (taxRate <= 16) {
            taxPointsForHappiness = 0;
        } else if (taxRate <= 20) {
            taxPointsForHappiness = -1;
        } else if (taxRate <= 23) {
            taxPointsForHappiness = -3;
        } else if (taxRate <= 25) {
            taxPointsForHappiness = -5;
        } else if (taxRate <= 30) {
            taxPointsForHappiness = -7;
        }
        return taxPointsForHappiness;
    }

    function getTaxRate(uint256 id)
        public
        view
        returns (uint256 taxPercentage)
    {
        uint256 taxRate = idToInfrastructure[id].taxRate;
        return taxRate;
    }

    function getHappinessFromWonders(uint256 id)
        public
        view
        returns (int256 wonderPts)
    {
        (
            bool monument,
            bool temple,
            bool university,
            bool internet,
            bool movieIndustry
        ) = wonderChecks1(id);
        (
            bool warMemorial,
            bool scientificDevCenter,
            bool spaceProgram,
            bool universalHealthcare
        ) = wonderChecks2(id);
        int256 wonderPoints = 0;
        if (monument) {
            wonderPoints += 4;
        }
        if (temple) {
            wonderPoints += 5;
        }
        if (university) {
            uint256 tech = idToInfrastructure[id].technologyCount;
            uint256 techDivided = (tech / 1000);
            int256 points;
            if (techDivided == 0) {
                points = 0;
            } else if (techDivided == 1) {
                points = 1;
            } else if (techDivided == 2) {
                points = 2;
            } else {
                points = 3;
            }
            wonderPoints += points;
        }
        if (internet) {
            wonderPoints += 5;
        }
        if (movieIndustry) {
            wonderPoints += 3;
        }
        if (warMemorial) {
            wonderPoints += 4;
        }
        if (scientificDevCenter) {
            uint256 tech = idToInfrastructure[id].technologyCount;
            uint256 techDivided = (tech / 1000);
            int256 points;
            if (techDivided == 0) {
                points = 0;
            } else if (techDivided == 1) {
                points = 1;
            } else if (techDivided == 2) {
                points = 2;
            } else if (techDivided == 3) {
                points = 3;
            } else if (techDivided == 3) {
                points = 3;
            } else {
                points = 5;
            }
            wonderPoints += points;
        }
        if (spaceProgram) {
            wonderPoints += 3;
        }
        if (universalHealthcare) {
            wonderPoints += 3;
        }
        return wonderPoints;
    }

    function wonderChecks1(uint256 id)
        internal
        view
        returns (
            bool,
            bool,
            bool,
            bool,
            bool
        )
    {
        bool isMonument = WondersContract2(wonders2).getGreatMonument(id);
        bool isTemple = WondersContract2(wonders2).getGreatTemple(id);
        bool isUniversity = WondersContract2(wonders2).getGreatUniversity(id);
        bool isInternet = WondersContract2(wonders2).getInternet(id);
        bool isMovieIndustry = WondersContract3(wonders3).getMovieIndustry(id);

        return (
            isMonument,
            isTemple,
            isUniversity,
            isInternet,
            isMovieIndustry
        );
    }

    function wonderChecks2(uint256 id)
        internal
        view
        returns (
            bool,
            bool,
            bool,
            bool
        )
    {
        bool isWarMemorial = WondersContract3(wonders3).getNationalWarMemorial(
            id
        );
        bool isScientificDevCenter = WondersContract3(wonders3)
            .getScientificDevelopmentCenter(id);
        bool isSpaceProgram = WondersContract4(wonders3).getSpaceProgram(id);
        bool isUniversalHealthcare = WondersContract4(wonders4)
            .getUniversalHealthcare(id);
        return (
            isWarMemorial,
            isScientificDevCenter,
            isSpaceProgram,
            isUniversalHealthcare
        );
    }

    function getTechnologyPoints(uint256 id) public view returns (int256) {
        int256 pointsFromTechnology;
        uint256 tech = idToInfrastructure[id].technologyCount;
        if (tech == 0) {
            pointsFromTechnology = -1;
        } else if (tech == 1) {
            pointsFromTechnology = 1;
        } else if (tech <= 3) {
            pointsFromTechnology = 2;
        } else if (tech <= 6) {
            pointsFromTechnology = 3;
        } else if (tech <= 10) {
            pointsFromTechnology = 4;
        } else if (tech <= 15) {
            pointsFromTechnology = 5;
        } else if (tech <= 200) {
            uint256 techDivided = (tech / 50);
            if (techDivided == 0) {
                pointsFromTechnology = 5;
            } else if (techDivided == 1) {
                pointsFromTechnology = 6;
            } else if (techDivided == 2) {
                pointsFromTechnology = 7;
            } else if (techDivided == 3) {
                pointsFromTechnology = 8;
            } else {
                pointsFromTechnology = 9;
            }
        } else {
            pointsFromTechnology = 9;
        }
        return pointsFromTechnology;
    }

    //check this
    function getPointsFromNationAge(uint256 id) public view returns (int256) {
        uint256 nationCreated = CountryParametersContract(parameters).getTimeCreated(id);
        int256 agePoints = 0;
        if ((block.timestamp - nationCreated) <= 90 days) {
            agePoints = 0;
        } else if ((block.timestamp - nationCreated) <= 180 days) {
            agePoints = 2;
        } else {
            agePoints = 4;
        }
        return agePoints;
    }

    function getPointsFromTrades(uint256 callerId) public view returns (int256) {
        uint256[] memory partners = ResourcesContract(resources).getTradingPartners(callerId);
        int256 pointsFromTeamTrades = 0;
        for (uint i = 0; i < partners.length; i++) {
            uint256 partnerId = partners[i];
            uint256 callerNationTeam = CountryParametersContract(parameters).getTeam(callerId);
            uint256 partnerTeam = CountryParametersContract(parameters).getTeam(partnerId);
            if (callerNationTeam == partnerTeam) {
                pointsFromTeamTrades++;
            }
        }
        return pointsFromTeamTrades;
    }

    function getPointsFromMilitary(uint256 id) public view returns (int256) {
        (uint256 ratio, ) = soldierToPopulationRatio(id);
        int256 pointsFromMilitary;
        if (ratio > 80) {
            //unsure about this number
            pointsFromMilitary = -10;
        }
        if (ratio < 20) {
            pointsFromMilitary = -5;
        }
        if (ratio < 10) {
            pointsFromMilitary = -14;
        }
        return pointsFromMilitary;
        //need to include recent casualties
    }

    function soldierToPopulationRatio(uint256 id) public view returns (uint256, bool) {
        uint256 soldierCount = ForcesContract(forces).getSoldierCount(id);
        uint256 populationCount = idToInfrastructure[id].populationCount;
        uint256 soldierPopulationRatio = (populationCount / soldierCount);
        bool environmentPenalty = false;
        if (soldierPopulationRatio > 60) {
            environmentPenalty = true;
        }
        return (soldierPopulationRatio, environmentPenalty);
    }
}
