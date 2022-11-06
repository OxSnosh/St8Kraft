//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./SpyOperations.sol";
import "./CountryMinter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MilitaryContract is Ownable {
    address public spyAddress;
    address public countryMinter;

    SpyOperationsContract spy;
    CountryMinter mint;

    struct Military {
        uint256 defconLevel;
        uint256 threatLevel;
        bool warPeacePreference;
    }

    mapping(uint256 => Military) public idToMilitary;

    modifier onlySpyContract() {
        require(msg.sender == spyAddress, "only callable from spy contract");
        _;
    }

    function settings (address _spyAddress) public onlyOwner {
        spyAddress = _spyAddress;
        spy = SpyOperationsContract(_spyAddress);
    }

    function generateMilitary(uint256 id) public {
        Military memory newMilitary = Military(5, 1, false);
        idToMilitary[id] = newMilitary;
    }

    function updateDefconLevel(uint256 newDefcon, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require (isOwner, "!nation owner");
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

    function setDefconLevelFromSpyContract(uint256 id, uint256 newLevel) public onlySpyContract {
        idToMilitary[id].defconLevel = newLevel;
    }

    function updateThreatLevel(uint256 newThreatLevel, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require (isOwner, "!nation owner");
        require(
            newThreatLevel == 1 ||
                newThreatLevel == 2 ||
                newThreatLevel == 3 ||
                newThreatLevel == 4 ||
                newThreatLevel == 5,
            "Not a valid threat level"
        );
        idToMilitary[id].threatLevel = newThreatLevel;
    }

    function toggleWarPeacePreference(uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require (isOwner, "!nation owner");
        if (idToMilitary[id].warPeacePreference = true) {
            idToMilitary[id].warPeacePreference = false;
        } else {
            idToMilitary[id].warPeacePreference = true;
        }
    }

    function getWarPeacePreference(uint256 id) public view returns (bool) {
        bool war = idToMilitary[id].warPeacePreference;
        return war;
    }

    function getThreatLevel(uint256 id) public view returns (uint256) {
        uint256 threatLevel = idToMilitary[id].threatLevel;
        return threatLevel;
    }

    function setThreatLevelFromSpyContract(uint256 id, uint256 newLevel)
        public
        onlySpyContract
    {
        idToMilitary[id].threatLevel = newLevel;
    }
}
