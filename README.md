# MedMatch

Visual clickable prototype for a healthcare training platform.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Lucide icons

## Notes

This is a **visual prototype only**:

- No database
- No real authentication
- No APIs
- Static mock data only

## Routes

- `/` — Landing
- `/sign-in`
- `/create-account`
- `/onboarding` (+ steps)
- `/dashboard`
- `/profile`
- `/opportunities`
- `/opportunities/[slug]`
- `/applications`
- `/saved`
- `/notifications`

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production checks

```bash
npm run lint
npm run typecheck
npm run build
```

Or run everything:

```bash
npm run check
```

## Deploy on Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the project in [Vercel](https://vercel.com/new).
3. Framework Preset: **Next.js** (auto-detected).
4. Build Command: `npm run build`
5. Output: Next.js default (no override needed).
6. Node.js: **20.x** or newer.
7. Deploy.

No environment variables are required for this prototype.
