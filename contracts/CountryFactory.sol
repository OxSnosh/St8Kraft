//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

//minting countries
contract CountryFactory {
    //each wallet makes a country
    uint256 public countryId;

    mapping(uint256 => Country) public idToCountry;
    mapping(uint256 => address) public countryToOwner;

    struct Country {
        uint256 _id;
        address _owner;
        string _ruler;
    }

    function newCountry(string memory _ruler) public {
        countryId += 1;
        idToCountry[countryId] = Country(countryId, msg.sender, _ruler);
        countryToOwner[countryId] = msg.sender;
    }

    //have variables like land, soldiers
}
