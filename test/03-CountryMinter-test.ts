import { expect } from "chai"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
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
    NavalBlockadeContract,
    BreakBlocadeContract,
    NavalAttackContract,
    NukeContract,
    ResourcesContract,
    SenateContract,
    SpyOperationsContract,
    TaxesContract,
    TechnologyMarketContract,
    TreasuryContract,
    WarContract,
    WondersContract1,
    WondersContract2,
    WondersContract3,
    WondersContract4
} from "../typechain-types"

describe("CountryMinter", function () {
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
    let navalblockadecontract: NavalBlockadeContract
    let breakblockadecontract: BreakBlocadeContract
    let navalattackcontract: NavalAttackContract
    let nukecontract: NukeContract
    let resourcescontract: ResourcesContract
    let senatecontract: SenateContract
    let spyoperationscontract: SpyOperationsContract
    let taxescontract: TaxesContract
    let technologymarketcontrat: TechnologyMarketContract
    let treasurycontract: TreasuryContract
    let warcontract: WarContract
    let wonderscontract1: WondersContract1
    let wonderscontract2: WondersContract2
    let wonderscontract3: WondersContract3
    let wonderscontract4: WondersContract4
    let signer0: SignerWithAddress
    let signer1: SignerWithAddress
    let signers: SignerWithAddress[]
    let addrs

    beforeEach(async function () {

        signers = await ethers.getSigners();
        signer0 = signers[0];
        signer1 = signers[1];

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
        //console.log(`AidContract deployed tp ${aidcontract.address}`)
            //countryminter
            //treasury
            //forces
            //infrastructure
            //keeper
            //wonder1
        
        const AirBattleContract = await ethers.getContractFactory("AirBattleContract")
        airbattlecontract = await AirBattleContract.deploy() as AirBattleContract
        await airbattlecontract.deployed()
        //console.log(`AirBattleContract deployed tp ${airbattlecontract.address}`)
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

        const BillsContract = await ethers.getContractFactory("BillsContract")
        billscontract = await BillsContract.deploy() as BillsContract
        await billscontract.deployed()
        //console.log(`BillsContract deployed tp ${billscontract.address}`)
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
            
        const Bombers = await ethers.getContractFactory("BombersContract")
        bomberscontract = await Bombers.deploy() as BombersContract
        await bomberscontract.deployed()
            //address _countryMinter,
            //address _bombersMarket,
            //address _airBattle,
            //address _treasuryAddress,
            //address _fightersAddress,
            //address _infrastructure,
            //address _war
            
        const BombersMarketplace1 = await ethers.getContractFactory("BombersMarketplace1")
        bombersmarketplace1 = await Bombers.deploy() as BombersMarketplace1
        await bombersmarketplace1.deployed()
            //address _countryMinter,
            //address _bombers1,
            //address _fighters,
            //address _infrastructure,
            //address _treasury
            
            
        const BombersMarketplace2 = await ethers.getContractFactory("BombersMarketplace2")
        bombersmarketplace2 = await Bombers.deploy() as BombersMarketplace2
        await bombersmarketplace2.deployed()
            //address _countryMinter,
            //address _bombers1,
            //address _fighters,
            //address _infrastructure,
            //address _treasury

        const CountryMinter = await ethers.getContractFactory("CountryMinter")
        countryminter = await CountryMinter.deploy()  as CountryMinter
        await countryminter.deployed()

        const CountryParameters = await ethers.getContractFactory("CountryParametersContract")
        countryparameterscontract = await CountryParameters.deploy() as CountryParametersContract
        await countryparameterscontract.deployed()
            // spyAddress  

        const CrimeContract = await ethers.getContractFactory("CrimeContract")
        crimecontract = await CrimeContract.deploy() as CrimeContract
        await crimecontract.deployed()
            // address _infrastructure,
            // address _improvements1,
            // address _improvements2,
            // address _improvements3,
            // address _parameters  

        const CruiseMissileContract = await ethers.getContractFactory("CruiseMissileContract")
        cruisemissileconract = await CruiseMissileContract.deploy() as CruiseMissileContract
        await cruisemissileconract.deployed()
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

        const EnvironmentContract = await ethers.getContractFactory("EnvironmentContract")
        environmentcontract = await EnvironmentContract.deploy() as EnvironmentContract
        await environmentcontract.deployed()
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
    
        const FightersContract = await ethers.getContractFactory("FightersContract")
        fighterscontract = await FightersContract.deploy() as FightersContract
        await fighterscontract.deployed()
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
    
        const FighterLosses = await ethers.getContractFactory("FighterLosses")
        fighterlosses = await FighterLosses.deploy() as FighterLosses
        await fighterlosses.deployed()
            // fighters
            // air batle
    
        const FightersMarketplace1 = await ethers.getContractFactory("FightersMarketplace1")
        fightersmarketplace1 = await FightersMarketplace1.deploy() as FightersMarketplace1
        await fightersmarketplace1.deployed()
            // address _countryMinter,
            // address _bombers,
            // address _fighters,
            // address _treasury,
            // address _infrastructure,
            // address _resources,
            // address _improvements1,
            // address _wonders4
    
        const FightersMarketplace2 = await ethers.getContractFactory("FightersMarketplace2")
        fightersmarketplace2 = await FightersMarketplace2.deploy() as FightersMarketplace2
        await fightersmarketplace2.deployed()
            // address _countryMinter,
            // address _bombers,
            // address _fighters,
            // address _treasury,
            // address _infrastructure,
            // address _resources,
            // address _improvements1
            
        const ForcesContract = await ethers.getContractFactory("ForcesContract")
        forcescontract = await ForcesContract.deploy() as ForcesContract
        await forcescontract.deployed()
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

        const MissilesContract = await ethers.getContractFactory("MissilesContract")
        missilescontract = await MissilesContract.deploy() as MissilesContract
        await missilescontract.deployed()
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

        const GroundBattleContract = await ethers.getContractFactory("GroundBattleContract")
        groundbattlecontract = await GroundBattleContract.deploy() as GroundBattleContract
        await groundbattlecontract.deployed()
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
        
        const ImprovementsContract1 = await ethers.getContractFactory("ImprovementsContract1")
        improvementscontract1 = await ImprovementsContract1.deploy() as ImprovementsContract1
        await improvementscontract1.deployed()
            // address _treasury,
            // address _improvements2,
            // address _improvements3,
            // address _improvements4,
            // address _navy
    
        const ImprovementsContract2 = await ethers.getContractFactory("ImprovementsContract2")
        improvementscontract2 = await ImprovementsContract2.deploy() as ImprovementsContract2
        await improvementscontract2.deployed()
            // address _treasury,
            // address _forces,
            // address _improvements1
    
        const ImprovementsContract3 = await ethers.getContractFactory("ImprovementsContract3")
        improvementscontract3 = await ImprovementsContract3.deploy() as ImprovementsContract3
        await improvementscontract3.deployed()
        // console.log(`Improvements deployed to ${improvements3.address}`) 
    
        const ImprovementsContract4 = await ethers.getContractFactory("ImprovementsContract4")
        improvementscontract4 = await ImprovementsContract4.deploy() as ImprovementsContract4
        await improvementscontract4.deployed()
            // treasury
            // improvements 1
            // improvements 2
            // forces
        
        const InfrastructureContract = await ethers.getContractFactory("InfrastructureContract")
        infrastructurecontract = await InfrastructureContract.deploy() as InfrastructureContract
        await infrastructurecontract.deployed()
        // console.log(`Infrastructure deployed to ${infrastructure.address}`) 
        
        const InfrastructureMarketplace = await ethers.getContractFactory("InfrastructureMarketplace")
        infrastructuremarketplace = await InfrastructureMarketplace.deploy() as InfrastructureMarketContract
        await infrastructuremarketplace.deployed()
        // console.log(`Infrastructure deployed to ${infrastructure.address}`) 

        const KeeperContract = await ethers.getContractFactory("KeeperContract")
        keepercontract = await KeeperContract.deploy() as KeeperContract
        await keepercontract.deployed()
        // console.log(`Treasury deployed to ${treasury.address}`) 
        
        const LandMarketContract = await ethers.getContractFactory("LandMarketContract")
        landmarketcontract = await LandMarketContract.deploy() as LandMarketContract
        await landmarketcontract.deployed()
        // console.log(`Treasury deployed to ${treasury.address}`) 

        const MilitaryContract = await ethers.getContractFactory("MilitaryContract")
        militarycontract = await MilitaryContract.deploy() as MilitaryContract
        await militarycontract.deployed()
        // console.log(`Treasury deployed to ${treasury.address}`) 

        const NationStrengthContract = await ethers.getContractFactory("NationStrengthContract")
        nationstrengthcontract = await NationStrengthContract.deploy() as NationStrengthContract
        await nationstrengthcontract.deployed()
        // console.log(`Treasury deployed to ${treasury.address}`) 

        const NavyContract = await ethers.getContractFactory("NavyContract")
        navycontract = await NavyContract.deploy() as NavyContract
        await navycontract.deployed()
        // console.log(`Navy deployed to ${navy.address}`) 
        
        const NavalActionsContract = await ethers.getContractFactory("NavalActionsContract")
        navalactionscontract = await NavalActionsContract.deploy() as NavalActionsContract
        await navalactionscontract.deployed()
        // console.log(`Navy deployed to ${navy.address}`) 
        
        const NavalBlockadeContract = await ethers.getContractFactory("NavalBlockadeContract")
        navalblockadecontract = await NavalBlockadeContract.deploy() as NavalBlockadeContract
        await navalblockadecontract.deployed()
        // console.log(`Navy deployed to ${navy.address}`) 
        
        const BreakBlocadeContract = await ethers.getContractFactory("BreakBlocadeContract")
        breakblockadecontract = await BreakBlocadeContract.deploy() as BreakBlocadeContract
        await breakblockadecontract.deployed()
        // console.log(`Navy deployed to ${navy.address}`) 
        
        const NavalAttackContract = await ethers.getContractFactory("NavalAttackContract")
        navalattackcontract = await NavalAttackContract.deploy() as NavalAttackContract
        await navalattackcontract.deployed()
        // console.log(`Navy deployed to ${navy.address}`) 
        
        const NukeContract = await ethers.getContractFactory("NukeContract")
        nukecontract = await NukeContract.deploy() as NukeContract
        await nukecontract.deployed()
        // console.log(`Navy deployed to ${navy.address}`) 
        
        const ResourcesContract = await ethers.getContractFactory("ResourcesContract")
        resourcescontract = await ResourcesContract.deploy() as ResourcesContract
        await resourcescontract.deployed()
        // console.log(`Navy deployed to ${navy.address}`) 
        
        const SenateContract = await ethers.getContractFactory("SenateContract")
        senatecontract = await SenateContract.deploy() as SenateContract
        await senatecontract.deployed()
        // console.log(`Navy deployed to ${navy.address}`) 
        
        const SpyOperationsContract = await ethers.getContractFactory("SpyOperationsContract")
        spyoperationscontract = await SpyOperationsContract.deploy() as SpyOperationsContract
        await spyoperationscontract.deployed()
        // console.log(`Navy deployed to ${navy.address}`) 

        const TaxesContract = await ethers.getContractFactory("TaxesContract")
        taxescontract = await TaxesContract.deploy() as TaxesContract
        await taxescontract.deployed()
        // console.log(`Treasury deployed to ${treasury.address}`) 

        const TechnologyMarketContract = await ethers.getContractFactory("TechnologyMarketContract")
        technologymarketcontrat = await TechnologyMarketContract.deploy() as TechnologyMarketContract
        await technologymarketcontrat.deployed()
        // console.log(`Treasury deployed to ${treasury.address}`) 

        const TreasuryContract = await ethers.getContractFactory("TreasuryContract")
        treasurycontract = await TreasuryContract.deploy() as TreasuryContract
        await treasurycontract.deployed()
        // console.log(`Treasury deployed to ${treasury.address}`) 
        
        const WarContract = await ethers.getContractFactory("WarContract")
        warcontract = await WarContract.deploy() as WarContract
        await warcontract.deployed()
        // console.log(`Resources deployed to ${resources.address}`) 

        const Wonders1 = await ethers.getContractFactory("WondersContract1")
        wonderscontract1 = await Wonders1.deploy() as WondersContract1
        await wonderscontract1.deployed()
        // console.log(`Wonders deployed to ${wonders1.address}`) 
  
        const Wonders2 = await ethers.getContractFactory("WondersContract2")
        wonderscontract2 = await Wonders2.deploy() as WondersContract2
        await wonderscontract2.deployed()
        // console.log(`Wonders deployed to ${wonders2.address}`) 
    
        const Wonders3 = await ethers.getContractFactory("WondersContract3")
        wonderscontract3 = await Wonders3.deploy() as WondersContract3
        await wonderscontract3.deployed()
        // console.log(`Wonders deployed to ${wonders3.address}`) 
    
        const Wonders4 = await ethers.getContractFactory("WondersContract4")
        wonderscontract4 = await Wonders4.deploy() as WondersContract4
        await wonderscontract4.deployed()
        // console.log(`Wonders deployed to ${wonders4.address}`) 
    });

    // describe("Minting a Country", function () {
    //     it("Tests that the nation parameters set correctly", async function () {
    //         await countryminter.connect(signer1).generateCountry(
    //                 "TestRuler",
    //                 "TestNationName",
    //                 "TestCapitalCity",
    //                 "TestNationSlogan"
    //             );
    //         const { rulerName, nationName, capitalCity, nationSlogan } = await countryparameterscontract.idToCountryParameters(0);    
    //         expect(rulerName).to.equal("TestRuler");
    //         expect(nationName).to.equal("TestNationName");
    //         expect(capitalCity).to.equal("TestCapitalCity");
    //         expect(nationSlogan).to.equal("TestNationSlogan");
    //     });
    // });
});
