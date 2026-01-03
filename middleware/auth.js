/**
 * Authentication Middleware for SFSDataQueryEngine
 * Protects admin endpoints from unauthorized access
 */

/**
 * Simple API key authentication middleware
 * Checks for X-API-Key header against environment variable
 *
 * Usage:
 * app.get("/api/admin-endpoint", requireAuth, (req, res) => { ... });
 *
 * Set ADMIN_API_KEY in .env file
 */
export function requireAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.ADMIN_API_KEY;

  // Check if API key is configured
  if (!validApiKey) {
    console.error('⚠️  ADMIN_API_KEY not configured in environment');
    return res.status(500).json({
      success: false,
      message: 'Server configuration error'
    });
  }

  // Check if API key provided
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please provide X-API-Key header.'
    });
  }

  // Validate API key
  if (apiKey !== validApiKey) {
    console.warn(`❌ Invalid API key attempt from ${req.ip}`);
    return res.status(403).json({
      success: false,
      message: 'Invalid API key'
    });
  }

  // Authentication successful
  console.log(`✓ Authenticated request to ${req.path}`);
  next();
}

/**
 * Rate limiting for admin endpoints
 * Prevents brute force attacks
 */
const loginAttempts = new Map();

export function rateLimitAuth(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || { count: 0, firstAttempt: now };

  // Reset after 15 minutes
  if (now - attempts.firstAttempt > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return next();
  }

  // Increment attempts
  attempts.count++;
  loginAttempts.set(ip, attempts);

  // Block after 5 failed attempts
  if (attempts.count > 5) {
    console.warn(`🚫 Rate limit exceeded for ${ip}`);
    return res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again later.'
    });
  }

  next();
}

/**
 * Optional: JWT-based authentication (for future enhancement)
 * Uncomment and configure if using JWT tokens
 */
/*
import jwt from 'jsonwebtoken';

export function requireJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'JWT token required'
    });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}
*/
