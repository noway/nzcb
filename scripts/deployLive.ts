import { deployCovidBadge } from "../utils/deploy";

async function main() {
  const { plonk, covidBadge } = await deployCovidBadge("Live");

  console.log("VerifierLive deployed to:", plonk.address);
  console.log("NZCOVIDBadgeLive deployed to:", covidBadge.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
