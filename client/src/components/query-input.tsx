import { useState } from "react";
import { Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SqlEditor from "@/components/sql-editor";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useDatabases } from "@/hooks/use-database";

interface QueryInputProps {
  onQueryExecuted: (query: any, results: any) => void;
}

export default function QueryInput({ onQueryExecuted }: QueryInputProps) {
  const [naturalLanguage, setNaturalLanguage] = useState("");
  const [generatedSQL, setGeneratedSQL] = useState("");
  const [selectedDatabaseId, setSelectedDatabaseId] = useState("");
  const { toast } = useToast();
  const { data: databases = [] } = useDatabases();

  // Set default database
  useState(() => {
    if (databases.length > 0 && !selectedDatabaseId) {
      setSelectedDatabaseId(databases[0].id);
    }
  });

  const translateMutation = useMutation({
    mutationFn: async (data: { naturalLanguage: string; databaseId?: string }) => {
      const response = await apiRequest("POST", "/api/queries/translate", data);
      return response.json();
    },
    onSuccess: (result) => {
      setGeneratedSQL(result.sql);
      if (result.confidence < 0.7) {
        toast({
          title: "Low Confidence Translation",
          description: `Translation confidence: ${Math.round(result.confidence * 100)}%. Please review the generated SQL.`,
          variant: "default",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Translation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const executeMutation = useMutation({
    mutationFn: async (data: { sql: string; databaseId: string; naturalLanguage?: string }) => {
      const response = await apiRequest("POST", "/api/queries/execute", data);
      return response.json();
    },
    onSuccess: (result) => {
      onQueryExecuted(result.query, result);
      toast({
        title: "Query Executed Successfully",
        description: `Returned ${result.result.rowCount} rows in ${result.result.executionTime}ms`,
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Query Execution Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTranslate = () => {
    if (!naturalLanguage.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a natural language query.",
        variant: "destructive",
      });
      return;
    }

    translateMutation.mutate({
      naturalLanguage: naturalLanguage.trim(),
      databaseId: selectedDatabaseId,
    });
  };

  const handleExecute = () => {
    if (!generatedSQL.trim()) {
      toast({
        title: "SQL Required",
        description: "Please generate or enter a SQL query first.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDatabaseId) {
      toast({
        title: "Database Required",
        description: "Please select a database connection.",
        variant: "destructive",
      });
      return;
    }

    executeMutation.mutate({
      sql: generatedSQL,
      databaseId: selectedDatabaseId,
      naturalLanguage,
    });
  };

  return (
    <div className="bg-card border-b border-border p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Ask a question about your data
        </h2>
        
        {/* Natural Language Input */}
        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="e.g., 'Show me total revenue by month for the last 6 months'"
              value={naturalLanguage}
              onChange={(e) => setNaturalLanguage(e.target.value)}
              className="w-full p-4 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all pr-12"
              data-testid="input-natural-language"
            />
            <Button
              onClick={handleTranslate}
              disabled={translateMutation.isPending}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              data-testid="button-translate"
            >
              {translateMutation.isPending ? (
                <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              ) : (
                <Sparkles size={16} />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              <Lightbulb className="inline w-3 h-3 mr-1" />
              Try: "List all users who signed up this week" or "Compare sales between Q1 and Q2"
            </p>
            {databases.length > 0 && (
              <select
                value={selectedDatabaseId}
                onChange={(e) => setSelectedDatabaseId(e.target.value)}
                className="text-xs bg-input border border-border rounded px-2 py-1 text-foreground"
                data-testid="select-database"
              >
                {databases.map((db) => (
                  <option key={db.id} value={db.id}>
                    {db.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Generated SQL Query */}
        <SqlEditor
          value={generatedSQL}
          onChange={setGeneratedSQL}
          onExecute={handleExecute}
          isExecuting={executeMutation.isPending}
        />
      </div>
    </div>
  );
}
