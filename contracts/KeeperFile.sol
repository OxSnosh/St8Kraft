//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Nuke.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KeeperContract is Ownable {
    address nukes;

    NukeContract nuke;

    constructor (address _nukes) {
        nukes = _nukes;
        nuke = NukeContract(_nukes);
    }

    function shiftNukeDays() public {
        nuke.shiftNukesDroppedDays();
    }
}