//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract NavyContract {

    uint private navyId;

    struct Navy {
        uint256 navyVessels;
        uint256 corvetteCount;
        uint256 landingShipCount;
        uint256 battleshipCount;
        uint256 cruiserCount;
        uint256 frigateCount;
        uint256 destroyerCount;
        uint256 submarintCount;
        uint256 aircraftCarrierCount;
    }

    mapping(uint256 => Navy) public idToNavy;

    function generateNavy() public {
        Navy memory newNavy = Navy(0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToNavy[navyId] = newNavy;
        navyId++;
    }

}