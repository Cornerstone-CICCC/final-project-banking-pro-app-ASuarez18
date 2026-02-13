# Phase 1: Black Box Testing
Errors found.
#### Create New Account
- Invalid Input for balance
	- Accepts strings but sets it as NaN
	- Accepts Empty values
	- Account named with spaces (" ")
- Accepts values > 0 (Negative Initial Balance)
- ~~NOT ERROR (Rounds when more than 2 decimals)~~
- Two accounts can have the same  name
#### View Account Details
**No errors found**
#### List All Accounts
**No errors found**
#### Deposit Funds
- Invalid Input
	- Accepts empty values so it turns into Nan
	- Accepts strings
- Accepts values >= 0 (Withdrawing when trying to deposit)
#### Withdraw Funds
- Invalid Input
	- Accepts empty values so it turns into Nan
	- Accepts strings
- Accepts values > 0 and makes positive balance
- You can withdraw more that you have in your account
#### Transfer Between Accounts
- Can transfer to the same account (sender/receiver)
- Can transfer to an account that doesn't exists, it creates a new/empty name (EVEN IF ITS EMPTY)  but with the given id and transfers the money
- Accepts negative values but "works as intended"
- Accepts 0 value
- Can send string amount that breaks both accounts
- Can transfer even if it doesn't  has the necessary funds (making a negative balance) 
#### View Transaction History
**No errors found**
#### Delete Account
- Delete account with balance  is allowed\*
#### Exit Application
**No errors found**

# Phase 2: White Box Testing

