# English Conversation Practice — Component Library Specification

**Version:** 1.0  
**Purpose:** Reusable UI component inventory, behaviour, variants, responsive rules, and implementation contract for Antigravity.  
**Visual source:** `English_Conversation_Practice_Design_Style_Guide.md`  
**Product source:** `English_Conversation_Partner_Project_Brief.md`

> This document defines the component system, not the product's content. The product brief remains the source of truth for features and learning flows. The design guide remains the source of truth for visual direction.

---

## 1. Component library principles

1. Build reusable, composable components rather than page-specific copies.
2. Use the central design tokens from `design-tokens.css`. Do not hardcode palette values inside components.
3. Prefer semantic HTML and accessible interaction patterns.
4. Every interactive component must have documented states and real behaviour.
5. Use mobile-first responsive layouts. Never solve mobile by shrinking desktop components.
6. Support long English dialogue and Bangla translations without clipping.
7. Keep the conversation itself visually dominant. Supporting tools must not overwhelm it.
8. Separate UI, content data, business logic, and audio/API integrations.
9. Do not create a component merely because it appears in this inventory if the product does not need it. Build all required components, but avoid dead code.
10. Use the project's existing framework and conventions. Do not assume React, Next.js, Tailwind v3/v4, or a component library before auditing the repository.

## 2. Component architecture

Recommended component layers:

- **Primitives:** Button, IconButton, Text, Heading, Input, Checkbox, Badge, Avatar, Spinner.
- **Composites:** SearchField, FormField, DropdownMenu, Dialog, Toast, Card, Tabs, ProgressCard.
- **Product components:** ScenarioCard, ConversationTurn, TranslationPanel, AudioPlayer, VocabularyItem, GrammarExplanation, ExerciseCard.
- **Patterns:** AppShell, LearningWorkspace, ConversationReader, PracticeFlow, DiscoveryGrid, AdminEditorLayout.
- **Pages:** Compose patterns and product components. Pages should not reimplement primitive behaviour.

Suggested source organisation (adapt to the existing repository):

```text
src/
  components/
    ui/                 # Generic primitives and composites
    navigation/         # Sidebar, topbar, bottom navigation
    learning/           # Conversation and lesson components
    practice/           # Exercises, feedback, review
    dashboard/          # Dashboard-specific compositions
    admin/              # CMS/editor components
  styles/
    design-tokens.css
    globals.css
  features/
    conversations/
    vocabulary/
    progress/
    practice/
  types/
  lib/
```

Do not force this folder structure if the existing project already has a sound convention.

## 3. Global component contracts

### 3.1 Common requirements

- Use consistent naming: `Button`, `Card`, `ConversationTurn`, etc.
- Prefer explicit variants over arbitrary styling props.
- Use `className` or the framework's established styling extension point only where appropriate.
- Avoid passing raw HTML strings for user-generated or CMS content.
- Keep data types separate from visual components.
- Use stable IDs for dialogue lines, vocabulary items, scenarios, and exercises.
- Ensure loading, empty, error, disabled, selected, and success states are represented where relevant.
- Components must not silently swallow errors from API or audio actions.
- Use `aria-*`, labels, and semantic roles correctly.

### 3.2 Interaction states

Any interactive component must define:
- Default
- Hover (pointer devices)
- Focus-visible (keyboard)
- Pressed / active
- Disabled
- Loading (when an async action exists)
- Selected / checked (when applicable)
- Error / invalid (when applicable)

### 3.3 Responsive contracts

- Touch target: aim for at least 44 × 44px.
- Inputs and buttons should be comfortable on touch screens.
- Popovers should reposition or become drawers on narrow viewports.
- Dialog content must fit the viewport and scroll internally.
- Long content must wrap; use `min-width: 0` in flex/grid children.
- Avoid fixed widths for dialogue content.
- Desktop-only side panels must become accordions, drawers, or content sections on mobile.

---

## 4. Foundation and layout components

