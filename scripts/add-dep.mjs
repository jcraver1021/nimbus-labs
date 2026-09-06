#!/usr/bin/env node
import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function usage() {
  console.error(
    'Usage: npm run add-dep -- <workspace> [--dev] <pkg[@version]> [<pkg[@version]> ...]\n' +
      'Example: npm run add-dep -- app/bio @mui/x-charts\n' +
      'Example: npm run add-dep -- bio --dev @types/lodash\n' +
      '<workspace> may be a path (app/bio) or a package name (bio, @nimbus-labs/ui).'
  );
  process.exit(1);
}

function packageNameFrom(spec) {
  const atIndex = spec.lastIndexOf('@');
  return atIndex > 0 ? spec.slice(0, atIndex) : spec;
}

function resolveWorkspacePath(rootPkg, input) {
  const workspaces = rootPkg.workspaces || [];
  if (workspaces.includes(input)) return input;

  for (const ws of workspaces) {
    const pkg = JSON.parse(readFileSync(path.join(ROOT, ws, 'package.json'), 'utf8'));
    if (pkg.name === input) return ws;
  }

  return null;
}

const args = process.argv.slice(2);
if (args.length < 2) usage();

const [workspaceArg, ...rest] = args;
const dev = rest[0] === '--dev';
const specs = dev ? rest.slice(1) : rest;
if (specs.length === 0) usage();

const rootPkgPath = path.join(ROOT, 'package.json');
const rootPkg = JSON.parse(readFileSync(rootPkgPath, 'utf8'));

const workspace = resolveWorkspacePath(rootPkg, workspaceArg);
if (!workspace) {
  console.error(
    `"${workspaceArg}" isn't a known workspace. Valid options: ${rootPkg.workspaces.join(', ')}`
  );
  process.exit(1);
}

const workspacePkgPath = path.join(ROOT, workspace, 'package.json');
const workspacePkg = JSON.parse(readFileSync(workspacePkgPath, 'utf8'));

// Root is the single source of pinned versions, so every install lands there first.
console.log(`Installing ${specs.join(', ')} at repo root...`);
execFileSync('npm', ['install', '--save-dev', ...specs], {cwd: ROOT, stdio: 'inherit'});

const updatedRootPkg = JSON.parse(readFileSync(rootPkgPath, 'utf8'));

// Workspaces only ever declare "*", resolving against whatever root just pinned.
const bucket = dev ? 'devDependencies' : 'dependencies';
workspacePkg[bucket] = workspacePkg[bucket] || {};

for (const spec of specs) {
  const name = packageNameFrom(spec);
  if (!updatedRootPkg.devDependencies?.[name]) {
    console.warn(`Warning: ${name} not found in root devDependencies after install — check package.json.`);
  }
  workspacePkg[bucket][name] = '*';
}

workspacePkg[bucket] = Object.fromEntries(
  Object.entries(workspacePkg[bucket]).sort(([a], [b]) => a.localeCompare(b))
);

writeFileSync(workspacePkgPath, JSON.stringify(workspacePkg, null, 2) + '\n');
execFileSync('npx', ['prettier', '--write', workspacePkgPath], {cwd: ROOT, stdio: 'inherit'});

console.log('Regenerating package-lock.json...');
execFileSync('npm', ['run', 'regen-lock'], {cwd: ROOT, stdio: 'inherit'});

console.log(
  `\nDone. Added ${specs.map(packageNameFrom).join(', ')} to ${workspace} as "*", pinned at root.`
);
