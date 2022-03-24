import { expect } from "chai";
import { ethers } from "hardhat";
import { NZCOVIDBadge } from "../typechain";

const a: [bigint, bigint] = [
  8204061906215824700029400315936858090583190957906195826747783699760673959658n,19078033316342965875156996206127944471188092643641358066375337665015206516660n
]

const b: [[bigint, bigint],[bigint, bigint]] = [
  [12756508620161837789628824650754970328887197424895848040733569444179986979568n,981757432327897842356412789112230906717061662917715614534167815447573791118n],[16537038146756917200621652698355422601609813522278909153711208867427593492930n,18423662263420378826224054066344977595603378755849573779462585865298582797392n]
]

const c: [bigint, bigint] = [
  4030142150124487455771984602651768857147677160236906118161736225918445095309n,16577476336908442598197775208804755486389825401263247554339012974479206991954n
]

const input: [bigint, bigint, bigint] = [
  8464235439336389695359576364537904521787463454426143836621154307990710930n,334204042160295982690797293769892102755483197293558786265320143920457223185n,430989081135164610074926275187414829627429144010283124898900268893116735475n
]

// const credSubjHash = "0x5fb355822221720ea4ce6734e5a09e459d452574a19310c0cea7c141f43a3dab"

const r = "0xD2E07B1DD7263D833166BDBB4F1A093837A905D7ECA2EE836B6B2ADA23C23154";
const s = "0xFBA88A529F675D6686EE632B09EC581AB08F72B458904BB3396D10FA66D11477";

describe("NZCOVIDBadge only mint", function () {
  let covidBadge: NZCOVIDBadge

  before(async () => {
    const NZCOVIDBadge = await ethers.getContractFactory("NZCOVIDBadge");
    covidBadge = await NZCOVIDBadge.deploy("NZ COVID Badge", "NZCP");
    await covidBadge.deployed();
  })

  it("Should mint", async function () {
    const mintTx = await covidBadge.mint(a, b, c, input, [r, s])
    await mintTx.wait();
  });
});

describe("NZCOVIDBadge check logic", function () {
  let covidBadge: NZCOVIDBadge

  before(async () => {
    const NZCOVIDBadge = await ethers.getContractFactory("NZCOVIDBadge");
    covidBadge = await NZCOVIDBadge.deploy("NZ COVID Badge", "NZCP");
    await covidBadge.deployed();
  })

  it("Should mint", async function () {
    await expect(covidBadge.tokenURI(0)).to.be.revertedWith("URI query for nonexistent token");
    const mintTx = await covidBadge.mint(a, b, c, input, [r, s])
    await mintTx.wait();
    expect(await covidBadge.tokenURI(0)).to.equal("https://i.imgur.com/QYKQsql.jpg");
  });

  it("Should not mint again", async function () {
    expect(await covidBadge.tokenURI(0)).to.equal("https://i.imgur.com/QYKQsql.jpg");
    await expect(covidBadge.mint(a, b, c, input, [r, s])).to.be.revertedWith("Already minted");
  });

  // it("Should show as minted for this cred subj hash", async function () {
  //   expect(await covidBadge.hasMinted(credSubjHash)).to.equal(1);
  // });

  it("Should show the signer as owner for token id 0", async function () {
    expect(await covidBadge.getOwner(0)).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  });
});
