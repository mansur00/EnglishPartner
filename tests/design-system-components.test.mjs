import { test } from "node:test";
import assert from "node:assert/strict";
import { buttonVariants } from "../src/components/ui/button-variants.ts";
import { inputVariants } from "../src/components/ui/input-variants.ts";
import { badgeVariants } from "../src/components/ui/badge-variants.ts";

test("Design System: buttonVariants covers all spec variants", () => {
  const defaultClasses = buttonVariants({ variant: "default" });
  assert.ok(defaultClasses.includes("bg-primary"));

  const secondaryClasses = buttonVariants({ variant: "secondary" });
  assert.ok(secondaryClasses.includes("bg-brand-100"));

  const outlineClasses = buttonVariants({ variant: "outline" });
  assert.ok(outlineClasses.includes("border-border"));

  const ghostClasses = buttonVariants({ variant: "ghost" });
  assert.ok(ghostClasses.includes("hover:bg-muted"));

  const destructiveClasses = buttonVariants({ variant: "destructive" });
  assert.ok(destructiveClasses.includes("bg-destructive"));

  const linkClasses = buttonVariants({ variant: "link" });
  assert.ok(linkClasses.includes("underline-offset-4"));
});

test("Design System: buttonVariants covers all spec sizes and pill option", () => {
  const xs = buttonVariants({ size: "xs" });
  assert.ok(xs.includes("h-7"));

  const sm = buttonVariants({ size: "sm" });
  assert.ok(sm.includes("h-control-sm"));

  const def = buttonVariants({ size: "default" });
  assert.ok(def.includes("h-control-md"));

  const lg = buttonVariants({ size: "lg" });
  assert.ok(lg.includes("h-control-lg"));

  const icon = buttonVariants({ size: "icon" });
  assert.ok(icon.includes("size-tap"));

  const iconXs = buttonVariants({ size: "icon-xs" });
  assert.ok(iconXs.includes("size-7"));

  const iconSm = buttonVariants({ size: "icon-sm" });
  assert.ok(iconSm.includes("w-control-sm"));

  const iconLg = buttonVariants({ size: "icon-lg" });
  assert.ok(iconLg.includes("w-control-lg"));

  const pillButton = buttonVariants({ pill: true });
  assert.ok(pillButton.includes("rounded-pill"));
});

test("Design System: inputVariants covers variants, sizes, and pill option", () => {
  const outline = inputVariants({ variant: "outline" });
  assert.ok(outline.includes("border-input"));

  const filled = inputVariants({ variant: "filled" });
  assert.ok(filled.includes("bg-muted/60"));

  const ghost = inputVariants({ variant: "ghost" });
  assert.ok(ghost.includes("bg-transparent"));

  const sm = inputVariants({ inputSize: "sm" });
  assert.ok(sm.includes("h-control-sm"));

  const def = inputVariants({ inputSize: "default" });
  assert.ok(def.includes("h-input"));

  const lg = inputVariants({ inputSize: "lg" });
  assert.ok(lg.includes("h-control-lg"));

  const pillInput = inputVariants({ pill: true });
  assert.ok(pillInput.includes("rounded-pill"));
});

test("Design System: badgeVariants covers semantic status variants, sizes, and shapes", () => {
  const defaultBadge = badgeVariants({ variant: "default" });
  assert.ok(defaultBadge.includes("bg-primary"));

  const successBadge = badgeVariants({ variant: "success" });
  assert.ok(successBadge.includes("bg-status-success-bg"));

  const warningBadge = badgeVariants({ variant: "warning" });
  assert.ok(warningBadge.includes("bg-status-warning-bg"));

  const destructiveBadge = badgeVariants({ variant: "destructive" });
  assert.ok(destructiveBadge.includes("bg-destructive/10"));

  const sm = badgeVariants({ size: "sm" });
  assert.ok(sm.includes("h-5"));

  const def = badgeVariants({ size: "default" });
  assert.ok(def.includes("h-6"));

  const lg = badgeVariants({ size: "lg" });
  assert.ok(lg.includes("h-7"));

  const pill = badgeVariants({ shape: "pill" });
  assert.ok(pill.includes("rounded-pill"));

  const rounded = badgeVariants({ shape: "rounded" });
  assert.ok(rounded.includes("rounded-panel"));
});
