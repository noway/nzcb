//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

import "hardhat/console.sol";
import "./ERC721.sol";
import "./verifier_example.sol";
import "./EllipticCurve.sol";

// TODO: get toBeSignedHash from input
// TODO: only 1 mint per credSubjHash
// TODO: check address
// TODO: check exp

contract NZCOVIDBadge is ERC721, Verifier, EllipticCurve {

    uint public supply;

    constructor(string memory _name, string memory _symbol) ERC721(_name = "NZ COVID Badge", _symbol = "NZCB") {}

    function totalSupply() public view returns (uint) {
        return supply;
    }

    function mint(
            uint256[2] memory a,
            uint256[2][2] memory b,
            uint256[2] memory c,
            uint256[3] memory input, bytes32 toBeSignedHash, uint256[2] memory rs) public payable {
        uint exampleX = 0xCD147E5C6B02A75D95BDB82E8B80C3E8EE9CAA685F3EE5CC862D4EC4F97CEFAD;
        uint exampleY = 0x22FE5253A16E5BE4D1621E7F18EAC995C57F82917F1A9150842383F0B4A4DD3D;

        require(verifyProof(a, b, c, input), "Proof is not valid");
        require(validateSignature(toBeSignedHash, rs, [exampleX, exampleY]), "Invalid signature");

        uint mintIndex = supply;
        _safeMint(msg.sender, mintIndex);
        supply++;
        console.log("MINTED!!");
    }

    function tokenURI(uint256 id) override public view returns (string memory) {
        console.log("supply!!",supply);
        require(id < supply, "URI query for nonexistent token");
        return "https://i.imgur.com/QYKQsql.jpg";
    }
}
