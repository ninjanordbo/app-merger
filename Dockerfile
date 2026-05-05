FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy only the necessary files for dependency installation
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine AS production-stage

WORKDIR /app

# Copy only the built application and necessary files from the build stage
COPY --from=build-stage /app/.output /app/.output
COPY --from=build-stage /app/node_modules /app/node_modules
COPY --from=build-stage /app/package*.json /app/

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "run", "start"]

