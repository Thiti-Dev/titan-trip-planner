export function replyLineMessage(
  channelToken: string,
  replyToken: string,
  message: string
) {
  return fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${channelToken}`,
    },
    body: JSON.stringify({
      replyToken: replyToken,
      messages: [
        {
          type: "text",
          text: message,
        },
      ],
    }),
  });
}
