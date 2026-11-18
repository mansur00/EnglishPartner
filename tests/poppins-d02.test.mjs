import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('D-02 / KI-17: zero occurrences of Poppins in code directories', () => {
  const codeDirs = ['src', 'public'];
  const violations = [];

  function scan(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
          scan(full);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.mjs'].includes(ext)) {
          const content = fs.readFileSync(full, 'utf8');
          if (/poppins/i.test(content)) {
            violations.push(full);
          }
        }
      }
    }
  }

  for (const d of codeDirs) {
    scan(path.resolve(d));
  }

  assert.equal(violations.length, 0, `Expected 0 files with Poppins in code dirs, found: ${violations.join(', ')}`);
});

test('D-02: historical documents containing Poppins have dated non-current note', () => {
  const migrationDoc = path.resolve('docs/EnglishPartner_NoHardCode_Migration.md');
  if (fs.existsSync(migrationDoc)) {
    const content = fs.readFileSync(migrationDoc, 'utf8');
    if (/poppins/i.test(content)) {
      assert.match(
        content,
        /> Note \(18 Nov 2026\): Poppins was removed from the project per D-02\. The lines below are the historical record and are not current\./,
        'Historical migration doc must contain dated D-02 note'
      );
    }
  }

  const designDoc = path.resolve('../EnglishPartner_Design_System_v2.md');
  if (fs.existsSync(designDoc)) {
    const content = fs.readFileSync(designDoc, 'utf8');
    if (/poppins/i.test(content)) {
      assert.match(
        content,
        /> Note \(18 Nov 2026\): Poppins was removed from the project per D-02\. The lines below are the historical record and are not current\./,
        'Design System v2 historical doc must contain dated D-02 note'
      );
    }
  }
});
