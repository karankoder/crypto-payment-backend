# Non-Custodial Crypto Payment Backend

This repository contains the backend service for a non-custodial crypto payment system, built as part of a technical exercise. The service provides secure, production-ready endpoints for wallet creation, balance retrieval, and P2P transfer simulation on the Polygon Amoy testnet.

It also includes a bonus AI feature that integrates with the **Google Gemini API** to provide an analysis of a wallet's transaction history.

## Objective

The goal is to build a simple backend service that interacts with the blockchain and provides secure endpoints for:

1.  Wallet creation (non-custodial).
2.  Balance retrieval for a user’s address.
3.  P2P crypto transfer simulation between two users.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Blockchain Interaction:** Ethers.js (v6)
- **Network:** Polygon Amoy (Testnet)
- **Environment:** `dotenv`
- **Security:** `express-rate-limit` (for basic DDOS protection)
- **AI Service:** Google GenAI SDK (`@google/genai`)

## Core Architecture: Secure Faucet Simulation

This project adheres to a strict non-custodial security model.

- **Wallet Creation:** The `/api/v1/wallet/create` endpoint generates a wallet and returns its credentials immediately. **The server does not store the private key**, simulating a real-world scenario where key generation happens client-side.
- **Transfer Simulation:** To simulate a P2P transfer _without_ ever asking a user for their private key, the backend manages a central "faucet" wallet (funded with testnet MATIC). The `/api/v1/wallet/transfer` endpoint securely signs and broadcasts a transaction _from this server wallet_ to the user-specified recipient. This demonstrates the ability to create and send a transaction securely.
- **Security:** Basic API rate limiting is applied to all `/api/v1/` endpoints to prevent simple brute-force attacks and abuse.

## Bonus: AI Wallet Analyzer

This project successfully implements the optional bonus feature for AI-powered data analysis.

- **Endpoint:** A new endpoint `GET /api/v1/wallet/analyze/:address` is available.
- **Data Fetching:** This endpoint calls the **Etherscan API (v2)** directly using `axios`. It fetches _both_ normal (`txlist`) and internal (`txlistinternal`) transactions to build a complete activity profile.
- **AI Integration:** The combined and sorted transaction history is simplified and sent as a prompt to the **Google Gemini API** (`gemini-2.5-flash` model).
- **Result:** The API returns a brief, human-readable analysis of the wallet's behavior, identifying its likely profile (e.g., "developer," "new user," "bot") and key activity patterns.

## Setup & Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd crypto-payment-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root of the project. You can copy the example below.

**`.env.example`**

```.env
# Port for the server
PORT=4000
# Get a free API Key from Infura
INFURA_API_KEY="YOUR_INFURA_API_KEY_HERE"

# This is a wallet you create and fund with test MATIC from a faucet
# The server will use this wallet to send simulated transfers
SERVER_WALLET_PRIVATE_KEY="0x..."

# Get a free API Key from Google AI Studio
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# Get a free API Key from Etherscan
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY_HERE"
```

**How to get keys:**

1.  **`INFURA_API_KEY`**:
    - Sign up at [Infura](https://infura.io/) and create a new project.
    - Copy the Project ID and paste it as your `INFURA_API_KEY`.
2.  **`SERVER_WALLET_PRIVATE_KEY`**:
    - Run the server (see step 4) and hit the `POST /api/v1/wallet/create` endpoint to generate a new wallet.
    - Copy the `privateKey` from the response and paste it here.
    - Copy the `address` and get test MATIC from a [Polygon Faucet](https://faucet.polygon.technology/).
    - Use the `GET /api/v1/wallet/balance/:address` endpoint to confirm your server wallet is funded.
3.  **`GEMINI_API_KEY`**: Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
4.  **`ETHERSCAN_API_KEY`**: Sign up for a free account at [Etherscan](https://etherscan.io/). Go to your dashboard and create an API key.

### 4. Run the Server

This command uses `nodemon` to run the server in development mode, which will auto-restart on file changes.

```bash
npm run dev
```

The server will be running at `http://localhost:4000`.

---

## API Endpoints (cURL)

### 1. Create a New Wallet (Non-Custodial)

**`POST /api/v1/wallet/create`**

```bash
curl -X POST http://localhost:4000/api/v1/wallet/create
```

**Response:**

```json
{
  "success": true,
  "note": "Wallet created successfully. Save these credentials securely. The server does NOT store them.",
  "data": {
    "address": "0x...",
    "privateKey": "0x...",
    "mnemonic": "word1 word2 word3 ..."
  }
}
```

### 2. Get Wallet Balance

**`GET /api/v1/wallet/balance/:address`**

```bash
curl http://localhost:4000/api/v1/wallet/balance/0xYourWalletAddressHere
```

**Response:**

```json
{
  "success": true,
  "data": {
    "address": "0xYourWalletAddressHere",
    "balance": "0.49",
    "unit": "MATIC"
  }
}
```

### 3. Simulate a P2P Transfer

**`POST /api/v1/wallet/transfer`**

```bash
curl -X POST http://localhost:4000/api/v1/wallet/transfer \
     -H "Content-Type: application/json" \
     -d '{
           "toAddress": "0xRecipientAddressHere",
           "amount": "0.01"
         }'
```

**Response:**

```json
{
  "success": true,
  "message": "Transfer simulation successful.",
  "data": {
    "success": true,
    "from": "0x... (server wallet)",
    "to": "0x... (recipient)",
    "amount": "0.01",
    "unit": "MATIC",
    "transactionHash": "0x...",
    "explorerUrl": "[https://Amoy.polygonscan.com/tx/0x](https://Amoy.polygonscan.com/tx/0x)..."
  }
}
```

### 5. (Bonus) Analyze Wallet Activity with AI

**`GET /api/v1/wallet/analyze/:address`**

```bash
curl http://localhost:4000/api/v1/wallet/analyze/0xYourWalletAddressHere
```

**Response:**

```json
{
  "success": true,
  "data": {
    "analysis": "This wallet appears to be a new user, primarily receiving small test amounts of MATIC from a faucet. The activity is low and consistent with initial setup or testing."
  }
}
```
