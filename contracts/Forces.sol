//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "./Infrastructure.sol";
import "./Resources.sol";
import "./Wonders.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ForcesContract is Ownable {
    uint256 public soldierCost;
    uint256 public tankCost;
    uint256 public cruiseMissileCost;
    uint256 public nukeCost;
    uint256 public spyCost;
    address public treasuryAddress;
    address public aid;
    address public spyAddress;
    address public cruiseMissile;
    address public infrastructure;
    address public resources;
    address public wonders1;
    address public nukeAddress;

    InfrastructureContract inf;
    ResourcesContract res;
    WondersContract1 won1;

    struct Forces {
        uint256 numberOfSoldiers;
        uint256 defendingSoldiers;
        uint256 deployedSoldiers;
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
        address _infrastructure,
        address _resources,
        address _wonders1,
        address _nukeAddress
    ) {
        treasuryAddress = _treasuryAddress;
        spyAddress = _spyAddress;
        cruiseMissile = _cruiseMissile;
        aid = _aid;
        infrastructure = _infrastructure;
        nukeAddress = _nukeAddress;
        inf = InfrastructureContract(_infrastructure);
        resources = _resources;
        res = ResourcesContract(_resources);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        soldierCost = 100;
        tankCost = 200;
        cruiseMissileCost = 20000;
        spyCost = 500;
    }

    mapping(uint256 => Forces) public idToForces;
    mapping(uint256 => address) public idToOwnerForces;

    function generateForces(uint256 id, address nationOwner) public {
        Forces memory newForces = Forces(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true);
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

    function updateSoldierCost(uint256 newPrice) public onlyOwner {
        soldierCost = newPrice;
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
        require(
            msg.sender == nukeAddress,
            "only callable from nuke contract"
        );
        _;
    }

    function buySoldiers(uint256 amount, uint256 id) public {
        require(
            idToOwnerForces[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = soldierCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToForces[id].numberOfSoldiers += amount;
        idToForces[id].defendingSoldiers += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
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

    function deploySoldiers(uint256 amountToDeploy, uint256 id) public {
        require(
            idToOwnerForces[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 defendingSoldierCount = idToForces[id].defendingSoldiers;
        require(defendingSoldierCount >= amountToDeploy);
        idToForces[id].defendingSoldiers -= amountToDeploy;
        idToForces[id].deployedSoldiers += amountToDeploy;
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

    function decreaseDefendingSoldierCount(uint256 amount, uint256 id) public {
        idToForces[id].defendingSoldiers -= amount;
        idToForces[id].numberOfSoldiers -= amount;
    }

    function decreaseDefendingSoldierCountFromNukeAttack(uint256 id) public onlyNukeContract {
        bool falloutShelter = won1.getFalloutShelterSystem(id);
        if(!falloutShelter) {        
            uint256 numberOfDefendingSoldiers = idToForces[id].defendingSoldiers;
            idToForces[id].defendingSoldiers = 0;
            idToForces[id].numberOfSoldiers -= numberOfDefendingSoldiers;
        } else /* falloutShelter */ {
            uint256 numberOfDefendingSoldierCasualties = ((idToForces[id].defendingSoldiers) / 2);
            idToForces[id].defendingSoldiers = numberOfDefendingSoldierCasualties;
            idToForces[id].numberOfSoldiers -= numberOfDefendingSoldierCasualties;
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

    function buyTanks(uint256 amount, uint256 id) public {
        require(
            idToOwnerForces[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = tankCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToForces[id].numberOfTanks += amount;
        idToForces[id].defendingTanks += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
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

    function decreaseDefendingTankCountFromCruiseMissileContract(uint256 amount, uint256 id)
        public
        onlyCruiseMissileContract
    {
        idToForces[id].defendingTanks -= amount;
        idToForces[id].numberOfTanks -= amount;
    }

    function decreaseDefendingTankCountFromNukeContract(uint256 id)
        public
        onlyNukeContract
    {
        uint256 defendingTanks = idToForces[id].defendingTanks;
        uint256 defendingTanksToDecrease = ((defendingTanks * 35) / 100);
        idToForces[id].numberOfTanks -= defendingTanksToDecrease;
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

    function buyCruiseMissiles(uint256 amount, uint256 id) public {
        require(
            idToOwnerForces[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = cruiseMissileCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToForces[id].cruiseMissiles += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function getCruiseMissileCount(uint256 id) public view returns (uint256) {
        uint256 count = idToForces[id].cruiseMissiles;
        return count;
    }

    function decreaseCruiseMissileCount(uint256 amount, uint256 id)
        public
        onlySpyContract
    {
        idToForces[id].cruiseMissiles -= amount;
    }

        function decreaseCruiseMissileCountFromNukeContract(uint256 id)
        public
        onlyNukeContract
    {
        uint256 cruiseMissiles = idToForces[id].cruiseMissiles;
        uint256 cruiseMissilesToDecrease = ((cruiseMissiles * 35) / 100);
        idToForces[id].cruiseMissiles -= cruiseMissilesToDecrease;
    }

    function buyNukes(uint256 amount, uint256 id) public {
        //tech 75 infra 1000 access to uranium
        require(
            idToOwnerForces[id] == msg.sender,
            "You are not the nation ruler"
        );
        require(amount == 1, "can only purchase one nuke a day");
        uint256 techAmount = inf.getTechnologyCount(id);
        require(techAmount >= 75, "insufficient tech");
        uint256 infrastructureAmount = inf.getInfrastructureCount(id);
        require(infrastructureAmount >= 1000, "insufficient infrastructure");
        bool isUranium = res.viewUranium(id);
        require(isUranium, "no uranium");
        require(amount == 1, "can only purchase one nuke");
        uint256 nukesPurchasedToday = idToForces[id].nukesPurchasedToday;
        require(nukesPurchasedToday < 1, "already purchased nuke today");
        uint256 nukeCount = idToForces[id].nuclearWeapons;
        uint256 purchasePrice = (500000 + (nukeCount * 50000));
        uint256 cost = (purchasePrice * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= cost, "insufficient funds");
        idToForces[id].nuclearWeapons += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, cost);
    }

    function getNukeCount(uint256 id) public view returns (uint256) {
        uint256 count = idToForces[id].nuclearWeapons;
        return count;
    }

    function decreaseNukeCountFromSpyContract(uint256 id)
        public
        onlySpyContract
    {
        idToForces[id].nuclearWeapons -= 1;
    }

    function buySpies(uint256 amount, uint256 id) public {
        require(
            idToOwnerForces[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = spyCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToForces[id].numberOfSpies += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    //should there be a send spy function?
    function sendSpies(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerForces[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 cruiseMissileCount = idToForces[idSender].cruiseMissiles;
        require(
            cruiseMissileCount >= amount,
            "You do not have enough cruise missiles to send"
        );
        require(
            idToForces[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToForces[idSender].cruiseMissiles -= amount;
        idToForces[idReciever].cruiseMissiles += amount;
    }

    //called during a battle
    //how can I make sure that only the fighting contract can call this (modifier?)
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
}
