// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@graphql-mesh/utils';

import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from "@graphql-mesh/graphql"
import BareMerger from "@graphql-mesh/merger-bare";
import { printWithCache } from '@graphql-mesh/utils';
import { usePersistedOperations } from '@graphql-yoga/plugin-persisted-operations';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { YourContractTypes } from './sources/YourContract/types';
import * as importedModule$0 from "./sources/YourContract/introspectionSchema";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



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

export type Blockade = {
  id: Scalars['ID']['output'];
  battleId: Scalars['BigInt']['output'];
  attackerLosses: Array<Scalars['BigInt']['output']>;
  defenderLosses: Array<Scalars['BigInt']['output']>;
  transactionHash: Scalars['String']['output'];
};

export type Blockade_filter = {
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
  and?: InputMaybe<Array<InputMaybe<Blockade_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Blockade_filter>>>;
};

export type Blockade_orderBy =
  | 'id'
  | 'battleId'
  | 'attackerLosses'
  | 'defenderLosses'
  | 'transactionHash';

export type BreakBlockade = {
  id: Scalars['ID']['output'];
  battleId: Scalars['BigInt']['output'];
  attackerLosses: Array<Scalars['BigInt']['output']>;
  defenderLosses: Array<Scalars['BigInt']['output']>;
  transactionHash: Scalars['String']['output'];
};

export type BreakBlockade_filter = {
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
  and?: InputMaybe<Array<InputMaybe<BreakBlockade_filter>>>;
  or?: InputMaybe<Array<InputMaybe<BreakBlockade_filter>>>;
};

export type BreakBlockade_orderBy =
  | 'id'
  | 'battleId'
  | 'attackerLosses'
  | 'defenderLosses'
  | 'transactionHash';

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

export type Message = {
  id: Scalars['ID']['output'];
  sender: Scalars['Bytes']['output'];
  reciever: Scalars['Bytes']['output'];
  message: Scalars['String']['output'];
  createdAt: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
};

export type Message_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  sender?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not?: InputMaybe<Scalars['Bytes']['input']>;
  sender_gt?: InputMaybe<Scalars['Bytes']['input']>;
  sender_lt?: InputMaybe<Scalars['Bytes']['input']>;
  sender_gte?: InputMaybe<Scalars['Bytes']['input']>;
  sender_lte?: InputMaybe<Scalars['Bytes']['input']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sender_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  reciever?: InputMaybe<Scalars['Bytes']['input']>;
  reciever_not?: InputMaybe<Scalars['Bytes']['input']>;
  reciever_gt?: InputMaybe<Scalars['Bytes']['input']>;
  reciever_lt?: InputMaybe<Scalars['Bytes']['input']>;
  reciever_gte?: InputMaybe<Scalars['Bytes']['input']>;
  reciever_lte?: InputMaybe<Scalars['Bytes']['input']>;
  reciever_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  reciever_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  reciever_contains?: InputMaybe<Scalars['Bytes']['input']>;
  reciever_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  message_not?: InputMaybe<Scalars['String']['input']>;
  message_gt?: InputMaybe<Scalars['String']['input']>;
  message_lt?: InputMaybe<Scalars['String']['input']>;
  message_gte?: InputMaybe<Scalars['String']['input']>;
  message_lte?: InputMaybe<Scalars['String']['input']>;
  message_in?: InputMaybe<Array<Scalars['String']['input']>>;
  message_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  message_contains?: InputMaybe<Scalars['String']['input']>;
  message_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  message_not_contains?: InputMaybe<Scalars['String']['input']>;
  message_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  message_starts_with?: InputMaybe<Scalars['String']['input']>;
  message_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  message_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  message_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  message_ends_with?: InputMaybe<Scalars['String']['input']>;
  message_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  message_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  message_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  and?: InputMaybe<Array<InputMaybe<Message_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Message_filter>>>;
};

export type Message_orderBy =
  | 'id'
  | 'sender'
  | 'reciever'
  | 'message'
  | 'createdAt'
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

export type Post = {
  id: Scalars['ID']['output'];
  sender: Scalars['Bytes']['output'];
  post: Scalars['String']['output'];
  createdAt: Scalars['BigInt']['output'];
  transactionHash: Scalars['String']['output'];
};

export type Post_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  sender?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not?: InputMaybe<Scalars['Bytes']['input']>;
  sender_gt?: InputMaybe<Scalars['Bytes']['input']>;
  sender_lt?: InputMaybe<Scalars['Bytes']['input']>;
  sender_gte?: InputMaybe<Scalars['Bytes']['input']>;
  sender_lte?: InputMaybe<Scalars['Bytes']['input']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sender_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  post?: InputMaybe<Scalars['String']['input']>;
  post_not?: InputMaybe<Scalars['String']['input']>;
  post_gt?: InputMaybe<Scalars['String']['input']>;
  post_lt?: InputMaybe<Scalars['String']['input']>;
  post_gte?: InputMaybe<Scalars['String']['input']>;
  post_lte?: InputMaybe<Scalars['String']['input']>;
  post_in?: InputMaybe<Array<Scalars['String']['input']>>;
  post_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  post_contains?: InputMaybe<Scalars['String']['input']>;
  post_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  post_not_contains?: InputMaybe<Scalars['String']['input']>;
  post_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  post_starts_with?: InputMaybe<Scalars['String']['input']>;
  post_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  post_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  post_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  post_ends_with?: InputMaybe<Scalars['String']['input']>;
  post_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  post_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  post_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  and?: InputMaybe<Array<InputMaybe<Post_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Post_filter>>>;
};

