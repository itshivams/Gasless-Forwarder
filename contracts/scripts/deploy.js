const hre = require("hardhat");

async function main() {
    console.log("Deploying Gasless Forwarder contract...");

    const Forwarder = await hre.ethers.getContractFactory("GaslessForwarder");
    const forwarder = await Forwarder.deploy();

    await forwarder.deployed();
    console.log("Gasless Forwarder deployed to:", forwarder.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