| Test ID    | Feature            | Environment                | Steps                                                                                                                                                   | Expected Result                                                       | Actual Result                                                            | Status     | Notes/Defect                                                                                      |
| ---------- | ------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------- |
| TP-001.1   | Create Account     | Node.js + Ubuntu Linux     | **1.** Select option 1  <br>**2.** Enter account name: "TestAccount"  <br>**3.** Enter initial deposit: "abc"                                           | System should reject string input and prompt for valid number         | Balance is set to NaN                                                    | Pass/Fail  | **Critical:** Invalid input validation - *strings accepted as balance*                            |
| TP-001.2   | Create Account     | Node.js + Ubuntu Linux     | **1.** Select option 1<br>**2.** Enter account name: "TestAccount"<br>**3.** Enter initial deposit: [press Enter without input]                         | System should reject empty input and prompt for valid number          | Balance is set to NaN                                                    | Pass/Fail  | **Critical:** Empty values accepted as balance                                                    |
| TP-002     | Create Account     | Node.js + Ubuntu Linux     | **1.** Select option 1<br>**2.** Enter account name: " " (only spaces)<br>**3.** Enter initial balance: 100                                             | System should reject spaces-only name or trim it                      | Account created with spaces-only name                                    | Pass/Fail  | **Medium:** Account name validation missing - accepts whitespace-only names                       |
| TP-004     | Create Account     | Node.js + Ubuntu Linux     | **1.** Select option 1<br>**2.** Enter account name: "TestAccount"<br>**3.** Enter initial balance: -50                                                 | System should reject negative initial balance                         | Account created with -$50.00 balance                                     | Fail       | **Critical:** Negative initial balance allowed                                                    |
| TP-005     | Create Account     | Node.js + Ubuntu Linux     | **1.** Create account "John"<br>**2.** Create another account "John"                                                                                    | System should allow duplicate names (or reject based on requirements) | Both accounts created successfully with same name                        | Pass/Fail* | **Info:** Duplicate names allowed - verify if this is intended behavior                           |
|            |                    |                            |                                                                                                                                                         |                                                                       |                                                                          |            |                                                                                                   |
| TP-006     | Deposit Funds      | Node.js + Ubuntu Linux     | **1.** Select option 4<br>**2.** Enter account ID: [existing account]<br>**3.** Enter deposit amount: [press Enter]                                     | System should reject empty input and prompt for valid amount          | Deposit amount set to NaN, all balance becomes NaN                       | Fail       | **Critical:** Empty values accepted - corrupts account balance with NaN                           |
| TP-007     | Deposit Funds      | Node.js + Ubuntu Linux     | **1.** Select option 4<br>**2.** Enter account ID: [existing account]<br>**3.** Enter deposit amount: "abc"                                             | System should reject string input and prompt for valid number         | parseFloat returns NaN, balance becomes NaN                              | Fail       | **Critical:** String input accepted - corrupts account balance with NaN                           |
| TP-008     | Deposit Funds      | Node.js + Ubuntu Linux     | **1.** Select option 4<br>**2.** Enter account ID: [existing account with $100]<br>**3.** Enter deposit amount: -50                                     | System should reject negative deposit amounts                         | Balance decreased to $50.00 (acts as withdrawal)                         | Fail       | **Critical:** Negative deposits allowed - can be used to withdraw funds via deposit               |
| TP-009     | Deposit Funds      | Node.js + Ubuntu Linux     | **1.** Select option 4<br>**2.** Enter account ID: [existing account with $100]<br>**3.** Enter deposit amount: 0                                       | System should reject zero deposits or allow with warning              | Deposit of $0.00 processed, transaction recorded                         | Pass*      | **Info:** Zero deposits allowed - verify if intended (creates unnecessary transactions)           |
|            |                    |                            |                                                                                                                                                         |                                                                       |                                                                          |            |                                                                                                   |
| TP-010     | Withdraw Funds     | Node.js + Ubuntu Linux     | **1.** Select option 5<br>**2.** Enter account ID: [existing account]<br>**3.** Enter withdrawal amount: [press Enter]                                  | System should reject empty input and prompt for valid amount          | Withdrawal amount set to NaN, balance becomes NaN                        | Fail       | **Critical:** Empty values accepted - corrupts account balance with NaN                           |
| TP-011     | Withdraw Funds     | Node.js + Ubuntu Linux     | **1.** Select option 5<br>**2.** Enter account ID: [existing account]<br>**3.** Enter withdrawal amount: "abc"                                          | System should reject string input and prompt for valid number         | parseFloat returns NaN, balance becomes NaN                              | Fail       | **Critical:** String input accepted - corrupts account balance with NaN                           |
| TP-012     | Withdraw Funds     | Node.js + Ubuntu Linux     | **1.** Select option 5<br>**2.** Enter account ID: [existing account with $50]<br>**3.** Enter withdrawal amount: -30                                   | System should reject negative withdrawal amounts                      | Balance increased to $80.00 (acts as deposit)                            | Fail       | **Critical:** Negative withdrawals allowed - can be used to deposit funds via withdrawal          |
| TP-013     | Withdraw Funds     | Node.js + Ubuntu Linux     | **1.** Select option 5<br>**2.** Enter account ID: [existing account with $100]<br>**3.** Enter withdrawal amount: 200                                  | System should reject withdrawal exceeding account balance             | Withdrawal processed, balance becomes -$100.00                           | Fail       | **Critical:** Overdraft allowed - can withdraw more than account balance (negative balance)       |
| ~~TP-014~~ | ~~Withdraw Funds~~ | ~~Node.js + Ubuntu Linux~~ | ~~**1.** Select option 5<br>**2.** Enter account ID: [existing account with $100]<br>**3.** Enter withdrawal amount: 100~~                              | ~~System should allow withdrawal of exact balance~~                   | ~~Withdrawal processed, balance becomes $0.00~~                          | ~~Pass*~~  | ~~**Info:** Boundary test - exact balance withdrawal (verify if intended)~~                       |
|            |                    |                            |                                                                                                                                                         |                                                                       |                                                                          |            |                                                                                                   |
| TP-015     | Transfer Funds     | Node.js + Ubuntu Linux     | **1.** Select option 6<br>**2.** Enter From Account ID: ACC-7901<br>**3.** Enter To Account ID: ACC-7901<br>**4.** Enter transfer amount: 50            | System should reject transfer to same account                         | Transfer processed, money deducted but not added (no changes in balance) | Fail       | **Medium:** Self-transfer is allowed                                                              |
| TP-016     | Transfer Funds     | Node.js + Ubuntu Linux     | **1.** Select option 6<br>**2.** Enter From Account ID: [existing account]<br>**3.** Enter To Account ID: noExists<br>**4.** Enter transfer amount: 100 | System should reject transfer to non-existent account                 | New account created with ID noExists, empty name, balance $100           | Fail       | **Critical:** Transfer to non-existent account creates ghost account with empty name              |
| TP-017     | Transfer Funds     | Node.js + Ubuntu Linux     | **1.** Select option 6<br>**2.** Enter From Account ID: [existing account]<br>**3.** Enter To Account ID: [empty]<br>**4.** Enter transfer amount: 50   | System should reject empty destination account ID                     | New account created with empty ID and name, balance $50                  | Fail       | **Critical:** Empty destination ID accepted - creates invalid account                             |
| TP-018     | Transfer Funds     | Node.js + Ubuntu Linux     | **1.** Select option 6<br>**2.** Enter From Account ID: [existing with $100]<br>**3.** Enter To Account ID: [existing]<br>**4.** Transfer amount: -50   | System should reject negative transfer amounts                        | -$50 deducted from source (adds $50), -$50 added to dest (subtracts)     | Fail       | **Critical:** Negative transfers allowed - reverses transfer direction                            |
| TP-019     | Transfer Funds     | Node.js + Ubuntu Linux     | **1.** Select option 6<br>**2.** Enter From Account ID: [existing with $100]<br>**3.** Enter To Account ID: [existing]<br>**4.** Transfer amount: 0     | System should reject zero transfer amounts                            | Transfer of $0.00 processed, transaction recorded                        | Fail       | **Low:** Zero transfers allowed - creates unnecessary transaction records                         |
| TP-020     | Transfer Funds     | Node.js + Ubuntu Linux     | **1.** Select option 6<br>**2.** Enter From Account ID: [existing account]<br>**3.** Enter To Account ID: [existing account]<br>**4.** Amount: "abc"    | System should reject string input and prompt for valid number         | parseFloat returns NaN, both accounts corrupted with NaN balances        | Fail       | **Critical:** String input accepted - corrupts both source and destination account balances       |
| TP-021     | Transfer Funds     | Node.js + Ubuntu Linux     | **1.** Select option 6<br>**2.** Enter From Account ID: [existing with $50]<br>**3.** Enter To Account ID: [existing]<br>**4.** Transfer amount: 200    | System should reject transfer exceeding source account balance        | Transfer processed, source balance becomes -$150.00                      | Fail       | **Critical:** Overdraft allowed - can transfer more than available balance (negative balance)     |
| TP-022     | Transfer Funds     | Node.js + Ubuntu Linux     | **1.** Select option 6<br>**2.** Enter From Account ID: [existing]<br>**3.** Enter To Account ID: [existing ending in 7]<br>**4.** Amount: 100          | System should add amount to destination account                       | Money deducted from source but NOT added to destination (money lost)     | Fail       | **Critical:** Bug in code - destination IDs ending in '7' don't receive funds (money vanishes)    |
| TP-023     | Transfer Funds     | Node.js + Ubuntu Linux     | **1.** Select option 6<br>**2.** Enter From Account ID: [existing]<br>**3.** Enter To Account ID: [existing]<br>**4.** Transfer amount: 600             | System should record transaction in both accounts                     | Transaction NOT recorded in destination (amount > 500)                   | Fail       | **Medium:** Bug in code - transfers over $500 don't record transaction in destination             |
|            |                    |                            |                                                                                                                                                         |                                                                       |                                                                          |            |                                                                                                   |
| TP-024     | Delete Account     | Node.js + Ubuntu Linux     | **1.** Select option 8<br>**2.** Enter account ID: [existing account with $500 balance]                                                                 | System should warn or prevent deletion of accounts with balance       | Account deleted successfully, $500 lost                                  | Pass/Fail* | **Critical:** Deletion of accounts with balance allowed - causes money loss (verify requirements) |
| TP-025     | Delete Account     | Node.js + Ubuntu Linux     | **1.** Delete account ID: 1001<br>**2.** Select option 7<br>**3.** Try to view transaction history for account 1001                                     | System should display "Account not found" or no history               | [Behavior depends on implementation]                                     | Unknown    | **Info:** Verify transaction history behavior after deletion                                      |












