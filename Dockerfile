# ========================================
# Multi-stage Dockerfile for SFSDataQueryEngine
# Stack: Node.js + React + Prisma + Express
# ========================================

# ----------------------------------------
# Stage 1: Dependencies
# ----------------------------------------
FROM node:18-alpine AS dependencies

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Copy Prisma schema
COPY prisma ./prisma/

# Install production dependencies and generate Prisma client
RUN npm ci --only=production && \
    npx prisma generate && \
    npm cache clean --force

# ----------------------------------------
# Stage 2: Build
# ----------------------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Copy Prisma schema
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies)
RUN npm ci && \
    npx prisma generate && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the TypeScript application
RUN npm run build

# ----------------------------------------
# Stage 3: Production
# ----------------------------------------
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling and openssl for Prisma
RUN apk add --no-cache dumb-init openssl

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy production dependencies and Prisma client from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/prisma ./prisma

# Copy built artifacts from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

# Switch to non-root user
USER nodejs

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
# Note: Run migrations in a separate init container or before starting
CMD ["node", "dist/index.js"]
