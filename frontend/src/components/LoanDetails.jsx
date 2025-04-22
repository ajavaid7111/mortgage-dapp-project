import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import MortgageArtifact from "../artifacts/contracts/Mortgage.sol/Mortgage.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Make sure this is correct!

// --- Define Helper Component Outside ---
const DetailItem = ({ label, value, isMono = false }) => (
    <div className="p-3 bg-dark-bg/50 rounded-lg border border-dark-border/50 flex justify-between items-center">
        <span className="text-gray-400">{label}:</span>
        <span className={`${isMono ? 'font-mono' : ''} text-gray-200`}>{value}</span>
    </div>
);
// ------------------------------------

function LoanDetails() { // Renamed component
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loanPaid, setLoanPaid] = useState(null);
    const [userRole, setUserRole] = useState(null); // Added state for user role
    const [loanDetails, setLoanDetails] = useState({
        borrower: "",
        lender: "",
        loanAmount: "0",
        // --- New Mocked Fields ---
        interestRate: "5.0", // Example interest rate %
        loanDuration: "360", // Example duration in months
        nextPaymentDue: "N/A", // Placeholder
        // -------------------------
    });

    useEffect(() => {
        const fetchLoanDetails = async () => {
            if (!window.ethereum) {
                setError("MetaMask not detected. Please install MetaMask!");
                setLoading(false);
                return;
            }

            try {
                console.log("Attempting to get provider and signer...");
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.listAccounts();
                if (accounts.length === 0) {
                    console.log("No accounts found. Setting error.");
                    setError("Please connect your wallet first.");
                    setLoading(false); // Make sure this is hit
                    return;
                }
                const signer = await provider.getSigner();
                const userAddress = await signer.getAddress();
                console.log("Signer obtained:", userAddress);

                const mortgage = new ethers.Contract(contractAddress, Mortgage.abi, provider);
                console.log("Contract instance created (connected to provider). Attempting to fetch details via Promise.all...");

                const [borrower, lender, loanAmountWei, isPaid] = await Promise.all([
                    mortgage.borrower(),
                    mortgage.lender(),
                    mortgage.loanAmount(),
                    mortgage.loanPaid()
                ]);
                console.log("Promise.all successful:", { borrower, lender, loanAmountWei, isPaid });

                // Determine user role
                if (userAddress.toLowerCase() === borrower.toLowerCase()) {
                    setUserRole("Borrower");
                } else if (userAddress.toLowerCase() === lender.toLowerCase()) {
                    setUserRole("Lender");
                } else {
                    setUserRole("Observer");
                }

                // Calculate next payment due (example logic)
                const calculateNextDueDate = (paid) => {
                    if (paid) return "Paid in Full";
                    // Replace with actual logic if available from contract/backend
                    const date = new Date();
                    date.setMonth(date.getMonth() + 1);
                    date.setDate(1);
                    return date.toLocaleDateString();
                };

                setLoanPaid(isPaid);
                setLoanDetails(prev => ({
                    ...prev, // Keep mocked fields like interest/duration
                    borrower,
                    lender,
                    loanAmount: parseFloat(ethers.formatEther(loanAmountWei)).toFixed(4),
                    nextPaymentDue: calculateNextDueDate(isPaid),
                }));
                setError(null); // Clear error on success
                setLoading(false); // Explicitly log before setting loading false on success
                console.log("Successfully set details, loading set to false.");
            } catch (err) {
                console.error("ERROR in fetchLoanDetails catch block:", err); // Log the full error here
                setError(`Failed to fetch loan details. Contract might not be deployed or accessible. Error: ${err.message}`);
                setLoading(false); // Log before setting loading false on error
                console.log("Error occurred, loading set to false.");
            }
        };

        // Re-fetch if account changes
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", fetchLoanDetails);
        }
        fetchLoanDetails(); // Initial fetch

        return () => {
             if (window.ethereum?.removeListener) {
                window.ethereum.removeListener("accountsChanged", fetchLoanDetails);
            }
        }
    }, []); // Rerun effect if contract address changes (though it's constant here)

    const formatAddress = (address) => {
        if (!address) return "N/A";
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    // Loading State UI
    if (loading) {
        return (
            <div className="relative bg-dark-card/70 backdrop-blur-md rounded-2xl p-6 border border-dark-border/50 shadow-xl min-h-[300px] flex items-center justify-center">
                 <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink animate-gradient-x bg-[length:200%_auto]"></div>
                 <div className="text-center">
                    <svg className="animate-spin h-8 w-8 text-neon-cyan mx-auto mb-4" /* ... spinner path ... */ >
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-blue-300/80">Fetching Loan Details...</p>
                 </div>
            </div>
        );
    }

    // Error State UI
    if (error) {
        return (
            <div className="relative bg-red-900/30 backdrop-blur-md rounded-2xl p-6 border border-red-500/50 shadow-xl min-h-[300px] flex items-center justify-center text-center">
                 <div className="absolute inset-x-0 top-0 h-1 bg-red-500"></div>
                 <div>
                    <svg className="w-10 h-10 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h3 className="text-lg font-semibold text-red-300 mb-2">Error Loading Details</h3>
                    <p className="text-red-300/80 text-sm">{error}</p>
                 </div>
            </div>
        );
    }

    // Main Content UI
    return (
        <div className="relative bg-dark-card/70 backdrop-blur-md rounded-2xl p-6 border border-dark-border/50 shadow-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink animate-gradient-x bg-[length:200%_auto]"></div>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3 text-neon-cyan filter drop-shadow-lg" /* ... icon path ... */ >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
                        Loan Details
                    </span>
                </div>
                {/* Display User Role */}
                {userRole && (
                     <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        userRole === 'Borrower' ? 'bg-blue-900/50 text-blue-300 border border-blue-500/50' :
                        userRole === 'Lender' ? 'bg-purple-900/50 text-purple-300 border border-purple-500/50' :
                        'bg-gray-700/50 text-gray-400 border border-gray-600/50'
                     }`}>
                        {userRole}
                    </span>
                )}
            </h2>

            <div className="space-y-5">
                {/* Loan Status Indicator */}
                <div className={`p-4 rounded-lg flex items-center text-sm ${
                    loanPaid
                        ? "bg-green-900/30 border border-green-500/30 text-green-300"
                        : "bg-yellow-900/30 border border-yellow-500/30 text-yellow-300"
                }`}>
                    {loanPaid ? (
                        <>
                            <svg className="w-5 h-5 mr-3 flex-shrink-0" /* ... icon path ... */ > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            <span>Status: <span className="font-semibold">Paid in Full</span></span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-3 flex-shrink-0" /* ... icon path ... */ > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>Status: <span className="font-semibold">Payment Pending</span></span>
                        </>
                    )}
                </div>

                {/* Loan Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {/* --- Use the helper component defined outside --- */}
                    <DetailItem label="Loan Amount" value={`${loanDetails.loanAmount} ETH`} />
                    <DetailItem label="Interest Rate" value={`${loanDetails.interestRate}%`} />
                    <DetailItem label="Duration" value={`${loanDetails.loanDuration} Months`} />
                    <DetailItem label="Next Payment" value={loanDetails.nextPaymentDue} />
                    <DetailItem label="Borrower" value={formatAddress(loanDetails.borrower)} isMono />
                    <DetailItem label="Lender" value={formatAddress(loanDetails.lender)} isMono />
                    {/* --------------------------------------------- */}
                </div>
            </div>
        </div>
    );
}

export default LoanDetails; 