//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

import "./Treasury.sol";
import "./Infrastructure.sol";
import "./Improvements.sol";
import "./Forces.sol";
import "./CountryMinter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

///@title WondersContract1
///@author OxSnosh
///@dev this contract inherits from openzeppelin's ownable contract
///@notice this contract will strore information about a nations wonders
contract WondersContract1 is Ownable {
    address public treasuryAddress;
    address public wondersContract2Address;
    address public wondersContract3Address;
    address public wondersContract4Address;
    address public infrastructureAddress;
    address public countryMinter;
    uint256 public agricultureDevelopmentCost = 30000000 * (10**18);
    uint256 public antiAirDefenseNetworkCost = 50000000 * (10**18);
    uint256 public centralIntelligenceAgencyCost = 40000000 * (10**18);
    uint256 public disasterReliefAgencyCost = 40000000 * (10**18);
    uint256 public empWeaponizationCost = 200000000 * (10**18);
    uint256 public falloutShelterSystemCost = 40000000 * (10**18);
    uint256 public federalAidCommissionCost = 25000000 * (10**18);
    uint256 public federalReserveCost = 100000000 * (10**18);
    uint256 public foreignAirForceBaseCost = 35000000 * (10**18);
    uint256 public foreignArmyBaseCost = 200000000 * (10**18);
    uint256 public foreignNavalBaseCost = 200000000 * (10**18);

    CountryMinter mint;

    struct Wonders1 {
        uint256 wonderCount;
        //Agriculture Development Program
        //$30,000,000
        //DONE //Increases land size by 15%
        //DONE //Increases citizen income +$2.00,
        //Increases the citizen-bonus for land from 0.2 to 0.5.
        //Requires 3,000 land purchased, 500 technology.
        bool agricultureDevelopmentProgram;
        //Anti-Air Defense Network
        //$50,000,000
        //Reduces odds of incoming aircraft attacks against your nation -25%.
        //DONE //Reduces aircraft attack damages against your nation -15%.
        bool antiAirDefenseNetwork;
        //Central Intelligence Agency
        //$40,000,000
        //DONE //Increases the number of spies that your nation can support +250 and
        //DONE //increases your nation's spy attack strength +10%.
        //Only viewable by the user who owns it.
        bool centralIntelligenceAgency;
        //Disaster Relief Agency
        //$40,000,000
        //The disaster relief agency helps restore your nation and its people after emergency situations
        //DONE //Increases population +3%
        //DONE //and opens one extra foreign aid slot.
        bool disasterReliefAgency;
        //EMP Weaponization
        //$200,000,000 + (Nation Strength * 2,000)
        //Provides attackers with 5,000 or more technology the option to launch a targeted EMP nuclear attack.
        //DONE //Nuclear weapons can target higher infrastructure, higher land, or higher technology damage based on player choice when launching nukes.
        //When you choose to target infrastructure, land, or technology you are trading more damage to your target for less damage for the other two.
        //For instance, if you choose to target infrastructure you will do more base damage to infrastructure but less damage to land and technology.
        //Requires 5,000 technology and a Weapons Research Complex to purchase.
        bool empWeaponization;
        //Fallout Shelter System
        //$40,000,000
        //DONE //Allows 50% of your defending soldiers to survive a nuclear strike
        //(Does not prevent nuclear Anarchy but does prevent troops from being totally depleted),
        //DONE (not aircraft) //Reduces tank, cruise missile, and aircraft, losses from a nuclear strike by -25%,
        //DONE //Reduces nuclear vulnerable navy losses by 12%,
        //Reduces nuclear anarchy effects by 1 day.
        //Requires 6,000 infrastructure, 2,000 technology.
        bool falloutShelterSystem;
        //Federal Aid Commission
        //$25,000,000
        //DONE //Raises the cap on foreign money aid +50% provided that the foreign aid recipient also has a Federal Aid Commission wonder.
        //Allows two nations with the Federal Aid Commission wonder to send secret foreign aid.
        //Secret foreign aid costs the sender 200% the value of the items that are sent.
        bool federalAidCommission;
        //Federal Reserve
        //$100,000,000 + (Nation Strength * 1,000)
        //DONE //Increases the number of banks that can be purchased +2.
        //Requires Stock Market.
        bool federalReserve;
        //Foreign Air Force Base -
        //$35,000,000 -
        //DONE //Raises the aircraft limit +20 for your nation and
        //increases the number of aircraft that can be sent in each attack mission +20.
        bool foreignAirForceBase;
        //Foreign Army Base -
        //$200,000,000 -
        //DONE //Adds an extra +1 offensive war slot.
        //Requires 8,000 technology to purchase.
        bool foreignArmyBase;
        //Foreign Naval Base -
        //$200,000,000 -
        //DONE //Allows +2 naval vessels to be purchased per day (+1 in Peace Mode)
        //and also allows +1 naval deployment per day.
        //Requires 20,000 infrastructure.
        bool foreignNavalBase;
    }

    mapping(uint256 => Wonders1) public idToWonders1;

    event Wonder1Purchased(
        uint256 indexed id,
        uint256 indexed wonderId
    );

    event Wonder1Deleted(
        uint256 indexed id,
        uint256 indexed wonderId
    );

    modifier approvedAddress() {
        require(
            msg.sender == wondersContract2Address ||
                msg.sender == wondersContract3Address ||
                msg.sender == wondersContract4Address,
            "Unable to call"
        );
        _;
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "only callable from countryMinter"
        );
        _;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _treasuryAddress,
        address _wonderContract2Address,
        address _wonderContract3Address,
        address _wonderContract4Address,
        address _infrastructureAddress,
        address _countryMinter
    ) public onlyOwner {
        treasuryAddress = _treasuryAddress;
        wondersContract2Address = _wonderContract2Address;
        wondersContract3Address = _wonderContract3Address;
        wondersContract4Address = _wonderContract4Address;
        infrastructureAddress = _infrastructureAddress;
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
    }

    ///@dev this is a public view function that will return the number of wonders a given nation owns
    ///@notice this function will return the number of wonders a given nation owns
    ///@param id is the nation id of the nation being queried
    ///@return count is the number of wonder a given nation owns
    function getWonderCount(uint256 id) public view returns (uint256 count) {
        count = idToWonders1[id].wonderCount;
        return count;
    }

    ///@dev this function is only callable from other wonder contracts
    ///@dev this function will increment the number of wonders a nation owns when a wonder is purchased in another contract
    function addWonderCount(uint256 id) public approvedAddress {
        idToWonders1[id].wonderCount += 1;
    }

    ///@dev this function is only callable from other wonder contracts
    ///@dev this function will decremeny the number of wonders a nation owns when a wonder is deleted in another contract
    function subtractWonderCount(uint256 id) public approvedAddress {
        idToWonders1[id].wonderCount -= 1;
    }

    ///@dev this function is only callable from the country minter contract
    ///@notice this function will be called when a nation is minted and allow a nation to buy the wonders in this contract
    function generateWonders1(uint256 id) public onlyCountryMinter {
        Wonders1 memory newWonders1 = Wonders1(
            0,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        );
        idToWonders1[id] = newWonders1;
    }

    
    ///@dev this function is only callable by the contract owner
    function updateAgricultureDevelopmentCost(
        uint256 newPrice
    ) public onlyOwner {
        agricultureDevelopmentCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateAntiAirDefenseNetworkCost(
        uint256 newPrice
    ) public onlyOwner {
        antiAirDefenseNetworkCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateCentralIntelligenceAgencyCost(
        uint256 newPrice
    ) public onlyOwner {
        centralIntelligenceAgencyCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateDisasterReliefAgencyCost(uint256 newPrice) public onlyOwner {
        disasterReliefAgencyCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateEmpWeaponizationCost(uint256 newPrice) public onlyOwner {
        empWeaponizationCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateFalloutShelterSystemCost(uint256 newPrice) public onlyOwner {
        falloutShelterSystemCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateFederalAidCommissionCost(uint256 newPrice) public onlyOwner {
        federalAidCommissionCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateFederalReserveCost(uint256 newPrice) public onlyOwner {
        federalReserveCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateForeignAirForceBaseCost(uint256 newPrice) public onlyOwner {
        foreignAirForceBaseCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateForeignArmyBaseCost(uint256 newPrice) public onlyOwner {
        foreignArmyBaseCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateForeignNavalBaseCost(uint256 newPrice) public onlyOwner {
        foreignNavalBaseCost = newPrice;
    }

    ///@dev this function is only callable from a nation owner and allows a nation to purchase the wonders in this contract
    ///@notice this function allows a nation owner to purchase the wonders in this contract
    ///@param countryId is the nationId of the country purchasing a wonder
    /**@param wonderId is the id of the wonder
     * 1. agricultrual development program
     * 2. air defense network
     * 3. central intelligence agency
     * 4. disaster relief agency
     * 5. emp weaponization
     * 6. fallout shelter system 
     * 7. federal aid commission
     * 8. federal reserve
     * 9. foreign air force base
     * 10. foreign army base
     * 11. foreign naval base
    */
    function buyWonder1(uint256 countryId, uint256 wonderId) public {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        require(wonderId <= 11, "Invalid wonder ID");
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(
            countryId
        );
        if (wonderId == 1) {
            require(
                balance >= agricultureDevelopmentCost,
                "Insufficient balance"
            );
            bool existingWonder = idToWonders1[countryId]
                .agricultureDevelopmentProgram;
            require(existingWonder == false, "Already owned");
            uint256 techAmount = InfrastructureContract(infrastructureAddress)
                .getTechnologyCount(countryId);
            require(techAmount >= 500, "Requires 500 Tech");
            uint256 landAmount = InfrastructureContract(infrastructureAddress)
                .getLandCount(countryId);
            require(landAmount >= 3000, "Requires 3000 Land");
            idToWonders1[countryId].agricultureDevelopmentProgram = true;
            idToWonders1[countryId].wonderCount += 1;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                agricultureDevelopmentCost
            );
        } else if (wonderId == 2) {
            require(
                balance >= antiAirDefenseNetworkCost,
                "Insufficient balance"
            );
            bool existingWonder = idToWonders1[countryId].antiAirDefenseNetwork;
            require(existingWonder == false, "Already owned");
            idToWonders1[countryId].antiAirDefenseNetwork = true;
            idToWonders1[countryId].wonderCount += 1;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                antiAirDefenseNetworkCost
            );
        } else if (wonderId == 3) {
            require(
                balance >= centralIntelligenceAgencyCost,
                "Insufficient balance"
            );
            bool existingWonder = idToWonders1[countryId]
                .centralIntelligenceAgency;
            require(existingWonder == false, "Already owned");
            idToWonders1[countryId].centralIntelligenceAgency = true;
            idToWonders1[countryId].wonderCount += 1;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                centralIntelligenceAgencyCost
            );
        } else if (wonderId == 4) {
            require(
                balance >= disasterReliefAgencyCost,
                "Insufficient balance"
            );
            bool existingWonder = idToWonders1[countryId].disasterReliefAgency;
            require(existingWonder == false, "Already owned");
            idToWonders1[countryId].disasterReliefAgency = true;
            idToWonders1[countryId].wonderCount += 1;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                disasterReliefAgencyCost
            );
        } else if (wonderId == 5) {
            require(balance >= empWeaponizationCost, "Insufficient balance");
            bool existingWonder = idToWonders1[countryId].empWeaponization;
            require(existingWonder == false, "Already owned");
            bool isWrcThere = WondersContract4(wondersContract4Address)
                .getWeaponsResearchCenter(countryId);
            require(
                isWrcThere == true,
                "Must own Weapons Research Center to purchase"
            );
            uint256 techAmount = InfrastructureContract(infrastructureAddress)
                .getTechnologyCount(countryId);
            require(
                techAmount >= 5000,
                "Must have 5000 Technology to purchase"
            );
            idToWonders1[countryId].empWeaponization = true;
            idToWonders1[countryId].wonderCount += 1;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                empWeaponizationCost
            );
        } else if (wonderId == 6) {
            require(
                balance >= falloutShelterSystemCost,
                "Insufficient balance"
            );
            bool existingWonder = idToWonders1[countryId].falloutShelterSystem;
            require(existingWonder == false, "Already owned");
            uint256 infrastructureAmount = InfrastructureContract(
                infrastructureAddress
            ).getInfrastructureCount(countryId);
            require(
                infrastructureAmount >= 6000,
                "Requires 6000 Infrastructure to purchase"
            );
            uint256 technologyAmount = InfrastructureContract(
                infrastructureAddress
            ).getTechnologyCount(countryId);
            require(technologyAmount >= 2000, "Requires 2000 Tech to purchase");
            idToWonders1[countryId].falloutShelterSystem = true;
            idToWonders1[countryId].wonderCount += 1;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                falloutShelterSystemCost
            );
        } else if (wonderId == 7) {
            require(
                balance >= federalAidCommissionCost,
                "Insufficient balance"
            );
            bool existingWonder = idToWonders1[countryId].federalAidCommission;
            require(existingWonder == false, "Already owned");
            idToWonders1[countryId].federalAidCommission = true;
            idToWonders1[countryId].wonderCount += 1;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                federalAidCommissionCost
            );
        } else if (wonderId == 8) {
            require(balance >= federalReserveCost, "Insufficient balance");
            bool existingWonder = idToWonders1[countryId].federalReserve;
            require(existingWonder == false, "Already owned");
            bool isStockMarket = WondersContract4(wondersContract4Address)
                .getStockMarket(countryId);
            require(
                isStockMarket == true,
                "Required to own stock market to purchase"
            );
            idToWonders1[countryId].federalReserve = true;
            idToWonders1[countryId].wonderCount += 1;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                federalReserveCost
            );
        } else if (wonderId == 9) {
            require(balance >= foreignAirForceBaseCost, "Insufficient balance");
            bool existingWonder = idToWonders1[countryId].foreignAirForceBase;
            require(existingWonder == false, "Already owned");
            idToWonders1[countryId].foreignAirForceBase = true;
            idToWonders1[countryId].wonderCount += 1;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                foreignAirForceBaseCost
            );
        } else if (wonderId == 10) {
            require(balance >= foreignArmyBaseCost, "Insufficient balance");
            bool existingWonder = idToWonders1[countryId].foreignArmyBase;
            require(existingWonder == false, "Already owned");
            uint256 techAmount = InfrastructureContract(infrastructureAddress)
                .getTechnologyCount(countryId);
            require(
                techAmount >= 8000,
                "Must have 8000 Technology to purchase"
            );
            idToWonders1[countryId].foreignArmyBase = true;
            idToWonders1[countryId].wonderCount += 1;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                foreignArmyBaseCost
            );
        } else {
            require(balance >= foreignNavalBaseCost, "Insufficient balance");
            bool existingWonder = idToWonders1[countryId].foreignNavalBase;
            require(existingWonder == false, "Already owned");
            uint256 infrastructureAmount = InfrastructureContract(
                infrastructureAddress
            ).getInfrastructureCount(countryId);
            require(
                infrastructureAmount >= 20000,
                "Requires 20000 infrastructure to purchase"
            );
            idToWonders1[countryId].foreignNavalBase = true;
            idToWonders1[countryId].wonderCount += 1;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                foreignNavalBaseCost
            );
        }
        emit Wonder1Purchased(countryId, wonderId);
    }

    ///@dev this function will allow a nation owner to delete a wonder
    ///@dev this function is only callable by a nation owner
    ///@notice this funtion will allow a nation owner to delete a wonder
    ///@param countryId is the nation deleting the woner
    /**@param wonderId is the id of the wonder
     * 1. agricultrual development program
     * 2. air defense network
     * 3. central intelligence agency
     * 4. disaster relief agency
     * 5. emp weaponization
     * 6. fallout shelter system 
     * 7. federal aid commission
     * 8. federal reserve
     * 9. foreign air force base
     * 10. foreign army base
     * 11. foreign naval base
    */
    function deleteWonder1(uint256 countryId, uint256 wonderId) public {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        require(wonderId <= 11, "Invalid wonder ID");
        if (wonderId == 1) {
            bool existingWonder = idToWonders1[countryId]
                .agricultureDevelopmentProgram;
            require(existingWonder == true, "No wonder to delete");
            idToWonders1[countryId].agricultureDevelopmentProgram = false;
            idToWonders1[countryId].wonderCount -= 1;
        } else if (wonderId == 2) {
            bool existingWonder = idToWonders1[countryId].antiAirDefenseNetwork;
            require(existingWonder == true, "No wonder to delete");
            idToWonders1[countryId].antiAirDefenseNetwork = false;
            idToWonders1[countryId].wonderCount -= 1;
        } else if (wonderId == 3) {
            bool existingWonder = idToWonders1[countryId]
                .centralIntelligenceAgency;
            require(existingWonder == true, "No wonder to delete");
            idToWonders1[countryId].centralIntelligenceAgency = false;
            idToWonders1[countryId].wonderCount -= 1;
        } else if (wonderId == 4) {
            bool existingWonder = idToWonders1[countryId].disasterReliefAgency;
            require(existingWonder == true, "No wonder to delete");
            idToWonders1[countryId].disasterReliefAgency = false;
            idToWonders1[countryId].wonderCount -= 1;
        } else if (wonderId == 5) {
            bool existingWonder = idToWonders1[countryId].empWeaponization;
            require(existingWonder == true, "No wonder to delete");
            idToWonders1[countryId].empWeaponization = false;
            idToWonders1[countryId].wonderCount -= 1;
        } else if (wonderId == 6) {
            bool existingWonder = idToWonders1[countryId].falloutShelterSystem;
            require(existingWonder == true, "No wonder to delete");
            idToWonders1[countryId].falloutShelterSystem = false;
            idToWonders1[countryId].wonderCount -= 1;
        } else if (wonderId == 7) {
            bool existingWonder = idToWonders1[countryId].federalAidCommission;
            require(existingWonder == true, "No wonder to delete");
            idToWonders1[countryId].federalAidCommission = false;
            idToWonders1[countryId].wonderCount -= 1;
        } else if (wonderId == 8) {
            bool existingWonder = idToWonders1[countryId].federalReserve;
            require(existingWonder == true, "No wonder to delete");
            idToWonders1[countryId].federalReserve = false;
            idToWonders1[countryId].wonderCount -= 1;
        } else if (wonderId == 9) {
            bool existingWonder = idToWonders1[countryId].foreignAirForceBase;
            require(existingWonder == true, "No wonder to delete");
            idToWonders1[countryId].foreignAirForceBase = false;
            idToWonders1[countryId].wonderCount -= 1;
        } else if (wonderId == 10) {
            bool existingWonder = idToWonders1[countryId].foreignArmyBase;
            require(existingWonder == true, "No wonder to delete");
            idToWonders1[countryId].foreignArmyBase = false;
            idToWonders1[countryId].wonderCount -= 1;
        } else {
            bool existingWonder = idToWonders1[countryId].foreignNavalBase;
            require(existingWonder == true, "No wonder to delete");
            idToWonders1[countryId].foreignNavalBase = false;
            idToWonders1[countryId].wonderCount -= 1;
        }
        emit Wonder1Deleted(countryId, wonderId);
    }

    ///@dev this is a public view function that will return true if a nation has the agriculture development program wonder
    ///@dev this function will return true if a nation has the agriculture development program wonder
    ///@param id is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getAgriculturalDevelopmentProgram(
        uint256 id
    ) public view returns (bool) {
        return idToWonders1[id].agricultureDevelopmentProgram;
    }

    ///@dev this is a public view function that will return true if a nation has the anti air defense network wonder
    ///@dev this function will return true if a nation has the anti air defense network wonder
    ///@param id is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getAntiAirDefenseNewtwork(uint256 id) public view returns (bool) {
        return idToWonders1[id].antiAirDefenseNetwork;
    }

    ///@dev this is a public view function that will return true if a nation has the central intelligence agency wonder
    ///@dev this function will return true if a nation has the central intelligence agency wonder
    ///@param id is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getCentralIntelligenceAgency(
        uint256 id
    ) public view returns (bool) {
        return idToWonders1[id].centralIntelligenceAgency;
    }

    ///@dev this is a public view function that will return true if a nation has the disaster relief agency wonder
    ///@dev this function will return true if a nation has the disaster relief agency wonder
    ///@param id is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getDisasterReliefAgency(uint256 id) public view returns (bool) {
        return idToWonders1[id].disasterReliefAgency;
    }

    ///@dev this is a public view function that will return true if a nation has the emp weaponization wonder
    ///@dev this function will return true if a nation has the emp weaponization wonder
    ///@param id is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getEmpWeaponization(uint256 id) public view returns (bool) {
        return idToWonders1[id].empWeaponization;
    }

    ///@dev this is a public view function that will return true if a nation has the fallout shelter system wonder
    ///@dev this function will return true if a nation has the fallout shelter system wonder
    ///@param id is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getFalloutShelterSystem(uint256 id) public view returns (bool) {
        return idToWonders1[id].falloutShelterSystem;
    }

    ///@dev this is a public view function that will return true if a nation has the federal aig commission wonder
    ///@dev this function will return true if a nation has the federal aig commission wonder
    ///@param id is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getFederalAidComission(uint256 id) public view returns (bool) {
        return idToWonders1[id].federalAidCommission;
    }

    ///@dev this is a public view function that will return true if a nation has the federal reserve wonder
    ///@dev this function will return true if a nation has the federal reserve wonder
    ///@param id is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getFederalReserve(uint256 id) public view returns (bool) {
        return idToWonders1[id].federalReserve;
    }

    ///@dev this is a public view function that will return true if a nation has the foreign air force base wonder
    ///@dev this function will return true if a nation has the foreign air force base wonder
    ///@param id is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getForeignAirforceBase(uint256 id) public view returns (bool) {
        return idToWonders1[id].foreignAirForceBase;
    }

    ///@dev this is a public view function that will return true if a nation has the foreign army base wonder
    ///@dev this function will return true if a nation has the foreign army base wonder
    ///@param id is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getForeignArmyBase(uint256 id) public view returns (bool) {
        return idToWonders1[id].foreignArmyBase;
    }

    ///@dev this is a public view function that will return true if a nation has the foreign naval base wonder
    ///@dev this function will return true if a nation has the foreign naval base wonder
    ///@param id is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getForeignNavalBase(uint256 id) public view returns (bool) {
        return idToWonders1[id].foreignNavalBase;
    }

    ///@dev this function will return the costs of the wonders in this contract
    function getWonderCosts1()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            agricultureDevelopmentCost,
            antiAirDefenseNetworkCost,
            centralIntelligenceAgencyCost,
            disasterReliefAgencyCost,
            empWeaponizationCost,
            falloutShelterSystemCost,
            federalAidCommissionCost,
            federalReserveCost,
            foreignAirForceBaseCost,
            foreignArmyBaseCost,
            foreignNavalBaseCost
        );
    }
}

