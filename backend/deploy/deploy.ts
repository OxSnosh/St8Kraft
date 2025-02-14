//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
import { network, artifacts } from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import { INITIAL_SUPPLY } from "../helper-hardhat-config"
import { 
    WarBucks, 
    MetaNationsGovToken,
    AidContract,
    AirBattleContract,
    AdditionalAirBattle,
    BillsContract,
    BombersContract,
    BombersMarketplace1,
    BombersMarketplace2,
    CountryMinter,
    CountryParametersContract,
    CrimeContract,
    CruiseMissileContract,
    EnvironmentContract,
    FightersContract,
    FighterLosses,
    FightersMarketplace1,
    FightersMarketplace2,
    ForcesContract,
    MissilesContract,
    GroundBattleContract,
    ImprovementsContract1,
    ImprovementsContract2,
    ImprovementsContract3,
    ImprovementsContract4,
    InfrastructureContract,
    InfrastructureMarketContract,
    KeeperContract,
    LandMarketContract,
    MilitaryContract,
    NationStrengthContract,
    NavalActionsContract,
    NavyContract,
    NavyContract2,
    AdditionalNavyContract,
    NavalBlockadeContract,
    BreakBlocadeContract,
    NavalAttackContract,
    NukeContract,
    ResourcesContract,
    SenateContract,
    SpyContract,
    SpyOperationsContract,
    TaxesContract,
    AdditionalTaxesContract,
    TechnologyMarketContract,
    TreasuryContract,
    WarContract,
    WondersContract1,
    WondersContract2,
    WondersContract3,
    WondersContract4,
    VRFConsumerBaseV2,
    VRFCoordinatorV2Mock,
    BonusResourcesContract
} from "../typechain-types"
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { networkConfig } from "../helper-hardhat-config"
import fs from "fs"


