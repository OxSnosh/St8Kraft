//SPDX-License-Identifier: Unlicense
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

///@title ForcesContract
///@author OxSnosh
///@dev this contract inherits from the openzeppelin Ownable contract
///@notice this contract allows a nation owner to purchase soldiers, tanks and spies
contract ForcesContract is Ownable {
    // uint256 public spyCost = 100000;
    address public countryMinter;
    address public treasuryAddress;
    address public aid;
    address public spyAddress;
    address public cruiseMissile;
    address public infrastructure;
    address public resources;
    address public improvements1;
    address public improvements2;
    address public wonders1;
    address public nukeAddress;
    address public airBattle;
    address public groundBattle;
    address public warAddress;
    address public keeper;
    address public parameters;

    CountryMinter mint;
    InfrastructureContract inf;
    ResourcesContract res;
    WondersContract1 won1;
    ImprovementsContract1 imp1;
    ImprovementsContract2 imp2;
    WarContract war;
    GroundBattleContract ground;
    CountryParametersContract params;

    struct Forces {
        uint256 numberOfSoldiers;
        uint256 defendingSoldiers;
        uint256 deployedSoldiers;
        uint256 numberOfTanks;
        uint256 defendingTanks;
        uint256 deployedTanks;
        bool nationExists;
    }

    struct GroundBattleCasualties {
        uint256 soldierCasualties;
        uint256 tankCasualties;
    }

    event SoldiersPurchased(uint256 indexed id, uint256 indexed amount);

    event SoldiersDecommissioned(uint256 indexed id, uint256 indexed amount);

    event TanksPurchased(uint256 indexed id, uint256 indexed amount);

    event TanksDecommissioned(uint256 indexed id, uint256 indexed amount);

    event ForcesDeployed(
        uint256 indexed id,
        uint256 indexed soldiers,
        uint256 indexed tanks,
        uint256 warId
    );
    
    event SoldierDamageFromNukeAttack(
        uint256 indexed id,
        uint256 indexed amount
    );

    event TankDamageFromAirAssault(uint256 indexed id, uint256 indexed amount);

    event TankDamageFromCruiseMissile(
        uint256 indexed id,
        uint256 indexed amount
    );

    event TankDamageFromNukeAttack(uint256 indexed id, uint256 indexed amount);

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _treasuryAddress,
        address _aid,
        address _spyAddress,
        address _cruiseMissile,
        address _nukeAddress,
        address _airBattle,
        address _groundBattle,
        address _warAddress
    ) public onlyOwner {
        treasuryAddress = _treasuryAddress;
        spyAddress = _spyAddress;
        cruiseMissile = _cruiseMissile;
        aid = _aid;
        nukeAddress = _nukeAddress;
        airBattle = _airBattle;
        warAddress = _warAddress;
        war = WarContract(_warAddress);
        groundBattle = _groundBattle;
        ground = GroundBattleContract(_groundBattle);
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings2(
        address _infrastructure,
        address _resources,
        address _improvements1,
        address _improvements2,
        address _wonders1,
        address _countryMinter,
        address _keeper,
        address _parameters
    ) public onlyOwner {
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
        resources = _resources;
        res = ResourcesContract(_resources);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        improvements2 = _improvements2;
        imp2 = ImprovementsContract2(_improvements2);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        keeper = _keeper;
        parameters = _parameters;
        params = CountryParametersContract(_parameters);
    }

    mapping(uint256 => Forces) public idToForces;
    mapping(uint256 => GroundBattleCasualties) public idToCasualties;

    ///@dev this function is a public function but only callable from the country minter contact when a country is minted
    ///@notice this function allows a nation to purchase forces once a country is minted
    ///@param id this is the nation ID of the nation being minted
    function generateForces(uint256 id) public {
        Forces memory newForces = Forces(20, 20, 0, 0, 0, 0, true);
        idToForces[id] = newForces;
    }

    modifier onlyAidContract() {
        require(msg.sender == aid);
        _;
    }

    modifier onlySpyContract() {
        require(msg.sender == spyAddress, "only callable from spy contract");
        _;
    }

    modifier onlyCruiseMissileContract() {
        require(
            msg.sender == cruiseMissile,
            "only callable from cruise missile contract"
        );
        _;
    }

    modifier onlyNukeContract() {
        require(msg.sender == nukeAddress, "only callable from nuke contract");
        _;
    }

    modifier onlyAirBattle() {
        require(
            msg.sender == airBattle,
            "only callable from air battle contract"
        );
        _;
    }

    modifier onlyGroundBattle() {
        require(
            msg.sender == groundBattle,
            "only callable from ground battle contract"
        );
        _;
    }

    modifier onlyWar() {
        require(msg.sender == warAddress, "only callable from war contract");
        _;
    }

    ///@dev this is a public function that allows a nation owner to purchase soldiers
    ///@notice this function will allow a nation owner to purchase soldiers
    ///@param amount is the amount of soldiers being purchased
    ///@param id is the nation id of the nation being queried
    function buySoldiers(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 populationCount = inf.getTotalPopulationCount(0);
        uint256 maxSoldierCount = ((populationCount * 80) / 100);
        uint256 currentSoldierCount = idToForces[id].numberOfSoldiers;
        require(
            (currentSoldierCount + amount) <= maxSoldierCount,
            "population cannot support that many soldiers"
        );
        uint256 soldierCost = getSoldierCost(id);
        uint256 purchasePrice = soldierCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(
            balance >= purchasePrice,
            "insufficient funds for soldier purchase"
        );
        idToForces[id].numberOfSoldiers += amount;
        idToForces[id].defendingSoldiers += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
        emit SoldiersPurchased(id, amount);
    }

    ///@dev this is a public view function that will retrun the cost of soldiers for a nation
    ///@notice this will return the cost of a soldier for a nation
    ///@notice access to iron and oil resources decrease the cost of soldiers
    ///@param id is the nation ID of the nation being queried
    ///@return uint256 is the soldier cost for that nation
    function getSoldierCost(uint256 id) public view returns (uint256) {
        uint256 soldierCost = 12;
        bool iron = res.viewIron(id);
        if (iron) {
            soldierCost -= 3;
        }
        bool oil = res.viewOil(id);
        if (oil) {
            soldierCost -= 3;
        }
        return soldierCost;
    }

    ///@dev this function is only callable from the aid contract
    ///@notice this function will allow the aid contact to send soldiers in an aid package
    ///@param idSender is the nation id of the aid sender
    ///@param idReciever is the nation id of the aid reciever
    ///@param amount is the amount of soldiers being sent
    function sendSoldiers(
        uint256 idSender,
        uint256 idReciever,
        uint256 amount
    ) public onlyAidContract {
        uint256 defendingSoldierCount = idToForces[idSender].defendingSoldiers;
        require(
            defendingSoldierCount >= amount,
            "You do not have enough defending soldiers to send"
        );
        require(
            idToForces[idReciever].nationExists = true,
            "Destination nation does not exist"
        );
        idToForces[idSender].defendingSoldiers -= amount;
        idToForces[idSender].numberOfSoldiers -= amount;
        idToForces[idReciever].defendingSoldiers += amount;
        idToForces[idReciever].numberOfSoldiers += amount;
    }

    ///@dev this is a public view function that will return the amount of defending soldiers of a nation
    ///@notice this function will return the number of defending soldiers for a nation
    ///@param id is the nation ID of the nation being queried
    ///@return uint256 is the number of defending soldiers for the queried nation
    function getDefendingSoldierCount(
        uint256 id
    ) public view returns (uint256) {
        uint256 count = idToForces[id].defendingSoldiers;
        return count;
    }

    ///@dev this is a public view function that will return the number of soldiers for a nation
    ///@notice this function will return the number of soldiers a nation has
    ///@param id this is the nation ID of the nation being queried
    ///@return soldiers is the nations soldier count
    function getSoldierCount(
        uint256 id
    ) public view returns (uint256 soldiers) {
        uint256 soldierAmount = idToForces[id].numberOfSoldiers;
        return soldierAmount;
    }

    ///@dev this is a public view function that will return a nations deployed soldier count
    ///@notice this function returns the amount of deployed solders a nation has
    ///@param id is the nation ID for the nation being queried
    ///@return soldiers is the number of deployed soldiers for that nation
    function getDeployedSoldierCount(
        uint256 id
    ) public view returns (uint256 soldiers) {
        uint256 soldierAmount = idToForces[id].deployedSoldiers;
        return soldierAmount;
    }

    ///@dev this is a public function that will allow a nation woner to deploy soldiers to a war
    ///@notice this function allows a nation owner to deploy soldiers to an active war
    ///@param soldiersToDeploy is the number of soldiers being deployed
    ///@param tanksToDeploy is the number of tanks being deployed
    ///@param id is the nation id of the nation deploying soldiers
    ///@param warId is the id of the active war
    function deployForces(
        uint256 soldiersToDeploy,
        uint256 tanksToDeploy,
        uint256 id,
        uint256 warId
    ) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 totalSoldiers = getSoldierCount(id);
        uint256 deployedSoldiers = getDeployedSoldierCount(id);
        uint256 maxDeployablePercentage = getMaxDeployablePercentage(id);
        uint256 defendingSoldierCount = idToForces[id].defendingSoldiers;
        require(
            defendingSoldierCount >= soldiersToDeploy,
            "cannot deploy that many soldiers"
        );
        if (soldiersToDeploy > 0) {
            require(
                (((deployedSoldiers + soldiersToDeploy) * 100) /
                    totalSoldiers) <= maxDeployablePercentage,
                "deployment exceeds max deployable percentage"
            );
        }
        uint256 defendingTankCount = idToForces[id].defendingTanks;
        require(
            defendingTankCount >= tanksToDeploy,
            "deploying too many tanks"
        );
        idToForces[id].defendingSoldiers -= soldiersToDeploy;
        idToForces[id].deployedSoldiers += soldiersToDeploy;
        idToForces[id].defendingTanks -= tanksToDeploy;
        idToForces[id].deployedTanks += tanksToDeploy;
        war.deployForcesToWar(id, warId, soldiersToDeploy, tanksToDeploy);
        emit ForcesDeployed(id, soldiersToDeploy, tanksToDeploy, warId);
    }

    ///@dev this is a public view function that will return the maximum percentage of a population that is deployable
    ///@notice this function returns the maximum percentage of a population that is deployable to war
    ///@param id is the nation id of the nation deploying soldiers
    ///@return uint256 is the maximum percentage of a nations population that is deployable
    function getMaxDeployablePercentage(
        uint256 id
    ) public view returns (uint256) {
        uint256 maxDeployablePercentage = 80;
        uint256 borderFortificationCount = imp1.getBorderFortificationCount(id);
        if (borderFortificationCount > 0) {
            maxDeployablePercentage -= (2 * borderFortificationCount);
        }
        return maxDeployablePercentage;
    }

    ///@dev this is a public function that allows a nation owner to withdraw deployed troops
    ///@notice this function lets a nation owner deploy troops from war
    ///@param amountToWithdraw is the amount of soldiers the nation owner is looking to withdraw
    ///@param id is the nation id of the nation withdrawing soldeirs
    function withdrawSoldiers(
        uint256 amountToWithdraw,
        uint256 id
    ) public onlyWar {
        uint256 deployedSoldierCount = idToForces[id].deployedSoldiers;
        require(deployedSoldierCount >= amountToWithdraw);
        idToForces[id].defendingSoldiers += amountToWithdraw;
        idToForces[id].deployedSoldiers -= amountToWithdraw;
    }

    ///@dev this is a public function only callable from the Nuke Contract that will decrease the number of soldiers during a nuke attack
    ///@notice this function is only callable from the nuke contract
    ///@notice this function will decrease the amount of soldiers from a nuke strike
    ///@notice a fallout shelter system will decrease the number of soldiers lost by 50%
    ///@param id is the nation ID of the nation being attacked
    function decreaseDefendingSoldierCountFromNukeAttack(
        uint256 id
    ) public onlyNukeContract {
        bool falloutShelter = won1.getFalloutShelterSystem(id);
        if (!falloutShelter) {
            uint256 numberOfDefendingSoldiers = idToForces[id]
                .defendingSoldiers;
            idToForces[id].defendingSoldiers = 0;
            idToForces[id].numberOfSoldiers -= numberOfDefendingSoldiers;
            idToCasualties[id].soldierCasualties += numberOfDefendingSoldiers;
            emit SoldierDamageFromNukeAttack(id, numberOfDefendingSoldiers);
        } else {
            uint256 numberOfDefendingSoldierCasualties = ((
                idToForces[id].defendingSoldiers
            ) / 2);
            idToForces[id]
                .defendingSoldiers = numberOfDefendingSoldierCasualties;
            idToForces[id]
                .numberOfSoldiers -= numberOfDefendingSoldierCasualties;
            idToCasualties[id]
                .soldierCasualties += numberOfDefendingSoldierCasualties;
            emit SoldierDamageFromNukeAttack(
                id,
                numberOfDefendingSoldierCasualties
            );
        }

    }

    ///@dev this is a public view function that will adjust the efficiency of a nations deployed soldiers
    ///@notice this function will adjust the efficiency of a nations deployed soldiers
    ///@notice aluminium, coal, oil, pigs, barracks, guerilla camps all increase the efficiency od deployed soldiers
    ///@param id this is the nation ID for the nation being queried
    ///@return uint256 this is the percentage modifier for a nations deployed forces
    function getDeployedSoldierEfficiencyModifier(
        uint256 id
    ) public view returns (uint256) {
        uint256 efficiencyModifier = 100;
        bool aluminum = res.viewAluminium(id);
        if (aluminum) {
            efficiencyModifier += 20;
        }
        bool coal = res.viewCoal(id);
        if (coal) {
            efficiencyModifier += 8;
        }
        bool oil = res.viewOil(id);
        if (oil) {
            efficiencyModifier += 10;
        }
        bool pigs = res.viewPigs(id);
        if (pigs) {
            efficiencyModifier += 15;
        }
        uint256 barracks = imp1.getBarracksCount(id);
        if (barracks > 0) {
            efficiencyModifier += (10 * barracks);
        }
        uint256 guerillaCamps = imp2.getGuerillaCampCount(id);
        if (guerillaCamps > 0) {
            efficiencyModifier += (35 * guerillaCamps);
        }
        uint256 governmentType = params.getGovernmentType(id);
        if (
            governmentType == 2 ||
            governmentType == 3 ||
            governmentType == 4 ||
            governmentType == 5 ||
            governmentType == 10
        ) {
            efficiencyModifier += 8;
        }
        return efficiencyModifier;
    }

    ///@dev this is a public view function that will adjust the efficiency of a nations defending soldiers
    ///@notice this function will adjust the efficiency of a nations defending soldiers
    ///@notice aluminium, coal, oil, pigs, barracks, border fortifications and forward operating bases all increase the efficiency od defending soldiers
    ///@param id this is the nation ID for the nation being queried
    ///@return uint256 this is the percentage modifier for a nations defending forces
    function getDefendingSoldierEfficiencyModifier(
        uint256 id
    ) public view returns (uint256) {
        uint256 efficiencyModifier = 100;
        bool aluminum = res.viewAluminium(id);
        if (aluminum) {
            efficiencyModifier += 20;
        }
        bool coal = res.viewCoal(id);
        if (coal) {
            efficiencyModifier += 8;
        }
        bool oil = res.viewOil(id);
        if (oil) {
            efficiencyModifier += 10;
        }
        bool pigs = res.viewPigs(id);
        if (pigs) {
            efficiencyModifier += 15;
        }
        uint256 barracks = imp1.getBarracksCount(id);
        if (barracks > 0) {
            efficiencyModifier += (10 * barracks);
        }
        uint256 borderFortification = imp1.getBorderFortificationCount(id);
        if (borderFortification > 0) {
            efficiencyModifier += (borderFortification * 2);
        }
        uint256 fobCount = imp2.getForwardOperatingBaseCount(id);
        if (fobCount > 0) {
            efficiencyModifier -= (fobCount * 3);
        }
        uint256 guerillaCamps = imp2.getGuerillaCampCount(id);
        if (guerillaCamps > 0) {
            efficiencyModifier += (35 * guerillaCamps);
        }
        uint256 governmentType = params.getGovernmentType(id);
        if (
            governmentType == 2 ||
            governmentType == 3 ||
            governmentType == 4 ||
            governmentType == 5 ||
            governmentType == 10
        ) {
            efficiencyModifier += 8;
        }
        return efficiencyModifier;
    }

    ///@dev this is a public function that allows a nation owner to decommission soldiers
    ///@notice this function allows a nation owner to decomission soldiers
    ///@param amount is the amount of soldiers being decomissioned
    ///@param id is the nation ID of the nation
    function decomissionSoldiers(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 defendingSoldierCount = getDefendingSoldierCount(id);
        require(
            (defendingSoldierCount - amount) >= 0,
            "not enough defending soldiers"
        );
        idToForces[id].defendingSoldiers -= amount;
        idToForces[id].numberOfSoldiers -= amount;
        emit SoldiersDecommissioned(id, amount);
    }

    ///@dev this is a public function that allows a nation owner to buy tanks
    ///@notice this function allows a nation owner to buy tanks
    ///@notice tanks cost 40X what soldeirs cost a nation
    ///@notice factories reduce the cost of tanks 5% per factory
    ///@param amount is the number of tanks being purchased
    ///@param id is the nation ID of the nation purchasing tanks
    function buyTanks(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 maxTanks = getMaxTankCount(id);
        uint256 currentTanks = idToForces[id].numberOfTanks;
        require(
            (currentTanks + amount) <= maxTanks,
            "cannot buy that many tanks"
        );
        uint256 costPerTank = getTankCost(id);
        uint256 cost = (costPerTank * amount);
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= cost);
        idToForces[id].numberOfTanks += amount;
        idToForces[id].defendingTanks += amount;
        TreasuryContract(treasuryAddress).spendBalance(id, cost);
        emit TanksPurchased(id, amount);
    }

        ///@dev this is a public function that allows a nation owner to decommission soldiers
    ///@notice this function allows a nation owner to decomission soldiers
    ///@param amount is the amount of soldiers being decomissioned
    ///@param id is the nation ID of the nation
    function decomissionTanks(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 defendingTankCount = getDefendingTankCount(id);
        require(
            (defendingTankCount - amount) >= 0,
            "not enough defending tanks"
        );
        idToForces[id].defendingTanks -= amount;
        idToForces[id].numberOfTanks -= amount;
        emit TanksDecommissioned(id, amount);
    }

    ///@dev this is a public view function that will return the maximum amount of tanks a nation can own
    ///@notice this function returns the maximum amount of tanks a nation can own
    ///@notice a nation's max tanks is the lesser of 10% of soldier efficiency or 8% of citizens
    ///@param id is the nation ID of the nation being queried
    ///@return uint256 is the maximum amount of tanks that nation can own
    function getMaxTankCount(uint256 id) public view returns (uint256) {
        uint256 soldiers = getSoldierCount(id);
        uint256 efficiency = getDefendingSoldierEfficiencyModifier(id);
        uint256 modifiedSoldierCount = ((soldiers * efficiency) / 100);
        uint256 tankMax = (modifiedSoldierCount / 10);
        uint256 citizenCount = inf.getTotalPopulationCount(id);
        uint256 tankMaxByCitizen = ((citizenCount * 8) / 100);
        if (tankMaxByCitizen < tankMax) {
            tankMax = tankMaxByCitizen;
        }
        return tankMax;
    }

    ///@dev this is a public view function that will return the cost a nation has to pay for tanks
    ///@notice the default cost of a tnak is soldier cost * 40
    ///@notice tank cost will be reduced by 5% for every factory owned
    ///@param id is the nation id of the nation buying tanks
    ///@return cost is the cost per tank for a given nation
    function getTankCost(uint256 id) public view returns (uint256) {
        uint256 soldierCost = getSoldierCost(id);
        uint256 purchasePrice = soldierCost * 40;
        uint256 factoryCount = imp1.getFactoryCount(id);
        uint256 costModifier = 100;
        if (factoryCount > 0) {
            costModifier -= (factoryCount * 5);
        }
        bool lead = res.viewLead(id);
        if (lead) {
            costModifier -= 8;
        }
        uint256 cost = ((purchasePrice * costModifier) / 100);
        return cost;
    }

    function withdrawTanks(
        uint256 amountToWithdraw,
        uint256 id
    ) public onlyWar {
        uint256 deployedTankCount = idToForces[id].deployedTanks;
        require(deployedTankCount >= amountToWithdraw);
        idToForces[id].defendingTanks += amountToWithdraw;
        idToForces[id].deployedTanks -= amountToWithdraw;
    }

    ///@dev this is a public view function that can only be called by the Spy Contract
    ///@notice this funtion will allow the spy contract to decrease the number of defending tanks in a spy attack
    ///@param amount is the amount of tanks being decreased
    ///@param id is the nation id of the nation being attacked
    function decreaseDefendingTankCount(
        uint256 amount,
        uint256 id
    ) public onlySpyContract {
        idToForces[id].defendingTanks -= amount;
        idToForces[id].numberOfTanks -= amount;
    }

    ///@dev this is a public function that can only be called from the cruise missile contract
    ///@notice this funtion will allow the cruise missile contact to decrease the number of tanks in a cruise missile attack
    ///@param amount is the number of tanks being decreased
    ///@param id is the nation id of the nation being attacked
    function decreaseDefendingTankCountFromCruiseMissileContract(
        uint256 amount,
        uint256 id
    ) public onlyCruiseMissileContract {
        idToForces[id].defendingTanks -= amount;
        idToForces[id].numberOfTanks -= amount;
        emit TankDamageFromCruiseMissile(id, amount);
    }

    ///@dev this is a public function that can only be called from the nuke contract
    ///@notice this funtion will allow the cruise missile contact to decrease the number of tanks in a nuke attack
    ///@param id is the nation id of the nation being attacked
    function decreaseDefendingTankCountFromNukeContract(
        uint256 id
    ) public onlyNukeContract {
        uint256 defendingTanks = idToForces[id].defendingTanks;
        uint256 percentage = 35;
        bool falloutShelter = won1.getFalloutShelterSystem(id);
        if (falloutShelter) {
            percentage = 25;
        }
        uint256 defendingTanksToDecrease = ((defendingTanks * percentage) /
            100);
        idToForces[id].numberOfTanks -= defendingTanksToDecrease;
        idToForces[id].defendingTanks -= defendingTanksToDecrease;
        emit TankDamageFromNukeAttack(id, defendingTanksToDecrease);
    }

    ///@dev this is a public function that can only be called from the air battle contract
    ///@notice this funtion will allow the cruise missile contact to decrease the number of tanks in a bombing attack
    ///@param amountToDecrease is the number of tanks being decreased
    ///@param id is the nation id of the nation being attacked
    function decreaseDefendingTankCountFromAirBattleContract(
        uint256 id,
        uint256 amountToDecrease
    ) public onlyAirBattle {
        uint256 defendingTanks = idToForces[id].defendingTanks;
        if (amountToDecrease > 30) {
            amountToDecrease = 30;
        }
        if (amountToDecrease >= defendingTanks) {
            idToForces[id].numberOfTanks -= defendingTanks;
            idToForces[id].defendingTanks = 0;
            amountToDecrease = defendingTanks;
        } else {
            idToForces[id].numberOfTanks -= amountToDecrease;
            idToForces[id].defendingTanks -= amountToDecrease;
        }
        emit TankDamageFromAirAssault(id, amountToDecrease);
    }

    ///@dev this is a public view function that will return the number of tanks a nation has
    ///@notice this function will return the number of tanks for a nation
    ///@param id is the nation id for the nation being queried
    ///@return tanks is the number of tanks for the nation being queried
    function getTankCount(uint256 id) public view returns (uint256 tanks) {
        uint256 tankAmount = idToForces[id].numberOfTanks;
        return tankAmount;
    }

    ///@dev this is a public view function that will return the number of deployed tanks a nation has
    ///@notice this function will return the number of deployed tanks for a nation
    ///@param id is the nation id for the nation being queried
    ///@return tanks is the number of deployed tanks for the nation being queried
    function getDeployedTankCount(
        uint256 id
    ) public view returns (uint256 tanks) {
        uint256 tankAmount = idToForces[id].deployedTanks;
        return tankAmount;
    }

    ///@dev this is a public view function that will return the number of defending tanks a nation has
    ///@notice this function will return the number of defending tanks for a nation
    ///@param id is the nation id for the nation being queried
    ///@return tanks is the number of defending tanks for the nation being queried
    function getDefendingTankCount(
        uint256 id
    ) public view returns (uint256 tanks) {
        uint256 tankAmount = idToForces[id].defendingTanks;
        return tankAmount;
    }

    ///@dev this is a public function only callable from the ground battle contract
    ///@dev this function will decrease the losses of an attacker during a ground battle
    ///@notice this function will decrease the number of losses of an attacker during a ground battle
    ///@param attackerSoldierLosses is the soldier losses for an attacker from a battle
    ///@param attackerTankLosses is the tank losses for an attacker from a battle
    ///@param attackerId is the nation ID of the nation suffering losses
    function decreaseUnits(
        uint256 attackerSoldierLosses,
        uint256 attackerTankLosses,
        uint256 attackerId,
        uint256 defenderSoldierLosses,
        uint256 defenderTankLosses,
        uint256 defenderId
    ) public onlyGroundBattle {
        idToForces[attackerId].numberOfSoldiers -= attackerSoldierLosses;
        idToForces[attackerId].deployedSoldiers -= attackerSoldierLosses;
        idToForces[attackerId].numberOfTanks -= attackerTankLosses;
        idToForces[attackerId].deployedTanks -= attackerTankLosses;
        idToForces[defenderId].numberOfSoldiers -= defenderSoldierLosses;
        idToForces[defenderId].defendingSoldiers -= defenderSoldierLosses;
        idToForces[defenderId].numberOfTanks -= defenderTankLosses;
        idToForces[defenderId].defendingTanks -= defenderTankLosses;
        idToCasualties[attackerId].soldierCasualties += attackerSoldierLosses;
        idToCasualties[attackerId].tankCasualties += attackerTankLosses;
        idToCasualties[defenderId].soldierCasualties += defenderSoldierLosses;
        idToCasualties[defenderId].tankCasualties += defenderTankLosses;
    }

    ///@dev this is a function for the development environment that will assist in testing wonders and improvements that are available after a certain number of casualties
    function increaseSoldierCasualties(
        uint256 id,
        uint256 amount
    ) public onlyOwner {
        idToCasualties[id].soldierCasualties += amount;
    }

    ///@dev this is a public view function that will return a nations casualty count
    ///@notice this function will return a nations casualty count
    ///@param id is a nation id for the nation being queried
    ///@return uint256 is the soldier casualty count for a given nation
    ///@return uint256 is the tank casualty count for a given nation
    function getCasualties(uint256 id) public view returns (uint256, uint256) {
        uint256 soldierCasualties = idToCasualties[id].soldierCasualties;
        uint256 tankCasualties = idToCasualties[id].tankCasualties;
        return (soldierCasualties, tankCasualties);
    }
}

