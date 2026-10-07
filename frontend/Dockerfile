FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if necessary, or let Vercel handle it in real deployments.
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
