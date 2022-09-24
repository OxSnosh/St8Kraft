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
    address public navyBattleAddress;
    uint256[] public activeWars;

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
        uint256 offenseBlockades;
        uint256 defenseBlockades;
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
    mapping(uint256 => uint256[]) public idToActiveWars;

    constructor(
        address _countryMinter,
        address _nationStrength,
        address _military,
        address _navyBattleAddress
    ) {
        countryMinter = _countryMinter;
        nationStrength = _nationStrength;
        navyBattleAddress = _navyBattleAddress;
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
        War memory newWar = War(
            warId,
            offenseId,
            defenseId,
            true,
            7,
            false,
            false,
            false,
            0,
            0
        );
        warIdToWar[warId] = newWar;
        OffenseLosses memory newOffenseLosses = OffenseLosses(
            warId,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
        warIdToOffenseLosses[warId] = newOffenseLosses;
        DefenseLosses memory newDefenseLosses = DefenseLosses(
            warId,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
        warIdToDefenseLosses[warId] = newDefenseLosses;
        uint256[] storage offenseActiveWars = idToActiveWars[offenseId];
        offenseActiveWars.push(warId);
        uint256[] storage defenseActiveWars = idToActiveWars[defenseId];
        defenseActiveWars.push(warId);
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

    function offerPeace(uint256 offerId, uint256 _warId) public {
        require(idToOwnerWar[offerId] == msg.sender, "!nation owner");
        uint256 offenseNation = warIdToWar[_warId].offenseId;
        uint256 defenseNation = warIdToWar[_warId].defenseId;
        require(
            offerId == offenseNation || offerId == defenseNation,
            "nation not involved in this war"
        );
        if (offerId == offenseNation) {
            warIdToWar[_warId].offensePeaceOffered = true;
        }
        if (offerId == defenseNation) {
            warIdToWar[_warId].defensePeaceOffered = true;
        }
        bool offensePeaceOffered = warIdToWar[_warId].offensePeaceOffered;
        bool defensePeaceOffered = warIdToWar[_warId].defensePeaceOffered;
        if (offensePeaceOffered == true && defensePeaceOffered == true) {
            warIdToWar[_warId].peaceDeclared = true;
            warIdToWar[_warId].active = false;
            removeActiveWar(offenseNation, defenseNation, _warId);
        }
    }

    function removeActiveWar(
        uint256 offenseId,
        uint256 defenseId,
        uint256 _warId
    ) internal {
        uint256[] storage offenseActiveWars = idToActiveWars[offenseId];
        for (uint256 i = 0; i < offenseActiveWars.length; i++) {
            if (offenseActiveWars[i] == _warId) {
                offenseActiveWars[i] = offenseActiveWars[
                    offenseActiveWars.length - 1
                ];
                offenseActiveWars.pop();
                idToActiveWars[offenseId] = offenseActiveWars;
            }
        }
        uint256[] storage defenseActiveWars = idToActiveWars[defenseId];
        for (uint256 i = 0; i < defenseActiveWars.length; i++) {
            if (defenseActiveWars[i] == _warId) {
                defenseActiveWars[i] = defenseActiveWars[
                    defenseActiveWars.length - 1
                ];
                defenseActiveWars.pop();
                idToActiveWars[defenseId] = defenseActiveWars;
            }
        }
    }

    modifier onlyNavyBattle() {
        require(
            msg.sender == navyBattleAddress,
            "function only callable from navy battle contract"
        );
        _;
    }

    function addNavyCasualties(
        uint256 warId,
        uint256 nationId,
        uint256 navyCasualties
    ) public onlyNavyBattle {
        (uint256 offenseId, uint256 defenseId) = getInvolvedParties(warId);
        if(offenseId == nationId) {
            warIdToOffenseLosses[warId].navyLost = navyCasualties;
        }
        if(defenseId == nationId) {
            warIdToDefenseLosses[warId].navyLost = navyCasualties;
        }
    }

    function isWarActive(uint256 _warId) public view returns (bool) {
        bool isActive = warIdToWar[_warId].active;
        return isActive;
    }

    function getInvolvedParties(uint256 _warId)
        public
        view
        returns (uint256, uint256)
    {
        uint256 offenseId = warIdToWar[_warId].offenseId;
        uint256 defenseId = warIdToWar[_warId].defenseId;
        return (offenseId, defenseId);
    }

    function isPeaceOffered(uint256 _warId) public view returns (bool) {
        bool peaceOffered = false;
        if (
            warIdToWar[_warId].offensePeaceOffered == true ||
            warIdToWar[_warId].defensePeaceOffered == true
        ) {
            peaceOffered = true;
        }
        return peaceOffered;
    }
}
