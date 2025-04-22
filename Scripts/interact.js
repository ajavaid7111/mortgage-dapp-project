const { ethers } = require("hardhat");

async function main() {
    // Contract address from your deployment step!
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // <-- replace this

    // Connect to the deployed contract
    const mortgage = await ethers.getContractAt("Mortgage", contractAddress);

    // Get signer accounts (borrower and lender)
    const [borrower, lender] = await ethers.getSigners();

    console.log("Borrower address:", borrower.address);
    console.log("Lender address:", lender.address);

    // Check initial balance
    let borrowerBalance = await mortgage.getBalance(borrower.address);
    let lenderBalance = await mortgage.getBalance(lender.address);

    console.log(`Initial borrower balance: ${ethers.utils.formatEther(borrowerBalance)} ETH`);
    console.log(`Initial lender balance: ${ethers.utils.formatEther(lenderBalance)} ETH`);

    // Now let's make a payment!
    const tx = await mortgage.connect(borrower).payLoan({ value: ethers.utils.parseEther("0.5") });
    await tx.wait();

    console.log("Payment of 0.5 ETH made successfully!");

    // Check balances again
    borrowerBalance = await mortgage.getBalance(borrower.address);
    lenderBalance = await mortgage.getBalance(lender.address);

    console.log(`Updated borrower balance: ${ethers.utils.formatEther(borrowerBalance)} ETH`);
    console.log(`Updated lender balance: ${ethers.utils.formatEther(lenderBalance)} ETH`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
