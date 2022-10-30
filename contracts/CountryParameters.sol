//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CountryParametersContract is VRFConsumerBaseV2, Ownable {
    uint256 private parametersId;
    address public spyAddress;
    uint256[] private s_randomWords;

    //chainlink variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 2;

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
    mapping(uint256 => address) public idToOwnerParameters;

    /* Functions */
    constructor(
        // address _spyAddress,
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        // spyAddress = _spyAddress;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function updateSpyAddress(address newAddress) public onlyOwner {
        spyAddress = newAddress;
    }

    modifier onlySpyContract {
        require(msg.sender == spyAddress, "function only callable from spy contract");
        _;
    }

    function generateCountryParameters(
        uint256 id,
        address nationOwner,
        string memory rulerName,
        string memory nationName,
        string memory capitalCity,
        string memory nationSlogan
    ) public {
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
            "Alliance",
            0,
            0,
            0,
            0,
            0
        );
        idToCountryParameters[id] = newCountryParameters;
        idToCountrySettings[id] = newCountrySettings;
        idToOwnerParameters[id] = nationOwner;
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
        //should this be resourcesID?
        s_requestIdToRequestIndex[requestId] = id;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        uint256 requestNumber = s_requestIdToRequestIndex[requestId];
        s_requestIndexToRandomWords[requestNumber] = randomWords;
        s_randomWords = randomWords;
        uint256 religionPreference = ((s_randomWords[0] % 14) + 1);
        uint256 governmentPreference = ((s_randomWords[1] % 10) + 1);
        idToReligionPreference[requestNumber] = religionPreference;
        idToGovernmentPreference[requestNumber] = governmentPreference;
    }

    function setRulerName(string memory newRulerName, uint256 id) public {
        require(
            idToOwnerParameters[id] == msg.sender,
            "You are not the nation ruler"
        );
        idToCountryParameters[id].rulerName = newRulerName;
    }

    function setNationName(string memory newNationName, uint256 id) public {
        require(
            idToOwnerParameters[id] == msg.sender,
            "You are not the nation ruler"
        );
        idToCountryParameters[id].nationName = newNationName;
    }

    function setCapitalCity(string memory newCapitalCity, uint256 id) public {
        require(
            idToOwnerParameters[id] == msg.sender,
            "This account is not the nation ruler"
        );
        idToCountryParameters[id].capitalCity = newCapitalCity;
    }

    function setNationSlogan(string memory newNationSlogan, uint256 id) public {
        require(
            idToOwnerParameters[id] == msg.sender,
            "This account is not the nation ruler"
        );
        idToCountryParameters[id].nationSlogan = newNationSlogan;
    }

    function setAlliance(string memory newAlliance, uint256 id) public {
        require(
            idToOwnerParameters[id] == msg.sender,
            "You are not the nation ruler"
        );
        idToCountrySettings[id].alliance = newAlliance;
    }

    function setTeam(uint256 id, uint256 newTeam) public {
        require(
            idToOwnerParameters[id] == msg.sender,
            "You are not the nation ruler"
        );
        idToCountrySettings[id].nationTeam = newTeam;
    }

    function setGovernment(uint256 id, uint256 newType) public {
        require(
            idToOwnerParameters[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 daysSinceChange = idToCountrySettings[id]
            .daysSinceGovernmentChenge;
        require(daysSinceChange >= 3, "need to wait 3 days before changing");
        require(newType <= 10, "invalid type");
        idToCountrySettings[id].governmentType = newType;
        idToCountrySettings[id].daysSinceGovernmentChenge = 0;
    }

    function updateDesiredGovernment(uint256 id, uint256 newType) public onlySpyContract {
        idToGovernmentPreference[id] = newType;
    }

    function setReligion(uint256 id, uint256 newType) public {
        require(
            idToOwnerParameters[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 daysSinceChange = idToCountrySettings[id]
            .daysSinceReligionChange;
        require(daysSinceChange >= 3, "need to wait 3 days before changing");
        require(newType <= 14, "invalid type");
        idToCountrySettings[id].daysSinceReligionChange = newType;
        idToCountrySettings[id].daysSinceReligionChange = 0;
    }

    function updateDesiredReligion(uint256 id, uint256 newType) public onlySpyContract {
        idToReligionPreference[id] = newType;
    }

    //needs to be called by a keeper
    function incrementDaysSince() external {
        uint256 i;
        for (i = 0; i < parametersId; i++) {
            idToCountrySettings[i].daysSinceGovernmentChenge++;
            idToCountrySettings[i].daysSinceReligionChange++;
        }
    }

    function getRulerName(uint256 countryId) public view returns (string memory) {
        string storage ruler = idToCountryParameters[countryId].rulerName;
        return ruler;
    }

    function getNationName(uint256 countryId) public view returns (string memory) {
        string storage nationName = idToCountryParameters[countryId].nationName;
        return nationName;
    }

    function getCapital(uint256 countryId) public view returns (string memory) {
        string storage capital = idToCountryParameters[countryId].capitalCity;
        return capital;
    }

    function getSlogan(uint256 countryId) public view returns (string memory) {
        string storage slogan = idToCountryParameters[countryId].nationSlogan;
        return slogan;
    }

    function getAlliance(uint256 countryId) public view returns (string memory) {
        string storage alliance = idToCountrySettings[countryId].alliance;
        return alliance;
    }

    function getTeam(uint256 countryId) public view returns (uint256) {
        uint256 team = idToCountrySettings[countryId].nationTeam;
        return team;
    }

    function getGovernmentType(uint256 countryId)
        public
        view
        returns (uint256)
    {
        uint256 government = idToCountrySettings[countryId].governmentType;
        return government;
    }

    function getReligionType(uint256 countryId) public view returns (uint256) {
        uint256 religion = idToCountrySettings[countryId].nationalReligion;
        return religion;
    }

    function getTimeCreated(uint256 countryId) public view returns (uint256) {
        uint256 timeCreated = idToCountrySettings[countryId].timeCreated;
        return timeCreated;
    }

    function getGovernmentPreference(uint256 id) public view returns (uint256 preference) {
        uint256 preferredGovernment = idToGovernmentPreference[id];
        return preferredGovernment;
    }

    function getReligionPreference(uint256 id) public view returns (uint256 preference) {
        uint256 preferredReligion = idToReligionPreference[id];
        return preferredReligion;
    }

}
