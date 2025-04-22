const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners(); // Only need deployer (lender)
    // --- USE YOUR ADDRESS HERE ---
    const borrowerAddress = "0x6cd7c998c296740379d376470f988fac5983d192";
    // ---------------------------
    const loanAmount = ethers.parseEther("1.0"); // Example: 1 ETH loan amount

    console.log("Deploying Mortgage contract with the account:", deployer.address);
    console.log("Borrower address:", borrowerAddress); // Should show your address
    console.log("Loan amount:", ethers.formatEther(loanAmount), "ETH");

    const Mortgage = await ethers.getContractFactory("Mortgage");
    const mortgage = await Mortgage.deploy(borrowerAddress, loanAmount); // Pass your address

    await mortgage.waitForDeployment();

    const contractAddress = await mortgage.getAddress();
    console.log("Mortgage contract deployed to:", contractAddress);

    // --- Optional: Copy ABI to frontend ---
    // fs.copyFileSync(...)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

