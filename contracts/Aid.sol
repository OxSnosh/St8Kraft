//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Infrastructure.sol";
import "./Forces.sol";
import "./Treasury.sol";
import "./Wonders.sol";
import "./CountryMinter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title AidContract this contract facilitates aid being sent between nations
/// @author OxSnosh
contract AidContract is Ownable {
    address public countryMinter;
    address public treasury;
    address public forces;
    address public keeper;
    address public infrastructure;
    address public wonder1;
    uint256 public aidProposalId;
    uint256 proposalExpiration = 7 days;

    /// @dev this function is callable by the owner only
    /// @dev this function will be called after deployment to initiate contract pointers within this contract
    function settings (
        address _countryMinter,
        address _treasury,
        address _forces,
        address _infrastructure,
        address _keeper,
        address _wonder1
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        treasury = _treasury;
        forces = _forces;
        infrastructure = _infrastructure;
        keeper = _keeper;
        wonder1 = _wonder1;
        won1 = WondersContract1(_wonder1);
    }

    CountryMinter mint;
    WondersContract1 won1;

    struct Proposal {
        uint256 proposalId;
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

    /// @dev this function is only callable from the owner
    function updateCountryMinterAddress(address _newAddress) public onlyOwner {
        countryMinter = _newAddress;
        mint = CountryMinter(_newAddress);
    }

    /// @dev this function is only callable from the owner
    function updateTreasuryAddress(address _newAddress) public onlyOwner {
        treasury = _newAddress;
    }

    /// @dev this function is only callable from the owner
    function updateForcesAddress(address _newAddress) public onlyOwner {
        forces = _newAddress;
    }

    /// @dev this function is only callable from the owner
    function updateInfrastructureAddress(address _newAddress) public onlyOwner {
        infrastructure = _newAddress;
    }

    /// @dev this function is only callable from the owner
    function updateKeeperAddress(address _newAddress) public onlyOwner {
        keeper = _newAddress;
    }

    /// @dev this function is only callable from the owner
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

    /// @dev this function gets called by the country minter contract once the country gets minted
    function initiateAid(uint256 id, address nationOwner)
        public
        onlyCountryMinter
    {
        idToOwnerAid[id] = nationOwner;
    }

    //check for sanctions

    /// @dev this is the function a nations owner will call to initiate an aid proposal
    /// @param idSender is the country ID of the aid sender (caller of the function)
    /// @param idRecipient is the country ID of the aid recipient
    /// @param techAid is the amount of Technology being sent in the proposal
    /// @param balanceAid is the amount of balance being sent in the proposal
    /// @param soldiersAid is the amount of troops beind sent in the proposal
    /// @notice the max aid is 100 Tech, 6,000,000 balance and 4,000 soldiers without a Federal Aid Commission
    /// @notice the max aid is 150 Tech, 9,000,000 balance and 6,000 soldiers with a Federal Aid Commission
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
        uint256 maxBalance = 6000000 * (10**18);
        uint256 maxSoldiers = 4000;
        bool federalAidEligable = getFederalAidEligability(
            idSender,
            idRecipient
        );
        if (federalAidEligable) {
            maxTech = 150;
            maxBalance = 9000000 * (10**18);
            maxSoldiers = 6000;
        }
        require(techAid <= maxTech, "max tech exceeded");
        require(balanceAid <= maxBalance, "max balance excedded");
        require(soldiersAid <= maxSoldiers, "max soldier aid is excedded");
        Proposal memory newProposal = Proposal(
            aidProposalId,
            block.timestamp,
            idSender,
            idRecipient,
            techAid,
            balanceAid,
            soldiersAid,
            false,
            false
        );
        idToAidSlots[idSender] += 1;
        idToProposal[aidProposalId] = newProposal;
        aidProposalId++;
    }

    ///@dev this function is public but called by the proposeAid() function to check the availabiliy of proposing aid
    ///@notice nations can only send one aid proposal per day without a Disaster Relief Agency
    ///@notice nations can send 2 aid porposals per day with a disaster relief agency
    ///@param idSender id the nation ID of the nation proposing aid
    ///@return bool returns a boolean value if there is an aid slot available for the prpoposal
    function checkAidSlots(uint256 idSender) public view returns (bool) {
        uint256 maxAidSlots = getMaxAidSlots(idSender);
        uint256 aidSlotsUsedToday = idToAidSlots[idSender];
        if ((aidSlotsUsedToday + 1) <= maxAidSlots) {
            return true;
        } else {
            return false;
        }
    }

    ///@dev this function is public but also callable by the proposeAid() and acceptProposal() function
    ///@notice this function checks that the aid proposed is less than the available aid of the sender nation
    ///@param idSender is the nation ID of the nations proposing aid
    ///@param techAid is the amount of Tech in the aid proposal
    ///@param balanceAid is the amount of Balance in the aid proposal
    ///@param soldiersAid is the amount of soldiers in the aid proposal
    ///@return bool true if the sender has enough of each aid parameter to send
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

    ///@dev this function is public but also callable from the proposeAid() function
    ///@notice this function checks max aid slots per day for a nation
    ///@notice max aid slots allow you to propose 1 aid per day (2 proposals with a didadter relief agency)
    ///@param id id the nation ID of the nation proposing aid
    ///@return uint256 defaults to 1 aid slot per day and 2 with a disaster relief agency
    function getMaxAidSlots(uint256 id) public view returns (uint256) {
        uint256 maxAidSlotsPerDay = 1;
        bool disasterReliefAgency = won1.getDisasterReliefAgency(id);
        if (disasterReliefAgency) {
            maxAidSlotsPerDay += 1;
        }
        return (maxAidSlotsPerDay);
    }

    ///@dev this function is a public view function that is called by the proposeAid() function
    ///@notice if both nations have a federal aid commission then max aid amounts increase 50%
    ///@param idSender is the nation ID of the sender of the aid proposal
    ///@param idRecipient id the nation ID of the recipient of the aid proposal
    ///@return bool true if both sender and reciever have a federal aid commission
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

    ///@dev this finction is only callable by the owner of the contract
    ///@dev this function allows the contract owner to set how long aid proposals stay active for
    function setProposalExpiration(uint256 newExpiration) public onlyOwner {
        proposalExpiration = newExpiration;
    }

    ///@dev this is a view function that allows anyone to view the duration aid proposals have untile they expire
    ///@return uint256 the number of days a proposal has to be exepted otherwise it expires
    function getProposalExpiration() public view returns (uint256) {
        return proposalExpiration;
    }

    ///@dev this function is a public view function that checks to see if an aid propoals is expired (too much time has elapsed since proposal)
    ///@notice this function will prevent an aid proposal from being fulfilled if the proposal is passed the expiration duration
    ///@param proposalId id the ID of the aid proposal
    ///@return bool true if amount of time elapsed since proposal is greater than the proposal expiration time
    function proposalExpired(uint256 proposalId) public view returns (bool) {
        uint256 timeProposed = idToProposal[proposalId].timeProposed;
        uint256 timeElapsed = (block.timestamp - timeProposed);
        bool expired = false;
        if (timeElapsed > proposalExpiration) {
            expired = true;
        }
        return expired;
    }

    //check for sanctions

    ///@dev this is a public function that is callable by the recipient of the aid proposal
    ///@notice this function is called by the recipient of an aid proposal in order to accept the aid
    ///@param proposalId this id the ID of the aid proposal
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
        bool available = checkAvailability(idSender, tech, balance, soldiers);
        require(available, "balances not available");
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

    ///@dev this function is a public function that allows the aid proposal to be cancelled by the sender of the proposal
    ///@notice this function allows the aid sender or recipient to cancel an aid proposal prior to it being accepted
    ///@param proposalId this is the id of the proposal
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
        bool accepted = idToProposal[proposalId].accepted;
        require(accepted == false, "trade already accepted");
        bool expired = proposalExpired(proposalId);
        require(expired == false, "trade already expired");
        idToProposal[proposalId].cancelled = true;
    }

    modifier onlyKeeper() {
        require(msg.sender == keeper, "only callable from keeper contract");
        _;
    }

    ///@dev this function is callable by the keeper contract only
    ///@dev this finction is called daily to reset every nations aid proposals for that day to 0
    function resetAidProposals() public onlyKeeper {
        uint256 countryCount = mint.getCountryCount();
        countryCount -= 1;
        for (uint256 i = 0; i <= countryCount; i++) {
            idToAidSlots[i] = 0;
        }
    }

    ///@dev this is public view function that allows a caller to return the items in a proposal struct
    ///@return uint256 this funtion returns the contects of a proposal struct
    function getProposal(uint256 proposalId) public view returns(
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256
    ) {
        return (
            idToProposal[proposalId].proposalId,
            idToProposal[proposalId].timeProposed,
            idToProposal[proposalId].idSender,
            idToProposal[proposalId].idRecipient,
            idToProposal[proposalId].techAid,
            idToProposal[proposalId].balanceAid,
            idToProposal[proposalId].soldierAid
        );
    }

    ///@dev this function is a public view function that allows the caller to see if an aid proposal is cancelled or accepted already
    ///@return bool true if the proposal has cancelled or accepted
    function checkCancelledOrAccepted(uint256 proposalId) public view returns(
        bool,
        bool
    ) {
        return (
            idToProposal[proposalId].accepted,
            idToProposal[proposalId].cancelled
        );
    }
}