///@title WondersContract2
///@author OxSnosh
///@dev this contract inherits from openzeppelin's ownable contract
///@notice this contract will strore information about a nations wonders
contract WondersContract2 is Ownable {
    address public treasuryAddress;
    address public infrastructureAddress;
    address public wonderContract1Address;
    address public wonderContract3Address;
    address public wonderContract4Address;
    address public countryMinter;
    uint256 public greatMonumentCost = 35000000 * (10**18);
    uint256 public greatTempleCost = 35000000 * (10**18);
    uint256 public greatUniversityCost = 35000000 * (10**18);
    uint256 public hiddenNuclearMissileSiloCost = 30000000 * (10**18);
    uint256 public interceptorMissileSystemCost = 50000000 * (10**18);
    uint256 public internetCost = 35000000 * (10**18);
    uint256 public interstateSystemCost = 45000000 * (10**18);
    uint256 public manhattanProjectCost = 100000000 * (10**18);
    uint256 public miningIndustryConsortiumCost = 25000000 * (10**18);

    CountryMinter mint;

    struct Wonders2 {
        //Great Monument -
        //$35,000,000 -
        //DONE //The great monument is a testament to your great leadership.
        //DONE //Increases happiness +4 and your population will always be happy with your government choice.
        bool greatMonument;
        //Great Temple -
        //$35,000,000 -
        //DONE //The great temple is a dedicated shrine to your national religion.
        //DONE //Increases happiness +5 and your population will always be happy with your religion choice.
        bool greatTemple;
        //Great University -
        //$35,000,000 -
        //The great university is a central location for scholars within your nation.
        //DONE //Decreases technology costs -10% and
        //DONE //increases population happiness +.2% (+2 for every 1000) of your nation's technology level over 200 up to 3,000 tech.
        bool greatUniversity;
        //Hidden Nuclear Missile Silo -
        //$30,000,000 -
        //DONE //Allows your nation to develop +5 nuclear missiles that cannot be destroyed in spy attacks.
        //(Nations must first be nuclear capable in order to purchase nukes.)
        bool hiddenNuclearMissileSilo;
        //Interceptor Missile System (IMS) -
        //$50,000,000 -
        //DONE //Thwarts Cruise Missile Attacks, 50% of the time (removes 1 attackers CM strike chance for that day when successful).
        //Requires 5,000 technology and a Strategic Defense Initiative (SDI).
        bool interceptorMissileSystem;
        //Internet -
        //$35,000,000 -
        //DONE //Provides Internet infrastructure throughout your nation.
        //Increases population happiness +5.
        bool internet;
        //Interstate System -
        //$45,000,000 -
        //The interstate system allows goods and materials to be transported throughout your nation with greater ease.
        //DONE //Decreases initial infrastructure cost -8% and
        //DONE //decreases infrastructure upkeep costs -8%.
        bool interstateSystem;
        //Manhattan Project -
        //$100,000,000 -
        //DONE //The Manhattan Project allows nations below (150k strength) 5% of the top nations in the game to develop nuclear weapons.
        //The Manhattan Project cannot be destroyed once it is created.
        //The wonder requires 3,000 infrastructure, 300 technology, and a uranium resource.
        bool manhattanProject;
        //Mining Industry Consortium -
        //$25,000,000 -
        //DONE //Increases population income by $2.00 for the resources Coal, Lead, Oil, Uranium that your nation has access to.
        //Requires 5,000 infrastructure, 3,000 land purchased, 1,000 technology.
        bool miningIndustryConsortium;
    }

    mapping(uint256 => Wonders2) public idToWonders2;

    event Wonder2Purchased(uint256 indexed countryId, uint256 indexed wonderId);
    event Wonder2Deleted(uint256 indexed countryId, uint256 indexed wonderId);

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _treasury,
        address _infrastructure,
        address _wonders1,
        address _wonders3,
        address _wonders4,
        address _countryMinter
    ) public onlyOwner {
        treasuryAddress = _treasury;
        infrastructureAddress = _infrastructure;
        wonderContract1Address = _wonders1;
        wonderContract3Address = _wonders3;
        wonderContract4Address = _wonders4;
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "only callable from countryMinter"
        );
        _;
    }

    ///@dev this function is only callable from the country minter contract
    ///@notice this function will be called when a nation is minted and allow a nation to buy the wonders in this contract
    function generateWonders2(uint256 id) public onlyCountryMinter {
        Wonders2 memory newWonders2 = Wonders2(
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        );
        idToWonders2[id] = newWonders2;
    }

    ///@dev this function is only callable by the contract owner
    function updateGreatMonumentCost(uint256 newPrice) public onlyOwner {
        greatMonumentCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateGreatTempleCost(uint256 newPrice) public onlyOwner {
        greatTempleCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateGreatUniversityCost(uint256 newPrice) public onlyOwner {
        greatUniversityCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateHiddenNuclearMissileSiloCost(
        uint256 newPrice
    ) public onlyOwner {
        hiddenNuclearMissileSiloCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateInterceptorMissileSystemCost(
        uint256 newPrice
    ) public onlyOwner {
        interceptorMissileSystemCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateInternetCost(uint256 newPrice) public onlyOwner {
        internetCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateInterstateSystemCost(uint256 newPrice) public onlyOwner {
        interstateSystemCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateManhattanProjectCost(uint256 newPrice) public onlyOwner {
        manhattanProjectCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateMiningIndustryConsortiumCost(
        uint256 newPrice
    ) public onlyOwner {
        miningIndustryConsortiumCost = newPrice;
    }

    ///@dev this function is only callable from a nation owner and allows a nation to purchase the wonders in this contract
    ///@notice this function allows a nation owner to purchase the wonders in this contract
    ///@param countryId is the nationId of the country purchasing a wonder
    /**@param wonderId is the id of the wonder
     * 1. great monumnet
     * 2. great temple
     * 3. great university
     * 4. hidden nuclear missile silo
     * 5. interceptor missile system
     * 6. internat
     * 7. interstate system
     * 8. manhattan project
     * 9. minimg industry consortium
    */
    function buyWonder2(uint256 countryId, uint256 wonderId) public {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        require(wonderId <= 9, "Invalid wonder ID");
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(
            countryId
        );
        if (wonderId == 1) {
            require(balance >= greatMonumentCost, "Insufficient balance");
            bool existingWonder = idToWonders2[countryId].greatMonument;
            require(existingWonder == false, "Already owned");
            idToWonders2[countryId].greatMonument = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                greatMonumentCost
            );
        } else if (wonderId == 2) {
            require(balance >= greatTempleCost, "Insufficient balance");
            bool existingWonder = idToWonders2[countryId].greatTemple;
            require(existingWonder == false, "Already owned");
            idToWonders2[countryId].greatTemple = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                greatTempleCost
            );
        } else if (wonderId == 3) {
            require(balance >= greatUniversityCost, "Insufficient balance");
            bool existingWonder = idToWonders2[countryId].greatUniversity;
            require(existingWonder == false, "Already owned");
            idToWonders2[countryId].greatUniversity = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                greatUniversityCost
            );
        } else if (wonderId == 4) {
            require(
                balance >= hiddenNuclearMissileSiloCost,
                "Insufficient balance"
            );
            bool existingWonder = idToWonders2[countryId]
                .hiddenNuclearMissileSilo;
            require(existingWonder == false, "Already owned");
            idToWonders2[countryId].hiddenNuclearMissileSilo = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                hiddenNuclearMissileSiloCost
            );
        } else if (wonderId == 5) {
            require(
                balance >= interceptorMissileSystemCost,
                "Insufficient balance"
            );
            bool existingWonder = idToWonders2[countryId]
                .interceptorMissileSystem;
            require(existingWonder == false, "Already owned");
            bool strategicDefenseInitiative = WondersContract4(
                wonderContract4Address
            ).getStrategicDefenseInitiative(countryId);
            require(
                strategicDefenseInitiative == true,
                "Strategic Defense Inititive required to purchase"
            );
            uint256 techAmount = InfrastructureContract(infrastructureAddress)
                .getTechnologyCount(countryId);
            require(
                techAmount >= 5000,
                "Must have 5000 Technology to purchase"
            );
            idToWonders2[countryId].interceptorMissileSystem = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                interceptorMissileSystemCost
            );
        } else if (wonderId == 6) {
            require(balance >= internetCost, "Insufficient balance");
            bool existingWonder = idToWonders2[countryId].internet;
            require(existingWonder == false, "Already owned");
            idToWonders2[countryId].internet = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                internetCost
            );
        } else if (wonderId == 7) {
            require(balance >= interstateSystemCost, "Insufficient balance");
            bool existingWonder = idToWonders2[countryId].interstateSystem;
            require(existingWonder == false, "Already owned");
            idToWonders2[countryId].interstateSystem = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                interstateSystemCost
            );
        } else if (wonderId == 8) {
            require(balance >= manhattanProjectCost, "Insufficient balance");
            bool existingWonder = idToWonders2[countryId].manhattanProject;
            require(existingWonder == false, "Already owned");
            //require uranium
            uint256 infrastructureAmount = InfrastructureContract(
                infrastructureAddress
            ).getInfrastructureCount(countryId);
            require(
                infrastructureAmount >= 3000,
                "Requires 3000 infrastructure to purchase"
            );
            uint256 techAmount = InfrastructureContract(infrastructureAddress)
                .getTechnologyCount(countryId);
            require(techAmount >= 300, "Must have 300 Technology to purchase");
            idToWonders2[countryId].manhattanProject = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                manhattanProjectCost
            );
        } else {
            require(
                balance >= miningIndustryConsortiumCost,
                "Insufficient balance"
            );
            bool existingWonder = idToWonders2[countryId]
                .miningIndustryConsortium;
            require(existingWonder == false, "Already owned");
            uint256 techAmount = InfrastructureContract(infrastructureAddress)
                .getTechnologyCount(countryId);
            require(
                techAmount >= 1000,
                "Must have 1000 Technology to purchase"
            );
            uint256 infrastructureAmount = InfrastructureContract(
                infrastructureAddress
            ).getInfrastructureCount(countryId);
            require(
                infrastructureAmount >= 5000,
                "Must have 5000 Infrastructure to purchase"
            );
            uint256 landAmount = InfrastructureContract(infrastructureAddress)
                .getLandCount(countryId);
            require(landAmount >= 3000, "Must have 3000 Land to purchase");
            idToWonders2[countryId].miningIndustryConsortium = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                miningIndustryConsortiumCost
            );
        }
        emit Wonder2Purchased(countryId, wonderId);
    }

    ///@dev this function will allow a nation owner to delete a wonder
    ///@dev this function is only callable by a nation owner
    ///@notice this funtion will allow a nation owner to delete a wonder
    ///@param countryId is the nation deleting the woner
    /**@param wonderId is the id of the wonder
     * 1. great monumnet
     * 2. great temple
     * 3. great university
     * 4. hidden nuclear missile silo
     * 5. interceptor missile system
     * 6. internat
     * 7. interstate system
     * 8. manhattan project
     * 9. minimg industry consortium
    */
    function deleteWonder2(uint256 countryId, uint256 wonderId) public {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        require(wonderId <= 9, "Invalid wonder ID");
        if (wonderId == 1) {
            bool existingWonder = idToWonders2[countryId].greatMonument;
            require(existingWonder == true, "No wonder to delete");
            idToWonders2[countryId].greatMonument = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 2) {
            bool existingWonder = idToWonders2[countryId].greatTemple;
            require(existingWonder == true, "No wonder to delete");
            idToWonders2[countryId].greatTemple = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 3) {
            bool existingWonder = idToWonders2[countryId].greatUniversity;
            require(existingWonder == true, "No wonder to delete");
            idToWonders2[countryId].greatUniversity = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 4) {
            bool existingWonder = idToWonders2[countryId]
                .hiddenNuclearMissileSilo;
            require(existingWonder == true, "No wonder to delete");
            idToWonders2[countryId].hiddenNuclearMissileSilo = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 5) {
            bool existingWonder = idToWonders2[countryId]
                .interceptorMissileSystem;
            require(existingWonder == true, "No wonder to delete");
            idToWonders2[countryId].interceptorMissileSystem = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 6) {
            bool existingWonder = idToWonders2[countryId].internet;
            require(existingWonder == true, "No wonder to delete");
            idToWonders2[countryId].internet = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 7) {
            bool existingWonder = idToWonders2[countryId].interstateSystem;
            require(existingWonder == true, "No wonder to delete");
            idToWonders2[countryId].interstateSystem = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 8) {
            // unable to delete Manhattan Project once purchased
            // bool existingWonder = idToWonders2[countryId].manhattanProject;
            // require(existingWonder == true, "No wonder to delete");
            // idToWonders2[countryId].manhattanProject = false;
            // WondersContract1(wonderContract1Address).subtractWonderCount(
            //     countryId
            // );
            revert("Unable to delete Manhattan Project");
        } else {
            bool existingWonder = idToWonders2[countryId]
                .miningIndustryConsortium;
            require(existingWonder == true, "No wonder to delete");
            idToWonders2[countryId].miningIndustryConsortium = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        }
        emit Wonder2Deleted(countryId, wonderId);
    }

    ///@dev this is a public view function that will return true if a nation has the great monument wonder
    ///@dev this function will return true if a nation has the great monument wonder
    ///@param id is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getGreatMonument(uint256 id) public view returns (bool) {
        return idToWonders2[id].greatMonument;
    }

    ///@dev this is a public view function that will return true if a nation has the great temple wonder
    ///@dev this function will return true if a nation has the great temple wonder
    ///@param id is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getGreatTemple(uint256 id) public view returns (bool) {
        return idToWonders2[id].greatTemple;
    }

    ///@dev this is a public view function that will return true if a nation has the great university wonder
    ///@dev this function will return true if a nation has the great university wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getGreatUniversity(uint256 countryId) public view returns (bool) {
        return idToWonders2[countryId].greatUniversity;
    }

    ///@dev this is a public view function that will return true if a nation has the hidden nuclear missile silo wonder
    ///@dev this function will return true if a nation has the hidden nuclear missile silo wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getHiddenNuclearMissileSilo(
        uint256 countryId
    ) public view returns (bool) {
        return idToWonders2[countryId].hiddenNuclearMissileSilo;
    }

    ///@dev this is a public view function that will return true if a nation has the intereptor missile system wonder
    ///@dev this function will return true if a nation has the intereptor missile system wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getInterceptorMissileSystem(
        uint256 countryId
    ) public view returns (bool) {
        return idToWonders2[countryId].interceptorMissileSystem;
    }

    ///@dev this is a public view function that will return true if a nation has the internet wonder
    ///@dev this function will return true if a nation has the internet wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getInternet(uint256 countryId) public view returns (bool) {
        return idToWonders2[countryId].internet;
    }

    ///@dev this is a public view function that will return true if a nation has the interstate system wonder
    ///@dev this function will return true if a nation has the interstate system wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getInterstateSystem(uint256 countryId) public view returns (bool) {
        return idToWonders2[countryId].interstateSystem;
    }

    ///@dev this is a public view function that will return true if a nation has the manhattan project wonder
    ///@dev this function will return true if a nation has the manhattan project wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getManhattanProject(uint256 countryId) public view returns (bool) {
        return idToWonders2[countryId].manhattanProject;
    }

    ///@dev this is a public view function that will return true if a nation has the mining industry consortium wonder
    ///@dev this function will return true if a nation has the mining industry consortium wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getMiningIndustryConsortium(
        uint256 countryId
    ) public view returns (bool) {
        return idToWonders2[countryId].miningIndustryConsortium;
    }

    ///@dev this function will return the costs of the wonders in this contract
    function getWonderCosts2() public view returns(
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256
    ) {
        return (
            greatMonumentCost,
            greatTempleCost,
            greatUniversityCost,
            hiddenNuclearMissileSiloCost,
            interceptorMissileSystemCost,
            internetCost,
            interstateSystemCost,
            manhattanProjectCost,
            miningIndustryConsortiumCost
        );
    }
}

