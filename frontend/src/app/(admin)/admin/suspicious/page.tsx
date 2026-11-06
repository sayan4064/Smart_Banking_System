"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/fraud/risk-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertTriangle,
  Search,
  CheckCircle,
  XCircle,
  ShieldBan,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { FraudAlert } from "@/types/admin.types";

export default function AdminSuspiciousTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: alerts = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-suspicious-queue"],
    queryFn: () => adminService.getFraudAlerts(),
  });

  // Filter for alerts that are high, critical, or required OTP
  const suspiciousList = alerts.filter(
    (a) => a.riskScore >= 40 || a.decision === "OTP_REQUIRED" || a.decision === "REJECTED"
  );

  const filtered = suspiciousList.filter((a) => {
    return (
      a.transactionReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAction = (alert: FraudAlert, action: "RELEASE" | "BLOCK_CUSTOMER") => {
    if (action === "RELEASE") {
      toast.success(
        `Transaction ${alert.transactionReference} has been manually cleared by compliance officer.`
      );
    } else {
      toast.error(
        `Account ${alert.accountNumber} has been locked and added to global AML watch list.`
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Suspicious Transaction Queue
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Manual compliance triage and risk queue for transactions flagged by the distributed fraud engine.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search suspicious queue by reference, customer name, or account number..."
            className="pl-9"
          />
        </div>
      </Card>

      {/* Queue Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="p-8 text-center text-brand-muted">
            Loading compliance queue...
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="p-8 text-center text-brand-muted">
            <CheckCircle className="w-10 h-10 text-brand-success mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-brand-dark">Queue is empty</p>
            <p className="text-xs text-brand-muted mt-1">
              No transactions currently flagged for manual compliance review.
            </p>
          </Card>
        ) : (
          filtered.map((item) => (
            <Card
              key={item.id}
              className="p-5 border border-slate-100 shadow-sm hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-brand-primary text-sm">
                      {item.transactionReference}
                    </span>
                    <RiskBadge level={item.riskLevel} />
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Risk Score: {item.riskScore}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-slate-700 pt-1">
                    <div>
                      <span className="text-brand-muted block font-sans">Customer:</span>
                      <span className="font-semibold">{item.customerName}</span>
                    </div>
                    <div>
                      <span className="text-brand-muted block font-sans">Account:</span>
                      <span>{item.accountNumber}</span>
                    </div>
                    <div>
                      <span className="text-brand-muted block font-sans">Flagged Amount:</span>
                      <span className="font-bold text-brand-dark">
                        {formatCurrency(item.amount, item.currency)}
                      </span>
                    </div>
                    <div>
                      <span className="text-brand-muted block font-sans">Detected:</span>
                      <span>{formatDate(item.detectionTime)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.triggeredRules.map((rule, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200"
                      >
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1 text-brand-success hover:bg-brand-success/10"
                    onClick={() => handleAction(item, "RELEASE")}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve Exception
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="h-8 text-xs gap-1"
                    onClick={() => handleAction(item, "BLOCK_CUSTOMER")}
                  >
                    <ShieldBan className="w-3.5 h-3.5" />
                    Freeze Account
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
