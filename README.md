# Nimbus Labs

An educational monorepo: a collection of small apps that teach a concept through interactive
visualization.

## Content model

- **Page** — a single route covering one topic (e.g. the sort algorithm visualizer, or the
  evolutionary timeline). Pages can be interactive or plain reading material.
- **Course** — an ordered series of pages that build up a broader concept together. Nimbus Labs
  doesn't have any courses yet; every page currently stands alone.

## Layout

- [`app/`](app/README.md) — the deployed apps: [root portal](app/root/README.md),
  [bio](app/bio/README.md), [compsci](app/compsci/README.md), [geo](app/geo/README.md)
- [`lib/`](lib/README.md) — shared libraries consumed by the apps
- [`generators/`](generators/README.md) — scripts that generate page/course content artifacts
- [`terraform/`](terraform/README.md) — infrastructure as code
- [`scripts/`](scripts/add-dep.mjs) — repo maintenance tooling (see "Dependency versions" below)
- [`.github/workflows/`](.github/workflows) — CI, and per-app deploys gated on CI success

## Getting started

```bash
npm install
npm run dev -w <workspace>     # e.g. npm run dev -w bio
npm test -w <workspace>
npm run build -w <workspace>
```

Run any workspace script (`lint`, `check-format`, `format`, `build`, `test`) across every workspace
at once with `npm run <script> --workspaces --if-present`.

## Dependency versions

Every shared dependency's version is pinned once, here in the root `devDependencies` — workspace
`package.json` files declare `"*"` and resolve against that pin. To add a new dependency the right
way:

```bash
npm run add-dep -- <workspace> [--dev] <pkg[@version]>
```

`<workspace>` accepts either a path (`app/bio`) or a package name (`bio`, `@nimbus-labs/ui`). See
[`scripts/add-dep.mjs`](scripts/add-dep.mjs) for details.

## License

MIT
