//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract InfrastructureContract {
    uint256 private infrastructureId;

    struct Infrastructure {
        uint256 landCount;
        uint256 technologyCount;
        uint256 infrastructureCount;
        uint256 nationStrength;
        uint16 taxRate;
        uint256 populationCount;
        uint256 citizenCount;
        uint256 criminalCount;
        uint16 populationHappiness;
        uint16 crimeIndex;
    }

    mapping(uint256 => Infrastructure) public idToInfrastructure;

    function generateInfrastructure() public {
        Infrastructure memory newInfrastrusture = Infrastructure(
            0,
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
        idToInfrastructure[infrastructureId] = newInfrastrusture;
        infrastructureId++;
    }

    //how to graduate tech and infrastructure purchases

    function getLandCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 landAmount = idToInfrastructure[countryId].landCount;
        return landAmount;
    }

    function getTechnologyCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 technologyAmount = idToInfrastructure[countryId]
            .technologyCount;
        return technologyAmount;
    }

    function getInfrastructureCount(uint256 countryId)
        public
        view
        returns (uint256 count)
    {
        uint256 infrastructureAmount = idToInfrastructure[countryId]
            .infrastructureCount;
        return infrastructureAmount;
    }

    function getNationStrength(uint256 countryId)
        public
        view
        returns (uint256 nationStrength)
    {
        uint256 strength = idToInfrastructure[countryId].nationStrength;
        return strength;
    }
}
