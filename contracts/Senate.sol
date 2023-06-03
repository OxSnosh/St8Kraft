//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "./CountryParameters.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "./KeeperFile.sol";
import "./Resources.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

///@title SenateContract
///@author OxSnosh
///@notice this contract will allow nation owners to vote for team senators
///@notice team senators will be able to sanction nations from trading with trading partners on the same team
///@dev this contract inherits from the openzeppelin ownable contract
contract SenateContract is ChainlinkClient, Ownable {
    using Chainlink for Chainlink.Request;

    uint256 public epoch;
    uint256 public dayOfLastElection;
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

    mapping(uint256 => Voter) public idToVoter;
    mapping(uint256 => uint256[]) public teamToCurrentSanctions;
    mapping(uint256 => mapping(uint256 => uint256[])) epochToTeamToSenatorVotes;
    mapping(uint256 => mapping(uint256 => uint256[])) epochToTeamToWinners;

    // mapping(uint256 => mapping(uint256 => uint256)) election;

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
            dayLastVoted < dayOfLastElection,
            "you already voted this epoch"
        );
        uint256 dayTeamJoined = idToVoter[idVoter].dayTeamJoined;
        uint256 gameDay = keep.getGameDay();
        require(
            (dayTeamJoined + 30) < gameDay,
            "you must be on a team for 30 days before voting for a senator"
        );
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

    ///@dev this is a public function that will be called from an off chain source
    ///@notice this function will make the nations who won the team 7 election senators
    ///@param _jobId is the job id for the chainlink oracle to run
    ///@param _oracleAddress is the address of the chainlink oracle
    ///@param _orderId is the order id of the chainlink oracle request
    ///@param _fee is the fee paid to the chainlink oracle
    function inaugurateTeam7Senators(
        bytes32 _jobId,
        address _oracleAddress,
        uint256 _orderId,
        uint256 _fee,
        uint256 teamNumber,
        uint256 _epoch
    ) public {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.completeElection.selector
        );
        uint256[] memory teamVotes = epochToTeamToSenatorVotes[_epoch][
            teamNumber
        ];
        req.addUint("orderId", _orderId);
        req.addUint("teamNumber", teamNumber);
        req.addBytes("teamVotes", abi.encodePacked(teamVotes));
        req.addUint("epoch", _epoch);
        sendChainlinkRequestTo(_oracleAddress, req, _fee);
    }

    function completeElection(
        // bytes32 _requestId,
        // uint256 _orderId,
        uint256[] memory winners,
        uint256 team,
        uint256 _epoch
    ) public {
        if(epoch > 0) {
            uint256[] memory currentSenators = epochToTeamToWinners[_epoch-1][team];
            for (uint i = 0; i < currentSenators.length; i++) {
                idToVoter[currentSenators[i]].senator = false;
            }
        }
        for (uint256 i = 0; i < winners.length; i++) {
            idToVoter[winners[i]].senator = true;
        }        
        epochToTeamToWinners[_epoch][team] = winners;
    }

    ///@dev this is a public function callable by a senator
    ///@notice this function will only work if the senator and the nation being sanctioned are on the same team
    ///@param idSenator is the id of the senator calling the function that will cast the vote to sanction
    ///@param idSanctioned is the nation id of the nation who the senator is voting to sanction
    function sanctionTeamMember(
        uint256 idSenator,
        uint256 idSanctioned
    ) public {
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
        uint256 gameDay = keep.getGameDay();
        Voter storage sanctioned = idToVoter[idSanctioned];
        sanctioned.sanctionsByTeam[sanctionedTeam] = true;
        sanctioned.dayOfSanctionByTeam[sanctionedTeam] = gameDay;
        res.removeTradingPartnersFromSanction(idSanctioned, sanctionedTeam);
        // uint256[] storage sanctionVoteArray = getSanctionVotes(idSanctioned);
        // for (uint256 i = 0; i < sanctionVoteArray.length; i++) {
        //     require(
        //         sanctionVoteArray[i] != idSenator,
        //         "you already voted to sanction this nation"
        //     );
        // }
        // sanctionVoteArray.push(idSenator);
        // setSanctionArray(sanctionVoteArray, idSanctioned);
        // if (idToVoter[idSanctioned].votesToSanction >= 3) {
        //     idToVoter[idSanctioned].sanctioned = true;
        // }
    }

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
        sanctioned.sanctionsByTeam[senatorTeam] = false;
    }

    // function getSanctionVotes(
    //     uint256 id
    // ) internal view returns (uint256[] storage) {
    //     uint256[] storage sanctionVoteArray = idToSanctionVotes[id];
    //     return sanctionVoteArray;
    // }

    // function setSanctionArray(
    //     uint256[] memory sanctionArray,
    //     uint256 idSanctioned
    // ) internal {
    //     idToSanctionVotes[idSanctioned] = sanctionArray;
    // }

    // function checkIfSenatorVoted(
    //     uint256 senatorId,
    //     uint256 idSanctioned
    // ) internal view returns (bool, uint256) {
    //     uint256[] memory sanctionVoteCheck = getSanctionVotes(idSanctioned);
    //     for (uint256 i = 0; i < sanctionVoteCheck.length; i++) {
    //         if (sanctionVotes[i] == senatorId) {
    //             return (true, i);
    //         }
    //     }
    //     return (false, 0);
    // }

    ///@dev this is a public view function that will return if a nation is a senator
    ///@notice this function will return if a nation is a senator
    ///@param id this is the nation id of the nation being queried
    ///@return bool will be true if a nation is a senator
    function isSenator(uint256 id) public view returns (bool) {
        return idToVoter[id].senator;
    }
}
