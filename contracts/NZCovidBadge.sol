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
            uint256[3] memory input, uint256[2] memory rs) public payable {

        bytes32 i0 = bytes32(input[0]);
        bytes32 i1 = bytes32(input[1]);
        bytes32 i2 = bytes32(input[2]);

        bytes memory credSubjHash = new bytes(32);
        bytes memory toBeSignedHash = new bytes(32);
        bytes memory expBytes = new bytes(32);
        bytes memory dataBytes = new bytes(25);

        uint256 i;
        for (i = 0; i < 31;) {
            // reverse bits
            // from here: https://graphics.stanford.edu/~seander/bithacks.html#ReverseByteWith64BitsDiv
            uint64 ib = uint64(uint8(i0[31 - i]));
            ib = (ib * 0x0202020202 & 0x010884422010) % 1023;
            credSubjHash[i] = bytes1(uint8(ib));
            unchecked { ++i; }
        }
        for (i = 0; i < 31;) {
            // reverse bits
            // from here: https://graphics.stanford.edu/~seander/bithacks.html#ReverseByteWith64BitsDiv
            uint64 ib = uint64(uint8(i1[31 - i]));
            ib = (ib * 0x0202020202 & 0x010884422010) % 1023;
            bytes1 bi = bytes1(uint8(ib));
            if (i < 1) {
                credSubjHash[31 + i] = bi;
            }
            else {
                toBeSignedHash[i - 1] = bi;
            }
            unchecked { ++i; }
        }
        for (i = 0; i < 31;) {
            // reverse bits
            // from here: https://graphics.stanford.edu/~seander/bithacks.html#ReverseByteWith64BitsDiv
            uint64 ib = uint64(uint8(i2[31 - i]));
            ib = (ib * 0x0202020202 & 0x010884422010) % 1023;
            bytes1 bi = bytes1(uint8(ib));
            if (i < 2) {
                toBeSignedHash[30 + i] = bi;
            }
            else if (i < 6) {
                // getting the bytes in the following order:
                // byte #26
                // byte #27
                // byte #28
                // byte #29
                // then putting them at the very end of uint256 expBytes
                // that way, we can read those bytes as uint256 exp
                expBytes[i - 2 + 28] = bytes1(uint8(i2[26 + (i - 2)]));
            }
            else {
                dataBytes[i - 6] = bi;
            }

            unchecked { ++i; }
        }
        // console.logBytes(toBeSignedHash);
        // bytes32 expB = bytes32(expBytes);
        uint256 _exp;
        assembly {
            _exp := mload(add(expBytes, 0x20))
        }
        console.log(_exp);
        console.logBytes(expBytes);
        // console.logBytes32(i1[31]);
        // console.logBytes32(i2[31]);
        uint exampleX = 0xCD147E5C6B02A75D95BDB82E8B80C3E8EE9CAA685F3EE5CC862D4EC4F97CEFAD;
        uint exampleY = 0x22FE5253A16E5BE4D1621E7F18EAC995C57F82917F1A9150842383F0B4A4DD3D;

        // require(verifyProof(a, b, c, input), "Proof is not valid");
        // require(validateSignature(bytes32(toBeSignedHash), rs, [exampleX, exampleY]), "Invalid signature");

        // uint mintIndex = ;
        _safeMint(msg.sender, supply);
        supply++;
        console.log("MINTED!!");
    }

    function tokenURI(uint256 id) override public view returns (string memory) {
        console.log("supply!!",supply);
        require(id < supply, "URI query for nonexistent token");
        return "https://i.imgur.com/QYKQsql.jpg";
    }
}
