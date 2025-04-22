import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

// Simple copy-to-clipboard utility
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    // Optional: Show a temporary "Copied!" message
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
};

// Accept onConnect prop
export default function WalletConnect({ onConnect }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState("");
    const [provider, setProvider] = useState(null); // Store provider

    // Function to connect wallet
    const connectWallet = async () => {
        setErrorMessage(""); // Clear previous errors
        if (window.ethereum) {
            try {
                // Use BrowserProvider
                const web3Provider = new ethers.BrowserProvider(window.ethereum);
                setProvider(web3Provider);

                // Request account access
                // const accounts = await web3Provider.send("eth_requestAccounts", []); // Old way
                const signer = await web3Provider.getSigner(); // Get signer
                const acc = await signer.getAddress(); // Get address from signer

                console.log("WalletConnect: Account connected:", acc);
                setAccount(acc);
                // *** Call the onConnect callback passed from App.jsx ***
                if (onConnect) {
                    onConnect(acc);
                }
                await getBalance(web3Provider, acc); // Pass provider explicitly

            } catch (error) {
                console.error("Error connecting wallet:", error);
                setErrorMessage(
                    error.code === 4001
                        ? "Connection rejected by user."
                        : "Failed to connect wallet. Please ensure MetaMask is unlocked and try again."
                );
                 // *** Call onConnect with null on error ***
                if (onConnect) {
                    onConnect(null);
                }
            }
        } else {
            setErrorMessage(
                "MetaMask not detected. Please install the MetaMask extension."
            );
             // *** Call onConnect with null if no MetaMask ***
            if (onConnect) {
                onConnect(null);
            }
        }
    };

    // Function to get balance
    const getBalance = async (web3Provider, currentAccount) => { // Accept provider and account
        if (currentAccount && web3Provider) { // Check both
            try {
                const rawBalance = await web3Provider.getBalance(currentAccount);
                const formattedBalance = ethers.formatEther(rawBalance);
                // Format to a reasonable number of decimal places
                const displayBalance = parseFloat(formattedBalance).toFixed(4);
                setBalance(displayBalance);
            } catch (error) {
                console.error("Error fetching balance:", error);
                setBalance("N/A");
                // Don't clear the main error message here
            }
        } else {
            setBalance(""); // Clear balance if no account or provider
        }
    };

     // Effect to check connection on load and handle account/network changes
    useEffect(() => {
        const checkConnectionAndSetupListeners = async () => {
            if (window.ethereum) {
                try {
                    const web3Provider = new ethers.BrowserProvider(window.ethereum);
                    setProvider(web3Provider); // Set provider early

                    const accounts = await web3Provider.listAccounts();

                    if (accounts.length > 0) {
                        const signer = await web3Provider.getSigner(accounts[0].address); // Get signer for the listed account
                        const acc = await signer.getAddress();
                        console.log("WalletConnect: Already connected account found:", acc);
                        setAccount(acc);
                        // *** Call onConnect on initial load if connected ***
                        if (onConnect) {
                            onConnect(acc);
                        }
                        await getBalance(web3Provider, acc);
                    } else {
                        console.log("WalletConnect: No connected accounts found on load.");
                        setAccount(null);
                        setBalance("");
                         // *** Call onConnect with null if not connected on load ***
                        if (onConnect) {
                            onConnect(null);
                        }
                    }
                } catch (err) {
                     console.error("Error checking initial connection:", err);
                     setAccount(null);
                     setBalance("");
                     // *** Call onConnect with null on error ***
                     if (onConnect) {
                         onConnect(null);
                     }
                }

                // Listener for account changes
                const handleAccountsChanged = async (accounts) => {
                    if (accounts.length === 0) {
                        console.log("WalletConnect: Wallet disconnected.");
                        setAccount(null);
                        setBalance("");
                        setProvider(null); // Clear provider on disconnect
                        setErrorMessage("Wallet disconnected.");
                         // *** Call onConnect with null on disconnect ***
                        if (onConnect) {
                            onConnect(null);
                        }
                    } else {
                        console.log("WalletConnect: Account changed:", accounts[0]);
                        setAccount(accounts[0]);
                        setErrorMessage(""); // Clear disconnect message
                        // Need provider to get balance again
                        if(provider) { // Use stored provider if available
                             await getBalance(provider, accounts[0]);
                             // *** Call onConnect with the new account ***
                             if (onConnect) {
                                 onConnect(accounts[0]);
                             }
                        } else {
                             // If provider was somehow lost, try to re-initialize
                             try {
                                 const newProvider = new ethers.BrowserProvider(window.ethereum);
                                 setProvider(newProvider);
                                 await getBalance(newProvider, accounts[0]);
                                 // *** Call onConnect with the new account ***
                                 if (onConnect) {
                                     onConnect(accounts[0]);
                                 }
                             } catch (error) {
                                 console.error("Error re-initializing provider on account change:", error);
                                 // *** Call onConnect with null on error ***
                                 if (onConnect) {
                                     onConnect(null);
                                 }
                             }
                        }
                    }
                };

                // Listener for network changes (optional but good practice)
                const handleChainChanged = (_chainId) => {
                    console.log("WalletConnect: Network changed, reloading page.");
                    // Reloading the page is the simplest way to handle network changes
                    // as contract addresses and balances might be network-specific.
                    window.location.reload();
                };

                window.ethereum.on("accountsChanged", handleAccountsChanged);
                window.ethereum.on("chainChanged", handleChainChanged);

                // Cleanup function
                return () => {
                    if (window.ethereum.removeListener) {
                        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
                        window.ethereum.removeListener("chainChanged", handleChainChanged);
                    }
                };
            } else {
                 // Handle case where MetaMask is not installed on initial check
                 setAccount(null);
                 setBalance("");
                 // *** Call onConnect with null if no MetaMask ***
                 if (onConnect) {
                     onConnect(null);
                 }
            }
        };

        checkConnectionAndSetupListeners();

        // We only want this effect to run once on mount,
        // so the dependency array is empty.
        // The listeners handle subsequent changes.
        // Add onConnect to dependency array to ensure it's available
    }, [onConnect]); // Add onConnect here

    // ... rest of the component (return statement with JSX) ...
    // Modify the button text based on connection status

    return (
        <div className="space-y-3 text-sm">
            {!account ? (
                <button
                    onClick={connectWallet}
                    className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out"
                >
                    Connect Wallet
                </button>
            ) : (
                <div className="p-3 bg-gray-100 dark:bg-gray-600 rounded-md border border-gray-200 dark:border-gray-500">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-700 dark:text-gray-200">Status:</span>
                        <span className="px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-200 dark:bg-green-700 dark:text-green-100 rounded-full">
                            Connected
                        </span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                         <span className="font-medium text-gray-700 dark:text-gray-200">Account:</span>
                         <button
                            onClick={() => copyToClipboard(account)}
                            title="Copy address"
                            className="ml-2 text-xs font-mono text-blue-700 dark:text-blue-300 hover:underline focus:outline-none"
                        >
                            {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                         </button>
                    </div>
                     <div className="flex items-center justify-between">
                         <span className="font-medium text-gray-700 dark:text-gray-200">Balance:</span>
                         <span className="font-mono text-gray-800 dark:text-gray-100">{balance ? `${balance} ETH` : "Loading..."}</span>
                    </div>
                </div>
            )}
            {errorMessage && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded p-2">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}

