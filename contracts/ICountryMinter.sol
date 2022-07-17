//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

interface CountryStructLibrary {
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
        // uint256 areaOfInfluence;
        string warPeacePreference;
        string resource1;
        string resource2;
        string bonusResources;
        uint8 tradeSlotsUsed;
        string improvments;
        string nationalWonders;
        // uint16 environment;
        // uint256 nationRank;
        uint256 nationStrength;
        // uint256 efficiency;
        // uint8 defconLevel;
        // string threatLevel;
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
        // uint256 numberSoldiersLost;
        // uint8 casualtyRankPercentile;
        uint256 population;
        // uint256 militaryPersonnel;
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

    struct CountryStruct6 {
        uint256 corvetteCount;
        uint256 landingShipCount;
        uint256 battleshipCount;
        uint256 cruiserCount;
        uint256 frigateCount;
        uint256 destroyerCount;
        uint256 submarintCount;
        uint256 aircraftCarrierCount;
    }

    struct CountryStruct7 {
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

    struct CountryStruct8 {
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

    function generateCountry(
        string memory ruler,
        string memory nationName,
        string memory capitalCity,
        string memory nationSlogan
    ) external payable;

    function getCountryStruct1(uint256 countryId)
        external
        view
        returns (
            uint256 id,
            address rulerAddress,
            string memory rulerName,
            string memory nationName,
            uint256 lastTaxCollection,
            string memory alliance,
            string memory capitalCity,
            string memory nationSlogan
        );

    function getCountryStruct2(uint256 countryId)
        external
        view
        returns (
            string memory governmentType,
            string memory nationalReligion,
            string memory currencyType,
            string memory nationTeam,
            string memory nationCreated,
            uint256 technology,
            uint256 infrastructure,
            uint16 taxRate
        );

    function getCountryStruct3(uint256 countryId)
        external
        view
        returns (
            string memory warPeacePreference,
            string memory resource1,
            string memory resource2,
            string memory bonusResources,
            uint8 tradeSlotsUsed,
            string memory improvments,
            string memory nationalWonders,
            uint256 nationStrength,
            uint256 numberOfSoldiers
        );

    function getCountryStruct4(uint256 countryId)
        external
        view
        returns (
            CountryStruct4 memory
        );

    function getCountryStruct5(uint256 countryId)
        external
        view
        returns (
            uint256 criminals,
            uint16 populationHappiness,
            uint16 crimeIndex,
            uint256 grossIncomePerCitizenPerDay,
            uint256 individualTaxableIncomePerDay,
            uint256 netDailyTaxesCollectable,
            uint256 incomeTaxesCollectedOverTime,
            uint256 expensesOverTime,
            uint256 billsPaid,
            uint256 purchasesOverTime,
            uint256 balance
        );

    function getCountryStruct6(uint256 countryId)
        external
        view
        returns (
            uint256 corvetteCount,
            uint256 landingShipCount,
            uint256 battleshipCount,
            uint256 cruiserCount,
            uint256 frigateCount,
            uint256 destroyerCount,
            uint256 submarintCount,
            uint256 aircraftCarrierCount
        );

    function getCountryStruct7(uint256 countryId)
        external
        view
        returns (
            uint256 yak9Count,
            uint256 p51MustangCount,
            uint256 f86SabreCount,
            uint256 mig15Count,
            uint256 f100SuperSabreCount,
            uint256 f35LightningCount,
            uint256 f15EagleCount,
            uint256 su30MkiCount,
            uint256 f22RaptorCount
        );

    function getCountryStruct8(uint256 countryId)
        external
        view
        returns (
            uint256 ah1CobraCount,
            uint256 ah64ApacheCount,
            uint256 bristolBlenheimCount,
            uint256 b52MitchellCount,
            uint256 b17gFlyingFortressCount,
            uint256 b52StratofortressCount,
            uint256 b2SpiritCount,
            uint256 b1bLancerCount,
            uint256 tupolevTu160Count
        );
}
