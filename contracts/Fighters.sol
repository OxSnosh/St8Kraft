//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FightersContract is Ownable {
    uint256 private fightersId;
    address public treasuryAddress;
    uint256 public yak9Cost;
    uint256 public p51MustangCost;
    uint256 public f86SabreCost;
    uint256 public mig15Cost;
    uint256 public f100SuperSabreCost;
    uint256 public f35LightningCost;
    uint256 public f15EagleCost;
    uint256 public su30MkiCost;
    uint256 public f22RaptorCost;

    struct Fighters {
        uint256 aircraft;
        uint256 yak9Count;
        uint256 p51MustangCount;
        uint256 f86SabreCount;
        uint256 mig15Count;
        uint256 f100SuperSabreCount;
        uint256 f35LightningCount;
        uint256 f15EagleCount;
        uint256 su30MkiCount;
        uint256 f22RaptorCount;
        bool nationExists;
    }

    mapping(uint256 => Fighters) public idToFighters;
    mapping(uint256 => address) public idToOwnerFighters;

    constructor(address _treasuryAddress) {
        treasuryAddress = _treasuryAddress;
        yak9Cost = 100;
        p51MustangCost = 200;
        f86SabreCost = 300;
        mig15Cost = 400;
        f100SuperSabreCost = 500;
        f35LightningCost = 600;
        f15EagleCost = 700;
        su30MkiCost = 800;
        f22RaptorCost = 900;
    }

    function generateFighters() public {
        Fighters memory newFighters = Fighters(
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            true
        );
        idToFighters[fightersId] = newFighters;
        idToOwnerFighters[fightersId] = msg.sender;
        fightersId++;
    }

    function updateYak9Cost(uint256 newPrice) public onlyOwner {
        yak9Cost = newPrice;
    }

    function updateP51MustangCost(uint256 newPrice) public onlyOwner {
        p51MustangCost = newPrice;
    }

    function updateF86SabreCost(uint256 newPrice) public onlyOwner {
        f86SabreCost = newPrice;
    }

    function updateMig15Cost(uint256 newPrice) public onlyOwner {
        mig15Cost = newPrice;
    }

    function updateF100SuperSabreCost(uint256 newPrice) public onlyOwner {
        f100SuperSabreCost = newPrice;
    }

    function updateF35LightningCost(uint256 newPrice) public onlyOwner {
        f35LightningCost = newPrice;
    }

    function updateF15EagleCost(uint256 newPrice) public onlyOwner {
        f15EagleCost = newPrice;
    }

    function updateSU30MkiCost(uint256 newPrice) public onlyOwner {
        su30MkiCost = newPrice;
    }

    function updateF22RaptorCost(uint256 newPrice) public onlyOwner {
        f22RaptorCost = newPrice;
    }

    function getAircraftCount(uint256 id) public view returns (uint256 count) {
        uint256 aircraftAmount = idToFighters[id].aircraft;
        return aircraftAmount;
    }

    //needs modifier
    function increaseAircraftCount(uint256 amount, uint256 id) public {
        idToFighters[id].aircraft += amount;
    }

    //needs modifier
    function decreaseAircraftCount(uint256 amount, uint256 id) public {
        idToFighters[id].aircraft -= amount;
    }

    function buyYak9(uint256 amount, uint256 id) public {
        require(
            idToOwnerFighters[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = yak9Cost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].yak9Count += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendYak9(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerFighters[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToFighters[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToFighters[idSender].yak9Count -= amount;
        idToFighters[idSender].aircraft -= amount;
        idToFighters[idReciever].yak9Count += amount;
        idToFighters[idReciever].aircraft += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseYak9Count(uint256 amount, uint256 id) public {
        idToFighters[id].yak9Count -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buyP51Mustang(uint256 amount, uint256 id) public {
        require(
            idToOwnerFighters[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = p51MustangCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].p51MustangCount += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendP51Mustang(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerFighters[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToFighters[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToFighters[idSender].p51MustangCount -= amount;
        idToFighters[idSender].aircraft -= amount;
        idToFighters[idReciever].p51MustangCount += amount;
        idToFighters[idReciever].aircraft += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseP51MustangCount(uint256 amount, uint256 id) public {
        idToFighters[id].p51MustangCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buyF86Sabre(uint256 amount, uint256 id) public {
        require(
            idToOwnerFighters[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = f86SabreCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].f86SabreCount += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendF86Sabre(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerFighters[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToFighters[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToFighters[idSender].f86SabreCount -= amount;
        idToFighters[idSender].aircraft -= amount;
        idToFighters[idReciever].f86SabreCount += amount;
        idToFighters[idReciever].aircraft += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseF86SabreCount(uint256 amount, uint256 id) public {
        idToFighters[id].f86SabreCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buyMig15(uint256 amount, uint256 id) public {
        require(
            idToOwnerFighters[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = mig15Cost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].mig15Count += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendMig15(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerFighters[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToFighters[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToFighters[idSender].mig15Count -= amount;
        idToFighters[idSender].aircraft -= amount;
        idToFighters[idReciever].mig15Count += amount;
        idToFighters[idReciever].aircraft += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseMig15Count(uint256 amount, uint256 id) public {
        idToFighters[id].mig15Count -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buyF100SuperSabre(uint256 amount, uint256 id) public {
        require(
            idToOwnerFighters[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = f100SuperSabreCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].f100SuperSabreCount += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendF100SuperSabre(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerFighters[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToFighters[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToFighters[idSender].f100SuperSabreCount -= amount;
        idToFighters[idSender].aircraft -= amount;
        idToFighters[idReciever].f100SuperSabreCount += amount;
        idToFighters[idReciever].aircraft += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseF100SuperSabreCount(uint256 amount, uint256 id) public {
        idToFighters[id].f100SuperSabreCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buyF35Lightning(uint256 amount, uint256 id) public {
        require(
            idToOwnerFighters[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = f35LightningCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].f35LightningCount += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendF35Lightning(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerFighters[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToFighters[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToFighters[idSender].f35LightningCount -= amount;
        idToFighters[idSender].aircraft -= amount;
        idToFighters[idReciever].f35LightningCount += amount;
        idToFighters[idReciever].aircraft += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseF35LightningCount(uint256 amount, uint256 id) public {
        idToFighters[id].f35LightningCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buyF15Eagle(uint256 amount, uint256 id) public {
        require(
            idToOwnerFighters[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = f15EagleCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].f15EagleCount += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendF15Eagle(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerFighters[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToFighters[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToFighters[idSender].f15EagleCount -= amount;
        idToFighters[idSender].aircraft -= amount;
        idToFighters[idReciever].f15EagleCount += amount;
        idToFighters[idReciever].aircraft += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseF15EagleCount(uint256 amount, uint256 id) public {
        idToFighters[id].f15EagleCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buySu30Mki(uint256 amount, uint256 id) public {
        require(
            idToOwnerFighters[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = su30MkiCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].su30MkiCount += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendSu30Mki(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerFighters[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToFighters[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToFighters[idSender].su30MkiCount -= amount;
        idToFighters[idSender].aircraft -= amount;
        idToFighters[idReciever].su30MkiCount += amount;
        idToFighters[idReciever].aircraft += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseSu30MkiCount(uint256 amount, uint256 id) public {
        idToFighters[id].su30MkiCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buyF22Raptor(uint256 amount, uint256 id) public {
        require(
            idToOwnerFighters[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = f22RaptorCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].f22RaptorCount += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendF22Raptor(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerFighters[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToFighters[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToFighters[idSender].f22RaptorCount -= amount;
        idToFighters[idSender].aircraft -= amount;
        idToFighters[idReciever].f22RaptorCount += amount;
        idToFighters[idReciever].aircraft += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseF22RaptorCount(uint256 amount, uint256 id) public {
        idToFighters[id].f22RaptorCount -= amount;
        idToFighters[id].aircraft -= amount;
    }
}
