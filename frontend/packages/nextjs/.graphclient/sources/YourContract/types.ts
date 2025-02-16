// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace YourContractTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
};

export type AirBattle = {
  id: Scalars['ID']['output'];
  battleId: Scalars['BigInt']['output'];
  attackerId: Scalars['BigInt']['output'];
  defenderId: Scalars['BigInt']['output'];
  attackerFighterLosses: Scalars['Bytes']['output'];
  attackerBomberLosses: Scalars['Bytes']['output'];
  defenderFighterLosses: Scalars['Bytes']['output'];
  infrastructureDamage: Scalars['BigInt']['output'];
  tankDamage: Scalars['BigInt']['output'];
  cruiseMissileDamage: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
};

export type AirBattle_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  battleId?: InputMaybe<Scalars['BigInt']['input']>;
  battleId_not?: InputMaybe<Scalars['BigInt']['input']>;
  battleId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  battleId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  battleId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  battleId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  battleId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  battleId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerId?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_not?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderId?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_not?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerFighterLosses?: InputMaybe<Scalars['Bytes']['input']>;
  attackerFighterLosses_not?: InputMaybe<Scalars['Bytes']['input']>;
  attackerFighterLosses_gt?: InputMaybe<Scalars['Bytes']['input']>;
  attackerFighterLosses_lt?: InputMaybe<Scalars['Bytes']['input']>;
  attackerFighterLosses_gte?: InputMaybe<Scalars['Bytes']['input']>;
  attackerFighterLosses_lte?: InputMaybe<Scalars['Bytes']['input']>;
  attackerFighterLosses_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  attackerFighterLosses_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  attackerFighterLosses_contains?: InputMaybe<Scalars['Bytes']['input']>;
  attackerFighterLosses_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  attackerBomberLosses?: InputMaybe<Scalars['Bytes']['input']>;
  attackerBomberLosses_not?: InputMaybe<Scalars['Bytes']['input']>;
  attackerBomberLosses_gt?: InputMaybe<Scalars['Bytes']['input']>;
  attackerBomberLosses_lt?: InputMaybe<Scalars['Bytes']['input']>;
  attackerBomberLosses_gte?: InputMaybe<Scalars['Bytes']['input']>;
  attackerBomberLosses_lte?: InputMaybe<Scalars['Bytes']['input']>;
  attackerBomberLosses_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  attackerBomberLosses_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  attackerBomberLosses_contains?: InputMaybe<Scalars['Bytes']['input']>;
  attackerBomberLosses_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  defenderFighterLosses?: InputMaybe<Scalars['Bytes']['input']>;
  defenderFighterLosses_not?: InputMaybe<Scalars['Bytes']['input']>;
  defenderFighterLosses_gt?: InputMaybe<Scalars['Bytes']['input']>;
  defenderFighterLosses_lt?: InputMaybe<Scalars['Bytes']['input']>;
  defenderFighterLosses_gte?: InputMaybe<Scalars['Bytes']['input']>;
  defenderFighterLosses_lte?: InputMaybe<Scalars['Bytes']['input']>;
  defenderFighterLosses_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  defenderFighterLosses_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  defenderFighterLosses_contains?: InputMaybe<Scalars['Bytes']['input']>;
  defenderFighterLosses_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  infrastructureDamage?: InputMaybe<Scalars['BigInt']['input']>;
  infrastructureDamage_not?: InputMaybe<Scalars['BigInt']['input']>;
  infrastructureDamage_gt?: InputMaybe<Scalars['BigInt']['input']>;
  infrastructureDamage_lt?: InputMaybe<Scalars['BigInt']['input']>;
  infrastructureDamage_gte?: InputMaybe<Scalars['BigInt']['input']>;
  infrastructureDamage_lte?: InputMaybe<Scalars['BigInt']['input']>;
  infrastructureDamage_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  infrastructureDamage_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tankDamage?: InputMaybe<Scalars['BigInt']['input']>;
  tankDamage_not?: InputMaybe<Scalars['BigInt']['input']>;
  tankDamage_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tankDamage_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tankDamage_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tankDamage_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tankDamage_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tankDamage_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cruiseMissileDamage?: InputMaybe<Scalars['BigInt']['input']>;
  cruiseMissileDamage_not?: InputMaybe<Scalars['BigInt']['input']>;
  cruiseMissileDamage_gt?: InputMaybe<Scalars['BigInt']['input']>;
  cruiseMissileDamage_lt?: InputMaybe<Scalars['BigInt']['input']>;
  cruiseMissileDamage_gte?: InputMaybe<Scalars['BigInt']['input']>;
  cruiseMissileDamage_lte?: InputMaybe<Scalars['BigInt']['input']>;
  cruiseMissileDamage_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  cruiseMissileDamage_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AirBattle_filter>>>;
  or?: InputMaybe<Array<InputMaybe<AirBattle_filter>>>;
};

