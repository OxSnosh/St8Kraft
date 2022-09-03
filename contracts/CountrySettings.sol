//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract CountrySettingsContract {

    uint private settingsId;

    struct CountrySettings {
        uint256 nationCreated;
        uint256 lastTaxCollection;
        string alliance;
        string nationTeam;
        uint256 governmentType;
        string nationalReligion;
        string currencyType;
    }

    mapping(uint256 => CountrySettings) public idToCountrySettings;
    mapping(uint256 => address) public idToOwnerSettings;

    function generateCountrySettings() public {
        CountrySettings memory newCountrySettings = CountrySettings(
            block.timestamp,
            block.timestamp,
            "Alliance",
            "nationTeam",
            0,
            "Religion",
            "Currency"
        );
        idToCountrySettings[settingsId] = newCountrySettings;
        idToOwnerSettings[settingsId] = msg.sender;
        settingsId++;
    } 

    function setAlliance(string memory newAlliance, uint id) public {
        require(idToOwnerSettings[id] == msg.sender, "You are not the nation ruler");
        idToCountrySettings[id].alliance = newAlliance;
    }

    function getGovernmentType(uint256 countryId) public view returns (uint) {
        uint256 governmentType = idToCountrySettings[countryId].governmentType;
        return governmentType;
    }

}