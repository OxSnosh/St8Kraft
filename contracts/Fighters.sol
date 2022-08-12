//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract FightersContract {

    uint private fightersId;

    struct Fighters {
        uint256 aircraft;
        uint256 yak9Count;
        uint256 p51MustangCount;
        uint256 f86SabreCount;
        uint256 mig15Count;
        uint256 f100SuperSabreCount;
        uint256 f35LightningCount;
        uint256 f15EagleCount;
        uint256 su30MkiCount;
        uint256 f22RaptorCount;
    }

    mapping(uint256 => Fighters) public idToFighters;

    function generateFighters() public {
        Fighters memory newFighters = Fighters(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToFighters[fightersId] = newFighters;
        fightersId++;
    } 

}