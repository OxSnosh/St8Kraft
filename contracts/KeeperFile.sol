//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Nuke.sol";
import "./Aid.sol";
import "./War.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KeeperContract is Ownable {
    address nukes;
    address aidContract;
    address warContract;

    NukeContract nuke;
    AidContract aid;
    WarContract war;

    constructor (address _nukes, address _aid, address _war) {
        nukes = _nukes;
        nuke = NukeContract(_nukes);
        aidContract = _aid;
        aid = AidContract(_aid); 
        warContract = _war;
        war = WarContract(_war);
    }

    function keeperFunctionToCall() public {
        shiftNukeDays();
        resetAidProposals();
        decremenWarDays();
        resetCruiseMissileLaunches();
    }

    function shiftNukeDays() public {
        nuke.shiftNukesDroppedDays();
    }

    function resetAidProposals() public {
        aid.resetAidProposals();
    }

    function decremenWarDays() public {
        war.decrementWarDaysLeft();
    }

    function resetCruiseMissileLaunches() public {
        war.resetCruiseMissileLaunches();
    }
}