//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "./War.sol";
import "./Infrastructure.sol";
import "./Forces.sol";
import "./Treasury.sol";
import "./Improvements.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "./Taxes.sol";
import "./CountryParameters.sol";
import "./Military.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "hardhat/console.sol";

///@title GroundBattleContract
///@author OxSnosh
///@dev this contract inherits from the openzeppelin ownable contract
///@dev this contract inherits from the chainlink vrf contract
///@notice the GroundBattleContract will allow nations at war to launch ground attacks against each other
contract GroundBattleContract is Ownable, VRFConsumerBaseV2, ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint256 groundBattleId;
    address warAddress;
    address infrastructure;
    address forces;
    address treasury;
    address improvements2;
    address improvements4;
    address wonders3;
    address wonders4;
    address countryMinter;
    address additionalTaxes;
    address parameters;
    address military;

    uint256[] public todaysGroundBattles;

    WarContract war;
    InfrastructureContract inf;
    ForcesContract force;
    TreasuryContract tsy;
    ImprovementsContract2 imp2;
    ImprovementsContract4 imp4;
    WondersContract3 won3;
    WondersContract4 won4;
    CountryMinter mint;
    AdditionalTaxesContract addTax;
    CountryParametersContract param;
    MilitaryContract mil;

    struct GroundForcesToBattle {
        uint256 attackType;
        uint256 soldierCount;
        uint256 tankCount;
        uint256 strength;
        uint256 countryId;
        uint256 warId;
    }

    struct BattleResults {
        uint256 nationId;
        uint256 soldierLosses;
        uint256 tankLosses;
        uint256 defenderId;
        uint256 defenderSoldierLosses;
        uint256 defenderTankLosses;
    }

    //Chainlik Variables
    uint256[] private s_randomWords;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 10;

    mapping(uint256 => GroundForcesToBattle) groundBattleIdToAttackerForces;
    mapping(uint256 => GroundForcesToBattle) groundBattleIdToDefenderForces;
    mapping(uint256 => BattleResults) groundBattleIdToBattleResults;
    mapping(uint256 => bool) groundBattleIdToAtackerVictory;
    
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;

    event BattleResultsEvent (
        uint256 indexed battleId,
        uint256 attackSolderLosses,
        uint256 attackTankLosses,
        uint256 defenderSoldierLosses,
        uint256 defenderTankLosses
    );

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function settings(
        address _warAddress,
        address _infrastructure,
        address _forces,
        address _treasury,
        address _countryMinter,
        address _military
    ) public onlyOwner {
        warAddress = _warAddress;
        war = WarContract(_warAddress);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        forces = _forces;
        force = ForcesContract(_forces);
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        military = _military;
        mil = MilitaryContract(_military);
    }

    function settings2(
        address _improvements2,
        address _improvements4,
        address _wonders3,
        address _wonders4,
        address _additionalTaxes,
        address _parameters
    ) public onlyOwner {
        improvements2 = _improvements2;
        imp2 = ImprovementsContract2(_improvements2);
        improvements4 = _improvements4;
        imp4 = ImprovementsContract4(_improvements4);
        wonders3 = _wonders3;
        won3 = WondersContract3(_wonders3);
        wonders4 = _wonders4;
        won4 = WondersContract4(_wonders4);
        additionalTaxes = _additionalTaxes;
        addTax = AdditionalTaxesContract(_additionalTaxes);
        parameters = _parameters;
        param = CountryParametersContract(_parameters);
    }

    function updateWarContract(address newAddress) public onlyOwner {
        warAddress = newAddress;
        war = WarContract(newAddress);
    }

    function updateInfrastructureContract(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    function updateForcesContract(address newAddress) public onlyOwner {
        forces = newAddress;
        force = ForcesContract(newAddress);
    }

    function updateTreasuryContract(address newAddress) public onlyOwner {
        treasury = newAddress;
        tsy = TreasuryContract(newAddress);
    }

    function updateImprovemetsContract2(address newAddress) public onlyOwner {
        improvements2 = newAddress;
        imp2 = ImprovementsContract2(newAddress);
    }

    function updateWondersContract3(address newAddress) public onlyOwner {
        wonders3 = newAddress;
        won3 = WondersContract3(newAddress);
    }

    function updateWondersContract4(address newAddress) public onlyOwner {
        wonders4 = newAddress;
        won4 = WondersContract4(newAddress);
    }

    function battleOdds(
        uint256 _warId,
        uint256 attackerId
    ) public view returns (uint256 attackerOdds, uint256 defenderOdds) {
        (uint256 warOffense, uint256 warDefense) = war.getInvolvedParties(
            _warId
        );
        uint256 attackerStrength;
        uint256 defenderStrength;
        uint256 attackerOddsOfVictory;
        uint256 defenderOddsOfVictory;
        if (attackerId == warOffense) {
            attackerStrength = getAttackerForcesStrength(warOffense, _warId);
            defenderStrength = getDefenderForcesStrength(warDefense, _warId);
            attackerOddsOfVictory = ((attackerStrength * 100) /
                (attackerStrength + defenderStrength));
            defenderOddsOfVictory = ((defenderStrength * 100) /
                (attackerStrength + defenderStrength));
        } else if (attackerId == warDefense) {
            attackerStrength = getAttackerForcesStrength(warDefense, _warId);
            defenderStrength = getDefenderForcesStrength(warOffense, _warId);
            attackerOddsOfVictory = ((attackerStrength * 100) /
                (attackerStrength + defenderStrength));
            defenderOddsOfVictory = ((defenderStrength * 100) /
                (attackerStrength + defenderStrength));
        }
        return (attackerOddsOfVictory, defenderOddsOfVictory);
    }

    ///@dev this is a public function callable only from a nation owner
    ///@dev this contract allows nations at war to launch a ground attack against each other
    ///@notice this contract allows nations at war to launch a ground attack against each other
    ///@param warId is the war id of the war between the 2 nations in the battle
    ///@param attackerId is the nation id of the attacking nation
    ///@param defenderId is the nation id of the defending nation
    ///@param attackType 1. planned 2. standard 3. aggressive 4. beserk
    function groundAttack(
        uint256 warId,
        uint256 attackerId,
        uint256 defenderId,
        uint256 attackType
    ) public {
        bool isOwner = mint.checkOwnership(attackerId, msg.sender);
        require(isOwner, "!nation owner");
        bool isActiveWar = war.isWarActive(warId);
        require(isActiveWar, "!not active war");
        (uint256 warOffense, uint256 warDefense) = war.getInvolvedParties(
            warId
        );
        require(
            warOffense == attackerId || warOffense == defenderId,
            "invalid parameters"
        );
        require(
            warDefense == attackerId || warDefense == defenderId,
            "invalid parameters"
        );
        require(
            attackType == 1 ||
                attackType == 2 ||
                attackType == 3 ||
                attackType == 4,
            "invalid attack type"
        );
        generateAttackerForcesStruct(
            warId,
            groundBattleId,
            attackerId,
            attackType
        );
        generateDefenderForcesStruct(warId, groundBattleId, defenderId);
        war.cancelPeaceOffersUponAttack(warId);
        fulfillRequest(groundBattleId);
        groundBattleId++;
        console.log("GROUND BATTLE ID: ", groundBattleId);
    }

    function generateAttackerForcesStruct(
        uint256 warId,
        uint256 battleId,
        uint256 attackerId,
        uint256 attackType
    ) internal {
        (uint256 soldiersDeployed, uint256 tanksDeployed) = war
            .getDeployedGroundForces(warId, attackerId);
        uint256 attackerForcesStrength = getAttackerForcesStrength(
            attackerId,
            warId
        );
        GroundForcesToBattle memory newGroundForces = GroundForcesToBattle(
            attackType,
            soldiersDeployed,
            tanksDeployed,
            attackerForcesStrength,
            attackerId,
            warId
        );
        groundBattleIdToAttackerForces[battleId] = newGroundForces;
    }

    function returnAttackerForcesStruct(
        uint256 battleId
    )
        public
        view
        returns (uint256, uint256, uint256, uint256, uint256, uint256)
    {
        uint256 attackType = groundBattleIdToAttackerForces[battleId]
            .attackType;
        uint256 soldiersDeployed = groundBattleIdToAttackerForces[battleId]
            .soldierCount;
        uint256 tanksDeployed = groundBattleIdToAttackerForces[battleId]
            .tankCount;
        uint256 attackerForcesStrength = groundBattleIdToAttackerForces[
            battleId
        ].strength;
        uint256 attackerId = groundBattleIdToAttackerForces[battleId].countryId;
        uint256 warId = groundBattleIdToAttackerForces[battleId].warId;
        return (
            attackType,
            soldiersDeployed,
            tanksDeployed,
            attackerForcesStrength,
            attackerId,
            warId
        );
    }

    function generateDefenderForcesStruct(
        uint256 warId,
        uint256 battleId,
        uint256 defenderId
    ) internal {
        uint256 soldiers = force.getDefendingSoldierCount(defenderId);
        uint256 tanks = force.getDefendingTankCount(defenderId);
        uint256 defenderForcesStrength = getDefenderForcesStrength(
            defenderId,
            battleId
        );
        GroundForcesToBattle memory newGroundForces = GroundForcesToBattle(
            0,
            soldiers,
            tanks,
            defenderForcesStrength,
            defenderId,
            warId
        );
        groundBattleIdToDefenderForces[battleId] = newGroundForces;
    }

    function returnDefenderForcesStruct(
        uint256 battleId
    ) public view returns (uint256, uint256, uint256, uint256, uint256) {
        uint256 soldiersDefending = groundBattleIdToDefenderForces[battleId]
            .soldierCount;
        uint256 tanksDefending = groundBattleIdToDefenderForces[battleId]
            .tankCount;
        uint256 defendingForcesStrength = groundBattleIdToDefenderForces[
            battleId
        ].strength;
        uint256 defenderId = groundBattleIdToDefenderForces[battleId].countryId;
        uint256 warId = groundBattleIdToDefenderForces[battleId].warId;
        return (
            soldiersDefending,
            tanksDefending,
            defendingForcesStrength,
            defenderId,
            warId
        );
    }

    function getAttackerForcesStrength(
        uint256 attackerId,
        uint256 warId
    ) public view returns (uint256) {
        (, uint256 tanksDeployed) = war.getDeployedGroundForces(
            warId,
            attackerId
        );
        uint256 soldierEfficiency = getAttackingSoldierEfficiency(
            attackerId,
            warId
        );
        uint256 strength = (soldierEfficiency + (15 * tanksDeployed));
        uint256 mod = 100;
        bool pentagon = won3.getPentagon(attackerId);
        if (pentagon) {
            mod += 20;
        }
        bool logisticalSupport = won4.getSuperiorLogisticalSupport(attackerId);
        if (logisticalSupport) {
            mod += 10;
        }
        //tanks
        uint256 tankModifier = (tanksDeployed / 100);
        if (tankModifier > 75) {
            tankModifier = 75;
        }
        mod += tankModifier;
        //defcon
        uint256 defcon = mil.getDefconLevel(attackerId);
        mod += ((5 - defcon) * 5);
        strength = ((strength * mod) / 100);
        return strength;
    }

    function getAttackingSoldierEfficiency(
        uint256 attackerId,
        uint256 _warId
    ) public view returns (uint256) {
        (uint256 attackingSoldiers, ) = war.getDeployedGroundForces(
            _warId,
            attackerId
        );
        uint256 attackingEfficiencyModifier = force
            .getDeployedSoldierEfficiencyModifier(attackerId);
        uint256 attackingSoldierEfficiency = ((attackingSoldiers *
            attackingEfficiencyModifier) / 100);
        return attackingSoldierEfficiency;
    }

    function getDefenderForcesStrength(
        uint256 defenderId,
        uint256 _warId
    ) public view returns (uint256) {
        uint256 soldierEfficiency = getDefendingSoldierEfficiency(defenderId);
        uint256 tanks = force.getDefendingTankCount(defenderId);
        uint256 strength = ((soldierEfficiency) + (17 * tanks));
        (uint256 warOffense, uint256 warDefense) = war.getInvolvedParties(
            _warId
        );
        uint256 attackerId;
        if (defenderId == warOffense) {
            attackerId = warDefense;
        } else if (defenderId == warDefense) {
            attackerId = warOffense;
        }
        uint256 mod = getDefenderStrengthModifier(defenderId, attackerId);
        strength = ((strength * mod) / 100);
        return strength;
    }

    function getDefendingSoldierEfficiency(
        uint256 id
    ) public view returns (uint256) {
        uint256 defendingSoldiers = force.getDefendingSoldierCount(id);
        uint256 defendingEfficiencyModifier = force
            .getDefendingSoldierEfficiencyModifier(id);
        uint256 defendingSoldierEfficiency = ((defendingSoldiers *
            defendingEfficiencyModifier) / 100);
        return defendingSoldierEfficiency;
    }

    function getDefenderStrengthModifier(uint256 defenderId, uint256 attackerId) public view returns (uint256) {
        uint256 mod = 100;
        uint256 officeOfPropagandaCount = imp4.getOfficeOfPropagandaCount(
            attackerId
        );
        bool pentagon = won3.getPentagon(defenderId);
        bool logisticalSupport = won4.getSuperiorLogisticalSupport(defenderId);
        if (officeOfPropagandaCount > 0) {
            mod -= (5 * officeOfPropagandaCount);
        }
        if (pentagon) {
            mod += 20;
        }
        if (logisticalSupport) {
            mod += 10;
        }
        //infrastructure
        uint256 infrastructureLevel = inf.getInfrastructureCount(defenderId);
        uint256 infrastructureModifier = (infrastructureLevel / 100);
        if (infrastructureModifier > 75) {
            infrastructureModifier = 75;
        }
        mod += infrastructureModifier;
        //defcon
        uint256 defcon = mil.getDefconLevel(defenderId);
        mod += ((5 - defcon) * 5);
        return mod;
    }

    bytes32 groundBattleJobId;
    address oracleAddress;
    uint256 fee;

    function updateGroundBattleJobId(bytes32 _jobId) public onlyOwner {
        groundBattleJobId = _jobId;
    }

    function updateOracleAddress(address _oracleAddress) public onlyOwner {
        oracleAddress = _oracleAddress;
    }

    function updateFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    function fulfillRequest(uint256 battleId) public {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToRequestIndex[requestId] = battleId;
        console.log("REQUEST ID: ", requestId);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        uint256 attackerStrength = groundBattleIdToAttackerForces[requestNumber]
            .strength;
        uint256 defenderStrength = groundBattleIdToDefenderForces[requestNumber]
            .strength;
        uint256 attackerId = groundBattleIdToAttackerForces[requestNumber]
            .countryId;
        uint256 defenderId = groundBattleIdToDefenderForces[requestNumber]
            .countryId;
        uint256 warId = groundBattleIdToAttackerForces[requestNumber].warId;
        Chainlink.Request memory req = buildChainlinkRequest(
            groundBattleJobId,
            address(this),
            this.completeBattleSequence.selector
        );
        req.addUint("requestNumber", requestNumber);
        req.addBytes("randomWords", abi.encodePacked(randomWords));
        req.addUint("attackerStrength", attackerStrength);
        req.addUint("defenderStrength", defenderStrength);
        req.addUint("attackerId", attackerId);
        req.addUint("defenderId", defenderId);
        req.addUint("warId", warId);
        sendChainlinkRequestTo(oracleAddress, req, fee);
    }

    function completeBattleSequence(
        uint256 battleId, 
        uint256 attackerId,
        uint256 attackerSoldierLosses,
        uint256 attackerTankLosses,
        uint256 defenderId,
        uint256 defenderSoldierLosses,
        uint256 defenderTankLosses,
        uint256 warId,
        bool attackerVictory
    ) external {
        groundBattleIdToAtackerVictory[battleId] = attackerVictory;
        emit BattleResultsEvent (
            battleId,
            attackerSoldierLosses,
            attackerTankLosses,
            defenderSoldierLosses,
            defenderTankLosses
        );
        BattleResults memory newBattleResults = BattleResults(
            attackerId,
            attackerSoldierLosses,
            attackerTankLosses,
            defenderId,
            defenderSoldierLosses,
            defenderTankLosses
        );
        groundBattleIdToBattleResults[
            battleId
        ] = newBattleResults;
        force.decreaseUnits(
            attackerSoldierLosses,
            attackerTankLosses,
            attackerId,
            defenderSoldierLosses,
            defenderTankLosses,
            defenderId
        );
        war.decreaseGroundBattleLosses(
            attackerSoldierLosses,
            attackerTankLosses,
            attackerId,
            warId
        );
        (, , bool anarchyCheckDefender) = addTax.soldierToPopulationRatio(
            defenderId
        );
        (, , bool anarchyCheckAttacker) = addTax.soldierToPopulationRatio(
            attackerId
        );
        if (anarchyCheckDefender) {
            param.inflictAnarchy(defenderId);
        }
        if (anarchyCheckAttacker) {
            param.inflictAnarchy(attackerId);
        }
        collectSpoils(battleId, attackerId);
        console.log("BATTLE COMPLETE");
    }

    function returnBattleResults(
        uint256 battleId
    )
        public
        view
        returns (uint256, uint256, uint256, uint256, uint256, uint256)
    {
        uint256 attackerId = groundBattleIdToBattleResults[battleId]
            .nationId;
        uint256 attackerSoldierLosses = groundBattleIdToBattleResults[
            battleId
        ].soldierLosses;
        uint256 attackerTankLosses = groundBattleIdToBattleResults[
            battleId
        ].tankLosses;
        uint256 defenderId = groundBattleIdToBattleResults[battleId]
            .defenderId;
        uint256 defenderSoldierLosses = groundBattleIdToBattleResults[
            battleId
        ].defenderSoldierLosses;
        uint256 defenderTankLosses = groundBattleIdToBattleResults[
            battleId
        ].defenderTankLosses;
        return (
            attackerId,
            attackerSoldierLosses,
            attackerTankLosses,
            defenderId,
            defenderSoldierLosses,
            defenderTankLosses
        );
    }

    function returnAttackVictorious(
        uint256 battleId
    ) public view returns (bool) {
        bool attackVictorious = groundBattleIdToAtackerVictory[battleId];
        return attackVictorious;
    }

    function getPercentageLosses(
        uint256 battleId
    ) public view returns (uint256, uint256, uint256, uint256) {
        uint256[] memory randomWords = s_requestIndexToRandomWords[battleId];
        uint256 outcomeModifierForWinnerSoldiers = randomWords[1];
        uint256 outcomeModifierForWinnerTanks = randomWords[2];
        uint256 winnerSoldierLossesPercentage;
        uint256 winnerTankLossesPercentage;
        (
            uint256 loserSoldierLossesPercentage,
            uint256 loserTankLossesPercentage
        ) = getLoserPercentageLosses(battleId);
        uint256 attackType = groundBattleIdToAttackerForces[battleId]
            .attackType;
        if (attackType == 1) {
            winnerSoldierLossesPercentage = (5 +
                (outcomeModifierForWinnerSoldiers % 11));
            winnerTankLossesPercentage = (5 +
                (outcomeModifierForWinnerTanks % 6));
        } else if (attackType == 2) {
            winnerSoldierLossesPercentage = (10 +
                (outcomeModifierForWinnerSoldiers % 11));
            winnerTankLossesPercentage = (10 +
                (outcomeModifierForWinnerTanks % 6));
        } else if (attackType == 3) {
            winnerSoldierLossesPercentage = (15 +
                (outcomeModifierForWinnerSoldiers % 16));
            winnerTankLossesPercentage = (15 +
                (outcomeModifierForWinnerTanks % 11));
        } else {
            winnerSoldierLossesPercentage = (25 +
                (outcomeModifierForWinnerSoldiers % 16));
            winnerTankLossesPercentage = (25 +
                (outcomeModifierForWinnerTanks % 11));
        }
        return (
            winnerSoldierLossesPercentage,
            winnerTankLossesPercentage,
            loserSoldierLossesPercentage,
            loserTankLossesPercentage
        );
    }

    function getLoserPercentageLosses(
        uint256 battleId
    ) public view returns (uint256, uint256) {
        uint256[] memory randomWords = s_requestIndexToRandomWords[battleId];
        uint256 outcomeModifierForLoserSoldiers = randomWords[3];
        uint256 outcomeModifierForLoserTanks = randomWords[4];
        uint256 loserSoldierLossesPercentage;
        uint256 loserTankLossesPercentage;
        uint256 attackType = groundBattleIdToAttackerForces[battleId]
            .attackType;
        if (attackType == 1) {
            loserSoldierLossesPercentage = (20 +
                (outcomeModifierForLoserSoldiers % 11));
            loserTankLossesPercentage = (20 +
                (outcomeModifierForLoserTanks % 6));
        } else if (attackType == 2) {
            loserSoldierLossesPercentage = (30 +
                (outcomeModifierForLoserSoldiers % 16));
            loserTankLossesPercentage = (30 +
                (outcomeModifierForLoserTanks % 6));
        } else if (attackType == 3) {
            loserSoldierLossesPercentage = (35 +
                (outcomeModifierForLoserSoldiers % 21));
            loserTankLossesPercentage = (35 +
                (outcomeModifierForLoserTanks % 16));
        } else {
            loserSoldierLossesPercentage = (45 +
                (outcomeModifierForLoserSoldiers % 21));
            loserTankLossesPercentage = (45 +
                (outcomeModifierForLoserTanks % 16));
        }
        return (loserSoldierLossesPercentage, loserTankLossesPercentage);
    }

    function attackVictory(
        uint256 battleId
    ) internal view returns (uint256, uint256, uint256, uint256) {
        (
            uint256 winnerSoldierLossesPercentage,
            uint256 winnerTankLossesPercentage,
            uint256 loserSoldierLossesPercentage,
            uint256 loserTankLossesPercentage
        ) = getPercentageLosses(battleId);
        uint256 attackerSoldiers = groundBattleIdToAttackerForces[battleId]
            .soldierCount;
        uint256 attackerTanks = groundBattleIdToAttackerForces[battleId]
            .tankCount;
        uint256 defenderSoldiers = groundBattleIdToDefenderForces[battleId]
            .soldierCount;
        uint256 defenderTanks = groundBattleIdToDefenderForces[battleId]
            .tankCount;
        uint256 defenderSoldierLosses = ((defenderSoldiers *
            loserSoldierLossesPercentage) / 100);
        uint256 defenderTankLosses = ((defenderTanks *
            loserTankLossesPercentage) / 100);
        uint256 attackerSoldierLosses = ((attackerSoldiers *
            winnerSoldierLossesPercentage) / 100);
        uint256 attackerTankLosses = ((attackerTanks *
            winnerTankLossesPercentage) / 100);
        if (attackerSoldierLosses > (defenderSoldierLosses / 2)) {
            attackerSoldierLosses = (defenderSoldierLosses / 2);
        }
        if (attackerTankLosses > (defenderTankLosses / 2)) {
            attackerTankLosses = (defenderTankLosses / 2);
        }
        return (
            attackerSoldierLosses,
            attackerTankLosses,
            defenderSoldierLosses,
            defenderTankLosses
        );
    }

    function defenseVictory(
        uint256 battleId
    ) internal view returns (uint256, uint256, uint256, uint256) {
        (
            uint256 winnerSoldierLossesPercentage,
            uint256 winnerTankLossesPercentage,
            uint256 loserSoldierLossesPercentage,
            uint256 loserTankLossesPercentage
        ) = getPercentageLosses(battleId);
        uint256 attackerSoldiers = groundBattleIdToAttackerForces[battleId]
            .soldierCount;
        uint256 attackerTanks = groundBattleIdToAttackerForces[battleId]
            .tankCount;
        uint256 defenderSoldiers = groundBattleIdToDefenderForces[battleId]
            .soldierCount;
        uint256 defenderTanks = groundBattleIdToDefenderForces[battleId]
            .tankCount;
        uint256 attackerSoldierLosses = ((attackerSoldiers *
            loserSoldierLossesPercentage) / 100);
        uint256 attackerTankLosses = ((attackerTanks *
            loserTankLossesPercentage) / 100);
        uint256 defenderSoldierLosses = ((defenderSoldiers *
            winnerSoldierLossesPercentage) / 100);
        uint256 defenderTankLosses = ((defenderTanks *
            winnerTankLossesPercentage) / 100);
        if (defenderSoldierLosses > (attackerSoldierLosses / 2)) {
            defenderSoldierLosses = (attackerSoldierLosses / 2);
        }
        if (defenderTankLosses > (attackerTankLosses / 2)) {
            defenderTankLosses = (attackerTankLosses / 2);
        }
        return (
            attackerSoldierLosses,
            attackerTankLosses,
            defenderSoldierLosses,
            defenderTankLosses
        );
    }

    function collectSpoils(uint256 battleId, uint256 attackerId) internal {
        uint256 defenderId = groundBattleIdToDefenderForces[battleId].countryId;
        uint256[] memory randomWords = s_requestIndexToRandomWords[battleId];
        uint256 randomLandMiles;
        uint256 randomInfrastructure;
        uint256 attackType = groundBattleIdToAttackerForces[battleId]
            .attackType;
        uint256 fobCount = imp2.getForwardOperatingBaseCount(attackerId);
        if (attackType == 1) {
            randomLandMiles = (1 + fobCount + (randomWords[6] % 3));
            randomInfrastructure = (1 + fobCount + ((randomWords[7]) % 3));
        } else if (attackType == 2) {
            randomLandMiles = (2 + fobCount + (randomWords[6] % 3));
            randomInfrastructure = (2 + fobCount + ((randomWords[7]) % 3));
        } else if (attackType == 3) {
            randomLandMiles = (3 + fobCount + (randomWords[6] % 4));
            randomInfrastructure = (3 + fobCount + ((randomWords[7]) % 4));
        } else if (attackType == 4) {
            randomLandMiles = (4 + fobCount + (randomWords[6] % 5));
            randomInfrastructure = (4 + fobCount + ((randomWords[7]) % 5));
        }
        uint256 attackerTech = inf.getTechnologyCount(attackerId);
        uint256 defenderTech = inf.getTechnologyCount(defenderId);
        uint256 multiple = (attackerTech / defenderTech);
        if (multiple > 5) {
            multiple = 5;
        }
        console.log("MULTIPLE", multiple);
        randomLandMiles = (randomLandMiles * multiple);
        randomInfrastructure = (randomInfrastructure * multiple);
        console.log("LAND MILES", randomLandMiles);
        console.log("INFRASTRUCTURE", randomInfrastructure);
        inf.transferLandAndInfrastructure(
            randomLandMiles,
            randomInfrastructure,
            attackerId,
            defenderId
        );
    }
}
