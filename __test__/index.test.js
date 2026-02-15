import {
  createAccount,
  depositFunds,
  withdrawFunds,
  transferFunds,
  deleteAccount,
  findAccountById,
  generateAccountId,
  formatMoney
} from "../src/testBank.js";
// } from "../src/testBank-fixed.js";

const mockData = {
  accounts: [{
    "id": "ACC-1234",
    "holderName": "user",
    "balance": 100,
    "createdAt": "2026-02-13T17:59:49.789Z",
    "transactions": [
      {
        "type": "DEPOSIT",
        "amount": 100,
        "timestamp": "2026-02-13T17:59:49.789Z",
        "balanceAfter": 100,
        "description": "Initial deposit"
      }
    ]
  }]
};

const mockData2 = {
  accounts: [
    {
      "id": "ACC-1234",
      "holderName": "user",
      "balance": 2000,
      "createdAt": "2026-02-13T17:59:49.789Z",
      "transactions": [
        {
          "type": "DEPOSIT",
          "amount": 2000,
          "timestamp": "2026-02-13T17:59:49.789Z",
          "balanceAfter": 2000,
          "description": "Initial deposit"
        }
      ]
    },
    {
      "id": "ACC-5678",
      "holderName": "user2",
      "balance": 1000,
      "createdAt": "2026-02-13T17:59:49.789Z",
      "transactions": [
        {
          "type": "DEPOSIT",
          "amount": 1000,
          "timestamp": "2026-02-13T17:59:49.789Z",
          "balanceAfter": 1000,
          "description": "Initial deposit"
        }
      ]
    },
  ]
};

