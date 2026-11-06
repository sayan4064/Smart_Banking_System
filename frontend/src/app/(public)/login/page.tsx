"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isExpired = searchParams.get("expired") === "true";
  const loginToStore = useAuthStore((state) => state.login);

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const authData = await authService.login(data);
      loginToStore(authData);
      toast.success(authData.message || "Welcome back to Apex Digital Bank");

      // Role-Based Redirection
      if (authData.user.role === "ROLE_ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid credentials. Please verify your email and password.");
      toast.error("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for demo/testing
  const fillDemoAccount = (role: "CUSTOMER" | "ADMIN") => {
    if (role === "CUSTOMER") {
      setValue("email", "customer@apexbank.io");
      setValue("password", "SecurePass123");
    } else {
      setValue("email", "admin@apexbank.io");
      setValue("password", "AdminRoot9988");
    }
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-soft transition group-hover:scale-105">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground">
            APEX<span className="text-primary font-normal">BANK</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Sign In to Your Banking Portal
        </h2>
        <p className="text-xs text-muted-foreground">
          Access secure accounts, money transfers, and real-time monitoring
        </p>
      </div>

      {/* Expired Session Notice */}
      {isExpired && (
        <Alert variant="warning" title="Session Expired">
          Your banking session has timed out for security. Please re-authenticate.
        </Alert>
      )}

      {/* Main Card */}
      <Card className="shadow-dropdown">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && (
              <Alert variant="danger" title="Authentication Error">
                {errorMessage}
              </Alert>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="you@domain.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="space-y-1">
              <Input
                label="Password"
                placeholder="••••••••••••"
                isPassword={true}
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register("password")}
              />
              <div className="flex justify-end pt-1">
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="md"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center mb-3">
              Quick Test Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoAccount("CUSTOMER")}
                leftIcon={<UserCheck className="h-3.5 w-3.5 text-primary" />}
              >
                Customer Demo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoAccount("ADMIN")}
                leftIcon={<ShieldAlert className="h-3.5 w-3.5 text-secondary" />}
              >
                Admin Demo
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="ml-1 font-bold text-primary hover:underline"
          >
            Create Account
          </Link>
        </CardFooter>
      </Card>

      {/* Security Footer Note */}
      <div className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
        <Lock className="h-3 w-3 text-success" />
        <span>Protected by AES-256 encryption and Spring Security JWT</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-subtle-glow px-4 py-12 sm:px-6">
      <React.Suspense fallback={<div className="text-sm font-semibold text-muted-foreground">Loading Banking Portal...</div>}>
        <LoginForm />
      </React.Suspense>
    </div>
  );
}
