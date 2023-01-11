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

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _newAddress) public
```

### updateForcesAddress

```solidity
function updateForcesAddress(address _newAddress) public
```

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address _newAddress) public
```

### updateKeeperAddress

```solidity
function updateKeeperAddress(address _newAddress) public
```

### updateWonderContract1Address

```solidity
function updateWonderContract1Address(address _newAddress) public
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### initiateAid

```solidity
function initiateAid(uint256 id, address nationOwner) public
```

### proposeAid

```solidity
function proposeAid(uint256 idSender, uint256 idRecipient, uint256 techAid, uint256 balanceAid, uint256 soldiersAid) public
```

### checkAidSlots

```solidity
function checkAidSlots(uint256 idSender) public view returns (bool)
```

### checkAvailability

```solidity
function checkAvailability(uint256 idSender, uint256 techAid, uint256 balanceAid, uint256 soldiersAid) public view returns (bool)
```

### getMaxAidSlots

```solidity
function getMaxAidSlots(uint256 id) public view returns (uint256)
```

### getFederalAidEligability

```solidity
function getFederalAidEligability(uint256 idSender, uint256 idRecipient) public view returns (bool)
```

### setProposalExpiration

```solidity
function setProposalExpiration(uint256 newExpiration) public
```

### getProposalExpiration

```solidity
function getProposalExpiration() public view returns (uint256)
```

### proposalExpired

```solidity
function proposalExpired(uint256 proposalId) public view returns (bool)
```

### acceptProposal

```solidity
function acceptProposal(uint256 proposalId) public
```

### cancelAid

```solidity
function cancelAid(uint256 proposalId) public
```

### onlyKeeper

```solidity
modifier onlyKeeper()
```

### resetAidProposals

```solidity
function resetAidProposals() public
```

### getProposal

```solidity
function getProposal(uint256 proposalId) public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

### checkCancelledOrAccepted

```solidity
function checkCancelledOrAccepted(uint256 proposalId) public view returns (bool, bool)
```

## AirBattleContract

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

### settings

```solidity
function settings(address _warAddress, address _fighter, address _bomber, address _infrastructure, address _forces, address _fighterLosses) public
```

### updateWarAddress

```solidity
function updateWarAddress(address newAddress) public
```

### updateFighterAddress

```solidity
function updateFighterAddress(address newAddress) public
```

### updateBomberAddress

```solidity
function updateBomberAddress(address newAddress) public
```

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address newAddress) public
```

### updateForcesAddress

```solidity
function updateForcesAddress(address newAddress) public
```

### updateFighterLossesAddress

```solidity
function updateFighterLossesAddress(address newAddress) public
```

### updateMissilesAddress

```solidity
function updateMissilesAddress(address newAddress) public
```

### updateWonders1Address

```solidity
function updateWonders1Address(address newAddress) public
```

### airBattle

```solidity
function airBattle(uint256 warId, uint256 attackerId, uint256 defenderId) internal
```

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

### eliminateAttackerBombers

```solidity
function eliminateAttackerBombers(uint256 attackerId, uint256 warId) internal
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

### idToOwnerBills

```solidity
mapping(uint256 => address) idToOwnerBills
```

### settings

```solidity
function settings(address _countryMinter, address _treasury, address _wonders1, address _wonders2, address _wonders3, address _infrastructure, address _forces, address _fighters, address _navy, address _resources) public
```

### settings2

```solidity
function settings2(address _improvements1, address _improvements2, address _missiles, address _wonders4, address _infrastructure) public
```

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

### getBillsPayable

```solidity
function getBillsPayable(uint256 id) public view returns (uint256)
```

### calculateDailyBillsFromInfrastructure

```solidity
function calculateDailyBillsFromInfrastructure(uint256 id) public view returns (uint256 dailyInfrastructureBills)
```

### calculateInfrastructureCostPerLevel

```solidity
function calculateInfrastructureCostPerLevel(uint256 id) public view returns (uint256 infrastructureBillsPerLevel)
```

### calculateModifiedInfrastrucureUpkeep

```solidity
function calculateModifiedInfrastrucureUpkeep(uint256 baseDailyInfrastructureCostPerLevel, uint256 id) public view returns (uint256)
```

### calculateDailyBillsFromMilitary

```solidity
function calculateDailyBillsFromMilitary(uint256 id) public view returns (uint256 militaryBills)
```

### getSoldierUpkeep

```solidity
function getSoldierUpkeep(uint256 id) public view returns (uint256)
```

### getTankUpkeep

```solidity
function getTankUpkeep(uint256 id) public view returns (uint256)
```

### getNukeUpkeep

```solidity
function getNukeUpkeep(uint256 id) public view returns (uint256)
```

### getCruiseMissileUpkeep

```solidity
function getCruiseMissileUpkeep(uint256 id) public view returns (uint256)
```

### getAircraftUpkeep

```solidity
function getAircraftUpkeep(uint256 id) public view returns (uint256)
```

### getNavyUpkeep

```solidity
function getNavyUpkeep(uint256 id) public view returns (uint256 navyUpkeep)
```

### getNavyUpkeepAppended

```solidity
function getNavyUpkeepAppended(uint256 id) internal view returns (uint256)
```

### getAdjustedNavyUpkeep

```solidity
function getAdjustedNavyUpkeep(uint256 id, uint256 baseNavyUpkeep) public view returns (uint256)
```

### calculateDailyBillsFromImprovements

```solidity
function calculateDailyBillsFromImprovements(uint256 id) public view returns (uint256 improvementBills)
```

### calculateWonderBillsPayable

```solidity
function calculateWonderBillsPayable(uint256 id) public view returns (uint256)
```

## BombersContract

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

### updateBombersMarketAddresses

```solidity
function updateBombersMarketAddresses(address _bombersMarket1, address _bombersMarket2) public
```

### updateAirBattleAddress

```solidity
function updateAirBattleAddress(address _airBattle) public
```

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _treasury) public
```

### updateFightersAddress

```solidity
function updateFightersAddress(address _fighters) public
```

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address _infrastructure) public
```

### updateWarAddress

```solidity
function updateWarAddress(address _war) public
```

### generateBombers

```solidity
function generateBombers(uint256 id) public
```

### getBomberCount

```solidity
function getBomberCount(uint256 id) public view returns (uint256)
```

### getDefendingAh1CobraCount

```solidity
function getDefendingAh1CobraCount(uint256 id) public view returns (uint256)
```

### getDeployedAh1CobraCount

```solidity
function getDeployedAh1CobraCount(uint256 id) public view returns (uint256)
```

### increaseAh1CobraCount

```solidity
function increaseAh1CobraCount(uint256 id, uint256 amount) public
```

### decreaseDefendingAh1CobraCount

```solidity
function decreaseDefendingAh1CobraCount(uint256 amount, uint256 id) public
```

### decreaseDeployedAh1CobraCount

```solidity
function decreaseDeployedAh1CobraCount(uint256 amount, uint256 id) public
```

### scrapAh1Cobra

```solidity
function scrapAh1Cobra(uint256 amount, uint256 id) public
```

### getDefendingAh64ApacheCount

```solidity
function getDefendingAh64ApacheCount(uint256 id) public view returns (uint256)
```

### getDeployedAh64ApacheCount

```solidity
function getDeployedAh64ApacheCount(uint256 id) public view returns (uint256)
```

### increaseAh64ApacheCount

```solidity
function increaseAh64ApacheCount(uint256 id, uint256 amount) public
```

### decreaseDefendingAh64ApacheCount

```solidity
function decreaseDefendingAh64ApacheCount(uint256 amount, uint256 id) public
```

### decreaseDeployedAh64ApacheCount

```solidity
function decreaseDeployedAh64ApacheCount(uint256 amount, uint256 id) public
```

### scrapAh64Apache

```solidity
function scrapAh64Apache(uint256 amount, uint256 id) public
```

### getDefendingBristolBlenheimCount

```solidity
function getDefendingBristolBlenheimCount(uint256 id) public view returns (uint256)
```

### getDeployedBristolBlenheimCount

```solidity
function getDeployedBristolBlenheimCount(uint256 id) public view returns (uint256)
```

### increaseBristolBlenheimCount

```solidity
function increaseBristolBlenheimCount(uint256 id, uint256 amount) public
```

### decreaseDefendingBristolBlenheimCount

```solidity
function decreaseDefendingBristolBlenheimCount(uint256 amount, uint256 id) public
```

### decreaseDeployedBristolBlenheimCount

```solidity
function decreaseDeployedBristolBlenheimCount(uint256 amount, uint256 id) public
```

### scrapBristolBlenheim

```solidity
function scrapBristolBlenheim(uint256 amount, uint256 id) public
```

### getDefendingB52MitchellCount

```solidity
function getDefendingB52MitchellCount(uint256 id) public view returns (uint256)
```

### getDeployedB52MitchellCount

```solidity
function getDeployedB52MitchellCount(uint256 id) public view returns (uint256)
```

### increaseB52MitchellCount

```solidity
function increaseB52MitchellCount(uint256 id, uint256 amount) public
```

### decreaseDefendingB52MitchellCount

```solidity
function decreaseDefendingB52MitchellCount(uint256 amount, uint256 id) public
```

### decreaseDeployedB52MitchellCount

```solidity
function decreaseDeployedB52MitchellCount(uint256 amount, uint256 id) public
```

### scrapB52Mitchell

```solidity
function scrapB52Mitchell(uint256 amount, uint256 id) public
```

### getDefendingB17gFlyingFortressCount

```solidity
function getDefendingB17gFlyingFortressCount(uint256 id) public view returns (uint256)
```

### getDeployedB17gFlyingFortressCount

```solidity
function getDeployedB17gFlyingFortressCount(uint256 id) public view returns (uint256)
```

### increaseB17gFlyingFortressCount

```solidity
function increaseB17gFlyingFortressCount(uint256 id, uint256 amount) public
```

### decreaseDefendingB17gFlyingFortressCount

```solidity
function decreaseDefendingB17gFlyingFortressCount(uint256 amount, uint256 id) public
```

### decreaseDeployedB17gFlyingFortressCount

```solidity
function decreaseDeployedB17gFlyingFortressCount(uint256 amount, uint256 id) public
```

### scrapB17gFlyingFortress

```solidity
function scrapB17gFlyingFortress(uint256 amount, uint256 id) public
```

### getDefendingB52StratofortressCount

```solidity
function getDefendingB52StratofortressCount(uint256 id) public view returns (uint256)
```

### getDeployedB52StratofortressCount

```solidity
function getDeployedB52StratofortressCount(uint256 id) public view returns (uint256)
```

### increaseB52StratofortressCount

```solidity
function increaseB52StratofortressCount(uint256 id, uint256 amount) public
```

### decreaseDefendingB52StratofortressCount

```solidity
function decreaseDefendingB52StratofortressCount(uint256 amount, uint256 id) public
```

### decreaseDeployedB52StratofortressCount

```solidity
function decreaseDeployedB52StratofortressCount(uint256 amount, uint256 id) public
```

### scrapB52Stratofortress

```solidity
function scrapB52Stratofortress(uint256 amount, uint256 id) public
```

### getDefendingB2SpiritCount

```solidity
function getDefendingB2SpiritCount(uint256 id) public view returns (uint256)
```

### getDeployedB2SpiritCount

```solidity
function getDeployedB2SpiritCount(uint256 id) public view returns (uint256)
```

### increaseB2SpiritCount

```solidity
function increaseB2SpiritCount(uint256 id, uint256 amount) public
```

### decreaseDefendingB2SpiritCount

```solidity
function decreaseDefendingB2SpiritCount(uint256 amount, uint256 id) public
```

### decreaseDeployedB2SpiritCount

```solidity
function decreaseDeployedB2SpiritCount(uint256 amount, uint256 id) public
```

### scrapB2Spirit

```solidity
function scrapB2Spirit(uint256 amount, uint256 id) public
```

### getDefendingB1bLancer

```solidity
function getDefendingB1bLancer(uint256 id) public view returns (uint256)
```

### getDeployedB1bLancer

```solidity
function getDeployedB1bLancer(uint256 id) public view returns (uint256)
```

### increaseB1bLancerCount

```solidity
function increaseB1bLancerCount(uint256 id, uint256 amount) public
```

### decreaseDefendingB1bLancerCount

```solidity
function decreaseDefendingB1bLancerCount(uint256 amount, uint256 id) public
```

### decreaseDeployedB1bLancerCount

```solidity
function decreaseDeployedB1bLancerCount(uint256 amount, uint256 id) public
```

### scrapB1bLancer

```solidity
function scrapB1bLancer(uint256 amount, uint256 id) public
```

### getDefendingTupolevTu160

```solidity
function getDefendingTupolevTu160(uint256 id) public view returns (uint256)
```

