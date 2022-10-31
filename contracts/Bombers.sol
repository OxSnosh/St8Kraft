//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "./CountryMinter.sol";
import "./Infrastructure.sol";
import "./Fighters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BombersContract is Ownable {
    address public countryMinter;
    address public bombersMarket1;
    address public bombersMarket2;
    address public airBattle;
    address public fighters;
    address public treasury;
    address public infrastructure;
    address public war;

    CountryMinter mint;

    struct DefendingBombers {
        uint256 defendingAircraft;
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

    struct DeployedBombers {
        uint256 deployedAircraft;
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

    mapping(uint256 => DefendingBombers) public idToDefendingBombers;
    mapping(uint256 => DeployedBombers) public idToDeployedBombers;
    mapping(uint256 => address) public idToOwnerBombers;

    function settings (
        address _countryMinter,
        address _bombersMarket1,
        address _bombersMarket2,
        address _airBattle,
        address _treasuryAddress,
        address _fightersAddress,
        address _infrastructure,
        address _war
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        bombersMarket1 = _bombersMarket1;
        bombersMarket2 = _bombersMarket2;
        airBattle = _airBattle;
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

    modifier onlyAirBattle() {
        require(
            msg.sender == airBattle,
            "function only callable from Air Battle Contract"
        );
        _;
    }

    modifier onlyMarket() {
        require(
            msg.sender == bombersMarket1 || msg.sender == bombersMarket2,
            "this function can only be called by market"
        );
        _;
    }

    function updateCountryMinterAddress(address _countryMinter)
        public
        onlyOwner
    {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
    }

    function updateBombersMarketAddresses(address _bombersMarket1, address _bombersMarket2)
        public
        onlyOwner
    {
        bombersMarket1 = _bombersMarket1;
        bombersMarket2 = _bombersMarket2;
    }

    function updateAirBattleAddress(address _airBattle) public onlyOwner {
        airBattle = _airBattle;
    }

    function updateTreasuryAddress(address _treasury) public onlyOwner {
        treasury = _treasury;
    }

    function updateFightersAddress(address _fighters) public onlyOwner {
        fighters = _fighters;
    }

    function updateInfrastructureAddress(address _infrastructure)
        public
        onlyOwner
    {
        infrastructure = _infrastructure;
    }

    function updateWarAddress(address _war) public onlyOwner {
        war = _war;
    }

    function generateBombers(uint256 id, address nationOwner)
        public
        onlyCountryMinter
    {
        DefendingBombers memory newDefendingBombers = DefendingBombers(
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
        idToDefendingBombers[id] = newDefendingBombers;
        DeployedBombers memory newDeployedBombers = DeployedBombers(
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
        idToDeployedBombers[id] = newDeployedBombers;
        idToOwnerBombers[id] = nationOwner;
    }

    function getBomberCount(uint256 id) public view returns (uint256) {
        uint256 defendingBombers = idToDefendingBombers[id].defendingAircraft;
        uint256 deployedBombers = idToDeployedBombers[id].deployedAircraft;
        uint256 totalAircraft = (defendingBombers + deployedBombers);
        return totalAircraft;
    }

    function getDefendingAh1CobraCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDefendingBombers[id].ah1CobraCount;
        return count;
    }

    function getDeployedAh1CobraCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDeployedBombers[id].ah1CobraCount;
        return count;
    }

    function increaseAh1CobraCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingBombers[id].ah1CobraCount += amount;
        idToDefendingBombers[id].defendingAircraft += amount;
    }

    function decreaseDefendingAh1CobraCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingBombers[id].ah1CobraCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDefendingBombers[id].ah1CobraCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function decreaseDeployedAh1CobraCount(uint256 amount, uint256 id)
        public
        onlyAirBattle
    {
        uint256 currentAmount = idToDeployedBombers[id].ah1CobraCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDeployedBombers[id].ah1CobraCount -= amount;
        idToDeployedBombers[id].deployedAircraft -= amount;
    }

    function scrapAh1Cobra(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingBombers[id].ah1CobraCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].ah1CobraCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function getDefendingAh64ApacheCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDefendingBombers[id].ah64ApacheCount;
        return count;
    }

    function getDeployedAh64ApacheCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDeployedBombers[id].ah64ApacheCount;
        return count;
    }

    function increaseAh64ApacheCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingBombers[id].ah64ApacheCount += amount;
        idToDefendingBombers[id].defendingAircraft += amount;
    }

    function decreaseDefendingAh64ApacheCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingBombers[id].ah64ApacheCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].ah64ApacheCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function decreaseDeployedAh64ApacheCount(uint256 amount, uint256 id)
        public
        onlyAirBattle
    {
        uint256 currentAmount = idToDeployedBombers[id].ah64ApacheCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDeployedBombers[id].ah64ApacheCount -= amount;
        idToDeployedBombers[id].deployedAircraft -= amount;
    }

    function scrapAh64Apache(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingBombers[id].ah64ApacheCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].ah64ApacheCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function getDefendingBristolBlenheimCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDefendingBombers[id].bristolBlenheimCount;
        return count;
    }

    function getDeployedBristolBlenheimCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDeployedBombers[id].bristolBlenheimCount;
        return count;
    }

    function increaseBristolBlenheimCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingBombers[id].bristolBlenheimCount += amount;
        idToDefendingBombers[id].defendingAircraft += amount;
    }

    function decreaseDefendingBristolBlenheimCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingBombers[id].bristolBlenheimCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].bristolBlenheimCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function decreaseDeployedBristolBlenheimCount(uint256 amount, uint256 id)
        public
        onlyAirBattle
    {
        uint256 currentAmount = idToDeployedBombers[id].bristolBlenheimCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDeployedBombers[id].bristolBlenheimCount -= amount;
        idToDeployedBombers[id].deployedAircraft -= amount;
    }

    function scrapBristolBlenheim(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingBombers[id].bristolBlenheimCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].bristolBlenheimCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function getDefendingB52MitchellCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDefendingBombers[id].b52MitchellCount;
        return count;
    }

    function getDeployedB52MitchellCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDeployedBombers[id].b52MitchellCount;
        return count;
    }

    function increaseB52MitchellCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingBombers[id].b52MitchellCount += amount;
        idToDefendingBombers[id].defendingAircraft += amount;
    }

    function decreaseDefendingB52MitchellCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingBombers[id].b52MitchellCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].b52MitchellCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function decreaseDeployedB52MitchellCount(uint256 amount, uint256 id)
        public
        onlyAirBattle
    {
        uint256 currentAmount = idToDeployedBombers[id].b52MitchellCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDeployedBombers[id].b52MitchellCount -= amount;
        idToDeployedBombers[id].deployedAircraft -= amount;
    }

    function scrapB52Mitchell(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingBombers[id].b52MitchellCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].b52MitchellCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function getDefendingB17gFlyingFortressCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDefendingBombers[id].b17gFlyingFortressCount;
        return count;
    }

    function getDeployedB17gFlyingFortressCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDeployedBombers[id].b17gFlyingFortressCount;
        return count;
    }

    function increaseB17gFlyingFortressCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingBombers[id].b17gFlyingFortressCount += amount;
        idToDefendingBombers[id].defendingAircraft += amount;
    }

    function decreaseDefendingB17gFlyingFortressCount(
        uint256 amount,
        uint256 id
    ) public onlyWar {
        uint256 currentAmount = idToDefendingBombers[id]
            .b17gFlyingFortressCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].b17gFlyingFortressCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function decreaseDeployedB17gFlyingFortressCount(uint256 amount, uint256 id)
        public
        onlyAirBattle
    {
        uint256 currentAmount = idToDeployedBombers[id].b17gFlyingFortressCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDeployedBombers[id].b17gFlyingFortressCount -= amount;
        idToDeployedBombers[id].deployedAircraft -= amount;
    }

    function scrapB17gFlyingFortress(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingBombers[id]
            .b17gFlyingFortressCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].b17gFlyingFortressCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function getDefendingB52StratofortressCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDefendingBombers[id].b52StratofortressCount;
        return count;
    }

    function getDeployedB52StratofortressCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDeployedBombers[id].b52StratofortressCount;
        return count;
    }

    function increaseB52StratofortressCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingBombers[id].b52StratofortressCount += amount;
        idToDefendingBombers[id].defendingAircraft += amount;
    }

    function decreaseDefendingB52StratofortressCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingBombers[id].b52StratofortressCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].b52StratofortressCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function decreaseDeployedB52StratofortressCount(uint256 amount, uint256 id)
        public
        onlyAirBattle
    {
        uint256 currentAmount = idToDeployedBombers[id].b52StratofortressCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDeployedBombers[id].b52StratofortressCount -= amount;
        idToDeployedBombers[id].deployedAircraft -= amount;
    }

    function scrapB52Stratofortress(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingBombers[id].b52StratofortressCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].b52StratofortressCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function getDefendingB2SpiritCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDefendingBombers[id].b2SpiritCount;
        return count;
    }

    function getDeployedB2SpiritCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDeployedBombers[id].b2SpiritCount;
        return count;
    }

    function increaseB2SpiritCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingBombers[id].b2SpiritCount += amount;
        idToDefendingBombers[id].defendingAircraft += amount;
    }

    function decreaseDefendingB2SpiritCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingBombers[id].b2SpiritCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].b2SpiritCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function decreaseDeployedB2SpiritCount(uint256 amount, uint256 id)
        public
        onlyAirBattle
    {
        uint256 currentAmount = idToDeployedBombers[id].b2SpiritCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDeployedBombers[id].b2SpiritCount -= amount;
        idToDeployedBombers[id].deployedAircraft -= amount;
    }

    function scrapB2Spirit(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingBombers[id].b2SpiritCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].b2SpiritCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function getDefendingB1bLancer(uint256 id) public view returns (uint256) {
        uint256 count = idToDefendingBombers[id].b1bLancerCount;
        return count;
    }

    function getDeployedB1bLancer(uint256 id) public view returns (uint256) {
        uint256 count = idToDeployedBombers[id].b1bLancerCount;
        return count;
    }

    function increaseB1bLancerCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingBombers[id].b1bLancerCount += amount;
        idToDefendingBombers[id].defendingAircraft += amount;
    }

    function decreaseDefendingB1bLancerCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingBombers[id].b1bLancerCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].b1bLancerCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function decreaseDeployedB1bLancerCount(uint256 amount, uint256 id)
        public
        onlyAirBattle
    {
        uint256 currentAmount = idToDeployedBombers[id].b1bLancerCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDeployedBombers[id].b1bLancerCount -= amount;
        idToDeployedBombers[id].deployedAircraft -= amount;
    }

    function scrapB1bLancer(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingBombers[id].b1bLancerCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].b1bLancerCount -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function getDefendingTupolevTu160(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDefendingBombers[id].tupolevTu160Count;
        return count;
    }

    function getDeployedTupolevTu160(uint256 id) public view returns (uint256) {
        uint256 count = idToDeployedBombers[id].tupolevTu160Count;
        return count;
    }

    function increaseTupolevTu160Count(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingBombers[id].tupolevTu160Count += amount;
        idToDefendingBombers[id].defendingAircraft += amount;
    }

    function decreaseDefendingTupolevTu160Count(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingBombers[id].tupolevTu160Count;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].tupolevTu160Count -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }

    function decreaseDeployedTupolevTu160Count(uint256 amount, uint256 id)
        public
        onlyAirBattle
    {
        uint256 currentAmount = idToDeployedBombers[id].tupolevTu160Count;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDeployedBombers[id].tupolevTu160Count -= amount;
        idToDeployedBombers[id].deployedAircraft -= amount;
    }

    function scrapTupolevTu160(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingBombers[id].tupolevTu160Count;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingBombers[id].tupolevTu160Count -= amount;
        idToDefendingBombers[id].defendingAircraft -= amount;
    }
}

