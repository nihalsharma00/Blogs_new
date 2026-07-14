# Durable Project Memory

This file stores long-term project decisions and completed work. Update it only when durable facts change.

Last updated: Initial project planning

---

## 1. Product Identity

Working name: Vlog Platform

Purpose:

Create a dynamic, modern vlog and blog website with public discovery, user interaction, author profiles, content administration, responsive design, multiple themes, SEO, social sharing, and newsletter functionality.

---

## 2. Required Technology Decisions

### Database

MySQL is mandatory.

The project must not replace MySQL with:

- MongoDB
- Firebase
- Supabase
- SQLite as the production database
- LocalStorage as the primary database
- JSON files as the production database

Recommended database tooling:

- MySQL 8 compatible managed database
- Prisma ORM
- Version-controlled migrations

### Frontend

React is mandatory for the frontend.

### Backend

Node.js with Express is mandatory for the custom REST API.

React must not be described or used as a backend runtime. Shared TypeScript may be used across the frontend and backend.

### API

The project must create and own its API.

The production application must not depend on mock APIs such as JSONPlaceholder.

### Deployment

The application is intended to be deployed through Vercel.

The production MySQL database must be externally managed because Vercel does not provide a persistent MySQL server.

### Version Control

Git is mandatory.

A correct `.gitignore` must exist before secrets or generated files are introduced.

---

## 3. Authentication Decision

Planned authentication design:

- Email and password registration
- Secure password hashing
- Short-lived access authentication
- Secure refresh-token or server-session mechanism
- HTTP-only secure cookies for refresh/session credentials where supported
- Server-side role checks
- Server-side ownership checks
- Logout revocation
- Password-reset support
- Rate limiting on sensitive endpoints

Roles:

- Guest
- User
- Admin

Admin privileges must never be assigned based on client-provided role data.

---

## 4. Architecture Decisions

- Monorepo structure
- Separate React web application
- Separate Node.js/Express API application
- Shared TypeScript types where practical
- Feature-based frontend organization
- Modular backend organization
- REST API under `/api/v1`
- Thin controllers
- Business logic in services
- Centralized validation
- Centralized error handling
- Database migrations required
- Server-side authorization required
- Object storage or an image CDN for production media
- Environment variables for all secrets
- Development, preview, and production environments kept separate

---

## 5. Coding Conventions

- TypeScript preferred for all application code
- Use meaningful names
- Avoid unexplained abbreviations
- Prefer small, focused functions
- Prefer early returns
- Avoid deeply nested conditionals
- Keep modules focused
- Avoid duplicate business logic
- Validate external input
- Handle errors explicitly
- Do not use `any` without documented justification
- Do not leave debugging logs in production code
- Add comments for reasoning, not obvious syntax
- Follow existing file and naming patterns
- Use consistent API response shapes
- Use semantic HTML
- Build mobile first
- Include accessible focus states
- Respect reduced motion

Naming guidance:

