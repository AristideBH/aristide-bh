# Dockerfile for building and running a SvelteKit application using pnpm.

# --- Build Stage ---
    FROM node:21-alpine AS builder

    WORKDIR /app
    
    # Install build dependencies
    RUN apk --no-cache add --virtual build-deps \
        python3 \
        make \
        g++
    
    # Copy pnpm lockfile first for better caching
    COPY pnpm-lock.yaml ./
    
    # Install pnpm globally
    RUN npm install -g pnpm
    
    # Copy package.json next
    COPY package.json ./
    
    # Install project dependencies using pnpm
    RUN pnpm install --frozen-lockfile --ignore-scripts
    
    # Copy the rest of the application code
    COPY . .
    
    # Build the SvelteKit application using pnpm
    RUN pnpm run build
    
    # Remove build dependencies
    RUN apk --purge --no-cache del build-deps
    
# --- Production Stage ---
    FROM node:21-alpine AS runner
    
    WORKDIR /app
    
    # Set timezone (using ARG as in the original)
    ARG TZ=Europe/Paris
    RUN apk --no-cache add tzdata
    RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
    
    # Copy built application from the builder stage
    COPY --from=builder /app/build ./build
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml # Copy pnpm lockfile
    
    # Install production dependencies (only if needed)
    RUN pnpm install --prod --frozen-lockfile --ignore-scripts
    
    # Expose the original port (80)
    EXPOSE 80
    
    # Set environment variables (if needed)
    ARG PUBLIC_DIRECTUS_URL
    ARG PUBLIC_COOKIE_DOMAIN
    ARG PUBLIC_SITE_URL
    
    # Create a non-root user
    RUN addgroup --gid 1001 appuser && adduser --uid 1001 --gid appuser --disabled-password --gecos "" appuser
    USER appuser
    
    # Start the application
    CMD ["node", "build/index.js"]