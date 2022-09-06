//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./IWarBucks.sol";
import "./WarBucks.sol";
import "./Wonders.sol";
import "./Infrastructure.sol";
import "./Forces.sol";
import "./Navy.sol";
import "./Fighters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TreasuryContract is Ownable {
    uint256 public counter;
    address public wonders1;
    address public improvements1;
    address public infrastructure;
    address public navy;
    address public fighters;
    address public warBucksAddress;
    address public forces;
    address public aid;
    uint256 public daysToInactive;
    uint256 private gameTaxPercentage = 0;
    uint256 public seedMoney = 2000000;

    struct Treasury {
        uint256 grossIncomePerCitizenPerDay;
        uint256 individualTaxableIncomePerDay;
        uint256 netDailyTaxesCollectable;
        uint256 netDailyBillsPayable;
        uint256 lockedBalance;
        uint256 daysSinceLastBillPaid;
        uint256 lastTaxCollection;
        uint256 daysSinceLastTaxCollection;
        uint256 balance;
        bool inactive;
    }

    mapping(uint256 => Treasury) public idToTreasury;
    mapping(uint256 => address) public idToOwnerTreasury;

    constructor(
        address _warBucksAddress,
        address _wonders1,
        address _improvements1,
        address _infrastructure,
        address _forces,
        address _navy,
        address _fighters,
        address _aid
    ) {
        warBucksAddress = _warBucksAddress;
        wonders1 = _wonders1;
        improvements1 = _improvements1;
        infrastructure = _infrastructure;
        forces = _forces;
        navy = _navy;
        fighters = _fighters;
        aid = _aid;
        daysToInactive = 20;
    }

    function generateTreasury(uint256 id, address nationOwner) public {
        Treasury memory newTreasury = Treasury(
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            false
        );
        idToTreasury[id] = newTreasury;
        idToOwnerTreasury[id] = nationOwner;
        idToTreasury[id].balance += seedMoney;
        counter++;
    }

    function collectTaxes(uint256 id) public {
        require(idToOwnerTreasury[id] == msg.sender, "!nation owner");
        uint256 dailyIncomePerCitizen = InfrastructureContract(infrastructure)
            .getDailyIncome(id);
        uint256 daysSinceLastTaxCollection = idToTreasury[id]
            .daysSinceLastTaxCollection;
        uint256 taxesCollectible = (dailyIncomePerCitizen *
            daysSinceLastTaxCollection);
        idToTreasury[id].balance += taxesCollectible;
        idToTreasury[id].daysSinceLastTaxCollection = 0;
    }

    function payBills(uint256 id) public {
        require(idToOwnerTreasury[id] == msg.sender, "!nation owner");
        uint256 availableFunds = idToTreasury[id].balance;
        uint256 billsPayable = getBillsPayable(id);
        require(
            availableFunds >= billsPayable,
            "balance not high enough to pay bills"
        );
        idToTreasury[id].balance -= billsPayable;
        idToTreasury[id].daysSinceLastBillPaid = 0;
        idToTreasury[id].inactive = false;
    }

    function getBillsPayable(uint256 id) public view returns (uint256) {
        uint256 daysSinceLastPayment = idToTreasury[id].daysSinceLastBillPaid;
        uint256 infrastructureBillsPayable = calculateDailyBillsFromInfrastructure(
                id
            );
        uint256 militaryBillsPayable = calculateDailyBillsFromMilitary(id);
        uint256 improvementBillsPayable = calculateDailyBillsFromImprovements(
            id
        );
        uint256 wonderCount = WondersContract1(wonders1).getWonderCount(id);
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
        uint256 infrastructureAmount = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
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
        uint256 soldierCount = ForcesContract(forces).getSoldierCount(id);
        uint256 soldierUpkeep = (soldierCount * 2);
        uint256 tankCount = ForcesContract(forces).getTankCount(id);
        uint256 tankUpkeep = (tankCount * 40);
        uint256 aircraftCount = FightersContract(fighters).getAircraftCount(id);
        uint256 aircraftUpkeep = (aircraftCount * 200);
        uint256 navyUpkeep = getNavyUpkeep(id);
        uint256 dailyMilitaryUpkeep = soldierUpkeep +
            tankUpkeep +
            aircraftUpkeep +
            navyUpkeep;
        return dailyMilitaryUpkeep;
    }

    function getNavyUpkeep(uint256 id)
        public
        view
        returns (uint256 navyUpkeep)
    {
        uint256 corvetteCount = NavyContract(navy).getCorvetteCount(id);
        uint256 corvetteUpkeep = (corvetteCount * 5000);
        uint256 landingShipCount = NavyContract(navy).getLandingShipCount(id);
        uint256 landingShipUpkeep = (landingShipCount * 10000);
        uint256 battleshipCount = NavyContract(navy).getBattleshipCount(id);
        uint256 battleshipUpkeep = (battleshipCount * 25000);
        uint256 cruiserCount = NavyContract(navy).getCruiserCount(id);
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
        uint256 frigateCount = NavyContract(navy).getFrigateCount(id);
        uint256 frigateUpkeep = (frigateCount * 15000);
        uint256 destroyerCount = NavyContract(navy).getDestroyerCount(id);
        uint256 destroyerUpkeep = (destroyerCount * 20000);
        uint256 submarineCount = NavyContract(navy).getSubmarineCount(id);
        uint256 submarineUpkeep = (submarineCount * 25000);
        uint256 aircraftCarrierCount = NavyContract(navy)
            .getAircraftCarrierCount(id);
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
        uint256 improvementCount = ImprovementsContract1(improvements1)
            .getImprovementCount(id);
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

    function spendBalance(uint256 id, uint256 cost) public {
        //need a way to only allow the nation owner to do this
        uint256 balance = idToTreasury[id].balance;
        require(balance >= cost);
        idToTreasury[id].balance -= cost;
        //TAXES here
        uint256 taxLevied = ((cost * gameTaxPercentage) / 100);
        if (taxLevied > 0) {
            IWarBucks(warBucksAddress).mint(address(this), taxLevied);
        }
    }

    modifier onlyAidContract() {
        require(msg.sender == aid);
        _;
    }

    function sendAidBalance(
        uint256 idSender,
        uint256 idRecipient,
        uint256 amount
    ) public onlyAidContract {
        uint256 balance = idToTreasury[idSender].balance;
        require(balance >= amount, "not enough balance");
        idToTreasury[idSender].balance -= amount;
        idToTreasury[idRecipient].balance += amount;
    }

    //NEED FUNCTION TO WITHDRAW TAXES

    function withdrawFunds(uint256 amount, uint256 id) public {
        require(idToOwnerTreasury[id] == msg.sender);
        uint256 balance = idToTreasury[id].balance;
        require(balance >= amount);
        idToTreasury[id].balance -= amount;
        IWarBucks(warBucksAddress).mint(msg.sender, amount);
    }

    function addFunds(uint256 amount, uint256 id) public {
        require(idToOwnerTreasury[id] == msg.sender);
        idToTreasury[id].balance += amount;
        IWarBucks(warBucksAddress).burn(msg.sender, amount);
    }

    //need way for only chainlink keeper to call this
    function incrementDaysSince() external {
        uint256 i;
        for (i = 0; i < counter; i++) {
            require(
                idToTreasury[i].inactive == false,
                "nation needs to pay bills"
            );
            idToTreasury[i].daysSinceLastBillPaid++;
            idToTreasury[i].daysSinceLastTaxCollection++;
            if (idToTreasury[i].daysSinceLastBillPaid > daysToInactive) {
                idToTreasury[i].inactive == true;
            }
        }
    }

    function setTaxRate(uint256 newPercentage) public onlyOwner {
        gameTaxPercentage = newPercentage;
    }

    function getTaxRate() public view onlyOwner returns (uint256) {
        return gameTaxPercentage;
    }

    function setDaysToInactive(uint256 newDays) public onlyOwner {
        daysToInactive = newDays;
    }

    function checkBalance(uint256 id) public view returns (uint256) {
        uint256 balance = idToTreasury[id].balance;
        return balance;
    }

    function checkInactive(uint256 id) public view returns (bool) {
        bool isInactive = idToTreasury[id].inactive;
        return isInactive;
    }
}

