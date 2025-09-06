import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BarChart, LineChart, PieChart, FileText, Download, Plus } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-foreground">Reports & Dashboards</h1>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2" size={16} />
                New Report
              </Button>
            </div>
            
            {/* Report Templates */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Quick Start Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-6 hover:bg-muted/20 cursor-pointer transition-colors">
                  <BarChart className="text-primary mb-3" size={32} />
                  <h3 className="font-semibold mb-2">Sales Performance</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track sales trends, revenue growth, and performance metrics
                  </p>
                  <Button variant="outline" size="sm">Create Report</Button>
                </Card>

                <Card className="p-6 hover:bg-muted/20 cursor-pointer transition-colors">
                  <PieChart className="text-primary mb-3" size={32} />
                  <h3 className="font-semibold mb-2">User Analytics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Analyze user behavior, engagement, and demographics
                  </p>
                  <Button variant="outline" size="sm">Create Report</Button>
                </Card>

                <Card className="p-6 hover:bg-muted/20 cursor-pointer transition-colors">
                  <LineChart className="text-primary mb-3" size={32} />
                  <h3 className="font-semibold mb-2">Growth Metrics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Monitor key growth indicators and business metrics
                  </p>
                  <Button variant="outline" size="sm">Create Report</Button>
                </Card>
              </div>
            </div>

            {/* Recent Reports */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
              <Card className="p-6">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FileText className="mx-auto text-muted-foreground mb-4" size={48} />
                    <h3 className="text-lg font-medium mb-2">No reports yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first report by asking a question on the Dashboard or using a template above
                    </p>
                    <Link href="/">
                      <Button variant="outline">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>

            {/* Export Options */}
            <div className="mt-8">
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <Download className="text-primary" size={24} />
                  <div>
                    <h3 className="font-semibold">Export Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Export your query results and reports in various formats
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-auto">
                    <Button variant="outline" size="sm">CSV</Button>
                    <Button variant="outline" size="sm">Excel</Button>
                    <Button variant="outline" size="sm">PDF</Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}