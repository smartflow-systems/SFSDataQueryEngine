import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, DollarSignIcon, UsersIcon, MousePointerClickIcon } from 'lucide-react';

/**
 * SocialAnalyticsDashboard Component
 *
 * A comprehensive dashboard for visualizing SocialScaleBooster analytics
 * using DataLens integration.
 *
 * Features:
 * - Real-time metrics summary
 * - Platform performance breakdown
 * - Time-series trend analysis
 * - Top performing bots
 * - Pre-built query templates
 */

interface SocialAnalyticsDashboardProps {
  databaseId: string;
  userId: string;
}

interface SummaryMetrics {
  totalRevenue: number;
  totalEngagement: number;
  totalPosts: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  engagementRate: number;
}

interface PlatformMetrics {
  platform: string;
  botCount: number;
  revenue: number;
  engagement: number;
  posts: number;
  conversionRate: number;
}

interface BotPerformance {
  botId: string;
  botName: string;
  platform: string;
  status: string;
  totalRevenue: number;
  totalEngagement: number;
  totalPosts: number;
  conversionRate: number;
}

interface TimeSeriesData {
  period: string;
  revenue: number;
  engagement: number;
  posts: number;
  clicks: number;
  conversions: number;
}

export function SocialAnalyticsDashboard({ databaseId, userId }: SocialAnalyticsDashboardProps) {
  const [timePeriod, setTimePeriod] = useState<'7' | '30' | '90'>('30');
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

  // Fetch summary metrics
  const { data: summary, isLoading: summaryLoading } = useQuery<SummaryMetrics>({
    queryKey: ['social-summary', databaseId, userId],
    queryFn: async () => {
      const res = await fetch(
        `/api/social/analytics/summary?databaseId=${databaseId}&userId=${userId}`
      );
      if (!res.ok) throw new Error('Failed to fetch summary');
      return res.json();
    },
  });

  // Fetch platform breakdown
  const { data: platforms, isLoading: platformsLoading } = useQuery<PlatformMetrics[]>({
    queryKey: ['social-platforms', databaseId, userId],
    queryFn: async () => {
      const res = await fetch(
        `/api/social/analytics/platforms?databaseId=${databaseId}&userId=${userId}`
      );
      if (!res.ok) throw new Error('Failed to fetch platforms');
      return res.json();
    },
  });

  // Fetch bot performance
  const { data: bots, isLoading: botsLoading } = useQuery<BotPerformance[]>({
    queryKey: ['social-bots', databaseId, userId],
    queryFn: async () => {
      const res = await fetch(
        `/api/social/bots/performance?databaseId=${databaseId}&userId=${userId}&limit=10`
      );
      if (!res.ok) throw new Error('Failed to fetch bots');
      return res.json();
    },
  });

  // Fetch time-series data
  const { data: timeSeries, isLoading: timeSeriesLoading } = useQuery<TimeSeriesData[]>({
    queryKey: ['social-timeseries', databaseId, userId, timePeriod, groupBy],
    queryFn: async () => {
      const res = await fetch(
        `/api/social/analytics/timeseries?databaseId=${databaseId}&userId=${userId}&period=${timePeriod}&groupBy=${groupBy}`
      );
      if (!res.ok) throw new Error('Failed to fetch time series');
      return res.json();
    },
  });

  // Fetch query templates
  const { data: templates } = useQuery({
    queryKey: ['social-templates'],
    queryFn: async () => {
      const res = await fetch('/api/social/templates');
      if (!res.ok) throw new Error('Failed to fetch templates');
      return res.json();
    },
  });

  const platformIcons: Record<string, string> = {
    tiktok: '🎵',
    instagram: '📸',
    facebook: '👥',
    twitter: '🐦',
    youtube: '📹',
    multi: '🌐',
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Social Media Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Powered by SocialScaleBooster + DataLens
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timePeriod} onValueChange={(v) => setTimePeriod(v as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(summary?.totalRevenue || 0)}
          icon={<DollarSignIcon className="h-4 w-4" />}
          loading={summaryLoading}
        />
        <MetricCard
          title="Engagement Rate"
          value={formatPercentage(summary?.engagementRate || 0)}
          icon={<UsersIcon className="h-4 w-4" />}
          loading={summaryLoading}
        />
        <MetricCard
          title="Total Posts"
          value={formatNumber(summary?.totalPosts || 0)}
          icon={<TrendingUpIcon className="h-4 w-4" />}
          loading={summaryLoading}
        />
        <MetricCard
          title="Conversion Rate"
          value={formatPercentage(summary?.conversionRate || 0)}
          icon={<MousePointerClickIcon className="h-4 w-4" />}
          loading={summaryLoading}
        />
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="bots">Top Bots</TabsTrigger>
          <TabsTrigger value="templates">Query Templates</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>
                Daily revenue over the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timeSeriesLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">Loading chart...</p>
                </div>
              ) : (
                <div className="h-64">
                  <SimpleLineChart
                    data={timeSeries || []}
                    xKey="period"
                    yKey="revenue"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-48">
                <SimpleLineChart
                  data={timeSeries || []}
                  xKey="period"
                  yKey="engagement"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversions Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-48">
                <SimpleLineChart
                  data={timeSeries || []}
                  xKey="period"
                  yKey="conversions"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>
                Revenue and engagement breakdown by platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformsLoading ? (
                  <p className="text-muted-foreground">Loading platforms...</p>
                ) : (
                  platforms?.map((platform) => (
                    <div
                      key={platform.platform}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {platformIcons[platform.platform] || '📱'}
                        </span>
                        <div>
                          <p className="font-semibold capitalize">
                            {platform.platform}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {platform.botCount} bot{platform.botCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(platform.revenue)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(platform.engagement)} engagement
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPercentage(platform.conversionRate)} CVR
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Bots Tab */}
        <TabsContent value="bots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Bots</CardTitle>
              <CardDescription>
                Your highest revenue-generating bots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {botsLoading ? (
                  <p className="text-muted-foreground">Loading bots...</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Bot Name</th>
                        <th className="text-left p-2">Platform</th>
                        <th className="text-right p-2">Revenue</th>
                        <th className="text-right p-2">Posts</th>
                        <th className="text-right p-2">CVR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bots?.map((bot) => (
                        <tr key={bot.botId} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{bot.botName}</td>
                          <td className="p-2 capitalize">
                            <span className="mr-1">
                              {platformIcons[bot.platform]}
                            </span>
                            {bot.platform}
                          </td>
                          <td className="p-2 text-right">
                            {formatCurrency(bot.totalRevenue)}
                          </td>
                          <td className="p-2 text-right">
                            {formatNumber(bot.totalPosts)}
                          </td>
                          <td className="p-2 text-right">
                            {formatPercentage(bot.conversionRate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Query Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pre-built Query Templates</CardTitle>
              <CardDescription>
                18 ready-to-use analytics queries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates?.templates?.slice(0, 12).map((template: any) => (
                  <div
                    key={template.id}
                    className="p-3 border rounded-lg hover:border-primary cursor-pointer"
                  >
                    <h4 className="font-semibold text-sm">{template.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {template.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {template.visualizationType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Templates
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components

function MetricCard({
  title,
  value,
  icon,
  loading,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 bg-muted animate-pulse rounded" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

function SimpleLineChart({
  data,
  xKey,
  yKey,
}: {
  data: any[];
  xKey: string;
  yKey: string;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  // Simple SVG line chart implementation
  // In production, use a library like Chart.js or Recharts
  const max = Math.max(...data.map((d) => d[yKey]));
  const width = 600;
  const height = 200;
  const padding = 40;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - (d[yKey] / max) * (height - 2 * padding);
    return `${x},${y}`;
  });

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
      />
      {data.map((d, i) => {
        const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
        const y = height - padding - (d[yKey] / max) * (height - 2 * padding);
        return (
          <circle key={i} cx={x} cy={y} r="3" fill="hsl(var(--primary))" />
        );
      })}
    </svg>
  );
}
