import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface SQLTranslationResult {
  sql: string;
  explanation: string;
  confidence: number;
  suggestions?: string[];
}

export async function translateNaturalLanguageToSQL(
  naturalLanguage: string,
  tableSchema?: string
): Promise<SQLTranslationResult> {
  try {
    const schemaContext = tableSchema ? `\n\nDatabase Schema:\n${tableSchema}` : "";
    
    const prompt = `You are an expert SQL developer. Convert the following natural language query into a valid SQL statement.

Natural Language Query: "${naturalLanguage}"${schemaContext}

Please respond with a JSON object containing:
- sql: The SQL query as a string
- explanation: A brief explanation of what the query does
- confidence: A number between 0-1 indicating your confidence in the translation
- suggestions: Optional array of alternative query suggestions

Ensure the SQL is safe, properly formatted, and follows best practices. If you're unsure about table names or structure, use common patterns and include comments.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a SQL expert that converts natural language to SQL queries. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      sql: result.sql || "",
      explanation: result.explanation || "",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      suggestions: result.suggestions || []
    };
  } catch (error) {
    throw new Error(`Failed to translate natural language to SQL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function validateAndOptimizeSQL(sql: string): Promise<{
  isValid: boolean;
  errors?: string[];
  optimizations?: string[];
  estimatedPerformance?: 'excellent' | 'good' | 'fair' | 'poor';
}> {
  try {
    const prompt = `Analyze the following SQL query for validity and optimization opportunities:

SQL Query: ${sql}

Please respond with a JSON object containing:
- isValid: boolean indicating if the SQL syntax is valid
- errors: array of error descriptions if invalid
- optimizations: array of optimization suggestions
- estimatedPerformance: string indicating performance estimate ('excellent', 'good', 'fair', or 'poor')`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a SQL optimization expert. Analyze queries for validity and performance. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    throw new Error(`Failed to validate SQL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
