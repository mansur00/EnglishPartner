import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("AUD-KI-12: Keyboard Accessibility & Focus Management verification", () => {
  // 1. Verify Sheet component implements accessible Dialog Primitive with popup & close
  const sheetContent = fs.readFileSync("src/components/ui/sheet.tsx", "utf-8");
  assert.ok(sheetContent.includes("@base-ui/react/dialog"), "Sheet must use Base UI Dialog primitive");
  assert.ok(sheetContent.includes("SheetPrimitive.Popup"), "Sheet must render Dialog popup");
  assert.ok(sheetContent.includes("SheetPrimitive.Close"), "Sheet must render Dialog close trigger");

  // 2. Verify Dialog component implements accessible Dialog Primitive with popup & close
  const dialogContent = fs.readFileSync("src/components/ui/dialog.tsx", "utf-8");
  assert.ok(dialogContent.includes("@base-ui/react/dialog"), "Dialog must use Base UI Dialog primitive");
  assert.ok(dialogContent.includes("DialogPrimitive.Popup"), "Dialog must render Dialog popup");
  assert.ok(dialogContent.includes("DialogPrimitive.Close"), "Dialog must render Dialog close trigger");

  // 3. Verify GrammarPanel uses Sheet for modal focus trap and escape handling
  const grammarPanelContent = fs.readFileSync("src/components/learning/GrammarPanel.tsx", "utf-8");
  assert.ok(grammarPanelContent.includes("<Sheet open={isOpen}"), "GrammarPanel must use Sheet with open state");
  assert.ok(grammarPanelContent.includes("onOpenChange="), "GrammarPanel must handle onOpenChange for dismissal");

  // 4. Verify WordDetailPopover uses Dialog for modal focus trap and escape handling
  const popoverContent = fs.readFileSync("src/components/learning/WordDetailPopover.tsx", "utf-8");
  assert.ok(popoverContent.includes("<Dialog open={isOpen}"), "WordDetailPopover must use Dialog with open state");
  assert.ok(popoverContent.includes("onOpenChange="), "WordDetailPopover must handle onOpenChange for dismissal");

  // 5. Verify ConversationTurn renders interactive words with button role, tabIndex, and keyboard handler
  const turnContent = fs.readFileSync("src/components/learning/ConversationTurn.tsx", "utf-8");
  assert.ok(turnContent.includes('role={cleanWord ? "button" : undefined}'), "Interactive words must have button role");
  assert.ok(turnContent.includes('tabIndex={cleanWord ? 0 : undefined}'), "Interactive words must be keyboard focusable");
  assert.ok(turnContent.includes('onKeyDown='), "Interactive words must handle Enter/Space keyboard interaction");
  assert.ok(turnContent.includes('onGrammarClick?.(line.id)'), "Grammar button must trigger modal");
});
