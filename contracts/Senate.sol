//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./CountryParameters.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SenateContract is Ownable {
    address public countryMinter;
    address public parameters;
    address public wonders3;
    uint256[] public team1SenatorArray;
    uint256[] public team2SenatorArray;
    uint256[] public team3SenatorArray;
    uint256[] public team4SenatorArray;
    uint256[] public team5SenatorArray;
    uint256[] public team6SenatorArray;
    uint256[] public team7SenatorArray;
    uint256[] public team8SenatorArray;
    uint256[] public team9SenatorArray;
    uint256[] public team10SenatorArray;
    uint256[] public team11SenatorArray;
    uint256[] public team12SenatorArray;
    uint256[] public team13SenatorArray;
    uint256[] public team14SenatorArray;
    uint256[] public team15SenatorArray;

    WondersContract3 won3;
    CountryMinter mint;

    struct Voter {
        uint256 votes;
        bool voted;
        bool senator;
        uint256 votesToSanction;
        bool sanctioned;
        uint256 team;
    }

    event Vote(
        uint256 indexed voterId,
        uint256 indexed team,
        uint256 indexed voteCastFor,
        address voter
    );

    uint256[] public sanctionVotes;

    function settings(
        address _countryMinter,
        address _parameters,
        address _wonders3
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        parameters = _parameters;
        wonders3 = _wonders3;
        won3 = WondersContract3(_wonders3);
    }

    CountryParametersContract params;

    mapping(uint256 => Voter) public idToVoter;
    mapping(uint256 => uint256[]) public idToSanctionVotes;
    mapping(uint256 => mapping(uint256 => uint256)) election;

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

    function updateCountryParametersContract(
        address newAddress
    ) public onlyOwner {
        parameters = newAddress;
        params = CountryParametersContract(newAddress);
    }

    function generateVoter(uint256 id) public onlyCountryMinter {
        Voter memory newVoter = Voter(0, false, false, 0, false, 0);
        idToVoter[id] = newVoter;
    }

    function updateTeam(
        uint256 id,
        uint256 newTeam
    ) public onlyCountryParameters {
        idToVoter[id].team = newTeam;
        idToVoter[id].votes = 0;
    }

    function voteForSenator(uint256 idVoter, uint256 idOfSenateVote) public {
        bool isOwner = mint.checkOwnership(idVoter, msg.sender);
        require(isOwner, "!nation owner");
        require(idVoter != idOfSenateVote, "cannot vote for yourself");
        require(idToVoter[idVoter].voted == false, "already voted");
        uint256 voterTeam = idToVoter[idVoter].team;
        uint256 teamOfVote = idToVoter[idOfSenateVote].team;
        require(
            teamOfVote == voterTeam,
            "you can only vote for a fellow team member"
        );
        idToVoter[idOfSenateVote].votes++;
        bool lobbyists = won3.getPoliticalLobbyists(idVoter);
        if (lobbyists) {
            idToVoter[idOfSenateVote].votes++;
        }
        idToVoter[idVoter].voted = true;
        emit Vote(idVoter, voterTeam, idOfSenateVote, msg.sender);
    }

    function inaugurateTeam7Senators(uint256[] memory newSenatorArray) public {
        for (uint256 i = 0; i < team7SenatorArray.length; i++) {
            uint256 countryId = team7SenatorArray[i];
            idToVoter[countryId].senator = false;
        }
        for (uint i = 0; i < newSenatorArray.length; i++) {
            uint256 newSenatorId = newSenatorArray[i];
            idToVoter[newSenatorId].senator = true;
        }
        team7SenatorArray = newSenatorArray;
    }

    function sanctionTeamMember(
        uint256 idSenator,
        uint256 idSanctioned
    ) public {
        require(idToVoter[idSenator].senator == true, "!senator");
        require(
            idToVoter[idSanctioned].senator == false,
            "cannot sanction a senator"
        );
        idToVoter[idSanctioned].votesToSanction++;
        uint256[] storage sanctionVoteArray = getSanctionVotes(idSanctioned);
        for (uint256 i = 0; i < sanctionVoteArray.length; i++) {
            require(
                sanctionVoteArray[i] != idSenator,
                "you already voted to sanction this nation"
            );
        }
        sanctionVoteArray.push(idSenator);
        setSanctionArray(sanctionVoteArray, idSanctioned);
        if (idToVoter[idSanctioned].votesToSanction >= 3) {
            idToVoter[idSanctioned].sanctioned = true;
        }
    }

    function liftSanctionVote(uint256 idSenator, uint256 idSanctioned) public {
        require(idToVoter[idSenator].senator == true, "!senator");
        (bool voted, uint256 indexOfSenatorVote) = checkIfSenatorVoted(
            idSenator,
            idSanctioned
        );
        require(
            voted == true,
            "senator does not have an active sanction vote for this nation"
        );
        uint256[] storage sanctionVoteArrayToDelete = getSanctionVotes(
            idSanctioned
        );
        delete sanctionVoteArrayToDelete[indexOfSenatorVote];
        if (idToVoter[idSanctioned].votesToSanction < 3) {
            idToVoter[idSanctioned].sanctioned = false;
        }
    }

    function getSanctionVotes(
        uint256 id
    ) internal view returns (uint256[] storage) {
        uint256[] storage sanctionVoteArray = idToSanctionVotes[id];
        return sanctionVoteArray;
    }

    function setSanctionArray(
        uint256[] memory sanctionArray,
        uint256 idSanctioned
    ) internal {
        idToSanctionVotes[idSanctioned] = sanctionArray;
    }

    function checkIfSenatorVoted(
        uint256 senatorId,
        uint256 idSanctioned
    ) internal view returns (bool, uint256) {
        uint256[] memory sanctionVoteCheck = getSanctionVotes(idSanctioned);
        for (uint256 i = 0; i < sanctionVoteCheck.length; i++) {
            if (sanctionVotes[i] == senatorId) {
                return (true, i);
            }
        }
        return (false, 0);
    }

    function isSenator(uint256 id) public view returns (bool) {
        return idToVoter[id].senator;
    }
}
