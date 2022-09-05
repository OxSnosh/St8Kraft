//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "./Fighters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BombersContract is Ownable {
    uint256 private bombersId;
    address public fighters;
    address public treasury;
    address public infrastructure;
    address public war;
    uint256 public ah1CobraCost = 10000;
    uint256 public ah1CobraRequiredInfrastructure = 100;
    uint256 public ah1CobraRequiredTech = 30;
    uint256 public ah64ApacheCost = 15000;
    uint256 public ah64ApacheRequiredInfrastructure = 200;
    uint256 public ah64ApacheRequiredTech = 65;
    uint256 public bristolBlenheimCost = 20000;
    uint256 public bristolBlenheimRequiredInfrastructure = 300;
    uint256 public bristolBlenheimRequiredTech = 105;
    uint256 public b52MitchellCost = 25000;
    uint256 public b52MitchellRequiredInfrastructure = 400;
    uint256 public b52MitchellRequiredTech = 150;
    uint256 public b17gFlyingFortressCost = 30000;
    uint256 public b17gFlyingFortressRequiredInfrastructure = 500;
    uint256 public b17gFlyingFortressRequiredTech = 200;
    uint256 public b52StratofortressCost = 35000;
    uint256 public b52StratofortressRequiredInfrastructure = 600;
    uint256 public b52StratofortressRequiredTech = 255;
    uint256 public b2SpiritCost = 40000;
    uint256 public b2SpiritRequiredInfrastructure = 700;
    uint256 public b2SpiritRequiredTech = 315;
    uint256 public b1bLancerCost = 45000;
    uint256 public b1bLancerRequiredInfrastructure = 850;
    uint256 public b1bLancerRequiredTech = 405;
    uint256 public tupolevTu160Cost = 50000;
    uint256 public tupolevTu160RequiredInfrastructure = 1000;
    uint256 public tupolevTu160RequiredTech = 500;

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

    constructor(
        address _treasuryAddress,
        address _fightersAddress,
        address _infrastructure,
        address _war
    ) {
        treasuryAddress = _treasuryAddress;
        fightersAddress = _fightersAddress;
        infrastructure = _infrastructure;
        war = _war;
    }

    function generateBombers() public {
        Bombers memory newBombers = Bombers(0, 0, 0, 0, 0, 0, 0, 0, 0, true);
        idToBombers[bombersId] = newBombers;
        idToOwnerBombers[bombersId] = msg.sender;
        bombersId++;
    }

    function updateAh1CobraSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        ah1CobraCost = newPrice;
        ah1CobraRequiredInfrastructure = newInfra;
        ah1CobraRequiredTech = newTech;
    }

    function updateAh64ApacheSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        ah64ApacheCost = newPrice;
        ah64ApacheRequiredInfrastructure = newInfra;
        ah64ApacheRequiredTech = newTech;
    }

    function updateBristolBlenheimSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        bristolBlenheimCost = newPrice;
        bristolBlenheimRequiredInfrastructure = newInfra;
        bristolBlenheimRequiredTech = newTech;
    }

    function updateB52MitchellSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        b52MitchellCost = newPrice;
        b52MitchellRequiredInfrastructure = newInfra;
        b52MitchellRequiredTech = newTech;
    }

    function updateB17gFlyingFortressSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        b17gFlyingFortressCost = newPrice;
        b17gFlyingFortressRequiredInfrastructure = newInfra;
        b17gFlyingFortressRequiredTech = newTech;
    }

    function updateB52StratofortressSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        b52StratofortressCost = newPrice;
        b52StratofortressRequiredInfrastructure = newInfra;
        b52StratofortressRequiredTech = newTech;
    }

    function updateb2SpiritSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        b2SpiritCost = newPrice;
        b2SpiritRequiredInfrastructure = newInfra;
        b2SpiritRequiredTech = newTech;
    }

    function updateB1bLancerSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        b1bLancerCost = newPrice;
        b1bLancerRequiredInfrastructure = newInfra;
        b1bLancerRequiredTech = newTech;
    }

    function updateTupolevTu160Specs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        tupolevTu160Cost = newPrice;
        tupolevTu160RequiredInfrastructure = newInfra;
        tupolevTu160RequiredTech = newTech;
    }

    modifier onlyWar() {
        require(
            msg.sender == war,
            "this function can only be called by battle"
        );
        _;
    }

    function buyAh1Cobra(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= ah1CobraRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= ah1CobraRequiredTech, "!enough tech");
        uint256 purchasePrice = (ah1CobraCost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].ah1CobraCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseAh1CobraCount(uint256 amount, uint256 id) public onlyWar {
        uint256 currentAmount = idToBombers[id].ah1CobraCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].ah1CobraCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function scrapAh1Cobra(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].ah1CobraCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].ah1CobraCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyAh64Apache(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= ah64ApacheRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= ah64ApacheRequiredTech, "!enough tech");
        uint256 purchasePrice = (ah64ApacheCost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].ah64ApacheCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseAh64ApacheCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToBombers[id].ah64ApacheCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].ah64ApacheCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function scrapAh64Apache(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].ah64ApacheCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].ah64ApacheCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyBristolBlenheim(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= bristolBlenheimRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= bristolBlenheimRequiredTech, "!enough tech");
        uint256 purchasePrice = (bristolBlenheimCost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].bristolBlenheimCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseBristolBlenheimCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToBombers[id].bristolBlenheimCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].bristolBlenheimCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function scrapBristolBlenheim(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].bristolBlenheimCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].bristolBlenheimCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyB52Mitchell(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= b52MitchellRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= b52MitchellRequiredTech, "!enough tech");
        uint256 purchasePrice = (b52MitchellCost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].b52MitchellCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseB52MitchellCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToBombers[id].b52MitchellCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b52MitchellCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function scrapB52Mitchell(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].b52MitchellCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b52MitchellCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyB17gFlyingFortress(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= b17gFlyingFortressRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= b17gFlyingFortressRequiredTech, "!enough tech");
        uint256 purchasePrice = (b17gFlyingFortressCost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].b17gFlyingFortressCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseB17gFlyingFortressCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToBombers[id].b17gFlyingFortressCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b17gFlyingFortressCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function scrapB17gFlyingFortress(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].b17gFlyingFortressCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b17gFlyingFortressCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyB52Stratofortress(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= b52StratofortressRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= b52StratofortressRequiredTech, "!enough tech");
        uint256 purchasePrice = (b52StratofortressCost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].b52StratofortressCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseB52StratofortressCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToBombers[id].b52StratofortressCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b52StratofortressCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function scrapB52Stratofortress(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].b52StratofortressCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b52StratofortressCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyB2Spirit(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= b2SpiritRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= b2SpiritRequiredTech, "!enough tech");
        uint256 purchasePrice = (b2SpiritCost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].b2SpiritCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseB2SpiritCount(uint256 amount, uint256 id) public onlyWar {
        uint256 currentAmount = idToBombers[id].b2SpiritCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b2SpiritCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function scrapB2Spirit(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].b2SpiritCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b2SpiritCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyB1bLancer(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= b1bLancerRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= b1bLancerRequiredTech, "!enough tech");
        uint256 purchasePrice = (b1bLancerCost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].b1bLancerCount += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseB1bLancerCount(uint256 amount, uint256 id) public onlyWar {
        uint256 currentAmount = idToBombers[id].b1bLancerCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b1bLancerCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function scrapB1bLancer(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].b1bLancerCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b1bLancerCount -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function buyTupolevTu160(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = idToFighters[id].aircraft;
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= tupolevTu160Infrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= tupolevTu160RequiredTech, "!enough tech");
        uint256 purchasePrice = (tupolevTu160Cost * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToBombers[id].tupolevTu160Count += amount;
        FightersContract(fightersAddress).increaseAircraftCount(amount, id);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function decreaseTupolevTu160Count(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToBombers[id].tupolevTu160Count;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].tupolevTu160Count -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }

    function scrapTupolevTu160(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].tupolevTu160Count;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].tupolevTu160Count -= amount;
        FightersContract(fightersAddress).decreaseAircraftCount(amount, id);
    }
}