| Component | Purpose | Required variants / behaviour |
|---|---|---|
| `AppShell` | Main application frame | Authenticated and public layouts; responsive |
| `Sidebar` | Desktop primary navigation | Expanded, collapsed, active item, mobile hidden |
| `MobileNavigation` | Mobile primary navigation | Bottom navigation or drawer; safe-area aware |
| `Topbar` | Page-level header | Breadcrumb/title/actions; compact mobile |
| `PageHeader` | Title, description, actions | With/without breadcrumb |
| `PageContainer` | Consistent max-width and padding | Standard, narrow reading, full-width |
| `ContentGrid` | Responsive grid wrapper | 1/2/3 columns by breakpoint |
| `Stack` | Vertical spacing primitive | Tight, normal, relaxed |
| `Inline` | Horizontal alignment primitive | Wrap, no-wrap, responsive stack |
| `Divider` | Visual separation | Horizontal / vertical |
| `SectionHeader` | Section title and optional action | Responsive wrapping |
| `StickyActionBar` | Persistent lesson action area | Desktop bottom/side; mobile safe-area |
| `ResponsivePanel` | Contextual supporting content | Inline, collapsible, drawer |
| `TwoPaneLayout` | Main + secondary workspace | Stacks on mobile |
| `ThreePaneLayout` | Main + two supporting panes | Only at wide desktop |

## 5. Navigation components

| Component | Purpose | States / notes |
|---|---|---|
| `NavItem` | Navigation link | Default, hover, active, disabled |
| `NavGroup` | Group related navigation | Expanded/collapsed |
| `Breadcrumbs` | Show page hierarchy | Collapses middle items on mobile |
| `MobileNavItem` | Bottom-nav destination | Active indicator + accessible label |
| `UserMenu` | Account actions | Keyboard accessible menu |
| `NotificationBell` | Notification entry | Unread count; count must have accessible text |
| `CommandSearch` | Optional global search | Keyboard shortcut only if implemented |
| `LanguageSwitcher` | UI/content language selection | Current language clearly shown |

## 6. Core UI primitives

### 6.1 Actions

| Component | Variants |
|---|---|
| `Button` | Primary, secondary, accent, outline, ghost, destructive; sm/md/lg; loading |
| `IconButton` | Neutral, brand, ghost, destructive; tooltip/accessible label |
| `ButtonGroup` | Attached or separated; responsive wrap |
| `LinkButton` | Navigation action styled as button |
| `TextLink` | Inline link with clear focus/visited treatment |
| `CopyButton` | Copy text; copied feedback; graceful failure |
| `PlayButton` | Audio play/pause; loading and disabled |

### 6.2 Typography and display

| Component | Variants / notes |
|---|---|
| `Heading` | h1–h6 semantic levels |
| `Text` | Body, secondary, muted, caption |
| `Label` | Form label |
| `HelperText` | Supporting and validation text |
| `Kbd` | Keyboard key display |
| `CodeText` | Short technical/textual snippets only |
| `RichText` | Safe structured content renderer; sanitised |

### 6.3 Feedback and status

| Component | Variants / notes |
|---|---|
| `Badge` | Brand, neutral, success, warning, error, info |
| `StatusDot` | With accessible text; never colour-only |
| `Alert` | Info, success, warning, error; optional action |
| `Toast` | Success, error, info; dismissible; timed only when appropriate |
| `InlineMessage` | Compact validation or feedback |
| `Tooltip` | Keyboard and pointer accessible |
| `Skeleton` | Text, card, avatar, list, dialogue |
| `Spinner` | Small, medium, large; labelled when meaningful |
| `ProgressBar` | Determinate/indeterminate; accessible value |
| `CircularProgress` | Progress ring with text equivalent |
| `EmptyState` | Icon/illustration, message, primary action |
| `ErrorState` | Recovery action and optional retry |
| `OfflineBanner` | Connection status and retry guidance |

## 7. Form components

