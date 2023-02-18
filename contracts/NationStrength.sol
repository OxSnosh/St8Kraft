//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "./Infrastructure.sol";
import "./Forces.sol";
import "./Fighters.sol";
import "./Bombers.sol";
import "./Navy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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

    InfrastructureContract inf;
    ForcesContract frc;
    FightersContract fight;
    BombersContract bomb;
    NavyContract nav;
    MissilesContract mis;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings (
        address _infrastructure,
        address _forces,
        address _fighters,
        address _bombers,
        address _navy,
        address _missiles
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
        uint256 cruiseMissileCount = mis.getCruiseMissileCount(id);
        uint256 cruiseMissileStrength = ((cruiseMissileCount * 10));
        uint256 nukeCount = mis.getNukeCount(id);
        uint256 nukeStrength = ((nukeCount**2) * 10);
        uint256 aircraftStrength = getStrengthFromAirForce(id);
        uint256 navyStrength = getStrengthFromNavy(id);
        uint256 strengthFromMilitary = (soldierStrength +
            tankStrength +
            cruiseMissileStrength +
            nukeStrength +
            aircraftStrength +
            navyStrength);
        return strengthFromMilitary;
    }

    function getStrengthFromAirForce(uint256 id)
        internal
        view
        returns (uint256)
    {
        uint256 defendingFighterStrength = getStrengthFromDefendingFighters(id);
        uint256 defendingBomberStrength = getStrengthFromDefendingBombers(id);
        uint256 deployedFighterStrength = getStrengthFromDeployedFighters(id);
        uint256 deployedBomberStrength = getStrengthFromDeployedBombers(id);
        uint256 strengthFromAirForce = (defendingFighterStrength +
            defendingBomberStrength +
            deployedFighterStrength +
            deployedBomberStrength);
        return strengthFromAirForce;
    }

    function getStrengthFromDefendingFighters(uint256 id)
        internal
        view
        returns (uint256)
    {
        uint256 yak9Count = fight.getDefendingYak9Count(id);
        uint256 p51MustangCount = fight.getDefendingP51MustangCount(id);
        uint256 f86SabreCount = fight.getDefendingF86SabreCount(id);
        uint256 mig15Count = fight.getDefendingMig15Count(id);
        uint256 f100SuperSabreCount = fight.getDefendingF100SuperSabreCount(id);
        uint256 additionalFighterStrength = getAdditionalStrengthFromDefendingFighters(
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

    function getAdditionalStrengthFromDefendingFighters(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 f35LightningCount = fight.getDefendingF35LightningCount(id);
        uint256 f15EagleCount = fight.getDefendingF15EagleCount(id);
        uint256 su30MkiCount = fight.getDefendingSu30MkiCount(id);
        uint256 f22RaptorCount = fight.getDefendingF22RaptorCount(id);
        uint256 additionalFighterStrength = ((f35LightningCount * 6) +
            (f15EagleCount * 7) +
            (su30MkiCount * 8) +
            (f22RaptorCount * 9));
        return additionalFighterStrength;
    }

    function getStrengthFromDefendingBombers(uint256 id)
        internal
        view
        returns (uint256)
    {
        uint256 ah1CobraCount = bomb.getDefendingAh1CobraCount(id);
        uint256 ah64ApacheCount = bomb.getDefendingAh64ApacheCount(id);
        uint256 bristolBlenheimCount = bomb.getDefendingBristolBlenheimCount(
            id
        );
        uint256 b52MitchellCount = bomb.getDefendingB52MitchellCount(id);
        uint256 b17gFlyingFortressCount = bomb
            .getDefendingB17gFlyingFortressCount(id);
        uint256 additionalStrengthFromBombers = getAdditionalStrengthFromDefendingBombers(
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

    function getAdditionalStrengthFromDefendingBombers(uint256 id)
        internal
        view
        returns (uint256)
    {
        uint256 b52StratofortressCount = bomb
            .getDefendingB52StratofortressCount(id);
        uint256 b2SpiritCount = bomb.getDefendingB2SpiritCount(id);
        uint256 b1bLancerCount = bomb.getDefendingB1bLancer(id);
        uint256 tupolevTu160Count = bomb.getDefendingTupolevTu160(id);
        uint256 additionalStrengthFromBombers = ((b52StratofortressCount * 6) +
            (b2SpiritCount * 7) +
            (b1bLancerCount * 8) +
            (tupolevTu160Count * 9));
        return additionalStrengthFromBombers;
    }

    function getStrengthFromDeployedFighters(uint256 id)
        internal
        view
        returns (uint256)
    {
        uint256 yak9Count = fight.getDeployedYak9Count(id);
        uint256 p51MustangCount = fight.getDeployedP51MustangCount(id);
        uint256 f86SabreCount = fight.getDeployedF86SabreCount(id);
        uint256 mig15Count = fight.getDeployedMig15Count(id);
        uint256 f100SuperSabreCount = fight.getDeployedF100SuperSabreCount(id);
        uint256 additionalFighterStrength = getAdditionalStrengthFromDeployedFighters(
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

    function getAdditionalStrengthFromDeployedFighters(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 f35LightningCount = fight.getDeployedF35LightningCount(id);
        uint256 f15EagleCount = fight.getDeployedF15EagleCount(id);
        uint256 su30MkiCount = fight.getDeployedSu30MkiCount(id);
        uint256 f22RaptorCount = fight.getDeployedF22RaptorCount(id);
        uint256 additionalFighterStrength = ((f35LightningCount * 6) +
            (f15EagleCount * 7) +
            (su30MkiCount * 8) +
            (f22RaptorCount * 9));
        return additionalFighterStrength;
    }

    function getStrengthFromDeployedBombers(uint256 id)
        internal
        view
        returns (uint256)
    {
        uint256 ah1CobraCount = bomb.getDeployedAh1CobraCount(id);
        uint256 ah64ApacheCount = bomb.getDeployedAh64ApacheCount(id);
        uint256 bristolBlenheimCount = bomb.getDeployedBristolBlenheimCount(
            id
        );
        uint256 b52MitchellCount = bomb.getDeployedB52MitchellCount(id);
        uint256 b17gFlyingFortressCount = bomb
            .getDeployedB17gFlyingFortressCount(id);
        uint256 additionalStrengthFromBombers = getAdditionalStrengthFromDeployedBombers(
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

    function getAdditionalStrengthFromDeployedBombers(uint256 id)
        internal
        view
        returns (uint256)
    {
        uint256 b52StratofortressCount = bomb
            .getDeployedB52StratofortressCount(id);
        uint256 b2SpiritCount = bomb.getDeployedB2SpiritCount(id);
        uint256 b1bLancerCount = bomb.getDeployedB1bLancer(id);
        uint256 tupolevTu160Count = bomb.getDeployedTupolevTu160(id);
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
        uint256 frigateCount = nav.getFrigateCount(id);
        uint256 destroyerCount = nav.getDestroyerCount(id);
        uint256 submarineCount = nav.getSubmarineCount(id);
        uint256 aircraftCarrierCount = nav.getAircraftCarrierCount(id);
        uint256 additionalNavyStrength = ((frigateCount * 8) +
            (destroyerCount * 11) +
            (submarineCount * 12) +
            (aircraftCarrierCount * 15));
        return additionalNavyStrength;
    }
}
