import { replyLineMessage } from "../../utils/line/reply-message";

export function proceedFurtherActionFromHookBody(
  hookContext: ILineHookBody,
  env: Env
) {
  const { events } = hookContext;
  if (!events?.length) return;
  const { replyToken, message } = events[0];
  replyLineMessage(env.LINE_CHANNEL_ACCESS_TOKEN, replyToken, message.text);
}
