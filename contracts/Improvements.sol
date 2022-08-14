//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract ImprovementsContract {
    uint256 private improvementsId;

    struct Improvements1 {
        //Airport
        //$100,000
        //reduces aircraft cost -2%
        //reduces aircraft upkeep cost -2%
        //Limit 3
        int256 airportCount;
        //Bank
        //$100,000
        //population income +7%
        int256 bankCount;
        //Barracks
        //$50,000
        //increases soldier efficiency +10%
        //reduces soldier upkeep -10%
        int256 barracksCount;
        //Border Fortifications
        //$125,000
        //Raises effectiveness of defending soldiers +2%
        //reduces max deployment -2%
        //Requires maintaining a border wall for each Border Fortification
        //Limit 3
        //Cannot own if forward operating base is owned
        //Collection required to delete
        int256 borderFortificationCount;
        //Border Walls
        //$60,000
        //Decreases citizen count by -2%
        //increases population happiness +2,
        //Improves environment +1
        //Reduces the number of criminals in a nation 1% for each Border Wall.
        //Border Walls may only be purchased one at a time.
        int256 borderWallCount;
        //Bunker
        //$200,000
        //Reduces infrastructure damage from aircraft, cruise missiles, and nukes -3%
        //Requires maintaining a Barracks for each Bunker.
        //Limit 5
        //Cannot build if Munitions Factory or Forward Operating Base is owned.
        //Collection required to delete
        int256 bunkerCount;
        //Casino
        //$100,000
        //Increases happiness by 1.5,
        //decreases citizen income by 1%
        //-25 to crime prevention score.
        //Limit 2.
        int256 casinoCount;
        //Church
        //$40,000
        //Increases population happiness +1.
        int256 churchCount;
        //Clinic
        //$50,000
        //Increases population count by 2%
        //Purchasing 2 or more clinics allows you to purchase hospitals.
        //This improvement may not be destroyed if it is supporting a hospital until the hospital is first destroyed.
        int256 clinicCount;
        //Drydock
        //$100,000
        //Allows nations to build and maintain navy Corvettes, Battleships, Cruisers, and Destroyers
        //Increases the number of each of these types of ships that a nation can support +1.
        //This improvement may not be destroyed if it is supporting navy vessels until those navy vessels are first destroyed.
        //requires Harbor
        int256 drydockCount;
        //Factory
        //$150,000
        //Decreases cost of cruise missiles -5%
        //decreases tank cost -10%,
        //reduces initial infrastructure purchase cost -8%.
        int256 factoryCount;
        //Foreign Ministry
        //$120,000
        //Increases population income by 5%
        //Opens +1 extra foreign aid slot.
        //Limit one foreign ministry per nation
        int256 foreignMinistryCount;
    }

    struct Improvements2 {
        //Forward Operating Base
        //$125,000
        //Increases ground attack damage 5%,
        //Reduces effectiveness of one's own defending soldiers -3%.
        //Requires maintaining a Barracks for each Forward Operating Base.
        //Limit 2.
        //Cannot own if Border Fortifications or Bunker is owned.
        //Collection required to delete.
        int256 forwardOperatingBaseCount;
        //Guerilla Camp
        //$20,000
        //Increases soldier efficiency +35%,
        //reduces soldier upkeep cost -10%
        //reduces citizen income -8%.
        int256 guerillaCampCount;
        //Harbor
        //$200,000
        //Increases population income by 1%.
        //Opens +1 extra trade slot
        //Limit one harbor per nation.
        //This improvement may not be destroyed if it is supporting trade agreements or navy vessels until those trade agreements and navy vessels are first removed.
        int256 harborCount;
        //Hospital
        //$180,000
        //Increases population count by 6%.
        //Need 2 clinics for a hospital.
        //Limit one hospital per nation.
        //Nations must retain at least one hospital if that nation owns a Universal Health Care wonder.
        int256 hospitalCount;
        //Intelligence Agency
        //$38,500
        //Increases happiness for tax rates greater than 23% +1
        //Each Intelligence Agency allows nations to purchase + 100 spies
        //This improvement may not be destroyed if it is supporting spies until those spies are first destroyed.
        int256 intelligenceAgencyCount;
        //Jail
        //$25,000
        //Incarcerates up to 500 criminals
        //Limit 5
        int256 jailCount;
        //Labor Camp
        //$150,000
        //Reduces infrastructure upkeep costs -10%
        //reduces population happiness -1.
        //Incarcerates up to 200 criminals per Labor Camp.
        int256 laborCampCount;
        //Missile Defense
        //$90,000
        //Reduces effectiveness of incoming cruise missiles used against your nation -10%.
        //Nations must retain at least three missile defenses if that nation owns a Strategic Defense Initiative wonder.
        int256 missileDefense;
        //MunitionsFactory
        //$200,000
        //Increases enemy infrastructure damage from your aircraft, cruise missiles, and nukes +3%
        //+0.3 penalty to environment per Munitions Factory.
        //Requires maintaining 3 or more Factories.
        //Requires having Lead as a resource to purchase.
        //Limit 5.
        //Cannot build if Bunkers owned.
        //Collection required to delete.
        int256 munitionsFactorCount;
        //Naval Academy
        //$300,000
        //Increases both attacking and defending navy vessel strength +1.
        //Limit 2 per nation.
        //Requires Harbor.
        int256 navalAcademtCount;
        //Naval Construction Yard
        //$300,000
        //Increases the daily purchase limit for navy vessels +1.
        //Your nation must have pre-existing navy support capabilities (via Drydocks and Shipyards) to actually purchase navy vessels.
        //Limit 3 per nation.
        //requires Harbor
        int256 navalConstructionYardCount;
        //Office of Propoganda
        //$200,000
        //Decreases the effectiveness of enemy defending soldiers 3%.
        //Requires maintaining a Forward Operating Base for each Office of Propaganda
        //Limit 2
        //Collection required to delete.
        int256 officeOfPropagandaCount;
    }

    struct Improvements3 {
        //Police Headquarters
        //$75,000
        //Increases population happiness +2.
        int256 policeHeadquartersCount;
        //Prison
        //$200,000
        //Incarcerates up to 5,000 criminals.
        //Limit 5
        int256 prisonCount;
        //RadiationContainmentChamber
        //$200,000
        //Lowers global radiation level that affects your nation by 20%.
        //Requires maintaining Radiation Cleanup bonus resource to function
        //Requires maintaining a Bunker for each Radiation Containment Chamber.
        //Limit 2.
        //Collection required to delete.
        int256 radiationContainmentChamberCount;
        //RedLightDistrict
        //$50,000
        //Increases happiness by 1,
        //penalizes environment by 0.5,
        //-25 to crime prevention score
        //Limit 2
        int256 redLightDistrictCount;
        //Rehabilitation Facility
        //$500,000
        //Sends up to 500 criminals back into the citizen count
        //Limit 5
        int256 rehabilitationFacilityCount;
        //Satellite
        //$90,000
        //Increases effectiveness of cruise missiles used by your nation +10%.
        //Nations must retain at least three satellites if that nation owns a Strategic Defense Initiative wonder
        int256 satelliteCount;
        //School
        //$85,000
        //Increases population income by 5%
        //increases literacy rate +1%
        //Purchasing 3 or more schools allows you to purchase universities
        //This improvement may not be destroyed if it is supporting universities until the universities are first destroyed.
        int256 schoolCount;
        //Shipyard
        //$100,000
        //Allows nations to build and maintain navy Landing Ships, Frigates, Submarines, and Aircraft Carriers.
        //Increases the number of each of these types of ships that a nation can support +1.
        //This improvement may not be destroyed if it is supporting navy vessels until those navy vessels are first destroyed.
        //Requires Harbor
        int256 shipyardCount;
        //Stadium
        //$110,000
        //Increases population happiness + 3.
        int256 stadiumCount;
        //University
        //$180,000
        //Increases population income by 8%
        //reduces technology cost -10%
        //increases literacy rate +3%.
        //Three schools must be purchased before any universities can be purchased.
        //Limit 2
        int256 universityCount;
    }

    mapping(uint256 => Improvements1) public idToImprovements1;
    mapping(uint256 => Improvements2) public idToImprovements2;
    mapping(uint256 => Improvements3) public idToImprovements3;
    mapping(uint256 => address) public idToOwnerImprovements;

    function generateImprovements() public {
        Improvements1 memory newImprovements1 = Improvements1(
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
        Improvements2 memory newImprovements2 = Improvements2(
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
        Improvements3 memory newImprovements3 = Improvements3(
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        );
        idToImprovements1[improvementsId] = newImprovements1;
        idToImprovements2[improvementsId] = newImprovements2;
        idToImprovements3[improvementsId] = newImprovements3;
        idToOwnerImprovements[improvementsId] = msg.sender;
        improvementsId++;
    }
}
