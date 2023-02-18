//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "./CountryMinter.sol";
import "./Resources.sol";
import "./Infrastructure.sol";
import "./Improvements.sol";
import "./Wonders.sol";
import "./Forces.sol";
import "./Taxes.sol";
import "./Nuke.sol";
import "./CountryParameters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title EnvironmentContract
///@author OxSnosh
///@notice this contract will calculate the environment score for a nation
///@dev this contact inherits from OpenZeppelin ownable 
contract EnvironmentContract is Ownable {
    address public countryMinter;
    address public resources;
    address public infrastructure;
    address public improvements1;
    address public improvements3;
    address public improvements4;
    address public wonders3;
    address public wonders4;
    address public forces;
    address public parameters;
    address public taxes;
    address public missiles;
    address public nukes;
    address public bonusResources;

    CountryMinter mint;
    ResourcesContract res;
    InfrastructureContract inf;
    ImprovementsContract1 imp1;
    ImprovementsContract3 imp3;
    ImprovementsContract4 imp4;
    WondersContract3 won3;
    WondersContract4 won4;
    ForcesContract force;
    CountryParametersContract param;
    TaxesContract tax;
    MissilesContract mis;
    NukeContract nuke;
    BonusResourcesContract bonus;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers 
    function settings (
        address _countryMinter,
        address _resources,
        address _infrastructure,
        address _wonders3,
        address _wonders4,
        address _forces,
        address _parameters,
        address _taxes,
        address _missiles,
        address _nukes
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        resources = _resources;
        res = ResourcesContract(_resources);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
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
        nukes = _nukes;
        nuke = NukeContract(_nukes);
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings2 (
        address _improvements1,
        address _improvements3,
        address _improvements4,
        address _bonusResources
    ) public onlyOwner {
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        improvements3 = _improvements3;
        imp3 = ImprovementsContract3(_improvements3);
        improvements4 = _improvements4;
        imp4 = ImprovementsContract4(_improvements4);
        bonusResources = _bonusResources;
        bonus = BonusResourcesContract(_bonusResources);
    }

    ///@dev this function is only callable by the contract owner
    function updateCountryMinter(address newAddress) public onlyOwner {
        countryMinter = newAddress;
        mint = CountryMinter(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateResourcesContract(address newAddress) public onlyOwner {
        resources = newAddress;
        res = ResourcesContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateInfrastructureContract(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateWondersContract3(address newAddress) public onlyOwner {
        wonders3 = newAddress;
        won3 = WondersContract3(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateWondersContract4(address newAddress) public onlyOwner {
        wonders4 = newAddress;
        won4 = WondersContract4(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateForcesContract(address newAddress) public onlyOwner {
        forces = newAddress;
        force = ForcesContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateParametersContract(address newAddress) public onlyOwner {
        parameters = newAddress;
        param = CountryParametersContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateTaxesContract(address newAddress) public onlyOwner {
        taxes = newAddress;
        tax = TaxesContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateMissilesContract(address newAddress) public onlyOwner {
        missiles = newAddress;
        mis = MissilesContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateNukeContract(address newAddress) public onlyOwner {
        nukes = newAddress;
        nuke = NukeContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateImprovementsContract1(address newAddress) public onlyOwner {
        improvements1 = newAddress;
        imp1 = ImprovementsContract1(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateImprovementsContract3(address newAddress) public onlyOwner {
        improvements3 = newAddress;
        imp3 = ImprovementsContract3(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateImprovementsContract4(address newAddress) public onlyOwner {
        improvements4 = newAddress;
        imp4 = ImprovementsContract4(newAddress);
    }

    ///@dev this is a public view function that will return the environment score for a nation
    ///@notice a higher environment score will decrease a nations happiness and population
    ///@param id is the nation ID of the nation being queried
    ///@return uint256 is the environement score for the nation (environment scores are 0 - 10)
    function getEnvironmentScore(uint256 id) public view returns (uint256) {
        uint256 environmentScore;
        int256 grossScore = getGrossEnvironmentScore(id);
        uint256 globalRadiation = nuke.getGlobalRadiation();
        if (globalRadiation > 5) {
            globalRadiation = 5;
        }
        uint256 radiationContainmentChambers = imp3
            .getRadiationContainmentChamberCount(id);
        if (radiationContainmentChambers >= 0) {
            globalRadiation -= radiationContainmentChambers;
        }
        bool radiationCleanup = bonus.viewRadiationCleanup(id);
        if (radiationCleanup) {
            globalRadiation = (globalRadiation / 2);
        }
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
        if ((globalRadiation + environmentScore) > 10) {
            environmentScore = 10;
        } else {
            environmentScore += globalRadiation;
        }
        return environmentScore;
    }

    ///@dev this is a public view function that will generate the gross environment score
    ///@notice the gross environment score generated here will be converted into the environment score
    ///@notice every 10 points of gross score is equal to one point of environement
    ///@param id this is the nation ID being queried
    ///@return int256 this is the gross environment score
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

    ///@dev this is a public view function that will generate environment points from resources
    ///@notice coal, oil, iron, uranium, water and radiation cleanup resources will all affect environemnt
    ///@param id is the nation ID of the nation being queried
    ///@return int256 is gross environment points from resources
    function getEnvironmentScoreFromResources(uint256 id)
        public
        view
        returns (int256)
    {
        int256 pointsFromResources;
        bool isCoal = res.viewCoal(id);
        bool isOil = res.viewOil(id);
        bool isUranium = res.viewUranium(id);
        bool isWater = res.viewWater(id);
        bool isRadiationCleanup = bonus.viewRadiationCleanup(id);
        bool nationalEnvironmentalOffice = won3.getNationalEnvironmentOffice(id);
        if (isCoal && !nationalEnvironmentalOffice) {
            pointsFromResources += 10;
        }
        if (isOil && !nationalEnvironmentalOffice) {
            pointsFromResources += 10;
        }
        if (isUranium && !nationalEnvironmentalOffice) {
            pointsFromResources += 10;
        }
        if (isWater) {
            pointsFromResources -= 10;
        }
        if (isRadiationCleanup) {
            pointsFromResources -= 10;
        }
        return pointsFromResources;
    }

    ///@dev this is a public view function that will generate gross environment score from improvements and wonders
    ///@notice this function will return gross environment points from improvements and wonders
    ///@notice border walls, munitions factories and red light districts affect a nations environment score
    ///@param id this is the nation ID of the nation being queried
    ///@return int256 is the gross environment points from improvements and wonders
    function getEnvironmentScoreFromImprovementsAndWonders(uint256 id)
        public
        view
        returns (int256)
    {
        uint256 borderWallCount = imp1.getBorderWallCount(id);
        uint256 munitionsFactories = imp4.getMunitionsFactoryCount(id);
        uint256 redLightDistricts = imp3.getRedLightDistrictCount(id);
        bool isNationalEnvironmentOffice = won3.getNationalEnvironmentOffice(
            id
        );
        bool isWeaponsResearchCenter = won4.getWeaponsResearchCenter(id);
        int256 pointsFromWondersAndImprovements;
        if (borderWallCount == 0) {
            pointsFromWondersAndImprovements += 0;
        } else if (borderWallCount == 1) {
            pointsFromWondersAndImprovements -= 10;
        } else if (borderWallCount == 2) {
            pointsFromWondersAndImprovements -= 20;
        } else if (borderWallCount == 3) {
            pointsFromWondersAndImprovements -= 30;
        } else if (borderWallCount == 4) {
            pointsFromWondersAndImprovements -= 40;
        } else if (borderWallCount == 5) {
            pointsFromWondersAndImprovements -= 50;
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
        if (redLightDistricts == 0) {
            pointsFromWondersAndImprovements += 0;
        } else if (redLightDistricts == 1) {
            pointsFromWondersAndImprovements += 5;
        } else if (redLightDistricts == 2) {
            pointsFromWondersAndImprovements += 10;
        }
        if (isNationalEnvironmentOffice) {
            pointsFromWondersAndImprovements -= 10;
        }
        if (isWeaponsResearchCenter) {
            pointsFromWondersAndImprovements += 10;
        }
        return pointsFromWondersAndImprovements;
    }

    ///@dev this is a public view function that will generate gross environment score from a nations technology level
    ///@notice this function will return gross environment points from a nations technology level
    ///@notice a nations environment score will be penalized if the tech level is less than 6
    ///@param id this is the nation ID of the nation being queried
    ///@return int256 is the gross environment points from a nations technology level
    function getEnvironmentScoreFromTech(uint256 id)
        public
        view
        returns (int256)
    {
        uint256 techCount = inf.getTechnologyCount(id);
        int256 pointsFromTech;
        if (techCount <= 6) {
            pointsFromTech = 10;
        }
        return pointsFromTech;
    }

    ///@dev this is a public view function that will generate gross environment score from a nations soldier to population ratio
    ///@notice this function will return gross environment points from a nations soldier to population ratio
    ///@notice a soldier to population ratio greater than 60% will result in an environmental penalty
    ///@param id this is the nation ID of the nation being queried
    ///@return int256 is the gross environment points from a nations soldier to population ratio   
    function getEnvironmentScoreFromMilitaryDensity(uint256 id)
        public
        view
        returns (int256)
    {
        int256 pointsFromMilitaryRatiio;
        (, bool environmentPenalty) = tax.soldierToPopulationRatio(id);
        if (environmentPenalty) {
            pointsFromMilitaryRatiio += 10;
        }
        return pointsFromMilitaryRatiio;
    }

    ///@dev this is a public view function that will generate gross environment score from a nations infrastructure to land ratio
    ///@notice this function will return gross environment points from a nations infrastructure to land ratio
    ///@notice a infrastructure to land ratio greater than 2:1 will result in an environmental penalty
    ///@param id this is the nation ID of the nation being queried
    ///@return int256 is the gross environment points from a nations infrastructure to land ratio  
    function getEnvironmentScoreFromInfrastructure(uint256 id)
        public
        view
        returns (int256)
    {
        int256 pointsFromInfrastructure;
        uint256 land = inf.getLandCount(id);
        uint256 infra = inf.getInfrastructureCount(id);
        if ((infra / 2) >= land) {
            pointsFromInfrastructure += 10;
        }
        return pointsFromInfrastructure;
    }

    ///@dev this is a public view function that will generate gross environment score from a nations nuke count
    ///@notice this function will return gross environment points from a nations nuke count
    ///@notice a nations environment score will go up 1 point every ten nukes owned
    ///@param id this is the nation ID of the nation being queried
    ///@return int256 is the gross environment points from a nations nuke count
    function getScoreFromNukes(uint256 id) public view returns (int256) {
        int256 pointsFromNukes;
        uint256 nukeCount = mis.getNukeCount(id);
        if (nukeCount > 0) {
            pointsFromNukes = (int256(nukeCount / 10));
        }
        bool isLead = res.viewLead(id);
        if (isLead) {
            pointsFromNukes = (pointsFromNukes / 2);
        }
        return pointsFromNukes;
    }

    ///@dev this is a public view function that will generate gross environment score from a nations government type
    ///@notice this function will return gross environment points from a nations government type
    ///@notice a nations environment score will go up 10 points for anarchy, communist, dictatorship, and transitional gov types
    ///@notice a nations environment score will go down 10 points for capitalist, democracy, and republic gov types
    ///@param id this is the nation ID of the nation being queried
    ///@return int256 is the gross environment points from a nations government
    function getScoreFromGovernment(uint256 id) public view returns (int256) {
        int256 pointsFromGovernmentType = 0;
        uint256 governmentType = param.getGovernmentType(id);
        if (
            //anarchy
            governmentType == 0 ||
            //communist            
            governmentType == 2 ||
            //dictatorship
            governmentType == 4 ||
            //transitional
            governmentType == 10
        ) {
            pointsFromGovernmentType += 10;
        } else if (
            //capitalist
            governmentType == 1 ||
            //democracy            
            governmentType == 3 ||
            //republic
            governmentType == 7
        ) {
            pointsFromGovernmentType -= 10;
        }
        return pointsFromGovernmentType;
    }
}