export type Post_orderBy =
  | 'id'
  | 'sender'
  | 'post'
  | 'createdAt'
  | 'transactionHash';

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
  breakBlockade?: Maybe<BreakBlockade>;
  breakBlockades: Array<BreakBlockade>;
  blockade?: Maybe<Blockade>;
  blockades: Array<Blockade>;
  message?: Maybe<Message>;
  messages: Array<Message>;
  post?: Maybe<Post>;
  posts: Array<Post>;
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


export type QuerybreakBlockadeArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerybreakBlockadesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BreakBlockade_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<BreakBlockade_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryblockadeArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryblockadesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Blockade_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Blockade_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymessageArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymessagesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Message_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Message_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypostArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypostsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Post_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Post_filter>;
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
  breakBlockade?: Maybe<BreakBlockade>;
  breakBlockades: Array<BreakBlockade>;
  blockade?: Maybe<Blockade>;
  blockades: Array<Blockade>;
  message?: Maybe<Message>;
  messages: Array<Message>;
  post?: Maybe<Post>;
  posts: Array<Post>;
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


export type SubscriptionbreakBlockadeArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionbreakBlockadesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BreakBlockade_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<BreakBlockade_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionblockadeArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionblockadesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Blockade_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Blockade_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmessageArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmessagesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Message_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Message_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpostArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpostsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Post_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Post_filter>;
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AirBattle: ResolverTypeWrapper<AirBattle>;
  AirBattle_filter: AirBattle_filter;
  AirBattle_orderBy: AirBattle_orderBy;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']['output']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Blockade: ResolverTypeWrapper<Blockade>;
  Blockade_filter: Blockade_filter;
  Blockade_orderBy: Blockade_orderBy;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BreakBlockade: ResolverTypeWrapper<BreakBlockade>;
  BreakBlockade_filter: BreakBlockade_filter;
  BreakBlockade_orderBy: BreakBlockade_orderBy;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']['output']>;
  CruiseMissileAttack: ResolverTypeWrapper<CruiseMissileAttack>;
  CruiseMissileAttack_filter: CruiseMissileAttack_filter;
  CruiseMissileAttack_orderBy: CruiseMissileAttack_orderBy;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GroundBattle: ResolverTypeWrapper<GroundBattle>;
  GroundBattle_filter: GroundBattle_filter;
  GroundBattle_orderBy: GroundBattle_orderBy;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Int8: ResolverTypeWrapper<Scalars['Int8']['output']>;
  Message: ResolverTypeWrapper<Message>;
  Message_filter: Message_filter;
  Message_orderBy: Message_orderBy;
  Nation: ResolverTypeWrapper<Nation>;
  Nation_filter: Nation_filter;
  Nation_orderBy: Nation_orderBy;
  NavalAttack: ResolverTypeWrapper<NavalAttack>;
  NavalAttack_filter: NavalAttack_filter;
  NavalAttack_orderBy: NavalAttack_orderBy;
  NukeAttack: ResolverTypeWrapper<NukeAttack>;
  NukeAttack_filter: NukeAttack_filter;
  NukeAttack_orderBy: NukeAttack_orderBy;
  OrderDirection: OrderDirection;
  Post: ResolverTypeWrapper<Post>;
  Post_filter: Post_filter;
  Post_orderBy: Post_orderBy;
  Query: ResolverTypeWrapper<{}>;
  SpyOperation: ResolverTypeWrapper<SpyOperation>;
  SpyOperation_filter: SpyOperation_filter;
  SpyOperation_orderBy: SpyOperation_orderBy;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  War: ResolverTypeWrapper<War>;
  War_filter: War_filter;
  War_orderBy: War_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AirBattle: AirBattle;
  AirBattle_filter: AirBattle_filter;
  BigDecimal: Scalars['BigDecimal']['output'];
  BigInt: Scalars['BigInt']['output'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Blockade: Blockade;
  Blockade_filter: Blockade_filter;
  Boolean: Scalars['Boolean']['output'];
  BreakBlockade: BreakBlockade;
  BreakBlockade_filter: BreakBlockade_filter;
  Bytes: Scalars['Bytes']['output'];
  CruiseMissileAttack: CruiseMissileAttack;
  CruiseMissileAttack_filter: CruiseMissileAttack_filter;
  Float: Scalars['Float']['output'];
  GroundBattle: GroundBattle;
  GroundBattle_filter: GroundBattle_filter;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Int8: Scalars['Int8']['output'];
  Message: Message;
  Message_filter: Message_filter;
  Nation: Nation;
  Nation_filter: Nation_filter;
  NavalAttack: NavalAttack;
  NavalAttack_filter: NavalAttack_filter;
  NukeAttack: NukeAttack;
  NukeAttack_filter: NukeAttack_filter;
  Post: Post;
  Post_filter: Post_filter;
  Query: {};
  SpyOperation: SpyOperation;
  SpyOperation_filter: SpyOperation_filter;
  String: Scalars['String']['output'];
  Subscription: {};
  War: War;
  War_filter: War_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String']['input'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String']['input'];
};

