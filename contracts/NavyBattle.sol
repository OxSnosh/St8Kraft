//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Navy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract NavalBlockadeContract is Ownable, VRFConsumerBaseV2 {
    uint256 public blockadeId;
    uint256[] public activeBlockades;
    address public navy;

    //Chainlik Variables
    uint256[] private s_randomWords;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    NavyContract nav;

    struct Blockade {
        uint256 blockadeId;
        uint256 blockaderId;
        uint256 blockadedId;
        uint256 blockadePercentageReduction;
        uint256 blockadeDays;
    }

    mapping(uint256 => Blockade) public blockadeIdToBlockade;
    mapping(uint256 => uint256[]) public idToActiveBlockades;
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;

    constructor(
        address _navy,
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        navy = _navy;
        nav = NavyContract(_navy);
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function updateNavyContract(address newAddress) public onlyOwner {
        navy = newAddress;
        nav = NavyContract(newAddress);
    }

    function blockade(uint256 attackerId, uint256 defenderId) public {
        bool blockadedAlready = nav.getBlockadedToday(defenderId);
        require(blockadedAlready == false, "nation already blockaded today");
        uint256 activeBlockadesAgainstCount = idToActiveBlockades[attackerId]
            .length;
        require(
            activeBlockadesAgainstCount == 0,
            "you cannot blockade while being blockaded"
        );
        uint256 attackerShips = nav.getBlockadeCapableShips(attackerId);
        require(attackerShips >= 5, "not enough blockade capable ships");
        uint256 defenderShips = nav.getBreakBlockadeCapableShips(defenderId);
        require(
            defenderShips == 0,
            "defender has ships that can break blockade"
        );
        bool attackerAlreadyBlockaded = checkIfAttackerAlreadyBlockaded(
            attackerId,
            defenderId
        );
        require(
            attackerAlreadyBlockaded == false,
            "attacker already blockaded this nation"
        );
        Blockade memory newBlockade = Blockade(
            blockadeId,
            attackerId,
            defenderId,
            1,
            0
        );
        blockadeIdToBlockade[blockadeId] = newBlockade;
        //need keeper to increment blockade days
        fulfillRequest(blockadeId);
        uint256[] storage newActiveBlockades = idToActiveBlockades[defenderId];
        newActiveBlockades.push(blockadeId);
        idToActiveBlockades[defenderId] = newActiveBlockades;
        blockadeId++;
    }

    function checkIfAttackerAlreadyBlockaded(
        uint256 attackerId,
        uint256 defenderId
    ) internal view returns (bool) {
        uint256[] memory activeBlockadeArray = idToActiveBlockades[defenderId];
        for (uint256 i = 0; i < activeBlockadeArray.length; i++) {
            uint256 idOfActiveBlockade = activeBlockadeArray[i];
            uint256 idOfAttackerOfActiveBlockade = blockadeIdToBlockade[
                idOfActiveBlockade
            ].blockaderId;
            if (idOfAttackerOfActiveBlockade == attackerId) {
                return true;
            }
        }
        return false;
    }

    function fulfillRequest(uint256 id) public {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToRequestIndex[requestId] = id;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        s_randomWords = randomWords;
        uint256 blockadePercentage = ((s_randomWords[0] % 5) + 1);
        blockadeIdToBlockade[requestNumber]
            .blockadePercentageReduction = blockadePercentage;
    }
}

