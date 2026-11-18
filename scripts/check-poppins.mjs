#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const CODE_DIRS = ['src', 'public'];
const ROOT = path.resolve('.');

let violations = [];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
        scanDir(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.mjs'].includes(ext)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const matches = [...content.matchAll(/poppins/gi)];
        if (matches.length > 0) {
          violations.push({
            file: path.relative(ROOT, fullPath),
            count: matches.length
          });
        }
      }
    }
  }
}

for (const dir of CODE_DIRS) {
  scanDir(path.join(ROOT, dir));
}

if (violations.length > 0) {
  console.error('❌ D-02 violation: Poppins found in code directories:');
  for (const v of violations) {
    console.error(`  - ${v.file}: ${v.count} occurrence(s)`);
  }
  process.exit(1);
}

console.log('✅ D-02 font check passed: 0 occurrences of Poppins in code directories (src/, public/).');
