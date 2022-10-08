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

contract CountryMinter is ERC721, Ownable {
    uint256 public countryId;
    address public countryParameters;
    address public infrastructure;
    address public resources;
    address public improvements1;
    address public improvements2;
    address public improvements3;
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
    address public fighters;
    address public fightersMarket;
    address public bombersMarket;
    address public bombers;

    mapping(uint256 => address) public idToOwner;
    mapping(address => uint256) public ownerCountryCount;

    event nationCreated(
        address indexed countryOwner,
        string indexed nationName,
        string indexed ruler
    );

    constructor(
        address _countryParameters,
        address _treasury,
        address _infrastructure,
        address _resources,
        address _aid
    ) ERC721("MetaNations", "MNS") {
        countryParameters = _countryParameters;
        treasury = _treasury;
        infrastructure = _infrastructure;
        resources = _resources;
        aid = _aid;
    }

    function constructorContinued1(
        address _improvements1,
        address _improvements2,
        address _improvements3,
        address _wonders1,
        address _wonders2,
        address _wonders3,
        address _wonders4
    ) public onlyOwner {
        improvements1 = _improvements1;
        improvements2 = _improvements2;
        improvements3 = _improvements3;
        wonders1 = _wonders1;
        wonders2 = _wonders2;
        wonders3 = _wonders3;
        wonders4 = _wonders4;
    }

    function constructorContinued2(
        address _military,
        address _forces,
        address _navy,
        address _fighters,
        address _fightersMarket,
        address _bombers,
        address _bombersMarket
    ) public onlyOwner {
        military = _military;
        forces = _forces;
        navy = _navy;
        fighters = _fighters;
        fightersMarket = _fightersMarket;
        bombers = _bombers;
        bombersMarket = _bombersMarket;
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
        CountryParametersContract(countryParameters).generateCountryParameters(
            countryId,
            msg.sender,
            ruler,
            nationName,
            capitalCity,
            nationSlogan
        );
        InfrastructureContract(infrastructure).generateInfrastructure(countryId, msg.sender);
        ResourcesContract(resources).generateResources(countryId, msg.sender);
        ImprovementsContract1(improvements1).generateImprovements(countryId, msg.sender);
        ImprovementsContract2(improvements2).generateImprovements(countryId, msg.sender);
        ImprovementsContract3(improvements3).generateImprovements(countryId, msg.sender);
        WondersContract1(wonders1).generateWonders1(countryId, msg.sender);
        WondersContract2(wonders2).generateWonders2(countryId, msg.sender);
        WondersContract3(wonders3).generateWonders3(countryId, msg.sender);
        WondersContract4(wonders4).generateWonders4(countryId, msg.sender);
        TreasuryContract(treasury).generateTreasury(countryId, msg.sender);
        AidContract(aid).initiateAid(countryId, msg.sender);
        MilitaryContract(military).generateMilitary(countryId, msg.sender);
        ForcesContract(forces).generateForces(countryId, msg.sender);
        NavyContract(navy).generateNavy(countryId, msg.sender);
        FightersContract(fighters).generateFighters(countryId, msg.sender);
        BombersContract(bombers).generateBombers(countryId, msg.sender);
        // BombersMarketplace(bombersMarket).initiateBombersMarket(countryId, msg.sender);        
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
}
