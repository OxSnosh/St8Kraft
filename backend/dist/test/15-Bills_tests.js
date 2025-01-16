"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const helper_hardhat_config_1 = require("../helper-hardhat-config");
const helper_hardhat_config_2 = require("../helper-hardhat-config");
describe("Bills", function () {
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
        await warbucks.connect(signer0).approve(warbucks.address, BigInt(25000000000 * (10 ** 18)));
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(25000000000 * (10 ** 18)));
        await treasurycontract.connect(signer1).addFunds(BigInt(20000000000 * (10 ** 18)), 0);
        await warbucks.connect(signer0).transfer(signer2.address, BigInt(2100000000000000000000000));
        await countryminter.connect(signer2).generateCountry("TestRuler2", "TestNationName2", "TestCapitalCity2", "TestNationSlogan2");
        await warbucks.connect(signer0).transfer(signer3.address, BigInt(2100000000000000000000000));
        await countryminter.connect(signer3).generateCountry("TestRuler3", "TestNationName3", "TestCapitalCity3", "TestNationSlogan3");
        await warbucks.connect(signer0).transfer(signer4.address, BigInt(2100000000000000000000000));
        await countryminter.connect(signer4).generateCountry("TestRuler4", "TestNationName4", "TestCapitalCity4", "TestNationSlogan4");
        await warbucks.connect(signer0).transfer(signer5.address, BigInt(2100000000000000000000000));
        await countryminter.connect(signer5).generateCountry("TestRuler5", "TestNationName5", "TestCapitalCity5", "TestNationSlogan5");
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
            else if (requestIdReturn == 4) {
                await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                let resources2 = await resourcescontract.getPlayerResources(1);
                // console.log("resources 2", resources2[0].toNumber(), resources2[1].toNumber());
            }
            else if (requestIdReturn == 6) {
                await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                let resources3 = await resourcescontract.getPlayerResources(2);
                // console.log("resources 3", resources3[0].toNumber(), resources3[1].toNumber());
            }
            else if (requestIdReturn == 8) {
                await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                let resources3 = await resourcescontract.getPlayerResources(3);
                // console.log("resources 3", resources3[0].toNumber(), resources3[1].toNumber());
            }
            else if (requestIdReturn == 10) {
                await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, resourcescontract.address);
                let resources3 = await resourcescontract.getPlayerResources(4);
                // console.log("resources 3", resources3[0].toNumber(), resources3[1].toNumber());
            }
        }
    });
    describe("Bills Contract Initialized", function () {
        it("bills1 tests that bills are initialized correctly", async function () {
            const initialBillsPayable1 = await billscontract.getBillsPayable(0);
            // console.log("bills payable", BigInt(initialBillsPayable1/(10**18)).toString());
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 200);
            const daysSince = await treasurycontract.getDaysSinceLastBillsPaid(0);
            // console.log("days since", daysSince.toNumber())
            const dailyIncome = await taxescontract.getDailyIncome(0);
            // console.log("daily income", BigInt(dailyIncome));
            const taxRate = await infrastructurecontract.getTaxRate(0);
            // console.log("tax rate", taxRate.toNumber());
            const happiness = await taxescontract.getHappiness(0);
            // console.log("happiness", happiness.toNumber());
            await keepercontract.incrementGameDay();
            const billsPayable = await billscontract.getBillsPayable(0);
            // console.log("bills payable", BigInt(billsPayable/(10**18)));
            (0, chai_1.expect)(BigInt(billsPayable / (10 ** 18)).toString()).to.equal("6420");
            const startingBalance = await treasurycontract.checkBalance(0);
            // console.log("starting balance", BigInt(startingBalance/(10**18)));
            (0, chai_1.expect)(BigInt(startingBalance / (10 ** 18)).toString()).to.equal("20001859400");
            const initialBillsPayable = await billscontract.getBillsPayable(0);
            // console.log("updated bills payable", BigInt(initialBillsPayable/(10**18)));
            (0, chai_1.expect)(BigInt(initialBillsPayable / (10 ** 18)).toString()).to.equal("6420");
            await billscontract.connect(signer1).payBills(0);
            const endingBalance = await treasurycontract.checkBalance(0);
            // console.log("ending balance", endingBalance/(10**18));
            (0, chai_1.expect)((endingBalance / (10 ** 18)).toString()).to.equal("20001852980");
            const updatedBillsPayable = await billscontract.getBillsPayable(0);
            // console.log("updated bills payable", BigInt(updatedBillsPayable/(10**18)));
            (0, chai_1.expect)(BigInt(updatedBillsPayable / (10 ** 18)).toString()).to.equal("0");
            const infrastructureBills = await billscontract.calculateDailyBillsFromInfrastructure(0);
            // console.log("daily inf bills", BigInt(infrastructureBills/(10**18)));
            (0, chai_1.expect)(BigInt(infrastructureBills / (10 ** 18)).toString()).to.equal("6380");
            const militaryBills = await billscontract.calculateDailyBillsFromMilitary(0);
            // console.log("military bills", BigInt(militaryBills/(10**18)));
            (0, chai_1.expect)(BigInt(militaryBills / (10 ** 18)).toString()).to.equal("40");
            const improvementBills = await billscontract.calculateDailyBillsFromImprovements(0);
            // console.log("improvement bills", BigInt(improvementBills/(10**18)));
            const wonderBills = await billscontract.calculateWonderBillsPayable(0);
            // console.log("wonder bills", BigInt(wonderBills/(10**18)));
        });
    });
    describe("Infrastructure Bills", function () {
        it("bills2 tests that cost per level works appropriately", async function () {
            const infrastructureAmountInitial = await infrastructurecontract.getInfrastructureCount(0);
            // console.log("initial infrastructire", infrastructureAmountInitial.toNumber());
            const costPerLevel20 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 20", BigInt(costPerLevel20/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel20 / (10 ** 18)).toString()).to.equal("18");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 80);
            const costPerLevel100 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 100", BigInt(costPerLevel100/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel100 / (10 ** 18)).toString()).to.equal("22");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 60);
            const costPerLevel160 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 160", BigInt(costPerLevel160/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel160 / (10 ** 18)).toString()).to.equal("25");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 40);
            const costPerLevel200 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 200", BigInt(costPerLevel200/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel200 / (10 ** 18)).toString()).to.equal("28");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 100);
            const costPerLevel300 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 300", BigInt(costPerLevel300/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel300 / (10 ** 18)).toString()).to.equal("36");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 200);
            const costPerLevel500 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 500", BigInt(costPerLevel500/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel500 / (10 ** 18)).toString()).to.equal("54");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 200);
            const costPerLevel700 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 700", BigInt(costPerLevel700/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel700 / (10 ** 18)).toString()).to.equal("74");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 300);
            const costPerLevel1000 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 1000", BigInt(costPerLevel1000/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel1000 / (10 ** 18)).toString()).to.equal("117");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            const costPerLevel2000 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 2000", BigInt(costPerLevel2000/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel2000 / (10 ** 18)).toString()).to.equal("252");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            const costPerLevel3000 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 3000", BigInt(costPerLevel3000/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel3000 / (10 ** 18)).toString()).to.equal("423");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            const costPerLevel4000 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 4000", BigInt(costPerLevel4000/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel4000 / (10 ** 18)).toString()).to.equal("630");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            const costPerLevel5000 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 5000", BigInt(costPerLevel5000/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel5000 / (10 ** 18)).toString()).to.equal("793");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 3000);
            const costPerLevel8000 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 8000", BigInt(costPerLevel8000/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel8000 / (10 ** 18)).toString()).to.equal("1278");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 7000);
            const costPerLevel15000 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 15000", BigInt(costPerLevel15000/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel15000 / (10 ** 18)).toString()).to.equal("2448");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
            const costPerLevel25000 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 25000", BigInt(costPerLevel25000/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel25000 / (10 ** 18)).toString()).to.equal("4068");
        });
        it("bills2 tests that cost per level gets reduced with resources and improvements", async function () {
            await billscontract.connect(signer1).payBills(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            var costPerLevel1000 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost at 1000", BigInt(costPerLevel1000/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel1000 / (10 ** 18)).toString()).to.equal("118");
            await resourcescontract.mockResourcesForTesting(0, 7, 4);
            var costPerLevel1000 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost iron", BigInt(costPerLevel1000/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel1000 / (10 ** 18)).toString()).to.equal("118");
            await resourcescontract.mockResourcesForTesting(0, 9, 4);
            var costPerLevel1000 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost lumber", BigInt(costPerLevel1000/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel1000 / (10 ** 18)).toString()).to.equal("121");
            await resourcescontract.mockResourcesForTesting(0, 17, 4);
            var costPerLevel1000 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost uranium", BigInt(costPerLevel1000/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel1000 / (10 ** 18)).toString()).to.equal("128");
            await improvementscontract2.connect(signer1).buyImprovement2(5, 0, 8);
            var costPerLevel1000 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost 5 labor camps", BigInt(costPerLevel1000/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel1000 / (10 ** 18)).toString()).to.equal("62");
            await improvementscontract2.connect(signer1).deleteImprovement2(5, 0, 8);
            await wonderscontract2.connect(signer1).buyWonder2(0, 7);
            var costPerLevel1000 = await billscontract.calculateInfrastructureCostPerLevel(0);
            // console.log("level cost intersate system", BigInt(costPerLevel1000/(10**18)));
            (0, chai_1.expect)(BigInt(costPerLevel1000 / (10 ** 18)).toString()).to.equal("117");
        });
    });
    describe("Military Bills", function () {
        it("bills3 tests that an accomodative government will reduce military bills by 5%", async function () {
            await billscontract.connect(signer1).payBills(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            await forcescontract.connect(signer1).buySoldiers(1980, 0);
            var soldierCount = await forcescontract.getSoldierCount(0);
            // console.log("soldier count", soldierCount.toNumber());
            const soldierUpkeep1 = await billscontract.getSoldierUpkeep(0);
            // console.log("soldier upkeep", BigInt(soldierUpkeep1));
            (0, chai_1.expect)(soldierUpkeep1 / (10 ** 18)).to.equal(4000);
            const dailyBillsFromMilitary = await billscontract.calculateDailyBillsFromMilitary(0);
            // console.log("daily military bills", BigInt(dailyBillsFromMilitary/(10**18)));
            (0, chai_1.expect)(dailyBillsFromMilitary / (10 ** 18)).to.equal(4000);
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
            const soldierUpkeep2 = await billscontract.getSoldierUpkeep(0);
            //soldier upkeep alone will not be modified by government type
            // console.log("soldier upkeep accomodative", BigInt(soldierUpkeep2));
            const dailyBillsFromMilitary2 = await billscontract.calculateDailyBillsFromMilitary(0);
            // console.log("daily military bills accomodative", BigInt(dailyBillsFromMilitary2/(10**18)));
            (0, chai_1.expect)(dailyBillsFromMilitary2 / (10 ** 18)).to.equal(3800);
        });
        it("bills3 tests soldiers increase bills correctly", async function () {
            await billscontract.connect(signer1).payBills(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            await forcescontract.connect(signer1).buySoldiers(1980, 0);
            var soldierCount = await forcescontract.getSoldierCount(0);
            // console.log("soldier count", soldierCount.toNumber());
            const soldierUpkeep1 = await billscontract.getSoldierUpkeep(0);
            // console.log("soldier upkeep", BigInt(soldierUpkeep1));
            (0, chai_1.expect)(soldierUpkeep1 / (10 ** 18)).to.equal(4000);
            await resourcescontract.mockResourcesForTesting(0, 8, 4);
            const soldierUpkeep2 = await billscontract.getSoldierUpkeep(0);
            // console.log("soldier after lead", BigInt(soldierUpkeep2));
            (0, chai_1.expect)(soldierUpkeep2 / (10 ** 18)).to.equal(3400);
            await resourcescontract.mockResourcesForTesting(0, 8, 12);
            const soldierUpkeep3 = await billscontract.getSoldierUpkeep(0);
            // console.log("soldier after lead and pigs", BigInt(soldierUpkeep3));
            (0, chai_1.expect)(soldierUpkeep3 / (10 ** 18)).to.equal(3000);
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 3);
            const soldierUpkeep4 = await billscontract.getSoldierUpkeep(0);
            // console.log("soldier after barracks", BigInt(soldierUpkeep4));
            (0, chai_1.expect)(soldierUpkeep4 / (10 ** 18)).to.equal(2040);
            await improvementscontract2.connect(signer1).buyImprovement2(5, 0, 3);
            const soldierUpkeep5 = await billscontract.getSoldierUpkeep(0);
            // console.log("soldier after guerilla camp", BigInt(soldierUpkeep5));
            (0, chai_1.expect)(soldierUpkeep5 / (10 ** 18)).to.equal(1040);
        });
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
            var tankUpkeep = await billscontract.getTankUpkeep(0);
            // console.log("tank upkeep", BigInt(tankUpkeep.toString()));
            (0, chai_1.expect)(tankUpkeep / (10 ** 18)).to.equal(7200);
            await resourcescontract.mockResourcesForTesting(0, 7, 4);
            var tankUpkeep = await billscontract.getTankUpkeep(0);
            // console.log("tank upkeep with iron", BigInt(tankUpkeep.toString()));
            (0, chai_1.expect)(tankUpkeep / (10 ** 18)).to.equal(7200);
            await resourcescontract.mockResourcesForTesting(0, 7, 11);
            var tankUpkeep = await billscontract.getTankUpkeep(0);
            // console.log("tank upkeep with iron and oil", BigInt(tankUpkeep.toString()));
            (0, chai_1.expect)(tankUpkeep / (10 ** 18)).to.equal(6400);
            await resourcescontract.mockResourcesForTesting(0, 4, 8);
            var tankUpkeep = await billscontract.getTankUpkeep(0);
            // console.log("tank upkeep with lead and iron", BigInt(tankUpkeep.toString()));
            (0, chai_1.expect)(tankUpkeep / (10 ** 18)).to.equal(7360);
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await wonderscontract4.connect(signer1).buyWonder4(0, 5);
            var tankUpkeep = await billscontract.getTankUpkeep(0);
            // console.log("tank upkeep with logistical support", BigInt(tankUpkeep.toString()));
            (0, chai_1.expect)(tankUpkeep / (10 ** 18)).to.equal(5760);
        });
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
            var nukeUpkeep = await billscontract.getNukeUpkeep(0);
            // console.log("nuke upkeep", BigInt(nukeUpkeep));
            (0, chai_1.expect)(nukeUpkeep / (10 ** 18)).to.equal(15000);
            await resourcescontract.mockResourcesForTesting(0, 15, 11);
            var nukeUpkeep = await billscontract.getNukeUpkeep(0);
            // console.log("nuke upkeep no uranium", BigInt(nukeUpkeep));
            (0, chai_1.expect)(nukeUpkeep / (10 ** 18)).to.equal(30000);
            await resourcescontract.mockResourcesForTesting(0, 8, 11);
            var nukeUpkeep = await billscontract.getNukeUpkeep(0);
            // console.log("nuke upkeep with lead", BigInt(nukeUpkeep));
            (0, chai_1.expect)(nukeUpkeep / (10 ** 18)).to.equal(24000);
        });
        it("bills3 tests cruise missile upkeep", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 30000);
            await missilescontract.connect(signer1).buyCruiseMissiles(5, 0);
            var cruiseMissileUpkeep = await billscontract.getCruiseMissileUpkeep(0);
            // console.log("cruise missile upkeep", BigInt(cruiseMissileUpkeep));
            (0, chai_1.expect)(cruiseMissileUpkeep / (10 ** 18)).to.equal(2500);
            await resourcescontract.mockResourcesForTesting(0, 8, 11);
            var cruiseMissileUpkeep = await billscontract.getCruiseMissileUpkeep(0);
            // console.log("cruise missile upkeep after lead", BigInt(cruiseMissileUpkeep));
            (0, chai_1.expect)(cruiseMissileUpkeep / (10 ** 18)).to.equal(2000);
        });
        it("bills3 tests aircraft upkeep", async function () {
            await billscontract.connect(signer1).payBills(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 30000);
            await fightersmarketplace2.connect(signer1).buyF22Raptor(5, 0);
            var aircraftCount = await fighterscontract.getAircraftCount(0);
            // console.log(aircraftCount.toNumber());
            var aircraftUpkeep = await billscontract.getAircraftUpkeep(0);
            // console.log(BigInt(aircraftUpkeep), "aircraft upkeep");
            (0, chai_1.expect)(aircraftUpkeep / (10 ** 18)).to.equal(1000);
            await resourcescontract.mockResourcesForTesting(0, 8, 11);
            var aircraftUpkeep = await billscontract.getAircraftUpkeep(0);
            // console.log(BigInt(aircraftUpkeep), "aircraft upkeep after lead");
            (0, chai_1.expect)(aircraftUpkeep / (10 ** 18)).to.equal(750);
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 1);
            var aircraftUpkeep = await billscontract.getAircraftUpkeep(0);
            // console.log(BigInt(aircraftUpkeep), "upkeep after airport");
            (0, chai_1.expect)(aircraftUpkeep / (10 ** 18)).to.equal(690);
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await wonderscontract4.connect(signer1).buyWonder4(0, 5);
            var aircraftUpkeep = await billscontract.getAircraftUpkeep(0);
            // console.log(BigInt(aircraftUpkeep), "upkeep after logistical support");
            (0, chai_1.expect)(aircraftUpkeep / (10 ** 18)).to.equal(590);
        });
        it("bills3 tests navy upkeep", async function () {
            await billscontract.connect(signer1).payBills(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 20000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 30000);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 10);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 7);
            await improvementscontract4.connect(signer1).buyImprovement4(3, 0, 4);
            await wonderscontract1.connect(signer1).buyWonder1(0, 11);
            await navycontract.connect(signer1).buyCorvette(1, 0);
            var upkeep = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            await navycontract.connect(signer1).buyLandingShip(1, 0);
            var upkeep = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            await navycontract.connect(signer1).buyBattleship(1, 0);
            var upkeep = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            await keepercontract.incrementGameDay();
            await navycontract.connect(signer1).buyCruiser(1, 0);
            var upkeep = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            await navycontract2.connect(signer1).buyFrigate(1, 0);
            var upkeep = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            await keepercontract.incrementGameDay();
            await navycontract2.connect(signer1).buyDestroyer(1, 0);
            var upkeep = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            await navycontract2.connect(signer1).buySubmarine(1, 0);
            var upkeep = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            await keepercontract.incrementGameDay();
            await navycontract2.connect(signer1).buyAircraftCarrier(1, 0);
            var upkeep = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            (0, chai_1.expect)(upkeep / (10 ** 18)).to.equal(140000);
            await resourcescontract.mockResourcesForTesting(0, 17, 5);
            var upkeep = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            (0, chai_1.expect)(upkeep / (10 ** 18)).to.equal(137250);
            await resourcescontract.mockResourcesForTesting(0, 8, 11);
            var upkeep = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            (0, chai_1.expect)(upkeep / (10 ** 18)).to.equal(98000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await wonderscontract4.connect(signer1).buyWonder4(0, 5);
            var upkeep = await billscontract.getNavyUpkeep(0);
            // console.log(BigInt(upkeep));
            (0, chai_1.expect)(upkeep / (10 ** 18)).to.equal(83999.99999999999);
        });
    });
    describe("Wonders and Improvements Bills", function () {
        it("bills4 tests improvements increment bills correctly", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 5000);
            await billscontract.connect(signer1).payBills(0);
            var upkeep = await billscontract.calculateDailyBillsFromImprovements(0);
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 1);
            var upkeep = await billscontract.calculateDailyBillsFromImprovements(0);
            console.log(BigInt(upkeep / (10 ** 18)));
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
            var upkeep = await billscontract.calculateDailyBillsFromImprovements(0);
            console.log(BigInt(upkeep / (10 ** 18)));
            // expect(BigInt(upkeep/(10**18)).toString()).to.equal("17100");
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 12000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 6);
            var upkeep = await billscontract.calculateDailyBillsFromImprovements(0);
            // console.log("this", BigInt(upkeep/(10**18)))
            (0, chai_1.expect)(BigInt(upkeep / (10 ** 18)).toString()).to.equal("16245");
            // checks that an accomodative government (1, 5, 8, 10) will reduce the cost of improvements by 5%
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await countryparameterscontract.connect(signer1).setGovernment(0, 1);
            var upkeep = await billscontract.calculateDailyBillsFromImprovements(0);
            // console.log("upkeep with accomodative government", BigInt(upkeep/(10**18)))
            // expect(BigInt(upkeep/(10**18)).toString()).to.equal("15390");
        });
        it("bills4 tests that improvement cost per level increases correctly", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 15000);
            const impCount0 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount0.toNumber());
            const impCostPerLevel0 = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel0/(10**18)));
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 1);
            const impCount1 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount1.toNumber());
            const impCostPerLevel1 = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel1/(10**18)));
            // <5 improvements
            (0, chai_1.expect)(BigInt(impCostPerLevel1 / (10 ** 18)).toString()).to.equal("500");
            await improvementscontract1.connect(signer1).buyImprovement1(4, 0, 2);
            const impCount2 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount2.toNumber());
            const impCostPerLevel2 = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel2/(10**18)));
            //  <8 improvements
            (0, chai_1.expect)(BigInt(impCostPerLevel2 / (10 ** 18)).toString()).to.equal("600");
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 3);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            const impCount3 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount3.toNumber());
            const impCostPerLevel3 = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel3/(10**18)));
            // <15 improvements
            (0, chai_1.expect)(BigInt(impCostPerLevel3 / (10 ** 18)).toString()).to.equal("750");
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 4);
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 6);
            const impCount4 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount4.toNumber());
            const impCostPerLevel4 = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel4/(10**18)));
            // <20 improvements
            (0, chai_1.expect)(BigInt(impCostPerLevel4 / (10 ** 18)).toString()).to.equal("950");
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 7);
            await improvementscontract1.connect(signer1).buyImprovement1(5, 0, 8);
            await improvementscontract1.connect(signer1).buyImprovement1(3, 0, 9);
            const impCount5 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount5.toNumber());
            const impCostPerLevel5 = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel5/(10**18)));
            // <30 improvements
            (0, chai_1.expect)(BigInt(impCostPerLevel5 / (10 ** 18)).toString()).to.equal("1200");
            await improvementscontract1.connect(signer1).buyImprovement1(5, 0, 11);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 1);
            await improvementscontract2.connect(signer1).buyImprovement2(4, 0, 3);
            const impCount6 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount6.toNumber());
            const impCostPerLevel6 = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel6/(10**18)));
            // <40 improvements
            (0, chai_1.expect)(BigInt(impCostPerLevel6 / (10 ** 18)).toString()).to.equal("1500");
            await improvementscontract2.connect(signer1).buyImprovement2(5, 0, 6);
            await improvementscontract2.connect(signer1).buyImprovement2(5, 0, 7);
            const impCount7 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount7.toNumber());
            const impCostPerLevel7 = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel7/(10**18)));
            // <50 improvements
            (0, chai_1.expect)(BigInt(impCostPerLevel7 / (10 ** 18)).toString()).to.equal("2000");
            await improvementscontract2.connect(signer1).buyImprovement2(5, 0, 8);
            const impCount8 = await improvementscontract1.getImprovementCount(0);
            // console.log("imp count", impCount8.toNumber());
            const impCostPerLevel8 = await billscontract.calculateImprovementCostPerLevel(0);
            // console.log("imp cost per level", BigInt(impCostPerLevel8/(10**18)));
            // >= 50 improvements
            (0, chai_1.expect)(BigInt(impCostPerLevel8 / (10 ** 18)).toString()).to.equal("3000");
        });
        it("bills4 tests wonder increment bills correctly", async function () {
            var upkeep = await billscontract.calculateWonderBillsPayable(0);
            // console.log(BigInt(upkeep/(10**18)))
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 12000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 6);
            var upkeep = await (billscontract.calculateWonderBillsPayable(0));
            var newUpkeep = (upkeep / (10 ** 18));
            // console.log(newUpkeep, "this");
            (0, chai_1.expect)(newUpkeep).to.equal(4750.000000000001);
        });
    });
});
