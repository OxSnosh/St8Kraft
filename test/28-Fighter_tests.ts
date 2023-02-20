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

describe("Fighter", async function () {

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
    let cruisemissileconract: CruiseMissileContract
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
        cruisemissileconract = await CruiseMissileContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit) as CruiseMissileContract
        await cruisemissileconract.deployed()
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
            bonusresourcescontract.address)
        
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
            keepercontract.address
        )

        await crimecontract.settings(
            infrastructurecontract.address,
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            countryparameterscontract.address)
        
        await cruisemissileconract.settings(
            forcescontract.address,
            countryminter.address,
            warcontract.address,
            infrastructurecontract.address,
            missilescontract.address)
        await cruisemissileconract.settings2(
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
            bonusresourcescontract.address
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
            cruisemissileconract.address,
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
            wonderscontract4.address)
        
        await improvementscontract1.settings(
            treasurycontract.address,
            improvementscontract2.address,
            improvementscontract3.address,
            improvementscontract4.address,
            navycontract.address,
            additionalnavycontract.address,
            countryminter.address,
            wonderscontract1.address)
        
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
            cruisemissileconract.address,
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
            missilescontract.address
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
            bonusresourcescontract.address
        )

        await navalactionscontract.settings(
            navalblockadecontract.address,
            breakblockadecontract.address,
            navalattackcontract.address,
            keepercontract.address,
            navycontract.address,
            countryminter.address
        )

        await additionalnavycontract.settings(
            navycontract.address,
            navalactionscontract.address,
            militarycontract.address,
            wonderscontract1.address,
            improvementscontract4.address
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
            navalactionscontract.address
        )

        await navalattackcontract.settings(
            navycontract.address,
            warcontract.address,
            improvementscontract4.address,
            navalactionscontract.address
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
            improvementscontract1.address,
            infrastructurecontract.address,
            forcescontract.address,
            navycontract.address,
            fighterscontract.address,
            aidcontract.address,
            taxescontract.address,
            billscontract.address,
            spyoperationscontract.address
        )
        await treasurycontract.settings2(
            groundbattlecontract.address,
            countryminter.address,
            keepercontract.address
        )

        await warcontract.settings(
            countryminter.address,
            nationstrengthcontract.address,
            militarycontract.address,
            breakblockadecontract.address,
            navalattackcontract.address,
            airbattlecontract.address,
            groundbattlecontract.address,
            cruisemissileconract.address,
            forcescontract.address,
            wonderscontract1.address,
            keepercontract.address
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

        await countryminter.connect(signer1).generateCountry(
            "TestRuler",
            "TestNationName",
            "TestCapitalCity",
            "TestNationSlogan"
        )
        await warbucks.connect(signer0).approve(warbucks.address, BigInt(10000000000*(10**18)));
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(10000000000*(10**18)));
        await treasurycontract.connect(signer1).addFunds(BigInt(10000000000*(10**18)), 0);
        await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 50)
        await technologymarketcontrat.connect(signer1).buyTech(0, 10)

        await countryminter.connect(signer2).generateCountry(
            "TestRuler2",
            "TestNationName2",
            "TestCapitalCity2",
            "TestNationSlogan2"
        )
        await warbucks.connect(signer0).approve(warbucks.address, BigInt(2000000000*(10**18)));
        await warbucks.connect(signer0).transfer(signer2.address, BigInt(2000000000*(10**18)));
        await treasurycontract.connect(signer2).addFunds(BigInt(2000000000*(10**18)), 1);
        await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 50)
        await technologymarketcontrat.connect(signer2).buyTech(1, 10)
    });

    describe("Buying Fighters", function () {

        it("tests that a nation can buy and scrap Yak9's", async function () {
            var aircraftCount : any = await fighterscontract.getAircraftCount(0);
            // console.log(aircraftCount.toNumber())
            expect(aircraftCount).to.equal(0)
            await expect(fightersmarketplace1.connect(signer1).buyYak9(2, 1)).to.be.revertedWith("!nation ruler")
            var maxAircraftCount = await fightersmarketplace1.getMaxAircraftCount(0)
            // console.log(maxAircraftCount.toNumber())
            expect(maxAircraftCount).to.equal(50);
            await expect(fightersmarketplace1.connect(signer1).buyYak9(2, 0)).to.be.revertedWith("!enough infrastructure")
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 500);
            await expect(fightersmarketplace1.connect(signer1).buyYak9(2, 0)).to.be.revertedWith("!enough tech")
            await technologymarketcontrat.connect(signer1).buyTech(0, 40)
            await fightersmarketplace1.connect(signer1).buyYak9(2, 0)
            var aircraftCount : any = await fighterscontract.getAircraftCount(0);
            // console.log(aircraftCount.toNumber())
            expect(aircraftCount).to.equal(2)
            var yak9Count = await fighterscontract.getDefendingYak9Count(0)
            // console.log(yak9Count.toNumber())
            expect(yak9Count).to.equal(2)
            await expect(fighterscontract.connect(signer1).scrapYak9(2, 1)).to.be.revertedWith("!nation ruler")
            await expect(fighterscontract.connect(signer1).scrapYak9(3, 0)).to.be.revertedWith("cannot delete that many")
            await fighterscontract.connect(signer1).scrapYak9(2, 0)
            var yak9Count = await fighterscontract.getDefendingYak9Count(0)
            // console.log(yak9Count.toNumber())
            expect(yak9Count).to.equal(0)
        })

        it("tests that owner can update Yak9 specs", async function () {
            var specs : any = await fightersmarketplace1.getYak9Specs()
            var price = BigInt(specs[0])
            // console.log(price)
            // console.log(specs[1].toNumber())
            // console.log(specs[2].toNumber())
            expect(price).to.equal(BigInt(10000000000000000000000))
            expect(specs[1]).to.equal(100)
            expect(specs[2]).to.equal(30)
            await fightersmarketplace1.connect(signer0).updateYak9Specs(1000, 1000, 1000)
            var specs : any = await fightersmarketplace1.getYak9Specs()
            // console.log(specs[0].toNumber())
            // console.log(specs[1].toNumber())
            // console.log(specs[2].toNumber())
            expect(specs[0]).to.equal(1000)
            expect(specs[1]).to.equal(1000)
            expect(specs[2]).to.equal(1000)
        })

        it("tests that Yak9 cost updates correctly", async function () {
            var cost : any = await fightersmarketplace1.getYak9Cost(0)
            expect(cost).to.equal(BigInt(10000000000000000000000))
            await resourcescontract.mockResourcesForTesting(0, 0, 2)
            var cost2 : any = await fightersmarketplace1.getYak9Cost(0)
            // console.log(BigInt(cost2), "aluminium")
            expect(cost2).to.equal(BigInt(9200000000000000000000))
            await resourcescontract.mockResourcesForTesting(0, 11, 2)
            var cost3 : any = await fightersmarketplace1.getYak9Cost(0)
            // console.log(BigInt(cost3), "oil")
            expect(cost3).to.equal(BigInt(9600000000000000000000))
            await resourcescontract.mockResourcesForTesting(0, 13, 2)
            var cost4 : any = await fightersmarketplace1.getYak9Cost(0)
            // console.log(BigInt(cost4), "rubber")
            expect(cost4).to.equal(BigInt(9600000000000000000000))
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 1)
            var cost5 : any = await fightersmarketplace1.getYak9Cost(0)
            // console.log(BigInt(cost5), "2 airports")
            expect(cost5).to.equal(BigInt(9200000000000000000000))
            await wonderscontract4.connect(signer1).buyWonder4(0, 2)
            var cost6 : any = await fightersmarketplace1.getYak9Cost(0)
            // console.log(BigInt(cost6), "space program")
            expect(cost6).to.equal(BigInt(8700000000000000000000))
        })

        it("tests that a nation can buy and scrap P51Mustang's", async function () {
            var aircraftCount : any = await fighterscontract.getAircraftCount(0);
            // console.log(aircraftCount.toNumber())
            expect(aircraftCount).to.equal(0)
            await expect(fightersmarketplace1.connect(signer1).buyP51Mustang(2, 1)).to.be.revertedWith("!nation ruler")
            var maxAircraftCount = await fightersmarketplace1.getMaxAircraftCount(0)
            // console.log(maxAircraftCount.toNumber())
            expect(maxAircraftCount).to.equal(50);
            await expect(fightersmarketplace1.connect(signer1).buyP51Mustang(2, 0)).to.be.revertedWith("!enough infrastructure")
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await expect(fightersmarketplace1.connect(signer1).buyP51Mustang(2, 0)).to.be.revertedWith("!enough tech")
            await technologymarketcontrat.connect(signer1).buyTech(0, 65)
            await fightersmarketplace1.connect(signer1).buyP51Mustang(2, 0)
            var aircraftCount : any = await fighterscontract.getAircraftCount(0);
            // console.log(aircraftCount.toNumber())
            expect(aircraftCount).to.equal(2)
            var count = await fighterscontract.getDefendingP51MustangCount(0)
            // console.log(yak9Count.toNumber())
            expect(count).to.equal(2)
            await expect(fighterscontract.connect(signer1).scrapP51Mustang(2, 1)).to.be.revertedWith("!nation ruler")
            await expect(fighterscontract.connect(signer1).scrapP51Mustang(3, 0)).to.be.revertedWith("cannot delete that many")
            await fighterscontract.connect(signer1).scrapP51Mustang(2, 0)
            var count = await fighterscontract.getDefendingP51MustangCount(0)
            // console.log(yak9Count.toNumber())
            expect(count).to.equal(0)
        })

        it("tests that owner can update P51Mustang specs", async function () {
            var specs : any = await fightersmarketplace1.getP51MustangSpecs()
            var price = BigInt(specs[0])
            // console.log(price)
            // console.log(specs[1].toNumber())
            // console.log(specs[2].toNumber())
            expect(specs[0]).to.equal(BigInt("15000000000000000000000"))
            expect(specs[1]).to.equal(200)
            expect(specs[2]).to.equal(65)
            await fightersmarketplace1.connect(signer0).updateP51MustangSpecs(1000, 1000, 1000)
            var specs : any = await fightersmarketplace1.getP51MustangSpecs()
            // console.log(specs[0].toNumber())
            // console.log(specs[1].toNumber())
            // console.log(specs[2].toNumber())
            expect(specs[0]).to.equal(1000)
            expect(specs[1]).to.equal(1000)
            expect(specs[2]).to.equal(1000)
        })

        it("tests that P51Mustang cost updates correctly", async function () {
            var cost : any = await fightersmarketplace1.getP51MustangCost(0)
            expect(cost).to.equal(BigInt(15000000000000000000000))
            await resourcescontract.mockResourcesForTesting(0, 0, 2)
            var cost2 : any = await fightersmarketplace1.getP51MustangCost(0)
            // console.log(BigInt(cost2), "aluminium")
            expect(cost2).to.equal(BigInt(13800000000000000000000))
            await resourcescontract.mockResourcesForTesting(0, 11, 2)
            var cost3 : any = await fightersmarketplace1.getP51MustangCost(0)
            // console.log(BigInt(cost3), "oil")
            expect(cost3).to.equal(BigInt(14400000000000000000000))
            await resourcescontract.mockResourcesForTesting(0, 13, 2)
            var cost4 : any = await fightersmarketplace1.getP51MustangCost(0)
            // console.log(BigInt(cost4), "rubber")
            expect(cost4).to.equal(BigInt(14400000000000000000000))
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 1)
            var cost5 : any = await fightersmarketplace1.getP51MustangCost(0)
            // console.log(BigInt(cost5), "2 airports")
            await improvementscontract1.connect(signer1).deleteImprovement1(2, 0, 1)
            expect(cost5).to.equal(BigInt(13800000000000000000000))
            await wonderscontract4.connect(signer1).buyWonder4(0, 2)
            var cost6 : any = await fightersmarketplace1.getP51MustangCost(0)
            // console.log(BigInt(cost6), "space program")
            expect(cost6).to.equal(BigInt("13650000000000000000000"))
        })

        it("tests that a nation can buy and scrap F86Sabre's", async function () {
            var aircraftCount : any = await fighterscontract.getAircraftCount(0);
            // console.log(aircraftCount.toNumber())
            expect(aircraftCount).to.equal(0)
            await expect(fightersmarketplace1.connect(signer1).buyF86Sabre(2, 1)).to.be.revertedWith("!nation ruler")
            var maxAircraftCount = await fightersmarketplace1.getMaxAircraftCount(0)
            // console.log(maxAircraftCount.toNumber())
            expect(maxAircraftCount).to.equal(50);
            await expect(fightersmarketplace1.connect(signer1).buyF86Sabre(2, 0)).to.be.revertedWith("!enough infrastructure")
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await expect(fightersmarketplace1.connect(signer1).buyF86Sabre(2, 0)).to.be.revertedWith("!enough tech")
            await technologymarketcontrat.connect(signer1).buyTech(0, 105)
            await fightersmarketplace1.connect(signer1).buyF86Sabre(2, 0)
            var aircraftCount : any = await fighterscontract.getAircraftCount(0);
            // console.log(aircraftCount.toNumber())
            expect(aircraftCount).to.equal(2)
            var count = await fighterscontract.getDefendingF86SabreCount(0)
            // console.log(yak9Count.toNumber())
            expect(count).to.equal(2)
            await expect(fighterscontract.connect(signer1).scrapF86Sabre(2, 1)).to.be.revertedWith("!nation ruler")
            await expect(fighterscontract.connect(signer1).scrapF86Sabre(3, 0)).to.be.revertedWith("cannot delete that many")
            await fighterscontract.connect(signer1).scrapF86Sabre(2, 0)
            var count = await fighterscontract.getDefendingF86SabreCount(0)
            // console.log(yak9Count.toNumber())
            expect(count).to.equal(0)
        })

        it("tests that owner can update F86Sabre specs", async function () {
            var specs : any = await fightersmarketplace1.getF86SabreSpecs()
            var price = BigInt(specs[0])
            // console.log(price)
            // console.log(specs[1].toNumber())
            // console.log(specs[2].toNumber())
            expect(specs[0]).to.equal(BigInt("20000000000000000000000"))
            expect(specs[1]).to.equal(300)
            expect(specs[2]).to.equal(105)
            await fightersmarketplace1.connect(signer0).updateF86SabreSpecs(1000, 1000, 1000)
            var specs : any = await fightersmarketplace1.getF86SabreSpecs()
            // console.log(specs[0].toNumber())
            // console.log(specs[1].toNumber())
            // console.log(specs[2].toNumber())
            expect(specs[0]).to.equal(1000)
            expect(specs[1]).to.equal(1000)
            expect(specs[2]).to.equal(1000)
        })

        it("tests that F86Sabre cost updates correctly", async function () {
            var cost : any = await fightersmarketplace1.getF86SabreCost(0)
            expect(cost).to.equal(BigInt(20000000000000000000000))
            await resourcescontract.mockResourcesForTesting(0, 0, 2)
            var cost2 : any = await fightersmarketplace1.getF86SabreCost(0)
            // console.log(BigInt(cost2), "aluminium")
            expect(cost2).to.equal(BigInt(18400000000000000000000))
            await resourcescontract.mockResourcesForTesting(0, 11, 2)
            var cost3 : any = await fightersmarketplace1.getF86SabreCost(0)
            // console.log(BigInt(cost3), "oil")
            expect(cost3).to.equal(BigInt(19200000000000000000000))
            await resourcescontract.mockResourcesForTesting(0, 13, 2)
            var cost4 : any = await fightersmarketplace1.getF86SabreCost(0)
            // console.log(BigInt(cost4), "rubber")
            expect(cost4).to.equal(BigInt(19200000000000000000000))
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 1)
            var cost5 : any = await fightersmarketplace1.getF86SabreCost(0)
            // console.log(BigInt(cost5), "2 airports")
            expect(cost5).to.equal(BigInt(18400000000000000000000))
            await improvementscontract1.connect(signer1).deleteImprovement1(2, 0, 1)
            await wonderscontract4.connect(signer1).buyWonder4(0, 2)
            var cost6 : any = await fightersmarketplace1.getF86SabreCost(0)
            // console.log(BigInt(cost6), "space program")
            expect(cost6).to.equal(BigInt("18200000000000000000000"))
        })

        it("tests that a nation can buy and scrap Mig15's", async function () {
            var aircraftCount : any = await fighterscontract.getAircraftCount(0);
            // console.log(aircraftCount.toNumber())
            expect(aircraftCount).to.equal(0)
            await expect(fightersmarketplace1.connect(signer1).buyMig15(2, 1)).to.be.revertedWith("!nation ruler")
            var maxAircraftCount = await fightersmarketplace1.getMaxAircraftCount(0)
            // console.log(maxAircraftCount.toNumber())
            expect(maxAircraftCount).to.equal(50);
            await expect(fightersmarketplace1.connect(signer1).buyMig15(2, 0)).to.be.revertedWith("!enough infrastructure")
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await expect(fightersmarketplace1.connect(signer1).buyMig15(2, 0)).to.be.revertedWith("!enough tech")
            await technologymarketcontrat.connect(signer1).buyTech(0, 150)
            await fightersmarketplace1.connect(signer1).buyMig15(2, 0)
            var aircraftCount : any = await fighterscontract.getAircraftCount(0);
            // console.log(aircraftCount.toNumber())
            expect(aircraftCount).to.equal(2)
            var count = await fighterscontract.getDefendingMig15Count(0)
            // console.log(yak9Count.toNumber())
            expect(count).to.equal(2)
            await expect(fighterscontract.connect(signer1).scrapMig15(2, 1)).to.be.revertedWith("!nation ruler")
            await expect(fighterscontract.connect(signer1).scrapMig15(3, 0)).to.be.revertedWith("cannot delete that many")
            await fighterscontract.connect(signer1).scrapMig15(2, 0)
            var count = await fighterscontract.getDefendingMig15Count(0)
            // console.log(yak9Count.toNumber())
            expect(count).to.equal(0)
        })

        it("tests that owner can update Mig15 specs", async function () {
            var specs : any = await fightersmarketplace1.getMig15Specs()
            var price = BigInt(specs[0])
            // console.log(price)
            // console.log(specs[1].toNumber())
            // console.log(specs[2].toNumber())
            expect(specs[0]).to.equal(BigInt("25000000000000000000000"))
            expect(specs[1]).to.equal(400)
            expect(specs[2]).to.equal(150)
            await fightersmarketplace1.connect(signer0).updateMig15Specs(1000, 1000, 1000)
            var specs : any = await fightersmarketplace1.getMig15Specs()
            // console.log(specs[0].toNumber())
            // console.log(specs[1].toNumber())
            // console.log(specs[2].toNumber())
            expect(specs[0]).to.equal(1000)
            expect(specs[1]).to.equal(1000)
            expect(specs[2]).to.equal(1000)
        })

        it("tests that Mig15 cost updates correctly", async function () {
            var cost : any = await fightersmarketplace1.getMig15Cost(0)
            expect(cost).to.equal(BigInt("25000000000000000000000"))
            await resourcescontract.mockResourcesForTesting(0, 0, 2)
            var cost2 : any = await fightersmarketplace1.getMig15Cost(0)
            // console.log(BigInt(cost2), "aluminium")
            expect(cost2).to.equal(BigInt("23000000000000000000000"))
            await resourcescontract.mockResourcesForTesting(0, 11, 2)
            var cost3 : any = await fightersmarketplace1.getMig15Cost(0)
            // console.log(BigInt(cost3), "oil")
            expect(cost3).to.equal(BigInt("24000000000000000000000"))
            await resourcescontract.mockResourcesForTesting(0, 13, 2)
            var cost4 : any = await fightersmarketplace1.getMig15Cost(0)
            // console.log(BigInt(cost4), "rubber")
            expect(cost4).to.equal(BigInt("24000000000000000000000"))
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 1)
            var cost5 : any = await fightersmarketplace1.getMig15Cost(0)
            // console.log(BigInt(cost5), "2 airports")
            expect(cost5).to.equal(BigInt("23000000000000000000000"))
            await improvementscontract1.connect(signer1).deleteImprovement1(2, 0, 1)
            await wonderscontract4.connect(signer1).buyWonder4(0, 2)
            var cost6 : any = await fightersmarketplace1.getMig15Cost(0)
            // console.log(BigInt(cost6), "space program")
            expect(cost6).to.equal(BigInt("22750000000000000000000"))
        })

        it("tests that a nation can buy and scrap F100SuperSabre's", async function () {
            var aircraftCount : any = await fighterscontract.getAircraftCount(0);
            // console.log(aircraftCount.toNumber())
            expect(aircraftCount).to.equal(0)
            await expect(fightersmarketplace1.connect(signer1).buyF100SuperSabre(2, 1)).to.be.revertedWith("!nation ruler")
            var maxAircraftCount = await fightersmarketplace1.getMaxAircraftCount(0)
            // console.log(maxAircraftCount.toNumber())
            expect(maxAircraftCount).to.equal(50);
            await expect(fightersmarketplace1.connect(signer1).buyF100SuperSabre(2, 0)).to.be.revertedWith("!enough infrastructure")
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await expect(fightersmarketplace1.connect(signer1).buyF100SuperSabre(2, 0)).to.be.revertedWith("!enough tech")
            await technologymarketcontrat.connect(signer1).buyTech(0, 200)
            await fightersmarketplace1.connect(signer1).buyF100SuperSabre(2, 0)
            var aircraftCount : any = await fighterscontract.getAircraftCount(0);
            // console.log(aircraftCount.toNumber())
            expect(aircraftCount).to.equal(2)
            var count = await fighterscontract.getDefendingF100SuperSabreCount(0)
            // console.log(yak9Count.toNumber())
            expect(count).to.equal(2)
            await expect(fighterscontract.connect(signer1).scrapF100SuperSabre(2, 1)).to.be.revertedWith("!nation ruler")
            await expect(fighterscontract.connect(signer1).scrapF100SuperSabre(3, 0)).to.be.revertedWith("cannot delete that many")
            await fighterscontract.connect(signer1).scrapF100SuperSabre(2, 0)
            var count = await fighterscontract.getDefendingF100SuperSabreCount(0)
            // console.log(yak9Count.toNumber())
            expect(count).to.equal(0)
        })

        it("tests that owner can update F100SuperSabre specs", async function () {
            var specs : any = await fightersmarketplace1.getF100SuperSabreSpecs()
            var price = BigInt(specs[0])
            // console.log(price)
            // console.log(specs[1].toNumber())
            // console.log(specs[2].toNumber())
            expect(specs[0]).to.equal(BigInt("30000000000000000000000"))
            expect(specs[1]).to.equal(500)
            expect(specs[2]).to.equal(200)
            await fightersmarketplace1.connect(signer0).updateF100SuperSabreSpecs(1000, 1000, 1000)
            var specs : any = await fightersmarketplace1.getF100SuperSabreSpecs()
            // console.log(specs[0].toNumber())
            // console.log(specs[1].toNumber())
            // console.log(specs[2].toNumber())
            expect(specs[0]).to.equal(1000)
            expect(specs[1]).to.equal(1000)
            expect(specs[2]).to.equal(1000)
        })

        it("tests that F100SuperSabre cost updates correctly", async function () {
            var cost : any = await fightersmarketplace1.getF100SuperSabreCost(0)
            expect(cost).to.equal(BigInt("30000000000000000000000"))
            await resourcescontract.mockResourcesForTesting(0, 0, 2)
            var cost2 : any = await fightersmarketplace1.getF100SuperSabreCost(0)
            // console.log(BigInt(cost2), "aluminium")
            expect(cost2).to.equal(BigInt("27600000000000000000000"))
            await resourcescontract.mockResourcesForTesting(0, 11, 2)
            var cost3 : any = await fightersmarketplace1.getF100SuperSabreCost(0)
            // console.log(BigInt(cost3), "oil")
            expect(cost3).to.equal(BigInt("28800000000000000000000"))
            await resourcescontract.mockResourcesForTesting(0, 13, 2)
            var cost4 : any = await fightersmarketplace1.getF100SuperSabreCost(0)
            // console.log(BigInt(cost4), "rubber")
            expect(cost4).to.equal(BigInt("28800000000000000000000"))
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 1)
            var cost5 : any = await fightersmarketplace1.getF100SuperSabreCost(0)
            // console.log(BigInt(cost5), "2 airports")
            expect(cost5).to.equal(BigInt("27600000000000000000000"))
            await improvementscontract1.connect(signer1).deleteImprovement1(2, 0, 1)
            await wonderscontract4.connect(signer1).buyWonder4(0, 2)
            var cost6 : any = await fightersmarketplace1.getF100SuperSabreCost(0)
            // console.log(BigInt(cost6), "space program")
            expect(cost6).to.equal(BigInt("27300000000000000000000"))
        })


    }) 
})