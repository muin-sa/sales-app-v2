import { neon, Pool } from "@neondatabase/serverless";

// Ensure DATABASE_URL is available
const databaseUrl = process.env.DATABASE_URL || "";

if (!databaseUrl && process.env.NODE_ENV !== "production") {
  console.warn("⚠️ Warning: DATABASE_URL is not set in environment.");
}

/**
 * Neon Serverless SQL Client (Connectionless over HTTP)
 * Optimal for Next.js App Router, Server Components, and Edge/Serverless functions.
 * All template literals are automatically parameterized to prevent SQL Injection.
 */
export const sql = neon(databaseUrl);

/**
 * Neon Connection Pool for complex multi-statement transactions or bulk queries.
 */
export const pool = new Pool({ connectionString: databaseUrl });

/**
 * Safely query contract entities using parameterized SQL
 */
export async function getContractEntities() {
  return await sql`
    SELECT id, code, name_ar, name_en, cr_number, tax_number, phone, email, city, is_active
    FROM contract_entities
    ORDER BY created_at ASC;
  `;
}

/**
 * Safely query associations with optional entity filter (parameterized against SQL injection)
 */
export async function getAssociations(entityCode?: string) {
  if (entityCode && entityCode !== "ALL") {
    return await sql`
      SELECT a.*, ce.name_ar as entity_name, ce.code as entity_code
      FROM associations a
      JOIN contract_entities ce ON a.entity_id = ce.id
      WHERE ce.code = ${entityCode}
      ORDER BY a.name ASC;
    `;
  }
  return await sql`
    SELECT a.*, ce.name_ar as entity_name, ce.code as entity_code
    FROM associations a
    JOIN contract_entities ce ON a.entity_id = ce.id
    ORDER BY a.name ASC;
  `;
}

/**
 * Safely query requests with parameterized filter
 */
export async function getRequests(status?: string) {
  if (status && status !== "ALL") {
    return await sql`
      SELECT r.*, a.name as association_name, ce.name_ar as entity_name
      FROM requests r
      JOIN associations a ON r.association_id = a.id
      JOIN contract_entities ce ON r.entity_id = ce.id
      WHERE r.status = ${status}
      ORDER BY r.request_date DESC;
    `;
  }
  return await sql`
    SELECT r.*, a.name as association_name, ce.name_ar as entity_name
    FROM requests r
    JOIN associations a ON r.association_id = a.id
    JOIN contract_entities ce ON r.entity_id = ce.id
    ORDER BY r.request_date DESC;
  `;
}

/**
 * Safely query licenses
 */
export async function getLicenses() {
  return await sql`
    SELECT l.*, a.name as association_name
    FROM licenses l
    JOIN associations a ON l.association_id = a.id
    ORDER BY l.expiry_date ASC;
  `;
}

/**
 * Safely query audit/operation logs
 */
export async function getOperationLogs(limit = 50) {
  return await sql`
    SELECT *
    FROM operation_logs
    ORDER BY created_at DESC
    LIMIT ${limit};
  `;
}
