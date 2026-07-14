# Vercel Deployment Checklist

This guide outlines the steps required to manually deploy the application to Vercel and configure the environment variables, since the database is not provisioned yet and automatic migration on every build is disabled.

## 1. Prerequisites
- A Vercel account.
- An externally managed MySQL 8 database provisioned (e.g., PlanetScale, AWS RDS, DigitalOcean).
- A Cloudinary account (or another media provider) for image uploads.

## 2. Environment Variables Configuration
Before deploying, ensure you have the following environment variables ready. You will need to paste these into the Vercel dashboard under **Settings > Environment Variables**.

```env
NODE_ENV=production

# Database
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME?sslaccept=strict"

# Application URLs
APP_URL="https://your-production-domain.com"
API_URL="https://your-production-domain.com/api/v1"
WEB_URL="https://your-production-domain.com"

# Security Secrets (Generate strong random strings)
JWT_ACCESS_SECRET="generate_a_secure_random_string_here"
JWT_REFRESH_SECRET="generate_a_secure_random_string_here"
ACCESS_TOKEN_TTL="15m"
REFRESH_TOKEN_TTL="7d"

# Cookies
COOKIE_DOMAIN=".your-production-domain.com"
COOKIE_SECURE="true"

# Cloudinary (Media Provider)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

## 3. Database Migration
Since automatic migrations (`prisma migrate deploy`) are disabled in the Vercel build step (as per request), you must manually apply the migrations to your production database once it's provisioned.

Run this command locally or from a secure terminal with access to the production DB:
```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME?sslaccept=strict" npx prisma migrate deploy
```

## 4. Deploying to Vercel
1. Install the Vercel CLI globally if you haven't: `npm i -g vercel`.
2. Run `vercel` from the root of this project.
3. Follow the prompts to link the project.
4. Go to your Vercel Dashboard, select the project, and navigate to **Settings > Environment Variables**. Add all variables from Step 2.
5. Trigger a new production deployment from the Vercel dashboard, or run `vercel --prod` locally.

## 5. Smoke Testing
After the deployment is green:
1. Visit the home page to ensure the React app loads correctly.
2. Attempt to register a new user to verify Database connectivity and Auth.
3. Access `/admin` to verify roles and permissions.
4. Submit a form on the Contact page to verify API handling.
