//SPDX-License-Identifier: Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International
pragma solidity 0.8.17;

import "./SpyOperations.sol";
import "./CountryMinter.sol";
import "./KeeperFile.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title MilitaryContract
///@author OxSnosh
///@dev this contract inherits from openzeppelin's ownable contract
///@notice this contract will allow a nation owner to control their defcon level, threat level and war/peace preference
contract MilitaryContract is Ownable {
    address public spyAddress;
    address public countryMinter;
    address public keeper;

    SpyOperationsContract spy;
    CountryMinter mint;
    KeeperContract keep;

    struct Military {
        uint256 defconLevel;
        uint256 threatLevel;
        bool warPeacePreference;
        uint256 dayPeaceToggled;
    }

    event DefconLevelUpdated(uint256 indexed id, uint256 indexed newLevel);

    event ThreatLevelUpdated(uint256 indexed id, uint256 indexed newLevel);

    event WarPeacePreferenceToggled(
        uint256 indexed id,
        bool indexed warPeacePreference
    );

    mapping(uint256 => Military) public idToMilitary;

    modifier onlySpyContract() {
        require(msg.sender == spyAddress, "only callable from spy contract");
        _;
    }

    modifier onlyCountryMinter() {
        require(msg.sender == countryMinter, "only callable from country minter contract");
        _;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings (address _spyAddress, address _countryMinter, address _keeper) public onlyOwner {
        spyAddress = _spyAddress;
        spy = SpyOperationsContract(_spyAddress);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        keeper = _keeper;
        keep = KeeperContract(_keeper);
    }

    ///@dev this function is a public function only callable from the country minter contract
    ///@notice this function will allow allow a nation owner to reset their defcon and threat level and toggle their war peace preference
    function generateMilitary(uint256 id) public onlyCountryMinter {
        Military memory newMilitary = Military(5, 1, false, 0);
        idToMilitary[id] = newMilitary;
    }

    ///@dev this is a public function only callable by the nation owner
    ///@dev this function will allow a nation owner to update their defcon level
    ///@notice this function will allow a nation owner to update their defcon level
    ///@param newDefcon is the new defcon which must be an integer between 1 and 5
    ///@param id is the nation id of the nation updating their defcon
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
        emit DefconLevelUpdated(id, newDefcon);
    }

    ///@dev this function will only be callable from the Spy contract
    ///@dev this function will allow a successful spy operation to update the defcon level
    ///@notice this function will allow a succesful spy attack to update the defcon level
    ///@param id is the nation id that was attacked and getting their defcon reset
    ///@param newLevel is the new defcon level being set during the attack
    function setDefconLevelFromSpyContract(uint256 id, uint256 newLevel) public onlySpyContract {
        idToMilitary[id].defconLevel = newLevel;
    }

    ///@dev this is a public function only callable by the nation owner
    ///@dev this function allows a nation owner to update the threat level of a nation
    ///@notice this function allows a nation owner to update the threat level of a nation
    ///@param newThreatLevel is the new threat level being updated
    ///@param id is the nation id of the nation updating the threat level
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
        emit ThreatLevelUpdated(id, newThreatLevel);
    }

    ///@dev this function will only be callable from the Spy contract
    ///@dev this function will allow a successful spy operation to update the threat level
    ///@notice this function will allow a succesful spy attack to update the threat level
    ///@param id is the nation id that was attacked and getting their threat level reset
    ///@param newLevel is the new threat level being set during the attack
    function setThreatLevelFromSpyContract(uint256 id, uint256 newLevel)
        public
        onlySpyContract
    {
        idToMilitary[id].threatLevel = newLevel;
    }

    ///@dev this function is a public function only callable from the nation owner
    ///@dev this function will allow a nation to toggle their prefernece for peace or war
    ///@notice this function will allow a nation to toggle their prefernece for peace or war
    ///@param id is the nation id of the nation toggling their preference
    function toggleWarPeacePreference(uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require (isOwner, "!nation owner");
        uint256 gameDay = keep.getGameDay();
        if (idToMilitary[id].warPeacePreference == true) {
            require(
                (gameDay - idToMilitary[id].dayPeaceToggled) >= 7,
                "Must wait 7 days to switch to peace mode"
            );
            idToMilitary[id].warPeacePreference = false;
            idToMilitary[id].dayPeaceToggled = gameDay;
        } else {
            idToMilitary[id].warPeacePreference = true;
            idToMilitary[id].dayPeaceToggled = gameDay;
        }
        emit WarPeacePreferenceToggled(id, idToMilitary[id].warPeacePreference);
    }

    ///@dev this is a public view function that will return a nations defcon level
    ///@param id is the nation id of the nation being queried
    ///@return uint256 is the defcon level for a given nation
    function getDefconLevel(uint256 id) public view returns (uint256) {
        uint256 defcon = idToMilitary[id].defconLevel;
        return defcon;
    }

    ///@dev this is a public view function that will return a nations threat level
    ///@param id is the nation id of the nation being queried
    ///@return uint256 is the threat level for a given nation
    function getThreatLevel(uint256 id) public view returns (uint256) {
        uint256 threatLevel = idToMilitary[id].threatLevel;
        return threatLevel;
    }

    ///@dev this is a public view function that will return a nations preference for war
    ///@param id is the nation id of the nation being queried
    ///@return bool is true if war is possible
    function getWarPeacePreference(uint256 id) public view returns (bool) {
        bool war = idToMilitary[id].warPeacePreference;
        return war;
    }

    function getDaysInPeaceMode(uint256 id) public view returns (uint256) {
        uint256 daysPeaceToggled = idToMilitary[id].dayPeaceToggled;
        uint256 gameDay = keep.getGameDay();
        uint256 daysInPeaceMode = (gameDay - daysPeaceToggled);
        return daysInPeaceMode;
    }
}
