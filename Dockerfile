FROM --platform=linux/amd64 node:21-alpine as deps
WORKDIR /app
COPY package*.json ./
COPY .env ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN npm ci
FROM --platform=linux/amd64 node:21-alpine as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
FROM --platform=linux/amd64 node:21-alpine as runner
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.env ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/env.js ./src/env.js
ENV NODE_ENV=production
EXPOSE 3000
CMD [ "npm","run", "start" ]