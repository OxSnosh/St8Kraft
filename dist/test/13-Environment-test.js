"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const helper_hardhat_config_1 = require("../helper-hardhat-config");
const helper_hardhat_config_2 = require("../helper-hardhat-config");
describe("Environment Contract", function () {
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
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, resourcescontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, countryparameterscontract.address);
            await vrfCoordinatorV2Mock.addConsumer(subscriptionId, nukecontract.address);
        }
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(2100000000000000000000000));
        await countryminter.connect(signer1).generateCountry("TestRuler", "TestNationName", "TestCapitalCity", "TestNationSlogan");
        await warbucks.connect(signer0).approve(warbucks.address, BigInt(9000000000 * (10 ** 18)));
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(9000000000 * (10 ** 18)));
        await treasurycontract.connect(signer1).addFunds(BigInt(7000000000 * (10 ** 18)), 0);
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
    describe("Environment Contract", function () {
        it("environment1 country initialized correctly", async function () {
            const initialEnvironment = await environmentcontract.getEnvironmentScore(0);
            (0, chai_1.expect)(initialEnvironment.toNumber()).to.equal(1);
            const initialEnvironmentGross = await environmentcontract.getGrossEnvironmentScore(0);
            (0, chai_1.expect)(initialEnvironmentGross).to.equal(10);
            const resourcesScore = await environmentcontract.getEnvironmentScoreFromResources(0);
            (0, chai_1.expect)(resourcesScore).to.equal(0);
            const wondersScore = await environmentcontract.getEnvironmentScoreFromImprovementsAndWonders(0);
            (0, chai_1.expect)(wondersScore).to.equal(0);
            const techScore = await environmentcontract.getEnvironmentScoreFromTech(0);
            (0, chai_1.expect)(techScore).to.equal(0);
            const densityScore = await environmentcontract.getEnvironmentScoreFromMilitaryDensity(0);
            (0, chai_1.expect)(densityScore).to.equal(0);
            const infrastructureScore = await environmentcontract.getEnvironmentScoreFromInfrastructure(0);
            (0, chai_1.expect)(infrastructureScore).to.equal(0);
            const nukeScore = await environmentcontract.getScoreFromNukes(0);
            (0, chai_1.expect)(nukeScore).to.equal(0);
            const governmentScore = await environmentcontract.getScoreFromGovernment(0);
            (0, chai_1.expect)(governmentScore).to.equal(10);
            // console.log(
            //     "score", initialEnvironment.toNumber(),
            //     "gross", initialEnvironmentGross.toNumber(),
            //     "resources", resourcesScore.toNumber(),
            //     "wonder", wondersScore.toNumber(),
            //     "tech", techScore.toNumber(),
            //     "density", densityScore.toNumber(),
            //     "infrastructure", infrastructureScore.toNumber(),
            //     "nuke", nukeScore.toNumber(),
            //     "government", governmentScore.toNumber()
            // )
        });
        it("environment1 resources affect environment", async function () {
            await resourcescontract.mockResourcesForTesting(0, 2, 11);
            const resourcesScore = await environmentcontract.getEnvironmentScoreFromResources(0);
            (0, chai_1.expect)(resourcesScore).to.equal(20);
            await resourcescontract.mockResourcesForTesting(1, 0, 7);
            await resourcescontract.connect(signer2).proposeTrade(1, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 1);
            const steel = await bonusresourcescontract.viewSteel(0);
            // console.log("steel for nation 1", steel);
            await resourcescontract.mockResourcesForTesting(2, 9, 10);
            await resourcescontract.connect(signer3).proposeTrade(2, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 2);
            const construction = await bonusresourcescontract.viewConstruction(0);
            // console.log("construction for nation 1", construction);
            const proposalsForNation1 = await resourcescontract.getProposedTradingPartners(0);
            // console.log(proposalsForNation1);
            await resourcescontract.mockResourcesForTesting(3, 6, 8);
            await technologymarketcontrat.connect(signer1).buyTech(0, 15);
            await resourcescontract.connect(signer4).proposeTrade(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 3);
            const microchips = await bonusresourcescontract.viewMicrochips(0);
            // console.log("microchips for nation 1", microchips);
            const radiationCleanup = await bonusresourcescontract.viewRadiationCleanup(0);
            // console.log("radiation cleanup for nation 1", radiationCleanup);
            const resourcesScore2 = await environmentcontract.getEnvironmentScoreFromResources(0);
            (0, chai_1.expect)(resourcesScore2).to.equal(10);
            await billscontract.connect(signer1).payBills(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 5000);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 4);
            await resourcescontract.mockResourcesForTesting(4, 17, 18);
            await resourcescontract.connect(signer5).proposeTrade(4, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            const resourcesScore3 = await environmentcontract.getEnvironmentScoreFromResources(0);
            (0, chai_1.expect)(resourcesScore3).to.equal(10);
        });
        it("environment1 improvements and wonders affect environemnt", async function () {
            await billscontract.connect(signer1).payBills(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 13000);
            const wondersScore = await environmentcontract.getEnvironmentScoreFromImprovementsAndWonders(0);
            (0, chai_1.expect)(wondersScore.toNumber()).to.equal(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 5000);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            const wondersScore2 = await environmentcontract.getEnvironmentScoreFromImprovementsAndWonders(0);
            (0, chai_1.expect)(wondersScore2.toNumber()).to.equal(-20);
            await improvementscontract4.connect(signer1).buyImprovement4(3, 0, 2);
            const wondersScore3 = await environmentcontract.getEnvironmentScoreFromImprovementsAndWonders(0);
            (0, chai_1.expect)(wondersScore3.toNumber()).to.equal(-11);
            await improvementscontract3.connect(signer1).buyImprovement3(2, 0, 3);
            const wondersScore4 = await environmentcontract.getEnvironmentScoreFromImprovementsAndWonders(0);
            (0, chai_1.expect)(wondersScore4.toNumber()).to.equal(-1);
            await wonderscontract3.connect(signer1).buyWonder3(0, 3);
            const wondersScore5 = await environmentcontract.getEnvironmentScoreFromImprovementsAndWonders(0);
            (0, chai_1.expect)(wondersScore5.toNumber()).to.equal(-11);
            await technologymarketcontrat.connect(signer1).buyTech(0, 2000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await wonderscontract4.connect(signer1).buyWonder4(0, 7);
            const wondersScore6 = await environmentcontract.getEnvironmentScoreFromImprovementsAndWonders(0);
            (0, chai_1.expect)(wondersScore6.toNumber()).to.equal(-1);
        });
        it("environment1 government affect environment", async function () {
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await keepercontract.incrementGameDay();
            await countryparameterscontract.connect(signer1).setGovernment(0, 7);
            const governmentScore = await environmentcontract.getScoreFromGovernment(0);
            (0, chai_1.expect)(governmentScore).to.equal(-10);
        });
        it("environment1 tech affect on environment", async function () {
            await technologymarketcontrat.connect(signer1).buyTech(0, 20);
            const techScore = await environmentcontract.getEnvironmentScoreFromTech(0);
            (0, chai_1.expect)(techScore).to.equal(-10);
        });
        it("environment1 military density affects environment", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 200);
            await forcescontract.connect(signer1).buySoldiers(1200, 0);
            const militaryDensityPenalty = await additionaltaxescontract.soldierToPopulationRatio(0);
            (0, chai_1.expect)(militaryDensityPenalty[1]).to.equal(true);
            const densityScore = await environmentcontract.getEnvironmentScoreFromMilitaryDensity(0);
            (0, chai_1.expect)(densityScore).to.equal(10);
        });
        it("environment1 nuke count affects environment", async function () {
            await technologymarketcontrat.connect(signer1).buyTech(0, 31000);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            await resourcescontract.mockResourcesForTesting(0, 17, 18);
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            const nukeCount = await missilescontract.getNukeCount(0);
            const nukeScore = await environmentcontract.getScoreFromNukes(0);
            (0, chai_1.expect)(nukeScore).to.equal(20);
            //lead resuces penalty by 50%
            await resourcescontract.mockResourcesForTesting(0, 8, 9);
            const nukeScore1 = await environmentcontract.getScoreFromNukes(0);
            (0, chai_1.expect)(nukeScore1).to.equal(10);
        });
        it("environment1 tests that global radiation over 5 defaults to 5 in environment score", async function () {
            var globalRadiation0 = await nukecontract.getGlobalRadiation();
            (0, chai_1.expect)(globalRadiation0).to.equal(0);
            // console.log("global radiation", globalRadiation0.toNumber());
            await militarycontract.connect(signer1).toggleWarPeacePreference(0);
            await militarycontract.connect(signer2).toggleWarPeacePreference(1);
            await warcontract.connect(signer1).declareWar(0, 1);
            await billscontract.connect(signer2).payBills(1);
            await resourcescontract.connect(signer0).mockResourcesForTesting(0, 17, 1);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 500);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 400);
            await wonderscontract2.connect(signer1).buyWonder2(0, 8);
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.connect(signer0).incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.connect(signer0).incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.connect(signer0).incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.connect(signer0).incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await nukecontract.connect(signer1).launchNuke(0, 0, 1, 1);
            const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
            const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
            for (const log of event1Logs) {
                const requestIdReturn = log.args.requestId;
                // console.log(Number(requestIdReturn), "requestIdReturn for Event");
                if (requestIdReturn == 11) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, nukecontract.address);
                }
            }
            var globalRadiation1 = await nukecontract.getGlobalRadiation();
            (0, chai_1.expect)(globalRadiation1).to.equal(10);
            // console.log("global radiation", globalRadiation1.toNumber());
            var envScore = await environmentcontract.getEnvironmentScore(0);
            //Env Score of 2 and Global radiation of 10 should result in a score of 2 + 5 = 7
            (0, chai_1.expect)(envScore).to.equal(8);
            // console.log("environment score", envScore.toNumber());
        });
        it("environment1 tests rediation cleanup reduces global radiation by 50%", async function () {
            var globalRadiation0 = await nukecontract.getGlobalRadiation();
            (0, chai_1.expect)(globalRadiation0).to.equal(0);
            // console.log("global radiation", globalRadiation0.toNumber());
            await militarycontract.connect(signer1).toggleWarPeacePreference(0);
            await militarycontract.connect(signer2).toggleWarPeacePreference(1);
            await warcontract.connect(signer1).declareWar(0, 1);
            await billscontract.connect(signer2).payBills(1);
            await resourcescontract.connect(signer0).mockResourcesForTesting(0, 17, 1);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 500);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 400);
            await wonderscontract2.connect(signer1).buyWonder2(0, 8);
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.connect(signer0).incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.connect(signer0).incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.connect(signer0).incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.connect(signer0).incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await nukecontract.connect(signer1).launchNuke(0, 0, 1, 1);
            const eventFilter1 = vrfCoordinatorV2Mock.filters.RandomWordsRequested();
            const event1Logs = await vrfCoordinatorV2Mock.queryFilter(eventFilter1);
            for (const log of event1Logs) {
                const requestIdReturn = log.args.requestId;
                // console.log(Number(requestIdReturn), "requestIdReturn for Event");
                if (requestIdReturn == 11) {
                    await vrfCoordinatorV2Mock.fulfillRandomWords(requestIdReturn, nukecontract.address);
                }
            }
            var globalRadiation1 = await nukecontract.getGlobalRadiation();
            (0, chai_1.expect)(globalRadiation1).to.equal(10);
            // console.log("global radiation", globalRadiation1.toNumber());
            await technologymarketcontrat.connect(signer1).buyTech(0, 100);
            await resourcescontract.mockResourcesForTesting(0, 9, 7);
            await resourcescontract.mockResourcesForTesting(1, 10, 0);
            await resourcescontract.mockResourcesForTesting(2, 6, 8);
            await resourcescontract.mockResourcesForTesting(3, 11, 7);
            await resourcescontract.mockResourcesForTesting(4, 2, 9);
            await resourcescontract.connect(signer1).proposeTrade(0, 1);
            await resourcescontract.connect(signer1).proposeTrade(0, 2);
            await resourcescontract.connect(signer1).proposeTrade(0, 3);
            await resourcescontract.connect(signer5).proposeTrade(4, 0);
            await resourcescontract.connect(signer2).fulfillTradingPartner(1, 0);
            await resourcescontract.connect(signer3).fulfillTradingPartner(2, 0);
            await resourcescontract.connect(signer4).fulfillTradingPartner(3, 0);
            await resourcescontract.connect(signer1).fulfillTradingPartner(0, 4);
            var radiationcleanup = await bonusresourcescontract.viewRadiationCleanup(0);
            (0, chai_1.expect)(radiationcleanup).to.equal(true);
            var environmentScore = await environmentcontract.getEnvironmentScore(0);
            // console.log("environment score", environmentScore.toNumber());
            //would be 8 without radiation cleanup
            (0, chai_1.expect)(environmentScore).to.equal(5);
        });
        it("environment1 tests that each environment score is possible", async function () {
            await resourcescontract.mockResourcesForTesting(0, 18, 1);
            var globalRadiation1 = await nukecontract.getGlobalRadiation();
            // console.log("global radiation", globalRadiation1.toNumber());
            var grossEnvScore = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvScore.toNumber());
            var scoreFromNukes = await environmentcontract.getScoreFromNukes(0);
            // console.log("score from nukes", scoreFromNukes.toNumber());
            await technologymarketcontrat.connect(signer1).buyTech(0, 31000);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            await resourcescontract.mockResourcesForTesting(0, 17, 18);
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await billscontract.connect(signer1).payBills(0);
            var environmentScore = await environmentcontract.getEnvironmentScore(0);
            // console.log("environment score", environmentScore.toNumber());
            (0, chai_1.expect)(environmentScore).to.equal(2);
            var scoreFromNukes = await environmentcontract.getScoreFromNukes(0);
            // console.log("score from nukes", scoreFromNukes.toNumber());
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await billscontract.connect(signer1).payBills(0);
            var environmentScore = await environmentcontract.getEnvironmentScore(0);
            // console.log("environment score", environmentScore.toNumber());
            (0, chai_1.expect)(environmentScore).to.equal(3);
            var scoreFromNukes = await environmentcontract.getScoreFromNukes(0);
            // console.log("score from nukes", scoreFromNukes.toNumber());
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await billscontract.connect(signer1).payBills(0);
            var environmentScore = await environmentcontract.getEnvironmentScore(0);
            // console.log("environment score", environmentScore.toNumber());
            (0, chai_1.expect)(environmentScore).to.equal(4);
            var scoreFromNukes = await environmentcontract.getScoreFromNukes(0);
            // console.log("score from nukes", scoreFromNukes.toNumber());
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await billscontract.connect(signer1).payBills(0);
            var environmentScore = await environmentcontract.getEnvironmentScore(0);
            // console.log("environment score", environmentScore.toNumber());
            (0, chai_1.expect)(environmentScore).to.equal(5);
            var scoreFromNukes = await environmentcontract.getScoreFromNukes(0);
            // console.log("score from nukes", scoreFromNukes.toNumber());
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await billscontract.connect(signer1).payBills(0);
            var environmentScore = await environmentcontract.getEnvironmentScore(0);
            // console.log("environment score", environmentScore.toNumber());
            (0, chai_1.expect)(environmentScore).to.equal(6);
            var scoreFromNukes = await environmentcontract.getScoreFromNukes(0);
            // console.log("score from nukes", scoreFromNukes.toNumber());
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await billscontract.connect(signer1).payBills(0);
            var environmentScore = await environmentcontract.getEnvironmentScore(0);
            // console.log("environment score", environmentScore.toNumber());
            (0, chai_1.expect)(environmentScore).to.equal(7);
            var scoreFromNukes = await environmentcontract.getScoreFromNukes(0);
            // console.log("score from nukes", scoreFromNukes.toNumber());
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await billscontract.connect(signer1).payBills(0);
            var environmentScore = await environmentcontract.getEnvironmentScore(0);
            // console.log("environment score", environmentScore.toNumber());
            (0, chai_1.expect)(environmentScore).to.equal(8);
            var scoreFromNukes = await environmentcontract.getScoreFromNukes(0);
            // console.log("score from nukes", scoreFromNukes.toNumber());
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await billscontract.connect(signer1).payBills(0);
            var environmentScore = await environmentcontract.getEnvironmentScore(0);
            // console.log("environment score", environmentScore.toNumber());
            (0, chai_1.expect)(environmentScore).to.equal(9);
            var scoreFromNukes = await environmentcontract.getScoreFromNukes(0);
            // console.log("score from nukes", scoreFromNukes.toNumber());
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await billscontract.connect(signer1).payBills(0);
            var environmentScore = await environmentcontract.getEnvironmentScore(0);
            // console.log("environment score", environmentScore.toNumber());
            (0, chai_1.expect)(environmentScore).to.equal(10);
            var scoreFromNukes = await environmentcontract.getScoreFromNukes(0);
            // console.log("score from nukes", scoreFromNukes.toNumber());
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await billscontract.connect(signer1).payBills(0);
            var environmentScore = await environmentcontract.getEnvironmentScore(0);
            // console.log("environment score", environmentScore.toNumber());
            (0, chai_1.expect)(environmentScore).to.equal(10);
            var scoreFromNukes = await environmentcontract.getScoreFromNukes(0);
            // console.log("score from nukes", scoreFromNukes.toNumber());
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await billscontract.connect(signer1).payBills(0);
            var environmentScore = await environmentcontract.getEnvironmentScore(0);
            // console.log("environment score", environmentScore.toNumber());
            (0, chai_1.expect)(environmentScore).to.equal(10);
            var scoreFromNukes = await environmentcontract.getScoreFromNukes(0);
            // console.log("score from nukes", scoreFromNukes.toNumber());
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await missilescontract.connect(signer1).buyNukes(0);
            await keepercontract.incrementGameDay();
            await billscontract.connect(signer1).payBills(0);
            var environmentScore = await environmentcontract.getEnvironmentScore(0);
            // console.log("environment score", environmentScore.toNumber());
            (0, chai_1.expect)(environmentScore).to.equal(10);
            var scoreFromNukes = await environmentcontract.getScoreFromNukes(0);
            // console.log("score from nukes", scoreFromNukes.toNumber());
        });
        it("environment1 tests that border walls affect environment score correctly", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            var grossEnvironmentScore = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvironmentScore.toNumber());
            (0, chai_1.expect)(grossEnvironmentScore).to.equal(20);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            var grossEnvironmentScore1 = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvironmentScore1.toNumber());
            (0, chai_1.expect)(grossEnvironmentScore1).to.equal(10);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            var grossEnvironmentScore2 = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvironmentScore2.toNumber());
            (0, chai_1.expect)(grossEnvironmentScore2).to.equal(0);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            var grossEnvironmentScore3 = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvironmentScore3.toNumber());
            (0, chai_1.expect)(grossEnvironmentScore3).to.equal(-10);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            var grossEnvironmentScore4 = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvironmentScore4.toNumber());
            (0, chai_1.expect)(grossEnvironmentScore4).to.equal(-20);
            await improvementscontract1.connect(signer1).buyImprovement1(1, 0, 5);
            var grossEnvironmentScore5 = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvironmentScore5.toNumber());
            (0, chai_1.expect)(grossEnvironmentScore5).to.equal(-30);
        });
        it("environment1 tests that munitions factories affect environment score correctly", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            var grossEnvironmentScore = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvironmentScore.toNumber());
            (0, chai_1.expect)(grossEnvironmentScore).to.equal(20);
            await improvementscontract4.connect(signer1).buyImprovement4(1, 0, 2);
            var grossEnvironmentScore1 = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvironmentScore1.toNumber());
            (0, chai_1.expect)(grossEnvironmentScore1).to.equal(23);
            await improvementscontract4.connect(signer1).buyImprovement4(1, 0, 2);
            var grossEnvironmentScore2 = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvironmentScore2.toNumber());
            (0, chai_1.expect)(grossEnvironmentScore2).to.equal(26);
            await improvementscontract4.connect(signer1).buyImprovement4(1, 0, 2);
            var grossEnvironmentScore3 = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvironmentScore3.toNumber());
            (0, chai_1.expect)(grossEnvironmentScore3).to.equal(29);
            await improvementscontract4.connect(signer1).buyImprovement4(1, 0, 2);
            var grossEnvironmentScore4 = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvironmentScore4.toNumber());
            (0, chai_1.expect)(grossEnvironmentScore4).to.equal(32);
            await improvementscontract4.connect(signer1).buyImprovement4(1, 0, 2);
            var grossEnvironmentScore5 = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvironmentScore5.toNumber());
            (0, chai_1.expect)(grossEnvironmentScore5).to.equal(35);
        });
        it("environment1 tests that red light districts affect environment score correctly", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 2000);
            var grossEnvironmentScore = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvironmentScore.toNumber());
            (0, chai_1.expect)(grossEnvironmentScore).to.equal(20);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 3);
            var grossEnvironmentScore1 = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvironmentScore1.toNumber());
            (0, chai_1.expect)(grossEnvironmentScore1).to.equal(25);
            await improvementscontract3.connect(signer1).buyImprovement3(1, 0, 3);
            var grossEnvironmentScore2 = await environmentcontract.getGrossEnvironmentScore(0);
            // console.log("gross environment score", grossEnvironmentScore2.toNumber());
            (0, chai_1.expect)(grossEnvironmentScore2).to.equal(30);
        });
    });
});
