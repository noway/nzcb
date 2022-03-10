import { expect } from "chai";
import { ethers } from "hardhat";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("NZ COVID Badge", "NZCP");
    await greeter.deployed();

    const r = "0xD2E07B1DD7263D833166BDBB4F1A093837A905D7ECA2EE836B6B2ADA23C23154";
    const s = "0xFBA88A529F675D6686EE632B09EC581AB08F72B458904BB3396D10FA66D11477";


    const setGreetingTx = await greeter.mint(
      [0,0],
      [[0,0],[0,0]],
      [0,0],
      [0,0,0],
      "0x271CE33D671A2D3B816D788135F4343E14BC66802F8CD841FAAC939E8C11F3EE",[r,s]
    )

    await setGreetingTx.wait();

    expect(await greeter.tokenURI(0)).to.equal("https://i.imgur.com/QYKQsql.jpg");
  });
});
