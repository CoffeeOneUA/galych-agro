import { Pool } from "pg";
import { defaultContent, mergeWithDefaults } from "./defaultContent";

let pool;

function getPool() {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        "POSTGRES_URL (or DATABASE_URL) environment variable is not set."
      );
    }
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes("sslmode=disable")
        ? false
        : { rejectUnauthorized: false }
    });
  }
  return pool;
}

export async function getContent() {
  const { rows } = await getPool().query(
    "select data from site_content where id = 1;"
  );
  if (!rows.length || !rows[0].data || Object.keys(rows[0].data).length === 0) {
    return defaultContent();
  }
  return mergeWithDefaults(rows[0].data);
}

export async function saveContent(content) {
  await getPool().query(
    `insert into site_content (id, data, updated_at)
     values (1, $1::jsonb, now())
     on conflict (id) do update
       set data = $1::jsonb,
           updated_at = now();`,
    [JSON.stringify(content)]
  );
}

export async function recordLoginAttempt(ip, success) {
  await getPool().query(
    "insert into login_attempts (ip, success) values ($1, $2);",
    [ip, success]
  );
}

export async function isRateLimited(ip, maxAttempts = 5, windowMinutes = 15) {
  const { rows } = await getPool().query(
    `select count(*)::int as failed_count
     from login_attempts
     where ip = $1
       and success = false
       and attempted_at > now() - ($2 || ' minutes')::interval;`,
    [ip, windowMinutes]
  );
  return rows[0].failed_count >= maxAttempts;
}
