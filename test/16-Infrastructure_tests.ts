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

describe("Infrastructure Contract", function () {

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
            fighterlosses.address,
            countryminter.address
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
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, nukecontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, cruisemissilecontract.address);
        }

        await warbucks.connect(signer0).transfer(signer1.address, BigInt(2100000000000000000000000))
        await countryminter.connect(signer1).generateCountry(
            "TestRuler",
            "TestNationName",
            "TestCapitalCity",
            "TestNationSlogan"
        )
        await warbucks.connect(signer0).approve(warbucks.address, BigInt(3000000000*(10**18)));
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(3000000000*(10**18)));
        await treasurycontract.connect(signer1).addFunds(BigInt(3000000000*(10**18)), 0);

        await warbucks.connect(signer0).transfer(signer2.address, BigInt(2100000000000000000000000))
        await countryminter.connect(signer2).generateCountry(
            "TestRuler",
            "TestNationName",
            "TestCapitalCity",
            "TestNationSlogan"
        )
        await warbucks.connect(signer0).approve(warbucks.address, BigInt(3000000000*(10**18)));
        await warbucks.connect(signer0).transfer(signer2.address, BigInt(3000000000*(10**18)));
        await treasurycontract.connect(signer2).addFunds(BigInt(2000000000*(10**18)), 1);

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
                let resources1 = await resourcescontract.getPlayerResources(1);
                // console.log("resources 1", resources1[0].toNumber(), resources1[1].toNumber());
            } 
        }
    });

    describe("Infrastructure", function () {
        it("infrastructure get infrastructure function works correctly", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 200);
            var infrastructureAmount = await infrastructurecontract.getInfrastructureCount(0);
            expect(infrastructureAmount.toNumber()).to.equal(220);
        })

        it("infrastructure get technology function works correctly", async function () {
            await technologymarketcontrat.connect(signer1).buyTech(0, 200);
            var tech = await infrastructurecontract.getTechnologyCount(0);
            expect(tech.toNumber()).to.equal(200);
        })

        it("infrastructure get land function works correctly", async function () {
            await landmarketcontract.connect(signer1).buyLand(0, 200);
            var land = await infrastructurecontract.getLandCount(0);
            expect(land.toNumber()).to.equal(220);
        })

        it("infrastructure tests that destroy infrastructure function works crrectly", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 180);
            var infrastructureAmount = await infrastructurecontract.getInfrastructureCount(0);
            expect(infrastructureAmount.toNumber()).to.equal(200);
            await infrastructuremarketplace.connect(signer1).destroyInfrastructure(0, 20);
            var infrastructureAmount = await infrastructurecontract.getInfrastructureCount(0);
            expect(infrastructureAmount.toNumber()).to.equal(180);
        })

        it("infrastructure tests that destroy technology function works correctly", async function () {
            await technologymarketcontrat.connect(signer1).buyTech(0, 200);
            var tech = await infrastructurecontract.getTechnologyCount(0);
            expect(tech.toNumber()).to.equal(200);
            await technologymarketcontrat.connect(signer1).destroyTech(0, 20);
            var tech = await infrastructurecontract.getTechnologyCount(0);
            expect(tech.toNumber()).to.equal(180);
        })

        it("infrastructure tests that land can be destroyed by a nation owner", async function () {
            await landmarketcontract.connect(signer1).buyLand(0, 2980);
            var land = await infrastructurecontract.getLandCount(0);
            expect(land.toNumber()).to.equal(3000);
            await landmarketcontract.connect(signer1).destroyLand(0, 200);
            var land = await infrastructurecontract.getLandCount(0);
            expect(land.toNumber()).to.equal(2800);
        })

        it("infrastructure tests that land can be sold by a nation owner for a price", async function () {
            await landmarketcontract.connect(signer1).buyLand(0, 2980);
            var land = await infrastructurecontract.getLandCount(0);
            expect(land.toNumber()).to.equal(3000);
            var balance = await treasurycontract.checkBalance(0);
            // console.log(balance.toString(), "balance");
            expect(balance.toString()).to.equal("3000819919999999764984758272");
            await infrastructurecontract.connect(signer1).sellLand(0, 200);
            var land = await infrastructurecontract.getLandCount(0);
            expect(land.toNumber()).to.equal(2800);
            var balance = await treasurycontract.checkBalance(0);
            // console.log(balance.toString(), "balance");
            //increases by 20,000 WB
            expect(balance.toString()).to.equal("3000839919999999764984758272");
        })
        
        it("infrastructure tests that land can be sold by a nation owner for a higher price (300WB per mile) with rubber as a resource", async function () {
            await resourcescontract.mockResourcesForTesting(0, 13, 1)
            await landmarketcontract.connect(signer1).buyLand(0, 2980);
            var land = await infrastructurecontract.getLandCount(0);
            expect(land.toNumber()).to.equal(3000);
            var balance = await treasurycontract.checkBalance(0);
            // console.log(balance.toString(), "balance");
            expect(balance.toString()).to.equal("3000951039999999764984758272");
            await infrastructurecontract.connect(signer1).sellLand(0, 200);
            var land = await infrastructurecontract.getLandCount(0);
            expect(land.toNumber()).to.equal(2800);
            var balance = await treasurycontract.checkBalance(0);
            // console.log(balance.toString(), "balance");
            //increases by 60,000 WB
            expect(balance.toString()).to.equal("3001011039999999764984758272");
        })


        it("infrastructure tests setTaxRate() and getTaxRate() function", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 200);
            await keepercontract.incrementGameDay();
            var taxes : any = await taxescontract.getTaxesCollectible(0);
            var taxRate = await infrastructurecontract.getTaxRate(0);
            // console.log("taxes collectible = ", BigInt(taxes[1]/(10**18)));
            // console.log(" at a rate of ", taxRate.toNumber(), "%");
            await infrastructurecontract.connect(signer1).setTaxRate(0, 28);
            var taxes : any = await taxescontract.getTaxesCollectible(0);
            var taxRate = await infrastructurecontract.getTaxRate(0);
            // console.log("taxes collectible = ", BigInt(taxes[1]/(10**18)));
            // console.log(" at a rate of ", taxRate.toNumber(), "%");
        })

        it("infrastructure tests that tax rate can increase to 30% with social security", async function () {
            await expect(infrastructurecontract.connect(signer1).setTaxRate(0, 30)).to.be.revertedWith("cannot tax above maximum rate");
            await wonderscontract4.connect(signer1).buyWonder4(0, 1);
            await infrastructurecontract.connect(signer1).setTaxRate(0, 30);
            var taxRate = await infrastructurecontract.getTaxRate(0);
            expect(taxRate.toNumber()).to.equal(30);
        })

        it("infrastructure tests checkIfCollectionNeeded function works", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 200);
            var collectionNeeded = await infrastructurecontract.checkIfCollectionNeededToChangeRate(0);
            expect(collectionNeeded).to.equal(false);
        })

        it("infrastructure tests that toggleCollectionNeededToChangeRate() function works when taxes are collected", async function () {
            await militarycontract.connect(signer1).toggleWarPeacePreference(0);
            await taxescontract.connect(signer1).collectTaxes(0); 
            var collectionNeeded = await infrastructurecontract.checkIfCollectionNeededToChangeRate(0);
            expect(collectionNeeded).to.equal(false);   
        })
        
        it("infrastructure tests land modifiers", async function () {
            await landmarketcontract.connect(signer1).buyLand(0, 2980);
            var land = await infrastructurecontract.getLandCount(0);
            var areaOfInfluence = await infrastructurecontract.getAreaOfInfluence(0);
            // console.log("land", land.toNumber(), areaOfInfluence.toNumber(), "area");
            expect(land.toNumber()).to.equal(3000);
            await resourcescontract.mockResourcesForTesting(0, 2, 3);
            var land = await infrastructurecontract.getLandCount(0);
            var areaOfInfluence = await infrastructurecontract.getAreaOfInfluence(0);
            // console.log("land", land.toNumber(), areaOfInfluence.toNumber(), "area");
            expect(areaOfInfluence.toNumber()).to.equal(3450);
            await resourcescontract.mockResourcesForTesting(0, 13, 3);
            var land = await infrastructurecontract.getLandCount(0);
            var areaOfInfluence = await infrastructurecontract.getAreaOfInfluence(0);
            // console.log("land", land.toNumber(), areaOfInfluence.toNumber(), "area");
            expect(areaOfInfluence.toNumber()).to.equal(3600);
            await resourcescontract.mockResourcesForTesting(0, 15, 3);
            var land = await infrastructurecontract.getLandCount(0);
            var areaOfInfluence = await infrastructurecontract.getAreaOfInfluence(0);
            // console.log("land", land.toNumber(), areaOfInfluence.toNumber(), "area");
            expect(areaOfInfluence.toNumber()).to.equal(3240);
            await resourcescontract.mockResourcesForTesting(0, 8, 3);
            await technologymarketcontrat.connect(signer1).buyTech(0, 500);
            await wonderscontract1.connect(signer1).buyWonder1(0, 1);
            var land = await infrastructurecontract.getLandCount(0);
            var areaOfInfluence = await infrastructurecontract.getAreaOfInfluence(0);
            // console.log("land", land.toNumber(), areaOfInfluence.toNumber(), "area");
            expect(areaOfInfluence.toNumber()).to.equal(3450);
        })

        it("infrastructure tests that area of influence will increase by 5% with an accomodative government (1, 2, 6, 7, 9, 10)", async function () {
            await landmarketcontract.connect(signer1).buyLand(0, 2980);
            var areaOfInfluence = await infrastructurecontract.getAreaOfInfluence(0);
            // console.log(areaOfInfluence.toNumber(), "area");
            expect(areaOfInfluence.toNumber()).to.equal(3000);
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await countryparameterscontract.connect(signer1).setGovernment(0, 1)
            var areaOfInfluence = await infrastructurecontract.getAreaOfInfluence(0);
            // console.log(areaOfInfluence.toNumber(), "area");
            expect(areaOfInfluence.toNumber()).to.equal(3150);
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await countryparameterscontract.connect(signer1).setGovernment(0, 3)
            var areaOfInfluence = await infrastructurecontract.getAreaOfInfluence(0);
            // console.log(areaOfInfluence.toNumber(), "area");
            expect(areaOfInfluence.toNumber()).to.equal(3000);
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await keepercontract.incrementGameDay()
            await countryparameterscontract.connect(signer1).setGovernment(0, 9)
            var areaOfInfluence = await infrastructurecontract.getAreaOfInfluence(0);
            // console.log(areaOfInfluence.toNumber(), "area");
            expect(areaOfInfluence.toNumber()).to.equal(3150);
        })

        it("infrastructure tests population modifiers", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 980);
            var population = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log(population.toNumber());
            expect(population.toNumber()).to.equal(8400);
            await resourcescontract.mockResourcesForTesting(0, 0, 1)
            var population = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log(population.toNumber());
            expect(population.toNumber()).to.equal(8400);
            await resourcescontract.mockResourcesForTesting(0, 0, 3)
            var population = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log(population.toNumber());
            expect(population.toNumber()).to.equal(8640);
            await resourcescontract.mockResourcesForTesting(0, 0, 12)
            var population = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log(population.toNumber());
            expect(population.toNumber()).to.equal(8320);
            await resourcescontract.mockResourcesForTesting(0, 0, 16)
            var population = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log(population.toNumber());
            expect(population.toNumber()).to.equal(8240);
            await resourcescontract.mockResourcesForTesting(0, 0, 19)
            var population = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log(population.toNumber());
            expect(population.toNumber()).to.equal(8640);
            await billscontract.connect(signer1).payBills(0)
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5)
            var population = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log(population.toNumber());
            expect(population.toNumber()).to.equal(8480);
            await improvementscontract1.connect(signer1).buyImprovement1(4, 0, 9)
            var population = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log(population.toNumber());
            expect(population.toNumber()).to.equal(9120);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 5)
            var population = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log(population.toNumber());
            expect(population.toNumber()).to.equal(9600);
            await wonderscontract1.connect(signer1).buyWonder1(0, 4)
            var population = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log(population.toNumber());
            expect(population.toNumber()).to.equal(9840);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4)
            var population = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log(population.toNumber());
            expect(population.toNumber()).to.equal(10240);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 15000);
            await wonderscontract4.connect(signer1).buyWonder4(0, 6);
            var population = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log(population.toNumber());
            expect(population.toNumber()).to.equal(167680);
            await wonderscontract3.connect(signer1).buyWonder3(0, 3);
            var population = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log(population.toNumber());
            expect(population.toNumber()).to.equal(174080);
        })

        it("infrastructure tests that affluent population will increase population count by 5%", async function () {
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
            const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
            const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
            for (const log of event1Logs) {
                const requestIdReturn = log.args.requestId;
                // console.log(Number(requestIdReturn), "requestIdReturn for Event");
                if (requestIdReturn == 6) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                    let resources3 = await resourcescontract.getPlayerResources(2);
                    // console.log("resources 3", resources3[0].toNumber(), resources3[1].toNumber());
                } else if (requestIdReturn == 8) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                    let resources3 = await resourcescontract.getPlayerResources(3);
                    // console.log("resources 4", resources3[0].toNumber(), resources3[1].toNumber());
                } else if (requestIdReturn == 10) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                    let resources3 = await resourcescontract.getPlayerResources(4);
                    // console.log("resources 5", resources3[0].toNumber(), resources3[1].toNumber());
                } else if (requestIdReturn == 12) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                    let resources3 = await resourcescontract.getPlayerResources(5);
                    // console.log("resources 6", resources3[0].toNumber(), resources3[1].toNumber());
                } else if (requestIdReturn == 14) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                    let resources3 = await resourcescontract.getPlayerResources(6);
                    // console.log("resources 7", resources3[0].toNumber(), resources3[1].toNumber());
                }
            }
            const population0 = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log("population", population0.toNumber());
            expect(population0.toNumber()).to.equal(168);
            await resourcescontract.mockResourcesForTesting(0, 6, 14)
            await resourcescontract.mockResourcesForTesting(1, 5, 2)
            await resourcescontract.mockResourcesForTesting(2, 3, 4)
            await resourcescontract.mockResourcesForTesting(3, 20, 7)
            await resourcescontract.mockResourcesForTesting(4, 8, 9)
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer1).proposeTrade(4, 0);
            await resourcescontract.connect(signer2).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            var affluentpopulation = await bonusresourcescontract.viewAffluentPopulation(0);
            expect(affluentpopulation).to.equal(true);
            const population = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log("population", population.toNumber());
            expect(population.toNumber()).to.equal(180);
        })

        it("infrastructure tests that agricultural development program will increase base population count from 8 * inf to 9 * inf", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
            await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            const population = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log("population", population.toNumber());
            expect(population.toNumber()).to.equal(84168);
            await wonderscontract1.connect(signer1).buyWonder1(0, 1);
            var isWonder = await wonderscontract1.getAgriculturalDevelopmentProgram(0);
            expect(isWonder).to.equal(true); 
            const population2 = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log("population", population2.toNumber());
            expect(population2.toNumber()).to.equal(94689);

        })

        it("infrastructure tests that taxable population wont go negative or overflow and reports defecit", async function () {
            //this can happen if there is an excess of soldiers when infrastructure gets destoryed
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 980);
            await forcescontract.connect(signer1).buySoldiers(2000, 0);
            const taxablePopulation = await infrastructurecontract.getTaxablePopulationCount(0);
            // console.log("taxable population", taxablePopulation[0].toNumber());
            expect(taxablePopulation[0].toNumber()).to.equal(6212);
            // console.log("citizen defecit", taxablePopulation[1].toNumber());
            expect(taxablePopulation[1].toNumber()).to.equal(0);
            await infrastructuremarketplace.connect(signer1).destroyInfrastructure(0, 1000);
            const taxablePopulation2 = await infrastructurecontract.getTaxablePopulationCount(0);
            // console.log("taxable population", taxablePopulation2[0].toNumber());
            expect(taxablePopulation2[0].toNumber()).to.equal(0);
            // console.log("citizen defecit", taxablePopulation2[1].toNumber());
            expect(taxablePopulation2[1].toNumber()).to.equal(2020);
        })
    })

    describe("Affects on Infrastructure Contract from Military Operations", function () {
        it("infrastructure2 tests that inf, tech & land gets decreased from a nuke strike (attack1)", async function () {
            await militarycontract.connect(signer1).toggleWarPeacePreference(0)
            await militarycontract.connect(signer2).toggleWarPeacePreference(1)
            await warcontract.connect(signer1).declareWar(0, 1)
            await billscontract.connect(signer2).payBills(1)
            await resourcescontract.connect(signer0).mockResourcesForTesting(0, 17, 1);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 9980)
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000)
            await landmarketcontract.connect(signer1).buyLand(0, 9980)
            await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 9980)
            await technologymarketcontrat.connect(signer2).buyTech(1, 10000)
            await landmarketcontract.connect(signer2).buyLand(1, 9980)
            await wonderscontract2.connect(signer1).buyWonder2(0, 8);
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await nukecontract.connect(signer1).launchNuke(0, 0, 1, 1)
            const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
            const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
            for (const log of event1Logs) {
                const requestIdReturn = log.args.requestId;
                // console.log(Number(requestIdReturn), "requestIdReturn for Event");
                if (requestIdReturn == 5) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, nukecontract.address);
                }
            }
            const tech = await infrastructurecontract.getTechnologyCount(1);
            // console.log("tech", tech.toNumber());
            expect(tech.toNumber()).to.equal(9950);
            const land = await infrastructurecontract.getLandCount(1);
            // console.log("land", land.toNumber());
            expect(land.toNumber()).to.equal(9850);
            const inf = await infrastructurecontract.getInfrastructureCount(1);
            // console.log("inf", inf.toNumber());
            expect(inf.toNumber()).to.equal(9850);  
        })

        it("infrastructure2 tests that inf, tech & land gets decreased from a nuke strike (attack2 infrastructure)", async function () {
            await militarycontract.connect(signer1).toggleWarPeacePreference(0)
            await militarycontract.connect(signer2).toggleWarPeacePreference(1)
            await warcontract.connect(signer1).declareWar(0, 1)
            await billscontract.connect(signer2).payBills(1)
            await resourcescontract.connect(signer0).mockResourcesForTesting(0, 17, 1);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000)
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000)
            await landmarketcontract.connect(signer1).buyLand(0, 9980)
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await wonderscontract4.connect(signer1).buyWonder4(0, 7);
            await wonderscontract1.connect(signer1).buyWonder1(0, 5);
            var isWonder = await wonderscontract1.getEmpWeaponization(0);
            expect(isWonder).to.equal(true); 
            await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 9980)
            await technologymarketcontrat.connect(signer2).buyTech(1, 10000)
            await landmarketcontract.connect(signer2).buyLand(1, 9980)
            await wonderscontract2.connect(signer1).buyWonder2(0, 8);
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await nukecontract.connect(signer1).launchNuke(0, 0, 1, 2)
            const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
            const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
            for (const log of event1Logs) {
                const requestIdReturn = log.args.requestId;
                // console.log(Number(requestIdReturn), "requestIdReturn for Event");
                if (requestIdReturn == 5) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, nukecontract.address);
                }
            }
            const tech = await infrastructurecontract.getTechnologyCount(1);
            // console.log("tech", tech.toNumber());
            //normally 9950
            expect(tech.toNumber()).to.equal(9970);
            const land = await infrastructurecontract.getLandCount(1);
            // console.log("land", land.toNumber());
            //normally 9850
            expect(land.toNumber()).to.equal(9900);
            const inf = await infrastructurecontract.getInfrastructureCount(1);
            // console.log("inf", inf.toNumber());
            //normally 9850
            expect(inf.toNumber()).to.equal(9800);  
        })

        it("infrastructure2 tests that inf, tech & land gets decreased from a nuke strike (attack3 land)", async function () {
            await militarycontract.connect(signer1).toggleWarPeacePreference(0)
            await militarycontract.connect(signer2).toggleWarPeacePreference(1)
            await warcontract.connect(signer1).declareWar(0, 1)
            await billscontract.connect(signer2).payBills(1)
            await resourcescontract.connect(signer0).mockResourcesForTesting(0, 17, 1);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000)
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000)
            await landmarketcontract.connect(signer1).buyLand(0, 9980)
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await wonderscontract4.connect(signer1).buyWonder4(0, 7);
            await wonderscontract1.connect(signer1).buyWonder1(0, 5);
            var isWonder = await wonderscontract1.getEmpWeaponization(0);
            expect(isWonder).to.equal(true); 
            await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 9980)
            await technologymarketcontrat.connect(signer2).buyTech(1, 10000)
            await landmarketcontract.connect(signer2).buyLand(1, 9980)
            await wonderscontract2.connect(signer1).buyWonder2(0, 8);
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await nukecontract.connect(signer1).launchNuke(0, 0, 1, 3)
            const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
            const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
            for (const log of event1Logs) {
                const requestIdReturn = log.args.requestId;
                // console.log(Number(requestIdReturn), "requestIdReturn for Event");
                if (requestIdReturn == 5) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, nukecontract.address);
                }
            }
            const tech = await infrastructurecontract.getTechnologyCount(1);
            // console.log("tech", tech.toNumber());
            //normally 9950
            expect(tech.toNumber()).to.equal(9970);
            const land = await infrastructurecontract.getLandCount(1);
            // console.log("land", land.toNumber());
            //normally 9850
            expect(land.toNumber()).to.equal(9800);
            const inf = await infrastructurecontract.getInfrastructureCount(1);
            // console.log("inf", inf.toNumber());
            //normally 9850
            expect(inf.toNumber()).to.equal(9900);  
        })

        it("infrastructure2 tests that inf, tech & land gets decreased from a nuke strike (attack4 tech)", async function () {
            await militarycontract.connect(signer1).toggleWarPeacePreference(0)
            await militarycontract.connect(signer2).toggleWarPeacePreference(1)
            await warcontract.connect(signer1).declareWar(0, 1)
            await billscontract.connect(signer2).payBills(1)
            await resourcescontract.connect(signer0).mockResourcesForTesting(0, 17, 1);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000)
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000)
            await landmarketcontract.connect(signer1).buyLand(0, 9980)
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await wonderscontract4.connect(signer1).buyWonder4(0, 7);
            await wonderscontract1.connect(signer1).buyWonder1(0, 5);
            var isWonder = await wonderscontract1.getEmpWeaponization(0);
            expect(isWonder).to.equal(true); 
            await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 9980)
            await technologymarketcontrat.connect(signer2).buyTech(1, 10000)
            await landmarketcontract.connect(signer2).buyLand(1, 9980)
            await wonderscontract2.connect(signer1).buyWonder2(0, 8);
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await nukecontract.connect(signer1).launchNuke(0, 0, 1, 4)
            const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
            const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
            for (const log of event1Logs) {
                const requestIdReturn = log.args.requestId;
                // console.log(Number(requestIdReturn), "requestIdReturn for Event");
                if (requestIdReturn == 5) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, nukecontract.address);
                }
            }
            const tech = await infrastructurecontract.getTechnologyCount(1);
            // console.log("tech", tech.toNumber());
            //normally 9950
            expect(tech.toNumber()).to.equal(9930);
            const land = await infrastructurecontract.getLandCount(1);
            // console.log("land", land.toNumber());
            //normally 9850
            expect(land.toNumber()).to.equal(9900);
            const inf = await infrastructurecontract.getInfrastructureCount(1);
            // console.log("inf", inf.toNumber());
            //normally 9850
            expect(inf.toNumber()).to.equal(9900);  
        })

        it("infrastructure2 tests that inf, tech & land gets decreased by a percentage when below max amounts", async function () {
            await militarycontract.connect(signer1).toggleWarPeacePreference(0)
            await militarycontract.connect(signer2).toggleWarPeacePreference(1)
            await warcontract.connect(signer1).declareWar(0, 1)
            await billscontract.connect(signer2).payBills(1)
            await resourcescontract.connect(signer0).mockResourcesForTesting(0, 17, 1);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 9980)
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000)
            await landmarketcontract.connect(signer1).buyLand(0, 9980)
            await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 100)
            await technologymarketcontrat.connect(signer2).buyTech(1, 100)
            await landmarketcontract.connect(signer2).buyLand(1, 100)
            await wonderscontract2.connect(signer1).buyWonder2(0, 8);
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await nukecontract.connect(signer1).launchNuke(0, 0, 1, 1)
            const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
            const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
            for (const log of event1Logs) {
                const requestIdReturn = log.args.requestId;
                // console.log(Number(requestIdReturn), "requestIdReturn for Event");
                if (requestIdReturn == 5) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, nukecontract.address);
                }
            }
            const tech = await infrastructurecontract.getTechnologyCount(1);
            // console.log("tech", tech.toNumber());
            expect(tech.toNumber()).to.equal(65);
            const land = await infrastructurecontract.getLandCount(1);
            // console.log("land", land.toNumber());
            expect(land.toNumber()).to.equal(78);
            const inf = await infrastructurecontract.getInfrastructureCount(1);
            // console.log("inf", inf.toNumber());
            expect(inf.toNumber()).to.equal(78);  
        })

        it("infrastructure2 tests that inf damage gets decreased less when defender has bunkers", async function () {
            await militarycontract.connect(signer1).toggleWarPeacePreference(0)
            await militarycontract.connect(signer2).toggleWarPeacePreference(1)
            await warcontract.connect(signer1).declareWar(0, 1)
            await billscontract.connect(signer2).payBills(1)
            await resourcescontract.connect(signer0).mockResourcesForTesting(0, 17, 1);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 9980)
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000)
            await landmarketcontract.connect(signer1).buyLand(0, 9980)
            await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 1000)
            await technologymarketcontrat.connect(signer2).buyTech(1, 1000)
            await landmarketcontract.connect(signer2).buyLand(1, 1000)
            await improvementscontract1.connect(signer2).buyImprovement1(3, 1, 3)
            await improvementscontract1.connect(signer2).buyImprovement1(3, 1, 6)
            await wonderscontract2.connect(signer1).buyWonder2(0, 8);
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await nukecontract.connect(signer1).launchNuke(0, 0, 1, 1)
            const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
            const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
            for (const log of event1Logs) {
                const requestIdReturn = log.args.requestId;
                // console.log(Number(requestIdReturn), "requestIdReturn for Event");
                if (requestIdReturn == 5) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, nukecontract.address);
                }
            }
            const tech = await infrastructurecontract.getTechnologyCount(1);
            // console.log("tech", tech.toNumber());
            expect(tech.toNumber()).to.equal(950);
            const land = await infrastructurecontract.getLandCount(1);
            // console.log("land", land.toNumber());
            expect(land.toNumber()).to.equal(870);
            const inf = await infrastructurecontract.getInfrastructureCount(1);
            // console.log("inf", inf.toNumber());
            expect(inf.toNumber()).to.equal(885);
        })

        it("infrastructure2 tests that inf damage gets increased when attacker has munitions factories", async function () {
            await militarycontract.connect(signer1).toggleWarPeacePreference(0)
            await militarycontract.connect(signer2).toggleWarPeacePreference(1)
            await warcontract.connect(signer1).declareWar(0, 1)
            await billscontract.connect(signer2).payBills(1)
            await resourcescontract.connect(signer0).mockResourcesForTesting(0, 17, 1);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 9980)
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000)
            await landmarketcontract.connect(signer1).buyLand(0, 9980)
            await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 1000)
            await technologymarketcontrat.connect(signer2).buyTech(1, 1000)
            await landmarketcontract.connect(signer2).buyLand(1, 1000)
            await improvementscontract4.connect(signer1).buyImprovement4(5, 0, 2)
            await wonderscontract2.connect(signer1).buyWonder2(0, 8);
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await keepercontract.connect(signer0).incrementGameDay()
            await missilescontract.connect(signer1).buyNukes(0)
            await nukecontract.connect(signer1).launchNuke(0, 0, 1, 1)
            const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
            const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
            for (const log of event1Logs) {
                const requestIdReturn = log.args.requestId;
                // console.log(Number(requestIdReturn), "requestIdReturn for Event");
                if (requestIdReturn == 5) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, nukecontract.address);
                }
            }
            const tech = await infrastructurecontract.getTechnologyCount(1);
            // console.log("tech", tech.toNumber());
            expect(tech.toNumber()).to.equal(950);
            const land = await infrastructurecontract.getLandCount(1);
            // console.log("land", land.toNumber());
            expect(land.toNumber()).to.equal(870);
            const inf = await infrastructurecontract.getInfrastructureCount(1);
            // console.log("inf", inf.toNumber());
            expect(inf.toNumber()).to.equal(845);
        })

        it("infrastructure2 tests that a successful cruise missile strike will decrease tech", async function () {
            await militarycontract.connect(signer1).toggleWarPeacePreference(0)
            await militarycontract.connect(signer2).toggleWarPeacePreference(1)
            await warcontract.connect(signer1).declareWar(0, 1)
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 9980)
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000)
            await landmarketcontract.connect(signer1).buyLand(0, 9980)
            await technologymarketcontrat.connect(signer2).buyTech(1, 1000)
            await missilescontract.connect(signer1).buyCruiseMissiles(4, 0)
            await cruisemissilecontract.connect(signer1).launchCruiseMissileAttack(0, 1, 0);
            const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
            const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
            for (const log of event1Logs) {
                const requestIdReturn = log.args.requestId;
                // console.log(Number(requestIdReturn), "requestIdReturn for Event");
                if (requestIdReturn == 5) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, cruisemissilecontract.address);
                }
            }
            const tech = await infrastructurecontract.getTechnologyCount(1);
            // console.log("tech", tech.toNumber());
            expect(tech.toNumber()).to.equal(994);
        }) 

        it("infrastructure2 tests that a successful cruise missile strike will decrease infrastructure", async function () {
            await militarycontract.connect(signer1).toggleWarPeacePreference(0)
            await militarycontract.connect(signer2).toggleWarPeacePreference(1)
            await warcontract.connect(signer1).declareWar(0, 1)
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 9980)
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000)
            await landmarketcontract.connect(signer1).buyLand(0, 9980)
            await technologymarketcontrat.connect(signer2).buyTech(1, 1000)
            await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 1000)
            await missilescontract.connect(signer1).buyCruiseMissiles(4, 0)
            await cruisemissilecontract.connect(signer1).launchCruiseMissileAttack(0, 1, 0);
            await cruisemissilecontract.connect(signer1).launchCruiseMissileAttack(0, 1, 0);
            await keepercontract.connect(signer0).incrementGameDay()
            await cruisemissilecontract.connect(signer1).launchCruiseMissileAttack(0, 1, 0);
            const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
            const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
            for (const log of event1Logs) {
                const requestIdReturn = log.args.requestId;
                // console.log(Number(requestIdReturn), "requestIdReturn for Event");
                if (requestIdReturn == 7) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, cruisemissilecontract.address);
                }
            }
            const inf = await infrastructurecontract.getInfrastructureCount(1);
            // console.log("inf", inf.toNumber());
            // 1020 -> 1013
            expect(inf.toNumber()).to.equal(1013);
        })

        it("infrastructure2 tests bunkers will decrease infrastructure damage from cruise missiles", async function () {
            await militarycontract.connect(signer1).toggleWarPeacePreference(0)
            await militarycontract.connect(signer2).toggleWarPeacePreference(1)
            await warcontract.connect(signer1).declareWar(0, 1)
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 9980)
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000)
            await landmarketcontract.connect(signer1).buyLand(0, 9980)
            await technologymarketcontrat.connect(signer2).buyTech(1, 1000)
            await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 1000)
            await improvementscontract1.connect(signer2).buyImprovement1(3, 1, 3)
            await improvementscontract1.connect(signer2).buyImprovement1(3, 1, 6)
            await missilescontract.connect(signer1).buyCruiseMissiles(4, 0)
            await cruisemissilecontract.connect(signer1).launchCruiseMissileAttack(0, 1, 0);
            await cruisemissilecontract.connect(signer1).launchCruiseMissileAttack(0, 1, 0);
            await keepercontract.connect(signer0).incrementGameDay()
            await cruisemissilecontract.connect(signer1).launchCruiseMissileAttack(0, 1, 0);
            const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
            const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
            for (const log of event1Logs) {
                const requestIdReturn = log.args.requestId;
                // console.log(Number(requestIdReturn), "requestIdReturn for Event");
                if (requestIdReturn == 7) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, cruisemissilecontract.address);
                }
            }
            const inf = await infrastructurecontract.getInfrastructureCount(1);
            console.log("inf", inf.toNumber());
            // 1020 -> 1016 (3 more than above test without 3 bunkers)
            expect(inf.toNumber()).to.equal(1013);
        })

        it("infrastructure2 tests infrastructure damage will not overflow when theres low infrastructure already in a cruise missile attack", async function () {
            await militarycontract.connect(signer1).toggleWarPeacePreference(0)
            await militarycontract.connect(signer2).toggleWarPeacePreference(1)
            await warcontract.connect(signer1).declareWar(0, 1)
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 9980)
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000)
            await landmarketcontract.connect(signer1).buyLand(0, 9980)
            await technologymarketcontrat.connect(signer2).buyTech(1, 1000)
            await infrastructuremarketplace.connect(signer2).destroyInfrastructure(1, 18)
            await missilescontract.connect(signer1).buyCruiseMissiles(4, 0)
            await cruisemissilecontract.connect(signer1).launchCruiseMissileAttack(0, 1, 0);
            await cruisemissilecontract.connect(signer1).launchCruiseMissileAttack(0, 1, 0);
            await keepercontract.connect(signer0).incrementGameDay()
            await cruisemissilecontract.connect(signer1).launchCruiseMissileAttack(0, 1, 0);
            const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
            const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
            for (const log of event1Logs) {
                const requestIdReturn = log.args.requestId;
                // console.log(Number(requestIdReturn), "requestIdReturn for Event");
                if (requestIdReturn == 7) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, cruisemissilecontract.address);
                }
            }
            const inf = await infrastructurecontract.getInfrastructureCount(1);
            console.log("inf", inf.toNumber());
            expect(inf.toNumber()).to.equal(0);
        })    
    })

    describe("Infrastructure Contract / Sending Aid", function () {
        it("infrastructure3 tests that sending aid package with tech will send tech to recipient", async function () {
            await technologymarketcontrat.connect(signer1).buyTech(0, 100);
            var tech0 = await infrastructurecontract.getTechnologyCount(0);
            expect(tech0.toNumber()).to.equal(100);
            var tech1 = await infrastructurecontract.getTechnologyCount(1);
            expect(tech1.toNumber()).to.equal(0);
            await aidcontract.connect(signer1).proposeAid(0, 1, 100, 0, 0);
            await aidcontract.connect(signer2).acceptProposal(0);
            var tech0 = await infrastructurecontract.getTechnologyCount(0);
            expect(tech0.toNumber()).to.equal(0);
            var tech1 = await infrastructurecontract.getTechnologyCount(1);
            expect(tech1.toNumber()).to.equal(100);
        })

        it("infrastructure3 tests that accept aid function will revert when there is not enought tech to send", async function () {
            await technologymarketcontrat.connect(signer1).buyTech(0, 100);
            await aidcontract.connect(signer1).proposeAid(0, 1, 100, 0, 0);
            await technologymarketcontrat.connect(signer1).destroyTech(0, 50);
            await expect(aidcontract.connect(signer2).acceptProposal(0)).to.be.revertedWith("not enough tech for this proposal");
        })
    })
})