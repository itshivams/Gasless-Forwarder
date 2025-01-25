import { ethers } from "ethers";

const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function sendGaslessTransaction(recipient, amount) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    // Prepare transaction request
    const forwardRequest = {
        from: userAddress,
        to: recipient,
        value: ethers.utils.parseEther(amount).toString(),
        nonce: 0, // Ideally fetched from backend
        data: "0x",
    };

    // Hash the request
    const hash = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256", "bytes"],
        [forwardRequest.from, forwardRequest.to, forwardRequest.value, forwardRequest.nonce, forwardRequest.data]
    );

    // Sign the request with MetaMask
    const signedMessage = await signer.signMessage(ethers.utils.arrayify(hash));

    // Send the transaction to the Go backend
    const response = await fetch(`${backendApiUrl}/relay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...forwardRequest, signed: signedMessage }),
    });

    if (!response.ok) {
        throw new Error("Transaction relay failed");
    }

    return await response.json();
}
