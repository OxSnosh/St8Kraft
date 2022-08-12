//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./CountryMinter.sol";

contract CommodityMarketplace {
    address public warBucksAddress;
    address public countryMinterAddress;
    uint8 public tankCost = 100;

    constructor(
        address warBucksAddressImported,
        address countryMinterAddressImported
    ) {
        warBucksAddress = warBucksAddressImported;
        countryMinterAddress = countryMinterAddressImported;
    }

    // function buyTank(uint256 id, uint256 amount) public {
    //     IERC20(warBucksAddress).approve(msg.sender, tankCost);
    //     IERC20(warBucksAddress).transferFrom(
    //         msg.sender,
    //         address(this),
    //         tankCost
    //     );
    //     (,,,uint256 numberOfTanks,,,,,) = CountryMinter(
    //         countryMinterAddress
    //     ).idToForces(id);
    //     numberOfTanks += amount;
        
    // }
}

// contract for buing military (soldiers, tanks, planes, nukes)
// contract MilitaryMarketplace {

// }
