//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Infrastructure.sol";
import "./Improvements.sol";
import "./CountryParameters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrimeContract is Ownable {
    address public infrastructure;
    address public improvements3;
    address public parameters;

    InfrastructureContract inf;
    ImprovementsContract3 imp3;
    CountryParametersContract cp;

    constructor (address _infrastructure, address _improvements3, address _parameters) {
        inf = InfrastructureContract(_infrastructure);
        imp3 = ImprovementsContract3(_improvements3);
        cp = CountryParametersContract(_parameters);
    }

    function updateInfrastructureContract(address _newAddress) public onlyOwner {
        infrastructure = _newAddress;
        inf = InfrastructureContract(_newAddress);
    }

    function updateImprovementsContract3(address _newAddress) public onlyOwner {
        improvements3 = _newAddress;
        imp3 = ImprovementsContract3(_newAddress);
    }

    function updateCountryParameters(address _newAddress) public onlyOwner {
        parameters = _newAddress;
        cp = CountryParametersContract(_newAddress);
    }

    function getCrimePreventionScore(uint256 id) public view returns (uint256) {
        uint256 litPoints = getLiteracyPoints(id);
        uint256 improvementPoints = getImprovementPoints(id);
        uint256 governmentPoints = getPointsFromGovernmentType(id);
        uint256 getPointsFromInfrastructure = getPointsFromInfrastruture(id);
        uint256 populationPoints = getPointsFromPopulation(id);
        //add government positions

    }

    function getLiteracyPoints(uint256 id) public view returns (uint256) {
        uint256 tech = inf.getTechnologyCount(id);
        uint256 litBeforeModifiers;
        if(tech <= 50) {
            litBeforeModifiers = 20;
        } else {
            uint256 addedLiteracy = ((tech-50)/3);
            litBeforeModifiers = (20 + addedLiteracy);
        }
        uint256 schoolPoints = imp3.getSchoolCount(id);
        uint256 universities = imp3.getUniversityCount(id);
        uint256 universityPoints = (universities * 3);
        uint256 literacy = (litBeforeModifiers + schoolPoints + universityPoints);
        uint256 litPoints = ((literacy * 80) / 100);
        return litPoints;
    }

    function getImprovementPoints(uint256 id) public view returns (uint256) {
        uint256 schools = imp3.getSchoolCount(id);
        uint256 universities = imp3.getUniversityCount(id);
        uint256 policeHqs = imp3.getPoliceHeadquartersCount(id);
        uint256 schoolPoints = (schools * 3);
        uint256 universityPoints = (universities * 10);
        uint256 policeHqPoints = (policeHqs * 2);
        uint256 taxMultiplier = getTaxRateCrimeMultiplier(id);
        uint256 improvementPoints = (((schoolPoints + universityPoints + policeHqPoints) * taxMultiplier) / 100);
        return improvementPoints;
    }

    function getTaxRateCrimeMultiplier(uint256 id) public view returns (uint256) {
        uint256 taxRate = inf.getTaxRate(id);
        uint256 taxRateCrimeMultiplier;
        if (taxRate <= 10) {
            taxRateCrimeMultiplier = 40;
        } else if (taxRate == 11) {
            taxRateCrimeMultiplier = 39;
        } else if (taxRate == 12) {
            taxRateCrimeMultiplier = 38;
        } else if (taxRate == 13) {
            taxRateCrimeMultiplier = 37;
        } else if (taxRate == 14) {
            taxRateCrimeMultiplier = 36;
        } else if (taxRate == 15) {
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
        uint256 taxMultiplier = (taxRateCrimeMultiplier * 12);
        return taxMultiplier;
    }

    function getPointsFromGovernmentType(uint256 id) public view returns (uint256) {
        uint256 governmentPoints;
        uint256 gov = cp.getGovernmentType(id);
        if (gov == 0) {
            governmentPoints = 50;
        } else if (gov == 1) {
            governmentPoints = 110;
        } else if (gov == 2) {
            governmentPoints = 150;
        } else if (gov == 3) {
            governmentPoints = 120;
        } else if (gov == 4) {
            governmentPoints = 175;
        } else if (gov == 5) {
            governmentPoints = 160;
        } else if (gov == 6) {
            governmentPoints = 140;
        } else if (gov == 7) {
            governmentPoints = 165;
        } else if (gov == 8) {
            governmentPoints = 150;
        } else if (gov == 9) {
            governmentPoints = 190;
        } else {
            governmentPoints = 100;
        }
        return governmentPoints;
    }

    function getPointsFromInfrastruture(uint256 id) public view returns (uint256) {
        uint256 infra = inf.getInfrastructureCount(id);
        uint256 infraPoints = (infra / 100);
        return infraPoints;
    }

    function getPointsFromPopulation(uint256 id) public view returns (uint256) {
        uint256 population = inf.getTotalPopulationCount(id);
        uint256 populationPoints = (600 - (population / 500));
        return populationPoints;
    }
}