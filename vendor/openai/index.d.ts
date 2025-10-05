export interface ChatCompletionMessage {
  role: string;
  content?: string;
}

export interface ChatCompletionChoice {
  message: {
    content?: string | null;
  };
}

export interface ChatCompletionCreateParams {
  model?: string;
  messages?: ChatCompletionMessage[];
  response_format?: { type: string };
}

export interface ChatCompletion {
  id: string;
  choices: ChatCompletionChoice[];
}

export interface OpenAIConfig {
  apiKey?: string;
}

declare class OpenAI {
  constructor(config?: OpenAIConfig);
  chat: {
    completions: {
      create(params: ChatCompletionCreateParams): Promise<ChatCompletion>;
    };
  };
}

export default OpenAI;
