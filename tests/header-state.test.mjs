import { test } from "node:test";
import assert from "node:assert/strict";
import { getHeaderAccountState } from "../src/components/navigation/header-state.ts";
import { t } from "../src/lib/i18n/index.ts";

test("AUD-KI-04: Header reflects logged-out state with Log in button", () => {
  const state = getHeaderAccountState(null);

  assert.equal(state.isLoggedIn, false, "Should be logged out when user is null");
  assert.equal(state.loginLabel, t("auth.login"));
  assert.equal(state.loginHref, "/login");
});

test("AUD-KI-04: Header reflects logged-in state with User info and Log out button", () => {
  const mockUser = {
    id: "user-456",
    name: "Nadia Rahman",
    email: "nadia@example.com",
  };

  const state = getHeaderAccountState(mockUser);

  assert.equal(state.isLoggedIn, true, "Should be logged in when user is present");
  assert.equal(state.displayName, "Nadia Rahman");
  assert.equal(state.initial, "N");
  assert.equal(state.logoutLabel, t("auth.logout"));
  assert.equal(state.signoutAction, "/auth/signout");
});

test("AUD-KI-04: Header handles user with email only", () => {
  const mockUser = {
    id: "user-789",
    email: "learner@partner.org",
  };

  const state = getHeaderAccountState(mockUser);

  assert.equal(state.isLoggedIn, true);
  assert.equal(state.displayName, "learner");
  assert.equal(state.initial, "L");
  assert.equal(state.logoutLabel, t("auth.logout"));
});
