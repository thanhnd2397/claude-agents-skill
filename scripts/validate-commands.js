#!/usr/bin/env node
/**
 * validate-commands.js
 *
 * Checks the Claude Code slash commands in .claude/commands/.
 *
 * Checks (errors block CI):
 *   - Every command has a top-level 'description' in its frontmatter
 *   - Command frontmatter is valid YAML, not merely splittable
 *
 * Exit codes: 0 = all clear, 1 = one or more errors
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// The same frontmatter-validity rules validate-skills applies to SKILL.md.
// YAML validity is checked because Claude Code parses frontmatter when the
// command is loaded.
const { frontmatterYamlErrors, parseFrontmatter } = require(path.join(__dirname, 'lib', 'skill-lint.js'));

const ROOT = path.resolve(__dirname, '..');
const COMMANDS_DIR = path.join(ROOT, '.claude', 'commands');

function main() {
  const files = fs.existsSync(COMMANDS_DIR)
    ? fs.readdirSync(COMMANDS_DIR).filter(f => f.endsWith('.md')).sort()
    : [];

  let errors = 0;
  console.log('Checking Claude command frontmatter...');

  for (const file of files) {
    const stem = path.basename(file, '.md');
    let content;
    try {
      content = fs.readFileSync(path.join(COMMANDS_DIR, file), 'utf8');
    } catch (e) {
      console.log(`  ✗  ${stem} — cannot read file: ${e.message}`);
      errors++;
      continue;
    }

    const problems = [...frontmatterYamlErrors(content)];
    if (problems.length === 0 && parseFrontmatter(content)?.description == null) {
      problems.push('missing or malformed description');
    }

    if (problems.length === 0) {
      console.log(`  ✓  ${stem}`);
      continue;
    }
    console.log(`  ✗  ${stem}`);
    for (const message of problems) {
      console.log(`       ${message}`);
      errors++;
    }
  }

  const status = errors > 0 ? 'FAILED' : 'PASSED';
  console.log(`\n${files.length} commands checked — ${errors} error(s) — ${status}`);

  if (errors > 0) process.exit(1);
}

main();
