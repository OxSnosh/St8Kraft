//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "./Navy.sol";
import "./Forces.sol";
import "./Wonders.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ImprovementsContract1 is Ownable {
    address public treasuryAddress;
    address public improvementContract2Address;
    address public improvementContract3Address;
    address public wonders1;
    address public navyContractAddress;
    uint256 public airportCost = 100000;
    uint256 public bankCost = 100000;
    uint256 public barracksCost = 50000;
    uint256 public borderFortificationCost = 125000;
    uint256 public borderWallCost = 60000;
    uint256 public bunkerCost = 200000;
    uint256 public casinoCost = 100000;
    uint256 public churchCost = 40000;
    uint256 public clinicCost = 50000;
    uint256 public drydockCost = 100000;
    uint256 public factoryCost = 150000;

    WondersContract1 won1;

    struct Improvements1 {
        uint256 improvementCount;
        //Airport
        //$100,000
        //DONE //reduces aircraft cost -2%
        //DONE //reduces aircraft upkeep cost -2%
        //Limit 3
        uint256 airportCount;
        //Bank
        //$100,000
        //DONE //population income +7%
        uint256 bankCount;
        //Barracks
        //$50,000
        //DONE //increases soldier efficiency +10%
        //DONE //reduces soldier upkeep -10%
        uint256 barracksCount;
        //Border Fortifications
        //$125,000
        //DONE //Raises effectiveness of defending soldiers +2%
        //DONE //reduces max deployment -2%
        //Requires maintaining a border wall for each Border Fortification
        //Limit 3
        //Cannot own if forward operating base is owned
        //Collection required to delete
        uint256 borderFortificationCount;
        //Border Walls
        //$60,000
        //DONE //Decreases citizen count by -2%
        //DONE //increases population happiness +2,
        //DONE //Improves environment +1
        //DONE //Reduces the number of criminals in a nation 1% for each Border Wall.
        //Border Walls may only be purchased one at a time.
        uint256 borderWallCount;
        //Bunker
        //$200,000
        //DONE //Reduces infrastructure damage from aircraft, cruise missiles, and nukes -3%
        //Requires maintaining a Barracks for each Bunker.
        //Limit 5
        //Cannot build if Munitions Factory or Forward Operating Base is owned.
        //Collection required to delete
        uint256 bunkerCount;
        //Casino
        //$100,000
        //DONE //Increases happiness by 1.5,
        //DONE //decreases citizen income by 1%
        //DONE //-25 to crime prevention score.
        //Limit 2.
        uint256 casinoCount;
        //Church
        //$40,000
        //DONE //Increases population happiness +1.
        uint256 churchCount;
        //Clinic
        //$50,000
        //DONE //Increases population count by 2%
        //Purchasing 2 or more clinics allows you to purchase hospitals.
        //This improvement may not be destroyed if it is supporting a hospital until the hospital is first destroyed.
        uint256 clinicCount;
        //Drydock
        //$100,000
        //Allows nations to build and maintain navy Corvettes, Battleships, Cruisers, and Destroyers
        //Increases the number of each of these types of ships that a nation can support +1.
        //This improvement may not be destroyed if it is supporting navy vessels until those navy vessels are first destroyed.
        //requires Harbor
        uint256 drydockCount;
        //Factory
        //$150,000
        //DONE //Decreases cost of cruise missiles -5%
        //DONE //decreases tank cost -10%,
        //DONE //reduces initial infrastructure purchase cost -8%.
        uint256 factoryCount;
    }

    mapping(uint256 => Improvements1) public idToImprovements1;
    mapping(uint256 => address) public idToOwnerImprovements1;

    constructor(
        address _treasuryAddress,
        address _improvementContract2Address,
        address _improvementContract3Address,
        address _navyContractAddress
    ) {
        treasuryAddress = _treasuryAddress;
        improvementContract2Address = _improvementContract2Address;
        improvementContract3Address = _improvementContract3Address;
        navyContractAddress = _navyContractAddress;
    }

    modifier approvedAddress() {
        require(
            msg.sender == improvementContract2Address ||
                msg.sender == improvementContract3Address,
            "Unable to call"
        );
        _;
    }

    function updateTreasuryAddress(address _newTreasuryAddress)
        public
        onlyOwner
    {
        treasuryAddress = _newTreasuryAddress;
    }

    function updateImprovementContractAddresses(
        address _improvementContract2Address,
        address _improvementContract3Address
    ) public onlyOwner {
        improvementContract2Address = _improvementContract2Address;
        improvementContract3Address = _improvementContract3Address;
    }

    function updateNavyContractAddress(address _navyContractAddress)
        public
        onlyOwner
    {
        navyContractAddress = _navyContractAddress;
    }

    function generateImprovements(uint256 id, address nationOwner) public {
        Improvements1 memory newImprovements1 = Improvements1(
            0,
            0,
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
        idToImprovements1[id] = newImprovements1;
        idToOwnerImprovements1[id] = nationOwner;
    }

    function updateAirportCost(uint256 newPrice) public onlyOwner {
        airportCost = newPrice;
    }

    function updateBankCost(uint256 newPrice) public onlyOwner {
        bankCost = newPrice;
    }

    function updateBarracksCost(uint256 newPrice) public onlyOwner {
        barracksCost = newPrice;
    }

    function updateBorderFortificationCost(uint256 newPrice) public onlyOwner {
        borderFortificationCost = newPrice;
    }

    function updateaBorderWallCost(uint256 newPrice) public onlyOwner {
        borderWallCost = newPrice;
    }

    function updateBunkerCost(uint256 newPrice) public onlyOwner {
        bunkerCost = newPrice;
    }

    function updateCasinoCost(uint256 newPrice) public onlyOwner {
        casinoCost = newPrice;
    }

    function updateChurchCost(uint256 newPrice) public onlyOwner {
        churchCost = newPrice;
    }

    function updateClinicCost(uint256 newPrice) public onlyOwner {
        clinicCost = newPrice;
    }

    function updateDrydockCost(uint256 newPrice) public onlyOwner {
        drydockCost = newPrice;
    }

    function updateFactoryCost(uint256 newPrice) public onlyOwner {
        factoryCost = newPrice;
    }

    function getImprovementCount(uint256 id)
        public
        view
        returns (uint256 count)
    {
        count = idToImprovements1[id].improvementCount;
        return count;
    }

    function updateImprovementCount(uint256 id, uint256 newCount)
        public
        approvedAddress
    {
        idToImprovements1[id].improvementCount = newCount;
    }

    function buyImprovement1(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public {
        require(
            idToOwnerImprovements1[countryId] == msg.sender,
            "You are not the nation ruler"
        );
        require(improvementId <= 11, "Invalid improvement ID");
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(
            countryId
        );
        if (improvementId == 1) {
            uint256 purchasePrice = airportCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].airportCount;
            require((existingCount + amount) <= 3, "Cannot own more than 3");
            idToImprovements1[countryId].airportCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 2) {
            uint256 purchasePrice = bankCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].bankCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].bankCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 3) {
            uint256 purchasePrice = barracksCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].barracksCount;
            require((existingCount + amount) <= 3, "Cannot own more than 3");
            idToImprovements1[countryId].barracksCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 4) {
            uint256 purchasePrice = borderFortificationCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId]
                .borderFortificationCount;
            require((existingCount + amount) <= 3, "Cannot own more than 3");
            uint256 borderWallAmount = idToImprovements1[countryId]
                .borderWallCount;
            require(
                (existingCount + amount) <= borderWallAmount,
                "Must own a border wall for every fortification"
            );
            uint256 fobCount = ImprovementsContract2(
                improvementContract2Address
            ).getForwardOperatingBaseCount(countryId);
            require(
                fobCount == 0,
                "Cannot own if forward operating base is owned"
            );
            idToImprovements1[countryId].borderFortificationCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 5) {
            require(
                amount == 1,
                "Boarder walls can only be purchased 1 at a time"
            );
            uint256 purchasePrice = borderWallCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId]
                .borderWallCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].borderWallCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 6) {
            uint256 purchasePrice = bunkerCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].bunkerCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            uint256 barracksAmount = idToImprovements1[countryId].barracksCount;
            require(
                (existingCount + amount) <= barracksAmount,
                "Must own a barracks for every bunker"
            );
            uint256 fobCount = ImprovementsContract2(
                improvementContract2Address
            ).getForwardOperatingBaseCount(countryId);
            require(
                fobCount == 0,
                "Cannot own if forward operating base is owned"
            );
            uint256 munitionsFactoryCount = ImprovementsContract2(
                improvementContract2Address
            ).getMunitionsFactoryCount(countryId);
            require(
                munitionsFactoryCount == 0,
                "Cannot own if munitions factory base is owned"
            );
            idToImprovements1[countryId].bunkerCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 7) {
            uint256 purchasePrice = casinoCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].casinoCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            idToImprovements1[countryId].casinoCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 8) {
            uint256 purchasePrice = churchCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].churchCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].churchCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 9) {
            uint256 purchasePrice = clinicCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].clinicCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].clinicCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 10) {
            uint256 purchasePrice = drydockCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].drydockCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            uint256 harborCount = ImprovementsContract2(
                improvementContract2Address
            ).getHarborCount(countryId);
            require(harborCount < 0, "Must own a harbor first");
            idToImprovements1[countryId].drydockCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else {
            uint256 purchasePrice = factoryCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].factoryCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].factoryCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        }
    }

    function deleteImprovement1(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public {
        require(
            idToOwnerImprovements1[countryId] == msg.sender,
            "You are not the nation ruler"
        );
        require(improvementId <= 11, "Invalid improvement ID");
        if (improvementId == 1) {
            uint256 existingCount = idToImprovements1[countryId].airportCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].airportCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 2) {
            uint256 existingCount = idToImprovements1[countryId].bankCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].bankCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 3) {
            uint256 existingCount = idToImprovements1[countryId].barracksCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].barracksCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 4) {
            uint256 existingCount = idToImprovements1[countryId]
                .borderFortificationCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].borderFortificationCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 5) {
            uint256 existingCount = idToImprovements1[countryId]
                .borderWallCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].borderWallCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 6) {
            uint256 existingCount = idToImprovements1[countryId].bunkerCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].bunkerCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 7) {
            uint256 existingCount = idToImprovements1[countryId].casinoCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].casinoCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 8) {
            uint256 existingCount = idToImprovements1[countryId].churchCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].churchCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 9) {
            uint256 existingCount = idToImprovements1[countryId].clinicCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            uint256 hospitalCount = ImprovementsContract2(
                improvementContract2Address
            ).getHospitalCount(countryId);
            require(
                hospitalCount == 0,
                "Cannot delete while nation owns a hospital"
            );
            idToImprovements1[countryId].clinicCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 10) {
            uint256 existingCount = idToImprovements1[countryId].drydockCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            uint256 vesselCount = NavyContract(navyContractAddress)
                .getVesselCountForDrydock(countryId);
            require(
                vesselCount == 0,
                "Cannot delete drydock while it supports vessels"
            );
            idToImprovements1[countryId].drydockCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else {
            uint256 existingCount = idToImprovements1[countryId].factoryCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].factoryCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        }
    }

    function getAirportCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 airportAmount = idToImprovements1[countryId].airportCount;
        return airportAmount;
    }

    function getBarracksCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 barracksAmount = idToImprovements1[countryId].barracksCount;
        return barracksAmount;
    }

    function getBorderFortificationCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 borderFortificationAmount = idToImprovements1[countryId]
            .borderFortificationCount;
        return borderFortificationAmount;
    }

    function getBorderWallCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 borderWallAmount = idToImprovements1[countryId].borderWallCount;
        return borderWallAmount;
    }

    function getBankCount(uint256 countryId) public view returns (uint256) {
        uint256 count = idToImprovements1[countryId].bankCount;
        return count;
    }

    function getBunkerCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 bunkerAmount = idToImprovements1[countryId].bunkerCount;
        return bunkerAmount;
    }

    function getCasinoCount(uint256 countryId) public view returns (uint256) {
        uint256 count = idToImprovements1[countryId].casinoCount;
        return count;
    }

    function getChurchCount(uint256 countryId) public view returns (uint256) {
        uint256 count = idToImprovements1[countryId].churchCount;
        return count;
    }

    function getDrydockCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 drydockAmount = idToImprovements1[countryId].drydockCount;
        return drydockAmount;
    }

    function getClinicCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 clinicAmount = idToImprovements1[countryId].clinicCount;
        return clinicAmount;
    }

    function getFactoryCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 factoryAmount = idToImprovements1[countryId].factoryCount;
        return factoryAmount;
    }
}

