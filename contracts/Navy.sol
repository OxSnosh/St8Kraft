//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "./Improvements.sol";
import "./War.sol";
import "./Resources.sol";
import "./Military.sol";
import "./Nuke.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NavalActionsContract is Ownable {
    address public keeper;
    address public navy;
    address public navalBlockade;
    address public breakBlockade;
    address public navalAttack;
    address public countryMinter;

    CountryMinter mint;


    struct NavalActions {
        bool blockadedToday;
        uint256 purchasesToday;
        uint256 actionSlotsUsedToday;
    }

    mapping(uint256 => NavalActions) idToNavalActions;

    function settings (
        address _navalBlockade,
        address _breakBlockade,
        address _navalAttack,
        address _keeper,
        address _navy,
        address _countryMinter
    ) public onlyOwner {
        navalBlockade = _navalBlockade;
        breakBlockade = _breakBlockade;
        navalAttack = _navalAttack;
        navy = _navy;
        keeper = _keeper;
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
    }

    modifier onlyNavalAction() {
        require(
            msg.sender == navalBlockade ||
                msg.sender == breakBlockade ||
                msg.sender == navalAttack,
            "!valid caller"
        );
        _;
    }

    function increaseAction(uint256 id) public onlyNavalAction {
        idToNavalActions[id].actionSlotsUsedToday += 1;
    }

    modifier onlyNavy() {
        require(msg.sender == navy, "!valid caller");
        _;
    }

    function increasePurchases(uint256 id, uint256 amount) public onlyNavy {
        idToNavalActions[id].purchasesToday += amount;
    }

    modifier onlyBlockade() {
        require(msg.sender == navalBlockade, "!valid caller");
        _;
    }

    function toggleBlockaded(uint256 id) public onlyNavy {
        idToNavalActions[id].blockadedToday = true;
    }

    modifier onlyKeeper() {
        require(msg.sender == keeper, "only callable from keeper");
        _;
    }

    function resetActionsToday() public onlyKeeper {
        uint256 countryCount = mint.getCountryCount();
        for (uint256 i = 0; i <= countryCount; i++) {
            idToNavalActions[i].purchasesToday = 0;
            idToNavalActions[i].actionSlotsUsedToday = 0;
            idToNavalActions[i].blockadedToday = false;
        }
    }

    function getPurchasesToday(uint256 id) public view returns (uint256) {
        uint256 purchasesToday = idToNavalActions[id].purchasesToday;
        return purchasesToday;
    }

    function getActionSlotsUsed(uint256 id) public view returns (uint256) {
        uint256 actionSlotsUsed = idToNavalActions[id].actionSlotsUsedToday;
        return actionSlotsUsed;
    }

    function getBlockadedToday(uint256 id) public view returns (bool) {
        bool blockadedToday = idToNavalActions[id].blockadedToday;
        return blockadedToday; 
    }
}

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
    address public navalActions;
    uint256 public corvetteCost = 300000;
    uint256 public landingShipCost = 300000;
    uint256 public battleshipCost = 300000;
    uint256 public cruiserCost = 500000;
    uint256 public frigateCost = 750000;
    uint256 public destroyerCost = 1000000;
    uint256 public submarineCost = 1500000;
    uint256 public aircraftCarrierCost = 2000000;

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
    }

    mapping(uint256 => Navy) public idToNavy;
    mapping(uint256 => address) public idToOwnerNavy;

    ResourcesContract res;
    MilitaryContract mil;
    ImprovementsContract4 imp4;
    NukeContract nuke;
    WondersContract1 won1;
    NavalActionsContract navAct;

    function settings (
        address _treasuryAddress,
        address _improvementsContract1Address,
        address _improvementsContract3Address,
        address _improvements4,
        address _resources,
        address _military,
        address _nukes,
        address _wonders1,
        address _navalActions
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
    }

    function generateNavy(uint256 id, address nationOwner) public {
        Navy memory newNavy = Navy(0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToNavy[id] = newNavy;
        idToOwnerNavy[id] = nationOwner;
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
        uint256 aircraftCarrierAmount = idToNavy[countryId]
            .aircraftCarrierCount;
        uint256 shipCount = (landingShipAmount +
            frigateAmount +
            submarineAmount +
            aircraftCarrierAmount);
        return shipCount;
    }

    modifier onlyBattle() {
        require(msg.sender == navyBattleAddress, "only callable from battle");
        _;
    }

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
                idToNavy[defenderId].frigateCount -= 1;
            } else if (defenderLosses[i] == 6) {
                idToNavy[defenderId].destroyerCount -= 1;
            } else if (defenderLosses[i] == 7) {
                idToNavy[defenderId].submarineCount -= 1;
            } else if (defenderLosses[i] == 8) {
                idToNavy[defenderId].aircraftCarrierCount -= 1;
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
                idToNavy[attackerId].frigateCount -= 1;
            } else if (defenderLosses[i] == 6) {
                idToNavy[attackerId].destroyerCount -= 1;
            } else if (defenderLosses[i] == 7) {
                idToNavy[attackerId].submarineCount -= 1;
            } else if (defenderLosses[i] == 8) {
                idToNavy[attackerId].aircraftCarrierCount -= 1;
            }
        }
    }

    function buyCorvette(uint256 amount, uint256 id) public {
        require(
            idToOwnerNavy[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 availablePurchases = getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 drydockAmount = ImprovementsContract1(
            improvementsContract1Address
        ).getDrydockCount(id);
        require(drydockAmount > 0, "Must own a drydock to purchase");
        uint256 purchasePrice = corvetteCost * amount;
        bool steel = res.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].corvetteCount += amount;
        idToNavy[id].navyVessels += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function getCorvetteCount(uint256 id) public view returns (uint256) {
        uint256 corvetteAmount = idToNavy[id].corvetteCount;
        return corvetteAmount;
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
        uint256 availablePurchases = getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 shipyardAmount = ImprovementsContract3(
            improvementsContract3Address
        ).getShipyardCount(id);
        require(shipyardAmount > 0, "Must own a shipyard to purchase");
        uint256 purchasePrice = landingShipCost * amount;
        bool steel = res.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].landingShipCount += amount;
        idToNavy[id].navyVessels += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function getLandingShipCount(uint256 id) public view returns (uint256) {
        uint256 landingShipAmount = idToNavy[id].landingShipCount;
        return landingShipAmount;
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
        uint256 availablePurchases = getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 drydockAmount = ImprovementsContract1(
            improvementsContract1Address
        ).getDrydockCount(id);
        require(drydockAmount > 0, "Must own a drydock to purchase");
        uint256 purchasePrice = battleshipCost * amount;
        bool steel = res.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].battleshipCount += amount;
        idToNavy[id].navyVessels += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function getBattleshipCount(uint256 id) public view returns (uint256) {
        uint256 battleshipAmount = idToNavy[id].battleshipCount;
        return battleshipAmount;
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
        uint256 availablePurchases = getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 drydockAmount = ImprovementsContract1(
            improvementsContract1Address
        ).getDrydockCount(id);
        require(drydockAmount > 0, "Must own a drydock to purchase");
        uint256 purchasePrice = cruiserCost * amount;
        bool steel = res.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].cruiserCount += amount;
        idToNavy[id].navyVessels += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function getCruiserCount(uint256 id) public view returns (uint256) {
        uint256 cruiserAmount = idToNavy[id].cruiserCount;
        return cruiserAmount;
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
        uint256 availablePurchases = getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 shipyardAmount = ImprovementsContract3(
            improvementsContract3Address
        ).getShipyardCount(id);
        require(shipyardAmount > 0, "Must own a shipyard to purchase");
        uint256 purchasePrice = frigateCost * amount;
        bool steel = res.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        bool microchips = res.viewMicrochips(id);
        if (microchips) {
            purchasePrice = ((purchasePrice * 90) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].frigateCount += amount;
        idToNavy[id].navyVessels += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function getFrigateCount(uint256 id) public view returns (uint256) {
        uint256 frigateAmount = idToNavy[id].frigateCount;
        return frigateAmount;
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
        uint256 availablePurchases = getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 drydockAmount = ImprovementsContract1(
            improvementsContract1Address
        ).getDrydockCount(id);
        require(drydockAmount > 0, "Must own a drydock to purchase");
        uint256 purchasePrice = destroyerCost * amount;
        bool steel = res.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        bool microchips = res.viewMicrochips(id);
        if (microchips) {
            purchasePrice = ((purchasePrice * 90) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].destroyerCount += amount;
        idToNavy[id].navyVessels += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function getDestroyerCount(uint256 id) public view returns (uint256) {
        uint256 destroyerAmount = idToNavy[id].destroyerCount;
        return destroyerAmount;
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
        uint256 availablePurchases = getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 shipyardAmount = ImprovementsContract3(
            improvementsContract3Address
        ).getShipyardCount(id);
        require(shipyardAmount > 0, "Must own a shipyard to purchase");
        uint256 purchasePrice = submarineCost * amount;
        bool steel = res.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        bool microchips = res.viewMicrochips(id);
        if (microchips) {
            purchasePrice = ((purchasePrice * 90) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].submarineCount += amount;
        idToNavy[id].navyVessels += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function getSubmarineCount(uint256 id) public view returns (uint256) {
        uint256 submarineAmount = idToNavy[id].submarineCount;
        return submarineAmount;
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
        uint256 availablePurchases = getAvailablePurchases(id);
        require(
            amount <= availablePurchases,
            "purchase exceeds daily purchase limit"
        );
        uint256 shipyardAmount = ImprovementsContract3(
            improvementsContract3Address
        ).getShipyardCount(id);
        require(shipyardAmount > 0, "Must own a shipyard to purchase");
        uint256 purchasePrice = aircraftCarrierCost * amount;
        bool steel = res.viewSteel(id);
        if (steel) {
            purchasePrice = ((purchasePrice * 85) / 100);
        }
        bool microchips = res.viewMicrochips(id);
        if (microchips) {
            purchasePrice = ((purchasePrice * 90) / 100);
        }
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice);
        idToNavy[id].aircraftCarrierCount += amount;
        idToNavy[id].navyVessels += amount;
        navAct.increasePurchases(id, amount);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function getAircraftCarrierCount(uint256 id) public view returns (uint256) {
        uint256 aircraftCarrierAmount = idToNavy[id].aircraftCarrierCount;
        return aircraftCarrierAmount;
    }

    //callable from fighting contract
    //needs modifier
    function decreaseAircraftCarrierCount(uint256 amount, uint256 id) public {
        idToNavy[id].aircraftCarrierCount -= amount;
        idToNavy[id].navyVessels -= amount;
    }

    modifier onlyNukeContract() {
        require(msg.sender == nukes, "only callable from nuke contract");
        _;
    }

    function decreaseNavyFromNukeContract(uint256 defenderId)
        public
        onlyNukeContract
    {
        //corvettes, landing ships, cruisers, frigates
        uint256 corvetteCount = idToNavy[defenderId].corvetteCount;
        uint256 landingShipCount = idToNavy[defenderId].landingShipCount;
        uint256 cruiserCount = idToNavy[defenderId].cruiserCount;
        uint256 frigateCount = idToNavy[defenderId].frigateCount;
        uint256 percentage = 25;
        bool falloutShelter = won1.getFalloutShelterSystem(defenderId);
        if (falloutShelter) {
            percentage = 12;
        }
        idToNavy[defenderId].corvetteCount -= ((corvetteCount * percentage) /
            100);
        idToNavy[defenderId].landingShipCount -= ((landingShipCount *
            percentage) / 100);
        idToNavy[defenderId].cruiserCount -= ((cruiserCount * percentage) /
            100);
        idToNavy[defenderId].frigateCount -= ((frigateCount * percentage) /
            100);
    }

    function getAvailablePurchases(uint256 id) public view returns (uint256) {
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
        return availablePurchases;
    }

    function getBlockadeCapableShips(uint256 id) public view returns (uint256) {
        uint256 battleships = getBattleshipCount(id);
        uint256 cruisers = getCruiserCount(id);
        uint256 frigates = getFrigateCount(id);
        uint256 subs = getSubmarineCount(id);
        uint256 blockadeCapableShips = (battleships +
            cruisers +
            frigates +
            subs);
        return blockadeCapableShips;
    }

    function getBreakBlockadeCapableShips(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 battleships = getBattleshipCount(id);
        uint256 cruisers = getCruiserCount(id);
        uint256 frigates = getFrigateCount(id);
        uint256 destroyers = getDestroyerCount(id);
        uint256 breakBlockadeCapableShips = (battleships +
            cruisers +
            frigates +
            destroyers);
        return breakBlockadeCapableShips;
    }
}
