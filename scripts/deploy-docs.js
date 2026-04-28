import { spawnSync } from "node:child_process";

const commitMessage = [
  "Deploy Docusaurus site",
  "",
  "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>",
].join("\n");

runNpm(["run", "docs:build"]);
runNpm([
  "exec",
  "--",
  "gh-pages",
  "-d",
  "website/build",
  "-b",
  "gh-pages",
  "-m",
  commitMessage,
]);

function runNpm(args) {
  const npmCli = process.env.npm_execpath;
  if (!npmCli) {
    throw new Error("Run this script with npm so npm_execpath is available.");
  }

  const result = spawnSync(process.execPath, [npmCli, ...args], { stdio: "inherit" });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
