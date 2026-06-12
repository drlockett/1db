FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY server/package.json ./server/package.json
COPY server/src ./server/src

WORKDIR /app/server
EXPOSE 8080
CMD ["node", "src/server.js"]
