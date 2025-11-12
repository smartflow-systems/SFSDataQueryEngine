import Header from "@/components/header";
import GitHubSidebar from "@/components/Dashboard/GitHubSidebar";
import GlassCard from "@/components/GlassCard";
import { useQueries } from "@/hooks/use-queries";
import { Badge } from "@/components/ui/badge";
import { Clock, Code, Database } from "lucide-react";

export default function QueriesPage() {
  const { data: allQueries = [] } = useQueries();
  const { data: savedQueries = [] } = useQueries({ saved: true });
  
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0b] text-[#e9e6df]">
      {/* GitHub-style Sidebar */}
      <GitHubSidebar />

      <Header />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto marbled-bg sfs-content-area">
            <div className="sfs-container-narrow space-y-8">
              <div>
                <h1 className="text-3xl font-semibold gradient-gold-text">Query History</h1>
                <p className="mt-2 text-[rgba(233,230,223,0.7)]">
                  Review the conversations and SQL SmartFlow DataLens has crafted across your workspace.
                </p>
              </div>

              <div className="sfs-floating-grid sfs-floating-grid-lg grid-cols-1 lg:grid-cols-2">
                <GlassCard
                  className="sfs-float-card-lg h-full"
                  header={
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Code className="text-[#d4af37]" size={20} />
                        <h2 className="text-lg font-semibold gradient-gold-text">Saved Queries</h2>
                      </div>
                      <Badge className="border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37]">
                        {savedQueries.length}
                      </Badge>
                    </div>
                  }
                  bodyClassName="space-y-3"
                  dataTestId="glass-card-saved-queries"
                >
                  {savedQueries.length > 0 ? (
                    savedQueries.map((query) => (
                      <div
                        key={query.id}
                        className="rounded-lg border border-[#d4af37]/20 bg-black/40 p-4 shadow-sm"
                      >
                        <div className="text-sm font-semibold text-[rgba(233,230,223,0.95)] mb-1">
                          {query.name || "Untitled Query"}
                        </div>
                        <div className="text-xs text-[rgba(233,230,223,0.65)]">
                          {query.naturalLanguage ||
                            (query.sqlQuery ? `${query.sqlQuery.substring(0, 60)}...` : "Preview unavailable")}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[rgba(233,230,223,0.65)]">No saved queries yet.</p>
                  )}
                </GlassCard>

                <GlassCard
                  className="sfs-float-card-lg h-full"
                  header={
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="text-[#d4af37]" size={20} />
                        <h2 className="text-lg font-semibold gradient-gold-text">Recent Activity</h2>
                      </div>
                      <Badge className="border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37]">
                        {allQueries.length}
                      </Badge>
                    </div>
                  }
                  bodyClassName="space-y-3"
                  dataTestId="glass-card-recent-activity"
                >
                  {allQueries.length > 0 ? (
                    allQueries.slice(0, 5).map((query) => (
                      <div
                        key={query.id}
                        className="rounded-lg border border-[#d4af37]/20 bg-black/40 p-4"
                      >
                        <div className="text-xs text-[rgba(233,230,223,0.6)] mb-1">
                          {query.createdAt
                            ? new Date(query.createdAt).toLocaleString()
                            : "Unknown time"}
                        </div>
                        <div className="text-sm text-[rgba(233,230,223,0.85)]">
                          {query.naturalLanguage ||
                            (query.sqlQuery ? `${query.sqlQuery.substring(0, 50)}...` : "Preview unavailable")}
                        </div>
                        {query.rowCount !== null && query.rowCount !== undefined && (
                          <div className="text-xs text-[#7fd1b9] mt-2">
                            {query.rowCount} rows returned
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[rgba(233,230,223,0.65)]">No queries executed yet.</p>
                  )}
                </GlassCard>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="sfs-card sf-stars p-5 text-center">
                  <Database className="mx-auto text-[#d4af37] mb-3" size={26} />
                  <div className="text-3xl font-semibold gradient-gold-text">{allQueries.length}</div>
                  <p className="mt-1 text-sm text-[rgba(233,230,223,0.7)]">Total Queries</p>
                </div>

                <div className="sfs-card sf-stars p-5 text-center">
                  <Code className="mx-auto text-[#d4af37] mb-3" size={26} />
                  <div className="text-3xl font-semibold gradient-gold-text">{savedQueries.length}</div>
                  <p className="mt-1 text-sm text-[rgba(233,230,223,0.7)]">Saved Queries</p>
                </div>

                <div className="sfs-card sf-stars p-5 text-center">
                  <Clock className="mx-auto text-[#d4af37] mb-3" size={26} />
                  <div className="text-3xl font-semibold gradient-gold-text">
                    {allQueries.filter((q) => q.executionTime && q.executionTime < 100).length}
                  </div>
                  <p className="mt-1 text-sm text-[rgba(233,230,223,0.7)]">Fast Queries (&lt;100ms)</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}