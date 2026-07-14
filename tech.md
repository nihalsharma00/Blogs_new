# Technology Stack and Version Policy

## 1. Version Policy

Use currently supported stable releases.

Before installing dependencies:

1. Check the current stable version.
2. Confirm compatibility with the project runtime.
3. Avoid release candidates, beta versions, and nightly builds.
4. Record the installed version in `package.json` and this file.
5. Use a lockfile.
6. Do not upgrade major versions during an unrelated feature task.

Because package versions change over time, exact versions must be confirmed when the project is initialized.

---

## 2. Required Runtime

| Technology | Purpose | Version Policy |
|---|---|---|
| Node.js | Backend runtime and tooling | Current active LTS |
| npm or pnpm | Package management | Stable version compatible with Node.js |
| TypeScript | Shared application language | Latest stable compatible version |
| MySQL | Primary database | MySQL 8.4 LTS or a compatible managed MySQL 8 release |
| Git | Version control | Current stable |

Recommended package manager: `pnpm`.

Use one package manager only. Do not mix npm, Yarn, and pnpm lockfiles.

---

## 3. Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Frontend development and production build |
| TypeScript | Type safety |
| React Router | Client-side routing |
| TanStack Query | Server-state fetching and caching |
| React Hook Form | Form state |
| Zod | Runtime validation |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| Framer Motion | Controlled UI motion |
| DOMPurify | Rendering sanitized rich HTML where required |

### Frontend Rules

- React is for the frontend only.
- Prefer feature-based organization.
- Use reusable components.
- Keep API calls inside service or query layers.
- Do not call APIs directly from deeply nested presentational components.
- Do not store server data as duplicated local component state.
- Do not use localStorage for authentication tokens unless the selected security design explicitly justifies it.
- Prefer secure cookies for refresh tokens.
- Sanitize user-generated rich content before rendering.
- Use responsive images.
- Respect reduced-motion preferences.

---

## 4. Backend

| Technology | Purpose |
|---|---|
| Node.js | Server runtime |
| Express | REST API framework |
| TypeScript | Type safety |
| Prisma ORM | MySQL schema, migrations, and database access |
| Zod | Request and environment validation |
| bcrypt or argon2 | Password hashing |
| jsonwebtoken or session library | Authentication |
| Helmet | Security headers |
| CORS middleware | Controlled cross-origin access |
| express-rate-limit | Rate limiting |
| Pino | Structured logging |
| Multer or signed upload workflow | File upload handling |
| Nodemailer or an email provider SDK | Transactional email |

### Backend Rules

- Build a custom REST API.
- Use controllers only for HTTP handling.
- Put business logic in services.
- Put database operations in repositories or well-defined service modules.
- Validate every external input.
- Use centralized error handling.
- Return consistent response shapes.
- Do not leak stack traces in production.
- Do not trust roles sent by the client.
- Enforce authorization on the server.
- Use parameterized database access through the ORM.
- Never store plain-text passwords.
- Never log passwords, access tokens, refresh tokens, or secrets.

---

## 5. Database

### Required Database

MySQL must be used.

Recommended:

- MySQL 8.4 LTS
- Prisma ORM
- Managed production MySQL provider compatible with Vercel serverless deployments

Potential providers include managed MySQL services. The final provider must be chosen according to availability, cost, region, connection limits, and Vercel compatibility.

### Initial Entity Set

- User
- Role
- UserRole
- AuthorProfile
- Post
- PostRevision
- Category
- Genre
- Tag
- PostTag
- Comment
- CommentLike
- PostLike
- Bookmark
- NewsletterSubscriber
- ContactSubmission
- MediaAsset
- RefreshToken or Session
- AdminAuditLog

### Database Rules

