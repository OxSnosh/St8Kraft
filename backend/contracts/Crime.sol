//SPDX-License-Identifier: Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International
pragma solidity 0.8.17;

import "./Infrastructure.sol";
import "./Improvements.sol";
import "./CountryParameters.sol";
import "./Wonders.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

///@title CrimeContract
///@author OxSnosh
///@notice this contract will calculate the number of criminals in a nations population
contract CrimeContract is Ownable {
    address public infrastructure;
    address public improvements1;
    address public improvements2;
    address public improvements3;
    address public improvements4;
    address public parameters;
    address public wonders2;

    InfrastructureContract inf;
    ImprovementsContract1 imp1;
    ImprovementsContract2 imp2;
    ImprovementsContract3 imp3;
    ImprovementsContract4 imp4;
    CountryParametersContract cp;
    WondersContract2 won2;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _infrastructure,
        address _improvements1,
        address _improvements2,
        address _improvements3,
        address _improvements4,
        address _parameters,
        address _wonders2
    ) public onlyOwner {
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        improvements2 = _improvements2;
        imp2 = ImprovementsContract2(_improvements2);
        improvements3 = _improvements3;
        imp3 = ImprovementsContract3(_improvements3);
        parameters = _parameters;
        improvements4 = _improvements4;
        imp4 = ImprovementsContract4(_improvements4);
        cp = CountryParametersContract(_parameters);
        wonders2 = _wonders2;
        won2 = WondersContract2(_wonders2);
    }

    ///@dev this is a public view function that will calculate the number of criminals in a nations population
    ///@notice this will calulate the number of criminals in a nations population
    ///@notice criminals will rduce the amount of your tax paying citizens
    ///@notice you will also lose population happiness as your criminal population increases
    ///@notice jails, labor camps, border walls and prisons will reduce the number of criminals in your nation
    ///@param id this is the nation ID for the nation being queried
    ///@return uint256 this function will return the number of criminals in your population
    function getCriminalCount(
        uint256 id
    ) public view returns (uint256, uint256, uint256) {
        uint256 totalPopulation = inf.getTotalPopulationCount(id);
        uint256 crimeIndex = getCrimeIndex(id);
        uint256 criminalPercentage = (crimeIndex + 1);
        uint256 baseCriminalCount = ((totalPopulation * criminalPercentage) /
            100);
        uint256 rehabs = imp3.getRehabilitationFacilityCount(id);
        uint256 rehabilitatedCitizens = (rehabs * 1000);
        if (baseCriminalCount <= rehabilitatedCitizens) {
            rehabilitatedCitizens = baseCriminalCount;
            baseCriminalCount = 0;
        } else {
            baseCriminalCount = baseCriminalCount - rehabilitatedCitizens;
        }
        (uint256 criminalCount, uint256 incarcerated) = incarcerateCriminals(baseCriminalCount, id);
        return (criminalCount, rehabilitatedCitizens, incarcerated);
    }

    function incarcerateCriminals(
        uint256 baseCriminalCount,
        uint256 countryId
    ) public view returns (uint256, uint256) {
        uint256 jailCount = imp2.getJailCount(countryId);
        uint256 laborCamps = imp2.getLaborCampCount(countryId);
        uint256 prisons = imp3.getPrisonCount(countryId);
        uint256 incarceratedCriminals = 0;
        uint256 roomForIncarceration = ((jailCount * 500) +
            (laborCamps * 200) +
            (prisons * 5000));
        if (baseCriminalCount <= roomForIncarceration) {
            incarceratedCriminals = baseCriminalCount;
            baseCriminalCount = 0;
        } else {
            baseCriminalCount = baseCriminalCount - roomForIncarceration;
            incarceratedCriminals = roomForIncarceration;
        }
        uint256 criminalCountPercentageModifier = 100;
        uint256 borderWalls = imp1.getBorderWallCount(countryId);
        if (borderWalls > 0) {
            criminalCountPercentageModifier -= borderWalls;
        }
        uint256 criminalCount = ((baseCriminalCount *
            criminalCountPercentageModifier) / 100);
        return (criminalCount, incarceratedCriminals);
    }

    ///@dev this function will take your nation's crime prevention score and return a crime index
    ///@notice the higher your crime prevention score the lower your crime index
    ///@notice the higher your crime index the more criminals you will have in your population
    ///@param id this is the nation ID of the country being queried
    ///@return uint256 this is crime index of the nation
    ///@notice the percentage of your population that is criminals = crime index +1
    function getCrimeIndex(uint256 id) public view returns (uint256) {
        uint256 cps = getCrimePreventionScore(id);
        uint256 crimeIndex;
        if (cps < 200) {
            crimeIndex = 6;
        } else if (cps < 250) {
            crimeIndex = 5;
        } else if (cps < 300) {
            crimeIndex = 4;
        } else if (cps < 350) {
            crimeIndex = 3;
        } else if (cps < 400) {
            crimeIndex = 2;
        } else if (cps < 500) {
            crimeIndex = 1;
        } else {
            crimeIndex = 0;
        }
        return crimeIndex;
    }

    ///@dev this is a public view function that calculates a nations crime prevention score
    ///@notice this function calculates crime prevention score
    ///@notice the higher the CPS the lower the number of criminals in your population
    ///@param id is the nation ID of the nation being queried
    ///@return uint256 is the crime prevention score being returned by the function
    function getCrimePreventionScore(uint256 id) public view returns (uint256) {
        uint256 litPoints = getLiteracyPoints(id);
        uint256 improvementPoints = getImprovementPoints(id);
        uint256 taxRatePoints = getTaxRateCrimeMultiplier(id);
        uint256 governmentPoints = getPointsFromGovernmentType(id);
        uint256 getPointsFromInfrastructure = getPointsFromInfrastruture(id);
        uint256 populationPoints = getPointsFromPopulation(id);
        uint256 cps = (litPoints +
            improvementPoints +
            taxRatePoints +
            governmentPoints +
            getPointsFromInfrastructure +
            populationPoints);
        return cps;
    }

    ///@dev this is a public view function that returns the literace rate of the nation
    ///@notice this function will return a nations literacy rate
    ///@param id is the nation ID of the countey being queried
    ///@return uint256 is the literacy rate of the nation
    ///@notice literacy is increased by the amount of technology of a nation as well as the amount of schools and universities
    ///@notice increased literacy will increase crime prevention score
    function getLiteracy(uint256 id) public view returns (uint256) {
        uint256 tech = inf.getTechnologyCount(id);
        uint256 litBeforeModifiers;
        if (tech <= 50) {
            litBeforeModifiers = 20;
        } else {
            uint256 addedLiteracy = ((tech - 50) / 3);
            litBeforeModifiers = (20 + addedLiteracy);
        }
        uint256 schoolPoints = imp3.getSchoolCount(id);
        uint256 universities = imp3.getUniversityCount(id);
        uint256 universityPoints = (universities * 3);
        bool greatUniversity = won2.getGreatUniversity(id);
        if (greatUniversity == true) {
            universityPoints += 10;
        }
        uint256 literacy = (litBeforeModifiers +
            schoolPoints +
            universityPoints);
        if (literacy > 100) {
            literacy = 100;
        }
        return literacy;
    }

    ///@dev this function is a public view function that will calculate the amount of points that a nations literace rate will add to the crime prevention score
    ///@notice literaacy will increse the crime prevention score of a nation
    ///@notice crime prevention score points added will be 80% of literacy (max of 80 points added)
    ///@param id is the nation ID of the nation being queried
    ///@return uint256 is the amount of points being added to the crime prevention score
    function getLiteracyPoints(uint256 id) public view returns (uint256) {
        uint256 literacyPercentage = getLiteracy(id);
        uint256 litPoints = ((literacyPercentage * 80) / 100);
        return litPoints;
    }

    ///@dev this is a publci view function that will calculate the amount of crime prevention score points from a nations improvements and tax rate
    ///@notice schools, universities, polive headquarters, casinos and red light districts all affect a nations crime prevention score
    ///@notice a nations tax rate will change the magnitude of these improvements affect on crime prevention score
    ///@notice the higher a tax rate the lower the crime prevention score will be and the more criminals a population will have
    ///@param id this is the nation ID of the nation being queried
    ///@return uint256 is the number of points added to crime prevention score from imrpovements and tax rate
    function getImprovementPoints(uint256 id) public view returns (uint256) {
        uint256 schools = imp3.getSchoolCount(id);
        uint256 universities = imp3.getUniversityCount(id);
        uint256 policeHqs = imp4.getPoliceHeadquartersCount(id);
        uint256 casinoCount = imp1.getCasinoCount(id);
        uint256 redLightDistricts = imp3.getRedLightDistrictCount(id);
        uint256 schoolPoints = (schools * 3);
        uint256 universityPoints = (universities * 10);
        uint256 policeHqPoints = (policeHqs * 2);
        uint256 casinoPoints = (casinoCount * 2);
        uint256 redLightDistrictPoints = (redLightDistricts * 2);
        uint256 improvementPoints = (8 +
            schoolPoints +
            universityPoints +
            policeHqPoints -
            casinoPoints -
            redLightDistrictPoints);
        return improvementPoints;
    }

    ///@dev this a public vuew function that will return the multiplier used to adjust the affect that a nations tax rate will have on crime prevention score
    ///@notice the higher a nations tax rate the lower the multiplier will be and the lower the crime prevention score will be
    ///@param id is the nation ID of the nation being queried
    ///@return uint256 is the munliplier used to adjust the points added to crime prevention score from taxes and improvements
    function getTaxRateCrimeMultiplier(
        uint256 id
    ) public view returns (uint256) {
        uint256 taxRate = inf.getTaxRate(id);
        uint256 taxRateCrimeMultiplier;
        if (taxRate <= 15) {
            taxRateCrimeMultiplier = 35;
        } else if (taxRate == 16) {
            taxRateCrimeMultiplier = 34;
        } else if (taxRate == 17) {
            taxRateCrimeMultiplier = 33;
        } else if (taxRate == 18) {
            taxRateCrimeMultiplier = 32;
        } else if (taxRate == 19) {
            taxRateCrimeMultiplier = 31;
        } else if (taxRate == 20) {
            taxRateCrimeMultiplier = 30;
        } else if (taxRate == 21) {
            taxRateCrimeMultiplier = 29;
        } else if (taxRate == 22) {
            taxRateCrimeMultiplier = 28;
        } else if (taxRate == 23) {
            taxRateCrimeMultiplier = 27;
        } else if (taxRate == 24) {
            taxRateCrimeMultiplier = 26;
        } else if (taxRate == 25) {
            taxRateCrimeMultiplier = 25;
        } else if (taxRate == 26) {
            taxRateCrimeMultiplier = 24;
        } else if (taxRate == 27) {
            taxRateCrimeMultiplier = 23;
        } else if (taxRate == 28) {
            taxRateCrimeMultiplier = 22;
        } else if (taxRate == 29) {
            taxRateCrimeMultiplier = 21;
        } else if (taxRate == 30) {
            taxRateCrimeMultiplier = 20;
        }
        uint256 taxMultiplier = (taxRateCrimeMultiplier);
        return taxMultiplier;
    }

    ///@dev this is a public view function that will add points to crime prevention score based on government type
    ///@notice different govermnet types will affect a nations crime prevenetion score differently
    ///@param id is the nation ID of the nation being queried
    ///@return uint256 is the points added to crime prevention score from governemtn type
    function getPointsFromGovernmentType(
        uint256 id
    ) public view returns (uint256) {
        uint256 governmentPoints;
        uint256 gov = cp.getGovernmentType(id);
        if (gov == 0) {
            /** Anarchy */
            governmentPoints = 50;
        } else if (gov == 1) {
            /** Capitalist */
            governmentPoints = 110;
        } else if (gov == 2) {
            /** Communist */
            governmentPoints = 150;
        } else if (gov == 3) {
            /** Democracy */
            governmentPoints = 120;
        } else if (gov == 4) {
            /** Dictatorship */
            governmentPoints = 175;
        } else if (gov == 5) {
            /** Federal Goverment */
            governmentPoints = 160;
        } else if (gov == 6) {
            /** Monarchy */
            governmentPoints = 140;
        } else if (gov == 7) {
            /** Republic */
            governmentPoints = 165;
        } else if (gov == 8) {
            /** Revolutuionary */
            governmentPoints = 150;
        } else if (gov == 9) {
            /** Totalitarian State */
            governmentPoints = 190;
        } else {
            /** Transitional */
            governmentPoints = 100;
        }
        return governmentPoints;
    }

    ///@dev this is a public view function that will return the crime prevention score points from infrastructure
    ///@notice more infrastructure will increase crime prevention score reducing criminals
    ///@param id is the nation ID for the countrtry being queried
    ///@return uint256 is the points added to crime prevention score from infrastructure
    function getPointsFromInfrastruture(
        uint256 id
    ) public view returns (uint256) {
        uint256 infra = inf.getInfrastructureCount(id);
        uint256 infraPoints = (infra / 400);
        return infraPoints;
    }

    ///@dev this is a public view function that will add points to crime prevention score based on population
    ///@notice increased population will reduce croime prevention score
    ///@param id is the nation id of the nation being queries
    ///@return uint256 is the amount of points being added to crime prevention score
    function getPointsFromPopulation(uint256 id) public view returns (uint256) {
        uint256 population = inf.getTotalPopulationCount(id);
        uint256 populationPointsDeduction = (population / 250);
        if (populationPointsDeduction >= 350) {
            populationPointsDeduction = 350;
        }
        uint256 populationPoints = (350 - populationPointsDeduction);
        return populationPoints;
    }
}
