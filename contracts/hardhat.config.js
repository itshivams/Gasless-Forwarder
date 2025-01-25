require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL || "",  // Use Sepolia RPC URL
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [`0x${process.env.DEPLOYER_PRIVATE_KEY}`] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
