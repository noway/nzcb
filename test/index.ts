import { expect } from "chai";
import { NZCOVIDBadge } from "../typechain/";
import { plonk } from "snarkjs";
import { utils } from "ffjavascript";
import {
  EXAMPLE_PROOF,
  EXAMPLE_INPUT,
  EXAMPLE_RS,
  EXAMPLE_NULLIFIER_HASH_PART,
} from "./exampleStubs";
import {
  LIVE_PROOF,
  LIVE_INPUT,
  LIVE_RS,
  LIVE_NULLIFIER_HASH_PART,
} from "./liveStubs";
import { deployCovidBadge } from "../utils/deploy";

async function getVerifyArgs(proofJS: any, publicSignalsJS: any) {
  const calldata = await plonk.exportSolidityCallData(
    utils.unstringifyBigInts(proofJS),
    utils.unstringifyBigInts(publicSignalsJS)
  );
  const calldataSplit = calldata.split(",");
  const [proof, ...rest] = calldataSplit;
  const publicSignals = JSON.parse(rest.join(",")).map((x: string) =>
    BigInt(x).toString()
  );
  return { proof, publicSignals };
}
describe("NZCOVIDBadgeExample only mint", function () {
  let covidBadge: NZCOVIDBadge;

  before(async () => {
    ({ covidBadge } = await deployCovidBadge("Example"));
  });

  it("Should mint", async function () {
    const { proof, publicSignals } = await getVerifyArgs(
      EXAMPLE_PROOF,
      EXAMPLE_INPUT
    );
    const mintTx = await covidBadge.mint(proof, publicSignals, EXAMPLE_RS);
    await mintTx.wait();
  });
});

describe("NZCOVIDBadgeExample check logic", function () {
  let covidBadge: NZCOVIDBadge;

  before(async () => {
    ({ covidBadge } = await deployCovidBadge("Example"));
  });

  it("Should mint", async function () {
    await expect(covidBadge.tokenURI(0)).to.be.revertedWith(
      "URI query for nonexistent token"
    );
    const { proof, publicSignals } = await getVerifyArgs(
      EXAMPLE_PROOF,
      EXAMPLE_INPUT
    );
    const mintTx = await covidBadge.mint(proof, publicSignals, EXAMPLE_RS);
    await mintTx.wait();
    expect(await covidBadge.tokenURI(0)).to.equal(
      "ipfs://Qmd1j17wicAM2qrAw9ZNGc9YW2BLmrq7nEDUHUHQWKx86q"
    );
  });

  it("Should not mint again", async function () {
    expect(await covidBadge.tokenURI(0)).to.equal(
      "ipfs://Qmd1j17wicAM2qrAw9ZNGc9YW2BLmrq7nEDUHUHQWKx86q"
    );
    const { proof, publicSignals } = await getVerifyArgs(
      EXAMPLE_PROOF,
      EXAMPLE_INPUT
    );
    await expect(
      covidBadge.mint(proof, publicSignals, EXAMPLE_RS)
    ).to.be.revertedWith("Already minted");
  });

  it("Should show as minted for this blinded nullifier hash", async function () {
    expect(await covidBadge.hasMinted(EXAMPLE_NULLIFIER_HASH_PART)).to.equal(1);
  });

  it("Should show the signer as owner for token id 0", async function () {
    expect(await covidBadge.getOwner(0)).to.equal(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );
  });
  // TODO: test getPubIdentity
});

describe("NZCOVIDBadgeLive only mint", function () {
  let covidBadge: NZCOVIDBadge;

  before(async () => {
    ({ covidBadge } = await deployCovidBadge("Live"));
  });

  it("Should mint", async function () {
    const { proof, publicSignals } = await getVerifyArgs(
      LIVE_PROOF,
      LIVE_INPUT
    );
    const mintTx = await covidBadge.mint(proof, publicSignals, LIVE_RS);
    await mintTx.wait();
  });
});

describe("NZCOVIDBadgeLive check logic", function () {
  let covidBadge: NZCOVIDBadge;

  before(async () => {
    ({ covidBadge } = await deployCovidBadge("Live"));
  });

  it("Should mint", async function () {
    await expect(covidBadge.tokenURI(0)).to.be.revertedWith(
      "URI query for nonexistent token"
    );
    const { proof, publicSignals } = await getVerifyArgs(
      LIVE_PROOF,
      LIVE_INPUT
    );
    const mintTx = await covidBadge.mint(proof, publicSignals, LIVE_RS);
    await mintTx.wait();
    expect(await covidBadge.tokenURI(0)).to.equal(
      "ipfs://QmZ9CUMWm7qLfZioD1p822geAbcL1VcVcBsj6x6JMMD7FM"
    );
  });

  it("Should not mint again", async function () {
    expect(await covidBadge.tokenURI(0)).to.equal(
      "ipfs://QmZ9CUMWm7qLfZioD1p822geAbcL1VcVcBsj6x6JMMD7FM"
    );
    const { proof, publicSignals } = await getVerifyArgs(
      LIVE_PROOF,
      LIVE_INPUT
    );
    await expect(
      covidBadge.mint(proof, publicSignals, LIVE_RS)
    ).to.be.revertedWith("Already minted");
  });

  it("Should show as minted for this blinded nullifier hash", async function () {
    expect(await covidBadge.hasMinted(LIVE_NULLIFIER_HASH_PART)).to.equal(1);
  });

  it("Should show the signer as owner for token id 0", async function () {
    expect(await covidBadge.getOwner(0)).to.equal(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );
  });
  // TODO: test getPubIdentity
});
