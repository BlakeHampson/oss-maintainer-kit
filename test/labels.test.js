import test from "node:test";
import assert from "node:assert/strict";

import { buildLabelOperations } from "../src/labels.js";
import { parseCliArgs } from "../src/scaffold.js";

const manifest = {
  name: "standard",
  version: "2026-03-13",
  labels: [
    {
      name: "bug",
      color: "D73A4A",
      description: "Something is broken or behaving incorrectly",
    },
    {
      name: "docs",
      color: "0075CA",
      description: "Documentation, guides, examples, or README improvements",
    },
  ],
};

test("parseCliArgs handles sync-labels", () => {
  const parsed = parseCliArgs([
    "sync-labels",
    "BlakeHampson/oss-maintainer-kit",
    "--manifest",
    "standard",
    "--dry-run",
  ]);

  assert.equal(parsed.command, "sync-labels");
  assert.equal(parsed.targetRepo, "BlakeHampson/oss-maintainer-kit");
  assert.equal(parsed.manifestName, "standard");
  assert.equal(parsed.dryRun, true);
});

test("buildLabelOperations plans create, update, and noop work", () => {
  const operations = buildLabelOperations(manifest, [
    {
      name: "bug",
      color: "d73a4a",
      description: "Something is broken or behaving incorrectly",
    },
    {
      name: "docs",
      color: "ffffff",
      description: "Outdated description",
    },
  ]);

  assert.equal(operations[0].type, "noop");
  assert.equal(operations[1].type, "update");

  const createOperations = buildLabelOperations(manifest, []);
  assert.equal(createOperations[0].type, "create");
  assert.equal(createOperations[1].type, "create");
});
