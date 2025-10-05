export interface ChatCompletionMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatCompletionMessage[];
  response_format?: { type: string };
}

export interface ChatCompletionChoice {
  index: number;
  finish_reason: string;
  message: {
    role: "assistant";
    content: string | null;
  };
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
}

export interface OpenAIClientOptions {
  apiKey?: string;
  baseURL?: string;
}

export default class OpenAI {
  constructor(options?: OpenAIClientOptions);
  chat: {
    completions: {
      create(request: Partial<ChatCompletionRequest>): Promise<ChatCompletionResponse>;
    };
  };
}
