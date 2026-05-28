# URL Shortener

A lightweight URL shortener application built with Bun, TypeScript, and Elysia. Features user authentication via GitHub OAuth, click tracking, and user dashboards.

## Features

- **URL Shortening**: Create short URLs with automatic code generation
- **User Authentication**: GitHub OAuth integration
- **Click Tracking**: Records IP address and user agent for each redirect
- **User Dashboard**: View your links, statistics, and recent clicks
- **Database Support**: Works with SQLite (development) and PostgreSQL (production)

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Bun |
| Language | TypeScript |
| Framework | Elysia |
| Database | SQLite / PostgreSQL |

## Prerequisites

- Bun installed on your system
- A GitHub OAuth application (for authentication)

## Setup

### 1. Clone the repository

```sh
git clone https://github.com/CarSeP/url-shortener.git
cd url-shortener
```

### 2. Install dependencies

```sh
bun install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and configure the following:

```env
PORT=3000

# GitHub OAuth (required for authentication)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/auth/github/callback

# Database (optional - defaults to SQLite if not set)
# DATABASE_URL=postgresql://user:password@localhost:5432/url_shortener
```

### 4. Create GitHub OAuth App

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set the callback URL to: `http://localhost:3000/auth/github/callback`
4. Copy the Client ID and Client Secret to your `.env` file

## Running

### Development

```sh
bun run dev
```

### Production

```sh
bun run build
bun run start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
url-shortener/
├── dist/                      # Production build
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── code.controller.ts
│   │   └── profile.controller.ts
│   ├── routes/                # API route definitions
│   │   ├── auth.router.ts
│   │   ├── code.router.ts
│   │   └── profile.router.ts
│   ├── utils/
│   │   ├── schemas/           # Request validation schemas
│   │   ├── services/         # Business logic
│   │   │   ├── click.service.ts
│   │   │   ├── code.service.ts
│   │   │   ├── db.service.ts
│   │   │   ├── ip.service.ts
│   │   │   ├── shortUrl.service.ts
│   │   │   ├── url.service.ts
│   │   │   └── user.service.ts
│   │   └── test/              # Unit tests
│   └── views/                 # HTML pages
│       ├── app/               # Main application page
│       └── profile/           # User dashboard page
├── index.ts                   # Application entry point
├── server.ts                  # Server configuration
└── package.json
```

## API Reference

### Create Short URL

Creates a new shortened URL.

```
POST /api
Content-Type: application/json

{
  "url": "https://example.com/abc/123"
}
```

**Response**

```json
{
  "code": "5MgXZJT",
  "newURL": "http://localhost:3000/5MgXZJT"
}
```

### Redirect

Accessing a short code redirects to the original URL and records the click.

```
GET /:code
```

### Get Click Statistics

Retrieves click data for a specific short code.

```
GET /api/clicks/:code
```

### Authentication

#### GitHub Login

```
GET /auth/github
```

Redirects to GitHub authorization page.

#### GitHub Callback

```
GET /auth/github/callback
```

Handles the OAuth callback and sets authentication cookies.

### User Profile (Requires Auth)

#### Get User Links

```
GET /profile/api/links
```

**Response**

```json
[
  {
    "id": 1,
    "redirect": "https://example.com",
    "code": "5MgXZJT",
    "clicks": 42,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

#### Get User Statistics

```
GET /profile/api/stats
```

**Response**

```json
{
  "total_links": 15,
  "total_clicks": 1234,
  "active_links": 12
}
```

#### Delete Link

```
DELETE /profile/api/links/:id
```

#### Get Recent Link Clicks

```
GET /profile/api/links/:code/clicks
```

## Testing

```sh
bun run test
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3000 | Server port |
| `GITHUB_CLIENT_ID` | Yes* | - | GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | Yes* | - | GitHub OAuth Client Secret |
| `GITHUB_REDIRECT_URI` | No | `http://localhost:3000/auth/github/callback` | OAuth callback URL |
| `DATABASE_URL` | No | SQLite file | PostgreSQL connection string |

*Required only if using authentication features.

## License

MIT License