contract NavalAttackContract is Ownable, VRFConsumerBaseV2 {
    address public navy;
    uint256 public navyBattleId;
    uint256 corvetteStrength = 1;
    uint256 landingShipStrength = 3;
    uint256 battleshipStrength = 5;
    uint256 cruiserStrength = 6;
    uint256 frigateStrength = 8;
    uint256 destroyerStrength = 11;
    uint256 submarineStrength = 12;
    uint256 aircraftCarrierStrength = 15;
    uint256 corvetteTargetSize = 15;
    uint256 landingShipTargetSize = 13;
    uint256 battleshipTargetSize = 11;
    uint256 cruiserTargetSize = 10;
    uint256 frigateTargetSize = 8;
    uint256 destroyerTargetSize = 5;
    uint256 submarineTargetSize = 4;
    uint256 aircraftCarrierTargetSize = 1;

    //Chainlik Variables
    uint256[] private s_randomWords;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 10;

    NavyContract nav;

    struct NavyForces {
        uint256 corvetteCount;
        uint256 landingShipCount;
        uint256 battleshipCount;
        uint256 cruiserCount;
        uint256 frigateCount;
        uint256 destroyerCount;
        uint256 submarineCount;
        uint256 aircraftCarrierCount;
        uint256 startingStrength;
        uint256 countryId;
    }

    struct NavyLosses {
        uint256 corvetteLosses;
        uint256 landingShipLosses;
        uint256 battleshipLosses;
        uint256 cruiserLosses;
        uint256 frigateLosses;
        uint256 destroyerLosses;
        uint256 submarineLosses;
        uint256 aircraftCarrierLosses;
    }

    mapping(uint256 => NavyForces) idToAttackerNavy;
    mapping(uint256 => NavyForces) idToDefenderNavy;
    mapping(uint256 => uint256[]) battleIdToAttackerChanceArray;
    mapping(uint256 => uint256[]) battleIdToAttackerTypeArray;
    mapping(uint256 => uint256) battleIdToAttackerCumulativeSumOdds;
    mapping(uint256 => uint256[]) battleIdToDefenderChanceArray;
    mapping(uint256 => uint256[]) battleIdToDefenderTypeArray;
    mapping(uint256 => uint256) battleIdToDefenderCumulativeSumOdds;    
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;

    constructor(
        address _navy,
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        navy = _navy;
        nav = NavyContract(_navy);
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function updateNavyContract(address newAddress) public onlyOwner {
        navy = newAddress;
        nav = NavyContract(newAddress);
    }

    function navalAttack(uint256 attackerId, uint256 defenderId) public {
        generateAttackerNavyStruct(navyBattleId, attackerId);
        generateDefenderNavyStruct(navyBattleId, defenderId);
        generateAttackerChanceArray(navyBattleId);
        generateDefenderChanceArray(navyBattleId);
        fulfillRequest(navyBattleId);
    }

    function generateAttackerNavyStruct(uint256 battleId, uint256 countryId)
        internal
    {
        uint256 corvetteCount = nav.getCorvetteCount(countryId);
        uint256 landingShipCount = nav.getLandingShipCount(countryId);
        uint256 battleshipCount = nav.getBattleshipCount(countryId);
        uint256 cruiserCount = nav.getCruiserCount(countryId);
        uint256 frigateCount = nav.getFrigateCount(countryId);
        uint256 destroyerCount = nav.getDestroyerCount(countryId);
        uint256 submarineCount = nav.getSubmarineCount(countryId);
        uint256 aircraftCarrierCount = nav.getAircraftCarrierCount(countryId);
        uint256 strengthAttacker = getAttackerStrength(navyBattleId);
        NavyForces memory newNavyForces = NavyForces(
            corvetteCount,
            landingShipCount,
            battleshipCount,
            cruiserCount,
            frigateCount,
            destroyerCount,
            submarineCount,
            aircraftCarrierCount,
            strengthAttacker,
            countryId
        );
        idToAttackerNavy[battleId] = newNavyForces;
    }

    function generateDefenderNavyStruct(uint256 attackId, uint256 countryId)
        internal
    {
        uint256 corvetteCount = nav.getCorvetteCount(countryId);
        uint256 landingShipCount = nav.getLandingShipCount(countryId);
        uint256 battleshipCount = nav.getBattleshipCount(countryId);
        uint256 cruiserCount = nav.getCruiserCount(countryId);
        uint256 frigateCount = nav.getFrigateCount(countryId);
        uint256 destroyerCount = nav.getDestroyerCount(countryId);
        uint256 submarineCount = nav.getSubmarineCount(countryId);
        uint256 aircraftCarrierCount = nav.getAircraftCarrierCount(countryId);
        uint256 defnederStrength = getDefenderStrength(navyBattleId);
        NavyForces memory newNavyForces = NavyForces(
            corvetteCount,
            landingShipCount,
            battleshipCount,
            cruiserCount,
            frigateCount,
            destroyerCount,
            submarineCount,
            aircraftCarrierCount,
            defnederStrength,
            countryId
        );
        idToDefenderNavy[attackId] = newNavyForces;
    }

    function generateAttackerChanceArray(uint256 battleId) internal {
        uint256[] storage chances = battleIdToAttackerChanceArray[battleId];
        uint256[] storage types = battleIdToAttackerTypeArray[battleId];
        uint256 cumulativeSum;
        //corvette
        if(idToAttackerNavy[battleId].corvetteCount > 0) {
            uint256 corvetteOdds = (idToAttackerNavy[battleId].corvetteCount * corvetteTargetSize);
            chances.push(corvetteOdds);
            types.push(1);
            cumulativeSum += corvetteOdds;
        }
        //landing ship
        if(idToAttackerNavy[battleId].landingShipCount > 0) {
            uint256 landingShipOdds = (idToAttackerNavy[battleId].landingShipCount * landingShipTargetSize);
            uint256 landingShipOddsToPush = (landingShipOdds + cumulativeSum);
            chances.push(landingShipOddsToPush);
            types.push(2);
            cumulativeSum = landingShipOddsToPush;
        }
        //battleship
        if(idToAttackerNavy[battleId].battleshipCount > 0) {
            uint256 battleshipOdds = (idToAttackerNavy[battleId].battleshipCount * battleshipTargetSize);
            uint256 battleshipOddsToPush = (battleshipOdds + cumulativeSum);
            chances.push(battleshipOddsToPush);
            types.push(3);
            cumulativeSum = battleshipOddsToPush;
        }
        //cruiser
        if(idToAttackerNavy[battleId].cruiserCount > 0) {
            uint256 cruiserOdds = (idToAttackerNavy[battleId].cruiserCount * cruiserTargetSize);
            uint256 cruiserOddsToPush = (cruiserOdds + cumulativeSum);
            chances.push(cruiserOddsToPush);
            types.push(4);
            cumulativeSum = cruiserOddsToPush;
        }
        //frigate
        if(idToAttackerNavy[battleId].frigateCount > 0) {
            uint256 frigateOdds = (idToAttackerNavy[battleId].frigateCount * frigateTargetSize);
            uint256 frigateOddsToPush = (frigateOdds + cumulativeSum);
            chances.push(frigateOddsToPush);
            types.push(5);
            cumulativeSum = frigateOddsToPush;
        }
        //destroyer
        if(idToAttackerNavy[battleId].destroyerCount > 0) {
            uint256 destroyerOdds = (idToAttackerNavy[battleId].destroyerCount * destroyerTargetSize);
            uint256 destroyerOddsToPush = (destroyerOdds + cumulativeSum);
            chances.push(destroyerOddsToPush);
            types.push(6);
            cumulativeSum = destroyerOddsToPush;
        }
        //submarine
        if(idToAttackerNavy[battleId].submarineCount > 0) {
            uint256 submarineOdds = (idToAttackerNavy[battleId].submarineCount * submarineTargetSize);
            uint256 submarineOddsToPush = (submarineOdds + cumulativeSum);
            chances.push(submarineOddsToPush);
            types.push(7);
            cumulativeSum = submarineOddsToPush;
        }
        //aircraft carrier
        if(idToAttackerNavy[battleId].aircraftCarrierCount > 0) {
            uint256 aircraftCarrierOdds = (idToAttackerNavy[battleId].aircraftCarrierCount * aircraftCarrierTargetSize);
            uint256 aircraftCarrierOddsToPush = (aircraftCarrierOdds + cumulativeSum);
            chances.push(aircraftCarrierOddsToPush);
            types.push(8);
            cumulativeSum = aircraftCarrierOddsToPush;
        }
        battleIdToAttackerChanceArray[battleId] = chances;
        battleIdToAttackerTypeArray[battleId] = types;
        battleIdToAttackerCumulativeSumOdds[battleId] = cumulativeSum;
    }

    function generateDefenderChanceArray(uint256 battleId) internal {
        uint256[] storage chances = battleIdToDefenderChanceArray[battleId];
        uint256[] storage types = battleIdToDefenderTypeArray[battleId];
        uint256 cumulativeSum;
        //corvette
        if(idToDefenderNavy[battleId].corvetteCount > 0) {
            uint256 corvetteOdds = (idToDefenderNavy[battleId].corvetteCount * corvetteTargetSize);
            chances.push(corvetteOdds);
            types.push(1);
            cumulativeSum += corvetteOdds;
        }
        //landing ship
        if(idToDefenderNavy[battleId].landingShipCount > 0) {
            uint256 landingShipOdds = (idToDefenderNavy[battleId].landingShipCount * landingShipTargetSize);
            uint256 landingShipOddsToPush = (landingShipOdds + cumulativeSum);
            chances.push(landingShipOddsToPush);
            types.push(2);
            cumulativeSum = landingShipOddsToPush;
        }
        //battleship
        if(idToDefenderNavy[battleId].battleshipCount > 0) {
            uint256 battleshipOdds = (idToDefenderNavy[battleId].battleshipCount * battleshipTargetSize);
            uint256 battleshipOddsToPush = (battleshipOdds + cumulativeSum);
            chances.push(battleshipOddsToPush);
            types.push(3);
            cumulativeSum = battleshipOddsToPush;
        }
        //cruiser
        if(idToDefenderNavy[battleId].cruiserCount > 0) {
            uint256 cruiserOdds = (idToDefenderNavy[battleId].cruiserCount * cruiserTargetSize);
            uint256 cruiserOddsToPush = (cruiserOdds + cumulativeSum);
            chances.push(cruiserOddsToPush);
            types.push(4);
            cumulativeSum = cruiserOddsToPush;
        }
        //frigate
        if(idToDefenderNavy[battleId].frigateCount > 0) {
            uint256 frigateOdds = (idToDefenderNavy[battleId].frigateCount * frigateTargetSize);
            uint256 frigateOddsToPush = (frigateOdds + cumulativeSum);
            chances.push(frigateOddsToPush);
            types.push(5);
            cumulativeSum = frigateOddsToPush;
        }
        //destroyer
        if(idToDefenderNavy[battleId].destroyerCount > 0) {
            uint256 destroyerOdds = (idToDefenderNavy[battleId].destroyerCount * destroyerTargetSize);
            uint256 destroyerOddsToPush = (destroyerOdds + cumulativeSum);
            chances.push(destroyerOddsToPush);
            types.push(6);
            cumulativeSum = destroyerOddsToPush;
        }
        //submarine
        if(idToDefenderNavy[battleId].submarineCount > 0) {
            uint256 submarineOdds = (idToDefenderNavy[battleId].submarineCount * submarineTargetSize);
            uint256 submarineOddsToPush = (submarineOdds + cumulativeSum);
            chances.push(submarineOddsToPush);
            types.push(7);
            cumulativeSum = submarineOddsToPush;
        }
        //aircraft carrier
        if(idToDefenderNavy[battleId].aircraftCarrierCount > 0) {
            uint256 aircraftCarrierOdds = (idToDefenderNavy[battleId].aircraftCarrierCount * aircraftCarrierTargetSize);
            uint256 aircraftCarrierOddsToPush = (aircraftCarrierOdds + cumulativeSum);
            chances.push(aircraftCarrierOddsToPush);
            types.push(8);
            cumulativeSum = aircraftCarrierOddsToPush;
        }
        battleIdToDefenderChanceArray[battleId] = chances;
        battleIdToDefenderTypeArray[battleId] = types;
        battleIdToDefenderCumulativeSumOdds[battleId] = cumulativeSum;
    }

    function getAttackerStrength (uint256 battleId) public view returns (uint256) {
        uint256 _corvetteStrength = idToAttackerNavy[battleId].corvetteCount * corvetteStrength;
        uint256 _landingShipStrength = idToAttackerNavy[battleId].landingShipCount * landingShipStrength;
        uint256 _battleshipStrength = idToAttackerNavy[battleId].battleshipCount * battleshipStrength;
        uint256 _cruiserStrength = idToAttackerNavy[battleId].cruiserCount * cruiserStrength;
        uint256 _frigateStrength = idToAttackerNavy[battleId].frigateCount * frigateStrength;
        uint256 _destroyerStrength = idToAttackerNavy[battleId].destroyerCount * destroyerStrength;
        uint256 _submarineStrength = idToAttackerNavy[battleId].submarineCount * submarineStrength;
        uint256 _aircraftCarrierStrength = idToAttackerNavy[battleId].aircraftCarrierCount * aircraftCarrierStrength;
        uint256 strength = (
            _corvetteStrength +
            _landingShipStrength +
            _battleshipStrength +
            _cruiserStrength +
            _frigateStrength +
            _destroyerStrength +
            _submarineStrength +
            _aircraftCarrierStrength
        );
        return strength;
    }

    function getDefenderStrength (uint256 battleId) public view returns (uint256) {
        uint256 _corvetteStrength = idToDefenderNavy[battleId].corvetteCount * corvetteStrength;
        uint256 _landingShipStrength = idToDefenderNavy[battleId].landingShipCount * landingShipStrength;
        uint256 _battleshipStrength = idToDefenderNavy[battleId].battleshipCount * battleshipStrength;
        uint256 _cruiserStrength = idToDefenderNavy[battleId].cruiserCount * cruiserStrength;
        uint256 _frigateStrength = idToDefenderNavy[battleId].frigateCount * frigateStrength;
        uint256 _destroyerStrength = idToDefenderNavy[battleId].destroyerCount * destroyerStrength;
        uint256 _submarineStrength = idToDefenderNavy[battleId].submarineCount * submarineStrength;
        uint256 _aircraftCarrierStrength = idToDefenderNavy[battleId].aircraftCarrierCount * aircraftCarrierStrength;
        uint256 strength = (
            _corvetteStrength +
            _landingShipStrength +
            _battleshipStrength +
            _cruiserStrength +
            _frigateStrength +
            _destroyerStrength +
            _submarineStrength +
            _aircraftCarrierStrength
        );
        return strength;
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
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        s_randomWords = randomWords;
        uint256 numberBetweenZeroAndTwo = (s_randomWords[0] % 2);
        uint256 losses = getLosses(requestNumber, numberBetweenZeroAndTwo);
        uint256 attackerStartingStrength = idToAttackerNavy[requestNumber].startingStrength;
        uint256 defenderStartingStrength = idToDefenderNavy[requestNumber].startingStrength;
        uint256 totalStrength = (attackerStartingStrength + defenderStartingStrength);
        for(uint i = 1; i < losses + 1; i++) {
            uint256 randomNumberForTeamSelection = (s_randomWords[i] % totalStrength);
            uint256 randomNumnerForShipSelection = s_randomWords[i+9];
            if (randomNumberForTeamSelection <= attackerStartingStrength) {
                generateLossForDefender(requestNumber, randomNumnerForShipSelection);
            } else {
                generateLossForAttacker(requestNumber, randomNumnerForShipSelection);
            }
        }      
    }

    function getLosses (uint256 battleId, uint256 numberBetweenZeroAndTwo) public view returns (uint256) {
        uint256 attackerId = idToAttackerNavy[battleId].countryId;
        uint256 attackerCount = getShipCount(attackerId);
        uint256 defenderId = idToDefenderNavy[battleId].countryId;
        uint256 defenderCount = getShipCount(defenderId);
        uint256 totalShips = (attackerCount + defenderCount);
        uint256 losses;
        if (totalShips < 4) {
            losses = 1;
        } else if (totalShips <= 10) {
            losses = (1 + numberBetweenZeroAndTwo);
        } else if (totalShips <= 30) {
            losses = (2 + numberBetweenZeroAndTwo);
        } else if (totalShips <= 50) {
            losses = (3 + numberBetweenZeroAndTwo);
        } else if (totalShips <= 70) {
            losses = (4 + numberBetweenZeroAndTwo);
        } else if (totalShips <= 100) {
            losses = (5 + numberBetweenZeroAndTwo);
        } else {
            losses = (6 + numberBetweenZeroAndTwo);
        }
        return losses;
    }

    function getShipCount(uint256 countryId) internal view returns (uint256) {
        uint256 corvetteCount = nav.getCorvetteCount(countryId);
        uint256 landingShipCount = nav.getLandingShipCount(countryId);
        uint256 battleshipCount = nav.getBattleshipCount(countryId);
        uint256 cruiserCount = nav.getCruiserCount(countryId);
        uint256 frigateCount = nav.getFrigateCount(countryId);
        uint256 destroyerCount = nav.getDestroyerCount(countryId);
        uint256 submarineCount = nav.getSubmarineCount(countryId);
        uint256 aircraftCarrierCount = nav.getAircraftCarrierCount(countryId);
        uint256 count = (
            corvetteCount +
            landingShipCount +
            battleshipCount +
            cruiserCount +
            frigateCount +
            destroyerCount +
            submarineCount +
            aircraftCarrierCount
        );
        return count;
    }

    function generateLossForDefender(uint256 battleId, uint256 randomNumberForShipLoss) public {
        uint256[] storage chanceArray = battleIdToAttackerChanceArray[battleId];
        uint256[] storage typeArray = battleIdToAttackerTypeArray[battleId];
        uint256 cumulativeValue = battleIdToAttackerCumulativeSumOdds[battleId];
        uint256 randomNumber = (randomNumberForShipLoss % cumulativeValue);
        for(uint i; i < chanceArray.length; i++) {
            if(randomNumber <= chanceArray[i]) {
                uint256 shipType = typeArray[i];
                uint256 amountToDecrease = getAmountToDecrease(shipType);
                if(chanceArray[i] <= randomNumber) {
                    chanceArray[i] = chanceArray[i] - amountToDecrease;
                }
            }
        }
    }

    function generateLossForAttacker(uint256 battleId, uint256 randomNumber) public {

    }

    function getAmountToDecrease(uint256 shipType) internal view returns (uint256) {
        uint256 amountToDecrease;
        if (shipType == 1) {
            amountToDecrease = 15;
        } else if (shipType == 2) {
            amountToDecrease = 13;
        } else if (shipType == 3) {
            amountToDecrease = 11;
        } else if (shipType == 4) {
            amountToDecrease = 10;
        } else if (shipType == 5) {
            amountToDecrease = 8;
        } else if (shipType == 6) {
            amountToDecrease = 5;
        } else if (shipType == 7) {
            amountToDecrease = 4;
        } else if (shipType == 8) {
            amountToDecrease = 1;
        }
        return amountToDecrease;
    }
}
