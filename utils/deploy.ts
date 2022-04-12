import { ethers } from "hardhat";
import { NZCOVIDBadge, PlonkVerifier } from "../typechain";

export async function deployCovidBadge(variant: "Example" | "Live") {
  const PlonkVerifier = await ethers.getContractFactory(
    `contracts/Verifier${variant}.sol:PlonkVerifier`
  );
  const plonk = (await PlonkVerifier.deploy()) as PlonkVerifier;

  await plonk.deployed();

  const NZCOVIDBadge = await ethers.getContractFactory(
    `contracts/NZCOVIDBadge${variant}.sol:NZCOVIDBadge`
  );
  const covidBadge = (await NZCOVIDBadge.deploy(
    "NZ COVID Badge",
    "NZCP",
    plonk.address
  )) as NZCOVIDBadge;
  await covidBadge.deployed();
  return { covidBadge, plonk };
}
