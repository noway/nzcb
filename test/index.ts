import { expect } from "chai";
import { ethers } from "hardhat";
import { NZCOVIDBadge } from "../typechain";

const a: [bigint, bigint] = [
  2413391957306416879755672165839227511888132356399424775355345856241112293721n,
  13931270731524046704514486289976669621072658090814118780240875337333774856220n
]

const b: [[bigint, bigint],[bigint, bigint]] = [
  [18645942184163074133299788195609994083451147807080885167148110280366240232316n,
  3857674820609801900485084133126106583542946546632816441800593714520045481321n],
  [15634004475104799655024666620412006603696417909682466873437109970268582524515n,
  10501392570177017358779098058960901055825742211380889094188634202333085290938n]
]

const c: [bigint, bigint] = [
  15022058733071704892454147448752875877136128151600850066843232623475037789182n,
  4211415864446300664403966222615047763925920104037096024442605395061120090418n
]

const input: [bigint, bigint, bigint, bigint] = [
  129578305073335822173767984276367468793130182600113734038707080603768345376n,
  62024847724068782200225174173435009728881745526708735782614853437964185021n,
  87416042052223851968717558336607200553245568129208585369755585513710204737n,
  180691979025456867366369182282306932830176146916303972007017347952733048712n
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
