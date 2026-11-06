"use client";

import * as React from "react";
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft, CreditCard, Sparkles } from "lucide-react";
import { formatCurrency, maskAccountNumber } from "@/lib/utils";
import { AccountStatusBadge } from "./account-status-badge";
import { CopyButton } from "@/components/ui/copy-button";
import Link from "next/link";

export interface AccountBalanceCardProps {
  id?: string | number;
  accountNumber: string;
  accountHolderName: string;
  accountType: string;
  balance: number;
  currency?: string;
  accountStatus: string;
  onSendClick?: () => void;
  onAddClick?: () => void;
}

export function AccountBalanceCard({
  accountNumber,
  accountHolderName,
  accountType,
  balance,
  currency = "INR",
  accountStatus,
}: AccountBalanceCardProps) {
  const [showBalance, setShowBalance] = React.useState(true);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#172033] via-[#1E2942] to-[#121826] p-7 text-white shadow-soft transition-all duration-300 hover:shadow-dropdown">
      {/* Subtle background circuit watermark */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
            <CreditCard className="h-5 w-5 text-primary-100" />
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-300">
              {accountType} Account
            </span>
          </div>
        </div>
        <AccountStatusBadge status={accountStatus} />
      </div>

      {/* Balance Section */}
      <div className="relative z-10 mt-6">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Available Balance</span>
          <button
            type="button"
            onClick={() => setShowBalance(!showBalance)}
            className="rounded p-0.5 text-slate-400 transition hover:text-white focus:outline-none"
            title={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>

        <div className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {showBalance ? formatCurrency(balance, currency) : "₹ •••••••"}
        </div>
      </div>

      {/* Account Details & Quick Actions */}
      <div className="relative z-10 mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-5">
        <div>
          <p className="text-xs font-medium text-slate-400">Account Holder</p>
          <p className="text-sm font-semibold text-white">{accountHolderName}</p>
          <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-slate-300">
            <span>{maskAccountNumber(accountNumber)}</span>
            <CopyButton
              value={accountNumber}
              label="Account number copied"
              className="text-slate-400 hover:bg-white/10 hover:text-white p-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/transfer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-primary-600 active:scale-95"
          >
            <ArrowUpRight className="h-3.5 w-3.5" /> Send
          </Link>
          <Link
            href="/payments"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
          >
            <ArrowDownLeft className="h-3.5 w-3.5" /> Add
          </Link>
        </div>
      </div>
    </div>
  );
}

