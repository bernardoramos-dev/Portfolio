import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skipDirectories = new Set(["node_modules", ".agents", "dist", "screenshots", "__pycache__"]);
const sourceExtensions = new Set([".html", ".css", ".js", ".mjs"]);
const sources = [];

const walk = (directory) => {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    if (item.isDirectory() && skipDirectories.has(item.name)) continue;
    const absolute = path.join(directory, item.name);
    if (item.isDirectory()) walk(absolute);
    else if (sourceExtensions.has(path.extname(item.name).toLowerCase())) sources.push(absolute);
  }
};
walk(root);

const patterns = {
  ".html": [/(?:src|href|poster)\s*=\s*["']([^"'<>]+)["']/gi, /url\(\s*["']?([^)'"\s]+)["']?\s*\)/gi],
  ".css": [/url\(\s*["']?([^)'"\s]+)["']?\s*\)/gi],
  ".js": [/(?:from\s+|import\s*)["']([^"']+)["']/g],
  ".mjs": [/(?:from\s+|import\s*)["']([^"']+)["']/g]
};

const ignoredPrefixes = ["#", "%23", "http:", "https:", "mailto:", "tel:", "data:", "blob:", "javascript:", "about:", "node:", "//"];
const missing = [];
let checked = 0;

for (const source of sources) {
  const extension = path.extname(source).toLowerCase();
  const contents = fs.readFileSync(source, "utf8");
  for (const pattern of patterns[extension] || []) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(contents))) {
      const raw = match[1].trim();
      if (!raw || ignoredPrefixes.some((prefix) => raw.toLowerCase().startsWith(prefix))) continue;
      if (raw.includes("${") || raw.includes("{{")) continue;
      if ((extension === ".js" || extension === ".mjs") && !raw.startsWith(".") && !raw.startsWith("/")) continue;
      const clean = raw.split("#")[0].split("?")[0];
      if (!clean || !path.extname(clean)) continue;
      let decoded = clean;
      try { decoded = decodeURIComponent(clean); } catch (_) {}
      const absolute = decoded.startsWith("/")
        ? path.join(root, decoded.replace(/^\/+/, ""))
        : path.resolve(path.dirname(source), decoded);
      checked += 1;
      if (!fs.existsSync(absolute)) {
        missing.push({
          source: path.relative(root, source).split(path.sep).join("/"),
          reference: raw
        });
      }
    }
  }
}

const uniqueMissing = [...new Map(missing.map((item) => [`${item.source}|${item.reference}`, item])).values()];
console.log(`Static source files: ${sources.length}`);
console.log(`Local references checked: ${checked}`);
console.log(`Missing local references: ${uniqueMissing.length}`);
for (const item of uniqueMissing) console.error(`[MISSING] ${item.source}: ${item.reference}`);
if (uniqueMissing.length) process.exitCode = 1;
else console.log("Static reference audit: PASS");
