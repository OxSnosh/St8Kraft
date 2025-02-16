//SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "./Treasury.sol";
import "./Infrastructure.sol";
import "./Resources.sol";
import "./Wonders.sol";
import "./Improvements.sol";
import "./CountryMinter.sol";
import "./War.sol";
import "./NationStrength.sol";
import "./GroundBattle.sol";
import "./KeeperFile.sol";
import "./CountryParameters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

///@title MissilesContract
///@author OxSnosh
///@dev this contract will allow a nation to purchase cruise missiles and nukes
///@dev this contract inherits from the openzeppelin ownable contract
contract MissilesContract is Ownable {
    uint256 public cruiseMissileCost = 20000 * (10 ** 18);
    uint256 public defaultNukeCost = 500000 * (10 ** 18);
    uint256 public nukeCost;
    address public countryMinter;
    address public treasury;
    address public spyAddress;
    address public resources;
    address public improvements1;
    address public wonders1;
    address public wonders2;
    address public wonders4;
    address public nukeAddress;
    address public airBattle;
    address public countryinter;
    address public strength;
    address public keeper;
    address public infrastructure;

    CountryMinter mint;
    InfrastructureContract inf;
    ResourcesContract res;
    WondersContract1 won1;
    WondersContract2 won2;
    WondersContract4 won4;
    ImprovementsContract1 imp1;
    ImprovementsContract2 imp2;
    WarContract war;
    TreasuryContract tsy;
    NationStrengthContract stren;
    KeeperContract keep;

    struct Missiles {
        uint256 cruiseMissiles;
        uint256 nuclearWeapons;
    }

    mapping(uint256 => mapping(uint256 => uint256))
        public idToNukesPurchasedToday;

    event CruiseMissilesPurchased(
        uint256 indexed id,
        uint256 indexed amountPurchased
    );

    event NukePurchased(uint256 indexed id);

    event CruiseMissilesDestroyedByAirAssault(
        uint256 indexed id,
        uint256 amountDestroyed
    );

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _treasury,
        address _spyAddress,
        address _nukeAddress,
        address _airBattle,
        address _wonders2,
        address _strength,
        address _infrastructure
    ) public onlyOwner {
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
        spyAddress = _spyAddress;
        nukeAddress = _nukeAddress;
        airBattle = _airBattle;
        wonders2 = _wonders2;
        won2 = WondersContract2(_wonders2);
        strength = _strength;
        stren = NationStrengthContract(_strength);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings2(
        address _resources,
        address _improvements1,
        address _wonders1,
        address _wonders4,
        address _countryMinter,
        address _keeper
    ) public onlyOwner {
        resources = _resources;
        res = ResourcesContract(_resources);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        wonders4 = _wonders4;
        won4 = WondersContract4(_wonders4);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        keeper = _keeper;
        keep = KeeperContract(_keeper);
    }

    mapping(uint256 => Missiles) public idToMissiles;

    function generateMissiles(uint256 id) public {
        Missiles memory newMissiles = Missiles(0, 0);
        idToMissiles[id] = newMissiles;
    }

    modifier onlySpyContract() {
        require(msg.sender == spyAddress, "only callable from spy contract");
        _;
    }

    modifier onlyNukeContract() {
        require(msg.sender == nukeAddress, "only callable from nuke contract");
        _;
    }

    modifier onlyAirBattle() {
        require(
            msg.sender == airBattle,
            "only callable from air battle contract"
        );
        _;
    }

    ///@dev this function is a public function that will allow a nation owner to purchase cruise missiles
    ///@notice this function allows a nation owner to purchase cruise missiles
    ///@param amount is the amount of cruise missiles being purchased
    ///@param id is the nation id of the nation buying cruise missiles
    function buyCruiseMissiles(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 techAmount = inf.getTechnologyCount(id);
        require(techAmount >= 15, "requires 15 tech");
        uint256 costPerMissile = getCruiseMissileCost(id);
        uint256 cost = (costPerMissile * amount);
        tsy.spendBalance(id, cost);
        idToMissiles[id].cruiseMissiles += amount;
        emit CruiseMissilesPurchased(id, amount);
    }

    ///@dev this function is only callable by the contract owner
    function updateCruiseMissileCost(uint256 newPrice) public onlyOwner {
        cruiseMissileCost = newPrice;
    }

    ///@dev this is a public view function that will return the cost per missiile of cruise missiles for a nation
    ///@notice this function will return the cost per cruise missile for a given nation
    ///@param id is the nation id of the nation purchasing missiles
    ///@return cost is the cost per missile of cruise missiles for that nation
    function getCruiseMissileCost(
        uint256 id
    ) public view returns (uint256 cost) {
        uint256 basePurchasePrice = cruiseMissileCost;
        uint256 factoryCount = imp1.getFactoryCount(id);
        uint256 costModifier = 100;
        if (factoryCount > 0) {
            costModifier -= (factoryCount * 5);
        }
        bool lead = res.viewLead(id);
        if (lead) {
            costModifier -= 20;
        }
        uint256 costPerMissile = ((basePurchasePrice * costModifier) / 100);
        return costPerMissile;
    }

    ///@dev this is a public view function that will return the number of cruise missile a nation owns
    ///@notice this function will return the number of cruise missiles a given nation owns
    ///@param id is the nation ID of the nation being queried
    ///@return uint256 is the number of cruise missiles a given nation owns
    function getCruiseMissileCount(uint256 id) public view returns (uint256) {
        uint256 count = idToMissiles[id].cruiseMissiles;
        return count;
    }

    ///@dev this is a public function that will decrease the number of cruise missiles only callable from the spy contract
    ///@notice this function will decrease the number of cruise missiles lost during a spy attack
    ///@param amount this is the number of missiles being destroyed
    ///@param id this is the nation id of the nation being attacked
    function decreaseCruiseMissileCount(
        uint256 amount,
        uint256 id
    ) public onlySpyContract {
        uint256 missiles = idToMissiles[id].cruiseMissiles;
        if (amount >= missiles) {
            idToMissiles[id].cruiseMissiles = 0;
        } else {
            idToMissiles[id].cruiseMissiles -= amount;
        }
    }

    ///@dev this is a public function that will decrease the number of cruise missiles only callable from the nuke contract
    ///@notice this function will decrease the number of cruise missiles lost during a nuke attack
    ///@notice a succesful nuke attack will destroy 35% of your nations cruise missiles
    ///@notice a fallout shelter system will reduce the number of missiles lost during a nuke attack to 25%
    ///@param id this is the nation id of the nation being attacked
    function decreaseCruiseMissileCountFromNukeContract(
        uint256 id
    ) public onlyNukeContract {
        console.log("decreasing cruise missiles");
        console.log("id", id);
        uint256 cruiseMissiles = idToMissiles[id].cruiseMissiles;
        uint256 percentage = 35;
        bool falloutShelter = won1.getFalloutShelterSystem(id);
        if (falloutShelter) {
            percentage = 25;
        }
        uint256 cruiseMissilesToDecrease = ((cruiseMissiles * percentage) /
            100);
        idToMissiles[id].cruiseMissiles -= cruiseMissilesToDecrease;
    }

    ///@dev this is a public function only callable from the air battle contact
    ///@notice this function will decrease the number of cruise missiles lost during a bombing mission
    ///@param id this is the nation id of the nation losing missiles from being attacked by bombers
    ///@param amountToDecrease this is the number of cruise missiles beind destroyed by the bombing mission
    function decreaseCruiseMissileCountFromAirBattleContract(
        uint256 id,
        uint256 amountToDecrease
    ) public onlyAirBattle {
        uint256 cruiseMissiles = idToMissiles[id].cruiseMissiles;
        if (amountToDecrease >= cruiseMissiles) {
            idToMissiles[id].cruiseMissiles = 0;
            amountToDecrease = cruiseMissiles;
        } else {
            idToMissiles[id].cruiseMissiles -= amountToDecrease;
        }
        emit CruiseMissilesDestroyedByAirAssault(id, amountToDecrease);
    }

    ///@dev this is a public function that will allow a nation owner to purchase nukes
    ///@notice this function allows a nation owner to purchase nukes
    ///@notice requirements to purchase nukes are 75 technology, 1000 infrastructure and access to uranium
    ///@notice a nation must also have a nation strength of 150,000 or a manhattan project to purchase nukes
    ///@notice a nation owner can only purchase one nuke per day (2 with a weapons research center)
    ///@param id is the nation id of the nation purchasing nukes
    function buyNukes(uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 techAmount = inf.getTechnologyCount(id);
        require(techAmount >= 75, "requires 75 tech");
        uint256 infrastructureAmount = inf.getInfrastructureCount(id);
        require(infrastructureAmount >= 1000, "insufficient infrastructure");
        bool isUranium = res.viewUranium(id);
        require(isUranium, "no uranium");
        uint256 nationStrength = stren.getNationStrength(id);
        bool manhattanProject = won2.getManhattanProject(id);
        require(
            nationStrength > 150000 || manhattanProject,
            "nation strength too low"
        );
        uint256 day = keep.getGameDay();
        uint256 nukesPurchasedToday = idToNukesPurchasedToday[id][day];
        uint256 maxNukesPerDay = 1;
        bool weaponsResearchCenter = won4.getWeaponsResearchCenter(id);
        if (weaponsResearchCenter) {
            maxNukesPerDay = 2;
        }
        require(
            nukesPurchasedToday < maxNukesPerDay,
            "already purchased nuke today"
        );
        idToNukesPurchasedToday[id][day] += 1;
        idToMissiles[id].nuclearWeapons += 1;
        uint256 cost = getNukeCost(id);
        tsy.spendBalance(id, cost);
        emit NukePurchased(id);
    }

    ///@dev this is a public function that will return the cost per nuke for a nation
    ///@notice this function will return the cost per nuke for a nation
    ///@notice nukes cost 500,000 + (50,000 * current nuke count)
    ///@param id is the nation ID of the nation being queried
    ///@return uint256 is the cost per nuke for a given nation
    function getNukeCost(uint256 id) public view returns (uint256) {
        uint256 nukeCount = idToMissiles[id].nuclearWeapons;
        uint256 cost = (defaultNukeCost + (nukeCount * 50000));
        uint256 mod = 100;
        bool lead = res.viewLead(id);
        if (lead) {
            mod = 80;
        }
        cost = ((cost * mod) / 100);
        return cost;
    }

    function updateDefaultNukeCost(uint256 newCost) public onlyOwner {
        defaultNukeCost = newCost;
    }

    function getDefaultNukeCost() public view returns (uint256) {
        return defaultNukeCost;
    }

    function getNukesPurchasedToday(uint256 id) public view returns (uint256) {
        uint256 day = keep.getGameDay();
        return idToNukesPurchasedToday[id][day];
    }

    ///@dev this is a public view function that will retrun a nations current nuke count
    ///@notice this function retrurns a nations current nuke count
    ///@param id this is the nation ID for the nation being queried
    ///@return uint256 this is the current nuke count for a given nation
    function getNukeCount(uint256 id) public view returns (uint256) {
        uint256 count = idToMissiles[id].nuclearWeapons;
        return count;
    }

    ///@dev this is a public function that will decrease the nuke count for a nation by 1 when a nuke is launched from the nuke contract
    ///@dev this function is only callable from the nuke contract
    ///@notice this function will decrease a nations nuke count by 1 when a nuke is launched
    ///@param id is the nation id of the nation launching the nuke that will have its nuke count decreased by 1
    function decreaseNukeCountFromNukeContract(
        uint256 id
    ) public onlyNukeContract {
        idToMissiles[id].nuclearWeapons -= 1;
    }

    ///@dev this is a public function that will decrease the nuke count for a nation when a successful spy attack is executed
    ///@dev this function is only callable from the spy contract
    ///@notice this function will decrease a nations nuke count if they are successfully attacked by a spy
    ///@param id is the nation id of the nation that was attacked and is losing a nuke
    function decreaseNukeCountFromSpyContract(
        uint256 id
    ) public onlySpyContract {
        bool silo = won2.getHiddenNuclearMissileSilo(id);
        uint256 nukeCount = getNukeCount(id);
        uint256 requiredNukeAmount = 1;
        if (silo) {
            requiredNukeAmount = 6;
        }
        require(nukeCount >= requiredNukeAmount, "no nukes to destroy");
        idToMissiles[id].nuclearWeapons -= 1;
    }
}