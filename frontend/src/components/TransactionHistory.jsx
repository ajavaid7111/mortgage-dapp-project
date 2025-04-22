import React from 'react';

// Mock data - replace with actual data fetching later
const mockHistory = [
  { id: 1, date: '2023-10-01', type: 'Interest Payment', amount: '0.05 ETH', txHash: '0xabc...def' },
  { id: 2, date: '2023-09-01', type: 'Interest Payment', amount: '0.05 ETH', txHash: '0x123...456' },
  { id: 3, date: '2023-08-01', type: 'Principal Payment', amount: '0.10 ETH', txHash: '0x789...abc' },
];

function TransactionHistory() {
  // In a real app, you'd fetch this data, perhaps using useEffect
  const history = mockHistory;

  const formatHash = (hash) => `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;

  return (
    // Glassmorphism Card
    <div className="relative bg-dark-card/70 backdrop-blur-md rounded-2xl p-6 border border-dark-border/50 shadow-xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink animate-gradient-x bg-[length:200%_auto]"></div>
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-neon-cyan filter drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12H9.01M15 12H15.01M12 15H12.01M12 9H12.01M7.757 7.757L7.05 7.05M16.95 16.95l-.707-.707M7.05 16.95l.707-.707M16.243 7.757l.707.707"></path>
            </svg>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
                Transaction History
            </span>
        </h2>

        {history.length === 0 ? (
            <p className="text-center text-gray-400/80 py-8">No transaction history available.</p>
        ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2"> {/* Scrollable history */}
                {history.map((item) => (
                    <div key={item.id} className="p-3 bg-dark-bg/50 rounded-lg border border-dark-border/50 text-sm flex justify-between items-center hover:border-neon-cyan/30 transition-colors duration-200">
                        <div>
                            <p className="text-gray-300 font-medium">{item.type} - <span className="text-neon-cyan/90">{item.amount}</span></p>
                            <p className="text-gray-500 text-xs">{item.date}</p>
                        </div>
                        <a
                            href={`https://etherscan.io/tx/${item.txHash}`} // Example link
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-blue-400 hover:text-neon-cyan hover:underline"
                            title="View on Etherscan"
                        >
                            {formatHash(item.txHash)}
                        </a>
                    </div>
                ))}
            </div>
        )}
         <p className="text-xs text-center text-gray-500/70 mt-4">Mock data shown. Real history requires event indexing.</p>
    </div>
  );
}

export default TransactionHistory; 