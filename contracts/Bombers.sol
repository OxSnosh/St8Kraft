//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "./Infrastructure.sol";
import "./Fighters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BombersContract is Ownable {
    address public countryMinter;
    address public bombersMarket;
    address public fighters;
    address public treasury;
    address public infrastructure;
    address public war;

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
    }

    mapping(uint256 => Bombers) public idToBombers;
    mapping(uint256 => address) public idToOwnerBombers;

    constructor(
        address _countryMinter,
        address _bombersMarket,
        address _treasuryAddress,
        address _fightersAddress,
        address _infrastructure,
        address _war
    ) {
        countryMinter = _countryMinter;
        bombersMarket = _bombersMarket;
        treasury = _treasuryAddress;
        fighters = _fightersAddress;
        infrastructure = _infrastructure;
        war = _war;
    }

    modifier onlyCountryMinter() {
        require(msg.sender == countryMinter, "only countryMinter can call");
        _;
    }

    modifier onlyWar() {
        require(
            msg.sender == war,
            "this function can only be called by battle"
        );
        _;
    }

    modifier onlyMarket() {
        require(
            msg.sender == bombersMarket,
            "this function can only be called by market"
        );
        _;
    }

    function updateCountryMinterAddress(address _countryMinter) public onlyOwner {
        countryMinter = _countryMinter;
    }

    function updateBombersMarketAddress(address _bombersMarket) public onlyOwner {
        bombersMarket = _bombersMarket;
    }

    function updateFightersAddress(address _fighters) public onlyOwner {
        fighters = _fighters;
    }

    function updateTreasuryAddress(address _treasury) public onlyOwner {
        treasury = _treasury;
    }

    function updateInfrastructureAddress(address _infrastructure) public onlyOwner {
        infrastructure = _infrastructure;
    }

    function updateWarAddress(address _war) public onlyOwner {
        war = _war;
    }

    function generateBombers(uint256 id, address nationOwner)
        public
        onlyCountryMinter
    {
        Bombers memory newBombers = Bombers(0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToBombers[id] = newBombers;
        idToOwnerBombers[id] = nationOwner;
    }

    function getAh1CobraCount(uint256 id) public view returns (uint256) {
        uint256 count = idToBombers[id].ah1CobraCount;
        return count;
    }

    function increaseAh1CobraCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToBombers[id].ah1CobraCount += amount;
    }

    function decreaseAh1CobraCount(uint256 amount, uint256 id) public onlyWar {
        uint256 currentAmount = idToBombers[id].ah1CobraCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToBombers[id].ah1CobraCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function scrapAh1Cobra(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].ah1CobraCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].ah1CobraCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function getAh64ApacheCount(uint256 id) public view returns (uint256) {
        uint256 count = idToBombers[id].ah64ApacheCount;
        return count;
    }

    function increaseAh64ApacheCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToBombers[id].ah64ApacheCount += amount;
    }

    function decreaseAh64ApacheCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToBombers[id].ah64ApacheCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].ah64ApacheCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function scrapAh64Apache(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].ah64ApacheCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].ah64ApacheCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function getBristolBlenheimCount(uint256 id) public view returns (uint256) {
        uint256 count = idToBombers[id].bristolBlenheimCount;
        return count;
    }

    function increaseBristolBlenheimCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToBombers[id].bristolBlenheimCount += amount;
    }

    function decreaseBristolBlenheimCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToBombers[id].bristolBlenheimCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].bristolBlenheimCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function scrapBristolBlenheim(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].bristolBlenheimCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].bristolBlenheimCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function getB52MitchellCount(uint256 id) public view returns (uint256) {
        uint256 count = idToBombers[id].b52MitchellCount;
        return count;
    }

    function increaseB52MitchellCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToBombers[id].b52MitchellCount += amount;
    }

    function decreaseB52MitchellCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToBombers[id].b52MitchellCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b52MitchellCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function scrapB52Mitchell(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].b52MitchellCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b52MitchellCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function getB17gFlyingFortressCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToBombers[id].b17gFlyingFortressCount;
        return count;
    }

    function increaseB17gFlyingFortressCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToBombers[id].b17gFlyingFortressCount += amount;
    }

    function decreaseB17gFlyingFortressCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToBombers[id].b17gFlyingFortressCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b17gFlyingFortressCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function scrapB17gFlyingFortress(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].b17gFlyingFortressCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b17gFlyingFortressCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function getB52StratofortressCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToBombers[id].b52StratofortressCount;
        return count;
    }

    function increaseB52StratofortressCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToBombers[id].b52StratofortressCount += amount;
    }

    function decreaseB52StratofortressCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToBombers[id].b52StratofortressCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b52StratofortressCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function scrapB52Stratofortress(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].b52StratofortressCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b52StratofortressCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function getB2SpiritCount(uint256 id) public view returns (uint256) {
        uint256 count = idToBombers[id].b2SpiritCount;
        return count;
    }

    function increaseB2SpiritCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToBombers[id].b2SpiritCount += amount;
    }

    function decreaseB2SpiritCount(uint256 amount, uint256 id) public onlyWar {
        uint256 currentAmount = idToBombers[id].b2SpiritCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b2SpiritCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function scrapB2Spirit(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].b2SpiritCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b2SpiritCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function getB1bLancer(uint256 id) public view returns (uint256) {
        uint256 count = idToBombers[id].b1bLancerCount;
        return count;
    }

    function increaseB1bLancerCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToBombers[id].b1bLancerCount += amount;
    }

    function decreaseB1bLancerCount(uint256 amount, uint256 id) public onlyWar {
        uint256 currentAmount = idToBombers[id].b1bLancerCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b1bLancerCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function scrapB1bLancer(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].b1bLancerCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].b1bLancerCount -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function getTupolevTu160(uint256 id) public view returns (uint256) {
        uint256 count = idToBombers[id].tupolevTu160Count;
        return count;
    }

    function increaseTupolevTu160Count(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToBombers[id].tupolevTu160Count += amount;
    }

    function decreaseTupolevTu160Count(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToBombers[id].tupolevTu160Count;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].tupolevTu160Count -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }

    function scrapTupolevTu160(uint256 amount, uint256 id) public {
        require(idToOwnerBombers[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToBombers[id].tupolevTu160Count;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToBombers[id].tupolevTu160Count -= amount;
        FightersContract(fighters).decreaseAircraftCount(amount, id);
    }
}

contract BombersMarket is Ownable {
    address public countryMinter;
    address public bombers1;
    address public fighters;
    address public infrastructure;
    address public treasury;
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

    constructor(
        address _countryMinter,
        address _bombers1,
        address _fighters,
        address _infrastructure,
        address _treasury
    ) {
        countryMinter = _countryMinter;
        bombers1 = _bombers1;
        fighters = _fighters;
        infrastructure = _infrastructure;
        treasury = _treasury;
    }

    mapping(uint256 => address) public idToOwnerBombersMarket;

    modifier onlyCountryMinter() {
        require(msg.sender == countryMinter, "only countryMinter can call");
        _;
    }

    function initiateBombersMarket(uint256 id, address nationOwner)
        public
        onlyCountryMinter
    {
        idToOwnerBombersMarket[id] = nationOwner;
    }

    function updateCountryMinterAddress(address newAddress) public onlyOwner {
        countryMinter = newAddress;
    }

    function updateBombers1Address(address newAddress) public onlyOwner {
        bombers1 = newAddress;
    }

    function updateFightersAddress(address newAddress) public onlyOwner {
        fighters = newAddress;
    }

    function updateInfrastructureAddress(address newAddress) public onlyOwner {
        infrastructure = newAddress;
    }

    function updateTreasuryAddress(address newAddress) public onlyOwner {
        treasury = newAddress;
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

    function buyAh1Cobra(uint256 amount, uint256 id) public {
        require(idToOwnerBombersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        BombersContract(bombers1).increaseAh1CobraCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(fighters).spendBalance(id, purchasePrice);
    }

    function buyAh64Apache(uint256 amount, uint256 id) public {
        require(idToOwnerBombersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        BombersContract(bombers1).increaseAh64ApacheCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyBristolBlenheim(uint256 amount, uint256 id) public {
        require(idToOwnerBombersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        BombersContract(bombers1).increaseBristolBlenheimCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyB52Mitchell(uint256 amount, uint256 id) public {
        require(idToOwnerBombersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        BombersContract(bombers1).increaseB52MitchellCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyB17gFlyingFortress(uint256 amount, uint256 id) public {
        require(idToOwnerBombersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        BombersContract(bombers1).increaseB17gFlyingFortressCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyB52Stratofortress(uint256 amount, uint256 id) public {
        require(idToOwnerBombersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        BombersContract(bombers1).increaseB52StratofortressCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyB2Spirit(uint256 amount, uint256 id) public {
        require(idToOwnerBombersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        BombersContract(bombers1).increaseB2SpiritCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyB1bLancer(uint256 amount, uint256 id) public {
        require(idToOwnerBombersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        BombersContract(bombers1).increaseB1bLancerCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyTupolevTu160(uint256 amount, uint256 id) public {
        require(idToOwnerBombersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= tupolevTu160RequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= tupolevTu160RequiredTech, "!enough tech");
        uint256 purchasePrice = (tupolevTu160Cost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        BombersContract(bombers1).increaseTupolevTu160Count(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }
}
