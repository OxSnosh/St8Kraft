# Solidity API

## AidContract

### countryMinter

```solidity
address countryMinter
```

### treasury

```solidity
address treasury
```

### forces

```solidity
address forces
```

### keeper

```solidity
address keeper
```

### infrastructure

```solidity
address infrastructure
```

### wonder1

```solidity
address wonder1
```

### aidProposalId

```solidity
uint256 aidProposalId
```

### proposalExpiration

```solidity
uint256 proposalExpiration
```

### settings

```solidity
function settings(address _countryMinter, address _treasury, address _forces, address _infrastructure, address _keeper, address _wonder1) public
```

_this function is callable by the owner only
this function will be called after deployment to initiate contract pointers within this contract_

### mint

```solidity
contract CountryMinter mint
```

### won1

```solidity
contract WondersContract1 won1
```

### Proposal

```solidity
struct Proposal {
  uint256 proposalId;
  uint256 timeProposed;
  uint256 idSender;
  uint256 idRecipient;
  uint256 techAid;
  uint256 balanceAid;
  uint256 soldierAid;
  bool accepted;
  bool cancelled;
}
```

### idToOwnerAid

```solidity
mapping(uint256 => address) idToOwnerAid
```

### idToAidSlots

```solidity
mapping(uint256 => uint256) idToAidSlots
```

### idToProposal

```solidity
mapping(uint256 => struct AidContract.Proposal) idToProposal
```

### updateCountryMinterAddress

```solidity
function updateCountryMinterAddress(address _newAddress) public
```

_this function is only callable from the owner_

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _newAddress) public
```

_this function is only callable from the owner_

### updateForcesAddress

```solidity
function updateForcesAddress(address _newAddress) public
```

_this function is only callable from the owner_

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address _newAddress) public
```

_this function is only callable from the owner_

### updateKeeperAddress

```solidity
function updateKeeperAddress(address _newAddress) public
```

_this function is only callable from the owner_

### updateWonderContract1Address

```solidity
function updateWonderContract1Address(address _newAddress) public
```

_this function is only callable from the owner_

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### initiateAid

```solidity
function initiateAid(uint256 id, address nationOwner) external
```

_this function gets called by the country minter contract once the country gets minted_

### proposeAid

```solidity
function proposeAid(uint256 idSender, uint256 idRecipient, uint256 techAid, uint256 balanceAid, uint256 soldiersAid) public
```

the max aid is 100 Tech, 6,000,000 balance and 4,000 soldiers without a Federal Aid Commission
the max aid is 150 Tech, 9,000,000 balance and 6,000 soldiers with a Federal Aid Commission

_this is the function a nations owner will call to initiate an aid proposal_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| idSender | uint256 | is the country ID of the aid sender (caller of the function) |
| idRecipient | uint256 | is the country ID of the aid recipient |
| techAid | uint256 | is the amount of Technology being sent in the proposal |
| balanceAid | uint256 | is the amount of balance being sent in the proposal |
| soldiersAid | uint256 | is the amount of troops beind sent in the proposal |

### checkAidSlots

```solidity
function checkAidSlots(uint256 idSender) public view returns (bool)
```

nations can only send one aid proposal per day without a Disaster Relief Agency
nations can send 2 aid porposals per day with a disaster relief agency

_this function is public but called by the proposeAid() function to check the availabiliy of proposing aid_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| idSender | uint256 | id the nation ID of the nation proposing aid |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool returns a boolean value if there is an aid slot available for the prpoposal |

### checkAvailability

```solidity
function checkAvailability(uint256 idSender, uint256 techAid, uint256 balanceAid, uint256 soldiersAid) public view returns (bool)
```

this function checks that the aid proposed is less than the available aid of the sender nation

_this function is public but also callable by the proposeAid() and acceptProposal() function_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| idSender | uint256 | is the nation ID of the nations proposing aid |
| techAid | uint256 | is the amount of Tech in the aid proposal |
| balanceAid | uint256 | is the amount of Balance in the aid proposal |
| soldiersAid | uint256 | is the amount of soldiers in the aid proposal |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool true if the sender has enough of each aid parameter to send |

### getMaxAidSlots

```solidity
function getMaxAidSlots(uint256 id) public view returns (uint256)
```

this function checks max aid slots per day for a nation
max aid slots allow you to propose 1 aid per day (2 proposals with a didadter relief agency)

_this function is public but also callable from the proposeAid() function_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | id the nation ID of the nation proposing aid |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 defaults to 1 aid slot per day and 2 with a disaster relief agency |

### getFederalAidEligability

```solidity
function getFederalAidEligability(uint256 idSender, uint256 idRecipient) public view returns (bool)
```

if both nations have a federal aid commission then max aid amounts increase 50%

_this function is a public view function that is called by the proposeAid() function_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| idSender | uint256 | is the nation ID of the sender of the aid proposal |
| idRecipient | uint256 | id the nation ID of the recipient of the aid proposal |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool true if both sender and reciever have a federal aid commission |

### setProposalExpiration

```solidity
function setProposalExpiration(uint256 newExpiration) public
```

_this finction is only callable by the owner of the contract
this function allows the contract owner to set how long aid proposals stay active for_

### getProposalExpiration

```solidity
function getProposalExpiration() public view returns (uint256)
```

_this is a view function that allows anyone to view the duration aid proposals have untile they expire_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 the number of days a proposal has to be exepted otherwise it expires |

### proposalExpired

```solidity
function proposalExpired(uint256 proposalId) public view returns (bool)
```

this function will prevent an aid proposal from being fulfilled if the proposal is passed the expiration duration

_this function is a public view function that checks to see if an aid propoals is expired (too much time has elapsed since proposal)_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| proposalId | uint256 | id the ID of the aid proposal |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool true if amount of time elapsed since proposal is greater than the proposal expiration time |

### acceptProposal

```solidity
function acceptProposal(uint256 proposalId) public
```

this function is called by the recipient of an aid proposal in order to accept the aid

_this is a public function that is callable by the recipient of the aid proposal_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| proposalId | uint256 | this id the ID of the aid proposal |

### cancelAid

```solidity
function cancelAid(uint256 proposalId) public
```

this function allows the aid sender or recipient to cancel an aid proposal prior to it being accepted

_this function is a public function that allows the aid proposal to be cancelled by the sender of the proposal_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| proposalId | uint256 | this is the id of the proposal |

### onlyKeeper

```solidity
modifier onlyKeeper()
```

### resetAidProposals

```solidity
function resetAidProposals() public
```

_this function is callable by the keeper contract only
this finction is called daily to reset every nations aid proposals for that day to 0_

### getProposal

```solidity
function getProposal(uint256 proposalId) public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

_this is public view function that allows a caller to return the items in a proposal struct_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this funtion returns the contects of a proposal struct |
| [1] | uint256 |  |
| [2] | uint256 |  |
| [3] | uint256 |  |
| [4] | uint256 |  |
| [5] | uint256 |  |
| [6] | uint256 |  |

### checkCancelledOrAccepted

```solidity
function checkCancelledOrAccepted(uint256 proposalId) public view returns (bool, bool)
```

_this function is a public view function that allows the caller to see if an aid proposal is cancelled or accepted already_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool true if the proposal has cancelled or accepted |
| [1] | bool |  |

## AirBattleContract

_this contract allows you to launch a bombing campaign against another nation_

### airBattleId

```solidity
uint256 airBattleId
```

### warAddress

```solidity
address warAddress
```

### fighterAddress

```solidity
address fighterAddress
```

### bomberAddress

```solidity
address bomberAddress
```

### infrastructure

```solidity
address infrastructure
```

### forces

```solidity
address forces
```

### missiles

```solidity
address missiles
```

### wonders1

```solidity
address wonders1
```

### fighterLosses

```solidity
address fighterLosses
```

### countryMinter

```solidity
address countryMinter
```

### yak9Strength

```solidity
uint256 yak9Strength
```

### p51MustangStrength

```solidity
uint256 p51MustangStrength
```

### f86SabreStrength

```solidity
uint256 f86SabreStrength
```

### mig15Strength

```solidity
uint256 mig15Strength
```

### f100SuperSabreStrength

```solidity
uint256 f100SuperSabreStrength
```

### f35LightningStrength

```solidity
uint256 f35LightningStrength
```

### f15EagleStrength

```solidity
uint256 f15EagleStrength
```

### su30MkiStrength

```solidity
uint256 su30MkiStrength
```

### f22RaptorStrength

```solidity
uint256 f22RaptorStrength
```

### ah1CobraStrength

```solidity
uint256 ah1CobraStrength
```

### ah64ApacheStrength

```solidity
uint256 ah64ApacheStrength
```

### bristolBlenheimStrength

```solidity
uint256 bristolBlenheimStrength
```

### b52MitchellStrength

```solidity
uint256 b52MitchellStrength
```

### b17gFlyingFortressStrength

```solidity
uint256 b17gFlyingFortressStrength
```

### b52StratofortressStrength

```solidity
uint256 b52StratofortressStrength
```

### b2SpiritStrength

```solidity
uint256 b2SpiritStrength
```

### b1bLancerStrength

```solidity
uint256 b1bLancerStrength
```

### tupolevTu160Strength

```solidity
uint256 tupolevTu160Strength
```

### war

```solidity
contract WarContract war
```

### fighter

```solidity
contract FightersContract fighter
```

### bomber

```solidity
contract BombersContract bomber
```

### inf

```solidity
contract InfrastructureContract inf
```

### force

```solidity
contract ForcesContract force
```

### mis

```solidity
contract MissilesContract mis
```

### won1

```solidity
contract WondersContract1 won1
```

### fighterLoss

```solidity
contract FighterLosses fighterLoss
```

### mint

```solidity
contract CountryMinter mint
```

### FightersToBattle

```solidity
struct FightersToBattle {
  uint256 yak9Count;
  uint256 p51MustangCount;
  uint256 f86SabreCount;
  uint256 mig15Count;
  uint256 f100SuperSabreCount;
  uint256 f35LightningCount;
  uint256 f15EagleCount;
  uint256 su30MkiCount;
  uint256 f22RaptorCount;
  uint256 fighterStrength;
  uint256 bomberStrength;
  uint256 countryId;
  uint256 warId;
}
```

### airBattleIdToAttackerFighters

```solidity
mapping(uint256 => struct AirBattleContract.FightersToBattle) airBattleIdToAttackerFighters
```

### airBattleIdToAttackerFighterChanceArray

```solidity
mapping(uint256 => uint256[]) airBattleIdToAttackerFighterChanceArray
```

### airBattleIdToAttackerFighterTypeArray

```solidity
mapping(uint256 => uint256[]) airBattleIdToAttackerFighterTypeArray
```

### airBattleIdToAttackerFighterLosses

```solidity
mapping(uint256 => uint256[]) airBattleIdToAttackerFighterLosses
```

### airBattleIdToAttackerFighterCumulativeOdds

```solidity
mapping(uint256 => uint256) airBattleIdToAttackerFighterCumulativeOdds
```

### airBattleIdToDefenderFighters

```solidity
mapping(uint256 => struct AirBattleContract.FightersToBattle) airBattleIdToDefenderFighters
```

### airBattleIdToDefenderFighterChanceArray

```solidity
mapping(uint256 => uint256[]) airBattleIdToDefenderFighterChanceArray
```

### airBattleIdToDefenderFighterTypeArray

```solidity
mapping(uint256 => uint256[]) airBattleIdToDefenderFighterTypeArray
```

### airBattleIdToDefenderFighterLosses

```solidity
mapping(uint256 => uint256[]) airBattleIdToDefenderFighterLosses
```

### airBattleIdToDefenderFighterCumulativeOdds

```solidity
mapping(uint256 => uint256) airBattleIdToDefenderFighterCumulativeOdds
```

### s_requestIdToRequestIndex

```solidity
mapping(uint256 => uint256) s_requestIdToRequestIndex
```

### s_requestIndexToRandomWords

```solidity
mapping(uint256 => uint256[]) s_requestIndexToRandomWords
```

### constructor

```solidity
constructor(address vrfCoordinatorV2, uint64 subscriptionId, bytes32 gasLane, uint32 callbackGasLimit) public
```

_this is the constructor funtion for the contact_

### settings

```solidity
function settings(address _warAddress, address _fighter, address _bomber, address _infrastructure, address _forces, address _fighterLosses) public
```

_this function is only callable by the owner
this function will be called right after deployment in order to set up contract pointers_

### updateWarAddress

```solidity
function updateWarAddress(address newAddress) public
```

_this function is only callable by the owner of the contract_

### updateFighterAddress

```solidity
function updateFighterAddress(address newAddress) public
```

_this function is only callable by the owner of the contract_

### updateBomberAddress

```solidity
function updateBomberAddress(address newAddress) public
```

_this function is only callable by the owner of the contract_

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address newAddress) public
```

_this function is only callable by the owner of the contract_

### updateForcesAddress

```solidity
function updateForcesAddress(address newAddress) public
```

_this function is only callable by the owner of the contract_

### updateFighterLossesAddress

```solidity
function updateFighterLossesAddress(address newAddress) public
```

_this function is only callable by the owner of the contract_

### updateMissilesAddress

```solidity
function updateMissilesAddress(address newAddress) public
```

_this function is only callable by the owner of the contract_

### updateWonders1Address

```solidity
function updateWonders1Address(address newAddress) public
```

_this function is only callable by the owner of the contract_

### airBattle

```solidity
function airBattle(uint256 warId, uint256 attackerId, uint256 defenderId) public
```

this function allows one nation to launch a bombing campaign against another nation
can only be called if a war is active between the two nations

_this function is a public function_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| warId | uint256 | is the ID of the current war between the two nations |
| attackerId | uint256 | is the nation ID of the attacker nation |
| defenderId | uint256 | is the nation ID of the defending nation |

### generateAttackerFighterStruct

```solidity
function generateAttackerFighterStruct(uint256 warId, uint256 battleId, uint256 attackerId) internal
```

### generateDefenderFighterStruct

```solidity
function generateDefenderFighterStruct(uint256 warId, uint256 battleId, uint256 defenderId) internal
```

### generateAttackerFighterChanceArray

```solidity
function generateAttackerFighterChanceArray(uint256 battleId) internal
```

### generateDefenderFighterChanceArray

```solidity
function generateDefenderFighterChanceArray(uint256 battleId) internal
```

### setAttackerFighterStrength

```solidity
function setAttackerFighterStrength(uint256 battleId) internal
```

### setDefenderFighterStrength

```solidity
function setDefenderFighterStrength(uint256 battleId) internal
```

### fulfillRequest

```solidity
function fulfillRequest(uint256 battleId) public
```

### fulfillRandomWords

```solidity
function fulfillRandomWords(uint256 requestId, uint256[] randomWords) internal
```

fulfillRandomness handles the VRF response. Your contract must
implement it. See "SECURITY CONSIDERATIONS" above for important
principles to keep in mind when implementing your fulfillRandomness
method.

_VRFConsumerBaseV2 expects its subcontracts to have a method with this
signature, and will call it once it has verified the proof
associated with the randomness. (It is triggered via a call to
rawFulfillRandomness, below.)_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | The Id initially returned by requestRandomness |
| randomWords | uint256[] | the VRF output expanded to the requested number of words |

### getLosses

```solidity
function getLosses(uint256 battleId, uint256 numberBetweenZeroAndFive) public view returns (uint256)
```

### getAttackingFighterCount

```solidity
function getAttackingFighterCount(uint256 battleId) internal view returns (uint256)
```

### getAdditionalAttackerFighterCount

```solidity
function getAdditionalAttackerFighterCount(uint256 battleId) internal view returns (uint256)
```

### getDefendingFighterCount

```solidity
function getDefendingFighterCount(uint256 battleId) internal view returns (uint256)
```

### getAdditionalDefendingFighterCount

```solidity
function getAdditionalDefendingFighterCount(uint256 battleId) internal view returns (uint256)
```

### dogfight

```solidity
function dogfight(uint256 battleId, uint256 index) internal
```

### generateLossForDefender

```solidity
function generateLossForDefender(uint256 battleId, uint256 randomNumberForLossSelection) internal
```

### generateLossForAttacker

```solidity
function generateLossForAttacker(uint256 battleId, uint256 randomNumberForLossSelection) internal
```

### getAmountToDecrease

```solidity
function getAmountToDecrease(uint256 fighterType) internal pure returns (uint256)
```

### runBombingCampaign

```solidity
function runBombingCampaign(uint256 attackerId, uint256 battleId, uint256 warId) internal
```

### getAttackerBomberStrength

```solidity
function getAttackerBomberStrength(uint256 attackerId, uint256 warId) internal view returns (uint256)
```

### getAdditonalBomberStrength

```solidity
function getAdditonalBomberStrength(uint256 attackerId, uint256 warId) internal view returns (uint256)
```

## BillsContract

this contact allows a nation owner to calculate and pay the daily upkeep bills owed for the nation
source of bill payments come from infrastructure, improvements, wonders, military and missiles

### countryMinter

```solidity
address countryMinter
```

### treasury

```solidity
address treasury
```

### wonders1

```solidity
address wonders1
```

### wonders2

```solidity
address wonders2
```

### wonders3

```solidity
address wonders3
```

### wonders4

```solidity
address wonders4
```

### infrastructure

```solidity
address infrastructure
```

### forces

```solidity
address forces
```

### fighters

```solidity
address fighters
```

### navy

```solidity
address navy
```

### improvements1

```solidity
address improvements1
```

### improvements2

```solidity
address improvements2
```

### resources

```solidity
address resources
```

### missiles

```solidity
address missiles
```

### bonusResources

```solidity
address bonusResources
```

### navy2

```solidity
address navy2
```

### tsy

```solidity
contract TreasuryContract tsy
```

### won1

```solidity
contract WondersContract1 won1
```

### won2

```solidity
contract WondersContract2 won2
```

### won3

```solidity
contract WondersContract3 won3
```

### won4

```solidity
contract WondersContract4 won4
```

### inf

```solidity
contract InfrastructureContract inf
```

### frc

```solidity
contract ForcesContract frc
```

### fight

```solidity
contract FightersContract fight
```

### nav

```solidity
contract NavyContract nav
```

### imp1

```solidity
contract ImprovementsContract1 imp1
```

### imp2

```solidity
contract ImprovementsContract2 imp2
```

### res

```solidity
contract ResourcesContract res
```

### mis

```solidity
contract MissilesContract mis
```

### mint

```solidity
contract CountryMinter mint
```

### bonus

```solidity
contract BonusResourcesContract bonus
```

### nav2

```solidity
contract NavyContract2 nav2
```

### idToOwnerBills

```solidity
mapping(uint256 => address) idToOwnerBills
```

### settings

```solidity
function settings(address _countryMinter, address _treasury, address _wonders1, address _wonders2, address _wonders3, address _infrastructure, address _forces, address _fighters, address _navy, address _resources) public
```

_this function is only callable from the contact owner
this function will be called right after contract deployment to set contract pointers_

### settings2

```solidity
function settings2(address _improvements1, address _improvements2, address _missiles, address _wonders4, address _infrastructure, address _bonusResources, address _navy2) public
```

_this function is only callable from the contact owner
this function will be called right after contract deployment to set contract pointers_

### updateCountryMinter

```solidity
function updateCountryMinter(address newAddress) public
```

### updateTreasuryContract

```solidity
function updateTreasuryContract(address newAddress) public
```

### updateInfrastructureContract

```solidity
function updateInfrastructureContract(address newAddress) public
```

### updateForcesContract

```solidity
function updateForcesContract(address newAddress) public
```

### updateFightersContract

```solidity
function updateFightersContract(address newAddress) public
```

### updateNavyContract

```solidity
function updateNavyContract(address newAddress) public
```

### updateImprovementsContract1

```solidity
function updateImprovementsContract1(address newAddress) public
```

### updateImprovementsContract2

```solidity
function updateImprovementsContract2(address newAddress) public
```

### updateMissilesContract

```solidity
function updateMissilesContract(address newAddress) public
```

### updateResourcesContract

```solidity
function updateResourcesContract(address newAddress) public
```

### updateWondersContract1

```solidity
function updateWondersContract1(address newAddress) public
```

### updateWondersContract2

```solidity
function updateWondersContract2(address newAddress) public
```

### updateWondersContract3

```solidity
function updateWondersContract3(address newAddress) public
```

### updateWondersContract4

```solidity
function updateWondersContract4(address newAddress) public
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### payBills

```solidity
function payBills(uint256 id) public
```

function allows a nation owner to pay their bills
function will only work if the caller of the function is the owner of the nation ID in the id parameter

_this is public function but will only work for the nation owner who owes the bill payment_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation looking to pay bills |

### getBillsPayable

```solidity
function getBillsPayable(uint256 id) public view returns (uint256)
```

this is a public view function that will determine a nations bill payment

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation whose bill payment is being calculate |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 funtion returns the total bill payment due for nation |

### calculateDailyBillsFromInfrastructure

```solidity
function calculateDailyBillsFromInfrastructure(uint256 id) public view returns (uint256 dailyInfrastructureBills)
```

this function will calculate the daily bills due for a nation's infrastructure

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| dailyInfrastructureBills | uint256 | function will return the daily bill payment for a nation |

### calculateInfrastructureCostPerLevel

```solidity
function calculateInfrastructureCostPerLevel(uint256 id) public view returns (uint256 infrastructureBillsPerLevel)
```

this function calculated the bill payment per level for a nations infrastructure level

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the country to calculate infrastructure bill payment per level of infrastructure |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| infrastructureBillsPerLevel | uint256 | function will return the infrastructure upkeep cost per level of infrasttucture |

### calculateModifiedInfrastrucureUpkeep

```solidity
function calculateModifiedInfrastrucureUpkeep(uint256 baseDailyInfrastructureCostPerLevel, uint256 id) public view returns (uint256)
```

this function will adjust the cost per level based on resources, improvements and wonders that make infrastructure upkeep cheaper

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| baseDailyInfrastructureCostPerLevel | uint256 | this parameter will be the daily cost of infrastructure before adjustments |
| id | uint256 | is the nation ID for the nation that the bills are being calculated |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is daily cost per level for infrastructure upkeep after adjusting for resources, improvements and wonders |

### calculateDailyBillsFromMilitary

```solidity
function calculateDailyBillsFromMilitary(uint256 id) public view returns (uint256 militaryBills)
```

this function will calculate the daily bills due from military
military bills will come from soldiers, tanks, aircraft, navy, nukes and cruise missiles

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID for the bills being calculated |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| militaryBills | uint256 | this is the daily cost for military upkeep for the nation |

### getSoldierUpkeep

```solidity
function getSoldierUpkeep(uint256 id) public view returns (uint256)
```

this function calculates daily bills for soldiers

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the soldier upkeep calculation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the daily upkeep cost of soldiers for the nation |

### getTankUpkeep

```solidity
function getTankUpkeep(uint256 id) public view returns (uint256)
```

this functions calculates daily bills for tanks

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the daily tank upkeep calculation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the daily cost of tank upkeep for the nation |

### getNukeUpkeep

```solidity
function getNukeUpkeep(uint256 id) public view returns (uint256)
```

this finction calculates daily bills for a ntaions nukes

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation for the calculation of daily nuke upkeep costs |

### getCruiseMissileUpkeep

```solidity
function getCruiseMissileUpkeep(uint256 id) public view returns (uint256)
```

this function claculates daily bills for a nations cruise missiles

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the calulation for daily cruise missile upkeep costs |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the daily cruise missile upkeep cost for the nation |

### getAircraftUpkeep

```solidity
function getAircraftUpkeep(uint256 id) public view returns (uint256)
```

this function calculates daily bills for a nations aircraft

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID for the calculation of daily aircraft upkeep |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the daily upkeep cost for a nations aircraft |

### getNavyUpkeep

```solidity
function getNavyUpkeep(uint256 id) public view returns (uint256 navyUpkeep)
```

this function calculates daily bills for a nations navy

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the calulation of navy upkeep costs |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| navyUpkeep | uint256 | this is the daily cost of upkeep for a nations navy |

### getNavyUpkeepAppended

```solidity
function getNavyUpkeepAppended(uint256 id) internal view returns (uint256)
```

this function calculates additional nacy upkeep for a nation

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the nation where the additional navy upkeep is being calculated |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is additional navy upkeep costs that will be added to the daily navy upkeep costs |

### getAdjustedNavyUpkeep

```solidity
function getAdjustedNavyUpkeep(uint256 id, uint256 baseNavyUpkeep) public view returns (uint256)
```

this function will adjust a nations navy bills based on resources, improvements and wonders that reduce navy upkeep

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the countey whose navy upkeep is being calculated |
| baseNavyUpkeep | uint256 | this is the base daily cost of navy bills before adjustments |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is a nations daily navy upkeep adjusted for resources, improvements and woneers |

### calculateDailyBillsFromImprovements

```solidity
function calculateDailyBillsFromImprovements(uint256 id) public view returns (uint256 improvementBills)
```

this function calculated bills from a nations improvements

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the country for the daily improvement upkeep calculation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| improvementBills | uint256 | is the daily cost of imprvements for the nation |

### calculateWonderBillsPayable

```solidity
function calculateWonderBillsPayable(uint256 id) public view returns (uint256)
```

this function calculated bills from a nations wonders

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the calculaton of daily wonder bills |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the daily upkeep costs for wonders of the nation |

## BombersContract

this contract will store this information about each nation's bomber fleet

### countryMinter

```solidity
address countryMinter
```

### bombersMarket1

```solidity
address bombersMarket1
```

### bombersMarket2

```solidity
address bombersMarket2
```

### airBattle

```solidity
address airBattle
```

### fighters

```solidity
address fighters
```

### treasury

```solidity
address treasury
```

### infrastructure

```solidity
address infrastructure
```

### war

```solidity
address war
```

### mint

```solidity
contract CountryMinter mint
```

### DefendingBombers

```solidity
struct DefendingBombers {
  uint256 defendingAircraft;
  uint256 ah1CobraCount;
  uint256 ah64ApacheCount;
  uint256 bristolBlenheimCount;
  uint256 b52MitchellCount;
  uint256 b17gFlyingFortressCount;
  uint256 b52StratofortressCount;
  uint256 b2SpiritCount;
  uint256 b1bLancerCount;
  uint256 tupolevTu160Count;
}
```

### DeployedBombers

```solidity
struct DeployedBombers {
  uint256 deployedAircraft;
  uint256 ah1CobraCount;
  uint256 ah64ApacheCount;
  uint256 bristolBlenheimCount;
  uint256 b52MitchellCount;
  uint256 b17gFlyingFortressCount;
  uint256 b52StratofortressCount;
  uint256 b2SpiritCount;
  uint256 b1bLancerCount;
  uint256 tupolevTu160Count;
}
```

### idToDefendingBombers

```solidity
mapping(uint256 => struct BombersContract.DefendingBombers) idToDefendingBombers
```

### idToDeployedBombers

```solidity
mapping(uint256 => struct BombersContract.DeployedBombers) idToDeployedBombers
```

### settings

```solidity
function settings(address _countryMinter, address _bombersMarket1, address _bombersMarket2, address _airBattle, address _treasuryAddress, address _fightersAddress, address _infrastructure, address _war) public
```

_this function is only callable from the contact owner
this function will be called right after contract deployment to set contract pointers_

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### onlyWar

```solidity
modifier onlyWar()
```

### onlyAirBattle

```solidity
modifier onlyAirBattle()
```

### onlyMarket

```solidity
modifier onlyMarket()
```

### updateCountryMinterAddress

```solidity
function updateCountryMinterAddress(address _countryMinter) public
```

_this function is only callable from the contact owner_

### updateBombersMarketAddresses

```solidity
function updateBombersMarketAddresses(address _bombersMarket1, address _bombersMarket2) public
```

_this function is only callable from the contact owner_

### updateAirBattleAddress

```solidity
function updateAirBattleAddress(address _airBattle) public
```

_this function is only callable from the contact owner_

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _treasury) public
```

_this function is only callable from the contact owner_

### updateFightersAddress

```solidity
function updateFightersAddress(address _fighters) public
```

