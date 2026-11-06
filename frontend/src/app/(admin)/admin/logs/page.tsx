"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  Search,
  Filter,
  RefreshCw,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");

  const { data: logs = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["admin-system-logs"],
    queryFn: () => adminService.getLogs(),
  });

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.traceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService =
      serviceFilter === "ALL" || log.service === serviceFilter;
    const matchesLevel =
      levelFilter === "ALL" || log.level === levelFilter;
    return matchesSearch && matchesService && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark flex items-center gap-2">
            <Terminal className="w-6 h-6 text-brand-primary" />
            System & Kafka Activity Logs
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Real-time distributed tracing, Kafka topic event consumption, and microservices lifecycle audit.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin" : ""}`} />
          Refresh Stream
        </button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs by traceId (tr-...), event type, or keyword..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-muted shrink-0" />
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="h-10 text-sm rounded-lg border border-slate-200 bg-white px-3 text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="ALL">All Microservices</option>
              <option value="transaction-service">transaction-service</option>
              <option value="account-service">account-service</option>
              <option value="fraud-detection-service">fraud-detection-service</option>
              <option value="payment-service">payment-service</option>
              <option value="notification-service">notification-service</option>
              <option value="api-gateway">api-gateway</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-muted shrink-0" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="h-10 text-sm rounded-lg border border-slate-200 bg-white px-3 text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="ALL">All Levels</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Terminal View */}
      <div className="rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1E293B] border-b border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 font-bold text-[11px] text-slate-300">
              apex-banking-cluster :: kafka-consumer-stream
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {filtered.length} log events captured
          </span>
        </div>

        {/* Logs Stream */}
        <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto divide-y divide-slate-800/60">
          {isLoading ? (
            <p className="text-slate-500 py-4 text-center">Connecting to logs broker...</p>
          ) : filtered.length === 0 ? (
            <p className="text-slate-500 py-4 text-center">No logs match the query filters.</p>
          ) : (
            filtered.map((log) => (
              <div key={log.id} className="pt-3 first:pt-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="text-slate-500">{formatDate(log.timestamp)}</span>
                  
                  {log.level === "INFO" && (
                    <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 font-bold">
                      INFO
                    </span>
                  )}
                  {log.level === "WARN" && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">
                      WARN
                    </span>
                  )}
                  {log.level === "ERROR" && (
                    <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-bold">
                      ERROR
                    </span>
                  )}

                  <span className="px-2 py-0.2 rounded bg-slate-800 text-brand-secondary font-semibold">
                    {log.service}
                  </span>

                  <span className="text-slate-400">trace_id=</span>
                  <span className="text-emerald-400 font-semibold">{log.traceId}</span>
                </div>

                <p className="text-slate-200 leading-relaxed pl-1">{log.message}</p>

                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <pre className="mt-1 p-2 rounded bg-[#090D16] text-[11px] text-slate-400 overflow-x-auto border border-slate-800/80">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
