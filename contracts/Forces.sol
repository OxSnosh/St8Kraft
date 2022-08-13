//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ForcesContract is Ownable {

    uint private forcesId;
    uint public soldierCost;
    uint public tankCost;    
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
    }

    constructor (address _treasuryAddress) {
        treasuryAddress = _treasuryAddress;
        soldierCost = 100;
        tankCost = 200;
    }
    
    mapping(uint256 => Forces) public idToForces;
    mapping(uint256 => address) public idToOwnerForces;

    function generateForces() public {
        Forces memory newForces = Forces(0, 0, 0, 0, 0, 0, 0, 0, 0);
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

    function buySoldiers(uint amount, uint id) public {
        require(idToOwnerForces[id] == msg.sender, "You are not the nation ruler");
        uint purchasePrice = soldierCost * amount;
        uint balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToForces[id].numberOfSoldiers += amount;
        idToForces[id].defendingSoldiers += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);        
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
}