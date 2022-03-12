//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

import "hardhat/console.sol";
import "./ERC721.sol";
import "./verifier_example.sol";
import "./EllipticCurve.sol";

// TODO: only 1 mint per credSubjHash

contract NZCOVIDBadge is ERC721, Verifier, EllipticCurve {

    uint public supply;
    mapping(bytes32 => bool) public minted;

    constructor(string memory _name, string memory _symbol) ERC721(_name = "NZ COVID Badge", _symbol = "NZCB") {}

    function totalSupply() public view returns (uint) {
        return supply;
    }

    // some bit fiddling to get pubIdentity from the signals.
    function getPubIdentity(uint256[3] memory input) internal pure returns (bytes32, bytes32, uint256, address) {

        bytes32 input0 = bytes32(input[0]);
        bytes32 input1 = bytes32(input[1]);
        bytes32 input2 = bytes32(input[2]);

        bytes memory credSubjHash = new bytes(32);
        bytes memory toBeSignedHash = new bytes(32);
        bytes memory expBytes = new bytes(32);
        bytes memory addrBytes = new bytes(20);

        uint256 i;
        uint64 ib;
        bytes1 bi;

        // Extract 31 bytes of data from every signal
        for (i = 0; i < 31;) {
            // Here and bellow:
            // Reverse bits of every byte in input to get the data.
            // From here https://graphics.stanford.edu/~seander/bithacks.html#ReverseByteWith64BitsDiv
            ib = uint64(uint8(input0[31 - i]));
            ib = (ib * 0x0202020202 & 0x010884422010) % 1023;
            // copy over first 31 bytes of credSubjHash
            credSubjHash[i] = bytes1(uint8(ib));
            unchecked { ++i; }
        }
        for (i = 0; i < 31;) {
            ib = uint64(uint8(input1[31 - i]));
            ib = (ib * 0x0202020202 & 0x010884422010) % 1023;
            bi = bytes1(uint8(ib));
            // copy over the last byte of credSubjHash
            if (i < 1) {
                credSubjHash[31 + i] = bi;
            }
            // copy over the first 30 bytes of toBeSignedHash
            else {
                toBeSignedHash[i - 1] = bi;
            }
            unchecked { ++i; }
        }
        for (i = 0; i < 31;) {
            ib = uint64(uint8(input2[31 - i]));
            ib = (ib * 0x0202020202 & 0x010884422010) % 1023;
            bi = bytes1(uint8(ib));
            // copy over the last 2 bytes of toBeSignedHash
            if (i < 2) {
                toBeSignedHash[30 + i] = bi;
            }
            // copy over exp value
            else if (i < 6) {
                // getting the bytes in the following order:
                // byte #26
                // byte #27
                // byte #28
                // byte #29
                // then putting them at the very end of uint256 expBytes
                // that way, we can read those bytes as uint256 exp
                expBytes[i - 2 + 28] = bytes1(uint8(input2[26 + (i - 2)]));
            }
            // copy over the address
            else if (i < 26) {
                addrBytes[i - 6] = bi;
            }
            unchecked { ++i; }
        }

        // convert exp to uint256
        uint256 _exp;
        assembly {
            _exp := mload(add(expBytes, 0x20))
        }

        // convert addr to address
        address addr;
        assembly {
            addr := mload(add(addrBytes, 0x14))
        } 

        return (bytes32(credSubjHash), bytes32(toBeSignedHash), _exp, addr);
    }

    function mint(
            uint256[2] memory a,
            uint256[2][2] memory b,
            uint256[2] memory c,
            uint256[3] memory input, uint256[2] memory rs) public payable {

        bytes32 credSubjHash;
        bytes32 toBeSignedHash;
        uint256 _exp;
        address addr;
        (credSubjHash, toBeSignedHash, _exp, addr) = getPubIdentity(input);

        require(verifyProof(a, b, c, input), "Proof is not valid");
        require(validateSignature(toBeSignedHash, rs, [0xCD147E5C6B02A75D95BDB82E8B80C3E8EE9CAA685F3EE5CC862D4EC4F97CEFAD, 0x22FE5253A16E5BE4D1621E7F18EAC995C57F82917F1A9150842383F0B4A4DD3D]), "Invalid signature");
        require(block.timestamp < _exp, "Expiration date has passed");
        require(msg.sender == addr, "Invalid address");
        require(minted[credSubjHash] == false, "Already minted");

        minted[credSubjHash] = true;
        _safeMint(msg.sender, supply);
        supply++;
    }

    function tokenURI(uint256 id) override public view returns (string memory) {
        console.log("supply!!",supply);
        require(id < supply, "URI query for nonexistent token");
        return "https://i.imgur.com/QYKQsql.jpg";
    }
}
