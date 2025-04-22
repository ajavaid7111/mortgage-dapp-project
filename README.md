# Decentralized Mortgage DApp

A simple decentralized application (DApp) demonstrating a basic mortgage concept built on the blockchain using Solidity, Hardhat, Ethers.js, and React.

This project allows a "lender" (the deployer) to create a loan contract specifying a "borrower" and a loan amount. The borrower can then connect their wallet and repay the loan amount directly through the frontend interface.

## Features

*   **Smart Contract:** A `Mortgage.sol` contract defining loan parameters (lender, borrower, amount) and repayment logic.
*   **Deployment:** Scripts to deploy the contract to a local Hardhat network or the Sepolia testnet.
*   **Frontend:** A React (Vite) application using Ethers.js and Tailwind CSS to interact with the deployed contract.
*   **Wallet Integration:** Connects to MetaMask to identify the user and sign transactions.
*   **Loan Details:** Displays information about the deployed loan contract (lender, borrower, amount, paid status).
*   **Loan Repayment:** Allows the designated borrower to pay back the loan amount via a transaction.

## Tech Stack

*   **Blockchain:** Solidity (Smart Contract Language)
*   **Development Environment:** Hardhat (Compile, Test, Deploy, Local Node)
*   **Frontend Library:** React (Vite)
*   **Ethereum Interaction:** Ethers.js
*   **Styling:** Tailwind CSS
*   **Wallet:** MetaMask (Browser Extension)

## Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended, e.g., v18 or v20)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
*   [Git](https://git-scm.com/)
*   [MetaMask](https://metamask.io/) browser extension installed and configured.

## Getting Started (Local Development)

Follow these steps to set up and run the project locally:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/ajavaid7111/mortgage-dapp-project.git # Replace with your repo URL if different
    cd mortgage-dapp-project
    ```

2.  **Install Root Dependencies (Hardhat):**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    # or
    # yarn install
    cd .. # Go back to the project root
    ```

4.  **Set Up Environment Variables:**
    *   Create a `.env` file in the project root by copying the example:
        ```bash
        cp .env.example .env
        ```
    *   Edit the `.env` file and add your deployer account's private key and a Sepolia RPC URL (needed for testnet deployment later, but good to set up now).
        *   **`PRIVATE_KEY`**: The private key for the account you want to use to deploy contracts. **Never commit your actual `.env` file!**
        *   **`SEPOLIA_RPC_URL`**: Get this from a node provider like [Alchemy](https://www.alchemy.com/), [Infura](https://www.infura.io/), or [QuickNode](https://www.quicknode.com/).

5.  **Run Local Hardhat Node:**
    *   Open a **new terminal** in the project root.
    *   Start the local blockchain node:
        ```bash
        npx hardhat node
        ```
    *   This will output ~20 local accounts with addresses and private keys. Keep this terminal running.

6.  **Deploy Contract Locally:**
    *   Open **another new terminal** in the project root.
    *   Run the deployment script targeting the local node:
        ```bash
        npx hardhat run scripts/deploy.js --network localhost
        ```
    *   **Copy the deployed contract address** from the terminal output (e.g., `Mortgage contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3`).

7.  **Update Frontend Contract Address:**
    *   Open the following frontend files:
        *   `frontend/src/components/LoanDetails.jsx`
        *   `frontend/src/components/PayLoan.jsx`
    *   Find the `contractAddress` constant near the top of **both** files.
    *   **Paste the contract address** you copied from the deployment step into this constant in **both files**. Save the files.

8.  **Run the Frontend:**
    *   In the terminal where you deployed (or a new one), navigate to the frontend directory and start the development server:
        ```bash
        cd frontend
        npm run dev
        ```
    *   Open your browser to the URL provided (usually `http://localhost:5173`).

9.  **Configure MetaMask for Localhost:**
    *   Open MetaMask in your browser.
    *   Go to Settings -> Networks -> Add Network -> Add a network manually.
    *   Use the following details:
        *   Network Name: `Hardhat Localhost` (or similar)
        *   New RPC URL: `http://127.0.0.1:8545`
        *   Chain ID: `31337`
        *   Currency Symbol: `ETH`
    *   Save the network.
    *   **Import Borrower Account:**
        *   In the Hardhat node terminal (Step 5), copy the **PRIVATE KEY** for **Account #1** (the second account listed - this is the default borrower in `deploy.js` unless you changed it).
        *   In MetaMask, click the circle icon -> Import account -> Select Type: Private Key -> Paste the key -> Import.
    *   Connect MetaMask to the frontend site, ensuring the **Hardhat Localhost** network is selected and the **imported Account #1** is active if you want to test paying the loan.

## Deployment to Sepolia Testnet

1.  **Ensure `.env` is Set Up:** Make sure your `.env` file contains a valid `PRIVATE_KEY` and `SEPOLIA_RPC_URL`.
2.  **Get Sepolia ETH:** Your deployer account (from `PRIVATE_KEY`) needs Sepolia ETH to pay for gas fees. Use a Sepolia faucet (e.g., [sepoliafaucet.com](https://sepoliafaucet.com/), [Infura Faucet](https://www.infura.io/faucet/sepolia)) to send test ETH to your deployer address.
3.  **Deploy:** Run the deployment script targeting Sepolia:
    ```bash
    npx hardhat run scripts/deploy.js --network sepolia
    ```
4.  **Copy New Address:** Copy the **new contract address** deployed to Sepolia from the terminal output.
5.  **Update Frontend:** Update the `contractAddress` constant in **both** `frontend/src/components/LoanDetails.jsx` and `frontend/src/components/PayLoan.jsx` with the **Sepolia address**.
6.  **Rebuild/Redeploy Frontend (If Applicable):** If your frontend is hosted, you'll need to rebuild and redeploy it with the updated address. For local testing, just restart the dev server (`npm run dev` in the `frontend` directory).
7.  **Configure MetaMask:** Switch MetaMask to the Sepolia network. Ensure the borrower account (specified in `deploy.js`) also has Sepolia ETH if you intend to test paying the loan on the testnet.

## Usage

1.  **Connect Wallet:** Open the frontend application in your browser and click the "Connect Wallet" button. Select your MetaMask account.
2.  **View Details:** The "Loan Details" section will fetch and display information from the deployed contract based on the configured `contractAddress`. It will show the Lender, Borrower, Loan Amount, and Paid Status.
3.  **Pay Loan:** If you are connected with the wallet address designated as the **Borrower** in the contract, and the loan is not yet paid, the "Pay Loan" button will be enabled. Clicking it will prompt MetaMask to send a transaction with the required loan amount to the contract's `payLoan` function.

## Running Tests

To run the Solidity contract tests (if any are defined in the `test/` directory):
