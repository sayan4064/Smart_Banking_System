import { TransactionStatusType } from "@/components/transactions/txn-status-badge";

export interface Transaction {
  id: string | number;
  transactionReference: string;
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  currency: string;
  transactionType: "TRANSFER" | "DEPOSIT" | "WITHDRAWAL" | "PAYMENT_TOPUP";
  transactionStatus: TransactionStatusType;
  description?: string;
  initiatedAt: string;
  completedAt?: string;
  failureReason?: string;
}

export interface TransferRequest {
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  currency: string;
  description?: string;
}

export interface TransferResponse {
  transactionReference: string;
  status: TransactionStatusType;
  message: string;
  requiresOtp?: boolean;
}