### getDeployedTupolevTu160

```solidity
function getDeployedTupolevTu160(uint256 id) public view returns (uint256)
```

### increaseTupolevTu160Count

```solidity
function increaseTupolevTu160Count(uint256 id, uint256 amount) public
```

### decreaseDefendingTupolevTu160Count

```solidity
function decreaseDefendingTupolevTu160Count(uint256 amount, uint256 id) public
```

### decreaseDeployedTupolevTu160Count

```solidity
function decreaseDeployedTupolevTu160Count(uint256 amount, uint256 id) public
```

### scrapTupolevTu160

```solidity
function scrapTupolevTu160(uint256 amount, uint256 id) public
```

## BombersMarketplace1

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

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### updateCountryMinterAddress

```solidity
function updateCountryMinterAddress(address newAddress) public
```

### updateBombers1Address

```solidity
function updateBombers1Address(address newAddress) public
```

### updateFightersAddress

```solidity
function updateFightersAddress(address newAddress) public
```

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address newAddress) public
```

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address newAddress) public
```

### updateAh1CobraSpecs

```solidity
function updateAh1CobraSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### updateAh64ApacheSpecs

```solidity
function updateAh64ApacheSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### updateBristolBlenheimSpecs

```solidity
function updateBristolBlenheimSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### updateB52MitchellSpecs

```solidity
function updateB52MitchellSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### updateB17gFlyingFortressSpecs

```solidity
function updateB17gFlyingFortressSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### buyAh1Cobra

```solidity
function buyAh1Cobra(uint256 amount, uint256 id) public
```

### buyAh64Apache

```solidity
function buyAh64Apache(uint256 amount, uint256 id) public
```

### buyBristolBlenheim

```solidity
function buyBristolBlenheim(uint256 amount, uint256 id) public
```

### buyB52Mitchell

```solidity
function buyB52Mitchell(uint256 amount, uint256 id) public
```

### buyB17gFlyingFortress

```solidity
function buyB17gFlyingFortress(uint256 amount, uint256 id) public
```

## BombersMarketplace2

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

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### updateCountryMinterAddress

```solidity
function updateCountryMinterAddress(address newAddress) public
```

### updateBombers1Address

```solidity
function updateBombers1Address(address newAddress) public
```

### updateFightersAddress

```solidity
function updateFightersAddress(address newAddress) public
```

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address newAddress) public
```

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address newAddress) public
```

### updateB52StratofortressSpecs

```solidity
function updateB52StratofortressSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### updateb2SpiritSpecs

```solidity
function updateb2SpiritSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### updateB1bLancerSpecs

```solidity
function updateB1bLancerSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### updateTupolevTu160Specs

```solidity
function updateTupolevTu160Specs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### buyB52Stratofortress

```solidity
function buyB52Stratofortress(uint256 amount, uint256 id) public
```

### buyB2Spirit

```solidity
function buyB2Spirit(uint256 amount, uint256 id) public
```

### buyB1bLancer

```solidity
function buyB1bLancer(uint256 amount, uint256 id) public
```

### buyTupolevTu160

```solidity
function buyTupolevTu160(uint256 amount, uint256 id) public
```

## CountryMinter

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

### settings2

```solidity
function settings2(address _improvements1, address _improvements2, address _improvements3, address _improvements4, address _wonders1, address _wonders2, address _wonders3, address _wonders4) public
```

### settings3

```solidity
function settings3(address _military, address _forces, address _navy, address _navalActions, address _fighters, address _fightersMarket1, address _fightersMarket2, address _bombers, address _bombersMarket1, address _bombersMarket2) public
```

### generateCountry

```solidity
function generateCountry(string ruler, string nationName, string capitalCity, string nationSlogan) public
```

### checkOwnership

```solidity
function checkOwnership(uint256 id, address caller) public view returns (bool)
```

### getCountryCount

```solidity
function getCountryCount() public view returns (uint256)
```

## CountryParametersContract

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

### constructor

```solidity
constructor(address vrfCoordinatorV2, uint64 subscriptionId, bytes32 gasLane, uint32 callbackGasLimit) public
```

### settings

```solidity
function settings(address _spy, address _countryMinter, address _senate) public
```

### onlySpyContract

```solidity
modifier onlySpyContract()
```

### generateCountryParameters

```solidity
function generateCountryParameters(uint256 id, address nationOwner, string rulerName, string nationName, string capitalCity, string nationSlogan) public
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

### setRulerName

```solidity
function setRulerName(string newRulerName, uint256 id) public
```

### setNationName

```solidity
function setNationName(string newNationName, uint256 id) public
```

### setCapitalCity

```solidity
function setCapitalCity(string newCapitalCity, uint256 id) public
```

### setNationSlogan

```solidity
function setNationSlogan(string newNationSlogan, uint256 id) public
```

### setAlliance

```solidity
function setAlliance(string newAlliance, uint256 id) public
```

### setTeam

```solidity
function setTeam(uint256 id, uint256 newTeam) public
```

### setGovernment

```solidity
function setGovernment(uint256 id, uint256 newType) public
```

### updateDesiredGovernment

```solidity
function updateDesiredGovernment(uint256 id, uint256 newType) public
```

### setReligion

```solidity
function setReligion(uint256 id, uint256 newType) public
```

### updateDesiredReligion

```solidity
function updateDesiredReligion(uint256 id, uint256 newType) public
```

### incrementDaysSince

```solidity
function incrementDaysSince() external
```

### getRulerName

```solidity
function getRulerName(uint256 countryId) public view returns (string)
```

### getNationName

```solidity
function getNationName(uint256 countryId) public view returns (string)
```

### getCapital

```solidity
function getCapital(uint256 countryId) public view returns (string)
```

### getSlogan

```solidity
function getSlogan(uint256 countryId) public view returns (string)
```

### getAlliance

```solidity
function getAlliance(uint256 countryId) public view returns (string)
```

### getTeam

```solidity
function getTeam(uint256 countryId) public view returns (uint256)
```

### getGovernmentType

```solidity
function getGovernmentType(uint256 countryId) public view returns (uint256)
```

### getReligionType

```solidity
function getReligionType(uint256 countryId) public view returns (uint256)
```

### getTimeCreated

```solidity
function getTimeCreated(uint256 countryId) public view returns (uint256)
```

### getGovernmentPreference

```solidity
function getGovernmentPreference(uint256 id) public view returns (uint256 preference)
```

### getReligionPreference

```solidity
function getReligionPreference(uint256 id) public view returns (uint256 preference)
```

### getDaysSince

```solidity
function getDaysSince(uint256 id) public view returns (uint256, uint256)
```

## CrimeContract

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

### updateInfrastructureContract

```solidity
function updateInfrastructureContract(address _newAddress) public
```

### updateImprovementsContract1

```solidity
function updateImprovementsContract1(address _newAddress) public
```

### updateImprovementsContract2

```solidity
function updateImprovementsContract2(address _newAddress) public
```

### updateImprovementsContract3

```solidity
function updateImprovementsContract3(address _newAddress) public
```

### updateCountryParameters

```solidity
function updateCountryParameters(address _newAddress) public
```

### getCriminalCount

```solidity
function getCriminalCount(uint256 id) public view returns (uint256)
```

### getCrimeIndex

```solidity
function getCrimeIndex(uint256 id) public view returns (uint256)
```

### getCrimePreventionScore

```solidity
function getCrimePreventionScore(uint256 id) public view returns (uint256)
```

### getLiteracy

```solidity
function getLiteracy(uint256 id) public view returns (uint256)
```

### getLiteracyPoints

```solidity
function getLiteracyPoints(uint256 id) public view returns (uint256)
```

### getImprovementPoints

```solidity
function getImprovementPoints(uint256 id) public view returns (uint256)
```

### getTaxRateCrimeMultiplier

```solidity
function getTaxRateCrimeMultiplier(uint256 id) public view returns (uint256)
```

### getPointsFromGovernmentType

```solidity
function getPointsFromGovernmentType(uint256 id) public view returns (uint256)
```

### getPointsFromInfrastruture

```solidity
function getPointsFromInfrastruture(uint256 id) public view returns (uint256)
```

### getPointsFromPopulation

```solidity
function getPointsFromPopulation(uint256 id) public view returns (uint256)
```

## CruiseMissileContract

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

### settings

```solidity
function settings(address _forces, address _countryMinter, address _war, address _infrastructure, address _missiles) public
```

### settings2

```solidity
function settings2(address _improvements1, address _improvements3, address _improvements4, address _wonders2) public
```

### updateForcesContract

```solidity
function updateForcesContract(address newAddress) public
```

### updateCountryMinter

```solidity
function updateCountryMinter(address newAddress) public
```

### updateWarContract

```solidity
function updateWarContract(address newAddress) public
```

### updateInfrastructureContract

```solidity
function updateInfrastructureContract(address newAddress) public
```

### updateMissilesContract

```solidity
function updateMissilesContract(address newAddress) public
```

### updateImprovementsContract1

```solidity
function updateImprovementsContract1(address newAddress) public
```

### updateImprovementsContract3

```solidity
function updateImprovementsContract3(address newAddress) public
```

### updateImprovementsContract4

```solidity
function updateImprovementsContract4(address newAddress) public
```

### updateWondersContract2

```solidity
function updateWondersContract2(address newAddress) public
```

### launchCruiseMissileAttack

```solidity
function launchCruiseMissileAttack(uint256 attackerId, uint256 defenderId, uint256 warId) public
```

### fulfillRequest

