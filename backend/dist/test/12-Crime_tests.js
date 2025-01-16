"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const helper_hardhat_config_1 = require("../helper-hardhat-config");
const helper_hardhat_config_2 = require("../helper-hardhat-config");
describe("Crime", function () {
    // const oracleAbi = OracleArtifact.abi;
    // const linkTokenAbi = LinkTokenArtifact.abi;
    let warbucks;
    let metanationsgovtoken;
    let aidcontract;
    let airbattlecontract;
    let additionalairbattle;
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
    let testContract;
    let linkToken;
    beforeEach(async function () {
        // console.log("hello world")
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
        const AdditionalAirBattleContract = await hardhat_1.ethers.getContractFactory("AdditionalAirBattle");
        additionalairbattle = await AdditionalAirBattleContract.deploy();
        await additionalairbattle.deployed();
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
        spyoperationscontract = await SpyOperationsContract.deploy();
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
        await airbattlecontract.settings(warcontract.address, fighterscontract.address, bomberscontract.address, infrastructurecontract.address, forcescontract.address, fighterlosses.address, countryminter.address, additionalairbattle.address);
        await additionalairbattle.settings(warcontract.address, fighterscontract.address, bomberscontract.address, infrastructurecontract.address, forcescontract.address, fighterlosses.address, countryminter.address, airbattlecontract.address);
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
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, resourcescontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, countryparameterscontract.address);
        }
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(2100000000000000000000000));
        await countryminter.connect(signer1).generateCountry("TestRuler", "TestNationName", "TestCapitalCity", "TestNationSlogan");
        const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
        const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
        for (const log of event1Logs) {
            const requestIdReturn = log.args.requestId;
            // console.log(Number(requestIdReturn), "requestIdReturn for Event");
            if (requestIdReturn == 2) {
                await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                let resources1 = await resourcescontract.getPlayerResources(0);
                // console.log("resources 1", resources1[0].toNumber(), resources1[1].toNumber());
            }
        }
        await warbucks.connect(signer0).approve(warbucks.address, BigInt(3000000000 * (10 ** 18)));
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(3000000000 * (10 ** 18)));
        await treasurycontract.connect(signer1).addFunds(BigInt(2000000000 * (10 ** 18)), 0);
    });
    describe("Crime Contract", function () {
        it("crime1 tests that nation crime is inialized correctly", async function () {
            const cpsInitial = await crimecontract.getCrimePreventionScore(0);
            // console.log("initial CPS", cpsInitial.toNumber());
            (0, chai_1.expect)(cpsInitial.toNumber()).to.equal(458);
            const initialCrimeIndex = await crimecontract.getCrimeIndex(0);
            // console.log("initial crime index", initialCrimeIndex.toNumber());
            (0, chai_1.expect)(initialCrimeIndex.toNumber()).to.equal(1);
            const populationCount = await infrastructurecontract.getTotalPopulationCount(0);
            // console.log("initial population count", populationCount.toNumber());
            (0, chai_1.expect)(populationCount.toNumber()).to.equal(168);
            const initialCriminalCount = await crimecontract.getCriminalCount(0);
            // console.log("inital criminal count", initialCriminalCount.toString());
            (0, chai_1.expect)(initialCriminalCount[0].toNumber()).to.equal(3);
        });
        it("crime1 tests that population and infrastructure affects cps", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 200);
            var popPoints1 = await crimecontract.getPointsFromPopulation(0);
            var infPoints1 = await crimecontract.getPointsFromInfrastruture(0);
            var cps1 = await crimecontract.getCrimePreventionScore(0);
            var crimeIndex1 = await crimecontract.getCrimeIndex(0);
            var criminalCount1 = await crimecontract.getCriminalCount(0);
            // console.log("points from population", popPoints1.toNumber());
            // console.log("points from infrastructure", infPoints1.toNumber());
            // console.log("cps 1", cps1.toNumber());
            // console.log("crime index 1", crimeIndex1.toNumber());
            // console.log("criminal count 1", criminalCount1.toString());
            (0, chai_1.expect)(popPoints1.toNumber()).to.equal(343);
            (0, chai_1.expect)(infPoints1.toNumber()).to.equal(0);
            (0, chai_1.expect)(cps1.toNumber()).to.equal(451);
            (0, chai_1.expect)(crimeIndex1.toNumber()).to.equal(1);
            (0, chai_1.expect)(criminalCount1[0].toNumber()).to.equal(36);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 30000);
            var popPoints3 = await crimecontract.getPointsFromPopulation(0);
            var infPoints3 = await crimecontract.getPointsFromInfrastruture(0);
            var cps3 = await crimecontract.getCrimePreventionScore(0);
            var crimeIndex3 = await crimecontract.getCrimeIndex(0);
            var criminalCount3 = await crimecontract.getCriminalCount(0);
            // console.log("points from population", popPoints3.toNumber());
            // console.log("points from infrastructure", infPoints3.toNumber());
            // console.log("cps 3", cps3.toNumber());
            // console.log("crime index 3", crimeIndex3.toNumber());
            // console.log("criminal count 3", criminalCount3.toString());
            (0, chai_1.expect)(popPoints3.toNumber()).to.equal(0);
            (0, chai_1.expect)(infPoints3.toNumber()).to.equal(75);
            (0, chai_1.expect)(cps3.toNumber()).to.equal(183);
            (0, chai_1.expect)(crimeIndex3.toNumber()).to.equal(6);
            (0, chai_1.expect)(criminalCount3[0].toNumber()).to.equal(17769);
        });
        it("crime1 tests that government affects criminal count", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 25000);
            var govPoints1 = await crimecontract.getPointsFromGovernmentType(0);
            var cps1 = await crimecontract.getCrimePreventionScore(0);
            var crimeIndex1 = await crimecontract.getCrimeIndex(0);
            var criminalCount1 = await crimecontract.getCriminalCount(0);
            // console.log("points from population", popPoints3.toNumber());
            // console.log("points from infrastructure", infPoints3.toNumber());
            // console.log("cps 3", cps3.toNumber());
            // console.log("crime index 3", crimeIndex3.toNumber());
            // console.log("criminal count 3", criminalCount3.toNumber());
            // console.log("gov points 1", govPoints1.toNumber());
            (0, chai_1.expect)(cps1.toNumber()).to.equal(170);
            (0, chai_1.expect)(crimeIndex1.toNumber()).to.equal(6);
            (0, chai_1.expect)(criminalCount1[0].toNumber()).to.equal(14711);
            (0, chai_1.expect)(govPoints1.toNumber()).to.equal(50);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await countryparameterscontract.connect(signer1).setGovernment(0, 4);
            var cps3 = await crimecontract.getCrimePreventionScore(0);
            var crimeIndex3 = await crimecontract.getCrimeIndex(0);
            var criminalCount3 = await crimecontract.getCriminalCount(0);
            var govPoints2 = await crimecontract.getPointsFromGovernmentType(0);
            // console.log("gov points 2", govPoints2.toNumber());
            (0, chai_1.expect)(cps3.toNumber()).to.equal(295);
            (0, chai_1.expect)(crimeIndex3.toNumber()).to.equal(4);
            (0, chai_1.expect)(criminalCount3[0].toNumber()).to.equal(10508);
            (0, chai_1.expect)(govPoints2.toNumber()).to.equal(175);
        });
        it("crime1 tests that literacy affects criminal count", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 25000);
            var initialLiteracyPercentage = await crimecontract.getLiteracy(0);
            var initialLiteracyPoints = await crimecontract.getLiteracyPoints(0);
            // console.log("initial literacy points", initialLiteracyPoints.toNumber());
            // console.log("initial literacy percentage", initialLiteracyPercentage.toNumber());
            var criminalCount1 = await crimecontract.getCriminalCount(0);
            // console.log("criminal count 1", criminalCount1[0].toNumber());
            (0, chai_1.expect)(criminalCount1[0].toNumber()).to.equal(14711);
            (0, chai_1.expect)(initialLiteracyPercentage.toNumber()).to.equal(20);
            (0, chai_1.expect)(initialLiteracyPoints.toNumber()).to.equal(16);
            await technologymarketcontrat.connect(signer1).buyTech(0, 200);
            var updatedLiteracyPercentage = await crimecontract.getLiteracy(0);
            var updatedLiteracyPoints = await crimecontract.getLiteracyPoints(0);
            (0, chai_1.expect)(updatedLiteracyPercentage.toNumber()).to.equal(70);
            (0, chai_1.expect)(updatedLiteracyPoints.toNumber()).to.equal(56);
            var criminalCount3 = await crimecontract.getCriminalCount(0);
            // console.log("criminal count 3", criminalCount3[0].toNumber());
            (0, chai_1.expect)(criminalCount3[0].toNumber()).to.equal(12610);
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract3.connect(signer1).buyImprovement3(3, 0, 6);
            await improvementscontract3.connect(signer1).buyImprovement3(2, 0, 11);
            var literacyAfterSchools = await crimecontract.getLiteracy(0);
            // console.log("lit after school and unis", literacyAfterSchools.toNumber());
            (0, chai_1.expect)(literacyAfterSchools.toNumber()).to.equal(79);
            await wonderscontract2.connect(signer1).buyWonder2(0, 3);
            var literacyAfterGreatUni = await crimecontract.getLiteracy(0);
            // console.log("lit after great uni", literacyAfterGreatUni.toNumber());
            (0, chai_1.expect)(literacyAfterGreatUni.toNumber()).to.equal(89);
            await technologymarketcontrat.connect(signer1).buyTech(0, 5000);
            var literacyAfterTech = await crimecontract.getLiteracy(0);
            // console.log("lit after tech", literacyAfterTech.toNumber());
            (0, chai_1.expect)(literacyAfterTech.toNumber()).to.equal(100);
        });
        it("crime1 tests that tax rate affects criminal count", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 5000);
            var criminalCount1 = await crimecontract.getCriminalCount(0);
            // console.log(criminalCount1.toNumber());
            var cps1 = await crimecontract.getCrimePreventionScore(0);
            // console.log("cps 1", cps1.toNumber());
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract3.connect(signer1).buyImprovement3(3, 0, 6);
            await improvementscontract3.connect(signer1).buyImprovement3(2, 0, 9);
            await improvementscontract4.connect(signer1).buyImprovement4(5, 0, 6);
            await improvementscontract3.connect(signer1).buyImprovement3(2, 0, 3);
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 7);
            var improvementPoints1 = await crimecontract.getImprovementPoints(0);
            // console.log("imp points", improvementPoints1.toNumber());
            (0, chai_1.expect)(improvementPoints1.toNumber()).to.equal(39);
            var taxPoints = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("tax points", taxPoints.toNumber());
            (0, chai_1.expect)(taxPoints.toNumber()).to.equal(34);
            await infrastructurecontract.connect(signer1).setTaxRate(0, 28);
            var improvementPoints2 = await crimecontract.getImprovementPoints(0);
            // console.log("imp points 2", improvementPoints2.toNumber());
            (0, chai_1.expect)(improvementPoints2.toNumber()).to.equal(39);
            var taxPoints2 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("tax points 2", taxPoints2.toNumber());
            (0, chai_1.expect)(taxPoints2.toNumber()).to.equal(22);
        });
        it("crime1 tests that criminals get incarcerated", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 25000);
            var criminalCount1 = await crimecontract.getCriminalCount(0);
            (0, chai_1.expect)(criminalCount1[0].toNumber()).to.equal(14711);
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 7);
            var criminalCount2 = await crimecontract.getCriminalCount(0);
            (0, chai_1.expect)(criminalCount2[0].toNumber()).to.equal(14211);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 8);
            var criminalCount3 = await crimecontract.getCriminalCount(0);
            (0, chai_1.expect)(criminalCount3[0].toNumber()).to.equal(14011);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 1);
            var criminalCount4 = await crimecontract.getCriminalCount(0);
            (0, chai_1.expect)(criminalCount4[0].toNumber()).to.equal(9011);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            var criminalCount5 = await crimecontract.getCriminalCount(0);
            // console.log("criminal", criminalCount5.toNumber());
            (0, chai_1.expect)(criminalCount5[0].toNumber()).to.equal(8643);
        });
        it("crime1 tests that criminals get rehabilitated", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 8000);
            var criminalCount1 = await crimecontract.getCriminalCount(0);
            // console.log("criminal count 1", criminalCount1[0].toNumber());
            // console.log("rehabilitated 1", criminalCount1[1].toNumber());
            // console.log("incarcerated 1", criminalCount1[2].toNumber());
            (0, chai_1.expect)(criminalCount1[0].toNumber()).to.equal(4042);
            (0, chai_1.expect)(criminalCount1[1].toNumber()).to.equal(0);
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 4);
            var criminalCount2 = await crimecontract.getCriminalCount(0);
            // console.log("criminal count 2", criminalCount2[0].toNumber());
            // console.log("rehabilitated 2", criminalCount2[1].toNumber());
            // console.log("incarcerated 2", criminalCount2[2].toNumber());
            (0, chai_1.expect)(criminalCount2[0].toNumber()).to.equal(3042);
            (0, chai_1.expect)(criminalCount2[1].toNumber()).to.equal(1000);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 4);
            var criminalCount3 = await crimecontract.getCriminalCount(0);
            // console.log("criminal count 3", criminalCount3[0].toNumber());
            // console.log("rehabilitated 3", criminalCount3[1].toNumber());
            // console.log("incarcerated 3", criminalCount3[2].toNumber());
            (0, chai_1.expect)(criminalCount3[0].toNumber()).to.equal(2042);
            (0, chai_1.expect)(criminalCount3[1].toNumber()).to.equal(2000);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 4);
            var criminalCount4 = await crimecontract.getCriminalCount(0);
            // console.log("criminal count 4", criminalCount4[0].toNumber());
            // console.log("rehabilitated 4", criminalCount4[1].toNumber());
            // console.log("incarcerated 4", criminalCount4[2].toNumber());
            (0, chai_1.expect)(criminalCount4[0].toNumber()).to.equal(1042);
            (0, chai_1.expect)(criminalCount4[1].toNumber()).to.equal(3000);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 4);
            var criminalCount5 = await crimecontract.getCriminalCount(0);
            // console.log("criminal count 5", criminalCount5[0].toNumber());
            // console.log("rehabilitated 5", criminalCount5[1].toNumber());
            // console.log("incarcerated 5", criminalCount5[2].toNumber());
            (0, chai_1.expect)(criminalCount5[0].toNumber()).to.equal(42);
            (0, chai_1.expect)(criminalCount5[1].toNumber()).to.equal(4000);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 4);
            var criminalCount5 = await crimecontract.getCriminalCount(0);
            // console.log("criminal count 5", criminalCount5[0].toNumber());
            // console.log("rehabilitated 5", criminalCount5[1].toNumber());
            // console.log("incarcerated 5", criminalCount5[2].toNumber());
            (0, chai_1.expect)(criminalCount5[0].toNumber()).to.equal(0);
            (0, chai_1.expect)(criminalCount5[1].toNumber()).to.equal(4042);
        });
        it("crime1 tests that criminals get zeroed if theres a surplus of room for incarceration", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 25000);
            var criminalCount1 = await crimecontract.getCriminalCount(0);
            // console.log("criminal count 1", criminalCount1[0].toNumber());
            // console.log("rehabilitated 1", criminalCount1[1].toNumber());
            // console.log("incarcerated 1", criminalCount1[2].toNumber());
            (0, chai_1.expect)(criminalCount1[0].toNumber()).to.equal(14711);
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 1);
            var criminalCount2 = await crimecontract.getCriminalCount(0);
            // console.log("criminal count 2", criminalCount2[0].toNumber());
            // console.log("rehabilitated 2", criminalCount2[1].toNumber());
            // console.log("incarcerated 2", criminalCount2[2].toNumber());
            (0, chai_1.expect)(criminalCount2[0].toNumber()).to.equal(9711);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 1);
            var criminalCount3 = await crimecontract.getCriminalCount(0);
            // console.log("criminal count 3", criminalCount3[0].toNumber());
            // console.log("rehabilitated 3", criminalCount3[1].toNumber());
            // console.log("incarcerated 3", criminalCount3[2].toNumber());
            (0, chai_1.expect)(criminalCount3[0].toNumber()).to.equal(4711);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 1);
            var criminalCount4 = await crimecontract.getCriminalCount(0);
            // console.log("criminal count 4", criminalCount4[0].toNumber());
            // console.log("rehabilitated 4", criminalCount4[1].toNumber());
            // console.log("incarcerated 4", criminalCount4[2].toNumber());
            (0, chai_1.expect)(criminalCount4[0].toNumber()).to.equal(0);
        });
        it("crime1 tests that all crime indices are attainable", async function () {
            var cps = await crimecontract.getCrimePreventionScore(0);
            // console.log("cps0", cps.toNumber()); 
            var crimeIndex0 = await crimecontract.getCrimeIndex(0);
            // console.log("crimeIndex0", crimeIndex0.toNumber());
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
            var cps1 = await crimecontract.getCrimePreventionScore(0);
            // console.log("cps1", cps1.toNumber());
            var crimeIndex1 = await crimecontract.getCrimeIndex(0);
            // console.log("crimeIndex1", crimeIndex1.toNumber());   
            (0, chai_1.expect)(crimeIndex1.toNumber()).to.equal(6);
            await infrastructuremarketplace.connect(signer1).destroyInfrastructure(0, 3000);
            var cps2 = await crimecontract.getCrimePreventionScore(0);
            // console.log("cps2", cps2.toNumber());
            var crimeIndex2 = await crimecontract.getCrimeIndex(0);
            // console.log("crimeIndex2", crimeIndex2.toNumber());
            (0, chai_1.expect)(crimeIndex2.toNumber()).to.equal(5);
            await infrastructuremarketplace.connect(signer1).destroyInfrastructure(0, 1000);
            var cps3 = await crimecontract.getCrimePreventionScore(0);
            // console.log("cps3", cps3.toNumber());
            var crimeIndex3 = await crimecontract.getCrimeIndex(0);
            // console.log("crimeIndex3", crimeIndex3.toNumber());
            (0, chai_1.expect)(crimeIndex3.toNumber()).to.equal(4);
            await infrastructuremarketplace.connect(signer1).destroyInfrastructure(0, 2000);
            var cps4 = await crimecontract.getCrimePreventionScore(0);
            // console.log("cps4", cps4.toNumber());
            var crimeIndex4 = await crimecontract.getCrimeIndex(0);
            // console.log("crimeIndex4", crimeIndex4.toNumber());
            (0, chai_1.expect)(crimeIndex4.toNumber()).to.equal(3);
            await infrastructuremarketplace.connect(signer1).destroyInfrastructure(0, 2000);
            var cps5 = await crimecontract.getCrimePreventionScore(0);
            // console.log("cps5", cps5.toNumber());
            var crimeIndex5 = await crimecontract.getCrimeIndex(0);
            // console.log("crimeIndex5", crimeIndex5.toNumber());
            (0, chai_1.expect)(crimeIndex5.toNumber()).to.equal(2);
            await infrastructuremarketplace.connect(signer1).destroyInfrastructure(0, 1000);
            var cps6 = await crimecontract.getCrimePreventionScore(0);
            // console.log("cps6", cps6.toNumber());
            var crimeIndex6 = await crimecontract.getCrimeIndex(0);
            // console.log("crimeIndex6", crimeIndex6.toNumber());
            (0, chai_1.expect)(crimeIndex6.toNumber()).to.equal(1);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await countryparameterscontract.connect(signer1).setGovernment(0, 9);
            var cps7 = await crimecontract.getCrimePreventionScore(0);
            // console.log("cps7", cps7.toNumber());
            var crimeIndex7 = await crimecontract.getCrimeIndex(0);
            // console.log("crimeIndex7", crimeIndex7.toNumber());
            (0, chai_1.expect)(crimeIndex7.toNumber()).to.equal(0);
        });
        it("crime1 tests that each government has a different CPS", async function () {
            var govType0 = await countryparameterscontract.getGovernmentType(0);
            // console.log("govType0", govType0.toNumber());
            var cpsPointsFromGovermnent0 = await crimecontract.getPointsFromGovernmentType(0);
            // console.log("cpsPointsFromGovermnent0", cpsPointsFromGovermnent0.toNumber());
            (0, chai_1.expect)(cpsPointsFromGovermnent0.toNumber()).to.equal(50);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await countryparameterscontract.connect(signer1).setGovernment(0, 1);
            var govType1 = await countryparameterscontract.getGovernmentType(0);
            // console.log("govType1", govType1.toNumber());
            var cpsPointsFromGovermnent1 = await crimecontract.getPointsFromGovernmentType(0);
            // console.log("cpsPointsFromGovermnent1", cpsPointsFromGovermnent1.toNumber());
            (0, chai_1.expect)(cpsPointsFromGovermnent1.toNumber()).to.equal(110);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await countryparameterscontract.connect(signer1).setGovernment(0, 2);
            var govType2 = await countryparameterscontract.getGovernmentType(0);
            // console.log("govType2", govType2.toNumber());
            var cpsPointsFromGovermnent2 = await crimecontract.getPointsFromGovernmentType(0);
            // console.log("cpsPointsFromGovermnent2", cpsPointsFromGovermnent2.toNumber());
            (0, chai_1.expect)(cpsPointsFromGovermnent2.toNumber()).to.equal(150);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await countryparameterscontract.connect(signer1).setGovernment(0, 3);
            var govType3 = await countryparameterscontract.getGovernmentType(0);
            // console.log("govType3", govType3.toNumber());
            var cpsPointsFromGovermnent3 = await crimecontract.getPointsFromGovernmentType(0);
            // console.log("cpsPointsFromGovermnent3", cpsPointsFromGovermnent3.toNumber());
            (0, chai_1.expect)(cpsPointsFromGovermnent3.toNumber()).to.equal(120);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await countryparameterscontract.connect(signer1).setGovernment(0, 4);
            var govType4 = await countryparameterscontract.getGovernmentType(0);
            // console.log("govType4", govType4.toNumber());
            var cpsPointsFromGovermnent4 = await crimecontract.getPointsFromGovernmentType(0);
            // console.log("cpsPointsFromGovermnent4", cpsPointsFromGovermnent4.toNumber());
            (0, chai_1.expect)(cpsPointsFromGovermnent4.toNumber()).to.equal(175);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await countryparameterscontract.connect(signer1).setGovernment(0, 5);
            var govType5 = await countryparameterscontract.getGovernmentType(0);
            // console.log("govType5", govType5.toNumber());
            var cpsPointsFromGovermnent5 = await crimecontract.getPointsFromGovernmentType(0);
            // console.log("cpsPointsFromGovermnent5", cpsPointsFromGovermnent5.toNumber());
            (0, chai_1.expect)(cpsPointsFromGovermnent5.toNumber()).to.equal(160);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await countryparameterscontract.connect(signer1).setGovernment(0, 6);
            var govType6 = await countryparameterscontract.getGovernmentType(0);
            // console.log("govType6", govType6.toNumber());
            var cpsPointsFromGovermnent6 = await crimecontract.getPointsFromGovernmentType(0);
            // console.log("cpsPointsFromGovermnent6", cpsPointsFromGovermnent6.toNumber());
            (0, chai_1.expect)(cpsPointsFromGovermnent6.toNumber()).to.equal(140);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await countryparameterscontract.connect(signer1).setGovernment(0, 7);
            var govType7 = await countryparameterscontract.getGovernmentType(0);
            // console.log("govType7", govType7.toNumber());
            var cpsPointsFromGovermnent7 = await crimecontract.getPointsFromGovernmentType(0);
            // console.log("cpsPointsFromGovermnent7", cpsPointsFromGovermnent7.toNumber());
            (0, chai_1.expect)(cpsPointsFromGovermnent7.toNumber()).to.equal(165);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await countryparameterscontract.connect(signer1).setGovernment(0, 8);
            var govType8 = await countryparameterscontract.getGovernmentType(0);
            // console.log("govType8", govType8.toNumber());
            var cpsPointsFromGovermnent8 = await crimecontract.getPointsFromGovernmentType(0);
            // console.log("cpsPointsFromGovermnent8", cpsPointsFromGovermnent8.toNumber());
            (0, chai_1.expect)(cpsPointsFromGovermnent8.toNumber()).to.equal(150);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await countryparameterscontract.connect(signer1).setGovernment(0, 9);
            var govType9 = await countryparameterscontract.getGovernmentType(0);
            // console.log("govType9", govType9.toNumber());
            var cpsPointsFromGovermnent9 = await crimecontract.getPointsFromGovernmentType(0);
            // console.log("cpsPointsFromGovermnent9", cpsPointsFromGovermnent9.toNumber());
            (0, chai_1.expect)(cpsPointsFromGovermnent9.toNumber()).to.equal(190);
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await countryparameterscontract.connect(signer1).setGovernment(0, 10);
            var govType10 = await countryparameterscontract.getGovernmentType(0);
            // console.log("govType10", govType10.toNumber());
            var cpsPointsFromGovermnent10 = await crimecontract.getPointsFromGovernmentType(0);
            // console.log("cpsPointsFromGovermnent10", cpsPointsFromGovermnent10.toNumber());
            (0, chai_1.expect)(cpsPointsFromGovermnent10.toNumber()).to.equal(100);
        });
        it("crime1 tests that each tax rate has a different CPS", async function () {
            var taxRate0 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate0", taxRate0.toNumber());
            var cpsPointsFromTaxRate0 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate0", cpsPointsFromTaxRate0.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate0.toNumber()).to.equal(34);
            await infrastructurecontract.connect(signer1).setTaxRate(0, 15);
            var taxRate15 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate15", taxRate15.toNumber());
            var cpsPointsFromTaxRate15 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate15", cpsPointsFromTaxRate15.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate15.toNumber()).to.equal(35);
            //taxRate17
            await infrastructurecontract.connect(signer1).setTaxRate(0, 17);
            var taxRate17 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate17", taxRate17.toNumber());
            var cpsPointsFromTaxRate17 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate17", cpsPointsFromTaxRate17.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate17.toNumber()).to.equal(33);
            //taxRate18
            await infrastructurecontract.connect(signer1).setTaxRate(0, 18);
            var taxRate18 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate18", taxRate18.toNumber());
            var cpsPointsFromTaxRate18 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate18", cpsPointsFromTaxRate18.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate18.toNumber()).to.equal(32);
            //taxRate19
            await infrastructurecontract.connect(signer1).setTaxRate(0, 19);
            var taxRate19 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate19", taxRate19.toNumber());
            var cpsPointsFromTaxRate19 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate19", cpsPointsFromTaxRate19.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate19.toNumber()).to.equal(31);
            //taxRate20
            await infrastructurecontract.connect(signer1).setTaxRate(0, 20);
            var taxRate20 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate20", taxRate20.toNumber());
            var cpsPointsFromTaxRate20 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate20", cpsPointsFromTaxRate20.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate20.toNumber()).to.equal(30);
            //taxRate21
            await infrastructurecontract.connect(signer1).setTaxRate(0, 21);
            var taxRate21 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate21", taxRate21.toNumber());
            var cpsPointsFromTaxRate21 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate21", cpsPointsFromTaxRate21.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate21.toNumber()).to.equal(29);
            //taxRate22
            await infrastructurecontract.connect(signer1).setTaxRate(0, 22);
            var taxRate22 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate22", taxRate22.toNumber());
            var cpsPointsFromTaxRate22 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate22", cpsPointsFromTaxRate22.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate22.toNumber()).to.equal(28);
            //taxRate23
            await infrastructurecontract.connect(signer1).setTaxRate(0, 23);
            var taxRate23 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate23", taxRate23.toNumber());
            var cpsPointsFromTaxRate23 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate23", cpsPointsFromTaxRate23.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate23.toNumber()).to.equal(27);
            //taxRate24
            await infrastructurecontract.connect(signer1).setTaxRate(0, 24);
            var taxRate24 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate24", taxRate24.toNumber());
            var cpsPointsFromTaxRate24 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate24", cpsPointsFromTaxRate24.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate24.toNumber()).to.equal(26);
            //taxRate25
            await infrastructurecontract.connect(signer1).setTaxRate(0, 25);
            var taxRate25 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate25", taxRate25.toNumber());
            var cpsPointsFromTaxRate25 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate25", cpsPointsFromTaxRate25.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate25.toNumber()).to.equal(25);
            //taxRate26
            await infrastructurecontract.connect(signer1).setTaxRate(0, 26);
            var taxRate26 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate26", taxRate26.toNumber());
            var cpsPointsFromTaxRate26 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate26", cpsPointsFromTaxRate26.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate26.toNumber()).to.equal(24);
            //taxRate27
            await infrastructurecontract.connect(signer1).setTaxRate(0, 27);
            var taxRate27 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate27", taxRate27.toNumber());
            var cpsPointsFromTaxRate27 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate27", cpsPointsFromTaxRate27.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate27.toNumber()).to.equal(23);
            //taxRate28
            await infrastructurecontract.connect(signer1).setTaxRate(0, 28);
            var taxRate28 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate28", taxRate28.toNumber());
            var cpsPointsFromTaxRate28 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate28", cpsPointsFromTaxRate28.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate28.toNumber()).to.equal(22);
            //taxRate29
            await wonderscontract4.connect(signer1).buyWonder4(0, 1);
            await infrastructurecontract.connect(signer1).setTaxRate(0, 29);
            var taxRate29 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate29", taxRate29.toNumber());
            var cpsPointsFromTaxRate29 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate29", cpsPointsFromTaxRate29.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate29.toNumber()).to.equal(21);
            //taxRate30
            await infrastructurecontract.connect(signer1).setTaxRate(0, 30);
            var taxRate30 = await infrastructurecontract.getTaxRate(0);
            // console.log("taxRate30", taxRate30.toNumber());
            var cpsPointsFromTaxRate30 = await crimecontract.getTaxRateCrimeMultiplier(0);
            // console.log("cpsPointsFromTaxRate30", cpsPointsFromTaxRate30.toNumber());
            (0, chai_1.expect)(cpsPointsFromTaxRate30.toNumber()).to.equal(20);
        });
    });
});
