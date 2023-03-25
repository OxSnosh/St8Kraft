//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "./NationStrength.sol";
import "./Military.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// import "hardhat/console.sol";

///@title WarContract
///@author OxSnosh
///@notice this contact will allow a naion owner to declare war on another nation
///@dev this contract inherits from openzeppelin's ownable contract
contract WarContract is Ownable {
    uint256 public warId;
    address public countryMinter;
    address public nationStrength;
    address public military;
    address public breakBlockadeAddress;
    address public navalAttackAddress;
    address public airBattleAddress;
    address public groundBattle;
    address public cruiseMissile;
    address public forces;
    address public wonders1;
    address public keeper;
    address public treasury;
    uint256[] public activeWars;

    NationStrengthContract nsc;
    MilitaryContract mil;
    WondersContract1 won1;
    CountryMinter mint;
    TreasuryContract tres;

    struct War {
        uint256 offenseId;
        uint256 defenseId;
        bool active;
        uint256 daysLeft;
        bool peaceDeclared;
        bool expired;
        bool offensePeaceOffered;
        bool defensePeaceOffered;
        uint256 offenseBlockades;
        uint256 defenseBlockades;
        uint256 offenseCruiseMissileLaunchesToday;
        uint256 defenseCruiseMissileLaunchesToday;
    }

    struct OffenseDeployed1 {
        bool offenseDeployedToday;
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
        bool defenseDeployedToday;
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

    mapping(uint256 => War) public warIdToWar;
    mapping(uint256 => OffenseDeployed1) public warIdToOffenseDeployed1;
    mapping(uint256 => OffenseDeployed2) public warIdToOffenseDeployed2;
    mapping(uint256 => DefenseDeployed1) public warIdToDefenseDeployed1;
    mapping(uint256 => DefenseDeployed2) public warIdToDefenseDeployed2;
    mapping(uint256 => OffenseLosses) public warIdToOffenseLosses;
    mapping(uint256 => DefenseLosses) public warIdToDefenseLosses;
    mapping(uint256 => uint256[]) public idToActiveWars;
    mapping(uint256 => uint256[]) public idToOffensiveWars;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _countryMinter,
        address _nationStrength,
        address _military,
        address _breakBlockadeAddress,
        address _navalAttackAddress,
        address _airBattleAddress,
        address _groundBattle,
        address _cruiseMissile,
        address _forces,
        address _wonders1,
        address _keeper
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        nationStrength = _nationStrength;
        breakBlockadeAddress = _breakBlockadeAddress;
        navalAttackAddress = _navalAttackAddress;
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

    function settings2(address _treasury) public onlyOwner {
        treasury = _treasury;
        tres = TreasuryContract(_treasury);
    }

    ///@dev this function is only callable by the contract owner
    function updateCountryMinterContract(address newAddress) public onlyOwner {
        countryMinter = newAddress;
    }

    ///@dev this function is only callable by the contract owner
    function updateNationStrengthContract(address newAddress) public onlyOwner {
        nationStrength = newAddress;
        nsc = NationStrengthContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
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

    ///@dev this function is only callable from a nation owner and allow a natio nto eclare war on another nation
    ///@notice this function allows a nation to declare war on another nation
    ///@notice when war is declared the nations can attack each other
    ///@param offenseId is the nation id of the nation declaring war
    ///@param defenseId is the nation id of the nation having war declared on it
    ///@notice a nation can only have a maximum of 4 offensive wars (5 with a foreign army base)
    function declareWar(uint256 offenseId, uint256 defenseId) public {
        bool isOwner = mint.checkOwnership(offenseId, msg.sender);
        require(isOwner, "!nation owner");
        bool check = warCheck(offenseId, defenseId);
        require(check, "didn't make it here");
        War memory newWar = War(
            offenseId,
            defenseId,
            true,
            7,
            false,
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
        if (foreignArmyBase) {
            maxOffensiveWars = 5;
        }
        offensiveWars.push(warId);
        require(
            offensiveWars.length <= maxOffensiveWars,
            "you do not have an offensive war slot available"
        );
        uint256[] storage offenseActiveWars = idToActiveWars[offenseId];
        offenseActiveWars.push(warId);
        uint256[] storage defenseActiveWars = idToActiveWars[defenseId];
        defenseActiveWars.push(warId);
        initializeDeployments(warId);
        warId++;
    }

    function warCheck(
        uint256 offenseId,
        uint256 defenseId
    ) internal view returns (bool) {
        bool warCheckReturn = false;
        bool isWarOkOffense = mil.getWarPeacePreference(offenseId);
        require(isWarOkOffense == true, "you are in peace mode");
        bool isWarOkDefense = mil.getWarPeacePreference(defenseId);
        require(isWarOkDefense == true, "nation in peace mode");
        bool isStrengthWithinRange = checkStrength(offenseId, defenseId);
        require(
            isStrengthWithinRange == true,
            "nation strength is not within range to declare war"
        );
        bool defenderInactive = tres.checkInactive(defenseId);
        require(!defenderInactive, "defender inactive");
        bool offenseInactive = tres.checkInactive(offenseId);
        require(!offenseInactive, "nation inactive");
        warCheckReturn = true;
        return warCheckReturn;
    }

    function offensiveWarLengthForTesting(
        uint256 offenseId
    ) public view returns (uint256) {
        uint256[] memory offensiveWars = idToOffensiveWars[offenseId];
        return offensiveWars.length;
    }

    function offensiveWarReturnForTesting(
        uint256 offenseId
    ) public view returns (uint256[] memory) {
        uint256[] memory offensiveWars = idToOffensiveWars[offenseId];
        return offensiveWars;
    }

    function nationActiveWarsReturnForTesting(
        uint256 offenseId
    ) public view returns (uint256[] memory) {
        uint256[] memory activeWarsArray = idToActiveWars[offenseId];
        return activeWarsArray;
    }

    function gameActiveWars() public view returns (uint256[] memory) {
        return activeWars;
    }

    ///@dev this is an internal function that will be balled by the declare war function and set up several structs that will keep track of each war
    function initializeDeployments(uint256 _warId) internal {
        OffenseDeployed1 memory newOffenseDeployed1 = OffenseDeployed1(
            false,
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
            false,
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
        activeWars.push(_warId);
    }

    ///@dev this is a public view function that will return a boolean value if the nations are able to fight eachother
    ///@notice this function will return a boolean value of true if the nations are able to fight eachother
    ///@notice in order for a war to be declared the offense strength must be within 75% and 133% of the defending nation
    ///@param offenseId is the nation id of the aggressor nation
    ///@param defenseId if the nation id of the defending nation
    ///@return bool will be true if the nations are within range where war is possible
    function checkStrength(
        uint256 offenseId,
        uint256 defenseId
    ) public view returns (bool) {
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

    ///@dev this is a public function that will allow a nation involved in a war to offer peace
    ///@notice this funtion will allow a nation involved in a war to offer peace
    ///@param offerId is the nation offering peace
    ///@param _warId is the war id for the war where peace is being offered
    ///@notice if the offense and the defense offer peace then peace will be declares
    ///@notice an attack will nullify any existing peace offers
    function offerPeace(uint256 offerId, uint256 _warId) public {
        bool isOwner = mint.checkOwnership(offerId, msg.sender);
        require(isOwner, "!nation owner");
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
        bool offensePeaceCheck = warIdToWar[_warId].offensePeaceOffered;
        bool defensePeaceCheck = warIdToWar[_warId].defensePeaceOffered;
        if (offensePeaceCheck == true && defensePeaceCheck == true) {
            warIdToWar[_warId].peaceDeclared = true;
            warIdToWar[_warId].active = false;
            removeActiveWar(_warId);
        }
    }

    ///@dev this is a public view function that will return information about a war
    ///@notice this function will return information about a war
    ///@param _warId is the war id of the war being queried
    ///@return offensePeaceOffered is a boolean value that will be true if the offense offered peace
    ///@return defensePeaceOffered is a boolean value that will be true if the defense nation offered peace
    ///@return warActive will return a boolean true if the war is still active
    ///@return peaceDeclared will return a boolean true of peace was declared by both sides
    ///@return expired will return a boolean true if the war expired (days left reached 0)
    function checkWar(
        uint256 _warId
    ) public view returns (bool, bool, bool, bool, bool) {
        bool offensePeaceOffered = warIdToWar[_warId].offensePeaceOffered;
        bool defensePeaceOffered = warIdToWar[_warId].defensePeaceOffered;
        bool warActive = warIdToWar[_warId].active;
        bool peaceDeclared = warIdToWar[_warId].peaceDeclared;
        bool expired = warIdToWar[_warId].expired;
        return (
            offensePeaceOffered,
            defensePeaceOffered,
            warActive,
            peaceDeclared,
            expired
        );
    }

    ///@dev this is an internal function that will remove the active war from each nation when peace is declared or the war expires
    function removeActiveWar(uint256 _warId) internal {
        (uint256 offenseId, uint256 defenseId) = getInvolvedParties(_warId);
        uint256[] storage offenseActiveWars = idToActiveWars[offenseId];
        for (uint256 i = 0; i < offenseActiveWars.length; i++) {
            if (offenseActiveWars[i] == _warId) {
                offenseActiveWars[i] = offenseActiveWars[
                    offenseActiveWars.length - 1
                ];
                offenseActiveWars.pop();
            }
        }
        uint256[] storage offensiveWars = idToOffensiveWars[offenseId];
        for (uint256 i = 0; i < offensiveWars.length; i++) {
            if (offensiveWars[i] == _warId) {
                offensiveWars[i] = offensiveWars[offensiveWars.length - 1];
                offensiveWars.pop();
            }
        }
        uint256[] storage defenseActiveWars = idToActiveWars[defenseId];
        for (uint256 i = 0; i < defenseActiveWars.length; i++) {
            if (defenseActiveWars[i] == _warId) {
                defenseActiveWars[i] = defenseActiveWars[
                    defenseActiveWars.length - 1
                ];
                defenseActiveWars.pop();
            }
        }
        for (uint256 i = 0; i < activeWars.length; i++) {
            if (activeWars[i] == _warId) {
                activeWars[i] = activeWars[activeWars.length - 1];
                activeWars.pop();
            }
        }
    }

    modifier onlyKeeper() {
        require(
            msg.sender == keeper,
            "function only callable from keeper file"
        );
        _;
    }

    ///@dev this function is only callable from the keeper contract
    ///@dev wars expire after 7 days and will be removed from active wars when daysLeft reaches 0
    ///@notice wars expire after 7 days and will be removed from active wars when daysLeft reaches 0
    function decrementWarDaysLeft() public onlyKeeper {
        for (uint256 i = 0; i < activeWars.length; i++) {
            uint256 war = activeWars[i];
            warIdToWar[war].daysLeft -= 1;
            if (warIdToWar[war].daysLeft == 0) {
                warIdToWar[war].expired = true;
                warIdToWar[war].active = false;
                removeActiveWar(war);
            }
        }
    }

    ///@dev this function is only callable from the keeper contract
    ///@notice this function will reset cruise missile launches daily to 0
    ///@notice a nation can only launch 2 cruise missiles per day per war
    function resetCruiseMissileLaunches() public onlyKeeper {
        for (uint256 i = 0; i < activeWars.length; i++) {
            uint256 war = activeWars[i];
            warIdToWar[war].offenseCruiseMissileLaunchesToday = 0;
            warIdToWar[war].defenseCruiseMissileLaunchesToday = 0;
        }
    }

    ///@dev this function is only callable from the keeper contract
    ///@notice this function will reset the active wars daily so that forces can be deployed again
    ///@notice a nation can only deploy forces to a war once per day
    function resetDeployedToday() public onlyKeeper {
        for (uint256 i = 0; i < activeWars.length; i++) {
            uint256 war = activeWars[i];
            warIdToOffenseDeployed1[war].offenseDeployedToday = false;
            warIdToDefenseDeployed1[war].defenseDeployedToday = false;
        }
    }

    modifier onlyNavyBattle() {
        require(
            msg.sender == breakBlockadeAddress ||
                msg.sender == navalAttackAddress,
            "function only callable from navy battle contract"
        );
        _;
    }

    ///@dev this function is only callable from the navy battle contract and will increment navy casualties
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

    ///@dev this function is only callable from the cruise missile contract and will only allow a nation to launch 2 cruise missiles per war per day
    ///@notice this function will only allow a nation to launch 2 cruise missiles per war per day
    function incrementCruiseMissileAttack(
        uint256 _warId,
        uint256 nationId
    ) public onlyCruiseMissileContract {
        (uint256 offenseId, uint256 defenseId) = getInvolvedParties(warId);
        if (nationId == offenseId) {
            uint256 launchesToday = warIdToWar[_warId]
                .offenseCruiseMissileLaunchesToday;
            require(launchesToday < 2, "too many launches today");
            warIdToWar[_warId].offenseCruiseMissileLaunchesToday += 1;
        }
        if (nationId == defenseId) {
            uint256 launchesToday = warIdToWar[_warId]
                .defenseCruiseMissileLaunchesToday;
            require(launchesToday < 2, "too many launches today");
            warIdToWar[_warId].defenseCruiseMissileLaunchesToday += 1;
        }
    }

    ///@dev this is a public view function that will take a war id as a parameter and return whether the war is active or not
    ///@notice this function will return whether a war is active or not
    ///@param _warId is the warId being queries
    ///@return bool will be true if the war is active
    function isWarActive(uint256 _warId) public view returns (bool) {
        bool isActive = warIdToWar[_warId].active;
        return isActive;
    }

    ///@dev this is a public view function that will return the two members f a given warId
    ///@param _warId is the warId of the war being queried
    ///@return offenseId is the nation id of the offensive nation in the war
    ///@return defenseId is the nation id of the defensive nation in the war
    function getInvolvedParties(
        uint256 _warId
    ) public view returns (uint256, uint256) {
        uint256 offenseId = warIdToWar[_warId].offenseId;
        uint256 defenseId = warIdToWar[_warId].defenseId;
        return (offenseId, defenseId);
    }

    ///@dev this is a public view function that will return true if one of the nations has offered peace
    ///@notice this function will return true if one of the nations has offered peace
    ///@param _warId is the war id of the war being queried
    ///@return bool will be true if one of the nation has offered peace
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

    modifier onlyBattle() {
        require(
            msg.sender == groundBattle,
            "function only callable dring an attack"
        );
        _;
    }

    function cancelPeaceOffersUponAttack(uint256 _warId) public onlyBattle {
        warIdToWar[_warId].offensePeaceOffered = false;
        warIdToWar[_warId].defensePeaceOffered = false;
    }

    ///@dev this is a publci view function that will return the number of days left in a war
    ///@dev wars expire after 7 days when days left == 0
    function getDaysLeft(uint256 _warId) public view returns (uint256) {
        uint256 daysLeft = warIdToWar[_warId].daysLeft;
        return daysLeft;
    }

    function getDeployedFightersLowStrength(
        uint256 _warId,
        uint256 countryId
    ) public view returns (uint256, uint256, uint256, uint256, uint256) {
        // uint256 yak9Count;
        // uint256 p51MustangCount;
        // uint256 f86SabreCount;
        // uint256 mig15Count;
        // uint256 f100SuperSabreCount;
        // if (warIdToWar[_warId].offenseId == countryId) {
        //     yak9Count = warIdToOffenseDeployed1[_warId].yak9Deployed;
        //     p51MustangCount = warIdToOffenseDeployed1[_warId]
        //         .p51MustangDeployed;
        //     f86SabreCount = warIdToOffenseDeployed1[_warId].f86SabreDeployed;
        //     mig15Count = warIdToOffenseDeployed1[_warId].mig15Deployed;
        //     f100SuperSabreCount = warIdToOffenseDeployed1[_warId]
        //         .f100SuperSabreDeployed;
        // }
        // if (warIdToWar[_warId].defenseId == countryId) {
        //     yak9Count = warIdToDefenseDeployed1[_warId].yak9Deployed;
        //     p51MustangCount = warIdToDefenseDeployed1[_warId]
        //         .p51MustangDeployed;
        //     f86SabreCount = warIdToDefenseDeployed1[_warId].f86SabreDeployed;
        //     mig15Count = warIdToDefenseDeployed1[_warId].mig15Deployed;
        //     f100SuperSabreCount = warIdToDefenseDeployed1[_warId]
        //         .f100SuperSabreDeployed;
        // }
        // return (
        //     yak9Count,
        //     p51MustangCount,
        //     f86SabreCount,
        //     mig15Count,
        //     f100SuperSabreCount
        // );
    }

    function getDeployedFightersHighStrength(
        uint256 _warId,
        uint256 countryId
    ) public view returns (uint256, uint256, uint256, uint256) {
        // uint256 f35LightningCount;
        // uint256 f15EagleCount;
        // uint256 su30MkiCount;
        // uint256 f22RaptorCount;
        // if (warIdToWar[_warId].offenseId == countryId) {
        //     f35LightningCount = warIdToOffenseDeployed1[_warId]
        //         .f35LightningDeployed;
        //     f15EagleCount = warIdToOffenseDeployed1[_warId].f15EagleDeployed;
        //     su30MkiCount = warIdToOffenseDeployed1[_warId].su30MkiDeployed;
        //     f22RaptorCount = warIdToOffenseDeployed1[_warId].f22RaptorDeployed;
        // }
        // if (warIdToWar[_warId].defenseId == countryId) {
        //     f35LightningCount = warIdToDefenseDeployed1[_warId]
        //         .f35LightningDeployed;
        //     f15EagleCount = warIdToDefenseDeployed1[_warId].f15EagleDeployed;
        //     su30MkiCount = warIdToDefenseDeployed1[_warId].su30MkiDeployed;
        //     f22RaptorCount = warIdToDefenseDeployed1[_warId].f22RaptorDeployed;
        // }
        // return (f35LightningCount, f15EagleCount, su30MkiCount, f22RaptorCount);
    }

    function getDeployedBombersLowStrength(
        uint256 _warId,
        uint256 countryId
    ) public view returns (uint256, uint256, uint256, uint256, uint256) {
        // uint256 ah1CobraDeployed;
        // uint256 ah64ApacheDeployed;
        // uint256 bristolBlenheimDeployed;
        // uint256 b52MitchellDeployed;
        // uint256 b17gFlyingFortressDeployed;
        // if (warIdToWar[_warId].offenseId == countryId) {
        //     ah1CobraDeployed = warIdToOffenseDeployed2[_warId].ah1CobraDeployed;
        //     ah64ApacheDeployed = warIdToOffenseDeployed2[_warId]
        //         .ah64ApacheDeployed;
        //     bristolBlenheimDeployed = warIdToOffenseDeployed2[_warId]
        //         .bristolBlenheimDeployed;
        //     b52MitchellDeployed = warIdToOffenseDeployed2[_warId]
        //         .b52MitchellDeployed;
        //     b17gFlyingFortressDeployed = warIdToOffenseDeployed2[_warId]
        //         .b17gFlyingFortressDeployed;
        // }
        // if (warIdToWar[_warId].defenseId == countryId) {
        //     ah1CobraDeployed = warIdToDefenseDeployed2[_warId].ah1CobraDeployed;
        //     ah64ApacheDeployed = warIdToDefenseDeployed2[_warId]
        //         .ah64ApacheDeployed;
        //     bristolBlenheimDeployed = warIdToDefenseDeployed2[_warId]
        //         .bristolBlenheimDeployed;
        //     b52MitchellDeployed = warIdToDefenseDeployed2[_warId]
        //         .b52MitchellDeployed;
        //     b17gFlyingFortressDeployed = warIdToDefenseDeployed2[_warId]
        //         .b17gFlyingFortressDeployed;
        // }
        // return (
        //     ah1CobraDeployed,
        //     ah64ApacheDeployed,
        //     bristolBlenheimDeployed,
        //     b52MitchellDeployed,
        //     b17gFlyingFortressDeployed
        // );
    }

    function getDeployedBombersHighStrength(
        uint256 _warId,
        uint256 countryId
    ) public view returns (uint256, uint256, uint256, uint256) {
        // uint256 b52StratofortressDeployed;
        // uint256 b2SpiritDeployed;
        // uint256 b1bLancerDeployed;
        // uint256 tupolevTu160Deployed;
        // if (warIdToWar[_warId].offenseId == countryId) {
        //     b52StratofortressDeployed = warIdToOffenseDeployed2[_warId]
        //         .b52StratofortressDeployed;
        //     b2SpiritDeployed = warIdToOffenseDeployed2[_warId].b2SpiritDeployed;
        //     b1bLancerDeployed = warIdToOffenseDeployed2[_warId]
        //         .b1bLancerDeployed;
        //     tupolevTu160Deployed = warIdToOffenseDeployed2[_warId]
        //         .tupolevTu160Deployed;
        // }
        // if (warIdToWar[_warId].defenseId == countryId) {
        //     b52StratofortressDeployed = warIdToOffenseDeployed2[_warId]
        //         .b52StratofortressDeployed;
        //     b2SpiritDeployed = warIdToOffenseDeployed2[_warId].b2SpiritDeployed;
        //     b1bLancerDeployed = warIdToOffenseDeployed2[_warId]
        //         .b1bLancerDeployed;
        //     tupolevTu160Deployed = warIdToOffenseDeployed2[_warId]
        //         .tupolevTu160Deployed;
        // }
        // return (
        //     b52StratofortressDeployed,
        //     b2SpiritDeployed,
        //     b1bLancerDeployed,
        //     tupolevTu160Deployed
        // );
    }

    modifier onlyAirBattle() {
        require(
            msg.sender == airBattleAddress,
            "function only callable from air battle"
        );
        _;
    }

    function resetDeployedBombers(
        uint256 _warId,
        uint256 countryId
    ) public onlyAirBattle {
        // if (warIdToWar[_warId].offenseId == countryId) {
        //     warIdToOffenseDeployed2[_warId].ah1CobraDeployed = 0;
        //     warIdToOffenseDeployed2[_warId].ah64ApacheDeployed = 0;
        //     warIdToOffenseDeployed2[_warId].bristolBlenheimDeployed = 0;
        //     warIdToOffenseDeployed2[_warId].b52MitchellDeployed = 0;
        //     warIdToOffenseDeployed2[_warId].b17gFlyingFortressDeployed = 0;
        //     warIdToOffenseDeployed2[_warId].b52StratofortressDeployed = 0;
        //     warIdToOffenseDeployed2[_warId].b2SpiritDeployed = 0;
        //     warIdToOffenseDeployed2[_warId].b1bLancerDeployed = 0;
        //     warIdToOffenseDeployed2[_warId].tupolevTu160Deployed = 0;
        // }
        // if (warIdToWar[_warId].defenseId == countryId) {
        //     warIdToDefenseDeployed2[_warId].ah1CobraDeployed = 0;
        //     warIdToDefenseDeployed2[_warId].ah64ApacheDeployed = 0;
        //     warIdToDefenseDeployed2[_warId].bristolBlenheimDeployed = 0;
        //     warIdToDefenseDeployed2[_warId].b52MitchellDeployed = 0;
        //     warIdToDefenseDeployed2[_warId].b17gFlyingFortressDeployed = 0;
        //     warIdToDefenseDeployed2[_warId].b52StratofortressDeployed = 0;
        //     warIdToDefenseDeployed2[_warId].b2SpiritDeployed = 0;
        //     warIdToDefenseDeployed2[_warId].b1bLancerDeployed = 0;
        //     warIdToDefenseDeployed2[_warId].tupolevTu160Deployed = 0;
        // }
    }

    function decrementLosses(
        uint256 _warId,
        uint256[] memory defenderLosses,
        uint256 defenderId,
        uint256[] memory attackerLosses,
        uint256 attackerId
    ) public onlyAirBattle {
        // (uint256 offenseWarId, uint256 defenseWarId) = getInvolvedParties(
        //     _warId
        // );
        // if (offenseWarId == attackerId) {
        //     for (uint256 i; i < attackerLosses.length; i++) {
        //         if (attackerLosses[i] == 1) {
        //             warIdToOffenseDeployed1[_warId].yak9Deployed -= 1;
        //         } else if (attackerLosses[i] == 2) {
        //             warIdToOffenseDeployed1[_warId].p51MustangDeployed -= 1;
        //         } else if (attackerLosses[i] == 3) {
        //             warIdToOffenseDeployed1[_warId].f86SabreDeployed -= 1;
        //         } else if (attackerLosses[i] == 4) {
        //             warIdToOffenseDeployed1[_warId].mig15Deployed -= 1;
        //         } else if (attackerLosses[i] == 5) {
        //             warIdToOffenseDeployed1[_warId].f100SuperSabreDeployed -= 1;
        //         } else if (attackerLosses[i] == 6) {
        //             warIdToOffenseDeployed1[_warId].f35LightningDeployed -= 1;
        //         } else if (attackerLosses[i] == 7) {
        //             warIdToOffenseDeployed1[_warId].f15EagleDeployed -= 1;
        //         } else if (attackerLosses[i] == 8) {
        //             warIdToOffenseDeployed1[_warId].su30MkiDeployed -= 1;
        //         } else if (attackerLosses[i] == 9) {
        //             warIdToOffenseDeployed1[_warId].f22RaptorDeployed -= 1;
        //         }
        //     }
        // }
        // if (offenseWarId == defenderId) {
        //     for (uint256 i; i < defenderLosses.length; i++) {
        //         if (defenderLosses[i] == 1) {
        //             warIdToOffenseDeployed1[_warId].yak9Deployed -= 1;
        //         } else if (defenderLosses[i] == 2) {
        //             warIdToOffenseDeployed1[_warId].p51MustangDeployed -= 1;
        //         } else if (defenderLosses[i] == 3) {
        //             warIdToOffenseDeployed1[_warId].f86SabreDeployed -= 1;
        //         } else if (defenderLosses[i] == 4) {
        //             warIdToOffenseDeployed1[_warId].mig15Deployed -= 1;
        //         } else if (defenderLosses[i] == 5) {
        //             warIdToOffenseDeployed1[_warId].f100SuperSabreDeployed -= 1;
        //         } else if (defenderLosses[i] == 6) {
        //             warIdToOffenseDeployed1[_warId].f35LightningDeployed -= 1;
        //         } else if (defenderLosses[i] == 7) {
        //             warIdToOffenseDeployed1[_warId].f15EagleDeployed -= 1;
        //         } else if (defenderLosses[i] == 8) {
        //             warIdToOffenseDeployed1[_warId].su30MkiDeployed -= 1;
        //         } else if (defenderLosses[i] == 9) {
        //             warIdToOffenseDeployed1[_warId].f22RaptorDeployed -= 1;
        //         }
        //     }
        // }
        // if (defenseWarId == attackerId) {
        //     for (uint256 i; i < attackerLosses.length; i++) {
        //         if (attackerLosses[i] == 1) {
        //             warIdToDefenseDeployed1[_warId].yak9Deployed -= 1;
        //         } else if (attackerLosses[i] == 2) {
        //             warIdToDefenseDeployed1[_warId].p51MustangDeployed -= 1;
        //         } else if (attackerLosses[i] == 3) {
        //             warIdToDefenseDeployed1[_warId].f86SabreDeployed -= 1;
        //         } else if (attackerLosses[i] == 4) {
        //             warIdToDefenseDeployed1[_warId].mig15Deployed -= 1;
        //         } else if (attackerLosses[i] == 5) {
        //             warIdToDefenseDeployed1[_warId].f100SuperSabreDeployed -= 1;
        //         } else if (attackerLosses[i] == 6) {
        //             warIdToDefenseDeployed1[_warId].f35LightningDeployed -= 1;
        //         } else if (attackerLosses[i] == 7) {
        //             warIdToDefenseDeployed1[_warId].f15EagleDeployed -= 1;
        //         } else if (attackerLosses[i] == 8) {
        //             warIdToDefenseDeployed1[_warId].su30MkiDeployed -= 1;
        //         } else if (attackerLosses[i] == 9) {
        //             warIdToDefenseDeployed1[_warId].f22RaptorDeployed -= 1;
        //         }
        //     }
        // }
        // if (defenseWarId == defenderId) {
        //     for (uint256 i; i < defenderLosses.length; i++) {
        //         if (defenderLosses[i] == 1) {
        //             warIdToDefenseDeployed1[_warId].yak9Deployed -= 1;
        //         } else if (defenderLosses[i] == 2) {
        //             warIdToDefenseDeployed1[_warId].p51MustangDeployed -= 1;
        //         } else if (defenderLosses[i] == 3) {
        //             warIdToDefenseDeployed1[_warId].f86SabreDeployed -= 1;
        //         } else if (defenderLosses[i] == 4) {
        //             warIdToDefenseDeployed1[_warId].mig15Deployed -= 1;
        //         } else if (defenderLosses[i] == 5) {
        //             warIdToDefenseDeployed1[_warId].f100SuperSabreDeployed -= 1;
        //         } else if (defenderLosses[i] == 6) {
        //             warIdToDefenseDeployed1[_warId].f35LightningDeployed -= 1;
        //         } else if (defenderLosses[i] == 7) {
        //             warIdToDefenseDeployed1[_warId].f15EagleDeployed -= 1;
        //         } else if (defenderLosses[i] == 8) {
        //             warIdToDefenseDeployed1[_warId].su30MkiDeployed -= 1;
        //         } else if (defenderLosses[i] == 9) {
        //             warIdToDefenseDeployed1[_warId].f22RaptorDeployed -= 1;
        //         }
        //     }
        // }
    }

    ///@dev this function is only callable fro mthe air battle contract
    ///@dev this function will increment air battle casualties
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

    ///@dev this function is only callable from the forces contact
    ///@notice this function will allow a nation to deploy ground forces (soldiers and tanks) to a given war
    function deployForcesToWar(
        uint256 nationId,
        uint256 _warId,
        uint256 soldiersToDeploy,
        uint256 tanksToDeploy
    ) public onlyForcesContract {
        bool isActive = isWarActive(_warId);
        require(isActive, "war not active");
        (uint256 offenseId, uint256 defenseId) = getInvolvedParties(_warId);
        require(
            nationId == offenseId || nationId == defenseId,
            "nation not involved"
        );
        if (nationId == offenseId) {
            bool deployedToday = warIdToOffenseDeployed1[_warId]
                .offenseDeployedToday;
            require(!deployedToday, "already deployed forces today");
            warIdToOffenseDeployed1[_warId]
                .soldiersDeployed += soldiersToDeploy;
            warIdToOffenseDeployed1[_warId].tanksDeployed += tanksToDeploy;
            warIdToOffenseDeployed1[_warId].offenseDeployedToday = true;
        } else if (nationId == defenseId) {
            bool deployedToday = warIdToDefenseDeployed1[_warId]
                .defenseDeployedToday;
            require(!deployedToday, "already deployed forces today");
            warIdToDefenseDeployed1[_warId]
                .soldiersDeployed += soldiersToDeploy;
            warIdToDefenseDeployed1[_warId].tanksDeployed += tanksToDeploy;
            warIdToDefenseDeployed1[_warId].defenseDeployedToday = true;
        }
    }

    ///@dev this is a public view function that will return the number of ground forces a nation has deploed to a war
    ///@param _warId is the war id of the war where the forces are deployed
    ///@param attackerId is the nation id of the nation being queried
    ///@return soldiersDeployed is the soldiers the given nation has deployed to the given war
    ///@return tanksDeployed is the tanks the given nation has deployed to the given war
    function getDeployedGroundForces(
        uint256 _warId,
        uint256 attackerId
    ) public view returns (uint256, uint256) {
        uint256 soldiersDeployed;
        uint256 tanksDeployed;
        (uint256 offenseId, uint256 defenseId) = getInvolvedParties(_warId);
        if (attackerId == offenseId) {
            soldiersDeployed = warIdToOffenseDeployed1[_warId].soldiersDeployed;
            tanksDeployed = warIdToOffenseDeployed1[_warId].tanksDeployed;
        } else if (attackerId == defenseId) {
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

    ///@dev this function is only callable from the groun battle contract
    ///@dev this function will increment ground forces casualties
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
