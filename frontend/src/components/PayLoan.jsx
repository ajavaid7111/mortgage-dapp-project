import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Mortgage from "../artifacts/contracts/Mortgage.sol/Mortgage.json";

// Make sure this address is correct for your deployment
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function PayLoan() {
    const [loading, setLoading] = useState(false);
    const [txStatus, setTxStatus] = useState(null); // More descriptive status: null | 'processing' | 'confirming' | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState("");
    const [canPay, setCanPay] = useState(false); // Check if current user is the borrower

    // Check if the connected user is the borrower
    useEffect(() => {
        const checkBorrower = async () => {
            console.log("PayLoan: checkBorrower effect started."); // Log start
            if (!window.ethereum) {
                console.log("PayLoan: MetaMask not detected.");
                setCanPay(false);
                return;
            }
            try {
                console.log("PayLoan: Creating BrowserProvider...");
                const provider = new ethers.BrowserProvider(window.ethereum);

                console.log("PayLoan: Getting signer...");
                const signer = await provider.getSigner();
                if (!signer) {
                    console.log("PayLoan: Could not get signer.");
                    setCanPay(false);
                    return;
                }
                console.log("PayLoan: Getting address from signer...");
                const userAddress = await signer.getAddress();

                if (!userAddress) {
                    console.log("PayLoan: Could not get address from signer.");
                    setCanPay(false);
                    return;
                }
                console.log("PayLoan: Connected user address:", userAddress);

                console.log("PayLoan: Creating contract instance with address:", contractAddress);
                const mortgage = new ethers.Contract(contractAddress, Mortgage.abi, provider);

                console.log("PayLoan: Calling mortgage.borrower()...");
                const borrower = await mortgage.borrower();
                console.log("PayLoan: Borrower from contract:", borrower);

                console.log("PayLoan: Calling mortgage.loanPaid()...");
                const isPaid = await mortgage.loanPaid();
                console.log("PayLoan: isPaid from contract:", isPaid);

                console.log("PayLoan Check:", { userAddress, borrower, isPaid });
                setCanPay(userAddress.toLowerCase() === borrower.toLowerCase() && !isPaid);
                console.log("PayLoan: setCanPay result:", userAddress.toLowerCase() === borrower.toLowerCase() && !isPaid);
                setErrorMessage("");
                // setTxStatus(null);

            } catch (err) {
                // Log the specific error encountered
                console.error("Error checking borrower status in PayLoan:", err);
                // Provide a more detailed error message if possible
                setErrorMessage(`Could not verify borrower status. Error: ${err.message}`);
                setTxStatus('error');
                setCanPay(false);
            }
        };

        // ... rest of useEffect (listeners, cleanup) ...
        checkBorrower();

        const handleAccountsChanged = (accounts) => {
            console.log("PayLoan: Accounts changed", accounts);
            checkBorrower();
        };

        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountsChanged);
        }

         return () => {
             if (window.ethereum?.removeListener) {
                window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            }
        }
    }, [contractAddress]); // Dependency array is correct

    const payMortgage = async () => {
        if (!window.ethereum) {
            setTxStatus('error');
            setErrorMessage("MetaMask not detected.");
            return;
        }
        if (!canPay) {
             setTxStatus('error');
             setErrorMessage("Only the borrower can pay an outstanding loan.");
             return;
        }

        setLoading(true);
        setTxStatus('processing');
        setErrorMessage("");

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const mortgage = new ethers.Contract(contractAddress, Mortgage.abi, signer);

            const loanAmountWei = await mortgage.loanAmount();

            setTxStatus('confirming'); // User needs to confirm in MetaMask
            const tx = await mortgage.payLoan({ value: loanAmountWei });

            setTxStatus('processing'); // Transaction sent, waiting for mining
            await tx.wait(); // Wait for transaction confirmation

            setTxStatus('success');
            setCanPay(false); // Loan is now paid, disable button
            // Optionally trigger a refresh of LoanDetails component state

        } catch (err) {
            console.error("Error paying loan:", err);
            setTxStatus('error');
            if (err.code === 4001) { // User rejected transaction
                 setErrorMessage("Transaction rejected in wallet.");
            } else if (err.reason) {
                 setErrorMessage(`Transaction failed: ${err.reason}`);
            } else {
                 setErrorMessage("An unknown error occurred during payment.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // Glassmorphism Card
        <div className="relative bg-dark-card/70 backdrop-blur-md rounded-2xl p-6 border border-dark-border/50 shadow-xl h-full flex flex-col">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink animate-gradient-x bg-[length:200%_auto]"></div>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-neon-cyan filter drop-shadow-lg" /* ... icon path ... */ >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
                    Loan Payment
                </span>
            </h2>

            <div className="flex-grow space-y-5">
                <button
                    onClick={payMortgage}
                    disabled={loading || !canPay} // Disable if loading or not the borrower/already paid
                    // Futuristic button style
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 relative group overflow-hidden ${
                        loading || !canPay
                            ? "bg-gray-700/50 cursor-not-allowed text-gray-500"
                            : "bg-gradient-to-r from-neon-cyan/80 to-neon-purple/80 text-white hover:shadow-lg hover:shadow-neon-cyan/30"
                    }`}
                >
                    <span className={`absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-0 ${!loading && canPay ? 'group-hover:opacity-20' : ''} transition duration-300`}></span>
                    <span className="relative flex items-center justify-center">
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" /* ... spinner path ... */ >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {txStatus === 'confirming' ? 'Confirm in Wallet...' : 'Processing Payment...'}
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-3" /* ... icon path ... */ >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Pay Loan
                            </>
                        )}
                    </span>
                </button>

                {/* Transaction Status Display */}
                {txStatus && (
                    <div className={`p-3 rounded-lg text-sm flex items-center ${
                        txStatus === 'error' ? 'bg-red-900/30 border border-red-500/30 text-red-300' :
                        txStatus === 'success' ? 'bg-green-900/30 border border-green-500/30 text-green-300' :
                        'bg-blue-900/30 border border-blue-500/30 text-blue-300'
                    }`}>
                        {txStatus === 'error' && <svg className="w-5 h-5 mr-2 flex-shrink-0" /* error icon */ > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg>}
                        {txStatus === 'success' && <svg className="w-5 h-5 mr-2 flex-shrink-0" /* success icon */ > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                        {(txStatus === 'processing' || txStatus === 'confirming') && <svg className="animate-spin h-4 w-4 mr-2 text-blue-300" /* spinner */ > <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path></svg>}

                        <span>
                            {txStatus === 'error' ? errorMessage :
                             txStatus === 'success' ? 'Payment successful! Your mortgage is paid.' :
                             txStatus === 'confirming' ? 'Please confirm the transaction in your wallet...' :
                             'Processing transaction, please wait...'}
                        </span>
                    </div>
                )}
            </div>

            {/* Enhanced NFT Placeholder */}
            <div className="mt-6 p-5 border border-dashed border-neon-cyan/30 rounded-lg text-center bg-dark-bg/30 relative overflow-hidden">
                 {/* Subtle background grid */}
                 <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                 <div className="relative z-10">
                    <div className="text-5xl mb-3 filter drop-shadow-lg">🏡</div>
                    <p className="text-blue-200/90 text-sm mb-1">Property NFT Unlocks Upon Payment</p>
                    <p className="text-xs text-cyan-400/70">View your digital asset here soon.</p>
                 </div>
            </div>
        </div>
    );
}

export default PayLoan;
