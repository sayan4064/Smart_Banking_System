"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  KeyRound,
  ExternalLink,
  Layers,
} from "lucide-react";
import { transactionService } from "@/services/transaction.service";
import { formatCurrency, formatDate, maskAccountNumber } from "@/lib/utils";
import { TxnStatusBadge } from "@/components/transactions/txn-status-badge";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import type { Transaction } from "@/types/transaction.types";

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const txnRef = String(params.ref);

  const [txn, setTxn] = React.useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadTxn() {
      try {
        const data = await transactionService.getTransactionByRef(txnRef);
        setTxn(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadTxn();
  }, [txnRef]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-muted" />
        <div className="h-64 w-full animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!txn) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">Transaction not found.</p>
        <Link href="/transactions">
          <Button variant="outline">Back to Transactions</Button>
        </Link>
      </div>
    );
  }

  const isRefunded = txn.transactionStatus === "REFUNDED";
  const isOtpRequired = txn.transactionStatus === "OTP_REQUIRED";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
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
            Transaction Details
          </h1>
          <p className="text-xs text-muted-foreground">
            Distributed Saga execution audit log for {txn.transactionReference}
          </p>
        </div>
      </div>

      {isRefunded && (
        <Alert variant="warning" title="Saga Compensation Executed">
          {txn.failureReason || "Receiver account could not be credited. The transfer amount was automatically refunded to the sender account."}
        </Alert>
      )}

      {isOtpRequired && (
        <Alert variant="warning" title="OTP Verification Pending">
          This transaction is currently held in state OTP_REQUIRED.{" "}
          <Link
            href={`/transfer/otp?ref=${txn.transactionReference}`}
            className="font-bold underline ml-1"
          >
            Click here to enter OTP code
          </Link>
        </Alert>
      )}

      {/* Main Details Card */}
      <Card className="shadow-dropdown">
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Transaction Reference
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xl font-bold text-foreground">
                  {txn.transactionReference}
                </span>
                <CopyButton value={txn.transactionReference} label="Reference copied" />
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Settled Amount
              </p>
              <p className="text-3xl font-black text-primary mt-1">
                {formatCurrency(txn.amount, txn.currency)}
              </p>
            </div>
          </div>

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-border">
            <div className="rounded-2xl bg-muted/40 p-4 space-y-1.5 border border-border/60">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Sender Account
              </p>
              <p className="font-mono font-bold text-sm text-foreground">
                {txn.senderAccountNumber}
              </p>
              <p className="text-xs text-muted-foreground">Debited with JPA @Version lock</p>
            </div>

            <div className="rounded-2xl bg-muted/40 p-4 space-y-1.5 border border-border/60">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Receiver Account
              </p>
              <p className="font-mono font-bold text-sm text-foreground">
                {txn.receiverAccountNumber}
              </p>
              <p className="text-xs text-muted-foreground">Credited via Kafka consumer</p>
            </div>
          </div>

          {/* Timeline of Saga Steps */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Saga Execution Timeline
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success-50 text-success shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Step 1: Sender Account Debited</p>
                  <p className="text-[11px] text-muted-foreground">
                    Account Service deducted funds and verified zero negative balance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success-50 text-success shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Step 2: TransactionInitiatedEvent Published</p>
                  <p className="text-[11px] text-muted-foreground">
                    Transactional Outbox committed to Kafka topic <code className="font-mono font-semibold">transaction.initiated</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success-50 text-success shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Step 3: Fraud Detection Engine Evaluation</p>
                  <p className="text-[11px] text-muted-foreground">
                    Evaluated 5 rules: Velocity, Anomaly Ratio, Balance Threshold.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full shrink-0 mt-0.5 ${
                    isRefunded
                      ? "bg-danger-50 text-danger"
                      : "bg-success-50 text-success"
                  }`}
                >
                  {isRefunded ? (
                    <RotateCcw className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {isRefunded ? "Step 4: Saga Rollback (Compensating Credit)" : "Step 4: Receiver Credited & Completed"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {isRefunded
                      ? "Receiver credit failed. Compensating transaction restored sender balance."
                      : "Account Service credited receiver and emitted transaction.completed event."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
