FROM node:18-bullseye-slim

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install --include=dev

# Copiar código y esquema de Prisma
COPY . .

# Generar cliente Prisma para la plataforma Linux del contenedor
RUN npx prisma generate

# EXPLICACIÓN DEL CMD:
# 1. prisma db push --accept-data-loss: Sincroniza el schema con la DB aunque requiera recrear columnas.
# 2. node server.js: Arranca tu API.
CMD npx prisma db push --accept-data-loss && node server.js