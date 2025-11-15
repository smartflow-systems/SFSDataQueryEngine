import Header from "@/components/header";
import GitHubSidebar from "@/components/Dashboard/GitHubSidebar";
import CommandPalette from "@/components/Dashboard/CommandPalette";
import StatsCard from "@/components/Dashboard/StatsCard";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BarChart, LineChart, PieChart, FileText, Download, Plus, Sparkles, TrendingUp, Zap, Eye } from "lucide-react";

export default function ReportsPage() {
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
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E6C200]/20 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#E6C200] shadow-lg shadow-[rgba(255,215,0,0.3)]">
                      <BarChart className="w-6 h-6 text-[#0D0D0D]" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent">
                        Reports &amp; Dashboards
                      </h1>
                    </div>
                  </div>
                  <p className="text-[rgba(245,245,220,0.7)] max-w-2xl mb-4">
                    Build polished insights from your SmartFlow queries, then share or export them with golden clarity. Create beautiful visualizations that tell your data story.
                  </p>
                  <Button className="bg-gradient-to-r from-[#FFD700] to-[#E6C200] text-[#0D0D0D] font-semibold hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300 hover:scale-105 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    New Report
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                  title="Total Reports"
                  value={0}
                  icon={FileText}
                  subtitle="Ready to create"
                  delay={0}
                />
                <StatsCard
                  title="Report Templates"
                  value={3}
                  icon={BarChart}
                  subtitle="Quick start options"
                  delay={100}
                />
                <StatsCard
                  title="Export Formats"
                  value={3}
                  icon={Download}
                  subtitle="CSV, Excel, PDF"
                  delay={200}
                />
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#FFD700]" />
                    Quick Start Templates
                  </h2>
                  <div className="sfs-floating-grid sfs-floating-grid-lg grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <GlassCard
                      className="sfs-float-card-lg h-full group hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-all duration-300"
                      header={
                        <div className="mb-3">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#E6C200] group-hover:scale-110 transition-transform shadow-lg">
                              <BarChart className="text-[#0D0D0D]" size={24} />
                            </div>
                            <h3 className="text-lg font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent">
                              Sales Performance
                            </h3>
                          </div>
                          <p className="text-sm text-[rgba(233,230,223,0.7)]">
                            Track revenue trends, sales velocity, and regional performance with curated visuals.
                          </p>
                        </div>
                      }
                      bodyClassName="mt-4"
                      dataTestId="glass-card-sales-performance"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-[#FFD700]/40 text-[#FFD700] hover:bg-[rgba(255,215,0,0.1)] hover:border-[#FFD700] transition-all duration-300 hover:scale-105"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        Create Report
                      </Button>
                    </GlassCard>

                    <GlassCard
                      className="sfs-float-card-lg h-full group hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-all duration-300"
                      header={
                        <div className="mb-3">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#E6C200] group-hover:scale-110 transition-transform shadow-lg">
                              <PieChart className="text-[#0D0D0D]" size={24} />
                            </div>
                            <h3 className="text-lg font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent">
                              User Analytics
                            </h3>
                          </div>
                          <p className="text-sm text-[rgba(233,230,223,0.7)]">
                            Analyze retention, engagement depth, and acquisition funnels with ready-made layouts.
                          </p>
                        </div>
                      }
                      bodyClassName="mt-4"
                      dataTestId="glass-card-user-analytics"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-[#FFD700]/40 text-[#FFD700] hover:bg-[rgba(255,215,0,0.1)] hover:border-[#FFD700] transition-all duration-300 hover:scale-105"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        Create Report
                      </Button>
                    </GlassCard>

                    <GlassCard
                      className="sfs-float-card-lg h-full group hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-all duration-300"
                      header={
                        <div className="mb-3">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#E6C200] group-hover:scale-110 transition-transform shadow-lg">
                              <LineChart className="text-[#0D0D0D]" size={24} />
                            </div>
                            <h3 className="text-lg font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent">
                              Growth Metrics
                            </h3>
                          </div>
                          <p className="text-sm text-[rgba(233,230,223,0.7)]">
                            Monitor activation, conversion, and pipeline velocity through adaptive storyboards.
                          </p>
                        </div>
                      }
                      bodyClassName="mt-4"
                      dataTestId="glass-card-growth-metrics"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-[#FFD700]/40 text-[#FFD700] hover:bg-[rgba(255,215,0,0.1)] hover:border-[#FFD700] transition-all duration-300 hover:scale-105"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        Create Report
                      </Button>
                    </GlassCard>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-[#FFD700]" />
                    Recent Reports
                  </h2>
                  <GlassCard
                    className="sfs-float-card-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-all duration-300"
                    bodyClassName="py-12"
                  >
                    <div className="flex items-center justify-center text-center">
                      <div className="space-y-4">
                        <div className="relative inline-block">
                          <div className="absolute inset-0 bg-[#FFD700]/20 rounded-full blur-2xl animate-pulse" />
                          <FileText className="relative mx-auto text-[rgba(255,215,0,0.5)]" size={64} />
                        </div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent">
                          No reports yet
                        </h3>
                        <p className="text-sm text-[rgba(233,230,223,0.7)] max-w-lg">
                          Ask a question on the Dashboard or start from a template above to generate your first shareable insight.
                        </p>
                        <Link href="/dashboard">
                          <Button
                            variant="outline"
                            className="border-2 border-[#FFD700]/40 text-[#FFD700] hover:bg-[rgba(255,215,0,0.1)] hover:border-[#FFD700] transition-all duration-300 hover:scale-105 gap-2"
                          >
                            <Sparkles className="w-4 h-4" />
                            Go to Dashboard
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent mb-6 flex items-center gap-2">
                    <Download className="w-6 h-6 text-[#FFD700]" />
                    Export Options
                  </h2>
                  <GlassCard
                    className="sfs-float-card-lg group hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-all duration-300"
                    header={
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#E6C200] shadow-lg shadow-[rgba(255,215,0,0.3)] group-hover:scale-110 transition-transform">
                          <Download className="text-[#0D0D0D]" size={24} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent">
                            Export Data
                          </h3>
                          <p className="text-sm text-[rgba(233,230,223,0.7)]">
                            Move your SmartFlow reports into executive decks or downstream systems in seconds.
                          </p>
                        </div>
                      </div>
                    }
                    bodyClassName="mt-0"
                  >
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-[#FFD700]/40 text-[#FFD700] hover:bg-[rgba(255,215,0,0.1)] hover:border-[#FFD700] transition-all duration-300 hover:scale-105 font-semibold"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        CSV
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-[#FFD700]/40 text-[#FFD700] hover:bg-[rgba(255,215,0,0.1)] hover:border-[#FFD700] transition-all duration-300 hover:scale-105 font-semibold"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        Excel
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-[#FFD700]/40 text-[#FFD700] hover:bg-[rgba(255,215,0,0.1)] hover:border-[#FFD700] transition-all duration-300 hover:scale-105 font-semibold"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        PDF
                      </Button>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}