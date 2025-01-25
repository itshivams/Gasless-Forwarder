const hre = require("hardhat");

async function main() {
    console.log("Deploying GaslessForwarder contract...");

    // Ensure this matches your Solidity contract's name
    const Forwarder = await hre.ethers.getContractFactory("GaslessForwarder");
    const forwarder = await Forwarder.deploy();

    await forwarder.deployed();
    console.log("Gasless Forwarder deployed to:", forwarder.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
