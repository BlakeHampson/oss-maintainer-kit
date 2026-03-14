import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

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
    "--force",
  ]);

  assert.equal(parsed.command, "init");
  assert.equal(parsed.targetDir, "../repo");
  assert.equal(parsed.repoName, "demo-repo");
  assert.equal(parsed.maintainerName, "Jane Doe");
  assert.equal(parsed.preset, "first-public-repo");
  assert.equal(parsed.force, true);
});

test("parseCliArgs handles explain", () => {
  const parsed = parseCliArgs(["explain"]);

  assert.equal(parsed.command, "explain");
});

test("replaceTokens replaces all supported placeholders", () => {
  const rendered = replaceTokens("__PROJECT_NAME__ by __MAINTAINER_NAME__", {
    "__MAINTAINER_NAME__": "Jane Doe",
    "__PROJECT_NAME__": "demo-repo",
  });

  assert.equal(rendered, "demo-repo by Jane Doe");
});

test("usage and explainKit describe the beginner path", () => {
  assert.match(usage(), /maintainer-kit explain/);
  assert.match(usage(), /first-public-repo/);
  assert.match(usage(), /javascript-library/);
  assert.match(usage(), /python-package/);
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
  assert.match(agents, /JavaScript or TypeScript package/);
  assert.match(agents, /CommonJS or ESM consumers/);
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

  assert.match(agents, /security-sensitive/);
  assert.match(agents, /trust boundaries/);
  assert.match(prTemplate, /auth, secret, or crypto behavior/);
});
