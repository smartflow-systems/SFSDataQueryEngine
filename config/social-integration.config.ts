/**
 * SocialScaleBooster Integration Configuration
 *
 * This configuration file defines how DataLens integrates with SocialScaleBooster
 * to provide natural language querying capabilities for social media analytics.
 */

export interface SocialIntegrationConfig {
  enabled: boolean;
  databaseConnection: {
    type: 'postgresql' | 'sqlite';
    host?: string;
    port?: number;
    database: string;
    username?: string;
    password?: string;
    ssl?: boolean;
  };
  features: {
    realTimeAnalytics: boolean;
    exportEnabled: boolean;
    dashboardTemplates: boolean;
  };
  queryTemplates: {
    enabled: boolean;
    customTemplatesPath?: string;
  };
}

/**
 * Default configuration for SocialScaleBooster integration
 */
export const defaultSocialConfig: SocialIntegrationConfig = {
  enabled: true,
  databaseConnection: {
    type: 'postgresql',
    host: process.env.SOCIAL_DB_HOST || 'localhost',
    port: parseInt(process.env.SOCIAL_DB_PORT || '5432'),
    database: process.env.SOCIAL_DB_NAME || 'socialscalebooster',
    username: process.env.SOCIAL_DB_USER || 'postgres',
    password: process.env.SOCIAL_DB_PASSWORD || '',
    ssl: process.env.SOCIAL_DB_SSL === 'true',
  },
  features: {
    realTimeAnalytics: true,
    exportEnabled: true,
    dashboardTemplates: true,
  },
  queryTemplates: {
    enabled: true,
    customTemplatesPath: './config/social-query-templates.json',
  },
};

/**
 * Platform configuration for social media platforms
 */
export const platformConfig = {
  platforms: [
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: '#E4405F' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: '#1877F2' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: '#1DA1F2' },
    { id: 'youtube', name: 'YouTube', icon: '📹', color: '#FF0000' },
    { id: 'multi', name: 'Multi-Platform', icon: '🌐', color: '#6366F1' },
  ],
  metrics: [
    { id: 'revenue', name: 'Revenue', format: 'currency', aggregation: 'sum' },
    { id: 'engagement', name: 'Engagement', format: 'number', aggregation: 'sum' },
    { id: 'posts', name: 'Posts', format: 'number', aggregation: 'sum' },
    { id: 'clicks', name: 'Clicks', format: 'number', aggregation: 'sum' },
    { id: 'conversions', name: 'Conversions', format: 'number', aggregation: 'sum' },
    { id: 'impressions', name: 'Impressions', format: 'number', aggregation: 'sum' },
    { id: 'reach', name: 'Reach', format: 'number', aggregation: 'sum' },
  ],
  calculatedMetrics: [
    { id: 'conversionRate', name: 'Conversion Rate', formula: '(conversions / clicks) * 100', format: 'percentage' },
    { id: 'engagementRate', name: 'Engagement Rate', formula: '(engagement / reach) * 100', format: 'percentage' },
    { id: 'roi', name: 'ROI', formula: '(revenue / costs) * 100', format: 'percentage' },
    { id: 'ctr', name: 'Click-Through Rate', formula: '(clicks / impressions) * 100', format: 'percentage' },
  ],
};

/**
 * Database table mapping for SocialScaleBooster schema
 */
