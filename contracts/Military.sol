//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract MilitaryContract {

    uint private militaryId;

    struct Military {
        uint8 defconLevel;
        string threatLevel;
        bool warPeacePreference;
        uint256 nationStrength;
    }

    mapping(uint256 => Military) public idToMilitary;

    function generateMilitary() public {
        Military memory newMilitary = Military(0, "ThreatLevel", false, 0);
        idToMilitary[militaryId] = newMilitary;
        militaryId++;
    }
}