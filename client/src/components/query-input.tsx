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
    <div className="bg-[rgba(45,31,26,0.5)] border-b-2 border-[rgba(212,175,55,0.3)] p-8 smooth-transition backdrop-blur-[10px]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-3 gradient-gold-text drop-shadow-[0_4px_8px_rgba(212,175,55,0.3)]">
          Ask Your Data Anything
        </h2>
        <p className="text-[#cbbf9b] mb-5 text-lg">Transform your questions into powerful SQL queries instantly</p>
        
        {/* Natural Language Input */}
        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="e.g., 'Show me total revenue by month for the last 6 months'"
              value={naturalLanguage}
              onChange={(e) => setNaturalLanguage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTranslate()}
              className="w-full p-5 bg-[rgba(212,175,55,0.08)] backdrop-blur-sm border-2 border-[rgba(212,175,55,0.3)] rounded-xl text-[#e9e6df] placeholder:text-[#9a8f80] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] smooth-transition pr-14 text-base hover:border-[#d4af37] shadow-[0_4px_15px_rgba(212,175,55,0.1)]"
              data-testid="input-natural-language"
            />
            <Button
              onClick={handleTranslate}
              disabled={translateMutation.isPending}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-3 gradient-gold text-[#0b0b0b] font-bold rounded-lg hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] hover:scale-105 smooth-transition disabled:opacity-50 disabled:scale-100 border-2 border-[#d4af37]"
              data-testid="button-translate"
            >
              {translateMutation.isPending ? (
                <div className="animate-spin w-5 h-5 border-2 border-[#0b0b0b] border-t-transparent rounded-full" />
              ) : (
                <Sparkles size={20} className="animate-pulse-gold" />
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