export const socialTableMapping = {
  users: {
    tableName: 'social_users',
    primaryKey: 'id',
    columns: {
      id: { type: 'string', description: 'User ID' },
      username: { type: 'string', description: 'Username' },
      email: { type: 'string', description: 'Email address' },
      isPremium: { type: 'boolean', description: 'Premium subscription status' },
      botCount: { type: 'number', description: 'Number of bots owned' },
      createdAt: { type: 'datetime', description: 'Account creation date' },
    },
  },
  bots: {
    tableName: 'social_bots',
    primaryKey: 'id',
    columns: {
      id: { type: 'string', description: 'Bot ID' },
      userId: { type: 'string', description: 'Owner user ID' },
      name: { type: 'string', description: 'Bot name' },
      description: { type: 'string', description: 'Bot description' },
      platform: { type: 'string', description: 'Social media platform' },
      status: { type: 'string', description: 'Bot status (active/paused/stopped)' },
      createdAt: { type: 'datetime', description: 'Bot creation date' },
    },
  },
  analytics: {
    tableName: 'social_analytics',
    primaryKey: 'id',
    columns: {
      id: { type: 'string', description: 'Analytics record ID' },
      userId: { type: 'string', description: 'User ID' },
      botId: { type: 'string', description: 'Bot ID' },
      date: { type: 'datetime', description: 'Record date' },
      revenue: { type: 'number', description: 'Revenue generated' },
      engagement: { type: 'number', description: 'Total engagement (likes, comments, shares)' },
      posts: { type: 'number', description: 'Number of posts' },
      clicks: { type: 'number', description: 'Total clicks' },
      conversions: { type: 'number', description: 'Total conversions' },
      impressions: { type: 'number', description: 'Total impressions' },
      reach: { type: 'number', description: 'Total reach' },
    },
  },
  templates: {
    tableName: 'social_bot_templates',
    primaryKey: 'id',
    columns: {
      id: { type: 'string', description: 'Template ID' },
      name: { type: 'string', description: 'Template name' },
      description: { type: 'string', description: 'Template description' },
      category: { type: 'string', description: 'Template category' },
      platform: { type: 'string', description: 'Target platform' },
      isPremium: { type: 'boolean', description: 'Premium template flag' },
      price: { type: 'number', description: 'Template price' },
      rating: { type: 'number', description: 'Average rating' },
      reviewCount: { type: 'number', description: 'Number of reviews' },
    },
  },
};

/**
 * Helper function to get configuration
 */
export function getSocialIntegrationConfig(): SocialIntegrationConfig {
  return defaultSocialConfig;
}

/**
 * Helper function to validate database connection
 * @param connectionString - The database connection string to validate
 * @param databaseType - The type of database (postgresql, mysql, sqlite)
 */
export async function validateSocialDatabaseConnection(
  connectionString?: string,
  databaseType: string = 'postgresql'
): Promise<{ valid: boolean; error?: string }> {
  const config = getSocialIntegrationConfig();

  if (!config.enabled) {
    return { valid: false, error: 'SocialScaleBooster integration is not enabled' };
  }

  if (!connectionString) {
    return { valid: false, error: 'Connection string is required' };
  }

  try {
    // Basic connection string validation
    const urlPattern = /^(postgresql|mysql|sqlite):\/\/.+/i;
    if (!urlPattern.test(connectionString)) {
      return { valid: false, error: 'Invalid connection string format' };
    }

    // For PostgreSQL/MySQL, validate the connection string structure
    if (databaseType === 'postgresql' || databaseType === 'mysql') {
      const dbUrlRegex = /^(postgresql|mysql):\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/;
      if (!dbUrlRegex.test(connectionString)) {
        return {
          valid: false,
          error: 'Connection string must be in format: protocol://user:password@host:port/database'
        };
      }
    }

    // For SQLite, validate the file path
    if (databaseType === 'sqlite') {
      const sqliteRegex = /^sqlite:\/\/.+\.db$/;
      if (!sqliteRegex.test(connectionString)) {
        return { valid: false, error: 'SQLite connection string must point to a .db file' };
      }
    }

    // If we get here, basic validation passed
    // Note: Actual connection testing would require database drivers
    // and should be done server-side when the connection is created
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown validation error'
    };
  }
}

/**
 * Helper function to get platform configuration
 */
export function getPlatformById(platformId: string) {
  return platformConfig.platforms.find(p => p.id === platformId);
}

/**
 * Helper function to get metric configuration
 */
export function getMetricById(metricId: string) {
  return platformConfig.metrics.find(m => m.id === metricId);
}
