import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";
import metadata from "../../../../backend/script-metadata.json";
import { Address } from "viem";
import { Abi, AbiParameter } from "abitype";
import { CountryMinter } from '../../../../backend/typechain-types/contracts/CountryMinter';
import { WarBucks } from '../../../../backend/typechain-types/contracts/WarBucks';
import { MetaNationsGovToken } from '../../../../backend/typechain-types/contracts/MetaNationsGovToken';
import { AidContract } from '../../../../backend/typechain-types/contracts/Aid.sol/AidContract';
import { AirBattleContract } from '../../../../backend/typechain-types/contracts/AirBattle.sol/AirBattleContract';
import { AdditionalAirBattle } from '../../../../backend/typechain-types/contracts/AirBattle.sol/AdditionalAirBattle';
import { BillsContract } from '../../../../backend/typechain-types/contracts/Bills.sol/BillsContract';
import { BombersContract } from '../../../../backend/typechain-types/contracts/Bombers.sol/BombersContract';
import { BombersMarketplace1 } from '../../../../backend/typechain-types/contracts/Bombers.sol/BombersMarketplace1';
import { BombersMarketplace2 } from '../../../../backend/typechain-types/contracts/Bombers.sol/BombersMarketplace2';
import { CountryParametersContract } from '../../../../backend/typechain-types/contracts/CountryParameters.sol/CountryParametersContract';
import { CrimeContract } from '../../../../backend/typechain-types/contracts/Crime.sol/CrimeContract';
import { CruiseMissileContract } from '../../../../backend/typechain-types/contracts/CruiseMissile.sol/CruiseMissileContract';
import { EnvironmentContract } from '../../../../backend/typechain-types/contracts/Environment.sol/EnvironmentContract';
import { FightersContract } from '../../../../backend/typechain-types/contracts/Fighters.sol/FightersContract';
import { FighterLosses } from '../../../../backend/typechain-types/contracts/Fighters.sol/FighterLosses';
import { FightersMarketplace1 } from '../../../../backend/typechain-types/contracts/Fighters.sol/FightersMarketplace1';
import { FightersMarketplace2 } from '../../../../backend/typechain-types/contracts/Fighters.sol/FightersMarketplace2';
import { ForcesContract } from '../../../../backend/typechain-types/contracts/Forces.sol/ForcesContract';
import { MissilesContract } from '../../../../backend/typechain-types/contracts/Missiles.sol/MissilesContract';
import { GroundBattleContract } from '../../../../backend/typechain-types/contracts/GroundBattle.sol/GroundBattleContract';
import { ImprovementsContract1, Improvement1DeletedEvent } from '../../../../backend/typechain-types/contracts/Improvements.sol/ImprovementsContract1';
import { ImprovementsContract2 } from '../../../../backend/typechain-types/contracts/Improvements.sol/ImprovementsContract2';
import { ImprovementsContract3 } from '../../../../backend/typechain-types/contracts/Improvements.sol/ImprovementsContract3';
import { ImprovementsContract4 } from '../../../../backend/typechain-types/contracts/Improvements.sol/ImprovementsContract4';
import { InfrastructureContract } from '../../../../backend/typechain-types/contracts/Infrastructure.sol/InfrastructureContract';
import { KeeperContract } from '../../../../backend/typechain-types/contracts/KeeperFile.sol/KeeperContract';
import { LandMarketContract } from '../../../../backend/typechain-types/contracts/LandMarket.sol/LandMarketContract';
import { MilitaryContract } from '../../../../backend/typechain-types/contracts/Military.sol/MilitaryContract';
import { NationStrengthContract } from '../../../../backend/typechain-types/contracts/NationStrength.sol/NationStrengthContract';
import { NavyContract } from '../../../../backend/typechain-types/contracts/Navy.sol/NavyContract';
import { NavyContract2 } from '../../../../backend/typechain-types/contracts/Navy.sol/NavyContract2';
import { AdditionalNavyContract } from '../../../../backend/typechain-types/contracts/Navy.sol/AdditionalNavyContract';
import { NavalActionsContract } from '../../../../backend/typechain-types/contracts/Navy.sol/NavalActionsContract';
import { NavalBlockadeContract } from '../../../../backend/typechain-types/contracts/NavyBattle.sol/NavalBlockadeContract';
import { BreakBlocadeContract } from '../../../../backend/typechain-types/contracts/NavyBattle.sol/BreakBlocadeContract';
import { NavalAttackContract } from '../../../../backend/typechain-types/contracts/NavyBattle.sol/NavalAttackContract';
import { NukeContract } from '../../../../backend/typechain-types/contracts/Nuke.sol/NukeContract';
import { ResourcesContract } from '../../../../backend/typechain-types/contracts/Resources.sol/ResourcesContract';
import { BonusResourcesContract } from '../../../../backend/typechain-types/contracts/Resources.sol/BonusResourcesContract';
import { SenateContract } from '../../../../backend/typechain-types/contracts/Senate.sol/SenateContract';
import { SpyContract } from '../../../../backend/typechain-types/contracts/Spies.sol/SpyContract';
import { SpyOperationsContract } from '../../../../backend/typechain-types/contracts/SpyOperations.sol/SpyOperationsContract';
import { TaxesContract } from '../../../../backend/typechain-types/contracts/Taxes.sol/TaxesContract';
import { AdditionalTaxesContract } from '../../../../backend/typechain-types/contracts/Taxes.sol/AdditionalTaxesContract';
import { TechnologyMarketContract } from '../../../../backend/typechain-types/contracts/TechnologyMarket.sol/TechnologyMarketContract';
import { TreasuryContract } from '../../../../backend/typechain-types/contracts/Treasury.sol/TreasuryContract';
import { WarContract } from '../../../../backend/typechain-types/contracts/War.sol/WarContract';
import { WondersContract1 } from '../../../../backend/typechain-types/contracts/Wonders.sol/WondersContract1';
import { WondersContract2 } from '../../../../backend/typechain-types/contracts/Wonders.sol/WondersContract2';
import { WondersContract3 } from '../../../../backend/typechain-types/contracts/Wonders.sol/WondersContract3';
import { WondersContract4 } from '../../../../backend/typechain-types/contracts/Wonders.sol/WondersContract4';

