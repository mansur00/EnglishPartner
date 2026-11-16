# MOTION.md
## Motion & Interaction Design System
### English Conversation Partner

**Document purpose:** Product-wide motion principles, interaction patterns, implementation guidance, free resource selection, accessibility, and quality standards for Google Antigravity.

**Product context:** English Conversation Partner is a conversation-first English learning platform. The product journey is:

**Discover → Understand → Listen → Explore → Practise → Review**

Motion must make this learning journey easier to understand, more enjoyable to use, and more rewarding to repeat. It must never compete with the lesson itself.

---

# 1. Product motion vision

Create an experience that feels:

- Engaging and interactive, without feeling childish.
- Friendly and expressive, without visual noise.
- Responsive and tactile, as if the interface acknowledges every meaningful action.
- Calm during reading and listening.
- Encouraging during practice, feedback, and progress moments.
- Consistent across desktop, tablet, and mobile.

The user should feel that the product reacts to them. Small moments of feedback should make learning feel active: a word is saved, a sentence is completed, an answer is accepted, a listening activity progresses, or a learning milestone is reached.

## 1.1 Core rule

**Motion must communicate state, guide attention, explain relationships, or reward meaningful progress.**

Do not add animation only because a library makes it possible.

Every animation must have a clear purpose:
1. Orientation: help users understand where they are.
2. Feedback: confirm that an action worked.
3. Continuity: show how one state becomes another.
4. Focus: draw attention to relevant learning content.
5. Motivation: acknowledge effort and progress.
6. Comprehension: reveal information in a way that supports learning.

If an animation does not serve one of these purposes, remove it.

---

# 2. Motion principles

## 2.1 Keep learning content in control

- English dialogue must remain easy to read.
- Never animate every word or every dialogue line continuously.
- Do not move text while a user is reading it.
- Avoid auto-playing animations that compete with audio.
- Keep translation, vocabulary, and grammar reveals predictable.
- Never make a user wait for an animation before they can continue learning.

## 2.2 Make interactions feel tactile

Use restrained feedback for:
- Button press and release.
- Selecting a conversation version.
- Saving a vocabulary item.
- Revealing a translation.
- Expanding a grammar explanation.
- Choosing an answer.
- Completing a practice activity.
- Switching between learning tabs.

The interaction should feel immediate. Avoid exaggerated bounce, overshoot, or long delays.

## 2.3 Use motion to explain relationships

Good examples:
- A vocabulary panel expands from the selected word or opens in a predictable side panel.
- A translation appears directly below its source sentence.
- A completed step changes the progress indicator.
- A modal enters and exits with a clear relationship to its trigger.
- A sentence builder tile moves into the selected answer area.

Avoid unrelated fly-ins, random floating objects, or effects that make the interface feel like a game when the task is serious.

## 2.4 Be consistent

Create shared motion tokens and reusable animation utilities. Do not give every component unrelated timing and easing.

## 2.5 Respect user control

- No automatic audio playback.
- No forced scroll hijacking.
- No animation that blocks a primary action.
- Users must be able to pause, replay, skip, or dismiss optional animated content.
- Support operating system reduced-motion preferences.

---

# 3. Motion tokens

Use these as starting values. Tune them after testing the actual interface.

## 3.1 Duration

| Token | Duration | Use |
|---|---:|---|
| `instant` | 100 ms | Press feedback, tiny state changes |
| `fast` | 160 ms | Hover, focus, icon state |
| `normal` | 220 ms | Dropdowns, tooltips, small panels |
| `moderate` | 320 ms | Drawers, dialogs, content reveals |
| `slow` | 480 ms | Meaningful page section transitions |
| `story` | 650 ms | Rare onboarding or celebratory sequence |

Guidance:
- Most interface feedback should complete within 100–250 ms.
- Small overlays should usually complete within 160–280 ms.
- Use longer motion only when it explains a meaningful transition.
- Never delay interaction just to finish an animation.

## 3.2 Easing

Use a small shared easing vocabulary:

```js
export const motionEase = {
  standard: [0.2, 0.0, 0.0, 1],
  enter: [0.16, 1, 0.3, 1],
  exit: [0.4, 0.0, 1, 1],
  emphasized: [0.2, 0.8, 0.2, 1],
};
```

Use:
- `standard` for everyday transitions.
- `enter` for panels and elements entering the interface.
- `exit` for elements leaving.
- `emphasized` for a limited number of important moments.

Do not use elastic or exaggerated bounce as the default easing.

