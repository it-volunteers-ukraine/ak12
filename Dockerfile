# Build-time node version configuration
ARG NODE_VERSION=20

# Stage 1: Install dependencies
FROM node:${NODE_VERSION}-alpine AS dependencies
WORKDIR /app
RUN apk add --no-cache g++ make python3
COPY package.json package-lock.json* ./
RUN npm ci --include=optional --ignore-scripts

# Stage 2: Build application
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Production environment
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

# Define user and group for security
ARG USER=nextjs
ARG GROUP=nodejs
ARG UID=1001
ARG GID=1001

# Setup security and permissions
RUN addgroup --system --gid ${GID} ${GROUP} && \
    adduser --system --uid ${UID} ${USER} && \
    mkdir .next && \
    chown ${USER}:${GROUP} .next

# Copy built application with correct ownership
COPY --from=builder --chown=${USER}:${GROUP} /app/.next/standalone ./
COPY --from=builder --chown=${USER}:${GROUP} /app/.next/static ./.next/static
COPY --from=builder --chown=${USER}:${GROUP} /app/public ./public

USER ${USER}
EXPOSE ${PORT}
CMD ["node", "server.js"]