export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AirBattleResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['AirBattle'] = ResolversParentTypes['AirBattle']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  battleId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  attackerId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  defenderId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  attackerFighterLosses?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  attackerBomberLosses?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  defenderFighterLosses?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  infrastructureDamage?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tankDamage?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  cruiseMissileDamage?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type BlockadeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Blockade'] = ResolversParentTypes['Blockade']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  battleId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  attackerLosses?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  defenderLosses?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BreakBlockadeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['BreakBlockade'] = ResolversParentTypes['BreakBlockade']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  battleId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  attackerLosses?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  defenderLosses?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type CruiseMissileAttackResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CruiseMissileAttack'] = ResolversParentTypes['CruiseMissileAttack']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  attackId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  attackerId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  defenderId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  landed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  warId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  damageTypeNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GroundBattleResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['GroundBattle'] = ResolversParentTypes['GroundBattle']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  groundBattleId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  warId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  attackerId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  attackerSoldierLosses?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  attackerTankLosses?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  defenderId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  defenderSoldierLosses?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  defenderTankLosses?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Int8'], any> {
  name: 'Int8';
}

export type MessageResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  reciever?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Nation'] = ResolversParentTypes['Nation']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nationId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  ruler?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NavalAttackResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['NavalAttack'] = ResolversParentTypes['NavalAttack']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  attackerLosses?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  defenderLosses?: Resolver<Array<ResolversTypes['BigInt']>, ParentType, ContextType>;
  attackId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NukeAttackResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['NukeAttack'] = ResolversParentTypes['NukeAttack']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  attackId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  attackerId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  defenderId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  landed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  warId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  nation?: Resolver<Maybe<ResolversTypes['Nation']>, ParentType, ContextType, RequireFields<QuerynationArgs, 'id' | 'subgraphError'>>;
  nations?: Resolver<Array<ResolversTypes['Nation']>, ParentType, ContextType, RequireFields<QuerynationsArgs, 'skip' | 'first' | 'subgraphError'>>;
  war?: Resolver<Maybe<ResolversTypes['War']>, ParentType, ContextType, RequireFields<QuerywarArgs, 'id' | 'subgraphError'>>;
  wars?: Resolver<Array<ResolversTypes['War']>, ParentType, ContextType, RequireFields<QuerywarsArgs, 'skip' | 'first' | 'subgraphError'>>;
  groundBattle?: Resolver<Maybe<ResolversTypes['GroundBattle']>, ParentType, ContextType, RequireFields<QuerygroundBattleArgs, 'id' | 'subgraphError'>>;
  groundBattles?: Resolver<Array<ResolversTypes['GroundBattle']>, ParentType, ContextType, RequireFields<QuerygroundBattlesArgs, 'skip' | 'first' | 'subgraphError'>>;
  cruiseMissileAttack?: Resolver<Maybe<ResolversTypes['CruiseMissileAttack']>, ParentType, ContextType, RequireFields<QuerycruiseMissileAttackArgs, 'id' | 'subgraphError'>>;
  cruiseMissileAttacks?: Resolver<Array<ResolversTypes['CruiseMissileAttack']>, ParentType, ContextType, RequireFields<QuerycruiseMissileAttacksArgs, 'skip' | 'first' | 'subgraphError'>>;
  nukeAttack?: Resolver<Maybe<ResolversTypes['NukeAttack']>, ParentType, ContextType, RequireFields<QuerynukeAttackArgs, 'id' | 'subgraphError'>>;
  nukeAttacks?: Resolver<Array<ResolversTypes['NukeAttack']>, ParentType, ContextType, RequireFields<QuerynukeAttacksArgs, 'skip' | 'first' | 'subgraphError'>>;
  spyOperation?: Resolver<Maybe<ResolversTypes['SpyOperation']>, ParentType, ContextType, RequireFields<QueryspyOperationArgs, 'id' | 'subgraphError'>>;
  spyOperations?: Resolver<Array<ResolversTypes['SpyOperation']>, ParentType, ContextType, RequireFields<QueryspyOperationsArgs, 'skip' | 'first' | 'subgraphError'>>;
  airBattle?: Resolver<Maybe<ResolversTypes['AirBattle']>, ParentType, ContextType, RequireFields<QueryairBattleArgs, 'id' | 'subgraphError'>>;
  airBattles?: Resolver<Array<ResolversTypes['AirBattle']>, ParentType, ContextType, RequireFields<QueryairBattlesArgs, 'skip' | 'first' | 'subgraphError'>>;
  navalAttack?: Resolver<Maybe<ResolversTypes['NavalAttack']>, ParentType, ContextType, RequireFields<QuerynavalAttackArgs, 'id' | 'subgraphError'>>;
  navalAttacks?: Resolver<Array<ResolversTypes['NavalAttack']>, ParentType, ContextType, RequireFields<QuerynavalAttacksArgs, 'skip' | 'first' | 'subgraphError'>>;
  breakBlockade?: Resolver<Maybe<ResolversTypes['BreakBlockade']>, ParentType, ContextType, RequireFields<QuerybreakBlockadeArgs, 'id' | 'subgraphError'>>;
  breakBlockades?: Resolver<Array<ResolversTypes['BreakBlockade']>, ParentType, ContextType, RequireFields<QuerybreakBlockadesArgs, 'skip' | 'first' | 'subgraphError'>>;
  blockade?: Resolver<Maybe<ResolversTypes['Blockade']>, ParentType, ContextType, RequireFields<QueryblockadeArgs, 'id' | 'subgraphError'>>;
  blockades?: Resolver<Array<ResolversTypes['Blockade']>, ParentType, ContextType, RequireFields<QueryblockadesArgs, 'skip' | 'first' | 'subgraphError'>>;
  message?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<QuerymessageArgs, 'id' | 'subgraphError'>>;
  messages?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<QuerymessagesArgs, 'skip' | 'first' | 'subgraphError'>>;
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QuerypostArgs, 'id' | 'subgraphError'>>;
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QuerypostsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type SpyOperationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['SpyOperation'] = ResolversParentTypes['SpyOperation']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  attackId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  attackerId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  defenderId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  attackType?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  nation?: SubscriptionResolver<Maybe<ResolversTypes['Nation']>, "nation", ParentType, ContextType, RequireFields<SubscriptionnationArgs, 'id' | 'subgraphError'>>;
  nations?: SubscriptionResolver<Array<ResolversTypes['Nation']>, "nations", ParentType, ContextType, RequireFields<SubscriptionnationsArgs, 'skip' | 'first' | 'subgraphError'>>;
  war?: SubscriptionResolver<Maybe<ResolversTypes['War']>, "war", ParentType, ContextType, RequireFields<SubscriptionwarArgs, 'id' | 'subgraphError'>>;
  wars?: SubscriptionResolver<Array<ResolversTypes['War']>, "wars", ParentType, ContextType, RequireFields<SubscriptionwarsArgs, 'skip' | 'first' | 'subgraphError'>>;
  groundBattle?: SubscriptionResolver<Maybe<ResolversTypes['GroundBattle']>, "groundBattle", ParentType, ContextType, RequireFields<SubscriptiongroundBattleArgs, 'id' | 'subgraphError'>>;
  groundBattles?: SubscriptionResolver<Array<ResolversTypes['GroundBattle']>, "groundBattles", ParentType, ContextType, RequireFields<SubscriptiongroundBattlesArgs, 'skip' | 'first' | 'subgraphError'>>;
  cruiseMissileAttack?: SubscriptionResolver<Maybe<ResolversTypes['CruiseMissileAttack']>, "cruiseMissileAttack", ParentType, ContextType, RequireFields<SubscriptioncruiseMissileAttackArgs, 'id' | 'subgraphError'>>;
  cruiseMissileAttacks?: SubscriptionResolver<Array<ResolversTypes['CruiseMissileAttack']>, "cruiseMissileAttacks", ParentType, ContextType, RequireFields<SubscriptioncruiseMissileAttacksArgs, 'skip' | 'first' | 'subgraphError'>>;
  nukeAttack?: SubscriptionResolver<Maybe<ResolversTypes['NukeAttack']>, "nukeAttack", ParentType, ContextType, RequireFields<SubscriptionnukeAttackArgs, 'id' | 'subgraphError'>>;
  nukeAttacks?: SubscriptionResolver<Array<ResolversTypes['NukeAttack']>, "nukeAttacks", ParentType, ContextType, RequireFields<SubscriptionnukeAttacksArgs, 'skip' | 'first' | 'subgraphError'>>;
  spyOperation?: SubscriptionResolver<Maybe<ResolversTypes['SpyOperation']>, "spyOperation", ParentType, ContextType, RequireFields<SubscriptionspyOperationArgs, 'id' | 'subgraphError'>>;
  spyOperations?: SubscriptionResolver<Array<ResolversTypes['SpyOperation']>, "spyOperations", ParentType, ContextType, RequireFields<SubscriptionspyOperationsArgs, 'skip' | 'first' | 'subgraphError'>>;
  airBattle?: SubscriptionResolver<Maybe<ResolversTypes['AirBattle']>, "airBattle", ParentType, ContextType, RequireFields<SubscriptionairBattleArgs, 'id' | 'subgraphError'>>;
  airBattles?: SubscriptionResolver<Array<ResolversTypes['AirBattle']>, "airBattles", ParentType, ContextType, RequireFields<SubscriptionairBattlesArgs, 'skip' | 'first' | 'subgraphError'>>;
  navalAttack?: SubscriptionResolver<Maybe<ResolversTypes['NavalAttack']>, "navalAttack", ParentType, ContextType, RequireFields<SubscriptionnavalAttackArgs, 'id' | 'subgraphError'>>;
  navalAttacks?: SubscriptionResolver<Array<ResolversTypes['NavalAttack']>, "navalAttacks", ParentType, ContextType, RequireFields<SubscriptionnavalAttacksArgs, 'skip' | 'first' | 'subgraphError'>>;
  breakBlockade?: SubscriptionResolver<Maybe<ResolversTypes['BreakBlockade']>, "breakBlockade", ParentType, ContextType, RequireFields<SubscriptionbreakBlockadeArgs, 'id' | 'subgraphError'>>;
  breakBlockades?: SubscriptionResolver<Array<ResolversTypes['BreakBlockade']>, "breakBlockades", ParentType, ContextType, RequireFields<SubscriptionbreakBlockadesArgs, 'skip' | 'first' | 'subgraphError'>>;
  blockade?: SubscriptionResolver<Maybe<ResolversTypes['Blockade']>, "blockade", ParentType, ContextType, RequireFields<SubscriptionblockadeArgs, 'id' | 'subgraphError'>>;
  blockades?: SubscriptionResolver<Array<ResolversTypes['Blockade']>, "blockades", ParentType, ContextType, RequireFields<SubscriptionblockadesArgs, 'skip' | 'first' | 'subgraphError'>>;
  message?: SubscriptionResolver<Maybe<ResolversTypes['Message']>, "message", ParentType, ContextType, RequireFields<SubscriptionmessageArgs, 'id' | 'subgraphError'>>;
  messages?: SubscriptionResolver<Array<ResolversTypes['Message']>, "messages", ParentType, ContextType, RequireFields<SubscriptionmessagesArgs, 'skip' | 'first' | 'subgraphError'>>;
  post?: SubscriptionResolver<Maybe<ResolversTypes['Post']>, "post", ParentType, ContextType, RequireFields<SubscriptionpostArgs, 'id' | 'subgraphError'>>;
  posts?: SubscriptionResolver<Array<ResolversTypes['Post']>, "posts", ParentType, ContextType, RequireFields<SubscriptionpostsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;

