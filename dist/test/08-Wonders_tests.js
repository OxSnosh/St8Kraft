"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//St8kraft © 2022 by OxSnosh is licensed under Attribution-NonCommercial-NoDerivatives 4.0 International
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const helper_hardhat_config_1 = require("../helper-hardhat-config");
const helper_hardhat_config_2 = require("../helper-hardhat-config");
describe("Wonders Contracts", function () {
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
        }
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(2100000000000000000000000));
        await countryminter.connect(signer1).generateCountry("TestRuler", "TestNationName", "TestCapitalCity", "TestNationSlogan");
        await warbucks.connect(signer0).approve(warbucks.address, BigInt(25000000000 * (10 ** 18)));
        await warbucks.connect(signer0).transfer(signer1.address, BigInt(25000000000 * (10 ** 18)));
        await treasurycontract.connect(signer1).addFunds(BigInt(20000000000 * (10 ** 18)), 0);
        // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
        // await landmarketcontract.connect(signer1).buyLand(0, 10000);
        // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
        await warbucks.connect(signer0).transfer(signer2.address, BigInt(2100000000000000000000000));
        await countryminter.connect(signer2).generateCountry("TestRuler", "TestNationName", "TestCapitalCity", "TestNationSlogan");
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
        }
    });
    describe("Wonders Contract 1", function () {
        //agricultural development program
        it("wonder1 agriculture development program tests", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
            await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 1);
            var isWonder = await wonderscontract1.getAgriculturalDevelopmentProgram(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder1 agriculture development program purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(1, 1)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract1.connect(signer0).updateAgricultureDevelopmentCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 1)).to.be.revertedWith("Insufficient balance");
            await wonderscontract1.connect(signer0).updateAgricultureDevelopmentCost(100);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 1)).to.be.revertedWith("Requires 500 Tech");
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 1)).to.be.revertedWith("Requires 3000 Land");
            await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await wonderscontract1.connect(signer1).buyWonder1(0, 1);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 1)).to.be.revertedWith("Already owned");
        });
        it("wonder1 tests agriculture development program price can be updated", async function () {
            let prices = await wonderscontract1.getWonderCosts1();
            var cost = prices[0];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("30000000000000000000000000");
            await wonderscontract1.connect(signer0).updateAgricultureDevelopmentCost(100);
            let newPrices = await wonderscontract1.getWonderCosts1();
            var newCost = newPrices[0];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder1 tests that agriculture development program can be deleted", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
            await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 1);
            var isWonder = await wonderscontract1.getAgriculturalDevelopmentProgram(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract1.connect(signer1).deleteWonder1(0, 1);
            var isWonder = await wonderscontract1.getAgriculturalDevelopmentProgram(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //anti air defense network
        it("wonder1 anti air defense network tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 2);
            var isWonder = await wonderscontract1.getAntiAirDefenseNewtwork(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder1 anti air defense network purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(1, 2)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract1.connect(signer0).updateAntiAirDefenseNetworkCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 2)).to.be.revertedWith("Insufficient balance");
            await wonderscontract1.connect(signer0).updateAntiAirDefenseNetworkCost(100);
            await wonderscontract1.connect(signer1).buyWonder1(0, 2);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 2)).to.be.revertedWith("Already owned");
        });
        it("wonder1 tests anti air defense network price can be updated", async function () {
            let prices = await wonderscontract1.getWonderCosts1();
            var cost = prices[1];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("50000000000000000000000000");
            await wonderscontract1.connect(signer0).updateAntiAirDefenseNetworkCost(100);
            let newPrices = await wonderscontract1.getWonderCosts1();
            var newCost = newPrices[1];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder1 tests that anti air defense network can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 2);
            var isWonder = await wonderscontract1.getAntiAirDefenseNewtwork(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract1.connect(signer1).deleteWonder1(0, 2);
            var isWonder = await wonderscontract1.getAntiAirDefenseNewtwork(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //central intelligence agency
        it("wonder1 central intelligence agency tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 3);
            var isWonder = await wonderscontract1.getCentralIntelligenceAgency(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder1 central intelligence agency purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(1, 3)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract1.connect(signer0).updateCentralIntelligenceAgencyCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 3)).to.be.revertedWith("Insufficient balance");
            await wonderscontract1.connect(signer0).updateCentralIntelligenceAgencyCost(100);
            await wonderscontract1.connect(signer1).buyWonder1(0, 3);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 3)).to.be.revertedWith("Already owned");
        });
        it("wonder1 tests central intelligence agency price can be updated", async function () {
            let prices = await wonderscontract1.getWonderCosts1();
            var cost = prices[2];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("40000000000000000000000000");
            await wonderscontract1.connect(signer0).updateCentralIntelligenceAgencyCost(100);
            let newPrices = await wonderscontract1.getWonderCosts1();
            var newCost = newPrices[2];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder1 tests that central intelligence agency can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 3);
            var isWonder = await wonderscontract1.getCentralIntelligenceAgency(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract1.connect(signer1).deleteWonder1(0, 3);
            var isWonder = await wonderscontract1.getCentralIntelligenceAgency(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //disaster relief agency
        it("wonder1 disaster relief agency tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 4);
            var isWonder = await wonderscontract1.getDisasterReliefAgency(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder1 disaster relief agency purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(1, 4)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract1.connect(signer0).updateDisasterReliefAgencyCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 4)).to.be.revertedWith("Insufficient balance");
            await wonderscontract1.connect(signer0).updateDisasterReliefAgencyCost(100);
            await wonderscontract1.connect(signer1).buyWonder1(0, 4);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 4)).to.be.revertedWith("Already owned");
        });
        it("wonder1 tests disaster relief agency price can be updated", async function () {
            let prices = await wonderscontract1.getWonderCosts1();
            var cost = prices[3];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("40000000000000000000000000");
            await wonderscontract1.connect(signer0).updateDisasterReliefAgencyCost(100);
            let newPrices = await wonderscontract1.getWonderCosts1();
            var newCost = newPrices[3];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder1 tests that disaster relief agency can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 4);
            var isWonder = await wonderscontract1.getDisasterReliefAgency(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract1.connect(signer1).deleteWonder1(0, 4);
            var isWonder = await wonderscontract1.getDisasterReliefAgency(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //emp weaponization
        it("wonder1 emp weaponization tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await wonderscontract4.connect(signer1).buyWonder4(0, 7);
            await wonderscontract1.connect(signer1).buyWonder1(0, 5);
            var isWonder = await wonderscontract1.getEmpWeaponization(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(4);
        });
        it("wonder1 emp weaponization purchase errors", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(1, 5)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract1.connect(signer0).updateEmpWeaponizationCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 5)).to.be.revertedWith("Insufficient balance");
            await wonderscontract1.connect(signer0).updateEmpWeaponizationCost(100);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 5)).to.be.revertedWith("Must own Weapons Research Center to purchase");
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await wonderscontract4.connect(signer1).buyWonder4(0, 7);
            await wonderscontract1.connect(signer1).buyWonder1(0, 5);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 5)).to.be.revertedWith("Already owned");
        });
        it("wonder1 tests emp weaponization price can be updated", async function () {
            let prices = await wonderscontract1.getWonderCosts1();
            var cost = prices[4];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("200000000000000000000000000");
            await wonderscontract1.connect(signer0).updateEmpWeaponizationCost(100);
            let newPrices = await wonderscontract1.getWonderCosts1();
            var newCost = newPrices[4];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder1 tests that emp weaponization can be deleted", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await wonderscontract4.connect(signer1).buyWonder4(0, 7);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(3);
            await wonderscontract1.connect(signer1).buyWonder1(0, 5);
            var isWonder = await wonderscontract1.getEmpWeaponization(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(4);
            await wonderscontract1.connect(signer1).deleteWonder1(0, 5);
            var isWonder = await wonderscontract1.getEmpWeaponization(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //fallout shelter system
        it("wonder1 fallout shelter system tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await wonderscontract1.connect(signer1).buyWonder1(0, 6);
            var isWonder = await wonderscontract1.getFalloutShelterSystem(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder1 fallout shelter system purchase errors", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(1, 6)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract1.connect(signer0).updateFalloutShelterSystemCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 6)).to.be.revertedWith("Insufficient balance");
            await wonderscontract1.connect(signer0).updateFalloutShelterSystemCost(100);
            await wonderscontract1.connect(signer1).buyWonder1(0, 6);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 6)).to.be.revertedWith("Already owned");
        });
        it("wonder1 tests fallout shelter system price can be updated", async function () {
            let prices = await wonderscontract1.getWonderCosts1();
            var cost = prices[5];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("40000000000000000000000000");
            await wonderscontract1.connect(signer0).updateFalloutShelterSystemCost(100);
            let newPrices = await wonderscontract1.getWonderCosts1();
            var newCost = newPrices[5];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder1 tests that fallout shelter can be deleted", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 6);
            var isWonder = await wonderscontract1.getFalloutShelterSystem(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract1.connect(signer1).deleteWonder1(0, 6);
            var isWonder = await wonderscontract1.getFalloutShelterSystem(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //federal aid commission
        it("wonder1 federal aid commission tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 7);
            var isWonder = await wonderscontract1.getFederalAidComission(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder1 federal aid commission purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(1, 7)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract1.connect(signer0).updateFederalAidCommissionCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 7)).to.be.revertedWith("Insufficient balance");
            await wonderscontract1.connect(signer0).updateFederalAidCommissionCost(100);
            await wonderscontract1.connect(signer1).buyWonder1(0, 7);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 7)).to.be.revertedWith("Already owned");
        });
        it("wonder1 tests federal aid commission price can be updated", async function () {
            let prices = await wonderscontract1.getWonderCosts1();
            var cost = prices[6];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("25000000000000000000000000");
            await wonderscontract1.connect(signer0).updateFederalAidCommissionCost(100);
            let newPrices = await wonderscontract1.getWonderCosts1();
            var newCost = newPrices[6];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder1 tests that federal aid commission can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 7);
            var isWonder = await wonderscontract1.getFederalAidComission(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract1.connect(signer1).deleteWonder1(0, 7);
            var isWonder = await wonderscontract1.getFederalAidComission(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //federal reserve
        it("wonder1 federal reserve tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract4.connect(signer1).buyWonder4(0, 3);
            await wonderscontract1.connect(signer1).buyWonder1(0, 8);
            var isWonder = await wonderscontract1.getFederalReserve(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(2);
        });
        it("wonder1 federal reserve purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 8)).to.be.revertedWith("Required to own stock market to purchase");
            await wonderscontract4.connect(signer1).buyWonder4(0, 3);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(1, 8)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract1.connect(signer0).updateFederalReserveCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 8)).to.be.revertedWith("Insufficient balance");
            await wonderscontract1.connect(signer0).updateFederalReserveCost(100);
            await wonderscontract1.connect(signer1).buyWonder1(0, 8);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 8)).to.be.revertedWith("Already owned");
        });
        it("wonder1 tests federal reserve price can be updated", async function () {
            let prices = await wonderscontract1.getWonderCosts1();
            var cost = prices[7];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("100000000000000000000000000");
            await wonderscontract1.connect(signer0).updateFederalReserveCost(100);
            let newPrices = await wonderscontract1.getWonderCosts1();
            var newCost = newPrices[7];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder1 tests that federal reserve can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await wonderscontract4.connect(signer1).buyWonder4(0, 3);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(1);
            await wonderscontract1.connect(signer1).buyWonder1(0, 8);
            var isWonder = await wonderscontract1.getFederalReserve(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(2);
            await wonderscontract1.connect(signer1).deleteWonder1(0, 8);
            var isWonder = await wonderscontract1.getFederalReserve(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //foreign air force base
        it("wonder1 foreign air force base tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 9);
            var isWonder = await wonderscontract1.getForeignAirforceBase(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder1 foreign air force base purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(1, 9)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract1.connect(signer0).updateForeignAirForceBaseCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 9)).to.be.revertedWith("Insufficient balance");
            await wonderscontract1.connect(signer0).updateForeignAirForceBaseCost(100);
            await wonderscontract1.connect(signer1).buyWonder1(0, 9);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 9)).to.be.revertedWith("Already owned");
        });
        it("wonder1 tests foreign air force base price can be updated", async function () {
            let prices = await wonderscontract1.getWonderCosts1();
            var cost = prices[8];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("35000000000000000000000000");
            await wonderscontract1.connect(signer0).updateForeignAirForceBaseCost(100);
            let newPrices = await wonderscontract1.getWonderCosts1();
            var newCost = newPrices[8];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder1 tests that foreign air force base can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 9);
            var isWonder = await wonderscontract1.getForeignAirforceBase(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract1.connect(signer1).deleteWonder1(0, 9);
            var isWonder = await wonderscontract1.getForeignAirforceBase(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //foreign army base
        it("wonder1 foreign army base tests", async function () {
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 10)).to.be.revertedWith("Must have 8000 Technology to purchase");
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 10);
            var isWonder = await wonderscontract1.getForeignArmyBase(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder1 foreign army base purchase errors", async function () {
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(1, 10)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract1.connect(signer0).updateForeignArmyBaseCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 10)).to.be.revertedWith("Insufficient balance");
            await wonderscontract1.connect(signer0).updateForeignArmyBaseCost(100);
            await wonderscontract1.connect(signer1).buyWonder1(0, 10);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 10)).to.be.revertedWith("Already owned");
        });
        it("wonder1 tests foreign army base price can be updated", async function () {
            let prices = await wonderscontract1.getWonderCosts1();
            var cost = prices[9];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("200000000000000000000000000");
            await wonderscontract1.connect(signer0).updateForeignArmyBaseCost(100);
            let newPrices = await wonderscontract1.getWonderCosts1();
            var newCost = newPrices[9];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder1 tests that foreign army base can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 10);
            var isWonder = await wonderscontract1.getForeignArmyBase(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract1.connect(signer1).deleteWonder1(0, 10);
            var isWonder = await wonderscontract1.getForeignArmyBase(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //foreign navy base
        it("wonder1 foreign navy base tests", async function () {
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 11)).to.be.revertedWith("Requires 20000 infrastructure to purchase");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 20000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 11);
            var isWonder = await wonderscontract1.getForeignNavalBase(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder1 foreign navy base purchase errors", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 20000);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(1, 11)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract1.connect(signer0).updateForeignNavalBaseCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 11)).to.be.revertedWith("Insufficient balance");
            await wonderscontract1.connect(signer0).updateForeignNavalBaseCost(100);
            await wonderscontract1.connect(signer1).buyWonder1(0, 11);
            await (0, chai_1.expect)(wonderscontract1.connect(signer1).buyWonder1(0, 11)).to.be.revertedWith("Already owned");
        });
        it("wonder1 tests foreign navy base price can be updated", async function () {
            let prices = await wonderscontract1.getWonderCosts1();
            var cost = prices[10];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("200000000000000000000000000");
            await wonderscontract1.connect(signer0).updateForeignNavalBaseCost(100);
            let newPrices = await wonderscontract1.getWonderCosts1();
            var newCost = newPrices[10];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder1 tests that foreign navy base can be deleted", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 20000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract1.connect(signer1).buyWonder1(0, 11);
            var isWonder = await wonderscontract1.getForeignNavalBase(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract1.connect(signer1).deleteWonder1(0, 11);
            var isWonder = await wonderscontract1.getForeignNavalBase(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
    });
    describe("Wonders Contract 2", function () {
        //great monument
        it("wonder2 great monument tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract2.connect(signer1).buyWonder2(0, 1);
            var isWonder = await wonderscontract2.getGreatMonument(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder2 great monument purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(1, 1)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract2.connect(signer0).updateGreatMonumentCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 1)).to.be.revertedWith("Insufficient balance");
            await wonderscontract2.connect(signer0).updateGreatMonumentCost(100);
            await wonderscontract2.connect(signer1).buyWonder2(0, 1);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 1)).to.be.revertedWith("Already owned");
        });
        it("wonder2 tests great monument price can be updated", async function () {
            let prices = await wonderscontract2.getWonderCosts2();
            var cost = prices[0];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("35000000000000000000000000");
            await wonderscontract2.connect(signer0).updateGreatMonumentCost(100);
            let newPrices = await wonderscontract2.getWonderCosts2();
            var newCost = newPrices[0];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder2 tests that great monument can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract2.connect(signer1).buyWonder2(0, 1);
            var isWonder = await wonderscontract2.getGreatMonument(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract2.connect(signer1).deleteWonder2(0, 1);
            var isWonder = await wonderscontract2.getGreatMonument(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //great temple
        it("wonder2 great temple tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract2.connect(signer1).buyWonder2(0, 2);
            var isWonder = await wonderscontract2.getGreatTemple(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder2 great temple purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(1, 2)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract2.connect(signer0).updateGreatTempleCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 2)).to.be.revertedWith("Insufficient balance");
            await wonderscontract2.connect(signer0).updateGreatTempleCost(100);
            await wonderscontract2.connect(signer1).buyWonder2(0, 2);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 2)).to.be.revertedWith("Already owned");
        });
        it("wonder2 tests great temple price can be updated", async function () {
            let prices = await wonderscontract2.getWonderCosts2();
            var cost = prices[1];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("35000000000000000000000000");
            await wonderscontract2.connect(signer0).updateGreatTempleCost(100);
            let newPrices = await wonderscontract2.getWonderCosts2();
            var newCost = newPrices[1];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder2 tests that great temple can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract2.connect(signer1).buyWonder2(0, 2);
            var isWonder = await wonderscontract2.getGreatTemple(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract2.connect(signer1).deleteWonder2(0, 2);
            var isWonder = await wonderscontract2.getGreatTemple(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //great university
        it("wonder2 great university tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract2.connect(signer1).buyWonder2(0, 3);
            var isWonder = await wonderscontract2.getGreatUniversity(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder2 great university purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(1, 3)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract2.connect(signer0).updateGreatUniversityCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 3)).to.be.revertedWith("Insufficient balance");
            await wonderscontract2.connect(signer0).updateGreatUniversityCost(100);
            await wonderscontract2.connect(signer1).buyWonder2(0, 3);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 3)).to.be.revertedWith("Already owned");
        });
        it("wonder2 tests great university price can be updated", async function () {
            let prices = await wonderscontract2.getWonderCosts2();
            var cost = prices[2];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("35000000000000000000000000");
            await wonderscontract2.connect(signer0).updateGreatUniversityCost(100);
            let newPrices = await wonderscontract2.getWonderCosts2();
            var newCost = newPrices[2];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder2 tests that great university can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract2.connect(signer1).buyWonder2(0, 3);
            var isWonder = await wonderscontract2.getGreatUniversity(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract2.connect(signer1).deleteWonder2(0, 3);
            var isWonder = await wonderscontract2.getGreatUniversity(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //hidden nuclear missile silo
        it("wonder2 hidden nuclear missile silo tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract2.connect(signer1).buyWonder2(0, 4);
            var isWonder = await wonderscontract2.getHiddenNuclearMissileSilo(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder2 hidden nuclear missile silo purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(1, 4)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract2.connect(signer0).updateHiddenNuclearMissileSiloCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 4)).to.be.revertedWith("Insufficient balance");
            await wonderscontract2.connect(signer0).updateHiddenNuclearMissileSiloCost(100);
            await wonderscontract2.connect(signer1).buyWonder2(0, 4);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 4)).to.be.revertedWith("Already owned");
        });
        it("wonder2 tests hidden nuclear missile silo price can be updated", async function () {
            let prices = await wonderscontract2.getWonderCosts2();
            var cost = prices[3];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("30000000000000000000000000");
            await wonderscontract2.connect(signer0).updateHiddenNuclearMissileSiloCost(100);
            let newPrices = await wonderscontract2.getWonderCosts2();
            var newCost = newPrices[3];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder2 tests that hidden nuclear missile silo can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract2.connect(signer1).buyWonder2(0, 4);
            var isWonder = await wonderscontract2.getHiddenNuclearMissileSilo(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract2.connect(signer1).deleteWonder2(0, 4);
            var isWonder = await wonderscontract2.getHiddenNuclearMissileSilo(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //interceptor misile system
        it("wonder2 interceptor misile system tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract3.connect(signer1).buyImprovement3(3, 0, 5);
            await improvementscontract4.connect(signer1).buyImprovement4(3, 0, 1);
            await wonderscontract4.connect(signer1).buyWonder4(0, 4);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await wonderscontract2.connect(signer1).buyWonder2(0, 5);
            var isWonder = await wonderscontract2.getInterceptorMissileSystem(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(2);
        });
        it("wonder2 interceptor misile system purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 5)).to.be.revertedWith("Strategic Defense Inititive required to purchase");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract3.connect(signer1).buyImprovement3(3, 0, 5);
            await improvementscontract4.connect(signer1).buyImprovement4(3, 0, 1);
            await wonderscontract4.connect(signer1).buyWonder4(0, 4);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 5)).to.be.revertedWith("Must have 5000 Technology to purchase");
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(1, 5)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract2.connect(signer0).updateInterceptorMissileSystemCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 5)).to.be.revertedWith("Insufficient balance");
            await wonderscontract2.connect(signer0).updateInterceptorMissileSystemCost(100);
            await wonderscontract2.connect(signer1).buyWonder2(0, 5);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 5)).to.be.revertedWith("Already owned");
        });
        it("wonder2 tests interceptor misile system price can be updated", async function () {
            let prices = await wonderscontract2.getWonderCosts2();
            var cost = prices[4];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("50000000000000000000000000");
            await wonderscontract2.connect(signer0).updateInterceptorMissileSystemCost(100);
            let newPrices = await wonderscontract2.getWonderCosts2();
            var newCost = newPrices[4];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder2 tests that interceptor missile system can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await billscontract.connect(signer1).payBills(0);
            await improvementscontract3.connect(signer1).buyImprovement3(3, 0, 5);
            await improvementscontract4.connect(signer1).buyImprovement4(3, 0, 1);
            await wonderscontract4.connect(signer1).buyWonder4(0, 4);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(1);
            await wonderscontract2.connect(signer1).buyWonder2(0, 5);
            var isWonder = await wonderscontract2.getInterceptorMissileSystem(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(2);
            await wonderscontract2.connect(signer1).deleteWonder2(0, 5);
            var isWonder = await wonderscontract2.getInterceptorMissileSystem(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //internet
        it("wonder2 internet tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract2.connect(signer1).buyWonder2(0, 6);
            var isWonder = await wonderscontract2.getInternet(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder2 internet purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(1, 6)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract2.connect(signer0).updateInternetCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 6)).to.be.revertedWith("Insufficient balance");
            await wonderscontract2.connect(signer0).updateInternetCost(100);
            await wonderscontract2.connect(signer1).buyWonder2(0, 6);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 6)).to.be.revertedWith("Already owned");
        });
        it("wonder2 tests internet price can be updated", async function () {
            let prices = await wonderscontract2.getWonderCosts2();
            var cost = prices[5];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("35000000000000000000000000");
            await wonderscontract2.connect(signer0).updateInternetCost(100);
            let newPrices = await wonderscontract2.getWonderCosts2();
            var newCost = newPrices[5];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder2 tests that internet can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract2.connect(signer1).buyWonder2(0, 6);
            var isWonder = await wonderscontract2.getInternet(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract2.connect(signer1).deleteWonder2(0, 6);
            var isWonder = await wonderscontract2.getInternet(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //interstate system
        it("wonder2 interstate system tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract2.connect(signer1).buyWonder2(0, 7);
            var isWonder = await wonderscontract2.getInterstateSystem(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder2 interstate system purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(1, 7)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract2.connect(signer0).updateInterstateSystemCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 7)).to.be.revertedWith("Insufficient balance");
            await wonderscontract2.connect(signer0).updateInterstateSystemCost(100);
            await wonderscontract2.connect(signer1).buyWonder2(0, 7);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 7)).to.be.revertedWith("Already owned");
        });
        it("wonder2 tests interstate system price can be updated", async function () {
            let prices = await wonderscontract2.getWonderCosts2();
            var cost = prices[6];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("45000000000000000000000000");
            await wonderscontract2.connect(signer0).updateInterstateSystemCost(100);
            let newPrices = await wonderscontract2.getWonderCosts2();
            var newCost = newPrices[6];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder2 tests that interstate system can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract2.connect(signer1).buyWonder2(0, 7);
            var isWonder = await wonderscontract2.getInterstateSystem(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract2.connect(signer1).deleteWonder2(0, 7);
            var isWonder = await wonderscontract2.getInterstateSystem(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //manhattan project
        it("wonder2 manhattan project system tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 8)).to.be.revertedWith("Requires 3000 infrastructure to purchase");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 8)).to.be.revertedWith("Must have 300 Technology to purchase");
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await wonderscontract2.connect(signer1).buyWonder2(0, 8);
            var isWonder = await wonderscontract2.getManhattanProject(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder2 manhattan project purchase errors", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(1, 8)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract2.connect(signer0).updateManhattanProjectCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 8)).to.be.revertedWith("Insufficient balance");
            await wonderscontract2.connect(signer0).updateManhattanProjectCost(100);
            await wonderscontract2.connect(signer1).buyWonder2(0, 8);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 8)).to.be.revertedWith("Already owned");
        });
        it("wonder2 tests manhattan project price can be updated", async function () {
            let prices = await wonderscontract2.getWonderCosts2();
            var cost = prices[7];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("100000000000000000000000000");
            await wonderscontract2.connect(signer0).updateManhattanProjectCost(100);
            let newPrices = await wonderscontract2.getWonderCosts2();
            var newCost = newPrices[7];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder2 tests that manhattan project cant be deleted", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract2.connect(signer1).buyWonder2(0, 8);
            var isWonder = await wonderscontract2.getManhattanProject(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).deleteWonder2(0, 8)).to.be.revertedWith("Unable to delete Manhattan Project");
            var isWonder = await wonderscontract2.getManhattanProject(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
        });
        //mining industry consortium
        it("wonder2 mining industry consortium system tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 9)).to.be.revertedWith("Must have 1000 Technology to purchase");
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 9)).to.be.revertedWith("Must have 5000 Infrastructure to purchase");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 9)).to.be.revertedWith("Must have 3000 Land to purchase");
            await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await wonderscontract2.connect(signer1).buyWonder2(0, 9);
            var isWonder = await wonderscontract2.getMiningIndustryConsortium(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder2 mining industry consortium purchase errors", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(1, 9)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract2.connect(signer0).updateMiningIndustryConsortiumCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 9)).to.be.revertedWith("Insufficient balance");
            await wonderscontract2.connect(signer0).updateMiningIndustryConsortiumCost(100);
            await wonderscontract2.connect(signer1).buyWonder2(0, 9);
            await (0, chai_1.expect)(wonderscontract2.connect(signer1).buyWonder2(0, 9)).to.be.revertedWith("Already owned");
        });
        it("wonder2 tests mining industry consortium price can be updated", async function () {
            let prices = await wonderscontract2.getWonderCosts2();
            var cost = prices[8];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("25000000000000000000000000");
            await wonderscontract2.connect(signer0).updateMiningIndustryConsortiumCost(100);
            let newPrices = await wonderscontract2.getWonderCosts2();
            var newCost = newPrices[8];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder2 tests that mining industry consortium can be deleted", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract2.connect(signer1).buyWonder2(0, 9);
            var isWonder = await wonderscontract2.getMiningIndustryConsortium(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract2.connect(signer1).deleteWonder2(0, 9);
            var isWonder = await wonderscontract2.getMiningIndustryConsortium(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
    });
    describe("Wonders Contract 3", function () {
        //movie industry
        it("wonder3 movie industry tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract3.connect(signer1).buyWonder3(0, 1);
            var isWonder = await wonderscontract3.getMovieIndustry(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder3 movie industry purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(1, 1)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract3.connect(signer0).updateMovieIndustryCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 1)).to.be.revertedWith("Insufficient balance");
            await wonderscontract3.connect(signer0).updateMovieIndustryCost(100);
            await wonderscontract3.connect(signer1).buyWonder3(0, 1);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 1)).to.be.revertedWith("Already owned");
        });
        it("wonder3 tests movie industry price can be updated", async function () {
            let prices = await wonderscontract3.getWonderCosts3();
            var cost = prices[0];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("26000000000000000000000000");
            await wonderscontract3.connect(signer0).updateMovieIndustryCost(100);
            let newPrices = await wonderscontract3.getWonderCosts3();
            var newCost = newPrices[0];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder3 tests that movie industry can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract3.connect(signer1).buyWonder3(0, 1);
            var isWonder = await wonderscontract3.getMovieIndustry(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract3.connect(signer1).deleteWonder3(0, 1);
            var isWonder = await wonderscontract3.getMovieIndustry(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //national cemetary
        it("wonder3 national cemetary tests", async function () {
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 2)).to.be.revertedWith("not enough casualties to purchase");
            await forcescontract.connect(signer0).increaseSoldierCasualties(0, 55000000);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 2)).to.be.revertedWith("Must own National War Memorial wonder to purchase");
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract3.connect(signer1).buyWonder3(0, 5);
            await wonderscontract3.connect(signer1).buyWonder3(0, 2);
            var isWonder = await wonderscontract3.getNationalCemetary(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(2);
        });
        it("wonder3 national cemetary purchase errors", async function () {
            await forcescontract.connect(signer0).increaseSoldierCasualties(0, 55000000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 5);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(1, 2)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract3.connect(signer0).updateNationalCemetaryCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 2)).to.be.revertedWith("Insufficient balance");
            await wonderscontract3.connect(signer0).updateNationalCemetaryCost(100);
            await wonderscontract3.connect(signer1).buyWonder3(0, 2);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 2)).to.be.revertedWith("Already owned");
        });
        it("wonder3 tests national cemetary price can be updated", async function () {
            let prices = await wonderscontract3.getWonderCosts3();
            var cost = prices[1];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("150000000000000000000000000");
            await wonderscontract3.connect(signer0).updateNationalCemetaryCost(100);
            let newPrices = await wonderscontract3.getWonderCosts3();
            var newCost = newPrices[1];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder3 tests that national cemetary can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await forcescontract.connect(signer0).increaseSoldierCasualties(0, 55000000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 5);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(1);
            await wonderscontract3.connect(signer1).buyWonder3(0, 2);
            var isWonder = await wonderscontract3.getNationalCemetary(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(2);
            await wonderscontract3.connect(signer1).deleteWonder3(0, 2);
            var isWonder = await wonderscontract3.getNationalCemetary(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //national environmental office
        it("wonder3 national environmental office tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 3)).to.be.revertedWith("Requires 13000 infrastructure to purchase");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 13000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 3);
            var isWonder = await wonderscontract3.getNationalEnvironmentOffice(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder3 national environmental office purchase errors", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 13000);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(1, 3)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract3.connect(signer0).updateNationalEnvironmentOfficeCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 3)).to.be.revertedWith("Insufficient balance");
            await wonderscontract3.connect(signer0).updateNationalEnvironmentOfficeCost(100);
            await wonderscontract3.connect(signer1).buyWonder3(0, 3);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 3)).to.be.revertedWith("Already owned");
        });
        it("wonder3 tests national environmental office can be updated", async function () {
            let prices = await wonderscontract3.getWonderCosts3();
            var cost = prices[2];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("100000000000000000000000000");
            await wonderscontract3.connect(signer0).updateNationalEnvironmentOfficeCost(100);
            let newPrices = await wonderscontract3.getWonderCosts3();
            var newCost = newPrices[2];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder3 tests that national environmental office can be deleted", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 13000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract3.connect(signer1).buyWonder3(0, 3);
            var isWonder = await wonderscontract3.getNationalEnvironmentOffice(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract3.connect(signer1).deleteWonder3(0, 3);
            var isWonder = await wonderscontract3.getNationalEnvironmentOffice(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //national research lab
        it("wonder3 national research lab tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            var isWonder = await wonderscontract3.getNationalResearchLab(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder3 national research lab purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(1, 4)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract3.connect(signer0).updateNationalResearchLabCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 4)).to.be.revertedWith("Insufficient balance");
            await wonderscontract3.connect(signer0).updateNationalResearchLabCost(100);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 4)).to.be.revertedWith("Already owned");
        });
        it("wonder3 tests national research lab can be updated", async function () {
            let prices = await wonderscontract3.getWonderCosts3();
            var cost = prices[3];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("35000000000000000000000000");
            await wonderscontract3.connect(signer0).updateNationalResearchLabCost(100);
            let newPrices = await wonderscontract3.getWonderCosts3();
            var newCost = newPrices[3];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder3 tests that national research lab can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 13000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            var isWonder = await wonderscontract3.getNationalResearchLab(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract3.connect(signer1).deleteWonder3(0, 4);
            var isWonder = await wonderscontract3.getNationalResearchLab(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //national war memorial
        it("wonder3 national war memorial tests", async function () {
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 5)).to.be.revertedWith("not enough casualties");
            await forcescontract.connect(signer0).increaseSoldierCasualties(0, 100000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract3.connect(signer1).buyWonder3(0, 5);
            var isWonder = await wonderscontract3.getNationalWarMemorial(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder3 national war memorial purchase errors", async function () {
            await forcescontract.connect(signer0).increaseSoldierCasualties(0, 100000);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(1, 5)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract3.connect(signer0).updateNationalWarMemorialCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 5)).to.be.revertedWith("Insufficient balance");
            await wonderscontract3.connect(signer0).updateNationalWarMemorialCost(100);
            await wonderscontract3.connect(signer1).buyWonder3(0, 5);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 5)).to.be.revertedWith("Already owned");
        });
        it("wonder3 tests national war memorial can be updated", async function () {
            let prices = await wonderscontract3.getWonderCosts3();
            var cost = prices[4];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("27000000000000000000000000");
            await wonderscontract3.connect(signer0).updateNationalWarMemorialCost(100);
            let newPrices = await wonderscontract3.getWonderCosts3();
            var newCost = newPrices[4];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder3 tests that national war memorial can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 13000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await forcescontract.connect(signer0).increaseSoldierCasualties(0, 100000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract3.connect(signer1).buyWonder3(0, 5);
            var isWonder = await wonderscontract3.getNationalWarMemorial(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract3.connect(signer1).deleteWonder3(0, 5);
            var isWonder = await wonderscontract3.getNationalWarMemorial(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //nuclear power plant
        it("wonder3 nuclear power plant tests", async function () {
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 6)).to.be.revertedWith("Must have 1000 Technology to purchase");
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 6)).to.be.revertedWith("Must have 12000 Infrastructure to purchase");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 12000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 12000);
            var isWonder = await wonderscontract3.getNuclearPowerPlant(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder3 nuclear power plant purchase errors", async function () {
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 12000);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(1, 6)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract3.connect(signer0).updateNuclearPowerPlantCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 6)).to.be.revertedWith("Insufficient balance");
            await wonderscontract3.connect(signer0).updateNuclearPowerPlantCost(100);
            await wonderscontract3.connect(signer1).buyWonder3(0, 6);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 6)).to.be.revertedWith("Already owned");
        });
        it("wonder3 tests nuclear power plant can be updated", async function () {
            let prices = await wonderscontract3.getWonderCosts3();
            var cost = prices[5];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("75000000000000000000000000");
            await wonderscontract3.connect(signer0).updateNuclearPowerPlantCost(100);
            let newPrices = await wonderscontract3.getWonderCosts3();
            var newCost = newPrices[5];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder3 tests that nuclear power plant can be deleted", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 13000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await forcescontract.connect(signer0).increaseSoldierCasualties(0, 100000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract3.connect(signer1).buyWonder3(0, 6);
            var isWonder = await wonderscontract3.getNuclearPowerPlant(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract3.connect(signer1).deleteWonder3(0, 6);
            var isWonder = await wonderscontract3.getNuclearPowerPlant(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //pentagon
        it("wonder3 pentagon tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            var isWonder = await wonderscontract3.getPentagon(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder3 pentagon purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(1, 7)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract3.connect(signer0).updatePentagonCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 7)).to.be.revertedWith("Insufficient balance");
            await wonderscontract3.connect(signer0).updatePentagonCost(100);
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 7)).to.be.revertedWith("Already owned");
        });
        it("wonder3 tests pentagon can be updated", async function () {
            let prices = await wonderscontract3.getWonderCosts3();
            var cost = prices[6];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("30000000000000000000000000");
            await wonderscontract3.connect(signer0).updatePentagonCost(100);
            let newPrices = await wonderscontract3.getWonderCosts3();
            var newCost = newPrices[6];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder3 tests that pentagon can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 13000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            var isWonder = await wonderscontract3.getPentagon(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract3.connect(signer1).deleteWonder3(0, 7);
            var isWonder = await wonderscontract3.getPentagon(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //political lobbyists
        it("wonder3 political lobbyists tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract3.connect(signer1).buyWonder3(0, 8);
            var isWonder = await wonderscontract3.getPoliticalLobbyists(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder3 political lobbyists purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(1, 8)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract3.connect(signer0).updatePoliticalLobbyistsCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 8)).to.be.revertedWith("Insufficient balance");
            await wonderscontract3.connect(signer0).updatePoliticalLobbyistsCost(100);
            await wonderscontract3.connect(signer1).buyWonder3(0, 8);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 8)).to.be.revertedWith("Already owned");
        });
        it("wonder3 tests political lobbyists can be updated", async function () {
            let prices = await wonderscontract3.getWonderCosts3();
            var cost = prices[7];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("50000000000000000000000000");
            await wonderscontract3.connect(signer0).updatePoliticalLobbyistsCost(100);
            let newPrices = await wonderscontract3.getWonderCosts3();
            var newCost = newPrices[7];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder3 tests that political lobbyists can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 13000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract3.connect(signer1).buyWonder3(0, 8);
            var isWonder = await wonderscontract3.getPoliticalLobbyists(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract3.connect(signer1).deleteWonder3(0, 8);
            var isWonder = await wonderscontract3.getPoliticalLobbyists(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //scientific development center
        it("wonder3 scientific development center tests", async function () {
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 9)).to.be.revertedWith("Must have 3000 Technology to purchase");
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 9)).to.be.revertedWith("Must have 14000 Infrastructure to purchase");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 14000);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 9)).to.be.revertedWith("Great University required to purchase");
            await wonderscontract2.connect(signer1).buyWonder2(0, 3);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 9)).to.be.revertedWith("National Research Lab required to purchase");
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(2);
            await wonderscontract3.connect(signer1).buyWonder3(0, 9);
            var isWonder = await wonderscontract3.getScientificDevelopmentCenter(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(3);
        });
        it("wonder3 scientific development center purchase errors", async function () {
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 14000);
            await wonderscontract2.connect(signer1).buyWonder2(0, 3);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(1, 9)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract3.connect(signer0).updateScientificDevelopmentCenterCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 9)).to.be.revertedWith("Insufficient balance");
            await wonderscontract3.connect(signer0).updateScientificDevelopmentCenterCost(100);
            await wonderscontract3.connect(signer1).buyWonder3(0, 9);
            await (0, chai_1.expect)(wonderscontract3.connect(signer1).buyWonder3(0, 9)).to.be.revertedWith("Already owned");
        });
        it("wonder3 tests scientific development center can be updated", async function () {
            let prices = await wonderscontract3.getWonderCosts3();
            var cost = prices[8];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("150000000000000000000000000");
            await wonderscontract3.connect(signer0).updateScientificDevelopmentCenterCost(100);
            let newPrices = await wonderscontract3.getWonderCosts3();
            var newCost = newPrices[8];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder3 tests that scientific development center can be deleted", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 14000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await wonderscontract2.connect(signer1).buyWonder2(0, 3);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(2);
            await wonderscontract3.connect(signer1).buyWonder3(0, 9);
            var isWonder = await wonderscontract3.getScientificDevelopmentCenter(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(3);
            await wonderscontract3.connect(signer1).deleteWonder3(0, 9);
            var isWonder = await wonderscontract3.getScientificDevelopmentCenter(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
    });
    describe("Wonders Contract 4", function () {
        //social security
        it("wonder4 social security tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract4.connect(signer1).buyWonder4(0, 1);
            var isWonder = await wonderscontract4.getSocialSecuritySystem(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder4 social security purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(1, 1)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract4.connect(signer0).updateSocialSecuritySystemCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 1)).to.be.revertedWith("Insufficient balance");
            await wonderscontract4.connect(signer0).updateSocialSecuritySystemCost(100);
            await wonderscontract4.connect(signer1).buyWonder4(0, 1);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 1)).to.be.revertedWith("Already owned");
        });
        it("wonder4 tests social security can be updated", async function () {
            let prices = await wonderscontract4.getWonderCosts4();
            var cost = prices[0];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("40000000000000000000000000");
            await wonderscontract4.connect(signer0).updateSocialSecuritySystemCost(100);
            let newPrices = await wonderscontract4.getWonderCosts4();
            var newCost = newPrices[0];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder4 tests that social security can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 14000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract4.connect(signer1).buyWonder4(0, 1);
            var isWonder = await wonderscontract4.getSocialSecuritySystem(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract4.connect(signer1).deleteWonder4(0, 1);
            var isWonder = await wonderscontract4.getSocialSecuritySystem(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //space program
        it("wonder4 space program tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract4.connect(signer1).buyWonder4(0, 2);
            var isWonder = await wonderscontract4.getSpaceProgram(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder4 space program purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(1, 2)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract4.connect(signer0).updateSpaceProgramCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 2)).to.be.revertedWith("Insufficient balance");
            await wonderscontract4.connect(signer0).updateSpaceProgramCost(100);
            await wonderscontract4.connect(signer1).buyWonder4(0, 2);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 2)).to.be.revertedWith("Already owned");
        });
        it("wonder4 tests space program can be updated", async function () {
            let prices = await wonderscontract4.getWonderCosts4();
            var cost = prices[1];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("30000000000000000000000000");
            await wonderscontract4.connect(signer0).updateSpaceProgramCost(100);
            let newPrices = await wonderscontract4.getWonderCosts4();
            var newCost = newPrices[1];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder4 tests that space program can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 14000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract4.connect(signer1).buyWonder4(0, 2);
            var isWonder = await wonderscontract4.getSpaceProgram(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract4.connect(signer1).deleteWonder4(0, 2);
            var isWonder = await wonderscontract4.getSpaceProgram(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //stock market
        it("wonder4 stock market tests", async function () {
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract4.connect(signer1).buyWonder4(0, 3);
            var isWonder = await wonderscontract4.getStockMarket(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder4 stock market purchase errors", async function () {
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(1, 3)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract4.connect(signer0).updateStockMarketCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 3)).to.be.revertedWith("Insufficient balance");
            await wonderscontract4.connect(signer0).updateStockMarketCost(100);
            await wonderscontract4.connect(signer1).buyWonder4(0, 3);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 3)).to.be.revertedWith("Already owned");
        });
        it("wonder4 tests stock market can be updated", async function () {
            let prices = await wonderscontract4.getWonderCosts4();
            var cost = prices[2];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("30000000000000000000000000");
            await wonderscontract4.connect(signer0).updateStockMarketCost(100);
            let newPrices = await wonderscontract4.getWonderCosts4();
            var newCost = newPrices[2];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder4 tests that stock market can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 14000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract4.connect(signer1).buyWonder4(0, 3);
            var isWonder = await wonderscontract4.getStockMarket(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract4.connect(signer1).deleteWonder4(0, 3);
            var isWonder = await wonderscontract4.getStockMarket(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //strategic defense initiative
        it("wonder4 strategic defense initiative tests", async function () {
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 4)).to.be.revertedWith("Must own at least 3 missile defense improvements");
            await billscontract.connect(signer1).payBills(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await improvementscontract4.connect(signer1).buyImprovement4(3, 0, 1);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 4)).to.be.revertedWith("Must own at least 3 satellite improvements");
            await improvementscontract3.connect(signer1).buyImprovement3(3, 0, 5);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract4.connect(signer1).buyWonder4(0, 4);
            var isWonder = await wonderscontract4.getStrategicDefenseInitiative(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
        });
        it("wonder4 strategic defense initiative purchase errors", async function () {
            await billscontract.connect(signer1).payBills(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await improvementscontract4.connect(signer1).buyImprovement4(3, 0, 1);
            await improvementscontract3.connect(signer1).buyImprovement3(3, 0, 5);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(1, 4)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract4.connect(signer0).updateStrategicDefenseInitiativeCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 4)).to.be.revertedWith("Insufficient balance");
            await wonderscontract4.connect(signer0).updateStrategicDefenseInitiativeCost(100);
            await wonderscontract4.connect(signer1).buyWonder4(0, 4);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 4)).to.be.revertedWith("Already owned");
        });
        it("wonder4 tests strategic defense initiative can be updated", async function () {
            let prices = await wonderscontract4.getWonderCosts4();
            var cost = prices[3];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("75000000000000000000000000");
            await wonderscontract4.connect(signer0).updateStrategicDefenseInitiativeCost(100);
            let newPrices = await wonderscontract4.getWonderCosts4();
            var newCost = newPrices[3];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder4 tests that strategic defense initiative can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 14000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await billscontract.connect(signer1).payBills(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await improvementscontract4.connect(signer1).buyImprovement4(3, 0, 1);
            await improvementscontract3.connect(signer1).buyImprovement3(3, 0, 5);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(0);
            await wonderscontract4.connect(signer1).buyWonder4(0, 4);
            var isWonder = await wonderscontract4.getStrategicDefenseInitiative(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(1);
            await wonderscontract4.connect(signer1).deleteWonder4(0, 4);
            var isWonder = await wonderscontract4.getStrategicDefenseInitiative(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //superior logistical support
        it("wonder4 superior logistical support tests", async function () {
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 5)).to.be.revertedWith("Pentagon required in order to purchase");
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(1);
            await wonderscontract4.connect(signer1).buyWonder4(0, 5);
            var isWonder = await wonderscontract4.getSuperiorLogisticalSupport(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(2);
        });
        it("wonder4 superior logistical support purchase errors", async function () {
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(1, 5)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract4.connect(signer0).updateSuperiorLogisticalSupportCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 5)).to.be.revertedWith("Insufficient balance");
            await wonderscontract4.connect(signer0).updateSuperiorLogisticalSupportCost(100);
            await wonderscontract4.connect(signer1).buyWonder4(0, 5);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 5)).to.be.revertedWith("Already owned");
        });
        it("wonder4 tests superior logistical support can be updated", async function () {
            let prices = await wonderscontract4.getWonderCosts4();
            var cost = prices[4];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("80000000000000000000000000");
            await wonderscontract4.connect(signer0).updateSuperiorLogisticalSupportCost(100);
            let newPrices = await wonderscontract4.getWonderCosts4();
            var newCost = newPrices[4];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder4 tests that superior logistical support can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 14000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(1);
            await wonderscontract4.connect(signer1).buyWonder4(0, 5);
            var isWonder = await wonderscontract4.getSuperiorLogisticalSupport(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(2);
            await wonderscontract4.connect(signer1).deleteWonder4(0, 5);
            var isWonder = await wonderscontract4.getSuperiorLogisticalSupport(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //universal healthcare
        it("wonder4 universal healthcare tests", async function () {
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 6)).to.be.revertedWith("Must have 11000 Infrastructure to purchase");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 6)).to.be.revertedWith("Hospital improvement required to purchase");
            await billscontract.connect(signer1).payBills(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 9);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 5);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 6)).to.be.revertedWith("National Research Lab required to Purchase");
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(1);
            await wonderscontract4.connect(signer1).buyWonder4(0, 6);
            var isWonder = await wonderscontract4.getUniversalHealthcare(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(2);
        });
        it("wonder4 universal healthcare purchase errors", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            await billscontract.connect(signer1).payBills(0);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 1000);
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 9);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 5);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(1, 6)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract4.connect(signer0).updateUniversalHealthcareCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 6)).to.be.revertedWith("Insufficient balance");
            await wonderscontract4.connect(signer0).updateUniversalHealthcareCost(100);
            await wonderscontract4.connect(signer1).buyWonder4(0, 6);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 6)).to.be.revertedWith("Already owned");
        });
        it("wonder4 tests universal healthcare can be updated", async function () {
            let prices = await wonderscontract4.getWonderCosts4();
            var cost = prices[5];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("100000000000000000000000000");
            await wonderscontract4.connect(signer0).updateUniversalHealthcareCost(100);
            let newPrices = await wonderscontract4.getWonderCosts4();
            var newCost = newPrices[5];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder4 tests that universal healthcare can be deleted", async function () {
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 15000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await improvementscontract1.connect(signer1).buyImprovement1(2, 0, 9);
            await improvementscontract2.connect(signer1).buyImprovement2(1, 0, 5);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(1);
            await wonderscontract4.connect(signer1).buyWonder4(0, 6);
            var isWonder = await wonderscontract4.getUniversalHealthcare(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(2);
            await wonderscontract4.connect(signer1).deleteWonder4(0, 6);
            var isWonder = await wonderscontract4.getUniversalHealthcare(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
        //weapons research center
        it("wonder4 weapons research center tests", async function () {
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 7)).to.be.revertedWith("Pentagon required in order to purchase");
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 7)).to.be.revertedWith("National Research Lab required to Purchase");
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 7)).to.be.revertedWith("Must have 8500 Infrastructure to purchase");
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 7)).to.be.revertedWith("Must have 2000 Technology to purchase");
            await technologymarketcontrat.connect(signer1).buyTech(0, 2000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(2);
            await wonderscontract4.connect(signer1).buyWonder4(0, 7);
            var isWonder = await wonderscontract4.getWeaponsResearchCenter(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(3);
        });
        it("wonder4 weapons research center purchase errors", async function () {
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 8500);
            await technologymarketcontrat.connect(signer1).buyTech(0, 2000);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(1, 7)).to.be.revertedWith("!nation owner");
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 15)).to.be.revertedWith("Invalid wonder ID");
            await wonderscontract4.connect(signer0).updateWeaponsResearchCenterCost(BigInt(100000000000 * (10 ** 18)));
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 7)).to.be.revertedWith("Insufficient balance");
            await wonderscontract4.connect(signer0).updateWeaponsResearchCenterCost(100);
            await wonderscontract4.connect(signer1).buyWonder4(0, 7);
            await (0, chai_1.expect)(wonderscontract4.connect(signer1).buyWonder4(0, 7)).to.be.revertedWith("Already owned");
        });
        it("wonder4 tests weapons research center can be updated", async function () {
            let prices = await wonderscontract4.getWonderCosts4();
            var cost = prices[6];
            (0, chai_1.expect)(BigInt(cost).toString()).to.equal("150000000000000000000000000");
            await wonderscontract4.connect(signer0).updateWeaponsResearchCenterCost(100);
            let newPrices = await wonderscontract4.getWonderCosts4();
            var newCost = newPrices[6];
            (0, chai_1.expect)(newCost.toNumber()).to.equal(100);
        });
        it("wonder4 tests that weapons research center can be deleted", async function () {
            // await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 14000);
            // await landmarketcontract.connect(signer1).buyLand(0, 10000);
            // await technologymarketcontrat.connect(signer1).buyTech(0, 10000);
            await wonderscontract3.connect(signer1).buyWonder3(0, 7);
            await wonderscontract3.connect(signer1).buyWonder3(0, 4);
            await infrastructuremarketplace.connect(signer1).buyInfrastructure(0, 11000);
            await technologymarketcontrat.connect(signer1).buyTech(0, 2000);
            let wonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(wonderCount).to.equal(2);
            await wonderscontract4.connect(signer1).buyWonder4(0, 7);
            var isWonder = await wonderscontract4.getWeaponsResearchCenter(0);
            (0, chai_1.expect)(isWonder).to.equal(true);
            let newWonderCount = await wonderscontract1.getWonderCount(0);
            (0, chai_1.expect)(newWonderCount).to.equal(3);
            await wonderscontract4.connect(signer1).deleteWonder4(0, 7);
            var isWonder = await wonderscontract4.getWeaponsResearchCenter(0);
            (0, chai_1.expect)(isWonder).to.equal(false);
        });
    });
});
