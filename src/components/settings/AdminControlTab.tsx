"use client";

import React, { useState, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  Settings01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  notifyFeatureFlagsUpdated,
  type FeatureFlagItem,
} from "@/lib/features/use-feature-flags";
import type { UserProfile } from "@/lib/auth/session";

interface AdminControlTabProps {
  currentUserId: string;
  locale: string;
}

export function AdminControlTab({ currentUserId, locale }: AdminControlTabProps) {
  const isBn = locale === "bn";
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [features, setFeatures] = useState<FeatureFlagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, fRes] = await Promise.all([
        fetch("/api/v1/admin/users", { cache: "no-store" }),
        fetch("/api/v1/features", { cache: "no-store" }),
      ]);
      if (uRes.ok) {
        const uData = await uRes.json();
        setUsers(uData.users ?? []);
      }
      if (fRes.ok) {
        const fData = await fRes.json();
        setFeatures(fData.items ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadAdminData();
    });
  }, [loadAdminData]);

  const handleUpdateUser = async (
    userId: string,
    patch: { role?: "user" | "admin"; is_active?: boolean }
  ) => {
    setBusyId(userId);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/v1/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...patch }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg(data.error || "Update failed");
        return;
      }
      setUsers((prev) => prev.map((u) => (u.id === userId ? data.user : u)));
      setStatusMsg(isBn ? "ইউজার আপডেট হয়েছে।" : "User updated.");
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleFeature = async (key: string, enabled: boolean) => {
    setBusyId(key);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/v1/features", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, enabled }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg(data.error || "Feature update failed");
        return;
      }
      setFeatures((prev) => prev.map((f) => (f.key === key ? data.item : f)));
      notifyFeatureFlagsUpdated();
      setStatusMsg(isBn ? "ফিচার স্ট্যাটাস আপডেট হয়েছে।" : "Feature flag updated.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {statusMsg ? (
          <Badge variant="success" size="sm">
            {statusMsg}
          </Badge>
        ) : (
          <span className="text-chip text-muted-foreground">
            {isBn
              ? "অ্যাডমিন প্যানেল থেকে সব ইউজার এবং অ্যাপ ফিচার নিয়ন্ত্রণ করুন।"
              : "Manage all users and app feature toggles from Supabase."}
          </span>
        )}
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={loadAdminData}
          disabled={loading}
          className="gap-1.5"
        >
          <HugeiconsIcon
            icon={RefreshIcon}
            size={14}
            className={loading ? "animate-spin" : ""}
          />
          <span>{isBn ? "রিফ্রেশ" : "Refresh"}</span>
        </Button>
      </div>

      {/* 1. Feature Controls */}
      <Card className="p-5 sm:p-6 bg-card border border-border rounded-card space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
          <div className="size-9 rounded-control bg-primary/10 text-primary flex items-center justify-center">
            <HugeiconsIcon icon={Settings01Icon} size={18} />
          </div>
          <div>
            <h2 className="font-heading text-card-title text-foreground">
              {isBn ? "অ্যাপ ফিচার কন্ট্রোল" : "Feature Controls"}
            </h2>
            <p className="text-meta text-muted-foreground">
              {isBn
                ? "যেকোনো ফিচার বন্ধ করলে মেনু থেকে তাৎক্ষণিকভাবে হাইড হবে।"
                : "Toggle core app modules on or off across the navigation."}
            </p>
          </div>
        </div>

        <div className="divide-y divide-border/60">
          {features.map((feat) => (
            <div
              key={feat.key}
              className="py-3.5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-label font-semibold text-foreground">
                    {isBn ? feat.label_bn : feat.label}
                  </p>
                  <Badge variant={feat.enabled ? "success" : "neutral"} size="sm">
                    {feat.enabled ? "ON" : "OFF"}
                  </Badge>
                </div>
                <p className="text-chip text-muted-foreground mt-0.5">
                  {feat.description}
                </p>
              </div>
              <Switch
                checked={feat.enabled}
                disabled={busyId === feat.key}
                onCheckedChange={(checked) => handleToggleFeature(feat.key, checked)}
                aria-label={`Toggle ${feat.label}`}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* 2. User Management */}
      <Card className="p-5 sm:p-6 bg-card border border-border rounded-card space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
          <div className="size-9 rounded-control bg-primary/10 text-primary flex items-center justify-center">
            <HugeiconsIcon icon={UserGroupIcon} size={18} />
          </div>
          <div>
            <h2 className="font-heading text-card-title text-foreground">
              {isBn ? "ইউজার ম্যানেজমেন্ট" : "User Management"}
            </h2>
            <p className="text-meta text-muted-foreground">
              {isBn
                ? "ইউজারের রোল (User / Admin) এবং অ্যাকাউন্ট স্ট্যাটাস পরিবর্তন করুন।"
                : "Control user roles (User / Admin) and active status."}
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {users.map((u) => {
            const isSelf = u.id === currentUserId;
            return (
              <div
                key={u.id}
                className="rounded-panel border border-border bg-muted/25 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-label font-semibold text-foreground truncate">
                      {u.full_name || u.email}
                    </p>
                    <Badge variant={u.role === "admin" ? "brand" : "outline"} size="sm">
                      {u.role.toUpperCase()}
                    </Badge>
                    <Badge variant={u.is_active ? "success" : "error"} size="sm">
                      {u.is_active ? "Active" : "Disabled"}
                    </Badge>
                    {isSelf && (
                      <Badge variant="neutral" size="sm">
                        You
                      </Badge>
                    )}
                  </div>
                  <p className="text-chip text-muted-foreground font-mono truncate">
                    {u.email}
                  </p>
                </div>

                {!isSelf && (
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      size="xs"
                      variant="outline"
                      disabled={busyId === u.id}
                      onClick={() =>
                        handleUpdateUser(u.id, {
                          role: u.role === "admin" ? "user" : "admin",
                        })
                      }
                    >
                      {u.role === "admin"
                        ? isBn
                          ? "User করুন"
                          : "Make User"
                        : isBn
                          ? "Admin করুন"
                          : "Make Admin"}
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      variant={u.is_active ? "destructive" : "default"}
                      disabled={busyId === u.id}
                      onClick={() =>
                        handleUpdateUser(u.id, { is_active: !u.is_active })
                      }
                    >
                      {u.is_active
                        ? isBn
                          ? "বন্ধ করুন"
                          : "Disable"
                        : isBn
                          ? "চালু করুন"
                          : "Enable"}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
