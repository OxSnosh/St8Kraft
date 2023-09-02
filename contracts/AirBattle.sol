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

    event AirAssaultLaunched(
        uint256 indexed battleId,
        uint256 indexed attackerId,
        uint256 indexed defenderId,
        uint256[] attackerFighterArray,
        uint256[] attackerBomberArray,
        uint256[] defenderFighterArray,
        uint256 warId
    );

    event AirAssaultCasualties(
        uint256 indexed battleId,
        uint256 indexed attackerId,
        uint256 indexed defenderId,
        uint256[] attackerFighterCasualties,
        uint256[] attackerBomberCasualties,
        uint256[] defenderFighterCasualties,
        uint256 warId
    );

    mapping(uint256 => AirBattle) airBattleIdToAirBattle;

    mapping(uint256 => uint256[]) airBattleIdToAttackerFighters;
    mapping(uint256 => uint256[]) airBattleIdToAttackerBombers;
    mapping(uint256 => uint256) airBattleIdToAttackerFighterSum;
    mapping(uint256 => uint256) airBattleIdToAttackerBomberSum;
    mapping(uint256 => uint256[]) airBattleIdToAttackerFighterLosses;

    mapping(uint256 => uint256[]) airBattleIdToDefenderFighters;
    mapping(uint256 => uint256[]) airBattleIdToDefendederFighterArray;
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
        completeAirBattleLaunch(
            warId,
            attackerId,
            defenderId,
            attackerFighterArray,
            attackerBomberArray,
            airBattleId
        );
        airBattleId++;
    }

    function completeAirBattleLaunch(
        uint256 warId,
        uint256 attackerId,
        uint256 defenderId,
        uint256[] memory attackerFighterArray,
        uint256[] memory attackerBomberArray,
        uint256 _airBattleId
    ) internal {
        AirBattle storage newAirBattle = airBattleIdToAirBattle[_airBattleId];
        newAirBattle.warId = warId;
        newAirBattle.attackerId = attackerId;
        newAirBattle.defenderId = defenderId;
        newAirBattle.attackerFighterArray = attackerFighterArray;
        newAirBattle.attackerBomberArray = attackerBomberArray;
        uint256[] memory defenderFighterArray = generateDefenderFighters(defenderId, _airBattleId);
        emit AirAssaultLaunched(
            airBattleId,
            attackerId,
            defenderId,
            attackerFighterArray,
            attackerBomberArray,
            defenderFighterArray,
            warId
        );
        fulfillRequest(_airBattleId);
    }

    //make a function that will verify that the attacker has the planes included in the arrays
    function verifyAttackerFighterArrays(
        uint256 attackerId,
        uint256[] memory attackerFighterArray
    ) internal view returns (bool) {
        require(
            fighter.getYak9Count(attackerId) >= attackerFighterArray[0],
            "not enough yak9s"
        );
        require(
            fighter.getP51MustangCount(attackerId) >= attackerFighterArray[1],
            "not enough p51s"
        );
        require(
            fighter.getF86SabreCount(attackerId) >= attackerFighterArray[2],
            "not enough f86s"
        );
        require(
            fighter.getMig15Count(attackerId) >= attackerFighterArray[3],
            "not enough mig15s"
        );
        require(
            fighter.getF100SuperSabreCount(attackerId) >=
                attackerFighterArray[4],
            "not enough f100s"
        );
        require(
            fighter.getF35LightningCount(attackerId) >= attackerFighterArray[5],
            "not enough f35s"
        );
        require(
            fighter.getF15EagleCount(attackerId) >= attackerFighterArray[6],
            "not enough f15s"
        );
        require(
            fighter.getSu30MkiCount(attackerId) >= attackerFighterArray[7],
            "not enough su30s"
        );
        require(
            fighter.getF22RaptorCount(attackerId) >= attackerFighterArray[8],
            "not enough f22s"
        );
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
        require(
            bomber.getAh64ApacheCount(attackerId) >= attackerBomberArray[1],
            "not enough ah64s"
        );
        require(
            bomber.getBristolBlenheimCount(attackerId) >=
                attackerBomberArray[2],
            "not enough bristols"
        );
        require(
            bomber.getB52MitchellCount(attackerId) >= attackerBomberArray[3],
            "not enough b52 Mitchells"
        );
        require(
            bomber.getB17gFlyingFortressCount(attackerId) >=
                attackerBomberArray[4],
            "not enough b17s"
        );
        require(
            bomber.getB52StratofortressCount(attackerId) >=
                attackerBomberArray[5],
            "not enough b52 Strato's"
        );
        require(
            bomber.getB2SpiritCount(attackerId) >= attackerBomberArray[6],
            "not enough b2 Spirits"
        );
        require(
            bomber.getB1bLancerCount(attackerId) >= attackerBomberArray[7],
            "not enough b1b Lancers"
        );
        require(
            bomber.getTupolevTu160Count(attackerId) >= attackerBomberArray[8],
            "not enough tupolev's"
        );
        return true;
    }

    function generateDefenderFighters(
        uint256 defenderId,
        uint256 _airBattleId
    ) internal returns (uint256[] memory) {
        uint256[] memory defenderFighterArray = new uint256[](9);
        defenderFighterArray[0] = fighter.getYak9Count(defenderId);
        defenderFighterArray[1] = fighter.getP51MustangCount(defenderId);
        defenderFighterArray[2] = fighter.getF86SabreCount(defenderId);
        defenderFighterArray[3] = fighter.getMig15Count(defenderId);
        defenderFighterArray[4] = fighter.getF100SuperSabreCount(defenderId);
        defenderFighterArray[5] = fighter.getF35LightningCount(defenderId);
        defenderFighterArray[6] = fighter.getF15EagleCount(defenderId);
        defenderFighterArray[7] = fighter.getSu30MkiCount(defenderId);
        defenderFighterArray[8] = fighter.getF22RaptorCount(defenderId);
        AirBattle storage newAirBattle = airBattleIdToAirBattle[_airBattleId];
        newAirBattle.defenderFighterArray = defenderFighterArray;
        return defenderFighterArray;
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
        uint256 cruiseMissileDamage,
        uint256 battleId
    ) public {
        fighterLoss.decrementLosses(attackerFighterCasualties, attackerId);
        bomber.decrementBomberLosses(attackerBomberCasualties, attackerId);
        fighterLoss.decrementLosses(defenderFighterCasualties, defenderId);
        bool antiAir = won1.getAntiAirDefenseNewtwork(defenderId);
        if (antiAir) {
            infrastructureDamage = ((infrastructureDamage * 60) / 100);
            tankDamage = ((tankDamage * 60) / 100);
            cruiseMissileDamage = ((cruiseMissileDamage * 60) / 100);
        }
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
        emit AirAssaultCasualties(
            battleId,
            newAirBattle.attackerId,
            newAirBattle.defenderId,
            attackerFighterCasualties,
            attackerBomberCasualties,
            defenderFighterCasualties,
            newAirBattle.warId
        );
    }
}