```solidity
function fulfillRequest(uint256 id) internal
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

### destroyTanks

```solidity
function destroyTanks(uint256 attackId) internal
```

### destroyTech

```solidity
function destroyTech(uint256 attackId) internal
```

### destroyInfrastructure

```solidity
function destroyInfrastructure(uint256 attackId) internal
```

## EnvironmentContract

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

### settings

```solidity
function settings(address _countryMinter, address _resources, address _infrastructure, address _wonders3, address _wonders4, address _forces, address _parameters, address _taxes, address _missiles, address _nukes) public
```

### settings2

```solidity
function settings2(address _improvements1, address _improvements3, address _improvements4) public
```

### updateCountryMinter

```solidity
function updateCountryMinter(address newAddress) public
```

### updateResourcesContract

```solidity
function updateResourcesContract(address newAddress) public
```

### updateInfrastructureContract

```solidity
function updateInfrastructureContract(address newAddress) public
```

### updateWondersContract3

```solidity
function updateWondersContract3(address newAddress) public
```

### updateWondersContract4

```solidity
function updateWondersContract4(address newAddress) public
```

### updateForcesContract

```solidity
function updateForcesContract(address newAddress) public
```

### updateParametersContract

```solidity
function updateParametersContract(address newAddress) public
```

### updateTaxesContract

```solidity
function updateTaxesContract(address newAddress) public
```

### updateMissilesContract

```solidity
function updateMissilesContract(address newAddress) public
```

### updateNukeContract

```solidity
function updateNukeContract(address newAddress) public
```

### updateImprovementsContract1

```solidity
function updateImprovementsContract1(address newAddress) public
```

### updateImprovementsContract3

```solidity
function updateImprovementsContract3(address newAddress) public
```

### updateImprovementsContract4

```solidity
function updateImprovementsContract4(address newAddress) public
```

### getEnvironmentScore

```solidity
function getEnvironmentScore(uint256 id) public view returns (uint256)
```

### getGrossEnvironmentScore

```solidity
function getGrossEnvironmentScore(uint256 id) public view returns (int256)
```

### getEnvironmentScoreFromResources

```solidity
function getEnvironmentScoreFromResources(uint256 id) public view returns (int256)
```

### getEnvironmentScoreFromImprovementsAndWonders

```solidity
function getEnvironmentScoreFromImprovementsAndWonders(uint256 id) public view returns (int256)
```

### getEnvironmentScoreFromTech

```solidity
function getEnvironmentScoreFromTech(uint256 id) public view returns (int256)
```

### getEnvironmentScoreFromMilitaryDensity

```solidity
function getEnvironmentScoreFromMilitaryDensity(uint256 id) public view returns (int256)
```

### getEnvironmentScoreFromInfrastructure

```solidity
function getEnvironmentScoreFromInfrastructure(uint256 id) public view returns (int256)
```

### getScoreFromNukes

```solidity
function getScoreFromNukes(uint256 id) public view returns (int256)
```

### getScoreFromGovernment

```solidity
function getScoreFromGovernment(uint256 id) public view returns (int256)
```

## FightersContract

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

### settings2

```solidity
function settings2(address _navy, address _bombers) public
```

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

### getAircraftCount

```solidity
function getAircraftCount(uint256 id) public view returns (uint256)
```

### getDefendingCount

```solidity
function getDefendingCount(uint256 id) public view returns (uint256)
```

### getDeployedCount

```solidity
function getDeployedCount(uint256 id) public view returns (uint256)
```

### onlyBomberContract

```solidity
modifier onlyBomberContract()
```

### increaseAircraftCount

```solidity
function increaseAircraftCount(uint256 amount, uint256 id) public
```

### decreaseDefendingAircraftCount

```solidity
function decreaseDefendingAircraftCount(uint256 amount, uint256 id) public
```

### decreaseDeployedAircraftCount

```solidity
function decreaseDeployedAircraftCount(uint256 amount, uint256 id) public
```

### decreaseDefendingAircraftCountFromLosses

```solidity
function decreaseDefendingAircraftCountFromLosses(uint256 amount, uint256 id) public
```

### decreaseDeployedAircraftCountFromLosses

```solidity
function decreaseDeployedAircraftCountFromLosses(uint256 amount, uint256 id) public
```

### destroyDefendingAircraft

```solidity
function destroyDefendingAircraft(uint256 amount, uint256 id) internal
```

### destroyDeployedAircraft

```solidity
function destroyDeployedAircraft(uint256 amount, uint256 id) internal
```

### getDefendingYak9Count

```solidity
function getDefendingYak9Count(uint256 id) public view returns (uint256)
```

### getDeployedYak9Count

```solidity
function getDeployedYak9Count(uint256 id) public view returns (uint256)
```

### increaseYak9Count

```solidity
function increaseYak9Count(uint256 id, uint256 amount) public
```

### decreaseDefendingYak9Count

```solidity
function decreaseDefendingYak9Count(uint256 amount, uint256 id) public
```

### decreaseDeployedYak9Count

```solidity
function decreaseDeployedYak9Count(uint256 amount, uint256 id) public
```

### scrapYak9

```solidity
function scrapYak9(uint256 amount, uint256 id) public
```

### getDefendingP51MustangCount

```solidity
function getDefendingP51MustangCount(uint256 id) public view returns (uint256)
```

### getDeployedP51MustangCount

```solidity
function getDeployedP51MustangCount(uint256 id) public view returns (uint256)
```

### increaseP51MustangCount

```solidity
function increaseP51MustangCount(uint256 id, uint256 amount) public
```

### decreaseDefendingP51MustangCount

```solidity
function decreaseDefendingP51MustangCount(uint256 amount, uint256 id) public
```

### decreaseDeployedP51MustangCount

```solidity
function decreaseDeployedP51MustangCount(uint256 amount, uint256 id) public
```

### scrapP51Mustang

```solidity
function scrapP51Mustang(uint256 amount, uint256 id) public
```

### getDefendingF86SabreCount

```solidity
function getDefendingF86SabreCount(uint256 id) public view returns (uint256)
```

### getDeployedF86SabreCount

```solidity
function getDeployedF86SabreCount(uint256 id) public view returns (uint256)
```

### increaseF86SabreCount

```solidity
function increaseF86SabreCount(uint256 id, uint256 amount) public
```

### decreaseDefendingF86SabreCount

```solidity
function decreaseDefendingF86SabreCount(uint256 amount, uint256 id) public
```

### decreaseDeployedF86SabreCount

```solidity
function decreaseDeployedF86SabreCount(uint256 amount, uint256 id) public
```

### scrapF86Sabre

```solidity
function scrapF86Sabre(uint256 amount, uint256 id) public
```

### getDefendingMig15Count

```solidity
function getDefendingMig15Count(uint256 id) public view returns (uint256)
```

### getDeployedMig15Count

```solidity
function getDeployedMig15Count(uint256 id) public view returns (uint256)
```

### increaseMig15Count

```solidity
function increaseMig15Count(uint256 id, uint256 amount) public
```

### decreaseDefendingMig15Count

```solidity
function decreaseDefendingMig15Count(uint256 amount, uint256 id) public
```

### decreaseDeployedMig15Count

```solidity
function decreaseDeployedMig15Count(uint256 amount, uint256 id) public
```

### scrapMig15

```solidity
function scrapMig15(uint256 amount, uint256 id) public
```

### getDefendingF100SuperSabreCount

```solidity
function getDefendingF100SuperSabreCount(uint256 id) public view returns (uint256)
```

### getDeployedF100SuperSabreCount

```solidity
function getDeployedF100SuperSabreCount(uint256 id) public view returns (uint256)
```

### increaseF100SuperSabreCount

```solidity
function increaseF100SuperSabreCount(uint256 id, uint256 amount) public
```

### decreaseDefendingF100SuperSabreCount

```solidity
function decreaseDefendingF100SuperSabreCount(uint256 amount, uint256 id) public
```

### decreaseDeployedF100SuperSabreCount

```solidity
function decreaseDeployedF100SuperSabreCount(uint256 amount, uint256 id) public
```

### scrapF100SuperSabre

```solidity
function scrapF100SuperSabre(uint256 amount, uint256 id) public
```

### getDefendingF35LightningCount

```solidity
function getDefendingF35LightningCount(uint256 id) public view returns (uint256)
```

### getDeployedF35LightningCount

```solidity
function getDeployedF35LightningCount(uint256 id) public view returns (uint256)
```

### increaseF35LightningCount

```solidity
function increaseF35LightningCount(uint256 id, uint256 amount) public
```

### decreaseDefendingF35LightningCount

```solidity
function decreaseDefendingF35LightningCount(uint256 amount, uint256 id) public
```

### decreaseDeployedF35LightningCount

```solidity
function decreaseDeployedF35LightningCount(uint256 amount, uint256 id) public
```

### scrapF35Lightning

```solidity
function scrapF35Lightning(uint256 amount, uint256 id) public
```

### getDefendingF15EagleCount

```solidity
function getDefendingF15EagleCount(uint256 id) public view returns (uint256)
```

### getDeployedF15EagleCount

```solidity
function getDeployedF15EagleCount(uint256 id) public view returns (uint256)
```

### increaseF15EagleCount

```solidity
function increaseF15EagleCount(uint256 id, uint256 amount) public
```

### decreaseDefendingF15EagleCount

```solidity
function decreaseDefendingF15EagleCount(uint256 amount, uint256 id) public
```

### decreaseDeployedF15EagleCount

```solidity
function decreaseDeployedF15EagleCount(uint256 amount, uint256 id) public
```

### scrapF15Eagle

```solidity
function scrapF15Eagle(uint256 amount, uint256 id) public
```

### getDefendingSu30MkiCount

```solidity
function getDefendingSu30MkiCount(uint256 id) public view returns (uint256)
```

### getDeployedSu30MkiCount

```solidity
function getDeployedSu30MkiCount(uint256 id) public view returns (uint256)
```

### increaseSu30MkiCount

```solidity
function increaseSu30MkiCount(uint256 id, uint256 amount) public
```

### decreaseDefendingSu30MkiCount

```solidity
function decreaseDefendingSu30MkiCount(uint256 amount, uint256 id) public
```

### decreaseDeployedSu30MkiCount

```solidity
function decreaseDeployedSu30MkiCount(uint256 amount, uint256 id) public
```

### scrapSu30Mki

```solidity
function scrapSu30Mki(uint256 amount, uint256 id) public
```

### getDefendingF22RaptorCount

```solidity
function getDefendingF22RaptorCount(uint256 id) public view returns (uint256)
```

### getDeployedF22RaptorCount

```solidity
function getDeployedF22RaptorCount(uint256 id) public view returns (uint256)
```

### increaseF22RaptorCount

```solidity
function increaseF22RaptorCount(uint256 id, uint256 amount) public
```

### decreaseDefendingF22RaptorCount

```solidity
function decreaseDefendingF22RaptorCount(uint256 amount, uint256 id) public
```

### decreaseDeployedF22RaptorCount

```solidity
function decreaseDeployedF22RaptorCount(uint256 amount, uint256 id) public
```

### scrapF22Raptor

```solidity
function scrapF22Raptor(uint256 amount, uint256 id) public
```

## FighterLosses

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

## FightersMarketplace1

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

### settings

```solidity
function settings(address _countryMinter, address _bombers, address _fighters, address _treasury, address _infrastructure, address _resources, address _improvements1, address _wonders1, address _wonders4, address _navy) public
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

### updateBombersAddress

```solidity
function updateBombersAddress(address newAddress) public
```

### updateFightersAddress

```solidity
function updateFightersAddress(address newAddress) public
```

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address newAddress) public
```

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address newAddress) public
```

### updateResourcesAddress

```solidity
function updateResourcesAddress(address newAddress) public
```

### updateImprovements1Address

```solidity
function updateImprovements1Address(address newAddress) public
```

### updateWonders4Address

```solidity
function updateWonders4Address(address newAddress) public
```

### updateYak9Specs

```solidity
function updateYak9Specs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### updateP51MustangSpecs

```solidity
function updateP51MustangSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### updateF86SabreSpecs

```solidity
function updateF86SabreSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### updateMig15Specs

```solidity
function updateMig15Specs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### updateF100SuperSabreSpecs

```solidity
function updateF100SuperSabreSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### buyYak9

```solidity
function buyYak9(uint256 amount, uint256 id) public
```

### buyP51Mustang

```solidity
function buyP51Mustang(uint256 amount, uint256 id) public
```

### buyF86Sabre

```solidity
function buyF86Sabre(uint256 amount, uint256 id) public
```

### buyMig15

```solidity
function buyMig15(uint256 amount, uint256 id) public
```

### buyF100SuperSabre

```solidity
function buyF100SuperSabre(uint256 amount, uint256 id) public
```

### getAircraftPurchaseCostModifier

```solidity
function getAircraftPurchaseCostModifier(uint256 id) public view returns (uint256)
```

### getMaxAircraftCount

```solidity
function getMaxAircraftCount(uint256 id) public view returns (uint256)
```

## FightersMarketplace2

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

### updateBombersAddress

```solidity
function updateBombersAddress(address newAddress) public
```

### updateFightersAddress

```solidity
function updateFightersAddress(address newAddress) public
```

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address newAddress) public
```

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address newAddress) public
```

### updateResourcesAddress

```solidity
function updateResourcesAddress(address newAddress) public
```

### updateImprovements1Address

```solidity
function updateImprovements1Address(address newAddress) public
```

### updateF35LightningSpecs

```solidity
function updateF35LightningSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### updateF15EagleSpecs

```solidity
function updateF15EagleSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### updateSU30MkiSpecs

```solidity
function updateSU30MkiSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### updateF22RaptorSpecs

```solidity
function updateF22RaptorSpecs(uint256 newPrice, uint256 newInfra, uint256 newTech) public
```

### buyF35Lightning

```solidity
function buyF35Lightning(uint256 amount, uint256 id) public
```

### buyF15Eagle

```solidity
function buyF15Eagle(uint256 amount, uint256 id) public
```

### buySu30Mki

```solidity
function buySu30Mki(uint256 amount, uint256 id) public
```

### buyF22Raptor

```solidity
function buyF22Raptor(uint256 amount, uint256 id) public
```

