import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const labelManifestRoot = path.resolve(__dirname, "..", "manifests", "labels");

function normalizeColor(value) {
  return value.toUpperCase();
}

function normalizeDescription(value) {
  return value ?? "";
}

async function runGh(args) {
  try {
    const { stdout } = await execFileAsync("gh", args, { encoding: "utf8" });
    return stdout.trim();
  } catch (error) {
    const stderr = error.stderr?.trim();
    throw new Error(stderr || error.message);
  }
}

export async function loadLabelManifest(manifestName = "standard") {
  const manifestPath = path.join(labelManifestRoot, `${manifestName}.json`);
  const raw = await readFile(manifestPath, "utf8");
  return JSON.parse(raw);
}

export function buildLabelOperations(manifest, existingLabels) {
  const existingByName = new Map(existingLabels.map((label) => [label.name, label]));

  return manifest.labels.map((label) => {
    const current = existingByName.get(label.name);

    if (!current) {
      return {
        type: "create",
        label,
      };
    }

    const descriptionChanged =
      normalizeDescription(current.description) !== normalizeDescription(label.description);
    const colorChanged = normalizeColor(current.color) !== normalizeColor(label.color);

    if (descriptionChanged || colorChanged) {
      return {
        current,
        label,
        type: "update",
      };
    }

    return {
      current,
      label,
      type: "noop",
    };
  });
}

export async function listLabels(repo) {
  const output = await runGh([
    "label",
    "list",
    "--repo",
    repo,
    "--limit",
    "200",
    "--json",
    "name,color,description",
  ]);

  return JSON.parse(output);
}

async function applyOperation(repo, operation) {
  const { label, type } = operation;

  if (type === "create") {
    await runGh([
      "label",
      "create",
      label.name,
      "--repo",
      repo,
      "--color",
      label.color,
      "--description",
      label.description,
    ]);
    return;
  }

  if (type === "update") {
    await runGh([
      "label",
      "edit",
      label.name,
      "--repo",
      repo,
      "--color",
      label.color,
      "--description",
      label.description,
    ]);
  }
}

export async function syncLabels({
  dryRun = false,
  manifestName = "standard",
  repo,
}) {
  const manifest = await loadLabelManifest(manifestName);
  const existingLabels = await listLabels(repo);
  const operations = buildLabelOperations(manifest, existingLabels);
  const actionable = operations.filter((operation) => operation.type !== "noop");

  if (!dryRun) {
    for (const operation of actionable) {
      await applyOperation(repo, operation);
    }
  }

  return {
    actionable,
    manifest,
    operations,
    repo,
  };
}
