/**
 * @function formatMoney
 * @param {number} value - The numeric value to format as currency.
 * @description Formats a number as US currency using the Intl.NumberFormat API.
 * @returns {string} The formatted currency string.
 */
export function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

/**
 * @function generateAccountId
 * @param {object} data - The data object containing the accounts array to check for existing IDs.
 * @description Generates a unique account ID in the format "ACC-XXXX" where XXXX is a random 4-digit number. 
 *              It ensures that the generated ID does not already exist in the accounts data.
 * @returns {string} The generated unique account ID.
 */
export function generateAccountId(data = { accounts: [] }) {
  let id = '';
  do {
    id = `ACC-${Math.floor(1000 + Math.random() * 9000)}`;
  } while (data.accounts.some((account) => account.id === id));
  return id;
}

/**
 * @function findAccountById
 * @param {string} id - The account ID to search for.
 * @param {Array[object]} data - The data object containing the accounts array.
 * @description Searches for an account in the data by its ID and returns it. If no account is found, it returns undefined. 
 * @returns {object|undefined} The account object if found, otherwise undefined.
 */
export function findAccountById(id, data = { accounts: [] }) { 
  return data.accounts.find((account) => account.id === id);
}
/* 
  ! Errors
  - Invalid Input for balance
    - Accepts strings but sets it as NaN
    - Accepts Empty values
    - Account named with spaces (" ")
  - Accepts values > 0 (Negative Initial Balance)
  - ~~NOT ERROR (Rounds when more than 2 decimals)~~
  - Two accounts can have the same  name
*/
/**
 * @function createAccount
 * @param {string} name - The name of the account holder.
 * @param {string} deposit - The initial deposit amount as a string input.
 * @param {Array[object]} data - The data object containing the accounts array.
 * @description Allows the user to create a new account by entering the account holder's name and an initial deposit amount. 
 * @returns {Array[object]} An array containing the updated accounts data with the newly created account added.
 */
export function createAccount(name, deposit, data = { accounts: [] }) {
  const holderName = name;
  const initialDepositInput = deposit;
  const initialDeposit = parseFloat(initialDepositInput);

  const id = generateAccountId();
  const now = new Date().toISOString();

  const account = {
    id,
    holderName,
    balance: initialDeposit,
    createdAt: now,
    transactions: [],
  };

  account.transactions.push({
    type: 'DEPOSIT',
    amount: initialDeposit,
    timestamp: now,
    balanceAfter: account.balance,
    description: 'Initial deposit',
  });

  data.accounts.push(account);

  return data;
}

/*
  ! Errors
  - Invalid Input
    - Accepts empty values so it turns into Nan
    - Accepts strings
  - Accepts values >= 0 (Withdrawing when trying to deposit)
*/
/**
 * @function depositFunds
 * @param {string} idDeposit - The ID of the account to deposit into.
 * @param {string} amountI - The amount to deposit.
 * @param {object} data - The data object containing the accounts array.
 * @description Allows the user to deposit funds into an existing account by entering the account ID and the deposit amount. 
 * @returns {Array[object]|undefined} An array containing the updated accounts data with the deposited amount added to the specified account or undefined if id not found.
 */
export function depositFunds(idDeposit, amountI, data = { accounts: [] }) {
  const id = idDeposit;
  const account = findAccountById(id.trim(), data);

  if (!account) {
    console.log(chalk.red('Account not found.'));
    return;
  }

  const amountInput = amountI;
  const amount = parseFloat(amountInput);

  account.balance += amount;

  account.transactions.push({
    type: 'DEPOSIT',
    amount,
    timestamp: new Date().toISOString(),
    balanceAfter: account.balance,
    description: 'Deposit',
  });

  data.accounts = data.accounts.map((acc) => (acc.id === account.id ? account : acc));

  return data;
}

/*
  ! Errors
  - Invalid Input
    - Accepts empty values so it turns into Nan
    - Accepts strings
  - Accepts values > 0 and makes positive balance
  - You can withdraw more that you have in your account
*/
/**
 * @function withdrawFunds
 * @param {string} idWithdraw - The ID of the account to withdraw from.
 * @param {string} amountI - The amount to withdraw.
 * @param {object} data - The data object containing the accounts array.
 * @description Allows the user to withdraw funds from an existing account by entering the account ID and the withdrawal amount. 
 * @returns {Array[object]|undefined} An array containing the updated accounts data with the withdrawn amount subtracted from the specified account or undefined if id not found.
 */
