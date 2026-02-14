// import fs from 'fs';
// import path from 'path';
// import readline from 'readline';
// import chalk from 'chalk';
// import Table from 'cli-table3';

// const dataPath = path.resolve(process.cwd(), 'bank-data.json');
// let data = { accounts: [] };
// let saving = false;

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });


/**
 * @function ask
 * @description Prompts the user with a question and returns their input as a promise.
 * @param {string} question - The question to ask the user.
 * @returns {Promise<string>} A promise that resolves with the user's input.
 */
// const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

/**
 * @function loadData
 * @description Loads account data from the JSON file. If the file doesn't exist, it initializes with empty data. 
 * @returns {void}
 */
// export function loadData() {
//   if (!fs.existsSync(dataPath)) {
//     fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
//     return;
//   }

//   try {
//     const raw = fs.readFileSync(dataPath, 'utf8');
//     data = JSON.parse(raw);
//     if (!data || !Array.isArray(data.accounts)) {
//       data = { accounts: [] };
//     }
//   } catch (error) {
//     console.log(chalk.yellow('Warning: Data file corrupted. Starting with empty data.'));
//     data = { accounts: [] };
//   }
// }

/**
 * @function saveData
 * @description Saves the current account data to the JSON file.
 * @returns {void}
 */
// export function saveData() {
//   if (saving) return;
//   saving = true;
//   fs.writeFile(dataPath, JSON.stringify(data, null, 2), (err) => {
//     saving = false;
//     if (err) {
//       console.log(chalk.red('Failed to save data.'));
//     }
//   });
// }

/**
 * @function renderHeader
 * @description Renders the application header in the console.
 * @returns {void}
 */
// function renderHeader() {
//   console.log(chalk.cyan('======================================'));
//   console.log(chalk.cyan('=            BANKCLI PRO v1.0        ='));
//   console.log(chalk.cyan('======================================'));
// }

/**
 * @function renderMenu
 * @description Renders the main menu options for the user to select from.
 * @returns {void}
 */
// function renderMenu() {
//   console.log('1. Create New Account');
//   console.log('2. View Account Details');
//   console.log('3. List All Accounts');
//   console.log('4. Deposit Funds');
//   console.log('5. Withdraw Funds');
//   console.log('6. Transfer Between Accounts');
//   console.log('7. View Transaction History');
//   console.log('8. Delete Account');
//   console.log('9. Exit Application');
// }

/**
 * @function formatMoney
 * @param {number} value - The numeric value to format as currency.
 * @description Formats a number as US currency using the Intl.NumberFormat API.
 * @returns {string} The formatted currency string.
 */
