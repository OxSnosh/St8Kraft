//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./CountryMinter.sol";
import "./Navy.sol";
import "./War.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract NavalBlockadeContract is Ownable, VRFConsumerBaseV2 {
    uint256 public blockadeId;
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
        bool blockadeActive;
    }

    mapping(uint256 => Blockade) public blockadeIdToBlockade;
    mapping(uint256 => uint256[]) public idToActiveBlockadesAgainst;
    mapping(uint256 => uint256[]) public idToActiveBlockadesFor;
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
        uint256 activeBlockadesAgainstCount = idToActiveBlockadesAgainst[attackerId]
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
            0,
            true
        );
        blockadeIdToBlockade[blockadeId] = newBlockade;
        //need keeper to increment blockade days
        fulfillRequest(blockadeId);
        uint256[] storage newActiveBlockadesAgainst = idToActiveBlockadesAgainst[defenderId];
        newActiveBlockadesAgainst.push(blockadeId);
        idToActiveBlockadesAgainst[defenderId] = newActiveBlockadesAgainst;
        uint256[] storage newActiveBlockadesFor = idToActiveBlockadesFor[attackerId];
        newActiveBlockadesFor.push(blockadeId);
        idToActiveBlockadesFor[attackerId] = newActiveBlockadesFor;
        blockadeId++;
    }

    function checkIfAttackerAlreadyBlockaded(
        uint256 attackerId,
        uint256 defenderId
    ) internal view returns (bool) {
        uint256[] memory activeBlockadeArray = idToActiveBlockadesAgainst[defenderId];
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

    function getActiveBlockadesAgainst(uint256 countryId)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory activeBlockadesToReturn = idToActiveBlockadesAgainst[
            countryId
        ];
        return (activeBlockadesToReturn);
    }

    function checkIfBlockadeCapable(uint256 countryId) public {
        uint256 blockadeCapableShips = nav.getBlockadeCapableShips(countryId);
        if(blockadeCapableShips == 0) {
            uint256[] storage blockadesFor = idToActiveBlockadesFor[countryId];
            for(uint i = 0; i < blockadesFor.length; i++) {
                blockadeId = blockadesFor[i];
                blockadeIdToBlockade[blockadeId].blockadeActive = false;
                uint256 blockadedCountry = blockadeIdToBlockade[blockadeId].blockadedId;
                uint256[] storage blockadesAgainst = idToActiveBlockadesAgainst[blockadedCountry];
                for(uint j = 0; j < blockadesAgainst.length; j++) {
                    if (blockadesAgainst[j] == blockadeId) {
                        blockadesAgainst[j] = blockadesAgainst[j] - 1;
                        delete blockadesAgainst[i];
                        blockadesAgainst.pop();
                    }
                }
                delete blockadesFor[i];

            }
        }
    }
}

