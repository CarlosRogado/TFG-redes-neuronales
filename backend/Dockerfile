FROM node:18-bullseye-slim

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Instalar workspace completo para que prisma esté disponible
RUN pnpm install --frozen-lockfile

COPY backend/ ./backend/

# Prisma en el store de pnpm
RUN cd backend && node ../node_modules/.pnpm/prisma@5.22.0/node_modules/prisma/build/index.js generate

CMD cd backend && node ../node_modules/.pnpm/prisma@5.22.0/node_modules/prisma/build/index.js db push --accept-data-loss && node server.js
