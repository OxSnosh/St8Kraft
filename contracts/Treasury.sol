//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./IWarBucks.sol";
import "./WarBucks.sol";
import "./Wonders.sol";
import "./Infrastructure.sol";
import "./Forces.sol";
import "./Navy.sol";
import "./Fighters.sol";
import "./CountryMinter.sol";
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
    address public taxes;
    address public bills;
    address public spyAddress;
    address public groundBattle;
    address public countryMinter;
    address public keeper;
    uint256 public daysToInactive = 20;
    uint256 private gameTaxPercentage = 0;
    uint256 public seedMoney = 2000000*10**18;

    CountryMinter mint;

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

    function settings1(
        address _warBucksAddress,
        address _wonders1,
        address _improvements1,
        address _infrastructure,
        address _forces,
        address _navy,
        address _fighters,
        address _aid,
        address _taxes,
        address _bills,
        address _spyAddress
    ) public onlyOwner {
        warBucksAddress = _warBucksAddress;
        wonders1 = _wonders1;
        improvements1 = _improvements1;
        infrastructure = _infrastructure;
        forces = _forces;
        navy = _navy;
        fighters = _fighters;
        aid = _aid;
        taxes = _taxes;
        bills = _bills;
        spyAddress = _spyAddress;
    }

    function settings2(
        address _groundBattle,
        address _countryMinter,
        address _keeper
    ) public onlyOwner {
        groundBattle = _groundBattle;
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        keeper = _keeper;
    }

    function generateTreasury(uint256 id) public {
        Treasury memory newTreasury = Treasury(
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            1,
            0,
            false
        );
        idToTreasury[id] = newTreasury;
        idToTreasury[id].balance += seedMoney;
        counter++;
    }

    modifier onlyTaxesContract() {
        require(msg.sender == taxes, "only callable from taxes contract");
        _;
    }

    modifier onlySpyContract() {
        require(msg.sender == spyAddress, "only callable from spy contract");
        _;
    }

    function increaseBalanceOnTaxCollection(uint256 id, uint256 amount)
        public
        onlyTaxesContract
    {
        idToTreasury[id].balance += amount;
        idToTreasury[id].daysSinceLastTaxCollection = 0;
    }

    modifier onlyBillsContract() {
        require(msg.sender == bills, "only callable from taxes contract");
        _;
    }

    modifier onlyInfrastructure() {
        require(
            msg.sender == infrastructure,
            "only callable from infrastructure contract"
        );
        _;
    }

    modifier onlyKeeper() {
        require(msg.sender == keeper, "function only callable from keeper");
        _;
    }

    function decreaseBalanceOnBillsPaid(uint256 id, uint256 amount)
        public
        onlyBillsContract
    {
        idToTreasury[id].balance -= amount;
        idToTreasury[id].daysSinceLastBillPaid = 0;
        idToTreasury[id].inactive = false;
    }

    function spendBalance(uint256 id, uint256 cost) public {
        //need a way to only allow the nation owner to do this
        uint256 balance = idToTreasury[id].balance;
        require(balance >= cost, "insufficient balance");
        idToTreasury[id].balance -= cost;
        //TAXES here
        uint256 taxLevied = ((cost * gameTaxPercentage) / 100);
        if (taxLevied > 0) {
            IWarBucks(warBucksAddress).mintFromTreasury(
                address(this),
                taxLevied
            );
        }
    }

    function viewTaxRevenues() public view returns (uint256) {
        return (WarBucks(warBucksAddress).balanceOf(address(this)));
    }

    function withdrawTaxRevenues(uint256 amount) public onlyOwner {
        WarBucks(warBucksAddress).approve(address(this), amount);
        WarBucks(warBucksAddress).transferFrom(address(this), msg.sender, amount);
    }

    // need modifier
    function returnBalance(uint256 id, uint256 cost) public onlyInfrastructure {
        //need a way to only allow the nation owner to do this
        idToTreasury[id].balance += cost;
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

    modifier onlyGroundBattle() {
        require(
            msg.sender == groundBattle,
            "function only callable from ground battle"
        );
        _;
    }

    function transferSpoils(
        uint256 randomNumber,
        uint256 attackerId,
        uint256 defenderId
    ) public onlyGroundBattle {
        uint256 defenderBalance = idToTreasury[defenderId].balance;
        uint256 fundsToTransfer = ((defenderBalance * randomNumber) / 100);
        if (fundsToTransfer < 2000000) {
            idToTreasury[defenderId].balance -= fundsToTransfer;
            idToTreasury[attackerId].balance += fundsToTransfer;
        } else {
            idToTreasury[defenderId].balance -= 2000000;
            idToTreasury[attackerId].balance += 2000000;
        }
    }

    function withdrawFunds(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 gameBalance = idToTreasury[id].balance;
        require(gameBalance >= amount, "insufficient game balance");
        idToTreasury[id].balance -= amount;
        IWarBucks(warBucksAddress).mintFromTreasury(msg.sender, amount);
    }

    function addFunds(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 coinBalance = IWarBucks(warBucksAddress).balanceOf(msg.sender);
        require(
            coinBalance >= amount,
            "deposit amount exceeds balance in wallet"
        );
        idToTreasury[id].balance += amount;
        IWarBucks(warBucksAddress).burnFromTreasury(msg.sender, amount);
    }

    function incrementDaysSince() external onlyKeeper {
        uint256 i;
        for (i = 0; i < counter; i++) {
            idToTreasury[i].daysSinceLastBillPaid++;
            idToTreasury[i].daysSinceLastTaxCollection++;
            if (idToTreasury[i].daysSinceLastBillPaid > daysToInactive) {
                idToTreasury[i].inactive == true;
            }
        }
    }

    function setGameTaxRate(uint256 newPercentage) public onlyOwner {
        gameTaxPercentage = newPercentage;
    }

    function getGameTaxRate() public view onlyOwner returns (uint256) {
        return gameTaxPercentage;
    }

    function setDaysToInactive(uint256 newDays) public onlyOwner {
        daysToInactive = newDays;
    }

    function getDaysSinceLastTaxCollection(uint256 id)
        public
        view
        returns (uint256)
    {
        return idToTreasury[id].daysSinceLastTaxCollection;
    }

    function getDaysSinceLastBillsPaid(uint256 id)
        public
        view
        returns (uint256)
    {
        return idToTreasury[id].daysSinceLastBillPaid;
    }

    function checkBalance(uint256 id) public view returns (uint256) {
        return idToTreasury[id].balance;
    }

    function transferBalance(
        uint256 toId,
        uint256 fromId,
        uint256 amount
    ) public onlySpyContract {
        idToTreasury[toId].balance += amount;
        idToTreasury[fromId].balance -= amount;
    }

    function checkInactive(uint256 id) public view returns (bool) {
        return idToTreasury[id].inactive;
    }
}
