# Imagem de produção da API
FROM node:22-slim

ENV NODE_ENV=production
WORKDIR /app

# Instala apenas as dependências de produção (camada cacheada)
COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

# Executa como usuário sem privilégios
USER node

EXPOSE 3001
CMD ["node", "src/server.js"]
