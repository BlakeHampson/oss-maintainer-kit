# Smoke Command Cookbook

The smoke workflow starters intentionally leave `SMOKE_COMMAND` empty.

That is the honest default. The kit can guess install and test commands more safely than it can guess the one route, endpoint, or worker that matters most in your repo.

## Fast chooser

| Repo shape | Good first pattern |
| --- | --- |
| Next.js app with a stable route | `npm run smoke:home` |
| Next.js app with a health endpoint | `npm run smoke:health` |
| Python API with a health endpoint | `python -m service.smoke_check` |
| Python worker or background job | `python scripts/smoke_worker.py` |

The strongest pattern is usually: keep `SMOKE_COMMAND` short and move the real logic into a script or project command that your team owns.

## Next.js examples

- `npm run smoke:home`
- `npm run smoke:health`
- `./scripts/smoke-home.sh`

Inline fallback:

```bash
npm run start -- --hostname 127.0.0.1 --port 3000 >/tmp/next-smoke.log 2>&1 &
APP_PID=$!
trap 'kill $APP_PID' EXIT
until curl -fsS http://127.0.0.1:3000/api/health >/dev/null; do sleep 2; done
```

If you use `pnpm` or `yarn`, swap the package-manager command accordingly.

## Python service examples

- `python -m service.smoke_check`
- `python scripts/smoke_worker.py`
- `./scripts/smoke-api.sh`

Inline fallback:

```bash
uv run uvicorn service.app:app --host 127.0.0.1 --port 8000 >/tmp/service-smoke.log 2>&1 &
APP_PID=$!
trap 'kill $APP_PID' EXIT
until curl -fsS http://127.0.0.1:8000/healthz >/dev/null; do sleep 2; done
```

If your repo does not use `uv`, adapt the server start command.

## Keep the scope tight

- choose one route, endpoint, or worker path
- prefer a command that fails fast
- avoid hitting destructive flows
- avoid turning `SMOKE_COMMAND` into a full test suite

When in doubt, start with the smallest useful proof that the app or service is alive and the most important flow still works.
