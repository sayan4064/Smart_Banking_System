"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionService } from "@/services/transaction.service";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { TxnStatusBadge } from "@/components/transactions/txn-status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeftRight,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  GitBranch,
} from "lucide-react";
import type { Transaction } from "@/types/transaction.types";

export default function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: () => transactionService.getTransactions(),
  });

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.transactionReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.senderAccountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.receiverAccountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || t.transactionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark">
            Global Transaction Monitor
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Real-time audit stream of all distributed transactions across the banking network.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by reference (TXN-...), sender or receiver account..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-muted shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 text-sm rounded-lg border border-slate-200 bg-white px-3 text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PROCESSING">Processing</option>
              <option value="OTP_REQUIRED">OTP Required</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Sender Account</th>
                <th className="py-3 px-4">Receiver Account</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Saga Status</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-brand-dark">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-brand-muted">
                    Loading transactions stream...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-brand-muted">
                    No transactions found matching your query.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.transactionReference} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-brand-primary text-xs">
                      {t.transactionReference}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-700">
                      {t.senderAccountNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-700">
                      {t.receiverAccountNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-dark">
                      {formatCurrency(t.amount, t.currency)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                        {t.transactionType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <TxnStatusBadge status={t.transactionStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-xs text-brand-muted">
                      {formatDate(t.initiatedAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 text-xs gap-1"
                        onClick={() => setSelectedTxn(t)}
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        Inspect Saga
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inspect Saga Modal */}
      {selectedTxn && (
        <Modal
          isOpen={!!selectedTxn}
          onClose={() => setSelectedTxn(null)}
          title={`Saga Audit: ${selectedTxn.transactionReference}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 font-mono">
              <div>
                <p className="text-brand-muted">Sender Account:</p>
                <p className="font-semibold text-brand-dark">{selectedTxn.senderAccountNumber}</p>
              </div>
              <div>
                <p className="text-brand-muted">Receiver Account:</p>
                <p className="font-semibold text-brand-dark">{selectedTxn.receiverAccountNumber}</p>
              </div>
              <div>
                <p className="text-brand-muted">Gross Amount:</p>
                <p className="font-semibold text-brand-dark">{formatCurrency(selectedTxn.amount, selectedTxn.currency)}</p>
              </div>
              <div>
                <p className="text-brand-muted">Current State:</p>
                <div className="mt-0.5">
                  <TxnStatusBadge status={selectedTxn.transactionStatus} />
                </div>
              </div>
            </div>

            {/* Saga Timeline Steps */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Distributed Choreography Lifecycle
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark">1. Transfer Initiated</p>
                    <p className="text-brand-muted">Transaction registered by Transaction Service & validated</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark">2. Sender Balance Debited</p>
                    <p className="text-brand-muted">Account Service executed atomic balance deduction with optimistic locking</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark">3. Fraud Engine Evaluation</p>
                    <p className="text-brand-muted">5-rule real-time assessment calculated risk score and approved dispatch</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedTxn.transactionStatus === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : selectedTxn.transactionStatus === "FAILED"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {selectedTxn.transactionStatus === "COMPLETED" ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : selectedTxn.transactionStatus === "FAILED" ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark">4. Receiver Balance Credited & Finalized</p>
                    <p className="text-brand-muted">
                      {selectedTxn.transactionStatus === "COMPLETED"
                        ? "Account credited and Kafka completion event emitted"
                        : selectedTxn.transactionStatus === "FAILED"
                        ? `Transaction halted: ${selectedTxn.failureReason || "Compensation triggered"}`
                        : "Awaiting final settlement event"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button variant="outline" onClick={() => setSelectedTxn(null)}>
                Close Audit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
