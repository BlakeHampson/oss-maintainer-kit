import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { checkDocs, collectAnchors } from "../src/docs.js";
import { explainKit, initKit, parseCliArgs, replaceTokens, usage } from "../src/scaffold.js";

test("parseCliArgs handles init flags", () => {
  const parsed = parseCliArgs([
    "init",
    "../repo",
    "--repo-name",
    "demo-repo",
    "--maintainer",
    "Jane Doe",
    "--preset",
    "first-public-repo",
    "--diff",
    "--force",
  ]);

  assert.equal(parsed.command, "init");
  assert.equal(parsed.targetDir, "../repo");
  assert.equal(parsed.repoName, "demo-repo");
  assert.equal(parsed.maintainerName, "Jane Doe");
  assert.equal(parsed.preset, "first-public-repo");
  assert.equal(parsed.diff, true);
  assert.equal(parsed.force, true);
});

test("parseCliArgs handles explain", () => {
  const parsed = parseCliArgs(["explain"]);

  assert.equal(parsed.command, "explain");
});

test("parseCliArgs handles check-docs", () => {
  const parsed = parseCliArgs(["check-docs", "../repo"]);

  assert.equal(parsed.command, "check-docs");
  assert.equal(parsed.targetDir, "../repo");
});

test("replaceTokens replaces all supported placeholders", () => {
  const rendered = replaceTokens("__PROJECT_NAME__ by __MAINTAINER_NAME__", {
    "__MAINTAINER_NAME__": "Jane Doe",
    "__PROJECT_NAME__": "demo-repo",
  });

  assert.equal(rendered, "demo-repo by Jane Doe");
});

test("collectAnchors handles duplicate headings", () => {
  const anchors = collectAnchors(`# Intro\n## Setup\n## Setup\n`);

  assert.ok(anchors.has("intro"));
  assert.ok(anchors.has("setup"));
  assert.ok(anchors.has("setup-1"));
});

test("usage and explainKit describe the beginner path", () => {
  assert.match(usage(), /maintainer-kit explain/);
  assert.match(usage(), /first-public-repo/);
  assert.match(usage(), /javascript-library/);
  assert.match(usage(), /python-package/);
  assert.match(usage(), /nextjs-app/);
  assert.match(usage(), /python-service/);
  assert.match(usage(), /docs-heavy/);
  assert.match(usage(), /security-sensitive-repo/);
  assert.match(usage(), /sync-labels/);
  assert.match(explainKit(), /docs\/START_HERE\.md/);
});

test("initKit copies templates and injects tokens", async () => {
  const targetDir = await mkdtemp(path.join(os.tmpdir(), "oss-maintainer-kit-"));
  const result = await initKit({
    maintainerName: "Jane Doe",
    repoName: "demo-repo",
    targetDir,
  });

  assert.ok(result.created.length > 0);

  const agents = await readFile(path.join(targetDir, "AGENTS.md"), "utf8");
  assert.match(agents, /demo-repo/);
  assert.match(agents, /Jane Doe/);
});

test("initKit skips existing files unless force is set", async () => {
  const targetDir = await mkdtemp(path.join(os.tmpdir(), "oss-maintainer-kit-"));
  await initKit({
    maintainerName: "Jane Doe",
    repoName: "demo-repo",
    targetDir,
  });

  const agentsPath = path.join(targetDir, "AGENTS.md");
  await writeFile(agentsPath, "custom content", "utf8");

  const skippedRun = await initKit({
    maintainerName: "Jane Doe",
    repoName: "demo-repo",
    targetDir,
  });

  assert.ok(skippedRun.skipped.includes("AGENTS.md"));
  assert.equal(await readFile(agentsPath, "utf8"), "custom content");

  await initKit({
    force: true,
    maintainerName: "Jane Doe",
    repoName: "demo-repo",
    targetDir,
  });

  assert.notEqual(await readFile(agentsPath, "utf8"), "custom content");
});

test("initKit dry-run previews files without writing them", async () => {
  const targetDir = await mkdtemp(path.join(os.tmpdir(), "oss-maintainer-kit-"));
  const previewTarget = path.join(targetDir, "preview-repo");

  const result = await initKit({
    dryRun: true,
    maintainerName: "Jane Doe",
    repoName: "demo-repo",
    targetDir: previewTarget,
  });

  assert.ok(result.created.includes("AGENTS.md"));
  assert.ok(result.created.includes(path.join("docs", "START_HERE.md")));

  try {
    await readFile(path.join(previewTarget, "AGENTS.md"), "utf8");
    assert.fail("dry-run should not write files");
  } catch (error) {
    assert.equal(error.code, "ENOENT");
  }
});