const fixAbi = (abi: any[]): Abi => {
  return abi.map((entry) => {
    if (entry.inputs) {
      entry.inputs = entry.inputs.map((input: AbiParameter) => ({
        ...input,
        name: input.name || "", // Provide a default name if undefined
      }));
    }
    return entry;
  });
};

const externalContracts: GenericContractsDeclaration = {
  31337: {
    CountryMinter: {
      address: metadata.HARDHAT.countryminter.address as Address,
      abi: fixAbi(metadata.HARDHAT.countryminter.ABI)
    },
    WarBucks: {
      address: metadata.HARDHAT.warbucks.address as Address,
      abi: fixAbi(metadata.HARDHAT.warbucks.ABI)
    },
    MetaNationsGovToken: {
      address: metadata.HARDHAT.metanationsgovtoken.address as Address,
      abi: fixAbi(metadata.HARDHAT.metanationsgovtoken.ABI)
    },
    AidContract: {
      address: metadata.HARDHAT.aidcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.aidcontract.ABI)
    },
    AirBattleContract: {
      address: metadata.HARDHAT.airbattlecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.airbattlecontract.ABI)
    },
    AdditionalAirBattle: {  
      address: metadata.HARDHAT.additionalairbattle.address as Address,
      abi: fixAbi(metadata.HARDHAT.additionalairbattle.ABI)
    },
    BillsContract: {
      address: metadata.HARDHAT.billscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.billscontract.ABI)
    },
    BombersContract: {
      address: metadata.HARDHAT.bomberscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.bomberscontract.ABI)
    },
    BombersMarketplace1 : {
      address: metadata.HARDHAT.bombersmarketplace1.address as Address,
      abi: fixAbi(metadata.HARDHAT.bombersmarketplace1.ABI)
    },
    BombersMarketplace2 : { 
      address: metadata.HARDHAT.bombersmarketplace2.address as Address,
      abi: fixAbi(metadata.HARDHAT.bombersmarketplace2.ABI)
    },
    CountryParametersContract : {
      address: metadata.HARDHAT.countryparameterscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.countryparameterscontract.ABI)
    },
    CrimeContract : {
      address: metadata.HARDHAT.crimecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.crimecontract.ABI)
    },
    CruiseMissileContract : {
      address: metadata.HARDHAT.cruisemissilecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.cruisemissilecontract.ABI)
    },
    EnvironmentContract : { 
      address: metadata.HARDHAT.environmentcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.environmentcontract.ABI)
    },
    FightersContract : {
      address: metadata.HARDHAT.fighterscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.fighterscontract.ABI)
    },
    FighterLosses : {
      address: metadata.HARDHAT.fighterlosses.address as Address,
      abi: fixAbi(metadata.HARDHAT.fighterlosses.ABI)
    },
    FightersMarketplace1 : {  
      address: metadata.HARDHAT.fightersmarketplace1.address as Address,
      abi: fixAbi(metadata.HARDHAT.fightersmarketplace1.ABI)
    },
    FightersMarketplace2 : {  
      address: metadata.HARDHAT.fightersmarketplace2.address as Address,
      abi: fixAbi(metadata.HARDHAT.fightersmarketplace2.ABI)
    },
    ForcesContract : {
      address: metadata.HARDHAT.forcescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.forcescontract.ABI)
    },
    MissilesContract  : {
      address: metadata.HARDHAT.missilescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.missilescontract.ABI)
    },
    GroundBattleContract : {
      address: metadata.HARDHAT.groundbattlecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.groundbattlecontract.ABI)
    },
    ImprovementsContract1 : {
      address: metadata.HARDHAT.improvementscontract1.address as Address,
      abi: fixAbi(metadata.HARDHAT.improvementscontract1.ABI)
    },
    ImprovementsContract2 : {
      address: metadata.HARDHAT.improvementscontract2.address as Address,
      abi: fixAbi(metadata.HARDHAT.improvementscontract2.ABI)
    },
    ImprovementsContract3 : {
      address: metadata.HARDHAT.improvementscontract3.address as Address,
      abi: fixAbi(metadata.HARDHAT.improvementscontract3.ABI)
    },
    ImprovementsContract4 : {
      address: metadata.HARDHAT.improvementscontract4.address as Address,
      abi: fixAbi(metadata.HARDHAT.improvementscontract4.ABI)
    },
    InfrastructureContract  : {
      address: metadata.HARDHAT.infrastructurecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.infrastructurecontract.ABI)
    },
    InfrastructureMarketContract  : {
      address: metadata.HARDHAT.infrastructuremarketplace.address as Address,
      abi: fixAbi(metadata.HARDHAT.infrastructuremarketplace.ABI)
    },
    KeeperContract : {
      address: metadata.HARDHAT.keepercontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.keepercontract.ABI)
    },
    LandMarketContract : {
      address: metadata.HARDHAT.landmarketcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.landmarketcontract.ABI)
    },
    MilitaryContract : {
      address: metadata.HARDHAT.militarycontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.militarycontract.ABI)
    },
    NationStrengthContract : {
      address: metadata.HARDHAT.nationstrengthcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.nationstrengthcontract.ABI)
    },
    NavyContract : {
      address: metadata.HARDHAT.navycontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.navycontract.ABI)
    },
    NavyContract2 : {
      address: metadata.HARDHAT.navycontract2.address as Address,
      abi: fixAbi(metadata.HARDHAT.navycontract2.ABI)
    },
    AdditionalNavyContract : {
      address: metadata.HARDHAT.additionalnavycontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.additionalnavycontract.ABI)
    },
    NavalActionsContract : {  
      address: metadata.HARDHAT.navalactionscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.navalactionscontract.ABI)
    },
    NavalBlockadeContract : {
      address: metadata.HARDHAT.navalblockadecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.navalblockadecontract.ABI)
    },
    BreakBlockadeContract : {
      address: metadata.HARDHAT.breakblockadecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.breakblockadecontract.ABI)
    },
    NavalAttackContract : {
      address: metadata.HARDHAT.navalattackcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.navalattackcontract.ABI)
    },
    NukeContract : {
      address: metadata.HARDHAT.nukecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.nukecontract.ABI)
    },
    ResourcesContract : {
      address: metadata.HARDHAT.resourcescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.resourcescontract.ABI)
    },
    BonusResourcesContract : {
      address: metadata.HARDHAT.bonusresourcescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.bonusresourcescontract.ABI)
    },
    SenateContract : {
      address: metadata.HARDHAT.senatecontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.senatecontract.ABI)
    },
    SpyContract : {
      address: metadata.HARDHAT.spycontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.spycontract.ABI)
    },
    SpyOperationsContract : {
      address: metadata.HARDHAT.spyoperationscontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.spyoperationscontract.ABI)
    },
    TaxesContract : {
      address: metadata.HARDHAT.taxescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.taxescontract.ABI)
    },
    AdditionalTaxesContract : {
      address: metadata.HARDHAT.additionaltaxescontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.additionaltaxescontract.ABI)
    },
    TechnologyMarketContract : {
      address: metadata.HARDHAT.technologymarketcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.technologymarketcontract.ABI)
    },
    TreasuryContract : {
      address: metadata.HARDHAT.treasurycontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.treasurycontract.ABI)
    },
    WarContract : {
      address: metadata.HARDHAT.warcontract.address as Address,
      abi: fixAbi(metadata.HARDHAT.warcontract.ABI)
    },
    WondersContract1 : {
      address: metadata.HARDHAT.wonderscontract1.address as Address,
      abi: fixAbi(metadata.HARDHAT.wonderscontract1.ABI)
    },
    WondersContract2 : {
      address: metadata.HARDHAT.wonderscontract2.address as Address,
      abi: fixAbi(metadata.HARDHAT.wonderscontract2.ABI)
    },
    WondersContract3  : {
      address: metadata.HARDHAT.wonderscontract3.address as Address,
      abi: fixAbi(metadata.HARDHAT.wonderscontract3.ABI)
    },
    WondersContract4 : {
      address: metadata.HARDHAT.wonderscontract4.address as Address,
      abi: fixAbi(metadata.HARDHAT.wonderscontract4.ABI)
    },    
  },
};

export default externalContracts;
