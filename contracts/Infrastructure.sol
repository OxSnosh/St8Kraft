//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "./CountryMinter.sol";
import "./Resources.sol";
import "./Improvements.sol";
import "./Wonders.sol";
import "./Treasury.sol";
import "./Forces.sol";
import "./Wonders.sol";
import "./CountryParameters.sol";
import "./Crime.sol";
import "./Forces.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

///@title InfrastructureContract
///@author OxSnosh
///@notice this contract will store a nations land, technology, infrastructure and tax rate
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
    address public crime;
    address public bonusResources;

    CountryMinter mint;
    ResourcesContract res;
    ImprovementsContract1 imp1;
    ImprovementsContract2 imp2;
    ImprovementsContract3 imp3;
    ImprovementsContract4 imp4;
    WondersContract1 won1;
    WondersContract3 won3;
    WondersContract4 won4;
    CrimeContract crim;
    ForcesContract forc;
    BonusResourcesContract bonus;
    CountryParametersContract param;

    struct Infrastructure {
        uint256 landArea;
        uint256 technologyCount;
        uint256 infrastructureCount;
        uint256 taxRate;
        bool collectionNeededToChangeRate;
    }

    event InfrastructureDamageFromAirAssault(
        uint256 indexed countryId,
        uint256 indexed amount
    );

    event TechDestroyedFromCruiseMissile(
        uint256 indexed countryId,
        uint256 indexed amount  
    );

    event InfrastructureDestroyedFromCruiseMissile(
        uint256 indexed countryId,
        uint256 indexed amount
    );

    event LandDestroyedFromNukeAttack(
        uint256 indexed countryId,
        uint256 indexed amount
    );

    event InfrastructureDestroyedFromNukeAttack(
        uint256 indexed countryId,
        uint256 indexed amount
    );

    event TechDestroyedFromNukeAttack(
        uint256 indexed countryId,
        uint256 indexed amount
    );

    mapping(uint256 => Infrastructure) public idToInfrastructure;
    mapping(uint256 => address) public idToOwnerInfrastructure;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings1(
        address _resources,
        address _improvements1,
        address _improvements2,
        address _improvements3,
        address _improvements4,
        address _infrastructureMarket,
        address _techMarket,
        address _landMarket,
        address _bonusResources
    ) public onlyOwner {
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
        bonusResources = _bonusResources;
        bonus = BonusResourcesContract(_bonusResources);
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings2(
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
        forc = ForcesContract(_forces);
        aid = _aid;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings3(
        address _spyAddress,
        address _tax,
        address _cruiseMissile,
        address _nukeAddress,
        address _airBattle,
        address _groundBattle,
        address _countryMinter,
        address _crime,
        address _parameters
    ) public onlyOwner {
        spyAddress = _spyAddress;
        taxes = _tax;
        cruiseMissile = _cruiseMissile;
        nukeAddress = _nukeAddress;
        airBattle = _airBattle;
        groundBattle = _groundBattle;
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        crime = _crime;
        crim = CrimeContract(_crime);
        parameters = _parameters;
        param = CountryParametersContract(_parameters);
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

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "function only callable from countryMinter contract"
        );
        _;
    }

    ///@dev this function is only callable by the countryMinter contract
    ///@dev this function will initialize the struct to store the info about the minted nations infrastructure
    ///@notice this function allows this contract to store info about a nations infrastructure
    ///@param id this is the nation ID for the nation being minted
    function generateInfrastructure(uint256 id) public onlyCountryMinter {
        Infrastructure memory newInfrastrusture = Infrastructure(
            20,
            0,
            20,
            16,
            false
        );
        idToInfrastructure[id] = newInfrastrusture;
    }

    ///@dev this function is only callable from the infrastructure market contract
    ///@dev this function will increase a nations infrastructure when purchased in the market contract
    ///@notice this function will increase a nations infrastructure when purchased in the market contract
    ///@param id is the nation purchasing infrastructure
    ///@param amount is the amount of infrastructure being purchased
    function increaseInfrastructureFromMarket(
        uint256 id,
        uint256 amount
    ) public onlyInfrastructureMarket {
        idToInfrastructure[id].infrastructureCount += amount;
    }

    ///@dev this is a public function only callable from the infrastructure market contract
    ///@dev this function will allow a nation owner to sell infrastructure
    ///@notice this function will allow a nation owner to sell infrastructure
    ///@param id this is the nation id of the nation selling infrastructure
    ///@param amount this is the amount of infrastructure being sold
    function decreaseInfrastructureFromMarket(
        uint256 id,
        uint256 amount
    ) public onlyInfrastructureMarket {
        idToInfrastructure[id].infrastructureCount -= amount;
    }

    ///@dev this is a public function only callable from the technology market contract
    ///@dev this function will increase the technology count when technology is purchased
    ///@notice this function will increase technology when technology is purchased
    ///@param id this is the nation id of the nation purchasing technology
    ///@param amount this is the amount of technology being purchased
    function increaseTechnologyFromMarket(
        uint256 id,
        uint256 amount
    ) public onlyTechMarket {
        idToInfrastructure[id].technologyCount += amount;
    }

    ///@dev this is a public function only callable from the technology market contract
    ///@dev this function will allow a nation owner to sell technology
    ///@notice this function will allow a nation owner to sell technology
    ///@param id this is the nation id of the nation selling technology
    ///@param amount this is the amount of technology being sold
    function decreaseTechnologyFromMarket(
        uint256 id,
        uint256 amount
    ) public onlyTechMarket {
        idToInfrastructure[id].technologyCount -= amount;
    }

    ///@dev this is a public function only callable from the land market contract
    ///@dev this function will increase the land area count when land is purchased
    ///@notice this function will increase land area when land is purchased
    ///@param id this is the nation id of the nation purchasing land
    ///@param amount this is the amount of land being purchased
    function increaseLandCountFromMarket(
        uint256 id,
        uint256 amount
    ) public onlyLandMarket {
        idToInfrastructure[id].landArea += amount;
    }

    ///@dev this is a public function only callable from the land market contract
    ///@dev this function will allow a nation owner to sell land
    ///@notice this function will allow a nation owner to sell land
    ///@param id this is the nation id of the nation selling land
    ///@param amount this is the amount of land being sold
    function decreaseLandCountFromMarket(
        uint256 id,
        uint256 amount
    ) public onlyLandMarket {
        idToInfrastructure[id].landArea -= amount;
    }

    ///@dev this is a public view function that will return the amount of land a nation has
    ///@notice this function will return the amount of land a nation has
    ///@param countryId this is the nation ID of the country being queried
    ///@return count is the amount of land area for a given country
    function getLandCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        return idToInfrastructure[countryId].landArea;
    }

    ///@dev this is a public view function that will return a nations area of influence from a given land area
    ///@notice this function will return a given nations area of influence as a multiple of their land area
    ///@notice coal will increase area of influence 15%
    ///@notice rubber will increase area of influence 20%
    ///@notice spices will increase area of influence 8%
    ///@notice an agriculture development program will increase area of influence 15%
    ///@param id is the nation id of the nation being queried
    ///@return uint256 is the given nations area of influence
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
        uint256 governmentType = param.getGovernmentType(id);
        if (
            governmentType == 1 ||
            governmentType == 2 ||
            governmentType == 6 ||
            governmentType == 7 ||
            governmentType == 9 ||
            governmentType == 10
        ) {
            landModifier += 5;
        }
        uint256 areaOfInfluence = ((currentLand * landModifier) / 100);
        return areaOfInfluence;
    }

    ///@dev this is a public function only callable from a nation owner
    ///@dev this function will allow a nation owner to sell land
    ///@notice this function will allow a nation owner to sell land
    ///@notice land can be sold for 100/mile (300 with rubber)
    ///@param id is the nation id of the nation selling land
    ///@param amount is the amount of land being sold
    function sellLand(uint256 id, uint256 amount) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
        uint256 currentLand = idToInfrastructure[id].landArea;
        require(amount < (currentLand - 20), "cannot sell land below 20 miles");
        idToInfrastructure[id].landArea -= amount;
        uint256 costPerMile = 100;
        bool rubber = res.viewRubber(id);
        if (rubber) {
            costPerMile = 300;
        }
        uint256 totalCost = (amount * costPerMile);
        TreasuryContract(treasury).returnBalance(id, totalCost);
    }

    ///@dev this is a public function that is only callable from the spy contract
    ///@dev this function will decrease land area after a successful spy attack
    ///@notice this function will deacrease land area after a succesfuls spy attack
    ///@param countryId is the country if of the nation losing land in the attack
    ///@param amount is the amount of land being lost in the attack
    function decreaseLandCountFromSpyContract(
        uint256 countryId,
        uint256 amount
    ) public onlySpyContract {
        idToInfrastructure[countryId].landArea -= amount;
    }

    ///@dev this is a public function that will decrease a nations land when attacked by a nuke
    ///@dev this function is only callable by the nuke contract
    ///@notice this function will decrease the amount of a nations land when attacked by a nuke
    ///@notice the maximum amount of land that can be lost is 150 miles
    ///@param countryId this is the nation ID of the nation being attacked
    ///@param percentage this is the percentage of a nations land being lost
    ///@param attackType is the type of attack being used in the nuke strike (1 = standard, 2 = infrastructure, 3 = land, 4 = technology)
    ///@notice attack type can only be 2, 3 or 4 if the attacking nation has EMP weaponization
    function decreaseLandCountFromNukeContract(
        uint256 countryId,
        uint256 percentage,
        uint256 attackType
    ) public onlyNukeContract {
        uint256 landAmount = idToInfrastructure[countryId].landArea;
        uint256 landAmountToDecrease = ((landAmount * percentage) / 100);
        uint256 maxLandToDecrease = 150;
        if (attackType == 3) {
            maxLandToDecrease = 200;
        }
        if (attackType == 2 || attackType == 4) {
            maxLandToDecrease = 100;
        }
        if (landAmountToDecrease > maxLandToDecrease) {
            idToInfrastructure[countryId].landArea -= maxLandToDecrease;
            landAmountToDecrease = maxLandToDecrease;
        } else {
            idToInfrastructure[countryId].landArea -= landAmountToDecrease;
        }
        emit LandDestroyedFromNukeAttack(countryId, landAmountToDecrease);
    }

    ///@dev this is a public view function that will retrun the amount of technology a nation has
    ///@notice this function will return the amount of technology a nation has
    ///@param countryId this is the nation ID of the nation being queried
    ///@return count is the tech amount for a given nation
    function getTechnologyCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        uint256 technologyAmount = idToInfrastructure[countryId]
            .technologyCount;
        return technologyAmount;
    }

    modifier onlyAidContract() {
        require(msg.sender == aid);
        _;
    }

    ///@dev this is a public function only callable from the aid contract
    ///@dev this function will send the technology when an aid proposal is accepted
    ///@notice this function will send the technology when an aid proposal is accepted
    ///@param idSender is the nation id of the sender of the technology aid
    ///@param idReciever is the nation id of the recipient of technology aid
    ///@param amount is the amount of technology being sent
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

    ///@dev this is a public function only callable from the spy contract
    ///@dev this function will decrease the amount of tech for a nation after a succesful spy attack
    ///@notice this function will decrease a nations tech after a succesful spy attack
    ///@param countryId this is the nation ID of the nation being attacked
    ///@param amount is the amount of technology a nation is losing in the attack
    function decreaseTechCountFromSpyContract(
        uint256 countryId,
        uint256 amount
    ) public onlySpyContract {
        idToInfrastructure[countryId].technologyCount -= amount;
    }

    ///@dev this is a public function only callable from the cruise missile contract
    ///@dev this function will decrease the amount of tech for a nation after a succesful cruise missile attack
    ///@notice this function will decrease a nations tech after a succesful cruise missile attack
    ///@param countryId this is the nation ID of the nation being attacked
    ///@param amount is the amount of technology a nation is losing in the attack
    function decreaseTechCountFromCruiseMissileContract(
        uint256 countryId,
        uint256 amount
    ) public onlyCruiseMissileContract {
        idToInfrastructure[countryId].technologyCount -= amount;
        emit TechDestroyedFromCruiseMissile(countryId, amount);
    }

    ///@dev this is a public function only callable from the nuke contract
    ///@dev this function will decrease the amount of tech for a nation after a succesful nuke attack
    ///@notice this function will decrease a nations tech after a succesful nuke attack
    ///@notice the maximum amount of tech a nation can lose in an attack is 50
    ///@param countryId this is the nation ID of the nation being attacked
    ///@param percentage is the percentage of a nations technology a nation is losing in the attack
    ///@param attackType is the type of attack being used in the nuke strike (1 = standard, 2 = infrastructure, 3 = land, 4 = technology)
    ///@notice attack type can only be 2, 3 or 4 if the attacking nation has EMP weaponization
    function decreaseTechCountFromNukeContract(
        uint256 countryId,
        uint256 percentage,
        uint256 attackType
    ) public onlyNukeContract {
        uint256 techAmount = idToInfrastructure[countryId].technologyCount;
        uint256 techAmountToDecrease = ((techAmount * percentage) / 100);
        uint256 maxTechToDecrease = 50;
        if (attackType == 4) {
            maxTechToDecrease = 70;
        }
        if (attackType == 2 || attackType == 3) {
            maxTechToDecrease = 30;
        }
        if (techAmountToDecrease > maxTechToDecrease) {
            idToInfrastructure[countryId].technologyCount -= maxTechToDecrease;
            techAmountToDecrease = maxTechToDecrease;
        } else {
            idToInfrastructure[countryId]
                .technologyCount -= techAmountToDecrease;
        }
        emit TechDestroyedFromNukeAttack(countryId, techAmountToDecrease);
    }

    ///@dev this is a public view function that will return the amount of infrastructure for a nation
    ///@notice this function will return a nations infrastructure count
    ///@param countryId is the nation ID of the country being queried
    ///@return count is the amount of technology for a given nation
    function getInfrastructureCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        uint256 infrastructureAmount = idToInfrastructure[countryId]
            .infrastructureCount;
        return infrastructureAmount;
    }

    ///@dev this is a public function only callable from the spy contract
    ///@dev this function will decrease a nations infrastructure amount after a succesful spy attack
    ///@notice this function will decrease a nations infrastrucure after a succesful spy attack
    ///@param countryId this is the nationId of the nation losing infrastructure
    ///@param amount this is the amount of infrastructure being lost
    function decreaseInfrastructureCountFromSpyContract(
        uint256 countryId,
        uint256 amount
    ) public onlySpyContract {
        idToInfrastructure[countryId].infrastructureCount -= amount;
    }

    ///@dev this is a public view function that is only callable from the cruise missile contract
    ///@dev this function will decrease the amount of technology lost in a cruise missile attack
    ///@notice this function will decrease the amount of technology lost in a cruise missile attack
    ///@param countryId this is the nation id of the country being queried
    ///@param amountToDecrease this is the amount of infrastructure being decreased
    function decreaseInfrastructureCountFromCruiseMissileContract(
        uint256 countryId,
        uint256 amountToDecrease
    ) public onlyCruiseMissileContract {
        uint256 infrastructureAmount = idToInfrastructure[countryId]
            .infrastructureCount;
        uint256 damagePercentage = 100;
        uint256 bunkerCount = imp1.getBunkerCount(countryId);
        if (bunkerCount > 0) {
            damagePercentage -= (bunkerCount * 3);
        }
        amountToDecrease = ((amountToDecrease * damagePercentage) / 100);
        if (amountToDecrease >= infrastructureAmount) {
            idToInfrastructure[countryId].infrastructureCount = 0;
            amountToDecrease = infrastructureAmount;
        } else {
            idToInfrastructure[countryId]
                .infrastructureCount -= amountToDecrease;
        }
        emit TechDestroyedFromCruiseMissile(countryId, amountToDecrease);
    }

    ///@dev this is a public function only callable from the nuke contract
    ///@dev this function will decrease the amount of a nations infrastructure after a nuke attack
    ///@notice this function will decrease the amount of a nations infrastructure after a nuke attack
    ///@notice the maximum amount of infrastructure a nation can lose in a nuke strike is 150
    ///@notice defender bunkers will decrease the amount of damage in a succesful nuke attack
    ///@notice attacker munitions factories will increase the amount of damage of a succesful nuke attack
    ///@param defenderId is the defending nation in a nuke strike
    ///@param attackerId is an attacking nation in a nuke strike
    ///@param percentage is the percentage of infrastructure being lost before modifiers (defender bunkers and attacker munitions factories)
    ///@param attackType is the type of attack being used in the nuke strike (1 = standard, 2 = infrastructure, 3 = land, 4 = technology)
    ///@notice attack type can only be 2, 3 or 4 if the attacking nation has EMP weaponization
    function decreaseInfrastructureCountFromNukeContract(
        uint256 defenderId,
        uint256 attackerId,
        uint256 percentage,
        uint256 attackType
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
        uint256 maxInfrastructureToDecrease = 150;
        if (attackType == 2) {
            maxInfrastructureToDecrease = 200;
        }
        if (attackType == 3 || attackType == 4) {
            maxInfrastructureToDecrease = 100;
        }
        if (infrastructureAmountToDecrease > maxInfrastructureToDecrease) {
            idToInfrastructure[defenderId]
                .infrastructureCount -= maxInfrastructureToDecrease;
            infrastructureAmountToDecrease = maxInfrastructureToDecrease;
        } else {
            idToInfrastructure[defenderId]
                .infrastructureCount -= infrastructureAmountToDecrease;
        }
        emit InfrastructureDestroyedFromNukeAttack(
            defenderId,
            infrastructureAmountToDecrease
        );
    }

    ///@dev this is a public function only callable from the air battle contract
    ///@dev this function will decrease a nations infrastructure lost in a bombing attack
    ///@notice this function will decrease a nations infrastructure lost in a bombing attack (max 20 levels)
    ///@param countryId is the nation id of the country losing infrastructure
    ///@param amountToDecrease is the amount of infrastructure being lost
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
        if (damage >= 20) {
            damage = 20;
        }
        if (damage >= infrastructureAmount) {
            idToInfrastructure[countryId].infrastructureCount = 0;
            damage = infrastructureAmount;
        } else {
            idToInfrastructure[countryId].infrastructureCount -= damage;
        }
        emit InfrastructureDamageFromAirAssault(countryId, damage);
    }

    ///@dev this is a public function only callable from the ground battle contract
    ///@notice this function will transfer land and infrastructure lost during a ground battle
    ///@param landMiles is the amount of land being won
    ///@param infrastructureLevels is the amount of infrastructure being won
    ///@param attackerId is the ID of the attack nation
    ///@param defenderId is the ID of the defending nation
    function transferLandAndInfrastructure(
        uint256 landMiles,
        uint256 infrastructureLevels,
        uint256 attackerId,
        uint256 defenderId
    ) public onlyGroundBattle {
        uint256 defenderLand = idToInfrastructure[defenderId].landArea;
        uint256 defenderInfrastructure = idToInfrastructure[defenderId]
            .infrastructureCount;
        console.log("defender land", defenderLand);
        console.log("defender infrastructure", defenderInfrastructure);
        console.log("land miles", landMiles);
        console.log("infrastructure levels", infrastructureLevels);
        if (defenderLand <= landMiles) {
            idToInfrastructure[attackerId].landArea += defenderLand;
            landMiles = defenderLand;
            idToInfrastructure[defenderId].landArea = 0;
        } else {
            idToInfrastructure[attackerId].landArea += landMiles;
            idToInfrastructure[defenderId].landArea -= landMiles;
            console.log("this land exchange happened");
        }
        if (defenderInfrastructure <= infrastructureLevels) {
            idToInfrastructure[attackerId]
                .infrastructureCount += defenderInfrastructure;
            infrastructureLevels = defenderInfrastructure;
            idToInfrastructure[defenderId].infrastructureCount = 0;
        } else {
            idToInfrastructure[attackerId]
                .infrastructureCount += infrastructureLevels;
            idToInfrastructure[defenderId]
                .infrastructureCount -= infrastructureLevels;
            console.log("this infrastructure exchange happened");
        }
    }

    ///@dev this is public view function that will return a nations total population count
    ///@notice this function will return a nation population count
    ///@notice a nations base populaton is a nation infrastructure count * 8
    ///@notice a nations population is increased by cattle, fish, pigs, sugar, wheat, affluent population and decreased by border walls
    ///@return uint256 is a nations total population
    function getTotalPopulationCount(uint256 id) public view returns (uint256) {
        uint256 infra = getInfrastructureCount(id);
        uint256 populationBaseCount = (infra * 8);
        bool agricultureDevelopment = won1.getAgriculturalDevelopmentProgram(
            id
        );
        if (agricultureDevelopment) {
            populationBaseCount = (infra * 9);
        }
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
        bool affluentPopulation = bonus.viewAffluentPopulation(id);
        if (affluentPopulation) {
            populationModifier += 5;
        }
        uint256 borderWalls = imp1.getBorderWallCount(id);
        if (borderWalls > 0) {
            populationModifier -= (2 * borderWalls);
        }
        uint256 additionalModifierPoints = getAdditionalPopulationModifierPoints(
                id
            );
        populationModifier += additionalModifierPoints;
        uint256 population = ((populationBaseCount * populationModifier) / 100);
        return population;
    }

    ///@dev this is an internal view function that will be called by the above function
    ///@dev this function will return additonal population percentage modifiers for the above function
    ///@notice this function will return additonal population percentage modifiers for the above function
    ///@notice a nations population is increased by clinics, hospitals, disaster relief agencies, national environmental office, national research lab and universal healthcare
    ///@return uint256 is the additional percentage modifiers for the above function
    function getAdditionalPopulationModifierPoints(
        uint256 id
    ) internal view returns (uint256) {
        uint256 additionalPoints;
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

    ///@dev this is public view function that will return a nations taxable population
    ///@notice this function will return a nations taxable population
    ///@notice a nations total population consists of citizens, soldiers and criminals
    ///@notice only citizens pay taxes
    ///@param id is the nation id of the nation being queried
    ///@return uint256 this is the given nations total taxable population
    function getTaxablePopulationCount(
        uint256 id
    ) public view returns (uint256, uint256) {
        uint256 totalPop = getTotalPopulationCount(id);
        (uint256 criminals, , ) = crim
            .getCriminalCount(id);
        uint256 soldiers = forc.getSoldierCount(id);
        uint256 citizens;
        uint256 citizenDefecit;
        if ((totalPop) <= (criminals + soldiers)) {
            citizens = 0;
            citizenDefecit = ((criminals + soldiers) - (totalPop));
        } else {
            citizens = ((totalPop) - (criminals + soldiers));
            citizenDefecit = 0;
        }
        return (citizens, citizenDefecit);
    }

    ///@dev this is a public view function that will return a nations tax rate at which they tax their citizens
    ///@notice this function will return the tax rate which a nation taxes their citizens at
    ///@param id is the nation ID of the nation being queried
    ///@return taxPercentage is the tax rate for a given nation
    function getTaxRate(
        uint256 id
    ) public view returns (uint256 taxPercentage) {
        uint256 taxRate = idToInfrastructure[id].taxRate;
        return taxRate;
    }

    ///@dev this is a public function only vallable by a nation owner
    ///@dev this function will allow a nation owner to set their nations tax rate
    ///@notice this function will allow a nation owner to set their nations tax rate
    ///@notice a tax rate can be between 15% and 28%
    ///@notice a tax rate can be 30% with a social security wonder
    ///@param id is the nation id of the nation changing its tax rate
    ///@param newTaxRate is the new tax rate for a nation
    function setTaxRate(uint256 id, uint256 newTaxRate) public {
        bool owner = mint.checkOwnership(id, msg.sender);
        require(owner, "!nation owner");
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

    ///@dev this is a public function only callable from the spy contract
    ///@dev this function will reset a nations tax rate after a succesful spy attack
    ///@notice this function will reset a nations tax rate after a succesful spy attack
    ///@param id this is the nation ID for the nation being attacked and getting its tax rate changed
    ///@param newTaxRate is the new tax rate for the nation
    function setTaxRateFromSpyContract(
        uint256 id,
        uint256 newTaxRate
    ) public onlySpyContract {
        idToInfrastructure[id].taxRate = newTaxRate;
        idToInfrastructure[id].collectionNeededToChangeRate = true;
    }

    ///@dev this is a public function only callable from the taxes contract
    ///@dev this function will toggle the collection needed to change tax rate to true
    ///@notice this function will toggle the collection needed to change tax rate to true
    ///@notice when a nation is blockaded it will need to either break the blockade or collect taxes at a reduced rate to be able to change tax rate
    ///@param id is the nation ID of the nation toggleing the collection needed parameter
    function toggleCollectionNeededToChangeRate(
        uint256 id
    ) public onlyTaxesContract {
        idToInfrastructure[id].collectionNeededToChangeRate = false;
    }

    ///@dev this is a public view function that will return true if a nation needs to collect taxes in order to change its tax rate
    ///@notice this function will retrun true if a nation needs to collect taxes in order to change its tax rate
    ///@param id is the nation ID of the nation being queried
    ///@return bool is the boolean value whether a nation needs to collect taxes in order to change its tax rate
    function checkIfCollectionNeededToChangeRate(
        uint256 id
    ) public view returns (bool) {
        bool collectionNeeded = idToInfrastructure[id]
            .collectionNeededToChangeRate;
        return collectionNeeded;
    }
}
