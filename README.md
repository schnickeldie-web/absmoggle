# ABSMOGGLE

Production-oriented MVP for a competitive live 1v1 fitness battle platform.

## Stack

- Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion
- Prisma ORM with PostgreSQL
- Socket.io signaling skeleton
- WebRTC media helpers
- TensorFlow.js and MediaPipe browser pipeline hooks

## Local setup

```bash
npm install
npm run generate-assets
npm run build
npm run dev
```

Copy `.env.example` to `.env.local` and set `DATABASE_URL` before using Prisma against PostgreSQL.

## Admin access

The admin panel is visible when the selected username matches `NEXT_PUBLIC_INITIAL_ADMIN_USERNAME`.
The default value is `Benjamin`.

## Safety model

ABSMOGGLE scores fitness definition signals only: definition, symmetry, visibility and consistency.
It does not rate attractiveness or body worth. Low confidence, nudity, poor lighting or multiple people should block scoring in production moderation logic.
