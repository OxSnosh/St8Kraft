"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const helper_hardhat_config_1 = require("../helper-hardhat-config");
const helper_hardhat_config_2 = require("../helper-hardhat-config");
describe("Spy Operations Contract", function () {
    let warbucks;
    let metanationsgovtoken;
    let aidcontract;
    let airbattlecontract;
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
    let signer2;
    let signer3;
    let signer4;
    let signer5;
    let signer6;
    let signer7;
    let signers;
    let addrs;
    let vrfCoordinatorV2Mock;
    beforeEach(async function () {
        signers = await hardhat_1.ethers.getSigners();
        signer0 = signers[0];
        signer1 = signers[1];
        signer2 = signers[2];
        signer3 = signers[3];
        signer4 = signers[4];
        signer5 = signers[5];
        signer6 = signers[6];
        signer7 = signers[7];
        let chainId;
        chainId = hardhat_1.network.config.chainId;
        let subscriptionId;
        let vrfCoordinatorV2Address;
        if (chainId == 31337 || chainId == 1337) {
            // console.log("local network detected")
            const FUND_AMOUNT = hardhat_1.ethers.utils.parseEther("10");
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
            vrfCoordinatorV2Address = helper_hardhat_config_2.networkConfig[chainId]["vrfCoordinatorV2"];
            subscriptionId = helper_hardhat_config_2.networkConfig[chainId]["subscriptionId"];
        }
        var gasLane = helper_hardhat_config_2.networkConfig[31337]["gasLane"];
        var callbackGasLimit = helper_hardhat_config_2.networkConfig[31337]["callbackGasLimit"];
        const WarBucks = await hardhat_1.ethers.getContractFactory("WarBucks");
        warbucks = await WarBucks.deploy(helper_hardhat_config_1.INITIAL_SUPPLY);
        await warbucks.deployed();
        // console.log(`WarBuks token deployed to ${warbucks.address}`)
        const MetaNatonsGovToken = await hardhat_1.ethers.getContractFactory("MetaNationsGovToken");
        metanationsgovtoken = await MetaNatonsGovToken.deploy(helper_hardhat_config_1.INITIAL_SUPPLY);
        await metanationsgovtoken.deployed();
        // console.log(`MetaNationsGovToken deployed to ${metanationsgovtoken.address}`)
        const AidContract = await hardhat_1.ethers.getContractFactory("AidContract");
        aidcontract = await AidContract.deploy();
        await aidcontract.deployed();
        // console.log(`AidContract deployed tp ${aidcontract.address}`)
        const AirBattleContract = await hardhat_1.ethers.getContractFactory("AirBattleContract");
        airbattlecontract = await AirBattleContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await airbattlecontract.deployed();
        // console.log(`AirBattleContract deployed tp ${airbattlecontract.address}`)
        const BillsContract = await hardhat_1.ethers.getContractFactory("BillsContract");
        billscontract = await BillsContract.deploy();
        await billscontract.deployed();
        // console.log(`BillsContract deployed tp ${billscontract.address}`)
        const BombersContract = await hardhat_1.ethers.getContractFactory("BombersContract");
        bomberscontract = await BombersContract.deploy();
        await bomberscontract.deployed();
        // console.log(`BomberContract deployed tp ${bomberscontract.address}`)
        const BombersMarketplace1 = await hardhat_1.ethers.getContractFactory("BombersMarketplace1");
        bombersmarketplace1 = await BombersMarketplace1.deploy();
        await bombersmarketplace1.deployed();
        // console.log(`BomberMarketplace1 deployed tp ${bombersmarketplace1.address}`)
        const BombersMarketplace2 = await hardhat_1.ethers.getContractFactory("BombersMarketplace2");
        bombersmarketplace2 = await BombersMarketplace2.deploy();
        await bombersmarketplace2.deployed();
        // console.log(`BomberMarketplace2 deployed tp ${bombersmarketplace2.address}`)
        const CountryMinter = await hardhat_1.ethers.getContractFactory("CountryMinter");
        countryminter = await CountryMinter.deploy();
        await countryminter.deployed();
        // console.log(`CountryMinter deployed tp ${countryminter.address}`)
        const CountryParameters = await hardhat_1.ethers.getContractFactory("CountryParametersContract");
        countryparameterscontract = await CountryParameters.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await countryparameterscontract.deployed();
        // console.log(`CountryParameters deployed to ${countryparameterscontract.address}`)
        const CrimeContract = await hardhat_1.ethers.getContractFactory("CrimeContract");
        crimecontract = await CrimeContract.deploy();
        await crimecontract.deployed();
        // console.log(`CrimeContract deployed tp ${crimecontract.address}`)
        const CruiseMissileContract = await hardhat_1.ethers.getContractFactory("CruiseMissileContract");
        cruisemissilecontract = await CruiseMissileContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await cruisemissilecontract.deployed();
        // console.log(`CruiseMissile deployed to ${cruisemissileconract.address}`)
        const EnvironmentContract = await hardhat_1.ethers.getContractFactory("EnvironmentContract");
        environmentcontract = await EnvironmentContract.deploy();
        await environmentcontract.deployed();
        // console.log(`EnvironmentContract deployed to ${environmentcontract.address}`)
        const FightersContract = await hardhat_1.ethers.getContractFactory("FightersContract");
        fighterscontract = await FightersContract.deploy();
        await fighterscontract.deployed();
        // console.log(`FightersContract deployed to ${fighterscontract.address}`)
        const FighterLosses = await hardhat_1.ethers.getContractFactory("FighterLosses");
        fighterlosses = await FighterLosses.deploy();
        await fighterlosses.deployed();
        // console.log(`FighterLosses deployed to ${fighterlosses.address}`)
        const FightersMarketplace1 = await hardhat_1.ethers.getContractFactory("FightersMarketplace1");
        fightersmarketplace1 = await FightersMarketplace1.deploy();
        await fightersmarketplace1.deployed();
        // console.log(`FightersMarket1 deployed to ${fightersmarketplace1.address}`)
        const FightersMarketplace2 = await hardhat_1.ethers.getContractFactory("FightersMarketplace2");
        fightersmarketplace2 = await FightersMarketplace2.deploy();
        await fightersmarketplace2.deployed();
        // console.log(`FightersMarket2 deployed to ${fightersmarketplace2.address}`)
        const ForcesContract = await hardhat_1.ethers.getContractFactory("ForcesContract");
        forcescontract = await ForcesContract.deploy();
        await forcescontract.deployed();
        // console.log(`ForcesContract deployed to ${forcescontract.address}`)
        const MissilesContract = await hardhat_1.ethers.getContractFactory("MissilesContract");
        missilescontract = await MissilesContract.deploy();
        await missilescontract.deployed();
        // console.log(`MissilesContract deployed to ${missilescontract.address}`)
        const GroundBattleContract = await hardhat_1.ethers.getContractFactory("GroundBattleContract");
        groundbattlecontract = await GroundBattleContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await groundbattlecontract.deployed();
        // console.log(`GroundBattleContract deployed to ${groundbattlecontract.address}`)
        const ImprovementsContract1 = await hardhat_1.ethers.getContractFactory("ImprovementsContract1");
        improvementscontract1 = await ImprovementsContract1.deploy();
        await improvementscontract1.deployed();
        // console.log(`ImprovementsContract1 deployed to ${improvementscontract1.address}`)
        const ImprovementsContract2 = await hardhat_1.ethers.getContractFactory("ImprovementsContract2");
        improvementscontract2 = await ImprovementsContract2.deploy();
        await improvementscontract2.deployed();
        // console.log(`ImprovementsContract2 deployed to ${improvementscontract2.address}`)
        const ImprovementsContract3 = await hardhat_1.ethers.getContractFactory("ImprovementsContract3");
        improvementscontract3 = await ImprovementsContract3.deploy();
        await improvementscontract3.deployed();
        // console.log(`ImprovementsContract3 deployed to ${improvementscontract3.address}`)
        const ImprovementsContract4 = await hardhat_1.ethers.getContractFactory("ImprovementsContract4");
        improvementscontract4 = await ImprovementsContract4.deploy();
        await improvementscontract4.deployed();
        // console.log(`ImprovementsContract4 deployed to ${improvementscontract4.address}`)
        const InfrastructureContract = await hardhat_1.ethers.getContractFactory("InfrastructureContract");
        infrastructurecontract = await InfrastructureContract.deploy();
        await infrastructurecontract.deployed();
        // console.log(`InfrastructureContract deployed to ${infrastructurecontract.address}`)
        const InfrastructureMarketContract = await hardhat_1.ethers.getContractFactory("InfrastructureMarketContract");
        infrastructuremarketplace = await InfrastructureMarketContract.deploy();
        await infrastructuremarketplace.deployed();
        // console.log(`InfrastructureMarketplace deployed to ${infrastructuremarketplace.address}`)
        const KeeperContract = await hardhat_1.ethers.getContractFactory("KeeperContract");
        keepercontract = await KeeperContract.deploy(86400);
        await keepercontract.deployed();
        // console.log(`KeeperContract deployed to ${keepercontract.address}`)
        const LandMarketContract = await hardhat_1.ethers.getContractFactory("LandMarketContract");
        landmarketcontract = await LandMarketContract.deploy();
        await landmarketcontract.deployed();
        // console.log(`LandMarketContract deployed to ${landmarketcontract.address}`)
        const MilitaryContract = await hardhat_1.ethers.getContractFactory("MilitaryContract");
        militarycontract = await MilitaryContract.deploy();
        await militarycontract.deployed();
        // console.log(`MilitaryContract deployed to ${militarycontract.address}`)
        const NationStrengthContract = await hardhat_1.ethers.getContractFactory("NationStrengthContract");
        nationstrengthcontract = await NationStrengthContract.deploy();
        await nationstrengthcontract.deployed();
        // console.log(`NationStrengthContract deployed to ${nationstrengthcontract.address}`)
        const NavyContract = await hardhat_1.ethers.getContractFactory("NavyContract");
        navycontract = await NavyContract.deploy();
        await navycontract.deployed();
        // console.log(`NavyContract deployed to ${navycontract.address}`)
        const NavyContract2 = await hardhat_1.ethers.getContractFactory("NavyContract2");
        navycontract2 = await NavyContract2.deploy();
        await navycontract2.deployed();
        // console.log(`NavyContract2 deployed to ${navycontract2.address}`)
        const AdditionalNavyContract = await hardhat_1.ethers.getContractFactory("AdditionalNavyContract");
        additionalnavycontract = await AdditionalNavyContract.deploy();
        await additionalnavycontract.deployed();
        // console.log(`NavyContract deployed to ${additionalnavycontract.address}`)
        const NavalActionsContract = await hardhat_1.ethers.getContractFactory("NavalActionsContract");
        navalactionscontract = await NavalActionsContract.deploy();
        await navalactionscontract.deployed();
        // console.log(`NavalActionsContract deployed to ${navalactionscontract.address}`)
        const NavalBlockadeContract = await hardhat_1.ethers.getContractFactory("NavalBlockadeContract");
        navalblockadecontract = await NavalBlockadeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await navalblockadecontract.deployed();
        // console.log(`NavalBlockadeContract deployed to ${navalblockadecontract.address}`)
        const BreakBlocadeContract = await hardhat_1.ethers.getContractFactory("BreakBlocadeContract");
        breakblockadecontract = await BreakBlocadeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await breakblockadecontract.deployed();
        // console.log(`BreakBlocadeContract deployed to ${breakblockadecontract.address}`)
        const NavalAttackContract = await hardhat_1.ethers.getContractFactory("NavalAttackContract");
        navalattackcontract = await NavalAttackContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await navalattackcontract.deployed();
        // console.log(`NavalAttackContract deployed to ${navalattackcontract.address}`)
        const NukeContract = await hardhat_1.ethers.getContractFactory("NukeContract");
        nukecontract = await NukeContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await nukecontract.deployed();
        // console.log(`NukeContract deployed to ${nukecontract.address}`)
        const ResourcesContract = await hardhat_1.ethers.getContractFactory("ResourcesContract");
        resourcescontract = await ResourcesContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await resourcescontract.deployed();
        // console.log(`ResourcesContract deployed to ${resourcescontract.address}`)
        const BonusResourcesContract = await hardhat_1.ethers.getContractFactory("BonusResourcesContract");
        bonusresourcescontract = await BonusResourcesContract.deploy();
        await bonusresourcescontract.deployed();
        const SenateContract = await hardhat_1.ethers.getContractFactory("SenateContract");
        senatecontract = await SenateContract.deploy(20);
        await senatecontract.deployed();
        // console.log(`SenateContract deployed to ${senatecontract.address}`)
        const SpyContract = await hardhat_1.ethers.getContractFactory("SpyContract");
        spycontract = await SpyContract.deploy();
        await spycontract.deployed();
        // console.log(`SpyContract deployed to ${spycontract.address}`)
        const SpyOperationsContract = await hardhat_1.ethers.getContractFactory("SpyOperationsContract");
        spyoperationscontract = await SpyOperationsContract.deploy(vrfCoordinatorV2Address, subscriptionId, gasLane, callbackGasLimit);
        await spyoperationscontract.deployed();
        // console.log(`SpyOperationsContract deployed to ${spyoperationscontract.address}`)
        const TaxesContract = await hardhat_1.ethers.getContractFactory("TaxesContract");
        taxescontract = await TaxesContract.deploy();
        await taxescontract.deployed();
        // console.log(`TaxesContract deployed to ${taxescontract.address}`)
        const AdditionalTaxesContract = await hardhat_1.ethers.getContractFactory("AdditionalTaxesContract");
        additionaltaxescontract = await AdditionalTaxesContract.deploy();
        await additionaltaxescontract.deployed();
        // console.log(`AdditionalTaxesContract deployed to ${additionaltaxescontract.address}`)
        const TechnologyMarketContract = await hardhat_1.ethers.getContractFactory("TechnologyMarketContract");
        technologymarketcontrat = await TechnologyMarketContract.deploy();
        await technologymarketcontrat.deployed();
        // console.log(`TechnologyMarketContract deployed to ${technologymarketcontrat.address}`)
        const TreasuryContract = await hardhat_1.ethers.getContractFactory("TreasuryContract");
        treasurycontract = await TreasuryContract.deploy();
        await treasurycontract.deployed();
        // console.log(`TreasuryContract deployed to ${treasurycontract.address}`)
        const WarContract = await hardhat_1.ethers.getContractFactory("WarContract");
        warcontract = await WarContract.deploy();
        await warcontract.deployed();
        // console.log(`WarContract deployed to ${warcontract.address}`)     
        const Wonders1 = await hardhat_1.ethers.getContractFactory("WondersContract1");
        wonderscontract1 = await Wonders1.deploy();
        await wonderscontract1.deployed();
        // console.log(`Wonders1 deployed to ${wonderscontract1.address}`)
        const Wonders2 = await hardhat_1.ethers.getContractFactory("WondersContract2");
        wonderscontract2 = await Wonders2.deploy();
        await wonderscontract2.deployed();
        // console.log(`Wonders2 deployed to ${wonderscontract2.address}`)
        const Wonders3 = await hardhat_1.ethers.getContractFactory("WondersContract3");
        wonderscontract3 = await Wonders3.deploy();
        await wonderscontract3.deployed();
        // console.log(`Wonders3 deployed to ${wonderscontract3.address}`)
        const Wonders4 = await hardhat_1.ethers.getContractFactory("WondersContract4");
        wonderscontract4 = await Wonders4.deploy();
        await wonderscontract4.deployed();
        // console.log(`Wonders4 deployed to ${wonderscontract4.address}`)
        // console.log("contracts deployed")
        await warbucks.settings(treasurycontract.address, countryminter.address);
        await aidcontract.settings(countryminter.address, treasurycontract.address, forcescontract.address, infrastructurecontract.address, keepercontract.address, wonderscontract1.address, senatecontract.address, countryparameterscontract.address);
        await airbattlecontract.settings(warcontract.address, fighterscontract.address, bomberscontract.address, infrastructurecontract.address, forcescontract.address, fighterlosses.address, countryminter.address);
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
        if (chainId == 31337 || chainId == 1337) {
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, spyoperationscontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, countryparameterscontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, resourcescontract.address);
        }
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(2100000000000000000000000));
        await countryminter.connect(signer1).generateCountry("TestRuler", "TestNationName", "TestCapitalCity", "TestNationSlogan");
        await warbucks.connect(signer0).approve(warbucks.address, BigInt(10000000000 * (10 ** 18)));
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(10000000000 * (10 ** 18)));
        await treasurycontract.connect(signer1).addFunds(BigInt(10000000000 * (10 ** 18)), 0);
        await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 5000);
        await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
        await forcescontract.connect(signer1).buySoldiers(2000, 0);
        await forcescontract.connect(signer1).buyTanks(40, 0);
        await spycontract.connect(signer1).buySpies(30, 0);
        await warbucks.connect(signer0).transfer(signer2.address, BigInt(2100000000000000000000000));
        await countryminter.connect(signer2).generateCountry("TestRuler2", "TestNationName2", "TestCapitalCity2", "TestNationSlogan2");
        // const tx2 = await countryparameterscontract.fulfillRequest(1);
        // let txReceipt2 = await tx2.wait(1);
        // let requestId2 = txReceipt2?.events?.[1].args?.requestId;
        // await vrfCoordinatorV2Mock.fulfillRandomWords(requestId2, countryparameterscontract.address);
        await warbucks.connect(signer0).approve(warbucks.address, BigInt(2000000000 * (10 ** 18)));
        await warbucks.connect(signer0).transfer(signer2.address, BigInt(2000000000 * (10 ** 18)));
        await treasurycontract.connect(signer2).addFunds(BigInt(2000000000 * (10 ** 18)), 1);
        await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 5000);
        await technologymarketcontrat.connect(signer2).buyTech(1, 300);
        await forcescontract.connect(signer2).buySoldiers(1000, 1);
        await forcescontract.connect(signer2).buyTanks(20, 1);
        await militarycontract.connect(signer1).toggleWarPeacePreference(0);
        await militarycontract.connect(signer2).toggleWarPeacePreference(1);
        await warcontract.connect(signer1).declareWar(0, 1);
        await forcescontract.connect(signer1).deployForces(1000, 30, 0, 0);
        // await forcescontract.connect(signer2).buySpies(40, 1)
    });
    describe("Spy Operations", function () {
        // it("tests spy operations odds", async function () {
        //     var odds : any = await spyoperationscontract.attackOdds(0,1);
        //     // console.log(odds[0].toNumber())
        //     // console.log(odds[1].toNumber())
        //     expect(odds[0].toNumber()).to.equal(89)
        //     expect(odds[1].toNumber()).to.equal(10)
        //     // var defenseThreatLevel = await militarycontract.getThreatLevel(1)
        //     // console.log(defenseThreatLevel.toNumber())
        //     await militarycontract.connect(signer2).updateThreatLevel(5, 1)
        //     var odds : any = await spyoperationscontract.attackOdds(0,1);
        //     // console.log(odds[0].toNumber())
        //     // console.log(odds[1].toNumber())
        //     expect(odds[0].toNumber()).to.equal(84)
        //     expect(odds[1].toNumber()).to.equal(15)
        //     await wonderscontract1.connect(signer1).buyWonder1(0, 3)
        //     var odds : any = await spyoperationscontract.attackOdds(0,1);
        //     // console.log(odds[0].toNumber())
        //     // console.log(odds[1].toNumber())
        //     expect(odds[0].toNumber()).to.equal(85)
        //     expect(odds[1].toNumber()).to.equal(14)
        // })
        // it("tests spy operations revert correctly", async function () {
        //     await expect(spyoperationscontract.connect(signer1).conductSpyOperation(1, 0, 1)).to.be.revertedWith("!nation owner")
        //     await militarycontract.connect(signer2).toggleWarPeacePreference(1)
        //     await expect(spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 2)).to.be.revertedWith("invalid attack type")
        //     await militarycontract.connect(signer2).toggleWarPeacePreference(1)
        //     await expect(spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 16)).to.be.revertedWith("invalid attack type")
        // })
        // it("tests spy operations #1 gather intel", async function () {
        //     await spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 1);
        //     const tx1 = await spyoperationscontract.fulfillRequest(0);
        //     let txReceipt1 = await tx1.wait(1);
        //     let requestId1 = txReceipt1?.events?.[1].args?.requestId;
        //     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId1, spyoperationscontract.address);
        //     await spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 1);
        //     const tx2 = await spyoperationscontract.fulfillRequest(1);
        //     let txReceipt2 = await tx2.wait(1);
        //     let requestId2 = txReceipt2?.events?.[1].args?.requestId;
        //     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId2, spyoperationscontract.address);
        // })
        // it("tests spy operations #2 destroy cruise missiles", async function () {
        //     await missilescontract.connect(signer2).buyCruiseMissiles(15, 1)
        //     var missileCount = await missilescontract.getCruiseMissileCount(1)
        //     // console.log(missileCount.toNumber())
        //     expect(missileCount).to.equal(15)
        //     await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
        //     await spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 2);
        //     const tx1 = await spyoperationscontract.fulfillRequest(0);
        //     let txReceipt1 = await tx1.wait(1);
        //     let requestId1 : any = txReceipt1?.events?.[1].args?.requestId;
        //     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId1, spyoperationscontract.address);
        //     var missileCount2 = await missilescontract.getCruiseMissileCount(1)
        //     // console.log(missileCount2.toNumber())
        //     expect(missileCount2).to.equal(13)
        // })
        // it("tests spy operations #3 destroy tanks", async function () {
        //     await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 1000)
        //     await forcescontract.connect(signer2).buySoldiers(1000, 1)
        //     await forcescontract.connect(signer2).buyTanks(150, 1)
        //     var tankCount = await forcescontract.getTankCount(1)
        //     // console.log(tankCount.toNumber())
        //     expect(tankCount).to.equal(170)
        //     await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
        //     await spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 3);
        //     const tx1 = await spyoperationscontract.fulfillRequest(0);
        //     let txReceipt1 = await tx1.wait(1);
        //     let requestId1 : any = txReceipt1?.events?.[1].args?.requestId;
        //     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId1, spyoperationscontract.address);
        //     var tankCount2 = await forcescontract.getTankCount(1)
        //     // console.log(tankCount2.toNumber())
        //     expect(tankCount2).to.equal(160)
        // })
        // it("tests spy operations #4 capture land", async function () {
        //     await infrastructuremarketplace.connect(signer2).buyInfrastructure(1, 1000)
        //     await landmarketcontract.connect(signer2).buyLand(1, 1000)
        //     var land = await infrastructurecontract.getLandCount(1);
        //     // console.log("land", land.toNumber())
        //     expect(land.toNumber()).to.equal(1020)
        //     await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
        //     await spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 4);
        //     const tx1 = await spyoperationscontract.fulfillRequest(0);
        //     let txReceipt1 = await tx1.wait(1);
        //     let requestId1 : any = txReceipt1?.events?.[1].args?.requestId;
        //     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId1, spyoperationscontract.address);
        //     var land2 = await infrastructurecontract.getLandCount(1);
        //     // console.log("land", land2.toNumber())
        //     expect(land2.toNumber()).to.equal(1014)
        // })
        // //please make a test for spy operations #5 change governement  
        // it("tests spy operations #5 change government", async function () {
        //     var desiredGovt = await countryparameterscontract.getGovernmentPreference(1);
        //     // console.log("desiredGovt", desiredGovt.toNumber())
        //     expect(desiredGovt.toNumber()).to.equal(10) 
        //     await spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 5);
        //     const tx1 = await spyoperationscontract.fulfillRequest(0);
        //     let txReceipt1 = await tx1.wait(1);
        //     let requestId1 : any = txReceipt1?.events?.[1].args?.requestId;
        //     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId1, spyoperationscontract.address);
        //     var desiredGovt2 = await countryparameterscontract.getGovernmentPreference(1);
        //     // console.log("desiredGovt", desiredGovt2.toNumber())
        //     expect(desiredGovt2.toNumber()).to.equal(2) 
        // })
        // it("tests spy operations #6 change religion", async function () {
        //     var desiredReligion = await countryparameterscontract.getReligionPreference(1);
        //     // console.log("desiredReligion", desiredReligion.toNumber())
        //     expect(desiredReligion.toNumber()).to.equal(10) 
        //     await spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 6);
        //     const tx1 = await spyoperationscontract.fulfillRequest(0);
        //     let txReceipt1 = await tx1.wait(1);
        //     let requestId1 : any = txReceipt1?.events?.[1].args?.requestId;
        //     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId1, spyoperationscontract.address);
        //     var desiredReligion2 = await countryparameterscontract.getReligionPreference(1);
        //     // console.log("desiredReligion", desiredReligion2.toNumber())
        //     expect(desiredReligion2.toNumber()).to.equal(8)
        // })
        // it("tests spy operations #7 change threat level", async function () {
        //     var threatLevel : any = await militarycontract.getThreatLevel(1);
        //     // console.log("threatLevel", threatLevel.toNumber())
        //     expect(threatLevel.toNumber()).to.equal(1)
        //     await spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 7);
        //     const tx1 = await spyoperationscontract.fulfillRequest(0);
        //     let txReceipt1 = await tx1.wait(1);
        //     let requestId1 : any = txReceipt1?.events?.[1].args?.requestId;
        //     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId1, spyoperationscontract.address);
        //     var threatLevel2 : any = await militarycontract.getThreatLevel(1);
        //     // console.log("threatLevel2", threatLevel2.toNumber())
        //     expect(threatLevel2.toNumber()).to.equal(2)
        // })
        // it("tests spy operations #8 change DEFCON level", async function () {
        //     var defconLevel : any = await militarycontract.getDefconLevel(1);
        //     // console.log("defconLevel", defconLevel.toNumber())
        //     expect(defconLevel.toNumber()).to.equal(5)
        //     await spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 8);
        //     const tx1 = await spyoperationscontract.fulfillRequest(0);
        //     let txReceipt1 = await tx1.wait(1);
        //     let requestId1 : any = txReceipt1?.events?.[1].args?.requestId;
        //     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId1, spyoperationscontract.address);
        //     var defconLevel2 : any = await militarycontract.getDefconLevel(1);
        //     // console.log("defconLevel2", defconLevel2.toNumber())
        //     expect(defconLevel2.toNumber()).to.equal(2)
        // })
        // it("tests spy operations #9 destroy spies", async function () {
        //     await forcescontract.connect(signer2).buySpies(30, 1)
        //     var spyCount = await forcescontract.getSpyCount(1);
        //     // console.log("spyCount", spyCount.toNumber())
        //     expect(spyCount.toNumber()).to.equal(30)
        //     await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
        //     await spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 9);
        //     const tx1 = await spyoperationscontract.fulfillRequest(0);
        //     let txReceipt1 = await tx1.wait(1);
        //     let requestId1 : any = txReceipt1?.events?.[1].args?.requestId;
        //     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId1, spyoperationscontract.address);
        //     var spyCount2 = await forcescontract.getSpyCount(1);
        //     // console.log("spyCount2", spyCount2.toNumber())
        //     expect(spyCount2.toNumber()).to.equal(18)
        // })
        // it("tests spy operations #10 capture technology", async function () {
        //     var techCount = await infrastructurecontract.getTechnologyCount(1);
        //     // console.log("techCount", techCount.toNumber())
        //     expect(techCount.toNumber()).to.equal(300)
        //     await technologymarketcontrat.connect(signer1).buyTech(0, 1000);
        //     var attackerTechCount = await infrastructurecontract.getTechnologyCount(0);
        //     // console.log("attacker techCount", attackerTechCount.toNumber())
        //     expect(attackerTechCount.toNumber()).to.equal(2000)
        //     await spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 10);
        //     const tx1 = await spyoperationscontract.fulfillRequest(0);
        //     let txReceipt1 = await tx1.wait(1);
        //     let requestId1 : any = txReceipt1?.events?.[1].args?.requestId;
        //     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId1, spyoperationscontract.address);
        //     var techCount2 = await infrastructurecontract.getTechnologyCount(1);
        //     // console.log("techCount2", techCount2.toNumber())
        //     expect(techCount2.toNumber()).to.equal(294)
        //     var attackerTechCount2 = await infrastructurecontract.getTechnologyCount(0);
        //     // console.log("attacker techCount", attackerTechCount2.toNumber())
        //     expect(attackerTechCount2.toNumber()).to.equal(2006)
        // })
        // it("tests spy operations #11 sabatoge taxes", async function () {
        //     var taxRate = await infrastructurecontract.getTaxRate(1);
        //     // console.log("taxRate", taxRate.toNumber())
        //     expect(taxRate.toNumber()).to.equal(16)
        //     await spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 11);
        //     const tx1 = await spyoperationscontract.fulfillRequest(0);
        //     let txReceipt1 = await tx1.wait(1);
        //     let requestId1 : any = txReceipt1?.events?.[1].args?.requestId;
        //     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId1, spyoperationscontract.address);
        //     var taxRate2 = await infrastructurecontract.getTaxRate(1);
        //     // console.log("taxRate2", taxRate2.toNumber())
        //     expect(taxRate2.toNumber()).to.equal(23)
        //     await expect(infrastructurecontract.connect(signer2).setTaxRate(1, 28)).to.be.revertedWith("need to collect taxes before changing tax rate");
        //     await taxescontract.connect(signer2).collectTaxes(1);
        //     await infrastructurecontract.connect(signer2).setTaxRate(1, 28);
        //     var taxRate3 = await infrastructurecontract.getTaxRate(1);
        //     // console.log("taxRate3", taxRate3.toNumber())
        //     expect(taxRate3.toNumber()).to.equal(28)
        // })
        // it("tests spy operations #12 capture money reserves", async function () {
        //     var balance : any = await treasurycontract.checkBalance(1);
        //     // console.log("balance", BigInt(balance))
        //     expect(BigInt(balance).toString()).to.equal("1998270000000000026575088544")
        //     var attackerBalance : any = await treasurycontract.checkBalance(0);
        //     // console.log("attackerBalance", BigInt(attackerBalance))
        //     expect(BigInt(attackerBalance).toString()).to.equal("9998199999999999583116693632")
        //     await spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 12);
        //     const tx1 = await spyoperationscontract.fulfillRequest(0);
        //     let txReceipt1 = await tx1.wait(1);
        //     let requestId1 : any = txReceipt1?.events?.[1].args?.requestId;
        //     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId1, spyoperationscontract.address);
        //     var balance2 : any = await treasurycontract.checkBalance(1);
        //     // console.log("balance2", BigInt(balance2))
        //     expect(BigInt(balance2).toString()).to.equal("1997270000000000026575088544")
        //     var attackerBalance2 : any = await treasurycontract.checkBalance(0);
        //     // console.log("attackerBalance2", BigInt(attackerBalance2))
        //     expect(BigInt(attackerBalance2).toString()).to.equal("9998950789999999583116393632")
        // })
        // it("tests spy operations #13 capture infrastructure", async function () {
        //     var infrastructureCount = await infrastructurecontract.getInfrastructureCount(1);
        //     // console.log("infrastructureCount", infrastructureCount.toNumber())
        //     expect(infrastructureCount.toNumber()).to.equal(5020)
        //     var attackerInfrastructure = await infrastructurecontract.getInfrastructureCount(0);
        //     // console.log("attackerInfrastructure", attackerInfrastructure.toNumber())
        //     expect(attackerInfrastructure.toNumber()).to.equal(5020)
        //     await spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 13);
        //     const tx1 = await spyoperationscontract.fulfillRequest(0);
        //     let txReceipt1 = await tx1.wait(1);
        //     let requestId1 : any = txReceipt1?.events?.[1].args?.requestId;
        //     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId1, spyoperationscontract.address);
        //     var infrastructureCount2 = await infrastructurecontract.getInfrastructureCount(1);
        //     // console.log("infrastructureCount2", infrastructureCount2.toNumber())
        //     expect(infrastructureCount2.toNumber()).to.equal(5014)
        //     var attackerInfrastructure2 = await infrastructurecontract.getInfrastructureCount(0);
        //     // console.log("attackerInfrastructure2", attackerInfrastructure2.toNumber())
        //     expect(attackerInfrastructure2.toNumber()).to.equal(5026)
        // })
        // it("tests spy operations #14 destroy nukes", async function () {
        //     await expect(spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 14)).to.be.revertedWith("defender does not have enough nukes to conduct operation")
        //     await resourcescontract.mockResourcesForTesting(1, 17, 1)
        //     await technologymarketcontrat.connect(signer2).buyTech(1, 35000);
        //     await technologymarketcontrat.connect(signer1).buyTech(0, 500000);
        //     await missilescontract.connect(signer2).buyNukes(1)
        //     await keepercontract.incrementGameDay()
        //     await missilescontract.connect(signer2).buyNukes(1)
        //     await keepercontract.incrementGameDay()
        //     await missilescontract.connect(signer2).buyNukes(1)
        //     await keepercontract.incrementGameDay()
        //     await missilescontract.connect(signer2).buyNukes(1)
        //     await keepercontract.incrementGameDay()
        //     await missilescontract.connect(signer2).buyNukes(1)
        //     await keepercontract.incrementGameDay()
        //     var nukeCount = await missilescontract.getNukeCount(1);
        //     // console.log("nukeCount", nukeCount.toNumber())
        //     expect(nukeCount.toNumber()).to.equal(5)
        //     spyoperationscontract.connect(signer1).conductSpyOperation(0, 1, 14)
        //     const tx1 = await spyoperationscontract.fulfillRequest(0);
        //     let txReceipt1 = await tx1.wait(1);
        //     let requestId1 : any = txReceipt1?.events?.[1].args?.requestId;
        //     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId1, spyoperationscontract.address);
        //     var nukeCount2 = await missilescontract.getNukeCount(1);
        //     // console.log("nukeCount2", nukeCount2.toNumber())
        //     expect(nukeCount2.toNumber()).to.equal(4)
        // })
    });
});
