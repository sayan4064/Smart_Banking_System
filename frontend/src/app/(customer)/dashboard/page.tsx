"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wallet,
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  TrendingUp,
  CreditCard,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { accountService } from "@/services/account.service";
import { transactionService } from "@/services/transaction.service";
import { formatCurrency, formatDate, maskAccountNumber } from "@/lib/utils";
import { MetricCard } from "@/components/dashboard/metric-card";
import { AccountBalanceCard } from "@/components/accounts/account-balance-card";
import { TransactionChart } from "@/components/dashboard/transaction-chart";
import { TxnStatusBadge } from "@/components/transactions/txn-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { BankAccount } from "@/types/account.types";
import type { Transaction } from "@/types/transaction.types";

export default function CustomerDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [accounts, setAccounts] = React.useState<BankAccount[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        const [accList, txnList] = await Promise.all([
          accountService.getMyAccounts(),
          transactionService.getMyTransactions(),
        ]);
        setAccounts(accList);
        setTransactions(txnList);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const primaryAccount = accounts[0] || {
    accountNumber: "ACC-84910248",
    accountHolderName: user?.fullName || "Sayan Mukherjee",
    accountType: "SAVINGS",
    balance: 284750.0,
    currency: "INR",
    accountStatus: "ACTIVE",
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0) || primaryAccount.balance;

  return (
    <div className="space-y-8">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {user?.fullName || "Sayan"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time multi-account balance overview and active transfer monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/transfer">
            <Button size="sm" leftIcon={<ArrowUpRight className="h-4 w-4" />}>
              Send Money
            </Button>
          </Link>
          <Link href="/payments">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowDownLeft className="h-4 w-4 text-primary" />}
            >
              Add Money
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Net Balance"
          value={formatCurrency(totalBalance)}
          change="+14.2%"
          isPositive={true}
          icon={<Wallet className="h-5 w-5" />}
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
        />
        <MetricCard
          title="Monthly Inflow"
          value={formatCurrency(110000)}
          change="+8.6%"
          isPositive={true}
          icon={<ArrowDownLeft className="h-5 w-5" />}
          iconBgColor="bg-success-50"
          iconColor="text-success"
        />
        <MetricCard
          title="Monthly Outflow"
          value={formatCurrency(52000)}
          change="-3.1%"
          isPositive={false}
          icon={<ArrowUpRight className="h-5 w-5" />}
          iconBgColor="bg-danger-50"
          iconColor="text-danger"
        />
        <MetricCard
          title="Total Transfers"
          value={String(transactions.length || 24)}
          change="+5 this week"
          isPositive={true}
          icon={<History className="h-5 w-5" />}
          iconBgColor="bg-secondary/10"
          iconColor="text-secondary"
        />
      </div>

      {/* Main Row: Primary Account Card + Recharts Cashflow Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Account Card Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Primary Account
            </h3>
            <Link
              href="/accounts"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              View All Accounts <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <AccountBalanceCard
            accountNumber={primaryAccount.accountNumber}
            accountHolderName={primaryAccount.accountHolderName}
            accountType={primaryAccount.accountType}
            balance={primaryAccount.balance}
            currency={primaryAccount.currency}
            accountStatus={primaryAccount.accountStatus}
          />
        </div>

        {/* Right: Cashflow Area Chart */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Cashflow Analytics</CardTitle>
                <CardDescription>Income vs. expenses over the past 6 months</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Inflow
                </span>
                <span className="flex items-center gap-1.5 text-danger">
                  <span className="h-2 w-2 rounded-full bg-danger" /> Outflow
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <TransactionChart />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Real-time distributed ledger entries</CardDescription>
          </div>
          <Link href="/transactions">
            <Button variant="ghost" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
              Full History
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {transactions.slice(0, 5).map((txn) => (
                  <tr key={txn.id} className="hover:bg-muted/40 transition">
                    <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                      {txn.transactionReference}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-foreground">
                        {txn.description || "Transfer"}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {maskAccountNumber(txn.receiverAccountNumber)}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-muted-foreground">
                      {txn.transactionType}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {formatDate(txn.initiatedAt)}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-foreground">
                      {formatCurrency(txn.amount, txn.currency)}
                    </td>
                    <td className="py-3.5 px-4">
                      <TxnStatusBadge status={txn.transactionStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/transactions/${txn.transactionReference}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
