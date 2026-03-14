FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3014
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3014/health || exit 1
CMD ["node", "src/index.js"]
