"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldAlert,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { transactionService } from "@/services/transaction.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { toast } from "sonner";

function OtpVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const txnRef = searchParams.get("ref") || "TXN-20261106-98102";

  const [digits, setDigits] = React.useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = React.useState(300); // 5 minutes TTL
  const [attempts, setAttempts] = React.useState(3);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  React.useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric inputs
    if (value && !/^\d+$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const splitDigits = pastedData.split("");
      setDigits(splitDigits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = digits.join("");

    if (otpCode.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the OTP code.");
      return;
    }

    if (timeLeft <= 0) {
      setErrorMessage("OTP has expired. Please request a new verification code.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await transactionService.verifyOtp(txnRef, otpCode);
      toast.success("OTP verified! Transaction approved and settled.");
      router.push("/transactions");
    } catch (err: any) {
      const remaining = attempts - 1;
      setAttempts(remaining);
      if (remaining <= 0) {
        setErrorMessage(
          "Maximum verification attempts exceeded. Transaction rejected by Fraud Engine for security."
        );
      } else {
        setErrorMessage(
          `${err.message || "Invalid OTP code."} You have ${remaining} attempts remaining.`
        );
      }
      toast.error("Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await transactionService.resendOtp(txnRef);
      setTimeLeft(300);
      setAttempts(3);
      setDigits(["", "", "", "", "", ""]);
      setErrorMessage(null);
      toast.success("New 6-digit OTP code dispatched");
      inputRefs.current[0]?.focus();
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Security Banner Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-warning-50 text-warning shadow-soft">
          <KeyRound className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Additional Verification Required
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
          Please verify your transaction to continue securely. An OTP has been sent for reference{" "}
          <strong className="text-foreground font-mono">{txnRef}</strong>.
        </p>
      </div>

      <Card className="shadow-dropdown">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <Alert variant="danger" title="Verification Error">
                {errorMessage}
              </Alert>
            )}

            {/* 6 Digit Input Boxes */}
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={attempts <= 0 || timeLeft <= 0}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="h-13 w-12 rounded-xl border border-border bg-card text-center font-mono text-xl font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-muted disabled:opacity-60 transition"
                />
              ))}
            </div>

            {/* Timer & Attempt Counters */}
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1">
              <span>
                Expires in:{" "}
                <strong
                  className={timeLeft < 60 ? "text-danger font-bold" : "text-foreground font-mono"}
                >
                  {formatTimer(timeLeft)}
                </strong>
              </span>
              <span>
                Attempts remaining:{" "}
                <strong className={attempts === 1 ? "text-danger" : "text-foreground"}>
                  {attempts}/3
                </strong>
              </span>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              disabled={attempts <= 0 || timeLeft <= 0 || digits.join("").length !== 6}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Verify &amp; Execute Transfer
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={timeLeft > 240}
                className="text-xs font-semibold text-primary hover:underline disabled:opacity-50 disabled:pointer-events-none inline-flex items-center gap-1.5"
              >
                <RotateCcw className="h-3 w-3" /> Resend Verification Code
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link
          href="/transfer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Cancel Transfer &amp; Return
        </Link>
      </div>
    </div>
  );
}

export default function OtpVerificationPage() {
  return (
    <React.Suspense fallback={<div className="text-center py-12 text-muted-foreground">Loading Verification Guard...</div>}>
      <OtpVerificationForm />
    </React.Suspense>
  );
}
