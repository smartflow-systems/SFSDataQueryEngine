import { Copy, Edit, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
}

export default function SqlEditor({ value, onChange, onExecute, isExecuting }: SqlEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Copied to clipboard",
        description: "SQL query has been copied to your clipboard.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy SQL query to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (!value) {
    return null;
  }

  return (
    <div className="bg-secondary rounded-lg">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center space-x-2">
          <Edit className="text-muted-foreground" size={16} />
          <span className="text-sm font-medium text-foreground">Generated SQL</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
            data-testid="button-copy-sql"
          >
            <Copy size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground"
            data-testid="button-edit-sql"
          >
            <Edit size={12} />
          </Button>
          <Button
            onClick={onExecute}
            disabled={isExecuting}
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
            data-testid="button-execute-sql"
          >
            {isExecuting ? (
              <>
                <div className="animate-spin w-3 h-3 border border-primary-foreground border-t-transparent rounded-full mr-1" />
                Running
              </>
            ) : (
              <>
                <Play className="mr-1" size={12} />
                Run
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="p-4">
        {isEditing ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-32 bg-transparent border border-border rounded p-2 text-sm font-mono text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            data-testid="textarea-sql-editor"
          />
        ) : (
          <pre className="text-sm font-mono text-foreground overflow-x-auto">
            <code data-testid="code-sql-display">{value}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
