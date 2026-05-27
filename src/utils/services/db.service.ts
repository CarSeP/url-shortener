import { Database } from "bun:sqlite";
import { SQL } from "bun";

export const verifyDatabase = async () => {
  const type = process.env.DATABASE;

  if (type == "sqlite") {
    const dbfile = Bun.file("db.sqlite");
    const exists = await dbfile.exists();

    if (!exists) {
      console.log("SQLite database file not found. Creating 'db.sqlite'...");
      createSqliteDB();
    }

    console.log("database provider: SQLite");
    return;
  }

  if (type == "postgresql") {
    const connection = process.env.POSTGRESQL_URL;
    if (!connection) {
      console.error("The POSTGRESQL_URL environment variable was not found");
      return;
    }

    const pg = new SQL(connection);
    const isValid = await validatePostgresql(pg);
    if (!isValid) {
      console.error("PostgreSQL Connection Error");
      return;
    }

    console.log("database provider: PostgreSQL");
    return;
  }

  console.error(
    "You must add an environment variable named DATABASE with the value “sqlite” or “postgresql”",
  );
};

const createSqliteDB = () => {
  try {
    const db = new Database("db.sqlite", { create: true });

    db.exec(
      `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    github_id INTEGER NOT NULL UNIQUE,
    login TEXT NOT NULL,
    avatar_url TEXT,
    name TEXT,
    email TEXT,
    access_token TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS url (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    redirect TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );
`,
    );

    console.log("database created correctly");
    db.close(true);
  } catch (error) {
    console.log(`An error occurred while creating the database: ${error}`);
  }
};

const validatePostgresql = async (connection: SQL) => {
  try {
    console.log("Loading the PostgreSQL connection...");
    await connection`
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  github_id BIGINT NOT NULL UNIQUE,
  login TEXT NOT NULL,
  avatar_url TEXT,
  name TEXT,
  email TEXT,
  access_token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS url (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  redirect TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
`;
    return true;
  } catch (error) {
    return false;
  }
};

export const db = async (query: string, params: string[]) => {
  try {
    const type = process.env.DATABASE;

    if (type == "sqlite") {
      const db = new Database("db.sqlite");

      return db.prepare(query).all(...params);
    }

    if (type == "postgresql") {
      const connection = process.env.POSTGRESQL_URL ?? "";
      const pg = new SQL(connection);
      return await pg.unsafe(query, params);
    }

    throw new Error("There is no database provider");
  } catch (error) {
    console.error(`An error occurred while executing the query: ${error}`);
    return null;
  }
};
