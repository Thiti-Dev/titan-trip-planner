import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { replyLineMessage } from "../../utils/line/reply-message";
import OpenAI from "../openai";

export async function proceedFurtherActionFromHookBody(
  hookContext: ILineHookBody,
  env: Env
) {
  const { events } = hookContext;
  if (!events?.length) return;
  const { replyToken, message, source } = events[0];

  if (source.type !== "group") {
    replyLineMessage(
      env.LINE_CHANNEL_ACCESS_TOKEN,
      replyToken,
      "I will only be fully functionable if you invite me to some of your group"
    );
    return;
  }

  if (!message.text.startsWith("#")) return;
  if (message.text === "#clear") {
    await env.GPT.delete(source.groupId);
    replyLineMessage(
      env.LINE_CHANNEL_ACCESS_TOKEN,
      replyToken,
      "My memories just got cleared. If you need my help just put the '#' before the message that you want to speak with me"
    );
  }

  const previousContextMemory = await env.GPT.get(source.groupId);
  const gptInstance = new OpenAI(env.OPEN_AI_ACCESS_KEY).getInstance();

  const response = await gptInstance.createChatCompletion({
    model: env.GPT_MODEL,
    messages: [
      {
        role: ChatCompletionRequestMessageRoleEnum.Assistant,
        content: `
        I want you to act as a trip planner. 
        I will write you my travel desires and you will suggest a place to visit in each day with the time range per place. 
        In some cases, I will also give you the type of places I will visit. You will also suggest me places of similar type that are close to my first location. 
        And also in some cases, I will also give you the suggest-trip that you've suggested to me to be the reminder for you that you should align in this context.
        And remember to be always response with the full list of the trip. And no word will be ever spoken out from you except the Day1, Day2, Day3 ... format with places and time only

        ${
          previousContextMemory
            ? `
        
        Here is the suggest-trip that you've suggested to me before within the bracket below

        {

          ${previousContextMemory}

        }

        and if the above suggested that made from you only have number of specific day and I am not telling you to add another extra day, please don't add another day just remain the same day. And if i tell you to change the place on specific day, please do be always remember that you can only respond with the information that you given from day1 to the end.
        
        `
            : ``
        }
        

        .My suggestion request is "${message.text}.""
        `,
      },
    ],
  });
  const gptResponseMsg: string = response.data.choices[0].message!.content;
  if (gptResponseMsg.includes("Day 1") || gptResponseMsg.includes("Day1"))
    await env.GPT.put(source.groupId, gptResponseMsg); // remember if it spill out the full list
  replyLineMessage(env.LINE_CHANNEL_ACCESS_TOKEN, replyToken, gptResponseMsg);
}
