import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-subtle-glow">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-danger/10 text-danger mb-6">
        <ShieldAlert className="h-8 w-8" />
      </div>

      <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-6xl mb-2">
        404
      </h1>
      <h2 className="text-xl font-bold text-foreground mb-3">
        Page Not Found
      </h2>
      <p className="max-w-md text-sm text-muted-foreground mb-8 leading-relaxed">
        The financial portal page you requested could not be located or may have been relocated for security reasons.
      </p>

      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="outline" leftIcon={<Home className="h-4 w-4" />}>
            Home Page
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Customer Portal
          </Button>
        </Link>
      </div>
    </div>
  );
}

