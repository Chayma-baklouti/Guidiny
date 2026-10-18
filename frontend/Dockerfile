FROM node:20-alpine AS builder
WORKDIR /app
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max-old-space-size=700
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build && npm cache clean --force

RUN npm install -g javascript-obfuscator \
 && for f in build/static/js/main.*.js; do \
      javascript-obfuscator "$f" --output "$f.tmp" \
        --compact true \
        --string-array true \
        --string-array-threshold 0.75 \
        --control-flow-flattening false \
        --self-defending false \
      && mv "$f.tmp" "$f"; \
    done

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]