_this function is only callable from the contact owner_

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address _infrastructure) public
```

_this function is only callable from the contact owner_

### updateWarAddress

```solidity
function updateWarAddress(address _war) public
```

_this function is only callable from the contact owner_

### generateBombers

```solidity
function generateBombers(uint256 id) public
```

this function will initiate a nation to be bale to buy bombers when a nation is minted

_this function is only callable from the country minter contract_

### getBomberCount

```solidity
function getBomberCount(uint256 id) public view returns (uint256)
```

this function will allow the caller to see the amount of bombers a nation owns

_this function is a public view function_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation whose bomber count is being calculated |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the amount of bombers a nation currently owns |

### getDefendingAh1CobraCount

```solidity
function getDefendingAh1CobraCount(uint256 id) public view returns (uint256)
```

this function will return the amount of defending AH1 Cobra's of a nation

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending AH1 Cobra aircraft for the nation |

### increaseAh1CobraCount

```solidity
function increaseAh1CobraCount(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Bomber marketplace contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingAh1CobraCount

```solidity
function decreaseDefendingAh1CobraCount(uint256 amount, uint256 id) public
```

this function will decrease the amount of aircraft lost in a battle

_this function is only callable from the war contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapAh1Cobra

```solidity
function scrapAh1Cobra(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission Ah1Cobras

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingAh64ApacheCount

```solidity
function getDefendingAh64ApacheCount(uint256 id) public view returns (uint256)
```

this function will return the amount of defending A64Apaches a nation owns

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending A64Apache aircraft for the nation |

### increaseAh64ApacheCount

```solidity
function increaseAh64ApacheCount(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Bomber marketplace contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingAh64ApacheCount

```solidity
function decreaseDefendingAh64ApacheCount(uint256 amount, uint256 id) public
```

this function will decrease the amount of aircraft lost in a battle

_this function is only callable from the war contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapAh64Apache

```solidity
function scrapAh64Apache(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission Ah64 Apache's

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingBristolBlenheimCount

```solidity
function getDefendingBristolBlenheimCount(uint256 id) public view returns (uint256)
```

this function will return the amount of defending Bristol Blenheim's a nation owns

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending Bristol Blenheim aircraft for the nation |

### increaseBristolBlenheimCount

```solidity
function increaseBristolBlenheimCount(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Bomber marketplace contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingBristolBlenheimCount

```solidity
function decreaseDefendingBristolBlenheimCount(uint256 amount, uint256 id) public
```

this function will decrease the amount of aircraft lost in a battle

_this function is only callable from the war contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapBristolBlenheim

```solidity
function scrapBristolBlenheim(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission Bristol Blenheim's

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingB52MitchellCount

```solidity
function getDefendingB52MitchellCount(uint256 id) public view returns (uint256)
```

this function will return the amount of defending b52 Mitchell's a nation owns

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending b52 Mitchell aircraft for the nation |

### increaseB52MitchellCount

```solidity
function increaseB52MitchellCount(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Bomber marketplace contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingB52MitchellCount

```solidity
function decreaseDefendingB52MitchellCount(uint256 amount, uint256 id) public
```

this function will decrease the amount of aircraft lost in a battle

_this function is only callable from the war contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapB52Mitchell

```solidity
function scrapB52Mitchell(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission B52 Mitchell

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingB17gFlyingFortressCount

```solidity
function getDefendingB17gFlyingFortressCount(uint256 id) public view returns (uint256)
```

this function will return the amount of defending B17's a nation owns

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending B17 aircraft for the nation |

### increaseB17gFlyingFortressCount

```solidity
function increaseB17gFlyingFortressCount(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Bomber marketplace contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingB17gFlyingFortressCount

```solidity
function decreaseDefendingB17gFlyingFortressCount(uint256 amount, uint256 id) public
```

this function will decrease the amount of aircraft lost in a battle

_this function is only callable from the war contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapB17gFlyingFortress

```solidity
function scrapB17gFlyingFortress(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission B17 Flying Fortresses

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingB52StratofortressCount

```solidity
function getDefendingB52StratofortressCount(uint256 id) public view returns (uint256)
```

this function will return the amount of defending b52Stratofortresses a nation owns

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending b52Stratofortress aircraft for the nation |

### increaseB52StratofortressCount

```solidity
function increaseB52StratofortressCount(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Bomber marketplace contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingB52StratofortressCount

```solidity
function decreaseDefendingB52StratofortressCount(uint256 amount, uint256 id) public
```

this function will decrease the amount of aircraft lost in a battle

_this function is only callable from the war contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapB52Stratofortress

```solidity
function scrapB52Stratofortress(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission B52 Stratofortresses

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingB2SpiritCount

```solidity
function getDefendingB2SpiritCount(uint256 id) public view returns (uint256)
```

this function will return the amount of defending B2Spirits's a nation owns

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending B2Spirit aircraft for the nation |

### increaseB2SpiritCount

```solidity
function increaseB2SpiritCount(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Bomber marketplace contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingB2SpiritCount

```solidity
function decreaseDefendingB2SpiritCount(uint256 amount, uint256 id) public
```

this function will decrease the amount of aircraft lost in a battle

_this function is only callable from the war contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapB2Spirit

```solidity
function scrapB2Spirit(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission B2 Spirit's

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingB1bLancer

```solidity
function getDefendingB1bLancer(uint256 id) public view returns (uint256)
```

this function will return the amount of defending B1bLancer's a nation owns

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending B1bLancer aircraft for the nation |

### increaseB1bLancerCount

```solidity
function increaseB1bLancerCount(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Bomber marketplace contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingB1bLancerCount

```solidity
function decreaseDefendingB1bLancerCount(uint256 amount, uint256 id) public
```

this function will decrease the amount of aircraft lost in a battle

_this function is only callable from the war contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapB1bLancer

```solidity
function scrapB1bLancer(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission B1B Lancers

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingTupolevTu160

```solidity
function getDefendingTupolevTu160(uint256 id) public view returns (uint256)
```

this function will return the amount of defending Tu160's a nation owns

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending Tu160 aircraft for the nation |

### increaseTupolevTu160Count

```solidity
function increaseTupolevTu160Count(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Bomber marketplace contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingTupolevTu160Count

```solidity
function decreaseDefendingTupolevTu160Count(uint256 amount, uint256 id) public
```

this function will decrease the amount of aircraft lost in a battle

_this function is only callable from the war contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapTupolevTu160

```solidity
function scrapTupolevTu160(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission Tupolev TU160's

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

## BombersMarketplace1

this is the contract that will allow nation owners to purchase AH! Cobras, AH64 Apaches, Bristol Blenheims, B52 Mitchells and B17 Flying Fortresses

### countryMinter

```solidity
address countryMinter
```

### bombers1

```solidity
address bombers1
```

### fighters

```solidity
address fighters
```

### fightersMarket1

```solidity
address fightersMarket1
```

### infrastructure

```solidity
address infrastructure
```

### treasury

```solidity
address treasury
```

### ah1CobraCost

```solidity
uint256 ah1CobraCost
```

### ah1CobraRequiredInfrastructure

```solidity
uint256 ah1CobraRequiredInfrastructure
```

### ah1CobraRequiredTech

```solidity
uint256 ah1CobraRequiredTech
```

### ah64ApacheCost

```solidity
uint256 ah64ApacheCost
```

### ah64ApacheRequiredInfrastructure

```solidity
uint256 ah64ApacheRequiredInfrastructure
```

### ah64ApacheRequiredTech

```solidity
uint256 ah64ApacheRequiredTech
```

### bristolBlenheimCost

```solidity
uint256 bristolBlenheimCost
```

### bristolBlenheimRequiredInfrastructure

```solidity
uint256 bristolBlenheimRequiredInfrastructure
```

### bristolBlenheimRequiredTech

```solidity
uint256 bristolBlenheimRequiredTech
```

### b52MitchellCost

```solidity
uint256 b52MitchellCost
```

### b52MitchellRequiredInfrastructure

```solidity
uint256 b52MitchellRequiredInfrastructure
```

### b52MitchellRequiredTech

```solidity
uint256 b52MitchellRequiredTech
```

### b17gFlyingFortressCost

```solidity
uint256 b17gFlyingFortressCost
```

### b17gFlyingFortressRequiredInfrastructure

```solidity
uint256 b17gFlyingFortressRequiredInfrastructure
```

### b17gFlyingFortressRequiredTech

```solidity
uint256 b17gFlyingFortressRequiredTech
```

### mint

```solidity
contract CountryMinter mint
```

### fight

```solidity
contract FightersContract fight
```

### fightMarket1

```solidity
contract FightersMarketplace1 fightMarket1
```

### inf

```solidity
contract InfrastructureContract inf
```

### tsy

```solidity
contract TreasuryContract tsy
```

### bomb1

```solidity
contract BombersContract bomb1
```

### settings

```solidity
function settings(address _countryMinter, address _bombers1, address _fighters, address _fightersMarket1, address _infrastructure, address _treasury) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### updateCountryMinterAddress

```solidity
function updateCountryMinterAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateBombers1Address

```solidity
function updateBombers1Address(address newAddress) public
```

_this function is only callable by the contract owner_

### updateFightersAddress

```solidity
function updateFightersAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateAh1CobraSpecs

```solidity
function updateAh1CobraSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a AH1 Cobra_

### getAh1CobraSpecs

```solidity
function getAh1CobraSpecs() public view returns (uint256, uint256, uint256)
```

### updateAh64ApacheSpecs

```solidity
function updateAh64ApacheSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a A64 Apache_

### getAh64ApacheSpecs

```solidity
function getAh64ApacheSpecs() public view returns (uint256, uint256, uint256)
```

### updateBristolBlenheimSpecs

```solidity
function updateBristolBlenheimSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a Bristol Blenheim_

### getBristolBlenheimSpecs

```solidity
function getBristolBlenheimSpecs() public view returns (uint256, uint256, uint256)
```

### updateB52MitchellSpecs

```solidity
function updateB52MitchellSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a B52 Mitchell_

### getB52MitchellSpecs

```solidity
function getB52MitchellSpecs() public view returns (uint256, uint256, uint256)
```

### updateB17gFlyingFortressSpecs

```solidity
function updateB17gFlyingFortressSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a B17 Flying Fortress_

### getB17gFlyingFortressSpecs

```solidity
function getB17gFlyingFortressSpecs() public view returns (uint256, uint256, uint256)
```

### buyAh1Cobra

```solidity
function buyAh1Cobra(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase an AH1 Cobra for their nation

_this is a public view function that will allow the caller to purchase an AH1 Cobra for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getAh1CobraCost

```solidity
function getAh1CobraCost(uint256 id) public view returns (uint256)
```

### buyAh64Apache

```solidity
function buyAh64Apache(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase an A64 Apache for their nation

_this is a public view function that will allow the caller to purchase an A64 Apache for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getAh64ApacheCost

```solidity
function getAh64ApacheCost(uint256 id) public view returns (uint256)
```

### buyBristolBlenheim

```solidity
function buyBristolBlenheim(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a Bristol Blenheim for their nation

_this is a public view function that will allow the caller to purchase a Bristol Blenheim for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getBristolBlenheimCost

```solidity
function getBristolBlenheimCost(uint256 id) public view returns (uint256)
```

### buyB52Mitchell

```solidity
function buyB52Mitchell(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a B52 Mitchell for their nation

_this is a public view function that will allow the caller to purchase a B52 Mitchell for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getB52MitchellCost

```solidity
function getB52MitchellCost(uint256 id) public view returns (uint256)
```

### buyB17gFlyingFortress

```solidity
function buyB17gFlyingFortress(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a B17 Flying Fortress for their nation

_this is a public view function that will allow the caller to purchase a B17 Flying Fortress for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getB17gFlyingFortressCost

```solidity
function getB17gFlyingFortressCost(uint256 id) public view returns (uint256)
```

## BombersMarketplace2

this contract allows nation owners to purchase B52 Stratofortresses, B2 Spirits, B1B Lancers and Tupolev TO160s

### countryMinter

```solidity
address countryMinter
```

### bombers1

```solidity
address bombers1
```

### fighters

```solidity
address fighters
```

### fightersMarket1

```solidity
address fightersMarket1
```

### infrastructure

```solidity
address infrastructure
```

### treasury

```solidity
address treasury
```

### b52StratofortressCost

```solidity
uint256 b52StratofortressCost
```

### b52StratofortressRequiredInfrastructure

```solidity
uint256 b52StratofortressRequiredInfrastructure
```

### b52StratofortressRequiredTech

```solidity
uint256 b52StratofortressRequiredTech
```

### b2SpiritCost

```solidity
uint256 b2SpiritCost
```

### b2SpiritRequiredInfrastructure

```solidity
uint256 b2SpiritRequiredInfrastructure
```

### b2SpiritRequiredTech

```solidity
uint256 b2SpiritRequiredTech
```

### b1bLancerCost

```solidity
uint256 b1bLancerCost
```

### b1bLancerRequiredInfrastructure

```solidity
uint256 b1bLancerRequiredInfrastructure
```

### b1bLancerRequiredTech

```solidity
uint256 b1bLancerRequiredTech
```

### tupolevTu160Cost

```solidity
uint256 tupolevTu160Cost
```

### tupolevTu160RequiredInfrastructure

```solidity
uint256 tupolevTu160RequiredInfrastructure
```

### tupolevTu160RequiredTech

```solidity
uint256 tupolevTu160RequiredTech
```

### mint

```solidity
contract CountryMinter mint
```

### fight

```solidity
contract FightersContract fight
```

### fightMarket1

```solidity
contract FightersMarketplace1 fightMarket1
```

### inf

```solidity
contract InfrastructureContract inf
```

### tsy

```solidity
contract TreasuryContract tsy
```

### bomb1

```solidity
contract BombersContract bomb1
```

### settings

```solidity
function settings(address _countryMinter, address _bombers1, address _fighters, address _fightersMarket1, address _infrastructure, address _treasury) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### updateCountryMinterAddress

```solidity
function updateCountryMinterAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateBombers1Address

```solidity
function updateBombers1Address(address newAddress) public
```

_this function is only callable by the contract owner_

### updateFightersAddress

```solidity
function updateFightersAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateB52StratofortressSpecs

```solidity
function updateB52StratofortressSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a B52 Stratofortress_

### getB52StratofortressSpecs

```solidity
function getB52StratofortressSpecs() public view returns (uint256, uint256, uint256)
```

### updateb2SpiritSpecs

```solidity
function updateb2SpiritSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a B2 Spirit_

### getb2SpiritSpecs

```solidity
function getb2SpiritSpecs() public view returns (uint256, uint256, uint256)
```

### updateB1bLancerSpecs

```solidity
function updateB1bLancerSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a B1B Lancer_

### getB1bLancerSpecs

```solidity
function getB1bLancerSpecs() public view returns (uint256, uint256, uint256)
```

### updateTupolevTu160Specs

```solidity
function updateTupolevTu160Specs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be used to update the price, infrastructure requirement and tech requirement in order to purchase a Tupolev TU160_

### getTupolevTu160Specs

```solidity
function getTupolevTu160Specs() public view returns (uint256, uint256, uint256)
```

### buyB52Stratofortress

```solidity
function buyB52Stratofortress(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a B52 Stratofortress for their nation

_this is a public view function that will allow the caller to purchase a B52 Stratofortress for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getB52StratofortressCost

```solidity
function getB52StratofortressCost(uint256 id) public view returns (uint256)
```

### buyB2Spirit

```solidity
function buyB2Spirit(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a B2 Spirit for their nation

_this is a public view function that will allow the caller to purchase a B2 Spirit for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getB2SpiritCost

```solidity
function getB2SpiritCost(uint256 id) public view returns (uint256)
```

### buyB1bLancer

```solidity
function buyB1bLancer(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a B1B Lancer for their nation

_this is a public view function that will allow the caller to purchase a B1B Lancer for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getB1bLancerCost

```solidity
function getB1bLancerCost(uint256 id) public view returns (uint256)
```

### buyTupolevTu160

```solidity
function buyTupolevTu160(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a Tupolev TU160 for their nation

_this is a public view function that will allow the caller to purchase a Tupolev TU160 for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getTupolevTu160Cost

```solidity
function getTupolevTu160Cost(uint256 id) public view returns (uint256)
```

## CountryMinter

this is the contract that will allow the user to mint a nation!

### countryId

```solidity
uint256 countryId
```

### countryParameters

```solidity
address countryParameters
```

### infrastructure

```solidity
address infrastructure
```

### resources

```solidity
address resources
```

### improvements1

```solidity
address improvements1
```

### improvements2

```solidity
address improvements2
```

### improvements3

```solidity
address improvements3
```

### improvements4

```solidity
address improvements4
```

### wonders1

```solidity
address wonders1
```

### wonders2

```solidity
address wonders2
```

### wonders3

```solidity
address wonders3
```

### wonders4

```solidity
address wonders4
```

### wonders

```solidity
address wonders
```

### military

```solidity
address military
```

### forces

```solidity
address forces
```

### treasury

```solidity
address treasury
```

### aid

```solidity
address aid
```

### navy

```solidity
address navy
```

### navalActions

```solidity
address navalActions
```

### fighters

```solidity
address fighters
```

### fightersMarket1

```solidity
address fightersMarket1
```

### fightersMarket2

```solidity
address fightersMarket2
```

### bombersMarket1

```solidity
address bombersMarket1
```

### bombersMarket2

```solidity
address bombersMarket2
```

### bombers

```solidity
address bombers
```

### missiles

```solidity
address missiles
```

### senate

```solidity
address senate
```

### idToOwner

```solidity
mapping(uint256 => address) idToOwner
```

### ownerCountryCount

```solidity
mapping(address => uint256) ownerCountryCount
```

### nationCreated

```solidity
event nationCreated(address countryOwner, string nationName, string ruler)
```

### constructor

```solidity
constructor() public
```

### settings

```solidity
function settings(address _countryParameters, address _treasury, address _infrastructure, address _resources, address _aid, address _missiles, address _senate) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings2

```solidity
function settings2(address _improvements1, address _improvements2, address _improvements3, address _improvements4, address _wonders1, address _wonders2, address _wonders3, address _wonders4) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings3

```solidity
function settings3(address _military, address _forces, address _navy, address _navalActions, address _fighters, address _fightersMarket1, address _fightersMarket2, address _bombers, address _bombersMarket1, address _bombersMarket2) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### generateCountry

```solidity
function generateCountry(string ruler, string nationName, string capitalCity, string nationSlogan) public
```

this function allows the caller to mint a nation
each wallet address can only contain one country

_this is a public function that allows the caller to mint a nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| ruler | string | this is a string that is the nation ruler name |
| nationName | string | this is a string that is the name of the nation |
| capitalCity | string | this is a string that is the name of the capital city of the nation |
| nationSlogan | string | this is a string that represents that slogan of the nation |

### checkOwnership

```solidity
function checkOwnership(uint256 id, address caller) public view returns (bool)
```

_this is public view function that will check if the caller of the function is the nation owner
this function is used throught the contracts for the game_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id |
| caller | address | is the caller of the function that gets passed into this function from another contract throught the game |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the caller address passed into the caller parameter is the owner of the nation of parameter id |

### getCountryCount

```solidity
function getCountryCount() public view returns (uint256)
```

_this function will return the current country Id that gets incremented every time a county is minted_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 will be number of countries minted |

## CountryParametersContract

_this contract will inferit from Chainlink VRF and OpenZeppelin Ownable_

### spyAddress

```solidity
address spyAddress
```

### senateAddress

```solidity
address senateAddress
```

### countryMinter

```solidity
address countryMinter
```

### keeper

```solidity
address keeper
```

### nuke

```solidity
address nuke
```

### groundBattle

```solidity
address groundBattle
```

### mint

```solidity
contract CountryMinter mint
```

### senate

```solidity
contract SenateContract senate
```

### randomNumbersRequested

```solidity
event randomNumbersRequested(uint256 requestId)
```

### randomNumbersFulfilled

```solidity
event randomNumbersFulfilled(uint256 preferredReligion, uint256 preferredGovernment)
```

### CountryParameters

```solidity
struct CountryParameters {
  uint256 id;
  address rulerAddress;
  string rulerName;
  string nationName;
  string capitalCity;
  string nationSlogan;
}
```

### CountrySettings

```solidity
struct CountrySettings {
  uint256 timeCreated;
  string alliance;
  uint256 nationTeam;
  uint256 governmentType;
  uint256 daysSinceGovernmentChenge;
  uint256 nationalReligion;
  uint256 daysSinceReligionChange;
  uint256 anarchyClock;
}
```

### idToCountryParameters

```solidity
mapping(uint256 => struct CountryParametersContract.CountryParameters) idToCountryParameters
```

### idToCountrySettings

```solidity
mapping(uint256 => struct CountryParametersContract.CountrySettings) idToCountrySettings
```

### s_requestIdToRequestIndex

```solidity
mapping(uint256 => uint256) s_requestIdToRequestIndex
```

### s_requestIndexToRandomWords

```solidity
mapping(uint256 => uint256[]) s_requestIndexToRandomWords
```

### onlyNukeAndGroundBattle

```solidity
modifier onlyNukeAndGroundBattle()
```

### constructor

```solidity
constructor(address vrfCoordinatorV2, uint64 subscriptionId, bytes32 gasLane, uint32 callbackGasLimit) public
```

_the consructor will inherit parameters required to initialize the chainlinh VRF functionality_

### settings

```solidity
function settings(address _spy, address _countryMinter, address _senate, address _keeper, address _nuke, address _groundBattle) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### onlySpyContract

```solidity
modifier onlySpyContract()
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### onlyKeeperContract

```solidity
modifier onlyKeeperContract()
```

### generateCountryParameters

```solidity
function generateCountryParameters(uint256 id, address nationOwner, string rulerName, string nationName, string capitalCity, string nationSlogan) public
```

this function will get called only when a nation is minted

_this is a public function but only callable from the counry minter contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this will be the nations ID that is passed in from the country minter contact |
| nationOwner | address | this will be the address of the nation owner that gets passed in from the country minter contract |
| rulerName | string | name passed in from country minter contract when a nation is minted |
| nationName | string | passed in from the country minter contract when a nation is minted |
| capitalCity | string | passed in from the country minter contract when a nation is minted |
| nationSlogan | string | passed in from the country minter contract when a nation is minted |

### fulfillRequest

```solidity
function fulfillRequest(uint256 id) public
```

_this is an internal function that will initalize the call for randomness from the chainlink VRF contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being minted |

### fulfillRandomWords

```solidity
function fulfillRandomWords(uint256 requestId, uint256[] randomWords) internal
```

_this is the function that gets called by the chainlink VRF contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | is the parameter that will allow the chainlink VRF to store a nations corresponding random words |
| randomWords | uint256[] | this array will contain 2 random numbers that will be used to determine a nations desired religion and government upon minting |

### setRulerName

```solidity
function setRulerName(string newRulerName, uint256 id) public
```

use this function to reset a nations ruler name
this function is only callable by the nation owner

_this is public function that will allow a nation ruler to reset a nations ruler name_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newRulerName | string | is the updated name for the nation ruler |
| id | uint256 | is the nation ID for the update |

### setNationName

```solidity
function setNationName(string newNationName, uint256 id) public
```

use this function to reset a nations name
this function is only callable by the nation owner

_this is public function that will allow a nation ruler to reset a nations name_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newNationName | string | is the updated name for the nation ruler |
| id | uint256 | is the nation ID for the update |

### setCapitalCity

```solidity
function setCapitalCity(string newCapitalCity, uint256 id) public
```

use this function to reset a nations capital city name
this function is only callable by the nation owner

_this is public function that will allow a nation ruler to reset a nations capital city name_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newCapitalCity | string | is the updated name for the nation ruler |
| id | uint256 | is the nation ID for the update |

### setNationSlogan

```solidity
function setNationSlogan(string newNationSlogan, uint256 id) public
```

use this function to reset a nations slogan
this function is only callable by the nation owner

_this is public function that will allow a nation ruler to reset a nations slogan_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newNationSlogan | string | is the updated name for the nation ruler |
| id | uint256 | is the nation ID for the update |

### setAlliance

```solidity
function setAlliance(string newAlliance, uint256 id) public
```

use this function to set an alliance
this function is only callable by the nation owner
there are an unlimited number of alliances , anyone can start an alliance

_this is public function that will allow a nation ruler to set an alliance_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newAlliance | string | is the updated name for the nation ruler |
| id | uint256 | is the nation ID for the update |

### setTeam

```solidity
function setTeam(uint256 id, uint256 newTeam) public
```

use this function to set a team membership for the nation
this function is only callable by the nation owner
there are only 15 teams in the game, each team has senators that can sanction nations on that team from trading and send sending aid to eachother

_this is public function that will allow a nation ruler to set a team membership for the nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID for the update |
| newTeam | uint256 | is the updated name for the nation ruler |

### setGovernment

```solidity
function setGovernment(uint256 id, uint256 newType) public
```

use this function to reset a nations government type
this function is only callable by the nation owner
there are 10 government types each with different advantages

_this is public function that will allow a nation ruler to chenge their government type_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID for the update |
| newType | uint256 | is the updated name for the nation ruler |

### updateDesiredGovernment

```solidity
function updateDesiredGovernment(uint256 id, uint256 newType) public
```

this is the function that the spy contract calls when a successful spy attack updates your desired governemnt

_this is a public function but it is only callable from the spy contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the updated desired government |
| newType | uint256 | is the updated governemnt type |

### setReligion

```solidity
function setReligion(uint256 id, uint256 newType) public
```

use this function to reset a nations religion type
this function is only callable by the nation owner
there are 14 religion types

_this is public function that will allow a nation ruler to chenge their religion type_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID for the update |
| newType | uint256 | is the updated name for the nation ruler |

### updateDesiredReligion

```solidity
function updateDesiredReligion(uint256 id, uint256 newType) public
```

this is the function that the spy contract calls when a successful spy attack updates your desired religion

_this is a public function but it is only callable from the spy contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the updated desired religion |
| newType | uint256 | is the updated religion type |

### inflictAnarchy

```solidity
function inflictAnarchy(uint256 id) public
```

### incrementDaysSince

```solidity
function incrementDaysSince() external
```

ruler must wait 3 days to change religion and government

_this is an esterna function that is only callable from the keeper contract
this function will increment the days since a religion and goverment change_

### getRulerName

```solidity
function getRulerName(uint256 countryId) public view returns (string)
```

_this is a view funtion that will return the ruler name for a country_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the ID for the nation being queried |

### getNationName

```solidity
function getNationName(uint256 countryId) public view returns (string)
```

_this is a view funtion that will return the nation name for a country_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the ID for the nation being queried |

### getCapital

```solidity
function getCapital(uint256 countryId) public view returns (string)
```

_this is a view funtion that will return the capital city for a country_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the ID for the nation being queried |

### getSlogan

```solidity
function getSlogan(uint256 countryId) public view returns (string)
```

_this is a view funtion that will return the slogan for a country_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the ID for the nation being queried |

### getAlliance

```solidity
function getAlliance(uint256 countryId) public view returns (string)
```

_this is a view funtion that will return the alliance name for a country_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the ID for the nation being queried |

### getTeam

```solidity
function getTeam(uint256 countryId) public view returns (uint256)
```

_this is a view funtion that will return the team for a country_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the ID for the nation being queried |

### getGovernmentType

```solidity
function getGovernmentType(uint256 countryId) public view returns (uint256)
```

_this is a view funtion that will return the goverment type for a country_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the ID for the nation being queried |

### getReligionType

```solidity
function getReligionType(uint256 countryId) public view returns (uint256)
```

_this is a view funtion that will return the religion type for a country_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the ID for the nation being queried |

### getTimeCreated

```solidity
function getTimeCreated(uint256 countryId) public view returns (uint256)
```

_this is a view funtion that will return the time a nation was minted_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the ID for the nation being queried |

### getGovernmentPreference

```solidity
function getGovernmentPreference(uint256 id) public view returns (uint256 preference)
```

_this is a view funtion that will return the government preference for a country_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the ID for the nation being queried |

### getReligionPreference

```solidity
function getReligionPreference(uint256 id) public view returns (uint256 preference)
```

_this is a view funtion that will return the religion preference for a country_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the ID for the nation being queried |

### getDaysSince

```solidity
function getDaysSince(uint256 id) public view returns (uint256, uint256)
```

_this is a view funtion that will return the days since a religion and governemnt change for a nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the ID for the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 will return an array with [0] as the days since governemtn change and [1] as days since religion change |
| [1] | uint256 |  |

## CrimeContract

this contract will calculate the number of criminals in a nations population

### infrastructure

```solidity
address infrastructure
```

### improvements1

```solidity
address improvements1
```

### improvements2

```solidity
address improvements2
```

### improvements3

```solidity
address improvements3
```

### parameters

```solidity
address parameters
```

### inf

```solidity
contract InfrastructureContract inf
```

### imp1

```solidity
contract ImprovementsContract1 imp1
```

### imp2

```solidity
contract ImprovementsContract2 imp2
```

### imp3

```solidity
contract ImprovementsContract3 imp3
```

### cp

```solidity
contract CountryParametersContract cp
```

### settings

```solidity
function settings(address _infrastructure, address _improvements1, address _improvements2, address _improvements3, address _parameters) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### updateInfrastructureContract

```solidity
function updateInfrastructureContract(address _newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementsContract1

```solidity
function updateImprovementsContract1(address _newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementsContract2

```solidity
function updateImprovementsContract2(address _newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementsContract3

```solidity
function updateImprovementsContract3(address _newAddress) public
```

_this function is only callable by the contract owner_

### updateCountryParameters

```solidity
function updateCountryParameters(address _newAddress) public
```

_this function is only callable by the contract owner_

### getCriminalCount

```solidity
function getCriminalCount(uint256 id) public view returns (uint256)
```

this will calulate the number of criminals in a nations population
criminals will rduce the amount of your tax paying citizens
you will also lose population happiness as your criminal population increases
jails, labor camps, border walls and prisons will reduce the number of criminals in your nation

_this is a public view function that will calculate the number of criminals in a nations population_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this function will return the number of criminals in your population |

### getCrimeIndex

```solidity
function getCrimeIndex(uint256 id) public view returns (uint256)
```

the higher your crime prevention score the lower your crime index
the higher your crime index the more criminals you will have in your population
the percentage of your population that is criminals = crime index +1

_this function will take your nation's crime prevention score and return a crime index_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the country being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is crime index of the nation |

### getCrimePreventionScore

```solidity
function getCrimePreventionScore(uint256 id) public view returns (uint256)
```

this function calculates crime prevention score
the higher the CPS the lower the number of criminals in your population

_this is a public view function that calculates a nations crime prevention score_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the crime prevention score being returned by the function |

### getLiteracy

```solidity
function getLiteracy(uint256 id) public view returns (uint256)
```

this function will return a nations literacy rate
literacy is increased by the amount of technology of a nation as well as the amount of schools and universities
increased literacy will increase crime prevention score

_this is a public view function that returns the literace rate of the nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the countey being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the literacy rate of the nation |

### getLiteracyPoints

```solidity
function getLiteracyPoints(uint256 id) public view returns (uint256)
```

literaacy will increse the crime prevention score of a nation
crime prevention score points added will be 80% of literacy (max of 80 points added)

_this function is a public view function that will calculate the amount of points that a nations literace rate will add to the crime prevention score_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the amount of points being added to the crime prevention score |

### getImprovementPoints

```solidity
function getImprovementPoints(uint256 id) public view returns (uint256)
```

schools, universities, polive headquarters, casinos and red light districts all affect a nations crime prevention score
a nations tax rate will change the magnitude of these improvements affect on crime prevention score
the higher a tax rate the lower the crime prevention score will be and the more criminals a population will have

_this is a publci view function that will calculate the amount of crime prevention score points from a nations improvements and tax rate_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of points added to crime prevention score from imrpovements and tax rate |

### getTaxRateCrimeMultiplier

```solidity
function getTaxRateCrimeMultiplier(uint256 id) public view returns (uint256)
```

the higher a nations tax rate the lower the multiplier will be and the lower the crime prevention score will be

_this a public vuew function that will return the multiplier used to adjust the affect that a nations tax rate will have on crime prevention score_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the munliplier used to adjust the points added to crime prevention score from taxes and improvements |

### getPointsFromGovernmentType

```solidity
function getPointsFromGovernmentType(uint256 id) public view returns (uint256)
```

different govermnet types will affect a nations crime prevenetion score differently

_this is a public view function that will add points to crime prevention score based on government type_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the points added to crime prevention score from governemtn type |

### getPointsFromInfrastruture

```solidity
function getPointsFromInfrastruture(uint256 id) public view returns (uint256)
```

more infrastructure will increase crime prevention score reducing criminals

_this is a public view function that will return the crime prevention score points from infrastructure_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID for the countrtry being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the points added to crime prevention score from infrastructure |

### getPointsFromPopulation

```solidity
function getPointsFromPopulation(uint256 id) public view returns (uint256)
```

increased population will reduce croime prevention score

_this is a public view function that will add points to crime prevention score based on population_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queries |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the amount of points being added to crime prevention score |

## CruiseMissileContract

this contract will allow a nation owner to launch a cruise missile attack against another nation

_this contract inherits from OpenZeppelin ownable and Chainlink VRF_

### cruiseMissileAttackId

```solidity
uint256 cruiseMissileAttackId
```

### forces

```solidity
address forces
```

### countryMinter

```solidity
address countryMinter
```

### warAddress

```solidity
address warAddress
```

### infrastructure

```solidity
address infrastructure
```

### missiles

```solidity
address missiles
```

### improvements1

```solidity
address improvements1
```

### improvements3

```solidity
address improvements3
```

### improvements4

```solidity
address improvements4
```

### wonders2

```solidity
address wonders2
```

### force

```solidity
contract ForcesContract force
```

### mint

```solidity
contract CountryMinter mint
```

### war

```solidity
contract WarContract war
```

### inf

```solidity
contract InfrastructureContract inf
```

### mis

```solidity
contract MissilesContract mis
```

### imp1

```solidity
contract ImprovementsContract1 imp1
```

### imp3

```solidity
contract ImprovementsContract3 imp3
```

### imp4

```solidity
contract ImprovementsContract4 imp4
```

### won2

```solidity
contract WondersContract2 won2
```

### CruiseMissileAttack

```solidity
struct CruiseMissileAttack {
  uint256 warId;
  uint256 attackerId;
  uint256 defenderId;
  uint256 tanksDestroyed;
  uint256 technologyDestroyed;
  uint256 infrastructureDestroyed;
}
```

### attackIdToCruiseMissile

```solidity
mapping(uint256 => struct CruiseMissileContract.CruiseMissileAttack) attackIdToCruiseMissile
```

### s_requestIdToRequestIndex

```solidity
mapping(uint256 => uint256) s_requestIdToRequestIndex
```

### s_requestIndexToRandomWords

```solidity
mapping(uint256 => uint256[]) s_requestIndexToRandomWords
```

### constructor

```solidity
constructor(address vrfCoordinatorV2, uint64 subscriptionId, bytes32 gasLane, uint32 callbackGasLimit) public
```

_this is the constructor that inherits chainlink variables to use chainlink VRF_

### settings

```solidity
function settings(address _forces, address _countryMinter, address _war, address _infrastructure, address _missiles) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings2

```solidity
function settings2(address _improvements1, address _improvements3, address _improvements4, address _wonders2) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### updateForcesContract

```solidity
function updateForcesContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateCountryMinter

```solidity
function updateCountryMinter(address newAddress) public
```

_this function is only callable by the contract owner_

### updateWarContract

```solidity
function updateWarContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateInfrastructureContract

```solidity
function updateInfrastructureContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateMissilesContract

```solidity
function updateMissilesContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementsContract1

```solidity
function updateImprovementsContract1(address newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementsContract3

```solidity
function updateImprovementsContract3(address newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementsContract4

```solidity
function updateImprovementsContract4(address newAddress) public
```

_this function is only callable by the contract owner_

### updateWondersContract2

```solidity
function updateWondersContract2(address newAddress) public
```

_this function is only callable by the contract owner_

### launchCruiseMissileAttack

```solidity
function launchCruiseMissileAttack(uint256 attackerId, uint256 defenderId, uint256 warId) public
```

this function allows a nation owner to launch a cruise missile attack
can only attack another nation where war is currently declared

_this is a public function that will allow a nation to launch a cruise missile attack against another nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| attackerId | uint256 | is the ID of the attacking nation |
| defenderId | uint256 | is the ID of the defendin nation |
| warId | uint256 | is the ID for the war between the two nations |

### fulfillRequest

```solidity
function fulfillRequest(uint256 id) internal
```

_this is an internal function that will call the VRFCoordinator from randomness from chainlink_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the ID of the cruise missile attack |

### fulfillRandomWords

```solidity
function fulfillRandomWords(uint256 requestId, uint256[] randomWords) internal
```

this function will randomly determine is the cruise missile attacke was successful
attacker satellites increase the odds of a successful attack
defender satellites and intercepor middile system will increase the odds of a missile attack being thwarted
a successful cruise missile attacke will reduce defender tanks, tech or infrastructure (type selected randomly)

_this is the fnction that the ChainlinkVRF contract will call when it responds
this function randomly determine the outcome of the cruise missile attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | id the ID number for the request made to the VRF contract |
| randomWords | uint256[] | is the random numbers that the ChainlinkVRF contract responds with |

### destroyTanks

```solidity
function destroyTanks(uint256 attackId) internal
```

this function will decrease the number of tanks of the defender in a successful cruise missile attack
attacker munitions factories will increase the damage inflicted by a cruise missile attack on tanks
defender bunkers will decrease the damage infilcted by a cruise missile attack on tanks

_this is the internal function that will determine the number of tanks destroyed in a cruise missile attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| attackId | uint256 | is the ID of the cruise missile attack |

### destroyTech

```solidity
function destroyTech(uint256 attackId) internal
```

this function will decrease the tech of a defending nation in the event of a successful cruise missile attack
attacker munitions factories will increase the damage inflicted by a cruise missile attack on tech
defender bunkers will decrease the damage infilcted by a cruise missile attack on tech

_this is an internal function that will decrease defender Tech in the event of a successful cruise missile launch_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| attackId | uint256 | is the ID of the cruise missile attack |

### destroyInfrastructure

```solidity
function destroyInfrastructure(uint256 attackId) internal
```

this function will decrease the infrastructure of a defending nation in the event of a successful cruise missile attack
attacker munitions factories will increase the damage inflicted by a cruise missile attack on infrastructure
defender bunkers will decrease the damage infilcted by a cruise missile attack on infrastructure

_this is an internal function that will decrease defender Infrastructure in the event of a successful cruise missile attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| attackId | uint256 | is the ID of the cruise missile attack |

## EnvironmentContract

this contract will calculate the environment score for a nation

_this contact inherits from OpenZeppelin ownable_

### countryMinter

```solidity
address countryMinter
```

### resources

```solidity
address resources
```

### infrastructure

```solidity
address infrastructure
```

### improvements1

```solidity
address improvements1
```

### improvements3

```solidity
address improvements3
```

### improvements4

```solidity
address improvements4
```

### wonders3

```solidity
address wonders3
```

### wonders4

```solidity
address wonders4
```

### forces

```solidity
address forces
```

### parameters

```solidity
address parameters
```

### taxes

```solidity
address taxes
```

### missiles

```solidity
address missiles
```

### nukes

```solidity
address nukes
```

### bonusResources

```solidity
address bonusResources
```

### mint

```solidity
contract CountryMinter mint
```

### res

```solidity
contract ResourcesContract res
```

### inf

```solidity
contract InfrastructureContract inf
```

### imp1

```solidity
contract ImprovementsContract1 imp1
```

### imp3

```solidity
contract ImprovementsContract3 imp3
```

### imp4

```solidity
contract ImprovementsContract4 imp4
```

### won3

```solidity
contract WondersContract3 won3
```

### won4

```solidity
contract WondersContract4 won4
```

### force

```solidity
contract ForcesContract force
```

### param

```solidity
contract CountryParametersContract param
```

### tax

```solidity
contract TaxesContract tax
```

### mis

```solidity
contract MissilesContract mis
```

### nuke

```solidity
contract NukeContract nuke
```

### bonus

```solidity
contract BonusResourcesContract bonus
```

### settings

```solidity
function settings(address _countryMinter, address _resources, address _infrastructure, address _wonders3, address _wonders4, address _forces, address _parameters, address _taxes, address _missiles, address _nukes) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings2

```solidity
function settings2(address _improvements1, address _improvements3, address _improvements4, address _bonusResources) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### updateCountryMinter

```solidity
function updateCountryMinter(address newAddress) public
```

_this function is only callable by the contract owner_

### updateResourcesContract

```solidity
function updateResourcesContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateInfrastructureContract

```solidity
function updateInfrastructureContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateWondersContract3

```solidity
function updateWondersContract3(address newAddress) public
```

_this function is only callable by the contract owner_

### updateWondersContract4

```solidity
function updateWondersContract4(address newAddress) public
```

_this function is only callable by the contract owner_

### updateForcesContract

```solidity
function updateForcesContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateParametersContract

```solidity
function updateParametersContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateTaxesContract

```solidity
function updateTaxesContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateMissilesContract

```solidity
function updateMissilesContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateNukeContract

```solidity
function updateNukeContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementsContract1

```solidity
function updateImprovementsContract1(address newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementsContract3

```solidity
function updateImprovementsContract3(address newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementsContract4

```solidity
function updateImprovementsContract4(address newAddress) public
```

_this function is only callable by the contract owner_

### getEnvironmentScore

```solidity
function getEnvironmentScore(uint256 id) public view returns (uint256)
```

a higher environment score will decrease a nations happiness and population

_this is a public view function that will return the environment score for a nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the environement score for the nation (environment scores are 0 - 10) |

### getGrossEnvironmentScore

```solidity
function getGrossEnvironmentScore(uint256 id) public view returns (int256)
```

the gross environment score generated here will be converted into the environment score
every 10 points of gross score is equal to one point of environement

_this is a public view function that will generate the gross environment score_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int256 | int256 this is the gross environment score |

### getEnvironmentScoreFromResources

```solidity
function getEnvironmentScoreFromResources(uint256 id) public view returns (int256)
```

coal, oil, iron, uranium, water and radiation cleanup resources will all affect environemnt

_this is a public view function that will generate environment points from resources_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int256 | int256 is gross environment points from resources |

### getEnvironmentScoreFromImprovementsAndWonders

```solidity
function getEnvironmentScoreFromImprovementsAndWonders(uint256 id) public view returns (int256)
```

this function will return gross environment points from improvements and wonders
border walls, munitions factories and red light districts affect a nations environment score

_this is a public view function that will generate gross environment score from improvements and wonders_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int256 | int256 is the gross environment points from improvements and wonders |

### getEnvironmentScoreFromTech

```solidity
function getEnvironmentScoreFromTech(uint256 id) public view returns (int256)
```

this function will return gross environment points from a nations technology level
a nations environment score will be penalized if the tech level is less than 6

_this is a public view function that will generate gross environment score from a nations technology level_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int256 | int256 is the gross environment points from a nations technology level |

### getEnvironmentScoreFromMilitaryDensity

```solidity
function getEnvironmentScoreFromMilitaryDensity(uint256 id) public view returns (int256)
```

this function will return gross environment points from a nations soldier to population ratio
a soldier to population ratio greater than 60% will result in an environmental penalty

_this is a public view function that will generate gross environment score from a nations soldier to population ratio_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int256 | int256 is the gross environment points from a nations soldier to population ratio |

### getEnvironmentScoreFromInfrastructure

```solidity
function getEnvironmentScoreFromInfrastructure(uint256 id) public view returns (int256)
```

this function will return gross environment points from a nations infrastructure to land ratio
a infrastructure to land ratio greater than 2:1 will result in an environmental penalty

_this is a public view function that will generate gross environment score from a nations infrastructure to land ratio_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int256 | int256 is the gross environment points from a nations infrastructure to land ratio |

### getScoreFromNukes

```solidity
function getScoreFromNukes(uint256 id) public view returns (int256)
```

this function will return gross environment points from a nations nuke count
a nations environment score will go up 1 point every ten nukes owned

_this is a public view function that will generate gross environment score from a nations nuke count_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int256 | int256 is the gross environment points from a nations nuke count |

### getScoreFromGovernment

```solidity
function getScoreFromGovernment(uint256 id) public view returns (int256)
```

this function will return gross environment points from a nations government type
a nations environment score will go up 10 points for anarchy, communist, dictatorship, and transitional gov types
a nations environment score will go down 10 points for capitalist, democracy, and republic gov types

_this is a public view function that will generate gross environment score from a nations government type_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int256 | int256 is the gross environment points from a nations government |

## FightersContract

this contract will store data for the figher aircraft owned by a nation

### countryMinter

```solidity
address countryMinter
```

### fightersMarket1

```solidity
address fightersMarket1
```

### fightersMarket2

```solidity
address fightersMarket2
```

### bombers

```solidity
address bombers
```

### treasuryAddress

```solidity
address treasuryAddress
```

### infrastructure

```solidity
address infrastructure
```

### war

```solidity
address war
```

### resources

```solidity
address resources
```

### improvements1

```solidity
address improvements1
```

### airBattle

```solidity
address airBattle
```

### wonders1

```solidity
address wonders1
```

### losses

```solidity
address losses
```

### navy

```solidity
address navy
```

### mint

```solidity
contract CountryMinter mint
```

### res

```solidity
contract ResourcesContract res
```

### imp1

```solidity
contract ImprovementsContract1 imp1
```

### won1

```solidity
contract WondersContract1 won1
```

### nav

```solidity
contract NavyContract nav
```

### bomb

```solidity
contract BombersContract bomb
```

### DefendingFighters

```solidity
struct DefendingFighters {
  uint256 defendingAircraft;
  uint256 yak9Count;
  uint256 p51MustangCount;
  uint256 f86SabreCount;
  uint256 mig15Count;
  uint256 f100SuperSabreCount;
  uint256 f35LightningCount;
  uint256 f15EagleCount;
  uint256 su30MkiCount;
  uint256 f22RaptorCount;
}
```

### DeployedFighters

```solidity
struct DeployedFighters {
  uint256 deployedAircraft;
  uint256 yak9Count;
  uint256 p51MustangCount;
  uint256 f86SabreCount;
  uint256 mig15Count;
  uint256 f100SuperSabreCount;
  uint256 f35LightningCount;
  uint256 f15EagleCount;
  uint256 su30MkiCount;
  uint256 f22RaptorCount;
}
```

### idToDefendingFighters

```solidity
mapping(uint256 => struct FightersContract.DefendingFighters) idToDefendingFighters
```

### idToDeployedFighters

```solidity
mapping(uint256 => struct FightersContract.DeployedFighters) idToDeployedFighters
```

### settings

```solidity
function settings(address _countryMinter, address _fightersMarket1, address _fightersMarket2, address _treasuryAddress, address _war, address _infrastructure, address _resources, address _improvements1, address _airBattle, address _wonders1, address _losses) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings2

```solidity
function settings2(address _navy, address _bombers) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### onlyWar

```solidity
modifier onlyWar()
```

### onlyMarket

```solidity
modifier onlyMarket()
```

### onlyLossesContract

```solidity
modifier onlyLossesContract()
```

### generateFighters

```solidity
function generateFighters(uint256 id) public
```

this function allows a nation to purchase fighter aircraft once a country is minted

_this function is a public function but only callable from the country minter contact when a country is minted_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the nation being minted |

### getAircraftCount

```solidity
function getAircraftCount(uint256 id) public view returns (uint256)
```

this function will return the total number of a nations aircraft (fighters and bombers)

_this is a public view function that will return the total (fighters + bombers) number of a nations aircraft_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the total aircraft count of a nation (fighters and bombers) |

### getDefendingCount

```solidity
function getDefendingCount(uint256 id) public view returns (uint256)
```

this function will return the total number of a nations defending aircraft

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the total number of the nations defending aircraft (fighters and bombers) |

### onlyBomberContract

```solidity
modifier onlyBomberContract()
```

### increaseAircraftCount

```solidity
function increaseAircraftCount(uint256 amount, uint256 id) public
```

this function will increase the total aricraft count when a bomber is purchased

_this function is only callable from the bomber marketplace contracts_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the number of bomber aircraft being purchased |
| id | uint256 | this is the nation ID of the nation being queried |

### decreaseDefendingAircraftCount

```solidity
function decreaseDefendingAircraftCount(uint256 amount, uint256 id) public
```

this function will decrease the total aricraft count when a bomber is decommissioned

_this function is only callable from the bomber marketplace contracts_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the number of bomber aircraft being decomissioned |
| id | uint256 | this is the nation ID of the nation being queried |

### decreaseDefendingAircraftCountFromLosses

```solidity
function decreaseDefendingAircraftCountFromLosses(uint256 amount, uint256 id) public
```

this function will decrease the number of defending fighters lost in battle

_this function is only callable from the fighter losses contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | this is the amount of figher aircraft lost |
| id | uint256 | this is the nation ID of the nation being queried |

### decreaseDeployedAircraftCountFromLosses

```solidity
function decreaseDeployedAircraftCountFromLosses(uint256 amount, uint256 id) public
```

this function will decrease the number of deployed fighters lost in battle

_this function is only callable from the fighter losses contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | this is the amount of figher aircraft lost |
| id | uint256 | this is the nation ID of the nation being queried |

### getDefendingYak9Count

```solidity
function getDefendingYak9Count(uint256 id) public view returns (uint256)
```

this function will return the amount of defending Yak9's of a nation

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending Yak9 aircraft for the nation |

### increaseYak9Count

```solidity
function increaseYak9Count(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Fighter Market contracts_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingYak9Count

```solidity
function decreaseDefendingYak9Count(uint256 amount, uint256 id) public
```

this function will decrease the amount of defending aircraft lost in a battle

_this function is only callable from the losses contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapYak9

```solidity
function scrapYak9(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission Yak9's

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingP51MustangCount

```solidity
function getDefendingP51MustangCount(uint256 id) public view returns (uint256)
```

this function will return the amount of defending P51 Mustangs's of a nation

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending P51 Mustang aircraft for the nation |

### increaseP51MustangCount

```solidity
function increaseP51MustangCount(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Fighter Market contracts_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingP51MustangCount

```solidity
function decreaseDefendingP51MustangCount(uint256 amount, uint256 id) public
```

this function will decrease the amount of defending aircraft lost in a battle

_this function is only callable from the losses contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapP51Mustang

```solidity
function scrapP51Mustang(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission P51 Mustangs's

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingF86SabreCount

```solidity
function getDefendingF86SabreCount(uint256 id) public view returns (uint256)
```

this function will return the amount of defending F86 Sabre's of a nation

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending F86 Sabre aircraft for the nation |

### increaseF86SabreCount

```solidity
function increaseF86SabreCount(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Fighter Market contracts_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingF86SabreCount

```solidity
function decreaseDefendingF86SabreCount(uint256 amount, uint256 id) public
```

this function will decrease the amount of defending aircraft lost in a battle

_this function is only callable from the losses contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapF86Sabre

```solidity
function scrapF86Sabre(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission F86 Sabre's

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingMig15Count

```solidity
function getDefendingMig15Count(uint256 id) public view returns (uint256)
```

this function will return the amount of defending Mig15's of a nation

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending Mig15's aircraft for the nation |

### increaseMig15Count

```solidity
function increaseMig15Count(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Fighter Market contracts_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingMig15Count

```solidity
function decreaseDefendingMig15Count(uint256 amount, uint256 id) public
```

this function will decrease the amount of defending aircraft lost in a battle

_this function is only callable from the losses contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapMig15

```solidity
function scrapMig15(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission Mig15's

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingF100SuperSabreCount

```solidity
function getDefendingF100SuperSabreCount(uint256 id) public view returns (uint256)
```

this function will return the amount of defending F100 Super Sabre's of a nation

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending F100 Super Sabre aircraft for the nation |

### increaseF100SuperSabreCount

```solidity
function increaseF100SuperSabreCount(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Fighter Market contracts_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingF100SuperSabreCount

```solidity
function decreaseDefendingF100SuperSabreCount(uint256 amount, uint256 id) public
```

this function will decrease the amount of defending aircraft lost in a battle

_this function is only callable from the losses contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapF100SuperSabre

```solidity
function scrapF100SuperSabre(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission F100 Super Sabre's

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingF35LightningCount

```solidity
function getDefendingF35LightningCount(uint256 id) public view returns (uint256)
```

this function will return the amount of defending F35 Lightning's of a nation

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending F35 Lightning aircraft for the nation |

### increaseF35LightningCount

```solidity
function increaseF35LightningCount(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Fighter Market contracts_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingF35LightningCount

```solidity
function decreaseDefendingF35LightningCount(uint256 amount, uint256 id) public
```

this function will decrease the amount of defending aircraft lost in a battle

_this function is only callable from the losses contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapF35Lightning

```solidity
function scrapF35Lightning(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission F35's

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingF15EagleCount

```solidity
function getDefendingF15EagleCount(uint256 id) public view returns (uint256)
```

this function will return the amount of defending F15 Eagle's of a nation

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending F15 Eagle aircraft for the nation |

### increaseF15EagleCount

```solidity
function increaseF15EagleCount(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Fighter Market contracts_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingF15EagleCount

```solidity
function decreaseDefendingF15EagleCount(uint256 amount, uint256 id) public
```

this function will decrease the amount of defending aircraft lost in a battle

_this function is only callable from the losses contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapF15Eagle

```solidity
function scrapF15Eagle(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission F15's

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingSu30MkiCount

```solidity
function getDefendingSu30MkiCount(uint256 id) public view returns (uint256)
```

this function will return the amount of defending Su30 Mki's of a nation

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending Su30 Mki aircraft for the nation |

### increaseSu30MkiCount

```solidity
function increaseSu30MkiCount(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Fighter Market contracts_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingSu30MkiCount

```solidity
function decreaseDefendingSu30MkiCount(uint256 amount, uint256 id) public
```

this function will decrease the amount of defending aircraft lost in a battle

_this function is only callable from the losses contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapSu30Mki

```solidity
function scrapSu30Mki(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission Su30's

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### getDefendingF22RaptorCount

```solidity
function getDefendingF22RaptorCount(uint256 id) public view returns (uint256)
```

this function will return the amount of defending F22 Raptor's of a nation

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending F22 Raptor aircraft for the nation |

### increaseF22RaptorCount

```solidity
function increaseF22RaptorCount(uint256 id, uint256 amount) public
```

this function will increase the number of aircraft when they are purchased in the marketplace

_this function is only callabel from the Fighter Market contracts_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation |
| amount | uint256 | is the amount of aircraft being purchased |

### decreaseDefendingF22RaptorCount

```solidity
function decreaseDefendingF22RaptorCount(uint256 amount, uint256 id) public
```

this function will decrease the amount of defending aircraft lost in a battle

_this function is only callable from the losses contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

### scrapF22Raptor

```solidity
function scrapF22Raptor(uint256 amount, uint256 id) public
```

this function will allow a nation owner to decommission F22's

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of aircraft being destroyed |
| id | uint256 | is the nation ID of the nation |

## FighterLosses

this contract will decrease the amount of fighters lost in battle

### fighters

```solidity
address fighters
```

### airBattle

```solidity
address airBattle
```

### fight

```solidity
contract FightersContract fight
```

### settings

```solidity
function settings(address _fighters, address _airBattle) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### onlyAirBattle

```solidity
modifier onlyAirBattle()
```

### updateFightersAddress

```solidity
function updateFightersAddress(address _newAddress) public
```

### updateAirBattleAddress

```solidity
function updateAirBattleAddress(address _newAddress) public
```

### decrementLosses

```solidity
function decrementLosses(uint256[] defenderLosses, uint256 defenderId, uint256[] attackerLosses, uint256 attackerId) public
```

this function will decrease the amount of fighers lost in battle from the FighersContract

_this is a public function that is only callable from the Air Battle contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| defenderLosses | uint256[] | is an array of uints that represent the fighters that the defender lost in battle |
| defenderId | uint256 | is the nation ID of the defender |
| attackerLosses | uint256[] | is an array of uints that represent the fighters that the attacker lost in battle |
| attackerId | uint256 | is the nation ID of the attacker |

## FightersMarketplace1

this contract will allow the nation owner to buy Yak9s, P51 Mustangs, F86 Sabres, Mig15s, and F100's

_this contact inherits from openzeppelin's ownable contract_

### countryMinter

```solidity
address countryMinter
```

### fighters

```solidity
address fighters
```

### bombers

```solidity
address bombers
```

### treasury

```solidity
address treasury
```

### infrastructure

```solidity
address infrastructure
```

### resources

```solidity
address resources
```

### improvements1

```solidity
address improvements1
```

### wonders1

```solidity
address wonders1
```

### wonders4

```solidity
address wonders4
```

### navy

```solidity
address navy
```

### bonusResources

```solidity
address bonusResources
```

### navy2

```solidity
address navy2
```

### yak9Cost

```solidity
uint256 yak9Cost
```

### yak9RequiredInfrastructure

```solidity
uint256 yak9RequiredInfrastructure
```

### yak9RequiredTech

```solidity
uint256 yak9RequiredTech
```

### p51MustangCost

```solidity
uint256 p51MustangCost
```

### p51MustangRequiredInfrastructure

```solidity
uint256 p51MustangRequiredInfrastructure
```

### p51MustangRequiredTech

```solidity
uint256 p51MustangRequiredTech
```

### f86SabreCost

```solidity
uint256 f86SabreCost
```

### f86SabreRequiredInfrastructure

```solidity
uint256 f86SabreRequiredInfrastructure
```

### f86SabreRequiredTech

```solidity
uint256 f86SabreRequiredTech
```

### mig15Cost

```solidity
uint256 mig15Cost
```

### mig15RequiredInfrastructure

```solidity
uint256 mig15RequiredInfrastructure
```

### mig15RequiredTech

```solidity
uint256 mig15RequiredTech
```

### f100SuperSabreCost

```solidity
uint256 f100SuperSabreCost
```

### f100SuperSabreRequiredInfrastructure

```solidity
uint256 f100SuperSabreRequiredInfrastructure
```

### f100SuperSabreRequiredTech

```solidity
uint256 f100SuperSabreRequiredTech
```

### mint

```solidity
contract CountryMinter mint
```

### bomb

```solidity
contract BombersContract bomb
```

### res

```solidity
contract ResourcesContract res
```

### imp1

```solidity
contract ImprovementsContract1 imp1
```

### won1

```solidity
contract WondersContract1 won1
```

### won4

```solidity
contract WondersContract4 won4
```

### fight

```solidity
contract FightersContract fight
```

### nav

```solidity
contract NavyContract nav
```

### bonus

```solidity
contract BonusResourcesContract bonus
```

### nav2

```solidity
contract NavyContract2 nav2
```

### settings

```solidity
function settings(address _countryMinter, address _bombers, address _fighters, address _treasury, address _infrastructure, address _resources, address _improvements1, address _wonders1, address _wonders4, address _navy) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings2

```solidity
function settings2(address _bonusResources, address _navy2) public
```

### idToOwnerFightersMarket

```solidity
mapping(uint256 => address) idToOwnerFightersMarket
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### updateCountryMinterAddress

```solidity
function updateCountryMinterAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateBombersAddress

```solidity
function updateBombersAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateFightersAddress

```solidity
function updateFightersAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateResourcesAddress

```solidity
function updateResourcesAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovements1Address

```solidity
function updateImprovements1Address(address newAddress) public
```

_this function is only callable by the contract owner_

### updateWonders4Address

```solidity
function updateWonders4Address(address newAddress) public
```

_this function is only callable by the contract owner_

### updateYak9Specs

```solidity
function updateYak9Specs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a Yak9_

### getYak9Specs

```solidity
function getYak9Specs() public view returns (uint256, uint256, uint256)
```

### updateP51MustangSpecs

```solidity
function updateP51MustangSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a P51 Mustang_

### getP51MustangSpecs

```solidity
function getP51MustangSpecs() public view returns (uint256, uint256, uint256)
```

### updateF86SabreSpecs

```solidity
function updateF86SabreSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a F86 Sabre_

### getF86SabreSpecs

```solidity
function getF86SabreSpecs() public view returns (uint256, uint256, uint256)
```

### updateMig15Specs

```solidity
function updateMig15Specs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a Mig15_

### getMig15Specs

```solidity
function getMig15Specs() public view returns (uint256, uint256, uint256)
```

### updateF100SuperSabreSpecs

```solidity
function updateF100SuperSabreSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a F100 Super Sabre_

### getF100SuperSabreSpecs

```solidity
function getF100SuperSabreSpecs() public view returns (uint256, uint256, uint256)
```

### buyYak9

```solidity
function buyYak9(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a Yak9 for their nation

_this is a public view function that will allow the caller to purchase a Yak9 for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getYak9Cost

```solidity
function getYak9Cost(uint256 id) public view returns (uint256)
```

### buyP51Mustang

```solidity
function buyP51Mustang(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a P51 for their nation

_this is a public view function that will allow the caller to purchase a P51 for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getP51MustangCost

```solidity
function getP51MustangCost(uint256 id) public view returns (uint256)
```

### buyF86Sabre

```solidity
function buyF86Sabre(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a F86 for their nation

_this is a public view function that will allow the caller to purchase a F86 for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getF86SabreCost

```solidity
function getF86SabreCost(uint256 id) public view returns (uint256)
```

### buyMig15

```solidity
function buyMig15(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a Mig15 for their nation

_this is a public view function that will allow the caller to purchase a Mig15 for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getMig15Cost

```solidity
function getMig15Cost(uint256 id) public view returns (uint256)
```

### buyF100SuperSabre

```solidity
function buyF100SuperSabre(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a F100 Super Sabre for their nation

_this is a public view function that will allow the caller to purchase a F100 Super Sabre for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getF100SuperSabreCost

```solidity
function getF100SuperSabreCost(uint256 id) public view returns (uint256)
```

### getAircraftPurchaseCostModifier

```solidity
function getAircraftPurchaseCostModifier(uint256 id) public view returns (uint256)
```

this function will adjust the cost of aircraft based on resources, improvements and wonders
aluminium, oil, rubber, airports and space programs decrease the cost of aircraft

_this is public view function that will adjust the cost of the aircraft being purchased based on resources, improvements and wonders of that nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the percentage modifier used to adjust the aircraft purchase price |

### getMaxAircraftCount

```solidity
function getMaxAircraftCount(uint256 id) public view returns (uint256)
```

this is a function that will return the maximum amount of aircraft a nation can own
the base amount of aircraft a nation can own is 50
access to the construction resource will increase the amount of aircraft a nation can own by 10
a foreign air force base will increase the maximum amount of aircraft for a nation by 20
the maxmimum aircraft a nation can own will increase by 5 for each aircraft carrier owned

_this a public view function that will return the maximum amonut of aircraft a nation can own_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the maximum amount of aircraft a nation can own |

## FightersMarketplace2

this contract allows a nation owner to purchase F35's, F15's, SU30's and F22's

_this contact inherits from owpenzeppelin's ownable contact_

### countryMinter

```solidity
address countryMinter
```

### fighters

```solidity
address fighters
```

### fightersMarket1

```solidity
address fightersMarket1
```

### bombers

```solidity
address bombers
```

### treasury

```solidity
address treasury
```

### infrastructure

```solidity
address infrastructure
```

### resources

```solidity
address resources
```

### improvements1

```solidity
address improvements1
```

### f35LightningCost

```solidity
uint256 f35LightningCost
```

### f35LightningRequiredInfrastructure

```solidity
uint256 f35LightningRequiredInfrastructure
```

### f35LightningRequiredTech

```solidity
uint256 f35LightningRequiredTech
```

### f15EagleCost

```solidity
uint256 f15EagleCost
```

### f15EagleRequiredInfrastructure

```solidity
uint256 f15EagleRequiredInfrastructure
```

### f15EagleRequiredTech

```solidity
uint256 f15EagleRequiredTech
```

### su30MkiCost

```solidity
uint256 su30MkiCost
```

### su30MkiRequiredInfrastructure

```solidity
uint256 su30MkiRequiredInfrastructure
```

### su30MkiRequiredTech

```solidity
uint256 su30MkiRequiredTech
```

### f22RaptorCost

```solidity
uint256 f22RaptorCost
```

### f22RaptorRequiredInfrastructure

```solidity
uint256 f22RaptorRequiredInfrastructure
```

### f22RaptorRequiredTech

```solidity
uint256 f22RaptorRequiredTech
```

### mint

```solidity
contract CountryMinter mint
```

### bomb

```solidity
contract BombersContract bomb
```

### res

```solidity
contract ResourcesContract res
```

### imp1

```solidity
contract ImprovementsContract1 imp1
```

### fight

```solidity
contract FightersContract fight
```

### fightMarket1

```solidity
contract FightersMarketplace1 fightMarket1
```

### settings

```solidity
function settings(address _countryMinter, address _bombers, address _fighters, address _fightersMarket1, address _treasury, address _infrastructure, address _resources, address _improvements1) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### idToOwnerFightersMarket

```solidity
mapping(uint256 => address) idToOwnerFightersMarket
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### updateCountryMinterAddress

```solidity
function updateCountryMinterAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateBombersAddress

```solidity
function updateBombersAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateFightersAddress

```solidity
function updateFightersAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateResourcesAddress

```solidity
function updateResourcesAddress(address newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovements1Address

```solidity
function updateImprovements1Address(address newAddress) public
```

_this function is only callable by the contract owner_

### updateF35LightningSpecs

```solidity
function updateF35LightningSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a F35 Lightning_

### getF35LightningSpecs

```solidity
function getF35LightningSpecs() public view returns (uint256, uint256, uint256)
```

### updateF15EagleSpecs

```solidity
function updateF15EagleSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a F15 Eagle_

### getF15EagleSpecs

```solidity
function getF15EagleSpecs() public view returns (uint256, uint256, uint256)
```

### updateSU30MkiSpecs

```solidity
function updateSU30MkiSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a SU30 Mki_

### getSU30MkiSpecs

```solidity
function getSU30MkiSpecs() public view returns (uint256, uint256, uint256)
```

### updateF22RaptorSpecs

```solidity
function updateF22RaptorSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

_this function is only callable by the contract owner
this function will be user to update the price, infrastructure requirement and tech requirement in order to purchase a F22_

### getF22RaptorSpecs

```solidity
function getF22RaptorSpecs() public view returns (uint256, uint256, uint256)
```

### buyF35Lightning

```solidity
function buyF35Lightning(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a F35 Lightning for their nation

_this is a public view function that will allow the caller to purchase a F35 Lightning for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getF35LightningCost

```solidity
function getF35LightningCost(uint256 id) public view returns (uint256)
```

### buyF15Eagle

```solidity
function buyF15Eagle(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a F15 Eagle for their nation

_this is a public view function that will allow the caller to purchase a F15 Eagle for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getF15EagleCost

```solidity
function getF15EagleCost(uint256 id) public view returns (uint256)
```

### buySu30Mki

```solidity
function buySu30Mki(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a Su30 Mki for their nation

_this is a public view function that will allow the caller to purchase a Su30 Mki for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getSu30MkiCost

```solidity
function getSu30MkiCost(uint256 id) public view returns (uint256)
```

### buyF22Raptor

```solidity
function buyF22Raptor(uint256 amount, uint256 id) public
```

this function allowes the caller to purchase a F22 Raptor for their nation

_this is a public view function that will allow the caller to purchase a F22 Raptor for their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | specifies the number of aircraft being purchased |
| id | uint256 | is the nation ID |

### getF22RaptorCost

```solidity
function getF22RaptorCost(uint256 id) public view returns (uint256)
```

## ForcesContract

this contract allows a nation owner to purchase soldiers, tanks and spies

_this contract inherits from the openzeppelin Ownable contract_

### spyCost

```solidity
uint256 spyCost
```

### countryMinter

```solidity
address countryMinter
```

### treasuryAddress

```solidity
address treasuryAddress
```

### aid

```solidity
address aid
```

### spyAddress

```solidity
address spyAddress
```

### cruiseMissile

```solidity
address cruiseMissile
```

### infrastructure

```solidity
address infrastructure
```

### resources

```solidity
address resources
```

### improvements1

```solidity
address improvements1
```

### improvements2

```solidity
address improvements2
```

### wonders1

```solidity
address wonders1
```

### nukeAddress

```solidity
address nukeAddress
```

### airBattle

```solidity
address airBattle
```

### groundBattle

```solidity
address groundBattle
```

### warAddress

```solidity
address warAddress
```

### keeper

```solidity
address keeper
```

### mint

```solidity
contract CountryMinter mint
```

### inf

```solidity
contract InfrastructureContract inf
```

### res

```solidity
contract ResourcesContract res
```

### won1

```solidity
contract WondersContract1 won1
```

### imp1

```solidity
contract ImprovementsContract1 imp1
```

### imp2

```solidity
contract ImprovementsContract2 imp2
```

### war

```solidity
contract WarContract war
```

### ground

```solidity
contract GroundBattleContract ground
```

### Forces

```solidity
struct Forces {
  uint256 numberOfSoldiers;
  uint256 defendingSoldiers;
  uint256 deployedSoldiers;
  uint256 soldierCasualties;
  uint256 numberOfTanks;
  uint256 defendingTanks;
  uint256 deployedTanks;
  uint256 numberOfSpies;
  bool nationExists;
}
```

### GroundBattleCasualties

```solidity
struct GroundBattleCasualties {
  uint256 soldierCasualties;
  uint256 tankCasualties;
}
```

### settings

```solidity
function settings(address _treasuryAddress, address _aid, address _spyAddress, address _cruiseMissile, address _nukeAddress, address _airBattle, address _groundBattle, address _warAddress) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings2

```solidity
function settings2(address _infrastructure, address _resources, address _improvements1, address _improvements2, address _wonders1, address _countryMinter, address _keeper) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### idToForces

```solidity
mapping(uint256 => struct ForcesContract.Forces) idToForces
```

### battlesToCalculate

```solidity
mapping(uint256 => uint256[]) battlesToCalculate
```

### idToCasualties

```solidity
mapping(uint256 => struct ForcesContract.GroundBattleCasualties) idToCasualties
```

### generateForces

```solidity
function generateForces(uint256 id) public
```

this function allows a nation to purchase forces once a country is minted

_this function is a public function but only callable from the country minter contact when a country is minted_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the nation being minted |

### updateInfrastructureContract

```solidity
function updateInfrastructureContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateResourcesContract

```solidity
function updateResourcesContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementsContract1

```solidity
function updateImprovementsContract1(address newAddress) public
```

_this function is only callable by the contract owner_

### onlyAidContract

```solidity
modifier onlyAidContract()
```

### onlySpyContract

```solidity
modifier onlySpyContract()
```

### onlyCruiseMissileContract

```solidity
modifier onlyCruiseMissileContract()
```

### onlyNukeContract

```solidity
modifier onlyNukeContract()
```

### onlyAirBattle

```solidity
modifier onlyAirBattle()
```

### onlyGroundBattle

```solidity
modifier onlyGroundBattle()
```

### onlyKeeperContract

```solidity
modifier onlyKeeperContract()
```

### buySoldiers

```solidity
function buySoldiers(uint256 amount, uint256 id) public
```

this function will allow a nation owner to purchase soldiers

_this is a public function that allows a nation owner to purchase soldiers_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of soldiers being purchased |
| id | uint256 | is the nation id of the nation being queried |

### getSoldierCost

```solidity
function getSoldierCost(uint256 id) public view returns (uint256)
```

this will return the cost of a soldier for a nation
access to iron and oil resources decrease the cost of soldiers

_this is a public view function that will retrun the cost of soldiers for a nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the soldier cost for that nation |

### sendSoldiers

```solidity
function sendSoldiers(uint256 idSender, uint256 idReciever, uint256 amount) public
```

this function will allow the aid contact to send soldiers in an aid package

_this function is only callable from the aid contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| idSender | uint256 | is the nation id of the aid sender |
| idReciever | uint256 | is the nation id of the aid reciever |
| amount | uint256 | is the amount of soldiers being sent |

### getDefendingSoldierCount

```solidity
function getDefendingSoldierCount(uint256 id) public view returns (uint256)
```

this function will return the number of defending soldiers for a nation

_this is a public view function that will return the amount of defending soldiers of a nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of defending soldiers for the queried nation |

### deployForces

```solidity
function deployForces(uint256 soldiersToDeploy, uint256 tanksToDeploy, uint256 id, uint256 warId) public
```

this function allows a nation owner to deploy soldiers to an active war

_this is a public function that will allow a nation woner to deploy soldiers to a war_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| soldiersToDeploy | uint256 | is the number of soldiers being deployed |
| tanksToDeploy | uint256 | is the number of tanks being deployed |
| id | uint256 | is the nation id of the nation deploying soldiers |
| warId | uint256 | is the id of the active war |

### getMaxDeployablePercentage

```solidity
function getMaxDeployablePercentage(uint256 id) public view returns (uint256)
```

this function returns the maximum percentage of a population that is deployable to war

_this is a public view function that will return the maximum percentage of a population that is deployable_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation deploying soldiers |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the maximum percentage of a nations population that is deployable |

### withdrawSoldiers

```solidity
function withdrawSoldiers(uint256 amountToWithdraw, uint256 id) public
```

this function lets a nation owner deploy troops from war

_this is a public function that allows a nation owner to withdraw deployed troops_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountToWithdraw | uint256 | is the amount of soldiers the nation owner is looking to withdraw |
| id | uint256 | is the nation id of the nation withdrawing soldeirs |

### decreaseDefendingSoldierCountFromNukeAttack

```solidity
function decreaseDefendingSoldierCountFromNukeAttack(uint256 id) public
```

this function is only callable from the nuke contract
this function will decrease the amount of soldiers from a nuke strike
a fallout shelter system will decrease the number of soldiers lost by 50%

_this is a public function only callable from the Nuke Contract that will decrease the number of soldiers during a nuke attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being attacked |

### getSoldierCount

```solidity
function getSoldierCount(uint256 id) public view returns (uint256 soldiers)
```

this function will return the number of soldiers a nation has

_this is a public view function that will return the number of soldiers for a nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| soldiers | uint256 | is the nations soldier count |

### getDeployedSoldierCount

```solidity
function getDeployedSoldierCount(uint256 id) public view returns (uint256 soldiers)
```

this function returns the amount of deployed solders a nation has

_this is a public view function that will return a nations deployed soldier count_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID for the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| soldiers | uint256 | is the number of deployed soldiers for that nation |

### getDeployedSoldierEfficiencyModifier

```solidity
function getDeployedSoldierEfficiencyModifier(uint256 id) public view returns (uint256)
```

this function will adjust the efficiency of a nations deployed soldiers
aluminium, coal, oil, pigs, barracks, guerilla camps all increase the efficiency od deployed soldiers

_this is a public view function that will adjust the efficiency of a nations deployed soldiers_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the percentage modifier for a nations deployed forces |

### getDefendingSoldierEfficiencyModifier

```solidity
function getDefendingSoldierEfficiencyModifier(uint256 id) public view returns (uint256)
```

this function will adjust the efficiency of a nations defending soldiers
aluminium, coal, oil, pigs, barracks, border fortifications and forward operating bases all increase the efficiency od defending soldiers

_this is a public view function that will adjust the efficiency of a nations defending soldiers_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the percentage modifier for a nations defending forces |

### decomissionSoldiers

```solidity
function decomissionSoldiers(uint256 amount, uint256 id) public
```

this function allows a nation owner to decomission soldiers

_this is a public function that allows a nation owner to decommission soldiers_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of soldiers being decomissioned |
| id | uint256 | is the nation ID of the nation |

### buyTanks

```solidity
function buyTanks(uint256 amount, uint256 id) public
```

this function allows a nation owner to buy tanks
tanks cost 40X what soldeirs cost a nation
factories reduce the cost of tanks 5% per factory

_this is a public function that allows a nation owner to buy tanks_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the number of tanks being purchased |
| id | uint256 | is the nation ID of the nation purchasing tanks |

### getMaxTankCount

```solidity
function getMaxTankCount(uint256 id) public view returns (uint256)
```

this function returns the maximum amount of tanks a nation can own
a nation's max tanks is the lesser of 10% of soldier efficiency or 8% of citizens

_this is a public view function that will return the maximum amount of tanks a nation can own_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the maximum amount of tanks that nation can own |

### getTankCost

```solidity
function getTankCost(uint256 id) public view returns (uint256)
```

the default cost of a tnak is soldier cost * 40
tank cost will be reduced by 5% for every factory owned

_this is a public view function that will return the cost a nation has to pay for tanks_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation buying tanks |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | cost is the cost per tank for a given nation |

### withdrawTanks

```solidity
function withdrawTanks(uint256 amountToWithdraw, uint256 id) public
```

### decreaseDefendingTankCount

```solidity
function decreaseDefendingTankCount(uint256 amount, uint256 id) public
```

this funtion will allow the spy contract to decrease the number of defending tanks in a spy attack

_this is a public view function that can only be called by the Spy Contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of tanks being decreased |
| id | uint256 | is the nation id of the nation being attacked |

### decreaseDefendingTankCountFromCruiseMissileContract

```solidity
function decreaseDefendingTankCountFromCruiseMissileContract(uint256 amount, uint256 id) public
```

this funtion will allow the cruise missile contact to decrease the number of tanks in a cruise missile attack

_this is a public function that can only be called from the cruise missile contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the number of tanks being decreased |
| id | uint256 | is the nation id of the nation being attacked |

### decreaseDefendingTankCountFromNukeContract

```solidity
function decreaseDefendingTankCountFromNukeContract(uint256 id) public
```

this funtion will allow the cruise missile contact to decrease the number of tanks in a nuke attack

_this is a public function that can only be called from the nuke contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being attacked |

### decreaseDefendingTankCountFromAirBattleContract

```solidity
function decreaseDefendingTankCountFromAirBattleContract(uint256 id, uint256 amountToDecrease) public
```

this funtion will allow the cruise missile contact to decrease the number of tanks in a bombing attack

_this is a public function that can only be called from the air battle contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being attacked |
| amountToDecrease | uint256 | is the number of tanks being decreased |

### getTankCount

```solidity
function getTankCount(uint256 id) public view returns (uint256 tanks)
```

this function will return the number of tanks for a nation

_this is a public view function that will return the number of tanks a nation has_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id for the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| tanks | uint256 | is the number of tanks for the nation being queried |

### getDeployedTankCount

```solidity
function getDeployedTankCount(uint256 id) public view returns (uint256 tanks)
```

this function will return the number of deployed tanks for a nation

_this is a public view function that will return the number of deployed tanks a nation has_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id for the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| tanks | uint256 | is the number of deployed tanks for the nation being queried |

### getDefendingTankCount

```solidity
function getDefendingTankCount(uint256 id) public view returns (uint256 tanks)
```

this function will return the number of defending tanks for a nation

_this is a public view function that will return the number of defending tanks a nation has_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id for the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| tanks | uint256 | is the number of defending tanks for the nation being queried |

### buySpies

```solidity
function buySpies(uint256 amount, uint256 id) public
```

this function will allow a natio nowner to purchase spies
you cannot buy more spies than the maximum amount for your nation

_this is a public function only callable by the nation owner that will purchase spies_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of spies being purchased |
| id | uint256 | is the nation id of the nation buying spies |

### updateSpyPrice

```solidity
function updateSpyPrice(uint256 newCost) public
```

### getMaxSpyCount

```solidity
function getMaxSpyCount(uint256 id) public view returns (uint256)
```

this function will return the maximum amount of spies a nation can own
the base max spy count for a nation is 50
intel agencies will increase the max number of spies by 100
a central intelligence agency wonder will increase the max number of spies by 250

_this is a public view function that will return the maximum amount of spies a given country can own_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id for the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the maximum number of spies for a given nation |

### decreaseAttackerSpyCount

```solidity
function decreaseAttackerSpyCount(uint256 id) public
```

this function will allow the spy contract to decrease the number of spies of an nation that is lost by the attacker during a spy attack

_this is a public function only callable from the Spy Contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation losing their spy when the attack fails |

### decreaseDefenderSpyCount

```solidity
function decreaseDefenderSpyCount(uint256 amount, uint256 id) public
```

this function will allow the spy contract to decrease the number of spies lost during a spy attack

_this is a public view function that allows the spy contract to decrease the number of spies of a nation in a spy attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the number of spies lost during the attack |
| id | uint256 | is the nation suffering losses during the spy attack |

### getSpyCount

```solidity
function getSpyCount(uint256 countryId) public view returns (uint256 count)
```

this function will return a nations current spy count

_this is a public view function that will return the current spy count for a nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the spy count for a given nation |

### getSpyPrice

```solidity
function getSpyPrice() public view returns (uint256)
```

### decreaseUnits

```solidity
function decreaseUnits(uint256 attackerSoldierLosses, uint256 attackerTankLosses, uint256 attackerId, uint256 defenderSoldierLosses, uint256 defenderTankLosses, uint256 defenderId) public
```

this function will decrease the number of losses of an attacker during a ground battle

_this is a public function only callable from the ground battle contract
this function will decrease the losses of an attacker during a ground battle_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| attackerSoldierLosses | uint256 | is the soldier losses for an attacker from a battle |
| attackerTankLosses | uint256 | is the tank losses for an attacker from a battle |
| attackerId | uint256 | is the nation ID of the nation suffering losses |
| defenderSoldierLosses | uint256 |  |
| defenderTankLosses | uint256 |  |
| defenderId | uint256 |  |

### increaseSoldierCasualties

```solidity
function increaseSoldierCasualties(uint256 id, uint256 amount) public
```

_this is a function for the development environment that will assist in testing wonders and improvements that are available after a certain number of casualties_

### getCasualties

```solidity
function getCasualties(uint256 id) public view returns (uint256, uint256)
```

this function will return a nations casualty count

_this is a public view function that will return a nations casualty count_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is a nation id for the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the soldier casualty count for a given nation |
| [1] | uint256 | uint256 is the tank casualty count for a given nation |

## MissilesContract

_this contract will allow a nation to purchase cruise missiles and nukes
this contract inherits from the openzeppelin ownable contract_

### cruiseMissileCost

```solidity
uint256 cruiseMissileCost
```

### defaultNukeCost

```solidity
uint256 defaultNukeCost
```

### nukeCost

```solidity
uint256 nukeCost
```

### countryMinter

```solidity
address countryMinter
```

### treasury

```solidity
address treasury
```

### spyAddress

```solidity
address spyAddress
```

### resources

```solidity
address resources
```

### improvements1

```solidity
address improvements1
```

### wonders1

```solidity
address wonders1
```

### wonders2

```solidity
address wonders2
```

### wonders4

```solidity
address wonders4
```

### nukeAddress

```solidity
address nukeAddress
```

### airBattle

```solidity
address airBattle
```

### countryinter

```solidity
address countryinter
```

### strength

```solidity
address strength
```

### keeper

```solidity
address keeper
```

### infrastructure

```solidity
address infrastructure
```

### mint

```solidity
contract CountryMinter mint
```

### inf

```solidity
contract InfrastructureContract inf
```

### res

```solidity
contract ResourcesContract res
```

### won1

```solidity
contract WondersContract1 won1
```

### won2

```solidity
contract WondersContract2 won2
```

### won4

```solidity
contract WondersContract4 won4
```

### imp1

```solidity
contract ImprovementsContract1 imp1
```

### imp2

```solidity
contract ImprovementsContract2 imp2
```

### war

```solidity
contract WarContract war
```

### tsy

```solidity
contract TreasuryContract tsy
```

### stren

```solidity
contract NationStrengthContract stren
```

### Missiles

```solidity
struct Missiles {
  uint256 cruiseMissiles;
  uint256 nuclearWeapons;
  uint256 nukesPurchasedToday;
}
```

### settings

```solidity
function settings(address _treasury, address _spyAddress, address _nukeAddress, address _airBattle, address _wonders2, address _strength, address _infrastructure) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings2

```solidity
function settings2(address _resources, address _improvements1, address _wonders1, address _wonders4, address _countryMinter, address _keeper) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### idToMissiles

```solidity
mapping(uint256 => struct MissilesContract.Missiles) idToMissiles
```

### generateMissiles

```solidity
function generateMissiles(uint256 id) public
```

### updateTreasuryContract

```solidity
function updateTreasuryContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateSpyContract

```solidity
function updateSpyContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateNukeContract

```solidity
function updateNukeContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateAirBattleContract

```solidity
function updateAirBattleContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateNationStrengthContract

```solidity
function updateNationStrengthContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateResourcesContract

```solidity
function updateResourcesContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementsContract1

```solidity
function updateImprovementsContract1(address newAddress) public
```

_this function is only callable by the contract owner_

### updateWondersContract1

```solidity
function updateWondersContract1(address newAddress) public
```

_this function is only callable by the contract owner_

### updateWondersContract2

```solidity
function updateWondersContract2(address newAddress) public
```

_this function is only callable by the contract owner_

### updateWondersContract4

```solidity
function updateWondersContract4(address newAddress) public
```

_this function is only callable by the contract owner_

### updateCountryMinter

```solidity
function updateCountryMinter(address newAddress) public
```

_this function is only callable by the contract owner_

### onlySpyContract

```solidity
modifier onlySpyContract()
```

### onlyNukeContract

```solidity
modifier onlyNukeContract()
```

### onlyAirBattle

```solidity
modifier onlyAirBattle()
```

### onlyKeeper

```solidity
modifier onlyKeeper()
```

### buyCruiseMissiles

```solidity
function buyCruiseMissiles(uint256 amount, uint256 id) public
```

this function allows a nation owner to purchase cruise missiles

_this function is a public function that will allow a nation owner to purchase cruise missiles_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of cruise missiles being purchased |
| id | uint256 | is the nation id of the nation buying cruise missiles |

### updateCruiseMissileCost

```solidity
function updateCruiseMissileCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### getCruiseMissileCost

```solidity
function getCruiseMissileCost(uint256 id) public view returns (uint256 cost)
```

this function will return the cost per cruise missile for a given nation

_this is a public view function that will return the cost per missiile of cruise missiles for a nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation purchasing missiles |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| cost | uint256 | is the cost per missile of cruise missiles for that nation |

### getCruiseMissileCount

```solidity
function getCruiseMissileCount(uint256 id) public view returns (uint256)
```

this function will return the number of cruise missiles a given nation owns

_this is a public view function that will return the number of cruise missile a nation owns_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of cruise missiles a given nation owns |

### decreaseCruiseMissileCount

```solidity
function decreaseCruiseMissileCount(uint256 amount, uint256 id) public
```

this function will decrease the number of cruise missiles lost during a spy attack

_this is a public function that will decrease the number of cruise missiles only callable from the spy contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | this is the number of missiles being destroyed |
| id | uint256 | this is the nation id of the nation being attacked |

### decreaseCruiseMissileCountFromNukeContract

```solidity
function decreaseCruiseMissileCountFromNukeContract(uint256 id) public
```

this function will decrease the number of cruise missiles lost during a nuke attack
a succesful nuke attack will destroy 35% of your nations cruise missiles
a fallout shelter system will reduce the number of missiles lost during a nuke attack to 25%

_this is a public function that will decrease the number of cruise missiles only callable from the nuke contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation being attacked |

### decreaseCruiseMissileCountFromAirBattleContract

```solidity
function decreaseCruiseMissileCountFromAirBattleContract(uint256 id, uint256 amountToDecrease) public
```

this function will decrease the number of cruise missiles lost during a bombing mission

_this is a public function only callable from the air battle contact_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation losing missiles from being attacked by bombers |
| amountToDecrease | uint256 | this is the number of cruise missiles beind destroyed by the bombing mission |

### buyNukes

```solidity
function buyNukes(uint256 id) public
```

this function allows a nation owner to purchase nukes
requirements to purchase nukes are 75 technology, 1000 infrastructure and access to uranium
a nation must also have a nation strength of 150,000 or a manhattan project to purchase nukes
a nation owner can only purchase one nuke per day (2 with a weapons research center)

_this is a public function that will allow a nation owner to purchase nukes_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation purchasing nukes |

### getNukeCost

```solidity
function getNukeCost(uint256 id) public view returns (uint256)
```

this function will return the cost per nuke for a nation
nukes cost 500,000 + (50,000 * current nuke count)

_this is a public function that will return the cost per nuke for a nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the cost per nuke for a given nation |

### updateDefaultNukeCost

```solidity
function updateDefaultNukeCost(uint256 newCost) public
```

### getDefaultNukeCost

```solidity
function getDefaultNukeCost() public view returns (uint256)
```

### getNukeCount

```solidity
function getNukeCount(uint256 id) public view returns (uint256)
```

this function retrurns a nations current nuke count

_this is a public view function that will retrun a nations current nuke count_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the current nuke count for a given nation |

### decreaseNukeCountFromNukeContract

```solidity
function decreaseNukeCountFromNukeContract(uint256 id) public
```

this function will decrease a nations nuke count by 1 when a nuke is launched

_this is a public function that will decrease the nuke count for a nation by 1 when a nuke is launched from the nuke contract
this function is only callable from the nuke contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation launching the nuke that will have its nuke count decreased by 1 |

### decreaseNukeCountFromSpyContract

```solidity
function decreaseNukeCountFromSpyContract(uint256 id) public
```

this function will decrease a nations nuke count if they are successfully attacked by a spy

_this is a public function that will decrease the nuke count for a nation when a successful spy attack is executed
this function is only callable from the spy contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation that was attacked and is losing a nuke |

### resetNukesPurchasedToday

```solidity
function resetNukesPurchasedToday() public
```

_this is a function that is only callable from the keeper contract
this function will reset the number of nukes purchased by each nation for that day back to 0
this function will be called daily_

## GroundBattleContract

_this contract inherits from the openzeppelin ownable contract
this contract inherits from the chainlink vrf contract_

### groundBattleId

```solidity
uint256 groundBattleId
```

### warAddress

```solidity
address warAddress
```

### infrastructure

```solidity
address infrastructure
```

### forces

```solidity
address forces
```

### treasury

```solidity
address treasury
```

### improvements2

```solidity
address improvements2
```

### improvements3

```solidity
address improvements3
```

### wonders3

```solidity
address wonders3
```

### wonders4

```solidity
address wonders4
```

### countryMinter

```solidity
address countryMinter
```

### taxes

```solidity
address taxes
```

### parameters

```solidity
address parameters
```

### todaysGroundBattles

```solidity
uint256[] todaysGroundBattles
```

### war

```solidity
contract WarContract war
```

### inf

```solidity
contract InfrastructureContract inf
```

### force

```solidity
contract ForcesContract force
```

### tsy

```solidity
contract TreasuryContract tsy
```

### imp2

```solidity
contract ImprovementsContract2 imp2
```

### imp3

```solidity
contract ImprovementsContract3 imp3
```

### won3

```solidity
contract WondersContract3 won3
```

### won4

```solidity
contract WondersContract4 won4
```

### mint

```solidity
contract CountryMinter mint
```

### tax

```solidity
contract TaxesContract tax
```

### param

```solidity
contract CountryParametersContract param
```

### GroundForcesToBattle

```solidity
struct GroundForcesToBattle {
  uint256 attackType;
  uint256 soldierCount;
  uint256 tankCount;
  uint256 strength;
  uint256 countryId;
  uint256 warId;
}
```

### BattleResults

```solidity
struct BattleResults {
  uint256 nationId;
  uint256 soldierLosses;
  uint256 tankLosses;
  uint256 defenderId;
  uint256 defenderSoldierLosses;
  uint256 defenderTankLosses;
}
```

### groundBattleIdToAttackerForces

```solidity
mapping(uint256 => struct GroundBattleContract.GroundForcesToBattle) groundBattleIdToAttackerForces
```

### groundBattleIdToDefenderForces

```solidity
mapping(uint256 => struct GroundBattleContract.GroundForcesToBattle) groundBattleIdToDefenderForces
```

### groundBattleIdToBattleAttackerResults

```solidity
mapping(uint256 => struct GroundBattleContract.BattleResults) groundBattleIdToBattleAttackerResults
```

### groundBattleIdToBattleDefenderResults

```solidity
mapping(uint256 => struct GroundBattleContract.BattleResults) groundBattleIdToBattleDefenderResults
```

### groundBattleIdToAtackerVictory

```solidity
mapping(uint256 => bool) groundBattleIdToAtackerVictory
```

### idToRecentBattles

```solidity
mapping(uint256 => uint256[]) idToRecentBattles
```

### s_requestIdToRequestIndex

```solidity
mapping(uint256 => uint256) s_requestIdToRequestIndex
```

### s_requestIndexToRandomWords

```solidity
mapping(uint256 => uint256[]) s_requestIndexToRandomWords
```

### randomNumbersRequested

```solidity
event randomNumbersRequested(uint256 requestId)
```

### randomNumbersFulfilled

```solidity
event randomNumbersFulfilled(uint256 randomResource1, uint256 randomResource2)
```

### battleResults

```solidity
event battleResults(uint256 battleId, uint256 attackSolderLosses, uint256 attackTankLosses, uint256 defenderSoldierLosses, uint256 defenderTankLosses)
```

### constructor

```solidity
constructor(address vrfCoordinatorV2, uint64 subscriptionId, bytes32 gasLane, uint32 callbackGasLimit) public
```

### settings

```solidity
function settings(address _warAddress, address _infrastructure, address _forces, address _treasury, address _countryMinter) public
```

### settings2

```solidity
function settings2(address _improvements2, address _improvements3, address _wonders3, address _wonders4, address _taxes, address _parameters) public
```

### updateWarContract

```solidity
function updateWarContract(address newAddress) public
```

### updateInfrastructureContract

```solidity
function updateInfrastructureContract(address newAddress) public
```

### updateForcesContract

```solidity
function updateForcesContract(address newAddress) public
```

### updateTreasuryContract

```solidity
function updateTreasuryContract(address newAddress) public
```

### updateImprovemetsContract2

```solidity
function updateImprovemetsContract2(address newAddress) public
```

### updateImprovemetsContract3

```solidity
function updateImprovemetsContract3(address newAddress) public
```

### updateWondersContract3

```solidity
function updateWondersContract3(address newAddress) public
```

### updateWondersContract4

```solidity
function updateWondersContract4(address newAddress) public
```

### battleOdds

```solidity
function battleOdds(uint256 _warId, uint256 attackerId) public view returns (uint256 attackerOdds, uint256 defenderOdds)
```

### groundAttack

```solidity
function groundAttack(uint256 warId, uint256 attackerId, uint256 defenderId, uint256 attackType) public
```

this contract allows nations at war to launch a ground attack against each other

_this is a public function callable only from a nation owner
this contract allows nations at war to launch a ground attack against each other_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| warId | uint256 | is the war id of the war between the 2 nations in the battle |
| attackerId | uint256 | is the nation id of the attacking nation |
| defenderId | uint256 | is the nation id of the defending nation |
| attackType | uint256 | 1. planned 2. standard 3. aggressive 4. bezerk |

### generateAttackerForcesStruct

```solidity
function generateAttackerForcesStruct(uint256 warId, uint256 battleId, uint256 attackerId, uint256 attackType) internal
```

### returnAttackerForcesStruct

```solidity
function returnAttackerForcesStruct(uint256 battleId) public view returns (uint256, uint256, uint256, uint256, uint256, uint256)
```

### generateDefenderForcesStruct

```solidity
function generateDefenderForcesStruct(uint256 warId, uint256 battleId, uint256 defenderId) internal
```

### returnDefenderForcesStruct

```solidity
function returnDefenderForcesStruct(uint256 battleId) public view returns (uint256, uint256, uint256, uint256, uint256)
```

### getAttackerForcesStrength

```solidity
function getAttackerForcesStrength(uint256 attackerId, uint256 warId) public view returns (uint256)
```

### getAttackingSoldierEfficiency

```solidity
function getAttackingSoldierEfficiency(uint256 attackerId, uint256 _warId) public view returns (uint256)
```

### getDefenderForcesStrength

```solidity
function getDefenderForcesStrength(uint256 defenderId, uint256 _warId) public view returns (uint256)
```

### getDefendingSoldierEfficiency

```solidity
function getDefendingSoldierEfficiency(uint256 id) public view returns (uint256)
```

### fulfillRequest

```solidity
function fulfillRequest(uint256 battleId) public
```

### fulfillRandomWords

```solidity
function fulfillRandomWords(uint256 requestId, uint256[] randomWords) internal
```

fulfillRandomness handles the VRF response. Your contract must
implement it. See "SECURITY CONSIDERATIONS" above for important
principles to keep in mind when implementing your fulfillRandomness
method.

_VRFConsumerBaseV2 expects its subcontracts to have a method with this
signature, and will call it once it has verified the proof
associated with the randomness. (It is triggered via a call to
rawFulfillRandomness, below.)_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | The Id initially returned by requestRandomness |
| randomWords | uint256[] | the VRF output expanded to the requested number of words |

### completeBattleSequence

```solidity
function completeBattleSequence(uint256 battleId, uint256 warId) internal
```

### returnBattleResults

```solidity
function returnBattleResults(uint256 battleId) public view returns (uint256, uint256, uint256, uint256, uint256, uint256)
```

### returnAttackVictorious

```solidity
function returnAttackVictorious(uint256 battleId) public view returns (bool)
```

### getPercentageLosses

```solidity
function getPercentageLosses(uint256 battleId) public view returns (uint256, uint256, uint256, uint256)
```

### getLoserPercentageLosses

```solidity
function getLoserPercentageLosses(uint256 battleId) public view returns (uint256, uint256)
```

### attackVictory

```solidity
function attackVictory(uint256 battleId) internal view returns (uint256, uint256, uint256, uint256)
```

### defenseVictory

```solidity
function defenseVictory(uint256 battleId) internal view returns (uint256, uint256, uint256, uint256)
```

### collectSpoils

```solidity
function collectSpoils(uint256 battleId, uint256 attackerId) public
```

## IWarBucks

### mintFromTreasury

```solidity
function mintFromTreasury(address account, uint256 amount) external
```

### burnFromTreasury

```solidity
function burnFromTreasury(address account, uint256 amount) external
```

## ImprovementsContract1

this contract will allow a nation owner to buy certain improvements

### treasury

```solidity
address treasury
```

### improvements2

```solidity
address improvements2
```

### improvements3

```solidity
address improvements3
```

### improvements4

```solidity
address improvements4
```

### wonders1

```solidity
address wonders1
```

### navy

```solidity
address navy
```

### additionalNavy

```solidity
address additionalNavy
```

### countryMinter

```solidity
address countryMinter
```

### infrastructure

```solidity
address infrastructure
```

### airportCost

```solidity
uint256 airportCost
```

### bankCost

```solidity
uint256 bankCost
```

### barracksCost

```solidity
uint256 barracksCost
```

### borderFortificationCost

```solidity
uint256 borderFortificationCost
```

### borderWallCost

```solidity
uint256 borderWallCost
```

### bunkerCost

```solidity
uint256 bunkerCost
```

### casinoCost

```solidity
uint256 casinoCost
```

### churchCost

```solidity
uint256 churchCost
```

### clinicCost

```solidity
uint256 clinicCost
```

### drydockCost

```solidity
uint256 drydockCost
```

### factoryCost

```solidity
uint256 factoryCost
```

### won1

```solidity
contract WondersContract1 won1
```

### mint

```solidity
contract CountryMinter mint
```

### tres

```solidity
contract TreasuryContract tres
```

### inf

```solidity
contract InfrastructureContract inf
```

### Improvements1

```solidity
struct Improvements1 {
  uint256 improvementCount;
  uint256 airportCount;
  uint256 bankCount;
  uint256 barracksCount;
  uint256 borderFortificationCount;
  uint256 borderWallCount;
  uint256 bunkerCount;
  uint256 casinoCount;
  uint256 churchCount;
  uint256 clinicCount;
  uint256 drydockCount;
  uint256 factoryCount;
}
```

### idToImprovements1

```solidity
mapping(uint256 => struct ImprovementsContract1.Improvements1) idToImprovements1
```

### settings

```solidity
function settings(address _treasury, address _improvements2, address _improvements3, address _improvements4, address _navy, address _additionalNavy, address _countryMinter, address _wonders1, address _infrastructure) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### approvedAddress

```solidity
modifier approvedAddress()
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementContractAddresses

```solidity
function updateImprovementContractAddresses(address _improvements2, address _improvements3, address _improvements4) public
```

_this function is only callable by the contract owner_

### updateNavyContractAddress

```solidity
function updateNavyContractAddress(address _navy) public
```

_this function is only callable by the contract owner_

### generateImprovements

```solidity
function generateImprovements(uint256 id) public
```

this function will allow each minted nation to buy imoprovements

_this function is only callable by the countryMinter contract
this function will initialize the struct to store the info about the minted nations improvements_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the nation being minted |

### updateAirportCost

```solidity
function updateAirportCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of an airport_

### updateBankCost

```solidity
function updateBankCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a bank_

### updateBarracksCost

```solidity
function updateBarracksCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a barracks_

### updateBorderFortificationCost

```solidity
function updateBorderFortificationCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a border fortification_

### updateBorderWallCost

```solidity
function updateBorderWallCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a border wall_

### updateBunkerCost

```solidity
function updateBunkerCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a bunker_

### updateCasinoCost

```solidity
function updateCasinoCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a casino_

### updateChurchCost

```solidity
function updateChurchCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a church_

### updateClinicCost

```solidity
function updateClinicCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a clinic_

### updateDrydockCost

```solidity
function updateDrydockCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a drydock_

### updateFactoryCost

```solidity
function updateFactoryCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a factory_

### getCost1

```solidity
function getCost1() public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

_this function will allow the caller to return the cost of an improvement_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | airportCost this will be the cost of an airport |
| [1] | uint256 | bankCost this will be the cost of a bank... |
| [2] | uint256 |  |
| [3] | uint256 |  |
| [4] | uint256 |  |
| [5] | uint256 |  |
| [6] | uint256 |  |
| [7] | uint256 |  |
| [8] | uint256 |  |
| [9] | uint256 |  |
| [10] | uint256 |  |

### getImprovementCount

```solidity
function getImprovementCount(uint256 id) public view returns (uint256 count)
```

this function will return the number of improvements a nation owns

_this is a public view function that will return the number of improvements a nation owns_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | this is the number of improvements for a given nation |

### updateImprovementCount

```solidity
function updateImprovementCount(uint256 id, uint256 newCount) public
```

this function will incrase the number of improvements for a nation when improvements are purchased

_this is a publiv function that is only callable from the other improvement contracts_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the ID for the nation purchasing improvements |
| newCount | uint256 | is the updated total of improvements for a given nation |

### checkCitzenCountForImprovementPurchase

```solidity
function checkCitzenCountForImprovementPurchase(uint256 id, uint256 amount) public view returns (bool)
```

### buyImprovement1

```solidity
function buyImprovement1(uint256 amount, uint256 countryId, uint256 improvementId) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 |  |
| countryId | uint256 |  |
| improvementId | uint256 | this will determine which improvement is being purchased 1 = airport 2 = bank 3 = barracks 4 = border fortification 5 = border wall 6 = bunker 7 = casino 8 = church 9 = clinic 10 = drydock 11 = factory |

### deleteImprovement1

```solidity
function deleteImprovement1(uint256 amount, uint256 countryId, uint256 improvementId) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 |  |
| countryId | uint256 |  |
| improvementId | uint256 | this will determine which improvement is being deleted 1 = airport 2 = bank 3 = barracks 4 = border fortification 5 = border wall 6 = bunker 7 = casino 8 = church 9 = clinic 10 = drydock 11 = factory |

### getAirportCount

```solidity
function getAirportCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of airports a nation owns

_this is a public view function that will return the number of airports for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of airports a given nation owns |

### getBarracksCount

```solidity
function getBarracksCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of barracks a nation owns

_this is a public view function that will return the number of barracks for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of barracks a given nation owns |

### getBorderFortificationCount

```solidity
function getBorderFortificationCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of border fortifications a nation owns

_this is a public view function that will return the number of border fortifications for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of border fortifications a given nation owns |

### getBorderWallCount

```solidity
function getBorderWallCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of border walls a nation owns

_this is a public view function that will return the number of border walls for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of border walls a given nation owns |

### getBankCount

```solidity
function getBankCount(uint256 countryId) public view returns (uint256)
```

this function will return the number of banks a nation owns

_this is a public view function that will return the number of banks for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | count is the number of banks a given nation owns |

### getBunkerCount

```solidity
function getBunkerCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of bunkers a nation owns

_this is a public view function that will return the number of bunkers for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of bunkers a given nation owns |

### getCasinoCount

```solidity
function getCasinoCount(uint256 countryId) public view returns (uint256)
```

this function will return the number of casinos a nation owns

_this is a public view function that will return the number of casinos for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | count is the number of casinos a given nation owns |

### getChurchCount

```solidity
function getChurchCount(uint256 countryId) public view returns (uint256)
```

this function will return the number of churches a nation owns

_this is a public view function that will return the number of churches for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | count is the number of churches a given nation owns |

### getDrydockCount

```solidity
function getDrydockCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of drydocks a nation owns

_this is a public view function that will return the number of drydocks for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of drydocks a given nation owns |

### getClinicCount

```solidity
function getClinicCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of clinics a nation owns

_this is a public view function that will return the number of clinics for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of clinics a given nation owns |

### getFactoryCount

```solidity
function getFactoryCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of factories a nation owns

_this is a public view function that will return the number of factories for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of factories a given nation owns |

## ImprovementsContract2

this contract will allow a nation owner to buy certain improvements

### treasury

```solidity
address treasury
```

### improvements1

```solidity
address improvements1
```

### forces

```solidity
address forces
```

### wonders1

```solidity
address wonders1
```

### countryMinter

```solidity
address countryMinter
```

### foreignMinistryCost

```solidity
uint256 foreignMinistryCost
```

### forwardOperatingBaseCost

```solidity
uint256 forwardOperatingBaseCost
```

### guerillaCampCost

```solidity
uint256 guerillaCampCost
```

### harborCost

```solidity
uint256 harborCost
```

### hospitalCost

```solidity
uint256 hospitalCost
```

### intelligenceAgencyCost

```solidity
uint256 intelligenceAgencyCost
```

### jailCost

```solidity
uint256 jailCost
```

### laborCampCost

```solidity
uint256 laborCampCost
```

### won1

```solidity
contract WondersContract1 won1
```

### mint

```solidity
contract CountryMinter mint
```

### tres

```solidity
contract TreasuryContract tres
```

### Improvements2

```solidity
struct Improvements2 {
  uint256 foreignMinistryCount;
  uint256 forwardOperatingBaseCount;
  uint256 guerillaCampCount;
  uint256 harborCount;
  uint256 hospitalCount;
  uint256 intelligenceAgencyCount;
  uint256 jailCount;
  uint256 laborCampCount;
}
```

### idToImprovements2

```solidity
mapping(uint256 => struct ImprovementsContract2.Improvements2) idToImprovements2
```

### settings

```solidity
function settings(address _treasury, address _forces, address _wonders1, address _countryMinter, address _improvements1) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _treasury) public
```

_this function is only callable by the contract owner_

### updateImprovementContract1Address

```solidity
function updateImprovementContract1Address(address _improvements1) public
```

_this function is only callable by the contract owner_

### updateWondersContract1Address

```solidity
function updateWondersContract1Address(address _wonders1) public
```

_this function is only callable by the contract owner_

### updateForcesAddress

```solidity
function updateForcesAddress(address _forces) public
```

_this function is only callable by the contract owner_

### generateImprovements

```solidity
function generateImprovements(uint256 id) public
```

this function will allow each minted nation to buy imoprovements

_this function is only callable by the countryMinter contract
this function will initialize the struct to store the info about the minted nations improvements_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the nation being minted |

### getCost2

```solidity
function getCost2() public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

_this function will allow the caller to return the cost of an improvement_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | foreignMinistryCost this will be the cost of a foreign ministry |
| [1] | uint256 | forwardOperatingBaseCost this will be the cost of a forward operating base... |
| [2] | uint256 |  |
| [3] | uint256 |  |
| [4] | uint256 |  |
| [5] | uint256 |  |
| [6] | uint256 |  |
| [7] | uint256 |  |

### updateForeignMinistryCost

```solidity
function updateForeignMinistryCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a foreign ministry_

### updateForwardOperatingBaseCost

```solidity
function updateForwardOperatingBaseCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a forward operating base_

### updateGuerillaCampCost

```solidity
function updateGuerillaCampCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a guerilla camp_

### updateHarborCost

```solidity
function updateHarborCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a harbor_

### updateHospitalCost

```solidity
function updateHospitalCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a hospital_

### updateIntelligenceAgencyCost

```solidity
function updateIntelligenceAgencyCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of an intel agency_

### updateJailCost

```solidity
function updateJailCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a jail_

### updateLaborCampCost

```solidity
function updateLaborCampCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a labor camp_

### buyImprovement2

```solidity
function buyImprovement2(uint256 amount, uint256 countryId, uint256 improvementId) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 |  |
| countryId | uint256 |  |
| improvementId | uint256 | this will determine which improvement is being purchased 1 = foreign ministry 2 = forward operating base 3 = guerilla camp 4 = harbor 5 = hospital 6 = intel agency 7 = jail 8 = labor camp |

### deleteImprovement2

```solidity
function deleteImprovement2(uint256 amount, uint256 countryId, uint256 improvementId) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 |  |
| countryId | uint256 |  |
| improvementId | uint256 | this will determine which improvement is being deleted 1 = foreign ministry 2 = forward operating base 3 = guerilla camp 4 = harbor 5 = hospital 6 = intel agency 7 = jail 8 = labor camp |

### getForeignMinistryCount

```solidity
function getForeignMinistryCount(uint256 countryId) public view returns (uint256)
```

this function will return the number of foreign ministries a nation owns

_this is a public view function that will return the number of foreign ministries for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | count is the number of foreign ministries a given nation owns |

### getForwardOperatingBaseCount

```solidity
function getForwardOperatingBaseCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of forward operating bases a nation owns

_this is a public view function that will return the number of forward operating bases for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of forward operating bases a given nation owns |

### getGuerillaCampCount

```solidity
function getGuerillaCampCount(uint256 countryId) public view returns (uint256)
```

this function will return the number of guerialls camps a nation owns

_this is a public view function that will return the number of guerilla camps for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | count is the number of guerilla camps a given nation owns |

### getHarborCount

```solidity
function getHarborCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of harbors a nation owns

_this is a public view function that will return the number of harbors for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of harbors a given nation owns |

### getHospitalCount

```solidity
function getHospitalCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of hospitals a nation owns

_this is a public view function that will return the number of hospitals for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of hospitals a given nation owns |

### getIntelAgencyCount

```solidity
function getIntelAgencyCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of intel agencies a nation owns

_this is a public view function that will return the number of intel agencies for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of intel agencies a given nation owns |

### getJailCount

```solidity
function getJailCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of jails a nation owns

_this is a public view function that will return the number of jails for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of jails a given nation owns |

### getLaborCampCount

```solidity
function getLaborCampCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of labor camps a nation owns

_this is a public view function that will return the number of labor camps for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of labor camps a given nation owns |

## ImprovementsContract4

this contract will allow a nation owner to buy certain improvements

### treasury

```solidity
address treasury
```

### improvements1

```solidity
address improvements1
```

### improvements2

```solidity
address improvements2
```

### forces

```solidity
address forces
```

### countryMinter

```solidity
address countryMinter
```

### missileDefenseCost

```solidity
uint256 missileDefenseCost
```

### munitionsFactoryCost

```solidity
uint256 munitionsFactoryCost
```

### navalAcademyCost

```solidity
uint256 navalAcademyCost
```

### navalConstructionYardCost

```solidity
uint256 navalConstructionYardCost
```

### won1

```solidity
contract WondersContract1 won1
```

### imp2

```solidity
contract ImprovementsContract2 imp2
```

### mint

```solidity
contract CountryMinter mint
```

### tres

```solidity
contract TreasuryContract tres
```

### Improvements4

```solidity
struct Improvements4 {
  uint256 missileDefenseCount;
  uint256 munitionsFactoryCount;
  uint256 navalAcademyCount;
  uint256 navalConstructionYardCount;
}
```

### idToImprovements4

```solidity
mapping(uint256 => struct ImprovementsContract4.Improvements4) idToImprovements4
```

### settings

```solidity
function settings(address _treasury, address _forces, address _improvements1, address _improvements2, address _countryMinter) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _newTreasuryAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementContract1Address

```solidity
function updateImprovementContract1Address(address _improvements1) public
```

_this function is only callable by the contract owner_

### updateImprovementContract2Address

```solidity
function updateImprovementContract2Address(address _improvements2) public
```

_this function is only callable by the contract owner_

### updateForcesAddress

```solidity
function updateForcesAddress(address _forces) public
```

_this function is only callable by the contract owner_

### generateImprovements

```solidity
function generateImprovements(uint256 id) public
```

this function will allow each minted nation to buy imoprovements

_this function is only callable by the countryMinter contract
this function will initialize the struct to store the info about the minted nations improvements_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the nation being minted |

### getCost4

```solidity
function getCost4() public view returns (uint256, uint256, uint256, uint256)
```

_this function will allow the caller to return the cost of an improvement_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | missileDefenseCost this will be the cost of a foreign ministry |
| [1] | uint256 | munitionsFactoryCost this will be the cost of a forward operating base... |
| [2] | uint256 |  |
| [3] | uint256 |  |

### updateMissileDefenseCost

```solidity
function updateMissileDefenseCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a missile defense_

### updateMunitionsFactoryCost

```solidity
function updateMunitionsFactoryCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a munitions factory_

### updateNavalAcademyCost

```solidity
function updateNavalAcademyCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of naval academy_

### updateNavalConstructionYardCost

```solidity
function updateNavalConstructionYardCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of naval construction yard_

### buyImprovement4

```solidity
function buyImprovement4(uint256 amount, uint256 countryId, uint256 improvementId) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 |  |
| countryId | uint256 |  |
| improvementId | uint256 | this will determine which improvement is being purchased 1 = missile defense 2 = munitions factory 3 = naval academy 4 = naval construction yard |

### deleteImprovement4

```solidity
function deleteImprovement4(uint256 amount, uint256 countryId, uint256 improvementId) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 |  |
| countryId | uint256 |  |
| improvementId | uint256 | this will determine which improvement is being deleted 1 = missile defense 2 = munitions factory 3 = naval academy 4 = naval construction yard |

### getMissileDefenseCount

```solidity
function getMissileDefenseCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of missile defenses a nation owns

_this is a public view function that will return the number of missile defenses for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of missile defenses a given nation owns |

### getMunitionsFactoryCount

```solidity
function getMunitionsFactoryCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of munitions factories a nation owns

_this is a public view function that will return the number of munitions factories for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of munitions factories a given nation owns |

### getNavalAcademyCount

```solidity
function getNavalAcademyCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of naval academies a nation owns

_this is a public view function that will return the number of naval academies for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of naval academies a given nation owns |

### getNavalConstructionYardCount

```solidity
function getNavalConstructionYardCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of naval construction yards a nation owns

_this is a public view function that will return the number of naval construction yards for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of naval construction yards a given nation owns |

## ImprovementsContract3

this contract will allow a nation owner to buy certain improvements

### treasury

```solidity
address treasury
```

### improvements1

```solidity
address improvements1
```

### improvements2

```solidity
address improvements2
```

### navy

```solidity
address navy
```

### additionalNavy

```solidity
address additionalNavy
```

### countryMinter

```solidity
address countryMinter
```

### officeOfPropagandaCost

```solidity
uint256 officeOfPropagandaCost
```

### policeHeadquartersCost

```solidity
uint256 policeHeadquartersCost
```

### prisonCost

```solidity
uint256 prisonCost
```

### radiationContainmentChamberCost

```solidity
uint256 radiationContainmentChamberCost
```

### redLightDistrictCost

```solidity
uint256 redLightDistrictCost
```

### rehabilitationFacilityCost

```solidity
uint256 rehabilitationFacilityCost
```

### satteliteCost

```solidity
uint256 satteliteCost
```

### schoolCost

```solidity
uint256 schoolCost
```

### shipyardCost

```solidity
uint256 shipyardCost
```

### stadiumCost

```solidity
uint256 stadiumCost
```

### universityCost

```solidity
uint256 universityCost
```

### mint

```solidity
contract CountryMinter mint
```

### tres

```solidity
contract TreasuryContract tres
```

### Improvements3

```solidity
struct Improvements3 {
  uint256 officeOfPropagandaCount;
  uint256 policeHeadquartersCount;
  uint256 prisonCount;
  uint256 radiationContainmentChamberCount;
  uint256 redLightDistrictCount;
  uint256 rehabilitationFacilityCount;
  uint256 satelliteCount;
  uint256 schoolCount;
  uint256 shipyardCount;
  uint256 stadiumCount;
  uint256 universityCount;
}
```

### idToImprovements3

```solidity
mapping(uint256 => struct ImprovementsContract3.Improvements3) idToImprovements3
```

### settings

```solidity
function settings(address _treasury, address _additionalNavy, address _improvements1, address _improvements2, address _countryMinter) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _treasury) public
```

_this function is only callable by the contract owner_

### updateImprovementContract1Address

```solidity
function updateImprovementContract1Address(address _improvements1) public
```

_this function is only callable by the contract owner_

### updateImprovementContract2Address

```solidity
function updateImprovementContract2Address(address _improvements2) public
```

_this function is only callable by the contract owner_

### updateNavyContractAddress

```solidity
function updateNavyContractAddress(address _navy) public
```

_this function is only callable by the contract owner_

### generateImprovements

```solidity
function generateImprovements(uint256 id) public
```

this function will allow each minted nation to buy imoprovements

_this function is only callable by the countryMinter contract
this function will initialize the struct to store the info about the minted nations improvements_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the nation being minted |

### getCost3

```solidity
function getCost3() public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

_this function will allow the caller to return the cost of an improvement_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | officeOfPropagandaCost this will be the cost of an office of propaganda |
| [1] | uint256 | policeHeadquartersCost this will be the cost of a police headquarters... |
| [2] | uint256 |  |
| [3] | uint256 |  |
| [4] | uint256 |  |
| [5] | uint256 |  |
| [6] | uint256 |  |
| [7] | uint256 |  |
| [8] | uint256 |  |
| [9] | uint256 |  |
| [10] | uint256 |  |

### updateOfficeOfPropagandaCost

```solidity
function updateOfficeOfPropagandaCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of an office of propaganda_

### updatePoliceHeadquartersCost

```solidity
function updatePoliceHeadquartersCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a police headquarters_

### updatePrisonCost

```solidity
function updatePrisonCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a prison_

### updateRadiationContainmentChamberCost

```solidity
function updateRadiationContainmentChamberCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a radiatiion containment chamber_

### updateRedLightDistrictCost

```solidity
function updateRedLightDistrictCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a red light district_

### updateRehabilitationFacilityCost

```solidity
function updateRehabilitationFacilityCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a rehab facility_

### updateSatelliteCost

```solidity
function updateSatelliteCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a satellite_

### updateSchoolCost

```solidity
function updateSchoolCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a school_

### updateShipyardCost

```solidity
function updateShipyardCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a shipyard_

### updateStadiumCost

```solidity
function updateStadiumCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a stadium_

### updateUniversityCost

```solidity
function updateUniversityCost(uint256 newPrice) public
```

_this function is only callable by the contract owner
this function will allow the owner of the contract to update the cost of a university_

### buyImprovement3

```solidity
function buyImprovement3(uint256 amount, uint256 countryId, uint256 improvementId) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 |  |
| countryId | uint256 |  |
| improvementId | uint256 | this will determine which improvement is being purchased 1 = office of propaganda 2 = police headquarters 3 = prison 4 = radiaton containment chambers 5 = red light district 6 = rehab facilities 7 = satellite 8 = school 9 = shipyard 10 = stadium 11 = university |

### deleteImprovement3

```solidity
function deleteImprovement3(uint256 amount, uint256 countryId, uint256 improvementId) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 |  |
| countryId | uint256 |  |
| improvementId | uint256 | this will determine which improvement is being deleted 1 = office of propaganda 2 = police headquarters 3 = prison 4 = radiaton containment chambers 5 = red light district 6 = rehab facilities 7 = satellite 8 = school 9 = shipyard 10 = stadium 11 = university |

### getOfficeOfPropagandaCount

```solidity
function getOfficeOfPropagandaCount(uint256 countryId) public view returns (uint256)
```

this function will return the number of roffices of propaganda a nation owns

_this is a public view function that will return the number of offices of propaganda for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | count is the number of offices of propaganda a given nation owns |

### getPoliceHeadquartersCount

```solidity
function getPoliceHeadquartersCount(uint256 countryId) public view returns (uint256)
```

this function will return the number of police headquuarters a nation owns

_this is a public view function that will return the number of police headquarters for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | count is the number of police headquarters a given nation owns |

### getPrisonCount

```solidity
function getPrisonCount(uint256 countryId) public view returns (uint256)
```

this function will return the number of prisons a nation owns

_this is a public view function that will return the number of prisons for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | count is the number of prisons a given nation owns |

### getRadiationContainmentChamberCount

```solidity
function getRadiationContainmentChamberCount(uint256 countryId) public view returns (uint256)
```

this function will return the number of radiation containment chambers a nation owns

_this is a public view function that will return the number of radiation containment chambers for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of radiation containment chambers a given nation owns |

### getRedLightDistrictCount

```solidity
function getRedLightDistrictCount(uint256 countryId) public view returns (uint256)
```

this function will return the number of red light districts a nation owns

_this is a public view function that will return the number of red light districts for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of red light districts a given nation owns |

### getRehabilitationFacilityCount

```solidity
function getRehabilitationFacilityCount(uint256 countryId) public view returns (uint256)
```

this function will return the number of rehab facilities a nation owns

_this is a public view function that will return the number of rehab facilities for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of rehab facilities a given nation owns |

### getSatelliteCount

```solidity
function getSatelliteCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of satellites a nation owns

_this is a public view function that will return the number of satellites for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of satellites a given nation owns |

### getSchoolCount

```solidity
function getSchoolCount(uint256 countryId) public view returns (uint256)
```

this function will return the number of schools a nation owns

_this is a public view function that will return the number of schools for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of schools a given nation owns |

### getShipyardCount

```solidity
function getShipyardCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of shipyards a nation owns

_this is a public view function that will return the number of shipyards for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of shipyards a given nation owns |

### getStadiumCount

```solidity
function getStadiumCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of stadiums a nation owns

_this is a public view function that will return the number of stadiums for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of stadiums a given nation owns |

### getUniversityCount

```solidity
function getUniversityCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of universities a nation owns

_this is a public view function that will return the number of universities for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of universities a given nation owns |

## InfrastructureContract

this contract will store a nations land, technology, infrastructure and tax rate

### countryMinter

```solidity
address countryMinter
```

### resources

```solidity
address resources
```

### infrastructureMarket

```solidity
address infrastructureMarket
```

### techMarket

```solidity
address techMarket
```

### landMarket

```solidity
address landMarket
```

### improvements1

```solidity
address improvements1
```

### improvements2

```solidity
address improvements2
```

### improvements3

```solidity
address improvements3
```

### improvements4

```solidity
address improvements4
```

### wonders1

```solidity
address wonders1
```

### wonders2

```solidity
address wonders2
```

### wonders3

```solidity
address wonders3
```

### wonders4

```solidity
address wonders4
```

### forces

```solidity
address forces
```

### treasury

```solidity
address treasury
```

### aid

```solidity
address aid
```

### parameters

```solidity
address parameters
```

### spyAddress

```solidity
address spyAddress
```

### taxes

```solidity
address taxes
```

### cruiseMissile

```solidity
address cruiseMissile
```

### nukeAddress

```solidity
address nukeAddress
```

### airBattle

```solidity
address airBattle
```

### groundBattle

```solidity
address groundBattle
```

### crime

```solidity
address crime
```

### bonusResources

```solidity
address bonusResources
```

### mint

```solidity
contract CountryMinter mint
```

### res

```solidity
contract ResourcesContract res
```

### imp1

```solidity
contract ImprovementsContract1 imp1
```

### imp2

```solidity
contract ImprovementsContract2 imp2
```

### imp3

```solidity
contract ImprovementsContract3 imp3
```

### imp4

```solidity
contract ImprovementsContract4 imp4
```

### won1

```solidity
contract WondersContract1 won1
```

### won3

```solidity
contract WondersContract3 won3
```

### won4

```solidity
contract WondersContract4 won4
```

### crim

```solidity
contract CrimeContract crim
```

### forc

```solidity
contract ForcesContract forc
```

### bonus

```solidity
contract BonusResourcesContract bonus
```

### Infrastructure

```solidity
struct Infrastructure {
  uint256 landArea;
  uint256 technologyCount;
  uint256 infrastructureCount;
  uint256 taxRate;
  bool collectionNeededToChangeRate;
}
```

### idToInfrastructure

```solidity
mapping(uint256 => struct InfrastructureContract.Infrastructure) idToInfrastructure
```

### idToOwnerInfrastructure

```solidity
mapping(uint256 => address) idToOwnerInfrastructure
```

### settings1

```solidity
function settings1(address _resources, address _improvements1, address _improvements2, address _improvements3, address _improvements4, address _infrastructureMarket, address _techMarket, address _landMarket, address _bonusResources) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings2

```solidity
function settings2(address _wonders1, address _wonders2, address _wonders3, address _wonders4, address _treasury, address _parameters, address _forces, address _aid) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings3

```solidity
function settings3(address _spyAddress, address _tax, address _cruiseMissile, address _nukeAddress, address _airBattle, address _groundBattle, address _countryMinter, address _crime) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### onlySpyContract

```solidity
modifier onlySpyContract()
```

### onlyTaxesContract

```solidity
modifier onlyTaxesContract()
```

### onlyCruiseMissileContract

```solidity
modifier onlyCruiseMissileContract()
```

### onlyNukeContract

```solidity
modifier onlyNukeContract()
```

### onlyAirBattle

```solidity
modifier onlyAirBattle()
```

### onlyGroundBattle

```solidity
modifier onlyGroundBattle()
```

### onlyInfrastructureMarket

```solidity
modifier onlyInfrastructureMarket()
```

### onlyTechMarket

```solidity
modifier onlyTechMarket()
```

### onlyLandMarket

```solidity
modifier onlyLandMarket()
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### generateInfrastructure

```solidity
function generateInfrastructure(uint256 id) public
```

this function allows this contract to store info about a nations infrastructure

_this function is only callable by the countryMinter contract
this function will initialize the struct to store the info about the minted nations infrastructure_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the nation being minted |

### increaseInfrastructureFromMarket

```solidity
function increaseInfrastructureFromMarket(uint256 id, uint256 amount) public
```

this function will increase a nations infrastructure when purchased in the market contract

_this function is only callable from the infrastructure market contract
this function will increase a nations infrastructure when purchased in the market contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation purchasing infrastructure |
| amount | uint256 | is the amount of infrastructure being purchased |

### decreaseInfrastructureFromMarket

```solidity
function decreaseInfrastructureFromMarket(uint256 id, uint256 amount) public
```

this function will allow a nation owner to sell infrastructure

_this is a public function only callable from the infrastructure market contract
this function will allow a nation owner to sell infrastructure_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation selling infrastructure |
| amount | uint256 | this is the amount of infrastructure being sold |

### increaseTechnologyFromMarket

```solidity
function increaseTechnologyFromMarket(uint256 id, uint256 amount) public
```

this function will increase technology when technology is purchased

_this is a public function only callable from the technology market contract
this function will increase the technology count when technology is purchased_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation purchasing technology |
| amount | uint256 | this is the amount of technology being purchased |

### decreaseTechnologyFromMarket

```solidity
function decreaseTechnologyFromMarket(uint256 id, uint256 amount) public
```

this function will allow a nation owner to sell technology

_this is a public function only callable from the technology market contract
this function will allow a nation owner to sell technology_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation selling technology |
| amount | uint256 | this is the amount of technology being sold |

### increaseLandCountFromMarket

```solidity
function increaseLandCountFromMarket(uint256 id, uint256 amount) public
```

this function will increase land area when land is purchased

_this is a public function only callable from the land market contract
this function will increase the land area count when land is purchased_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation purchasing land |
| amount | uint256 | this is the amount of land being purchased |

### decreaseLandCountFromMarket

```solidity
function decreaseLandCountFromMarket(uint256 id, uint256 amount) public
```

this function will allow a nation owner to sell land

_this is a public function only callable from the land market contract
this function will allow a nation owner to sell land_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation selling land |
| amount | uint256 | this is the amount of land being sold |

### getAreaOfInfluence

```solidity
function getAreaOfInfluence(uint256 id) public view returns (uint256)
```

this function will return a given nations area of influence as a multiple of their land area
coal will increase area of influence 15%
rubber will increase area of influence 20%
spices will increase area of influence 8%
an agriculture development program will increase area of influence 15%

_this is a public view function that will return a nations area of influence from a given land area_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the given nations area of influence |

### sellLand

```solidity
function sellLand(uint256 id, uint256 amount) public
```

this function will allow a nation owner to sell land
land can be sold for 100/mile (300 with rubber)

_this is a public function only callable from a nation owner
this function will allow a nation owner to sell land_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation selling land |
| amount | uint256 | is the amount of land being sold |

### onlyAidContract

```solidity
modifier onlyAidContract()
```

### sendTech

```solidity
function sendTech(uint256 idSender, uint256 idReciever, uint256 amount) public
```

this function will send the technology when an aid proposal is accepted

_this is a public function only callable from the aid contract
this function will send the technology when an aid proposal is accepted_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| idSender | uint256 | is the nation id of the sender of the technology aid |
| idReciever | uint256 | is the nation id of the recipient of technology aid |
| amount | uint256 | is the amount of technology being sent |

### getLandCount

```solidity
function getLandCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the amount of land a nation has

_this is a public view function that will return the amount of land a nation has_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the nation ID of the country being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the amount of land area for a given country |

### decreaseLandCount

```solidity
function decreaseLandCount(uint256 countryId, uint256 amount) public
```

this function will deacrease land area after a succesfuls spy attack

_this is a public function that is only callable from the spy contract
this function will decrease land area after a successful spy attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the country if of the nation losing land in the attack |
| amount | uint256 | is the amount of land being lost in the attack |

### decreaseLandCountFromNukeContract

```solidity
function decreaseLandCountFromNukeContract(uint256 countryId, uint256 percentage) public
```

this function will decrease the amount of a nations land when attacked by a nuke
the maximum amount of land that can be lost is 150 miles

_this is a public function that will decrease a nations land when attacked by a nuke
this function is only callable by the nuke contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the nation ID of the nation being attacked |
| percentage | uint256 | this is the percentage of a nations land being lost |

### increaseLandCountFromSpyContract

```solidity
function increaseLandCountFromSpyContract(uint256 countryId, uint256 amount) public
```

this function will increase an attacking nations land after a successful spy attack

_this is a public function only callable from the spy contract
this function will increase a attacking nations land after a successful spy attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the nation gaining technology |
| amount | uint256 | is the amount of land area being gained |

### getTechnologyCount

```solidity
function getTechnologyCount(uint256 countryId) public view returns (uint256 count)
```

this function will return the amount of technology a nation has

_this is a public view function that will retrun the amount of technology a nation has_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the tech amount for a given nation |

### decreaseTechCountFromSpyContract

```solidity
function decreaseTechCountFromSpyContract(uint256 countryId, uint256 amount) public
```

this function will decrease a nations tech after a succesful spy attack

_this is a public function only callable from the spy contract
this function will decrease the amount of tech for a nation after a succesful spy attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the nation ID of the nation being attacked |
| amount | uint256 | is the amount of technology a nation is losing in the attack |

### decreaseTechCountFromCruiseMissileContract

```solidity
function decreaseTechCountFromCruiseMissileContract(uint256 countryId, uint256 amount) public
```

this function will decrease a nations tech after a succesful cruise missile attack

_this is a public function only callable from the cruise missile contract
this function will decrease the amount of tech for a nation after a succesful cruise missile attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the nation ID of the nation being attacked |
| amount | uint256 | is the amount of technology a nation is losing in the attack |

### decreaseTechCountFromNukeContract

```solidity
function decreaseTechCountFromNukeContract(uint256 countryId, uint256 percentage) public
```

this function will decrease a nations tech after a succesful nuke attack
the maximum amount of tech a nation can lose in an attack is 50

_this is a public function only callable from the nuke contract
this function will decrease the amount of tech for a nation after a succesful nuke attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the nation ID of the nation being attacked |
| percentage | uint256 | is the percentage of a nations technology a nation is losing in the attack |

### increaseTechCountFromSpyContract

```solidity
function increaseTechCountFromSpyContract(uint256 countryId, uint256 amount) public
```

this function will increase a nations technology from a succesful spy attack

_this is a public function that is only callable from the spy contract
this function will increase an attacking nations tech after a succesful spy attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the attacking nation gaining tech from the attack |
| amount | uint256 | is the amount of tech being gained |

### getInfrastructureCount

```solidity
function getInfrastructureCount(uint256 countryId) public view returns (uint256 count)
```

this function will return a nations infrastructure count

_this is a public view function that will return the amount of infrastructure for a nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the country being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the amount of technology for a given nation |

### decreaseInfrastructureCountFromSpyContract

```solidity
function decreaseInfrastructureCountFromSpyContract(uint256 countryId, uint256 amount) public
```

this function will decrease a nations infrastrucure after a succesful spy attack

_this is a public function only callable from the spy contract
this function will decrease a nations infrastructure amount after a succesful spy attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the nationId of the nation losing infrastructure |
| amount | uint256 | this is the amount of infrastructure being lost |

### decreaseInfrastructureCountFromCruiseMissileContract

```solidity
function decreaseInfrastructureCountFromCruiseMissileContract(uint256 countryId, uint256 amountToDecrease) public
```

this function will decrease the amount of technology lost in a cruise missile attack

_this is a public view function that is only callable from the cruise missile contract
this function will decrease the amount of technology lost in a cruise missile attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | this is the nation id of the country being queried |
| amountToDecrease | uint256 | this is the amount of infrastructure being decreased |

### decreaseInfrastructureCountFromNukeContract

```solidity
function decreaseInfrastructureCountFromNukeContract(uint256 defenderId, uint256 attackerId, uint256 percentage) public
```

this function will decrease the amount of a nations infrastructure after a nuke attack
the maximum amount of infrastructure a nation can lose in a nuke strike is 150
defender bunkers will decrease the amount of damage in a succesful nuke attack
attacker munitions factories will increase the amount of damage of a succesful nuke attack

_this is a public function only callable from the nuke contract
this function will decrease the amount of a nations infrastructure after a nuke attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| defenderId | uint256 | is the defending nation in a nuke strike |
| attackerId | uint256 | is an attacking nation in a nuke strike |
| percentage | uint256 | is the percentage of infrastructure being lost before modifiers (defender bunkers and attacker munitions factories) |

### decreaseInfrastructureCountFromAirBattleContract

```solidity
function decreaseInfrastructureCountFromAirBattleContract(uint256 countryId, uint256 amountToDecrease) public
```

this function will decrease a nations infrastructure lost in a bombing attack

_this is a public function only callable from the air battle contract 
this function will decrease a nations infrastructure lost in a bombing attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the country losing infrastructure |
| amountToDecrease | uint256 | is the amount of infrastructure being lost |

### increaseInfrastructureCountFromSpyContract

```solidity
function increaseInfrastructureCountFromSpyContract(uint256 countryId, uint256 amount) public
```

this function will decrease increase the amount of infrastructure for an attacker in a succesful spy attack

_this is a public function only callable from the spy contract
this function will decrease increase the amount of infrastructure for an attacker in a succesful spy attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID for the nation gaining infrastructure in the attack |
| amount | uint256 | is the amount of infrastructre being gained |

### getTaxRate

```solidity
function getTaxRate(uint256 id) public view returns (uint256 taxPercentage)
```

this function will return the tax rate which a nation taxes their citizens at

_this is a public view function that will return a nations tax rate at which they tax their citizens_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being queried |

### setTaxRate

```solidity
function setTaxRate(uint256 id, uint256 newTaxRate) public
```

this function will allow a nation owner to set their nations tax rate
a tax rate can be between 15% and 28%
a tax rate can be 30% with a social security wonder

_this is a public function only vallable by a nation owner
this function will allow a nation owner to set their nations tax rate_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation changing its tax rate |
| newTaxRate | uint256 | is the new tax rate for a nation |

### setTaxRateFromSpyContract

```solidity
function setTaxRateFromSpyContract(uint256 id, uint256 newTaxRate) public
```

this function will reset a nations tax rate after a succesful spy attack

_this is a public function only callable from the spy contract
this function will reset a nations tax rate after a succesful spy attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation ID for the nation being attacked and getting its tax rate changed |
| newTaxRate | uint256 | is the new tax rate for the nation |

### toggleCollectionNeededToChangeRate

```solidity
function toggleCollectionNeededToChangeRate(uint256 id) public
```

this function will toggle the collection needed to change tax rate to true
when a nation is blockaded it will need to either break the blockade or collect taxes at a reduced rate to be able to change tax rate

_this is a public function only callable from the taxes contract
this function will toggle the collection needed to change tax rate to true_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation toggleing the collection needed parameter |

### checkIfCollectionNeededToChangeRate

```solidity
function checkIfCollectionNeededToChangeRate(uint256 id) public view returns (bool)
```

this function will retrun true if a nation needs to collect taxes in order to change its tax rate

_this is a public view function that will return true if a nation needs to collect taxes in order to change its tax rate_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool is the boolean value whether a nation needs to collect taxes in order to change its tax rate |

### getTotalPopulationCount

```solidity
function getTotalPopulationCount(uint256 id) public view returns (uint256)
```

this function will return a nation population count
a nations base populaton is a nation infrastructure count * 8
a nations population is increased by cattle, fish, pigs, sugar, wheat, affluent population and decreased by border walls

_this is public view function that will return a nations total population count_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is a nations total population |

### getAdditionalPopulationModifierPoints

```solidity
function getAdditionalPopulationModifierPoints(uint256 id) internal view returns (uint256)
```

this function will return additonal population percentage modifiers for the above function
a nations population is increased by clinics, hospitals, disaster relief agencies, national environmental office, national research lab and universal healthcare

_this is an internal view function that will be called by the above function
this function will return additonal population percentage modifiers for the above function_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the additional percentage modifiers for the above function |

### getTaxablePopulationCount

```solidity
function getTaxablePopulationCount(uint256 id) public view returns (uint256)
```

this function will return a nations taxable population
a nations total population consists of citizens, soldiers and criminals
only citizens pay taxes

_this is public view function that will return a nations taxable population_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the given nations total taxable population |

### transferLandAndInfrastructure

```solidity
function transferLandAndInfrastructure(uint256 landMiles, uint256 infrastructureLevels, uint256 attackerId, uint256 defenderId) public
```

this function will transfer land and infrastructure lost during a ground battle

_this is a public function only callable from the ground battle contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| landMiles | uint256 | is the amount of land being won |
| infrastructureLevels | uint256 | is the amount of infrastructure being won |
| attackerId | uint256 | is the ID of the attack nation |
| defenderId | uint256 | is the ID of the defending nation |

## InfrastructureMarketContract

this contract will allow a nation owner to buy Infrastructure

### countryMinter

```solidity
address countryMinter
```

### resources

```solidity
address resources
```

### infrastructure

```solidity
address infrastructure
```

### improvements1

```solidity
address improvements1
```

### wonders2

```solidity
address wonders2
```

### wonders3

```solidity
address wonders3
```

### treasury

```solidity
address treasury
```

### parameters

```solidity
address parameters
```

### bonusResources

```solidity
address bonusResources
```

### mint

```solidity
contract CountryMinter mint
```

### res

```solidity
contract ResourcesContract res
```

### imp1

```solidity
contract ImprovementsContract1 imp1
```

### won2

```solidity
contract WondersContract2 won2
```

### won3

```solidity
contract WondersContract3 won3
```

### param

```solidity
contract CountryParametersContract param
```

### inf

```solidity
contract InfrastructureContract inf
```

### tsy

```solidity
contract TreasuryContract tsy
```

### bonus

```solidity
contract BonusResourcesContract bonus
```

### settings

```solidity
function settings(address _resources, address _parameters, address _improvements1, address _countryMinter, address _wonders2, address _wonders3, address _treasury, address _infrastructure, address _bonusResources) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### buyInfrastructure

```solidity
function buyInfrastructure(uint256 id, uint256 buyAmount) public
```

this function will allow a nation owner to purchase infrastructure

_this is a public view function that will allow a nation owner to buy infrastructure
this function is only callable by the nation owner_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation purchasing infrastructure |
| buyAmount | uint256 | is the amount of infrastructure being purchased |

### getInfrastructureCost

```solidity
function getInfrastructureCost(uint256 id, uint256 buyAmount) public view returns (uint256)
```

this function will return the cost of an infrastructure purchase

_this is a public view function that will return the cost of an infrastructure purchase
this function multiplies the cost per level by the purchases amount_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation buying infrastructure |
| buyAmount | uint256 | this is the amount of infrastructure being purchased |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the cost of the purchase |

### getInfrastructureCostPerLevel

```solidity
function getInfrastructureCostPerLevel(uint256 id) public view returns (uint256)
```

this function will return the cost of an infrastructure purchase per level
cartain modifiers in the following functions will reduce the cost of infrastructure

_this is a public view functon that will return the infrastructure cost per level_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id making the purchase |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the cost per level of an infrastructure purchase |

### getInfrastructureCostMultiplier1

```solidity
function getInfrastructureCostMultiplier1(uint256 id) public view returns (uint256)
```

this function is one of three functions that will adjust the cost of infrastructure lower based on a nations resources, improvements and wonders
lumber will reduce the cost of infrastructure by 6%
iron will reduce the cost of infrastructure by 5%
marble will reduce the cost of infrastructure by 10%

_this function is one of three functions that will adjust the cost of infrastructure lower
this function is a public view function that will get called when infrasturcture is quoted or purchased_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this will be the multiplier reductions from this formula |

### getInfrastructureCostMultiplier2

```solidity
function getInfrastructureCostMultiplier2(uint256 id) public view returns (uint256)
```

this function is the second of three functions that will adjust the cost of infrastructure lower based on a nations resources, improvements and wonders
rubber will reduce the cost of infrastructure by 3%
construction will reduce the cost of infrastructure by 5%
an interstate system will reduce the cost of infrastructure by 8%
certain accomodative governements will reduce the cost of infrastructure by 5%
factories without a scientific development center will reduce the cost of infrastructure by 8% and 10% with a scientific development center

_this function is the second of three functions that will adjust the cost of infrastructure lower
this function is a public view function that will get called when infrasturcture is quoted or purchased_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this will be the multiplier reductions from this formula |

### getInfrastructureCostMultiplier3

```solidity
function getInfrastructureCostMultiplier3(uint256 id) public view returns (uint256)
```

this function is the third of three functions that will adjust the cost of infrastructure lower based on a nations resources, improvements and wonders
aluminium will reduce the cost of infrastructure by 7%
coal will reduce the cost of infrastructure by 4%
steel will reduce the cost of infrastructure by 2%
asphalt will reduce the cost of infrastructure by 5%

_this function is the third of three functions that will adjust the cost of infrastructure lower
this function is a public view function that will get called when infrasturcture is quoted or purchased_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this will be the multiplier reductions from this formula |

### checkAccomodativeGovernment

```solidity
function checkAccomodativeGovernment(uint256 countryId) public view returns (bool)
```

this function will check if the given nation has a governemnt type that accomodate a lower cost of infrastructure

_this is a public view function that will return a boolean value if a nations government type accomodates a reduced infrastructure cost_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation ID of the country being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation's government type accomodates a lower infrastructure cost |

### destroyInfrastructure

```solidity
function destroyInfrastructure(uint256 id, uint256 amount) public
```

this function will allow a nation owner to destroy infrastructure

_this is a public function callable by the nation owner 
this function will allow a nation owner to destroy infrastructure_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation destroying infrastructure |
| amount | uint256 | this is the amount of infrastructure being destroyed |

## KeeperContract

_this contract will allow the chainlink keeper to maintain the game clock that resets everal parameters daily_

### nukes

```solidity
address nukes
```

### aidContract

```solidity
address aidContract
```

### warContract

```solidity
address warContract
```

### treasury

```solidity
address treasury
```

### missiles

```solidity
address missiles
```

### navalActions

```solidity
address navalActions
```

### parameters

```solidity
address parameters
```

### nuke

```solidity
contract NukeContract nuke
```

### aid

```solidity
contract AidContract aid
```

### war

```solidity
contract WarContract war
```

### tres

```solidity
contract TreasuryContract tres
```

### miss

```solidity
contract MissilesContract miss
```

### navAct

```solidity
contract NavalActionsContract navAct
```

### params

```solidity
contract CountryParametersContract params
```

### settings

```solidity
function settings(address _nukes, address _aid, address _war, address _treasury, address _missiles, address _navalActions, address _parameters) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### keeperFunctionToCall

```solidity
function keeperFunctionToCall() public
```

_this functon will be called by the chainlink keeper_

### keeperFunctionToCallManually

```solidity
function keeperFunctionToCallManually() public
```

_this function can be called by the contract owner in the event the keeper fails_

### shiftNukeDays

```solidity
function shiftNukeDays() internal
```

### resetAidProposals

```solidity
function resetAidProposals() internal
```

### resetAidProposalsByOwner

```solidity
function resetAidProposalsByOwner() public
```

### decremenWarDays

```solidity
function decremenWarDays() internal
```

### decremenWarDaysByOwner

```solidity
function decremenWarDaysByOwner() public
```

### resetCruiseMissileLaunches

```solidity
function resetCruiseMissileLaunches() internal
```

### incrementDaysSince

```solidity
function incrementDaysSince() internal
```

### resetNukesPurchasedToday

```solidity
function resetNukesPurchasedToday() internal
```

### resetNukesPurchasedTodayByOwner

```solidity
function resetNukesPurchasedTodayByOwner() public
```

### resetActionsToday

```solidity
function resetActionsToday() internal
```

### resetActionsTodayByOwner

```solidity
function resetActionsTodayByOwner() public
```

### incrementDaysSinceForParameters

```solidity
function incrementDaysSinceForParameters() internal
```

### incrementDaysSinceForParametersByOwner

```solidity
function incrementDaysSinceForParametersByOwner() public
```

### resetDeployments

```solidity
function resetDeployments() public
```

### resetDeploymentsByOwner

```solidity
function resetDeploymentsByOwner() public
```

## LandMarketContract

this contract will allow a nation owner to purchase land

_this contract inherits from openzeppelin's ownable contract_

### countryMinter

```solidity
address countryMinter
```

### resources

```solidity
address resources
```

### infrastructure

```solidity
address infrastructure
```

### treasury

```solidity
address treasury
```

### mint

```solidity
contract CountryMinter mint
```

### res

```solidity
contract ResourcesContract res
```

### inf

```solidity
contract InfrastructureContract inf
```

### tsy

```solidity
contract TreasuryContract tsy
```

### settings

```solidity
function settings(address _resources, address _countryMinter, address _infrastructure, address _treasury) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### buyLand

```solidity
function buyLand(uint256 id, uint256 amount) public
```

this function will allow a nation owner to purchase land

_this is a public view function that will allow a nation owner to buy land
this function is only callable by the nation owner_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation purchasing land |
| amount | uint256 | is the amount of land being purchased |

### getLandCost

```solidity
function getLandCost(uint256 id, uint256 amount) public view returns (uint256)
```

this function will return the cost of a land purchase

_this is a public view function that will return the cost of a land purchase
this function multiplies the cost per level by the purchases amount_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation buying land |
| amount | uint256 | this is the amount of land being purchased |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the cost of the purchase |

### getLandCostPerMile

```solidity
function getLandCostPerMile(uint256 id) public view returns (uint256)
```

this function will return the cost of land per mile for a nation
cartain modifiers in the following functions will reduce the cost of land

_this is a public view functon that will return the land cost per mile_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id making the purchase |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the cost per level of a land purchase |

### getLandPriceMultiplier

```solidity
function getLandPriceMultiplier(uint256 id) public view returns (uint256)
```

this function will adjust the cost of land lower based on a nations resources, improvements and wonders
cattle will reduce the cost of land by 10%
fish will reduce the cost of land by 5%
rubber will reduce the cost of land by 10%

_this function  will adjust the cost of land lower
this function is a public view function that will get called when land is quoted or purchased_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this will be the multiplier reductions from this formula |

### destroyLand

```solidity
function destroyLand(uint256 id, uint256 amount) public
```

this function will allow a nation owner to destroy land

_this is a public function callable by the nation owner 
this function will allow a nation owner to destroy land_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation destroying land |
| amount | uint256 | this is the amount of land being destroyed |

## MilitaryContract

this contract will allow a nation owner to control their defcon level, threat level and war/peace preference

_this contract inherits from openzeppelin's ownable contract_

### spyAddress

```solidity
address spyAddress
```

### countryMinter

```solidity
address countryMinter
```

### spy

```solidity
contract SpyOperationsContract spy
```

### mint

```solidity
contract CountryMinter mint
```

### Military

```solidity
struct Military {
  uint256 defconLevel;
  uint256 threatLevel;
  bool warPeacePreference;
}
```

### idToMilitary

```solidity
mapping(uint256 => struct MilitaryContract.Military) idToMilitary
```

### onlySpyContract

```solidity
modifier onlySpyContract()
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### settings

```solidity
function settings(address _spyAddress, address _countryMinter) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### generateMilitary

```solidity
function generateMilitary(uint256 id) public
```

this function will allow allow a nation owner to reset their defcon and threat level and toggle their war peace preference

_this function is a public function only callable from the country minter contract_

### updateDefconLevel

```solidity
function updateDefconLevel(uint256 newDefcon, uint256 id) public
```

this function will allow a nation owner to update their defcon level

_this is a public function only callable by the nation owner
this function will allow a nation owner to update their defcon level_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newDefcon | uint256 | is the new defcon which must be an integer between 1 and 5 |
| id | uint256 | is the nation id of the nation updating their defcon |

### setDefconLevelFromSpyContract

```solidity
function setDefconLevelFromSpyContract(uint256 id, uint256 newLevel) public
```

this function will allow a succesful spy attack to update the defcon level

_this function will only be callable from the Spy contract
this function will allow a successful spy operation to update the defcon level_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id that was attacked and getting their defcon reset |
| newLevel | uint256 | is the new defcon level being set during the attack |

### updateThreatLevel

```solidity
function updateThreatLevel(uint256 newThreatLevel, uint256 id) public
```

this function allows a nation owner to update the threat level of a nation

_this is a public function only callable by the nation owner
this function allows a nation owner to update the threat level of a nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newThreatLevel | uint256 | is the new threat level being updated |
| id | uint256 | is the nation id of the nation updating the threat level |

### setThreatLevelFromSpyContract

```solidity
function setThreatLevelFromSpyContract(uint256 id, uint256 newLevel) public
```

this function will allow a succesful spy attack to update the threat level

_this function will only be callable from the Spy contract
this function will allow a successful spy operation to update the threat level_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id that was attacked and getting their threat level reset |
| newLevel | uint256 | is the new threat level being set during the attack |

### toggleWarPeacePreference

```solidity
function toggleWarPeacePreference(uint256 id) public
```

this function will allow a nation to toggle their prefernece for peace or war

_this function is a public function only callable from the nation owner
this function will allow a nation to toggle their prefernece for peace or war_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation toggling their preference |

### getDefconLevel

```solidity
function getDefconLevel(uint256 id) public view returns (uint256)
```

_this is a public view function that will return a nations defcon level_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the defcon level for a given nation |

### getThreatLevel

```solidity
function getThreatLevel(uint256 id) public view returns (uint256)
```

_this is a public view function that will return a nations threat level_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the threat level for a given nation |

### getWarPeacePreference

```solidity
function getWarPeacePreference(uint256 id) public view returns (bool)
```

_this is a public view function that will return a nations preference for war_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool is true if war is possible |

## NationStrengthContract

this contract will calculate a given nation's strength

_this contract inherits from openzeppelin's ownable contract_

### infrastructure

```solidity
address infrastructure
```

### forces

```solidity
address forces
```

### fighters

```solidity
address fighters
```

### bombers

```solidity
address bombers
```

### navy

```solidity
address navy
```

### missiles

```solidity
address missiles
```

### navy2

```solidity
address navy2
```

### inf

```solidity
contract InfrastructureContract inf
```

### frc

```solidity
contract ForcesContract frc
```

### fight

```solidity
contract FightersContract fight
```

### bomb

```solidity
contract BombersContract bomb
```

### nav

```solidity
contract NavyContract nav
```

### mis

```solidity
contract MissilesContract mis
```

### nav2

```solidity
contract NavyContract2 nav2
```

### settings

```solidity
function settings(address _infrastructure, address _forces, address _fighters, address _bombers, address _navy, address _missiles, address _navy2) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### updateInfrastructureContract

```solidity
function updateInfrastructureContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateForcesContract

```solidity
function updateForcesContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateFightersContract

```solidity
function updateFightersContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateBombersContract

```solidity
function updateBombersContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateNavyContract

```solidity
function updateNavyContract(address newAddress) public
```

_this function is only callable by the contract owner_

### getNationStrength

```solidity
function getNationStrength(uint256 id) public view returns (uint256)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the nations strength |

### getNationStrengthFromCommodities

```solidity
function getNationStrengthFromCommodities(uint256 id) public view returns (uint256)
```

### getNationStrengthFromMilitary

```solidity
function getNationStrengthFromMilitary(uint256 id) internal view returns (uint256)
```

### getStrengthFromAirForce

```solidity
function getStrengthFromAirForce(uint256 id) internal view returns (uint256)
```

### getStrengthFromDefendingFighters

```solidity
function getStrengthFromDefendingFighters(uint256 id) internal view returns (uint256)
```

### getAdditionalStrengthFromDefendingFighters

```solidity
function getAdditionalStrengthFromDefendingFighters(uint256 id) public view returns (uint256)
```

### getStrengthFromDefendingBombers

```solidity
function getStrengthFromDefendingBombers(uint256 id) internal view returns (uint256)
```

### getAdditionalStrengthFromDefendingBombers

```solidity
function getAdditionalStrengthFromDefendingBombers(uint256 id) internal view returns (uint256)
```

### getStrengthFromDeployedFighters

```solidity
function getStrengthFromDeployedFighters(uint256 id) internal view returns (uint256)
```

### getAdditionalStrengthFromDeployedFighters

```solidity
function getAdditionalStrengthFromDeployedFighters(uint256 id) public view returns (uint256)
```

### getStrengthFromDeployedBombers

```solidity
function getStrengthFromDeployedBombers(uint256 id) internal view returns (uint256)
```

### getAdditionalStrengthFromDeployedBombers

```solidity
function getAdditionalStrengthFromDeployedBombers(uint256 id) internal view returns (uint256)
```

### getStrengthFromNavy

```solidity
function getStrengthFromNavy(uint256 id) internal view returns (uint256)
```

### getAdditionalNavyStrength

```solidity
function getAdditionalNavyStrength(uint256 id) internal view returns (uint256)
```

## NavalActionsContract

this contract will keep track of naval actions (daily blockades, purchases and action slots)

_this contract inherits from openzeppelin's ownable contract_

### keeper

```solidity
address keeper
```

### navy

```solidity
address navy
```

### navy2

```solidity
address navy2
```

### navalBlockade

```solidity
address navalBlockade
```

### breakBlockade

```solidity
address breakBlockade
```

### navalAttack

```solidity
address navalAttack
```

### countryMinter

```solidity
address countryMinter
```

### mint

```solidity
contract CountryMinter mint
```

### NavalActions

```solidity
struct NavalActions {
  bool blockadedToday;
  uint256 purchasesToday;
  uint256 actionSlotsUsedToday;
}
```

### idToNavalActions

```solidity
mapping(uint256 => struct NavalActionsContract.NavalActions) idToNavalActions
```

### settings

```solidity
function settings(address _navalBlockade, address _breakBlockade, address _navalAttack, address _keeper, address _navy, address _navy2, address _countryMinter) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### onlyNavalAction

```solidity
modifier onlyNavalAction()
```

### generateNavalActions

```solidity
function generateNavalActions(uint256 id) public
```

this function will allow the contract to keep track of each nations action slots, blockades and purchases

_this is a public function that is only callable from the country minter contract
this function is called when a nation is minted
this function will initialize the struct that will keep track of action slots, daily blockades and purchases_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation ID of the country being minted |

### increaseAction

```solidity
function increaseAction(uint256 id) public
```

a nation is only allowed to make 3 naval actions per day
this function will increase naval actions when they occur

_this is a public view function that is only callable from the navy battle contracts
a nation is only allows to make 3 naval actions per day_

### onlyNavy

```solidity
modifier onlyNavy()
```

### increasePurchases

```solidity
function increasePurchases(uint256 id, uint256 amount) public
```

a nation at war can purchase 5 naval ships per day (7 with a foreign naval base)
during peacetime a nation can purchase 2 naval ships per day (4 with a foreign navla base)

_this is a public function that is only callable from the navy contract where purchases occur
this function will increment a nations daily purchases as purchases occur_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation purchasin vessels |
| amount | uint256 | is the amount of navy vessels being purchased |

### onlyBlockade

```solidity
modifier onlyBlockade()
```

### toggleBlockaded

```solidity
function toggleBlockaded(uint256 id) public
```

a nation can only be blockaded once per day
this function will be called when a nation is blockaded and set the blockadedToday to true

_this function is a public function that can only be called by the naval battle contracts
a nation can only be blockaded once per day_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being blockaded |

### onlyKeeper

```solidity
modifier onlyKeeper()
```

### resetActionsToday

```solidity
function resetActionsToday() public
```

this function will reset the naval actions daily when called by a chainlink keeper

_this is a public function only callable from the keeper contract
this function will reset the naval actions dailw when the chainlink keeper calls the function_

### getPurchasesToday

```solidity
function getPurchasesToday(uint256 id) public view returns (uint256)
```

this function will return the amount of vessels a nation purchases today

_this is a public view function that will return a nations daily purchases_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of ships purchased today |

### getActionSlotsUsed

```solidity
function getActionSlotsUsed(uint256 id) public view returns (uint256)
```

this function will return the number of action slots a naton has used today

_this is a public view function that will return a nations daily action slots used_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of action slots used today |

### getBlockadedToday

```solidity
function getBlockadedToday(uint256 id) public view returns (bool)
```

this function will return true if a nation has been blockaded today

_this is a public view function that will return a boolean whether a nation has been blockaded today_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if a nation has been blockaded today |

## NavyContract

this contract will allow a user to purchase navy vessels

_this contract inherits from openzeppelin's ownable contract_

### treasuryAddress

```solidity
address treasuryAddress
```

### improvementsContract1Address

```solidity
address improvementsContract1Address
```

### improvementsContract3Address

```solidity
address improvementsContract3Address
```

### improvements4

```solidity
address improvements4
```

### resources

```solidity
address resources
```

### navyBattleAddress

```solidity
address navyBattleAddress
```

### military

```solidity
address military
```

### nukes

```solidity
address nukes
```

### wonders1

```solidity
address wonders1
```

### countryMinter

```solidity
address countryMinter
```

### navalActions

```solidity
address navalActions
```

### additionalNavy

```solidity
address additionalNavy
```

### navy2Contract

```solidity
address navy2Contract
```

### bonusResources

```solidity
address bonusResources
```

### corvetteCost

```solidity
uint256 corvetteCost
```

### corvetteRequiredInfrastructure

```solidity
uint256 corvetteRequiredInfrastructure
```

### corvetteRequiredTechnology

```solidity
uint256 corvetteRequiredTechnology
```

### landingShipCost

```solidity
uint256 landingShipCost
```

### landingShipRequiredInfrastructure

```solidity
uint256 landingShipRequiredInfrastructure
```

### landingShipRequiredTechnology

```solidity
uint256 landingShipRequiredTechnology
```

### battleshipCost

```solidity
uint256 battleshipCost
```

### battleshipRequiredInfrastructure

```solidity
uint256 battleshipRequiredInfrastructure
```

### battleshipRequiredTechnology

```solidity
uint256 battleshipRequiredTechnology
```

### cruiserCost

```solidity
uint256 cruiserCost
```

### cruiserRequiredInfrastructure

```solidity
uint256 cruiserRequiredInfrastructure
```

### cruiserRequiredTechnology

```solidity
uint256 cruiserRequiredTechnology
```

### Navy

```solidity
struct Navy {
  uint256 navyVessels;
  uint256 corvetteCount;
  uint256 landingShipCount;
  uint256 battleshipCount;
  uint256 cruiserCount;
}
```

### idToNavy

```solidity
mapping(uint256 => struct NavyContract.Navy) idToNavy
```

### res

```solidity
contract ResourcesContract res
```

### mil

```solidity
contract MilitaryContract mil
```

### imp4

```solidity
contract ImprovementsContract4 imp4
```

### nuke

```solidity
contract NukeContract nuke
```

### won1

```solidity
contract WondersContract1 won1
```

### navAct

```solidity
contract NavalActionsContract navAct
```

### mint

```solidity
contract CountryMinter mint
```

### addNav

```solidity
contract AdditionalNavyContract addNav
```

### bonus

```solidity
contract BonusResourcesContract bonus
```

### navy2

```solidity
contract NavyContract2 navy2
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### onlyNavy2Contract

```solidity
modifier onlyNavy2Contract()
```

### settings

```solidity
function settings(address _treasuryAddress, address _improvementsContract1Address, address _improvementsContract3Address, address _improvements4, address _resources, address _military, address _nukes, address _wonders1, address _navalActions, address _additionalNavy) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings2

```solidity
function settings2(address _countryMinter, address _bonusResources, address _navy2) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### generateNavy

```solidity
function generateNavy(uint256 id) public
```

this function will allow a nation owner to buy navy vessels

_this is a public function only callable from the countryMinter contract
this function will allow a nation owner to buy navy vessels_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation being minted |

### updateCorvetteSpecs

```solidity
function updateCorvetteSpecs(uint256 newPrice, uint256 newRequiredInf, uint256 newRequiredTech) public
```

_this function is only callable by the contract owner_

### getCorvetteSpecs

```solidity
function getCorvetteSpecs() public view returns (uint256, uint256, uint256)
```

### updateLandingShipSpecs

```solidity
function updateLandingShipSpecs(uint256 newPrice, uint256 newRequiredInf, uint256 newRequiredTech) public
```

_this function is only callable by the contract owner_

### getLandingShipSpecs

```solidity
function getLandingShipSpecs() public view returns (uint256, uint256, uint256)
```

### updateBattleshipSpecs

```solidity
function updateBattleshipSpecs(uint256 newPrice, uint256 newRequiredInf, uint256 newRequiredTech) public
```

_this function is only callable by the contract owner_

### getBattleshipSpecs

```solidity
function getBattleshipSpecs() public view returns (uint256, uint256, uint256)
```

### updateCruiserSpecs

```solidity
function updateCruiserSpecs(uint256 newPrice, uint256 newRequiredInf, uint256 newRequiredTech) public
```

_this function is only callable by the contract owner_

### getCruiserSpecs

```solidity
function getCruiserSpecs() public view returns (uint256, uint256, uint256)
```

### onlyBattle

```solidity
modifier onlyBattle()
```

### decrementLosses

```solidity
function decrementLosses(uint256[] defenderLosses, uint256 defenderId, uint256[] attackerLosses, uint256 attackerId) public
```

this function will take the results of a battle and decrease number of vessels

_this is a public function that is only callable from the Navt Battle contract
this funtion will take the results of a battle and decrease the number of vessels_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| defenderLosses | uint256[] | is an array containing the defenders losses from the battle, each member of the array represents a different vessel |
| defenderId | uint256 | this is the nation id of the defending nation in the battle |
| attackerLosses | uint256[] | is an array containing the attacker losses from the battle, each memeber of the array represents a different vessel |
| attackerId | uint256 | this is the nation id of the attacking nation in the battle |

### getNavyVesselCount

```solidity
function getNavyVesselCount(uint256 id) public view returns (uint256)
```

### increaseNavyVesselCount

```solidity
function increaseNavyVesselCount(uint256 id, uint256 amount) public
```

### buyCorvette

```solidity
function buyCorvette(uint256 amount, uint256 id) public
```

this function will allow a nation owner to purchase a corvette vessel

_this is a public function callable only by the nation owner
this function will allow a nation owner to purchase a corvette vessel_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | this is the number of corvettes being purchased |
| id | uint256 | this is the naton id of the nation purchasing vessels |

### getCorvetteCount

```solidity
function getCorvetteCount(uint256 id) public view returns (uint256)
```

this functon will return the number of corvettes a nation owns

_this is a public view function that will return the number of corvettes a nation owns
this function wll return the number of corvettes a nation owns_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the number of corvettes for a given nation |

### buyLandingShip

```solidity
function buyLandingShip(uint256 amount, uint256 id) public
```

this function will allow a nation owner to purchase a landing ships vessel

_this is a public function callable only by the nation owner
this function will allow a nation owner to purchase a landing ships vessel_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | this is the number of landing ships being purchased |
| id | uint256 | this is the naton id of the nation purchasing vessels |

### getLandingShipCount

```solidity
function getLandingShipCount(uint256 id) public view returns (uint256)
```

this functon will return the number of landing ships a nation owns

_this is a public view function that will return the number of landing ships a nation owns
this function wll return the number of landing ships a nation owns_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the number of landing ships for a given nation |

### buyBattleship

```solidity
function buyBattleship(uint256 amount, uint256 id) public
```

this function will allow a nation owner to purchase a battleship vessel

_this is a public function callable only by the nation owner
this function will allow a nation owner to purchase a battleship vessel_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | this is the number of battleship being purchased |
| id | uint256 | this is the naton id of the nation purchasing vessels |

### getBattleshipCount

```solidity
function getBattleshipCount(uint256 id) public view returns (uint256)
```

this functon will return the number of battleships a nation owns

_this is a public view function that will return the number of battleships a nation owns
this function wll return the number of battleships a nation owns_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the number of battleships for a given nation |

### buyCruiser

```solidity
function buyCruiser(uint256 amount, uint256 id) public
```

this function will allow a nation owner to purchase a cruiser vessel

_this is a public function callable only by the nation owner
this function will allow a nation owner to purchase a cruiser vessel_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | this is the number of cruisers being purchased |
| id | uint256 | this is the naton id of the nation purchasing vessels |

### getCruiserCount

```solidity
function getCruiserCount(uint256 id) public view returns (uint256)
```

this functon will return the number of cruisers a nation owns

_this is a public view function that will return the number of cruisers a nation owns
this function wll return the number of cruisers a nation owns_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the number of cruisers for a given nation |

### onlyNukeContract

```solidity
modifier onlyNukeContract()
```

### decreaseNavyFromNukeContract

```solidity
function decreaseNavyFromNukeContract(uint256 defenderId) public
```

this function will decrease the amount of ships that are vulnerable to nuclear attacks when a nation is attacked by a nuke strike
vessels available to nuke strikes are corvettes, landing ships, cruisers and frigates
a nuke strike will reduce the number of these ships by 25% (12% with a fallout shelter system)

_this is a public function only callable from the nuke contract
this function will decrease the amount of ships that are vulnerable to nuclear attacks when a nation is attacked by a nuke strike_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| defenderId | uint256 | this is the nation id of the nation being attacked |

## NavyContract2

this contract will allow a user to purchase navy vessels

_this contract inherits from openzeppelin's ownable contract_

### treasuryAddress

```solidity
address treasuryAddress
```

### improvementsContract1Address

```solidity
address improvementsContract1Address
```

### improvementsContract3Address

```solidity
address improvementsContract3Address
```

### improvements4

```solidity
address improvements4
```

### resources

```solidity
address resources
```

### navyBattleAddress

```solidity
address navyBattleAddress
```

### military

```solidity
address military
```

### nukes

```solidity
address nukes
```

### wonders1

```solidity
address wonders1
```

### countryMinter

```solidity
address countryMinter
```

### navalActions

```solidity
address navalActions
```

### additionalNavy

```solidity
address additionalNavy
```

### bonusResources

```solidity
address bonusResources
```

### navy1Address

```solidity
address navy1Address
```

### frigateCost

```solidity
uint256 frigateCost
```

### frigateRequiredInfrastructure

```solidity
uint256 frigateRequiredInfrastructure
```

### frigateRequiredTechnology

```solidity
uint256 frigateRequiredTechnology
```

### destroyerCost

```solidity
uint256 destroyerCost
```

### destroyerRequiredInfrastructure

```solidity
uint256 destroyerRequiredInfrastructure
```

### destroyerRequiredTechnology

```solidity
uint256 destroyerRequiredTechnology
```

### submarineCost

```solidity
uint256 submarineCost
```

### submarineRequiredInfrastructure

```solidity
uint256 submarineRequiredInfrastructure
```

### submarineRequiredTechnology

```solidity
uint256 submarineRequiredTechnology
```

### aircraftCarrierCost

```solidity
uint256 aircraftCarrierCost
```

### aircraftCarrierRequiredInfrastructure

```solidity
uint256 aircraftCarrierRequiredInfrastructure
```

### aircraftCarrierRequiredTechnology

```solidity
uint256 aircraftCarrierRequiredTechnology
```

### Navy

```solidity
struct Navy {
  uint256 frigateCount;
  uint256 destroyerCount;
  uint256 submarineCount;
  uint256 aircraftCarrierCount;
}
```

### idToNavy

```solidity
mapping(uint256 => struct NavyContract2.Navy) idToNavy
```

### res

```solidity
contract ResourcesContract res
```

### mil

```solidity
contract MilitaryContract mil
```

### imp4

```solidity
contract ImprovementsContract4 imp4
```

### nuke

```solidity
contract NukeContract nuke
```

### won1

```solidity
contract WondersContract1 won1
```

### navAct

```solidity
contract NavalActionsContract navAct
```

### mint

```solidity
contract CountryMinter mint
```

### addNav

```solidity
contract AdditionalNavyContract addNav
```

### bonus

```solidity
contract BonusResourcesContract bonus
```

### navy1

```solidity
contract NavyContract navy1
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### onlyNavy1Contract

```solidity
modifier onlyNavy1Contract()
```

### settings

```solidity
function settings(address _treasuryAddress, address _improvementsContract1Address, address _improvementsContract3Address, address _improvements4, address _resources, address _military, address _nukes, address _wonders1, address _navalActions, address _additionalNavy) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings2

```solidity
function settings2(address _countryMinter, address _bonusResources, address _navy1) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### generateNavy

```solidity
function generateNavy(uint256 id) public
```

this function will allow a nation owner to buy navy vessels

_this is a public function only callable from the countryMinter contract
this function will allow a nation owner to buy navy vessels_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation being minted |

### updateFrigateSpecs

```solidity
function updateFrigateSpecs(uint256 newPrice, uint256 newRequiredInf, uint256 newRequiredTech) public
```

_this function is only callable by the contract owner_

### getFrigateSpecs

```solidity
function getFrigateSpecs() public view returns (uint256, uint256, uint256)
```

### updateDestroyerSpecs

```solidity
function updateDestroyerSpecs(uint256 newPrice, uint256 newRequiredInf, uint256 newRequiredTech) public
```

_this function is only callable by the contract owner_

### getDestroyerSpecs

```solidity
function getDestroyerSpecs() public view returns (uint256, uint256, uint256)
```

### updateSubmarineSpecs

```solidity
function updateSubmarineSpecs(uint256 newPrice, uint256 newRequiredInf, uint256 newRequiredTech) public
```

_this function is only callable by the contract owner_

### getSubmarineSpecs

```solidity
function getSubmarineSpecs() public view returns (uint256, uint256, uint256)
```

### updateAircraftCarrierSpecs

```solidity
function updateAircraftCarrierSpecs(uint256 newPrice, uint256 newRequiredInf, uint256 newRequiredTech) public
```

_this function is only callable by the contract owner_

### getAircraftCarrierSpecs

```solidity
function getAircraftCarrierSpecs() public view returns (uint256, uint256, uint256)
```

### buyFrigate

```solidity
function buyFrigate(uint256 amount, uint256 id) public
```

this function will allow a nation owner to purchase a frigates vessel

_this is a public function callable only by the nation owner
this function will allow a nation owner to purchase a frigates vessel_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | this is the number of frigates being purchased |
| id | uint256 | this is the naton id of the nation purchasing vessels |

### getFrigateCount

```solidity
function getFrigateCount(uint256 id) public view returns (uint256)
```

this functon will return the number of frigates a nation owns

_this is a public view function that will return the number of frigates a nation owns
this function wll return the number of frigates a nation owns_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the number of frigates for a given nation |

### decreaseFrigateCount

```solidity
function decreaseFrigateCount(uint256 id, uint256 amount) public
```

### buyDestroyer

```solidity
function buyDestroyer(uint256 amount, uint256 id) public
```

this function will allow a nation owner to purchase a destroyer vessel

_this is a public function callable only by the nation owner
this function will allow a nation owner to purchase a destroyer vessel_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | this is the number of destroyers being purchased |
| id | uint256 | this is the naton id of the nation purchasing vessels |

### getDestroyerCount

```solidity
function getDestroyerCount(uint256 id) public view returns (uint256)
```

this functon will return the number of destroyers a nation owns

_this is a public view function that will return the number of destroyers a nation owns
this function wll return the number of destroyers a nation owns_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the number of destroyers for a given nation |

### decreaseDestroyerCount

```solidity
function decreaseDestroyerCount(uint256 id, uint256 amount) public
```

### buySubmarine

```solidity
function buySubmarine(uint256 amount, uint256 id) public
```

this function will allow a nation owner to purchase a submarine vessel

_this is a public function callable only by the nation owner
this function will allow a nation owner to purchase a submarine vessel_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | this is the number of submarines being purchased |
| id | uint256 | this is the naton id of the nation purchasing vessels |

### getSubmarineCount

```solidity
function getSubmarineCount(uint256 id) public view returns (uint256)
```

this functon will return the number of submarines a nation owns

_this is a public view function that will return the number of submarines a nation owns
this function wll return the number of submarines ttes a nation owns_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the number of submarines for a given nation |

### decreaseSubmarineCount

```solidity
function decreaseSubmarineCount(uint256 id, uint256 amount) public
```

### buyAircraftCarrier

```solidity
function buyAircraftCarrier(uint256 amount, uint256 id) public
```

this function will allow a nation owner to purchase a aircraft carrier vessel

_this is a public function callable only by the nation owner
this function will allow a nation owner to purchase a aircraft carrier vessel_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | this is the number of aircraft carriers being purchased |
| id | uint256 | this is the naton id of the nation purchasing vessels |

### getAircraftCarrierCount

```solidity
function getAircraftCarrierCount(uint256 id) public view returns (uint256)
```

this functon will return the number of aircraft carriers a nation owns

_this is a public view function that will return the number of aircraft carriers a nation owns
this function wll return the number of aircraft carriers a nation owns_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the number of aircraft carriers for a given nation |

### decreaseAircraftCarrierCount

```solidity
function decreaseAircraftCarrierCount(uint256 id, uint256 amount) public
```

## AdditionalNavyContract

this contract will keep track of additional information about a nations navy

_this contract inherits from the openzeppelin ownabl contract_

### navy

```solidity
address navy
```

### navalActions

```solidity
address navalActions
```

### military

```solidity
address military
```

### wonders1

```solidity
address wonders1
```

### improvements4

```solidity
address improvements4
```

### navy2

```solidity
address navy2
```

### nav

```solidity
contract NavyContract nav
```

### navAct

```solidity
contract NavalActionsContract navAct
```

### mil

```solidity
contract MilitaryContract mil
```

### won1

```solidity
contract WondersContract1 won1
```

### imp4

```solidity
contract ImprovementsContract4 imp4
```

### nav2

```solidity
contract NavyContract2 nav2
```

### settings

```solidity
function settings(address _navy, address _navalActions, address _military, address _wonders1, address _improvements4, address _navy2) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### getAvailablePurchases

```solidity
function getAvailablePurchases(uint256 id) public view returns (uint256, uint256)
```

this function will return a nations available daily navy vessel purchases

_this is a public view function
this function will return a nations available daily navy vessel purchases_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of available navy vessel purchases for the day for that nation |
| [1] | uint256 |  |

### getBlockadeCapableShips

```solidity
function getBlockadeCapableShips(uint256 id) public view returns (uint256)
```

this function will return the number of blockade capable ships a nation has
blockade capable ships include battleships, cruisers, frigates and submarines

_this is a public view function that will return the number of blockade capable ships a nation has_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the number of blockade capable ships for a given nation |

### getBreakBlockadeCapableShips

```solidity
function getBreakBlockadeCapableShips(uint256 id) public view returns (uint256)
```

this function will return the number of ships a nation has that can break a blockade
blockade capable ships include battleships, cruisers, frigates and destroyers

_this is a public view function that will return the number of ships a nation has that can break a blockade_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 this is the number of ships that can break a blockade for a given nation |

### getVesselCountForDrydock

```solidity
function getVesselCountForDrydock(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of ships that a nations drydocks support
a nation cannot delete a drydock if it supports a vessel
drydocks support corvettes, battleships, cruisers and destroyers

_this is a public view function that returns the number of navy vessels that a nations drydocks support_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of vessel supported by the drydocks |

### getVesselCountForShipyard

```solidity
function getVesselCountForShipyard(uint256 countryId) public view returns (uint256 count)
```

this function will return the number of ships that a nations shipyards support
a nation cannot delete a shipyard if it supports a vessel
shipyards support landing ships, frigates, submarines and aircraft carriers

_this is a public view function that returns the number of navy vessels that a nations shipyards support_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of vessel supported by the shipyards |

## NavalBlockadeContract

_this contract inherits from the openzeppelin ownable contract
this contract inherits from the chainlink VRF contract_

### blockadeId

```solidity
uint256 blockadeId
```

### navy

```solidity
address navy
```

### additionalNavy

```solidity
address additionalNavy
```

### navalAction

```solidity
address navalAction
```

### warContract

```solidity
address warContract
```

### countryMinter

```solidity
address countryMinter
```

### war

```solidity
contract WarContract war
```

### mint

```solidity
contract CountryMinter mint
```

### nav

```solidity
contract NavyContract nav
```

### navAct

```solidity
contract NavalActionsContract navAct
```

### addNav

```solidity
contract AdditionalNavyContract addNav
```

### Blockade

```solidity
struct Blockade {
  uint256 blockadeId;
  uint256 blockaderId;
  uint256 blockadedId;
  uint256 blockadePercentageReduction;
  uint256 blockadeDays;
  bool blockadeActive;
}
```

### blockadeIdToBlockade

```solidity
mapping(uint256 => struct NavalBlockadeContract.Blockade) blockadeIdToBlockade
```

### idToActiveBlockadesAgainst

```solidity
mapping(uint256 => uint256[]) idToActiveBlockadesAgainst
```

### idToActiveBlockadesFor

```solidity
mapping(uint256 => uint256[]) idToActiveBlockadesFor
```

### s_requestIdToRequestIndex

```solidity
mapping(uint256 => uint256) s_requestIdToRequestIndex
```

### s_requestIndexToRandomWords

```solidity
mapping(uint256 => uint256[]) s_requestIndexToRandomWords
```

### constructor

```solidity
constructor(address vrfCoordinatorV2, uint64 subscriptionId, bytes32 gasLane, uint32 callbackGasLimit) public
```

### settings

```solidity
function settings(address _navy, address _additionalNavy, address _navalAction, address _war) public
```

### blockade

```solidity
function blockade(uint256 attackerId, uint256 defenderId, uint256 warId) public
```

this function allows a nation to blockade another nation they are at war with

_this is a public function callable only from the nation owner
this function allows a nation to blockade another nation they are at war with_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| attackerId | uint256 | is the id of the attacking nation |
| defenderId | uint256 | is the nation id of the defending nation |
| warId | uint256 | is the war id of the active war between the 2 nations |

### checkRequirements

```solidity
function checkRequirements(uint256 attackerId, uint256 defenderId, uint256 warId) internal view returns (bool)
```

### checkIfAttackerAlreadyBlockaded

```solidity
function checkIfAttackerAlreadyBlockaded(uint256 attackerId, uint256 defenderId) internal view returns (bool)
```

### fulfillRequest

```solidity
function fulfillRequest(uint256 id) public
```

### fulfillRandomWords

```solidity
function fulfillRandomWords(uint256 requestId, uint256[] randomWords) internal
```

fulfillRandomness handles the VRF response. Your contract must
implement it. See "SECURITY CONSIDERATIONS" above for important
principles to keep in mind when implementing your fulfillRandomness
method.

_VRFConsumerBaseV2 expects its subcontracts to have a method with this
signature, and will call it once it has verified the proof
associated with the randomness. (It is triggered via a call to
rawFulfillRandomness, below.)_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | The Id initially returned by requestRandomness |
| randomWords | uint256[] | the VRF output expanded to the requested number of words |

### getActiveBlockadesAgainst

```solidity
function getActiveBlockadesAgainst(uint256 countryId) public view returns (uint256[])
```

### checkIfBlockadeCapable

```solidity
function checkIfBlockadeCapable(uint256 countryId) public
```

## BreakBlocadeContract

_this contract inherits from the openzeppelin ownable contract
this contract inherits from the chainlink VRF contract_

### breakBlockadeId

```solidity
uint256 breakBlockadeId
```

### countryMinter

```solidity
address countryMinter
```

### navalBlockade

```solidity
address navalBlockade
```

### navy

```solidity
address navy
```

### warAddress

```solidity
address warAddress
```

### improvements4

```solidity
address improvements4
```

### navalActions

```solidity
address navalActions
```

### navy2

```solidity
address navy2
```

### battleshipStrength

```solidity
uint256 battleshipStrength
```

### cruiserStrength

```solidity
uint256 cruiserStrength
```

### frigateStrength

```solidity
uint256 frigateStrength
```

### destroyerStrength

```solidity
uint256 destroyerStrength
```

### submarineStrength

```solidity
uint256 submarineStrength
```

### battleshipTargetSize

```solidity
uint256 battleshipTargetSize
```

### cruiserTargetSize

```solidity
uint256 cruiserTargetSize
```

### frigateTargetSize

```solidity
uint256 frigateTargetSize
```

### destroyerTargetSize

```solidity
uint256 destroyerTargetSize
```

### submarineTargetSize

```solidity
uint256 submarineTargetSize
```

### mint

```solidity
contract CountryMinter mint
```

### navBlock

```solidity
contract NavalBlockadeContract navBlock
```

### nav

```solidity
contract NavyContract nav
```

### war

```solidity
contract WarContract war
```

### imp4

```solidity
contract ImprovementsContract4 imp4
```

### navAct

```solidity
contract NavalActionsContract navAct
```

### nav2

```solidity
contract NavyContract2 nav2
```

### BreakBlockade

```solidity
struct BreakBlockade {
  uint256 battleshipCount;
  uint256 cruiserCount;
  uint256 frigateCount;
  uint256 destroyerCount;
  uint256 breakerStrength;
  uint256 warId;
  uint256 breakerId;
}
```

### DefendBlockade

```solidity
struct DefendBlockade {
  uint256 battleshipCount;
  uint256 cruiserCount;
  uint256 frigateCount;
  uint256 submarineCount;
  uint256 defenderStrength;
  uint256 warId;
  uint256 defenderId;
}
```

### breakBlockadeIdToBreakBlockade

```solidity
mapping(uint256 => struct BreakBlocadeContract.BreakBlockade) breakBlockadeIdToBreakBlockade
```

### breakBlockadeIdToDefendBlockade

```solidity
mapping(uint256 => struct BreakBlocadeContract.DefendBlockade) breakBlockadeIdToDefendBlockade
```

### battleIdToBreakBlockadeChanceArray

```solidity
mapping(uint256 => uint256[]) battleIdToBreakBlockadeChanceArray
```

### battleIdToBreakBlockadeTypeArray

```solidity
mapping(uint256 => uint256[]) battleIdToBreakBlockadeTypeArray
```

### battleIdToBreakBlockadeCumulativeSumOdds

```solidity
mapping(uint256 => uint256) battleIdToBreakBlockadeCumulativeSumOdds
```

### battleIdToBreakBlockadeLosses

```solidity
mapping(uint256 => uint256[]) battleIdToBreakBlockadeLosses
```

### battleIdToDefendBlockadeChanceArray

```solidity
mapping(uint256 => uint256[]) battleIdToDefendBlockadeChanceArray
```

### battleIdToDefendBlockadeTypeArray

```solidity
mapping(uint256 => uint256[]) battleIdToDefendBlockadeTypeArray
```

### battleIdToDefendBlockadeCumulativeSumOdds

```solidity
mapping(uint256 => uint256) battleIdToDefendBlockadeCumulativeSumOdds
```

### battleIdToDefendBlockadeLosses

```solidity
mapping(uint256 => uint256[]) battleIdToDefendBlockadeLosses
```

### s_requestIdToRequestIndex

```solidity
mapping(uint256 => uint256) s_requestIdToRequestIndex
```

### s_requestIndexToRandomWords

```solidity
mapping(uint256 => uint256[]) s_requestIndexToRandomWords
```

### constructor

```solidity
constructor(address vrfCoordinatorV2, uint64 subscriptionId, bytes32 gasLane, uint32 callbackGasLimit) public
```

### settings

```solidity
function settings(address _countryMinter, address _navalBlockade, address _navy, address _warAddress, address _improvements4, address _navalActions, address _navy2) public
```

### breakBlockade

```solidity
function breakBlockade(uint256 warId, uint256 attackerId, uint256 blockaderId) public
```

this function allows a nation to break a blockade another nation imposed on them

_this is a public function callable only from the nation owner
this function allows a nation to break a blockade another nation imposed on them_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| warId | uint256 | is the war id of the active war between the 2 nations |
| attackerId | uint256 | is the id of the attacking nation |
| blockaderId | uint256 | is the nation id of the defending nation |

### generateBreakBlockadeStruct

```solidity
function generateBreakBlockadeStruct(uint256 warId, uint256 attackerId, uint256 breakBlockId) internal
```

### generateDefendBlockadeStruct

```solidity
function generateDefendBlockadeStruct(uint256 warId, uint256 defenderId, uint256 breakBlockId) internal
```

### generateBreakBlockadeChanceArray

```solidity
function generateBreakBlockadeChanceArray(uint256 breakBlockId) internal
```

### generateDefendBlockadeChanceArray

```solidity
function generateDefendBlockadeChanceArray(uint256 breakBlockId) internal
```

### getBreakerStrength

```solidity
function getBreakerStrength(uint256 battleId) public view returns (uint256)
```

### getDefenderStrength

```solidity
function getDefenderStrength(uint256 battleId) public view returns (uint256)
```

### fulfillRequest

```solidity
function fulfillRequest(uint256 battleId) public
```

### fulfillRandomWords

```solidity
function fulfillRandomWords(uint256 requestId, uint256[] randomWords) internal
```

fulfillRandomness handles the VRF response. Your contract must
implement it. See "SECURITY CONSIDERATIONS" above for important
principles to keep in mind when implementing your fulfillRandomness
method.

_VRFConsumerBaseV2 expects its subcontracts to have a method with this
signature, and will call it once it has verified the proof
associated with the randomness. (It is triggered via a call to
rawFulfillRandomness, below.)_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | The Id initially returned by requestRandomness |
| randomWords | uint256[] | the VRF output expanded to the requested number of words |

### getLosses

```solidity
function getLosses(uint256 battleId, uint256 numberBetweenZeroAndTwo) public view returns (uint256)
```

### getBreakerShipCount

```solidity
function getBreakerShipCount(uint256 countryId) internal view returns (uint256)
```

### getDefenderShipCount

```solidity
function getDefenderShipCount(uint256 countryId) internal view returns (uint256)
```

### generateLossForDefender

```solidity
function generateLossForDefender(uint256 battleId, uint256 randomNumberForShipLoss) public
```

### generateLossForBreaker

```solidity
function generateLossForBreaker(uint256 battleId, uint256 randomNumberForShipLoss) public
```

### getAmountToDecrease

```solidity
function getAmountToDecrease(uint256 shipType) internal pure returns (uint256)
```

## NavalAttackContract

_this contract inherits from the openzeppelin ownable contract
this contract inherits from the chainlink VRF contract_

### navy

```solidity
address navy
```

### navyBattleId

```solidity
uint256 navyBattleId
```

### navyBlockade

```solidity
address navyBlockade
```

### warAddress

```solidity
address warAddress
```

### improvements4

```solidity
address improvements4
```

### navalActions

```solidity
address navalActions
```

### navy2

```solidity
address navy2
```

### corvetteStrength

```solidity
uint256 corvetteStrength
```

### landingShipStrength

```solidity
uint256 landingShipStrength
```

### battleshipStrength

```solidity
uint256 battleshipStrength
```

### cruiserStrength

```solidity
uint256 cruiserStrength
```

### frigateStrength

```solidity
uint256 frigateStrength
```

### destroyerStrength

```solidity
uint256 destroyerStrength
```

### submarineStrength

```solidity
uint256 submarineStrength
```

### aircraftCarrierStrength

```solidity
uint256 aircraftCarrierStrength
```

### corvetteTargetSize

```solidity
uint256 corvetteTargetSize
```

### landingShipTargetSize

```solidity
uint256 landingShipTargetSize
```

### battleshipTargetSize

```solidity
uint256 battleshipTargetSize
```

### cruiserTargetSize

```solidity
uint256 cruiserTargetSize
```

### frigateTargetSize

```solidity
uint256 frigateTargetSize
```

### destroyerTargetSize

```solidity
uint256 destroyerTargetSize
```

### submarineTargetSize

```solidity
uint256 submarineTargetSize
```

### aircraftCarrierTargetSize

```solidity
uint256 aircraftCarrierTargetSize
```

### nav

```solidity
contract NavyContract nav
```

### navBlock

```solidity
contract NavalBlockadeContract navBlock
```

### war

```solidity
contract WarContract war
```

### imp4

```solidity
contract ImprovementsContract4 imp4
```

### navAct

```solidity
contract NavalActionsContract navAct
```

### nav2

```solidity
contract NavyContract2 nav2
```

### NavyForces

```solidity
struct NavyForces {
  uint256 corvetteCount;
  uint256 landingShipCount;
  uint256 battleshipCount;
  uint256 cruiserCount;
  uint256 frigateCount;
  uint256 destroyerCount;
  uint256 submarineCount;
  uint256 aircraftCarrierCount;
  uint256 startingStrength;
  uint256 warId;
  uint256 countryId;
}
```

### idToAttackerNavy

```solidity
mapping(uint256 => struct NavalAttackContract.NavyForces) idToAttackerNavy
```

### idToDefenderNavy

```solidity
mapping(uint256 => struct NavalAttackContract.NavyForces) idToDefenderNavy
```

### battleIdToAttackerChanceArray

```solidity
mapping(uint256 => uint256[]) battleIdToAttackerChanceArray
```

### battleIdToAttackerTypeArray

```solidity
mapping(uint256 => uint256[]) battleIdToAttackerTypeArray
```

### battleIdToAttackerCumulativeSumOdds

```solidity
mapping(uint256 => uint256) battleIdToAttackerCumulativeSumOdds
```

### battleIdToAttackerLosses

```solidity
mapping(uint256 => uint256[]) battleIdToAttackerLosses
```

### battleIdToDefenderChanceArray

```solidity
mapping(uint256 => uint256[]) battleIdToDefenderChanceArray
```

### battleIdToDefenderTypeArray

```solidity
mapping(uint256 => uint256[]) battleIdToDefenderTypeArray
```

### battleIdToDefenderCumulativeSumOdds

```solidity
mapping(uint256 => uint256) battleIdToDefenderCumulativeSumOdds
```

### battleIdToDefenderLosses

```solidity
mapping(uint256 => uint256[]) battleIdToDefenderLosses
```

### s_requestIdToRequestIndex

```solidity
mapping(uint256 => uint256) s_requestIdToRequestIndex
```

### s_requestIndexToRandomWords

```solidity
mapping(uint256 => uint256[]) s_requestIndexToRandomWords
```

### constructor

```solidity
constructor(address vrfCoordinatorV2, uint64 subscriptionId, bytes32 gasLane, uint32 callbackGasLimit) public
```

### settings

```solidity
function settings(address _navy, address _war, address _improvements4, address _navalActions, address _navy2) public
```

### navalAttack

```solidity
function navalAttack(uint256 warId, uint256 attackerId, uint256 defenderId) public
```

this function allows a nation to attack the navy of another nation

_this is a public function callable only from the nation owner
this function allows a nation to attack the navy of another nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| warId | uint256 | is the war id of the active war between the 2 nations |
| attackerId | uint256 | is the id of the attacking nation |
| defenderId | uint256 | is the nation id of the defending nation |

### generateAttackerNavyStruct

```solidity
function generateAttackerNavyStruct(uint256 warId, uint256 battleId, uint256 countryId) internal
```

### generateDefenderNavyStruct

```solidity
function generateDefenderNavyStruct(uint256 warId, uint256 attackId, uint256 countryId) internal
```

### generateAttackerChanceArray

```solidity
function generateAttackerChanceArray(uint256 battleId) internal
```

### generateDefenderChanceArray

```solidity
function generateDefenderChanceArray(uint256 battleId) internal
```

### getAttackerStrength

```solidity
function getAttackerStrength(uint256 battleId) public view returns (uint256)
```

### getDefenderStrength

```solidity
function getDefenderStrength(uint256 battleId) public view returns (uint256)
```

### fulfillRequest

```solidity
function fulfillRequest(uint256 battleId) public
```

### fulfillRandomWords

```solidity
function fulfillRandomWords(uint256 requestId, uint256[] randomWords) internal
```

fulfillRandomness handles the VRF response. Your contract must
implement it. See "SECURITY CONSIDERATIONS" above for important
principles to keep in mind when implementing your fulfillRandomness
method.

_VRFConsumerBaseV2 expects its subcontracts to have a method with this
signature, and will call it once it has verified the proof
associated with the randomness. (It is triggered via a call to
rawFulfillRandomness, below.)_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | The Id initially returned by requestRandomness |
| randomWords | uint256[] | the VRF output expanded to the requested number of words |

### getLosses

```solidity
function getLosses(uint256 battleId, uint256 numberBetweenZeroAndTwo) public view returns (uint256)
```

### getShipCount

```solidity
function getShipCount(uint256 countryId) internal view returns (uint256)
```

### generateLossForDefender

```solidity
function generateLossForDefender(uint256 battleId, uint256 randomNumberForShipLoss) public
```

### generateLossForAttacker

```solidity
function generateLossForAttacker(uint256 battleId, uint256 randomNumberForShipLoss) public
```

### getAmountToDecrease

```solidity
function getAmountToDecrease(uint256 shipType) internal pure returns (uint256)
```

## NukeContract

this contract will allow a nation to launch a nuclear missile at anoter nation

_this contract inherits from chainlink VRF
this contract inherits from openzeppelin ownable_

### nukeAttackId

```solidity
uint256 nukeAttackId
```

### nukesDroppedToday

```solidity
uint256 nukesDroppedToday
```

### nukesDropped1DayAgo

```solidity
uint256 nukesDropped1DayAgo
```

### nukesDropped2DaysAgo

```solidity
uint256 nukesDropped2DaysAgo
```

### nukesDropped3DaysAgo

```solidity
uint256 nukesDropped3DaysAgo
```

### nukesDropped4DaysAgo

```solidity
uint256 nukesDropped4DaysAgo
```

### nukesDropped5DaysAgo

```solidity
uint256 nukesDropped5DaysAgo
```

### nukesDropped6DaysAgo

```solidity
uint256 nukesDropped6DaysAgo
```

### countryMinter

```solidity
address countryMinter
```

### warAddress

```solidity
address warAddress
```

### wonders1

```solidity
address wonders1
```

### wonders4

```solidity
address wonders4
```

### improvements3

```solidity
address improvements3
```

### improvements4

```solidity
address improvements4
```

### infrastructure

```solidity
address infrastructure
```

### forces

```solidity
address forces
```

### navy

```solidity
address navy
```

### missiles

```solidity
address missiles
```

### keeper

```solidity
address keeper
```

### parameters

```solidity
address parameters
```

### mod

```solidity
uint256 mod
```

### mint

```solidity
contract CountryMinter mint
```

### war

```solidity
contract WarContract war
```

### won1

```solidity
contract WondersContract1 won1
```

### won4

```solidity
contract WondersContract4 won4
```

### imp3

```solidity
contract ImprovementsContract3 imp3
```

### imp4

```solidity
contract ImprovementsContract4 imp4
```

### inf

```solidity
contract InfrastructureContract inf
```

### force

```solidity
contract ForcesContract force
```

### nav

```solidity
contract NavyContract nav
```

### mis

```solidity
contract MissilesContract mis
```

### param

```solidity
contract CountryParametersContract param
```

### NukeAttack

```solidity
struct NukeAttack {
  uint256 warId;
  uint256 attackerId;
  uint256 defenderId;
  uint256 attackType;
}
```

### nukeAttackIdToNukeAttack

```solidity
mapping(uint256 => struct NukeContract.NukeAttack) nukeAttackIdToNukeAttack
```

### s_requestIdToRequestIndex

```solidity
mapping(uint256 => uint256) s_requestIdToRequestIndex
```

### s_requestIndexToRandomWords

```solidity
mapping(uint256 => uint256[]) s_requestIndexToRandomWords
```

### constructor

```solidity
constructor(address vrfCoordinatorV2, uint64 subscriptionId, bytes32 gasLane, uint32 callbackGasLimit) public
```

_this function contains the variable necessary for chainlink randomness_

### settings

```solidity
function settings(address _countryMinter, address _warAddress, address _wonders1, address _wonders4, address _improvements3, address _improvements4, address _infrastructure, address _forces, address _navy, address _missiles, address _keeper) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings2

```solidity
function settings2(address _parameters) public
```

### updateCountryMinterContract

```solidity
function updateCountryMinterContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateWarContract

```solidity
function updateWarContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateWonders1Contract

```solidity
function updateWonders1Contract(address newAddress) public
```

_this function is only callable by the contract owner_

### launchNuke

```solidity
function launchNuke(uint256 warId, uint256 attackerId, uint256 defenderId, uint256 attackType) public
```

this function will launch a nuke strike against another nation, nations are required to be at war
a nuke cannot be launched until a war is one day old
attack type will be 1 for a standard attack, 2 for an infrastructre attack, 3 for a land attack and 4 for a technology attack
if an attacking nation does not have a emp wonder, than the attack type will need to be a standard attack

_this is a public function callable only by the attacking nation owner
this function will launch a nuke strike against another nation, nations are required to be at war_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| warId | uint256 | will be the war id of the active war between the 2 nations |
| attackerId | uint256 | will be the id of the attacking nation (launching the nuke) |
| defenderId | uint256 | will be the id of the defending nation |
| attackType | uint256 | determines if the attack is a standard attack or an attack targeting infrastructure, land or technology |

### fulfillRequest

```solidity
function fulfillRequest(uint256 id) internal
```

_this function will be called by the launchNuke() function
this function will send a randomness request to the chainlink VRF contract_

### fulfillRandomWords

```solidity
function fulfillRandomWords(uint256 requestId, uint256[] randomWords) internal
```

a nations default odds of a successful nuke strike are 50%
if a defender has a strategic defense initiative the odds of a successful strike go down 20%
if the attacker has sattelites, the odds of a succesful strike go up 5% per sattelite
if a defender has a missile defense, the odds of a sucessful strike go down 5% per missile defense

_this function will be called by the chainlink VRF contract in response to a randomness request
the random numbers will be used to determine if the nuke strike was a success or not_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | will be the request id passed in from the fulfillRequest() function |
| randomWords | uint256[] | is the randomly generate number for the calculation of a successful nuke strike |

### inflictNukeDamage

```solidity
function inflictNukeDamage(uint256 attackId) internal
```

this function will take the attack tyoe and direct the type of damage to inflict

_this is an internal function that will be called in the event of a succesful nuke strike_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| attackId | uint256 | this is the type of attack that was launched that will determine if the attack was a standard attack or an infrastructure, land or tech attack |

### standardAttack

```solidity
function standardAttack(uint256 attackId) internal
```

a standard nuke attack will decrease land, infrastructure and tech by 35%

_this is the function that will be called in the event of a standard attack_

### infrastructureAttack

```solidity
function infrastructureAttack(uint256 attackId) internal
```

an infrastructure nuke attack will decrease infrastructure by 45% and land and tech by 25%

_this is the function that will be called in the event of a infrastructure attack_

### landAttack

```solidity
function landAttack(uint256 attackId) internal
```

a land nuke attack will decrease land by 45% and infrastructe and tech by 25%

_this is the function that will be called in the event of a land attack_

### technologyAttack

```solidity
function technologyAttack(uint256 attackId) internal
```

a tech nuke attack will decrease tech by 45% and infrastructe and land by 25%

_this is the function that will be called in the event of a tech attack_

### calculateNukesLandedLastSevenDays

```solidity
function calculateNukesLandedLastSevenDays() public view returns (uint256)
```

_this function is a public view function that will return the number of nukes launched in the game in the last 7 days
this function will be used to calculate global radiation levels (next function)_

### getGlobalRadiation

```solidity
function getGlobalRadiation() public view returns (uint256)
```

this function will return the global radiation levels for the game
global radiation is calulates by miltiplying nukes landed in the last 7 days by a modifier (default 300) and dividing by the number of countries

_this is a public view function that will return the global radiation levels that will be used in a nations environment calculation_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the global radiation level |

### updateGlobalRadiationModifier

```solidity
function updateGlobalRadiationModifier(uint256 newModifier) public
```

this function will allow the owner of the contract to adjust the modifier for the global radiation level

_this is a function callable by the owner of the contract that will allow the caller to update the modifier for the global radiation level_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newModifier | uint256 | is the new modifier for the global radiation level |

### onlyKeeper

```solidity
modifier onlyKeeper()
```

### shiftNukesDroppedDays

```solidity
function shiftNukesDroppedDays() public
```

_this is a function only callable from the chainlink keeper contract
this function will shift the nukes landed daily for the last 6 days (i.e. 2 dayss ago goes to 3 days ago)_

## ResourcesContract

this contract will keep track of a nations resources and trades

_this contract inherits from chainlink VRF
this contract inherits from oepnzeppelin ownable_

### resourcesLength

```solidity
uint256 resourcesLength
```

### tradingPartners

```solidity
uint256[] tradingPartners
```

### proposedTrades

```solidity
uint256[] proposedTrades
```

### trades

```solidity
uint256[] trades
```

### infrastructure

```solidity
address infrastructure
```

### improvements2

```solidity
address improvements2
```

### countryMinter

```solidity
address countryMinter
```

### bonusResources

```solidity
address bonusResources
```

### mint

```solidity
contract CountryMinter mint
```

### bonus

```solidity
contract BonusResourcesContract bonus
```

### Resources1

```solidity
struct Resources1 {
  bool aluminium;
  bool cattle;
  bool coal;
  bool fish;
  bool furs;
  bool gems;
  bool gold;
  bool iron;
  bool lead;
  bool lumber;
  bool marble;
}
```

### Resources2

```solidity
struct Resources2 {
  bool oil;
  bool pigs;
  bool rubber;
  bool silver;
  bool spices;
  bool sugar;
  bool uranium;
  bool water;
  bool wheat;
  bool wine;
}
```

### idToResources1

```solidity
mapping(uint256 => struct ResourcesContract.Resources1) idToResources1
```

### idToResources2

```solidity
mapping(uint256 => struct ResourcesContract.Resources2) idToResources2
```

### idToPlayerResources

```solidity
mapping(uint256 => uint256[]) idToPlayerResources
```

### idToRandomResourceSelection

```solidity
mapping(uint256 => uint256[]) idToRandomResourceSelection
```

### idToTradingPartners

```solidity
mapping(uint256 => uint256[]) idToTradingPartners
```

### idToProposedTradingPartners

```solidity
mapping(uint256 => uint256[]) idToProposedTradingPartners
```

### s_requestIdToRequestIndex

```solidity
mapping(uint256 => uint256) s_requestIdToRequestIndex
```

### s_requestIndexToRandomWords

```solidity
mapping(uint256 => uint256[]) s_requestIndexToRandomWords
```

### randomNumbersRequested

```solidity
event randomNumbersRequested(uint256 requestId)
```

### randomNumbersFulfilled

```solidity
event randomNumbersFulfilled(uint256 randomResource1, uint256 randomResource2)
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### constructor

```solidity
constructor(address vrfCoordinatorV2, uint64 subscriptionId, bytes32 gasLane, uint32 callbackGasLimit) public
```

_constructor function will accept variables for chainlink randomness_

### settings

```solidity
function settings(address _infrastructure, address _improvements2, address _countryMinter, address _bonusResources) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### generateResources

```solidity
function generateResources(uint256 id) public
```

this function will allow a nation to store the resources they have access to

_this is a public function that is only callable from the country minter contract when a nation is minted
this function will allow a nation to store the resources they have access to
this function will call the chainlink vrf contract to assign the minted nation two resources randomly_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being minted |

### fulfillRequest

```solidity
function fulfillRequest(uint256 id) public
```

_this is the function that will call the chainlink vrf contract to return random numbers
this is an internal function that can only be called from within this contract_

### fulfillRandomWords

```solidity
function fulfillRandomWords(uint256 requestId, uint256[] randomWords) internal
```

_this is the function that the chainlink vrf contract will call when it answers
this function will assign a nation 2 random resources and assure that they are 2 different resources_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | this is the id of the request sent to the vrf contract |
| randomWords | uint256[] | is the random numbers being returned after being generated off chain |

### mockResourcesForTesting

```solidity
function mockResourcesForTesting(uint256 countryId, uint256 resource1, uint256 resource2) public
```

_this is a function that is callable only from the owner of the contract
this function was used in testing of the smart contract and should be deleted before deployment_

### setResources

```solidity
function setResources(uint256 id) internal
```

_this function is an internal function that will be called when a nation is minted or adds or removes a trading partner
this will set the nations assigned resources to true and call the next funtion that will set all the resources of its trading partners to true_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation whose resources ar ebeing reset after minting or adding/removing a trading partner |

### setTrades

```solidity
function setTrades(uint256 id) internal
```

_this function is internal and can only be called by this contract
this function will loop through a nations trading partners and set the resources partner nations to true
this function is called from the previous setResources() function_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation reseting their resources |

### proposeTrade

```solidity
function proposeTrade(uint256 requestorId, uint256 recipientId) public
```

this function allows a nation owner to propose a trade with another nation
once proposed the recipient nation will need to accept the trade
a requesting nation can only have 3 trades active in order to propose a trade (4 with a harbor)
a recipient nation can only have 4 trades active to accept a trade (5 with a harbor)

_this is a public function that can be called by any nation owner
this function allows a nation owner to propose a trade with another nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestorId | uint256 | is the nation id of the nation requesting the trading partnership |
| recipientId | uint256 | is the nation id of the nation receiving the trade proposal |

### cancelProposedTrade

```solidity
function cancelProposedTrade(uint256 nationId, uint256 partnerId) public
```

this function will allow a nation owner to cancel a proposed trande

_this is a public function but is only callable from the nation owner
this function will revert if the partnerId parameter is not a current proposed trade_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| nationId | uint256 | this is the nation Id of the nation owner looking to cancel a proposed trade |
| partnerId | uint256 | this is the nation Id of the proposed trading partner that is getting the proposed trade cancelled |

### getProposedTradingPartners

```solidity
function getProposedTradingPartners(uint256 id) public view returns (uint256[])
```

this function will return a nation's proposed trading partners

_this is a public view function that will return a nations proposed trading partners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256[] | uint256 is an array of the nation id's of a nations proposed trading partners |

### isTradePossibleForRequestor

```solidity
function isTradePossibleForRequestor(uint256 requestorId) internal view returns (bool)
```

this function will return true if the trade is possible for the requestor
a requestor can have a maximum of 3 active and proposed trades (4 with a harbor) in order to propose a trade

_a trade proposal will only go through if a proposal is possible for the requestor and recipient
this function is an internal function that will return a boolean true if the proposed trade is possible for the requestor_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool is true if the trade is possible for the requestor |

### isTradePossibleForRecipient

```solidity
function isTradePossibleForRecipient(uint256 recipientId) internal view returns (bool)
```

this function will return true if the trade is possible for the recipient
a recipient can have a maximum of 4 active and proposed trades (5 with a harbor) in order to have a trade proposed

_a trade proposal will only go through if a proposal is possible for the requestor and recipient
this function is an internal function that will return a boolean true if the proposed trade is possible for the recipient_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool is true if the trade is possible for the recipient |

### fulfillTradingPartner

```solidity
function fulfillTradingPartner(uint256 recipientId, uint256 requestorId) public
```

this function will allow the recipient of a trade proposal to accept a trade proposal
once a trade proposal is accepted the requesting nations and recipient nations resources will be reset to reflect the additional resources

_this is a public function callable from the recipient of a trade proposal that will allow a nation to accept a trade proposal_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipientId | uint256 | is the nation id of the recipient of the trade proposal |
| requestorId | uint256 | is the nation id of the requestor of the trade proposal |

### removeTradingPartner

```solidity
function removeTradingPartner(uint256 nationId, uint256 partnerId) public
```

this function will allow a trade agreement to be terminated

_this is a public function callable by either member of an active trade that will remove the active trade_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| nationId | uint256 | is the nation id of the nation initializing the trade cancellation |
| partnerId | uint256 | is the nation id of the partner nation in the trade agreement being cancelled |

### isProposedTrade

```solidity
function isProposedTrade(uint256 recipientId, uint256 requestorId) public view returns (bool isProposed)
```

_this is a public view function that will take two trading partners in the parameters and return a boolean value
this function will return true if there is a proposed trade between the two nation id's being passed in_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipientId | uint256 | is the nation id of the first nation being queried |
| requestorId | uint256 | is the nation id of the second nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| isProposed | bool | will be true if there is an active proposal between the two nations |

### isActiveTrade

```solidity
function isActiveTrade(uint256 country1Id, uint256 country2Id) public view returns (bool isActive)
```

_this is a public view function that will take two trading partners in the parameters and return a boolean value
this function will return true if there is an active trade between the two nation id's being passed in_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| country1Id | uint256 | is the nation id of the first nation being queried |
| country2Id | uint256 | is the nation id of the second nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| isActive | bool | will be true if there is an active trae between the two nations |

### getResourcesFromTradingPartner

```solidity
function getResourcesFromTradingPartner(uint256 partnerId) public view returns (uint256, uint256)
```

this function will return a given nations 2 randomly selected resources

_this is a public view function that will return the 2 resources for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| partnerId | uint256 | this is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the numerical representation of the nations resources |
| [1] | uint256 |  |

### viewAluminium

```solidity
function viewAluminium(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the aluminium resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the aluminium resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the aluminium resource |

### viewCattle

```solidity
function viewCattle(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the cattle resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the cattle resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the cattle resource |

### viewCoal

```solidity
function viewCoal(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the coal resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the coal resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the coal resource |

### viewFish

```solidity
function viewFish(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the fish resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the fish resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the fish resource |

### viewFurs

```solidity
function viewFurs(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the furs resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the furs resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the furs resource |

### viewGems

```solidity
function viewGems(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the gems resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the gems resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the gems resource |

### viewGold

```solidity
function viewGold(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the gold resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the gold resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the gold resource |

### viewIron

```solidity
function viewIron(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the iron resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the iron resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the iron resource |

### viewLead

```solidity
function viewLead(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the lead resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the lead resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the lead resource |

### viewLumber

```solidity
function viewLumber(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the lumber resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the lumber resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the lumber resource |

### viewMarble

```solidity
function viewMarble(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the marble resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the marble resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the marble resource |

### viewOil

```solidity
function viewOil(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the oil resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the oil resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the oil resource |

### viewPigs

```solidity
function viewPigs(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the pigs resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the pigs resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the pigs resource |

### viewRubber

```solidity
function viewRubber(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the rubber resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the rubber resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the rubber resource |

### viewSilver

```solidity
function viewSilver(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the silver resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the silver resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the silver resource |

### viewSpices

```solidity
function viewSpices(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the spices resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the spices resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the spices resource |

### viewSugar

```solidity
function viewSugar(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the sugar resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the sugar resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the sugar resource |

### viewUranium

```solidity
function viewUranium(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the uranium resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the uranium resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the uranium resource |

### viewWater

```solidity
function viewWater(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the water resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the water resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the water resource |

### viewWheat

```solidity
function viewWheat(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the wheat resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the wheat resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the wheat resource |

### viewWine

```solidity
function viewWine(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the wine resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the wine resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the wine resource |

### getPlayerResources

```solidity
function getPlayerResources(uint256 id) public view returns (uint256[])
```

this function will return an array of a nations 2 selected resources

_this is a public view function that will return an array of a natons 2 resources_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256[] | uint256 is an array of the players resources for the nation id passed into the function |

### getTradingPartners

```solidity
function getTradingPartners(uint256 id) public view returns (uint256[])
```

this function will return a given nation's trading partners

_this is a public view function that will return an array with a nations trading partners_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256[] | uint256 is an array of the nation id's of a nations trading pertners |

## BonusResourcesContract

this contract will keep track of a nations bonus resources

_this contract inherits from chainlink VRF
this contract inherits from oepnzeppelin ownable_

### infrastructure

```solidity
address infrastructure
```

### improvements2

```solidity
address improvements2
```

### countryMinter

```solidity
address countryMinter
```

### resources

```solidity
address resources
```

### mint

```solidity
contract CountryMinter mint
```

### res

```solidity
contract ResourcesContract res
```

### BonusResources

```solidity
struct BonusResources {
  bool beer;
  bool steel;
  bool construction;
  bool fastFood;
  bool fineJewelry;
  bool scholars;
  bool asphalt;
  bool automobiles;
  bool affluentPopulation;
  bool microchips;
  bool radiationCleanup;
}
```

### idToBonusResources

```solidity
mapping(uint256 => struct BonusResourcesContract.BonusResources) idToBonusResources
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### onlyResources

```solidity
modifier onlyResources()
```

### settings

```solidity
function settings(address _infrastructure, address _countryMinter, address _resources) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### generateBonusResources

```solidity
function generateBonusResources(uint256 id) public
```

this function will allow a nation to store the bonus resources they have access to

_this is a public function that is only callable from the country minter contract when a nation is minted
this function will allow a nation to store the bonus resources they have access to_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being minted |

### setBonusResources

```solidity
function setBonusResources(uint256 id) public
```

bonus resources are certain resources that you can get credit for only hen you have the correct mix of primary resources and parameters

_this is an internal function only callable from this contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation whose resources are being reset |

### setAdditionalBonusResources

```solidity
function setAdditionalBonusResources(uint256 id) internal
```

### checkBeer

```solidity
function checkBeer(uint256 id) public view returns (bool)
```

### checkSteel

```solidity
function checkSteel(uint256 id) public view returns (bool)
```

### checkConstruction

```solidity
function checkConstruction(uint256 id) public view returns (bool)
```

### checkFastFood

```solidity
function checkFastFood(uint256 id) public view returns (bool)
```

### checkFineJewelry

```solidity
function checkFineJewelry(uint256 id) public view returns (bool)
```

### checkScholars

```solidity
function checkScholars(uint256 id) public view returns (bool)
```

### checkAsphalt

```solidity
function checkAsphalt(uint256 id) public view returns (bool)
```

### checkAutomobiles

```solidity
function checkAutomobiles(uint256 id) public view returns (bool)
```

### checkAffluentPopulation

```solidity
function checkAffluentPopulation(uint256 id) public view returns (bool)
```

### checkMicrochips

```solidity
function checkMicrochips(uint256 id) public view returns (bool)
```

### checkRadiationCleanup

```solidity
function checkRadiationCleanup(uint256 id) public view returns (bool)
```

### viewAffluentPopulation

```solidity
function viewAffluentPopulation(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the affluent population resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the affluent population resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the affluent population resource |

### viewAsphalt

```solidity
function viewAsphalt(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the asphalt resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the asphalt resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the asphalt resource |

### viewAutomobiles

```solidity
function viewAutomobiles(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the automobiles resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the automobiles resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the automobiles resource |

### viewBeer

```solidity
function viewBeer(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the beer resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the beer resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the beer resource |

### viewConstruction

```solidity
function viewConstruction(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the construction resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the construction resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the construction resource |

### viewFastFood

```solidity
function viewFastFood(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the fast food resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the fast food resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the fast food resource |

### viewFineJewelry

```solidity
function viewFineJewelry(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the fine jewelry resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the fine jewelry resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the fine jewelry resource |

### viewMicrochips

```solidity
function viewMicrochips(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the microships resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the microships resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the microchips resource |

### viewRadiationCleanup

```solidity
function viewRadiationCleanup(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the radiation cleanup resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the radiation cleanup resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the radiation cleanup resource |

### viewScholars

```solidity
function viewScholars(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the scholars resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the scholars resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the scholars resource |

### viewSteel

```solidity
function viewSteel(uint256 id) public view returns (bool)
```

this function will return a boolean value of true if a nation has access to the steel resource

_this is a public view function that will retrun a boolean value of true if a nation has access to the steel resource_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool this value will be true if the nation has the steel resource |

## SenateContract

this contract will allow nation owners to vote for team senators
team senators will be able to sanction nations from trading with trading partners on the same team

_this contract inherits from the openzeppelin ownable contract_

### countryMinter

```solidity
address countryMinter
```

### parameters

```solidity
address parameters
```

### wonders3

```solidity
address wonders3
```

### team1SenatorArray

```solidity
uint256[] team1SenatorArray
```

### team2SenatorArray

```solidity
uint256[] team2SenatorArray
```

### team3SenatorArray

```solidity
uint256[] team3SenatorArray
```

### team4SenatorArray

```solidity
uint256[] team4SenatorArray
```

### team5SenatorArray

```solidity
uint256[] team5SenatorArray
```

### team6SenatorArray

```solidity
uint256[] team6SenatorArray
```

### team7SenatorArray

```solidity
uint256[] team7SenatorArray
```

### team8SenatorArray

```solidity
uint256[] team8SenatorArray
```

### team9SenatorArray

```solidity
uint256[] team9SenatorArray
```

### team10SenatorArray

```solidity
uint256[] team10SenatorArray
```

### team11SenatorArray

```solidity
uint256[] team11SenatorArray
```

### team12SenatorArray

```solidity
uint256[] team12SenatorArray
```

### team13SenatorArray

```solidity
uint256[] team13SenatorArray
```

### team14SenatorArray

```solidity
uint256[] team14SenatorArray
```

### team15SenatorArray

```solidity
uint256[] team15SenatorArray
```

### won3

```solidity
contract WondersContract3 won3
```

### mint

```solidity
contract CountryMinter mint
```

### Voter

```solidity
struct Voter {
  uint256 votes;
  bool voted;
  bool senator;
  uint256 votesToSanction;
  bool sanctioned;
  uint256 team;
}
```

### Vote

```solidity
event Vote(uint256 voterId, uint256 team, uint256 voteCastFor, address voter)
```

### sanctionVotes

```solidity
uint256[] sanctionVotes
```

### settings

```solidity
function settings(address _countryMinter, address _parameters, address _wonders3) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### params

```solidity
contract CountryParametersContract params
```

### idToVoter

```solidity
mapping(uint256 => struct SenateContract.Voter) idToVoter
```

### idToSanctionVotes

```solidity
mapping(uint256 => uint256[]) idToSanctionVotes
```

### election

```solidity
mapping(uint256 => mapping(uint256 => uint256)) election
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### onlyCountryParameters

```solidity
modifier onlyCountryParameters()
```

### updateCountryMinter

```solidity
function updateCountryMinter(address newAddress) public
```

### updateCountryParametersContract

```solidity
function updateCountryParametersContract(address newAddress) public
```

_this function is only callable by the contract owner_

### generateVoter

```solidity
function generateVoter(uint256 id) public
```

this contract will allow set up a nations voting and senate capabilities upon minting

_this function is only callable by the country minter contract when a nation is minted_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being minted |

### updateTeam

```solidity
function updateTeam(uint256 id, uint256 newTeam) public
```

this function will reset a nations team and votes for senator when a nation changes teams

_this function is only callable from the country parameters contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation that changed team |
| newTeam | uint256 | is the id of the new team the given nation joined |

### voteForSenator

```solidity
function voteForSenator(uint256 idVoter, uint256 idOfSenateVote) public
```

this function will allow a nation to vote for a team senator on their team
this function will emit a Vote event when a nation votes
you can only vote for a fellow team member
you can only vote once per epoch

_this is a public function callable only by the nation owner that will allow a nation to vote for a team senator_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| idVoter | uint256 | is the nation id of the nation casting the vote |
| idOfSenateVote | uint256 | is the nation id of the nation being voted for senate |

### inaugurateTeam7Senators

```solidity
function inaugurateTeam7Senators(uint256[] newSenatorArray) public
```

this function will make the nations who won the team 7 election senators

_this is a public function that will be called from an off chain source_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newSenatorArray | uint256[] | is the array of team 7 senators getting elected |

### sanctionTeamMember

```solidity
function sanctionTeamMember(uint256 idSenator, uint256 idSanctioned) public
```

this function will only work if the senator and the nation being sanctioned are on the same team

_this is a public function callable by a senator_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| idSenator | uint256 | is the id of the senator calling the function that will cast the vote to sanction |
| idSanctioned | uint256 | is the nation id of the nation who the senator is voting to sanction |

### liftSanctionVote

```solidity
function liftSanctionVote(uint256 idSenator, uint256 idSanctioned) public
```

### getSanctionVotes

```solidity
function getSanctionVotes(uint256 id) internal view returns (uint256[])
```

### setSanctionArray

```solidity
function setSanctionArray(uint256[] sanctionArray, uint256 idSanctioned) internal
```

### checkIfSenatorVoted

```solidity
function checkIfSenatorVoted(uint256 senatorId, uint256 idSanctioned) internal view returns (bool, uint256)
```

### isSenator

```solidity
function isSenator(uint256 id) public view returns (bool)
```

this function will return if a nation is a senator

_this is a public view function that will return if a nation is a senator_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if a nation is a senator |

## SpyOperationsContract

_this contact inherits from openzeppelin's ownable contract
this contract inherits from chanlinks VRF contract_

### spyAttackId

```solidity
uint256 spyAttackId
```

### forces

```solidity
address forces
```

### infrastructure

```solidity
address infrastructure
```

### military

```solidity
address military
```

### nationStrength

```solidity
address nationStrength
```

### treasury

```solidity
address treasury
```

### parameters

```solidity
address parameters
```

### missiles

```solidity
address missiles
```

### wonders1

```solidity
address wonders1
```

### countryMinter

```solidity
address countryMinter
```

### force

```solidity
contract ForcesContract force
```

### inf

```solidity
contract InfrastructureContract inf
```

### mil

```solidity
contract MilitaryContract mil
```

### strength

```solidity
contract NationStrengthContract strength
```

### tsy

```solidity
contract TreasuryContract tsy
```

### params

```solidity
contract CountryParametersContract params
```

### mis

```solidity
contract MissilesContract mis
```

### won1

```solidity
contract WondersContract1 won1
```

### mint

```solidity
contract CountryMinter mint
```

### SpyAttack

```solidity
struct SpyAttack {
  uint256 attackerId;
  uint256 defenderId;
  uint256 attackType;
}
```

### spyAttackIdToSpyAttack

```solidity
mapping(uint256 => struct SpyOperationsContract.SpyAttack) spyAttackIdToSpyAttack
```

### s_requestIdToRequestIndex

```solidity
mapping(uint256 => uint256) s_requestIdToRequestIndex
```

### s_requestIndexToRandomWords

```solidity
mapping(uint256 => uint256[]) s_requestIndexToRandomWords
```

### randomNumbersRequested

```solidity
event randomNumbersRequested(uint256 requestId)
```

### constructor

```solidity
constructor(address vrfCoordinatorV2, uint64 subscriptionId, bytes32 gasLane, uint32 callbackGasLimit) public
```

### settings

```solidity
function settings(address _infrastructure, address _forces, address _military, address _nationStrength, address _wonders1, address _treasury, address _parameters, address _missiles, address _countryMinter) public
```

### updateInfrastructureContract

```solidity
function updateInfrastructureContract(address newAddress) public
```

### conductSpyOperation

```solidity
function conductSpyOperation(uint256 attackerId, uint256 defenderId, uint256 attackType) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| attackerId | uint256 |  |
| defenderId | uint256 |  |
| attackType | uint256 | is the type of attack 1. gather intelligence 2. destroy cruise missiles 3. destroy defending tanks 4. capture land 5. change governemnt 6. change religion 7. chenge threat level 8. change defcon 9. destroy spies 10. capture tech 11. sabatoge taxes 12. capture money reserves 13. capture infrastructure 14. destroy nukes |

### fulfillRequest

```solidity
function fulfillRequest(uint256 id) public
```

### fulfillRandomWords

```solidity
function fulfillRandomWords(uint256 requestId, uint256[] randomWords) internal
```

fulfillRandomness handles the VRF response. Your contract must
implement it. See "SECURITY CONSIDERATIONS" above for important
principles to keep in mind when implementing your fulfillRandomness
method.

_VRFConsumerBaseV2 expects its subcontracts to have a method with this
signature, and will call it once it has verified the proof
associated with the randomness. (It is triggered via a call to
rawFulfillRandomness, below.)_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | uint256 | The Id initially returned by requestRandomness |
| randomWords | uint256[] | the VRF output expanded to the requested number of words |

### attackOdds

```solidity
function attackOdds(uint256 attackerId, uint256 defenderId) public view returns (uint256, uint256)
```

### getAttackerSuccessScore

```solidity
function getAttackerSuccessScore(uint256 countryId) public view returns (uint256)
```

### getDefenseSuccessScore

```solidity
function getDefenseSuccessScore(uint256 countryId) public view returns (uint256)
```

### executeSpyOperation

```solidity
function executeSpyOperation(uint256 attackerId, uint256 defenderId, uint256 attackType, uint256 attackId, uint256 randomNumber2) internal
```

### gatherIntelligence

```solidity
function gatherIntelligence() internal
```

### destroyCruiseMissiles

```solidity
function destroyCruiseMissiles(uint256 defenderId, uint256 randomNumber2, uint256 attackerId) internal
```

### destroyDefendingTanks

```solidity
function destroyDefendingTanks(uint256 defenderId, uint256 attackId) internal
```

### captureLand

```solidity
function captureLand(uint256 attackerId, uint256 defenderId, uint256 attackId) internal
```

### changeGovernment

```solidity
function changeGovernment(uint256 defenderId, uint256 attackId) internal
```

### changeReligion

```solidity
function changeReligion(uint256 defenderId, uint256 attackId) internal
```

### changeThreatLevel

```solidity
function changeThreatLevel(uint256 defenderId, uint256 attackId) internal
```

### changeDefconLevel

```solidity
function changeDefconLevel(uint256 defenderId, uint256 attackId) internal
```

### destroySpies

```solidity
function destroySpies(uint256 defenderId, uint256 attackId) internal
```

### captueTechnology

```solidity
function captueTechnology(uint256 attackerId, uint256 defenderId, uint256 attackId) internal
```

### sabotogeTaxes

```solidity
function sabotogeTaxes(uint256 defenderId, uint256 attackId) internal
```

### captureMoneyReserves

```solidity
function captureMoneyReserves(uint256 attackerId, uint256 defenderId) internal
```

### captureInfrastructure

```solidity
function captureInfrastructure(uint256 attackerId, uint256 defenderId, uint256 attackId) internal
```

### destroyNukes

```solidity
function destroyNukes(uint256 defenderId) internal
```

## TaxesContract

_this contract inherits from the open zeppelin ownable contract_

### countryMinter

```solidity
address countryMinter
```

### infrastructure

```solidity
address infrastructure
```

### treasury

```solidity
address treasury
```

### improvements1

```solidity
address improvements1
```

### improvements2

```solidity
address improvements2
```

### improvements3

```solidity
address improvements3
```

### parameters

```solidity
address parameters
```

### wonders1

```solidity
address wonders1
```

### wonders2

```solidity
address wonders2
```

### wonders3

```solidity
address wonders3
```

### wonders4

```solidity
address wonders4
```

### resources

```solidity
address resources
```

### forces

```solidity
address forces
```

### military

```solidity
address military
```

### crime

```solidity
address crime
```

### additionalTaxes

```solidity
address additionalTaxes
```

### bonusResources

```solidity
address bonusResources
```

### inf

```solidity
contract InfrastructureContract inf
```

### tsy

```solidity
contract TreasuryContract tsy
```

### imp1

```solidity
contract ImprovementsContract1 imp1
```

### imp2

```solidity
contract ImprovementsContract2 imp2
```

### imp3

```solidity
contract ImprovementsContract3 imp3
```

### params

```solidity
contract CountryParametersContract params
```

### won1

```solidity
contract WondersContract1 won1
```

### won2

```solidity
contract WondersContract2 won2
```

### won3

```solidity
contract WondersContract3 won3
```

### won4

```solidity
contract WondersContract4 won4
```

### res

```solidity
contract ResourcesContract res
```

### frc

```solidity
contract ForcesContract frc
```

### mil

```solidity
contract MilitaryContract mil
```

### crm

```solidity
contract CrimeContract crm
```

### addTax

```solidity
contract AdditionalTaxesContract addTax
```

### mint

```solidity
contract CountryMinter mint
```

### bonus

```solidity
contract BonusResourcesContract bonus
```

### settings1

```solidity
function settings1(address _countryMinter, address _infrastructure, address _treasury, address _improvements1, address _improvements2, address _improvements3, address _additionalTaxes, address _bonusResources) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings2

```solidity
function settings2(address _parameters, address _wonders1, address _wonders2, address _wonders3, address _wonders4, address _resources, address _forces, address _military, address _crime) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### updateCountryMinter

```solidity
function updateCountryMinter(address newAddress) public
```

_this function is only callable by the contract owner_

### updateInfrastructureContract

```solidity
function updateInfrastructureContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateTreasuryContract

```solidity
function updateTreasuryContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementsContract1

```solidity
function updateImprovementsContract1(address newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementsContract2

```solidity
function updateImprovementsContract2(address newAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementsContract3

```solidity
function updateImprovementsContract3(address newAddress) public
```

_this function is only callable by the contract owner_

### updateCountryParametersContract

```solidity
function updateCountryParametersContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateWondersContract2

```solidity
function updateWondersContract2(address newAddress) public
```

_this function is only callable by the contract owner_

### updateWondersContract3

```solidity
function updateWondersContract3(address newAddress) public
```

_this function is only callable by the contract owner_

### updateResourcesContract

```solidity
function updateResourcesContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateForcesContract

```solidity
function updateForcesContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateMilitaryContract

```solidity
function updateMilitaryContract(address newAddress) public
```

_this function is only callable by the contract owner_

### collectTaxes

```solidity
function collectTaxes(uint256 id) public
```

this function will allow a nation owner to collect taxes from their citizens

_this is a public function callable only by the nation owner collecting taxes_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation collecting taxes |

### getTaxesCollectible

```solidity
function getTaxesCollectible(uint256 id) public view returns (uint256, uint256)
```

this function will return a nations taxes collectible

_this is a public view function that will return a nations taxes that are collectible_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | dailyTaxesCollectiblePerCitizen is the tax portion of each citizens income per day |
| [1] | uint256 | taxesCollectible is the amount of taxes that are collectible (daily taxes per citizen * days since last collection * citizen count) |

### getDailyIncome

```solidity
function getDailyIncome(uint256 id) public view returns (uint256)
```

this function will return the gross income per citizen for a given nation

_this is a public view function that will return the daily gross income per citizen for a given nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the daily income of each citizen for a nation |

### getHappiness

```solidity
function getHappiness(uint256 id) public view returns (uint256)
```

this function will return a nations happiness
the higher a nations happiness the more money its citizens will make

_this is a publci view function that will return a nations happiness_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | happiness is the happiness for the queried nation |

### getHappinessPointsToAdd

```solidity
function getHappinessPointsToAdd(uint256 id) public view returns (uint256)
```

### getAdditionalHappinessPointsToAdd

```solidity
function getAdditionalHappinessPointsToAdd(uint256 id) internal view returns (uint256)
```

### getHappinessPointsToSubtract

```solidity
function getHappinessPointsToSubtract(uint256 id) public view returns (uint256)
```

### checkCompatability

```solidity
function checkCompatability(uint256 id) public view returns (uint256 compatability)
```

### checkPopulationDensity

```solidity
function checkPopulationDensity(uint256 id) public view returns (uint256)
```

### getDensityPoints

```solidity
function getDensityPoints(uint256 id) public view returns (uint256)
```

### getPointsFromResources

```solidity
function getPointsFromResources(uint256 id) public view returns (uint256)
```

### getAdditionalPointsFromResources

```solidity
function getAdditionalPointsFromResources(uint256 id) public view returns (uint256)
```

### getPointsFromImprovements

```solidity
function getPointsFromImprovements(uint256 id) public view returns (uint256)
```

### getHappinessFromWonders

```solidity
function getHappinessFromWonders(uint256 id) public view returns (uint256 wonderPts)
```

### wonderChecks1

```solidity
function wonderChecks1(uint256 id) internal view returns (bool, bool, bool, bool, bool)
```

### wonderChecks2

```solidity
function wonderChecks2(uint256 id) internal view returns (bool, bool, bool, bool)
```

### getCasualtyPoints

```solidity
function getCasualtyPoints(uint256 id) public view returns (uint256)
```

### getTechnologyPoints

```solidity
function getTechnologyPoints(uint256 id) public view returns (uint256)
```

### getPointsFromNationAge

```solidity
function getPointsFromNationAge(uint256 id) public view returns (uint256)
```

### getTaxRatePoints

```solidity
function getTaxRatePoints(uint256 id) public view returns (uint256)
```

### getPointsFromIntelAgencies

```solidity
function getPointsFromIntelAgencies(uint256 id) public view returns (uint256)
```

### getPointsFromMilitary

```solidity
function getPointsFromMilitary(uint256 id) public view returns (uint256)
```

### soldierToPopulationRatio

```solidity
function soldierToPopulationRatio(uint256 id) public view returns (uint256, bool, bool)
```

### getPointsFromCriminals

```solidity
function getPointsFromCriminals(uint256 id) public view returns (uint256)
```

## AdditionalTaxesContract

this contract will have additional formulas that will allow a nation to collect taxes from its citizens

_tis contract inherits from openzeppelin's ownable contract_

### infrastructure

```solidity
address infrastructure
```

### improvements2

```solidity
address improvements2
```

### improvements3

```solidity
address improvements3
```

### parameters

```solidity
address parameters
```

### wonders1

```solidity
address wonders1
```

### wonders2

```solidity
address wonders2
```

### wonders3

```solidity
address wonders3
```

### wonders4

```solidity
address wonders4
```

### resources

```solidity
address resources
```

### military

```solidity
address military
```

### bonusResources

```solidity
address bonusResources
```

### inf

```solidity
contract InfrastructureContract inf
```

### imp2

```solidity
contract ImprovementsContract2 imp2
```

### imp3

```solidity
contract ImprovementsContract3 imp3
```

### params

```solidity
contract CountryParametersContract params
```

### won1

```solidity
contract WondersContract1 won1
```

### won2

```solidity
contract WondersContract2 won2
```

### won3

```solidity
contract WondersContract3 won3
```

### won4

```solidity
contract WondersContract4 won4
```

### res

```solidity
contract ResourcesContract res
```

### mil

```solidity
contract MilitaryContract mil
```

### bonus

```solidity
contract BonusResourcesContract bonus
```

### settings

```solidity
function settings(address _parameters, address _wonders1, address _wonders2, address _wonders3, address _wonders4, address _resources, address _military, address _infrastructure, address _bonusResources) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings2

```solidity
function settings2(address _improvements2, address _improvements3) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### getIncomeAdjustments

```solidity
function getIncomeAdjustments(uint256 id) public view returns (uint256)
```

### getResourcePointsForMiningConsortium

```solidity
function getResourcePointsForMiningConsortium(uint256 id) public view returns (uint256)
```

### getNuclearAndUraniumBonus

```solidity
function getNuclearAndUraniumBonus(uint256 id) public view returns (uint256)
```

### getPointsFromTrades

```solidity
function getPointsFromTrades(uint256 id) public view returns (uint256)
```

### getPointsFromDefcon

```solidity
function getPointsFromDefcon(uint256 id) public view returns (uint256)
```

### getPointsToSubtractFromImprovements

```solidity
function getPointsToSubtractFromImprovements(uint256 id) public view returns (uint256)
```

### getUniversityPoints

```solidity
function getUniversityPoints(uint256 id) public view returns (uint256)
```

## TechnologyMarketContract

this contract allows a nation owner to purchase technology

_this contract inherits from openzeppelin's ownable contract_

### countryMinter

```solidity
address countryMinter
```

### infrastructure

```solidity
address infrastructure
```

### resources

```solidity
address resources
```

### improvements3

```solidity
address improvements3
```

### wonders2

```solidity
address wonders2
```

### wonders3

```solidity
address wonders3
```

### wonders4

```solidity
address wonders4
```

### treasury

```solidity
address treasury
```

### bonusResources

```solidity
address bonusResources
```

### mint

```solidity
contract CountryMinter mint
```

### res

```solidity
contract ResourcesContract res
```

### tsy

```solidity
contract TreasuryContract tsy
```

### imp3

```solidity
contract ImprovementsContract3 imp3
```

### won2

```solidity
contract WondersContract2 won2
```

### won3

```solidity
contract WondersContract3 won3
```

### won4

```solidity
contract WondersContract4 won4
```

### inf

```solidity
contract InfrastructureContract inf
```

### bonus

```solidity
contract BonusResourcesContract bonus
```

### settings

```solidity
function settings(address _resources, address _improvements3, address _infrastructure, address _wonders2, address _wonders3, address _wonders4, address _treasury, address _countryMinter, address _bonusResources) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### buyTech

```solidity
function buyTech(uint256 id, uint256 amount) public
```

this function will allow a nation owner to purchase technology

_this is a public function that is only callable by the nation owner_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the nation buying technology |
| amount | uint256 | this is the amount of technology being purchased |

### getTechCost

```solidity
function getTechCost(uint256 id, uint256 amount) public view returns (uint256)
```

this function will return the cost of a technology purchase

_this is a public view function taht will return the cost of a technology purchase_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation buying technology |
| amount | uint256 | is the amount of technology being purchased |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the cost of a technology purchase |

### getTechCostPerLevel

```solidity
function getTechCostPerLevel(uint256 id) public view returns (uint256)
```

this function willreturn the cost a nation has to pay for technology per level

_this is a public view function that will return the cost a nation has to pay for technology per level_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the cost a nation has to pey for technology per level |

### getTechCostMultiplier

```solidity
function getTechCostMultiplier(uint256 id) public view returns (uint256)
```

_this function will adjust a nations tech cost based on wonders improvements and resources_

### destroyTech

```solidity
function destroyTech(uint256 id, uint256 amount) public
```

_this function allows a nation to destroy technology_

## TreasuryContract

this contact will allow a nation owner

_this contract will allow the game owner to withdraw game revenues from the in game purchases
this contract inherits from the openzeppelin ownable contract_

### totalGameBalance

```solidity
uint256 totalGameBalance
```

### counter

```solidity
uint256 counter
```

### wonders1

```solidity
address wonders1
```

### wonders2

```solidity
address wonders2
```

### wonders3

```solidity
address wonders3
```

### wonders4

```solidity
address wonders4
```

### improvements1

```solidity
address improvements1
```

### improvements2

```solidity
address improvements2
```

### improvements3

```solidity
address improvements3
```

### improvements4

```solidity
address improvements4
```

### infrastructure

```solidity
address infrastructure
```

### navy

```solidity
address navy
```

### navy2

```solidity
address navy2
```

### fighters

```solidity
address fighters
```

### bombers

```solidity
address bombers
```

### warBucksAddress

```solidity
address warBucksAddress
```

### forces

```solidity
address forces
```

### missiles

```solidity
address missiles
```

### aid

```solidity
address aid
```

### taxes

```solidity
address taxes
```

### bills

```solidity
address bills
```

### spyAddress

```solidity
address spyAddress
```

### groundBattle

```solidity
address groundBattle
```

### countryMinter

```solidity
address countryMinter
```

### spyOperations

```solidity
address spyOperations
```

### landMarket

```solidity
address landMarket
```

### techMarket

```solidity
address techMarket
```

### infrastructureMarket

```solidity
address infrastructureMarket
```

### keeper

```solidity
address keeper
```

### daysToInactive

```solidity
uint256 daysToInactive
```

### seedMoney

```solidity
uint256 seedMoney
```

### mint

```solidity
contract CountryMinter mint
```

### ground

```solidity
contract GroundBattleContract ground
```

### Treasury

```solidity
struct Treasury {
  uint256 grossIncomePerCitizenPerDay;
  uint256 individualTaxableIncomePerDay;
  uint256 netDailyTaxesCollectable;
  uint256 netDailyBillsPayable;
  uint256 lockedBalance;
  uint256 daysSinceLastBillPaid;
  uint256 lastTaxCollection;
  uint256 daysSinceLastTaxCollection;
  uint256 balance;
  bool inactive;
  bool demonitized;
}
```

### idToTreasury

```solidity
mapping(uint256 => struct TreasuryContract.Treasury) idToTreasury
```

### settings1

```solidity
function settings1(address _warBucksAddress, address _wonders1, address _wonders2, address _wonders3, address _wonders4, address _improvements1, address _improvements2, address _improvements3, address _improvements4, address _infrastructure) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings2

```solidity
function settings2(address _groundBattle, address _countryMinter, address _keeper, address _forces, address _navy, address _fighters, address _bombers, address _aid, address _taxes, address _bills, address _spyAddress) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings3

```solidity
function settings3(address _navy2, address _missiles, address _infrastructureMarket, address _landMarket, address _techMarket) public
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### onlyTaxesContract

```solidity
modifier onlyTaxesContract()
```

### onlySpyContract

```solidity
modifier onlySpyContract()
```

### onlyBillsContract

```solidity
modifier onlyBillsContract()
```

### onlyInfrastructure

```solidity
modifier onlyInfrastructure()
```

### onlyKeeper

```solidity
modifier onlyKeeper()
```

### approvedSpendCaller

```solidity
modifier approvedSpendCaller()
```

### generateTreasury

```solidity
function generateTreasury(uint256 id) public
```

this function will be called when a nation is minted and will allow a nation to undergo treasury operations

_this function is only callable from the country minter contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being minted |

### increaseBalanceOnTaxCollection

```solidity
function increaseBalanceOnTaxCollection(uint256 id, uint256 amount) public
```

_this function is only callable by the taxes contract
this function will increase a nations balance when taxes are collected_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | this is the nation id of the country collecting taxes |
| amount | uint256 | this is the amount of taxes being collected |

### decreaseBalanceOnBillsPaid

```solidity
function decreaseBalanceOnBillsPaid(uint256 id, uint256 amount) public
```

_this function is only callable from the bills contract
this function will decrease a nations balance when bils are paid_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation paying bills |
| amount | uint256 | is the amount of bills being paid |

### spendBalance

```solidity
function spendBalance(uint256 id, uint256 cost) public
```

this function will decrease a nation owner's balance when money is spent within the game

_this function is public but only callable by contracts within the game where funds are being spent
this function will decrease a nation owner's balance when money is spent within the game_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation spending funds |
| cost | uint256 | is the cost of the expense |

### viewTaxRevenues

```solidity
function viewTaxRevenues() public view returns (uint256)
```

_this function will show the balance of warbucks within the contract
when money is spent within the game it can be taxed an deposited within this contract_

### withdrawTaxRevenues

```solidity
function withdrawTaxRevenues(uint256 amount) public
```

_when money is spent within the game it can be taxed an deposited within this contract
this function will allow the contract owner to withdraw the warbucks from this contract into the owners wallet_

### returnBalance

```solidity
function returnBalance(uint256 id, uint256 cost) public
```

_this function is only callable from the infrastructure contract
this function will compensate a nation when they sell land, tech or infrastructure_

### onlyAidContract

```solidity
modifier onlyAidContract()
```

### sendAidBalance

```solidity
function sendAidBalance(uint256 idSender, uint256 idRecipient, uint256 amount) public
```

_this function is only callable from the aid contract
this function will send the balance in an aid package from the sender nation to the recipient nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| idSender | uint256 | is the sender of an aid package |
| idRecipient | uint256 | is the recipient of an aid package |
| amount | uint256 | is the amount of balance being included in the aid package |

### onlyGroundBattle

```solidity
modifier onlyGroundBattle()
```

### transferSpoils

```solidity
function transferSpoils(uint256 randomNumber, uint256 battleId, uint256 attackerId, uint256 defenderId) public
```

_this function is only callable from the ground battle contract
this function will transfer the balance lost in a ground battle to the winning nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| randomNumber | uint256 | is the amount of balance being transferred |
| battleId | uint256 |  |
| attackerId | uint256 | is the nation id of the attacking nation |
| defenderId | uint256 | is the nation id of the defending nation |

### withdrawFunds

```solidity
function withdrawFunds(uint256 amount, uint256 id) public
```

this function allows a nation owner to withdraw funds from their nation

_this function is only callable from a nation owner
this function allows a nation owner to withdraw funds from their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of funds being withdrawn |
| id | uint256 | is the nation id of the nation withdrawing funds |

### addFunds

```solidity
function addFunds(uint256 amount, uint256 id) public
```

this function allows a nation owner to add funds to their nation

_this function is only callable from a nation owner
this function allows a nation owner to add funds to their nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | is the amount of funds being added |
| id | uint256 | is the nation id of the nation withdrawing funds |

### incrementDaysSince

```solidity
function incrementDaysSince() external
```

this function will increment the number of days since bills wre paid and taxes were collected
if a nation does not pay thir bills for a set amount of time (default is 20 days) the nation will be put into inactive mode

_ths function is only callable from the keeper contract
this function will increment the number of days since bills wre paid and taxes were collected_

### setGameTaxRate

```solidity
function setGameTaxRate(uint256 newPercentage) public
```

_this function allows the contract owner to set the tax rate in game purchases are taxed at
the tax rate will be the % of the purchase price that is minted into this contract that can be withdrawn later_

### getGameTaxRate

```solidity
function getGameTaxRate() public view returns (uint256)
```

_this funtion will reuturn the game tax rate_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 will be the tax rate at which purchases in the game are taxed at |

### setDaysToInactive

```solidity
function setDaysToInactive(uint256 newDays) public
```

this function will allow the contract owner to set the number of days a nation cannot pay bill until it becomes inactive

_this function is only callable from the contract owner
this function will allow the contract owner to set the number of days a nation cannot pay bill until it becomes inactive_

### getDaysSinceLastTaxCollection

```solidity
function getDaysSinceLastTaxCollection(uint256 id) public view returns (uint256)
```

this funtion will return the number of days it has been since a nation has collected taxes

_this funtion is a public view function that will return the number of days it has been since a nation has collected taxes_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of days since a nation has collected taxes |

### getDaysSinceLastBillsPaid

```solidity
function getDaysSinceLastBillsPaid(uint256 id) public view returns (uint256)
```

this funtion will return the number of days it has been since a nation has paid bills

_this funtion is a public view function that will return the number of days it has been since a nation has paid bills_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the number of days since a nation has paid bills |

### checkBalance

```solidity
function checkBalance(uint256 id) public view returns (uint256)
```

this function will return a given nations in game balance

_this is a public view function that will return a nations in game balance_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queries |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | uint256 is the balance of war bucks for the nation |

### transferBalance

```solidity
function transferBalance(uint256 toId, uint256 fromId, uint256 amount) public
```

_this function is only callable from the spy contract
this function will allow the spy contract to transfer a nations balance to an attacking nation upon a successful spy attack_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| toId | uint256 | is the nation id of the nation recieving the balance (attacking nation) |
| fromId | uint256 | is the nation id of the nation recieving the balance (receiving nation) |
| amount | uint256 | is the amount of balance being transferred |

### checkInactive

```solidity
function checkInactive(uint256 id) public view returns (bool)
```

this function will retun if a nation is inactive

_this is a public view function that will return if a nation is inactive_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation is inactive |

### demonitizeNation

```solidity
function demonitizeNation(uint256 id) public
```

### remonitizeNation

```solidity
function remonitizeNation(uint256 id) public
```

### getTotalGameBalance

```solidity
function getTotalGameBalance() public view returns (uint256)
```

## WarContract

this contact will allow a naion owner to declare war on another nation

_this contract inherits from openzeppelin's ownable contract_

### warId

```solidity
uint256 warId
```

### countryMinter

```solidity
address countryMinter
```

### nationStrength

```solidity
address nationStrength
```

### military

```solidity
address military
```

### breakBlockadeAddress

```solidity
address breakBlockadeAddress
```

### navalAttackAddress

```solidity
address navalAttackAddress
```

### airBattleAddress

```solidity
address airBattleAddress
```

### groundBattle

```solidity
address groundBattle
```

### cruiseMissile

```solidity
address cruiseMissile
```

### forces

```solidity
address forces
```

### wonders1

```solidity
address wonders1
```

### keeper

```solidity
address keeper
```

### treasury

```solidity
address treasury
```

### activeWars

```solidity
uint256[] activeWars
```

### nsc

```solidity
contract NationStrengthContract nsc
```

### mil

```solidity
contract MilitaryContract mil
```

### won1

```solidity
contract WondersContract1 won1
```

### mint

```solidity
contract CountryMinter mint
```

### tres

```solidity
contract TreasuryContract tres
```

### War

```solidity
struct War {
  uint256 offenseId;
  uint256 defenseId;
  bool active;
  uint256 daysLeft;
  bool peaceDeclared;
  bool expired;
  bool offensePeaceOffered;
  bool defensePeaceOffered;
  uint256 offenseBlockades;
  uint256 defenseBlockades;
  uint256 offenseCruiseMissileLaunchesToday;
  uint256 defenseCruiseMissileLaunchesToday;
}
```

### OffenseDeployed1

```solidity
struct OffenseDeployed1 {
  bool offenseDeployedToday;
  uint256 soldiersDeployed;
  uint256 tanksDeployed;
  uint256 yak9Deployed;
  uint256 p51MustangDeployed;
  uint256 f86SabreDeployed;
  uint256 mig15Deployed;
  uint256 f100SuperSabreDeployed;
  uint256 f35LightningDeployed;
  uint256 f15EagleDeployed;
  uint256 su30MkiDeployed;
  uint256 f22RaptorDeployed;
}
```

### OffenseDeployed2

```solidity
struct OffenseDeployed2 {
  uint256 ah1CobraDeployed;
  uint256 ah64ApacheDeployed;
  uint256 bristolBlenheimDeployed;
  uint256 b52MitchellDeployed;
  uint256 b17gFlyingFortressDeployed;
  uint256 b52StratofortressDeployed;
  uint256 b2SpiritDeployed;
  uint256 b1bLancerDeployed;
  uint256 tupolevTu160Deployed;
}
```

### DefenseDeployed1

```solidity
struct DefenseDeployed1 {
  bool defenseDeployedToday;
  uint256 soldiersDeployed;
  uint256 tanksDeployed;
  uint256 yak9Deployed;
  uint256 p51MustangDeployed;
  uint256 f86SabreDeployed;
  uint256 mig15Deployed;
  uint256 f100SuperSabreDeployed;
  uint256 f35LightningDeployed;
  uint256 f15EagleDeployed;
  uint256 su30MkiDeployed;
  uint256 f22RaptorDeployed;
}
```

### DefenseDeployed2

```solidity
struct DefenseDeployed2 {
  uint256 ah1CobraDeployed;
  uint256 ah64ApacheDeployed;
  uint256 bristolBlenheimDeployed;
  uint256 b52MitchellDeployed;
  uint256 b17gFlyingFortressDeployed;
  uint256 b52StratofortressDeployed;
  uint256 b2SpiritDeployed;
  uint256 b1bLancerDeployed;
  uint256 tupolevTu160Deployed;
}
```

### OffenseLosses

```solidity
struct OffenseLosses {
  uint256 warId;
  uint256 nationId;
  uint256 soldiersLost;
  uint256 tanksLost;
  uint256 cruiseMissilesLost;
  uint256 aircraftLost;
  uint256 navyStrengthLost;
  uint256 infrastructureLost;
  uint256 technologyLost;
  uint256 landLost;
}
```

### DefenseLosses

```solidity
struct DefenseLosses {
  uint256 warId;
  uint256 nationId;
  uint256 soldiersLost;
  uint256 tanksLost;
  uint256 cruiseMissilesLost;
  uint256 aircraftLost;
  uint256 navyStrengthLost;
  uint256 infrastructureLost;
  uint256 technologyLost;
  uint256 landLost;
}
```

### warIdToWar

```solidity
mapping(uint256 => struct WarContract.War) warIdToWar
```

### warIdToOffenseDeployed1

```solidity
mapping(uint256 => struct WarContract.OffenseDeployed1) warIdToOffenseDeployed1
```

### warIdToOffenseDeployed2

```solidity
mapping(uint256 => struct WarContract.OffenseDeployed2) warIdToOffenseDeployed2
```

### warIdToDefenseDeployed1

```solidity
mapping(uint256 => struct WarContract.DefenseDeployed1) warIdToDefenseDeployed1
```

### warIdToDefenseDeployed2

```solidity
mapping(uint256 => struct WarContract.DefenseDeployed2) warIdToDefenseDeployed2
```

### warIdToOffenseLosses

```solidity
mapping(uint256 => struct WarContract.OffenseLosses) warIdToOffenseLosses
```

### warIdToDefenseLosses

```solidity
mapping(uint256 => struct WarContract.DefenseLosses) warIdToDefenseLosses
```

### idToActiveWars

```solidity
mapping(uint256 => uint256[]) idToActiveWars
```

### idToOffensiveWars

```solidity
mapping(uint256 => uint256[]) idToOffensiveWars
```

### settings

```solidity
function settings(address _countryMinter, address _nationStrength, address _military, address _breakBlockadeAddress, address _navalAttackAddress, address _airBattleAddress, address _groundBattle, address _cruiseMissile, address _forces, address _wonders1, address _keeper) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### settings2

```solidity
function settings2(address _treasury) public
```

### updateCountryMinterContract

```solidity
function updateCountryMinterContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateNationStrengthContract

```solidity
function updateNationStrengthContract(address newAddress) public
```

_this function is only callable by the contract owner_

### updateMilitaryContract

```solidity
function updateMilitaryContract(address newAddress) public
```

_this function is only callable by the contract owner_

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### onlyCruiseMissileContract

```solidity
modifier onlyCruiseMissileContract()
```

### declareWar

```solidity
function declareWar(uint256 offenseId, uint256 defenseId) public
```

this function allows a nation to declare war on another nation
when war is declared the nations can attack each other
a nation can only have a maximum of 4 offensive wars (5 with a foreign army base)

_this function is only callable from a nation owner and allow a natio nto eclare war on another nation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| offenseId | uint256 | is the nation id of the nation declaring war |
| defenseId | uint256 | is the nation id of the nation having war declared on it |

### warCheck

```solidity
function warCheck(uint256 offenseId, uint256 defenseId) internal view returns (bool)
```

### offensiveWarLengthForTesting

```solidity
function offensiveWarLengthForTesting(uint256 offenseId) public view returns (uint256)
```

### offensiveWarReturnForTesting

```solidity
function offensiveWarReturnForTesting(uint256 offenseId) public view returns (uint256[])
```

### nationActiveWarsReturnForTesting

```solidity
function nationActiveWarsReturnForTesting(uint256 offenseId) public view returns (uint256[])
```

### gameActiveWars

```solidity
function gameActiveWars() public view returns (uint256[])
```

### initializeDeployments

```solidity
function initializeDeployments(uint256 _warId) internal
```

_this is an internal function that will be balled by the declare war function and set up several structs that will keep track of each war_

### checkStrength

```solidity
function checkStrength(uint256 offenseId, uint256 defenseId) public view returns (bool)
```

this function will return a boolean value of true if the nations are able to fight eachother
in order for a war to be declared the offense strength must be within 75% and 133% of the defending nation

_this is a public view function that will return a boolean value if the nations are able to fight eachother_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| offenseId | uint256 | is the nation id of the aggressor nation |
| defenseId | uint256 | if the nation id of the defending nation |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nations are within range where war is possible |

### offerPeace

```solidity
function offerPeace(uint256 offerId, uint256 _warId) public
```

this funtion will allow a nation involved in a war to offer peace
if the offense and the defense offer peace then peace will be declares
an attack will nullify any existing peace offers

_this is a public function that will allow a nation involved in a war to offer peace_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| offerId | uint256 | is the nation offering peace |
| _warId | uint256 | is the war id for the war where peace is being offered |

### checkWar

```solidity
function checkWar(uint256 _warId) public view returns (bool, bool, bool, bool, bool)
```

this function will return information about a war

_this is a public view function that will return information about a war_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _warId | uint256 | is the war id of the war being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | offensePeaceOffered is a boolean value that will be true if the offense offered peace |
| [1] | bool | defensePeaceOffered is a boolean value that will be true if the defense nation offered peace |
| [2] | bool | warActive will return a boolean true if the war is still active |
| [3] | bool | peaceDeclared will return a boolean true of peace was declared by both sides |
| [4] | bool | expired will return a boolean true if the war expired (days left reached 0) |

### removeActiveWar

```solidity
function removeActiveWar(uint256 _warId) internal
```

_this is an internal function that will remove the active war from each nation when peace is declared or the war expires_

### onlyKeeper

```solidity
modifier onlyKeeper()
```

### decrementWarDaysLeft

```solidity
function decrementWarDaysLeft() public
```

wars expire after 7 days and will be removed from active wars when daysLeft reaches 0

_this function is only callable from the keeper contract
wars expire after 7 days and will be removed from active wars when daysLeft reaches 0_

### resetCruiseMissileLaunches

```solidity
function resetCruiseMissileLaunches() public
```

this function will reset cruise missile launches daily to 0
a nation can only launch 2 cruise missiles per day per war

_this function is only callable from the keeper contract_

### resetDeployedToday

```solidity
function resetDeployedToday() public
```

this function will reset the active wars daily so that forces can be deployed again
a nation can only deploy forces to a war once per day

_this function is only callable from the keeper contract_

### onlyNavyBattle

```solidity
modifier onlyNavyBattle()
```

### addNavyCasualties

```solidity
function addNavyCasualties(uint256 _warId, uint256 nationId, uint256 navyCasualties) public
```

_this function is only callable from the navy battle contract and will increment navy casualties_

### incrementCruiseMissileAttack

```solidity
function incrementCruiseMissileAttack(uint256 _warId, uint256 nationId) public
```

this function will only allow a nation to launch 2 cruise missiles per war per day

_this function is only callable from the cruise missile contract and will only allow a nation to launch 2 cruise missiles per war per day_

### isWarActive

```solidity
function isWarActive(uint256 _warId) public view returns (bool)
```

this function will return whether a war is active or not

_this is a public view function that will take a war id as a parameter and return whether the war is active or not_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _warId | uint256 | is the warId being queries |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the war is active |

### getInvolvedParties

```solidity
function getInvolvedParties(uint256 _warId) public view returns (uint256, uint256)
```

_this is a public view function that will return the two members f a given warId_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _warId | uint256 | is the warId of the war being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | offenseId is the nation id of the offensive nation in the war |
| [1] | uint256 | defenseId is the nation id of the defensive nation in the war |

### isPeaceOffered

```solidity
function isPeaceOffered(uint256 _warId) public view returns (bool)
```

this function will return true if one of the nations has offered peace

_this is a public view function that will return true if one of the nations has offered peace_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _warId | uint256 | is the war id of the war being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if one of the nation has offered peace |

### onlyBattle

```solidity
modifier onlyBattle()
```

### cancelPeaceOffersUponAttack

```solidity
function cancelPeaceOffersUponAttack(uint256 _warId) public
```

### getDaysLeft

```solidity
function getDaysLeft(uint256 _warId) public view returns (uint256)
```

_this is a publci view function that will return the number of days left in a war
wars expire after 7 days when days left == 0_

### getDeployedFightersLowStrength

```solidity
function getDeployedFightersLowStrength(uint256 _warId, uint256 countryId) public view returns (uint256, uint256, uint256, uint256, uint256)
```

### getDeployedFightersHighStrength

```solidity
function getDeployedFightersHighStrength(uint256 _warId, uint256 countryId) public view returns (uint256, uint256, uint256, uint256)
```

### getDeployedBombersLowStrength

```solidity
function getDeployedBombersLowStrength(uint256 _warId, uint256 countryId) public view returns (uint256, uint256, uint256, uint256, uint256)
```

### getDeployedBombersHighStrength

```solidity
function getDeployedBombersHighStrength(uint256 _warId, uint256 countryId) public view returns (uint256, uint256, uint256, uint256)
```

### onlyAirBattle

```solidity
modifier onlyAirBattle()
```

### resetDeployedBombers

```solidity
function resetDeployedBombers(uint256 _warId, uint256 countryId) public
```

### decrementLosses

```solidity
function decrementLosses(uint256 _warId, uint256[] defenderLosses, uint256 defenderId, uint256[] attackerLosses, uint256 attackerId) public
```

### addAirBattleCasualties

```solidity
function addAirBattleCasualties(uint256 _warId, uint256 nationId, uint256 battleCausalties) public
```

_this function is only callable fro mthe air battle contract
this function will increment air battle casualties_

### onlyForcesContract

```solidity
modifier onlyForcesContract()
```

### deployForcesToWar

```solidity
function deployForcesToWar(uint256 nationId, uint256 _warId, uint256 soldiersToDeploy, uint256 tanksToDeploy) public
```

this function will allow a nation to deploy ground forces (soldiers and tanks) to a given war

_this function is only callable from the forces contact_

### getDeployedGroundForces

```solidity
function getDeployedGroundForces(uint256 _warId, uint256 attackerId) public view returns (uint256, uint256)
```

_this is a public view function that will return the number of ground forces a nation has deploed to a war_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _warId | uint256 | is the war id of the war where the forces are deployed |
| attackerId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | soldiersDeployed is the soldiers the given nation has deployed to the given war |
| [1] | uint256 | tanksDeployed is the tanks the given nation has deployed to the given war |

### onlyGroundBattle

```solidity
modifier onlyGroundBattle()
```

### decreaseGroundBattleLosses

```solidity
function decreaseGroundBattleLosses(uint256 soldierLosses, uint256 tankLosses, uint256 attackerId, uint256 _warId) public
```

_this function is only callable from the groun battle contract
this function will increment ground forces casualties_

## WarBucks

_This is the contact for the currency used to purchase items in the game
Inherits from OpenZeppelin ERC20 and Ownable
The deployer of the contract will be the owner_

### treasury

```solidity
address treasury
```

### constructor

```solidity
constructor(uint256 initialSupply) public
```

_The initial supply is minted to the deployer of the contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| initialSupply | uint256 | is the inital supply of WarBucks currency |

### onlyTreasury

```solidity
modifier onlyTreasury()
```

_This modifier exists in order to allow the TreasuryContract to mint and burn tokens_

### settings

```solidity
function settings(address _treasury) public
```

_This function is called by the owner after deployment in order to update the treasury contract address for the onlyTreasury modifer_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _treasury | address | is the address of the treasury contract |

### mintFromTreasury

```solidity
function mintFromTreasury(address account, uint256 amount) external
```

_This function can only be called from the treasury contract_

### burnFromTreasury

```solidity
function burnFromTreasury(address account, uint256 amount) external
```

_This function can only be called from the treasury contract_

## WondersContract1

this contract will strore information about a nations wonders

_this contract inherits from openzeppelin's ownable contract_

### treasuryAddress

```solidity
address treasuryAddress
```

### wondersContract2Address

```solidity
address wondersContract2Address
```

### wondersContract3Address

```solidity
address wondersContract3Address
```

### wondersContract4Address

```solidity
address wondersContract4Address
```

### infrastructureAddress

```solidity
address infrastructureAddress
```

### countryMinter

```solidity
address countryMinter
```

### agricultureDevelopmentCost

```solidity
uint256 agricultureDevelopmentCost
```

### antiAirDefenseNetworkCost

```solidity
uint256 antiAirDefenseNetworkCost
```

### centralIntelligenceAgencyCost

```solidity
uint256 centralIntelligenceAgencyCost
```

### disasterReliefAgencyCost

```solidity
uint256 disasterReliefAgencyCost
```

### empWeaponizationCost

```solidity
uint256 empWeaponizationCost
```

### falloutShelterSystemCost

```solidity
uint256 falloutShelterSystemCost
```

### federalAidCommissionCost

```solidity
uint256 federalAidCommissionCost
```

### federalReserveCost

```solidity
uint256 federalReserveCost
```

### foreignAirForceBaseCost

```solidity
uint256 foreignAirForceBaseCost
```

### foreignArmyBaseCost

```solidity
uint256 foreignArmyBaseCost
```

### foreignNavalBaseCost

```solidity
uint256 foreignNavalBaseCost
```

### mint

```solidity
contract CountryMinter mint
```

### Wonders1

```solidity
struct Wonders1 {
  uint256 wonderCount;
  bool agricultureDevelopmentProgram;
  bool antiAirDefenseNetwork;
  bool centralIntelligenceAgency;
  bool disasterReliefAgency;
  bool empWeaponization;
  bool falloutShelterSystem;
  bool federalAidCommission;
  bool federalReserve;
  bool foreignAirForceBase;
  bool foreignArmyBase;
  bool foreignNavalBase;
}
```

### idToWonders1

```solidity
mapping(uint256 => struct WondersContract1.Wonders1) idToWonders1
```

### approvedAddress

```solidity
modifier approvedAddress()
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### settings

```solidity
function settings(address _treasuryAddress, address _wonderContract2Address, address _wonderContract3Address, address _wonderContract4Address, address _infrastructureAddress, address _countryMinter) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _newTreasuryAddress) public
```

_this function is only callable by the contract owner_

### updateWondersAddresses

```solidity
function updateWondersAddresses(address _wonderContract2Address, address _wonderContract3Address, address _wonderContract4Address) public
```

_this function is only callable by the contract owner_

### updateInfrastructureAddresses

```solidity
function updateInfrastructureAddresses(address _infrastructureAddress) public
```

_this function is only callable by the contract owner_

### getWonderCount

```solidity
function getWonderCount(uint256 id) public view returns (uint256 count)
```

this function will return the number of wonders a given nation owns

_this is a public view function that will return the number of wonders a given nation owns_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| count | uint256 | is the number of wonder a given nation owns |

### addWonderCount

```solidity
function addWonderCount(uint256 id) public
```

_this function is only callable from other wonder contracts
this function will increment the number of wonders a nation owns when a wonder is purchased in another contract_

### subtractWonderCount

```solidity
function subtractWonderCount(uint256 id) public
```

_this function is only callable from other wonder contracts
this function will decremeny the number of wonders a nation owns when a wonder is deleted in another contract_

### generateWonders1

```solidity
function generateWonders1(uint256 id) public
```

this function will be called when a nation is minted and allow a nation to buy the wonders in this contract

_this function is only callable from the country minter contract_

### updateAgricultureDevelopmentCost

```solidity
function updateAgricultureDevelopmentCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateAntiAirDefenseNetworkCost

```solidity
function updateAntiAirDefenseNetworkCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateCentralIntelligenceAgencyCost

```solidity
function updateCentralIntelligenceAgencyCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateDisasterReliefAgencyCost

```solidity
function updateDisasterReliefAgencyCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateEmpWeaponizationCost

```solidity
function updateEmpWeaponizationCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateFalloutShelterSystemCost

```solidity
function updateFalloutShelterSystemCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateFederalAidCommissionCost

```solidity
function updateFederalAidCommissionCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateFederalReserveCost

```solidity
function updateFederalReserveCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateForeignAirForceBaseCost

```solidity
function updateForeignAirForceBaseCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateForeignArmyBaseCost

```solidity
function updateForeignArmyBaseCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateForeignNavalBaseCost

```solidity
function updateForeignNavalBaseCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### buyWonder1

```solidity
function buyWonder1(uint256 countryId, uint256 wonderId) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 |  |
| wonderId | uint256 | is the id of the wonder 1. agricultrual development program 2. air defense network 3. central intelligence agency 4. disaster relief agency 5. emp weaponization 6. fallout shelter system  7. federal aid commission 8. federal reserve 9. foreign air force base 10. foreign army base 11. foreign naval base |

### deleteWonder1

```solidity
function deleteWonder1(uint256 countryId, uint256 wonderId) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 |  |
| wonderId | uint256 | is the id of the wonder 1. agricultrual development program 2. air defense network 3. central intelligence agency 4. disaster relief agency 5. emp weaponization 6. fallout shelter system  7. federal aid commission 8. federal reserve 9. foreign air force base 10. foreign army base 11. foreign naval base |

### getAgriculturalDevelopmentProgram

```solidity
function getAgriculturalDevelopmentProgram(uint256 id) public view returns (bool)
```

_this is a public view function that will return true if a nation has the agriculture development program wonder
this function will return true if a nation has the agriculture development program wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getAntiAirDefenseNewtwork

```solidity
function getAntiAirDefenseNewtwork(uint256 id) public view returns (bool)
```

_this is a public view function that will return true if a nation has the anti air defense network wonder
this function will return true if a nation has the anti air defense network wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getCentralIntelligenceAgency

```solidity
function getCentralIntelligenceAgency(uint256 id) public view returns (bool)
```

_this is a public view function that will return true if a nation has the central intelligence agency wonder
this function will return true if a nation has the central intelligence agency wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getDisasterReliefAgency

```solidity
function getDisasterReliefAgency(uint256 id) public view returns (bool)
```

_this is a public view function that will return true if a nation has the disaster relief agency wonder
this function will return true if a nation has the disaster relief agency wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getEmpWeaponization

```solidity
function getEmpWeaponization(uint256 id) public view returns (bool)
```

_this is a public view function that will return true if a nation has the emp weaponization wonder
this function will return true if a nation has the emp weaponization wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getFalloutShelterSystem

```solidity
function getFalloutShelterSystem(uint256 id) public view returns (bool)
```

_this is a public view function that will return true if a nation has the fallout shelter system wonder
this function will return true if a nation has the fallout shelter system wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getFederalAidComission

```solidity
function getFederalAidComission(uint256 id) public view returns (bool)
```

_this is a public view function that will return true if a nation has the federal aig commission wonder
this function will return true if a nation has the federal aig commission wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getFederalReserve

```solidity
function getFederalReserve(uint256 id) public view returns (bool)
```

_this is a public view function that will return true if a nation has the federal reserve wonder
this function will return true if a nation has the federal reserve wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getForeignAirforceBase

```solidity
function getForeignAirforceBase(uint256 id) public view returns (bool)
```

_this is a public view function that will return true if a nation has the foreign air force base wonder
this function will return true if a nation has the foreign air force base wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getForeignArmyBase

```solidity
function getForeignArmyBase(uint256 id) public view returns (bool)
```

_this is a public view function that will return true if a nation has the foreign army base wonder
this function will return true if a nation has the foreign army base wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getForeignNavalBase

```solidity
function getForeignNavalBase(uint256 id) public view returns (bool)
```

_this is a public view function that will return true if a nation has the foreign naval base wonder
this function will return true if a nation has the foreign naval base wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getWonderCosts1

```solidity
function getWonderCosts1() public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

_this function will return the costs of the wonders in this contract_

## WondersContract2

this contract will strore information about a nations wonders

_this contract inherits from openzeppelin's ownable contract_

### treasuryAddress

```solidity
address treasuryAddress
```

### infrastructureAddress

```solidity
address infrastructureAddress
```

### wonderContract1Address

```solidity
address wonderContract1Address
```

### wonderContract3Address

```solidity
address wonderContract3Address
```

### wonderContract4Address

```solidity
address wonderContract4Address
```

### countryMinter

```solidity
address countryMinter
```

### greatMonumentCost

```solidity
uint256 greatMonumentCost
```

### greatTempleCost

```solidity
uint256 greatTempleCost
```

### greatUniversityCost

```solidity
uint256 greatUniversityCost
```

### hiddenNuclearMissileSiloCost

```solidity
uint256 hiddenNuclearMissileSiloCost
```

### interceptorMissileSystemCost

```solidity
uint256 interceptorMissileSystemCost
```

### internetCost

```solidity
uint256 internetCost
```

### interstateSystemCost

```solidity
uint256 interstateSystemCost
```

### manhattanProjectCost

```solidity
uint256 manhattanProjectCost
```

### miningIndustryConsortiumCost

```solidity
uint256 miningIndustryConsortiumCost
```

### mint

```solidity
contract CountryMinter mint
```

### Wonders2

```solidity
struct Wonders2 {
  bool greatMonument;
  bool greatTemple;
  bool greatUniversity;
  bool hiddenNuclearMissileSilo;
  bool interceptorMissileSystem;
  bool internet;
  bool interstateSystem;
  bool manhattanProject;
  bool miningIndustryConsortium;
}
```

### idToWonders2

```solidity
mapping(uint256 => struct WondersContract2.Wonders2) idToWonders2
```

### settings

```solidity
function settings(address _treasury, address _infrastructure, address _wonders1, address _wonders3, address _wonders4, address _countryMinter) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _newTreasuryAddress) public
```

_this function is only callable by the contract owner_

### updateWonderContract1Address

```solidity
function updateWonderContract1Address(address _wonderContract1Address) public
```

_this function is only callable by the contract owner_

### updateWonderContract3Address

```solidity
function updateWonderContract3Address(address _wonderContract3Address) public
```

_this function is only callable by the contract owner_

### updateWonderContract4Address

```solidity
function updateWonderContract4Address(address _wonderContract4Address) public
```

_this function is only callable by the contract owner_

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address _infrastructureAddress) public
```

_this function is only callable by the contract owner_

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### generateWonders2

```solidity
function generateWonders2(uint256 id) public
```

this function will be called when a nation is minted and allow a nation to buy the wonders in this contract

_this function is only callable from the country minter contract_

### updateGreatMonumentCost

```solidity
function updateGreatMonumentCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateGreatTempleCost

```solidity
function updateGreatTempleCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateGreatUniversityCost

```solidity
function updateGreatUniversityCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateHiddenNuclearMissileSiloCost

```solidity
function updateHiddenNuclearMissileSiloCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateInterceptorMissileSystemCost

```solidity
function updateInterceptorMissileSystemCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateInternetCost

```solidity
function updateInternetCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateInterstateSystemCost

```solidity
function updateInterstateSystemCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateManhattanProjectCost

```solidity
function updateManhattanProjectCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateMiningIndustryConsortiumCost

```solidity
function updateMiningIndustryConsortiumCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### buyWonder2

```solidity
function buyWonder2(uint256 countryId, uint256 wonderId) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 |  |
| wonderId | uint256 | is the id of the wonder 1. great monumnet 2. great temple 3. great university 4. hidden nuclear missile silo 5. interceptor missile system 6. internat 7. interstate system 8. manhattan project 9. minimg industry consortium |

### deleteWonder2

```solidity
function deleteWonder2(uint256 countryId, uint256 wonderId) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 |  |
| wonderId | uint256 | is the id of the wonder 1. great monumnet 2. great temple 3. great university 4. hidden nuclear missile silo 5. interceptor missile system 6. internat 7. interstate system 8. manhattan project 9. minimg industry consortium |

### getGreatMonument

```solidity
function getGreatMonument(uint256 id) public view returns (bool)
```

_this is a public view function that will return true if a nation has the great monument wonder
this function will return true if a nation has the great monument wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getGreatTemple

```solidity
function getGreatTemple(uint256 id) public view returns (bool)
```

_this is a public view function that will return true if a nation has the great temple wonder
this function will return true if a nation has the great temple wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getGreatUniversity

```solidity
function getGreatUniversity(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the great university wonder
this function will return true if a nation has the great university wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getHiddenNuclearMissileSilo

```solidity
function getHiddenNuclearMissileSilo(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the hidden nuclear missile silo wonder
this function will return true if a nation has the hidden nuclear missile silo wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getInterceptorMissileSystem

```solidity
function getInterceptorMissileSystem(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the intereptor missile system wonder
this function will return true if a nation has the intereptor missile system wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getInternet

```solidity
function getInternet(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the internet wonder
this function will return true if a nation has the internet wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getInterstateSystem

```solidity
function getInterstateSystem(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the interstate system wonder
this function will return true if a nation has the interstate system wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getManhattanProject

```solidity
function getManhattanProject(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the manhattan project wonder
this function will return true if a nation has the manhattan project wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getMiningIndustryConsortium

```solidity
function getMiningIndustryConsortium(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the mining industry consortium wonder
this function will return true if a nation has the mining industry consortium wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getWonderCosts2

```solidity
function getWonderCosts2() public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

_this function will return the costs of the wonders in this contract_

## WondersContract3

this contract will strore information about a nations wonders

_this contract inherits from openzeppelin's ownable contract_

### treasuryAddress

```solidity
address treasuryAddress
```

### infrastructureAddress

```solidity
address infrastructureAddress
```

### wonderContract1Address

```solidity
address wonderContract1Address
```

### wonderContract2Address

```solidity
address wonderContract2Address
```

### wonderContract4Address

```solidity
address wonderContract4Address
```

### forces

```solidity
address forces
```

### countryMinter

```solidity
address countryMinter
```

### movieIndustryCost

```solidity
uint256 movieIndustryCost
```

### nationalCemetaryCost

```solidity
uint256 nationalCemetaryCost
```

### nationalEnvironmentOfficeCost

```solidity
uint256 nationalEnvironmentOfficeCost
```

### nationalResearchLabCost

```solidity
uint256 nationalResearchLabCost
```

### nationalWarMemorialCost

```solidity
uint256 nationalWarMemorialCost
```

### nuclearPowerPlantCost

```solidity
uint256 nuclearPowerPlantCost
```

### pentagonCost

```solidity
uint256 pentagonCost
```

### politicalLobbyistsCost

```solidity
uint256 politicalLobbyistsCost
```

### scientificDevelopmentCenterCost

```solidity
uint256 scientificDevelopmentCenterCost
```

### frc

```solidity
contract ForcesContract frc
```

### mint

```solidity
contract CountryMinter mint
```

### Wonders3

```solidity
struct Wonders3 {
  bool movieIndustry;
  bool nationalCemetary;
  bool nationalEnvironmentOffice;
  bool nationalResearchLab;
  bool nationalWarMemorial;
  bool nuclearPowerPlant;
  bool pentagon;
  bool politicalLobbyists;
  bool scientificDevelopmentCenter;
}
```

### idToWonders3

```solidity
mapping(uint256 => struct WondersContract3.Wonders3) idToWonders3
```

### settings

```solidity
function settings(address _treasuryAddress, address _infrastructureAddress, address _forces, address _wonders1, address _wonders2, address _wonders4, address _countryMinter) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _newTreasuryAddress) public
```

_this function is only callable by the contract owner_

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address _newInfrastructureAddress) public
```

_this function is only callable by the contract owner_

### updateWonderContract1Address

```solidity
function updateWonderContract1Address(address _wonderContract1Address) public
```

_this function is only callable by the contract owner_

### updateWonderContract2Address

```solidity
function updateWonderContract2Address(address _wonderContract2Address) public
```

_this function is only callable by the contract owner_

### updateWonderContract4Address

```solidity
function updateWonderContract4Address(address _wonderContract4Address) public
```

_this function is only callable by the contract owner_

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### generateWonders3

```solidity
function generateWonders3(uint256 id) public
```

this function will be called when a nation is minted and allow a nation to buy the wonders in this contract

_this function is only callable from the country minter contract_

### updateMovieIndustryCost

```solidity
function updateMovieIndustryCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateNationalCemetaryCost

```solidity
function updateNationalCemetaryCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateNationalEnvironmentOfficeCost

```solidity
function updateNationalEnvironmentOfficeCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateNationalResearchLabCost

```solidity
function updateNationalResearchLabCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateNationalWarMemorialCost

```solidity
function updateNationalWarMemorialCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateNuclearPowerPlantCost

```solidity
function updateNuclearPowerPlantCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updatePentagonCost

```solidity
function updatePentagonCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updatePoliticalLobbyistsCost

```solidity
function updatePoliticalLobbyistsCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateScientificDevelopmentCenterCost

```solidity
function updateScientificDevelopmentCenterCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### buyWonder3

```solidity
function buyWonder3(uint256 countryId, uint256 wonderId) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 |  |
| wonderId | uint256 | is the id of the wonder 1. movie industry 2. national cemetary 3. national environmental office 4. national research lab 5. national war memorial 6. nuclear power plant 7. pentagon 8. political lobbyists 9. scientific development center |

### deleteWonder3

```solidity
function deleteWonder3(uint256 countryId, uint256 wonderId) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 |  |
| wonderId | uint256 | is the id of the wonder 1. movie industry 2. national cemetary 3. national environmental office 4. national research lab 5. national war memorial 6. nuclear power plant 7. pentagon 8. political lobbyists 9. scientific development center |

### getMovieIndustry

```solidity
function getMovieIndustry(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the movie industry wonder
this function will return true if a nation has the movie industry wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getNationalCemetary

```solidity
function getNationalCemetary(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the national cemetary wonder
this function will return true if a nation has the national cemetary wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getNationalEnvironmentOffice

```solidity
function getNationalEnvironmentOffice(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the national environmental office wonder
this function will return true if a nation has the national environmental office wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getNationalResearchLab

```solidity
function getNationalResearchLab(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the national research lab wonder
this function will return true if a nation has the national research lab wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getNationalWarMemorial

```solidity
function getNationalWarMemorial(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the national war memorial wonder
this function will return true if a nation has the national war memorial wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getNuclearPowerPlant

```solidity
function getNuclearPowerPlant(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the nuclear power plant wonder
this function will return true if a nation has the nuclear power plant wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getPentagon

```solidity
function getPentagon(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the pentagon wonder
this function will return true if a nation has the pentagon wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getPoliticalLobbyists

```solidity
function getPoliticalLobbyists(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the political lobbyists wonder
this function will return true if a nation has the political lobbyists wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getScientificDevelopmentCenter

```solidity
function getScientificDevelopmentCenter(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the scientific development center wonder
this function will return true if a nation has the scientific development center wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getWonderCosts3

```solidity
function getWonderCosts3() public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

_this function will return the costs of the wonders in this contract_

## WondersContract4

this contract will strore information about a nations wonders

_this contract inherits from openzeppelin's ownable contract_

### treasuryAddress

```solidity
address treasuryAddress
```

### infrastructureAddress

```solidity
address infrastructureAddress
```

### improvementsContract2Address

```solidity
address improvementsContract2Address
```

### improvementsContract3Address

```solidity
address improvementsContract3Address
```

### improvementsContract4Address

```solidity
address improvementsContract4Address
```

### wonderContract1Address

```solidity
address wonderContract1Address
```

### wonderContract3Address

```solidity
address wonderContract3Address
```

### countryMinter

```solidity
address countryMinter
```

### socialSecuritySystemCost

```solidity
uint256 socialSecuritySystemCost
```

### spaceProgramCost

```solidity
uint256 spaceProgramCost
```

### stockMarketCost

```solidity
uint256 stockMarketCost
```

### strategicDefenseInitiativeCost

```solidity
uint256 strategicDefenseInitiativeCost
```

### superiorLogisticalSupportCost

```solidity
uint256 superiorLogisticalSupportCost
```

### universalHealthcareCost

```solidity
uint256 universalHealthcareCost
```

### weaponsResearchCenterCost

```solidity
uint256 weaponsResearchCenterCost
```

### mint

```solidity
contract CountryMinter mint
```

### Wonders4

```solidity
struct Wonders4 {
  bool socialSecuritySystem;
  bool spaceProgram;
  bool stockMarket;
  bool strategicDefenseInitiative;
  bool superiorLogisticalSupport;
  bool universalHealthcare;
  bool weaponsResearchCenter;
}
```

### idToWonders4

```solidity
mapping(uint256 => struct WondersContract4.Wonders4) idToWonders4
```

### settings

```solidity
function settings(address _treasuryAddress, address _improvementsContract2Address, address _improvementsContract3Address, address _improvementsContract4Address, address _infrastructureAddress, address _wonders1, address _wonders3, address _countryMinter) public
```

_this function is only callable by the contract owner
this function will be called immediately after contract deployment in order to set contract pointers_

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _newTreasuryAddress) public
```

_this function is only callable by the contract owner_

### updateWonderContract1Address

```solidity
function updateWonderContract1Address(address _wonderContract1Address) public
```

_this function is only callable by the contract owner_

### updateWonderContract3Address

```solidity
function updateWonderContract3Address(address _wonderContract3Address) public
```

_this function is only callable by the contract owner_

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address _infrastructureAddress) public
```

_this function is only callable by the contract owner_

### updateImprovementContractAddresses

```solidity
function updateImprovementContractAddresses(address _improvementsContract2Address, address _improvementsContract3Address) public
```

_this function is only callable by the contract owner_

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### generateWonders4

```solidity
function generateWonders4(uint256 id) public
```

this function will be called when a nation is minted and allow a nation to buy the wonders in this contract

_this function is only callable from the country minter contract_

### updateSocialSecuritySystemCost

```solidity
function updateSocialSecuritySystemCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateSpaceProgramCost

```solidity
function updateSpaceProgramCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateStockMarketCost

```solidity
function updateStockMarketCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateStrategicDefenseInitiativeCost

```solidity
function updateStrategicDefenseInitiativeCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateSuperiorLogisticalSupportCost

```solidity
function updateSuperiorLogisticalSupportCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateUniversalHealthcareCost

```solidity
function updateUniversalHealthcareCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### updateWeaponsResearchCenterCost

```solidity
function updateWeaponsResearchCenterCost(uint256 newPrice) public
```

_this function is only callable by the contract owner_

### buyWonder4

```solidity
function buyWonder4(uint256 countryId, uint256 wonderId) public
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 |  |
| wonderId | uint256 | is the id of the wonder 1. social security system 2. space program 3. stock market 4. strategic defense initiative 5. superior logistical support 6. universal healthcare 7. weapons research center |

### deleteWonder4

```solidity
function deleteWonder4(uint256 countryId, uint256 wonderId) public
```

### getSocialSecuritySystem

```solidity
function getSocialSecuritySystem(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the social security system wonder
this function will return true if a nation has the social security system wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getSpaceProgram

```solidity
function getSpaceProgram(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the space program wonder
this function will return true if a nation has the space program wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getStockMarket

```solidity
function getStockMarket(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the stock market wonder
this function will return true if a nation has the stock market wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getStrategicDefenseInitiative

```solidity
function getStrategicDefenseInitiative(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the strategic defense initiative wonder
this function will return true if a nation has the strategic defense initiative wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getSuperiorLogisticalSupport

```solidity
function getSuperiorLogisticalSupport(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the superior logistical support wonder
this function will return true if a nation has the superior logistical support wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getUniversalHealthcare

```solidity
function getUniversalHealthcare(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the universal healthcare wonder
this function will return true if a nation has the universal healthcare wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getWeaponsResearchCenter

```solidity
function getWeaponsResearchCenter(uint256 countryId) public view returns (bool)
```

_this is a public view function that will return true if a nation has the weapons research center wonder
this function will return true if a nation has the weapons research center wonder_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| countryId | uint256 | is the nation id of the nation being queried |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool will be true if the nation has the wonder |

### getWonderCosts4

```solidity
function getWonderCosts4() public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

_this function will return the costs of the wonders in this contract_

## MetaNationsGovToken

This token will be spent to purchase your nation NFT
This token is spent at the amount equivalent cost in USDC to the seed money of the nation

### constructor

```solidity
constructor(uint256 initialSupply) public
```

_the initialSupply is minted to the deployer of the contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| initialSupply | uint256 | is the initial supply minted of MetaNationsGovToekn |

