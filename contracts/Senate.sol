//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "./CountryParameters.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title SenateContract
///@author OxSnosh
///@notice this contract will allow nation owners to vote for team senators
///@notice team senators will be able to sanction nations from trading with trading partners on the same team
///@dev this contract inherits from the openzeppelin ownable contract
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

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
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
        Voter memory newVoter = Voter(0, false, false, 0, false, 0);
        idToVoter[id] = newVoter;
    }

    ///@dev this function is only callable from the country parameters contract
    ///@notice this function will reset a nations team and votes for senator when a nation changes teams
    ///@param id is the nation id of the nation that changed team
    ///@param newTeam is the id of the new team the given nation joined
    function updateTeam(
        uint256 id,
        uint256 newTeam
    ) public onlyCountryParameters {
        idToVoter[id].team = newTeam;
        idToVoter[id].votes = 0;
        //add functionality that will remove their vote if they voted
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

    ///@dev this is a public function that will be called from an off chain source
    ///@notice this function will make the nations who won the team 7 election senators
    ///@param newSenatorArray is the array of team 7 senators getting elected
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

    ///@dev this is a public view function that will return if a nation is a senator
    ///@notice this function will return if a nation is a senator
    ///@param id this is the nation id of the nation being queried
    ///@return bool will be true if a nation is a senator
    function isSenator(uint256 id) public view returns (bool) {
        return idToVoter[id].senator;
    }
}