///@title WondersContract3
///@author OxSnosh
///@dev this contract inherits from openzeppelin's ownable contract
///@notice this contract will strore information about a nations wonders
contract WondersContract3 is Ownable {
    address public treasuryAddress;
    address public infrastructureAddress;
    address public wonderContract1Address;
    address public wonderContract2Address;
    address public wonderContract4Address;
    address public forces;
    address public countryMinter;
    uint256 public movieIndustryCost = 26000000 * (10**18);
    uint256 public nationalCemetaryCost = 150000000 * (10**18);
    uint256 public nationalEnvironmentOfficeCost = 100000000 * (10**18);
    uint256 public nationalResearchLabCost = 35000000 * (10**18);
    uint256 public nationalWarMemorialCost = 27000000 * (10**18);
    uint256 public nuclearPowerPlantCost = 75000000 * (10**18);
    uint256 public pentagonCost = 30000000 * (10**18);
    uint256 public politicalLobbyistsCost = 50000000 * (10**18);
    uint256 public scientificDevelopmentCenterCost = 150000000 * (10**18);

    ForcesContract frc;
    CountryMinter mint;

    struct Wonders3 {
        //Movie Industry -
        //$26,000,000 -
        //The movie industry provides a great source of entertainment to your people.
        //DONE //Increases population happiness +3.
        bool movieIndustry;
        //National Cemetery -
        //$150,000,000 -
        //DONE //Provides +0.20 Happiness per 1,000,000 soldier casualties up to +5 happiness.
        //Requires 5 million soldier casualties and a National War Memorial.
        bool nationalCemetary;
        //National Environment Office -
        //$100,000,000 -
        //DONE //The national environment office removes the penalties for Coal, Oil, and Uranium,
        //DONE //improves environment by 1 point,
        //DONE //increases population +3%,
        //DONE //and reduces infrastructure upkeep -3%.
        //Requires 13,000 infrastructure.
        bool nationalEnvironmentOffice;
        //National Research Lab -
        //$35,000,000 -
        //The national research lab is a central location for scientists seeking cures for common diseases among your population.
        //DONE //Increases population +5% and
        //DONE //decreases technology costs -3%.
        bool nationalResearchLab;
        //National War Memorial -
        //$27,000,000 -
        //The war memorial allows your citizens to remember its fallen soldiers.
        //This wonder is only available to nations that have lost over 50,000 soldiers during war throughout the life of your nation.
        //DONE //Increases population happiness +4.
        bool nationalWarMemorial;
        //Nuclear Power Plant -
        //$75,000,000 -
        //The nuclear power plant allows nations to receive Uranium financial bonus
        //DONE //(+$3 citizen income +$0.15 per technology level up to 30 technology levels. Requires an active Uranium trade.)
        //even when maintaining nuclear weaponry.
        //DONE //The nuclear power plant by itself, even without a Uranium trade, reduces infrastructure upkeep -5%,
        //DONE //national wonder upkeep -5%,
        //DONE //and improvement upkeep -5%.
        //Requires 12,000 infrastructure, 1,000 technology, and a Uranium resource to build.
        //Nations that develop the Nuclear Power Plant must keep their government position on nuclear weapons set to option 2 or 3.
        bool nuclearPowerPlant;
        //Pentagon -
        //$30,000,000 -
        //The Pentagon serves as your nation's headquarters for military operations.
        //DONE //Increases attacking and defending ground battle strength +20%.
        bool pentagon;
        //Political Lobbyists -
        //$50,000,000 -
        //DONE //Your vote counts as two votes in your team's senate.
        //Must be re-purchased every time you switch teams.
        bool politicalLobbyists;
        //Scientific Development Center -
        //$150,000,000 -
        //DONE //The scientific development center increases the productivity of your factories from
        //DONE //-8% infrastructure cost to -10% infrastructure cost,
        //DONE //increases the productivity of your universities from
        //DONE //+8% citizen income to +10% citizen income,
        //DONE //allows the Great University to give its technology happiness bonus up to 5,000 technology levels
        //DONE //(+2 happiness each 1,000 technology levels).
        //Requires 14,000 infrastructure, 3,000 technology, Great University, National Research Lab.
        bool scientificDevelopmentCenter;
    }

    mapping(uint256 => Wonders3) public idToWonders3;

    event Wonder3Purchased(uint256 indexed countryId, uint256 indexed wonderId);
    event Wonder3Deleted(uint256 indexed countryId, uint256 indexed wonderId);

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _treasuryAddress,
        address _infrastructureAddress,
        address _forces,
        address _wonders1,
        address _wonders2,
        address _wonders4,
        address _countryMinter
    ) public onlyOwner {
        treasuryAddress = _treasuryAddress;
        infrastructureAddress = _infrastructureAddress;
        forces = _forces;
        frc = ForcesContract(_forces);
        wonderContract1Address = _wonders1;
        wonderContract2Address = _wonders2;
        wonderContract4Address = _wonders4;
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "only callable from countryMinter"
        );
        _;
    }

    ///@dev this function is only callable from the country minter contract
    ///@notice this function will be called when a nation is minted and allow a nation to buy the wonders in this contract
    function generateWonders3(uint256 id) public onlyCountryMinter {
        Wonders3 memory newWonders3 = Wonders3(
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        );
        idToWonders3[id] = newWonders3;
    }

    ///@dev this function is only callable by the contract owner
    function updateMovieIndustryCost(uint256 newPrice) public onlyOwner {
        movieIndustryCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateNationalCemetaryCost(uint256 newPrice) public onlyOwner {
        nationalCemetaryCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateNationalEnvironmentOfficeCost(uint256 newPrice)
        public
        onlyOwner
    {
        nationalEnvironmentOfficeCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateNationalResearchLabCost(uint256 newPrice) public onlyOwner {
        nationalResearchLabCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateNationalWarMemorialCost(uint256 newPrice) public onlyOwner {
        nationalWarMemorialCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateNuclearPowerPlantCost(uint256 newPrice) public onlyOwner {
        nuclearPowerPlantCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updatePentagonCost(uint256 newPrice) public onlyOwner {
        pentagonCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updatePoliticalLobbyistsCost(uint256 newPrice) public onlyOwner {
        politicalLobbyistsCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateScientificDevelopmentCenterCost(uint256 newPrice)
        public
        onlyOwner
    {
        scientificDevelopmentCenterCost = newPrice;
    }

    ///@dev this function is only callable from a nation owner and allows a nation to purchase the wonders in this contract
    ///@notice this function allows a nation owner to purchase the wonders in this contract
    ///@param countryId is the nationId of the country purchasing a wonder
    /**@param wonderId is the id of the wonder
     * 1. movie industry
     * 2. national cemetary
     * 3. national environmental office
     * 4. national research lab
     * 5. national war memorial
     * 6. nuclear power plant
     * 7. pentagon
     * 8. political lobbyists
     * 9. scientific development center
    */
    function buyWonder3(uint256 countryId, uint256 wonderId) public {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        require(wonderId <= 9, "Invalid wonder ID");
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(
            countryId
        );
        if (wonderId == 1) {
            require(balance >= movieIndustryCost, "Insufficient balance");
            bool existingWonder = idToWonders3[countryId].movieIndustry;
            require(existingWonder == false, "Already owned");
            idToWonders3[countryId].movieIndustry = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                movieIndustryCost
            );
        } else if (wonderId == 2) {
            require(balance >= nationalCemetaryCost, "Insufficient balance");
            bool existingWonder = idToWonders3[countryId].nationalCemetary;
            require(existingWonder == false, "Already owned");
            (uint256 casualties , ) = frc.getCasualties(countryId);
            require(casualties >= 5000000, "not enough casualties to purchase");
            bool nationalWarMemorial = idToWonders3[countryId]
                .nationalWarMemorial;
            require(
                nationalWarMemorial == true,
                "Must own National War Memorial wonder to purchase"
            );
            idToWonders3[countryId].nationalCemetary = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                nationalCemetaryCost
            );
        } else if (wonderId == 3) {
            require(
                balance >= nationalEnvironmentOfficeCost,
                "Insufficient balance"
            );
            bool existingWonder = idToWonders3[countryId]
                .nationalEnvironmentOffice;
            require(existingWonder == false, "Already owned");
            uint256 infrastructureAmount = InfrastructureContract(
                infrastructureAddress
            ).getInfrastructureCount(countryId);
            require(
                infrastructureAmount >= 13000,
                "Requires 13000 infrastructure to purchase"
            );
            idToWonders3[countryId].nationalEnvironmentOffice = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                nationalEnvironmentOfficeCost
            );
        } else if (wonderId == 4) {
            require(balance >= nationalResearchLabCost, "Insufficient balance");
            bool existingWonder = idToWonders3[countryId].nationalResearchLab;
            require(existingWonder == false, "Already owned");
            idToWonders3[countryId].nationalResearchLab = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                nationalResearchLabCost
            );
        } else if (wonderId == 5) {
            require(balance >= nationalWarMemorialCost, "Insufficient balance");
            bool existingWonder = idToWonders3[countryId].nationalWarMemorial;
            require(existingWonder == false, "Already owned");
            (uint256 casualties , ) = frc.getCasualties(countryId);
            require(casualties >= 50000, "not enough casualties");
            idToWonders3[countryId].nationalWarMemorial = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                nationalWarMemorialCost
            );
        } else if (wonderId == 6) {
            require(balance >= nuclearPowerPlantCost, "Insufficient balance");
            bool existingWonder = idToWonders3[countryId].nuclearPowerPlant;
            require(existingWonder == false, "Already owned");
            uint256 techAmount = InfrastructureContract(infrastructureAddress)
                .getTechnologyCount(countryId);
            require(
                techAmount >= 1000,
                "Must have 1000 Technology to purchase"
            );
            uint256 infrastructureAmount = InfrastructureContract(
                infrastructureAddress
            ).getInfrastructureCount(countryId);
            require(
                infrastructureAmount >= 12000,
                "Must have 12000 Infrastructure to purchase"
            );
            //require Uranium
            idToWonders3[countryId].nuclearPowerPlant = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                nuclearPowerPlantCost
            );
        } else if (wonderId == 7) {
            require(balance >= pentagonCost, "Insufficient balance");
            bool existingWonder = idToWonders3[countryId].pentagon;
            require(existingWonder == false, "Already owned");
            idToWonders3[countryId].pentagon = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                pentagonCost
            );
        } else if (wonderId == 8) {
            require(balance >= politicalLobbyistsCost, "Insufficient balance");
            bool existingWonder = idToWonders3[countryId].politicalLobbyists;
            require(existingWonder == false, "Already owned");
            idToWonders3[countryId].politicalLobbyists = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                politicalLobbyistsCost
            );
        } else {
            require(
                balance >= scientificDevelopmentCenterCost,
                "Insufficient balance"
            );
            bool existingWonder = idToWonders3[countryId]
                .scientificDevelopmentCenter;
            require(existingWonder == false, "Already owned");
            uint256 techAmount = InfrastructureContract(infrastructureAddress)
                .getTechnologyCount(countryId);
            require(
                techAmount >= 3000,
                "Must have 3000 Technology to purchase"
            );
            uint256 infrastructureAmount = InfrastructureContract(
                infrastructureAddress
            ).getInfrastructureCount(countryId);
            require(
                infrastructureAmount >= 14000,
                "Must have 14000 Infrastructure to purchase"
            );
            bool isGreatUniversity = WondersContract2(wonderContract2Address)
                .getGreatUniversity(countryId);
            require(
                isGreatUniversity == true,
                "Great University required to purchase"
            );
            bool isNationalResearchLab = idToWonders3[countryId]
                .nationalResearchLab;
            require(
                isNationalResearchLab == true,
                "National Research Lab required to purchase"
            );
            idToWonders3[countryId].scientificDevelopmentCenter = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                scientificDevelopmentCenterCost
            );
        }
        emit Wonder3Purchased(countryId, wonderId);
    }

    ///@dev this function will allow a nation owner to delete a wonder
    ///@dev this function is only callable by a nation owner
    ///@notice this funtion will allow a nation owner to delete a wonder
    ///@param countryId is the nation deleting the woner
    /**@param wonderId is the id of the wonder
     * 1. movie industry
     * 2. national cemetary
     * 3. national environmental office
     * 4. national research lab
     * 5. national war memorial
     * 6. nuclear power plant
     * 7. pentagon
     * 8. political lobbyists
     * 9. scientific development center
    */
    function deleteWonder3(uint256 countryId, uint256 wonderId) public {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        require(wonderId <= 9, "Invalid wonder ID");
        if (wonderId == 1) {
            bool existingWonder = idToWonders3[countryId].movieIndustry;
            require(existingWonder == true, "No wonder to delete");
            idToWonders3[countryId].movieIndustry = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 2) {
            bool existingWonder = idToWonders3[countryId].nationalCemetary;
            require(existingWonder == true, "No wonder to delete");
            idToWonders3[countryId].nationalCemetary = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 3) {
            bool existingWonder = idToWonders3[countryId]
                .nationalEnvironmentOffice;
            require(existingWonder == true, "No wonder to delete");
            idToWonders3[countryId].nationalEnvironmentOffice = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 4) {
            bool existingWonder = idToWonders3[countryId].nationalResearchLab;
            require(existingWonder == true, "No wonder to delete");
            idToWonders3[countryId].nationalResearchLab = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 5) {
            bool existingWonder = idToWonders3[countryId].nationalWarMemorial;
            require(existingWonder == true, "No wonder to delete");
            idToWonders3[countryId].nationalWarMemorial = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 6) {
            bool existingWonder = idToWonders3[countryId].nuclearPowerPlant;
            require(existingWonder == true, "No wonder to delete");
            idToWonders3[countryId].nuclearPowerPlant = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 7) {
            bool existingWonder = idToWonders3[countryId].pentagon;
            require(existingWonder == true, "No wonder to delete");
            idToWonders3[countryId].pentagon = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 8) {
            bool existingWonder = idToWonders3[countryId].politicalLobbyists;
            require(existingWonder == true, "No wonder to delete");
            idToWonders3[countryId].politicalLobbyists = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else {
            bool existingWonder = idToWonders3[countryId]
                .scientificDevelopmentCenter;
            require(existingWonder == true, "No wonder to delete");
            idToWonders3[countryId].scientificDevelopmentCenter = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        }
        emit Wonder3Deleted(countryId, wonderId);
    }

    ///@dev this is a public view function that will return true if a nation has the movie industry wonder
    ///@dev this function will return true if a nation has the movie industry wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getMovieIndustry(uint256 countryId) public view returns (bool) {
        return idToWonders3[countryId].movieIndustry;
    }

    ///@dev this is a public view function that will return true if a nation has the national cemetary wonder
    ///@dev this function will return true if a nation has the national cemetary wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getNationalCemetary(uint256 countryId) public view returns (bool) {
        return idToWonders3[countryId].nationalCemetary;
    }

    ///@dev this is a public view function that will return true if a nation has the national environmental office wonder
    ///@dev this function will return true if a nation has the national environmental office wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getNationalEnvironmentOffice(
        uint256 countryId
    ) public view returns (bool) {
        return idToWonders3[countryId].nationalEnvironmentOffice;
    }

    ///@dev this is a public view function that will return true if a nation has the national research lab wonder
    ///@dev this function will return true if a nation has the national research lab wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getNationalResearchLab(
        uint256 countryId
    ) public view returns (bool) {
        return idToWonders3[countryId].nationalResearchLab;
    }

    ///@dev this is a public view function that will return true if a nation has the national war memorial wonder
    ///@dev this function will return true if a nation has the national war memorial wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getNationalWarMemorial(
        uint256 countryId
    ) public view returns (bool) {
        return idToWonders3[countryId].nationalWarMemorial;
    }

    ///@dev this is a public view function that will return true if a nation has the nuclear power plant wonder
    ///@dev this function will return true if a nation has the nuclear power plant wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getNuclearPowerPlant(
        uint256 countryId
    ) public view returns (bool) {
        return idToWonders3[countryId].nuclearPowerPlant;
    }

    ///@dev this is a public view function that will return true if a nation has the pentagon wonder
    ///@dev this function will return true if a nation has the pentagon wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getPentagon(uint256 countryId) public view returns (bool) {
        return idToWonders3[countryId].pentagon;
    }

    ///@dev this is a public view function that will return true if a nation has the political lobbyists wonder
    ///@dev this function will return true if a nation has the political lobbyists wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getPoliticalLobbyists(
        uint256 countryId
    ) public view returns (bool) {
        return idToWonders3[countryId].politicalLobbyists;
    }

    ///@dev this is a public view function that will return true if a nation has the scientific development center wonder
    ///@dev this function will return true if a nation has the scientific development center wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getScientificDevelopmentCenter(
        uint256 countryId
    ) public view returns (bool) {
        return idToWonders3[countryId].scientificDevelopmentCenter;
    }

    ///@dev this function will return the costs of the wonders in this contract
    function getWonderCosts3() public view returns(
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256
    ) {
        return (
            movieIndustryCost,
            nationalCemetaryCost,
            nationalEnvironmentOfficeCost,
            nationalResearchLabCost,
            nationalWarMemorialCost,
            nuclearPowerPlantCost,
            pentagonCost,
            politicalLobbyistsCost,
            scientificDevelopmentCenterCost
        );
    }
}