contract BombersMarketplace1 is Ownable {
    address public countryMinter;
    address public bombers1;
    address public fighters;
    address public fightersMarket1;
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

    CountryMinter mint;
    FightersContract fight;
    FightersMarketplace1 fightMarket1;
    InfrastructureContract inf;
    TreasuryContract tsy;
    BombersContract bomb1;

    function settings (
        address _countryMinter,
        address _bombers1,
        address _fighters,
        address _fightersMarket1,
        address _infrastructure,
        address _treasury
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        bombers1 = _bombers1;
        bomb1 = BombersContract(_bombers1);
        fighters = _fighters;
        fight = FightersContract(_fighters);
        fightersMarket1 = _fightersMarket1;
        fightMarket1 = FightersMarketplace1(_fightersMarket1);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
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
        mint = CountryMinter(newAddress);
    }

    function updateBombers1Address(address newAddress) public onlyOwner {
        bombers1 = newAddress;
        bomb1 = BombersContract(newAddress);
    }

    function updateFightersAddress(address newAddress) public onlyOwner {
        fighters = newAddress;
        fight = FightersContract(newAddress);
    }

    function updateInfrastructureAddress(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    function updateTreasuryAddress(address newAddress) public onlyOwner {
        treasury = newAddress;
        tsy = TreasuryContract(newAddress);
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

    function buyAh1Cobra(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= ah1CobraRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= ah1CobraRequiredTech, "!enough tech");
        uint256 purchasePrice = (ah1CobraCost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseAh1CobraCount(id, amount);
        fight.increaseAircraftCount(amount, id);
        tsy.spendBalance(id, purchasePrice);
    }

    function buyAh64Apache(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= ah64ApacheRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= ah64ApacheRequiredTech, "!enough tech");
        uint256 purchasePrice = (ah64ApacheCost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseAh64ApacheCount(id, amount);
        fight.increaseAircraftCount(amount, id);
        tsy.spendBalance(id, purchasePrice);
    }

    function buyBristolBlenheim(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= bristolBlenheimRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= bristolBlenheimRequiredTech, "!enough tech");
        uint256 purchasePrice = (bristolBlenheimCost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseBristolBlenheimCount(id, amount);
        fight.increaseAircraftCount(amount, id);
        tsy.spendBalance(id, purchasePrice);
    }

    function buyB52Mitchell(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= b52MitchellRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= b52MitchellRequiredTech, "!enough tech");
        uint256 purchasePrice = (b52MitchellCost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseB52MitchellCount(id, amount);
        fight.increaseAircraftCount(amount, id);
        tsy.spendBalance(id, purchasePrice);
    }

    function buyB17gFlyingFortress(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= b17gFlyingFortressRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= b17gFlyingFortressRequiredTech, "!enough tech");
        uint256 purchasePrice = (b17gFlyingFortressCost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseB17gFlyingFortressCount(id, amount);
        fight.increaseAircraftCount(amount, id);
        tsy.spendBalance(id, purchasePrice);
    }
}

contract BombersMarketplace2 is Ownable {
    address public countryMinter;
    address public bombers1;
    address public fighters;
    address public fightersMarket1;
    address public infrastructure;
    address public treasury;
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

    CountryMinter mint;
    FightersContract fight;
    FightersMarketplace1 fightMarket1;
    InfrastructureContract inf;
    TreasuryContract tsy;
    BombersContract bomb1;

    function settings (
        address _countryMinter,
        address _bombers1,
        address _fighters,
        address _fightersMarket1,
        address _infrastructure,
        address _treasury
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        bombers1 = _bombers1;
        bomb1 = BombersContract(_bombers1);
        fighters = _fighters;
        fight = FightersContract(_fighters);
        fightersMarket1 = _fightersMarket1;
        fightMarket1 = FightersMarketplace1(_fightersMarket1);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
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
        mint = CountryMinter(newAddress);
    }

    function updateBombers1Address(address newAddress) public onlyOwner {
        bombers1 = newAddress;
        bomb1 = BombersContract(newAddress);
    }

    function updateFightersAddress(address newAddress) public onlyOwner {
        fighters = newAddress;
        fight = FightersContract(newAddress);
    }

    function updateInfrastructureAddress(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    function updateTreasuryAddress(address newAddress) public onlyOwner {
        treasury = newAddress;
        tsy = TreasuryContract(newAddress);
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

    function buyB52Stratofortress(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= b52StratofortressRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= b52StratofortressRequiredTech, "!enough tech");
        uint256 purchasePrice = (b52StratofortressCost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseB52StratofortressCount(id, amount);
        fight.increaseAircraftCount(amount, id);
        tsy.spendBalance(id, purchasePrice);
    }

    function buyB2Spirit(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= b2SpiritRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= b2SpiritRequiredTech, "!enough tech");
        uint256 purchasePrice = (b2SpiritCost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseB2SpiritCount(id, amount);
        fight.increaseAircraftCount(amount, id);
        tsy.spendBalance(id, purchasePrice);
    }

    function buyB1bLancer(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= b1bLancerRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= b1bLancerRequiredTech, "!enough tech");
        uint256 purchasePrice = (b1bLancerCost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseB1bLancerCount(id, amount);
        fight.increaseAircraftCount(amount, id);
        tsy.spendBalance(id, purchasePrice);
    }

    function buyTupolevTu160(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= tupolevTu160RequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= tupolevTu160RequiredTech, "!enough tech");
        uint256 purchasePrice = (tupolevTu160Cost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseTupolevTu160Count(id, amount);
        fight.increaseAircraftCount(amount, id);
        tsy.spendBalance(id, purchasePrice);
    }
}
