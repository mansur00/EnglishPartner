# English Conversation Partner — Landing, Sign-Up/Login & Onboarding Screen Specification

**Fills gap:** G-07 in `ECP_Review_Report.md`.
**Brief sources:** §16.3 key screens 1 (Landing Page), 2 (Sign Up / Login), 3 (Onboarding / Learning Preferences). §3.1 navigation. §13 user settings.
**Visual sources:** Style Guide §1–§10 (palette, type, layout, components). Tokens doc (`--ecp-*`). Component Library §4–§8 (primitives and forms).
**Motion sources:** MOTION.md §4.1 (navigation), §5 (signature interactions). Reduced motion always respected.
**Status:** Specification for approval. Decision D-01 and D-02 (palette and fonts) must be approved first.

---

## 1. Shared Rules for These Screens

- Use only components from the Component Library by their names (Decisions Register D-13).
- Colours and sizes come from tokens only. No hex values in components.
- Every screen works at 320 px width without horizontal scrolling (Component Library §17).
- Every form field has a visible label. Placeholder text is never the only label.
- Errors are shown next to the field, with text and an icon (not colour alone). Error text says what to do.
- Page title is sentence case. Buttons use plain verbs (Style Guide §4; Design guidance).
- No autoplay audio or video on the landing page.
- The landing page must not require login to read what the product is.
- Learners can switch UI language on every screen in the header (before login too).

---

## 2. Screen 1 — Landing Page (public)

### 2.1 Purpose

Explain what the product does in one screen, show a real example, and invite the learner to start. It must not be a sales page full of claims.

### 2.2 Content order

1. **Header:** logo, language switch (`বাংলা` / `English`), "Log in" (secondary), "Start learning" (primary).
2. **Hero:** headline, one supporting sentence, primary button "Start learning", secondary text link "See an example conversation".
3. **Example:** a real short conversation (3–4 lines) with the English visible and a "Show translation" toggle. This is the product, shown, not described.
4. **How it works:** three steps: "Pick a real situation", "Listen and read", "Practise your reply". Plain icons from the icon set in Style Guide §11. Not numbered unless it is a sequence (it is a sequence here).
5. **Who it is for:** short list of groups from brief §2.1 (students, job seekers, professionals, freelancers, travellers). Not a claim of results.
6. **Browse without signing up:** links to 3 categories ("Shopping & Money", "Travel & Transportation", "Workplace & Office").
7. **Footer:** Privacy, Terms, Contact (owner text), language switch.

### 2.3 Copy guidance

| Element | Rule |
|---|---|
| Headline | Describes the learner's outcome, not the product. Example: "Practise the English you need for real situations." |
| Supporting line | One sentence. No promises about speed or fluency. |
| No claims | No "fluent in 30 days". No CEFR claims of results. |

Final copy is written by the owner and reviewed by the Bangla reviewer for Bangla text.

### 2.4 States

| State | What shows |
|---|---|
| Loading | Skeleton for hero and example card (no spinner over the whole page) |
| Example audio unavailable | Example still readable; audio button shows "Audio not available yet" (not hidden) |
| Error loading example | Example card shows message "The example could not load. You can still start learning." with "Start learning" |

### 2.5 Layout (wireframe)

```
┌──────────────────────────────────────────────────────────┐
│ Logo              [বাংলা | English]   Log in  [Start]     │
├──────────────────────────────────────────────────────────┤
│  Practise the English you need                           │
│  for real situations.                                    │
│  One supporting sentence.                                │
│  [ Start learning ]   See an example conversation        │
│                                                          │
│  ┌────────────────────────────────────────────┐          │
│  │ Example conversation (3–4 lines)            │          │
│  │ [Show translation]                          │          │
│  └────────────────────────────────────────────┘          │
│                                                          │
│  Pick a situation → Listen and read → Practise your reply │
│                                                          │
│  Who it is for: …                                        │
│  Browse: [Shopping & Money] [Travel] [Workplace]         │
├──────────────────────────────────────────────────────────┤
│ Privacy · Terms · Contact                    বাংলা | EN   │
└──────────────────────────────────────────────────────────┘
```

Responsive: on mobile, the three steps stack vertically and the example card is full width. Header collapses to logo + "Log in" + menu icon.

### 2.6 Motion

