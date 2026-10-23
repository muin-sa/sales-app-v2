import { buildSchema, graphql } from "graphql";
import { sql } from "@/lib/db";
import { listObjects } from "@/lib/storage";
import { invokeHelloFunction } from "@/lib/functions";
import fs from "fs";
import path from "path";

// Load schema from .gql file
const schemaPath = path.join(process.cwd(), "src", "graphql", "schema.gql");
const typeDefs = fs.readFileSync(schemaPath, "utf-8");

export const schema = buildSchema(typeDefs);

// Root resolvers wired to Neon PostgreSQL, Neon Object Storage, and Neon Functions
export const rootValue = {
  contractEntities: async () => {
    const rows = await sql`
      SELECT id, code, name_ar as "nameAr", name_en as "nameEn", city, phone, email, is_active as "isActive"
      FROM contract_entities
      ORDER BY created_at ASC;
    `;
    return rows;
  },

  associations: async ({ entityCode }: { entityCode?: string }) => {
    if (entityCode && entityCode !== "ALL") {
      return await sql`
        SELECT a.id, a.name, a.short_name as "shortName", a.code, a.license_number as "licenseNumber",
               a.category, a.city, a.contact_person as "contactPerson", a.contact_phone as "contactPhone",
               a.contact_email as "contactEmail", a.agreement_commission_rate as "agreementCommissionRate", a.status
        FROM associations a
        JOIN contract_entities ce ON a.entity_id = ce.id
        WHERE ce.code = ${entityCode}
        ORDER BY a.name ASC;
      `;
    }
    return await sql`
      SELECT a.id, a.name, a.short_name as "shortName", a.code, a.license_number as "licenseNumber",
             a.category, a.city, a.contact_person as "contactPerson", a.contact_phone as "contactPhone",
             a.contact_email as "contactEmail", a.agreement_commission_rate as "agreementCommissionRate", a.status
      FROM associations a
      ORDER BY a.name ASC;
    `;
  },

  requests: async ({ status }: { status?: string }) => {
    if (status && status !== "ALL") {
      return await sql`
        SELECT r.id, r.reference_number as "referenceNumber", r.title, r.category, r.status, r.priority,
               r.target_amount as "targetAmount", r.total_bonds_amount as "totalBondsAmount", r.bonds_count as "bondsCount",
               a.name as "associationName", ce.name_ar as "entityName"
        FROM requests r
        JOIN associations a ON r.association_id = a.id
        JOIN contract_entities ce ON r.entity_id = ce.id
        WHERE r.status = ${status}
        ORDER BY r.request_date DESC;
      `;
    }
    return await sql`
      SELECT r.id, r.reference_number as "referenceNumber", r.title, r.category, r.status, r.priority,
             r.target_amount as "targetAmount", r.total_bonds_amount as "totalBondsAmount", r.bonds_count as "bondsCount",
             a.name as "associationName", ce.name_ar as "entityName"
      FROM requests r
      JOIN associations a ON r.association_id = a.id
      JOIN contract_entities ce ON r.entity_id = ce.id
      ORDER BY r.request_date DESC;
    `;
  },

  users: async () => {
    const rows = await sql`
      SELECT id, name, email, phone, role, base_salary as "baseSalary",
             commission_rate as "commissionRate", monthly_target as "monthlyTarget", status
      FROM users
      ORDER BY name ASC;
    `;
    return rows;
  },

  systemHealth: async () => {
    let dbConnected = false;
    let dbVersion = "";
    try {
      const dbRes = await sql`SELECT version();`;
      dbConnected = true;
      dbVersion = dbRes[0]?.version || "";
    } catch {
      dbConnected = false;
    }

    let storageConnected = false;
    let objectCount = 0;
    try {
      const objects = await listObjects();
      storageConnected = true;
      objectCount = objects.length;
    } catch {
      storageConnected = false;
    }

    let functionsConnected = false;
    let fnMsg = "";
    try {
      const fnRes = await invokeHelloFunction();
      functionsConnected = fnRes.status === 200;
      fnMsg = fnRes.message;
    } catch {
      functionsConnected = false;
    }

    return {
      databaseConnected: dbConnected,
      storageConnected,
      functionsConnected,
      databaseVersion: dbVersion,
      objectCount,
      functionResponse: fnMsg,
      timestamp: new Date().toISOString(),
    };
  },
};

/**
 * Execute GraphQL queries safely
 */
export async function executeGraphQL(query: string, variableValues?: Record<string, unknown>) {
  return await graphql({
    schema,
    source: query,
    rootValue,
    variableValues,
  });
}
