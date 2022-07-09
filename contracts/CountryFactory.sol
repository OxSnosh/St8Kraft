//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IWarBucks.sol";

//minting countries
contract CountryFactory is ERC721 {
    //each wallet makes a country
    uint256 public countryId;
    address public WARBUCKS_ADDRESS;
    uint256 public SEED_MONEY = 1000;


    mapping(uint256 => Country) public idToCountry;
    mapping(uint256 => address) public idToOwner;

    Country[] public countriesArray;

    constructor(address warBucksAddress
    ) ERC721 ("MetaNation", "MTA") {
        WARBUCKS_ADDRESS = warBucksAddress;
    }

    struct Country {
        uint256 id;
        address rulerAddress;
        string rulerName;
        uint256 balance;
    }

    function generateCountry(string memory ruler) public payable {
        IWarBucks(WARBUCKS_ADDRESS).mint(address(this), SEED_MONEY);
        Country memory newCountry = Country(
            countryId,
            msg.sender,
            ruler,
            SEED_MONEY
        );
        countriesArray.push(newCountry);
        idToCountry[countryId] = newCountry;
        idToOwner[countryId] = msg.sender;
        countryId++;
    }

    //withdraw from nation
    //check that withdrawer is the owner of the nation/NFT
    function withdrawWarBucks(uint id, uint amount) public {
        require(idToOwner[id] == msg.sender, "Not the owner of this nation");
        IERC20(WARBUCKS_ADDRESS).transfer(msg.sender, amount);
        idToCountry[id].balance -= amount;
    }

    //taxes to collect = population * taxable earnings per day
    //=+ taxes every night at midnight


    function viewCountry(uint256 id) public view returns (Country memory) {
        return idToCountry[id];
    }

    //have variables like land, soldiers
}