export type WarResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['War'] = ResolversParentTypes['War']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  warId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  offenseId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  defenseId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  AirBattle?: AirBattleResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Blockade?: BlockadeResolvers<ContextType>;
  BreakBlockade?: BreakBlockadeResolvers<ContextType>;
  Bytes?: GraphQLScalarType;
  CruiseMissileAttack?: CruiseMissileAttackResolvers<ContextType>;
  GroundBattle?: GroundBattleResolvers<ContextType>;
  Int8?: GraphQLScalarType;
  Message?: MessageResolvers<ContextType>;
  Nation?: NationResolvers<ContextType>;
  NavalAttack?: NavalAttackResolvers<ContextType>;
  NukeAttack?: NukeAttackResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SpyOperation?: SpyOperationResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  War?: WarResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = YourContractTypes.Context & BaseMeshContext;


import { fileURLToPath } from '@graphql-mesh/utils';
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclient/sources/YourContract/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("GraphClient");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const yourContractTransforms = [];
const additionalTypeDefs = [] as any[];
const yourContractHandler = new GraphqlHandler({
              name: "YourContract",
              config: {"endpoint":"http://localhost:8000/subgraphs/name/scaffold-eth/your-contract"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("YourContract"),
              logger: logger.child("YourContract"),
              importFn,
            });
sources[0] = {
          name: 'YourContract',
          handler: yourContractHandler,
          transforms: yourContractTransforms
        }
const additionalResolvers = [] as any[]
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })
const documentHashMap = {
        "f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b": GetNationsDocument,
"f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b": GetWarsDocument,
"f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b": GetGroundBattlesDocument,
"f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b": GetCruiseMissileAttacksDocument,
"f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b": GetNukeAttacksDocument,
"f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b": GetSpyOperationsDocument,
"f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b": GetAirBattlesDocument,
"f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b": GetNavalAttacksDocument,
"f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b": GetBreakBlockadesDocument,
"f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b": GetBlockadesDocument,
"f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b": GetPostsDocument,
"f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b": GetRecievedMessagesDocument,
"f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b": GetSentMessagesDocument
      }
