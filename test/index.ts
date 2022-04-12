import { expect } from "chai";
import { ethers } from "hardhat";
import { NZCOVIDBadge } from "../typechain/";
import { plonk } from "snarkjs";
import { utils } from "ffjavascript";

const unstringifyBigInts = utils.unstringifyBigInts;

const EXAMPLE_PROOF = {
  A: [
    "13982932554605412989897374583643801297812477664729018255304957377686062899393",
    "8744399671172372263799267541994418219728407537975424916611326943925544793290",
    "1",
  ],
  B: [
    "12719875268160541379009394151506124395184478885619722720149073125352433357772",
    "878415208280499480540561826515440070022158712365367705759664903259748808984",
    "1",
  ],
  C: [
    "17136723140920223941471924217453005935573227979559517134592878078150222841009",
    "11489453178020358265877513224060956422077395963322001537213010561892202856423",
    "1",
  ],
  Z: [
    "2654502049435498099591237377202210512624618901316853376481763535443931782046",
    "15697193337473421628343776910094133443325887520788818848401971960069765980016",
    "1",
  ],
  T1: [
    "2184770001379565846067039040777691600193254045218289960386668154456279308741",
    "2710219732545526620790657762934738240886393788106343907715046309837186541973",
    "1",
  ],
  T2: [
    "19542849728414046675528983883659525901247481627985368169643539210411833824585",
    "15182538798064025779486751255600135734727676289400037027668814666860076184685",
    "1",
  ],
  T3: [
    "2898118888620073748203663094459666383793412035631396239045148674961654352513",
    "21806908393867326761153145262491051201779843831401837782383579124462371849039",
    "1",
  ],
  eval_a:
    "7753340733123996096318845420573946282009588110942261460535974202474122859168",
  eval_b:
    "20640363788018345965736034292557713314956939384242741470513605465537161519980",
  eval_c:
    "4602634129871531639144292479946662974848669218242227378542177339659418749170",
  eval_s1:
    "14795886634183803244366135894653661484522938466511699590835267947310852225455",
  eval_s2:
    "15587464979366432082464066501435558970694081926706406700401243217358608224256",
  eval_zw:
    "13424766989992061126470660883955188314100216936863871064633175716465668270022",
  eval_r:
    "3855740322608111986701559675388770656062487834318992464682429317017304228069",
  Wxi: [
    "4595633783301594888826330056264738895929746085851322002100139951048028704624",
    "2361865223465524081580455038350309779186648847268538550241788317183102783595",
    "1",
  ],
  Wxiw: [
    "13018595878822404722675237643469075473073178918648318379998107615776398257177",
    "461328363027137859869225681890179733665249702797919913222300622277169484707",
    "1",
  ],
  protocol: "plonk",
  curve: "bn128",
} as const;

const EXAMPLE_INPUT = [
  "8464235439336389695359576364537904521787463454426143836621154307990710930",
  "334204042160295982690797293769892102755483197293558786265320143920457223185",
  "430989588176825940781496969207245773238692149205558489568811355968561479680",
] as const;

const EXAMPLE_NULLIFIER_HASH_PART =
  "0x04ca63f107c06816c14bf8f3f93b6b4b3ea3a1d17240d25448062c6e6d6a92bd";

const EXAMPLE_RS = [
  "0xD2E07B1DD7263D833166BDBB4F1A093837A905D7ECA2EE836B6B2ADA23C23154",
  "0xFBA88A529F675D6686EE632B09EC581AB08F72B458904BB3396D10FA66D11477",
] as [string, string];

async function getVerifyArgs(proofJS: any, publicSignalsJS: any) {
  const calldata = await plonk.exportSolidityCallData(
    unstringifyBigInts(proofJS),
    unstringifyBigInts(publicSignalsJS)
  );
  const calldataSplit = calldata.split(",");
  const [proof, ...rest] = calldataSplit;
  const publicSignals = JSON.parse(rest.join(",")).map((x: string) =>
    BigInt(x).toString()
  );
  return { proof, publicSignals };
}

describe("NZCOVIDBadge only mint", function () {
  let covidBadge: NZCOVIDBadge;

  before(async () => {
    const PlonkVerifier = await ethers.getContractFactory(
      "contracts/VerifierExample.sol:PlonkVerifier"
    );
    const plonk = await PlonkVerifier.deploy();

    const NZCOVIDBadge = await ethers.getContractFactory("NZCOVIDBadge");
    covidBadge = await NZCOVIDBadge.deploy(
      "NZ COVID Badge",
      "NZCP",
      plonk.address
    );
    await covidBadge.deployed();
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

describe("NZCOVIDBadge check logic", function () {
  let covidBadge: NZCOVIDBadge;

  before(async () => {
    const PlonkVerifier = await ethers.getContractFactory(
      "contracts/VerifierExample.sol:PlonkVerifier"
    );
    const plonk = await PlonkVerifier.deploy();

    const NZCOVIDBadge = await ethers.getContractFactory("NZCOVIDBadge");
    covidBadge = await NZCOVIDBadge.deploy(
      "NZ COVID Badge",
      "NZCP",
      plonk.address
    );
    await covidBadge.deployed();
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
