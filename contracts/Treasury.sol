//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract TreasuryContract {

    uint private treasuryId;

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

    function generateTreasury() public {
        Treasury memory newTreasury = Treasury(0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToTreasury[treasuryId] = newTreasury;
        treasuryId++;
    }

}