additionalEnvelopPlugins.push(usePersistedOperations({
        getPersistedOperation(key) {
          return documentHashMap[key];
        },
        ...{}
      }))

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      {
        document: GetNationsDocument,
        get rawSDL() {
          return printWithCache(GetNationsDocument);
        },
        location: 'GetNationsDocument.graphql',
        sha256Hash: 'f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b'
      },{
        document: GetWarsDocument,
        get rawSDL() {
          return printWithCache(GetWarsDocument);
        },
        location: 'GetWarsDocument.graphql',
        sha256Hash: 'f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b'
      },{
        document: GetGroundBattlesDocument,
        get rawSDL() {
          return printWithCache(GetGroundBattlesDocument);
        },
        location: 'GetGroundBattlesDocument.graphql',
        sha256Hash: 'f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b'
      },{
        document: GetCruiseMissileAttacksDocument,
        get rawSDL() {
          return printWithCache(GetCruiseMissileAttacksDocument);
        },
        location: 'GetCruiseMissileAttacksDocument.graphql',
        sha256Hash: 'f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b'
      },{
        document: GetNukeAttacksDocument,
        get rawSDL() {
          return printWithCache(GetNukeAttacksDocument);
        },
        location: 'GetNukeAttacksDocument.graphql',
        sha256Hash: 'f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b'
      },{
        document: GetSpyOperationsDocument,
        get rawSDL() {
          return printWithCache(GetSpyOperationsDocument);
        },
        location: 'GetSpyOperationsDocument.graphql',
        sha256Hash: 'f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b'
      },{
        document: GetAirBattlesDocument,
        get rawSDL() {
          return printWithCache(GetAirBattlesDocument);
        },
        location: 'GetAirBattlesDocument.graphql',
        sha256Hash: 'f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b'
      },{
        document: GetNavalAttacksDocument,
        get rawSDL() {
          return printWithCache(GetNavalAttacksDocument);
        },
        location: 'GetNavalAttacksDocument.graphql',
        sha256Hash: 'f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b'
      },{
        document: GetBreakBlockadesDocument,
        get rawSDL() {
          return printWithCache(GetBreakBlockadesDocument);
        },
        location: 'GetBreakBlockadesDocument.graphql',
        sha256Hash: 'f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b'
      },{
        document: GetBlockadesDocument,
        get rawSDL() {
          return printWithCache(GetBlockadesDocument);
        },
        location: 'GetBlockadesDocument.graphql',
        sha256Hash: 'f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b'
      },{
        document: GetPostsDocument,
        get rawSDL() {
          return printWithCache(GetPostsDocument);
        },
        location: 'GetPostsDocument.graphql',
        sha256Hash: 'f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b'
      },{
        document: GetRecievedMessagesDocument,
        get rawSDL() {
          return printWithCache(GetRecievedMessagesDocument);
        },
        location: 'GetRecievedMessagesDocument.graphql',
        sha256Hash: 'f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b'
      },{
        document: GetSentMessagesDocument,
        get rawSDL() {
          return printWithCache(GetSentMessagesDocument);
        },
        location: 'GetSentMessagesDocument.graphql',
        sha256Hash: 'f41e429b2182cfd049debdb1718a96ede30754a5bf23b21dfc53770e881eea8b'
      }
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export const pollingInterval = null;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    if (pollingInterval) {
      setInterval(() => {
        getMeshOptions()
        .then(meshOptions => getMesh(meshOptions))
        .then(newMesh =>
          meshInstance$.then(oldMesh => {
            oldMesh.destroy()
            meshInstance$ = Promise.resolve(newMesh)
          })
        ).catch(err => {
          console.error("Mesh polling failed so the existing version will be used:", err);
        });
      }, pollingInterval)
    }
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
  return getSdk<TOperationContext, TGlobalContext>((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
export type GetNationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNationsQuery = { nations: Array<Pick<Nation, 'nationId' | 'name' | 'ruler' | 'owner' | 'createdAt'>> };

export type GetWarsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetWarsQuery = { wars: Array<Pick<War, 'id' | 'warId' | 'offenseId' | 'defenseId' | 'transactionHash'>> };

export type GetGroundBattlesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGroundBattlesQuery = { groundBattles: Array<Pick<GroundBattle, 'id' | 'groundBattleId' | 'warId' | 'attackerId' | 'attackerSoldierLosses' | 'attackerTankLosses' | 'defenderId' | 'defenderSoldierLosses' | 'defenderTankLosses' | 'transactionHash'>> };

export type GetCruiseMissileAttacksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCruiseMissileAttacksQuery = { cruiseMissileAttacks: Array<Pick<CruiseMissileAttack, 'id' | 'attackId' | 'attackerId' | 'defenderId' | 'landed' | 'warId' | 'damageTypeNumber' | 'transactionHash'>> };

export type GetNukeAttacksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNukeAttacksQuery = { nukeAttacks: Array<Pick<NukeAttack, 'id' | 'attackId' | 'attackerId' | 'defenderId' | 'landed' | 'warId' | 'transactionHash'>> };

export type GetSpyOperationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpyOperationsQuery = { spyOperations: Array<Pick<SpyOperation, 'id' | 'attackId' | 'attackerId' | 'defenderId' | 'success' | 'attackType' | 'transactionHash'>> };

export type GetAirBattlesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAirBattlesQuery = { airBattles: Array<Pick<AirBattle, 'id' | 'battleId' | 'attackerId' | 'defenderId' | 'attackerFighterLosses' | 'attackerBomberLosses' | 'defenderFighterLosses' | 'infrastructureDamage' | 'tankDamage' | 'cruiseMissileDamage'>> };

export type GetNavalAttacksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNavalAttacksQuery = { navalAttacks: Array<Pick<NavalAttack, 'attackerLosses' | 'defenderLosses' | 'attackId'>> };

export type GetBreakBlockadesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBreakBlockadesQuery = { breakBlockades: Array<Pick<BreakBlockade, 'attackerLosses' | 'defenderLosses' | 'battleId'>> };

export type GetBlockadesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBlockadesQuery = { blockades: Array<Pick<Blockade, 'battleId' | 'attackerLosses' | 'defenderLosses'>> };

export type GetPostsQueryVariables = Exact<{
  sender: Scalars['Bytes']['input'];
}>;


export type GetPostsQuery = { posts: Array<Pick<Post, 'id' | 'sender' | 'post' | 'createdAt' | 'transactionHash'>> };

export type GetRecievedMessagesQueryVariables = Exact<{
  reciever: Scalars['Bytes']['input'];
}>;


export type GetRecievedMessagesQuery = { messages: Array<Pick<Message, 'id' | 'sender' | 'reciever' | 'message' | 'createdAt' | 'transactionHash'>> };

export type GetSentMessagesQueryVariables = Exact<{
  sender: Scalars['Bytes']['input'];
}>;


export type GetSentMessagesQuery = { messages: Array<Pick<Message, 'id' | 'sender' | 'reciever' | 'message' | 'createdAt' | 'transactionHash'>> };


export const GetNationsDocument = gql`
    query GetNations {
  nations(first: 5, orderBy: createdAt, orderDirection: desc) {
    nationId
    name
    ruler
    owner
    createdAt
  }
}
    ` as unknown as DocumentNode<GetNationsQuery, GetNationsQueryVariables>;
export const GetWarsDocument = gql`
    query GetWars {
  wars {
    id
    warId
    offenseId
    defenseId
    transactionHash
  }
}
    ` as unknown as DocumentNode<GetWarsQuery, GetWarsQueryVariables>;
export const GetGroundBattlesDocument = gql`
    query GetGroundBattles {
  groundBattles {
    id
    groundBattleId
    warId
    attackerId
    attackerSoldierLosses
    attackerTankLosses
    defenderId
    defenderSoldierLosses
    defenderTankLosses
    transactionHash
  }
}
    ` as unknown as DocumentNode<GetGroundBattlesQuery, GetGroundBattlesQueryVariables>;
export const GetCruiseMissileAttacksDocument = gql`
    query GetCruiseMissileAttacks {
  cruiseMissileAttacks {
    id
    attackId
    attackerId
    defenderId
    landed
    warId
    damageTypeNumber
    transactionHash
  }
}
    ` as unknown as DocumentNode<GetCruiseMissileAttacksQuery, GetCruiseMissileAttacksQueryVariables>;
export const GetNukeAttacksDocument = gql`
    query GetNukeAttacks {
  nukeAttacks {
    id
    attackId
    attackerId
    defenderId
    landed
    warId
    transactionHash
  }
}
    ` as unknown as DocumentNode<GetNukeAttacksQuery, GetNukeAttacksQueryVariables>;
export const GetSpyOperationsDocument = gql`
    query GetSpyOperations {
  spyOperations {
    id
    attackId
    attackerId
    defenderId
    success
    attackType
    transactionHash
  }
}
    ` as unknown as DocumentNode<GetSpyOperationsQuery, GetSpyOperationsQueryVariables>;
export const GetAirBattlesDocument = gql`
    query GetAirBattles {
  airBattles {
    id
    battleId
    attackerId
    defenderId
    attackerFighterLosses
    attackerBomberLosses
    defenderFighterLosses
    infrastructureDamage
    tankDamage
    cruiseMissileDamage
  }
}
    ` as unknown as DocumentNode<GetAirBattlesQuery, GetAirBattlesQueryVariables>;
export const GetNavalAttacksDocument = gql`
    query GetNavalAttacks {
  navalAttacks {
    attackerLosses
    defenderLosses
    attackId
  }
}
    ` as unknown as DocumentNode<GetNavalAttacksQuery, GetNavalAttacksQueryVariables>;
export const GetBreakBlockadesDocument = gql`
    query GetBreakBlockades {
  breakBlockades {
    attackerLosses
    defenderLosses
    battleId
  }
}
    ` as unknown as DocumentNode<GetBreakBlockadesQuery, GetBreakBlockadesQueryVariables>;
export const GetBlockadesDocument = gql`
    query GetBlockades {
  blockades {
    battleId
    attackerLosses
    defenderLosses
  }
}
    ` as unknown as DocumentNode<GetBlockadesQuery, GetBlockadesQueryVariables>;
export const GetPostsDocument = gql`
    query GetPosts($sender: Bytes!) {
  posts(where: {sender: $sender}) {
    id
    sender
    post
    createdAt
    transactionHash
  }
}
    ` as unknown as DocumentNode<GetPostsQuery, GetPostsQueryVariables>;
export const GetRecievedMessagesDocument = gql`
    query GetRecievedMessages($reciever: Bytes!) {
  messages(where: {reciever: $reciever}) {
    id
    sender
    reciever
    message
    createdAt
    transactionHash
  }
}
    ` as unknown as DocumentNode<GetRecievedMessagesQuery, GetRecievedMessagesQueryVariables>;
export const GetSentMessagesDocument = gql`
    query GetSentMessages($sender: Bytes!) {
  messages(where: {sender: $sender}) {
    id
    sender
    reciever
    message
    createdAt
    transactionHash
  }
}
    ` as unknown as DocumentNode<GetSentMessagesQuery, GetSentMessagesQueryVariables>;














export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    GetNations(variables?: GetNationsQueryVariables, options?: C): Promise<GetNationsQuery> {
      return requester<GetNationsQuery, GetNationsQueryVariables>(GetNationsDocument, variables, options) as Promise<GetNationsQuery>;
    },
    GetWars(variables?: GetWarsQueryVariables, options?: C): Promise<GetWarsQuery> {
      return requester<GetWarsQuery, GetWarsQueryVariables>(GetWarsDocument, variables, options) as Promise<GetWarsQuery>;
    },
    GetGroundBattles(variables?: GetGroundBattlesQueryVariables, options?: C): Promise<GetGroundBattlesQuery> {
      return requester<GetGroundBattlesQuery, GetGroundBattlesQueryVariables>(GetGroundBattlesDocument, variables, options) as Promise<GetGroundBattlesQuery>;
    },
    GetCruiseMissileAttacks(variables?: GetCruiseMissileAttacksQueryVariables, options?: C): Promise<GetCruiseMissileAttacksQuery> {
      return requester<GetCruiseMissileAttacksQuery, GetCruiseMissileAttacksQueryVariables>(GetCruiseMissileAttacksDocument, variables, options) as Promise<GetCruiseMissileAttacksQuery>;
    },
    GetNukeAttacks(variables?: GetNukeAttacksQueryVariables, options?: C): Promise<GetNukeAttacksQuery> {
      return requester<GetNukeAttacksQuery, GetNukeAttacksQueryVariables>(GetNukeAttacksDocument, variables, options) as Promise<GetNukeAttacksQuery>;
    },
    GetSpyOperations(variables?: GetSpyOperationsQueryVariables, options?: C): Promise<GetSpyOperationsQuery> {
      return requester<GetSpyOperationsQuery, GetSpyOperationsQueryVariables>(GetSpyOperationsDocument, variables, options) as Promise<GetSpyOperationsQuery>;
    },
    GetAirBattles(variables?: GetAirBattlesQueryVariables, options?: C): Promise<GetAirBattlesQuery> {
      return requester<GetAirBattlesQuery, GetAirBattlesQueryVariables>(GetAirBattlesDocument, variables, options) as Promise<GetAirBattlesQuery>;
    },
    GetNavalAttacks(variables?: GetNavalAttacksQueryVariables, options?: C): Promise<GetNavalAttacksQuery> {
      return requester<GetNavalAttacksQuery, GetNavalAttacksQueryVariables>(GetNavalAttacksDocument, variables, options) as Promise<GetNavalAttacksQuery>;
    },
    GetBreakBlockades(variables?: GetBreakBlockadesQueryVariables, options?: C): Promise<GetBreakBlockadesQuery> {
      return requester<GetBreakBlockadesQuery, GetBreakBlockadesQueryVariables>(GetBreakBlockadesDocument, variables, options) as Promise<GetBreakBlockadesQuery>;
    },
    GetBlockades(variables?: GetBlockadesQueryVariables, options?: C): Promise<GetBlockadesQuery> {
      return requester<GetBlockadesQuery, GetBlockadesQueryVariables>(GetBlockadesDocument, variables, options) as Promise<GetBlockadesQuery>;
    },
    GetPosts(variables: GetPostsQueryVariables, options?: C): Promise<GetPostsQuery> {
      return requester<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, variables, options) as Promise<GetPostsQuery>;
    },
    GetRecievedMessages(variables: GetRecievedMessagesQueryVariables, options?: C): Promise<GetRecievedMessagesQuery> {
      return requester<GetRecievedMessagesQuery, GetRecievedMessagesQueryVariables>(GetRecievedMessagesDocument, variables, options) as Promise<GetRecievedMessagesQuery>;
    },
    GetSentMessages(variables: GetSentMessagesQueryVariables, options?: C): Promise<GetSentMessagesQuery> {
      return requester<GetSentMessagesQuery, GetSentMessagesQueryVariables>(GetSentMessagesDocument, variables, options) as Promise<GetSentMessagesQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;