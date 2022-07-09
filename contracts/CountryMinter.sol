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

    mapping(uint256 => CountryStruct1) public idToCountryStruct1;
    mapping(uint256 => CountryStruct2) public idToCountryStruct2;
    mapping(uint256 => CountryStruct3) public idToCountryStruct3;
    mapping(uint256 => CountryStruct4) public idToCountryStruct4;
    mapping(uint256 => CountryStruct5) public idToCountryStruct5;
    mapping(uint256 => address) public idToOwner;

    // Country[] public countriesArray;

    constructor(address warBucksAddressImport) ERC721("MetaNation", "MTA") {
        warBucksAddress = warBucksAddressImport;
    }

    struct CountryStruct1 {
        uint256 id;
        address rulerAddress;
        string rulerName;
        string nationName;
        uint256 lastTaxCollection;
        string alliance;
        string capitalCity;
        string nationSlogan;
    }

    struct CountryStruct2 {
        string governmentType;
        string nationalReligion;
        string currencyType;
        string nationTeam;
        string nationCreated;
        uint256 technology;
        uint256 infrastructure;
        uint16 taxRate;
    }

    struct CountryStruct3 {
        uint256 areaOfInfluence;
        string warPeacePreference;
        string resource1;
        string resource2;
        string bonusResources;
        uint8 tradeSlotsUsed;
        string improvments;
        string nationalWonders;
        uint16 environment;
        uint256 nationRank;
        uint256 nationStrength;
        uint256 efficiency;
        uint8 defconLevel;
        string threatLevel;
        uint256 numberOfSoldiers;
    }

    struct CountryStruct4 {
        uint256 defendingSoldiers;
        uint256 deployedSoldiers;
        uint256 numberOfTanks;
        uint256 defendingTanks;
        uint256 deployedTanks;
        uint256 aircraft;
        uint256 cruiseMissiles;
        uint256 navyVessels;
        uint256 nuclearWeapons;
        uint256 numberOfSpies;
        uint256 numberSoldiersLost;
        uint8 casualtyRankPercentile;
        uint256 population;
        uint256 militaryPersonnel;
        uint256 citizens;
    }

    struct CountryStruct5 {
        uint256 criminals;
        uint16 populationHappiness;
        uint16 crimeIndex;
        uint256 grossIncomePerCitizenPerDay;
        uint256 individualTaxableIncomePerDay;
        uint256 netDailyTaxesCollectable;
        uint256 incomeTaxesCollectedOverTime;
        uint256 expensesOverTime;
        uint256 billsPaid;
        uint256 purchasesOverTime;
        uint256 balance;
    }

    function generateCountry (string memory ruler, string memory nationName, string memory capitalCity, string memory nationSlogan) public payable {
        IWarBucks(warBucksAddress).mint(address(this), seedMoney);
        generateCountryStruct1(ruler, nationName, capitalCity, nationSlogan);
        generateCountryStruct2();
        generateCountryStruct3();
        generateCountryStruct4();
        generateCountryStruct5();
        idToOwner[countryId] = msg.sender;
        countryId++;
    }

    function generateCountryStruct1 (string memory ruler, string memory nationName, string memory capitalCity, string memory nationSlogan) private {
        CountryStruct1 memory newCountryStruct1 = CountryStruct1(
            countryId,
            msg.sender,
            ruler,
            nationName,
            0,
            "No Alliance",
            capitalCity,
            nationSlogan
        );
        idToCountryStruct1[countryId] = newCountryStruct1;
    }

    function generateCountryStruct2 () private {
        CountryStruct2 memory newCountryStruct2 = CountryStruct2(
            "governmentType",
            "nationalReligion",
            "currencyType",
            "nationTeam",
            "nationCreated",
            0,
            0,
            0
        );
        idToCountryStruct2[countryId] = newCountryStruct2;
    }

    function generateCountryStruct3 () private {
        CountryStruct3 memory newCountryStruct3 = CountryStruct3(
            0,
            "warPeacePreference",
            "Resource 1",
            "Resource 2",
            "Bonus Resources",
            0,
            "improvments",
            "nationalWonders",
            0,
            0,
            0,
            0,
            5,
            "Low",
            0
        );
        idToCountryStruct3[countryId] = newCountryStruct3;
    }

    function generateCountryStruct4 () private {
        CountryStruct4 memory newCountryStruct4 = CountryStruct4(
            0, 
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
        idToCountryStruct4[countryId] = newCountryStruct4;
    }

    function generateCountryStruct5 () private {
        CountryStruct5 memory newCountryStruct5 = CountryStruct5(
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
        idToCountryStruct5[countryId] = newCountryStruct5;
    }



    //withdraw from nation
    //check that withdrawer is the owner of the nation/NFT
    function withdrawWarBucks(uint256 id, uint256 amount) public {
        require(idToOwner[id] == msg.sender, "Not the owner of this nation");
        IERC20(warBucksAddress).transfer(msg.sender, amount);
        idToCountryStruct5[id].balance -= amount;
    }

    //taxes to collect = population * taxable earnings per day
    //=+ taxes every night at midnight

    // function viewCountry(uint256 id) public view returns (Country memory) {
    //     return idToCountry[id];
    // }

}
