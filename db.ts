import { SQL } from "bun";

const pg = new SQL(process.env.POSTGRESQL_URL || "");

await pg`
 CREATE TABLE IF NOT EXISTS url (
    id BIGSERIAL PRIMARY KEY,
    redirect TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE
);
`;
