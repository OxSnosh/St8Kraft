//SPDX-License-Identifier: Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International
pragma solidity 0.8.17;

import "./CountryMinter.sol";
import "./Navy.sol";
import "./War.sol";
import "./Improvements.sol";
import "./War.sol";
import "./KeeperFile.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "hardhat/console.sol";

///@title NavalBlocadeContract
///@author OxSnosh
///@dev this contract inherits from the openzeppelin ownable contract
///@dev this contract inherits from the chainlink VRF contract
contract NavalBlockadeContract is Ownable, VRFConsumerBaseV2 {
    uint256 public blockadeId;
    address public navy;
    address public additionalNavy;
    address public navalAction;
    address public warContract;
    address public countryMinter;
    address public keeper;
    address public breakBlockadeAddress;

    //Chainlik Variables
    uint256[] private s_randomWords;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    WarContract war;
    CountryMinter mint;
    NavyContract nav;
    NavalActionsContract navAct;
    AdditionalNavyContract addNav;
    KeeperContract keep;

    struct Blockade {
        uint256 blockadeId;
        uint256 blockaderId;
        uint256 blockadedId;
        uint256 blockadePercentageReduction;
        uint256 blockadeDay;
        bool blockadeActive;
    }

    mapping(uint256 => Blockade) public blockadeIdToBlockade;
    // mapping(uint256 => uint256[]) public idDefenderToIdAttackerToActiveBlockadesAgainst;
    // mapping(uint256 => uint256[]) public idAttackerToIdDefenderToActiveBlockadesFor;
    mapping(uint256 => uint256[]) public idToActiveBlockadesFor;
    mapping(uint256 => uint256[]) public idToActiveBlockadesAgainst;
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;

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
        address _navy,
        address _additionalNavy,
        address _navalAction,
        address _war,
        address _countryMinter,
        address _keeper,
        address _breakBlockadeAddress
    ) public onlyOwner {
        navy = _navy;
        nav = NavyContract(_navy);
        additionalNavy = _additionalNavy;
        addNav = AdditionalNavyContract(_additionalNavy);
        navalAction = _navalAction;
        navAct = NavalActionsContract(_navalAction);
        warContract = _war;
        war = WarContract(_war);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        keeper = _keeper;
        keep = KeeperContract(_keeper);
        breakBlockadeAddress = _breakBlockadeAddress;
    }

    ///@dev this is a public function callable only from the nation owner
    ///@dev this function allows a nation to blockade another nation they are at war with
    ///@notice this function allows a nation to blockade another nation they are at war with
    ///@param attackerId is the id of the attacking nation
    ///@param defenderId is the nation id of the defending nation
    ///@param warId is the war id of the active war between the 2 nations
    function blockade(
        uint256 attackerId,
        uint256 defenderId,
        uint256 warId
    ) public {
        bool requirementsMet = checkRequirements(attackerId, defenderId, warId);
        require(requirementsMet, "requrements not met");
        uint256 slotsUsed = navAct.getActionSlotsUsed(attackerId);
        require((slotsUsed + 1) <= 3, "max slots used");
        uint256 activeBlockadesAgainstCount = idToActiveBlockadesAgainst[
            attackerId
        ].length;
        require(
            activeBlockadesAgainstCount == 0,
            "you cannot blockade while being blockaded"
        );
        uint256 attackerShips = addNav.getBlockadeCapableShips(attackerId);
        require(attackerShips >= 5, "not enough blockade capable ships");
        uint256 defenderShips = addNav.getBreakBlockadeCapableShips(defenderId);
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
        uint256 day = keep.getGameDay();
        Blockade memory newBlockade = Blockade(
            blockadeId,
            attackerId,
            defenderId,
            1,
            day,
            true
        );
        blockadeIdToBlockade[blockadeId] = newBlockade;
        navAct.increaseAction(attackerId);
        navAct.toggleBlockaded(defenderId);
        uint256[]
            storage newActiveBlockadesAgainst = idToActiveBlockadesAgainst[
                defenderId
            ];
        newActiveBlockadesAgainst.push(blockadeId);
        console.log(newActiveBlockadesAgainst[0], "blockades against index 0");
        // idToActiveBlockadesAgainst[defenderId] = newActiveBlockadesAgainst;
        uint256[] storage newActiveBlockadesFor = idToActiveBlockadesFor[
            attackerId
        ];
        newActiveBlockadesFor.push(blockadeId);
        // idToActiveBlockadesFor[attackerId] = newActiveBlockadesFor;
        war.cancelPeaceOffersUponAttack(warId);
        fulfillRequest(blockadeId);
        blockadeId++;
    }

    function checkRequirements(
        uint256 attackerId,
        uint256 defenderId,
        uint256 warId
    ) internal view returns (bool) {
        bool isOwner = mint.checkOwnership(attackerId, msg.sender);
        require(isOwner, "!nation owner");
        bool blockadedAlready = navAct.getBlockadedToday(defenderId);
        require(blockadedAlready == false, "nation already blockaded today");
        bool warActive = war.isWarActive(warId);
        require(warActive, "war !active");
        bool requirementsMet = false;
        if (isOwner && !blockadedAlready && warActive) {
            requirementsMet = true;
        }
        return requirementsMet;
    }

    function checkIfAttackerAlreadyBlockaded(
        uint256 attackerId,
        uint256 defenderId
    ) internal view returns (bool) {
        uint256[] memory activeBlockadeArray = idToActiveBlockadesAgainst[
            defenderId
        ];
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

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        s_randomWords = randomWords;
        uint256 blockadePercentage = ((s_randomWords[0] % 5) + 1);
        blockadeIdToBlockade[requestNumber]
            .blockadePercentageReduction = blockadePercentage;
        console.log("blockade percentage: ", blockadePercentage);
    }

    function getActiveBlockadesAgainst(
        uint256 countryId
    ) public view returns (uint256[] memory) {
        uint256[] memory activeBlockadesToReturn = idToActiveBlockadesAgainst[
            countryId
        ];
        return (activeBlockadesToReturn);
    }

    function getBlockadePercentageReduction(
        uint256 countryId
    ) public view returns (uint256) {
        uint256[] memory activeBlockadesAgainst = idToActiveBlockadesAgainst[
            countryId
        ];
        uint256 percentageReduction;
        for (uint256 i = 0; i < activeBlockadesAgainst.length; i++) {
            uint256 _blockadeId = activeBlockadesAgainst[i];
            uint256 blockadePercentage = blockadeIdToBlockade[_blockadeId]
                .blockadePercentageReduction;
            percentageReduction += blockadePercentage;
        }
        console.log("percentage reduction: ", percentageReduction);
        return percentageReduction;
    }

    modifier onlyBreakBlockade() {
        require(
            msg.sender == breakBlockadeAddress,
            "function only callable from the break blockade contract"
        );
        _;
    }

    function checkIfBlockadeCapable(
        uint256 countryId
    ) external onlyBreakBlockade {
        uint256 blockadeCapableShips = addNav.getBlockadeCapableShips(
            countryId
        );
        console.log(blockadeCapableShips, "blockade capable ships");
        if (blockadeCapableShips == 0) {
            uint256[] storage blockadesFor = idToActiveBlockadesFor[countryId];
            for (uint256 i = 0; i < blockadesFor.length; i++) {
                blockadeId = blockadesFor[i];
                blockadeIdToBlockade[blockadeId].blockadeActive = false;
                uint256 blockadedCountry = blockadeIdToBlockade[blockadeId]
                    .blockadedId;
                uint256[] storage blockadesAgainst = idToActiveBlockadesAgainst[
                    blockadedCountry
                ];
                for (uint256 j = 0; j < blockadesAgainst.length; j++) {
                    if (blockadesAgainst[j] == blockadeId) {
                        blockadesAgainst[j] = blockadesAgainst[j] - 1;
                        blockadesAgainst.pop();
                        console.log("blockade against deleted");
                    }
                }
                delete blockadesFor[i];
                console.log("blockade for deleted");
            }
        }
    }

    function breakBlockade(
        uint256 blockaderId,
        uint256 breakerId
    ) external onlyBreakBlockade {
        console.log(blockaderId, "blockader id");
        console.log(breakerId, "breaker id");
        console.log("break blockade function");
        uint256[] storage blockadesAgainst = idToActiveBlockadesAgainst[
            breakerId
        ];
        console.log("length", blockadesAgainst.length);
        console.log("literally every line");
        for (uint256 i = 0; i < blockadesAgainst.length; i++) {
            console.log("beginning og loop");
            uint256 _blockadeId = blockadesAgainst[i];
            console.log(_blockadeId, "blockade id");
            if (blockadeIdToBlockade[_blockadeId].blockaderId == blockaderId) {
                console.log("blockade id to blockade");
                blockadesAgainst[i] = blockadesAgainst[i] - 1;
                blockadesAgainst.pop();
                console.log("blockade against deleted");
            }
            console.log("end of loop");
        }
        uint256[] storage blockadesFor = idToActiveBlockadesFor[blockaderId];
        console.log("length", blockadesFor.length);
        for (uint256 j = 0; j < blockadesFor.length; j++) {
            uint256 _blockadeId = blockadesFor[j];
            console.log(_blockadeId, "blockade id");
            if (blockadeIdToBlockade[_blockadeId].blockadedId == breakerId) {
                blockadesFor[j] = blockadesFor[j] - 1;
                blockadesFor.pop();
                console.log("blockade for deleted");
            }
        }
        console.log("end of function");
    }
}