## ForcesContract

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
  uint256 cruiseMissiles;
  uint256 nuclearWeapons;
  uint256 nukesPurchasedToday;
  uint256 numberOfSpies;
  bool nationExists;
}
```

### settings

```solidity
function settings(address _treasuryAddress, address _aid, address _spyAddress, address _cruiseMissile, address _nukeAddress, address _airBattle, address _groundBattle, address _warAddress) public
```

### settings2

```solidity
function settings2(address _infrastructure, address _resources, address _improvements1, address _improvements2, address _wonders1, address _countryMinter) public
```

### idToForces

```solidity
mapping(uint256 => struct ForcesContract.Forces) idToForces
```

### generateForces

```solidity
function generateForces(uint256 id) public
```

### updateInfrastructureContract

```solidity
function updateInfrastructureContract(address newAddress) public
```

### updateResourcesContract

```solidity
function updateResourcesContract(address newAddress) public
```

### updateImprovementsContract1

```solidity
function updateImprovementsContract1(address newAddress) public
```

### updateSpyCost

```solidity
function updateSpyCost(uint256 newPrice) public
```

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

### buySoldiers

```solidity
function buySoldiers(uint256 amount, uint256 id) public
```

### getSoldierCost

```solidity
function getSoldierCost(uint256 id) public view returns (uint256)
```

### sendSoldiers

```solidity
function sendSoldiers(uint256 idSender, uint256 idReciever, uint256 amount) public
```

### getDefendingSoldierCount

```solidity
function getDefendingSoldierCount(uint256 id) public view returns (uint256)
```

### deploySoldiers

```solidity
function deploySoldiers(uint256 amountToDeploy, uint256 id, uint256 warId) public
```

### getMaxDeployablePercentage

```solidity
function getMaxDeployablePercentage(uint256 id) public view returns (uint256)
```

### withdrawSoldiers

```solidity
function withdrawSoldiers(uint256 amountToWithdraw, uint256 id) public
```

### decreaseDefendingSoldierCountFromNukeAttack

```solidity
function decreaseDefendingSoldierCountFromNukeAttack(uint256 id) public
```

### getSoldierCount

```solidity
function getSoldierCount(uint256 id) public view returns (uint256 soldiers)
```

### getDeployedSoldierCount

```solidity
function getDeployedSoldierCount(uint256 id) public view returns (uint256 soldiers)
```

### getDeployedSoldierEfficiencyModifier

```solidity
function getDeployedSoldierEfficiencyModifier(uint256 id) public view returns (uint256)
```

### getDefendingSoldierEfficiencyModifier

```solidity
function getDefendingSoldierEfficiencyModifier(uint256 id) public view returns (uint256)
```

### decomissionSoldiers

```solidity
function decomissionSoldiers(uint256 amount, uint256 id) public
```

### buyTanks

```solidity
function buyTanks(uint256 amount, uint256 id) public
```

### getMaxTankCount

```solidity
function getMaxTankCount(uint256 id) public view returns (uint256)
```

### deployTanks

```solidity
function deployTanks(uint256 amountToDeploy, uint256 id) public
```

### withdrawTanks

```solidity
function withdrawTanks(uint256 amountToWithdraw, uint256 id) public
```

### decreaseDefendingTankCount

```solidity
function decreaseDefendingTankCount(uint256 amount, uint256 id) public
```

### decreaseDefendingTankCountFromCruiseMissileContract

```solidity
function decreaseDefendingTankCountFromCruiseMissileContract(uint256 amount, uint256 id) public
```

### decreaseDefendingTankCountFromNukeContract

```solidity
function decreaseDefendingTankCountFromNukeContract(uint256 id) public
```

### decreaseDefendingTankCountFromAirBattleContract

```solidity
function decreaseDefendingTankCountFromAirBattleContract(uint256 id, uint256 amountToDecrease) public
```

### getTankCount

```solidity
function getTankCount(uint256 id) public view returns (uint256 tanks)
```

### getDeployedTankCount

```solidity
function getDeployedTankCount(uint256 id) public view returns (uint256 tanks)
```

### getDefendingTankCount

```solidity
function getDefendingTankCount(uint256 id) public view returns (uint256 tanks)
```

### buySpies

```solidity
function buySpies(uint256 amount, uint256 id) public
```

### getMaxSpyCount

```solidity
function getMaxSpyCount(uint256 id) public view returns (uint256)
```

### decreaseAttackerSpyCount

```solidity
function decreaseAttackerSpyCount(uint256 id) public
```

### decreaseDefenderSpyCount

```solidity
function decreaseDefenderSpyCount(uint256 amount, uint256 id) public
```

### getSpyCount

```solidity
function getSpyCount(uint256 countryId) public view returns (uint256 count)
```

### decreaseDeployedUnits

```solidity
function decreaseDeployedUnits(uint256 attackerSoldierLosses, uint256 attackerTankLosses, uint256 attackerId) public
```

### decreaseDefendingUnits

```solidity
function decreaseDefendingUnits(uint256 defenderSoldierLosses, uint256 defenderTankLosses, uint256 defenderId) public
```

### increaseSoldierCasualties

```solidity
function increaseSoldierCasualties(uint256 id, uint256 amount) public
```

### getCasualties

```solidity
function getCasualties(uint256 id) public view returns (uint256)
```

## MissilesContract

### cruiseMissileCost

```solidity
uint256 cruiseMissileCost
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

### settings2

```solidity
function settings2(address _resources, address _improvements1, address _wonders1, address _wonders4, address _countryMinter, address _keeper) public
```

### idToMissiles

```solidity
mapping(uint256 => struct MissilesContract.Missiles) idToMissiles
```

### onlyKeeper

```solidity
modifier onlyKeeper()
```

### generateMissiles

```solidity
function generateMissiles(uint256 id) public
```

### updateTreasuryContract

```solidity
function updateTreasuryContract(address newAddress) public
```

### updateSpyContract

```solidity
function updateSpyContract(address newAddress) public
```

### updateNukeContract

```solidity
function updateNukeContract(address newAddress) public
```

### updateAirBattleContract

```solidity
function updateAirBattleContract(address newAddress) public
```

### updateNationStrengthContract

```solidity
function updateNationStrengthContract(address newAddress) public
```

### updateResourcesContract

```solidity
function updateResourcesContract(address newAddress) public
```

### updateImprovementsContract1

```solidity
function updateImprovementsContract1(address newAddress) public
```

### updateWondersContract1

```solidity
function updateWondersContract1(address newAddress) public
```

### updateWondersContract2

```solidity
function updateWondersContract2(address newAddress) public
```

### updateWondersContract4

```solidity
function updateWondersContract4(address newAddress) public
```

### updateCountryMinter

```solidity
function updateCountryMinter(address newAddress) public
```

### updateCruiseMissileCost

```solidity
function updateCruiseMissileCost(uint256 newPrice) public
```

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

### buyCruiseMissiles

```solidity
function buyCruiseMissiles(uint256 amount, uint256 id) public
```

### getCruiseMissileCount

```solidity
function getCruiseMissileCount(uint256 id) public view returns (uint256)
```

### decreaseCruiseMissileCount

```solidity
function decreaseCruiseMissileCount(uint256 amount, uint256 id) public
```

### decreaseCruiseMissileCountFromNukeContract

```solidity
function decreaseCruiseMissileCountFromNukeContract(uint256 id) public
```

### decreaseCruiseMissileCountFromAirBattleContract

```solidity
function decreaseCruiseMissileCountFromAirBattleContract(uint256 id, uint256 amountToDecrease) public
```

### buyNukes

```solidity
function buyNukes(uint256 id) public
```

### getNukeCount

```solidity
function getNukeCount(uint256 id) public view returns (uint256)
```

### decreaseNukeCountFromNukeContract

```solidity
function decreaseNukeCountFromNukeContract(uint256 id) public
```

### decreaseNukeCountFromSpyContract

```solidity
function decreaseNukeCountFromSpyContract(uint256 id) public
```

### resetNukesPurchasedToday

```solidity
function resetNukesPurchasedToday() public
```

## GroundBattleContract

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

### groundBattleIdToAttackerForces

```solidity
mapping(uint256 => struct GroundBattleContract.GroundForcesToBattle) groundBattleIdToAttackerForces
```

### groundBattleIdToDefenderForces

```solidity
mapping(uint256 => struct GroundBattleContract.GroundForcesToBattle) groundBattleIdToDefenderForces
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
function settings(address _warAddress, address _infrastructure, address _forces, address _treasury) public
```

### settings2

```solidity
function settings2(address _improvements2, address _improvements3, address _wonders3, address _wonders4) public
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

### groundAttack

```solidity
function groundAttack(uint256 warId, uint256 attackerId, uint256 defenderId, uint256 attackType) internal
```

### generateAttackerForcesStruct

```solidity
function generateAttackerForcesStruct(uint256 warId, uint256 battleId, uint256 attackerId, uint256 attackType) internal
```

### generateDefenderForcesStruct

```solidity
function generateDefenderForcesStruct(uint256 warId, uint256 battleId, uint256 defenderId) internal
```

### getAttackerForcesStrength

```solidity
function getAttackerForcesStrength(uint256 attackerId, uint256 warId) public view returns (uint256)
```

### getDefenderForcesStrength

```solidity
function getDefenderForcesStrength(uint256 defenderId, uint256 battleId) public view returns (uint256)
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
function settings(address _treasury, address _improvements2, address _improvements3, address _improvements4, address _navy, address _additionalNavy, address _countryMinter, address _wonders1) public
```

### approvedAddress

```solidity
modifier approvedAddress()
```

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _newAddress) public
```

### updateImprovementContractAddresses

```solidity
function updateImprovementContractAddresses(address _improvements2, address _improvements3, address _improvements4) public
```

### updateNavyContractAddress

```solidity
function updateNavyContractAddress(address _navy) public
```

### generateImprovements

```solidity
function generateImprovements(uint256 id) public
```

### updateAirportCost

```solidity
function updateAirportCost(uint256 newPrice) public
```

### updateBankCost

```solidity
function updateBankCost(uint256 newPrice) public
```

### updateBarracksCost

```solidity
function updateBarracksCost(uint256 newPrice) public
```

### updateBorderFortificationCost

```solidity
function updateBorderFortificationCost(uint256 newPrice) public
```

### updateBorderWallCost

```solidity
function updateBorderWallCost(uint256 newPrice) public
```

### updateBunkerCost

```solidity
function updateBunkerCost(uint256 newPrice) public
```

### updateCasinoCost

```solidity
function updateCasinoCost(uint256 newPrice) public
```

### updateChurchCost

```solidity
function updateChurchCost(uint256 newPrice) public
```

### updateClinicCost

```solidity
function updateClinicCost(uint256 newPrice) public
```

### updateDrydockCost

```solidity
function updateDrydockCost(uint256 newPrice) public
```

### updateFactoryCost

```solidity
function updateFactoryCost(uint256 newPrice) public
```

### getCost1

```solidity
function getCost1() public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

### getImprovementCount

```solidity
function getImprovementCount(uint256 id) public view returns (uint256 count)
```

### updateImprovementCount

```solidity
function updateImprovementCount(uint256 id, uint256 newCount) public
```

### buyImprovement1

```solidity
function buyImprovement1(uint256 amount, uint256 countryId, uint256 improvementId) public
```

### deleteImprovement1

```solidity
function deleteImprovement1(uint256 amount, uint256 countryId, uint256 improvementId) public
```

### getAirportCount

```solidity
function getAirportCount(uint256 countryId) public view returns (uint256 count)
```

### getBarracksCount

```solidity
function getBarracksCount(uint256 countryId) public view returns (uint256 count)
```

### getBorderFortificationCount

```solidity
function getBorderFortificationCount(uint256 countryId) public view returns (uint256 count)
```

### getBorderWallCount

```solidity
function getBorderWallCount(uint256 countryId) public view returns (uint256 count)
```

### getBankCount

```solidity
function getBankCount(uint256 countryId) public view returns (uint256)
```

### getBunkerCount

```solidity
function getBunkerCount(uint256 countryId) public view returns (uint256 count)
```

### getCasinoCount

```solidity
function getCasinoCount(uint256 countryId) public view returns (uint256)
```

### getChurchCount

```solidity
function getChurchCount(uint256 countryId) public view returns (uint256)
```

### getDrydockCount

```solidity
function getDrydockCount(uint256 countryId) public view returns (uint256 count)
```

### getClinicCount

```solidity
function getClinicCount(uint256 countryId) public view returns (uint256 count)
```

### getFactoryCount

```solidity
function getFactoryCount(uint256 countryId) public view returns (uint256 count)
```

## ImprovementsContract2

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

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _treasury) public
```

### updateImprovementContract1Address

```solidity
function updateImprovementContract1Address(address _improvements1) public
```

### updateWondersContract1Address

```solidity
function updateWondersContract1Address(address _wonders1) public
```

### updateForcesAddress

```solidity
function updateForcesAddress(address _forces) public
```

### generateImprovements

```solidity
function generateImprovements(uint256 id) public
```

### getCost2

```solidity
function getCost2() public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

### updateForeignMinistryCost

```solidity
function updateForeignMinistryCost(uint256 newPrice) public
```

### updateForwardOperatingBaseCost

```solidity
function updateForwardOperatingBaseCost(uint256 newPrice) public
```

### updateGuerillaCampCost

```solidity
function updateGuerillaCampCost(uint256 newPrice) public
```

### updateHarborCost

```solidity
function updateHarborCost(uint256 newPrice) public
```

### updateHospitalCost

```solidity
function updateHospitalCost(uint256 newPrice) public
```

### updateIntelligenceAgencyCost

```solidity
function updateIntelligenceAgencyCost(uint256 newPrice) public
```

### updateJailCost

```solidity
function updateJailCost(uint256 newPrice) public
```

### updateLaborCampCost

```solidity
function updateLaborCampCost(uint256 newPrice) public
```

### buyImprovement2

```solidity
function buyImprovement2(uint256 amount, uint256 countryId, uint256 improvementId) public
```

### deleteImprovement2

```solidity
function deleteImprovement2(uint256 amount, uint256 countryId, uint256 improvementId) public
```

### getForeignMinistryCount

```solidity
function getForeignMinistryCount(uint256 countryId) public view returns (uint256)
```

### getForwardOperatingBaseCount

```solidity
function getForwardOperatingBaseCount(uint256 countryId) public view returns (uint256 count)
```

### getGuerillaCampCount

```solidity
function getGuerillaCampCount(uint256 countryId) public view returns (uint256)
```

### getHarborCount

```solidity
function getHarborCount(uint256 countryId) public view returns (uint256 count)
```

### getHospitalCount

```solidity
function getHospitalCount(uint256 countryId) public view returns (uint256 count)
```

### getIntelAgencyCount

```solidity
function getIntelAgencyCount(uint256 countryId) public view returns (uint256 count)
```

### getJailCount

```solidity
function getJailCount(uint256 countryId) public view returns (uint256 count)
```

### getLaborCampCount

```solidity
function getLaborCampCount(uint256 countryId) public view returns (uint256 count)
```

## ImprovementsContract4

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

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _newTreasuryAddress) public
```