///@title WondersContract4
///@author OxSnosh
///@dev this contract inherits from openzeppelin's ownable contract
///@notice this contract will strore information about a nations wonders
contract WondersContract4 is Ownable {
    address public treasuryAddress;
    address public infrastructureAddress;
    address public improvementsContract2Address;
    address public improvementsContract3Address;
    address public improvementsContract4Address;
    address public wonderContract1Address;
    address public wonderContract3Address;
    address public countryMinter;
    uint256 public socialSecuritySystemCost = 40000000 * (10**18);
    uint256 public spaceProgramCost = 30000000 * (10**18);
    uint256 public stockMarketCost = 30000000 * (10**18);
    uint256 public strategicDefenseInitiativeCost = 75000000 * (10**18);
    uint256 public superiorLogisticalSupportCost = 80000000 * (10**18);
    uint256 public universalHealthcareCost = 100000000 * (10**18);
    uint256 public weaponsResearchCenterCost = 150000000 * (10**18);

    CountryMinter mint;

    struct Wonders4 {
        //Social Security System -
        //$40,000,000-
        //The social security system provides benefits to aging members of your nation.
        //DONE //Allows you to raise taxes above 28% up to 30% without additional happiness penalties.
        bool socialSecuritySystem;
        //Space Program -
        //$30,000,000 -
        //The space program sends your astronauts to the moon and beyond.
        //DONE //Increases happiness +3, lowers technology cost -3% and lowers aircraft cost -5%.
        bool spaceProgram;
        //Stock Market -
        //$30,000,000 -
        //The stock market provides a boost to your economy.
        //DONE //Increases citizen income +$10.00
        bool stockMarket;
        //Strategic Defense Initiative (SDI) -
        //$75,000,000 -
        //DONE //Reduces odds of a successful nuclear attack against your nation by 60%.
        //The SDI wonder also requires 3 satellites and 3 missile defenses
        //and those satellites and missile defenses cannot be deleted once the wonder is developed.
        bool strategicDefenseInitiative;
        //Superior Logistical Support -
        //$80,000,000 -
        //Provides supplies more efficiently to your nation's military.
        //DONE //Reduces Aircraft and Naval Maintenance Cost by -10% and
        //DONE //Tank Maintenance Cost by -5%.
        //DONE //Increases attacking and defending ground battle strength +10%.
        //Requires Pentagon.
        bool superiorLogisticalSupport;
        //Universal Health Care -
        //$100,000,000 -
        //A Universal Health Care program
        //DONE //increases population +3% and
        //DONE //increases population happiness +2.
        //Requires 11,000 infrastructure, Hospital, National Research Lab.
        bool universalHealthcare;
        //Weapons Research Complex -
        //$150,000,000 -
        //Increases the technology bonus to damage from 0.01% to 0.02% per technology level,
        //DONE //Increases the number of nukes that can be purchased per day to 2,
        //DONE //hurts environment by +1,
        //Increases the purchase costs of all military by 0.01% per technology level.
        //Requires 8,500 infrastructure, 2,000 technology, National Research Lab, Pentagon Wonder.
        bool weaponsResearchCenter;
    }

    mapping(uint256 => Wonders4) public idToWonders4;

    event Wonder4Purchased(uint256 indexed countryId, uint256 indexed wonderId);
    event Wonder4Deleted(uint256 indexed countryId, uint256 indexed wonderId);

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _treasuryAddress,
        address _improvementsContract2Address,
        address _improvementsContract3Address,
        address _improvementsContract4Address,
        address _infrastructureAddress,
        address _wonders1,
        address _wonders3,
        address _countryMinter
    ) public onlyOwner {
        treasuryAddress = _treasuryAddress;
        improvementsContract2Address = _improvementsContract2Address;
        improvementsContract3Address = _improvementsContract3Address;
        improvementsContract4Address = _improvementsContract4Address;
        infrastructureAddress = _infrastructureAddress;
        wonderContract1Address = _wonders1;
        wonderContract3Address = _wonders3;
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
    }

    modifier onlyCountryMinter() {
        require(
            msg.sender == countryMinter,
            "only callable from countryMinter"
        );
        _;
    }

    ///@dev this function is only callable from the country minter contract
    ///@notice this function will be called when a nation is minted and allow a nation to buy the wonders in this contract
    function generateWonders4(uint256 id) public onlyCountryMinter {
        Wonders4 memory newWonders4 = Wonders4(
            false,
            false,
            false,
            false,
            false,
            false,
            false
        );
        idToWonders4[id] = newWonders4;
    }

    ///@dev this function is only callable by the contract owner
    function updateSocialSecuritySystemCost(uint256 newPrice) public onlyOwner {
        socialSecuritySystemCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateSpaceProgramCost(uint256 newPrice) public onlyOwner {
        spaceProgramCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateStockMarketCost(uint256 newPrice) public onlyOwner {
        stockMarketCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateStrategicDefenseInitiativeCost(
        uint256 newPrice
    ) public onlyOwner {
        strategicDefenseInitiativeCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateSuperiorLogisticalSupportCost(
        uint256 newPrice
    ) public onlyOwner {
        superiorLogisticalSupportCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateUniversalHealthcareCost(uint256 newPrice) public onlyOwner {
        universalHealthcareCost = newPrice;
    }

    ///@dev this function is only callable by the contract owner
    function updateWeaponsResearchCenterCost(
        uint256 newPrice
    ) public onlyOwner {
        weaponsResearchCenterCost = newPrice;
    }

    ///@dev this function is only callable from a nation owner and allows a nation to purchase the wonders in this contract
    ///@notice this function allows a nation owner to purchase the wonders in this contract
    ///@param countryId is the nationId of the country purchasing a wonder
    /**@param wonderId is the id of the wonder
     * 1. social security system
     * 2. space program
     * 3. stock market
     * 4. strategic defense initiative
     * 5. superior logistical support
     * 6. universal healthcare
     * 7. weapons research center
    */
    function buyWonder4(uint256 countryId, uint256 wonderId) public {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        require(wonderId <= 7, "Invalid wonder ID");
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(
            countryId
        );
        if (wonderId == 1) {
            require(
                balance >= socialSecuritySystemCost,
                "Insufficient balance"
            );
            bool existingWonder = idToWonders4[countryId].socialSecuritySystem;
            require(existingWonder == false, "Already owned");
            idToWonders4[countryId].socialSecuritySystem = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                socialSecuritySystemCost
            );
        } else if (wonderId == 2) {
            require(balance >= spaceProgramCost, "Insufficient balance");
            bool existingWonder = idToWonders4[countryId].spaceProgram;
            require(existingWonder == false, "Already owned");
            idToWonders4[countryId].spaceProgram = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                spaceProgramCost
            );
        } else if (wonderId == 3) {
            require(balance >= stockMarketCost, "Insufficient balance");
            bool existingWonder = idToWonders4[countryId].stockMarket;
            require(existingWonder == false, "Already owned");
            idToWonders4[countryId].stockMarket = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                stockMarketCost
            );
        } else if (wonderId == 4) {
            require(
                balance >= strategicDefenseInitiativeCost,
                "Insufficient balance"
            );
            bool existingWonder = idToWonders4[countryId]
                .strategicDefenseInitiative;
            require(existingWonder == false, "Already owned");
            uint256 missileDefenseCount = ImprovementsContract4(
                improvementsContract4Address
            ).getMissileDefenseCount(countryId);
            require(
                missileDefenseCount >= 3,
                "Must own at least 3 missile defense improvements"
            );
            uint256 satelliteCount = ImprovementsContract3(
                improvementsContract3Address
            ).getSatelliteCount(countryId);
            require(
                satelliteCount >= 3,
                "Must own at least 3 satellite improvements"
            );
            idToWonders4[countryId].strategicDefenseInitiative = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                strategicDefenseInitiativeCost
            );
        } else if (wonderId == 5) {
            require(
                balance >= superiorLogisticalSupportCost,
                "Insufficient balance"
            );
            bool existingWonder = idToWonders4[countryId]
                .superiorLogisticalSupport;
            require(existingWonder == false, "Already owned");
            bool isPentagon = WondersContract3(wonderContract3Address)
                .getPentagon(countryId);
            require(
                isPentagon == true,
                "Pentagon required in order to purchase"
            );
            idToWonders4[countryId].superiorLogisticalSupport = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                superiorLogisticalSupportCost
            );
        } else if (wonderId == 6) {
            require(balance >= universalHealthcareCost, "Insufficient balance");
            bool existingWonder = idToWonders4[countryId].universalHealthcare;
            require(existingWonder == false, "Already owned");
            uint256 infrastructureAmount = InfrastructureContract(
                infrastructureAddress
            ).getInfrastructureCount(countryId);
            require(
                infrastructureAmount >= 11000,
                "Must have 11000 Infrastructure to purchase"
            );
            uint256 hospitalAmount = ImprovementsContract2(
                improvementsContract2Address
            ).getHospitalCount(countryId);
            require(
                hospitalAmount > 0,
                "Hospital improvement required to purchase"
            );
            bool researchLab = WondersContract3(wonderContract3Address)
                .getNationalResearchLab(countryId);
            require(
                researchLab == true,
                "National Research Lab required to Purchase"
            );
            idToWonders4[countryId].universalHealthcare = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                universalHealthcareCost
            );
        } else {
            require(
                balance >= weaponsResearchCenterCost,
                "Insufficient balance"
            );
            bool existingWonder = idToWonders4[countryId].weaponsResearchCenter;
            require(existingWonder == false, "Already owned");
            bool isPentagon = WondersContract3(wonderContract3Address)
                .getPentagon(countryId);
            require(
                isPentagon == true,
                "Pentagon required in order to purchase"
            );
            bool researchLab = WondersContract3(wonderContract3Address)
                .getNationalResearchLab(countryId);
            require(
                researchLab == true,
                "National Research Lab required to Purchase"
            );
            uint256 infrastructureAmount = InfrastructureContract(
                infrastructureAddress
            ).getInfrastructureCount(countryId);
            require(
                infrastructureAmount >= 8500,
                "Must have 8500 Infrastructure to purchase"
            );
            uint256 techAmount = InfrastructureContract(infrastructureAddress)
                .getTechnologyCount(countryId);
            require(
                techAmount >= 2000,
                "Must have 2000 Technology to purchase"
            );
            idToWonders4[countryId].weaponsResearchCenter = true;
            WondersContract1(wonderContract1Address).addWonderCount(countryId);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                weaponsResearchCenterCost
            );
        }
        emit Wonder4Purchased(countryId, wonderId);
    }

    function deleteWonder4(uint256 countryId, uint256 wonderId) public {
        bool isOwner = mint.checkOwnership(countryId, msg.sender);
        require(isOwner, "!nation owner");
        require(wonderId <= 7, "Invalid wonder ID");
        if (wonderId == 1) {
            bool existingWonder = idToWonders4[countryId].socialSecuritySystem;
            require(existingWonder == true, "No wonder to delete");
            idToWonders4[countryId].socialSecuritySystem = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 2) {
            bool existingWonder = idToWonders4[countryId].spaceProgram;
            require(existingWonder == true, "No wonder to delete");
            idToWonders4[countryId].spaceProgram = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 3) {
            bool existingWonder = idToWonders4[countryId].stockMarket;
            require(existingWonder == true, "No wonder to delete");
            idToWonders4[countryId].stockMarket = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 4) {
            bool existingWonder = idToWonders4[countryId]
                .strategicDefenseInitiative;
            require(existingWonder == true, "No wonder to delete");
            idToWonders4[countryId].strategicDefenseInitiative = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 5) {
            bool existingWonder = idToWonders4[countryId]
                .superiorLogisticalSupport;
            require(existingWonder == true, "No wonder to delete");
            idToWonders4[countryId].superiorLogisticalSupport = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else if (wonderId == 6) {
            bool existingWonder = idToWonders4[countryId].universalHealthcare;
            require(existingWonder == true, "No wonder to delete");
            idToWonders4[countryId].universalHealthcare = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        } else {
            bool existingWonder = idToWonders4[countryId].weaponsResearchCenter;
            require(existingWonder == true, "No wonder to delete");
            idToWonders4[countryId].weaponsResearchCenter = false;
            WondersContract1(wonderContract1Address).subtractWonderCount(
                countryId
            );
        }
        emit Wonder4Deleted(countryId, wonderId);
    }

    ///@dev this is a public view function that will return true if a nation has the social security system wonder
    ///@dev this function will return true if a nation has the social security system wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getSocialSecuritySystem(
        uint256 countryId
    ) public view returns (bool) {
        return idToWonders4[countryId].socialSecuritySystem;
    }

    ///@dev this is a public view function that will return true if a nation has the space program wonder
    ///@dev this function will return true if a nation has the space program wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getSpaceProgram(uint256 countryId) public view returns (bool) {
        return idToWonders4[countryId].spaceProgram;
    }

    ///@dev this is a public view function that will return true if a nation has the stock market wonder
    ///@dev this function will return true if a nation has the stock market wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getStockMarket(uint256 countryId) public view returns (bool) {
        return idToWonders4[countryId].stockMarket;
    }

    ///@dev this is a public view function that will return true if a nation has the strategic defense initiative wonder
    ///@dev this function will return true if a nation has the strategic defense initiative wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getStrategicDefenseInitiative(
        uint256 countryId
    ) public view returns (bool) {
        return idToWonders4[countryId].strategicDefenseInitiative;
    }

    ///@dev this is a public view function that will return true if a nation has the superior logistical support wonder
    ///@dev this function will return true if a nation has the superior logistical support wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getSuperiorLogisticalSupport(
        uint256 countryId
    ) public view returns (bool) {
        return idToWonders4[countryId].superiorLogisticalSupport;
    }

    ///@dev this is a public view function that will return true if a nation has the universal healthcare wonder
    ///@dev this function will return true if a nation has the universal healthcare wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getUniversalHealthcare(
        uint256 countryId
    ) public view returns (bool) {
        return idToWonders4[countryId].universalHealthcare;
    }

    ///@dev this is a public view function that will return true if a nation has the weapons research center wonder
    ///@dev this function will return true if a nation has the weapons research center wonder
    ///@param countryId is the nation id of the nation being queried
    ///@return bool will be true if the nation has the wonder
    function getWeaponsResearchCenter(
        uint256 countryId
    ) public view returns (bool) {
        return idToWonders4[countryId].weaponsResearchCenter;
    }

    ///@dev this function will return the costs of the wonders in this contract
    function getWonderCosts4() public view returns(
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256
    ) {
        return (
            socialSecuritySystemCost,
            spaceProgramCost,
            stockMarketCost,
            strategicDefenseInitiativeCost,
            superiorLogisticalSupportCost,
            universalHealthcareCost,
            weaponsResearchCenterCost
        );
    }
}
