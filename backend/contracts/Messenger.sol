// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

///@title Messenger
///@author OxSnosh
///@notice this contract will allow a user to send a message to another user or post updated
///@dev this contract inherits from openzeppelin's ownable contract

contract Messenger {

    mapping(address => string) public messages;

    event MessageSent(address indexed sender, address indexed receiver, string message);

    ///@dev this function will allow a user to send a message to another user
    ///@param _receiver is the address of the user receiving the message
    ///@param _message is the message being sent
    function sendMessage(address _receiver, string memory _message) public {
        messages[_receiver] = _message;
        emit MessageSent(msg.sender, _receiver, _message);
    }


    mapping(address => string) public posts;

    event PostSent(address indexed sender, string post);

    ///@dev this function will allow a user to post a message
    ///@param _post is the message being posted
    function postMessage(string memory _post) public {
        posts[msg.sender] = _post;
        emit PostSent(msg.sender, _post);
    }

}