## 3.3 Distance and scale

- Small UI movement: 4–8 px.
- Panel movement: 8–16 px.
- Large page transitions: avoid unnecessary travel; if needed, keep it restrained.
- Button press scale: approximately 0.97–0.99.
- Hover scale: usually unnecessary; if used, keep it around 1.01–1.02.
- Never scale important text in a way that affects readability or causes layout shift.

## 3.4 Shared CSS variables

```css
:root {
  --motion-fast: 160ms;
  --motion-normal: 220ms;
  --motion-moderate: 320ms;
  --motion-slow: 480ms;

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
}

.interactive {
  transition:
    color var(--motion-fast) var(--ease-standard),
    background-color var(--motion-fast) var(--ease-standard),
    border-color var(--motion-fast) var(--ease-standard),
    transform var(--motion-fast) var(--ease-standard);
}

.interactive:active {
  transform: scale(0.985);
}
```

Do not apply `transition: all` globally. Animate only the properties that need to change.

---

# 4. Interaction map for the product

This section defines where motion should add value across the learning experience.

## 4.1 Global navigation

Expected interactions:
- Navigation item hover and active state.
- Mobile navigation open and close.
- Sidebar collapse and expand, if a sidebar exists.
- Page transition feedback where it improves continuity.

Motion direction:
- Active navigation state should change immediately and clearly.
- Mobile navigation may slide or fade in with a backdrop.
- Do not animate the entire application shell on every route change.
- Preserve browser navigation behaviour and focus management.

## 4.2 Dashboard

Recommended motion:
- A subtle first-load entrance for the primary welcome and continue-learning area.
- Progress indicators animate from the actual previous value to the current value.
- Continue-learning action receives a clear pressed state.
- A newly completed learning milestone can show a small acknowledgement.
- Stagger only a small number of important sections.

Do not animate every dashboard card independently. Do not make charts or statistics count endlessly on every visit.

## 4.3 Explore conversations

Recommended motion:
- Search focus state.
- Filter panel open and close.
- Selected filter chips appear or disappear with a short transition.
- Conversation result list updates without abrupt layout changes.
- Bookmark icon changes state with a small scale or fill transition.
- Category selection updates active state clearly.

Do not animate every search result as if it were a new page. Preserve scroll position when appropriate.

## 4.4 Scenario detail and conversation learning

This is the most important motion area.

Recommended interactions:
- Conversation version selector.
- Dialogue line focus or selection.
- Translation reveal and hide.
- Individual sentence audio playback state.
- Vocabulary word selection.
- Grammar panel open and close.
- Full conversation audio progress.
- Practice mode transition.

Rules:
- Keep the dialogue layout stable.
- Reveal translation below the related sentence, not in a distant location.
- Use a visible active state for the currently playing sentence.
- Audio progress must reflect actual playback time, not a decorative animation.
- Do not animate the sentence text itself while audio is playing.
- Do not automatically scroll to a new line unless the user has enabled that behaviour.

## 4.5 Vocabulary Explorer

Recommended interactions:
- Save and unsave word.
- Reveal pronunciation or meaning.
- Expand examples and word forms.
- Move between vocabulary items.
- Filter saved words.
- Review a word.

Use a small confirmation when a word is saved. A saved state must also be communicated through icon, label, or accessible status text, not animation alone.

## 4.6 Grammar Explorer

Recommended interactions:
- Open contextual grammar panel.
- Expand advanced explanation.
- Switch between sentence and word analysis.
- Reveal examples.
- Highlight the selected sentence element.

Keep the explanation readable and stable. Prefer height or opacity transitions for small panels, and avoid animating large amounts of text character by character.

## 4.7 Listening practice

Recommended interactions:
- Play, pause, replay.
- Playback speed selection.
- Audio timeline progress.
- Active sentence or speaker indication.
- Listening question answer selection.

Rules:
- Audio controls must always remain responsive.
- Use real audio events to drive playback state.
- Do not fake a waveform or progress bar if no audio is playing.
- Do not animate a waveform continuously when playback is paused or unavailable.
- Provide clear loading, unavailable, and error states.

## 4.8 Speaking and roleplay

When this feature is implemented:
- Show clear listening, recording, processing, and response states.
- Use a restrained microphone pulse only while recording is active.
- Provide an obvious stop recording action.
- Use a clear visual state for the AI speaking or waiting.
- Do not imply that speech is being recorded when it is not.
- Do not make voice activity depend on colour alone.

