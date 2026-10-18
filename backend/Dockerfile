FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force
COPY . .
RUN mkdir -p /app/uploads && \
    addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "app.js"]
