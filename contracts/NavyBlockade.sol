//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Navy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract NavalAttackContract is Ownable, VRFConsumerBaseV2 {
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
        uint256 attackerShips = nav.getBlockadeCapableShips(attackerId);
        require(attackerShips >= 5, "not anough blockade capable ships");
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
