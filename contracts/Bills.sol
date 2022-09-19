//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "./Wonders.sol";
import "./Infrastructure.sol";
import "./Forces.sol";
import "./Fighters.sol";
import "./Navy.sol";
import "./Improvements.sol";
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

    TreasuryContract tsy;
    WondersContract1 won1;
    InfrastructureContract inf;
    ForcesContract frc;
    FightersContract fight;
    NavyContract nav;
    ImprovementsContract1 imp1;

    mapping(uint256 => address) public idToOwnerBills;

    constructor(
        address _countryMinter,
        address _treasury,
        address _wonders1,
        address _infrastructure,
        address _forces,
        address _fighters,
        address _navy,
        address _improvements1
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
        uint256 dailyInfrastructureBillsDue = infrastructureCostPerLevel *
            infrastructureAmount;
        return dailyInfrastructureBillsDue;
    }

    function calculateDailyBillsFromMilitary(uint256 id)
        public
        view
        returns (uint256 militaryBills)
    {
        uint256 soldierCount = frc.getSoldierCount(id);
        uint256 soldierUpkeep = (soldierCount * 2);
        uint256 tankCount = frc.getTankCount(id);
        uint256 tankUpkeep = (tankCount * 40);
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 aircraftUpkeep = (aircraftCount * 200);
        uint256 navyUpkeep = getNavyUpkeep(id);
        uint256 nukeCount = frc.getNukeCount(id);
        uint256 nukeUpkeep = (nukeCount * 5000);
        uint256 cruiseMissileCount = frc.getCruiseMillileCount(id);
        uint256 cruiseMissileUpkeep = (cruiseMissileCount * 200);
        uint256 dailyMilitaryUpkeep = soldierUpkeep +
            tankUpkeep +
            aircraftUpkeep +
            navyUpkeep+
            nukeUpkeep +
            cruiseMissileUpkeep;
        return dailyMilitaryUpkeep;
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
        uint256 dailyNavyUpkeep = additionalNavyUpkeep +
            corvetteUpkeep +
            landingShipUpkeep +
            battleshipUpkeep +
            cruiserUpkeep;
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
        uint256 additionalNavyUpkeep = frigateUpkeep +
            destroyerUpkeep +
            submarineUpkeep +
            aircraftCarrierUpkeep;
        return additionalNavyUpkeep;
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
