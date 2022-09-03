//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./IWarBucks.sol";
import "./WarBucks.sol";
import "./Wonders.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TreasuryContract is Ownable {
    uint256 private treasuryId;
    address public wonders1;
    address public improvements1;
    address public warBucksAddress;
    uint256 public daysToInactive;
    uint256 private taxPercentage = 0;
    uint256 public seedMoney = 2000000;

    struct Treasury {
        uint256 grossIncomePerCitizenPerDay;
        uint256 individualTaxableIncomePerDay;
        uint256 netDailyTaxesCollectable;
        uint256 netDailyBillsPayable;
        uint256 lockedBalance;
        uint256 daysSinceLastBillPaid;
        uint256 daysSinceLastTaxCollection;
        uint256 balance;
        bool inactive;
    }

    mapping(uint256 => Treasury) public idToTreasury;
    mapping(uint256 => address) public idToOwnerTreasury;

    constructor(
        address _warBucksAddress,
        address _wonders1,
        address _improvements1
    ) {
        warBucksAddress = _warBucksAddress;
        wonders1 = _wonders1;
        improvements1 = _improvements1;
        daysToInactive = 20;
    }

    function generateTreasury() public {
        Treasury memory newTreasury = Treasury(0, 0, 0, 0, 0, 0, 0, 0, false);
        idToTreasury[treasuryId] = newTreasury;
        idToOwnerTreasury[treasuryId] = msg.sender;
        idToTreasury[treasuryId].balance += seedMoney;
        treasuryId++;
    }

    function payBills(uint256 id) public {
        require(idToOwnerTreasury[id] == msg.sender, "!nation owner");
        uint256 availableFunds = idToTreasury[id].balance;
        uint256 billsPayable = getBillsPayable(id);
        require(availableFunds >= billsPayable, "balance not high enough to pay bills");
        idToTreasury[id].balance -= billsPayable;
        idToTreasury[id].inactive = false;
    }

    function getBillsPayable(uint256 id) public view returns (uint256) {
        uint256 daysSinceLastPayment = idToTreasury[id].daysSinceLastBillPaid;
        uint256 infrastructureBillsPayable = calculateDailyBillsFromInfrastructure(
                id
            );
        uint256 militaryBillsPayable = calculateDailyBillsFromMilitary(id);
        uint256 improvementBillsPayable = calculateDailyBillsFromImprovements(id);
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
        returns (uint256)
    {
        return 1;
    }

    function calculateDailyBillsFromMilitary(uint256 id)
        public
        view
        returns (uint256)
    {
        return 1;
    }

    function calculateDailyBillsFromImprovements(uint256 id)
        public
        view
        returns (uint256)
    {
        return 1;
    }

    function spendBalance(uint256 id, uint256 cost) public {
        //need a way to only allow the nation owner to do this
        uint256 balance = idToTreasury[id].balance;
        require(balance >= cost);
        idToTreasury[id].balance -= cost;
        //TAXES here
        uint256 taxRate = (taxPercentage / 100);
        uint256 taxLevied = cost * taxRate;
        if (taxLevied > 0) {
            IWarBucks(warBucksAddress).mint(address(this), taxLevied);
        }
    }

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
        for (i = 0; i < treasuryId; i++) {
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
        taxPercentage = newPercentage;
    }

    function setDaysToInactive(uint256 newDays) public onlyOwner {
        daysToInactive = newDays;
    }

    function checkBalance(uint256 id)
        public
        view
        returns (uint256 countryBalance)
    {
        uint256 balance = idToTreasury[id].balance;
        return balance;
    }
}
