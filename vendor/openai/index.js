class OpenAI {
  constructor(config = {}) {
    this.apiKey = config.apiKey ?? "";
    this.chat = {
      completions: {
        create: async ({ messages = [] } = {}) => {
          const userMessages = messages.filter(message => message?.role === "user");
          const lastUserMessage = userMessages[userMessages.length - 1]?.content ?? "";
          const isValidationRequest = typeof lastUserMessage === "string" && lastUserMessage.includes("Analyze the following SQL query");

          if (isValidationRequest) {
            return {
              id: "chatcmpl-local-validate",
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      isValid: true,
                      errors: [],
                      optimizations: ["Consider adding indexes to frequently filtered columns."],
                      estimatedPerformance: "good"
                    })
                  }
                }
              ]
            };
          }

          return {
            id: "chatcmpl-local-translate",
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    sql: "SELECT 1;",
                    explanation: "Generates a simple connectivity check query.",
                    confidence: 0.6,
                    suggestions: [
                      "SELECT COUNT(*) FROM example_table;"
                    ]
                  })
                }
              }
            ]
          };
        }
      }
    };
  }
}

export default OpenAI;
