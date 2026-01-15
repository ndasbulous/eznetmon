# Stage 1: Builder
# Use Node.js image to build the application
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for dependency caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Install dependencies and build the Next.js application
RUN npm run build

# Stage 2: Runtime
# Use minimal Node.js image to run the application
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application from builder stage
# Standalone mode bundles dependencies, no need for node_modules installation
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Change ownership to nextjs user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set hostname to localhost
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