export function formatMoney(value) { // TODO: TEST
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

/**
 * @function generateAccountId
 * @description Generates a unique account ID in the format "ACC-XXXX" where XXXX is a random 4-digit number. 
 *              It ensures that the generated ID does not already exist in the accounts data.
 * @returns 
 */
export function generateAccountId() { // TODO: TEST
  let id = '';
  do {
    id = `ACC-${Math.floor(1000 + Math.random() * 9000)}`;
  } while (data.accounts.some((account) => account.id === id));
  return id;
}

/**
 * @function findAccountById
 * @param {string} id - The account ID to search for.
 * @description Searches for an account in the data by its ID and returns it. If no account is found, it returns undefined. 
 * @returns {object|undefined} The account object if found, otherwise undefined.
 */
export function findAccountById(id, data) { // TODO: TEST
  return data.accounts.find((account) => account.id === id);
}

/**
 * @function pause
 * @description Pauses the execution and waits for the user to press Enter before continuing.
 * @return {Promise<void>} A promise that resolves when the user presses Enter.
 */
// async function pause() {
//   await ask(chalk.gray('\nPress Enter to continue...'));
// }

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
 * @description Handles the process of creating a new bank account. 
 * @returns {Promise<void>} A promise that resolves when the account creation process is complete.
 */
export function createAccount(name, deposit, data = { accounts: [] }) {
  // console.clear();
  // renderHeader();
  // console.log(chalk.bold('Create New Account'));

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

  // console.log(chalk.green(`Account created successfully. ID: ${id}`));

  return data;
}

/**
 * @function viewAccountDetails
 * @description Allows the user to view the details of a specific account by entering its ID.
 * @returns {Promise<void>} A promise that resolves when the account details have been displayed and the user has chosen to continue.
 */
export function viewAccountDetails(idSearched) {
  console.clear();
  renderHeader();
  console.log(chalk.bold('View Account Details'));

  const id = idSearched;
  const account = findAccountById(id.trim());

  if (!account) {
    console.log(chalk.red('Account not found.'));
    return;
  }

  const lines = [
    `Account: ${account.id}`,
    `Holder: ${account.holderName}`,
    `Balance: ${formatMoney(account.balance)}`,
    `Opened: ${account.createdAt.split('T')[0]}`,
  ];

  const data = {
    account: account.id,
    holder: account.holderName,
    balance: formatMoney(account.balance),
    opened: account.createdAt.split('T')[0],
  };

  const width = Math.max(...lines.map((line) => line.length)) + 4;
  const border = `+${'-'.repeat(width - 2)}+`;

  console.log(border);
  lines.forEach((line) => {
    console.log(`| ${line.padEnd(width - 4)} |`);
  });
  console.log(border);

  return data;
}

/**
 * @function listAllAccounts
 * @description Displays a list of all accounts in a tabular format, showing the account ID, holder name, balance, and status.
 * @returns {Promise<void>} A promise that resolves when the account list has been displayed and the user has chosen to continue.
 */
// export async function listAllAccounts() {
//   console.clear();
//   renderHeader();
//   console.log(chalk.bold('All Accounts'));

//   if (data.accounts.length === 0) {
//     console.log(chalk.yellow('No accounts found.'));
//     await pause();
//     return;
//   }

//   const table = new Table({
//     head: ['ID', 'Holder Name', 'Balance', 'Status'],
//   });

//   data.accounts.forEach((account) => {
//     table.push([
//       account.id,
//       account.holderName,
//       formatMoney(account.balance),
//       'ACTIVE',
//     ]);
//   });

//   console.log(table.toString());

//   const totalBalance = data.accounts.reduce(
//     (sum, account) => sum + account.balance,
//     0
//   );

//   console.log(`Total accounts: ${data.accounts.length}`);
//   console.log(`Total balance: ${formatMoney(totalBalance)}`);

//   await pause();
// }

/*
  ! Errors
  - Invalid Input
    - Accepts empty values so it turns into Nan
    - Accepts strings
  - Accepts values >= 0 (Withdrawing when trying to deposit)
*/
/**
 * @function depositFunds
 * @description Allows the user to deposit funds into an existing account by entering the account ID and the deposit amount. 
 * @returns {Promise<void>} A promise that resolves when the deposit process is complete and the user has chosen to continue.
 */
export function depositFunds(idDeposit, amountI, data = { accounts: [] }) {
  // console.clear();
  // renderHeader();
  // console.log(chalk.bold('Deposit Funds'));

  const id = idDeposit;
  const account = findAccountById(id.trim(), data);

  if (!account) {
    console.log(chalk.red('Account not found.'));
    // await pause();
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

  // saveData();
  data.accounts = data.accounts.map((acc) => (acc.id === account.id ? account : acc));

  // console.log(chalk.green(`Deposit complete. New balance: ${formatMoney(account.balance)}`));
  // await pause();
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
 * @description Allows the user to withdraw funds from an existing account by entering the account ID and the withdrawal amount. 
 * @returns {Promise<void>} A promise that resolves when the withdrawal process is complete and the user has chosen to continue.
 */
export function withdrawFunds(idWithdraw, amountI, data = { accounts: [] }) {
  // console.clear();
  // renderHeader();
  // console.log(chalk.bold('Withdraw Funds'));

  const id = idWithdraw;
  const account = findAccountById(id.trim(), data);

  if (!account) {
    console.log(chalk.red('Account not found.'));
    // await pause();
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

  // saveData();
  data.accounts = data.accounts.map((acc) => (acc.id === account.id ? account : acc));

  // console.log(chalk.green(`Deposit complete. New balance: ${formatMoney(account.balance)}`));
  // await pause();
  return data;

  // console.log(chalk.green(`Withdrawal complete. New balance: ${formatMoney(account.balance)}`));
  // await pause();
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
 * @description Allows the user to transfer funds between two accounts by entering the source account ID, 
 *              destination account ID, and transfer amount.
 * @returns {Promise<void>} A promise that resolves when the transfer process is complete and the user has chosen to continue.
 */
export function transferFunds(accountFrom, accountTo, amountI, data = { accounts: [] }) {
  // console.clear();
  // renderHeader();
  // console.log(chalk.bold('Transfer Between Accounts'));

  const fromId = accountFrom;
  const toId = accountTo;
  const amountInput = amountI;

  const fromAccount = findAccountById(fromId.trim());

  if (!fromAccount) {
    console.log(chalk.red('Source account not found.'));
    // await pause();
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

  // saveData();
  data.accounts = data.accounts.map((acc) => {
    if (acc.id === fromAccount.id) return fromAccount;
    if (acc.id === toAccount.id) return toAccount;
    return acc;
  });

  return data;

  // console.log(chalk.green('Transfer completed.'));
  // await pause();
}

/**
 * @function viewTransactionHistory
 * @description Allows the user to view the transaction history of a specific account by entering its ID.
 * @returns {Promise<void>} A promise that resolves when the transaction history has been displayed and the user has chosen to continue.
 */
export async function viewTransactionHistory() {
  console.clear();
  renderHeader();
  console.log(chalk.bold('Transaction History'));

  const id = await ask('Account ID: ');
  const account = findAccountById(id.trim());

  if (!account) {
    console.log(chalk.red('Account not found.'));
    await pause();
    return;
  }

  if (account.transactions.length === 0) {
    console.log(chalk.yellow('No transactions found.'));
    await pause();
    return;
  }

  const table = new Table({
    head: ['Date', 'Type', 'Amount', 'Balance After'],
  });

  account.transactions.forEach((transaction) => {
    table.push([
      transaction.timestamp.split('T')[0],
      transaction.type,
      formatMoney(transaction.amount),
      formatMoney(transaction.balanceAfter),
    ]);
  });

  console.log(table.toString());
  await pause();
}

/*
  ! Errors
  - Delete account with balance is allowed (Depends of the requirements, can be a problem if we want to keep track of the money)
*/
/**
 * @function deleteAccount
 * @description Allows the user to delete an existing account by entering its ID. It removes the account from the data and saves the changes.
 * @returns {Promise<void>} A promise that resolves when the account has been deleted and the user has chosen to continue.
 */
export function deleteAccount(idDelete, data = { accounts: [] }) {
  // console.clear();
  // renderHeader();
  // console.log(chalk.bold('Delete Account'));

  const id = idDelete;
  const index = data.accounts.findIndex((account) => account.id === id.trim());

  if (index === -1) {
    console.log(chalk.red('Account not found.'));
    // await pause();
    return;
  }

  data.accounts.splice(index, 1);
  // saveData();

  // console.log(chalk.green('Account deleted.'));
  // await pause();
  return data;
}

/**
 * @function exitApp
 * @description Handles the process of exiting the application. It saves the current data, closes the readline interface, and exits the process.
 * @returns {Promise<void>} A promise that resolves when the exit process is complete.
 */
// export async function exitApp() {
//   console.log(chalk.cyan('Saving and exiting...'));
//   saveData();
//   rl.close();
//   process.exit(0);
// }

/**
 * @function main
 * @description The main function that initializes the application, loads data, and handles the main menu loop. 
 *              It continuously renders the menu and processes user input until the user chooses to exit.
 * @returns {Promise<void>} A promise that resolves when the application is exited.
 */
// async function main() {
//   loadData();

//   while (true) {
//     console.clear();
//     renderHeader();
//     renderMenu();

//     const choice = await ask('Select option (1-9): ');

//     switch (choice.trim()) {
//       case '1':
//         await createAccount();
//         break;
//       case '2':
//         await viewAccountDetails();
//         break;
//       case '3':
//         await listAllAccounts();
//         break;
//       case '4':
//         await depositFunds();
//         break;
//       case '5':
//         await withdrawFunds();
//         break;
//       case '6':
//         await transferFunds();
//         break;
//       case '7':
//         await viewTransactionHistory();
//         break;
//       case '8':
//         await deleteAccount();
//         break;
//       case '9':
//         await exitApp();
//         break;
//       default:
//         console.log(chalk.red('Invalid option. Please select 1-9.'));
//         await pause();
//         break;
//     }
//   }
// }

// process.on('SIGINT', () => {
//   console.log('\n' + chalk.yellow('Exiting...'));
//   process.exit(0);
// });


//   main();
