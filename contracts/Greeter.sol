//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

import "./ERC721.sol";
import "./verifier_example.sol";
import "./EllipticCurve.sol";

contract Greeter is ERC721, Verifier, EllipticCurve {

    uint public supply;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function totalSupply() public view returns (uint) {
        return supply;
    }

    function mint(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[3] memory input, bytes32 toBeSignedHash, uint256[2] memory rs) public payable {

        uint exampleX = 0xCD147E5C6B02A75D95BDB82E8B80C3E8EE9CAA685F3EE5CC862D4EC4F97CEFAD;
        uint exampleY = 0x22FE5253A16E5BE4D1621E7F18EAC995C57F82917F1A9150842383F0B4A4DD3D;

        require(verifyProof(a, b, c, input), "Proof is not valid");
        require(validateSignature(toBeSignedHash, rs, [exampleX, exampleY]), "Invalid signature");

        uint mintIndex = totalSupply();
        _safeMint(msg.sender, mintIndex);
        supply++;
    }


    function tokenURI(uint256 id) override public view returns (string memory) {
        require(id < totalSupply(), "URI query for nonexistent token");
        return "https://i.imgur.com/QYKQsql.jpg";
    }
}
