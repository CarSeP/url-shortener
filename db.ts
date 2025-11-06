import { Database } from "bun:sqlite";

const db = new Database("db.sqlite", { create: true });

db.exec(
  `
  CREATE TABLE IF NOT EXISTS url (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    redirect TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE
  );
`,
);

db.close(true);
