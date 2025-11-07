import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BarChart, LineChart, PieChart, FileText, Download, Plus } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0b] text-[#e9e6df]">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto marbled-bg sfs-content-area">
            <div className="sfs-container space-y-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold gradient-gold-text">Reports &amp; Dashboards</h1>
                  <p className="mt-2 text-[rgba(233,230,223,0.7)] max-w-2xl">
                    Build polished insights from your SmartFlow queries, then share or export them with golden clarity.
                  </p>
                </div>
                <Button className="bg-[#d4af37] text-[#0b0b0b] hover:bg-[#d4af37]/90 shadow-[0_0_25px_rgba(212,175,55,0.3)]">
                  <Plus className="mr-2" size={16} />
                  New Report
                </Button>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold gradient-gold-text mb-4">Quick Start Templates</h2>
                  <div className="sfs-floating-grid sfs-floating-grid-lg grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <GlassCard
                      className="sfs-float-card-md h-full transition-transform duration-300 hover:-translate-y-1"
                      header={
                        <div className="mb-3">
                          <div className="flex items-center gap-3 mb-2">
                            <BarChart className="text-[#d4af37]" size={32} />
                            <h3 className="text-lg font-semibold gradient-gold-text">Sales Performance</h3>
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
                        className="border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37]/10"
                      >
                        Create Report
                      </Button>
                    </GlassCard>

                    <GlassCard
                      className="sfs-float-card-md h-full transition-transform duration-300 hover:-translate-y-1"
                      header={
                        <div className="mb-3">
                          <div className="flex items-center gap-3 mb-2">
                            <PieChart className="text-[#d4af37]" size={32} />
                            <h3 className="text-lg font-semibold gradient-gold-text">User Analytics</h3>
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
                        className="border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37]/10"
                      >
                        Create Report
                      </Button>
                    </GlassCard>

                    <GlassCard
                      className="sfs-float-card-md h-full transition-transform duration-300 hover:-translate-y-1"
                      header={
                        <div className="mb-3">
                          <div className="flex items-center gap-3 mb-2">
                            <LineChart className="text-[#d4af37]" size={32} />
                            <h3 className="text-lg font-semibold gradient-gold-text">Growth Metrics</h3>
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
                        className="border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37]/10"
                      >
                        Create Report
                      </Button>
                    </GlassCard>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold gradient-gold-text mb-4">Recent Reports</h2>
                  <GlassCard title="Recent Reports" bodyClassName="py-10">
                    <div className="flex items-center justify-center text-center">
                      <div className="space-y-4">
                        <FileText className="mx-auto text-[#d4af37]/60" size={48} />
                        <h3 className="text-lg font-semibold text-[rgba(233,230,223,0.95)]">No reports yet</h3>
                        <p className="text-sm text-[rgba(233,230,223,0.7)] max-w-lg">
                          Ask a question on the Dashboard or start from a template above to generate your first shareable insight.
                        </p>
                        <Link href="/">
                          <Button
                            variant="outline"
                            className="border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37]/10"
                          >
                            Go to Dashboard
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                <div>
                  <h2 className="text-xl font-semibold gradient-gold-text mb-4">Export Options</h2>
                  <GlassCard
                    header={
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/30 bg-black/40">
                          <Download className="text-[#d4af37]" size={24} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold gradient-gold-text">Export Data</h3>
                          <p className="text-sm text-[rgba(233,230,223,0.7)]">
                            Move your SmartFlow reports into executive decks or downstream systems in seconds.
                          </p>
                        </div>
                      </div>
                    }
                    bodyClassName="mt-0"
                  >
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37]/10">
                        CSV
                      </Button>
                      <Button variant="outline" size="sm" className="border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37]/10">
                        Excel
                      </Button>
                      <Button variant="outline" size="sm" className="border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37]/10">
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