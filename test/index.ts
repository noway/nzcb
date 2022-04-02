import { expect } from "chai";
import { ethers } from "hardhat";
import { NZCOVIDBadge } from "../typechain";

const a: [bigint, bigint] = [
  4121745176342597789136770973022776790739432511025396054059983293468563743385n, 5487528317701654699472294238975712264208021864345680894679201230717526293867n
]

const b: [[bigint, bigint],[bigint, bigint]] = 
  [[11073023599814217189304591557517845609121126091167894404602868744081798402214n, 8789603760936810492318929603762240484850214444021387445080201431595418948611n], [11418442315355766077534296427282460642855786446073237008164794662509203235107n, 20737180799573811520838532444804591001462475093507592260093850141052562199311n]]

const c: [bigint, bigint] = [1028546350178609515692678068031149437504661244443131952435099557891040235077n, 10879563735156659176541504877990982450500988408022307877598352088723069095847n]

const input: [bigint, bigint, bigint] = [
  8464235439336389695359576364537904521787463454426143836621154307990710930n, 334204042160295982690797293769892102755483197293558786265320143920457223185n, 430989588176825940781496969207245773238692149205558489568811355968561479680n
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
