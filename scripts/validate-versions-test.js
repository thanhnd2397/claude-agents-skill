"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const manifestPaths = [
  ".claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
];

function readManifestVersion(manifestPath) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  return manifest.version ?? manifest.plugins?.[0]?.version;
}

test("all plugin manifests use the .claude-plugin/plugin.json version", () => {
  const expectedVersion = readManifestVersion(".claude-plugin/plugin.json");
  assert.ok(expectedVersion, ".claude-plugin/plugin.json must define a version");

  for (const manifestPath of manifestPaths) {
    assert.equal(
      readManifestVersion(manifestPath),
      expectedVersion,
      `${manifestPath} must use version ${expectedVersion}`,
    );
  }
});
