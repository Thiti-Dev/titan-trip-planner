import { proceedFurtherActionFromHookBody } from "./core/line";
import { handleOptionsRequest } from "./request-handlers/cors";

async function fetch(
  request: Request,
  env: Env,
  context: ExecutionContext
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return handleOptionsRequest(request);
  }

  if (request.url.endsWith("/api/line-hook") && request.method === "POST") {
    const hookBody = await request.json<ILineHookBody>();
    proceedFurtherActionFromHookBody(hookBody, env);

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } else {
    return new Response("Not Found", { status: 404 });
  }
}

export default {
  fetch,
};
