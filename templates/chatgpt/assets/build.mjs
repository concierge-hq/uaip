/**
 * Auto-discovers all HTML files in entrypoints/ and builds each one.
 * CSS is included via <link> in the HTML files.
 * 
 * Mapping: entrypoints/foo.html -> dist/entrypoints/foo.html
 */

import { execSync } from "child_process";
import fg from "fast-glob";
import fs from "fs";
import path from "path";

const entryFiles = fg.sync("entrypoints/*.html");

if (entryFiles.length === 0) {
  console.log("No HTML files in entrypoints/");
  process.exit(0);
}

console.log(`\nBuilding ${entryFiles.length} widgets:\n`);

fs.mkdirSync("dist/entrypoints", { recursive: true });

let success = 0;
let failed = 0;

for (const entryFile of entryFiles) {
  const basename = path.basename(entryFile, ".html");
  process.stdout.write(`   ${basename}... `);
  
  try {
    execSync(`npx vite build`, { 
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, ENTRY_FILE: entryFile, OUTPUT_NAME: basename }
    });
    console.log("✓");
    success++;
  } catch (err) {
    console.log("✗");
    console.error(`      ${err.stderr?.toString().trim() || err.message}`);
    failed++;
  }
}

console.log(`\n${success} built, ${failed} failed -> dist/entrypoints/\n`);
if (failed > 0) process.exit(1);
