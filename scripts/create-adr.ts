#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

// Get the title from command line arguments
const title = process.argv[2];

if (!title) {
  console.error('Usage: npm run adr:new "Your ADR title here"');
  console.error('Example: npm run adr:new "Use TypeScript for type safety"');
  process.exit(1);
}

try {
  // Ensure docs/adr directory exists
  const adrDir = path.join(__dirname, '..', 'docs', 'adr');
  if (!fs.existsSync(adrDir)) {
    fs.mkdirSync(adrDir, { recursive: true });
  }

  // Get the next ADR number
  const existingADRs = fs
    .readdirSync(adrDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const match = file.match(/^(\d{4})-/);
      return match ? parseInt(match[1]) : 0;
    })
    .sort((a, b) => b - a);

  const nextNumber = existingADRs.length > 0 ? existingADRs[0] + 1 : 1;
  const adrNumber = nextNumber.toString().padStart(4, '0');

  // Create ADR filename and content
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const filename = `${adrNumber}-${slug}.md`;
  const filepath = path.join(adrDir, filename);

  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);

  const content = `# ${parseInt(adrNumber, 10)}. ${title}\n\nDate: ${dateStr}\n\n## Status\n\nProposed\n\n## Context\n\n\n## Decision\n\n\n## Consequences\n\n`;

  if (fs.existsSync(filepath)) {
    console.error(`ADR already exists: ${filename}`);
    process.exit(1);
  }

  fs.writeFileSync(filepath, content, { encoding: 'utf8' });

  // Update README table of contents
  const readmePath = path.join(adrDir, 'README.md');
  let readme = '';
  if (fs.existsSync(readmePath)) {
    readme = fs.readFileSync(readmePath, 'utf8');
    // Append new entry if not present
    const linkLine = `- [${parseInt(adrNumber, 10)}. ${title}](${filename})`;
    if (!readme.includes(linkLine)) {
      readme = readme.trimEnd() + `\n${linkLine}\n`;
      fs.writeFileSync(readmePath, readme, 'utf8');
    }
  } else {
    const initial = `# Table of Contents\n\n- [${parseInt(adrNumber, 10)}. ${title}](${filename})\n`;
    fs.writeFileSync(readmePath, initial, 'utf8');
  }

  console.log(`\n✅ ADR created: docs/adr/${filename}`);
  console.log(`📝 Edit the file to add details.`);
} catch (error) {
  console.error('❌ Error creating ADR:', error instanceof Error ? error.message : String(error));
  process.exit(1);
}
