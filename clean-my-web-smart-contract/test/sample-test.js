const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("clean-my-web test", function() {
  it("should pass this test!", async function () {
    const CMW = await ethers.getContractFactory("clean_my_web");
    const cmw = await CMW.deploy();
    await cmw.deployed();

    // deploy contract
    console.log(await cmw.get_owner());
    console.log("Contract delopyed")
    console.log("-----------------------------")

    // upload data
    const timeStamp = (await ethers.provider.getBlock("latest")).timestamp
    console.log("Data uploaded")
    console.log(await cmw.upload(["0x133F91C51190BCf9f172f204Dfc4776865aC1278", timeStamp, ["url1"], ["fe1"], [1]]));
    console.log("-----------------------------")

    // pop data for AI component
    p = await cmw.pop()
    const result = await p.wait();
    console.log("Data poped")
    console.log(result.events[0].args.data);
    console.log("-----------------------------")

    // view all user uploaded data
    console.log(await cmw.get_contribution("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));
  });

});
