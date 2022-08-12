//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract BombersContract {

    uint private bombersId;

    struct Bombers {
        uint256 ah1CobraCount;
        uint256 ah64ApacheCount;
        uint256 bristolBlenheimCount;
        uint256 b52MitchellCount;
        uint256 b17gFlyingFortressCount;
        uint256 b52StratofortressCount;
        uint256 b2SpiritCount;
        uint256 b1bLancerCount;
        uint256 tupolevTu160Count;
    }

    mapping(uint256 => Bombers) public idToBombers;

    function generateBombers() public {
        Bombers memory newBombers = Bombers(0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToBombers[bombersId] = newBombers;
        bombersId++;
    }  

}