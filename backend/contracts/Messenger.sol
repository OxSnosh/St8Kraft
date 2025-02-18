// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

interface ICountryMinter {
    function checkOwnership(uint256 nationId, address caller) external view returns (bool);
}

/// @title Messenger
/// @author OxSnosh
/// @notice This contract allows a nation's ruler to send messages or post updates
contract Messenger {
    ICountryMinter public countryMinter;

    mapping(uint256 => string) public messages; // Messages are now mapped by nationId
    mapping(uint256 => string) public posts; // Posts are now mapped by nationId

    event MessageSent(uint256 indexed nationId, uint256 indexed receiver, string message);
    event PostSent(uint256 indexed nationId, string post);

    uint256 public constant MAX_MESSAGE_LENGTH = 1500;
    uint256 public constant MAX_POST_LENGTH = 500;

    /// @notice Initializes the contract with the address of the CountryMinter contract
    /// @param _countryMinter The address of the CountryMinter contract
    constructor(address _countryMinter) {
        countryMinter = ICountryMinter(_countryMinter);
    }

    /// @dev Allows the ruler of a nation to send a message to another user
    /// @param nationId The ID of the nation sending the message
    /// @param _receiver The address of the message recipient
    /// @param _message The message being sent
    function sendMessage(uint256 nationId, uint256 _receiver, string memory _message) public {
        require(countryMinter.checkOwnership(nationId, msg.sender), "Caller does not own this nation");
        require(bytes(_message).length <= MAX_MESSAGE_LENGTH, "Message exceeds 1500 characters");
        
        messages[nationId] = _message;
        emit MessageSent(nationId, _receiver, _message);
    }

    /// @dev Allows the ruler of a nation to post a public message
    /// @param nationId The ID of the nation posting the message
    /// @param _post The message being posted
    function postMessage(uint256 nationId, string memory _post) public {
        require(countryMinter.checkOwnership(nationId, msg.sender), "Caller does not own this nation");
        require(bytes(_post).length <= MAX_POST_LENGTH, "Post exceeds 500 characters");
        
        posts[nationId] = _post;
        emit PostSent(nationId, _post);
    }
}

