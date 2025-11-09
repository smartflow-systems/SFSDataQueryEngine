import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { SocialAnalyticsDashboard } from "@/components/social-analytics-dashboard";
import { useDatabases } from "@/hooks/use-database";
import GlassCard from "@/components/GlassCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TrendingUp, Database, AlertCircle } from "lucide-react";
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
        <Header />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-6 overflow-auto marbled-bg">
              <div className="max-w-4xl mx-auto space-y-6">
                <div>
                  <h1 className="text-3xl font-semibold gradient-gold-text flex items-center gap-3">
                    <TrendingUp size={32} />
                    Social Media Analytics
                  </h1>
                  <p className="mt-2 text-[rgba(233,230,223,0.7)]">
                    Powered by SocialScaleBooster + DataLens Integration
                  </p>
                </div>

                <Alert className="border-yellow-500/50 bg-yellow-500/10">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-yellow-200">
                    <strong>SocialScaleBooster Not Connected</strong>
                    <p className="mt-2">
                      To use Social Media Analytics, you need to connect your SocialScaleBooster database.
                    </p>
                  </AlertDescription>
                </Alert>

                <GlassCard
                  header={
                    <div className="flex items-center gap-2 mb-4">
                      <Database className="text-[#d4af37]" size={20} />
                      <h2 className="text-lg font-semibold gradient-gold-text">Get Started</h2>
                    </div>
                  }
                  bodyClassName="space-y-4"
                >
                  <p className="text-[rgba(233,230,223,0.85)]">
                    Connect your SocialScaleBooster database to unlock powerful analytics:
                  </p>
                  <ul className="space-y-2 text-sm text-[rgba(233,230,223,0.75)] list-disc list-inside">
                    <li>18 pre-built query templates for social media metrics</li>
                    <li>Real-time revenue and engagement tracking</li>
                    <li>Platform performance breakdowns (TikTok, Instagram, Facebook, etc.)</li>
                    <li>Bot performance analytics and ROI tracking</li>
                    <li>Time-series trend analysis and visualizations</li>
                  </ul>
                  <div className="pt-4">
                    <Link href="/settings">
                      <Button className="bg-[#d4af37] text-[#0b0b0b] hover:bg-[#d4af37]/90 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                        <Database className="mr-2" size={16} />
                        Configure SocialScaleBooster Connection
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
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto marbled-bg">
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