describe("BankCLI Pro - Unit Tests", () => {

  describe("1. Create Account Functionality", () => {

    test("CA-001.(1, 2) - Should reject string or empty input for initial balance", () => {
      // > Throw error for non-numeric input
      expect(() => {
        createAccount("AccountName", "invalid");
      }).toThrow("Initial deposit must be a non-negative number");

      // > Throw error for empty string input
      expect(() => {
        createAccount("AccountName", "");
      }).toThrow("Initial deposit must be a non-negative number");
    });

    test("CA-002 - Should reject spaces-only account name", () => {
      // > Account name input as spaces only
      expect(() => {
        createAccount("   ", "100");
      }).toThrow("Account holder name cannot be empty")
    });
  });

  test("CA-003 - Should reject negative initial balance", () => {
    // > Throw error for negative initial deposit
    expect(() => {
      createAccount("TestAccount", "-50", mockData);
    }).toThrow("Initial deposit must be a non-negative number");
  });

  test("CA-004 - Should generate unique account names", () => {
    const data = { accounts: [] };
    const account1 = createAccount("Account1", "100", data);
    data.accounts.push(account1);
    // > Throw error for duplicate account name
    expect(() => {
      createAccount("Account1", "100", data);
    }).toThrow("An account with this name already exists");

  });

  describe("2. Deposit Funds Functionality", () => {

    test("DF-001.(1, 2) - Should reject non-numeric deposit amounts", () => {
      let data = mockData;

      // > Attempt to deposit an empty string
      expect(() => {
        depositFunds("ACC-1234", "", data);
      }).toThrow("Deposit amount must be a non-negative number");
      // > Attempt to deposit a non-numeric amount
      expect(() => {
        depositFunds("ACC-1234", "invalid", data);
      }).toThrow("Deposit amount must be a non-negative number");
    });

    test("DF-001.(1, 2) - Should reject less or equal 0 deposits", () => {
      let data = mockData;
      // > Attempt to deposit a negative amount
      expect(() => {
        depositFunds("ACC-1234", "-50", data);
      }).toThrow("Deposit amount must be a non-negative number");
      // > Attempt to deposit a 0 amount
      expect(() => {
        depositFunds("ACC-1234", "0", data);
      }).toThrow("Deposit amount must be greater than zero");
    });
  });

  describe("3. Withdraw Funds Functionality", () => {
    test("WF-001.(1, 2) - Should reject non-numeric withdrawal amounts", () => {
      let data = mockData;

      // > Attempt to withdraw an empty string
      expect(() => {
        withdrawFunds("ACC-1234", "", data);
      }).toThrow("Withdrawal amount must be a non-negative number");
      // > Attempt to withdraw a non-numeric amount
      expect(() => {
        withdrawFunds("ACC-1234", "invalid", data);
      }).toThrow("Withdrawal amount must be a non-negative number");
    });

    test("WF-002.(1, 2) - Should reject less or equal 0 withdrawals", () => {
      let data = mockData;
      // > Attempt to withdraw a negative amount
      expect(() => {
        withdrawFunds("ACC-1234", "-50", data);
      }).toThrow("Withdrawal amount must be a non-negative number");
      // > Attempt to withdraw a 0 amount
      expect(() => {
        withdrawFunds("ACC-1234", "0", data);
      }).toThrow("Withdrawal amount must be greater than zero");
    });

    test("WF-003 - Should reject withdrawals that exceed current balance", () => {
      let data = mockData;
      // > Attempt to withdraw more than the current balance
      expect(() => {
        withdrawFunds("ACC-1234", "150", data);
      }).toThrow("Insufficient funds for this withdrawal");
    });
  });

  describe("4. Transfer Funds Functionality", () => {
    test("TF-001 - Should reject transfers to the same account", () => {
      let data = mockData2;
      // > Attempt to transfer funds to the same account
      expect(() => {
        transferFunds("ACC-1234", "ACC-1234", "50", data);
      }).toThrow("Cannot transfer funds to the same account");
    });

    test("TF-002.(1, 2) - Should reject transfer to non-existing accounts", () => {
      let data = mockData2;
      // > Attempt to transfer funds to a non-existing account
      expect(() => {
        transferFunds("ACC-1234", "ACC-0000", "50", data);
      }).toThrow("Destination account not found");
    });

    test("TF-003 - Should reject non-numeric transfer amounts", () => {
      let data = mockData2;
      // > Attempt to transfer a non-numeric amount
      expect(() => {
        transferFunds("ACC-1234", "ACC-5678", "invalid", data);
      }).toThrow("Transfer amount must be a positive number");
      // > Attempt to transfer an empty string
      expect(() => {
        transferFunds("ACC-1234", "ACC-5678", "", data);
      }).toThrow("Transfer amount must be a positive number");
    });

    test("TF-004 - Should reject less or equal 0 transfer amounts", () => {
      let data = mockData2;
      // > Attempt to transfer a negative amount
      expect(() => {
        transferFunds("ACC-1234", "ACC-5678", "-50", data);
      }).toThrow("Transfer amount must be a positive number");
      // > Attempt to transfer a 0 amount
      expect(() => {
        transferFunds("ACC-1234", "ACC-5678", "0", data);
      }).toThrow("Transfer amount must be a positive number");
    });

    test("TF-005 - Should reject transfers that exceed current balance", () => {
      let data = mockData2;
      // > Attempt to transfer more than the current balance
      expect(() => {
        transferFunds("ACC-1234", "ACC-5678", "3000", data);
      }).toThrow("Insufficient funds for this transfer");
    });

    test("TF-006 - Should correctly transfer funds between accounts", () => { // Accounts ending in 7
      let data = {
        accounts: [
          {
            id: "ACC-1234",
            holderName: "user",
            balance: 1000,
            createdAt: "2026-02-13T17:59:49.789Z",
            transactions: []
          },
          {
            id: "ACC-5678",
            holderName: "user2",
            balance: 5000,
            createdAt: "2026-02-13T17:59:49.789Z",
            transactions: []
          }
        ]
      };
      // > Valid transfer between accounts
      const result = transferFunds("ACC-1234", "ACC-5678", "50", data);
      expect(result.accounts.find(acc => acc.id === "ACC-1234").balance).toBe(950); // Source account should be deducted
      expect(result.accounts.find(acc => acc.id === "ACC-5678").balance).toBe(5050); // Destination account should be credited
    });

    test("TF-007 - Should record transactions in both accounts for transfers over $500", () => {
      let data = mockData2;
      // > Valid transfer over $500 between accounts
      const result = transferFunds("ACC-1234", "ACC-5678", "600", data);
      const fromAccount = result.accounts.find(acc => acc.id === "ACC-1234");
      const toAccount = result.accounts.find(acc => acc.id === "ACC-5678");

      expect(fromAccount.transactions.some(tx => tx.type === "TRANSFER_OUT" && tx.amount === 600)).toBe(true);
      expect(toAccount.transactions.some(tx => tx.type === "TRANSFER_IN" && tx.amount === 600)).toBe(true);
    });
  });

  describe("5. Delete Account Functionality", () => {
    test("DA-001 - Should prevent deletion of accounts with balance", () => {
      let data = mockData;
      // > Attempt to delete an account with a balance
      expect(() => {
        deleteAccount("ACC-1234", data);
      }).toThrow("Cannot delete an account with a positive balance");
    });
  });

  describe("6. Format Money Functionality", () => {
    test("FM-001 - Should format positive numbers as US currency", () => {
      // > Format a positive number
      const result = formatMoney(100);
      expect(result).toBe("$100.00");
    });

    test("FM-002 - Should handle NaN input gracefully", () => {
      // > Attempt to format NaN
      expect(formatMoney(NaN)).toBe("$0.00");
    });
  });

  describe("7. Generate Account ID Functionality", () => {
    test("GA-001 - Should generate account ID in correct format", () => {
      // > Generate an account ID
      const id = generateAccountId();
      expect(id).toMatch(/^ACC-\d{4}$/); // Matches "ACC-" followed by 4 digits
    });

    test("GA-002 - Should generate unique account IDs", () => {
      let data = mockData2;
      const generatedIds = new Set();
      // > Generate multiple account IDs and check for uniqueness
      for (let i = 0; i < 100; i++) {
        const id = generateAccountId(data);
        expect(generatedIds.has(id)).toBe(false); //
        generatedIds.add(id);
        data.accounts.push({ id: id, holderName: `Test${i}`, balance: 0, createdAt: new Date().toISOString(), transactions: [] });
      }
    });
  });

  describe("8. Find Account By ID Functionality", () => {
    test("FA-001 - Should find existing account by ID", () => {
      let data = mockData;
      // > Find an existing account by ID
      const account = findAccountById("ACC-1234", data);
      expect(account).toBeDefined();
      expect(account.id).toBe("ACC-1234");
    });

    test("FA-002 - Should return undefined for non-existing or empty ID", () => {
      let data = mockData;
      // > Attempt to find an account with an empty string ID
      const resultEmpty = findAccountById("", data);
      expect(resultEmpty).toBeUndefined();

      // > Attempt to find an account with a non-existing ID
      const resultNonExisting = findAccountById("ACC-9999", data);
      expect(resultNonExisting).toBeUndefined();
    });

    test("FA-003 - Should return undefined for ID with trailing space", () => {
      let data = mockData;
      // > Attempt to find an account with a trailing space in the ID
      const result = findAccountById("ACC-1234 ", data);
      expect(result).toBeUndefined();
    });
  });
});
