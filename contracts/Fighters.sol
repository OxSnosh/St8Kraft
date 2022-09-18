//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "./Infrastructure.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FightersContract is Ownable {
    address public countryMinter;
    address public fightersMarket;
    address public bombers;
    address public treasuryAddress;
    address public infrastructure;
    address public war;

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
    }

    mapping(uint256 => Fighters) public idToFighters;
    mapping(uint256 => address) public idToOwnerFighters;

    constructor(
        address _countryMinter,
        address _bombers,
        address _fightersMarket,
        address _treasuryAddress,
        address _war,
        address _infrastructure
    ) {
        countryMinter = _countryMinter;
        bombers = _bombers;
        fightersMarket = _fightersMarket;
        treasuryAddress = _treasuryAddress;
        war = _war;
        infrastructure = _infrastructure;
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
            msg.sender == fightersMarket,
            "this function can only be called by market"
        );
        _;
    }

    function updateCountryMinterAddress(address _newAddress) public onlyOwner {
        countryMinter = _newAddress;
    }

    function updateFightersMarketAddress(address _newAddress) public onlyOwner {
        fightersMarket = _newAddress;
    }

    function updateTreasuryAddress(address _newAddress) public onlyOwner {
        treasuryAddress = _newAddress;
    }

    function updateWarAddress(address _newAddress) public onlyOwner {
        war = _newAddress;
    }

    function updateInfrastructureAddress(address _newAddress) public onlyOwner {
        infrastructure = _newAddress;
    }

    function updateBombersAddress(address _newAddress) public onlyOwner {
        bombers = _newAddress;
    }

    function generateFighters(uint256 id, address nationOwner) public {
        Fighters memory newFighters = Fighters(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToFighters[id] = newFighters;
        idToOwnerFighters[id] = nationOwner;
    }

    function getAircraftCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].aircraft;
        return count;
    }

    function getMaxAircraftCount(uint256 id) public pure returns (uint256) {
        return 450;
    }

    modifier onlyBomberContract() {
        require(msg.sender == bombers);
        _;
    }

    function increaseAircraftCount(uint256 amount, uint256 id)
        public
        onlyBomberContract
    {
        idToFighters[id].aircraft += amount;
    }

    function decreaseAircraftCount(uint256 amount, uint256 id)
        public
        onlyBomberContract
    {
        idToFighters[id].aircraft -= amount;
    }

    function destroyAircraft(uint256 amount, uint256 id) internal onlyWar {
        idToFighters[id].aircraft -= amount;
    }

    function getYak9Count(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].yak9Count;
        return count;
    }

    function increaseYak9Count(uint256 id, uint256 amount) public onlyMarket {
        idToFighters[id].yak9Count += amount;
    }

    function decreaseYak9Count(uint256 amount, uint256 id) public onlyWar {
        uint256 currentAmount = idToFighters[id].yak9Count;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToFighters[id].yak9Count -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function scrapYak9(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToFighters[id].yak9Count;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToFighters[id].yak9Count -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function getP51MustangCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].p51MustangCount;
        return count;
    }

    function increaseP51MustangCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToFighters[id].p51MustangCount += amount;
    }

    function decreaseP51MustangCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToFighters[id].p51MustangCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToFighters[id].p51MustangCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function scrapP51Mustang(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToFighters[id].p51MustangCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToFighters[id].p51MustangCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function getF86SabreCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].f86SabreCount;
        return count;
    }

    function increaseF86SabreCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToFighters[id].f86SabreCount += amount;
    }

    function decreaseF86SabreCount(uint256 amount, uint256 id) public onlyWar {
        uint256 currentAmount = idToFighters[id].f86SabreCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToFighters[id].f86SabreCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function scrapF86Sabre(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToFighters[id].f86SabreCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToFighters[id].f86SabreCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    ///Mig15
    function getMig15Count(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].mig15Count;
        return count;
    }

    function increaseMig15Count(uint256 id, uint256 amount) public onlyMarket {
        idToFighters[id].mig15Count += amount;
    }

    function decreaseMig15Count(uint256 amount, uint256 id) public onlyWar {
        uint256 currentAmount = idToFighters[id].mig15Count;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToFighters[id].mig15Count -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function scrapMig15(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToFighters[id].mig15Count;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToFighters[id].mig15Count -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function getF100SuperSabreCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].f100SuperSabreCount;
        return count;
    }

    function increaseF100SuperSabreCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToFighters[id].f100SuperSabreCount += amount;
    }

    function decreaseF100SuperSabreCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToFighters[id].f100SuperSabreCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToFighters[id].f100SuperSabreCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function scrapF100SuperSabre(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToFighters[id].f100SuperSabreCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToFighters[id].f100SuperSabreCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function getF35LightningCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].f35LightningCount;
        return count;
    }

    function increaseF35LightningCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToFighters[id].f35LightningCount += amount;
    }

    function decreaseF35LightningCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToFighters[id].f35LightningCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToFighters[id].f35LightningCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function scrapF35Lightning(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToFighters[id].f35LightningCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToFighters[id].f35LightningCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function getF15EagleCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].f15EagleCount;
        return count;
    }

    function increaseF15EagleCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToFighters[id].f15EagleCount += amount;
    }

    function decreaseF15EagleCount(uint256 amount, uint256 id) public onlyWar {
        uint256 currentAmount = idToFighters[id].f15EagleCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToFighters[id].f15EagleCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function scrapF15Eagle(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToFighters[id].f35LightningCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToFighters[id].f35LightningCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function getSu30MkiCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].su30MkiCount;
        return count;
    }

    function increaseSu30MkiCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToFighters[id].su30MkiCount += amount;
    }

    function decreaseSu30MkiCount(uint256 amount, uint256 id) public onlyWar {
        uint256 currentAmount = idToFighters[id].su30MkiCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToFighters[id].su30MkiCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function scrapSu30Mki(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToFighters[id].su30MkiCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToFighters[id].su30MkiCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function getF22RaptorCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].f22RaptorCount;
        return count;
    }

    function increaseF22RaptorCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToFighters[id].f22RaptorCount += amount;
    }

    function decreaseF22RaptorCount(uint256 amount, uint256 id) public onlyWar {
        uint256 currentAmount = idToFighters[id].f22RaptorCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToFighters[id].f22RaptorCount -= amount;
        idToFighters[id].aircraft -= amount;
    }

    function scrapF22Raptor(uint256 amount, uint256 id) public {
        require(idToOwnerFighters[id] == msg.sender, "!nation ruler");
        uint256 currentAmount = idToFighters[id].f22RaptorCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToFighters[id].f22RaptorCount -= amount;
        idToFighters[id].aircraft -= amount;
    }
}

