//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract MilitaryContract {
    
    struct Military {
        uint256 defconLevel;
        uint256 threatLevel;
        bool warPeacePreference;
        uint256 nationStrength;
        uint16 environment;
        uint256 efficiency;
    }

    mapping(uint256 => Military) public idToMilitary;
    mapping(uint256 => address) public idToOwnerMilitary;

    function generateMilitary(uint256 id, address nationOwner) public {
        Military memory newMilitary = Military(5, 1, false, 0, 0, 0);
        idToMilitary[id] = newMilitary;
        idToOwnerMilitary[id] = nationOwner;
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

    function getDefconLevel(uint256 id) public view returns (uint256) {
        uint256 defcon = idToMilitary[id].defconLevel;
        return defcon;
    }

    function updateThreatLevel(uint256 newThreatLevel, uint256 id) public {
        require(
            idToOwnerMilitary[id] == msg.sender,
            "You are not the nation ruler"
        );
        require(
            newThreatLevel == 1 || 
            newThreatLevel == 2 ||
            newThreatLevel == 3,
            "Not a valid threat level"
        );
        idToMilitary[id].threatLevel = newThreatLevel;
    }

    function toggleWarPeacePreference(uint256 id) public {
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