| Component | Requirements |
|---|---|
| `Form` | Submit, validation summary, pending state |
| `FormField` | Label, required marker, hint, error, control association |
| `Input` | Text, email, password, number, search; leading/trailing slots |
| `Textarea` | Resizable or fixed; character count when needed |
| `SearchField` | Search icon, clear action, loading state |
| `Select` | Native or accessible custom select; searchable only if needed |
| `Combobox` | Search + select; keyboard navigation |
| `Checkbox` | Checked, unchecked, indeterminate, disabled |
| `CheckboxGroup` | Group label and validation |
| `Radio` | Single selection |
| `RadioGroup` | Fieldset/legend semantics |
| `Switch` | On/off with text label |
| `Slider` | Value, min/max, step, accessible label |
| `DatePicker` | Keyboard and mobile-friendly date selection |
| `FileUpload` | Drag/drop plus browse; file validation |
| `PasswordField` | Show/hide password; accessible toggle |
| `CharacterCounter` | Used with textarea where limits exist |
| `FormActions` | Submit/cancel; mobile stacking |

## 8. Overlay and disclosure components

| Component | Behaviour |
|---|---|
| `Dialog` | Modal; focus trap; Escape close; restore focus |
| `AlertDialog` | Confirm destructive/important actions |
| `Drawer` | Side drawer on desktop; bottom sheet on mobile when suitable |
| `Popover` | Anchored content; collision-aware positioning |
| `DropdownMenu` | Keyboard navigation; menu item semantics |
| `ContextMenu` | Optional; only where a real context action exists |
| `Accordion` | Single/multiple expansion |
| `Collapsible` | Show/hide content |
| `Tabs` | Keyboard navigation; selected state |
| `SegmentedControl` | Small mutually exclusive options |
| `Tooltip` | Brief supplemental information, not essential instructions |
| `HoverCard` | Optional preview; must also work on touch/keyboard |
| `CommandPalette` | Optional global action/search interface |

## 9. Data display components

| Component | Purpose |
|---|---|
| `Card` | Base surface with optional header/footer |
| `StatCard` | Progress or summary metric |
| `List` / `ListItem` | Consistent list rows |
| `DataTable` | Admin data with responsive overflow or mobile alternative |
| `TableToolbar` | Search, filters, bulk actions |
| `Pagination` | Page navigation |
| `FilterChip` | Active filter |
| `FilterBar` | Search and filter controls |
| `Avatar` | Image/initials fallback |
| `AvatarGroup` | Multiple people |
| `UserProfileSummary` | Avatar + identity metadata |
| `CalendarMini` | Optional date/progress calendar |
| `Timeline` | Learning history or activity |
| `ChartCard` | Accessible chart wrapper; include textual summary |
| `MetricTrend` | Change over time with context |

---

# 10. Learning-domain component library

These components are central to the product and must use the design tokens and core primitives.

## 10.1 Discovery and scenario browsing

| Component | Purpose / behaviour |
|---|---|
| `ScenarioCard` | Scenario title, short context, level, duration, category, progress; clickable only if navigable |
| `ScenarioListItem` | Compact list version |
| `ScenarioGrid` | Responsive card grid |
| `CategoryCard` | Daily-life category entry |
| `CategoryNavigation` | Browse categories |
| `ProfessionCard` | Professional English pathway |
| `ProfessionPathCard` | Profession + progress + scenario count |
| `LevelChip` | A1–C2-inspired level label; accessible text |
| `DifficultyBadge` | Easy / medium / challenging |
| `DurationLabel` | Estimated lesson duration |
| `ScenarioMetadata` | Level, category, duration, format |
| `ScenarioFilters` | Category, level, duration, profession |
| `ScenarioSearch` | Search scenarios |
| `FeaturedScenario` | Highlighted learning recommendation |
| `ContinueLearningCard` | Resume current scenario |
| `RecommendedLessonCard` | Recommendation with reason |
| `LearningPathStepper` | Ordered scenarios or milestones |

## 10.2 Conversation reader

| Component | Purpose / behaviour |
|---|---|
| `ConversationHeader` | Scenario title, context, level and actions |
| `ConversationMeta` | Difficulty, length, style, estimated time |
| `ConversationReader` | Ordered dialogue container |
| `ConversationTurn` | One dialogue turn; speaker, text, actions |
| `SpeakerAvatar` | Avatar/initials and colour identity |
| `SpeakerLabel` | Speaker name and optional role |
| `DialogueText` | English source text with readable line length |
| `DialogueHighlight` | Highlight target vocabulary or phrase |
| `TranslationText` | Contextual Bangla translation |
| `TranslationToggle` | Show/hide translation |
| `BilingualDialogueTurn` | English + translation grouped together |
| `ConversationVersionSelector` | Short/medium/long or difficulty variant |
| `ConversationStyleSelector` | Casual/neutral/formal where available |
| `ConversationProgress` | Current turn / total turns |
| `ConversationActions` | Listen, repeat, bookmark, copy, explain |
| `TranscriptPanel` | Full transcript and speaker grouping |
| `ConversationSummary` | Brief situation recap and learning objective |

