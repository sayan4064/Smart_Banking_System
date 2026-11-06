"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Wallet,
  ShieldCheck,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Layers,
  Lock,
} from "lucide-react";
import { accountService } from "@/services/account.service";
import { transactionService } from "@/services/transaction.service";
import { formatCurrency, formatDate, maskAccountNumber } from "@/lib/utils";
import { AccountStatusBadge } from "@/components/accounts/account-status-badge";
import { TxnStatusBadge } from "@/components/transactions/txn-status-badge";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { BankAccount } from "@/types/account.types";
import type { Transaction } from "@/types/transaction.types";

export default function AccountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const accountNumber = String(params.id);

  const [account, setAccount] = React.useState<BankAccount | null>(null);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadDetails() {
      try {
        const [acc, txns] = await Promise.all([
          accountService.getAccountByNumber(accountNumber),
          transactionService.getMyTransactions(),
        ]);
        setAccount(acc);
        setTransactions(txns);
      } catch (err) {
        console.error("Account details error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDetails();
  }, [accountNumber]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-muted" />
        <div className="h-64 w-full animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">Account not found.</p>
        <Link href="/accounts">
          <Button variant="outline">Back to Accounts</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button & Title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Account Details
          </h1>
          <p className="text-xs text-muted-foreground">
            Complete balance and ledger history for {account.accountNumber}
          </p>
        </div>
      </div>

      {/* Account Profile Card */}
      <Card className="shadow-dropdown">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {account.accountType} ACCOUNT
                </span>
                <AccountStatusBadge status={account.accountStatus} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-bold text-foreground">
                  {account.accountNumber}
                </span>
                <CopyButton value={account.accountNumber} label="Account number copied" />
              </div>
              <p className="text-xs text-muted-foreground">
                Holder: <strong className="text-foreground">{account.accountHolderName}</strong>
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Available Balance
              </p>
              <p className="text-3xl font-black text-foreground">
                {formatCurrency(account.balance, account.currency)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2">
              <Link href="/transfer">
                <Button size="sm" className="w-full" leftIcon={<ArrowUpRight className="h-4 w-4" />}>
                  Transfer Funds
                </Button>
              </Link>
              <Link href="/payments">
                <Button variant="outline" size="sm" className="w-full" leftIcon={<ArrowDownLeft className="h-4 w-4" />}>
                  Top-Up Account
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Ledger Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Account Ledger Entries</CardTitle>
          <CardDescription>
            Chronological audit of all credits, debits, and Saga compensations for this account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-muted/40 transition">
                    <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                      {txn.transactionReference}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {txn.description}
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
