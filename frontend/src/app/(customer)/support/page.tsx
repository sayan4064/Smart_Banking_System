import Link from "next/link";
import { LifeBuoy, Mail, Phone, MessageSquare, ShieldCheck, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Help &amp; Customer Support
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          24/7 dedicated support for wire transfers, fraud inquiries, and security challenges
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="hover:shadow-soft transition">
          <CardContent className="pt-6 space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Direct Hotline</h3>
            <p className="text-xs text-muted-foreground">+91 1800 200 4991</p>
            <p className="text-[10px] text-muted-foreground">Toll-free 24/7 Priority</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-soft transition">
          <CardContent className="pt-6 space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-success-50 text-success">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Email Inquiries</h3>
            <p className="text-xs text-muted-foreground">support@apexbank.io</p>
            <p className="text-[10px] text-muted-foreground">&lt; 15 min response time</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-soft transition">
          <CardContent className="pt-6 space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-50 text-secondary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Fraud Escalation</h3>
            <p className="text-xs text-muted-foreground">fraud-desk@apexbank.io</p>
            <p className="text-[10px] text-muted-foreground">Immediate account lock</p>
          </CardContent>
        </Card>
      </div>

      {/* Frequently Asked Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Common questions regarding Saga transfers and OTPs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-border p-4 space-y-1">
            <h4 className="text-xs font-bold text-foreground">Why was my transfer flagged for OTP verification?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our real-time fraud engine triggers automated verification if a transfer exceeds normal velocity patterns, moves more than 90% of available balance, or exceeds ₹50,000.
            </p>
          </div>

          <div className="rounded-xl border border-border p-4 space-y-1">
            <h4 className="text-xs font-bold text-foreground">What happens if the recipient bank account is invalid or closed?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our distributed Saga pattern automatically emits a compensating transaction to credit back your account balance immediately with status REFUNDED.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
