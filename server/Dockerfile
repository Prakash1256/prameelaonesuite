FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/
RUN npm install --workspace server

COPY server ./server
RUN npm run build --workspace server

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/
RUN npm install --omit=dev --workspace server

COPY --from=build /app/server/src ./server/src

EXPOSE 4000
CMD ["npm", "run", "start", "--workspace", "server"]
