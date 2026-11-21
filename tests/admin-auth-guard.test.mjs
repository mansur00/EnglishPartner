import test from "node:test";
import assert from "node:assert/strict";
import {
  checkAdminAccess,
  checkEditorAccess,
  checkReviewerAccess,
} from "../src/lib/auth/admin-guard.ts";

test("Admin Auth Guard & Unauthorized Redirects (Milestone 1D / KI-10)", async (t) => {
  await t.test("1. Admin Console access guard", () => {
    // Unauthenticated (no role) -> 401 redirect
    const unauth = checkAdminAccess(null);
    assert.equal(unauth.isAuthorized, false);
    assert.equal(unauth.statusCode, 401);
    assert.equal(unauth.redirectUrl, "/dashboard?auth_required=true");

    // Learner role -> 403 redirect
    const learner = checkAdminAccess("learner");
    assert.equal(learner.isAuthorized, false);
    assert.equal(learner.statusCode, 403);
    assert.equal(learner.redirectUrl, "/dashboard?unauthorized=true&role=learner");

    // Authorized roles: translator, editor, reviewer, admin
    assert.equal(checkAdminAccess("translator").isAuthorized, true);
    assert.equal(checkAdminAccess("editor").isAuthorized, true);
    assert.equal(checkAdminAccess("reviewer").isAuthorized, true);
    assert.equal(checkAdminAccess("admin").isAuthorized, true);
  });

  await t.test("2. Conversation Editor access guard", () => {
    // Unauthenticated -> 401
    const unauth = checkEditorAccess(null);
    assert.equal(unauth.isAuthorized, false);
    assert.equal(unauth.statusCode, 401);

    // Learner -> 403 with required=editor
    const learner = checkEditorAccess("learner");
    assert.equal(learner.isAuthorized, false);
    assert.equal(learner.statusCode, 403);
    assert.equal(learner.redirectUrl, "/admin?unauthorized=true&role=learner&required=editor");

    // Translator -> 403 with required=editor
    const translator = checkEditorAccess("translator");
    assert.equal(translator.isAuthorized, false);
    assert.equal(translator.statusCode, 403);
    assert.equal(translator.redirectUrl, "/admin?unauthorized=true&role=translator&required=editor");

    // Editor, Reviewer, Admin -> Authorized
    assert.equal(checkEditorAccess("editor").isAuthorized, true);
    assert.equal(checkEditorAccess("reviewer").isAuthorized, true);
    assert.equal(checkEditorAccess("admin").isAuthorized, true);
  });

  await t.test("3. Content Reviewer access guard", () => {
    // Editor is not authorized to review (requires reviewer)
    const editor = checkReviewerAccess("editor");
    assert.equal(editor.isAuthorized, false);
    assert.equal(editor.statusCode, 403);
    assert.equal(editor.redirectUrl, "/admin?unauthorized=true&role=editor&required=reviewer");

    // Reviewer and Admin are authorized
    assert.equal(checkReviewerAccess("reviewer").isAuthorized, true);
    assert.equal(checkReviewerAccess("admin").isAuthorized, true);
  });
});
