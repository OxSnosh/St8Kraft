//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Infrastructure.sol";
import "./Treasury.sol";
import "./Improvements.sol";
import "./Wonders.sol";
import "./Resources.sol";
import "./CountryParameters.sol";
import "./Forces.sol";
import "./Military.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TaxesContract is Ownable {
    address public countryMinter;
    address public infrastructure;
    address public treasury;
    address public improvements1;
    address public improvements2;
    address public improvements3;
    address public parameters;
    address public wonders2;
    address public wonders3;
    address public wonders4;
    address public resources;
    address public forces;
    address public military;

    InfrastructureContract inf;
    TreasuryContract tsy;
    ImprovementsContract1 imp1;
    ImprovementsContract2 imp2;
    ImprovementsContract3 imp3;
    CountryParametersContract params;
    WondersContract2 won2;
    WondersContract3 won3;
    WondersContract4 won4;
    ResourcesContract res;
    ForcesContract frc;
    MilitaryContract mil;

    constructor(
        address _countryMinter,
        address _infrastructure,
        address _treasury,
        address _improvements1,
        address _improvements2,
        address _improvements3
    ) {
        countryMinter = _countryMinter;
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        improvements2 = _improvements2;
        imp2 = ImprovementsContract2(_improvements2);
        improvements3 = _improvements3;
        imp3 = ImprovementsContract3(_improvements3);
    }

    function constructorContinued(
        address _parameters,
        address _wonders2,
        address _wonders3,
        address _wonders4,
        address _resources,
        address _forces,
        address _military
    ) public onlyOwner {
        parameters = _parameters;
        params = CountryParametersContract(_parameters);
        wonders2 = _wonders2;
        won2 = WondersContract2(_wonders2);
        wonders3 = _wonders3;
        won3 = WondersContract3(_wonders3);
        wonders4 = _wonders4;
        won4 = WondersContract4(_wonders4);
        resources = _resources;
        res = ResourcesContract(_resources);
        forces = _forces;
        frc = ForcesContract(_forces);
        military = _military;
        mil = MilitaryContract(_military);
    }

    mapping(uint256 => address) public idToOwnerTaxes;

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "caller must be country minter contract"
        );
        _;
    }

    function updateCountryMinter(address newAddress) public onlyOwner {
        countryMinter = newAddress;
    }

    function updateInfrastructureContract(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    function updateTreasuryContract(address newAddress) public onlyOwner {
        treasury = newAddress;
        tsy = TreasuryContract(newAddress);
    }

    function updateImprovementsContract1(address newAddress) public onlyOwner {
        improvements1 = newAddress;
        imp1 = ImprovementsContract1(newAddress);
    }

    function updateImprovementsContract2(address newAddress) public onlyOwner {
        improvements2 = newAddress;
        imp2 = ImprovementsContract2(newAddress);
    }

    function updateImprovementsContract3(address newAddress) public onlyOwner {
        improvements3 = newAddress;
        imp3 = ImprovementsContract3(newAddress);
    }

    function updateCountryParametersContract(address newAddress)
        public
        onlyOwner
    {
        parameters = newAddress;
        params = CountryParametersContract(newAddress);
    }

    function updateWondersContract2(address newAddress) public onlyOwner {
        wonders2 = newAddress;
        won2 = WondersContract2(newAddress);
    }

    function updateWondersContract3(address newAddress) public onlyOwner {
        wonders3 = newAddress;
        won3 = WondersContract3(newAddress);
    }

    function updateResourcesContract(address newAddress) public onlyOwner {
        resources = newAddress;
        res = ResourcesContract(newAddress);
    }

    function updateForcesContract(address newAddress) public onlyOwner {
        forces = newAddress;
        frc = ForcesContract(newAddress);
    }

    function updateMilitaryContract(address newAddress) public onlyOwner {
        military = newAddress;
        mil = MilitaryContract(newAddress);
    }

    function initiateTaxes(uint256 id, address nationOwner)
        public
        onlyCountryMinter
    {
        idToOwnerTaxes[id] = nationOwner;
    }

    function collectTaxes(uint256 id) public {
        require(idToOwnerTaxes[id] == msg.sender, "!nation owner");
        uint256 dailyIncomePerCitizen = getDailyIncome(id);
        uint256 daysSinceLastTaxCollection = tsy.getDaysSinceLastTaxCollection(
            id
        );
        uint256 taxRate = inf.getTaxRate(id);
        uint256 dailyTaxesCollectiblePerCitizen = ((dailyIncomePerCitizen *
            taxRate) / 100);
        uint256 taxesCollectible = (dailyTaxesCollectiblePerCitizen *
            daysSinceLastTaxCollection);
        inf.toggleCollectionNeededToChangeRate(id);
        tsy.increaseBalanceOnTaxCollection(id, taxesCollectible);
    }

    function getDailyIncome(uint256 id) public view returns (uint256) {
        uint256 happiness = getHappiness(id);
        //incrementers (added)
        uint256 banks = imp1.getBankCount(id);
        uint256 ministries = imp2.getForeignMinistryCount(id);
        uint256 harbors = imp2.getHarborCount(id);
        uint256 schools = imp3.getSchoolCount(id);
        uint256 universities = imp3.getUniversityCount(id);
        //detractors (subtracted)
        uint256 casinos = imp1.getCasinoCount(id);
        uint256 guerillaCamp = imp2.getGuerillaCampCount(id);
        uint256 multipliers = (100 +
            (banks * 7) +
            (ministries * 1) +
            (harbors * 1) +
            (schools * 5) +
            (universities * 8) -
            (guerillaCamp * 8) -
            (casinos * 1));
        uint256 baseDailyIncomePerCitizen = (((32 + (2 * happiness)) *
            multipliers) / 100);
        uint256 incomeAdjustments = getIncomeAdjustments(id);
        uint256 dailyIncomePerCitizen = baseDailyIncomePerCitizen + incomeAdjustments;
        return dailyIncomePerCitizen;
    }

    //need to make sure happiness stays positive for overflow
    function getHappiness(uint256 id) public view returns (uint256) {
        uint256 happinessAdditions = getHappinessPointsToAdd(id);
        uint256 happinessSubtractions = getHappinessPointsToSubtract(id);
        uint256 happiness = (happinessAdditions + happinessSubtractions);
        return happiness;
    }

    function getHappinessPointsToAdd(uint256 id) public view returns (uint256) {
        uint256 compatabilityPoints = checkCompatability(id);
        uint256 densityPoints = getDensityPoints(id);
        uint256 pointsFromResources = getPointsFromResources(id);
        uint256 wonderPoints = getHappinessFromWonders(id);
        uint256 technologyPoints = getTechnologyPoints(id);
        uint256 pointsFromAge = getPointsFromNationAge(id);
        uint256 pointsFromTrades = getPointsFromTrades(id);
        uint256 pointsFromDefcon = getPointsFromDefcon(id);
        uint256 happinessPointsToAdd = (compatabilityPoints +
            densityPoints +
            pointsFromResources +
            wonderPoints +
            technologyPoints +
            pointsFromAge +
            pointsFromTrades +
            pointsFromDefcon);
        return happinessPointsToAdd;
    }

    function getHappinessPointsToSubtract(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 taxRatePoints = getTaxRatePoints(id);
        uint256 pointsFromStability = getPointsFromMilitary(id);
        uint256 happinessPointsToSubtract = (25 -
            taxRatePoints -
            pointsFromStability);
        return happinessPointsToSubtract;
    }

    function checkCompatability(uint256 id)
        public
        view
        returns (uint256 compatability)
    {
        uint256 religion = params.getReligionType(id);
        uint256 govType = params.getGovernmentType(id);
        uint256 preferredReligion = params.getReligionPreference(id);
        uint256 preferredGovernment = params.getGovernmentPreference(id);
        uint256 religionPoints;
        uint256 governmentPoints;
        if (religion == preferredReligion) {
            religionPoints = 1;
        }
        if (govType == preferredGovernment) {
            governmentPoints = 1;
        }
        uint256 compatabilityPoints = (religionPoints + governmentPoints);
        return compatabilityPoints;
    }

    function checkPopulationDensity(uint256 id) public view returns (uint256) {
        uint256 landArea = inf.getLandCount(id);
        uint256 population = inf.getTotalPopulationCount(id);
        uint256 populationDensity = (population / landArea);
        return populationDensity;
    }

    function getDensityPoints(uint256 id) public view returns (uint256) {
        uint256 densityPoints = 0;
        uint256 density = checkPopulationDensity(id);
        uint256 maxDensity = 70;
        bool water = res.viewWater(id);
        if (water) {
            maxDensity = 120;
        }
        if (density < maxDensity) {
            densityPoints = 1;
        }
        return densityPoints;
    }

    function getPointsFromResources(uint256 id) public view returns (uint256) {
        uint256 pointsFromResources = 0;
        bool gems = res.viewGems(id);
        if (gems) {
            pointsFromResources += 3;
        }
        bool oil = res.viewOil(id);
        if (oil) {
            pointsFromResources += 2;
        }
        bool silver = res.viewSilver(id);
        if (silver) {
            pointsFromResources += 2;
        }
        bool spices = res.viewSpices(id);
        if (spices) {
            pointsFromResources += 2;
        }
        bool sugar = res.viewSugar(id);
        if (sugar) {
            pointsFromResources += 1;
        }
        bool water = res.viewWater(id);
        if (water) {
            pointsFromResources += 3;
        }
        bool wine = res.viewWine(id);
        if (wine) {
            pointsFromResources += 3;
        }
        bool beer = res.viewBeer(id);
        if (beer) {
            pointsFromResources += 2;
        }
        bool fastFood = res.viewFastFood(id);
        if (fastFood) {
            pointsFromResources += 2;
        }
        bool fineJewelry = res.viewFineJewelry(id);
        if (fineJewelry) {
            pointsFromResources += 3;
        }
        return pointsFromResources;
    }

    function getHappinessFromWonders(uint256 id)
        public
        view
        returns (uint256 wonderPts)
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
        uint256 wonderPoints = 0;
        if (monument) {
            wonderPoints += 4;
        }
        if (temple) {
            wonderPoints += 5;
        }
        if (university) {
            uint256 tech = inf.getTechnologyCount(id);
            uint256 techDivided = (tech / 1000);
            uint256 points;
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
            uint256 tech = inf.getTechnologyCount(id);
            uint256 techDivided = (tech / 1000);
            uint256 points;
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
        bool isMonument = won2.getGreatMonument(id);
        bool isTemple = won2.getGreatTemple(id);
        bool isUniversity = won2.getGreatUniversity(id);
        bool isInternet = won2.getInternet(id);
        bool isMovieIndustry = won3.getMovieIndustry(id);

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
        bool isWarMemorial = won3.getNationalWarMemorial(id);
        bool isScientificDevCenter = won3.getScientificDevelopmentCenter(id);
        bool isSpaceProgram = won4.getSpaceProgram(id);
        bool isUniversalHealthcare = won4.getUniversalHealthcare(id);
        return (
            isWarMemorial,
            isScientificDevCenter,
            isSpaceProgram,
            isUniversalHealthcare
        );
    }

    function getTechnologyPoints(uint256 id) public view returns (uint256) {
        uint256 pointsFromTechnology;
        uint256 tech = inf.getTechnologyCount(id);
        if (tech == 0) {
            pointsFromTechnology = 0;
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

    function getPointsFromNationAge(uint256 id) public view returns (uint256) {
        uint256 nationCreated = params.getTimeCreated(id);
        uint256 agePoints = 0;
        if ((block.timestamp - nationCreated) <= 90 days) {
            agePoints = 0;
        } else if ((block.timestamp - nationCreated) <= 180 days) {
            agePoints = 2;
        } else {
            agePoints = 4;
        }
        return agePoints;
    }

    function getPointsFromTrades(uint256 id) public view returns (uint256) {
        uint256[] memory partners = res.getTradingPartners(id);
        uint256 pointsFromTeamTrades = 0;
        for (uint256 i = 0; i < partners.length; i++) {
            uint256 partnerId = partners[i];
            uint256 callerNationTeam = params.getTeam(id);
            uint256 partnerTeam = params.getTeam(partnerId);
            if (callerNationTeam == partnerTeam) {
                pointsFromTeamTrades++;
            }
        }
        return pointsFromTeamTrades;
    }

    function getPointsFromDefcon(uint256 id) public view returns (uint256) {
        uint256 defconLevel = mil.getDefconLevel(id);
        uint256 pointsFromDefcon;
        if (defconLevel == 5) {
            pointsFromDefcon = 4;
        } else if (defconLevel == 4) {
            pointsFromDefcon = 3;
        } else if (defconLevel == 3) {
            pointsFromDefcon = 2;
        } else if (defconLevel == 2) {
            pointsFromDefcon = 1;
        } else {
            pointsFromDefcon = 0;
        }
        return pointsFromDefcon;
    }

    function getTaxRatePoints(uint256 id) public view returns (uint256) {
        uint256 subtractTaxPoints;
        uint256 taxRate = inf.getTaxRate(id);
        if (taxRate <= 16) {
            subtractTaxPoints = 0;
        } else if (taxRate <= 20) {
            subtractTaxPoints = 1;
        } else if (taxRate <= 23) {
            subtractTaxPoints = 3;
        } else if (taxRate <= 25) {
            subtractTaxPoints = 5;
        } else if (taxRate <= 30) {
            subtractTaxPoints = 7;
        }
        return subtractTaxPoints;
    }

    function getPointsFromMilitary(uint256 id) public view returns (uint256) {
        (uint256 ratio, ) = soldierToPopulationRatio(id);
        uint256 pointsFromMilitaryToSubtract;
        if (ratio > 80) {
            //unsure about this number
            pointsFromMilitaryToSubtract = 10;
        }
        if (ratio < 20) {
            pointsFromMilitaryToSubtract = 5;
        }
        if (ratio < 10) {
            pointsFromMilitaryToSubtract = 14;
        }
        return pointsFromMilitaryToSubtract;
        //need to include recent casualties
    }

    function soldierToPopulationRatio(uint256 id)
        public
        view
        returns (uint256, bool)
    {
        uint256 soldierCount = frc.getSoldierCount(id);
        uint256 populationCount = inf.getTotalPopulationCount(id);
        uint256 soldierPopulationRatio = (populationCount / soldierCount);
        bool environmentPenalty = false;
        if (soldierPopulationRatio > 60) {
            environmentPenalty = true;
        }
        return (soldierPopulationRatio, environmentPenalty);
    }

    function getIncomeAdjustments(uint256 id) public view returns (uint256) {
        uint256 adjustments = 0;
        bool furs = res.viewFurs(id);
        if (furs) {
            adjustments += 4;
        }
        bool gems = res.viewGems(id);
        if (gems) {
            adjustments += 2;
        }
        bool gold = res.viewGold(id);
        if (gold) {
            adjustments += 3;
        }
        bool silver = res.viewSilver(id);
        if (silver) {
            adjustments += 2;
        }
        bool scholars = res.viewScholars(id);
        if (scholars) {
            adjustments += 3;
        }
        return adjustments;
    }
}
