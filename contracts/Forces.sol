//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "./Infrastructure.sol";
import "./Resources.sol";
import "./Wonders.sol";
import "./Improvements.sol";
import "./CountryMinter.sol";
import "./War.sol";
import "./NationStrength.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ForcesContract is Ownable {
    uint256 public tankCost;
    uint256 public cruiseMissileCost;
    uint256 public nukeCost;
    uint256 public spyCost;
    address public countryMinter;
    address public treasuryAddress;
    address public aid;
    address public spyAddress;
    address public cruiseMissile;
    address public infrastructure;
    address public resources;
    address public improvements1;
    address public improvements2;
    address public wonders1;
    address public nukeAddress;
    address public airBattle;
    address public groundBattle;
    address public warAddress;

    CountryMinter mint;
    InfrastructureContract inf;
    ResourcesContract res;
    WondersContract1 won1;
    ImprovementsContract1 imp1;
    ImprovementsContract2 imp2;
    WarContract war;

    struct Forces {
        uint256 numberOfSoldiers;
        uint256 defendingSoldiers;
        uint256 deployedSoldiers;
        uint256 soldierCasualties;
        uint256 numberOfTanks;
        uint256 defendingTanks;
        uint256 deployedTanks;
        uint256 cruiseMissiles;
        uint256 nuclearWeapons;
        uint256 nukesPurchasedToday;
        uint256 numberOfSpies;
        bool nationExists;
    }

    constructor(
        address _treasuryAddress,
        address _aid,
        address _spyAddress,
        address _cruiseMissile,
        address _nukeAddress,
        address _airBattle,
        address _groundBattle,
        address _warAddress
    ) {
        treasuryAddress = _treasuryAddress;
        spyAddress = _spyAddress;
        cruiseMissile = _cruiseMissile;
        aid = _aid;
        nukeAddress = _nukeAddress;
        airBattle = _airBattle;
        warAddress = _warAddress;
        war = WarContract(_warAddress);
        groundBattle = _groundBattle;
        tankCost = 480;
        cruiseMissileCost = 20000;
        spyCost = 500;
    }

    function constructorContinued(
        address _infrastructure,
        address _resources,
        address _improvements1,
        address _improvements2,
        address _wonders1,
        address _countryMinter
    ) public onlyOwner {
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        resources = _resources;
        res = ResourcesContract(_resources);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        improvements2 = _improvements2;
        imp2 = ImprovementsContract2(_improvements2);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
    }

    mapping(uint256 => Forces) public idToForces;
    mapping(uint256 => address) public idToOwnerForces;

    function generateForces(uint256 id, address nationOwner) public {
        Forces memory newForces = Forces(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true);
        idToForces[id] = newForces;
        idToOwnerForces[id] = nationOwner;
    }

    function updateInfrastructureContract(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    function updateResourcesContract(address newAddress) public onlyOwner {
        resources = newAddress;
        res = ResourcesContract(newAddress);
    }

    function updateImprovementsContract1(address newAddress) public onlyOwner {
        improvements1 = newAddress;
        imp1 = ImprovementsContract1(newAddress);
    }

    function updateTankCost(uint256 newPrice) public onlyOwner {
        tankCost = newPrice;
    }

    function updateCruiseMissileCost(uint256 newPrice) public onlyOwner {
        cruiseMissileCost = newPrice;
    }

    function updateNukeCost(uint256 newPrice) public onlyOwner {
        nukeCost = newPrice;
    }

    function updateSpyCost(uint256 newPrice) public onlyOwner {
        spyCost = newPrice;
    }

    modifier onlyAidContract() {
        require(msg.sender == aid);
        _;
    }

    modifier onlySpyContract() {
        require(msg.sender == spyAddress, "only callable from spy contract");
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
        require(msg.sender == nukeAddress, "only callable from nuke contract");
        _;
    }

    modifier onlyAirBattle() {
        require(
            msg.sender == airBattle,
            "only callable from air battle contract"
        );
        _;
    }

    modifier onlyGroundBattle() {
        require(
            msg.sender == groundBattle,
            "only callable from air battle contract"
        );
        _;
    }

    function buySoldiers(uint256 amount, uint256 id) public {
        require(
            idToOwnerForces[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 soldierCost = getSoldierCost(id);
        uint256 purchasePrice = soldierCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToForces[id].numberOfSoldiers += amount;
        idToForces[id].defendingSoldiers += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function getSoldierCost(uint256 id) public view returns (uint256) {
        uint256 soldierCost = 12;
        bool iron = res.viewIron(id);
        if (iron) {
            soldierCost -= 3;
        }
        bool oil = res.viewOil(id);
        if (oil) {
            soldierCost -= 3;
        }
        return soldierCost;
    }

    function sendSoldiers(
        uint256 idSender,
        uint256 idReciever,
        uint256 amount
    ) public onlyAidContract {
        uint256 defendingSoldierCount = idToForces[idSender].defendingSoldiers;
        require(
            defendingSoldierCount >= amount,
            "You do not have enough defending soldiers to send"
        );
        require(
            idToForces[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToForces[idSender].defendingSoldiers -= amount;
        idToForces[idSender].numberOfSoldiers -= amount;
        idToForces[idReciever].defendingSoldiers += amount;
        idToForces[idReciever].numberOfSoldiers += amount;
    }

    function getDefendingSoldierCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToForces[id].defendingSoldiers;
        return count;
    }

    function deploySoldiers(
        uint256 amountToDeploy,
        uint256 id,
        uint256 warId
    ) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 totalSoldiers = getSoldierCount(id);
        uint256 deployedSoldiers = getDeployedSoldierCount(id);
        uint256 maxDeployablePercentage = getMaxDeployablePercentage(id);
        require(
            (((deployedSoldiers + amountToDeploy) * 100) / totalSoldiers) <=
                maxDeployablePercentage
        );
        war.deploySoldiers(id, warId, amountToDeploy);
        uint256 defendingSoldierCount = idToForces[id].defendingSoldiers;
        require(defendingSoldierCount >= amountToDeploy);
        idToForces[id].defendingSoldiers -= amountToDeploy;
        idToForces[id].deployedSoldiers += amountToDeploy;
    }

    function getMaxDeployablePercentage(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 maxDeployablePercentage = 80;
        uint256 borderFortificationCount = imp1.getBorderFortificationCount(id);
        if (borderFortificationCount > 0) {
            maxDeployablePercentage -= (2 * borderFortificationCount);
        }
        return maxDeployablePercentage;
    }

    function withdrawSoldiers(uint256 amountToWithdraw, uint256 id) public {
        require(
            idToOwnerForces[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 deployedSoldierCount = idToForces[id].deployedSoldiers;
        require(deployedSoldierCount >= amountToWithdraw);
        idToForces[id].defendingSoldiers += amountToWithdraw;
        idToForces[id].deployedSoldiers -= amountToWithdraw;
    }

    //need?
    function decreaseDefendingSoldierCount(uint256 amount, uint256 id) public {
        idToForces[id].defendingSoldiers -= amount;
        idToForces[id].numberOfSoldiers -= amount;
    }

    function decreaseDefendingSoldierCountFromNukeAttack(uint256 id)
        public
        onlyNukeContract
    {
        bool falloutShelter = won1.getFalloutShelterSystem(id);
        if (!falloutShelter) {
            uint256 numberOfDefendingSoldiers = idToForces[id]
                .defendingSoldiers;
            idToForces[id].defendingSoldiers = 0;
            idToForces[id].numberOfSoldiers -= numberOfDefendingSoldiers;
            idToForces[id].soldierCasualties += numberOfDefendingSoldiers;
        }
        /* falloutShelter */
        else {
            uint256 numberOfDefendingSoldierCasualties = ((
                idToForces[id].defendingSoldiers
            ) / 2);
            idToForces[id]
                .defendingSoldiers = numberOfDefendingSoldierCasualties;
            idToForces[id]
                .numberOfSoldiers -= numberOfDefendingSoldierCasualties;
            idToForces[id].soldierCasualties += numberOfDefendingSoldierCasualties;
        }
    }

    //called during battle
    //also needs modifier
    function decreaseDeployedSoldierCount(uint256 amount, uint256 id) public {
        idToForces[id].deployedSoldiers -= amount;
        idToForces[id].numberOfSoldiers -= amount;
    }

    function getSoldierCount(uint256 id)
        public
        view
        returns (uint256 soldiers)
    {
        uint256 soldierAmount = idToForces[id].numberOfSoldiers;
        return soldierAmount;
    }

    function getDeployedSoldierCount(uint256 id)
        public
        view
        returns (uint256 soldiers)
    {
        uint256 soldierAmount = idToForces[id].deployedSoldiers;
        return soldierAmount;
    }

    function getDeployedSoldierEfficiencyModifier(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 efficiencyModifier = 100;
        bool aluminum = res.viewAluminium(id);
        if (aluminum) {
            efficiencyModifier += 20;
        }
        bool coal = res.viewCoal(id);
        if (coal) {
            efficiencyModifier += 8;
        }
        bool oil = res.viewOil(id);
        if (oil) {
            efficiencyModifier += 10;
        }
        bool pigs = res.viewPigs(id);
        if (pigs) {
            efficiencyModifier += 15;
        }
        uint256 barracks = imp1.getBarracksCount(id);
        if (barracks > 0) {
            efficiencyModifier += (10 * barracks);
        }
        uint256 guerillaCamps = imp2.getGuerillaCampCount(id);
        if (guerillaCamps > 0) {
            efficiencyModifier += (35 * guerillaCamps);
        }
        return efficiencyModifier;
    }

    function getDefendingSoldierEfficiencyModifier(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 efficiencyModifier = 100;
        bool aluminum = res.viewAluminium(id);
        if (aluminum) {
            efficiencyModifier += 20;
        }
        bool coal = res.viewCoal(id);
        if (coal) {
            efficiencyModifier += 8;
        }
        bool oil = res.viewOil(id);
        if (oil) {
            efficiencyModifier += 10;
        }
        bool pigs = res.viewPigs(id);
        if (pigs) {
            efficiencyModifier += 15;
        }
        uint256 barracks = imp1.getBarracksCount(id);
        if (barracks > 0) {
            efficiencyModifier += (10 * barracks);
        }
        uint256 borderFortification = imp1.getBorderFortificationCount(id);
        if (borderFortification > 0) {
            efficiencyModifier += (borderFortification * 2);
        }
        uint256 fobCount = imp2.getForwardOperatingBaseCount(id);
        if (fobCount > 0) {
            efficiencyModifier -= (fobCount * 3);
        }
        uint256 guerillaCamps = imp2.getGuerillaCampCount(id);
        if (guerillaCamps > 0) {
            efficiencyModifier += (35 * guerillaCamps);
        }
        return efficiencyModifier;
    }

    function buyTanks(uint256 amount, uint256 id) public {
        require(
            idToOwnerForces[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = tankCost;
        uint256 factoryCount = imp1.getFactoryCount(id);
        uint256 costModifier = 100;
        if (factoryCount > 0) {
            costModifier -= (factoryCount * 5);
        }
        uint256 cost = (amount * ((purchasePrice * costModifier) / 100));
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= cost);
        idToForces[id].numberOfTanks += amount;
        idToForces[id].defendingTanks += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, cost);
    }

    function deployTanks(uint256 amountToDeploy, uint256 id) public {
        require(
            idToOwnerForces[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 defendingTankCount = idToForces[id].defendingTanks;
        require(defendingTankCount >= amountToDeploy);
        idToForces[id].defendingTanks -= amountToDeploy;
        idToForces[id].deployedTanks += amountToDeploy;
    }

    function withdrawTanks(uint256 amountToWithdraw, uint256 id) public {
        require(
            idToOwnerForces[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 deployedTankCount = idToForces[id].deployedTanks;
        require(deployedTankCount >= amountToWithdraw);
        idToForces[id].defendingTanks += amountToWithdraw;
        idToForces[id].deployedTanks -= amountToWithdraw;
    }

    function decreaseDefendingTankCount(uint256 amount, uint256 id)
        public
        onlySpyContract
    {
        idToForces[id].defendingTanks -= amount;
        idToForces[id].numberOfTanks -= amount;
    }

    function decreaseDefendingTankCountFromCruiseMissileContract(
        uint256 amount,
        uint256 id
    ) public onlyCruiseMissileContract {
        idToForces[id].defendingTanks -= amount;
        idToForces[id].numberOfTanks -= amount;
    }

    function decreaseDefendingTankCountFromNukeContract(uint256 id)
        public
        onlyNukeContract
    {
        uint256 defendingTanks = idToForces[id].defendingTanks;
        uint256 percentage = 35;
        bool falloutShelter = won1.getFalloutShelterSystem(id);
        if (falloutShelter) {
            percentage = 25;
        }
        uint256 defendingTanksToDecrease = ((defendingTanks * percentage) / 100);
        idToForces[id].numberOfTanks -= defendingTanksToDecrease;
        idToForces[id].defendingTanks -= defendingTanksToDecrease;
    }

    function decreaseDefendingTankCountFromAirBattleContract(
        uint256 id,
        uint256 amountToDecrease
    ) public onlyAirBattle {
        uint256 defendingTanks = idToForces[id].defendingTanks;
        if (amountToDecrease >= defendingTanks) {
            idToForces[id].numberOfTanks -= defendingTanks;
            idToForces[id].defendingTanks = 0;
        } else {
            idToForces[id].numberOfTanks -= amountToDecrease;
            idToForces[id].defendingTanks -= amountToDecrease;
        }
    }

    function decreaseDeployedTankCount(uint256 amount, uint256 id) public {
        idToForces[id].deployedTanks -= amount;
        idToForces[id].numberOfTanks -= amount;
    }

    function getTankCount(uint256 id) public view returns (uint256 tanks) {
        uint256 tankAmount = idToForces[id].numberOfTanks;
        return tankAmount;
    }

    function getDeployedTankCount(uint256 id)
        public
        view
        returns (uint256 tanks)
    {
        uint256 tankAmount = idToForces[id].deployedTanks;
        return tankAmount;
    }

    function getDefendingTankCount(uint256 id)
        public
        view
        returns (uint256 tanks)
    {
        uint256 tankAmount = idToForces[id].defendingTanks;
        return tankAmount;
    }

    function buySpies(uint256 amount, uint256 id) public {
        require(
            idToOwnerForces[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 maxSpyCount = getMaxSpyCount(id);
        uint256 currentSpyCount = idToForces[id].numberOfSpies;
        require(
            (currentSpyCount + amount) <= maxSpyCount,
            "cannot own that many spies"
        );
        uint256 purchasePrice = spyCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToForces[id].numberOfSpies += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function getMaxSpyCount(uint256 id) public view returns (uint256) {
        uint256 maxSpyCount = 50;
        uint256 intelAgencies = imp2.getIntelAgencyCount(id);
        if (maxSpyCount > 0) {
            maxSpyCount += (intelAgencies * 100);
        }
        bool cia = won1.getCentralIntelligenceAgency(id);
        if (cia) {
            maxSpyCount += 250;
        }
        return maxSpyCount;
    }

    function decreaseAttackerSpyCount(uint256 id) public onlySpyContract {
        idToForces[id].numberOfSpies -= 1;
    }

    function decreaseDefenderSpyCount(uint256 amount, uint256 id)
        public
        onlySpyContract
    {
        idToForces[id].numberOfSpies -= amount;
    }

    function getSpyCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 spyAmount = idToForces[countryId].numberOfSpies;
        return spyAmount;
    }

    function decreaseDeployedUnits(
        uint256 attackerSoldierLosses,
        uint256 attackerTankLosses,
        uint256 attackerId
    ) public onlyGroundBattle {
        idToForces[attackerId].numberOfSoldiers -= attackerSoldierLosses;
        idToForces[attackerId].deployedSoldiers -= attackerSoldierLosses;
        idToForces[attackerId].soldierCasualties += attackerSoldierLosses;
        idToForces[attackerId].numberOfTanks -= attackerTankLosses;
        idToForces[attackerId].deployedTanks -= attackerTankLosses;
    }

    function decreaseDefendingUnits(
        uint256 defenderSoldierLosses,
        uint256 defenderTankLosses,
        uint256 defenderId
    ) public onlyGroundBattle {
        idToForces[defenderId].numberOfSoldiers -= defenderSoldierLosses;
        idToForces[defenderId].defendingSoldiers -= defenderSoldierLosses;
        idToForces[defenderId].soldierCasualties += defenderSoldierLosses;
        idToForces[defenderId].numberOfTanks -= defenderTankLosses;
        idToForces[defenderId].defendingTanks -= defenderTankLosses;
    }

    function getCasualties(uint256 id) public view returns (uint256) {
        uint256 casualties = idToForces[id].soldierCasualties;
        return casualties;
    }
}

contract MissilesContract is Ownable {
    uint256 public cruiseMissileCost;
    uint256 public nukeCost;
    address public countryMinter;
    address public treasury;
    // address public aid;
    address public spyAddress;
    // address public cruiseMissile;
    // address public infrastructure;
    address public resources;
    address public improvements1;
    // address public improvements2;
    address public wonders1;
    address public wonders2;
    address public wonders4;
    address public nukeAddress;
    address public airBattle;
    // address public groundBattle;
    // address public warAddress;
    address public countryinter;
    address public strength;

    CountryMinter mint;
    InfrastructureContract inf;
    ResourcesContract res;
    WondersContract1 won1;
    WondersContract2 won2;
    WondersContract4 won4;
    ImprovementsContract1 imp1;
    ImprovementsContract2 imp2;
    WarContract war;
    TreasuryContract tsy;
    NationStrengthContract stren;

    struct Missiles {
        uint256 cruiseMissiles;
        uint256 nuclearWeapons;
        uint256 nukesPurchasedToday;
    }

    constructor(
        address _treasury,
        // address _aid,
        address _spyAddress,
        // address _cruiseMissile,
        address _nukeAddress,
        address _airBattle,
        address _wonders2,
        address _strength
        // address _groundBattle,
        // address _warAddress
    ) {
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
        spyAddress = _spyAddress;
        // cruiseMissile = _cruiseMissile;
        // aid = _aid;
        nukeAddress = _nukeAddress;
        airBattle = _airBattle;
        wonders2 = _wonders2;
        won2 = WondersContract2(_wonders2);
        strength = _strength;
        stren = NationStrengthContract(_strength);
        // warAddress = _warAddress;
        // war = WarContract(_warAddress);
        // groundBattle = _groundBattle;
        cruiseMissileCost = 20000;
    }

    function constructorContinued(
        // address _infrastructure,
        address _resources,
        address _improvements1,
        // address _improvements2,
        address _wonders1,
        address _wonders4,
        address _countryMinter
    ) public onlyOwner {
        // infrastructure = _infrastructure;
        // inf = InfrastructureContract(_infrastructure);
        resources = _resources;
        res = ResourcesContract(_resources);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        wonders4 = _wonders4;
        won4 = WondersContract4(_wonders4);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        // improvements2 = _improvements2;
        // imp2 = ImprovementsContract2(_improvements2);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
    }

    mapping(uint256 => Missiles) public idToMissiles;
    mapping(uint256 => address) public idToOwnerMissiles;

    function generateMissiles(uint256 id, address nationOwner) public {
        Missiles memory newMissiles = Missiles(0, 0, 0);
        idToMissiles[id] = newMissiles;
        idToOwnerMissiles[id] = nationOwner;
    }

    // function updateInfrastructureContract(address newAddress) public onlyOwner {
    //     infrastructure = newAddress;
    //     inf = InfrastructureContract(newAddress);
    // }

    // function updateResourcesContract(address newAddress) public onlyOwner {
    //     resources = newAddress;
    //     res = ResourcesContract(newAddress);
    // }

    // function updateImprovementsContract1(address newAddress) public onlyOwner {
    //     improvements1 = newAddress;
    //     imp1 = ImprovementsContract1(newAddress);
    // }

    // function updateCruiseMissileCost(uint256 newPrice) public onlyOwner {
    //     cruiseMissileCost = newPrice;
    // }

    modifier onlySpyContract() {
        require(msg.sender == spyAddress, "only callable from spy contract");
        _;
    }

    // modifier onlyCruiseMissileContract() {
    //     require(
    //         msg.sender == cruiseMissile,
    //         "only callable from cruise missile contract"
    //     );
    //     _;
    // }

    modifier onlyNukeContract() {
        require(msg.sender == nukeAddress, "only callable from nuke contract");
        _;
    }

    modifier onlyAirBattle() {
        require(
            msg.sender == airBattle,
            "only callable from air battle contract"
        );
        _;
    }

    // modifier onlyGroundBattle() {
    //     require(
    //         msg.sender == groundBattle,
    //         "only callable from air battle contract"
    //     );
    //     _;
    // }

    function buyCruiseMissiles(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 purchasePrice = cruiseMissileCost;
        uint256 factoryCount = imp1.getFactoryCount(id);
        uint256 costModifier = 100;
        if (factoryCount > 0) {
            costModifier -= (factoryCount * 5);
        }
        uint256 cost = (amount * ((purchasePrice * costModifier) / 100));
        idToMissiles[id].cruiseMissiles += amount;
        tsy.spendBalance(id, cost);
    }

    function getCruiseMissileCount(uint256 id) public view returns (uint256) {
        uint256 count = idToMissiles[id].cruiseMissiles;
        return count;
    }

    function decreaseCruiseMissileCount(uint256 amount, uint256 id)
        public
        onlySpyContract
    {
        idToMissiles[id].cruiseMissiles -= amount;
    }

    function decreaseCruiseMissileCountFromNukeContract(uint256 id)
        public
        onlyNukeContract
    {
        uint256 cruiseMissiles = idToMissiles[id].cruiseMissiles;
        uint256 percentage = 35;
        bool falloutShelter = won1.getFalloutShelterSystem(id);
        if (falloutShelter) {
            percentage = 25;
        }
        uint256 cruiseMissilesToDecrease = ((cruiseMissiles * 35) / 100);
        idToMissiles[id].cruiseMissiles -= cruiseMissilesToDecrease;
    }

    function decreaseCruiseMissileCountFromAirBattleContract(
        uint256 id,
        uint256 amountToDecrease
    ) public onlyAirBattle {
        uint256 cruiseMissiles = idToMissiles[id].cruiseMissiles;
        if (amountToDecrease >= cruiseMissiles) {
            idToMissiles[id].cruiseMissiles = 0;
        } else {
            idToMissiles[id].cruiseMissiles -= amountToDecrease;
        }
    }

    function buyNukes(uint256 id) public {
        //tech 75 infra 1000 access to uranium
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 techAmount = inf.getTechnologyCount(id);
        require(techAmount >= 75, "insufficient tech");
        uint256 infrastructureAmount = inf.getInfrastructureCount(id);
        require(infrastructureAmount >= 1000, "insufficient infrastructure");
        bool isUranium = res.viewUranium(id);
        require(isUranium, "no uranium");
        uint256 nationStrength = stren.getNationStrength(id);
        bool manhattanProject = won2.getManhattanProject(id);
        require (nationStrength > 150000 || manhattanProject, "nation strength too low");
        uint256 nukesPurchasedToday = idToMissiles[id].nukesPurchasedToday;
        uint256 maxNukesPerDay = 1;
        bool weaponsResearchCenter = won4.getWeaponsResearchCenter(id);
        if (weaponsResearchCenter) {
            maxNukesPerDay = 2;
        }
        require(nukesPurchasedToday < maxNukesPerDay, "already purchased nuke today");
        idToMissiles[id].nukesPurchasedToday += 1;
        uint256 nukeCount = idToMissiles[id].nuclearWeapons;
        uint256 cost = (500000 + (nukeCount * 50000));
        idToMissiles[id].nuclearWeapons += 1;
        tsy.spendBalance(id, cost);
    }

    function getNukeCount(uint256 id) public view returns (uint256) {
        uint256 count = idToMissiles[id].nuclearWeapons;
        return count;
    }

    //need to decrease nuke count when launched

    function decreaseNukeCountFromNukeContract(uint256 id)
        public
        onlyNukeContract
    {

        idToMissiles[id].nuclearWeapons -= 1;
    }

    function decreaseNukeCountFromSpyContract(uint256 id)
        public
        onlySpyContract
    {
        bool silo = won2.getHiddenNuclearMissileSilo(id);
        uint256 nukeCount = getNukeCount(id);
        uint256 requiredNukeAmount = 1;
        if (silo) {
            requiredNukeAmount = 6;
        }
        require (nukeCount >= requiredNukeAmount, "no nukes to destroy");
        idToMissiles[id].nuclearWeapons -= 1;
    }
}
