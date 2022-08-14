//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "./Fighters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BombersContract is Ownable {
    uint256 private bombersId;
    address public treasuryAddress;
    address public fightersAddress;
    uint256 public ah1CobraCost;
    uint256 public ah64ApacheCost;
    uint256 public bristolBlenheimCost;
    uint256 public b52MitchellCost;
    uint256 public b17gFlyingFortressCost;
    uint256 public b52StratofortressCost;
    uint256 public b2SpiritCost;
    uint256 public b1bLancerCost;
    uint256 public tupolevTu160Cost;

    struct Bombers {
        uint256 ah1CobraCount;
        uint256 ah64ApacheCount;
        uint256 bristolBlenheimCount;
        uint256 b52MitchellCount;
        uint256 b17gFlyingFortressCount;
        uint256 b52StratofortressCount;
        uint256 b2SpiritCount;
        uint256 b1bLancerCount;
        uint256 tupolevTu160Count;
        bool nationExists;
    }

    mapping(uint256 => Bombers) public idToBombers;
    mapping(uint256 => address) public idToOwnerBombers;

    constructor(address _treasuryAddress, address _fightersAddress) {
        treasuryAddress = _treasuryAddress;
        fightersAddress = _fightersAddress;
        ah1CobraCost = 100;
        ah64ApacheCost = 200;
        bristolBlenheimCost = 300;
        b52MitchellCost = 400;
        b17gFlyingFortressCost = 500;
        b52StratofortressCost = 600;
        b2SpiritCost = 700;
        b1bLancerCost = 800;
        tupolevTu160Cost = 900;
    }

    function generateBombers() public {
        Bombers memory newBombers = Bombers(0, 0, 0, 0, 0, 0, 0, 0, 0, true);
        idToBombers[bombersId] = newBombers;
        idToOwnerBombers[bombersId] = msg.sender;
        bombersId++;
    }

    function updateAh1CobraCost(uint256 newPrice) public onlyOwner {
        ah1CobraCost = newPrice;
    }

    function updateAh64ApacheCost(uint256 newPrice) public onlyOwner {
        ah64ApacheCost = newPrice;
    }

    function updateBristolBlenheimCost(uint256 newPrice) public onlyOwner {
        bristolBlenheimCost = newPrice;
    }

    function updateB52MitchellCost(uint256 newPrice) public onlyOwner {
        b52MitchellCost = newPrice;
    }

    function updateB17gFlyingFortressCost(uint256 newPrice) public onlyOwner {
        b17gFlyingFortressCost = newPrice;
    }

    function updateB52StratofortressCost(uint256 newPrice) public onlyOwner {
        b52StratofortressCost = newPrice;
    }

    function updateb2SpiritCost(uint256 newPrice) public onlyOwner {
        b2SpiritCost = newPrice;
    }

    function updateB1bLancerCost(uint256 newPrice) public onlyOwner {
        b1bLancerCost = newPrice;
    }

    function updateTupolevTu160Cost(uint256 newPrice) public onlyOwner {
        tupolevTu160Cost = newPrice;
    }

    function buyAh1Cobra(uint256 amount, uint256 id) public {
        require(
            idToOwnerBombers[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = ah1CobraCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].ah1CobraCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendAh1Cobra(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerBombers[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToBombers[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToBombers[idSender].ah1CobraCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, idSender);
        idToBombers[idReciever].ah1CobraCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, idReciever);
    }

    //callable from fighting contract
    //needs modifier
    function decreaseAh1CobraCount(uint256 amount, uint256 id) public {
        idToBombers[id].ah1CobraCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyAh64Apache(uint256 amount, uint256 id) public {
        require(
            idToOwnerBombers[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = ah64ApacheCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].ah64ApacheCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendAh64Apache(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerBombers[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToBombers[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToBombers[idSender].ah64ApacheCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, idSender);
        idToBombers[idReciever].ah64ApacheCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, idReciever);
    }

    //callable from fighting contract
    //needs modifier
    function decreaseAh64ApacheCount(uint256 amount, uint256 id) public {
        idToBombers[id].ah64ApacheCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyBristolBlenheim(uint256 amount, uint256 id) public {
        require(
            idToOwnerBombers[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = bristolBlenheimCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].bristolBlenheimCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendBristolBlenheim(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerBombers[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToBombers[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToBombers[idSender].bristolBlenheimCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, idSender);
        idToBombers[idReciever].bristolBlenheimCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, idReciever);
    }

    //callable from fighting contract
    //needs modifier
    function decreaseBristolBlenheimCount(uint256 amount, uint256 id) public {
        idToBombers[id].bristolBlenheimCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyB52Mitchell(uint256 amount, uint256 id) public {
        require(
            idToOwnerBombers[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = b52MitchellCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].b52MitchellCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendB52Mitchell(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerBombers[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToBombers[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToBombers[idSender].b52MitchellCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, idSender);
        idToBombers[idReciever].b52MitchellCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, idReciever);
    }

    //callable from fighting contract
    //needs modifier
    function decreaseB52MitchellCount(uint256 amount, uint256 id) public {
        idToBombers[id].b52MitchellCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyB17gFlyingFortress(uint256 amount, uint256 id) public {
        require(
            idToOwnerBombers[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = b17gFlyingFortressCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].b17gFlyingFortressCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendB17gFlyingFortress(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerBombers[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToBombers[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToBombers[idSender].b17gFlyingFortressCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, idSender);
        idToBombers[idReciever].b17gFlyingFortressCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, idReciever);
    }

    //callable from fighting contract
    //needs modifier
    function decreaseB17gFlyingFortress(uint256 amount, uint256 id) public {
        idToBombers[id].b17gFlyingFortressCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyB52Stratofortress(uint256 amount, uint256 id) public {
        require(
            idToOwnerBombers[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = b52StratofortressCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].b52StratofortressCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendB52Stratofortress(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerBombers[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToBombers[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToBombers[idSender].b52StratofortressCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, idSender);
        idToBombers[idReciever].b52StratofortressCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, idReciever);
    }

    //callable from fighting contract
    //needs modifier
    function decreaseB52StratofortressCount(uint256 amount, uint256 id) public {
        idToBombers[id].b52StratofortressCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyb2Spirit(uint256 amount, uint256 id) public {
        require(
            idToOwnerBombers[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = b2SpiritCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].b2SpiritCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendb2Spirit(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerBombers[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToBombers[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToBombers[idSender].b2SpiritCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, idSender);
        idToBombers[idReciever].b2SpiritCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, idReciever);
    }

    //callable from fighting contract
    //needs modifier
    function decreaseb2SpiritCount(uint256 amount, uint256 id) public {
        idToBombers[id].b2SpiritCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyB1bLancer(uint256 amount, uint256 id) public {
        require(
            idToOwnerBombers[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = b1bLancerCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].b1bLancerCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendB1bLancer(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerBombers[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToBombers[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToBombers[idSender].b1bLancerCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, idSender);
        idToBombers[idReciever].b1bLancerCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, idReciever);
    }

    //callable from fighting contract
    //needs modifier
    function decreaseB1bLancerCount(uint256 amount, uint256 id) public {
        idToBombers[id].b1bLancerCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyTupolevTu160(uint256 amount, uint256 id) public {
        require(
            idToOwnerBombers[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = tupolevTu160Cost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].tupolevTu160Count += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendTupolevTu160(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerBombers[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToBombers[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToBombers[idSender].tupolevTu160Count -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, idSender);
        idToBombers[idReciever].tupolevTu160Count += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, idReciever);
    }

    //callable from fighting contract
    //needs modifier
    function decreaseTupolevTu160Count(uint256 amount, uint256 id) public {
        idToBombers[id].tupolevTu160Count -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }
}
