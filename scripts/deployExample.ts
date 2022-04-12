import { deployCovidBadge } from "../utils/deploy";

async function main() {
  const { plonk, covidBadge } = await deployCovidBadge("Example");

  console.log("VerifierExample deployed to:", plonk.address);
  console.log("NZCOVIDBadgeExample deployed to:", covidBadge.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
