import { ethers } from "hardhat";
import { NZCOVIDBadge } from "../typechain";

export async function deployCovidBadge(variant: "Example" | "Live") {
  const PlonkVerifier = await ethers.getContractFactory(
    `contracts/Verifier${variant}.sol:PlonkVerifier`
  );
  const plonk = await PlonkVerifier.deploy();

  const NZCOVIDBadge = await ethers.getContractFactory(
    `contracts/NZCOVIDBadge${variant}.sol:NZCOVIDBadge`
  );
  const covidBadge = await NZCOVIDBadge.deploy(
    "NZ COVID Badge",
    "NZCP",
    plonk.address
  );
  await covidBadge.deployed();
  return covidBadge as NZCOVIDBadge;
}
