//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./NationStrength.sol";
import "./Military.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WarContract is Ownable {
    uint256 public warId;
    address public countryMinter;
    address public nationStrength;
    address public military;

    NationStrengthContract nsc;
    MilitaryContract mil;

    struct War {
        uint256 warId;
        uint256 offenseId;
        uint256 defenseId;
        bool active;
        uint256 daysLeft;
        bool peaceDeclared;
        bool offensePeaceOffered;
        bool defensePeaceOffered;
    }

    struct OffenseLosses {
        uint256 warId;
        uint256 nationId;
        uint256 soldiersLost;
        uint256 tanksLost;
        uint256 cruiseMissilesLost;
        uint256 aircraftLost;
        uint256 navyLost;
        uint256 infrastructureLost;
        uint256 technologyLost;
        uint256 landLost;
    }

    struct DefenseLosses {
        uint256 warId;
        uint256 nationId;
        uint256 soldiersLost;
        uint256 tanksLost;
        uint256 cruiseMissilesLost;
        uint256 aircraftLost;
        uint256 navyLost;
        uint256 infrastructureLost;
        uint256 technologyLost;
        uint256 landLost;
    }

    mapping(uint256 => address) public idToOwnerWar;
    mapping(uint256 => War) public warIdToWar;
    mapping(uint256 => OffenseLosses) public warIdToOffenseLosses;
    mapping(uint256 => DefenseLosses) public warIdToDefenseLosses;

    constructor(
        address _countryMinter,
        address _nationStrength,
        address _military
    ) {
        countryMinter = _countryMinter;
        nationStrength = _nationStrength;
        nsc = NationStrengthContract(_nationStrength);
        military = _military;
        mil = MilitaryContract(_military);
    }

    function updateCountryMinterContract(address newAddress) public onlyOwner {
        countryMinter = newAddress;
    }

    function updateNationStrengthContract(address newAddress) public onlyOwner {
        nationStrength = newAddress;
        nsc = NationStrengthContract(newAddress);
    }

    function updateMilitaryContract(address newAddress) public onlyOwner {
        military = newAddress;
        mil = MilitaryContract(newAddress);
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "caller not Country Minter contract"
        );
        _;
    }

    function initiateNationForWar(uint256 id, address nationOwner)
        public
        onlyCountryMinter
    {
        idToOwnerWar[id] = nationOwner;
    }

    function declareWar(uint256 offenseId, uint256 defenseId) public {
        require(idToOwnerWar[offenseId] == msg.sender, "!nation ruler");
        bool isWarOkOffense = mil.getWarPeacePreference(offenseId);
        require(isWarOkOffense == true, "you are in peace mode");
        bool isWarOkDefense = mil.getWarPeacePreference(offenseId);
        require(isWarOkDefense == true, "nation in peace mode");
        bool isStrengthWithinRange = checkStrength(offenseId, defenseId);
        require(
            isStrengthWithinRange == true,
            "nation strength is not within range"
        );
        War memory newWar = War(warId, offenseId, defenseId, true, 7, false, false, false);
        warIdToWar[warId] = newWar;
        OffenseLosses memory newOffenseLosses = OffenseLosses(warId, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        warIdToOffenseLosses[warId] = newOffenseLosses;
        DefenseLosses memory newDefenseLosses = DefenseLosses(warId, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        warIdToDefenseLosses[warId] = newDefenseLosses;
        warId++;
    }

    function checkStrength(uint256 offenseId, uint256 defenseId)
        public
        view
        returns (bool)
    {
        uint256 offenseStrength = nsc.getNationStrength(offenseId);
        uint256 defenseStrength = nsc.getNationStrength(defenseId);
        uint256 strengthRatio = ((offenseStrength * 100) / defenseStrength);
        if (strengthRatio < 75) {
            return false;
        } else if (strengthRatio > 133) {
            return false;
        } else {
            return true;
        }
    }

    function offerPeace(uint256 offerId, uint256 warId) public {
        require(idToOwnerWar[offerId] == msg.sender, "!nation owner");
        uint256 offenseNation = warIdToWar[warId].offenseId;
        uint256 defenseNation = warIdToWar[warId].defenseId;
        require(offerId == offenseNation || offerId == defenseNation, "nation not involved in this war");
        if (offerId == offenseNation) {
            warIdToWar[warId].offensePeaceOffered = true;
        }
        if (offerId == defenseNation) {
            warIdToWar[warId].defensePeaceOffered = true;
        }
        bool offensePeaceOffered = warIdToWar[warId].offensePeaceOffered;
        bool defensePeaceOffered = warIdToWar[warId].defensePeaceOffered;
        if (offensePeaceOffered == true && defensePeaceOffered == true) {
            warIdToWar[warId].peaceDeclared = true;
            warIdToWar[warId].active = false;
        }
    }
}
