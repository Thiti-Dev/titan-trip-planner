import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { replyLineMessage } from "../../utils/line/reply-message";
import OpenAI from "../openai";

export async function proceedFurtherActionFromHookBody(
  hookContext: ILineHookBody,
  env: Env
) {
  const { events } = hookContext;
  if (!events?.length) return;
  const { replyToken, message } = events[0];

  const gptInstance = new OpenAI(env.OPEN_AI_ACCESS_KEY).getInstance();

  const response = await gptInstance.createChatCompletion({
    model: env.GPT_MODEL,
    messages: [
      {
        role: ChatCompletionRequestMessageRoleEnum.Assistant,
        content: message.text,
      },
    ],
  });
  const gptResponseMsg: string = response.data.choices[0].message!.content;
  replyLineMessage(env.LINE_CHANNEL_ACCESS_TOKEN, replyToken, gptResponseMsg);
}
