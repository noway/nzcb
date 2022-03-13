import { expect } from "chai";
import { ethers } from "hardhat";
import { NZCOVIDBadge } from "../typechain";

const a: [bigint, bigint] = [
  15317026981204904606158241647437754136144632105084051828413401450576753531815n,
  7086229653386541240796277561499005540530934966461814919250558830585279441290n
]

const b: [[bigint, bigint],[bigint, bigint]] = [
  [20332246645845093929520742716323850294216803881964529014808971167285596201944n,
  20901603467420043024055218006215133024429281417301493734040930448867711379605n],
  [8213903306301046629339928913250704606805879580530540159481102552207366941952n,
  20464746117808031265726662542679740947351276020463709598501071694703477952216n]
]

const c: [bigint, bigint] = [
  8812126784188266899693003477284477321581078214491020210810866577117715551006n,
  11403603417223316336774892377454457036853217806721337759178753189042632010646n
]

const input: [bigint, bigint, bigint] = [
  332803489704591243828114355286261993890678185647226483553216796488284950010n,
  240632669724126768245081263063289290029698925475588899341139051131709220053n,
  164338397576518097927300170597215522166312572986775168835286991n
]

const credSubjHash = "5fb355822221720ea4ce6734e5a09e459d452574a19310c0cea7c141f43a3dab"

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

/*
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

  it("Should show as minted for this cred subj hash", async function () {
    expect(await covidBadge.hasMinted(credSubjHash)).to.equal(1);
    // await expect(covidBadge.mint(a, b, c, input, [r, s])).to.be.revertedWith("Already minted");
  });
});

*/