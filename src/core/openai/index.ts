import { Configuration, OpenAIApi } from "openai";
import fetchAdapter from "@vespaiach/axios-fetch-adapter";

export default class OpenAI {
  private instance: OpenAIApi;
  constructor(apiKey: string) {
    this.instance = this.init(apiKey);
  }
  private init(apiKey: string): OpenAIApi {
    const configuration = new Configuration({
      apiKey: apiKey,
      baseOptions: {
        adapter: fetchAdapter,
      },
    });

    return new OpenAIApi(configuration);
  }

  public getInstance(): OpenAIApi {
    return this.instance;
  }
}
