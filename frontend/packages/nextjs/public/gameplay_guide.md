---
St8craft Gameplay Guide

---

# Summary

St8craft is a text based mass multiplayer online game played in the browser. The game is run by a series of smart contracts deployed to the Fantom Blockchain and rulers govern nations in order to increase their strength and profitability. Nations will be NFTs, rulers will be externally managed crypto wallets and the in game currency will be instantly fungible for an ERC20 crypto currency. This currency, called WarBucks, can be purchased on the open market and deposited into a nation enabling faster growth. In game balace can also be withdrawn from nations resulting in WarBucks getting deposited into a rulers wallet.

Nations will compete against each other to grow faster, recover more efficiently from attack and maintain strong militaries to deter enemies and inflict damage on foes faster and more forcefully. The citizens of thriving nations will be happier and earn more income allowing their rulers to levy higher taxes. Revenues from taxes can be invested into civil, municipal or militay upgrades each with different costs and benefits. Your success and prosperity playing MataNations will likely be determined by your ability to form self sustaining autonomous alliances between your peer nations and coming to eachothers aid when wars break out.

# Ecosystem
## The Fantom Blockchain

The [Fantom Blockchain](https://https://fantom.foundation/) is a fast, scalable, and secure layer-1 EVM-compatible platform built on a permissionless aBFT consensus protocol. On Fantom, transactions are confirmed in seconds and cost just a few cents. Speed, low transaction costs, and high throughput make Fantom the ideal host for St8craft.

## FTM

The native currency of Fantom is FTM. Funds can be bridged from any major EVM chain via the bridge on [SpookySwap](https://https://spooky.fi/#/bridge). 

## WarBucks (WB)

The contract address for WarBucks on the FTM chain is OxXXXXXXXXXXXXXXXXXXX. The WarBucks contract inherits from the OpenZeppelin ERC20 contract.

FTM can then be swapped for WarBucks [here](https://). Nations rulers will need to deposit 2,000,000 WarBucks in order for a nation to be minted and, upon minting, the WarBucks will be burned and the nation will recieve 2,000,000 units of in game money reserves. 1 WB is equally and immidiately fungible for 1 unit of in game money reserves at the discretion of the nation ruler. WB can be deposited into a nation at any time for an equal amount of in game money reserves and in game reserves can be withdrawn to an equal amount of WB. 

The initial supply for WarBucks will be 20? Trillion. The overall supply will be the sum of supply available in the ERC20 token in addition to all the in game balances of the nations. The overall supply will be in constant flux as nations collect taxes and pay bills. 

When a nation collects taxes the overall balance of the game and thus the overall supply of WB will increase in the amount of the tax collection. When a nation spends money or pays bill the balance spent will be decresed from the overall game balance. Purchases will be taxed at the St8craft International Logistics Fee (SILF) percentage when money reserves are spent on upgarades at no additional cost to the consumer but with a percentage of the puchase being deposited as WB tokens in the treasury contract. The overall governance of the game, including the treasury contract, will initially be managed by a multisig wallet and eventually by a combination of the holders of the St8craft Governance Token and team senators to the fullest extent possible.

If is important to note that the WarBuck currency will be pegged to USDC at some point in the future where it will not cost more than 10 USDC ($10) for 2,000,000 WarBucks. This is to prevent the cost of minting a nation to preclude players from having access to the game. To this extent, the WarBucks currency is not for long-term speculation. In order to maintain the peg to $10 for 2,000,000 WarBucks, currency that is collected from the SILF will be sold for St8craft Governance Token (SNGT). Thus, in order to speculate on the success of the game, the SGT token (not WB) should be purchased for long term investment purposes.

## St8craft Governance Token (SGT)

The contract address for SGT on the FTM chain is OxXXXXXXXXXXXXXXXXXX. The SGT contract inherits from the OpenZeppelin ERC20 contract.

Governance for the game will initially be controlled by a multisig wallet. However, to the fullest extent possible, governance of the game will be held by the holders of the St8craft Governance Token or perhaps elected team senators where possible. 

The economics of the game are structured so that the price of the WarBucks (WB) token will have a peg of 10 USDC for 2,000,000 WB.

The supply of SGT is 100,000,000?.

[Chart of Tokenomics]

## State NFTs (SNFT)

The contract address for the St8craft NFTs is OxXXXXXXXXXXXXXXX. The MNFT contract inherits from the OpenZeppelin ERC721 contract.

# Governance

## MultiSig Governance

The overall governance of the game will initially be managed by a multisig wallet and eventually by a combination of the holders of the St8craft Governance Token and team senators to the fullest extent possible.

The address for the multisig is OxXXXXXXXXXXXX.

# Monetary Operations of the Game

## Transparency

Given the nature of the game, there will be several necessary monetary operations that will result in fluctuations to the price of assets associated with the game. To the fullest extent allowable, provided not doing so will cause additional monetary loss, monetary operations of the game will be disclosed at least 6 hours prior to any change becoming active.

These various monetary operations are as follows:

## Changes to the St8craft International Logistics Fee (SLF)

All purchases in the game call a function spendBalance() on the treasury smart contract. When this function is called the owner of a nation will recieve their purchase in exchange for spending the required amount of in game balance of that nation. When the balance is spent it is decreased from the nation's balance and the overall balance of the game and that balance is essentially burned from the overall supply of WB. A portion of this money spent can be collected via the St8craft International Logistics Fee (SLF). WB collected via the SLF will be used to fund operations of the game. At the discretion of the governance of the game and with a necessary disclosure period of 6 hours, the SLF percentage can be changed.

## Swapping WB for MNGT

Should the price of WarBucks increase to the extent that it becomes more expensive than $10 per 2,000,000 WB to mint a nation, then monetary operations may take place to sell WB from the treasury and buy MNGT. This will help stabalize the price of WB at $10 per 2,000,000 WB and in turn cause buy pressure in the MNGT coin. Please note that the WB token is not meant for long term investment purposes but rather to facilitate transactions within the game ecosystem. Should a stakeholder wish to speculate on the success of the game they should purchase the St8craft Governance Token (SGT).

Should monetary action be required to peg the price of WB and in turn purchase MNGT, then orders will be placed as TWAP orders on SpookySwap at set intervals and volumes disclosed at least 6 hours before the order is placed. The orders will be placed on the WB/MNGT pair to sell WB and buy MNGT.

## Buying WB To Support the Price

Should it be deemed necessary to increase the price of the WB token there are several options to do so

## Burning WB

A second option to support the price of WB is to burn WB form the treasury. WB collected via the SLF will be held in the treasury contract and can be collected by the multisig and burned via governance decisions where the event will be disclosed at least 6 hours before taking place.

# Gameplay

## Minting a Nation

Nations can be minted on the [St8craft website](http://st8craft.gg/mint). The connected wallet will need 2,000,000 WarBucks in the wallet. Upon minting a nation, the 2,000,000 WarBucks will be burned from the connected wallet and the nation will be available in the connected wallet with a cooresponding 2,000,000 money reserves.

When a nation is minted the ruler will be required to input  a *ruler name*, *nation name*, *capital city* and a *nation slogan*. Dont worry as these can be updated later.

## Country Parameters
Country parameters include *ruler name*, *nation name*, *capital city* and *nation slogan*. Country parameters can be updated at any time.

## Country Affiliations
Country affiliations include a nations alliance, team, government and religion.

### Alliances
Alliances are autonomous groups of nations that will work together in the game. Alliances can serve as a good deterrent from attack if an agressor knows that you have the strength of a group of nations in the event a war breaks out. Naitons can set their alliance affiliation from their country affiliations page. While a nations alliance will be displayed under the nations affialiations, the coordination of the alliances will most likey take place on forums outside the game ecosystem.

### Team
There are 15 teams in the game. Entering into a trade agreement with a team memeber will add an additional one point of happiness to each nation. However, nations can be sanctioned by team senators. Sanctioned nations will not have the ability to trade with other nations on the team they are sanctioned on. If a nation is sanctioned on one team, they will still be able to trade with members of another team where they are not sanctioned.

#### Senators

Each team has 5 democratically elected senators. Senators will be elected every thirty days. Each nation can vote for a senator on their team each election. If a nation switched teams they must wait 30 days before casting a vote in an election. 

Senators have the ability to sanction nations. Sanctioned nations will not have the ability to trade with anyone else on the team where they are sanctioned.

A sanction only requires one vote from a senator. A sanction can be removed by one vote from a senator as well. Once a nation is sanctioned a senator on that team must wait 10 days before lifting a sanction. A senator can only sanction a fellow team member on a team where they are elected. 

### National Government
Each nation will be in anarchy when it is minted. There are 11 types of governments that a nation can be. Governemnts can only be changed once every three days. 

The national governemnts are as follows:

#### Anarchy 

A political philosophy advocating for a society without government or hierarchical authority, often favoring voluntary associations and individual freedom.

When a nation is attacked and the defending soldier count drops too low a nation will be thrown into anarchy. Anarchy will last for 5 days before a ruler can change a governemnt type back to the desired government.

If a nation suffers a nuclear attack it will also be thrown into anarchy for 5 days.

#### Capitalist

An economic system where trade and industry are controlled by private owners for profit, with minimal government intervention, fostering competition and innovation.

A Capitalist nation will have the following benefits:
Area of influence will increase +5%
Initial infrastructure cost reduced -5%
Improvement and Wonder upkeep -5%

#### Communist

A political ideology aiming for a classless society where all property is publicly owned, and each person works and is paid according to their abilities and needs.

A Communist nation will have the following benefits:
Area of influence will increase +5%
Military upkeep reduced -2%
Attacking spy strength increased +10%

#### Democracy

A form of government in which power is derived from the people, often exercised either directly or through elected representatives.

A Democratic nation will have the following benefits:
Happiness increased +1
Soldier efficiency increased +8%

#### Dictatorship

A form of government where absolute power is concentrated in the hands of a single ruler, often maintained through force and restriction of freedoms.

A Dictatorship will have the following benefits:
Soldier efficiency increased +8%
Initial infrastructure cost reduced -5%
Military upkeep reduced -2%

#### Federal Governemnt

A federal government system divides power between a central authority and constituent political units, such as states or provinces, maintaining both autonomy and unity.

A Federal Governemnt will have the following benefits:
Soldier efficiency increased +8%
Initial infrastructure cost reduced -5%
Improvement and Wonder upkeep -5%

#### Monarchy

A form of government where power resides in an individual, the monarch, who rules a state or territory, typically for life and by hereditary right.

A Monarchy will have the following benefits:
Happiness increased +1
Area of influence will increase +5%
Initial infrastructure cost reduced -5%

#### Republic

A form of government in which power is held by the people and their elected representatives, and which has an elected or appointed president.

A Republic will have the following benefits:
Area of influence will increase +5%
Initial infrastructure cost reduced -5%
Attacking spy strength increased +10%

#### Revolutionary

A government established through a significant change or overthrow of the previous regime, often fueled by social and political discontent.

A Revolutionary Governemnt will have the following benefits:
Happiness increased +1
Initial infrastructure cost reduced -5%
Improvement and Wonder upkeep -5%

#### Totalitarian

Totalitarianism ensures unity and order through centralized control, eliminating societal conflicts, providing uniform direction, and facilitating rapid, large-scale implementation of policies.

A Totalitarian Governemnt will have the following benefits:
Happiness increased +1
Area of influence will increase +5%
Military upkeep reduced -2%

#### Transitional

A temporary governing body, typically established post-conflict or regime change, aiming to restore stability and set up conditions for democratic rule.

A Transitional Governemnt will have the following benefits:
Area of influence will increase +5%
Soldier efficiency increased +8%
Improvement and Wonder upkeep -5%
Attacking spy strength increased +10%

#### Desired Governemnt

When a nation is minted the people will have a desired governemnt. If the national governemnt of the nation is different from the desired governemnt of the people, then the happiness of the people will go down. Hints will be provided for what the desired government type of your people is.

A nations desired governemnt can change as the result of a successful spy attack.

### National Religion

There are 15 possible national religions of a nation. National religion can only be changed once every three days.

The national religions are as follows:

#### None

Your people do not have a national religion

#### Mixed

A blend of different religions, allowing diverse religious practices and beliefs.

#### Baha'l Faith

A monotheistic religion emphasizing unity and equality of all people and religions.

#### Buddhism

A religion seeking enlightenment and the end of suffering, primarily through meditation and ethical living.

#### Christianity

Monotheistic religion based on the life and teachings of Jesus Christ, emphasizing love and redemption.

#### Confucianism

An ethical and philosophical system centered around family loyalty, respect of elders, and righteousness.

#### Hinduism

A diverse religion characterized by a belief in reincarnation, karma, and a supreme being of many forms and natures.

#### Islam

A monotheistic religion based on the Quran, emphasizing submission to Allah's will.

#### Jainism

A religion emphasizing non-violence, truth, and asceticism, with a path of liberation for the souls towards eternal bliss.

#### Judaism

Monotheistic religion, with beliefs and ethics based on the Hebrew Bible, particularly the Torah.

#### Norse

A polytheistic religion with a pantheon of gods including Odin and Thor, associated with ancient Germanic peoples.

#### Shinto

An indigenous religion of Japan emphasizing ritual practices to connect modern Japan to its ancient past.

#### Sikhism

Monotheistic religion that believes in a formless, timeless God, emphasizing a truthful living and equality of mankind.

#### Taoism

A Chinese philosophy or religion focusing on living in harmony with the Tao, an ultimate truth or reality underlying the universe.

#### Voodoo

A religion practiced chiefly in Caribbean countries, involving rituals, ancestor worship, and a belief in a supreme God and various spirits.

#### Desired Religion

When a nation is minted the people will have a desired religion. Like the governemnt, if the national religion is different from what the people desire they will be less happy. Hints will be provided for what religion your people desire. A nations desired religion can be changed as the result of a spy attack.

## Resources and Trades

When a nation is minted it will randomly be assigned 2 natural resources. Each nation has 2 resources that are inherintly available to that nation and cannot be changed.

A ruler has the option to enter into 4 trade agreements with other nations (5 with a harbor). If a nation with Water and Coal enters into a trade agreement with a nation that has Lead and Furs then both nations will have access to all 4 resources. Trade agreements can be cancelled at any time by either ruler.

Resources and their benefits to a nation are as follows:

### Aluminium
Increases soldier efficiency +20%
Lowers infrastructure purchase cost -7%
Lowers aircraft purchase cost -8%

### Cattle
Increases the number of citizens +5%
Lowers land purchase cost -10%

### Coal
Increases the land area of influence +15%
Increases soldier efficiency +8%
Lowers infrastructure purchase cost -4%

### Fish
Increases number of citizens +8%
Lowers land purchase cost -5%

### Furs
Increases citizend daily income +3.50 WB

### Gems
Increases citizen daily income +1.50 WB
Increases population happiness +3

### Gold
Increases citizen daily income +3.00 WB
Lowes technology cost -5%

### Iron
Lowers soldier purchase cost -3.00 WB
Lowers infrastructure upkeep cost -10%
Lowers infratructure purchase cost -5%
Lowers tank upkeep cost -5%

### Lead
Lowers cruise missile and nuke purchase cost and upkeep -20%
Lowers aircraft upkeep -25%
Lowers tank cost and upkeep -8%
Lowers soldier upkeep -15%
Lowers all navy vessel upkeep -20%
Reduces environemnt penalty for owning nuclear weapons -50%

### Lumber
Lowers infrastructure purchase cost -6%
Lowers infrastructure upkeep -8%

### Marble
Lowers infrastructure purchase cost -10%

### Oil
Lowers soldier purchase cost -3.00 WB
Increases population happiness +2
Increases soldier efficiency +10%
Lowers tank upkeep -5%
Lowers aircraft purchase cost -4%
Lowers all navy vessel upkeep -10%

### Pigs
Lowers soldier upkeep -10%
Increases soldier efficiency +15%
Increases number of citizens +4%

### Rubber
Increases area of influence +20%
Lowers land purchase cost -10%
Triples value of land when selling from 100 to 300 WB per mile
Lowers infrastructure purchase cost -3%
Lowers aircraft purchse cost -4%

### Silver
Increases citizen daily income +2 WB
Increaes population happiness +2

### Spices
Increases area of influence +8%
Increases population happiness +2

### Sugar
Increases number of citizens +3%
Increases population happiness +1

### Uranium
Allows a nation to develop nuclear weapons
If a nation has nuclear weapons without access to uranium the cost to maintain the nukes is doubled
Lowers submarine and aircraft carrier purchase and upkeep cost -5%

### Water
Increases number of citizens per mile before unhappiness penalty by 50
Increases population happiness +3
Improves nation environment by 1 (-1)

### Wheat
Increases number of citizens +8%

### Wine
Increases population happiness +3


## Bonus Resources

Resources can be combined for additional benefits. Certain combinations result in bonus resources. The bonus resources, their benefits and requirements are as follows

### Beer
#### Requirements
Water, Wheat, Lumber & Aluminium
#### Benefit
Increases population happiness +2

### Steel
#### Requirements
Coal & Iron
#### Benefit
Reduces infrastucture cost -2%
Lowers all navy vessel costs -15%

### Construction
#### Requirements
Lumber, Iron, Marble, Aluminium & Technology greater than 5
#### Benefit
Reduces infrastructure cost -5%
Raises aircraft limit +10

### Fast Food
#### Reqirements
Cattle, Sugar, Spices & Pigs
#### Benefits
Increases population happiness +2

### Fine Jewelry
#### Requirements
Gold, Silver, Gems & Coal
#### Benefit
Increases population happiness +3

### Scholars
#### Requirements
Literacy greater than 90%, Lumber & Lead
#### Benefit
Increases daily population income +3.00 WB

### Asphalt
#### Requirements
Construction, Oil & Rubber
#### Benefits
Lowers infrastructure upkeep -5%

### Automobiles
#### Requirements
Asphalt & Steel
#### Benefits
Increases population happiness +3

### Affluent Population
#### Requirements
Fine Jewelry, Fish, Furs & Wine
#### Benefits
Increases citizen count +5%

### Microchips
#### Requirements
Gold, Lead, Oil & Tech greater than 10
#### Benefits
Reduces tech cost -8%
Increases population happiness +2
Lowers frigate, destroyer, submarine and aircraft carrier cost -10%

### Radiation Cleanup
#### Requirements
Construction, Microchips, Steel & Technology greater than 15
#### Benefits
Improves a nations environemnt by 1
Reduces global radiation for your nation by 50%

## Infrastructure

Infrastructure is one of the most important aspects of the game. When infrastructure is purchased it will increase your citizen count. Before modifiers, each point of infrastructure will contribute to another 8 citizens in your population. Each additional citizen means that you have more of a population to collect taxes from when you levy taxes. Your taxable citizen population will be your total population minus soldiers and criminals.

Because infrastructure is so important it will also be very expensive to purchase and also very expensive to maintain. Infrastructure upkeep will likely be the most significant part of you bill payments. Infrastructure purchases are priced at a cost per level. 

Infrastructure cost jumps occur at level 20, 100, 200, 1000, 2000, 4000, 5000, 8000 and 15000.

You will also encounter infrastucture upkeep jumps as well. You should be very careful when buying infrastructure because owning infrastructure will be profitable at levels immediately below these jumps but not profitable above these jumps. In other words, you should stop buying infrastructure just below these levels and only buy more when you can buy enough to get well past the jump level.

Infrastructure upkeep jumps occur at level 100, 200, 300, 500, 700, 1000, 2000, 3000, 4000, 5000, 8000 and 15000.

## Land

Rulers will need to acquire land through purchases as well. A nations area of influence is a nations purchased land multiplied by the modifiers that adjust a nations land area.

Population density is important to the happiness of your citizens, and the happier your citizens are the more money they will earn and the more taxes you can levy from them. Populations will need to be below 70 people per mile in order to maintain happiness. Populations below 70 ppl/mile will be 5 points happier. If a nation has access to the water resource, they will maintain happiness up to 120 ppl/mile.

## Technology

Technology is critical in the advancement of your nation. As nations increase their technology the happiness of the nation will increase. Nations with more technology will also have higher literacy rates which will contribute to lower crime and access to more education improvments and resources.

Technology will also be critical in outfitting strenghtening your military. There are minimum technology requirements when purchasing cruise millises, nukes, different aircraft and different navy vessels.

## Improvements

Nation improvements are structures available for purchase, allowing you to increase strength and profitability in various ways. Improvements are cumulative as up to five of each improvement can be purchased unless specified otherwise. Improvements cannot be destroyed by outside forces, but will cost money to maintain. The base cost per improvement is 500 WB per day, but that increases as you purchase more improvements. You can only purchase one improvement per 1,000 citizens.

The improvements are as follows:

### Airport 
Cost 100,000 WB
Limit 3
Reduces aircraft purchase cost -2% 
Reduces aircraft upkeep costs -2%

### Bank
Cost 100,000 WB
Limit 5
Increases population income +7%.

### Barracks
Cost 50,000 WB
Limit 5
Increases soldier efficiency +10%
Reduces soldier upkeep cost -10%

### Border Fortifications
Cost 125,000 WB
Limit 3
Raises effectiveness of defending soldiers +2%
Reduces max deployment by -2%
Requires maintaining a Border Wall for each Border Fortification
Cannot own if Forward Operating base is owned

### Border Walls
Cost 60,000 WB
Limit 5
Decreases citizen count -2%
Increases population happiness +2
Improves environment 1 point (-1)
Reduces the number of criminals in a nation 1% per Border Wall
Border Walls may only be purchased one at a time

### Bunker 
Cost 200,000 WB
Limit 5
Reduces infrastructure damage from aircraft, cruise missiles, and nukes
Requires maintaining a Barracks for each Bunker
Cannot build if Munitions Factory or Forward Operating Base is owned

### Casino 
Cost 100,000 WB
Limit 2
Increases happiness by 1%
Decreases citizen income by 1%
Decreases crime prevention score

### Church
Cost 40,000 WB
Limit 5
Increases population happiness +1

### Clinic
Cost 50,000 WB
Limit 5
Increases population count by 2%
Purchasing 2 or more clinics allows you to purchase hospitals
This improvement may not be destroyed if it is supporting a hospital until the hospital is first destroyed

### Drydock
Cost 100,000 WB
Limit 5
Allows nations to build and maintain navy Corvettes, Battleships, Cruisers, and Destroyers
This improvement may not be destroyed if it is supporting navy vessels until those navy vessels are first destroyed
Requires Harbor

### Factory
Cost 150,000 WB
Limit 5
Decreases cost of cruise missiles -5%
Decreases tank cost -10%
Reduces initial infrastructure purchase cost -8%

### Foreign Ministry
Cost 120,000 WB
Increases population income by 5%
Limit one foreign ministry per nation

### Forward Operating Base
Cost 125,000 WB
Limit 2
Increases ground attack effectiveness for claiming land and infrastructure 1 point per FOB
Reduces effectiveness of one's own defending soldiers -3%
Requires maintaining a Barracks for each Forward Operating Base
Cannot own if Border Fortifications or Bunker is owned

### Guerrilla Camp
Cost 20,000 WB
Increases soldier efficiency +35%
Reduces soldier upkeep cost -10%
Reduces citizen income -8%

### Harbor
Cost 200,000 WB
Limit 1
Increases population income by 1%
Opens +1 extra trade slot
This improvement may not be destroyed if it is supporting trade agreements or navy vessels until those trade agreements, drydocks and shipyards are first removed.

### Hospital
Cost 180,000 WB
Limit 1
Increases population count by 6%
Requires 2 clinics to build a hospital.
Nations must retain a hospital if that nation owns a Universal Health Care wonder.

### Intelligence Agency
Cost 38,500 WB
Increases happiness for tax rates greater than 23% +1
Each Intelligence Agency allows nations to purchase +100 spies
This improvement may not be destroyed if it is supporting spies until those spies are first destroyed

### Jail
Cost 25,000 WB
Limit 5
Incarcerates up to 500 criminals

### Labor Camp
Cost 150,000 WB 
Reduces infrastructure upkeep costs -10%
Reduces population happiness -1
Incarcerates up to 200 criminals per Labor Camp

### Missile Defense
Cost 90,000 WB 
Reduces the odds of a successful Nuclear and Cruise Missile strike 5%
Nations must retain at least three missile defenses if that nation owns a Strategic Defense Initiative wonder.

### Munitions Factory
Cost 200,000 WB
Limit 5
Increases enemy infrastructure damage from your aircraft, cruise missiles, and nukes +3%
Penalty to environment
Requires maintaining 3 or more Factories
Requires having Lead as a resource
Cannot build if Bunkers owned

### Naval Academy
Cost 300,000 WB
Limit 2
Increases both attacking and defending navy vessel strength +1
Requires Harbor

### Naval Construction Yard
Cost 300,000 WB
Limit 3
Increases the daily purchase limit for navy vessels +1
Your nation must have pre-existing navy support capabilities (via Drydocks and Shipyards) to purchase navy vessels
Requires Harbor

### Office of Propaganda
Cost 200,000 WB 
Limit 2
Decreases the effectiveness of enemy defending soldiers 3%
Requires maintaining a Forward Operating Base for each Office of Propaganda

### Police Headquarters
Cost 75,000 WB 
Increases population happiness +2

### Prison
Cost 200,000 WB
Limit 5
Incarcerates up to 5,000 criminals

### Radiation Containment Chamber
Cost 200,000 WB 
Limit 2
Lowers global radiation level that affects your nation by 20%
Requires maintaining Radiation Cleanup bonus resource to function
Requires maintaining a Bunker for each Radiation Containment Chamber

### Red Light District
Cost 50,000 WB
Limit 2
Increases happiness by 1
Penalizes environment
Increases crime

### Rehabilitation Facility
Cost 500,000 WB
Limit 5
Sends up to 500 criminals back into the citizen count

### Satellite
Cost 90,000 WB
Increases success odds of cruise missiles and nuke attacks by your nation +5%
Nations must retain at least three satellites if that nation owns a Strategic Defense Initiative wonder

### School
Cost 85,000 WB
Increases population income by 5%
Increases literacy rate +1%
Purchasing 3 or more schools allows you to purchase universities
This improvement may not be destroyed if it is supporting universities until the universities are first destroyed.

### Shipyard 
Cost 100,000 WB
Allows nations to build and maintain navy Landing Ships, Frigates, Submarines, and Aircraft Carriers
Increases the number of each of these types of ships that a nation can support +1
This improvement may not be destroyed if it is supporting navy vessels until those navy vessels are first destroyed
Requires Harbor

### Stadium 
Cost 110,000 WB
Increases population happiness + 3

### University
Cost 180,000 WB 
Limit 2
Increases population income by 8%
Reduces technology cost -10%
Increases literacy rate +3%
Three schools must be purchased before any universities can be purchased

## Wonders

National wonders offer additional advantages for nations. Unlinke improvements, national wonders are more expensive to purchase and maintain but there is no citizen requirement to purchase a wonder. However, wonders can only be purchased once every thirty days and a nation can only devlop one of each wonder. The wonders, their benefits and requirements are as follows:

### Agriculture Development Program
30,000,000 WB
Increases land size by 15%
Increases citizen income +$2.00
Increases the citizen-bonus per infrastructre from 8 to 9
Requires 3,000 land purchased, 500 technology

### Anti-Air Defense Network
50,000,000 WB 
Reduces damage from air attacks 40%

### Central Intelligence Agency
40,000,000 WB
Increases the number of spies that your nation can support +250 
Increases your nation's spy attack strength +10%

### Disaster Relief Agency
40,000,000 WB 
The disaster relief agency helps restore your nation and its people after emergency situations. 
Increases population +3% 
Opens 3 extra foreign aid slots per 10 days

### EMP Weaponization 
200,000,000 WB 
Provides attackers with 5,000 or more technology the option to launch a targeted EMP nuclear attack. Nuclear weapons can target higher infrastructure, higher land, or higher technology damage based on attacker choice when launching nukes.
Requires 5,000 technology and a Weapons Research Complex to purchase.

### Fallout Shelter System
40,000,000 WB
Allows 50% of your defending soldiers to survive a nuclear strike
Reduces tank, cruise missile, and aircraft, losses from a nuclear strike by -25%
Reduces nuclear vulnerable navy losses by 20%
Reduces anarchy effects by 1 day
Requires 6,000 infrastructure, 2,000 technology.

### Federal Aid Commission 
25,000,000 WB
Raises the cap on foreign money aid +50% provided that the foreign aid recipient also has a Federal Aid Commission

### Federal Reserve
100,000,000 WB
Increases the number of banks that can be purchased +2
Requires Stock Market

### Foreign Air Force Base
35,000,000 WB
Raises the aircraft limit +20

### Foreign Army Base 
200,000,000 WB 
Adds an extra +1 offensive war slot
Requires 8,000 technology to purchase.

### Foreign Naval Base
200,000,000 WB
Allows +2 naval vessels to be purchased per day (+1 in Peace Mode) and also allows +1 naval deployment per day
Requires 20,000 infrastructure.

### Great Monument 
35,000,000 WB 
The great monument is a testament to your great leadership. Increases happiness +4 and your population will always be happy with your government choice.

### Great Temple 
35,000,000 WB 
The great temple is a dedicated shrine to your national religion. Increases happiness +5 and your population will always be happy with your religion choice.

### Great University
35,000,000 WB
The great university is a central location for scholars within your nation
Decreases technology costs -10% and increases population happiness +2 for every 1000 technology level over 200 up to 3,000 tech

### Hidden Nuclear Missile Silo
30,000,000 WB
Allows your nation to develop +5 nuclear missiles that cannot be destroyed in spy attacks. 

### Interceptor Missile System
50,000,000 WB
Reduces the odds of a successful incoming cruise missile strike -25%
Requires 5,000 technology and a Strategic Defense Initiative

### Internet
35,000,000 WB
Increases population happiness +5

### Interstate System
45,000,000 WB
Decreases initial infrastructure cost -8% 
Decreases infrastructure upkeep costs -8%

### Manhattan Project 
100,000,000 WB
Allows nations with a strength less than 150,000 to develop nuclear weapons
The Manhattan Project cannot be destroyed once it is created
The wonder requires 3,000 infrastructure, 300 technology, and a uranium resource

### Mining Industry Consortium
25,000,000 WB
Increases population income by $2.00 for the resources Coal, Lead, Oil, Uranium that your nation has access to
Requires 5,000 infrastructure, 3,000 land purchased, 1,000 technology.

### Movie Industry 
26,000,000 WB
Increases population happiness +3.

### National Cemetery 
150,000,000 WB
Provides +1 Happiness per 5,000,000 soldier casualties up to +5 happiness. 
Requires 5 million soldier casualties and a National War Memorial.

### National Environment Office
100,000,000 WB
The national environment office removes the penalties for Coal, Oil, and Uranium
Improves environment by 1 point
Increases population +3%
Reduces infrastructure upkeep -3%
Requires 13,000 infrastructure

### National Research Lab 
35,000,000 WB
Increases population +5% 
Decreases technology costs -3%

### National War Memorial 
27,000,000 WB 
Increases population happiness +4
Requires 50,000 casualties

### Nuclear Power Plant
75,000,000 WB
If a nation has a nuclear power plant and an active uranium trade they will get +3 happiness and an additional 1 point of happiness for every 10 tech up to 40 tech.
The nuclear power plant by itself, even without a Uranium trade, reduces infrastructure upkeep -5%
National wonder upkeep -5%.
Improvement upkeep -5%
Requires 12,000 infrastructure, 1,000 technology, and a Uranium resource to build

### Pentagon
30,000,000 WB
Increases attacking and defending ground battle strength +20%

### Political Lobbyists 
50,000,000 WB
Your vote counts as two votes in your team's senate

### Scientific Development Center
150,000,000 WB
The scientific development center increases the productivity of your factories from -8% infrastructure cost to -10% infrastructure cost
Increases the productivity of your universities from +8% citizen income to +10% citizen income
Allows the Great University to give its technology happiness bonus up to 5,000 technology levels (+2 happiness each 1,000 technology levels)
Requires 14,000 infrastructure, 3,000 technology, Great University, National Research Lab.

### Social Security System 
40,000,000 WB
The social security system provides benefits to aging members of your nation
Allows you to raise taxes above 28% up to 30% without additional happiness penalties

### Space Program 
30,000,000 WB
Increases happiness +3
lowers technology cost -3% and lowers aircraft cost -5%

### Stock Market 
30,000,000 WB
Increases citizen income +$10.00.

### Strategic Defense Initiative
75,000,000 WB
Reduces odds of a successful nuclear attack against your nation by 60%
The SDI wonder also requires 3 satellites and 3 missile defenses and those satellites and missile defenses cannot be deleted once the wonder is developed

### Superior Logistical Support 
80,000,000 WB
Reduces Aircraft and Naval upkeep by -10% 
Reduces tank ukeep by -5%
Increases attacking and defending ground battle strength +10%
Requires Pentagon.

### Universal Health Care 
100,000,000 WB
Increases population +3%
Increases population happiness +2
Requires 11,000 infrastructure, Hospital, National Research Lab.

### Weapons Research Complex 
150,000,000 WB
Increases the number of nukes that can be purchased per day to 2
Hurts environment by +1
Increases the purchase costs of all military by 0.01% per technology level
Requires 8,500 infrastructure, 2,000 technology, National Research Lab, Pentagon Wonder.

## Aid

Nations can offer eachother aid in the form of money reserves, soldiers and technology. A nation can give or recieve up to 10 aid packages in any 10 day period. If the aid sender and the aid recipient have a disaster relief agency they can send or recieve 13 aid packages every 10 days. The maximum amount of aid that can be included in an aid package is 6,000,000 WB, 4,000 soldiers and 100 tech. If a nation has a federal aid comission these totals increase by 50%.

## Environment

A nations environment score will measure the amount of pollution a nation produces. The higher a nations environemnt score is the less happy its people will be. AKA, the higher a nations environemnt score is the worse off a nation will be. The various parameters of a nation that affect its environment score are as follows

### Resources
Coal, Oil and Uranium adversely affect a nations environment
Water and Radiation Cleanup resources will help a nations environment

### Improvements and Wonders
Boarder Walls and National Environment Offices will help a nations environment
Munitions Factories, Red Light Districts and Weapons Research Centers will adversely affect a nations environment

### Technology
Nations with tech greater than 6 will not be penalized

### Military Density
A soldier to population ratio greater than 60% will adversely affect a nations environment

### Infrastructure to Land Ratio
The environemnt will be adversely affected if a nation has over 200% infrastructure versus land.

### Nukes
Maintaining nukes will adversely affect a nations environment. If a nation has access to the lead resource then the penalty for owning nukes is reduces by 50%

### Governemnt Type
Governemnt types Anarchy, Communist, Dictatorship and Transitional will adversely affect a nations environment
Government Types Capitalist, Democracy and Republic will positively affect a nations environment

### Global Radiaton

Global radiation will affect a nations environment up to 5 points. Global radiation is based on the amount of nukes fired around the metaverse over the last 10 days. 

## Crime

A nation will be in a constant battle to keep crime down. Criminals will fall out of the populations taxable citizen count and cost your nation tax revenues. Criminals will be calulated as a percentage of your nations population. Criminal percentage will be calulated by a nations crime index with 6 being the highest and 0 being the lowest. Nations with a higher crime index will have a higher percentage of the population as criminals.

A nation with less than 200 criminals will have no penalty to happiness
A nation with 200-2000 criminals will have one point deducted from happiness
A nation with 2000-4000 criminals will have two points deducted from happiness
A nation with 6000-8000 criminals will have three points deducted from happiness
A nation with 8000+ criminals will have five points deducted from happiness

### Crime Prevention Score
The higher a nations crime prevention score the lower the crime index and the lower a nations criminal count. Crime index will be calculated from crime prevention score according to the following calculations.

CPS of less than 200 will have a crime index of 6
CPS of less than 250 will have a crime index of 5
CPS of less than 300 will have a crime index of 4
CPS of less than 350 will have a crime index of 3
CPS of less than 400 will have a crime index of 2
CPS of less than 500 will have a crime index of 1
CPS greater than 500 will have a crime index of 0

Crime index + 1 = the percentage of a population that are criminals.

The paremeters of a nation that increase a nations crime prevention score are as follows

#### Literacy

A nations literacy rate will affect a nations crime prevention score. Higher literacy will mean a higher CPS and less crime.

Literacy is determined by a nations technology, schools and universities. All of these parameters will increase a nations literacy. 

A nations CPS points from literacy will equal 80% of the percentage of a nation that is literate.

#### Improvements and Wonders

A nations crime will also be affected by the improvements and wonders of that nation
Schools, Universities and Police Headquarters will increase a nations crime prevention score.
Casinos and Red Light Districts will decrease a nations crime prvention score.

#### Tax Rate

Nations with higher taxes will have higher crime.

#### Government Type

Different govenments will each affect CPS differently in the following ways.

Anarchy = +50 CPS
Capitalist = +110 CPS
Communist = +150 CPS
Democracy = +120 CPS
Dictatorship = +175 CPS
Federal Government = +160 CPS
Monarchy = +140 CPS
Republic = +165 CPS
Revolutionary = +150 CPS
Totalitarian = +190 CPS
Transitional = +100 CPS

#### Infrastructure

Infrastructure will affect CPS. CPS from infrastructure will equal infrastructure / 400.

#### Population Count

The higher a nations total population the more points will be subtracted from a nations CPS. The deduction will equal population count / 250. The maximum deduction to CPS from population is 350.

## Taxes

Taxes are available to be collected from your nation on a daily basis. A nation can go 20 days without collecting taxes. If a ruler waits more than 20 days to collect taxes then there is no additional collection benefit and any additional money will be lost.

Taxes will be the product of 
(citizens * days since last collection * income per citizen * tax rate)

### Citizen Income

Citizen income is determined from the formula 

35 + ((2 * happiness) * happiness multipliers) + income adjustments

### Happiness

The following factors will effect happiness:

The multipliers to happiness include improvements such as banks (+7% each), foreign ministries (+5%), harbors (+1%), schools (+5%), universities (+8%) adding to happiness and guerilla camps (-8%) and casinos (-1%) detracting from happiness.

#### Compatibility

A nations people will be happier is the national government and national religion are in line with the desires of the people. 

If a nation has a great monument the people will be happy regardless of the type of government the nation is ruled by

If a nation has a great temple the people will be happy regardless of the type of national religion

#### Population Density

Nations with a population density above 70 people per mile will have less happy people. If a nation has access to water the maximum population density will be 120 ppl/mile.

#### Happiness from Resources

Gems, Oil, Silver, Spices, Sugar, Water, Wine, Beer, Fast Food, Automobiles and Microchips all add to the happiness of a nations people.

#### Happiness from Improvements

Boarder Walls, Casinos, Churches, Police Headquarters, Red Light Districts, Stadiums and Intel Agencies all add to a nations happiness

#### Happiness from Wonders

Great Monuments, Great Temples, Great Universities, Internet, Movie Industry, War Memorials, Scientific Development Centers, Space Programs and Universal Healthcare all add to a nations happiness

#### Happiness from Casualties

Nations with a National Cemetary wonder and at least 5,000,000 casualties will get a happiness bonus

#### Happiness from Technology

Nations will benefit from increased technology up to 9 additional happiness points for technology of 200 or greater

#### Happiness from Nation Age

Nations will ba happier when they are older. Nations 90+ days old will recieve 2 additional happiness points. Nations 180+ days old will recieve 4 additional happiness points.

#### Happiness from Taxes

Nations with higher tax rates will be less happy.

#### Soldier to Population Ratio

Nation with a soldier to population ratio above 70% will be less happy.

As well, nations with a soldier to population ration less than 20% will be less happy with a serious penalty for nations with a ratio less than 10%.

#### Criminal Effect on Happiness

Unincarcerated criminals will adversley affect populaiton happiness.

See [Crime](#Crime) for more.

### Tax Rate

Citizens can be taxed at a percentage of their income. Lets say your citizens earn 200 WB per day and your tax rate is 25% then you will be able to collect 50 WB per citizen per day.

Tax rates can differ from 15% to 28% with higher tax rates adversley affecting a nations happiness. If a nation has the Social Security wonder a ruler can increase the tax rate to 30% without a penalty to happiness. 

### Income Adjustments

Furs, Gems, Gold, Silver, Scholars, Agriculture Development Program, Mining Industry Consortium and Nuclear Power Plants all add to citizen income.

## Bills

Nations will incur bills in order to be maintained. Bills will be calulated based on a nations upkeep * days since last bill payment. A nation is allowed to go for 30 days without paying its bills until it is places into inactivity mode. When inactive, a nation will not be able to spend money, collect taxes nor will other nations be able to declare war on an them.

Infrastruture, improvements, wonders and military all require upkeep.

### Infrastructure Bills

A large part of a nations upkeep will come from infrastructure.

Infrastructure upkeep jumps up at certain levels where a slight increase in infrastructre will end up costing a nation more in upkeep then it will recieve from additional tax revenues. Rulers must be very careful not to stay in infrastructure ranges that are not profitable for a nation.

Infrastructure jumps occur at levels 100, 200, 300, 500, 700, 1000, 2000, 3000, 4000, 5000, 8000 and 15000

Iron, Lumber, Uranium, Asphalt, Labor Camps, Interstate System, National Environment Office and Nuclear Power Plant all decrease a nations infrastructure upkeep.

### Upkeep from Military

#### Soldier Upkeep

Soldiers cost 2 WB per day per soldier to maintain.

Lead, Pigs, Barracks and Guerilla Campls all reduce soldier upkeep.

#### Tank Upkeep

Tanks cost 40 WB per day per tank to maintain

Iron, Oil, Lead, Superior Logistical Support all reduce tank upkeep.

#### Nuke Upkeep

Nuke cost 5000 WB per day to maintain

Lead and Uranium reduce Nuke upkeep

#### Cruise Missile Upkeep

Cruise missiles cost 500 WB per day to maintain

Lead reduces the cost of cruise missile upkeep

#### Aircraft Upkeep

Aircraft cost 200 WB per day to maintain

Lead, Airports and Superior Logistical Support all reduce aircraft upkeep

#### Navy Upkeep

Navy ships all require upkeep

Corvettes cost 5,000 WB per day
Landing Ships cost 10,000 WB per day
Battleships cost 25,000 WB per day
Cruisers cost 10,000 WB per day
Frigates cost 15,000 WB per day
Destroyers cost 20,000 WB per day
Submarines cost 25,000 WB per day
Aircraft Carriers cost 30,000 WB per day

Lead, oil and superior logistical support reduce navy upkeep.

### Improvement Upkeep

Improvement upkeep starts at 500 WB per day but increases the more improvements a nation develops.

Capitalist, Federal, Revolutionary and Transitional governemnts reduce improvement upkeep.

### Wonder Upkeep

Wonders cost a nation 5000 WB per day to maintain.

Capitalist, Federal, Revolutionary and Transitional governments reduce wonder upkeep.

## War

Now for the fun part

Should you be compelled to attack another nation for whatever reason, you will first have to declare war on that nation. There are several requirements that need to be met in order to declare war on another nation. They are as follows:

* Both nations must be in war mode and not peace mode
* A nation you are declaring war on must be within 75% and 133% of nation strnegth
* Both nations must be active and have collected bills within the last 30 days
* A nation can only have 4 active offensive wars at any time (5 with a foreign army base)

Wars will automatically expire after 7 days. Alternatively, one nation can declare peace. When the other nation accepts, peace will be declared and the war will be ceased. Should an attack occur from either party all pending peace offers will be canceled. You will need to recall you deployed troops from expired wars.

Once war is declared, you will have several options to attack another nation. You can launch a ground assault, you can run a bombing campaign, launch a cruise missile, launch a nuke, attack via navy, blockade and spy on another nation.

### Nation Strength

A nations strength will be claulated in the following way:

Strength =
Land purchased * 1.5
Tech * 5
Infrastructure * 3
Soldiers * 2
Defending tanks * 20
Deployed tanks * 15
Nukes ^ 2 * 10
Aircraft strength * 5
Naval vessel strength * 10

### Ground Assault

Ground assaults are conducted with soldiers and tanks. In order to attack another nation a ruler will need to deploy soldiers and tanks to an active war. At any time, a nations ground forces are the summation of its defensive forces and deployed forces to each war. When a nation attacks it will attack with its deployed forces against another nations defending ground forces. A nation can only deploy forces once per day per war. When a ground attack is launched it can be a conservative, planned, agressive or berzerker attack. As attacks get more agressive so do the casualties and spoils increase. A victorious attack will result in the transfer of land and infrastructiure to the attacker from the defender.

The results of a ground assault will be calculated randomly based on the strengths of the two opposing forces. 

### Soldiers

Soldiers act as a nations security force as well as troops in battle. If a nations soldier to population ratio drops below 20% then a nation becomes unstable and should a nations soldiers drop below 10% of the population during battle the nation will be thrown into anarchy for 5 days. At no point can a nation have more than 80% of its total population as soldiers.

Soldiers cost 12 WB (-3 with Iron and -3 with Oil).

Soldiers are worth one point in strength in battle. However this srtength is modified by a forces efficiency rating. Efficiency rating is calulated based on the following.

#### Attacking Soldier Efficiency

The strength of a nations attacking soldiers will be the 1 point for each soldier with the following modifications

+20% with Aluminum resource
+8% with Coal resource
+10% with Oil resource
+15% with Pigs resource
+10% per barracks improvement
+35% per Guerilla camp improvement
+8% for nations with government type set to Communist, Democratic, Dictatorship, Federal or Transitional

#### Defending Soldier Efficiency

Defender soldier efficiency is modified in the following way

+20% with Aluminum resource
+8% with Coal resource
+10% with Oil resource
+15% with Pigs resource
+10% per barracks improvement
+2% per Boarder Fortification
-3% per Forward Operating Base
+35% per Guerilla Camp
+8% for nations with government type set to Communist, Democratic, Dictatorship, Federal or Transitional

#### Attacking Ground Forces Strength

Attacking ground forces strength will equal

Soldier Efficiency + (15 * Tanks Deployed) 
+20% with a pentagon
+10% with Superior Logistical Support
+1% / 100 Tanks Deployed up to 75%
+(5 - DEFCON)%

#### Defender Ground Forces Strength

Defending ground forces strength will equal

Soldier Efficiency + (17 * Tanks Defending)
+20% with a pentagon
+10% with Superior Logistical Support
+1% / 100 Infrastructure levels up to 75%
+(5 - DEFCON)%
-5% * attacker Office of Propaganda count

### Tanks

Attacking tanks are worth 15 strength and defending tanks are worth 17 strength in battle. 

The maximum tanks a nation can own is 10% of soldier efficiengy or 8% of total citizens, whichever is less.

Tanks cost 40 times the soldier cost with the following modifiers:

-5% per Factory
-8% with access to Lead

### Air Assault

When you are at war with a nation you will also have the option to launch a bombing campaign against that nation. Bombing campaigns have the potential to destroy up to 20 tanks, 20 infrastructure or 5 cruise missiles.

The game consists of 18 different types of aircraft. There are 9 types of bombers and 9 types of fighters. The 9 bombers and 9 fighters have different strengths increasing from 1 to 9. See below for the details on each type of aircraft. 

The maximum amount of aircraft a nation can develop is 50. There are certain parameters that can increase the maximum aircraft count of a nation. They include:

Access to the construction resource will increase max aircraft count +10
A foreign air force base will increase the max aircraft count of a nation +20
Each aircraft carrier (up to 5) will increase the max aircraft count of a nation +5

An air assault can consist of just bombers, just fighters or a combo of both. An assault can be launched with up to 25 aircraft. The defenders foces will consist of their 25 strongest fighters. Fighters can dogfight eachother but bombers cannot defend from fighters. Because of this, it is alqays prident to keep a defensive force of fighters on hand. You should also always escort your bombers with fighters. A series of random numbers will determine the outcome of the battle where the result of the battle will depend on the strength of the attacking fighters versus the strength of the defending fighters. The number of casualties will depend on the size of the forces fighting eachother. The causalties will be determined randomly where the larger the strength of the fighters in the battle will correlate to the odds of victory. Each dogfight results in a casualty. If a battle has 10 casualties there were 10 dogfights. If an attacker wins a dogfight then a defender fighter is destroyed and bomber damage is inflicted based on the strength of the attacking bombers. If a defender wins a dogfight the attacker loses a fighter and a bomber. At the end of an air battle there will be causalties and bomber damage. The amount of infrastructure lost by the defender will be equal to bomber damage divided by 10 (up to 20). The amount of tank damage will equla bomber damage divided by 4 (up to 20). The amount of cruise missile damage will equal bomber damage divided by 20 (up to 5).

### Fighters

The fighters a nation can build are as follows

#### Yak 9

Strength: 1
Infrastructure Required: 100
Tech Required: 30
Cost 10,000 WB

#### P51 Mustang

Strength: 2
Infrastructure Required: 200
Tech Required: 65
Cost 15,000 WB

#### F86 Sabre

Strength: 3
Infrastructure Required: 300
Tech Required: 105
Cost 20,000 WB

#### MIG 15

Strength: 4
Infrastructure Required: 400
Tech Required: 150
Cost 25,000 WB

#### F100 Super Sabre

Strength: 5
Infrastructure Required: 500
Tech Required: 200
Cost 30,000 WB

#### F35 Lightning

Strength: 6
Infrastructure Required: 600
Tech Required: 255
Cost 35,000 WB

#### F15 Eagle

Strength: 7
Infrastructure Required: 700
Tech Required: 315
Cost 40,000 WB

#### SU30 MKI

Strength: 8
Infrastructure Required: 850
Tech Required: 405
Cost 45,000 WB

#### F22 Raptor

Strength: 9
Infrastructure Required: 1000
Tech Required: 500
Cost 50,000 WB

### Bombers

The bombers a nation can build are as follows

#### AH1 Cobra

Strength: 1
Infrastructure Required: 100
Tech Required: 30
Cost 10,000 WB

#### A64 Apache

Strength: 2
Infrastructure Required: 200
Tech Required: 65
Cost 15,000 WB

#### Bristol Blenheim

Strength: 3
Infrastructure Required: 300
Tech Required: 105
Cost 20,000 WB

#### B52 Mitchell

Strength: 4
Infrastructure Required: 400
Tech Required: 150
Cost 25,000 WB

#### B17 Flying Fortress

Strength: 5
Infrastructure Required: 500
Tech Required: 200
Cost 30,000 WB

#### B52 Stratofortress

Strength: 6
Infrastructure Required: 600
Tech Required: 255
Cost 35,000 WB

#### B2 Spirit

Strength: 7
Infrastructure Required: 700
Tech Required: 315
Cost 40,000 WB

#### B1B Lancer

Strength: 8
Infrastructure Required: 850
Tech Required: 405
Cost 45,000 WB

#### Tupolev TU160

Strength: 9
Infrastructure Required: 1000
Tech Required: 500
Cost 50,000 WB

### Cruise Missiles

If you are at war with a nation you can also launch a cruise missile strike against them. You are allowed to launch 2 cruise missile strikes per war per day. Cruise missiles cot 20,000 WB to purchase and 200 WB per day to mintain. Cruise missiles require 15 tech to purchase. Factories and lead resuce the cost of cruise missiles.

When a cruise missile is launched there is a 75% chance it strikes the defending nation. A defender interceptor missile system will reduce the odds of a successful cruise missile strike -25%. Defender missile defenses will ceach reduce the odds of a sucessful cruise missile strike -5%. Attacker satellites will each increase the odds of a successful cruise missile strile +5%.

A successful cruise missile strike will either destroy tanks, tech or infrastructure. 

The base amount of tanks that will be lost in a successful cruise missile strike will be a random number between 10 and 15. This number will go up if the attacker has munitions factories and down if the defender has bunkers.

The base amount of tech lost in a cruise missile strike will be 2. If a defending nation has 5 bunkers the amount of tech lost will be 1. If the attacker has 5 munition factories the amount of techdestroyed will be +2. A defeding nation must have at least 5 tech to lose any more tech in a cruise missile strike.

The base amount of infrastructure that can be lost in a cruise missile attack is between 5 and 10. This number will go up depending on attacker satellites and down depending on defedner bunkers.

### Nukes

In order for a nation to purchase nukes they must have 75 tech, access to uranium and at least 150,000 strength. If a nation does not have 150,000 strength they can purchase nukes with a manhattan project wonder. A nation can only purchase one nuke per day (2 with weapons research center). Nukes cost 50,000 WB to purchase, and 20% less with access to lead. Nukes cost 5,000 WB per day to maintain. This upkeep cost is reduced by 20% with access to lead and doubled if a nation does not have access to uranium. 

The default odd of a successful nuke attack are 50%. If a defender has a strategic defense initiative the odds go down 20%. These odds also go down 5% foe each defender missile defense a nations owns. Attacker satellites will increase the odds of a succesful nuke attack 5%. 

The standard dmaage from a nuke attack is as follows:
* Defnding soldiers will be reduced to 0 (-50% with fallout shelter system)
* Defending tanks will be reduced 35% (-25% with fallout shelter system)
* Corvettes, Landing ships, Cruisers and Frigates will be reduced 40% (20% with fallout shelter system)
* Land will be reduced 35% up to a total of 150 miles
* Infrastructure will be reduced up to a total of 150 levels
* Tech will be reduced 25% up to a total of 50 levels


An EMP wonder allows an attacking nation to choose what the target of a nuke strike is. A nuke can tarket land, tech or infrasturcture. The differences between the attacks are as follows:

In a infrastructure targeted nuclear attack the base damage is 
* infrastructure is 45% (limit 200)
* land and technology is 25% each (limit 100 land 30 tech)

In a land targeted nuclear attack the base damage is
* land is 45% (limit 200)
* infrastructure and technology is 25% (limit 100 infrasturcture and 30 tech)

In a technology targeted nuclear attack the base damage is
* technology is 45% (limit 70%)
* infrastructure and land is 25% each (limit 100 infrastructure and 100 land)

### Navy

There are 8 different types of navy vessels a nation can purchase. Each vessel has different requirements for technology and infrastrucre neede to purchase. The infrastructure requirement for a corvette is 2,000 so a nation with 4,000 infrastructure will be able to purchase 2 corvettes +1 per each drydock owned.

If a nation's war peace preference is set to peace a nation will be able to purchase 2 vessels per day. If a nations war peace preference is set to war a nation will be able to purchase 5 vessels per day. If a nation has a foreign navy base they will be able to purchase an additional 2 vessels per day. A nation will also be able to purchase an additional vessel per day for each naval construction yard they own.

Naval vessles are as follows:

#### Corvette

Cost 300,000 WB
Upkeep 5,000 WB
Required Tech 200
Required Infrastructure 2,000
Requires an available drydock to purchase
Strength 1

#### Landing Ship

Cost 300,000 WB
Upkeep 10,000 WB
Required Tech 200
Required Infrastructure 2,000
Requires an available shipyard to purchase
Strenght 3

#### Battleship

Cost 300,000 WB
Upkeep 25,000 WB
Required Tech 300
Required Infrastructure 2,500
Requires an available drydock to purchase
Strenght 5
Blockade capable
Break blockade capable

#### Cruiser

Cost 500,000 WB
Upkeep 10,000 WB
Required Tech 350
Required Infrastructure 3,000
Requires an available drydock to purchase
Strenght 6
Blockade capable
Break blockade capable

#### Frigate

Cost 750,000 WB
Upkeep 15,000 WB
Required Tech 400
Required Infrastructure 3,500
Requires an available shipyard to purchase
Strenght 8
Blockade capable
Break blockade capable

#### Destroyer

Cost 1,000,000 WB
Upkeep 20,000 WB
Required Tech 600
Required Infrastructure 4,000
Requires an available drydock to purchase
Strenght 11
Break blockade capable
Cannot be destroyed in nuclear attacks

#### Submarine

Cost 1,500,000 WB
Upkeep 25,000 WB
Required Tech 750
Required Infrastructure 4,500
Requires an available shipyard to purchase
Strenght 12
Blockade capable
Break blockade capable
Cannot be destroyed in nuclear attacks

#### Aircraft Carrier

Cost 2,000,000 WB
Upkeep 30,000 WB
Required Tech 1,000
Required Infrastructure 5,000
Requires an available shipyard to purchase
Strenght 15
Nations can purchase an additonal 5 aircraft per aircraft carrier
Cannot be destroyed in nuckear attacks

### Naval Actions

A ruler can engage in 3 naval actions per day across all wars. 

There A ruler can use their navy to do one of the following:

#### Naval Attack

In a naval attack, the entirety of one nations navy will attack the entirety of another nations navy. When 2 navies square off in battle the amount of losses will be determined by the total number of ships included in the battle. Casualties will be randomly determined by the strength of each nations navy forces.

#### Blockade

A nation can also blockade another nation. An active blockade will reduce a nations tax collection percentage 1-5%. A nation can only be blockaded once per day. An attacker must have at least 5 blockade capable ships in order to blockade another nation. The defender muist have zero break blockade capable ships. 

In the even that a naval battle reduces a nations blockade capable ships to zero, all active blockades will be lifted. A blockaded nation can also collect taxes to end the blockades against them. 

Blockade capable navy ships include Battleships, Cruisers, Frigates and Submarines.

#### Break a Blockade

If a nation is blockaded and wishes to break the blockade they can launch a break blockade attack against the nation blockading them. When the blockading nation's blockade capable ships is reduced to zero all their active blockades will be lifted.

Break blockade capable ships include Battleships, Cruisers, Frigates and Destroyers.

### Spies

Nations can conduct spy operations against other nations. The gmae employes ZK technology that will allow one nation to attack another nation without revealing to the defender who the attacker was. In order to do this a nation will first need to train a spy for the attack and in another function call the attack should be executed. The attack will be paid for when they spy is trained. Trained spies will be trained for a specific attack type and defender nation. An attack needs to be executed within 5 days of training a spy. Nations do not need to be at war in order to conduct spy operations on eachother. 

Spy attack strength is equal to a nations spy count + (technology / 15). If an attacker has a CIA wonder strength is increased by 10%. IF a nation has a governemtn type of Communist, Republic or Transitional attack strength is increased by 10%. 

The strength to thwart a spy attack is equal to a nations spy count + (technology / 20) + (land / 70). If a spy attack is thwarted the attacker wil be revealed. A nations defense strength against a spy attack is also adjusted by its threat level according to the following metrics:

### Threat Level

Nations with threat level of 1 will have defending spy strength equal to 75%
Nations with threat level of 2 will have defending spy strength equal to 90%
Nations with threat level of 3 will have defending spy strength equal to 100%
Nations with threat level of 4 will have defending spy strength equal to 110%
Nations with threat level of 5 will have defending spy strength equal to 125%

### Spy Attacks

There are 13 different types of spy operations nations can conduct on eachother.

#### 1. Destroy Cruise Missiles

A successful cruise missile spy attack will result in the destruction of 1-5 cruise missiles.

A spy attack to destroy cruise missiles costs 100,000WB * defender strength

#### 2. Destroy Defending Tanks

A successful spy attack on tanks will result in 5-10 tanks being destroyed.

A spy attack to destroy tanks costs 100,000WB + (defender stregth * 2)

#### 3. Capture Land

A successful spy attack on a defenders land will result in 10-15 miles of land being destroyed.

A defender must have 15 miles of land in order for an attacker to conduct a land attack.

A spy attack to destroy tanks costs 100,000WB + (defender stregth * 3)

#### 4. Change Desired Governemnt

A successful spy attack to change a nations desired governement will result in a nations desired governemnt being changed.

A spy attack to destroy tanks costs 100,000WB + (defender stregth * 3)

#### 5. Change Desired Religion

A successful spy attack to change a nations desired religion will result in a nations desired religion being changed

A spy attack to destroy tanks costs 100,000WB + (defender stregth * 5)

#### 6. Change Threat Level

A spy attack on a nations threat level will result in a nations threat level being changed.

A spy attack to destroy tanks costs 150,000WB + defender stregth

#### 7. Change DEFCON

A spy attack on a nations DEFCON will result in a nations DEFCON being changed.

A spy attack to destroy tanks costs 150,000WB + (defender stregth * 5)

#### 8. Destroy Spies

A successful spy attack to destroy a nations opposing spies will result in 1-20 spies being destroyed.

A spy attack to destroy tanks costs 250,000WB + (defender stregth * 2)

#### 9. Capture Tech

A successful spy attack on a nations tech will reuslt in a a nation losing 10-15 technology levels.

A defender must have 15 tech in order for an attacker to conduct a tech attack.

A spy attack to destroy tanks costs 300,000WB + (defender stregth * 2)

#### 10. Sabatoge Taxes

A successful spy attack on a nations taxes will reuslt in a nations tax rate being reset to 20-24%. Collection will be required to change the tax rate.

A spy attack to sabotage taxes costs 100,000WB + (defender stregth * 20)

#### 11. Destroy Money Reserves

A successful attack on a nations money reserves will result in a nation losing 5% of their money reserves up to 1,000,000 WB.

A spy attack to destroy money reserves costs 300,000WB + (defender stregth * 15)

#### 12. Capture Infrastructure

A successful attack on a nations infrastructure will result in a nation losing 10-15 infrastructure levels.

A defender must have 15 infrastructure levels in order for an attacker to conduct an infrastructrue attack.

A spy attack to capture infrastructure costs 500,000WB + (defender stregth * 5)

#### 13. Destroy Nukes

A successful spy attack on a nations nukes will result in 1 nuke being destroyed.

A defender must have at least 1 nuke for an attacker to conduct a destroy nuke operation.

A spy attack to destroy nukes costs 500,000WB + (defender stregth * 15)

