//SPDX-License-Identifier: Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International
pragma solidity 0.8.17;

import "./Infrastructure.sol";
import "./Treasury.sol";
import "./Improvements.sol";
import "./Wonders.sol";
import "./Resources.sol";
import "./CountryParameters.sol";
import "./Forces.sol";
import "./Military.sol";
import "./Crime.sol";
import "./CountryMinter.sol";
import "./KeeperFile.sol";
import "./Environment.sol";
import "./NavyBattle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

///@title TaxesContract
///@author OxSnosh
///@dev this contract inherits from the open zeppelin ownable contract
///@notice this contract will allow a nation owner to collect taxes from their citizens
contract TaxesContract is Ownable {
    address public countryMinter;
    address public infrastructure;
    address public treasury;
    address public improvements1;
    address public improvements2;
    address public improvements3;
    address public improvements4;
    address public parameters;
    address public wonders1;
    address public wonders2;
    address public wonders3;
    address public wonders4;
    address public resources;
    address public forces;
    address public military;
    address public crime;
    address public additionalTaxes;
    address public bonusResources;
    address public keeper;
    address public environment;
    address public blockade;

    InfrastructureContract inf;
    TreasuryContract tsy;
    ImprovementsContract1 imp1;
    ImprovementsContract2 imp2;
    ImprovementsContract3 imp3;
    ImprovementsContract4 imp4;
    CountryParametersContract params;
    WondersContract1 won1;
    WondersContract2 won2;
    WondersContract3 won3;
    WondersContract4 won4;
    ResourcesContract res;
    ForcesContract frc;
    MilitaryContract mil;
    CrimeContract crm;
    AdditionalTaxesContract addTax;
    CountryMinter mint;
    BonusResourcesContract bonus;
    KeeperContract keep;
    EnvironmentContract env;
    NavalBlockadeContract blk;

    event TaxesCollected(uint256 indexed id, uint256 indexed amount);

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings1(
        address _countryMinter,
        address _infrastructure,
        address _treasury,
        address _improvements1,
        address _improvements2,
        address _improvements3,
        address _improvements4,
        address _additionalTaxes,
        address _bonusResources,
        address _keeper,
        address _environment
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
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
        improvements4 = _improvements4;
        imp4 = ImprovementsContract4(_improvements4);
        additionalTaxes = _additionalTaxes;
        addTax = AdditionalTaxesContract(_additionalTaxes);
        bonusResources = _bonusResources;
        bonus = BonusResourcesContract(_bonusResources);
        keeper = _keeper;
        keep = KeeperContract(_keeper);
        environment = _environment;
        env = EnvironmentContract(_environment);
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings2(
        address _parameters,
        address _wonders1,
        address _wonders2,
        address _wonders3,
        address _wonders4,
        address _resources,
        address _forces,
        address _military,
        address _crime,
        address _blockade
    ) public onlyOwner {
        parameters = _parameters;
        params = CountryParametersContract(_parameters);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
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
        crime = _crime;
        crm = CrimeContract(_crime);
        blockade = _blockade;
        blk = NavalBlockadeContract(_blockade);
    }

    ///@dev this is a public function callable only by the nation owner collecting taxes
    ///@notice this function will allow a nation owner to collect taxes from their citizens
    ///@param id this is the nation id of the nation collecting taxes
    function collectTaxes(uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        (bool war, ) = mil.getWarPeacePreference(id);
        require(war, "must be ready for war to collct taxes");
        (, uint256 taxesCollectible) = getTaxesCollectible(id);
        inf.toggleCollectionNeededToChangeRate(id);
        tsy.increaseBalanceOnTaxCollection(id, taxesCollectible);
        //need to reduce taxes collectible by a percentage for each blockade against
        emit TaxesCollected(id, taxesCollectible);
    }

    ///@dev this is a public view function that will return a nations taxes that are collectible
    ///@notice this function will return a nations taxes collectible
    ///@param id is the nation id of the nation being queried
    ///@return dailyTaxesCollectiblePerCitizen is the tax portion of each citizens income per day
    ///@return taxesCollectible is the amount of taxes that are collectible (daily taxes per citizen * days since last collection * citizen count)
    function getTaxesCollectible(
        uint256 id
    ) public view returns (uint256, uint256) {
        uint256 dailyIncomePerCitizen = getDailyIncome(id);
        uint256 daysSinceLastTaxCollection = tsy.getDaysSinceLastTaxCollection(
            id
        );
        (uint256 citizenCount, ) = inf.getTaxablePopulationCount(0);
        uint256 taxRate = inf.getTaxRate(id);
        uint256 dailyTaxesCollectiblePerCitizen = (dailyIncomePerCitizen *
            taxRate);
        uint256 taxesCollectible = (dailyTaxesCollectiblePerCitizen *
            daysSinceLastTaxCollection *
            citizenCount) * (10 ** 18);
        uint256 mod = 100;
        uint256 percentageReductionForBlockades = blk.getBlockadePercentageReduction(
            id
        );
        mod = mod - percentageReductionForBlockades;
        console.log("mod", mod);
        taxesCollectible = ((taxesCollectible * mod) / 100);        
        return (dailyTaxesCollectiblePerCitizen, taxesCollectible);
    }

    ///@dev this is a public view function that will return the daily gross income per citizen for a given nation
    ///@notice this function will return the gross income per citizen for a given nation
    ///@param id is the nation id of the nation being queried
    ///@return uint256 is the daily income of each citizen for a nation
    function getDailyIncome(uint256 id) public view returns (uint256) {
        uint256 happiness = getHappiness(id);
        //increasers
        uint256 banks = imp1.getBankCount(id);
        uint256 ministries = imp2.getForeignMinistryCount(id);
        uint256 harbors = imp2.getHarborCount(id);
        uint256 schools = imp3.getSchoolCount(id);
        uint256 universityPoints = addTax.getUniversityPoints(id);
        //detractors
        uint256 casinos = imp1.getCasinoCount(id);
        uint256 guerillaCamp = imp2.getGuerillaCampCount(id);
        uint256 multipliers = (100 +
            (banks * 7) +
            (ministries * 5) +
            (harbors * 1) +
            (schools * 5) +
            universityPoints -
            (guerillaCamp * 8) -
            (casinos * 1));
        uint256 baseDailyIncomePerCitizen = (((35 + (2 * happiness)) *
            multipliers) / 100);
        uint256 incomeAdjustments = addTax.getIncomeAdjustments(id);
        uint256 dailyIncomePerCitizen = baseDailyIncomePerCitizen +
            incomeAdjustments;
        return dailyIncomePerCitizen;
    }

    ///@dev this is a publci view function that will return a nations happiness
    ///@notice this function will return a nations happiness
    ///@notice the higher a nations happiness the more money its citizens will make
    ///@param id is the nation id of the nation being queried
    ///@return happiness is the happiness for the queried nation
    function getHappiness(uint256 id) public view returns (uint256) {
        uint256 happinessAdditions = getHappinessPointsToAdd(id);
        uint256 happinessSubtractions = getHappinessPointsToSubtract(id);
        uint256 happiness = 0;
        if (happinessSubtractions >= happinessAdditions) {
            happiness = 0;
        } else {
            happiness = (happinessAdditions - happinessSubtractions);
        }
        return happiness;
    }

    function getHappinessPointsToAdd(uint256 id) public view returns (uint256) {
        uint256 compatabilityPoints = checkCompatability(id);
        uint256 densityPoints = getDensityPoints(id);
        uint256 pointsFromResources = getPointsFromResources(id);
        uint256 pointsFromImprovements = getPointsFromImprovements(id);
        uint256 wonderPoints = getHappinessFromWonders(id);
        uint256 casualtyPoints = getCasualtyPoints(id);
        uint256 additionalHappinessPoints = getAdditionalHappinessPointsToAdd(
            id
        );
        uint256 happinessPointsToAdd = (compatabilityPoints +
            densityPoints +
            pointsFromResources +
            pointsFromImprovements +
            wonderPoints +
            casualtyPoints +
            additionalHappinessPoints);
        return happinessPointsToAdd;
    }

    function getAdditionalHappinessPointsToAdd(
        uint256 id
    ) internal view returns (uint256) {
        uint256 technologyPoints = getTechnologyPoints(id);
        uint256 pointsFromAge = getPointsFromNationAge(id);
        uint256 pointsFromTrades = addTax.getPointsFromTrades(id);
        uint256 pointsFromDefcon = addTax.getPointsFromDefcon(id);
        uint256 pointsFromGovt = addTax.getPointsFromGovernment(id);
        uint256 additonalHappinessPointsToAdd = (technologyPoints +
            pointsFromAge +
            pointsFromTrades +
            pointsFromDefcon +
            pointsFromGovt);
        return additonalHappinessPointsToAdd;
    }

    function getHappinessPointsToSubtract(
        uint256 id
    ) public view returns (uint256) {
        uint256 taxRatePoints = getTaxRatePoints(id);
        uint256 pointsFromStability = addTax.getPointsFromMilitary(id);
        uint256 pointsFromCrime = getPointsFromCriminals(id);
        uint256 pointsFromImprovements = addTax
            .getPointsToSubtractFromImprovements(id);
        uint256 pointsFromIntelAgencies = addTax.getPointsFromIntelAgencies(id);
        uint256 environmentPoints = env.getEnvironmentScore(id);
        uint256 happinessPointsToSubtract = (taxRatePoints +
            pointsFromCrime +
            pointsFromImprovements +
            pointsFromStability +
            pointsFromIntelAgencies +
            environmentPoints);
        return happinessPointsToSubtract;
    }

    function checkCompatability(
        uint256 id
    ) public view returns (uint256 compatability) {
        uint256 religion = params.getReligionType(id);
        uint256 govType = params.getGovernmentType(id);
        uint256 preferredReligion = params.getReligionPreference(id);
        uint256 preferredGovernment = params.getGovernmentPreference(id);
        (bool monument, bool temple, , , ) = wonderChecks1(id);
        uint256 religionPoints;
        uint256 governmentPoints;
        if (religion == preferredReligion || temple) {
            religionPoints = 1;
        }
        if (govType == preferredGovernment || monument) {
            governmentPoints = 1;
        }
        uint256 compatabilityPoints = (religionPoints + governmentPoints);
        return compatabilityPoints;
    }

    function checkPopulationDensity(uint256 id) public view returns (uint256) {
        uint256 landArea = inf.getAreaOfInfluence(id);
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
        if (density <= maxDensity) {
            densityPoints = 5;
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
        bool beer = bonus.viewBeer(id);
        if (beer) {
            pointsFromResources += 2;
        }
        bool fastFood = bonus.viewFastFood(id);
        if (fastFood) {
            pointsFromResources += 2;
        }
        bool fineJewelry = bonus.viewFineJewelry(id);
        if (fineJewelry) {
            pointsFromResources += 3;
        }
        uint256 additionalPoints = getAdditionalPointsFromResources(id);
        pointsFromResources += additionalPoints;
        return pointsFromResources;
    }

    function getAdditionalPointsFromResources(
        uint256 id
    ) public view returns (uint256) {
        uint256 additionalPointsFromResources;
        bool automobiles = bonus.viewAutomobiles(id);
        if (automobiles) {
            additionalPointsFromResources += 3;
        }
        bool microchips = bonus.viewMicrochips(id);
        if (microchips) {
            additionalPointsFromResources += 2;
        }
        return additionalPointsFromResources;
    }

    function getPointsFromImprovements(
        uint256 id
    ) public view returns (uint256) {
        uint256 pointsFromImprovements;
        uint256 borderWalls = imp1.getBorderWallCount(id);
        if (borderWalls > 0) {
            pointsFromImprovements += (2 * borderWalls);
        }
        uint256 casinos = imp1.getCasinoCount(id);
        if (casinos > 0) {
            pointsFromImprovements += (2 * casinos);
        }
        uint256 churchCount = imp1.getChurchCount(id);
        if (churchCount > 0) {
            pointsFromImprovements += churchCount;
        }
        uint256 policeHeadquarters = imp4.getPoliceHeadquartersCount(id);
        if (policeHeadquarters > 0) {
            pointsFromImprovements += (2 * policeHeadquarters);
        }
        uint256 redLightDistricts = imp3.getRedLightDistrictCount(id);
        if (redLightDistricts > 0) {
            pointsFromImprovements += (redLightDistricts);
        }
        uint256 stadiums = imp3.getStadiumCount(id);
        if (stadiums > 0) {
            pointsFromImprovements += (3 * stadiums);
        }
        uint256 taxRate = inf.getTaxRate(id);
        uint256 intelAgencies = imp2.getIntelAgencyCount(id);
        if (taxRate >= 23) {
            pointsFromImprovements += intelAgencies;
        }
        return pointsFromImprovements;
    }

    function getHappinessFromWonders(
        uint256 id
    ) public view returns (uint256 wonderPts) {
        (
            bool monument,
            bool temple,
            bool greatUniversity,
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
        uint256 tech = inf.getTechnologyCount(id);
        uint256 techDivided = (tech / 1000);
        if (greatUniversity && !scientificDevCenter) {
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
        } else if (greatUniversity && scientificDevCenter) {
            uint256 points;
            if (techDivided == 0) {
                points = 0;
            } else if (techDivided == 1) {
                points = 1;
            } else if (techDivided == 2) {
                points = 2;
            } else if (techDivided == 3) {
                points = 3;
            } else if (techDivided == 4) {
                points = 4;
            } else {
                points = 5;
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
        if (spaceProgram) {
            wonderPoints += 3;
        }
        if (universalHealthcare) {
            wonderPoints += 2;
        }
        return wonderPoints;
    }

    function wonderChecks1(
        uint256 id
    ) internal view returns (bool, bool, bool, bool, bool) {
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

    function wonderChecks2(
        uint256 id
    ) internal view returns (bool, bool, bool, bool) {
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

    function getCasualtyPoints(uint256 id) public view returns (uint256) {
        bool nationalCemetary = won3.getNationalCemetary(id);
        (uint256 casualties, ) = frc.getCasualties(id);
        uint256 casualtyPoints = 0;
        if (nationalCemetary) {
            if (casualties < 10000000) {
                casualtyPoints = 1;
            } else if (casualties < 15000000) {
                casualtyPoints = 2;
            } else if (casualties < 20000000) {
                casualtyPoints = 3;
            } else if (casualties < 25000000) {
                casualtyPoints = 4;
            } else if (casualties >= 25000000) {
                casualtyPoints = 5;
            }
        }
        return casualtyPoints;
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
        } else if (tech <= 50) {
            pointsFromTechnology = 6;
        } else if (tech <= 100) {
            pointsFromTechnology = 7;
        } else if (tech <= 150) {
            pointsFromTechnology = 8;
        } else if (tech <= 200) {
            pointsFromTechnology = 9;
        } else {
            pointsFromTechnology = 10;
        }
        return pointsFromTechnology;
    }

    function getPointsFromNationAge(uint256 id) public view returns (uint256) {
        uint256 nationCreated = params.getDayCreated(id);
        uint256 gameDay = keep.getGameDay();
        uint256 agePoints = 0;
        if ((gameDay - nationCreated) < 90) {
            agePoints = 0;
        } else if ((gameDay - nationCreated) < 180) {
            agePoints = 2;
        } else {
            agePoints = 4;
        }
        return agePoints;
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



    function getPointsFromCriminals(uint256 id) public view returns (uint256) {
        (uint256 unincarceratedCriminals, , ) = crm.getCriminalCount(id);
        uint256 pointsFromCrime;
        if (unincarceratedCriminals < 200) {
            pointsFromCrime = 0;
        } else if (unincarceratedCriminals < 2000) {
            pointsFromCrime = 1;
        } else if (unincarceratedCriminals < 4000) {
            pointsFromCrime = 2;
        } else if (unincarceratedCriminals < 6000) {
            pointsFromCrime = 3;
        } else if (unincarceratedCriminals < 8000) {
            pointsFromCrime = 4;
        } else {
            pointsFromCrime = 5;
        }
        return pointsFromCrime;
    }
}

///@title AdditionalTaxesContract
///@author OxSnosh
///@dev tis contract inherits from openzeppelin's ownable contract
///@notice this contract will have additional formulas that will allow a nation to collect taxes from its citizens
contract AdditionalTaxesContract is Ownable {
    address public infrastructure;
    address public improvements2;
    address public improvements3;
    address public parameters;
    address public wonders1;
    address public wonders2;
    address public wonders3;
    address public wonders4;
    address public resources;
    address public military;
    address public bonusResources;
    address public forces;

    InfrastructureContract inf;
    ImprovementsContract2 imp2;
    ImprovementsContract3 imp3;
    CountryParametersContract params;
    WondersContract1 won1;
    WondersContract2 won2;
    WondersContract3 won3;
    WondersContract4 won4;
    ResourcesContract res;
    MilitaryContract mil;
    BonusResourcesContract bonus;
    ForcesContract frc;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _parameters,
        address _wonders1,
        address _wonders2,
        address _wonders3,
        address _wonders4,
        address _resources,
        address _military,
        address _infrastructure,
        address _bonusResources
    ) public onlyOwner {
        parameters = _parameters;
        params = CountryParametersContract(_parameters);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        wonders2 = _wonders2;
        won2 = WondersContract2(_wonders2);
        wonders3 = _wonders3;
        won3 = WondersContract3(_wonders3);
        wonders4 = _wonders4;
        won4 = WondersContract4(_wonders4);
        resources = _resources;
        res = ResourcesContract(_resources);
        military = _military;
        mil = MilitaryContract(_military);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        bonusResources = _bonusResources;
        bonus = BonusResourcesContract(_bonusResources);
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings2(
        address _improvements2,
        address _improvements3,
        address _forces
    ) public onlyOwner {
        improvements2 = _improvements2;
        imp2 = ImprovementsContract2(_improvements2);
        improvements3 = _improvements3;
        imp3 = ImprovementsContract3(_improvements3);
        forces = _forces;
        frc = ForcesContract(_forces);
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
        bool scholars = bonus.viewScholars(id);
        if (scholars) {
            adjustments += 3;
        }
        bool agriDevProgram = won1.getAgriculturalDevelopmentProgram(id);
        if (agriDevProgram) {
            adjustments += 2;
        }
        bool miningIndustryConsortium = won2.getMiningIndustryConsortium(id);
        if (miningIndustryConsortium) {
            uint256 points = getResourcePointsForMiningConsortium(id);
            adjustments += (2 * points);
        }
        bool stockMarket = won4.getStockMarket(id);
        if (stockMarket) {
            adjustments += 10;
        }
        uint256 uraniumAndNuclearPowerBonus = getNuclearAndUraniumBonus(id);
        adjustments += uraniumAndNuclearPowerBonus;
        return adjustments;
    }

    function getResourcePointsForMiningConsortium(
        uint256 id
    ) public view returns (uint256) {
        uint256 points = 0;
        bool coal = res.viewCoal(id);
        if (coal) {
            points += 1;
        }
        bool lead = res.viewLead(id);
        if (lead) {
            points += 1;
        }
        bool oil = res.viewOil(id);
        if (oil) {
            points += 1;
        }
        bool uranium = res.viewUranium(id);
        if (uranium) {
            points += 1;
        }
        return points;
    }

    function getNuclearAndUraniumBonus(
        uint256 id
    ) public view returns (uint256) {
        bool nuclearPowerPlant = won3.getNuclearPowerPlant(id);
        bool uranium = res.viewUranium(id);
        uint256 techAmount = inf.getTechnologyCount(id);
        uint256 adjustment = 0;
        if (nuclearPowerPlant && uranium) {
            adjustment += 3;
            if (techAmount >= 10 && techAmount < 20) {
                adjustment += 1;
            } else if (techAmount >= 20 && techAmount < 30) {
                adjustment += 2;
            } else if (techAmount >= 30 && techAmount < 40) {
                adjustment += 3;
            } else if (techAmount >= 40) {
                adjustment += 4;
            }
        }
        return adjustment;
    }

    function getPointsFromTrades(uint256 id) public view returns (uint256) {
        uint256[] memory partners = res.getTradingPartners(id);
        uint256 pointsFromTeamTrades = 0;
        uint256 callerNationTeam = params.getTeam(id);
        for (uint256 i = 0; i < partners.length; i++) {
            uint256 partnerId = partners[i];
            uint256 partnerTeam = params.getTeam(partnerId);
            if (callerNationTeam == partnerTeam) {
                pointsFromTeamTrades++;
            }
        }
        return pointsFromTeamTrades;
    }

    function getPointsFromDefcon(uint256 id) public view returns (uint256) {
        uint256 defconLevel = mil.getDefconLevel(id);
        return (defconLevel - 1);
    }

    function getPointsToSubtractFromImprovements(
        uint256 id
    ) public view returns (uint256) {
        uint256 pointsToSubtractFromImprovements;
        uint256 laborCamps = imp2.getLaborCampCount(id);
        if (laborCamps > 0) {
            pointsToSubtractFromImprovements += (laborCamps * 1);
        }
        return pointsToSubtractFromImprovements;
    }

    function getUniversityPoints(uint256 id) public view returns (uint256) {
        uint256 universities = imp3.getUniversityCount(id);
        uint256 universityPoints = 0;
        bool scientificDevelopmentCenter = won3.getScientificDevelopmentCenter(
            id
        );
        if (universities > 0 && !scientificDevelopmentCenter) {
                universityPoints = (universities * 8);
        } else if (universities > 0 && scientificDevelopmentCenter) {
                universityPoints = (universities * 10);
        }
        return universityPoints;
    }

    function getPointsFromGovernment(uint256 id) public view returns (uint256) {
        uint256 governmentType = params.getGovernmentType(id);
        uint256 pointsFromGovernmentType = 0;
        if (
            governmentType == 3 ||
            governmentType == 6 ||
            governmentType == 8 ||
            governmentType == 9
        ) {
            pointsFromGovernmentType = 1;
        }
        return pointsFromGovernmentType;
    }

    function getPointsFromMilitary(uint256 id) public view returns (uint256) {
        (uint256 ratio, , ) = soldierToPopulationRatio(id);
        uint256 pointsFromMilitaryToSubtract;
        if (ratio > 70) {
            pointsFromMilitaryToSubtract = 10;
        }
        if (ratio < 20) {
            pointsFromMilitaryToSubtract = 5;
        }
        if (ratio < 10) {
            pointsFromMilitaryToSubtract = 14;
        }
        return pointsFromMilitaryToSubtract;
    }

    function soldierToPopulationRatio(
        uint256 id
    ) public view returns (uint256, bool, bool) {
        uint256 soldierCount = frc.getSoldierCount(id);
        if (soldierCount == 0) {
            return(0, false, true);
        }
        uint256 populationCount = inf.getTotalPopulationCount(id);
        uint256 soldierPopulationRatio = (
            ((soldierCount * 100) / populationCount)
        );
        bool environmentPenalty = false;
        bool anarchyCheck = false;
        if (soldierPopulationRatio > 60) {
            environmentPenalty = true;
        }
        if (soldierPopulationRatio < 10) {
            anarchyCheck = true;
        }
        return (soldierPopulationRatio, environmentPenalty, anarchyCheck);
    }

        function getPointsFromIntelAgencies(
        uint256 id
    ) public view returns (uint256) {
        uint256 intelAgencies = imp2.getIntelAgencyCount(id);
        uint256 subtractPoints;
        uint256 taxRate = inf.getTaxRate(id);
        if (taxRate <= 20) {
            subtractPoints = 0;
        } else if (intelAgencies >= 1 && taxRate > 20 && taxRate <= 23) {
            subtractPoints = 1;
        } else if (intelAgencies >= 1 && taxRate > 23) {
            subtractPoints = intelAgencies;
        } else {
            subtractPoints = 0;
        }
        return subtractPoints;
    }
}
