"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Login01Icon, SparklesIcon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n";

function LoginForm() {
  const locale = useLocale();
  const isBn = locale === "bn";
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";

  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) {
          setErrorMsg(error.message);
          return;
        }

        // Check if account is active
        const meRes = await fetch("/api/v1/auth/me", { cache: "no-store" });
        const meData = await meRes.json();
        if (meData?.user && meData.user.is_active === false) {
          await supabase.auth.signOut();
          setErrorMsg(
            isBn
              ? "আপনার অ্যাকাউন্টটি অ্যাডমিন দ্বারা সাময়িকভাবে বন্ধ করা হয়েছে।"
              : "Your account has been disabled by an administrator."
          );
          return;
        }

        router.push(nextPath);
        router.refresh();
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/login`,
        });
        if (error) {
          setErrorMsg(error.message);
          return;
        }
        setInfoMsg(
          isBn
            ? "পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।"
            : "Password reset link sent to your email."
        );
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() || email.split("@")[0] },
          },
        });
        if (error) {
          setErrorMsg(error.message);
          return;
        }
        if (data.session) {
          router.push(nextPath);
          router.refresh();
        } else {
          setInfoMsg(
            isBn
              ? "অ্যাকাউন্ট তৈরি হয়েছে! ইমেইল কনফার্ম করে লগইন করুন।"
              : "Account created! Please check your email to confirm, then sign in."
          );
          setMode("login");
        }
      }
    } catch {
      setErrorMsg("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-meta text-muted-foreground hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            <span>{isBn ? "ড্যাশবোর্ডে ফিরুন" : "Back to Dashboard"}</span>
          </Link>
          <Badge variant="brand" size="sm">
            Supabase Auth
          </Badge>
        </div>

        <Card className="p-6 sm:p-7 bg-card border border-border rounded-card shadow-xs space-y-5">
          <div className="space-y-1.5">
            <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center">
              <HugeiconsIcon icon={SparklesIcon} size={20} />
            </div>
            <h1 className="font-heading text-page-title text-foreground">
              {mode === "login"
                ? isBn
                  ? "লগইন করুন"
                  : "Sign In"
                : isBn
                  ? "নতুন অ্যাকাউন্ট খুলুন"
                  : "Create Account"}
            </h1>
            <p className="text-meta text-muted-foreground">
              {isBn
                ? "User ও Admin একই লগইন থেকে প্রবেশ করতে পারবেন।"
                : "Both learners and admins sign in from this same portal."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 rounded-control bg-muted/50">
            <Button
              type="button"
              size="sm"
              variant={mode === "login" ? "default" : "ghost"}
              onClick={() => {
                setMode("login");
                setErrorMsg(null);
              }}
            >
              {isBn ? "লগইন" : "Sign In"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "signup" ? "default" : "ghost"}
              onClick={() => {
                setMode("signup");
                setErrorMsg(null);
              }}
            >
              {isBn ? "সাইন আপ" : "Sign Up"}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-chip font-semibold text-foreground">
                  {isBn ? "আপনার নাম" : "Full Name"}
                </label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isBn ? "যেমন: মো. মনসুর" : "e.g. Md Mansur"}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-chip font-semibold text-foreground">
                {isBn ? "ইমেইল" : "Email Address"}
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            {mode !== "reset" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-chip font-semibold text-foreground">
                    {isBn ? "পাসওয়ার্ড" : "Password"}
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("reset");
                        setErrorMsg(null);
                        setInfoMsg(null);
                      }}
                      className="text-chip text-primary hover:underline cursor-pointer"
                    >
                      {isBn ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}
                    </button>
                  )}
                </div>
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            )}

            {errorMsg && (
              <p className="text-meta text-destructive bg-destructive/10 rounded-control px-3 py-2">
                {errorMsg}
              </p>
            )}
            {infoMsg && (
              <p className="text-meta text-status-success-ink bg-status-success-bg rounded-control px-3 py-2">
                {infoMsg}
              </p>
            )}

            <Button
              type="submit"
              variant="cta"
              size="md"
              disabled={loading}
              className="w-full gap-2"
            >
              <HugeiconsIcon icon={Login01Icon} size={16} />
              <span>
                {loading
                  ? isBn
                    ? "অপেক্ষা করুন..."
                    : "Please wait..."
                  : mode === "login"
                    ? isBn
                      ? "লগইন করুন"
                      : "Sign In"
                    : mode === "reset"
                      ? isBn
                        ? "রিসেট লিংক পাঠান"
                        : "Send Reset Link"
                      : isBn
                        ? "অ্যাকাউন্ট তৈরি করুন"
                        : "Create Account"}
              </span>
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
