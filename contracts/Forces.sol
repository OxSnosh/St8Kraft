//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ForcesContract is Ownable {

    uint private forcesId;
    uint public soldierCost;
    uint public tankCost;
    uint public cruiseMissileCost;
    uint public nukeCost;
    uint public spyCost;    
    address public treasuryAddress;
    
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

    constructor (address _treasuryAddress) {
        treasuryAddress = _treasuryAddress;
        soldierCost = 100;
        tankCost = 200;
        cruiseMissileCost = 300;
        nukeCost = 400;
        spyCost = 500;
    }
    
    mapping(uint256 => Forces) public idToForces;
    mapping(uint256 => address) public idToOwnerForces;

    function generateForces() public {
        Forces memory newForces = Forces(0, 0, 0, 0, 0, 0, 0, 0, 0, true);
        idToForces[forcesId] = newForces;
        idToOwnerForces[forcesId] = msg.sender;
        forcesId++;
    }

    function updateSoldierCost(uint newPrice) public onlyOwner {
        soldierCost = newPrice;
    }

    function updateTankCost(uint newPrice) public onlyOwner {
        tankCost = newPrice;
    }

    function updateCruiseMissileCost(uint newPrice) public onlyOwner {
        cruiseMissileCost = newPrice;
    }

    function updateNukeCost(uint newPrice) public onlyOwner {
        nukeCost = newPrice;
    }

    function updateSpyCost(uint newPrice) public onlyOwner {
        spyCost = newPrice;
    }

    function buySoldiers(uint amount, uint id) public {
        require(idToOwnerForces[id] == msg.sender, "You are not the nation ruler");
        uint purchasePrice = soldierCost * amount;
        uint balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToForces[id].numberOfSoldiers += amount;
        idToForces[id].defendingSoldiers += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);        
    }

    function sendSoldiers(uint amount, uint idSender, uint idReciever) public {
        require(idToOwnerForces[idSender] == msg.sender, "You are not the nation ruler");
        uint defendingSoldierCount = idToForces[idSender].defendingSoldiers;
        require(defendingSoldierCount >= amount, "You do not have enough defending soldiers to send");
        require(idToForces[idReciever].nationExists = true, "Destination nation does not exist");
        idToForces[idSender].defendingSoldiers -= amount;
        idToForces[idSender].numberOfSoldiers -= amount;
        idToForces[idReciever].defendingSoldiers += amount;
        idToForces[idReciever].numberOfSoldiers += amount;                
    }

    function deploySoldiers(uint amountToDeploy, uint id) public {
        require(idToOwnerForces[id] == msg.sender, "You are not the nation ruler");
        uint defendingSoldierCount = idToForces[id].defendingSoldiers;
        require(defendingSoldierCount >= amountToDeploy);
        idToForces[id].defendingSoldiers -= amountToDeploy;
        idToForces[id].deployedSoldiers += amountToDeploy;
    }

    function withdrawSoldiers(uint amountToWithdraw, uint id) public {
        require(idToOwnerForces[id] == msg.sender, "You are not the nation ruler");
        uint deployedSoldierCount = idToForces[id].deployedSoldiers;
        require(deployedSoldierCount >= amountToWithdraw);
        idToForces[id].defendingSoldiers += amountToWithdraw;
        idToForces[id].deployedSoldiers -= amountToWithdraw;  
    }

    //called during a battle
    //how can I make sure that only the fighting contract can call this (modifier?)
    function decreaseDefendingSoldierCount(uint amount, uint id) public {
        idToForces[id].defendingSoldiers -= amount;
        idToForces[id].numberOfSoldiers -= amount;
    }

    //called during battle
    //also needs modifier
    function decreaseDeployedSoldierCount(uint amount, uint id) public {
        idToForces[id].deployedSoldiers -= amount;
        idToForces[id].numberOfSoldiers -= amount;
    }

    function buyTanks(uint amount, uint id) public {
        require(idToOwnerForces[id] == msg.sender, "You are not the nation ruler");
        uint purchasePrice = tankCost * amount;
        uint balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToForces[id].numberOfTanks += amount;
        idToForces[id].defendingTanks += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);        
    }

    function sendTanks(uint amount, uint idSender, uint idReciever) public {
        require(idToOwnerForces[idSender] == msg.sender, "You are not the nation ruler");
        uint defendingTankCount = idToForces[idSender].defendingTanks;
        require(defendingTankCount >= amount, "You do not have enough tanks to send");
        require(idToForces[idReciever].nationExists = true, "Destination nation does not exist");
        idToForces[idSender].defendingTanks -= amount;
        idToForces[idSender].numberOfTanks -= amount;
        idToForces[idReciever].defendingTanks += amount;
        idToForces[idReciever].numberOfTanks += amount;                
    }

    function deployTanks(uint amountToDeploy, uint id) public {
        require(idToOwnerForces[id] == msg.sender, "You are not the nation ruler");
        uint defendingTankCount = idToForces[id].defendingTanks;
        require(defendingTankCount >= amountToDeploy);
        idToForces[id].defendingTanks -= amountToDeploy;
        idToForces[id].deployedTanks += amountToDeploy;
    }

    function withdrawTanks(uint amountToWithdraw, uint id) public {
        require(idToOwnerForces[id] == msg.sender, "You are not the nation ruler");
        uint deployedTankCount = idToForces[id].deployedTanks;
        require(deployedTankCount >= amountToWithdraw);
        idToForces[id].defendingTanks += amountToWithdraw;
        idToForces[id].deployedTanks -= amountToWithdraw;  
    }

    //called during a battle
    //how can I make sure that only the fighting contract can call this (modifier?)
    function decreaseDefendingTankCount(uint amount, uint id) public {
        idToForces[id].defendingTanks -= amount;
        idToForces[id].numberOfTanks -= amount;
    }

    //called during battle
    //also needs modifier
    function decreaseDeployedTankCount(uint amount, uint id) public {
        idToForces[id].deployedTanks -= amount;
        idToForces[id].numberOfTanks -= amount;
    }

    function buyCruiseMissiles(uint amount, uint id) public {
        require(idToOwnerForces[id] == msg.sender, "You are not the nation ruler");
        uint purchasePrice = cruiseMissileCost * amount;
        uint balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToForces[id].cruiseMissiles += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);        
    }

    function sendCruiseMissiles(uint amount, uint idSender, uint idReciever) public {
        require(idToOwnerForces[idSender] == msg.sender, "You are not the nation ruler");
        uint cruiseMissileCount = idToForces[idSender].cruiseMissiles;
        require(cruiseMissileCount >= amount, "You do not have enough cruise missiles to send");
        require(idToForces[idReciever].nationExists = true, "Destination nation does not exist");
        idToForces[idSender].cruiseMissiles -= amount;
        idToForces[idReciever].cruiseMissiles += amount;             
    }

    //called during a battle
    //how can I make sure that only the fighting contract can call this (modifier?)
    function decreaseCruiseMissileCount(uint amount, uint id) public {
        idToForces[id].cruiseMissiles -= amount;
    }

    function buyNukes(uint amount, uint id) public {
        require(idToOwnerForces[id] == msg.sender, "You are not the nation ruler");
        uint purchasePrice = nukeCost * amount;
        uint balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToForces[id].nuclearWeapons += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);        
    }

    function sendNukes(uint amount, uint idSender, uint idReciever) public {
        require(idToOwnerForces[idSender] == msg.sender, "You are not the nation ruler");
        uint nukeCount = idToForces[idSender].nuclearWeapons;
        require(nukeCount >= amount, "You do not have enough cruise missiles to send");
        require(idToForces[idReciever].nationExists = true, "Destination nation does not exist");
        idToForces[idSender].nuclearWeapons -= amount;
        idToForces[idReciever].nuclearWeapons += amount;            
    }

    //called during a battle
    //how can I make sure that only the fighting contract can call this (modifier?)
    function decreaseNukeCount(uint amount, uint id) public {
        idToForces[id].nuclearWeapons -= amount;
    }

    function buySpies(uint amount, uint id) public {
        require(idToOwnerForces[id] == msg.sender, "You are not the nation ruler");
        uint purchasePrice = spyCost * amount;
        uint balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToForces[id].numberOfSpies += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);        
    }

    //should there be a send spy function?
    function sendSpies(uint amount, uint idSender, uint idReciever) public {
        require(idToOwnerForces[idSender] == msg.sender, "You are not the nation ruler");
        uint cruiseMissileCount = idToForces[idSender].cruiseMissiles;
        require(cruiseMissileCount >= amount, "You do not have enough cruise missiles to send");
        require(idToForces[idReciever].nationExists = true, "Destination nation does not exist");
        idToForces[idSender].cruiseMissiles -= amount;
        idToForces[idReciever].cruiseMissiles += amount;             
    }

    //called during a battle
    //how can I make sure that only the fighting contract can call this (modifier?)
    function decreaseSpyCount(uint amount, uint id) public {
        idToForces[id].numberOfSpies -= amount;
    }
}