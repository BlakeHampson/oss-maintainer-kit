import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesRoot = path.resolve(__dirname, "..", "templates");
export const templateRoot = path.resolve(templatesRoot, "base");
const commandName = "oss-maintainer-kit";

export const presets = {
  base: {
    description: "Full starter with issue templates, PR template, and both optional Codex workflows.",
    excludedPaths: [],
    templateRoots: [templateRoot],
  },
  "first-public-repo": {
    description:
      "Lighter starter for a newly public or solo-built repo. Keeps the review workflow, leaves out release prep.",
    excludedPaths: [".github/workflows/codex-release-prep.yml"],
    templateRoots: [
      templateRoot,
      path.resolve(templatesRoot, "presets", "first-public-repo"),
    ],
  },
};

function formatPresetList() {
  return Object.entries(presets)
    .map(([name, config]) => `  - ${name}: ${config.description}`)
    .join("\n");
}

function getPresetConfig(presetName) {
  const preset = presets[presetName];

  if (!preset) {
    throw new Error(
      `Unknown preset: ${presetName}\n\nAvailable presets:\n${formatPresetList()}`,
    );
  }

  return preset;
}

function normalizeRelativePath(relativePath) {
  return relativePath.split(path.sep).join("/");
}

export function usage() {
  return `OSS Maintainer Kit

Turn a working repository into a public project that is easier to review,
explain, and contribute to.

Usage:
  ${commandName} explain
  ${commandName} init [target-directory] [--repo-name name] [--maintainer "Name"] [--preset name] [--force] [--dry-run]

Presets:
${formatPresetList()}

Examples:
  ${commandName} explain
  ${commandName} init .
  ${commandName} init ../my-repo --preset first-public-repo --dry-run
  ${commandName} init ../my-repo --repo-name my-repo --maintainer "Jane Doe"
  ${commandName} init ../my-repo --dry-run
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

Presets:
${formatPresetList()}

What it does not do:
- it does not change your application code
- it does not force you to use every workflow
- it does not replace tests or human judgment

If you are new to GitHub or open source, start with:
1. ${commandName} init ../my-repo --preset first-public-repo --dry-run
2. ${commandName} init ../my-repo --repo-name my-repo --maintainer "Your Name" --preset first-public-repo
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
    preset: "base",
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

    if (value === "--preset") {
      if (!argv[index + 1]) {
        throw new Error("--preset requires a value");
      }
      result.preset = argv[index + 1];
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
  createdSet,
  dryRun,
  excludedPaths,
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
    const relativeTargetPath = normalizeRelativePath(path.relative(baseTarget, targetPath));

    if (excludedPaths.has(relativeTargetPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      await copyTemplateDirectory({
        baseTarget,
        created,
        currentSource: sourcePath,
        currentTarget: targetPath,
        createdSet,
        dryRun,
        excludedPaths,
        force,
        skipped,
        tokens,
      });
      continue;
    }

    const alreadyCreatedInRun = createdSet.has(relativeTargetPath);

    if (!alreadyCreatedInRun && !force && (await pathExists(targetPath))) {
      skipped.push(relativeTargetPath);
      continue;
    }

    const rawContent = await readFile(sourcePath, "utf8");
    const rendered = replaceTokens(rawContent, tokens);

    if (!dryRun) {
      await mkdir(path.dirname(targetPath), { recursive: true });
      await writeFile(targetPath, rendered, "utf8");
    }

    if (!alreadyCreatedInRun) {
      created.push(relativeTargetPath);
      createdSet.add(relativeTargetPath);
    }
  }
}

export async function initKit({
  dryRun = false,
  force = false,
  maintainerName,
  preset = "base",
  repoName,
  targetDir,
}) {
  const created = [];
  const createdSet = new Set();
  const skipped = [];
  const presetConfig = getPresetConfig(preset);

  const tokens = {
    "__MAINTAINER_NAME__": maintainerName,
    "__PROJECT_NAME__": repoName,
  };

  if (!dryRun) {
    await mkdir(targetDir, { recursive: true });
  }

  for (const currentTemplateRoot of presetConfig.templateRoots) {
    await copyTemplateDirectory({
      baseTarget: targetDir,
      created,
      currentSource: currentTemplateRoot,
      currentTarget: targetDir,
      createdSet,
      dryRun,
      excludedPaths: new Set(presetConfig.excludedPaths),
      force,
      skipped,
      tokens,
    });
  }

  return { created, skipped };
}
