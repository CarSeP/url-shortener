import { createServer } from "./src/server";
import { verifyDatabase } from "./src/services/db.service";

const PORT = process.env.PORT || "3000";

const server = createServer();

server.listen(PORT, ({ hostname, port }) => {
  console.log(`Server is running at ${hostname}:${port}`);
});

await verifyDatabase();
