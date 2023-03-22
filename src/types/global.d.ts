export {};

declare global {
  interface Env {
    OPEN_AI_ACCESS_KEY: string;
    GPT_MODEL: string;
    LINE_CHANNEL_ACCESS_TOKEN: string;
    GPT: any; // KV namespace
  }

  interface ILineHookBody {
    destination: string;
    events: [
      {
        type: "message" | "join";
        message: {
          type: "text";
          id: string;
          text: string;
        };
        webhookEventId: string;
        deliveryContext: any;
        timestamp: number;
        source: any;
        replyToken: string;
        mode: "active";
      }
    ];
  }
}
