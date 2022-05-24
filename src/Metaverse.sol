// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

//Openzeppelin imports
import "@openzeppelin/contracts@4.4.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.4.2/access/Ownable.sol";
import "@openzeppelin/contracts@4.4.2/utils/Counters.sol";

//Creation of the Metaverse Smart Contract using NFT Token
// Contract address : 0xCDb51cf3BE5D3F4f083AF022eDa64D52662e52AB

contract Metaverse is ERC721, Ownable {
    //Constructor to enable creation of NFTs
    constructor() ERC721("META", "MSD") {}

    //Counters to regulate current amount of NFTs minted
    using Counters for Counters.Counter;
    Counters.Counter private supply;

    //Total numbers of NFTs available for creation
    uint256 public max_supply = 100;

    //Cost for creating a token in metaverse
    uint256 public cost = 1 ether;

    //Owner and its properties in the metaverse
    mapping(address => Building[]) NFTOwners;

    //Metverse Building
    struct Building {
        string name;
        int8 w;
        int8 h;
        int8 d;
        int8 x;
        int8 y;
        int8 z;
    }

    //List of Metaverse buildings
    Building[] public buildings;

    //Obtaining building built in the Metaverse
    function getBuildings() public view returns (Building[] memory) {
        //view makes sure no transaction is run - thus no gas is used
        return buildings;
    }

    //Current supply of NFT Tokens
    function totalSupply() public view returns (uint256) {
        return supply.current();
    }

    //Creation of Buildings as NFT tokens in the metaverse
    function mint(
        string memory _building_name,
        int8 _w,
        int8 _h,
        int8 _d,
        int8 _x,
        int8 _y,
        int8 _z
    ) public payable {
        require(supply.current() <= max_supply, "Max supply exceeded!");
        require(msg.value >= cost, "Insufficient fund!");
        supply.increment();
        _safeMint(msg.sender, supply.current());
        Building memory _newBuild = Building(
            _building_name,
            _w,
            _h,
            _d,
            _x,
            _y,
            _z
        );
        buildings.push(_newBuild);
        NFTOwners[msg.sender].push(_newBuild);
    }

    //Extraction of ether from smart contract to our(owner) wallet
    //onlyOwner makes sure the function is performed by only the owner
    function withdraw() external payable onlyOwner {
        address payable _owner = payable(owner());
        _owner.transfer(address(this).balance);
    }

    //Fetch a user's Metaverse buildings
    function getOwnerBuildings() public view returns (Building[] memory) {
        return NFTOwners[msg.sender];
    }
}
