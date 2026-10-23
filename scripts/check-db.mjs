import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const match = envFile.match(/DATABASE_URL="?([^"\r\n]+)"?/);
const databaseUrl = match ? match[1] : 'postgresql://neondb_owner:npg_8Bfig0ucTMDN@ep-wild-star-b491xygw-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';

const sql = neon(databaseUrl);

async function main() {
  console.log("Querying Neon Postgres database overview...");
  
  const [dbInfo, tables, extensions] = await Promise.all([
    sql`SELECT version() as pg_version, current_database() as db_name, current_user as db_user;`,
    sql`
      SELECT 
        table_name,
        (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
      FROM (
        SELECT 
          table_name, 
          query_to_xml(format('SELECT count(*) as cnt FROM %I.%I', table_schema, table_name), false, true, '') as xml_count
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ) t
      ORDER BY table_name;
    `,
    sql`SELECT extname, extversion FROM pg_extension ORDER BY extname;`
  ]);

  console.log("\n=== DATABASE INFORMATION ===");
  console.log("Database:", dbInfo[0].db_name);
  console.log("User:", dbInfo[0].db_user);
  console.log("Version:", dbInfo[0].pg_version);

  console.log("\n=== PUBLIC TABLES & ROW COUNTS ===");
  for (const t of tables) {
    console.log(`  • ${t.table_name.padEnd(25)} : ${t.row_count} rows`);
  }

  console.log("\n=== EXTENSIONS ===");
  for (const ext of extensions) {
    console.log(`  • ${ext.extname.padEnd(20)} : v${ext.extversion}`);
  }
}

main().catch(console.error);
