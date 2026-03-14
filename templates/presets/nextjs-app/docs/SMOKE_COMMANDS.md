# Smoke Command Cookbook

`SMOKE_COMMAND` is intentionally blank in `.github/workflows/ci-smoke.yml`.

That is on purpose. A smoke command should be narrow, honest, and specific to the route or flow you actually care about.

## Best default

Keep the workflow line short and put the real logic in a script or package command you own.

Examples:

- `npm run smoke:home`
- `npm run smoke:health`
- `./scripts/smoke-home.sh`

If you use `pnpm` or `yarn`, swap the package-manager command accordingly.

## Good Next.js examples

### Homepage or landing route

Use this when the main public route should never fail to render:

```bash
npm run smoke:home
```

Good fit when:

- the route is stable
- the app can start in production mode during CI
- you already have a small script that exits non-zero on failure

### Health or readiness route

Use this when the app exposes a route like `/api/health` or `/healthz`:

```bash
npm run smoke:health
```

This is often better than probing a random user page if your app already has a clear health endpoint.

### Inline fallback while you are still wiring things up

Use this only as a starter if you do not have a repo script yet:

```bash
npm run start -- --hostname 127.0.0.1 --port 3000 >/tmp/next-smoke.log 2>&1 &
APP_PID=$!
trap 'kill $APP_PID' EXIT
until curl -fsS http://127.0.0.1:3000/api/health >/dev/null; do sleep 2; done
```

This is serviceable, but it is usually cleaner to move the logic into `npm run smoke:health` or a shell script once the flow stabilizes.

## What to avoid

- do not hit a route that is flaky by design
- do not make the smoke command a full end-to-end suite
- do not probe external dependencies unless the point of the smoke check is to prove that exact integration
- do not keep a command you no longer understand

## Rule of thumb

Pick one route or flow that would embarrass you if it broke silently, and check only that.
