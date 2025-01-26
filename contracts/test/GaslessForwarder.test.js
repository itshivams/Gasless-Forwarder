const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GaslessForwarder", function () {
  let GaslessForwarder;
  let forwarder;
  let owner, addr1, relayer;

  beforeEach(async function () {
    [owner, addr1, relayer] = await ethers.getSigners();


    const Forwarder = await ethers.getContractFactory("GaslessForwarder");
    forwarder = await Forwarder.deploy();
    await forwarder.waitForDeployment();


    await forwarder.addRelayer(relayer.address);
  });

  it("should deploy the contract correctly", async function () {
    expect(forwarder.target).to.properAddress;  
  });

  it("should not allow unauthorized relayers", async function () {
    const forwardRequest = {
      from: owner.address,
      to: addr1.address,
      value: ethers.parseEther("1"),
      nonce: 0,
      data: "0x",
    };

    const messageHash = ethers.solidityPackedKeccak256(
      ["address", "address", "uint256", "uint256", "bytes"],
      [forwardRequest.from, forwardRequest.to, forwardRequest.value, forwardRequest.nonce, forwardRequest.data]
    );

    const signature = await owner.signMessage(ethers.getBytes(messageHash));

    await expect(
      forwarder.connect(addr1).executeTransaction(forwardRequest, signature)
    ).to.be.revertedWith("Not an authorized relayer");
  });

  it("should reject transactions with invalid signatures", async function () {
    const forwardRequest = {
      from: owner.address,
      to: addr1.address,
      value: ethers.parseEther("1"),
      nonce: 0,
      data: "0x",
    };

    const invalidSignature = await addr1.signMessage(ethers.getBytes(ethers.solidityPackedKeccak256(
      ["address", "address", "uint256", "uint256", "bytes"],
      [forwardRequest.from, forwardRequest.to, forwardRequest.value, forwardRequest.nonce, forwardRequest.data]
    )));

    await expect(
      forwarder.connect(relayer).executeTransaction(forwardRequest, invalidSignature)
    ).to.be.revertedWith("Invalid signature");
  });

 
  it("should not allow non-owners to add relayers", async function () {
    await expect(forwarder.connect(addr1).addRelayer(addr1.address))
      .to.be.revertedWith("Only owner can add relayers");
  });
  

  
 
});
