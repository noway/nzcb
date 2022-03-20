//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

import "./ERC721.sol";
import "./VerifierExample.sol";
import "./EllipticCurve.sol";

contract NZCOVIDBadge is ERC721, Verifier, EllipticCurve {

    uint public supply;
    mapping(bytes32 => uint256) public minted;

    constructor(string memory _name, string memory _symbol) ERC721(_name = "NZ COVID Badge", _symbol = "NZCB") {}

    function totalSupply() public view returns (uint) {
        return supply;
    }

    function hasMinted(bytes32 nullifierRange) public view returns (uint256) {
        return minted[nullifierRange];
    }

    function getOwner(uint256 id) public view returns (address) {
        return ownerOf[id];
    }

    // Perform bit fiddling to get pubIdentity from the signals.
    // TODO: test this function
    function getPubIdentity(bytes32[4] memory input) internal pure returns (bytes32, bytes32, bytes32, uint256, address) {

        bytes memory nullifierRange1 = new bytes(32);
        bytes memory nullifierRange2 = new bytes(32);
        bytes memory toBeSignedHash = new bytes(32);
        bytes memory expBytes = new bytes(32);
        bytes memory addrBytes = new bytes(20);

        uint256 i;
        uint256 ib;

        // Extract 31 bytes of data from every signal
        for (i = 0; i < 31;) {
            // Here and bellow:
            // Reverse bits of every byte in input to get the data.
            // From here https://graphics.stanford.edu/~seander/bithacks.html#ReverseByteWith64BitsDiv
            ib = uint256(uint8(input[0][31 - i]));
            ib = (ib * 0x0202020202 & 0x010884422010) % 1023;
            // copy over first 31 bytes of nullifierRange
            nullifierRange1[i] = bytes1(uint8(ib));
            unchecked { ++i; }
        }
        for (i = 0; i < 31;) {
            ib = uint256(uint8(input[1][31 - i]));
            ib = (ib * 0x0202020202 & 0x010884422010) % 1023;
            // copy over next 31 bytes of nullifierRange up to 62
            if (i < 1) {
                nullifierRange1[31 + i] = bytes1(uint8(ib));
            }
            else {
                nullifierRange2[i - 1] = bytes1(uint8(ib));
            }
            unchecked { ++i; }
        }
        for (i = 0; i < 31;) {
            ib = uint256(uint8(input[2][31 - i]));
            ib = (ib * 0x0202020202 & 0x010884422010) % 1023;
            // copy over the last 2 bytes of nullifierRange
            if (i < 2) {
                nullifierRange2[30 + i] = bytes1(uint8(ib));
            }
            // copy first 29 bytes of toBeSignedHash
            else {
                toBeSignedHash[i - 2] = bytes1(uint8(ib));
            }
            unchecked { ++i; }
        }
        for (i = 0; i < 31;) {
            ib = uint256(uint8(input[3][31 - i]));
            ib = (ib * 0x0202020202 & 0x010884422010) % 1023;

            // copy last 3 bytes of toBeSignedHash
            if (i < 3) {
                toBeSignedHash[29 + i] = bytes1(uint8(ib));
            }
            // copy over exp value
            else if (i < 7) {
                // filling out the following bytes in expBytes:
                // byte #28
                // byte #29
                // byte #30
                // byte #31
                // that way, we can read those bytes as uint256 exp
                expBytes[i + 25] = bytes1(uint8(input[3][i]));
            }
            else if (i < 11) {
                // skip
            }
            // copy over the address
            else {
                addrBytes[i - 11] = bytes1(uint8(ib));
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

        return (bytes32(nullifierRange1), bytes32(nullifierRange2), bytes32(toBeSignedHash), _exp, addr);
    }

    function mint(
            uint256[2] memory a,
            uint256[2][2] memory b,
            uint256[2] memory c,
            uint256[4] memory input, uint256[2] memory rs) public payable {


        bytes32 input0 = bytes32(input[0]);
        bytes32 input1 = bytes32(input[1]);
        bytes32 input2 = bytes32(input[2]);
        bytes32 input3 = bytes32(input[3]);

        (bytes32 nullifierRange1, bytes32 nullifierRange2, bytes32 toBeSignedHash, uint256 _exp, address addr) = getPubIdentity([input0, input1, input2, input3]);

        require(verifyProof(a, b, c, input), "Invalid proof");
        require(validateSignature(toBeSignedHash, rs, [0xCD147E5C6B02A75D95BDB82E8B80C3E8EE9CAA685F3EE5CC862D4EC4F97CEFAD, 0x22FE5253A16E5BE4D1621E7F18EAC995C57F82917F1A9150842383F0B4A4DD3D]), "Invalid signature");
        require(block.timestamp < _exp, "Pass expired");
        require(minted[nullifierRange1] == 0, "Already minted");

        minted[nullifierRange1] = 1;
        _safeMint(addr, supply++);
    }

    function tokenURI(uint256 id) override public view returns (string memory) {
        require(id < supply, "URI query for nonexistent token");
        return "https://i.imgur.com/QYKQsql.jpg";
    }
}
