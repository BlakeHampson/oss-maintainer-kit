# Smoke Command Cookbook

`SMOKE_COMMAND` is intentionally blank in `.github/workflows/ci-smoke.yml`.

That is the safe default. A smoke command should prove one important service behavior without pretending to cover the whole system.

## Best default

Keep the workflow line short and put the real logic in a command or script your repo owns.

Examples:

- `python -m service.smoke_check`
- `python scripts/smoke_worker.py`
- `./scripts/smoke-api.sh`

## Good Python service examples

### Health endpoint check

Use this when the service has a clear endpoint like `/healthz`:

```bash
python -m service.smoke_check
```

That module can start the service, wait for readiness, and fail loudly if the endpoint does not answer.

### Worker or queue sanity check

Use this when the repo is mainly a worker or background job:

```bash
python scripts/smoke_worker.py
```

Good fit when the critical thing is whether a worker can start, read config, and execute one safe no-op task.

### Inline fallback while you are still wiring things up

Use this only as a starter if you do not have a repo script yet:

```bash
uv run uvicorn service.app:app --host 127.0.0.1 --port 8000 >/tmp/service-smoke.log 2>&1 &
APP_PID=$!
trap 'kill $APP_PID' EXIT
until curl -fsS http://127.0.0.1:8000/healthz >/dev/null; do sleep 2; done
```

If your repo does not use `uv`, adapt the server start command. The point is still the same: start locally, wait until it is ready, and check one endpoint or job path.

## What to avoid

- do not make the smoke command a full integration test suite
- do not hit destructive endpoints
- do not depend on production-only credentials unless the repo is explicitly built around that
- do not keep a command that nobody can explain

## Rule of thumb

Pick one endpoint, worker, or job that would make the service feel obviously broken if it failed, and check only that.
