//SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "./Treasury.sol";
import "./Infrastructure.sol";
import "./CountryMinter.sol";
import "./Bombers.sol";
import "./Resources.sol";
import "./Improvements.sol";
import "./Wonders.sol";
import "./Navy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title FightersContract
///@author OxSnosh
///@notice this contract will store data for the figher aircraft owned by a nation
contract FightersContract is Ownable {
    address public countryMinter;
    address public fightersMarket1;
    address public fightersMarket2;
    address public bombers;
    address public treasuryAddress;
    address public infrastructure;
    address public war;
    address public resources;
    address public improvements1;
    address public airBattle;
    address public wonders1;
    address public losses;
    address public navy;

    CountryMinter mint;
    ResourcesContract res;
    ImprovementsContract1 imp1;
    WondersContract1 won1;
    NavyContract nav;
    BombersContract bomb;

    struct Fighters {
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

    event Yak9Purchased(uint256 indexed id, uint256 indexed amount);
    event P51MustangPurchased(uint256 indexed id, uint256 indexed amount);
    event F86SabrePurchased(uint256 indexed id, uint256 indexed amount);
    event Mig15Purchased(uint256 indexed id, uint256 indexed amount);
    event F100SuperSabrePurchased(uint256 indexed id, uint256 indexed amount);
    event F35LightningPurchased(uint256 indexed id, uint256 indexed amount);
    event F15EaglePurchased(uint256 indexed id, uint256 indexed amount);
    event Su30MkiPurchased(uint256 indexed id, uint256 indexed amount);
    event F22RaptorPurchased(uint256 indexed id, uint256 indexed amount);

    event Yak9Scrapped(uint256 indexed id, uint256 indexed amount);
    event P51MustangScrapped(uint256 indexed id, uint256 indexed amount);
    event F86SabreScrapped(uint256 indexed id, uint256 indexed amount);
    event Mig15Scrapped(uint256 indexed id, uint256 indexed amount);
    event F100SuperSabreScrapped(uint256 indexed id, uint256 indexed amount);
    event F35LightningScrapped(uint256 indexed id, uint256 indexed amount);
    event F15EagleScrapped(uint256 indexed id, uint256 indexed amount);
    event Su30MkiScrapped(uint256 indexed id, uint256 indexed amount);
    event F22RaptorScrapped(uint256 indexed id, uint256 indexed amount);

    mapping(uint256 => Fighters) public idToFighters;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _countryMinter,
        address _fightersMarket1,
        address _fightersMarket2,
        address _treasuryAddress,
        address _war,
        address _infrastructure,
        address _resources,
        address _improvements1,
        address _airBattle,
        address _wonders1,
        address _losses
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        resources = _resources;
        res = ResourcesContract(_resources);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        fightersMarket1 = _fightersMarket1;
        fightersMarket2 = _fightersMarket2;
        treasuryAddress = _treasuryAddress;
        war = _war;
        infrastructure = _infrastructure;
        airBattle = _airBattle;
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        losses = _losses;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings2(address _navy, address _bombers) public onlyOwner {
        navy = _navy;
        nav = NavyContract(_navy);
        bombers = _bombers;
        bomb = BombersContract(_bombers);
    }

    modifier onlyCountryMinter() {
        require(msg.sender == countryMinter, "only countryMinter can call");
        _;
    }

    modifier onlyMarket() {
        require(
            msg.sender == fightersMarket1 || msg.sender == fightersMarket2,
            "this function can only be called by market"
        );
        _;
    }

    modifier onlyLossesContract() {
        require(msg.sender == losses, "only callable from losses contract");
        _;
    }
    
    ///@dev this function is a public function but only callable from the country minter contact when a country is minted
    ///@notice this function allows a nation to purchase fighter aircraft once a country is minted
    ///@param id this is the nation ID of the nation being minted
    function generateFighters(uint256 id) public onlyCountryMinter {
        Fighters memory newFighters = Fighters(0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToFighters[id] = newFighters;
    }

    ///@notice this function will return the amount of defending Yak9's of a nation
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending Yak9 aircraft for the nation
    function getYak9Count(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].yak9Count;
        return count;
    }

    ///@dev this function is only callabel from the Fighter Market contracts
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseYak9Count(uint256 id, uint256 amount) public onlyMarket {
        idToFighters[id].yak9Count += amount;
        emit Yak9Purchased(id, amount);
    }

    ///@dev this function is only callable from the losses contract
    ///@notice this function will decrease the amount of defending aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseYak9Count(
        uint256 amount,
        uint256 id
    ) public onlyLossesContract {
        uint256 currentAmount = idToFighters[id].yak9Count;
        if (currentAmount >= amount) {
            idToFighters[id].yak9Count -= amount;
        } else {
            idToFighters[id].yak9Count = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission Yak9's
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapYak9(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToFighters[id].yak9Count;
        require(currentAmount >= amount, "cannot delete that many");
        idToFighters[id].yak9Count -= amount;
        emit Yak9Scrapped(id, amount);
    }

    ///@notice this function will return the amount of defending P51 Mustangs's of a nation
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending P51 Mustang aircraft for the nation
    function getP51MustangCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].p51MustangCount;
        return count;
    }

    ///@dev this function is only callabel from the Fighter Market contracts
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseP51MustangCount(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToFighters[id].p51MustangCount += amount;
        emit P51MustangPurchased(id, amount);
    }

    ///@dev this function is only callable from the losses contract
    ///@notice this function will decrease the amount of defending aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseP51MustangCount(
        uint256 amount,
        uint256 id
    ) public onlyLossesContract {
        uint256 currentAmount = idToFighters[id].p51MustangCount;
        if (currentAmount >= amount) {
            idToFighters[id].p51MustangCount -= amount;
        } else {
            idToFighters[id].p51MustangCount = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission P51 Mustangs's
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapP51Mustang(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToFighters[id].p51MustangCount;
        require(currentAmount >= amount, "cannot delete that many");
        idToFighters[id].p51MustangCount -= amount;
        emit P51MustangScrapped(id, amount);
    }

    ///@notice this function will return the amount of defending F86 Sabre's of a nation
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending F86 Sabre aircraft for the nation
    function getF86SabreCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].f86SabreCount;
        return count;
    }

    ///@dev this function is only callabel from the Fighter Market contracts
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseF86SabreCount(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToFighters[id].f86SabreCount += amount;
        emit F86SabrePurchased(id, amount);
    }

    ///@dev this function is only callable from the losses contract
    ///@notice this function will decrease the amount of defending aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseF86SabreCount(
        uint256 amount,
        uint256 id
    ) public onlyLossesContract {
        uint256 currentAmount = idToFighters[id].f86SabreCount;
        if (currentAmount >= amount) {
            idToFighters[id].f86SabreCount -= amount;
        } else {
            idToFighters[id].f86SabreCount = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission F86 Sabre's
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapF86Sabre(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToFighters[id].f86SabreCount;
        require(currentAmount >= amount, "cannot delete that many");
        idToFighters[id].f86SabreCount -= amount;
        emit F86SabreScrapped(id, amount);
    }

    ///@notice this function will return the amount of defending Mig15's of a nation
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending Mig15's aircraft for the nation
    function getMig15Count(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].mig15Count;
        return count;
    }

    ///@dev this function is only callabel from the Fighter Market contracts
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseMig15Count(uint256 id, uint256 amount) public onlyMarket {
        idToFighters[id].mig15Count += amount;
        emit Mig15Purchased(id, amount);
    }

    ///@dev this function is only callable from the losses contract
    ///@notice this function will decrease the amount of defending aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseMig15Count(
        uint256 amount,
        uint256 id
    ) public onlyLossesContract {
        uint256 currentAmount = idToFighters[id].mig15Count;
        if (currentAmount >= amount) {
            idToFighters[id].mig15Count -= amount;
        } else {
            idToFighters[id].mig15Count = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission Mig15's
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapMig15(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToFighters[id].mig15Count;
        require(currentAmount >= amount, "cannot delete that many");
        idToFighters[id].mig15Count -= amount;
        emit Mig15Scrapped(id, amount);
    }

    ///@notice this function will return the amount of defending F100 Super Sabre's of a nation
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending F100 Super Sabre aircraft for the nation
    function getF100SuperSabreCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].f100SuperSabreCount;
        return count;
    }

    ///@dev this function is only callabel from the Fighter Market contracts
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseF100SuperSabreCount(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToFighters[id].f100SuperSabreCount += amount;
        emit F100SuperSabrePurchased(id, amount);
    }

    ///@dev this function is only callable from the losses contract
    ///@notice this function will decrease the amount of defending aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseF100SuperSabreCount(
        uint256 amount,
        uint256 id
    ) public onlyLossesContract {
        uint256 currentAmount = idToFighters[id].f100SuperSabreCount;
        if (currentAmount >= amount) {
            idToFighters[id].f100SuperSabreCount -= amount;
        } else {
            idToFighters[id].f100SuperSabreCount = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission F100 Super Sabre's
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapF100SuperSabre(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToFighters[id].f100SuperSabreCount;
        require(currentAmount >= amount, "cannot delete that many");
        idToFighters[id].f100SuperSabreCount -= amount;
        emit F100SuperSabreScrapped(id, amount);
    }

    ///@notice this function will return the amount of defending F35 Lightning's of a nation
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending F35 Lightning aircraft for the nation
    function getF35LightningCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].f35LightningCount;
        return count;
    }

    ///@dev this function is only callabel from the Fighter Market contracts
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseF35LightningCount(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToFighters[id].f35LightningCount += amount;
        emit F35LightningPurchased(id, amount);
    }

    ///@dev this function is only callable from the losses contract
    ///@notice this function will decrease the amount of defending aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseF35LightningCount(
        uint256 amount,
        uint256 id
    ) public onlyLossesContract {
        uint256 currentAmount = idToFighters[id].f35LightningCount;
        if (currentAmount >= amount) {
            idToFighters[id].f35LightningCount -= amount;
        } else {
            idToFighters[id].f35LightningCount = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission F35's
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapF35Lightning(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToFighters[id].f35LightningCount;
        require(currentAmount >= amount, "cannot delete that many");
        idToFighters[id].f35LightningCount -= amount;
        emit F35LightningScrapped(id, amount);
    }

    ///@notice this function will return the amount of defending F15 Eagle's of a nation
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending F15 Eagle aircraft for the nation
    function getF15EagleCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].f15EagleCount;
        return count;
    }

    ///@dev this function is only callabel from the Fighter Market contracts
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseF15EagleCount(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToFighters[id].f15EagleCount += amount;
        emit F15EaglePurchased(id, amount);
    }

    ///@dev this function is only callable from the losses contract
    ///@notice this function will decrease the amount of defending aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseF15EagleCount(
        uint256 amount,
        uint256 id
    ) public onlyLossesContract {
        uint256 currentAmount = idToFighters[id].f15EagleCount;
        if (currentAmount >= amount) {
            idToFighters[id].f15EagleCount -= amount;
        } else {
            idToFighters[id].f15EagleCount = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission F15's
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapF15Eagle(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToFighters[id].f15EagleCount;
        require(currentAmount >= amount, "cannot delete that many");
        idToFighters[id].f15EagleCount -= amount;
        emit F15EagleScrapped(id, amount);
    }

    ///@notice this function will return the amount of defending Su30 Mki's of a nation
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending Su30 Mki aircraft for the nation
    function getSu30MkiCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].su30MkiCount;
        return count;
    }

    ///@dev this function is only callabel from the Fighter Market contracts
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseSu30MkiCount(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToFighters[id].su30MkiCount += amount;
        emit Su30MkiPurchased(id, amount);
    }

    ///@dev this function is only callable from the losses contract
    ///@notice this function will decrease the amount of defending aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseSu30MkiCount(
        uint256 amount,
        uint256 id
    ) public onlyLossesContract {
        uint256 currentAmount = idToFighters[id].su30MkiCount;
        if (currentAmount >= amount) {
            idToFighters[id].su30MkiCount -= amount;
        } else {
            idToFighters[id].su30MkiCount = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission Su30's
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapSu30Mki(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToFighters[id].su30MkiCount;
        require(currentAmount >= amount, "cannot delete that many");
        idToFighters[id].su30MkiCount -= amount;
        emit Su30MkiScrapped(id, amount);
    }

    ///@notice this function will return the amount of defending F22 Raptor's of a nation
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending F22 Raptor aircraft for the nation
    function getF22RaptorCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].f22RaptorCount;
        return count;
    }

    ///@dev this function is only callabel from the Fighter Market contracts
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseF22RaptorCount(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToFighters[id].f22RaptorCount += amount;
        emit F22RaptorPurchased(id, amount);
    }

    ///@dev this function is only callable from the losses contract
    ///@notice this function will decrease the amount of defending aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseF22RaptorCount(
        uint256 amount,
        uint256 id
    ) public onlyLossesContract {
        uint256 currentAmount = idToFighters[id].f22RaptorCount;
        if (currentAmount >= amount) {
            idToFighters[id].f22RaptorCount -= amount;
        } else {
            idToFighters[id].f22RaptorCount = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission F22's
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapF22Raptor(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToFighters[id].f22RaptorCount;
        require(currentAmount >= amount, "cannot delete that many");
        idToFighters[id].f22RaptorCount -= amount;
        emit F22RaptorScrapped(id, amount);
    }

    function getFighterCount(uint256 id) public view returns (uint256) {
        uint256 count = idToFighters[id].yak9Count +
            idToFighters[id].p51MustangCount +
            idToFighters[id].f86SabreCount +
            idToFighters[id].mig15Count +
            idToFighters[id].f100SuperSabreCount +
            idToFighters[id].f35LightningCount +
            idToFighters[id].f15EagleCount +
            idToFighters[id].su30MkiCount +
            idToFighters[id].f22RaptorCount;
        return count;
    }

    function getAircraftCount(uint256 id) public view returns (uint256) {
        uint256 bomberCount = bomb.getBomberCount(id);
        uint256 fighterCount = getFighterCount(id);
        uint256 total = bomberCount + fighterCount;
        return total;
    }
}

///@title FighterLosses
///@author OxSnosh
///@notice this contract will decrease the amount of fighters lost in battle
contract FighterLosses is Ownable {
    address public fighters;
    address public airBattle;

    FightersContract fight;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(address _fighters, address _airBattle) public onlyOwner {
        fighters = _fighters;
        fight = FightersContract(_fighters);
        airBattle = _airBattle;
    }

    modifier onlyAirBattle() {
        require(
            msg.sender == airBattle,
            "this function can only be called by air battle"
        );
        _;
    }

    ///@dev this is a public function that is only callable from the Air Battle contract
    ///@notice this function will decrease the amount of fighers lost in battle from the FighersContract
    ///@param losses is an array of uints that represent the fighters that the defender lost in battle
    ///@param id is the nation ID of the defender
    function decrementLosses(
        uint256[] memory losses,
        uint256 id
    ) public onlyAirBattle {
        for (uint256 i; i < losses.length; i++) {
            if (losses[i] == 1) {
                fight.decreaseYak9Count(1, id);
            } else if (losses[i] == 2) {
                fight.decreaseP51MustangCount(1, id);
            } else if (losses[i] == 3) {
                fight.decreaseF86SabreCount(1, id);
            } else if (losses[i] == 4) {
                fight.decreaseMig15Count(1, id);
            } else if (losses[i] == 5) {
                fight.decreaseF100SuperSabreCount(1, id);
            } else if (losses[i] == 6) {
                fight.decreaseF35LightningCount(1, id);
            } else if (losses[i] == 7) {
                fight.decreaseF15EagleCount(1, id);
            } else if (losses[i] == 8) {
                fight.decreaseSu30MkiCount(1, id);
            } else if (losses[i] == 9) {
                fight.decreaseF22RaptorCount(1, id);
            }
        }
    }
}

///@title FightersMarketplace1
///@author OxSnosh
///@dev this contact inherits from openzeppelin's ownable contract
///@notice this contract will allow the nation owner to buy Yak9s, P51 Mustangs, F86 Sabres, Mig15s, and F100's
contract FightersMarketplace1 is Ownable {
    address public countryMinter;
    address public fighters;
    address public bombers;
    address public treasury;
    address public infrastructure;
    address public resources;
    address public improvements1;
    address public wonders1;
    address public wonders4;
    address public navy;
    address public bonusResources;
    address public navy2;
    uint256 public yak9Cost = 10000 * (10 ** 18);
    uint256 public yak9RequiredInfrastructure = 100;
    uint256 public yak9RequiredTech = 30;
    uint256 public p51MustangCost = 15000 * (10 ** 18);
    uint256 public p51MustangRequiredInfrastructure = 200;
    uint256 public p51MustangRequiredTech = 65;
    uint256 public f86SabreCost = 20000 * (10 ** 18);
    uint256 public f86SabreRequiredInfrastructure = 300;
    uint256 public f86SabreRequiredTech = 105;
    uint256 public mig15Cost = 25000 * (10 ** 18);
    uint256 public mig15RequiredInfrastructure = 400;
    uint256 public mig15RequiredTech = 150;
    uint256 public f100SuperSabreCost = 30000 * (10 ** 18);
    uint256 public f100SuperSabreRequiredInfrastructure = 500;
    uint256 public f100SuperSabreRequiredTech = 200;

    CountryMinter mint;
    BombersContract bomb;
    ResourcesContract res;
    ImprovementsContract1 imp1;
    WondersContract1 won1;
    WondersContract4 won4;
    FightersContract fight;
    NavyContract nav;
    BonusResourcesContract bonus;
    NavyContract2 nav2;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _countryMinter,
        address _bombers,
        address _fighters,
        address _treasury,
        address _infrastructure,
        address _resources,
        address _improvements1,
        address _wonders1,
        address _wonders4,
        address _navy
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        bombers = _bombers;
        bomb = BombersContract(_bombers);
        resources = _resources;
        res = ResourcesContract(_resources);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        wonders4 = _wonders4;
        won4 = WondersContract4(_wonders4);
        treasury = _treasury;
        fighters = _fighters;
        fight = FightersContract(_fighters);
        infrastructure = _infrastructure;
        navy = _navy;
        nav = NavyContract(_navy);
    }

    function settings2(
        address _bonusResources,
        address _navy2
    ) public onlyOwner {
        bonusResources = _bonusResources;
        bonus = BonusResourcesContract(_bonusResources);
        navy2 = _navy2;
        nav2 = NavyContract2(_navy2);
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a Yak9
    function updateYak9Specs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        yak9Cost = newPrice;
        yak9RequiredInfrastructure = newInfra;
        yak9RequiredTech = newTech;
    }

    function getYak9Specs() public view returns (uint256, uint256, uint256) {
        return (yak9Cost, yak9RequiredInfrastructure, yak9RequiredTech);
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a P51 Mustang
    function updateP51MustangSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        p51MustangCost = newPrice;
        p51MustangRequiredInfrastructure = newInfra;
        p51MustangRequiredTech = newTech;
    }

    function getP51MustangSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            p51MustangCost,
            p51MustangRequiredInfrastructure,
            p51MustangRequiredTech
        );
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a F86 Sabre
    function updateF86SabreSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        f86SabreCost = newPrice;
        f86SabreRequiredInfrastructure = newInfra;
        f86SabreRequiredTech = newTech;
    }

    function getF86SabreSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            f86SabreCost,
            f86SabreRequiredInfrastructure,
            f86SabreRequiredTech
        );
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a Mig15
    function updateMig15Specs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        mig15Cost = newPrice;
        mig15RequiredInfrastructure = newInfra;
        mig15RequiredTech = newTech;
    }

    function getMig15Specs() public view returns (uint256, uint256, uint256) {
        return (mig15Cost, mig15RequiredInfrastructure, mig15RequiredTech);
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a F100 Super Sabre
    function updateF100SuperSabreSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        f100SuperSabreCost = newPrice;
        f100SuperSabreRequiredInfrastructure = newInfra;
        f100SuperSabreRequiredTech = newTech;
    }

    function getF100SuperSabreSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            f100SuperSabreCost,
            f100SuperSabreRequiredInfrastructure,
            f100SuperSabreRequiredTech
        );
    }

    ///@dev this is a public view function that will allow the caller to purchase a Yak9 for their nation
    ///@notice this function allowes the caller to purchase a Yak9 for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyYak9(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = getMaxAircraftCount(id);
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
        uint256 cost = getYak9Cost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice, "insufficient money to buy aircraft");
        FightersContract(fighters).increaseYak9Count(id, amount);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function getYak9Cost(uint256 id) public view returns (uint256) {
        uint256 mod = getAircraftPurchaseCostModifier(id);
        uint256 cost = ((yak9Cost * mod) / 100);
        return cost;
    }

    ///@dev this is a public view function that will allow the caller to purchase a P51 for their nation
    ///@notice this function allowes the caller to purchase a P51 for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyP51Mustang(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = getMaxAircraftCount(id);
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
        uint256 cost = getP51MustangCost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseP51MustangCount(id, amount);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function getP51MustangCost(uint256 id) public view returns (uint256) {
        uint256 mod = getAircraftPurchaseCostModifier(id);
        uint256 cost = ((p51MustangCost * mod) / 100);
        return cost;
    }

    ///@dev this is a public view function that will allow the caller to purchase a F86 for their nation
    ///@notice this function allowes the caller to purchase a F86 for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyF86Sabre(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = getMaxAircraftCount(id);
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
        uint256 cost = getF86SabreCost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseF86SabreCount(id, amount);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function getF86SabreCost(uint256 id) public view returns (uint256) {
        uint256 mod = getAircraftPurchaseCostModifier(id);
        uint256 cost = ((f86SabreCost * mod) / 100);
        return cost;
    }

    ///@dev this is a public view function that will allow the caller to purchase a Mig15 for their nation
    ///@notice this function allowes the caller to purchase a Mig15 for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyMig15(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = getMaxAircraftCount(id);
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
        uint256 cost = getMig15Cost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseMig15Count(id, amount);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function getMig15Cost(uint256 id) public view returns (uint256) {
        uint256 mod = getAircraftPurchaseCostModifier(id);
        uint256 cost = ((mig15Cost * mod) / 100);
        return cost;
    }

    ///@dev this is a public view function that will allow the caller to purchase a F100 Super Sabre for their nation
    ///@notice this function allowes the caller to purchase a F100 Super Sabre for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyF100SuperSabre(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = getMaxAircraftCount(id);
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
        uint256 cost = getF100SuperSabreCost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseF100SuperSabreCount(id, amount);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function getF100SuperSabreCost(uint256 id) public view returns (uint256) {
        uint256 mod = getAircraftPurchaseCostModifier(id);
        uint256 cost = ((f100SuperSabreCost * mod) / 100);
        return cost;
    }

    ///@dev this is public view function that will adjust the cost of the aircraft being purchased based on resources, improvements and wonders of that nation
    ///@notice this function will adjust the cost of aircraft based on resources, improvements and wonders
    ///@notice aluminium, oil, rubber, airports and space programs decrease the cost of aircraft
    ///@param id is the nation ID of the nation being queried
    ///@return uint256 is the percentage modifier used to adjust the aircraft purchase price
    function getAircraftPurchaseCostModifier(
        uint256 id
    ) public view returns (uint256) {
        uint256 aircraftPurchaseModifier = 100;
        bool aluminium = res.viewAluminium(id);
        if (aluminium) {
            aircraftPurchaseModifier -= 8;
        }
        bool oil = res.viewOil(id);
        if (oil) {
            aircraftPurchaseModifier -= 4;
        }
        bool rubber = res.viewRubber(id);
        if (rubber) {
            aircraftPurchaseModifier -= 4;
        }
        uint256 airports = imp1.getAirportCount(id);
        if (airports > 0) {
            aircraftPurchaseModifier -= (2 * airports);
        }
        bool spaceProgram = won4.getSpaceProgram(id);
        if (spaceProgram) {
            aircraftPurchaseModifier -= 5;
        }
        return aircraftPurchaseModifier;
    }

    ///@dev this a public view function that will return the maximum amonut of aircraft a nation can own
    ///@notice this is a function that will return the maximum amount of aircraft a nation can own
    ///@notice the base amount of aircraft a nation can own is 50
    ///@notice access to the construction resource will increase the amount of aircraft a nation can own by 10
    ///@notice a foreign air force base will increase the maximum amount of aircraft for a nation by 20
    ///@notice the maxmimum aircraft a nation can own will increase by 5 for each aircraft carrier owned
    ///@param id is the nation ID of the nation being queried
    ///@return uint256 is the maximum amount of aircraft a nation can own
    function getMaxAircraftCount(uint256 id) public view returns (uint256) {
        uint256 maxAircraftCount = 50;
        bool construction = bonus.viewConstruction(id);
        if (construction) {
            maxAircraftCount += 10;
        }
        bool foreignAirForceBase = won1.getForeignAirforceBase(id);
        if (foreignAirForceBase) {
            maxAircraftCount += 20;
        }
        uint256 aircraftCarrierCount = nav2.getAircraftCarrierCount(id);
        if (aircraftCarrierCount > 5) {
            aircraftCarrierCount = 5;
        }
        if (aircraftCarrierCount > 0) {
            maxAircraftCount += (aircraftCarrierCount * 5);
        }
        return maxAircraftCount;
    }
}

