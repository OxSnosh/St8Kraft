//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// contract for buying commodities (land, infrastructure, tech)
contract CommodityMarketplace {
    address public warBucksAddress;
    address public countryMinterAddress;
    uint8 public tankCost = 100;

    constructor (address warBucksAddressImported, address countryFactoryAddressImported) {
        warBucksAddress = warBucksAddressImported;
        countryMinterAddress = countryFactoryAddressImported;
    }

    function buyTank() public {
        IERC20(warBucksAddress).approve(msg.sender, tankCost);
        IERC20(warBucksAddress).transferFrom(
            msg.sender,
            address(this),
            tankCost
        );
    }
}

// contract for buing military (soldiers, tanks, planes, nukes)
// contract MilitaryMarketplace {

// }
