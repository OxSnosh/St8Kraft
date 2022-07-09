//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IWarBucks is IERC20 {
    function mint(address account, uint256 amount) external;
}
