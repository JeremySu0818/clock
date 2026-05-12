const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const releaseDir = path.resolve(root, "release");
const relativeReleaseDir = path.relative(root, releaseDir);

if (relativeReleaseDir.startsWith("..") || path.isAbsolute(relativeReleaseDir)) {
  throw new Error(`Refusing to remove release directory outside project: ${releaseDir}`);
}

fs.rmSync(releaseDir, { recursive: true, force: true });