test("initKit dry-run diff previews new files", async () => {
  const targetDir = await mkdtemp(path.join(os.tmpdir(), "oss-maintainer-kit-"));
  const previewTarget = path.join(targetDir, "preview-repo");

  const result = await initKit({
    dryRun: true,
    maintainerName: "Jane Doe",
    repoName: "demo-repo",
    showDiff: true,
    targetDir: previewTarget,
  });

  const agentsDiff = result.diffs.find((entry) => entry.path === "AGENTS.md");

  assert.ok(agentsDiff);
  assert.match(agentsDiff.diff, /diff --git a\/AGENTS\.md b\/AGENTS\.md/);
  assert.match(agentsDiff.diff, /\+\# AGENTS\.md/);
});

test("first-public-repo preset leaves out the release workflow", async () => {
  const targetDir = await mkdtemp(path.join(os.tmpdir(), "oss-maintainer-kit-"));
  const previewTarget = path.join(targetDir, "preview-repo");

  const result = await initKit({
    dryRun: true,
    maintainerName: "Jane Doe",
    preset: "first-public-repo",
    repoName: "demo-repo",
    targetDir: previewTarget,
  });

  assert.ok(result.created.includes(".github/workflows/codex-pr-review.yml"));
  assert.ok(result.created.includes(".github/workflows/repo-health.yml"));
  assert.ok(!result.created.includes(".github/release-note-schema.yml"));
  assert.ok(!result.created.includes(".github/workflows/codex-release-prep.yml"));
});

test("javascript-library preset injects package-specific review guidance", async () => {
  const targetDir = await mkdtemp(path.join(os.tmpdir(), "oss-maintainer-kit-"));

  await initKit({
    maintainerName: "Jane Doe",
    preset: "javascript-library",
    repoName: "demo-repo",
    targetDir,
  });

  const agents = await readFile(path.join(targetDir, "AGENTS.md"), "utf8");
  const schema = await readFile(
    path.join(targetDir, ".github", "release-note-schema.yml"),
    "utf8",
  );
  assert.match(agents, /JavaScript or TypeScript package/);
  assert.match(agents, /CommonJS or ESM consumers/);
  assert.match(schema, /schema_version: 1/);
  assert.match(schema, /highlights:/);
});

test("python-package preset injects packaging guidance", async () => {
  const targetDir = await mkdtemp(path.join(os.tmpdir(), "oss-maintainer-kit-"));

  await initKit({
    maintainerName: "Jane Doe",
    preset: "python-package",
    repoName: "demo-repo",
    targetDir,
  });

  const agents = await readFile(path.join(targetDir, "AGENTS.md"), "utf8");
  assert.match(agents, /Python package/);
  assert.match(agents, /import path changes/);
});

test("docs-heavy preset injects docs-first guidance", async () => {
  const targetDir = await mkdtemp(path.join(os.tmpdir(), "oss-maintainer-kit-"));

  await initKit({
    maintainerName: "Jane Doe",
    preset: "docs-heavy",
    repoName: "demo-repo",
    targetDir,
  });

  const agents = await readFile(path.join(targetDir, "AGENTS.md"), "utf8");
  assert.match(agents, /docs-heavy repository/);
  assert.match(agents, /Broken links, misleading examples/);
});

test("nextjs-app preset injects app and deploy guidance", async () => {
  const targetDir = await mkdtemp(path.join(os.tmpdir(), "oss-maintainer-kit-"));

  await initKit({
    maintainerName: "Jane Doe",
    preset: "nextjs-app",
    repoName: "demo-repo",
    targetDir,
  });

  const agents = await readFile(path.join(targetDir, "AGENTS.md"), "utf8");
  const startHere = await readFile(
    path.join(targetDir, "docs", "START_HERE.md"),
    "utf8",
  );

  assert.match(agents, /Next\.js app/);
  assert.match(agents, /NEXT_PUBLIC_/);
  assert.match(startHere, /production build/);
});

test("python-service preset injects service and deploy guidance", async () => {
  const targetDir = await mkdtemp(path.join(os.tmpdir(), "oss-maintainer-kit-"));

  await initKit({
    maintainerName: "Jane Doe",
    preset: "python-service",
    repoName: "demo-repo",
    targetDir,
  });

  const agents = await readFile(path.join(targetDir, "AGENTS.md"), "utf8");
  const workflow = await readFile(
    path.join(targetDir, "docs", "MAINTAINER_WORKFLOW.md"),
    "utf8",
  );

  assert.match(agents, /Python service or API/);
  assert.match(agents, /rollback safety/);
  assert.match(workflow, /smoke test plan/);
});

test("security-sensitive-repo preset excludes automation workflows and injects security guidance", async () => {
  const targetDir = await mkdtemp(path.join(os.tmpdir(), "oss-maintainer-kit-"));
  const previewTarget = path.join(targetDir, "preview-repo");

  const result = await initKit({
    dryRun: true,
    maintainerName: "Jane Doe",
    preset: "security-sensitive-repo",
    repoName: "demo-repo",
    targetDir: previewTarget,
  });

  assert.ok(!result.created.includes(".github/release-note-schema.yml"));
  assert.ok(!result.created.includes(".github/workflows/codex-pr-review.yml"));
  assert.ok(!result.created.includes(".github/workflows/codex-release-prep.yml"));

  await initKit({
    maintainerName: "Jane Doe",
    preset: "security-sensitive-repo",
    repoName: "demo-repo",
    targetDir,
  });

  const agents = await readFile(path.join(targetDir, "AGENTS.md"), "utf8");
  const prTemplate = await readFile(
    path.join(targetDir, ".github", "PULL_REQUEST_TEMPLATE.md"),
    "utf8",
  );
  const workflow = await readFile(
    path.join(targetDir, ".github", "workflows", "repo-health.yml"),
    "utf8",
  );

  assert.match(agents, /security-sensitive/);
  assert.match(agents, /trust boundaries/);
  assert.match(prTemplate, /auth, secret, or crypto behavior/);
  assert.match(workflow, /check-docs/);
});

test("initKit dry-run diff previews overwrites when force is set", async () => {
  const targetDir = await mkdtemp(path.join(os.tmpdir(), "oss-maintainer-kit-"));
  const agentsPath = path.join(targetDir, "AGENTS.md");
  await mkdir(path.dirname(agentsPath), { recursive: true });
  await writeFile(agentsPath, "custom content\n", "utf8");

  const result = await initKit({
    dryRun: true,
    force: true,
    maintainerName: "Jane Doe",
    repoName: "demo-repo",
    showDiff: true,
    targetDir,
  });

  const agentsOperation = result.operations.find((entry) => entry.path === "AGENTS.md");
  const agentsDiff = result.diffs.find((entry) => entry.path === "AGENTS.md");

  assert.equal(agentsOperation?.type, "update");
  assert.ok(agentsDiff);
  assert.match(agentsDiff.diff, /-custom content/);
  assert.match(agentsDiff.diff, /\+\# AGENTS\.md/);
});

test("checkDocs reports missing files and anchors", async () => {
  const targetDir = await mkdtemp(path.join(os.tmpdir(), "oss-maintainer-kit-docs-"));
  const docsDir = path.join(targetDir, "docs");

  await mkdir(docsDir, { recursive: true });

  await writeFile(
    path.join(targetDir, "README.md"),
    [
      "# Demo",
      "",
      "[Working](docs/good.md#intro)",
      "[Missing file](docs/nope.md)",
      "[Missing anchor](docs/good.md#not-there)",
      "[Local missing anchor](#also-missing)",
      "",
    ].join("\n"),
    "utf8",
  );

  await writeFile(
    path.join(docsDir, "good.md"),
    "# Intro\n\n## More Detail\n",
    "utf8",
  );

  const result = await checkDocs({ rootDir: targetDir });

  assert.equal(result.filesChecked, 2);
  assert.equal(result.issues.length, 3);
  assert.match(
    result.issues.map((issue) => issue.message).join("\n"),
    /Linked path "docs\/nope\.md" does not exist/,
  );
  assert.match(
    result.issues.map((issue) => issue.message).join("\n"),
    /Anchor "#not-there" does not exist/,
  );
  assert.match(
    result.issues.map((issue) => issue.message).join("\n"),
    /Anchor "#also-missing" does not exist in this file/,
  );
});
