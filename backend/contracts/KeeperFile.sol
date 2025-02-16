//SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

// import "./Nuke.sol";
// import "./Aid.sol";
// import "./War.sol";
// import "./Treasury.sol";
// import "./Forces.sol";
// import "./Navy.sol";
// import "./CountryParameters.sol";
// import "./Military.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

///@title KeeperContract
///@author OxSnosh
///@dev this contract will allow the chainlink keeper to maintain the game clock that increments daily
contract KeeperContract is Ownable, KeeperCompatibleInterface {
    uint256 public gameDay;
    uint public interval;
    uint public lastTimeStamp;
    address public keeperRegistry;

    event GameDayIncremented(uint256 indexed gameDay);

    constructor(uint updateInterval) {
        interval = updateInterval;
        lastTimeStamp = block.timestamp;
        gameDay = 0;
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        return (upkeepNeeded, "");
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = lastTimeStamp + interval;
            gameDay++;
            emit GameDayIncremented(gameDay);
        } else {
            revert("Not enough time has passed for upkeep");
        }
    }

    function incrementGameDay() public onlyOwner {
        gameDay++;
        lastTimeStamp = block.timestamp;
        emit GameDayIncremented(gameDay);
    }

    function updateKeeperRegistry(address _keeperRegistry) public onlyOwner {
        keeperRegistry = _keeperRegistry;
    }

    function ipdateInterval(uint _interval) public onlyOwner {
        interval = _interval;
    }

    function getGameDay() public view returns (uint256) {
        return gameDay;
    }
}
