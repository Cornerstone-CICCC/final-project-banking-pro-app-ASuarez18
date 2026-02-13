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

| Test ID | Feature        | Environment       | Steps         | Expected Result | Actual Result | Status    | Notes/Defect |
| ------- | -------------- | ----------------- | ------------- | --------------- | ------------- | --------- | ------------ |
| TP-001  | Create Account | Node.js + OS info | 1. ... 2. ... | ...             | ...           | Pass/Fail | ...          |
