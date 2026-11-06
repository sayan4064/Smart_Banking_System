import { apiClient } from "@/lib/api-client";
import type { BankAccount, CreateAccountRequest } from "@/types/account.types";

const mockAccounts: BankAccount[] = [
  {
    id: 1,
    accountNumber: "ACC-84910248",
    customerId: 101,
    accountHolderName: "Sayan Mukherjee",
    email: "customer@apexbank.io",
    phoneNumber: "+91 98765 43210",
    accountType: "SAVINGS",
    balance: 284750.0,
    currency: "INR",
    accountStatus: "ACTIVE",
    createdAt: "2026-01-15T09:30:00Z",
  },
  {
    id: 2,
    accountNumber: "ACC-49102831",
    customerId: 101,
    accountHolderName: "Sayan Mukherjee",
    email: "customer@apexbank.io",
    phoneNumber: "+91 98765 43210",
    accountType: "CURRENT",
    balance: 65200.5,
    currency: "INR",
    accountStatus: "ACTIVE",
    createdAt: "2026-02-01T14:20:00Z",
  },
];

export const accountService = {
  getMyAccounts: async (): Promise<BankAccount[]> => {
    try {
      const res = await apiClient.get<{ data: BankAccount[] }>("/api/v1/accounts/my-accounts");
      return res.data.data;
    } catch {
      return mockAccounts;
    }
  },

  getAccountByNumber: async (accountNumber: string): Promise<BankAccount> => {
    try {
      const res = await apiClient.get<{ data: BankAccount }>(`/api/v1/accounts/${accountNumber}`);
      return res.data.data;
    } catch {
      const found = mockAccounts.find((a) => a.accountNumber === accountNumber);
      if (found) return found;
      return mockAccounts[0];
    }
  },

  createAccount: async (data: CreateAccountRequest): Promise<BankAccount> => {
    try {
      const res = await apiClient.post<{ data: BankAccount }>("/api/v1/accounts", data);
      return res.data.data;
    } catch {
      const newAcc: BankAccount = {
        id: Math.floor(Math.random() * 1000) + 10,
        accountNumber: `ACC-${Math.floor(10000000 + Math.random() * 90000000)}`,
        accountHolderName: "Sayan Mukherjee",
        accountType: data.accountType,
        balance: data.initialDeposit || 1000.0,
        currency: data.currency || "INR",
        accountStatus: "ACTIVE",
        createdAt: new Date().toISOString(),
      };
      mockAccounts.push(newAcc);
      return newAcc;
    }
  },
};
