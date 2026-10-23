import { neon, Pool } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local for DATABASE_URL
const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const match = envFile.match(/DATABASE_URL="?([^"\r\n]+)"?/);
if (!match) {
  console.error("No DATABASE_URL found in .env.local");
  process.exit(1);
}
const databaseUrl = match[1];
console.log("Connecting to Neon Postgres via serverless driver...");

const pool = new Pool({ connectionString: databaseUrl });
const sql = neon(databaseUrl);

async function run() {
  try {
    // Check connection
    const testResult = await sql`SELECT version(), current_database(), current_user;`;
    console.log("Connected successfully to Neon Postgres!", testResult[0]);

    // Read schema.sql
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Make sure auth schema, roles & auth.uid() function exist for RLS policies
    console.log("Applying auth schema and role stubs for RLS policies...");
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
          CREATE ROLE authenticated;
        END IF;
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
          CREATE ROLE anon;
        END IF;
      END
      $$;

      CREATE SCHEMA IF NOT EXISTS auth;
      CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
      BEGIN
        RETURN NULL::UUID;
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log("Executing schema.sql via pool simple query protocol...");
    await pool.query(schemaSql);
    console.log("schema.sql executed successfully!");

    // Read seed.sql
    const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    console.log("Executing seed.sql via pool simple query protocol...");
    await pool.query(seedSql);
    console.log("seed.sql executed successfully!");

    // Verify row counts
    const entities = await sql`SELECT count(*) FROM contract_entities;`;
    const users = await sql`SELECT count(*) FROM users;`;
    const associations = await sql`SELECT count(*) FROM associations;`;
    const requests = await sql`SELECT count(*) FROM requests;`;
    const logs = await sql`SELECT count(*) FROM operation_logs;`;

    console.log("Data verification:", {
      contract_entities: Number(entities[0].count),
      users: Number(users[0].count),
      associations: Number(associations[0].count),
      requests: Number(requests[0].count),
      operation_logs: Number(logs[0].count)
    });

    await pool.end();
  } catch (err) {
    console.error("Migration error:", err);
    await pool.end();
    process.exit(1);
  }
}

run();

