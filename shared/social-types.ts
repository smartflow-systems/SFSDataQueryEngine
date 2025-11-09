/**
 * TypeScript type definitions for SocialScaleBooster integration
 * These types correspond to the Prisma models defined in schema.prisma
 */

/**
 * Social media platform types
 */
export type SocialPlatform = 'tiktok' | 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'multi';

/**
 * Bot status types
 */
export type BotStatus = 'active' | 'paused' | 'stopped';

/**
 * Template category types
 */
export type TemplateCategory = 'E-commerce' | 'Beauty' | 'Fashion' | 'Technology' | 'Food' | 'Travel' | 'Fitness' | 'Entertainment';

/**
 * SocialUser interface
 */
export interface SocialUser {
  id: string;
  username: string;
  password: string;
  email: string | null;
  isPremium: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  botCount: number;
  createdAt: Date;
}

/**
 * SocialBot interface
 */
export interface SocialBot {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  platform: SocialPlatform;
  status: BotStatus;
  config: string | null; // JSON string
  metrics: string | null; // JSON string
  createdAt: Date;
}

/**
 * Bot configuration structure (parsed from config JSON)
 */
export interface BotConfig {
  postingSchedule?: {
    frequency: string;
    times: string[];
    timezone: string;
  };
  contentSettings?: {
    hashtagCount: number;
    emojiUsage: boolean;
    captionLength: number;
  };
  targetAudience?: {
    ageRange: string;
    interests: string[];
    location: string[];
  };
  automationRules?: {
    autoReply: boolean;
    autoLike: boolean;
    autoFollow: boolean;
  };
}

/**
 * Bot metrics structure (parsed from metrics JSON)
 */
export interface BotMetrics {
  totalPosts?: number;
  totalEngagement?: number;
  totalReach?: number;
  conversionRate?: number;
  averageEngagementRate?: number;
  followers?: number;
  following?: number;
  lastActive?: string;
}

/**
 * SocialAnalytics interface
 */
export interface SocialAnalytics {
  id: string;
  userId: string;
  botId: string | null;
  date: Date;
  revenue: number;
  engagement: number;
  posts: number;
  clicks: number;
  conversions: number;
  impressions: number | null;
  reach: number | null;
}

/**
 * SocialBotTemplate interface
 */
export interface SocialBotTemplate {
  id: string;
  name: string;
  description: string | null;
  category: TemplateCategory;
  platform: SocialPlatform;
  isPremium: boolean;
  price: number | null;
  rating: number;
  reviewCount: number;
  config: string | null; // JSON string
  imageUrl: string | null;
  createdAt: Date;
}

/**
 * Aggregated analytics metrics
 */
export interface AggregatedMetrics {
  totalRevenue: number;
  totalEngagement: number;
  totalPosts: number;
  totalClicks: number;
  totalConversions: number;
  totalImpressions: number;
  totalReach: number;
  conversionRate: number;
  engagementRate: number;
  roi: number;
  averageRevenuePerPost: number;
}

/**
 * Platform-specific metrics
 */
export interface PlatformMetrics {
  platform: SocialPlatform;
  botCount: number;
  revenue: number;
  engagement: number;
  posts: number;
  conversionRate: number;
}

/**
 * Time-series analytics data point
 */
export interface TimeSeriesDataPoint {
  date: string;
  revenue: number;
  engagement: number;
  posts: number;
  clicks: number;
  conversions: number;
  impressions?: number;
  reach?: number;
}

/**
 * Bot performance summary
 */
export interface BotPerformanceSummary {
  botId: string;
  botName: string;
  platform: SocialPlatform;
  status: BotStatus;
  totalRevenue: number;
  totalEngagement: number;
  totalPosts: number;
  conversionRate: number;
  lastActive: Date;
  weeklyTrend: 'up' | 'down' | 'stable';
}

/**
 * Dashboard metrics response
 */
export interface DashboardMetrics {
  summary: AggregatedMetrics;
  platformBreakdown: PlatformMetrics[];
  topPerformingBots: BotPerformanceSummary[];
  timeSeriesData: TimeSeriesDataPoint[];
  recentActivity: ActivityEvent[];
}

/**
 * Activity event types
 */
export type ActivityEventType = 'bot_created' | 'revenue_generated' | 'engagement_spike' | 'conversion' | 'bot_paused' | 'bot_stopped';

/**
 * Activity event interface
 */
export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  timestamp: Date;
  userId: string;
  botId?: string;
  botName?: string;
  platform?: SocialPlatform;
  metadata: {
    amount?: number;
    metric?: string;
    value?: number;
    description?: string;
  };
}

/**
 * Query template interface for pre-built queries
 */
export interface SocialQueryTemplate {
  id: string;
  name: string;
  description: string;
  category: 'revenue' | 'engagement' | 'performance' | 'comparison' | 'trend' | 'roi';
  naturalLanguage: string;
  sqlTemplate: string;
  parameters?: {
    name: string;
    type: 'string' | 'number' | 'date' | 'platform';
    defaultValue?: any;
    required: boolean;
  }[];
  visualizationType?: 'line' | 'bar' | 'pie' | 'area' | 'table';
}

/**
 * Export format options
 */
export type ExportFormat = 'csv' | 'json' | 'excel' | 'pdf';

/**
 * Export request interface
 */
export interface ExportRequest {
  queryId: string;
  format: ExportFormat;
  includeCharts: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Analytics filter options
 */
export interface AnalyticsFilters {
  platforms?: SocialPlatform[];
  botIds?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  metrics?: string[];
  minRevenue?: number;
  minEngagement?: number;
  status?: BotStatus[];
}

/**
 * Real-time analytics update
 */
export interface RealTimeAnalyticsUpdate {
  timestamp: Date;
  metrics: Partial<AggregatedMetrics>;
  recentEvents: ActivityEvent[];
  activeUsers: number;
  activeBots: number;
}

/**
 * Social media integration status
 */
export interface IntegrationStatus {
  connected: boolean;
  databaseType: 'postgresql' | 'sqlite';
  lastSync: Date | null;
  recordCount: {
    users: number;
    bots: number;
    analytics: number;
    templates: number;
  };
  healthStatus: 'healthy' | 'degraded' | 'unavailable';
  error?: string;
}
