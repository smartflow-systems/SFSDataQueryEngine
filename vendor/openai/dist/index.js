const DEFAULT_SQL = "SELECT * FROM data";

function buildTranslationResponse(userContent) {
  const naturalLanguageMatch = userContent.match(/Natural Language Query:\s*\"([\s\S]*?)\"/);
  const naturalLanguage = naturalLanguageMatch ? naturalLanguageMatch[1].trim() : "";

  let sql = DEFAULT_SQL;
  if (/count/i.test(naturalLanguage)) {
    sql = "SELECT COUNT(*) AS total FROM data";
  } else if (/list|show/i.test(naturalLanguage) && /customers?/i.test(naturalLanguage)) {
    sql = "SELECT * FROM customers";
  } else if (/orders?/i.test(naturalLanguage)) {
    sql = "SELECT * FROM orders";
  }

  const explanation = naturalLanguage
    ? `Generated SQL for the request: ${naturalLanguage}`
    : "Generated a default SQL query.";

  return {
    sql,
    explanation,
    confidence: naturalLanguage ? 0.6 : 0.4,
    suggestions: []
  };
}

function buildValidationResponse(userContent) {
  const sqlMatch = userContent.match(/SQL Query:\s*([\s\S]*)/);
  const sql = sqlMatch ? sqlMatch[1].trim() : DEFAULT_SQL;
  const isValid = /select/i.test(sql);

  return {
    isValid,
    errors: isValid ? [] : ["Only SELECT statements are supported in mock mode."],
    optimizations: isValid ? ["Ensure necessary indexes exist for filtered columns."] : [],
    estimatedPerformance: isValid ? "good" : "fair"
  };
}

class MockOpenAI {
  constructor(options = {}) {
    this.apiKey = options.apiKey ?? "";
    this.chat = {
      completions: {
        create: async (request = {}) => {
          const userMessage = Array.isArray(request.messages)
            ? request.messages.find(message => message && message.role === "user")
            : null;
          const userContent = typeof (userMessage && userMessage.content) === "string"
            ? userMessage.content
            : "";

          const payload = userContent.includes("Analyze the following SQL query")
            ? buildValidationResponse(userContent)
            : buildTranslationResponse(userContent);

          return {
            id: "mock-chatcmpl",
            object: "chat.completion",
            created: Math.floor(Date.now() / 1000),
            model: request.model ?? "gpt-mock",
            choices: [
              {
                index: 0,
                finish_reason: "stop",
                message: {
                  role: "assistant",
                  content: JSON.stringify(payload)
                }
              }
            ]
          };
        }
      }
    };
  }
}

export default MockOpenAI;
