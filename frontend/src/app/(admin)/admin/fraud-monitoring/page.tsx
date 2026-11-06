"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/fraud/risk-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ShieldAlert,
  Search,
  Filter,
  Zap,
  Activity,
  AlertOctagon,
  CheckCircle2,
  Lock,
  Eye,
} from "lucide-react";

const FRAUD_RULES = [
  {
    ruleId: "RULE-01",
    name: "Transaction Velocity",
    threshold: "> 5 transactions in 60s sliding window",
    riskWeight: "+40 Risk Score",
    target: "Prevents automated script transfers & bot attacks",
  },
  {
    ruleId: "RULE-02",
    name: "Amount Spike Anomaly",
    threshold: "> 3.0x historical rolling 30-day average",
    riskWeight: "+30 Risk Score",
    target: "Flags sudden irregular outgoing wire spikes",
  },
  {
    ruleId: "RULE-03",
    name: "Balance Depletion Drain",
    threshold: "> 90% of account balance drained in single txn",
    riskWeight: "+30 Risk Score",
    target: "Prevents total account emptying / credential compromise",
  },
  {
    ruleId: "RULE-04",
    name: "New Device / Geo Velocity",
    threshold: "Mismatched IP CIDR / sudden new device fingerprint",
    riskWeight: "+25 Risk Score",
    target: "Account takeover (ATO) detection",
  },
  {
    ruleId: "RULE-05",
    name: "Rapid Consecutive Repeats",
    threshold: "Identical amount & receiver within 10 seconds",
    riskWeight: "+50 Risk Score",
    target: "Double-spending & replay exploitation detection",
  },
];

export default function AdminFraudMonitoringPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [decisionFilter, setDecisionFilter] = useState<string>("ALL");

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["admin-fraud-alerts"],
    queryFn: () => adminService.getFraudAlerts(),
  });

  const filtered = alerts.filter((a) => {
    const matchesSearch =
      a.transactionReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDecision =
      decisionFilter === "ALL" || a.decision === decisionFilter;
    return matchesSearch && matchesDecision;
  });

  const criticalCount = alerts.filter((a) => a.riskLevel === "CRITICAL").length;
  const highCount = alerts.filter((a) => a.riskLevel === "HIGH").length;
  const otpCount = alerts.filter((a) => a.decision === "OTP_REQUIRED").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-brand-primary" />
            Real-Time Fraud Detection Engine
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Event-driven Redis sliding-window analytics & multi-tiered behavioral risk scoring.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-muted uppercase">Evaluated Alerts</p>
            <p className="text-2xl font-bold text-brand-dark">{alerts.length}</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-danger/10 flex items-center justify-center text-brand-danger">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-muted uppercase">Critical / Rejected</p>
            <p className="text-2xl font-bold text-brand-dark">{criticalCount}</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-muted uppercase">High Risk</p>
            <p className="text-2xl font-bold text-brand-dark">{highCount}</p>
          </div>
        </Card>

        <Card className="p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-muted uppercase">OTP Step-Up</p>
            <p className="text-2xl font-bold text-brand-dark">{otpCount}</p>
          </div>
        </Card>
      </div>

      {/* 5 Rules Reference Matrix */}
      <Card className="p-5 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-3">
          Active Scoring Rules (Evaluated in Kafka Stream)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {FRAUD_RULES.map((rule) => (
            <div
              key={rule.ruleId}
              className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-primary">{rule.ruleId}</span>
                <span className="text-xs font-bold text-brand-danger">{rule.riskWeight}</span>
              </div>
              <p className="text-xs font-semibold text-brand-dark">{rule.name}</p>
              <p className="text-[11px] text-brand-muted leading-tight">{rule.threshold}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Filter and Search Bar */}
      <Card className="p-4 border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search alerts by reference (TXN-...), customer or account..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-muted shrink-0" />
            <select
              value={decisionFilter}
              onChange={(e) => setDecisionFilter(e.target.value)}
              className="h-10 text-sm rounded-lg border border-slate-200 bg-white px-3 text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="ALL">All Decisions</option>
              <option value="APPROVED">Approved (Score &lt; 30)</option>
              <option value="OTP_REQUIRED">OTP Step-up (30-69)</option>
              <option value="REJECTED">Auto-Rejected (Score &ge; 70)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Live Alerts Table */}
      <Card className="border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4">Customer & Account</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Triggered Rules</th>
                <th className="py-3 px-4">Engine Decision</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-brand-dark">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-brand-muted">
                    Loading fraud alerts...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-brand-muted">
                    No fraud alerts match the filter.
                  </td>
                </tr>
              ) : (
                filtered.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-brand-primary text-xs">
                      {alert.transactionReference}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-brand-dark text-xs">{alert.customerName}</p>
                      <p className="font-mono text-brand-muted text-[11px]">{alert.accountNumber}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-dark">
                      {formatCurrency(alert.amount, alert.currency)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <RiskBadge level={alert.riskLevel} />
                        <span className="font-bold text-xs text-brand-dark font-mono">
                          {alert.riskScore}/100
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {alert.triggeredRules.map((rule, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200"
                          >
                            {rule}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {alert.decision === "APPROVED" && (
                        <Badge variant="success">Approved</Badge>
                      )}
                      {alert.decision === "OTP_REQUIRED" && (
                        <Badge variant="warning">OTP Required</Badge>
                      )}
                      {alert.decision === "REJECTED" && (
                        <Badge variant="danger">Auto-Rejected</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-brand-muted">
                      {formatDate(alert.detectionTime)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
