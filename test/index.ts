import { expect } from "chai";
import { ethers } from "hardhat";
import { NZCOVIDBadge } from "../typechain";

const a: [bigint, bigint] = [
  21712524016843841929766536201888560648857890422372327803365878426240102987793n,5075342295679787150681033631324135906435095809231582542634801979674780432064n
]

const b: [[bigint, bigint],[bigint, bigint]] = [
  [7818191555620401580672049289148257788984218310255634594535119905818967986886n,14138791639087572271201229627341558653518178417588790733975135137554293449621n],[9466809780566433857189076831288509640645801599439112129989043352472884045389n,1199089022102257795437470281269334442344545772929174569233517446927905939362n]
]

const c: [bigint, bigint] = [
  2579954257802019952813061467181718471906509047142139987018853707674430697250n,8449555627056842963389541254564868588416003840045379856312203144532034110424n
]

const input: [bigint, bigint, bigint] = [
  332803489704591243828114355286261993890678185647226483553216796488284950010n,240632669724126768245081263063289290029698925475588899341139051131709220053n,
  705828043068190888149879618290261456367875573891812390652411515440363471n
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