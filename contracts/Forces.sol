//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./IWarBucks.sol";
import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ForcesContract is Ownable {

    uint private forcesId;
    uint public soldierCost;
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

    function buySoldiers(uint amount, uint id) public {
        require(idToOwnerForces[id] == msg.sender, "You are not the nation ruler");
        uint purchasePrice = soldierCost * amount;
        uint balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToForces[id].numberOfSoldiers += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);        
    }
}