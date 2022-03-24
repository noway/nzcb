import { expect } from "chai";
import { ethers } from "hardhat";
import { NZCOVIDBadge } from "../typechain";

const a: [bigint, bigint] = [
  8597557781016496003027537579694076092297390011864988902219201922935752645746n,8931100376601573674064058062499640884774662426058703002862543008687265592282n
]

const b: [[bigint, bigint],[bigint, bigint]] = [
  [4411849131174862648756684194445007816264617931919995010671010299162620265791n,1709164461207037008167533633040715637912378594731718065782070364111815806688n],[1752095404454030132682852204558613848979839700175904787812356348869278344523n,17606638074752786734074997383507264692075550608059711408892698137225725210995n]
]

const c: [bigint, bigint] = [
  21707915624626376132942922905957627548685346322158987565257432993929278333455n,19197323138066667430505536726114198190535799572374290520045427791438709088133n
]

const input: [bigint, bigint, bigint] = [
  8464235439336389695359576364537904521787463454426143836621154307990710930n,334204042160295982690797293769892102755483197293558786265320143920457223185n,430989081135164610074926275995172638632037513544342768349773652710659793510n
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