contract AidContract is Ownable {
    address public countryMinter;
    address public treasury;
    address public forces;
    address public infrastructure;
    uint256 public aidProposalId;

    constructor(
        address _countryMinter,
        address _treasury,
        address _forces,
        address _infrastructure
    ) {
        countryMinter = _countryMinter;
        treasury = _treasury;
        forces = _forces;
        infrastructure = _infrastructure;
    }

    struct Proposal {
        uint256 timeProposed;
        uint256 idSender;
        uint256 idRecipient;
        uint256 techAid;
        uint256 balanceAid;
        uint256 soldierAid;
        bool accepted;
        bool cancelled;
    }

    mapping(uint256 => address) public idToOwnerAid;
    mapping(uint256 => Proposal) public idToProposal;

    function updateCountryMinterAddress(address _newAddress) public onlyOwner {
        countryMinter = _newAddress;
    }

    function updateTreasuryAddress(address _newAddress) public onlyOwner {
        treasury = _newAddress;
    }

    function updateForcesAddress(address _newAddress) public onlyOwner {
        forces = _newAddress;
    }

    function updateInfrastructureAddress(address _newAddress) public onlyOwner {
        infrastructure = _newAddress;
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "caller must be country minter contract"
        );
        _;
    }

    function initiateAid(uint256 id, address nationOwner)
        public
        onlyCountryMinter
    {
        idToOwnerAid[id] = nationOwner;
    }

    function proposeAid(
        uint256 idSender,
        uint256 idRecipient,
        uint256 techAid,
        uint256 balanceAid,
        uint256 soldiersAid
    ) public {
        require(idToOwnerAid[idSender] == msg.sender, "!nation ruler");
        uint256 techAvailable = InfrastructureContract(infrastructure)
            .getTechnologyCount(idSender);
        uint256 balanceAvailable = TreasuryContract(treasury).checkBalance(
            idSender
        );
        uint256 soldiersAvailable = ForcesContract(forces)
            .getDefendingSoldierCount(idSender);
        require(techAvailable >= techAid, "not enough tech for this proposal");
        require(
            balanceAvailable >= balanceAid,
            "not enough funds for this porposal"
        );
        require(
            soldiersAvailable >= soldiersAid,
            "not enough soldiers for this porposal"
        );
        Proposal memory newProposal = Proposal(
            block.timestamp,
            idSender,
            idRecipient,
            techAid,
            balanceAid,
            soldiersAid,
            false,
            false
        );
        idToProposal[aidProposalId] = newProposal;
        aidProposalId++;
    }

    function proposalExpired(uint256 proposalId) public view returns (bool) {
        uint256 timeProposed = idToProposal[proposalId].timeProposed;
        uint256 timeElapsed = (block.timestamp - timeProposed);
        bool expired = false;
        if (timeElapsed > 7 days) {
            expired = true;
        }
        return expired;
    }

    function acceptProposal(uint256 proposalId) public {
        bool expired = proposalExpired(proposalId);
        require(expired == false, "proposal expired");
        uint256 idSender = idToProposal[proposalId].idSender;
        uint256 idRecipient = idToProposal[proposalId].idRecipient;
        uint256 tech = idToProposal[proposalId].techAid;
        uint256 balance = idToProposal[proposalId].balanceAid;
        uint256 soldiers = idToProposal[proposalId].soldierAid;
        bool accepted = idToProposal[proposalId].accepted;
        require(accepted == false, "this offer has been accepted already");
        bool cancelled = idToProposal[proposalId].cancelled;
        require(cancelled == false, "this offer has been cancelled");
        address addressRecipient = idToOwnerAid[idRecipient];
        require(
            addressRecipient == msg.sender,
            "you are not the recipient of this proposal"
        );
        InfrastructureContract(infrastructure).sendTech(
            idSender,
            idRecipient,
            tech
        );
        TreasuryContract(treasury).sendAidBalance(
            idSender,
            idRecipient,
            balance
        );
        ForcesContract(forces).sendSoldiers(idSender, idRecipient, soldiers);
        idToProposal[proposalId].accepted = true;
    }
}
