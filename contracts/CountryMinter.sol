//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IWarBucks.sol";

//minting countries
contract CountryMinter is ERC721 {
    //each wallet makes a country
    uint256 public countryId;
    address public warBucksAddress;
    uint256 public seedMoney = 1000;

    mapping(uint256 => CountryStuct1) public idToCountryStuct1;
    mapping(uint256 => CountryStuct2) public idToCountryStuct2;
    mapping(uint256 => CountryStuct3) public idToCountryStuct3;
    mapping(uint256 => CountryStuct4) public idToCountryStuct4;
    mapping(uint256 => CountryStuct5) public idToCountryStuct5;
    mapping(uint256 => address) public idToOwner;

    Country[] public countriesArray;

    constructor(address warBucksAddressImport) ERC721("MetaNation", "MTA") {
        warBucksAddress = warBucksAddressImport;
    }

    struct CountryStuct1 {
        uint256 id;
        address rulerAddress;
        string rulerName;
        string nationName;
    }

    struct CountryStruct2 {
        uint256 lastTaxCollection;
        string alliance;
        string capitalCity;
        string nationSlogan;
        string governmentType;
        string nationalReligion;
        string currencyType;
        string nationTeam;
        string nationCreated;
        uint256 technology;
        uint256 infrastructure;
        uint16 taxRate;
    }
        // uint256 areaOfInfluence;
        // string warPeacePreference;
        // string resource1;
        // string resource2;
        // string bonusResources;
        // uint8 tradeSlotsUsed;
        // string improvments;
        // string nationalWonders;
        // uint16 environment;
        // uint256 nationRank;
        // uint256 nationStrength;
        // uint256 efficiency;
        // uint8 defconLevel;
        // string threatLevel;
        // uint256 numberOfSoldiers;
        // uint256 defendingSoldiers;
        // uint256 deployedSoldiers;
        // uint256 numberOfTanks;
        // uint256 defendingTanks;
        // uint256 deployedTanks;
        // uint256 aircraft;
        // uint256 cruiseMissiles;
        // uint256 navyVessels;
        // uint256 nuclearWeapons;
        // uint256 numberOfSpies;
        // uint256 numberSoldiersLost;
        // uint8 casualtyRankPercentile;
        // uint256 population;
        // uint256 militaryPersonnel;
        // uint256 citizens;
        // uint256 criminals;
        // uint16 populationHappiness;
        // uint16 crimeIndex;
        // uint256 grossIncomePerCitizenPerDay;
        // uint256 individualTaxableIncomePerDay;
        // uint256 netDailyTaxesCollectable;
        // uint256 incomeTaxesCollectedOverTime;
        // uint256 expensesOverTime;
        // uint256 billsPaid;
        // uint256 purchasesOverTime;
        // uint256 balance;
    }

    function generateCountry(string memory ruler, string memory nationName /* string memory capitalCity, string memory nationSlogan */) public payable {
        IWarBucks(warBucksAddress).mint(address(this), seedMoney);
        Country memory newCountry = Country(
        countryId,
        msg.sender,
        ruler,
        nationName,
        // 0,
        // "No Alliance",
        // capitalCity,
        // nationSlogan,
        // "governmentType",
        // "nationalReligion",
        // "currencyType",
        // "nationTeam",
        // "nationCreated",
        // 0,
        // 0,
        // 0,
        // 0,
        // "warPeacePreference",
        // "Resource 1",
        // "Resource 2",
        // "Bonus Resources",
        // 0,
        // "improvments",
        // "nationalWonders",
        // 0,
        // 0,
        // 0,
        // 0,
        // 5,
        // "Low",
        // 0,
        // 0, 
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0,
        // 0
        );
        countriesArray.push(newCountry);
        idToCountry[countryId] = newCountry;
        idToOwner[countryId] = msg.sender;
        countryId++;
    }

    //withdraw from nation
    //check that withdrawer is the owner of the nation/NFT
    function withdrawWarBucks(uint256 id, uint256 amount) public {
        require(idToOwner[id] == msg.sender, "Not the owner of this nation");
        IERC20(warBucksAddress).transfer(msg.sender, amount);
        idToCountry[id].balance -= amount;
    }

    //taxes to collect = population * taxable earnings per day
    //=+ taxes every night at midnight

    function viewCountry(uint256 id) public view returns (Country memory) {
        return idToCountry[id];
    }

    //have variables like land, soldiers
}
