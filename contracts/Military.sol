//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract MilitaryContract {
    uint256 private militaryId;

    struct Military {
        uint256 defconLevel;
        string threatLevel;
        bool warPeacePreference;
        uint256 nationStrength;
        uint16 environment;
        uint256 efficiency;
    }

    mapping(uint256 => Military) public idToMilitary;
    mapping(uint256 => address) public idToOwnerMilitary;

    function generateMilitary() public {
        Military memory newMilitary = Military(
            5,
            "ThreatLevel",
            false,
            0,
            0,
            0
        );
        idToMilitary[militaryId] = newMilitary;
        idToOwnerMilitary[militaryId] = msg.sender;
        militaryId++;
    }

    function updateDefconLevel(uint256 newDefcon, uint256 id) public {
        require(
            idToOwnerMilitary[id] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            newDefcon == 1 ||
                newDefcon == 2 ||
                newDefcon == 3 ||
                newDefcon == 4 ||
                newDefcon == 5,
            "New DEFCON level is not an integer between 1 and 5"
        );
        idToMilitary[id].defconLevel = newDefcon;
    }

    //HELP
    // function updateThreatLevel(string memory newThreatLevel, uint id) public {
    //     require(idToOwnerMilitary[id] == msg.sender, "You are not the nation ruler");
    //     require(newThreatLevel = "Low" || newThreatLevel = "Medium" || newThreatLevel = "High", "New threat level not either Low, Medium or High");
    // }

    function updateWarPeacePreference(uint256 id) public {
        require(
            idToOwnerMilitary[id] == msg.sender,
            "You are not the nation ruler"
        );
        if (idToMilitary[id].warPeacePreference = true) {
            idToMilitary[id].warPeacePreference = false;
        } else {
            idToMilitary[id].warPeacePreference = true;
        }
    }
}