## 4.9 Sentence builder

This feature is a strong opportunity for delightful interaction.

Recommended interactions:
- Word tiles respond to tap and keyboard selection.
- Selected tiles move into the answer area.
- Incorrect placement returns with a clear, gentle response.
- Correct answers receive a short confirmation.
- Reset and retry actions remain obvious.
- Support drag and drop as an enhancement, never as the only interaction.

On mobile, use tap to select and tap to place as the reliable primary method. Dragging may be supported as an optional interaction.

## 4.10 Review and progress

Recommended interactions:
- Progress ring or bar reflects actual saved progress.
- Completed steps receive a small confirmation.
- Streak or milestone moments use a restrained celebration.
- Review cards transition clearly between questions.
- Completion summary appears after the activity is genuinely complete.

Do not award progress through animation alone. Progress must be based on real application state.

---

# 5. Signature interactions

Build a small set of memorable interactions that establish the product identity.

## 5.1 Word discovery

When the learner selects a vocabulary word:
1. Clearly mark the selected word.
2. Open the contextual word panel.
3. Show the meaning relevant to the current sentence first.
4. Reveal advanced details only when requested.
5. Allow the learner to save the word.

The panel should feel connected to the selected word, but must not cover essential dialogue content on small screens.

## 5.2 Translation reveal

When the learner reveals a translation:
1. Keep the English sentence visible.
2. Reveal the translation immediately below it.
3. Use a short opacity and height transition.
4. Maintain reading order and avoid layout jumps where possible.
5. Allow the learner to hide it again.

## 5.3 Active listening

While audio plays:
1. Show a clear playing state.
2. Update the real playback progress.
3. Highlight the current dialogue line when reliable timing data exists.
4. Keep the user in control of pause and replay.
5. Return to the idle state when playback ends or fails.

## 5.4 Correct answer

When an answer is correct:
1. Show a clear success state.
2. Provide concise feedback.
3. Advance only when the interaction design requires it or the user chooses to continue.
4. Use a short positive animation, not a large celebration every time.

## 5.5 Learning milestone

For meaningful milestones only:
- Use a small celebratory visual.
- Keep the message specific to the action completed.
- Make it dismissible.
- Avoid sound effects unless the user explicitly enables them.
- Respect reduced motion.

---

# 6. Recommended free motion resources

Use current official documentation and check the licence and plan restrictions before adopting a tool or downloading an asset.

## 6.1 GSAP — primary timeline and complex motion tool

Website: https://gsap.com/
Documentation: https://gsap.com/docs/
Installation: https://gsap.com/docs/v3/Installation/
React integration: https://gsap.com/resources/React/
GitHub: https://github.com/greensock/GSAP

Recommended for:
- Complex, coordinated sequences.
- ScrollTrigger interactions.
- Timeline based transitions.
- SVG and text animation.
- SplitText and advanced text reveals.
- MotionPath and complex visual storytelling.
- Onboarding sequences that need precise control.

Important:
- GSAP and its plugins became free for commercial use under the standard licence announced by Webflow.
- Review the current standard licence before shipping.
- Do not use GSAP to create a competing visual animation builder without checking the licence restrictions.
- Use only the plugins actually needed by the product.

Implementation preference:
- Use GSAP for orchestrated motion, not every button hover.
- In React, use the official `@gsap/react` integration and `useGSAP()` where appropriate.
- Scope selectors to the component.
- Clean up timelines, event listeners, and ScrollTriggers when components unmount.

## 6.2 Motion for React — React interface interactions

Website: https://motion.dev/
React documentation: https://motion.dev/docs/react
Examples: https://motion.dev/examples
GitHub: https://github.com/motiondivision/motion

Recommended for:
- React state driven transitions.
- Button and control gestures.
- Dialog and panel transitions.
- Layout changes.
- Small drag and tap interactions.
- Presence animations when elements enter and leave.

Use it when a transition naturally follows React component state. Avoid introducing it only to animate simple CSS hover states.

## 6.3 Lenis — optional smooth scrolling

Website and docs: https://lenis.dev/
GitHub: https://github.com/darkroomengineering/lenis

Recommended for:
- Carefully considered marketing or editorial sections.
- A page where scroll-linked visual storytelling genuinely improves comprehension.

Do not automatically enable smooth scrolling across the entire learning application. Native scrolling is often better for reading, accessibility, keyboard navigation, mobile behaviour, and nested panels.

