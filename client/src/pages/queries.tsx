import Header from "@/components/header";
import GitHubSidebar from "@/components/Dashboard/GitHubSidebar";
import CommandPalette from "@/components/Dashboard/CommandPalette";
import StatsCard from "@/components/Dashboard/StatsCard";
import GlassCard from "@/components/GlassCard";
import { useQueries } from "@/hooks/use-queries";
import { Badge } from "@/components/ui/badge";
import { Clock, Code, Database, Sparkles, Zap, TrendingUp } from "lucide-react";

export default function QueriesPage() {
  const { data: allQueries = [] } = useQueries();
  const { data: savedQueries = [] } = useQueries({ saved: true });
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0b] text-[#e9e6df]">
      {/* Command Palette */}
      <CommandPalette />

      {/* GitHub-style Sidebar */}
      <GitHubSidebar />

      <Header />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto marbled-bg sfs-content-area">
            <div className="sfs-container-narrow space-y-8">

              {/* Hero Section */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[rgba(255,215,0,0.1)] via-[rgba(13,13,13,0.8)] to-[rgba(230,194,0,0.1)] border-2 border-[rgba(255,215,0,0.3)] p-8">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/20 rounded-full blur-3xl animate-pulse" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#E6C200] shadow-lg shadow-[rgba(255,215,0,0.3)]">
                      <Code className="w-6 h-6 text-[#0D0D0D]" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent">
                        Query History
                      </h1>
                    </div>
                  </div>
                  <p className="text-[rgba(245,245,220,0.7)] max-w-2xl">
                    Review the conversations and SQL SmartFlow DataLens has crafted across your workspace. Track performance, save queries, and optimize your data workflows.
                  </p>
                </div>
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                  title="Total Queries"
                  value={allQueries.length}
                  icon={Database}
                  subtitle="All time"
                  delay={0}
                />
                <StatsCard
                  title="Saved Queries"
                  value={savedQueries.length}
                  icon={Code}
                  subtitle="Ready to reuse"
                  delay={100}
                />
                <StatsCard
                  title="Fast Queries"
                  value={allQueries.filter((q) => q.executionTime && q.executionTime < 100).length}
                  icon={Zap}
                  trend={-12}
                  subtitle="Under 100ms"
                  delay={200}
                />
              </div>

              {/* Query Cards Grid */}
              <div className="sfs-floating-grid sfs-floating-grid-lg grid-cols-1 lg:grid-cols-2">
                <GlassCard
                  className="sfs-float-card-lg h-full group hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-all duration-300"
                  header={
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#E6C200] group-hover:scale-110 transition-transform">
                          <Code className="text-[#0D0D0D]" size={20} />
                        </div>
                        <h2 className="text-lg font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent">
                          Saved Queries
                        </h2>
                      </div>
                      <Badge className="border-2 border-[#FFD700]/40 bg-[#FFD700]/10 text-[#FFD700] font-bold px-3 py-1">
                        {savedQueries.length}
                      </Badge>
                    </div>
                  }
                  bodyClassName="space-y-3 max-h-[500px] overflow-y-auto"
                  dataTestId="glass-card-saved-queries"
                >
                  {savedQueries.length > 0 ? (
                    savedQueries.map((query, index) => (
                      <div
                        key={query.id}
                        className="group/item rounded-xl border-2 border-[#d4af37]/20 bg-[rgba(13,13,13,0.6)] backdrop-blur-sm p-4 hover:border-[#FFD700]/50 hover:bg-[rgba(255,215,0,0.05)] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="text-sm font-bold text-[#FFD700] flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            {query.name || "Untitled Query"}
                          </div>
                          <div className="text-xs text-[rgba(245,245,220,0.5)] opacity-0 group-hover/item:opacity-100 transition-opacity">
                            Click to run
                          </div>
                        </div>
                        <div className="text-xs text-[rgba(233,230,223,0.7)] line-clamp-2">
                          {query.naturalLanguage ||
                            (query.sqlQuery ? `${query.sqlQuery.substring(0, 80)}...` : "Preview unavailable")}
                        </div>
                        {query.executionTime && (
                          <div className="flex items-center gap-2 mt-2">
                            <Zap className="w-3 h-3 text-[#7fd1b9]" />
                            <span className="text-xs text-[#7fd1b9]">{query.executionTime}ms</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Code className="w-12 h-12 text-[rgba(255,215,0,0.3)] mx-auto mb-3" />
                      <p className="text-sm text-[rgba(233,230,223,0.5)]">No saved queries yet. Save your first query to see it here!</p>
                    </div>
                  )}
                </GlassCard>

                <GlassCard
                  className="sfs-float-card-lg h-full group hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-all duration-300"
                  header={
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#E6C200] group-hover:scale-110 transition-transform">
                          <Clock className="text-[#0D0D0D]" size={20} />
                        </div>
                        <h2 className="text-lg font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent">
                          Recent Activity
                        </h2>
                      </div>
                      <Badge className="border-2 border-[#FFD700]/40 bg-[#FFD700]/10 text-[#FFD700] font-bold px-3 py-1">
                        {allQueries.length}
                      </Badge>
                    </div>
                  }
                  bodyClassName="space-y-3 max-h-[500px] overflow-y-auto"
                  dataTestId="glass-card-recent-activity"
                >
                  {allQueries.length > 0 ? (
                    allQueries.slice(0, 10).map((query, index) => (
                      <div
                        key={query.id}
                        className="group/item rounded-xl border-2 border-[#d4af37]/20 bg-[rgba(13,13,13,0.6)] backdrop-blur-sm p-4 hover:border-[#FFD700]/50 hover:bg-[rgba(255,215,0,0.05)] transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-[rgba(233,230,223,0.5)] flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {query.createdAt
                              ? new Date(query.createdAt).toLocaleString()
                              : "Unknown time"}
                          </div>
                          {query.rowCount !== null && query.rowCount !== undefined && (
                            <span className="text-xs text-[#7fd1b9] font-semibold">
                              {query.rowCount} rows
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-[rgba(233,230,223,0.85)] line-clamp-2">
                          {query.naturalLanguage ||
                            (query.sqlQuery ? `${query.sqlQuery.substring(0, 70)}...` : "Preview unavailable")}
                        </div>
                        {query.executionTime && (
                          <div className="flex items-center gap-2 mt-2">
                            <Zap className="w-3 h-3 text-[#FFD700]" />
                            <span className="text-xs text-[#FFD700]">{query.executionTime}ms</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-[rgba(255,215,0,0.3)] mx-auto mb-3" />
                      <p className="text-sm text-[rgba(233,230,223,0.5)]">No queries executed yet. Run your first query to get started!</p>
                    </div>
                  )}
                </GlassCard>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}