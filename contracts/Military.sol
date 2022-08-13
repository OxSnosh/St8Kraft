//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract MilitaryContract {

    uint private militaryId;

    struct Military {
        uint defconLevel;
        string threatLevel;
        bool warPeacePreference;
        uint256 nationStrength;
    }

    mapping(uint256 => Military) public idToMilitary;
    mapping(uint256 => address) public idToOwnerMilitary;

    function generateMilitary() public {
        Military memory newMilitary = Military(0, "ThreatLevel", false, 0);
        idToMilitary[militaryId] = newMilitary;
        idToOwnerMilitary[militaryId] = msg.sender;
        militaryId++;
    }

    function updateDefconLevel(uint newDefcon, uint id) public {
        require(idToOwnerMilitary[id] == msg.sender, "You are not the nation ruler");
        require(newDefcon == 1 || newDefcon == 2 || newDefcon == 3 || newDefcon == 4 || newDefcon ==5, "New DEFCON level is not an integer between 1 and 5");
        idToMilitary[id].defconLevel = newDefcon;
    }

    //HELP
    // function updateThreatLevel(string memory newThreatLevel, uint id) public {
    //     require(idToOwnerMilitary[id] == msg.sender, "You are not the nation ruler");
    //     require(newThreatLevel = "Low" || newThreatLevel = "Medium" || newThreatLevel = "High", "New threat level not either Low, Medium or High");
    // }

    function updateWarPeacePreference(uint id) public {
        require(idToOwnerMilitary[id] == msg.sender, "You are not the nation ruler");
        if (idToMilitary[id].warPeacePreference = true) {
            idToMilitary[id].warPeacePreference = false;
        } else {
            idToMilitary[id].warPeacePreference = true;
        }
    }
}