//SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "./Treasury.sol";
import "./Wonders.sol";
import "./Infrastructure.sol";
import "./Forces.sol";
import "./Fighters.sol";
import "./Navy.sol";
import "./Improvements.sol";
import "./Resources.sol";
import "./CountryMinter.sol";
import "./CountryParameters.sol";
import "./Missiles.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title BillsContact
///@author OxSnosh
///@notice this contact allows a nation owner to calculate and pay the daily upkeep bills owed for the nation
///@notice source of bill payments come from infrastructure, improvements, wonders, military and missiles
contract BillsContract is Ownable {
    address public countryMinter;
    address public treasury;
    address public wonders1;
    address public wonders2;
    address public wonders3;
    address public wonders4;
    address public infrastructure;
    address public forces;
    address public fighters;
    address public navy;
    address public improvements1;
    address public improvements2;
    address public resources;
    address public missiles;
    address public bonusResources;
    address public navy2;
    address public parameters;

    TreasuryContract tsy;
    WondersContract1 won1;
    WondersContract2 won2;
    WondersContract3 won3;
    WondersContract4 won4;
    InfrastructureContract inf;
    ForcesContract frc;
    FightersContract fight;
    NavyContract nav;
    ImprovementsContract1 imp1;
    ImprovementsContract2 imp2;
    ResourcesContract res;
    MissilesContract mis;
    CountryMinter mint;
    BonusResourcesContract bonus;
    NavyContract2 nav2;
    CountryParametersContract param;

    mapping(uint256 => address) public idToOwnerBills;

    event BillsPaid(uint256 indexed id, uint256 indexed billsPaid);

    ///@dev this function is only callable from the contact owner
    ///@dev this function will be called right after contract deployment to set contract pointers
    function settings(
        address _countryMinter,
        address _treasury,
        address _wonders1,
        address _wonders2,
        address _wonders3,
        address _infrastructure,
        address _forces,
        address _fighters,
        address _navy,
        address _resources
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        wonders2 = _wonders2;
        won2 = WondersContract2(_wonders2);
        wonders3 = _wonders3;
        won3 = WondersContract3(_wonders3);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        forces = _forces;
        frc = ForcesContract(_forces);
        fighters = _fighters;
        fight = FightersContract(_fighters);
        navy = _navy;
        nav = NavyContract(_navy);
        resources = _resources;
        res = ResourcesContract(_resources);
    }

    ///@dev this function is only callable from the contact owner
    ///@dev this function will be called right after contract deployment to set contract pointers
    function settings2(
        address _improvements1,
        address _improvements2,
        address _missiles,
        address _wonders4,
        address _infrastructure,
        address _bonusResources,
        address _navy2,
        address _parameters
    ) public onlyOwner {
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        improvements2 = _improvements2;
        imp2 = ImprovementsContract2(_improvements2);
        missiles = _missiles;
        mis = MissilesContract(_missiles);
        wonders4 = _wonders4;
        won4 = WondersContract4(_wonders4);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        bonusResources = _bonusResources;
        bonus = BonusResourcesContract(_bonusResources);
        navy2 = _navy2;
        nav2 = NavyContract2(_navy2);
        parameters = _parameters;
        param = CountryParametersContract(_parameters);
    }

    ///@dev this is public function but will only work for the nation owner who owes the bill payment
    ///@param id is the nation ID of the nation looking to pay bills
    ///@notice function allows a nation owner to pay their bills
    ///@notice function will only work if the caller of the function is the owner of the nation ID in the id parameter
    function payBills(uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 availableFunds = tsy.checkBalance(id);
        uint256 billsPayable = getBillsPayable(id);
        require(
            availableFunds >= billsPayable,
            "balance not high enough to pay bills"
        );
        tsy.decreaseBalanceOnBillsPaid(id, billsPayable);
        emit BillsPaid(id, billsPayable);
    }

    ///@notice this is a public view function that will determine a nations bill payment
    ///@param id is the nation ID of the nation whose bill payment is being calculate
    ///@return uint256 funtion returns the total bill payment due for nation
    function getBillsPayable(uint256 id) public view returns (uint256) {
        uint256 daysSinceLastPayment = tsy.getDaysSinceLastBillsPaid(id);
        uint256 infrastructureBillsPayable = calculateDailyBillsFromInfrastructure(
                id
            );
        uint256 militaryBillsPayable = calculateDailyBillsFromMilitary(id);
        uint256 improvementBillsPayable = calculateDailyBillsFromImprovements(
            id
        );
        uint256 wonderBillsPayable = calculateWonderBillsPayable(id);
        uint256 dailyBillsPayable = infrastructureBillsPayable +
            militaryBillsPayable +
            improvementBillsPayable +
            wonderBillsPayable;
        uint256 billsPayable = (dailyBillsPayable * daysSinceLastPayment);
        return billsPayable;
    }

    ///@notice this function will calculate the daily bills due for a nation's infrastructure
    ///@return dailyInfrastructureBills function will return the daily bill payment for a nation
    function calculateDailyBillsFromInfrastructure(
        uint256 id
    ) public view returns (uint256 dailyInfrastructureBills) {
        uint256 costPerLevel = calculateInfrastructureCostPerLevel(id);
        uint256 infrastructureAmount = inf.getInfrastructureCount(id);
        return (costPerLevel * infrastructureAmount);
    }

    ///@notice this function calculated the bill payment per level for a nations infrastructure level
    ///@param id this is the nation ID for the country to calculate infrastructure bill payment per level of infrastructure
    ///@return infrastructureBillsPerLevel function will return the infrastructure upkeep cost per level of infrasttucture
    function calculateInfrastructureCostPerLevel(
        uint256 id
    ) public view returns (uint256 infrastructureBillsPerLevel) {
        uint256 infrastructureAmount = inf.getInfrastructureCount(id);
        uint256 infrastructureCostPerLevel;
        if (infrastructureAmount < 100) {
            infrastructureCostPerLevel = 20;
        } else if (infrastructureAmount < 200) {
            infrastructureCostPerLevel = (((5 * infrastructureAmount) / 100) +
                20);
        } else if (infrastructureAmount < 300) {
            infrastructureCostPerLevel = (((6 * infrastructureAmount) / 100) +
                20);
        } else if (infrastructureAmount < 500) {
            infrastructureCostPerLevel = (((7 * infrastructureAmount) / 100) +
                20);
        } else if (infrastructureAmount < 700) {
            infrastructureCostPerLevel = (((8 * infrastructureAmount) / 100) +
                20);
        } else if (infrastructureAmount < 1000) {
            infrastructureCostPerLevel = (((9 * infrastructureAmount) / 100) +
                20);
        } else if (infrastructureAmount < 2000) {
            infrastructureCostPerLevel = (((11 * infrastructureAmount) / 100) +
                20);
        } else if (infrastructureAmount < 3000) {
            infrastructureCostPerLevel = (((13 * infrastructureAmount) / 100) +
                20);
        } else if (infrastructureAmount < 4000) {
            infrastructureCostPerLevel = (((15 * infrastructureAmount) / 100) +
                20);
        } else if (infrastructureAmount < 5000) {
            infrastructureCostPerLevel = (((17 * infrastructureAmount) / 100) +
                20);
        } else if (infrastructureAmount < 8000) {
            infrastructureCostPerLevel = (((1725 * infrastructureAmount) /
                10000) + 20);
        } else if (infrastructureAmount < 15000) {
            infrastructureCostPerLevel = (((175 * infrastructureAmount) /
                1000) + 20);
        } else {
            infrastructureCostPerLevel = (((18 * infrastructureAmount) / 100) +
                20);
        }
        uint256 adjustedInfrastructureCostPerLevel = calculateModifiedInfrastrucureUpkeep(
                infrastructureCostPerLevel,
                id
            );
        return adjustedInfrastructureCostPerLevel * (10 ** 18);
    }

    ///@notice this function will adjust the cost per level based on resources, improvements and wonders that make infrastructure upkeep cheaper
    ///@param baseDailyInfrastructureCostPerLevel this parameter will be the daily cost of infrastructure before adjustments
    ///@param id is the nation ID for the nation that the bills are being calculated
    ///@return uint256 this is daily cost per level for infrastructure upkeep after adjusting for resources, improvements and wonders
    function calculateModifiedInfrastrucureUpkeep(
        uint256 baseDailyInfrastructureCostPerLevel,
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
        bool asphalt = bonus.viewAsphalt(id);
        if (asphalt) {
            infrastructureUpkeepModifier -= 5;
        }
        uint256 laborCamps = imp2.getLaborCampCount(id);
        if (laborCamps > 0) {
            infrastructureUpkeepModifier -= (laborCamps * 10);
        }
        bool interstate = won2.getInterstateSystem(id);
        if (interstate) {
            infrastructureUpkeepModifier -= 8;
        }
        bool nationalEnvironmentOffice = won3.getNationalEnvironmentOffice(id);
        if (nationalEnvironmentOffice) {
            infrastructureUpkeepModifier -= 3;
        }
        bool nuclearPowerPlant = won3.getNuclearPowerPlant(id);
        if (nuclearPowerPlant) {
            infrastructureUpkeepModifier -= 5;
        }
        uint256 dailyInfrastructureCostPerLevel = ((baseDailyInfrastructureCostPerLevel *
                infrastructureUpkeepModifier) / 100);
        return dailyInfrastructureCostPerLevel;
    }

    ///@notice this function will calculate the daily bills due from military
    ///@notice military bills will come from soldiers, tanks, aircraft, navy, nukes and cruise missiles
    ///@param id is the nation ID for the bills being calculated
    ///@return militaryBills this is the daily cost for military upkeep for the nation
    function calculateDailyBillsFromMilitary(
        uint256 id
    ) public view returns (uint256 militaryBills) {
        uint256 soldierUpkeep = getSoldierUpkeep(id);
        uint256 tankUpkeep = getTankUpkeep(id);
        uint256 aircraftUpkeep = getAircraftUpkeep(id);
        uint256 navyUpkeep = getNavyUpkeep(id);
        uint256 nukeUpkeep = getNukeUpkeep(id);
        uint256 cruiseMissileUpkeep = getCruiseMissileUpkeep(id);
        uint256 dailyMilitaryUpkeep = soldierUpkeep +
            tankUpkeep +
            aircraftUpkeep +
            navyUpkeep +
            nukeUpkeep +
            cruiseMissileUpkeep;
        bool accomodativeGov = checkAccomodativeGovernmentForMilitaryUpkeep(id);
        if (accomodativeGov) {
            dailyMilitaryUpkeep = ((dailyMilitaryUpkeep * 95) / 100);
        }
        return dailyMilitaryUpkeep;
    }

    ///@notice this function calculates daily bills for soldiers
    ///@param id this is the nation ID for the soldier upkeep calculation
    ///@return uint256 is the daily upkeep cost of soldiers for the nation
    function getSoldierUpkeep(uint256 id) public view returns (uint256) {
        uint256 soldierCount = frc.getSoldierCount(id);
        uint256 soldierUpkeep = (soldierCount * 2);
        uint256 soldierUpkeepModifier = 100;
        bool lead = res.viewLead(id);
        if (lead) {
            soldierUpkeepModifier -= 15;
        }
        bool pigs = res.viewPigs(id);
        if (pigs) {
            soldierUpkeepModifier -= 10;
        }
        uint256 barracks = imp1.getBarracksCount(id);
        if (barracks > 0) {
            soldierUpkeepModifier -= (8 * barracks);
        }
        uint256 guerillaCamps = imp2.getGuerillaCampCount(id);
        if (guerillaCamps > 0) {
            soldierUpkeepModifier -= (5 * guerillaCamps);
        }
        uint256 adjustedSoldierUpkeep = ((soldierUpkeep *
            soldierUpkeepModifier) / 100);
        return adjustedSoldierUpkeep * (10 ** 18);
    }

    ///@notice this functions calculates daily bills for tanks
    ///@param id is the nation ID of the daily tank upkeep calculation
    ///@return uint256 is the daily cost of tank upkeep for the nation
    function getTankUpkeep(uint256 id) public view returns (uint256) {
        uint256 tankCount = frc.getTankCount(id);
        uint256 tankUpkeep = (tankCount * 40);
        uint256 tankUpkeepModifier = 100;
        bool iron = res.viewIron(id);
        if (iron) {
            tankUpkeepModifier -= 10;
        }
        bool oil = res.viewOil(id);
        if (oil) {
            tankUpkeepModifier -= 10;
        }
        bool lead = res.viewLead(id);
        if (lead) {
            tankUpkeepModifier -= 8;
        }
        bool logisticalSupport = won4.getSuperiorLogisticalSupport(id);
        if (logisticalSupport) {
            tankUpkeepModifier -= 20;
        }
        uint256 adjustedTankUpkeep = ((tankUpkeep * tankUpkeepModifier) / 100);
        return adjustedTankUpkeep * (10 ** 18);
    }

    ///@notice this finction calculates daily bills for a ntaions nukes
    ///@param id is the nation for the calculation of daily nuke upkeep costs
    function getNukeUpkeep(uint256 id) public view returns (uint256) {
        uint256 nukeCount = mis.getNukeCount(id);
        uint256 nukeUpkeep = (nukeCount * 5000);
        uint256 nukeUpkeepModifier = 100;
        bool lead = res.viewLead(id);
        if (lead) {
            nukeUpkeepModifier -= 20;
        }
        uint256 adjustedNukeUpkeep = ((nukeUpkeep * nukeUpkeepModifier) / 100);
        bool uranium = res.viewUranium(id);
        if (!uranium) {
            adjustedNukeUpkeep = (adjustedNukeUpkeep * 2);
        }
        return adjustedNukeUpkeep * (10 ** 18);
    }

    ///@notice this function claculates daily bills for a nations cruise missiles
    ///@param id this is the nation ID of the calulation for daily cruise missile upkeep costs
    ///@return uint256 this is the daily cruise missile upkeep cost for the nation
    function getCruiseMissileUpkeep(uint256 id) public view returns (uint256) {
        uint256 cruiseMissileCount = mis.getCruiseMissileCount(id);
        uint256 missileUpkeep = (cruiseMissileCount * 500);
        uint256 missileUpkeepModifier = 100;
        bool lead = res.viewLead(id);
        if (lead) {
            missileUpkeepModifier -= 20;
        }
        uint256 adjustedMissileUpkeep = ((missileUpkeep *
            missileUpkeepModifier) / 100);
        return adjustedMissileUpkeep * (10 ** 18);
    }

    ///@notice this function calculates daily bills for a nations aircraft
    ///@param id is the nation ID for the calculation of daily aircraft upkeep
    ///@return uint256 this is the daily upkeep cost for a nations aircraft
    function getAircraftUpkeep(uint256 id) public view returns (uint256) {
        uint256 aircraftCount = fight.getAircraftCount(id);
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
        bool logisticalSupport = won4.getSuperiorLogisticalSupport(id);
        if (logisticalSupport) {
            aircraftUpkeepModifier -= 10;
        }
        uint256 adjustedAircraftUpkeep = ((aircraftUpkeep *
            aircraftUpkeepModifier) / 100);
        return adjustedAircraftUpkeep * (10 ** 18);
    }

    ///@notice this function calculates daily bills for a nations navy
    ///@param id this is the nation ID for the calulation of navy upkeep costs
    ///@return navyUpkeep this is the daily cost of upkeep for a nations navy
    function getNavyUpkeep(
        uint256 id
    ) public view returns (uint256 navyUpkeep) {
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
        return dailyNavyUpkeep * (10 ** 18);
    }

    ///@notice this function calculates additional nacy upkeep for a nation
    ///@param id this is the nation ID of the nation where the additional navy upkeep is being calculated
    ///@return uint256 this is additional navy upkeep costs that will be added to the daily navy upkeep costs
    function getNavyUpkeepAppended(uint256 id) internal view returns (uint256) {
        uint256 frigateCount = nav2.getFrigateCount(id);
        uint256 frigateUpkeep = (frigateCount * 15000);
        uint256 destroyerCount = nav2.getDestroyerCount(id);
        uint256 destroyerUpkeep = (destroyerCount * 20000);
        uint256 submarineCount = nav2.getSubmarineCount(id);
        uint256 submarineUpkeep = (submarineCount * 25000);
        uint256 aircraftCarrierCount = nav2.getAircraftCarrierCount(id);
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

    ///@notice this function will adjust a nations navy bills based on resources, improvements and wonders that reduce navy upkeep
    ///@param id this is the nation ID for the countey whose navy upkeep is being calculated
    ///@param baseNavyUpkeep this is the base daily cost of navy bills before adjustments
    ///@return uint256 this is a nations daily navy upkeep adjusted for resources, improvements and woneers
    function getAdjustedNavyUpkeep(
        uint256 id,
        uint256 baseNavyUpkeep
    ) public view returns (uint256) {
        uint256 navyUpkeepModifier = 100;
        bool lead = res.viewLead(id);
        if (lead) {
            navyUpkeepModifier -= 20;
        }
        bool oil = res.viewOil(id);
        if (oil) {
            navyUpkeepModifier -= 10;
        }
        bool logisticalSupport = won4.getSuperiorLogisticalSupport(id);
        if (logisticalSupport) {
            navyUpkeepModifier -= 10;
        }
        uint256 adjustedNavyUpkeep = ((baseNavyUpkeep * navyUpkeepModifier) /
            100);
        return adjustedNavyUpkeep;
    }

    ///@notice this function will calculate the upkeep cost per improvement for a given nation
    ///@param id this is the nation ID for the country for the daily improvement upkeep calculation
    ///@return improvementBillsPerLevel is the daily cost of imprvements per level for the nation
    function calculateImprovementCostPerLevel(
        uint256 id
    ) public view returns (uint256 improvementBillsPerLevel) {
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
        return upkeepPerLevel * (10 ** 18);
    }

    ///@notice this function calculates bills from a nations improvements
    ///@param id this is the nation ID for the country for the daily improvement upkeep calculation
    ///@return improvementBills is the daily cost of imprvements for the nation
    function calculateDailyBillsFromImprovements(
        uint256 id
    ) public view returns (uint256 improvementBills) {
        uint256 improvementCount = imp1.getImprovementCount(id);
        uint256 upkeepPerLevel = calculateImprovementCostPerLevel(id);
        uint256 dailyImprovementBillsDue = (improvementCount * upkeepPerLevel);
        uint256 modifiers = 100;
        bool nuclearPowerPlant = won3.getNuclearPowerPlant(id);
        if (nuclearPowerPlant) {
            modifiers -= 5;
        }
        bool accomodativeGovernment = checkAccomodativeGovernmentForImprovementsAndWonders(
                id
            );
        if (accomodativeGovernment) {
            modifiers -= 5;
        }
        dailyImprovementBillsDue = ((dailyImprovementBillsDue * modifiers) /
            100);
        return dailyImprovementBillsDue;
    }

    ///@notice this function calculated bills from a nations wonders
    ///@param id this is the nation ID for the calculaton of daily wonder bills
    ///@return uint256 is the daily upkeep costs for wonders of the nation
    function calculateWonderBillsPayable(
        uint256 id
    ) public view returns (uint256) {
        uint256 wonderCount = won1.getWonderCount(id);
        uint256 wonderBillsPayable = (wonderCount * 5000);
        uint256 modifiers = 100;
        bool nuclearPowerPlant = won3.getNuclearPowerPlant(id);
        if (nuclearPowerPlant) {
            modifiers -= 5;
        }
        bool accomodativeGovernment = checkAccomodativeGovernmentForImprovementsAndWonders(
                id
            );
        if (accomodativeGovernment) {
            modifiers -= 5;
        }
        wonderBillsPayable = ((wonderBillsPayable * modifiers) / 100);
        return wonderBillsPayable * (10 ** 18);
    }

    ///@dev this is a public view function that will return a boolean value if a nations government type accomodates a reduced upkeep for wonders and improvements
    ///@notice this function will check if the given nation has a governemnt type that accomodate a lower the upkeep for improvements and wonders by 5%
    ///@param countryId is the nation ID of the country being queried
    ///@return bool will be true if the nation's government type accomodates a lower infrastructure cost
    function checkAccomodativeGovernmentForImprovementsAndWonders(
        uint256 countryId
    ) public view returns (bool) {
        uint256 governmentType = param.getGovernmentType(countryId);
        if (
            governmentType == 1 ||
            governmentType == 5 ||
            governmentType == 8 ||
            governmentType == 10
        ) {
            return true;
        }
        return false;
    }

    ///@dev this is a public view function that will return a boolean value if a nations government type accomodates a reduced upkeep for wonders and improvements
    ///@notice this function will check if the given nation has a governemnt type that accomodate a lower the upkeep for improvements and wonders by 5%
    ///@param countryId is the nation ID of the country being queried
    ///@return bool will be true if the nation's government type accomodates a lower infrastructure cost
    function checkAccomodativeGovernmentForMilitaryUpkeep(
        uint256 countryId
    ) public view returns (bool) {
        uint256 governmentType = param.getGovernmentType(countryId);
        if (governmentType == 2 || governmentType == 4 || governmentType == 9) {
            return true;
        }
        return false;
    }
}
