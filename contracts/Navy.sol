//SPDX-License-Identifier: Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International
pragma solidity 0.8.17;

import "./Treasury.sol";
import "./Improvements.sol";
import "./War.sol";
import "./Resources.sol";
import "./Military.sol";
import "./Nuke.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "./KeeperFile.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

///@title NavalActionsContract
///@author OxSnosh
///@dev this contract inherits from openzeppelin's ownable contract
///@notice this contract will keep track of naval actions (daily blockades, purchases and action slots)
contract NavalActionsContract is Ownable {
    address public keeper;
    address public navy;
    address public navy2;
    address public navalBlockade;
    address public breakBlockade;
    address public navalAttack;
    address public countryMinter;

    CountryMinter mint;
    KeeperContract keep;

    struct NavalActions {
        mapping(uint256 => bool) blockadedToday;
        mapping(uint256 => uint256) purchasesToday;
        mapping(uint256 => uint256) actionSlotsUsedToday;
    }

    mapping(uint256 => NavalActions) idToNavalActions;
    mapping(uint256 => mapping(uint256 => uint256)) public idToDayToPurchases;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _navalBlockade,
        address _breakBlockade,
        address _navalAttack,
        address _keeper,
        address _navy,
        address _navy2,
        address _countryMinter
    ) public onlyOwner {
        navalBlockade = _navalBlockade;
        breakBlockade = _breakBlockade;
        navalAttack = _navalAttack;
        navy = _navy;
        navy2 = _navy2;
        keeper = _keeper;
        keep = KeeperContract(_keeper);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "function only callable from countryMinter"
        );
        _;
    }

    modifier onlyNavalAction() {
        require(
            msg.sender == navalBlockade ||
                msg.sender == breakBlockade ||
                msg.sender == navalAttack,
            "function only callable from navy contracts"
        );
        _;
    }

    ///@dev this is a public function that is only callable from the country minter contract
    ///@dev this function is called when a nation is minted
    ///@dev this function will initialize the struct that will keep track of action slots, daily blockades and purchases
    ///@notice this function will allow the contract to keep track of each nations action slots, blockades and purchases
    ///@param id is the nation ID of the country being minted
    function generateNavalActions(uint256 id) public onlyCountryMinter {
        uint256 gameDay = keep.getGameDay();
        NavalActions storage newNavalActions = idToNavalActions[id];
        newNavalActions.blockadedToday[gameDay] = false;
        newNavalActions.purchasesToday[gameDay] = 0;
        newNavalActions.actionSlotsUsedToday[gameDay] = 0;
    }

    ///@dev this is a public view function that is only callable from the navy battle contracts
    ///@dev a nation is only allows to make 3 naval actions per day
    ///@notice a nation is only allowed to make 3 naval actions per day
    ///@notice this function will increase naval actions when they occur
    function increaseAction(uint256 id) public onlyNavalAction {
        uint256 gameDay = keep.getGameDay();
        idToNavalActions[id].actionSlotsUsedToday[gameDay] += 1;
    }

    modifier onlyNavy() {
        require(
            msg.sender == navy || msg.sender == navy2,
            "function only callable from navy contract"
        );
        _;
    }

    ///@dev this is a public function that is only callable from the navy contract where purchases occur
    ///@dev this function will increment a nations daily purchases as purchases occur
    ///@notice a nation at war can purchase 5 naval ships per day (7 with a foreign naval base)
    ///@notice during peacetime a nation can purchase 2 naval ships per day (4 with a foreign navla base)
    ///@param id is the nation id of the nation purchasin vessels
    ///@param amount is the amount of navy vessels being purchased
    function increasePurchases(uint256 id, uint256 amount) public onlyNavy {
        uint256 gameDay = keep.getGameDay();
        idToNavalActions[id].purchasesToday[gameDay] += amount;
    }

    modifier onlyBlockade() {
        require(
            msg.sender == navalBlockade,
            "function only callable from blockade contract"
        );
        _;
    }

    ///@dev this function is a public function that can only be called by the naval battle contracts
    ///@dev a nation can only be blockaded once per day
    ///@notice a nation can only be blockaded once per day
    ///@notice this function will be called when a nation is blockaded and set the blockadedToday to true
    ///@param id is the nation id of the nation being blockaded
    function toggleBlockaded(uint256 id) public onlyNavalAction {
        uint256 day = keep.getGameDay();
        idToNavalActions[id].blockadedToday[day] = true;
    }

    ///@dev this is a public view function that will return a nations daily purchases
    ///@notice this function will return the amount of vessels a nation purchases today
    ///@param id is the nation id of the nation being queried
    ///@return uint256 is the number of ships purchased today
    function getPurchasesToday(uint256 id) public view returns (uint256) {
        uint256 gameDay = keep.getGameDay();
        uint256 purchasesToday = idToNavalActions[id].purchasesToday[gameDay];
        return purchasesToday;
    }

    ///@dev this is a public view function that will return a nations daily action slots used
    ///@notice this function will return the number of action slots a naton has used today
    ///@param id is the nation id of the nation being queried
    ///@return uint256 is the number of action slots used today
    function getActionSlotsUsed(uint256 id) public view returns (uint256) {
        uint256 gameDay = keep.getGameDay();
        uint256 actionSlotsUsed = idToNavalActions[id].actionSlotsUsedToday[
            gameDay
        ];
        return actionSlotsUsed;
    }

    ///@dev this is a public view function that will return a boolean whether a nation has been blockaded today
    ///@notice this function will return true if a nation has been blockaded today
    ///@param id is the nation id of the nation being queried
    ///@return bool will be true if a nation has been blockaded today
    function getBlockadedToday(uint256 id) public view returns (bool) {
        uint256 gameDay = keep.getGameDay();
        bool blockadedToday = idToNavalActions[id].blockadedToday[gameDay];
        return blockadedToday;
    }
}

