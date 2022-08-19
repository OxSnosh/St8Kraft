//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ImprovementsContract1 is Ownable {
    uint256 private improvementsId1;
    address public treasuryAddress;
    address public improvementContract2Address;
    address public improvementContract3Address;
    uint256 public airportCost = 100000;
    uint256 public bankCost = 100000;
    uint256 public barracksCost = 50000;
    uint256 public borderFortificationCost = 125000;
    uint256 public borderWallCost = 60000;
    uint256 public bunkerCost = 200000;
    uint256 public casinoCost = 100000;
    uint256 public churchCost = 40000;
    uint256 public clinicCost = 50000;
    uint256 public drydockCost = 100000;
    uint256 public factoryCost = 150000;

    struct Improvements1 {
        uint256 improvementCount;
        //Airport
        //$100,000
        //reduces aircraft cost -2%
        //reduces aircraft upkeep cost -2%
        //Limit 3
        uint256 airportCount;
        //Bank
        //$100,000
        //population income +7%
        uint256 bankCount;
        //Barracks
        //$50,000
        //increases soldier efficiency +10%
        //reduces soldier upkeep -10%
        uint256 barracksCount;
        //Border Fortifications
        //$125,000
        //Raises effectiveness of defending soldiers +2%
        //reduces max deployment -2%
        //Requires maintaining a border wall for each Border Fortification
        //Limit 3
        //Cannot own if forward operating base is owned
        //Collection required to delete
        uint256 borderFortificationCount;
        //Border Walls
        //$60,000
        //Decreases citizen count by -2%
        //increases population happiness +2,
        //Improves environment +1
        //Reduces the number of criminals in a nation 1% for each Border Wall.
        //Border Walls may only be purchased one at a time.
        uint256 borderWallCount;
        //Bunker
        //$200,000
        //Reduces infrastructure damage from aircraft, cruise missiles, and nukes -3%
        //Requires maintaining a Barracks for each Bunker.
        //Limit 5
        //Cannot build if Munitions Factory or Forward Operating Base is owned.
        //Collection required to delete
        uint256 bunkerCount;
        //Casino
        //$100,000
        //Increases happiness by 1.5,
        //decreases citizen income by 1%
        //-25 to crime prevention score.
        //Limit 2.
        uint256 casinoCount;
        //Church
        //$40,000
        //Increases population happiness +1.
        uint256 churchCount;
        //Clinic
        //$50,000
        //Increases population count by 2%
        //Purchasing 2 or more clinics allows you to purchase hospitals.
        //This improvement may not be destroyed if it is supporting a hospital until the hospital is first destroyed.
        uint256 clinicCount;
        //Drydock
        //$100,000
        //Allows nations to build and maintain navy Corvettes, Battleships, Cruisers, and Destroyers
        //Increases the number of each of these types of ships that a nation can support +1.
        //This improvement may not be destroyed if it is supporting navy vessels until those navy vessels are first destroyed.
        //requires Harbor
        uint256 drydockCount;
        //Factory
        //$150,000
        //Decreases cost of cruise missiles -5%
        //decreases tank cost -10%,
        //reduces initial infrastructure purchase cost -8%.
        uint256 factoryCount;
    }

    mapping(uint256 => Improvements1) public idToImprovements1;
    mapping(uint256 => address) public idToOwnerImprovements1;

    constructor(
        address _treasuryAddress,
        address _improvementContract2Address,
        address _improvementContract3Address
    ) {
        treasuryAddress = _treasuryAddress;
        improvementContract2Address = _improvementContract2Address;
        improvementContract3Address = _improvementContract3Address;
    }

    modifier approvedAddress() {
        require(
            msg.sender == improvementContract2Address ||
                msg.sender == improvementContract3Address,
            "Unable to call"
        );
        _;
    }

    function updateTreasuryAddress(address _newTreasuryAddress)
        public
        onlyOwner
    {
        treasuryAddress = _newTreasuryAddress;
    }

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
        idToImprovements1[improvementsId1] = newImprovements1;
        idToOwnerImprovements1[improvementsId1] = msg.sender;
        improvementsId1++;
    }

    function updateAirportCost(uint256 newPrice) public onlyOwner {
        airportCost = newPrice;
    }

    function updateBankCost(uint256 newPrice) public onlyOwner {
        bankCost = newPrice;
    }

    function updateBarracksCost(uint256 newPrice) public onlyOwner {
        barracksCost = newPrice;
    }

    function updateBorderFortificationCost(uint256 newPrice) public onlyOwner {
        borderFortificationCost = newPrice;
    }

    function updateaBorderWallCost(uint256 newPrice) public onlyOwner {
        borderWallCost = newPrice;
    }

    function updateBunkerCost(uint256 newPrice) public onlyOwner {
        bunkerCost = newPrice;
    }

    function updateCasinoCost(uint256 newPrice) public onlyOwner {
        casinoCost = newPrice;
    }

    function updateChurchCost(uint256 newPrice) public onlyOwner {
        churchCost = newPrice;
    }

    function updateClinicCost(uint256 newPrice) public onlyOwner {
        clinicCost = newPrice;
    }

    function updateDrydockCost(uint256 newPrice) public onlyOwner {
        drydockCost = newPrice;
    }

    function updateFactoryCost(uint256 newPrice) public onlyOwner {
        factoryCost = newPrice;
    }

    function getImprovementCount(uint256 id)
        public
        view
        returns (uint256 count)
    {
        count = idToImprovements1[id].improvementCount;
        return count;
    }

    function updateImprovementCount(uint256 id, uint256 newCount)
        public
        approvedAddress
    {
        idToImprovements1[id].improvementCount = newCount;
    }

    function buyImprovement1(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public {
        require(
            idToOwnerImprovements1[countryId] == msg.sender,
            "You are not the nation ruler"
        );
        require(improvementId <= 11, "Invalid improvement ID");
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(
            countryId
        );
        if (improvementId == 1) {
            uint256 purchasePrice = airportCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].airportCount;
            require((existingCount + amount) <= 3, "Cannot own more than 3");
            idToImprovements1[countryId].airportCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 2) {
            uint256 purchasePrice = bankCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].bankCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].bankCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 3) {
            uint256 purchasePrice = barracksCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].barracksCount;
            require((existingCount + amount) <= 3, "Cannot own more than 3");
            idToImprovements1[countryId].barracksCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 4) {
            uint256 purchasePrice = borderFortificationCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId]
                .borderFortificationCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].borderFortificationCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 5) {
            uint256 purchasePrice = borderWallCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId]
                .borderWallCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].borderWallCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 6) {
            uint256 purchasePrice = bunkerCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].bunkerCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].bunkerCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 7) {
            uint256 purchasePrice = casinoCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].casinoCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            idToImprovements1[countryId].casinoCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 8) {
            uint256 purchasePrice = churchCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].churchCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].churchCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 9) {
            uint256 purchasePrice = clinicCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].clinicCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].clinicCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 10) {
            uint256 purchasePrice = drydockCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].drydockCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].drydockCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else {
            uint256 purchasePrice = factoryCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements1[countryId].factoryCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements1[countryId].factoryCount += amount;
            idToImprovements1[countryId].improvementCount += amount;
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        }
    }

    function deleteImprovement1(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public {
        require(
            idToOwnerImprovements1[countryId] == msg.sender,
            "You are not the nation ruler"
        );
        require(improvementId <= 11, "Invalid improvement ID");
        if (improvementId == 1) {
            uint256 existingCount = idToImprovements1[countryId].airportCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].airportCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 2) {
            uint256 existingCount = idToImprovements1[countryId].bankCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].bankCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 3) {
            uint256 existingCount = idToImprovements1[countryId].barracksCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].barracksCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 4) {
            uint256 existingCount = idToImprovements1[countryId]
                .borderFortificationCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].borderFortificationCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 5) {
            uint256 existingCount = idToImprovements1[countryId]
                .borderWallCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].borderWallCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 6) {
            uint256 existingCount = idToImprovements1[countryId].bunkerCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].bunkerCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 7) {
            uint256 existingCount = idToImprovements1[countryId].casinoCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].casinoCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 8) {
            uint256 existingCount = idToImprovements1[countryId].churchCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].churchCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 9) {
            uint256 existingCount = idToImprovements1[countryId].clinicCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].clinicCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else if (improvementId == 10) {
            uint256 existingCount = idToImprovements1[countryId].drydockCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].drydockCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        } else {
            uint256 existingCount = idToImprovements1[countryId].factoryCount;
            require((existingCount - amount) >= 0, "Cannot delete that many");
            idToImprovements1[countryId].factoryCount -= amount;
            idToImprovements1[countryId].improvementCount -= amount;
        }
    }

    //Airport
    // function buyAirport(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = airportCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements1[id].airportCount;
    //     require((existingCount + amount) <= 3, "Cannot own more than 3");
    //     idToImprovements1[id].airportCount += amount;
    //     idToImprovements1[id].improvementCount += amount;
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    // function deleteAirport(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 existingCount = idToImprovements1[id].airportCount;
    //     require((existingCount - amount) >= 0, "Cannot delete that many");
    //     idToImprovements1[id].airportCount -= amount;
    //     idToImprovements1[id].improvementCount -= amount;
    // }

    //Bank
    // function buyBank(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = bankCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements1[id].bankCount;
    //     require((existingCount + amount) <= 5, "Cannot own more than 5");
    //     idToImprovements1[id].bankCount += amount;
    //     idToImprovements1[id].improvementCount += amount;
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    // function deleteBank(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 existingCount = idToImprovements1[id].bankCount;
    //     require((existingCount - amount) >= 0, "Cannot delete that many");
    //     idToImprovements1[id].bankCount -= amount;
    //     idToImprovements1[id].improvementCount -= amount;
    // }

    //Barracks
    // function buyBarracks(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = barracksCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements1[id].barracksCount;
    //     require((existingCount + amount) <= 3, "Cannot own more than 3");
    //     idToImprovements1[id].barracksCount += amount;
    //     idToImprovements1[id].improvementCount += amount;
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    // function deleteBarracks(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 existingCount = idToImprovements1[id].barracksCount;
    //     require((existingCount - amount) >= 0, "Cannot delete that many");
    //     idToImprovements1[id].barracksCount -= amount;
    //     idToImprovements1[id].improvementCount -= amount;
    // }

    //Border Fortification
    // function buyBorderFortification(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = borderFortificationCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements1[id].borderFortificationCount;
    //     require((existingCount + amount) <= 5, "Cannot own more than 5");
    //     idToImprovements1[id].borderFortificationCount += amount;
    //     idToImprovements1[id].improvementCount += amount;
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    // function deleteBorderFortification(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 existingCount = idToImprovements1[id].borderFortificationCount;
    //     require((existingCount - amount) >= 0, "Cannot delete that many");
    //     idToImprovements1[id].borderFortificationCount -= amount;
    //     idToImprovements1[id].improvementCount -= amount;
    // }

    //Border Wall
    // function buyBorderWall(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = borderWallCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements1[id].borderWallCount;
    //     require((existingCount + amount) <= 5, "Cannot own more than 5");
    //     idToImprovements1[id].borderWallCount += amount;
    //     idToImprovements1[id].improvementCount += amount;
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    // function deleteBorderWall(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 existingCount = idToImprovements1[id].borderWallCount;
    //     require((existingCount - amount) >= 0, "Cannot delete that many");
    //     idToImprovements1[id].borderWallCount -= amount;
    //     idToImprovements1[id].improvementCount -= amount;
    // }

    //Bunker
    // function buyBunker(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = bunkerCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements1[id].bunkerCount;
    //     require((existingCount + amount) <= 5, "Cannot own more than 5");
    //     idToImprovements1[id].bunkerCount += amount;
    //     idToImprovements1[id].improvementCount += amount;
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    // function deleteBunker(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 existingCount = idToImprovements1[id].bunkerCount;
    //     require((existingCount - amount) >= 0, "Cannot delete that many");
    //     idToImprovements1[id].bunkerCount -= amount;
    //     idToImprovements1[id].improvementCount -= amount;
    // }

    //Casino
    // function buyCasino(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = casinoCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements1[id].casinoCount;
    //     require((existingCount + amount) <= 2, "Cannot own more than 2");
    //     idToImprovements1[id].casinoCount += amount;
    //     idToImprovements1[id].improvementCount += amount;
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    // function deleteCasino(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 existingCount = idToImprovements1[id].casinoCount;
    //     require((existingCount - amount) >= 0, "Cannot delete that many");
    //     idToImprovements1[id].casinoCount -= amount;
    //     idToImprovements1[id].improvementCount -= amount;
    // }

    //Church
    // function buyChurch(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = churchCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements1[id].churchCount;
    //     require((existingCount + amount) <= 5, "Cannot own more than 5");
    //     idToImprovements1[id].churchCount += amount;
    //     idToImprovements1[id].improvementCount += amount;
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    // function deleteChurch(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 existingCount = idToImprovements1[id].churchCount;
    //     require((existingCount - amount) >= 0, "Cannot delete that many");
    //     idToImprovements1[id].churchCount -= amount;
    //     idToImprovements1[id].improvementCount -= amount;
    // }

    //Clinic
    // function buyClinic(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = clinicCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements1[id].clinicCount;
    //     require((existingCount + amount) <= 5, "Cannot own more than 5");
    //     idToImprovements1[id].clinicCount += amount;
    //     idToImprovements1[id].improvementCount += amount;
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    // function deleteClinic(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 existingCount = idToImprovements1[id].clinicCount;
    //     require((existingCount - amount) >= 0, "Cannot delete that many");
    //     idToImprovements1[id].clinicCount -= amount;
    //     idToImprovements1[id].improvementCount -= amount;
    // }

    //Drydock
    // function buyDrydock(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = drydockCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements1[id].drydockCount;
    //     require((existingCount + amount) <= 5, "Cannot own more than 5");
    //     idToImprovements1[id].drydockCount += amount;
    //     idToImprovements1[id].improvementCount += amount;
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    // function deleteDrydock(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 existingCount = idToImprovements1[id].drydockCount;
    //     require((existingCount - amount) >= 0, "Cannot delete that many");
    //     idToImprovements1[id].drydockCount -= amount;
    //     idToImprovements1[id].improvementCount -= amount;
    // }

    //Factory
    // function buyFactory(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = factoryCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements1[id].factoryCount;
    //     require((existingCount + amount) <= 5, "Cannot own more than 5");
    //     idToImprovements1[id].factoryCount += amount;
    //     idToImprovements1[id].improvementCount += amount;
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    // function deleteFactory(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements1[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 existingCount = idToImprovements1[id].factoryCount;
    //     require((existingCount - amount) >= 0, "Cannot delete that many");
    //     idToImprovements1[id].factoryCount -= amount;
    //     idToImprovements1[id].improvementCount -= amount;
    // }
}