- Use migrations.
- Never manually edit production tables without a migration plan.
- Add indexes for slugs, foreign keys, publication status, dates, and common filters.
- Use unique constraints for email, username, slug, and tag name where applicable.
- Use foreign-key constraints.
- Decide deletion behavior explicitly.
- Prefer soft deletion for user-generated or moderated content when recovery is useful.
- Do not expose sequential internal IDs in URLs when a slug or public identifier is more suitable.

---

## 6. API Standard

Base path:

```text
/api/v1
```

Examples:

```text
GET    /api/v1/posts
GET    /api/v1/posts/:slug
POST   /api/v1/posts
PATCH  /api/v1/posts/:id
DELETE /api/v1/posts/:id

POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh

GET    /api/v1/posts/:postId/comments
POST   /api/v1/posts/:postId/comments
POST   /api/v1/comments/:commentId/replies
PATCH  /api/v1/comments/:commentId
DELETE /api/v1/comments/:commentId

POST   /api/v1/posts/:postId/likes
DELETE /api/v1/posts/:postId/likes
```

Recommended response format:

```json
{
  "success": true,
  "data": {},
  "message": "Optional human-readable message",
  "meta": {}
}
```

Recommended error format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": []
  }
}
```

---

## 7. Testing

| Tool | Purpose |
|---|---|
| Vitest | Unit tests |
| React Testing Library | React component behavior |
| Supertest | Express API integration tests |
| Playwright | End-to-end browser tests |

Required critical-flow tests:

- Registration
- Login
- Unauthorized route rejection
- Admin authorization
- Create post
- Edit post
- Delete post
- Publish post
- Search posts
- Add comment
- Reply to comment
- Edit own comment
- Reject editing another user’s comment
- Newsletter subscription

---

## 8. Code Quality

| Tool | Purpose |
|---|---|
| ESLint | Static analysis |
| Prettier | Formatting |
| Husky | Git hooks |
| lint-staged | Validate staged files |
| Commitlint | Optional commit-message enforcement |

Required scripts:

```json
{
  "scripts": {
    "dev": "run development apps",
    "build": "build all applications",
    "lint": "lint all workspaces",
    "typecheck": "type-check all workspaces",
    "test": "run automated tests",
    "format": "format source files"
  }
}
```

---

## 9. Deployment

### Vercel

- Frontend: Vercel
- API: Vercel-compatible Node deployment or a separately deployed Node service
- Database: external managed MySQL database
- Media: object storage or image CDN
- Secrets: Vercel environment variables

Important:

- Vercel does not provide a persistent local filesystem.
- Do not save uploaded images to a local server folder in production.
- Do not assume long-lived server processes.
- Configure database connection pooling for serverless usage.
- Run database migrations as a controlled deployment step.
- Configure separate development, preview, and production environments.

---

## 10. Environment Variables

Example:

```env
NODE_ENV=development

DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE

APP_URL=http://localhost:5173
API_URL=http://localhost:3000

JWT_ACCESS_SECRET=replace_me
JWT_REFRESH_SECRET=replace_me
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d

COOKIE_DOMAIN=
COOKIE_SECURE=false

EMAIL_FROM=
EMAIL_PROVIDER_API_KEY=

MEDIA_PROVIDER=
MEDIA_API_KEY=
MEDIA_API_SECRET=
```

Never commit a real `.env` file.

---

## 11. Version Recording Template

Update this table after initialization:

| Package | Installed Version | Last Reviewed |
|---|---:|---|
| Node.js | v24.16.0 | 2026-07-14 |
| npm | 11.13.0 | 2026-07-14 |
| React | TBD | TBD |
| Vite | TBD | TBD |
| TypeScript | 5.9.3 | 2026-07-14 |
| Express | TBD | TBD |
| Prisma | TBD | TBD |
| MySQL | TBD | TBD |
| Tailwind CSS | TBD | TBD |
| React Router | TBD | TBD |
| TanStack Query | TBD | TBD |
| Zod | TBD | TBD |
| Vitest | TBD | TBD |
| Playwright | TBD | TBD |
