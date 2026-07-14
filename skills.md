# Project Skill Catalog

This file defines reusable skills. Skills describe how to perform a category of work. They must not contain temporary tasks or one-off project notes.

Project-specific rules belong in `AGENTS.md`.
Durable decisions belong in `memory.md`.

This is the full reference version. `.agents/skills/<name>/SKILL.md` holds
short, auto-loading copies of the same rules that Antigravity picks up
automatically without you asking — this file is what to read for the
complete workflow, examples, and common mistakes behind each one.

---

# Skill 1 — Feature Implementation

## Purpose

Implement a complete user-facing or administrative feature without breaking existing behavior.

## Workflow

1. Read project instructions.
2. Identify the relevant phase.
3. Inspect current files and existing patterns.
4. Define acceptance criteria.
5. Identify database, API, frontend, security, and testing impact.
6. Implement the smallest complete vertical slice.
7. Validate input and permissions.
8. Add loading, empty, success, and error states.
9. Add or update tests.
10. Run lint, type checking, tests, and build.
11. Report changed files and verification results.
12. Update `memory.md` only if a durable decision or completed feature changed.

## Best Practices

- Prefer vertical slices over disconnected placeholders.
- Preserve established architecture.
- Reuse shared types and validation schemas where practical.
- Keep presentation separate from data access.
- Make authorization decisions on the server.
- Design for mobile first.
- Avoid premature abstraction.

## Rules

- Do not mark a feature complete if only the UI exists.
- Do not create fake production data unless clearly labeled as development seed data.
- Do not modify unrelated modules.
- Do not remove working features to simplify implementation.
- Do not skip validation.
- Do not bypass authentication or authorization.
- Do not suppress errors without handling them.

## Example

Task: Add post bookmarking.

Expected implementation:

- Add bookmark database model or relation
- Add authenticated bookmark endpoints
- Add service logic
- Add frontend query and mutation hooks
- Add bookmark button states
- Add saved-posts page
- Add authorization and duplicate prevention
- Add tests

## Common Mistakes

- Building only the button
- Storing bookmarks only in localStorage
- Trusting a user ID sent by the client
- Failing to handle duplicate requests
- Not showing loading or error states
- Not testing unauthorized access

---

# Skill 2 — REST API Development

## Purpose

Create secure, versioned, maintainable REST API endpoints.

## Workflow

1. Define endpoint purpose.
2. Define authentication and authorization requirements.
3. Define request schema.
4. Define response schema.
5. Define status codes.
6. Add or update database schema.
7. Create migration.
8. Add route.
9. Add validation middleware.
10. Add controller.
11. Add service logic.
12. Add database operation.
13. Add centralized error mapping.
14. Add tests.
15. Document endpoint behavior.

## Best Practices

- Use `/api/v1`.
- Use nouns in route paths.
- Use correct HTTP verbs.
- Return predictable response shapes.
- Use pagination for collections.
- Filter and sort using validated query parameters.
- Keep controllers thin.
- Use transactions for multi-step writes.
- Prevent information leakage.

## Rules

- Never create an unvalidated write endpoint.
- Never authorize based solely on client UI state.
- Never return password hashes or tokens in logs.
- Never interpolate raw SQL input.
- Never use a successful status code for a failed operation.
- Never expose internal stack traces in production.

## Example

```text
POST /api/v1/posts
Authorization: admin or editor
Body: validated post creation data
Response: 201 Created
```

## Common Mistakes

- Putting all logic in the route file
- Missing uniqueness handling
- Returning inconsistent errors
- Omitting pagination
- Missing ownership checks
- Treating authentication and authorization as the same thing

---

# Skill 3 — MySQL Schema and Migration Design

## Purpose

Create reliable MySQL schema changes that preserve data integrity.

## Workflow

1. Identify entities and relationships.
2. Define required and optional fields.
3. Define unique constraints.
4. Define indexes.
5. Define foreign keys.
6. Define deletion behavior.
7. Create ORM schema changes.
8. Generate a migration.
9. Review generated SQL.
10. Test migration against a development database.
11. Test rollback or recovery plan.
12. Update seed data if required.

## Best Practices

- Use normalized relations where appropriate.
- Use join tables for many-to-many relations.
- Add indexes based on query patterns.
- Use timestamps.
- Prefer explicit status enums.
- Use soft deletion where moderation or restoration is required.
- Keep public slugs separate from internal IDs.

## Rules

- MySQL is mandatory.
- Do not replace MySQL with MongoDB, Firebase, Supabase, or localStorage.
- Do not edit an already-applied production migration.
- Do not delete columns without a data migration plan.
- Do not introduce nullable fields accidentally.
- Do not rely only on application logic for uniqueness.

## Example

A post with tags requires:

