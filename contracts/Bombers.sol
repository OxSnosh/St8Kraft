//SPDX-License-Identifier: Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International
pragma solidity 0.8.17;

import "./Treasury.sol";
import "./CountryMinter.sol";
import "./Infrastructure.sol";
import "./Fighters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title BombersContract
///@author OxSnosh
///@notice this contract will store this information about each nation's bomber fleet
contract BombersContract is Ownable {
    address public countryMinter;
    address public bombersMarket1;
    address public bombersMarket2;
    address public airBattle;
    address public fighters;
    address public treasury;
    address public infrastructure;
    address public war;

    CountryMinter mint;

    struct Bombers {
        uint256 ah1CobraCount;
        uint256 ah64ApacheCount;
        uint256 bristolBlenheimCount;
        uint256 b52MitchellCount;
        uint256 b17gFlyingFortressCount;
        uint256 b52StratofortressCount;
        uint256 b2SpiritCount;
        uint256 b1bLancerCount;
        uint256 tupolevTu160Count;
    }

    event Ah1CobraPurchased(uint256 indexed id, uint256 indexed amount);
    event Ah64ApachePurchased(uint256 indexed id, uint256 indexed amount);
    event BristolBlenheimPurchased(uint256 indexed id, uint256 indexed amount);
    event B52MitchellPurchased(uint256 indexed id, uint256 indexed amount);
    event B17gFlyingFortressPurchased(
        uint256 indexed id,
        uint256 indexed amount
    );
    event B52StratofortressPurchased(
        uint256 indexed id,
        uint256 indexed amount
    );
    event B2SpiritPurchased(uint256 indexed id, uint256 indexed amount);
    event B1bLancerPurchased(uint256 indexed id, uint256 indexed amount);
    event TupolevTu160Purchased(uint256 indexed id, uint256 indexed amount);

    event Ah1CobraDecommissioned(uint256 indexed id, uint256 indexed amount);
    event Ah64ApacheDecommissioned(uint256 indexed id, uint256 indexed amount);
    event BristolBlenheimDecommissioned(uint256 indexed id, uint256 indexed amount);
    event B52MitchellDecommissioned(uint256 indexed id, uint256 indexed amount);
    event B17gFlyingFortressDecommissioned(uint256 indexed id, uint256 indexed amount);
    event B52StratofortressDecommissioned(uint256 indexed id, uint256 indexed amount);
    event B2SpiritDecommissioned(uint256 indexed id, uint256 indexed amount);
    event B1bLancerDecommissioned(uint256 indexed id, uint256 indexed amount);
    event TupolevTu160Decommissioned(uint256 indexed id, uint256 indexed amount);

    mapping(uint256 => Bombers) public idToBombers;

    ///@dev this function is only callable from the contact owner
    ///@dev this function will be called right after contract deployment to set contract pointers
    function settings(
        address _countryMinter,
        address _bombersMarket1,
        address _bombersMarket2,
        address _airBattle,
        address _treasuryAddress,
        address _fightersAddress,
        address _infrastructure,
        address _war
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        bombersMarket1 = _bombersMarket1;
        bombersMarket2 = _bombersMarket2;
        airBattle = _airBattle;
        treasury = _treasuryAddress;
        fighters = _fightersAddress;
        infrastructure = _infrastructure;
        war = _war;
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

    modifier onlyAirBattle() {
        require(
            msg.sender == airBattle,
            "function only callable from Air Battle Contract"
        );
        _;
    }

    modifier onlyMarket() {
        require(
            msg.sender == bombersMarket1 || msg.sender == bombersMarket2,
            "this function can only be called by market"
        );
        _;
    }

    ///@dev this function is only callable from the contact owner
    function updateCountryMinterAddress(
        address _countryMinter
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
    }

    ///@dev this function is only callable from the contact owner
    function updateBombersMarketAddresses(
        address _bombersMarket1,
        address _bombersMarket2
    ) public onlyOwner {
        bombersMarket1 = _bombersMarket1;
        bombersMarket2 = _bombersMarket2;
    }

    ///@dev this function is only callable from the contact owner
    function updateAirBattleAddress(address _airBattle) public onlyOwner {
        airBattle = _airBattle;
    }

    ///@dev this function is only callable from the contact owner
    function updateTreasuryAddress(address _treasury) public onlyOwner {
        treasury = _treasury;
    }

    ///@dev this function is only callable from the contact owner
    function updateFightersAddress(address _fighters) public onlyOwner {
        fighters = _fighters;
    }

    ///@dev this function is only callable from the contact owner
    function updateInfrastructureAddress(
        address _infrastructure
    ) public onlyOwner {
        infrastructure = _infrastructure;
    }

    ///@dev this function is only callable from the contact owner
    function updateWarAddress(address _war) public onlyOwner {
        war = _war;
    }

    ///@dev this function is only callable from the country minter contract
    ///@notice this function will initiate a nation to be bale to buy bombers when a nation is minted
    function generateBombers(uint256 id) public onlyCountryMinter {
        Bombers memory newBombers = Bombers(0, 0, 0, 0, 0, 0, 0, 0, 0);
        idToBombers[id] = newBombers;
    }

    ///@notice this function will return the amount of defending AH1 Cobra's of a nation
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending AH1 Cobra aircraft for the nation
    function getAh1CobraCount(uint256 id) public view returns (uint256) {
        uint256 count = idToBombers[id].ah1CobraCount;
        return count;
    }

    ///@dev this function is only callabel from the Bomber marketplace contract
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseAh1CobraCount(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToBombers[id].ah1CobraCount += amount;
        emit Ah1CobraPurchased(id, amount);
    }

    ///@dev this function is only callable from the war contract
    ///@notice this function will decrease the amount of aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseAh1CobraCount(uint256 amount, uint256 id) internal {
        uint256 currentAmount = idToBombers[id].ah1CobraCount;
        if (currentAmount >= amount) {
            idToBombers[id].ah1CobraCount -= amount;
        } else {
            idToBombers[id].ah1CobraCount = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission Ah1Cobras
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapAh1Cobra(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToBombers[id].ah1CobraCount;
        require(currentAmount >= amount, "cannot delete that many");
        idToBombers[id].ah1CobraCount -= amount;
        emit Ah1CobraDecommissioned(id, amount);
    }

    ///@notice this function will return the amount of defending A64Apaches a nation owns
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending A64Apache aircraft for the nation
    function getAh64ApacheCount(uint256 id) public view returns (uint256) {
        uint256 count = idToBombers[id].ah64ApacheCount;
        return count;
    }

    ///@dev this function is only callabel from the Bomber marketplace contract
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseAh64ApacheCount(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToBombers[id].ah64ApacheCount += amount;
        emit Ah64ApachePurchased(id, amount);
    }

    ///@dev this function is only callable from the war contract
    ///@notice this function will decrease the amount of aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseAh64ApacheCount(uint256 amount, uint256 id) internal {
        uint256 currentAmount = idToBombers[id].ah64ApacheCount;
        if (currentAmount >= amount) {
            idToBombers[id].ah64ApacheCount -= amount;
        } else {
            idToBombers[id].ah64ApacheCount = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission Ah64 Apache's
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapAh64Apache(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToBombers[id].ah64ApacheCount;
        require(currentAmount >= amount, "cannot delete that many");
        idToBombers[id].ah64ApacheCount -= amount;
        emit Ah64ApacheDecommissioned(id, amount);
    }

    ///@notice this function will return the amount of defending Bristol Blenheim's a nation owns
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending Bristol Blenheim aircraft for the nation
    function getBristolBlenheimCount(uint256 id) public view returns (uint256) {
        uint256 count = idToBombers[id].bristolBlenheimCount;
        return count;
    }

    ///@dev this function is only callabel from the Bomber marketplace contract
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseBristolBlenheimCount(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToBombers[id].bristolBlenheimCount += amount;
        emit BristolBlenheimPurchased(id, amount);
    }

    ///@dev this function is only callable from the war contract
    ///@notice this function will decrease the amount of aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseBristolBlenheimCount(uint256 amount, uint256 id) internal {
        uint256 currentAmount = idToBombers[id].bristolBlenheimCount;
        if (currentAmount >= amount) {
            idToBombers[id].bristolBlenheimCount -= amount;
        } else {
            idToBombers[id].bristolBlenheimCount = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission Bristol Blenheim's
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapBristolBlenheim(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToBombers[id].bristolBlenheimCount;
        require(currentAmount >= amount, "cannot delete that many");
        idToBombers[id].bristolBlenheimCount -= amount;
        emit BristolBlenheimDecommissioned(id, amount);
    }

    ///@notice this function will return the amount of defending b52 Mitchell's a nation owns
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending b52 Mitchell aircraft for the nation
    function getB52MitchellCount(uint256 id) public view returns (uint256) {
        uint256 count = idToBombers[id].b52MitchellCount;
        return count;
    }

    ///@dev this function is only callabel from the Bomber marketplace contract
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseB52MitchellCount(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToBombers[id].b52MitchellCount += amount;
        emit B52MitchellPurchased(id, amount);
    }

    ///@dev this function is only callable from the war contract
    ///@notice this function will decrease the amount of aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseB52MitchellCount(uint256 amount, uint256 id) internal {
        uint256 currentAmount = idToBombers[id].b52MitchellCount;
        if (currentAmount >= amount) {
            idToBombers[id].b52MitchellCount -= amount;
        } else {
            idToBombers[id].b52MitchellCount = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission B52 Mitchell
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapB52Mitchell(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToBombers[id].b52MitchellCount;
        require(currentAmount >= amount, "cannot delete that many");
        idToBombers[id].b52MitchellCount -= amount;
        emit B52MitchellDecommissioned(id, amount);
    }

    ///@notice this function will return the amount of defending B17's a nation owns
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending B17 aircraft for the nation
    function getB17gFlyingFortressCount(
        uint256 id
    ) public view returns (uint256) {
        uint256 count = idToBombers[id].b17gFlyingFortressCount;
        return count;
    }

    ///@dev this function is only callabel from the Bomber marketplace contract
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseB17gFlyingFortressCount(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToBombers[id].b17gFlyingFortressCount += amount;
        emit B17gFlyingFortressPurchased(id, amount);
    }

    ///@dev this function is only callable from the war contract
    ///@notice this function will decrease the amount of aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseB17gFlyingFortressCount(
        uint256 amount,
        uint256 id
    ) internal {
        uint256 currentAmount = idToBombers[id].b17gFlyingFortressCount;
        if (currentAmount >= amount) {
            idToBombers[id].b17gFlyingFortressCount -= amount;
        } else {
            idToBombers[id].b17gFlyingFortressCount = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission B17 Flying Fortresses
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapB17gFlyingFortress(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToBombers[id].b17gFlyingFortressCount;
        require(currentAmount >= amount, "cannot delete that many");
        idToBombers[id].b17gFlyingFortressCount -= amount;
        emit B17gFlyingFortressDecommissioned(id, amount);
    }

    ///@notice this function will return the amount of defending b52Stratofortresses a nation owns
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending b52Stratofortress aircraft for the nation
    function getB52StratofortressCount(
        uint256 id
    ) public view returns (uint256) {
        uint256 count = idToBombers[id].b52StratofortressCount;
        return count;
    }

    ///@dev this function is only callabel from the Bomber marketplace contract
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseB52StratofortressCount(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToBombers[id].b52StratofortressCount += amount;
        emit B52StratofortressPurchased(id, amount);
    }

    ///@dev this function is only callable from the war contract
    ///@notice this function will decrease the amount of aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseB52StratofortressCount(
        uint256 amount,
        uint256 id
    ) internal {
        uint256 currentAmount = idToBombers[id].b52StratofortressCount;
        if (currentAmount >= amount) {
            idToBombers[id].b52StratofortressCount -= amount;
        } else {
            idToBombers[id].b52StratofortressCount = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission B52 Stratofortresses
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapB52Stratofortress(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToBombers[id].b52StratofortressCount;
        require(currentAmount >= amount, "cannot delete that many");
        idToBombers[id].b52StratofortressCount -= amount;
        emit B52StratofortressDecommissioned(id, amount);
    }

    ///@notice this function will return the amount of defending B2Spirits's a nation owns
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending B2Spirit aircraft for the nation
    function getB2SpiritCount(uint256 id) public view returns (uint256) {
        uint256 count = idToBombers[id].b2SpiritCount;
        return count;
    }

    ///@dev this function is only callabel from the Bomber marketplace contract
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseB2SpiritCount(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToBombers[id].b2SpiritCount += amount;
        emit B2SpiritPurchased(id, amount);
    }

    ///@dev this function is only callable from the war contract
    ///@notice this function will decrease the amount of aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseB2SpiritCount(uint256 amount, uint256 id) internal {
        uint256 currentAmount = idToBombers[id].b2SpiritCount;
        if (currentAmount >= amount) {
            idToBombers[id].b2SpiritCount -= amount;
        } else {
            idToBombers[id].b2SpiritCount = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission B2 Spirit's
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapB2Spirit(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToBombers[id].b2SpiritCount;
        require(currentAmount >= amount, "cannot delete that many");
        idToBombers[id].b2SpiritCount -= amount;
        emit B2SpiritDecommissioned(id, amount);
    }

    ///@notice this function will return the amount of defending B1bLancer's a nation owns
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending B1bLancer aircraft for the nation
    function getB1bLancerCount(uint256 id) public view returns (uint256) {
        uint256 count = idToBombers[id].b1bLancerCount;
        return count;
    }

    ///@dev this function is only callabel from the Bomber marketplace contract
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseB1bLancerCount(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToBombers[id].b1bLancerCount += amount;
        emit B1bLancerPurchased(id, amount);
    }

    ///@dev this function is only callable from the war contract
    ///@notice this function will decrease the amount of aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseB1bLancerCount(uint256 amount, uint256 id) internal {
        uint256 currentAmount = idToBombers[id].b1bLancerCount;
        if (currentAmount >= amount) {
            idToBombers[id].b1bLancerCount -= amount;
        } else {
            idToBombers[id].b1bLancerCount = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission B1B Lancers
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapB1bLancer(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToBombers[id].b1bLancerCount;
        require(currentAmount >= amount, "cannot delete that many");
        idToBombers[id].b1bLancerCount -= amount;
        emit B1bLancerDecommissioned(id, amount);
    }

    ///@notice this function will return the amount of defending Tu160's a nation owns
    ///@param id is the nation ID of the nation
    ///@return uint256 is the number of defending Tu160 aircraft for the nation
    function getTupolevTu160Count(uint256 id) public view returns (uint256) {
        uint256 count = idToBombers[id].tupolevTu160Count;
        return count;
    }

    ///@dev this function is only callabel from the Bomber marketplace contract
    ///@notice this function will increase the number of aircraft when they are purchased in the marketplace
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being purchased
    function increaseTupolevTu160Count(
        uint256 id,
        uint256 amount
    ) public onlyMarket {
        idToBombers[id].tupolevTu160Count += amount;
        emit TupolevTu160Purchased(id, amount);
    }

    ///@dev this function is only callable from the war contract
    ///@notice this function will decrease the amount of aircraft lost in a battle
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function decreaseTupolevTu160Count(uint256 amount, uint256 id) internal {
        uint256 currentAmount = idToBombers[id].tupolevTu160Count;
        if (currentAmount >= amount) {
            idToBombers[id].tupolevTu160Count -= amount;
        } else {
            idToBombers[id].tupolevTu160Count = 0;
        }
    }

    ///@notice this function will allow a nation owner to decommission Tupolev TU160's
    ///@param id is the nation ID of the nation
    ///@param amount is the amount of aircraft being destroyed
    function scrapTupolevTu160(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 currentAmount = idToBombers[id].tupolevTu160Count;
        require(currentAmount >= amount, "cannot delete that many");
        idToBombers[id].tupolevTu160Count -= amount;
        emit TupolevTu160Decommissioned(id, amount);
    }

    function getBomberCount(uint256 id) public view returns (uint256) {
        uint256 count = idToBombers[id].ah1CobraCount +
            idToBombers[id].ah64ApacheCount +
            idToBombers[id].bristolBlenheimCount +
            idToBombers[id].b52MitchellCount +
            idToBombers[id].b17gFlyingFortressCount +
            idToBombers[id].b52StratofortressCount +
            idToBombers[id].b2SpiritCount +
            idToBombers[id].b1bLancerCount +
            idToBombers[id].tupolevTu160Count;
        return count;
    }

    ///@dev this is a public function that is only callable from the Air Battle contract
    ///@notice this function will decrease the amount of fighers lost in battle from the FighersContract
    ///@param losses is an array of uints that represent the fighters that the defender lost in battle
    ///@param id is the nation ID of the defender
    function decrementBomberLosses(
        uint256[] memory losses,
        uint256 id
    ) public onlyAirBattle {
        for (uint256 i; i < losses.length; i++) {
            if (losses[i] == 1) {
                decreaseAh1CobraCount(1, id);
            } else if (losses[i] == 2) {
                decreaseAh64ApacheCount(1, id);
            } else if (losses[i] == 3) {
                decreaseBristolBlenheimCount(1, id);
            } else if (losses[i] == 4) {
                decreaseB52MitchellCount(1, id);
            } else if (losses[i] == 5) {
                decreaseB17gFlyingFortressCount(1, id);
            } else if (losses[i] == 6) {
                decreaseB52StratofortressCount(1, id);
            } else if (losses[i] == 7) {
                decreaseB2SpiritCount(1, id);
            } else if (losses[i] == 8) {
                decreaseB1bLancerCount(1, id);
            } else if (losses[i] == 9) {
                decreaseTupolevTu160Count(1, id);
            }
        }
    }
}

///@title BombersMarketplace1
///@author OxSnosh
///@notice this is the contract that will allow nation owners to purchase AH! Cobras, AH64 Apaches, Bristol Blenheims, B52 Mitchells and B17 Flying Fortresses
contract BombersMarketplace1 is Ownable {
    address public countryMinter;
    address public bombers1;
    address public fighters;
    address public fightersMarket1;
    address public infrastructure;
    address public treasury;
    uint256 public ah1CobraCost = 10000 * (10 ** 18);
    uint256 public ah1CobraRequiredInfrastructure = 100;
    uint256 public ah1CobraRequiredTech = 30;
    uint256 public ah64ApacheCost = 15000 * (10 ** 18);
    uint256 public ah64ApacheRequiredInfrastructure = 200;
    uint256 public ah64ApacheRequiredTech = 65;
    uint256 public bristolBlenheimCost = 20000 * (10 ** 18);
    uint256 public bristolBlenheimRequiredInfrastructure = 300;
    uint256 public bristolBlenheimRequiredTech = 105;
    uint256 public b52MitchellCost = 25000 * (10 ** 18);
    uint256 public b52MitchellRequiredInfrastructure = 400;
    uint256 public b52MitchellRequiredTech = 150;
    uint256 public b17gFlyingFortressCost = 30000 * (10 ** 18);
    uint256 public b17gFlyingFortressRequiredInfrastructure = 500;
    uint256 public b17gFlyingFortressRequiredTech = 200;

    CountryMinter mint;
    FightersContract fight;
    FightersMarketplace1 fightMarket1;
    InfrastructureContract inf;
    TreasuryContract tsy;
    BombersContract bomb1;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _countryMinter,
        address _bombers1,
        address _fighters,
        address _fightersMarket1,
        address _infrastructure,
        address _treasury
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        bombers1 = _bombers1;
        bomb1 = BombersContract(_bombers1);
        fighters = _fighters;
        fight = FightersContract(_fighters);
        fightersMarket1 = _fightersMarket1;
        fightMarket1 = FightersMarketplace1(_fightersMarket1);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
    }

    modifier onlyCountryMinter() {
        require(msg.sender == countryMinter, "only countryMinter can call");
        _;
    }

    ///@dev this function is only callable by the contract owner
    function updateCountryMinterAddress(address newAddress) public onlyOwner {
        countryMinter = newAddress;
        mint = CountryMinter(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateBombers1Address(address newAddress) public onlyOwner {
        bombers1 = newAddress;
        bomb1 = BombersContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateFightersAddress(address newAddress) public onlyOwner {
        fighters = newAddress;
        fight = FightersContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateInfrastructureAddress(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateTreasuryAddress(address newAddress) public onlyOwner {
        treasury = newAddress;
        tsy = TreasuryContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a AH1 Cobra
    function updateAh1CobraSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        ah1CobraCost = newPrice;
        ah1CobraRequiredInfrastructure = newInfra;
        ah1CobraRequiredTech = newTech;
    }

    function getAh1CobraSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            ah1CobraCost,
            ah1CobraRequiredInfrastructure,
            ah1CobraRequiredTech
        );
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a A64 Apache
    function updateAh64ApacheSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        ah64ApacheCost = newPrice;
        ah64ApacheRequiredInfrastructure = newInfra;
        ah64ApacheRequiredTech = newTech;
    }

    function getAh64ApacheSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            ah64ApacheCost,
            ah64ApacheRequiredInfrastructure,
            ah64ApacheRequiredTech
        );
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a Bristol Blenheim
    function updateBristolBlenheimSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        bristolBlenheimCost = newPrice;
        bristolBlenheimRequiredInfrastructure = newInfra;
        bristolBlenheimRequiredTech = newTech;
    }

    function getBristolBlenheimSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            bristolBlenheimCost,
            bristolBlenheimRequiredInfrastructure,
            bristolBlenheimRequiredTech
        );
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a B52 Mitchell
    function updateB52MitchellSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        b52MitchellCost = newPrice;
        b52MitchellRequiredInfrastructure = newInfra;
        b52MitchellRequiredTech = newTech;
    }

    function getB52MitchellSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            b52MitchellCost,
            b52MitchellRequiredInfrastructure,
            b52MitchellRequiredTech
        );
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a B17 Flying Fortress
    function updateB17gFlyingFortressSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        b17gFlyingFortressCost = newPrice;
        b17gFlyingFortressRequiredInfrastructure = newInfra;
        b17gFlyingFortressRequiredTech = newTech;
    }

    function getB17gFlyingFortressSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            b17gFlyingFortressCost,
            b17gFlyingFortressRequiredInfrastructure,
            b17gFlyingFortressRequiredTech
        );
    }

    ///@dev this is a public view function that will allow the caller to purchase an AH1 Cobra for their nation
    ///@notice this function allowes the caller to purchase an AH1 Cobra for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyAh1Cobra(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= ah1CobraRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= ah1CobraRequiredTech, "!enough tech");
        uint256 cost = getAh1CobraCost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseAh1CobraCount(id, amount);
        tsy.spendBalance(id, purchasePrice);
    }

    function getAh1CobraCost(uint256 id) public view returns (uint256) {
        uint256 mod = fightMarket1.getAircraftPurchaseCostModifier(id);
        uint256 cost = ((ah1CobraCost * mod) / 100);
        return cost;
    }

    ///@dev this is a public view function that will allow the caller to purchase an A64 Apache for their nation
    ///@notice this function allowes the caller to purchase an A64 Apache for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyAh64Apache(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= ah64ApacheRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= ah64ApacheRequiredTech, "!enough tech");
        uint256 cost = getAh64ApacheCost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseAh64ApacheCount(id, amount);
        tsy.spendBalance(id, purchasePrice);
    }

    function getAh64ApacheCost(uint256 id) public view returns (uint256) {
        uint256 mod = fightMarket1.getAircraftPurchaseCostModifier(id);
        uint256 cost = ((ah64ApacheCost * mod) / 100);
        return cost;
    }

    ///@dev this is a public view function that will allow the caller to purchase a Bristol Blenheim for their nation
    ///@notice this function allowes the caller to purchase a Bristol Blenheim for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyBristolBlenheim(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= bristolBlenheimRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= bristolBlenheimRequiredTech, "!enough tech");
        uint256 cost = getBristolBlenheimCost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseBristolBlenheimCount(id, amount);
        tsy.spendBalance(id, purchasePrice);
    }

    function getBristolBlenheimCost(uint256 id) public view returns (uint256) {
        uint256 mod = fightMarket1.getAircraftPurchaseCostModifier(id);
        uint256 cost = ((bristolBlenheimCost * mod) / 100);
        return cost;
    }

    ///@dev this is a public view function that will allow the caller to purchase a B52 Mitchell for their nation
    ///@notice this function allowes the caller to purchase a B52 Mitchell for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyB52Mitchell(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= b52MitchellRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= b52MitchellRequiredTech, "!enough tech");
        uint256 cost = getB52MitchellCost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseB52MitchellCount(id, amount);
        tsy.spendBalance(id, purchasePrice);
    }

    function getB52MitchellCost(uint256 id) public view returns (uint256) {
        uint256 mod = fightMarket1.getAircraftPurchaseCostModifier(id);
        uint256 cost = ((b52MitchellCost * mod) / 100);
        return cost;
    }

    ///@dev this is a public view function that will allow the caller to purchase a B17 Flying Fortress for their nation
    ///@notice this function allowes the caller to purchase a B17 Flying Fortress for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyB17gFlyingFortress(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= b17gFlyingFortressRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= b17gFlyingFortressRequiredTech, "!enough tech");
        uint256 cost = getB17gFlyingFortressCost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseB17gFlyingFortressCount(id, amount);
        tsy.spendBalance(id, purchasePrice);
    }

    function getB17gFlyingFortressCost(
        uint256 id
    ) public view returns (uint256) {
        uint256 mod = fightMarket1.getAircraftPurchaseCostModifier(id);
        uint256 cost = ((b17gFlyingFortressCost * mod) / 100);
        return cost;
    }
}

