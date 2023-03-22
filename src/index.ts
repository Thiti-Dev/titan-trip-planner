import { handleOptionsRequest } from "./request-handlers/cors";

async function fetch(
  request: Request,
  env: Env,
  context: ExecutionContext
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return handleOptionsRequest(request);
  }
  const response = new Response(
    JSON.stringify({
      success: true,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return response;
}

export default {
  fetch,
};
