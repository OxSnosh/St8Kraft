//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./IWarBucks.sol";

contract TreasuryContract {

    uint private treasuryId;
    address public warBucksAddress;

    struct Treasury {
        uint256 grossIncomePerCitizenPerDay;
        uint256 individualTaxableIncomePerDay;
        uint256 netDailyTaxesCollectable;
        uint256 incomeTaxesCollectedOverTime;
        uint256 expensesOverTime;
        uint256 billsPaid;
        uint256 purchasesOverTime;
        uint256 balance;
        uint256 lockedBalance;
    }

    mapping(uint256 => Treasury) public idToTreasury;
    mapping(uint256 => address) public idToOwnerTreasury;

    constructor (address _warBucksAddress) {
        warBucksAddress = _warBucksAddress;
    }

    function generateTreasury() public {
        Treasury memory newTreasury = Treasury(0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToTreasury[treasuryId] = newTreasury;
        idToOwnerTreasury[treasuryId] = msg.sender;
        treasuryId++;
    }

    function checkBalance(uint id) public view returns (uint countryBalance) {
        uint balance = idToTreasury[id].balance;
        return balance;
    }

    function spendBalance(uint id, uint cost) public {
        uint balance = idToTreasury[id].balance;
        require(balance >= cost);
        idToTreasury[id].balance -= cost;
    }

    function withdrawFunds(uint amount, uint id) public {
        require(idToOwnerTreasury[id] == msg.sender);
        uint balance = idToTreasury[id].balance;
        require(balance >= amount);
        IWarBucks(warBucksAddress).mint(msg.sender, amount);
    }

}