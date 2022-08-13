//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NavyContract is Ownable {

    uint private navyId;
    address public treasuryAddress;
    uint public corvetteCost;
    uint public landingShipCost;
    uint public battleshipCost;
    uint public cruiserCost;
    uint public frigateCost;
    uint public destroyerCost;
    uint public submarineCost;
    uint public aircraftCarrierCost;

    struct Navy {
        uint256 navyVessels;
        uint256 corvetteCount;
        uint256 landingShipCount;
        uint256 battleshipCount;
        uint256 cruiserCount;
        uint256 frigateCount;
        uint256 destroyerCount;
        uint256 submarintCount;
        uint256 aircraftCarrierCount;
        bool nationExists;
    }

    mapping(uint256 => Navy) public idToNavy;
    mapping(uint256 => address) public idToOwnerNavy;

    constructor (address _treasuryAddress) {
        treasuryAddress = _treasuryAddress;
        corvetteCost = 100;
        landingShipCost = 200;
        battleshipCost = 300;
        cruiserCost = 400;
        frigateCost = 500;
        destroyerCost = 600;
        submarineCost = 700;
        aircraftCarrierCost = 800;
    }

    function generateNavy() public {
        Navy memory newNavy = Navy(0, 0, 0, 0, 0, 0, 0, 0, 0, true);
        idToNavy[navyId] = newNavy;
        idToOwnerNavy[navyId] = msg.sender;
        navyId++;
    }

    function updateCorvetteCost(uint newPrice) public onlyOwner {
        corvetteCost = newPrice;
    }

    function updateLandingShipCost(uint newPrice) public onlyOwner {
        landingShipCost = newPrice;
    }

    function updateBattleshipCost(uint newPrice) public onlyOwner {
        battleshipCost = newPrice;
    }

    function updateCruiserCost(uint newPrice) public onlyOwner {
        cruiserCost = newPrice;
    }

    function updateFrigateCost(uint newPrice) public onlyOwner {
        frigateCost = newPrice;
    }

    function updateDestroyerCost(uint newPrice) public onlyOwner {
        destroyerCost = newPrice;
    }

    function updateSubmarineCost(uint newPrice) public onlyOwner {
        submarineCost = newPrice;
    }

    function updateAircraftCarrierCost(uint newPrice) public onlyOwner {
        aircraftCarrierCost = newPrice;
    }

    function buyCorvette(uint amount, uint id) public {
        require(idToOwnerNavy[id] == msg.sender, "You are not the nation ruler");
        uint purchasePrice = corvetteCost * amount;
        uint balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].corvetteCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);        
    }

    function sendCorvette(uint amount, uint idSender, uint idReciever) public {
        require(idToOwnerNavy[idSender] == msg.sender, "You are not the nation ruler");
        require(idToNavy[idReciever].nationExists = true, "Destination nation does not exist");
        idToNavy[idSender].corvetteCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].corvetteCount += amount;
        idToNavy[idReciever].navyVessels += amount;                
    }

    //callable from fighting contract
    //needs modifier
    function decreaseCorvetteCount(uint amount, uint id) public {
        idToNavy[id].corvetteCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

    function buyLandingShip(uint amount, uint id) public {
        require(idToOwnerNavy[id] == msg.sender, "You are not the nation ruler");
        uint purchasePrice = landingShipCost * amount;
        uint balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].landingShipCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);        
    }

    function sendLandingShip(uint amount, uint idSender, uint idReciever) public {
        require(idToOwnerNavy[idSender] == msg.sender, "You are not the nation ruler");
        require(idToNavy[idReciever].nationExists = true, "Destination nation does not exist");
        idToNavy[idSender].landingShipCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].landingShipCount += amount;
        idToNavy[idReciever].navyVessels += amount;                
    }

    //callable from fighting contract
    //needs modifier
    function decreaseLandingShipCount(uint amount, uint id) public {
        idToNavy[id].landingShipCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

    function buyBattleship(uint amount, uint id) public {
        require(idToOwnerNavy[id] == msg.sender, "You are not the nation ruler");
        uint purchasePrice = battleshipCost * amount;
        uint balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].battleshipCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);        
    }

    function sendBattleship(uint amount, uint idSender, uint idReciever) public {
        require(idToOwnerNavy[idSender] == msg.sender, "You are not the nation ruler");
        require(idToNavy[idReciever].nationExists = true, "Destination nation does not exist");
        idToNavy[idSender].battleshipCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].battleshipCount += amount;
        idToNavy[idReciever].navyVessels += amount;                
    }

    //callable from fighting contract
    //needs modifier
    function decreaseBatteshipCount(uint amount, uint id) public {
        idToNavy[id].battleshipCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

    function buyCruiser(uint amount, uint id) public {
        require(idToOwnerNavy[id] == msg.sender, "You are not the nation ruler");
        uint purchasePrice = cruiserCost * amount;
        uint balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].cruiserCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);        
    }

    function sendCruiser(uint amount, uint idSender, uint idReciever) public {
        require(idToOwnerNavy[idSender] == msg.sender, "You are not the nation ruler");
        require(idToNavy[idReciever].nationExists = true, "Destination nation does not exist");
        idToNavy[idSender].cruiserCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].cruiserCount += amount;
        idToNavy[idReciever].navyVessels += amount;                
    }

    //callable from fighting contract
    //needs modifier
    function decreaseCruiserCount(uint amount, uint id) public {
        idToNavy[id].cruiserCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

    function buyFrigate(uint amount, uint id) public {
        require(idToOwnerNavy[id] == msg.sender, "You are not the nation ruler");
        uint purchasePrice = frigateCost * amount;
        uint balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].frigateCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);        
    }

    function sendFrigate(uint amount, uint idSender, uint idReciever) public {
        require(idToOwnerNavy[idSender] == msg.sender, "You are not the nation ruler");
        require(idToNavy[idReciever].nationExists = true, "Destination nation does not exist");
        idToNavy[idSender].frigateCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].frigateCount += amount;
        idToNavy[idReciever].navyVessels += amount;                
    }

    //callable from fighting contract
    //needs modifier
    function decreaseFrigateCount(uint amount, uint id) public {
        idToNavy[id].frigateCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

    function buyDestroyer(uint amount, uint id) public {
        require(idToOwnerNavy[id] == msg.sender, "You are not the nation ruler");
        uint purchasePrice = destroyerCost * amount;
        uint balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].destroyerCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);        
    }

    function sendDestroyer(uint amount, uint idSender, uint idReciever) public {
        require(idToOwnerNavy[idSender] == msg.sender, "You are not the nation ruler");
        require(idToNavy[idReciever].nationExists = true, "Destination nation does not exist");
        idToNavy[idSender].destroyerCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].destroyerCount += amount;
        idToNavy[idReciever].navyVessels += amount;                
    }

    //callable from fighting contract
    //needs modifier
    function decreaseDestroyerCount(uint amount, uint id) public {
        idToNavy[id].destroyerCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

    function buySubmarine(uint amount, uint id) public {
        require(idToOwnerNavy[id] == msg.sender, "You are not the nation ruler");
        uint purchasePrice = submarineCost * amount;
        uint balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].submarintCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);        
    }

    function sendSubmarine(uint amount, uint idSender, uint idReciever) public {
        require(idToOwnerNavy[idSender] == msg.sender, "You are not the nation ruler");
        require(idToNavy[idReciever].nationExists = true, "Destination nation does not exist");
        idToNavy[idSender].submarintCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].submarintCount += amount;
        idToNavy[idReciever].navyVessels += amount;                
    }

    //callable from fighting contract
    //needs modifier
    function decreaseSubmarineCount(uint amount, uint id) public {
        idToNavy[id].submarintCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

    function buyAircraftCarrier(uint amount, uint id) public {
        require(idToOwnerNavy[id] == msg.sender, "You are not the nation ruler");
        uint purchasePrice = aircraftCarrierCost * amount;
        uint balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].aircraftCarrierCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);        
    }

    function sendAircraftCarrier(uint amount, uint idSender, uint idReciever) public {
        require(idToOwnerNavy[idSender] == msg.sender, "You are not the nation ruler");
        require(idToNavy[idReciever].nationExists = true, "Destination nation does not exist");
        idToNavy[idSender].aircraftCarrierCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].aircraftCarrierCount += amount;
        idToNavy[idReciever].navyVessels += amount;                
    }

    //callable from fighting contract
    //needs modifier
    function decreaseAircraftCarrierCount(uint amount, uint id) public {
        idToNavy[id].aircraftCarrierCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

}