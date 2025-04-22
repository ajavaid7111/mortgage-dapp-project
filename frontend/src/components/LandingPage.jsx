import React from 'react';
import WalletConnect from './WalletConnect'; // Import WalletConnect

// Simple SVG Icon (House/Mortgage related) - You can replace this with a more complex one or an image
const MortgageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 dark:text-blue-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

// LandingPage component definition
// It receives the onConnect function as a prop from App.jsx
export default function LandingPage({ onConnect }) {
    return (
        <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-800 dark:to-blue-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">

            <MortgageIcon />

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Welcome to the Decentralized Mortgage DApp
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
                This application demonstrates a simple blockchain-based mortgage contract. A lender deploys the contract, specifying a borrower and loan amount. The DApp allows interaction with this contract.
            </p>

            {/* Add a section describing the functions */}
            <div className="mb-8 text-left max-w-xl px-4">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center">Key Functions:</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>
                        <span className="font-medium">Connect Wallet:</span> Securely connect using MetaMask to interact with the application.
                    </li>
                    <li>
                        <span className="font-medium">View Loan Details:</span> See the lender address, borrower address, total loan amount, and current repayment status.
                    </li>
                    <li>
                        <span className="font-medium">Check Loan Status:</span> Get a clear indication of whether the loan has been fully paid.
                    </li>
                    <li>
                        <span className="font-medium">Pay Loan:</span> If you are connected as the designated borrower, you can send the required ETH amount to repay the loan via a blockchain transaction.
                    </li>
                    <li>
                        <span className="font-medium">View Transaction History:</span> See a record of relevant past transactions associated with the loan contract (implementation might vary).
                    </li>
                </ul>
            </div>

            {/* Connect Wallet Section */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 w-full max-w-md">
                 <p className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">Connect Your Wallet to Begin</p>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Please connect your MetaMask wallet to view details and interact:</p>
                <WalletConnect onConnect={onConnect} />
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-10">
                This is a demonstration project. Ensure you are connected to the correct network (Localhost or Sepolia Testnet).
            </p>
        </div>
    );
} 