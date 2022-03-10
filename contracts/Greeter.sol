//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ERC721.sol";

contract Greeter is ERC721 {
    string private greeting;

    uint public supply;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        greeting = _name;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
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
        return "https://i.imgur.com/QYKQsql.jpg";
    }
}
