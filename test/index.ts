import { expect } from "chai";
import { ethers } from "hardhat";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("NZ COVID Badge", "NZCP");
    await greeter.deployed();

    const setGreetingTx = await greeter.mint([0,0],[[0,0],[0,0]],[0,0],[0,0,0],0,0,0)

    await setGreetingTx.wait();

    expect(await greeter.tokenURI(0)).to.equal("https://i.imgur.com/QYKQsql.jpg");
  });
});
