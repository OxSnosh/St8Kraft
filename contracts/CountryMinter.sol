//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWarBucks.sol";
import "./CountryParameters.sol";
import "./CountrySettings.sol";
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

contract CountryMinter is ERC721, Ownable {
    uint256 public countryId;
    address public warBucks;
    address public countryParameters;
    address public infrastructure;
    address public resources;
    address public improvements;
    address public wonders;
    address public military;
    address public forces;
    address public treasury;
    address public navy;
    address public fighters;
    address public bombers;
    uint256 public seedMoney = 1000;

    mapping(uint256 => address) public idToOwner;
    mapping(address => uint256) public ownerCountryCount;

    event nationCreated(
        address indexed countryOwner,
        string indexed nationName,
        string indexed ruler
    );

    constructor(
        address _warBucks,
        address _countryParameters,
        address _treasury,
        address _infrastructure,
        address _resources,
        address _improvements,
        address _wonders
    ) ERC721("MetaNations", "MNS") {
        warBucks = _warBucks;
        countryParameters = _countryParameters;
        treasury = _treasury;
        infrastructure = _infrastructure;
        resources = _resources;
        improvements = _improvements;
        wonders = _wonders;
    }

    function constructorContinued(
        address _military,
        address _forces,
        address _navy,
        address _fighters,
        address _bombers
    ) public onlyOwner {
        military = _military;
        forces = _forces;
        navy = _navy;
        fighters = _fighters;
        bombers = _bombers;
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
        IWarBucks(warBucks).mint(address(this), seedMoney);
        CountryParametersContract(countryParameters).generateCountryParameters(
            ruler,
            nationName,
            capitalCity,
            nationSlogan
        );
        InfrastructureContract(infrastructure).generateInfrastructure();
        ResourcesContract(resources).generateResources();
        ImprovementsContract(improvements).generateImprovements();
        WondersContract(wonders).generateWonders();
        TreasuryContract(treasury).generateTreasury();
        MilitaryContract(military).generateMilitary();
        ForcesContract(forces).generateForces();
        NavyContract(navy).generateNavy();
        FightersContract(fighters).generateFighters();
        BombersContract(bombers).generateBombers();
        idToOwner[countryId] = msg.sender;
        ownerCountryCount[msg.sender]++;
        emit nationCreated(msg.sender, nationName, ruler);
        countryId++;
    }
}
