"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { registerSchema, type RegisterFormData } from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

export default function RegisterPage() {
  const router = useRouter();
  const loginToStore = useAuthStore((state) => state.login);

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      role: "ROLE_CUSTOMER",
    },
  });

  const passwordValue = watch("password") || "";
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const authData = await authService.register(data);
      loginToStore(authData);
      toast.success("Account created successfully! Welcome to Apex Bank.");

      if (authData.user.role === "ROLE_ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "Could not register account. Email may already be in use."
      );
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-subtle-glow px-4 py-12 sm:px-6">
      <div className="w-full max-w-lg space-y-6">
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
            Create Your Digital Bank Account
          </h2>
          <p className="text-xs text-muted-foreground">
            Instant account provisioning with real-time fraud mitigation
          </p>
        </div>

        <Card className="shadow-dropdown">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errorMessage && (
                <Alert variant="danger" title="Registration Failed">
                  {errorMessage}
                </Alert>
              )}

              <Input
                label="Full Legal Name"
                placeholder="e.g. Sayan Mukherjee"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.fullName?.message}
                {...register("fullName")}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@email.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Input
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                  leftIcon={<Phone className="h-4 w-4" />}
                  error={errors.phoneNumber?.message}
                  {...register("phoneNumber")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Create Password"
                  placeholder="••••••••••••"
                  isPassword={true}
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={errors.password?.message}
                  {...register("password")}
                />

                <Input
                  label="Confirm Password"
                  placeholder="••••••••••••"
                  isPassword={true}
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />
              </div>

              {/* Password Strength Checklist */}
              <div className="rounded-xl bg-muted/60 p-3 space-y-1.5 border border-border/40">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Security Requirements
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

              <Select
                label="Account Role Profile"
                options={[
                  { value: "ROLE_CUSTOMER", label: "Customer Account (Retail Banking)" },
                  { value: "ROLE_ADMIN", label: "Admin Account (Operations & Monitoring)" },
                ]}
                {...register("role")}
              />

              <Button
                type="submit"
                className="w-full"
                size="md"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Complete Registration
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center text-xs text-muted-foreground">
            Already registered?{" "}
            <Link
              href="/login"
              className="ml-1 font-bold text-primary hover:underline"
            >
              Sign In Instead
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

