//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./CountryMinter.sol";

interface ICountryMinter {
    // struct CountryParameters {
    //     uint256 id;
    //     address rulerAddress;
    //     string rulerName;
    //     string nationName;
    //     string capitalCity;
    //     string nationSlogan;
    // }

    // struct CountrySettings {
    //     uint256 nationCreated;
    //     uint256 lastTaxCollection;
    //     string alliance;
    //     string nationTeam;
    //     string governmentType;
    //     string nationalReligion;
    //     string currencyType;
    // }

    // struct Infrastructure {
    //     uint256 areaOfInfluence;
    //     uint256 technology;
    //     uint256 infrastructure;
    //     uint16 taxRate;
    //     uint256 population;
    //     uint256 citizens;
    //     uint256 criminals;
    //     uint16 populationHappiness;
    //     uint16 crimeIndex;
    // }

    // struct Market {
    //     string resource1;
    //     string resource2;
    //     string bonusResources;
    //     uint8 tradeSlotsUsed;
    //     string improvments;
    //     string nationalWonders;
    //     uint16 environment;
    //     uint256 efficiency;
    // }

    // struct Military {
    //     uint8 defconLevel;
    //     string threatLevel;
    //     bool warPeacePreference;
    //     uint256 nationStrength;
    // }

    // struct Forces {
    //     uint256 numberOfSoldiers;
    //     uint256 defendingSoldiers;
    //     uint256 deployedSoldiers;
    //     uint256 numberOfTanks;
    //     uint256 defendingTanks;
    //     uint256 deployedTanks;
    //     uint256 cruiseMissiles;
    //     uint256 nuclearWeapons;
    //     uint256 numberOfSpies;
    // }

    // struct Treasury {
    //     uint256 grossIncomePerCitizenPerDay;
    //     uint256 individualTaxableIncomePerDay;
    //     uint256 netDailyTaxesCollectable;
    //     uint256 incomeTaxesCollectedOverTime;
    //     uint256 expensesOverTime;
    //     uint256 billsPaid;
    //     uint256 purchasesOverTime;
    //     uint256 balance;
    //     uint256 lockedBalance;
    // }

    // struct Navy {
    //     uint256 navyVessels;
    //     uint256 corvetteCount;
    //     uint256 landingShipCount;
    //     uint256 battleshipCount;
    //     uint256 cruiserCount;
    //     uint256 frigateCount;
    //     uint256 destroyerCount;
    //     uint256 submarintCount;
    //     uint256 aircraftCarrierCount;
    // }

    // struct Fighters {
    //     uint256 aircraft;
    //     uint256 yak9Count;
    //     uint256 p51MustangCount;
    //     uint256 f86SabreCount;
    //     uint256 mig15Count;
    //     uint256 f100SuperSabreCount;
    //     uint256 f35LightningCount;
    //     uint256 f15EagleCount;
    //     uint256 su30MkiCount;
    //     uint256 f22RaptorCount;
    // }

    // struct Bombers {
    //     uint256 ah1CobraCount;
    //     uint256 ah64ApacheCount;
    //     uint256 bristolBlenheimCount;
    //     uint256 b52MitchellCount;
    //     uint256 b17gFlyingFortressCount;
    //     uint256 b52StratofortressCount;
    //     uint256 b2SpiritCount;
    //     uint256 b1bLancerCount;
    //     uint256 tupolevTu160Count;
    // }

        // function getCountryParameters(uint256 countryId)
    //     external
    //     view
    //     returns (CountryParameters memory);

    // function getCountrySettings(uint256 countryId)
    //     external
    //     view
    //     returns (CountrySettings memory);

    // function getInfrastructure(uint256 countryId)
    //     external
    //     view
    //     returns (Infrastructure memory);

    // function getMarket(uint256 countryId) external view returns (Market memory);

    // function getMilitary(uint256 countryId)
    //     external
    //     view
    //     returns (Military memory);

    // function getForces(uint256 countryId)
    //     external
    //     view
    //     returns (Forces memory);

    // function getTreasury(uint256 countryId)
    //     external
    //     view
    //     returns (Treasury memory);

    // function getNavy(uint256 countryId) external view returns (Navy memory);

    // function getFighters(uint256 countryId)
    //     external
    //     view
    //     returns (Fighters memory);

    // function getBombers(uint256 countryId)
    //     external
    //     view
    //     returns (Bombers memory);
}
