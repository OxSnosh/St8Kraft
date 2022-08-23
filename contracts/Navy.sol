//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NavyContract is Ownable {
    uint256 private navyId;
    address public treasuryAddress;
    uint256 public corvetteCost;
    uint256 public landingShipCost;
    uint256 public battleshipCost;
    uint256 public cruiserCost;
    uint256 public frigateCost;
    uint256 public destroyerCost;
    uint256 public submarineCost;
    uint256 public aircraftCarrierCost;

    struct Navy {
        uint256 navyVessels;
        uint256 corvetteCount;
        uint256 landingShipCount;
        uint256 battleshipCount;
        uint256 cruiserCount;
        uint256 frigateCount;
        uint256 destroyerCount;
        uint256 submarineCount;
        uint256 aircraftCarrierCount;
        bool nationExists;
    }

    mapping(uint256 => Navy) public idToNavy;
    mapping(uint256 => address) public idToOwnerNavy;

    constructor(address _treasuryAddress) {
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

    function updateCorvetteCost(uint256 newPrice) public onlyOwner {
        corvetteCost = newPrice;
    }

    function updateLandingShipCost(uint256 newPrice) public onlyOwner {
        landingShipCost = newPrice;
    }

    function updateBattleshipCost(uint256 newPrice) public onlyOwner {
        battleshipCost = newPrice;
    }

    function updateCruiserCost(uint256 newPrice) public onlyOwner {
        cruiserCost = newPrice;
    }

    function updateFrigateCost(uint256 newPrice) public onlyOwner {
        frigateCost = newPrice;
    }

    function updateDestroyerCost(uint256 newPrice) public onlyOwner {
        destroyerCost = newPrice;
    }

    function updateSubmarineCost(uint256 newPrice) public onlyOwner {
        submarineCost = newPrice;
    }

    function updateAircraftCarrierCost(uint256 newPrice) public onlyOwner {
        aircraftCarrierCost = newPrice;
    }

    function getVesselCountForDrydock(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 corvetteAmount = idToNavy[countryId].corvetteCount;
        uint256 battleshipAmount = idToNavy[countryId].battleshipCount;
        uint256 cruiserAmount = idToNavy[countryId].cruiserCount;
        uint256 destroyerAmount = idToNavy[countryId].destroyerCount;
        uint256 shipCount = (corvetteAmount +
            battleshipAmount +
            cruiserAmount +
            destroyerAmount);
        return shipCount;
    }

    function getVesselCountForShipyard(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 landingShipAmount = idToNavy[countryId].landingShipCount;
        uint256 frigateAmount = idToNavy[countryId].frigateCount;
        uint256 submarineAmount = idToNavy[countryId].submarineCount;
        uint256 aircraftCarrierAmount = idToNavy[countryId].aircraftCarrierCount;
        uint256 shipCount = (landingShipAmount +
            frigateAmount +
            submarineAmount +
            aircraftCarrierAmount);
        return shipCount;
    }



    function buyCorvette(uint256 amount, uint256 id) public {
        require(
            idToOwnerNavy[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = corvetteCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].corvetteCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendCorvette(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerNavy[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToNavy[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToNavy[idSender].corvetteCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].corvetteCount += amount;
        idToNavy[idReciever].navyVessels += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseCorvetteCount(uint256 amount, uint256 id) public {
        idToNavy[id].corvetteCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

    function buyLandingShip(uint256 amount, uint256 id) public {
        require(
            idToOwnerNavy[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = landingShipCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].landingShipCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendLandingShip(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerNavy[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToNavy[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToNavy[idSender].landingShipCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].landingShipCount += amount;
        idToNavy[idReciever].navyVessels += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseLandingShipCount(uint256 amount, uint256 id) public {
        idToNavy[id].landingShipCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

    function buyBattleship(uint256 amount, uint256 id) public {
        require(
            idToOwnerNavy[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = battleshipCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].battleshipCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendBattleship(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerNavy[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToNavy[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToNavy[idSender].battleshipCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].battleshipCount += amount;
        idToNavy[idReciever].navyVessels += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseBatteshipCount(uint256 amount, uint256 id) public {
        idToNavy[id].battleshipCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

    function buyCruiser(uint256 amount, uint256 id) public {
        require(
            idToOwnerNavy[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = cruiserCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].cruiserCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendCruiser(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerNavy[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToNavy[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToNavy[idSender].cruiserCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].cruiserCount += amount;
        idToNavy[idReciever].navyVessels += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseCruiserCount(uint256 amount, uint256 id) public {
        idToNavy[id].cruiserCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

    function buyFrigate(uint256 amount, uint256 id) public {
        require(
            idToOwnerNavy[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = frigateCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].frigateCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendFrigate(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerNavy[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToNavy[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToNavy[idSender].frigateCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].frigateCount += amount;
        idToNavy[idReciever].navyVessels += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseFrigateCount(uint256 amount, uint256 id) public {
        idToNavy[id].frigateCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

    function buyDestroyer(uint256 amount, uint256 id) public {
        require(
            idToOwnerNavy[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = destroyerCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].destroyerCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendDestroyer(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerNavy[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToNavy[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToNavy[idSender].destroyerCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].destroyerCount += amount;
        idToNavy[idReciever].navyVessels += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseDestroyerCount(uint256 amount, uint256 id) public {
        idToNavy[id].destroyerCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

    function buySubmarine(uint256 amount, uint256 id) public {
        require(
            idToOwnerNavy[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = submarineCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].submarineCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendSubmarine(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerNavy[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToNavy[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToNavy[idSender].submarineCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].submarineCount += amount;
        idToNavy[idReciever].navyVessels += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseSubmarineCount(uint256 amount, uint256 id) public {
        idToNavy[id].submarineCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

    function buyAircraftCarrier(uint256 amount, uint256 id) public {
        require(
            idToOwnerNavy[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = aircraftCarrierCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].aircraftCarrierCount += amount;
        idToNavy[id].navyVessels += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function sendAircraftCarrier(
        uint256 amount,
        uint256 idSender,
        uint256 idReciever
    ) public {
        require(
            idToOwnerNavy[idSender] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            idToNavy[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToNavy[idSender].aircraftCarrierCount -= amount;
        idToNavy[idSender].navyVessels -= amount;
        idToNavy[idReciever].aircraftCarrierCount += amount;
        idToNavy[idReciever].navyVessels += amount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseAircraftCarrierCount(uint256 amount, uint256 id) public {
        idToNavy[id].aircraftCarrierCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }
}
