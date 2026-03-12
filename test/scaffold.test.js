import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { initKit, parseCliArgs, replaceTokens } from "../src/scaffold.js";

test("parseCliArgs handles init flags", () => {
  const parsed = parseCliArgs([
    "init",
    "../repo",
    "--repo-name",
    "demo-repo",
    "--maintainer",
    "Jane Doe",
    "--force",
  ]);

  assert.equal(parsed.command, "init");
  assert.equal(parsed.targetDir, "../repo");
  assert.equal(parsed.repoName, "demo-repo");
  assert.equal(parsed.maintainerName, "Jane Doe");
  assert.equal(parsed.force, true);
});

test("replaceTokens replaces all supported placeholders", () => {
  const rendered = replaceTokens("__PROJECT_NAME__ by __MAINTAINER_NAME__", {
    "__MAINTAINER_NAME__": "Jane Doe",
    "__PROJECT_NAME__": "demo-repo",
  });

  assert.equal(rendered, "demo-repo by Jane Doe");
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