export type AirBattle_orderBy =
  | 'id'
  | 'battleId'
  | 'attackerId'
  | 'defenderId'
  | 'attackerFighterLosses'
  | 'attackerBomberLosses'
  | 'defenderFighterLosses'
  | 'infrastructureDamage'
  | 'tankDamage'
  | 'cruiseMissileDamage'
  | 'transactionHash';

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type CruiseMissileAttack = {
  id: Scalars['ID']['output'];
  attackId: Scalars['BigInt']['output'];
  attackerId: Scalars['BigInt']['output'];
  defenderId: Scalars['BigInt']['output'];
  landed: Scalars['Boolean']['output'];
  warId: Scalars['BigInt']['output'];
  damageTypeNumber: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
};

export type CruiseMissileAttack_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  attackId?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_not?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerId?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_not?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderId?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_not?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  landed?: InputMaybe<Scalars['Boolean']['input']>;
  landed_not?: InputMaybe<Scalars['Boolean']['input']>;
  landed_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  landed_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  warId?: InputMaybe<Scalars['BigInt']['input']>;
  warId_not?: InputMaybe<Scalars['BigInt']['input']>;
  warId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  warId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  warId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  warId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  warId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  warId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  damageTypeNumber?: InputMaybe<Scalars['BigInt']['input']>;
  damageTypeNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  damageTypeNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  damageTypeNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  damageTypeNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  damageTypeNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  damageTypeNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  damageTypeNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<CruiseMissileAttack_filter>>>;
  or?: InputMaybe<Array<InputMaybe<CruiseMissileAttack_filter>>>;
};

export type CruiseMissileAttack_orderBy =
  | 'id'
  | 'attackId'
  | 'attackerId'
  | 'defenderId'
  | 'landed'
  | 'warId'
  | 'damageTypeNumber'
  | 'transactionHash';

export type GroundBattle = {
  id: Scalars['ID']['output'];
  groundBattleId: Scalars['BigInt']['output'];
  warId: Scalars['BigInt']['output'];
  attackerId: Scalars['BigInt']['output'];
  attackerSoldierLosses: Scalars['BigInt']['output'];
  attackerTankLosses: Scalars['BigInt']['output'];
  defenderId: Scalars['BigInt']['output'];
  defenderSoldierLosses: Scalars['BigInt']['output'];
  defenderTankLosses: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
};

