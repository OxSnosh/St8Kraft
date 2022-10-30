//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Infrastructure.sol";
import "./Forces.sol";
import "./Treasury.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AidContract is Ownable {
    address public countryMinter;
    address public treasury;
    address public forces;
    address public keeper;
    address public infrastructure;
    address public wonder1;
    uint256 public aidProposalId;

    // constructor(

    // ) {

    // }

    CountryMinter mint;
    WondersContract1 won1;

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
    mapping(uint256 => uint256) public idToAidSlots;
    mapping(uint256 => Proposal) public idToProposal;

    function updateCountryMinterAddress(address _newAddress) public onlyOwner {
        countryMinter = _newAddress;
        mint = CountryMinter(_newAddress);
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

    function updateKeeperAddress(address _newAddress) public onlyOwner {
        keeper = _newAddress;
    }

    function updateWonderContract1Address(address _newAddress) public onlyOwner {
        wonder1 = _newAddress;
        won1 = WondersContract1(_newAddress);
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
        bool isOwner = mint.checkOwnership(idSender, msg.sender);
        require(isOwner, "!nation ruler");
        bool availableAidSlot = checkAidSlots(idSender);
        require(availableAidSlot, "aid slot not available");
        bool aidAvailable = checkAvailability(idSender, techAid, balanceAid, soldiersAid);
        require (aidAvailable, "aid not available");
        uint256 maxTech = 100;
        uint256 maxBalance = 6000000;
        uint256 maxSoldiers = 4000;
        bool federalAidEligable = getFederalAidEligability(
            idSender,
            idRecipient
        );
        if (federalAidEligable) {
            maxTech = 150;
            maxBalance = 9000000;
            maxSoldiers = 6000;
        }
        require(techAid <= maxTech, "max tech exceeded");
        require(balanceAid <= maxBalance, "max balance excedded");
        require(soldiersAid <= maxSoldiers, "max soldier aid is excedded");
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

    function checkAidSlots(uint256 idSender) public view returns (bool) {
        uint256 maxAidSlots = getMaxAidSlots(idSender);
        uint256 aidSlotsUsedToday = idToAidSlots[idSender];
        if ((aidSlotsUsedToday + 1) <= maxAidSlots) {
            return true;
        } else {
            return false;
        }
    }

    function checkAvailability(
        uint256 idSender,
        uint256 techAid,
        uint256 balanceAid,
        uint256 soldiersAid
    ) public view returns (bool) {
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
        return true;
    }

    function getMaxAidSlots(uint256 id) public view returns (uint256) {
        uint256 maxAidSlotsPerDay = 1;
        bool disasterReliefAgency = won1.getDisasterReliefAgency(id);
        if (disasterReliefAgency) {
            maxAidSlotsPerDay += 1;
        }
        return (maxAidSlotsPerDay);
    }

    function getFederalAidEligability(uint256 idSender, uint256 idRecipient)
        public
        view
        returns (bool)
    {
        bool senderEligable = won1.getFederalAidComission(idSender);
        bool recipientEligable = won1.getFederalAidComission(idRecipient);
        if (senderEligable && recipientEligable) {
            return true;
        } else {
            return false;
        }
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

    modifier onlyKeeper() {
        require(msg.sender == keeper, "only callable from keeper contract");
        _;
    }

    function resetAidProposals() public onlyKeeper {
        uint256 countryCount = mint.getCountryCount();
        countryCount -= 1;
        for (uint256 i = 0; i < countryCount; i++) {
            idToAidSlots[i] = 0;
        }
    }
}