### updateImprovementContract1Address

```solidity
function updateImprovementContract1Address(address _improvements1) public
```

### updateImprovementContract2Address

```solidity
function updateImprovementContract2Address(address _improvements2) public
```

### updateForcesAddress

```solidity
function updateForcesAddress(address _forces) public
```

### generateImprovements

```solidity
function generateImprovements(uint256 id) public
```

### getCost4

```solidity
function getCost4() public view returns (uint256, uint256, uint256, uint256)
```

### updateMissileDefenseCost

```solidity
function updateMissileDefenseCost(uint256 newPrice) public
```

### updateMunitionsFactoryCost

```solidity
function updateMunitionsFactoryCost(uint256 newPrice) public
```

### updateNavalAcademyCost

```solidity
function updateNavalAcademyCost(uint256 newPrice) public
```

### updateNavalConstructionYardCost

```solidity
function updateNavalConstructionYardCost(uint256 newPrice) public
```

### buyImprovement4

```solidity
function buyImprovement4(uint256 amount, uint256 countryId, uint256 improvementId) public
```

### deleteImprovement4

```solidity
function deleteImprovement4(uint256 amount, uint256 countryId, uint256 improvementId) public
```

### getMissileDefenseCount

```solidity
function getMissileDefenseCount(uint256 countryId) public view returns (uint256 count)
```

### getMunitionsFactoryCount

```solidity
function getMunitionsFactoryCount(uint256 countryId) public view returns (uint256 count)
```

### getNavalAcademyCount

```solidity
function getNavalAcademyCount(uint256 countryId) public view returns (uint256 count)
```

### getNavalConstructionYardCount

```solidity
function getNavalConstructionYardCount(uint256 countryId) public view returns (uint256 count)
```

## ImprovementsContract3

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

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _treasury) public
```

### updateImprovementContract1Address

```solidity
function updateImprovementContract1Address(address _improvements1) public
```

### updateImprovementContract2Address

```solidity
function updateImprovementContract2Address(address _improvements2) public
```

### updateNavyContractAddress

```solidity
function updateNavyContractAddress(address _navy) public
```

### generateImprovements

```solidity
function generateImprovements(uint256 id) public
```

### getCost3

```solidity
function getCost3() public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

### updateOfficeOfPropagandaCost

```solidity
function updateOfficeOfPropagandaCost(uint256 newPrice) public
```

### updatePoliceHeadquartersCost

```solidity
function updatePoliceHeadquartersCost(uint256 newPrice) public
```

### updatePrisonCost

```solidity
function updatePrisonCost(uint256 newPrice) public
```

### updateRadiationContainmentChamberCost

```solidity
function updateRadiationContainmentChamberCost(uint256 newPrice) public
```

### updateRedLightDistrictCost

```solidity
function updateRedLightDistrictCost(uint256 newPrice) public
```

### updateRehabilitationFacilityCost

```solidity
function updateRehabilitationFacilityCost(uint256 newPrice) public
```

### updateSatelliteCost

```solidity
function updateSatelliteCost(uint256 newPrice) public
```

### updateSchoolCost

```solidity
function updateSchoolCost(uint256 newPrice) public
```

### updateShipyardCost

```solidity
function updateShipyardCost(uint256 newPrice) public
```

### updateStadiumCost

```solidity
function updateStadiumCost(uint256 newPrice) public
```

### updateUniversityCost

```solidity
function updateUniversityCost(uint256 newPrice) public
```

### buyImprovement3

```solidity
function buyImprovement3(uint256 amount, uint256 countryId, uint256 improvementId) public
```

### deleteImprovement3

```solidity
function deleteImprovement3(uint256 amount, uint256 countryId, uint256 improvementId) public
```

### getOfficeOfPropagandaCount

```solidity
function getOfficeOfPropagandaCount(uint256 countryId) public view returns (uint256)
```

### getPoliceHeadquartersCount

```solidity
function getPoliceHeadquartersCount(uint256 countryId) public view returns (uint256)
```

### getPrisonCount

```solidity
function getPrisonCount(uint256 countryId) public view returns (uint256)
```

### getRadiationContainmentChamberCount

```solidity
function getRadiationContainmentChamberCount(uint256 countryId) public view returns (uint256)
```

### getRedLightDistrictCount

```solidity
function getRedLightDistrictCount(uint256 countryId) public view returns (uint256)
```

### getRehabilitationFacilityCount

```solidity
function getRehabilitationFacilityCount(uint256 countryId) public view returns (uint256)
```

### getSatelliteCount

```solidity
function getSatelliteCount(uint256 countryId) public view returns (uint256 count)
```

### getSchoolCount

```solidity
function getSchoolCount(uint256 countryId) public view returns (uint256)
```

### getShipyardCount

```solidity
function getShipyardCount(uint256 countryId) public view returns (uint256 count)
```

### getStadiumCount

```solidity
function getStadiumCount(uint256 countryId) public view returns (uint256 count)
```

### getUniversityCount

```solidity
function getUniversityCount(uint256 countryId) public view returns (uint256 count)
```

## InfrastructureContract

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
function settings1(address _resources, address _improvements1, address _improvements2, address _improvements3, address _improvements4, address _infrastructureMarket, address _techMarket, address _landMarket) public
```

### settings2

```solidity
function settings2(address _wonders1, address _wonders2, address _wonders3, address _wonders4, address _treasury, address _parameters, address _forces, address _aid) public
```

### settings3

```solidity
function settings3(address _spyAddress, address _tax, address _cruiseMissile, address _nukeAddress, address _airBattle, address _groundBattle, address _countryMinter, address _crime) public
```

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

### generateInfrastructure

```solidity
function generateInfrastructure(uint256 id) public
```

### increaseInfrastructureFromMarket

```solidity
function increaseInfrastructureFromMarket(uint256 id, uint256 amount) public
```

### decreaseInfrastructureFromMarket

```solidity
function decreaseInfrastructureFromMarket(uint256 id, uint256 amount) public
```

### increaseTechnologyFromMarket

```solidity
function increaseTechnologyFromMarket(uint256 id, uint256 amount) public
```

### decreaseTechnologyFromMarket

```solidity
function decreaseTechnologyFromMarket(uint256 id, uint256 amount) public
```

### increaseLandCountFromMarket

```solidity
function increaseLandCountFromMarket(uint256 id, uint256 amount) public
```

### decreaseLandCountFromMarket

```solidity
function decreaseLandCountFromMarket(uint256 id, uint256 amount) public
```

### getAreaOfInfluence

```solidity
function getAreaOfInfluence(uint256 id) public view returns (uint256)
```

### sellLand

```solidity
function sellLand(uint256 id, uint256 amount) public
```

### onlyAidContract

```solidity
modifier onlyAidContract()
```

### sendTech

```solidity
function sendTech(uint256 idSender, uint256 idReciever, uint256 amount) public
```

### getLandCount

```solidity
function getLandCount(uint256 countryId) public view returns (uint256 count)
```

### decreaseLandCount

```solidity
function decreaseLandCount(uint256 countryId, uint256 amount) public
```

### decreaseLandCountFromNukeContract

```solidity
function decreaseLandCountFromNukeContract(uint256 countryId, uint256 percentage) public
```

### increaseLandCountFromSpyContract

```solidity
function increaseLandCountFromSpyContract(uint256 countryId, uint256 amount) public
```

### getTechnologyCount

```solidity
function getTechnologyCount(uint256 countryId) public view returns (uint256 count)
```

### decreaseTechCountFromSpyContract

```solidity
function decreaseTechCountFromSpyContract(uint256 countryId, uint256 amount) public
```

### decreaseTechCountFromCruiseMissileContract

```solidity
function decreaseTechCountFromCruiseMissileContract(uint256 countryId, uint256 amount) public
```

### decreaseTechCountFromNukeContract

```solidity
function decreaseTechCountFromNukeContract(uint256 countryId, uint256 percentage) public
```

### increaseTechCountFromSpyContract

```solidity
function increaseTechCountFromSpyContract(uint256 countryId, uint256 amount) public
```

### getInfrastructureCount

```solidity
function getInfrastructureCount(uint256 countryId) public view returns (uint256 count)
```

### decreaseInfrastructureCountFromSpyContract

```solidity
function decreaseInfrastructureCountFromSpyContract(uint256 countryId, uint256 amount) public
```

### decreaseInfrastructureCountFromCruiseMissileContract

```solidity
function decreaseInfrastructureCountFromCruiseMissileContract(uint256 countryId, uint256 amountToDecrease) public
```

### decreaseInfrastructureCountFromNukeContract

```solidity
function decreaseInfrastructureCountFromNukeContract(uint256 defenderId, uint256 attackerId, uint256 percentage) public
```

### decreaseInfrastructureCountFromAirBattleContract

```solidity
function decreaseInfrastructureCountFromAirBattleContract(uint256 countryId, uint256 amountToDecrease) public
```

### increaseInfrastructureCountFromSpyContract

```solidity
function increaseInfrastructureCountFromSpyContract(uint256 countryId, uint256 amount) public
```

### getTaxRate

```solidity
function getTaxRate(uint256 id) public view returns (uint256 taxPercentage)
```

### setTaxRate

```solidity
function setTaxRate(uint256 id, uint256 newTaxRate) public
```

### setTaxRateFromSpyContract

```solidity
function setTaxRateFromSpyContract(uint256 id, uint256 newTaxRate) public
```

### toggleCollectionNeededToChangeRate

```solidity
function toggleCollectionNeededToChangeRate(uint256 id) public
```

### checkIfCollectionNeededToChangeRate

```solidity
function checkIfCollectionNeededToChangeRate(uint256 id) public view returns (bool)
```

### getTotalPopulationCount

```solidity
function getTotalPopulationCount(uint256 id) public view returns (uint256)
```

### getAdditionalPopulationModifierPoints

```solidity
function getAdditionalPopulationModifierPoints(uint256 id) internal view returns (uint256)
```

### getTaxablePopulationCount

```solidity
function getTaxablePopulationCount(uint256 id) public view returns (uint256)
```

### transferLandAndTech

```solidity
function transferLandAndTech(uint256 landMiles, uint256 techLevels, uint256 attackerId, uint256 defenderId) public
```

## InfrastructureMarketContract

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

### settings

```solidity
function settings(address _resources, address _parameters, address _improvements1, address _countryMinter, address _wonders2, address _wonders3, address _treasury, address _infrastructure) public
```

### buyInfrastructure

```solidity
function buyInfrastructure(uint256 id, uint256 buyAmount) public
```

### getInfrastructureCost

```solidity
function getInfrastructureCost(uint256 id, uint256 buyAmount) public view returns (uint256)
```

### getInfrastructureCostPerLevel

```solidity
function getInfrastructureCostPerLevel(uint256 id) public view returns (uint256)
```

### getInfrastructureCostMultiplier1

```solidity
function getInfrastructureCostMultiplier1(uint256 id) public view returns (uint256)
```

### getInfrastructureCostMultiplier2

```solidity
function getInfrastructureCostMultiplier2(uint256 id) public view returns (uint256)
```

### getInfrastructureCostMultiplier3

```solidity
function getInfrastructureCostMultiplier3(uint256 id) public view returns (uint256)
```

### checkAccomodativeGovernment

```solidity
function checkAccomodativeGovernment(uint256 countryId) public view returns (bool)
```

### destroyInfrastructure

```solidity
function destroyInfrastructure(uint256 id, uint256 amount) public
```

## KeeperContract

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

### settings

```solidity
function settings(address _nukes, address _aid, address _war, address _treasury, address _missiles, address _navalActions) public
```

### keeperFunctionToCall

```solidity
function keeperFunctionToCall() public
```

### keeperFunctionToCallManually

```solidity
function keeperFunctionToCallManually() public
```

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

## LandMarketContract

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

### buyLand

```solidity
function buyLand(uint256 id, uint256 amount) public
```

### getLandCost

```solidity
function getLandCost(uint256 id, uint256 amount) public view returns (uint256)
```

### getLandCostPerMile

```solidity
function getLandCostPerMile(uint256 id) public view returns (uint256)
```

### getLandPriceMultiplier

```solidity
function getLandPriceMultiplier(uint256 id) public view returns (uint256)
```

### destroyLand

```solidity
function destroyLand(uint256 id, uint256 amount) public
```

## MetaNationsGovToken

This token will be spent to purchase your nation NFT
This token is spent at the amount equivalent cost in USDC to the seed money of the nation (initiallt 2,000,000 WarBucks)

### constructor

```solidity
constructor(uint256 initialSupply) public
```

_the initialSupply is minted to the deployer of the contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| initialSupply | uint256 | is the initial supply minted of MetaNationsGovToekn |

## MilitaryContract

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

### settings

```solidity
function settings(address _spyAddress, address _countryMinter) public
```

### generateMilitary

```solidity
function generateMilitary(uint256 id) public
```

### updateDefconLevel

```solidity
function updateDefconLevel(uint256 newDefcon, uint256 id) public
```

### setDefconLevelFromSpyContract

```solidity
function setDefconLevelFromSpyContract(uint256 id, uint256 newLevel) public
```

### updateThreatLevel

```solidity
function updateThreatLevel(uint256 newThreatLevel, uint256 id) public
```

### setThreatLevelFromSpyContract

```solidity
function setThreatLevelFromSpyContract(uint256 id, uint256 newLevel) public
```

### toggleWarPeacePreference

```solidity
function toggleWarPeacePreference(uint256 id) public
```

### getDefconLevel

```solidity
function getDefconLevel(uint256 id) public view returns (uint256)
```

### getThreatLevel

```solidity
function getThreatLevel(uint256 id) public view returns (uint256)
```

### getWarPeacePreference

```solidity
function getWarPeacePreference(uint256 id) public view returns (bool)
```

## NationStrengthContract

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

### settings

```solidity
function settings(address _infrastructure, address _forces, address _fighters, address _bombers, address _navy, address _missiles) public
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