**ConversationTurn anatomy**

1. Speaker identity (avatar or initials + speaker name).
2. English dialogue text.
3. Optional translation, collapsed by default if the user preference says so.
4. Optional phrase/vocabulary highlights.
5. Audio and utility actions.
6. Optional timestamp or turn number when relevant.

The English dialogue must remain readable without opening translation or grammar tools. Never use tiny dashboard text styling for dialogue.

## 10.3 Audio and pronunciation

| Component | Purpose / behaviour |
|---|---|
| `AudioPlayer` | Full conversation playback |
| `AudioPlayButton` | Play/pause one line |
| `AudioProgress` | Seekable playback progress |
| `AudioTime` | Current and total time |
| `PlaybackSpeedMenu` | Supported speeds; current speed visible |
| `VoiceSelector` | Available accent/voice choice |
| `SpeakerAudioTrack` | Optional speaker-specific playback |
| `PronunciationButton` | Play a word or phrase |
| `RepeatAfterMeControl` | Listen, record, compare flow |
| `RecordingControl` | Start/stop/cancel microphone capture |
| `RecordingPermissionNotice` | Explain microphone permission |
| `AudioUnavailableState` | Graceful fallback if audio missing |

Audio components must not autoplay by default. Clearly distinguish generated audio, recorded audio, and browser speech synthesis if the product uses more than one source.

## 10.4 Vocabulary and grammar learning

| Component | Purpose / behaviour |
|---|---|
| `VocabularyPanel` | Vocabulary from current conversation |
| `VocabularyItem` | Word/phrase, meaning, pronunciation, actions |
| `VocabularyHighlight` | Inline clickable/highlighted term |
| `WordDetailPopover` | Meaning and quick actions |
| `WordDetailPanel` | Full word explanation |
| `PartOfSpeechBadge` | Noun, verb, adjective, etc. |
| `WordFormList` | Relevant word forms only |
| `SynonymList` | Contextually useful synonyms |
| `AntonymList` | Contextually useful antonyms |
| `CollocationList` | Common phrase combinations |
| `ExampleSentence` | Example with target highlighted |
| `CommonMistake` | Incorrect vs recommended usage |
| `GrammarPanel` | Contextual grammar explanations |
| `GrammarExplanation` | Rule explained in current sentence context |
| `SentenceBreakdown` | Phrase/clause segmentation |
| `SentenceTranslation` | Natural Bangla sentence translation |
| `PhrasePatternCard` | Reusable expression/pattern |
| `SaveVocabularyButton` | Save/unsave to notebook |

Do not force every grammatical property onto every word. Show only relevant details and progressively reveal advanced information.

## 10.5 Practice and assessment

| Component | Purpose / behaviour |
|---|---|
| `PracticeSessionHeader` | Exercise title, progress, exit action |
| `ExerciseCard` | Shared exercise shell |
| `MultipleChoiceQuestion` | Single/multiple choice |
| `FillInTheBlank` | Missing word/phrase |
| `SentenceOrdering` | Reorder words or sentence chunks |
| `DialogueOrdering` | Arrange conversation turns |
| `MatchingExercise` | Match phrase and meaning |
| `Flashcard` | Front/back vocabulary review |
| `ListeningQuestion` | Audio prompt + question |
| `ComprehensionQuestion` | Understanding check |
| `RoleplayPrompt` | Role, situation, objective, starter line |
| `AnswerInput` | Typed response |
| `HintPanel` | Optional progressive hints |
| `AnswerFeedback` | Correct/incorrect and explanation |
| `CorrectAnswerReveal` | Model answer and why |
| `ExerciseNavigation` | Previous/next/submit |
| `ExerciseProgress` | Question index and progress |
| `ResultSummary` | Score, strengths, next step |
| `RetryAction` | Retry incorrect items |
| `PracticeCompletion` | Completion state and next action |

