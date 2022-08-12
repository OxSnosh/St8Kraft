//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract CountrySettingsContract {

    uint private settingsId;

    struct CountrySettings {
        uint256 nationCreated;
        uint256 lastTaxCollection;
        string alliance;
        string nationTeam;
        string governmentType;
        string nationalReligion;
        string currencyType;
    }

    mapping(uint256 => CountrySettings) public idToCountrySettings;

    function generateCountrySettings() public {
        CountrySettings memory newCountrySettings = CountrySettings(
            0,
            0,
            "Alliance",
            "nationTeam",
            "governmentType",
            "Religion",
            "Currency"
        );
        idToCountrySettings[settingsId] = newCountrySettings;
        settingsId++;
    } 

}