# Apps

Apps under the Nimbus Labs project live here, each its own Vite + React + TypeScript project
deployed to its own Firebase Hosting site.

- [root](root/README.md) — the portal, linking out to the other apps
- [bio](bio/README.md) — biology visualizations
- [compsci](compsci/README.md) — algorithm visualizations
- [geo](geo/README.md) — geology visualizations

## Overview

We use the following tech stack:

- `vite`
- `react`
- `typescript`

Each app is a collection of **pages** — a page is a single route covering one topic (e.g. the sort
algorithm visualizer). See the [repo root README](../README.md#content-model) for how pages relate
to courses.

## Adding an app

1. Under [/apps](.), run `npm create vite@latest`
   1. Choose `React` for the framework.
   1. Choose `Typescript + SWC` for the variant.

1. Add the path to the app to `workspaces` under the project [package.json](../package.json).

1. For each shared dependency the app needs (react, MUI, vitest, etc.), pull it in with
   [`npm run add-dep`](../scripts/add-dep.mjs) rather than installing it directly in the app — see
   the [repo root README](../README.md#dependency-versions) for why.

1. Add the following `scripts` to the app's `package.json`:
   1. `"fix": "eslint . --fix"`
   1. `"check-format": "prettier --check ."`
   1. `"format": "prettier --write ."`

   Test each new script before proceeding (you may need to run `npm i` to get `eslint` to work).

1. From the [project root](..), run `npm run regen-lock`.
