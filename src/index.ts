import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { proceedFurtherActionFromHookBody } from "./core/line";
import OpenAI from "./core/openai";
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
    context.waitUntil(proceedFurtherActionFromHookBody(hookBody, env)); // perform the task after returning the response

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } else if (
    request.url.endsWith("/api/chat-with-gpt") &&
    request.method === "POST"
  ) {
    const gptInstance = new OpenAI(env.OPEN_AI_ACCESS_KEY).getInstance();
    const body: any = await request.json();
    if (!body.msg)
      return new Response("msg is required in a body", { status: 400 });

    const response = await gptInstance.createChatCompletion({
      model: env.GPT_MODEL,
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.Assistant,
          content: `
            ${body.msg}
            `,
        },
      ],
    });

    const gptResponseMsg: string = response.data.choices[0].message!.content;
    return new Response(
      JSON.stringify({
        success: true,
        gpt_response: gptResponseMsg,
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
