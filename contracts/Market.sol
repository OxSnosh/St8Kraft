//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract MarketContract {

    uint private marketId;

    struct Market {
        string resource1;
        string resource2;
        string bonusResources;
        uint8 tradeSlotsUsed;
        string improvments;
        string nationalWonders;
        uint16 environment;
        uint256 efficiency;
    }

    mapping(uint256 => Market) public idToMarket;

    function generateMarket() public {
        Market memory newMarket = Market(
            "Resource1",
            "Resource2",
            "bonusResources",
            0,
            "Improvments",
            "NationalWonders",
            0,
            0
        );
        idToMarket[marketId] = newMarket;
        marketId++;
    } 

}