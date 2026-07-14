import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scripts = path.dirname(fileURLToPath(import.meta.url));
for (const audit of ["audit-routes.mjs", "audit-static.mjs"]) {
  const result = spawnSync(process.execPath, [path.join(scripts, audit)], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
