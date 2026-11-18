import fs from 'node:fs';
import path from 'node:path';

function findFiles(dir, extensions) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(fullPath, extensions));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = findFiles('src', ['.tsx']);
const jsxTextPattern = />([^<>{}\n]+)</g;
const propPattern = /(?:placeholder|aria-label|title|alt)=["']([^"']+)["']/g;

const hits = [];

for (const file of files) {
  // Skip components/ui primitives (reusable shadcn/base-ui wrappers)
  if (file.includes('src/components/ui/')) continue;

  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    let match;
    while ((match = jsxTextPattern.exec(line)) !== null) {
      const text = match[1].trim();
      if (text && /[a-zA-Z]{2,}/.test(text)) {
        // filter out tailwind classes or code artifacts if any
        hits.push({ file, line: idx + 1, type: 'jsx', text });
      }
    }
    while ((match = propPattern.exec(line)) !== null) {
      const text = match[1].trim();
      if (text && /[a-zA-Z]{2,}/.test(text)) {
        hits.push({ file, line: idx + 1, type: 'prop', text });
      }
    }
  });
}

console.log(`Found ${hits.length} candidate hardcoded English text occurrences:`);
hits.forEach(h => console.log(`${h.file}:${h.line} [${h.type}] "${h.text}"`));
