import { SQL } from "bun";

export const pg = new SQL(process.env.POSTGRESQL_URL || "");
