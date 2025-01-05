//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
import { expect } from "chai"
import { ethers, network } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { INITIAL_SUPPLY } from "../helper-hardhat-config"
import { Test, Oracle } from "../typechain-types"
import { LinkToken } from '../typechain-types/@chainlink/contracts/src/v0.4/LinkToken';

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
    BonusResourcesContract,
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
    VRFCoordinatorV2Mock
} from "../typechain-types"
// import operatorArtifact from "../artifacts/contracts/tests/Operator.sol/Operator.json";
// import OracleArtifact from "../artifacts/@chainlink/contracts/src/v0.4/Oracle.sol/Oracle.json";
import LinkTokenArtifact from "../artifacts/@chainlink/contracts/src/v0.4/LinkToken.sol/LinkToken.json";
import { networkConfig } from "../helper-hardhat-config"

describe("Adapter Test", function () {
  
  // const oracleAbi = OracleArtifact.abi;
  // const linkTokenAbi = LinkTokenArtifact.abi;
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
  let signer0: SignerWithAddress
  let signer1: SignerWithAddress
  let signer2: SignerWithAddress
  let signer3: SignerWithAddress
  let signer4: SignerWithAddress
  let signer5: SignerWithAddress
  let signer6: SignerWithAddress
  let signer7: SignerWithAddress
  let signers: SignerWithAddress[]
  let addrs

  let vrfCoordinatorV2Mock: any
  let testContract: Test

  let linkToken: LinkToken;

  beforeEach(async function () {

    // console.log("hello world")

    signers = await ethers.getSigners();
    signer0 = signers[0];
    signer1 = signers[1];
    signer2 = signers[2];
    signer3 = signers[3];
    signer4 = signers[4];
    signer5 = signers[5];
    signer6 = signers[6];
    signer7 = signers[7];
    
    let chainId: any
    chainId = network.config.chainId
    let subscriptionId: any
    let vrfCoordinatorV2Address: any

    if (chainId == 31337 || chainId == 1337) {
        // console.log("local network detected")
        const FUND_AMOUNT = ethers.utils.parseEther("10")
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
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    var gasLane = networkConfig[31337]["gasLane"]
    var callbackGasLimit =  networkConfig[31337]["callbackGasLimit"]

    const WarBucks = await ethers.getContractFactory("WarBucks")
    warbucks = await WarBucks.deploy(INITIAL_SUPPLY) as WarBucks
    await warbucks.deployed()
    // console.log(`WarBuks token deployed to ${warbucks.address}`)

    const MetaNatonsGovToken = await ethers.getContractFactory(
        "MetaNationsGovToken"
    )
    metanationsgovtoken = await MetaNatonsGovToken.deploy(INITIAL_SUPPLY) as MetaNationsGovToken
    await metanationsgovtoken.deployed()
    // console.log(`MetaNationsGovToken deployed to ${metanationsgovtoken.address}`)

    const AidContract = await ethers.getContractFactory("AidContract")
    aidcontract = await AidContract.deploy() as AidContract
    await aidcontract.deployed()
    // console.log(`AidContract deployed tp ${aidcontract.address}`)
    
    const AirBattleContract = await ethers.getContractFactory("AirBattleContract")
    airbattlecontract = await AirBattleContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as AirBattleContract
    await airbattlecontract.deployed()
    // console.log(`AirBattleContract deployed tp ${airbattlecontract.address}`)

    const AdditionalAirBattleContract = await ethers.getContractFactory("AdditionalAirBattle")
    additionalairbattle = await AdditionalAirBattleContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as AdditionalAirBattle
    await additionalairbattle.deployed()
    // console.log(`AirBattleContract deployed tp ${airbattlecontract.address}`)
        
    const BillsContract = await ethers.getContractFactory("BillsContract")
    billscontract = await BillsContract.deploy() as BillsContract
    await billscontract.deployed()
    // console.log(`BillsContract deployed tp ${billscontract.address}`)
        
    const BombersContract = await ethers.getContractFactory("BombersContract")
    bomberscontract = await BombersContract.deploy() as BombersContract
    await bomberscontract.deployed()
    // console.log(`BomberContract deployed tp ${bomberscontract.address}`)
        
    const BombersMarketplace1 = await ethers.getContractFactory("BombersMarketplace1")
    bombersmarketplace1 = await BombersMarketplace1.deploy() as BombersMarketplace1
    await bombersmarketplace1.deployed()
    // console.log(`BomberMarketplace1 deployed tp ${bombersmarketplace1.address}`)
        
    const BombersMarketplace2 = await ethers.getContractFactory("BombersMarketplace2")
    bombersmarketplace2 = await BombersMarketplace2.deploy() as BombersMarketplace2
    await bombersmarketplace2.deployed()
    // console.log(`BomberMarketplace2 deployed tp ${bombersmarketplace2.address}`)

    const CountryMinter = await ethers.getContractFactory("CountryMinter")
    countryminter = await CountryMinter.deploy()  as CountryMinter
    await countryminter.deployed()
    // console.log(`CountryMinter deployed tp ${countryminter.address}`)

    const CountryParameters = await ethers.getContractFactory("CountryParametersContract")
    countryparameterscontract = await CountryParameters.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as CountryParametersContract
    await countryparameterscontract.deployed()
    // console.log(`CountryParameters deployed to ${countryparameterscontract.address}`)

    const CrimeContract = await ethers.getContractFactory("CrimeContract")
    crimecontract = await CrimeContract.deploy() as CrimeContract
    await crimecontract.deployed()
    // console.log(`CrimeContract deployed tp ${crimecontract.address}`)

    const CruiseMissileContract = await ethers.getContractFactory("CruiseMissileContract")
    cruisemissilecontract = await CruiseMissileContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as CruiseMissileContract
    await cruisemissilecontract.deployed()
    // console.log(`CruiseMissile deployed to ${cruisemissileconract.address}`)

    const EnvironmentContract = await ethers.getContractFactory("EnvironmentContract")
    environmentcontract = await EnvironmentContract.deploy() as EnvironmentContract
    await environmentcontract.deployed()
    // console.log(`EnvironmentContract deployed to ${environmentcontract.address}`)

    const FightersContract = await ethers.getContractFactory("FightersContract")
    fighterscontract = await FightersContract.deploy() as FightersContract
    await fighterscontract.deployed()
    // console.log(`FightersContract deployed to ${fighterscontract.address}`)

    const FighterLosses = await ethers.getContractFactory("FighterLosses")
    fighterlosses = await FighterLosses.deploy() as FighterLosses
    await fighterlosses.deployed()
    // console.log(`FighterLosses deployed to ${fighterlosses.address}`)

    const FightersMarketplace1 = await ethers.getContractFactory("FightersMarketplace1")
    fightersmarketplace1 = await FightersMarketplace1.deploy() as FightersMarketplace1
    await fightersmarketplace1.deployed()
    // console.log(`FightersMarket1 deployed to ${fightersmarketplace1.address}`)

    const FightersMarketplace2 = await ethers.getContractFactory("FightersMarketplace2")
    fightersmarketplace2 = await FightersMarketplace2.deploy() as FightersMarketplace2
    await fightersmarketplace2.deployed()
    // console.log(`FightersMarket2 deployed to ${fightersmarketplace2.address}`)
        
    const ForcesContract = await ethers.getContractFactory("ForcesContract")
    forcescontract = await ForcesContract.deploy() as ForcesContract
    await forcescontract.deployed()
    // console.log(`ForcesContract deployed to ${forcescontract.address}`)

    const MissilesContract = await ethers.getContractFactory("MissilesContract")
    missilescontract = await MissilesContract.deploy() as MissilesContract
    await missilescontract.deployed()
    // console.log(`MissilesContract deployed to ${missilescontract.address}`)

    const GroundBattleContract = await ethers.getContractFactory("GroundBattleContract")
    groundbattlecontract = await GroundBattleContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as GroundBattleContract
    await groundbattlecontract.deployed()
    // console.log(`GroundBattleContract deployed to ${groundbattlecontract.address}`)
    
    const ImprovementsContract1 = await ethers.getContractFactory("ImprovementsContract1")
    improvementscontract1 = await ImprovementsContract1.deploy() as ImprovementsContract1
    await improvementscontract1.deployed()
    // console.log(`ImprovementsContract1 deployed to ${improvementscontract1.address}`)

    const ImprovementsContract2 = await ethers.getContractFactory("ImprovementsContract2")
    improvementscontract2 = await ImprovementsContract2.deploy() as ImprovementsContract2
    await improvementscontract2.deployed()
    // console.log(`ImprovementsContract2 deployed to ${improvementscontract2.address}`)

    const ImprovementsContract3 = await ethers.getContractFactory("ImprovementsContract3")
    improvementscontract3 = await ImprovementsContract3.deploy() as ImprovementsContract3
    await improvementscontract3.deployed()
    // console.log(`ImprovementsContract3 deployed to ${improvementscontract3.address}`)

    const ImprovementsContract4 = await ethers.getContractFactory("ImprovementsContract4")
    improvementscontract4 = await ImprovementsContract4.deploy() as ImprovementsContract4
    await improvementscontract4.deployed()
    // console.log(`ImprovementsContract4 deployed to ${improvementscontract4.address}`)
    
    const InfrastructureContract = await ethers.getContractFactory("InfrastructureContract")
    infrastructurecontract = await InfrastructureContract.deploy() as InfrastructureContract
    await infrastructurecontract.deployed()
    // console.log(`InfrastructureContract deployed to ${infrastructurecontract.address}`)

    const InfrastructureMarketContract = await ethers.getContractFactory("InfrastructureMarketContract")
    infrastructuremarketplace = await InfrastructureMarketContract.deploy() as InfrastructureMarketContract
    await infrastructuremarketplace.deployed()
    // console.log(`InfrastructureMarketplace deployed to ${infrastructuremarketplace.address}`)

    const KeeperContract = await ethers.getContractFactory("KeeperContract")
    keepercontract = await KeeperContract.deploy(86400) as KeeperContract
    await keepercontract.deployed()
    // console.log(`KeeperContract deployed to ${keepercontract.address}`)
    
    const LandMarketContract = await ethers.getContractFactory("LandMarketContract")
    landmarketcontract = await LandMarketContract.deploy() as LandMarketContract
    await landmarketcontract.deployed()
    // console.log(`LandMarketContract deployed to ${landmarketcontract.address}`)

    const MilitaryContract = await ethers.getContractFactory("MilitaryContract")
    militarycontract = await MilitaryContract.deploy() as MilitaryContract
    await militarycontract.deployed()
    // console.log(`MilitaryContract deployed to ${militarycontract.address}`)

    const NationStrengthContract = await ethers.getContractFactory("NationStrengthContract")
    nationstrengthcontract = await NationStrengthContract.deploy() as NationStrengthContract
    await nationstrengthcontract.deployed()
    // console.log(`NationStrengthContract deployed to ${nationstrengthcontract.address}`)

    const NavyContract = await ethers.getContractFactory("NavyContract")
    navycontract = await NavyContract.deploy() as NavyContract
    await navycontract.deployed()
    // console.log(`NavyContract deployed to ${navycontract.address}`)

    const NavyContract2 = await ethers.getContractFactory("NavyContract2")
    navycontract2 = await NavyContract2.deploy() as NavyContract2
    await navycontract2.deployed()
    // console.log(`NavyContract2 deployed to ${navycontract2.address}`)

    const AdditionalNavyContract = await ethers.getContractFactory("AdditionalNavyContract")
    additionalnavycontract = await AdditionalNavyContract.deploy() as AdditionalNavyContract
    await additionalnavycontract.deployed()
    // console.log(`NavyContract deployed to ${additionalnavycontract.address}`)
    
    const NavalActionsContract = await ethers.getContractFactory("NavalActionsContract")
    navalactionscontract = await NavalActionsContract.deploy() as NavalActionsContract
    await navalactionscontract.deployed()
    // console.log(`NavalActionsContract deployed to ${navalactionscontract.address}`)
    
    const NavalBlockadeContract = await ethers.getContractFactory("NavalBlockadeContract")
    navalblockadecontract = await NavalBlockadeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as NavalBlockadeContract
    await navalblockadecontract.deployed()
    // console.log(`NavalBlockadeContract deployed to ${navalblockadecontract.address}`)
    
    const BreakBlocadeContract = await ethers.getContractFactory("BreakBlocadeContract")
    breakblockadecontract = await BreakBlocadeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as BreakBlocadeContract
    await breakblockadecontract.deployed()
    // console.log(`BreakBlocadeContract deployed to ${breakblockadecontract.address}`)
        
    const NavalAttackContract = await ethers.getContractFactory("NavalAttackContract")
    navalattackcontract = await NavalAttackContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as NavalAttackContract
    await navalattackcontract.deployed()
    // console.log(`NavalAttackContract deployed to ${navalattackcontract.address}`)
    
    const NukeContract = await ethers.getContractFactory("NukeContract")
    nukecontract = await NukeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as NukeContract
    await nukecontract.deployed()
    // console.log(`NukeContract deployed to ${nukecontract.address}`)
    
    const ResourcesContract = await ethers.getContractFactory("ResourcesContract")
    resourcescontract = await ResourcesContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as ResourcesContract
    await resourcescontract.deployed()
    // console.log(`ResourcesContract deployed to ${resourcescontract.address}`)

    const BonusResourcesContract = await ethers.getContractFactory("BonusResourcesContract")
    bonusresourcescontract = await BonusResourcesContract.deploy() as BonusResourcesContract
    await bonusresourcescontract.deployed()

    const SenateContract = await ethers.getContractFactory("SenateContract")
    senatecontract = await SenateContract.deploy(20) as SenateContract
    await senatecontract.deployed()
    // console.log(`SenateContract deployed to ${senatecontract.address}`)

    const SpyContract = await ethers.getContractFactory("SpyContract")
    spycontract = await SpyContract.deploy() as SpyContract
    await spycontract.deployed()
    // console.log(`SpyContract deployed to ${spycontract.address}`)
    
    const SpyOperationsContract = await ethers.getContractFactory("SpyOperationsContract")
    spyoperationscontract = await SpyOperationsContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as SpyOperationsContract
    await spyoperationscontract.deployed()
    // console.log(`SpyOperationsContract deployed to ${spyoperationscontract.address}`)

    const TaxesContract = await ethers.getContractFactory("TaxesContract")
    taxescontract = await TaxesContract.deploy() as TaxesContract
    await taxescontract.deployed()
    // console.log(`TaxesContract deployed to ${taxescontract.address}`)

    const AdditionalTaxesContract = await ethers.getContractFactory("AdditionalTaxesContract")
    additionaltaxescontract = await AdditionalTaxesContract.deploy() as AdditionalTaxesContract
    await additionaltaxescontract.deployed()
    // console.log(`AdditionalTaxesContract deployed to ${additionaltaxescontract.address}`)

    const TechnologyMarketContract = await ethers.getContractFactory("TechnologyMarketContract")
    technologymarketcontrat = await TechnologyMarketContract.deploy() as TechnologyMarketContract
    await technologymarketcontrat.deployed()
    // console.log(`TechnologyMarketContract deployed to ${technologymarketcontrat.address}`)

    const TreasuryContract = await ethers.getContractFactory("TreasuryContract")
    treasurycontract = await TreasuryContract.deploy() as TreasuryContract
    await treasurycontract.deployed()
    // console.log(`TreasuryContract deployed to ${treasurycontract.address}`)
    
    const WarContract = await ethers.getContractFactory("WarContract")
    warcontract = await WarContract.deploy() as WarContract
    await warcontract.deployed()
    // console.log(`WarContract deployed to ${warcontract.address}`)     

    const Wonders1 = await ethers.getContractFactory("WondersContract1")
    wonderscontract1 = await Wonders1.deploy() as WondersContract1
    await wonderscontract1.deployed()
    // console.log(`Wonders1 deployed to ${wonderscontract1.address}`)

    const Wonders2 = await ethers.getContractFactory("WondersContract2")
    wonderscontract2 = await Wonders2.deploy() as WondersContract2
    await wonderscontract2.deployed()
    // console.log(`Wonders2 deployed to ${wonderscontract2.address}`)

    const Wonders3 = await ethers.getContractFactory("WondersContract3")
    wonderscontract3 = await Wonders3.deploy() as WondersContract3
    await wonderscontract3.deployed()
    // console.log(`Wonders3 deployed to ${wonderscontract3.address}`)

    const Wonders4 = await ethers.getContractFactory("WondersContract4")
    wonderscontract4 = await Wonders4.deploy() as WondersContract4
    await wonderscontract4.deployed()
    // console.log(`Wonders4 deployed to ${wonderscontract4.address}`)

    // console.log("contracts deployed")

    await warbucks.settings(
        treasurycontract.address,
        countryminter.address
    )
    
    await aidcontract.settings(
        countryminter.address, 
        treasurycontract.address, 
        forcescontract.address, 
        infrastructurecontract.address, 
        keepercontract.address, 
        wonderscontract1.address,
        senatecontract.address,
        countryparameterscontract.address)

    await airbattlecontract.settings(
        warcontract.address, 
        fighterscontract.address, 
        bomberscontract.address, 
        infrastructurecontract.address, 
        forcescontract.address, 
        fighterlosses.address,
        countryminter.address,
        additionalairbattle.address
    )

    await additionalairbattle.settings(
        warcontract.address, 
        fighterscontract.address, 
        bomberscontract.address, 
        infrastructurecontract.address, 
        forcescontract.address, 
        fighterlosses.address,
        countryminter.address,
        airbattlecontract.address
    )
        
        await billscontract.settings(
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
        await billscontract.settings2(
            improvementscontract1.address,
            improvementscontract2.address,
            missilescontract.address,
            wonderscontract4.address,
            infrastructurecontract.address,
            bonusresourcescontract.address,
            navycontract2.address,
            countryparameterscontract.address)
        
        await bomberscontract.settings(
            countryminter.address, 
            bombersmarketplace1.address,
            bombersmarketplace2.address,
            airbattlecontract.address,
            treasurycontract.address,
            fighterscontract.address,
            infrastructurecontract.address,
            warcontract.address)
    
        await bombersmarketplace1.settings(
            countryminter.address,
            bomberscontract.address,
            fighterscontract.address,
            fightersmarketplace1.address,
            infrastructurecontract.address,
            treasurycontract.address)
    
        await bombersmarketplace2.settings(
            countryminter.address,
            bomberscontract.address,
            fighterscontract.address,
            fightersmarketplace1.address,
            infrastructurecontract.address,
            treasurycontract.address)
        
        await countryminter.settings(
            countryparameterscontract.address,
            treasurycontract.address,
            infrastructurecontract.address,
            resourcescontract.address,
            missilescontract.address,
            senatecontract.address,
            warbucks.address,
            bonusresourcescontract.address)
        await countryminter.settings2(
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address)
        await countryminter.settings3(
            militarycontract.address,
            forcescontract.address,
            navycontract.address,
            navycontract2.address,
            navalactionscontract.address,
            fighterscontract.address,
            bomberscontract.address)
        
        await countryparameterscontract.settings(
            spyoperationscontract.address,
            countryminter.address,
            senatecontract.address,
            keepercontract.address,
            nukecontract.address,
            groundbattlecontract.address,
            wonderscontract1.address,
            treasurycontract.address
        )
    
        await crimecontract.settings(
            infrastructurecontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            countryparameterscontract.address,
            wonderscontract2.address)
        
        await cruisemissilecontract.settings(
            forcescontract.address,
            countryminter.address,
            warcontract.address,
            infrastructurecontract.address,
            missilescontract.address)
        await cruisemissilecontract.settings2(
            improvementscontract1.address,
            improvementscontract3.address,
            improvementscontract4.address,
            wonderscontract2.address)
        
        await environmentcontract.settings(
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
        await environmentcontract.settings2(
            improvementscontract1.address,
            improvementscontract3.address,
            improvementscontract4.address,
            bonusresourcescontract.address)
        
        await fighterscontract.settings(
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
        await fighterscontract.settings2(
            navycontract.address,
            bomberscontract.address)
        
        await fighterlosses.settings(
            fighterscontract.address,
            airbattlecontract.address)
        
        await fightersmarketplace1.settings(
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
        await fightersmarketplace1.settings2(
            bonusresourcescontract.address,
            navycontract2.address
        )
        
        await fightersmarketplace2.settings(
            countryminter.address,
            bomberscontract.address,
            fighterscontract.address,
            fightersmarketplace1.address,
            treasurycontract.address,
            infrastructurecontract.address,
            resourcescontract.address,
            improvementscontract1.address)
        
        await forcescontract.settings(
            treasurycontract.address,
            aidcontract.address,
            spyoperationscontract.address,
            cruisemissilecontract.address,
            nukecontract.address,
            airbattlecontract.address,
            groundbattlecontract.address,
            warcontract.address)
        await forcescontract.settings2(
            infrastructurecontract.address,
            resourcescontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            wonderscontract1.address,
            countryminter.address,
            keepercontract.address,
            countryparameterscontract.address)
        
        await missilescontract.settings(
            treasurycontract.address,
            spyoperationscontract.address,
            nukecontract.address,
            airbattlecontract.address,
            wonderscontract2.address,
            nationstrengthcontract.address,
            infrastructurecontract.address)
        await missilescontract.settings2(
            resourcescontract.address,
            improvementscontract1.address,
            wonderscontract1.address,
            wonderscontract4.address,
            countryminter.address,
            keepercontract.address)
            
        await groundbattlecontract.settings(
            warcontract.address,
            infrastructurecontract.address,
            forcescontract.address,
            treasurycontract.address,
            countryminter.address,
            militarycontract.address)
        await groundbattlecontract.settings2(
            improvementscontract2.address,
            improvementscontract4.address,
            wonderscontract3.address,
            wonderscontract4.address,
            additionaltaxescontract.address,
            countryparameterscontract.address,)
        
        await improvementscontract1.settings(
            treasurycontract.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            navycontract.address,
            additionalnavycontract.address,
            countryminter.address,
            wonderscontract1.address,
            infrastructurecontract.address)
    
        await improvementscontract2.settings(
            treasurycontract.address,
            forcescontract.address,
            wonderscontract1.address,
            countryminter.address,
            improvementscontract1.address,
            resourcescontract.address,
            spycontract.address
            )
        
        await improvementscontract3.settings(
            treasurycontract.address,
            additionalnavycontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            countryminter.address,
            bonusresourcescontract.address,
            wonderscontract4.address
            )
        
        await improvementscontract4.settings(
            treasurycontract.address,
            forcescontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            countryminter.address,
            wonderscontract4.address
            )
        
        await infrastructurecontract.settings1(
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
        await infrastructurecontract.settings2(
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            treasurycontract.address,
            countryparameterscontract.address,
            forcescontract.address,
            aidcontract.address
        )
        await infrastructurecontract.settings3(
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
    
        await infrastructuremarketplace.settings(
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
    
        await landmarketcontract.settings(
            resourcescontract.address,
            countryminter.address,
            infrastructurecontract.address,
            treasurycontract.address
        )
    
        await militarycontract.settings(
            spyoperationscontract.address,
            countryminter.address,
            keepercontract.address
        )
    
        await nationstrengthcontract.settings(
            infrastructurecontract.address,
            forcescontract.address,
            fighterscontract.address,
            bomberscontract.address,
            navycontract.address,
            missilescontract.address,
            navycontract2.address
        )
    
        await navycontract.settings(
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
        await navycontract.settings2(
            countryminter.address,
            bonusresourcescontract.address,
            navycontract2.address,
            infrastructurecontract.address
        )
    
        await navycontract2.settings(
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
        await navycontract2.settings2(
            countryminter.address,
            bonusresourcescontract.address,
            navycontract.address,
            infrastructurecontract.address
        ) 
    
        await navalactionscontract.settings(
            navalblockadecontract.address,
            breakblockadecontract.address,
            navalattackcontract.address,
            keepercontract.address,
            navycontract.address,
            navycontract2.address,
            countryminter.address
        )
    
        await additionalnavycontract.settings(
            navycontract.address,
            navalactionscontract.address,
            militarycontract.address,
            wonderscontract1.address,
            improvementscontract4.address,
            navycontract2.address
        )
    
        await navalblockadecontract.settings(
            navycontract.address,
            additionalnavycontract.address,
            navalactionscontract.address,
            warcontract.address,
            countryminter.address,
            keepercontract.address,
            breakblockadecontract.address
        )
    
        await breakblockadecontract.settings(
            countryminter.address,
            navalblockadecontract.address,
            navycontract.address,
            warcontract.address,
            improvementscontract4.address,
            navalactionscontract.address,
            navycontract2.address
        )
    
        await navalattackcontract.settings(
            navycontract.address,
            warcontract.address,
            improvementscontract4.address,
            navalactionscontract.address,
            navycontract2.address
        )
    
        await nukecontract.settings(
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
        await nukecontract.settings2(
            countryparameterscontract.address
        )
    
        await resourcescontract.settings(
            infrastructurecontract.address,
            improvementscontract2.address,
            countryminter.address,
            bonusresourcescontract.address,
            senatecontract.address,
            technologymarketcontrat.address,
            countryparameterscontract.address
        )
        await bonusresourcescontract.settings(
            infrastructurecontract.address,
            countryminter.address,
            resourcescontract.address,
            crimecontract.address
        )
    
        await senatecontract.settings(
            countryminter.address,
            countryparameterscontract.address,
            wonderscontract3.address,
            keepercontract.address,
            resourcescontract.address
        )
    
        await spycontract.settings(
            spyoperationscontract.address,
            treasurycontract.address,
            countryminter.address,
            improvementscontract2.address,
            wonderscontract1.address,
        )
    
        await spyoperationscontract.settings(
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
        await spyoperationscontract.settings2(
            keepercontract.address,
            spycontract.address
        )
    
        await taxescontract.settings1(
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
        await taxescontract.settings2(
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
    
        await additionaltaxescontract.settings(
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
        await additionaltaxescontract.settings2(
            improvementscontract2.address,
            improvementscontract3.address,
            forcescontract.address,
        )
    
        await technologymarketcontrat.settings(
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
    
        await treasurycontract.settings1(
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
        await treasurycontract.settings2(
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
        await treasurycontract.settings3(
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
    
        await warcontract.settings(
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
        await warcontract.settings2(
            treasurycontract.address,
            forcescontract.address,
            navalblockadecontract.address,
            nukecontract.address
        )
    
        await wonderscontract1.settings(
            treasurycontract.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address,
            infrastructurecontract.address,
            countryminter.address
        )
    
        await wonderscontract2.settings(
            treasurycontract.address,
            infrastructurecontract.address,
            wonderscontract1.address,
            wonderscontract3.address,
            wonderscontract4.address,
            countryminter.address
        )
    
        await wonderscontract3.settings(
            treasurycontract.address,
            infrastructurecontract.address,
            forcescontract.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract4.address,
            countryminter.address
        )
    
        await wonderscontract4.settings(
            treasurycontract.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            infrastructurecontract.address,
            wonderscontract1.address,
            wonderscontract3.address,
            countryminter.address
        )
    
        if(chainId == 31337 || chainId == 1337) {
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, resourcescontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, countryparameterscontract.address);
        }

        // // console.log("country 1");
        // await warbucks.connect(signer0).transfer(signer1.address, BigInt(2100000000000000000000000))
        // await countryminter.connect(signer1).generateCountry(
        //     "TestRuler",
        //     "TestNationName",
        //     "TestCapitalCity",
        //     "TestNationSlogan"
        // )
        // const tx1 = await resourcescontract.fulfillRequest(0);
        // let txReceipt1 = await tx1.wait(1);
        // let requestId1 = txReceipt1?.events?.[1].args?.requestId;
        // // console.log("requestId", (txReceipt1.events?.[1].args?.requestId).toNumber());
        // await vrfCoordinatorV2Mock.fulfillRandomWords(requestId1, resourcescontract.address);
        // let resources1 = await resourcescontract.getPlayerResources(0);
        // // console.log("resources1", resources1[0].toNumber(), resources1[1].toNumber());
        
        // // console.log("country 2");
        // await warbucks.connect(signer0).transfer(signer2.address, BigInt(2100000000000000000000000))
        // await countryminter.connect(signer2).generateCountry(
        //     "TestRuler2",
        //     "TestNationName2",
        //     "TestCapitalCity2",
        //     "TestNationSlogan2"
        // )
        // const tx2 = await resourcescontract.fulfillRequest(1);
        // let txReceipt2 = await tx2.wait(1);
        // let requestId2 = txReceipt2?.events?.[1].args?.requestId;
        // // console.log("requestId", (txReceipt2.events?.[1].args?.requestId).toNumber());
        // await vrfCoordinatorV2Mock.fulfillRandomWords(requestId2, resourcescontract.address);
        // let resources2 = await resourcescontract.getPlayerResources(1);
        // // console.log("resources2", resources2[0].toNumber(), resources2[1].toNumber());

        // // console.log("country 3");
        // await warbucks.connect(signer0).transfer(signer3.address, BigInt(2100000000000000000000000))
        // await countryminter.connect(signer3).generateCountry(
        //     "TestRuler3",
        //     "TestNationName3",
        //     "TestCapitalCity3",
        //     "TestNationSlogan3"
        // )
        // const tx3 = await resourcescontract.fulfillRequest(2);
        // let txReceipt3 = await tx3.wait(1);
        // let requestId3 = txReceipt3?.events?.[1].args?.requestId;
        // // console.log("requestId3", (txReceipt3.events?.[1].args?.requestId).toNumber());
        // await vrfCoordinatorV2Mock.fulfillRandomWords(requestId3, resourcescontract.address);
        // let resources3 = await resourcescontract.getPlayerResources(2);
        // // console.log("resources3", resources3[0].toNumber(), resources3[1].toNumber());

        await warbucks.connect(signer0).transfer(signer1.address, BigInt(25000000000000000000000000))
        await countryminter.connect(signer1).generateCountry(
            "TestRuler",
            "TestNationName",
            "TestCapitalCity",
            "TestNationSlogan"
        )
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(25000000000000000000000000))
        await countryminter.connect(signer1).generateCountry(
            "TestRuler2",
            "TestNationName2",
            "TestCapitalCity2",
            "TestNationSlogan2"
        )
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(25000000000000000000000000))
        await countryminter.connect(signer1).generateCountry(
            "TestRuler3",
            "TestNationName3",
            "TestCapitalCity3",
            "TestNationSlogan3"
        )
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(25000000000000000000000000))
        await countryminter.connect(signer1).generateCountry(
            "TestRuler4",
            "TestNationName4",
            "TestCapitalCity4",
            "TestNationSlogan4"
        )
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(25000000000000000000000000))
        await countryminter.connect(signer1).generateCountry(
            "TestRuler5",
            "TestNationName5",
            "TestCapitalCity5",
            "TestNationSlogan5"
        )
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(25000000000000000000000000))
        await countryminter.connect(signer1).generateCountry(
            "TestRuler6",
            "TestNationName6",
            "TestCapitalCity6",
            "TestNationSlogan6"
        )
        await countryminter.connect(signer1).generateCountry(
            "TestRuler7",
            "TestNationName7",
            "TestCapitalCity7",
            "TestNationSlogan7"
        )
        const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
        const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
        for (const log of event1Logs) {
            const requestIdReturn = log.args.requestId;
            // console.log(Number(requestIdReturn), "requestIdReturn for Event");
            if (requestIdReturn == 2) {
                await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                let resources1 = await resourcescontract.getPlayerResources(0);
                // console.log("resources 1", resources1[0].toNumber(), resources1[1].toNumber());
            } else if (requestIdReturn == 4) {
                await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                let resources2 = await resourcescontract.getPlayerResources(1);
                // console.log("resources 2", resources2[0].toNumber(), resources2[1].toNumber());
            } else if (requestIdReturn == 6) {
                await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                let resources3 = await resourcescontract.getPlayerResources(2);
                // console.log("resources 3", resources3[0].toNumber(), resources3[1].toNumber());
            } else if (requestIdReturn == 8) {
                await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                let resources3 = await resourcescontract.getPlayerResources(3);
                // console.log("resources 3", resources3[0].toNumber(), resources3[1].toNumber());
            } else if (requestIdReturn == 10) {
                await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                let resources3 = await resourcescontract.getPlayerResources(4);
                // console.log("resources 3", resources3[0].toNumber(), resources3[1].toNumber());
            } else if (requestIdReturn == 12) {
                await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                let resources3 = await resourcescontract.getPlayerResources(5);
                // console.log("resources 3", resources3[0].toNumber(), resources3[1].toNumber());
            } else if (requestIdReturn == 14) {
                await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                let resources3 = await resourcescontract.getPlayerResources(6);
                // console.log("resources 3", resources3[0].toNumber(), resources3[1].toNumber());
            }
        }
    });

    describe("Resources Setup", function () {
        it("Tests that two resources were randomly selected and set to true", async function () {
            var iron1 = await resourcescontract.viewIron(0);
            expect(iron1).to.equal(true);
            var oil1 = await resourcescontract.viewOil(0);
            expect(oil1).to.equal(false);
            var fish1 = await resourcescontract.viewFish(0);
            expect(fish1).to.equal(false);
            var cattle1 = await resourcescontract.viewCattle(0);
            expect(cattle1).to.equal(true);

            var iron2 = await resourcescontract.viewIron(1);
            expect(iron2).to.equal(true);
            var gems2 = await resourcescontract.viewGems(1);
            expect(gems2).to.equal(true);
            var coal2 = await resourcescontract.viewCoal(1);
            expect(coal2).to.equal(false);
            var cattle2 = await resourcescontract.viewCattle(1);
            expect(cattle2).to.equal(false);
        });
    });

    describe("Accept Trading Partner", function () {
        it("Test that partners recieve each others resources", async function () {
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            var wheat1 = await resourcescontract.viewWheat(0);
            expect(wheat1).to.equal(false);
            var cattle1 = await resourcescontract.viewCattle(0);
            expect(cattle1).to.equal(true)
            var iron1 = await resourcescontract.viewIron(0);
            expect(iron1).to.equal(true);
            var water1 = await resourcescontract.viewGems(0);
            expect(water1).to.equal(true);
            var wheat2 = await resourcescontract.viewWheat(1);
            expect(wheat2).to.equal(false);
            var cattle2 = await resourcescontract.viewCattle(1);
            expect(cattle2).to.equal(true)
            var iron2 = await resourcescontract.viewIron(1);
            expect(iron2).to.equal(true);
            var water2 = await resourcescontract.viewGems(1);
            expect(water2).to.equal(true);
        })
    })

    describe("Trade Reverts if Not Possible", function () {
        it("Test that trades revert if not possible for requestor", async function () {
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await expect(resourcescontract.connect(signer1).proposeTrade(0, 4)).to.be.revertedWith("trade is not possible");
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            // await resourcescontract.connect(signer1).fulfillTradingPartner(4, 0);
            // await expect(resourcescontract.connect(signer1).proposeTrade(0, 5)).to.be.revertedWith("trade is not possible")
        })

        it("Test that trades revert if not possible for recipient", async function () {
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer1).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            await expect(resourcescontract.connect(signer1).proposeTrade(5, 0)).to.be.revertedWith("trade is not possible")
        })

        it("Test that trades revert if not possible for requestor", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000)
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer1).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            await expect(resourcescontract.connect(signer1).proposeTrade(0, 5)).to.be.revertedWith("trade is not possible")
        })

        it("Test that trades revert if not possible for recipient", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000)
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer1).proposeTrade(0, 4);
            await resourcescontract.connect(signer1).proposeTrade(5, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 5);
            await expect(resourcescontract.connect(signer1).proposeTrade(6, 0)).to.be.revertedWith("trade is not possible")
        })
    })

    describe("Cancel Proposed Partner", function () {
        it("Test that a nation can cancel a proposed trade", async function () {
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            var partners = await resourcescontract.getProposedTradingPartners(0)
            var partners1 = await resourcescontract.getProposedTradingPartners(1)
            expect(partners.length).to.equal(1)
            expect(partners1.length).to.equal(1)
            await resourcescontract.connect(signer1).cancelProposedTrade(0, 1)
            var partners = await resourcescontract.getProposedTradingPartners(0)
            var partners1 = await resourcescontract.getProposedTradingPartners(1)
            expect(partners.length).to.equal(0)
            expect(partners1.length).to.equal(0)
        })

        it("Test that the other nation can cancel a proposed trade", async function () {
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            var partners = await resourcescontract.getProposedTradingPartners(0)
            var partners1 = await resourcescontract.getProposedTradingPartners(1)
            expect(partners.length).to.equal(1)
            expect(partners1.length).to.equal(1)
            await resourcescontract.connect(signer1).cancelProposedTrade(1, 0)
            var partners = await resourcescontract.getProposedTradingPartners(0)
            var partners1 = await resourcescontract.getProposedTradingPartners(1)
            expect(partners.length).to.equal(0)
            expect(partners1.length).to.equal(0)
        })

        it("Test that cancel proposed trade reverts correctly when theres no trade proposed between partners", async function () {
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await expect(resourcescontract.connect(signer1).cancelProposedTrade(1, 2)).to.be.revertedWith("No proposed trade with this partner")
            var proposed = await resourcescontract.isProposedTrade(1, 2)
            expect(proposed).to.equal(false)
            var active = await resourcescontract.isActiveTrade(1, 2)
            expect(active).to.equal(false)
        })
    })

    describe("Remove Trading Partners", async function () {
        it("Nation one in a trade can remove the trade", async function () {
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            var nation1TradingPartnersFirst = await resourcescontract.getTradingPartners(0);
            expect(nation1TradingPartnersFirst.length).to.equal(1);
            await resourcescontract.connect(signer1).removeTradingPartner(0, 1);
            var nation1TradingPartners = await resourcescontract.getTradingPartners(0);
            expect(nation1TradingPartners.length).to.equal(0);
        })

        it("Nation two in a trade can remove the trade", async function () {
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            var nation1TradingPartnersFirst = await resourcescontract.getTradingPartners(1);
            expect(nation1TradingPartnersFirst.length).to.equal(1);
            await resourcescontract.connect(signer1).removeTradingPartner(1, 0);
            var nation1TradingPartners = await resourcescontract.getTradingPartners(1);
            expect(nation1TradingPartners.length).to.equal(0);
        })
    })

    describe("Set Resources", async function () {
        it("tests that the mock set resources functionality works", async function () {
            await resourcescontract.mockResourcesForTesting(0, 0, 1);
            // await resourcescontract.mockResourcesForTesting(0, 1, 2);
            var resource1 = await resourcescontract.viewAluminium(0);
            expect(resource1).to.equal(true);
            var resource2 = await resourcescontract.viewCattle(0);
            expect(resource2).to.equal(true);
        })

        it("tests that the mock set resources functionality works 2", async function () {
            await resourcescontract.mockResourcesForTesting(0, 2, 3)
            // await resourcescontract.mockResourcesForTesting(0, 1, 2);
            var resource1 = await resourcescontract.viewCoal(0);
            expect(resource1).to.equal(true);
            var resource2 = await resourcescontract.viewFish(0);
            expect(resource2).to.equal(true);
        })

        it("tests that the mock set resources functionality works 3", async function () {
            await resourcescontract.mockResourcesForTesting(0, 4, 5)
            var resource1 = await resourcescontract.viewFurs(0);
            expect(resource1).to.equal(true);
            var resource2 = await resourcescontract.viewGems(0);
            expect(resource2).to.equal(true);
        })

        it("tests that the mock set resources functionality works 4", async function () {
            await resourcescontract.mockResourcesForTesting(0, 6, 7)
            var resource1 = await resourcescontract.viewGold(0);
            expect(resource1).to.equal(true);
            var resource2 = await resourcescontract.viewIron(0);
            expect(resource2).to.equal(true);
        })

        it("tests that the mock set resources functionality works 5", async function () {
            await resourcescontract.mockResourcesForTesting(0, 8, 9)
            var resource1 = await resourcescontract.viewLead(0);
            expect(resource1).to.equal(true);
            var resource2 = await resourcescontract.viewLumber(0);
            expect(resource2).to.equal(true);
        })

        it("tests that the mock set resources functionality works 6", async function () {
            await resourcescontract.mockResourcesForTesting(0, 10, 11)
            var resource1 = await resourcescontract.viewMarble(0);
            expect(resource1).to.equal(true);
            var resource2 = await resourcescontract.viewOil(0);
            expect(resource2).to.equal(true);
        })

        it("tests that the mock set resources functionality works 7", async function () {
            await resourcescontract.mockResourcesForTesting(0, 12, 13)
            var resource1 = await resourcescontract.viewPigs(0);
            expect(resource1).to.equal(true);
            var resource2 = await resourcescontract.viewRubber(0);
            expect(resource2).to.equal(true);
        })

        it("tests that the mock set resources functionality works 8", async function () {
            await resourcescontract.mockResourcesForTesting(0, 14, 15)
            var resource1 = await resourcescontract.viewSilver(0);
            expect(resource1).to.equal(true);
            var resource2 = await resourcescontract.viewSpices(0);
            expect(resource2).to.equal(true);
        })

        it("tests that the mock set resources functionality works 9", async function () {
            await resourcescontract.mockResourcesForTesting(0, 16, 17)
            var resource1 = await resourcescontract.viewSugar(0);
            expect(resource1).to.equal(true);
            var resource2 = await resourcescontract.viewUranium(0);
            expect(resource2).to.equal(true);
        })

        it("tests that the mock set resources functionality works 10", async function () {
            await resourcescontract.mockResourcesForTesting(0, 18, 19)
            var resource1 = await resourcescontract.viewWater(0);
            expect(resource1).to.equal(true);
            var resource2 = await resourcescontract.viewWheat(0);
            expect(resource2).to.equal(true);
        })

        it("tests that the mock set resources functionality works 11", async function () {
            await resourcescontract.mockResourcesForTesting(0, 20, 19)
            var resource1 = await resourcescontract.viewWine(0);
            expect(resource1).to.equal(true);
            var resource2 = await resourcescontract.viewWheat(0);
            expect(resource2).to.equal(true);
        })
    })

    describe("Bonus Resources", async function () {
        it("test bonus resources beer", async function () {
            // aluminium, lumber, water, wheat
            await resourcescontract.mockResourcesForTesting(0, 0, 9)
            await resourcescontract.mockResourcesForTesting(1, 18, 19)
            await resourcescontract.mockResourcesForTesting(2, 4, 5)
            await resourcescontract.mockResourcesForTesting(3, 6, 7)
            await resourcescontract.mockResourcesForTesting(4, 8, 9)
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer1).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            var beer = await bonusresourcescontract.viewBeer(0);
            expect(beer).to.equal(true);
        })

        it("test bonus resources steel", async function () {
            // iron, coal
            await resourcescontract.mockResourcesForTesting(0, 2, 7)
            await resourcescontract.mockResourcesForTesting(1, 9, 10)
            await resourcescontract.mockResourcesForTesting(2, 4, 5)
            await resourcescontract.mockResourcesForTesting(3, 6, 7)
            await resourcescontract.mockResourcesForTesting(4, 8, 9)
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer1).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            var steel = await bonusresourcescontract.viewSteel(0);
            expect(steel).to.equal(true);
        })

        it("test bonus resources construction", async function () {
            // aluminium, iron, lumber, marble
            await resourcescontract.mockResourcesForTesting(0, 0, 7)
            await resourcescontract.mockResourcesForTesting(1, 9, 10)
            await resourcescontract.mockResourcesForTesting(2, 4, 5)
            await resourcescontract.mockResourcesForTesting(3, 6, 7)
            await resourcescontract.mockResourcesForTesting(4, 8, 9)
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer1).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            var construction = await bonusresourcescontract.viewConstruction(0);
            expect(construction).to.equal(true);
        })

        it("test bonus resources fast food", async function () {
            // cattle, sugar, spices, pigs
            await resourcescontract.mockResourcesForTesting(0, 1, 16)
            await resourcescontract.mockResourcesForTesting(1, 15, 12)
            await resourcescontract.mockResourcesForTesting(2, 4, 5)
            await resourcescontract.mockResourcesForTesting(3, 6, 7)
            await resourcescontract.mockResourcesForTesting(4, 8, 9)
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer1).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            var fastfood = await bonusresourcescontract.viewFastFood(0);
            expect(fastfood).to.equal(true);
        })

        it("test bonus resources fine jewelry", async function () {
            // gold, silver, gems, coal
            await resourcescontract.mockResourcesForTesting(0, 6, 14)
            await resourcescontract.mockResourcesForTesting(1, 5, 2)
            await resourcescontract.mockResourcesForTesting(2, 4, 5)
            await resourcescontract.mockResourcesForTesting(3, 6, 7)
            await resourcescontract.mockResourcesForTesting(4, 8, 9)
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer1).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            var finejewelry = await bonusresourcescontract.viewFineJewelry(0);
            expect(finejewelry).to.equal(true);
        })

        it("test bonus resources scholars", async function () {
            // lumber, lead
            await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
            await resourcescontract.mockResourcesForTesting(0, 0, 1)
            await resourcescontract.mockResourcesForTesting(1, 2, 3)
            await resourcescontract.mockResourcesForTesting(2, 4, 5)
            await resourcescontract.mockResourcesForTesting(3, 6, 7)
            await resourcescontract.mockResourcesForTesting(4, 8, 9)
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer1).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            var scholars = await bonusresourcescontract.viewScholars(0);
            console.log(scholars);
            expect(scholars).to.equal(true);
        })

        it("test bonus resources asphalt", async function () {
            // oil, rubber, construction
            await resourcescontract.mockResourcesForTesting(0, 11, 13)
            await resourcescontract.mockResourcesForTesting(1, 9, 7)
            await resourcescontract.mockResourcesForTesting(2, 10, 0)
            await resourcescontract.mockResourcesForTesting(3, 6, 7)
            await resourcescontract.mockResourcesForTesting(4, 8, 9)
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer1).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            var asphalt = await bonusresourcescontract.viewAsphalt(0);
            expect(asphalt).to.equal(true);
        })

        it("test bonus resources automobiles", async function () {
            // asphalt, steel
            await resourcescontract.mockResourcesForTesting(0, 11, 13)
            await resourcescontract.mockResourcesForTesting(1, 9, 7)
            await resourcescontract.mockResourcesForTesting(2, 10, 0)
            await resourcescontract.mockResourcesForTesting(3, 2, 7)
            await resourcescontract.mockResourcesForTesting(4, 8, 9)
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer1).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            var automobiles = await bonusresourcescontract.viewAutomobiles(0);
            expect(automobiles).to.equal(true);
        })

        it("test bonus resources affluent population", async function () {
            // fine jewelry, fish, furs, wine
            await resourcescontract.mockResourcesForTesting(0, 6, 14)
            await resourcescontract.mockResourcesForTesting(1, 5, 2)
            await resourcescontract.mockResourcesForTesting(2, 3, 4)
            await resourcescontract.mockResourcesForTesting(3, 20, 7)
            await resourcescontract.mockResourcesForTesting(4, 8, 9)
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer1).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            var affluentpopulation = await bonusresourcescontract.viewAffluentPopulation(0);
            expect(affluentpopulation).to.equal(true);
        })

        it("test bonus resources microchips", async function () {
            // gold, lead, oil, tech > 10
            await technologymarketcontrat.connect(signer1).buyTech(0, 100);
            await resourcescontract.mockResourcesForTesting(0, 6, 11)
            await resourcescontract.mockResourcesForTesting(1, 8, 3)
            await resourcescontract.mockResourcesForTesting(2, 4, 5)
            await resourcescontract.mockResourcesForTesting(3, 6, 7)
            await resourcescontract.mockResourcesForTesting(4, 8, 9)
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer1).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            var microchips = await bonusresourcescontract.viewMicrochips(0);
            expect(microchips).to.equal(true);
        })

        it("test bonus resources radiation cleanup", async function () {
            // construction, microships, steel
            await technologymarketcontrat.connect(signer1).buyTech(0, 100);
            await resourcescontract.mockResourcesForTesting(0, 9, 7)
            await resourcescontract.mockResourcesForTesting(1, 10, 0)
            await resourcescontract.mockResourcesForTesting(2, 6, 8)
            await resourcescontract.mockResourcesForTesting(3, 11, 7)
            await resourcescontract.mockResourcesForTesting(4, 2, 9)
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer1).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            var radiationcleanup = await bonusresourcescontract.viewRadiationCleanup(0);
            expect(radiationcleanup).to.equal(true);
        })
    })

    it("tests that the sanction functionality removes trading partners", async function () {
        await resourcescontract.mockResourcesForTesting(0, 9, 7)
        await resourcescontract.mockResourcesForTesting(1, 10, 0)
        await resourcescontract.mockResourcesForTesting(2, 6, 8)
        await resourcescontract.mockResourcesForTesting(3, 11, 7)
        await resourcescontract.mockResourcesForTesting(4, 2, 9)
        await resourcescontract.connect(signer1).proposeTrade(0, 1);
        await resourcescontract.connect(signer1).proposeTrade(0, 2);
        await resourcescontract.connect(signer1).proposeTrade(0, 3);
        await resourcescontract.connect(signer1).proposeTrade(4, 0);
        await resourcescontract.connect(signer1).fulfillTradingPartner(1, 0);
        await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
        await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
        await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
        var tradingpartners = await resourcescontract.getTradingPartners(0);
        expect(tradingpartners.length).to.equal(4);
        await senatecontract.electSenatorForTesting(1)
        await senatecontract.connect(signer1).sanctionTeamMember(1, 0);
        var sanctioned = await senatecontract.isSanctioned(0, 2);
        expect(sanctioned).to.equal(true);
        var tradingpartners = await resourcescontract.getTradingPartners(0);
        expect(tradingpartners.length).to.equal(0);
    })
})