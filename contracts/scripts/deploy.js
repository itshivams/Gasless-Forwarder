const hre = require("hardhat");

async function main() {
    const GaslessForwarder = await hre.ethers.getContractFactory("GaslessForwarder");
    const forwarder = await GaslessForwarder.deploy();
    await forwarder.deployed();

    console.log("Gasless Forwarder deployed to:", forwarder.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
