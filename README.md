# Gasless Transaction Forwarder

## Project Overview
This project implements a **Gasless Transaction Forwarder**, allowing users to send ERC-20 and ERC-721 transactions without holding ETH. The system consists of a forwarder smart contract, a backend relay service, and a frontend interface for users to interact with the system.

---

## Table of Contents
- [Architecture](#architecture)
- [Features](#features)
- [Setup Guide](#setup-guide)
- [Project Structure](#project-structure)
- [Privacy Measures](#privacy-measures)
- [Technologies Used](#technologies-used)
- [Security Considerations](#security-considerations)
- [Our Team](#our-team)
- [Deployment](#deployment)

---

## Architecture
The solution consists of three main components:

1. **Smart Contracts** (Solidity):
   - `GaslessForwarder.sol`: The core contract that relays transactions on behalf of users.
   - `MockRecipient.sol`: A sample contract for testing the forwarder's functionality.

2. **Backend** (Go):
   - Responsible for relaying signed transactions to the blockchain.
   - Handles user requests for balance and transaction history.

3. **Frontend** (React/React Native):
   - Provides a simple UI for users to input transaction details and submit them for forwarding.

---

## Features
- **Gasless Transactions:** Users can send transactions without needing ETH.
- **Multi-token Support:** Supports both ERC-20 and ERC-721 tokens.
- **User-friendly UI:** Simple interface to input and track transactions.
- **Security:** Implements signature verification to ensure transaction authenticity.
- **Auditable:** Designed to achieve a high Solidity Shield audit score.

---

## Setup Guide

### Environment Variables

#### Contracts
Create a `.env` file in the `contracts` directory with the following content:
```
SEPOLIA_URL=https://sepolia.infura.io/v3/02084dda02bc47f78913a11ea476be56
DEPLOYER_PRIVATE_KEY=your_secret_deployer_private_key
ETHERSCAN_API_KEY=K1PCV6JTTPBVJBGNBPRNWED435CVBH5AJD
```

#### Backend
Create a `.env` file in the `backend` directory with the following content:
```
INFURA_RPC_URL=https://sepolia.infura.io/v3/02084dda02bc47f78913a11ea476be56
FORWARDER_CONTRACT_ADDRESS=0x8336Fe9c782C385D888DA4C3549Aa3AADb801FAC
RELAYER_PRIVATE_KEY=you_relayer_private_secret_key
PORT=4000
PRIVATE_KEY=you_relayer_private_secret_key
CHAIN_ID=11155111
ERC721_CONTRACT_ADDRESS=0x8336Fe9c782C385D888DA4C3549Aa3AADb801FAC
ETHERSCAN_API_KEY=K1PCV6JTTPBVJBGNBPRNWED435CVBH5AJD
```


### Prerequisites
Ensure you have the following installed:
- Node.js (v18+)
- Go (v1.19+)
- Hardhat (for smart contract deployment)
- MetaMask (for frontend testing)

### 1. Clone the repository
```bash
git clone <repo_url>
cd Gasless-Forwarder-main
```

### 2. Smart Contracts
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network <network>
```

### 3. Backend
```bash
cd backend
go mod tidy
go run main.go
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. React Native App
```bash
cd "React Native App"
npm install
npx expo start
```

---

## Project Structure
```
Gasless-Forwarder-main/
│-- contracts/              # Solidity smart contracts
│-- backend/                # Go backend service
│-- frontend/               # React frontend
│-- React Native App/       # Mobile frontend (React Native)
│-- README.md               # Project documentation
│-- LICENSE                 # License file
```

---

## Privacy Measures
- **Off-chain Signing:** Users sign transactions off-chain to avoid exposing private keys.
- **Data Minimization:** Only necessary transaction data is stored.
- **Secure Relayer:** Ensures transactions are relayed securely without tampering.

---

## Technologies Used
- **Frontend:** React, React Native, TailwindCSS
- **Backend:** Go, Gin framework
- **Smart Contracts:** Solidity, Hardhat
- **Blockchain:** Ethereum, MetaMask integration
- **Security:** ECDSA signature verification

---

## Security Considerations
- **Signature Verification:** Ensures transactions are authorized by the sender.
- **Reentrancy Protection:** Smart contracts are safeguarded against reentrancy attacks.
- **Gas Optimization:** Efficient contract design to minimize gas costs.

---

## Our Team
We are a dedicated team of blockchain developers, cloud/backend developers, full stack developers, software engineers, and security experts passionate about decentralized finance and improving blockchain accessibility. Our goal is to create seamless, secure, and efficient blockchain solutions.

- [Shivam](https://github.com/myselfshivams)
- [Ritik Gupta](https://github.com/ritikgupta06)
- [Sanskar Soni](https://github.com/sunscar-sony)
- [Parth Agarwal](https://github.com/TheInfernitex)
- [Ashish Verma](https://github.com/AshishJii)



[![Contributors](https://contrib.rocks/image?repo=myselfshivams/Gasless-Forwarder)](https://github.com/myselfshivams/Gasless-Forwarder/contributors)

---

## Project Demonstration
Watch our project demonstration video here: [YouTube](https://youtu.be/pHNOJeRUE5U?si=BOO7bKruFSp5W5Tv)

---

## Deployment
Watch our project demonstration video here: [YouTube](https://youtu.be/pHNOJeRUE5U?si=BOO7bKruFSp5W5Tv)
- **Backend:** Deployed on [Railway.app](https://backend-hackiitk.itshivam.me/)
- **Frontend:** Deployed on [Vercel](https://hackiitk.itshivam.me)

---

## Acknowledgment
Special thanks to HACKIITK for organizing this hackathon.




