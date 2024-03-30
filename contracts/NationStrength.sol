//SPDX-License-Identifier: Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International
pragma solidity 0.8.17;

import "./Infrastructure.sol";
import "./Forces.sol";
import "./Fighters.sol";
import "./Bombers.sol";
import "./Navy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

///@title NationStrengthContract
///@author OxSnosh
///@dev this contract inherits from openzeppelin's ownable contract
///@notice this contract will calculate a given nation's strength
contract NationStrengthContract is Ownable {
    address public infrastructure;
    address public forces;
    address public fighters;
    address public bombers;
    address public navy;
    address public missiles;
    address public navy2;

    InfrastructureContract inf;
    ForcesContract frc;
    FightersContract fight;
    BombersContract bomb;
    NavyContract nav;
    MissilesContract mis;
    NavyContract2 nav2;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings (
        address _infrastructure,
        address _forces,
        address _fighters,
        address _bombers,
        address _navy,
        address _missiles,
        address _navy2
    ) public onlyOwner {
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        forces = _forces;
        frc = ForcesContract(_forces);
        fighters = _fighters;
        fight = FightersContract(_fighters);
        bombers = _bombers;
        bomb = BombersContract(_bombers);
        navy = _navy;
        nav = NavyContract(_navy);
        missiles = _missiles;
        mis = MissilesContract(_missiles);
        navy2 = _navy2;
        nav2 = NavyContract2(_navy2);
    }

    
    ///@dev this function is only callable by the contract owner
    function updateInfrastructureContract(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateForcesContract(address newAddress) public onlyOwner {
        forces = newAddress;
        frc = ForcesContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateFightersContract(address newAddress) public onlyOwner {
        fighters = newAddress;
        fight = FightersContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateBombersContract(address newAddress) public onlyOwner {
        bombers = newAddress;
        bomb = BombersContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateNavyContract(address newAddress) public onlyOwner {
        navy = newAddress;
        nav = NavyContract(newAddress);
    }

    ///@dev this is a public view function that will return a nation's strength
    ///@notice this function will return a given nations strength
    ///@notice strength is calculated in the following way
    /**
     * land purchased * 1.5 +
     * infra * 3 +
     * tech * 5 +
     * soldiers * .02 +
     * tanks deployed * .15 +
     * tanks defending * .20 +
     * aircraft rankings * 5 +
     * navy rankings * 10
     * cruise missiles * 10 +
     * nukes ** 2 * 10 +
    */
    ///@param id is the nation id of the nation being queried
    ///@return uint256 is the nations strength
    function getNationStrength(uint256 id) public view returns (uint256) {
        uint256 nationStrengthFromCommodities = getNationStrengthFromCommodities(
                id
            );
        uint256 nationStrengthFromMilitary = getNationStrengthFromMilitary(id);
        uint256 nationStrength = nationStrengthFromCommodities +
            nationStrengthFromMilitary;
        return nationStrength;
    }

    function getNationStrengthFromCommodities(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 landCount = inf.getLandCount(id);
        uint256 techCount = inf.getTechnologyCount(id);
        uint256 infrastructureCount = inf.getInfrastructureCount(id);
        uint256 strengthFromCommodities = (((landCount * 150) +
            (techCount * 500) +
            (infrastructureCount * 300)) / 100);
        return strengthFromCommodities;
    }

    function getNationStrengthFromMilitary(uint256 id)
        internal
        view
        returns (uint256)
    {
        uint256 soldierCount = frc.getSoldierCount(id);
        uint256 soldierStrength = ((soldierCount * 2) / 100);
        uint256 deployedTankCount = frc.getDeployedTankCount(id);
        uint256 defendingTankCount = frc.getDefendingTankCount(id);
        uint256 tankStrength = (((deployedTankCount * 15) +
            (defendingTankCount * 20)) / 100);
        uint256 additionalStrength = getAdditionalStrengthFromMiliary(id);
        uint256 strengthFromMilitary = (soldierStrength +
            tankStrength +
            additionalStrength);
        return strengthFromMilitary;
    }

    function getAdditionalStrengthFromMiliary(uint256 id) public view returns (uint256) {
        uint256 cruiseMissileCount = mis.getCruiseMissileCount(id);
        uint256 cruiseMissileStrength = ((cruiseMissileCount * 10));
        uint256 nukeCount = mis.getNukeCount(id);
        uint256 nukeStrengthBase = (nukeCount**2);
        uint256 nukeStrength = (nukeStrengthBase * 10);
        uint256 aircraftStrength = getStrengthFromAirForce(id);
        uint256 navyStrength = getStrengthFromNavy(id);
        uint256 additionalStrengthFromMilitary = (cruiseMissileStrength +
            nukeStrength +
            aircraftStrength +
            navyStrength);
        return additionalStrengthFromMilitary;
    }

    function getStrengthFromAirForce(uint256 id)
        internal
        view
        returns (uint256)
    {
        uint256 defendingFighterStrength = getStrengthFromFighters(id);
        uint256 defendingBomberStrength = getStrengthFromBombers(id);
        uint256 strengthFromAirForce = (defendingFighterStrength +
            defendingBomberStrength);
        return strengthFromAirForce;
    }

    function getStrengthFromFighters(uint256 id)
        internal
        view
        returns (uint256)
    {
        uint256 yak9Count = fight.getYak9Count(id);
        uint256 p51MustangCount = fight.getP51MustangCount(id);
        uint256 f86SabreCount = fight.getF86SabreCount(id);
        uint256 mig15Count = fight.getMig15Count(id);
        uint256 f100SuperSabreCount = fight.getF100SuperSabreCount(id);
        uint256 additionalFighterStrength = getAdditionalStrengthFromFighters(
                id
            );
        uint256 strengthFromFighters = (((yak9Count * 1) +
            (p51MustangCount * 2) +
            (f86SabreCount * 3) +
            (mig15Count * 4) +
            (f100SuperSabreCount * 5) +
            additionalFighterStrength) * 5);
        return strengthFromFighters;
    }

    function getAdditionalStrengthFromFighters(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 f35LightningCount = fight.getF35LightningCount(id);
        uint256 f15EagleCount = fight.getF15EagleCount(id);
        uint256 su30MkiCount = fight.getSu30MkiCount(id);
        uint256 f22RaptorCount = fight.getF22RaptorCount(id);
        uint256 additionalFighterStrength = ((f35LightningCount * 6) +
            (f15EagleCount * 7) +
            (su30MkiCount * 8) +
            (f22RaptorCount * 9));
        return additionalFighterStrength;
    }

    function getStrengthFromBombers(uint256 id)
        internal
        view
        returns (uint256)
    {
        uint256 ah1CobraCount = bomb.getAh1CobraCount(id);
        uint256 ah64ApacheCount = bomb.getAh64ApacheCount(id);
        uint256 bristolBlenheimCount = bomb.getBristolBlenheimCount(
            id
        );
        uint256 b52MitchellCount = bomb.getB52MitchellCount(id);
        uint256 b17gFlyingFortressCount = bomb
            .getB17gFlyingFortressCount(id);
        uint256 additionalStrengthFromBombers = getAdditionalStrengthFromBombers(
                id
            );
        uint256 strengthFromBombers = (((ah1CobraCount * 1) +
            (ah64ApacheCount * 2) +
            (bristolBlenheimCount * 3) +
            (b52MitchellCount * 4) +
            (b17gFlyingFortressCount * 5) +
            additionalStrengthFromBombers) * 5);
        return strengthFromBombers;
    }

    function getAdditionalStrengthFromBombers(uint256 id)
        internal
        view
        returns (uint256)
    {
        uint256 b52StratofortressCount = bomb
            .getB52StratofortressCount(id);
        uint256 b2SpiritCount = bomb.getB2SpiritCount(id);
        uint256 b1bLancerCount = bomb.getB1bLancerCount(id);
        uint256 tupolevTu160Count = bomb.getTupolevTu160Count(id);
        uint256 additionalStrengthFromBombers = ((b52StratofortressCount * 6) +
            (b2SpiritCount * 7) +
            (b1bLancerCount * 8) +
            (tupolevTu160Count * 9));
        return additionalStrengthFromBombers;
    }

    function getStrengthFromNavy(uint256 id) internal view returns (uint256) {
        uint256 corvetteCount = nav.getCorvetteCount(id);
        uint256 landingShipCount = nav.getLandingShipCount(id);
        uint256 battleshipCount = nav.getBattleshipCount(id);
        uint256 cruiserCount = nav.getCruiserCount(id);
        uint256 additionalNavyStrength = getAdditionalNavyStrength(id);
        uint256 strengthFromNavy = (((corvetteCount * 1) +
            (landingShipCount * 3) +
            (battleshipCount * 5) +
            (cruiserCount * 6) +
            additionalNavyStrength) * 10);
        return strengthFromNavy;
    }

    function getAdditionalNavyStrength(uint256 id)
        internal
        view
        returns (uint256)
    {
        uint256 frigateCount = nav2.getFrigateCount(id);
        uint256 destroyerCount = nav2.getDestroyerCount(id);
        uint256 submarineCount = nav2.getSubmarineCount(id);
        uint256 aircraftCarrierCount = nav2.getAircraftCarrierCount(id);
        uint256 additionalNavyStrength = ((frigateCount * 8) +
            (destroyerCount * 11) +
            (submarineCount * 12) +
            (aircraftCarrierCount * 15));
        return additionalNavyStrength;
    }
}
