const fs = require("node:fs");
const path = require("node:path");

const electronPath = require("electron");

if (typeof electronPath !== "string" || !fs.existsSync(electronPath)) {
  throw new Error("Electron executable could not be resolved.");
}

const electronPackageDir = path.dirname(require.resolve("electron"));
const pathFile = path.join(electronPackageDir, "path.txt");

if (!fs.existsSync(pathFile)) {
  throw new Error("Electron path.txt was not created.");
}
