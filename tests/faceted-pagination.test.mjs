import test from "node:test";
import assert from "node:assert/strict";
import { paginateItems, getPageNumbers } from "../src/lib/pagination/faceted-pagination.ts";

test("Faceted Pagination Engine (Milestone 1D / KI-10)", async (t) => {
  await t.test("1. Basic page slicing and boundaries", () => {
    const items = Array.from({ length: 17 }, (_, i) => `item-${i + 1}`);
    const result = paginateItems(items, { page: 1, pageSize: 6 });

    assert.equal(result.totalItems, 17);
    assert.equal(result.totalPages, 3);
    assert.equal(result.currentPage, 1);
    assert.equal(result.pageSize, 6);
    assert.equal(result.startIndex, 1);
    assert.equal(result.endIndex, 6);
    assert.equal(result.hasPrev, false);
    assert.equal(result.hasNext, true);
    assert.deepEqual(result.items, ["item-1", "item-2", "item-3", "item-4", "item-5", "item-6"]);
  });

  await t.test("2. Middle and final page slicing", () => {
    const items = Array.from({ length: 17 }, (_, i) => `item-${i + 1}`);
    
    // Page 2
    const page2 = paginateItems(items, { page: 2, pageSize: 6 });
    assert.equal(page2.currentPage, 2);
    assert.equal(page2.startIndex, 7);
    assert.equal(page2.endIndex, 12);
    assert.equal(page2.hasPrev, true);
    assert.equal(page2.hasNext, true);
    assert.equal(page2.items.length, 6);

    // Page 3 (final, partial page)
    const page3 = paginateItems(items, { page: 3, pageSize: 6 });
    assert.equal(page3.currentPage, 3);
    assert.equal(page3.startIndex, 13);
    assert.equal(page3.endIndex, 17);
    assert.equal(page3.hasPrev, true);
    assert.equal(page3.hasNext, false);
    assert.deepEqual(page3.items, ["item-13", "item-14", "item-15", "item-16", "item-17"]);
  });

  await t.test("3. Safe boundary clamping for invalid page numbers", () => {
    const items = [1, 2, 3, 4, 5];
    
    // Negative page clamped to 1
    const clampedLow = paginateItems(items, { page: -5, pageSize: 2 });
    assert.equal(clampedLow.currentPage, 1);

    // Page 0 clamped to 1
    const clampedZero = paginateItems(items, { page: 0, pageSize: 2 });
    assert.equal(clampedZero.currentPage, 1);

    // Page exceeding total pages clamped to totalPages (3)
    const clampedHigh = paginateItems(items, { page: 99, pageSize: 2 });
    assert.equal(clampedHigh.currentPage, 3);
    assert.deepEqual(clampedHigh.items, [5]);
  });

  await t.test("4. Empty list handling", () => {
    const emptyResult = paginateItems([], { page: 1, pageSize: 10 });
    assert.equal(emptyResult.totalItems, 0);
    assert.equal(emptyResult.totalPages, 1);
    assert.equal(emptyResult.currentPage, 1);
    assert.equal(emptyResult.startIndex, 0);
    assert.equal(emptyResult.endIndex, 0);
    assert.equal(emptyResult.hasPrev, false);
    assert.equal(emptyResult.hasNext, false);
    assert.deepEqual(emptyResult.items, []);
  });

  await t.test("5. Page numbers generation with ellipsis", () => {
    // 5 pages (<= 7) shows all pages without ellipsis
    assert.deepEqual(getPageNumbers(1, 5), [1, 2, 3, 4, 5]);

    // 10 pages when on page 1 -> [1, 2, "...", 10]
    assert.deepEqual(getPageNumbers(1, 10), [1, 2, "...", 10]);

    // 10 pages when on page 5 -> [1, "...", 4, 5, 6, "...", 10]
    assert.deepEqual(getPageNumbers(5, 10), [1, "...", 4, 5, 6, "...", 10]);

    // 10 pages when on page 9 -> [1, "...", 8, 9, 10]
    assert.deepEqual(getPageNumbers(9, 10), [1, "...", 8, 9, 10]);
  });
});
