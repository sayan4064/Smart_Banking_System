"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wallet,
  PlusCircle,
  CreditCard,
  Building2,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
} from "lucide-react";
import { accountService } from "@/services/account.service";
import { formatCurrency, maskAccountNumber, formatDate } from "@/lib/utils";
import { AccountStatusBadge } from "@/components/accounts/account-status-badge";
import { AccountBalanceCard } from "@/components/accounts/account-balance-card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import type { BankAccount } from "@/types/account.types";

export default function AccountsPage() {
  const [accounts, setAccounts] = React.useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // New Account Form State
  const [accountType, setAccountType] = React.useState<"SAVINGS" | "CHECKING" | "CURRENT">("SAVINGS");
  const [currency, setCurrency] = React.useState("INR");
  const [initialDeposit, setInitialDeposit] = React.useState("5000");

  const loadAccounts = React.useCallback(async () => {
    try {
      const data = await accountService.getMyAccounts();
      setAccounts(data);
    } catch (err) {
      toast.error("Failed to fetch accounts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await accountService.createAccount({
        accountType,
        currency,
        initialDeposit: parseFloat(initialDeposit) || 0,
      });
      toast.success(`Account ${created.accountNumber} opened successfully!`);
      setIsModalOpen(false);
      loadAccounts();
    } catch (err: any) {
      toast.error(err.message || "Account provisioning failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            My Bank Accounts
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your personal savings, checking, and current digital accounts
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          leftIcon={<PlusCircle className="h-4 w-4" />}
        >
          Open New Account
        </Button>
      </div>

      {/* Grid of Bank Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc) => (
          <div key={acc.id} className="space-y-3">
            <AccountBalanceCard
              id={acc.id}
              accountNumber={acc.accountNumber}
              accountHolderName={acc.accountHolderName}
              accountType={acc.accountType}
              balance={acc.balance}
              currency={acc.currency}
              accountStatus={acc.accountStatus}
            />

            <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
              <span>Opened {formatDate(acc.createdAt)}</span>
              <Link
                href={`/accounts/${acc.accountNumber}`}
                className="font-bold text-primary hover:underline"
              >
                View Ledger &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Open New Account */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Open a New Bank Account"
        description="Select account tier, currency, and initial funding amount"
      >
        <form onSubmit={handleCreateAccount} className="space-y-4 pt-2">
          <Select
            label="Account Category"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as any)}
            options={[
              { value: "SAVINGS", label: "Savings Account (4.0% APY Interest)" },
              { value: "CURRENT", label: "Current Account (Unlimited Transfers)" },
              { value: "CHECKING", label: "Checking Account (Daily Retail Debit)" },
            ]}
          />

          <Select
            label="Base Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            options={[
              { value: "INR", label: "INR - Indian Rupee (₹)" },
              { value: "USD", label: "USD - United States Dollar ($)" },
            ]}
          />

          <Input
            label="Initial Deposit Amount"
            type="number"
            min="500"
            step="100"
            value={initialDeposit}
            onChange={(e) => setInitialDeposit(e.target.value)}
            helperText="Minimum initial deposit is ₹500"
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Open Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