export type GroundBattle_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  groundBattleId?: InputMaybe<Scalars['BigInt']['input']>;
  groundBattleId_not?: InputMaybe<Scalars['BigInt']['input']>;
  groundBattleId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  groundBattleId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  groundBattleId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  groundBattleId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  groundBattleId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  groundBattleId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  warId?: InputMaybe<Scalars['BigInt']['input']>;
  warId_not?: InputMaybe<Scalars['BigInt']['input']>;
  warId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  warId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  warId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  warId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  warId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  warId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerId?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_not?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerSoldierLosses?: InputMaybe<Scalars['BigInt']['input']>;
  attackerSoldierLosses_not?: InputMaybe<Scalars['BigInt']['input']>;
  attackerSoldierLosses_gt?: InputMaybe<Scalars['BigInt']['input']>;
  attackerSoldierLosses_lt?: InputMaybe<Scalars['BigInt']['input']>;
  attackerSoldierLosses_gte?: InputMaybe<Scalars['BigInt']['input']>;
  attackerSoldierLosses_lte?: InputMaybe<Scalars['BigInt']['input']>;
  attackerSoldierLosses_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerSoldierLosses_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerTankLosses?: InputMaybe<Scalars['BigInt']['input']>;
  attackerTankLosses_not?: InputMaybe<Scalars['BigInt']['input']>;
  attackerTankLosses_gt?: InputMaybe<Scalars['BigInt']['input']>;
  attackerTankLosses_lt?: InputMaybe<Scalars['BigInt']['input']>;
  attackerTankLosses_gte?: InputMaybe<Scalars['BigInt']['input']>;
  attackerTankLosses_lte?: InputMaybe<Scalars['BigInt']['input']>;
  attackerTankLosses_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerTankLosses_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderId?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_not?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderSoldierLosses?: InputMaybe<Scalars['BigInt']['input']>;
  defenderSoldierLosses_not?: InputMaybe<Scalars['BigInt']['input']>;
  defenderSoldierLosses_gt?: InputMaybe<Scalars['BigInt']['input']>;
  defenderSoldierLosses_lt?: InputMaybe<Scalars['BigInt']['input']>;
  defenderSoldierLosses_gte?: InputMaybe<Scalars['BigInt']['input']>;
  defenderSoldierLosses_lte?: InputMaybe<Scalars['BigInt']['input']>;
  defenderSoldierLosses_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderSoldierLosses_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderTankLosses?: InputMaybe<Scalars['BigInt']['input']>;
  defenderTankLosses_not?: InputMaybe<Scalars['BigInt']['input']>;
  defenderTankLosses_gt?: InputMaybe<Scalars['BigInt']['input']>;
  defenderTankLosses_lt?: InputMaybe<Scalars['BigInt']['input']>;
  defenderTankLosses_gte?: InputMaybe<Scalars['BigInt']['input']>;
  defenderTankLosses_lte?: InputMaybe<Scalars['BigInt']['input']>;
  defenderTankLosses_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderTankLosses_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GroundBattle_filter>>>;
  or?: InputMaybe<Array<InputMaybe<GroundBattle_filter>>>;
};

export type GroundBattle_orderBy =
  | 'id'
  | 'groundBattleId'
  | 'warId'
  | 'attackerId'
  | 'attackerSoldierLosses'
  | 'attackerTankLosses'
  | 'defenderId'
  | 'defenderSoldierLosses'
  | 'defenderTankLosses'
  | 'transactionHash';

export type Nation = {
  id: Scalars['ID']['output'];
  nationId: Scalars['BigInt']['output'];
  ruler: Scalars['String']['output'];
  name: Scalars['String']['output'];
  owner: Scalars['Bytes']['output'];
  createdAt: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
};

export type Nation_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nationId?: InputMaybe<Scalars['BigInt']['input']>;
  nationId_not?: InputMaybe<Scalars['BigInt']['input']>;
  nationId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  nationId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  nationId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  nationId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  nationId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  nationId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  ruler?: InputMaybe<Scalars['String']['input']>;
  ruler_not?: InputMaybe<Scalars['String']['input']>;
  ruler_gt?: InputMaybe<Scalars['String']['input']>;
  ruler_lt?: InputMaybe<Scalars['String']['input']>;
  ruler_gte?: InputMaybe<Scalars['String']['input']>;
  ruler_lte?: InputMaybe<Scalars['String']['input']>;
  ruler_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ruler_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ruler_contains?: InputMaybe<Scalars['String']['input']>;
  ruler_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ruler_not_contains?: InputMaybe<Scalars['String']['input']>;
  ruler_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ruler_starts_with?: InputMaybe<Scalars['String']['input']>;
  ruler_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ruler_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ruler_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ruler_ends_with?: InputMaybe<Scalars['String']['input']>;
  ruler_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ruler_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ruler_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Nation_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Nation_filter>>>;
};

