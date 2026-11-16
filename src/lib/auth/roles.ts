/**
 * Role-Based Access Control (RBAC) System
 * Complies with Decision D-11 and Brief §14.
 */

export type UserRole = "learner" | "translator" | "editor" | "reviewer" | "admin";

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  languageScope?: string[]; // e.g., ["bn"] for translators
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  learner: 1,
  translator: 2,
  editor: 3,
  reviewer: 4,
  admin: 5,
};

/**
 * Checks whether a user's role meets the minimum required role level.
 */
export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Permission guards for content actions
 */
export function canViewAdminPanel(role: UserRole): boolean {
  return hasMinimumRole(role, "translator");
}

export function canEditScenario(role: UserRole): boolean {
  return hasMinimumRole(role, "editor");
}

export function canEditTranslations(role: UserRole, targetLanguage: string, userScope?: string[]): boolean {
  if (hasMinimumRole(role, "editor")) return true;
  if (role === "translator") {
    return !userScope || userScope.includes(targetLanguage);
  }
  return false;
}

export function canReviewContent(role: UserRole): boolean {
  return hasMinimumRole(role, "reviewer");
}

export function canPublishContent(role: UserRole): boolean {
  return hasMinimumRole(role, "reviewer");
}

export function canArchiveContent(role: UserRole): boolean {
  return hasMinimumRole(role, "admin");
}

export function canManageUsers(role: UserRole): boolean {
  return role === "admin";
}
