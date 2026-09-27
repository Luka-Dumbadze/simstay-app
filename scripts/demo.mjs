// `npm run demo`: load .env.demo, (re)build if the production build is missing or stale, start on :3000.
// Flags: --build-only (build, then exit), --force (always rebuild).
import { spawnSync, spawn } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { networkInterfaces } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const nextBin = join(root, "node_modules/next/dist/bin/next");

const env = { ...process.env };
for (const raw of readFileSync(join(root, ".env.demo"), "utf8").split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  const i = line.indexOf("=");
  if (i > 0 && env[line.slice(0, i)] === undefined) env[line.slice(0, i)] = line.slice(i + 1);
}
env.NODE_ENV = "production";
env.NEXT_TELEMETRY_DISABLED = "1";

function newestMtime(dir) {
  let max = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    max = Math.max(max, entry.isDirectory() ? newestMtime(p) : statSync(p).mtimeMs);
  }
  return max;
}

const buildId = join(root, ".next/BUILD_ID");
const sources = Math.max(
  newestMtime(join(root, "src")),
  ...["package.json", "tailwind.config.ts", "next.config.mjs", "postcss.config.mjs"].map((f) => statSync(join(root, f)).mtimeMs),
);
const stale = !existsSync(buildId) || statSync(buildId).mtimeMs < sources;

if (args.has("--force") || stale) {
  console.log(`▸ SimuStay: production build (${existsSync(buildId) ? "sources changed" : "first run"})…`);
  const r = spawnSync(process.execPath, [nextBin, "build"], { cwd: root, env, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
if (args.has("--build-only")) process.exit(0);

const lan = Object.values(networkInterfaces()).flat().find((n) => n && n.family === "IPv4" && !n.internal)?.address;
console.log(`▸ SimuStay demo  · OFFLINE_DEMO=${env.OFFLINE_DEMO}`);
console.log(`  desktop  http://localhost:3000`);
console.log(`  phone    http://${lan ?? "<laptop-ip>"}:3000/m/hk`);
console.log(`  hotkeys  Ctrl+Shift+R reset · B before check-out · O online/offline · A autopilot · 1/2 layout`);
const child = spawn(process.execPath, [nextBin, "start", "-p", "3000", "-H", "0.0.0.0"], { cwd: root, env, stdio: "inherit" });
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
child.on("exit", (code) => process.exit(code ?? 0));
