# Vlog Website — Product and Project Instructions

> Stack rules, permission policy, and session workflow live in `AGENTS.md`
> (auto-loaded every session). This file covers product scope only.

## 1. Project Purpose

Build a production-ready, dynamic, modern, responsive vlog and blog platform where users can discover, read, interact with, and share content across multiple genres.

The platform must support:

- Public content discovery
- Secure user authentication
- Blog and vlog publishing
- Categories, genres, and tags
- Comments, replies, likes, hiding, expanding, and collapsing content
- Author profiles
- Administration and moderation
- Search and filtering
- Newsletter subscriptions
- SEO-friendly pages
- Responsive layouts
- Multiple visual themes
- Production deployment through Vercel

The application must be developed incrementally in clearly defined phases. Each new Antigravity session should focus on one task or one closely related group of tasks.

---

## 2. Product Goals

The finished website should be:

- Dynamic rather than hard-coded
- Easy to navigate
- Fast and responsive
- Accessible on mobile, tablet, and desktop
- Visually modern without becoming distracting
- Smoothly animated
- Secure
- SEO-friendly
- Maintainable
- Modular
- Ready for deployment
- Easy to extend later

---

## 3. Core User Roles

### Guest

A guest can:

- View published posts
- Browse categories, genres, and tags
- Search and filter posts
- View author profiles
- View comments
- Open About and Contact pages
- Subscribe to the newsletter
- Use social sharing buttons
- Change the website theme

A guest cannot:

- Create comments
- Like posts or comments
- Reply to comments
- Access private account pages
- Access admin pages

### Registered User

A registered user can:

- Perform all guest actions
- Log in and log out
- Edit their profile
- Like or unlike posts
- Add comments
- Reply to comments
- Edit or delete their own comments
- Hide long comment threads
- Expand or collapse content
- Save or bookmark posts if this feature is enabled
- Manage newsletter preferences

A registered user cannot:

- Create, edit, or delete posts unless assigned an authorized role
- Access admin-only routes
- Moderate other users unless explicitly authorized

### Admin

An admin can:

- Create posts
- Edit posts
- Delete posts
- Publish or unpublish posts
- Manage categories, genres, and tags
- Manage users
- Moderate comments
- Hide or restore comments
- Manage featured posts
- View dashboard metrics
- Manage newsletter subscriptions
- Update site-level settings

---

## 4. Core Features

### Public Pages

- Home page
- Featured posts section
- Latest posts section
- Category pages
- Genre pages
- Tag pages
- Search results page
- Filtered post listings
- Individual blog or vlog post pages
- Related posts
- Author profile pages
- About page
- Contact page
- Login page
- Registration page
- Forgot-password and reset-password flow
- Privacy Policy page
- Terms and Conditions page
- 404 page

### Post Features

Each post should support:

- Title
- Unique SEO slug
- Excerpt
- Rich content
- Cover image
- Optional gallery or embedded media
- Author
- Publication date
- Updated date
- Category
- Genre
- Multiple tags
- Reading time
- View count
- Like count
- Comment count
- Featured state
- Draft, scheduled, published, or archived status
- SEO title
- SEO description
- Open Graph metadata
- Canonical URL

### Interaction Features

- Like and unlike posts
- Comments
- Nested replies
- Edit own comments
- Delete own comments
- Admin moderation
- Hide and restore comments
- “See more” and “See less”
- Collapsible reply threads
- Share buttons
- Copy-link button
- Optional bookmarks
- Optimistic UI only where rollback is correctly implemented

### Administrative Features

- Protected admin dashboard
- Post CRUD
- Category CRUD
- Genre CRUD
- Tag CRUD
- Comment moderation
- User management
- Featured-post management
- Newsletter subscriber management
- Dashboard analytics
- Draft preview
- Image upload management
- Validation and actionable error messages

---

## 5. User Interface Requirements

The interface must:

- Use a mobile-first responsive layout
- Support light and dark modes
- Support additional distinct themes
- Preserve readable contrast in every theme
- Use smooth but restrained transitions
- Avoid excessive animation
- Respect `prefers-reduced-motion`
- Avoid horizontal scrolling
- Avoid clipped text, images, menus, and cards
- Use skeleton loaders or meaningful loading states
- Include empty states
- Include clear error states
- Include success feedback
- Use consistent spacing and typography
- Use keyboard-accessible controls
- Use visible focus states
- Use semantic HTML

Suggested theme set:

1. Clean Light
2. Editorial Dark
3. Forest Calm
4. Sunset Warm
5. Modern Blue

Each theme must be visually distinct and must not merely change one accent color.

---

## 6. Technology Requirement (summary — see `AGENTS.md` for the enforced version)

React (frontend), Node.js + Express (custom API), MySQL (database), Git,
Vercel. Full non-negotiable rules and clarifications live in `AGENTS.md`.

Do not use, at the product level: hard-coded users or posts in production,
client-side-only authorization, or a mock API as the real data source.

---

## 7. Recommended Repository Structure