- React components: `PascalCase`
- Hooks: `useSomething`
- Functions and variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE` only for true constants
- Database tables: consistent ORM naming
- REST paths: lowercase plural nouns
- Boolean names: `is`, `has`, `can`, or `should` prefix

---

## 6. Project Preferences

- Dynamic and interactive UI
- Modern visual design
- Smooth transitions
- No excessive animation
- Multiple clearly different themes
- User-friendly navigation
- Strong mobile responsiveness
- Clear empty, loading, success, and error states
- Complete features rather than non-functional mock buttons
- New Antigravity session for each distinct task
- Work phase by phase
- Explain manual API or infrastructure steps by giving:
  - exact file or folder
  - exact command
  - exact environment variable
  - exact verification step

---

## 7. Required Product Features

Planned:

- Home page
- Featured posts
- Latest posts
- Categories
- Genres
- Tags
- Search
- Filters
- Post detail pages
- Author profiles
- Related posts
- Login
- Registration
- Logout
- Password reset
- Admin dashboard
- Post CRUD
- Category CRUD
- Genre CRUD
- Tag CRUD
- Comments
- Nested replies
- Likes
- Comment moderation
- Hide and restore
- See more and see less
- Social sharing
- Newsletter subscription
- About page
- Contact page
- SEO-friendly URLs
- Metadata
- Sitemap
- Responsive design
- Light mode
- Dark mode
- Additional distinct themes

---

## 8. What the Project Must Do

- Load content from MySQL through the custom API
- Enforce permissions on the server
- Validate all external input
- Use secure authentication
- Use migrations
- Work on mobile, tablet, and desktop
- Support keyboard navigation
- Handle loading and failure states
- Use production-safe environment variables
- Use SEO-friendly slugs
- Prevent duplicate likes and invalid interactions
- Preserve data integrity
- Keep deployment compatible with Vercel
- Explain any required manual configuration precisely

---

## 9. What the Project Must Not Do

- Do not use fake production authentication
- Do not use hard-coded production posts
- Do not use localStorage as the main database
- Do not trust user IDs or roles sent by the client
- Do not expose secrets
- Do not commit `.env`
- Do not use React as the backend runtime
- Do not replace MySQL
- Do not create non-functional controls
- Do not skip mobile responsiveness
- Do not make all themes visually similar
- Do not use an unreadable transparent dropdown
- Do not store production uploads on local disk
- Do not report a phase complete without validation
- Do not modify unrelated features during a focused session
- Do not create a new architecture pattern without updating this file

---

## 10. Completed Features

No application features are completed yet.

Completed planning artifacts:

- Product requirements defined
- Required technology direction defined
- Initial architecture defined
- Initial phase plan defined
- Initial skill catalog defined
- Initial agent definitions created
- Initial Git ignore policy created

Completed Phase 4 (Public Website) Frontend & API Integration:
- Separated public routes and protected routes.
- Built PublicLayout, Navbar, and Footer.
- Built 5 distinct themes (Clean Light, Editorial Dark, Forest Calm, Sunset Warm, Modern Blue).
- Built ThemeToggle component.
- Configured TanStack Query for data fetching.
- Built Home, CategoryList, and PostDetail pages (with DOMPurify).
- Integrated API fetching via Axios instance `api.ts` for latest posts, single post details, and categories.
- Implemented frontend pagination for posts.
- Configured Vitest and RTL, and added initial component render tests.

Completed Phase 5 (Engagement):
- Created Prisma schema for `Comment`, `PostLike`, and `Bookmark`.
- Created backend API routes and controllers for engagement features and comments.
- Built `CommentsSection` and `CommentItem` frontend components for nested replies, editing, and moderation.
- Updated `PostDetail` page to include Like, Bookmark, and Comment capabilities.

Completed Phase 6 (Supporting Pages and Newsletter):
- Created Prisma schema for `NewsletterSubscriber` and `ContactSubmission` and applied migrations.
- Added API routes and controllers for contact forms (`/api/v1/contact`) and newsletter subscriptions (`/api/v1/newsletter/subscribe`, `/api/v1/newsletter/unsubscribe`).
- Built `About`, `Contact`, `PrivacyPolicy`, `TermsAndConditions`, and `Unsubscribe` public pages.
- Embedded a functional Newsletter Subscribe form in the shared `Footer`.
- Verified validation, error states, and tested components.

Completed Phase 8 (SEO and Security):
- Added `react-helmet-async` for frontend metadata management and Open Graph tags.
- Created `SEO` component and injected it into `Home`, `PostDetail`, and `CategoryList`.
- Added JSON-LD structured data to `PostDetail`.
- Created API endpoint `/api/v1/seo/sitemap.xml` for dynamic sitemap generation.
- Added static `robots.txt` pointing to the API sitemap.
- Added strict rate limiter (10 req/15min) for auth routes.
- Created `AuditLog` Prisma schema model and utility.
- Integrated `auditLogger` into `post.controller.ts` for tracking admin post CRUD operations.

Completed Phase 9 (Testing and Deployment):
- Configured Playwright for E2E tests and added critical flow specs (`auth`, `post`, `engagement`, `contact`).
- Added API integration tests for authentication flows.
- Refactored `apps/api/src/index.ts` to `vercel.ts` for Vercel serverless compatibility.
- Added `vercel.json` for monorepo routing between Vite and Express.
- Prepared `docs/deployment.md` for manual Vercel and MySQL deployment.

Update this section only after a feature has been implemented and verified.

---

## 11. Permission and Phase-Gate Policy

- Destructive/high-impact actions (delete, destructive migration,
  force-push, stack/architecture change, new major dependency, real
  secrets) always require explicit approval first.
- Additive, reversible, or already-scoped work (new files, migrations that
  only add, lint/test/build, features already defined in this project)
  proceeds without asking.
- Phase order (production.md §8) is advisory, not a hard gate — the agent
  may start the next phase early but should flag it if a real dependency
  from an earlier phase is missing.
- Full detail: `.agents/rules/security-and-permissions.md` and
  `.agents/rules/workflow-and-scope.md`.

---

## 12. Current Phase

Current phase: Project Completed (All Phases Implemented)

Next expected work:
- Manual provisioning of the production database.
- Deployment via Vercel CLI or dashboard.
- Active site monitoring and content addition.