contract FightersMarketplace is Ownable {
    address public countryMinter;
    address public fighters;
    address public treasury;
    address public infrastructure;
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

    constructor(
        address _countryMinter,
        address _fighters,
        address _treasury,
        address _infrastructure
    ) {
        countryMinter = _countryMinter;
        fighters = _fighters;
        treasury = _treasury;
        infrastructure = _infrastructure;
    }

    mapping(uint256 => address) public idToOwnerFightersMarket;

    modifier onlyCountryMinter() {
        require(msg.sender == countryMinter, "only countryMinter can call");
        _;
    }

    function initiateFightersMarket(uint256 id, address nationOwner)
        public
        onlyCountryMinter
    {
        idToOwnerFightersMarket[id] = nationOwner;
    }

    function updateCountryMinterAddress(address newAddress) public onlyOwner {
        countryMinter = newAddress;
    }

    function updateFighters1Address(address newAddress) public onlyOwner {
        fighters = newAddress;
    }

    function updateInfrastructureAddress(address newAddress) public onlyOwner {
        infrastructure = newAddress;
    }

    function updateTreasuryAddress(address newAddress) public onlyOwner {
        treasury = newAddress;
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

    function buyYak9(uint256 amount, uint256 id) public {
        require(idToOwnerFightersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseYak9Count(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyP51Mustang(uint256 amount, uint256 id) public {
        require(idToOwnerFightersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseP51MustangCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyF86Sabre(uint256 amount, uint256 id) public {
        require(idToOwnerFightersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseF86SabreCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyMig15(uint256 amount, uint256 id) public {
        require(idToOwnerFightersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseMig15Count(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyF100SuperSabre(uint256 amount, uint256 id) public {
        require(idToOwnerFightersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseF100SuperSabreCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyF35Lightning(uint256 amount, uint256 id) public {
        require(idToOwnerFightersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseF35LightningCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyF15Eagle(uint256 amount, uint256 id) public {
        require(idToOwnerFightersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseF15EagleCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buySu30Mki(uint256 amount, uint256 id) public {
        require(idToOwnerFightersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseSu30MkiCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyF22Raptor(uint256 amount, uint256 id) public {
        require(idToOwnerFightersMarket[id] == msg.sender, "!nation ruler");
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
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
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseF22RaptorCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }
}
