FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci
COPY . .

RUN npm run build

FROM nginx:1.25.2-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/cache-headers.conf /etc/nginx/conf.d/cache-headers.conf
COPY nginx/nocache-headers.conf /etc/nginx/conf.d/nocache-headers.conf
COPY nginx/security-headers.conf /etc/nginx/conf.d/security-headers.conf

EXPOSE 5173