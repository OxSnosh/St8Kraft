//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WondersContract is Ownable {
    uint256 private wondersId;
    address public treasuryAddress;
    uint256 public agricultureDevelopmentCost = 30000000;
    uint256 public antiAirDefenseNetworkCost = 50000000;
    uint256 public centralIntelligenceAgencyCost = 40000000;
    uint256 public disasterReliefAgencyCost = 40000000;
    uint256 public empWeaponizationCost = 200000000;
    uint256 public falloutShelterSystemCost = 40000000;
    uint256 public federalAidCommissionCost = 25000000;
    uint256 public federalReserveCost = 100000000;
    uint256 public foreignAirForceBaseCost = 35000000;
    uint256 public foreignArmyBaseCost = 200000000;
    uint256 public foreignNavalBaseCost = 200000000;
    uint256 public greatMonumentCost = 35000000;
    uint256 public greatTempleCost = 35000000;
    uint256 public greatUniversityCost = 35000000;
    uint256 public hiddenNuclearMissileSiloCost = 30000000;
    uint256 public interceptorMissileSystemCost = 50000000;
    uint256 public internetCost = 35000000;
    uint256 public interstateSystemCost = 45000000;
    uint256 public manhattanProjectCost = 100000000;
    uint256 public marsBaseCost = 100000000;
    uint256 public marsColonyCost = 100000000;
    uint256 public marsMineCost = 100000000;
    uint256 public miningIndustryConsortiumCost = 25000000;
    uint256 public moonBaseCost = 50000000;
    uint256 public moonColonyCost = 50000000;
    uint256 public moonMineCost = 50000000;
    uint256 public movieIndustryCost = 26000000;
    uint256 public nationalCemetaryCost = 150000000;
    uint256 public nationalEnvironmentOfficeCost = 100000000;
    uint256 public nationalResearchLabCost = 35000000;
    uint256 public nationalWarMemorialCost = 27000000;
    uint256 public nuclearPowerPlantCost = 75000000;
    uint256 public pentagonCost = 30000000;
    uint256 public politicalLobbyistsCost = 50000000;
    uint256 public scientificDevelopmentCenterCost = 150000000;
    uint256 public socialSecuritySystemCost = 40000000;
    uint256 public spaceProgramCost = 30000000;
    uint256 public stockMarketCost = 30000000;
    uint256 public strategicDefenseInitiativeCost = 75000000;
    uint256 public superiorLogisticalSupportCost = 80000000;
    uint256 public universalHealthcareCost = 100000000;
    uint256 public weaponsResearchCenterCost = 150000000;

    struct Wonders1 {
        uint256 wonderCount;
        //Agriculture Development Program
        //$30,000,000
        //Increases land size by 15%
        //Increases citizen income +$2.00,
        //Increases the citizen-bonus for land from 0.2 to 0.5.
        //Requires 3,000 land purchased, 500 technology.
        bool agricultureDevelopmentProgram;
        //Anti-Air Defense Network
        //$50,000,000
        //Reduces odds of incoming aircraft attacks against your nation -25%.
        //Reduces aircraft attack damages against your nation -10%.
        bool antiAirDefenseNetwork;
        //Central Intelligence Agency
        //$40,000,000
        //Increases the number of spies that your nation can support +250 and
        //increases your nation's spy attack strength +10%.
        //Only viewable by the user who owns it.
        bool centralIntelligenceAgency;
        //Disaster Relief Agency
        //$40,000,000
        //The disaster relief agency helps restore your nation and its people after emergency situations
        //Increases population +3%
        //and opens one extra foreign aid slot.
        bool disasterReliefAgency;
        //EMP Weaponization
        //$200,000,000 + (Nation Strength * 2,000)
        //Provides attackers with 5,000 or more technology the option to launch a targeted EMP nuclear attack.
        //Nuclear weapons can target higher infrastructure, higher land, or higher technology damage based on player choice when launching nukes.
        //When you choose to target infrastructure, land, or technology you are trading more damage to your target for less damage for the other two.
        //For instance, if you choose to target infrastructure you will do more base damage to infrastructure but less damage to land and technology.
        //Requires 5,000 technology and a Weapons Research Complex to purchase.
        bool empWeaponization;
        //Fallout Shelter System
        //$40,000,000
        //Allows 50% of your defending soldiers to survive a nuclear strike
        //(Does not prevent nuclear Anarchy but does prevent troops from being totally depleted),
        //Reduces tank, cruise missile, and aircraft, losses from a nuclear strike by -25%,
        //Reduces nuclear vulnerable navy losses by 12%,
        //Reduces nuclear anarchy effects by 1 day.
        //Requires 6,000 infrastructure, 2,000 technology.
        bool falloutShelterSystem;
        //Federal Aid Commission
        //$25,000,000
        //Raises the cap on foreign money aid +50% provided that the foreign aid recipient also has a Federal Aid Commission wonder.
        //Allows two nations with the Federal Aid Commission wonder to send secret foreign aid.
        //Secret foreign aid costs the sender 200% the value of the items that are sent.
        bool federalAidCommission;
        //Federal Reserve
        //$100,000,000 + (Nation Strength * 1,000)
        //Increases the number of banks that can be purchased +2.
        //Requires Stock Market.
        bool federalReserve;
        //Foreign Air Force Base -
        //$35,000,000 -
        //Raises the aircraft limit +20 for your nation and
        //increases the number of aircraft that can be sent in each attack mission +20.
        bool foreignAirForceBase;
        //Foreign Army Base -
        //$200,000,000 -
        //Adds an extra +1 offensive war slot.
        //Requires 8,000 technology to purchase.
        bool foreignArmyBase;
        //Foreign Naval Base -
        //$200,000,000 -
        //Allows +2 naval vessels to be purchased per day (+1 in Peace Mode)
        //and also allows +1 naval deployment per day.
        //Requires 20,000 infrastructure.
        bool foreignNavalBase;
    }

    struct Wonders2 {
        //Great Monument -
        //$35,000,000 -
        //The great monument is a testament to your great leadership.
        //Increases happiness +4 and your population will always be happy with your government choice.
        bool greatMonument;
        //Great Temple -
        //$35,000,000 -
        //The great temple is a dedicated shrine to your national religion.
        //Increases happiness +5 and your population will always be happy with your religion choice.
        bool greatTemple;
        //Great University -
        //$35,000,000 -
        //The great university is a central location for scholars within your nation.
        //Decreases technology costs -10% and
        //increases population happiness +.2% (+2 for every 1000) of your nation's technology level over 200 up to 3,000 tech.
        bool greatUniversity;
        //Hidden Nuclear Missile Silo -
        //$30,000,000 -
        //Allows your nation to develop +5 nuclear missiles that cannot be destroyed in spy attacks.
        //(Nations must first be nuclear capable in order to purchase nukes.)
        bool hiddenNuclearMissileSilo;
        //Interceptor Missile System (IMS) -
        //$50,000,000 -
        //Thwarts Cruise Missile Attacks, 50% of the time (removes 1 attackers CM strike chance for that day when successful).
        //Requires 5,000 technology and a Strategic Defense Initiative (SDI).
        bool interceptorMissileSystem;
        //Internet -
        //$35,000,000 -
        //Provides Internet infrastructure throughout your nation.
        //Increases population happiness +5.
        bool internet;
        //Interstate System -
        //$45,000,000 -
        //The interstate system allows goods and materials to be transported throughout your nation with greater ease.
        //Decreases initial infrastructure cost -8% and
        //decreases infrastructure upkeep costs -8%.
        bool interstateSystem;
        //Manhattan Project -
        //$100,000,000 -
        //The Manhattan Project allows nations below 5% of the top nations in the game to develop nuclear weapons.
        //The Manhattan Project cannot be destroyed once it is created.
        //The wonder requires 3,000 infrastructure, 300 technology, and a uranium resource.
        bool manhattanProject;
        //Mars Base -
        //$100,000,000 + (6,000 * (Nation Strength - (Technology Purchased * 2))) -
        //Reduces infrastructure cost and bills -3%.
        //Provides a gradually increasing happiness bonus that peaks at +6 happiness at the end of the life of the wonder.
        //Expires at 1,200 days.
        //Cannot build Moon wonders if you build Mars wonders.
        //Requires Space Program.
        bool marsBase;
        //Mars Colony -
        //$100,000,000 + (5,000 * (Nation Strength - (Technology Purchased * 2))) -
        //Stores 5% of citizen count at time of purchase.
        //Provides a gradually increasing happiness bonus that peaks at +4 happiness at the end of the life of the wonder.
        //Expires at 900 days.
        //Relocating your Mars Colony gives you the option to reset the stored citizen count based on your current citizen population for a fee.
        //Cannot build Moon wonders if you build Mars wonders.
        //Requires Space Program and Mars Base.
        bool marsColony;
        //Mars Mine -
        //$100,000,000 + (5,000 * (Nation Strength - (Technology Purchased * 2))) -
        //Provides access to a randomly selected bonus resource of Basalt, Sodium, Magnesium, or Potassium.
        //Provides a gradually increasing happiness bonus that peaks at +4 happiness at the end of the life of the wonder.
        //Expires at 900 days.
        //Relocating your Mars Mine gives you the option to randomly select a new Mars resource for a fee.
        //Cannot build Moon wonders if you build Mars wonders.
        //Requires Space Program and Mars Base.
        bool marsMine;
        //Mining Industry Consortium -
        //$25,000,000 -
        //Increases population income by $2.00 for the resources Coal, Lead, Oil, Uranium that your nation has access to.
        //Requires 5,000 infrastructure, 3,000 land purchased, 1,000 technology.
        bool miningIndustryConsortium;
    }

    struct Wonders3 {
        //Moon Base -
        //$50,000,000 + (3,000 * (Nation Strength - (Technology Purchased * 2))) -
        //Reduces infrastructure cost and bills -4%.
        //Provides +5 happiness that degrades over the life of the wonder.
        //Expires at 600 days.
        //Cannot build Mars wonders if you build Moon wonders.
        //Requires Space Program.
        bool moonBase;
        //Moon Colony -
        //$50,000,000 + (2,500 * (Nation Strength - (Technology Purchased * 2))) -
        //Stores 6% of citizen count at time of purchase.
        //Provides +3 happiness that degrades over the life of the wonder.
        //Expires at 450 days.
        //Relocating your Moon Colony gives you the option to reset the stored citizen count based on your current citizen population for a fee.
        //Cannot build Mars wonders if you build Moon wonders.
        //Requires Space Program and Moon Base.
        bool moonColony;
        //Moon Mine -
        //$50,000,000 + (2,500 * (Nation Strength - (Technology Purchased * 2))) -
        //Provides access to a randomly selected bonus resource of Silicon, Titanium, Radon, or Calcium.
        //Provides +3 happiness that degrades over the life of the wonder.
        //Expires at 450 days.
        //Relocating your Moon Mine gives you the option to randomly select a new Moon resource for a fee.
        //Cannot build Mars wonders if you build Moon wonders.
        //Requires Space Program and Moon Base.
        bool moonMine;
        //Movie Industry -
        //$26,000,000 -
        //The movie industry provides a great source of entertainment to your people.
        //Increases population happiness +3.
        bool movieIndustry;
        //National Cemetery -
        //$150,000,000 -
        //Provides +0.20 Happiness per 1,000,000 soldier casualties up to +5 happiness.
        //Requires 5 million soldier casualties and a National War Memorial.
        bool nationalCemetary;
        //National Environment Office -
        //$100,000,000 -
        //The national environment office removes the penalties for Coal, Oil, and Uranium,
        //improves environment by 1 point,
        //increases population +3%,
        //and reduces infrastructure upkeep -3%.
        //Requires 13,000 infrastructure.
        bool nationalEnvironmentOffice;
        //National Research Lab -
        //$35,000,000 -
        //The national research lab is a central location for scientists seeking cures for common diseases among your population.
        //Increases population +5% and
        //decreases technology costs -3%.
        bool nationalResearchLab;
        //National War Memorial -
        //$27,000,000 -
        //The war memorial allows your citizens to remember its fallen soldiers.
        //This wonder is only available to nations that have lost over 50,000 soldiers during war throughout the life of your nation.
        //Increases population happiness +4.
        bool nationalWarMemorial;
        //Nuclear Power Plant -
        //$75,000,000 -
        //The nuclear power plant allows nations to receive Uranium financial bonus
        //(+$3 citizen income +$0.15 per technology level up to 30 technology levels. Requires an active Uranium trade.)
        //even when maintaining nuclear weaponry.
        //The nuclear power plant by itself, even without a Uranium trade, reduces infrastructure upkeep -5%, national wonder upkeep -5%, and improvement upkeep -5%.
        //Requires 12,000 infrastructure, 1,000 technology, and a Uranium resource to build.
        //Nations that develop the Nuclear Power Plant must keep their government position on nuclear weapons set to option 2 or 3.
        bool nuclearPowerPlant;
        //Pentagon -
        //$30,000,000 -
        //The Pentagon serves as your nation's headquarters for military operations.
        //Increases attacking and defending ground battle strength +20%.
        bool pentagon;
        //Political Lobbyists -
        //$50,000,000 -
        //Your vote counts as two votes in your team's senate.
        //Must be re-purchased every time you switch teams.
        bool politicalLobbyists;
        //Scientific Development Center -
        //$150,000,000 -
        //The scientific development center increases the productivity of your factories from -8% infrastructure cost to -10% infrastructure cost,
        //increases the productivity of your universities from +8% citizen income to +10% citizen income,
        //allows the Great University to give its technology happiness bonus up to 5,000 technology levels
        //(+2 happiness each 1,000 technology levels).
        //Requires 14,000 infrastructure, 3,000 technology, Great University, National Research Lab.
        bool scientificDevelopmentCenter;
    }

    struct Wonders4 {
        //Social Security System -
        //$40,000,000-
        //The social security system provides benefits to aging members of your nation.
        //Allows you to raise taxes above 28% up to 30% without additional happiness penalties.
        bool socialSecuritySystem;
        //Space Program -
        //$30,000,000 -
        //The space program sends your astronauts to the moon and beyond.
        //Increases happiness +3, lowers technology cost -3% and lowers aircraft cost -5%.
        bool spaceProgram;
        //Stock Market -
        //$30,000,000 -
        //The stock market provides a boost to your economy.
        //Increases citizen income +$10.00
        bool stockMarket;
        //Strategic Defense Initiative (SDI) -
        //$75,000,000 -
        //Reduces odds of a successful nuclear attack against your nation by 60%.
        //The SDI wonder also requires 3 satellites and 3 missile defenses
        //and those satellites and missile defenses cannot be deleted once the wonder is developed.
        bool strategicDefenseInitiative;
        //Superior Logistical Support -
        //$80,000,000 -
        //Provides supplies more efficiently to your nation's military.
        //Reduces Aircraft and Naval Maintenance Cost by -10% and
        //Tank Maintenance Cost by -5%.
        //Increases attacking and defending ground battle strength +10%.
        //Requires Pentagon.
        bool superiorLogisticalSupport;
        //Universal Health Care -
        //$100,000,000 -
        //A Universal Health Care program increases population +3% and increases population happiness +2.
        //Requires 11,000 infrastructure, Hospital, National Research Lab.
        bool universalHealthcare;
        //Weapons Research Complex -
        //$150,000,000 -
        //Increases the technology bonus to damage from 0.01% to 0.02% per technology level,
        //Increases the number of nukes that can be purchased per day to 2,
        //hurts environment by +1,
        //Increases the purchase costs of all military by 0.01% per technology level.
        //Requires 8,500 infrastructure, 2,000 technology, National Research Lab, Pentagon Wonder.
        bool weaponsResearchCenter;
    }

    mapping(uint256 => Wonders1) public idToWonders1;
    mapping(uint256 => Wonders2) public idToWonders2;
    mapping(uint256 => Wonders3) public idToWonders3;
    mapping(uint256 => Wonders4) public idToWonders4;
    mapping(uint256 => address) public idToOwnerWonders;

    constructor(address _treasuryAddress) {
        treasuryAddress = _treasuryAddress;
    }

    function generateWonders() public {
        Wonders1 memory newWonders1 = Wonders1(
            0,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        );
        Wonders2 memory newWonders2 = Wonders2(
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        );
        Wonders3 memory newWonders3 = Wonders3(
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        );
        Wonders4 memory newWonders4 = Wonders4(
            false,
            false,
            false,
            false,
            false,
            false,
            false
        );
        idToWonders1[wondersId] = newWonders1;
        idToWonders2[wondersId] = newWonders2;
        idToWonders3[wondersId] = newWonders3;
        idToWonders4[wondersId] = newWonders4;
        idToOwnerWonders[wondersId] = msg.sender;
        wondersId++;
    }
}
