import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "./data/projects.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = new URL(process.argv[2] || "http://127.0.0.1:8078/");
const routes = new Set(["index.html"]);

const walkHtml = (directory) => {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    if (["node_modules", ".agents", "dist", "screenshots", "__pycache__"].includes(item.name)) continue;
    const absolute = path.join(directory, item.name);
    if (item.isDirectory()) walkHtml(absolute);
    else if (item.name.endsWith(".html")) routes.add(path.relative(root, absolute).split(path.sep).join("/"));
  }
};
walkHtml(path.join(root, "demos"));

const assets = new Set([
  "scripts/main.js",
  "styles/components.css",
  "assets/vendor/gsap.min.js",
  "assets/vendor/lenis.min.js",
  "assets/vendor/motion.min.js"
]);

for (const project of projects) {
  for (const value of [project.cover, project.atmosphere, project.previewVideo]) if (value) assets.add(value);
  for (const value of [project.experienceUrl, project.previewUrl]) if (value) routes.add(value.split("#")[0]);
  for (const route of project.secondaryExperiences || []) routes.add(route.url.split("#")[0]);
}

const checks = [
  ...[...routes].sort().map((value) => ({ kind: "route", value })),
  ...[...assets].sort().map((value) => ({ kind: "asset", value }))
];

const failures = [];
let totalMs = 0;
for (const check of checks) {
  const url = new URL(check.value.replace(/^\/+/, ""), base);
  const started = Date.now();
  try {
    const response = await fetch(url, { method: check.kind === "asset" ? "HEAD" : "GET", redirect: "manual" });
    const duration = Date.now() - started;
    totalMs += duration;
    const type = response.headers.get("content-type") || "";
    const okType = check.kind !== "route" || type.includes("text/html");
    const ok = response.status >= 200 && response.status < 400 && okType;
    console.log(`${ok ? "PASS" : "FAIL"}\t${response.status}\t${duration}ms\t${check.value}\t${type}`);
    if (!ok) failures.push({ ...check, status: response.status, type });
  } catch (error) {
    failures.push({ ...check, error: error.message });
    console.error(`FAIL\tERR\t${check.value}\t${error.message}`);
  }
}

console.log(`HTTP checks: ${checks.length}`);
console.log(`HTTP failures: ${failures.length}`);
console.log(`Aggregate response time: ${totalMs}ms`);
if (failures.length) process.exitCode = 1;
else console.log("HTTP smoke test: PASS");