```text
vlog-platform/
├── apps/
│   ├── web/
│   │   ├── public/
│   │   └── src/
│   │       ├── app/
│   │       ├── assets/
│   │       ├── components/
│   │       ├── features/
│   │       ├── hooks/
│   │       ├── layouts/
│   │       ├── lib/
│   │       ├── pages/
│   │       ├── routes/
│   │       ├── services/
│   │       ├── styles/
│   │       └── types/
│   └── api/
│       └── src/
│           ├── config/
│           ├── controllers/
│           ├── db/
│           ├── middleware/
│           ├── modules/
│           ├── routes/
│           ├── services/
│           ├── utils/
│           ├── validators/
│           └── server.ts
├── packages/
│   ├── shared/
│   ├── eslint-config/
│   └── tsconfig/
├── docs/
├── .project/
│   ├── agents/
│   └── skills/
├── .env.example
├── .gitignore
├── PROJECT.md
├── memory.md
├── production.md
├── skills.md
├── tech.md
└── package.json
```

---

## 8. Development Phases

Every phase must be completed, tested, and documented before the next phase begins.

### Phase 0 — Project Planning

- Confirm scope
- Create repository structure
- Add project instruction files
- Add `.gitignore`
- Add `.env.example`
- Configure package manager and scripts
- Establish coding standards
- Define database entities
- Define API conventions

### Phase 1 — Foundation

- Create React frontend
- Create Node.js/Express backend
- Configure TypeScript
- Configure ESLint and Prettier
- Configure environment validation
- Configure MySQL connection
- Add health-check endpoint
- Add global error handling
- Add frontend routing
- Add base theme system

### Phase 2 — Database and Authentication

- Create MySQL schema and migrations
- Create user and role models
- Implement registration
- Implement login
- Implement logout
- Implement refresh-token flow
- Implement password hashing
- Implement route guards
- Implement authorization middleware
- Implement profile endpoints
- Add authentication tests

### Phase 3 — Content Management

- Create posts, categories, genres, and tags schema
- Implement post CRUD API
- Implement category CRUD API
- Implement genre CRUD API
- Implement tag CRUD API
- Build admin post editor
- Add draft and publish states
- Add slug generation
- Add image handling
- Add validation

### Phase 4 — Public Website

- Build home page
- Add featured posts
- Add latest posts
- Add category, genre, and tag pages
- Build post page
- Build author profile
- Add related posts
- Add search and filters
- Add pagination or cursor-based loading
- Add empty and loading states

### Phase 5 — Engagement

- Add post likes
- Add comments
- Add nested replies
- Add edit and delete own comment
- Add moderation tools
- Add hide, restore, see-more, and see-less behavior
- Add social sharing
- Add optional bookmarks

### Phase 6 — Supporting Pages and Newsletter

- Add About page
- Add Contact page
- Add contact form API
- Add newsletter subscription
- Add unsubscribe flow
- Add policy pages
- Add email templates if an email provider is configured

### Phase 7 — UI, Accessibility, and Performance

- Complete all themes
- Add transitions
- Respect reduced motion
- Audit mobile responsiveness
- Audit accessibility
- Optimize images
- Add lazy loading
- Add code splitting
- Reduce layout shift
- Review Core Web Vitals

### Phase 8 — SEO and Security

- Add metadata
- Add canonical URLs
- Add sitemap
- Add robots.txt
- Add Open Graph data
- Add structured data
- Add rate limiting
- Add secure headers
- Add input sanitization
- Add CORS policy
- Add CSRF strategy where applicable
- Add audit logging for admin actions

### Phase 9 — Testing and Deployment

- Unit tests
- API integration tests
- Authentication tests
- End-to-end critical-flow tests
- Production environment configuration
- Vercel deployment
- MySQL production database connection
- Migration execution
- Smoke testing
- Monitoring and error reporting

---

## 9. Antigravity Session Workflow

Use a new session for each distinct task.

Examples:

- Session 1: repository initialization
- Session 2: MySQL schema
- Session 3: authentication API
- Session 4: frontend login and registration
- Session 5: post CRUD API
- Session 6: admin editor
- Session 7: comments and replies
- Session 8: theme system
- Session 9: SEO
- Session 10: Vercel deployment

At the beginning of every session:

1. Read `PROJECT.md`.
2. Read `production.md`.
3. Read `tech.md`.
4. Read `memory.md`.
5. Read the relevant skill file.
6. Inspect the existing code before changing anything.
7. State the exact task and affected files.
8. Work only on the requested scope.
9. Run validation before reporting completion.
10. Update `memory.md` only when a durable project decision or completed feature changes.

At the end of every session, report:

- What was changed
- Files created
- Files modified
- Commands run
- Tests performed
- Known limitations
- Recommended next phase

---

## 10. Definition of Done

A task is complete only when:

- The implementation works
- The affected code is type-safe
- Validation exists
- Error states are handled
- Loading states are handled
- Mobile layout is checked
- Existing functionality is not broken
- Tests or manual verification steps are documented
- No secrets are committed
- No temporary debugging code remains
- Documentation is updated when necessary

A feature must not be marked complete merely because files were created.
