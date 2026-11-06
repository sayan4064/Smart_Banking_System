"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setIsSubmitted(true);
      toast.success("Password recovery instructions dispatched");
    } catch (err: any) {
      toast.error(err.message || "Failed to process recovery request");
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
            Recover Banking Account
          </h2>
          <p className="text-xs text-muted-foreground">
            Enter your registered email address to receive password reset instructions
          </p>
        </div>

        <Card className="shadow-dropdown">
          <CardContent className="pt-6">
            {isSubmitted ? (
              <div className="space-y-4 text-center py-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 text-success">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-foreground">Instructions Sent</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If an account exists for <strong className="text-foreground">{getValues("email")}</strong>, we have dispatched an encrypted password recovery link.
                </p>
                <Link href="/reset-password">
                  <Button variant="outline" className="w-full mt-2">
                    Enter Reset Token Manually
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Registered Email"
                  type="email"
                  placeholder="name@email.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                  rightIcon={<Send className="h-4 w-4" />}
                >
                  Send Recovery Link
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="justify-center text-xs text-muted-foreground">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

