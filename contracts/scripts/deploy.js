const hre = require("hardhat");

async function main() {
    console.log("Deploying Gasless Forwarder contract...");

    const Forwarder = await hre.ethers.getContractFactory("GaslessForwarder");
    
    // Deploy the contract
    const forwarder = await Forwarder.deploy();

    // Ensure deployment is complete before proceeding
    await forwarder.waitForDeployment();

    // Get the deployed contract address
    const deployedAddress = await forwarder.getAddress();

    console.log("Gasless Forwarder deployed to:", deployedAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