### updateBombersContract

```solidity
function updateBombersContract(address newAddress) public
```

### updateNavyContract

```solidity
function updateNavyContract(address newAddress) public
```

### getNationStrength

```solidity
function getNationStrength(uint256 id) public view returns (uint256)
```

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

### keeper

```solidity
address keeper
```

### navy

```solidity
address navy
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
function settings(address _navalBlockade, address _breakBlockade, address _navalAttack, address _keeper, address _navy, address _countryMinter) public
```

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

### increaseAction

```solidity
function increaseAction(uint256 id) public
```

### onlyNavy

```solidity
modifier onlyNavy()
```

### increasePurchases

```solidity
function increasePurchases(uint256 id, uint256 amount) public
```

### onlyBlockade

```solidity
modifier onlyBlockade()
```

### toggleBlockaded

```solidity
function toggleBlockaded(uint256 id) public
```

### onlyKeeper

```solidity
modifier onlyKeeper()
```

### resetActionsToday

```solidity
function resetActionsToday() public
```

### getPurchasesToday

```solidity
function getPurchasesToday(uint256 id) public view returns (uint256)
```

### getActionSlotsUsed

```solidity
function getActionSlotsUsed(uint256 id) public view returns (uint256)
```

### getBlockadedToday

```solidity
function getBlockadedToday(uint256 id) public view returns (bool)
```

## NavyContract

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

### corvetteCost

```solidity
uint256 corvetteCost
```

### landingShipCost

```solidity
uint256 landingShipCost
```

### battleshipCost

```solidity
uint256 battleshipCost
```

### cruiserCost

```solidity
uint256 cruiserCost
```

### frigateCost

```solidity
uint256 frigateCost
```

### destroyerCost

```solidity
uint256 destroyerCost
```

### submarineCost

```solidity
uint256 submarineCost
```

### aircraftCarrierCost

```solidity
uint256 aircraftCarrierCost
```

### Navy

```solidity
struct Navy {
  uint256 navyVessels;
  uint256 corvetteCount;
  uint256 landingShipCount;
  uint256 battleshipCount;
  uint256 cruiserCount;
  uint256 frigateCount;
  uint256 destroyerCount;
  uint256 submarineCount;
  uint256 aircraftCarrierCount;
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

### settings

```solidity
function settings(address _treasuryAddress, address _improvementsContract1Address, address _improvementsContract3Address, address _improvements4, address _resources, address _military, address _nukes, address _wonders1, address _navalActions, address _additionalNavy) public
```

### settings2

```solidity
function settings2(address _countryMinter) public
```

### generateNavy

```solidity
function generateNavy(uint256 id) public
```

### onlyBattle

```solidity
modifier onlyBattle()
```

### decrementLosses

```solidity
function decrementLosses(uint256[] defenderLosses, uint256 defenderId, uint256[] attackerLosses, uint256 attackerId) public
```

### buyCorvette

```solidity
function buyCorvette(uint256 amount, uint256 id) public
```

### getCorvetteCount

```solidity
function getCorvetteCount(uint256 id) public view returns (uint256)
```

### decreaseCorvetteCount

```solidity
function decreaseCorvetteCount(uint256 amount, uint256 id) public
```

### buyLandingShip

```solidity
function buyLandingShip(uint256 amount, uint256 id) public
```

### getLandingShipCount

```solidity
function getLandingShipCount(uint256 id) public view returns (uint256)
```

### decreaseLandingShipCount

```solidity
function decreaseLandingShipCount(uint256 amount, uint256 id) public
```

### buyBattleship

```solidity
function buyBattleship(uint256 amount, uint256 id) public
```

### getBattleshipCount

```solidity
function getBattleshipCount(uint256 id) public view returns (uint256)
```

### decreaseBatteshipCount

```solidity
function decreaseBatteshipCount(uint256 amount, uint256 id) public
```

### buyCruiser

```solidity
function buyCruiser(uint256 amount, uint256 id) public
```

### getCruiserCount

```solidity
function getCruiserCount(uint256 id) public view returns (uint256)
```

### decreaseCruiserCount

```solidity
function decreaseCruiserCount(uint256 amount, uint256 id) public
```

### buyFrigate

```solidity
function buyFrigate(uint256 amount, uint256 id) public
```

### getFrigateCount

```solidity
function getFrigateCount(uint256 id) public view returns (uint256)
```

### decreaseFrigateCount

```solidity
function decreaseFrigateCount(uint256 amount, uint256 id) public
```

### buyDestroyer

```solidity
function buyDestroyer(uint256 amount, uint256 id) public
```

### getDestroyerCount

```solidity
function getDestroyerCount(uint256 id) public view returns (uint256)
```

### decreaseDestroyerCount

```solidity
function decreaseDestroyerCount(uint256 amount, uint256 id) public
```

### buySubmarine

```solidity
function buySubmarine(uint256 amount, uint256 id) public
```

### getSubmarineCount

```solidity
function getSubmarineCount(uint256 id) public view returns (uint256)
```

### decreaseSubmarineCount

```solidity
function decreaseSubmarineCount(uint256 amount, uint256 id) public
```

### buyAircraftCarrier

```solidity
function buyAircraftCarrier(uint256 amount, uint256 id) public
```

### getAircraftCarrierCount

```solidity
function getAircraftCarrierCount(uint256 id) public view returns (uint256)
```

### decreaseAircraftCarrierCount

```solidity
function decreaseAircraftCarrierCount(uint256 amount, uint256 id) public
```

### onlyNukeContract

```solidity
modifier onlyNukeContract()
```

### decreaseNavyFromNukeContract

```solidity
function decreaseNavyFromNukeContract(uint256 defenderId) public
```

## AdditionalNavyContract

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

### settings

```solidity
function settings(address _navy, address _navalActions, address _military, address _wonders1, address _improvements4) public
```

### getAvailablePurchases

```solidity
function getAvailablePurchases(uint256 id) public view returns (uint256)
```

### getBlockadeCapableShips

```solidity
function getBlockadeCapableShips(uint256 id) public view returns (uint256)
```

### getBreakBlockadeCapableShips

```solidity
function getBreakBlockadeCapableShips(uint256 id) public view returns (uint256)
```

### getVesselCountForDrydock

```solidity
function getVesselCountForDrydock(uint256 countryId) public view returns (uint256 count)
```

### getVesselCountForShipyard

```solidity
function getVesselCountForShipyard(uint256 countryId) public view returns (uint256 count)
```

## NavalBlockadeContract

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
function settings(address _countryMinter, address _navalBlockade, address _navy, address _warAddress, address _improvements4, address _navalActions) public
```

### breakBlockade

```solidity
function breakBlockade(uint256 warId, uint256 attackerId, uint256 blockaderId) public
```

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
function settings(address _navy, address _war, address _improvements4, address _navalActions) public
```

### navalAttack

```solidity
function navalAttack(uint256 warId, uint256 attackerId, uint256 defenderId) public
```

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

### settings

```solidity
function settings(address _countryMinter, address _warAddress, address _wonders1, address _wonders4, address _improvements3, address _improvements4, address _infrastructure, address _forces, address _navy, address _missiles, address _keeper) public
```

### updateCountryMinterContract

```solidity
function updateCountryMinterContract(address newAddress) public
```

### updateWarContract

```solidity
function updateWarContract(address newAddress) public
```

### updateWonders1Contract

```solidity
function updateWonders1Contract(address newAddress) public
```

### launchNuke

```solidity
function launchNuke(uint256 warId, uint256 attackerId, uint256 defenderId, uint256 attackType) public
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

### inflictNukeDamage

```solidity
function inflictNukeDamage(uint256 attackId) internal
```

### standardAttack

```solidity
function standardAttack(uint256 attackId) internal
```

### infrastructureAttack

```solidity
function infrastructureAttack(uint256 attackId) internal
```

### landAttack

```solidity
function landAttack(uint256 attackId) internal
```

### technologyAttack

```solidity
function technologyAttack(uint256 attackId) internal
```

### calculateNukesLandedLastSevenDays

```solidity
function calculateNukesLandedLastSevenDays() public view returns (uint256)
```

### getGlobalRadiation

```solidity
function getGlobalRadiation() public view returns (uint256)
```

### onlyKeeper

```solidity
modifier onlyKeeper()
```

### shiftNukesDroppedDays

```solidity
function shiftNukesDroppedDays() public
```

## ResourcesContract

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

### mint

```solidity
contract CountryMinter mint
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

### idToResources1

```solidity
mapping(uint256 => struct ResourcesContract.Resources1) idToResources1
```

### idToResources2

```solidity
mapping(uint256 => struct ResourcesContract.Resources2) idToResources2
```

### idToBonusResources

```solidity
mapping(uint256 => struct ResourcesContract.BonusResources) idToBonusResources
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

### constructor

```solidity
constructor(address vrfCoordinatorV2, uint64 subscriptionId, bytes32 gasLane, uint32 callbackGasLimit) public
```

### settings

```solidity
function settings(address _infrastructure, address _improvements2, address _countryMinter) public
```

### generateResources

