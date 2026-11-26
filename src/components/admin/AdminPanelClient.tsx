"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  Settings01Icon,
  RefreshIcon,
  SparklesIcon,
  AiLockIcon,
} from "@hugeicons/core-free-icons";
import { PageContainer } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/lib/i18n";
import { useSessionAccess, notifyAppConfigUpdated } from "@/components/auth/SessionIsolationProvider";
import {
  notifyFeatureFlagsUpdated,
  type FeatureFlagItem,
} from "@/lib/features/use-feature-flags";
import type { AppConfigPayload } from "@/app/api/v1/app-config/route";
import type { UserProfile } from "@/lib/auth/session";

type AdminTab = "users" | "features" | "system";
type UserFilter = "all" | "active" | "inactive" | "disabled";

function getActivityMeta(lastActiveAt?: string | null, nowMs?: number) {
  if (!lastActiveAt || !nowMs) {
    return {
      isInactive7d: true,
      daysInactive: 999,
      labelEn: "Never active",
      labelBn: "কখনো অ্যাক্টিভ হয়নি",
      variant: "neutral" as const,
    };
  }
  const diffMs = Math.max(0, nowMs - new Date(lastActiveAt).getTime());
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) {
    return {
      isInactive7d: false,
      daysInactive: 0,
      labelEn: "Active today",
      labelBn: "আজ অ্যাক্টিভ",
      variant: "success" as const,
    };
  }
  if (days < 7) {
    return {
      isInactive7d: false,
      daysInactive: days,
      labelEn: `Active ${days}d ago`,
      labelBn: `${days} দিন আগে অ্যাক্টিভ`,
      variant: "info" as const,
    };
  }
  return {
    isInactive7d: true,
    daysInactive: days,
    labelEn: `Inactive ${days} days`,
    labelBn: `${days} দিন যাবত ইনঅ্যাক্টিভ`,
    variant: "warning" as const,
  };
}

