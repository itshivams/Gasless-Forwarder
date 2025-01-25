import { Wallet, keccak256, isAddress, getAddress, parseUnits, AbiCoder, toUtf8Bytes } from "ethers";
import { JsonRpcProvider, Contract } from "ethers";

// Load environment variables
const contractAddress = process.env.NEXT_PUBLIC_FORWARDER_ADDRESS;
const rpcUrl = process.env.NEXT_PUBLIC_INFURA_RPC_URL;

if (!rpcUrl || !contractAddress) {
    throw new Error("Missing environment variables");
}

// Setup provider and contract instance
const provider = new JsonRpcProvider(rpcUrl);

const forwarderABI = [
    "function owner() view returns (address)",
    "function addRelayer(address _relayer) external",
    "function executeTransaction(tuple(address from, address to, uint256 value, uint256 nonce, bytes data), bytes signature) external"
];

const contract = new Contract(contractAddress, forwarderABI, provider);

// Function to get contract owner
export async function getOwner() {
    try {
        const owner = await contract.owner();
        return owner;
    } catch (error) {
        console.error("Error fetching contract owner:", error);
        return null;
    }
}

// Function to send a gasless transaction
export async function sendTransaction(to, value, data) {
    try {
        const wallet = new Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
        const contractWithSigner = contract.connect(wallet);

        const nonce = 1;  // Increment based on past transactions
        const formattedData = data && data.trim() !== "" ? data : "0x";

        if (!isAddress(to)) {
            throw new Error("Invalid recipient address");
        }

        const recipient = getAddress(to);
        const formattedValue = parseUnits(value.toString(), "ether");

        const abiCoder = AbiCoder.defaultAbiCoder();
        const encodedData = abiCoder.encode(
            ["address", "address", "uint256", "uint256", "bytes"],
            [wallet.address, recipient, formattedValue, nonce, formattedData]
        );

        const messageHash = keccak256(toUtf8Bytes(encodedData));
        const signature = await wallet.signMessage(toUtf8Bytes(messageHash));

        const tx = await contractWithSigner.executeTransaction(
            { from: wallet.address, to: recipient, value: formattedValue, nonce, data: formattedData },
            signature
        );

        await tx.wait();
        return tx.hash;
    } catch (error) {
        console.error("Error sending transaction:", error);
        throw error;
    }
}
