"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-soft transition group-hover:scale-105">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              APEX<span className="text-primary font-normal">BANK</span>
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground -mt-1">
              Digital Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
          <Link href="#features" className="transition hover:text-foreground">
            Features
          </Link>
          <Link href="#transfers" className="transition hover:text-foreground">
            Money Transfers
          </Link>
          <Link href="#fraud-engine" className="transition hover:text-foreground">
            Fraud Protection
          </Link>
          <Link href="#security" className="transition hover:text-foreground">
            Security Architecture
          </Link>
          <Link href="#stats" className="transition hover:text-foreground">
            Metrics
          </Link>
        </nav>

        {/* Auth CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-card px-6 py-5 sm:hidden animate-in slide-in-from-top-4">
          <div className="flex flex-col gap-4 text-sm font-semibold text-foreground">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-muted-foreground hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#transfers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-muted-foreground hover:text-foreground"
            >
              Money Transfers
            </Link>
            <Link
              href="#fraud-engine"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-muted-foreground hover:text-foreground"
            >
              Fraud Protection
            </Link>
            <Link
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-muted-foreground hover:text-foreground"
            >
              Security Architecture
            </Link>
            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-border">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

