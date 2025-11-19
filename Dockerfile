# Frontend Build (Vue.js)
FROM node:20-alpine AS frontend-builder

WORKDIR /app/client

# Kopiere erst package.json für besseres Caching
COPY client/package*.json ./
RUN npm install

# Kopiere den Rest des Clients und baue ihn
COPY client/ ./
RUN npm run build


# Server Run (Deno)
FROM denoland/deno:latest

WORKDIR /app

# Kopiere Server-Dateien
COPY server/ ./server/

# Kopiere Zertifikate und .env (müssen lokal vorhanden sein)
# Pfade müssen relativ zum Build-Kontext (Root des Projekts) sein
COPY server/localhost.pem ./
COPY server/localhost-key.pem ./
COPY server/.env ./

# Kopiere den gebauten Client in den public Ordner des Servers
COPY --from=frontend-builder /app/client/dist/ ./server/public/

# Setze Arbeitsverzeichnis auf server, da main.ts dort liegt
WORKDIR /app/server

# Port freigeben
EXPOSE 8000

# Startbefehl
CMD ["run", "--allow-net", "--allow-read", "--allow-env", "--unstable-kv", "main.ts"]