///@title FightersMarketplace2
///@author OxSnosh
///@notice this contract allows a nation owner to purchase F35's, F15's, SU30's and F22's
///@dev this contact inherits from owpenzeppelin's ownable contact
contract FightersMarketplace2 is Ownable {
    address public countryMinter;
    address public fighters;
    address public fightersMarket1;
    address public bombers;
    address public treasury;
    address public infrastructure;
    address public resources;
    address public improvements1;
    uint256 public f35LightningCost = 35000 * (10 ** 18);
    uint256 public f35LightningRequiredInfrastructure = 600;
    uint256 public f35LightningRequiredTech = 255;
    uint256 public f15EagleCost = 40000 * (10 ** 18);
    uint256 public f15EagleRequiredInfrastructure = 700;
    uint256 public f15EagleRequiredTech = 315;
    uint256 public su30MkiCost = 45000 * (10 ** 18);
    uint256 public su30MkiRequiredInfrastructure = 850;
    uint256 public su30MkiRequiredTech = 405;
    uint256 public f22RaptorCost = 50000 * (10 ** 18);
    uint256 public f22RaptorRequiredInfrastructure = 1000;
    uint256 public f22RaptorRequiredTech = 500;

    CountryMinter mint;
    BombersContract bomb;
    ResourcesContract res;
    ImprovementsContract1 imp1;
    FightersContract fight;
    FightersMarketplace1 fightMarket1;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _countryMinter,
        address _bombers,
        address _fighters,
        address _fightersMarket1,
        address _treasury,
        address _infrastructure,
        address _resources,
        address _improvements1
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        bombers = _bombers;
        bomb = BombersContract(_bombers);
        resources = _resources;
        res = ResourcesContract(_resources);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        treasury = _treasury;
        fighters = _fighters;
        fight = FightersContract(_fighters);
        fightersMarket1 = _fightersMarket1;
        fightMarket1 = FightersMarketplace1(_fightersMarket1);
        infrastructure = _infrastructure;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a F35 Lightning
    function updateF35LightningSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        f35LightningCost = newPrice;
        f35LightningRequiredInfrastructure = newInfra;
        f35LightningRequiredTech = newTech;
    }

    function getF35LightningSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            f35LightningCost,
            f35LightningRequiredInfrastructure,
            f35LightningRequiredTech
        );
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a F15 Eagle
    function updateF15EagleSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        f15EagleCost = newPrice;
        f15EagleRequiredInfrastructure = newInfra;
        f15EagleRequiredTech = newTech;
    }

    function getF15EagleSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            f15EagleCost,
            f15EagleRequiredInfrastructure,
            f15EagleRequiredTech
        );
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a SU30 Mki
    function updateSU30MkiSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        su30MkiCost = newPrice;
        su30MkiRequiredInfrastructure = newInfra;
        su30MkiRequiredTech = newTech;
    }

    function getSU30MkiSpecs() public view returns (uint256, uint256, uint256) {
        return (
            su30MkiCost,
            su30MkiRequiredInfrastructure,
            su30MkiRequiredTech
        );
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a F22
    function updateF22RaptorSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        f22RaptorCost = newPrice;
        f22RaptorRequiredInfrastructure = newInfra;
        f22RaptorRequiredTech = newTech;
    }

    function getF22RaptorSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            f22RaptorCost,
            f22RaptorRequiredInfrastructure,
            f22RaptorRequiredTech
        );
    }

    ///@dev this is a public view function that will allow the caller to purchase a F35 Lightning for their nation
    ///@notice this function allowes the caller to purchase a F35 Lightning for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyF35Lightning(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
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
        uint256 cost = getF35LightningCost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseF35LightningCount(id, amount);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function getF35LightningCost(uint256 id) public view returns (uint256) {
        uint256 mod = fightMarket1.getAircraftPurchaseCostModifier(id);
        uint256 cost = ((f35LightningCost * mod) / 100);
        return cost;
    }

    ///@dev this is a public view function that will allow the caller to purchase a F15 Eagle for their nation
    ///@notice this function allowes the caller to purchase a F15 Eagle for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyF15Eagle(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
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
        uint256 cost = getF15EagleCost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseF15EagleCount(id, amount);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function getF15EagleCost(uint256 id) public view returns (uint256) {
        uint256 mod = fightMarket1.getAircraftPurchaseCostModifier(id);
        uint256 cost = ((f15EagleCost * mod) / 100);
        return cost;
    }

    ///@dev this is a public view function that will allow the caller to purchase a Su30 Mki for their nation
    ///@notice this function allowes the caller to purchase a Su30 Mki for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buySu30Mki(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
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
        uint256 cost = getSu30MkiCost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseSu30MkiCount(id, amount);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function getSu30MkiCost(uint256 id) public view returns (uint256) {
        uint256 mod = fightMarket1.getAircraftPurchaseCostModifier(id);
        uint256 cost = ((su30MkiCost * mod) / 100);
        return cost;
    }

    ///@dev this is a public view function that will allow the caller to purchase a F22 Raptor for their nation
    ///@notice this function allowes the caller to purchase a F22 Raptor for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyF22Raptor(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
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
        uint256 cost = getF22RaptorCost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(balance >= purchasePrice);
        FightersContract(fighters).increaseF22RaptorCount(id, amount);
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
    }

    function getF22RaptorCost(uint256 id) public view returns (uint256) {
        uint256 mod = fightMarket1.getAircraftPurchaseCostModifier(id);
        uint256 cost = ((f22RaptorCost * mod) / 100);
        return cost;
    }
}
