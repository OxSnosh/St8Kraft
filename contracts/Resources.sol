//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "./Infrastructure.sol";
import "./Improvements.sol";

contract ResourcesContract is VRFConsumerBaseV2 {
    uint256 private resourcesId;
    uint256 public requestCounter;
    uint256 public resourcesLength = 21;
    uint256[] private s_randomWords;
    uint256[] public playerResources;
    uint256[] public tradingPartners;
    uint256[] public proposedTrades;
    uint256[] public trades;
    address public infrastructure;
    address public improvements;

    //Chainlik Variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 2;

    struct Resources1 {
        bool aluminium;
        bool cattle;
        bool coal;
        bool fish;
        bool furs;
        bool gems;
        bool gold;
        bool iron;
        bool lead;
        bool lumber;
        bool marble;
    }

    struct Resources2 {
        bool oil;
        bool pigs;
        bool rubber;
        bool silver;
        bool spices;
        bool sugar;
        bool uranium;
        bool water;
        bool wheat;
        bool wine;
    }

    struct BonusResources {
        bool beer;
        //requires Water, Wheat, Lumber, Aluminium
        bool steel;
        //reduces infrastructure cost -2%.
        //Lowers all vessel costs -15%
        //requires Coal and Iron
        bool construction;
        //requires Lumber, Iron, Marble, Aluminium, tech > 5
        bool fastFood;
        //requires Cattle, Sugar, Spices, Pigs
        bool fineJewelry;
        //requires Gold, Silver, Gems, Coal
        bool scholars;
        //increases population income +$3.00
        //requires literacy rate > 90%, lumber, lead
        bool asphalt;
        //requires Construction, Oil, Rubber
        bool automobiles;
        //requires Asphalt, Steel
        bool affluentPopulation;
        //requires fineJewelry, Fish, Furs, Wine
        bool microchips;
        //reduces tech cost -8%
        //increases population happiness +2
        //lowers frigate, destroyer, submarine, aircraft carrier upkeep cost -10%
        //requires Gold, Lead, Oil, tech > 10
        bool radiationCleanup;
        //reduces nuclear anarchy effects by 1 day
        //Improves a nation's environment by 1
        //Resuces global radiation for oyur nation by 50%
        //requires Construction, Microchips, Steel and Technology > 15
    }

    struct MoonResources {
        bool calcium;
        bool radon;
        bool silicon;
        bool titanium;
    }

    struct MarsResources {
        bool basalt;
        bool magnesium;
        bool potassium;
        bool sodium;
    }

    mapping(uint256 => Resources1) public idToResources1;
    mapping(uint256 => Resources2) public idToResources2;
    mapping(uint256 => BonusResources) public idToBonusResources;
    mapping(uint256 => MoonResources) public idToMoonResources;
    mapping(uint256 => MarsResources) public idToMarsResources;
    mapping(uint256 => uint256[]) public idToPlayerResources;
    mapping(uint256 => uint256[]) public idToTradingPartners;
    mapping(uint256 => uint256[]) public idToProposedTradingPartners;
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;
    mapping(uint256 => address) public idToOwnerResources;

    /* Functions */
    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit,
        address _infrastructure,
        address _improvements
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        infrastructure = _infrastructure;
        improvements = _improvements;
    }

    function generateResources() public {
        Resources1 memory newResources1 = Resources1(
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        );
        Resources2 memory newResources2 = Resources2(
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        );
        BonusResources memory newBonusResources = BonusResources(
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        );
        MoonResources memory newMoonResources = MoonResources(
            false,
            false,
            false,
            false
        );
        MarsResources memory newMarsResources = MarsResources(
            false,
            false,
            false,
            false
        );
        idToResources1[resourcesId] = newResources1;
        idToResources2[resourcesId] = newResources2;
        idToBonusResources[resourcesId] = newBonusResources;
        idToMoonResources[resourcesId] = newMoonResources;
        idToMarsResources[resourcesId] = newMarsResources;
        idToOwnerResources[resourcesId] = msg.sender;
        fulfillRequest();
        //when to increment resources id
        //resourcesId++
    }

    function fulfillRequest() public {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        //should this be resourcesID?
        s_requestIdToRequestIndex[requestId] = requestCounter;
        requestCounter += 1;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        s_randomWords = randomWords;
        uint256 randomResource1 = (s_randomWords[0] % 20);
        uint256 randomResource2 = (s_randomWords[1] % 20);
        //handle 2 of the same randomly generated numbers
        if (randomResource1 == randomResource2 && randomResource2 == 20) {
            randomResource2 == 0;
        }
        if (randomResource1 == randomResource2) {
            randomResource2 = randomResource2 + 1;
        }
        playerResources = [randomResource1, randomResource2];
        idToPlayerResources[resourcesId] = playerResources;
        setResources(resourcesId);
        resourcesId++;
    }

    function setResources(uint256 id) internal {
        idToResources1[id].aluminium = false;
        idToResources1[id].cattle = false;
        idToResources1[id].coal = false;
        idToResources1[id].fish = false;
        idToResources1[id].furs = false;
        idToResources1[id].gems = false;
        idToResources1[id].gold = false;
        idToResources1[id].iron = false;
        idToResources1[id].lead = false;
        idToResources1[id].lumber = false;
        idToResources1[id].marble = false;
        idToResources2[id].oil = false;
        idToResources2[id].pigs = false;
        idToResources2[id].rubber = false;
        idToResources2[id].silver = false;
        idToResources2[id].spices = false;
        idToResources2[id].sugar = false;
        idToResources2[id].uranium = false;
        idToResources2[id].water = false;
        idToResources2[id].wheat = false;
        idToResources2[id].wine = false;
        uint256 resource1 = idToPlayerResources[id][0];
        uint256 resource2 = idToPlayerResources[id][1];
        if (resource1 == 0 || resource2 == 0) {
            idToResources1[id].aluminium = true;
        }
        if (resource1 == 1 || resource2 == 1) {
            idToResources1[id].cattle = true;
        }
        if (resource1 == 2 || resource2 == 2) {
            idToResources1[id].coal = true;
        }
        if (resource1 == 3 || resource2 == 3) {
            idToResources1[id].fish = true;
        }
        if (resource1 == 4 || resource2 == 4) {
            idToResources1[id].furs = true;
        }
        if (resource1 == 5 || resource2 == 5) {
            idToResources1[id].gems = true;
        }
        if (resource1 == 6 || resource2 == 6) {
            idToResources1[id].gold = true;
        }
        if (resource1 == 7 || resource2 == 7) {
            idToResources1[id].iron = true;
        }
        if (resource1 == 8 || resource2 == 8) {
            idToResources1[id].lead = true;
        }
        if (resource1 == 9 || resource2 == 9) {
            idToResources1[id].lumber = true;
        }
        if (resource1 == 10 || resource2 == 10) {
            idToResources1[id].marble = true;
        }
        if (resource1 == 11 || resource2 == 11) {
            idToResources2[id].oil = true;
        }
        if (resource1 == 12 || resource2 == 12) {
            idToResources2[id].pigs = true;
        }
        if (resource1 == 13 || resource2 == 13) {
            idToResources2[id].rubber = true;
        }
        if (resource1 == 14 || resource2 == 14) {
            idToResources2[id].silver = true;
        }
        if (resource1 == 15 || resource2 == 15) {
            idToResources2[id].spices = true;
        }
        if (resource1 == 16 || resource2 == 16) {
            idToResources2[id].sugar = true;
        }
        if (resource1 == 17 || resource2 == 17) {
            idToResources2[id].uranium = true;
        }
        if (resource1 == 18 || resource2 == 18) {
            idToResources2[id].water = true;
        }
        if (resource1 == 19 || resource2 == 19) {
            idToResources2[id].wheat = true;
        }
        if (resource1 == 20 || resource2 == 20) {
            idToResources2[id].wine = true;
        }
        setTrades(id);
    }

    function setTrades(uint256 id) internal {
        uint256[] memory activeTrades = idToTradingPartners[id];
        uint256 i;
        for (i = 0; i < activeTrades.length; i++) {
            uint256 tradingPartner = i;
            (
                uint256 resource1,
                uint256 resource2
            ) = getResourcesFromTradingPartner(tradingPartner);
            if (resource1 == 0 || resource2 == 0) {
                idToResources1[id].aluminium = true;
            }
            if (resource1 == 1 || resource2 == 1) {
                idToResources1[id].cattle = true;
            }
            if (resource1 == 2 || resource2 == 2) {
                idToResources1[id].coal = true;
            }
            if (resource1 == 3 || resource2 == 3) {
                idToResources1[id].fish = true;
            }
            if (resource1 == 4 || resource2 == 4) {
                idToResources1[id].furs = true;
            }
            if (resource1 == 5 || resource2 == 5) {
                idToResources1[id].gems = true;
            }
            if (resource1 == 6 || resource2 == 6) {
                idToResources1[id].gold = true;
            }
            if (resource1 == 7 || resource2 == 7) {
                idToResources1[id].iron = true;
            }
            if (resource1 == 8 || resource2 == 8) {
                idToResources1[id].lead = true;
            }
            if (resource1 == 9 || resource2 == 9) {
                idToResources1[id].lumber = true;
            }
            if (resource1 == 10 || resource2 == 10) {
                idToResources1[id].marble = true;
            }
            if (resource1 == 11 || resource2 == 11) {
                idToResources2[id].oil = true;
            }
            if (resource1 == 12 || resource2 == 12) {
                idToResources2[id].pigs = true;
            }
            if (resource1 == 13 || resource2 == 13) {
                idToResources2[id].rubber = true;
            }
            if (resource1 == 14 || resource2 == 14) {
                idToResources2[id].silver = true;
            }
            if (resource1 == 15 || resource2 == 15) {
                idToResources2[id].spices = true;
            }
            if (resource1 == 16 || resource2 == 16) {
                idToResources2[id].sugar = true;
            }
            if (resource1 == 17 || resource2 == 17) {
                idToResources2[id].uranium = true;
            }
            if (resource1 == 18 || resource2 == 18) {
                idToResources2[id].water = true;
            }
            if (resource1 == 19 || resource2 == 19) {
                idToResources2[id].wheat = true;
            }
            if (resource1 == 20 || resource2 == 20) {
                idToResources2[id].wine = true;
            }
        }
        setBonusResources(id);
    }

    function setBonusResources(uint256 id) public {
        idToBonusResources[id].affluentPopulation = false;
        idToBonusResources[id].asphalt = false;
        idToBonusResources[id].automobiles = false;
        idToBonusResources[id].beer = false;
        idToBonusResources[id].construction = false;
        idToBonusResources[id].fastFood = false;
        idToBonusResources[id].fineJewelry = false;
        idToBonusResources[id].microchips = false;
        idToBonusResources[id].radiationCleanup = false;
        idToBonusResources[id].scholars = false;
        idToBonusResources[id].steel = false;
        //check for beer (aluminium, luber, water, wheat)
        if (
            idToResources1[id].aluminium &&
            idToResources1[id].lumber &&
            idToResources2[id].water &&
            idToResources2[id].wheat
        ) {
            idToBonusResources[id].beer = true;
        }
        //check for steel (coal, iron)
        if (idToResources1[id].coal && idToResources1[id].iron) {
            idToBonusResources[id].steel = true;
        }
        //construction (lumber, iron, marble, aluminum)
        if (
            idToResources1[id].aluminium &&
            idToResources1[id].iron &&
            idToResources1[id].lumber &&
            idToResources1[id].marble
        ) {
            idToBonusResources[id].construction = true;
        }
        //fast food (cattle sugar spices pigs)
        if (
            idToResources1[id].cattle &&
            idToResources2[id].pigs &&
            idToResources2[id].spices &&
            idToResources2[id].sugar
        ) {
            idToBonusResources[id].fastFood = true;
        }
        //fine jewelry (gold silver gems coal)
        if (
            idToResources1[id].coal &&
            idToResources1[id].gold &&
            idToResources1[id].gems &&
            idToResources2[id].silver
        ) {
            idToBonusResources[id].fineJewelry = true;
        }
        //scholars (lumber, lead, literacy >90%)
        uint256 literacyRate;
        if (
            literacyRate > 90 &&
            idToResources1[id].lumber &&
            idToResources1[id].lead
        ) {
            idToBonusResources[id].scholars = true;
        }
        //asphalt (construction, oil, rubber)
        if (
            idToBonusResources[id].construction &&
            idToResources2[id].oil &&
            idToResources2[id].rubber
        ) {
            idToBonusResources[id].asphalt = true;
        }
        //automobiles (asphalt Steel)
        if (idToBonusResources[id].asphalt && idToBonusResources[id].steel) {
            idToBonusResources[id].automobiles = true;
        }
        //affluent population (fine jewelry fish furs wine)
        if (
            idToBonusResources[id].fineJewelry &&
            idToResources1[id].fish &&
            idToResources1[id].furs &&
            idToResources2[id].wine
        ) {
            idToBonusResources[id].affluentPopulation = true;
        }
        //microchips (Gold, Lead, Oil, tech > 10)
        uint256 techAmount = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        if (
            techAmount > 10 &&
            idToResources1[id].gold &&
            idToResources1[id].lead &&
            idToResources2[id].oil
        ) {
            idToBonusResources[id].microchips = true;
        }
        //radiation cleanup (Construction, Microchips, Steel and Technology > 15)
        if (
            techAmount > 15 &&
            idToBonusResources[id].construction &&
            idToBonusResources[id].microchips &&
            idToBonusResources[id].steel
        ) {
            idToBonusResources[id].radiationCleanup = true;
        }
    }

    function proposeTrade(uint256 requestorId, uint256 recipientId) public {
        require(
            idToOwnerResources[requestorId] == msg.sender,
            "requestor is not nation owner"
        );
        bool isPossibleRequestor = isTradePossibleForRequestor(requestorId);
        bool isPossibleRecipient = isTradePossibleForRecipient(recipientId);
        require(isPossibleRequestor = true, "trade is not possible");
        require(isPossibleRecipient = true, "trade is not possible");
        uint256[]
            storage proposedTradesOfRecipient = idToProposedTradingPartners[
                recipientId
            ];
        uint256[]
            storage proposedTradesOfRequestor = idToProposedTradingPartners[
                requestorId
            ];
        proposedTradesOfRecipient.push(requestorId);
        proposedTradesOfRequestor.push(recipientId);
        // pushProposals(requestorId, recipientId);
    }

    function isTradePossibleForRequestor(uint256 requestorId)
        internal
        view
        returns (bool)
    {
        uint256[] memory requestorTradeAgreements = idToTradingPartners[
            requestorId
        ];
        uint256[]
            memory proposedTradesOfRequestor = idToProposedTradingPartners[
                requestorId
            ];
        uint256 requestorTradesActive = requestorTradeAgreements.length;
        uint256 requestorProposedTrades = proposedTradesOfRequestor.length;
        uint256 requestorTotalTrades = requestorTradesActive +
            requestorProposedTrades;
        uint256 requestorHarborAmount = ImprovementsContract2(improvements)
            .getHarborCount(requestorId);
        uint256 requestorMaxTrades = 3;
        if (requestorHarborAmount > 0) {
            requestorMaxTrades = 4;
        }
        require(
            requestorMaxTrades >= (requestorTotalTrades + 1),
            "requestor has too many active and proposed trades"
        );
        return true;
    }

    function isTradePossibleForRecipient(uint256 recipientId)
        internal
        view
        returns (bool)
    {
        uint256[] memory recipientTradeAgreements = idToTradingPartners[
            recipientId
        ];
        uint256[]
            memory proposedTradesOfRecipient = idToProposedTradingPartners[
                recipientId
            ];
        uint256 recipientTradesActive = recipientTradeAgreements.length;
        uint256 recipientProposedTrades = proposedTradesOfRecipient.length;
        uint256 recipientTotalTrades = recipientTradesActive +
            recipientProposedTrades;
        uint256 recipientHarborAmount = ImprovementsContract2(improvements)
            .getHarborCount(recipientId);
        uint256 recipientMaxTrades = 4;
        if (recipientHarborAmount > 0) {
            recipientMaxTrades = 5;
        }
        require(
            recipientMaxTrades >= (recipientTotalTrades + 1),
            "recipient has too many active and proposed trades"
        );
        return true;
    }

    function fulfillTradingPartner(uint256 recipientId, uint256 requestorId)
        public
    {
        require(
            idToOwnerResources[recipientId] == msg.sender,
            "you are not the nation owner of the request"
        );
        bool isProposed = isProposedTrade(recipientId, requestorId);
        require(isProposed == true, "Not an active trade proposal");
        uint256[]
            storage proposedTradesOfRequestor = idToProposedTradingPartners[
                requestorId
            ];
        for (uint256 i = 0; i < proposedTradesOfRequestor.length; i++) {
            if (proposedTradesOfRequestor[i] == recipientId) {
                delete proposedTradesOfRequestor[i];
            }
        }
        uint256[]
            storage proposedTradesOfRecipient = idToProposedTradingPartners[
                recipientId
            ];
        for (uint256 i = 0; i < proposedTradesOfRecipient.length; i++) {
            if (proposedTradesOfRecipient[i] == requestorId) {
                delete proposedTradesOfRequestor[i];
            }
        }
        uint256[] storage recipientTradeAgreements = idToTradingPartners[
            recipientId
        ];
        recipientTradeAgreements.push(requestorId);
        uint256[] storage requestorTradeAgreements = idToTradingPartners[
            requestorId
        ];
        requestorTradeAgreements.push(recipientId);
        setResources(recipientId);
        setResources(requestorId);
    }

    function removeTradingPartner(uint256 nationId, uint256 partnerId) public {
        require(
            idToOwnerResources[nationId] == msg.sender,
            "you are not the nation owner of the request"
        );
        bool isActive = isActiveTrade(nationId, partnerId);
        require(isActive == true, "this is not an active trade");
        uint256[] storage tradesOfNation = idToTradingPartners[nationId];
        for (uint256 i = 0; i < tradesOfNation.length; i++) {
            if (tradesOfNation[i] == partnerId) {
                delete tradesOfNation[i];
            }
        }
        uint256[] storage tradesOfPartner = idToTradingPartners[partnerId];
        for (uint256 i = 0; i < tradesOfPartner.length; i++) {
            if (tradesOfPartner[i] == nationId) {
                delete tradesOfPartner[i];
            }
        }
        setResources(nationId);
        setResources(partnerId);
    }

    function isProposedTrade(uint256 recipientId, uint256 requestorId)
        public
        view
        returns (bool isProposed)
    {
        uint256[]
            memory proposedTradesOfRecipient = idToProposedTradingPartners[
                recipientId
            ];
        for (uint256 i = 0; i < proposedTradesOfRecipient.length; i++) {
            if (proposedTradesOfRecipient[i] == requestorId) {
                return true;
            }
        }
        return false;
    }

    function isActiveTrade(uint256 country1Id, uint256 country2Id)
        public
        view
        returns (bool isActive)
    {
        uint256[] memory activeTrades = idToTradingPartners[country1Id];
        for (uint256 i = 0; i < activeTrades.length; i++) {
            if (activeTrades[i] == country2Id) {
                return true;
            }
        }
        return false;
    }

    function getResourcesFromTradingPartner(uint256 partnerId)
        public
        view
        returns (uint256, uint256)
    {
        uint256[] memory partnerResources = idToPlayerResources[partnerId];
        uint256 resource1 = partnerResources[0];
        uint256 resource2 = partnerResources[1];
        return (resource1, resource2);
    }

    function viewGold(uint256 id) public view returns (bool) {
        bool isGold = idToResources1[id].gold;
        return isGold;
    }

    function viewMicrochips(uint256 id) public view returns (bool) {
        bool isMicrochips = idToBonusResources[id].microchips;
        return isMicrochips;
    }

    function viewLumber(uint256 id) public view returns (bool) {
        bool isLumber = idToResources1[id].lumber;
        return isLumber;
    }

    function viewIron(uint256 id) public view returns (bool) {
        bool isIron = idToResources1[id].iron;
        return isIron;
    }

    function viewMarble(uint256 id) public view returns (bool) {
        bool isMarble = idToResources1[id].marble;
        return isMarble;
    }

    function viewAluminium(uint256 id) public view returns (bool) {
        bool isAluminium = idToResources1[id].aluminium;
        return isAluminium;
    }

    function viewCoal(uint256 id) public view returns (bool) {
        bool isCoal = idToResources1[id].coal;
        return isCoal;
    }

    function viewRubber(uint256 id) public view returns (bool) {
        bool isRubber = idToResources2[id].rubber;
        return isRubber;
    }

    function viewConstruction(uint256 id) public view returns (bool) {
        bool isConstruction = idToBonusResources[id].construction;
        return isConstruction;
    }

    function viewSteel(uint256 id) public view returns (bool) {
        bool isSteel = idToBonusResources[id].steel;
        return isSteel;
    }

    function getTradingPartners(uint256 id) public view returns (uint256[] memory) {
        uint256[] memory partners = idToTradingPartners[id];
        return partners;
    }
}
