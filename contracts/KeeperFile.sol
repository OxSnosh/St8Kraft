//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "./Nuke.sol";
import "./Aid.sol";
import "./War.sol";
import "./Treasury.sol";
import "./Forces.sol";
import "./Navy.sol";
import "./CountryParameters.sol";
import "./Military.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title KeeperContract
///@author OxSnosh
///@dev this contract will allow the chainlink keeper to maintain the game clock that resets everal parameters daily
contract KeeperContract is Ownable {
    uint256 public gameDay;

    function incrementGameDay() public {
        gameDay++;
    }

    function getGameDay() public view returns (uint256) {
        return gameDay;
    }

    address nukes;
    address aidContract;
    address warContract;
    address treasury;
    address missiles;
    address navalActions;
    address parameters;
    address military;

    NukeContract nuke;
    AidContract aid;
    WarContract war;
    TreasuryContract tres;
    MissilesContract miss;
    NavalActionsContract navAct;
    CountryParametersContract params;
    MilitaryContract mil;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings (
        address _nukes,
        address _aid,
        address _war,
        address _treasury,
        address _missiles,
        address _navalActions,
        address _parameters,
        address _military
    ) public onlyOwner {
        nukes = _nukes;
        nuke = NukeContract(_nukes);
        aidContract = _aid;
        aid = AidContract(_aid);
        warContract = _war;
        war = WarContract(_war);
        treasury = _treasury;
        tres = TreasuryContract(_treasury);
        missiles = _missiles;
        miss = MissilesContract(_missiles);
        navalActions = _navalActions;
        navAct = NavalActionsContract(_navalActions);
        parameters = _parameters;
        params = CountryParametersContract(_parameters);
        military = _military;
        mil = MilitaryContract(_military);
    }

    ///@dev this functon will be called by the chainlink keeper
    function keeperFunctionToCall() public {
        // shiftNukeDays();
        // resetAidProposals();
        // expireOldWars();
        // resetCruiseMissileLaunches();
        incrementDaysSince();
        // resetNukesPurchasedToday();
        resetActionsToday();
        incrementDaysSinceForParameters();
        // resetDeployments();
        incrementDaysInPeaceMode();
    }

    ///@dev this function can be called by the contract owner in the event the keeper fails
    function keeperFunctionToCallManually() public onlyOwner {
        // shiftNukeDays();
        // resetAidProposals();
        // expireOldWars();
        // resetCruiseMissileLaunches();
        incrementDaysSince();
        // resetNukesPurchasedToday();
        resetActionsToday();
        incrementDaysSinceForParameters();
        // resetDeployments();
        incrementDaysInPeaceMode();
    }

    // function shiftNukeDays() internal {
    //     nuke.shiftNukesDroppedDays();
    // }

    // function resetAidProposals() internal {
    //     aid.resetAidProposals();
    // }

    // function resetAidProposalsByOwner() public onlyOwner {
    //     aid.resetAidProposals();
    // }

    // function expireOldWars() internal {
    //     war.expireOldWars();
    // }

    // function expireOldWarsByOwner() public onlyOwner {
    //     war.expireOldWars();
    // }

    // function resetCruiseMissileLaunches() internal {
    //     war.resetCruiseMissileLaunches();
    // }

    // function resetCruiseMissileLaunchesByOwner() public onlyOwner {
    //     war.resetCruiseMissileLaunches();
    // }

    function incrementDaysSince() internal {
        tres.incrementDaysSince();
    }

    // function resetNukesPurchasedToday() internal {
    //     miss.resetNukesPurchasedToday();
    // }

    // function resetNukesPurchasedTodayByOwner() public onlyOwner {
    //     miss.resetNukesPurchasedToday();
    // }

    function resetActionsToday() internal {
        navAct.resetActionsToday();
    }

    function resetActionsTodayByOwner() public onlyOwner {
        navAct.resetActionsToday();
    }

    function incrementDaysSinceForParameters() internal {
        params.incrementDaysSince();
    }

    function incrementDaysSinceForParametersByOwner() public onlyOwner {
        params.incrementDaysSince();
    }

    // function resetDeployments() internal {
    //     war.resetDeployedToday();
    // }

    // function resetDeploymentsByOwner() public onlyOwner {
    //     war.resetDeployedToday();
    // }

    function incrementDaysInPeaceMode() public {
        mil.incrementDaysInPeaceMode();
    }

    function incrementDaysInPeaceModeByOwner() public onlyOwner {
        mil.incrementDaysInPeaceMode();
    }
}
