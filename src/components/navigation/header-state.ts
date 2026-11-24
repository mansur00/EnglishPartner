import { t, type Locale } from "../../lib/i18n/index.ts";

export interface HeaderUser {
  id: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface HeaderAccountState {
  isLoggedIn: boolean;
  displayName: string;
  initial: string;
  loginLabel: string;
  logoutLabel: string;
  profileLabel: string;
  loginHref: string;
  signoutAction: string;
}

/**
 * Computes header presentation state based on authenticated session user.
 */
export function getHeaderAccountState(user?: HeaderUser | null, locale?: Locale): HeaderAccountState {
  const isLoggedIn = Boolean(user && user.id);
  const initial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";
  const displayName = user?.name || user?.email?.split("@")[0] || t("auth.account", locale);

  return {
    isLoggedIn,
    displayName,
    initial,
    loginLabel: t("auth.login", locale),
    logoutLabel: t("auth.logout", locale),
    profileLabel: t("auth.profile", locale),
    loginHref: "/login",
    signoutAction: "/auth/signout",
  };
}
