//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWarBucks.sol";
import "./CountryParameters.sol";
import "./Infrastructure.sol";
import "./Resources.sol";
import "./Improvements.sol";
import "./Wonders.sol";
import "./Military.sol";
import "./Forces.sol";
import "./Treasury.sol";
import "./Navy.sol";
import "./Fighters.sol";
import "./Bombers.sol";
import "./Aid.sol";
import "./Senate.sol";

contract CountryMinter is ERC721, Ownable {
    uint256 public countryId;
    address public countryParameters;
    address public infrastructure;
    address public resources;
    address public improvements1;
    address public improvements2;
    address public improvements3;
    address public improvements4;
    address public wonders1;
    address public wonders2;
    address public wonders3;
    address public wonders4;
    address public wonders;
    address public military;
    address public forces;
    address public treasury;
    address public aid;
    address public navy;
    address public navalActions;
    address public fighters;
    address public fightersMarket1;
    address public fightersMarket2;
    address public bombersMarket1;
    address public bombersMarket2;
    address public bombers;
    address public missiles;
    address public senate;

    mapping(uint256 => address) public idToOwner;
    mapping(address => uint256) public ownerCountryCount;

    event nationCreated(
        address indexed countryOwner,
        string indexed nationName,
        string indexed ruler
    );

    constructor (
    ) ERC721("MetaNations", "MNS") {
    }

    function settings (
        address _countryParameters,
        address _treasury,
        address _infrastructure,
        address _resources,
        address _aid,
        address _missiles,
        address _senate
    ) public onlyOwner {
        countryParameters = _countryParameters;
        treasury = _treasury;
        infrastructure = _infrastructure;
        resources = _resources;
        aid = _aid;
        missiles = _missiles;
        senate = _senate;
    }

    function settings2 (
        address _improvements1,
        address _improvements2,
        address _improvements3,
        address _improvements4,
        address _wonders1,
        address _wonders2,
        address _wonders3,
        address _wonders4
    ) public onlyOwner {
        improvements1 = _improvements1;
        improvements2 = _improvements2;
        improvements3 = _improvements3;
        improvements4 = _improvements4;
        wonders1 = _wonders1;
        wonders2 = _wonders2;
        wonders3 = _wonders3;
        wonders4 = _wonders4;
    }

    function settings3 (
        address _military,
        address _forces,
        address _navy,
        address _navalActions,
        address _fighters,
        address _fightersMarket1,
        address _fightersMarket2,
        address _bombers,
        address _bombersMarket1,
        address _bombersMarket2
    ) public onlyOwner {
        military = _military;
        forces = _forces;
        navy = _navy;
        navalActions = _navalActions;
        fighters = _fighters;
        fightersMarket1 = _fightersMarket1;
        fightersMarket2 = _fightersMarket2;
        bombers = _bombers;
        bombersMarket1 = _bombersMarket1;
        bombersMarket2 = _bombersMarket2;
    }

    function generateCountry(
        string memory ruler,
        string memory nationName,
        string memory capitalCity,
        string memory nationSlogan
    ) public {
        require(
            ownerCountryCount[msg.sender] == 0,
            "Wallet already contains a country"
        );
        AidContract(aid).initiateAid(countryId, msg.sender);
        BombersContract(bombers).generateBombers(countryId);
        CountryParametersContract(countryParameters).generateCountryParameters(
            countryId,
            msg.sender,
            ruler,
            nationName,
            capitalCity,
            nationSlogan
        );
        FightersContract(fighters).generateFighters(countryId);
        ForcesContract(forces).generateForces(countryId);
        MissilesContract(missiles).generateMissiles(countryId);
        ImprovementsContract1(improvements1).generateImprovements(countryId);
        ImprovementsContract2(improvements2).generateImprovements(countryId);
        ImprovementsContract3(improvements3).generateImprovements(countryId);
        ImprovementsContract4(improvements4).generateImprovements(countryId);
        InfrastructureContract(infrastructure).generateInfrastructure(countryId);
        MilitaryContract(military).generateMilitary(countryId);
        NavalActionsContract(navalActions).generateNavalActions(countryId);
        NavyContract(navy).generateNavy(countryId);
        ResourcesContract(resources).generateResources(countryId);
        SenateContract(senate).generateVoter(countryId);
        TreasuryContract(treasury).generateTreasury(countryId);
        WondersContract1(wonders1).generateWonders1(countryId);
        WondersContract2(wonders2).generateWonders2(countryId);
        WondersContract3(wonders3).generateWonders3(countryId);
        WondersContract4(wonders4).generateWonders4(countryId);
        idToOwner[countryId] = msg.sender;
        ownerCountryCount[msg.sender]++;
        emit nationCreated(msg.sender, nationName, ruler);
        countryId++;
    }

    function checkOwnership(uint256 id, address caller) public view returns (bool) {
        if(idToOwner[id] == caller) {
            return true;
        }
        return false;
    }

    function getCountryCount() public view returns (uint256) {
        uint256 countryCount = countryId;
        return countryCount;
    }
}
