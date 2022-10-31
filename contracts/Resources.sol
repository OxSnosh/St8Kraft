//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Infrastructure.sol";
import "./Improvements.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ResourcesContract is VRFConsumerBaseV2, Ownable {
    uint256 public resourcesLength = 21;
    uint256[] private s_randomWords;
    uint256[] public playerResources;
    uint256[] public tradingPartners;
    uint256[] public proposedTrades;
    uint256[] public trades;
    address public infrastructure;
    address public improvements2;

    //Chainlik Variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 2;

    struct Resources1 {
        bool aluminium;
        //Aluminum
        //DONE //Increases soldier efficiency +20%,
        //DONE //lowers infrastructure purchase cost -7%, and
        //DONE //lowers aircraft purchase costs -8%.
        bool cattle;
        //Cattle
        //DONE //Increases number of citizens +5%
        //DONE //and lowers land purchase cost -10%.
        bool coal;
        //Coal
        //DONE //Increases the purchased land area of a nation by 15%,
        //DONE //increases soldier efficiency +8%,
        //DONE //and lowers infrastructure purchase cost -4%.
        bool fish;
        //Fish
        //DONE //Increases number of citizens +8%
        //DOME //and lowers land purchase cost -5%.
        bool furs;
        //Furs
        //DONE //Increases citizen's daily income +$3.50
        //and triples the natural growth of a nation.
        bool gems;
        //Gems
        //DONE //Increases citizen's daily income +$1.50
        //DONE //and increases population happiness +2.5.
        bool gold;
        //Gold
        //DONE //Increases citizen's daily income +$3.00
        //DONE //and lowers technology cost by 5%.
        bool iron;
        //Iron
        //DONE //Lowers soldier purchase cost -$3.00,
        //DONE //lowers infrastructure upkeep costs -10%,
        //DONE //lowers infrastructure purchase costs -5%,
        //DONE //and lowers tank upkeep costs -5%.
        bool lead;
        //Lead
        //DONE //Lowers cruise missile and nuclear weapon purchase cost and upkeep cost -20%,
        //DONE //lowers aircraft upkeep cost -25%,
        //lowers tank purchase and upkeep costs -8%,
        //DONE //lowers soldier upkeep cost -$0.50,
        //DONE //reduces environment penalties for owning nuclear weapons by 50%,
        //DONE //and lowers all navy vessel upkeep cost -20%.
        bool lumber;
        //Lumber
        //DONE //Lowers infrastructure purchase cost -6%
        //DONE //and lowers infrastructure upkeep costs -8%.
        bool marble;
        //Marble
        //DONE //Lowers infrastructure purchase cost -10%.
    }

    struct Resources2 {
        bool oil;
        //Oil
        //DONE //Lowers soldier purchase cost -$3.00,
        //DONE //increases population happiness +1.5,
        //DONE //increases soldier efficiency +10%,
        //DONE //lowers tank upkeep cost -5%,
        //DONE //lowers aircraft purchase cost -4%,
        //DONE //and lowers all navy vessel upkeep cost -10%.
        //
        bool pigs;
        //Pigs
        //DONE //Lowers soldier upkeep cost -$0.50,
        //DONE //increases soldier efficiency +15%,
        //DONE //and increases number of citizens +3.5%.
        bool rubber;
        //Rubber
        //DONE //Increases purchased land area of a nation by 20%,
        //DONE //lowers land purchase cost -10%,
        //DONE //triples the value of land when selling (from $100 to $300),
        //DONE //lowers infrastructure purchase cost -3%,
        //DONE //and lowers aircraft purchase cost -4%.
        bool silver;
        //Silver
        //DONE //Increases citizen's daily income +$2.00
        //DONE //and increases population happiness +2.
        bool spices;
        //Spices
        //DONE //Increases the purchased land area of a nation by 8%
        //DONE //and increases population happiness +2.
        bool sugar;
        //Sugar
        //DONE //Increases number of citizens +3%,
        //DONE //and increases population happiness +1.
        bool uranium;
        //Uranium
        //DONE //Reduces infrastructure upkeep cost -3%.
        //DONE //Allow nations to develop nuclear weapons only if that nation's government preference
        //supports nuclear weapons.
        //If a nations government preference favors nuclear technology for the use of nuclear
        //power plants but does not support nuclear weapons then the nation will receive +$3.00
        //per citizen and +$0.15 for every level of tech purchased up to level 30 but loses -1
        //population happiness.
        //DONE //If a nation owns nuclear weapons but does not have uranium the cost to maintain nukes
        //is doubled.
        //DONE //Lowers Submarine and Aircraft Carrier navy vessel purchase and upkeep cost -5%.
        bool water;
        //Water
        //DONE //Increases number of citizens per mile before population unhappiness by 50,
        //DONE //increases population happiness +2.5,
        //DONE //and improves a nation's environment by 1.
        bool wheat;
        //Wheat
        //DONE //Increases number of citizens +8%.
        bool wine;
        //Wine
        //DONE //Increases population happiness +3.
    }

    struct BonusResources {
        bool beer;
        //beer
        //requires Water, Wheat, Lumber, Aluminium
        //DONE //Increases population happiness + 2.
        bool steel;
        //steel
        //DONE //reduces infrastructure cost -2%.
        //DONE //Lowers all vessel purchase costs -15%
        //requires Coal and Iron
        bool construction;
        //construction
        //DONE //Reduces infrastructure cost -5% and
        //DONE //raises the aircraft limit +10.
        //requires Lumber, Iron, Marble, Aluminium, tech > 5
        bool fastFood;
        //fast food
        //DONE //Increases population happiness + 2.
        //requires Cattle, Sugar, Spices, Pigs
        bool fineJewelry;
        //fine jewelry
        //DONE //Increases population happiness + 3.
        //requires Gold, Silver, Gems, Coal
        bool scholars;
        //scholars
        //DONE //increases population income +$3.00
        //requires literacy rate > 90%, lumber, lead
        bool asphalt;
        //asphalt
        //DONE //Lowers infrastructure upkeep cost -5%.
        //requires Construction, Oil, Rubber
        bool automobiles;
        //automobiles
        //DONE //Increases population happiness +3.
        //requires Asphalt, Steel
        bool affluentPopulation;
        //affluent population
        //DONE //Increases number of citizens +5%.
        //requires fineJewelry, Fish, Furs, Wine
        bool microchips;
        //microchips
        //DONE //reduces tech cost -8%
        //DONE //increases population happiness +2
        //DONE //lowers frigate, destroyer, submarine, aircraft carrier upkeep cost -10%
        //requires Gold, Lead, Oil, tech > 10
        bool radiationCleanup;
        //radiation cleanup
        //reduces nuclear anarchy effects by 1 day
        //DONE //Improves a nation's environment by 1
        //Resuces global radiation for your nation by 50%
        //requires Construction, Microchips, Steel and Technology > 15
    }

    struct MoonResources {
        bool calcium;
        //Calcium
        //Mined from Lunar surface.
        //Increases population income by $3.00 for the resources
        //Rubber, Furs, Spices & Wine that your nation has access to.
        bool radon;
        //radon
        //Mined from Lunar surface.
        //Increases population income by $3.00 for the resources
        //Lead, Gold, Water & Uranium that your nation has access to.
        bool silicon;
        //Silicon
        //Mined from Lunar surface.
        //Increases population income by $3.00 for the resources
        //Rubber, Furs, Gems & Silver that your nation has access to.
        bool titanium;
        //Titanium
        //Mined from Lunar surface.
        //Increases population income by $3.00 for the resources
        //Gold, Lead, Coal & Oil that your nation has access to.
    }

    struct MarsResources {
        bool basalt;
        //basalt
        //+3 happiness if nation has Automobiles,
        //–5% infra upkeep if nation has Asphalt,
        //–5% infra purchase cost if nation has Construction.
        bool magnesium;
        //magnesium
        //Mined from Martian surface.
        //+4 happiness if nation has Microchips,
        //–4% infra upkeep if nation has Steel.
        bool potassium;
        //Mined from Martian surface.
        //+3 happiness if nation has Fine Jewelry,
        //+$3 citizen income if nation has Scholars,
        //+$3 citizen income if nation has Affluent Population.
        bool sodium;
        //Sodium
        //Mined from Martian surface.
        //+2 happiness if nation has Fast Food,
        //+2 happiness if nation has Beer,
        //Decreases GRL by an additional 50% (75% total) if you have Radiation Cleanup.
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
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function settings(address _infrastructure, address _improvements2)
        public
        onlyOwner
    {
        infrastructure = _infrastructure;
        improvements2 = _improvements2;
    }

    function generateResources(uint256 id, address nationOwner) public {
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
        idToResources1[id] = newResources1;
        idToResources2[id] = newResources2;
        idToBonusResources[id] = newBonusResources;
        idToMoonResources[id] = newMoonResources;
        idToMarsResources[id] = newMarsResources;
        idToOwnerResources[id] = nationOwner;
        fulfillRequest(id);
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
        s_randomWords = s_requestIndexToRandomWords[requestNumber];
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
        idToPlayerResources[requestNumber] = playerResources;
        setResources(requestNumber);
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
        uint256 requestorHarborAmount = ImprovementsContract2(improvements2)
            .getHarborCount(requestorId);
        uint256 requestorMaxTrades = 3;
        if (requestorHarborAmount > 0) {
            requestorMaxTrades = 4;
        }
        if (requestorMaxTrades >= (requestorTotalTrades + 1)) {
            return true;
        } else {
            return false;
        }
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
        uint256 recipientHarborAmount = ImprovementsContract2(improvements2)
            .getHarborCount(recipientId);
        uint256 recipientMaxTrades = 4;
        if (recipientHarborAmount > 0) {
            recipientMaxTrades = 5;
        }
        if (recipientMaxTrades >= (recipientTotalTrades + 1)) {
            return true;
        } else {
            return false;
        }
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

    function viewAffluentPopulation(uint256 id) public view returns (bool) {
        bool isAffluentPopulation = idToBonusResources[id].affluentPopulation;
        return isAffluentPopulation;
    }

    function viewAluminium(uint256 id) public view returns (bool) {
        bool isAluminium = idToResources1[id].aluminium;
        return isAluminium;
    }

    function viewAsphalt(uint256 id) public view returns (bool) {
        bool isAsphalt = idToBonusResources[id].asphalt;
        return isAsphalt;
    }

    function viewAutomobiles(uint256 id) public view returns (bool) {
        bool isAutomobiles = idToBonusResources[id].automobiles;
        return isAutomobiles;
    }

    function viewBeer(uint256 id) public view returns (bool) {
        bool isBeer = idToBonusResources[id].beer;
        return isBeer;
    }

    function viewCattle(uint256 id) public view returns (bool) {
        bool isCattle = idToResources1[id].cattle;
        return isCattle;
    }

    function viewCoal(uint256 id) public view returns (bool) {
        bool isCoal = idToResources1[id].coal;
        return isCoal;
    }

    function viewConstruction(uint256 id) public view returns (bool) {
        bool isConstruction = idToBonusResources[id].construction;
        return isConstruction;
    }

    function viewFastFood(uint256 id) public view returns (bool) {
        bool isFastFood = idToBonusResources[id].fastFood;
        return isFastFood;
    }

    function viewFineJewelry(uint256 id) public view returns (bool) {
        bool isFineJewelry = idToBonusResources[id].fineJewelry;
        return isFineJewelry;
    }

    function viewFish(uint256 id) public view returns (bool) {
        bool isFish = idToResources1[id].fish;
        return isFish;
    }

    function viewFurs(uint256 id) public view returns (bool) {
        bool isFurs = idToResources1[id].furs;
        return isFurs;
    }

    function viewGems(uint256 id) public view returns (bool) {
        bool isGems = idToResources1[id].gems;
        return isGems;
    }

    function viewGold(uint256 id) public view returns (bool) {
        bool isGold = idToResources1[id].gold;
        return isGold;
    }

    function viewIron(uint256 id) public view returns (bool) {
        bool isIron = idToResources1[id].iron;
        return isIron;
    }

    function viewLead(uint256 id) public view returns (bool) {
        bool isLead = idToResources1[id].lead;
        return isLead;
    }

    function viewLumber(uint256 id) public view returns (bool) {
        bool isLumber = idToResources1[id].lumber;
        return isLumber;
    }

    function viewMarble(uint256 id) public view returns (bool) {
        bool isMarble = idToResources1[id].marble;
        return isMarble;
    }

    function viewMicrochips(uint256 id) public view returns (bool) {
        bool isMicrochips = idToBonusResources[id].microchips;
        return isMicrochips;
    }

    function viewOil(uint256 id) public view returns (bool) {
        bool isOil = idToResources2[id].oil;
        return isOil;
    }

    function viewPigs(uint256 id) public view returns (bool) {
        bool isPigs = idToResources2[id].pigs;
        return isPigs;
    }

    function viewRadiationCleanup(uint256 id) public view returns (bool) {
        bool isRadiationCleanup = idToBonusResources[id].radiationCleanup;
        return isRadiationCleanup;
    }

    function viewRubber(uint256 id) public view returns (bool) {
        bool isRubber = idToResources2[id].rubber;
        return isRubber;
    }

    function viewScholars(uint256 id) public view returns (bool) {
        bool isScholars = idToBonusResources[id].scholars;
        return isScholars;
    }

    function viewSilver(uint256 id) public view returns (bool) {
        bool isSilver = idToResources2[id].silver;
        return isSilver;
    }

    function viewSpices(uint256 id) public view returns (bool) {
        bool isSpices = idToResources2[id].spices;
        return isSpices;
    }

    function viewSteel(uint256 id) public view returns (bool) {
        bool isSteel = idToBonusResources[id].steel;
        return isSteel;
    }

    function viewSugar(uint256 id) public view returns (bool) {
        bool isSugar = idToResources2[id].sugar;
        return isSugar;
    }

    function viewUranium(uint256 id) public view returns (bool) {
        bool isUranium = idToResources2[id].uranium;
        return isUranium;
    }

    function viewWater(uint256 id) public view returns (bool) {
        bool isWater = idToResources2[id].water;
        return isWater;
    }

    function viewWheat(uint256 id) public view returns (bool) {
        bool isWheat = idToResources2[id].wheat;
        return isWheat;
    }

    function viewWine(uint256 id) public view returns (bool) {
        bool isWine = idToResources2[id].wine;
        return isWine;
    }

    function getTradingPartners(uint256 id)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory partners = idToTradingPartners[id];
        return partners;
    }
}
