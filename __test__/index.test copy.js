import { jest } from "@jest/globals";
import {
  createAccount,
  depositFunds,
  withdrawFunds,
  transferFunds,
  deleteAccount,
  loadData,
  saveData,
  findAccountById,
  generateAccountId,
} from "../src/index";

describe("BankCLI Pro - Unit Tests", () => {

  beforeEach(() => {
    // Reset data antes de cada test
    saveData({ accounts: [] });
  });

  // Cerrar readline después de todos los tests
  afterAll(() => {
    if (typeof closeReadline === 'function') {
      closeReadline();
    }
  });

  describe("1. Create Account Functionality", () => {

    test("TP-001.(1, 2) - Should reject string or empty input for initial balance", () => {
      // > Initial deposit input as string
      let initialDepositInput = "invalid"; //  "User input"

      let initialDeposit = parseFloat(initialDepositInput);
      const account = {
        id: "ACC-1001",
        holderName: "TestAccount",
        balance: initialDeposit,
        createdAt: new Date().toISOString(),
        transactions: []
      }
      // Assert 
      expect(Number.isNaN(account.balance)).toBe(false); // Balance shouldn't be NaN
      expect(typeof account.balance).toBe("number"); // Balance should be a number

      // > Initial deposit input as empty string
      initialDepositInput = ""; //  "User input"
      initialDeposit = parseFloat(initialDepositInput);
      account.balance = initialDeposit;

      // Assert
      expect(Number.isNaN(account.balance)).toBe(false);
      expect(typeof account.balance).toBe("number");
    });

    test("TP-002 - Should reject spaces-only account name", () => {
      // Name input with only spaces
      const holderName = "   ";

      const account = {
        id: "ACC-1003",
        holderName: holderName,
        balance: 100,
        createdAt: new Date().toISOString(),
        transactions: []
      };

      // Assert
      expect(Boolean(account.holderName.trim())).toBe(true); // Name should not be empty after trimming
    });
  });

  test("TP-004 - Should reject negative initial balance", () => {
    // Initial deposit input as negative number
    const initialDepositInput = "-50";

    const initialDeposit = parseFloat(initialDepositInput);
    const account = {
      id: "ACC-1004",
      holderName: "TestAccount",
      balance: initialDeposit,
      createdAt: new Date().toISOString(),
      transactions: []
    };

    // Assert
    expect(account.balance).toBeGreaterThan(0);
  });

});