"use client";

import * as React from "react";
import Link from "next/link";
import {
  History,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { transactionService } from "@/services/transaction.service";
import { formatCurrency, formatDate, maskAccountNumber } from "@/lib/utils";
import { TxnStatusBadge } from "@/components/transactions/txn-status-badge";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { Transaction } from "@/types/transaction.types";

export default function TransactionsPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [typeFilter, setTypeFilter] = React.useState("ALL");
  const [isLoading, setIsLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await transactionService.getMyTransactions({
        search,
        status: statusFilter,
        type: typeFilter,
      });
      setTransactions(data);
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, typeFilter]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Transaction History
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Complete distributed audit ledger of all account transfers and payments
        </p>
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Search */}
            <div className="sm:col-span-6 relative">
              <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search reference, recipient account..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "ALL", label: "All Statuses" },
                  { value: "COMPLETED", label: "Completed" },
                  { value: "OTP_REQUIRED", label: "OTP Required" },
                  { value: "PROCESSING", label: "Processing" },
                  { value: "REFUNDED", label: "Refunded" },
                  { value: "FAILED", label: "Failed" },
                ]}
              />
            </div>

            {/* Type Filter */}
            <div className="sm:col-span-3">
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: "ALL", label: "All Types" },
                  { value: "TRANSFER", label: "Transfer" },
                  { value: "PAYMENT_TOPUP", label: "Payment Top-Up" },
                  { value: "DEPOSIT", label: "Deposit" },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Ledger Entries</CardTitle>
            <CardDescription>
              Showing {transactions.length} record{transactions.length === 1 ? "" : "s"}
            </CardDescription>
          </div>
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
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      No matching transaction records found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn) => (
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
                          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                        >
                          Details <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
