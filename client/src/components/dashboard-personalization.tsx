import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardPreferences {
  displayName: string;
  showWelcomeCards: boolean;
  defaultView: "grid" | "list";
  autoRefresh: boolean;
  refreshInterval: number;
  theme: "dark" | "light";
}

const DEFAULT_PREFERENCES: DashboardPreferences = {
  displayName: "User",
  showWelcomeCards: true,
  defaultView: "grid",
  autoRefresh: false,
  refreshInterval: 30,
  theme: "dark",
};

export default function DashboardPersonalization() {
  const [preferences, setPreferences] = useState<DashboardPreferences>(DEFAULT_PREFERENCES);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem("dashboardPreferences");
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem("dashboardPreferences", JSON.stringify(preferences));
    toast({
      title: "Preferences Saved",
      description: "Your dashboard preferences have been updated successfully.",
    });
    setIsOpen(false);
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.removeItem("dashboardPreferences");
    toast({
      title: "Preferences Reset",
      description: "Your dashboard preferences have been reset to defaults.",
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="border-gold-700 text-gold-300 hover:bg-gold-700/10"
      >
        <Settings className="w-4 h-4 mr-2" />
        Personalize Dashboard
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl mx-4 sfs-card">
            <CardHeader className="border-b border-gold-700/30">
              <CardTitle className="text-gold-300 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Dashboard Personalization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-gold-100">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  value={preferences.displayName}
                  onChange={(e) =>
                    setPreferences({ ...preferences, displayName: e.target.value })
                  }
                  className="bg-black-900 border-gold-700/30 text-gold-100"
                  placeholder="Enter your name"
                />
              </div>

              {/* Show Welcome Cards */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gold-100">Show Welcome Cards</Label>
                  <p className="text-sm text-gold-300/70">
                    Display quick start cards on dashboard
                  </p>
                </div>
                <Switch
                  checked={preferences.showWelcomeCards}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, showWelcomeCards: checked })
                  }
                />
              </div>

              {/* Default View */}
              <div className="space-y-2">
                <Label className="text-gold-100">Default View</Label>
                <div className="flex gap-4">
                  <Button
                    variant={preferences.defaultView === "grid" ? "default" : "outline"}
                    onClick={() => setPreferences({ ...preferences, defaultView: "grid" })}
                    className={
                      preferences.defaultView === "grid"
                        ? "btn-gold"
                        : "btn-gold-ghost"
                    }
                  >
                    Grid View
                  </Button>
                  <Button
                    variant={preferences.defaultView === "list" ? "default" : "outline"}
                    onClick={() => setPreferences({ ...preferences, defaultView: "list" })}
                    className={
                      preferences.defaultView === "list"
                        ? "btn-gold"
                        : "btn-gold-ghost"
                    }
                  >
                    List View
                  </Button>
                </div>
              </div>

              {/* Auto Refresh */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gold-100">Auto Refresh</Label>
                  <p className="text-sm text-gold-300/70">
                    Automatically refresh data at intervals
                  </p>
                </div>
                <Switch
                  checked={preferences.autoRefresh}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, autoRefresh: checked })
                  }
                />
              </div>

              {/* Refresh Interval */}
              {preferences.autoRefresh && (
                <div className="space-y-2">
                  <Label htmlFor="refreshInterval" className="text-gold-100">
                    Refresh Interval (seconds)
                  </Label>
                  <Input
                    id="refreshInterval"
                    type="number"
                    min="10"
                    max="300"
                    value={preferences.refreshInterval}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        refreshInterval: parseInt(e.target.value) || 30,
                      })
                    }
                    className="bg-black-900 border-gold-700/30 text-gold-100"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t border-gold-700/30">
                <Button
                  variant="outline"
                  onClick={resetPreferences}
                  className="btn-gold-ghost"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="btn-gold-ghost"
                  >
                    Cancel
                  </Button>
                  <Button onClick={savePreferences} className="btn-gold">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// Hook to use dashboard preferences
export function useDashboardPreferences() {
  const [preferences, setPreferences] = useState<DashboardPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const savedPreferences = localStorage.getItem("dashboardPreferences");
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  return preferences;
}
