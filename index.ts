import { createServer } from "./src/server";

const PORT = process.env.PORT || "3000"

const server = createServer(PORT);

console.log(`Server running at ${server.url}`);