Exercise components must support keyboard interaction, visible selection, and clear feedback. Avoid marking a response incorrect solely because it differs from one exact string when acceptable alternatives exist.

## 10.6 AI speaking partner (when implemented)

| Component | Purpose / behaviour |
|---|---|
| `RoleplayWorkspace` | AI conversation practice layout |
| `RoleplayScenarioBrief` | Context, learner role, AI role, goal |
| `RoleplayTranscript` | Turn-by-turn conversation |
| `RoleplayMessage` | Learner/AI message |
| `SpeakingInputBar` | Text or voice input |
| `MicrophoneButton` | Permission, recording, listening states |
| `VoiceModeToggle` | Text/voice mode |
| `SpeakingHint` | Optional phrase hint |
| `CorrectionCard` | Original phrase + improved phrase + reason |
| `SpeakingFeedbackSummary` | Fluency/clarity/grammar feedback only where measurable |
| `EndRoleplayDialog` | Confirm end and show summary |
| `ConnectionStatus` | Connecting, connected, reconnecting, failed |

Do not claim precise pronunciation scoring unless a reliable scoring service exists. If unavailable, provide qualitative practice feedback and explain its limits.

## 10.7 Progress, revision, and motivation

| Component | Purpose / behaviour |
|---|---|
| `DailyGoalCard` | Daily learning target and progress |
| `StreakCard` | Current streak and clear date logic |
| `WeeklyActivityChart` | Activity over time; accessible summary |
| `ProgressOverview` | Lessons, time, vocabulary, practice |
| `SkillProgressCard` | Listening, vocabulary, speaking etc. |
| `AchievementCard` | Milestone/achievement |
| `DailyChallengeCard` | Daily practice entry |
| `ReviewQueue` | Items due for revision |
| `VocabularyNotebook` | Saved words and filters |
| `BookmarkList` | Saved scenarios and phrases |
| `RecentActivityList` | Recently completed or visited content |
| `LearningHistory` | Timeline or grouped history |
| `GoalSettings` | Set or edit learning goal |

Do not use gamification to shame users. Streaks and goals should be encouraging and allow recovery after missed days.

---

# 11. Dashboard composition

Dashboard is a composition, not a separate component system. Recommended modules:

- `WelcomeHeader`
- `ContinueLearningCard`
- `DailyGoalCard`
- `DailyChallengeCard`
- `RecommendedLessonCard`
- `RecentActivityList`
- `VocabularyReviewPreview`
- `ProgressOverview`
- `StreakCard`

Desktop may use a primary content column plus a smaller progress/review column. Mobile should place the most useful next action first, followed by goals and recommendations.

# 12. Admin / content management components

Admin screens are part of the content operations plan. Keep their visual language consistent with the learner app but prioritise efficient editing and validation.

| Component | Purpose |
|---|---|
| `AdminShell` | Admin navigation and workspace |
| `AdminPageHeader` | Title, status, primary action |
| `ContentStatusBadge` | Draft, review, published, archived |
| `ContentTable` | Searchable/sortable content records |
| `ContentFilters` | Type, status, category, level |
| `ContentEditorLayout` | Main editor + metadata panel |
| `ScenarioForm` | Scenario metadata |
| `ConversationVersionEditor` | Version and level settings |
| `DialogueLineEditor` | Ordered speaker dialogue lines |
| `SpeakerSelector` | Choose or create speaker |
| `TranslationEditor` | English/Bangla and future locales |
| `VocabularyEditor` | Word, meaning, pronunciation, examples |
| `GrammarEditor` | Contextual explanation |
| `AudioAssetPicker` | Attach or replace audio |
| `ReorderableList` | Reorder dialogue or learning steps |
| `PublishChecklist` | Missing fields and content validation |
| `PreviewMode` | Learner-facing preview |
| `UnsavedChangesDialog` | Confirm navigation away |
| `AuditLogList` | Who changed what and when, if supported |

Admin components must validate content before publishing. Do not expose admin actions to learner roles.

---

## 13. Component states and examples

### ScenarioCard states