Lenis is open source. Check the current version documentation and test nested scroll areas, touch input, browser search, focus movement, and reduced-motion behaviour before adoption.

## 6.4 Lottie and dotLottie — small illustrative animations

dotLottie web player: https://github.com/LottieFiles/dotlottie-web
LottieFiles: https://lottiefiles.com/
Player documentation: https://developers.lottiefiles.com/

Recommended for:
- Empty states.
- A small success illustration.
- Onboarding illustrations.
- A limited number of helpful visual explanations.

Rules:
- Prefer lightweight vector assets.
- Do not use a large animation where a simple icon or CSS transition is enough.
- Pause animations when they are not visible.
- Do not autoplay distracting loops.
- Check the licence of each downloaded animation separately.
- The dotLottie web player repository is MIT licensed; this does not automatically make every animation asset free for every use.

## 6.5 Rive — interactive illustrations and state machines

Website: https://rive.app/
Documentation: https://rive.app/docs/
Pricing: https://rive.app/pricing

Recommended for:
- Interactive character or guide illustrations.
- A highly polished onboarding moment.
- A custom speaking or listening illustration.
- Small state driven visual feedback.

Important cost and licensing note:
- The editor has a free tier, but free creation does not mean every production export or deployment capability is free.
- Current pricing distinguishes creation from shipping and runtime export features.
- Verify the plan required to export and ship a Rive asset before designing a feature around it.
- Do not make Rive a required dependency for core learning flows.

## 6.6 Native CSS and Web Animations API

Documentation:
- https://developer.mozilla.org/en-US/docs/Web/CSS/transition
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

Recommended for:
- Hover and focus.
- Button press.
- Small state transitions.
- Simple accordion and disclosure.
- Loading indicators.
- Basic progress transitions.

Prefer native CSS for simple effects. It reduces dependencies and is usually easier to maintain.

---

# 7. Library selection strategy

Do not install every library listed in this document.

Use this decision order:

1. Native CSS for simple hover, focus, active, and state transitions.
2. Motion for React when React state and gestures drive the interaction.
3. GSAP when a coordinated timeline, advanced scroll animation, SVG, or complex sequence is genuinely needed.
4. Lenis only when a specific page benefits from smooth scroll and accessibility testing passes.
5. Lottie or dotLottie for a small number of illustrative assets.
6. Rive only when interactive vector animation justifies its production plan and runtime requirements.

## 7.1 Avoid overlapping animation systems

- Do not animate the same element with CSS, Motion, and GSAP at the same time.
- Do not use both GSAP and Motion for the same interaction without a clear technical reason.
- Do not add a smooth scrolling library by default.
- Do not add a large animation package for one tiny icon.
- Keep the project dependency list small.
- Inspect the existing framework and dependencies before installing anything.

## 7.2 Suggested default for this product

If the existing project is React:
- CSS: basic interaction states.
- Motion for React: common state driven UI interactions, if needed.
- GSAP: complex timeline and scroll based motion.
- dotLottie: only for selected illustrations.
- Lenis: optional and probably limited to marketing pages.

This is a recommendation, not permission to change the existing stack. Inspect the workspace and reuse installed dependencies first.

---

# 8. Implementation patterns

These are implementation examples, not instructions to replace existing architecture. Adapt imports and component structure to the actual project.

## 8.1 CSS interaction

```css
.button {
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    transform 120ms ease;
}

.button:hover {
  /* Use a clear visual state, not a large scale effect. */
}

.button:active {
  transform: scale(0.985);
}

.button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
```

## 8.2 Motion for React interaction

```jsx
import { motion } from "motion/react";

export function SaveWordButton({ saved, onToggle }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.14 }}
      aria-pressed={saved}
      onClick={onToggle}
    >
      {saved ? "Saved" : "Save word"}
    </motion.button>
  );
}
```

The saved state must come from real application data. Do not simulate persistence with animation.

## 8.3 GSAP component timeline

```jsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function LearningIntro() {
  const container = useRef(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray("[data-motion='intro']", container.current);

      gsap.from(items, {
        y: 10,
        opacity: 0,
        duration: 0.42,
        stagger: 0.07,
        ease: "power2.out",
        clearProps: "all",
      });
    },
    { scope: container }
  );

  return (
    <section ref={container}>
      <h1 data-motion="intro">Learn through real conversations</h1>
      <p data-motion="intro">Understand, listen, practise, and improve.</p>
    </section>
  );
}
```

