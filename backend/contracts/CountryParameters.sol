//SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "./CountryMinter.sol";
import "./Senate.sol";
import "./KeeperFile.sol";
import "./Wonders.sol";
import "./Treasury.sol";    
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

///@title CountryParametersContract
///@author OxSnosh
///@dev this contract will inferit from Chainlink VRF and OpenZeppelin Ownable
contract CountryParametersContract is VRFConsumerBaseV2, Ownable {
    address public spyAddress;
    address public senateAddress;
    uint256[] private s_randomWords;
    address public countryMinter;
    address public keeper;
    address public nuke;
    address public groundBattle;
    address public wonders1;
    address public treasury;

    //chainlink variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 2;

    CountryMinter mint;
    SenateContract senate;
    KeeperContract keep;
    WondersContract1 won1;
    TreasuryContract tres;

    struct CountryParameters {
        uint256 id;
        string rulerName;
        string nationName;
        string capitalCity;
        string nationSlogan;
    }

    struct CountrySettings {
        uint256 dayCreated;
        string alliance;
        uint256 nationTeam;
        uint256 governmentType;
        uint256 dayGovernmentChanged;
        uint256 nationalReligion;
        uint256 dayReligionChanged;
        uint256 dayOfAnarchy;
    }

    event RulerNameChanged(
        uint256 indexed countryId,
        string indexed newRulerName
    );

    event NationNameChanged(
        uint256 indexed countryId,
        string indexed newNationName
    );

    event CapitalCityChanged(
        uint256 indexed countryId,
        string indexed newCapitalCity
    );

    event NationSloganChanged(
        uint256 indexed countryId,
        string indexed newNationSlogan
    );

    event AllianceChanged(
        uint256 indexed countryId,
        string indexed newAlliance
    );

    event TeamChanged(uint256 indexed countryId, uint256 indexed newTeam);

    event GovernmentChanged(
        uint256 indexed countryId,
        uint256 indexed newGovernment
    );

    event ReligionChanged(
        uint256 indexed countryId,
        uint256 indexed newReligion
    );

    event AnarchyInflicted(uint256 indexed countryId);

    mapping(uint256 => CountryParameters) public idToCountryParameters;
    mapping(uint256 => CountrySettings) public idToCountrySettings;
    mapping(uint256 => uint256) s_requestIdToRequestIndex;
    mapping(uint256 => uint256[]) public s_requestIndexToRandomWords;
    mapping(uint256 => uint256) private idToReligionPreference;
    mapping(uint256 => uint256) private idToGovernmentPreference;

    // mapping(uint256 => address) public idToOwnerParameters;

    modifier onlyNukeAndGroundBattle() {
        require(
            msg.sender == nuke || msg.sender == groundBattle,
            "function only callable from nuke or battle contract"
        );
        _;
    }

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
        address _keeper,
        address _nuke,
        address _groundBattle,
        address _wonders1,
        address _treasury
    ) public onlyOwner {
        spyAddress = _spy;
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        senateAddress = _senate;
        senate = SenateContract(_senate);
        keeper = _keeper;
        keep = KeeperContract(_keeper);
        nuke = _nuke;
        groundBattle = _groundBattle;
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        treasury = _treasury;
        tres = TreasuryContract(_treasury);
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

    ///@dev this is a public function but only callable from the counry minter contract
    ///@notice this function will get called only when a nation is minted
    ///@param id this will be the nations ID that is passed in from the country minter contact
    ///@param rulerName name passed in from country minter contract when a nation is minted
    ///@param nationName passed in from the country minter contract when a nation is minted
    ///@param capitalCity passed in from the country minter contract when a nation is minted
    ///@param nationSlogan passed in from the country minter contract when a nation is minted
    function generateCountryParameters(
        uint256 id,
        string memory rulerName,
        string memory nationName,
        string memory capitalCity,
        string memory nationSlogan
    ) public onlyCountryMinter {
        CountryParameters memory newCountryParameters = CountryParameters(
            id,
            rulerName,
            nationName,
            capitalCity,
            nationSlogan
        );
        uint256 day = keep.getGameDay();
        CountrySettings memory newCountrySettings = CountrySettings(
            day,
            "No Alliance Yet",
            0,
            0,
            0,
            0,
            0,
            0
        );
        idToCountryParameters[id] = newCountryParameters;
        idToCountrySettings[id] = newCountrySettings;
        fulfillRequest(id);
    }

    ///@dev this is an internal function that will initalize the call for randomness from the chainlink VRF contract
    ///@param id is the nation ID of the nation being minted
    function fulfillRequest(uint256 id) internal {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToRequestIndex[requestId] = id;
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
        uint256 governmentPreference = ((randomWords[1] % 9) + 1);
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
        tres.spendBalance(id, 20000000 * (10**18));
        idToCountryParameters[id].rulerName = newRulerName;
        emit RulerNameChanged(id, newRulerName);
    }

    ///@dev this is public function that will allow a nation ruler to reset a nations name
    ///@notice use this function to reset a nations name
    ///@notice this function is only callable by the nation owner
    ///@param newNationName is the updated name for the nation ruler
    ///@param id is the nation ID for the update
    function setNationName(string memory newNationName, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        tres.spendBalance(id, 20000000 * (10**18));
        idToCountryParameters[id].nationName = newNationName;
        emit NationNameChanged(id, newNationName);
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
        emit CapitalCityChanged(id, newCapitalCity);
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
        emit NationSloganChanged(id, newNationSlogan);
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
        emit AllianceChanged(id, newAlliance);
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
        senate.updateTeam(id, newTeam);
        idToCountrySettings[id].nationTeam = newTeam;
        emit TeamChanged(id, newTeam);
    }

    ///@dev this is public function that will allow a nation ruler to chenge their government type
    ///@notice use this function to reset a nations government type
    ///@notice this function is only callable by the nation owner
    ///@notice there are 10 government types each with different advantages
    ///@param newType is the updated type of government
    /** @notice for newType:
     * 0 = Anarchy
     * 1 = Capitalism
     * 2 = Communist
     * 3 = Democracy
     * 4 = Dictatorship
     * 5 = Federal Government
     * 6 = Monarchy
     * 7 = Republic
     * 8 = Revolutionary
     * 9 = Totalitarian
     * 10 = Transitional
     ***/
    ///@param id is the nation ID for the update
    function setGovernment(uint256 id, uint256 newType) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 gameDay = keep.getGameDay();
        uint256 anarchyDay = idToCountrySettings[id].dayOfAnarchy;
        bool falloutShelter = won1.getFalloutShelterSystem(id);
        if (falloutShelter) {
            require(
                (gameDay - anarchyDay) >= 4,
                "nation in anarchy, must wait 4 days"
            );
        } else {
            require(
                (gameDay - anarchyDay) >= 5,
                "nation in anarchy, must wait 5 days"
            );
        }
        uint256 dayOfChange = idToCountrySettings[id].dayGovernmentChanged;
        require(
            (gameDay - dayOfChange) >= 3,
            "need to wait 3 days before changing"
        );
        require(newType <= 10, "invalid type");
        require(newType > 0, "invalid type");
        idToCountrySettings[id].governmentType = newType;
        idToCountrySettings[id].dayGovernmentChanged = gameDay;
        emit GovernmentChanged(id, newType);
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
        uint256 gameDay = keep.getGameDay();
        uint256 dayOfChange = idToCountrySettings[id].dayReligionChanged;
        require(
            (gameDay - dayOfChange) >= 3,
            "need to wait 3 days before changing"
        );
        require(newType > 0, "invalid type");
        require(newType <= 14, "invalid type");
        idToCountrySettings[id].nationalReligion = newType;
        idToCountrySettings[id].dayReligionChanged = gameDay;
        emit ReligionChanged(id, newType);
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

    function inflictAnarchy(uint256 id) public onlyNukeAndGroundBattle {
        uint256 gameDay = keep.getGameDay();
        idToCountrySettings[id].governmentType = 0;
        idToCountrySettings[id].dayOfAnarchy = gameDay;
        emit AnarchyInflicted(id);
        emit GovernmentChanged(id, 0);
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
    function getDayCreated(uint256 countryId) public view returns (uint256) {
        return idToCountrySettings[countryId].dayCreated;
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
        uint256 gameDay = keep.getGameDay();
        uint256 dayOfGovChange = idToCountrySettings[id].dayGovernmentChanged;
        uint256 daysSinceGovChange = gameDay - dayOfGovChange;
        uint256 dayReligionChanged = idToCountrySettings[id].dayReligionChanged;
        uint256 daysSinceReligionChange = gameDay - dayReligionChanged;
        return (daysSinceGovChange, daysSinceReligionChange);
    }

    uint256 public allianceCounter; // Unique ID counter for alliances

    struct Alliance {
        uint256 id;
        string name;
        uint256 founderNationId;
        mapping(uint256 => bool) admins; // Stores nationIds as admins
        mapping(uint256 => uint256) nationToPlatoon; // Maps nation ID to sub-platoon ID
        uint256[] members;
        uint256[] joinRequests;
    }

    mapping(uint256 => Alliance) public alliances;
    mapping(uint256 => uint256) public nationToAlliance; // Maps nation ID to alliance ID
    mapping(uint256 => bool) public allianceExists; // Tracks if an alliance exists

    event AllianceCreated(uint256 indexed allianceId, string name, uint256 founderNationId);
    event AllianceAdminAdded(uint256 indexed allianceId, uint256 indexed adminNationId);
    event AllianceAdminRemoved(uint256 indexed allianceId, uint256 indexed adminNationId);
    event NationRequestedToJoin(uint256 indexed allianceId, uint256 indexed nationId);
    event NationApprovedToJoin(uint256 indexed allianceId, uint256 indexed nationId);
    event NationRemovedFromAlliance(uint256 indexed allianceId, uint256 indexed nationId);
    event NationAssignedToPlatoon(uint256 indexed allianceId, uint256 indexed nationId, uint256 platoonId);

    modifier onlyAllianceFounderOrAdmin(uint256 allianceId, uint256 nationId) {
        require(
            nationId == alliances[allianceId].founderNationId || alliances[allianceId].admins[nationId],
            "Not authorized"
        );
        _;
    }

    function getNationAllianceAndPlatoon(uint256 nationId) external view returns (uint256 allianceId, uint256 platoonId) {
        uint256 alliance = nationToAlliance[nationId];
        uint256 platoon = alliance > 0 ? alliances[alliance].nationToPlatoon[nationId] : 0;
        return (alliance, platoon);
    }

    function createAlliance(string memory name, uint256 founderNationId) external {
        require(nationToAlliance[founderNationId] == 0, "Nation already in an alliance");
        allianceCounter++;

        Alliance storage newAlliance = alliances[allianceCounter];
        newAlliance.id = allianceCounter;
        newAlliance.name = name;
        newAlliance.founderNationId = founderNationId;
        newAlliance.admins[founderNationId] = true;
        newAlliance.members.push(founderNationId);
        nationToAlliance[founderNationId] = allianceCounter;
        allianceExists[allianceCounter] = true;

        emit AllianceCreated(allianceCounter, name, founderNationId);
    }

    function addAdmin(uint256 allianceId, uint256 adminNationId, uint256 callerNationId)
        external
        onlyAllianceFounderOrAdmin(allianceId, callerNationId)
    {
        alliances[allianceId].admins[adminNationId] = true;
        emit AllianceAdminAdded(allianceId, adminNationId);
    }

    function removeAdmin(uint256 allianceId, uint256 adminNationId, uint256 callerNationId)
        external
        onlyAllianceFounderOrAdmin(allianceId, callerNationId)
    {
        require(adminNationId != alliances[allianceId].founderNationId, "Cannot remove founder");
        alliances[allianceId].admins[adminNationId] = false;
        emit AllianceAdminRemoved(allianceId, adminNationId);
    }

    function requestToJoinAlliance(uint256 allianceId, uint256 nationId) external {
        require(nationToAlliance[nationId] == 0, "Nation already in an alliance");
        alliances[allianceId].joinRequests.push(nationId);
        emit NationRequestedToJoin(allianceId, nationId);
    }

    function approveNationJoin(uint256 allianceId, uint256 nationId, uint256 callerNationId)
        external
        onlyAllianceFounderOrAdmin(allianceId, callerNationId)
    {
        require(nationToAlliance[nationId] == 0, "Nation already in an alliance");

        uint256[] storage requests = alliances[allianceId].joinRequests;
        bool found = false;

        for (uint256 i = 0; i < requests.length; i++) {
            if (requests[i] == nationId) {
                found = true;
                requests[i] = requests[requests.length - 1];
                requests.pop();
                break;
            }
        }

        require(found, "Nation did not request to join");

        alliances[allianceId].members.push(nationId);
        nationToAlliance[nationId] = allianceId;

        emit NationApprovedToJoin(allianceId, nationId);
    }

    function removeNationFromAlliance(uint256 allianceId, uint256 nationId, uint256 callerNationId)
        external
        onlyAllianceFounderOrAdmin(allianceId, callerNationId)
    {
        require(nationToAlliance[nationId] == allianceId, "Nation not in this alliance");

        delete nationToAlliance[nationId];

        uint256[] storage members = alliances[allianceId].members;
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == nationId) {
                members[i] = members[members.length - 1];
                members.pop();
                break;
            }
        }

        emit NationRemovedFromAlliance(allianceId, nationId);
    }

    function assignNationToPlatoon(uint256 allianceId, uint256 nationId, uint256 platoonId, uint256 callerNationId)
        external
        onlyAllianceFounderOrAdmin(allianceId, callerNationId)
    {
        require(nationToAlliance[nationId] == allianceId, "Nation not in this alliance");
        alliances[allianceId].nationToPlatoon[nationId] = platoonId;
        emit NationAssignedToPlatoon(allianceId, nationId, platoonId);
    }

    function getAllianceMembers(uint256 allianceId) external view returns (uint256[] memory) {
        return alliances[allianceId].members;
    }

    function getJoinRequests(uint256 allianceId) external view returns (uint256[] memory) {
        return alliances[allianceId].joinRequests;
    }

    function getNationAlliance(uint256 nationId) external view returns (uint256) {
        return nationToAlliance[nationId];
    }
}
