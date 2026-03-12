#!/usr/bin/env node

import path from "node:path";
import process from "node:process";

import { initKit, parseCliArgs, usage } from "../src/scaffold.js";

async function main() {
  const args = parseCliArgs(process.argv.slice(2));

  if (args.help || !args.command) {
    console.log(usage());
    return;
  }

  if (args.command !== "init") {
    throw new Error(`Unknown command: ${args.command}`);
  }

  const targetDir = path.resolve(process.cwd(), args.targetDir ?? ".");
  const repoName = args.repoName ?? path.basename(targetDir);
  const maintainerName = args.maintainerName ?? "Primary Maintainer";

  const result = await initKit({
    dryRun: args.dryRun,
    force: args.force,
    maintainerName,
    repoName,
    targetDir,
  });

  console.log(
    `${args.dryRun ? "Previewed" : "Initialized"} OSS Maintainer Kit in ${targetDir}`,
  );
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
  console.log("Next steps:");
  console.log("1. Review AGENTS.md and tailor it to your repository.");
  console.log("2. Add OPENAI_API_KEY to repository secrets if you want the Codex workflows.");
  console.log("3. Commit the generated files and enable the workflows you want to use.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
