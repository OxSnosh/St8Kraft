
//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract CountryParametersContract {

    uint private parametersId;

    struct CountryParameters {
        uint256 id;
        address rulerAddress;
        string rulerName;
        string nationName;
        string capitalCity;
        string nationSlogan;
    }

    mapping(uint256 => CountryParameters) public idToCountryParameters;

    function generateCountryParameters(
        string memory rulerName,
        string memory nationName,
        string memory capitalCity,
        string memory nationSlogan
    ) public {
        CountryParameters memory newCountryParameters = CountryParameters(
            parametersId,
            msg.sender,
            rulerName,
            nationName,
            capitalCity,
            nationSlogan
        );
        idToCountryParameters[parametersId] = newCountryParameters;
        parametersId++;
    }    

}