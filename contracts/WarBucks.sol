//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WarBucks is ERC20, Ownable {
    address treasury;

    constructor(uint256 initialSupply)
        ERC20("WarBucks", "WB")
    {
        _mint(msg.sender, initialSupply);
    }

    modifier onlyTreasury() {
        require(
            msg.sender == treasury,
            "function only callable from treasury contract"
        );
        _;
    }

    function settings(address _treasury) public onlyOwner {
        treasury = _treasury;
    }

    function mint(address account, uint256 amount) external onlyTreasury{
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external onlyTreasury {
        _burn(account, amount);
    }
}