contract ImprovementsContract2 is Ownable {
    address public treasuryAddress;
    address public improvementsContract1Address;
    address public forcesAddress;
    address public wonders1;
    uint256 public foreignMinistryCost = 120000;
    uint256 public forwardOperatingBaseCost = 125000;
    uint256 public guerillaCampCost = 20000;
    uint256 public harborCost = 200000;
    uint256 public hospitalCost = 180000;
    uint256 public intelligenceAgencyCost = 38500;
    uint256 public jailCost = 25000;
    uint256 public laborCampCost = 150000;
    uint256 public missileDefenseCost = 90000;
    uint256 public munitionsFactoryCost = 200000;
    uint256 public navalAcademyCost = 300000;
    uint256 public navalConstructionYardCost = 300000;

    WondersContract1 won1;

    struct Improvements2 {
        //Foreign Ministry
        //$120,000
        //DONE //Increases population income by 5%
        //Opens +1 extra foreign aid slot.
        //Limit one foreign ministry per nation
        uint256 foreignMinistryCount;
        //Forward Operating Base
        //$125,000
        //DONE //Increases spoils from ground attack damage 2% for balance
        //DONE //Increases spoils from ground attack damage +1/fob for Land and Tech;
        //DONE //Reduces effectiveness of one's own defending soldiers -3%.
        //Requires maintaining a Barracks for each Forward Operating Base.
        //Limit 2.
        //Cannot own if Border Fortifications or Bunker is owned.
        //Collection required to delete.
        uint256 forwardOperatingBaseCount;
        //Guerilla Camp
        //$20,000
        //DONE //Increases soldier efficiency +35%,
        //DONE //reduces soldier upkeep cost -10%
        //DONE //reduces citizen income -8%.
        uint256 guerillaCampCount;
        //Harbor
        //$200,000
        //DONE //Increases population income by 1%.
        //DONE //Opens +1 extra trade slot
        //Limit one harbor per nation.
        //This improvement may not be destroyed if it is supporting trade agreements or navy vessels until those trade agreements and navy vessels are first removed.
        uint256 harborCount;
        //Hospital
        //$180,000
        //DONE //Increases population count by 6%.
        //Need 2 clinics for a hospital.
        //Limit one hospital per nation.
        //Nations must retain at least one hospital if that nation owns a Universal Health Care wonder.
        uint256 hospitalCount;
        //Intelligence Agency
        //$38,500
        //DONE //Increases happiness for tax rates greater than 23% +1
        //DONE //Each Intelligence Agency allows nations to purchase + 100 spies
        //This improvement may not be destroyed if it is supporting spies until those spies are first destroyed.
        uint256 intelligenceAgencyCount;
        //Jail
        //$25,000
        //Incarcerates up to 500 criminals
        //Limit 5
        uint256 jailCount;
        //Labor Camp
        //$150,000
        //Reduces infrastructure upkeep costs -10%
        //reduces population happiness -1.
        //Incarcerates up to 200 criminals per Labor Camp.
        uint256 laborCampCount;
        //Missile Defense
        //$90,000
        //Reduces effectiveness of incoming cruise missiles used against your nation -10%.
        //Nations must retain at least three missile defenses if that nation owns a Strategic Defense Initiative wonder.
        uint256 missileDefenseCount;
        //MunitionsFactory
        //$200,000
        //Increases enemy infrastructure damage from your aircraft, cruise missiles, and nukes +3%
        //+0.3 penalty to environment per Munitions Factory.
        //Requires maintaining 3 or more Factories.
        //Requires having Lead as a resource to purchase.
        //Limit 5.
        //Cannot build if Bunkers owned.
        //Collection required to delete.
        uint256 munitionsFactoryCount;
        //Naval Academy
        //$300,000
        //Increases both attacking and defending navy vessel strength +1.
        //Limit 2 per nation.
        //Requires Harbor.
        uint256 navalAcademyCount;
        //Naval Construction Yard
        //$300,000
        //Increases the daily purchase limit for navy vessels +1.
        //Your nation must have pre-existing navy support capabilities (via Drydocks and Shipyards) to actually purchase navy vessels.
        //Limit 3 per nation.
        //requires Harbor
        uint256 navalConstructionYardCount;
    }

    mapping(uint256 => Improvements2) public idToImprovements2;
    mapping(uint256 => address) public idToOwnerImprovements2;

    constructor(
        address _treasuryAddress,
        address _forcesAddress,
        address _wonders1
    ) {
        treasuryAddress = _treasuryAddress;
        forcesAddress = _forcesAddress;
        wonders1 = _wonders1;
    }

    function updateTreasuryAddress(address _newTreasuryAddress)
        public
        onlyOwner
    {
        treasuryAddress = _newTreasuryAddress;
    }

    function updateImprovementContract1Address(
        address _newImprovementsContract1Address
    ) public onlyOwner {
        improvementsContract1Address = _newImprovementsContract1Address;
    }

    function updateForcesAddress(address _newForcesAddress) public onlyOwner {
        forcesAddress = _newForcesAddress;
    }

    function generateImprovements(uint256 id, address nationOwner) public {
        Improvements2 memory newImprovements2 = Improvements2(
            0,
            0,
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
        idToImprovements2[id] = newImprovements2;
        idToOwnerImprovements2[id] = nationOwner;
    }

    function updateForeignMinistryCost(uint256 newPrice) public onlyOwner {
        foreignMinistryCost = newPrice;
    }

    function updateforwardOperatingBaseCost(uint256 newPrice) public onlyOwner {
        forwardOperatingBaseCost = newPrice;
    }

    function updateGuerillaCampCost(uint256 newPrice) public onlyOwner {
        guerillaCampCost = newPrice;
    }

    function updateHarborCost(uint256 newPrice) public onlyOwner {
        harborCost = newPrice;
    }

    function updateHospitalCost(uint256 newPrice) public onlyOwner {
        hospitalCost = newPrice;
    }

    function updateIntelligenceAgencyCost(uint256 newPrice) public onlyOwner {
        intelligenceAgencyCost = newPrice;
    }

    function updateJailCost(uint256 newPrice) public onlyOwner {
        jailCost = newPrice;
    }

    function updateLaborCampCost(uint256 newPrice) public onlyOwner {
        laborCampCost = newPrice;
    }

    function updateMissileDefenseCost(uint256 newPrice) public onlyOwner {
        missileDefenseCost = newPrice;
    }

    function updateMunitionsFactoryCost(uint256 newPrice) public onlyOwner {
        munitionsFactoryCost = newPrice;
    }

    function updateNavalAcademyCost(uint256 newPrice) public onlyOwner {
        navalAcademyCost = newPrice;
    }

    function updateNavalConstructionYardCost(uint256 newPrice)
        public
        onlyOwner
    {
        navalConstructionYardCost = newPrice;
    }

    function buyImprovement2(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public {
        require(
            idToOwnerImprovements2[countryId] == msg.sender,
            "You are not the nation ruler"
        );
        require(improvementId <= 12, "Invalid improvement ID");
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(
            countryId
        );
        if (improvementId == 1) {
            uint256 purchasePrice = foreignMinistryCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .foreignMinistryCount;
            require((existingCount + amount) <= 1, "Cannot own more than 1");
            idToImprovements2[countryId].foreignMinistryCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 2) {
            uint256 purchasePrice = forwardOperatingBaseCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .forwardOperatingBaseCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            uint256 borderFortificationAmount = ImprovementsContract1(
                improvementsContract1Address
            ).getBorderFortificationCount(countryId);
            require(
                borderFortificationAmount == 0,
                "Cannot own if border fortification is owned"
            );
            uint256 bunkerAmount = ImprovementsContract1(
                improvementsContract1Address
            ).getBunkerCount(countryId);
            require(bunkerAmount == 0, "Cannot own if bunker is owned");
            idToImprovements2[countryId].forwardOperatingBaseCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 3) {
            uint256 purchasePrice = guerillaCampCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .guerillaCampCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements2[countryId].guerillaCampCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 4) {
            uint256 purchasePrice = harborCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId].harborCount;
            require((existingCount + amount) <= 1, "Cannot own more than 1");
            idToImprovements2[countryId].harborCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 5) {
            uint256 purchasePrice = hospitalCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId].hospitalCount;
            require((existingCount + amount) <= 1, "Cannot own more than 1");
            uint256 clinicCount = ImprovementsContract1(
                improvementsContract1Address
            ).getClinicCount(countryId);
            require(clinicCount >= 2, "Need to own at least 2 clinics");
            idToImprovements2[countryId].hospitalCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 6) {
            uint256 purchasePrice = intelligenceAgencyCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .intelligenceAgencyCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements2[countryId].intelligenceAgencyCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 7) {
            uint256 purchasePrice = jailCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId].jailCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements2[countryId].jailCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 8) {
            uint256 purchasePrice = laborCampCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId].laborCampCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements2[countryId].laborCampCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 9) {
            uint256 purchasePrice = missileDefenseCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .missileDefenseCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements2[countryId].missileDefenseCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 10) {
            uint256 purchasePrice = munitionsFactoryCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .munitionsFactoryCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            uint256 bunkerAmount = ImprovementsContract1(
                improvementsContract1Address
            ).getBunkerCount(countryId);
            require(bunkerAmount == 0, "Cannot own if bunker is owned");
            //require owning lead as a resource
            idToImprovements2[countryId].munitionsFactoryCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 11) {
            uint256 purchasePrice = navalAcademyCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .navalAcademyCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            uint256 harborAmount = idToImprovements2[countryId].harborCount;
            require(harborAmount < 0, "must own a harbor to purchase");
            idToImprovements2[countryId].navalAcademyCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else {
            uint256 purchasePrice = navalConstructionYardCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .navalConstructionYardCount;
            require((existingCount + amount) <= 3, "Cannot own more than 3");
            uint256 harborAmount = idToImprovements2[countryId].harborCount;
            require(harborAmount < 0, "must own a harbor to purchase");
            idToImprovements2[countryId].navalConstructionYardCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        }
    }

    function deleteImprovement2(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public {
        require(
            idToOwnerImprovements2[countryId] == msg.sender,
            "You are not the nation ruler"
        );
        require(improvementId <= 12, "Invalid improvement ID");
        if (improvementId == 1) {
            uint256 existingCount = idToImprovements2[countryId]
                .foreignMinistryCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements2[countryId].foreignMinistryCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 2) {
            uint256 existingCount = idToImprovements2[countryId]
                .forwardOperatingBaseCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements2[countryId].forwardOperatingBaseCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 3) {
            uint256 existingCount = idToImprovements2[countryId]
                .guerillaCampCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements2[countryId].guerillaCampCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 4) {
            uint256 existingCount = idToImprovements2[countryId].harborCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            uint256 drydockCount = ImprovementsContract1(
                improvementsContract1Address
            ).getDrydockCount(countryId);
            require(
                drydockCount == 0,
                "Cannot delete a drydock if it supports a harbor"
            );
            //need a requirement that it cannot be deleted if it supports a trade agreement
            idToImprovements2[countryId].harborCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 5) {
            uint256 existingCount = idToImprovements2[countryId].hospitalCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements2[countryId].hospitalCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 6) {
            uint256 existingCount = idToImprovements2[countryId]
                .intelligenceAgencyCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            uint256 spyCount = ForcesContract(forcesAddress).getSpyCount(
                countryId
            );
            uint256 newIntelAgencyCount = existingCount - amount;
            bool centralIntelAgency = won1.getCentralIntelligenceAgency(countryId);
            uint256 baseSpyCount = 50;
            if (centralIntelAgency) {
                baseSpyCount = 300;
            }
            require(
                spyCount <= (baseSpyCount + (newIntelAgencyCount * 100)),
                "You have too many spies, each intel agency supports 100 spies"
            );
            idToImprovements2[countryId].intelligenceAgencyCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 7) {
            uint256 existingCount = idToImprovements2[countryId].jailCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements2[countryId].jailCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 8) {
            uint256 existingCount = idToImprovements2[countryId].laborCampCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements2[countryId].laborCampCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 9) {
            uint256 existingCount = idToImprovements2[countryId]
                .missileDefenseCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            //cannot delete below 3 if strategic defense init
            idToImprovements2[countryId].missileDefenseCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 10) {
            uint256 existingCount = idToImprovements2[countryId]
                .munitionsFactoryCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements2[countryId].munitionsFactoryCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 11) {
            uint256 existingCount = idToImprovements2[countryId]
                .navalAcademyCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements2[countryId].navalAcademyCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else {
            uint256 existingCount = idToImprovements2[countryId]
                .navalConstructionYardCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements2[countryId].navalConstructionYardCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        }
    }

    function getForeignMinistryCount(uint256 countryId)
        public
        view
        returns (uint256)
    {
        uint256 count = idToImprovements2[countryId].foreignMinistryCount;
        return count;
    }

    function getForwardOperatingBaseCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 fobCount = idToImprovements2[countryId]
            .forwardOperatingBaseCount;
        return fobCount;
    }

    function getMunitionsFactoryCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 munitionsFactoryAmount = idToImprovements2[countryId]
            .munitionsFactoryCount;
        return munitionsFactoryAmount;
    }

    function getGuerillaCampCount(uint256 countryId)
        public
        view
        returns (uint256)
    {
        uint256 count = idToImprovements2[countryId].guerillaCampCount;
        return count;
    }

    function getHarborCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 harborAmount = idToImprovements2[countryId].harborCount;
        return harborAmount;
    }

    function getHospitalCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 hospitalAmount = idToImprovements2[countryId].hospitalCount;
        return hospitalAmount;
    }

    function getIntelAgencyCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 intelAgencyAmount = idToImprovements2[countryId]
            .intelligenceAgencyCount;
        return intelAgencyAmount;
    }

    function getMissileDefenseCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 missileDefenseAmount = idToImprovements2[countryId]
            .missileDefenseCount;
        return missileDefenseAmount;
    }
}

