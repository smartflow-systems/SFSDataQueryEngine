import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import QueryInput from "@/components/query-input";
import QueryResults from "@/components/query-results";
import ChartBuilder from "@/components/chart-builder";
import GlassCard from "@/components/GlassCard";
import { useState, useEffect } from "react";
import { Activity, BarChart2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [currentQuery, setCurrentQuery] = useState<any>(null);
  const [queryResults, setQueryResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen marbled-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4 gold-glow" />
          <h2 className="text-2xl font-bold gradient-gold-text mb-2">Loading DataLens</h2>
          <p className="text-[#cbbf9b]">Preparing your analytics workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0b] text-[#e9e6df]">
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
          
          <div className="flex-1 p-6 overflow-auto marbled-bg">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Section */}
              {!queryResults && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <GlassCard 
                    title="Quick Start" 
                    className="smooth-transition hover:transform hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="text-[#d4af37]" size={20} />
                      <span className="text-sm font-medium text-[rgba(233,230,223,0.9)]">Natural Language to SQL</span>
                    </div>
                    <p className="text-sm text-[rgba(233,230,223,0.8)]">Ask questions in natural language and get SQL queries instantly with AI-powered translation</p>
                  </GlassCard>
                  
                  <GlassCard 
                    title="Visualize Data" 
                    className="smooth-transition hover:transform hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart2 className="text-[#d4af37]" size={20} />
                      <span className="text-sm font-medium text-[rgba(233,230,223,0.9)]">Interactive Charts</span>
                    </div>
                    <p className="text-sm text-[rgba(233,230,223,0.8)]">Create beautiful, interactive charts and visualizations from your query results</p>
                  </GlassCard>
                  
                  <GlassCard 
                    title="Track Insights" 
                    className="smooth-transition hover:transform hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="text-[#d4af37]" size={20} />
                      <span className="text-sm font-medium text-[rgba(233,230,223,0.9)]">Smart Dashboards</span>
                    </div>
                    <p className="text-sm text-[rgba(233,230,223,0.8)]">Save queries and build custom dashboards to track your key business metrics</p>
                  </GlassCard>
                </div>
              )}
              {queryResults && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <QueryResults 
                    results={queryResults}
                    query={currentQuery}
                  />
                </div>
              )}
              
              {queryResults && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                  <ChartBuilder 
                    data={queryResults.result?.rows || []}
                    columns={queryResults.result?.columns || []}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
