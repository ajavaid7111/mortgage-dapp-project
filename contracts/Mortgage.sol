// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Mortgage {
    mapping(address => uint256) public balances;
    address public lender;
    address public borrower;
    uint256 public loanAmount;
    bool public loanPaid;

    constructor(address _borrower, uint256 _loanAmount) {
        lender = msg.sender;
        borrower = _borrower;
        loanAmount = _loanAmount;
        loanPaid = false;
    }
     
    function getBalance(address account) external view returns (uint256) {
     return balances[account];
    }

    function payLoan() public payable {
        require(msg.sender == borrower, "Only borrower can pay the loan");
        require(msg.value == loanAmount, "Incorrect loan amount");
        require(!loanPaid, "Loan already paid");

        loanPaid = true;
        payable(lender).transfer(msg.value);
    }
}
