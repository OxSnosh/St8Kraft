//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "./Infrastructure.sol";
import "./CountryMinter.sol";
import "./Bombers.sol";
import "./Resources.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FightersContract is Ownable {
    address public countryMinter;
    address public fightersMarket;
    address public bombers;
    address public treasuryAddress;
    address public infrastructure;
    address public war;
    address public airBattle;

    CountryMinter mint;

    struct DefendingFighters {
        uint256 defendingAircraft;
        uint256 yak9Count;
        uint256 p51MustangCount;
        uint256 f86SabreCount;
        uint256 mig15Count;
        uint256 f100SuperSabreCount;
        uint256 f35LightningCount;
        uint256 f15EagleCount;
        uint256 su30MkiCount;
        uint256 f22RaptorCount;
    }

    struct DeployedFighters {
        uint256 deployedAircraft;
        uint256 yak9Count;
        uint256 p51MustangCount;
        uint256 f86SabreCount;
        uint256 mig15Count;
        uint256 f100SuperSabreCount;
        uint256 f35LightningCount;
        uint256 f15EagleCount;
        uint256 su30MkiCount;
        uint256 f22RaptorCount;
    }

    mapping(uint256 => DefendingFighters) public idToDefendingFighters;
    mapping(uint256 => DeployedFighters) public idToDeployedFighters;
    mapping(uint256 => address) public idToOwnerFighters;

    constructor(
        address _countryMinter,
        address _bombers,
        address _fightersMarket,
        address _treasuryAddress,
        address _war,
        address _infrastructure,
        address _airBattle
    ) {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        bombers = _bombers;
        fightersMarket = _fightersMarket;
        treasuryAddress = _treasuryAddress;
        war = _war;
        infrastructure = _infrastructure;
        airBattle = _airBattle;
    }

    modifier onlyCountryMinter() {
        require(msg.sender == countryMinter, "only countryMinter can call");
        _;
    }

    modifier onlyWar() {
        require(
            msg.sender == war,
            "this function can only be called by battle"
        );
        _;
    }

    modifier onlyMarket() {
        require(
            msg.sender == fightersMarket,
            "this function can only be called by market"
        );
        _;
    }

    modifier onlyAirBattle() {
        require(
            msg.sender == airBattle,
            "this function can only be called by air battle"
        );
        _;
    }

    function updateCountryMinterAddress(address _newAddress) public onlyOwner {
        countryMinter = _newAddress;
    }

    function updateFightersMarketAddress(address _newAddress) public onlyOwner {
        fightersMarket = _newAddress;
    }

    function updateTreasuryAddress(address _newAddress) public onlyOwner {
        treasuryAddress = _newAddress;
    }

    function updateWarAddress(address _newAddress) public onlyOwner {
        war = _newAddress;
    }

    function updateInfrastructureAddress(address _newAddress) public onlyOwner {
        infrastructure = _newAddress;
    }

    function updateBombersAddress(address _newAddress) public onlyOwner {
        bombers = _newAddress;
    }

    function generateFighters(uint256 id, address nationOwner) public {
        DefendingFighters memory newDefendingFighters = DefendingFighters(
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
        idToDefendingFighters[id] = newDefendingFighters;
        DeployedFighters memory newDeployedFighters = DeployedFighters(
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
        idToDeployedFighters[id] = newDeployedFighters;
        idToOwnerFighters[id] = nationOwner;
    }

    function getAircraftCount(uint256 id) public view returns (uint256) {
        uint256 defendingCount = idToDefendingFighters[id].defendingAircraft;
        uint256 deployedCount = idToDeployedFighters[id].deployedAircraft;
        uint256 count = (defendingCount + deployedCount);
        return count;
    }

    function getDefendingCount(uint256 id) public view returns (uint256) {
        uint256 defendingCount = idToDefendingFighters[id].defendingAircraft;
        return defendingCount;
    }

    function getDeployedCount(uint256 id) public view returns (uint256) {
        uint256 deployedCount = idToDeployedFighters[id].deployedAircraft;
        return deployedCount;
    }

    function getMaxAircraftCount(uint256 id) public pure returns (uint256) {
        return 450;
    }

    modifier onlyBomberContract() {
        require(msg.sender == bombers);
        _;
    }

    function increaseAircraftCount(uint256 amount, uint256 id)
        public
        onlyBomberContract
    {
        idToDefendingFighters[id].defendingAircraft += amount;
    }

    function decreaseDefendingAircraftCount(uint256 amount, uint256 id)
        public
        onlyBomberContract
    {
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function decreaseDeployedAircraftCount(uint256 amount, uint256 id)
        public
        onlyBomberContract
    {
        idToDeployedFighters[id].deployedAircraft -= amount;
    }

    function destroyDefendingAircraft(uint256 amount, uint256 id)
        internal
        onlyWar
    {
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function destroyDeployedAircraft(uint256 amount, uint256 id)
        internal
        onlyWar
    {
        idToDeployedFighters[id].deployedAircraft -= amount;
    }

    function getDefendingYak9Count(uint256 id) public view returns (uint256) {
        uint256 count = idToDefendingFighters[id].yak9Count;
        return count;
    }

    function getDeployedYak9Count(uint256 id) public view returns (uint256) {
        uint256 count = idToDeployedFighters[id].yak9Count;
        return count;
    }

    function increaseYak9Count(uint256 id, uint256 amount) public onlyMarket {
        idToDefendingFighters[id].yak9Count += amount;
        idToDefendingFighters[id].defendingAircraft += amount;
    }

    function decreaseDefendingYak9Count(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingFighters[id].yak9Count;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDefendingFighters[id].yak9Count -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function decreaseDeployedYak9Count(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDeployedFighters[id].yak9Count;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDeployedFighters[id].yak9Count -= amount;
        idToDeployedFighters[id].deployedAircraft -= amount;
    }

    function scrapYak9(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingFighters[id].yak9Count;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingFighters[id].yak9Count -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function getDefendingP51MustangCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDefendingFighters[id].p51MustangCount;
        return count;
    }

    function getDeployedP51MustangCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDeployedFighters[id].p51MustangCount;
        return count;
    }

    function increaseP51MustangCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingFighters[id].p51MustangCount += amount;
        idToDefendingFighters[id].defendingAircraft += amount;
    }

    function decreaseDefendingP51MustangCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingFighters[id].p51MustangCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDefendingFighters[id].p51MustangCount -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function decreaseDeployedP51MustangCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDeployedFighters[id].p51MustangCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDeployedFighters[id].p51MustangCount -= amount;
        idToDeployedFighters[id].deployedAircraft -= amount;
    }

    function scrapP51Mustang(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingFighters[id].p51MustangCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingFighters[id].p51MustangCount -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function getDefendingF86SabreCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDefendingFighters[id].f86SabreCount;
        return count;
    }

    function getDeployedF86SabreCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDeployedFighters[id].f86SabreCount;
        return count;
    }

    function increaseF86SabreCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingFighters[id].f86SabreCount += amount;
        idToDefendingFighters[id].defendingAircraft += amount;
    }

    function decreaseDefendingF86SabreCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingFighters[id].f86SabreCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDefendingFighters[id].f86SabreCount -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function decreaseDeployedF86SabreCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDeployedFighters[id].f86SabreCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDeployedFighters[id].f86SabreCount -= amount;
        idToDeployedFighters[id].deployedAircraft -= amount;
    }

    function scrapF86Sabre(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingFighters[id].f86SabreCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingFighters[id].f86SabreCount -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function getDefendingMig15Count(uint256 id) public view returns (uint256) {
        uint256 count = idToDefendingFighters[id].mig15Count;
        return count;
    }

    function getDeployedMig15Count(uint256 id) public view returns (uint256) {
        uint256 count = idToDeployedFighters[id].mig15Count;
        return count;
    }

    function increaseMig15Count(uint256 id, uint256 amount) public onlyMarket {
        idToDefendingFighters[id].mig15Count += amount;
        idToDefendingFighters[id].defendingAircraft += amount;
    }

    function decreaseDefendingMig15Count(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingFighters[id].mig15Count;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDefendingFighters[id].mig15Count -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function decreaseDeployedMig15Count(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDeployedFighters[id].mig15Count;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDeployedFighters[id].mig15Count -= amount;
        idToDeployedFighters[id].deployedAircraft -= amount;
    }

    function scrapMig15(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingFighters[id].mig15Count;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingFighters[id].mig15Count -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function getDefendingF100SuperSabreCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDefendingFighters[id].f100SuperSabreCount;
        return count;
    }

    function getDeployedF100SuperSabreCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDeployedFighters[id].f100SuperSabreCount;
        return count;
    }

    function increaseF100SuperSabreCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingFighters[id].f100SuperSabreCount += amount;
        idToDefendingFighters[id].defendingAircraft += amount;
    }

    function decreaseDefendingF100SuperSabreCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingFighters[id].f100SuperSabreCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDefendingFighters[id].f100SuperSabreCount -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function decreaseDeployedF100SuperSabreCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDeployedFighters[id].f100SuperSabreCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDeployedFighters[id].f100SuperSabreCount -= amount;
        idToDeployedFighters[id].deployedAircraft -= amount;
    }

    function scrapF100SuperSabre(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingFighters[id].f100SuperSabreCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingFighters[id].f100SuperSabreCount -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function getDefendingF35LightningCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDefendingFighters[id].f35LightningCount;
        return count;
    }

    function getDeployedF35LightningCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDeployedFighters[id].f35LightningCount;
        return count;
    }

    function increaseF35LightningCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingFighters[id].f35LightningCount += amount;
        idToDefendingFighters[id].defendingAircraft += amount;
    }

    function decreaseDefendingF35LightningCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingFighters[id].f35LightningCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDefendingFighters[id].f35LightningCount -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function decreaseDeployedF35LightningCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDeployedFighters[id].f35LightningCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDeployedFighters[id].f35LightningCount -= amount;
        idToDeployedFighters[id].deployedAircraft -= amount;
    }

    function scrapF35Lightning(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingFighters[id].f35LightningCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingFighters[id].f35LightningCount -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function getDefendingF15EagleCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDefendingFighters[id].f15EagleCount;
        return count;
    }

    function getDeployedF15EagleCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDeployedFighters[id].f15EagleCount;
        return count;
    }

    function increaseF15EagleCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingFighters[id].f15EagleCount += amount;
        idToDefendingFighters[id].defendingAircraft += amount;
    }

    function decreaseDefendingF15EagleCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingFighters[id].f15EagleCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDefendingFighters[id].f15EagleCount -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function decreaseDeployedF15EagleCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDeployedFighters[id].f15EagleCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDeployedFighters[id].f15EagleCount -= amount;
        idToDeployedFighters[id].deployedAircraft -= amount;
    }

    function scrapF15Eagle(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingFighters[id].f35LightningCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingFighters[id].f35LightningCount -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function getDefendingSu30MkiCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDefendingFighters[id].su30MkiCount;
        return count;
    }

    function getDeployedSu30MkiCount(uint256 id) public view returns (uint256) {
        uint256 count = idToDeployedFighters[id].su30MkiCount;
        return count;
    }

    function increaseSu30MkiCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingFighters[id].su30MkiCount += amount;
        idToDefendingFighters[id].defendingAircraft += amount;
    }

    function decreaseDefendingSu30MkiCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingFighters[id].su30MkiCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDefendingFighters[id].su30MkiCount -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function decreaseDeployedSu30MkiCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDeployedFighters[id].su30MkiCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDeployedFighters[id].su30MkiCount -= amount;
        idToDeployedFighters[id].deployedAircraft -= amount;
    }

    function scrapSu30Mki(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingFighters[id].su30MkiCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingFighters[id].su30MkiCount -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function getDefendingF22RaptorCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDefendingFighters[id].f22RaptorCount;
        return count;
    }

    function getDeployedF22RaptorCount(uint256 id)
        public
        view
        returns (uint256)
    {
        uint256 count = idToDeployedFighters[id].f22RaptorCount;
        return count;
    }

    function increaseF22RaptorCount(uint256 id, uint256 amount)
        public
        onlyMarket
    {
        idToDefendingFighters[id].f22RaptorCount += amount;
        idToDefendingFighters[id].defendingAircraft += amount;
    }

    function decreaseDefendingF22RaptorCount(uint256 amount, uint256 id)
        public
        onlyWar
    {
        uint256 currentAmount = idToDefendingFighters[id].f22RaptorCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDefendingFighters[id].f22RaptorCount -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function decreaseF22RaptorCount(uint256 amount, uint256 id) public onlyWar {
        uint256 currentAmount = idToDeployedFighters[id].f22RaptorCount;
        require((currentAmount - amount) >= 0, "cannot decrease that many");
        idToDeployedFighters[id].f22RaptorCount -= amount;
        idToDeployedFighters[id].deployedAircraft -= amount;
    }

    function scrapF22Raptor(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToDefendingFighters[id].f22RaptorCount;
        require((currentAmount - amount) >= 0, "cannot delete that many");
        idToDefendingFighters[id].f22RaptorCount -= amount;
        idToDefendingFighters[id].defendingAircraft -= amount;
    }

    function decrementLosses(
        uint256[] memory defenderLosses,
        uint256 defenderId,
        uint256[] memory attackerLosses,
        uint256 attackerId
    ) public onlyAirBattle {
        idToDefendingFighters[defenderId].defendingAircraft -= defenderLosses.length;
        for(uint i; i < defenderLosses.length; i++) {
            if (defenderLosses[i] == 1) {
                idToDefendingFighters[defenderId].yak9Count -= 1;
            } else if (defenderLosses[i] == 2) {
                idToDefendingFighters[defenderId].p51MustangCount -= 1;
            } else if (defenderLosses[i] == 3) {
                idToDefendingFighters[defenderId].f86SabreCount -= 1;
            } else if (defenderLosses[i] == 4) {
                idToDefendingFighters[defenderId].mig15Count -= 1;
            } else if (defenderLosses[i] == 5) {
                idToDefendingFighters[defenderId].f100SuperSabreCount -= 1;
            } else if (defenderLosses[i] == 6) {
                idToDefendingFighters[defenderId].f35LightningCount -= 1;
            } else if (defenderLosses[i] == 7) {
                idToDefendingFighters[defenderId].f15EagleCount -= 1;
            } else if (defenderLosses[i] == 8) {
                idToDefendingFighters[defenderId].su30MkiCount -= 1;
            }else if (defenderLosses[i] == 9) {
                idToDefendingFighters[defenderId].f22RaptorCount -= 1;
            }
        }
        idToDeployedFighters[attackerId].deployedAircraft -= attackerLosses.length;
        for(uint i; i < attackerLosses.length; i++) {
            if (attackerLosses[i] == 1) {
                idToDeployedFighters[attackerId].yak9Count -= 1;
            } else if (attackerLosses[i] == 2) {
                idToDeployedFighters[attackerId].p51MustangCount -= 1;
            } else if (attackerLosses[i] == 3) {
                idToDeployedFighters[attackerId].f86SabreCount -= 1;
            } else if (attackerLosses[i] == 4) {
                idToDeployedFighters[attackerId].mig15Count -= 1;
            } else if (attackerLosses[i] == 5) {
                idToDeployedFighters[attackerId].f100SuperSabreCount -= 1;
            } else if (attackerLosses[i] == 6) {
                idToDeployedFighters[attackerId].f35LightningCount -= 1;
            } else if (attackerLosses[i] == 7) {
                idToDeployedFighters[attackerId].f15EagleCount -= 1;
            } else if (attackerLosses[i] == 8) {
                idToDeployedFighters[attackerId].su30MkiCount -= 1;
            }else if (attackerLosses[i] == 9) {
                idToDeployedFighters[attackerId].f22RaptorCount -= 1;
            }
        }
    }
}

