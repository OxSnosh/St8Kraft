//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Nuke.sol";
import "./Aid.sol";
import "./War.sol";
import "./Treasury.sol";
import "./Forces.sol";
import "./Navy.sol";
import "./CountryParameters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title KeeperContract
///@author OxSnosh
///@dev this contract will allow the chainlink keeper to maintain the game clock that resets everal parameters daily
contract KeeperContract is Ownable {
    address nukes;
    address aidContract;
    address warContract;
    address treasury;
    address missiles;
    address navalActions;
    address parameters;

    NukeContract nuke;
    AidContract aid;
    WarContract war;
    TreasuryContract tres;
    MissilesContract miss;
    NavalActionsContract navAct;
    CountryParametersContract params;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings (
        address _nukes,
        address _aid,
        address _war,
        address _treasury,
        address _missiles,
        address _navalActions,
        address _parameters
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
    }

    ///@dev this functon will be called by the chainlink keeper
    function keeperFunctionToCall() public {
        shiftNukeDays();
        resetAidProposals();
        decremenWarDays();
        resetCruiseMissileLaunches();
        incrementDaysSince();
        resetNukesPurchasedToday();
        resetActionsToday();
        incrementDaysSinceForParameters();
        resetDeployments();
    }

    ///@dev this function can be called by the contract owner in the event the keeper fails
    function keeperFunctionToCallManually() public onlyOwner {
        shiftNukeDays();
        resetAidProposals();
        decremenWarDays();
        resetCruiseMissileLaunches();
        incrementDaysSince();
        resetNukesPurchasedToday();
        resetActionsToday();
        incrementDaysSinceForParameters();
        resetDeployments();
    }

    function shiftNukeDays() internal {
        nuke.shiftNukesDroppedDays();
    }

    function resetAidProposals() internal {
        aid.resetAidProposals();
    }

    function resetAidProposalsByOwner() public onlyOwner {
        aid.resetAidProposals();
    }

    function decremenWarDays() internal {
        war.decrementWarDaysLeft();
    }

    function resetCruiseMissileLaunches() internal {
        war.resetCruiseMissileLaunches();
    }

    function incrementDaysSince() internal {
        tres.incrementDaysSince();
    }

    function resetNukesPurchasedToday() internal {
        miss.resetNukesPurchasedToday();
    }

    function resetNukesPurchasedTodayByOwner() public onlyOwner {
        miss.resetNukesPurchasedToday();
    }

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

    function resetDeployments() public {
        war.resetDeployedToday();
    }

    function resetDeploymentsByOwner() public onlyOwner {
        war.resetDeployedToday();
    }
}
