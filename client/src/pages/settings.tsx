import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Database, Key, Bell, Palette, Shield, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>
            
            <div className="space-y-6">
              {/* Profile Settings */}
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="text-primary" size={20} />
                  <h2 className="text-lg font-semibold">Profile</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Display Name
                    </label>
                    <Input placeholder="Enter your name" defaultValue="Developer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input placeholder="Enter your email" defaultValue="developer@example.com" />
                  </div>
                </div>
              </Card>

              {/* Database Connections */}
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Database className="text-primary" size={20} />
                  <h2 className="text-lg font-semibold">Database Connections</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                    <div>
                      <div className="font-medium">SQLite - main.db</div>
                      <div className="text-sm text-muted-foreground">./data/main.db</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm text-success">Connected</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Database className="mr-2" size={16} />
                    Add New Connection
                  </Button>
                </div>
              </Card>

              {/* API Settings */}
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Key className="text-primary" size={20} />
                  <h2 className="text-lg font-semibold">API Configuration</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      OpenAI API Status
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm text-success">API Key Connected</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Query Translation Model
                    </label>
                    <Input disabled defaultValue="GPT-4o" />
                  </div>
                </div>
              </Card>

              {/* Preferences */}
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Palette className="text-primary" size={20} />
                  <h2 className="text-lg font-semibold">Preferences</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Dark Theme</div>
                      <div className="text-sm text-muted-foreground">Use dark theme for the interface</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-save Queries</div>
                      <div className="text-sm text-muted-foreground">Automatically save successful queries</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Show SQL Confidence</div>
                      <div className="text-sm text-muted-foreground">Display confidence scores for generated SQL</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>

              {/* Notifications */}
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Bell className="text-primary" size={20} />
                  <h2 className="text-lg font-semibold">Notifications</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Query Completion</div>
                      <div className="text-sm text-muted-foreground">Notify when long-running queries complete</div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Error Alerts</div>
                      <div className="text-sm text-muted-foreground">Alert when queries fail or have errors</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end space-x-4">
                <Button variant="outline">Reset to Defaults</Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}