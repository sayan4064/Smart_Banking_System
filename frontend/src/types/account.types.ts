export interface BankAccount {
  id: string | number;
  accountNumber: string;
  customerId?: string | number;
  accountHolderName: string;
  email?: string;
  phoneNumber?: string;
  accountType: "SAVINGS" | "CHECKING" | "CURRENT";
  balance: number;
  currency: string;
  accountStatus: "ACTIVE" | "BLOCKED" | "FROZEN" | "CLOSED";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAccountRequest {
  accountType: "SAVINGS" | "CHECKING" | "CURRENT";
  currency: string;
  initialDeposit?: number;
}
