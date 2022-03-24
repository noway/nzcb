import { expect } from "chai";
import { ethers } from "hardhat";
import { NZCOVIDBadge } from "../typechain";

const a: [bigint, bigint] = [
  8364118140517721840860371407393664075105621701943270335998171088101662655657n,6495749104316326208913877534998826627709346866324015221516908121725008006646n
]

const b: [[bigint, bigint],[bigint, bigint]] = [
  [2766813186201580808471400133330182508032977537156820934301702129835881956091n,9305225595386151871351825680638887574951634752119617554552781841326447665755n],[15770124291200623975842655822547246034990672837070078267485505091495182756137n,14471068475649576405198846120099612006725104845674886867480680501174315469476n]
]

const c: [bigint, bigint] = [
  5862587169057217702384032150574207220602034554318178479454403370110498826227n,12390513974665409786147139613667742432500704422021477613581042077361236632569n
]

const input: [bigint, bigint, bigint] = [
  8464235439336389695359576364537904521787463454426143836621154307990710930n,334204042160295982690797293769892102755483197293558786265320143920457223185n,430986738242466594046256449766711430553001781321985096118861657637482948096n
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
