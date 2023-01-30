//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Infrastructure.sol";
import "./Improvements.sol";
import "./CountryMinter.sol";
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title ResourcesContract
///@author OxSnosh
///@notice this contract will keep track of a nations resources and trades
///@dev this contract inherits from chainlink VRF
///@dev this contract inherits from oepnzeppelin ownable
contract ResourcesContract is VRFConsumerBaseV2, Ownable {
    uint256 public resourcesLength = 21;
    uint256[] private s_randomWords;
    uint256[] public tradingPartners;
    uint256[] public proposedTrades;
    uint256[] public trades;
    address public infrastructure;
    address public improvements2;
    address public countryMinter;
    address public bonusResources;

    CountryMinter mint;
    BonusResourcesContract bonus;

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

    mapping(uint256 => Resources1) public idToResources1;
    mapping(uint256 => Resources2) public idToResources2;
    mapping(uint256 => uint256[]) public idToPlayerResources;
    mapping(uint256 => uint256[]) public idToRandomResourceSelection;
    mapping(uint256 => uint256[]) public idToTradingPartners;
    mapping(uint256 => uint256[]) public idToProposedTradingPartners;
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;

    event randomNumbersRequested(uint256 indexed requestId);
    event randomNumbersFulfilled(
        uint256 indexed randomResource1,
        uint256 indexed randomResource2
    );

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "this function is only callable from the country minter contract"
        );
        _;
    }

    ///@dev constructor function will accept variables for chainlink randomness
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

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _infrastructure,
        address _improvements2,
        address _countryMinter,
        address _bonusResources
    ) public onlyOwner {
        infrastructure = _infrastructure;
        improvements2 = _improvements2;
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        bonusResources = _bonusResources;
        bonus = BonusResourcesContract(_bonusResources);
    }

    ///@dev this is a public function that is only callable from the country minter contract when a nation is minted
    ///@dev this function will allow a nation to store the resources they have access to
    ///@notice this function will allow a nation to store the resources they have access to
    ///@dev this function will call the chainlink vrf contract to assign the minted nation two resources randomly
    ///@param id is the nation id of the nation being minted
    function generateResources(uint256 id) public onlyCountryMinter {
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
        idToResources1[id] = newResources1;
        idToResources2[id] = newResources2;
        // fulfillRequest(id);
    }

    ///@dev this is the function that will call the chainlink vrf contract to return random numbers
    ///@dev this is an internal function that can only be called from within this contract
    function fulfillRequest(uint256 id) public {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToRequestIndex[requestId] = id;
        emit randomNumbersRequested(requestId);
    }

    ///@dev this is the function that the chainlink vrf contract will call when it answers
    ///@param requestId this is the id of the request sent to the vrf contract
    ///@param randomWords is the random numbers being returned after being generated off chain
    ///@dev this function will assign a nation 2 random resources and assure that they are 2 different resources
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        s_randomWords = s_requestIndexToRandomWords[requestNumber];
        uint256 randomResource1 = (s_randomWords[0] % 20);
        uint256 randomResource2 = (s_randomWords[1] % 20);
        emit randomNumbersFulfilled(randomResource1, randomResource2);
        if (randomResource1 == randomResource2 && randomResource2 == 20) {
            randomResource2 = 0;
        }
        if (randomResource1 == randomResource2) {
            randomResource2 = randomResource2 + 1;
        }
        uint256[2] memory playerResources = [randomResource1, randomResource2];
        idToPlayerResources[requestNumber] = playerResources;
        setResources(requestNumber);
    }

    ///@dev this is a function that is callable only from the owner of the contract
    ///@dev this function was used in testing of the smart contract and should be deleted before deployment
    function mockResourcesForTesting(
        uint256 countryId,
        uint256 resource1,
        uint256 resource2
    ) public onlyOwner {
        uint256[2] memory playerResources = [resource1, resource2];
        idToPlayerResources[countryId] = playerResources;
        setResources(countryId);
    }

    ///@dev this function is an internal function that will be called when a nation is minted or adds or removes a trading partner
    ///@dev this will set the nations assigned resources to true and call the next funtion that will set all the resources of its trading partners to true
    ///@param id is the nation id of the nation whose resources ar ebeing reset after minting or adding/removing a trading partner
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

    ///@dev this function is internal and can only be called by this contract
    ///@dev this function will loop through a nations trading partners and set the resources partner nations to true
    ///@param id is the nation id of the nation reseting their resources
    ///@dev this function is called from the previous setResources() function
    function setTrades(uint256 id) internal {
        uint256[] memory activeTrades = idToTradingPartners[id];
        uint256 i;
        for (i = 0; i < activeTrades.length; i++) {
            uint256 tradingPartner = activeTrades[i];
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
        bonus.setBonusResources(id);
    }

    ///@dev this is a public function that can be called by any nation owner
    ///@dev this function allows a nation owner to propose a trade with another nation
    ///@notice this function allows a nation owner to propose a trade with another nation
    ///@param requestorId is the nation id of the nation requesting the trading partnership
    ///@param recipientId is the nation id of the nation receiving the trade proposal
    ///@notice once proposed the recipient nation will need to accept the trade
    ///@notice a requesting nation can only have 3 trades active in order to propose a trade (4 with a harbor)
    ///@notice a recipient nation can only have 4 trades active to accept a trade (5 with a harbor)
    function proposeTrade(uint256 requestorId, uint256 recipientId) public {
        bool isOwner = mint.checkOwnership(requestorId, msg.sender);
        require(isOwner, "!nation owner");
        bool isPossibleRequestor = isTradePossibleForRequestor(requestorId);
        bool isPossibleRecipient = isTradePossibleForRecipient(recipientId);
        require(isPossibleRequestor == true, "trade is not possible");
        require(isPossibleRecipient == true, "trade is not possible");
        idToProposedTradingPartners[recipientId].push(requestorId);
        idToProposedTradingPartners[requestorId].push(recipientId);
    }

    ///@dev this is a public view function that will return a nations proposed trading partners
    ///@notice this function will return a nation's proposed trading partners
    ///@return uint256 is an array of the nation id's of a nations proposed trading partners
    ///@param id is the nation id of the nation being queried
    function getProposedTradingPartners(
        uint256 id
    ) public view returns (uint256[] memory) {
        return idToProposedTradingPartners[id];
    }

    ///@dev a trade proposal will only go through if a proposal is possible for the requestor and recipient
    ///@dev this function is an internal function that will return a boolean true if the proposed trade is possible for the requestor
    ///@notice this function will return true if the trade is possible for the requestor
    ///@notice a requestor can have a maximum of 3 active and proposed trades (4 with a harbor) in order to propose a trade
    ///@return bool is true if the trade is possible for the requestor
    function isTradePossibleForRequestor(
        uint256 requestorId
    ) internal view returns (bool) {
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

    ///@dev a trade proposal will only go through if a proposal is possible for the requestor and recipient
    ///@dev this function is an internal function that will return a boolean true if the proposed trade is possible for the recipient
    ///@notice this function will return true if the trade is possible for the recipient
    ///@notice a recipient can have a maximum of 4 active and proposed trades (5 with a harbor) in order to have a trade proposed
    ///@return bool is true if the trade is possible for the recipient
    function isTradePossibleForRecipient(
        uint256 recipientId
    ) internal view returns (bool) {
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

    ///@dev this is a public function callable from the recipient of a trade proposal that will allow a nation to accept a trade proposal
    ///@notice this function will allow the recipient of a trade proposal to accept a trade proposal
    ///@param recipientId is the nation id of the recipient of the trade proposal
    ///@param requestorId is the nation id of the requestor of the trade proposal
    ///@notice once a trade proposal is accepted the requesting nations and recipient nations resources will be reset to reflect the additional resources
    function fulfillTradingPartner(
        uint256 recipientId,
        uint256 requestorId
    ) public {
        bool isOwner = mint.checkOwnership(recipientId, msg.sender);
        require(isOwner, "!nation owner");
        bool isProposed = isProposedTrade(recipientId, requestorId);
        require(isProposed == true, "Not an active trade proposal");
        uint256[]
            storage proposedTradesOfRequestor = idToProposedTradingPartners[
                requestorId
            ];
        for (uint256 i = 0; i < proposedTradesOfRequestor.length; i++) {
            if (proposedTradesOfRequestor[i] == recipientId) {
                proposedTradesOfRequestor[i] = proposedTradesOfRequestor[
                    proposedTradesOfRequestor.length - 1
                ];
                proposedTradesOfRequestor.pop();
            }
        }
        uint256[]
            storage proposedTradesOfRecipient = idToProposedTradingPartners[
                recipientId
            ];
        for (uint256 i = 0; i < proposedTradesOfRecipient.length; i++) {
            if (proposedTradesOfRecipient[i] == requestorId) {
                proposedTradesOfRecipient[i] = proposedTradesOfRecipient[
                    proposedTradesOfRecipient.length - 1
                ];
                proposedTradesOfRecipient.pop();
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

    ///@dev this is a public function callable by either member of an active trade that will remove the active trade
    ///@notice this function will allow a trade agreement to be terminated
    ///@param nationId is the nation id of the nation initializing the trade cancellation
    ///@param partnerId is the nation id of the partner nation in the trade agreement being cancelled
    function removeTradingPartner(uint256 nationId, uint256 partnerId) public {
        bool isOwner = mint.checkOwnership(nationId, msg.sender);
        require(isOwner, "!nation owner");
        bool isActive = isActiveTrade(nationId, partnerId);
        require(isActive == true, "this is not an active trade");
        for (uint256 i = 0; i < idToTradingPartners[nationId].length; i++) {
            if (idToTradingPartners[nationId][i] == partnerId) {
                idToTradingPartners[nationId][i] = idToTradingPartners[
                    nationId
                ][idToTradingPartners[nationId].length - 1];
                idToTradingPartners[nationId].pop();
            }
        }
        for (uint256 i = 0; i < idToTradingPartners[partnerId].length; i++) {
            if (idToTradingPartners[partnerId][i] == nationId) {
                idToTradingPartners[partnerId][i] = idToTradingPartners[
                    partnerId
                ][idToTradingPartners[partnerId].length - 1];
                idToTradingPartners[partnerId].pop();
            }
        }
        setResources(nationId);
        setResources(partnerId);
    }

    ///@dev this is a public view function that will take two trading partners in the parameters and return a boolean value
    ///@dev this function will return true if there is a proposed trade between the two nation id's being passed in
    ///@param recipientId is the nation id of the first nation being queried
    ///@param requestorId is the nation id of the second nation being queried
    ///@return isProposed will be true if there is an active proposal between the two nations
    function isProposedTrade(
        uint256 recipientId,
        uint256 requestorId
    ) public view returns (bool isProposed) {
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

    ///@dev this is a public view function that will take two trading partners in the parameters and return a boolean value
    ///@dev this function will return true if there is an active trade between the two nation id's being passed in
    ///@param country1Id is the nation id of the first nation being queried
    ///@param country2Id is the nation id of the second nation being queried
    ///@return isActive will be true if there is an active trae between the two nations
    function isActiveTrade(
        uint256 country1Id,
        uint256 country2Id
    ) public view returns (bool isActive) {
        uint256[] memory activeTrades = idToTradingPartners[country1Id];
        for (uint256 i = 0; i < activeTrades.length; i++) {
            if (activeTrades[i] == country2Id) {
                return true;
            }
        }
        return false;
    }

    ///@dev this is a public view function that will return the 2 resources for a given nation
    ///@notice this function will return a given nations 2 randomly selected resources
    ///@param partnerId this is the nation id of the nation being queried
    ///@return uint256 is the numerical representation of the nations resources
    function getResourcesFromTradingPartner(
        uint256 partnerId
    ) public view returns (uint256, uint256) {
        uint256[] memory partnerResources = idToPlayerResources[partnerId];
        uint256 resource1 = partnerResources[0];
        uint256 resource2 = partnerResources[1];
        return (resource1, resource2);
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the aluminium resource
    ///@notice this function will return a boolean value of true if a nation has access to the aluminium resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the aluminium resource
    function viewAluminium(uint256 id) public view returns (bool) {
        bool isAluminium = idToResources1[id].aluminium;
        return isAluminium;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the cattle resource
    ///@notice this function will return a boolean value of true if a nation has access to the cattle resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the cattle resource
    function viewCattle(uint256 id) public view returns (bool) {
        bool isCattle = idToResources1[id].cattle;
        return isCattle;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the coal resource
    ///@notice this function will return a boolean value of true if a nation has access to the coal resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the coal resource
    function viewCoal(uint256 id) public view returns (bool) {
        bool isCoal = idToResources1[id].coal;
        return isCoal;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the fish resource
    ///@notice this function will return a boolean value of true if a nation has access to the fish resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the fish resource
    function viewFish(uint256 id) public view returns (bool) {
        bool isFish = idToResources1[id].fish;
        return isFish;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the furs resource
    ///@notice this function will return a boolean value of true if a nation has access to the furs resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the furs resource
    function viewFurs(uint256 id) public view returns (bool) {
        bool isFurs = idToResources1[id].furs;
        return isFurs;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the gems resource
    ///@notice this function will return a boolean value of true if a nation has access to the gems resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the gems resource
    function viewGems(uint256 id) public view returns (bool) {
        bool isGems = idToResources1[id].gems;
        return isGems;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the gold resource
    ///@notice this function will return a boolean value of true if a nation has access to the gold resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the gold resource
    function viewGold(uint256 id) public view returns (bool) {
        bool isGold = idToResources1[id].gold;
        return isGold;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the iron resource
    ///@notice this function will return a boolean value of true if a nation has access to the iron resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the iron resource
    function viewIron(uint256 id) public view returns (bool) {
        bool isIron = idToResources1[id].iron;
        return isIron;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the lead resource
    ///@notice this function will return a boolean value of true if a nation has access to the lead resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the lead resource
    function viewLead(uint256 id) public view returns (bool) {
        bool isLead = idToResources1[id].lead;
        return isLead;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the lumber resource
    ///@notice this function will return a boolean value of true if a nation has access to the lumber resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the lumber resource
    function viewLumber(uint256 id) public view returns (bool) {
        bool isLumber = idToResources1[id].lumber;
        return isLumber;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the marble resource
    ///@notice this function will return a boolean value of true if a nation has access to the marble resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the marble resource
    function viewMarble(uint256 id) public view returns (bool) {
        bool isMarble = idToResources1[id].marble;
        return isMarble;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the oil resource
    ///@notice this function will return a boolean value of true if a nation has access to the oil resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the oil resource
    function viewOil(uint256 id) public view returns (bool) {
        bool isOil = idToResources2[id].oil;
        return isOil;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the pigs resource
    ///@notice this function will return a boolean value of true if a nation has access to the pigs resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the pigs resource
    function viewPigs(uint256 id) public view returns (bool) {
        bool isPigs = idToResources2[id].pigs;
        return isPigs;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the rubber resource
    ///@notice this function will return a boolean value of true if a nation has access to the rubber resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the rubber resource
    function viewRubber(uint256 id) public view returns (bool) {
        bool isRubber = idToResources2[id].rubber;
        return isRubber;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the silver resource
    ///@notice this function will return a boolean value of true if a nation has access to the silver resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the silver resource
    function viewSilver(uint256 id) public view returns (bool) {
        bool isSilver = idToResources2[id].silver;
        return isSilver;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the spices resource
    ///@notice this function will return a boolean value of true if a nation has access to the spices resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the spices resource
    function viewSpices(uint256 id) public view returns (bool) {
        bool isSpices = idToResources2[id].spices;
        return isSpices;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the sugar resource
    ///@notice this function will return a boolean value of true if a nation has access to the sugar resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the sugar resource
    function viewSugar(uint256 id) public view returns (bool) {
        bool isSugar = idToResources2[id].sugar;
        return isSugar;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the uranium resource
    ///@notice this function will return a boolean value of true if a nation has access to the uranium resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the uranium resource
    function viewUranium(uint256 id) public view returns (bool) {
        bool isUranium = idToResources2[id].uranium;
        return isUranium;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the water resource
    ///@notice this function will return a boolean value of true if a nation has access to the water resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the water resource
    function viewWater(uint256 id) public view returns (bool) {
        bool isWater = idToResources2[id].water;
        return isWater;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the wheat resource
    ///@notice this function will return a boolean value of true if a nation has access to the wheat resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the wheat resource
    function viewWheat(uint256 id) public view returns (bool) {
        bool isWheat = idToResources2[id].wheat;
        return isWheat;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the wine resource
    ///@notice this function will return a boolean value of true if a nation has access to the wine resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the wine resource
    function viewWine(uint256 id) public view returns (bool) {
        bool isWine = idToResources2[id].wine;
        return isWine;
    }

    ///@dev this is a public view function that will return an array of a natons 2 resources
    ///@notice this function will return an array of a nations 2 selected resources
    ///@param id is the nation id of the nation being queried
    ///@return uint256 is an array of the players resources for the nation id passed into the function
    function getPlayerResources(
        uint256 id
    ) public view returns (uint256[] memory) {
        uint256[] memory resources = idToPlayerResources[id];
        return resources;
    }

    ///@dev this is a public view function that will return an array with a nations trading partners
    ///@notice this function will return a given nation's trading partners
    ///@param id is the nation id of the nation being queried
    ///@return uint256 is an array of the nation id's of a nations trading pertners
    function getTradingPartners(
        uint256 id
    ) public view returns (uint256[] memory) {
        uint256[] memory partners = idToTradingPartners[id];
        return partners;
    }
}

///@title BonusResourcesContract
///@author OxSnosh
///@notice this contract will keep track of a nations bonus resources
///@dev this contract inherits from chainlink VRF
///@dev this contract inherits from oepnzeppelin ownable
contract BonusResourcesContract is Ownable {
    address public infrastructure;
    address public improvements2;
    address public countryMinter;
    address public resources;

    CountryMinter mint;
    ResourcesContract res;

    struct BonusResources {
        bool beer;
        //beer
        //requires Water, Wheat, Lumber, Aluminium
        // //DONE //Increases population happiness + 2.
        bool steel;
        //steel
        // //DONE //reduces infrastructure cost -2%.
        // //DONE //Lowers all vessel purchase costs -15%
        //requires Coal and Iron
        bool construction;
        //construction
        // //DONE //Reduces infrastructure cost -5% and
        // //DONE //raises the aircraft limit +10.
        //requires Lumber, Iron, Marble, Aluminium, tech > 5
        bool fastFood;
        //fast food
        // //DONE //Increases population happiness + 2.
        //requires Cattle, Sugar, Spices, Pigs
        bool fineJewelry;
        //fine jewelry
        // //DONE //Increases population happiness + 3.
        //requires Gold, Silver, Gems, Coal
        bool scholars;
        //scholars
        // //DONE //increases population income +$3.00
        //requires literacy rate > 90%, lumber, lead
        bool asphalt;
        //asphalt
        // //DONE //Lowers infrastructure upkeep cost -5%.
        //requires Construction, Oil, Rubber
        bool automobiles;
        //automobiles
        // //DONE //Increases population happiness +3.
        //requires Asphalt, Steel
        bool affluentPopulation;
        //affluent population
        //DONE //Increases number of citizens +5%.
        //requires fineJewelry, Fish, Furs, Wine
        bool microchips;
        //microchips
        // //DONE //reduces tech cost -8%
        // //DONE //increases population happiness +2
        // //DONE //lowers frigate, destroyer, submarine, aircraft carrier upkeep cost -10%
        //requires Gold, Lead, Oil, tech > 10
        bool radiationCleanup;
        //radiation cleanup
        //reduces nuclear anarchy effects by 1 day
        // //DONE //Improves a nation's environment by 1
        // //DONE //Reduces global radiation for your nation by 50%
        //requires Construction, Microchips, Steel and Technology > 15
    }

    mapping(uint256 => BonusResources) public idToBonusResources;

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "this function is only callable from the country minter contract"
        );
        _;
    }

    modifier onlyResources() {
        require(msg.sender == resources, "function only callable from resources contract");
        _;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _infrastructure,
        address _countryMinter,
        address _resources
    ) public onlyOwner {
        infrastructure = _infrastructure;
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        resources = _resources;
        res = ResourcesContract(_resources);
    }

    ///@dev this is a public function that is only callable from the country minter contract when a nation is minted
    ///@dev this function will allow a nation to store the bonus resources they have access to
    ///@notice this function will allow a nation to store the bonus resources they have access to
    ///@param id is the nation id of the nation being minted
    function generateBonusResources(uint256 id) public onlyCountryMinter {
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
        idToBonusResources[id] = newBonusResources;
    }

    ///@dev this is an internal function only callable from this contract
    ///@notice bonus resources are certain resources that you can get credit for only hen you have the correct mix of primary resources and parameters
    ///@param id is the nation id of the nation whose resources are being reset
    function setBonusResources(uint256 id) public onlyResources {
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
        bool beer = checkBeer(id);
        if (beer) {
            idToBonusResources[id].beer = true;
        }
        //check for steel (coal, iron)
        bool steel = checkSteel(id);
        if (steel) {
            idToBonusResources[id].steel = true;
        }
        //construction (lumber, iron, marble, aluminum)
        bool construction = checkConstruction(id);
        if (construction) {
            idToBonusResources[id].construction = true;
        }
        //fast food (cattle sugar spices pigs)
        bool fastFood = checkFastFood(id);
        if (fastFood) {
            idToBonusResources[id].fastFood = true;
        }
        //fine jewelry (gold silver gems coal)
        bool fineJewelry = checkFineJewelry(id);
        if (fineJewelry) {
            idToBonusResources[id].fineJewelry = true;
        }
        //scholars (lumber, lead, literacy >90%)
        uint256 literacyRate;
        bool scholars = checkScholars(id);
        if (literacyRate > 90 && scholars) {
            idToBonusResources[id].scholars = true;
        }
        //asphalt (construction, oil, rubber)
        bool asphalt = checkAsphalt(id);
        if (asphalt) {
            idToBonusResources[id].asphalt = true;
        }
        //automobiles (asphalt, Steel)
        bool automobiles = checkAutomobiles(id);
        if (automobiles) {
            idToBonusResources[id].automobiles = true;
        }
        //affluent population (fine jewelry fish furs wine)
        bool affluentPopulation = checkAffluentPopulation(id);
        if (affluentPopulation) {
            idToBonusResources[id].affluentPopulation = true;
        }
        setAdditionalBonusResources(id);
    }

    function setAdditionalBonusResources(uint256 id) internal {
        //microchips (Gold, Lead, Oil, tech > 10)
        uint256 techAmount = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        bool microchips = checkMicrochips(id);
        if (techAmount >= 10 && microchips) {
            idToBonusResources[id].microchips = true;
        }
        //radiation cleanup (Construction, Microchips, Steel and Technology > 15)
        bool radiationCleanup = checkRadiationCleanup(id);
        if (techAmount >= 15 && radiationCleanup) {
            idToBonusResources[id].radiationCleanup = true;
        }
    }

    function checkBeer(uint256 id) public view returns (bool) {
        bool aluminium = res.viewAluminium(id);    
        bool lumber = res.viewLumber(id);    
        bool water = res.viewWater(id);    
        bool wheat = res.viewWheat(id);
        if (aluminium && lumber && water && wheat) {
            return true;
        } else {
            return false;
        }
    }

    function checkSteel(uint256 id) public view returns (bool) {
        bool iron = res.viewIron(id);    
        bool coal = res.viewCoal(id);
        if (iron && coal) {
            return true;
        } else {
            return false;
        }
    }

    function checkConstruction(uint256 id) public view returns (bool) {
        bool aluminium = res.viewAluminium(id);    
        bool iron = res.viewIron(id);    
        bool lumber = res.viewLumber(id);    
        bool marble = res.viewMarble(id);
        if (aluminium && iron && lumber && marble) {
            return true;
        } else {
            return false;
        }
    }

    function checkFastFood(uint256 id) public view returns (bool) {
        bool cattle = res.viewCattle(id);    
        bool sugar = res.viewSugar(id);    
        bool spices = res.viewSpices(id);    
        bool pigs = res.viewPigs(id);
        if (cattle && sugar && spices && pigs) {
            return true;
        } else {
            return false;
        }
    }

    function checkFineJewelry(uint256 id) public view returns (bool) {
        bool gold = res.viewGold(id);    
        bool silver = res.viewSilver(id);    
        bool gems = res.viewGems(id);    
        bool coal = res.viewCoal(id);
        if (gold && silver && gems && coal) {
            return true;
        } else {
            return false;
        }
    }

    function checkScholars(uint256 id) public view returns (bool) {
        bool lumber = res.viewLumber(id);    
        bool lead = res.viewLead(id);
        if (lumber && lead) {
            return true;
        } else {
            return false;
        }
    }

    function checkAsphalt(uint256 id) public view returns (bool) {
        bool construction = idToBonusResources[id].construction;    
        bool oil = res.viewOil(id);
        bool rubber = res.viewRubber(id);
        if (construction && oil && rubber) {
            return true;
        } else {
            return false;
        }
    }

    function checkAutomobiles(uint256 id) public view returns (bool) {
        bool asphalt = idToBonusResources[id].asphalt;    
        bool steel = idToBonusResources[id].steel;    
        if (asphalt && steel) {
            return true;
        } else {
            return false;
        }
    }

    function checkAffluentPopulation(uint256 id) public view returns (bool) {
        bool fineJewelry = idToBonusResources[id].fineJewelry;    
        bool fish = res.viewFish(id);
        bool furs = res.viewFurs(id);   
        bool wine = res.viewWine(id);   
        if (fineJewelry && fish && furs && wine) {
            return true;
        } else {
            return false;
        }
    }

    function checkMicrochips(uint256 id) public view returns (bool) {  
        bool gold = res.viewGold(id);
        bool lead = res.viewLead(id);   
        bool oil = res.viewOil(id);   
        if (gold && lead && oil) {
            return true;
        } else {
            return false;
        }
    }

    function checkRadiationCleanup(uint256 id) public view returns (bool) {  
        bool construction = idToBonusResources[id].construction;
        bool microchips = idToBonusResources[id].microchips;
        bool steel = idToBonusResources[id].steel;
        if (construction && microchips && steel) {
            return true;
        } else {
            return false;
        }
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the affluent population resource
    ///@notice this function will return a boolean value of true if a nation has access to the affluent population resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the affluent population resource
    function viewAffluentPopulation(uint256 id) public view returns (bool) {
        bool isAffluentPopulation = idToBonusResources[id].affluentPopulation;
        return isAffluentPopulation;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the asphalt resource
    ///@notice this function will return a boolean value of true if a nation has access to the asphalt resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the asphalt resource
    function viewAsphalt(uint256 id) public view returns (bool) {
        bool isAsphalt = idToBonusResources[id].asphalt;
        return isAsphalt;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the automobiles resource
    ///@notice this function will return a boolean value of true if a nation has access to the automobiles resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the automobiles resource
    function viewAutomobiles(uint256 id) public view returns (bool) {
        bool isAutomobiles = idToBonusResources[id].automobiles;
        return isAutomobiles;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the beer resource
    ///@notice this function will return a boolean value of true if a nation has access to the beer resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the beer resource
    function viewBeer(uint256 id) public view returns (bool) {
        bool isBeer = idToBonusResources[id].beer;
        return isBeer;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the construction resource
    ///@notice this function will return a boolean value of true if a nation has access to the construction resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the construction resource
    function viewConstruction(uint256 id) public view returns (bool) {
        bool isConstruction = idToBonusResources[id].construction;
        return isConstruction;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the fast food resource
    ///@notice this function will return a boolean value of true if a nation has access to the fast food resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the fast food resource
    function viewFastFood(uint256 id) public view returns (bool) {
        bool isFastFood = idToBonusResources[id].fastFood;
        return isFastFood;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the fine jewelry resource
    ///@notice this function will return a boolean value of true if a nation has access to the fine jewelry resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the fine jewelry resource
    function viewFineJewelry(uint256 id) public view returns (bool) {
        bool isFineJewelry = idToBonusResources[id].fineJewelry;
        return isFineJewelry;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the microships resource
    ///@notice this function will return a boolean value of true if a nation has access to the microships resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the microchips resource
    function viewMicrochips(uint256 id) public view returns (bool) {
        bool isMicrochips = idToBonusResources[id].microchips;
        return isMicrochips;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the radiation cleanup resource
    ///@notice this function will return a boolean value of true if a nation has access to the radiation cleanup resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the radiation cleanup resource
    function viewRadiationCleanup(uint256 id) public view returns (bool) {
        bool isRadiationCleanup = idToBonusResources[id].radiationCleanup;
        return isRadiationCleanup;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the scholars resource
    ///@notice this function will return a boolean value of true if a nation has access to the scholars resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the scholars resource
    function viewScholars(uint256 id) public view returns (bool) {
        bool isScholars = idToBonusResources[id].scholars;
        return isScholars;
    }

    ///@dev this is a public view function that will retrun a boolean value of true if a nation has access to the steel resource
    ///@notice this function will return a boolean value of true if a nation has access to the steel resource
    ///@param id is the nation id of the nation being queried
    ///@return bool this value will be true if the nation has the steel resource
    function viewSteel(uint256 id) public view returns (bool) {
        bool isSteel = idToBonusResources[id].steel;
        return isSteel;
    }
}
