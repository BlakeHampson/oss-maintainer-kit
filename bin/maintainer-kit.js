#!/usr/bin/env node

import path from "node:path";
import process from "node:process";

import { explainKit, initKit, parseCliArgs, usage } from "../src/scaffold.js";
import { checkDocs } from "../src/docs.js";
import { syncLabels } from "../src/labels.js";

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

  if (args.command === "sync-labels") {
    if (!args.targetRepo) {
      throw new Error("sync-labels requires an OWNER/REPO target");
    }

    const result = await syncLabels({
      dryRun: args.dryRun,
      manifestName: args.manifestName,
      repo: args.targetRepo,
    });

    console.log(`Manifest: ${result.manifest.name}@${result.manifest.version}`);
    console.log(`Repository: ${result.repo}`);
    console.log(`${args.dryRun ? "Planned changes" : "Applied changes"}: ${result.actionable.length}`);

    if (result.operations.length > 0) {
      console.log("");
      for (const operation of result.operations) {
        if (operation.type === "noop") {
          console.log(`- keep ${operation.label.name}`);
          continue;
        }

        console.log(`- ${operation.type} ${operation.label.name}`);
      }
    }

    if (args.dryRun) {
      console.log("");
      console.log("Dry run only. No labels were changed.");
    } else if (result.actionable.length > 0) {
      console.log("");
      console.log("Labels synced.");
    }

    return;
  }

  if (args.command === "check-docs") {
    const rootDir = path.resolve(process.cwd(), args.targetDir ?? ".");
    const result = await checkDocs({ rootDir });

    console.log(`Checked markdown files: ${result.filesChecked}`);
    console.log(`Root: ${rootDir}`);

    if (result.issues.length === 0) {
      console.log("");
      console.log("No broken local Markdown links or anchors found.");
      return;
    }

    console.log("");
    console.log(`Issues found: ${result.issues.length}`);
    for (const issue of result.issues) {
      const relativePath = path.relative(rootDir, issue.filePath) || path.basename(issue.filePath);
      console.log(`- ${relativePath}:${issue.line} [${issue.code}] ${issue.message}`);
    }

    process.exitCode = 1;
    return;
  }

  if (args.command !== "init") {
    throw new Error(`Unknown command: ${args.command}`);
  }

  if (args.diff && !args.dryRun) {
    throw new Error("--diff can only be used with --dry-run");
  }

  const targetDir = path.resolve(process.cwd(), args.targetDir ?? ".");
  const repoName = args.repoName ?? path.basename(targetDir);
  const maintainerName = args.maintainerName ?? "Project Owner";

  const result = await initKit({
    bundle: args.bundle,
    dryRun: args.dryRun,
    force: args.force,
    maintainerName,
    preset: args.preset,
    repoName,
    showDiff: args.diff,
    targetDir,
  });

  console.log(
    `${args.dryRun ? "Previewed" : "Initialized"} OSS Maintainer Kit in ${targetDir}`,
  );
  console.log(`Preset: ${args.preset}`);
  console.log(`Bundle: ${args.bundle}`);
  console.log(`${args.dryRun ? "Would write" : "Written"}: ${result.created.length}`);
  console.log(`Create: ${result.toCreate.length}`);
  console.log(`Update: ${result.toUpdate.length}`);
  console.log(`Unchanged: ${result.unchanged.length}`);
  console.log(`Skipped: ${result.skipped.length}`);

  if (result.created.length > 0) {
    console.log("");
    console.log(args.dryRun ? "Files that would be written:" : "Files written:");
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

  if (args.dryRun && args.diff && result.diffs.length > 0) {
    console.log("");
    console.log("Diff preview:");
    for (const { diff } of result.diffs) {
      console.log("");
      console.log(diff);
    }
  }

  console.log("");
  console.log(
    args.dryRun
      ? "This was a preview only. No files were written."
      : "This added repository setup files, not application code.",
  );
  if (args.dryRun && result.skipped.length > 0 && !args.force) {
    console.log(
      "Use --force with --dry-run --diff if you want to preview overwrites of existing files.",
    );
  }
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
