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
  "javascript-library": {
    description:
      "Starter for JavaScript or TypeScript packages where API stability, docs, and publish safety matter.",
    excludedPaths: [],
    templateRoots: [
      templateRoot,
      path.resolve(templatesRoot, "presets", "javascript-library"),
    ],
  },
  "python-package": {
    description:
      "Starter for Python packages with guidance around packaging, tests, examples, and release safety.",
    excludedPaths: [],
    templateRoots: [
      templateRoot,
      path.resolve(templatesRoot, "presets", "python-package"),
    ],
  },
  "nextjs-app": {
    description:
      "Starter for Next.js apps where routing, rendering mode, env vars, and deployment behavior need explicit review guidance.",
    excludedPaths: [],
    templateRoots: [
      templateRoot,
      path.resolve(templatesRoot, "presets", "nextjs-app"),
    ],
  },
  "python-service": {
    description:
      "Starter for Python services or APIs where config, deploy behavior, migrations, and observability matter more than packaging.",
    excludedPaths: [],
    templateRoots: [
      templateRoot,
      path.resolve(templatesRoot, "presets", "python-service"),
    ],
  },
  "docs-heavy": {
    description:
      "Starter for repositories where written guidance, examples, and contributor clarity matter more than app code.",
    excludedPaths: [],
    templateRoots: [
      templateRoot,
      path.resolve(templatesRoot, "presets", "docs-heavy"),
    ],
  },
  "security-sensitive-repo": {
    description:
      "Starter for repositories where trust boundaries, secrets, packaging, or incident risk require stricter review guidance.",
    excludedPaths: [
      ".github/workflows/codex-pr-review.yml",
      ".github/workflows/codex-release-prep.yml",
    ],
    templateRoots: [
      templateRoot,
      path.resolve(templatesRoot, "presets", "security-sensitive-repo"),
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
  ${commandName} init [target-directory] [--repo-name name] [--maintainer "Name"] [--preset name] [--force] [--dry-run] [--diff]
  ${commandName} sync-labels OWNER/REPO [--manifest name] [--dry-run]
  ${commandName} check-docs [target-directory]

Presets:
${formatPresetList()}

Examples:
  ${commandName} explain
  ${commandName} init .
  ${commandName} init ../my-repo --preset first-public-repo --dry-run --diff
  ${commandName} init ../my-repo --repo-name my-repo --maintainer "Jane Doe"
  ${commandName} init ../my-repo --dry-run
  ${commandName} sync-labels BlakeHampson/oss-maintainer-kit --dry-run
  ${commandName} check-docs .
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
- a label sync command for standard GitHub triage labels
- a docs check command for catching broken local Markdown links and anchors

Presets:
${formatPresetList()}

What it does not do:
- it does not change your application code
- it does not force you to use every workflow
- it does not replace tests or human judgment

If you are new to GitHub or open source, start with:
1. ${commandName} init ../my-repo --preset first-public-repo --dry-run --diff
2. ${commandName} init ../my-repo --repo-name my-repo --maintainer "Your Name" --preset first-public-repo
3. open docs/START_HERE.md in the generated repo
4. optionally run ${commandName} sync-labels OWNER/REPO --dry-run to standardize labels
5. run ${commandName} check-docs . after doc edits to catch broken local links and anchors

You can safely ignore the release workflow until you actually start shipping versions.
`;
}

export function parseCliArgs(argv) {
  const result = {
    command: argv[0],
    diff: false,
    dryRun: false,
    force: false,
    help: false,
    manifestName: "standard",
    maintainerName: undefined,
    preset: "base",
    repoName: undefined,
    targetRepo: undefined,
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

    if (value === "--diff") {
      result.diff = true;
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

    if (value === "--manifest") {
      if (!argv[index + 1]) {
        throw new Error("--manifest requires a value");
      }
      result.manifestName = argv[index + 1];
      index += 1;
      continue;
    }

    if (value.startsWith("--")) {
      throw new Error(`Unknown option: ${value}`);
    }

    if (positionalCount === 0) {
      if (result.command === "sync-labels") {
        result.targetRepo = value;
      } else {
        result.targetDir = value;
      }
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

function splitLines(content) {
  const normalized = content.replaceAll("\r\n", "\n");

  if (normalized === "") {
    return [];
  }

  const lines = normalized.split("\n");

  if (normalized.endsWith("\n")) {
    lines.pop();
  }

  return lines;
}

function buildLineOperations(oldLines, newLines) {
  const dp = Array.from({ length: oldLines.length + 1 }, () =>
    Array(newLines.length + 1).fill(0),
  );

  for (let oldIndex = oldLines.length - 1; oldIndex >= 0; oldIndex -= 1) {
    for (let newIndex = newLines.length - 1; newIndex >= 0; newIndex -= 1) {
      if (oldLines[oldIndex] === newLines[newIndex]) {
        dp[oldIndex][newIndex] = dp[oldIndex + 1][newIndex + 1] + 1;
      } else {
        dp[oldIndex][newIndex] = Math.max(
          dp[oldIndex + 1][newIndex],
          dp[oldIndex][newIndex + 1],
        );
      }
    }
  }

  const operations = [];
  let oldIndex = 0;
  let newIndex = 0;

  while (oldIndex < oldLines.length && newIndex < newLines.length) {
    if (oldLines[oldIndex] === newLines[newIndex]) {
      operations.push({ type: "context", line: oldLines[oldIndex] });
      oldIndex += 1;
      newIndex += 1;
      continue;
    }

    if (dp[oldIndex + 1][newIndex] >= dp[oldIndex][newIndex + 1]) {
      operations.push({ type: "remove", line: oldLines[oldIndex] });
      oldIndex += 1;
    } else {
      operations.push({ type: "add", line: newLines[newIndex] });
      newIndex += 1;
    }
  }

  while (oldIndex < oldLines.length) {
    operations.push({ type: "remove", line: oldLines[oldIndex] });
    oldIndex += 1;
  }

  while (newIndex < newLines.length) {
    operations.push({ type: "add", line: newLines[newIndex] });
    newIndex += 1;
  }

  return operations;
}

function formatRange(start, count) {
  return `${start},${count}`;
}

function buildUnifiedDiff({ newContent, oldContent, relativePath }) {
  const oldLines = splitLines(oldContent ?? "");
  const newLines = splitLines(newContent);
  const operations = buildLineOperations(oldLines, newLines);
  const changeIndexes = operations
    .map((operation, index) => ({ operation, index }))
    .filter(({ operation }) => operation.type !== "context")
    .map(({ index }) => index);

  if (changeIndexes.length === 0) {
    return "";
  }

  const contextLines = 3;
  const hunkRanges = [];

  for (const changeIndex of changeIndexes) {
    const start = Math.max(0, changeIndex - contextLines);
    const end = Math.min(operations.length, changeIndex + contextLines + 1);
    const previous = hunkRanges[hunkRanges.length - 1];

    if (previous && start <= previous.end) {
      previous.end = Math.max(previous.end, end);
    } else {
      hunkRanges.push({ start, end });
    }
  }

  const lines = [
    `diff --git a/${relativePath} b/${relativePath}`,
  ];

  if (oldContent === null) {
    lines.push("new file mode 100644");
    lines.push("--- /dev/null");
  } else {
    lines.push(`--- a/${relativePath}`);
  }
  lines.push(`+++ b/${relativePath}`);

  for (const { start, end } of hunkRanges) {
    let oldStart = 1;
    let newStart = 1;

    for (let index = 0; index < start; index += 1) {
      if (operations[index].type !== "add") {
        oldStart += 1;
      }
      if (operations[index].type !== "remove") {
        newStart += 1;
      }
    }

    let oldCount = 0;
    let newCount = 0;

    for (let index = start; index < end; index += 1) {
      if (operations[index].type !== "add") {
        oldCount += 1;
      }
      if (operations[index].type !== "remove") {
        newCount += 1;
      }
    }

    if (oldCount === 0) {
      oldStart = Math.max(0, oldStart - 1);
    }
    if (newCount === 0) {
      newStart = Math.max(0, newStart - 1);
    }

    lines.push(
      `@@ -${formatRange(oldStart, oldCount)} +${formatRange(newStart, newCount)} @@`,
    );

    for (let index = start; index < end; index += 1) {
      const operation = operations[index];
      const prefix =
        operation.type === "context" ? " " : operation.type === "add" ? "+" : "-";
      lines.push(`${prefix}${operation.line}`);
    }
  }

  return lines.join("\n");
}

async function collectTemplateDirectory({
  currentSource,
  files,
  excludedPaths,
  relativeRoot = "",
  tokens,
}) {
  const entries = await readdir(currentSource, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(currentSource, entry.name);
    const relativeTargetPath = normalizeRelativePath(
      path.join(relativeRoot, entry.name),
    );

    if (excludedPaths.has(relativeTargetPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      await collectTemplateDirectory({
        currentSource: sourcePath,
        files,
        excludedPaths,
        relativeRoot: relativeTargetPath,
        tokens,
      });
      continue;
    }

    const rawContent = await readFile(sourcePath, "utf8");
    const rendered = replaceTokens(rawContent, tokens);
    files.set(relativeTargetPath, rendered);
  }
}

async function collectRenderedTemplates({ presetConfig, tokens }) {
  const files = new Map();
  const excludedPaths = new Set(presetConfig.excludedPaths);

  for (const currentTemplateRoot of presetConfig.templateRoots) {
    await collectTemplateDirectory({
      currentSource: currentTemplateRoot,
      files,
      excludedPaths,
      tokens,
    });
  }

  return files;
}

async function readExistingContent(targetPath) {
  if (!(await pathExists(targetPath))) {
    return null;
  }

  return readFile(targetPath, "utf8");
}

export async function initKit({
  dryRun = false,
  force = false,
  maintainerName,
  preset = "base",
  repoName,
  showDiff = false,
  targetDir,
}) {
  const created = [];
  const toCreate = [];
  const toUpdate = [];
  const unchanged = [];
  const skipped = [];
  const presetConfig = getPresetConfig(preset);

  const tokens = {
    "__MAINTAINER_NAME__": maintainerName,
    "__PROJECT_NAME__": repoName,
  };

  if (!dryRun) {
    await mkdir(targetDir, { recursive: true });
  }

  const renderedFiles = await collectRenderedTemplates({ presetConfig, tokens });
  const operations = [];
  const diffs = [];

  for (const relativeTargetPath of [...renderedFiles.keys()].sort()) {
    const targetPath = path.join(targetDir, relativeTargetPath);
    const rendered = renderedFiles.get(relativeTargetPath);
    const existingContent = await readExistingContent(targetPath);

    if (existingContent !== null && !force) {
      skipped.push(relativeTargetPath);
      operations.push({ path: relativeTargetPath, type: "skip" });
      continue;
    }

    let operationType = "create";

    if (existingContent !== null) {
      operationType = existingContent === rendered ? "unchanged" : "update";
    }

    if (operationType === "create") {
      toCreate.push(relativeTargetPath);
      created.push(relativeTargetPath);
    } else if (operationType === "update") {
      toUpdate.push(relativeTargetPath);
      created.push(relativeTargetPath);
    } else {
      unchanged.push(relativeTargetPath);
    }

    let diff = "";

    if (showDiff && (operationType === "create" || operationType === "update")) {
      diff = buildUnifiedDiff({
        newContent: rendered,
        oldContent: existingContent,
        relativePath: relativeTargetPath,
      });
      if (diff) {
        diffs.push({ path: relativeTargetPath, type: operationType, diff });
      }
    }

    operations.push({ path: relativeTargetPath, type: operationType, diff });

    if (!dryRun && (operationType === "create" || operationType === "update")) {
      await mkdir(path.dirname(targetPath), { recursive: true });
      await writeFile(targetPath, rendered, "utf8");
    }
  }

  return { created, diffs, operations, skipped, toCreate, toUpdate, unchanged };
}
