import Header from "@/components/header";
import GitHubSidebar from "@/components/Dashboard/GitHubSidebar";
import CommandPalette from "@/components/Dashboard/CommandPalette";
import StatsCard from "@/components/Dashboard/StatsCard";
import { SocialAnalyticsDashboard } from "@/components/social-analytics-dashboard";
import { useDatabases } from "@/hooks/use-database";
import GlassCard from "@/components/GlassCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TrendingUp, Database, AlertCircle, Sparkles, Zap, Users, BarChart3 } from "lucide-react";
import { Link } from "wouter";

export default function SocialAnalyticsPage() {
  const { data: databases = [] } = useDatabases();

  // Find SocialScaleBooster database
  const socialDatabase = databases.find(
    (db) => db.type === 'socialscalebooster' || db.name.toLowerCase().includes('social')
  );

  if (!socialDatabase) {
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
                        <TrendingUp className="w-6 h-6 text-[#0D0D0D]" />
                      </div>
                      <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent">
                          Social Media Analytics
                        </h1>
                      </div>
                    </div>
                    <p className="text-[rgba(245,245,220,0.7)] max-w-2xl">
                      Powered by SocialScaleBooster + DataLens Integration. Unlock powerful insights across all your social platforms.
                    </p>
                  </div>
                </div>

                {/* Alert - Enhanced */}
                <div className="relative overflow-hidden rounded-2xl border-2 border-[rgba(255,215,0,0.4)] bg-[rgba(255,215,0,0.1)] backdrop-blur-xl p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,215,0,0.1)] to-transparent opacity-50" />
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-[rgba(255,215,0,0.2)]">
                      <AlertCircle className="w-5 h-5 text-[#FFD700]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#FFD700] mb-2">SocialScaleBooster Not Connected</h3>
                      <p className="text-[rgba(245,245,220,0.8)]">
                        To use Social Media Analytics, you need to connect your SocialScaleBooster database.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatsCard
                    title="Query Templates"
                    value={18}
                    icon={BarChart3}
                    subtitle="Pre-built analytics"
                    delay={0}
                  />
                  <StatsCard
                    title="Social Platforms"
                    value={5}
                    icon={Users}
                    subtitle="TikTok, Instagram & more"
                    delay={100}
                  />
                  <StatsCard
                    title="Real-Time Tracking"
                    value="Live"
                    icon={Zap}
                    subtitle="Revenue & engagement"
                    delay={200}
                  />
                </div>

                {/* Get Started Card - Enhanced */}
                <GlassCard
                  className="sfs-float-card-lg group hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition-all duration-300"
                  header={
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#E6C200] shadow-lg shadow-[rgba(255,215,0,0.3)] group-hover:scale-110 transition-transform">
                        <Database className="text-[#0D0D0D]" size={24} />
                      </div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-[#FFD700] to-[#E6C200] bg-clip-text text-transparent">
                        Get Started
                      </h2>
                    </div>
                  }
                  bodyClassName="space-y-6"
                >
                  <div>
                    <p className="text-[rgba(233,230,223,0.85)] mb-4 text-base">
                      Connect your SocialScaleBooster database to unlock powerful analytics:
                    </p>
                    <ul className="space-y-3 text-sm text-[rgba(233,230,223,0.75)]">
                      {[
                        "18 pre-built query templates for social media metrics",
                        "Real-time revenue and engagement tracking",
                        "Platform performance breakdowns (TikTok, Instagram, Facebook, etc.)",
                        "Bot performance analytics and ROI tracking",
                        "Time-series trend analysis and visualizations"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="p-1 rounded-full bg-[rgba(255,215,0,0.1)] mt-0.5">
                            <Sparkles className="w-3 h-3 text-[#FFD700]" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2">
                    <Link href="/settings">
                      <Button className="bg-gradient-to-r from-[#FFD700] to-[#E6C200] text-[#0D0D0D] font-semibold hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300 hover:scale-105 flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Configure SocialScaleBooster Connection
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              </div>
            </div>
          </main>
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
          <div className="flex-1 overflow-auto marbled-bg sfs-content-area">
            <SocialAnalyticsDashboard
              databaseId={socialDatabase.id}
              userId="default-user"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