- One entrance: hero text fades in over `--ecp-duration-normal`, then stops. Skip under reduced motion.
- No scroll-linked animation on this page in MVP (MOTION §6.3 says Lenis and scroll storytelling are for marketing pages only; this is optional and should not be built without owner approval).

### 2.7 Accessibility

- One `h1`. Sections use `h2`.
- Language switch has `aria-label="Change language"` and the current language is marked with `aria-current`.
- Example conversation: speaker labels are text, not only colour or avatar.

---

## 3. Screen 2 — Sign Up and Log In

### 3.1 Purpose

Let the learner create an account or log in with the auth method chosen in Phase 0 (Framework decision D3). Keep it short.

### 3.2 Options (depends on auth decision)

| Option | Notes |
|---|---|
| Email and password | Only if the auth provider supports strong password rules and reset |
| Email magic link | Simple, no password. Good for mobile. Needs reliable email delivery. |
| Google sign-in | Common, fewer fields. Adds dependency. |

Owner chooses one primary method in Phase 0. Do not show options that are not built (Component Library, build prompt rule 14).

### 3.3 Sign-up form fields

| Field | Required | Rule |
|---|---|---|
| Display name | Yes | 2–40 characters. Used in greeting. |
| Email (if email method) | Yes | Valid format. Checked by auth provider. |
| Password (if password method) | Yes | Minimum length as the provider requires; show the rule before the user types |
| Accept terms and privacy | Yes | Unchecked by default. Links open the pages. |
| Optional: anonymous usage data | No | Unchecked by default (Privacy spec §3) |

### 3.4 Log-in form

- Email (or identifier) and password, or magic link request.
- "Forgot password?" link if password method.
- Error for wrong credentials: "That email or password does not match. Try again or reset your password." Do not say which one is wrong (security).

### 3.5 States

| State | Behaviour |
|---|---|
| Idle | Form ready, primary button "Create account" or "Log in" |
| Submitting | Button shows loading state; fields disabled; `aria-busy` on the form |
| Field error | Message under the field, linked with `aria-describedby` |
| Account exists (sign-up) | "An account with this email already exists. Log in instead." with link |
| Network error | "We could not reach the server. Check your connection and try again." Form values are kept. |
| Rate limited | "Too many attempts. Wait a few minutes and try again." |
| Magic link sent | "Check your email. The link works for 15 minutes." (confirm exact time with provider). Option to resend after 60 seconds. |

### 3.6 After success

- New user → Onboarding (Screen 3).
- Returning user → Dashboard, or the page they came from if it was a learning page (store only the path, not query secrets).

### 3.7 Guest mode — **SUPERSEDED by Amendment A-02 (16 November 2026)**

**Decision A-02:** No guest progress storage in Phase 1. This section's original guest-mode behaviour does not apply.

**What still applies:**
- Unauthenticated users can browse, search, and read/listen to published content.
- Any save action (bookmark, vocabulary save, progress record) is blocked for unauthenticated users.
- Blocked save shows a clear **"Log in to save"** inline prompt (never a silent fail). See A-01.
- The prompt offers two calls to action: "Log in" (primary) and "Create account" (secondary).
- The learner's current position in the conversation is not lost when they dismiss the prompt.

Guest merge and local-storage progress are deferred. Reconsider after Gate 1E with conversion data.

---

## 4. Screen 3 — Onboarding / Learning Preferences

### 4.1 Purpose

Set 4 to 6 preferences in under 2 minutes. Everything can be changed later in Settings. Onboarding is skippable, but defaults must be sensible.

### 4.2 Steps

| Step | Question | Options | Stored as | Default |
|---|---|---|---|---|
| 1 | Which language should explanations use? | বাংলা · English | `primary_translation` | Browser language if `bn` or `en`, else English. Learner confirms. |
| 2 | What do you want English for? | Everyday life · Study · Work · Travel · Other | `learning_goal` (enum) | Everyday life |
| 3 | How would you describe your English? | Beginner · Elementary · Intermediate · Upper-intermediate · Advanced · Not sure | `learning_level` | Not sure → placeholder, offer a 3-question check later (not in MVP unless owner approves) |
| 4 | Which English accent do you prefer for audio? | American · British | `accent` (`en-US` / `en-GB`) | American |
| 5 | How much time can you practise each day? | 5 min · 10 min · 15 min · 20+ min | `daily_target_minutes` | 10 |
| 6 | Do you want Bangla translation shown by default? | Show · Hide (tap to reveal) | `translation_default` | Hide |

