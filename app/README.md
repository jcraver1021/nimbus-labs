# Apps

Apps under the Nimbus Labs project live here.

## Overview

We use the following tech stack:

- `vite`
- `react`
- `typescript`

## Adding an app

1. Under [/apps](.), run `npm create vite@latest`
   1. Choose `React` for the framework.
   1. Choose `Typescript + SWC` for the variant.

1. Add the path to the app to `workspaces` under the project [package.json](../package.json).

1. Add the following to the app's `package.json`:
   1. `devDependencies`:
      1. `"prettier": "*"`

   1. `scripts`:
      1. `"fix": "eslint . --fix"`
      1. `"check-format": "prettier --check ."`
      1. `"format": "prettier --write ."`

      Test each new script before proceeding (you may need to run `npm i` to get `eslint` to work).

1. From the [project root](..), run `npm run regen-lock`.
