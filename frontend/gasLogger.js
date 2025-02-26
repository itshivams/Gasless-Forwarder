// note: to add in env: PRIVATE_KEY, INFURA_KEY (RPC URL)   

import "dotenv/config";
import { ethers } from "ethers";
import fs from "fs";

const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const recipient = process.env.RECIPIENT;

const CSV_FILE = "gas_readings.csv";
if (!fs.existsSync(CSV_FILE)) {
    fs.writeFileSync(CSV_FILE, "Timestamp,Transaction Type,Network,Gas Used,Tx Hash\n");
}

async function sendEthTransaction() {
    try {
        const amount = ethers.parseUnits("0.00001", "ether");
        const tx = { to: recipient, value: amount };
        
        const txResponse = await wallet.sendTransaction(tx);
        const receipt = await txResponse.wait();
        
        console.log(`ETH Transfer - Gas Used: ${receipt.gasUsed.toString()}, Tx Hash: ${txResponse.hash}`);

        fs.appendFileSync(CSV_FILE, `${Date.now()},ETH Transfer,Sepolia,${receipt.gasUsed.toString()},${txResponse.hash}\n`);
    } catch (error) {
        console.error("ETH Transaction Error:", error);
    }
}

async function sendErc20Transaction() {
    try {
        const erc20Abi = [
            "function transfer(address to, uint amount) public returns (bool)",
            "function balanceOf(address owner) view returns (uint)"
        ];
        const erc20Address = "0x8336Fe9c782C385D888DA4C3549Aa3AADb801FAC"; // Your ERC20 contract address
        const erc20Contract = new ethers.Contract(erc20Address, erc20Abi, wallet);

        const balance = await erc20Contract.balanceOf(wallet.address);
        const formattedBalance = ethers.formatUnits(balance, 18);
        console.log("Your ERC20 Balance:", formattedBalance);

        if (balance < ethers.parseUnits("0.00001", "ether")) {
            console.error("❌ Insufficient ERC20 balance for transaction.");
            return;
        }
        const txResponse = await erc20Contract.transfer(recipient, ethers.parseUnits("0.00001", "ether"));
        const receipt = await txResponse.wait();

        console.log(`✅ ERC20 Transfer Successful - Gas Used: ${receipt.gasUsed.toString()}, Tx Hash: ${txResponse.hash}`);
        fs.appendFileSync(CSV_FILE, `${Date.now()},ERC20 Transfer,Sepolia,${receipt.gasUsed.toString()},${txResponse.hash}\n`);

    } catch (error) {
        console.error("❌ ERC20 Transaction Error:", error);

        fs.appendFileSync(CSV_FILE, `${Date.now()},ERC20 Transfer Failed,Sepolia,Error: ${error.message},N/A\n`);
    }
}
async function main() {
    console.log("Starting gas usage logging...");
    await sendEthTransaction();
    await sendErc20Transaction();
    console.log("Gas readings saved in gas_readings.csv");
}

main();