```solidity
function generateResources(uint256 id) public
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

### mockResourcesForTesting

```solidity
function mockResourcesForTesting(uint256 countryId, uint256 resource1, uint256 resource2) public
```

### setResources

```solidity
function setResources(uint256 id) internal
```

### setTrades

```solidity
function setTrades(uint256 id) internal
```

### setBonusResources

```solidity
function setBonusResources(uint256 id) public
```

### proposeTrade

```solidity
function proposeTrade(uint256 requestorId, uint256 recipientId) public
```

### getProposedTradingPartners

```solidity
function getProposedTradingPartners(uint256 id) public view returns (uint256[])
```

### isTradePossibleForRequestor

```solidity
function isTradePossibleForRequestor(uint256 requestorId) internal view returns (bool)
```

### isTradePossibleForRecipient

```solidity
function isTradePossibleForRecipient(uint256 recipientId) internal view returns (bool)
```

### fulfillTradingPartner

```solidity
function fulfillTradingPartner(uint256 recipientId, uint256 requestorId) public
```

### removeTradingPartner

```solidity
function removeTradingPartner(uint256 nationId, uint256 partnerId) public
```

### isProposedTrade

```solidity
function isProposedTrade(uint256 recipientId, uint256 requestorId) public view returns (bool isProposed)
```

### isActiveTrade

```solidity
function isActiveTrade(uint256 country1Id, uint256 country2Id) public view returns (bool isActive)
```

### getResourcesFromTradingPartner

```solidity
function getResourcesFromTradingPartner(uint256 partnerId) public view returns (uint256, uint256)
```

### viewAffluentPopulation

```solidity
function viewAffluentPopulation(uint256 id) public view returns (bool)
```

### viewAluminium

```solidity
function viewAluminium(uint256 id) public view returns (bool)
```

### viewAsphalt

```solidity
function viewAsphalt(uint256 id) public view returns (bool)
```

### viewAutomobiles

```solidity
function viewAutomobiles(uint256 id) public view returns (bool)
```

### viewBeer

```solidity
function viewBeer(uint256 id) public view returns (bool)
```

### viewCattle

```solidity
function viewCattle(uint256 id) public view returns (bool)
```

### viewCoal

```solidity
function viewCoal(uint256 id) public view returns (bool)
```

### viewConstruction

```solidity
function viewConstruction(uint256 id) public view returns (bool)
```

### viewFastFood

```solidity
function viewFastFood(uint256 id) public view returns (bool)
```

### viewFineJewelry

```solidity
function viewFineJewelry(uint256 id) public view returns (bool)
```

### viewFish

```solidity
function viewFish(uint256 id) public view returns (bool)
```

### viewFurs

```solidity
function viewFurs(uint256 id) public view returns (bool)
```

### viewGems

```solidity
function viewGems(uint256 id) public view returns (bool)
```

### viewGold

```solidity
function viewGold(uint256 id) public view returns (bool)
```

### viewIron

```solidity
function viewIron(uint256 id) public view returns (bool)
```

### viewLead

```solidity
function viewLead(uint256 id) public view returns (bool)
```

### viewLumber

```solidity
function viewLumber(uint256 id) public view returns (bool)
```

### viewMarble

```solidity
function viewMarble(uint256 id) public view returns (bool)
```

### viewMicrochips

```solidity
function viewMicrochips(uint256 id) public view returns (bool)
```

### viewOil

```solidity
function viewOil(uint256 id) public view returns (bool)
```

### viewPigs

```solidity
function viewPigs(uint256 id) public view returns (bool)
```

### viewRadiationCleanup

```solidity
function viewRadiationCleanup(uint256 id) public view returns (bool)
```

### viewRubber

```solidity
function viewRubber(uint256 id) public view returns (bool)
```

### viewScholars

```solidity
function viewScholars(uint256 id) public view returns (bool)
```

### viewSilver

```solidity
function viewSilver(uint256 id) public view returns (bool)
```

### viewSpices

```solidity
function viewSpices(uint256 id) public view returns (bool)
```

### viewSteel

```solidity
function viewSteel(uint256 id) public view returns (bool)
```

### viewSugar

```solidity
function viewSugar(uint256 id) public view returns (bool)
```

### viewUranium

```solidity
function viewUranium(uint256 id) public view returns (bool)
```

### viewWater

```solidity
function viewWater(uint256 id) public view returns (bool)
```

### viewWheat

```solidity
function viewWheat(uint256 id) public view returns (bool)
```

### viewWine

```solidity
function viewWine(uint256 id) public view returns (bool)
```

### getPlayerResources

```solidity
function getPlayerResources(uint256 id) public view returns (uint256[])
```

### getTradingPartners

```solidity
function getTradingPartners(uint256 id) public view returns (uint256[])
```

## SenateContract

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

### generateVoter

```solidity
function generateVoter(uint256 id) public
```

### updateTeam

```solidity
function updateTeam(uint256 id, uint256 newTeam) public
```

### voteForSenator

```solidity
function voteForSenator(uint256 idVoter, uint256 idOfSenateVote) public
```

### inaugurateTeam7Senators

```solidity
function inaugurateTeam7Senators(uint256[] newSenatorArray) public
```

### sanctionTeamMember

```solidity
function sanctionTeamMember(uint256 idSenator, uint256 idSanctioned) public
```

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

## SpyOperationsContract

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

### constructor

```solidity
constructor(address vrfCoordinatorV2, uint64 subscriptionId, bytes32 gasLane, uint32 callbackGasLimit) public
```

### settings

```solidity
function settings(address _infrastructure, address _forces, address _military, address _nationStrength, address _wonders1, address _treasury, address _parameters, address _missiles) public
```

### updateInfrastructureContract

```solidity
function updateInfrastructureContract(address newAddress) public
```

### conductSpyOperation

```solidity
function conductSpyOperation(uint256 attackerId, uint256 defenderId, uint256 attackType) public
```

### fulfillRequest

```solidity
function fulfillRequest(uint256 id) internal
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
function executeSpyOperation(uint256 attackerId, uint256 defenderId, uint256 attackType, uint256 attackId) internal
```

### gatherIntelligence

```solidity
function gatherIntelligence() internal
```

### destroyCruiseMissiles

```solidity
function destroyCruiseMissiles(uint256 defenderId, uint256 attackId) internal
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

### settings1

```solidity
function settings1(address _countryMinter, address _infrastructure, address _treasury, address _improvements1, address _improvements2, address _improvements3, address _additionalTaxes) public
```

### settings2

```solidity
function settings2(address _parameters, address _wonders1, address _wonders2, address _wonders3, address _wonders4, address _resources, address _forces, address _military, address _crime) public
```

### idToOwnerTaxes

```solidity
mapping(uint256 => address) idToOwnerTaxes
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### updateCountryMinter

```solidity
function updateCountryMinter(address newAddress) public
```

### updateInfrastructureContract

```solidity
function updateInfrastructureContract(address newAddress) public
```

### updateTreasuryContract

```solidity
function updateTreasuryContract(address newAddress) public
```

### updateImprovementsContract1

```solidity
function updateImprovementsContract1(address newAddress) public
```

### updateImprovementsContract2

```solidity
function updateImprovementsContract2(address newAddress) public
```

### updateImprovementsContract3

```solidity
function updateImprovementsContract3(address newAddress) public
```

### updateCountryParametersContract

```solidity
function updateCountryParametersContract(address newAddress) public
```

### updateWondersContract2

```solidity
function updateWondersContract2(address newAddress) public
```

### updateWondersContract3

```solidity
function updateWondersContract3(address newAddress) public
```

### updateResourcesContract

```solidity
function updateResourcesContract(address newAddress) public
```

### updateForcesContract

```solidity
function updateForcesContract(address newAddress) public
```

### updateMilitaryContract

```solidity
function updateMilitaryContract(address newAddress) public
```

### initiateTaxes

```solidity
function initiateTaxes(uint256 id, address nationOwner) public
```

### collectTaxes

```solidity
function collectTaxes(uint256 id) public
```

### getTaxesCollectible

```solidity
function getTaxesCollectible(uint256 id) public view returns (uint256, uint256)
```

### getDailyIncome

```solidity
function getDailyIncome(uint256 id) public view returns (uint256)
```

### getHappiness

```solidity
function getHappiness(uint256 id) public view returns (uint256)
```

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
function soldierToPopulationRatio(uint256 id) public view returns (uint256, bool)
```

### getPointsFromCriminals

```solidity
function getPointsFromCriminals(uint256 id) public view returns (uint256)
```

### getPointsToSubtractFromImprovements

```solidity
function getPointsToSubtractFromImprovements(uint256 id) public view returns (uint256)
```

### getUniversityPoints

```solidity
function getUniversityPoints(uint256 id) public view returns (uint256)
```

## AdditionalTaxesContract

### infrastructure

```solidity
address infrastructure
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

### inf

```solidity
contract InfrastructureContract inf
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

### settings

```solidity
function settings(address _parameters, address _wonders1, address _wonders2, address _wonders3, address _wonders4, address _resources, address _military, address _infrastructure) public
```

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

## TechnologyMarketContract

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

### settings

```solidity
function settings(address _resources, address _improvements3, address _infrastructure, address _wonders2, address _wonders3, address _wonders4, address _treasury, address _countryMinter) public
```

### buyTech

```solidity
function buyTech(uint256 id, uint256 amount) public
```

### getTechCost

```solidity
function getTechCost(uint256 id, uint256 amount) public view returns (uint256)
```

### getTechCostPerLevel

```solidity
function getTechCostPerLevel(uint256 id) public view returns (uint256)
```

### getTechCostMultiplier

```solidity
function getTechCostMultiplier(uint256 id) public view returns (uint256)
```

### destroyTech

```solidity
function destroyTech(uint256 id, uint256 amount) public
```

## TreasuryContract

### counter

```solidity
uint256 counter
```

### wonders1

```solidity
address wonders1
```

### improvements1

```solidity
address improvements1
```

### infrastructure

```solidity
address infrastructure
```

### navy

```solidity
address navy
```

### fighters

```solidity
address fighters
```

### warBucksAddress

```solidity
address warBucksAddress
```

### forces

```solidity
address forces
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
}
```

### idToTreasury

```solidity
mapping(uint256 => struct TreasuryContract.Treasury) idToTreasury
```

### settings1

```solidity
function settings1(address _warBucksAddress, address _wonders1, address _improvements1, address _infrastructure, address _forces, address _navy, address _fighters, address _aid, address _taxes, address _bills, address _spyAddress) public
```

### settings2

```solidity
function settings2(address _groundBattle, address _countryMinter, address _keeper) public
```

### generateTreasury

```solidity
function generateTreasury(uint256 id) public
```

### onlyTaxesContract

```solidity
modifier onlyTaxesContract()
```

### onlySpyContract

```solidity
modifier onlySpyContract()
```

### increaseBalanceOnTaxCollection

