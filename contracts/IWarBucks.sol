//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IWarBucks is IERC20 {
    function mintFromTreasury(address account, uint256 amount) external;

    function burnFromTreasury(address account, uint256 amount) external;

    function burnFromMint(address account, uint256 amount) external;
}