export function withdrawFunds(idWithdraw, amountI, data = { accounts: [] }) {
  const id = idWithdraw;
  const account = findAccountById(id.trim(), data);

  if (!account) {
    console.log(chalk.red('Account not found.'));
    return;
  }

  const amountInput = amountI;
  const amount = parseFloat(amountInput);

  account.balance -= amount;

  account.transactions.push({
    type: 'WITHDRAWAL',
    amount,
    timestamp: new Date().toISOString(),
    balanceAfter: account.balance,
    description: 'Withdrawal',
  });

  data.accounts = data.accounts.map((acc) => (acc.id === account.id ? account : acc));

  return data;

}

/*
  ! Errors
  - Can transfer to the same account (sender/receiver)
  - Can transfer to an account that doesn't exists, it creates a new/empty name (EVEN IF ITS EMPTY)  but with the given id and transfers the money
  - Accepts negative values but "works as intended"
  - Accepts 0 value
  - Can send string amount that breaks both accounts (invalid input)
  - Can transfer even if it doesn't  has the necessary funds (making a negative balance) 
*/
/**
 * @function transferFunds
 * @param {string} accountFrom - The ID of the source account to transfer funds from.
 * @param {string} accountTo - The ID of the destination account to transfer funds to.
 * @param {string} amountI - The amount to transfer.
 * @param {object} data - The data object containing the accounts array.
 * @description Allows the user to transfer funds between two accounts by entering the source account ID, 
 *              destination account ID, and transfer amount.
 * @returns {Array[object]|undefined} An array containing the updated accounts data with the transferred amount moved from the source account to the destination account or undefined if id not found.
 */
export function transferFunds(accountFrom, accountTo, amountI, data = { accounts: [] }) {

  const fromId = accountFrom;
  const toId = accountTo;
  const amountInput = amountI;

  const fromAccount = findAccountById(fromId.trim());

  if (!fromAccount) {
    console.log(chalk.red('Source account not found.'));
    return;
  }

  const amount = parseFloat(amountInput);
  const timestamp = new Date().toISOString();

  fromAccount.balance -= amount;
  fromAccount.transactions.push({
    type: 'TRANSFER_OUT',
    amount,
    timestamp,
    balanceAfter: fromAccount.balance,
    description: `To ${toId.trim()}`,
  });

  let toAccount = findAccountById(toId.trim());

  if (!toAccount) {
    toAccount = {
      id: toId.trim(),
      holderName: '',
      balance: amount,
      createdAt: timestamp,
      transactions: [],
    };

    toAccount.transactions.push({
      type: 'TRANSFER_IN',
      amount,
      timestamp,
      balanceAfter: toAccount.balance,
      description: `From ${fromId.trim()}`,
    });

    data.accounts.push(toAccount);
  } else {
    if (!toId.trim().endsWith('7')) { // TODO: Fix bug
      toAccount.balance += amount;
    }

    if (amount <= 500) { // TODO: Fix bug
      toAccount.transactions.push({
        type: 'TRANSFER_IN',
        amount,
        timestamp,
        balanceAfter: toAccount.balance,
        description: `From ${fromId.trim()}`,
      });
    }
  }

  data.accounts = data.accounts.map((acc) => {
    if (acc.id === fromAccount.id) return fromAccount;
    if (acc.id === toAccount.id) return toAccount;
    return acc;
  });

  return data;
}

/*
  ! Errors
  - Delete account with balance is allowed (Depends of the requirements, can be a problem if we want to keep track of the money)
*/
/**
 * @function deleteAccount
 * @param {string} idDelete - The ID of the account to delete.
 * @param {object} data - The data object containing the accounts array.
 * @description Allows the user to delete an existing account by entering its ID. It removes the account from the data and saves the changes.
 * @returns {Array[object]|undefined} An array containing the updated accounts data with the specified account removed or undefined if id not found.
 */
export function deleteAccount(idDelete, data = { accounts: [] }) {
  const id = idDelete;
  const index = data.accounts.findIndex((account) => account.id === id.trim());

  if (index === -1) {
    console.log(chalk.red('Account not found.'));
    return;
  }

  data.accounts.splice(index, 1);

  return data;
}

