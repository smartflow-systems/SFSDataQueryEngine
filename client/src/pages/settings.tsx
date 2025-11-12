import Header from "@/components/header";
import GitHubSidebar from "@/components/Dashboard/GitHubSidebar";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Database, Key, Bell, Palette, Shield, User, TrendingUp, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [socialDbName, setSocialDbName] = useState("SocialScaleBooster");
  const [socialDbConnection, setSocialDbConnection] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const connectSocialDb = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/databases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: socialDbName,
          type: "socialscalebooster",
          connectionString: socialDbConnection,
          isActive: true,
        }),
      });
      if (!response.ok) throw new Error("Failed to connect database");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/databases"] });
      toast({
        title: "Success!",
        description: "SocialScaleBooster database connected successfully",
      });
      setSocialDbConnection("");
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleConnectSocial = async () => {
    setIsConnecting(true);
    try {
      await connectSocialDb.mutateAsync();
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0b] text-[#e9e6df]">
      {/* GitHub-style Sidebar */}
      <GitHubSidebar />

      <Header />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 overflow-auto marbled-bg">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-semibold gradient-gold-text">Settings</h1>
                <p className="mt-2 text-[rgba(233,230,223,0.7)]">
                  Tune SmartFlow DataLens to match your workflow, security, and notification preferences.
                </p>
              </div>

              <div className="space-y-6">
                <GlassCard
                  header={
                    <div className="flex items-center gap-2 mb-4">
                      <User className="text-[#d4af37]" size={20} />
                      <h2 className="text-lg font-semibold gradient-gold-text">Profile</h2>
                    </div>
                  }
                  bodyClassName="space-y-4"
                  dataTestId="glass-card-profile-settings"
                >
                  <div>
                    <label className="block text-sm font-medium text-[rgba(233,230,223,0.85)] mb-2">
                      Display Name
                    </label>
                    <Input
                      placeholder="Enter your name"
                      defaultValue="Developer"
                      className="bg-black/60 border border-[#d4af37]/20 text-[#e9e6df] placeholder:text-[rgba(233,230,223,0.45)] focus:border-[#d4af37]/50 focus-visible:ring-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[rgba(233,230,223,0.85)] mb-2">
                      Email
                    </label>
                    <Input
                      placeholder="Enter your email"
                      defaultValue="developer@example.com"
                      className="bg-black/60 border border-[#d4af37]/20 text-[#e9e6df] placeholder:text-[rgba(233,230,223,0.45)] focus:border-[#d4af37]/50 focus-visible:ring-0"
                    />
                  </div>
                </GlassCard>

                <GlassCard
                  header={
                    <div className="flex items-center gap-2 mb-4">
                      <Database className="text-[#d4af37]" size={20} />
                      <h2 className="text-lg font-semibold gradient-gold-text">Database Connections</h2>
                    </div>
                  }
                  bodyClassName="space-y-4"
                  dataTestId="glass-card-database-connections"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#d4af37]/20 bg-black/40 p-4">
                    <div>
                      <div className="font-medium text-[rgba(233,230,223,0.95)]">SQLite - main.db</div>
                      <div className="text-sm text-[rgba(233,230,223,0.65)]">./data/main.db</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-[#7fd1b9]" aria-hidden="true" />
                      <span className="text-sm text-[#7fd1b9]">Connected</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37]/10"
                  >
                    <Database className="mr-2" size={16} />
                    Add New Connection
                  </Button>
                </GlassCard>

                <GlassCard
                  header={
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="text-[#d4af37]" size={20} />
                      <h2 className="text-lg font-semibold gradient-gold-text">SocialScaleBooster Integration</h2>
                    </div>
                  }
                  bodyClassName="space-y-4"
                  dataTestId="glass-card-social-integration"
                >
                  <div>
                    <label className="block text-sm font-medium text-[rgba(233,230,223,0.85)] mb-2">
                      Integration Status
                    </label>
                    <div className="flex items-center gap-2 rounded-lg border border-[#7fd1b9]/40 bg-[#7fd1b9]/10 p-3">
                      <CheckCircle2 className="h-5 w-5 text-[#7fd1b9]" />
                      <div>
                        <div className="text-sm font-medium text-[#7fd1b9]">Ready for Configuration</div>
                        <div className="text-xs text-[rgba(233,230,223,0.65)]">
                          18 pre-built query templates available
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[rgba(233,230,223,0.85)] mb-2">
                      Database Name
                    </label>
                    <Input
                      placeholder="SocialScaleBooster"
                      value={socialDbName}
                      onChange={(e) => setSocialDbName(e.target.value)}
                      className="bg-black/60 border border-[#d4af37]/20 text-[#e9e6df] placeholder:text-[rgba(233,230,223,0.45)] focus:border-[#d4af37]/50 focus-visible:ring-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[rgba(233,230,223,0.85)] mb-2">
                      Connection String
                    </label>
                    <Input
                      placeholder="postgresql://user:pass@host:5432/socialscalebooster"
                      value={socialDbConnection}
                      onChange={(e) => setSocialDbConnection(e.target.value)}
                      className="bg-black/60 border border-[#d4af37]/20 text-[#e9e6df] placeholder:text-[rgba(233,230,223,0.45)] focus:border-[#d4af37]/50 focus-visible:ring-0"
                    />
                    <p className="text-xs text-[rgba(233,230,223,0.55)] mt-1">
                      Enter your SocialScaleBooster database connection string
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-[rgba(233,230,223,0.85)]">Features Included:</h3>
                    <ul className="text-xs text-[rgba(233,230,223,0.65)] space-y-1">
                      <li>• Revenue tracking and analysis</li>
                      <li>• Bot performance metrics</li>
                      <li>• Platform breakdown (TikTok, Instagram, Facebook, etc.)</li>
                      <li>• Engagement rate monitoring</li>
                      <li>• ROI and conversion tracking</li>
                    </ul>
                  </div>
                  <Button
                    onClick={handleConnectSocial}
                    disabled={!socialDbConnection || isConnecting}
                    className="w-full bg-[#d4af37] text-[#0b0b0b] hover:bg-[#d4af37]/90 shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50"
                  >
                    {isConnecting ? "Connecting..." : "Connect SocialScaleBooster"}
                  </Button>
                </GlassCard>

                <GlassCard
                  header={
                    <div className="flex items-center gap-2 mb-4">
                      <Key className="text-[#d4af37]" size={20} />
                      <h2 className="text-lg font-semibold gradient-gold-text">API Configuration</h2>
                    </div>
                  }
                  bodyClassName="space-y-4"
                  dataTestId="glass-card-api-configuration"
                >
                  <div>
                    <label className="block text-sm font-medium text-[rgba(233,230,223,0.85)] mb-2">
                      OpenAI API Status
                    </label>
                    <div className="flex items-center gap-2 rounded-lg border border-[#7fd1b9]/40 bg-[#7fd1b9]/10 p-3">
                      <span className="inline-flex h-2 w-2 rounded-full bg-[#7fd1b9]" aria-hidden="true" />
                      <span className="text-sm text-[#7fd1b9]">API Key Connected</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[rgba(233,230,223,0.85)] mb-2">
                      Query Translation Model
                    </label>
                    <Input
                      disabled
                      defaultValue="GPT-4o"
                      className="bg-black/30 border border-[#d4af37]/20 text-[#e9e6df]/70"
                    />
                  </div>
                </GlassCard>

                <GlassCard
                  header={
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="text-[#d4af37]" size={20} />
                      <h2 className="text-lg font-semibold gradient-gold-text">Preferences</h2>
                    </div>
                  }
                  bodyClassName="space-y-4"
                  dataTestId="glass-card-preferences"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-[rgba(233,230,223,0.95)]">Dark Theme</div>
                      <div className="text-sm text-[rgba(233,230,223,0.65)]">Use dark theme for the interface</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-[rgba(233,230,223,0.95)]">Auto-save Queries</div>
                      <div className="text-sm text-[rgba(233,230,223,0.65)]">Automatically save successful queries</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-[rgba(233,230,223,0.95)]">Show SQL Confidence</div>
                      <div className="text-sm text-[rgba(233,230,223,0.65)]">Display confidence scores for generated SQL</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </GlassCard>

                <GlassCard
                  header={
                    <div className="flex items-center gap-2 mb-4">
                      <Bell className="text-[#d4af37]" size={20} />
                      <h2 className="text-lg font-semibold gradient-gold-text">Notifications</h2>
                    </div>
                  }
                  bodyClassName="space-y-4"
                  dataTestId="glass-card-notifications"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-[rgba(233,230,223,0.95)]">Query Completion</div>
                      <div className="text-sm text-[rgba(233,230,223,0.65)]">Notify when long-running queries complete</div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-[rgba(233,230,223,0.95)]">Error Alerts</div>
                      <div className="text-sm text-[rgba(233,230,223,0.65)]">Alert when queries fail or have errors</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-[rgba(233,230,223,0.95)]">Security Notifications</div>
                      <div className="text-sm text-[rgba(233,230,223,0.65)]">Receive alerts for new integrations or unusual activity</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </GlassCard>

                <GlassCard
                  header={
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="text-[#d4af37]" size={20} />
                      <h2 className="text-lg font-semibold gradient-gold-text">Data Governance</h2>
                    </div>
                  }
                  bodyClassName="space-y-4"
                  dataTestId="glass-card-data-governance"
                >
                  <p className="text-sm text-[rgba(233,230,223,0.7)]">
                    Manage retention, anonymization, and audit log preferences to stay compliant with enterprise controls.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" className="border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37]/10">
                      Configure Retention
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37]/10">
                      Review Audit Log
                    </Button>
                  </div>
                </GlassCard>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button variant="outline" className="border-[#d4af37]/60 text-[#d4af37] hover:bg-[#d4af37]/10">
                    Reset to Defaults
                  </Button>
                  <Button className="bg-[#d4af37] text-[#0b0b0b] hover:bg-[#d4af37]/90 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}