///@title BombersMarketplace2
///@author OxSnosh
///@notice this contract allows nation owners to purchase B52 Stratofortresses, B2 Spirits, B1B Lancers and Tupolev TO160s
contract BombersMarketplace2 is Ownable {
    address public countryMinter;
    address public bombers1;
    address public fighters;
    address public fightersMarket1;
    address public infrastructure;
    address public treasury;
    uint256 public b52StratofortressCost = 35000 * (10 ** 18);
    uint256 public b52StratofortressRequiredInfrastructure = 600;
    uint256 public b52StratofortressRequiredTech = 255;
    uint256 public b2SpiritCost = 40000 * (10 ** 18);
    uint256 public b2SpiritRequiredInfrastructure = 700;
    uint256 public b2SpiritRequiredTech = 315;
    uint256 public b1bLancerCost = 45000 * (10 ** 18);
    uint256 public b1bLancerRequiredInfrastructure = 850;
    uint256 public b1bLancerRequiredTech = 405;
    uint256 public tupolevTu160Cost = 50000 * (10 ** 18);
    uint256 public tupolevTu160RequiredInfrastructure = 1000;
    uint256 public tupolevTu160RequiredTech = 500;

    CountryMinter mint;
    FightersContract fight;
    FightersMarketplace1 fightMarket1;
    InfrastructureContract inf;
    TreasuryContract tsy;
    BombersContract bomb1;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _countryMinter,
        address _bombers1,
        address _fighters,
        address _fightersMarket1,
        address _infrastructure,
        address _treasury
    ) public onlyOwner {
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        bombers1 = _bombers1;
        bomb1 = BombersContract(_bombers1);
        fighters = _fighters;
        fight = FightersContract(_fighters);
        fightersMarket1 = _fightersMarket1;
        fightMarket1 = FightersMarketplace1(_fightersMarket1);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
    }

    modifier onlyCountryMinter() {
        require(msg.sender == countryMinter, "only countryMinter can call");
        _;
    }

    ///@dev this function is only callable by the contract owner
    function updateCountryMinterAddress(address newAddress) public onlyOwner {
        countryMinter = newAddress;
        mint = CountryMinter(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateBombers1Address(address newAddress) public onlyOwner {
        bombers1 = newAddress;
        bomb1 = BombersContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateFightersAddress(address newAddress) public onlyOwner {
        fighters = newAddress;
        fight = FightersContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateInfrastructureAddress(address newAddress) public onlyOwner {
        infrastructure = newAddress;
        inf = InfrastructureContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateTreasuryAddress(address newAddress) public onlyOwner {
        treasury = newAddress;
        tsy = TreasuryContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a B52 Stratofortress
    function updateB52StratofortressSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        b52StratofortressCost = newPrice;
        b52StratofortressRequiredInfrastructure = newInfra;
        b52StratofortressRequiredTech = newTech;
    }

    function getB52StratofortressSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            b52StratofortressCost,
            b52StratofortressRequiredInfrastructure,
            b52StratofortressRequiredTech
        );
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a B2 Spirit
    function updateb2SpiritSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        b2SpiritCost = newPrice;
        b2SpiritRequiredInfrastructure = newInfra;
        b2SpiritRequiredTech = newTech;
    }

    function getb2SpiritSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            b2SpiritCost,
            b2SpiritRequiredInfrastructure,
            b2SpiritRequiredTech
        );
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a B1B Lancer
    function updateB1bLancerSpecs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        b1bLancerCost = newPrice;
        b1bLancerRequiredInfrastructure = newInfra;
        b1bLancerRequiredTech = newTech;
    }

    function getB1bLancerSpecs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            b1bLancerCost,
            b1bLancerRequiredInfrastructure,
            b1bLancerRequiredTech
        );
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a Tupolev TU160
    function updateTupolevTu160Specs(
        uint256 newPrice,
        uint256 newInfra,
        uint256 newTech
    ) public onlyOwner {
        tupolevTu160Cost = newPrice;
        tupolevTu160RequiredInfrastructure = newInfra;
        tupolevTu160RequiredTech = newTech;
    }

    function getTupolevTu160Specs()
        public
        view
        returns (uint256, uint256, uint256)
    {
        return (
            tupolevTu160Cost,
            tupolevTu160RequiredInfrastructure,
            tupolevTu160RequiredTech
        );
    }

    ///@dev this is a public view function that will allow the caller to purchase a B52 Stratofortress for their nation
    ///@notice this function allowes the caller to purchase a B52 Stratofortress for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyB52Stratofortress(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= b52StratofortressRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= b52StratofortressRequiredTech, "!enough tech");
        uint256 cost = getB52StratofortressCost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseB52StratofortressCount(id, amount);
        tsy.spendBalance(id, purchasePrice);
    }

    function getB52StratofortressCost(
        uint256 id
    ) public view returns (uint256) {
        uint256 mod = fightMarket1.getAircraftPurchaseCostModifier(id);
        uint256 cost = ((b52StratofortressCost * mod) / 100);
        return cost;
    }

    ///@dev this is a public view function that will allow the caller to purchase a B2 Spirit for their nation
    ///@notice this function allowes the caller to purchase a B2 Spirit for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyB2Spirit(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= b2SpiritRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= b2SpiritRequiredTech, "!enough tech");
        uint256 cost = getB2SpiritCost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseB2SpiritCount(id, amount);
        tsy.spendBalance(id, purchasePrice);
    }

    function getB2SpiritCost(uint256 id) public view returns (uint256) {
        uint256 mod = fightMarket1.getAircraftPurchaseCostModifier(id);
        uint256 cost = ((b2SpiritCost * mod) / 100);
        return cost;
    }

    ///@dev this is a public view function that will allow the caller to purchase a B1B Lancer for their nation
    ///@notice this function allowes the caller to purchase a B1B Lancer for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyB1bLancer(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= b1bLancerRequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= b1bLancerRequiredTech, "!enough tech");
        uint256 cost = getB1bLancerCost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseB1bLancerCount(id, amount);
        tsy.spendBalance(id, purchasePrice);
    }

    function getB1bLancerCost(uint256 id) public view returns (uint256) {
        uint256 mod = fightMarket1.getAircraftPurchaseCostModifier(id);
        uint256 cost = ((b1bLancerCost * mod) / 100);
        return cost;
    }

    ///@dev this is a public view function that will allow the caller to purchase a Tupolev TU160 for their nation
    ///@notice this function allowes the caller to purchase a Tupolev TU160 for their nation
    ///@param amount specifies the number of aircraft being purchased
    ///@param id is the nation ID
    function buyTupolevTu160(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation ruler");
        uint256 aircraftCount = fight.getAircraftCount(id);
        uint256 maxAircraft = fightMarket1.getMaxAircraftCount(id);
        require((aircraftCount + amount) <= maxAircraft, "too many aircraft");
        uint256 callerInfra = inf.getInfrastructureCount(id);
        require(
            callerInfra >= tupolevTu160RequiredInfrastructure,
            "!enough infrastructure"
        );
        uint256 callerTech = inf.getTechnologyCount(id);
        require(callerTech >= tupolevTu160RequiredTech, "!enough tech");
        uint256 cost = getTupolevTu160Cost(id);
        uint256 purchasePrice = (cost * amount);
        uint256 balance = tsy.checkBalance(id);
        require(balance >= purchasePrice);
        bomb1.increaseTupolevTu160Count(id, amount);
        tsy.spendBalance(id, purchasePrice);
    }

    function getTupolevTu160Cost(uint256 id) public view returns (uint256) {
        uint256 mod = fightMarket1.getAircraftPurchaseCostModifier(id);
        uint256 cost = ((tupolevTu160Cost * mod) / 100);
        return cost;
    }
}