```solidity
function increaseBalanceOnTaxCollection(uint256 id, uint256 amount) public
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

### decreaseBalanceOnBillsPaid

```solidity
function decreaseBalanceOnBillsPaid(uint256 id, uint256 amount) public
```

### spendBalance

```solidity
function spendBalance(uint256 id, uint256 cost) public
```

### viewTaxRevenues

```solidity
function viewTaxRevenues() public view returns (uint256)
```

### withdrawTaxRevenues

```solidity
function withdrawTaxRevenues(uint256 amount) public
```

### returnBalance

```solidity
function returnBalance(uint256 id, uint256 cost) public
```

### onlyAidContract

```solidity
modifier onlyAidContract()
```

### sendAidBalance

```solidity
function sendAidBalance(uint256 idSender, uint256 idRecipient, uint256 amount) public
```

### onlyGroundBattle

```solidity
modifier onlyGroundBattle()
```

### transferSpoils

```solidity
function transferSpoils(uint256 randomNumber, uint256 attackerId, uint256 defenderId) public
```

### withdrawFunds

```solidity
function withdrawFunds(uint256 amount, uint256 id) public
```

### addFunds

```solidity
function addFunds(uint256 amount, uint256 id) public
```

### incrementDaysSince

```solidity
function incrementDaysSince() external
```

### setGameTaxRate

```solidity
function setGameTaxRate(uint256 newPercentage) public
```

### getGameTaxRate

```solidity
function getGameTaxRate() public view returns (uint256)
```

### setDaysToInactive

```solidity
function setDaysToInactive(uint256 newDays) public
```

### getDaysSinceLastTaxCollection

```solidity
function getDaysSinceLastTaxCollection(uint256 id) public view returns (uint256)
```

### getDaysSinceLastBillsPaid

```solidity
function getDaysSinceLastBillsPaid(uint256 id) public view returns (uint256)
```

### checkBalance

```solidity
function checkBalance(uint256 id) public view returns (uint256)
```

### transferBalance

```solidity
function transferBalance(uint256 toId, uint256 fromId, uint256 amount) public
```

### checkInactive

```solidity
function checkInactive(uint256 id) public view returns (bool)
```

## WarContract

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

### War

```solidity
struct War {
  uint256 warId;
  uint256 offenseId;
  uint256 defenseId;
  bool active;
  uint256 daysLeft;
  bool peaceDeclared;
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

### updateCountryMinterContract

```solidity
function updateCountryMinterContract(address newAddress) public
```

### updateNationStrengthContract

```solidity
function updateNationStrengthContract(address newAddress) public
```

### updateMilitaryContract

```solidity
function updateMilitaryContract(address newAddress) public
```

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

### initializeDeployments

```solidity
function initializeDeployments(uint256 _warId) internal
```

### checkStrength

```solidity
function checkStrength(uint256 offenseId, uint256 defenseId) public view returns (bool)
```

### offerPeace

```solidity
function offerPeace(uint256 offerId, uint256 _warId) public
```

### removeActiveWar

```solidity
function removeActiveWar(uint256 _warId) internal
```

### onlyKeeper

```solidity
modifier onlyKeeper()
```

### decrementWarDaysLeft

```solidity
function decrementWarDaysLeft() public
```

### resetCruiseMissileLaunches

```solidity
function resetCruiseMissileLaunches() public
```

### onlyNavyBattle

```solidity
modifier onlyNavyBattle()
```

### addNavyCasualties

```solidity
function addNavyCasualties(uint256 _warId, uint256 nationId, uint256 navyCasualties) public
```

### incrementCruiseMissileAttack

```solidity
function incrementCruiseMissileAttack(uint256 _warId, uint256 nationId) public
```

### isWarActive

```solidity
function isWarActive(uint256 _warId) public view returns (bool)
```

### getInvolvedParties

```solidity
function getInvolvedParties(uint256 _warId) public view returns (uint256, uint256)
```

### isPeaceOffered

```solidity
function isPeaceOffered(uint256 _warId) public view returns (bool)
```

### getDaysLeft

```solidity
function getDaysLeft(uint256 _warId) public view returns (uint256)
```

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

### onlyForcesContract

```solidity
modifier onlyForcesContract()
```

### deploySoldiers

```solidity
function deploySoldiers(uint256 nationId, uint256 _warId, uint256 amountToDeploy) public
```

### getDeployedGroundForces

```solidity
function getDeployedGroundForces(uint256 _warId, uint256 attackerId) public view returns (uint256, uint256)
```

### onlyGroundBattle

```solidity
modifier onlyGroundBattle()
```

### decreaseGroundBattleLosses

```solidity
function decreaseGroundBattleLosses(uint256 soldierLosses, uint256 tankLosses, uint256 attackerId, uint256 _warId) public
```

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

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _newTreasuryAddress) public
```

### updateWondersAddresses

```solidity
function updateWondersAddresses(address _wonderContract2Address, address _wonderContract3Address, address _wonderContract4Address) public
```

### updateInfrastructureAddresses

```solidity
function updateInfrastructureAddresses(address _infrastructureAddress) public
```

### getWonderCount

```solidity
function getWonderCount(uint256 id) public view returns (uint256 count)
```

### addWonderCount

```solidity
function addWonderCount(uint256 id) public
```

### subtractWonderCount

```solidity
function subtractWonderCount(uint256 id) public
```

### generateWonders1

```solidity
function generateWonders1(uint256 id) public
```

### updateAgricultureDevelopmentCost

```solidity
function updateAgricultureDevelopmentCost(uint256 newPrice) public
```

### updateAntiAirDefenseNetworkCost

```solidity
function updateAntiAirDefenseNetworkCost(uint256 newPrice) public
```

### updateCentralIntelligenceAgencyCost

```solidity
function updateCentralIntelligenceAgencyCost(uint256 newPrice) public
```

### updateDisasterReliefAgencyCost

```solidity
function updateDisasterReliefAgencyCost(uint256 newPrice) public
```

### updateEmpWeaponizationCost

```solidity
function updateEmpWeaponizationCost(uint256 newPrice) public
```

### updateFalloutShelterSystemCost

```solidity
function updateFalloutShelterSystemCost(uint256 newPrice) public
```

### updateFederalAidCommissionCost

```solidity
function updateFederalAidCommissionCost(uint256 newPrice) public
```

### updateFederalReserveCost

```solidity
function updateFederalReserveCost(uint256 newPrice) public
```

### updateForeignAirForceBaseCost

```solidity
function updateForeignAirForceBaseCost(uint256 newPrice) public
```

### updateForeignArmyBaseCost

```solidity
function updateForeignArmyBaseCost(uint256 newPrice) public
```

### updateForeignNavalBaseCost

```solidity
function updateForeignNavalBaseCost(uint256 newPrice) public
```

### buyWonder1

```solidity
function buyWonder1(uint256 countryId, uint256 wonderId) public
```

### deleteWonder1

```solidity
function deleteWonder1(uint256 countryId, uint256 wonderId) public
```

### getAgriculturalDevelopmentProgram

```solidity
function getAgriculturalDevelopmentProgram(uint256 id) public view returns (bool)
```

### getAntiAirDefenseNewtwork

```solidity
function getAntiAirDefenseNewtwork(uint256 id) public view returns (bool)
```

### getCentralIntelligenceAgency

```solidity
function getCentralIntelligenceAgency(uint256 id) public view returns (bool)
```

### getDisasterReliefAgency

```solidity
function getDisasterReliefAgency(uint256 id) public view returns (bool)
```

### getEmpWeaponization

```solidity
function getEmpWeaponization(uint256 id) public view returns (bool)
```

### getFalloutShelterSystem

```solidity
function getFalloutShelterSystem(uint256 id) public view returns (bool)
```

### getFederalAidComission

```solidity
function getFederalAidComission(uint256 id) public view returns (bool)
```

### getFederalReserve

```solidity
function getFederalReserve(uint256 id) public view returns (bool)
```

### getForeignAirforceBase

```solidity
function getForeignAirforceBase(uint256 id) public view returns (bool)
```

### getForeignArmyBase

```solidity
function getForeignArmyBase(uint256 id) public view returns (bool)
```

### getForeignNavalBase

```solidity
function getForeignNavalBase(uint256 id) public view returns (bool)
```

### getWonderCosts1

```solidity
function getWonderCosts1() public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

## WondersContract2

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

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _newTreasuryAddress) public
```

### updateWonderContract1Address

```solidity
function updateWonderContract1Address(address _wonderContract1Address) public
```

### updateWonderContract3Address

```solidity
function updateWonderContract3Address(address _wonderContract3Address) public
```

### updateWonderContract4Address

```solidity
function updateWonderContract4Address(address _wonderContract4Address) public
```

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address _infrastructureAddress) public
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### generateWonders2

```solidity
function generateWonders2(uint256 id) public
```

### updateGreatMonumentCost

```solidity
function updateGreatMonumentCost(uint256 newPrice) public
```

### updateGreatTempleCost

```solidity
function updateGreatTempleCost(uint256 newPrice) public
```

### updateGreatUniversityCost

```solidity
function updateGreatUniversityCost(uint256 newPrice) public
```

### updateHiddenNuclearMissileSiloCost

```solidity
function updateHiddenNuclearMissileSiloCost(uint256 newPrice) public
```

### updateInterceptorMissileSystemCost

```solidity
function updateInterceptorMissileSystemCost(uint256 newPrice) public
```

### updateInternetCost

```solidity
function updateInternetCost(uint256 newPrice) public
```

### updateInterstateSystemCost

```solidity
function updateInterstateSystemCost(uint256 newPrice) public
```

### updateManhattanProjectCost

```solidity
function updateManhattanProjectCost(uint256 newPrice) public
```

### updateMiningIndustryConsortiumCost

```solidity
function updateMiningIndustryConsortiumCost(uint256 newPrice) public
```

### buyWonder2

```solidity
function buyWonder2(uint256 countryId, uint256 wonderId) public
```

### deleteWonder2

```solidity
function deleteWonder2(uint256 countryId, uint256 wonderId) public
```

### getGreatMonument

```solidity
function getGreatMonument(uint256 id) public view returns (bool)
```

### getGreatTemple

```solidity
function getGreatTemple(uint256 id) public view returns (bool)
```

### getGreatUniversity

```solidity
function getGreatUniversity(uint256 countryId) public view returns (bool)
```

### getHiddenNuclearMissileSilo

```solidity
function getHiddenNuclearMissileSilo(uint256 countryId) public view returns (bool)
```

### getInterceptorMissileSystem

```solidity
function getInterceptorMissileSystem(uint256 countryId) public view returns (bool)
```

### getInternet

```solidity
function getInternet(uint256 countryId) public view returns (bool)
```

### getInterstateSystem

```solidity
function getInterstateSystem(uint256 countryId) public view returns (bool)
```

### getManhattanProject

```solidity
function getManhattanProject(uint256 countryId) public view returns (bool)
```

### getMiningIndustryConsortium

```solidity
function getMiningIndustryConsortium(uint256 countryId) public view returns (bool)
```

### getWonderCosts2

```solidity
function getWonderCosts2() public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

## WondersContract3

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

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _newTreasuryAddress) public
```

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address _newInfrastructureAddress) public
```

### updateWonderContract1Address

```solidity
function updateWonderContract1Address(address _wonderContract1Address) public
```

### updateWonderContract2Address

```solidity
function updateWonderContract2Address(address _wonderContract2Address) public
```

### updateWonderContract4Address

```solidity
function updateWonderContract4Address(address _wonderContract4Address) public
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### generateWonders3

```solidity
function generateWonders3(uint256 id) public
```

### updateMovieIndustryCost

```solidity
function updateMovieIndustryCost(uint256 newPrice) public
```

### updateNationalCemetaryCost

```solidity
function updateNationalCemetaryCost(uint256 newPrice) public
```

### updateNationalEnvironmentOfficeCost

```solidity
function updateNationalEnvironmentOfficeCost(uint256 newPrice) public
```

### updateNationalResearchLabCost

```solidity
function updateNationalResearchLabCost(uint256 newPrice) public
```

### updateNationalWarMemorialCost

```solidity
function updateNationalWarMemorialCost(uint256 newPrice) public
```

### updateNuclearPowerPlantCost

```solidity
function updateNuclearPowerPlantCost(uint256 newPrice) public
```

### updatePentagonCost

```solidity
function updatePentagonCost(uint256 newPrice) public
```

### updatePoliticalLobbyistsCost

```solidity
function updatePoliticalLobbyistsCost(uint256 newPrice) public
```

### updateScientificDevelopmentCenterCost

```solidity
function updateScientificDevelopmentCenterCost(uint256 newPrice) public
```

### buyWonder3

```solidity
function buyWonder3(uint256 countryId, uint256 wonderId) public
```

### deleteWonder3

```solidity
function deleteWonder3(uint256 countryId, uint256 wonderId) public
```

### getMovieIndustry

```solidity
function getMovieIndustry(uint256 countryId) public view returns (bool)
```

### getNationalCemetary

```solidity
function getNationalCemetary(uint256 countryId) public view returns (bool)
```

### getNationalEnvironmentOffice

```solidity
function getNationalEnvironmentOffice(uint256 countryId) public view returns (bool)
```

### getNationalResearchLab

```solidity
function getNationalResearchLab(uint256 countryId) public view returns (bool)
```

### getNationalWarMemorial

```solidity
function getNationalWarMemorial(uint256 countryId) public view returns (bool)
```

### getNuclearPowerPlant

```solidity
function getNuclearPowerPlant(uint256 countryId) public view returns (bool)
```

### getPentagon

```solidity
function getPentagon(uint256 countryId) public view returns (bool)
```

### getPoliticalLobbyists

```solidity
function getPoliticalLobbyists(uint256 countryId) public view returns (bool)
```

### getScientificDevelopmentCenter

```solidity
function getScientificDevelopmentCenter(uint256 countryId) public view returns (bool)
```

### getWonderCosts3

```solidity
function getWonderCosts3() public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

## WondersContract4

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

### updateTreasuryAddress

```solidity
function updateTreasuryAddress(address _newTreasuryAddress) public
```

### updateWonderContract1Address

```solidity
function updateWonderContract1Address(address _wonderContract1Address) public
```

### updateWonderContract3Address

```solidity
function updateWonderContract3Address(address _wonderContract3Address) public
```

### updateInfrastructureAddress

```solidity
function updateInfrastructureAddress(address _infrastructureAddress) public
```

### updateImprovementContractAddresses

```solidity
function updateImprovementContractAddresses(address _improvementsContract2Address, address _improvementsContract3Address) public
```

### onlyCountryMinter

```solidity
modifier onlyCountryMinter()
```

### generateWonders4

```solidity
function generateWonders4(uint256 id) public
```

### updateSocialSecuritySystemCost

```solidity
function updateSocialSecuritySystemCost(uint256 newPrice) public
```

### updateSpaceProgramCost

```solidity
function updateSpaceProgramCost(uint256 newPrice) public
```

### updateStockMarketCost

```solidity
function updateStockMarketCost(uint256 newPrice) public
```

### updateStrategicDefenseInitiativeCost

```solidity
function updateStrategicDefenseInitiativeCost(uint256 newPrice) public
```

### updateSuperiorLogisticalSupportCost

```solidity
function updateSuperiorLogisticalSupportCost(uint256 newPrice) public
```

### updateUniversalHealthcareCost

```solidity
function updateUniversalHealthcareCost(uint256 newPrice) public
```

### updateWeaponsResearchCenterCost

```solidity
function updateWeaponsResearchCenterCost(uint256 newPrice) public
```

### buyWonder4

```solidity
function buyWonder4(uint256 countryId, uint256 wonderId) public
```

### deleteWonder4

```solidity
function deleteWonder4(uint256 countryId, uint256 wonderId) public
```

### getSocialSecuritySystem

```solidity
function getSocialSecuritySystem(uint256 countryId) public view returns (bool)
```

### getSpaceProgram

```solidity
function getSpaceProgram(uint256 countryId) public view returns (bool)
```

### getStockMarket

```solidity
function getStockMarket(uint256 countryId) public view returns (bool)
```

### getStrategicDefenseInitiative

```solidity
function getStrategicDefenseInitiative(uint256 countryId) public view returns (bool)
```

### getSuperiorLogisticalSupport

```solidity
function getSuperiorLogisticalSupport(uint256 countryId) public view returns (bool)
```

### getUniversalHealthcare

```solidity
function getUniversalHealthcare(uint256 countryId) public view returns (bool)
```

### getWeaponsResearchCenter

```solidity
function getWeaponsResearchCenter(uint256 countryId) public view returns (bool)
```

### getWonderCosts4

```solidity
function getWonderCosts4() public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256)
```