contract ImprovementsContract3 is Ownable {
    uint256 private improvementsId3;
    address public treasuryAddress;
    address public improvementsContract1Address;
    address public improvementsContract2Address;
    address public navyContractAddress;
    uint256 public officeOfPropagandaCost = 200000;
    uint256 public policeHeadquartersCost = 75000;
    uint256 public prisonCost = 200000;
    uint256 public radiationContainmentChamberCost = 200000;
    uint256 public redLightDistrictCost = 50000;
    uint256 public rehabilitationFacilityCost = 500000;
    uint256 public satteliteCost = 90000;
    uint256 public schoolCost = 85000;
    uint256 public shipyardCost = 100000;
    uint256 public stadiumCost = 110000;
    uint256 public universityCost = 180000;

    struct Improvements3 {
        //Office of Propoganda
        //$200,000
        //Decreases the effectiveness of enemy defending soldiers 3%.
        //Requires maintaining a Forward Operating Base for each Office of Propaganda
        //Limit 2
        //Collection required to delete.
        uint256 officeOfPropagandaCount;
        //Police Headquarters
        //$75,000
        //Increases population happiness +2.
        uint256 policeHeadquartersCount;
        //Prison
        //$200,000
        //Incarcerates up to 5,000 criminals.
        //Limit 5
        uint256 prisonCount;
        //RadiationContainmentChamber
        //$200,000
        //Lowers global radiation level that affects your nation by 20%.
        //Requires maintaining Radiation Cleanup bonus resource to function
        //Requires maintaining a Bunker for each Radiation Containment Chamber.
        //Limit 2.
        //Collection required to delete.
        uint256 radiationContainmentChamberCount;
        //RedLightDistrict
        //$50,000
        //Increases happiness by 1,
        //penalizes environment by 0.5,
        //-25 to crime prevention score
        //Limit 2
        uint256 redLightDistrictCount;
        //Rehabilitation Facility
        //$500,000
        //Sends up to 500 criminals back into the citizen count
        //Limit 5
        uint256 rehabilitationFacilityCount;
        //Satellite
        //$90,000
        //Increases effectiveness of cruise missiles used by your nation +10%.
        //Nations must retain at least three satellites if that nation owns a Strategic Defense Initiative wonder
        uint256 satelliteCount;
        //School
        //$85,000
        //Increases population income by 5%
        //increases literacy rate +1%
        //Purchasing 3 or more schools allows you to purchase universities
        //This improvement may not be destroyed if it is supporting universities until the universities are first destroyed.
        uint256 schoolCount;
        //Shipyard
        //$100,000
        //Allows nations to build and maintain navy Landing Ships, Frigates, Submarines, and Aircraft Carriers.
        //Increases the number of each of these types of ships that a nation can support +1.
        //This improvement may not be destroyed if it is supporting navy vessels until those navy vessels are first destroyed.
        //Requires Harbor
        uint256 shipyardCount;
        //Stadium
        //$110,000
        //Increases population happiness + 3.
        uint256 stadiumCount;
        //University
        //$180,000
        //Increases population income by 8%
        //reduces technology cost -10%
        //increases literacy rate +3%.
        //Three schools must be purchased before any universities can be purchased.
        //Limit 2
        uint256 universityCount;
    }

    mapping(uint256 => Improvements3) public idToImprovements3;
    mapping(uint256 => address) public idToOwnerImprovements3;

    constructor(address _treasuryAddress) {
        treasuryAddress = _treasuryAddress;
    }

    function updateTreasuryAddress(address _newTreasuryAddress)
        public
        onlyOwner
    {
        treasuryAddress = _newTreasuryAddress;
    }

    function updateImprovementContract1Address(
        address _newImprovementsContract1Address
    ) public onlyOwner {
        improvementsContract1Address = _newImprovementsContract1Address;
    }

    function updateImprovementContract2Address(
        address _newImprovementsContract2Address
    ) public onlyOwner {
        improvementsContract2Address = _newImprovementsContract2Address;
    }

    function updateNavyContractAddress(address _navyContractAddress)
        public
        onlyOwner
    {
        navyContractAddress = _navyContractAddress;
    }

    function generateImprovements(uint256 id, address nationOwner) public {
        Improvements3 memory newImprovements3 = Improvements3(
            0,
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
        idToImprovements3[id] = newImprovements3;
        idToOwnerImprovements3[id] = nationOwner;
        improvementsId3++;
    }

    function updateOfficeOfPropagandaCost(uint256 newPrice) public onlyOwner {
        officeOfPropagandaCost = newPrice;
    }

    function updatePoliceHeadquartersCost(uint256 newPrice) public onlyOwner {
        policeHeadquartersCost = newPrice;
    }

    function updatePrisonCost(uint256 newPrice) public onlyOwner {
        prisonCost = newPrice;
    }

    function updateRadiationContainmentChamberCost(uint256 newPrice)
        public
        onlyOwner
    {
        radiationContainmentChamberCost = newPrice;
    }

    function updateRedLightDistrictCost(uint256 newPrice) public onlyOwner {
        redLightDistrictCost = newPrice;
    }

    function updateRehabilitationFacilityCost(uint256 newPrice)
        public
        onlyOwner
    {
        rehabilitationFacilityCost = newPrice;
    }

    function updateSatteliteCost(uint256 newPrice) public onlyOwner {
        satteliteCost = newPrice;
    }

    function updateSchoolCost(uint256 newPrice) public onlyOwner {
        schoolCost = newPrice;
    }

    function updateShipyardCost(uint256 newPrice) public onlyOwner {
        shipyardCost = newPrice;
    }

    function updateStadiumCost(uint256 newPrice) public onlyOwner {
        stadiumCost = newPrice;
    }

    function updateUniversityCost(uint256 newPrice) public onlyOwner {
        universityCost = newPrice;
    }

    function buyImprovement3(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public {
        require(
            idToOwnerImprovements3[countryId] == msg.sender,
            "You are not the nation ruler"
        );
        require(improvementId <= 12, "Invalid improvement ID");
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(
            countryId
        );
        if (improvementId == 1) {
            uint256 purchasePrice = officeOfPropagandaCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId]
                .officeOfPropagandaCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            uint256 forwardOperatingBaseAmount = ImprovementsContract2(
                improvementsContract2Address
            ).getForwardOperatingBaseCount(countryId);
            require(
                (existingCount + amount) <= forwardOperatingBaseAmount,
                "Must own 1 forward operating base for each office of propaganda"
            );
            idToImprovements3[countryId].officeOfPropagandaCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 2) {
            uint256 purchasePrice = policeHeadquartersCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId]
                .policeHeadquartersCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements3[countryId].policeHeadquartersCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 3) {
            uint256 purchasePrice = prisonCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId].prisonCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements3[countryId].prisonCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 4) {
            uint256 purchasePrice = radiationContainmentChamberCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId]
                .radiationContainmentChamberCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            uint256 bunkerAmount = ImprovementsContract1(
                improvementsContract1Address
            ).getBunkerCount(countryId);
            require(
                (existingCount + amount) <= bunkerAmount,
                "Must own a bunker for each radiation containment chamber"
            );
            //require maintaining radiation cleanup bonus resource
            idToImprovements3[countryId]
                .radiationContainmentChamberCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 5) {
            uint256 purchasePrice = redLightDistrictCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId]
                .redLightDistrictCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            idToImprovements3[countryId].redLightDistrictCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 6) {
            uint256 purchasePrice = rehabilitationFacilityCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId]
                .rehabilitationFacilityCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements3[countryId].rehabilitationFacilityCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 7) {
            uint256 purchasePrice = satteliteCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId].satelliteCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements3[countryId].satelliteCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 8) {
            uint256 purchasePrice = schoolCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId].schoolCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements3[countryId].schoolCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 9) {
            uint256 purchasePrice = shipyardCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId].shipyardCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements3[countryId].shipyardCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 10) {
            uint256 purchasePrice = stadiumCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId].stadiumCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements3[countryId].stadiumCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else {
            uint256 purchasePrice = universityCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements3[countryId]
                .universityCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            uint256 schoolAmount = idToImprovements3[countryId].schoolCount;
            require(
                schoolAmount <= 3,
                "Must own 3 schools to own a university"
            );
            idToImprovements3[countryId].universityCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        }
    }

    function deleteImprovement3(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public {
        require(
            idToOwnerImprovements3[countryId] == msg.sender,
            "You are not the nation ruler"
        );
        require(improvementId <= 12, "Invalid improvement ID");
        if (improvementId == 1) {
            uint256 existingCount = idToImprovements3[countryId]
                .officeOfPropagandaCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements3[countryId].officeOfPropagandaCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 2) {
            uint256 existingCount = idToImprovements3[countryId]
                .policeHeadquartersCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements3[countryId].policeHeadquartersCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 3) {
            uint256 existingCount = idToImprovements3[countryId].prisonCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements3[countryId].prisonCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 4) {
            uint256 existingCount = idToImprovements3[countryId]
                .radiationContainmentChamberCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements3[countryId]
                .radiationContainmentChamberCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 5) {
            uint256 existingCount = idToImprovements3[countryId]
                .redLightDistrictCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements3[countryId].redLightDistrictCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 6) {
            uint256 existingCount = idToImprovements3[countryId]
                .rehabilitationFacilityCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements3[countryId].rehabilitationFacilityCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 7) {
            uint256 existingCount = idToImprovements3[countryId].satelliteCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            //cannot delete below 3 if strategic defense init
            idToImprovements3[countryId].satelliteCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 8) {
            uint256 existingCount = idToImprovements3[countryId].schoolCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            uint256 universityAmount = idToImprovements3[countryId]
                .universityCount;
            uint256 newCount = existingCount - amount;
            require(
                newCount >= universityAmount,
                "Must own one school for each university"
            );
            idToImprovements3[countryId].schoolCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 9) {
            uint256 existingCount = idToImprovements3[countryId].shipyardCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            uint256 shipyardVesselCount = NavyContract(navyContractAddress)
                .getVesselCountForShipyard(countryId);
            require(
                shipyardVesselCount == 0,
                "Cannot delete shipyard while it supports vessels"
            );
            idToImprovements3[countryId].shipyardCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else if (improvementId == 10) {
            uint256 existingCount = idToImprovements3[countryId].stadiumCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements3[countryId].stadiumCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        } else {
            uint256 existingCount = idToImprovements3[countryId]
                .universityCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements3[countryId].universityCount -= amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal -= amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
        }
    }

    function getPoliceHeadquartersCount(uint256 countryId)
        public
        view
        returns (uint256)
    {
        uint256 count = idToImprovements3[countryId].policeHeadquartersCount;
        return count;
    }

    function getSatelliteCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 satelliteAmount = idToImprovements3[countryId].satelliteCount;
        return satelliteAmount;
    }

    function getSchoolCount(uint256 countryId) public view returns (uint256) {
        uint256 count = idToImprovements3[countryId].schoolCount;
        return count;
    }

    function getShipyardCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 shipyardAmount = idToImprovements3[countryId].shipyardCount;
        return shipyardAmount;
    }

    function getUniversityCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 universityAmount = idToImprovements3[countryId].universityCount;
        return universityAmount;
    }
}
