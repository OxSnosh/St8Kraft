//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "./War.sol";
import "./Fighters.sol";
import "./Bombers.sol";
import "./Infrastructure.sol";
import "./Forces.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "./Forces.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "hardhat/console.sol";

///@title AirBattleContract
///@author OxSnosh
///@dev this contract allows you to launch a bombing campaign against another nation
contract AirBattleContract is Ownable, VRFConsumerBaseV2, ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint256 airBattleId;
    address warAddress;
    address fighterAddress;
    address bomberAddress;
    address infrastructure;
    address forces;
    address missiles;
    address wonders1;
    address fighterLosses;
    address countryMinter;
    //fighter strength
    uint256 yak9Strength = 1;
    uint256 p51MustangStrength = 2;
    uint256 f86SabreStrength = 3;
    uint256 mig15Strength = 4;
    uint256 f100SuperSabreStrength = 5;
    uint256 f35LightningStrength = 6;
    uint256 f15EagleStrength = 7;
    uint256 su30MkiStrength = 8;
    uint256 f22RaptorStrength = 9;
    //bomber strength
    uint256 ah1CobraStrength = 1;
    uint256 ah64ApacheStrength = 2;
    uint256 bristolBlenheimStrength = 3;
    uint256 b52MitchellStrength = 4;
    uint256 b17gFlyingFortressStrength = 5;
    uint256 b52StratofortressStrength = 6;
    uint256 b2SpiritStrength = 7;
    uint256 b1bLancerStrength = 8;
    uint256 tupolevTu160Strength = 9;

    WarContract war;
    FightersContract fighter;
    BombersContract bomber;
    InfrastructureContract inf;
    ForcesContract force;
    MissilesContract mis;
    WondersContract1 won1;
    FighterLosses fighterLoss;
    CountryMinter mint;

    uint256[] private s_randomWords;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 6;

    struct AirBattle {
        uint256 warId;
        uint256 attackerId;
        uint256 defenderId;
        uint256[] attackerFighterArray;
        uint256[] attackerBomberArray;
        uint256[] defenderFighterArray;
        uint256[] attackerFighterCasualties;
        uint256[] attackerBomberCasualties;
        uint256[] defenderFighterCasualties;
        uint256[] damage;
    }

    mapping(uint256 => AirBattle) airBattleIdToAirBattle;

    mapping(uint256 => uint256[]) airBattleIdToAttackerFighters;
    mapping(uint256 => uint256[]) airBattleIdToAttackerBombers;
    // mapping(uint256 => uint256) airBattleIdToAttackerFighterStrength;
    mapping(uint256 => uint256) airBattleIdToAttackerFighterSum;
    mapping(uint256 => uint256) airBattleIdToAttackerBomberSum;
    mapping(uint256 => uint256[]) airBattleIdToAttackerFighterLosses;

    mapping(uint256 => uint256[]) airBattleIdToDefenderFighters;
    mapping(uint256 => uint256[]) airBattleIdToDefendederFighterArray;
    // mapping(uint256 => uint256) airBattleIdToDefendingFighterStrength;
    mapping(uint256 => uint256) airBattleIdToDefenderFighterSum;
    mapping(uint256 => uint256[]) airBattleIdToDefenderFighterLosses;

    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;

    ///@dev this is the constructor funtion for the contact
    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    ///@dev this function is only callable by the owner
    ///@dev this function will be called right after deployment in order to set up contract pointers
    function settings(
        address _warAddress,
        address _fighter,
        address _bomber,
        address _infrastructure,
        address _forces,
        address _fighterLosses
    ) public onlyOwner {
        warAddress = _warAddress;
        fighterAddress = _fighter;
        fighter = FightersContract(_fighter);
        bomberAddress = _bomber;
        bomber = BombersContract(_bomber);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        forces = _forces;
        force = ForcesContract(_forces);
        fighterLosses = _fighterLosses;
        fighterLoss = FighterLosses(_fighterLosses);
    }

    ///@dev this function is only callable by the owner of the contract
    function updateWarAddress(address newAddress) public onlyOwner {
        warAddress = newAddress;
    }

    ///@dev this function is only callable by the owner of the contract
    function updateFighterAddress(address newAddress) public onlyOwner {
        fighterAddress = newAddress;
        fighter = FightersContract(newAddress);
    }

    ///@dev this function is only callable by the owner of the contract
    function updateBomberAddress(address newAddress) public onlyOwner {
        bomberAddress = newAddress;
        bomber = BombersContract(newAddress);
    }

    ///@dev this function is only callable by the owner of the contract
    function updateInfrastructureAddress(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    ///@dev this function is only callable by the owner of the contract
    function updateForcesAddress(address newAddress) public onlyOwner {
        forces = newAddress;
        force = ForcesContract(newAddress);
    }

    ///@dev this function is only callable by the owner of the contract
    function updateFighterLossesAddress(address newAddress) public onlyOwner {
        fighterLosses = newAddress;
        fighterLoss = FighterLosses(newAddress);
    }

    ///@dev this function is only callable by the owner of the contract
    function updateMissilesAddress(address newAddress) public onlyOwner {
        missiles = newAddress;
        mis = MissilesContract(newAddress);
    }

    ///@dev this function is only callable by the owner of the contract
    function updateWonders1Address(address newAddress) public onlyOwner {
        wonders1 = newAddress;
        won1 = WondersContract1(newAddress);
    }

    ///@dev this function is a public function
    ///@notice this function allows one nation to launch a bombing campaign against another nation
    ///@notice can only be called if a war is active between the two nations
    ///@param warId is the ID of the current war between the two nations
    ///@param attackerId is the nation ID of the attacker nation
    ///@param defenderId is the nation ID of the defending nation
    function airBattle(
        uint256 warId,
        uint256 attackerId,
        uint256 defenderId,
        uint256[] memory attackerFighterArray,
        uint256[] memory attackerBomberArray
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
            "attacker not involved in this war"
        );
        require(
            warDefense == attackerId || warDefense == defenderId,
            "defender not involved in this war"
        );
        uint256 attackerFighterSum = getAttackerFighterSum(
            attackerFighterArray
        );
        uint256 attackerBomberSum = getAttackerBomberSum(attackerBomberArray);
        airBattleIdToAttackerFighterSum[airBattleId] = attackerFighterSum;
        airBattleIdToAttackerBomberSum[airBattleId] = attackerBomberSum;
        uint256 attackSum = (attackerFighterSum + attackerBomberSum);
        require(attackSum <= 25, "cannot send more than 25 planes on a sortie");
        bool fighterCheck = verifyAttackerFighterArrays(
            attackerId,
            attackerFighterArray
        );
        bool bomberCheck = verifyAttackerBomberArray(
            attackerId,
            attackerBomberArray
        );
        require(fighterCheck, "!fighter check");
        require(bomberCheck, "!bomber check");
        AirBattle storage newAirBattle = airBattleIdToAirBattle[airBattleId];
        newAirBattle.warId = warId;
        newAirBattle.attackerId = attackerId;
        newAirBattle.defenderId = defenderId;
        newAirBattle.attackerFighterArray = attackerFighterArray;
        newAirBattle.attackerBomberArray = attackerBomberArray;
        // airBattleIdToAttackerFighters[airBattleId] = attackerFighterArray;
        // airBattleIdToAttackerBombers[airBattleId] = attackerBomberArray;
        generateDefenderFighters(defenderId, airBattleId);
        fulfillRequest(airBattleId);
        airBattleId++;
    }

    //make a function that will verify that the attacker has the planes included in the arrays
    function verifyAttackerFighterArrays(
        uint256 attackerId,
        uint256[] memory attackerFighterArray
    ) internal view returns (bool) {
        uint256 yak9Count = fighter.getYak9Count(attackerId);
        uint256 p51MustangCount = fighter.getP51MustangCount(attackerId);
        uint256 f86SabreCount = fighter.getF86SabreCount(attackerId);
        uint256 mig15Count = fighter.getMig15Count(attackerId);
        uint256 f100SuperSabreCount = fighter.getF100SuperSabreCount(
            attackerId
        );
        uint256 f35LightningCount = fighter.getF35LightningCount(attackerId);
        uint256 f15EagleCount = fighter.getF15EagleCount(attackerId);
        uint256 su30MkiCount = fighter.getSu30MkiCount(attackerId);
        uint256 f22RaptorCount = fighter.getF22RaptorCount(attackerId);
        require(yak9Count >= attackerFighterArray[0], "not enough yak9s");
        require(p51MustangCount >= attackerFighterArray[1], "not enough p51s");
        require(f86SabreCount >= attackerFighterArray[2], "not enough f86s");
        require(mig15Count >= attackerFighterArray[3], "not enough mig15s");
        require(
            f100SuperSabreCount >= attackerFighterArray[4],
            "not enough f100s"
        );
        require(
            f35LightningCount >= attackerFighterArray[5],
            "not enough f35s"
        );
        require(f15EagleCount >= attackerFighterArray[6], "not enough f15s");
        require(su30MkiCount >= attackerFighterArray[7], "not enough su30s");
        require(f22RaptorCount >= attackerFighterArray[8], "not enough f22s");
        return true;
    }

    function getAttackerFighterSum(
        uint256[] memory attackerFighterArray
    ) internal pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < attackerFighterArray.length; i++) {
            sum += attackerFighterArray[i];
        }
        return sum;
    }

    function getAttackerBomberSum(
        uint256[] memory attackerBomberArray
    ) internal pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < attackerBomberArray.length; i++) {
            sum += attackerBomberArray[i];
        }
        return sum;
    }

    function verifyAttackerBomberArray(
        uint256 attackerId,
        uint256[] memory attackerBomberArray
    ) internal view returns (bool) {
        uint256 ah1CobraCount = bomber.getAh1CobraCount(attackerId);
        uint256 ah64ApacheCount = bomber.getAh64ApacheCount(attackerId);
        uint256 bristolBlenheimCount = bomber.getBristolBlenheimCount(
            attackerId
        );
        uint256 b52MitchellCount = bomber.getB52MitchellCount(attackerId);
        uint256 b17gFlyingFortressCount = bomber.getB17gFlyingFortressCount(
            attackerId
        );
        uint256 b52StratoFortressCount = bomber.getB52StratofortressCount(
            attackerId
        );
        uint256 b2SpiritCount = bomber.getB2SpiritCount(attackerId);
        uint256 b1bLancerCount = bomber.getB1bLancerCount(attackerId);
        uint256 tupolevTu160Count = bomber.getTupolevTu160Count(attackerId);
        require(ah1CobraCount >= attackerBomberArray[0], "not enough ah1s");
        require(ah64ApacheCount >= attackerBomberArray[1], "not enough ah64s");
        require(
            bristolBlenheimCount >= attackerBomberArray[2],
            "not enough bristols"
        );
        require(
            b52MitchellCount >= attackerBomberArray[3],
            "not enough b52 Mitchells"
        );
        require(
            b17gFlyingFortressCount >= attackerBomberArray[4],
            "not enough b17s"
        );
        require(
            b52StratoFortressCount >= attackerBomberArray[5],
            "not enough b52 Strato's"
        );
        require(
            b2SpiritCount >= attackerBomberArray[6],
            "not enough b2 Spirits"
        );
        require(
            b1bLancerCount >= attackerBomberArray[7],
            "not enough b1b Lancers"
        );
        require(
            tupolevTu160Count >= attackerBomberArray[8],
            "not enough tupolev's"
        );
        return true;
    }

    function generateDefenderFighters(
        uint256 defenderId,
        uint256 _airBattleId
    ) internal {
        uint256 yak9Count = fighter.getYak9Count(defenderId);
        uint256 p51MustangCount = fighter.getP51MustangCount(defenderId);
        uint256 f86SabreCount = fighter.getF86SabreCount(defenderId);
        uint256 mig15Count = fighter.getMig15Count(defenderId);
        uint256 f100SuperSabreCount = fighter.getF100SuperSabreCount(
            defenderId
        );
        uint256 f35LightningCount = fighter.getF35LightningCount(defenderId);
        uint256 f15EagleCount = fighter.getF15EagleCount(defenderId);
        uint256 su30MkiCount = fighter.getSu30MkiCount(defenderId);
        uint256 f22RaptorCount = fighter.getF22RaptorCount(defenderId);
        uint256[] memory defenderFighterArray = new uint256[](9);
        defenderFighterArray[0] = yak9Count;
        defenderFighterArray[1] = p51MustangCount;
        defenderFighterArray[2] = f86SabreCount;
        defenderFighterArray[3] = mig15Count;
        defenderFighterArray[4] = f100SuperSabreCount;
        defenderFighterArray[5] = f35LightningCount;
        defenderFighterArray[6] = f15EagleCount;
        defenderFighterArray[7] = su30MkiCount;
        defenderFighterArray[8] = f22RaptorCount;
        // airBattleIdToDefenderFighters[_airBattleId] = defenderFighterArray;
        AirBattle storage newAirBattle = airBattleIdToAirBattle[_airBattleId];
        newAirBattle.defenderFighterArray = defenderFighterArray;
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

    bytes32 jobId;
    address oracleAddress;
    uint256 fee;

    function updateJobId(bytes32 _jobId) public onlyOwner {
        jobId = _jobId;
    }

    function updateOracleAddress(address _oracleAddress) public onlyOwner {
        oracleAddress = _oracleAddress;
    }

    function updateFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.completeAirBattle.selector
        );
        uint256[] memory defenderFighters = airBattleIdToAirBattle[
            requestNumber
        ].defenderFighterArray;
        uint256[] memory attackerFighters = airBattleIdToAirBattle[
            requestNumber
        ].attackerFighterArray;
        uint256[] memory attackerBombers = airBattleIdToAirBattle[requestNumber]
            .attackerBomberArray;
        uint256 attackerId = airBattleIdToAirBattle[requestNumber].attackerId;
        uint256 defenderId = airBattleIdToAirBattle[requestNumber].defenderId;
        req.addUint("orderId", requestNumber);
        req.addBytes("defenderFighters", abi.encodePacked(defenderFighters));
        req.addBytes("attackerFighters", abi.encodePacked(attackerFighters));
        req.addBytes("attackerBombers", abi.encodePacked(attackerBombers));
        req.addBytes("randomNumbers", abi.encodePacked(randomWords));
        req.addUint("attackerId", attackerId);
        req.addUint("defenderId", defenderId);
        sendChainlinkRequestTo(oracleAddress, req, fee);
    }

    function completeAirBattle(
        uint256[] memory attackerFighterCasualties,
        uint256[] memory attackerBomberCasualties,
        uint256[] memory defenderFighterCasualties,
        uint256 attackerId,
        uint256 defenderId,
        uint256 infrastructureDamage,
        uint256 tankDamage,
        uint256 cruiseMissileDamage
    ) public {
        fighterLoss.decrementLosses(attackerFighterCasualties, attackerId);
        bomber.decrementBomberLosses(attackerBomberCasualties, attackerId);
        fighterLoss.decrementLosses(defenderFighterCasualties, defenderId);
        inf.decreaseInfrastructureCountFromAirBattleContract(
            defenderId,
            infrastructureDamage
        );
        force.decreaseDefendingTankCountFromAirBattleContract(
            defenderId,
            tankDamage
        );
        mis.decreaseCruiseMissileCountFromAirBattleContract(
            defenderId,
            cruiseMissileDamage
        );
        uint256[3] memory damage = [
            infrastructureDamage,
            tankDamage,
            cruiseMissileDamage
        ];
        AirBattle storage newAirBattle = airBattleIdToAirBattle[airBattleId];
        newAirBattle.attackerFighterCasualties = attackerFighterCasualties;
        newAirBattle.attackerBomberCasualties = attackerBomberCasualties;
        newAirBattle.defenderFighterCasualties = defenderFighterCasualties;
        newAirBattle.damage = damage;
    }
}