export type Nation_orderBy =
  | 'id'
  | 'nationId'
  | 'ruler'
  | 'name'
  | 'owner'
  | 'createdAt'
  | 'transactionHash';

export type NavalAttack = {
  id: Scalars['ID']['output'];
  attackerLosses: Array<Scalars['BigInt']['output']>;
  defenderLosses: Array<Scalars['BigInt']['output']>;
  attackId: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
};

export type NavalAttack_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  attackerLosses?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerLosses_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerLosses_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerLosses_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerLosses_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerLosses_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderLosses?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderLosses_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderLosses_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderLosses_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderLosses_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderLosses_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackId?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_not?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NavalAttack_filter>>>;
  or?: InputMaybe<Array<InputMaybe<NavalAttack_filter>>>;
};

export type NavalAttack_orderBy =
  | 'id'
  | 'attackerLosses'
  | 'defenderLosses'
  | 'attackId'
  | 'transactionHash';

export type NukeAttack = {
  id: Scalars['ID']['output'];
  attackId: Scalars['BigInt']['output'];
  attackerId: Scalars['BigInt']['output'];
  defenderId: Scalars['BigInt']['output'];
  landed: Scalars['Boolean']['output'];
  warId: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
};

export type NukeAttack_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  attackId?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_not?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerId?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_not?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderId?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_not?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  landed?: InputMaybe<Scalars['Boolean']['input']>;
  landed_not?: InputMaybe<Scalars['Boolean']['input']>;
  landed_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  landed_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  warId?: InputMaybe<Scalars['BigInt']['input']>;
  warId_not?: InputMaybe<Scalars['BigInt']['input']>;
  warId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  warId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  warId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  warId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  warId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  warId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<NukeAttack_filter>>>;
  or?: InputMaybe<Array<InputMaybe<NukeAttack_filter>>>;
};

export type NukeAttack_orderBy =
  | 'id'
  | 'attackId'
  | 'attackerId'
  | 'defenderId'
  | 'landed'
  | 'warId'
  | 'transactionHash';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Query = {
  nation?: Maybe<Nation>;
  nations: Array<Nation>;
  war?: Maybe<War>;
  wars: Array<War>;
  groundBattle?: Maybe<GroundBattle>;
  groundBattles: Array<GroundBattle>;
  cruiseMissileAttack?: Maybe<CruiseMissileAttack>;
  cruiseMissileAttacks: Array<CruiseMissileAttack>;
  nukeAttack?: Maybe<NukeAttack>;
  nukeAttacks: Array<NukeAttack>;
  spyOperation?: Maybe<SpyOperation>;
  spyOperations: Array<SpyOperation>;
  airBattle?: Maybe<AirBattle>;
  airBattles: Array<AirBattle>;
  navalAttack?: Maybe<NavalAttack>;
  navalAttacks: Array<NavalAttack>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QuerynationArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerynationsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Nation_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Nation_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerywarArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerywarsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<War_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<War_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerygroundBattleArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerygroundBattlesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GroundBattle_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GroundBattle_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycruiseMissileAttackArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycruiseMissileAttacksArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CruiseMissileAttack_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<CruiseMissileAttack_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerynukeAttackArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerynukeAttacksArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NukeAttack_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<NukeAttack_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryspyOperationArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryspyOperationsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SpyOperation_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SpyOperation_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryairBattleArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryairBattlesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AirBattle_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AirBattle_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerynavalAttackArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerynavalAttacksArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NavalAttack_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<NavalAttack_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type SpyOperation = {
  id: Scalars['ID']['output'];
  attackId: Scalars['BigInt']['output'];
  attackerId: Scalars['BigInt']['output'];
  defenderId: Scalars['BigInt']['output'];
  success: Scalars['Boolean']['output'];
  attackType: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
};

export type SpyOperation_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  attackId?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_not?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  attackId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerId?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_not?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  attackerId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackerId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderId?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_not?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  defenderId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenderId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  success?: InputMaybe<Scalars['Boolean']['input']>;
  success_not?: InputMaybe<Scalars['Boolean']['input']>;
  success_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  success_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  attackType?: InputMaybe<Scalars['BigInt']['input']>;
  attackType_not?: InputMaybe<Scalars['BigInt']['input']>;
  attackType_gt?: InputMaybe<Scalars['BigInt']['input']>;
  attackType_lt?: InputMaybe<Scalars['BigInt']['input']>;
  attackType_gte?: InputMaybe<Scalars['BigInt']['input']>;
  attackType_lte?: InputMaybe<Scalars['BigInt']['input']>;
  attackType_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attackType_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SpyOperation_filter>>>;
  or?: InputMaybe<Array<InputMaybe<SpyOperation_filter>>>;
};

