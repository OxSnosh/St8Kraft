//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Nuke.sol";
import "./Aid.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KeeperContract is Ownable {
    address nukes;
    address aidContract;

    NukeContract nuke;
    AidContract aid;

    constructor (address _nukes, address _aid) {
        nukes = _nukes;
        nuke = NukeContract(_nukes);
        aidContract = _aid;
        aid = AidContract(_aid); 
    }

    function keeperFunctionToCall() public {
        shiftNukeDays();
        resetAidProposals();
    }

    function shiftNukeDays() public {
        nuke.shiftNukesDroppedDays();
    }

    function resetAidProposals() public {
        aid.resetAidProposals();
    }
}