//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "./Wonders.sol";
import "./Infrastructure.sol";
import "./Forces.sol";
import "./Fighters.sol";
import "./Navy.sol";
import "./Improvements.sol";
import "./Resources.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BillsContract is Ownable {
    address public countryMinter;
    address public treasury;
    address public wonders1;
    address public infrastructure;
    address public forces;
    address public fighters;
    address public navy;
    address public improvements1;
    address public resources;

    TreasuryContract tsy;
    WondersContract1 won1;
    InfrastructureContract inf;
    ForcesContract frc;
    FightersContract fight;
    NavyContract nav;
    ImprovementsContract1 imp1;
    ResourcesContract res;

    mapping(uint256 => address) public idToOwnerBills;

    constructor(
        address _countryMinter,
        address _treasury,
        address _wonders1,
        address _infrastructure,
        address _forces,
        address _fighters,
        address _navy,
        address _improvements1,
        address _resources
    ) {
        countryMinter = _countryMinter;
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        forces = _forces;
        frc = ForcesContract(_forces);
        fighters = _fighters;
        fight = FightersContract(_fighters);
        navy = _navy;
        nav = NavyContract(_navy);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        resources = _resources;
        res = ResourcesContract(_resources);
    }

    function updateCountryMinter(address newAddress) public onlyOwner {
        countryMinter = newAddress;
    }

    function updateTreasuryContract(address newAddress) public onlyOwner {
        treasury = newAddress;
        tsy = TreasuryContract(newAddress);
    }

    function updateWondersContract1(address newAddress) public onlyOwner {
        wonders1 = newAddress;
        won1 = WondersContract1(newAddress);
    }

    function updateInfrastructureContract(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    function updateForcesContract(address newAddress) public onlyOwner {
        forces = newAddress;
        frc = ForcesContract(newAddress);
    }

    function updateNavyContract(address newAddress) public onlyOwner {
        navy = newAddress;
        nav = NavyContract(newAddress);
    }

    function updateImprovementsContract1(address newAddress) public onlyOwner {
        improvements1 = newAddress;
        imp1 = ImprovementsContract1(newAddress);
    }

    function updateResourcesContract1(address newAddress) public onlyOwner {
        resources = newAddress;
        res = ResourcesContract(newAddress);
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "caller must be country minter contract"
        );
        _;
    }

    function initiateBills(uint256 id, address nationOwner)
        public
        onlyCountryMinter
    {
        idToOwnerBills[id] = nationOwner;
    }

    //need to reduce by a percentage for blockades
    function payBills(uint256 id) public {
        require(idToOwnerBills[id] == msg.sender, "!nation owner");
        uint256 availableFunds = tsy.checkBalance(id);
        uint256 billsPayable = getBillsPayable(id);
        require(
            availableFunds >= billsPayable,
            "balance not high enough to pay bills"
        );
        tsy.decreaseBalanceOnBillsPaid(id, billsPayable);
    }

    function getBillsPayable(uint256 id) public view returns (uint256) {
        uint256 daysSinceLastPayment = tsy.getDaysSinceLastBillsPaid(id);
        uint256 infrastructureBillsPayable = calculateDailyBillsFromInfrastructure(
                id
            );
        uint256 militaryBillsPayable = calculateDailyBillsFromMilitary(id);
        uint256 improvementBillsPayable = calculateDailyBillsFromImprovements(
            id
        );
        uint256 wonderCount = won1.getWonderCount(id);
        uint256 wonderBillsPayable = (wonderCount * 5000);
        uint256 dailyBillsPayable = infrastructureBillsPayable +
            militaryBillsPayable +
            improvementBillsPayable +
            wonderBillsPayable;
        uint256 billsPayable = (dailyBillsPayable * daysSinceLastPayment);
        return billsPayable;
    }

    function calculateDailyBillsFromInfrastructure(uint256 id)
        public
        view
        returns (uint256 infrastructureBills)
    {
        uint256 infrastructureAmount = inf.getInfrastructureCount(id);
        uint256 upkeep;
        uint256 infrastructureCostPerLevel;
        if (infrastructureAmount < 100) {
            upkeep = ((400 * infrastructureAmount) + 20);
            infrastructureCostPerLevel = (upkeep / 100);
        } else if (infrastructureAmount < 200) {
            upkeep = ((500 * infrastructureAmount) + 20);
            infrastructureCostPerLevel = (upkeep / 100);
        } else if (infrastructureAmount < 300) {
            upkeep = ((600 * infrastructureAmount) + 20);
            infrastructureCostPerLevel = (upkeep / 100);
        } else if (infrastructureAmount < 500) {
            upkeep = ((700 * infrastructureAmount) + 20);
            infrastructureCostPerLevel = (upkeep / 100);
        } else if (infrastructureAmount < 700) {
            upkeep = ((800 * infrastructureAmount) + 20);
            infrastructureCostPerLevel = (upkeep / 100);
        } else if (infrastructureAmount < 1000) {
            upkeep = ((900 * infrastructureAmount) + 20);
            infrastructureCostPerLevel = (upkeep / 100);
        } else if (infrastructureAmount < 2000) {
            upkeep = ((110 * infrastructureAmount) + 20);
            infrastructureCostPerLevel = (upkeep / 100);
        } else if (infrastructureAmount < 3000) {
            upkeep = ((130 * infrastructureAmount) + 20);
            infrastructureCostPerLevel = (upkeep / 100);
        } else if (infrastructureAmount < 4000) {
            upkeep = ((150 * infrastructureAmount) + 20);
            infrastructureCostPerLevel = (upkeep / 100);
        } else if (infrastructureAmount < 5000) {
            upkeep = ((170 * infrastructureAmount) + 20);
            infrastructureCostPerLevel = (upkeep / 100);
        } else if (infrastructureAmount < 8000) {
            upkeep = ((1725 * infrastructureAmount) + 20);
            infrastructureCostPerLevel = (upkeep / 1000);
        } else if (infrastructureAmount < 15000) {
            upkeep = ((175 * infrastructureAmount) + 20);
            infrastructureCostPerLevel = (upkeep / 100);
        } else {
            upkeep = ((180 * infrastructureAmount) + 20);
            infrastructureCostPerLevel = (upkeep / 100);
        }
        uint256 baseInfrastructureBillsDue = infrastructureCostPerLevel *
            infrastructureAmount;
        uint256 dailyInfrastructureBillsDue = calculateModifiedInfrastrucureUpkeep(
                baseInfrastructureBillsDue,
                id
            );
        return dailyInfrastructureBillsDue;
    }

    function calculateModifiedInfrastrucureUpkeep(
        uint256 baseDailyInfrastructureUpkeep,
        uint256 id
    ) public view returns (uint256) {
        uint256 infrastructureUpkeepModifier = 100;
        bool iron = res.viewIron(id);
        if (iron) {
            infrastructureUpkeepModifier -= 10;
        }
        bool lumber = res.viewLumber(id);
        if (lumber) {
            infrastructureUpkeepModifier -= 8;
        }
        bool uranium = res.viewUranium(id);
        if (uranium) {
            infrastructureUpkeepModifier -= 3;
        }
        uint256 dailyInfrastructureBillsDue = ((baseDailyInfrastructureUpkeep *
            infrastructureUpkeepModifier) / 100);
        return dailyInfrastructureBillsDue;
    }

    function calculateDailyBillsFromMilitary(uint256 id)
        public
        view
        returns (uint256 militaryBills)
    {
        uint256 soldierCount = frc.getSoldierCount(id);
        uint256 soldierUpkeep = getSoldierUpkeep(id, soldierCount);
        uint256 tankCount = frc.getTankCount(id);
        uint256 tankUpkeep = getTankUpkeep(id, tankCount);
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 aircraftUpkeep = getAircraftUpkeep(id, aircraftCount);
        uint256 navyUpkeep = getNavyUpkeep(id);
        uint256 nukeCount = frc.getNukeCount(id);
        uint256 nukeUpkeep = getNukeUpkeep(id, nukeCount);
        uint256 cruiseMissileCount = frc.getCruiseMissileCount(id);
        uint256 cruiseMissileUpkeep = getCruiseMissileUpkeep(id, cruiseMissileCount);
        uint256 dailyMilitaryUpkeep = soldierUpkeep +
            tankUpkeep +
            aircraftUpkeep +
            navyUpkeep +
            nukeUpkeep +
            cruiseMissileUpkeep;
        return dailyMilitaryUpkeep;
    }

    function getSoldierUpkeep(uint256 id, uint256 soldierCount)
        public
        view
        returns (uint256)
    {
        uint256 soldierUpkeep = (soldierCount * 2);
        uint256 soldierUpkeepModifier = 100;
        bool lead = res.viewLead(id);
        if (lead) {
            soldierUpkeepModifier -= 20;
        }
        bool pigs = res.viewPigs(id);
        if (pigs) {
            soldierUpkeepModifier -= 25;
        }
        uint256 barracks = imp1.getBarracksCount(id);
        if (barracks > 0) {
            soldierUpkeepModifier -= (10 * barracks);
        }
        uint256 adjustedSoldierUpkeep = ((soldierUpkeep *
            soldierUpkeepModifier) / 100);
        return adjustedSoldierUpkeep;
    }

    function getTankUpkeep(uint256 id, uint256 tankCount)
        public
        view
        returns (uint256)
    {
        uint256 tankUpkeep = (tankCount * 40);
        uint256 tankUpkeepModifier = 100;
        bool iron = res.viewIron(id);
        if (iron) {
            tankUpkeepModifier -= 5;
        }
        bool oil = res.viewOil(id);
        if (oil) {
            tankUpkeepModifier -= 5;
        }
        uint256 adjustedTankUpkeep = ((tankUpkeep *
            tankUpkeepModifier) / 100);
        return adjustedTankUpkeep;
    }

    function getNukeUpkeep(uint256 id, uint256 nukeCount)
        public
        view
        returns (uint256)
    {
        uint256 nukeUpkeep = (nukeCount * 5000);
        uint256 nukeUpkeepModifier = 100;
        bool lead = res.viewLead(id);
        if (lead) {
            nukeUpkeepModifier -= 20;
        }
        uint256 adjustedNukeUpkeep = ((nukeUpkeep *
            nukeUpkeepModifier) / 100);
        bool uranium = res.viewUranium(id);
        if (!uranium) {
            adjustedNukeUpkeep = (adjustedNukeUpkeep * 2);
        }
        return adjustedNukeUpkeep;
    }

    function getCruiseMissileUpkeep(uint256 id, uint256 missileCount)
        public
        view
        returns (uint256)
    {
        uint256 missileUpkeep = (missileCount * 500);
        uint256 missileUpkeepModifier = 100;
        bool lead = res.viewLead(id);
        if (lead) {
            missileUpkeepModifier -= 20;
        }
        uint256 adjustedMissileUpkeep = ((missileUpkeep *
            missileUpkeepModifier) / 100);
        return adjustedMissileUpkeep;
    }

    function getAircraftUpkeep(uint256 id, uint256 aircraftCount)
        public
        view
        returns (uint256)
    {
        uint256 aircraftUpkeep = (aircraftCount * 200);
        uint256 aircraftUpkeepModifier = 100;
        bool lead = res.viewLead(id);
        if (lead) {
            aircraftUpkeepModifier -= 25;
        }
        uint256 airports = imp1.getAirportCount(id);
        if (airports > 0) {
            aircraftUpkeepModifier -= (2 * airports);
        }
        uint256 adjustedAircraftUpkeep = ((aircraftUpkeep *
            aircraftUpkeepModifier) / 100);
        return adjustedAircraftUpkeep;
    }

    function getNavyUpkeep(uint256 id)
        public
        view
        returns (uint256 navyUpkeep)
    {
        uint256 corvetteCount = nav.getCorvetteCount(id);
        uint256 corvetteUpkeep = (corvetteCount * 5000);
        uint256 landingShipCount = nav.getLandingShipCount(id);
        uint256 landingShipUpkeep = (landingShipCount * 10000);
        uint256 battleshipCount = nav.getBattleshipCount(id);
        uint256 battleshipUpkeep = (battleshipCount * 25000);
        uint256 cruiserCount = nav.getCruiserCount(id);
        uint256 cruiserUpkeep = (cruiserCount * 10000);
        uint256 additionalNavyUpkeep = getNavyUpkeepAppended(id);
        uint256 baseNavyUpkeep = additionalNavyUpkeep +
            corvetteUpkeep +
            landingShipUpkeep +
            battleshipUpkeep +
            cruiserUpkeep;
        uint256 dailyNavyUpkeep = getAdjustedNavyUpkeep(id, baseNavyUpkeep);
        return dailyNavyUpkeep;
    }

    function getNavyUpkeepAppended(uint256 id) internal view returns (uint256) {
        uint256 frigateCount = nav.getFrigateCount(id);
        uint256 frigateUpkeep = (frigateCount * 15000);
        uint256 destroyerCount = nav.getDestroyerCount(id);
        uint256 destroyerUpkeep = (destroyerCount * 20000);
        uint256 submarineCount = nav.getSubmarineCount(id);
        uint256 submarineUpkeep = (submarineCount * 25000);
        uint256 aircraftCarrierCount = nav.getAircraftCarrierCount(id);
        uint256 aircraftCarrierUpkeep = (aircraftCarrierCount * 30000);
        bool uranium = res.viewUranium(id);
        if (uranium) {
            submarineUpkeep = ((submarineUpkeep * 95) / 100);
            aircraftCarrierUpkeep = ((aircraftCarrierUpkeep * 95) / 100);
        }
        uint256 additionalNavyUpkeep = frigateUpkeep +
            destroyerUpkeep +
            submarineUpkeep +
            aircraftCarrierUpkeep;
        return additionalNavyUpkeep;
    }

    function getAdjustedNavyUpkeep(uint256 id, uint256 baseNavyUpkeep)
        public
        view
        returns (uint256)
    {
        uint256 navyUpkeepModifier = 100;
        bool lead = res.viewLead(id);
        if (lead) {
            navyUpkeepModifier -= 20;
        }
        bool oil = res.viewOil(id);
        if (oil) {
            navyUpkeepModifier -= 10;
        }
        uint256 adjustedNavyUpkeep = ((baseNavyUpkeep *
            navyUpkeepModifier) / 100);
        return adjustedNavyUpkeep;
    }

    function calculateDailyBillsFromImprovements(uint256 id)
        public
        view
        returns (uint256 improvementBills)
    {
        uint256 improvementCount = imp1.getImprovementCount(id);
        uint256 upkeepPerLevel;
        if (improvementCount < 5) {
            upkeepPerLevel = 500;
        } else if (improvementCount < 8) {
            upkeepPerLevel = 600;
        } else if (improvementCount < 15) {
            upkeepPerLevel = 750;
        } else if (improvementCount < 20) {
            upkeepPerLevel = 950;
        } else if (improvementCount < 30) {
            upkeepPerLevel = 1200;
        } else if (improvementCount < 40) {
            upkeepPerLevel = 1500;
        } else if (improvementCount < 50) {
            upkeepPerLevel = 2000;
        } else {
            upkeepPerLevel = 3000;
        }
        uint256 dailyImprovementBillsDue = (improvementCount * upkeepPerLevel);
        return dailyImprovementBillsDue;
    }
}
