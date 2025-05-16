FROM node:20-slim AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8888
CMD ["node", "dist/main"]