//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// contract for buying commodities (land, infrastructure, tech)
contract CommodityMarketplace {

    const address public WARBUCKS_ADDRESS;
    const address public COUNTRY_FACTORY_ADDRESS;


    constructor(address warBucksAddress, address countryFactoryAddress) {
        WARBUCKS_ADDRESS = warBucksAddress;
        COUNTRY_FACTORY_ADDRESS = countryFactoryAddress;
    } 

    // function buyTank(uint256 amountIn) {
    //     IERC20(_tokenAddress).approve(msg.sender, amountIn);
    //     IERC20(_tokenAddress).transferFrom(msg.sender, address(this), amountIn);
    // }
}

// contract for buing military (soldiers, tanks, planes, nukes)
contract MilitaryMarketplace {

}
