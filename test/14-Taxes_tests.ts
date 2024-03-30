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

describe("Taxes Contract", function () {

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

    describe("Taxes Contract Initialized", function () {
        it("taxes1 calculates initial happiness", async function () {
            const initialHappiness = await taxescontract.getHappiness(0);
            // console.log(initialHappiness.toNumber(), "initial happiness");
            expect(initialHappiness.toNumber()).to.equal(5);
            const happinessPointsToAdd = await taxescontract.getHappinessPointsToAdd(0);
            // console.log(happinessPointsToAdd.toNumber(), "happiness points to add");
            expect(happinessPointsToAdd.toNumber()).to.equal(11);
            const happinessPointsToSubtract = await taxescontract.getHappinessPointsToSubtract(0);
            // console.log(happinessPointsToSubtract.toNumber(), "happiness points to subtract");
            expect(happinessPointsToSubtract.toNumber()).to.equal(6);
            const compatabilityPoints = await taxescontract.checkCompatability(0);
            // console.log(compatabilityPoints.toNumber(), "compatability points");
            expect(compatabilityPoints.toNumber()).to.equal(2);
            const densityPoints = await taxescontract.getDensityPoints(0);
            // console.log(densityPoints.toNumber(), "density points");
            expect(densityPoints.toNumber()).to.equal(5);
            const pointsFromResources = await taxescontract.getPointsFromResources(0);
            // console.log(pointsFromResources.toNumber(), "points from resources");
            expect(pointsFromResources.toNumber()).to.equal(0);
            const pointsFromImprovements = await taxescontract.getPointsFromImprovements(0);
            // console.log(pointsFromImprovements.toNumber(), "points from improvements");
            expect(pointsFromImprovements.toNumber()).to.equal(0);
            const pointsFromWonders = await taxescontract.getHappinessFromWonders(0);
            // console.log(pointsFromWonders.toNumber(), "points from wonders");
            expect(pointsFromWonders.toNumber()).to.equal(0);
            const pointsFromCasualties = await taxescontract.getCasualtyPoints(0);
            // console.log(pointsFromCasualties.toNumber(), "points from casualties");
            expect(pointsFromCasualties.toNumber()).to.equal(0);
            const pointsFromTechnology = await taxescontract.getTechnologyPoints(0);
            // console.log(pointsFromTechnology.toNumber(), "points from technology");
            expect(pointsFromTechnology.toNumber()).to.equal(0);
            const pointsFromNationAge = await taxescontract.getPointsFromNationAge(0);
            // console.log(pointsFromNationAge.toNumber(), "points from nation age");
            expect(pointsFromNationAge.toNumber()).to.equal(0);
            const pointsFromTrades = await additionaltaxescontract.getPointsFromTrades(0);
            // console.log(pointsFromTrades.toNumber(), "points from trades");
            expect(pointsFromTrades.toNumber()).to.equal(0);
            const pointsFromDefcon = await additionaltaxescontract.getPointsFromDefcon(0);
            // console.log(pointsFromDefcon.toNumber(), "points from defcon");
            expect(pointsFromDefcon.toNumber()).to.equal(4);
            const pointsFromGovt = await additionaltaxescontract.getPointsFromGovernment(0);
            // console.log(pointsFromGovt.toNumber(), "points from govt");
            expect(pointsFromGovt.toNumber()).to.equal(0);
            const taxRatePoints = await taxescontract.getTaxRatePoints(0);
            // console.log(taxRatePoints.toNumber(), "tax rate points");
            expect(taxRatePoints.toNumber()).to.equal(0);
            const pointsFromMilitary = await additionaltaxescontract.getPointsFromMilitary(0);
            // console.log(pointsFromMilitary.toNumber(), "points from military");
            expect(pointsFromMilitary.toNumber()).to.equal(5);
            const pointsFromCriminals = await taxescontract.getPointsFromCriminals(0);
            // console.log(pointsFromCriminals.toNumber(), "points from criminals");
            expect(pointsFromCriminals.toNumber()).to.equal(0);
            const pointsToSubtractFromImprovements = await additionaltaxescontract.getPointsToSubtractFromImprovements(0)
            // console.log(pointsToSubtractFromImprovements.toNumber(), "points to subtract from improvements");
            expect(pointsToSubtractFromImprovements.toNumber()).to.equal(0);
            const pointsFromIntelAgencies = await additionaltaxescontract.getPointsFromIntelAgencies(0);
            // console.log(pointsFromIntelAgencies.toNumber(), "points from intel agencies");
            expect(pointsFromIntelAgencies.toNumber()).to.equal(0);
            const pointsFromEnvironment = await environmentcontract.getEnvironmentScore(0);
            // console.log(pointsFromEnvironment.toNumber(), "points from environment");
            expect(pointsFromEnvironment.toNumber()).to.equal(1);
        })

        // it("taxes1 calculates happiness at 100 infrastructure", async function () {
        //     await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 100);
        //     // await forcescontract.connect(signer1).buySoldiers(200, 0)
        //     const initialHappiness = await taxescontract.getHappiness(0);
        //     console.log(initialHappiness.toNumber(), "initial happiness");
        //     // expect(initialHappiness.toNumber()).to.equal(5);
        //     const happinessPointsToAdd = await taxescontract.getHappinessPointsToAdd(0);
        //     console.log(happinessPointsToAdd.toNumber(), "happiness points to add");
        //     // expect(happinessPointsToAdd.toNumber()).to.equal(11);
        //     const happinessPointsToSubtract = await taxescontract.getHappinessPointsToSubtract(0);
        //     console.log(happinessPointsToSubtract.toNumber(), "happiness points to subtract");
        //     // expect(happinessPointsToSubtract.toNumber()).to.equal(6);
        //     const compatabilityPoints = await taxescontract.checkCompatability(0);
        //     console.log(compatabilityPoints.toNumber(), "compatability points");
        //     // expect(compatabilityPoints.toNumber()).to.equal(2);
        //     const densityPoints = await taxescontract.getDensityPoints(0);
        //     console.log(densityPoints.toNumber(), "density points");
        //     // expect(densityPoints.toNumber()).to.equal(5);
        //     const pointsFromResources = await taxescontract.getPointsFromResources(0);
        //     console.log(pointsFromResources.toNumber(), "points from resources");
        //     // expect(pointsFromResources.toNumber()).to.equal(0);
        //     const pointsFromImprovements = await taxescontract.getPointsFromImprovements(0);
        //     console.log(pointsFromImprovements.toNumber(), "points from improvements");
        //     // expect(pointsFromImprovements.toNumber()).to.equal(0);
        //     const pointsFromWonders = await taxescontract.getHappinessFromWonders(0);
        //     console.log(pointsFromWonders.toNumber(), "points from wonders");
        //     // expect(pointsFromWonders.toNumber()).to.equal(0);
        //     const pointsFromCasualties = await taxescontract.getCasualtyPoints(0);
        //     console.log(pointsFromCasualties.toNumber(), "points from casualties");
        //     // expect(pointsFromCasualties.toNumber()).to.equal(0);
        //     const pointsFromTechnology = await taxescontract.getTechnologyPoints(0);
        //     console.log(pointsFromTechnology.toNumber(), "points from technology");
        //     // expect(pointsFromTechnology.toNumber()).to.equal(0);
        //     const pointsFromNationAge = await taxescontract.getPointsFromNationAge(0);
        //     console.log(pointsFromNationAge.toNumber(), "points from nation age");
        //     // expect(pointsFromNationAge.toNumber()).to.equal(0);
        //     const pointsFromTrades = await additionaltaxescontract.getPointsFromTrades(0);
        //     console.log(pointsFromTrades.toNumber(), "points from trades");
        //     // expect(pointsFromTrades.toNumber()).to.equal(0);
        //     const pointsFromDefcon = await additionaltaxescontract.getPointsFromDefcon(0);
        //     console.log(pointsFromDefcon.toNumber(), "points from defcon");
        //     // expect(pointsFromDefcon.toNumber()).to.equal(4);
        //     const pointsFromGovt = await additionaltaxescontract.getPointsFromGovernment(0);
        //     console.log(pointsFromGovt.toNumber(), "points from govt");
        //     // expect(pointsFromGovt.toNumber()).to.equal(0);
        //     const taxRatePoints = await taxescontract.getTaxRatePoints(0);
        //     console.log(taxRatePoints.toNumber(), "tax rate points");
        //     // expect(taxRatePoints.toNumber()).to.equal(0);
        //     const pointsFromMilitary = await taxescontract.getPointsFromMilitary(0);
        //     console.log(pointsFromMilitary.toNumber(), "points from military");
        //     // expect(pointsFromMilitary.toNumber()).to.equal(5);
        //     const pointsFromCriminals = await taxescontract.getPointsFromCriminals(0);
        //     console.log(pointsFromCriminals.toNumber(), "points from criminals");
        //     // expect(pointsFromCriminals.toNumber()).to.equal(0);
        //     const pointsToSubtractFromImprovements = await additionaltaxescontract.getPointsToSubtractFromImprovements(0)
        //     console.log(pointsToSubtractFromImprovements.toNumber(), "points to subtract from improvements");
        //     // expect(pointsToSubtractFromImprovements.toNumber()).to.equal(0);
        //     const pointsFromIntelAgencies = await taxescontract.getPointsFromIntelAgencies(0);
        //     console.log(pointsFromIntelAgencies.toNumber(), "points from intel agencies");
        //     // expect(pointsFromIntelAgencies.toNumber()).to.equal(0);
        //     const pointsFromEnvironment = await environmentcontract.getEnvironmentScore(0);
        //     console.log(pointsFromEnvironment.toNumber(), "points from environment");
        //     // expect(pointsFromEnvironment.toNumber()).to.equal(1);
        // })

        it("taxes1 tests that taxes are initialized correctly", async function () {
            const initialPopulation = await infrastructurecontract.getTotalPopulationCount(0);
            const initialCriminals = await crimecontract.getCriminalCount(0);
            const initialTaxablePopulation = await infrastructurecontract.getTaxablePopulationCount(0);
            expect(initialTaxablePopulation[0].toNumber()).to.equal(145);
            // console.log(
            //     "initialPop", initialPopulation.toNumber(),
            //     "initialCriminals", initialCriminals.toString(),
            //     "initialTaxablePop", initialTaxablePopulation.toString()
            // )
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 200);
            const updatedPopulation = await infrastructurecontract.getTotalPopulationCount(0);
            const updatedCriminals = await crimecontract.getCriminalCount(0);
            const updatedTaxablePopulation = await infrastructurecontract.getTaxablePopulationCount(0);
            expect(updatedTaxablePopulation[0].toNumber()).to.equal(1792);
            // console.log(
            //     "updatedPop", updatedPopulation.toNumber(),
            //     "updatedCriminals", updatedCriminals.toString(),
            //     "updatedTaxablePop", updatedTaxablePopulation.toString()
            // )
            await keepercontract.incrementGameDay();
            const daysSince = await treasurycontract.getDaysSinceLastTaxCollection(0);
            // console.log("days since", daysSince.toNumber())
            const dailyIncome : any = await taxescontract.getDailyIncome(0);
            // console.log("daily income", BigInt(dailyIncome));
            const taxRate = await infrastructurecontract.getTaxRate(0);
            // console.log("tax rate", taxRate.toNumber());
            const happiness = await taxescontract.getHappiness(0);
            // console.log("happiness", happiness.toNumber());
            const taxesCollectible : any = await taxescontract.getTaxesCollectible(0);
            // console.log("taxes collectible", BigInt(taxesCollectible[1]/(10**18)));
            // expect(BigInt(taxesCollectible[1]/(10**18)).toString()).to.equal("8525");
            const startingBalance : any = await treasurycontract.checkBalance(0);
            // console.log("starting balance", BigInt(startingBalance/(10**18)));
            expect(BigInt(startingBalance/(10**18)).toString()).to.equal("20001859400");
            await militarycontract.connect(signer1).toggleWarPeacePreference(0)
            await taxescontract.connect(signer1).collectTaxes(0);
            const endingBalance : any = await treasurycontract.checkBalance(0);
            // console.log("ending balance", BigInt(endingBalance/(10**18)));
            expect(BigInt(endingBalance/(10**18)).toString()).to.equal("20001868360");
            const updatedTaxesCollectible : any = await taxescontract.getTaxesCollectible(0);
            // console.log("updated taxes collectible", BigInt(updatedTaxesCollectible[1]/(10**18)));
            expect(updatedTaxesCollectible[1]).to.equal(0);
        })

        it("taxes1 tests that taxes are collectible", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
            await militarycontract.connect(signer1).toggleWarPeacePreference(0);
            await keepercontract.incrementGameDay();
            const startingBalance : any = await treasurycontract.checkBalance(0);
            // console.log("starting balance", BigInt(startingBalance/(10**18)));
            expect(BigInt(startingBalance/(10**18)).toString()).to.equal("19994970000");
            const taxesCollectible : any = await taxescontract.getTaxesCollectible(0);
            // console.log("taxes collectible", BigInt(taxesCollectible[1]/(10**18)));
            expect(BigInt(taxesCollectible[1]/(10**18)).toString()).to.equal("391285");
            await taxescontract.connect(signer1).collectTaxes(0);
            const endingBalance : any = await treasurycontract.checkBalance(0);
            // console.log("ending balance", BigInt(endingBalance));
            expect(BigInt(endingBalance).toString()).to.equal("19995361284999999166239473664");
            const updatedTaxesCollectible : any = await taxescontract.getTaxesCollectible(0);
            // console.log("updated taxes collectible", BigInt(updatedTaxesCollectible[1]/(10**18)));
            expect(updatedTaxesCollectible[1]).to.equal("0");
        })
    })

    describe("Taxes Contract / Happiness Tests", function () {
        it("taxes1 happiness initialized correctly", async function () {
            const initialHappiness = await taxescontract.getHappiness(0);
            // console.log(initialHappiness.toNumber());
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 200);
            const happinessAt200 = await taxescontract.getHappiness(0);
            // console.log(happinessAt200.toNumber());
            expect(initialHappiness.toNumber()).to.equal(5);
            expect(happinessAt200.toNumber()).to.equal(0);
        })

        it("taxes1 happiness tests minimum happiness", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 200000);
            // const happinessAt200000 = await taxescontract.getHappiness(0);
            // console.log(happinessAt200000.toNumber());
            await infrastructurecontract.connect(signer1).setTaxRate(0, 28);
            // const happinessAfterTax = await taxescontract.getHappiness(0)
            // console.log(happinessAfterTax.toNumber());
            // const ratio : any = await taxescontract.soldierToPopulationRatio(0);
            // console.log(BigInt(ratio[0]));
            // const pointsFromMilitary = await taxescontract.getPointsFromMilitary(0);
            // console.log(pointsFromMilitary.toNumber());
            // const criminalCount = await crimecontract.getCriminalCount(0);
            // console.log(criminalCount.toNumber());
            // const pointsFromCrime = await taxescontract.getPointsFromCriminals(0);
            // console.log(pointsFromCrime.toNumber());
            await billscontract.connect(signer1).payBills(0)
            await improvementscontract2.connect(signer1).buyImprovement2(5, 0, 8);
            // const happinessAfterImprovement = await taxescontract.getHappiness(0)
            // console.log(happinessAfterImprovement.toNumber());
            // const pointsToAdd = await taxescontract.getHappinessPointsToAdd(0);
            // const pointsToSubtract = await taxescontract.getHappinessPointsToSubtract(0);
            // console.log("add", pointsToAdd.toNumber(), "subtract", pointsToSubtract.toNumber());
            await improvementscontract2.connect(signer1).buyImprovement2(5, 0, 6);
            const minimumHappiness = await taxescontract.getHappiness(0)
            // console.log(minimumHappiness.toNumber());
            expect(minimumHappiness.toNumber()).to.equal(0);
        })
        
        it("taxes1 happiness tests additions to happiness", async function () {
            await billscontract.connect(signer1).payBills(0)
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 50000);
            await resourcescontract.mockResourcesForTesting(0, 5, 11);
            await resourcescontract.mockResourcesForTesting(1, 14, 15);
            await resourcescontract.connect(signer2).proposeTrade(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 1);
            await resourcescontract.mockResourcesForTesting(2, 16, 18);
            await resourcescontract.connect(signer3).proposeTrade(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 2);
            await resourcescontract.mockResourcesForTesting(3, 20, 17);
            await resourcescontract.connect(signer4).proposeTrade(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 3);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            await resourcescontract.mockResourcesForTesting(4, 17, 18);
            await resourcescontract.connect(signer5).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            const pointsFromTeamTrades = await additionaltaxescontract.getPointsFromTrades(0);
            // console.log(pointsFromTeamTrades.toNumber());
            const pointsFromDefcon = await additionaltaxescontract.getPointsFromDefcon(0);
            // console.log(pointsFromDefcon.toNumber());
            const happiness1 = await taxescontract.getHappiness(0)
            // console.log("happiness 1", happiness1.toNumber());
            await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
            const happiness2 = await taxescontract.getHappiness(0)
            // console.log("happiness 2 (with tech)", happiness2.toNumber());
            await wonderscontract3.connect(signer1).buyWonder3(0, 6);
            const nukeHappiness = await additionaltaxescontract.getNuclearAndUraniumBonus(0);
            // console.log(nukeHappiness.toNumber(), "happiness from nuke / uranium");
            const happiness3 = await taxescontract.getHappiness(0)
            // console.log("happiness 3", happiness3.toNumber());
            const compatabilityPoints = await taxescontract.checkCompatability(0);
            // console.log(compatabilityPoints.toNumber());
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await countryparameterscontract.connect(signer1).setReligion(0, 2);
            await countryparameterscontract.connect(signer1).setGovernment(0, 2);
            const compatabilityPoints2 = await taxescontract.checkCompatability(0);
            // console.log(compatabilityPoints2.toNumber());
            await wonderscontract2.connect(signer1).buyWonder2(0, 1);
            await wonderscontract2.connect(signer1).buyWonder2(0, 2);
            const compatabilityPoints3 = await taxescontract.checkCompatability(0);
            // console.log(compatabilityPoints3.toNumber());
            const happiness4 = await taxescontract.getHappiness(0)
            // console.log("happiness 4", happiness4.toNumber());
            await landmarketcontract.connect(signer1).buyLand(0, 10000);
            const densityPoints = await taxescontract.getDensityPoints(0);
            // console.log("density points", densityPoints.toNumber());
            const density = await taxescontract.checkPopulationDensity(0);
            // console.log("density", density.toNumber());
            const happiness5 = await taxescontract.getHappiness(0)
            // console.log("happiness 5", happiness5.toNumber());
            const technologyPoints = await taxescontract.getTechnologyPoints(0);
            // console.log("technology points", technologyPoints.toNumber());
            const happiness6 = await taxescontract.getHappiness(0);
            // console.log("happiness 6", happiness6.toNumber());
            expect(happiness6.toNumber()).to.equal(29);                        
        })
    
        it("taxes1 happiness tests other additions to hapiness from wonders", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 15000);
            const happiness = await taxescontract.getHappiness(0)
            // console.log("happiness", happiness.toNumber());
            await wonderscontract2.connect(signer1).buyWonder2(0, 1);
            await wonderscontract2.connect(signer1).buyWonder2(0, 2);
            const happiness2 = await taxescontract.getHappiness(0)
            // console.log("happiness 2", happiness2.toNumber());
            await technologymarketcontrat.connect(signer1).buyTech(0, 5500);
            await wonderscontract2.connect(signer1).buyWonder2(0, 3);
            const happiness3 = await taxescontract.getHappiness(0)
            // console.log("happiness 3", happiness3.toNumber());
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await wonderscontract3.connect(signer1).buyWonder3(0, 9);
            const happiness4 = await taxescontract.getHappiness(0)
            // console.log("happiness 4", happiness4.toNumber());
            //internet
            await wonderscontract2.connect(signer1).buyWonder2(0, 6);
            const happiness5 = await taxescontract.getHappiness(0)
            // console.log("happiness 5", happiness5.toNumber());
            //movie 
            await wonderscontract3.connect(signer1).buyWonder3(0, 1);
            const happiness6 = await taxescontract.getHappiness(0)
            // console.log("happiness 6", happiness6.toNumber());
            //warMemorial
            await forcescontract.increaseSoldierCasualties(0, 1000000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 5);
            const happiness7 = await taxescontract.getHappiness(0)
            // console.log("happiness 7", happiness7.toNumber());
            //space
            await wonderscontract4.connect(signer1).buyWonder4(0, 2);
            const happiness8 = await taxescontract.getHappiness(0)
            // console.log("happiness 8", happiness8.toNumber());
            //universal healthcare
            await billscontract.connect(signer1).payBills(0)
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 9);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 5);
            await wonderscontract4.connect(signer1).buyWonder4(0, 6);
            const happiness9 = await taxescontract.getHappiness(0)
            // console.log("happiness 9", happiness9.toNumber());
            expect(happiness9.toNumber()).to.equal(27);
            const income = await taxescontract.getDailyIncome(0);
            // console.log("income", income.toNumber());
            expect(income.toNumber()).to.equal(89);                  
        })
        
        it("taxes1 happiness tests other additions to happiness from improvements", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 15000);
            await forcescontract.connect(signer1).buySoldiers(35000, 0)
            await improvementscontract3.connect(signer1).buyImprovement3(3, 0, 1);
            const happiness1 = await taxescontract.getHappiness(0)
            // console.log("happiness 1", happiness1.toNumber());
            expect(happiness1.toNumber()).to.equal(4);
            //border wall
            await billscontract.connect(signer1).payBills(0)
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            const happiness2 = await taxescontract.getHappiness(0)
            // console.log("happiness 2", happiness2.toNumber());
            expect(happiness2.toNumber()).to.equal(7);
            //casino
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 7);
            const happiness3 = await taxescontract.getHappiness(0)
            // console.log("happiness 3", happiness3.toNumber());
            expect(happiness3.toNumber()).to.equal(9);
            //church
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 8);
            const happiness4 = await taxescontract.getHappiness(0)
            // console.log("happiness 4", happiness4.toNumber());
            expect(happiness4.toNumber()).to.equal(10);
            //police hq
            await improvementscontract4.connect(signer1).buyImprovement4(1, 0, 6);
            const happiness5 = await taxescontract.getHappiness(0)
            // console.log("happiness 5", happiness5.toNumber());
            expect(happiness5.toNumber()).to.equal(12);
            //stadium
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 8);
            const happiness6 = await taxescontract.getHappiness(0)
            // console.log("happiness 6", happiness6.toNumber());
            expect(happiness6.toNumber()).to.equal(15);
            //stadiums
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 8);
            const happiness7 = await taxescontract.getHappiness(0)
            // console.log("happiness 7", happiness7.toNumber());
            expect(happiness7.toNumber()).to.equal(18);
            const income = await taxescontract.getDailyIncome(0);
            // console.log("income", income.toNumber());
            expect(income.toNumber()).to.equal(70);
            // var improvementPoints = await taxescontract.getPointsFromImprovements(0);
            // console.log("improvement points", improvementPoints.toNumber());
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 3);
            const RLD = await improvementscontract3.getRedLightDistrictCount(0);
            // console.log("RLD", RLD.toNumber());
            const happiness8 = await taxescontract.getHappiness(0)
            // console.log("happiness 8", happiness8.toNumber());
            expect(happiness8.toNumber()).to.equal(18);
            // console.log("income", income.toNumber());
            expect(income.toNumber()).to.equal(70);
        })

        it("tests that happiness improves with great university as tech increases", async function () {
            await wonderscontract2.connect(signer1).buyWonder2(0, 3);
            const greatUniversity = await wonderscontract2.getGreatUniversity(0);
            // console.log("great university", greatUniversity);
            const tech0 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech0", tech0.toNumber());
            const happiness0 = await taxescontract.getHappiness(0)
            // console.log("happiness 0", happiness0.toNumber());
            expect(happiness0.toNumber()).to.equal(5);
            await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
            const tech1 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech1", tech1.toNumber());
            const happiness1 = await taxescontract.getHappiness(0)
            // console.log("happiness 1", happiness1.toNumber());
            expect(happiness1.toNumber()).to.equal(17);
            await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
            const tech2 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech2", tech2.toNumber());
            const happiness2 = await taxescontract.getHappiness(0)
            // console.log("happiness 2", happiness2.toNumber());
            expect(happiness2.toNumber()).to.equal(18);
            await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
            const tech3 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech3", tech3.toNumber());
            const happiness3 = await taxescontract.getHappiness(0)
            // console.log("happiness 3", happiness3.toNumber());
            expect(happiness3.toNumber()).to.equal(19);
            await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
            const tech4 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech4", tech4.toNumber());
            const happiness4 = await taxescontract.getHappiness(0)
            // console.log("happiness 4", happiness4.toNumber());
            expect(happiness4.toNumber()).to.equal(19);
        })

        it("tests that happiness improves with great university and scientific development center as tech increases", async function () {
            await wonderscontract2.connect(signer1).buyWonder2(0, 3);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 14000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await wonderscontract3.connect(signer1).buyWonder3(0, 9);
            await technologymarketcontrat.connect(signer1).destroyTech(0, 10000);
            await infrastructuremarketplace.connect(signer1).destroyInfrastructure(0, 14000);
            const greatUniversity = await wonderscontract2.getGreatUniversity(0);
            // console.log("great university", greatUniversity);
            const SDC = await wonderscontract3.getScientificDevelopmentCenter(0);
            // console.log("SDC", SDC);
            const tech0 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech0", tech0.toNumber());
            const happiness0 = await taxescontract.getHappiness(0)
            // console.log("happiness 0", happiness0.toNumber());
            expect(happiness0.toNumber()).to.equal(5);
            await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
            const tech1 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech1", tech1.toNumber());
            const happiness1 = await taxescontract.getHappiness(0)
            // console.log("happiness 1", happiness1.toNumber());
            expect(happiness1.toNumber()).to.equal(17);
            await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
            const tech2 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech2", tech2.toNumber());
            const happiness2 = await taxescontract.getHappiness(0)
            // console.log("happiness 2", happiness2.toNumber());
            expect(happiness2.toNumber()).to.equal(18);
            await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
            const tech3 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech3", tech3.toNumber());
            const happiness3 = await taxescontract.getHappiness(0)
            // console.log("happiness 3", happiness3.toNumber());
            expect(happiness3.toNumber()).to.equal(19);
            await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
            const tech4 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech4", tech4.toNumber());
            const happiness4 = await taxescontract.getHappiness(0)
            // console.log("happiness 4", happiness4.toNumber());
            expect(happiness4.toNumber()).to.equal(20);
            await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
            const tech5 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech5", tech5.toNumber());
            const happiness5 = await taxescontract.getHappiness(0)
            // console.log("happiness 5", happiness5.toNumber());
            expect(happiness5.toNumber()).to.equal(21);
            await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
            const tech6 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech6", tech6.toNumber());
            const happiness6 = await taxescontract.getHappiness(0)
            // console.log("happiness 6", happiness6.toNumber());
            expect(happiness6.toNumber()).to.equal(21);
        })

        it("taxes1 happiness tests additions to happiness from bonus resource beer", async function () {
            const pointsFromResources0 = await taxescontract.getPointsFromResources(0);
            // console.log(pointsFromResources0.toNumber());
            expect(pointsFromResources0.toNumber()).to.equal(0);
            await billscontract.connect(signer1).payBills(0)
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 50000);
            await resourcescontract.connect(signer2).proposeTrade(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 1);
            await resourcescontract.connect(signer3).proposeTrade(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 2);
            await resourcescontract.connect(signer4).proposeTrade(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 3);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            await resourcescontract.connect(signer5).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            await resourcescontract.mockResourcesForTesting(0, 0, 9)
            await resourcescontract.mockResourcesForTesting(1, 18, 19)
            await resourcescontract.mockResourcesForTesting(2, 4, 5)
            await resourcescontract.mockResourcesForTesting(3, 6, 7)
            await resourcescontract.mockResourcesForTesting(4, 8, 9)
            var beer = await bonusresourcescontract.viewBeer(0)
            // console.log("beer", beer)
            const pointsFromResources1 = await taxescontract.getPointsFromResources(0);
            // console.log(pointsFromResources1.toNumber());
            expect(pointsFromResources1.toNumber()).to.equal(11);
            
        })

        it("taxes1 happiness tests additions to happiness from bonus resource fast food", async function () {
            const pointsFromResources0 = await taxescontract.getPointsFromResources(0);
            // console.log(pointsFromResources0.toNumber());
            expect(pointsFromResources0.toNumber()).to.equal(0);
            await billscontract.connect(signer1).payBills(0)
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 50000);
            await resourcescontract.mockResourcesForTesting(0, 1, 16)
            await resourcescontract.mockResourcesForTesting(1, 15, 12)
            await resourcescontract.mockResourcesForTesting(2, 4, 5)
            await resourcescontract.mockResourcesForTesting(3, 6, 7)
            await resourcescontract.mockResourcesForTesting(4, 8, 9)
            await resourcescontract.connect(signer2).proposeTrade(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 1);
            await resourcescontract.connect(signer3).proposeTrade(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 2);
            await resourcescontract.connect(signer4).proposeTrade(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 3);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            await resourcescontract.connect(signer5).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            var fastFood = await bonusresourcescontract.viewFastFood(0)
            // console.log("fast food", fastFood)
            const pointsFromResources2 = await taxescontract.getPointsFromResources(0);
            // console.log(pointsFromResources2.toNumber());
            expect(pointsFromResources2.toNumber()).to.equal(8);
        })

        it("taxes1 happiness tests additions to happiness from bonus resource automobiles", async function () {
            const pointsFromResources0 = await taxescontract.getPointsFromResources(0);
            // console.log(pointsFromResources0.toNumber());
            expect(pointsFromResources0.toNumber()).to.equal(0);
            await billscontract.connect(signer1).payBills(0)
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 50000);
            await resourcescontract.mockResourcesForTesting(0, 11, 13)
            await resourcescontract.mockResourcesForTesting(1, 9, 7)
            await resourcescontract.mockResourcesForTesting(2, 10, 0)
            await resourcescontract.mockResourcesForTesting(3, 2, 7)
            await resourcescontract.mockResourcesForTesting(4, 8, 9)
            await resourcescontract.connect(signer2).proposeTrade(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 1);
            await resourcescontract.connect(signer3).proposeTrade(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 2);
            await resourcescontract.connect(signer4).proposeTrade(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 3);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            await resourcescontract.connect(signer5).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            var automobiles = await bonusresourcescontract.viewAutomobiles(0)
            // console.log("automobiles", automobiles)
            const pointsFromResources2 = await taxescontract.getPointsFromResources(0);
            // console.log(pointsFromResources2.toNumber());
            expect(pointsFromResources2.toNumber()).to.equal(5);
        })

        it("taxes1 tests adjustments to happiness from casualties", async function () {
            await forcescontract.increaseSoldierCasualties(0, 4000000);
            const casualties0 : any = await forcescontract.getCasualties(0);
            // console.log("casualties", casualties0[0].toNumber());
            const happiness0 = await taxescontract.getHappiness(0)
            // console.log("happiness 0", happiness0.toNumber());
            expect(happiness0.toNumber()).to.equal(5);
            const pointsFromCasulaties0 = await taxescontract.getCasualtyPoints(0);
            // console.log(pointsFromCasulaties0.toNumber(), "points from casualties 0");
            expect(pointsFromCasulaties0.toNumber()).to.equal(0);
            await forcescontract.increaseSoldierCasualties(0, 5000000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 5);
            await wonderscontract3.connect(signer1).buyWonder3(0, 2);
            const cemetary = await wonderscontract3.getNationalCemetary(0)
            // console.log("cemetary", cemetary);
            const casualties1 : any = await forcescontract.getCasualties(0);
            // console.log("casualties", casualties1[0].toNumber());
            const happiness1 = await taxescontract.getHappiness(0)
            // console.log("happiness 1", happiness1.toNumber());
            expect(happiness1.toNumber()).to.equal(10);
            const pointsFromCasulaties1 = await taxescontract.getCasualtyPoints(0);
            // console.log(pointsFromCasulaties1.toNumber(), "points from casualties 1");
            expect(pointsFromCasulaties1.toNumber()).to.equal(1);
            await forcescontract.increaseSoldierCasualties(0, 5000000);
            const casualties2 : any = await forcescontract.getCasualties(0);
            // console.log("casualties", casualties2[0].toNumber());
            const happiness2 = await taxescontract.getHappiness(0)
            // console.log("happiness 2", happiness2.toNumber());
            expect(happiness2.toNumber()).to.equal(11);
            const pointsFromCasulaties2 = await taxescontract.getCasualtyPoints(0);
            // console.log(pointsFromCasulaties2.toNumber(), "points from casualties 2");
            expect(pointsFromCasulaties2.toNumber()).to.equal(2);
            await forcescontract.increaseSoldierCasualties(0, 5000000);
            const casualties3 : any = await forcescontract.getCasualties(0);
            // console.log("casualties", casualties3[0].toNumber());
            const happiness3 = await taxescontract.getHappiness(0)
            // console.log("happiness 3", happiness3.toNumber());
            expect(happiness3.toNumber()).to.equal(12);
            const pointsFromCasulaties3 = await taxescontract.getCasualtyPoints(0);
            // console.log(pointsFromCasulaties3.toNumber(), "points from casualties 3");
            expect(pointsFromCasulaties3.toNumber()).to.equal(3);
            await forcescontract.increaseSoldierCasualties(0, 5000000);
            const casualties4 : any = await forcescontract.getCasualties(0);
            // console.log("casualties", casualties4[0].toNumber());
            const happiness4 = await taxescontract.getHappiness(0)
            // console.log("happiness 4", happiness4.toNumber());
            expect(happiness4.toNumber()).to.equal(13);
            const pointsFromCasulaties4 = await taxescontract.getCasualtyPoints(0);
            // console.log(pointsFromCasulaties4.toNumber(), "points from casualties 4");
            expect(pointsFromCasulaties4.toNumber()).to.equal(4);
            await forcescontract.increaseSoldierCasualties(0, 5000000);
            const casualties5 : any = await forcescontract.getCasualties(0);
            // console.log("casualties", casualties5[0].toNumber());
            const happiness5 = await taxescontract.getHappiness(0)
            // console.log("happiness 5", happiness5.toNumber());
            expect(happiness5.toNumber()).to.equal(14);
            const pointsFromCasulaties5 = await taxescontract.getCasualtyPoints(0);
            // console.log(pointsFromCasulaties5.toNumber(), "points from casualties 5");
            expect(pointsFromCasulaties5.toNumber()).to.equal(5);
       })

       it("taxes1 tests adjustments to happiness from technology", async function () {
            const tech0 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech0", tech0.toNumber());
            const happiness0 = await taxescontract.getHappiness(0)
            // console.log("happiness 0", happiness0.toNumber());
            expect(happiness0.toNumber()).to.equal(5);
            const pointsFromTech0 = await taxescontract.getTechnologyPoints(0);
            // console.log(pointsFromTech0.toNumber(), "points from tech 0");
            expect(pointsFromTech0.toNumber()).to.equal(0);
            await technologymarketcontrat.connect(signer1).buyTech(0, 1);
            const tech1 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech1", tech1.toNumber());
            const happiness1 = await taxescontract.getHappiness(0)
            // console.log("happiness 1", happiness1.toNumber());
            expect(happiness1.toNumber()).to.equal(6);
            const pointsFromTech1 = await taxescontract.getTechnologyPoints(0);
            // console.log(pointsFromTech1.toNumber(), "points from tech 1");
            expect(pointsFromTech1.toNumber()).to.equal(1);
            await technologymarketcontrat.connect(signer1).buyTech(0, 2);
            const tech3 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech3", tech3.toNumber());
            const happiness3 = await taxescontract.getHappiness(0)
            // console.log("happiness 3", happiness3.toNumber());
            expect(happiness3.toNumber()).to.equal(7);
            const pointsFromTech3 = await taxescontract.getTechnologyPoints(0);
            // console.log(pointsFromTech3.toNumber(), "points from tech 3");
            expect(pointsFromTech3.toNumber()).to.equal(2);
            await technologymarketcontrat.connect(signer1).buyTech(0, 3);
            const tech6 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech6", tech6.toNumber());
            const happiness6 = await taxescontract.getHappiness(0)
            // console.log("happiness 6", happiness6.toNumber());
            expect(happiness6.toNumber()).to.equal(9);
            const pointsFromTech6 = await taxescontract.getTechnologyPoints(0);
            // console.log(pointsFromTech6.toNumber(), "points from tech 6");
            expect(pointsFromTech6.toNumber()).to.equal(3);
            await technologymarketcontrat.connect(signer1).buyTech(0, 4);
            const tech10 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech10", tech10.toNumber());
            const happiness10 = await taxescontract.getHappiness(0)
            // console.log("happiness 10", happiness10.toNumber());
            expect(happiness10.toNumber()).to.equal(10);
            const pointsFromTech10 = await taxescontract.getTechnologyPoints(0);
            // console.log(pointsFromTech10.toNumber(), "points from tech 10");
            expect(pointsFromTech10.toNumber()).to.equal(4);
            await technologymarketcontrat.connect(signer1).buyTech(0, 5);
            const tech15 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech15", tech15.toNumber());
            const happiness15 = await taxescontract.getHappiness(0)
            // console.log("happiness 15", happiness15.toNumber());
            expect(happiness15.toNumber()).to.equal(11);
            const pointsFromTech15 = await taxescontract.getTechnologyPoints(0);
            // console.log(pointsFromTech15.toNumber(), "points from tech 15");
            expect(pointsFromTech15.toNumber()).to.equal(5);
            await technologymarketcontrat.connect(signer1).buyTech(0, 35);
            const tech50 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech50", tech50.toNumber());
            const happiness50 = await taxescontract.getHappiness(0)
            // console.log("happiness 50", happiness50.toNumber());
            expect(happiness50.toNumber()).to.equal(12);
            const pointsFromTech50 = await taxescontract.getTechnologyPoints(0);
            // console.log(pointsFromTech50.toNumber(), "points from tech 50");
            expect(pointsFromTech50.toNumber()).to.equal(6);
            await technologymarketcontrat.connect(signer1).buyTech(0, 50);
            const tech100 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech100", tech100.toNumber());
            const happiness100 = await taxescontract.getHappiness(0)
            // console.log("happiness 100", happiness100.toNumber());
            expect(happiness100.toNumber()).to.equal(13);
            const pointsFromTech100 = await taxescontract.getTechnologyPoints(0);
            // console.log(pointsFromTech100.toNumber(), "points from tech 100");
            expect(pointsFromTech100.toNumber()).to.equal(7);
            await technologymarketcontrat.connect(signer1).buyTech(0, 50);
            const tech150 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech150", tech150.toNumber());
            const happiness150 = await taxescontract.getHappiness(0)
            // console.log("happiness 150", happiness150.toNumber());
            expect(happiness150.toNumber()).to.equal(14);
            const pointsFromTech150 = await taxescontract.getTechnologyPoints(0);
            // console.log(pointsFromTech150.toNumber(), "points from tech 150");
            expect(pointsFromTech150.toNumber()).to.equal(8);
            await technologymarketcontrat.connect(signer1).buyTech(0, 50);
            const tech200 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech200", tech200.toNumber());
            const happiness200 = await taxescontract.getHappiness(0)
            // console.log("happiness 200", happiness200.toNumber());
            expect(happiness200.toNumber()).to.equal(15);
            const pointsFromTech200 = await taxescontract.getTechnologyPoints(0);
            // console.log(pointsFromTech200.toNumber(), "points from tech 200");
            expect(pointsFromTech200.toNumber()).to.equal(9);
            await technologymarketcontrat.connect(signer1).buyTech(0, 50);
            const tech250 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech250", tech250.toNumber());
            const happiness250 = await taxescontract.getHappiness(0)
            // console.log("happiness 250", happiness250.toNumber());
            expect(happiness250.toNumber()).to.equal(16);
            const pointsFromTech250 = await taxescontract.getTechnologyPoints(0);
            // console.log(pointsFromTech250.toNumber(), "points from tech 250");
            expect(pointsFromTech250.toNumber()).to.equal(10);
        })

        it("taxes1 tests that nation age will add points to happiness", async function () {
            const potinsFromNationAge0 = await taxescontract.getPointsFromNationAge(0);
            // console.log(potinsFromNationAge0.toNumber(), "points from nation age 0");
            expect(potinsFromNationAge0.toNumber()).to.equal(0);    
            for(let i = 0; i < 91; i++) {
                await keepercontract.incrementGameDay()
            }
            //nation over 90 days old get 2 points of happiness
            const potinsFromNationAge1 = await taxescontract.getPointsFromNationAge(0);
            // console.log(potinsFromNationAge1.toNumber(), "points from nation age 1");
            expect(potinsFromNationAge1.toNumber()).to.equal(2);
            for(let i = 0; i < 91; i++) {
                await keepercontract.incrementGameDay()
            }
            //nation over 180 days old get an additional 2 points of happiness
            const potinsFromNationAge2 = await taxescontract.getPointsFromNationAge(0);
            // console.log(potinsFromNationAge2.toNumber(), "points from nation age 2");
            expect(potinsFromNationAge2.toNumber()).to.equal(4);
        })

        it("taxes1 tests the deduction to happiness from tax rate", async function () {
            await infrastructurecontract.connect(signer1).setTaxRate(0, 16)
            const pointsSubtractedFromTaxRate16 = await taxescontract.getTaxRatePoints(0);
            // console.log(pointsSubtractedFromTaxRate16.toNumber(), "pointsSubtractedFromTaxRate16");
            expect(pointsSubtractedFromTaxRate16.toNumber()).to.equal(0);
            await infrastructurecontract.connect(signer1).setTaxRate(0, 20)
            const pointsSubtractedFromTaxRate20 = await taxescontract.getTaxRatePoints(0);
            // console.log(pointsSubtractedFromTaxRate20.toNumber(), "pointsSubtractedFromTaxRate20");
            expect(pointsSubtractedFromTaxRate20.toNumber()).to.equal(1);
            await infrastructurecontract.connect(signer1).setTaxRate(0, 23)
            const pointsSubtractedFromTaxRate23 = await taxescontract.getTaxRatePoints(0);
            // console.log(pointsSubtractedFromTaxRate23.toNumber(), "pointsSubtractedFromTaxRate23");
            expect(pointsSubtractedFromTaxRate23.toNumber()).to.equal(3);
            await infrastructurecontract.connect(signer1).setTaxRate(0, 25)
            const pointsSubtractedFromTaxRate25 = await taxescontract.getTaxRatePoints(0);
            // console.log(pointsSubtractedFromTaxRate25.toNumber(), "pointsSubtractedFromTaxRate25");
            expect(pointsSubtractedFromTaxRate25.toNumber()).to.equal(5);
            await infrastructurecontract.connect(signer1).setTaxRate(0, 28)
            const pointsSubtractedFromTaxRate28 = await taxescontract.getTaxRatePoints(0);
            // console.log(pointsSubtractedFromTaxRate28.toNumber(), "pointsSubtractedFromTaxRate28");
            expect(pointsSubtractedFromTaxRate28.toNumber()).to.equal(7);
        })

        it("taxes1 tests the deduction to happiness from criminal count", async function () {
            const criminalCount0 = await crimecontract.getCriminalCount(0);
            // console.log(criminalCount0[0].toNumber(), "criminalCount0");
            const pointsSubtractedFromCriminalCount0 = await taxescontract.getPointsFromCriminals(0);
            // console.log(pointsSubtractedFromCriminalCount0.toNumber(), "pointsSubtractedFromCriminalCount0");
            expect(pointsSubtractedFromCriminalCount0.toNumber()).to.equal(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 5000);
            const criminalCount1 = await crimecontract.getCriminalCount(0);
            // console.log(criminalCount1[0].toNumber(), "criminalCount1");
            const pointsSubtractedFromCriminalCount1 = await taxescontract.getPointsFromCriminals(0);
            // console.log(pointsSubtractedFromCriminalCount1.toNumber(), "pointsSubtractedFromCriminalCount1");
            expect(pointsSubtractedFromCriminalCount1.toNumber()).to.equal(1);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            const criminalCount2 = await crimecontract.getCriminalCount(0);
            // console.log(criminalCount2[0].toNumber(), "criminalCount2");
            const pointsSubtractedFromCriminalCount2 = await taxescontract.getPointsFromCriminals(0);
            // console.log(pointsSubtractedFromCriminalCount2.toNumber(), "pointsSubtractedFromCriminalCount2");
            expect(pointsSubtractedFromCriminalCount2.toNumber()).to.equal(2);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            const criminalCount3 = await crimecontract.getCriminalCount(0);
            // console.log(criminalCount3[0].toNumber(), "criminalCount3");
            const pointsSubtractedFromCriminalCount3 = await taxescontract.getPointsFromCriminals(0);
            // console.log(pointsSubtractedFromCriminalCount3.toNumber(), "pointsSubtractedFromCriminalCount3");
            expect(pointsSubtractedFromCriminalCount3.toNumber()).to.equal(3);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            const criminalCount4 = await crimecontract.getCriminalCount(0);
            // console.log(criminalCount4[0].toNumber(), "criminalCount4");
            const pointsSubtractedFromCriminalCount4 = await taxescontract.getPointsFromCriminals(0);
            // console.log(pointsSubtractedFromCriminalCount4.toNumber(), "pointsSubtractedFromCriminalCount4");
            expect(pointsSubtractedFromCriminalCount4.toNumber()).to.equal(4);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 4000);
            const criminalCount5 = await crimecontract.getCriminalCount(0);
            // console.log(criminalCount5[0].toNumber(), "criminalCount5");
            const pointsSubtractedFromCriminalCount5 = await taxescontract.getPointsFromCriminals(0);
            // console.log(pointsSubtractedFromCriminalCount5.toNumber(), "pointsSubtractedFromCriminalCount5");
            expect(pointsSubtractedFromCriminalCount5.toNumber()).to.equal(5);
        })

        it("taxes1 tests additions to income from accomodtive government types 3, 6, 8, 9", async function () {
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            // gov 3 is accomodative
            await countryparameterscontract.connect(signer1).setGovernment(0, 3);
            const govPoints3 = await additionaltaxescontract.getPointsFromGovernment(0);
            // console.log("gov points 3", govPoints3.toNumber())
            expect(govPoints3.toNumber()).to.equal(1);
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            // gov 4 is non accomodative
            await countryparameterscontract.connect(signer1).setGovernment(0, 4);
            const govPoints4 = await additionaltaxescontract.getPointsFromGovernment(0);
            // console.log("gov points 4", govPoints4.toNumber())
            expect(govPoints4.toNumber()).to.equal(0);
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            // gov 6 is accomodative
            await countryparameterscontract.connect(signer1).setGovernment(0, 3);
            const govPoints6 = await additionaltaxescontract.getPointsFromGovernment(0);
            // console.log("gov points 6", govPoints6.toNumber())
            expect(govPoints6.toNumber()).to.equal(1);
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            // gov 8 is accomodative
            await countryparameterscontract.connect(signer1).setGovernment(0, 3);
            const govPoints8 = await additionaltaxescontract.getPointsFromGovernment(0);
            // console.log("gov points 8", govPoints8.toNumber())
            expect(govPoints8.toNumber()).to.equal(1);
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            // gov 9 is accomodative
            await countryparameterscontract.connect(signer1).setGovernment(0, 3);
            const govPoints9 = await additionaltaxescontract.getPointsFromGovernment(0);
            // console.log("gov points 9", govPoints9.toNumber())
            expect(govPoints9.toNumber()).to.equal(1);
        })

        it("taxes1 tests penalties to happiness from military density", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            const inf1000 = await infrastructurecontract.getInfrastructureCount(0);
            // console.log("inf1000", inf1000.toNumber());
            const militaryDensity0 = await additionaltaxescontract.getPointsFromMilitary(0);
            // console.log("military density 0", militaryDensity0.toNumber());
            //military density less than 10% should equal a 14 point happiness deduction
            expect(militaryDensity0.toNumber()).to.equal(14);
            await forcescontract.connect(signer1).buySoldiers(1300, 0);
            const militaryDensity15 = await additionaltaxescontract.getPointsFromMilitary(0);
            // console.log("military density 15", militaryDensity15.toNumber());
            //military density less than 15% should equal a 5 point happiness deduction
            expect(militaryDensity15.toNumber()).to.equal(5);
            await forcescontract.connect(signer1).buySoldiers(5000, 0);
            const militaryDensity80 = await additionaltaxescontract.getPointsFromMilitary(0);
            // console.log("military density 80", militaryDensity80.toNumber());
            //military density over than 80% should equal a 10 point happiness deduction
            expect(militaryDensity80.toNumber()).to.equal(10);
        })

        it("taxes1 tests that soldier to population ratio works correctly", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            const soldierCount = await forcescontract.getSoldierCount(0);
            // console.log("soldier count", soldierCount.toNumber());
            await forcescontract.connect(signer1).decomissionSoldiers(20, 0)
            const soldierToPopulation0 = await additionaltaxescontract.soldierToPopulationRatio(0);
            // console.log("soldier to population 0", soldierToPopulation0[0].toNumber());
            expect(soldierToPopulation0[0].toNumber()).to.equal(0);
            await forcescontract.connect(signer1).buySoldiers(1000, 0);
            const soldierToPopulation1 = await additionaltaxescontract.soldierToPopulationRatio(0);
            // console.log("soldier to population 1", soldierToPopulation1[0].toNumber());
            expect(soldierToPopulation1[0].toNumber()).to.equal(11);
            await forcescontract.connect(signer1).buySoldiers(1000, 0);
            const soldierToPopulation2 = await additionaltaxescontract.soldierToPopulationRatio(0);
            // console.log("soldier to population 2", soldierToPopulation2[0].toNumber());
            expect(soldierToPopulation2[0].toNumber()).to.equal(23);
            await forcescontract.connect(signer1).buySoldiers(1000, 0);
            const soldierToPopulation3 = await additionaltaxescontract.soldierToPopulationRatio(0);
            // console.log("soldier to population 3", soldierToPopulation3[0].toNumber());
            expect(soldierToPopulation3[0].toNumber()).to.equal(35);
            await forcescontract.connect(signer1).buySoldiers(1000, 0);
            const soldierToPopulation4 = await additionaltaxescontract.soldierToPopulationRatio(0);
            // console.log("soldier to population 4", soldierToPopulation4[0].toNumber());
            expect(soldierToPopulation4[0].toNumber()).to.equal(46);
        })

        it("taxes1 tests that anarchy is triggered below a soldier to population ratio of 10", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            const anarchy = await additionaltaxescontract.soldierToPopulationRatio(0);
            // console.log("soldier to population 1", anarchy[0].toNumber());
            // console.log("anarchy 1", anarchy[2]);
            expect(anarchy[2]).to.equal(true);
            await forcescontract.connect(signer1).buySoldiers(2000, 0);
            const anarchy2 = await additionaltaxescontract.soldierToPopulationRatio(0);
            // console.log("soldier to population 2", anarchy2[0].toNumber());
            // console.log("anarchy 2", anarchy2[2]);
            expect(anarchy2[2]).to.equal(false);
        })

        it("taxes1 tests that environment penalty gets triggered with a soldier ratio over 60", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await forcescontract.connect(signer1).buySoldiers(1000, 0);
            const environmentPenalty = await additionaltaxescontract.soldierToPopulationRatio(0);
            // console.log("soldier to population 1", environmentPenalty[0].toNumber());
            // console.log("environment penalty 1", environmentPenalty[1]);
            expect(environmentPenalty[1]).to.equal(false);
            await forcescontract.connect(signer1).buySoldiers(4500, 0);
            const environmentPenalty2 = await additionaltaxescontract.soldierToPopulationRatio(0);
            // console.log("soldier to population 2", environmentPenalty2[0].toNumber());
            // console.log("environment penalty 2", environmentPenalty2[1]);
            expect(environmentPenalty2[1]).to.equal(true);
        })

        it("taxes1 tests that intel agencies will deduct happiness points at specific tax rates", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await infrastructurecontract.connect(signer1).setTaxRate(0, 16)
            //tax rate less than 20 should not trigger a happiness reduction regardless of intel agencies
            const intelAgency0Tax16 = await additionaltaxescontract.getPointsFromIntelAgencies(0);
            // console.log("intel agency points 0 int agencies tax rate 16%", intelAgency0Tax16.toNumber());
            expect(intelAgency0Tax16.toNumber()).to.equal(0);
            await infrastructurecontract.connect(signer1).setTaxRate(0, 28)
            //a high tax rate with no intel agencies should not trigger a penalty
            const intelAgency0Tax28 = await additionaltaxescontract.getPointsFromIntelAgencies(0);
            // console.log("intel agency points 0 int agencies tax rate 28%", intelAgency0Tax28.toNumber());
            expect(intelAgency0Tax28.toNumber()).to.equal(0);
            await improvementscontract2.connect(signer1).buyImprovement2(2, 0, 6)
            //a high tax rate with intel agencies should trigger a penalty of 1 point per intel agency
            const intelAgency2Tax28 = await additionaltaxescontract.getPointsFromIntelAgencies(0);
            // console.log("intel agency points 1 int agencies tax rate 28%", intelAgency2Tax28.toNumber());
            expect(intelAgency2Tax28.toNumber()).to.equal(2);
            await infrastructurecontract.connect(signer1).setTaxRate(0, 22)
            //at a tax rate between >20 and <=23 the penalty should be 1 point regardless of intel agency count
            const intelAgency2Tax22 = await additionaltaxescontract.getPointsFromIntelAgencies(0);
            // console.log("intel agency points 2 int agencies tax rate 22%", intelAgency2Tax22.toNumber());
            expect(intelAgency2Tax22.toNumber()).to.equal(1);
        })
    })

    describe("Taxes Contract / Income Tests", function () {
        it("taxes1 tests multipliers to income", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 15000);
            await forcescontract.connect(signer1).buySoldiers(35000, 0)
            await improvementscontract3.connect(signer1).buyImprovement3(3, 0, 1);
            const happiness1 = await taxescontract.getHappiness(0)
            // console.log("happiness 1", happiness1.toNumber());
            const dailyIncome = await taxescontract.getDailyIncome(0);
            // console.log("income", dailyIncome.toNumber());
            //banks
            await billscontract.connect(signer1).payBills(0)
            await improvementscontract1.connect(signer1).buyImprovement1(5, 0, 2);
            const dailyIncome2 = await taxescontract.getDailyIncome(0);
            // console.log("income2", dailyIncome2.toNumber());
            //ministries
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 1);
            const dailyIncome3 = await taxescontract.getDailyIncome(0);
            // console.log("income3", dailyIncome3.toNumber());
            //harbors
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            const dailyIncome4 = await taxescontract.getDailyIncome(0);
            // console.log("income4", dailyIncome4.toNumber());
            //schools
            await improvementscontract3.connect(signer1).buyImprovement3(5, 0, 6);
            const dailyIncome5 = await taxescontract.getDailyIncome(0);
            // console.log("income5", dailyIncome5.toNumber());
            //guerilla camps
            await improvementscontract2.connect(signer1).buyImprovement2(5, 0, 3)
            const dailyIncome6 = await taxescontract.getDailyIncome(0);
            // console.log("income6", dailyIncome6.toNumber());
            //casinos
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 7);
            const dailyIncome7 = await taxescontract.getDailyIncome(0);
            // console.log("income7", dailyIncome7.toNumber());
            expect(dailyIncome7.toNumber()).to.equal(58);
            const happiness2 = await taxescontract.getHappiness(0)
            // console.log("happiness 2", happiness2.toNumber());
            expect(happiness2.toNumber()).to.equal(6);
        })

        it("taxes1 tests additions to income", async function () {
            await billscontract.connect(signer1).payBills(0)
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 15000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
            await landmarketcontract.connect(signer1).buyLand(0, 3000);
            const happiness1 = await taxescontract.getHappiness(0)
            // console.log("happiness 1", happiness1.toNumber());
            const dailyIncome2 = await taxescontract.getDailyIncome(0);
            // console.log("income 2", dailyIncome2.toNumber());
            await resourcescontract.mockResourcesForTesting(0, 3, 5);
            await resourcescontract.mockResourcesForTesting(1, 6, 14);
            await resourcescontract.connect(signer2).proposeTrade(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 1);
            const dailyIncome3 = await taxescontract.getDailyIncome(0);
            // console.log("income 3", dailyIncome3.toNumber());
            await resourcescontract.mockResourcesForTesting(2, 9, 8);
            await resourcescontract.connect(signer3).proposeTrade(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 2);
            const dailyIncome4 = await taxescontract.getDailyIncome(0);
            // console.log("income 4", dailyIncome4.toNumber());
            await resourcescontract.mockResourcesForTesting(3, 17, 11);
            await resourcescontract.connect(signer4).proposeTrade(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 3);
            const dailyIncome5 = await taxescontract.getDailyIncome(0);
            // console.log("income 5", dailyIncome5.toNumber());
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            await wonderscontract2.connect(signer1).buyWonder2(0, 9);
            await resourcescontract.mockResourcesForTesting(4, 2, 18);
            await resourcescontract.connect(signer5).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            const dailyIncome6 = await taxescontract.getDailyIncome(0);
            // console.log("income 6", dailyIncome6.toNumber());
            await wonderscontract4.connect(signer1).buyWonder4(0, 3);
            const dailyIncome7 = await taxescontract.getDailyIncome(0);
            // console.log("income 7", dailyIncome7.toNumber());
            expect(dailyIncome7.toNumber()).to.equal(101);
            await resourcescontract.mockResourcesForTesting(0, 4, 5);
            const furs = await resourcescontract.viewFurs(0)
            // console.log("furs", furs)
            const dailyIncome8 = await taxescontract.getDailyIncome(0);
            // console.log("income 8", dailyIncome8.toNumber());
            expect(dailyIncome8.toNumber()).to.equal(105);
            const incomeAdjustments = await additionaltaxescontract.getIncomeAdjustments(0);
            // console.log("income adjustments", incomeAdjustments.toNumber())
            await wonderscontract1.connect(signer1).buyWonder1(0, 1);
            const ADP = await wonderscontract1.getAgriculturalDevelopmentProgram(0)
            // console.log("ADP", ADP)
            const dailyIncome9 = await taxescontract.getDailyIncome(0);
            // console.log("income 9", dailyIncome9.toNumber());
            //the income will be the same because one happiness point was lost due to the
            //increse in population and criminal count from the ADP
            expect(dailyIncome9.toNumber()).to.equal(105);
            const incomeAdjustments2 = await additionaltaxescontract.getIncomeAdjustments(0);
            // console.log("income adjustments 2", incomeAdjustments2.toNumber())
        })

        it("taxes1 tests adjustments to income from uranium and nuclear power plant bonus", async function () {
            const nuclearUraniumBonus0 = await additionaltaxescontract.getNuclearAndUraniumBonus(0);
            // console.log("nuclear uranium bonus 0", nuclearUraniumBonus0.toNumber());
            expect(nuclearUraniumBonus0.toNumber()).to.equal(0);
            await resourcescontract.mockResourcesForTesting(0, 3, 17);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 12000);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 12000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 6);
            const uranium = await resourcescontract.viewUranium(0)
            // console.log("uranium", uranium)
            const nuclearPowerPlant = await wonderscontract3.getNuclearPowerPlant(0)
            // console.log("nuclear power plant", nuclearPowerPlant)
            await technologymarketcontrat.connect(signer1).destroyTech(0, 10000);
            const tech0 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech0", tech0.toNumber());
            const nuclearUraniumBonus1 = await additionaltaxescontract.getNuclearAndUraniumBonus(0);
            // console.log("nuclear uranium bonus 0", nuclearUraniumBonus1.toNumber());
            expect(nuclearUraniumBonus1.toNumber()).to.equal(3);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10);
            const tech1 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech1", tech1.toNumber());
            const nuclearUraniumBonus2 = await additionaltaxescontract.getNuclearAndUraniumBonus(0);
            // console.log("nuclear uranium bonus 2", nuclearUraniumBonus2.toNumber());
            expect(nuclearUraniumBonus2.toNumber()).to.equal(4);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10);
            const tech2 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech2", tech2.toNumber());
            const nuclearUraniumBonus3 = await additionaltaxescontract.getNuclearAndUraniumBonus(0);
            // console.log("nuclear uranium bonus 3", nuclearUraniumBonus3.toNumber());
            expect(nuclearUraniumBonus3.toNumber()).to.equal(5);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10);
            const tech3 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech3", tech3.toNumber());
            const nuclearUraniumBonus4 = await additionaltaxescontract.getNuclearAndUraniumBonus(0);
            // console.log("nuclear uranium bonus 4", nuclearUraniumBonus4.toNumber());
            expect(nuclearUraniumBonus4.toNumber()).to.equal(6);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10);
            const tech4 = await infrastructurecontract.getTechnologyCount(0);
            // console.log("tech4", tech4.toNumber());
            const nuclearUraniumBonus5 = await additionaltaxescontract.getNuclearAndUraniumBonus(0);
            // console.log("nuclear uranium bonus 5", nuclearUraniumBonus5.toNumber());
            expect(nuclearUraniumBonus5.toNumber()).to.equal(7);
        })

        it("taxes1 tests multipliers to income from universities and scientific development center", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            await improvementscontract3.connect(signer1).buyImprovement3(5, 0, 6)
            await improvementscontract3.connect(signer1).buyImprovement3(2, 0, 9)
            const universityCount = await improvementscontract3.getUniversityCount(0);
            // console.log("university count", universityCount.toNumber())
            const universityPointsNoSDC = await additionaltaxescontract.getUniversityPoints(0);
            // console.log("university points no SDC", universityPointsNoSDC.toNumber())
            
            // *** 2 universities 8 points each without SDC
            expect(universityPointsNoSDC.toNumber()).to.equal(16);
            
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 14000);
            await wonderscontract2.connect(signer1).buyWonder2(0, 3);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await wonderscontract3.connect(signer1).buyWonder3(0, 9);
            const SDC = await wonderscontract3.getScientificDevelopmentCenter(0)
            // console.log("SDC", SDC)
            const universityPointsWithSDC = await additionaltaxescontract.getUniversityPoints(0);
            // console.log("university points with SDC", universityPointsWithSDC.toNumber())
            
            // *** 2 universities 10 points each with SDC
            expect(universityPointsWithSDC.toNumber()).to.equal(20);
        })
    })
})
