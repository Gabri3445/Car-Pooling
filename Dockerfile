FROM --platform=linux/amd64 node:21-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
EXPOSE 3000
RUN npm run build
CMD [ "npm","run", "start" ]