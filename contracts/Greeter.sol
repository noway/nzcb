//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ERC721.sol";

contract Greeter is ERC721 {

    uint public supply;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
    }

    function totalSupply() public view returns (uint) {
        return supply;
    }

    function mint(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[3] memory input, uint256 toBeSignedHash, uint256 r, uint256 s) public payable {

        uint mintIndex = totalSupply();
        _safeMint(msg.sender, mintIndex);
        supply++;
    }


    function tokenURI(uint256 id) override public view returns (string memory) {
        require(id < totalSupply(), "URI query for nonexistent token");
        return "https://i.imgur.com/QYKQsql.jpg";
    }
}
