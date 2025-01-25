const { ethers } = require("hardhat");

async function main() {
    const forwarderAddress = "0x8336Fe9c782C385D888DA4C3549Aa3AADb801FAC";
    const [deployer] = await ethers.getSigners();

    const forwarder = await ethers.getContractAt("GaslessForwarder", forwarderAddress);
    
    console.log("Adding relayer:", deployer.address);

    const tx = await forwarder.addRelayer(deployer.address);
    await tx.wait();

    console.log("Relayer added successfully:", deployer.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
