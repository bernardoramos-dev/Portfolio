import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist");

if (path.dirname(outDir) !== root || path.basename(outDir) !== "dist") {
  throw new Error(`Unsafe build output: ${outDir}`);
}

const audit = spawnSync(process.execPath, [path.join(root, "scripts", "audit.mjs")], {
  cwd: root,
  stdio: "inherit"
});
if (audit.status !== 0) process.exit(audit.status || 1);

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const entries = [
  "index.html",
  "robots.txt",
  "sitemap.xml",
  "_headers",
  "vercel.json",
  "assets",
  "styles",
  "scripts",
  "demos"
];

const excludedNames = new Set([
  "audit-routes.mjs",
  "audit-static.mjs",
  "audit.mjs",
  "smoke-http.mjs",
  "build.mjs",
  "cover-legacy.webp"
]);

const excludedRelative = new Set([
  "assets/Asset 1.mp4",
  "assets/Asset 2.mp4",
  "assets/Asset 3.mp4",
  "assets/Asset 4.mp4",
  "assets/Asset 5.mp4",
  "assets/hero/Gen-4 Turbo - Create a seamless 8-second looping cinematic abstract background video from this image (online-video-cutter.com).mp4",
  "assets/hero/hero-loop.mp4",
  "assets/video/fundo.mp4",
  "demos/mainstage/assets/videos/logo-rotating.mp4",
  "demos/tecksart/assets/videos/vecteezy_glowing-shinny-particles-stars-animation-on-black-background_3538909.mp4"
]);

const filter = (source) => {
  const relative = path.relative(root, source);
  if (!relative) return true;
  const normalized = relative.split(path.sep).join("/");
  const parts = relative.split(path.sep);
  if (parts.includes("node_modules") || parts.includes(".agents") || parts.includes("screenshots")) return false;
  if (excludedRelative.has(normalized)) return false;
  if (path.basename(source) === "atmosphere.png" && normalized.startsWith("assets/projects/")) return false;
  if (normalized.startsWith("assets/brand/") && normalized !== "assets/brand/favicon.svg" && normalized !== "assets/brand/og-cover.jpg") return false;
  return !excludedNames.has(path.basename(source));
};

for (const entry of entries) {
  const source = path.join(root, entry);
  if (!fs.existsSync(source)) throw new Error(`Required build entry is missing: ${entry}`);
  fs.cpSync(source, path.join(outDir, entry), { recursive: true, filter });
}

const files = [];
const walk = (directory) => {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, item.name);
    if (item.isDirectory()) walk(absolute);
    else files.push(absolute);
  }
};
walk(outDir);

const totalBytes = files.reduce((sum, file) => sum + fs.statSync(file).size, 0);
console.log(`Build output: ${outDir}`);
console.log(`Files: ${files.length}`);
console.log(`Size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
