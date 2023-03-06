//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "./IWarBucks.sol";
import "./WarBucks.sol";
import "./Wonders.sol";
import "./Infrastructure.sol";
import "./Forces.sol";
import "./Navy.sol";
import "./Fighters.sol";
import "./CountryMinter.sol";
import "./GroundBattle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

///@title TreasuyContract
///@author OxSnosh
///@dev this contract will allow the game owner to withdraw game revenues from the in game purchases
///@dev this contract inherits from the openzeppelin ownable contract
///@notice this contact will allow a nation owner 
contract TreasuryContract is Ownable {
    uint256 public counter;
    address public wonders1;
    address public wonders2;
    address public wonders3;
    address public wonders4;
    address public improvements1;
    address public improvements2;
    address public improvements3;
    address public improvements4;
    address public infrastructure;
    address public navy;
    address public navy2;
    address public fighters;
    address public bombers;
    address public warBucksAddress;
    address public forces;
    address public missiles;
    address public aid;
    address public taxes;
    address public bills;
    address public spyAddress;
    address public groundBattle;
    address public countryMinter;
    address public spyOperations;
    address public landMarket;
    address public techMarket;
    address public infrastructureMarket;
    address public keeper;
    uint256 public daysToInactive = 22;
    uint256 private gameTaxPercentage = 0;
    uint256 public seedMoney = 2000000*10**18;

    CountryMinter mint;
    GroundBattleContract ground;

    struct Treasury {
        uint256 grossIncomePerCitizenPerDay;
        uint256 individualTaxableIncomePerDay;
        uint256 netDailyTaxesCollectable;
        uint256 netDailyBillsPayable;
        uint256 lockedBalance;
        uint256 daysSinceLastBillPaid;
        uint256 lastTaxCollection;
        uint256 daysSinceLastTaxCollection;
        uint256 balance;
        bool inactive;
    }

    mapping(uint256 => Treasury) public idToTreasury;

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings1(
        address _warBucksAddress,
        address _wonders1,
        address _wonders2,
        address _wonders3,
        address _wonders4,
        address _improvements1,
        address _improvements2,
        address _improvements3,
        address _improvements4,
        address _infrastructure
    ) public onlyOwner {
        warBucksAddress = _warBucksAddress;
        wonders1 = _wonders1;
        wonders1 = _wonders2;
        wonders1 = _wonders3;
        wonders1 = _wonders4;
        improvements1 = _improvements1;
        improvements2 = _improvements2;
        improvements3 = _improvements3;
        improvements4 = _improvements4;
        infrastructure = _infrastructure;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings2(
        address _groundBattle,
        address _countryMinter,
        address _keeper,
        address _forces,
        address _navy,
        address _fighters,
        address _bombers,
        address _aid,
        address _taxes,
        address _bills,
        address _spyAddress
    ) public onlyOwner {
        groundBattle = _groundBattle;
        ground = GroundBattleContract(_groundBattle);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        keeper = _keeper;
        forces = _forces;
        navy = _navy;
        fighters = _fighters;
        bombers = _bombers;
        aid = _aid;
        taxes = _taxes;
        bills = _bills;
        spyAddress = _spyAddress;
    }

    function settings3(
        address _navy2,
        address _missiles,
        address _infrastructureMarket,
        address _landMarket,
        address _techMarket
    ) public onlyOwner {
        navy2 = _navy2;
        missiles = _missiles;
        infrastructureMarket = _infrastructureMarket;
        landMarket = _landMarket;
        techMarket = _techMarket;
    }

    modifier onlyCountryMinter() {
        require(msg.sender == countryMinter, "function only callable from country minter contract");
        _;
    }

    modifier onlyTaxesContract() {
        require(msg.sender == taxes, "only callable from taxes contract");
        _;
    }

    modifier onlySpyContract() {
        require(msg.sender == spyAddress, "only callable from spy contract");
        _;
    }

    modifier onlyBillsContract() {
        require(msg.sender == bills, "only callable from taxes contract");
        _;
    }

    modifier onlyInfrastructure() {
        require(
            msg.sender == infrastructure,
            "only callable from infrastructure contract"
        );
        _;
    }

    modifier onlyKeeper() {
        require(msg.sender == keeper, "function only callable from keeper");
        _;
    }

    modifier approvedSpendCaller() {
        require(msg.sender == bombers ||
            msg.sender == fighters ||
            msg.sender == forces ||
            msg.sender == missiles ||
            msg.sender == navy ||
            msg.sender == navy2 ||
            msg.sender == improvements1 ||
            msg.sender == improvements2 ||
            msg.sender == improvements3 ||
            msg.sender == improvements4 ||
            msg.sender == wonders1 ||
            msg.sender == wonders2 ||
            msg.sender == wonders3 ||
            msg.sender == wonders4 ||
            msg.sender == infrastructureMarket ||
            msg.sender == techMarket ||
            msg.sender == landMarket ||
            msg.sender == spyOperations, "cannot call spendBalance()"
        );
        _;
    }

    ///@dev this function is only callable from the country minter contract
    ///@notice this function will be called when a nation is minted and will allow a nation to undergo treasury operations
    ///@param id is the nation id of the nation being minted
    function generateTreasury(uint256 id) public onlyCountryMinter {
        Treasury memory newTreasury = Treasury(
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            1,
            0,
            false
        );
        idToTreasury[id] = newTreasury;
        idToTreasury[id].balance += seedMoney;
        counter++;
    }

    ///@dev this function is only callable by the taxes contract
    ///@dev this function will increase a nations balance when taxes are collected
    ///@param id this is the nation id of the country collecting taxes
    ///@param amount this is the amount of taxes being collected
    function increaseBalanceOnTaxCollection(uint256 id, uint256 amount)
        public
        onlyTaxesContract
    {
        idToTreasury[id].balance += amount;
        idToTreasury[id].daysSinceLastTaxCollection = 0;
    }

    ///@dev this function is only callable from the bills contract
    ///@dev this function will decrease a nations balance when bils are paid
    ///@param id is the nation id of the nation paying bills
    ///@param amount is the amount of bills being paid
    function decreaseBalanceOnBillsPaid(uint256 id, uint256 amount)
        public
        onlyBillsContract
    {
        require(idToTreasury[id].balance >= amount, "balance not high enough to pay bills");
        idToTreasury[id].balance -= amount;
        idToTreasury[id].daysSinceLastBillPaid = 0;
        idToTreasury[id].inactive = false;
    }

    ///@dev this function is public but only callable by contracts within the game where funds are being spent
    ///@dev this function will decrease a nation owner's balance when money is spent within the game
    ///@notice this function will decrease a nation owner's balance when money is spent within the game
    ///@param id is the nation id of the nation spending funds
    ///@param cost is the cost of the expense
    function spendBalance(uint256 id, uint256 cost) public approvedSpendCaller {
        //need a way to only allow the nation owner to do this
        uint256 balance = idToTreasury[id].balance;
        require(balance >= cost, "insufficient balance");
        idToTreasury[id].balance -= cost;
        //TAXES here
        uint256 taxLevied = ((cost * gameTaxPercentage) / 100);
        if (taxLevied > 0) {
            IWarBucks(warBucksAddress).mintFromTreasury(
                address(this),
                taxLevied
            );
        }
    }

    ///@dev this function will show the balance of warbucks within the contract
    ///@dev when money is spent within the game it can be taxed an deposited within this contract
    function viewTaxRevenues() public view returns (uint256) {
        return (WarBucks(warBucksAddress).balanceOf(address(this)));
    }

    ///@dev when money is spent within the game it can be taxed an deposited within this contract
    ///@dev this function will allow the contract owner to withdraw the warbucks from this contract into the owners wallet
    function withdrawTaxRevenues(uint256 amount) public onlyOwner {
        WarBucks(warBucksAddress).approve(address(this), amount);
        WarBucks(warBucksAddress).transferFrom(address(this), msg.sender, amount);
    }

    ///@dev this function is only callable from the infrastructure contract
    ///@dev this function will compensate a nation when they sell land, tech or infrastructure
    function returnBalance(uint256 id, uint256 cost) public onlyInfrastructure {
        //need a way to only allow the nation owner to do this
        idToTreasury[id].balance += cost;
    }

    modifier onlyAidContract() {
        require(msg.sender == aid);
        _;
    }

    ///@dev this function is only callable from the aid contract
    ///@dev this function will send the balance in an aid package from the sender nation to the recipient nation
    ///@param idSender is the sender of an aid package
    ///@param idRecipient is the recipient of an aid package
    ///@param amount is the amount of balance being included in the aid package
    function sendAidBalance(
        uint256 idSender,
        uint256 idRecipient,
        uint256 amount
    ) public onlyAidContract {
        uint256 balance = idToTreasury[idSender].balance;
        require(balance >= amount, "not enough balance");
        idToTreasury[idSender].balance -= amount;
        idToTreasury[idRecipient].balance += amount;
    }

    modifier onlyGroundBattle() {
        require(
            msg.sender == groundBattle,
            "function only callable from ground battle"
        );
        _;
    }

    ///@dev this function is only callable from the ground battle contract
    ///@dev this function will transfer the balance lost in a ground battle to the winning nation
    ///@param randomNumber is the amount of balance being transferred
    ///@param attackerId is the nation id of the attacking nation
    ///@param defenderId is the nation id of the defending nation
    function transferSpoils(
        uint256 randomNumber,
        uint256 battleId,
        uint256 attackerId,
        uint256 defenderId
    ) public onlyGroundBattle {
        uint256 defenderBalance = idToTreasury[defenderId].balance;
        ( , , , , uint256 defenderSoldierLosses, uint256 defenderTankLosses) = ground.returnBattleResults(battleId);
        uint256 maximumFundsToTransfer = ((defenderSoldierLosses * 4) + (defenderTankLosses * 150));
        uint256 fundsToTransfer = ((defenderBalance * randomNumber) / 100);
        if(fundsToTransfer >= maximumFundsToTransfer) {
            fundsToTransfer = maximumFundsToTransfer;
        }
        if (fundsToTransfer < 1000000) {
            idToTreasury[attackerId].balance += fundsToTransfer;
        } else {
            idToTreasury[attackerId].balance += 1000000;
        }
    }

    ///@dev this function is only callable from a nation owner
    ///@dev this function allows a nation owner to withdraw funds from their nation
    ///@notice this function allows a nation owner to withdraw funds from their nation
    ///@param amount is the amount of funds being withdrawn
    ///@param id is the nation id of the nation withdrawing funds
    function withdrawFunds(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 daysSince = idToTreasury[id].daysSinceLastBillPaid;
        require (daysSince == 0, "pay bills before withdrawing funds");
        uint256 gameBalance = idToTreasury[id].balance;
        require(gameBalance >= amount, "insufficient game balance");
        idToTreasury[id].balance -= amount;
        IWarBucks(warBucksAddress).mintFromTreasury(msg.sender, amount);
    }

    ///@dev this function is only callable from a nation owner
    ///@dev this function allows a nation owner to add funds to their nation
    ///@notice this function allows a nation owner to add funds to their nation
    ///@param amount is the amount of funds being added
    ///@param id is the nation id of the nation withdrawing funds
    function addFunds(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 coinBalance = IWarBucks(warBucksAddress).balanceOf(msg.sender);
        require(
            coinBalance >= amount,
            "deposit amount exceeds balance in wallet"
        );
        idToTreasury[id].balance += amount;
        IWarBucks(warBucksAddress).burnFromTreasury(msg.sender, amount);
    }

    ///@dev ths function is only callable from the keeper contract
    ///@dev this function will increment the number of days since bills wre paid and taxes were collected
    ///@notice this function will increment the number of days since bills wre paid and taxes were collected
    ///@notice if a nation does not pay thir bills for a set amount of time (default is 20 days) the nation will be put into inactive mode
    function incrementDaysSince() external onlyKeeper {
        uint256 i;
        for (i = 0; i < counter; i++) {
            idToTreasury[i].daysSinceLastBillPaid++;
            idToTreasury[i].daysSinceLastTaxCollection++;
            if (idToTreasury[i].daysSinceLastBillPaid > daysToInactive) {
                idToTreasury[i].inactive == true;
            }
        }
    }

    ///@dev this function allows the contract owner to set the tax rate in game purchases are taxed at
    ///@dev the tax rate will be the % of the purchase price that is minted into this contract that can be withdrawn later
    function setGameTaxRate(uint256 newPercentage) public onlyOwner {
        gameTaxPercentage = newPercentage;
    }

    ///@dev this funtion will reuturn the game tax rate
    ///@return uint256 will be the tax rate at which purchases in the game are taxed at
    function getGameTaxRate() public view onlyOwner returns (uint256) {
        return gameTaxPercentage;
    }

    ///@dev this function is only callable from the contract owner
    ///@dev this function will allow the contract owner to set the number of days a nation cannot pay bill until it becomes inactive
    ///@notice this function will allow the contract owner to set the number of days a nation cannot pay bill until it becomes inactive
    function setDaysToInactive(uint256 newDays) public onlyOwner {
        daysToInactive = newDays;
    }

    ///@dev this funtion is a public view function that will return the number of days it has been since a nation has collected taxes
    ///@notice this funtion will return the number of days it has been since a nation has collected taxes
    ///@param id is the nation id of the nation being queried
    ///@return uint256 is the number of days since a nation has collected taxes
    function getDaysSinceLastTaxCollection(uint256 id)
        public
        view
        returns (uint256)
    {
        return idToTreasury[id].daysSinceLastTaxCollection;
    }

    ///@dev this funtion is a public view function that will return the number of days it has been since a nation has paid bills
    ///@notice this funtion will return the number of days it has been since a nation has paid bills
    ///@param id is the nation id of the nation being queried
    ///@return uint256 is the number of days since a nation has paid bills
    function getDaysSinceLastBillsPaid(uint256 id)
        public
        view
        returns (uint256)
    {
        return idToTreasury[id].daysSinceLastBillPaid;
    }

    ///@dev this is a public view function that will return a nations in game balance
    ///@notice this function will return a given nations in game balance
    ///@param id is the nation id of the nation being queries
    ///@return uint256 is the balance of war bucks for the nation
    function checkBalance(uint256 id) public view returns (uint256) {
        return idToTreasury[id].balance;
    }

    ///@dev this function is only callable from the spy contract
    ///@dev this function will allow the spy contract to transfer a nations balance to an attacking nation upon a successful spy attack
    ///@param toId is the nation id of the nation recieving the balance (attacking nation)
    ///@param fromId is the nation id of the nation recieving the balance (receiving nation)
    ///@param amount is the amount of balance being transferred
    function transferBalance(
        uint256 toId,
        uint256 fromId,
        uint256 amount
    ) public onlySpyContract {
        idToTreasury[toId].balance += amount;
        idToTreasury[fromId].balance -= amount;
    }

    ///@dev this is a public view function that will return if a nation is inactive
    ///@notice this function will retun if a nation is inactive
    ///@param id is the nation id of the nation being queried
    ///@return bool will be true if the nation is inactive
    function checkInactive(uint256 id) public view returns (bool) {
        return idToTreasury[id].inactive;
    }
}
