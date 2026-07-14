import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "./data/projects.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stripUrl = (value) => String(value || "").split("#")[0].split("?")[0];
const references = [];

for (const project of projects) {
  for (const [kind, value] of [
    ["cover", project.cover],
    ["atmosphere", project.atmosphere],
    ["previewVideo", project.previewVideo],
    ["experienceUrl", project.experienceUrl],
    ["previewUrl", project.previewUrl]
  ]) {
    if (value) references.push({ project: project.id, kind, value });
  }
  for (const route of project.secondaryExperiences || []) {
    references.push({
      project: project.id,
      kind: `secondary:${route.label}`,
      value: route.url
    });
  }
}

const results = references.map((reference) => {
  const relative = stripUrl(reference.value);
  const absolute = path.resolve(root, relative);
  const exists = fs.existsSync(absolute);
  return { ...reference, exists, relative };
});

const missing = results.filter((result) => !result.exists);
console.log(`Projects: ${projects.length}`);
console.log(`References checked: ${results.length}`);
console.log(`Missing references: ${missing.length}`);

if (missing.length) {
  for (const result of missing) {
    console.error(`[MISSING] ${result.project} ${result.kind}: ${result.value}`);
  }
  process.exitCode = 1;
} else {
  console.log("Route and asset audit: PASS");
}
