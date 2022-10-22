//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./NationStrength.sol";
import "./Military.sol";
import "./Wonders.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WarContract is Ownable {
    uint256 public warId;
    address public countryMinter;
    address public nationStrength;
    address public military;
    address public navyBattleAddress;
    address public airBattleAddress;
    address public groundBattle;
    address public cruiseMissile;
    address public forces;
    address public wonders1;
    address public keeper;
    uint256[] public activeWars;

    NationStrengthContract nsc;
    MilitaryContract mil;
    WondersContract1 won1;

    struct War {
        uint256 warId;
        uint256 offenseId;
        uint256 defenseId;
        bool active;
        uint256 daysLeft;
        bool peaceDeclared;
        bool offensePeaceOffered;
        bool defensePeaceOffered;
        uint256 offenseBlockades;
        uint256 defenseBlockades;
        uint256 offenseCruiseMissileLaunchesToday;
        uint256 defenseCruiseMissileLaunchesToday;
    }

    struct OffenseDeployed1 {
        uint256 soldiersDeployed;
        uint256 tanksDeployed;
        uint256 yak9Deployed;
        uint256 p51MustangDeployed;
        uint256 f86SabreDeployed;
        uint256 mig15Deployed;
        uint256 f100SuperSabreDeployed;
        uint256 f35LightningDeployed;
        uint256 f15EagleDeployed;
        uint256 su30MkiDeployed;
        uint256 f22RaptorDeployed;
    }

    struct OffenseDeployed2 {
        uint256 ah1CobraDeployed;
        uint256 ah64ApacheDeployed;
        uint256 bristolBlenheimDeployed;
        uint256 b52MitchellDeployed;
        uint256 b17gFlyingFortressDeployed;
        uint256 b52StratofortressDeployed;
        uint256 b2SpiritDeployed;
        uint256 b1bLancerDeployed;
        uint256 tupolevTu160Deployed;
    }

    struct DefenseDeployed1 {
        uint256 soldiersDeployed;
        uint256 tanksDeployed;
        uint256 yak9Deployed;
        uint256 p51MustangDeployed;
        uint256 f86SabreDeployed;
        uint256 mig15Deployed;
        uint256 f100SuperSabreDeployed;
        uint256 f35LightningDeployed;
        uint256 f15EagleDeployed;
        uint256 su30MkiDeployed;
        uint256 f22RaptorDeployed;
    }

    struct DefenseDeployed2 {
        uint256 ah1CobraDeployed;
        uint256 ah64ApacheDeployed;
        uint256 bristolBlenheimDeployed;
        uint256 b52MitchellDeployed;
        uint256 b17gFlyingFortressDeployed;
        uint256 b52StratofortressDeployed;
        uint256 b2SpiritDeployed;
        uint256 b1bLancerDeployed;
        uint256 tupolevTu160Deployed;
    }

    struct OffenseLosses {
        uint256 warId;
        uint256 nationId;
        uint256 soldiersLost;
        uint256 tanksLost;
        uint256 cruiseMissilesLost;
        uint256 aircraftLost;
        uint256 navyStrengthLost;
        uint256 infrastructureLost;
        uint256 technologyLost;
        uint256 landLost;
    }

    struct DefenseLosses {
        uint256 warId;
        uint256 nationId;
        uint256 soldiersLost;
        uint256 tanksLost;
        uint256 cruiseMissilesLost;
        uint256 aircraftLost;
        uint256 navyStrengthLost;
        uint256 infrastructureLost;
        uint256 technologyLost;
        uint256 landLost;
    }

    mapping(uint256 => address) public idToOwnerWar;
    mapping(uint256 => War) public warIdToWar;
    mapping(uint256 => OffenseDeployed1) public warIdToOffenseDeployed1;
    mapping(uint256 => OffenseDeployed2) public warIdToOffenseDeployed2;
    mapping(uint256 => DefenseDeployed1) public warIdToDefenseDeployed1;
    mapping(uint256 => DefenseDeployed2) public warIdToDefenseDeployed2;
    mapping(uint256 => OffenseLosses) public warIdToOffenseLosses;
    mapping(uint256 => DefenseLosses) public warIdToDefenseLosses;
    mapping(uint256 => uint256[]) public idToActiveWars;
    mapping(uint256 => uint256[]) public idToOffensiveWars;

    constructor(
        address _countryMinter,
        address _nationStrength,
        address _military,
        address _navyBattleAddress,
        address _airBattleAddress,
        address _groundBattle,
        address _cruiseMissile,
        address _forces,
        address _wonders1,
        address _keeper
    ) {
        countryMinter = _countryMinter;
        nationStrength = _nationStrength;
        navyBattleAddress = _navyBattleAddress;
        airBattleAddress = _airBattleAddress;
        groundBattle = _groundBattle;
        nsc = NationStrengthContract(_nationStrength);
        military = _military;
        mil = MilitaryContract(_military);
        cruiseMissile = _cruiseMissile;
        forces = _forces;
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        keeper = _keeper;
    }

    function updateCountryMinterContract(address newAddress) public onlyOwner {
        countryMinter = newAddress;
    }

    function updateNationStrengthContract(address newAddress) public onlyOwner {
        nationStrength = newAddress;
        nsc = NationStrengthContract(newAddress);
    }

    function updateMilitaryContract(address newAddress) public onlyOwner {
        military = newAddress;
        mil = MilitaryContract(newAddress);
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "caller not Country Minter contract"
        );
        _;
    }

    modifier onlyCruiseMissileContract() {
        require(
            msg.sender == cruiseMissile,
            "only callable from cruise missile contract"
        );
        _;
    }

    function initiateNationForWar(uint256 id, address nationOwner)
        public
        onlyCountryMinter
    {
        idToOwnerWar[id] = nationOwner;
    }

    function declareWar(uint256 offenseId, uint256 defenseId) public {
        require(idToOwnerWar[offenseId] == msg.sender, "!nation ruler");
        bool isWarOkOffense = mil.getWarPeacePreference(offenseId);
        require(isWarOkOffense == true, "you are in peace mode");
        bool isWarOkDefense = mil.getWarPeacePreference(offenseId);
        require(isWarOkDefense == true, "nation in peace mode");
        bool isStrengthWithinRange = checkStrength(offenseId, defenseId);
        require(
            isStrengthWithinRange == true,
            "nation strength is not within range"
        );
        War memory newWar = War(
            warId,
            offenseId,
            defenseId,
            true,
            7,
            false,
            false,
            false,
            0,
            0,
            0,
            0
        );
        warIdToWar[warId] = newWar;
        OffenseLosses memory newOffenseLosses = OffenseLosses(
            warId,
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
        warIdToOffenseLosses[warId] = newOffenseLosses;
        DefenseLosses memory newDefenseLosses = DefenseLosses(
            warId,
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
        warIdToDefenseLosses[warId] = newDefenseLosses;
        uint256[] storage offensiveWars = idToOffensiveWars[offenseId];
        uint256 maxOffensiveWars = 4;
        bool foreignArmyBase = won1.getForeignArmyBase(offenseId);
        if(foreignArmyBase) {
            maxOffensiveWars = 5;
        }
        require (offensiveWars.length <= maxOffensiveWars, "you do not have a war slot available");
        uint256[] storage offenseActiveWars = idToActiveWars[offenseId];
        offenseActiveWars.push(warId);
        uint256[] storage defenseActiveWars = idToActiveWars[defenseId];
        defenseActiveWars.push(warId);
        initializeDeployments(warId);
        activeWars[warId] = warId;
        warId++;
    }

    function initializeDeployments(uint256 _warId) internal {
        OffenseDeployed1 memory newOffenseDeployed1 = OffenseDeployed1(
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
        warIdToOffenseDeployed1[_warId] = newOffenseDeployed1;
        OffenseDeployed2 memory newOffenseDeployed2 = OffenseDeployed2(
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
        warIdToOffenseDeployed2[_warId] = newOffenseDeployed2;
        DefenseDeployed1 memory newDefenseDeployed1 = DefenseDeployed1(
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
        warIdToDefenseDeployed1[_warId] = newDefenseDeployed1;
        DefenseDeployed2 memory newDefenseDeployed2 = DefenseDeployed2(
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
        warIdToDefenseDeployed2[_warId] = newDefenseDeployed2;
    }

    function checkStrength(uint256 offenseId, uint256 defenseId)
        public
        view
        returns (bool)
    {
        uint256 offenseStrength = nsc.getNationStrength(offenseId);
        uint256 defenseStrength = nsc.getNationStrength(defenseId);
        uint256 strengthRatio = ((offenseStrength * 100) / defenseStrength);
        if (strengthRatio < 75) {
            return false;
        } else if (strengthRatio > 133) {
            return false;
        } else {
            return true;
        }
    }

    function offerPeace(uint256 offerId, uint256 _warId) public {
        require(idToOwnerWar[offerId] == msg.sender, "!nation owner");
        uint256 offenseNation = warIdToWar[_warId].offenseId;
        uint256 defenseNation = warIdToWar[_warId].defenseId;
        require(
            offerId == offenseNation || offerId == defenseNation,
            "nation not involved in this war"
        );
        if (offerId == offenseNation) {
            warIdToWar[_warId].offensePeaceOffered = true;
        }
        if (offerId == defenseNation) {
            warIdToWar[_warId].defensePeaceOffered = true;
        }
        bool offensePeaceOffered = warIdToWar[_warId].offensePeaceOffered;
        bool defensePeaceOffered = warIdToWar[_warId].defensePeaceOffered;
        if (offensePeaceOffered == true && defensePeaceOffered == true) {
            warIdToWar[_warId].peaceDeclared = true;
            warIdToWar[_warId].active = false;
            removeActiveWar(_warId);
        }
    }

    function removeActiveWar(
        uint256 _warId
    ) internal {
        (uint256 offenseId, uint256 defenseId) = getInvolvedParties(_warId);
        uint256[] storage offenseActiveWars = idToActiveWars[offenseId];
        for (uint256 i = 0; i < offenseActiveWars.length; i++) {
            if (offenseActiveWars[i] == _warId) {
                offenseActiveWars[i] = offenseActiveWars[
                    offenseActiveWars.length - 1
                ];
                offenseActiveWars.pop();
                idToActiveWars[offenseId] = offenseActiveWars;
            }
        }
        uint256[] storage offensiveWars = idToOffensiveWars[offenseId];
        for (uint256 i = 0; i < offensiveWars.length; i++) {
            if (offensiveWars[i] == _warId) {
                offensiveWars[i] = offensiveWars[
                    offenseActiveWars.length - 1
                ];
                offensiveWars.pop();
                idToOffensiveWars[offenseId] = offenseActiveWars;
            }
        }
        uint256[] storage defenseActiveWars = idToActiveWars[defenseId];
        for (uint256 i = 0; i < defenseActiveWars.length; i++) {
            if (defenseActiveWars[i] == _warId) {
                defenseActiveWars[i] = defenseActiveWars[
                    defenseActiveWars.length - 1
                ];
                defenseActiveWars.pop();
                idToActiveWars[defenseId] = defenseActiveWars;
            }
        }
        delete activeWars[_warId];
    }

    modifier onlyKeeper() {
        require(msg.sender == keeper, "function only callable from keeper file");
        _;
    }

    function decrementWarDaysLeft() public onlyKeeper {
        for(uint256 i = 0; i < activeWars.length; i++) {
            uint256 war = activeWars[i];
            warIdToWar[war].daysLeft -= 1;
            if (warIdToWar[war].daysLeft == 0) {
                removeActiveWar(war);
            }
        }
    }

    function resetCruiseMissileLaunches() public onlyKeeper {
        for (uint256 i = 0; i < activeWars.length; i++) {
            uint256 war = activeWars[i];
            warIdToWar[war].offenseCruiseMissileLaunchesToday = 0;
            warIdToWar[war].defenseCruiseMissileLaunchesToday = 0;
        }
    }

    modifier onlyNavyBattle() {
        require(
            msg.sender == navyBattleAddress,
            "function only callable from navy battle contract"
        );
        _;
    }

    function addNavyCasualties(
        uint256 _warId,
        uint256 nationId,
        uint256 navyCasualties
    ) public onlyNavyBattle {
        (uint256 offenseId, uint256 defenseId) = getInvolvedParties(_warId);
        if (offenseId == nationId) {
            warIdToOffenseLosses[_warId].navyStrengthLost = navyCasualties;
        }
        if (defenseId == nationId) {
            warIdToDefenseLosses[_warId].navyStrengthLost = navyCasualties;
        }
    }

    function incrementCruiseMissileAttack(uint256 _warId, uint256 nationId)
        public
        onlyCruiseMissileContract
    {
        (uint256 offenseId, uint256 defenseId) = getInvolvedParties(warId);
        if (nationId == offenseId) {
            uint256 launchesToday = warIdToWar[_warId]
                .offenseCruiseMissileLaunchesToday;
            require(launchesToday < 2, "too many launches today");
            warIdToWar[warId].offenseCruiseMissileLaunchesToday += 1;
        }
        if (nationId == defenseId) {
            uint256 launchesToday = warIdToWar[_warId]
                .defenseCruiseMissileLaunchesToday;
            require(launchesToday < 2, "too many launches today");
            warIdToWar[warId].defenseCruiseMissileLaunchesToday += 1;
        }
    }

    function isWarActive(uint256 _warId) public view returns (bool) {
        bool isActive = warIdToWar[_warId].active;
        return isActive;
    }

    function getInvolvedParties(uint256 _warId)
        public
        view
        returns (uint256, uint256)
    {
        uint256 offenseId = warIdToWar[_warId].offenseId;
        uint256 defenseId = warIdToWar[_warId].defenseId;
        return (offenseId, defenseId);
    }

    function isPeaceOffered(uint256 _warId) public view returns (bool) {
        bool peaceOffered = false;
        if (
            warIdToWar[_warId].offensePeaceOffered == true ||
            warIdToWar[_warId].defensePeaceOffered == true
        ) {
            peaceOffered = true;
        }
        return peaceOffered;
    }

    function getDaysLeft(uint256 _warId) public view returns (uint256) {
        uint256 daysLeft = warIdToWar[_warId].daysLeft;
        return daysLeft;
    }

    function getDeployedFightersLowStrength(uint256 _warId, uint256 countryId)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        uint256 yak9Count;
        uint256 p51MustangCount;
        uint256 f86SabreCount;
        uint256 mig15Count;
        uint256 f100SuperSabreCount;
        if (warIdToWar[_warId].offenseId == countryId) {
            yak9Count = warIdToOffenseDeployed1[_warId].yak9Deployed;
            p51MustangCount = warIdToOffenseDeployed1[_warId]
                .p51MustangDeployed;
            f86SabreCount = warIdToOffenseDeployed1[_warId].f86SabreDeployed;
            mig15Count = warIdToOffenseDeployed1[_warId].mig15Deployed;
            f100SuperSabreCount = warIdToOffenseDeployed1[_warId]
                .f100SuperSabreDeployed;
        }
        if (warIdToWar[_warId].defenseId == countryId) {
            yak9Count = warIdToDefenseDeployed1[_warId].yak9Deployed;
            p51MustangCount = warIdToDefenseDeployed1[_warId]
                .p51MustangDeployed;
            f86SabreCount = warIdToDefenseDeployed1[_warId].f86SabreDeployed;
            mig15Count = warIdToDefenseDeployed1[_warId].mig15Deployed;
            f100SuperSabreCount = warIdToDefenseDeployed1[_warId]
                .f100SuperSabreDeployed;
        }
        return (
            yak9Count,
            p51MustangCount,
            f86SabreCount,
            mig15Count,
            f100SuperSabreCount
        );
    }

    function getDeployedFightersHighStrength(uint256 _warId, uint256 countryId)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        uint256 f35LightningCount;
        uint256 f15EagleCount;
        uint256 su30MkiCount;
        uint256 f22RaptorCount;
        if (warIdToWar[_warId].offenseId == countryId) {
            f35LightningCount = warIdToOffenseDeployed1[_warId]
                .f35LightningDeployed;
            f15EagleCount = warIdToOffenseDeployed1[_warId].f15EagleDeployed;
            su30MkiCount = warIdToOffenseDeployed1[_warId].su30MkiDeployed;
            f22RaptorCount = warIdToOffenseDeployed1[_warId].f22RaptorDeployed;
        }
        if (warIdToWar[_warId].defenseId == countryId) {
            f35LightningCount = warIdToDefenseDeployed1[_warId]
                .f35LightningDeployed;
            f15EagleCount = warIdToDefenseDeployed1[_warId].f15EagleDeployed;
            su30MkiCount = warIdToDefenseDeployed1[_warId].su30MkiDeployed;
            f22RaptorCount = warIdToDefenseDeployed1[_warId].f22RaptorDeployed;
        }
        return (f35LightningCount, f15EagleCount, su30MkiCount, f22RaptorCount);
    }

    function getDeployedBombersLowStrength(uint256 _warId, uint256 countryId)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        uint256 ah1CobraDeployed;
        uint256 ah64ApacheDeployed;
        uint256 bristolBlenheimDeployed;
        uint256 b52MitchellDeployed;
        uint256 b17gFlyingFortressDeployed;
        if (warIdToWar[_warId].offenseId == countryId) {
            ah1CobraDeployed = warIdToOffenseDeployed2[_warId].ah1CobraDeployed;
            ah64ApacheDeployed = warIdToOffenseDeployed2[_warId]
                .ah64ApacheDeployed;
            bristolBlenheimDeployed = warIdToOffenseDeployed2[_warId]
                .bristolBlenheimDeployed;
            b52MitchellDeployed = warIdToOffenseDeployed2[_warId]
                .b52MitchellDeployed;
            b17gFlyingFortressDeployed = warIdToOffenseDeployed2[_warId]
                .b17gFlyingFortressDeployed;
        }
        if (warIdToWar[_warId].defenseId == countryId) {
            ah1CobraDeployed = warIdToDefenseDeployed2[_warId].ah1CobraDeployed;
            ah64ApacheDeployed = warIdToDefenseDeployed2[_warId]
                .ah64ApacheDeployed;
            bristolBlenheimDeployed = warIdToDefenseDeployed2[_warId]
                .bristolBlenheimDeployed;
            b52MitchellDeployed = warIdToDefenseDeployed2[_warId]
                .b52MitchellDeployed;
            b17gFlyingFortressDeployed = warIdToDefenseDeployed2[_warId]
                .b17gFlyingFortressDeployed;
        }
        return (
            ah1CobraDeployed,
            ah64ApacheDeployed,
            bristolBlenheimDeployed,
            b52MitchellDeployed,
            b17gFlyingFortressDeployed
        );
    }

    function getDeployedBombersHighStrength(uint256 _warId, uint256 countryId)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        uint256 b52StratofortressDeployed;
        uint256 b2SpiritDeployed;
        uint256 b1bLancerDeployed;
        uint256 tupolevTu160Deployed;
        if (warIdToWar[_warId].offenseId == countryId) {
            b52StratofortressDeployed = warIdToOffenseDeployed2[_warId]
                .b52StratofortressDeployed;
            b2SpiritDeployed = warIdToOffenseDeployed2[_warId].b2SpiritDeployed;
            b1bLancerDeployed = warIdToOffenseDeployed2[_warId]
                .b1bLancerDeployed;
            tupolevTu160Deployed = warIdToOffenseDeployed2[_warId]
                .tupolevTu160Deployed;
        }
        if (warIdToWar[_warId].defenseId == countryId) {
            b52StratofortressDeployed = warIdToOffenseDeployed2[_warId]
                .b52StratofortressDeployed;
            b2SpiritDeployed = warIdToOffenseDeployed2[_warId].b2SpiritDeployed;
            b1bLancerDeployed = warIdToOffenseDeployed2[_warId]
                .b1bLancerDeployed;
            tupolevTu160Deployed = warIdToOffenseDeployed2[_warId]
                .tupolevTu160Deployed;
        }
        return (
            b52StratofortressDeployed,
            b2SpiritDeployed,
            b1bLancerDeployed,
            tupolevTu160Deployed
        );
    }

    modifier onlyAirBattle() {
        require(
            msg.sender == airBattleAddress,
            "function only callable from air battle"
        );
        _;
    }

    function resetDeployedBombers(uint256 _warId, uint256 countryId)
        public
        onlyAirBattle
    {
        if (warIdToWar[_warId].offenseId == countryId) {
            warIdToOffenseDeployed2[_warId].ah1CobraDeployed = 0;
            warIdToOffenseDeployed2[_warId].ah64ApacheDeployed = 0;
            warIdToOffenseDeployed2[_warId].bristolBlenheimDeployed = 0;
            warIdToOffenseDeployed2[_warId].b52MitchellDeployed = 0;
            warIdToOffenseDeployed2[_warId].b17gFlyingFortressDeployed = 0;
            warIdToOffenseDeployed2[_warId].b52StratofortressDeployed = 0;
            warIdToOffenseDeployed2[_warId].b2SpiritDeployed = 0;
            warIdToOffenseDeployed2[_warId].b1bLancerDeployed = 0;
            warIdToOffenseDeployed2[_warId].tupolevTu160Deployed = 0;
        }
        if (warIdToWar[_warId].defenseId == countryId) {
            warIdToDefenseDeployed2[_warId].ah1CobraDeployed = 0;
            warIdToDefenseDeployed2[_warId].ah64ApacheDeployed = 0;
            warIdToDefenseDeployed2[_warId].bristolBlenheimDeployed = 0;
            warIdToDefenseDeployed2[_warId].b52MitchellDeployed = 0;
            warIdToDefenseDeployed2[_warId].b17gFlyingFortressDeployed = 0;
            warIdToDefenseDeployed2[_warId].b52StratofortressDeployed = 0;
            warIdToDefenseDeployed2[_warId].b2SpiritDeployed = 0;
            warIdToDefenseDeployed2[_warId].b1bLancerDeployed = 0;
            warIdToDefenseDeployed2[_warId].tupolevTu160Deployed = 0;
        }
    }

    function decrementLosses(
        uint256 _warId,
        uint256[] memory defenderLosses,
        uint256 defenderId,
        uint256[] memory attackerLosses,
        uint256 attackerId
    ) public onlyAirBattle {
        (uint256 offenseWarId, uint256 defenseWarId) = getInvolvedParties(
            _warId
        );
        if (offenseWarId == attackerId) {
            for (uint256 i; i < attackerLosses.length; i++) {
                if (attackerLosses[i] == 1) {
                    warIdToOffenseDeployed1[_warId].yak9Deployed -= 1;
                } else if (attackerLosses[i] == 2) {
                    warIdToOffenseDeployed1[_warId].p51MustangDeployed -= 1;
                } else if (attackerLosses[i] == 3) {
                    warIdToOffenseDeployed1[_warId].f86SabreDeployed -= 1;
                } else if (attackerLosses[i] == 4) {
                    warIdToOffenseDeployed1[_warId].mig15Deployed -= 1;
                } else if (attackerLosses[i] == 5) {
                    warIdToOffenseDeployed1[_warId].f100SuperSabreDeployed -= 1;
                } else if (attackerLosses[i] == 6) {
                    warIdToOffenseDeployed1[_warId].f35LightningDeployed -= 1;
                } else if (attackerLosses[i] == 7) {
                    warIdToOffenseDeployed1[_warId].f15EagleDeployed -= 1;
                } else if (attackerLosses[i] == 8) {
                    warIdToOffenseDeployed1[_warId].su30MkiDeployed -= 1;
                } else if (attackerLosses[i] == 9) {
                    warIdToOffenseDeployed1[_warId].f22RaptorDeployed -= 1;
                }
            }
        }
        if (offenseWarId == defenderId) {
            for (uint256 i; i < defenderLosses.length; i++) {
                if (defenderLosses[i] == 1) {
                    warIdToOffenseDeployed1[_warId].yak9Deployed -= 1;
                } else if (defenderLosses[i] == 2) {
                    warIdToOffenseDeployed1[_warId].p51MustangDeployed -= 1;
                } else if (defenderLosses[i] == 3) {
                    warIdToOffenseDeployed1[_warId].f86SabreDeployed -= 1;
                } else if (defenderLosses[i] == 4) {
                    warIdToOffenseDeployed1[_warId].mig15Deployed -= 1;
                } else if (defenderLosses[i] == 5) {
                    warIdToOffenseDeployed1[_warId].f100SuperSabreDeployed -= 1;
                } else if (defenderLosses[i] == 6) {
                    warIdToOffenseDeployed1[_warId].f35LightningDeployed -= 1;
                } else if (defenderLosses[i] == 7) {
                    warIdToOffenseDeployed1[_warId].f15EagleDeployed -= 1;
                } else if (defenderLosses[i] == 8) {
                    warIdToOffenseDeployed1[_warId].su30MkiDeployed -= 1;
                } else if (defenderLosses[i] == 9) {
                    warIdToOffenseDeployed1[_warId].f22RaptorDeployed -= 1;
                }
            }
        }
        if (defenseWarId == attackerId) {
            for (uint256 i; i < attackerLosses.length; i++) {
                if (attackerLosses[i] == 1) {
                    warIdToDefenseDeployed1[_warId].yak9Deployed -= 1;
                } else if (attackerLosses[i] == 2) {
                    warIdToDefenseDeployed1[_warId].p51MustangDeployed -= 1;
                } else if (attackerLosses[i] == 3) {
                    warIdToDefenseDeployed1[_warId].f86SabreDeployed -= 1;
                } else if (attackerLosses[i] == 4) {
                    warIdToDefenseDeployed1[_warId].mig15Deployed -= 1;
                } else if (attackerLosses[i] == 5) {
                    warIdToDefenseDeployed1[_warId].f100SuperSabreDeployed -= 1;
                } else if (attackerLosses[i] == 6) {
                    warIdToDefenseDeployed1[_warId].f35LightningDeployed -= 1;
                } else if (attackerLosses[i] == 7) {
                    warIdToDefenseDeployed1[_warId].f15EagleDeployed -= 1;
                } else if (attackerLosses[i] == 8) {
                    warIdToDefenseDeployed1[_warId].su30MkiDeployed -= 1;
                } else if (attackerLosses[i] == 9) {
                    warIdToDefenseDeployed1[_warId].f22RaptorDeployed -= 1;
                }
            }
        }
        if (defenseWarId == defenderId) {
            for (uint256 i; i < defenderLosses.length; i++) {
                if (defenderLosses[i] == 1) {
                    warIdToDefenseDeployed1[_warId].yak9Deployed -= 1;
                } else if (defenderLosses[i] == 2) {
                    warIdToDefenseDeployed1[_warId].p51MustangDeployed -= 1;
                } else if (defenderLosses[i] == 3) {
                    warIdToDefenseDeployed1[_warId].f86SabreDeployed -= 1;
                } else if (defenderLosses[i] == 4) {
                    warIdToDefenseDeployed1[_warId].mig15Deployed -= 1;
                } else if (defenderLosses[i] == 5) {
                    warIdToDefenseDeployed1[_warId].f100SuperSabreDeployed -= 1;
                } else if (defenderLosses[i] == 6) {
                    warIdToDefenseDeployed1[_warId].f35LightningDeployed -= 1;
                } else if (defenderLosses[i] == 7) {
                    warIdToDefenseDeployed1[_warId].f15EagleDeployed -= 1;
                } else if (defenderLosses[i] == 8) {
                    warIdToDefenseDeployed1[_warId].su30MkiDeployed -= 1;
                } else if (defenderLosses[i] == 9) {
                    warIdToDefenseDeployed1[_warId].f22RaptorDeployed -= 1;
                }
            }
        }
    }

    function addAirBattleCasualties(
        uint256 _warId,
        uint256 nationId,
        uint256 battleCausalties
    ) public onlyAirBattle {
        (uint256 offenseId, uint256 defenseId) = getInvolvedParties(_warId);
        if (offenseId == nationId) {
            warIdToOffenseLosses[_warId].aircraftLost = battleCausalties;
        }
        if (defenseId == nationId) {
            warIdToDefenseLosses[_warId].aircraftLost = battleCausalties;
        }
    }

    modifier onlyForcesContract() {
        require(msg.sender == forces, "only callable from forces");
        _;
    }

    function deploySoldiers(
        uint256 nationId,
        uint256 _warId,
        uint256 amountToDeploy
    ) public onlyForcesContract {
        bool isActive = isWarActive(_warId);
        require(isActive, "war not active");
        (uint256 offenseId, uint256 defenseId) = getInvolvedParties(_warId);
        require(
            nationId == offenseId || nationId == defenseId,
            "nation not involved"
        );
        if (nationId == offenseId) {
            warIdToOffenseDeployed1[warId].soldiersDeployed += amountToDeploy;
        } else if (nationId == defenseId) {
            warIdToDefenseDeployed1[warId].soldiersDeployed += amountToDeploy;
        }
    }

    function getDeployedGroundForces(uint256 _warId, uint256 attackerId)
        public
        view
        returns (uint256, uint256)
    {
        uint256 soldiersDeployed;
        uint256 tanksDeployed;
        (uint256 offenseId, uint256 defenseId) = getInvolvedParties(_warId);
        if (attackerId == offenseId) {
            soldiersDeployed = warIdToOffenseDeployed1[_warId].soldiersDeployed;
            tanksDeployed = warIdToOffenseDeployed1[_warId].tanksDeployed;
        }
        if (attackerId == defenseId) {
            soldiersDeployed = warIdToDefenseDeployed1[_warId].soldiersDeployed;
            tanksDeployed = warIdToDefenseDeployed1[_warId].tanksDeployed;
        }
        return (soldiersDeployed, tanksDeployed);
    }

    modifier onlyGroundBattle() {
        require(
            msg.sender == groundBattle,
            "function only callable from navy battle contract"
        );
        _;
    }

    function decreaseGroundBattleLosses(
        uint256 soldierLosses,
        uint256 tankLosses,
        uint256 attackerId,
        uint256 _warId
    ) public onlyGroundBattle {
        (uint256 offenseId, uint256 defenseId) = getInvolvedParties(_warId);
        if (offenseId == attackerId) {
            warIdToOffenseDeployed1[_warId].soldiersDeployed -= soldierLosses;
            warIdToOffenseDeployed1[_warId].tanksDeployed -= tankLosses;
        } else if (defenseId == attackerId) {
            warIdToDefenseDeployed1[_warId].soldiersDeployed -= soldierLosses;
            warIdToDefenseDeployed1[_warId].tanksDeployed -= tankLosses;
        }
    }
}
