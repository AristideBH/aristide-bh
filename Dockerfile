# Dockerfile for building and running a SvelteKit application using pnpm.

# --- Build Stage ---
    FROM node:21-alpine AS builder
    WORKDIR /app
    
    # Install build dependencies
    RUN apk --no-cache add --virtual build-deps \
        python3 \
        make \
        g++
    
    # Install pnpm globally
    RUN npm install -g pnpm
    
    # Copy package.json 
    COPY package.json ./
    
    # Install project dependencies using pnpm
    RUN pnpm install --prod --no-frozen-lockfile --ignore-scripts
    
    # Copy the rest of the application code
    COPY . .
    
    # Build arguments
    ARG PUBLIC_DIRECTUS_URL
    ARG PUBLIC_COOKIE_DOMAIN
    ARG PUBLIC_SITE_URL
    
    # Build the SvelteKit application
    RUN pnpm run build
    
    # Remove build dependencies
    RUN apk --purge --no-cache del build-deps
    
    # --- Production Stage ---
    FROM node:21-alpine AS runner
    
    WORKDIR /app
    
    # Set timezone
    ARG TZ=Europe/Paris
    RUN apk --no-cache add tzdata
    RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
    
    # Install pnpm globally
    RUN npm install -g pnpm
    
    # Copy built application from the builder stage
    COPY --from=builder /app/build ./build
    COPY --from=builder /app/package.json ./package.json
    
    # Install production dependencies
    RUN pnpm install --prod --no-frozen-lockfile --ignore-scripts
    
    # Expose the port
    EXPOSE 80
    
    # Create a non-root user
    RUN addgroup --gid 1001 appuser && \
        adduser --uid 1001 --gid appuser --disabled-password --gecos "" appuser
    USER appuser
    
    # Start the application
    CMD ["node", "build/index.js"]