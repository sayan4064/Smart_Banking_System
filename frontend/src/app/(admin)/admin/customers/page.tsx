"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  CreditCard,
  Mail,
  Phone,
} from "lucide-react";

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: () => adminService.getCustomers(),
  });

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phoneNumber.includes(searchTerm);
    const matchesStatus =
      statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalActive = customers.filter((c) => c.status === "ACTIVE").length;
  const totalBlocked = customers.filter((c) => c.status === "BLOCKED").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark">
            Customer Directory
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Search, inspect, and manage verified digital banking retail & corporate customers.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4 border border-slate-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Total Customers
            </p>
            <p className="text-2xl font-bold text-brand-dark mt-0.5">
              {isLoading ? "..." : customers.length}
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 border border-slate-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-brand-success/10 flex items-center justify-center text-brand-success">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Active & Verified
            </p>
            <p className="text-2xl font-bold text-brand-dark mt-0.5">
              {isLoading ? "..." : totalActive}
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 border border-slate-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-brand-danger/10 flex items-center justify-center text-brand-danger">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Blocked / Suspended
            </p>
            <p className="text-2xl font-bold text-brand-dark mt-0.5">
              {isLoading ? "..." : totalBlocked}
            </p>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by full name, email address, or mobile number..."
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
              <option value="ACTIVE">Active Only</option>
              <option value="BLOCKED">Blocked Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Accounts</th>
                <th className="py-3 px-4">Cumulative Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-brand-dark">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-brand-muted">
                    Loading customer database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-brand-muted">
                    No customers match your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center text-xs">
                          {cust.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-dark leading-snug">
                            {cust.fullName}
                          </p>
                          <p className="text-xs text-brand-muted">ID: #{cust.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-brand-muted" />
                        <span>{cust.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                        <Phone className="w-3.5 h-3.5 text-brand-muted" />
                        <span>{cust.phoneNumber}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                        <CreditCard className="w-3.5 h-3.5 text-brand-muted" />
                        {cust.accountsCount} {cust.accountsCount === 1 ? "Account" : "Accounts"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-brand-dark">
                      {formatCurrency(cust.totalBalance, "INR")}
                    </td>
                    <td className="py-3.5 px-4">
                      {cust.status === "ACTIVE" ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="danger">Blocked</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-brand-muted">
                      {formatDate(cust.registeredAt)}
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
