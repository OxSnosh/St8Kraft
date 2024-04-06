//SPDX-License-Identifier: Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International
pragma solidity 0.8.17;

import "./NationStrength.sol";
import "./Military.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "./Treasury.sol";
import "./KeeperFile.sol";
import "./Forces.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

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
    address public breakBlockade;
    address public navalAttack;
    address public airBattle;
    address public groundBattle;
    address public cruiseMissile;
    address public blockade;
    address public nuke;
    address public forces;
    address public wonders1;
    address public keeper;
    address public treasury;

    NationStrengthContract nsc;
    MilitaryContract mil;
    WondersContract1 won1;
    CountryMinter mint;
    TreasuryContract tres;
    KeeperContract keep;
    ForcesContract forc;

    struct War {
        uint256 offenseId;
        uint256 defenseId;
        bool active;
        uint256 dayStarted;
        bool peaceDeclared;
        bool offensePeaceOffered;
        bool defensePeaceOffered;
        uint256 offenseBlockades;
        uint256 defenseBlockades;
        mapping(uint256 => uint256) offenseIdToCruiseMissileLaunchesToday;
        mapping(uint256 => uint256) defenseIdToCruiseMissileLaunchesToday;
    }

    struct OffenseDeployed1 {
        mapping(uint256 => bool) offenseDeployedToday;
        uint256 soldiersDeployed;
        uint256 tanksDeployed;
    }

    struct DefenseDeployed1 {
        mapping(uint256 => bool) defenseDeployedToday;
        uint256 soldiersDeployed;
        uint256 tanksDeployed;
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
    mapping(uint256 => DefenseDeployed1) public warIdToDefenseDeployed1;
    mapping(uint256 => OffenseLosses) public warIdToOffenseLosses;
    mapping(uint256 => DefenseLosses) public warIdToDefenseLosses;
    mapping(uint256 => uint256[]) public idToActiveWars;
    mapping(uint256 => uint256[]) public idToOffensiveWars;
    mapping(uint256 => uint256[]) public idToDeactivatedWars;

    event WarDeclared(
        uint256 indexed warId,
        uint256 indexed offenseId,
        uint256 indexed defenseId
    );

    event PeaceOffered(
        uint256 indexed warId,
        uint256 indexed offeredBy
    );

    event PeaceDeclared(
        uint256 indexed warId,
        uint256 indexed offenseId,
        uint256 indexed defenseId
    );

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
        breakBlockade = _breakBlockadeAddress;
        navalAttack = _navalAttackAddress;
        airBattle = _airBattleAddress;
        groundBattle = _groundBattle;
        nsc = NationStrengthContract(_nationStrength);
        military = _military;
        mil = MilitaryContract(_military);
        cruiseMissile = _cruiseMissile;
        forces = _forces;
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        keeper = _keeper;
        keep = KeeperContract(_keeper);
    }

    function settings2(address _treasury, address _forces, address _blockade, address _nuke) public onlyOwner {
        treasury = _treasury;
        tres = TreasuryContract(_treasury);
        forces = _forces;
        forc = ForcesContract(_forces);
        blockade = _blockade;
        nuke = _nuke;
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
        require(check, "war not possible");
        uint day = keep.getGameDay();
        War storage war = warIdToWar[warId];
            war.offenseId = offenseId;
            war.defenseId = defenseId;
            war.active = true;
            war.dayStarted = day;
            war.peaceDeclared = false;
            war.offensePeaceOffered = false;
            war.defensePeaceOffered = false;
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
        emit WarDeclared(warId, offenseId, defenseId);
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
        uint256[] memory activeWars = idToActiveWars[offenseId];
        for (uint256 i = 0; i < activeWars.length; i++) {
            uint256 war = activeWars[i];
            (uint256 offense, uint256 defense) = getInvolvedParties(war);
            require(
                offense != defenseId && defense != defenseId,
                "already at war with this nation"
            );
        }
        warCheckReturn = true;
        return warCheckReturn;
    }

    function offensiveWarLength(
        uint256 offenseId
    ) public view returns (uint256) {
        uint256[] memory offensiveWars = idToOffensiveWars[offenseId];
        return offensiveWars.length;
    }

    function offensiveWarReturn(
        uint256 offenseId
    ) public view returns (uint256[] memory) {
        uint256[] memory offensiveWars = idToOffensiveWars[offenseId];
        return offensiveWars;
    }

    function nationActiveWarsReturn(
        uint256 offenseId
    ) public view returns (uint256[] memory) {
        uint256[] memory activeWarsArray = idToActiveWars[offenseId];
        return activeWarsArray;
    }

    ///@dev this is an internal function that will be balled by the declare war function and set up several structs that will keep track of each war
    function initializeDeployments(uint256 _warId) internal {
        OffenseDeployed1 storage newOffenseDeployed1 = warIdToOffenseDeployed1[_warId];
            newOffenseDeployed1.soldiersDeployed = 0;
            newOffenseDeployed1.tanksDeployed = 0;
        DefenseDeployed1 storage newDefenseDeployed1 = warIdToDefenseDeployed1[_warId];
            newDefenseDeployed1.soldiersDeployed = 0;
            newDefenseDeployed1.tanksDeployed = 0;
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
        emit PeaceOffered(_warId, offerId);
        bool offensePeaceCheck = warIdToWar[_warId].offensePeaceOffered;
        bool defensePeaceCheck = warIdToWar[_warId].defensePeaceOffered;
        if (offensePeaceCheck == true && defensePeaceCheck == true) {
            warIdToWar[_warId].peaceDeclared = true;
            warIdToWar[_warId].active = false;
            emit PeaceDeclared(_warId, offenseNation, defenseNation);
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
    function returnWar(
        uint256 _warId
    ) public view returns (bool, bool, bool, bool) {
        bool offensePeaceOffered = warIdToWar[_warId].offensePeaceOffered;
        bool defensePeaceOffered = warIdToWar[_warId].defensePeaceOffered;
        bool warActive = warIdToWar[_warId].active;
        bool peaceDeclared = warIdToWar[_warId].peaceDeclared;
        return (
            offensePeaceOffered,
            defensePeaceOffered,
            warActive,
            peaceDeclared
        );
    }

    ///@dev this is an internal function that will remove the active war from each nation when peace is declared or the war expires
    function removeActiveWar(uint256 _warId) internal {
        (uint256 offenseId, uint256 defenseId) = getInvolvedParties(_warId);
        uint256[] storage offenseActiveWars = idToActiveWars[offenseId];
        uint256[] storage offenseDeactivatedWars = idToDeactivatedWars[offenseId];
        for (uint256 i = 0; i < offenseActiveWars.length; i++) {
            if (offenseActiveWars[i] == _warId) {
                offenseDeactivatedWars.push(_warId);
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
        uint256[] storage defenseDeactivatedWars = idToDeactivatedWars[defenseId];
        for (uint256 i = 0; i < defenseActiveWars.length; i++) {
            if (defenseActiveWars[i] == _warId) {
                defenseDeactivatedWars.push(_warId);
                defenseActiveWars[i] = defenseActiveWars[
                    defenseActiveWars.length - 1
                ];
                defenseActiveWars.pop();
            }
        }
        warIdToWar[_warId].active = false;
    }

    modifier onlyNavyBattle() {
        require(
            msg.sender == breakBlockade ||
                msg.sender == navalAttack,
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
        (uint256 offenseId, uint256 defenseId) = getInvolvedParties(_warId);
        uint256 day = keep.getGameDay();
        War storage war = warIdToWar[_warId];
        if (nationId == offenseId) {
            require(war.offenseIdToCruiseMissileLaunchesToday[day] < 2, "too many launches today");
            war.offenseIdToCruiseMissileLaunchesToday[day] += 1;
        } else if (nationId == defenseId) {
            require(war.defenseIdToCruiseMissileLaunchesToday[day] < 2, "too many launches today");
            war.defenseIdToCruiseMissileLaunchesToday[day] += 1;
        }
    }

    function getCruiseMissileLaunchesToday(uint256 _warId, uint256 id) public view returns (uint256) {
        (uint256 offenseId, uint256 defenseId) = getInvolvedParties(_warId);
        uint256 day = keep.getGameDay();
        uint256 launches;
        War storage war = warIdToWar[_warId];
        if (id == offenseId) {
            launches = war.offenseIdToCruiseMissileLaunchesToday[day];
        } else if (id == defenseId) {
            launches = war.defenseIdToCruiseMissileLaunchesToday[day];
        }
        return launches;
    }

    ///@dev this is a public view function that will take a war id as a parameter and return whether the war is active or not
    ///@notice this function will return whether a war is active or not
    ///@param _warId is the warId being queries
    ///@return bool will be true if the war is active
    function isWarActive(uint256 _warId) public view returns (bool) {
        bool isActive = true;
        (, bool expired) = getDaysLeft(_warId);
        bool peaceDeclared = warIdToWar[_warId].peaceDeclared;
        if (expired == true || peaceDeclared == true) {
            isActive = false;
        }
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
            msg.sender == groundBattle ||
                msg.sender == airBattle ||
                msg.sender == navalAttack ||
                msg.sender == breakBlockade ||
                msg.sender == blockade ||
                msg.sender == cruiseMissile ||
                msg.sender == nuke,
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
    function getDaysLeft(uint256 _warId) public view returns (uint256, bool) {
        uint256 day = keep.getGameDay();
        uint256 warDaysElapsed;
        if (day >= warIdToWar[_warId].dayStarted + 7) {
            warDaysElapsed = 7;
        } else {
            warDaysElapsed = day - warIdToWar[_warId].dayStarted;
        }
        uint256 daysLeft = (7 - warDaysElapsed);
        bool expired = false;
        if (daysLeft == 0) {
            expired = true;
        }
        return (daysLeft, expired);
    }

    modifier onlyAirBattle() {
        require(
            msg.sender == airBattle,
            "function only callable from air battle"
        );
        _;
    }

    ///@dev this function is only callable from the air battle contract
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
        uint256 day = keep.getGameDay();
        if (nationId == offenseId) {
            bool deployedToday = warIdToOffenseDeployed1[_warId]
                .offenseDeployedToday[day];
            require(!deployedToday, "already deployed forces today");
            warIdToOffenseDeployed1[_warId]
                .soldiersDeployed += soldiersToDeploy;
            warIdToOffenseDeployed1[_warId].tanksDeployed += tanksToDeploy;
            warIdToOffenseDeployed1[_warId].offenseDeployedToday[day] = true;
        } else if (nationId == defenseId) {
            bool deployedToday = warIdToDefenseDeployed1[_warId]
                .defenseDeployedToday[day];
            require(!deployedToday, "already deployed forces today");
            warIdToDefenseDeployed1[_warId]
                .soldiersDeployed += soldiersToDeploy;
            warIdToDefenseDeployed1[_warId].tanksDeployed += tanksToDeploy;
            warIdToDefenseDeployed1[_warId].defenseDeployedToday[day] = true;
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

    function recallTroopsFromDeactivatedWars(uint256 id) public {
        console.log("ID of recall", id);
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256[] memory activeWars = idToActiveWars[id];
        for (uint256 i = 0; i < activeWars.length; i++) {
            (,bool expired) = getDaysLeft(activeWars[i]);
            if(expired == true) {
                removeActiveWar(activeWars[i]);
            }
        }
        uint256[] storage deactivatedWars = idToDeactivatedWars[id];
        for (uint256 i = 0; i < deactivatedWars.length; i++) {
            uint256 war = deactivatedWars[i];
            (uint256 offenseId, uint256 defenseId) = getInvolvedParties(war);
            if (id == offenseId) {
                uint256 soldiersDeployed = warIdToOffenseDeployed1[war]
                    .soldiersDeployed;
                uint256 tanksDeployed = warIdToOffenseDeployed1[war]
                    .tanksDeployed;
                forc.withdrawSoldiers(id, soldiersDeployed);
                forc.withdrawTanks(id, tanksDeployed);
                warIdToOffenseDeployed1[war].soldiersDeployed = 0;
                warIdToOffenseDeployed1[war].tanksDeployed = 0;
            } else if (id == defenseId) {
                uint256 soldiersDeployed = warIdToDefenseDeployed1[war]
                    .soldiersDeployed;
                uint256 tanksDeployed = warIdToDefenseDeployed1[war]
                    .tanksDeployed;
                forc.withdrawSoldiers(soldiersDeployed, id);
                forc.withdrawTanks(tanksDeployed, id);
                warIdToDefenseDeployed1[war].soldiersDeployed = 0;
                warIdToDefenseDeployed1[war].tanksDeployed = 0;
            }
            deactivatedWars[i] = deactivatedWars[deactivatedWars.length - 1];
            deactivatedWars.pop();
        }
    }
}
