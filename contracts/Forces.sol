//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ForcesContract is Ownable {
    uint256 public soldierCost;
    uint256 public tankCost;
    uint256 public cruiseMissileCost;
    uint256 public nukeCost;
    uint256 public spyCost;
    address public treasuryAddress;
    address public aid;

    struct Forces {
        uint256 numberOfSoldiers;
        uint256 defendingSoldiers;
        uint256 deployedSoldiers;
        uint256 numberOfTanks;
        uint256 defendingTanks;
        uint256 deployedTanks;
        uint256 cruiseMissiles;
        uint256 nuclearWeapons;
        uint256 numberOfSpies;
        bool nationExists;
    }

    constructor(address _treasuryAddress, address _aid) {
        treasuryAddress = _treasuryAddress;
        aid = _aid;
        soldierCost = 100;
        tankCost = 200;
        cruiseMissileCost = 300;
        nukeCost = 400;
        spyCost = 500;
    }

    mapping(uint256 => Forces) public idToForces;
    mapping(uint256 => address) public idToOwnerForces;

    function generateForces(uint256 id, address nationOwner) public {
        Forces memory newForces = Forces(0, 0, 0, 0, 0, 0, 0, 0, 0, true);
        idToForces[id] = newForces;
        idToOwnerForces[id] = nationOwner;
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

    modifier onlyAidContract() {
        require(msg.sender == aid);
        _;
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

    //called during a battle
    //how can I make sure that only the fighting contract can call this (modifier?)
    function decreaseDefendingSoldierCount(uint256 amount, uint256 id) public {
        idToForces[id].defendingSoldiers -= amount;
        idToForces[id].numberOfSoldiers -= amount;
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

    function sendTanks(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerForces[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 defendingTankCount = idToForces[idSender].defendingTanks;
        require(
            defendingTankCount >= amount,
            "You do not have enough tanks to send"
        );
        require(
            idToForces[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToForces[idSender].defendingTanks -= amount;
        idToForces[idSender].numberOfTanks -= amount;
        idToForces[idReciever].defendingTanks += amount;
        idToForces[idReciever].numberOfTanks += amount;
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

    //called during a battle
    //how can I make sure that only the fighting contract can call this (modifier?)
    function decreaseDefendingTankCount(uint256 amount, uint256 id) public {
        idToForces[id].defendingTanks -= amount;
        idToForces[id].numberOfTanks -= amount;
    }

    //called during battle
    //also needs modifier
    function decreaseDeployedTankCount(uint256 amount, uint256 id) public {
        idToForces[id].deployedTanks -= amount;
        idToForces[id].numberOfTanks -= amount;
    }

    function getTankCount(uint256 id) public view returns (uint256 tanks) {
        uint256 tankAmount = idToForces[id].numberOfTanks;
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

    function sendCruiseMissiles(
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
    function decreaseCruiseMissileCount(uint256 amount, uint256 id) public {
        idToForces[id].cruiseMissiles -= amount;
    }

    function buyNukes(uint256 amount, uint256 id) public {
        require(
            idToOwnerForces[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = nukeCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToForces[id].nuclearWeapons += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendNukes(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerForces[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 nukeCount = idToForces[idSender].nuclearWeapons;
        require(
            nukeCount >= amount,
            "You do not have enough cruise missiles to send"
        );
        require(
            idToForces[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToForces[idSender].nuclearWeapons -= amount;
        idToForces[idReciever].nuclearWeapons += amount;
    }

    function getNukeCount(uint256 id) public view returns (uint256 tanks) {
        uint256 count = idToForces[id].nuclearWeapons;
        return count;
    }

    //called during a battle
    //how can I make sure that only the fighting contract can call this (modifier?)
    function decreaseNukeCount(uint256 amount, uint256 id) public {
        idToForces[id].nuclearWeapons -= amount;
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
    function decreaseSpyCount(uint256 amount, uint256 id) public {
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