export type SpyOperation_orderBy =
  | 'id'
  | 'attackId'
  | 'attackerId'
  | 'defenderId'
  | 'success'
  | 'attackType'
  | 'transactionHash';

export type Subscription = {
  nation?: Maybe<Nation>;
  nations: Array<Nation>;
  war?: Maybe<War>;
  wars: Array<War>;
  groundBattle?: Maybe<GroundBattle>;
  groundBattles: Array<GroundBattle>;
  cruiseMissileAttack?: Maybe<CruiseMissileAttack>;
  cruiseMissileAttacks: Array<CruiseMissileAttack>;
  nukeAttack?: Maybe<NukeAttack>;
  nukeAttacks: Array<NukeAttack>;
  spyOperation?: Maybe<SpyOperation>;
  spyOperations: Array<SpyOperation>;
  airBattle?: Maybe<AirBattle>;
  airBattles: Array<AirBattle>;
  navalAttack?: Maybe<NavalAttack>;
  navalAttacks: Array<NavalAttack>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionnationArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionnationsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Nation_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Nation_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionwarArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionwarsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<War_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<War_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiongroundBattleArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiongroundBattlesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GroundBattle_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<GroundBattle_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncruiseMissileAttackArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncruiseMissileAttacksArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CruiseMissileAttack_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<CruiseMissileAttack_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionnukeAttackArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionnukeAttacksArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NukeAttack_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<NukeAttack_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionspyOperationArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionspyOperationsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SpyOperation_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SpyOperation_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionairBattleArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionairBattlesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AirBattle_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AirBattle_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionnavalAttackArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionnavalAttacksArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<NavalAttack_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<NavalAttack_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type War = {
  id: Scalars['ID']['output'];
  warId: Scalars['BigInt']['output'];
  offenseId: Scalars['BigInt']['output'];
  defenseId: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
};

export type War_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  warId?: InputMaybe<Scalars['BigInt']['input']>;
  warId_not?: InputMaybe<Scalars['BigInt']['input']>;
  warId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  warId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  warId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  warId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  warId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  warId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  offenseId?: InputMaybe<Scalars['BigInt']['input']>;
  offenseId_not?: InputMaybe<Scalars['BigInt']['input']>;
  offenseId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  offenseId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  offenseId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  offenseId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  offenseId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  offenseId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenseId?: InputMaybe<Scalars['BigInt']['input']>;
  defenseId_not?: InputMaybe<Scalars['BigInt']['input']>;
  defenseId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  defenseId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  defenseId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  defenseId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  defenseId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  defenseId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['String']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['String']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<War_filter>>>;
  or?: InputMaybe<Array<InputMaybe<War_filter>>>;
};

