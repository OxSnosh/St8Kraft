//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./CountryMinter.sol";
import "./Senate.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title CountryParametersContract
///@author OxSnosh
///@dev this contract will inferit from Chainlink VRF and OpenZeppelin Ownable
contract CountryParametersContract is VRFConsumerBaseV2, Ownable {
    address public spyAddress;
    address public senateAddress;
    uint256[] private s_randomWords;
    address public countryMinter;
    address public keeper;

    //chainlink variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 2;

    CountryMinter mint;
    SenateContract senate;

    event randomNumbersRequested(uint256 indexed requestId);
    event randomNumbersFulfilled(
        uint256 indexed preferredReligion,
        uint256 indexed preferredGovernment
    );

    struct CountryParameters {
        uint256 id;
        address rulerAddress;
        string rulerName;
        string nationName;
        string capitalCity;
        string nationSlogan;
    }

    struct CountrySettings {
        uint256 timeCreated;
        string alliance;
        uint256 nationTeam;
        uint256 governmentType;
        uint256 daysSinceGovernmentChenge;
        uint256 nationalReligion;
        uint256 daysSinceReligionChange;
    }

    mapping(uint256 => CountryParameters) public idToCountryParameters;
    mapping(uint256 => CountrySettings) public idToCountrySettings;
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;
    mapping(uint256 => uint256) private idToReligionPreference;
    mapping(uint256 => uint256) private idToGovernmentPreference;

    // mapping(uint256 => address) public idToOwnerParameters;

    ///@dev the consructor will inherit parameters required to initialize the chainlinh VRF functionality
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

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _spy,
        address _countryMinter,
        address _senate,
        address _keeper
    ) public onlyOwner {
        spyAddress = _spy;
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        senateAddress = _senate;
        senate = SenateContract(_senate);
        keeper = _keeper;
    }

    modifier onlySpyContract() {
        require(
            msg.sender == spyAddress,
            "function only callable from spy contract"
        );
        _;
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "function only callable from the country minter contract"
        );
        _;
    }

    modifier onlyKeeperContract() {
        require(
            msg.sender == keeper,
            "function only callable from the keeper contract"
        );
        _;
    }

    ///@dev this is a public function but only callable from the counry minter contract
    ///@notice this function will get called only when a nation is minted
    ///@param id this will be the nations ID that is passed in from the country minter contact
    ///@param nationOwner this will be the address of the nation owner that gets passed in from the country minter contract
    ///@param rulerName name passed in from country minter contract when a nation is minted
    ///@param nationName passed in from the country minter contract when a nation is minted
    ///@param capitalCity passed in from the country minter contract when a nation is minted
    ///@param nationSlogan passed in from the country minter contract when a nation is minted
    function generateCountryParameters(
        uint256 id,
        address nationOwner,
        string memory rulerName,
        string memory nationName,
        string memory capitalCity,
        string memory nationSlogan
    ) public onlyCountryMinter {
        CountryParameters memory newCountryParameters = CountryParameters(
            id,
            nationOwner,
            rulerName,
            nationName,
            capitalCity,
            nationSlogan
        );
        CountrySettings memory newCountrySettings = CountrySettings(
            block.timestamp,
            "No Alliance Yet",
            0,
            0,
            3,
            0,
            3
        );
        idToCountryParameters[id] = newCountryParameters;
        idToCountrySettings[id] = newCountrySettings;
        // fulfillRequest(id);
    }

    ///change to internal before deployment

    ///@dev this is an internal function that will initalize the call for randomness from the chainlink VRF contract
    ///@param id is the nation ID of the nation being minted
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

    ///@dev this is the function that gets called by the chainlink VRF contract
    ///@param requestId is the parameter that will allow the chainlink VRF to store a nations corresponding random words
    ///@param randomWords this array will contain 2 random numbers that will be used to determine a nations desired religion and government upon minting
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        s_randomWords = s_requestIndexToRandomWords[requestNumber];
        uint256 religionPreference = ((randomWords[0] % 14) + 1);
        uint256 governmentPreference = ((randomWords[1] % 10) + 1);
        emit randomNumbersFulfilled(religionPreference, governmentPreference);
        idToReligionPreference[requestNumber] = religionPreference;
        idToGovernmentPreference[requestNumber] = governmentPreference;
    }

    ///@dev this is public function that will allow a nation ruler to reset a nations ruler name
    ///@notice use this function to reset a nations ruler name
    ///@notice this function is only callable by the nation owner
    ///@param newRulerName is the updated name for the nation ruler
    ///@param id is the nation ID for the update
    function setRulerName(string memory newRulerName, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        idToCountryParameters[id].rulerName = newRulerName;
    }

    ///@dev this is public function that will allow a nation ruler to reset a nations name
    ///@notice use this function to reset a nations name
    ///@notice this function is only callable by the nation owner
    ///@param newNationName is the updated name for the nation ruler
    ///@param id is the nation ID for the update
    function setNationName(string memory newNationName, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        idToCountryParameters[id].nationName = newNationName;
    }

    ///@dev this is public function that will allow a nation ruler to reset a nations capital city name
    ///@notice use this function to reset a nations capital city name
    ///@notice this function is only callable by the nation owner
    ///@param newCapitalCity is the updated name for the nation ruler
    ///@param id is the nation ID for the update
    function setCapitalCity(string memory newCapitalCity, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        idToCountryParameters[id].capitalCity = newCapitalCity;
    }

    ///@dev this is public function that will allow a nation ruler to reset a nations slogan
    ///@notice use this function to reset a nations slogan
    ///@notice this function is only callable by the nation owner
    ///@param newNationSlogan is the updated name for the nation ruler
    ///@param id is the nation ID for the update
    function setNationSlogan(string memory newNationSlogan, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        idToCountryParameters[id].nationSlogan = newNationSlogan;
    }

    ///@dev this is public function that will allow a nation ruler to set an alliance
    ///@notice use this function to set an alliance
    ///@notice this function is only callable by the nation owner
    ///@notice there are an unlimited number of alliances , anyone can start an alliance
    ///@param newAlliance is the updated name for the nation ruler
    ///@param id is the nation ID for the update
    function setAlliance(string memory newAlliance, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        idToCountrySettings[id].alliance = newAlliance;
    }

    ///@dev this is public function that will allow a nation ruler to set a team membership for the nation
    ///@notice use this function to set a team membership for the nation
    ///@notice this function is only callable by the nation owner
    ///@notice there are only 15 teams in the game, each team has senators that can sanction nations on that team from trading and send sending aid to eachother
    ///@param newTeam is the updated name for the nation ruler
    ///@param id is the nation ID for the update
    function setTeam(uint256 id, uint256 newTeam) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        require(newTeam <= 15, "invalid team selection");
        bool isSenator = senate.isSenator(id);
        require(isSenator == false, "cannot chenge teams as a senator");
        idToCountrySettings[id].nationTeam = newTeam;
    }

    ///@dev this is public function that will allow a nation ruler to chenge their government type
    ///@notice use this function to reset a nations government type
    ///@notice this function is only callable by the nation owner
    ///@notice there are 10 government types each with different advantages
    ///@param newType is the updated name for the nation ruler
    ///@param id is the nation ID for the update
    function setGovernment(uint256 id, uint256 newType) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 daysSinceChange = idToCountrySettings[id]
            .daysSinceGovernmentChenge;
        require(daysSinceChange >= 3, "need to wait 3 days before changing");
        require(newType <= 10, "invalid type");
        require(newType > 0, "invalid type");
        idToCountrySettings[id].governmentType = newType;
        idToCountrySettings[id].daysSinceGovernmentChenge = 0;
    }

    ///@dev this is a public function but it is only callable from the spy contract
    ///@notice this is the function that the spy contract calls when a successful spy attack updates your desired governemnt
    ///@param id is the nation id of the updated desired government
    ///@param newType is the updated governemnt type
    function updateDesiredGovernment(
        uint256 id,
        uint256 newType
    ) public onlySpyContract {
        idToGovernmentPreference[id] = newType;
    }

    ///@dev this is public function that will allow a nation ruler to chenge their religion type
    ///@notice use this function to reset a nations religion type
    ///@notice this function is only callable by the nation owner
    ///@notice there are 14 religion types
    ///@param newType is the updated name for the nation ruler
    ///@param id is the nation ID for the update
    function setReligion(uint256 id, uint256 newType) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 daysSinceChange = idToCountrySettings[id]
            .daysSinceReligionChange;
        require(daysSinceChange >= 3, "need to wait 3 days before changing");
        require(newType > 0, "invalid type");
        require(newType <= 14, "invalid type");
        idToCountrySettings[id].nationalReligion = newType;
        idToCountrySettings[id].daysSinceReligionChange = 0;
    }

    ///@dev this is a public function but it is only callable from the spy contract
    ///@notice this is the function that the spy contract calls when a successful spy attack updates your desired religion
    ///@param id is the nation id of the updated desired religion
    ///@param newType is the updated religion type
    function updateDesiredReligion(
        uint256 id,
        uint256 newType
    ) public onlySpyContract {
        idToReligionPreference[id] = newType;
    }

    //needs to be called by a keeper
    ///@dev this is an esterna function that is only callable from the keeper contract
    ///@dev this function will increment the days since a religion and goverment change
    ///@notice ruler must wait 3 days to change religion and government
    function incrementDaysSince() external onlyKeeperContract {
        uint256 countryCount = mint.getCountryCount();
        uint256 i;
        for (i = 0; i < countryCount; i++) {
            idToCountrySettings[i].daysSinceGovernmentChenge++;
            idToCountrySettings[i].daysSinceReligionChange++;
        }
    }

    ///@dev this is a view funtion that will return the ruler name for a country
    ///@param countryId this is the ID for the nation being queried
    function getRulerName(
        uint256 countryId
    ) public view returns (string memory) {
        string memory ruler = idToCountryParameters[countryId].rulerName;
        return ruler;
    }

    ///@dev this is a view funtion that will return the nation name for a country
    ///@param countryId this is the ID for the nation being queried
    function getNationName(
        uint256 countryId
    ) public view returns (string memory) {
        string memory nationName = idToCountryParameters[countryId].nationName;
        return nationName;
    }

    ///@dev this is a view funtion that will return the capital city for a country
    ///@param countryId this is the ID for the nation being queried
    function getCapital(uint256 countryId) public view returns (string memory) {
        string memory capital = idToCountryParameters[countryId].capitalCity;
        return capital;
    }

    ///@dev this is a view funtion that will return the slogan for a country
    ///@param countryId this is the ID for the nation being queried
    function getSlogan(uint256 countryId) public view returns (string memory) {
        string memory slogan = idToCountryParameters[countryId].nationSlogan;
        return slogan;
    }

    ///@dev this is a view funtion that will return the alliance name for a country
    ///@param countryId this is the ID for the nation being queried
    function getAlliance(
        uint256 countryId
    ) public view returns (string memory) {
        string memory alliance = idToCountrySettings[countryId].alliance;
        return alliance;
    }

    ///@dev this is a view funtion that will return the team for a country
    ///@param countryId this is the ID for the nation being queried
    function getTeam(uint256 countryId) public view returns (uint256) {
        return idToCountrySettings[countryId].nationTeam;
    }

    ///@dev this is a view funtion that will return the goverment type for a country
    ///@param countryId this is the ID for the nation being queried
    function getGovernmentType(
        uint256 countryId
    ) public view returns (uint256) {
        return idToCountrySettings[countryId].governmentType;
    }

    ///@dev this is a view funtion that will return the religion type for a country
    ///@param countryId this is the ID for the nation being queried
    function getReligionType(uint256 countryId) public view returns (uint256) {
        return idToCountrySettings[countryId].nationalReligion;
    }

    ///@dev this is a view funtion that will return the time a nation was minted
    ///@param countryId this is the ID for the nation being queried
    function getTimeCreated(uint256 countryId) public view returns (uint256) {
        return idToCountrySettings[countryId].timeCreated;
    }

    ///@dev this is a view funtion that will return the government preference for a country
    ///@param id this is the ID for the nation being queried
    function getGovernmentPreference(
        uint256 id
    ) public view returns (uint256 preference) {
        return idToGovernmentPreference[id];
    }

    ///@dev this is a view funtion that will return the religion preference for a country
    ///@param id this is the ID for the nation being queried
    function getReligionPreference(
        uint256 id
    ) public view returns (uint256 preference) {
        return idToReligionPreference[id];
    }

    ///@dev this is a view funtion that will return the days since a religion and governemnt change for a nation
    ///@param id this is the ID for the nation being queried
    ///@return uint256 will return an array with [0] as the days since governemtn change and [1] as days since religion change
    function getDaysSince(uint256 id) public view returns (uint256, uint256) {
        uint256 daysSinceGovChange = idToCountrySettings[id]
            .daysSinceGovernmentChenge;
        uint256 daysSinceReligionChange = idToCountrySettings[id]
            .daysSinceReligionChange;
        return (daysSinceGovChange, daysSinceReligionChange);
    }
}