contract BreakBlocadeContract is Ownable, VRFConsumerBaseV2 {
    uint256 public breakBlockadeId;
    address public countryMinter;
    address public navalBlockade;
    address public navy;
    address public warAddress;
    uint256 battleshipStrength = 5;
    uint256 cruiserStrength = 6;
    uint256 frigateStrength = 8;
    uint256 destroyerStrength = 11;
    uint256 submarineStrength = 12;
    uint256 battleshipTargetSize = 11;
    uint256 cruiserTargetSize = 10;
    uint256 frigateTargetSize = 8;
    uint256 destroyerTargetSize = 5;
    uint256 submarineTargetSize = 4;

    //Chainlik Variables
    uint256[] private s_randomWords;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 9;

    CountryMinter mint;
    NavalBlockadeContract navBlock;
    NavyContract nav;
    WarContract war;

    struct BreakBlockade {
        uint256 battleshipCount;
        uint256 cruiserCount;
        uint256 frigateCount;
        uint256 destroyerCount;
        uint256 breakerStrength;
        uint256 warId;
        uint256 breakerId;
    }

    struct DefendBlockade {
        uint256 battleshipCount;
        uint256 cruiserCount;
        uint256 frigateCount;
        uint256 submarineCount;
        uint256 defenderStrength;
        uint256 warId;
        uint256 defenderId;
    }

    mapping(uint256 => BreakBlockade) breakBlockadeIdToBreakBlockade;
    mapping(uint256 => DefendBlockade) breakBlockadeIdToDefendBlockade;
    mapping(uint256 => uint256[]) battleIdToBreakBlockadeChanceArray;
    mapping(uint256 => uint256[]) battleIdToBreakBlockadeTypeArray;
    mapping(uint256 => uint256) battleIdToBreakBlockadeCumulativeSumOdds;
    mapping(uint256 => uint256[]) battleIdToBreakBlockadeLosses;
    mapping(uint256 => uint256[]) battleIdToDefendBlockadeChanceArray;
    mapping(uint256 => uint256[]) battleIdToDefendBlockadeTypeArray;
    mapping(uint256 => uint256) battleIdToDefendBlockadeCumulativeSumOdds;
    mapping(uint256 => uint256[]) battleIdToDefendBlockadeLosses;
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;

    constructor(
        address _countryMinter,
        address _navalBlockade,
        address _navy,
        address _warAddress,
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        navalBlockade = _navalBlockade;
        navBlock = NavalBlockadeContract(_navalBlockade);
        navy = _navy;
        nav = NavyContract(_navy);
        warAddress = _warAddress;
        war = WarContract(_warAddress);
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function breakBlockade(uint256 warId, uint256 attackerId, uint256 blockaderId) public {
        bool isOwner = mint.checkOwnership(attackerId, msg.sender);
        require(isOwner, "caller not nation owner");
        uint256[] memory attackerBlockades = navBlock.getActiveBlockadesAgainst(
            attackerId
        );
        bool isBlockader = false;
        for (uint256 i; i < attackerBlockades.length; i++) {
            if (attackerBlockades[i] == blockaderId) {
                isBlockader = true;
            } else {
                isBlockader = false;
            }
        }
        require(isBlockader, "!blockaded by this nation");
        generateBreakBlockadeStruct(warId, attackerId, breakBlockadeId);
        generateDefendBlockadeStruct(warId, blockaderId, breakBlockadeId);
        generateBreakBlockadeChanceArray(breakBlockadeId);
        generateDefendBlockadeChanceArray(breakBlockadeId);
        fulfillRequest(breakBlockadeId);
        breakBlockadeId++;
    }

    function generateBreakBlockadeStruct(
        uint256 warId,
        uint256 attackerId,
        uint256 breakBlockId
    ) internal {
        uint256 battleships = nav.getBattleshipCount(attackerId);
        uint256 cruisers = nav.getCruiserCount(attackerId);
        uint256 frigates = nav.getFrigateCount(attackerId);
        uint256 destroyers = nav.getDestroyerCount(attackerId);
        uint256 breakerStrength = getBreakerStrength(attackerId);
        BreakBlockade memory newBreakBlockade = BreakBlockade(
            battleships,
            cruisers,
            frigates,
            destroyers,
            breakerStrength,
            warId,
            attackerId
        );
        breakBlockadeIdToBreakBlockade[breakBlockId] = newBreakBlockade;
    }

    function generateDefendBlockadeStruct(
        uint256 warId,
        uint256 defenderId,
        uint256 breakBlockId
    ) internal {
        uint256 battleships = nav.getBattleshipCount(defenderId);
        uint256 cruisers = nav.getCruiserCount(defenderId);
        uint256 frigates = nav.getFrigateCount(defenderId);
        uint256 submarines = nav.getSubmarineCount(defenderId);
        uint256 defenderStrength = getDefenderStrength(defenderId);
        DefendBlockade memory newDefendBlockade = DefendBlockade(
            battleships,
            cruisers,
            frigates,
            submarines,
            defenderStrength,
            warId,
            defenderId
        );
        breakBlockadeIdToDefendBlockade[breakBlockId] = newDefendBlockade;
    }

        function generateBreakBlockadeChanceArray(uint256 breakBlockId) internal {
        uint256[] storage chances = battleIdToBreakBlockadeChanceArray[breakBlockId];
        uint256[] storage types = battleIdToBreakBlockadeTypeArray[breakBlockId];
        uint256 cumulativeSum;
        //battleship
        if (breakBlockadeIdToBreakBlockade[breakBlockId].battleshipCount > 0) {
            uint256 battleshipOdds = (breakBlockadeIdToBreakBlockade[breakBlockId]
                .battleshipCount * battleshipTargetSize);
            uint256 battleshipOddsToPush = (battleshipOdds + cumulativeSum);
            chances.push(battleshipOddsToPush);
            types.push(3);
            cumulativeSum = battleshipOddsToPush;
        }
        //cruiser
        if (breakBlockadeIdToDefendBlockade[breakBlockId].cruiserCount > 0) {
            uint256 cruiserOdds = (breakBlockadeIdToDefendBlockade[breakBlockId].cruiserCount *
                cruiserTargetSize);
            uint256 cruiserOddsToPush = (cruiserOdds + cumulativeSum);
            chances.push(cruiserOddsToPush);
            types.push(4);
            cumulativeSum = cruiserOddsToPush;
        }
        //frigate
        if (breakBlockadeIdToBreakBlockade[breakBlockId].frigateCount > 0) {
            uint256 frigateOdds = (breakBlockadeIdToBreakBlockade[breakBlockId].frigateCount *
                frigateTargetSize);
            uint256 frigateOddsToPush = (frigateOdds + cumulativeSum);
            chances.push(frigateOddsToPush);
            types.push(5);
            cumulativeSum = frigateOddsToPush;
        }
        //destroyer
        if (breakBlockadeIdToBreakBlockade[breakBlockId].destroyerCount > 0) {
            uint256 destroyerOdds = (breakBlockadeIdToBreakBlockade[breakBlockId].destroyerCount *
                destroyerTargetSize);
            uint256 destroyerOddsToPush = (destroyerOdds + cumulativeSum);
            chances.push(destroyerOddsToPush);
            types.push(6);
            cumulativeSum = destroyerOddsToPush;
        }
        battleIdToBreakBlockadeChanceArray[breakBlockId] = chances;
        battleIdToBreakBlockadeTypeArray[breakBlockId] = types;
        battleIdToBreakBlockadeCumulativeSumOdds[breakBlockId] = cumulativeSum;
    }

    function generateDefendBlockadeChanceArray(uint256 breakBlockId) internal {
        uint256[] storage chances = battleIdToDefendBlockadeChanceArray[breakBlockId];
        uint256[] storage types = battleIdToDefendBlockadeTypeArray[breakBlockId];
        uint256 cumulativeSum;
        //battleship
        if (breakBlockadeIdToDefendBlockade[breakBlockId].battleshipCount > 0) {
            uint256 battleshipOdds = (breakBlockadeIdToDefendBlockade[breakBlockId]
                .battleshipCount * battleshipTargetSize);
            uint256 battleshipOddsToPush = (battleshipOdds + cumulativeSum);
            chances.push(battleshipOddsToPush);
            types.push(3);
            cumulativeSum = battleshipOddsToPush;
        }
        //cruiser
        if (breakBlockadeIdToDefendBlockade[breakBlockId].cruiserCount > 0) {
            uint256 cruiserOdds = (breakBlockadeIdToDefendBlockade[breakBlockId].cruiserCount *
                cruiserTargetSize);
            uint256 cruiserOddsToPush = (cruiserOdds + cumulativeSum);
            chances.push(cruiserOddsToPush);
            types.push(4);
            cumulativeSum = cruiserOddsToPush;
        }
        //frigate
        if (breakBlockadeIdToDefendBlockade[breakBlockId].frigateCount > 0) {
            uint256 frigateOdds = (breakBlockadeIdToDefendBlockade[breakBlockId].frigateCount *
                frigateTargetSize);
            uint256 frigateOddsToPush = (frigateOdds + cumulativeSum);
            chances.push(frigateOddsToPush);
            types.push(5);
            cumulativeSum = frigateOddsToPush;
        }
        //submarine
        if (breakBlockadeIdToDefendBlockade[breakBlockId].submarineCount > 0) {
            uint256 destroyerOdds = (breakBlockadeIdToDefendBlockade[breakBlockId].submarineCount *
                destroyerTargetSize);
            uint256 destroyerOddsToPush = (destroyerOdds + cumulativeSum);
            chances.push(destroyerOddsToPush);
            types.push(6);
            cumulativeSum = destroyerOddsToPush;
        }
        battleIdToDefendBlockadeChanceArray[breakBlockId] = chances;
        battleIdToDefendBlockadeTypeArray[breakBlockId] = types;
        battleIdToDefendBlockadeCumulativeSumOdds[breakBlockId] = cumulativeSum;
    }

    function getBreakerStrength(uint256 battleId)
        public
        view
        returns (uint256)
    {
        uint256 _battleshipStrength = breakBlockadeIdToBreakBlockade[battleId]
            .battleshipCount * battleshipStrength;
        uint256 _cruiserStrength = breakBlockadeIdToBreakBlockade[battleId].cruiserCount *
            cruiserStrength;
        uint256 _frigateStrength = breakBlockadeIdToBreakBlockade[battleId].frigateCount *
            frigateStrength;
        uint256 _destroyerStrength = breakBlockadeIdToBreakBlockade[battleId].destroyerCount *
            destroyerStrength;
        uint256 strength = (
            _battleshipStrength +
            _cruiserStrength +
            _frigateStrength +
            _destroyerStrength
        );
        return strength;
    }

    function getDefenderStrength(uint256 battleId)
        public
        view
        returns (uint256)
    {
        uint256 _battleshipStrength = breakBlockadeIdToDefendBlockade[battleId]
            .battleshipCount * battleshipStrength;
        uint256 _cruiserStrength = breakBlockadeIdToDefendBlockade[battleId].cruiserCount *
            cruiserStrength;
        uint256 _frigateStrength = breakBlockadeIdToDefendBlockade[battleId].frigateCount *
            frigateStrength;
        uint256 _submarineStrength = breakBlockadeIdToDefendBlockade[battleId].submarineCount *
            submarineStrength;
        uint256 strength = (
            _battleshipStrength +
            _cruiserStrength +
            _frigateStrength +
            _submarineStrength
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
        uint256 breakerStartingStrength = breakBlockadeIdToBreakBlockade[requestNumber]
            .breakerStrength;
        uint256 defenderStartingStrength = breakBlockadeIdToDefendBlockade[requestNumber]
            .defenderStrength;
        uint256 totalStrength = (breakerStartingStrength +
            defenderStartingStrength);
        for (uint256 i = 1; i < losses + 1; i++) {
            uint256 randomNumberForTeamSelection = (s_randomWords[i] %
                totalStrength);
            uint256 randomNumnerForShipSelection = s_randomWords[i + 8];
            if (randomNumberForTeamSelection <= breakerStartingStrength) {
                generateLossForDefender(
                    requestNumber,
                    randomNumnerForShipSelection
                );
            } else {
                generateLossForBreaker(
                    requestNumber,
                    randomNumnerForShipSelection
                );
            }
        }
        uint256[] memory breakerLosses = battleIdToBreakBlockadeLosses[
            requestNumber
        ];
        uint256[] memory defenderLosses = battleIdToDefendBlockadeLosses[
            requestNumber
        ];
        uint256 defenderId = breakBlockadeIdToDefendBlockade[requestNumber].defenderId;
        uint256 breakerId = breakBlockadeIdToBreakBlockade[requestNumber].breakerId;
        nav.decrementLosses(
            defenderLosses,
            defenderId,
            breakerLosses,
            breakerId
        );
        uint256 warId = breakBlockadeIdToBreakBlockade[requestNumber].warId;
        war.addNavyCasualties(warId, breakerId, breakerLosses.length);
        war.addNavyCasualties(warId, defenderId, defenderLosses.length);
        navBlock.checkIfBlockadeCapable(defenderId);
    }

    function getLosses(uint256 battleId, uint256 numberBetweenZeroAndTwo)
        public
        view
        returns (uint256)
    {
        uint256 breakerId = breakBlockadeIdToBreakBlockade[battleId].breakerId;
        uint256 breakerCount = getBreakerShipCount(breakerId);
        uint256 defenderId = breakBlockadeIdToDefendBlockade[battleId].defenderId;
        uint256 defenderCount = getDefenderShipCount(defenderId);
        uint256 totalShips = (breakerCount + defenderCount);
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

    function getBreakerShipCount(uint256 countryId) internal view returns (uint256) {

        uint256 battleshipCount = nav.getBattleshipCount(countryId);
        uint256 cruiserCount = nav.getCruiserCount(countryId);
        uint256 frigateCount = nav.getFrigateCount(countryId);
        uint256 destroyerCount = nav.getDestroyerCount(countryId);
        uint256 count = (
            battleshipCount +
            cruiserCount +
            frigateCount +
            destroyerCount);
        return count;
    }

    function getDefenderShipCount(uint256 countryId) internal view returns (uint256) {
        uint256 battleshipCount = nav.getBattleshipCount(countryId);
        uint256 cruiserCount = nav.getCruiserCount(countryId);
        uint256 frigateCount = nav.getFrigateCount(countryId);
        uint256 submarineCount = nav.getSubmarineCount(countryId);
        uint256 count = (
            battleshipCount +
            cruiserCount +
            frigateCount +
            submarineCount);
        return count;
    }

    function generateLossForDefender(
        uint256 battleId,
        uint256 randomNumberForShipLoss
    ) public {
        uint256[] storage chanceArray = battleIdToDefendBlockadeChanceArray[battleId];
        uint256[] storage typeArray = battleIdToDefendBlockadeTypeArray[battleId];
        uint256 cumulativeValue = battleIdToDefendBlockadeCumulativeSumOdds[battleId];
        uint256 randomNumber = (randomNumberForShipLoss % cumulativeValue);
        uint256 shipType;
        uint256 amountToDecrease;
        uint256 j;
        for (uint256 i; i < chanceArray.length; i++) {
            if (randomNumber <= chanceArray[i]) {
                shipType = typeArray[i];
                amountToDecrease = getAmountToDecrease(shipType);
                j = i;
                break;
            }
        }
        for (j; j < chanceArray.length; j++) {
            if (chanceArray[j] >= randomNumber) {
                chanceArray[j] -= amountToDecrease;
            }
        }
        battleIdToDefendBlockadeCumulativeSumOdds[battleId] -= amountToDecrease;
        uint256[] storage defenderLosses = battleIdToDefendBlockadeLosses[battleId];
        defenderLosses.push(shipType);
    }

    function generateLossForBreaker(
        uint256 battleId,
        uint256 randomNumberForShipLoss
    ) public {
        uint256[] storage chanceArray = battleIdToBreakBlockadeChanceArray[battleId];
        uint256[] storage typeArray = battleIdToBreakBlockadeTypeArray[battleId];
        uint256 cumulativeValue = battleIdToBreakBlockadeCumulativeSumOdds[battleId];
        uint256 randomNumber = (randomNumberForShipLoss % cumulativeValue);
        uint256 shipType;
        uint256 amountToDecrease;
        bool ranAlready = false;
        if (ranAlready == false) {
            for (uint256 i; i < chanceArray.length; i++) {
                if (randomNumber <= chanceArray[i]) {
                    shipType = typeArray[i];
                    amountToDecrease = getAmountToDecrease(shipType);
                }
                uint256 j = i;
                for (j; j < chanceArray.length; j++) {
                    if (chanceArray[j] >= randomNumber) {
                        chanceArray[j] -= amountToDecrease;
                    }
                    ranAlready = true;
                }
            }
        }
        battleIdToBreakBlockadeCumulativeSumOdds[battleId] -= amountToDecrease;
        uint256[] storage defenderLosses = battleIdToBreakBlockadeLosses[battleId];
        defenderLosses.push(shipType);
    }

    function getAmountToDecrease(uint256 shipType)
        internal
        pure
        returns (uint256)
    {
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

contract NavalAttackContract is Ownable, VRFConsumerBaseV2 {
    address public navy;
    uint256 public navyBattleId;
    address public navyBlockade;
    address public warAddress;
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
    uint32 private constant NUM_WORDS = 17;

    NavyContract nav;
    NavalBlockadeContract navBlock;
    WarContract war;

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
        uint256 warId;
        uint256 countryId;
    }

    mapping(uint256 => NavyForces) idToAttackerNavy;
    mapping(uint256 => NavyForces) idToDefenderNavy;
    mapping(uint256 => uint256[]) battleIdToAttackerChanceArray;
    mapping(uint256 => uint256[]) battleIdToAttackerTypeArray;
    mapping(uint256 => uint256) battleIdToAttackerCumulativeSumOdds;
    mapping(uint256 => uint256[]) battleIdToAttackerLosses;
    mapping(uint256 => uint256[]) battleIdToDefenderChanceArray;
    mapping(uint256 => uint256[]) battleIdToDefenderTypeArray;
    mapping(uint256 => uint256) battleIdToDefenderCumulativeSumOdds;
    mapping(uint256 => uint256[]) battleIdToDefenderLosses;
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;

    constructor(
        address _navy,
        address _war,
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        navy = _navy;
        nav = NavyContract(_navy);
        warAddress = _war;
        war = WarContract(_war);
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function updateNavyContract(address newAddress) public onlyOwner {
        navy = newAddress;
        nav = NavyContract(newAddress);
    }

    function updateWarContract(address newAddress) public onlyOwner {
        warAddress = newAddress;
        war = WarContract(newAddress);
    }

    function navalAttack(uint256 warId, uint256 attackerId, uint256 defenderId) public {
        bool isActiveWar = war.isWarActive(warId);
        require(isActiveWar, "!not active war");
        (uint256 warOffense, uint256 warDefense) = war.getInvolvedParties(warId);
        require(warOffense == attackerId || warOffense == defenderId, "invalid parameters");
        require(warDefense == attackerId || warDefense == defenderId, "invalid parameters");
        generateAttackerNavyStruct(warId, navyBattleId, attackerId);
        generateDefenderNavyStruct(warId, navyBattleId, defenderId);
        generateAttackerChanceArray(navyBattleId);
        generateDefenderChanceArray(navyBattleId);
        fulfillRequest(navyBattleId);
        navyBattleId++;
    }

    function generateAttackerNavyStruct(uint256 warId, uint256 battleId, uint256 countryId)
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
            warId,
            countryId
        );
        idToAttackerNavy[battleId] = newNavyForces;
    }

    function generateDefenderNavyStruct(uint256 warId, uint256 attackId, uint256 countryId)
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
            warId,
            countryId
        );
        idToDefenderNavy[attackId] = newNavyForces;
    }

    function generateAttackerChanceArray(uint256 battleId) internal {
        uint256[] storage chances = battleIdToAttackerChanceArray[battleId];
        uint256[] storage types = battleIdToAttackerTypeArray[battleId];
        uint256 cumulativeSum;
        //corvette
        if (idToAttackerNavy[battleId].corvetteCount > 0) {
            uint256 corvetteOdds = (idToAttackerNavy[battleId].corvetteCount *
                corvetteTargetSize);
            chances.push(corvetteOdds);
            types.push(1);
            cumulativeSum = corvetteOdds;
        }
        //landing ship
        if (idToAttackerNavy[battleId].landingShipCount > 0) {
            uint256 landingShipOdds = (idToAttackerNavy[battleId]
                .landingShipCount * landingShipTargetSize);
            uint256 landingShipOddsToPush = (landingShipOdds + cumulativeSum);
            chances.push(landingShipOddsToPush);
            types.push(2);
            cumulativeSum = landingShipOddsToPush;
        }
        //battleship
        if (idToAttackerNavy[battleId].battleshipCount > 0) {
            uint256 battleshipOdds = (idToAttackerNavy[battleId]
                .battleshipCount * battleshipTargetSize);
            uint256 battleshipOddsToPush = (battleshipOdds + cumulativeSum);
            chances.push(battleshipOddsToPush);
            types.push(3);
            cumulativeSum = battleshipOddsToPush;
        }
        //cruiser
        if (idToAttackerNavy[battleId].cruiserCount > 0) {
            uint256 cruiserOdds = (idToAttackerNavy[battleId].cruiserCount *
                cruiserTargetSize);
            uint256 cruiserOddsToPush = (cruiserOdds + cumulativeSum);
            chances.push(cruiserOddsToPush);
            types.push(4);
            cumulativeSum = cruiserOddsToPush;
        }
        //frigate
        if (idToAttackerNavy[battleId].frigateCount > 0) {
            uint256 frigateOdds = (idToAttackerNavy[battleId].frigateCount *
                frigateTargetSize);
            uint256 frigateOddsToPush = (frigateOdds + cumulativeSum);
            chances.push(frigateOddsToPush);
            types.push(5);
            cumulativeSum = frigateOddsToPush;
        }
        //destroyer
        if (idToAttackerNavy[battleId].destroyerCount > 0) {
            uint256 destroyerOdds = (idToAttackerNavy[battleId].destroyerCount *
                destroyerTargetSize);
            uint256 destroyerOddsToPush = (destroyerOdds + cumulativeSum);
            chances.push(destroyerOddsToPush);
            types.push(6);
            cumulativeSum = destroyerOddsToPush;
        }
        //submarine
        if (idToAttackerNavy[battleId].submarineCount > 0) {
            uint256 submarineOdds = (idToAttackerNavy[battleId].submarineCount *
                submarineTargetSize);
            uint256 submarineOddsToPush = (submarineOdds + cumulativeSum);
            chances.push(submarineOddsToPush);
            types.push(7);
            cumulativeSum = submarineOddsToPush;
        }
        //aircraft carrier
        if (idToAttackerNavy[battleId].aircraftCarrierCount > 0) {
            uint256 aircraftCarrierOdds = (idToAttackerNavy[battleId]
                .aircraftCarrierCount * aircraftCarrierTargetSize);
            uint256 aircraftCarrierOddsToPush = (aircraftCarrierOdds +
                cumulativeSum);
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
        if (idToDefenderNavy[battleId].corvetteCount > 0) {
            uint256 corvetteOdds = (idToDefenderNavy[battleId].corvetteCount *
                corvetteTargetSize);
            chances.push(corvetteOdds);
            types.push(1);
            cumulativeSum += corvetteOdds;
        }
        //landing ship
        if (idToDefenderNavy[battleId].landingShipCount > 0) {
            uint256 landingShipOdds = (idToDefenderNavy[battleId]
                .landingShipCount * landingShipTargetSize);
            uint256 landingShipOddsToPush = (landingShipOdds + cumulativeSum);
            chances.push(landingShipOddsToPush);
            types.push(2);
            cumulativeSum = landingShipOddsToPush;
        }
        //battleship
        if (idToDefenderNavy[battleId].battleshipCount > 0) {
            uint256 battleshipOdds = (idToDefenderNavy[battleId]
                .battleshipCount * battleshipTargetSize);
            uint256 battleshipOddsToPush = (battleshipOdds + cumulativeSum);
            chances.push(battleshipOddsToPush);
            types.push(3);
            cumulativeSum = battleshipOddsToPush;
        }
        //cruiser
        if (idToDefenderNavy[battleId].cruiserCount > 0) {
            uint256 cruiserOdds = (idToDefenderNavy[battleId].cruiserCount *
                cruiserTargetSize);
            uint256 cruiserOddsToPush = (cruiserOdds + cumulativeSum);
            chances.push(cruiserOddsToPush);
            types.push(4);
            cumulativeSum = cruiserOddsToPush;
        }
        //frigate
        if (idToDefenderNavy[battleId].frigateCount > 0) {
            uint256 frigateOdds = (idToDefenderNavy[battleId].frigateCount *
                frigateTargetSize);
            uint256 frigateOddsToPush = (frigateOdds + cumulativeSum);
            chances.push(frigateOddsToPush);
            types.push(5);
            cumulativeSum = frigateOddsToPush;
        }
        //destroyer
        if (idToDefenderNavy[battleId].destroyerCount > 0) {
            uint256 destroyerOdds = (idToDefenderNavy[battleId].destroyerCount *
                destroyerTargetSize);
            uint256 destroyerOddsToPush = (destroyerOdds + cumulativeSum);
            chances.push(destroyerOddsToPush);
            types.push(6);
            cumulativeSum = destroyerOddsToPush;
        }
        //submarine
        if (idToDefenderNavy[battleId].submarineCount > 0) {
            uint256 submarineOdds = (idToDefenderNavy[battleId].submarineCount *
                submarineTargetSize);
            uint256 submarineOddsToPush = (submarineOdds + cumulativeSum);
            chances.push(submarineOddsToPush);
            types.push(7);
            cumulativeSum = submarineOddsToPush;
        }
        //aircraft carrier
        if (idToDefenderNavy[battleId].aircraftCarrierCount > 0) {
            uint256 aircraftCarrierOdds = (idToDefenderNavy[battleId]
                .aircraftCarrierCount * aircraftCarrierTargetSize);
            uint256 aircraftCarrierOddsToPush = (aircraftCarrierOdds +
                cumulativeSum);
            chances.push(aircraftCarrierOddsToPush);
            types.push(8);
            cumulativeSum = aircraftCarrierOddsToPush;
        }
        battleIdToDefenderChanceArray[battleId] = chances;
        battleIdToDefenderTypeArray[battleId] = types;
        battleIdToDefenderCumulativeSumOdds[battleId] = cumulativeSum;
    }

    function getAttackerStrength(uint256 battleId)
        public
        view
        returns (uint256)
    {
        uint256 _corvetteStrength = idToAttackerNavy[battleId].corvetteCount *
            corvetteStrength;
        uint256 _landingShipStrength = idToAttackerNavy[battleId]
            .landingShipCount * landingShipStrength;
        uint256 _battleshipStrength = idToAttackerNavy[battleId]
            .battleshipCount * battleshipStrength;
        uint256 _cruiserStrength = idToAttackerNavy[battleId].cruiserCount *
            cruiserStrength;
        uint256 _frigateStrength = idToAttackerNavy[battleId].frigateCount *
            frigateStrength;
        uint256 _destroyerStrength = idToAttackerNavy[battleId].destroyerCount *
            destroyerStrength;
        uint256 _submarineStrength = idToAttackerNavy[battleId].submarineCount *
            submarineStrength;
        uint256 _aircraftCarrierStrength = idToAttackerNavy[battleId]
            .aircraftCarrierCount * aircraftCarrierStrength;
        uint256 strength = (_corvetteStrength +
            _landingShipStrength +
            _battleshipStrength +
            _cruiserStrength +
            _frigateStrength +
            _destroyerStrength +
            _submarineStrength +
            _aircraftCarrierStrength);
        return strength;
    }

    function getDefenderStrength(uint256 battleId)
        public
        view
        returns (uint256)
    {
        uint256 _corvetteStrength = idToDefenderNavy[battleId].corvetteCount *
            corvetteStrength;
        uint256 _landingShipStrength = idToDefenderNavy[battleId]
            .landingShipCount * landingShipStrength;
        uint256 _battleshipStrength = idToDefenderNavy[battleId]
            .battleshipCount * battleshipStrength;
        uint256 _cruiserStrength = idToDefenderNavy[battleId].cruiserCount *
            cruiserStrength;
        uint256 _frigateStrength = idToDefenderNavy[battleId].frigateCount *
            frigateStrength;
        uint256 _destroyerStrength = idToDefenderNavy[battleId].destroyerCount *
            destroyerStrength;
        uint256 _submarineStrength = idToDefenderNavy[battleId].submarineCount *
            submarineStrength;
        uint256 _aircraftCarrierStrength = idToDefenderNavy[battleId]
            .aircraftCarrierCount * aircraftCarrierStrength;
        uint256 strength = (_corvetteStrength +
            _landingShipStrength +
            _battleshipStrength +
            _cruiserStrength +
            _frigateStrength +
            _destroyerStrength +
            _submarineStrength +
            _aircraftCarrierStrength);
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
        uint256 attackerStartingStrength = idToAttackerNavy[requestNumber]
            .startingStrength;
        uint256 defenderStartingStrength = idToDefenderNavy[requestNumber]
            .startingStrength;
        uint256 totalStrength = (attackerStartingStrength +
            defenderStartingStrength);
        for (uint256 i = 1; i < losses + 1; i++) {
            uint256 randomNumberForTeamSelection = (s_randomWords[i] %
                totalStrength);
            uint256 randomNumnerForShipSelection = s_randomWords[i + 8];
            if (randomNumberForTeamSelection <= attackerStartingStrength) {
                generateLossForDefender(
                    requestNumber,
                    randomNumnerForShipSelection
                );
            } else {
                generateLossForAttacker(
                    requestNumber,
                    randomNumnerForShipSelection
                );
            }
        }
        uint256[] memory defenderLosses = battleIdToDefenderLosses[
            requestNumber
        ];
        uint256[] memory attackerLosses = battleIdToAttackerLosses[
            requestNumber
        ];
        uint256 defenderId = idToDefenderNavy[requestNumber].countryId;
        uint256 attackerId = idToAttackerNavy[requestNumber].countryId;
        nav.decrementLosses(
            defenderLosses,
            defenderId,
            attackerLosses,
            attackerId
        );
        uint256 warId = idToAttackerNavy[requestNumber].warId;
        war.addNavyCasualties(warId, defenderId, defenderLosses.length);
        war.addNavyCasualties(warId, attackerId, attackerLosses.length);
        navBlock.checkIfBlockadeCapable(defenderId);
    }

    function getLosses(uint256 battleId, uint256 numberBetweenZeroAndTwo)
        public
        view
        returns (uint256)
    {
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
        uint256 count = (corvetteCount +
            landingShipCount +
            battleshipCount +
            cruiserCount +
            frigateCount +
            destroyerCount +
            submarineCount +
            aircraftCarrierCount);
        return count;
    }

    function generateLossForDefender(
        uint256 battleId,
        uint256 randomNumberForShipLoss
    ) public {
        uint256[] storage chanceArray = battleIdToDefenderChanceArray[battleId];
        uint256[] storage typeArray = battleIdToDefenderTypeArray[battleId];
        uint256 cumulativeValue = battleIdToDefenderCumulativeSumOdds[battleId];
        uint256 randomNumber = (randomNumberForShipLoss % cumulativeValue);
        uint256 shipType;
        uint256 amountToDecrease;
        uint256 j;
        for (uint256 i; i < chanceArray.length; i++) {
            if (randomNumber <= chanceArray[i]) {
                shipType = typeArray[i];
                amountToDecrease = getAmountToDecrease(shipType);
                j = i;
                break;
            }
        }
        for (j; j < chanceArray.length; j++) {
            if (chanceArray[j] >= randomNumber) {
                chanceArray[j] -= amountToDecrease;
            }
        }
        battleIdToDefenderCumulativeSumOdds[battleId] -= amountToDecrease;
        uint256[] storage defenderLosses = battleIdToDefenderLosses[battleId];
        defenderLosses.push(shipType);
    }

    function generateLossForAttacker(
        uint256 battleId,
        uint256 randomNumberForShipLoss
    ) public {
        uint256[] storage chanceArray = battleIdToAttackerChanceArray[battleId];
        uint256[] storage typeArray = battleIdToAttackerTypeArray[battleId];
        uint256 cumulativeValue = battleIdToAttackerCumulativeSumOdds[battleId];
        uint256 randomNumber = (randomNumberForShipLoss % cumulativeValue);
        uint256 shipType;
        uint256 amountToDecrease;
        bool ranAlready = false;
        if (ranAlready == false) {
            for (uint256 i; i < chanceArray.length; i++) {
                if (randomNumber <= chanceArray[i]) {
                    shipType = typeArray[i];
                    amountToDecrease = getAmountToDecrease(shipType);
                }
                uint256 j = i;
                for (j; j < chanceArray.length; j++) {
                    if (chanceArray[j] >= randomNumber) {
                        chanceArray[j] -= amountToDecrease;
                    }
                    ranAlready = true;
                }
            }
        }
        battleIdToAttackerCumulativeSumOdds[battleId] -= amountToDecrease;
        uint256[] storage defenderLosses = battleIdToAttackerLosses[battleId];
        defenderLosses.push(shipType);
    }

    function getAmountToDecrease(uint256 shipType)
        internal
        pure
        returns (uint256)
    {
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