///@title NavyContract
///@author OxSnosh
///@dev this contract inherits from openzeppelin's ownable contract
///@notice this contract will allow a user to purchase navy vessels
contract NavyContract is Ownable {
    address public treasuryAddress;
    address public improvementsContract1Address;
    address public improvementsContract3Address;
    address public improvements4;
    address public resources;
    address public navyBattleAddress;
    address public military;
    address public nukes;
    address public wonders1;
    address public countryMinter;
    address public navalActions;
    address public additionalNavy;
    address public navy2Contract;
    address public bonusResources;
    address public infrastructure;
    uint256 public corvetteCost = 300000 * (10 ** 18);
    uint256 public corvetteRequiredInfrastructure = 2000;
    uint256 public corvetteRequiredTechnology = 200;
    uint256 public landingShipCost = 300000 * (10 ** 18);
    uint256 public landingShipRequiredInfrastructure = 2500;
    uint256 public landingShipRequiredTechnology = 200;
    uint256 public battleshipCost = 300000 * (10 ** 18);
    uint256 public battleshipRequiredInfrastructure = 2500;
    uint256 public battleshipRequiredTechnology = 300;
    uint256 public cruiserCost = 500000 * (10 ** 18);
    uint256 public cruiserRequiredInfrastructure = 3000;
    uint256 public cruiserRequiredTechnology = 350;

    struct Navy {
        uint256 corvetteCount;
        uint256 landingShipCount;
        uint256 battleshipCount;
        uint256 cruiserCount;
    }

    mapping(uint256 => Navy) public idToNavy;

    event CorvettePurchased(
        uint256 indexed id,
        uint256 indexed amount,
        uint256 indexed purchasePrice
    );
    event LandingShipPurchased(
        uint256 indexed id,
        uint256 indexed amount,
        uint256 indexed purchasePrice
    );
    event BattleshipPurchased(
        uint256 indexed id,
        uint256 indexed amount,
        uint256 indexed purchasePrice
    );
    event CruiserPurchased(
        uint256 indexed id,
        uint256 indexed amount,
        uint256 indexed purchasePrice
    );

    event CorvetteDecommissioned(uint256 indexed id, uint256 indexed amount);

    event LandingShipDecommissioned(uint256 indexed id, uint256 indexed amount);

    event BattleshipDecommissioned(uint256 indexed id, uint256 indexed amount);

    event CruiserDecommissioned(uint256 indexed id, uint256 indexed amount);

    event NukeDamageToNavy(
        uint256 indexed defenderId,
        uint256 corvetteCount,
        uint256 landingShip,
        uint256 cruiserCount,
        uint256 frigateCount
    );

    ResourcesContract res;
    MilitaryContract mil;
    ImprovementsContract4 imp4;
    NukeContract nuke;
    WondersContract1 won1;
    NavalActionsContract navAct;
    CountryMinter mint;
    AdditionalNavyContract addNav;
    BonusResourcesContract bonus;
    NavyContract2 navy2;
    InfrastructureContract inf;

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "function only callable from countryMinter"
        );
        _;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _treasuryAddress,
        address _improvementsContract1Address,
        address _improvementsContract3Address,
        address _improvements4,
        address _resources,
        address _military,
        address _nukes,
        address _wonders1,
        address _navalActions,
        address _additionalNavy
    ) public onlyOwner {
        treasuryAddress = _treasuryAddress;
        improvementsContract1Address = _improvementsContract1Address;
        improvementsContract3Address = _improvementsContract3Address;
        improvements4 = _improvements4;
        imp4 = ImprovementsContract4(_improvements4);
        resources = _resources;
        res = ResourcesContract(_resources);
        military = _military;
        mil = MilitaryContract(_military);
        nukes = _nukes;
        nuke = NukeContract(_nukes);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        navalActions = _navalActions;
        navAct = NavalActionsContract(_navalActions);
        additionalNavy = _additionalNavy;
        addNav = AdditionalNavyContract(_additionalNavy);
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings2(
        address _countryMinter,
        address _bonusResources,
        address _navy2,
        address _infrastructure
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        bonusResources = _bonusResources;
        bonus = BonusResourcesContract(_bonusResources);
        navy2Contract = _navy2;
        navy2 = NavyContract2(_navy2);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
    }

    ///@dev this is a public function only callable from the countryMinter contract
    ///@dev this function will allow a nation owner to buy navy vessels
    ///@notice this function will allow a nation owner to buy navy vessels
    ///@param id this is the nation id of the nation being minted
    function generateNavy(uint256 id) public onlyCountryMinter {
        Navy memory newNavy = Navy(0, 0, 0, 0);
        idToNavy[id] = newNavy;
    }

    ///@dev this function is only callable by the contract owner
    function updateCorvetteSpecs(
        uint256 newPrice,
        uint256 newRequiredInf,
        uint256 newRequiredTech
    ) public onlyOwner {
        corvetteCost = newPrice;
        corvetteRequiredInfrastructure = newRequiredInf;
        corvetteRequiredTechnology = newRequiredTech;
    }

    function getCorvetteSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            corvetteCost,
            corvetteRequiredInfrastructure,
            corvetteRequiredTechnology
        );
    }

    ///@dev this function is only callable by the contract owner
    function updateLandingShipSpecs(
        uint256 newPrice,
        uint256 newRequiredInf,
        uint256 newRequiredTech
    ) public onlyOwner {
        landingShipCost = newPrice;
        landingShipRequiredInfrastructure = newRequiredInf;
        landingShipRequiredTechnology = newRequiredTech;
    }

    function getLandingShipSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            landingShipCost,
            landingShipRequiredInfrastructure,
            landingShipRequiredTechnology
        );
    }

    ///@dev this function is only callable by the contract owner
    function updateBattleshipSpecs(
        uint256 newPrice,
        uint256 newRequiredInf,
        uint256 newRequiredTech
    ) public onlyOwner {
        battleshipCost = newPrice;
        battleshipRequiredInfrastructure = newRequiredInf;
        battleshipRequiredTechnology = newRequiredTech;
    }

    function getBattleshipSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            battleshipCost,
            battleshipRequiredInfrastructure,
            battleshipRequiredTechnology
        );
    }

    ///@dev this function is only callable by the contract owner
    function updateCruiserSpecs(
        uint256 newPrice,
        uint256 newRequiredInf,
        uint256 newRequiredTech
    ) public onlyOwner {
        cruiserCost = newPrice;
        cruiserRequiredInfrastructure = newRequiredInf;
        cruiserRequiredTechnology = newRequiredTech;
    }

    function getCruiserSpecs() public view returns (uint256, uint256, uint256) {
        return (
            cruiserCost,
            cruiserRequiredInfrastructure,
            cruiserRequiredTechnology
        );
    }

    modifier onlyBattle() {
        require(msg.sender == navyBattleAddress, "only callable from battle");
        _;
    }

    ///@dev this is a public function that is only callable from the Navt Battle contract
    ///@dev this funtion will take the results of a battle and decrease the number of vessels
    ///@notice this function will take the results of a battle and decrease number of vessels
    ///@param defenderLosses is an array containing the defenders losses from the battle, each member of the array represents a different vessel
    ///@param defenderId this is the nation id of the defending nation in the battle
    ///@param attackerLosses is an array containing the attacker losses from the battle, each memeber of the array represents a different vessel
    ///@param attackerId this is the nation id of the attacking nation in the battle
    function decrementLosses(
        uint256[] memory defenderLosses,
        uint256 defenderId,
        uint256[] memory attackerLosses,
        uint256 attackerId
    ) public onlyBattle {
        for (uint256 i; i < defenderLosses.length; i++) {
            if (defenderLosses[i] == 1) {
                idToNavy[defenderId].corvetteCount -= 1;
            } else if (defenderLosses[i] == 2) {
                idToNavy[defenderId].landingShipCount -= 1;
            } else if (defenderLosses[i] == 3) {
                idToNavy[defenderId].battleshipCount -= 1;
            } else if (defenderLosses[i] == 4) {
                idToNavy[defenderId].cruiserCount -= 1;
            } else if (defenderLosses[i] == 5) {
                navy2.decreaseFrigateCount(defenderId, 1);
            } else if (defenderLosses[i] == 6) {
                navy2.decreaseDestroyerCount(defenderId, 1);
            } else if (defenderLosses[i] == 7) {
                navy2.decreaseSubmarineCount(defenderId, 1);
            } else if (defenderLosses[i] == 8) {
                navy2.decreaseAircraftCarrierCount(defenderId, 1);
            }
        }
        for (uint256 i; i < attackerLosses.length; i++) {
            if (attackerLosses[i] == 1) {
                idToNavy[attackerId].corvetteCount -= 1;
            } else if (defenderLosses[i] == 2) {
                idToNavy[attackerId].landingShipCount -= 1;
            } else if (defenderLosses[i] == 3) {
                idToNavy[attackerId].battleshipCount -= 1;
            } else if (defenderLosses[i] == 4) {
                idToNavy[attackerId].cruiserCount -= 1;
            } else if (defenderLosses[i] == 5) {
                navy2.decreaseFrigateCount(attackerId, 1);
            } else if (defenderLosses[i] == 6) {
                navy2.decreaseDestroyerCount(attackerId, 1);
            } else if (defenderLosses[i] == 7) {
                navy2.decreaseSubmarineCount(attackerId, 1);
            } else if (defenderLosses[i] == 8) {
                navy2.decreaseAircraftCarrierCount(attackerId, 1);
            }
        }
    }

    function getNavyVesselCount(uint256 id) public view returns (uint256) {
        uint256 corvetteCount = idToNavy[id].corvetteCount;
        uint256 landingShipCount = idToNavy[id].landingShipCount;
        uint256 battleshipCount = idToNavy[id].battleshipCount;
        uint256 cruiserCount = idToNavy[id].cruiserCount;
        uint256 frigateCount = navy2.getFrigateCount(id);
        uint256 destroyerCount = navy2.getDestroyerCount(id);
        uint256 submarineCount = navy2.getSubmarineCount(id);
        uint256 aircraftCarrierCount = navy2.getAircraftCarrierCount(id);
        uint256 navyVessels = (corvetteCount +
            landingShipCount +
            battleshipCount +
            cruiserCount +
            frigateCount +
            destroyerCount +
            submarineCount +
            aircraftCarrierCount);
        return navyVessels;
    }

    ///@dev this is a public function callable only by the nation owner
    ///@dev this function will allow a nation owner to purchase a corvette vessel
    ///@notice this function will allow a nation owner to purchase a corvette vessel
    ///@param amount this is the number of corvettes being purchased
    ///@param id this is the naton id of the nation purchasing vessels
    function buyCorvette(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        (uint256 availablePurchases, ) = addNav.getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 drydockAmount = ImprovementsContract1(
            improvementsContract1Address
        ).getDrydockCount(id);
        uint256 currentShips = getCorvetteCount(id);
        uint256 nationInfrastructure = inf.getInfrastructureCount(id);
        uint256 additionalPurchases = (nationInfrastructure /
            corvetteRequiredInfrastructure);
        require(
            (currentShips + amount) <= (drydockAmount + additionalPurchases),
            "need more drydocks or infrastructure"
        );
        require(
            inf.getTechnologyCount(id) >= corvetteRequiredTechnology,
            "need more technology"
        );
        uint256 purchasePrice = (corvetteCost * amount);
        bool steel = bonus.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].corvetteCount += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
        emit CorvettePurchased(id, amount, purchasePrice);
    }

    function decommissionCorvette(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        require(amount <= idToNavy[id].corvetteCount, "not enough corvettes");
        idToNavy[id].corvetteCount -= amount;
        emit CorvetteDecommissioned(id, amount);
    }

    ///@dev this is a public view function that will return the number of corvettes a nation owns
    ///@dev this function wll return the number of corvettes a nation owns
    ///@notice this functon will return the number of corvettes a nation owns
    ///@param id this is the nation id of the nation being queried
    ///@return uint256 this is the number of corvettes for a given nation
    function getCorvetteCount(uint256 id) public view returns (uint256) {
        uint256 corvetteAmount = idToNavy[id].corvetteCount;
        return corvetteAmount;
    }

    ///@dev this is a public function callable only by the nation owner
    ///@dev this function will allow a nation owner to purchase a landing ships vessel
    ///@notice this function will allow a nation owner to purchase a landing ships vessel
    ///@param amount this is the number of landing ships being purchased
    ///@param id this is the naton id of the nation purchasing vessels
    function buyLandingShip(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        (uint256 availablePurchases, ) = addNav.getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 shipyardAmount = ImprovementsContract3(
            improvementsContract3Address
        ).getShipyardCount(id);
        uint256 currentShips = getLandingShipCount(id);
        uint256 nationInfrastructure = inf.getInfrastructureCount(id);
        uint256 additionalPurchases = (nationInfrastructure /
            landingShipRequiredInfrastructure);
        require(
            (currentShips + amount) <= (shipyardAmount + additionalPurchases),
            "need more shipyards or infrastructure"
        );
        require(
            inf.getTechnologyCount(id) >= landingShipRequiredTechnology,
            "need more technology"
        );
        uint256 purchasePrice = landingShipCost * amount;
        bool steel = bonus.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].landingShipCount += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
        emit LandingShipPurchased(id, amount, purchasePrice);
    }

    function decomissionLandingShip(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        require(
            amount <= idToNavy[id].landingShipCount,
            "not enough landing ships"
        );
        idToNavy[id].landingShipCount -= amount;
        emit LandingShipDecommissioned(id, amount);
    }

    ///@dev this is a public view function that will return the number of landing ships a nation owns
    ///@dev this function wll return the number of landing ships a nation owns
    ///@notice this functon will return the number of landing ships a nation owns
    ///@param id this is the nation id of the nation being queried
    ///@return uint256 this is the number of landing ships for a given nation
    function getLandingShipCount(uint256 id) public view returns (uint256) {
        uint256 landingShipAmount = idToNavy[id].landingShipCount;
        return landingShipAmount;
    }

    ///@dev this is a public function callable only by the nation owner
    ///@dev this function will allow a nation owner to purchase a battleship vessel
    ///@notice this function will allow a nation owner to purchase a battleship vessel
    ///@param amount this is the number of battleship being purchased
    ///@param id this is the naton id of the nation purchasing vessels
    function buyBattleship(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        (uint256 availablePurchases, ) = addNav.getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 drydockAmount = ImprovementsContract1(
            improvementsContract1Address
        ).getDrydockCount(id);
        uint256 currentShips = getBattleshipCount(id);
        uint256 nationInfrastructure = inf.getInfrastructureCount(id);
        uint256 additionalPurchases = (nationInfrastructure /
            battleshipRequiredInfrastructure);
        require(
            (currentShips + amount) <= (drydockAmount + additionalPurchases),
            "need more drydocks or infrastructure"
        );
        require(
            inf.getTechnologyCount(id) >= battleshipRequiredTechnology,
            "need more technology"
        );
        uint256 purchasePrice = battleshipCost * amount;
        bool steel = bonus.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].battleshipCount += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
        emit BattleshipPurchased(id, amount, purchasePrice);
    }

    function decommissionBattleship(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        require(
            amount <= idToNavy[id].battleshipCount,
            "not enough battleships"
        );
        idToNavy[id].battleshipCount -= amount;
        emit BattleshipDecommissioned(id, amount);
    }

    ///@dev this is a public view function that will return the number of battleships a nation owns
    ///@dev this function wll return the number of battleships a nation owns
    ///@notice this functon will return the number of battleships a nation owns
    ///@param id this is the nation id of the nation being queried
    ///@return uint256 this is the number of battleships for a given nation
    function getBattleshipCount(uint256 id) public view returns (uint256) {
        uint256 battleshipAmount = idToNavy[id].battleshipCount;
        return battleshipAmount;
    }

    ///@dev this is a public function callable only by the nation owner
    ///@dev this function will allow a nation owner to purchase a cruiser vessel
    ///@notice this function will allow a nation owner to purchase a cruiser vessel
    ///@param amount this is the number of cruisers being purchased
    ///@param id this is the naton id of the nation purchasing vessels
    function buyCruiser(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        (uint256 availablePurchases, ) = addNav.getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 drydockAmount = ImprovementsContract1(
            improvementsContract1Address
        ).getDrydockCount(id);
        uint256 currentShips = getCruiserCount(id);
        uint256 nationInfrastructure = inf.getInfrastructureCount(id);
        uint256 additionalPurchases = (nationInfrastructure /
            cruiserRequiredInfrastructure);
        require(
            (currentShips + amount) <= (drydockAmount + additionalPurchases),
            "need more drydocks or infrastructure"
        );
        require(
            inf.getTechnologyCount(id) >= cruiserRequiredTechnology,
            "need more technology"
        );
        uint256 purchasePrice = cruiserCost * amount;
        bool steel = bonus.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].cruiserCount += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
        emit CruiserPurchased(id, amount, purchasePrice);
    }

    function decommissionCruiser(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        require(amount <= idToNavy[id].cruiserCount, "not enough cruisers");
        idToNavy[id].cruiserCount -= amount;
        emit CruiserDecommissioned(id, amount);
    }

    ///@dev this is a public view function that will return the number of cruisers a nation owns
    ///@dev this function wll return the number of cruisers a nation owns
    ///@notice this functon will return the number of cruisers a nation owns
    ///@param id this is the nation id of the nation being queried
    ///@return uint256 this is the number of cruisers for a given nation
    function getCruiserCount(uint256 id) public view returns (uint256) {
        uint256 cruiserAmount = idToNavy[id].cruiserCount;
        return cruiserAmount;
    }

    modifier onlyNukeContract() {
        require(msg.sender == nukes, "only callable from nuke contract");
        _;
    }

    ///@dev this is a public function only callable from the nuke contract
    ///@dev this function will decrease the amount of ships that are vulnerable to nuclear attacks when a nation is attacked by a nuke strike
    ///@notice this function will decrease the amount of ships that are vulnerable to nuclear attacks when a nation is attacked by a nuke strike
    ///@notice vessels available to nuke strikes are corvettes, landing ships, cruisers and frigates
    ///@notice a nuke strike will reduce the number of these ships by 25% (12% with a fallout shelter system)
    ///@param defenderId this is the nation id of the nation being attacked
    function decreaseNavyFromNukeContract(
        uint256 defenderId
    ) public onlyNukeContract {
        uint256 percentage = 40;
        bool falloutShelter = won1.getFalloutShelterSystem(defenderId);
        if (falloutShelter) {
            percentage = 20;
        }
        uint256 corvetteCountToReduce = (idToNavy[defenderId].corvetteCount *
            percentage) / 100;
        uint256 landingShipCountToReduce = (idToNavy[defenderId]
            .landingShipCount * percentage) / 100;
        uint256 cruiserCountToReduce = (idToNavy[defenderId].cruiserCount *
            percentage) / 100;
        uint256 frigateCountToReduce = (navy2.getFrigateCount(defenderId) *
            percentage) / 100;
        idToNavy[defenderId].corvetteCount -= corvetteCountToReduce;
        idToNavy[defenderId].landingShipCount -= landingShipCountToReduce;
        idToNavy[defenderId].cruiserCount -= cruiserCountToReduce;
        navy2.decreaseFrigateCount(defenderId, frigateCountToReduce);
        emit NukeDamageToNavy(
            defenderId,
            corvetteCountToReduce,
            landingShipCountToReduce,
            cruiserCountToReduce,
            frigateCountToReduce
        );
    }
}

