"use client";

import * as React from "react";
import { User, Mail, Phone, ShieldCheck, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [fullName, setFullName] = React.useState(user?.fullName || "Sayan Mukherjee");
  const [phoneNumber, setPhoneNumber] = React.useState(user?.phoneNumber || "+91 98765 43210");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateUser({ fullName, phoneNumber });
      setIsSaving(false);
      toast.success("Profile updated successfully!");
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          User Profile
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your personal customer profile and contact preferences
        </p>
      </div>

      <Card className="shadow-dropdown">
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-border">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white font-extrabold text-2xl shadow-soft">
                {fullName.charAt(0) || "U"}
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">{fullName}</h3>
                <p className="text-xs text-muted-foreground">{user?.email || "customer@apexbank.io"}</p>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-success">
                  <CheckCircle2 className="h-3 w-3" /> KYC Verified Customer
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Full Legal Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="h-4 w-4" />}
              />

              <Input
                label="Registered Email (Immutable)"
                value={user?.email || "customer@apexbank.io"}
                disabled={true}
                leftIcon={<Mail className="h-4 w-4" />}
                helperText="Primary email cannot be modified online for compliance reasons."
              />

              <Input
                label="Mobile Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                leftIcon={<Phone className="h-4 w-4" />}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
