import React, { useState } from "react";
import WalletConnect from "./components/WalletConnect";
import PayLoan from "./components/PayLoan";
import LoanDetails from "./components/LoanDetails";
import TransactionHistory from "./components/TransactionHistory";
import ThemeToggle from "./components/ThemeToggle";
import LoanStatus from "./components/LoanStatus";
import LandingPage from "./components/LandingPage";

function App() {
  const [connectedAccount, setConnectedAccount] = useState(null);

  const handleConnect = (account) => {
    console.log("App: Wallet connected/changed:", account);
    setConnectedAccount(account);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8 transition-colors duration-300">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
          Mortgage DApp Dashboard
        </h1>
        <ThemeToggle />
      </header>

      <main>
        {!connectedAccount ? (
          <LandingPage onConnect={handleConnect} />
        ) : (
          <>
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <WalletConnect onConnect={handleConnect} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <LoanDetails account={connectedAccount} />
              </div>
              <div className="lg:col-span-1 space-y-6">
                <PayLoan account={connectedAccount} />
                <LoanStatus account={connectedAccount} />
              </div>
            </div>

            <TransactionHistory account={connectedAccount} />
          </>
        )}
      </main>

      <footer className="text-center mt-12 text-xs text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Mortgage DApp Demo. All rights reserved (or specify license).</p>
        <p>Connect with caution. Ensure you understand the contracts you interact with.</p>
      </footer>
    </div>
  );
}

export default App;


