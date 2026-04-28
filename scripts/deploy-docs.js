import { spawnSync } from "node:child_process";

const commitMessage = [
  "Deploy Docusaurus site",
  "",
  "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>",
].join("\n");

run("npm", ["run", "docs:build"]);
run("npx", [
  "gh-pages",
  "-d",
  "website/build",
  "-b",
  "gh-pages",
  "-m",
  commitMessage,
]);

function run(command, args) {
  const executable = process.platform === "win32" ? `${command}.cmd` : command;
  const result = spawnSync(executable, args, { stdio: "inherit" });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