const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, ethers } = hre as any;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    let chainId = network.config.chainId
    let subscriptionId    
    let vrfCoordinatorV2Mock
    let vrfCoordinatorV2Address    

    const FUND_AMOUNT = ethers.utils.parseEther("1")

    if (chainId == 31337) {
        const BASE_FEE = "250000000000000000" // 0.25 is this the premium in LINK?
        const GAS_PRICE_LINK = 1e9 // link per gas, is this the gas lane? // 0.000000001 LINK per gas
        // create VRFV2 Subscription
        const VRFCoordinatorV2Mock = await ethers.getContractFactory("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Mock = await VRFCoordinatorV2Mock.deploy(BASE_FEE, GAS_PRICE_LINK)
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait()
        subscriptionId = transactionReceipt.events[0].args.subId
        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        // vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        // subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    var gasLane = networkConfig[31337]["gasLane"]
    var callbackGasLimit =  networkConfig[31337]["callbackGasLimit"] 
    
    let signer0
    let signer1
    let signers
    let addrs
    
    signers = await ethers.getSigners();
    signer0 = signers[0];
    signer1 = signers[1];

    let warbucks: WarBucks  
    let metanationsgovtoken: MetaNationsGovToken
    let aidcontract: AidContract
    let airbattlecontract: AirBattleContract
    let additionalairbattle: AdditionalAirBattle
    let billscontract: BillsContract
    let bombersmarketplace1: BombersMarketplace1
    let bombersmarketplace2: BombersMarketplace2
    let bomberscontract: BombersContract
    let countryminter: CountryMinter
    let countryparameterscontract: CountryParametersContract
    let crimecontract: CrimeContract
    let cruisemissilecontract: CruiseMissileContract
    let environmentcontract: EnvironmentContract
    let fighterscontract: FightersContract
    let fighterlosses: FighterLosses
    let fightersmarketplace1: FightersMarketplace1
    let fightersmarketplace2: FightersMarketplace2
    let forcescontract: ForcesContract
    let missilescontract: MissilesContract
    let groundbattlecontract: GroundBattleContract
    let improvementscontract1: ImprovementsContract1
    let improvementscontract2: ImprovementsContract2
    let improvementscontract3: ImprovementsContract3
    let improvementscontract4: ImprovementsContract4
    let infrastructurecontract: InfrastructureContract
    let infrastructuremarketplace: InfrastructureMarketContract
    let keepercontract: KeeperContract
    let landmarketcontract: LandMarketContract
    let militarycontract: MilitaryContract
    let nationstrengthcontract: NationStrengthContract
    let navalactionscontract: NavalActionsContract
    let navycontract: NavyContract
    let navycontract2: NavyContract2
    let additionalnavycontract: AdditionalNavyContract
    let navalblockadecontract: NavalBlockadeContract
    let breakblockadecontract: BreakBlocadeContract
    let navalattackcontract: NavalAttackContract
    let nukecontract: NukeContract
    let resourcescontract: ResourcesContract
    let bonusresourcescontract: BonusResourcesContract
    let senatecontract: SenateContract
    let spycontract: SpyContract
    let spyoperationscontract: SpyOperationsContract
    let taxescontract: TaxesContract
    let additionaltaxescontract: AdditionalTaxesContract
    let technologymarketcontrat: TechnologyMarketContract
    let treasurycontract: TreasuryContract
    let warcontract: WarContract
    let wonderscontract1: WondersContract1
    let wonderscontract2: WondersContract2
    let wonderscontract3: WondersContract3
    let wonderscontract4: WondersContract4

    console.log("Deploying contracts with account:", deployer);

    warbucks = await deploy("WarBucks", { from: deployer, args: [INITIAL_SUPPLY], log: true });
    let warbucksContract = await ethers.getContractAt("WarBucks", warbucks.address);

    metanationsgovtoken = await deploy("MetaNationsGovToken", { from: deployer, args: [INITIAL_SUPPLY], log: true });
    let metanationsgovtokenContract = await ethers.getContractAt("MetaNationsGovToken", metanationsgovtoken.address);

    aidcontract = await deploy("AidContract", { from: deployer, args: [], log: true });
    let deployedAidContract = await ethers.getContractAt("AidContract", aidcontract.address);

    airbattlecontract = await deploy("AirBattleContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
    let deployedAirBattleContract = await ethers.getContractAt("AirBattleContract", airbattlecontract.address);

    additionalairbattle = await deploy("AdditionalAirBattle", { from: deployer, args: [], log: true });
    let deployedAdditionalAirBattle = await ethers.getContractAt("AdditionalAirBattle", additionalairbattle.address);

    billscontract = await deploy("BillsContract", { from: deployer, args: [], log: true });
    let deployedBillsContract = await ethers.getContractAt("BillsContract", billscontract.address);
    
    bomberscontract = await deploy("BombersContract", { from: deployer, args: [], log: true });
    let deployedBombersContract = await ethers.getContractAt("BombersContract", bomberscontract.address);

    bombersmarketplace1 = await deploy("BombersMarketplace1", { from: deployer, args: [], log: true });
    let deployedBombersMarketplace1 = await ethers.getContractAt("BombersMarketplace1", bombersmarketplace1.address);

    bombersmarketplace2 = await deploy("BombersMarketplace2", { from: deployer, args: [], log: true });
    let deployedBombersMarketplace2 = await ethers.getContractAt("BombersMarketplace2", bombersmarketplace2.address);

    countryminter = await deploy("CountryMinter", { from: deployer, args: [], log: true });
    let deployedCountryMinter = await ethers.getContractAt("CountryMinter", countryminter.address);

    countryparameterscontract = await deploy("CountryParametersContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
    let deployedCountryParametersContract = await ethers.getContractAt("CountryParametersContract", countryparameterscontract.address);
    
    crimecontract = await deploy("CrimeContract", { from: deployer, args: [], log: true });
    let deployedCrimeContract = await ethers.getContractAt("CrimeContract", crimecontract.address);

    cruisemissilecontract = await deploy("CruiseMissileContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
    let deployedCruiseMissileContract = await ethers.getContractAt("CruiseMissileContract", cruisemissilecontract.address);

    environmentcontract = await deploy("EnvironmentContract", { from: deployer, args: [], log: true });
    let deployedEnvironmentContract = await ethers.getContractAt("EnvironmentContract", environmentcontract.address);

    fighterscontract = await deploy("FightersContract", { from: deployer, args: [], log: true });
    let deployedFightersContract = await ethers.getContractAt("FightersContract", fighterscontract.address);

    fighterlosses = await deploy("FighterLosses", { from: deployer, args: [], log: true });
    let deployedFighterLosses = await ethers.getContractAt("FighterLosses", fighterlosses.address);

    fightersmarketplace1 = await deploy("FightersMarketplace1", { from: deployer, args: [], log: true });
    let deployedFightersMarketplace1 = await ethers.getContractAt("FightersMarketplace1", fightersmarketplace1.address);

    fightersmarketplace2 = await deploy("FightersMarketplace2", { from: deployer, args: [], log: true });
    let deployedFightersMarketplace2 = await ethers.getContractAt("FightersMarketplace2", fightersmarketplace2.address);

    forcescontract = await deploy("ForcesContract", { from: deployer, args: [], log: true });
    let deployedForcesContract = await ethers.getContractAt("ForcesContract", forcescontract.address);

    spycontract = await deploy("SpyContract", { from: deployer, args: [], log: true });
    let deployedSpyContract = await ethers.getContractAt("SpyContract", spycontract.address);

    missilescontract = await deploy("MissilesContract", { from: deployer, args: [], log: true });
    let deployedMissilesContract = await ethers.getContractAt("MissilesContract", missilescontract.address);

    groundbattlecontract = await deploy("GroundBattleContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
    let deployedGroundBattleContract = await ethers.getContractAt("GroundBattleContract", groundbattlecontract.address);

    improvementscontract1 = await deploy("ImprovementsContract1", { from: deployer, args: [], log: true });
    let deployedImprovementsContract1 = await ethers.getContractAt("ImprovementsContract1", improvementscontract1.address);

    improvementscontract2 = await deploy("ImprovementsContract2", { from: deployer, args: [], log: true });
    let deployedImprovementsContract2 = await ethers.getContractAt("ImprovementsContract2", improvementscontract2.address);

    improvementscontract3 = await deploy("ImprovementsContract3", { from: deployer, args: [], log: true });
    let deployedImprovementsContract3 = await ethers.getContractAt("ImprovementsContract3", improvementscontract3.address);

    improvementscontract4 = await deploy("ImprovementsContract4", { from: deployer, args: [], log: true });
    let deployedImprovementsContract4 = await ethers.getContractAt("ImprovementsContract4", improvementscontract4.address);

    infrastructurecontract = await deploy("InfrastructureContract", { from: deployer, args: [], log: true });
    let deployedInfrastructureContract = await ethers.getContractAt("InfrastructureContract", infrastructurecontract.address);

    infrastructuremarketplace = await deploy("InfrastructureMarketContract", { from: deployer, args: [], log: true });
    let deployedInfrastructureMarketContract = await ethers.getContractAt("InfrastructureMarketContract", infrastructuremarketplace.address);

    keepercontract = await deploy("KeeperContract", { from: deployer, args: [86400], log: true });
    let deployedKeeperContract = await ethers.getContractAt("KeeperContract", keepercontract.address);

    landmarketcontract = await deploy("LandMarketContract", { from: deployer, args: [], log: true });
    let deployedLandMarketContract = await ethers.getContractAt("LandMarketContract", landmarketcontract.address);

    militarycontract = await deploy("MilitaryContract", { from: deployer, args: [], log: true });
    let deployedMilitaryContract = await ethers.getContractAt("MilitaryContract", militarycontract.address);

    nationstrengthcontract = await deploy("NationStrengthContract", { from: deployer, args: [], log: true });
    let deployedNationStrengthContract = await ethers.getContractAt("NationStrengthContract", nationstrengthcontract.address);

    navycontract = await deploy("NavyContract", { from: deployer, args: [], log: true });
    let deployedNavyContract = await ethers.getContractAt("NavyContract", navycontract.address);

    navycontract2 = await deploy("NavyContract2", { from: deployer, args: [], log: true });
    let deployedNavyContract2 = await ethers.getContractAt("NavyContract2", navycontract2.address);

    additionalnavycontract = await deploy("AdditionalNavyContract", { from: deployer, args: [], log: true });
    let deployedAdditionalNavyContract = await ethers.getContractAt("AdditionalNavyContract", additionalnavycontract.address);

    navalactionscontract = await deploy("NavalActionsContract", { from: deployer, args: [], log: true });
    let deployedNavalActionsContract = await ethers.getContractAt("NavalActionsContract", navalactionscontract.address);

    navalblockadecontract = await deploy("NavalBlockadeContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
    let deployedNavalBlockadeContract = await ethers.getContractAt("NavalBlockadeContract", navalblockadecontract.address);

    breakblockadecontract = await deploy("BreakBlocadeContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
    let deployedBreakBlocadeContract = await ethers.getContractAt("BreakBlocadeContract", breakblockadecontract.address);

    navalattackcontract = await deploy("NavalAttackContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
    let deployedNavalAttackContract = await ethers.getContractAt("NavalAttackContract", navalattackcontract.address);

    nukecontract = await deploy("NukeContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
    let deployedNukeContract = await ethers.getContractAt("NukeContract", nukecontract.address);

    resourcescontract = await deploy("ResourcesContract", { from: deployer, args: [vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit], log: true });
    let deployedResourcesContract = await ethers.getContractAt("ResourcesContract", resourcescontract.address);

    bonusresourcescontract = await deploy("BonusResourcesContract", { from: deployer, args: [], log: true });
    let deployedBonusResourcesContract = await ethers.getContractAt("BonusResourcesContract", bonusresourcescontract.address);

    senatecontract = await deploy("SenateContract", { from: deployer, args: [20], log: true });
    let deployedSenateContract = await ethers.getContractAt("SenateContract", senatecontract.address);

    spyoperationscontract = await deploy("SpyOperationsContract", { from: deployer, args: [], log: true });
    let deployedSpyOperationsContract = await ethers.getContractAt("SpyOperationsContract", spyoperationscontract.address);

    taxescontract = await deploy("TaxesContract", { from: deployer, args: [], log: true });
    let deployedTaxesContract = await ethers.getContractAt("TaxesContract", taxescontract.address);

    additionaltaxescontract = await deploy("AdditionalTaxesContract", { from: deployer, args: [], log: true });
    let deployedAdditionalTaxesContract = await ethers.getContractAt("AdditionalTaxesContract", additionaltaxescontract.address);

    technologymarketcontrat = await deploy("TechnologyMarketContract", { from: deployer, args: [], log: true });
    let deployedTechnologyMarketContract = await ethers.getContractAt("TechnologyMarketContract", technologymarketcontrat.address);

    treasurycontract = await deploy("TreasuryContract", { from: deployer, args: [], log: true });
    let deployedTreasuryContract = await ethers.getContractAt("TreasuryContract", treasurycontract.address);

    warcontract = await deploy("WarContract", { from: deployer, args: [], log: true });
    let deployedWarContract = await ethers.getContractAt("WarContract", warcontract.address);

    wonderscontract1 = await deploy("WondersContract1", { from: deployer, args: [], log: true });
    let deployedWondersContract1 = await ethers.getContractAt("WondersContract1", wonderscontract1.address);
    
    wonderscontract2 = await deploy("WondersContract2", { from: deployer, args: [], log: true });
    let deployedWondersContract2 = await ethers.getContractAt("WondersContract2", wonderscontract2.address);

    wonderscontract3 = await deploy("WondersContract3", { from: deployer, args: [], log: true });
    let deployedWondersContract3 = await ethers.getContractAt("WondersContract3", wonderscontract3.address);

    wonderscontract4 = await deploy("WondersContract4", { from: deployer, args: [], log: true });
    let deployedWondersContract4 = await ethers.getContractAt("WondersContract4", wonderscontract4.address);

    console.log("✅ All contracts deployed successfully!");

    await warbucksContract.settings(
        treasurycontract.address,
        countryminter.address
    )
    
    await deployedAidContract.settings(
        countryminter.address, 
        treasurycontract.address, 
        forcescontract.address, 
        infrastructurecontract.address, 
        keepercontract.address, 
        wonderscontract1.address,
        senatecontract.address,
        countryparameterscontract.address)

    await deployedAirBattleContract.settings(
        warcontract.address, 
        fighterscontract.address, 
        bomberscontract.address, 
        infrastructurecontract.address, 
        forcescontract.address, 
        fighterlosses.address,
        countryminter.address,
        additionalairbattle.address
    )

    await deployedAdditionalAirBattle.settings(
        warcontract.address, 
        fighterscontract.address, 
        bomberscontract.address, 
        infrastructurecontract.address, 
        forcescontract.address, 
        fighterlosses.address,
        countryminter.address,
        airbattlecontract.address
    )

    await deployedBillsContract.settings(
        countryminter.address,
        treasurycontract.address,
        wonderscontract1.address,
        wonderscontract2.address,
        wonderscontract3.address,
        wonderscontract4.address,
        forcescontract.address,
        fighterscontract.address,
        navycontract.address,
        resourcescontract.address)
    await deployedBillsContract.settings2(
        improvementscontract1.address,
        improvementscontract2.address,
        missilescontract.address,
        wonderscontract4.address,
        infrastructurecontract.address,
        bonusresourcescontract.address,
        navycontract2.address,
        countryparameterscontract.address)
    
    await deployedBombersContract.settings(
        countryminter.address, 
        bombersmarketplace1.address,
        bombersmarketplace2.address,
        airbattlecontract.address,
        treasurycontract.address,
        fighterscontract.address,
        infrastructurecontract.address,
        warcontract.address)

    await deployedBombersMarketplace1.settings(
        countryminter.address,
        bomberscontract.address,
        fighterscontract.address,
        fightersmarketplace1.address,
        infrastructurecontract.address,
        treasurycontract.address)

    await deployedBombersMarketplace2.settings(
        countryminter.address,
        bomberscontract.address,
        fighterscontract.address,
        fightersmarketplace1.address,
        infrastructurecontract.address,
        treasurycontract.address)
    
    await deployedCountryMinter.settings(
        countryparameterscontract.address,
        treasurycontract.address,
        infrastructurecontract.address,
        resourcescontract.address,
        missilescontract.address,
        senatecontract.address,
        warbucks.address,
        bonusresourcescontract.address)
    await deployedCountryMinter.settings2(
        improvementscontract1.address,
        improvementscontract2.address,
        improvementscontract3.address,
        improvementscontract4.address,
        wonderscontract1.address,
        wonderscontract2.address,
        wonderscontract3.address,
        wonderscontract4.address)
    await deployedCountryMinter.settings3(
        militarycontract.address,
        forcescontract.address,
        navycontract.address,
        navycontract2.address,
        navalactionscontract.address,
        fighterscontract.address,
        bomberscontract.address)
    
    await deployedCountryParametersContract.settings(
        spyoperationscontract.address,
        countryminter.address,
        senatecontract.address,
        keepercontract.address,
        nukecontract.address,
        groundbattlecontract.address,
        wonderscontract1.address,
        treasurycontract.address
    )

    await deployedCrimeContract.settings(
        infrastructurecontract.address,
        improvementscontract1.address,
        improvementscontract2.address,
        improvementscontract3.address,
        improvementscontract4.address,
        countryparameterscontract.address,
        wonderscontract2.address)
    
    await deployedCruiseMissileContract.settings(
        forcescontract.address,
        countryminter.address,
        warcontract.address,
        infrastructurecontract.address,
        missilescontract.address)
    await deployedCruiseMissileContract.settings2(
        improvementscontract1.address,
        improvementscontract3.address,
        improvementscontract4.address,
        wonderscontract2.address)
    
    await deployedEnvironmentContract.settings(
        countryminter.address,
        resourcescontract.address,
        infrastructurecontract.address,
        wonderscontract3.address,
        wonderscontract4.address,
        forcescontract.address,
        countryparameterscontract.address,
        additionaltaxescontract.address,
        missilescontract.address,
        nukecontract.address)
    await deployedEnvironmentContract.settings2(
        improvementscontract1.address,
        improvementscontract3.address,
        improvementscontract4.address,
        bonusresourcescontract.address)
    
    await deployedFightersContract.settings(
        countryminter.address,
        fightersmarketplace1.address,
        fightersmarketplace2.address,
        treasurycontract.address,
        warcontract.address,
        infrastructurecontract.address,
        resourcescontract.address,
        improvementscontract1.address,
        airbattlecontract.address,
        wonderscontract1.address,
        fighterlosses.address)
    await deployedFightersContract.settings2(
        navycontract.address,
        bomberscontract.address)
    
    await deployedFighterLosses.settings(
        fighterscontract.address,
        airbattlecontract.address)
    
    await deployedFightersMarketplace1.settings(
        countryminter.address,
        bomberscontract.address,
        fighterscontract.address,
        treasurycontract.address,
        infrastructurecontract.address,
        resourcescontract.address,
        improvementscontract1.address,
        wonderscontract1.address,
        wonderscontract4.address,
        navycontract.address)
    await deployedFightersMarketplace1.settings2(
        bonusresourcescontract.address,
        navycontract2.address
    )
    
    await deployedFightersMarketplace2.settings(
        countryminter.address,
        bomberscontract.address,
        fighterscontract.address,
        fightersmarketplace1.address,
        treasurycontract.address,
        infrastructurecontract.address,
        resourcescontract.address,
        improvementscontract1.address)
    
    await deployedForcesContract.settings(
        treasurycontract.address,
        aidcontract.address,
        spyoperationscontract.address,
        cruisemissilecontract.address,
        nukecontract.address,
        airbattlecontract.address,
        groundbattlecontract.address,
        warcontract.address)
    await deployedForcesContract.settings2(
        infrastructurecontract.address,
        resourcescontract.address,
        improvementscontract1.address,
        improvementscontract2.address,
        wonderscontract1.address,
        countryminter.address,
        keepercontract.address,
        countryparameterscontract.address)
    
    await deployedMissilesContract.settings(
        treasurycontract.address,
        spyoperationscontract.address,
        nukecontract.address,
        airbattlecontract.address,
        wonderscontract2.address,
        nationstrengthcontract.address,
        infrastructurecontract.address)
    await deployedMissilesContract.settings2(
        resourcescontract.address,
        improvementscontract1.address,
        wonderscontract1.address,
        wonderscontract4.address,
        countryminter.address,
        keepercontract.address)
        
    await deployedGroundBattleContract.settings(
        warcontract.address,
        infrastructurecontract.address,
        forcescontract.address,
        treasurycontract.address,
        countryminter.address,
        militarycontract.address)
    await deployedGroundBattleContract.settings2(
        improvementscontract2.address,
        improvementscontract4.address,
        wonderscontract3.address,
        wonderscontract4.address,
        additionaltaxescontract.address,
        countryparameterscontract.address,)
    
    await deployedImprovementsContract1.settings(
        treasurycontract.address,
        improvementscontract2.address,
        improvementscontract3.address,
        improvementscontract4.address,
        navycontract.address,
        additionalnavycontract.address,
        countryminter.address,
        wonderscontract1.address,
        infrastructurecontract.address)

    await deployedImprovementsContract2.settings(
        treasurycontract.address,
        forcescontract.address,
        wonderscontract1.address,
        countryminter.address,
        improvementscontract1.address,
        resourcescontract.address,
        spycontract.address
        )
    
    await deployedImprovementsContract3.settings(
        treasurycontract.address,
        additionalnavycontract.address,
        improvementscontract1.address,
        improvementscontract2.address,
        countryminter.address,
        bonusresourcescontract.address,
        wonderscontract4.address
        )
    
    await deployedImprovementsContract4.settings(
        treasurycontract.address,
        forcescontract.address,
        improvementscontract1.address,
        improvementscontract2.address,
        countryminter.address,
        wonderscontract4.address
        )
    
    await deployedInfrastructureContract.settings1(
        resourcescontract.address,
        improvementscontract1.address,
        improvementscontract2.address,
        improvementscontract3.address,
        improvementscontract4.address,
        infrastructuremarketplace.address,
        technologymarketcontrat.address,
        landmarketcontract.address,
        bonusresourcescontract.address
    )
    await deployedInfrastructureContract.settings2(
        wonderscontract1.address,
        wonderscontract2.address,
        wonderscontract3.address,
        wonderscontract4.address,
        treasurycontract.address,
        countryparameterscontract.address,
        forcescontract.address,
        aidcontract.address
    )
    await deployedInfrastructureContract.settings3(
        spyoperationscontract.address,
        taxescontract.address,
        cruisemissilecontract.address,
        nukecontract.address,
        airbattlecontract.address,
        groundbattlecontract.address,
        countryminter.address,
        crimecontract.address,
        countryparameterscontract.address
    )

    await deployedInfrastructureMarketContract.settings(
        resourcescontract.address,
        countryparameterscontract.address,
        improvementscontract1.address,
        countryminter.address,
        wonderscontract2.address,
        wonderscontract3.address,
        treasurycontract.address,
        infrastructurecontract.address,
        bonusresourcescontract.address
    )

    await deployedLandMarketContract.settings(
        resourcescontract.address,
        countryminter.address,
        infrastructurecontract.address,
        treasurycontract.address
    )

    await deployedMilitaryContract.settings(
        spyoperationscontract.address,
        countryminter.address,
        keepercontract.address
    )

    await deployedNationStrengthContract.settings(
        infrastructurecontract.address,
        forcescontract.address,
        fighterscontract.address,
        bomberscontract.address,
        navycontract.address,
        missilescontract.address,
        navycontract2.address
    )

    await deployedNavyContract.settings(
        treasurycontract.address,
        improvementscontract1.address,
        improvementscontract3.address,
        improvementscontract4.address,
        resourcescontract.address,
        militarycontract.address,
        nukecontract.address,
        wonderscontract1.address,
        navalactionscontract.address,
        additionalnavycontract.address
    )
    await deployedNavyContract.settings2(
        countryminter.address,
        bonusresourcescontract.address,
        navycontract2.address,
        infrastructurecontract.address
    )

    await deployedNavyContract2.settings(
        treasurycontract.address,
        improvementscontract1.address,
        improvementscontract3.address,
        improvementscontract4.address,
        resourcescontract.address,
        militarycontract.address,
        nukecontract.address,
        wonderscontract1.address,
        navalactionscontract.address,
        additionalnavycontract.address
    )
    await deployedNavyContract2.settings2(
        countryminter.address,
        bonusresourcescontract.address,
        navycontract.address,
        infrastructurecontract.address
    )


    await deployedNavalActionsContract.settings(
        navalblockadecontract.address,
        breakblockadecontract.address,
        navalattackcontract.address,
        keepercontract.address,
        navycontract.address,
        navycontract2.address,
        countryminter.address
    )

    await deployedAdditionalNavyContract.settings(
        navycontract.address,
        navalactionscontract.address,
        militarycontract.address,
        wonderscontract1.address,
        improvementscontract4.address,
        navycontract2.address
    )

    await deployedNavalBlockadeContract.settings(
        navycontract.address,
        additionalnavycontract.address,
        navalactionscontract.address,
        warcontract.address,
        countryminter.address,
        keepercontract.address,
        breakblockadecontract.address
    )

    await deployedBreakBlocadeContract.settings(
        countryminter.address,
        navalblockadecontract.address,
        navycontract.address,
        warcontract.address,
        improvementscontract4.address,
        navalactionscontract.address,
        navycontract2.address
    )

    await deployedNavalAttackContract.settings(
        navycontract.address,
        warcontract.address,
        improvementscontract4.address,
        navalactionscontract.address,
        navycontract2.address
    )

    await deployedNukeContract.settings(
        countryminter.address,
        warcontract.address,
        wonderscontract1.address,
        wonderscontract4.address,
        improvementscontract3.address,
        improvementscontract4.address,
        infrastructurecontract.address,
        forcescontract.address,
        navycontract.address,
        missilescontract.address,
        keepercontract.address
    )
    await deployedNukeContract.settings2(
        countryparameterscontract.address
    )

    await deployedResourcesContract.settings(
        infrastructurecontract.address,
        improvementscontract2.address,
        countryminter.address,
        bonusresourcescontract.address,
        senatecontract.address,
        technologymarketcontrat.address,
        countryparameterscontract.address
    )
    await deployedBonusResourcesContract.settings(
        infrastructurecontract.address,
        countryminter.address,
        resourcescontract.address,
        crimecontract.address
    )

    await deployedSenateContract.settings(
        countryminter.address,
        countryparameterscontract.address,
        wonderscontract3.address,
        keepercontract.address,
        resourcescontract.address
    )

    await deployedSpyContract.settings(
        spyoperationscontract.address,
        treasurycontract.address,
        countryminter.address,
        improvementscontract2.address,
        wonderscontract1.address
        )

    await deployedSpyOperationsContract.settings(
        infrastructurecontract.address,
        forcescontract.address,
        militarycontract.address,
        nationstrengthcontract.address,
        wonderscontract1.address,
        wonderscontract2.address,
        treasurycontract.address,
        countryparameterscontract.address,
        missilescontract.address,
        countryminter.address
    )
    await deployedSpyOperationsContract.settings2(
        keepercontract.address,
        spycontract.address
    )

    await deployedTaxesContract.settings1(
        countryminter.address,
        infrastructurecontract.address,
        treasurycontract.address,
        improvementscontract1.address,
        improvementscontract2.address,
        improvementscontract3.address,
        improvementscontract4.address,
        additionaltaxescontract.address,
        bonusresourcescontract.address,
        keepercontract.address,
        environmentcontract.address
    )
    await deployedTaxesContract.settings2(
        countryparameterscontract.address,
        wonderscontract1.address,
        wonderscontract2.address,
        wonderscontract3.address,
        wonderscontract4.address,
        resourcescontract.address,
        forcescontract.address,
        militarycontract.address,
        crimecontract.address,
        navalblockadecontract.address
    )

    await deployedAdditionalTaxesContract.settings(
        countryparameterscontract.address,
        wonderscontract1.address,
        wonderscontract2.address,
        wonderscontract3.address,
        wonderscontract4.address,
        resourcescontract.address,
        militarycontract.address,
        infrastructurecontract.address,
        bonusresourcescontract.address
    )
    await deployedAdditionalTaxesContract.settings2(
        improvementscontract2.address,
        improvementscontract3.address,
        forcescontract.address,
    )

    await deployedTechnologyMarketContract.settings(
        resourcescontract.address,
        improvementscontract3.address,
        infrastructurecontract.address,
        wonderscontract2.address,
        wonderscontract3.address,
        wonderscontract4.address,
        treasurycontract.address,
        countryminter.address,
        bonusresourcescontract.address,
        crimecontract.address
    )

    await deployedTreasuryContract.settings1(
        warbucks.address,
        wonderscontract1.address,
        wonderscontract2.address,
        wonderscontract3.address,
        wonderscontract4.address,
        improvementscontract1.address,
        improvementscontract2.address,
        improvementscontract3.address,
        improvementscontract4.address,
        infrastructurecontract.address
    )
    await deployedTreasuryContract.settings2(
        groundbattlecontract.address,
        countryminter.address,
        keepercontract.address,
        forcescontract.address,
        navycontract.address,
        fighterscontract.address,
        bomberscontract.address,
        aidcontract.address,
        taxescontract.address,
        billscontract.address,
        spyoperationscontract.address
    )
    await deployedTreasuryContract.settings3(
        navycontract2.address,
        missilescontract.address,
        infrastructuremarketplace.address,
        landmarketcontract.address,
        technologymarketcontrat.address,
        fightersmarketplace1.address,
        fightersmarketplace2.address,
        bombersmarketplace1.address,
        bombersmarketplace2.address,
        countryparameterscontract.address,
        spycontract.address
    )

    await deployedWarContract.settings(
        countryminter.address,
        nationstrengthcontract.address,
        militarycontract.address,
        breakblockadecontract.address,
        navalattackcontract.address,
        airbattlecontract.address,
        groundbattlecontract.address,
        cruisemissilecontract.address,
        forcescontract.address,
        wonderscontract1.address,
        keepercontract.address
    )
    await deployedWarContract.settings2(
        treasurycontract.address,
        forcescontract.address,
        navalblockadecontract.address,
        nukecontract.address
    )

    await deployedWondersContract1.settings(
        treasurycontract.address,
        wonderscontract2.address,
        wonderscontract3.address,
        wonderscontract4.address,
        infrastructurecontract.address,
        countryminter.address
    )

    await deployedWondersContract2.settings(
        treasurycontract.address,
        infrastructurecontract.address,
        wonderscontract1.address,
        wonderscontract3.address,
        wonderscontract4.address,
        countryminter.address
    )

    await deployedWondersContract3.settings(
        treasurycontract.address,
        infrastructurecontract.address,
        forcescontract.address,
        wonderscontract1.address,
        wonderscontract2.address,
        wonderscontract4.address,
        countryminter.address
    )

    await deployedWondersContract4.settings(
        treasurycontract.address,
        improvementscontract2.address,
        improvementscontract3.address,
        improvementscontract4.address,
        infrastructurecontract.address,
        wonderscontract1.address,
        wonderscontract3.address,
        countryminter.address
    )

    console.log("settings initiated");

    if(chainId == 31337 || chainId == 1337) {
        if (!vrfCoordinatorV2Mock) {
            throw new Error("vrfCoordinatorV2Mock is undefined.");
        }
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, resourcescontract.address);
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, countryparameterscontract.address);
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, spyoperationscontract.address);
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, cruisemissilecontract.address);
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, nukecontract.address);
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, airbattlecontract.address);
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, groundbattlecontract.address);
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, navalattackcontract.address);
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, navalblockadecontract.address);
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, breakblockadecontract.address);

    }

    const eaPath = "external_adapters/Contracts";

    if(chainId == 31337) {
        const contractMetadataLocation = `${eaPath}/contract-metadata.json`;
        let contractMetadata : any;
        
        let countryMinterArtifact = await artifacts.readArtifact("CountryMinter");
        let countryMinterAbi = countryMinterArtifact.abi;

        let warbucksArtifact = await artifacts.readArtifact("WarBucks");
        let warbucksAbi = warbucksArtifact.abi;

        let MetaNationsGovTokenArtifact = await artifacts.readArtifact("MetaNationsGovToken")
        let MetaNationsGovTokenAbi = MetaNationsGovTokenArtifact.abi

        let AidContractArtifact = await artifacts.readArtifact("AidContract")
        let AidContractAbi = AidContractArtifact.abi

        let AirBattleArtifact = await artifacts.readArtifact("AirBattleContract")
        let airbattleAbi = AirBattleArtifact.abi

        let AdditionalAirBattleArtifact = await artifacts.readArtifact("AdditionalAirBattle")
        let additionalairbattleAbi = AdditionalAirBattleArtifact.abi

        let BillsContractArtifact = await artifacts.readArtifact("BillsContract")
        let billsAbi = BillsContractArtifact.abi

        let BombersContractArtifact = await artifacts.readArtifact("BombersContract")
        let bombersAbi = BombersContractArtifact.abi

        let BombersMarketplace1Artifact = await artifacts.readArtifact("BombersMarketplace1")
        let bombersmarketplace1Abi = BombersMarketplace1Artifact.abi

        let BombersMarketplace2Artifact = await artifacts.readArtifact("BombersMarketplace2")
        let bombersmarketplace2Abi = BombersMarketplace2Artifact.abi

        let CountryParametersContractArtifact = await artifacts.readArtifact("CountryParametersContract")
        let countryParametersAbi = CountryParametersContractArtifact.abi

        let CrimeContractArtifact = await artifacts.readArtifact("CrimeContract")
        let crimeAbi = CrimeContractArtifact.abi

        let CruiseMissileContractArtifact = await artifacts.readArtifact("CruiseMissileContract")
        let cruiseMissileAbi = CruiseMissileContractArtifact.abi

        let EnvironmentContractArtifact = await artifacts.readArtifact("EnvironmentContract")
        let environmentAbi = EnvironmentContractArtifact.abi

        let FightersContractArtifact = await artifacts.readArtifact("FightersContract")
        let fightersAbi = FightersContractArtifact.abi

        let FighterLossesArtifact = await artifacts.readArtifact("FighterLosses")
        let fighterLossesAbi = FighterLossesArtifact.abi

        let FightersMarketplace1Artifact = await artifacts.readArtifact("FightersMarketplace1")
        let fightersmarketplace1Abi = FightersMarketplace1Artifact.abi

        let FightersMarketplace2Artifact = await artifacts.readArtifact("FightersMarketplace2")
        let fightersmarketplace2Abi = FightersMarketplace2Artifact.abi

        let forcesArtifact = await artifacts.readArtifact("ForcesContract");
        let forcesAbi = forcesArtifact.abi;

        let MissilesContractArtifact = await artifacts.readArtifact("MissilesContract");
        let missilesAbi = MissilesContractArtifact.abi;

        let GroundBattleArtifact = await artifacts.readArtifact("GroundBattleContract");
        let groundBattleAbi = GroundBattleArtifact.abi;

        let ImprovementsContract1Artifact = await artifacts.readArtifact("ImprovementsContract1");
        let improvements1Abi = ImprovementsContract1Artifact.abi;

        let ImprovementsContract2Artifact = await artifacts.readArtifact("ImprovementsContract2");
        let improvements2Abi = ImprovementsContract2Artifact.abi;

        let ImprovementsContract3Artifact = await artifacts.readArtifact("ImprovementsContract3");
        let improvements3Abi = ImprovementsContract3Artifact.abi;

        let ImprovementsContract4Artifact = await artifacts.readArtifact("ImprovementsContract4");
        let improvements4Abi = ImprovementsContract4Artifact.abi;

        let InfrastructureContractArtifact = await artifacts.readArtifact("InfrastructureContract");
        let infrastructureAbi = InfrastructureContractArtifact.abi;

        let InfrastructureMarketplaceArtifact = await artifacts.readArtifact("InfrastructureMarketContract");
        let infrastructureMarketAbi = InfrastructureMarketplaceArtifact.abi;

        let KeeperContractArtifact = await artifacts.readArtifact("KeeperContract");
        let keeperAbi = KeeperContractArtifact.abi;

        let LandMarketContractArtifact = await artifacts.readArtifact("LandMarketContract");
        let landMarketAbi = LandMarketContractArtifact.abi;

        let MilitaryContractArtifact = await artifacts.readArtifact("MilitaryContract");
        let militaryAbi = MilitaryContractArtifact.abi;

        let NationStrengthContractArtifact = await artifacts.readArtifact("NationStrengthContract");
        let nationStrengthAbi = NationStrengthContractArtifact.abi;

        let NavyContractArtifact = await artifacts.readArtifact("NavyContract");
        let navyAbi = NavyContractArtifact.abi;

        let NavyContract2Artifact = await artifacts.readArtifact("NavyContract2");
        let navy2Abi = NavyContract2Artifact.abi;

        let NavalActionsContractArtifact = await artifacts.readArtifact("NavalActionsContract");
        let navalActionsAbi = NavalActionsContractArtifact.abi;

        let AdditionalNavyContractArtifact = await artifacts.readArtifact("AdditionalNavyContract");
        let additionalNavyAbi = AdditionalNavyContractArtifact.abi;

        let NavalBlockadeContractArtifact = await artifacts.readArtifact("NavalBlockadeContract");
        let navalBlockadeAbi = NavalBlockadeContractArtifact.abi;

        let BreakBlocadeContractArtifact = await artifacts.readArtifact("BreakBlocadeContract");
        let breakBlockadeAbi = BreakBlocadeContractArtifact.abi;

        let NavalAttackContractArtifact = await artifacts.readArtifact("NavalAttackContract");
        let navalAttackAbi = NavalAttackContractArtifact.abi;

        let NukeContractArtifact = await artifacts.readArtifact("NukeContract");
        let nukeAbi = NukeContractArtifact.abi;

        let ResourcesContractArtifact = await artifacts.readArtifact("ResourcesContract");
        let resourcesAbi = ResourcesContractArtifact.abi;

        let BonusResourcesContractArtifact = await artifacts.readArtifact("BonusResourcesContract");
        let bonusResourcesAbi = BonusResourcesContractArtifact.abi;

        let SenateContractArtifact = await artifacts.readArtifact("SenateContract");
        let senateAbi = SenateContractArtifact.abi;

        let SpyContractArtifact = await artifacts.readArtifact("SpyContract");
        let spycontractAbi = SpyContractArtifact.abi;

        let SpyOperationsContractArtifact = await artifacts.readArtifact("SpyOperationsContract");
        let spyOperationAbi = SpyOperationsContractArtifact.abi;

        let TaxesContractArtifact = await artifacts.readArtifact("TaxesContract");
        let taxesAbi = TaxesContractArtifact.abi;

        let AdditionalTaxesContractArtifact = await artifacts.readArtifact("AdditionalTaxesContract");
        let additionalTaxesAbi = AdditionalTaxesContractArtifact.abi;

        let TechnologyMarketContractArtifact = await artifacts.readArtifact("TechnologyMarketContract");
        let technologyAbi = TechnologyMarketContractArtifact.abi;

        let treasuryArtifact = await artifacts.readArtifact("TreasuryContract");
        let treasuryAbi = treasuryArtifact.abi;

        let warArtifact = await artifacts.readArtifact("WarContract");
        let warAbi = warArtifact.abi;

        let Wonders1Artifact = await artifacts.readArtifact("WondersContract1");
        let wonders1Abi = Wonders1Artifact.abi;

        let Wonders2Artifact = await artifacts.readArtifact("WondersContract2");
        let wonders2Abi = Wonders2Artifact.abi;

        let Wonders3Artifact = await artifacts.readArtifact("WondersContract3");
        let wonders3Abi = Wonders3Artifact.abi;

        let Wonders4Artifact = await artifacts.readArtifact("WondersContract4");
        let wonders4Abi = Wonders4Artifact.abi;

        // Read Contract Metadata
        try {
          if (fs.existsSync(contractMetadataLocation)) {
            contractMetadata = fs.readFileSync(contractMetadataLocation).toString();
          } else {
            contractMetadata = "{}";
          }
        } catch (e) {
          console.log(e);
        }
        contractMetadata = JSON.parse(contractMetadata);
        
        if(chainId == 31337) {
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
            }
        } else if (chainId == 4002) {
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
        fs.writeFileSync(
          contractMetadataLocation,
          JSON.stringify(contractMetadata, null, 2)
        );

        const scriptMetadataLocation = `script-metadata.json`;
        let scriptMetadata : any;

        try {
            if (fs.existsSync(scriptMetadataLocation)) {
                scriptMetadata = fs.readFileSync(scriptMetadataLocation).toString();
            } else {
                scriptMetadata = "{}";
            }
        } catch (e) {
            console.log(e);
        }

        scriptMetadata = JSON.parse(scriptMetadata);
    
        scriptMetadata.HARDHAT = {
            ...scriptMetadata.HARDHAT,
            countryminter: {
                address: countryminter.address,
                ABI: countryMinterAbi,
            },
            warbucks: {
                address: warbucks.address,
                ABI: warbucksAbi,
            },
            metanationsgovtoken: {
                address: metanationsgovtoken.address,
                ABI: MetaNationsGovTokenAbi
            },
            aidcontract: {
                address: aidcontract.address,
                ABI: AidContractAbi
            },
            airbattlecontract: {
                address: airbattlecontract.address,
                ABI: airbattleAbi
            },
            additionalairbattle: {
                address: additionalairbattle.address,
                ABI: additionalairbattleAbi
            },
            billscontract: {
                address: billscontract.address,
                ABI: billsAbi
            },
            bomberscontract: {
                address: bomberscontract.address,
                ABI: bombersAbi
            },
            bombersmarketplace1: {
                address: bombersmarketplace1.address,
                ABI: bombersmarketplace1Abi
            },
            bombersmarketplace2: {
                address: bombersmarketplace2.address,
                ABI: bombersmarketplace2Abi
            },
            countryparameterscontract: {
                address: countryparameterscontract.address,
                ABI: countryParametersAbi
            },
            crimecontract: {
                address: crimecontract.address,
                ABI: crimeAbi
            },
            cruisemissilecontract: {
                address: cruisemissilecontract.address,
                ABI: cruiseMissileAbi
            },
            environmentcontract: {
                address: environmentcontract.address,
                ABI: environmentAbi
            },
            fighterscontract: {
                address: fighterscontract.address,
                ABI: fightersAbi
            },
            fighterlosses: {
                address: fighterlosses.address,
                ABI: fighterLossesAbi
            },
            fightersmarketplace1: {
                address: fightersmarketplace1.address,
                ABI: fightersmarketplace1Abi
            },
            fightersmarketplace2: {
                address: fightersmarketplace2.address,
                ABI: fightersmarketplace2Abi
            },
            forcescontract: {
                address: forcescontract.address,
                ABI: forcesAbi,
            },
            missilescontract: {
                address: missilescontract.address,
                ABI: missilesAbi,
            },
            groundbattlecontract: {
                address: groundbattlecontract.address,
                ABI: groundBattleAbi,
            },
            improvementscontract1: {
                address: improvementscontract1.address,
                ABI: improvements1Abi,
            },
            improvementscontract2: {
                address: improvementscontract2.address,
                ABI: improvements2Abi,
            },
            improvementscontract3: {
                address: improvementscontract3.address,
                ABI: improvements3Abi,
            },
            improvementscontract4: {
                address: improvementscontract4.address,
                ABI: improvements4Abi,
            },
            infrastructurecontract: {
                address: infrastructurecontract.address,
                ABI: infrastructureAbi,
            },
            infrastructuremarketplace: {
                address: infrastructuremarketplace.address,
                ABI: infrastructureMarketAbi,
            },
            keepercontract: {
                address: keepercontract.address,
                ABI: keeperAbi,
            },
            landmarketcontract: {
                address: landmarketcontract.address,
                ABI: landMarketAbi,
            },
            militarycontract: {
                address: militarycontract.address,
                ABI: militaryAbi,
            },
            nationstrengthcontract: {
                address: nationstrengthcontract.address,
                ABI: nationStrengthAbi,
            },
            navycontract: {
                address: navycontract.address,
                ABI: navyAbi,
            },
            navycontract2: {
                address: navycontract2.address,
                ABI: navy2Abi,
            },
            navalactionscontract: {
                address: navalactionscontract.address,
                ABI: navalActionsAbi,
            },
            additionalnavycontract: {
                address: additionalnavycontract.address,
                ABI: additionalNavyAbi,
            },
            navalblockadecontract: {
                address: navalblockadecontract.address,
                ABI: navalBlockadeAbi,
            },
            breakblockadecontract: {
                address: breakblockadecontract.address,
                ABI: breakBlockadeAbi,
            },
            navalattackcontract: {
                address: navalattackcontract.address,
                ABI: navalAttackAbi,
            },
            nukecontract: {
                address: nukecontract.address,
                ABI: nukeAbi,
            },
            resourcescontract: {
                address: resourcescontract.address,
                ABI: resourcesAbi,
            },
            bonusresourcescontract: {
                address: bonusresourcescontract.address,
                ABI: bonusResourcesAbi,
            },
            senatecontract: {
                address: senatecontract.address,
                ABI: senateAbi,
            },
            spycontract: {
                address: spycontract.address,
                ABI: spycontractAbi,
            },
            spyoperationscontract: {
                address: spyoperationscontract.address,
                ABI: spyOperationAbi,
            },
            taxescontract: {
                address: taxescontract.address,
                ABI: taxesAbi,
            },
            additionaltaxescontract: {
                address: additionaltaxescontract.address,
                ABI: additionalTaxesAbi,
            },
            technologymarketcontract: {
                address: technologymarketcontrat.address,
                ABI: technologyAbi,
            },
            treasurycontract: {
                address: treasurycontract.address,
                ABI: treasuryAbi,
            },
            warcontract: {
                address: warcontract.address,
                ABI: warAbi,
            },
            wonderscontract1: {
                address: wonderscontract1.address,
                ABI: wonders1Abi,
            },
            wonderscontract2: {
                address: wonderscontract2.address,
                ABI: wonders2Abi,
            },
            wonderscontract3: {
                address: wonderscontract3.address,
                ABI: wonders3Abi,
            },
            wonderscontract4: {
                address: wonderscontract4.address,
                ABI: wonders4Abi,
            }
        };
        fs.writeFileSync(
            scriptMetadataLocation,
            JSON.stringify(scriptMetadata, null, 2)
        );
    }
}

export default main