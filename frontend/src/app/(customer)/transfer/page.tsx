"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRightLeft,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Wallet,
  CheckCircle2,
  Info,
} from "lucide-react";
import { accountService } from "@/services/account.service";
import { transactionService } from "@/services/transaction.service";
import { formatCurrency, maskAccountNumber } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { toast } from "sonner";
import type { BankAccount } from "@/types/account.types";

export default function TransferPage() {
  const router = useRouter();
  const [accounts, setAccounts] = React.useState<BankAccount[]>([]);
  const [selectedSender, setSelectedSender] = React.useState<string>("");
  const [receiverAccount, setReceiverAccount] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadAccounts() {
      const data = await accountService.getMyAccounts();
      setAccounts(data);
      if (data.length > 0) {
        setSelectedSender(data[0].accountNumber);
      }
    }
    loadAccounts();
  }, []);

  const activeAccount = accounts.find((a) => a.accountNumber === selectedSender) || accounts[0];
  const numAmount = parseFloat(amount) || 0;
  const isBalanceExceeded = activeAccount && numAmount > activeAccount.balance;
  const isHighValue = numAmount >= 50000;

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!receiverAccount.trim()) {
      setErrorMessage("Please enter a valid receiver account number.");
      return;
    }
    if (receiverAccount.trim() === selectedSender) {
      setErrorMessage("Sender and receiver account numbers cannot be identical.");
      return;
    }
    if (numAmount <= 0) {
      setErrorMessage("Transfer amount must be greater than zero.");
      return;
    }
    if (isBalanceExceeded) {
      setErrorMessage("Transfer amount exceeds available account balance.");
      return;
    }

    setIsConfirmOpen(true);
  };

  const handleExecuteTransfer = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await transactionService.initiateTransfer({
        senderAccountNumber: selectedSender,
        receiverAccountNumber: receiverAccount.trim(),
        amount: numAmount,
        currency: activeAccount?.currency || "INR",
        description: description.trim() || "Money Transfer",
      });

      setIsConfirmOpen(false);

      if (result.requiresOtp || result.status === "OTP_REQUIRED") {
        toast.warning("Fraud Alert: High-value transfer requires OTP verification.");
        router.push(`/transfer/otp?ref=${result.transactionReference}`);
      } else {
        toast.success("Transfer completed successfully!");
        router.push("/transactions");
      }
    } catch (err: any) {
      setIsConfirmOpen(false);
      setErrorMessage(err.message || "Transfer processing failed. Compensation executed.");
      toast.error("Transfer failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Transfer Money
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Choreographed distributed Saga transfer with real-time fraud evaluation
        </p>
      </div>

      {errorMessage && (
        <Alert variant="danger" title="Transfer Error">
          {errorMessage}
        </Alert>
      )}

      {/* Main Transfer Wizard Form */}
      <Card className="shadow-dropdown">
        <CardContent className="pt-6">
          <form onSubmit={handleReview} className="space-y-6">
            {/* Step 1: Sender Account */}
            <div className="space-y-2">
              <Select
                label="Step 1: From Bank Account"
                value={selectedSender}
                onChange={(e) => setSelectedSender(e.target.value)}
                options={accounts.map((a) => ({
                  value: a.accountNumber,
                  label: `${a.accountNumber} (${a.accountType}) - ${formatCurrency(a.balance, a.currency)}`,
                }))}
              />
              {activeAccount && (
                <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
                  <span>Available Balance:</span>
                  <span className="font-extrabold text-foreground">
                    {formatCurrency(activeAccount.balance, activeAccount.currency)}
                  </span>
                </div>
              )}
            </div>

            {/* Step 2: Receiver Account */}
            <Input
              label="Step 2: To Account Number"
              placeholder="e.g. ACC-19284019"
              value={receiverAccount}
              onChange={(e) => setReceiverAccount(e.target.value)}
              helperText="Enter 12-digit alphanumeric recipient account number"
            />

            {/* Step 3: Transfer Amount */}
            <div className="space-y-2">
              <Input
                label="Step 3: Transfer Amount"
                type="number"
                min="1"
                step="any"
                placeholder="₹ 0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                error={isBalanceExceeded ? "Exceeds available balance" : undefined}
              />

              {/* Quick Select Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[1000, 5000, 10000, 50000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(String(preset))}
                    className="rounded-lg border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-foreground transition"
                  >
                    +₹{preset.toLocaleString("en-IN")}
                  </button>
                ))}
                {activeAccount && (
                  <button
                    type="button"
                    onClick={() => setAmount(String(activeAccount.balance))}
                    className="rounded-lg border border-border bg-background px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/5 transition"
                  >
                    Max Balance
                  </button>
                )}
              </div>
            </div>

            {/* High Value Notice */}
            {isHighValue && (
              <Alert variant="warning" title="Security Verification Trigger">
                Transfers of ₹50,000 or greater trigger an automatic 6-digit OTP challenge as part of our fraud protection rules.
              </Alert>
            )}

            {/* Step 4: Description / Note */}
            <Input
              label="Transfer Note (Optional)"
              placeholder="e.g. Invoice payment, rent, gift..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isBalanceExceeded || numAmount <= 0}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Review Transfer
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Confirm Money Transfer"
        description="Verify transaction details before Saga execution"
      >
        <div className="space-y-5 pt-2">
          <div className="rounded-2xl bg-muted/60 p-4 space-y-3 border border-border/60">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">From Account:</span>
              <span className="font-mono font-bold text-foreground">
                {selectedSender}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">To Recipient:</span>
              <span className="font-mono font-bold text-foreground">
                {receiverAccount}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Description:</span>
              <span className="font-semibold text-foreground">
                {description || "Money Transfer"}
              </span>
            </div>
            <div className="border-t border-border/80 pt-2 flex justify-between text-sm">
              <span className="font-bold text-foreground">Total Transfer:</span>
              <span className="text-lg font-black text-primary">
                {formatCurrency(numAmount)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isSubmitting}
            >
              Edit Details
            </Button>
            <Button
              type="button"
              onClick={handleExecuteTransfer}
              isLoading={isSubmitting}
            >
              Confirm &amp; Send
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
