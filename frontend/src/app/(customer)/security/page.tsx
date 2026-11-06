"use client";

import * as React from "react";
import { Shield, Lock, Smartphone, Laptop, KeyRound, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Security credentials updated successfully!");
    }, 700);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Security &amp; Credentials
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your account protection, cryptographic keys, and active sessions
        </p>
      </div>

      {/* Password Change Card */}
      <Card className="shadow-dropdown">
        <CardHeader>
          <CardTitle>Change Passphrase</CardTitle>
          <CardDescription>
            Update your master sign-in password regularly to prevent unauthorized access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <Input
              label="Current Password"
              placeholder="••••••••••••"
              isPassword={true}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
            />

            <Input
              label="New Password"
              placeholder="••••••••••••"
              isPassword={true}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
            />

            <Input
              label="Confirm New Password"
              placeholder="••••••••••••"
              isPassword={true}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
            />

            <div className="pt-2">
              <Button type="submit" isLoading={isUpdating}>
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Active Sessions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Active Login Sessions</CardTitle>
          <CardDescription>Currently authorized client devices holding valid JWT access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Laptop className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Current Chrome Browser (Windows 11)</p>
                <p className="text-[10px] text-muted-foreground">IP: 127.0.0.1 (Localhost Session)</p>
              </div>
            </div>
            <Badge variant="success" dot={true}>
              Active Now
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