export function AdminPanelClient() {
  const locale = useLocale();
  const isBn = locale === "bn";
  const { user: currentUser, ready } = useSessionAccess();

  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [userFilter, setUserFilter] = useState<UserFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserForFeatures, setSelectedUserForFeatures] = useState<string | null>(null);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [features, setFeatures] = useState<FeatureFlagItem[]>([]);
  const [appConfig, setAppConfig] = useState<AppConfigPayload>({
    ai_daily_limit: 50,
    guest_preview_enabled: true,
    guest_preview_percent: 5,
    system_notice_enabled: false,
    system_notice: "",
  });
  const [nowMs, setNowMs] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, fRes, cRes] = await Promise.all([
        fetch("/api/v1/admin/users", { cache: "no-store" }),
        fetch("/api/v1/features", { cache: "no-store" }),
        fetch("/api/v1/app-config", { cache: "no-store" }),
      ]);
      if (uRes.ok) {
        const uData = await uRes.json();
        setUsers(uData.users ?? []);
      }
      if (fRes.ok) {
        const fData = await fRes.json();
        setFeatures(fData.items ?? []);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        if (cData?.config) setAppConfig(cData.config);
      }
      setNowMs(Date.now());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      queueMicrotask(() => {
        void loadAdminData();
      });
    }
  }, [currentUser, loadAdminData]);

  const handleUpdateUser = async (
    userId: string,
    patch: { role?: "user" | "admin"; is_active?: boolean; disabled_features?: string[] }
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
      notifyFeatureFlagsUpdated();
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
      setStatusMsg(isBn ? "গ্লোবাল ফিচার আপডেট হয়েছে।" : "Global feature updated.");
    } finally {
      setBusyId(null);
    }
  };

  const handleSaveAppConfig = async (patch: Partial<AppConfigPayload>) => {
    setBusyId("app-config");
    setStatusMsg(null);
    try {
      const res = await fetch("/api/v1/app-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg(data.error || "Config update failed");
        return;
      }
      if (data?.config) setAppConfig(data.config);
      notifyAppConfigUpdated();
      setStatusMsg(isBn ? "সিস্টেম কনফিগারেশন সেভ হয়েছে।" : "System settings saved.");
    } finally {
      setBusyId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((u) => {
      const meta = getActivityMeta(u.last_active_at, nowMs);
      if (userFilter === "active" && (!u.is_active || meta.isInactive7d)) return false;
      if (userFilter === "inactive" && !meta.isInactive7d) return false;
      if (userFilter === "disabled" && u.is_active) return false;
      if (!q) return true;
      return (
        u.email.toLowerCase().includes(q) ||
        (u.full_name ?? "").toLowerCase().includes(q)
      );
    });
  }, [users, userFilter, searchQuery, nowMs]);

  const activeTodayCount = useMemo(
    () =>
      users.filter(
        (u) => u.is_active && getActivityMeta(u.last_active_at, nowMs).daysInactive === 0
      ).length,
    [users, nowMs]
  );
  const inactive7dCount = useMemo(
    () =>
      users.filter((u) => getActivityMeta(u.last_active_at, nowMs).isInactive7d).length,
    [users, nowMs]
  );

  if (ready && (!currentUser || currentUser.role !== "admin")) {
    return (
      <PageContainer className="py-10">
        <Card className="p-6 bg-card border border-border rounded-card text-center space-y-3 max-w-md mx-auto">
          <div className="mx-auto size-11 rounded-control bg-primary/10 text-primary flex items-center justify-center">
            <HugeiconsIcon icon={AiLockIcon} size={22} />
          </div>
          <h1 className="font-heading text-card-title text-foreground">
            {isBn ? "শুধুমাত্র অ্যাডমিন অ্যাক্সেস" : "Admin Access Required"}
          </h1>
          <p className="text-meta text-muted-foreground">
            {isBn
              ? "এই পেজটি দেখতে অ্যাডমিন অ্যাকাউন্ট দিয়ে লগইন করুন।"
              : "Please sign in with an administrator account to access Admin Controls."}
          </p>
          <Link href="/auth/login?next=/admin-panel">
            <Button type="button" variant="cta" size="sm">
              {isBn ? "লগইন করুন" : "Sign In as Admin"}
            </Button>
          </Link>
        </Card>
      </PageContainer>
    );
  }

  const managedUser = users.find((u) => u.id === selectedUserForFeatures) ?? null;

  return (
    <PageContainer className="py-6 space-y-6 pb-16">
      {/* Header */}
      <Card className="p-5 sm:p-6 bg-card border border-border rounded-card shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <Badge variant="brand" size="sm">
              Admin Control Center
            </Badge>
            <h1 className="font-heading text-page-title text-foreground mt-1">
              {isBn ? "অ্যাডমিন প্যানেল" : "Admin Panel"}
            </h1>
            <p className="text-meta text-muted-foreground">
              {isBn
                ? "ইউজার অ্যাক্টিভিটি, প্রতি-ইউজার ফিচার কন্ট্রোল, AI কোটা এবং সিস্টেম নোটিশ নিয়ন্ত্রণ করুন।"
                : "Monitor user activity, control per-user & global features, AI limits, and system notices."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {statusMsg && (
              <Badge variant="success" size="sm">
                {statusMsg}
              </Badge>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadAdminData}
              disabled={loading}
              className="gap-1.5"
            >
              <HugeiconsIcon
                icon={RefreshIcon}
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              <span>{isBn ? "রিফ্রেশ" : "Refresh"}</span>
            </Button>
          </div>
        </div>

        {/* 3 Clean Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          <Button
            type="button"
            size="sm"
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => setActiveTab("users")}
            className="gap-1.5"
          >
            <HugeiconsIcon icon={UserGroupIcon} size={15} />
            <span>{isBn ? `ইউজার ও অ্যাক্টিভিটি (${users.length})` : `Users & Activity (${users.length})`}</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activeTab === "features" ? "default" : "outline"}
            onClick={() => setActiveTab("features")}
            className="gap-1.5"
          >
            <HugeiconsIcon icon={SparklesIcon} size={15} />
            <span>{isBn ? "ফিচার কন্ট্রোল" : "Feature Controls"}</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant={activeTab === "system" ? "default" : "outline"}
            onClick={() => setActiveTab("system")}
            className="gap-1.5"
          >
            <HugeiconsIcon icon={Settings01Icon} size={15} />
            <span>{isBn ? "AI কোটা, গেস্ট ও নোটিশ" : "AI Quota, Guest & Notice"}</span>
          </Button>
        </div>
      </Card>

      {/* TAB 1: USERS & ACTIVITY */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-4 bg-card border border-border rounded-card">
              <p className="text-chip text-muted-foreground">{isBn ? "মোট ইউজার" : "Total Users"}</p>
              <p className="text-stat text-foreground mt-1">{users.length}</p>
            </Card>
            <Card className="p-4 bg-card border border-border rounded-card">
              <p className="text-chip text-muted-foreground">{isBn ? "আজ অ্যাক্টিভ" : "Active Today"}</p>
              <p className="text-stat text-status-success-ink mt-1">{activeTodayCount}</p>
            </Card>
            <Card className="p-4 bg-card border border-border rounded-card">
              <p className="text-chip text-muted-foreground">{isBn ? "৭+ দিন ইনঅ্যাক্টিভ" : "Inactive 7+ Days"}</p>
              <p className="text-stat text-status-warning-ink mt-1">{inactive7dCount}</p>
            </Card>
            <Card className="p-4 bg-card border border-border rounded-card">
              <p className="text-chip text-muted-foreground">{isBn ? "বন্ধ অ্যাকাউন্ট" : "Disabled"}</p>
              <p className="text-stat text-destructive mt-1">
                {users.filter((u) => !u.is_active).length}
              </p>
            </Card>
          </div>

          {/* Search & Filter */}
          <Card className="p-4 bg-card border border-border rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "ইমেইল বা নাম দিয়ে খুঁজুন..." : "Search by email or name..."}
              className="sm:max-w-xs"
            />
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: "all", en: "All", bn: "সব" },
                  { id: "active", en: "Active", bn: "অ্যাক্টিভ" },
                  { id: "inactive", en: "Inactive 7d+", bn: "ইনঅ্যাক্টিভ ৭+ দিন" },
                  { id: "disabled", en: "Disabled", bn: "বন্ধ" },
                ] as const
              ).map((f) => (
                <Button
                  key={f.id}
                  type="button"
                  size="xs"
                  variant={userFilter === f.id ? "default" : "outline"}
                  onClick={() => setUserFilter(f.id)}
                >
                  {isBn ? f.bn : f.en}
                </Button>
              ))}
            </div>
          </Card>

          {/* Users List */}
          <div className="space-y-3">
            {filteredUsers.map((u) => {
              const isSelf = u.id === currentUser?.id;
              const activity = getActivityMeta(u.last_active_at, nowMs);
              const disabledList = u.disabled_features ?? [];
              const isEditingFeatures = selectedUserForFeatures === u.id;

              return (
                <Card key={u.id} className="p-4 bg-card border border-border rounded-card space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-label text-foreground">
                          {u.full_name || u.email}
                        </p>
                        <Badge variant={u.role === "admin" ? "brand" : "outline"} size="sm">
                          {u.role.toUpperCase()}
                        </Badge>
                        <Badge variant={u.is_active ? "success" : "error"} size="sm">
                          {u.is_active ? "Enabled" : "Disabled"}
                        </Badge>
                        <Badge variant={activity.variant} size="sm">
                          {isBn ? activity.labelBn : activity.labelEn}
                        </Badge>
                        {disabledList.length > 0 && (
                          <Badge variant="warning" size="sm">
                            {disabledList.length} feature(s) off
                          </Badge>
                        )}
                      </div>
                      <p className="text-chip text-muted-foreground font-mono">
                        {u.email}
                        {u.last_active_at &&
                          ` · Last active: ${new Date(u.last_active_at).toLocaleDateString()}`}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        size="xs"
                        variant={isEditingFeatures ? "default" : "outline"}
                        onClick={() =>
                          setSelectedUserForFeatures(isEditingFeatures ? null : u.id)
                        }
                      >
                        {isBn ? "ফিচার কন্ট্রোল" : "User Features"}
                      </Button>

                      {!isSelf && (
                        <>
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
                            {u.role === "admin" ? "Make User" : "Make Admin"}
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
                            {u.is_active ? "Disable" : "Enable"}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Per-User Feature Override Drawer */}
                  {isEditingFeatures && managedUser && (
                    <div className="rounded-panel bg-muted/35 border border-border/60 p-3.5 space-y-2.5">
                      <p className="text-chip text-foreground">
                        {isBn
                          ? `${managedUser.full_name || managedUser.email}-এর জন্য ফিচার অন/অফ:`
                          : `Per-User Features for ${managedUser.full_name || managedUser.email}:`}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {features.map((feat) => {
                          const userAllowed = !disabledList.includes(feat.key);
                          return (
                            <div
                              key={feat.key}
                              className="flex items-center justify-between gap-2 rounded-control bg-card border border-border px-3 py-2"
                            >
                              <span className="text-chip text-foreground truncate">
                                {isBn ? feat.label_bn : feat.label}
                              </span>
                              <Switch
                                checked={userAllowed}
                                disabled={busyId === u.id}
                                onCheckedChange={(checked) => {
                                  const nextDisabled = checked
                                    ? disabledList.filter((k) => k !== feat.key)
                                    : [...new Set([...disabledList, feat.key])];
                                  void handleUpdateUser(u.id, {
                                    disabled_features: nextDisabled,
                                  });
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL FEATURE CONTROLS */}
      {activeTab === "features" && (
        <Card className="p-5 sm:p-6 bg-card border border-border rounded-card space-y-4 shadow-xs">
          <div>
            <h2 className="font-heading text-card-title text-foreground">
              {isBn ? "গ্লোবাল ফিচার কন্ট্রোল (সব ইউজারের জন্য)" : "Global Feature Controls"}
            </h2>
            <p className="text-meta text-muted-foreground">
              {isBn
                ? "এখান থেকে কোনো ফিচার বন্ধ করলে সবার জন্যই মেনু থেকে হাইড হবে।"
                : "Toggle modules globally for all users across the webapp."}
            </p>
          </div>
          <div className="divide-y divide-border/60">
            {features.map((feat) => (
              <div key={feat.key} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-label text-foreground">
                      {isBn ? feat.label_bn : feat.label}
                    </p>
                    <Badge variant={feat.enabled ? "success" : "neutral"} size="sm">
                      {feat.enabled ? "ON" : "OFF"}
                    </Badge>
                  </div>
                  <p className="text-chip text-muted-foreground mt-0.5">{feat.description}</p>
                </div>
                <Switch
                  checked={feat.enabled}
                  disabled={busyId === feat.key}
                  onCheckedChange={(checked) => handleToggleFeature(feat.key, checked)}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 3: AI QUOTA, GUEST PREVIEW & SYSTEM NOTICE */}
      {activeTab === "system" && (
        <Card className="p-5 sm:p-6 bg-card border border-border rounded-card space-y-5 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-panel border border-border p-3.5 space-y-2">
              <p className="text-label text-foreground">
                {isBn ? "দৈনিক AI লিমিট (প্রতি ইউজার)" : "AI Daily Limit (per user)"}
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={1000}
                  value={appConfig.ai_daily_limit}
                  onChange={(e) =>
                    setAppConfig((p) => ({
                      ...p,
                      ai_daily_limit: Math.max(1, parseInt(e.target.value || "50", 10)),
                    }))
                  }
                  className="w-28"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busyId === "app-config"}
                  onClick={() => handleSaveAppConfig({ ai_daily_limit: appConfig.ai_daily_limit })}
                >
                  {isBn ? "সেভ" : "Save"}
                </Button>
              </div>
            </div>

            <div className="rounded-panel border border-border p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-label text-foreground">
                  {isBn ? "গেস্ট প্রিভিউ (লগইন ছাড়া)" : "Guest Preview Access"}
                </p>
                <Switch
                  checked={appConfig.guest_preview_enabled}
                  disabled={busyId === "app-config"}
                  onCheckedChange={(checked) =>
                    handleSaveAppConfig({ guest_preview_enabled: checked })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-chip text-muted-foreground">
                  {isBn ? "লিমিট (%):" : "Limit (%):"}
                </span>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={appConfig.guest_preview_percent}
                  onChange={(e) =>
                    setAppConfig((p) => ({
                      ...p,
                      guest_preview_percent: Math.min(
                        100,
                        Math.max(1, parseInt(e.target.value || "5", 10))
                      ),
                    }))
                  }
                  className="w-24"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busyId === "app-config"}
                  onClick={() =>
                    handleSaveAppConfig({
                      guest_preview_percent: appConfig.guest_preview_percent,
                    })
                  }
                >
                  {isBn ? "সেভ" : "Save"}
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-panel border border-border p-3.5 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-label text-foreground">
                {isBn ? "সিস্টেম নোটিশ ব্যানার" : "System Notice Banner"}
              </p>
              <Switch
                checked={appConfig.system_notice_enabled}
                disabled={busyId === "app-config"}
                onCheckedChange={(checked) =>
                  handleSaveAppConfig({ system_notice_enabled: checked })
                }
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                value={appConfig.system_notice}
                onChange={(e) =>
                  setAppConfig((p) => ({ ...p, system_notice: e.target.value }))
                }
                placeholder={
                  isBn
                    ? "সব ইউজারের জন্য একটি নোটিশ লিখুন..."
                    : "Write a global announcement banner for all users..."
                }
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                variant="cta"
                disabled={busyId === "app-config"}
                onClick={() =>
                  handleSaveAppConfig({
                    system_notice: appConfig.system_notice,
                    system_notice_enabled: appConfig.system_notice_enabled,
                  })
                }
              >
                {isBn ? "নোটিশ আপডেট" : "Publish Notice"}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </PageContainer>
  );
}
