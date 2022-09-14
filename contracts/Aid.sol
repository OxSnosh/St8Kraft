//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Infrastructure.sol";
import "./Forces.sol";
import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AidContract is Ownable {
    address public countryMinter;
    address public treasury;
    address public forces;
    address public infrastructure;
    uint256 public aidProposalId;

    constructor(
        address _countryMinter,
        address _treasury,
        address _forces,
        address _infrastructure
    ) {
        countryMinter = _countryMinter;
        treasury = _treasury;
        forces = _forces;
        infrastructure = _infrastructure;
    }

    struct Proposal {
        uint256 timeProposed;
        uint256 idSender;
        uint256 idRecipient;
        uint256 techAid;
        uint256 balanceAid;
        uint256 soldierAid;
        bool accepted;
        bool cancelled;
    }

    mapping(uint256 => address) public idToOwnerAid;
    mapping(uint256 => Proposal) public idToProposal;

    function updateCountryMinterAddress(address _newAddress) public onlyOwner {
        countryMinter = _newAddress;
    }

    function updateTreasuryAddress(address _newAddress) public onlyOwner {
        treasury = _newAddress;
    }

    function updateForcesAddress(address _newAddress) public onlyOwner {
        forces = _newAddress;
    }

    function updateInfrastructureAddress(address _newAddress) public onlyOwner {
        infrastructure = _newAddress;
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "caller must be country minter contract"
        );
        _;
    }

    function initiateAid(uint256 id, address nationOwner)
        public
        onlyCountryMinter
    {
        idToOwnerAid[id] = nationOwner;
    }

    //check for sanctions
    function proposeAid(
        uint256 idSender,
        uint256 idRecipient,
        uint256 techAid,
        uint256 balanceAid,
        uint256 soldiersAid
    ) public {
        require(idToOwnerAid[idSender] == msg.sender, "!nation ruler");
        uint256 techAvailable = InfrastructureContract(infrastructure)
            .getTechnologyCount(idSender);
        uint256 balanceAvailable = TreasuryContract(treasury).checkBalance(
            idSender
        );
        uint256 soldiersAvailable = ForcesContract(forces)
            .getDefendingSoldierCount(idSender);
        require(techAvailable >= techAid, "not enough tech for this proposal");
        require(
            balanceAvailable >= balanceAid,
            "not enough funds for this porposal"
        );
        require(
            soldiersAvailable >= soldiersAid,
            "not enough soldiers for this porposal"
        );
        require(techAid <= 100, "max tech aid is 100");
        require(balanceAid <= 6000000, "max balance aid is 6,000,000");
        require(soldiersAid <= 4000, "max soldier aid is 4000");
        Proposal memory newProposal = Proposal(
            block.timestamp,
            idSender,
            idRecipient,
            techAid,
            balanceAid,
            soldiersAid,
            false,
            false
        );
        idToProposal[aidProposalId] = newProposal;
        aidProposalId++;
    }

    function proposalExpired(uint256 proposalId) public view returns (bool) {
        uint256 timeProposed = idToProposal[proposalId].timeProposed;
        uint256 timeElapsed = (block.timestamp - timeProposed);
        bool expired = false;
        if (timeElapsed > 7 days) {
            expired = true;
        }
        return expired;
    }

    //check for sanctions
    function acceptProposal(uint256 proposalId) public {
        bool expired = proposalExpired(proposalId);
        require(expired == false, "proposal expired");
        uint256 idSender = idToProposal[proposalId].idSender;
        uint256 idRecipient = idToProposal[proposalId].idRecipient;
        uint256 tech = idToProposal[proposalId].techAid;
        uint256 balance = idToProposal[proposalId].balanceAid;
        uint256 soldiers = idToProposal[proposalId].soldierAid;
        bool accepted = idToProposal[proposalId].accepted;
        require(accepted == false, "this offer has been accepted already");
        bool cancelled = idToProposal[proposalId].cancelled;
        require(cancelled == false, "this offer has been cancelled");
        address addressRecipient = idToOwnerAid[idRecipient];
        require(
            addressRecipient == msg.sender,
            "you are not the recipient of this proposal"
        );
        InfrastructureContract(infrastructure).sendTech(
            idSender,
            idRecipient,
            tech
        );
        TreasuryContract(treasury).sendAidBalance(
            idSender,
            idRecipient,
            balance
        );
        ForcesContract(forces).sendSoldiers(idSender, idRecipient, soldiers);
        idToProposal[proposalId].accepted = true;
    }

    function cancelAid(uint256 proposalId) public {
        uint256 idRecipient = idToProposal[proposalId].idRecipient;
        uint256 idSender = idToProposal[proposalId].idSender;
        address recipient = idToOwnerAid[idRecipient];
        address sender = idToOwnerAid[idSender];
        require(
            sender == msg.sender || recipient == msg.sender,
            "caller not a participant in this trade"
        );
        bool cancelled = idToProposal[proposalId].cancelled;
        require(cancelled == false, "trade already cancelled");
        bool accepted = idToProposal[proposalId].cancelled;
        require(accepted == false, "trade already accepted");
        bool expired = proposalExpired(proposalId);
        require(expired == false, "trade already expired");
        idToProposal[proposalId].cancelled = true;
    }
}