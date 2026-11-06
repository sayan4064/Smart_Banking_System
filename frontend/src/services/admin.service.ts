import { apiClient } from "@/lib/api-client";
import type {
  AdminDashboardMetrics,
  CustomerRecord,
  FraudAlert,
  SystemLogEntry,
  AnalyticsSummary,
} from "@/types/admin.types";
import type { BankAccount } from "@/types/account.types";

const mockMetrics: AdminDashboardMetrics = {
  totalCustomers: 1248,
  activeAccounts: 1892,
  totalTransactions: 15420,
  totalVolume: 84920000,
  suspiciousTransactions: 42,
  failedTransactions: 18,
  fraudDetectionRate: "99.4%",
};

const mockCustomers: CustomerRecord[] = [
  {
    id: 101,
    fullName: "Sayan Mukherjee",
    email: "customer@apexbank.io",
    phoneNumber: "+91 98765 43210",
    accountsCount: 2,
    totalBalance: 349950.5,
    status: "ACTIVE",
    registeredAt: "2026-01-15T09:30:00Z",
  },
  {
    id: 102,
    fullName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phoneNumber: "+91 91234 56789",
    accountsCount: 1,
    totalBalance: 125000.0,
    status: "ACTIVE",
    registeredAt: "2026-01-20T11:15:00Z",
  },
  {
    id: 103,
    fullName: "Rohit Verma",
    email: "rohit.verma@example.com",
    phoneNumber: "+91 98111 22334",
    accountsCount: 1,
    totalBalance: 4200.0,
    status: "BLOCKED",
    registeredAt: "2026-02-04T16:45:00Z",
  },
  {
    id: 104,
    fullName: "Aditi Roy",
    email: "aditi.roy@example.com",
    phoneNumber: "+91 97722 33445",
    accountsCount: 1,
    totalBalance: 88400.0,
    status: "ACTIVE",
    registeredAt: "2026-02-14T10:00:00Z",
  },
  {
    id: 105,
    fullName: "Vikram Malhotra",
    email: "vikram.m@example.com",
    phoneNumber: "+91 99000 11223",
    accountsCount: 2,
    totalBalance: 512000.0,
    status: "ACTIVE",
    registeredAt: "2026-02-18T13:20:00Z",
  },
];

const mockFraudAlerts: FraudAlert[] = [
  {
    id: 1,
    transactionReference: "TXN-20261106-98102",
    customerName: "Sayan Mukherjee",
    accountNumber: "ACC-84910248",
    amount: 95000.0,
    currency: "INR",
    riskScore: 60,
    riskLevel: "HIGH",
    triggeredRules: ["Rule 3: Balance Percentage (>90%)"],
    decision: "OTP_REQUIRED",
    detectionTime: "2026-11-06T11:40:00Z",
    status: "OTP_REQUIRED",
  },
  {
    id: 2,
    transactionReference: "TXN-20261106-99014",
    customerName: "Rohit Verma",
    accountNumber: "ACC-77192038",
    amount: 140000.0,
    currency: "INR",
    riskScore: 85,
    riskLevel: "CRITICAL",
    triggeredRules: ["Rule 1: Velocity (>5 txns/min)", "Rule 5: Rapid Repeats (<10s)"],
    decision: "REJECTED",
    detectionTime: "2026-11-06T09:12:00Z",
    status: "FAILED",
  },
  {
    id: 3,
    transactionReference: "TXN-20261105-88120",
    customerName: "Priya Sharma",
    accountNumber: "ACC-99482103",
    amount: 32000.0,
    currency: "INR",
    riskScore: 45,
    riskLevel: "MEDIUM",
    triggeredRules: ["Rule 2: Spike Amount (>3.0x average)"],
    decision: "OTP_REQUIRED",
    detectionTime: "2026-11-05T14:22:00Z",
    status: "COMPLETED",
  },
];

let globalAccountsList: BankAccount[] = [
  {
    id: 1,
    accountNumber: "ACC-84910248",
    accountHolderName: "Sayan Mukherjee",
    accountType: "SAVINGS",
    balance: 284750.0,
    currency: "INR",
    accountStatus: "ACTIVE",
    createdAt: "2026-01-15T09:30:00Z",
  },
  {
    id: 2,
    accountNumber: "ACC-49102831",
    accountHolderName: "Sayan Mukherjee",
    accountType: "CURRENT",
    balance: 65200.5,
    currency: "INR",
    accountStatus: "ACTIVE",
    createdAt: "2026-02-01T14:20:00Z",
  },
  {
    id: 3,
    accountNumber: "ACC-77192038",
    accountHolderName: "Rohit Verma",
    accountType: "SAVINGS",
    balance: 4200.0,
    currency: "INR",
    accountStatus: "BLOCKED",
    createdAt: "2026-02-04T16:45:00Z",
  },
  {
    id: 4,
    accountNumber: "ACC-99482103",
    accountHolderName: "Priya Sharma",
    accountType: "SAVINGS",
    balance: 125000.0,
    currency: "INR",
    accountStatus: "ACTIVE",
    createdAt: "2026-01-20T11:15:00Z",
  },
];

