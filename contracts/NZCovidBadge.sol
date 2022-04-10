// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./ERC721.sol";
import "./EllipticCurve.sol";
import "hardhat/console.sol";

interface IPlonkVerifier {
    function verifyProof(bytes memory proof, uint[] memory pubSignals) external view returns (bool);
}

contract NZCOVIDBadge is ERC721, EllipticCurve {

    uint public supply;
    mapping(bytes32 => uint256) public minted;
    IPlonkVerifier private verifier;

    constructor(string memory _name, string memory _symbol, IPlonkVerifier _verifier) ERC721(_name = "NZ COVID Badge", _symbol = "NZCB") {
        verifier = _verifier;
    }

    function totalSupply() public view returns (uint) {
        return supply;
    }

    function hasMinted(bytes32 nullifierHashPart) public view returns (uint256) {
        return minted[nullifierHashPart];
    }

    function getOwner(uint256 id) public view returns (address) {
        return ownerOf[id];
    }

    // Perform bit fiddling to get pubIdentity from the signals.
    function getPubIdentity(bytes32[3] memory input) internal pure returns (bytes32, bytes32, uint256, address) {

        bytes memory nullifierHashPart = new bytes(32);
        bytes memory toBeSignedHash = new bytes(32);
        bytes memory expBytes = new bytes(32);
        bytes memory addrBytes = new bytes(20);

        uint256 i;

        // Extract 31 bytes of data from every signal
        for (i = 1; i < 32;) {
            // Here and bellow:
            // Reverse bits of every byte in input to get the data.
            // From here https://graphics.stanford.edu/~seander/bithacks.html#ReverseByteWith64BitsDiv
            // copy over first 31 bytes of nullifierHashPart
            nullifierHashPart[i - 1] = bytes1(uint8(input[0][i]));
            unchecked { ++i; }
        }
        // copy over the last byte of nullifierHashPart
        nullifierHashPart[31] = bytes1(uint8(input[1][1]));

        for (i = 2; i < 32;) {
            // copy over the first 30 bytes of toBeSignedHash
            toBeSignedHash[i - 2] = bytes1(uint8(input[1][i]));
            unchecked { ++i; }
        }
        // copy over the last 2 bytes of toBeSignedHash
        toBeSignedHash[30] = bytes1(uint8(input[2][1]));
        toBeSignedHash[31] = bytes1(uint8(input[2][2]));

        // copy over exp value
        expBytes[28] = bytes1(uint8(input[2][3]));
        expBytes[29] = bytes1(uint8(input[2][4]));
        expBytes[30] = bytes1(uint8(input[2][5]));
        expBytes[31] = bytes1(uint8(input[2][6]));

        for (i = 7; i < 27;) {
            // copy over the address
            addrBytes[i - 7] = bytes1(uint8(input[2][i]));
            unchecked { 
                ++i; 
            }
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

        return (bytes32(nullifierHashPart), bytes32(toBeSignedHash), _exp, addr);
    }

    function mint(bytes memory proof, uint[] memory input, 
        uint256[2] memory rs) public payable {

        (bytes32 nullifierHashPart, bytes32 toBeSignedHash, uint256 _exp, address addr) = getPubIdentity([
            bytes32(input[0]), 
            bytes32(input[1]), 
            bytes32(input[2])
        ]);

        require(verifier.verifyProof(proof, input), "Invalid proof");
        require(validateSignature(toBeSignedHash, rs, [0xCD147E5C6B02A75D95BDB82E8B80C3E8EE9CAA685F3EE5CC862D4EC4F97CEFAD, 0x22FE5253A16E5BE4D1621E7F18EAC995C57F82917F1A9150842383F0B4A4DD3D]), "Invalid signature");
        require(block.timestamp < _exp, "Pass expired");
        require(minted[nullifierHashPart] == 0, "Already minted");

        minted[nullifierHashPart] = 1;
        _safeMint(addr, supply++);
    }

    function tokenURI(uint256 id) override public view returns (string memory) {
        require(id < supply, "URI query for nonexistent token");
        return "ipfs://QmezZyy4MvwWhSake8YLGvPpTqrfMFwgFSbLEKUsKz3hkF";
    }
}
