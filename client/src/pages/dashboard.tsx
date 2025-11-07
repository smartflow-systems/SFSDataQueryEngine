import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import QueryInput from "@/components/query-input";
import QueryResults from "@/components/query-results";
import ChartBuilder from "@/components/chart-builder";
import GlassCard from "@/components/GlassCard";
import DashboardPersonalization, { useDashboardPreferences } from "@/components/dashboard-personalization";
import SavedQueries from "@/components/saved-queries";
import Collaboration from "@/components/collaboration";
import { useState, useEffect } from "react";
import { Activity, BarChart2, TrendingUp, Bookmark, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [currentQuery, setCurrentQuery] = useState<any>(null);
  const [queryResults, setQueryResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const preferences = useDashboardPreferences();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleExecuteSavedQuery = (query: string) => {
    // This would normally execute the query
    console.log("Executing saved query:", query);
  };

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

          <div className="flex-1 p-4 md:p-6 overflow-auto marbled-bg">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
              {/* Personalization Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gold-300">
                    Welcome back, {preferences.displayName}!
                  </h2>
                  <p className="text-sm text-gold-300/70 mt-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <DashboardPersonalization />
              </div>

              {/* Tabs for different sections */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid bg-black-900/50 border border-gold-700/30">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-black-900">
                    <Activity className="w-4 h-4 mr-2 hidden sm:block" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="saved" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-black-900">
                    <Bookmark className="w-4 h-4 mr-2 hidden sm:block" />
                    Saved Queries
                  </TabsTrigger>
                  <TabsTrigger value="collaborate" className="data-[state=active]:bg-gold-gradient data-[state=active]:text-black-900">
                    <Users className="w-4 h-4 mr-2 hidden sm:block" />
                    Collaborate
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 md:space-y-6 mt-6">
                  {/* Welcome Section */}
                  {!queryResults && preferences.showWelcomeCards && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
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
                </TabsContent>

                <TabsContent value="saved" className="mt-6">
                  <SavedQueries onExecuteQuery={handleExecuteSavedQuery} />
                </TabsContent>

                <TabsContent value="collaborate" className="mt-6">
                  <Collaboration />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