- Default: white card, subtle border.
- Hover: slight border/shadow emphasis.
- Focus: visible focus ring.
- In progress: progress label/bar.
- Completed: completion label and non-colour indicator.
- Locked: explanatory text and disabled navigation only when the product has a real lock rule.

### ConversationTurn states

- Default: neutral surface.
- Currently playing: subtle brand-tinted background and active audio indicator.
- Translation visible: translation appears directly below English.
- Saved: bookmark state changes and accessible label updates.
- Vocabulary highlighted: subtle tint/underline, never a highlighter rainbow.

### Exercise states

- Unanswered: neutral.
- Selected: brand border/fill.
- Correct: success surface + text explanation.
- Incorrect: error surface + constructive explanation.
- Submitted/loading: prevent duplicate submissions.
- Review: show model answer and explanation.

---

## 14. Design token usage rules

All components must consume tokens from `design-tokens.css` or the Tailwind theme generated from those tokens.

- Do not hardcode `#563B91`, `#F2C96D`, or other palette values inside component files.
- Do not create one-off spacing values without reason.
- Use the same radius and shadow levels across components.
- Use semantic tokens (`success`, `warning`, `danger`, `info`) for state feedback.
- Use `text-primary`, `text-secondary`, and `text-muted` consistently.
- Keep dark navigation styling separate from content surfaces.
- Add new tokens only when a real repeated use case exists; document the reason.

## 15. Suggested implementation order

**Foundation**
1. Design tokens and global styles.
2. Typography and icon system.
3. Layout primitives and app shell.
4. Buttons, fields, badges, cards, feedback states.
5. Navigation and responsive patterns.

**Learning core**
6. Scenario cards and filters.
7. Conversation reader and dialogue turns.
8. Translation and vocabulary.
9. Audio controls.
10. Practice exercises and feedback.

**Expansion**
11. Dashboard and progress.
12. Vocabulary notebook and review.
13. AI roleplay UI.
14. Admin CMS components.

Build in small batches. After each batch, test at mobile/tablet/desktop sizes before moving on.

## 16. Antigravity build prompt

```text
Read these project files first:
- English_Conversation_Partner_Project_Brief.md
- English_Conversation_Practice_Design_Style_Guide.md
- English_Conversation_Practice_Component_Library.md
- design-tokens.css

Task:
Audit the current repository and implement the reusable component system required by the product.

Rules:
1. Inspect framework, Tailwind version, routing, existing components, dependencies, and current styles before editing.
2. Preserve existing working architecture and avoid unnecessary migrations.
3. Treat the project brief as the source of truth for features, the design guide as visual direction, this component library as the component contract, and design-tokens.css as the token source.
4. Implement components in dependency order: tokens -> primitives -> composites -> navigation/layout -> learning components -> practice -> dashboard/admin as needed.
5. Do not create fake functionality. Wire controls to real state/actions or clearly render them as non-interactive.
6. Keep all components responsive and accessible.
7. Use semantic HTML, keyboard support, visible focus, appropriate ARIA, and reduced-motion support.
8. Do not build all components in one huge file. Use small, composable files following the existing project conventions.
9. Avoid duplicating components that already exist; improve or wrap them where appropriate.
10. Do not implement optional AI/audio integrations until the required backend/service exists. Build honest UI states and interfaces only.

Before coding, report:
A. Existing stack and Tailwind version.
B. Existing components that can be reused.
C. Components missing from this library.
D. Proposed file structure and implementation batches.
E. Any design or technical conflicts.

Then implement the Foundation batch only and show the changed files and test results. Continue to the next batch only after review/approval.
```

## 17. Definition of done

- Components are reusable and not duplicated across pages.
- Design tokens are the single source of truth for colour, spacing, radius, typography, and elevation.
- Interactive states are implemented.
- Forms and overlays are keyboard accessible.
- Conversation text and Bangla translations wrap correctly.
- Mobile navigation and learning layouts are usable at 320px width.
- No unintended horizontal overflow at supported widths.
- Loading, empty, error, and success states are present where relevant.
- No fake audio, AI, or scoring functionality is presented as real.
- Components follow the existing repository architecture and pass project checks.
