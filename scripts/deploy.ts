import { ethers } from "hardhat";

async function main() {
  const PlonkVerifier = await ethers.getContractFactory(
    "contracts/VerifierExample.sol:PlonkVerifier"
  );
  const plonk = await PlonkVerifier.deploy();

  await plonk.deployed();

  const NZCOVIDBadge = await ethers.getContractFactory(
    "contracts/NZCOVIDBadgeExample.sol:NZCOVIDBadge"
  );
  const covidBadge = await NZCOVIDBadge.deploy(
    "NZ COVID Badge",
    "NZCP",
    plonk.address
  );

  await covidBadge.deployed();

  console.log("PlonkVerifier deployed to:", plonk.address);
  console.log("NZCOVIDBadge deployed to:", covidBadge.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
