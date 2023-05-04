// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "hardhat/console.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract AirBattleTesting is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 private constant ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY; // 1 * 10**18
    uint[] public lastRetrievedAttackerFighterCasualties;
    uint[] public lastRetrievedAttackerBomberCasualties;
    uint[] public lastRetrievedDefenderFighterCasualties;
    uint public lastRetrievedBomberDamage;
    uint public lastRetrievedInfrastructureDamage;
    uint public lastRetrievedTankDamage;


    event RequestForInfoFulfilled(
        bytes32 indexed requestId,
        uint256[] _attackerFighterCasualties,
        uint256[] _attackerBomberCasualties,
        uint256[] _defenderFighterCasualties,
        uint _bomberDamage,
        uint _infrastructureDamage,
        uint _tankDamage
    );

    // address _oracle = 0xcdE23663165654b4CBb0CEaf51D200a8695598E8;

    /**
     *  Goerli
     *@dev LINK address in Goerli network: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * @dev Check https://docs.chain.link/docs/link-token-contracts/ for LINK address for the right network
     */
    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512);

    }

    function requestInfo(
        address _oracle,
        string memory _jobId
    ) public onlyOwner {
        uint8[9] memory defenderFightersArray = [5, 6, 7, 2, 2, 0, 0, 0, 0];
        uint8[9] memory attackerFightersArray = [0, 0, 0, 1, 3, 3, 4, 2, 2];
        uint8[9] memory attackerBombersArray = [0, 0, 0, 0, 0, 0, 0, 5, 5];
        uint208[5] memory randomNumbersArray = [
            1239409348093481239871230197429836192848723198326198471982371,
            8971673963491872653498715697162349871654379821349123041059786,
            3213498798798546352132165496847980650659819805649849846513200,
            4123640894763262603231098759852041236070674042989691956074095,
            2504104134176791881701260213164026342175826054201460214749196
        ];
        // bytes32 defenderFighters = abi.encodePacked(defenderFightersArray);
        // bytes32 attackerFighters = abi.encodePacked(attackerFightersArray);
        // bytes32 attackerBombers = abi.encodePacked(attackerBombersArray);
        // bytes32 randomNumbers = abi.encodePacked(randomNumbersArray);
        Chainlink.Request memory req = buildOperatorRequest(
            stringToBytes32(_jobId),
            this.fulfillRequestInfo.selector
        );
        req.addBytes("defenderFighters", abi.encodePacked(defenderFightersArray));
        req.addBytes("attackerFighters", abi.encodePacked(attackerFightersArray));
        req.addBytes("attackerBombers", abi.encodePacked(attackerBombersArray));
        req.addBytes("randomNumbers", abi.encodePacked(randomNumbersArray));
        // console.log(defenderFightersArray);
        sendOperatorRequestTo(_oracle, req, ORACLE_PAYMENT);
    }

    function fulfillRequestInfo(
        bytes32 _requestId,
        bytes memory  _attackerFighterCasualties,
        bytes memory _attackerBomberCasualties,
        bytes memory _defenderFighterCasualties,
        uint _bomberDamage,
        uint _infrastructureDamage,
        uint _tankDamage
    ) public recordChainlinkFulfillment(_requestId) {
        lastRetrievedAttackerFighterCasualties = abi.decode(_attackerFighterCasualties, (uint[]));
        lastRetrievedAttackerBomberCasualties = abi.decode(_attackerBomberCasualties, (uint[]));
        lastRetrievedDefenderFighterCasualties = abi.decode(_defenderFighterCasualties, (uint[]));
        lastRetrievedBomberDamage = _bomberDamage;
        lastRetrievedInfrastructureDamage = _infrastructureDamage;
        lastRetrievedTankDamage = _tankDamage;
        emit RequestForInfoFulfilled(
            _requestId,
            lastRetrievedAttackerFighterCasualties,
            lastRetrievedAttackerBomberCasualties,
            lastRetrievedDefenderFighterCasualties,
            _bomberDamage,
            _infrastructureDamage,
            _tankDamage
        );
    }

    /*
    ========= UTILITY FUNCTIONS ==========
    */

    function contractBalances()
        public
        view
        returns (uint256 eth, uint256 link)
    {
        eth = address(this).balance;

        LinkTokenInterface linkContract = LinkTokenInterface(
            chainlinkTokenAddress()
        );
        link = linkContract.balanceOf(address(this));
    }

    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer Link"
        );
    }

    function withdrawBalance() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) public onlyOwner {
        cancelChainlinkRequest(
            _requestId,
            _payment,
            _callbackFunctionId,
            _expiration
        );
    }

    function stringToBytes32(
        string memory source
    ) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }
}