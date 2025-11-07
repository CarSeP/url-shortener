# Url shortener
A lightweight application written with Bun that uses SQLite as a database to store and manage short URL redirects.

## Technologies

- Bun
- TypeScript
- Sqlite

## Installation

Clone the repository:
```sh
git clone https://github.com/CarSeP/url-shortener.git
cd url-shortener
```

Install the dependencies
```sh
bun install
```

Runs database migrations
```sh
bun run migrate
```

## Usage

Development
```sh
bun run dev
```

Production
```sh
bun run build
bun run start
```

The application will be available at: http://localhost:3000

## Api

**Create shortened URL**
<br>
Endpoint: `POST /api`
Body:
```json
{
	"url": "https://example.com/abc/123"
}
```
Response:
```json
{
  "code": "5MgXZJT",
  "newURL": "http://localhost:3000/5MgXZJT"
}
```

**Redirection**
<br>
Endpoint: `GET /:code`
<br>
Automatically redirects to the original URL associated with the code.

## Testing

Run the test suite
```sh
bun run test
```

## Project Structure

```plaintext
Url shortener/
├── dist/             # Production build
├── src/              # Resources
│   ├── controllers/  # Endpoint logic
│   ├── public/       # Static files
│   ├── services/     # Functions
│   ├── test/         # Unit tests
│   ├── route.ts      # File responsible for routes
│   ├── server.ts     # File responsible for initializing the server
├── db.ts             # Initialize the database
├── index.ts          # Initialize the server
└── ...               # Other configuration files
```

## License
Distributed under the MIT License.
