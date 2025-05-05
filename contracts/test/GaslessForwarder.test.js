const { expect } = require("chai");
const { ethers } = require("hardhat");
const Table = require("cli-table3");  // ✅ Import cli-table3 for formatting

describe("Gas Usage Benchmark", function () {
  let owner, user, recipients;
  let standardForwarder, optimizedForwarder, token;
  const dataset = [1, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100];

  before(async function () {
    [owner, user, ...recipients] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("TestToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    const StandardForwarder = await ethers.getContractFactory("StandardForwarder");
    standardForwarder = await StandardForwarder.deploy();
    await standardForwarder.waitForDeployment();

    const OptimizedForwarder = await ethers.getContractFactory("OptimizedForwarder");
    optimizedForwarder = await OptimizedForwarder.deploy();
    await optimizedForwarder.waitForDeployment();

    // ✅ Fetch contract addresses
    const standardForwarderAddress = await standardForwarder.getAddress();
    const optimizedForwarderAddress = await optimizedForwarder.getAddress();
    const tokenAddress = await token.getAddress();

    // ✅ Approve tokens for both forwarders
    await token.connect(user).approve(standardForwarderAddress, ethers.parseEther("1000000"));
    await token.connect(user).approve(optimizedForwarderAddress, ethers.parseEther("1000000"));
  });

  async function benchmarkForwarder(forwarder, batchSize) {
    const initialBalance = ethers.parseEther("100");
    await token.transfer(user.address, initialBalance);
    await token.connect(user).approve(forwarder.target, initialBalance);

    let currentNonce = await forwarder.getNonce(user.address);
    console.log("Fetched nonce:", currentNonce.toString());
    currentNonce = Number(currentNonce);

    const batchSizeActual = Math.min(batchSize, recipients.length);
    const batchRecipients = recipients.slice(0, batchSizeActual).map(signer => signer.address);
    const tokensArray = new Array(batchSizeActual).fill(token.target);
    const batchValues = Array(batchSizeActual).fill(ethers.parseEther("1"));
    const noncesBatch = Array.from({ length: batchSizeActual }, (_, i) => currentNonce + i);

    console.log("✅ Checking array lengths:");
    console.log("Tokens:", tokensArray.length);
    console.log("Recipients:", batchRecipients.length);
    console.log("Values:", batchValues.length);
    console.log("Nonces:", noncesBatch.length);

    if (
        tokensArray.length !== batchRecipients.length ||
        tokensArray.length !== batchValues.length ||
        tokensArray.length !== noncesBatch.length
    ) {
        throw new Error("🚨 Array length mismatch before calling forwardBatch!");
    }

    const tx = await forwarder
        .connect(user)
        .forwardBatch(tokensArray, batchRecipients, batchValues, noncesBatch);
    const receipt = await tx.wait();

    return {
        executionTime: tx.gasPrice?.toString() || "N/A",
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber,
    };
  }

  it("Benchmark Standard and Optimized Forwarders", async function () {
    const table = new Table({
      head: ["Batch Size", "Execution Time (ns)", "Gas Used", "Block", "Optimized Gas", "Savings (%)"],
      colWidths: [12, 20, 12, 10, 18, 12],
    });

    for (const batchSize of dataset) {
      const standardData = await benchmarkForwarder(standardForwarder, batchSize);
      const optimizedData = await benchmarkForwarder(optimizedForwarder, batchSize);

      const savings = ((standardData.gasUsed - optimizedData.gasUsed) / standardData.gasUsed) * 100;

      table.push([
        batchSize,
        standardData.executionTime,
        standardData.gasUsed,
        standardData.blockNumber,
        optimizedData.gasUsed,
        savings.toFixed(2) + "%",
      ]);
    }

    console.log(table.toString());
  });
});
