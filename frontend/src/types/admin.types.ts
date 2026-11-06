import { RiskLevelType } from "@/components/fraud/risk-badge";
import { TransactionStatusType } from "@/components/transactions/txn-status-badge";

export interface AdminDashboardMetrics {
  totalCustomers: number;
  activeAccounts: number;
  totalTransactions: number;
  totalVolume: number;
  suspiciousTransactions: number;
  failedTransactions: number;
  fraudDetectionRate: string;
}

export interface CustomerRecord {
  id: string | number;
  fullName: string;
  email: string;
  phoneNumber: string;
  accountsCount: number;
  totalBalance: number;
  status: "ACTIVE" | "BLOCKED" | "FLAGGED";
  registeredAt: string;
}

export interface FraudAlert {
  id: string | number;
  transactionReference: string;
  customerName: string;
  accountNumber: string;
  amount: number;
  currency: string;
  riskScore: number;
  riskLevel: RiskLevelType;
  triggeredRules: string[];
  decision: "APPROVED" | "OTP_REQUIRED" | "REJECTED";
  detectionTime: string;
  status: TransactionStatusType;
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  service: "api-gateway" | "account-service" | "transaction-service" | "fraud-detection-service" | "payment-service" | "notification-service";
  traceId: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsSummary {
  dailyVolume: { date: string; volume: number; count: number }[];
  fraudDistribution: { rule: string; triggeredCount: number; percentage: number }[];
  statusDistribution: { status: string; count: number; color: string }[];
}