contract SpyContract is Ownable {
    uint256 public spyCost = 100000;
    address public treasury;
    address public spyOperations;

    CountryMinter mint;
    InfrastructureContract inf;
    ResourcesContract res;
    WondersContract1 won1;
    ImprovementsContract1 imp1;
    ImprovementsContract2 imp2;
    WarContract war;
    GroundBattleContract ground;
    CountryParametersContract params;

    event SpiesPurchased(uint256 indexed id, uint256 indexed amount);

    event SpiesDecommissioned(uint256 indexed id, uint256 indexed amount);

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _spyOperations,
        address _treasury
    ) public onlyOwner {
        spyOperations = _spyOperations;
        treasury = _treasury;
    }

    mapping(uint256 => uint256) public idToSpies;

    modifier onlySpyOperations() {
        require(msg.sender == spyOperations, "only callable from spy operations contract");
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
        require((spyCount - amount) >= 0, "not enough spies to decommission that many");
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

///@title MissilesContract
///@author OxSnosh
///@dev this contract will allow a nation to purchase cruise missiles and nukes
///@dev this contract inherits from the openzeppelin ownable contract
contract MissilesContract is Ownable {
    uint256 public cruiseMissileCost = 20000 * (10 ** 18);
    uint256 public defaultNukeCost = 500000 * (10 ** 18);
    uint256 public nukeCost;
    address public countryMinter;
    address public treasury;
    address public spyAddress;
    address public resources;
    address public improvements1;
    address public wonders1;
    address public wonders2;
    address public wonders4;
    address public nukeAddress;
    address public airBattle;
    address public countryinter;
    address public strength;
    address public keeper;
    address public infrastructure;

    CountryMinter mint;
    InfrastructureContract inf;
    ResourcesContract res;
    WondersContract1 won1;
    WondersContract2 won2;
    WondersContract4 won4;
    ImprovementsContract1 imp1;
    ImprovementsContract2 imp2;
    WarContract war;
    TreasuryContract tsy;
    NationStrengthContract stren;
    KeeperContract keep;

    struct Missiles {
        uint256 cruiseMissiles;
        uint256 nuclearWeapons;
    }

    mapping(uint256 => mapping(uint256 => uint256))
        public idToNukesPurchasedToday;

    event CruiseMissilesPurchased(uint256 indexed id, uint256 indexed amountPurchased);

    event NukePurchased(uint256 indexed id);

    event CruiseMissilesDestroyedByAirAssault(
        uint256 indexed id,
        uint256 amountDestroyed
    );

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings(
        address _treasury,
        address _spyAddress,
        address _nukeAddress,
        address _airBattle,
        address _wonders2,
        address _strength,
        address _infrastructure
    ) public onlyOwner {
        treasury = _treasury;
        tsy = TreasuryContract(_treasury);
        spyAddress = _spyAddress;
        nukeAddress = _nukeAddress;
        airBattle = _airBattle;
        wonders2 = _wonders2;
        won2 = WondersContract2(_wonders2);
        strength = _strength;
        stren = NationStrengthContract(_strength);
        infrastructure = _infrastructure;
        inf = InfrastructureContract(_infrastructure);
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings2(
        address _resources,
        address _improvements1,
        address _wonders1,
        address _wonders4,
        address _countryMinter,
        address _keeper
    ) public onlyOwner {
        resources = _resources;
        res = ResourcesContract(_resources);
        wonders1 = _wonders1;
        won1 = WondersContract1(_wonders1);
        wonders4 = _wonders4;
        won4 = WondersContract4(_wonders4);
        improvements1 = _improvements1;
        imp1 = ImprovementsContract1(_improvements1);
        countryMinter = _countryMinter;
        mint = CountryMinter(_countryMinter);
        keeper = _keeper;
        keep = KeeperContract(_keeper);
    }

    mapping(uint256 => Missiles) public idToMissiles;

    function generateMissiles(uint256 id) public {
        Missiles memory newMissiles = Missiles(0, 0);
        idToMissiles[id] = newMissiles;
    }

    ///@dev this function is only callable by the contract owner
    function updateTreasuryContract(address newAddress) public onlyOwner {
        treasury = newAddress;
        tsy = TreasuryContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateSpyContract(address newAddress) public onlyOwner {
        spyAddress = newAddress;
    }

    ///@dev this function is only callable by the contract owner
    function updateNukeContract(address newAddress) public onlyOwner {
        nukeAddress = newAddress;
    }

    ///@dev this function is only callable by the contract owner
    function updateAirBattleContract(address newAddress) public onlyOwner {
        airBattle = newAddress;
    }

    ///@dev this function is only callable by the contract owner
    function updateNationStrengthContract(address newAddress) public onlyOwner {
        strength = newAddress;
        stren = NationStrengthContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateResourcesContract(address newAddress) public onlyOwner {
        resources = newAddress;
        res = ResourcesContract(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateImprovementsContract1(address newAddress) public onlyOwner {
        improvements1 = newAddress;
        imp1 = ImprovementsContract1(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateWondersContract1(address newAddress) public onlyOwner {
        wonders1 = newAddress;
        won1 = WondersContract1(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateWondersContract2(address newAddress) public onlyOwner {
        wonders2 = newAddress;
        won2 = WondersContract2(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateWondersContract4(address newAddress) public onlyOwner {
        wonders4 = newAddress;
        won4 = WondersContract4(newAddress);
    }

    ///@dev this function is only callable by the contract owner
    function updateCountryMinter(address newAddress) public onlyOwner {
        countryMinter = newAddress;
        mint = CountryMinter(newAddress);
    }

    modifier onlySpyContract() {
        require(msg.sender == spyAddress, "only callable from spy contract");
        _;
    }

    modifier onlyNukeContract() {
        require(msg.sender == nukeAddress, "only callable from nuke contract");
        _;
    }

    modifier onlyAirBattle() {
        require(
            msg.sender == airBattle,
            "only callable from air battle contract"
        );
        _;
    }

    modifier onlyKeeper() {
        require(
            msg.sender == keeper,
            "function only callable from keeper contract"
        );
        _;
    }

    ///@dev this function is a public function that will allow a nation owner to purchase cruise missiles
    ///@notice this function allows a nation owner to purchase cruise missiles
    ///@param amount is the amount of cruise missiles being purchased
    ///@param id is the nation id of the nation buying cruise missiles
    function buyCruiseMissiles(uint256 amount, uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 techAmount = inf.getTechnologyCount(id);
        require(techAmount >= 15, "requires 15 tech");
        uint256 costPerMissile = getCruiseMissileCost(id);
        uint256 cost = (costPerMissile * amount);
        tsy.spendBalance(id, cost);
        idToMissiles[id].cruiseMissiles += amount;
        emit CruiseMissilesPurchased(id, amount);
    }

    ///@dev this function is only callable by the contract owner
    function updateCruiseMissileCost(uint256 newPrice) public onlyOwner {
        cruiseMissileCost = newPrice;
    }

    ///@dev this is a public view function that will return the cost per missiile of cruise missiles for a nation
    ///@notice this function will return the cost per cruise missile for a given nation
    ///@param id is the nation id of the nation purchasing missiles
    ///@return cost is the cost per missile of cruise missiles for that nation
    function getCruiseMissileCost(
        uint256 id
    ) public view returns (uint256 cost) {
        uint256 basePurchasePrice = cruiseMissileCost;
        uint256 factoryCount = imp1.getFactoryCount(id);
        uint256 costModifier = 100;
        if (factoryCount > 0) {
            costModifier -= (factoryCount * 5);
        }
        bool lead = res.viewLead(id);
        if (lead) {
            costModifier -= 20;
        }
        uint256 costPerMissile = ((basePurchasePrice * costModifier) / 100);
        return costPerMissile;
    }

    ///@dev this is a public view function that will return the number of cruise missile a nation owns
    ///@notice this function will return the number of cruise missiles a given nation owns
    ///@param id is the nation ID of the nation being queried
    ///@return uint256 is the number of cruise missiles a given nation owns
    function getCruiseMissileCount(uint256 id) public view returns (uint256) {
        uint256 count = idToMissiles[id].cruiseMissiles;
        return count;
    }

    ///@dev this is a public function that will decrease the number of cruise missiles only callable from the spy contract
    ///@notice this function will decrease the number of cruise missiles lost during a spy attack
    ///@param amount this is the number of missiles being destroyed
    ///@param id this is the nation id of the nation being attacked
    function decreaseCruiseMissileCount(
        uint256 amount,
        uint256 id
    ) public onlySpyContract {
        uint256 missiles = idToMissiles[id].cruiseMissiles;
        if (amount >= missiles) {
            idToMissiles[id].cruiseMissiles = 0;
        } else {
            idToMissiles[id].cruiseMissiles -= amount;
        }
    }

    ///@dev this is a public function that will decrease the number of cruise missiles only callable from the nuke contract
    ///@notice this function will decrease the number of cruise missiles lost during a nuke attack
    ///@notice a succesful nuke attack will destroy 35% of your nations cruise missiles
    ///@notice a fallout shelter system will reduce the number of missiles lost during a nuke attack to 25%
    ///@param id this is the nation id of the nation being attacked
    function decreaseCruiseMissileCountFromNukeContract(
        uint256 id
    ) public onlyNukeContract {
        uint256 cruiseMissiles = idToMissiles[id].cruiseMissiles;
        uint256 percentage = 35;
        bool falloutShelter = won1.getFalloutShelterSystem(id);
        if (falloutShelter) {
            percentage = 25;
        }
        uint256 cruiseMissilesToDecrease = ((cruiseMissiles * percentage) /
            100);
        idToMissiles[id].cruiseMissiles -= cruiseMissilesToDecrease;
    }

    ///@dev this is a public function only callable from the air battle contact
    ///@notice this function will decrease the number of cruise missiles lost during a bombing mission
    ///@param id this is the nation id of the nation losing missiles from being attacked by bombers
    ///@param amountToDecrease this is the number of cruise missiles beind destroyed by the bombing mission
    function decreaseCruiseMissileCountFromAirBattleContract(
        uint256 id,
        uint256 amountToDecrease
    ) public onlyAirBattle {
        uint256 cruiseMissiles = idToMissiles[id].cruiseMissiles;
        if (amountToDecrease >= cruiseMissiles) {
            idToMissiles[id].cruiseMissiles = 0;
            amountToDecrease = cruiseMissiles;
        } else {
            idToMissiles[id].cruiseMissiles -= amountToDecrease;
        }
        emit CruiseMissilesDestroyedByAirAssault(id, amountToDecrease);
    }

    ///@dev this is a public function that will allow a nation owner to purchase nukes
    ///@notice this function allows a nation owner to purchase nukes
    ///@notice requirements to purchase nukes are 75 technology, 1000 infrastructure and access to uranium
    ///@notice a nation must also have a nation strength of 150,000 or a manhattan project to purchase nukes
    ///@notice a nation owner can only purchase one nuke per day (2 with a weapons research center)
    ///@param id is the nation id of the nation purchasing nukes
    function buyNukes(uint256 id) public {
        bool isOwner = mint.checkOwnership(id, msg.sender);
        require(isOwner, "!nation owner");
        uint256 techAmount = inf.getTechnologyCount(id);
        require(techAmount >= 75, "requires 75 tech");
        uint256 infrastructureAmount = inf.getInfrastructureCount(id);
        require(infrastructureAmount >= 1000, "insufficient infrastructure");
        bool isUranium = res.viewUranium(id);
        require(isUranium, "no uranium");
        uint256 nationStrength = stren.getNationStrength(id);
        bool manhattanProject = won2.getManhattanProject(id);
        require(
            nationStrength > 150000 || manhattanProject,
            "nation strength too low"
        );
        uint256 day = keep.getGameDay();
        uint256 nukesPurchasedToday = idToNukesPurchasedToday[id][day];
        uint256 maxNukesPerDay = 1;
        bool weaponsResearchCenter = won4.getWeaponsResearchCenter(id);
        if (weaponsResearchCenter) {
            maxNukesPerDay = 2;
        }
        require(
            nukesPurchasedToday < maxNukesPerDay,
            "already purchased nuke today"
        );
        idToNukesPurchasedToday[id][day] += 1;
        idToMissiles[id].nuclearWeapons += 1;
        uint256 cost = getNukeCost(id);
        tsy.spendBalance(id, cost);
        emit NukePurchased(id);
    }

    ///@dev this is a public function that will return the cost per nuke for a nation
    ///@notice this function will return the cost per nuke for a nation
    ///@notice nukes cost 500,000 + (50,000 * current nuke count)
    ///@param id is the nation ID of the nation being queried
    ///@return uint256 is the cost per nuke for a given nation
    function getNukeCost(uint256 id) public view returns (uint256) {
        uint256 nukeCount = idToMissiles[id].nuclearWeapons;
        uint256 cost = (defaultNukeCost + (nukeCount * 50000));
        uint256 mod = 100;
        bool lead = res.viewLead(id);
        if (lead) {
            mod = 80;
        }
        cost = ((cost * mod) / 100);
        return cost;
    }

    function updateDefaultNukeCost(uint256 newCost) public onlyOwner {
        defaultNukeCost = newCost;
    }

    function getDefaultNukeCost() public view returns (uint256) {
        return defaultNukeCost;
    }

    function getNukesPurchasedToday(uint256 id) public view returns (uint256) {
        uint256 day = keep.getGameDay();
        return idToNukesPurchasedToday[id][day];
    }

    ///@dev this is a public view function that will retrun a nations current nuke count
    ///@notice this function retrurns a nations current nuke count
    ///@param id this is the nation ID for the nation being queried
    ///@return uint256 this is the current nuke count for a given nation
    function getNukeCount(uint256 id) public view returns (uint256) {
        uint256 count = idToMissiles[id].nuclearWeapons;
        return count;
    }

    ///@dev this is a public function that will decrease the nuke count for a nation by 1 when a nuke is launched from the nuke contract
    ///@dev this function is only callable from the nuke contract
    ///@notice this function will decrease a nations nuke count by 1 when a nuke is launched
    ///@param id is the nation id of the nation launching the nuke that will have its nuke count decreased by 1
    function decreaseNukeCountFromNukeContract(
        uint256 id
    ) public onlyNukeContract {
        idToMissiles[id].nuclearWeapons -= 1;
    }

    ///@dev this is a public function that will decrease the nuke count for a nation when a successful spy attack is executed
    ///@dev this function is only callable from the spy contract
    ///@notice this function will decrease a nations nuke count if they are successfully attacked by a spy
    ///@param id is the nation id of the nation that was attacked and is losing a nuke
    function decreaseNukeCountFromSpyContract(
        uint256 id
    ) public onlySpyContract {
        bool silo = won2.getHiddenNuclearMissileSilo(id);
        uint256 nukeCount = getNukeCount(id);
        uint256 requiredNukeAmount = 1;
        if (silo) {
            requiredNukeAmount = 6;
        }
        require(nukeCount >= requiredNukeAmount, "no nukes to destroy");
        idToMissiles[id].nuclearWeapons -= 1;
    }
}
