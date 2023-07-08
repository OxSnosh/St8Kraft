//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "./Infrastructure.sol";
import "./Forces.sol";
import "./Military.sol";
import "./NationStrength.sol";
import "./Treasury.sol";
import "./CountryParameters.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "./KeeperFile.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "hardhat/console.sol";

///@title SpyOperationsContract
///@author OxSnosh
///@dev this contact inherits from openzeppelin's ownable contract
///@dev this contract inherits from chanlinks VRF contract
contract SpyOperationsContract is Ownable, VRFConsumerBaseV2, ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint256 public attackId;
    address public forces;
    address public infrastructure;
    address public military;
    address public nationStrength;
    address public treasury;
    address public parameters;
    address public missiles;
    address public wonders1;
    address public wonders2;
    address public countryMinter;
    address public keeper;

    //Chainlik Variables
    uint256[] private s_randomWords;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 3;

    ForcesContract force;
    InfrastructureContract inf;
    MilitaryContract mil;
    NationStrengthContract strength;
    TreasuryContract tsy;
    CountryParametersContract params;
    MissilesContract mis;
    WondersContract1 won1;
    WondersContract2 won2;
    CountryMinter mint;
    KeeperContract keep;

    struct SpyAttack {
        uint256 encryptedAttackerId;
        uint256 defenderId;
        uint256 attackType;
        bool attackThwarted;
        uint256 attackerId;
    }

    mapping(uint256 => SpyAttack) spyAttackIdToSpyAttack;
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_randomnessRequestIdToRandomWords;

    event randomNumbersRequested(uint256 indexed requestId);

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
        address _infrastructure,
        address _forces,
        address _military,
        address _nationStrength,
        address _wonders1,
        address _wonders2,
        address _treasury,
        address _parameters,
        address _missiles,
        address _countryMinter
    ) public onlyOwner {
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        forces = _forces;
        force = ForcesContract(_forces);
        military = _military;
        mil = MilitaryContract(_military);
        nationStrength = _nationStrength;
        strength = NationStrengthContract(_nationStrength);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        wonders2 = _wonders2;
        won2 = WondersContract2(_wonders2);
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
        parameters = _parameters;
        params = CountryParametersContract(_parameters);
        missiles = _missiles;
        mis = MissilesContract(_missiles);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
    }

    function settings2(address _keeper) public onlyOwner {
        keeper = _keeper;
        keep = KeeperContract(_keeper);
    }

    function updateInfrastructureContract(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    bytes32 trainSpyJobId;
    address oracleAddress;
    uint256 fee;
    mapping(uint256 => bytes) attackIdToTrainedSpyPayload;
    mapping(uint256 => uint256) attackIdToDayTrained;
    mapping(uint256 => uint256) attackIdToAttackType;

    function updateTrainSpyJobId(bytes32 _jobId) public onlyOwner {
        trainSpyJobId = _jobId;
    }

    function updateOracleAddress(address _oracleAddress) public onlyOwner {
        oracleAddress = _oracleAddress;
    }

    function updateFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    /**@param attackType is the type of attack
     * 1. destroy cruise missiles
     * 2. destroy defending tanks
     * 3. capture land
     * 4. change governemnt
     * 5. change religion
     * 6. chenge threat level
     * 7. change defcon
     * 8. destroy spies
     * 9. capture tech
     * 10. sabatoge taxes
     * 11. capture money reserves
     * 12. capture infrastructure
     * 13. destroy nukes
     */
    function trainSpy(
        uint256 encryptedAttackerId,
        uint256 encryptedDefenderId,
        uint256 attackType
    ) public {
        require(attackType >= 1, "invalid attack type");
        require(attackType <= 13, "invalid attack type");
        attackIdToAttackType[attackId] = attackType;
        Chainlink.Request memory req = buildChainlinkRequest(
            trainSpyJobId,
            address(this),
            this.completeSpyTraining.selector
        );
        req.addUint("attackId", attackId);
        req.addUint("encryptedAttackerId", encryptedAttackerId);
        req.addUint("encryptedDefenderId", encryptedDefenderId);
        req.addUint("attackType", attackType);
        req.addBytes("msgSender", abi.encodePacked(msg.sender));
        sendChainlinkRequestTo(oracleAddress, req, fee);
        attackId++;
    }

    function completeSpyTraining(
        uint256 _attackId,
        bytes memory encryptedPayload
    ) public {
        attackIdToTrainedSpyPayload[_attackId] = encryptedPayload;
        uint256 gameDay = keep.getGameDay();
        attackIdToDayTrained[_attackId] = gameDay;
    }

    uint256 randomnessRequestId;

    mapping(uint256 => uint256) randomnessRequestToAttackId;
    mapping(uint256 => uint256) randomnessRequestToEncryptedAttackerId;
    mapping(uint256 => uint256) randomnessRequestToDefenderId;

    ///@dev this functin is callable only by a nation owner and will allow a naton to conduct a spy operation
    ///@notice this function will allow a nation to conduct a spy operation against another nation
    ///@param encryptedAttackerId is the id of the attacking nation
    ///@param defenderId is the id of the defending nation
    ///@param _attackId is the id of the attack as it is stored on this contract
    function conductSpyOperation(
        uint256 encryptedAttackerId,
        uint256 defenderId,
        uint256 _attackId
    ) public {
        uint256 gameDay = keep.getGameDay();
        uint256 trainingDay = attackIdToDayTrained[_attackId];
        require((gameDay - trainingDay) <= 5, "spy training expired");
        uint256 attackType = attackIdToAttackType[_attackId];
        uint256 infrastructureAmount = inf.getInfrastructureCount(defenderId);
        uint256 techAmount = inf.getTechnologyCount(defenderId);
        uint256 landAmount = inf.getLandCount(defenderId);
        if (attackType == 4) {
            require(
                landAmount >= 15,
                "defender does not have enough land to conduct operation"
            );
        }
        if (attackType == 10) {
            require(
                techAmount >= 15,
                "defender does not have enough tech to conduct operation"
            );
        }
        if (attackType == 13) {
            require(
                infrastructureAmount >= 15,
                "defender does not have enough infrastructure to conduct operation"
            );
        }
        uint256 nukeCount = mis.getNukeCount(defenderId);
        bool silo = won2.getHiddenNuclearMissileSilo(defenderId);
        if (attackType == 14) {
            if (silo) {
                require(
                    nukeCount >= 6,
                    "defender does not have enough nukes to conduct operation"
                );
            } else {
                require(
                    nukeCount >= 1,
                    "defender does not have enough nukes to conduct operation"
                );
            }
        }
        randomnessRequestToAttackId[randomnessRequestId] = _attackId;
        randomnessRequestToEncryptedAttackerId[
            randomnessRequestId
        ] = encryptedAttackerId;
        randomnessRequestToDefenderId[randomnessRequestId] = defenderId;
        fulfillRequest(randomnessRequestId);
        randomnessRequestId++;
    }

    //make internal
    function fulfillRequest(uint256 _randomnessRequestId) public {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToRequestIndex[requestId] = _randomnessRequestId;
        emit randomNumbersRequested(_randomnessRequestId);
    }

    bytes32 executeAttackJobId;

    function updateExecuteAttackJobId(bytes32 _jobId) public onlyOwner {
        executeAttackJobId = _jobId;
    }

    function fulfillRandomWords(
        uint256 _randomnessRequestId,
        uint256[] memory randomWords
    ) internal override {
        s_randomnessRequestIdToRandomWords[_randomnessRequestId] = randomWords;
        uint256 defenderIdOfRequest = randomnessRequestToDefenderId[
            _randomnessRequestId
        ];
        uint256 encryptedAttackerIdOfRequest = randomnessRequestToEncryptedAttackerId[
                _randomnessRequestId
            ];
        uint256 _attackIdOfRequest = randomnessRequestToAttackId[
            _randomnessRequestId
        ];
        bytes memory encryptedPayload = attackIdToTrainedSpyPayload[
            _attackIdOfRequest
        ];
        Chainlink.Request memory req = buildChainlinkRequest(
            executeAttackJobId,
            address(this),
            this.completeSpyAttack.selector
        );
        req.addUint("defederIdOfRequest", defenderIdOfRequest);
        req.addUint(
            "encryptedAttackerIdOfRequest",
            encryptedAttackerIdOfRequest
        );
        req.addBytes("encryptedPayload", encryptedPayload);
        req.addBytes("randomNumber", abi.encodePacked(randomWords[0]));
        req.addUint("randomnessRequestId", _randomnessRequestId);
        sendChainlinkRequestTo(oracleAddress, req, fee);
    }

    function getAttackerSuccessScore(
        uint256 countryId
    ) public view returns (uint256) {
        uint256 spyCount = force.getSpyCount(countryId);
        uint256 techAmount = inf.getTechnologyCount(countryId);
        uint256 attackSuccessScore = (spyCount + (techAmount / 15));
        bool cia = won1.getCentralIntelligenceAgency(countryId);
        if (cia) {
            attackSuccessScore = ((attackSuccessScore * 110) / 100);
        }
        bool accomodativeGovt = checkAccomodativeGovernment(countryId);
        if (accomodativeGovt) {
            attackSuccessScore = ((attackSuccessScore * 110) / 100);
        }
        return attackSuccessScore;
    }

    function checkAccomodativeGovernment(uint256 countryId)
        public
        view
        returns (bool)
    {
        uint256 government = params.getGovernmentType(
            countryId
        );
        if (
            government == 2 ||
            government == 7 ||
            government == 10
        ) {
            return true;
        } else {
            return false;
        }
    }

    function getDefenseSuccessScore(
        uint256 countryId
    ) public view returns (uint256) {
        uint256 spyCount = force.getSpyCount(countryId);
        uint256 techAmount = inf.getTechnologyCount(countryId);
        uint256 landAmount = inf.getLandCount(countryId);
        uint256 threatLevel = mil.getThreatLevel(countryId);
        uint256 defenseSuccessScoreGross = (spyCount +
            (techAmount / 20) +
            (landAmount / 70));
        uint256 defenseSuccessScore;
        if (threatLevel == 1) {
            defenseSuccessScore = ((defenseSuccessScoreGross * 75) / 100);
        } else if (threatLevel == 2) {
            defenseSuccessScore = ((defenseSuccessScoreGross * 90) / 100);
        } else if (threatLevel == 3) {
            defenseSuccessScore = defenseSuccessScoreGross;
        } else if (threatLevel == 4) {
            defenseSuccessScore = ((defenseSuccessScoreGross * 110) / 100);
        } else {
            defenseSuccessScore = ((defenseSuccessScoreGross * 125) / 100);
        }
        return defenseSuccessScore;
    }

    event spyAttackThwart(
        uint256 indexed attackId,
        uint256 indexed decryptedAttackerId,
        uint256 indexed defenderId
    );

    function completeSpyAttack(
        bool success,
        uint256 _attackId,
        uint256 decryptedAttackerId,
        uint256 defenderId,
        uint256 attackType,
        uint256 _randomnessRequestId,
        bool valid
    ) public {
        require (valid, "invalid attack");
        if (!success) {
            emit spyAttackThwart(
                _attackId,
                decryptedAttackerId,
                defenderId
            );
        } else if (success) {
            if (attackType == 1) {
                destroyCruiseMissiles(defenderId, _randomnessRequestId);
            } else if (attackType == 2) {
                destroyDefendingTanks(defenderId, _randomnessRequestId);
            } else if (attackType == 3) {
                captureLand(defenderId, _randomnessRequestId);
            } else if (attackType == 4) {
                changeDesiredGovernment(defenderId, _randomnessRequestId);
            } else if (attackType == 5) {
                changeDesiredReligion(defenderId, _randomnessRequestId);
            } else if (attackType == 6) {
                changeThreatLevel(defenderId);
            } else if (attackType == 7) {
                changeDefconLevel(defenderId);
            } else if (attackType == 8) {
                destroySpies(defenderId, _randomnessRequestId);
            } else if (attackType == 9) {
                captueTechnology(defenderId, _randomnessRequestId);
            } else if (attackType == 10) {
                sabotogeTaxes(defenderId, _randomnessRequestId);
            } else if (attackType == 11) {
                destroyMoneyReserves(defenderId);
            } else if (attackType == 12) {
                captureInfrastructure(defenderId, _randomnessRequestId);
            } else {
                destroyNukes(defenderId);
            }
        }
    }

    function destroyCruiseMissiles(
        uint256 defenderId,
        uint256 _randomnessRequestId
    ) internal {
        uint256[] memory randomNumbers = s_randomnessRequestIdToRandomWords[
            _randomnessRequestId
        ];
        uint256 randomNumber2 = (randomNumbers[1] % 5) + 1;
        mis.decreaseCruiseMissileCount(randomNumber2, defenderId);
    }

    function destroyDefendingTanks(
        uint256 defenderId,
        uint256 _randomnessRequestId
    ) internal {
        //random number between 5% and 10%
        uint256[] memory randomNumbers = s_randomnessRequestIdToRandomWords[
            _randomnessRequestId
        ];
        uint256 randomNumber = ((randomNumbers[1] % 5) + 5);
        uint256 defendingTankCount = force.getDefendingTankCount(defenderId);
        uint256 tankAmountToDecrease = ((defendingTankCount * randomNumber) /
            100);
        force.decreaseDefendingTankCount(tankAmountToDecrease, defenderId);
    }

    function captureLand(
        uint256 defenderId,
        uint256 _randomnessRequestId
    ) internal {
        //random number between 5 and 15
        uint256[] memory randomNumbers = s_randomnessRequestIdToRandomWords[
            _randomnessRequestId
        ];
        uint256 randomNumberToDecreaseFromDefender = ((randomNumbers[1] % 10) +
            5);
        inf.decreaseLandCountFromSpyContract(defenderId, randomNumberToDecreaseFromDefender);
    }

    function changeDesiredGovernment(
        uint256 defenderId,
        uint256 _randomnessRequestId
    ) internal {
        //new government randomly chosen
        uint256[] memory randomNumbers = s_randomnessRequestIdToRandomWords[
            _randomnessRequestId
        ];
        uint256 governmentPreference = params.getGovernmentPreference(
            defenderId
        );
        uint256 newPreference = ((randomNumbers[1] % 10) + 1);
        if (newPreference == governmentPreference) {
            if (governmentPreference == 1) {
                newPreference += 1;
            } else {
                newPreference -= 1;
            }
        }
        params.updateDesiredGovernment(defenderId, newPreference);
    }

    function changeDesiredReligion(
        uint256 defenderId,
        uint256 _randomnessRequestId
    ) internal {
        //new religion randomly chosen
        uint256[] memory randomNumbers = s_randomnessRequestIdToRandomWords[
            _randomnessRequestId
        ];
        uint256 religionPreference = params.getReligionPreference(defenderId);
        uint256 newPreference = ((randomNumbers[1] % 14) + 1);
        if (newPreference == religionPreference) {
            if (religionPreference == 1) {
                newPreference += 1;
            } else {
                newPreference -= 1;
            }
        }
        params.updateDesiredReligion(defenderId, newPreference);
    }

    function changeThreatLevel(
        uint256 defenderId
    ) internal {
        mil.setThreatLevelFromSpyContract(defenderId, 1);
    }

    function changeDefconLevel(
        uint256 defenderId
    ) internal {
        mil.setDefconLevelFromSpyContract(defenderId, 5);
    }

    function destroySpies(
        uint256 defenderId,
        uint256 _randomnessRequestId
    ) internal {
        //max 20
        uint256[] memory randomNumbers = s_randomnessRequestIdToRandomWords[
            _randomnessRequestId
        ];
        uint256 spyCount = force.getSpyCount(defenderId);
        uint256 spyCountToDestroy = ((randomNumbers[1] % 20) + 1);
        if (spyCountToDestroy > spyCount) {
            spyCountToDestroy = spyCount;
        }
        force.decreaseDefenderSpyCount(spyCountToDestroy, defenderId);
    }

    function captueTechnology(
        uint256 defenderId,
        uint256 _randomnessRequestId
    ) internal {
        //random number between 5 and 15
        uint256[] memory randomNumbers = s_randomnessRequestIdToRandomWords[
            _randomnessRequestId
        ];
        uint256 randomNumberToCapture = ((randomNumbers[1] % 10) + 5);
        inf.decreaseTechCountFromSpyContract(defenderId, randomNumberToCapture);
    }

    function sabotogeTaxes(
        uint256 defenderId,
        uint256 _randomnessRequestId
    ) internal {
        uint256[] memory randomNumbers = s_randomnessRequestIdToRandomWords[
            _randomnessRequestId
        ];
        uint256 randomNumberToSetTaxes = ((randomNumbers[1] % 4) + 20);
        inf.setTaxRateFromSpyContract(defenderId, randomNumberToSetTaxes);
    }

    function destroyMoneyReserves(uint256 defenderId) internal {
        //max 5% or $10 million
        uint256 defenderBalance = tsy.checkBalance(defenderId);
        uint256 amountToDestroy;
        if (defenderBalance <= (20000000 * (10 ** 18))) {
            amountToDestroy = ((defenderBalance * 5) / 100);
        } else {
            amountToDestroy = (1000000 * (10 ** 18));
        }
        tsy.destroyBalance(defenderId, amountToDestroy);
    }

    function captureInfrastructure(
        uint256 defenderId,
        uint256 _randomnessRequestId
    ) internal {
        //random between 5 and 15
        uint256[] memory randomNumbers = s_randomnessRequestIdToRandomWords[
            _randomnessRequestId
        ];
        uint256 randomNumberToExchange = ((randomNumbers[1] % 10) + 5);
        inf.decreaseInfrastructureCountFromSpyContract(
            defenderId,
            randomNumberToExchange
        );
    }

    function destroyNukes(uint256 defenderId) internal {
        //max 1
        mis.decreaseNukeCountFromSpyContract(defenderId);
    }
}
