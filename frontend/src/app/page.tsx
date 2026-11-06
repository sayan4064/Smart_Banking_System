import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Lock,
  RotateCcw,
  KeyRound,
  CheckCircle2,
  Server,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { LandingNavbar } from "@/components/layout/landing-navbar";
import { LandingFooter } from "@/components/layout/landing-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AccountBalanceCard } from "@/components/accounts/account-balance-card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <LandingNavbar />

      <main className="flex-1">
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-subtle-glow">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headlines & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Real-Time Fraud Protected Banking</span>
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  <span>Saga Choreography</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                  Banking Made Smarter. <br />
                  <span className="text-primary">Money Moves Faster.</span>
                </h1>

                <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Experience secure digital banking with intelligent fraud protection, seamless transfers, and real-time transaction monitoring.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link href="/register">
                    <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg">
                      Sign In to Portal
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Zero Lost Updates</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Auto Saga Compensation</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Sub-50ms Risk Scoring</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Fintech Card Preview */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md">
                  <AccountBalanceCard
                    accountNumber="ACC-84910248"
                    accountHolderName="Alex Morgan"
                    accountType="SAVINGS"
                    balance={284750.0}
                    currency="INR"
                    accountStatus="ACTIVE"
                  />

                  {/* Floating Micro-Card: Live Fraud Engine Alert */}
                  <div className="absolute -bottom-6 -left-4 sm:-left-8 rounded-2xl border border-border bg-card p-4 shadow-dropdown max-w-[270px] animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-success-50 text-success">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Rule Engine: Passed</p>
                        <p className="text-[10px] text-muted-foreground">Velocity: 1 txn/60s (Safe)</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Micro-Card: Saga Status */}
                  <div className="absolute -top-4 -right-4 sm:-right-6 rounded-2xl border border-border bg-card p-3 shadow-dropdown animate-in fade-in slide-in-from-top-4">
                    <Badge variant="subtle" className="text-[11px] gap-1.5">
                      <Zap className="h-3 w-3 text-primary" /> Kafka Outbox Synced
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= METRICS COUNTERS ================= */}
        <section id="stats" className="border-y border-border bg-card py-12">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-foreground">99.99%</p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Consistency SLA
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-primary">&lt; 45ms</p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Fraud Evaluation Latency
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-secondary">100%</p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Saga Compensation Coverage
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-success">6 Services</p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Distributed Microservices
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CORE FEATURES HIGHLIGHT ================= */}
        <section id="features" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <Badge variant="subtle">Core Banking Engine</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Engineered for High-Consequence Financial Operations
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Clean architecture, strict data isolation, and distributed event coordination without single points of failure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="rounded-3xl border border-border bg-card p-8 shadow-card hover:shadow-soft transition-all duration-200 hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Choreographed Saga Engine</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Transfers execute across isolated databases via Apache Kafka without distributed two-phase locking. Receiver failure automatically triggers compensating sender refunds.
                </p>
                <div className="text-xs font-semibold text-primary inline-flex items-center gap-1">
                  Transactional Outbox Pattern <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="rounded-3xl border border-border bg-card p-8 shadow-card hover:shadow-soft transition-all duration-200 hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success-50 text-success mb-6">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Real-Time Fraud Rules</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Multi-layered rule engine running against Redis sliding windows evaluates velocity, transaction spikes, balance thresholds, and rapid duplicate patterns in real time.
                </p>
                <div className="text-xs font-semibold text-success inline-flex items-center gap-1">
                  Dynamic Risk Scoring (0–100) <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Feature 3 */}
              <div className="rounded-3xl border border-border bg-card p-8 shadow-card hover:shadow-soft transition-all duration-200 hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-50 text-secondary mb-6">
                  <KeyRound className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Automated OTP Verification</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Medium-risk transfers automatically generate single-use 6-digit cryptographic OTPs stored in Redis with a 5-minute TTL, rate-limiting invalid attempts to prevent brute-force attacks.
                </p>
                <div className="text-xs font-semibold text-secondary inline-flex items-center gap-1">
                  SHA-256 Masked Storage <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SAGA MONEY TRANSFER SECTION ================= */}
        <section id="transfers" className="py-20 bg-muted/40 border-y border-border">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-4">
                <Badge variant="subtle">Distributed Architecture</Badge>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  How Saga Guarantees Transaction Consistency
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Unlike traditional monoliths with shared tables, each microservice controls its own database. The Saga Pattern coordinates multi-step transfers asynchronously.
                </p>

                <div className="space-y-3 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                      1
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground">Debit Sender:</strong> Account Service debits sender with JPA <code className="text-primary font-mono font-semibold">@Version</code> optimistic lock.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                      2
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground">Kafka Event Bus:</strong> Outbox publishes <code className="text-primary font-mono">transaction.initiated</code> to Kafka.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                      3
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground">Fraud Evaluation:</strong> Rule engine tests 5 criteria. If clean, emits <code className="text-success font-mono">fraud.check.passed</code>.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                      4
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground">Credit Receiver:</strong> Receiver account is credited. If receiver is blocked, a compensation rollback refunds the sender.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Transfer Diagram Visual */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-border bg-card p-7 shadow-dropdown space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Live Transaction State Machine
                    </span>
                    <Badge variant="success">Event-Driven</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border/80">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          TXN
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">TXN-20261106-9810</p>
                          <p className="text-[10px] text-muted-foreground">Transfer to ACC-44021948</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-foreground">₹ 15,000.00</p>
                        <Badge variant="success" className="text-[10px]">
                          COMPLETED
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border/80">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center text-warning font-bold text-xs">
                          OTP
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">TXN-20261106-9811</p>
                          <p className="text-[10px] text-muted-foreground">High Balance Ratio (&gt;90%)</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-foreground">₹ 95,000.00</p>
                        <Badge variant="warning" className="text-[10px]">
                          OTP_REQUIRED
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border/80">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs">
                          SAGA
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">TXN-20261106-9812</p>
                          <p className="text-[10px] text-muted-foreground">Receiver Account Closed &rarr; Refunded</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-foreground">₹ 2,400.00</p>
                        <Badge variant="secondary" className="text-[10px]">
                          REFUNDED
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FRAUD DETECTION SECTION ================= */}
        <section id="fraud-engine" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <Badge variant="danger">Intelligent Threat Mitigation</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                5-Rule Real-Time Fraud Engine
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Configurable thresholds in <code className="text-primary font-mono text-xs">application.yml</code> evaluate every transaction before financial settlement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">Rule 1: Velocity Check</h4>
                  <Badge variant="warning">35 pts</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Flags any account exceeding 5 transactions within a 60-second sliding window via Redis atomic counters with TTL.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">Rule 2: Spike Amount</h4>
                  <Badge variant="warning">30 pts</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Calculates customer historical average and challenges transfers exceeding 3.0x normal spending patterns.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">Rule 3: Balance Percentage</h4>
                  <Badge variant="warning">25 pts</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Identifies aggressive account drain attempts when an individual transfer sweeps over 90% of available funds.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">Rule 4: Account Status</h4>
                  <Badge variant="danger">Reject</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Immediately aborts transactions involving frozen, suspended, or blocked sender/receiver accounts.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">Rule 5: Rapid Repeats</h4>
                  <Badge variant="danger">40 pts</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Detects automated duplicate transfers to the exact same recipient within a 10-second interval.
                </p>
              </div>

              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-card space-y-2 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-primary">Scoring Decisions</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Score &lt; 40: Approved | 40-75: OTP Required | &gt; 75: Rejected.
                  </p>
                </div>
                <Link href="/register">
                  <Button size="sm" className="w-full">
                    Test Live Simulator
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS / ENTERPRISE TRUST ================= */}
        <section className="py-20 bg-card border-t border-border">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 text-center space-y-12">
            <div className="space-y-2">
              <Badge variant="subtle">Enterprise Trust</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Built for High Reliability &amp; Compliance
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="rounded-2xl border border-border bg-background p-6 space-y-3">
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  &ldquo;The choreography Saga implementation guarantees that our financial balances remain mathematically sound even under sudden network partition failures.&rdquo;
                </p>
                <div>
                  <p className="text-xs font-bold text-foreground">Fintech Lead Architect</p>
                  <p className="text-[10px] text-muted-foreground">Digital Banking Operations</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-6 space-y-3">
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  &ldquo;Redis sliding-window velocity checks eliminated 94% of rapid automated credential stuffing transfers before transaction settlement.&rdquo;
                </p>
                <div>
                  <p className="text-xs font-bold text-foreground">Head of Risk &amp; Compliance</p>
                  <p className="text-[10px] text-muted-foreground">Fraud Detection Unit</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-6 space-y-3">
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  &ldquo;Full audit observability through Kafka event tracing allows our compliance auditors to verify every ledger state transition within seconds.&rdquo;
                </p>
                <div>
                  <p className="text-xs font-bold text-foreground">Senior Audit Director</p>
                  <p className="text-[10px] text-muted-foreground">Regulatory Affairs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA BANNER ================= */}
        <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="mx-auto max-w-5xl px-6 sm:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Experience Next-Generation Digital Banking?
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto">
              Create an account in 30 seconds or log in as an administrator to explore real-time fraud monitoring and live Saga transfers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/register">
                <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-slate-100 border-transparent">
                  Create Customer Account
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                  Open Operations Portal
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
