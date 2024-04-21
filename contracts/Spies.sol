
//SPDX-License-Identifier: Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International
pragma solidity 0.8.17;

import "./Treasury.sol";
import "./Infrastructure.sol";
import "./Resources.sol";
import "./Wonders.sol";
import "./Improvements.sol";
import "./CountryMinter.sol";
import "./War.sol";
import "./NationStrength.sol";
import "./GroundBattle.sol";
import "./KeeperFile.sol";
import "./CountryParameters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract SpyContract is Ownable {
    uint256 public spyCost = 100000;
    address public treasury;
    address public spyOperations;
    address public countryMinter;
    address public improvements2;
    address public wonder1;

    CountryMinter mint;
    ImprovementsContract2 imp2;
    WondersContract1 won1;

    event SpiesPurchased(uint256 indexed id, uint256 indexed amount);

    event SpiesDecommissioned(uint256 indexed id, uint256 indexed amount);

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _spyOperations,
        address _treasury,
        address _countryMinter,
        address _improvements2,
        address _wonders1
    ) public onlyOwner {
        spyOperations = _spyOperations;
        treasury = _treasury;
        countryMinter = _countryMinter;
        mint = CountryMinter(countryMinter);
        improvements2 = _improvements2;
        imp2 = ImprovementsContract2(improvements2);
        wonder1 = _wonders1;
        won1 = WondersContract1(wonder1);
    }

    mapping(uint256 => uint256) public idToSpies;

    modifier onlySpyOperations() {
        require(
            msg.sender == spyOperations,
            "only callable from spy operations contract"
        );
        _;
    }

    ///@dev this is a public function only callable by the nation owner that will purchase spies
    ///@notice this function will allow a natio nowner to purchase spies
    ///@notice you cannot buy more spies than the maximum amount for your nation
    ///@param amount is the amount of spies being purchased
    ///@param id is the nation id of the nation buying spies
    function buySpies(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 maxSpyCount = getMaxSpyCount(id);
        uint256 currentSpyCount = idToSpies[id];
        require(
            (currentSpyCount + amount) <= maxSpyCount,
            "cannot own that many spies"
        );
        uint256 purchasePrice = spyCost * amount;
        uint256 balance = TreasuryContract(treasury).checkBalance(id);
        require(
            balance >= purchasePrice,
            "insufficient balance to purchase spies"
        );
        idToSpies[id] += amount;
        TreasuryContract(treasury).spendBalance(id, purchasePrice);
        emit SpiesPurchased(id, amount);
    }

    function updateSpyPrice(uint256 newCost) public onlyOwner {
        spyCost = newCost;
    }

    function getSpyPrice() public view returns (uint256) {
        return spyCost;
    }

    ///@dev this is a public view function that will return the maximum amount of spies a given country can own
    ///@notice this function will return the maximum amount of spies a nation can own
    ///@notice the base max spy count for a nation is 50
    ///@notice intel agencies will increase the max number of spies by 100
    ///@notice a central intelligence agency wonder will increase the max number of spies by 250
    ///@param id is the nation id for the nation being queried
    ///@return uint256 is the maximum number of spies for a given nation
    function getMaxSpyCount(uint256 id) public view returns (uint256) {
        uint256 maxSpyCount = 50;
        uint256 intelAgencies = imp2.getIntelAgencyCount(id);
        if (intelAgencies > 0) {
            maxSpyCount += (intelAgencies * 100);
        }
        bool cia = won1.getCentralIntelligenceAgency(id);
        if (cia) {
            maxSpyCount += 250;
        }
        return maxSpyCount;
    }

    function decommissionSpies(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 spyCount = idToSpies[id];
        require(
            (spyCount - amount) >= 0,
            "not enough spies to decommission that many"
        );
        idToSpies[id] -= amount;
        emit SpiesDecommissioned(id, amount);
    }

    ///@dev this is a public function only callable from the Spy Contract
    ///@notice this function will allow the spy contract to decrease the number of spies of an nation that is lost by the attacker during a spy attack
    ///@param id is the nation id of the nation losing their spy when the attack fails
    function decreaseAttackerSpyCount(uint256 id) public onlySpyOperations {
        idToSpies[id] -= 1;
    }

    ///@dev this is a public view function that allows the spy contract to decrease the number of spies of a nation in a spy attack
    ///@notice this function will allow the spy contract to decrease the number of spies lost during a spy attack
    ///@param amount is the number of spies lost during the attack
    ///@param id is the nation suffering losses during the spy attack
    function decreaseDefenderSpyCount(
        uint256 amount,
        uint256 id
    ) public onlySpyOperations {
        idToSpies[id] -= amount;
    }

    ///@dev this is a public view function that will return the current spy count for a nation
    ///@notice this function will return a nations current spy count
    ///@param countryId is the nation ID of the nation being queried
    ///@return count is the spy count for a given nation
    function getSpyCount(
        uint256 countryId
    ) public view returns (uint256 count) {
        uint256 spyAmount = idToSpies[countryId];
        return spyAmount;
    }
}