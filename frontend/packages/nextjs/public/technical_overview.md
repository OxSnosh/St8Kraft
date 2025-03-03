---
title: MetaNations Technical Overview

---

# Technical Overview

The game ecosystem consists of 50 smart contracts written in solidity. The github monorepo for MetaNations can be found [here](https://github.com/OxSnosh/MetaNations). The game is built in a hardhat environment using ethers. Tests and scripting for the game is written in typescript. 

The front end of the game is written in NextJS with in line style sheets.

## OpenZeppelin

The WarBucks contract and the MetaNationsGovToken contracts inherit from the OpenZeppelin ERC20 token contract which provide each of the tokens all the functionality of ERC20 tokens. 

The CountryMinter contract inherits from the ERC721 OpenZeppelin contract. This allows nations to be minted and transferred in accordance with ERC721 NFT functionality.

Many of the contracts in the game ecosystem inherit from OpenZeppelin's Ownable contract. This contract allows for the use of the modifier onlyOwner() which limits the ability for the modified function to be called to only the owner of the contract. The owner of the contracts of the game is the multisig wallet in control of the game.

## Chainlink Keepers

Chainlink keepers are a way to automate the calling of smart contract functions. The engine of the game is driven by a counter that increments the game day. The chainlink keeper will automatically increment the gameDay +1 on the KeeperContract once every 24 hours. Aspects of the game that require the passing of time to occur will compare the game day to the day of which the action is occuring to determine the time difference.

Chainlink keepers will also be used to trigger elections for senators every 20 days.

## Chainlink VRF

Chainlink VRF is a way to incorporate randomness into smart contracts that are otherwise deterministic and incapable of randomness. Some of the contracts utilize chainlink's verifiable randomness functionality. Randomness is used in the selection of winners and damage during attacks, determining the nations resources when minted, and determining a nations desired religion and government when minted. 

## Chainlink External Adapters

There are also several instances in the game where chainlink external adapters are employed. External adapters allow a call to be made to chainlink's oracle network where calculations can be performed in typescript off chain and the results can be retunrned back to the blockchain. This is done in 2 instances in order to mitigate excessive gas fees. Those instances are in generating the results of air battles and the calulation of election results during senate elections. Senate elections will necessitate looping over an array that will be the length of the number of votes cast by a team in that election epoch. Looping through each of these long arrays for each of the 15 teams to determine the most voted for nations would require a lot of gas if computed on chain. 

## ZK and Asymetric Encryption

In a third instance, chainlink external adapters are used to facilitate the spy attack functionality. With public private key encryption, calls are made on chain using encrypted parameters and deencryption and calculations occurs off chain. In the event of a thwarted spy attack, the deencypted attacker nation id is returned on chain and the identity of the attacker is revealed. Otherwise the spy attack occurs in secret. ZK proofs will be available produced by a circut created using circom and snarkjs in order for nations to verify the results of the spy attack.

## Smart Contracts

### WarBucks

WarBucks is the ERC20 token that is interchangable for an eqivalent amount of in game currency. The WarBucks contract inherits from OpenZeppelin's ERC20 contract and Ownable contract. 

The name of the currency is "WarBucks" and the ticker is "WB." This is determined in the constructor. An initial supply of 20 Trillion will be minted. Refer to the tokenomics section for more info on the allocation.

#### burnFromTreasury(*address account, uint256 amount*) 

WarBucks can be deposited into a nation. When WarBucks are deposited they are burned and the in game balance goes up by the number of tokens that were deposited. When tokens increase a nations in game balance the tokens are burned and the corresponding number of in game balacne in increased for the nation.

This is an external function but has a modifier onlyTreasury that will only allow the treasury contract to call it when the deposit funds function is called.

1. The address parameter is the address of the nation ruler that possesses the WarBucks balance that will be burned.
2. The amount parameter is the is the amount of WarBucks that will be burned. This will have 18 additional digits on it for the decimals of the WarBucks and in game balance.

#### mintFromTreasury(*address account, uint256 amount*)

Alternatively, the in game balance can be withdrawn from a nation and tokens will be minted into the wallet that owns the nation NFT. This function enables that.

This is an external function but has a modifier onlyTreasury that will only allow the treasury contract to call it when the withdrawFunds function is called.

1. The address parameter is the address of the nation ruler that possesses the WarBucks balance that will be burned.
2. The amount parameter is the is the amount of WarBucks that will be burned. This will have 18 additional digits on it for the decimals of the WarBucks and in game balance.

### MetaNationsGovToken

MetaNationsGovToken is the ERC20 token that will allow investors to speculate on the success of the game as well as maintain governance over the game after governance is passed from the multisig wallet. The price of [WarBucks](#WarBuckssol) will be pegged to a maximum value of 10 USD for 2,000,000 WB. In order to maintain this peg, WB collected in the Treasury contract will be swapped for MNGT. Should the game become successfull enough to enact such monetary operations there will be buying pressure on the MNGT as a result of the WB peg.

MetaNationsGovToken inherits from OpenZeppelin's ownable and ERC20 contract.

### CountryMinter

The CountryMinter contract will allow the user to mint a MetaNation. CountryMinter inherits from the OpenZeppelin ERC721 and Ownable contract. The name for the nation NFTs is MetaNations NFTs and the ticker is MNFT. This contract will also employ the OpenZeppelin counter library.

#### generateCountry(*string ruler, string nationName, string capitalCity, string nationSlogan*)

When a country is minted a user will call the generateCountry() function. The parameters for this funtion are as follows:

1. ruler - this will be the name of the ruler governing the nation
2. nationName - this is the name of the nation
3. capitalCity - this is the name of the nations capital city
4. nationSlogan - this is the slogan of the nation

When the generate nation function is called it will instantiate several mappings throughout the game that will keep track of a nations data on various contracts.

When each nation is minted it will be given a nationId. NationId's will increment by +1 for each nation minted.

#### getCountryCount()

The function getCountryCount() will return the current value of the countryCount variable. In other words, the countryCount variable will be nationId of the next nation minted.

#### checkOwnership(*uint256 nationId, address caller*)

checkOwnership() will be used troughout the game to check if the caller of a function is the owner of the nation. This functuion will be called from almost every smart contract in the game. 

The parameters are as follows:

1. nationId - the nationId of the nation being checked
2. caller - is the address of the caller

The msg.sender value will be passed in from the external functions and when the address of the msg.sender matches the owner of the nation the function will return a truthy value and the function call will proceed. Otherwise the function call will revert. This is necessary througout the game to ensure that, for example, only the nation owner declares war on and nukes another nation.

### KeeperContract

The game will have a clock that increments every day. For instance, when a nation ruler collects taxes it will be the daily taxes collectible * days since last tax collection. In order to do this, there is a variable in the KeeperContract for gameDay. Every 24 hours the gameDay will increment +1. 

This contract inherits from the chainlink KeeperCompatibleInteface. This interface will require a checkUpkeep and performUpkeep function. The interval variable will also be the number of seconds between upkeeps. The interval is set to 86,400 which is the number of seconds in 24 hours. 

#### checkUpkeep()

The contract will be registered with the chainlink keeper registy and approximately every block the checkUpkeep function will be checked. If checkUpkeep returns true then the perform upkeep function will be called. Check upkeep will return true if more than 86,400 seconds have elapsed since the last upkeep. There are 86,400 seconds in 1 day. 86,400 will be the interval of the upkeep.

#### performUpkeep()

Perform upkeep will only run if the elapsed time since the last upkeep is 
greater then 86,400 seconds (1 day). When checkUpkeep returns true, the Chainlink Keepers will call the perform upkeep function. When performUpkeep runs, the game day counter will increment by +1 and 86,400 will be added to the lastTimeStamp variable. Adding the interval to the lastTimeStamp is done instead of setting lastTimeStamp to block.timestamp so that slippage in the timing can be avoided due to latency between calling and executing functions that would, over time, result in the game clock incrementing later and later.

#### incrementGameDay()

This function can only be called by the owner of the contact. Should, for any reason, the day counter be off or the timing need to be changed then the owner of the contract (the multisig) can call incrementGameDay and set the counter back to certain time. 

### TreasuryContract

The treasury contract will manage the financial operations of the game and the nations within the game. The contract's uses included keeping track of the total supply of in game balance, keeping track of how many days have elapsed since a nation has collected taxes or paid bills as well as allowing a nation owner to deposit and withdraw funds from a nation.

Other functionality of the treasury contract will include the game owner setting the Matanations International Logistics Fee and collecting MILF revenues. 

Important functions on the treasury contract are as follows

#### generateTreasury(*uint256 id*)

This function can only be called by the country minter contract and will only be called when a nation is minted. This will instantiate the struct that will keep track of a nations treasury data including its in game money reserves and days since a nation has collected taxes or paid bills.

The parameter id will be the countryId of the nation being minted.

#### checkBalance(*uint256 id*)

This function will return the in game balance for the nation with the nationId of the id parameter

#### withdrawFunds(*uint256 amount, uint256 id*)

This function will allow a nation owner to withdraw in game money reserves for WarBucks ERC20 tokens. Only a nation owner can call this function. A nation must also pay their bills before withdrawing funds. If a nation ruler is trying to withdraw more funds than are available this function will throw an error as well. This function will also throw an error if a nation is demonitized.

1. The amount parameter is the amount of funds being withdrawn. This number will include the 18 decimal places. 
2. The id parameter is the id of the nation where the funds are being withdrawn

When funds are withdrawn the game balance for that nation is decreased and an equivalent amount of WarBucks are mintd into the nation rulers wallet.

#### addFunds(*uint256 amount, uint256 id*)

This function will allow a nation owner to deposit funds into a nation. Only a nation owner can call this function. This function will only run if a nation has the tokens available in their wallet. 

1. The amount parameter is the amount of funds being deposited. This number will include the 18 decimal places. 
2. The id parameter is the id of the nation where the funds are being deposited.

When the funds are added the game balance for that nation is increased and the equivalent amount of WarBucks are burned from the nation rulers wallet.

#### getDaysSinceLastTaxCollection(*uint256 id*)

This functon will return the number of days since last tax collection for the nationId passed into the id parameter. This is the function that will allow the taxes contract to calulate a nation's tax by providing the number of days the tax collection accounts for.

If the days since the last tax collection are over 20 then this function will return 20. A nation will not recieve any benefit for waiting longer than 20 days to collect taxes. The max tax collection is determined by the contracts maxDayOfTaxes variable.

#### getMaxDaysOfTaxes()

This function will return the max days a nation can go between tax collections without losing any value from the tax collection. This number is set to 20. So a nation will not get credit on a tax collection for any more than 20 days between collections. 

#### increaseBalanceOnTaxCollection(*uint256 id, uint256 amount*)

This function is only callable from the taxes contract. It will increase a nations balance the amount of the tax collection as determined from the taxes contract. It will also set the dayOfLastTaxCollection for a nation to the current gameDay.

#### getDaysSinceLastBillPaid(*uint256 id*)

This function will calculate the amount of days a nation has since their last bill payment. This wll be used by the bills contract when calculating the bills a nation owes by providing the number of days of bills a nation owes.

If the days since last bills paid are more than 30 then this function will return 30. After 30 days of uncollected bills the nation is moved into inactive mode where it cannot make any purchases or wage war.

#### decreaseBalanceOnBillsPaid(*uint256 id, uint256 amount*)

This function will decrease a nations balance when bills are paid. This function is only callable from the bills contract. When this function is called it will reset a nations dayOfLastBillPaid to the current gameDay. 

#### checkInactive(*uint256 id*)

This function will check if a nation is currently inactive. A nation will be deemed inactive it 30 days have elapsed since the nations last bill payment. The time until a nation can to be deemed inactive can be adjusted. 

Inactive nations will not have the ability to spend money in the game or wage war.

#### setDaysToInactive(*uint256 id*)

daysToInactive is the variable that determines how many days need to pass since a nations last bill payment for the nation to be deemed inactive. This function allows the gameowner to adjiust that number of days.

#### spendBalance(*uint256 id, uint256 cost*)

This is the function that gets called when a nation spends money in the game. Only specific contracts within the game allow a nation owner to make purchases and only those contracts can call this function.

1. The id parameter is the id of the nation spending the funds
2. The cost parameter is the cost of the purchase including 18 digits after the decimal

A nation will only be allowed to spend funds if the nations balance is greater than the cost. A nation will not be allowed to make purchases if they are demonitized. A nation will also not be allowed to make purchases if they are inactive, in which case the must pay bills first before spending funds.

This is also where the MetaNations International Logistics Fee is levied. The MILF is a percentage of in game purchases that are collected to fund the operations of the game. It is important to note that a MILF of 15% would not mean that purchases cost an additional 15%. However, when a purchase is made 15% of the purchase is minted into the treasury wallet of the game and the other 85% is burned.

#### viewMilfRevenues()

This function returns the balance of WarBucks within the contract.

#### withdrawMilfRevenues(*uint256 amount*)

This function allows the contract owner (the multisig) to withdraw a specified amount of WarBucks from the treasury contract.

The amount parameter is the amount of WarBucks to be withdrawn including 18 digits after the decimal.

#### updateSeedMoney(*uint256 newSeedMoney*)

This function is only callable from the contract owner (the multisig). This will allow the owner of the contract to update the amount of seed money is required to mint a nation. 

#### getSeedMoney()

This function will return the current seed money needed to mint a nation.

#### setMilf(*uint256 newPercentage*)

This function will allow the contract owner (the multisig) to set the MILF percentage. The MILF percentage is an integer percentage of every purchase that will be collected and deposited into the treasury contract. Please note that a milf of 5% does not mean that the purchase price of goods within the game increases 5%. Rether, that 5% of the purchase is deposited into the treasury contract and the remaining 95% is burned.

#### demonitizeNation(*uint256 id*)

This function will prevent a nation from with withdrawing funds or spending money within the game. This id parameter will be the nationId of the nation being demonitized.

This function is only callable from the contract owner (the multisig) in the event of malicious or bad faith behavior.

#### remonitizeNation(*uint256 id*)

This function will undo a demonitization action. This function is only callable from the contract owner.

#### getTotalGameBalance()

This function will return the total balance of all nations in the game. So this balance, in addition to the total supply of WarBucks, will be a fully diluted estiamte of the total supply of WarBucks.

### CountryParametersContract

The country parameters contract will keep track of a nations settings and affiliatons. This is where a nations ruler name, nation name, capital city and nation slogan are stored. As well, affiliations such as a nations alliance, nation team, government type and religion are stored as well.

This contract will inherit from OpenZeppelins Ownable contact and Chainlinks VRFConsumerBaseV2 contract. Chainlink VRF will allow this contract to incorporate randomness. When a nation is minted there will be a randomly selected desired governememnt and desired religion of the people.

#### generateCountryParameters(*uint256 id, string rulerName, string capitalCity, string nationSlogan*)

This function will only be called from the country minter contract upon the minting of a nation. This function will instantiate the structs responsible for storing information about a nations parameters and affiliations.

1. id - this is the nationId of the nation being minted
2. rulerName - this is a string of the rulers chosen name
3. nationName - this is a string of the nation's name
4. capitalCity - this is a string of the name of a nations capital city
5. nationSlogan - this is a string of a nation's slogan

This function will also set the day minted to the game day. This is important as nations that are older than 90 nd 180 days will get an additional happiness bonus.

The default alliance string will be set to "No Alliance Yet." The default governemnt will be anarchy and can be changed right away. The default religion will be none and can also be changed right away.

The function will alos make a call to chainlink's VRFCoordinator to request random words. Random words is another way of saying random numbers. This function call triggers a callback to the fulfillRandomWords function where a random religion and goverment type will be selected for the desired religion and government of the nation.

#### setRulerName(*string newRulerName, uint256 id*)

This function is only callable from the nation owner where the change is occuring. The newRulerName parameter will be used to update the ruler name for the nationId of the id parameter.

It costs 20,000,000 WB to update your ruler name.

#### setNationName(*string newNationName, uint256 id*)

This function is only callable from the nation owner where the change is occuring. The newNationName parameter will be used to update the nation name for the nationId of the id parameter.

It costs 20,000,000 WB to update your nations name.

#### setCapitalCity(*string newCapitalCity, uint256 id*)

This function is only callable from the nation owner where the change is occuring. The newCapitalCity parameter will be the updated capital city for the nationId of the id parameter.

#### setNationSlogan(*string newNationSlogan, uint256 id*)

This function is only callable from the nation owner where the change is occuring. The newNationSlogan parameter will be the updated nation slogan for the nationId of the id parameter.

#### setAlliance(*string newAlliance, uint256 id*)

This function will allow a nation ruler to update the alliance affiliation of a nation. This function can only be called by a nation ruler where the change is occuring. The newAlliance parameter will be the string of the updated alliance for that nationId.

#### setTeam(*uint256 id, uint256 newTeam*)

This function will allow a nation to change their team affiliation. There are 15 team in the game so only values 0 - 14 will be accepted for the new team parameter. Only a nation owner can call this function for a nation where the change is occuring. A nation will not be allowed to change teams if the ruler of that nation is a senator.

#### setGovernment(*uint256 id, uint256 newType*)

This function is only callable from a nation owner for a nation where the change is occuring. By default a nation will need to wait 3 days between government changes. The national gvernment will be updated to the newType parameter. There are 11 tpyes of governments a nation can be so a newType variable will need to be between 0 and 10. If a nation's defending soldiers drops below a certain level or if a nation gets nuked then the governemnt will be automatically switched to anarchy. A nation that is thrown into anarchy will have to wait 5 days before switching governemnts. A nation that has a fallout shelter system will be able to switch governments 4 days after being thrown into anarchy.

Each governemnt in the newType parameter corresponds to a uint256 number between 0 and 10. They are as follows:

0. Anarchy
1. Capitalist
2. Communist
3. Democracy
4. Dictatorship
5. Federal
6. Monarchy
7. Republic
8. Revolutionary
9. Totalitarianism
10. Transitional

#### updateDesiredGovernment(*uint256 id, uint256 newType*)

This function can only be called from the spy operations contract. This function will be called when a successful spy attack occurs and an attacked nation's desired government will be changed.

#### setReligion(*uint256 id, uint256 newType*)

This function is only callable from a nation owner for a nation where the change is occuring. By default a nation will need to wait 3 days between religion changes. The national religion will be updated to the newType parameter. There are 15 types of religions in the game including none so the newType variable will need to be between 0 and 14.

The religions will be identified as a uint256 number so the religions correspond to the following numbers: 

0. None
1. Mixed
2. Baha'l Faith
3. Buddhism
4. Christianity
5. Confucianism
6. Hinduism
7. Islam
8. Jainism
9. Judaism
10. Norse
11. Shinto
12. Sikhism
13. Jainism
14. Voodoo

#### updateDesiredReligion(*uint256 id, uint256 newType*)

This function can only be called from the spy operations contract. This function will be called when a successful spy attack occurs and an attacked nation's desired religion will be changed.

#### inflictAnarchy(uint256 id)

This function can only be called from the ground battle or nuke contract. When a nations defending troops drop below a certain level or a nuke sucessfully lands on a nation it will be thrown into anarchy. When this function is called the nation's government will be switched to anarchy and the dayOfAnarchy will be set to the game day. A nation that is thrown into anarchy will not be able to change their government for 5 days (4 with a fallout shelter system).

#### getRulerName(*uint256 id*)

This function will return the ruler name for the nationId being queried in the parameter.

#### getNationName(*uint256 id*)

This function will return the nation name for the nationId being queried in the parameter.

#### getCapital(*uint256 id*)

This function will return the capital city of the nationId being queried in the parameter

#### getSlogan(*uint256 id*)

This function will return the nation slogan for the nationId being queried in the parameter

#### getAlliance(*uint256 id*)

This function will return the alliance of the nation being queried in the parameter.

#### getTeam(*uint256 id*)

This function will return the team on the nation being queried in the parameter. 

#### getGovernmentType(*uint256 id*)

This function will return the number of the government type for the nation being queried in the parameter. 

For more information on what number corresponds to what governemnt please see the [setGovernemnt()](#setGovernmentuint256-id-uint256-newType) function.

#### getReligionType(*uint256 id*)

This function will return the number of the religion type for the nation being queried in the parameter. 

For more information on what number corresponds to what religion please see the [setReligion()](#setReligionuint256-id-uint256-newType) function.

#### getDayCreated(*uint256 id*)

This function will return the gameDay that the nation was created. So this number can be subtraced from the game day to get the nations age.

#### getGovernmentPreference(*uint256 id*)

This function will return the desired government of the nation. For more information on what uint256 number corresponds to what government please see the [setGovernemnt()](#setGovernmentuint256-id-uint256-newType) function.

#### getReligionPReference(*uint256 id*)

This function will return the desired religion of the nation. For more information on what uint256 number corresponds to what religion please see the [setReligion()](#setReligionuint256-id-uint256-newType) function.

#### getDaysSince(*uint256 id*)

This function will return to variables for the nationId being queried in the id parameter. The first variable returned will be the number of days since the goverment has been changed and the second variable will be the number of days since the religion of that nation has been changed. A nation ruler must wait 3 days before changing its religion or government.

### SenateContract

The SenateContract will be where nations vote for team senators. Senators are elected every 20 days. In that 20 days, each nation ruler is able to cast one vote for a team senator. At the end of each 20 day epoch a chainlink keeper will perform an upkeep that will make a call to an external adapter and return the winners of each election or the 15 teams. Senators are allowed to sanction other team members on the teams where they are elected senator. When a nation gets sanctioned it will be prohibited from trading with another nation on that team. It will only take one senator vote to sanction a team member. It will also only take one vote from a senator to lift a sanction. Each team can only have 25 nations on their sanction list at any time.

The functions for this contract are as follows:

#### updateInterval(*uint256 _interval*)

The interval parameter will be the new interval for the number of days that need to elapse between senate elections. The interval variable is in days.

#### generateVoter(*uint256 id*)

This function will instantiate a Voter struct for wach newly minted nation and store it in a mapping. The struct stores data about each nation such as the day the last vote was cast, if the nation ruler is a senator, the team number of the nation and the day the nation joined that team.

#### updateTeam(*uint256 id, uint256 newTeam*)

This function can only be called from the country parameters contract. This function will update the team that the nation is on for use in the senator contract as well as record the day the team change took place.

This function will only run when the nation ruler changed the team they are on from the country parameters contract

#### voteForSenator(*uint256 idVoter, uint256 idSenator*)

This is the function a nation owner calls to vote for senator. The idVoter parameter will be the nationId of the nation casting the vote. This will only run if the owner of the nation of idVoter is the msg.sender of this function. 

This function reverts if a nation ruler votes for itself. You will also only be able to vote once an epoch. You can only vote 30 days or more after you changed teams. You can only vote for a fellow team member. 

If you have access to the lobbyists wonder you vote will count as two votes.

#### checkUpkeep()

As this contract has keeper functionality, there will be a checkUpkeep and performUpkeep functionality. A Keeper registy will monitor this contract for when checkUpkeep returns true. When checkUpkeep returns true then a keeper will call performUpkeep. Check upkeep will return true if 20 days have passed since the day of the last election. So as to say, elections will occur every 20 days.

#### performUpkeep()

This function will call the runElections() function for each team if it is time to perform the upkeep. If the time elapsed since the last election is greater than the interval then the elections will occur. 

#### runElections(*bytes _jobId, address _oracleAddress, uint256 fee, uint256 team*)

This function is internal and only runs when it is called in the perform upkeep function. This function will call a Chainlink external adapter and send it the array of votes and recieve the array of 5 elected senators in a callback. When it gets called the following parameters are passed in.

1. _jobId - this is the jobId at the oracle that will run in order to return the array of elected senators. 
2. _oracleAddress - this is the address of the oracle contract that will forward the payload to the node.
3. fee - this is the chainlink fee
4. team - the team of the election taking place

When this function gets called it will actually send a payload to the external adapter for each team. So it gets called 15 times and sends each array of votes to the external adapter for computation.

This function will point to the callback function completeElection(). 

#### completeElection(*uint256[] memory winners, uint256 team, uint256 _epoch*)

This function sets the nationIds in the winners array to to be senators for the team of the team parameter. The winners array will also be stored in the mapping epochToTeamToWinners for that epoch's winners. Previous winners will be removed as senators.

#### updateMaximumSanctions(uint256 _maximumSanctions) 

This function will only be callable from the contract owner. This function allows the contract owner to update the maximum number of sanctioned nations on each team to the maximumSanctions parameter passed in. 

#### sanctionTeamMember(*uint256 idSenator, uint256 idSanctioned*)

This function will verify that the nation of the idSenator is the msg.sender and the owner of that nation. If the senator is on the same team as the nation of the idSanctioned parameter the function will proceed. You can only sanction a fellow team member that is not a senator. You can also only sanction a nation if the team has less than the maximum allowable sanctions.

When one senator votes to sanction a team member then all active trades that sanctioned nation has with that team will be removed. A sanction can only be lifted after 10 days by a single vote from a senator. 

#### liftSanctionVote(*uint256 idSenator, uint256 idSanctioned*)

This function lifts a sanction against a nation. It only takes one vote from a senator to lift a sanction vote. A sanction cannot be lifted within 10 days of a sanction being initiated. A senator can only lift a sanction on a fellow team member.

The parameter idSenator is the nationId of the senator lifing the sanction. The function verifies that the msg.sender is the owner of the senator nation.

This function will also take the sanctioned nation and remove it from the active sanctions array.

#### isSenator(*uint256 id*)

This function will return true if the nationId from the parameter belongs to a nation that has been elected senator.

#### getCurrentEpoch()

This function will return the current epoch of the senate elections.

### Resources

The resources contract keeps track of the resources a nation has access to and trades a nation is engaged in. This contract inherits from the chainlink VRFConsumerBaseV2 and Openzeppelin's Ownable contract.

This contract will need to incorporate randomness in order to select 2 resources randomly for a nation when it is minted. 

The functions for this contract are as follows:

#### generateResources(*uint256 id*)

This function is only callable from the countryMinter contract and will instantiate the two structs that will keep track of a nations resources and record them in a mapping. A nations resources will all be set to false when a nation is minted and a request to the VRFCoordinator will be made for 2 random numbers via the fulfillRequest() function.

#### fulfillRequest(*uint256 id*)

This function is internal and will be called when the generateResources() function runs when a nation is minted. This function will make the request to the VRFCoordinator that will callback with 2 random words.

#### fulfillRandomWords(*uint256 requestId, uint256[] memory randomWords*)

This is the callback function that will be called by the chainlink oracle when the random nmbers are retruned. In this context, randomWords is another way of saying random numbers. The requestId will be used to store the randomNumbers. The 2 random numbers will be large integers that, when divided by the number of possible resources, in this case 21, the remainder will be a random number between 0 and 20. These 2 random numbers will be used to determine which resources a nation will have. A nation will not be able to have 2 of the same resources. Resources are not stackable and you can only get the benefit from each resource once. The 2 randomly selected resources will be mapped to the idToPlayerResources array and the setResources() function will be called to set the resources a nation has access to to true.

#### setResources(*uint256 id*)

This function is internal and can only be called by other functions in this contract.

This function will take the nationId from the parameter passed in and set all the resources of that nation and that nation has access to to true. 

The first thing this function does is set all the resources to false. Then it takes the 2 randomly assigend resources and sets them to true.

The resource ID's are as follows:

0. aluminium
1. cattle
2. coal
3. fish
4. furs
5. gems
6. gold
7. iron
8. lead
9. lumber
10. marble
11. oil
12. pigs 
13. rubber
14. silver
15. spices
16. sugar
17. uranium
18. water
19. wheat
20. wine

Then this function calls the setTrades() function.

#### setTrades(*uint256 id*)

This function will loop through a nations trading partners and set each of the resources for each trade to true. This will occur for the nationId of the id passed in through the parameter.

This function will then setBonusResources() on the [BonusResources](#BonusResources) contract.

#### proposeTrade(*uint256 requestorId, uint256 recipientId*)

This function must be called by the requestorId nation and the msg.sender of the requestorId nation must be the owner of the requestorId nation. 

This function will check if the trade is possible for the requestor and the recipient. In order for a proposal to go through, the requestor of a trade cannot have more then 3 active and proposed trades when a trade is requested (4 with a harbor). The recipient of a trade cannot have more than 4 active and proposed trades (5 with a harbor).

If the trade is possible the proposed trade will be added to the requestor and the recipient.

#### cancelProposedTrade(*uint256 nationId, uint256 partnerId*)

Either nation in a proposed trade is able to cancel a trade proposal. The trade will be removed from each nations proposed trades. This function will revert if the partenrId parameter is not a current proposed trade for the nationId nation. 

#### getProposedTradingPartners(*uint256 id*)

This function will return an array of proposed trading partners for a nation.

#### fulfillTradingPartner(*uint256 recipientId, uint256 requestorId*)

This function will only run if the recipientId is the caller and the msg.sender is the owner of the recipientId nation. When a trade is fulfilled it will be removed from proposed trades and the partners will be added to each others active trading partners. 

The fuinction will also call the setResources() function for each of the nations to update each nation with the new trades. 

#### removeTradingPartner(*uint256 nationId, uint256 partnerId*)

NationId is the id of the nation initializing the trade cancellation and partnerId is the id of the partner nation. This function will only run if the nationId is the caller of the function and the msg.sender is the owner of the nationId nation.

When a trading partner is removed then the nationIds of the partners will be removed from each others active trades and setResources() will be called on each nation.

#### isProposedTrade(*uint256 recipientId, uint256 requestorId*)

This will tell if there is a proposed trade currently between the recipientId nation and the requestorId nation. If there is a proposed trade it will return true.

#### isActiveTrade(*uint256 country1Id, uint256 country2Id*)

This function will return true if there is an active trde between the 2 nations passed in a parameters.

#### getResourcesFromTradingPartner(*uint256 partnerId*)

This function will retrun the 2 numerical values for a nations resources. The numerical values and their corresponding resources are as follows:

0. aluminium
1. cattle
2. coal
3. fish
4. furs
5. gems
6. gold
7. iron
8. lead
9. lumber
10. marble
11. oil
12. pigs 
13. rubber
14. silver
15. spices
16. sugar
17. uranium
18. water
19. wheat
20. wine

#### Functios to Determine a Nations Resources

There are indiviual functions for each resource that will return true if the nationId passed in as a parameter has access to that resource

The functions are as follows:

0. viewAluminium(uint256 id)
1. viewCattle(uint256 id)
2. viewCoal(uint256 id)
3. viewFish(uint256 id)
4. viewFurs(uint256 id)
5. viewGems(uint256 id)
6. viewGold(uint256 id)
7. viewIron(uint256 id)
8. viewLead(uint256 id)
9. viewLumber(uint256 id)
10. viewMarble(uint256 id)
11. viewOil(uint256 id)
12. viewPigs(uint256 id)
13. viewRubber(uint256 id)
14. viewSilver(uint256 id)
15. viewSpices(uint256 id)
16. viewSugar(uint256 id)
17. viewUranium(uint256 id)
18. viewWater(uint256 id)
19. viewWheat(uint256 id)
20. viewWine(uint256 id)

#### getPlayerResources(*uint256 id*)

This function will return a nations 2 randomly selected resources

#### getTradingPartenrs(*uint256 id*)

This function will return an array of nationIds for the active trading partners of the queried nation.

#### removeTradingPartnersFromSanction(*uint256 idSanctioned, uint256 sanctionTeam*)

This function is only callable from the senate contract and will be triggered when a nation gets sancitoned. This function will remove each of a nations trading partners for the team they are sanctioned on.

### BonusResourcesContract

The BonusResourcesContract keeps track of a nations bonus resources. When the setTrades() function is triggered in the resources contract it will cause a cascade of functions that set all the resources a nation has access to to true. In order to store the bonus resources it was necessary to have a separate contract. This contact also contains the functions that can be called to determine if a nation has access to each bonus resource.

The functions that comprise this contract are as follows:

#### generateBonusResources(*uint256 id*)

This function can only be called from the country minter contract. This function will instantiate the struct of bonus resources and store it in a mapping idToBonusResources.

#### setBonusResources(*uint256 id*)

This function can only be called from the ResourcesContract. It will run a series of check functions that will determine if the nationId being queried has the necessary requirements for each bonus resource. If any of the functions return true, that bonus resource is toggled to true for that nation. The check functions are as follows:

1. checkBeer(uint256 id)
2. checkSteel(uint256 id)
3. checkConstruction(uint256 id)
4. checkFastFood(uint256 id)
5. checkFineJewelry(uint256 id)
6. checkScholars(uint256 id)
7. checkAsphalt(uint256 id)
8. checkAutomobiles(uint256 id)
9. checkAffluentPopulation(uint256 id)

The below functions are run in the setAdditonalBonusResources() function

10. checkMicrochips(uint256 id)
11. checkRadiationCleanup(uint256 id)

To see the requirements for each bonus resource please check the [gameplay guide](https://hackmd.io/LG5toSkrRRGPbDaHDh7nLw?view#Bonus-Resources) 

#### Functions to Determine a Nations Bonus Resources

There are a series of functions that can be used to determine a nations bonus resources. Each function will return true if the nationId being passed in as a parameter is a nation that has access to the bonus resource being queried.

The functions are as follows

1. viewAffluentPopulation(*uint256 id*)
2. viewAsphalt(*uint256 id*)
3. viewAutomobiles(*uint256 id*)
4. viewBeer(*uint256 id*)
5. viewConstruction(*uint256 id*)
6. viewFastFood(*uint256 id*)
7. viewFineJewelry(*uint256 id*)
8. viewMicrochips(*uint256 id*)
9. viewRadiationCleanup(*uint256 id*)
10. viewScholars(*uint256 id*)
11. viewSteel(*uint256 id*)

### InfrastructureContract

The InfrastructureContract stores a nations land, infrastructure and technology levels. It will also store a nations tax rate. While these values are stored on this contract, it is important to note that the purchasing of these commodities occurs on this contract but the prices are determined in the LandMarketContract, InfrastructureMarketContract and the TechnologyMarketContract. 

This contract inherits from OpenZeppelin's ownable contract.

The functions on this contract are as follows:

#### generateInfrastructure(*uint256 id*)

This function will instantiate the struct that stores a nations land, infrastructure and technology count as well as tax rate. This function is only callable from the country minter contract. When a nation is minted it will be given 20 land and 20 infrastructure and by default the tax rate will be set to 16%.

#### increaseInfrastructureFromMarket(*uint256 id, uint256 amount*)

This function is only callable from the InfrastructureMarketContract. This function increases a nations infrastructure when it is purchased.

#### decreaseInfrastructureFromMarket(*uint256 id, uint256 amount*)

This function is only callable from the InfrastructureMarketContract. This function decreases a nations infrastructure when it is destroyed by a nation ruler. There are various jumps in infrastructure upkeep that may necessitate a ruler destroying infrastructure. At these upkeep jumps it becomes more expensive to upkeep the infrastructure just above the jump versus what can be realized in tax revenues. So if a ruler is unable to purchase enough infrastructure to maintain profitability they can destroy infrastructure.

#### increaseTechnologyFromMarket(*uint256 id, uint256 amount*)

This function is only callable from the TechnologyMarketContract. This function increases a nations technology when it is purchased. 

#### decreaseTechnologyFromMarket(*uint256 id, uint256 amount*)

This function is only callable from the TechnologyMarketContract. This function decreses a nations technology when it is destroyed. 

There is not benefit to destroying technology for a nation.

#### increaseLandFromMarket(*uint256 id, uint256 amount*)

This function is only callable from the LandMarketContract. This function increases a nations land when it is purchased.

#### decreaseLandFromMarket(*uint256 id, uint256 amount*)

This function is only callable from the LandMarketContract. This function decreases a nations land when it is destroyed.

#### getLandCount(*uint256 id*)

This function will return a nations land count for the nation queried in the id parameter.

#### getAreaOfInfluence(*uint256 id*)

There is a difference between a nations purchased land and the nations area of influence. A nations area of influence will be increased be certain wonders, government and resources. Coal, rubber, spices, an agriculture developemnt program or the governments of capitalist, communist, monarchy, republic, totalitarian or transitional will all increase a nations area of influence above the amount of purchased land. 

#### sellLand(*uint256 id, uint256 amount*)

Land can also be sold instead of destroyed. There is no advnatage to getting rid of land but it can be sold for a small price. If a nation does not have access to the rubber resource then it can sell land for 100 WB per mile. If a nation has rubber it can sell land for 300 WB per mile. A nation cannot sell land below 20 miles. 

#### decreaseLandCountFromSpyContract(*uint256 countryId, uint256 amount*)

This function is only callable from the spy operations contract. A successful spy operation can decrease a defending nation land. This function will enable the spy operation contract to do that.

#### decreaseLandFromNukeContract(*uint256 countryId, uint256 percentage, uint256 attackType*)

This function is only callable from the nuke contract.

By default, a successful nuke attack decreases a nations land 35% or 150 miles, whichever is less. 

If an attacking nation has an EMP wonder they are able to launch a nuke attack targeted at a defender nations land. In the even of a land nuke attack the defender will lose 45% or 200 miles, whichever is less.

In the event of a technology or infrastructure emp attack a nation loses 25% of its land or 100 miles, whichever is less.

#### getTechnologyCount(*uint256 countryId*)

This function returns a nations technology count for the nation queried in the parameter

#### sendTech(*uint256 idSender, uint256 idReciever, uint256 amount*)

This function is only callable from the aid contract. This sends the technology portion of an aid package when aid is sent. An aid package can contain technology, soldiers or money reserves. The max aid that can be sent in an aid package is 100.

#### decreseTechCountFromSpyContract(*uint256 countryId, uint256 amount*)

A successful spy attack can decrease a nations technology count. This function is only callable from the spy operations contract and will decrease a nations tech when they are attacked by a spy.

#### decreaseTechCountFromCruiseMissileContract(*uint256 countryId, uint256 amount*)

This function is only callable from the cruise missile contract. This function will decrese a nations technology count by the amount specified after a successful cruise missile attack. 

#### decreaseTechCountFromNukeContract(*uint256 countryId, uint256 percentage, uint256 attackType*)

This function is only callable from the nuke contract. 

By default a successful nuke attack decreases technology 35% or 50 levels, whichever is less.

If an attakcking nation has an emp wonder they can target a nations technology with a nuke strike. In a technology attack a nation can lose 45% of their technology or 70 levels, whichever is less. 

In the event of a land or infrastructure attack a nation cannot lose more than 25% or 30 levels, whichever is less.

#### getInfrastructureCount(*uint256 countryId*)

This functon returns a nations infrastructure amount.

#### decreaseInfrastructreFromSpyContract(*uint256 countryId, uint256 amountToDecrease*)

This function is only callable from the spy operations contract. A successful spy operation can decrese a nations infrastructure.

#### decreaseInfrastructureFromCruiseMissileContract(*uint256 countryId, uint256 amountToDecrease*)

This function is only callable from the cruise missile contract. This function decreases a nations infrastructure upon a successful cruise missile attack.

#### decreaseInfrastructureFromNukeContract(*uint256 defenderId, uint256 attackerId, uint256 percentage, uint256 attackType*)

This function is only callable from the nuke contract. Defender bunkers will decrease nuke damage. Attacker munitions factories will increase nuke damage. By default, the maximum amount a nation can lose in a nuke attack is 150 infrastructe or 35%, whichever is less.

If an attacker has an emp wonder they can launch a targeted attack on a nation infrastructure. A sucessful nuke attack on a nations infrastructure will decrease a nations infrastructure 45% or 200 levels, whichever is less. 

A targeted attack on a nation land or technology will result in a nation losing 25% or 100 levels of infrastructre, whichever is less.

#### decreaseInfrastructreFromAirBattleContract(*uint256 countryId, uint256 amomuntToDecrease*)

This function is only callable from the air battle contract. 

A sucessful bombing campaign will decrease a defending nations infrastructure. Bunkers will decrease infrastructure damage of a bombing campaign. 

The max infrastructure damage possible from a bombing campaign is 20 levels.

#### transferLandAndInfrastructure(*uint256 landMiles, uint256 infrastructreLevels, uint256 attackerId, uint256 defenderId*)

This function is only callable from the ground battle contract.

When an attacker wins a ground battle they will claim land and infrastructure. If a defender has less land or infrastructre then the kand and infrastructure won in battle, then the attacker will recieve the remaining levels and the defenders levels will be zeroed out.

#### getTotalPopulationCount(*uint256 id*)

This function returns a nations total population count based on the queries nationId.

A nations base total population count equals infrastructre levels * 8. If a nation has an agriculture developemnt program a nations base population is infrastructure levels * 9.

Total population will be adjusted based on a nations resources, improvements and wonders. 

Resources that increase total population count are cattle (+5%), fish (+8%), pigs (+4%), sugar (+3%), wheat (+8%) and affluent population (+5%).

Improvements that increase total population count are border walls (+2% each), clinics (+2% each) and hospitals (+8%).

Wonders that increase a nations population count are disaster relief agencies (+3%), national environmental offices (+5%), national research labs (+5%) and universal healthcare (+3%).

#### getTaxablePopulationCount(*uint256 id*)

A nations taxable population is a nation's total populations minus criminals and soldiers.

The two numbers returned by this function are the citizen count of a nation and the citizen defecit of a nation. It is possible that a nation loses infrastructure from being attacked and is left with a citizen defecit. The citizen count of a nation is calculated as the total population of a nation - (criminals + soldiers). So if a nation loses infrastructure without losing total populaiton there is a chance that it will have more soldiers and criminals than total population. In this instance a nation will not have any population to collect taxes from. A nation with a citizen defecit will need to decommission soldiers to get back taxable population. 

#### getTaxRate(*uint256 id*)

This function returns the tax rate of a nation. A tax rate is the rate at which the citizen income is taxed.

#### setTaxRate(*uint256 id, uint256 newPercentage*)

This function sets the tax rate for the nationId passed in as a parameter. The msg.sender must be the owner of the nationId passed in. A tax rate cannot be set below 15% or above 28%. A nation with the social security wonder can set their tax rate to 30%.

#### setNewTaxRateFromSpyContract(*uint256 id, uint256 newTaxRate*)

This function is only callable from the spy operations contract. A succeessful spy operation can change a nations tax rate. When a successful spy operation changes a nations tax rate an attacked nation will need to collect taxes in order to change their tax rate.

#### toggleColectionNeededToChangeTaxRate(*uint256 id*)

This function is only callable from the taxes contract.

When a nation is attacked by a spy and the tax rate is changed, an attacked nation will need to collect taxes in order to be able to change its tax rate. When a nation gets attacked in this manner, the variable collectionNeededToChangeRate will be set to true. The only way for this variable to be set back to false and enable a nation to change their tax rate is by collecting taxes. This function gets triggered when a nation collects taxes in order to set the collectionNeededToChangeRate variable to false.

### InfrastructureMarketplace

The infrastructure marketplace contract is where a nation owner will get the cost of an infrastructre and make a purchase. There are several things that affect the cost of infrastructure for a nation including the fact that infrastructure gets more expensive as you buy more of it. This contract will determine the cost of an infrastructre purchase for a given nation.

The functions for this contract are as follows:

#### buyInfrastructure(*uint256 id, uint256 buyAmount*)

This function will get the cost of a purchase from the getInfrastructureCost() function and spend the balance. This function will alter state so it is separated from the getInfrastructreCost() function that is view only and will be used throughout the game.

#### getInfrastructureCost(*uint256 id, uint256 buyAmount*)

This function will take the buyAmount and multiply it by the infrastructure cost per level and return the overall purchase price. This is a view function that will accept a nationId and a buyAmount as a parameter

#### getInfrastructureCostPerLever(*uint256 id*)

Infrastructure cost per level is determined by the level of the nations infrastructure before the purchase. The base cost of infrastructure per level increases as a nation has more infrastructure. This cost will then be adusted based on a nations resources, improvements and wonders that affect the purchase price of infrastructure.

#### getInfrastructureCostMultiplier1(*uint256 id*)

There are 3 functions that will return cost multipliers for infrastructure for a given nation. Cost multipliers will reduce the cost of a nations infrastructure purchase.

This function accounts for the multiplers from lumber (-6%), iron (-5%) and marble (-10%).

#### getInfrastructureCostMultiplier2(*uint256 id*)

There are 3 functions that will return cost multipliers for infrastructure for a given nation. Cost multipliers will reduce the cost of a nations infrastructure purchase.

This function accounts for the multiplers from rubber (-3%), construction (-5%), interstate system (-8%), accomodative government (-5%), factories (-8% each without a scientific development center, -10% each with one).

#### getInfrastructureCostMultiplier3(*uint256 id*)

There are 3 functions that will return cost multipliers for infrastructure for a given nation. Cost multipliers will reduce the cost of a nations infrastructure purchase.

This function accounts for the multiplers from aluminium (-7%), coal (-4%), steel (-2%) and asphalt (-5%).

#### checkAccomodativeGovernment(*uint256 id*)

This fucntion will check if a given nation has a government type that will reduce the cost of infrastrucutre 5%. The types of governments that reduce infrastructure cost are:

1. capitalist
2. dictatorship
3. federal
4. monarchy
5. republic
6. revolutionary

#### destroyInfrastructure(*uint256 id, uint256 amount*)

This function allows a nation owner to destroy an amount of infrastructure.

Only the nation owner of the given id parameter can call this function and the owner must be the msg.sender. The nation must also posess a greater amount of infrastructure then it is looking to destroy.

### LandMarketContract

The LandMarketContract will allow a nation owner to purchase land and it will also provide the cost of land per mile for a given nation owner. The functions for this contract are as follows:

#### buyLand(*uint256 id, uint256 amount*)

This function can only work if it is called by the nation owner of the given nationId. This will take the cost of a land purchase and spend the give amount and increase a nations land miles.

#### getLandCost(*uint256 id, uint256 amount*)

This function will get the land cost per mile and multiply it by the amount of miles being purchased. The total cost is returned.

#### getLAndCostPerMile(*uint256 id*)

Land cost per mile is calculated based on a given nations land miles before the purchase. Land will cost more as a nations land amount increases. Land cost per mile is adjusted down based on several resources.

#### getLandPriceMultipler(*uint256 id*)

The base multipler for a nation will be 100%. If a given nation has certain resources this miltiplier is adjusted down. The resources that adjust the cost of land are cattle (-10%), fish (-5%) and rubber (-10%).

#### destroyLand(*uint256 id, uint256 amount*)

This function is only callable from the nation owner of the given nationId and the msg.sender must be the owner of that nationId.

Land can only be destoryed if the amount being decreased is less than the amount that nation has.

### TechnologyMarketContract

The TechnologyMarketContract is where a nation can buy technology and get the price of a technology purchase.

The functions of this contract are as follows:

#### buyTech(*uint256 id, uint256 amount*)

This function can only be called from the nation owner of the given nationId and will only work if the owner is the msg.sender.

This function will get the cost of a purchase, increase the tech count of a nation and spend the balance.

#### getTechCost(*uint256 id, uint256 amount*)

This function will return the total cost of an infrastructure purchase for a given nation and amount.

#### getTechCostPerLevel(*uint256 id*)

Cost per level is determined by the level of a nation technology before the purchase. The more technology a nation owns the more expensive the cost per level becomes. A nation's tech cast per level is adjusted down based on several resources, improvements and wonders. 

#### getTechCostMultiplier(*uint256 id*)

Tech cost per level is adjusted down for a given nation based on the presence of several resources, improvements and wonders. 

Resources that reduce tech cost are gold (-5%), microchips (-8%).

Improvements that reduce the cost of technology are universities (-10%)

Wonders that reduce the cost of tech are national research labs (-3%), space programs (-3%) and great universities (-10%).

#### destroyTech(*uint256 id, uint256 amount*)

Although there is no advantage for a nation owner, they can destroy tech. This function is only callable from the nation owner of the given nationId and the msg.sender must be the owner of that nation. Tech will only be destroyed if the amount being destroyed is less than the tech the nation currently has.

### ImprovementsContact1

ImprovementsContract1 is one of four contracts that will store a nations improvements. The improvements that this contact keeps track of, and the cost of each of those improvements are below:

1. airport (100,000 WB)
2. bank (100,000 WB)
3. barracks (50,000 WB)
4. border fortification (125,000 WB)
5. border wall (60,000 WB)
6. bunker (200,000 WB)
7. casino (100,000 WB)
8. church (40,000 WB)
9. clinic (50,000 WB)
10. drydock (100,000 WB)
11. factory (150,000 WB)

The functions of this contract are as follows:

#### generateImprovements(*uint256 id*)

This function is only callable from the country minter contract. This function instantiates the struct that will store the imprvements for a given nation.

#### getImprovementCount(*uint256 id*)

This function will return a given nations improvement count. 

#### updateImprovementCount(*uint256 id, uint256 newCount*)

This function is only callable from the 3 other improvement contracts and will update the improvement count when improvements are created or destroyed. 

#### checkCitizenCountForImprovementPurchase(*uint256 id, uint256 amount*)

A nation can only purchase 1 improvement for every 1,000 citizens they have. This function will take a given nationId and improvement count and return a boolean value of true if the purchase is possible.

#### buyImprovement1(*uint256 amount, uint256 countryId, uint256 improvementId*)

This function will allow a nation ruler to purchase any of the improvements available from this contract. The nation owner must be the nation owner of the countryId nation and the msg.sender of the function call must be the owner of that nation. The improvementId's are listed below:

1. airport 
2. bank 
3. barracks
4. border fortification
5. border wall
6. bunker
7. casino
8. church
9. clinic
10. drydock
11. factory

#### deleteImprovement1(*uint256 amount, uint256 countryId, uint256 improvementId*)

This function will delete any of the above improvements for a given nation provided they are present. The caller of this function must be the nation owner of the countryId parameter.

The improvementId's are as follows:

1. airport 
2. bank 
3. barracks
4. border fortification
5. border wall
6. bunker
7. casino
8. church
9. clinic
10. drydock
11. factory

#### Functions That Return a Nations Improvement Count

There are functions for each improvement that will return a nations improvement count for a given nationId.

They are as follows:

1. getAirportCount(uint256 countryId) 
2. getBankCount(uint256 countryId)
3. getBarracksCount(uint256 countryId)
4. getBorderFortificationCount(uint256 countryId)
5. getBorderWallCount(uint256 countryId)
6. getBunkerCount(uint256 countryId)
7. getCasinoCount(uint256 countryId)
8. getChurchCount(uint256 countryId)
9. getClinicCount(uint256 countryId)
10. getDrydockCount(uint256 countryId)
11. getFactoryCount(uint256 countryId)

### ImprovementsContact2

ImprovementsContract2 is one of four contracts that will store a nations improvements. The improvements that this contact keeps track of, and the cost of each of those improvements are below:

1. foreignMinistry (120,000 WB)
2. forward operating base (125,000 WB)
3. guerilla camp (20,000 WB)
4. harbor (200,000 WB)
5. hospital (180,000 WB)
6. intelligence agency (38,500 WB)
7. jail (25,000 WB)
8. labor camp (150,000)

The functions of this contract are as follows:

#### generateImprovements(*uint256 id*)

This function is only callable from the country minter contract. This function instantiates the struct that will store the imprvements for a given nation.

#### buyImprovement2(*uint256 amount, uint256 countryId, uint256 improvementId*)

This function will allow a nation ruler to purchase any of the improvements available from this contract. The nation owner must be the nation owner of the countryId nation and the msg.sender of the function call must be the owner of that nation. The improvementId's are listed below:

1. foreignMinistry 
2. forward operating base 
3. guerilla camp 
4. harbor
5. hospital
6. intelligence agency
7. jail
8. labor camp

#### deleteImprovement2(*uint256 amount, uint256 countryId, uint256 improvementId*)

This function will delete any of the above improvements for a given nation provided they are present. The caller of this function must be the nation owner of the countryId parameter.

The improvementId's are as follows:

1. foreignMinistry 
2. forward operating base 
3. guerilla camp 
4. harbor
5. hospital
6. intelligence agency
7. jail
8. labor camp

#### Functions That Return a Nations Improvement Count

There are functions for each improvement that will return a nations improvement count for a given nationId.

They are as follows:

1. getForeignMinistryCount(uint256 countryId) 
2. getForwardOperatingBaseCount(uint256 countryId)
3. getGuerillaCampCount(uint256 countryId)
4. getHarborCount(uint256 countryId)
5. getHospitalCount(uint256 countryId)
6. getIntel(uint256 countryId)
7. getCasinoCount(uint256 countryId)
8. getChurchCount(uint256 countryId)
9. getClinicCount(uint256 countryId)
10. getDrydockCount(uint256 countryId)
11. getFactoryCount(uint256 countryId)

### ImprovementsContact3

ImprovementsContract3 is one of four contracts that will store a nations improvements. The improvements that this contact keeps track of, and the cost of each of those improvements are below:

1. office of propaganda (200,000 WB)
2. police headquarters (75,000 WB)
3. prison (200,000 WB)
4. radiation containment chamber (200,000 WB)
5. red light district (50,000 WB)
6. rehabilitation facility (500,000 WB)
7. sattelite (90,000 WB)
8. school (85,000 WB)
9. shipyard (100,000 WB)
10. stadium (110,000 WB)
11. university (180,000 WB)

The functions of this contract are as follows:

#### generateImprovements(*uint256 id*)

This function is only callable from the country minter contract. This function instantiates the struct that will store the imprvements for a given nation.

#### buyImprovement3(*uint256 amount, uint256 countryId, uint256 improvementId*)

This function will allow a nation ruler to purchase any of the improvements available from this contract. The nation owner must be the nation owner of the countryId nation and the msg.sender of the function call must be the owner of that nation. The improvementId's are listed below:

1. office of propaganda
2. police headquarters
3. prison
4. radiation containment chamber
5. red light district
6. rehabilitation facility
7. sattelite
8. school 
9. shipyard 
10. stadium 
11. university

#### deleteImprovement3(*uint256 amount, uint256 countryId, uint256 improvementId*)

This function will delete any of the above improvements for a given nation provided they are present. The caller of this function must be the nation owner of the countryId parameter.

The improvementId's are as follows:

1. office of propaganda
2. police headquarters
3. prison
4. radiation containment chamber
5. red light district
6. rehabilitation facility
7. sattelite
8. school 
9. shipyard 
10. stadium 
11. university

#### Functions That Return a Nations Improvement Count

There are functions for each improvement that will return a nations improvement count for a given nationId.

They are as follows:

1. getCfficeOfPropagandaCount(uint256 countryId)
2. getPoliceHeadquartersCount(uint256 countryId)
3. getPrisonCount(uint256 countryId)
4. getRadiationContainmentChamberCount(uint256 countryId)
5. getRedLightDistrictCount(uint256 countryId)
6. getRehabilitationFacilityCount(uint256 countryId)
7. getSatteliteCount(uint256 countryId)
8. getSchoolCount(uint256 countryId)
9. getShipyardCount(uint256 countryId)
10. getStadiumCount(uint256 countryId)
11. getUniversityCount(uint256 countryId)

### ImprovementsContact4

ImprovementsContract4 is one of four contracts that will store a nations improvements. The improvements that this contact keeps track of, and the cost of each of those improvements are below:

1. missile defense (90,000 WB)
2. munitions factory (200,000 WB)
3. naval academy (300,000 WB)
4. naval construction yard (300,000)

The functions of this contract are as follows:

#### generateImprovements(*uint256 id*)

This function is only callable from the country minter contract. This function instantiates the struct that will store the imprvements for a given nation.

#### buyImprovement4(*uint256 amount, uint256 countryId, uint256 improvementId*)

This function will allow a nation ruler to purchase any of the improvements available from this contract. The nation owner must be the nation owner of the countryId nation and the msg.sender of the function call must be the owner of that nation. The improvementId's are listed below:

1. missile defense
2. munitions factory
3. naval academy
4. naval construction yard

#### deleteImprovement4(*uint256 amount, uint256 countryId, uint256 improvementId*)

This function will delete any of the above improvements for a given nation provided they are present. The caller of this function must be the nation owner of the countryId parameter.

The improvementId's are as follows:

1. missile defense
2. munitions factory
3. naval academy
4. naval construction yard

#### Functions That Return a Nations Improvement Count

There are functions for each improvement that will return a nations improvement count for a given nationId.

They are as follows:

1. getMissileDefenseCount(uint256 countryId) 
2. getMunitionsFactoryCount(uint256 countryId)
3. getNAvaLAcademyCount(uint256 countryId)
4. getNavalConstructionYardCount(uint256 countryId)

### WondersContract1

WondersContract1 is one of four contracts that will store a nations wonders. The wonders that this contact keeps track of, and the cost of each of those wonders are below:

1. agriculture development program (30,000,000 WB)
2. anti air defense network (50,000,000 WB)
3. central intelligence agency (40,000,000 WB)
4. disaster relief agency (40,000,000 WB)
5. emp weaponization (200,000,000 WB)
6. fallout shelter system (40,000,000 WB)
7. federal aid commission (25,000,000 WB)
8. federal reserve (10,0000,000 WB)
9. foreign air force base (35,000,000 WB)
10. foreign army base (200,000,000 WB)
11. foreign naval base (200,000,000 WB)

#### generateWonders1(*uint256 id*)

This function is only callable from the country minter contract. This function instantiates the struct that will store the wonders for a given nation.

#### buyWonder1(*uint256 countryId, uint256 wonderId*)

This function will allow a nation ruler to purchase any of the wonders available from this contract. The nation owner must be the nation owner of the countryId nation and the msg.sender of the function call must be the owner of that nation. Only one of each wonder can be purchased. The wonderId's are listed below:

1. agriculture development program
2. anti air defense network
3. central intelligence agency
4. disaster relief agency
5. emp weaponization
6. fallout shelter system
7. federal aid commission
8. federal reserve 
9. foreign air force base
10. foreign army base
11. foreign naval base

#### deleteWonder1(*uint256 countryId, uint256 wonderId*)

This function will delete any of the above wonders for a given nation provided the nation has that wonder. The caller of this function must be the nation owner of the countryId parameter.

The wondersId's are as follows:

1. agriculture development program
2. anti air defense network
3. central intelligence agency
4. disaster relief agency
5. emp weaponization
6. fallout shelter system
7. federal aid commission
8. federal reserve 
9. foreign air force base
10. foreign army base
11. foreign naval base

#### Functions That Return a Nations Wonders

There are functions for each wonder that will return a true boolean value if a given nation posesses a wonder.

The functions are as follows:

1. getAgricultureDevelopmentProgram(*uint256 id*)
2. getAntiAirDefenseNetwork(*uint256 id*)
3. getCentralIntelligenceAgency(*uint256 id*)
4. getDisasterReliefAgency(*uint256 id*)
5. getEmpWeaponization(*uint256 id*)
6. getFalloutShelterSystem
7. getFederalAidCommission
8. getFederalReserve(*uint256 id*)
9. getForeignAirForceBase(*uint256 id*)
10. getForeignArmyBase(*uint256 id*)
11. getForeignNavalBase(*uint256 id*)

### WondersContract2

WondersContract2 is one of four contracts that will store a nations wonders. The wonders that this contact keeps track of, and the cost of each of those wonders are below:

1. great monument (35,000,000 WB) 
2. great temple (35,000,000 WB)
3. great university (35,000,000 WB)
4. hidden nuclear missile silo (30,000,000 WB)
5. interceptor missile system (50,000,000 WB)
6. internet (35,000,000 WB)
7. interstate system (45,000,000 WB)
8. manhattan project (100,000,000 WB)
9. mining industry consortium (25,000,000 WB)

#### generateWonders2(*uint256 id*)

This function is only callable from the country minter contract. This function instantiates the struct that will store the wonders for a given nation.

#### buyWonder2(*uint256 countryId, uint256 wonderId*)

This function will allow a nation ruler to purchase any of the wonders available from this contract. The nation owner must be the nation owner of the countryId nation and the msg.sender of the function call must be the owner of that nation. Only one of each wonder can be purchased. The wonderId's are listed below:

1. great monument 
2. great temple
3. great university
4. hidden nuclear missile silo
5. interceptor missile system 
6. internet
7. interstate system
8. manhattan project
9. mining industry consortium

#### deleteWonder2(*uint256 countryId, uint256 wonderId*)

This function will delete any of the above wonders for a given nation provided the nation has that wonder. The caller of this function must be the nation owner of the countryId parameter.

The wondersId's are as follows:

1. great monument 
2. great temple
3. great university
4. hidden nuclear missile silo
5. interceptor missile system 
6. internet
7. interstate system
8. manhattan project
9. mining industry consortium

#### Functions That Return a Nations Wonders

There are functions for each wonder that will return a true boolean value if a given nation posesses a wonder.

The functions are as follows:

1. getGreatMonument(*uint256 id*)
2. getGreatTemple(*uint256 id*)
3. getGreatUniversity(*uint256 id*)
4. getHiddenNuclearMissileSilo(*uint256 id*)
5. getInterceptorMissileSystem(*uint256 id*)
6. getInternet(*uint256 id*)
7. getInterstateSystem(*uint256 id*)
8. getManhattanProject(*uint256 id*)
9. getMiningIndustryConsortium(*uint256 id*)

### WondersContract3

WondersContract3 is one of four contracts that will store a nations wonders. The wonders that this contact keeps track of, and the cost of each of those wonders are below:

1. movie industry (26,000,000 WB)
2. national cemetary (150,000,000 WB)
3. national environment office (100,000,000 WB)
4. national research lab (35,000,000 WB)
5. national war memorial (27,000,000 WB)
6. nuclear power plant (75,000,000 WB)
7. pentagon (30,000,000 WB)
8. political lobbyists (50,000,000 WB)
9. scientific development center (150,000,000 WB)

#### generateWonders3(*uint256 id*)

This function is only callable from the country minter contract. This function instantiates the struct that will store the wonders for a given nation.

#### buyWonder3(*uint256 countryId, uint256 wonderId*)

This function will allow a nation ruler to purchase any of the wonders available from this contract. The nation owner must be the nation owner of the countryId nation and the msg.sender of the function call must be the owner of that nation. Only one of each wonder can be purchased. The wonderId's are listed below:

1. movie industry
2. national cemetary
3. national environment office 
4. national research lab
5. national war memorial 
6. nuclear power plant 
7. pentagon 
8. political lobbyists 
9. scientific development center

#### deleteWonder3(*uint256 countryId, uint256 wonderId*)

This function will delete any of the above wonders for a given nation provided the nation has that wonder. The caller of this function must be the nation owner of the countryId parameter.

The wondersId's are as follows:

1. movie industry
2. national cemetary
3. national environment office 
4. national research lab
5. national war memorial 
6. nuclear power plant 
7. pentagon 
8. political lobbyists 
9. scientific development center

#### Functions That Return a Nations Wonders

There are functions for each wonder that will return a true boolean value if a given nation posesses a wonder.

The functions are as follows:

1. getMovieIndustry(*uint256 id*)
2. getNationalCemetary(*uint256 id*)
3. getNationalEnvironmentOffice(*uint256 id*)
4. getNationalResearchLab(*uint256 id*)
5. getNationalWarMemorial(*uint256 id*)
6. getNuclearPowerPlant(*uint256 id*)
7. getPentagon(*uint256 id*)
8. getPoliticalLobbyists(*uint256 id*)
9. getScientificDevelopmentCenter(*uint256 id*)

### WondersContract4

WondersContract4 is one of four contracts that will store a nations wonders. The wonders that this contact keeps track of, and the cost of each of those wonders are below:

1. social security (40,000,000 WB)
2. space program (30,000,000 WB)
3. stock market (30,000,000 WB)
4. strategic defense initiative (75,000,000 WB)
5. superior logistical support (80,000,000 WB)
6. universal healthcare (100,000,000 WB)
7. weapons research center (150,000,000 WB)

#### generateWonders4(*uint256 id*)

This function is only callable from the country minter contract. This function instantiates the struct that will store the wonders for a given nation.

#### buyWonder4(*uint256 countryId, uint256 wonderId*)

This function will allow a nation ruler to purchase any of the wonders available from this contract. The nation owner must be the nation owner of the countryId nation and the msg.sender of the function call must be the owner of that nation. Only one of each wonder can be purchased. The wonderId's are listed below:

1. social security
2. space program
3. stock market
4. strategic defense initiative
5. superior logistical support
6. universal healthcare
7. weapons research center

#### deleteWonder4(*uint256 countryId, uint256 wonderId*)

This function will delete any of the above wonders for a given nation provided the nation has that wonder. The caller of this function must be the nation owner of the countryId parameter.

The wondersId's are as follows:

1. social security
2. space program
3. stock market
4. strategic defense initiative
5. superior logistical support
6. universal healthcare
7. weapons research center

#### Functions That Return a Nations Wonders

There are functions for each wonder that will return a true boolean value if a given nation posesses a wonder.

The functions are as follows:

1. getSocialSecuritySystem(*uint256 id*)
2. getSpaceProgram(*uint256 id*)
3. getStockMarket(*uint256 id*)
4. getStrategicDefenseInitiative(*uint256 id*)
5. getSuperiorLogisticalSupport(*uint256 id*)
6. getUniversalHealthcare(*uint256 id*)
7. getWeaponsResearchCenter(*uint256 id*)

### AidContract

The aid contract will keep track of a nation's aid proposals and accepted aid packages. The functions are as follows.

#### proposeAid(*uint256 idSender, uint256 idRecipient, uint256 techAid, uint256 balanceAid, uint256 soldiersAid*)

This function will allow a nation to propose an aid package to another nation. Aid proposals will need to be accepted by the recipient nation in a separate proposal.

This function is only callable by the owner of the isDender nation.

A nation's sent, recieved or proposed aid cannot exceed 10 packages in a 10 day period. If a nation has a disaster relief agency it is eligable to have a total of 13 sent and recieved aid packages in a 10 day period. 

In order to propose an aid package a sender must have more aid available that the aid in the proposal. The maximum aid a nation can send to another nation is 100 tech levels, 6,000,000 WB balance, and 4,000 soldiers. If both nations have a fedeal aid comission then these totals will increase by 50% to 150 tech, 9,000,000 WB and 6,000 soldiers. 

Additionally, if the sender and reciever are on the same team and either is sanctioned then the proposal will be blocked. If the sender and reciever are on different teams and the sender is santioned on the recipient team or the recipient is sanctioned on the sender team then the proposal will also be blocked. 

#### checkAidSlots(*uint256 idSender*)

This function will return true if the sender of the aid package has an aid slot available to send or recieve an aid proposal. A sender will be allowed to send, propose or recieve 10 aid packages in a 10 day period. If a nation has a disaster relief agency this total per 10 days goes up to 13. 

#### getMaxAidSlots(*uint256 idSender*)

This function returns the maximum aid slots a nation can send, recieve or propose in a 10 day period. It will return 10 unless a nation has a disaster relief agency in which case it will return 13.

#### getAidProposalsLast10Days(*uint256 id*)

This function returns the number of aid proposals a nation has proposed, sent or recieved in the last 10 days.

#### checkAvailability(*uint256 idSender, uint256 techAid, uint256 balanceAid, uint256 soldierAid*)

This function will run during the propose aid and accept aid process and will return true if a sender has the required amount of aid to fulfill an aid proposal.

#### getFederalAidEligability(*uint256 idSender, uint256 idRecipient*)

This function will return true if both the sender and the recipient have a federal aid comission. When true, an aid package can contain 150% of the default amount of aid.

#### setProposalExpiration(*uint256 newExpiration*)

This function is only callable by the contract owner and will set the number of days that need to elapse before an aid proposal expires.

#### getProposalExpiration()

This function returns the default number of days an aid proposal has from when it get proposed until when it expires.

#### proposalExpired(*uint256 proposalId*)

This function will take a given aid proposal as a parameter and return a boolean value whether it is expired or not.

#### acceptProposal(*uint256 proposalId*)

This function allows a nation owner to accept an aid proposal. The caller of this function must be the owner of the recipientId nation of the aid proposal.

The proposal must not be expired (older than 7 days) in order for this function to proceed. This function cannot be already accepted or cancelled either. The trade cannot be sanctioned. If the nations are on the same team then neither can be santioned. If the nations are on different teams then the sender cannot be sanctioned on the recipient team and the recipient cannot be sanctioned on the sender team. The sender of the tech must also posess the contents of the aid package in order to send it.

#### cancelAid(*uint256 proposalId*)

This function cancelled a proposed aid package. Either the sender or recipient can cancel an aid package. Only the sender or recipient can call this function. An aid package cannot be cancelled if it is accepted, expired or already cancelled. Once a proposal is cancelled it can no longer be accepted. It will no longer count as a proposal within the last 10 days.

#### getProposal(*uint256 proposalId*)

This function returns the contents of an aid proposal struct. Information on aid proposals are stored in a struct and then the struct is stored to a mapping called idToProposal. This function will return the 7 variables of a proposal struct in the following order.

1. proposalId
2. dayProposed
3. idSender
4. idRecipient
5. techAid
6. balanceAid
7. soldierAid

#### checkCancelledOrAccepted(*uint256 proposalId*)

This function returns 2 boolean values for a given proposal id. The forst boolean value is whether an aid package has been accepted and the second is whether it has been cancelled.

### EnvironmentContract

The EnvironmentContract will calculate a nations environment score. The higher a nations environment score the lower the nations happiness. The functions for this contract are as follows:

#### getEnvironmentScore(*uint256 id*)

This function will return an environment score for a given nation. Environment scores are an integer from 0 to 10. the worse a nations environment the higher a nations environment score will be. A base environment score can range between 0 and 10. However there is an additional global radiation level that is calulated from the numebr of nukes that have landed in the last 7 days divided by the number of countries. Global radiation cannot affect your environment more than 5 points. For instance if you have a base environment score of 3 and global radiation is at a 4 then your environment score will be a 7. However if your base environemnt score is a 7 and global radiation is a 4 your overall environment score is a 10.

The functions that affect a nations environment score are as follows:

#### getGrossEnvironmentScore(*uint256 id*)

This function returns a nations gross environment score. This is done to account for decimals. Environment score is rounded up to the nearest 10 from gross score. So a nation witl 52 gross points will have an environment score of 6. 

#### getEnvironmentScoreFromResources(*uint256 id*)

This functon returns the gross points to a nations envirnment score from resources. If a nation has the resources coal, oil or uranium a nations gross environment score is increase 10 points. If a nation has a national environemntal office then these points are negated.

Water and radiation cleanup will reduce (help) a nations gross environment score by 10 points each.

#### getEnvironmentScoreFromImprovementsAndWonders(*uint256 id*)

This function will return a nations gross environemnt score from improvements and wonders. 

Border walls will reduce a nations gross environment score by 10 points each. 

Munitions factories will increase a nations environment score by 3 points each.

Red light districts will increase a nations gross environment score by 5 points each.

A national environmental office will reduce a nations gross environment score by 10 points. 

A weapons research center will increase a nations gross environment score by 10 points.

#### getEnvironmentScoreFromTech(*uint256 id*)

This function returns a given nations gross environment score from tech. A tech level over 6 will help a nations gross environemnt score by 10 points.

#### getEnvironmentScoreFromMilitaryDensity(*uint256 id*)

This function returns a nations gross environment score from soldier density.

If a nation has greater than 60% of its total population as soldiers then the gross environment score will go up 10.

#### getEnvironmentScoreFromInfrastructure(*uint256 id*)

This function returns a nations gross envrionment score from infrastructure. 

If a nation owns greater than 2 times the amount of infrastructure as its area of influence then the gross environment score is increase by 10.

#### getEnvironmentScoreFromNukes(*uint256 id*)

This function will return the gross environment points for a given nation based on the number of nukes they own. Every nuke will penalize a nation 1 gross environment point.

If a nation has access to lead then the penalty for owning nukes is reduced by 50%.

#### getPointsFromGovernmentType(*uint256 id*)

This function will return the gross environment score for a given nation based on the nations type of government.

Anarchy, communist, dictatorship and transitional will increase a nations gross environment score by 10.

Capitalist, democracy and republic government types will help reduce a nations gross environemnt score by 10.

### Crime

The CrimeContract will calculate the number of criminals in a nations populations. There are several important numbers that go into a nations criminal count. A nations crime index can vary between 0 and 6. A nations criminal count will be a certain percentage of the population. The percentage will be the crime index + 1. So a nation with a crime index of 3 will have 4% of its population as criminals.

Crime index is determined by crime prevention score. The lower a nations crime prevention score the higher its crime index will be. Crime prevention score correlates to crime index in the following way:

Crime prevention score < 200 = crime index of 6
Crime prevention score < 250 = crime index of 5
Crime prevention score < 300 = crime index of 4
Crime prevention score < 350 = crime index of 3
Crime prevention score < 400 = crime index of 2
Crime prevention score < 500 = crime index of 1
Crime prevention score >= 500 = crime index of 0

The functions to calulate a nations criminal count are below. 

#### getCriminalCount(*uint256 id*)

This function returns 3 numbers. The first number is the number of criminals for a nation. The second number is the number of rehabilitated citizens. The third number is the number of incarcerated citizens.

Criminal count for a nation is equal to a percentage as determined from the crime index. The percentage of a nations population that will be criminals is equal to the crime index + 1.

Every 1,000 criminals will adversely affect your nations happiness and reduce the tax collection. 

Criminals can be incarcerated. Each jail reduces criminal count by 500, each labor camp by 200 and each prison by 5,000.

Criminals can also be rehabilitated in rehabilitation facilities and returned to the population as upstanding and tax paying citizens.

#### incarcerateCriminals(*uint256 baseCriminalCount, uint256 countryId*)

This function serves to help with computation on the above function. This function accepts a gross criminal count and a nation id as parameters and will return 2 values - the number of criminal and the number if incarcerated criminals.

Criminals can be incarcerated. Each jail reduces criminal count by 500, each labor camp by 200 and each prison by 5,000.

#### getCrimeIndex(*uint256 id*)

This function will take a crime prevention score for a given nation and retrun a crime index.

#### getCrimePreventionScore(*uint256 id*)

This function will return a nations crime prevention score.

Crime preventions score is determined by literacy, improvements, government type, a nations infrastructure, and total population.

See below for more info.

#### getLiteracy(*uint256 id*)

This function will return the literacy rate for a given nationId.

Literacy is mainly determined from a nations technology.

A nation with tech less than 50 will have 20% literacy.

Nations will get credit for technology according to the following formula:
```
    ((tech - 50) / 3)
```
Schools will add 1% to literacy each. Universities will add 3%. A great university will increase literacy 10%.

#### getLiteracyPoints(*uint256 id*)

This function will return a nations crime prevention score points from a nations literacy percentage. A nation will get credit for its crime preventions score from literacy based on the following formula:

```
litPoints = ((literacyPercentage * 80) / 100)
```

#### getImprovementPoints(*uint256 id*)

This function returns the crime preventions score points from a given nations improvements.

Some improvements will increase a nations crime prevention score:
* Schools + 3 each
* Universities + 10 each
* Police Headquarters + 2 each

Other improvements decrease a nations crime prevention score:
* Casinos - 2 each
* Red Light Districts -2 each

#### getTaxRateCrimeMultiplier(*uint256 id*)

A nations tax rate will also add points to its crime prevention score. 

A tax rate can add anywhere from 20 to 35 points to a CPS. The higher the tax rate the less points added. 

#### getPointsFromGovernmentType(*uint256 id*)

A nations government also affects its crime prevention score. This function will retrun the crime prevention score points from a nation's government type.

The crime prevention score points a nation recieves from governemnt type is as follows:

* Anarchy = CPS + 50
* Capitalist = CPS + 110
* Communist = CPS + 150
* Democracy = CPS + 120
* Dictatorship = CPS + 175
* Federal = CPS + 160
* Monarchy = CPS + 140
* Repuiblic = CPS + 165
* Revolutionary = CPS + 150
* Totalitarian = CPS + 190
* Transitional = CPS + 100

#### getPointsFromInfrastructure(*uint256 id*)

This function will return the crime prevention score points for a nation from from its infrastructure levels. CPS from infrastructure is calculated according to the following formula:
```solidity
infraPoints = (infra / 400);
```

#### getPointFromPopulation(*uint256 id*)

This function will return a given nations CPS points from its population. The higher a nations population the lower its CPS points from population will be. this is calulated in the following way:

```solidity 
uint256 populationPointsDeduction = (totalPopulation / 250);
if (populationPointsDeduction >= 350) {
     populationPointsDeduction = 350;
   }
uint256 populationPoints = (350 - populationPointsDeduction);
```

### TaxesContract

The TaxesContract will allow a nation owner to collect texes from their citizens. he main functionality of this contract is getting a given nations happiness, the daily taxes collectible, the overall tax colection amount and enabling a nation owner to collect those taxes. 

This contract inherits from the OpenZeppelin Ownable contract.

The functionality for this contract is as follows:

#### collectTaxes(*uint256 id*)

This is the function that will take a cellection amount and increase the nations balance by that collection amount. The collection amount is detrmined by a cascade of functions outlined below. The cllection amount will increase the balance via the contract on the treasury contract called increaseBalanceOnTaxCollection(*uint256 id, uint256 taxesCollectible*).

#### getTaxesCollectible(*uint256 id*)

This function returns the overall collection amount for a nation. The daily collection amount for a nation is calculated according to the following formula:

Tax Collection = daily taxes collectible * days since last tax collection * citizens

where

Daily taxes collectible = daily income per citizen * tax rate

This function will return 2 values
1. The daily taxes collectible per citizen
2. A number with 18 digits after the decimal place representing the tax collection amount

#### getDailyIncome(*uint256 id*)

This function will return the daily income of a given nations citizens. 

Daily income will be calulated in the following way:

35 + (2 * happiness) * multipliers + adjustments

where the multipliers to income include:

* banks + 7% each
* foreign ministries + 5% each
* harbors + 1% each
* schools + 5% each
* universities + 8% each (10% with scientific development center)
* guerilla camps + 8% each
* casinos + 1% each

and adjustments include:

* furs + 4WB per citizen per day
* gems + 2
* gold + 3
* silver + 2
* scholars + 3
* agricultural development program + 2
* mining industry consortium + 2 for each resource coal, lead, oil and uranium
* stock market + 10
* (nuclear power plan + uranium) + 3WB (+1 per 10 tech levels up to 40 tech)

#### getHappiness(*uint256 id*)

This function will return a given nations happiness. Happiness is the biggest factor in determining the income of a nations citizens. Hapier citizens will make more money. Happiness will generally be equal to happiness additions - happiness subtractions. If subtractions are larger than additions happiness will be 0.

Additons to happiness come from:
* Having a compatible religion and government with your people
* Having a population density that isn't too high
* Certain resources
* Certain improvements
* Certain wonders
* Casualties
* Technology
* Nation Age
* Trades with Teammates
* DEFCON
* Government Type

Subtractions to happiness come from:
* Tax rate
* Soldier to population ratio
* Criminal count
* Certain improvements
* Intel Agencies
* Peace Mode
* Environment

#### getHappinessPointsToAdd(*uint256 id*)

This function returns the happiness points to add for a given nation.

#### getHappinessPointsToSubtract(*uint256 id*)

This function return the happiness points to subtract for a given nation.

#### checkCompatibility(*uint256 id*)

This function returns happiness points form a nations government and religion being compatible with the desires of the people.

A nation will recieve 1 happiness point if its government is the desired government of the people. If a nation has a great monument it will recieve this happiness point regardless of its government.

A nation will recieve 1 happiness point if its religion is the desired government of the poeple. If a nation has a great temple it will recieve this happiness point regardless of its religion.

#### checkPopulationDensity(*uint256 id*)

This function returns a nations population density. Population density is a nations total population divided by its area of influence.

#### getDensityPoints(*uint256 id*)

This function returns happiness points if a nation is below its maximum population density. A nation will be penalized if it has a population density above 70 ppl / mile. If the nation has access to the water resource it will be penalized only above a population density of 120 ppl / mile. A nation below their max population density will recieve 5 happiness points. Otherwise they will recieve 0.

#### getPointsFromResources(*uint256 id*)

This function returns a nations happiness points from its resources.

The following resources increase happiness:
* gems + 3
* oil + 2
* silver + 2
* spices + 2
* sugar + 1
* water + 3
* wine + 3
* beer + 2
* fast food + 2
* fine jewelry + 3
* automobiles + 3
* microchips + 2

#### getPointsFromImprovements(*uint256 id*)

This function returns a given nations happiness points from improvements.

The following improvements increase happiness:
* border walls + 2 points each
* casinos + 2 points each
* churches + 1 point each
* police HQs + 2 points each
* red light districts + 1 point each
* stadiums + 3 points each
* intel agencies + 1 point each if tax rate above 23%

#### getHappinessFromWonders(*uint256 id*)

This function returns the nations happiness points from wonders.

The following wonders increase happiness:
* great monument + 4 points
* great temple + 5 points
* great university without scientific development center
    * 1 point for each 1000 tech up to 3 points
* great university with scientific development center 
    * 1 point for each 1000 tech up to 5 points
* internet + 5 points
* movie industry + 3 points
* war memorial + 4 points
* space program + 3 points
* universal healthcare + 2 points

#### getCasualtyPoints(*uint256 id*)

This function returns a nations happiness points from casualties. If a nation has a national cemetary it can recieve happiness points from casualties.

Nations with a national cemetary will recieve 1 happiness point per 5,000,000 casualties up to 5 points.

#### getTechnologyPoints(*uint256 id*)

This function will return a nations happiness points from its technology level.

A nation will recieve up to 9 happines points from technology (up to 200 tech).

#### getPointsFromNationAge(*uint256 id*)

This function returns a nations happiness points from its age.

Nations less than 90 days old will not recieve a benefit. Nation between 90 and 180 days old will recieve a 2 point happiness bonus. Nations greater than 180 days old will recieve a 4 point happiness bonus.

#### getTaxRatePoints(*uint256 id*)

A nations happiness will be reduced based on its tax rate. 

Tax rates 16 or below will have no happiness penalty
Tax rates 17 to 20 will have a 1 point penalty
Tax rates 21 to 23 will have a 3 point penalty
Tax rates 24 to 25 will have a 5 point penalty
Tax rates 26 to 30 will have a 7 point penalty

#### getPointsFromIntelAgncies(*uint256 id*)

At certain tax rates intel agencies will adversely affect you nations happiness. This function retruns the happiness point penalty for intel agencies. 

* If a nation has a tax rate below 20 there is no penalty.
* If a nation has a tax rate between 20 and 23 with at least one intel agency there is a 1 point penalty
* If a nation has a tax rate above 23 there is a 1 point penalty per intel agency

### TaxesContract

The TaxesContract will allow a nation owner to collect texes from their citizens. he main functionality of this contract is getting a given nations happiness, the daily taxes collectible, the overall tax colection amount and enabling a nation owner to collect those taxes. 

This contract inherits from the OpenZeppelin Ownable contract.

The functionality for this contract is as follows:

#### collectTaxes(*uint256 id*)

This is the function that will take a cellection amount and increase the nations balance by that collection amount. The collection amount is detrmined by a cascade of functions outlined below. The cllection amount will increase the balance via the contract on the treasury contract called increaseBalanceOnTaxCollection(*uint256 id, uint256 taxesCollectible*).

#### getTaxesCollectible(*uint256 id*)

This function returns the overall collection amount for a nation. The daily collection amount for a nation is calculated according to the following formula:

Tax Collection = daily taxes collectible * days since last tax collection * citizens

where

Daily taxes collectible = daily income per citizen * tax rate

This function will return 2 values
1. The daily taxes collectible per citizen
2. A number with 18 digits after the decimal place representing the tax collection amount

#### getDailyIncome(*uint256 id*)

This function will return the daily income of a given nations citizens. 

Daily income will be calulated in the following way:

35 + (2 * happiness) * multipliers + adjustments

where the multipliers to income include:

* banks + 7% each
* foreign ministries + 5% each
* harbors + 1% each
* schools + 5% each
* universities + 8% each (10% with scientific development center)
* guerilla camps + 8% each
* casinos + 1% each

and adjustments include:

* furs + 4WB per citizen per day
* gems + 2
* gold + 3
* silver + 2
* scholars + 3
* agricultural development program + 2
* mining industry consortium + 2 for each resource coal, lead, oil and uranium
* stock market + 10
* (nuclear power plan + uranium) + 3WB (+1 per 10 tech levels up to 40 tech)

#### getHappiness(*uint256 id*)

This function will return a given nations happiness. Happiness is the biggest factor in determining the income of a nations citizens. Hapier citizens will make more money. Happiness will generally be equal to happiness additions - happiness subtractions. If subtractions are larger than additions happiness will be 0.

Additons to happiness come from:
* Having a compatible religion and government with your people
* Having a population density that isn't too high
* Certain resources
* Certain improvements
* Certain wonders
* Casualties
* Technology
* Nation Age
* Trades with Teammates
* DEFCON
* Government Type

Subtractions to happiness come from:
* Tax rate
* Soldier to population ratio
* Criminal count
* Certain improvements
* Intel Agencies
* Peace Mode
* Environment

#### getHappinessPointsToAdd(*uint256 id*)

This function returns the happiness points to add for a given nation.

#### getHappinessPointsToSubtract(*uint256 id*)

This function return the happiness points to subtract for a given nation.

#### checkCompatibility(*uint256 id*)

This function returns happiness points form a nations government and religion being compatible with the desires of the people.

A nation will recieve 1 happiness point if its government is the desired government of the people. If a nation has a great monument it will recieve this happiness point regardless of its government.

A nation will recieve 1 happiness point if its religion is the desired government of the poeple. If a nation has a great temple it will recieve this happiness point regardless of its religion.

#### checkPopulationDensity(*uint256 id*)

This function returns a nations population density. Population density is a nations total population divided by its area of influence.

#### getDensityPoints(*uint256 id*)

This function returns happiness points if a nation is below its maximum population density. A nation will be penalized if it has a population density above 70 ppl / mile. If the nation has access to the water resource it will be penalized only above a population density of 120 ppl / mile. A nation below their max population density will recieve 5 happiness points. Otherwise they will recieve 0.

#### getPointsFromResources(*uint256 id*)

This function returns a nations happiness points from its resources.

The following resources increase happiness:
* gems + 3
* oil + 2
* silver + 2
* spices + 2
* sugar + 1
* water + 3
* wine + 3
* beer + 2
* fast food + 2
* fine jewelry + 3
* automobiles + 3
* microchips + 2

#### getPointsFromImprovements(*uint256 id*)

This function returns a given nations happiness points from improvements.

The following improvements increase happiness:
* border walls + 2 points each
* casinos + 2 points each
* churches + 1 point each
* police HQs + 2 points each
* red light districts + 1 point each
* stadiums + 3 points each
* intel agencies + 1 point each if tax rate above 23%

#### getHappinessFromWonders(*uint256 id*)

This function returns the nations happiness points from wonders.

The following wonders increase happiness:
* great monument + 4 points
* great temple + 5 points
* great university without scientific development center
    * 1 point for each 1000 tech up to 3 points
* great university with scientific development center 
    * 1 point for each 1000 tech up to 5 points
* internet + 5 points
* movie industry + 3 points
* war memorial + 4 points
* space program + 3 points
* universal healthcare + 2 points

#### getCasualtyPoints(*uint256 id*)

This function returns a nations happiness points from casualties. If a nation has a national cemetary it can recieve happiness points from casualties.

Nations with a national cemetary will recieve 1 happiness point per 5,000,000 casualties up to 5 points.

#### getTechnologyPoints(*uint256 id*)

This function will return a nations happiness points from its technology level.

A nation will recieve up to 9 happines points from technology (up to 200 tech).

#### getPointsFromNationAge(*uint256 id*)

This function returns a nations happiness points from its age.

Nations less than 90 days old will not recieve a benefit. Nation between 90 and 180 days old will recieve a 2 point happiness bonus. Nations greater than 180 days old will recieve a 4 point happiness bonus.

#### getTaxRatePoints(*uint256 id*)

A nations happiness will be reduced based on its tax rate. 

Tax rates 16 or below will have no happiness penalty
Tax rates 17 to 20 will have a 1 point penalty
Tax rates 21 to 23 will have a 3 point penalty
Tax rates 24 to 25 will have a 5 point penalty
Tax rates 26 to 30 will have a 7 point penalty

#### getPointsFromIntelAgncies(*uint256 id*)

At certain tax rates intel agencies will adversely affect you nations happiness. This function retruns the happiness point penalty for intel agencies. 

* If a nation has a tax rate below 20 there is no penalty.
* If a nation has a tax rate between 20 and 23 with at least one intel agency there is a 1 point penalty
* If a nation has a tax rate above 23 there is a 1 point penalty per intel agency

#### getPointsFromMilitary(*uint256 id*)

A nation will lose population happiness if its soldier to population ratio is too high or too low. This function returns the hapiness points to reduce based on soldier to population ratio.

If soliers are > 70% of a nations population there is a 10 point happiness penalty
If soldeirs are less than 20% of a nations population there is a 5 point penalty
If soldiers are less than 10% of a nations population there is a 14 point penalty

#### getSoldierToPopulationRatio(*uint256 id*)

This function has 3 returns. They are:
1. ```uint256 soldierToPopulationRatio```
2. ```bool environmentPenalty```
3. ```bool anarchyCheck```

The firt return is the ratio used to calculate the points from military in the above function.
The second return will be used in the environment contract to determine if there is an environment penalty for having too many soldiers (> 60%)
The third return will be used in battles when soldiers are killed to check if the population is thrown into anarchy (< 10%)

#### getPointsFromCriminals(*uint256 id*)

Criminals will hurt a nations population happiness. This function returns the happiness penalty for unincarcerated criminals.

If unincarcerated criminals are below 200 happiness is unaffected
If criminals are above 200 and less than 2000 happiness is hurt -1
If criminals are above 2000 and less than 4000 happiness is hurt -2
If criminals are above 4000 and less than 6000 happiness is hurt -3
If criminals are above 6000 and less than 8000 happiness is hurt -4
If criminals are above 8000 happiness is hurt -5

### AdditionalTaxesContract

Not all of the calculation for a nations taxes can occur on a single smart contract. Some of the function to calulate a nations taxes are on the additional taxes contract.

The functions are as follows:

#### getIncomeAdjustments(*uint256 id*)

Income isadjusted upwards by certain resources, improvements and wonders. This function returns the income adjustments.

The income adjustments are as follows:
* furs + 4WB per citizen per day
* gems + 2
* gold + 3
* silver + 2
* scholars + 3
* agricultural development program + 2
* mining industry consortium + 2 for each resource coal, lead, oil and uranium
* stock market + 10
* (nuclear power plan + uranium) + 3WB (+1 per 10 tech levels up to 40 tech)

#### getPointsFromTrades(*uint256 id*)

A nation will recieve a happiness bonus for entering into trade agreements with members of the same team. Each trade with a team member will result in +1 happiness. This function will return those points.

#### getPointsFromDefcon(*uint256 id*)

This function will return a nations happiness points from its DEFCON. Points from DEFCON will = 1 - DEFCON. 

#### getPointsToSubtractFromImprovements(*uint256 id*)

This function returns the happiness penalty for owning labor camps. Happiness will be penalized 1 point per labor camp.

#### getHappinessPointsFromGovernment(*uint256 id*)

Certain goverment types will increase a peoples happiness. This function returns happiness points based on government type. Government types democracy, monarchy, revolutionary and totalitarian will result in a 1 point happiness bonus.

### BillsContract

The bills contract is where a nation owner can calulate their bill payment and pay bills. 

Bills come from infrastructure, military, improvements and wonders.

The functions for this contract are as follows:

#### payBills(*uint245 id*)

This function is only callable by the nation ownder of the nationId in the parameter.

This function takes the amount of bills owed and spends the balance and pays a nations bills.

A nation must have the amount of balance necessary to pay the bills deposited in the nation.

#### getBillsPayable(*uint256 id*)

This function returns the amount of bills a nation has to pay for the queried nationId. 

Bills come from infrastructure, military, improvements and upkeep.

A nations bill payments is the sum of these upkeep payments * the number of days since the last bill payment.

#### calculateDailyBillsFromInfrastructure(*uiint256 id*)

This function returns a nations bill payment from infrastructure. A nations infrastructure upkeep will typically be its largest payment. Infrastructure upkeep will be the cost per level * the amount of levels of infrastructure a nation has. 

It is important to note that as a nation buys more infrastructure it will have higher infrastructure upkeep per level. There are also jumps in infrastructure upkeep where it may be come more expensive to own infrastructure at levels right above a jumt then it does to own right below the jump. So it is better to own infrastructure at levels right below these jumps.

#### calculateInfrastructureCostPerLevel(*uint256 id*)

This function returns a nations infrastructure cost per level. Infrastructure upkeep cost per level is determined by a nations infrastructure level. The infrastructure cost per level is calulated in the following way:

<100 levels = 20 WB per level
<200 levels = infra level * 5% + 20 cost per level
<300 levels = infra level * 6% + 20 cost per level
<500 levels = infra level * 7% + 20 cost per level
<700 levels = infra level * 8% + 20 cost per level
<1000 levels = infra level * 9% + 20 cost per level
<2000 levels = infra level * 11% + 20 cost per level
<3000 levels = infra level * 13% + 20 cost per level
<4000 levels = infra level * 15% + 20 cost per level
<5000 levels = infra level * 17% + 20 cost per level
<8000 levels = infra level * 17.25% + 20 cost per level
<15000 levels = infra level * 17.5% + 20 cost per level
>=15000 levels = infra level * 18% + 20 cost per level

This gross cost is modified downward based on sever factors. See the below function

#### calculateModifiedInfrastructureUpkeep(*uint256 baseDailyInfrastructreCostPerLevel, uint256 id*)

This function accepts a nationId and a gross upkeep cost per level as parameters and will return the modified upkeep cost per level based on a variety of facotrs of a nation.

Resources will reduce a nations infrastructre payment in the following way:
* iron -10%
* lumber -8%
* uranium -3%
* asphalt -5%

Improvements also reduce infrastructure upkeep:
* labor cmaps -10% each (up to 5)

An wonders
* interstate system -8%
* nation environmental office -3%
* nuclear power plant -5%

#### calculateDailyBillsFromMilitary(*uint256 id*)

This function will return a nations daily bills from military upkeep. The military bills for a nation are the sum of the upkeeps from soldiers, tanks, aircraft, navy, nukes and cruise missiles. 

See below functions from more informatio on how these values are calculated.

#### getSoldierUpkeep(*uint256 id*)

This function returns a given nations daily soldier upkeep. 

Soldider upkeep by default it 2WB per soldier per day. This is modified in the follwoing way:

* lead - 15%
* pigs -10%
* barracks -8% each
* guerilla camps -5% each

#### getTankUpkeep(*uint256 id*)

This function returns a given nations daily tank upkeep.

Tank upkeep cost by defaul 40WB per tank per day. This is modified in the following way:

* iron - 10%
* oil -10%
* lead -8%
* superior logistic support -20%

#### getNukeUpkeep(*uint256 id*)

This function returns a given nations daily nuke upkeep.

Nuke upkeep cost a default of 5,000 WB per day. Nuke upkeep is adjusted in the following way.

* If a nation has access to lead upkeep is reduces -20%.
* If a nation does not have access to uranium upkeep is doubled.

#### getCruiseMissileUpkeep(*uin256 id*)

This function returns a given nations daily cruise missile upkeep.

Cruise missiles cost a default of 500WB per day to maintain. If a nation has access to lead this is reduced 20%.

#### getAircraftUpkeep(*uint256 id*)

This function returns a given nations daily aircraft upkeep.

Aircraft cost a default of 200WB per day to maintain. This cost is modified in the following ways:

* lead -25%
* airports -2% each
* superior logistical support -10%

#### getNavyUpkeep(*uint256 id*)

This function returns a given nations daily navy upkeep.

Different vessels cost different prices to maintain. The following is the price of the vessels to maintain:

* Corvettes = 5,000WB per day
* Landing Ships = 10,000WB per day
* Battleships = 25,000WB per day
* Cruisers = 10,000WB per day
* Frigates = 15,000WB per day
* Destroyers = 20,000WB per day
* Submarines = 25,000WB per day
* Aircraft Carriers = 30,000WB per day

Navy upkeep will be adjusted based on several modifiers. See below.

#### getAdjustedNavyUpkeep(*uint256 id, uint256 baseNavyUpkeep*)

This function will take a nationId and a base daily upkeep cost and return a nations adjusted naval upkeep. Adjustments to naval upkeep are as follows:

* lead -20%
* oil -10%
* superior logistical support -10%

#### calculateDailyBillsPayableFromImprovements(*uint256 id*)

This function will return a nations daily bill from improvements.

Improvement upkeep is calculated as follows:
* <5 improvements = 500WB per improvement
* <8 improvements = 600WB per improvement
* <15 improvements = 750WB per improvement
* <20 improvements = 950WB per improvement
* <30 improvements = 1200WB per improvement
* <40 improvements = 1500WB per improvement
* <50 improvements = 2000WB per improvement
* >=50 improvements = 3000WB per improvement

A nations improvement bill is modified in the follwoing ways:
* nuclear power plant -5%
* accomodative government -5%
    * Capitalist, federal, revolutionary and transitional reduce upkeep

#### calculateWonderBillsPayable(*uint256 id*)

This function returns a nations daily wonder upkeep. 

Wonders cost by default 5,000WB per day to maintain. wonder upkeep is adjusted in the following way.

A nations improvement bill is modified in the follwoing ways:
* nuclear power plant -5%
* accomodative government -5%
    * Capitalist, federal, revolutionary and transitional reduce upkeep

### MilitaryContract

The MilitaryContract will store a nations DEFCON level, threat level and war/peace preference. It will also keep track of how long a nation has been in war mode or peace mode.

The functions for this contract are as follows:

#### generateMilitary(*uint256 id*)

This function instantiates the struct that will store a nations DEFCON, threat level, war/peace preference and the nuber of days that preference has been active.

Once this struct is made it is stored in a mapping idToMilitary where a nations military struct can be queried with its nationId.

#### updateDefconLevel(*uint256 newDefcon, uint256 id*)

This function updated a nations DEFCON level. This function is only callable by the owner of the nationId in the parameter.

DEFCON can be set to 1, 2, 3, 4 or 5. The higher the number the higher a nations readiness but the lower its happiness.

#### setDefconLevelFromSpyContract(*uint256 id, uint256 newLevel*)

DEFCON level can be reset via a successful spy operation. This function is only callable from the spy operations contract. 

#### updateThreatLevel(*uint256 newThreatLevel, uint256 id*)

This function allows a nation owner to set a new threat level. This function is only callable by the owner of the nation in the id parameter.

New threat levels can be set to 1, 2, 3, 4 or 5. The higher the threat level the more ready a nation is to deter a spy attack and the loew happiness will be.

#### setThreatLevelFromSpyAttack(*uint256 id, uint256 newLevel*)

Threat level can be reset via a successful spy operation. This function is only callable from the spy operations contract. 

#### toggleWarPeacePreference(*uint256 id*)

A nations war peace preference will allow other nations to declare war on them. If war/peace preference is set to false other nation will not be able to declare war on that nation but that nation will not be allowed to collect taxes.

When a nation toggles from false to true on their war peace preference other nations will be able to declare war on them but they will be able to collect taxes. When a nation switches to war mode they must stay in war mode for 7 days before switching back to peace mode.

#### getDefconLevel(*uint256 id*)

This function will return a queried nations DEFCON level.

#### getThreatLevel(*uint256 id*)

This finction will return a queried nations threat level.

#### getWarPeacePreference(*uint256 id*)

This function will return true is a queried nation is open to war.

#### getDaysInPeaceMode(*uint256 id*)

This function retrns how long a nation has been in its war peace setting for.

### WarContract

The WarContract is where the wars of the game are stored. Nations will need to declare war on each other before attacking. Forces like soldiers and tanks will need to be deployed to wars in order to attack other nations. .

The functions for this contract are as follows.

#### declareWar(*uint256 offenseId, uint256 defenseId*)

A nation can declare war on another nation by calling this function with the nationId of a nation they own as the offenseId and the nationId of the nation they are attacking as the defenseId.

This function will revert if the msg.sender is not the nation owner of the offenseId nation.

Several checks will be run on the two nations to determine if war is possible.
* both nations must be in war mode
* the nation strength of the defender must be within 75% - 133% of the offense nation
* both nation must be active
* the nations cannot have an existing war with eachother
* an offensive nation can only have 4 offensive wars at any time (5 with foreign army base)

If all of these are met then war is declared.

#### warCheck(*uin256 offesneId, defenseId*)

This function will help the declare war function check for several settins between the two nations in order to ensure that war is possible.

#### offensiveWarsLength(*uint256 offenseId*)

This function is used mainly in testing and will return the length of the offensive war array for a nation. A nation can only have 4 offensive wars at any time (5 with a foreign army base). Each member of the array will be a warId

#### offensiveWarsReturn(*uint256 offenseId*)

This function will return the offensive war array for a queried nation. Each member of the array will be a warId.

#### nationActiveWarsReturn(*uint256 offenseId*)

This function will return a queried nation acitve wars array. Each member of the array will be a warId.

#### initializeDeployments(*uint256 _warId*)

This is an internal function that will initialize the structs of a nations deployed forces in war when war is declared. These structs will store a nations deployed soldiers and tanks for each war.

#### checkStrength(*uint256 offenseId, uint256 defenseId*)

This function will return true if a nation declaring war on another nation is within 75 - 133% of the other nation. War can only be declared when nations are within this range. 

#### offerPeace(*uint256 offerId, uint256 _warId*)

The offerId is the nationId of the offering nation. This function will allow one participant in a war to offer peace. This function will allow a nation to offer peace and will also allow the other nation to accept peace. When both nations have offered peace then the war will be removed from each nations active wars. 

If one nation has offered peace and an attack occurs then peace offers are cancelled.

#### returnWar(*uint256 _warId*)

This function will return the contents of a war struct for a given warId.

The returns will be the following:
* offense peace offere - boolean
* defense peace offered - boolean
* is the war active - boolean
* is peace declared - boolean
* is the war expired - boolean

#### removeActiveWar(*uint256 _warId*)

This is an internal function and can only be called from this contract.

When a war is deactivated it need to be remove in three places. 
1. the offenses offensive war array
2. the offenses active war array
3. the defenses active war array

This function will accomplish that.

#### addNavyCasualties(*uint256 _warId, uint256 nationId, uint256 navyCasualties*)

The navyCasualties will be the strength lost by a nation in a naval battle. This function will increment a nations navy strength lost by the amount of damage from a naval battle.

#### incrementCruiseMissileAttack(*uint256 _warId, uint256 nationId*)

This function is only callable from the cruise missile contract.

Each nation can only launch 2 cruise missiles per day per war. This function will keep track of those launches and revert a launch attempt if a nation is over the limit.

#### getCruiseMissileLaunchesToday(*uint256 _warId, uint256 id*)

This function will return the number of cruise missile launches for the present day for a given nation and warId.

#### isWarActive(*uint256 _warId*)

This function will return true if a war is active and false if a war is expired or peace has been declared.

#### getInvolvedParties(*uint256 _warId*)

This function will return the offenseId and the defenseId for a given warId.

#### isPeaceOffered(*uint256 _warId*)

This function returns true if either nation in a war have offered peace.

#### cancelPeaceOffersUponAttack(*uint256 _warId*)

This function will cancel any pending peace offers for a given warId if an attack occurs. This function is only callable from battle contracts.

#### getDaysLeft(*uint256 _warId*)

This function will return the number of days left in a war before it expires.

#### addAirBattleCasualties(*uint256 _warId, uint256 nationId, uint256 battleCasualties*)

This function will add the number of aircraft lost to a nations struct after an air battle occurs. This function is only callable from the air battle contract.

#### deployForcesToWar(*uint256 nationId, uint256 _warId, uint256 soldiersToDeploy,  uint256 tanksToDeploy*)

This function is only callable from the forces contract. 

A nation will only be able to deploy forces to war once per day. The forces that need to be deployed in order to attack another nation are soldiers and tanks. 

#### getDeployedGroundForces(*uint256 _warId, uint256 attackerId*)

This function will return a nations deployed forces for a given war.

The first vale returned will be the deployed soldiers to that war and the second value will be the deployed tanks.

#### decreaseGroundBattleForces(*uint256 soldierLosses, uint256 tankLosses, uint256 attackerId, uint256 _warId*)

This function is only callable from the ground battle contract. This function reduces the number of deployed forces when an attack occurs.

#### recallTroopsFromDeactivatedWars(*uint256 id*)

This function will recall troops from former wars. The gas for this action is passed off the nation ruler. Otherwise the game engine would have had to loop through all expired wars and return the troops. It is a good idea for a nation ruler to recall troop regularly otherwise they will have dormant troops occupying their soldier to population ratio. 

### NationStrengthContract

The NationStrengthContract will calculate a given nations strength. A nations strnegth is calculated in the following manner:

The sum of:
* land purchased * 1.5
* infrastructure levels * 3
* technology levels * 5
* soldiers * .02
* tanks deployed * .15
* tanks defending * .20
* aircraft strength * 5
* navy strength * 10
* cruise missiles * 10
* nukes ** 2 * 10

The functions that comprise this contract are as follows:

#### getNationStrength(*uint256 id*)

This function returns a given nations strength. 

#### getNationStrengthFromCommodities(*uint256 id*)

This function returns a nations total strength from land, technology and infrastructure.

#### getNationStrengthFromMilitary(*uint256 id*)

This function returns a nations total strength from soldiers, tanks, cruise missiles, nuke, air force, navy. 

#### getStrengthFromAirForce(*uint256 id*)

This function returns a nations strength from its airforce (fighters + bombers)

#### getStrengthFromFighters(*uint256 id*)

This function returns a nations strength from its fighters.

The strenght of a nations fighters are as follows:
* Yak9's = 5
* P51 Mustang = 10
* F86 Sabre = 15
* Mig 15 = 20
* F100 Super Sabre = 25
* F35 Lightning = 30
* F15 Eagle = 35
* SU30 MKI = 40
* F22 Raptor = 45

#### getStrengthFromBombers(*uint256 id*)

This function returns a nations strength from bombers.

The stregth of a nations bombers are as follows:
* AH1 Cobras = 5
* AH64 Apache = 10
* Bristol Blenheim = 15
* B52 Mitchell = 20
* B17G Flying Fortress = 25
* B52 Stratofortress = 30
* B2 Spirit = 35
* B1B Lancer = 40
* Tupolev TU160 = 45

#### getStrengthFromNavy(*uint256 id*)

This function returns a nations strength form its navy.

The strength from a nations navy is as follows:
* Corvettes = 10
* Landing Ships = 30
* Battleships = 50
* Cruisers = 60
* Frigates = 80
* Destroyers = 110
* Submarines = 120
* Aircraft Carriers = 150

### ForcesContract

The ForcesContract will keep track of a nations ground forces and spies. 

The functions for this contract are as follows:

#### generateForces(*uint256 id*)

This function is only callable from the country minter contract. This will instantiate the struct that stores a nation's total number of soldiers, defending soldiers, deployed soldiers, total tanks, defending tanks, deployed tanks, soldier casualties and spies. 

```solidity
    struct Forces {
        uint256 numberOfSoldiers;
        uint256 defendingSoldiers;
        uint256 deployedSoldiers;
        uint256 numberOfTanks;
        uint256 defendingTanks;
        uint256 deployedTanks;
        uint256 numberOfSpies;
        bool nationExists;
    }
```

#### buySoldiers(*uint256 amount, uint256 id*)

This function is only callable form the nation owner of the nation in the id parameter.

A nation ruler will only be able to purchase soldiers if the total amount of soldiers after the purchase is less than 80% of the overall population.

This function will also calculate the cost of the purchase (amount * cost) and spend the balance.

#### getSoldierCost(*uint256 id*)

This function will calculate a given nations soldier cost.

The default soldier cost is 12WB. This cost is reduces 3WB if the nation has access to Iron and 3WB if the nation has access to Oil.

#### sendSoldiers(*uint256 idSender, uint256 idReciever, uint256 amount*)

This fuction is only callable by the aid contract. 

This function will reduce the senders soldiers and increase the recipients soldiers by the amount in the package.

#### getDefendingSoldierCount(*uint256 id*)

This function will return a nations defending soldier count.

#### getSoldierCount(*uint256 id*)

This fuction will return a nations total soldier count (defending + deployed)

#### getDeployedSoldierCount(*uint256 id*)

This function will return a nations deployed soldier count

#### deployForces(*uint256 soldiersToDeploy, uint256 tanksToDeploy, uint256 id, uint256 warId*)

This function allows a nation owner to deploy forces to a war. This function is only callable by the nation owner of the id parameter. 

A nation can only deploy 80% of its soldiers at any time. This max deployable percentage goes down 2% for every border fortification owned.

This function will also call the function to deploy forces to a specific war on the war contract.

#### getMaxDeployablePercentage(*uint256 id*)

The max deployable percentage of a nations soldiers is 80%. This percentage goes down 2% for each border fortification owned.

This function returns the max depoyable percentage.

#### withdrawSoldiers(*uint256 amountToWithdraw, uint256 id*)

This function is only callable from the war contract and will withdraw soldiers from expired wars.

#### decreaseDefendingSoldierCountFromNukeAttack(*uint256 id*)

This function is only callable from the nuke contract. If a nation does not have a fallout shelter system then the defending soldier count will drop to 0. Otherwise defending soldiers will be reduced to 50%. 

#### getDeployedSoldierEfficiencyModifier(*uint256 id*)

Soldier efficiency is the strength a force of soldiers will have in battle. The strength in a ground battle of a group of soldiers is equal to the soldier count * efficiency.

Deployed soldier efficiency is modified in the following manner:
* Aluminium = Efficiency + 20%
* Coal +8%
* Oil +10%
* Pigs + 15%
* Barracks + 10% each
* Guerilla Camps + 35% each
* +8% for government types Communist, Democracy, Dictatorship, Federal, and Transitional

#### getDefendingSoldierEfficiencyModifier(*uint256 id*)

Soldier efficiency is the strength a force of soldiers will have in battle. The strength in a ground battle of a group of soldiers is equal to the soldier count * efficiency.

Defending soldier efficiency is modified in the following manner:
* Aluminium = Efficiency + 20%
* Coal +8%
* Oil +10%
* Pigs + 15%
* Barracks + 10% each
* Border Fortification + 2% each
* Forward Operating Base + 3% each
* +8% for government types Communist, Democracy, Dictatorship, Federal, and Transitional

#### decomissionSoldiers(*uint256 amount, uint256 id*)

This function will allow a nation ruler to decomission defending soldiers. 

#### buyTanks(*uint256 amount, uint256 id*)

This function will allow a nation owner to buy tanks. This function is only callable by the nation owner of the nation in the id parameter. 

A nation owner cannot purchase more tanks than the max tank count. The cost of the purchase will be spent.

#### getMaxTankCount(*uint256 id*)

Just like soldiers, each nation has a max tank count. The maximum tanks a nation can buy is 10% of soldier efficiency or 8% of citizens whichever is less.

This function returns a max tank count for a given nation.

#### withdrawTanks(*uint256 amountToWithdraw, uint256 id*)

This function is only callable from the war contract and will withdraw deployed tanks after a war expires.

#### decreaseDefendingTankCount(*uint256 amount, uint256 id*)

This function is only callable from the spy operations contract. A sucessful spy operations contract will result in a nation losing tanks.

#### decreaseDefendingTankCountFromCruiseMissileContract(*uint256 amount, uint256 id*)

This function will decrease the tanks after a cruise missile strike. This function is only callable from the cruise missile contract.

#### decreaseDefendingTankCountFromNukeContract(*uint256 id*)

This function is only callable from the nuke contract. When a nation is attacked by a nuke the defending tanks will be reduced by 35% (25% with a fallout shelter system)

#### decreaseDefendingTankCountFromAirBattleContract(*uint256 id, uint256 amountToDecrease*)

This function is only callable from the air battle contract. This function reduces defending tanks when a bombing campaign is conducted.

#### getTankCount(*uint256 id*)

This function returns a queried nations total tank count (dfending + deployed)

#### getDeployedTankCount(*uint256 id*)

This function returns a queried nations deployed tank count.

#### getDefendingTankCount(*uint256 id*)

This function returns a queried nations defending tank count.

#### buySpies(*uint256 amount, uint256 id*)

This function allows a nation owner to buy spies. Only the owner of the nationId in the paramters can call this function.

This function checks that the total spy count is below the max spy count. This will calulate the total cost and spend the balance.

#### updateSpyPrice(*uint256 newCost*)

This function is only callable from the contract owner and will update the cost of a spy.

#### getMaxSpyCount(*uint256 id*)

This function will return a queried nations max spy count.

By default, a nations max spy count is 50. This maximum goes up by 100 for each intel agency a nation owns. The CIA wonder will increase max spy count 250.

#### decreaseAttackerSpyCount(*uint256 id*)

This function will decrease the spy count when a spy attack is unsuccessful. This function can only be called by the spy operations contract.

#### decreaseDefenderSpyCount(*uint256 id*)

This function will decrease a nations spies when they are attacked in a spy attack that reduces spies. This function can only be called from the spy contract.

#### getSpyCount(*uint256 id*)

This function will return a quereied nations spy count.

#### getSpyPrice()

This function will return the spy price from the contract. 

#### decreaseUnits(*uint256 attackerSoldierLosses, uint256 attackerTankLosses, uint256 attackerId, uint256 defenderSoldierLosses, uint256 defenderTankLosses, uint256 defenderId*)

This function will take the results of a ground battle and reduce the corresponding tanks and soldiers. This function is only callable from the ground battle contract.

#### increaseSoldierCasualties(*uint256 id, uint256 amount*)

This function is used in testing to increase the casualties of a nation.

#### getCasualties(*uint256 id*)

This function retuens soldier casualties and tank casualties for a given nation.

```solidity
return (soldierCasualties, tankCasualties);
```

### GroundBattleContract

The GroundBattleContract will allow nations to launch ground attacks against eachother. This contract inherits from Chainlink VRFConsumerBaseV2 and will incorporate randomness in order to determine the winner of battles.

The functions of this contract are as follows:

#### battleOdds(*uint256 _warId, uint256 attackerId*)

This function returns 2 variables given a _warId and an attackerId. The fisrt variable returned is the odds of attacker victory (out of 100) and the second it the odds of defender victory (out of 100)

#### groundAttack(*uint256 warId, uint256 attackerId, uint256 defenderId, uint256 attackType*)

This is the function that launches a ground attack against another nation. The attackers deployed forces to this specific war will attack a defenders forces.

Attack types can be either 1 (planned), 2 (standard), 3 (aggressive) or 4 (berserk). 

This fucntion is only callable from the owner of the attackerId nation. The war must be active in order to proceed.

Attacking forces strength is equal to attacking soldier efficiency + (15 * tanks deployed) +20% for a pentagon + 10% for superior logistical support + 1% for every 100 tanks deployed up to 75% + ((5-DEFCON)*5)%

Defending forces strength is equal to defending soldier efficiency + (17 * tanks defending) +20% for a pentagon + 10% for superior logistical support -5% for each attacking office of propoganda + 1% for every 100 levels of infrastructure up to 75% + ((5-DEFCON)*5)%

This function will finish by calling the fulfillRequest function which will make the call to the VRFCoordinator and request random numbers which will determine the outcome of the battle.

#### fulfillRequest(*uint256 requestId, uint256[] memory randomWords*)

This is the callback function for the random number request. 

The random numbers returned are very long. randomWord[0] will be divided by (attacker battle strength + defender battle strength) and if the remainder is less than the attacker strength the attacker is victorious and if the remainder is greater than attacker strength the defender is victorious.

Losses will vary depending on whether the attack was planned, standard, agressive or berserk. 

Losses will = the following for a ground battle (RN = Random Number):

Planned Attack:
* winnner 
    * 5% of soldiers + RN 0-10
    * 5% of tanks + RN 0-5
* loser
    * 20% of soldeirs + RN 0-10
    * 20% of tanks + RN 0-5

Standard Attack:
* winner
    * 10% of soldeirs + RN 0-10
    * 10% of tanks + RN 0-5
* loser
    * 30% of soldiers + RN 0-15
    * 30% of tanks + RN 0-5

Agressive:
* winner
    * 15% of soldiers + RN 0-15
    * 15% of tanks + RN 0-10
* loser
    * 35% of soldiers + RN 0-20
    * 35% of tanks + RN 0-15

Berserk
* winner
    * 25% of soldiers + RN 0-15
    * 25% of tnaks + RN 0-10
* loser 
    * 45% of soldiers + RN 0-20
    * 45% of tanks + RN 0-15

In the event of an attack victory spoils will be collected as well. Both land an infrastructure will be collected from the loser.

Spoils will be the following for each type of attack (FOB = forward operatin base).

Planned:
* land = 1 + attacker FOB count + RN 0-2
* infrastructure = 1 + attacker FOB count + RN 0-2

Standard:
* land = 2 + attacker FOB count + RN 0-2
* infrastructure = 2 + attacker FOB count + RN 0-2

Agressive:
* land = 3 + attacker FOB count + RN 0-3
* infrastructure = 3 + attacker FOB count + RN 0-3

Berserk:
* land = 4 + attacker FOB count + RN 0-4
* infrastructure = 4 + attacker FOB count + RN 0-4

### SpyOperationsContract

The spy operations contract allows nations to conduct spy operations on each other. The attackerId will be encrypted unless the spy attack is thwarted. This contract uses a combination of ChainlinkVRF randomness and Chainlink external adapters. In order to conduct an attack a nation must first train a spy. The spy attack is paid for when a spy is trained and the training takes place in an encypted manner where the encrypted attackerId and the encrpyted defenderId are sent to en external adapter. On the external adapter they are decrpyted and the attack is paid for. An attack type is selected when the spy is trained.

After a spy is trained the attack can be launched by the attacking nation. The attack process will first make a randomness request. The attack function will have an encrypted attacker Id. When the randomness returns random numbers an second external adapter request will be made in the callback function of the randomness request. The external adapter will decypher the attackerId, determine the strength of the attacker and defender, use randomness to determine a strength based winner and in the event of an attack thwart the decrypted attackerId will be returned on chain. Ifthe attack is sucessful then the attacker will anonymously attack the defender in one of various ways.

The encryption for these functions will include a public, private key pair. The data on the front end will be ebcrypted using a public key. Only the private key can decrypt the data. The external adapter will use the private key to decrypt the data and conduct the spy operation.

The function for this contract are as follows:

#### trainSpy(*uint256 encryptedAttackerId, uint256 encryptedDefenderId, uint256 attackType*)

There are 13 different attack types that can occur. They are as follows:
1. destroy cruise missiles
2. destroy defending tanks
3. capture land
4. change governemnt
5. change religion
6. chenge threat level
7. change defcon
8. destroy spies
9. capture tech
10. sabatoge taxes
11. capture money reserves
12. capture infrastructure
13. destroy nukes

This function will make a call to a chainlink external adapter with the encrpyted payload. On the external adapter the spy attack will be paid for.

The callback function for this external adapter is completeSpyTraining()

#### completeSpyTraining(*uint256 _attackId, bytes encryptedPayload*)

The callback for the first external adapter will have this encrypted payload that will be used to conduct the attack when the attacker decides to conduct the spy operation.

This payload will be stored in a mapping with the gameDay. Trained spies expire after 5 days.

#### conductSpyOperation(*uint256 encryptedAttackerId, uint256 defenderId, uint256 _attackId*)

This function will launch the spy attack after a spy is trained.

The attacker will only need to call the conduct spy operation function. The subsequent function cascade will look like the following:
1. conductSpyOperation()
    * will initiate a request for random words
2. fulfillRequest()
    * will make the request for randomness to the VRFCoordinator
3. fulfillRandomWords()
    * this is the callback for the VRFCoordinator
    * this function will also make a request to the chainlink external adapter
4. Externa adapter offchain
    * use the random numbers to determine if the attack was sucessful 
5. completeSpyAttack()
    * if the attack was sucessful the subsequent function will be called to execute the attack without revealing the attackers identity
6. specific function for attack type
    * details on each funciton below

#### Functions specific to each type of spy operation

1. destroyCruiseMissiles()
    * will destroy between 1-5 cruise missiles determined randomly
2. destroyDefendingTanks() 
    * destroys 1-5% of defending tanks
3. captureLand()
    * destroys 1-10 miles of land
4. changeDesiredGovernment()
    * picks new desired government randomly
5. changeDesiredReligion()
    * picks new religion randomly
6. changeThreatLevel()
    * changes threat level to 1
7. changeDefconLevel()
    * changes DEFCON level to 5
8. destroySpies()
    * will assainate 1-20 spies
9. captureTechnology()
    * will decrease technology 1-5 levels 
10. sabotogeTaxes()
    * randomly assignes tax rate between 20 and 24
    * collection needed for defender to change taxes
11. destroyMoneyReserves()
    * detroys 5% of money reserves up to 1,000,000WB
12. captureInfrastructure()
    * will destroy 1-5 infrastructure
13. destroyNuked()
    * will destroy 1 nuke

### FightersContract

The FightersContract will store the amount if fighter aircraft owned by a nation.

In addition to the below functions there are functions to increase aircraft counts when they are purchased from the marketplace and decrease aircraft count when they are destroyed in battle. These functions are only callable from their respective contracts.

#### generateFighters(*uint256 id*)

This function is only callable from the country minter contract. This instantiates the struct of fighters for each nation.

#### Functons that return a nations aircraft count

1. getYak9Count(*uint256 id*)
2. getP51MustangCount(*uint256 id*)
3. getF86SabreCount(*uint256 id*)
4. getMig15Count(*uint256 id*)
5. getF100SuperSabreCount(*uint256 id*)
6. getF35LightningCount(*uint256 id*)
7. getF15EagleCount(*uint256 id*)
8. getSu30MkiCount(*uint256 id*)
9. getF22RaptoCount(*uint256 id*)

#### Functions that allow a nation owner to scrap aircraft

1. scrapYak9(*uint256 amount, uint256 id*)
2. scrapP51Mustang(*uint256 amount, uint256 id*)
3. scrapF86Sabre(*uint256 amount, uint256 id*)
4. scrapMig15(*uint256 amount, uint256 id*)
5. scrapF100SuperSabre(*uint256 amount, uint256 id*)
6. scrapF35Lightning(*uint256 amount, uint256 id*)
7. scrapF15Eagle(*uint256 amount, uint256 id*)
8. scrapSu30Mki(*uint256 amount, uint256 id*)
9. scrapF22Raptor(*uint256 amount, uint256 id*)

#### getFighterCount(*uint256 id*)

This function will return the number of fighter aircraft a nations owns.

#### getAircraftCount(*uint256 id*)

This function will return the number of total aircraft (fighters and bombers) a nation owns.

### FighterLosses

The only purpose of the fighter losses contract is to decrese the amount of fighters lost in battle. This is done via the following function.

#### decrementLosses(*uint256[] losses, uint256 id*)

This function will loop through all of the indeces of the losses array and decrease the corresponding plane count by 1.

### FightersMarketplace1

This contract is what will allow nation owners to buy the following planes:

1. Yak9s
2. P51 Mustangs
3. F86 Sabre
4. MIG15s
5. F100 Super Sabres

#### Functions to buy planes

The functions to buy planes will check that the total aircraft count is below that max aircraft count for a nation. These functions will also verify that the purchasing nations infrastructure and technology are above the necessary levels foreach plane. The same plane will cost different depnding on the nations modifiers so this function will get and spend the correct amount of money for that specific nation as well. The functions are:

1. buyYak9(*uint256 amount, uint256 id*)
2. buyP51Mustang(*uint256 amount, uint256 id*)
3. buyF86Sabre(*uint256 amount, uint256 id*)
4. buyMig15(*uint256 amount, uint256 id*)
5. buyF100SuperSabre(*uint256 amount, uint256 id*)

#### getAircraftPurchaseModifier(*uint256 id*)

There are several factors of a nation that will bring down the cost of aircraft. This function will determine the cost asjustment for each nation. The adjustments are as follows:

1. Aluminium -8%
2. Oil -4%
3. Rubber -4%
4. Airports -2% each
5. Space Program -5%

#### getMaxAircraftCount(*uint256 id*)

This function will return the max aircraft count for a given nation.

By default, the max aircraft count for a nation is 50. This number goes up according to the following parameters:

* Construction + 10
* Foreign Air Foirce Base + 20
* + 5 per Aircraft Carrier

### FightersMarketplace2

The FightersMArketplace2 contract is where a nation owner can purchase the following planes:

1. F35 Lightnings
2. F15 Eagles
3. SU30 MKIs
4. F22 Raptors

#### Functions to buy planes

The functions to buy planes will check that the total aircraft count is below that max aircraft count for a nation. These functions will also verify that the purchasing nations infrastructure and technology are above the necessary levels foreach plane. The same plane will cost different depnding on the nations modifiers so this function will get and spend the correct amount of money for that specific nation as well. The functions are:

1. buyF35Lightning(*uint256 amount, uint256 id*)
2. buyF15Eagle(*uint256 amount, uint256 id*)
3. buySu30Mki(*uint256 amount, uint256 id*)
4. buyF22Raptor(*uint256 amount, uint256 id*)

### BombersContract

The BombersContract will store the amount if bomber aircraft owned by a nation.

In addition to the below functions there are functions to increase aircraft counts when they are purchased from the marketplace and decrease aircraft count when they are destroyed in battle. These functions are only callable from their respective contracts.

#### generateBombers(*uint256 id*)

This function is only callable from the country minter contract. This instantiates the struct of bombers for each nation.

#### Functons that return a nations aircraft count

1. getAh1CobraCount(*uint256 id*)
2. getAh64ApacheCount(*uint256 id*)
3. getBristolBlenheimCount(*uint256 id*)
4. getB52MitchellCount(*uint256 id*)
5. getB17gFlyingFortressCount(*uint256 id*)
6. getB52StratofortressCount(*uint256 id*)
7. getB2SpiritCount(*uint256 id*)
8. getB1bLancerCount(*uint256 id*)
9. getTupolevTu160Count(*uint256 id*)

#### Functions that allow a nation owner to scrap aircraft

1. scrapAh1Cobra(*uint256 amount, uint256 id*)
2. scrapAh64Apache(*uint256 amount, uint256 id*)
3. scrapBristolBlenheim(*uint256 amount, uint256 id*)
4. scrapB52Mitchell(*uint256 amount, uint256 id*)
5. scrapB17gFlyingFortress(*uint256 amount, uint256 id*)
6. scrapB52Stratofortress(*uint256 amount, uint256 id*)
7. scrapB2Spirit(*uint256 amount, uint256 id*)
8. scrapB1bLancer(*uint256 amount, uint256 id*)
9. scrapTupolevTu160(*uint256 amount, uint256 id*)

#### getBomberCount(*uint256 id*)

This function will return the number of bomber aircraft a nations owns.

#### decrementBomberLosses(*uint256[] memory losses, uint256 id*)

This function will loop through all of the indeces of the losses array and decrease the corresponding plane count by 1.

### BomberMarketplace1

This contract is what will allow nation owners to buy the following planes:

1. AH1 Cobra
2. AH64 Apache
3. Bristol Blenheim
4. B52 Mitchell
5. B17G Flying Fortress

#### Functions to buy planes

The functions to buy planes will check that the total aircraft count is below that max aircraft count for a nation. These functions will also verify that the purchasing nations infrastructure and technology are above the necessary levels foreach plane. The same plane will cost different depnding on the nations modifiers so this function will get and spend the correct amount of money for that specific nation as well. The functions are:

1. buyAh1Cobra(*uint256 amount, uint256 id*)
2. buyAh64Apache(*uint256 amount, uint256 id*)
3. buyBristolBlenheim(*uint256 amount, uint256 id*)
4. buyB52Mitchell(*uint256 amount, uint256 id*)
5. buyB17gFlyingFortress(*uint256 amount, uint256 id*)

### BomberMarketplace2

This contract is what will allow nation owners to buy the following planes:

1. B52 Stratofortress
2. B2 Spirit
3. B1B Lancer
4. Tupolev TU 160

#### Functions to buy planes

The functions to buy planes will check that the total aircraft count is below that max aircraft count for a nation. These functions will also verify that the purchasing nations infrastructure and technology are above the necessary levels foreach plane. The same plane will cost different depnding on the nations modifiers so this function will get and spend the correct amount of money for that specific nation as well. The functions are:

1. buyB52Stratofortress(*uint256 amount, uint256 id*)
2. buyB2Spirit(*uint256 amount, uint256 id*)
3. buyB1bLancer(*uint256 amount, uint256 id*)
4. buyTupolevTu160(*uint256 amount, uint256 id*)

### AirBattleContract

The AirBattleContract will allow one nation to launch an air assault on another nation. This contract uses ChainlinkVRF and Chainlink external adapters to accomplish this. Chainlink VRF randomness will be used to determine the outcome of individual dogfights. The random numbers are sent to the external adapter with information on each nations airforce. The results of the air assault are calculated off chain as this process is gas intensive and would reuqire a large amount of compute if done on chain.

The functions for the air battle contract are as follows:

#### airBattle(*uint256 warId, uint256 attackerId, uint256 defenderId, uint256[] memory attackerFighterArray, uint256 memory attackerBomberArray*)

This is the function a nation owner can call to launch a sortie. The caller of this function needs to be the owner of the attackerId nation. The 2 nations need to be at war as well. An attacker cannot launch more than 25 planes at a time on a sortie. This function also verifies that the attaker has the necessary planes that are included in the attackerFighterArray and attackerBomberArray. An attacker will send any combination of fighters and bombers to raid another nation. The defender will automatically use up to 25 fighters to defend against the onslaught. The 25 strongest defending fighters will be used. 

When this function completes it will call fulfillRequest will send a request for randomness to the VRFCoordinator. The callback function will be fulfillRandomWords.

#### fulfillRandomWords(*uint256 requestId, uint256[] memory randomWords*)

This function runs automatically when the callback is recieved from the VRF Coordinator. This function will in turn send a request to an external adapter including the defender fighters, attacker fighters, attacker bombers and the random numbers. The battle results will be returned from the external adapter to the completeAirBattle() function.

#### completeAirBattle(*uint256[] memory attackerFighterCasualties, uint256[] memory attackerBomberCasualties, uint256[] memory defenderFighterCasualties, uint256 attackerId, uint256 defenderId, uint256 infrastructureDamage, uint256 tankDamage, uint256 cruiseMissileDamage*)

This function takes the returned results from the external adapter and will decrement the correspoinding losses for each nations aircraft and also reduce the reduce the defenders infrastructure, tanks and cruise missiles if there is any damage from bombers.

### MissilesContract

This contract will allow a nation owner to purchase cruise missiles and nukes. This contract inherits from openzeppelin's ownable contract.

The functions for this contract are as follows:

#### generateMissiles(*uint256 id*)

This function is only callable from the country minter contract and will instantiate the struct for each nation that will keep track of a nations cruise missiles and nukes.

#### buyCruiseMissiles(*uint256 amount, uint256 id*)

This function will allow a nation owner to purchase cruise missiles. The caller of this function must be the owner of the nation in the id parameter.

In order to purchase nukes a nation must have more than 15 technology. Cruise missiles cost a default of 20,000 WB each.

#### updateCruiseMissileCost(*uint256 newPrice*)

This function is only callable from the contract owner and will update the cruise missile default cost.

#### getCruiseMissileCost(*uint256 id*)

This function will return the cruise missile cost for a given nation. The default cost for a cruise missile is 20,000 WB. This cost is adjusted in the following way:

1. -5% per factory
2. -20% with lead

#### getCruiseMissileCount(*uint256 id*)

This function will return a given nations cruise missile count.

#### decreaseCruiseMissileCount(*uint256 amount, uint256 id*)

This function is only callable from the spy operation contact and will reduce a nations cruise missiles upon the completion of a successful spy operation.

#### decreaseCruiseMissileCountFromNukeContract(*uint256 id*)

This function will decrease a nations cruise missiles upon a successful strike. By default the percentage of cruise missiles that will be destroyed when a nuke strikes is 35%. If a nation has a fallout shelter this percentage is reduced to 25%.

#### buyNukes(*uint256 id*)

This function will allow a nation owner to purchase nukes. The caller of this function must be the owner of the nation in the id parameter. In order to purchase nukes a nation must have 75 technology and 1000 infrastructure. The nation must also have access to the uranium resorce. The nation must also have a strength of 150,000 or have a manhattan project. Nukes can only be purchase one at a time and only one nuke can be purchased a day. If a nation has a weapons research center they can purchase 2 nukes per day.

#### getNukeCost(*uint256 id*)

By default nukes cost 500,000 WB. Each additonal nuke purchased will cost an aditioanl 50,000 based on how many nuked the nation posesses already. Lead reduces nuke purchase cost 20%.

#### updateDefaultNukePurchaseCost(*uint256 newCost*)

This function allows the contact owner to update the default nuke purchase cost.

#### getDefaultNukeCost()

This function retruns the default nuke purchase cost.

#### getNukesPurchaedToday(*uint256 id*)

This function will return a nations nukes purchased for the current day.

#### getNukeCount(*uint256 id*)

This function will return a nations current nuke count.

#### decreseNukeCountFromNukeContract(*uint256 id*)

This function will decrese a natons nuke count when a nuke is launched. This function can only be called from the nuke contact.

#### decreaseNukeCountFromSpyContract(*uint256 id*)

This function will decrease a nations nuke count by 1 when they are attacked by a spy successfully. If a nation has a hidden nuclear missile silo then there will be 5 nukes that a nation can secretly have wothout being destroyed.

### NukeContract

The NukeContract allows a nation to launch a nuke attack at another nation. This contact inherits form Chainlink's VRF and will incorporate randomness in order to determine whether a nuke attack is successfull or thwarted. 

THe functions for this contact are as follows:

#### launchNuke(*uint256 warId, uint256 attackerId, uint256 defenderId, uint256 attackType*)

This function will launch a nuke at another nation. The caller of this function must be the owner of the nation in the attackerId parameter. The two nations must be engaged in an active war. The nuke cannot be launched on the same day a war breaks out. 

If a nation has an emp weaponization wonder it can launch attacks on a nations land (attackType = 3), tech (attackType = 4) or infrastructure (attackType = 2). Otherwise the attack type will have to be 1 for a standard attack. A nation will also need to have 5,000 tech to launch targeted nuke strike with the EMP wonder.

When this function finishes running it will call the fulfill request function and send a request to the VRFCoordinator for random numbers.

This will callback to the filfillRandomWords() function.

#### fulfillRandomWords(*uint256 requestId, uint256[] memory randomWords*)

This callback will calulate a nations odds of thwarting a nuclear attack. The random number is divided by 100 and if the remainder is greater than the thwart odds the nuke attack is successful. Otherwise the nuke attack is thwarted.

#### getThwartOdds(*uint256 attackerId, uint256 defendrId*)

The default thwart odds of a nuke attack are 50%. These odd are adjusted in the following way:

* +20% if the defender has a strategic defense initiative
* +5% for each defendr missile defense
* -5% for each attacker satellite

#### inflictNukeDamage(*uint256 attackId*)

This function will be called upon a sucessful nuke attack and route the type of attack to the appropriate function. A standard attack will call standardAttack(), an infrastructure attack will call infrastructureAttack(), a land attack will call landAttack() and a technology attack will call technologyAttack().

#### calcualteNukesLandedLastSevenDays()

This function will calulate the global nukes landed over the last 7 game days. The sum of nuke strikes in that time will be used to calulate global radiation levels when environment scores are calculated.

#### getGlobalRadiation()

This function will calculate and return the global radiation level. Global radiation is calulated in the following way:

```solidity
uint256 globalRadiation = ((nukesLandedLast7Days * mod) / countries);
```
The modifier here is by default set to 50 but can be adjusted as more nations come online.

#### updateGlobalRadiationModifier(*uint256 newModifier*)

The modifier is by default 50. However, this can be adjusted up or down as the game scales. This function is only callable by the contract owner.

### CruiseMissileContract

The CruiseMissileContract will allow a nation to launch a cruise missile attack at another nation.

The functions in this contrat are as follows:

#### launchCruiseMissileAttack(*uint256 attackerId, uint256 defenerId, uint256 warId*)

This function is only callable from the owner of the nation of the attackerId parameter.

The attacker must have a cruise missile to launch for this function to proceed. The two nations must be engaged in an active war.

Once this function is called the fulfillRequest() function is called which will create request for random numbers and send it to the VRF Coordinator.

#### fulfillRandomWords(*uint256 requestId, uint256[] memory randomWords*)

This function will complete the attack sequence. The odds of a sucessful launch are calulated. Then one of the random numbers are divided by 100 and if the remainder is less than the success odds the missile launch is a hit otherwise it is a thwart.

A second random number is used to determine the results. At random, a cruise missile can destroy tanks, tech or infrastructure. If a defending nation does not have tanks then the infrastructure will be targeted if the missile was going to target tanks.

#### destroyTanks(*uint256 attackId*)

A tank attack will randomly destory between 10 and 15 tanks. There will be an additional tank destroyed for each munitions facotry the attacker has. Each defender bunker will reduce the random tank count by 1.

#### destroyTech(*uint256 attackId*)

A tech attack will destroy by default 6 levels of tech. This number will be increased by the attackers munitions factories and decreases by the defenders bunkers.

#### destroyInfrastructure(*uint256 attackId*)

A infrastructure attack will destroy by default 6 levels of infrastructure. This number will be increased by a random number between 0 and 5. Each attacker munitions factore will increase the levels destroyed by 1. Each defender bunker will decrease the levels destroyed by 1.

### Navy

### NavyBattle

