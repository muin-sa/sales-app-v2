import { NextRequest, NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql-schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, variables } = body;

    if (!query) {
      return NextResponse.json({ error: "Missing query parameter in request body" }, { status: 400 });
    }

    const result = await executeGraphQL(query, variables);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "GraphQL execution error";
    return NextResponse.json({ errors: [{ message }] }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const variablesRaw = searchParams.get("variables");
    const variables = variablesRaw ? JSON.parse(variablesRaw) : undefined;

    if (!query) {
      // Return introspection / info if no query is given
      return NextResponse.json({
        service: "Neon GraphQL API",
        status: "Online",
        endpoints: ["POST /api/graphql", "GET /api/graphql?query={systemHealth{databaseConnected}}"],
      });
    }

    const result = await executeGraphQL(query, variables);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "GraphQL execution error";
    return NextResponse.json({ errors: [{ message }] }, { status: 500 });
  }
}
