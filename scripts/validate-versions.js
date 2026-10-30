#!/usr/bin/env node

"use strict";

const { readFileSync } = require("node:fs");

const manifestPaths = [
  ".claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
];

function readManifestVersion(manifestPath) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  return manifest.version ?? manifest.plugins?.[0]?.version;
}

const expectedVersion = readManifestVersion(".claude-plugin/plugin.json");
if (!expectedVersion) {
  throw new Error(".claude-plugin/plugin.json is missing a version field");
}

for (const manifestPath of manifestPaths) {
  const version = readManifestVersion(manifestPath);
  if (version !== expectedVersion) {
    throw new Error(
      `${manifestPath} has version ${version ?? "<missing>"}; expected ${expectedVersion}`,
    );
  }
}

console.log(`All plugin manifests use version ${expectedVersion}.`);
