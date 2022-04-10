import { expect } from "chai";
import { ethers } from "hardhat";
import { NZCOVIDBadge } from "../typechain/";
import { plonk } from "snarkjs";
import { utils } from "ffjavascript";

const unstringifyBigInts = utils.unstringifyBigInts;

const proof = {
  A: [
    "12505469721348144051130884511193801013223131584995462883951201970044178925367",
    "10541886471875629782652432198792013799291548884265244308562663634583858575745",
    "1",
  ],
  B: [
    "19521933288960036766349567009154479348352695116597291089514184730624545695480",
    "5791406386982053922576230967036862904373103300473212610971472157403484303986",
    "1",
  ],
  C: [
    "13888726123014572449476582321308298579676115061571923447734703277278648880612",
    "21315740284076643158734157808262865680761239336079105597755643996251282022198",
    "1",
  ],
  T1: [
    "5644371911879369806307448057693201773657559461805724193523732210846019314023",
    "11373890707834038469430912440649187157820331217740812008718483074566950624113",
    "1",
  ],
  T2: [
    "4595908950333689416823025858535261190573273369946065736073417145748705099440",
    "20160108543781037427779732492136386137924001526701734956281067092321951998364",
    "1",
  ],
  T3: [
    "4762763357841614270344426536732644781406858897855959459224667811673133900688",
    "9979660328592677072676194888688998197156311445096349568900956901383295136671",
    "1",
  ],
  Wxi: [
    "14586186017243251868007417059324101417130124503946779876416271950493432688687",
    "7937839675737986804404172167077234206147839596721454224036055555091484070534",
    "1",
  ],
  Wxiw: [
    "20932126355298849896726735100612754593441099726194354022859114885256234142437",
    "6778118726526990801123739634892673323058565239959726923014998524770424337449",
    "1",
  ],
  Z: [
    "21800083215254705277263447850947599241493376545826631584145272356590304113717",
    "16953186756423000294267878534139583964707067422951365976636298253232359141702",
    "1",
  ],
  curve: "bn128",
  eval_a:
    "15975345363576017614891663591385800553179042942493204930608651600851470268673",
  eval_b:
    "6658515438045478579654750454996993039164439200882277601458739332142435440598",
  eval_c:
    "6249022195907862239930386220092192632605412263467319260734409914992034498305",
  eval_r:
    "224637209515033972999313566724461856870756510058316924774702141863518479743",
  eval_s1:
    "240951975088030530434168810996617305673692058508298411825954900215476213036",
  eval_s2:
    "5882682009029320150008434636588893335849855835330178036103096864391007265553",
  eval_zw:
    "8285458462548585344865395618117846250137923939990720146396269771289771691001",
  protocol: "plonk",
} as const;

const input = [
  "8464235439336389695359576364537904521787463454426143836621154307990710930",
  "334204042160295982690797293769892102755483197293558786265320143920457223185",
  "430989588176825940781496969207245773238692149205558489568811355968561479680",
] as const;

const nullifierHashPart =
  "0x04ca63f107c06816c14bf8f3f93b6b4b3ea3a1d17240d25448062c6e6d6a92bd";

const r = "0xD2E07B1DD7263D833166BDBB4F1A093837A905D7ECA2EE836B6B2ADA23C23154";
const s = "0xFBA88A529F675D6686EE632B09EC581AB08F72B458904BB3396D10FA66D11477";

const currentProof = proof;

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
    const PlonkVerifier = await ethers.getContractFactory("PlonkVerifier");
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
    const { proof, publicSignals } = await getVerifyArgs(currentProof, input);
    const mintTx = await covidBadge.mint(proof, publicSignals, [r, s]);
    await mintTx.wait();
  });
});

describe("NZCOVIDBadge check logic", function () {
  let covidBadge: NZCOVIDBadge;

  before(async () => {
    const PlonkVerifier = await ethers.getContractFactory("PlonkVerifier");
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
    const { proof, publicSignals } = await getVerifyArgs(currentProof, input);
    const mintTx = await covidBadge.mint(proof, publicSignals, [r, s]);
    await mintTx.wait();
    expect(await covidBadge.tokenURI(0)).to.equal(
      "https://i.imgur.com/QYKQsql.jpg"
    );
  });

  it("Should not mint again", async function () {
    expect(await covidBadge.tokenURI(0)).to.equal(
      "https://i.imgur.com/QYKQsql.jpg"
    );
    const { proof, publicSignals } = await getVerifyArgs(currentProof, input);
    await expect(
      covidBadge.mint(proof, publicSignals, [r, s])
    ).to.be.revertedWith("Already minted");
  });

  it("Should show as minted for this blinded nullifier hash", async function () {
    expect(await covidBadge.hasMinted(nullifierHashPart)).to.equal(1);
  });

  it("Should show the signer as owner for token id 0", async function () {
    expect(await covidBadge.getOwner(0)).to.equal(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );
  });
});
