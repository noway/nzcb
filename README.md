# NZ COVID Badge - Contract repo

## Info & FAQ
Read [the website](https://nzcb.netlify.app/) for more info.


## Technical info
[Solmate's ERC721](https://github.com/Rari-Capital/solmate/blob/main/src/tokens/ERC721.sol) is used alongside [snarkjs](https://github.com/iden3/snarkjs) PlonkVerifier. [EllipticCurve.sol](contracts/EllipticCurve.sol) is used for verifying NZ COVID Pass signatures. 

## Test
- `make`
- `npx hardhat test`

## Deploy
- `make`
- Either `npx hardhat run scripts/deployLive.ts --network <network>` or `npx hardhat run scripts/deployExample.ts --network <network>`

## Verify on Etherscan
- `npx hardhat verify --network <network> <plonk_address>`
- `npx hardhat verify --network <network> <nzcb_address> "NZ COVID Badge" "NZCP" <plonk_address>`

## Deployed addresses
### Live passes
#### Polygon Mainnet
- PlonkVerifier - https://polygonscan.com/address/0x69972e8fc3d0582748c8af359632812640357392
- NZCOVIDBadge - https://polygonscan.com/address/0x14ffb19a685bb8ec4b925604280f7e441a343af9

#### Polygon Mumbai
- PlonkVerifier - https://mumbai.polygonscan.com/address/0x69972e8fc3d0582748c8af359632812640357392
- NZCOVIDBadge - https://mumbai.polygonscan.com/address/0x14ffb19a685bb8ec4b925604280f7e441a343af9

#### Ethereum Rinkeby
- PlonkVerifier - https://rinkeby.etherscan.io/address/0x46f1d10566037532074ef3f4b3d812be4bc67689
- NZCOVIDBadge - https://rinkeby.etherscan.io/address/0xd9f461702019a63318f5acb9cea63bcbdc186446

### Example passes
#### Ethereum Rinkeby
- PlonkVerifier - https://rinkeby.etherscan.io/address/0xa63202d6f8c260da83ca3ef35d209b9af5ff7fea
- NZCOVIDBadge - https://rinkeby.etherscan.io/address/0xba9104c6220310582bc6f7b8dcde445934f1bd5a

## Tech Spec
- [NZ COVID Badge - Tech Spec](https://github.com/noway/nzcb/blob/main/TECH_SPEC.md)

## Related repos
- [NZ COVID Badge - Dapp repo](https://github.com/noway/nzcb-dapp)
- [NZ COVID Badge - Contract repo](https://github.com/noway/nzcb)
- [NZ COVID Badge - ZK-SNARK repo](https://github.com/noway/nzcb-circom)

## License
MIT License