Before using this pattern:
- Confirm the project is React.
- Confirm `gsap` and `@gsap/react` are installed or approve installation.
- Ensure the animation does not hide content when JavaScript fails.
- Add reduced-motion handling.
- Avoid replaying the same entrance animation on every small state update.

## 8.4 Reduced motion CSS

```css
/* Keep motion opt-in. The default state remains usable without animation. */
.motion-enter {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: no-preference) {
  .motion-enter {
    animation: content-enter 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
}

@keyframes content-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

This pattern keeps the static, accessible state as the default and opts into movement only when the user has not requested reduced motion. Review component behaviour individually. Do not remove meaningful state feedback, focus indicators, or non-motion colour changes.

For JavaScript driven motion, also check the user's preference before starting non-essential timelines. When reduced motion is enabled, show the final state immediately or use a subtle opacity-only transition where appropriate. Avoid a global rule that forces every transition and animation to an almost-zero duration, because that can make some state changes feel abrupt.

---

# 9. Scroll animation rules

Scroll motion should be rare in the learning application.

Allowed:
- A small progress indicator tied to real scroll position when it helps orientation.
- A restrained reveal for a marketing page section.
- A scroll-linked illustration that explains a process and can be skipped.

Avoid:
- Scroll hijacking.
- Forced snap scrolling for ordinary content.
- Large parallax effects behind reading content.
- Animations that repeatedly replay while scrolling up and down.
- Pinning long sections in the learning flow.
- Delaying content visibility until an animation completes.

If using GSAP ScrollTrigger:
- Use `gsap.matchMedia()` for responsive conditions.
- Kill and clean up triggers correctly.
- Do not create triggers for every small element.
- Test browser resize, route navigation, and reduced motion.
- Keep content visible if the animation does not initialise.

---

# 10. Accessibility requirements

Accessibility is mandatory, not optional.

## 10.1 Reduced motion

Respect `prefers-reduced-motion: reduce`.

When reduced motion is active:
- Remove non-essential spatial movement.
- Disable parallax and large scroll-linked movement.
- Avoid repeated looping animations.
- Replace complex transitions with immediate state changes or subtle opacity changes.
- Keep all information and controls available.
- Do not rely on animation to communicate success, error, selection, or progress.

Provide an in-product motion preference only if the settings architecture supports it. The operating system preference must still be respected.

## 10.2 Keyboard and focus

- All interactive controls must work with keyboard.
- Focus indicators must remain visible.
- Opening a modal must move focus appropriately.
- Closing a modal must return focus to its trigger.
- Do not move focus merely because an animation has completed.
- Drag interactions must have an equivalent keyboard or tap interaction.

## 10.3 Screen readers

- Announce meaningful status changes using appropriate accessible status patterns.
- Do not announce every animation frame.
- Do not hide important text from assistive technology during visual transitions.
- Use semantic buttons and controls.
- Provide accessible names for icon-only controls.

## 10.4 Flashing and looping

- Avoid flashing, strobing, and rapid high contrast changes.
- Avoid decorative infinite motion.
- Stop non-essential motion when it is no longer relevant or visible.
- Do not use animation as the only indicator of recording or audio playback.

Reference:
- WCAG 2.2 animation from interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions
- W3C reduced motion technique: https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html
- MDN reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

---

# 11. Performance requirements

- Prefer `transform` and `opacity` for frequent motion.
- Avoid animating layout properties such as `top`, `left`, `width`, and `height` unless necessary.
- Do not animate large blurred shadows or expensive filters continuously.
- Avoid excessive simultaneous animations.
- Lazy load non-critical animation assets.
- Pause offscreen illustrative animations when possible.
- Keep audio playback independent from visual animation.
- Avoid loading multiple animation libraries on the initial route without need.
- Test on a mid-range mobile device, not only a powerful desktop.
- Monitor layout shift and interaction responsiveness.
- Avoid using `will-change` globally. Apply it only after profiling demonstrates a need, and remove it when the animation ends.

Target:
- Motion should feel smooth on ordinary devices.
- A missed frame must never prevent a user from completing a learning action.
- Core reading and audio controls must remain usable when animations are disabled or fail.

---

# 12. Responsive behaviour

## Desktop
- Hover feedback may be used where appropriate.
- Avoid hover-only information or actions.
- Side panels may enter from the side.
- Use restrained page-level transitions.

## Tablet
- Treat touch as the primary input.
- Do not depend on hover.
- Keep panel transitions short.
- Preserve readable dialogue width.

## Mobile
- Tap feedback is more important than hover.
- Prefer bottom sheets or full-screen panels where appropriate.
- Do not use large horizontal movement that competes with native gestures.
- Keep drag and drop optional.
- Avoid smooth scroll overrides unless carefully justified.
- Ensure the keyboard does not cover active practice controls.
- Keep motion short and lightweight.

---

# 13. Motion QA checklist

Before marking an interaction complete, verify:

### Purpose
- [ ] The animation has a clear UX purpose.
- [ ] The animation helps orientation, feedback, continuity, focus, motivation, or comprehension.
- [ ] The effect does not distract from reading or listening.

### Behaviour
- [ ] The control works without waiting for animation completion.
- [ ] The final state is correct.
- [ ] Repeated interaction does not create duplicate timelines or event listeners.
- [ ] Exit and cancellation states work.
- [ ] Loading and error states are handled.
- [ ] No decorative control appears functional without a real action.

### Accessibility
- [ ] Reduced motion is respected.
- [ ] Keyboard interaction works.
- [ ] Focus remains visible and logical.
- [ ] Screen reader status is available where needed.
- [ ] Colour is not the only status indicator.

### Performance
- [ ] No unnecessary layout shift.
- [ ] No long main-thread work.
- [ ] No excessive simultaneous animation.
- [ ] Mobile performance is acceptable.
- [ ] Animation assets are loaded only when needed.

### Responsive
- [ ] Desktop checked.
- [ ] Tablet checked.
- [ ] Mobile checked.
- [ ] Touch interactions checked.
- [ ] Nested scrolling and browser navigation remain usable.

---

# 14. Antigravity implementation instructions

Treat this document as the source of truth for motion decisions.

Before implementation:

1. Inspect the complete current workspace.
2. Identify the framework, package manager, existing animation libraries, routes, and component structure.
3. Check whether GSAP, Motion, Lenis, Lottie, or Rive is already installed.
4. Do not install all listed libraries.
5. Recommend the smallest suitable set based on the actual product and current code.
6. Explain any new dependency, bundle impact, licence or plan concern, and maintenance cost.
7. Wait for approval before adding a paid service, changing architecture, or introducing a significant dependency.

During implementation:

1. Create shared motion tokens and reusable utilities.
2. Implement one representative interaction first.
3. Test it with keyboard, touch, and reduced motion.
4. Confirm the final state remains available if animation fails.
5. Apply the approved pattern to related components.
6. Keep learning content and business logic independent from animation code.
7. Use real application state for progress, audio, saving, and practice feedback.
8. Do not invent working AI, audio, or recording behaviour.
9. Update project documentation when motion decisions change.

Do not redesign the product just to demonstrate animation capabilities.

## Suggested implementation order

1. Button, input, tab, and navigation feedback.
2. Translation reveal and vocabulary save.
3. Grammar panel and modal transitions.
4. Audio playback and active sentence states.
5. Sentence builder interactions.
6. Practice feedback and progress acknowledgement.
7. Marketing page scroll animation, only if needed.
8. Optional Lottie or Rive illustrations, only after the core experience is stable.

## Definition of done

A motion feature is complete only when:
- It serves a documented UX purpose.
- It works with real application state.
- It is responsive.
- It respects reduced motion.
- It supports keyboard and touch where relevant.
- It does not block the learning flow.
- It has no obvious performance regression.
- It has been tested in its real screen context.
- It does not introduce an unnecessary dependency.

---

# 15. Official resource and licence references

These links were checked while preparing this document. Pricing, licensing, and product features can change, so recheck the official terms before production release.

- GSAP free and commercial use announcement: https://webflow.com/updates/gsap-becomes-free
- GSAP current repository and licence information: https://github.com/greensock/GSAP
- GSAP installation and plugins: https://gsap.com/docs/v3/Installation/
- Webflow product terms including GSAP licence: https://webflow.com/legal/product-terms
- Motion for React: https://motion.dev/docs/react
- Lenis: https://lenis.dev/
- Motion and Lenis integration notes: https://motion.dev/docs/lenis
- dotLottie web player and MIT licence: https://github.com/LottieFiles/dotlottie-web
- Rive pricing: https://rive.app/pricing
- W3C animation from interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions
- W3C reduced motion technique: https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html
- MDN reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

---

# Final product principle

**Make the interface feel alive, but keep the learning experience effortless.**

The best motion is not the animation users notice most. It is the interaction that makes the next learning action feel natural, clear, satisfying, and easy to repeat.
