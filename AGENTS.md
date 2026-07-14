# AGENTS.md — Standing Instructions (auto-loaded every turn — keep lean)

Details live in these files; open them only when the task needs them:
@production.md (scope/features/phases) · @tech.md (stack/versions/API) ·
@memory.md (decisions already made) · @skills.md (how-to per task type) ·
.agents/agents.md (persona defs) · .agents/skills/ (contextual, auto-loaded)

## Stack (non-negotiable)
MySQL only (no Mongo/Firebase/Supabase/localStorage) · React+Vite+TS frontend
· Node/Express custom REST API under /api/v1, Prisma ORM · Vercel deploy,
external managed MySQL · Git, `.env` never committed. "React for frontend
and backend" = React frontend + Node/Express API (React can't serve APIs).

## Ask first
Delete anything · destructive/renaming migration · `git push --force` ·
changing stack/architecture/auth · new major dependency · real secrets/keys.

## Just do it
New files/routes/additive migrations · lint/typecheck/test/build · reading
code · features already scoped in production.md/memory.md.

## Always true
Never trust client-sent role/user-id — check server-side · hash passwords
(bcrypt/argon2) · no secrets in git · no auth enforced only in UI · no
stack traces leaked to client · never log secrets/tokens.

## Workflow
One session per task. Phase order (production.md §8) is advisory, not a
hard gate — flag it if skipping a real dependency. State scope → inspect
existing code → touch only listed files → implement → validate → report
(changes, files, migrations, env vars, commands run, test results, next
step). "Done" ≠ files exist — it must run, validate server-side, handle
loading/empty/error states, work on mobile. For manual steps (external
dashboards etc.) give exact location, field/command, value, and how to
verify. Update memory.md only for durable decisions/verified features.
