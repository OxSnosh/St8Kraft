//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// contract for buying commodities (land, infrastructure, tech)
contract CommodityMarketplace {

    address public WARBUCKS_ADDRESS;
    address public COUNTRY_FACTORY_ADDRESS;
    uint8 public TANK_COST = 100;

    constructor(address warBucksAddress, address countryFactoryAddress) {
        WARBUCKS_ADDRESS = warBucksAddress;
        COUNTRY_FACTORY_ADDRESS = countryFactoryAddress;
    } 

    function buyTank() public {
        IERC20(WARBUCKS_ADDRESS).approve(msg.sender, TANK_COST);
        IERC20(WARBUCKS_ADDRESS).transferFrom(msg.sender, address(this), TANK_COST);

    }
}

// contract for buing military (soldiers, tanks, planes, nukes)
// contract MilitaryMarketplace {

// }
