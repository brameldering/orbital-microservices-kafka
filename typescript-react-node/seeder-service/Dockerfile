FROM node:lts-alpine
ENV NODE_ENV=development
WORKDIR /app
RUN apk add --no-cache openssl bash
COPY package.json .
COPY ./prisma prisma
RUN npm install --omit=dev
COPY . .
CMD ["npm", "start"]
