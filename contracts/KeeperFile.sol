//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Nuke.sol";
import "./Aid.sol";
import "./War.sol";
import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KeeperContract is Ownable {
    address nukes;
    address aidContract;
    address warContract;
    address treasury;

    NukeContract nuke;
    AidContract aid;
    WarContract war;
    TreasuryContract tres;

    function settings (
        address _nukes,
        address _aid,
        address _war,
        address _treasury
    ) public onlyOwner {
        nukes = _nukes;
        nuke = NukeContract(_nukes);
        aidContract = _aid;
        aid = AidContract(_aid);
        warContract = _war;
        war = WarContract(_war);
        treasury = _treasury;
        tres = TreasuryContract(_treasury);
    }

    function keeperFunctionToCall() public {
        shiftNukeDays();
        resetAidProposals();
        decremenWarDays();
        resetCruiseMissileLaunches();
        incrementDaysSince();
    }

    function keeperFunctionToCallManually() public onlyOwner {
        shiftNukeDays();
        resetAidProposals();
        decremenWarDays();
        resetCruiseMissileLaunches();
        incrementDaysSince();
    }

    function shiftNukeDays() internal {
        nuke.shiftNukesDroppedDays();
    }

    function resetAidProposals() internal {
        aid.resetAidProposals();
    }

    function resetAidProposalsByOwner() public onlyOwner {
        aid.resetAidProposals();
    }

    function decremenWarDays() internal {
        war.decrementWarDaysLeft();
    }

    function resetCruiseMissileLaunches() internal {
        war.resetCruiseMissileLaunches();
    }

    function incrementDaysSince() internal {
        tres.incrementDaysSince();
    }
}
