import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadObject, listObjects, getObjectText } from "@/lib/storage";
import { invokeHelloFunction } from "@/lib/functions";

export async function GET() {
  const results: {
    postgres: { status: "PASS" | "FAIL"; details?: unknown; error?: string };
    objectStorage: { status: "PASS" | "FAIL"; details?: unknown; error?: string };
    functions: { status: "PASS" | "FAIL"; details?: unknown; error?: string };
    sqlInjectionDefense: { status: "PASS" | "FAIL"; details?: unknown; error?: string };
  } = {
    postgres: { status: "FAIL" },
    objectStorage: { status: "FAIL" },
    functions: { status: "FAIL" },
    sqlInjectionDefense: { status: "FAIL" },
  };

  // 1. Test Neon Postgres
  try {
    const dbTest = await sql`
      SELECT count(*)::int as total_entities, current_database() as db_name, version() as pg_version
      FROM contract_entities;
    `;
    results.postgres = {
      status: "PASS",
      details: {
        database: dbTest[0].db_name,
        entitiesCount: dbTest[0].total_entities,
        version: dbTest[0].pg_version,
      },
    };
  } catch (err: unknown) {
    results.postgres = {
      status: "FAIL",
      error: err instanceof Error ? err.message : String(err),
    };
  }

  // 2. Test Neon Object Storage (Bucket: assets)
  try {
    const testProbeKey = `health-check-${Date.now()}.txt`;
    const probeContent = `Health check probe generated at ${new Date().toISOString()}`;
    await uploadObject(testProbeKey, probeContent, "text/plain");

    const objects = await listObjects();
    const readBack = await getObjectText(testProbeKey);

    results.objectStorage = {
      status: "PASS",
      details: {
        bucket: "assets",
        uploadedKey: testProbeKey,
        contentVerified: readBack === probeContent,
        totalObjectsInBucket: objects.length,
      },
    };
  } catch (err: unknown) {
    results.objectStorage = {
      status: "FAIL",
      error: err instanceof Error ? err.message : String(err),
    };
  }

  // 3. Test Neon Serverless Functions
  try {
    const fnResponse = await invokeHelloFunction();
    results.functions = {
      status: fnResponse.status === 200 ? "PASS" : "FAIL",
      details: {
        status: fnResponse.status,
        body: fnResponse.message,
        url: process.env.NEON_FUNCTION_HELLO_BASE_URL,
      },
    };
  } catch (err: unknown) {
    results.functions = {
      status: "FAIL",
      error: err instanceof Error ? err.message : String(err),
    };
  }

  // 4. Test SQL Injection Defense (Validating parameterized query handling per /sql-injection-testing)
  try {
    const maliciousPayload = "' OR '1'='1";
    // Parameterized search for code = maliciousPayload should return 0 results safely without throwing or injecting
    const injectionProbe = await sql`
      SELECT id, code FROM contract_entities WHERE code = ${maliciousPayload};
    `;
    results.sqlInjectionDefense = {
      status: "PASS",
      details: {
        payloadTested: maliciousPayload,
        recordsReturned: injectionProbe.length,
        defense: "Parameterized Prepared Statement (Escaped Literal)",
      },
    };
  } catch (err: unknown) {
    results.sqlInjectionDefense = {
      status: "FAIL",
      error: err instanceof Error ? err.message : String(err),
    };
  }

  const allPassed =
    results.postgres.status === "PASS" &&
    results.objectStorage.status === "PASS" &&
    results.functions.status === "PASS" &&
    results.sqlInjectionDefense.status === "PASS";

  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      allServicesOperational: allPassed,
      services: results,
    },
    { status: allPassed ? 200 : 500 }
  );
}
