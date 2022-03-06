//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ERC721.sol";

contract Greeter is ERC721 {
    string private greeting;

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

    function tokenURI(uint256 id) override public view returns (string memory) {
        return "https://i.imgur.com/QYKQsql.jpg";
    }
}