///@title NavyContract
///@author OxSnosh
///@dev this contract inherits from openzeppelin's ownable contract
///@notice this contract will allow a user to purchase navy vessels
contract NavyContract2 is Ownable {
    address public treasuryAddress;
    address public improvementsContract1Address;
    address public improvementsContract3Address;
    address public improvements4;
    address public resources;
    address public navyBattleAddress;
    address public military;
    address public nukes;
    address public wonders1;
    address public countryMinter;
    address public navalActions;
    address public additionalNavy;
    address public bonusResources;
    address public navy1Address;
    address public infrastructure;
    uint256 public frigateCost = 750000 * (10 ** 18);
    uint256 public frigateRequiredInfrastructure = 3500;
    uint256 public frigateRequiredTechnology = 400;
    uint256 public destroyerCost = 1000000 * (10 ** 18);
    uint256 public destroyerRequiredInfrastructure = 4000;
    uint256 public destroyerRequiredTechnology = 600;
    uint256 public submarineCost = 1500000 * (10 ** 18);
    uint256 public submarineRequiredInfrastructure = 4500;
    uint256 public submarineRequiredTechnology = 750;
    uint256 public aircraftCarrierCost = 2000000 * (10 ** 18);
    uint256 public aircraftCarrierRequiredInfrastructure = 5000;
    uint256 public aircraftCarrierRequiredTechnology = 1000;

    struct Navy {
        uint256 frigateCount;
        uint256 destroyerCount;
        uint256 submarineCount;
        uint256 aircraftCarrierCount;
    }

    mapping(uint256 => Navy) public idToNavy;

    event FrigatePurchased(
        uint256 indexed id,
        uint256 indexed amount,
        uint256 indexed purchasePrice
    );

    event DestroyerPurchased(
        uint256 indexed id,
        uint256 indexed amount,
        uint256 indexed purchasePrice
    );

    event SubmarinePurchased(
        uint256 indexed id,
        uint256 indexed amount,
        uint256 indexed purchasePrice
    );

    event AircraftCarrierPurchased(
        uint256 indexed id,
        uint256 indexed amount,
        uint256 indexed purchasePrice
    );

    event FrigateDecommissioned(uint256 indexed id, uint256 indexed amount);

    event DestroyerDecommissioned(uint256 indexed id, uint256 indexed amount);

    event SubmarineDecommissioned(uint256 indexed id, uint256 indexed amount);

    event AircraftCarrierDecommissioned(
        uint256 indexed id,
        uint256 indexed amount
    );

    ResourcesContract res;
    MilitaryContract mil;
    ImprovementsContract4 imp4;
    NukeContract nuke;
    WondersContract1 won1;
    NavalActionsContract navAct;
    CountryMinter mint;
    AdditionalNavyContract addNav;
    BonusResourcesContract bonus;
    NavyContract navy1;
    InfrastructureContract inf;

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "function only callable from countryMinter"
        );
        _;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _treasuryAddress,
        address _improvementsContract1Address,
        address _improvementsContract3Address,
        address _improvements4,
        address _resources,
        address _military,
        address _nukes,
        address _wonders1,
        address _navalActions,
        address _additionalNavy
    ) public onlyOwner {
        treasuryAddress = _treasuryAddress;
        improvementsContract1Address = _improvementsContract1Address;
        improvementsContract3Address = _improvementsContract3Address;
        improvements4 = _improvements4;
        imp4 = ImprovementsContract4(_improvements4);
        resources = _resources;
        res = ResourcesContract(_resources);
        military = _military;
        mil = MilitaryContract(_military);
        nukes = _nukes;
        nuke = NukeContract(_nukes);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        navalActions = _navalActions;
        navAct = NavalActionsContract(_navalActions);
        additionalNavy = _additionalNavy;
        addNav = AdditionalNavyContract(_additionalNavy);
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings2(
        address _countryMinter,
        address _bonusResources,
        address _navy1,
        address _infrastructure
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        bonusResources = _bonusResources;
        bonus = BonusResourcesContract(_bonusResources);
        navy1Address = _navy1;
        navy1 = NavyContract(_navy1);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
    }

    ///@dev this is a public function only callable from the countryMinter contract
    ///@dev this function will allow a nation owner to buy navy vessels
    ///@notice this function will allow a nation owner to buy navy vessels
    ///@param id this is the nation id of the nation being minted
    function generateNavy2(uint256 id) public onlyCountryMinter {
        Navy memory newNavy = Navy(0, 0, 0, 0);
        idToNavy[id] = newNavy;
    }

    ///@dev this function is only callable by the contract owner
    function updateFrigateSpecs(
        uint256 newPrice,
        uint256 newRequiredInf,
        uint256 newRequiredTech
    ) public onlyOwner {
        frigateCost = newPrice;
        frigateRequiredInfrastructure = newRequiredInf;
        frigateRequiredTechnology = newRequiredTech;
    }

    function getFrigateSpecs() public view returns (uint256, uint256, uint256) {
        return (
            frigateCost,
            frigateRequiredInfrastructure,
            frigateRequiredTechnology
        );
    }

    ///@dev this function is only callable by the contract owner
    function updateDestroyerSpecs(
        uint256 newPrice,
        uint256 newRequiredInf,
        uint256 newRequiredTech
    ) public onlyOwner {
        destroyerCost = newPrice;
        destroyerRequiredInfrastructure = newRequiredInf;
        destroyerRequiredTechnology = newRequiredTech;
    }

    function getDestroyerSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            destroyerCost,
            destroyerRequiredInfrastructure,
            destroyerRequiredTechnology
        );
    }

    ///@dev this function is only callable by the contract owner
    function updateSubmarineSpecs(
        uint256 newPrice,
        uint256 newRequiredInf,
        uint256 newRequiredTech
    ) public onlyOwner {
        submarineCost = newPrice;
        submarineRequiredInfrastructure = newRequiredInf;
        submarineRequiredTechnology = newRequiredTech;
    }

    function getSubmarineSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            submarineCost,
            submarineRequiredInfrastructure,
            submarineRequiredTechnology
        );
    }

    ///@dev this function is only callable by the contract owner
    function updateAircraftCarrierSpecs(
        uint256 newPrice,
        uint256 newRequiredInf,
        uint256 newRequiredTech
    ) public onlyOwner {
        aircraftCarrierCost = newPrice;
        aircraftCarrierRequiredInfrastructure = newRequiredInf;
        aircraftCarrierRequiredTechnology = newRequiredTech;
    }

    function getAircraftCarrierSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            aircraftCarrierCost,
            aircraftCarrierRequiredInfrastructure,
            aircraftCarrierRequiredTechnology
        );
    }

    ///@dev this is a public function callable only by the nation owner
    ///@dev this function will allow a nation owner to purchase a frigates vessel
    ///@notice this function will allow a nation owner to purchase a frigates vessel
    ///@param amount this is the number of frigates being purchased
    ///@param id this is the naton id of the nation purchasing vessels
    function buyFrigate(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        (uint256 availablePurchases, ) = addNav.getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 shipyardAmount = ImprovementsContract3(
            improvementsContract3Address
        ).getShipyardCount(id);
        uint256 currentShips = getFrigateCount(id);
        uint256 nationInfrastructure = inf.getInfrastructureCount(id);
        uint256 additionalPurchases = (nationInfrastructure /
            frigateRequiredInfrastructure);
        require(
            (currentShips + amount) <= (shipyardAmount + additionalPurchases),
            "need more shipyards or infrastructure"
        );
        require(
            inf.getTechnologyCount(id) >= frigateRequiredTechnology,
            "need more technology"
        );
        uint256 purchasePrice = frigateCost * amount;
        bool steel = bonus.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        bool microchips = bonus.viewMicrochips(id);
        if (microchips) {
            purchasePrice = ((purchasePrice * 90) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].frigateCount += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
        emit FrigatePurchased(id, amount, purchasePrice);
    }

    function decommissionFrigate(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        require(amount <= idToNavy[id].frigateCount, "not enough frigates");
        idToNavy[id].frigateCount -= amount;
        emit FrigateDecommissioned(id, amount);
    }

    ///@dev this is a public view function that will return the number of frigates a nation owns
    ///@dev this function wll return the number of frigates a nation owns
    ///@notice this functon will return the number of frigates a nation owns
    ///@param id this is the nation id of the nation being queried
    ///@return uint256 this is the number of frigates for a given nation
    function getFrigateCount(uint256 id) public view returns (uint256) {
        uint256 frigateAmount = idToNavy[id].frigateCount;
        return frigateAmount;
    }

    modifier onlyNavy1Contract () {
        require(msg.sender == navy1Address, "function only callable from the navy1 contract");
        _;
    }

    function decreaseFrigateCount(
        uint256 id,
        uint256 amount
    ) public onlyNavy1Contract {
        idToNavy[id].frigateCount -= amount;
    }

    ///@dev this is a public function callable only by the nation owner
    ///@dev this function will allow a nation owner to purchase a destroyer vessel
    ///@notice this function will allow a nation owner to purchase a destroyer vessel
    ///@param amount this is the number of destroyers being purchased
    ///@param id this is the naton id of the nation purchasing vessels
    function buyDestroyer(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        (uint256 availablePurchases, ) = addNav.getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 drydockAmount = ImprovementsContract1(
            improvementsContract1Address
        ).getDrydockCount(id);
        uint256 currentShips = getDestroyerCount(id);
        uint256 nationInfrastructure = inf.getInfrastructureCount(id);
        uint256 additionalPurchases = (nationInfrastructure /
            destroyerRequiredInfrastructure);
        require(
            (currentShips + amount) <= (drydockAmount + additionalPurchases),
            "need more drydocks or infrastructure"
        );
        require(
            inf.getTechnologyCount(id) >= destroyerRequiredTechnology,
            "need more technology"
        );
        uint256 purchasePrice = destroyerCost * amount;
        bool steel = bonus.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        bool microchips = bonus.viewMicrochips(id);
        if (microchips) {
            purchasePrice = ((purchasePrice * 90) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].destroyerCount += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
        emit DestroyerPurchased(id, amount, purchasePrice);
    }

    function decommissionDestroyer(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        require(amount <= idToNavy[id].destroyerCount, "not enough destroyers");
        idToNavy[id].destroyerCount -= amount;
        emit DestroyerDecommissioned(id, amount);
    }

    ///@dev this is a public view function that will return the number of destroyers a nation owns
    ///@dev this function wll return the number of destroyers a nation owns
    ///@notice this functon will return the number of destroyers a nation owns
    ///@param id this is the nation id of the nation being queried
    ///@return uint256 this is the number of destroyers for a given nation
    function getDestroyerCount(uint256 id) public view returns (uint256) {
        uint256 destroyerAmount = idToNavy[id].destroyerCount;
        return destroyerAmount;
    }

    function decreaseDestroyerCount(
        uint256 id,
        uint256 amount
    ) public onlyNavy1Contract {
        idToNavy[id].destroyerCount -= amount;
    }

    ///@dev this is a public function callable only by the nation owner
    ///@dev this function will allow a nation owner to purchase a submarine vessel
    ///@notice this function will allow a nation owner to purchase a submarine vessel
    ///@param amount this is the number of submarines being purchased
    ///@param id this is the naton id of the nation purchasing vessels
    function buySubmarine(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        (uint256 availablePurchases, ) = addNav.getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 shipyardAmount = ImprovementsContract3(
            improvementsContract3Address
        ).getShipyardCount(id);
        uint256 currentShips = getSubmarineCount(id);
        uint256 nationInfrastructure = inf.getInfrastructureCount(id);
        uint256 additionalPurchases = (nationInfrastructure /
            submarineRequiredInfrastructure);
        require(
            (currentShips + amount) <= (shipyardAmount + additionalPurchases),
            "need more shipyards or infrastructure"
        );
        require(
            inf.getTechnologyCount(id) >= submarineRequiredTechnology,
            "need more technology"
        );
        uint256 purchasePrice = submarineCost * amount;
        bool steel = bonus.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        bool microchips = bonus.viewMicrochips(id);
        if (microchips) {
            purchasePrice = ((purchasePrice * 90) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].submarineCount += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
        emit SubmarinePurchased(id, amount, purchasePrice);
    }

    function decommissionSubmarine(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        require(amount <= idToNavy[id].submarineCount, "not enough submarines");
        idToNavy[id].submarineCount -= amount;
        emit SubmarineDecommissioned(id, amount);
    }

    ///@dev this is a public view function that will return the number of submarines a nation owns
    ///@dev this function wll return the number of submarines ttes a nation owns
    ///@notice this functon will return the number of submarines a nation owns
    ///@param id this is the nation id of the nation being queried
    ///@return uint256 this is the number of submarines for a given nation
    function getSubmarineCount(uint256 id) public view returns (uint256) {
        uint256 submarineAmount = idToNavy[id].submarineCount;
        return submarineAmount;
    }

    function decreaseSubmarineCount(
        uint256 id,
        uint256 amount
    ) public onlyNavy1Contract {
        idToNavy[id].submarineCount -= amount;
    }

    ///@dev this is a public function callable only by the nation owner
    ///@dev this function will allow a nation owner to purchase a aircraft carrier vessel
    ///@notice this function will allow a nation owner to purchase a aircraft carrier vessel
    ///@param amount this is the number of aircraft carriers being purchased
    ///@param id this is the naton id of the nation purchasing vessels
    function buyAircraftCarrier(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        (uint256 availablePurchases, ) = addNav.getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 shipyardAmount = ImprovementsContract3(
            improvementsContract3Address
        ).getShipyardCount(id);
        uint256 currentShips = getAircraftCarrierCount(id);
        uint256 nationInfrastructure = inf.getInfrastructureCount(id);
        uint256 additionalPurchases = (nationInfrastructure /
            aircraftCarrierRequiredInfrastructure);
        require(
            (currentShips + amount) <= (shipyardAmount + additionalPurchases),
            "need more shipyards or infrastructure"
        );
        require(
            inf.getTechnologyCount(id) >= aircraftCarrierRequiredTechnology,
            "need more technology"
        );
        uint256 purchasePrice = aircraftCarrierCost * amount;
        bool steel = bonus.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        bool microchips = bonus.viewMicrochips(id);
        if (microchips) {
            purchasePrice = ((purchasePrice * 90) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].aircraftCarrierCount += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
        emit AircraftCarrierPurchased(id, amount, purchasePrice);
    }

    function decommissionAircraftCarrier(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        require(
            amount <= idToNavy[id].aircraftCarrierCount,
            "not enough aircraft carriers"
        );
        idToNavy[id].aircraftCarrierCount -= amount;
        emit AircraftCarrierDecommissioned(id, amount);
    }

    ///@dev this is a public view function that will return the number of aircraft carriers a nation owns
    ///@dev this function wll return the number of aircraft carriers a nation owns
    ///@notice this functon will return the number of aircraft carriers a nation owns
    ///@param id this is the nation id of the nation being queried
    ///@return uint256 this is the number of aircraft carriers for a given nation
    function getAircraftCarrierCount(uint256 id) public view returns (uint256) {
        uint256 aircraftCarrierAmount = idToNavy[id].aircraftCarrierCount;
        return aircraftCarrierAmount;
    }

    function decreaseAircraftCarrierCount(
        uint256 id,
        uint256 amount
    ) public onlyNavy1Contract {
        idToNavy[id].aircraftCarrierCount -= amount;
    }
}

///@title AdditionalNavyContract
///@author OxSnosh
///@dev this contract inherits from the openzeppelin ownabl contract
///@notice this contract will keep track of additional information about a nations navy
contract AdditionalNavyContract is Ownable {
    address public navy;
    address public navalActions;
    address public military;
    address public wonders1;
    address public improvements4;
    address public navy2;

    NavyContract nav;
    NavalActionsContract navAct;
    MilitaryContract mil;
    WondersContract1 won1;
    ImprovementsContract4 imp4;
    NavyContract2 nav2;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _navy,
        address _navalActions,
        address _military,
        address _wonders1,
        address _improvements4,
        address _navy2
    ) public onlyOwner {
        navy = _navy;
        nav = NavyContract(_navy);
        navalActions = _navalActions;
        navAct = NavalActionsContract(_navalActions);
        military = _military;
        mil = MilitaryContract(_military);
        wonders1 = wonders1;
        won1 = WondersContract1(_wonders1);
        improvements4 = _improvements4;
        imp4 = ImprovementsContract4(_improvements4);
        navy2 = _navy2;
        nav2 = NavyContract2(_navy2);
    }

    ///@dev this is a public view function
    ///@dev this function will return a nations available daily navy vessel purchases
    ///@notice this function will return a nations available daily navy vessel purchases
    ///@param id this is the nation id of the nation being queried
    ///@return uint256 is the number of available navy vessel purchases for the day for that nation
    function getAvailablePurchases(
        uint256 id
    ) public view returns (uint256, uint256) {
        uint256 purchasesToday = navAct.getPurchasesToday(id);
        uint256 maxDailyPurchases;
        bool isWar = mil.getWarPeacePreference(id);
        bool foreignNavalBase = won1.getForeignNavalBase(id);
        if (isWar) {
            if (foreignNavalBase) {
                maxDailyPurchases = 7;
            } else if (!foreignNavalBase) {
                maxDailyPurchases = 5;
            }
        } else if (!isWar) {
            if (foreignNavalBase) {
                maxDailyPurchases = 4;
            } else if (!foreignNavalBase) {
                maxDailyPurchases = 2;
            }
        }
        uint256 navalConstructionYards = imp4.getNavalConstructionYardCount(id);
        if (navalConstructionYards > 0) {
            maxDailyPurchases += navalConstructionYards;
        }
        uint256 availablePurchases = (maxDailyPurchases - purchasesToday);
        return (availablePurchases, maxDailyPurchases);
    }

    ///@dev this is a public view function that will return the number of blockade capable ships a nation has
    ///@notice this function will return the number of blockade capable ships a nation has
    ///@notice blockade capable ships include battleships, cruisers, frigates and submarines
    ///@param id this is the nation id of the nation being queried
    ///@return uint256 this is the number of blockade capable ships for a given nation
    function getBlockadeCapableShips(uint256 id) public view returns (uint256) {
        uint256 battleships = nav.getBattleshipCount(id);
        uint256 cruisers = nav.getCruiserCount(id);
        uint256 frigates = nav2.getFrigateCount(id);
        uint256 subs = nav2.getSubmarineCount(id);
        uint256 blockadeCapableShips = (battleships +
            cruisers +
            frigates +
            subs);
        return blockadeCapableShips;
    }

    ///@dev this is a public view function that will return the number of ships a nation has that can break a blockade
    ///@notice this function will return the number of ships a nation has that can break a blockade
    ///@notice blockade capable ships include battleships, cruisers, frigates and destroyers
    ///@param id this is the nation id of the nation being queried
    ///@return uint256 this is the number of ships that can break a blockade for a given nation
    function getBreakBlockadeCapableShips(
        uint256 id
    ) public view returns (uint256) {
        uint256 battleships = nav.getBattleshipCount(id);
        uint256 cruisers = nav.getCruiserCount(id);
        uint256 frigates = nav2.getFrigateCount(id);
        uint256 destroyers = nav2.getDestroyerCount(id);
        uint256 breakBlockadeCapableShips = (battleships +
            cruisers +
            frigates +
            destroyers);
        return breakBlockadeCapableShips;
    }

    ///@dev this is a public view function that returns the number of navy vessels that a nations drydocks support
    ///@notice this function will return the number of ships that a nations drydocks support
    ///@notice a nation cannot delete a drydock if it supports a vessel
    ///@notice drydocks support corvettes, battleships, cruisers and destroyers
    ///@param countryId is the nation id of the nation being queried
    ///@return count is the number of vessel supported by the drydocks
    function getVesselCountForDrydock(
        uint256 countryId
    ) public view returns (uint256 count) {
        uint256 corvetteAmount = nav.getCorvetteCount(countryId);
        uint256 battleshipAmount = nav.getBattleshipCount(countryId);
        uint256 cruiserAmount = nav.getCruiserCount(countryId);
        uint256 destroyerAmount = nav2.getDestroyerCount(countryId);
        uint256 shipCount = (corvetteAmount +
            battleshipAmount +
            cruiserAmount +
            destroyerAmount);
        return shipCount;
    }

    ///@dev this is a public view function that returns the number of navy vessels that a nations shipyards support
    ///@notice this function will return the number of ships that a nations shipyards support
    ///@notice a nation cannot delete a shipyard if it supports a vessel
    ///@notice shipyards support landing ships, frigates, submarines and aircraft carriers
    ///@param countryId is the nation id of the nation being queried
    ///@return count is the number of vessel supported by the shipyards
    function getVesselCountForShipyard(
        uint256 countryId
    ) public view returns (uint256 count) {
        uint256 landingShipAmount = nav.getLandingShipCount(countryId);
        uint256 frigateAmount = nav2.getFrigateCount(countryId);
        uint256 submarineAmount = nav2.getSubmarineCount(countryId);
        uint256 aircraftCarrierAmount = nav2.getAircraftCarrierCount(countryId);
        uint256 shipCount = (landingShipAmount +
            frigateAmount +
            submarineAmount +
            aircraftCarrierAmount);
        return shipCount;
    }
}
