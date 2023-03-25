import { expect } from "chai"
import { network, ethers } from "hardhat"
import { INITIAL_SUPPLY } from "../helper-hardhat-config"
import { 
    WarBucks, 
    MetaNationsGovToken,
    AidContract,
    AirBattleContract,
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
    BonusResourcesContract,
} from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { networkConfig } from "../helper-hardhat-config"

describe("Improvements", async function () {

    let warbucks: WarBucks  
    let metanationsgovtoken: MetaNationsGovToken
    let aidcontract: AidContract
    let airbattlecontract: AirBattleContract
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

    beforeEach(async function () {
        
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
    
        if (chainId == 31337) {
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
        keepercontract = await KeeperContract.deploy() as KeeperContract
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
        senatecontract = await SenateContract.deploy() as SenateContract
        await senatecontract.deployed()
        // console.log(`SenateContract deployed to ${senatecontract.address}`)
        
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
            treasurycontract.address
        )
  
        await aidcontract.settings(
            countryminter.address, 
            treasurycontract.address, 
            forcescontract.address, 
            infrastructurecontract.address, 
            keepercontract.address, 
            wonderscontract1.address)

        await airbattlecontract.settings(
            warcontract.address, 
            fighterscontract.address, 
            bomberscontract.address, 
            infrastructurecontract.address, 
            forcescontract.address, 
            fighterlosses.address)
        
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
            navycontract2.address)
        
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
            aidcontract.address,
            missilescontract.address,
            senatecontract.address)
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
            navalactionscontract.address,
            fighterscontract.address,
            fightersmarketplace1.address,
            fightersmarketplace2.address,
            bomberscontract.address,
            bombersmarketplace1.address,
            bombersmarketplace2.address)
        
        await countryparameterscontract.settings(
            spyoperationscontract.address,
            countryminter.address,
            senatecontract.address,
            keepercontract.address,
            nukecontract.address,
            groundbattlecontract.address
        )

        await crimecontract.settings(
            infrastructurecontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            countryparameterscontract.address)
        
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
            taxescontract.address,
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
            keepercontract.address)
        
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
            countryminter.address)
        await groundbattlecontract.settings2(
            improvementscontract2.address,
            improvementscontract3.address,
            wonderscontract3.address,
            wonderscontract4.address,
            taxescontract.address,
            countryparameterscontract.address)
        
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
            improvementscontract1.address)
        
        await improvementscontract3.settings(
            treasurycontract.address,
            additionalnavycontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            countryminter.address)
        
        await improvementscontract4.settings(
            treasurycontract.address,
            forcescontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            countryminter.address)
        
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
            crimecontract.address
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

        await keepercontract.settings(
            nukecontract.address,
            aidcontract.address,
            warcontract.address,
            treasurycontract.address,
            missilescontract.address,
            navalactionscontract.address,
            countryparameterscontract.address
        )

        await landmarketcontract.settings(
            resourcescontract.address,
            countryminter.address,
            infrastructurecontract.address,
            treasurycontract.address
        )

        await militarycontract.settings(
            spyoperationscontract.address,
            countryminter.address
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
            navycontract2.address
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
            navycontract.address
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
            warcontract.address
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
            bonusresourcescontract.address
        )
        await bonusresourcescontract.settings(
            infrastructurecontract.address,
            countryminter.address,
            resourcescontract.address
        )

        await senatecontract.settings(
            countryminter.address,
            countryparameterscontract.address,
            wonderscontract3.address
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

        await taxescontract.settings1(
            countryminter.address,
            infrastructurecontract.address,
            treasurycontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            additionaltaxescontract.address,
            bonusresourcescontract.address
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
            crimecontract.address
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
            improvementscontract3.address
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
            bonusresourcescontract.address
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
            technologymarketcontrat.address
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
            treasurycontract.address
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

        // console.log("country 1");
        await countryminter.connect(signer1).generateCountry(
            "TestRuler",
            "TestNationName",
            "TestCapitalCity",
            "TestNationSlogan"
        )
        let ownerInitialWarBucksBalance : any = await warbucks.balanceOf(signer0.address);
        await warbucks.connect(signer0).approve(warbucks.address, BigInt(ownerInitialWarBucksBalance));
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(ownerInitialWarBucksBalance));
        await treasurycontract.connect(signer1).addFunds(BigInt(500000000*(10**18)), 0);
        await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500);
    });

    describe("Improvements Contract 1", function () {
        //airport
        it("improvement1 airport tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 1);
            var count = await improvementscontract1.getAirportCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 1);
            var newCount = await improvementscontract1.getAirportCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement1 airport purchase errors", async function () {
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 1, 1)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 1)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 1)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 1)).to.be.revertedWith("Cannot own more than 3");
            await improvementscontract1.connect(signer0).updateAirportCost(BigInt(10*10**30));
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 1)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement1 tests airport price can be updated", async function () {
            let prices = await improvementscontract1.getCost1();
            var cost : any = prices[0];
            expect(BigInt(cost).toString()).to.equal("100000000000000000000000");
            await improvementscontract1.connect(signer0).updateAirportCost(100);
            let newPrices = await improvementscontract1.getCost1();
            var newCost = newPrices[0];
            expect(newCost.toNumber()).to.equal(100);
        })

        //bank
        it("improvement1 bank tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 2);
            var count = await improvementscontract1.getBankCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 2);
            var newCount = await improvementscontract1.getBankCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement1 bank purchase errors", async function () {
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 1, 2)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 2)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 2)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 2)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract1.connect(signer0).updateBankCost(BigInt(10*10**30));
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 2)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement1 tests bank price can be updated", async function () {
            let prices = await improvementscontract1.getCost1();
            var cost : any = prices[1];
            expect(BigInt(cost).toString()).to.equal("100000000000000000000000");
            await improvementscontract1.connect(signer0).updateBankCost(100);
            let newPrices = await improvementscontract1.getCost1();
            var newCost = newPrices[1];
            expect(newCost.toNumber()).to.equal(100);
        })

        //barracks
        it("improvement1 barracks tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 3);
            var count = await improvementscontract1.getBarracksCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 3);
            var newCount = await improvementscontract1.getBarracksCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement1 barracks purchase errors", async function () {
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 1, 3)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 3)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 3)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 3)).to.be.revertedWith("Cannot own more than 3");
            await improvementscontract1.connect(signer0).updateBarracksCost(BigInt(10*10**30));
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 3)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement1 tests barracks price can be updated", async function () {
            let prices = await improvementscontract1.getCost1();
            var cost : any = prices[2];
            expect(BigInt(cost).toString()).to.equal("50000000000000000000000");
            await improvementscontract1.connect(signer0).updateBarracksCost(100);
            let newPrices = await improvementscontract1.getCost1();
            var newCost = newPrices[2];
            expect(newCost.toNumber()).to.equal(100);
        })

        //border fortification
        it("improvement1 border fortification tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 4);
            var count = await improvementscontract1.getBorderFortificationCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 4);
            var newCount = await improvementscontract1.getBorderFortificationCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(4);
        })

        it("improvement1 border fortification purchase errors", async function () {
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 4)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 4)).to.be.revertedWith("Must own a border wall for every fortification");
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 2);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 4)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000)
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 4)).to.be.revertedWith("Cannot own if forward operating base is owned");
            await improvementscontract2.connect(signer1).deleteImprovement2(1, 0, 2);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 1, 4)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 4)).to.be.revertedWith("Cannot own more than 3");
            await improvementscontract1.connect(signer0).updateBorderFortificationCost(BigInt(10*10**30));
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 4)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement1 tests border fortification price can be updated", async function () {
            let prices = await improvementscontract1.getCost1();
            var cost : any = prices[3];
            expect(BigInt(cost).toString()).to.equal("125000000000000000000000");
            await improvementscontract1.connect(signer0).updateBorderFortificationCost(100);
            let newPrices = await improvementscontract1.getCost1();
            var newCost = newPrices[3];
            expect(newCost.toNumber()).to.equal(100);
        })

        //border wall
        it("improvement1 border wall tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            var count = await improvementscontract1.getBorderWallCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            var newCount = await improvementscontract1.getBorderWallCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement1 border wall purchase errors", async function () {
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 1, 5)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 5)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 5)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 5)).to.be.revertedWith("Boarder walls can only be purchased 1 at a time");
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract1.connect(signer0).updateBorderWallCost(BigInt(10*10**30));
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement1 tests border wall price can be updated", async function () {
            let prices = await improvementscontract1.getCost1();
            var cost :any = prices[4];
            expect(BigInt(cost).toString()).to.equal("60000000000000000000000");
            await improvementscontract1.connect(signer0).updateBorderWallCost(100);
            let newPrices = await improvementscontract1.getCost1();
            var newCost = newPrices[4];
            expect(newCost.toNumber()).to.equal(100);
        })

        //bunker
        it("improvement1 bunker tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 3);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 6);
            var count = await improvementscontract1.getBunkerCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 6);
            var newCount = await improvementscontract1.getBunkerCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(4);
        })

        it("improvement1 bunker purchase errors", async function () {
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 6)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 6)).to.be.revertedWith("Must own a barracks for every bunker");
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 3);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 1, 6)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 6)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 6)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 2);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 6)).to.be.revertedWith("Cannot own if forward operating base is owned");
            await improvementscontract2.connect(signer1).deleteImprovement2(1, 0, 2);
            await improvementscontract4.connect(signer1).buyImprovement4(1, 0, 2);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 6)).to.be.revertedWith("Cannot own if munitions factory is owned");
            await improvementscontract4.connect(signer1).deleteImprovement4(1, 0, 2);
            await improvementscontract1.connect(signer0).updateBunkerCost(BigInt(10*10**30));
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 6)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement1 tests bunker price can be updated", async function () {
            let prices = await improvementscontract1.getCost1();
            var cost : any = prices[5];
            expect(BigInt(cost).toString()).to.equal("200000000000000000000000");
            await improvementscontract1.connect(signer0).updateBunkerCost(100);
            let newPrices = await improvementscontract1.getCost1();
            var newCost = newPrices[5];
            expect(newCost.toNumber()).to.equal(100);
        })

        //casino
        it("improvement1 casino tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 7);
            var count = await improvementscontract1.getCasinoCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 7);
            var newCount = await improvementscontract1.getCasinoCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement1 casino purchase errors", async function () {
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 1, 7)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 7)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 7)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 7)).to.be.revertedWith("Cannot own more than 2");
            await improvementscontract1.connect(signer0).updateCasinoCost(BigInt(10*10**30));
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 7)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement1 casino price can be updated", async function () {
            let prices = await improvementscontract1.getCost1();
            var cost : any = prices[6];
            expect(BigInt(cost).toString()).to.equal("100000000000000000000000");
            await improvementscontract1.connect(signer0).updateCasinoCost(100);
            let newPrices = await improvementscontract1.getCost1();
            var newCost = newPrices[6];
            expect(newCost.toNumber()).to.equal(100);
        })
        
        //church
        it("improvement1 church tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 8);
            var count = await improvementscontract1.getChurchCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 8);
            var newCount = await improvementscontract1.getChurchCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement1 church purchase errors", async function () {
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 1, 8)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 8)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 8)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 8)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract1.connect(signer0).updateChurchCost(BigInt(10*10**30));
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 8)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement1 church price can be updated", async function () {
            let prices = await improvementscontract1.getCost1();
            var cost : any = prices[7];
            expect(BigInt(cost).toString()).to.equal("40000000000000000000000");
            await improvementscontract1.connect(signer0).updateChurchCost(100);
            let newPrices = await improvementscontract1.getCost1();
            var newCost = newPrices[7];
            expect(newCost.toNumber()).to.equal(100);
        })
        
        //clinic
        it("improvement1 clinic tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 9);
            var count = await improvementscontract1.getClinicCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 9);
            var newCount = await improvementscontract1.getClinicCount(0);
            expect(newCount.toNumber()).to.equal(2);
        })

        it("improvement1 clinic purchase errors", async function () {
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 1, 9)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 9)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 9)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 9)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract1.connect(signer0).updateClinicCost(BigInt(10*10**30));
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 9)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement1 clinic price can be updated", async function () {
            let prices = await improvementscontract1.getCost1();
            var cost : any = prices[8];
            expect(BigInt(cost).toString()).to.equal("50000000000000000000000");
            await improvementscontract1.connect(signer0).updateClinicCost(100);
            let newPrices = await improvementscontract1.getCost1();
            var newCost = newPrices[8];
            expect(newCost.toNumber()).to.equal(100);
        })
        
        //drydock
        it("improvement1 drydock tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 10);
            var count = await improvementscontract1.getDrydockCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 10);
            var newCount = await improvementscontract1.getDrydockCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(3);
        })

        it("improvement1 drydock purchase errors", async function () {
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 1, 10)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 10)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 10)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 10)).to.be.revertedWith("Cannot own more than 5");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 10)).to.be.revertedWith("Must own a harbor first");
            await improvementscontract1.connect(signer0).updateDrydockCost(BigInt(10*10**30));
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 10)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement1 drydock price can be updated", async function () {
            let prices = await improvementscontract1.getCost1();
            var cost : any = prices[9];
            expect(BigInt(cost).toString()).to.equal("100000000000000000000000");
            await improvementscontract1.connect(signer0).updateDrydockCost(100);
            let newPrices = await improvementscontract1.getCost1();
            var newCost = newPrices[9];
            expect(newCost.toNumber()).to.equal(100);
        })
        
        //factory
        it("improvement1 factory tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 11);
            var count = await improvementscontract1.getFactoryCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 11);
            var newCount = await improvementscontract1.getFactoryCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement1 factory purchase errors", async function () {
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 1, 11)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 11)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 11)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract1.connect(signer1).buyImprovement1(6, 0, 11)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract1.connect(signer0).updateFactoryCost(BigInt(10*10**30));
            await expect(improvementscontract1.connect(signer1).buyImprovement1(1, 0, 11)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement1 factory price can be updated", async function () {
            let prices = await improvementscontract1.getCost1();
            var cost : any = prices[10];
            expect(BigInt(cost).toString()).to.equal("150000000000000000000000");
            await improvementscontract1.connect(signer0).updateFactoryCost(100);
            let newPrices = await improvementscontract1.getCost1();
            var newCost = newPrices[10];
            expect(newCost.toNumber()).to.equal(100);
        })

    })

    describe("Improvements Contract 2", function () {
        //foreign ministry
        it("improvement2 foreign ministry tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 1);
            var count = await improvementscontract2.getForeignMinistryCount(0);
            expect(count.toNumber()).to.equal(1);
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 1)).to.be.revertedWith("Cannot own more than 1");
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(1);
        })

        it("improvement2 foreign ministry purchase errors", async function () {
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 1, 1)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 1)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 1)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 1)).to.be.revertedWith("Cannot own more than 1");
            await improvementscontract2.connect(signer0).updateForeignMinistryCost(BigInt(10*10**30));
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 1)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement2 foreign ministry price can be updated", async function () {
            let prices = await improvementscontract2.getCost2();
            var cost : any = prices[0];
            expect(BigInt(cost).toString()).to.equal("120000000000000000000000");
            await improvementscontract2.connect(signer0).updateForeignMinistryCost(100);
            let newPrices = await improvementscontract2.getCost2();
            var newCost = newPrices[0];
            expect(newCost.toNumber()).to.equal(100);
        })

        //forward operating base
        it("improvement2 forward operating base tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 2);
            var count = await improvementscontract2.getForwardOperatingBaseCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 2);
            var newCount = await improvementscontract2.getForwardOperatingBaseCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement2 forward operating base purchase errors", async function () {
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 1, 2)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 2)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 2)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 2)).to.be.revertedWith("Cannot own more than 2");
            await improvementscontract2.connect(signer0).updateForwardOperatingBaseCost(BigInt(10*10**30));
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 2)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement2 forward operating base price can be updated", async function () {
            let prices = await improvementscontract2.getCost2();
            var cost : any = prices[1];
            expect(BigInt(cost).toString()).to.equal("125000000000000000000000");
            await improvementscontract2.connect(signer0).updateForwardOperatingBaseCost(100);
            let newPrices = await improvementscontract2.getCost2();
            var newCost = newPrices[1];
            expect(newCost.toNumber()).to.equal(100);
        })

        //guerilla camp
        it("improvement2 guerilla camp tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 3);
            var count = await improvementscontract2.getGuerillaCampCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 3);
            var newCount = await improvementscontract2.getGuerillaCampCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement2 guerilla camp purchase errors", async function () {
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 1, 3)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 3)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 3)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 3)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract2.connect(signer0).updateGuerillaCampCost(BigInt(10*10**30));
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 3)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement2 guerilla camp price can be updated", async function () {
            let prices = await improvementscontract2.getCost2();
            var cost : any = prices[2];
            expect(BigInt(cost).toString()).to.equal("20000000000000000000000");
            await improvementscontract2.connect(signer0).updateGuerillaCampCost(100);
            let newPrices = await improvementscontract2.getCost2();
            var newCost = newPrices[2];
            expect(newCost.toNumber()).to.equal(100);
        })

        //harbor
        it("improvement2 harbor tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            var count = await improvementscontract2.getHarborCount(0);
            expect(count.toNumber()).to.equal(1);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(1);
        })

        it("improvement2 harbor purchase errors", async function () {
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 1, 4)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 4)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 4)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 4)).to.be.revertedWith("Cannot own more than 1");
            await improvementscontract2.connect(signer0).updateHarborCost(BigInt(10*10**30));
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement2 harbor price can be updated", async function () {
            let prices = await improvementscontract2.getCost2();
            var cost : any = prices[3];
            expect(BigInt(cost).toString()).to.equal("200000000000000000000000")
            await improvementscontract2.connect(signer0).updateHarborCost(100);
            let newPrices = await improvementscontract2.getCost2();
            var newCost = newPrices[3];
            expect(newCost.toNumber()).to.equal(100);
        })

        //hospital
        it("improvement2 hospital tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 5)).to.be.revertedWith("Need to own at least 2 clinics");
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 9);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 5);
            var count = await improvementscontract2.getHospitalCount(0);
            expect(count.toNumber()).to.equal(1);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(3);
        })

        it("improvement2 hospital purchase errors", async function () {
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 5)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 9);
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 1, 5)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 5)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 5)).to.be.revertedWith("Cannot own more than 1");
            await improvementscontract2.connect(signer0).updateHospitalCost(BigInt(10*10**30));
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 5)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement2 hospital price can be updated", async function () {
            let prices = await improvementscontract2.getCost2();
            var cost : any = prices[4];
            expect(BigInt(cost).toString()).to.equal("180000000000000000000000");
            await improvementscontract2.connect(signer0).updateHospitalCost(100);
            let newPrices = await improvementscontract2.getCost2();
            var newCost = newPrices[4];
            expect(newCost.toNumber()).to.equal(100);
        })

        //intel agency
        it("improvement2 intel agency tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 6);
            var count = await improvementscontract2.getIntelAgencyCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 6);
            var newCount = await improvementscontract2.getIntelAgencyCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement2 intel agency purchase errors", async function () {
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 1, 6)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 6)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 6)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 6)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract2.connect(signer0).updateIntelligenceAgencyCost(BigInt(10*10**30));
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 6)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement2 intel agency price can be updated", async function () {
            let prices = await improvementscontract2.getCost2();
            var cost : any = prices[5];
            expect(BigInt(cost).toString()).to.equal("38500000000000000000000")
            await improvementscontract2.connect(signer0).updateIntelligenceAgencyCost(100);
            let newPrices = await improvementscontract2.getCost2();
            var newCost = newPrices[5];
            expect(newCost.toNumber()).to.equal(100);
        })

        //jail
        it("improvement2 jail tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 7);
            var count = await improvementscontract2.getJailCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 7);
            var newCount = await improvementscontract2.getJailCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement2 jail purchase errors", async function () {
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 1, 7)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 7)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 7)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 7)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract2.connect(signer0).updateJailCost(BigInt(10*10**30));
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 7)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement2 jail price can be updated", async function () {
            let prices = await improvementscontract2.getCost2();
            var cost : any = prices[6];
            expect(BigInt(cost).toString()).to.equal("25000000000000000000000");
            await improvementscontract2.connect(signer0).updateJailCost(100);
            let newPrices = await improvementscontract2.getCost2();
            var newCost = newPrices[6];
            expect(newCost.toNumber()).to.equal(100);
        })

        //labor camp
        it("improvement2 labor camp tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 8);
            var count = await improvementscontract2.getLaborCampCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 8);
            var newCount = await improvementscontract2.getLaborCampCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement2 labor camp purchase errors", async function () {
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 1, 8)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 8)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 8)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract2.connect(signer1).buyImprovement2(6, 0, 8)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract2.connect(signer0).updateLaborCampCost(BigInt(10*10**30));
            await expect(improvementscontract2.connect(signer1).buyImprovement2(1, 0, 8)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement2 labor camp price can be updated", async function () {
            let prices = await improvementscontract2.getCost2();
            var cost : any = prices[7];
            expect(BigInt(cost).toString()).to.equal("150000000000000000000000")
            await improvementscontract2.connect(signer0).updateLaborCampCost(100);
            let newPrices = await improvementscontract2.getCost2();
            var newCost = newPrices[7];
            expect(newCost.toNumber()).to.equal(100);
        })
    })

    describe("Improvements Contract 4", function () {
        //missile defense
        it("improvement4 missile defense tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract4.connect(signer1).buyImprovement4(1, 0, 1);
            var count = await improvementscontract4.getMissileDefenseCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract4.connect(signer1).buyImprovement4(1, 0, 1);
            var newCount = await improvementscontract4.getMissileDefenseCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement4 missile defense purchase errors", async function () {
            await expect(improvementscontract4.connect(signer1).buyImprovement4(1, 1, 1)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract4.connect(signer1).buyImprovement4(6, 0, 1)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract4.connect(signer1).buyImprovement4(6, 0, 1)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract4.connect(signer1).buyImprovement4(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract4.connect(signer1).buyImprovement4(6, 0, 1)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract4.connect(signer0).updateMissileDefenseCost(BigInt(10*10**30));
            await expect(improvementscontract4.connect(signer1).buyImprovement4(1, 0, 1)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement4 missile defense price can be updated", async function () {
            let prices = await improvementscontract4.getCost4();
            var cost : any = prices[0];
            expect(BigInt(cost).toString()).to.equal("90000000000000000000000")
            await improvementscontract4.connect(signer0).updateMissileDefenseCost(100);
            let newPrices = await improvementscontract4.getCost4();
            var newCost = newPrices[0];
            expect(newCost.toNumber()).to.equal(100);
        })

        //munitions factory
        it("improvement4 munitions factory tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 3);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 6);
            await expect(improvementscontract4.connect(signer1).buyImprovement4(1, 0, 2)).to.be.revertedWith("Cannot own if bunker is owned");
            await improvementscontract1.connect(signer1).deleteImprovement1(1, 0, 6);
            await improvementscontract4.connect(signer1).buyImprovement4(1, 0, 2);
            var count = await improvementscontract4.getMunitionsFactoryCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract4.connect(signer1).buyImprovement4(1, 0, 2);
            var newCount = await improvementscontract4.getMunitionsFactoryCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(3);
        })

        it("improvement4 munitions factory purchase errors", async function () {
            await expect(improvementscontract4.connect(signer1).buyImprovement4(1, 1, 2)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract4.connect(signer1).buyImprovement4(6, 0, 2)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract4.connect(signer1).buyImprovement4(6, 0, 2)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract4.connect(signer1).buyImprovement4(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract4.connect(signer1).buyImprovement4(6, 0, 2)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract4.connect(signer0).updateMunitionsFactoryCost(BigInt(10*10**30));
            await expect(improvementscontract4.connect(signer1).buyImprovement4(1, 0, 2)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement4 munitions factory price can be updated", async function () {
            let prices = await improvementscontract4.getCost4();
            var cost : any = prices[1];
            expect(BigInt(cost).toString()).to.equal("200000000000000000000000")
            await improvementscontract4.connect(signer0).updateMunitionsFactoryCost(100);
            let newPrices = await improvementscontract4.getCost4();
            var newCost = newPrices[1];
            expect(newCost.toNumber()).to.equal(100);
        })

        //naval academy
        it("improvement4 naval academy tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract4.connect(signer1).buyImprovement4(1, 0, 3)).to.be.revertedWith("must own a harbor to purchase");
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            await improvementscontract4.connect(signer1).buyImprovement4(1, 0, 3);
            var count = await improvementscontract4.getNavalAcademyCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract4.connect(signer1).buyImprovement4(1, 0, 3);
            var newCount = await improvementscontract4.getNavalAcademyCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(3);
        })

        it("improvement4 naval academy purchase errors", async function () {
            await expect(improvementscontract4.connect(signer1).buyImprovement4(6, 0, 3)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            await expect(improvementscontract4.connect(signer1).buyImprovement4(1, 1, 3)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract4.connect(signer1).buyImprovement4(6, 0, 3)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract4.connect(signer1).buyImprovement4(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract4.connect(signer1).buyImprovement4(6, 0, 3)).to.be.revertedWith("Cannot own more than 2");
            await improvementscontract4.connect(signer0).updateNavalAcademyCost(BigInt(10*10**30));
            await expect(improvementscontract4.connect(signer1).buyImprovement4(1, 0, 3)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement4 naval academy price can be updated", async function () {
            let prices = await improvementscontract4.getCost4();
            var cost : any = prices[2];
            expect(BigInt(cost).toString()).to.equal("300000000000000000000000");
            await improvementscontract4.connect(signer0).updateNavalAcademyCost(100);
            let newPrices = await improvementscontract4.getCost4();
            var newCost = newPrices[2];
            expect(newCost.toNumber()).to.equal(100);
        })

        //naval construction yard
        it("improvement4 naval construction yard tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract4.connect(signer1).buyImprovement4(1, 0, 4)).to.be.revertedWith("must own a harbor to purchase");
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            await improvementscontract4.connect(signer1).buyImprovement4(1, 0, 4);
            var count = await improvementscontract4.getNavalConstructionYardCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract4.connect(signer1).buyImprovement4(1, 0, 4);
            var newCount = await improvementscontract4.getNavalConstructionYardCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(3);
        })

        it("improvement4 naval construction yard purchase errors", async function () {
            await expect(improvementscontract4.connect(signer1).buyImprovement4(6, 0, 4)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            await expect(improvementscontract4.connect(signer1).buyImprovement4(1, 1, 4)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract4.connect(signer1).buyImprovement4(6, 0, 4)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract4.connect(signer1).buyImprovement4(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract4.connect(signer1).buyImprovement4(6, 0, 4)).to.be.revertedWith("Cannot own more than 3");
            await improvementscontract4.connect(signer0).updateNavalConstructionYardCost(BigInt(10*10**30));
            await expect(improvementscontract4.connect(signer1).buyImprovement4(1, 0, 4)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement4 naval construction yard price can be updated", async function () {
            let prices = await improvementscontract4.getCost4();
            var cost : any = prices[3];
            expect(BigInt(cost).toString()).to.equal("300000000000000000000000");
            await improvementscontract4.connect(signer0).updateNavalConstructionYardCost(100);
            let newPrices = await improvementscontract4.getCost4();
            var newCost = newPrices[3];
            expect(newCost.toNumber()).to.equal(100);
        })
    })

    describe("Improvements Contract 3", function () {
        //office of propaganda
        it("improvement3 office of propaganda tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 1)).to.be.revertedWith("Must own 1 forward operating base for each office of propaganda")
            await improvementscontract2.connect(signer1).buyImprovement2(2, 0, 2);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 1);
            var count = await improvementscontract3.getOfficeOfPropagandaCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 1);
            var newCount = await improvementscontract3.getOfficeOfPropagandaCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(4);
        })

        it("improvement3 office of propaganda purchase errors", async function () {
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 1)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 2);
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 1, 1)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 1)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 1)).to.be.revertedWith("Cannot own more than 2");
            await improvementscontract3.connect(signer0).updateOfficeOfPropagandaCost(BigInt(10*10**30));
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 1)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement3 office of propaganda price can be updated", async function () {
            let prices = await improvementscontract3.getCost3();
            var cost : any = prices[0];
            expect(BigInt(cost).toString()).to.equal("200000000000000000000000")
            await improvementscontract3.connect(signer0).updateOfficeOfPropagandaCost(100);
            let newPrices = await improvementscontract3.getCost3();
            var newCost = newPrices[0];
            expect(newCost.toNumber()).to.equal(100);
        })

        //police headquarters
        it("improvement3 police headquarters tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 2);
            var count = await improvementscontract3.getPoliceHeadquartersCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 2);
            var newCount = await improvementscontract3.getPoliceHeadquartersCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement3 police headquarters purchase errors", async function () {
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 1, 2)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 2)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 2)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 2)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract3.connect(signer0).updatePoliceHeadquartersCost(BigInt(10*10**30));
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 2)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement3 police headquarters price can be updated", async function () {
            let prices = await improvementscontract3.getCost3();
            var cost : any = prices[1];
            expect(BigInt(cost).toString()).to.equal("75000000000000000000000");
            await improvementscontract3.connect(signer0).updatePoliceHeadquartersCost(100);
            let newPrices = await improvementscontract3.getCost3();
            var newCost = newPrices[1];
            expect(newCost.toNumber()).to.equal(100);
        })

        //prison
        it("improvement3 prison tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 3);
            var count = await improvementscontract3.getPrisonCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 3);
            var newCount = await improvementscontract3.getPrisonCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement3 prison purchase errors", async function () {
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 1, 3)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 3)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 3)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 3)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract3.connect(signer0).updatePrisonCost(BigInt(10*10**30));
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 3)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement3 prison price can be updated", async function () {
            let prices = await improvementscontract3.getCost3();
            var cost : any = prices[2];
            expect(BigInt(cost).toString()).to.equal("200000000000000000000000");
            await improvementscontract3.connect(signer0).updatePrisonCost(100);
            let newPrices = await improvementscontract3.getCost3();
            var newCost = newPrices[2];
            expect(newCost.toNumber()).to.equal(100);
        })

        //radiation containment chamber
        it("improvement3 radiation containment chamber tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 4)).to.be.revertedWith("Must own a bunker for each radiation containment chamber")            
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 3);
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 6);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 4);
            var count = await improvementscontract3.getRadiationContainmentChamberCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 4);
            var newCount = await improvementscontract3.getRadiationContainmentChamberCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(6);
        })

        it("improvement3 radiation containment chamber purchase errors", async function () {
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 1, 4)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 4)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 4)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 4)).to.be.revertedWith("Cannot own more than 2");
            await improvementscontract3.connect(signer0).updateRadiationContainmentChamberCost(BigInt(10*10**30));
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 4)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement3 radiation containment chamber price can be updated", async function () {
            let prices = await improvementscontract3.getCost3();
            var cost : any = prices[3];
            expect(BigInt(cost).toString()).to.equal("200000000000000000000000");
            await improvementscontract3.connect(signer0).updateRadiationContainmentChamberCost(100);
            let newPrices = await improvementscontract3.getCost3();
            var newCost = newPrices[3];
            expect(newCost.toNumber()).to.equal(100);
        })

        //red light district
        it("improvement3 red light district tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 5);
            var count = await improvementscontract3.getRedLightDistrictCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 5);
            var newCount = await improvementscontract3.getRedLightDistrictCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement3 red light district purchase errors", async function () {
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 1, 5)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 5)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 5)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 5)).to.be.revertedWith("Cannot own more than 2");
            await improvementscontract3.connect(signer0).updateRedLightDistrictCost(BigInt(10*10**30));
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 5)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement3 red light district price can be updated", async function () {
            let prices = await improvementscontract3.getCost3();
            var cost : any = prices[4];
            expect(BigInt(cost).toString()).to.equal("50000000000000000000000");
            await improvementscontract3.connect(signer0).updateRedLightDistrictCost(100);
            let newPrices = await improvementscontract3.getCost3();
            var newCost = newPrices[4];
            expect(newCost.toNumber()).to.equal(100);
        })

        //rehabilitation facility
        it("improvement3 rehabilitation facility tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 6);
            var count = await improvementscontract3.getRehabilitationFacilityCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 6);
            var newCount = await improvementscontract3.getRehabilitationFacilityCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement3 rehabilitation facility purchase errors", async function () {
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 1, 6)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 6)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 6)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 6)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract3.connect(signer0).updateRehabilitationFacilityCost(BigInt(10*10**30));
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 6)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement3 rehabilitation facility price can be updated", async function () {
            let prices = await improvementscontract3.getCost3();
            var cost : any = prices[5];
            expect(BigInt(cost).toString()).to.equal("500000000000000000000000");
            await improvementscontract3.connect(signer0).updateRehabilitationFacilityCost(100);
            let newPrices = await improvementscontract3.getCost3();
            var newCost = newPrices[5];
            expect(newCost.toNumber()).to.equal(100);
        })

        //satellite
        it("improvement3 satellite tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 7);
            var count = await improvementscontract3.getSatelliteCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 7);
            var newCount = await improvementscontract3.getSatelliteCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement3 satellite purchase errors", async function () {
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 1, 7)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 7)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 7)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 7)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract3.connect(signer0).updateSatelliteCost(BigInt(10*10**30));
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 7)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement3 satellite price can be updated", async function () {
            let prices = await improvementscontract3.getCost3();
            var cost : any = prices[6];
            expect(BigInt(cost).toString()).to.equal("90000000000000000000000");
            await improvementscontract3.connect(signer0).updateSatelliteCost(100);
            let newPrices = await improvementscontract3.getCost3();
            var newCost = newPrices[6];
            expect(newCost.toNumber()).to.equal(100);
        })

        //school
        it("improvement3 school tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 8);
            var count = await improvementscontract3.getSchoolCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 8);
            var newCount = await improvementscontract3.getSchoolCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement3 school purchase errors", async function () {
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 1, 8)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 8)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 8)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 8)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract3.connect(signer0).updateSchoolCost(BigInt(10*10**30));
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 8)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement3 school price can be updated", async function () {
            let prices = await improvementscontract3.getCost3();
            var cost : any = prices[7];
            expect(BigInt(cost).toString()).to.equal("85000000000000000000000");
            await improvementscontract3.connect(signer0).updateSchoolCost(100);
            let newPrices = await improvementscontract3.getCost3();
            var newCost = newPrices[7];
            expect(newCost.toNumber()).to.equal(100);
        })

        //shipyard
        it("improvement3 shipyard tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 9);
            var count = await improvementscontract3.getShipyardCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 9);
            var newCount = await improvementscontract3.getShipyardCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement3 shipyard purchase errors", async function () {
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 1, 9)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 9)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 9)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 9)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract3.connect(signer0).updateShipyardCost(BigInt(10*10**30));
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 9)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement3 shipyard price can be updated", async function () {
            let prices = await improvementscontract3.getCost3();
            var cost : any = prices[8];
            expect(BigInt(cost).toString()).to.equal("100000000000000000000000");
            await improvementscontract3.connect(signer0).updateShipyardCost(100);
            let newPrices = await improvementscontract3.getCost3();
            var newCost = newPrices[8];
            expect(newCost.toNumber()).to.equal(100);
        })

        //stadium
        it("improvement3 stadium tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 10);
            var count = await improvementscontract3.getStadiumCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 10);
            var newCount = await improvementscontract3.getStadiumCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(2);
        })

        it("improvement3 stadium purchase errors", async function () {
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 1, 10)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 10)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 10)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 10)).to.be.revertedWith("Cannot own more than 5");
            await improvementscontract3.connect(signer0).updateStadiumCost(BigInt(10*10**30));
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 10)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement3 stadium price can be updated", async function () {
            let prices = await improvementscontract3.getCost3();
            var cost : any = prices[9];
            expect(BigInt(cost).toString()).to.equal("110000000000000000000000");
            await improvementscontract3.connect(signer0).updateStadiumCost(100);
            let newPrices = await improvementscontract3.getCost3();
            var newCost = newPrices[9];
            expect(newCost.toNumber()).to.equal(100);
        })

        //university
        it("improvement3 university tests", async function () {
            await billscontract.connect(signer1).payBills(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 11)).to.be.revertedWith("Must own 3 schools to own a university");
            await improvementscontract3.connect(signer1).buyImprovement3(3, 0, 8);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 11);
            var count = await improvementscontract3.getUniversityCount(0);
            expect(count.toNumber()).to.equal(1);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 11);
            var newCount = await improvementscontract3.getUniversityCount(0);
            expect(newCount.toNumber()).to.equal(2);
            const improvementCount = await improvementscontract1.getImprovementCount(0);
            expect(improvementCount).to.equal(5);
        })

        it("improvement3 university purchase errors", async function () {
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 1, 11)).to.be.revertedWith("!nation owner");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 11)).to.be.revertedWith("must pay bills before buying improvements");
            await billscontract.connect(signer1).payBills(0);
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 11)).to.be.revertedWith("population too low to purchase improvement");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500)
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 15)).to.be.revertedWith("Invalid improvement ID");
            await expect(improvementscontract3.connect(signer1).buyImprovement3(6, 0, 11)).to.be.revertedWith("Cannot own more than 2");
            await improvementscontract3.connect(signer0).updateUniversityCost(BigInt(10*10**30));
            await expect(improvementscontract3.connect(signer1).buyImprovement3(1, 0, 11)).to.be.revertedWith("Insufficient balance");
        })

        it("improvement3 university price can be updated", async function () {
            let prices = await improvementscontract3.getCost3();
            var cost : any = prices[10];
            expect(BigInt(cost).toString()).to.equal("180000000000000000000000");
            await improvementscontract3.connect(signer0).updateUniversityCost(100);
            let newPrices = await improvementscontract3.getCost3();
            var newCost = newPrices[10];
            expect(newCost.toNumber()).to.equal(100);
        })
    })
});