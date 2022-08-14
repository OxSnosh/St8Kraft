//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract CountryParametersContract {
    uint256 private parametersId;

    struct CountryParameters {
        uint256 id;
        address rulerAddress;
        string rulerName;
        string nationName;
        string capitalCity;
        string nationSlogan;
    }

    mapping(uint256 => CountryParameters) public idToCountryParameters;
    mapping(uint256 => address) public idToOwnerParameters;

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
        idToOwnerParameters[parametersId] = msg.sender;
        parametersId++;
    }

    function updateRulerName(string memory newRulerName, uint256 id) public {
        require(
            idToOwnerParameters[id] == msg.sender,
            "You are not the nation ruler"
        );
        idToCountryParameters[id].rulerName = newRulerName;
    }

    function updateNationName(string memory newNationName, uint256 id) public {
        require(
            idToOwnerParameters[id] == msg.sender,
            "You are not the nation ruler"
        );
        idToCountryParameters[id].nationName = newNationName;
    }

    function updateCapitalCity(string memory newCapitalCity, uint256 id)
        public
    {
        require(
            idToOwnerParameters[id] == msg.sender,
            "This account is not the nation ruler"
        );
        idToCountryParameters[id].capitalCity = newCapitalCity;
    }

    function updateNationSlogan(string memory newNationSlogan, uint256 id)
        public
    {
        require(
            idToOwnerParameters[id] == msg.sender,
            "This account is not the nation ruler"
        );
        idToCountryParameters[id].nationSlogan = newNationSlogan;
    }
}
