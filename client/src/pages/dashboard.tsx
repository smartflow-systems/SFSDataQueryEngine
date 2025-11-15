import Header from "@/components/header";
import GitHubSidebar from "@/components/Dashboard/GitHubSidebar";
import StatsCard from "@/components/Dashboard/StatsCard";
import CommandPalette from "@/components/Dashboard/CommandPalette";
import QueryInput from "@/components/query-input";
import QueryResults from "@/components/query-results";
import ChartBuilder from "@/components/chart-builder";
import GlassCard from "@/components/GlassCard";
import { useState, useEffect } from "react";
import { Activity, BarChart2, TrendingUp, Database, Zap, Users, Clock, Sparkles, ArrowRight } from "lucide-react";
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
      <div className="flex items-center justify-center h-screen marbled-bg relative overflow-hidden">
        {/* Animated Background Circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E6C200]/10 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="text-center relative z-10">
          {/* Spinning Logo */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-3 border-4 border-[#E6C200] border-b-transparent rounded-full animate-spin-reverse" />
            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#FFD700] animate-pulse" />
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] via-[#E6C200] to-[#FFD700] bg-clip-text text-transparent mb-3 animate-pulse">
            Loading DataLens
          </h2>
          <p className="text-[#cbbf9b] animate-pulse">Preparing your analytics workspace...</p>

          {/* Loading Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0b] text-[#e9e6df]">
      {/* Command Palette */}
      <CommandPalette />

      {/* GitHub-style Sidebar */}
      <GitHubSidebar />

      <Header />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden">
          <QueryInput
            onQueryExecuted={(query, results) => {
              setCurrentQuery(query);
              setQueryResults(results);
            }}
          />

          <div className="flex-1 overflow-auto marbled-bg sfs-content-area">
            <div className="sfs-container space-y-8">

              {/* Hero Section - Only show when no query results */}
              {!queryResults && (
                <>
                  {/* Welcome Banner */}
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[rgba(255,215,0,0.1)] via-[rgba(13,13,13,0.8)] to-[rgba(230,194,0,0.1)] border-2 border-[rgba(255,215,0,0.3)] p-8 md:p-12">
                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#FFD700]/20 rounded-full blur-3xl animate-pulse" />
                      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#E6C200]/20 rounded-full blur-3xl animate-pulse delay-1000" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#E6C200] shadow-2xl shadow-[rgba(255,215,0,0.4)] animate-pulse">
                          <Sparkles className="w-8 h-8 text-[#0D0D0D]" />
                        </div>
                        <div>
                          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FFD700] via-[#E6C200] to-[#FFD700] bg-clip-text text-transparent">
                            Welcome to DataLens
                          </h1>
                          <p className="text-[rgba(245,245,220,0.7)] mt-1">AI-Powered Analytics Platform</p>
                        </div>
                      </div>

                      <p className="text-lg text-[rgba(245,245,220,0.8)] mb-6 max-w-2xl">
                        Transform your data into insights with natural language queries. Ask questions, get SQL, visualize results.
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <button className="group px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#E6C200] text-[#0D0D0D] font-semibold hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300 hover:scale-105 flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Start Querying
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-6 py-3 rounded-xl border-2 border-[rgba(255,215,0,0.3)] text-[#FFD700] font-semibold hover:bg-[rgba(255,215,0,0.1)] transition-all duration-300 hover:scale-105 flex items-center gap-2">
                          Press <kbd className="px-2 py-1 rounded bg-[rgba(255,215,0,0.2)] text-xs">⌘K</kbd> for commands
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Live Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                      title="Total Queries"
                      value={1247}
                      icon={Database}
                      trend={12.5}
                      subtitle="Last 30 days"
                      delay={0}
                    />
                    <StatsCard
                      title="Active Users"
                      value={89}
                      icon={Users}
                      trend={8.2}
                      subtitle="Current month"
                      delay={100}
                    />
                    <StatsCard
                      title="Avg Response Time"
                      value="42ms"
                      icon={Zap}
                      trend={-15.3}
                      subtitle="Performance improved"
                      delay={200}
                    />
                    <StatsCard
                      title="Data Sources"
                      value={24}
                      icon={Activity}
                      trend={4}
                      subtitle="Connected databases"
                      delay={300}
                    />
                  </div>

                  {/* Quick Start Cards */}
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent mb-6 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-[#FFD700]" />
                      Quick Start Guide
                    </h2>
                    <div className="sfs-floating-grid sfs-floating-grid-lg grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      <GlassCard
                        title="Natural Language to SQL"
                        className="sfs-float-card smooth-transition hover:transform hover:-translate-y-2 group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#E6C200] group-hover:scale-110 transition-transform">
                            <Activity className="text-[#0D0D0D]" size={24} />
                          </div>
                          <span className="text-base font-semibold text-[#FFD700]">AI-Powered</span>
                        </div>
                        <p className="text-sm text-[rgba(233,230,223,0.8)]">
                          Ask questions in natural language and get SQL queries instantly with AI-powered translation
                        </p>
                      </GlassCard>

                      <GlassCard
                        title="Interactive Visualizations"
                        className="sfs-float-card smooth-transition hover:transform hover:-translate-y-2 group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#E6C200] group-hover:scale-110 transition-transform">
                            <BarChart2 className="text-[#0D0D0D]" size={24} />
                          </div>
                          <span className="text-base font-semibold text-[#FFD700]">Real-Time</span>
                        </div>
                        <p className="text-sm text-[rgba(233,230,223,0.8)]">
                          Create beautiful, interactive charts and visualizations from your query results
                        </p>
                      </GlassCard>

                      <GlassCard
                        title="Smart Dashboards"
                        className="sfs-float-card smooth-transition hover:transform hover:-translate-y-2 group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#E6C200] group-hover:scale-110 transition-transform">
                            <TrendingUp className="text-[#0D0D0D]" size={24} />
                          </div>
                          <span className="text-base font-semibold text-[#FFD700]">Insights</span>
                        </div>
                        <p className="text-sm text-[rgba(233,230,223,0.8)]">
                          Save queries and build custom dashboards to track your key business metrics
                        </p>
                      </GlassCard>
                    </div>
                  </div>
                </>
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
