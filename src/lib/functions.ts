/**
 * Neon Functions Client
 * Invokes serverless functions deployed with Neon Functions
 */
export async function invokeHelloFunction(): Promise<{ message: string; status: number }> {
  const baseUrl = process.env.NEON_FUNCTION_HELLO_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEON_FUNCTION_HELLO_BASE_URL is not defined in environment variables");
  }

  const url = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "text/plain, application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Neon Function invocation failed with HTTP status ${response.status}`);
  }

  const text = await response.text();
  return {
    message: text,
    status: response.status,
  };
}
