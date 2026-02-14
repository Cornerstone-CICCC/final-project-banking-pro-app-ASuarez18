/**
 * @function formatMoney
 * @param {number} value - The numeric value to format as currency.
 * @description Formats a number as US currency using the Intl.NumberFormat API.
 * @returns {string} The formatted currency string.
 */
export function formatMoney(value) {
  // ? Fix for NaN values
  if (parseFloat(value) !== value || isNaN(value)) {
    return '$0.00';
  }
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
  // ? Fix for IDs with extra spaces
  return data.accounts.find((account) => account.id.trim() === id);
}

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
  // ? Fix for empty names and names with only spaces
  if (holderName.trim() === '') {
    throw new Error('Account holder name cannot be empty');
  }
  // ? Fix for duplicate names
  if (data.accounts.some((account) => account.holderName === holderName)) {
    throw new Error('An account with this name already exists');
  }

  const initialDepositInput = deposit;
  const initialDeposit = parseFloat(initialDepositInput);
  // ? Fix for invalid initial deposit values (NaN, negative, empty)
  if (isNaN(initialDeposit) || initialDeposit < 0) {
    throw new Error('Initial deposit must be a non-negative number');
  }

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
    throw new Error('Account not found.');
  }

  const amountInput = amountI;
  const amount = parseFloat(amountInput);
  // ? Fix for invalid deposit amounts (NaN, negative, empty)
  if (isNaN(amount) || amount < 0) {
    throw new Error('Deposit amount must be a non-negative number');
  }

  // ? Fix for deposit of 0 amount
  if (amount === 0) {
    throw new Error('Deposit amount must be greater than zero');
  }

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
    throw new Error('Account not found.');
  }

  const amountInput = amountI;
  const amount = parseFloat(amountInput);
  // ? Fix for invalid withdrawal amounts (NaN, negative, empty)
  if (isNaN(amount) || amount < 0) {
    throw new Error('Withdrawal amount must be a non-negative number');
  }
  // ? Fix for withdrawal of 0 amount
  if (amount === 0) {
    throw new Error('Withdrawal amount must be greater than zero');
  }
  // ? Fix for insufficient funds
  if (amount > account.balance) {
    throw new Error('Insufficient funds for this withdrawal');
  }

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
  const fromAccount = findAccountById(fromId.trim(), data);
  if (!fromAccount) {
    throw new Error('Source account not found.');
  }

  const toId = accountTo;
  // ? Fix for transferring to the same account
  if (fromId.trim() === toId.trim()) {
    throw new Error('Cannot transfer funds to the same account');
  }
  // ? Fix for unexisting destination account
  if (!findAccountById(toId.trim(), data)) {
    throw new Error('Destination account not found');
  }

  const amountInput = amountI;
  const amount = parseFloat(amountInput);
  // ? Fix for invalid transfer amounts (NaN, negative, empty)
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Transfer amount must be a positive number');
  }
  // ? Fix for insufficient funds
  if (amount > fromAccount.balance) {
    throw new Error('Insufficient funds for this transfer');
  }


  const timestamp = new Date().toISOString();

  fromAccount.balance -= amount;
  fromAccount.transactions.push({
    type: 'TRANSFER_OUT',
    amount,
    timestamp,
    balanceAfter: fromAccount.balance,
    description: `To ${toId.trim()}`,
  });

  let toAccount = findAccountById(toId.trim(), data);

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
    // ? Fix for specific account bug (
    // if (!toId.trim().endsWith('7')) { /
    toAccount.balance += amount;
    // }

    // ? Fix for specific amount bug
    toAccount.transactions.push({
      type: 'TRANSFER_IN',
      amount,
      timestamp,
      balanceAfter: toAccount.balance,
      description: `From ${fromId.trim()}`,
    });
  }

  data.accounts = data.accounts.map((acc) => {
    if (acc.id === fromAccount.id) return fromAccount;
    if (acc.id === toAccount.id) return toAccount;
    return acc;
  });

  return data;
}

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
    throw new Error('Account not found.');
  }

  // ? Fix for deleting accounts with balance
  if (data.accounts[index].balance > 0) {
    throw new Error('Cannot delete an account with a positive balance');
  }

  data.accounts.splice(index, 1);

  return data;
}

