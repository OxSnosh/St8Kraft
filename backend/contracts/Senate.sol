//SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "./CountryParameters.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "./KeeperFile.sol";
import "./Resources.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

///@title SenateContract
///@author OxSnosh
///@notice this contract will allow nation owners to vote for team senators
///@notice team senators will be able to sanction nations from trading with trading partners on the same team
///@dev this contract inherits from the openzeppelin ownable contract
contract SenateContract is ChainlinkClient, KeeperCompatibleInterface, Ownable {
    using Chainlink for Chainlink.Request;

    uint256 public epoch;
    uint256 public interval;
    uint256 public dayOfLastElection;
    uint256 maximumSanctions = 25;
    address public countryMinter;
    address public parameters;
    address public wonders3;
    address public keeper;
    address public resources;
    

    WondersContract3 won3;
    CountryMinter mint;
    KeeperContract keep;
    CountryParametersContract params;
    ResourcesContract res;

    struct Voter {
        uint256 lastVoteCast;
        bool senator;
        uint256 team;
        uint256 dayTeamJoined;
        mapping(uint256 => bool) sanctionsByTeam;
        mapping(uint256 => uint256) dayOfSanctionByTeam;
    }

    event Vote(
        uint256 indexed voterId,
        uint256 indexed team,
        uint256 indexed voteCastFor,
        address voter
    );

    event Sanction (
        uint256 indexed senatorId,
        uint256 indexed team,
        uint256 indexed sanctionedId
    );

    event SanctionLifted(
        uint256 indexed senatorId,
        uint256 indexed team,
        uint256 indexed sanctionedId
    );

    mapping(uint256 => Voter) public idToVoter;
    mapping(uint256 => uint256[]) public teamToCurrentSanctions;
    mapping(uint256 => mapping(uint256 => uint256[])) epochToTeamToSenatorVotes;
    mapping(uint256 => mapping(uint256 => uint256[])) epochToTeamToWinners;

    ///@param _interval is in days
    constructor(uint _interval) {
        interval = _interval;
    }

    ///@param _interval is in days
    function updateInterval(uint _interval) public onlyOwner {
        interval = _interval;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _countryMinter,
        address _parameters,
        address _wonders3,
        address _keeper,
        address _resources
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        parameters = _parameters;
        wonders3 = _wonders3;
        won3 = WondersContract3(_wonders3);
        keeper = _keeper;
        keep = KeeperContract(_keeper);
        resources = _resources;
        res = ResourcesContract(_resources);
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "function only callable from countryminter"
        );
        _;
    }

    modifier onlyCountryParameters() {
        require(
            msg.sender == parameters,
            "function only callable from country paraeters contract"
        );
        _;
    }

    function updateCountryMinter(address newAddress) public onlyOwner {
        countryMinter = newAddress;
    }

    ///@dev this function is only callable by the contract owner
    function updateCountryParametersContract(
        address newAddress
    ) public onlyOwner {
        parameters = newAddress;
        params = CountryParametersContract(newAddress);
    }

    ///@dev this function is only callable by the country minter contract when a nation is minted
    ///@notice this contract will allow set up a nations voting and senate capabilities upon minting
    ///@param id is the nation id of the nation being minted
    function generateVoter(uint256 id) public onlyCountryMinter {
        uint256 day = keep.getGameDay();
        Voter storage newVoter = idToVoter[id];
        newVoter.lastVoteCast = 0;
        newVoter.senator = false;
        newVoter.team = 0;
        newVoter.dayTeamJoined = day;
    }

    ///@dev this function is only callable from the country parameters contract
    ///@notice this function will reset a nations team and votes for senator when a nation changes teams
    ///@param id is the nation id of the nation that changed team
    ///@param newTeam is the id of the new team the given nation joined
    function updateTeam(
        uint256 id,
        uint256 newTeam
    ) public onlyCountryParameters {
        uint256 day = keep.getGameDay();
        idToVoter[id].team = newTeam;
        idToVoter[id].dayTeamJoined = day;
    }

    ///@dev this is a public function callable only by the nation owner that will allow a nation to vote for a team senator
    ///@notice this function will allow a nation to vote for a team senator on their team
    ///@notice this function will emit a Vote event when a nation votes
    ///@notice you can only vote for a fellow team member
    ///@notice you can only vote once per epoch
    ///@param idVoter is the nation id of the nation casting the vote
    ///@param idOfSenateVote is the nation id of the nation being voted for senate
    function voteForSenator(uint256 idVoter, uint256 idOfSenateVote) public {
        bool isOwner = mint.checkOwnership(idVoter, msg.sender);
        require(isOwner, "!nation owner");
        require(idVoter != idOfSenateVote, "cannot vote for yourself");
        uint256 dayLastVoted = idToVoter[idVoter].lastVoteCast;
        require(
            dayLastVoted <= dayOfLastElection,
            "you already voted this epoch"
        );
        uint256 dayTeamJoined = idToVoter[idVoter].dayTeamJoined;
        uint256 gameDay = keep.getGameDay();
        if (gameDay >= 30) {
            require(
                (dayTeamJoined + 30) < gameDay,
                "you must be on a team for 30 days before voting for a senator"
            );
        }
        uint256 voterTeam = idToVoter[idVoter].team;
        uint256 teamOfVote = idToVoter[idOfSenateVote].team;
        require(
            teamOfVote == voterTeam,
            "you can only vote for a fellow team member"
        );
        epochToTeamToSenatorVotes[epoch][voterTeam].push(idOfSenateVote);
        bool lobbyists = won3.getPoliticalLobbyists(idVoter);
        if (lobbyists) {
            epochToTeamToSenatorVotes[epoch][voterTeam].push(idOfSenateVote);
        }
        idToVoter[idVoter].lastVoteCast = gameDay;
        emit Vote(idVoter, voterTeam, idOfSenateVote, msg.sender);
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        uint256 gameDay = keep.getGameDay();
        upkeepNeeded = (gameDay - dayOfLastElection) > interval;
        return (upkeepNeeded, "");
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        uint256 gameDay = keep.getGameDay();
        if ((gameDay - dayOfLastElection) > interval) {
            console.log("performing upkeep");
            for (uint256 i = 0; i <= 8; i++) {
                console.log("TEAM", i);
                runElections(i, epoch);
            }
            epoch++;
            dayOfLastElection = gameDay;
        }
    }

    bytes32 jobId;
    address oracleAddress;
    uint256 fee;
    uint256 orderId;

    function updateJobId(bytes32 _jobId) public onlyOwner {
        jobId = _jobId;
    }

    function updateOracleAddress(address _oracleAddress) public onlyOwner {
        oracleAddress = _oracleAddress;
        setChainlinkOracle(_oracleAddress);
    }

    function updateFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    function updateLinkAddress(address _linkAddress) public onlyOwner {
        setChainlinkToken(_linkAddress);
    }

    ///@dev this is a public function that will be called from an off chain source
    ///@notice this function is only callable from the keeper performUpkeep()
    ///@notice this function will make the nations who won the team 7 election senators
    ///@param team this is the team for which the election is being conducted
    ///@param _epoch this is the epoch for which the election is occuring
    function runElections(
        uint256 team,
        uint256 _epoch
    ) internal returns (bytes32 _requestId) {
        console.log("election called for", team);
        Chainlink.Request memory req = buildOperatorRequest(
            jobId,
            this.completeElection.selector
        );
        uint256[] memory teamVotes = epochToTeamToSenatorVotes[epoch][
            team
        ];
        req.addUint("orderId", orderId);
        req.addUint("teamNumber", team);
        req.addBytes("teamVotes", abi.encode(teamVotes));
        req.addUint("epoch", _epoch);
        orderId++;
        console.log("sending election for team", team);
        bytes32 requestId = sendOperatorRequest(req, fee);
        console.log("operator request sent for", team);
        return requestId;
    }

    ///@dev 
    function completeElection(
        bytes memory winners,
        uint256 team,
        uint256 _epoch
    ) public {
        uint256[] memory _winners = abi.decode(winners, (uint256[]));
        if(epoch > 0) {
            uint256[] memory currentSenators = epochToTeamToWinners[_epoch-1][team];
            for (uint i = 0; i < currentSenators.length; i++) {
                idToVoter[currentSenators[i]].senator = false;
            }
        }
        for (uint256 i = 0; i < _winners.length; i++) {
            idToVoter[_winners[i]].senator = true;
        }        
        epochToTeamToWinners[_epoch][team] = _winners;
    }

    ///@dev this is a public function that can only be called by the contract owner 
    ///@param _maximumSanctions is the maximum number of sanctions a team can have at one time
    function updaateMaximumSanctions(uint256 _maximumSanctions) public onlyOwner {
        maximumSanctions = _maximumSanctions;
    }

    ///@dev this is a public function callable by a senator
    ///@notice this function will only work if the senator and the nation being sanctioned are on the same team
    ///@param idSenator is the id of the senator calling the function that will cast the vote to sanction
    ///@param idSanctioned is the nation id of the nation who the senator is voting to sanction
    function sanctionTeamMember(
        uint256 idSenator,
        uint256 idSanctioned
    ) public {
        bool owner = mint.checkOwnership(idSenator, msg.sender);
        require(owner, "!nation owner");
        require(idToVoter[idSenator].senator == true, "!senator");
        require(
            idToVoter[idSanctioned].senator == false,
            "cannot sanction a senator"
        );
        uint256 senatorTeam = idToVoter[idSenator].team;
        uint256 sanctionedTeam = idToVoter[idSanctioned].team;
        require(
            senatorTeam == sanctionedTeam,
            "you can only sanction a fellow team member"
        );
        uint256[] memory currentTeamSanctions = teamToCurrentSanctions[
            sanctionedTeam
        ];
        require (
            currentTeamSanctions.length < maximumSanctions,
            "this team has reached the limit for sanctions"
        );
        uint256 gameDay = keep.getGameDay();
        Voter storage sanctioned = idToVoter[idSanctioned];
        require(
            sanctioned.sanctionsByTeam[sanctionedTeam] == false,
            "this nation is already sanctioned"
        );
        sanctioned.sanctionsByTeam[sanctionedTeam] = true;
        sanctioned.dayOfSanctionByTeam[sanctionedTeam] = gameDay;
        res.removeTradingPartnersFromSanction(idSanctioned, sanctionedTeam);
        emit Sanction(idSenator, senatorTeam, idSanctioned);
    }

    ///@dev this is a public function callable by a senator
    ///@notice this function will only work if the senator and the nation being sanctioned are on the same team
    ///@notice sanctions can only be lifted after 10 days
    ///@notice lifting a sanction only requires one vote from a senator
    ///@param idSenator is the id of the senator calling the function that will cast the vote to lift the sanction
    ///@param idSanctioned is the nation id of the nation who the senator is voting to lift the sanction on
    function liftSanctionVote(uint256 idSenator, uint256 idSanctioned) public {
        require(idToVoter[idSenator].senator == true, "!senator");
        uint256 senatorTeam = idToVoter[idSenator].team;
        uint256 sanctionedTeam = idToVoter[idSanctioned].team;
        require(
            senatorTeam == sanctionedTeam,
            "you can only lift a sanction on a fellow team member"
        );
        Voter storage sanctioned = idToVoter[idSanctioned];
        uint256 gameDay = keep.getGameDay();
        uint256 dayOfTeamSanction = sanctioned.dayOfSanctionByTeam[senatorTeam];
        require(
            (dayOfTeamSanction + 10) < gameDay,
            "you must wait 10 days before lifting a sanction"
        );
        require (
            sanctioned.sanctionsByTeam[sanctionedTeam] == true,
            "this nation is not sanctioned"
        );
        sanctioned.sanctionsByTeam[senatorTeam] = false;
        uint256[] storage currentTeamSanctions = teamToCurrentSanctions[
            sanctionedTeam
        ];
        for (uint256 i = 0; i < currentTeamSanctions.length; i++) {
            if (currentTeamSanctions[i] == idSanctioned) {
                currentTeamSanctions[i] = currentTeamSanctions[
                    currentTeamSanctions.length - 1
                ];
                currentTeamSanctions.pop();
            }
        }
        emit SanctionLifted(idSenator, senatorTeam, idSanctioned);
    }

    ///@dev this is a public view function that will return if a nation is a senator
    ///@notice this function will return if a nation is a senator
    ///@param id this is the nation id of the nation being queried
    ///@return bool will be true if a nation is a senator
    function isSenator(uint256 id) public view returns (bool) {
        return idToVoter[id].senator;
    }

    ///@notice this function will return the current election epoch
    function getCurrentEpoch() public view returns (uint256) {
        return epoch;
    }

    function isSanctioned(
        uint256 idSender,
        uint256 idReceiver
    ) public view returns (bool) {
        uint256 senderTeam = idToVoter[idSender].team;
        uint256 receiverTeam = idToVoter[idReceiver].team;
        bool senderSanctionedSenderTeam = idToVoter[idSender].sanctionsByTeam[senderTeam];
        bool recieverSanctionedRecieverTeam = idToVoter[idReceiver].sanctionsByTeam[receiverTeam];
        bool senderSanctionedRecieverTeam = idToVoter[idSender].sanctionsByTeam[receiverTeam];
        bool recieverSanctionedSenderTeam = idToVoter[idReceiver].sanctionsByTeam[senderTeam];
        bool sanctioned;
        if (senderTeam == receiverTeam) {
            if (senderSanctionedSenderTeam == true || recieverSanctionedRecieverTeam == true) {
                sanctioned = true;
            } else {
                sanctioned = false;
            }
        } else if (senderTeam != receiverTeam) {
            if (senderSanctionedRecieverTeam == true || recieverSanctionedSenderTeam == true) {
                sanctioned = true;
            } else {
                sanctioned = false;
            }
        }
        return sanctioned;
    }

    function electSenatorForTesting(uint256 id) public onlyOwner {
        idToVoter[id].senator = true;
    }
}