contract FightersMarketplace is Ownable {
    address public countryMinter;
    address public fighters;
    address public bombers;
    address public treasury;
    address public infrastructure;
    address public resources;
    uint256 public yak9Cost = 10000;
    uint256 public yak9RequiredInfrastructure = 100;
    uint256 public yak9RequiredTech = 30;
    uint256 public p51MustangCost = 15000;
    uint256 public p51MustangRequiredInfrastructure = 200;
    uint256 public p51MustangRequiredTech = 65;
    uint256 public f86SabreCost = 20000;
    uint256 public f86SabreRequiredInfrastructure = 300;
    uint256 public f86SabreRequiredTech = 105;
    uint256 public mig15Cost = 25000;
    uint256 public mig15RequiredInfrastructure = 400;
    uint256 public mig15RequiredTech = 150;
    uint256 public f100SuperSabreCost = 30000;
    uint256 public f100SuperSabreRequiredInfrastructure = 500;
    uint256 public f100SuperSabreRequiredTech = 200;
    uint256 public f35LightningCost = 35000;
    uint256 public f35LightningRequiredInfrastructure = 600;
    uint256 public f35LightningRequiredTech = 255;
    uint256 public f15EagleCost = 40000;
    uint256 public f15EagleRequiredInfrastructure = 700;
    uint256 public f15EagleRequiredTech = 315;
    uint256 public su30MkiCost = 45000;
    uint256 public su30MkiRequiredInfrastructure = 850;
    uint256 public su30MkiRequiredTech = 405;
    uint256 public f22RaptorCost = 50000;
    uint256 public f22RaptorRequiredInfrastructure = 1000;
    uint256 public f22RaptorRequiredTech = 500;

    CountryMinter mint;
    BombersContract bomb;
    ResourcesContract res;

    constructor(
        address _countryMinter,
        address _bombers,
        address _fighters,
        address _treasury,
        address _infrastructure,
        address _resources
    ) {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        bombers = _bombers;
        bomb = BombersContract(_bombers);
        resources = _resources;
        res = ResourcesContract(_resources);
        fighters = _fighters;
        treasury = _treasury;
        infrastructure = _infrastructure;
    }

    mapping(uint256 => address) public idToOwnerFightersMarket;

    modifier onlyCountryMinter() {
        require(msg.sender == countryMinter, "only countryMinter can call");
        _;
    }

    function initiateFightersMarket(uint256 id, address nationOwner)
        public
        onlyCountryMinter
    {
        idToOwnerFightersMarket[id] = nationOwner;
    }

    function updateCountryMinterAddress(address newAddress) public onlyOwner {
        countryMinter = newAddress;
        mint = CountryMinter(newAddress);
    }

    function updateBombersAddress(address newAddress) public onlyOwner {
        bombers = newAddress;
        bomb = BombersContract(newAddress);
    }

    function updateFighters1Address(address newAddress) public onlyOwner {
        fighters = newAddress;
    }

    function updateInfrastructureAddress(address newAddress) public onlyOwner {
        infrastructure = newAddress;
    }

    function updateTreasuryAddress(address newAddress) public onlyOwner {
        treasury = newAddress;
    }

    function updateResourcesAddress(address newAddress) public onlyOwner {
        resources = newAddress;
        res = ResourcesContract(newAddress);
    }

    // function updateYak9Specs(
    //     uint256 newPrice,
    //     uint256 newInfra,
    //     uint256 newTech
    // ) public onlyOwner {
    //     yak9Cost = newPrice;
    //     yak9RequiredInfrastructure = newInfra;
    //     yak9RequiredTech = newTech;
    // }

    // function updateP51MustangSpecs(
    //     uint256 newPrice,
    //     uint256 newInfra,
    //     uint256 newTech
    // ) public onlyOwner {
    //     p51MustangCost = newPrice;
    //     p51MustangRequiredInfrastructure = newInfra;
    //     p51MustangRequiredTech = newTech;
    // }

    // function updateF86SabreSpecs(
    //     uint256 newPrice,
    //     uint256 newInfra,
    //     uint256 newTech
    // ) public onlyOwner {
    //     f86SabreCost = newPrice;
    //     f86SabreRequiredInfrastructure = newInfra;
    //     f86SabreRequiredTech = newTech;
    // }

    // function updateMig15Specs(
    //     uint256 newPrice,
    //     uint256 newInfra,
    //     uint256 newTech
    // ) public onlyOwner {
    //     mig15Cost = newPrice;
    //     mig15RequiredInfrastructure = newInfra;
    //     mig15RequiredTech = newTech;
    // }

    // function updateF100SuperSabreSpecs(
    //     uint256 newPrice,
    //     uint256 newInfra,
    //     uint256 newTech
    // ) public onlyOwner {
    //     f100SuperSabreCost = newPrice;
    //     f100SuperSabreRequiredInfrastructure = newInfra;
    //     f100SuperSabreRequiredTech = newTech;
    // }

    // function updateF35LightningSpecs(
    //     uint256 newPrice,
    //     uint256 newInfra,
    //     uint256 newTech
    // ) public onlyOwner {
    //     f35LightningCost = newPrice;
    //     f35LightningRequiredInfrastructure = newInfra;
    //     f35LightningRequiredTech = newTech;
    // }

    // function updateF15EagleSpecs(
    //     uint256 newPrice,
    //     uint256 newInfra,
    //     uint256 newTech
    // ) public onlyOwner {
    //     f15EagleCost = newPrice;
    //     f15EagleRequiredInfrastructure = newInfra;
    //     f15EagleRequiredTech = newTech;
    // }

    // function updateSU30MkiSpecs(
    //     uint256 newPrice,
    //     uint256 newInfra,
    //     uint256 newTech
    // ) public onlyOwner {
    //     su30MkiCost = newPrice;
    //     su30MkiRequiredInfrastructure = newInfra;
    //     su30MkiRequiredTech = newTech;
    // }

    // function updateF22RaptorSpecs(
    //     uint256 newPrice,
    //     uint256 newInfra,
    //     uint256 newTech
    // ) public onlyOwner {
    //     f22RaptorCost = newPrice;
    //     f22RaptorRequiredInfrastructure = newInfra;
    //     f22RaptorRequiredTech = newTech;
    // }

    function buyYak9(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 fighterCount = FightersContract(fighters).getAircraftCount(id);
        uint256 bomberCount = bomb.getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        uint256 aircraftCount = (fighterCount + bomberCount);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= yak9RequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= yak9RequiredTech, "!enough tech");
        uint256 purchasePrice = (yak9Cost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseYak9Count(id, amount);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyP51Mustang(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 fighterCount = FightersContract(fighters).getAircraftCount(id);
        uint256 bomberCount = bomb.getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        uint256 aircraftCount = (fighterCount + bomberCount);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= p51MustangRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= p51MustangRequiredTech, "!enough tech");
        uint256 purchasePrice = (p51MustangCost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseP51MustangCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyF86Sabre(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 fighterCount = FightersContract(fighters).getAircraftCount(id);
        uint256 bomberCount = bomb.getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        uint256 aircraftCount = (fighterCount + bomberCount);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= f86SabreRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= f86SabreRequiredTech, "!enough tech");
        uint256 purchasePrice = (f86SabreCost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseF86SabreCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyMig15(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 fighterCount = FightersContract(fighters).getAircraftCount(id);
        uint256 bomberCount = bomb.getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        uint256 aircraftCount = (fighterCount + bomberCount);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= mig15RequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= mig15RequiredTech, "!enough tech");
        uint256 purchasePrice = (mig15Cost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseMig15Count(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyF100SuperSabre(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 fighterCount = FightersContract(fighters).getAircraftCount(id);
        uint256 bomberCount = bomb.getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        uint256 aircraftCount = (fighterCount + bomberCount);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= f100SuperSabreRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= f100SuperSabreRequiredTech, "!enough tech");
        uint256 purchasePrice = (f100SuperSabreCost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseF100SuperSabreCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyF35Lightning(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 fighterCount = FightersContract(fighters).getAircraftCount(id);
        uint256 bomberCount = bomb.getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        uint256 aircraftCount = (fighterCount + bomberCount);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= f35LightningRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= f35LightningRequiredTech, "!enough tech");
        uint256 purchasePrice = (f35LightningCost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseF35LightningCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyF15Eagle(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 fighterCount = FightersContract(fighters).getAircraftCount(id);
        uint256 bomberCount = bomb.getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        uint256 aircraftCount = (fighterCount + bomberCount);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= f15EagleRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= f15EagleRequiredTech, "!enough tech");
        uint256 purchasePrice = (f15EagleCost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseF15EagleCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buySu30Mki(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 fighterCount = FightersContract(fighters).getAircraftCount(id);
        uint256 bomberCount = bomb.getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        uint256 aircraftCount = (fighterCount + bomberCount);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= su30MkiRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= su30MkiRequiredTech, "!enough tech");
        uint256 purchasePrice = (su30MkiCost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseSu30MkiCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function buyF22Raptor(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 fighterCount = FightersContract(fighters).getAircraftCount(id);
        uint256 bomberCount = bomb.getAircraftCount(id);
        uint256 maxAircraft = FightersContract(fighters).getMaxAircraftCount(
            id
        );
        uint256 aircraftCount = (fighterCount + bomberCount);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = InfrastructureContract(infrastructure)
            .getInfrastructureCount(id);
        require(
            callerInfra >= f22RaptorRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = InfrastructureContract(infrastructure)
            .getTechnologyCount(id);
        require(callerTech >= f22RaptorRequiredTech, "!enough tech");
        uint256 purchasePrice = (f22RaptorCost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseF22RaptorCount(id, amount);
        FightersContract(fighters).increaseAircraftCount(amount, id);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function getAircraftPurchaseCostModifier(uint256 id) public view returns (uint256) {
        uint256 aircraftPurchaseModifier = 100;
        bool aluminium = res.viewAluminium(id);
        if(aluminium) { aircraftPurchaseModifier -= 8; }
        return aircraftPurchaseModifier;
    }
}
