FROM node:22-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache python3 make g++

FROM base AS dependencies
COPY package*.json ./
RUN npm ci

FROM base AS builder
COPY package*.json ./
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]