contract ImprovementsContract2 is Ownable {
    uint256 private improvementsId2;
    address public treasuryAddress;
    address public improvementsContract1Address;
    uint256 public foreignMinistryCost = 120000;
    uint256 public forwardOperatingBaseCost = 125000;
    uint256 public guerillaCampCost = 20000;
    uint256 public harborCost = 200000;
    uint256 public hospitalCost = 180000;
    uint256 public intelligenceAgencyCost = 38500;
    uint256 public jailCost = 25000;
    uint256 public laborCampCost = 150000;
    uint256 public missileDefenseCost = 90000;
    uint256 public munitionsFactoryCost = 200000;
    uint256 public navalAcademyCost = 300000;
    uint256 public navalConstructionYardCost = 300000;

    struct Improvements2 {
        //Foreign Ministry
        //$120,000
        //Increases population income by 5%
        //Opens +1 extra foreign aid slot.
        //Limit one foreign ministry per nation
        uint256 foreignMinistryCount;
        //Forward Operating Base
        //$125,000
        //Increases ground attack damage 5%,
        //Reduces effectiveness of one's own defending soldiers -3%.
        //Requires maintaining a Barracks for each Forward Operating Base.
        //Limit 2.
        //Cannot own if Border Fortifications or Bunker is owned.
        //Collection required to delete.
        uint256 forwardOperatingBaseCount;
        //Guerilla Camp
        //$20,000
        //Increases soldier efficiency +35%,
        //reduces soldier upkeep cost -10%
        //reduces citizen income -8%.
        uint256 guerillaCampCount;
        //Harbor
        //$200,000
        //Increases population income by 1%.
        //Opens +1 extra trade slot
        //Limit one harbor per nation.
        //This improvement may not be destroyed if it is supporting trade agreements or navy vessels until those trade agreements and navy vessels are first removed.
        uint256 harborCount;
        //Hospital
        //$180,000
        //Increases population count by 6%.
        //Need 2 clinics for a hospital.
        //Limit one hospital per nation.
        //Nations must retain at least one hospital if that nation owns a Universal Health Care wonder.
        uint256 hospitalCount;
        //Intelligence Agency
        //$38,500
        //Increases happiness for tax rates greater than 23% +1
        //Each Intelligence Agency allows nations to purchase + 100 spies
        //This improvement may not be destroyed if it is supporting spies until those spies are first destroyed.
        uint256 intelligenceAgencyCount;
        //Jail
        //$25,000
        //Incarcerates up to 500 criminals
        //Limit 5
        uint256 jailCount;
        //Labor Camp
        //$150,000
        //Reduces infrastructure upkeep costs -10%
        //reduces population happiness -1.
        //Incarcerates up to 200 criminals per Labor Camp.
        uint256 laborCampCount;
        //Missile Defense
        //$90,000
        //Reduces effectiveness of incoming cruise missiles used against your nation -10%.
        //Nations must retain at least three missile defenses if that nation owns a Strategic Defense Initiative wonder.
        uint256 missileDefenseCount;
        //MunitionsFactory
        //$200,000
        //Increases enemy infrastructure damage from your aircraft, cruise missiles, and nukes +3%
        //+0.3 penalty to environment per Munitions Factory.
        //Requires maintaining 3 or more Factories.
        //Requires having Lead as a resource to purchase.
        //Limit 5.
        //Cannot build if Bunkers owned.
        //Collection required to delete.
        uint256 munitionsFactorCount;
        //Naval Academy
        //$300,000
        //Increases both attacking and defending navy vessel strength +1.
        //Limit 2 per nation.
        //Requires Harbor.
        uint256 navalAcademyCount;
        //Naval Construction Yard
        //$300,000
        //Increases the daily purchase limit for navy vessels +1.
        //Your nation must have pre-existing navy support capabilities (via Drydocks and Shipyards) to actually purchase navy vessels.
        //Limit 3 per nation.
        //requires Harbor
        uint256 navalConstructionYardCount;
    }

    mapping(uint256 => Improvements2) public idToImprovements2;
    mapping(uint256 => address) public idToOwnerImprovements2;

    constructor(address _treasuryAddress, address _improvementsContract1Address)
    {
        treasuryAddress = _treasuryAddress;
        improvementsContract1Address = _improvementsContract1Address;
    }

    function updateTreasuryAddress(address _newTreasuryAddress)
        public
        onlyOwner
    {
        treasuryAddress = _newTreasuryAddress;
    }

    function updateImprovementContract1Address(
        address _newImprovementsContract1Address
    ) public onlyOwner {
        improvementsContract1Address = _newImprovementsContract1Address;
    }

    function generateImprovements() public {
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
        idToImprovements2[improvementsId2] = newImprovements2;
        idToOwnerImprovements2[improvementsId2] = msg.sender;
        improvementsId2++;
    }

    function updateForeignMinistryCost(uint256 newPrice) public onlyOwner {
        foreignMinistryCost = newPrice;
    }

    function updateforwardOperatingBaseCost(uint256 newPrice) public onlyOwner {
        forwardOperatingBaseCost = newPrice;
    }

    function updateGuerillaCampCost(uint256 newPrice) public onlyOwner {
        guerillaCampCost = newPrice;
    }

    function updateHarborCost(uint256 newPrice) public onlyOwner {
        harborCost = newPrice;
    }

    function updateHospitalCost(uint256 newPrice) public onlyOwner {
        hospitalCost = newPrice;
    }

    function updateIntelligenceAgencyCost(uint256 newPrice) public onlyOwner {
        intelligenceAgencyCost = newPrice;
    }

    function updateJailCost(uint256 newPrice) public onlyOwner {
        jailCost = newPrice;
    }

    function updateLaborCampCost(uint256 newPrice) public onlyOwner {
        laborCampCost = newPrice;
    }

    function updateMissileDefenseCost(uint256 newPrice) public onlyOwner {
        missileDefenseCost = newPrice;
    }

    function updateMunitionsFactoryCost(uint256 newPrice) public onlyOwner {
        munitionsFactoryCost = newPrice;
    }

    function updateNavalAcademyCost(uint256 newPrice) public onlyOwner {
        navalAcademyCost = newPrice;
    }

    function updateNavalConstructionYardCost(uint256 newPrice)
        public
        onlyOwner
    {
        navalConstructionYardCost = newPrice;
    }

    function buyImprovement2(
        uint256 amount,
        uint256 countryId,
        uint256 improvementId
    ) public {
        require(
            idToOwnerImprovements2[countryId] == msg.sender,
            "You are not the nation ruler"
        );
        require(improvementId <= 11, "Invalid improvement ID");
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(
            countryId
        );
        if (improvementId == 1) {
            uint256 purchasePrice = foreignMinistryCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .foreignMinistryCount;
            require((existingCount + amount) <= 1, "Cannot own more than 1");
            idToImprovements2[countryId].foreignMinistryCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 2) {
            uint256 purchasePrice = forwardOperatingBaseCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .forwardOperatingBaseCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            idToImprovements2[countryId].forwardOperatingBaseCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 3) {
            uint256 purchasePrice = guerillaCampCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .guerillaCampCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements2[countryId].guerillaCampCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 4) {
            uint256 purchasePrice = harborCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId].harborCount;
            require((existingCount + amount) <= 1, "Cannot own more than 1");
            idToImprovements2[countryId].harborCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 5) {
            uint256 purchasePrice = hospitalCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId].hospitalCount;
            require((existingCount + amount) <= 1, "Cannot own more than 1");
            idToImprovements2[countryId].hospitalCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 6) {
            uint256 purchasePrice = intelligenceAgencyCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .intelligenceAgencyCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements2[countryId].intelligenceAgencyCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 7) {
            uint256 purchasePrice = jailCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId].jailCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements2[countryId].jailCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 8) {
            uint256 purchasePrice = laborCampCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId].laborCampCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements2[countryId].laborCampCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 9) {
            uint256 purchasePrice = missileDefenseCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .missileDefenseCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements2[countryId].missileDefenseCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 10) {
            uint256 purchasePrice = munitionsFactoryCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .munitionsFactorCount;
            require((existingCount + amount) <= 5, "Cannot own more than 5");
            idToImprovements2[countryId].munitionsFactorCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else if (improvementId == 11) {
            uint256 purchasePrice = navalAcademyCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .navalAcademyCount;
            require((existingCount + amount) <= 2, "Cannot own more than 2");
            idToImprovements2[countryId].navalAcademyCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        } else {
            uint256 purchasePrice = navalConstructionYardCost * amount;
            require(balance >= purchasePrice, "Insufficient balance");
            uint256 existingCount = idToImprovements2[countryId]
                .navalConstructionYardCount;
            require((existingCount + amount) <= 3, "Cannot own more than 3");
            idToImprovements2[countryId].navalConstructionYardCount += amount;
            uint256 existingImprovementTotal = ImprovementsContract1(
                improvementsContract1Address
            ).getImprovementCount(countryId);
            uint256 newImprovementTotal = existingImprovementTotal + amount;
            ImprovementsContract1(improvementsContract1Address)
                .updateImprovementCount(countryId, newImprovementTotal);
            TreasuryContract(treasuryAddress).spendBalance(
                countryId,
                purchasePrice
            );
        }
    }

    // function deleteImprovement1(
    //     uint256 amount,
    //     uint256 countryId,
    //     uint256 improvementId
    // ) public {
    //     require(
    //         idToOwnerImprovements1[countryId] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     require(improvementId <= 11, "Invalid improvement ID");
    //     if (improvementId == 1) {
    //         uint256 existingCount = idToImprovements1[countryId].airportCount;
    //         require((existingCount - amount) >= 0, "Cannot delete that many");
    //         idToImprovements1[countryId].airportCount -= amount;
    //         idToImprovements1[countryId].improvementCount -= amount;
    //     } else if (improvementId == 2) {
    //         uint256 existingCount = idToImprovements1[countryId].bankCount;
    //         require((existingCount - amount) >= 0, "Cannot delete that many");
    //         idToImprovements1[countryId].bankCount -= amount;
    //         idToImprovements1[countryId].improvementCount -= amount;
    //     } else if (improvementId == 3) {
    //         uint256 existingCount = idToImprovements1[countryId].barracksCount;
    //         require((existingCount - amount) >= 0, "Cannot delete that many");
    //         idToImprovements1[countryId].barracksCount -= amount;
    //         idToImprovements1[countryId].improvementCount -= amount;
    //     } else if (improvementId == 4) {
    //         uint256 existingCount = idToImprovements1[countryId]
    //             .borderFortificationCount;
    //         require((existingCount - amount) >= 0, "Cannot delete that many");
    //         idToImprovements1[countryId].borderFortificationCount -= amount;
    //         idToImprovements1[countryId].improvementCount -= amount;
    //     } else if (improvementId == 5) {
    //         uint256 existingCount = idToImprovements1[countryId]
    //             .borderWallCount;
    //         require((existingCount - amount) >= 0, "Cannot delete that many");
    //         idToImprovements1[countryId].borderWallCount -= amount;
    //         idToImprovements1[countryId].improvementCount -= amount;
    //     } else if (improvementId == 6) {
    //         uint256 existingCount = idToImprovements1[countryId].bunkerCount;
    //         require((existingCount - amount) >= 0, "Cannot delete that many");
    //         idToImprovements1[countryId].bunkerCount -= amount;
    //         idToImprovements1[countryId].improvementCount -= amount;
    //     } else if (improvementId == 7) {
    //         uint256 existingCount = idToImprovements1[countryId].casinoCount;
    //         require((existingCount - amount) >= 0, "Cannot delete that many");
    //         idToImprovements1[countryId].casinoCount -= amount;
    //         idToImprovements1[countryId].improvementCount -= amount;
    //     } else if (improvementId == 8) {
    //         uint256 existingCount = idToImprovements1[countryId].churchCount;
    //         require((existingCount - amount) >= 0, "Cannot delete that many");
    //         idToImprovements1[countryId].churchCount -= amount;
    //         idToImprovements1[countryId].improvementCount -= amount;
    //     } else if (improvementId == 9) {
    //         uint256 existingCount = idToImprovements1[countryId].clinicCount;
    //         require((existingCount - amount) >= 0, "Cannot delete that many");
    //         idToImprovements1[countryId].clinicCount -= amount;
    //         idToImprovements1[countryId].improvementCount -= amount;
    //     } else if (improvementId == 10) {
    //         uint256 existingCount = idToImprovements1[countryId].drydockCount;
    //         require((existingCount - amount) >= 0, "Cannot delete that many");
    //         idToImprovements1[countryId].drydockCount -= amount;
    //         idToImprovements1[countryId].improvementCount -= amount;
    //     } else {
    //         uint256 existingCount = idToImprovements1[countryId].factoryCount;
    //         require((existingCount - amount) >= 0, "Cannot delete that many");
    //         idToImprovements1[countryId].factoryCount -= amount;
    //         idToImprovements1[countryId].improvementCount -= amount;
    //     }
    // }

    //Foreign Ministry
    // function buyForeignMinistry(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements2[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = foreignMinistryCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements2[id].foreignMinistryCount;
    //     require((existingCount + amount) <= 1, "Cannot own more than 1");
    //     idToImprovements2[id].foreignMinistryCount += amount;
    //     uint256 existingImprovementTotal = ImprovementsContract1(
    //         improvementsContract1Address
    //     ).getImprovementCount(id);
    //     uint256 newImprovementTotal = existingImprovementTotal + amount;
    //     ImprovementsContract1(improvementsContract1Address)
    //         .updateImprovementCount(id, newImprovementTotal);
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    function deleteForeignMinistry(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements2[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements2[id].foreignMinistryCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements2[id].foreignMinistryCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Forward Operating Base
    // function buyForwardOperatingBase(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements2[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = forwardOperatingBaseCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements2[id].forwardOperatingBaseCount;
    //     require((existingCount + amount) <= 2, "Cannot own more than 2");
    //     idToImprovements2[id].forwardOperatingBaseCount += amount;
    //     uint256 existingImprovementTotal = ImprovementsContract1(
    //         improvementsContract1Address
    //     ).getImprovementCount(id);
    //     uint256 newImprovementTotal = existingImprovementTotal + amount;
    //     ImprovementsContract1(improvementsContract1Address)
    //         .updateImprovementCount(id, newImprovementTotal);
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    function deleteForwardOperatingBase(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements2[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements2[id].forwardOperatingBaseCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements2[id].forwardOperatingBaseCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Guerilla Camp
    // function buyGuerillaCamp(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements2[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = guerillaCampCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements2[id].guerillaCampCount;
    //     require((existingCount + amount) <= 5, "Cannot own more than 5");
    //     idToImprovements2[id].guerillaCampCount += amount;
    //     uint256 existingImprovementTotal = ImprovementsContract1(
    //         improvementsContract1Address
    //     ).getImprovementCount(id);
    //     uint256 newImprovementTotal = existingImprovementTotal + amount;
    //     ImprovementsContract1(improvementsContract1Address)
    //         .updateImprovementCount(id, newImprovementTotal);
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    function deleteGuerillaCamp(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements2[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements2[id].guerillaCampCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements2[id].guerillaCampCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Harbor
    // function buyHarbor(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements2[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = harborCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements2[id].harborCount;
    //     require((existingCount + amount) <= 1, "Cannot own more than 1");
    //     idToImprovements2[id].harborCount += amount;
    //     uint256 existingImprovementTotal = ImprovementsContract1(
    //         improvementsContract1Address
    //     ).getImprovementCount(id);
    //     uint256 newImprovementTotal = existingImprovementTotal + amount;
    //     ImprovementsContract1(improvementsContract1Address)
    //         .updateImprovementCount(id, newImprovementTotal);
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    function deleteHarbor(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements2[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements2[id].harborCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements2[id].harborCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Hospital
    // function buyHospital(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements2[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = hospitalCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements2[id].hospitalCount;
    //     require((existingCount + amount) <= 1, "Cannot own more than 1");
    //     idToImprovements2[id].hospitalCount += amount;
    //     uint256 existingImprovementTotal = ImprovementsContract1(
    //         improvementsContract1Address
    //     ).getImprovementCount(id);
    //     uint256 newImprovementTotal = existingImprovementTotal + amount;
    //     ImprovementsContract1(improvementsContract1Address)
    //         .updateImprovementCount(id, newImprovementTotal);
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    function deleteHospital(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements2[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements2[id].hospitalCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements2[id].hospitalCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Intelligence Agency
    // function buyIntelligenceAgency(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements2[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = intelligenceAgencyCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements2[id].intelligenceAgencyCount;
    //     require((existingCount + amount) <= 5, "Cannot own more than 5");
    //     idToImprovements2[id].intelligenceAgencyCount += amount;
    //     uint256 existingImprovementTotal = ImprovementsContract1(
    //         improvementsContract1Address
    //     ).getImprovementCount(id);
    //     uint256 newImprovementTotal = existingImprovementTotal + amount;
    //     ImprovementsContract1(improvementsContract1Address)
    //         .updateImprovementCount(id, newImprovementTotal);
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    function deleteIntelligenceAgency(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements2[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements2[id].intelligenceAgencyCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements2[id].intelligenceAgencyCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Jail
    // function buyJail(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements2[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = jailCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements2[id].jailCount;
    //     require((existingCount + amount) <= 5, "Cannot own more than 5");
    //     idToImprovements2[id].jailCount += amount;
    //     uint256 existingImprovementTotal = ImprovementsContract1(
    //         improvementsContract1Address
    //     ).getImprovementCount(id);
    //     uint256 newImprovementTotal = existingImprovementTotal + amount;
    //     ImprovementsContract1(improvementsContract1Address)
    //         .updateImprovementCount(id, newImprovementTotal);
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    function deleteJail(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements2[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements2[id].jailCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements2[id].jailCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Labor Camp
    // function buyLaborCamp(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements2[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = laborCampCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements2[id].laborCampCount;
    //     require((existingCount + amount) <= 5, "Cannot own more than 5");
    //     idToImprovements2[id].laborCampCount += amount;
    //     uint256 existingImprovementTotal = ImprovementsContract1(
    //         improvementsContract1Address
    //     ).getImprovementCount(id);
    //     uint256 newImprovementTotal = existingImprovementTotal + amount;
    //     ImprovementsContract1(improvementsContract1Address)
    //         .updateImprovementCount(id, newImprovementTotal);
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    function deleteLaborCamp(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements2[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements2[id].laborCampCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements2[id].laborCampCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Missile Defense
    // function buyMissileDefense(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements2[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = missileDefenseCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements2[id].missileDefenseCount;
    //     require((existingCount + amount) <= 5, "Cannot own more than 5");
    //     idToImprovements2[id].missileDefenseCount += amount;
    //     uint256 existingImprovementTotal = ImprovementsContract1(
    //         improvementsContract1Address
    //     ).getImprovementCount(id);
    //     uint256 newImprovementTotal = existingImprovementTotal + amount;
    //     ImprovementsContract1(improvementsContract1Address)
    //         .updateImprovementCount(id, newImprovementTotal);
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    function deleteMissileDefense(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements2[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements2[id].missileDefenseCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements2[id].missileDefenseCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Munitions Factory
    // function buyMunitionsFactory(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements2[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = munitionsFactoryCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements2[id].munitionsFactorCount;
    //     require((existingCount + amount) <= 5, "Cannot own more than 5");
    //     idToImprovements2[id].munitionsFactorCount += amount;
    //     uint256 existingImprovementTotal = ImprovementsContract1(
    //         improvementsContract1Address
    //     ).getImprovementCount(id);
    //     uint256 newImprovementTotal = existingImprovementTotal + amount;
    //     ImprovementsContract1(improvementsContract1Address)
    //         .updateImprovementCount(id, newImprovementTotal);
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    function deleteMunitionsFactory(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements2[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements2[id].munitionsFactorCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements2[id].munitionsFactorCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Naval Academy
    // function buyNavalAcademy(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements2[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = navalAcademyCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements2[id].navalAcademyCount;
    //     require((existingCount + amount) <= 2, "Cannot own more than 2");
    //     idToImprovements2[id].navalAcademyCount += amount;
    //     uint256 existingImprovementTotal = ImprovementsContract1(
    //         improvementsContract1Address
    //     ).getImprovementCount(id);
    //     uint256 newImprovementTotal = existingImprovementTotal + amount;
    //     ImprovementsContract1(improvementsContract1Address)
    //         .updateImprovementCount(id, newImprovementTotal);
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    function deleteNavalAcademy(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements2[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements2[id].navalAcademyCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements2[id].navalAcademyCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Naval Construction Yard
    // function buyNavalConstructionYard(uint256 amount, uint256 id) public {
    //     require(
    //         idToOwnerImprovements2[id] == msg.sender,
    //         "You are not the nation ruler"
    //     );
    //     uint256 purchasePrice = navalConstructionYardCost * amount;
    //     uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
    //     require(balance >= purchasePrice, "Insufficient balance");
    //     uint256 existingCount = idToImprovements2[id]
    //         .navalConstructionYardCount;
    //     require((existingCount + amount) <= 3, "Cannot own more than 3");
    //     idToImprovements2[id].navalConstructionYardCount += amount;
    //     uint256 existingImprovementTotal = ImprovementsContract1(
    //         improvementsContract1Address
    //     ).getImprovementCount(id);
    //     uint256 newImprovementTotal = existingImprovementTotal + amount;
    //     ImprovementsContract1(improvementsContract1Address)
    //         .updateImprovementCount(id, newImprovementTotal);
    //     TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    // }

    function deleteNavalConstructionYard(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements2[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements2[id]
            .navalConstructionYardCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements2[id].navalConstructionYardCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }
}

contract ImprovementsContract3 is Ownable {
    uint256 private improvementsId3;
    address public treasuryAddress;
    address public improvementsContract1Address;
    uint256 public officeOfPropagandaCost = 200000;
    uint256 public policeHeadquartersCost = 75000;
    uint256 public prisonCost = 200000;
    uint256 public radiationContainmentChamberCost = 200000;
    uint256 public redLightDistrictCost = 50000;
    uint256 public rehabilitationFacilityCost = 500000;
    uint256 public satteliteCost = 90000;
    uint256 public schoolCost = 85000;
    uint256 public shipyardCost = 100000;
    uint256 public stadiumCost = 110000;
    uint256 public universityCost = 180000;

    struct Improvements3 {
        //Office of Propoganda
        //$200,000
        //Decreases the effectiveness of enemy defending soldiers 3%.
        //Requires maintaining a Forward Operating Base for each Office of Propaganda
        //Limit 2
        //Collection required to delete.
        uint256 officeOfPropagandaCount;
        //Police Headquarters
        //$75,000
        //Increases population happiness +2.
        uint256 policeHeadquartersCount;
        //Prison
        //$200,000
        //Incarcerates up to 5,000 criminals.
        //Limit 5
        uint256 prisonCount;
        //RadiationContainmentChamber
        //$200,000
        //Lowers global radiation level that affects your nation by 20%.
        //Requires maintaining Radiation Cleanup bonus resource to function
        //Requires maintaining a Bunker for each Radiation Containment Chamber.
        //Limit 2.
        //Collection required to delete.
        uint256 radiationContainmentChamberCount;
        //RedLightDistrict
        //$50,000
        //Increases happiness by 1,
        //penalizes environment by 0.5,
        //-25 to crime prevention score
        //Limit 2
        uint256 redLightDistrictCount;
        //Rehabilitation Facility
        //$500,000
        //Sends up to 500 criminals back into the citizen count
        //Limit 5
        uint256 rehabilitationFacilityCount;
        //Satellite
        //$90,000
        //Increases effectiveness of cruise missiles used by your nation +10%.
        //Nations must retain at least three satellites if that nation owns a Strategic Defense Initiative wonder
        uint256 satelliteCount;
        //School
        //$85,000
        //Increases population income by 5%
        //increases literacy rate +1%
        //Purchasing 3 or more schools allows you to purchase universities
        //This improvement may not be destroyed if it is supporting universities until the universities are first destroyed.
        uint256 schoolCount;
        //Shipyard
        //$100,000
        //Allows nations to build and maintain navy Landing Ships, Frigates, Submarines, and Aircraft Carriers.
        //Increases the number of each of these types of ships that a nation can support +1.
        //This improvement may not be destroyed if it is supporting navy vessels until those navy vessels are first destroyed.
        //Requires Harbor
        uint256 shipyardCount;
        //Stadium
        //$110,000
        //Increases population happiness + 3.
        uint256 stadiumCount;
        //University
        //$180,000
        //Increases population income by 8%
        //reduces technology cost -10%
        //increases literacy rate +3%.
        //Three schools must be purchased before any universities can be purchased.
        //Limit 2
        uint256 universityCount;
    }

    mapping(uint256 => Improvements3) public idToImprovements3;
    mapping(uint256 => address) public idToOwnerImprovements3;

    constructor(address _treasuryAddress, address _improvementsContract1Address)
    {
        treasuryAddress = _treasuryAddress;
        improvementsContract1Address = _improvementsContract1Address;
    }

    function updateTreasuryAddress(address _newTreasuryAddress)
        public
        onlyOwner
    {
        treasuryAddress = _newTreasuryAddress;
    }

    function updateImprovementContract1Address(
        address _newImprovementsContract1Address
    ) public onlyOwner {
        improvementsContract1Address = _newImprovementsContract1Address;
    }

    function generateImprovements() public {
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
            0,
            0
        );
        idToImprovements3[improvementsId3] = newImprovements3;
        idToOwnerImprovements3[improvementsId3] = msg.sender;
        improvementsId3++;
    }

    function updateOfficeOfPropagandaCost(uint256 newPrice) public onlyOwner {
        officeOfPropagandaCost = newPrice;
    }

    function updatePoliceHeadquartersCost(uint256 newPrice) public onlyOwner {
        policeHeadquartersCost = newPrice;
    }

    function updatePrisonCost(uint256 newPrice) public onlyOwner {
        prisonCost = newPrice;
    }

    function updateRadiationContainmentChamberCost(uint256 newPrice)
        public
        onlyOwner
    {
        radiationContainmentChamberCost = newPrice;
    }

    function updateRedLightDistrictCost(uint256 newPrice) public onlyOwner {
        redLightDistrictCost = newPrice;
    }

    function updateRehabilitationFacilityCost(uint256 newPrice)
        public
        onlyOwner
    {
        rehabilitationFacilityCost = newPrice;
    }

    function updateSatteliteCost(uint256 newPrice) public onlyOwner {
        satteliteCost = newPrice;
    }

    function updateSchoolCost(uint256 newPrice) public onlyOwner {
        schoolCost = newPrice;
    }

    function updateShipyardCost(uint256 newPrice) public onlyOwner {
        shipyardCost = newPrice;
    }

    function updateStadiumCost(uint256 newPrice) public onlyOwner {
        stadiumCost = newPrice;
    }

    function updateUniversityCost(uint256 newPrice) public onlyOwner {
        universityCost = newPrice;
    }

    //Office of Propaganda
    function buyOfficefPropaganda(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = officeOfPropagandaCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice, "Insufficient balance");
        uint256 existingCount = idToImprovements3[id].officeOfPropagandaCount;
        require((existingCount + amount) <= 2, "Cannot own more than 2");
        idToImprovements3[id].officeOfPropagandaCount += amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal + amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function deleteOfficefPropaganda(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements3[id].officeOfPropagandaCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements3[id].officeOfPropagandaCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Police Headquarters
    function buyPoliceHeadquarters(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = policeHeadquartersCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice, "Insufficient balance");
        uint256 existingCount = idToImprovements3[id].policeHeadquartersCount;
        require((existingCount + amount) <= 5, "Cannot own more than 5");
        idToImprovements3[id].policeHeadquartersCount += amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal + amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function deletePoliceHeadquarters(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements3[id].policeHeadquartersCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements3[id].policeHeadquartersCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Prison
    function buyPrison(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = prisonCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice, "Insufficient balance");
        uint256 existingCount = idToImprovements3[id].prisonCount;
        require((existingCount + amount) <= 5, "Cannot own more than 5");
        idToImprovements3[id].prisonCount += amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal + amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function deletePrison(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements3[id].prisonCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements3[id].prisonCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Radiation Containment Chamber
    function buyRadiationContainmentChamber(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = radiationContainmentChamberCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice, "Insufficient balance");
        uint256 existingCount = idToImprovements3[id]
            .radiationContainmentChamberCount;
        require((existingCount + amount) <= 2, "Cannot own more than 2");
        idToImprovements3[id].radiationContainmentChamberCount += amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal + amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function deleteRadiationContainmentChamber(uint256 amount, uint256 id)
        public
    {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements3[id]
            .radiationContainmentChamberCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements3[id].radiationContainmentChamberCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Red Light District
    function buyRedLightDistrict(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = redLightDistrictCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice, "Insufficient balance");
        uint256 existingCount = idToImprovements3[id].redLightDistrictCount;
        require((existingCount + amount) <= 2, "Cannot own more than 2");
        idToImprovements3[id].redLightDistrictCount += amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal + amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function deleteRedLightDistrict(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements3[id].redLightDistrictCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements3[id].redLightDistrictCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Rehabilitation Facility
    function buyRehabilitationFacility(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = rehabilitationFacilityCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice, "Insufficient balance");
        uint256 existingCount = idToImprovements3[id]
            .rehabilitationFacilityCount;
        require((existingCount + amount) <= 5, "Cannot own more than 5");
        idToImprovements3[id].rehabilitationFacilityCount += amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal + amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function deleteRehabilitationFacility(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements3[id]
            .rehabilitationFacilityCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements3[id].rehabilitationFacilityCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Sattelite
    function buySattelite(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = satteliteCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice, "Insufficient balance");
        uint256 existingCount = idToImprovements3[id].satelliteCount;
        require((existingCount + amount) <= 5, "Cannot own more than 5");
        idToImprovements3[id].satelliteCount += amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal + amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function deleteSattelite(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements3[id].satelliteCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements3[id].satelliteCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //School
    function buySchool(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = schoolCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice, "Insufficient balance");
        uint256 existingCount = idToImprovements3[id].schoolCount;
        require((existingCount + amount) <= 5, "Cannot own more than 5");
        idToImprovements3[id].schoolCount += amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal + amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function deleteSchool(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements3[id].schoolCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements3[id].schoolCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Shipyard
    function buyShipyard(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = shipyardCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice, "Insufficient balance");
        uint256 existingCount = idToImprovements3[id].shipyardCount;
        require((existingCount + amount) <= 5, "Cannot own more than 5");
        idToImprovements3[id].shipyardCount += amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal + amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function deleteShipyard(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements3[id].shipyardCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements3[id].shipyardCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //Stadium
    function buyStadium(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = stadiumCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice, "Insufficient balance");
        uint256 existingCount = idToImprovements3[id].stadiumCount;
        require((existingCount + amount) <= 5, "Cannot own more than 5");
        idToImprovements3[id].stadiumCount += amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal + amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function deleteStadium(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements3[id].stadiumCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements3[id].stadiumCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }

    //University
    function buyUniversity(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 purchasePrice = universityCost * amount;
        uint256 balance = TreasuryContract(treasuryAddress).checkBalance(id);
        require(balance >= purchasePrice, "Insufficient balance");
        uint256 existingCount = idToImprovements3[id].universityCount;
        require((existingCount + amount) <= 2, "Cannot own more than 2");
        idToImprovements3[id].universityCount += amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal + amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
        TreasuryContract(treasuryAddress).spendBalance(id, purchasePrice);
    }

    function deleteUniversity(uint256 amount, uint256 id) public {
        require(
            idToOwnerImprovements3[id] == msg.sender,
            "You are not the nation ruler"
        );
        uint256 existingCount = idToImprovements3[id].universityCount;
        require((existingCount - amount) >= 0, "Cannot delete that many");
        idToImprovements3[id].universityCount -= amount;
        uint256 existingImprovementTotal = ImprovementsContract1(
            improvementsContract1Address
        ).getImprovementCount(id);
        uint256 newImprovementTotal = existingImprovementTotal -= amount;
        ImprovementsContract1(improvementsContract1Address)
            .updateImprovementCount(id, newImprovementTotal);
    }
}
