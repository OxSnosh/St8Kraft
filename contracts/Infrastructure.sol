//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract InfrastructureContract {

    uint private infrastructureId;

    struct Infrastructure {
        uint256 areaOfInfluence;
        uint256 technology;
        uint256 infrastructure;
        uint16 taxRate;
        uint256 population;
        uint256 citizens;
        uint256 criminals;
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
            0
        );
        idToInfrastructure[infrastructureId] = newInfrastrusture;
        infrastructureId++;
    }
}