Rules:
- Step 3 "Not sure" sets level to unset. The dashboard then shows "Start with a beginner-friendly conversation" and the learner can change it later.
- Level is never shown as a judgement. The copy says "How would you describe your English?" not "What is your level?".
- Step 6 default is **Hide**, matching the brief's principle that translation is revealed on request (brief §7.2, Style Guide §10).

### 4.3 Layout

- One question per screen on mobile; up to two on desktop.
- Progress indicator: "Step 2 of 6" as text (not only a bar).
- Buttons: "Back" (secondary), "Continue" (primary), "Skip for now" (text link, visible on every step).
- Final step button: "Start learning".

Wireframe (one step):

```
┌──────────────────────────────────────┐
│ Step 2 of 6                          │
│ What do you want English for?         │
│                                      │
│ ( ) Everyday life                    │
│ ( ) Study                            │
│ ( ) Work                             │
│ ( ) Travel                           │
│ ( ) Other                            │
│                                      │
│ [Back]                 [Continue]    │
│           Skip for now               │
└──────────────────────────────────────┘
```

Radio choices are full-width tap targets (at least 44 px high). Selected state uses a brand border and a check icon, not colour alone.

### 4.4 States

| State | Behaviour |
|---|---|
| Nothing selected and Continue pressed | "Choose one option to continue, or skip this step." |
| Save fails | "Your choices could not be saved. Try again." Keep answers on screen. |
| Returning to onboarding later | Pre-filled from saved preferences. |
| Skipped all | Defaults applied; dashboard shows a card "Set your preferences" |

### 4.5 Accessibility

- Each step is a `fieldset` with a `legend` containing the question.
- Radio groups use native radio inputs (keyboard arrows work by default).
- The step counter is announced when it changes (`aria-live="polite"`).
- Focus moves to the step heading when the step changes.

### 4.6 Motion

- Step transition: slide-and-fade, `--ecp-duration-normal`, reversed for Back. Under reduced motion, instant swap.

---

## 5. Navigation After Onboarding

Dashboard is the first page after onboarding. The first card is "Start your first conversation", linked to a Beginner-friendly scenario that matches the learner's `primary_translation` coverage.

---

## 6. Acceptance Criteria

- [ ] Landing page reads correctly with no account and with JavaScript limited (headline, example text, and links visible).
- [ ] Language switch on landing changes the page language without losing the scroll position.
- [ ] Sign-up shows field-level errors with `aria-describedby`.
- [ ] Log-in error does not reveal whether the email exists.
- [ ] Onboarding can be completed with keyboard only.
- [ ] Skipping onboarding applies defaults and shows the dashboard card.
- [ ] All screens pass the responsive checks at 320, 375, 768, and 1280 px.
- [ ] No hardcoded colours; token audit passes.
- [ ] Reduced motion disables all transitions on these screens.
- [ ] Privacy and Terms links are reachable from every screen in §3 and §4.
- [ ] **[A-01, A-02]** An unauthenticated user who tries to save (bookmark, vocabulary, progress) sees a "Log in to save" prompt inline — not a spinner, not a silent fail, not a page redirect.
- [ ] **[A-01]** The "Log in to save" prompt offers "Log in" (primary) and "Create account" (secondary). It does not close the conversation or lose the learner's position.
- [ ] **[A-02]** No local-storage progress is written for unauthenticated users. Clearing storage produces no orphaned data.

---

## 7. Open Decisions

| # | Question | Recommendation |
|---|---|---|
| S-1 | Primary auth method | Magic link or Google first (lowest friction). Confirm with Framework D3. |
| S-2 | Guest mode before login | **Decided: none in Phase 1 (A-02, 16 Nov 2026).** Reconsider after Gate 1E. |
| S-3 | Level self-assessment | Self-select in MVP; add a short check in Phase 2 after owner approval |
| S-4 | Default translation visibility | Hidden (tap to reveal) |
| S-5 | Who writes the landing copy | Owner, with Bangla reviewer for Bangla text |