const mockLogs: SystemLogEntry[] = [
  {
    id: "log-1",
    timestamp: "2026-11-06T11:40:02Z",
    level: "INFO",
    service: "transaction-service",
    traceId: "tr-98102-saga",
    message: "Transaction initiated event published to Kafka topic 'transaction.initiated'",
    metadata: { ref: "TXN-20261106-98102", amount: 95000 },
  },
  {
    id: "log-2",
    timestamp: "2026-11-06T11:40:03Z",
    level: "WARN",
    service: "fraud-detection-service",
    traceId: "tr-98102-saga",
    message: "Fraud rule triggered: Rule 3 (Balance Percentage >90%). Decision: OTP_REQUIRED",
    metadata: { riskScore: 60, senderAcc: "ACC-84910248" },
  },
  {
    id: "log-3",
    timestamp: "2026-11-06T11:40:04Z",
    level: "INFO",
    service: "notification-service",
    traceId: "tr-98102-saga",
    message: "OTP dispatch requested. 6-digit code delivered via SMS & Email",
    metadata: { recipient: "+91 98765 43210" },
  },
  {
    id: "log-4",
    timestamp: "2026-11-06T09:12:01Z",
    level: "ERROR",
    service: "fraud-detection-service",
    traceId: "tr-99014-fraud",
    message: "CRITICAL risk score (85) exceeded reject threshold (70). Automated block triggered",
    metadata: { ref: "TXN-20261106-99014", rules: ["Velocity", "Rapid Repeats"] },
  },
  {
    id: "log-5",
    timestamp: "2026-11-06T09:12:02Z",
    level: "INFO",
    service: "account-service",
    traceId: "tr-99014-saga",
    message: "Compensating transaction executed. Account ACC-77192038 flagged for administrative review",
  },
];

const mockAnalytics: AnalyticsSummary = {
  dailyVolume: [
    { date: "Oct 31", volume: 6800000, count: 1240 },
    { date: "Nov 01", volume: 9200000, count: 1890 },
    { date: "Nov 02", volume: 8100000, count: 1640 },
    { date: "Nov 03", volume: 11400000, count: 2100 },
    { date: "Nov 04", volume: 9800000, count: 1950 },
    { date: "Nov 05", volume: 14200000, count: 2850 },
    { date: "Nov 06", volume: 15420000, count: 3200 },
  ],
  fraudDistribution: [
    { rule: "Velocity Limit (>5/min)", triggeredCount: 18, percentage: 42 },
    { rule: "Amount Spike (>3x)", triggeredCount: 11, percentage: 26 },
    { rule: "High Balance Drain (>90%)", triggeredCount: 8, percentage: 19 },
    { rule: "Rapid Repeats (<10s)", triggeredCount: 5, percentage: 13 },
  ],
  statusDistribution: [
    { status: "Completed", count: 14850, color: "#16A36A" },
    { status: "OTP Verified", count: 420, color: "#315CFD" },
    { status: "Pending Review", count: 42, color: "#E9A23B" },
    { status: "Failed / Rejected", count: 108, color: "#E5484D" },
  ],
};

export const adminService = {
  getMetrics: async (): Promise<AdminDashboardMetrics> => {
    try {
      const res = await apiClient.get<{ data: AdminDashboardMetrics }>("/api/v1/admin/metrics");
      return res.data.data;
    } catch {
      return mockMetrics;
    }
  },

  getCustomers: async (): Promise<CustomerRecord[]> => {
    try {
      const res = await apiClient.get<{ data: CustomerRecord[] }>("/api/v1/admin/customers");
      return res.data.data;
    } catch {
      return mockCustomers;
    }
  },

  getAllAccounts: async (): Promise<BankAccount[]> => {
    try {
      const res = await apiClient.get<{ data: BankAccount[] }>("/api/v1/accounts/admin/all");
      return res.data.data;
    } catch {
      return globalAccountsList;
    }
  },

  toggleAccountStatus: async (
    accountNumber: string,
    newStatus: "ACTIVE" | "BLOCKED"
  ): Promise<BankAccount> => {
    try {
      const res = await apiClient.put<{ data: BankAccount }>(
        `/api/v1/accounts/${accountNumber}/status`,
        { status: newStatus }
      );
      return res.data.data;
    } catch {
      const found = globalAccountsList.find((a) => a.accountNumber === accountNumber);
      if (found) {
        found.accountStatus = newStatus;
        return found;
      }
      throw new Error("Account not found");
    }
  },

  getFraudAlerts: async (): Promise<FraudAlert[]> => {
    try {
      const res = await apiClient.get<{ data: FraudAlert[] }>("/api/v1/fraud/admin/alerts");
      return res.data.data;
    } catch {
      return mockFraudAlerts;
    }
  },

  getLogs: async (): Promise<SystemLogEntry[]> => {
    try {
      const res = await apiClient.get<{ data: SystemLogEntry[] }>("/api/v1/admin/logs");
      return res.data.data;
    } catch {
      return mockLogs;
    }
  },

  getAnalytics: async (): Promise<AnalyticsSummary> => {
    try {
      const res = await apiClient.get<{ data: AnalyticsSummary }>("/api/v1/admin/analytics");
      return res.data.data;
    } catch {
      return mockAnalytics;
    }
  },
};

