//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
import { expect, assert } from "chai"
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
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { networkConfig } from "../helper-hardhat-config"

describe("Bills Contract", function () {

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

        await warbucks.connect(signer0).transfer(signer1.address, BigInt(2100000000000000000000000))
        await countryminter.connect(signer1).generateCountry(
            "TestRuler",
            "TestNationName",
            "TestCapitalCity",
            "TestNationSlogan"
        )
        await warbucks.connect(signer0).approve(warbucks.address, BigInt(25000000000*(10**18)));
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(25000000000*(10**18)));
        await treasurycontract.connect(signer1).addFunds(BigInt(20000000000*(10**18)), 0);

        await warbucks.connect(signer0).transfer(signer2.address, BigInt(2100000000000000000000000))
        await countryminter.connect(signer2).generateCountry(
            "TestRuler2",
            "TestNationName2",
            "TestCapitalCity2",
            "TestNationSlogan2"
        )
        await warbucks.connect(signer0).transfer(signer3.address, BigInt(2100000000000000000000000))
        await countryminter.connect(signer3).generateCountry(
            "TestRuler3",
            "TestNationName3",
            "TestCapitalCity3",
            "TestNationSlogan3"
        )
        await warbucks.connect(signer0).transfer(signer4.address, BigInt(2100000000000000000000000))
        await countryminter.connect(signer4).generateCountry(
            "TestRuler4",
            "TestNationName4",
            "TestCapitalCity4",
            "TestNationSlogan4"
        )
        await warbucks.connect(signer0).transfer(signer5.address, BigInt(2100000000000000000000000))
        await countryminter.connect(signer5).generateCountry(
            "TestRuler5",
            "TestNationName5",
            "TestCapitalCity5",
            "TestNationSlogan5"
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
            }
        }  
    });

    describe("Bills Contract Initialized", function () {
        it("bills1 tests that bills are initialized correctly", async function () {
            const initialBillsPayable1 : any = await billscontract.getBillsPayable(0);
            // console.log("bills payable", BigInt(initialBillsPayable1/(10**18)).toString());
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 200);
            const daysSince = await treasurycontract.getDaysSinceLastBillsPaid(0);
            // console.log("days since", daysSince.toNumber())
            const dailyIncome : any = await taxescontract.getDailyIncome(0);
            // console.log("daily income", BigInt(dailyIncome));
            const taxRate = await infrastructurecontract.getTaxRate(0);
            // console.log("tax rate", taxRate.toNumber());
            const happiness = await taxescontract.getHappiness(0);
            // console.log("happiness", happiness.toNumber());
            await keepercontract.incrementGameDay();
            const billsPayable : any = await billscontract.getBillsPayable(0);
            // console.log("bills payable", BigInt(billsPayable/(10**18)));
            expect(BigInt(billsPayable/(10**18)).toString()).to.equal("6420");
            const startingBalance : any = await treasurycontract.checkBalance(0);
            // console.log("starting balance", BigInt(startingBalance/(10**18)));
            expect(BigInt(startingBalance/(10**18)).toString()).to.equal("20001859400");
            const initialBillsPayable : any = await billscontract.getBillsPayable(0);
            // console.log("updated bills payable", BigInt(initialBillsPayable/(10**18)));
            expect(BigInt(initialBillsPayable/(10**18)).toString()).to.equal("6420");
            await billscontract.connect(signer1).payBills(0);
            const endingBalance : any = await treasurycontract.checkBalance(0);
            // console.log("ending balance", endingBalance/(10**18));
            expect((endingBalance/(10**18)).toString()).to.equal("20001852980");
            const updatedBillsPayable : any = await billscontract.getBillsPayable(0);
            // console.log("updated bills payable", BigInt(updatedBillsPayable/(10**18)));
            expect(BigInt(updatedBillsPayable/(10**18)).toString()).to.equal("0");
            const infrastructureBills : any = await billscontract.calculateDailyBillsFromInfrastructure(0);
            // console.log("daily inf bills", BigInt(infrastructureBills/(10**18)));
            expect(BigInt(infrastructureBills/(10**18)).toString()).to.equal("6380");
            const militaryBills : any = await billscontract.calculateDailyBillsFromMilitary(0);
            // console.log("military bills", BigInt(militaryBills/(10**18)));
            expect(BigInt(militaryBills/(10**18)).toString()).to.equal("40");
            const improvementBills : any = await billscontract.calculateDailyBillsFromImprovements(0);
            // console.log("improvement bills", BigInt(improvementBills/(10**18)));
            const wonderBills : any = await billscontract.calculateWonderBillsPayable(0);
            // console.log("wonder bills", BigInt(wonderBills/(10**18)));
        })
    })

    describe("Infrastructure Bills", function () {
        it("bills2 tests that cost per level works appropriately", async function () {
            const infrastructureAmountInitial = await infrastructurecontract.getInfrastructureCount(0);
            // console.log("initial infrastructire", infrastructureAmountInitial.toNumber());
            const costPerLevel20 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 20", BigInt(costPerLevel20/(10**18)));
            expect(BigInt(costPerLevel20/(10**18)).toString()).to.equal("18");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 80);
            const costPerLevel100 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 100", BigInt(costPerLevel100/(10**18)));
            expect(BigInt(costPerLevel100/(10**18)).toString()).to.equal("22");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 60);
            const costPerLevel160 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 160", BigInt(costPerLevel160/(10**18)));
            expect(BigInt(costPerLevel160/(10**18)).toString()).to.equal("25");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 40);
            const costPerLevel200 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 200", BigInt(costPerLevel200/(10**18)));
            expect(BigInt(costPerLevel200/(10**18)).toString()).to.equal("28");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 100);
            const costPerLevel300 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 300", BigInt(costPerLevel300/(10**18)));
            expect(BigInt(costPerLevel300/(10**18)).toString()).to.equal("36");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 200);
            const costPerLevel500 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 500", BigInt(costPerLevel500/(10**18)));
            expect(BigInt(costPerLevel500/(10**18)).toString()).to.equal("54");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 200);
            const costPerLevel700 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 700", BigInt(costPerLevel700/(10**18)));
            expect(BigInt(costPerLevel700/(10**18)).toString()).to.equal("74");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 300);
            const costPerLevel1000 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 1000", BigInt(costPerLevel1000/(10**18)));
            expect(BigInt(costPerLevel1000/(10**18)).toString()).to.equal("117");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            const costPerLevel2000 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 2000", BigInt(costPerLevel2000/(10**18)));
            expect(BigInt(costPerLevel2000/(10**18)).toString()).to.equal("252");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            const costPerLevel3000 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 3000", BigInt(costPerLevel3000/(10**18)));
            expect(BigInt(costPerLevel3000/(10**18)).toString()).to.equal("423");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            const costPerLevel4000 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 4000", BigInt(costPerLevel4000/(10**18)));
            expect(BigInt(costPerLevel4000/(10**18)).toString()).to.equal("630");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            const costPerLevel5000 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 5000", BigInt(costPerLevel5000/(10**18)));
            expect(BigInt(costPerLevel5000/(10**18)).toString()).to.equal("793");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 3000);
            const costPerLevel8000 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 8000", BigInt(costPerLevel8000/(10**18)));
            expect(BigInt(costPerLevel8000/(10**18)).toString()).to.equal("1278");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 7000);
            const costPerLevel15000 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 15000", BigInt(costPerLevel15000/(10**18)));
            expect(BigInt(costPerLevel15000/(10**18)).toString()).to.equal("2448");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
            const costPerLevel25000 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 25000", BigInt(costPerLevel25000/(10**18)));
            expect(BigInt(costPerLevel25000/(10**18)).toString()).to.equal("4068");
        })

        it("bills2 tests that cost per level gets reduced with resources and improvements", async function () {
            await billscontract.connect(signer1).payBills(0)
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            var costPerLevel1000 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 1000", BigInt(costPerLevel1000/(10**18)));
            expect(BigInt(costPerLevel1000/(10**18)).toString()).to.equal("118");
            await resourcescontract.mockResourcesForTesting(0, 7, 4);
            var costPerLevel1000 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost iron", BigInt(costPerLevel1000/(10**18)));
            expect(BigInt(costPerLevel1000/(10**18)).toString()).to.equal("118");
            await resourcescontract.mockResourcesForTesting(0, 9, 4);
            var costPerLevel1000 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost lumber", BigInt(costPerLevel1000/(10**18)));
            expect(BigInt(costPerLevel1000/(10**18)).toString()).to.equal("121");
            await resourcescontract.mockResourcesForTesting(0, 17, 4);
            var costPerLevel1000 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost uranium", BigInt(costPerLevel1000/(10**18)));
            expect(BigInt(costPerLevel1000/(10**18)).toString()).to.equal("128");
            await improvementscontract2.connect(signer1).buyImprovement2(5, 0, 8);
            var costPerLevel1000 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost 5 labor camps", BigInt(costPerLevel1000/(10**18)));
            expect(BigInt(costPerLevel1000/(10**18)).toString()).to.equal("62");
            await improvementscontract2.connect(signer1).deleteImprovement2(5, 0, 8);
            await wonderscontract2.connect(signer1).buyWonder2(0, 7);
            var costPerLevel1000 : any = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost intersate system", BigInt(costPerLevel1000/(10**18)));
            expect(BigInt(costPerLevel1000/(10**18)).toString()).to.equal("117");
        })
    })
    
    describe("Military Bills", function () {
        it("bills3 tests that an accomodative government will reduce military bills by 5%", async function () {
            await billscontract.connect(signer1).payBills(0)
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            await forcescontract.connect(signer1).buySoldiers(1980, 0)
            var soldierCount = await forcescontract.getSoldierCount(0);
            // console.log("soldier count", soldierCount.toNumber());
            const soldierUpkeep1 : any = await billscontract.getSoldierUpkeep(0);
            // console.log("soldier upkeep", BigInt(soldierUpkeep1));
            expect(soldierUpkeep1/(10**18)).to.equal(4000);
            const dailyBillsFromMilitary : any = await billscontract.calculateDailyBillsFromMilitary(0);
            // console.log("daily military bills", BigInt(dailyBillsFromMilitary/(10**18)));
            expect(dailyBillsFromMilitary/(10**18)).to.equal(4000);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            //accomodative governments for military bill reduction by 5% are gov's 2, 4 & 9
            await countryparameterscontract.connect(signer1).setGovernment(0, 2);
            const govType = await countryparameterscontract.getGovernmentType(0);
            // console.log("government type", govType.toNumber());
            const soldierUpkeep2 : any = await billscontract.getSoldierUpkeep(0);
            //soldier upkeep alone will not be modified by government type
            // console.log("soldier upkeep accomodative", BigInt(soldierUpkeep2));
            const dailyBillsFromMilitary2 : any = await billscontract.calculateDailyBillsFromMilitary(0);
            // console.log("daily military bills accomodative", BigInt(dailyBillsFromMilitary2/(10**18)));
            expect(dailyBillsFromMilitary2/(10**18)).to.equal(3800);
        })

        it("bills3 tests soldiers increase bills correctly", async function () {
            await billscontract.connect(signer1).payBills(0)
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            await forcescontract.connect(signer1).buySoldiers(1980, 0)
            var soldierCount = await forcescontract.getSoldierCount(0);
            // console.log("soldier count", soldierCount.toNumber());
            const soldierUpkeep1 : any = await billscontract.getSoldierUpkeep(0);
            // console.log("soldier upkeep", BigInt(soldierUpkeep1));
            expect(soldierUpkeep1/(10**18)).to.equal(4000);
            await resourcescontract.mockResourcesForTesting(0, 8, 4);
            const soldierUpkeep2 : any = await billscontract.getSoldierUpkeep(0);
            // console.log("soldier after lead", BigInt(soldierUpkeep2));
            expect(soldierUpkeep2/(10**18)).to.equal(3400);
            await resourcescontract.mockResourcesForTesting(0, 8, 12);
            const soldierUpkeep3 : any = await billscontract.getSoldierUpkeep(0);
            // console.log("soldier after lead and pigs", BigInt(soldierUpkeep3));
            expect(soldierUpkeep3/(10**18)).to.equal(3000);
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 3);
            const soldierUpkeep4 : any = await billscontract.getSoldierUpkeep(0);
            // console.log("soldier after barracks", BigInt(soldierUpkeep4));
            expect(soldierUpkeep4/(10**18)).to.equal(2040);
            await improvementscontract2.connect(signer1).buyImprovement2(5, 0, 3);
            const soldierUpkeep5 : any = await billscontract.getSoldierUpkeep(0);
            // console.log("soldier after guerilla camp", BigInt(soldierUpkeep5));
            expect(soldierUpkeep5/(10**18)).to.equal(1040);
        })

        it("bills3 tests tanks increase bills correctly", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 20);
            await forcescontract.connect(signer1).buySoldiers(1980, 0);
            var soldierCount = await forcescontract.getSoldierCount(0);
            // console.log("soldier count", soldierCount.toNumber());
            var citizenCount = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log("population", citizenCount.toNumber());
            var maxTanks = await forcescontract.getMaxTankCount(0);
            // console.log("max tanks", await maxTanks.toNumber());
            await forcescontract.connect(signer1).buyTanks(200, 0);
            var tankUpkeep : any = await billscontract.getTankUpkeep(0);
            // console.log("tank upkeep", BigInt(tankUpkeep.toString()));
            expect(tankUpkeep/(10**18)).to.equal(7200);
            await resourcescontract.mockResourcesForTesting(0, 7, 4);
            var tankUpkeep : any = await billscontract.getTankUpkeep(0);
            // console.log("tank upkeep with iron", BigInt(tankUpkeep.toString()));
            expect(tankUpkeep/(10**18)).to.equal(7200);
            await resourcescontract.mockResourcesForTesting(0, 7, 11);
            var tankUpkeep : any = await billscontract.getTankUpkeep(0);
            // console.log("tank upkeep with iron and oil", BigInt(tankUpkeep.toString()));
            expect(tankUpkeep/(10**18)).to.equal(6400);
            await resourcescontract.mockResourcesForTesting(0, 4, 8);
            var tankUpkeep : any = await billscontract.getTankUpkeep(0);
            // console.log("tank upkeep with lead and iron", BigInt(tankUpkeep.toString()));
            expect(tankUpkeep/(10**18)).to.equal(7360);
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await wonderscontract4.connect(signer1).buyWonder4(0, 5);
            var tankUpkeep : any = await billscontract.getTankUpkeep(0);
            // console.log("tank upkeep with logistical support", BigInt(tankUpkeep.toString()));
            expect(tankUpkeep/(10**18)).to.equal(5760);
        })

        it("bills3 tests nuke upkeep", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 30000);
            await resourcescontract.mockResourcesForTesting(0, 17, 11);
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            // console.log("3 nukes purchased");
            var nukeUpkeep : any = await billscontract.getNukeUpkeep(0);
            // console.log("nuke upkeep", BigInt(nukeUpkeep));
            expect(nukeUpkeep/(10**18)).to.equal(15000);
            await resourcescontract.mockResourcesForTesting(0, 15, 11);
            var nukeUpkeep : any = await billscontract.getNukeUpkeep(0);
            // console.log("nuke upkeep no uranium", BigInt(nukeUpkeep));
            expect(nukeUpkeep/(10**18)).to.equal(30000);
            await resourcescontract.mockResourcesForTesting(0, 8, 11);
            var nukeUpkeep : any = await billscontract.getNukeUpkeep(0);
            // console.log("nuke upkeep with lead", BigInt(nukeUpkeep));
            expect(nukeUpkeep/(10**18)).to.equal(24000);
        })

        it("bills3 tests cruise missile upkeep", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 30000);
            await missilescontract.connect(signer1).buyCruiseMissiles(5, 0);
            var cruiseMissileUpkeep : any = await billscontract.getCruiseMissileUpkeep(0);
            // console.log("cruise missile upkeep", BigInt(cruiseMissileUpkeep));
            expect(cruiseMissileUpkeep/(10**18)).to.equal(2500);
            await resourcescontract.mockResourcesForTesting(0, 8, 11);
            var cruiseMissileUpkeep : any = await billscontract.getCruiseMissileUpkeep(0);
            // console.log("cruise missile upkeep after lead", BigInt(cruiseMissileUpkeep));
            expect(cruiseMissileUpkeep/(10**18)).to.equal(2000);
        })

        it("bills3 tests aircraft upkeep", async function () {
            await billscontract.connect(signer1).payBills(0)
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 30000);
            await fightersmarketplace2.connect(signer1).buyF22Raptor(5, 0);
            var aircraftCount = await fighterscontract.getAircraftCount(0);
            // console.log(aircraftCount.toNumber());
            var aircraftUpkeep : any = await billscontract.getAircraftUpkeep(0);
            // console.log(BigInt(aircraftUpkeep), "aircraft upkeep");
            expect(aircraftUpkeep/(10**18)).to.equal(1000);
            await resourcescontract.mockResourcesForTesting(0, 8, 11);
            var aircraftUpkeep : any = await billscontract.getAircraftUpkeep(0);
            // console.log(BigInt(aircraftUpkeep), "aircraft upkeep after lead");
            expect(aircraftUpkeep/(10**18)).to.equal(750);
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 1);
            var aircraftUpkeep : any = await billscontract.getAircraftUpkeep(0);
            // console.log(BigInt(aircraftUpkeep), "upkeep after airport");
            expect(aircraftUpkeep/(10**18)).to.equal(690);
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await wonderscontract4.connect(signer1).buyWonder4(0, 5);
            var aircraftUpkeep : any = await billscontract.getAircraftUpkeep(0);
            // console.log(BigInt(aircraftUpkeep), "upkeep after logistical support");
            expect(aircraftUpkeep/(10**18)).to.equal(590);
        })

        it("bills3 tests navy upkeep", async function () {
            await billscontract.connect(signer1).payBills(0)
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 20000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 30000);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 10);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 7);
            await improvementscontract4.connect(signer1).buyImprovement4(3, 0, 4);
            await wonderscontract1.connect(signer1).buyWonder1(0, 11);
            await navycontract.connect(signer1).buyCorvette(1, 0);
            var upkeep : any = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            await navycontract.connect(signer1).buyLandingShip(1, 0);
            var upkeep : any = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            await navycontract.connect(signer1).buyBattleship(1, 0);
            var upkeep : any = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            await keepercontract.incrementGameDay();
            await navycontract.connect(signer1).buyCruiser(1, 0);
            var upkeep : any = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            await navycontract2.connect(signer1).buyFrigate(1, 0);
            var upkeep : any = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            await keepercontract.incrementGameDay();
            await navycontract2.connect(signer1).buyDestroyer(1, 0);
            var upkeep : any = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            await navycontract2.connect(signer1).buySubmarine(1, 0);
            var upkeep : any = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            await keepercontract.incrementGameDay();
            await navycontract2.connect(signer1).buyAircraftCarrier(1, 0);
            var upkeep : any = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            expect(upkeep/(10**18)).to.equal(140000);
            await resourcescontract.mockResourcesForTesting(0, 17, 5);
            var upkeep : any = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            expect(upkeep/(10**18)).to.equal(137250);
            await resourcescontract.mockResourcesForTesting(0, 8, 11);
            var upkeep : any = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            expect(upkeep/(10**18)).to.equal(98000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await wonderscontract4.connect(signer1).buyWonder4(0, 5);
            var upkeep : any = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            expect(upkeep/(10**18)).to.equal(83999.99999999999);
        })
    })

    describe("Wonders and Improvements Bills", function () {
        it("bills4 tests improvements increment bills correctly", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 5000);
            await billscontract.connect(signer1).payBills(0)
            var upkeep : any = await billscontract.calculateDailyBillsFromImprovements(0);
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 1);
            var upkeep : any = await billscontract.calculateDailyBillsFromImprovements(0);
            console.log(BigInt(upkeep/(10**18)))
            await improvementscontract1.connect(signer1).buyImprovement1(5, 0, 2);
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 3);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 7);
            var improvementCount = await improvementscontract1.getImprovementCount(0);
            console.log(improvementCount.toNumber());
            var upkeep : any = await billscontract.calculateDailyBillsFromImprovements(0);
            console.log(BigInt(upkeep/(10**18)))
            // expect(BigInt(upkeep/(10**18)).toString()).to.equal("17100");
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 12000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 6);
            var upkeep : any = await billscontract.calculateDailyBillsFromImprovements(0);
            // console.log("this", BigInt(upkeep/(10**18)))
            expect(BigInt(upkeep/(10**18)).toString()).to.equal("16245");
            // checks that an accomodative government (1, 5, 8, 10) will reduce the cost of improvements by 5%
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await countryparameterscontract.connect(signer1).setGovernment(0, 1);
            var upkeep : any = await billscontract.calculateDailyBillsFromImprovements(0);
            // console.log("upkeep with accomodative government", BigInt(upkeep/(10**18)))
            // expect(BigInt(upkeep/(10**18)).toString()).to.equal("15390");
        })

        it("bills4 tests that improvement cost per level increases correctly", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 15000);            
            const impCount0 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount0.toNumber());
            const impCostPerLevel0 : any = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel0/(10**18)));
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 1);
            const impCount1 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount1.toNumber());
            const impCostPerLevel1 : any = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel1/(10**18)));
            // <5 improvements
            expect(BigInt(impCostPerLevel1/(10**18)).toString()).to.equal("500");
            await improvementscontract1.connect(signer1).buyImprovement1(4, 0, 2);
            const impCount2 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount2.toNumber());
            const impCostPerLevel2 : any = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel2/(10**18)));
            //  <8 improvements
            expect(BigInt(impCostPerLevel2/(10**18)).toString()).to.equal("600");
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 3);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            const impCount3 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount3.toNumber());
            const impCostPerLevel3 : any = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel3/(10**18)));
            // <15 improvements
            expect(BigInt(impCostPerLevel3/(10**18)).toString()).to.equal("750"); 
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 4);
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 6);
            const impCount4 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount4.toNumber());
            const impCostPerLevel4 : any = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel4/(10**18)));
            // <20 improvements
            expect(BigInt(impCostPerLevel4/(10**18)).toString()).to.equal("950");
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 7);
            await improvementscontract1.connect(signer1).buyImprovement1(5, 0, 8);
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 9);
            const impCount5 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount5.toNumber());
            const impCostPerLevel5 : any = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel5/(10**18)));
            // <30 improvements
            expect(BigInt(impCostPerLevel5/(10**18)).toString()).to.equal("1200");
            await improvementscontract1.connect(signer1).buyImprovement1(5, 0, 11);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 1);
            await improvementscontract2.connect(signer1).buyImprovement2(4, 0, 3);
            const impCount6 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount6.toNumber());
            const impCostPerLevel6 : any = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel6/(10**18)));
            // <40 improvements
            expect(BigInt(impCostPerLevel6/(10**18)).toString()).to.equal("1500");
            await improvementscontract2.connect(signer1).buyImprovement2(5, 0, 6);
            await improvementscontract2.connect(signer1).buyImprovement2(5, 0, 7);
            const impCount7 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount7.toNumber());
            const impCostPerLevel7 : any = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel7/(10**18)));
            // <50 improvements
            expect(BigInt(impCostPerLevel7/(10**18)).toString()).to.equal("2000");
            await improvementscontract2.connect(signer1).buyImprovement2(5, 0, 8);
            const impCount8 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount8.toNumber());
            const impCostPerLevel8 : any = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel8/(10**18)));
            // >= 50 improvements
            expect(BigInt(impCostPerLevel8/(10**18)).toString()).to.equal("3000");
        })

        it("bills4 tests wonder increment bills correctly", async function () {
            var upkeep : any = await billscontract.calculateWonderBillsPayable(0);
            // console.log(BigInt(upkeep/(10**18)))
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 12000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 6);
            var upkeep : any = await (billscontract.calculateWonderBillsPayable(0));
            var newUpkeep = (upkeep/(10**18))
            // console.log(newUpkeep, "this");
            expect(newUpkeep).to.equal(4750.000000000001);           
        })
    })
})


