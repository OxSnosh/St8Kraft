//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FightersContract is Ownable {
    uint256 private fightersId;
    address public treasuryAddress;
    address public infrastructure;
    address public war;
    uint256 public yak9Cost = 10000;
    uint256 public yak9RequiredInfrastructure = 100;
    uint256 public yak9RequiredTech = 30;
    uint256 public p51MustangCost = 15000;
    uint256 public p51MustangRequiredInfrastructure = 200;
    uint256 public p51MustangRequiredTech = 65;
    uint256 public f86SabreCost = 20000;
    uint256 public f86SabreRequiredInfrastructure = 300;
    uint256 public f86SabreRequiredTech = 105;
    uint256 public mig15Cost = 25000;
    uint256 public mig15RequiredInfrastructure = 400;
    uint256 public mig15RequiredTech = 150;
    uint256 public f100SuperSabreCost = 30000;
    uint256 public f100SuperSabreRequiredInfrastructure = 500;
    uint256 public f100SuperSabreRequiredTech = 200;
    uint256 public f35LightningCost = 35000;
    uint256 public f35LightningRequiredInfrastructure = 600;
    uint256 public f35LightningRequiredTech = 255;
    uint256 public f15EagleCost = 40000;
    uint256 public f15EagleRequiredInfrastructure = 700;
    uint256 public f15EagleRequiredTech = 315;
    uint256 public su30MkiCost = 45000;
    uint256 public su30MkiRequiredInfrastructure = 850;
    uint256 public su30MkiRequiredTech = 405;
    uint256 public f22RaptorCost = 50000;
    uint256 public f22RaptorRequiredInfrastructure = 1000;
    uint256 public f22RaptorRequiredTech = 500;

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

    constructor(
        address _treasuryAddress,
        address _war,
        address _infrastructure
    ) {
        treasuryAddress = _treasuryAddress;
        infrastructure = _infrastructure;
        war = _war;
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

    function updateYak9Specs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        yak9Cost = newPrice;
        yak9RequiredInfrastructure = newInfra;
        yak9RequiredTech = newTech;
    }

    function updateP51MustangSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        p51MustangCost = newPrice;
        p51MustangRequiredInfrastructure = newInfra;
        p51MustangRequiredTech = newTech;
    }

    function updateF86SabreSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        f86SabreCost = newPrice;
        f86SabreRequiredInfrastructure = newInfra;
        f86SabreRequiredTech = newTech;
    }

    function updateMig15Specs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        mig15Cost = newPrice;
        mig15RequiredInfrastructure = newInfra;
        mig15RequiredTech = newTech;
    }

    function updateF100SuperSabreSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        f100SuperSabreCost = newPrice;
        f100SuperSabreRequiredInfrastructure = newInfra;
        f100SuperSabreRequiredTech = newTech;
    }

    function updateF35LightningSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        f35LightningCost = newPrice;
        f35LightningRequiredInfrastructure = newInfra;
        f35LightningRequiredTech = newTech;
    }

    function updateF15EagleSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        f15EagleCost = newPrice;
        f15EagleRequiredInfrastructure = newInfra;
        f15EagleRequiredTech = newTech;
    }

    function updateSU30MkiSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        su30MkiCost = newPrice;
        su30MkiRequiredInfrastructure = newInfra;
        su30MkiRequiredTech = newTech;
    }

    function updateF22RaptorSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        f22RaptorCost = newPrice;
        f22RaptorRequiredInfrastructure = newInfra;
        f22RaptorRequiredTech = newTech;
    }

    function getAircraftCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].aircraft;
        return count;
    }

    function getMaxAircraftCount(uint256 id) public view returns (uint256) {
        return 450;
    }

    //internal only
    function increaseAircraftCount(uint256 amount, uint256 id) internal {
        idToFighters[id].aircraft += amount;
    }

    //internal only
    function decreaseAircraftCount(uint256 amount, uint256 id) internal {
        idToFighters[id].aircraft -= amount;
    }

    modifier onlyWar() {
        require(
            msg.sender == war,
            "this function can only be called by battle"
        );
        _;
    }

    //callable only from war contracts
    function destroyAircraft(uint256 amount, uint256 id) internal onlyWar {
        idToFighters[id].aircraft -= amount;
    }

    function buyYak9(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= yak9RequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= yak9RequiredTech, "!enough tech");
        uint256 purchasePrice = (yak9Cost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].yak9Count += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseYak9Count(uint256 amount, uint256 id) public onlyWar {
        idToFighters[id].yak9Count -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buyP51Mustang(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= p51MustangRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= p51MustangRequiredTech, "!enough tech");
        uint256 purchasePrice = (p51MustangCost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].p51MustangCount += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseP51MustangCount(uint256 amount, uint256 id) public onlyWar {
        idToFighters[id].p51MustangCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buyF86Sabre(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= f86SabreRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= f86SabreRequiredTech, "!enough tech");
        uint256 purchasePrice = (f86SabreCost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].f86SabreCount += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseF86SabreCount(uint256 amount, uint256 id) public onlyWar {
        idToFighters[id].f86SabreCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buyMig15(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= mig15RequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= mig15RequiredTech, "!enough tech");
        uint256 purchasePrice = (mig15Cost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].mig15Count += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseMig15Count(uint256 amount, uint256 id) public onlyWar {
        idToFighters[id].mig15Count -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buyF100SuperSabre(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= f100SuperSabreRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= f100SuperSabreRequiredTech, "!enough tech");
        uint256 purchasePrice = (f100SuperSabreCost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].f100SuperSabreCount += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseF100SuperSabreCount(uint256 amount, uint256 id) public onlyWar  {
        idToFighters[id].f100SuperSabreCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buyF35Lightning(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= f35LightningRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= f35LightningRequiredTech, "!enough tech");
        uint256 purchasePrice = (f35LightningCost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].f35LightningCount += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseF35LightningCount(uint256 amount, uint256 id) public onlyWar {
        idToFighters[id].f35LightningCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buyF15Eagle(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= f15EagleRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= f15EagleRequiredTech, "!enough tech");
        uint256 purchasePrice = (f15EagleCost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].f15EagleCount += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseF15EagleCount(uint256 amount, uint256 id) public onlyWar {
        idToFighters[id].f15EagleCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buySu30Mki(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= su30MkiRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= su30MkiRequiredTech, "!enough tech");
        uint256 purchasePrice = (su30MkiCost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].su30MkiCount += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseSu30MkiCount(uint256 amount, uint256 id) public onlyWar {
        idToFighters[id].su30MkiCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function buyF22Raptor(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= f22RaptorRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= f22RaptorRequiredTech, "!enough tech");
        uint256 purchasePrice = (f22RaptorCost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToFighters[id].f22RaptorCount += amount;
        idToFighters[id].aircraft += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseF22RaptorCount(uint256 amount, uint256 id) public onlyWar {
        idToFighters[id].f22RaptorCount -= amount;
        idToFighters[id].aircraft -= amount;
    }
}
