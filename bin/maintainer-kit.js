#!/usr/bin/env node

import path from "node:path";
import process from "node:process";

import { explainKit, initKit, parseCliArgs, usage } from "../src/scaffold.js";

async function main() {
  const args = parseCliArgs(process.argv.slice(2));

  if (args.help || !args.command) {
    console.log(usage());
    return;
  }

  if (args.command === "explain") {
    console.log(explainKit());
    return;
  }

  if (args.command !== "init") {
    throw new Error(`Unknown command: ${args.command}`);
  }

  const targetDir = path.resolve(process.cwd(), args.targetDir ?? ".");
  const repoName = args.repoName ?? path.basename(targetDir);
  const maintainerName = args.maintainerName ?? "Project Owner";

  const result = await initKit({
    dryRun: args.dryRun,
    force: args.force,
    maintainerName,
    preset: args.preset,
    repoName,
    targetDir,
  });

  console.log(
    `${args.dryRun ? "Previewed" : "Initialized"} OSS Maintainer Kit in ${targetDir}`,
  );
  console.log(`Preset: ${args.preset}`);
  console.log(`${args.dryRun ? "Would create" : "Created"}: ${result.created.length}`);
  console.log(`Skipped: ${result.skipped.length}`);

  if (result.created.length > 0) {
    console.log("");
    console.log(args.dryRun ? "Files that would be created:" : "Files created:");
    for (const entry of result.created) {
      console.log(`- ${entry}`);
    }
  }

  if (result.skipped.length > 0) {
    console.log("");
    console.log("Skipped existing files:");
    for (const entry of result.skipped) {
      console.log(`- ${entry}`);
    }
  }

  console.log("");
  console.log(
    args.dryRun
      ? "This was a preview only. No files were written."
      : "This added repository setup files, not application code.",
  );
  console.log(
    args.dryRun
      ? "First file to read after you apply the kit: docs/START_HERE.md"
      : "Start with: docs/START_HERE.md",
  );
  console.log("");
  console.log("Suggested next steps:");
  console.log("1. Read docs/START_HERE.md for a plain-English guide to each file.");
  console.log("2. Edit AGENTS.md so reviews match your repo and risk areas.");
  console.log("3. Commit the files you want to keep.");
  console.log("4. Add OPENAI_API_KEY only if you want the optional Codex GitHub Actions.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
