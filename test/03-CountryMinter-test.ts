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
    let EnvironmentContract: EnvironmentContract
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
        console.log(`WarBuks token deployed to ${warbucks.address}`)
    
        const MetaNatonsGovToken = await ethers.getContractFactory(
            "MetaNationsGovToken"
        )
        metanationsgovtoken = await MetaNatonsGovToken.deploy(INITIAL_SUPPLY) as MetaNationsGovToken
        await metanationsgovtoken.deployed()
        console.log(`MetaNationsGovToken deployed to ${metanationsgovtoken.address}`)
    
        const AidContract = await ethers.getContractFactory("AidContract")
        aidcontract = await AidContract.deploy() as AidContract
        await aidcontract.deployed()
        console.log(`AidContract deployed tp ${aidcontract.address}`)
            //countryminter
            //treasury
            //forces
            //infrastructure
            //keeper
            //wonder1
        
        const AirBattleContract = await ethers.getContractFactory("AirBattleContract")
        airbattlecontract = await AirBattleContract.deploy() as AirBattleContract
        await airbattlecontract.deployed()
        console.log(`AirBattleContract deployed tp ${airbattlecontract.address}`)
            //war
            //fighter
            //bomber
            //infrastructure
            //forces
            //fighterlosses
            //vrfCoordinatorV2
            //subscriptionId
            //gasLAne
            //callbackGasLimit
            //missiles
            //wonders1

        const BillsContract = await ethers.getContractFactory("BillsContract")
        billscontract = await BillsContract.deploy() as BillsContract
        await billscontract.deployed()
        console.log(`BillsContract deployed tp ${billscontract.address}`)
            //countryminter
            //treasury
            //wonders1
            //wonders2
            //wonders3
            //wonders4
            //infrastructure
            //forces
            //fighters
            //navy
            //resources
            //improvements1
            //improvements2
            //missiles

        const CountryParameters = await ethers.getContractFactory("CountryParametersContract")
        countryparameterscontract = await CountryParameters.deploy() as CountryParametersContract
        await countryparameterscontract.deployed()
        // console.log(`CountryParameters deployed to ${countryparameterscontract.address}`)  
    
        const Treasury = await ethers.getContractFactory("TreasuryContract")
        treasurycontract = await Treasury.deploy(warbucks.address) as TreasuryContract
        await treasurycontract.deployed()
        // console.log(`Treasury deployed to ${treasury.address}`) 
    
        const Infrastructure = await ethers.getContractFactory("InfrastructureContract")
        infrastructurecontract = await Infrastructure.deploy() as InfrastructureContract
        await infrastructurecontract.deployed()
        // console.log(`Infrastructure deployed to ${infrastructure.address}`) 
    
        const Resources = await ethers.getContractFactory("ResourcesContract")
        resourcescontract = await Resources.deploy() as ResourcesContract
        await resourcescontract.deployed()
        // console.log(`Resources deployed to ${resources.address}`) 
    
        const Improvements2 = await ethers.getContractFactory("ImprovementsContract2")
        improvementscontract2 = await Improvements2.deploy(treasurycontract.address) as ImprovementsContract2
        await improvementscontract2.deployed()
        // console.log(`Improvements deployed to ${improvements2.address}`) 
    
        const Improvements3 = await ethers.getContractFactory("ImprovementsContract3")
        improvementscontract3 = await Improvements3.deploy(treasurycontract.address) as ImprovementsContract3
        await improvementscontract3.deployed()
        // console.log(`Improvements deployed to ${improvements3.address}`) 
    
        const Improvements1 = await ethers.getContractFactory("ImprovementsContract1")
        improvementscontract1 = await Improvements1.deploy(treasurycontract.address, improvementscontract2.address, improvementscontract3.address) as ImprovementsContract1
        await improvementscontract1.deployed()
        // console.log(`Improvements deployed to ${improvements1.address}`)
    
        await improvementscontract2.updateImprovementContract1Address(improvementscontract1.address)
        // console.log(`Improvements2 updated with Improvements1 address`)
        await improvementscontract3.updateImprovementContract1Address(improvementscontract1.address)
        // console.log(`Improvements3 updated with Improvements1 address`)
    
        const Wonders2 = await ethers.getContractFactory("WondersContract2")
        wonderscontract2 = await Wonders2.deploy(treasurycontract.address) as WondersContract2
        await wonderscontract2.deployed()
        // console.log(`Wonders deployed to ${wonders2.address}`) 
    
        const Wonders3 = await ethers.getContractFactory("WondersContract3")
        wonderscontract3 = await Wonders3.deploy(treasurycontract.address) as WondersContract3
        await wonderscontract3.deployed()
        // console.log(`Wonders deployed to ${wonders3.address}`) 
    
        const Wonders4 = await ethers.getContractFactory("WondersContract4")
        wonderscontract4 = await Wonders4.deploy(treasurycontract.address) as WondersContract4
        await wonderscontract4.deployed()
        // console.log(`Wonders deployed to ${wonders4.address}`) 
    
        const Wonders1 = await ethers.getContractFactory("WondersContract1")
        wonderscontract1 = await Wonders1.deploy(treasurycontract.address, wonderscontract2.address, wonderscontract3.address, wonderscontract4.address) as WondersContract1
        await wonderscontract1.deployed()
        // console.log(`Wonders deployed to ${wonders1.address}`) 
    
        await wonderscontract2.updateWonderContract1Address(wonderscontract1.address)
        // console.log(`wonders1 address set in contract wonders2`)
        await wonderscontract3.updateWonderContract1Address(wonderscontract1.address)
        // console.log(`wonders1 address set in contract wonders3`)
        await wonderscontract4.updateWonderContract1Address(wonderscontract1.address)
        // console.log(`wonders1 address set in contract wonders4`)
    
        const Military = await ethers.getContractFactory("MilitaryContract")
        militarycontract = await Military.deploy() as MilitaryContract
        await militarycontract.deployed()
        // console.log(`Military deployed to ${military.address}`) 
    
        const Forces = await ethers.getContractFactory("ForcesContract")
        forcescontract = await Forces.deploy(treasurycontract.address) as ForcesContract
        await forcescontract.deployed()
        // console.log(`Forces deployed to ${forces.address}`) 
    
        const Navy = await ethers.getContractFactory("NavyContract")
        navycontract = await Navy.deploy(treasurycontract.address) as NavyContract
        await navycontract.deployed()
        // console.log(`Navy deployed to ${navy.address}`) 
    
        const Fighters = await ethers.getContractFactory("FightersContract")
        fighterscontract = await Fighters.deploy(treasurycontract.address) as FightersContract
        await fighterscontract.deployed()
        // console.log(`Fighters deployed to ${fighters.address}`) 
    
        const Bombers = await ethers.getContractFactory("BombersContract")
        bomberscontract = await Bombers.deploy(treasurycontract.address, fighterscontract.address) as BombersContract
        await bomberscontract.deployed()
        // console.log(`Bombers deployed to ${bombers.address}`) 
    
        const CountryMinter = await ethers.getContractFactory("CountryMinter")
        ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
        countryminter = await CountryMinter.deploy(
            warbucks.address,
            countryparameterscontract.address,
            treasurycontract.address,
            infrastructurecontract.address,
            resourcescontract.address,
            militarycontract.address,
            forcescontract.address,
            navycontract.address,
            fighterscontract.address,
            bomberscontract.address,
            )  as CountryMinter
        await countrymintercontract.deployed()
        await countrymintercontract.constructorContinued1(        
            improvementscontract1.address,
            improvementscontract2.address,
            improvementscontract3.address,
            wonderscontract1.address,
            wonderscontract2.address,
            wonderscontract3.address,
            wonderscontract4.address
            )
        // console.log(`CountryMinter deployed to ${countryminter.address}`)

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
