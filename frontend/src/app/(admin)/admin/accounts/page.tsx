"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { AccountStatusBadge } from "@/components/accounts/account-status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  CreditCard,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
} from "lucide-react";
import type { BankAccount } from "@/types/account.types";

export default function AdminAccountsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [actionType, setActionType] = useState<"BLOCK" | "UNBLOCK">("BLOCK");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["admin-accounts"],
    queryFn: () => adminService.getAllAccounts(),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({
      accountNumber,
      newStatus,
    }: {
      accountNumber: string;
      newStatus: "ACTIVE" | "BLOCKED";
    }) => {
      return adminService.toggleAccountStatus(accountNumber, newStatus);
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Account ${variables.accountNumber} has been ${
          variables.newStatus === "BLOCKED" ? "blocked" : "unblocked"
        } successfully.`
      );
      queryClient.invalidateQueries({ queryKey: ["admin-accounts"] });
      setIsModalOpen(false);
      setSelectedAccount(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update account status");
    },
  });

  const handleOpenModal = (account: BankAccount, action: "BLOCK" | "UNBLOCK") => {
    setSelectedAccount(account);
    setActionType(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedAccount) return;
    const newStatus = actionType === "BLOCK" ? "BLOCKED" : "ACTIVE";
    toggleMutation.mutate({
      accountNumber: selectedAccount.accountNumber,
      newStatus,
    });
  };

  const filtered = accounts.filter((acc) => {
    const matchesSearch =
      acc.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accountHolderName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || acc.accountStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark">
            Account Management
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Global ledger accounts across retail and corporate banking clients. Toggle operational status.
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
              placeholder="Search by account number (ACC-...) or account holder..."
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
              <option value="ALL">All Account Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="BLOCKED">Blocked Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Accounts Table */}
      <Card className="border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                <th className="py-3 px-4">Account Number</th>
                <th className="py-3 px-4">Holder Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Ledger Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-brand-dark">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-brand-muted">
                    Loading account records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-brand-muted">
                    No accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filtered.map((acc) => (
                  <tr key={acc.accountNumber} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-brand-primary text-xs">
                      {acc.accountNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-brand-dark">
                      {acc.accountHolderName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-100 font-medium text-slate-700">
                        <CreditCard className="w-3.5 h-3.5 text-brand-muted" />
                        {acc.accountType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-dark">
                      {formatCurrency(acc.balance, acc.currency)}
                    </td>
                    <td className="py-3.5 px-4">
                      <AccountStatusBadge status={acc.accountStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-xs text-brand-muted">
                      {formatDate(acc.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {acc.accountStatus === "ACTIVE" ? (
                        <Button
                          size="sm"
                          variant="danger"
                          className="h-8 text-xs gap-1.5"
                          onClick={() => handleOpenModal(acc, "BLOCK")}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          Block Account
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 text-xs gap-1.5 text-brand-success hover:bg-brand-success/10"
                          onClick={() => handleOpenModal(acc, "UNBLOCK")}
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          Unblock
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={actionType === "BLOCK" ? "Block Bank Account" : "Unblock Bank Account"}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm">
            {actionType === "BLOCK" ? (
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
            )}
            <p>
              {actionType === "BLOCK"
                ? `Are you sure you want to block ${selectedAccount?.accountNumber}? This will immediately reject any incoming debits, outgoing transfers, and card withdrawals.`
                : `Are you sure you want to unblock ${selectedAccount?.accountNumber}? The account holder will regain standard debit and transfer privileges.`}
            </p>
          </div>

          <div className="text-xs space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono">
            <p><span className="text-brand-muted">Account:</span> {selectedAccount?.accountNumber}</p>
            <p><span className="text-brand-muted">Holder:</span> {selectedAccount?.accountHolderName}</p>
            <p><span className="text-brand-muted">Balance:</span> {formatCurrency(selectedAccount?.balance || 0, selectedAccount?.currency)}</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant={actionType === "BLOCK" ? "danger" : "primary"}
              isLoading={toggleMutation.isPending}
              onClick={handleConfirmAction}
            >
              {actionType === "BLOCK" ? "Confirm Block" : "Confirm Unblock"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
