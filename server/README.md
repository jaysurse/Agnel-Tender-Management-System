# Server - Tender Management System

Express-based API for the Tender Management System.

## Setup

1. Copy `.env.example` to `.env` and fill in values.
2. Install dependencies.

```bash
npm install
```

## Development

```bash
npm run dev
```

Server runs on http://localhost:5000 by default.

## Environment Variables

- `PORT` - Port to run the server (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for signing JWTs
- `OPENAI_API_KEY` - API key for AI features (optional for now)
- `NODE_ENV` - Node environment (development/production)

## Routes

- `GET /health` - health check
- `POST /api/auth/login` - login
- `POST /api/auth/register` - register
- `GET /api/auth/me` - get current user
- `GET /api/tenders` - list tenders
- `GET /api/tenders/:id` - get tender by id
- `POST /api/ai/ask` - ask AI (requires auth)
