import Link from "next/link";
import { ShieldCheck, Lock, ExternalLink } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-soft">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                APEX<span className="text-primary font-normal">BANK</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enterprise digital banking backend powered by Spring Boot, Apache Kafka, Redis, and MySQL with real-time fraud mitigation and Saga distributed transaction orchestration.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-success">
              <Lock className="h-3.5 w-3.5" /> 256-bit AES &amp; JWT Verified
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Core Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm text-foreground">
              <li>
                <Link href="#transfers" className="text-muted-foreground hover:text-foreground">
                  Choreographed Saga Transfers
                </Link>
              </li>
              <li>
                <Link href="#fraud-engine" className="text-muted-foreground hover:text-foreground">
                  Redis Velocity &amp; Risk Scoring
                </Link>
              </li>
              <li>
                <Link href="#transfers" className="text-muted-foreground hover:text-foreground">
                  OTP Challenge &amp; Verification
                </Link>
              </li>
              <li>
                <Link href="/payments" className="text-muted-foreground hover:text-foreground">
                  Razorpay Checkout Integration
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Microservices Backbone
            </h4>
            <ul className="space-y-2.5 text-sm text-foreground">
              <li className="text-muted-foreground">Spring Cloud Gateway (:8080)</li>
              <li className="text-muted-foreground">Account Service (:8081)</li>
              <li className="text-muted-foreground">Transaction Service (:8082)</li>
              <li className="text-muted-foreground">Fraud Detection Service (:8083)</li>
              <li className="text-muted-foreground">Payment Service (:8084)</li>
              <li className="text-muted-foreground">Notification Service (:8085)</li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Banking Portals
            </h4>
            <div className="space-y-3">
              <Link
                href="/login"
                className="flex items-center justify-between rounded-xl border border-border bg-background p-3 text-sm font-semibold transition hover:border-primary"
              >
                <span>Customer Banking</span>
                <ExternalLink className="h-4 w-4 text-primary" />
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-between rounded-xl border border-border bg-background p-3 text-sm font-semibold transition hover:border-secondary"
              >
                <span>Admin Operations</span>
                <ExternalLink className="h-4 w-4 text-secondary" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-8 sm:flex-row text-xs text-muted-foreground">
          <p>© 2026 Apex Digital Banking System. Production-Oriented Microservices Architecture.</p>
          <div className="flex gap-6">
            <span>Kafka KRaft Event Bus</span>
            <span>Optimistic Locking (@Version)</span>
            <span>Redis Rate Limiter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