///@title BreakBlocadeContract
///@author OxSnosh
///@dev this contract inherits from the openzeppelin ownable contract
///@dev this contract inherits from the chainlink VRF contract
contract BreakBlocadeContract is Ownable, VRFConsumerBaseV2, ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint256 public breakBlockadeId;
    address public countryMinter;
    address public navalBlockade;
    address public navy;
    address public warAddress;
    address public improvements4;
    address public navalActions;
    address public navy2;
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
    uint32 private constant NUM_WORDS = 6;

    CountryMinter mint;
    NavalBlockadeContract navBlock;
    NavyContract nav;
    WarContract war;
    ImprovementsContract4 imp4;
    NavalActionsContract navAct;
    NavyContract2 nav2;

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
        address _countryMinter,
        address _navalBlockade,
        address _navy,
        address _warAddress,
        address _improvements4,
        address _navalActions,
        address _navy2
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        navalBlockade = _navalBlockade;
        navBlock = NavalBlockadeContract(_navalBlockade);
        navy = _navy;
        nav = NavyContract(_navy);
        warAddress = _warAddress;
        war = WarContract(_warAddress);
        improvements4 = _improvements4;
        imp4 = ImprovementsContract4(_improvements4);
        navalActions = _navalActions;
        navAct = NavalActionsContract(_navalActions);
        navy2 = _navy2;
        nav2 = NavyContract2(_navy2);
    }

    ///@dev this is a public function callable only from the nation owner
    ///@dev this function allows a nation to break a blockade another nation imposed on them
    ///@notice this function allows a nation to break a blockade another nation imposed on them
    ///@param warId is the war id of the active war between the 2 nations
    ///@param attackerId is the id of the attacking nation
    ///@param blockaderId is the nation id of the defending nation
    function breakBlockade(
        uint256 warId,
        uint256 attackerId,
        uint256 blockaderId
    ) public {
        bool isOwner = mint.checkOwnership(attackerId, msg.sender);
        require(isOwner, "caller not nation owner");
        bool warActive = war.isWarActive(warId);
        require(warActive, "war !active");
        uint256 slotsUsed = navAct.getActionSlotsUsed(attackerId);
        require((slotsUsed + 1) <= 3, "max slots used");
        uint256[] memory attackerBlockades = navBlock.getActiveBlockadesAgainst(
            attackerId
        );
        bool isBlockader = false;
        console.log(blockaderId, "blockaderId");
        console.log(attackerBlockades.length, "attacker blockades length");
        for (uint256 i; i < attackerBlockades.length; i++) {
            if (attackerBlockades[i] == blockaderId) {
                console.log(attackerBlockades[i], "attacker blocades i");
                isBlockader = true;
            } else {
                isBlockader = false;
            }
        }
        require(isBlockader, "!blockaded by this nation");
        navAct.increaseAction(attackerId);
        generateBreakBlockadeStruct(warId, attackerId, breakBlockadeId);
        generateDefendBlockadeStruct(warId, blockaderId, breakBlockadeId);
        generateBreakBlockadeChanceArray(breakBlockadeId);
        generateDefendBlockadeChanceArray(breakBlockadeId);
        war.cancelPeaceOffersUponAttack(warId);
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
        uint256 frigates = nav2.getFrigateCount(attackerId);
        uint256 destroyers = nav2.getDestroyerCount(attackerId);
        BreakBlockade storage newBreakBlockade = breakBlockadeIdToBreakBlockade[breakBlockId];
        newBreakBlockade.battleshipCount = battleships;
        newBreakBlockade.cruiserCount = cruisers;
        newBreakBlockade.frigateCount = frigates;
        newBreakBlockade.destroyerCount = destroyers;
        newBreakBlockade.warId = warId;
        newBreakBlockade.breakerId = attackerId;
        uint256 strength = getBreakerStrength(attackerId);
        newBreakBlockade.breakerStrength = strength;
    }

    function generateDefendBlockadeStruct(
        uint256 warId,
        uint256 defenderId,
        uint256 breakBlockId
    ) internal {
        uint256 battleships = nav.getBattleshipCount(defenderId);
        uint256 cruisers = nav.getCruiserCount(defenderId);
        uint256 frigates = nav2.getFrigateCount(defenderId);
        uint256 submarines = nav2.getSubmarineCount(defenderId);
        DefendBlockade storage newDefendBlockade = breakBlockadeIdToDefendBlockade[breakBlockId];
        newDefendBlockade.battleshipCount = battleships;
        newDefendBlockade.cruiserCount = cruisers;
        newDefendBlockade.frigateCount = frigates;
        newDefendBlockade.submarineCount = submarines;
        newDefendBlockade.warId = warId;
        newDefendBlockade.defenderId = defenderId;
        uint256 strength = getDefenderStrength(defenderId);
        newDefendBlockade.defenderStrength = strength;
    }

    function generateBreakBlockadeChanceArray(uint256 breakBlockId) internal {
        uint256[] storage chances = battleIdToBreakBlockadeChanceArray[
            breakBlockId
        ];
        uint256[] storage types = battleIdToBreakBlockadeTypeArray[
            breakBlockId
        ];
        uint256 cumulativeSum;
        //battleship
        if (breakBlockadeIdToBreakBlockade[breakBlockId].battleshipCount > 0) {
            uint256 battleshipOdds = (breakBlockadeIdToBreakBlockade[
                breakBlockId
            ].battleshipCount * battleshipTargetSize);
            uint256 battleshipOddsToPush = (battleshipOdds + cumulativeSum);
            chances.push(battleshipOddsToPush);
            types.push(3);
            console.log("pushed a battleship");
            cumulativeSum = battleshipOddsToPush;
        }
        //cruiser
        if (breakBlockadeIdToBreakBlockade[breakBlockId].cruiserCount > 0) {
            uint256 cruiserOdds = (breakBlockadeIdToBreakBlockade[breakBlockId]
                .cruiserCount * cruiserTargetSize);
            uint256 cruiserOddsToPush = (cruiserOdds + cumulativeSum);
            chances.push(cruiserOddsToPush);
            types.push(4);
            console.log("pushed a cruiser");
            cumulativeSum = cruiserOddsToPush;
        }
        //frigate
        if (breakBlockadeIdToBreakBlockade[breakBlockId].frigateCount > 0) {
            uint256 frigateOdds = (breakBlockadeIdToBreakBlockade[breakBlockId]
                .frigateCount * frigateTargetSize);
            uint256 frigateOddsToPush = (frigateOdds + cumulativeSum);
            chances.push(frigateOddsToPush);
            types.push(5);
            console.log("pushed a frigate");
            cumulativeSum = frigateOddsToPush;
        }
        //destroyer
        if (breakBlockadeIdToBreakBlockade[breakBlockId].destroyerCount > 0) {
            uint256 destroyerOdds = (breakBlockadeIdToBreakBlockade[
                breakBlockId
            ].destroyerCount * destroyerTargetSize);
            uint256 destroyerOddsToPush = (destroyerOdds + cumulativeSum);
            chances.push(destroyerOddsToPush);
            types.push(6);
            console.log("pushed a destroyer");
            cumulativeSum = destroyerOddsToPush;
        }
        battleIdToBreakBlockadeChanceArray[breakBlockId] = chances;
        battleIdToBreakBlockadeTypeArray[breakBlockId] = types;
        battleIdToBreakBlockadeCumulativeSumOdds[breakBlockId] = cumulativeSum;
    }

    function generateDefendBlockadeChanceArray(uint256 breakBlockId) internal {
        uint256[] storage chances = battleIdToDefendBlockadeChanceArray[
            breakBlockId
        ];
        uint256[] storage types = battleIdToDefendBlockadeTypeArray[
            breakBlockId
        ];
        uint256 cumulativeSum;
        //battleship
        if (breakBlockadeIdToDefendBlockade[breakBlockId].battleshipCount > 0) {
            uint256 battleshipOdds = (breakBlockadeIdToDefendBlockade[
                breakBlockId
            ].battleshipCount * battleshipTargetSize);
            uint256 battleshipOddsToPush = (battleshipOdds + cumulativeSum);
            chances.push(battleshipOddsToPush);
            types.push(3);
            console.log("pushed a battleship DEFEND");
            cumulativeSum = battleshipOddsToPush;
        }
        //cruiser
        if (breakBlockadeIdToDefendBlockade[breakBlockId].cruiserCount > 0) {
            uint256 cruiserOdds = (breakBlockadeIdToDefendBlockade[breakBlockId]
                .cruiserCount * cruiserTargetSize);
            uint256 cruiserOddsToPush = (cruiserOdds + cumulativeSum);
            chances.push(cruiserOddsToPush);
            types.push(4);
            console.log("pushed a cruiser DEFEND");
            cumulativeSum = cruiserOddsToPush;
        }
        //frigate
        if (breakBlockadeIdToDefendBlockade[breakBlockId].frigateCount > 0) {
            uint256 frigateOdds = (breakBlockadeIdToDefendBlockade[breakBlockId]
                .frigateCount * frigateTargetSize);
            uint256 frigateOddsToPush = (frigateOdds + cumulativeSum);
            chances.push(frigateOddsToPush);
            types.push(5);
            console.log("pushed a frigate DEFEND");
            cumulativeSum = frigateOddsToPush;
        }
        //submarine
        if (breakBlockadeIdToDefendBlockade[breakBlockId].submarineCount > 0) {
            uint256 submarineOdds = (breakBlockadeIdToDefendBlockade[
                breakBlockId
            ].submarineCount * destroyerTargetSize);
            uint256 submarineOddsToPush = (submarineOdds + cumulativeSum);
            chances.push(submarineOddsToPush);
            types.push(7);
            console.log("pushed a submarine DEFEND");
            cumulativeSum = submarineOddsToPush;
        }
        battleIdToDefendBlockadeChanceArray[breakBlockId] = chances;
        battleIdToDefendBlockadeTypeArray[breakBlockId] = types;
        battleIdToDefendBlockadeCumulativeSumOdds[breakBlockId] = cumulativeSum;
    }

    function getBreakerStrength(
        uint256 battleId
    ) public view returns (uint256) {
        uint256 _battleshipStrength = breakBlockadeIdToBreakBlockade[battleId]
            .battleshipCount * battleshipStrength;
        uint256 _cruiserStrength = breakBlockadeIdToBreakBlockade[battleId]
            .cruiserCount * cruiserStrength;
        uint256 _frigateStrength = breakBlockadeIdToBreakBlockade[battleId]
            .frigateCount * frigateStrength;
        uint256 _destroyerStrength = breakBlockadeIdToBreakBlockade[battleId]
            .destroyerCount * destroyerStrength;
        uint256 strength = (_battleshipStrength +
            _cruiserStrength +
            _frigateStrength +
            _destroyerStrength);
        uint256 breakerId = breakBlockadeIdToBreakBlockade[battleId].breakerId;
        uint256 navalAcademyCount = imp4.getNavalAcademyCount(breakerId);
        if (navalAcademyCount > 0) {
            uint256 breakerShipCount = getBreakerShipCount(breakerId);
            strength += (breakerShipCount * navalAcademyCount);
        }
        return strength;
    }

    function getDefenderStrength(
        uint256 battleId
    ) public view returns (uint256) {
        uint256 _battleshipStrength = breakBlockadeIdToDefendBlockade[battleId]
            .battleshipCount * battleshipStrength;
        uint256 _cruiserStrength = breakBlockadeIdToDefendBlockade[battleId]
            .cruiserCount * cruiserStrength;
        uint256 _frigateStrength = breakBlockadeIdToDefendBlockade[battleId]
            .frigateCount * frigateStrength;
        uint256 _submarineStrength = breakBlockadeIdToDefendBlockade[battleId]
            .submarineCount * submarineStrength;
        uint256 strength = (_battleshipStrength +
            _cruiserStrength +
            _frigateStrength +
            _submarineStrength);
        uint256 defenderId = breakBlockadeIdToDefendBlockade[battleId]
            .defenderId;
        uint256 navalAcademyCount = imp4.getNavalAcademyCount(defenderId);
        if (navalAcademyCount > 0) {
            uint256 defenderShipCount = getDefenderShipCount(defenderId);
            strength += (defenderShipCount * navalAcademyCount);
        }
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

    bytes32 navyAttackJobId;
    address oracleAddress;
    uint256 fee;
    // address linkAddress;

    function updateJobId(bytes32 _jobId) public onlyOwner {
        navyAttackJobId = _jobId;
    }

    function updateOracleAddress(address _oracleAddress) public onlyOwner {
        setChainlinkOracle(_oracleAddress);
        oracleAddress = _oracleAddress;
    }

    function updateFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    function updateLinkAddress(address _linkAddress) public onlyOwner {
        setChainlinkToken(_linkAddress);
        // linkAddress = _linkAddress;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        console.log("fulfill random words");
        Chainlink.Request memory req = buildOperatorRequest(
            navyAttackJobId,
            this.completeBattleSequence.selector
        );
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        console.log(requestNumber, "requestNumber");
        req.addUint("battleId", requestNumber);
        req.addBytes("randomWords", abi.encode(randomWords));
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        uint256[] memory attackerChances = battleIdToBreakBlockadeChanceArray[
            requestNumber
        ];
        uint256[] memory attackerTypes = battleIdToBreakBlockadeTypeArray[
            requestNumber
        ];
        uint256[] memory defenderChances = battleIdToDefendBlockadeChanceArray[
            requestNumber
        ];
        uint256[] memory defenderTypes = battleIdToDefendBlockadeTypeArray[
            requestNumber
        ];
        console.log(attackerChances[0], attackerChances[1], attackerChances[2]);
        console.log(attackerTypes[0], attackerTypes[1], attackerTypes[2]);
        console.log(defenderChances[0], defenderChances[1], defenderChances[2]);
        console.log(defenderTypes[0], defenderTypes[1], defenderTypes[2]);
        req.addBytes("attackerChances", abi.encode(attackerChances));
        req.addBytes("attackerTypes", abi.encode(attackerTypes));
        req.addBytes("defenderChances", abi.encode(defenderChances));
        req.addBytes("defenderTypes", abi.encode(defenderTypes));
        sendOperatorRequest(req, fee);
        console.log("request sent");
        // uint256 breakerStartingStrength = getBreakerStrength(requestNumber);
        // console.log(breakerStartingStrength, "breaker starting strength");
        // uint256 defenderStartingStrength = getDefenderStrength(requestNumber);
        // console.log(defenderStartingStrength, "defender starting strength");
        // uint256 totalStrength = (breakerStartingStrength +
        //     defenderStartingStrength);
        // console.log(totalStrength, "total strength");
        // console.log(randomNumberForBattle, "random number for battle");
        // uint256 outcomeNumber = (randomNumberForBattle % totalStrength);
        // console.log(outcomeNumber, "outcome number");
        // completeBattleSequesnce(
        //     requestNumber,
        //     outcomeNumber,
        //     breakerStartingStrength,
        //     randomWords
        // );
    }

    function completeBattleSequence(
        bytes32 requestId,
        uint256[] memory _attackerLosses,
        uint256[] memory _defenderLosses,
        uint256 battleId
    ) public recordChainlinkFulfillment(requestId) {
        // console.log(_defenderLosses[0]);
        // console.log(_defenderLosses[1]);
        // console.log(_defenderLosses[2]);
        // console.log(battleId);
        // uint256[] storage defenderLosses = battleIdToDefendBlockadeLosses[
        //     requestNumber
        // ];
        // uint256[] storage breakerLosses = battleIdToBreakBlockadeLosses[
        //     requestNumber
        // ];
        // uint256 _defenderId = breakBlockadeIdToDefendBlockade[requestNumber]
        //     .defenderId;
        // uint256 _breakerId = breakBlockadeIdToBreakBlockade[requestNumber]
        //     .breakerId;
        // if (outcomeNumber <= breakerStartingStrength) {
        //     console.log("blokckader loss");
        //     uint256[] memory typeArray = battleIdToDefendBlockadeTypeArray[
        //         requestNumber
        //     ];
        //     uint256 randomArray = (randomWords[1] % typeArray.length);
        //     uint256 shipType = typeArray[randomArray];
        //     console.log(shipType, "ship type");
        //     defenderLosses.push(shipType);
        //     console.log("umm");
        //     navBlock.breakBlockade(_defenderId, _breakerId);
        // } else {
        //     console.log("breaker loss");
        //     uint256[] memory typeArray = battleIdToBreakBlockadeTypeArray[
        //         requestNumber
        //     ];
        //     uint256 randomArray = (randomWords[1] % typeArray.length);
        //     uint256 shipType = typeArray[randomArray];
        //     console.log(shipType, "ship type");
        //     breakerLosses.push(shipType);
        // }
        // console.log(breakerLosses.length, "breaker losses");
        // console.log(defenderLosses.length, "defender losses");
        // nav.decrementLosses(
        //     defenderLosses,
        //     _defenderId,
        //     breakerLosses,
        //     _breakerId
        // );
        // uint256 warId = breakBlockadeIdToBreakBlockade[requestNumber].warId;
        // war.addNavyCasualties(warId, _breakerId, breakerLosses.length);
        // war.addNavyCasualties(warId, _defenderId, defenderLosses.length);
        // console.log("maybe");
    }

    // function getLosses(uint256 battleId, uint256 numberBetweenZeroAndTwo)
    //     public
    //     view
    //     returns (uint256)
    // {
    //     uint256 breakerId = breakBlockadeIdToBreakBlockade[battleId].breakerId;
    //     uint256 breakerCount = getBreakerShipCount(breakerId);
    //     uint256 defenderId = breakBlockadeIdToDefendBlockade[battleId]
    //         .defenderId;
    //     uint256 defenderCount = getDefenderShipCount(defenderId);
    //     uint256 totalShips = (breakerCount + defenderCount);
    //     uint256 losses;
    //     if (totalShips < 4) {
    //         losses = 1;
    //     } else if (totalShips <= 10) {
    //         losses = (1 + numberBetweenZeroAndTwo);
    //     } else if (totalShips <= 30) {
    //         losses = (2 + numberBetweenZeroAndTwo);
    //     } else if (totalShips <= 50) {
    //         losses = (3 + numberBetweenZeroAndTwo);
    //     } else if (totalShips <= 70) {
    //         losses = (4 + numberBetweenZeroAndTwo);
    //     } else if (totalShips <= 100) {
    //         losses = (5 + numberBetweenZeroAndTwo);
    //     } else {
    //         losses = (6 + numberBetweenZeroAndTwo);
    //     }
    //     console.log(losses, "losses");
    //     return losses;
    // }

    function getBreakerShipCount(
        uint256 countryId
    ) internal view returns (uint256) {
        uint256 battleshipCount = nav.getBattleshipCount(countryId);
        uint256 cruiserCount = nav.getCruiserCount(countryId);
        uint256 frigateCount = nav2.getFrigateCount(countryId);
        uint256 destroyerCount = nav2.getDestroyerCount(countryId);
        uint256 count = (battleshipCount +
            cruiserCount +
            frigateCount +
            destroyerCount);
        return count;
    }

    function getDefenderShipCount(
        uint256 countryId
    ) internal view returns (uint256) {
        uint256 battleshipCount = nav.getBattleshipCount(countryId);
        uint256 cruiserCount = nav.getCruiserCount(countryId);
        uint256 frigateCount = nav2.getFrigateCount(countryId);
        uint256 submarineCount = nav2.getSubmarineCount(countryId);
        uint256 count = (battleshipCount +
            cruiserCount +
            frigateCount +
            submarineCount);
        return count;
    }

    function generateLossForDefender(
        uint256 battleId,
        uint256 randomNumberForShipLoss
    ) public {
        // uint256[] storage chanceArray = battleIdToDefendBlockadeChanceArray[
        //     battleId
        // ];
        // uint256[] storage typeArray = battleIdToDefendBlockadeTypeArray[
        //     battleId
        // ];
        // uint256 randomArray = (randomNumberForShipLoss % typeArray.length);
        // uint256 shipType = typeArray[randomArray];
        // uint256[] storage defenderLosses = battleIdToDefendBlockadeLosses[
        //     battleId
        // ];
        // defenderLosses.push(shipType);
        // battleship
        // cruiser
        // frigate
        // destroyer / submarine
        // if (shipType == 3) {
        // }
        // uint256 cumulativeValue = battleIdToDefendBlockadeCumulativeSumOdds[
        //     battleId
        // ];
        // uint256 randomNumber = (randomNumberForShipLoss % cumulativeValue);
        // uint256 shipType;
        // uint256 amountToDecrease;
        // uint256 j;
        // for (uint256 i; i < chanceArray.length; i++) {
        //     if (randomNumber <= chanceArray[i]) {
        //         shipType = typeArray[i];
        //         amountToDecrease = getAmountToDecrease(shipType);
        //         j = i;
        //         break;
        //     }
        // }
        // for (j; j < chanceArray.length; j++) {
        //     if (chanceArray[j] >= randomNumber) {
        //         chanceArray[j] -= amountToDecrease;
        //     }
        // }
        // battleIdToDefendBlockadeCumulativeSumOdds[battleId] -= amountToDecrease;
    }

    // function generateLossForBreaker(
    //     uint256 battleId,
    //     uint256 randomNumberForShipLoss
    // ) public {
    //     uint256[] storage chanceArray = battleIdToBreakBlockadeChanceArray[
    //         battleId
    //     ];
    //     uint256[] storage typeArray = battleIdToBreakBlockadeTypeArray[
    //         battleId
    //     ];
    //     uint256 cumulativeValue = battleIdToBreakBlockadeCumulativeSumOdds[
    //         battleId
    //     ];
    //     uint256 randomNumber = (randomNumberForShipLoss % cumulativeValue);
    //     uint256 shipType;
    //     uint256 amountToDecrease;
    //     bool ranAlready = false;
    //     if (ranAlready == false) {
    //         for (uint256 i; i < chanceArray.length; i++) {
    //             if (randomNumber <= chanceArray[i]) {
    //                 shipType = typeArray[i];
    //                 amountToDecrease = getAmountToDecrease(shipType);
    //             }
    //             uint256 j = i;
    //             for (j; j < chanceArray.length; j++) {
    //                 if (chanceArray[j] >= randomNumber) {
    //                     chanceArray[j] -= amountToDecrease;
    //                 }
    //                 ranAlready = true;
    //             }
    //         }
    //     }
    //     battleIdToBreakBlockadeCumulativeSumOdds[battleId] -= amountToDecrease;
    //     uint256[] storage defenderLosses = battleIdToBreakBlockadeLosses[
    //         battleId
    //     ];
    //     defenderLosses.push(shipType);
    // }

    // function getAmountToDecrease(uint256 shipType)
    //     internal
    //     pure
    //     returns (uint256)
    // {
    //     uint256 amountToDecrease;
    //     if (shipType == 1) {
    //         amountToDecrease = 15;
    //     } else if (shipType == 2) {
    //         amountToDecrease = 13;
    //     } else if (shipType == 3) {
    //         amountToDecrease = 11;
    //     } else if (shipType == 4) {
    //         amountToDecrease = 10;
    //     } else if (shipType == 5) {
    //         amountToDecrease = 8;
    //     } else if (shipType == 6) {
    //         amountToDecrease = 5;
    //     } else if (shipType == 7) {
    //         amountToDecrease = 4;
    //     } else if (shipType == 8) {
    //         amountToDecrease = 1;
    //     }
    //     return amountToDecrease;
    // }
}

