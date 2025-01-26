# Gasless Transaction Forwarder - Frontend

## Project Overview
The **Gasless Transaction Forwarder** frontend provides a user-friendly interface for interacting with the gasless transaction system. It allows users to send ERC-20 and ERC-721 transactions without requiring ETH, leveraging the backend and smart contract components.

---

## Table of Contents
- [Features](#features)
- [Setup Guide](#setup-guide)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Deployment](#deployment)

---

## Features
- **User-friendly UI:** Simple and intuitive interface for users to input transaction details.
- **MetaMask Integration:** Allows users to connect their wallets seamlessly.
- **Real-time Updates:** Fetches and displays transaction statuses and balances dynamically.
- **Token Support:** Handles both ERC-20 and ERC-721 transactions.
- **Secure Interactions:** Communicates securely with the backend and smart contracts.

---

## Setup Guide

### Prerequisites
Ensure you have the following installed:
- Node.js (v18+)
- MetaMask (for testing and wallet connection)

### Steps
1. Clone the repository:
    ```bash
    git clone <repo_url>
    cd Gasless-Forwarder-main/frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Open the application in your browser:
    - By default, the application runs at `http://localhost:3000`.

---

## Project Structure
```
frontend/
│-- components/         # Reusable React components
│-- pages/              # Next.js pages
│-- public/             # Static assets
│-- styles/             # CSS and Tailwind configurations
│-- utils/              # Utility functions
│-- package.json        # Dependencies and scripts
```

---

## Technologies Used
- **Frontend Framework:** Next.js (React)
- **Styling:** TailwindCSS
- **Wallet Integration:** MetaMask
- **State Management:** React Context API

---

## Deployment
The frontend is deployed on [Vercel](https://hackiitk.itshivam.me).

---

## Acknowledgment
Special thanks to HACKIITK for organizing this hackathon and providing a platform to develop this project.

