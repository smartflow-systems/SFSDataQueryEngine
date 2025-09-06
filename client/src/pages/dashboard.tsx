import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import QueryInput from "@/components/query-input";
import QueryResults from "@/components/query-results";
import ChartBuilder from "@/components/chart-builder";
import { useState } from "react";

export default function Dashboard() {
  const [currentQuery, setCurrentQuery] = useState<any>(null);
  const [queryResults, setQueryResults] = useState<any>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <QueryInput 
            onQueryExecuted={(query, results) => {
              setCurrentQuery(query);
              setQueryResults(results);
            }}
          />
          
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              {queryResults && (
                <QueryResults 
                  results={queryResults}
                  query={currentQuery}
                />
              )}
              
              {queryResults && (
                <ChartBuilder 
                  data={queryResults.result?.rows || []}
                  columns={queryResults.result?.columns || []}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
