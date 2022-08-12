//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IWarBucks.sol";
import "./CountryParameters.sol";

contract CountryMinter is ERC721 {
    uint256 public countryId;
    address public warBucksAddress;
    address public countryParametersContract;
    uint256 public seedMoney = 1000;

    // struct CountryParameters {
    //     uint256 id;
    //     address rulerAddress;
    //     string rulerName;
    //     string nationName;
    //     string capitalCity;
    //     string nationSlogan;
    // }

    struct CountrySettings {
        uint256 nationCreated;
        uint256 lastTaxCollection;
        string alliance;
        string nationTeam;
        string governmentType;
        string nationalReligion;
        string currencyType;
    }

    struct Infrastructure {
        uint256 areaOfInfluence;
        uint256 technology;
        uint256 infrastructure;
        uint16 taxRate;
        uint256 population;
        uint256 citizens;
        uint256 criminals;
        uint16 populationHappiness;
        uint16 crimeIndex;
    }

    struct Market {
        string resource1;
        string resource2;
        string bonusResources;
        uint8 tradeSlotsUsed;
        string improvments;
        string nationalWonders;
        uint16 environment;
        uint256 efficiency;
    }

    struct Military {
        uint8 defconLevel;
        string threatLevel;
        bool warPeacePreference;
        uint256 nationStrength;
    }

    struct Forces {
        uint256 numberOfSoldiers;
        uint256 defendingSoldiers;
        uint256 deployedSoldiers;
        uint256 numberOfTanks;
        uint256 defendingTanks;
        uint256 deployedTanks;
        uint256 cruiseMissiles;
        uint256 nuclearWeapons;
        uint256 numberOfSpies;
    }

    struct Treasury {
        uint256 grossIncomePerCitizenPerDay;
        uint256 individualTaxableIncomePerDay;
        uint256 netDailyTaxesCollectable;
        uint256 incomeTaxesCollectedOverTime;
        uint256 expensesOverTime;
        uint256 billsPaid;
        uint256 purchasesOverTime;
        uint256 balance;
        uint256 lockedBalance;
    }

    struct Navy {
        uint256 navyVessels;
        uint256 corvetteCount;
        uint256 landingShipCount;
        uint256 battleshipCount;
        uint256 cruiserCount;
        uint256 frigateCount;
        uint256 destroyerCount;
        uint256 submarintCount;
        uint256 aircraftCarrierCount;
    }

    struct Fighters {
        uint256 aircraft;
        uint256 yak9Count;
        uint256 p51MustangCount;
        uint256 f86SabreCount;
        uint256 mig15Count;
        uint256 f100SuperSabreCount;
        uint256 f35LightningCount;
        uint256 f15EagleCount;
        uint256 su30MkiCount;
        uint256 f22RaptorCount;
    }

    struct Bombers {
        uint256 ah1CobraCount;
        uint256 ah64ApacheCount;
        uint256 bristolBlenheimCount;
        uint256 b52MitchellCount;
        uint256 b17gFlyingFortressCount;
        uint256 b52StratofortressCount;
        uint256 b2SpiritCount;
        uint256 b1bLancerCount;
        uint256 tupolevTu160Count;
    }

    // mapping(uint256 => CountryParameters) public idToCountryParameters;
    mapping(uint256 => CountrySettings) public idToCountrySettings;
    mapping(uint256 => Infrastructure) public idToInfrastructure;
    mapping(uint256 => Market) public idToMarket;
    mapping(uint256 => Military) public idToMilitary;
    mapping(uint256 => Forces) public idToForces;
    mapping(uint256 => Treasury) public idToTreasury;
    mapping(uint256 => Navy) public idToNavy;
    mapping(uint256 => Fighters) public idToFighters;
    mapping(uint256 => Bombers) public idToBombers;
    mapping(uint256 => address) public idToOwner;
    mapping(address => uint256) public ownerCountryCount;

    event nationCreated(
        address indexed countryOwner,
        string indexed nationName,
        string indexed ruler
    );

    constructor(address _warBucksAddress, address _countryParametersContract) ERC721("MetaNations", "MNS") {
        warBucksAddress = _warBucksAddress;
        countryParametersContract = _countryParametersContract;
    }

    function generateCountry(
        string memory ruler,
        string memory nationName,
        string memory capitalCity,
        string memory nationSlogan
    ) public payable {
        require(
            ownerCountryCount[msg.sender] == 0,
            "Wallet already contains a country"
        );
        IWarBucks(warBucksAddress).mint(address(this), seedMoney);
        CountryParametersContract(countryParametersContract).generateCountryParameters(ruler, nationName, capitalCity, nationSlogan);
        generateCountrySettings();
        generateInfrastructure();
        generateMarket();
        generateMilitary();
        generateForces();
        generateTreasury();
        generateNavy();
        generateFighters();
        generateBombers();
        idToOwner[countryId] = msg.sender;
        ownerCountryCount[msg.sender]++;
        emit nationCreated(msg.sender, nationName, ruler);
        countryId++;
    }

    // function generateCountryParameters(
    //     string memory rulerName,
    //     string memory nationName,
    //     string memory capitalCity,
    //     string memory nationSlogan
    // ) internal {
    //     CountryParameters memory newCountryParameters = CountryParameters(
    //         countryId,
    //         msg.sender,
    //         rulerName,
    //         nationName,
    //         capitalCity,
    //         nationSlogan
    //     );
    //     idToCountryParameters[countryId] = newCountryParameters;
    // }

    function generateCountrySettings() internal {
        CountrySettings memory newCountrySettings = CountrySettings(
            0,
            0,
            "Alliance",
            "nationTeam",
            "governmentType",
            "Religion",
            "Currency"
        );
        idToCountrySettings[countryId] = newCountrySettings;
    }

    function generateInfrastructure() internal {
        Infrastructure memory newInfrastrusture = Infrastructure(
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
        idToInfrastructure[countryId] = newInfrastrusture;
    }

    function generateMarket() internal {
        Market memory newMarket = Market(
            "Resource1",
            "Resource2",
            "bonusResources",
            0,
            "Improvments",
            "NationalWonders",
            0,
            0
        );
        idToMarket[countryId] = newMarket;
    }

    function generateMilitary() internal {
        Military memory newMilitary = Military(0, "ThreatLevel", false, 0);
        idToMilitary[countryId] = newMilitary;
    }

    function generateForces() internal {
        Forces memory newForces = Forces(0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToForces[countryId] = newForces;
    }

    function generateTreasury() internal {
        Treasury memory newTreasury = Treasury(0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToTreasury[countryId] = newTreasury;
    }

    function generateNavy() internal {
        Navy memory newNavy = Navy(0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToNavy[countryId] = newNavy;
    }

    function generateFighters() internal {
        Fighters memory newFighters = Fighters(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToFighters[countryId] = newFighters;
    }

    function generateBombers() internal {
        Bombers memory newBombers = Bombers(0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToBombers[countryId] = newBombers;
    }

    function withdrawWarBucks(uint256 id, uint256 amount) public {
        require(idToOwner[id] == msg.sender, "Not the owner of this nation");
        IERC20(warBucksAddress).transfer(msg.sender, amount);
        idToTreasury[id].balance -= amount;
    }

    // taxes to collect = population * taxable earnings per day
    // =+ taxes every night at midnight

    // function viewCountry(uint256 id) public view returns (Country memory) {
    //     return idToCountry[id];
    // }

    // function getForces(uint256 countryId)
    //     external
    //     view
    //     virtual
    //     returns (Forces memory);
}
