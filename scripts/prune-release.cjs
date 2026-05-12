const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const releaseDir = path.resolve(root, "release");

if (!fs.existsSync(releaseDir)) {
  throw new Error("Release directory was not created.");
}

const isInsideRelease = (candidate) => {
  const relative = path.relative(releaseDir, candidate);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
};

for (const entry of fs.readdirSync(releaseDir, { withFileTypes: true })) {
  const fullPath = path.resolve(releaseDir, entry.name);
  const shouldKeep = entry.isFile() && /^LiquidGlassClock-.*\.exe$/u.test(entry.name);

  if (!shouldKeep) {
    if (!isInsideRelease(fullPath)) {
      throw new Error(`Refusing to remove artifact outside release directory: ${fullPath}`);
    }

    fs.rmSync(fullPath, { recursive: true, force: true });
  }
}

const portableExecutables = fs
  .readdirSync(releaseDir)
  .filter((fileName) => /^LiquidGlassClock-.*\.exe$/u.test(fileName));

if (portableExecutables.length !== 1) {
  throw new Error(
    `Expected one portable executable, found ${portableExecutables.length}: ${portableExecutables.join(", ")}`
  );
}

console.log(`Portable executable: release/${portableExecutables[0]}`);
