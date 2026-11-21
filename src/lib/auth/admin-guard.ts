/**
 * Admin Route Authorization & Redirect Guard (Milestone 1D / KI-10)
 * Complies with Decision D-11, Phase Plan §1E, and Multi-Language §13.1.
 */

import type { UserRole } from "./roles.ts";
import { canViewAdminPanel, canEditScenario, canReviewContent } from "./roles.ts";

export interface AdminAuthCheckResult {
  isAuthorized: boolean;
  statusCode?: 401 | 403;
  redirectUrl?: string;
  reason?: string;
}

/**
 * Checks whether the given role can view the admin dashboard console.
 * Returns unauthorized redirect information if denied.
 */
export function checkAdminAccess(role?: UserRole | null): AdminAuthCheckResult {
  if (!role) {
    return {
      isAuthorized: false,
      statusCode: 401,
      redirectUrl: "/dashboard?auth_required=true",
      reason: "Authentication required to access admin console",
    };
  }

  if (!canViewAdminPanel(role)) {
    return {
      isAuthorized: false,
      statusCode: 403,
      redirectUrl: "/dashboard?unauthorized=true&role=" + role,
      reason: `Role '${role}' is not authorized to view the admin console. Requires 'translator' or higher.`,
    };
  }

  return { isAuthorized: true };
}

/**
 * Checks whether the given role can edit scenarios in the conversation editor.
 */
export function checkEditorAccess(role?: UserRole | null): AdminAuthCheckResult {
  if (!role) {
    return {
      isAuthorized: false,
      statusCode: 401,
      redirectUrl: "/dashboard?auth_required=true",
      reason: "Authentication required to access conversation editor",
    };
  }

  if (!canEditScenario(role)) {
    return {
      isAuthorized: false,
      statusCode: 403,
      redirectUrl: `/admin?unauthorized=true&role=${role}&required=editor`,
      reason: `Role '${role}' is not authorized to edit scenarios. Requires 'editor' or higher.`,
    };
  }

  return { isAuthorized: true };
}

/**
 * Checks whether the given role can review and approve content.
 */
export function checkReviewerAccess(role?: UserRole | null): AdminAuthCheckResult {
  if (!role) {
    return {
      isAuthorized: false,
      statusCode: 401,
      redirectUrl: "/dashboard?auth_required=true",
      reason: "Authentication required to review content",
    };
  }

  if (!canReviewContent(role)) {
    return {
      isAuthorized: false,
      statusCode: 403,
      redirectUrl: `/admin?unauthorized=true&role=${role}&required=reviewer`,
      reason: `Role '${role}' is not authorized to review content. Requires 'reviewer' or higher.`,
    };
  }

  return { isAuthorized: true };
}
