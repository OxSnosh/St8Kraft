//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./CountryMinter.sol";
import "./Resources.sol";
import "./Improvements.sol";
import "./Wonders.sol";
import "./Treasury.sol";
import "./Forces.sol";
import "./Wonders.sol";
import "./CountryParameters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InfrastructureContract is Ownable {
    address public countryMinter;
    address public resources;
    address public infrastructureMarket;
    address public techMarket;
    address public landMarket;
    address public improvements1;
    address public improvements2;
    address public improvements3;
    address public improvements4;
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

    CountryMinter mint;
    ResourcesContract res;
    ImprovementsContract1 imp1;
    ImprovementsContract2 imp2;
    ImprovementsContract3 imp3;
    ImprovementsContract4 imp4;
    WondersContract1 won1;
    WondersContract3 won3;
    WondersContract4 won4;

    struct Infrastructure {
        uint256 landArea;
        uint256 technologyCount;
        uint256 infrastructureCount;
        uint256 taxRate;
        bool collectionNeededToChangeRate;
    }

    mapping(uint256 => Infrastructure) public idToInfrastructure;
    mapping(uint256 => address) public idToOwnerInfrastructure;

    constructor(
        address _resources,
        address _improvements1,
        address _improvements2,
        address _improvements3,
        address _improvements4,
        address _infrastructureMarket,
        address _techMarket,
        address _landMarket
    ) {
        resources = _resources;
        res = ResourcesContract(_resources);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        improvements2 = _improvements2;
        imp2 = ImprovementsContract2(_improvements2);
        improvements3 = _improvements3;
        imp3 = ImprovementsContract3(_improvements3);
        improvements4 = _improvements4;
        imp4 = ImprovementsContract4(_improvements4);
        infrastructureMarket = _infrastructureMarket;
        techMarket = _techMarket;
        landMarket = _landMarket;
    }

    function constructorContinued(
        address _wonders1,
        address _wonders2,
        address _wonders3,
        address _wonders4,
        address _treasury,
        address _parameters,
        address _forces,
        address _aid
    ) public onlyOwner {
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        wonders2 = _wonders2;
        wonders3 = _wonders3;
        won3 = WondersContract3(_wonders3);
        wonders4 = _wonders4;
        won4 = WondersContract4(_wonders4);
        treasury = _treasury;
        parameters = _parameters;
        forces = _forces;
        aid = _aid;
    }

    function constructorContinued2(
        address _spyAddress,
        address _tax,
        address _cruiseMissile,
        address _nukeAddress,
        address _airBattle,
        address _groundBattle,
        address _countryMinter
    ) public onlyOwner {
        spyAddress = _spyAddress;
        taxes = _tax;
        cruiseMissile = _cruiseMissile;
        nukeAddress = _nukeAddress;
        airBattle = _airBattle;
        groundBattle = _groundBattle;
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
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

    modifier onlyInfrastructureMarket() {
        require(
            msg.sender == infrastructureMarket,
            "function only callable from infrastructure marketplace"
        );
        _;
    }

    modifier onlyTechMarket() {
        require(
            msg.sender == techMarket,
            "function only callable from infrastructure marketplace"
        );
        _;
    }

    modifier onlyLandMarket() {
        require(
            msg.sender == landMarket,
            "function only callable from infrastructure marketplace"
        );
        _;
    }

    function generateInfrastructure(uint256 id, address nationOwner) public {
        Infrastructure memory newInfrastrusture = Infrastructure(
            20,
            0,
            20,
            16,
            false
        );
        idToInfrastructure[id] = newInfrastrusture;
        idToOwnerInfrastructure[id] = nationOwner;
    }

    function increaseInfrastructureFromMarket(uint256 id, uint256 amount)
        public
        onlyInfrastructureMarket
    {
        idToInfrastructure[id].infrastructureCount += amount;
    }

    function increaseTechnologyFromMarket(uint256 id, uint256 amount)
        public
        onlyTechMarket
    {
        idToInfrastructure[id].technologyCount += amount;
    }

    function increaseLandCountFromMarket(uint256 id, uint256 amount)
        public
        onlyLandMarket
    {
        idToInfrastructure[id].landArea += amount;
    }

    function getAreaOfInfluence(uint256 id) public view returns (uint256) {
        uint256 currentLand = idToInfrastructure[id].landArea;
        uint256 landModifier = 100;
        bool coal = res.viewCoal(id);
        if (coal) {
            landModifier += 15;
        }
        bool rubber = res.viewRubber(id);
        if (rubber) {
            landModifier += 20;
        }
        bool spices = res.viewSpices(id);
        if (spices) {
            landModifier += 8;
        }
        bool agriculturalDevelopmentProgram = won1
            .getAgriculturalDevelopmentProgram(id);
        if (agriculturalDevelopmentProgram) {
            landModifier += 15;
        }
        uint256 areaOfInfluence = ((currentLand * landModifier) / 100);
        return areaOfInfluence;
    }

    function sellLand(uint256 id, uint256 amount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 currentLand = idToInfrastructure[id].landArea;
        require(amount < currentLand, "cannot sell all land");
        idToInfrastructure[id].landArea -= amount;
        uint256 costPerMile = 100;
        bool rubber = res.viewRubber(id);
        if (rubber) {
            costPerMile = 300;
        }
        uint256 totalCost = (amount * costPerMile);
        TreasuryContract(treasury).returnBalance(id, totalCost);
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

    function decreaseLandCountFromNukeContract(uint256 countryId, uint256 percentage)
        public
        onlyNukeContract
    {
        uint256 landAmount = idToInfrastructure[countryId].landArea;
        uint256 landAmountToDecrease = ((landAmount * percentage) / 100);
        if (landAmountToDecrease > 150) {
            idToInfrastructure[countryId].landArea -= 150;
        } else {
            idToInfrastructure[countryId].landArea -= landAmountToDecrease;
        }
    }

    function increaseLandCountFromSpyContract(uint256 countryId, uint256 amount)
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

    function decreaseTechCountFromSpyContract(uint256 countryId, uint256 amount)
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

    function decreaseTechCountFromNukeContract(uint256 countryId, uint256 percentage)
        public
        onlyNukeContract
    {
        uint256 techAmount = idToInfrastructure[countryId].technologyCount;
        uint256 techAmountToDecrease = ((techAmount * percentage) / 100);
        if (techAmountToDecrease > 50) {
            idToInfrastructure[countryId].technologyCount -= 50;
        } else {
            idToInfrastructure[countryId]
                .technologyCount -= techAmountToDecrease;
        }
    }

    function increaseTechCountFromSpyContract(uint256 countryId, uint256 amount)
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

    function decreaseInfrastructureCountFromSpyContract(
        uint256 countryId,
        uint256 amount
    ) public onlySpyContract {
        idToInfrastructure[countryId].infrastructureCount -= amount;
    }

    function decreaseInfrastructureCountFromCruiseMissileContract(
        uint256 countryId,
        uint256 amountToDecrease
    ) public onlyCruiseMissileContract {
        // uint256 infrastructureDamageModifier = 100;
        // uint256 bunkerCount = imp1.getBunkerCount(countryId);
        // if (bunkerCount > 0) {
        //     infrastructureDamageModifier -= (5 * bunkerCount);
        // }
        // uint256 damage = ((amountToDecrease * infrastructureDamageModifier) /
        //     100);
        uint256 infrastructureAmount = idToInfrastructure[countryId]
            .infrastructureCount;
        if (amountToDecrease >= infrastructureAmount) {
            idToInfrastructure[countryId].infrastructureCount = 0;
        } else {
            idToInfrastructure[countryId]
                .infrastructureCount -= amountToDecrease;
        }
    }

    function decreaseInfrastructureCountFromNukeContract(
        uint256 defenderId,
        uint256 attackerId,
        uint256 percentage
    ) public onlyNukeContract {
        uint256 infrastructureAmount = idToInfrastructure[defenderId]
            .infrastructureCount;
        uint256 damagePercentage = percentage;
        uint256 bunkerCount = imp1.getBunkerCount(defenderId);
        if (bunkerCount > 0) {
            damagePercentage -= (bunkerCount * 3);
        }
        uint256 attackerMunitionsFactory = imp4.getMunitionsFactoryCount(
            attackerId
        );
        if (attackerMunitionsFactory > 0) {
            damagePercentage += (attackerMunitionsFactory * 3);
        }
        uint256 infrastructureAmountToDecrease = ((infrastructureAmount *
            damagePercentage) / 100);
        if (infrastructureAmountToDecrease > 150) {
            idToInfrastructure[defenderId].infrastructureCount -= 150;
        } else {
            idToInfrastructure[defenderId]
                .infrastructureCount -= infrastructureAmountToDecrease;
        }
    }

    function decreaseInfrastructureCountFromAirBattleContract(
        uint256 countryId,
        uint256 amountToDecrease
    ) public onlyAirBattle {
        uint256 infrastructureDamageModifier = 100;
        uint256 bunkerCount = imp1.getBunkerCount(countryId);
        if (bunkerCount > 0) {
            infrastructureDamageModifier -= (5 * bunkerCount);
        }
        uint256 damage = ((amountToDecrease * infrastructureDamageModifier) /
            100);
        uint256 infrastructureAmount = idToInfrastructure[countryId]
            .infrastructureCount;
        if (damage >= infrastructureAmount) {
            idToInfrastructure[countryId].infrastructureCount = 0;
        } else {
            idToInfrastructure[countryId].infrastructureCount -= damage;
        }
    }

    function increaseInfrastructureCountFromSpyContract(
        uint256 countryId,
        uint256 amount
    ) public onlySpyContract {
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
        uint256 maximumTaxRate = 28;
        bool socialSecurity = won4.getSocialSecuritySystem(id);
        if (socialSecurity) {
            maximumTaxRate = 30;
        }
        require(newTaxRate <= maximumTaxRate, "cannot tax above maximum rate");
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
        uint256 populationBaseCount = (infra * 8);
        uint256 populationModifier = 100;
        bool cattle = res.viewCattle(id);
        if (cattle) {
            populationModifier += 5;
        }
        bool fish = res.viewFish(id);
        if (fish) {
            populationModifier += 8;
        }
        bool pigs = res.viewPigs(id);
        if (pigs) {
            populationModifier += 4;
        }
        bool sugar = res.viewSugar(id);
        if (sugar) {
            populationModifier += 3;
        }
        bool wheat = res.viewWheat(id);
        if (wheat) {
            populationModifier += 8;
        }
        bool affluentPopulation = res.viewAffluentPopulation(id);
        if (affluentPopulation) {
            populationModifier += 5;
        }
        uint256 additionalModifierPoints = getAdditionalPopulationModifierPoints(
                id
            );
        populationModifier += additionalModifierPoints;
        uint256 population = ((populationBaseCount * populationModifier) / 100);
        return population;
    }

    function getAdditionalPopulationModifierPoints(uint256 id)
        internal
        view
        returns (uint256)
    {
        uint256 additionalPoints;
        uint256 borderWalls = imp1.getBorderWallCount(id);
        if (borderWalls > 0) {
            additionalPoints -= (2 * borderWalls);
        }
        uint256 clinicCount = imp1.getClinicCount(id);
        if (clinicCount > 0) {
            additionalPoints += (2 * clinicCount);
        }
        uint256 hospitals = imp2.getHospitalCount(id);
        if (hospitals > 0) {
            additionalPoints += 6;
        }
        bool disasterReliefAgency = won1.getDisasterReliefAgency(id);
        if (disasterReliefAgency) {
            additionalPoints += 3;
        }
        bool nationalEnvironmentOffice = won3.getNationalEnvironmentOffice(id);
        if (nationalEnvironmentOffice) {
            additionalPoints += 5;
        }
        bool nationalResearchLab = won3.getNationalResearchLab(id);
        if (nationalResearchLab) {
            additionalPoints += 5;
        }
        bool universalHealthcare = won4.getUniversalHealthcare(id);
        if (universalHealthcare) {
            additionalPoints += 3;
        } 
        return additionalPoints;
    }

    function transferLandAndTech(
        uint256 landMiles,
        uint256 techLevels,
        uint256 attackerId,
        uint256 defenderId
    ) public onlyGroundBattle {
        uint256 defenderLand = idToInfrastructure[defenderId].landArea;
        uint256 defenderTech = idToInfrastructure[defenderId].technologyCount;
        if (defenderLand <= landMiles) {
            idToInfrastructure[defenderId].landArea = 0;
            idToInfrastructure[attackerId].landArea += defenderLand;
        } else {
            idToInfrastructure[defenderId].landArea -= landMiles;
            idToInfrastructure[attackerId].landArea += landMiles;
        }
        if (defenderTech <= techLevels) {
            idToInfrastructure[defenderId].technologyCount = 0;
            idToInfrastructure[attackerId].technologyCount += defenderTech;
        } else {
            idToInfrastructure[defenderId].technologyCount = techLevels;
            idToInfrastructure[attackerId].technologyCount += techLevels;
        }
    }
}
