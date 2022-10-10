//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Resources.sol";
import "./Infrastructure.sol";
import "./Improvements.sol";
import "./Wonders.sol";
import "./Forces.sol";
import "./Taxes.sol";
import "./CountryParameters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnvironmentContract is Ownable {
    address public resources;
    address public infrastructure;
    address public improvements1;
    address public improvements4;
    address public wonders3;
    address public wonders4;
    address public forces;
    address public parameters;
    address public taxes;
    address public missiles;

    ResourcesContract res;
    InfrastructureContract inf;
    ImprovementsContract1 imp1;
    ImprovementsContract4 imp4;
    WondersContract3 won3;
    WondersContract4 won4;
    ForcesContract force;
    CountryParametersContract param;
    TaxesContract tax;
    MissilesContract mis;

    constructor(
        address _resources,
        address _infrastructure,
        address _improvements1,
        address _improvements4,
        address _wonders3,
        address _wonders4,
        address _forces,
        address _parameters,
        address _taxes,
        address _missiles
    ) {
        resources = _resources;
        res = ResourcesContract(_resources);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        improvements4 = _improvements4;
        imp4 = ImprovementsContract4(_improvements4);
        wonders3 = _wonders3;
        won3 = WondersContract3(_wonders3);
        wonders4 = _wonders4;
        won4 = WondersContract4(_wonders4);
        forces = _forces;
        force = ForcesContract(_forces);
        parameters = _parameters;
        param = CountryParametersContract(_parameters);
        taxes = _taxes;
        tax = TaxesContract(_taxes);
        missiles = _missiles;
        mis = MissilesContract(_missiles);
    }

    function updateResourcesContract(address newAddress) public onlyOwner {
        resources = newAddress;
        res = ResourcesContract(newAddress);
    }

    function updateInfrastructureContract(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    function updateImprovementsContract1(address newAddress) public onlyOwner {
        improvements1 = newAddress;
        imp1 = ImprovementsContract1(newAddress);
    }

    function updateWondersContract3(address newAddress) public onlyOwner {
        wonders3 = newAddress;
        won3 = WondersContract3(newAddress);
    }

    function updateWondersContract4(address newAddress) public onlyOwner {
        wonders4 = newAddress;
        won4 = WondersContract4(newAddress);
    }

    function updateForcesContract(address newAddress) public onlyOwner {
        forces = newAddress;
        force = ForcesContract(newAddress);
    }

    function updateParametersContract(address newAddress) public onlyOwner {
        parameters = newAddress;
        param = CountryParametersContract(newAddress);
    }

    function updateTaxesContract(address newAddress) public onlyOwner {
        taxes = newAddress;
        tax = TaxesContract(newAddress);
    }

    function getEnvironmentScore(uint256 id) public view returns (uint256) {
        uint256 environmentScore;
        int256 grossScore = getGrossEnvironmentScore(id);
        if (grossScore <= 0) {
            environmentScore = 0;
        } else if (grossScore <= 10) {
            environmentScore = 1;
        } else if (grossScore <= 20) {
            environmentScore = 2;
        } else if (grossScore <= 30) {
            environmentScore = 3;
        } else if (grossScore <= 40) {
            environmentScore = 4;
        } else if (grossScore <= 50) {
            environmentScore = 5;
        } else if (grossScore <= 60) {
            environmentScore = 6;
        } else if (grossScore <= 70) {
            environmentScore = 7;
        } else if (grossScore <= 80) {
            environmentScore = 8;
        } else if (grossScore <= 90) {
            environmentScore = 9;
        } else if (grossScore > 90) {
            environmentScore = 10;
        }
        return environmentScore;
    }

    function getGrossEnvironmentScore(uint256 id) public view returns (int256) {
        int256 scoreFromResources = getEnvironmentScoreFromResources(id);
        int256 scoreFromImprovementsAndWonders = getEnvironmentScoreFromImprovementsAndWonders(
                id
            );
        int256 scoreFromTech = getEnvironmentScoreFromTech(id);
        int256 scoreFromMilitaryRatio = getEnvironmentScoreFromMilitaryDensity(
            id
        );
        int256 scoreFromInfrastructure = getEnvironmentScoreFromInfrastructure(
            id
        );
        int256 scoreFromNukes = getScoreFromNukes(id);
        int256 scoreFromGovernment = getScoreFromGovernment(id);
        int256 grossEnvironmentScore = scoreFromResources +
            scoreFromImprovementsAndWonders +
            scoreFromTech +
            scoreFromMilitaryRatio +
            scoreFromInfrastructure +
            scoreFromNukes +
            scoreFromGovernment;
        return grossEnvironmentScore;
    }

    function getEnvironmentScoreFromResources(uint256 id)
        internal
        view
        returns (int256)
    {
        int256 pointsFromResources;
        bool isCoal = res.viewCoal(id);
        bool isOil = res.viewOil(id);
        bool isUranium = res.viewUranium(id);
        bool isWater = res.viewWater(id);
        bool isRadiationCleanup = res.viewRadiationCleanup(id);
        if (isCoal) {
            pointsFromResources -= 10;
        }
        if (isOil) {
            pointsFromResources -= 10;
        }
        if (isUranium) {
            pointsFromResources -= 10;
        }
        if (isWater) {
            pointsFromResources += 10;
        }
        if (isRadiationCleanup) {
            pointsFromResources += 10;
        }
        return pointsFromResources;
    }

    function getEnvironmentScoreFromImprovementsAndWonders(uint256 id)
        public
        view
        returns (int256)
    {
        uint256 borderWallCount = imp1.getBorderWallCount(id);
        uint256 munitionsFactories = imp4.getMunitionsFactoryCount(id);
        bool isNationalEnvironmentOffice = won3.getNationalEnvironmentOffice(
            id
        );
        bool isWeaponsResearchCenter = won4.getWeaponsResearchCenter(id);
        int256 pointsFromWondersAndImprovements;
        if (borderWallCount == 0) {
            pointsFromWondersAndImprovements += 0;
        } else if (borderWallCount == 1) {
            pointsFromWondersAndImprovements += 10;
        } else if (borderWallCount == 2) {
            pointsFromWondersAndImprovements += 20;
        } else if (borderWallCount == 3) {
            pointsFromWondersAndImprovements += 30;
        } else if (borderWallCount == 4) {
            pointsFromWondersAndImprovements += 40;
        } else if (borderWallCount == 5) {
            pointsFromWondersAndImprovements += 50;
        }
        if (munitionsFactories == 0) {
            pointsFromWondersAndImprovements += 0;
        } else if (munitionsFactories == 1) {
            pointsFromWondersAndImprovements += 3;
        } else if (munitionsFactories == 2) {
            pointsFromWondersAndImprovements += 6;
        } else if (munitionsFactories == 3) {
            pointsFromWondersAndImprovements += 9;
        } else if (munitionsFactories == 4) {
            pointsFromWondersAndImprovements += 12;
        } else if (munitionsFactories == 5) {
            pointsFromWondersAndImprovements += 15;
        }
        if (isNationalEnvironmentOffice) {
            pointsFromWondersAndImprovements += 10;
        }
        if (isWeaponsResearchCenter) {
            pointsFromWondersAndImprovements -= 10;
        }
        return pointsFromWondersAndImprovements;
    }

    function getEnvironmentScoreFromTech(uint256 id)
        internal
        view
        returns (int256)
    {
        uint256 techCount = inf.getTechnologyCount(id);
        int256 pointsFromTech;
        if (techCount >= 6) {
            pointsFromTech = 10;
        }
        return pointsFromTech;
    }

    function getEnvironmentScoreFromMilitaryDensity(uint256 id)
        internal
        view
        returns (int256)
    {
        int256 pointsFromMilitaryRatiio;
        (, bool environmentPenalty) = tax.soldierToPopulationRatio(id);
        if (environmentPenalty == false) {
            pointsFromMilitaryRatiio += 10;
        }
        return pointsFromMilitaryRatiio;
    }

    function getEnvironmentScoreFromInfrastructure(uint256 id)
        internal
        view
        returns (int256)
    {
        int256 pointsFromInfrastructure;
        uint256 land = inf.getLandCount(id);
        uint256 infra = inf.getInfrastructureCount(id);
        if ((infra / 2) <= land) {
            pointsFromInfrastructure += 10;
        }
        return pointsFromInfrastructure;
    }

    function getScoreFromNukes(uint256 id) internal view returns (int256) {
        int256 pointsFromNukes;
        uint256 nukeCount = mis.getNukeCount(id);
        if (nukeCount > 0) {
            pointsFromNukes -= (int256(nukeCount));
        }
        bool isLead = res.viewLead(id);
        if (isLead) {
            pointsFromNukes = (pointsFromNukes / 2);
        }
        return pointsFromNukes;
    }

    function getScoreFromGovernment(uint256 id) internal view returns (int256) {
        int256 pointsFromGovernmentType;
        uint256 governmentType = param.getGovernmentType(id);
        if (
            governmentType == 0 ||
            governmentType == 2 ||
            governmentType == 4 ||
            governmentType == 10
        ) {
            pointsFromGovernmentType -= 10;
        }
        return pointsFromGovernmentType;
    }
    //lead (nuke penatly)
    //wonders (national env office +1)
    //wonders (weapons research complex -1)
    //border walls +1
    //tech (> 6)
    //military (soldiers <60% of populaiton) (-1)
    //land (>50% infrastructure) -1 (or +1 over)
    //government type (communist, dictatorship, transitional or anarchy)  -1
    //nukes -0.10 env per nuke
    //government positions
}
