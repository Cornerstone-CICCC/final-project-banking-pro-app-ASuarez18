import { describe, test, expect, beforeEach, afterAll, jest } from "@jest/globals";

// ✅ MOCKEAR fs ANTES de importar las funciones
jest.unstable_mockModule('fs', () => ({
  default: {
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
    writeFileSync: jest.fn(),
    writeFile: jest.fn((path, data, callback) => callback(null))
  },
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  writeFile: jest.fn((path, data, callback) => callback(null))
}));

// ✅ Importar las funciones DESPUÉS del mock (con await al nivel superior del módulo)
const { 
  createAccount,
  depositFunds,
  withdrawFunds,
  transferFunds,
  deleteAccount,
  loadData,
  saveData,
  findAccountById,
  generateAccountId,
  closeReadline
} = await import("../src/index.js");

describe("BankCLI Pro - Integration Tests with Mocks", () => {

  let mockDeps;

  beforeEach(async () => {  // ✅ Hacer beforeEach async
    // Reset data
    saveData({ accounts: [] });

    // Mock console methods
    global.console.clear = jest.fn();
    global.console.log = jest.fn();

    // Create mock dependencies (sin await import aquí)
    mockDeps = {
      ask: jest.fn(),
      console: console,
      saveData: jest.fn(),
      pause: jest.fn().mockResolvedValue(undefined)
    };
  });
  
  afterAll(() => {
    closeReadline();
  });

  describe("1. Create Account Functionality", () => {
    
    test("TP-001 - Should NOT reject string input for initial balance (BUG)", async () => {
      // Arrange
      mockDeps.ask
        .mockResolvedValueOnce("TestAccount")
        .mockResolvedValueOnce("abc");
      
      // Act
      await createAccount(mockDeps);
      
      // Assert
      const data = loadData();
      console.log("data", data);
      
      expect(data.accounts.length).toBe(1);
      expect(data.accounts[0].holderName).toBe("TestAccount");
      expect(data.accounts[0].balance).toBeNaN();
      expect(mockDeps.ask).toHaveBeenCalledTimes(2);
      expect(mockDeps.saveData).toHaveBeenCalledTimes(1);
    });

    // test("TP-002 - Should NOT reject empty input for initial balance (BUG)", async () => {
    //   mockDeps.ask
    //     .mockResolvedValueOnce("TestAccount")
    //     .mockResolvedValueOnce("");
      
    //   await createAccount(mockDeps);
      
    //   const data = loadData();
    //   expect(data.accounts[0].balance).toBeNaN();
    //   expect(data.accounts.length).toBe(1);
    // });

    // test("TP-003 - Should NOT reject spaces-only name (BUG)", async () => {
    //   mockDeps.ask
    //     .mockResolvedValueOnce("   ")
    //     .mockResolvedValueOnce("100");
      
    //   await createAccount(mockDeps);
      
    //   const data = loadData();
    //   expect(data.accounts[0].holderName).toBe("   ");
    //   expect(data.accounts[0].holderName.trim()).toBe("");
    //   expect(data.accounts.length).toBe(1);
    // });

    // test("TP-004 - Should NOT reject negative initial balance (BUG)", async () => {
    //   mockDeps.ask
    //     .mockResolvedValueOnce("TestAccount")
    //     .mockResolvedValueOnce("-50");
      
    //   await createAccount(mockDeps);
      
    //   const data = loadData();
    //   expect(data.accounts[0].balance).toBe(-50);
    //   expect(data.accounts[0].balance).toBeLessThan(0);
    //   expect(data.accounts.length).toBe(1);
    // });

    // test("TP-005 - Should allow duplicate account names (EXPECTED BEHAVIOR)", async () => {
    //   mockDeps.ask
    //     .mockResolvedValueOnce("John")
    //     .mockResolvedValueOnce("100");
      
    //   await createAccount(mockDeps);
      
    //   mockDeps.ask
    //     .mockResolvedValueOnce("John")
    //     .mockResolvedValueOnce("200");
      
    //   await createAccount(mockDeps);
      
    //   const data = loadData();
    //   expect(data.accounts.length).toBe(2);
    //   expect(data.accounts[0].holderName).toBe("John");
    //   expect(data.accounts[1].holderName).toBe("John");
    // });

    // test("Should generate unique account IDs (CORRECT BEHAVIOR)", async () => {
    //   mockDeps.ask
    //     .mockResolvedValueOnce("User1")
    //     .mockResolvedValueOnce("100");
      
    //   await createAccount(mockDeps);
      
    //   mockDeps.ask
    //     .mockResolvedValueOnce("User2")
    //     .mockResolvedValueOnce("200");
      
    //   await createAccount(mockDeps);
      
    //   const data = loadData();
    //   expect(data.accounts[0].id).toMatch(/^ACC-\d{4}$/);
    //   expect(data.accounts[1].id).toMatch(/^ACC-\d{4}$/);
    //   expect(data.accounts[0].id).not.toBe(data.accounts[1].id);
    // });
  });

  // describe("2. Deposit Funds Functionality", () => {
    
  //   beforeEach(() => {
  //     saveData({
  //       accounts: [{
  //         id: "ACC-1001",
  //         holderName: "TestUser",
  //         balance: 100,
  //         createdAt: new Date().toISOString(),
  //         transactions: []
  //       }]
  //     });
  //   });

  //   test("TP-006 - Should NOT reject empty deposit (BUG)", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("");
      
  //     await depositFunds(mockDeps);
      
  //     const account = findAccountById("ACC-1001");
  //     expect(account.balance).toBeNaN();
  //   });

  //   test("TP-007 - Should NOT reject string deposit (BUG)", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("abc");
      
  //     await depositFunds(mockDeps);
      
  //     const account = findAccountById("ACC-1001");
  //     expect(account.balance).toBeNaN();
  //   });

  //   test("TP-008 - Should NOT allow negative deposit (BUG)", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("-50");
      
  //     await depositFunds(mockDeps);
      
  //     const account = findAccountById("ACC-1001");
  //     expect(account.balance).toBe(50);
  //   });

  //   test("TP-009 - Should NOT allow zero deposit (BUG)", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("0");
      
  //     await depositFunds(mockDeps);
      
  //     const account = findAccountById("ACC-1001");
  //     expect(account.balance).toBe(100);
  //     expect(account.transactions.length).toBe(1);
  //   });
  // });

  // describe("3. Withdraw Funds Functionality", () => {
    
  //   beforeEach(() => {
  //     saveData({
  //       accounts: [{
  //         id: "ACC-1001",
  //         holderName: "TestUser",
  //         balance: 100,
  //         createdAt: new Date().toISOString(),
  //         transactions: []
  //       }]
  //     });
  //   });

  //   test("TP-010 - Should NOT reject empty withdrawal (BUG)", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("");
      
  //     await withdrawFunds(mockDeps);
      
  //     const account = findAccountById("ACC-1001");
  //     expect(account.balance).toBeNaN();
  //   });

  //   test("TP-011 - Should NOT reject string withdrawal (BUG)", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("abc");
      
  //     await withdrawFunds(mockDeps);
      
  //     const account = findAccountById("ACC-1001");
  //     expect(account.balance).toBeNaN();
  //   });

  //   test("TP-012 - Should NOT allow negative withdrawal (BUG)", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("-30");
      
  //     await withdrawFunds(mockDeps);
      
  //     const account = findAccountById("ACC-1001");
  //     expect(account.balance).toBe(130);
  //   });

  //   test("TP-013 - Should NOT allow overdraft (BUG)", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("200");
      
  //     await withdrawFunds(mockDeps);
      
  //     const account = findAccountById("ACC-1001");
  //     expect(account.balance).toBe(-100);
  //     expect(account.balance).toBeLessThan(0);
  //   });
  // });

  // describe("4. Transfer Funds Functionality", () => {
    
  //   beforeEach(() => {
  //     saveData({
  //       accounts: [
  //         {
  //           id: "ACC-1001",
  //           holderName: "User1",
  //           balance: 100,
  //           createdAt: new Date().toISOString(),
  //           transactions: []
  //         },
  //         {
  //           id: "ACC-1007",
  //           holderName: "User2",
  //           balance: 100,
  //           createdAt: new Date().toISOString(),
  //           transactions: []
  //         }
  //       ]
  //     });
  //   });

  //   test("TP-015 - Should NOT allow self-transfer (BUG)", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("50");
      
  //     await transferFunds(mockDeps);
      
  //     const account = findAccountById("ACC-1001");
  //     expect(account.balance).toBe(50);
  //   });

  //   test("TP-016 - Should NOT allow transfer to non-existent account (BUG)", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("ACC-9999")
  //       .mockResolvedValueOnce("100");
      
  //     await transferFunds(mockDeps);
      
  //     const data = loadData();
  //     expect(data.accounts.length).toBe(3);
  //     const ghostAccount = findAccountById("ACC-9999");
  //     expect(ghostAccount).toBeDefined();
  //     expect(ghostAccount.holderName).toBe('');
  //   });

  //   test("TP-017 - Should NOT allow empty destination ID (BUG)", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("")
  //       .mockResolvedValueOnce("50");
      
  //     await transferFunds(mockDeps);
      
  //     const data = loadData();
  //     const invalidAccount = data.accounts.find(a => a.id === '');
  //     expect(invalidAccount).toBeDefined();
  //   });

  //   test("TP-018 - Should NOT allow negative transfer (BUG)", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("ACC-1007")
  //       .mockResolvedValueOnce("-50");
      
  //     await transferFunds(mockDeps);
      
  //     const from = findAccountById("ACC-1001");
  //     const to = findAccountById("ACC-1007");
  //     expect(from.balance).toBe(150);
  //     expect(to.balance).toBe(50);
  //   });

  //   test("TP-019 - Should NOT allow zero transfer (BUG)", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("ACC-1007")
  //       .mockResolvedValueOnce("0");
      
  //     await transferFunds(mockDeps);
      
  //     const from = findAccountById("ACC-1001");
  //     expect(from.balance).toBe(100);
  //     expect(from.transactions.length).toBe(1);
  //   });

  //   test("TP-020 - Should NOT accept string amount (BUG)", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("ACC-1007")
  //       .mockResolvedValueOnce("abc");
      
  //     await transferFunds(mockDeps);
      
  //     const from = findAccountById("ACC-1001");
  //     const to = findAccountById("ACC-1007");
  //     expect(from.balance).toBeNaN();
  //     expect(to.balance).toBeNaN();
  //   });

  //   test("TP-021 - Should NOT allow overdraft transfer (BUG)", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("ACC-1007")
  //       .mockResolvedValueOnce("200");
      
  //     await transferFunds(mockDeps);
      
  //     const from = findAccountById("ACC-1001");
  //     expect(from.balance).toBe(-100);
  //   });

  //   test("TP-022 - BUG: Money vanishes when transferring to account ending in 7", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("ACC-1007")
  //       .mockResolvedValueOnce("100");
      
  //     await transferFunds(mockDeps);
      
  //     const from = findAccountById("ACC-1001");
  //     const to = findAccountById("ACC-1007");
  //     expect(from.balance).toBe(0);
  //     expect(to.balance).toBe(100);
  //   });

  //   test("TP-023 - BUG: Transaction not recorded when amount > 500", async () => {
  //     mockDeps.ask
  //       .mockResolvedValueOnce("ACC-1001")
  //       .mockResolvedValueOnce("ACC-1007")
  //       .mockResolvedValueOnce("600");
      
  //     await transferFunds(mockDeps);
      
  //     const to = findAccountById("ACC-1007");
  //     expect(to.balance).toBe(700);
  //     expect(to.transactions.length).toBe(0);
  //   });
  // });

  // describe("5. Delete Account Functionality", () => {
    
  //   beforeEach(() => {
  //     saveData({
  //       accounts: [{
  //         id: "ACC-1001",
  //         holderName: "User1",
  //         balance: 500,
  //         createdAt: new Date().toISOString(),
  //         transactions: [{
  //           type: 'DEPOSIT',
  //           amount: 500,
  //           timestamp: new Date().toISOString(),
  //           balanceAfter: 500,
  //           description: 'Initial deposit'
  //         }]
  //       }]
  //     });
  //   });

  //   test("TP-024 - Should NOT allow deletion with balance (BUG)", async () => {
  //     mockDeps.ask.mockResolvedValueOnce("ACC-1001");
      
  //     await deleteAccount(mockDeps);
      
  //     const data = loadData();
  //     expect(data.accounts.length).toBe(0);
  //     expect(findAccountById("ACC-1001")).toBeUndefined();
  //   });

  //   test("TP-029 - Transaction history lost after deletion (BUG)", async () => {
  //     const accountBefore = findAccountById("ACC-1001");
  //     expect(accountBefore.transactions.length).toBe(1);
      
  //     mockDeps.ask.mockResolvedValueOnce("ACC-1001");
      
  //     await deleteAccount(mockDeps);
      
  //     const account = findAccountById("ACC-1001");
  //     expect(account).toBeUndefined();
  //   });
  // });
});