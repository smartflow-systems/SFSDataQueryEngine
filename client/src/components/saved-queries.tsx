import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Bookmark,
  BookmarkPlus,
  Play,
  Trash2,
  Search,
  Star,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface SavedQuery {
  id: string;
  name: string;
  description: string;
  query: string;
  createdAt: string;
  lastUsed?: string;
  useCount: number;
  tags: string[];
  isFavorite: boolean;
}

interface SavedQueriesProps {
  onExecuteQuery?: (query: string) => void;
}

export default function SavedQueries({ onExecuteQuery }: SavedQueriesProps) {
  const [queries, setQueries] = useState<SavedQuery[]>([]);
  const [isAddingQuery, setIsAddingQuery] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newQuery, setNewQuery] = useState({
    name: "",
    description: "",
    query: "",
    tags: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load saved queries from localStorage
    const savedQueries = localStorage.getItem("savedQueries");
    if (savedQueries) {
      setQueries(JSON.parse(savedQueries));
    }
  }, []);

  const saveToLocalStorage = (updatedQueries: SavedQuery[]) => {
    localStorage.setItem("savedQueries", JSON.stringify(updatedQueries));
    setQueries(updatedQueries);
  };

  const addQuery = () => {
    if (!newQuery.name || !newQuery.query) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and query.",
        variant: "destructive",
      });
      return;
    }

    const query: SavedQuery = {
      id: Date.now().toString(),
      name: newQuery.name,
      description: newQuery.description,
      query: newQuery.query,
      createdAt: new Date().toISOString(),
      useCount: 0,
      tags: newQuery.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      isFavorite: false,
    };

    const updatedQueries = [...queries, query];
    saveToLocalStorage(updatedQueries);

    setNewQuery({ name: "", description: "", query: "", tags: "" });
    setIsAddingQuery(false);

    toast({
      title: "Query Saved",
      description: `"${query.name}" has been saved successfully.`,
    });
  };

  const deleteQuery = (id: string) => {
    const updatedQueries = queries.filter((q) => q.id !== id);
    saveToLocalStorage(updatedQueries);

    toast({
      title: "Query Deleted",
      description: "The query has been removed from your saved queries.",
    });
  };

  const executeQuery = (query: SavedQuery) => {
    const updatedQueries = queries.map((q) =>
      q.id === query.id
        ? { ...q, lastUsed: new Date().toISOString(), useCount: q.useCount + 1 }
        : q
    );
    saveToLocalStorage(updatedQueries);

    if (onExecuteQuery) {
      onExecuteQuery(query.query);
    }

    toast({
      title: "Query Executed",
      description: `Running "${query.name}"...`,
    });
  };

  const toggleFavorite = (id: string) => {
    const updatedQueries = queries.map((q) =>
      q.id === id ? { ...q, isFavorite: !q.isFavorite } : q
    );
    saveToLocalStorage(updatedQueries);
  };

  const filteredQueries = queries.filter(
    (q) =>
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedQueries = [...filteredQueries].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return b.useCount - a.useCount;
  });

  return (
    <div className="space-y-4">
      <Card className="sfs-card">
        <CardHeader className="border-b border-gold-700/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gold-300 flex items-center gap-2">
              <Bookmark className="w-5 h-5" />
              Saved Queries
            </CardTitle>
            <Button
              onClick={() => setIsAddingQuery(!isAddingQuery)}
              className="btn-gold"
              size="sm"
            >
              <BookmarkPlus className="w-4 h-4 mr-2" />
              Save New Query
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-300/50 w-4 h-4" />
              <Input
                placeholder="Search queries by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black-900 border-gold-700/30 text-gold-100"
              />
            </div>
          </div>

          {/* Add New Query Form */}
          {isAddingQuery && (
            <div className="mb-6 p-4 border border-gold-700/30 rounded-lg bg-black-900/50 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="queryName" className="text-gold-100">
                  Query Name *
                </Label>
                <Input
                  id="queryName"
                  value={newQuery.name}
                  onChange={(e) => setNewQuery({ ...newQuery, name: e.target.value })}
                  className="bg-black-900 border-gold-700/30 text-gold-100"
                  placeholder="e.g., Monthly Sales Report"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="queryDescription" className="text-gold-100">
                  Description
                </Label>
                <Input
                  id="queryDescription"
                  value={newQuery.description}
                  onChange={(e) =>
                    setNewQuery({ ...newQuery, description: e.target.value })
                  }
                  className="bg-black-900 border-gold-700/30 text-gold-100"
                  placeholder="Brief description of what this query does"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="querySql" className="text-gold-100">
                  SQL Query *
                </Label>
                <Textarea
                  id="querySql"
                  value={newQuery.query}
                  onChange={(e) => setNewQuery({ ...newQuery, query: e.target.value })}
                  className="bg-black-900 border-gold-700/30 text-gold-100 font-mono text-sm min-h-[100px]"
                  placeholder="SELECT * FROM..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="queryTags" className="text-gold-100">
                  Tags (comma-separated)
                </Label>
                <Input
                  id="queryTags"
                  value={newQuery.tags}
                  onChange={(e) => setNewQuery({ ...newQuery, tags: e.target.value })}
                  className="bg-black-900 border-gold-700/30 text-gold-100"
                  placeholder="e.g., sales, monthly, report"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingQuery(false);
                    setNewQuery({ name: "", description: "", query: "", tags: "" });
                  }}
                  className="btn-gold-ghost"
                >
                  Cancel
                </Button>
                <Button onClick={addQuery} className="btn-gold">
                  Save Query
                </Button>
              </div>
            </div>
          )}

          {/* Queries List */}
          <div className="space-y-3">
            {sortedQueries.length === 0 ? (
              <div className="text-center py-12 text-gold-300/50">
                <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-2">No saved queries</p>
                <p className="text-sm">
                  {searchTerm
                    ? "No queries match your search"
                    : "Save your frequently used queries for quick access"}
                </p>
              </div>
            ) : (
              sortedQueries.map((query) => (
                <div
                  key={query.id}
                  className="p-4 border border-gold-700/30 rounded-lg bg-black-900/30 hover:bg-black-900/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() => toggleFavorite(query.id)}
                          className="text-gold-500 hover:text-gold-300 transition-colors"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              query.isFavorite ? "fill-current" : ""
                            }`}
                          />
                        </button>
                        <h4 className="font-semibold text-gold-100">{query.name}</h4>
                      </div>
                      {query.description && (
                        <p className="text-sm text-gold-300/70 mb-2">
                          {query.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {query.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="badge-gold text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gold-300/50">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Used {query.useCount} times
                        </span>
                        {query.lastUsed && (
                          <span>
                            Last used: {new Date(query.lastUsed).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => executeQuery(query)}
                        className="btn-gold"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Run
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteQuery(query.id)}
                        className="btn-gold-ghost text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook to manage saved queries
export function useSavedQueries() {
  const [queries, setQueries] = useState<SavedQuery[]>([]);

  useEffect(() => {
    const savedQueries = localStorage.getItem("savedQueries");
    if (savedQueries) {
      setQueries(JSON.parse(savedQueries));
    }
  }, []);

  const getMostUsedQueries = (limit: number = 5) => {
    return [...queries].sort((a, b) => b.useCount - a.useCount).slice(0, limit);
  };

  const getFavoriteQueries = () => {
    return queries.filter((q) => q.isFavorite);
  };

  return {
    queries,
    getMostUsedQueries,
    getFavoriteQueries,
  };
}
