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

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

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

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Query = {
  nation?: Maybe<Nation>;
  nations: Array<Nation>;
  war?: Maybe<War>;
  wars: Array<War>;
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


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  nation?: Maybe<Nation>;
  nations: Array<Nation>;
  war?: Maybe<War>;
  wars: Array<War>;
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
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["YourContract"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
