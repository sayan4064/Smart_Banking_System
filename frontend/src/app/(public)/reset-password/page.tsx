"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { resetPasswordSchema, type ResetPasswordFormData } from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const passwordValue = watch("password") || "";
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const res = await authService.resetPassword(data.password);
      toast.success(res.message || "Password updated successfully");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-subtle-glow px-4 py-12 sm:px-6">
      <div className="w-full max-w-md space-y-6">
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
            Set New Password
          </h2>
          <p className="text-xs text-muted-foreground">
            Ensure your account uses a strong, complex passphrase
          </p>
        </div>

        <Card className="shadow-dropdown">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="New Password"
                placeholder="••••••••••••"
                isPassword={true}
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register("password")}
              />

              <Input
                label="Confirm New Password"
                placeholder="••••••••••••"
                isPassword={true}
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <div className="rounded-xl bg-muted/60 p-3 space-y-1.5 border border-border/40">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Security Checklist
                </p>
                <div className="grid grid-cols-3 gap-1 text-[11px]">
                  <span
                    className={`flex items-center gap-1 ${
                      hasMinLength ? "text-success font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" /> 8+ chars
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      hasUppercase ? "text-success font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" /> Uppercase
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      hasNumber ? "text-success font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" /> Number
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Update Password
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center text-xs text-muted-foreground">
            Remembered your credentials?{" "}
            <Link
              href="/login"
              className="ml-1 font-bold text-primary hover:underline"
            >
              Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