///@title NavalAttackContract
///@author OxSnosh
///@dev this contract inherits from the openzeppelin ownable contract
///@dev this contract inherits from the chainlink VRF contract
contract NavalAttackContract is Ownable, VRFConsumerBaseV2, ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address public navy;
    uint256 public navyBattleId;
    address public navyBlockade;
    address public warAddress;
    address public improvements4;
    address public navalActions;
    address public navy2;

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
    uint32 private constant NUM_WORDS = 6;

    NavyContract nav;
    NavalBlockadeContract navBlock;
    WarContract war;
    ImprovementsContract4 imp4;
    NavalActionsContract navAct;
    NavyContract2 nav2;

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
        address _navy,
        address _war,
        address _improvements4,
        address _navalActions,
        address _navy2
    ) public onlyOwner {
        navy = _navy;
        nav = NavyContract(_navy);
        warAddress = _war;
        war = WarContract(_war);
        improvements4 = _improvements4;
        imp4 = ImprovementsContract4(_improvements4);
        navalActions = _navalActions;
        navAct = NavalActionsContract(_navalActions);
        navy2 = _navy2;
        nav2 = NavyContract2(_navy2);
    }

    ///@dev this is a public function callable only from the nation owner
    ///@dev this function allows a nation to attack the navy of another nation
    ///@notice this function allows a nation to attack the navy of another nation
    ///@param warId is the war id of the active war between the 2 nations
    ///@param attackerId is the id of the attacking nation
    ///@param defenderId is the nation id of the defending nation
    function navalAttack(
        uint256 warId,
        uint256 attackerId,
        uint256 defenderId
    ) public {
        bool isActiveWar = war.isWarActive(warId);
        require(isActiveWar, "!active war");
        uint256 slotsUsed = navAct.getActionSlotsUsed(attackerId);
        require((slotsUsed + 1) <= 3, "max slots used");
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
        generateAttackerNavyStruct(warId, navyBattleId, attackerId);
        generateDefenderNavyStruct(warId, navyBattleId, defenderId);
        generateAttackerChanceArray(navyBattleId);
        generateDefenderChanceArray(navyBattleId);
        war.cancelPeaceOffersUponAttack(warId);
        fulfillRequest(navyBattleId);
        navAct.increaseAction(attackerId);
        navyBattleId++;
    }

    function generateAttackerNavyStruct(
        uint256 warId,
        uint256 battleId,
        uint256 countryId
    ) internal {
        uint256 corvetteCount = nav.getCorvetteCount(countryId);
        uint256 landingShipCount = nav.getLandingShipCount(countryId);
        uint256 battleshipCount = nav.getBattleshipCount(countryId);
        uint256 cruiserCount = nav.getCruiserCount(countryId);
        uint256 frigateCount = nav2.getFrigateCount(countryId);
        uint256 destroyerCount = nav2.getDestroyerCount(countryId);
        uint256 submarineCount = nav2.getSubmarineCount(countryId);
        uint256 aircraftCarrierCount = nav2.getAircraftCarrierCount(countryId);
        console.log("creating struct");
        console.log(
            battleshipCount,
            cruiserCount,
            frigateCount,
            submarineCount
        );
        NavyForces storage newNavyForces = idToAttackerNavy[battleId];
        newNavyForces.corvetteCount = corvetteCount;
        newNavyForces.landingShipCount = landingShipCount;
        newNavyForces.battleshipCount = battleshipCount;
        console.log(
            "battleship count from mapping",
            idToAttackerNavy[battleId].battleshipCount,
            battleId
        );
        newNavyForces.cruiserCount = cruiserCount;
        newNavyForces.frigateCount = frigateCount;
        newNavyForces.destroyerCount = destroyerCount;
        newNavyForces.submarineCount = submarineCount;
        newNavyForces.aircraftCarrierCount = aircraftCarrierCount;
        uint256 strengthAttacker = getAttackerStrength(navyBattleId);
        newNavyForces.startingStrength = strengthAttacker;
        newNavyForces.warId = warId;
        newNavyForces.countryId = countryId;
    }

    function generateDefenderNavyStruct(
        uint256 warId,
        uint256 attackId,
        uint256 countryId
    ) internal {
        uint256 corvetteCount = nav.getCorvetteCount(countryId);
        uint256 landingShipCount = nav.getLandingShipCount(countryId);
        uint256 battleshipCount = nav.getBattleshipCount(countryId);
        uint256 cruiserCount = nav.getCruiserCount(countryId);
        uint256 frigateCount = nav2.getFrigateCount(countryId);
        uint256 destroyerCount = nav2.getDestroyerCount(countryId);
        uint256 submarineCount = nav2.getSubmarineCount(countryId);
        uint256 aircraftCarrierCount = nav2.getAircraftCarrierCount(countryId);
        console.log(
            battleshipCount,
            cruiserCount,
            frigateCount,
            submarineCount
        );
        NavyForces storage newNavyForces = idToDefenderNavy[attackId];
        newNavyForces.corvetteCount = corvetteCount;
        newNavyForces.landingShipCount = landingShipCount;
        newNavyForces.battleshipCount = battleshipCount;
        newNavyForces.cruiserCount = cruiserCount;
        newNavyForces.frigateCount = frigateCount;
        newNavyForces.destroyerCount = destroyerCount;
        newNavyForces.submarineCount = submarineCount;
        newNavyForces.aircraftCarrierCount = aircraftCarrierCount;
        uint256 defenderStrength = getDefenderStrength(navyBattleId);
        newNavyForces.startingStrength = defenderStrength;
        newNavyForces.warId = warId;
        newNavyForces.countryId = countryId;
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
        console.log(
            idToAttackerNavy[battleId].battleshipCount,
            "triggering array generation"
        );
        if (idToAttackerNavy[battleId].battleshipCount > 0) {
            console.log("creating chance and type array");
            uint256 battleshipOdds = (idToAttackerNavy[battleId]
                .battleshipCount * battleshipTargetSize);
            uint256 battleshipOddsToPush = (battleshipOdds + cumulativeSum);
            chances.push(battleshipOddsToPush);
            console.log(chances[chances.length - 1]);
            types.push(3);
            console.log(types[types.length - 1]);
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

    function getAttackerStrength(
        uint256 battleId
    ) public view returns (uint256) {
        uint256 _corvetteStrength = idToAttackerNavy[battleId].corvetteCount *
            corvetteStrength;
        uint256 _landingShipStrength = idToAttackerNavy[battleId]
            .landingShipCount * landingShipStrength;
        uint256 _battleshipStrength = idToAttackerNavy[battleId]
            .battleshipCount * battleshipStrength;
        console.log(
            "count from getStrenf()",
            idToAttackerNavy[battleId].battleshipCount
        );
        uint256 _cruiserStrength = idToAttackerNavy[battleId].cruiserCount *
            cruiserStrength;
        console.log(
            "count from getStrenf()",
            idToAttackerNavy[battleId].cruiserCount
        );
        uint256 _frigateStrength = idToAttackerNavy[battleId].frigateCount *
            frigateStrength;
        uint256 _destroyerStrength = idToAttackerNavy[battleId].destroyerCount *
            destroyerStrength;
        uint256 _submarineStrength = idToAttackerNavy[battleId].submarineCount *
            submarineStrength;
        uint256 _aircraftCarrierStrength = idToAttackerNavy[battleId]
            .aircraftCarrierCount * aircraftCarrierStrength;
        console.log("cruisers", idToAttackerNavy[battleId].cruiserCount);
        console.log("cruiser strength", _cruiserStrength);
        console.log("cruiser strength", cruiserStrength);
        uint256 strength = (_corvetteStrength +
            _landingShipStrength +
            _battleshipStrength +
            _cruiserStrength +
            _frigateStrength +
            _destroyerStrength +
            _submarineStrength +
            _aircraftCarrierStrength);
        uint256 attackerId = idToAttackerNavy[battleId].countryId;
        uint256 navalAcademyCount = imp4.getNavalAcademyCount(attackerId);
        if (navalAcademyCount > 0) {
            uint256 shipCount = getShipCount(attackerId);
            strength += (shipCount * navalAcademyCount);
        }
        console.log("strength att", strength);
        return strength;
    }

    function getDefenderStrength(
        uint256 battleId
    ) public view returns (uint256) {
        uint256 _corvetteStrength = idToDefenderNavy[battleId].corvetteCount *
            corvetteStrength;
        uint256 _landingShipStrength = idToDefenderNavy[battleId]
            .landingShipCount * landingShipStrength;
        uint256 _battleshipStrength = idToDefenderNavy[battleId]
            .battleshipCount * battleshipStrength;
        console.log(
            "count from getStrenf()",
            idToDefenderNavy[battleId].battleshipCount
        );
        uint256 _cruiserStrength = idToDefenderNavy[battleId].cruiserCount *
            cruiserStrength;
        console.log(
            "count from getStrenf()",
            idToDefenderNavy[battleId].cruiserCount
        );
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
        uint256 defenderId = idToDefenderNavy[battleId].countryId;
        uint256 navalAcademyCount = imp4.getNavalAcademyCount(defenderId);
        if (navalAcademyCount > 0) {
            uint256 shipCount = getShipCount(defenderId);
            strength += (shipCount * navalAcademyCount);
        }
        console.log("strength def", strength);
        return strength;
    }

    function fulfillRequest(uint256 battleId) public {
        console.log("arrived at fulfillRequest()");
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        console.log("random words requested");
        s_requestIdToRequestIndex[requestId] = battleId;
    }

    bytes32 navyAttackJobId;
    address oracleAddress;
    uint256 fee;
    // address linkAddress;

    function updateJobId(bytes32 _jobId) public onlyOwner {
        navyAttackJobId = _jobId;
    }

    function updateOracleAddress(address _oracleAddress) public onlyOwner {
        setChainlinkOracle(_oracleAddress);
        oracleAddress = _oracleAddress;
    }

    function updateFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    function updateLinkAddress(address _linkAddress) public onlyOwner {
        setChainlinkToken(_linkAddress);
        // linkAddress = _linkAddress;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        Chainlink.Request memory req = buildOperatorRequest(
            navyAttackJobId,
            this.completeNavalAttack.selector
        );
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        console.log(requestNumber, "requestNumber");
        req.addUint("battleId", requestNumber);
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        s_randomWords = randomWords;
        req.addBytes("randomWords", abi.encode(randomWords));
        // uint256 numberBetweenZeroAndTwo = (s_randomWords[0] % 2);
        // uint256 losses = getLosses(requestNumber, numberBetweenZeroAndTwo);
        // console.log("losses", losses);
        // req.addUint("losses", losses);
        uint256[] memory attackerChances = battleIdToAttackerChanceArray[
            requestNumber
        ];
        uint256[] memory attackerTypes = battleIdToAttackerTypeArray[
            requestNumber
        ];
        uint256[] memory defenderChances = battleIdToDefenderChanceArray[
            requestNumber
        ];
        uint256[] memory defenderTypes = battleIdToDefenderTypeArray[
            requestNumber
        ];
        req.addBytes("attackerChances", abi.encode(attackerChances));
        req.addBytes("attackerTypes", abi.encode(attackerTypes));
        req.addBytes("defenderChances", abi.encode(defenderChances));
        req.addBytes("defenderTypes", abi.encode(defenderTypes));
        sendOperatorRequest(req, fee);
        console.log("request sent");
        // uint256 attackerStartingStrength = idToAttackerNavy[requestNumber]
        //     .startingStrength;
        // console.log("attack strength", attackerStartingStrength);
        // uint256 defenderStartingStrength = idToDefenderNavy[requestNumber]
        //     .startingStrength;
        // console.log("def strength", defenderStartingStrength);
        // uint256 totalStrength = (attackerStartingStrength +
        //     defenderStartingStrength);
        // console.log("total strength", totalStrength);
        // console.log("arrived to for loop");
    }

    function completeNavalAttack(
        bytes32 requestId,
        uint256[] memory _attackerLosses,
        uint256[] memory _defenderLosses,
        uint256 battleId
    ) public pure {
        console.log(_defenderLosses[0]);
        console.log(_defenderLosses[1]);
        console.log(_defenderLosses[2]);
        console.log(battleId);
        // for (uint256 i = 0; i <= losses + 1; i++) {
        //     console.log("loop", i);
        //     uint256 randomNumberForTeamSelection = (s_randomWords[i] %
        //         totalStrength);
        //     uint256 randomNumnerForShipSelection = s_randomWords[i + 8];
        //     if (randomNumberForTeamSelection <= attackerStartingStrength) {
        //         console.log("defender loss");
        //         generateLossForDefender(
        //             requestNumber,
        //             randomNumnerForShipSelection
        //         );
        //     } else {
        //         console.log("attacker loss");
        //         generateLossForAttacker(
        //             requestNumber,
        //             randomNumnerForShipSelection
        //         );
        //     }
        // }
        // uint256[] memory defenderLosses = battleIdToDefenderLosses[
        //     requestNumber
        // ];
        // uint256[] memory attackerLosses = battleIdToAttackerLosses[
        //     requestNumber
        // ];
        // uint256 defenderId = idToDefenderNavy[requestNumber].countryId;
        // uint256 attackerId = idToAttackerNavy[requestNumber].countryId;
        // nav.decrementLosses(
        //     defenderLosses,
        //     defenderId,
        //     attackerLosses,
        //     attackerId
        // );
        // console.log("losses decremented");
        // uint256 warId = idToAttackerNavy[requestNumber].warId;
        // war.addNavyCasualties(warId, defenderId, defenderLosses.length);
        // war.addNavyCasualties(warId, attackerId, attackerLosses.length);
        // navBlock.checkIfBlockadeCapable(defenderId);
        // console.log("naval attack complete");
    }

    function getLosses(
        uint256 battleId,
        uint256 numberBetweenZeroAndTwo
    ) public view returns (uint256) {
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
        uint256 frigateCount = nav2.getFrigateCount(countryId);
        uint256 destroyerCount = nav2.getDestroyerCount(countryId);
        uint256 submarineCount = nav2.getSubmarineCount(countryId);
        uint256 aircraftCarrierCount = nav2.getAircraftCarrierCount(countryId);
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

    // function generateLossForDefender(
    //     uint256 battleId,
    //     uint256 randomNumberForShipLoss
    // ) public {
    //     uint256[] storage chanceArray = battleIdToDefenderChanceArray[battleId];
    //     uint256[] storage typeArray = battleIdToDefenderTypeArray[battleId];
    //     uint256 cumulativeValue = battleIdToDefenderCumulativeSumOdds[battleId];
    //     uint256 randomNumber = (randomNumberForShipLoss % cumulativeValue);
    //     uint256 shipType;
    //     uint256 amountToDecrease;
    //     uint256 j;
    //     for (uint256 i; i < chanceArray.length; i++) {
    //         if (randomNumber <= chanceArray[i]) {
    //             shipType = typeArray[i];
    //             amountToDecrease = getAmountToDecrease(shipType);
    //             j = i;
    //             break;
    //         }
    //     }
    //     for (j; j < chanceArray.length; j++) {
    //         if (chanceArray[j] >= randomNumber) {
    //             chanceArray[j] -= amountToDecrease;
    //         }
    //     }
    //     battleIdToDefenderCumulativeSumOdds[battleId] -= amountToDecrease;
    //     uint256[] storage defenderLosses = battleIdToDefenderLosses[battleId];
    //     defenderLosses.push(shipType);
    // }

    // function generateLossForAttacker(
    //     uint256 battleId,
    //     uint256 randomNumberForShipLoss
    // ) public {
    //     uint256[] storage chanceArray = battleIdToAttackerChanceArray[battleId];
    //     uint256[] storage typeArray = battleIdToAttackerTypeArray[battleId];
    //     uint256 cumulativeValue = battleIdToAttackerCumulativeSumOdds[battleId];
    //     uint256 randomNumber = (randomNumberForShipLoss % cumulativeValue);
    //     uint256 shipType;
    //     uint256 amountToDecrease;
    //     bool ranAlready = false;
    //     if (ranAlready == false) {
    //         for (uint256 i; i < chanceArray.length; i++) {
    //             if (randomNumber <= chanceArray[i]) {
    //                 shipType = typeArray[i];
    //                 amountToDecrease = getAmountToDecrease(shipType);
    //             }
    //             uint256 j = i;
    //             for (j; j < chanceArray.length; j++) {
    //                 if (chanceArray[j] >= randomNumber) {
    //                     chanceArray[j] -= amountToDecrease;
    //                 }
    //                 ranAlready = true;
    //             }
    //         }
    //     }
    //     battleIdToAttackerCumulativeSumOdds[battleId] -= amountToDecrease;
    //     uint256[] storage defenderLosses = battleIdToAttackerLosses[battleId];
    //     defenderLosses.push(shipType);
    // }

    // function getAmountToDecrease(
    //     uint256 shipType
    // ) internal pure returns (uint256) {
    //     uint256 amountToDecrease;
    //     if (shipType == 1) {
    //         amountToDecrease = 15;
    //     } else if (shipType == 2) {
    //         amountToDecrease = 13;
    //     } else if (shipType == 3) {
    //         amountToDecrease = 11;
    //     } else if (shipType == 4) {
    //         amountToDecrease = 10;
    //     } else if (shipType == 5) {
    //         amountToDecrease = 8;
    //     } else if (shipType == 6) {
    //         amountToDecrease = 5;
    //     } else if (shipType == 7) {
    //         amountToDecrease = 4;
    //     } else if (shipType == 8) {
    //         amountToDecrease = 1;
    //     }
    //     return amountToDecrease;
    // }
}
