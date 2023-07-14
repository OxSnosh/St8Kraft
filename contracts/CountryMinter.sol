//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.17;

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
import "hardhat/console.sol";

///@title CountryMinter
///@author OxSnosh
///@notice this is the contract that will allow the user to mint a nation!
contract CountryMinter is ERC721, Ownable {
    uint256 public countryId;

    // uint256 public countryId = 0;
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
    address public warbucks;

    mapping(uint256 => address) public idToOwner;
    mapping(address => uint256) public ownerCountryCount;

    event nationCreated(
        address indexed countryOwner,
        string indexed nationName,
        string indexed ruler
    );

    constructor (
    ) ERC721 ("MetaNations NFTs", "MNFT") {
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings (
        address _countryParameters,
        address _treasury,
        address _infrastructure,
        address _resources,
        address _missiles,
        address _senate,
        address _warbucks
    ) public onlyOwner {
        countryParameters = _countryParameters;
        treasury = _treasury;
        infrastructure = _infrastructure;
        resources = _resources;
        missiles = _missiles;
        senate = _senate;
        warbucks = _warbucks;
    }

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
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

    ///@dev this function is only callable by the contract owner
    ///@dev this function will be called immediately after contract deployment in order to set contract pointers
    function settings3 (
        address _military,
        address _forces,
        address _navy,
        address _navalActions,
        address _fighters,
        address _bombers
    ) public onlyOwner {
        military = _military;
        forces = _forces;
        navy = _navy;
        navalActions = _navalActions;
        fighters = _fighters;
        bombers = _bombers;
    }

    ///@dev this is a public function that allows the caller to mint a nation
    ///@notice this function allows the caller to mint a nation
    ///@notice each wallet address can only contain one country
    ///@param ruler this is a string that is the nation ruler name
    ///@param nationName this is a string that is the name of the nation
    ///@param capitalCity this is a string that is the name of the capital city of the nation
    ///@param nationSlogan this is a string that represents that slogan of the nation
    function generateCountry(
        string memory ruler,
        string memory nationName,
        string memory capitalCity,
        string memory nationSlogan
    ) public {
        uint256 seedMoney = TreasuryContract(treasury).getSeedMoney();
        IWarBucks(warbucks).burnFromMint(msg.sender, seedMoney);
        _safeMint(msg.sender, countryId);
        BombersContract(bombers).generateBombers(countryId);
        CountryParametersContract(countryParameters).generateCountryParameters(
            countryId,
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
        // idToOwner[countryId] = msg.sender;
        // ownerCountryCount[msg.sender]++;
        emit nationCreated(msg.sender, nationName, ruler);
        countryId++;
    }

    ///@dev this function will return the current country Id that gets incremented every time a county is minted
    ///@return uint256 will be number of countries minted
    function getCountryCount() public view returns (uint256) {
        return countryId;
    }

    function checkOwnership(uint256 nationId, address caller) public view returns (bool) {
        address owner = ownerOf(nationId);
        if (owner == caller) {
            return true;
        } else {
            return false;
        }
    }
}