- `posts`
- `tags`
- `post_tags`
- unique constraint on normalized tag name
- unique composite constraint on `post_id` and `tag_id`

## Common Mistakes

- Storing tags as comma-separated text
- Missing indexes
- Cascade deleting valuable user content unintentionally
- Using display names as primary keys
- No migration for schema changes

---

# Skill 4 — Authentication and Authorization

## Purpose

Implement secure identity, session, and permission handling.

## Workflow

1. Define user roles and permissions.
2. Add user and session schema.
3. Validate registration data.
4. Hash passwords.
5. Implement login.
6. Issue short-lived access credentials.
7. Implement secure refresh or session renewal.
8. Implement logout and revocation.
9. Add server-side authentication middleware.
10. Add role and ownership authorization.
11. Add frontend auth state.
12. Protect routes.
13. Add rate limiting.
14. Add tests for misuse.

## Best Practices

- Use secure, HTTP-only cookies for refresh/session credentials.
- Keep access credentials short-lived.
- Rotate or revoke refresh credentials.
- Return generic login failure messages.
- Normalize email addresses.
- Require strong passwords.
- Keep authorization near protected business actions.

## Rules

- Never store plain-text passwords.
- Never hard-code an admin password in frontend code.
- Never allow the client to assign itself an admin role.
- Never protect admin pages only with frontend routing.
- Never place secrets in source control.
- Never return whether a specific email exists during sensitive recovery flows unless deliberately designed.

## Common Mistakes

- JWT stored indefinitely in localStorage
- No logout revocation
- Missing rate limiting
- Role checks only in the UI
- Trusting `userId` from request body

---

# Skill 5 — Responsive UI and Theme Development

## Purpose

Create modern, accessible, responsive interfaces and distinct themes.

## Workflow

1. Review the target screen on mobile first.
2. Define semantic structure.
3. Use design tokens.
4. Implement responsive layout.
5. Add theme-compatible colors.
6. Add loading, empty, and error states.
7. Add controlled transitions.
8. Add keyboard and screen-reader behavior.
9. Test at common viewport widths.
10. Test all themes.
11. Check reduced motion.
12. Check contrast and overflow.

## Best Practices

- Use CSS variables for theme tokens.
- Use consistent spacing.
- Avoid fixed widths for content cards.
- Use fluid typography carefully.
- Animate opacity and transforms where practical.
- Keep motion brief and purposeful.
- Make focus states visible.
- Use alt text for meaningful images.

## Rules

- No horizontal scrolling.
- No unreadable theme combinations.
- No animation required to understand content.
- No hover-only essential actions.
- No clipped menus or dialogs.
- No hard-coded color classes that break alternate themes.
- No excessive glassmorphism, blur, glow, or parallax.

## Common Mistakes

- Desktop-first layout patched for mobile
- Duplicate theme colors
- Transparent dropdowns with unreadable text
- Large images causing layout shift
- Missing focus styles
- Using animation on every element

---

# Skill 6 — Testing and Verification

## Purpose

Prove that a change works and has not broken critical behavior.

## Workflow

1. Identify affected behavior.
2. Identify failure cases.
3. Add unit tests for pure logic.
4. Add API integration tests for endpoints.
5. Add component tests for UI behavior.
6. Add end-to-end tests for critical flows.
7. Run lint.
8. Run type checking.
9. Run automated tests.
10. Run production build.
11. Perform targeted manual verification.
12. Report exact results.

## Rules

- Do not claim tests passed unless they were run.
- Do not disable tests to make a build pass.
- Do not remove assertions without replacing coverage.
- Do not treat compilation as proof of correct behavior.
- Do not omit negative authorization tests.

## Common Mistakes

- Testing only the happy path
- Mocking the exact behavior being tested
- Ignoring mobile behavior
- Not testing invalid input
- Not testing unauthorized users

---

# Skill 7 — Deployment and Release

## Purpose

Prepare and deploy a safe production release to Vercel and the production MySQL environment.

## Workflow

1. Confirm all environment variables.
2. Run lint.
3. Run type checking.
4. Run tests.
5. Run production build.
6. Review `.gitignore`.
7. Review migration status.
8. Review serverless compatibility.
9. Deploy preview.
10. Smoke-test preview.
11. Apply production migration through a controlled process.
12. Deploy production.
13. Smoke-test critical flows.
14. Check logs and monitoring.
15. Record release notes.

## Rules

- Never commit secrets.
- Never use local file storage for production uploads.
- Never point preview deployments at production data unless explicitly approved.
- Never run destructive migrations without a backup and recovery plan.
- Never deploy with failing tests.
- Never expose debug error pages in production.

## Common Mistakes

- Missing environment variables
- Unpooled database connections
- Uploading images to local disk
- Applying schema changes manually
- No post-deployment smoke test
