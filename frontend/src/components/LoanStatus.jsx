import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Mortgage from "../artifacts/contracts/Mortgage.sol/Mortgage.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function LoanStatus() {
    const [status, setStatus] = useState("Fetching...");
    const [loanPaid, setLoanPaid] = useState(null);
    const [loanDetails, setLoanDetails] = useState({
        borrower: "",
        lender: "",
        loanAmount: "0",
        interestRate: "0",
        duration: "0"
    });

    useEffect(() => {
        const fetchLoanStatus = async () => {
            if (!window.ethereum) {
                alert("Please install MetaMask!");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const mortgage = new ethers.Contract(contractAddress, Mortgage.abi, signer);

            try {
                const borrower = await mortgage.borrower();
                const lender = await mortgage.lender();
                const loanAmount = await mortgage.loanAmount();
                const loanPaid = await mortgage.loanPaid();
                const interestRate = await mortgage.interestRate();
                const duration = await mortgage.duration();

                setLoanPaid(loanPaid);
                setLoanDetails({
                    borrower,
                    lender,
                    loanAmount: ethers.formatEther(loanAmount),
                    interestRate: interestRate.toString(),
                    duration: duration.toString()
                });
            } catch (error) {
                console.error(error);
                setStatus("Error fetching status");
                setLoanPaid("error");
            }
        };

        fetchLoanStatus();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Decentralized Mortgage Platform</h1>

                    <div className="bg-blue-50 rounded-xl p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Loan Status</h2>
                        <div className="space-y-4">
                            {loanPaid === null && (
                                <div className="flex items-center justify-center p-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                            {loanPaid === true && (
                                <div className="bg-green-100 text-green-700 p-4 rounded-lg flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-medium">Loan has been fully repaid!</span>
                                </div>
                            )}
                            {loanPaid === false && (
                                <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium">Loan payment pending</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Loan Details</h3>
                            <div className="space-y-3">
                                <p className="flex justify-between">
                                    <span className="text-gray-600">Amount:</span>
                                    <span className="font-medium">{loanDetails.loanAmount} ETH</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-600">Interest Rate:</span>
                                    <span className="font-medium">{loanDetails.interestRate}%</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-600">Duration:</span>
                                    <span className="font-medium">{loanDetails.duration} months</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Parties Involved</h3>
                            <div className="space-y-3">
                                <p className="flex flex-col">
                                    <span className="text-gray-600">Borrower:</span>
                                    <span className="font-medium break-all text-sm">{loanDetails.borrower}</span>
                                </p>
                                <p className="flex flex-col">
                                    <span className="text-gray-600">Lender:</span>
                                    <span className="font-medium break-all text-sm">{loanDetails.lender}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoanStatus;


