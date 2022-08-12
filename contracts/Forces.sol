//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract ForcesContract {

    uint private forcesId;

    struct Forces {
        uint256 numberOfSoldiers;
        uint256 defendingSoldiers;
        uint256 deployedSoldiers;
        uint256 numberOfTanks;
        uint256 defendingTanks;
        uint256 deployedTanks;
        uint256 cruiseMissiles;
        uint256 nuclearWeapons;
        uint256 numberOfSpies;
    }

    mapping(uint256 => Forces) public idToForces;

    function generateForces() public {
        Forces memory newForces = Forces(0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToForces[forcesId] = newForces;
        forcesId++;
    }  

}