export type War_orderBy =
  | 'id'
  | 'warId'
  | 'offenseId'
  | 'defenseId'
  | 'transactionHash';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  nation: InContextSdkMethod<Query['nation'], QuerynationArgs, MeshContext>,
  /** null **/
  nations: InContextSdkMethod<Query['nations'], QuerynationsArgs, MeshContext>,
  /** null **/
  war: InContextSdkMethod<Query['war'], QuerywarArgs, MeshContext>,
  /** null **/
  wars: InContextSdkMethod<Query['wars'], QuerywarsArgs, MeshContext>,
  /** null **/
  groundBattle: InContextSdkMethod<Query['groundBattle'], QuerygroundBattleArgs, MeshContext>,
  /** null **/
  groundBattles: InContextSdkMethod<Query['groundBattles'], QuerygroundBattlesArgs, MeshContext>,
  /** null **/
  cruiseMissileAttack: InContextSdkMethod<Query['cruiseMissileAttack'], QuerycruiseMissileAttackArgs, MeshContext>,
  /** null **/
  cruiseMissileAttacks: InContextSdkMethod<Query['cruiseMissileAttacks'], QuerycruiseMissileAttacksArgs, MeshContext>,
  /** null **/
  nukeAttack: InContextSdkMethod<Query['nukeAttack'], QuerynukeAttackArgs, MeshContext>,
  /** null **/
  nukeAttacks: InContextSdkMethod<Query['nukeAttacks'], QuerynukeAttacksArgs, MeshContext>,
  /** null **/
  spyOperation: InContextSdkMethod<Query['spyOperation'], QueryspyOperationArgs, MeshContext>,
  /** null **/
  spyOperations: InContextSdkMethod<Query['spyOperations'], QueryspyOperationsArgs, MeshContext>,
  /** null **/
  airBattle: InContextSdkMethod<Query['airBattle'], QueryairBattleArgs, MeshContext>,
  /** null **/
  airBattles: InContextSdkMethod<Query['airBattles'], QueryairBattlesArgs, MeshContext>,
  /** null **/
  navalAttack: InContextSdkMethod<Query['navalAttack'], QuerynavalAttackArgs, MeshContext>,
  /** null **/
  navalAttacks: InContextSdkMethod<Query['navalAttacks'], QuerynavalAttacksArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  nation: InContextSdkMethod<Subscription['nation'], SubscriptionnationArgs, MeshContext>,
  /** null **/
  nations: InContextSdkMethod<Subscription['nations'], SubscriptionnationsArgs, MeshContext>,
  /** null **/
  war: InContextSdkMethod<Subscription['war'], SubscriptionwarArgs, MeshContext>,
  /** null **/
  wars: InContextSdkMethod<Subscription['wars'], SubscriptionwarsArgs, MeshContext>,
  /** null **/
  groundBattle: InContextSdkMethod<Subscription['groundBattle'], SubscriptiongroundBattleArgs, MeshContext>,
  /** null **/
  groundBattles: InContextSdkMethod<Subscription['groundBattles'], SubscriptiongroundBattlesArgs, MeshContext>,
  /** null **/
  cruiseMissileAttack: InContextSdkMethod<Subscription['cruiseMissileAttack'], SubscriptioncruiseMissileAttackArgs, MeshContext>,
  /** null **/
  cruiseMissileAttacks: InContextSdkMethod<Subscription['cruiseMissileAttacks'], SubscriptioncruiseMissileAttacksArgs, MeshContext>,
  /** null **/
  nukeAttack: InContextSdkMethod<Subscription['nukeAttack'], SubscriptionnukeAttackArgs, MeshContext>,
  /** null **/
  nukeAttacks: InContextSdkMethod<Subscription['nukeAttacks'], SubscriptionnukeAttacksArgs, MeshContext>,
  /** null **/
  spyOperation: InContextSdkMethod<Subscription['spyOperation'], SubscriptionspyOperationArgs, MeshContext>,
  /** null **/
  spyOperations: InContextSdkMethod<Subscription['spyOperations'], SubscriptionspyOperationsArgs, MeshContext>,
  /** null **/
  airBattle: InContextSdkMethod<Subscription['airBattle'], SubscriptionairBattleArgs, MeshContext>,
  /** null **/
  airBattles: InContextSdkMethod<Subscription['airBattles'], SubscriptionairBattlesArgs, MeshContext>,
  /** null **/
  navalAttack: InContextSdkMethod<Subscription['navalAttack'], SubscriptionnavalAttackArgs, MeshContext>,
  /** null **/
  navalAttacks: InContextSdkMethod<Subscription['navalAttacks'], SubscriptionnavalAttacksArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["YourContract"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
