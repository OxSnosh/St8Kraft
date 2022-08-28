//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

contract ResourcesContract {
    uint256 private resourcesId;

    struct Resources1 {
        bool aluminum;
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

    struct BonusResources {
        bool affluentPopulation;
        bool asphalt;
        bool automobiles;
        bool beer;
        bool construction;
        bool fastFood;
        bool fineJewelry;
        bool microchips;
        bool radiationCleanup;
        bool scholars;
        bool steel;
    }

    struct MoonResources {
        bool calcium;
        bool radon;
        bool silicon;
        bool titanium;
    }

    struct MarsResources {
        bool basalt;
        bool magnesium;
        bool potassium;
        bool sodium;
    }

    mapping(uint256 => Resources1) public idToResources1;
    mapping(uint256 => Resources2) public idToResources2;
    mapping(uint256 => BonusResources) public idToBonusResources;
    mapping(uint256 => MoonResources) public idToMoonResources;
    mapping(uint256 => MarsResources) public idToMarsResources;
    mapping(uint256 => address) public idToOwnerResources;

    function generateResources() public {
        Resources1 memory newResources1 = Resources1(
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
        Resources2 memory newResources2 = Resources2(
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
        BonusResources memory newBonusResources = BonusResources(
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
        MoonResources memory newMoonResources = MoonResources(
            false,
            false,
            false,
            false
        );
        MarsResources memory newMarsResources = MarsResources(
            false,
            false,
            false,
            false
        );
        idToResources1[resourcesId] = newResources1;
        idToResources2[resourcesId] = newResources2;
        idToBonusResources[resourcesId] = newBonusResources;
        idToMoonResources[resourcesId] = newMoonResources;
        idToMarsResources[resourcesId] = newMarsResources;
        idToOwnerResources[resourcesId] = msg.sender;
        resourcesId++;
    }
}