import fs from 'fs';
import path from 'path';

const TAXONOMY_PATH = path.resolve('src/content/grammar/taxonomy.json');
const LABELS_EN_PATH = path.resolve('src/content/grammar/labels.en.json');
const LABELS_BN_PATH = path.resolve('src/content/grammar/labels.bn.json');
const RULES_EN_PATH = path.resolve('src/content/grammar/rules.en.json');
const RULES_BN_PATH = path.resolve('src/content/grammar/rules.bn.json');
const GRAMMAR_DATA_DIR = path.resolve('data/grammar');

console.log('====================================================');
console.log('            RUNNING GRAMMAR BUILD GATE CHECK        ');
console.log('====================================================\n');

let errors = [];

// 1. Verify Taxonomy Registry exists and is valid JSON
if (!fs.existsSync(TAXONOMY_PATH)) {
  errors.push(`Missing taxonomy file: ${TAXONOMY_PATH}`);
}
const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY_PATH, 'utf-8'));
const validCategoryKeys = new Set(Object.keys(taxonomy.categories));
console.log(`✓ Taxonomy Registry loaded: ${validCategoryKeys.size} valid categories across ${Object.keys(taxonomy.layers).length} layers.`);

// 2. Verify Labels Parity
const labelsEn = JSON.parse(fs.readFileSync(LABELS_EN_PATH, 'utf-8'));
const labelsBn = JSON.parse(fs.readFileSync(LABELS_BN_PATH, 'utf-8'));

for (const key of validCategoryKeys) {
  if (!labelsEn[key]) {
    errors.push(`Missing English label for taxonomy category: '${key}' in labels.en.json`);
  }
  if (!labelsBn[key]) {
    errors.push(`Missing Bangla label for taxonomy category: '${key}' in labels.bn.json`);
  }
}
console.log(`✓ Label Parity verified: ${validCategoryKeys.size} categories mapped in both EN and BN.`);

// 3. Verify Rules Parity
const rulesEn = JSON.parse(fs.readFileSync(RULES_EN_PATH, 'utf-8'));
const rulesBn = JSON.parse(fs.readFileSync(RULES_BN_PATH, 'utf-8'));
const ruleKeysEn = Object.keys(rulesEn);

for (const rKey of ruleKeysEn) {
  if (!rulesBn[rKey]) {
    errors.push(`Missing Bangla rule card for '${rKey}' in rules.bn.json`);
  }
}
console.log(`✓ Rule Cards verified: ${ruleKeysEn.length} rules present with EN and BN parity.`);

// 4. Verify Annotations in data/grammar/
const annotationFiles = fs.readdirSync(GRAMMAR_DATA_DIR).filter(f => f.endsWith('.json'));
console.log(`\nValidating ${annotationFiles.length} conversation annotation datasets...`);

let totalTokensChecked = 0;
let totalGroupsChecked = 0;

for (const file of annotationFiles) {
  const filePath = path.join(GRAMMAR_DATA_DIR, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!data.lines || !Array.isArray(data.lines)) {
      errors.push(`${file}: invalid format, missing lines array`);
      continue;
    }

    for (const line of data.lines) {
      if (!line.tokens || line.tokens.length === 0) {
        errors.push(`${file} [${line.lineId}]: line has no tokens`);
        continue;
      }

      for (const tok of line.tokens) {
        totalTokensChecked++;
        if (tok.pos && tok.pos !== 'punctuation' && tok.pos !== 'unannotated') {
          if (!validCategoryKeys.has(tok.pos)) {
            errors.push(`${file} [${line.lineId}]: unknown token pos '${tok.pos}' for word '${tok.text}'`);
          }
        }
        if (tok.role && !validCategoryKeys.has(tok.role)) {
          errors.push(`${file} [${line.lineId}]: unknown token role '${tok.role}' for word '${tok.text}'`);
        }
      }

      if (line.groups) {
        for (const grp of line.groups) {
          totalGroupsChecked++;
          if (grp.type === 'verb-group') {
            if (grp.time && grp.aspect) {
              const tenseKey = `${grp.time}-${grp.aspect}`;
              if (!validCategoryKeys.has(tenseKey)) {
                errors.push(`${file} [${line.lineId}]: unknown tense key '${tenseKey}'`);
              }
            }
          } else if (grp.type === 'pattern' && grp.key) {
            if (!validCategoryKeys.has(grp.key)) {
              errors.push(`${file} [${line.lineId}]: unknown pattern key '${grp.key}'`);
            }
          }
        }
      }
    }
  } catch (err) {
    errors.push(`Failed to parse annotation file ${file}: ${err.message}`);
  }
}

console.log(`✓ Inspected ${totalTokensChecked} tokens and ${totalGroupsChecked} groups across data files.`);

if (errors.length > 0) {
  console.error('\n❌ GRAMMAR BUILD GATE FAILED with errors:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log('\n✅ ALL GRAMMAR INTEGRITY & TAXONOMY CHECKS PASSED STRICTLY.\n');
process.exit(0);
