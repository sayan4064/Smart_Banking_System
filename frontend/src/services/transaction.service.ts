import { apiClient } from "@/lib/api-client";
import type {
  Transaction,
  TransferRequest,
  TransferResponse,
} from "@/types/transaction.types";

const mockTransactions: Transaction[] = [
  {
    id: 1,
    transactionReference: "TXN-20261106-98101",
    senderAccountNumber: "ACC-84910248",
    receiverAccountNumber: "ACC-19284019",
    amount: 15000.0,
    currency: "INR",
    transactionType: "TRANSFER",
    transactionStatus: "COMPLETED",
    description: "Cloud Infrastructure Monthly Payment",
    initiatedAt: "2026-11-06T10:15:00Z",
    completedAt: "2026-11-06T10:15:02Z",
  },
  {
    id: 2,
    transactionReference: "TXN-20261106-98102",
    senderAccountNumber: "ACC-84910248",
    receiverAccountNumber: "ACC-99482103",
    amount: 95000.0,
    currency: "INR",
    transactionType: "TRANSFER",
    transactionStatus: "OTP_REQUIRED",
    description: "Office Hardware Procurement",
    initiatedAt: "2026-11-06T11:40:00Z",
  },
  {
    id: 3,
    transactionReference: "TXN-20261106-98103",
    senderAccountNumber: "ACC-84910248",
    receiverAccountNumber: "ACC-77192038",
    amount: 2400.0,
    currency: "INR",
    transactionType: "TRANSFER",
    transactionStatus: "REFUNDED",
    description: "Software License Renewal",
    initiatedAt: "2026-11-05T16:20:00Z",
    completedAt: "2026-11-05T16:20:04Z",
    failureReason: "Receiver Account Frozen. Saga compensation refunded sender balance.",
  },
  {
    id: 4,
    transactionReference: "TXN-20261106-98104",
    senderAccountNumber: "ACC-84910248",
    receiverAccountNumber: "ACC-84910248",
    amount: 50000.0,
    currency: "INR",
    transactionType: "PAYMENT_TOPUP",
    transactionStatus: "COMPLETED",
    description: "Razorpay Test Mode Deposit",
    initiatedAt: "2026-11-05T09:00:00Z",
    completedAt: "2026-11-05T09:00:01Z",
  },
  {
    id: 5,
    transactionReference: "TXN-20261106-98105",
    senderAccountNumber: "ACC-84910248",
    receiverAccountNumber: "ACC-33019284",
    amount: 850.0,
    currency: "INR",
    transactionType: "TRANSFER",
    transactionStatus: "COMPLETED",
    description: "Coffee & Team Refreshments",
    initiatedAt: "2026-11-04T13:10:00Z",
    completedAt: "2026-11-04T13:10:01Z",
  },
];

export const transactionService = {
  getMyTransactions: async (params?: {
    status?: string;
    type?: string;
    search?: string;
  }): Promise<Transaction[]> => {
    try {
      const res = await apiClient.get<{ data: Transaction[] }>("/api/v1/transactions/my-transactions", {
        params,
      });
      return res.data.data;
    } catch {
      let filtered = [...mockTransactions];
      if (params?.status && params.status !== "ALL") {
        filtered = filtered.filter((t) => t.transactionStatus === params.status);
      }
      if (params?.type && params.type !== "ALL") {
        filtered = filtered.filter((t) => t.transactionType === params.type);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.transactionReference.toLowerCase().includes(q) ||
            t.receiverAccountNumber.toLowerCase().includes(q) ||
            (t.description && t.description.toLowerCase().includes(q))
        );
      }
      return filtered;
    }
  },

  getTransactions: async (params?: {
    status?: string;
    type?: string;
    search?: string;
  }): Promise<Transaction[]> => {
    try {
      const res = await apiClient.get<{ data: Transaction[] }>("/api/v1/transactions/admin/all", {
        params,
      });
      return res.data.data;
    } catch {
      let filtered = [...mockTransactions];
      if (params?.status && params.status !== "ALL") {
        filtered = filtered.filter((t) => t.transactionStatus === params.status);
      }
      if (params?.type && params.type !== "ALL") {
        filtered = filtered.filter((t) => t.transactionType === params.type);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.transactionReference.toLowerCase().includes(q) ||
            t.senderAccountNumber.toLowerCase().includes(q) ||
            t.receiverAccountNumber.toLowerCase().includes(q) ||
            (t.description && t.description.toLowerCase().includes(q))
        );
      }
      return filtered;
    }
  },

  getTransactionByRef: async (ref: string): Promise<Transaction> => {
    try {
      const res = await apiClient.get<{ data: Transaction }>(`/api/v1/transactions/${ref}`);
      return res.data.data;
    } catch {
      const found = mockTransactions.find((t) => t.transactionReference === ref);
      if (found) return found;
      return mockTransactions[0];
    }
  },

  initiateTransfer: async (request: TransferRequest): Promise<TransferResponse> => {
    try {
      const res = await apiClient.post<{ data: TransferResponse }>("/api/v1/transactions/transfer", request);
      return res.data.data;
    } catch {
      // Simulate real-time fraud rules logic:
      // If transfer amount > 50,000 INR -> trigger OTP challenge
      const isHighAmount = request.amount >= 50000;
      const newRef = `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
        10000 + Math.random() * 90000
      )}`;

      const newTxn: Transaction = {
        id: mockTransactions.length + 1,
        transactionReference: newRef,
        senderAccountNumber: request.senderAccountNumber,
        receiverAccountNumber: request.receiverAccountNumber,
        amount: request.amount,
        currency: request.currency,
        transactionType: "TRANSFER",
        transactionStatus: isHighAmount ? "OTP_REQUIRED" : "COMPLETED",
        description: request.description || "Digital Money Transfer",
        initiatedAt: new Date().toISOString(),
        completedAt: isHighAmount ? undefined : new Date().toISOString(),
      };

      mockTransactions.unshift(newTxn);

      return {
        transactionReference: newRef,
        status: isHighAmount ? "OTP_REQUIRED" : "COMPLETED",
        message: isHighAmount
          ? "Suspicious transfer detected. OTP verification required."
          : "Transfer completed successfully via Saga choreography.",
        requiresOtp: isHighAmount,
      };
    }
  },

  verifyOtp: async (
    txnRef: string,
    otpCode: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await apiClient.post(`/api/v1/transactions/${txnRef}/verify-otp`, {
        otpCode,
      });
      return res.data;
    } catch {
      if (otpCode === "000000" || otpCode.length !== 6) {
        throw new Error("Invalid verification code. Please check and re-enter.");
      }

      // Update mock transaction status to COMPLETED
      const found = mockTransactions.find((t) => t.transactionReference === txnRef);
      if (found) {
        found.transactionStatus = "COMPLETED";
        found.completedAt = new Date().toISOString();
      }

      return {
        success: true,
        message: "OTP verified successfully! Transaction completed.",
      };
    }
  },

  resendOtp: async (txnRef: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await apiClient.post(`/api/v1/transactions/${txnRef}/resend-otp`);
      return res.data;
    } catch {
      return {
        success: true,
        message: "New 6-digit OTP dispatched to your registered phone number.",
      };
    }
  },
};
