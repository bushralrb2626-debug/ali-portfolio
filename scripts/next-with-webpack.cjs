const { spawn } = require("child_process");
const path = require("path");

const nextBin = path.join(
  __dirname,
  "..",
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);
const args = process.argv.slice(2);
if (args[0] === "build" && !args.includes("--webpack")) {
  args.push("--webpack");
}
const child = spawn(process.execPath, [nextBin, ...args], {
  stdio: "inherit",
  windowsHide: true,
});
child.on("exit", (code) => process.exit(code ?? 1));
