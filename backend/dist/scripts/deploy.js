"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
const hardhat_1 = require("hardhat");
const helper_hardhat_config_1 = require("../helper-hardhat-config");
const helper_hardhat_config_2 = require("../helper-hardhat-config");
const fs_1 = __importDefault(require("fs"));
async function main() {
    let chainId = hardhat_1.network.config.chainId;
    let subscriptionId;
    let vrfCoordinatorV2Mock;
    let vrfCoordinatorV2Address;
    const FUND_AMOUNT = hardhat_1.ethers.utils.parseEther("1");
    if (chainId == 31337) {
        const BASE_FEE = "250000000000000000"; // 0.25 is this the premium in LINK?
        const GAS_PRICE_LINK = 1e9; // link per gas, is this the gas lane? // 0.000000001 LINK per gas
        // create VRFV2 Subscription
        const VRFCoordinatorV2Mock = await hardhat_1.ethers.getContractFactory("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Mock = await VRFCoordinatorV2Mock.deploy(BASE_FEE, GAS_PRICE_LINK);
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait();
        subscriptionId = transactionReceipt.events[0].args.subId;
        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
    }
    else {
        // vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        // subscriptionId = networkConfig[chainId]["subscriptionId"]
    }
    var gasLane = helper_hardhat_config_2.networkConfig[31337]["gasLane"];
    var callbackGasLimit = helper_hardhat_config_2.networkConfig[31337]["callbackGasLimit"];
    let warbucks;
    let metanationsgovtoken;
    let aidcontract;
    let airbattlecontract;
    let additionalairbattle;
    let billscontract;
    let bombersmarketplace1;
    let bombersmarketplace2;
    let bomberscontract;
    let countryminter;
    let countryparameterscontract;
    let crimecontract;
    let cruisemissilecontract;
    let environmentcontract;
    let fighterscontract;
    let fighterlosses;
    let fightersmarketplace1;
    let fightersmarketplace2;
    let forcescontract;
    let missilescontract;
    let groundbattlecontract;
    let improvementscontract1;
    let improvementscontract2;
    let improvementscontract3;
    let improvementscontract4;
    let infrastructurecontract;
    let infrastructuremarketplace;
    let keepercontract;
    let landmarketcontract;
    let militarycontract;
    let nationstrengthcontract;
    let navalactionscontract;
    let navycontract;
    let navycontract2;
    let additionalnavycontract;
    let navalblockadecontract;
    let breakblockadecontract;
    let navalattackcontract;
    let nukecontract;
    let resourcescontract;
    let bonusresourcescontract;
    let senatecontract;
    let spycontract;
    let spyoperationscontract;
    let taxescontract;
    let additionaltaxescontract;
    let technologymarketcontrat;
    let treasurycontract;
    let warcontract;
    let wonderscontract1;
    let wonderscontract2;
    let wonderscontract3;
    let wonderscontract4;
    let signer0;
    let signer1;
    let signers;
    let addrs;
    signers = await hardhat_1.ethers.getSigners();
    signer0 = signers[0];
    signer1 = signers[1];
    const WarBucks = await hardhat_1.ethers.getContractFactory("WarBucks");
    warbucks = await WarBucks.deploy(helper_hardhat_config_1.INITIAL_SUPPLY);
    await warbucks.deployed();
    console.log(`WarBuks token deployed to ${warbucks.address}`);
    const MetaNatonsGovToken = await hardhat_1.ethers.getContractFactory("MetaNationsGovToken");
    metanationsgovtoken = await MetaNatonsGovToken.deploy(helper_hardhat_config_1.INITIAL_SUPPLY);
    await metanationsgovtoken.deployed();
    console.log(`MetaNationsGovToken deployed to ${metanationsgovtoken.address}`);
    const AidContract = await hardhat_1.ethers.getContractFactory("AidContract");
    aidcontract = await AidContract.deploy();
    await aidcontract.deployed();
    console.log(`AidContract deployed tp ${aidcontract.address}`);
    //countryminter
    //treasury
    //forces
    //infrastructure
    //keeper
    //wonder1
    const AirBattleContract = await hardhat_1.ethers.getContractFactory("AirBattleContract");
    airbattlecontract = await AirBattleContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
    await airbattlecontract.deployed();
    console.log(`AirBattleContract deployed tp ${airbattlecontract.address}`);
    //war
    //fighter
    //bomber
    //infrastructure
    //forces
    //fighterlosses
    //missiles
    //wonders1
    //vrfCoordinatorV2
    //subscriptionId
    //gasLAne
    //callbackGasLimit
    const AdditionalAirBattleContract = await hardhat_1.ethers.getContractFactory("AdditionalAirBattle");
    additionalairbattle = await AdditionalAirBattleContract.deploy();
    await additionalairbattle.deployed();
    // console.log(`AirBattleContract deployed tp ${airbattlecontract.address}`)
    const BillsContract = await hardhat_1.ethers.getContractFactory("BillsContract");
    billscontract = await BillsContract.deploy();
    await billscontract.deployed();
    console.log(`BillsContract deployed tp ${billscontract.address}`);
    //countryminter
    //treasury
    //infrastructure
    //forces
    //fighters
    //navy
    //improvements1
    //improvements2
    //missiles
    //resources
    //wonders1
    //wonders2
    //wonders3
    //wonders4
    const BombersContract = await hardhat_1.ethers.getContractFactory("BombersContract");
    bomberscontract = await BombersContract.deploy();
    await bomberscontract.deployed();
    console.log(`BomberContract deployed tp ${bomberscontract.address}`);
    //address _countryMinter,
    //address _bombersMarket,
    //address _airBattle,
    //address _treasuryAddress,
    //address _fightersAddress,
    //address _infrastructure,
    //address _war
    const BombersMarketplace1 = await hardhat_1.ethers.getContractFactory("BombersMarketplace1");
    bombersmarketplace1 = await BombersMarketplace1.deploy();
    await bombersmarketplace1.deployed();
    console.log(`BomberMarketplace1 deployed tp ${bombersmarketplace1.address}`);
    //address _countryMinter,
    //address _bombers1,
    //address _fighters,
    //address _infrastructure,
    //address _treasury
    const BombersMarketplace2 = await hardhat_1.ethers.getContractFactory("BombersMarketplace2");
    bombersmarketplace2 = await BombersMarketplace2.deploy();
    await bombersmarketplace2.deployed();
    console.log(`BomberMarketplace2 deployed tp ${bombersmarketplace2.address}`);
    //address _countryMinter,
    //address _bombers1,
    //address _fighters,
    //address _infrastructure,
    //address _treasury
    const CountryMinter = await hardhat_1.ethers.getContractFactory("CountryMinter");
    countryminter = await CountryMinter.deploy();
    await countryminter.deployed();
    console.log(`CountryMinter deployed tp ${countryminter.address}`);
    const CountryParameters = await hardhat_1.ethers.getContractFactory("CountryParametersContract");
    countryparameterscontract = await CountryParameters.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
    await countryparameterscontract.deployed();
    console.log(`CountryParameters deployed to ${countryparameterscontract.address}`);
    // spyAddress  
    const CrimeContract = await hardhat_1.ethers.getContractFactory("CrimeContract");
    crimecontract = await CrimeContract.deploy();
    await crimecontract.deployed();
    console.log(`CrimeContract deployed tp ${crimecontract.address}`);
    // address _infrastructure,
    // address _improvements1,
    // address _improvements2,
    // address _improvements3,
    // address _parameters  
    const CruiseMissileContract = await hardhat_1.ethers.getContractFactory("CruiseMissileContract");
    cruisemissilecontract = await CruiseMissileContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
    await cruisemissilecontract.deployed();
    console.log(`CruiseMissile deployed to ${cruisemissilecontract.address}`);
    // address _forces,
    // address _countryMinter,
    // address _war,
    // address _infrastructure,
    // address _missiles,
    // address _improvements1,
    // address _improvements3,
    // address _improvements4,
    // address _wonders2
    // address vrfCoordinatorV2,
    // uint64 subscriptionId,
    // bytes32 gasLane, // keyHash
    // uint32 callbackGasLimit 
    const EnvironmentContract = await hardhat_1.ethers.getContractFactory("EnvironmentContract");
    environmentcontract = await EnvironmentContract.deploy();
    await environmentcontract.deployed();
    console.log(`EnvironmentContract deployed to ${environmentcontract.address}`);
    // address _countryMinter,
    // address _resources,
    // address _infrastructure,
    // address _wonders3,
    // address _wonders4,
    // address _forces,
    // address _parameters,
    // address _taxes,
    // address _missiles,
    // address _nukes
    // address _improvements1,
    // address _improvements3,
    // address _improvements4
    const FightersContract = await hardhat_1.ethers.getContractFactory("FightersContract");
    fighterscontract = await FightersContract.deploy();
    await fighterscontract.deployed();
    console.log(`FightersContract deployed to ${fighterscontract.address}`);
    // address _countryMinter,
    // address _fightersMarket,
    // address _treasuryAddress,
    // address _war,
    // address _infrastructure,
    // address _resources,
    // address _improvements1,
    // address _airBattle,
    // address _wonders1,
    // address _losses
    // address _navy, 
    // address _bombers
    const FighterLosses = await hardhat_1.ethers.getContractFactory("FighterLosses");
    fighterlosses = await FighterLosses.deploy();
    await fighterlosses.deployed();
    console.log(`FighterLosses deployed to ${fighterlosses.address}`);
    // fighters
    // air batle
    const FightersMarketplace1 = await hardhat_1.ethers.getContractFactory("FightersMarketplace1");
    fightersmarketplace1 = await FightersMarketplace1.deploy();
    await fightersmarketplace1.deployed();
    console.log(`FightersMarket1 deployed to ${fightersmarketplace1.address}`);
    // address _countryMinter,
    // address _bombers,
    // address _fighters,
    // address _treasury,
    // address _infrastructure,
    // address _resources,
    // address _improvements1,
    // address _wonders4
    const FightersMarketplace2 = await hardhat_1.ethers.getContractFactory("FightersMarketplace2");
    fightersmarketplace2 = await FightersMarketplace2.deploy();
    await fightersmarketplace2.deployed();
    console.log(`FightersMarket2 deployed to ${fightersmarketplace2.address}`);
    // address _countryMinter,
    // address _bombers,
    // address _fighters,
    // address _treasury,
    // address _infrastructure,
    // address _resources,
    // address _improvements1
    const ForcesContract = await hardhat_1.ethers.getContractFactory("ForcesContract");
    forcescontract = await ForcesContract.deploy();
    await forcescontract.deployed();
    console.log(`ForcesContract deployed to ${forcescontract.address}`);
    // address _treasuryAddress,
    // address _aid,
    // address _spyAddress,
    // address _cruiseMissile,
    // address _nukeAddress,
    // address _airBattle,
    // address _groundBattle,
    // address _warAddress
    // address _infrastructure,
    // address _resources,
    // address _improvements1,
    // address _improvements2,
    // address _wonders1,
    // address _countryMinter
    const SpyContract = await hardhat_1.ethers.getContractFactory("SpyContract");
    spycontract = await SpyContract.deploy();
    await spycontract.deployed();
    console.log(`SpyContract deployed to ${spycontract.address}`);
    const MissilesContract = await hardhat_1.ethers.getContractFactory("MissilesContract");
    missilescontract = await MissilesContract.deploy();
    await missilescontract.deployed();
    console.log(`MissilesContract deployed to ${missilescontract.address}`);
    // address _treasury,
    // address _spyAddress,
    // address _nukeAddress,
    // address _airBattle,
    // address _strength
    // address _resources,
    // address _improvements1,
    // address _wonders1,
    // address _wonders2,
    // address _wonders4,
    // address _countryMinter
    const GroundBattleContract = await hardhat_1.ethers.getContractFactory("GroundBattleContract");
    groundbattlecontract = await GroundBattleContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
    await groundbattlecontract.deployed();
    console.log(`GroundBattleContract deployed to ${groundbattlecontract.address}`);
    // address _warAddress,
    // address _infrastructure,
    // address _forces,
    // address _treasury,
    // address _improvements2,
    // address _improvements3,
    // address _wonders3,
    // address _wonders4
    // address vrfCoordinatorV2,
    // uint64 subscriptionId,
    // bytes32 gasLane, // keyHash
    // uint32 callbackGasLimit
    const ImprovementsContract1 = await hardhat_1.ethers.getContractFactory("ImprovementsContract1");
    improvementscontract1 = await ImprovementsContract1.deploy();
    await improvementscontract1.deployed();
    console.log(`ImprovementsContract1 deployed to ${improvementscontract1.address}`);
    // address _treasury,
    // address _improvements2,
    // address _improvements3,
    // address _improvements4,
    // address _navy
    const ImprovementsContract2 = await hardhat_1.ethers.getContractFactory("ImprovementsContract2");
    improvementscontract2 = await ImprovementsContract2.deploy();
    await improvementscontract2.deployed();
    console.log(`ImprovementsContract2 deployed to ${improvementscontract2.address}`);
    // address _treasury,
    // address _forces,
    // address _improvements1
    const ImprovementsContract3 = await hardhat_1.ethers.getContractFactory("ImprovementsContract3");
    improvementscontract3 = await ImprovementsContract3.deploy();
    await improvementscontract3.deployed();
    console.log(`ImprovementsContract3 deployed to ${improvementscontract3.address}`);
    // treasury
    // improvements 1
    // improvements 2
    // navy
    const ImprovementsContract4 = await hardhat_1.ethers.getContractFactory("ImprovementsContract4");
    improvementscontract4 = await ImprovementsContract4.deploy();
    await improvementscontract4.deployed();
    console.log(`ImprovementsContract4 deployed to ${improvementscontract4.address}`);
    // treasury
    // improvements 1
    // improvements 2
    // forces
    const InfrastructureContract = await hardhat_1.ethers.getContractFactory("InfrastructureContract");
    infrastructurecontract = await InfrastructureContract.deploy();
    await infrastructurecontract.deployed();
    console.log(`InfrastructureContract deployed to ${infrastructurecontract.address}`);
    // address _resources,
    // address _improvements1,
    // address _improvements2,
    // address _improvements3,
    // address _improvements4,
    // address _infrastructureMarket,
    // address _techMarket,
    // address _landMarket
    // address _wonders1,
    // address _wonders2,
    // address _wonders3,
    // address _wonders4,
    // address _treasury,
    // address _parameters,
    // address _forces,
    // address _aid
    // address _spyAddress,
    // address _tax,
    // address _cruiseMissile,
    // address _nukeAddress,
    // address _airBattle,
    // address _groundBattle,
    // address _countryMinter
    const InfrastructureMarketContract = await hardhat_1.ethers.getContractFactory("InfrastructureMarketContract");
    infrastructuremarketplace = await InfrastructureMarketContract.deploy();
    await infrastructuremarketplace.deployed();
    console.log(`InfrastructureMarketplace deployed to ${infrastructuremarketplace.address}`);
    // address _resources,
    // address _parameters,
    // address _improvements1,
    // address _countryMinter,
    // address _wonders2,
    // address _wonders3,
    // address _treasury,
    // address _infrastructure
    const KeeperContract = await hardhat_1.ethers.getContractFactory("KeeperContract");
    keepercontract = await KeeperContract.deploy(86400);
    await keepercontract.deployed();
    console.log(`KeeperContract deployed to ${keepercontract.address}`);
    // address _nukes,
    // address _aid,
    // address _war 
    const LandMarketContract = await hardhat_1.ethers.getContractFactory("LandMarketContract");
    landmarketcontract = await LandMarketContract.deploy();
    await landmarketcontract.deployed();
    console.log(`LandMarketContract deployed to ${landmarketcontract.address}`);
    // address _resources,
    // address _countryMinter,
    // address _infrastructure,
    // address _treasury
    const MilitaryContract = await hardhat_1.ethers.getContractFactory("MilitaryContract");
    militarycontract = await MilitaryContract.deploy();
    await militarycontract.deployed();
    console.log(`MilitaryContract deployed to ${militarycontract.address}`);
    // spy
    const NationStrengthContract = await hardhat_1.ethers.getContractFactory("NationStrengthContract");
    nationstrengthcontract = await NationStrengthContract.deploy();
    await nationstrengthcontract.deployed();
    console.log(`NationStrengthContract deployed to ${nationstrengthcontract.address}`);
    // address _infrastructure,
    // address _forces,
    // address _fighters,
    // address _bombers,
    // address _navy,
    // address _missiles
    const NavyContract = await hardhat_1.ethers.getContractFactory("NavyContract");
    navycontract = await NavyContract.deploy();
    await navycontract.deployed();
    console.log(`NavyContract deployed to ${navycontract.address}`);
    const NavyContract2 = await hardhat_1.ethers.getContractFactory("NavyContract2");
    navycontract2 = await NavyContract2.deploy();
    await navycontract2.deployed();
    console.log(`NavyContract2 deployed to ${navycontract2.address}`);
    const AdditionalNavyContract = await hardhat_1.ethers.getContractFactory("AdditionalNavyContract");
    additionalnavycontract = await AdditionalNavyContract.deploy();
    await additionalnavycontract.deployed();
    console.log(`NavyContract deployed to ${additionalnavycontract.address}`);
    // address _treasuryAddress,
    // address _improvementsContract1Address,
    // address _improvementsContract3Address,
    // address _improvements4,
    // address _warAddress,
    // address _resources,
    // address _military,
    // address _nukes,
    // address _wonders1,
    // address _navalActions
    const NavalActionsContract = await hardhat_1.ethers.getContractFactory("NavalActionsContract");
    navalactionscontract = await NavalActionsContract.deploy();
    await navalactionscontract.deployed();
    console.log(`NavalActionsContract deployed to ${navalactionscontract.address}`);
    // address _navalBlockade,
    // address _breakBlockade,
    // address _navalAttack,
    // address _keeper,
    // address _navy,
    // address _countryMinter
    const NavalBlockadeContract = await hardhat_1.ethers.getContractFactory("NavalBlockadeContract");
    navalblockadecontract = await NavalBlockadeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
    await navalblockadecontract.deployed();
    console.log(`NavalBlockadeContract deployed to ${navalblockadecontract.address}`);
    // need randomness
    // address _navy,
    // address _navalAction,
    // address _war
    const BreakBlocadeContract = await hardhat_1.ethers.getContractFactory("BreakBlocadeContract");
    breakblockadecontract = await BreakBlocadeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
    await breakblockadecontract.deployed();
    console.log(`BreakBlocadeContract deployed to ${breakblockadecontract.address}`);
    //randomness
    // address _countryMinter,
    // address _navalBlockade,
    // address _navy,
    // address _warAddress,
    // address _improvements4,
    // address _navalActions
    const NavalAttackContract = await hardhat_1.ethers.getContractFactory("NavalAttackContract");
    navalattackcontract = await NavalAttackContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
    await navalattackcontract.deployed();
    console.log(`NavalAttackContract deployed to ${navalattackcontract.address}`);
    //randomness
    // address _navy,
    // address _war,
    // address _improvements4,
    // address _navalActions
    const NukeContract = await hardhat_1.ethers.getContractFactory("NukeContract");
    nukecontract = await NukeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
    await nukecontract.deployed();
    console.log(`NukeContract deployed to ${nukecontract.address}`);
    // randomness
    // address _countryMinter,
    // address _warAddress,
    // address _wonders1,
    // address _wonders4,
    // address _improvements3,
    // address _improvements4,
    // address _infrastructure,
    // address _forces,
    // address _navy,
    // address _missiles,
    // address _keeper 
    const ResourcesContract = await hardhat_1.ethers.getContractFactory("ResourcesContract");
    resourcescontract = await ResourcesContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
    await resourcescontract.deployed();
    console.log(`ResourcesContract deployed to ${resourcescontract.address}`);
    // randomness 
    // address _infrastructure,
    // address _improvements
    const BonusResourcesContract = await hardhat_1.ethers.getContractFactory("BonusResourcesContract");
    bonusresourcescontract = await BonusResourcesContract.deploy();
    await bonusresourcescontract.deployed();
    console.log(`BonusResourcesContract deployed to ${bonusresourcescontract.address}`);
    const SenateContract = await hardhat_1.ethers.getContractFactory("SenateContract");
    senatecontract = await SenateContract.deploy(20);
    await senatecontract.deployed();
    console.log(`SenateContract deployed to ${senatecontract.address}`);
    // address _countryMinter,
    // address _parameters,
    // address _wonders3
    const SpyOperationsContract = await hardhat_1.ethers.getContractFactory("SpyOperationsContract");
    spyoperationscontract = await SpyOperationsContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
    await spyoperationscontract.deployed();
    console.log(`SpyOperationsContract deployed to ${spyoperationscontract.address}`);
    //randomness
    // address _infrastructure,
    // address _forces,
    // address _military,
    // address _nationStrength,
    // address _wonders1,
    // address _treasury,
    // address _parameters,
    // address _missiles
    const TaxesContract = await hardhat_1.ethers.getContractFactory("TaxesContract");
    taxescontract = await TaxesContract.deploy();
    await taxescontract.deployed();
    console.log(`TaxesContract deployed to ${taxescontract.address}`);
    // address _countryMinter,
    // address _infrastructure,
    // address _treasury,
    // address _improvements1,
    // address _improvements2,
    // address _improvements3,
    // address _additionalTaxes
    // address _parameters,
    // address _wonders1,
    // address _wonders2,
    // address _wonders3,
    // address _wonders4,
    // address _resources,
    // address _forces,
    // address _military,
    // address _crime
    const AdditionalTaxesContract = await hardhat_1.ethers.getContractFactory("AdditionalTaxesContract");
    additionaltaxescontract = await AdditionalTaxesContract.deploy();
    await additionaltaxescontract.deployed();
    console.log(`AdditionalTaxesContract deployed to ${additionaltaxescontract.address}`);
    // countryparameterscontract.address,
    // wonderscontract1.address,
    // wonderscontract2.address,
    // wonderscontract3.address,
    // wonderscontract4.address,
    // resourcescontract.address,
    // militarycontract.address,
    // infrastructurecontract.address
    const TechnologyMarketContract = await hardhat_1.ethers.getContractFactory("TechnologyMarketContract");
    technologymarketcontrat = await TechnologyMarketContract.deploy();
    await technologymarketcontrat.deployed();
    console.log(`TechnologyMarketContract deployed to ${technologymarketcontrat.address}`);
    // address _resources,
    // address _improvements3,
    // address _infrastructure,
    // address _wonders2,
    // address _wonders3,
    // address _wonders4,
    // address _treasury,
    // address _countryMinter
    const TreasuryContract = await hardhat_1.ethers.getContractFactory("TreasuryContract");
    treasurycontract = await TreasuryContract.deploy();
    await treasurycontract.deployed();
    console.log(`TreasuryContract deployed to ${treasurycontract.address}`);
    // address _warBucksAddress,
    // address _wonders1,
    // address _improvements1,
    // address _infrastructure,
    // address _forces,
    // address _navy,
    // address _fighters,
    // address _aid,
    // address _taxes,
    // address _bills,
    // address _spyAddress
    // groundbattle
    const WarContract = await hardhat_1.ethers.getContractFactory("WarContract");
    warcontract = await WarContract.deploy();
    await warcontract.deployed();
    console.log(`WarContract deployed to ${warcontract.address}`);
    // address _countryMinter,
    // address _nationStrength,
    // address _military,
    // address _navyBattleAddress,
    // address _airBattleAddress,
    // address _groundBattle,
    // address _cruiseMissile,
    // address _forces,
    // address _wonders1,
    // address _keeper        
    const Wonders1 = await hardhat_1.ethers.getContractFactory("WondersContract1");
    wonderscontract1 = await Wonders1.deploy();
    await wonderscontract1.deployed();
    console.log(`Wonders1 deployed to ${wonderscontract1.address}`);
    // address _treasuryAddress,
    // address _wonderContract2Address,
    // address _wonderContract3Address,
    // address _wonderContract4Address,
    // address _infrastructureAddress
    const Wonders2 = await hardhat_1.ethers.getContractFactory("WondersContract2");
    wonderscontract2 = await Wonders2.deploy();
    await wonderscontract2.deployed();
    console.log(`Wonders2 deployed to ${wonderscontract2.address}`);
    // address _treasury,
    // address _infrastructure,
    // address _wonders1,
    // address _wonders3,
    // address _wonders4
    const Wonders3 = await hardhat_1.ethers.getContractFactory("WondersContract3");
    wonderscontract3 = await Wonders3.deploy();
    await wonderscontract3.deployed();
    console.log(`Wonders3 deployed to ${wonderscontract3.address}`);
    // address _treasuryAddress,
    // address _infrastructureAddress,
    // address _forces,
    // address _wonders1,
    // address _wonders2,
    // address _wonders4
    const Wonders4 = await hardhat_1.ethers.getContractFactory("WondersContract4");
    wonderscontract4 = await Wonders4.deploy();
    await wonderscontract4.deployed();
    console.log(`Wonders4 deployed to ${wonderscontract4.address}`);
    // address _treasuryAddress,
    // address _improvementsContract2Address,
    // address _improvementsContract3Address,
    // address _infrastructureAddress,
    // address _wonders1,
    // address _wonders3
    console.log("contracts deployed");
    await warbucks.settings(treasurycontract.address, countryminter.address);
    await aidcontract.settings(countryminter.address, treasurycontract.address, forcescontract.address, infrastructurecontract.address, keepercontract.address, wonderscontract1.address, senatecontract.address, countryparameterscontract.address);
    await airbattlecontract.settings(warcontract.address, fighterscontract.address, bomberscontract.address, infrastructurecontract.address, forcescontract.address, fighterlosses.address, countryminter.address, additionalairbattle.address);
    await additionalairbattle.settings(warcontract.address, fighterscontract.address, bomberscontract.address, infrastructurecontract.address, forcescontract.address, fighterlosses.address, countryminter.address, airbattlecontract.address);
    await billscontract.settings(countryminter.address, treasurycontract.address, wonderscontract1.address, wonderscontract2.address, wonderscontract3.address, wonderscontract4.address, forcescontract.address, fighterscontract.address, navycontract.address, resourcescontract.address);
    await billscontract.settings2(improvementscontract1.address, improvementscontract2.address, missilescontract.address, wonderscontract4.address, infrastructurecontract.address, bonusresourcescontract.address, navycontract2.address, countryparameterscontract.address);
    await bomberscontract.settings(countryminter.address, bombersmarketplace1.address, bombersmarketplace2.address, airbattlecontract.address, treasurycontract.address, fighterscontract.address, infrastructurecontract.address, warcontract.address);
    await bombersmarketplace1.settings(countryminter.address, bomberscontract.address, fighterscontract.address, fightersmarketplace1.address, infrastructurecontract.address, treasurycontract.address);
    await bombersmarketplace2.settings(countryminter.address, bomberscontract.address, fighterscontract.address, fightersmarketplace1.address, infrastructurecontract.address, treasurycontract.address);
    await countryminter.settings(countryparameterscontract.address, treasurycontract.address, infrastructurecontract.address, resourcescontract.address, missilescontract.address, senatecontract.address, warbucks.address, bonusresourcescontract.address);
    await countryminter.settings2(improvementscontract1.address, improvementscontract2.address, improvementscontract3.address, improvementscontract4.address, wonderscontract1.address, wonderscontract2.address, wonderscontract3.address, wonderscontract4.address);
    await countryminter.settings3(militarycontract.address, forcescontract.address, navycontract.address, navycontract2.address, navalactionscontract.address, fighterscontract.address, bomberscontract.address);
    await countryparameterscontract.settings(spyoperationscontract.address, countryminter.address, senatecontract.address, keepercontract.address, nukecontract.address, groundbattlecontract.address, wonderscontract1.address, treasurycontract.address);
    await crimecontract.settings(infrastructurecontract.address, improvementscontract1.address, improvementscontract2.address, improvementscontract3.address, improvementscontract4.address, countryparameterscontract.address, wonderscontract2.address);
    await cruisemissilecontract.settings(forcescontract.address, countryminter.address, warcontract.address, infrastructurecontract.address, missilescontract.address);
    await cruisemissilecontract.settings2(improvementscontract1.address, improvementscontract3.address, improvementscontract4.address, wonderscontract2.address);
    await environmentcontract.settings(countryminter.address, resourcescontract.address, infrastructurecontract.address, wonderscontract3.address, wonderscontract4.address, forcescontract.address, countryparameterscontract.address, additionaltaxescontract.address, missilescontract.address, nukecontract.address);
    await environmentcontract.settings2(improvementscontract1.address, improvementscontract3.address, improvementscontract4.address, bonusresourcescontract.address);
    await fighterscontract.settings(countryminter.address, fightersmarketplace1.address, fightersmarketplace2.address, treasurycontract.address, warcontract.address, infrastructurecontract.address, resourcescontract.address, improvementscontract1.address, airbattlecontract.address, wonderscontract1.address, fighterlosses.address);
    await fighterscontract.settings2(navycontract.address, bomberscontract.address);
    await fighterlosses.settings(fighterscontract.address, airbattlecontract.address);
    await fightersmarketplace1.settings(countryminter.address, bomberscontract.address, fighterscontract.address, treasurycontract.address, infrastructurecontract.address, resourcescontract.address, improvementscontract1.address, wonderscontract1.address, wonderscontract4.address, navycontract.address);
    await fightersmarketplace1.settings2(bonusresourcescontract.address, navycontract2.address);
    await fightersmarketplace2.settings(countryminter.address, bomberscontract.address, fighterscontract.address, fightersmarketplace1.address, treasurycontract.address, infrastructurecontract.address, resourcescontract.address, improvementscontract1.address);
    await forcescontract.settings(treasurycontract.address, aidcontract.address, spyoperationscontract.address, cruisemissilecontract.address, nukecontract.address, airbattlecontract.address, groundbattlecontract.address, warcontract.address);
    await forcescontract.settings2(infrastructurecontract.address, resourcescontract.address, improvementscontract1.address, improvementscontract2.address, wonderscontract1.address, countryminter.address, keepercontract.address, countryparameterscontract.address);
    await missilescontract.settings(treasurycontract.address, spyoperationscontract.address, nukecontract.address, airbattlecontract.address, wonderscontract2.address, nationstrengthcontract.address, infrastructurecontract.address);
    await missilescontract.settings2(resourcescontract.address, improvementscontract1.address, wonderscontract1.address, wonderscontract4.address, countryminter.address, keepercontract.address);
    await groundbattlecontract.settings(warcontract.address, infrastructurecontract.address, forcescontract.address, treasurycontract.address, countryminter.address, militarycontract.address);
    await groundbattlecontract.settings2(improvementscontract2.address, improvementscontract4.address, wonderscontract3.address, wonderscontract4.address, additionaltaxescontract.address, countryparameterscontract.address);
    await improvementscontract1.settings(treasurycontract.address, improvementscontract2.address, improvementscontract3.address, improvementscontract4.address, navycontract.address, additionalnavycontract.address, countryminter.address, wonderscontract1.address, infrastructurecontract.address);
    await improvementscontract2.settings(treasurycontract.address, forcescontract.address, wonderscontract1.address, countryminter.address, improvementscontract1.address, resourcescontract.address, spycontract.address);
    await improvementscontract3.settings(treasurycontract.address, additionalnavycontract.address, improvementscontract1.address, improvementscontract2.address, countryminter.address, bonusresourcescontract.address, wonderscontract4.address);
    await improvementscontract4.settings(treasurycontract.address, forcescontract.address, improvementscontract1.address, improvementscontract2.address, countryminter.address, wonderscontract4.address);
    await infrastructurecontract.settings1(resourcescontract.address, improvementscontract1.address, improvementscontract2.address, improvementscontract3.address, improvementscontract4.address, infrastructuremarketplace.address, technologymarketcontrat.address, landmarketcontract.address, bonusresourcescontract.address);
    await infrastructurecontract.settings2(wonderscontract1.address, wonderscontract2.address, wonderscontract3.address, wonderscontract4.address, treasurycontract.address, countryparameterscontract.address, forcescontract.address, aidcontract.address);
    await infrastructurecontract.settings3(spyoperationscontract.address, taxescontract.address, cruisemissilecontract.address, nukecontract.address, airbattlecontract.address, groundbattlecontract.address, countryminter.address, crimecontract.address, countryparameterscontract.address);
    await infrastructuremarketplace.settings(resourcescontract.address, countryparameterscontract.address, improvementscontract1.address, countryminter.address, wonderscontract2.address, wonderscontract3.address, treasurycontract.address, infrastructurecontract.address, bonusresourcescontract.address);
    await landmarketcontract.settings(resourcescontract.address, countryminter.address, infrastructurecontract.address, treasurycontract.address);
    await militarycontract.settings(spyoperationscontract.address, countryminter.address, keepercontract.address);
    await nationstrengthcontract.settings(infrastructurecontract.address, forcescontract.address, fighterscontract.address, bomberscontract.address, navycontract.address, missilescontract.address, navycontract2.address);
    await navycontract.settings(treasurycontract.address, improvementscontract1.address, improvementscontract3.address, improvementscontract4.address, resourcescontract.address, militarycontract.address, nukecontract.address, wonderscontract1.address, navalactionscontract.address, additionalnavycontract.address);
    await navycontract.settings2(countryminter.address, bonusresourcescontract.address, navycontract2.address, infrastructurecontract.address);
    await navycontract2.settings(treasurycontract.address, improvementscontract1.address, improvementscontract3.address, improvementscontract4.address, resourcescontract.address, militarycontract.address, nukecontract.address, wonderscontract1.address, navalactionscontract.address, additionalnavycontract.address);
    await navycontract2.settings2(countryminter.address, bonusresourcescontract.address, navycontract.address, infrastructurecontract.address);
    await navalactionscontract.settings(navalblockadecontract.address, breakblockadecontract.address, navalattackcontract.address, keepercontract.address, navycontract.address, navycontract2.address, countryminter.address);
    await additionalnavycontract.settings(navycontract.address, navalactionscontract.address, militarycontract.address, wonderscontract1.address, improvementscontract4.address, navycontract2.address);
    await navalblockadecontract.settings(navycontract.address, additionalnavycontract.address, navalactionscontract.address, warcontract.address, countryminter.address, keepercontract.address, breakblockadecontract.address);
    await breakblockadecontract.settings(countryminter.address, navalblockadecontract.address, navycontract.address, warcontract.address, improvementscontract4.address, navalactionscontract.address, navycontract2.address);
    await navalattackcontract.settings(navycontract.address, warcontract.address, improvementscontract4.address, navalactionscontract.address, navycontract2.address);
    await nukecontract.settings(countryminter.address, warcontract.address, wonderscontract1.address, wonderscontract4.address, improvementscontract3.address, improvementscontract4.address, infrastructurecontract.address, forcescontract.address, navycontract.address, missilescontract.address, keepercontract.address);
    await nukecontract.settings2(countryparameterscontract.address);
    await resourcescontract.settings(infrastructurecontract.address, improvementscontract2.address, countryminter.address, bonusresourcescontract.address, senatecontract.address, technologymarketcontrat.address, countryparameterscontract.address);
    await bonusresourcescontract.settings(infrastructurecontract.address, countryminter.address, resourcescontract.address, crimecontract.address);
    await senatecontract.settings(countryminter.address, countryparameterscontract.address, wonderscontract3.address, keepercontract.address, resourcescontract.address);
    await spycontract.settings(spyoperationscontract.address, treasurycontract.address, countryminter.address, improvementscontract2.address, wonderscontract1.address);
    await spyoperationscontract.settings(infrastructurecontract.address, forcescontract.address, militarycontract.address, nationstrengthcontract.address, wonderscontract1.address, wonderscontract2.address, treasurycontract.address, countryparameterscontract.address, missilescontract.address, countryminter.address);
    await spyoperationscontract.settings2(keepercontract.address, spycontract.address);
    await taxescontract.settings1(countryminter.address, infrastructurecontract.address, treasurycontract.address, improvementscontract1.address, improvementscontract2.address, improvementscontract3.address, improvementscontract4.address, additionaltaxescontract.address, bonusresourcescontract.address, keepercontract.address, environmentcontract.address);
    await taxescontract.settings2(countryparameterscontract.address, wonderscontract1.address, wonderscontract2.address, wonderscontract3.address, wonderscontract4.address, resourcescontract.address, forcescontract.address, militarycontract.address, crimecontract.address, navalblockadecontract.address);
    await additionaltaxescontract.settings(countryparameterscontract.address, wonderscontract1.address, wonderscontract2.address, wonderscontract3.address, wonderscontract4.address, resourcescontract.address, militarycontract.address, infrastructurecontract.address, bonusresourcescontract.address);
    await additionaltaxescontract.settings2(improvementscontract2.address, improvementscontract3.address, forcescontract.address);
    await technologymarketcontrat.settings(resourcescontract.address, improvementscontract3.address, infrastructurecontract.address, wonderscontract2.address, wonderscontract3.address, wonderscontract4.address, treasurycontract.address, countryminter.address, bonusresourcescontract.address, crimecontract.address);
    await treasurycontract.settings1(warbucks.address, wonderscontract1.address, wonderscontract2.address, wonderscontract3.address, wonderscontract4.address, improvementscontract1.address, improvementscontract2.address, improvementscontract3.address, improvementscontract4.address, infrastructurecontract.address);
    await treasurycontract.settings2(groundbattlecontract.address, countryminter.address, keepercontract.address, forcescontract.address, navycontract.address, fighterscontract.address, bomberscontract.address, aidcontract.address, taxescontract.address, billscontract.address, spyoperationscontract.address);
    await treasurycontract.settings3(navycontract2.address, missilescontract.address, infrastructuremarketplace.address, landmarketcontract.address, technologymarketcontrat.address, fightersmarketplace1.address, fightersmarketplace2.address, bombersmarketplace1.address, bombersmarketplace2.address, countryparameterscontract.address, spycontract.address);
    await warcontract.settings(countryminter.address, nationstrengthcontract.address, militarycontract.address, breakblockadecontract.address, navalattackcontract.address, airbattlecontract.address, groundbattlecontract.address, cruisemissilecontract.address, forcescontract.address, wonderscontract1.address, keepercontract.address);
    await warcontract.settings2(treasurycontract.address, forcescontract.address, navalblockadecontract.address, nukecontract.address);
    await wonderscontract1.settings(treasurycontract.address, wonderscontract2.address, wonderscontract3.address, wonderscontract4.address, infrastructurecontract.address, countryminter.address);
    await wonderscontract2.settings(treasurycontract.address, infrastructurecontract.address, wonderscontract1.address, wonderscontract3.address, wonderscontract4.address, countryminter.address);
    await wonderscontract3.settings(treasurycontract.address, infrastructurecontract.address, forcescontract.address, wonderscontract1.address, wonderscontract2.address, wonderscontract4.address, countryminter.address);
    await wonderscontract4.settings(treasurycontract.address, improvementscontract2.address, improvementscontract3.address, improvementscontract4.address, infrastructurecontract.address, wonderscontract1.address, wonderscontract3.address, countryminter.address);
    console.log("settings initiated");
    const eaPath = "external_adapters/Contracts";
    if (chainId == 31337) {
        const contractMetadataLocation = `${eaPath}/contract-metadata.json`;
        let contractMetadata;
        let countryMinterArtifact = await hardhat_1.artifacts.readArtifact("CountryMinter");
        let countryMinterAbi = countryMinterArtifact.abi;
        let forcesArtifact = await hardhat_1.artifacts.readArtifact("ForcesContract");
        let forcesAbi = forcesArtifact.abi;
        let warbucksArtifact = await hardhat_1.artifacts.readArtifact("WarBucks");
        let warbucksAbi = warbucksArtifact.abi;
        let treasuryArtifact = await hardhat_1.artifacts.readArtifact("TreasuryContract");
        let treasuryAbi = treasuryArtifact.abi;
        let infrastructureArtifact = await hardhat_1.artifacts.readArtifact("InfrastructureMarketContract");
        let infrastructureAbi = infrastructureArtifact.abi;
        let technologyArtifact = await hardhat_1.artifacts.readArtifact("TechnologyMarketContract");
        let technologyAbi = technologyArtifact.abi;
        let militaryArtifact = await hardhat_1.artifacts.readArtifact("MilitaryContract");
        let militaryAbi = militaryArtifact.abi;
        let warArtifact = await hardhat_1.artifacts.readArtifact("WarContract");
        let warAbi = warArtifact.abi;
        let nationStrengthArtifact = await hardhat_1.artifacts.readArtifact("NationStrengthContract");
        let nationStrengthAbi = nationStrengthArtifact.abi;
        let spyOperationArtifact = await hardhat_1.artifacts.readArtifact("SpyOperationsContract");
        let spyOperationAbi = spyOperationArtifact.abi;
        let groundBattleArtifact = await hardhat_1.artifacts.readArtifact("GroundBattleContract");
        let groundBattleAbi = groundBattleArtifact.abi;
        // Read Contract Metadata
        try {
            if (fs_1.default.existsSync(contractMetadataLocation)) {
                contractMetadata = fs_1.default.readFileSync(contractMetadataLocation).toString();
            }
            else {
                contractMetadata = "{}";
            }
        }
        catch (e) {
            console.log(e);
        }
        contractMetadata = JSON.parse(contractMetadata);
        if (chainId == 31337) {
            contractMetadata.HARDHAT = {
                ...contractMetadata.HARDHAT,
                countryminter: {
                    address: countryminter.address,
                    ABI: countryMinterAbi,
                },
                forcescontract: {
                    address: forcescontract.address,
                    ABI: forcesAbi,
                },
                nationstrengthcontract: {
                    address: nationstrengthcontract.address,
                    ABI: nationStrengthAbi,
                },
                treasurycontract: {
                    address: treasurycontract.address,
                    ABI: treasuryAbi,
                },
                spyoperationscontract: {
                    address: spyoperationscontract.address,
                    ABI: spyOperationAbi,
                },
                groundbattlecontract: {
                    address: groundbattlecontract.address,
                    ABI: groundBattleAbi,
                }
            };
        }
        else if (chainId == 4002) {
            contractMetadata.TESTNET = {
                ...contractMetadata.TESTNET,
                countryminter: {
                    address: countryminter.address,
                    ABI: countryMinterAbi,
                },
                forcescontract: {
                    address: forcescontract.address,
                    ABI: forcesAbi,
                },
                nationstrengthcontract: {
                    address: nationstrengthcontract.address,
                    ABI: nationStrengthAbi,
                },
                treasurycontract: {
                    address: treasurycontract.address,
                    ABI: treasuryAbi,
                },
                spyoperationscontract: {
                    address: spyoperationscontract.address,
                    ABI: spyOperationAbi,
                }
            };
        }
        // if(chainId == fantomTestnetChainId) {
        // }
        fs_1.default.writeFileSync(contractMetadataLocation, JSON.stringify(contractMetadata, null, 2));
        const scriptMetadataLocation = `script-metadata.json`;
        let scriptMetadata;
        try {
            if (fs_1.default.existsSync(scriptMetadataLocation)) {
                scriptMetadata = fs_1.default.readFileSync(scriptMetadataLocation).toString();
            }
            else {
                scriptMetadata = "{}";
            }
        }
        catch (e) {
            console.log(e);
        }
        scriptMetadata = JSON.parse(scriptMetadata);
        scriptMetadata.HARDHAT = {
            ...scriptMetadata.HARDHAT,
            countryminter: {
                address: countryminter.address,
                ABI: countryMinterAbi,
            },
            forcescontract: {
                address: forcescontract.address,
                ABI: forcesAbi,
            },
            warbucks: {
                address: warbucks.address,
                ABI: warbucksAbi,
            },
            treasurycontract: {
                address: treasurycontract.address,
                ABI: treasuryAbi,
            },
            infrastructurecontract: {
                address: infrastructuremarketplace.address,
                ABI: infrastructureAbi,
            },
            technologymarketcontract: {
                address: technologymarketcontrat.address,
                ABI: technologyAbi,
            },
            militarycontract: {
                address: militarycontract.address,
                ABI: militaryAbi,
            },
            warcontract: {
                address: warcontract.address,
                ABI: warAbi,
            }
        };
        fs_1.default.writeFileSync(scriptMetadataLocation, JSON.stringify(scriptMetadata, null, 2));
    }
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
