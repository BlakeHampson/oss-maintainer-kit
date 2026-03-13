import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const templateRoot = path.resolve(__dirname, "..", "templates", "base");

export function usage() {
  return `OSS Maintainer Kit

Turn a working repository into a public project that is easier to review,
explain, and contribute to.

Usage:
  maintainer-kit explain
  maintainer-kit init [target-directory] [--repo-name name] [--maintainer "Name"] [--force] [--dry-run]

Examples:
  maintainer-kit explain
  maintainer-kit init .
  maintainer-kit init ../my-repo --repo-name my-repo --maintainer "Jane Doe"
  maintainer-kit init ../my-repo --dry-run
`;
}

export function explainKit() {
  return `OSS Maintainer Kit helps you add the boring but important repository files
that make a codebase easier to share in public.

What it adds:
- docs/START_HERE.md: the first file to read after setup
- AGENTS.md: instructions for AI reviewers and future contributors
- issue templates: structured bug reports and feature requests
- pull request template: a simple way to explain changes
- codex-pr-review.yml: an optional GitHub Action that asks Codex to review pull requests
- codex-release-prep.yml: an optional GitHub Action that drafts release notes and a checklist

What it does not do:
- it does not change your application code
- it does not force you to use every workflow
- it does not replace tests or human judgment

If you are new to GitHub or open source, start with:
1. maintainer-kit init ../my-repo --dry-run
2. maintainer-kit init ../my-repo --repo-name my-repo --maintainer "Your Name"
3. open docs/START_HERE.md in the generated repo

You can safely ignore the release workflow until you actually start shipping versions.
`;
}

export function parseCliArgs(argv) {
  const result = {
    command: argv[0],
    dryRun: false,
    force: false,
    help: false,
    maintainerName: undefined,
    repoName: undefined,
    targetDir: undefined,
  };

  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    result.help = true;
    return result;
  }

  if (result.command === "explain") {
    if (argv.length > 1) {
      throw new Error(`Unexpected argument: ${argv[1]}`);
    }
    return result;
  }

  let positionalCount = 0;

  for (let index = 1; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--force") {
      result.force = true;
      continue;
    }

    if (value === "--dry-run") {
      result.dryRun = true;
      continue;
    }

    if (value === "--repo-name") {
      if (!argv[index + 1]) {
        throw new Error("--repo-name requires a value");
      }
      result.repoName = argv[index + 1];
      index += 1;
      continue;
    }

    if (value === "--maintainer") {
      if (!argv[index + 1]) {
        throw new Error("--maintainer requires a value");
      }
      result.maintainerName = argv[index + 1];
      index += 1;
      continue;
    }

    if (value.startsWith("--")) {
      throw new Error(`Unknown option: ${value}`);
    }

    if (positionalCount === 0) {
      result.targetDir = value;
      positionalCount += 1;
      continue;
    }

    throw new Error(`Unexpected argument: ${value}`);
  }

  return result;
}

export function replaceTokens(content, tokens) {
  return Object.entries(tokens).reduce(
    (current, [key, value]) => current.replaceAll(key, value),
    content,
  );
}

async function pathExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function copyTemplateDirectory({
  baseTarget,
  created,
  currentSource,
  currentTarget,
  dryRun,
  force,
  skipped,
  tokens,
}) {
  if (!dryRun) {
    await mkdir(currentTarget, { recursive: true });
  }
  const entries = await readdir(currentSource, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(currentSource, entry.name);
    const targetPath = path.join(currentTarget, entry.name);

    if (entry.isDirectory()) {
      await copyTemplateDirectory({
        baseTarget,
        created,
        currentSource: sourcePath,
        currentTarget: targetPath,
        dryRun,
        force,
        skipped,
        tokens,
      });
      continue;
    }

    if (!force && (await pathExists(targetPath))) {
      skipped.push(path.relative(baseTarget, targetPath));
      continue;
    }

    const rawContent = await readFile(sourcePath, "utf8");
    const rendered = replaceTokens(rawContent, tokens);

    if (!dryRun) {
      await mkdir(path.dirname(targetPath), { recursive: true });
      await writeFile(targetPath, rendered, "utf8");
    }

    created.push(path.relative(baseTarget, targetPath));
  }
}

export async function initKit({
  dryRun = false,
  force = false,
  maintainerName,
  repoName,
  targetDir,
}) {
  const created = [];
  const skipped = [];

  const tokens = {
    "__MAINTAINER_NAME__": maintainerName,
    "__PROJECT_NAME__": repoName,
  };

  if (!dryRun) {
    await mkdir(targetDir, { recursive: true });
  }

  await copyTemplateDirectory({
    baseTarget: targetDir,
    created,
    currentSource: templateRoot,
    currentTarget: targetDir,
    dryRun,
    force,
    skipped,
    tokens,
  });

  return { created, skipped };
}
