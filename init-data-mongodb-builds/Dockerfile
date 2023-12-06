# Use a base image that includes both MongoDB and Node.js
FROM node:lts-alpine

RUN apk update && \
    apk add --no-cache netcat-openbsd

# Create a directory for your seeding script
ENV NODE_ENV=development
WORKDIR /app

COPY package.json .
RUN npm install --omit=dev

# Copy your seeding script into the container
COPY src/seed-test.js .
COPY src/seed-auth-data.js .
COPY src/seed-orders-data.js .
COPY src/seed-products-data.js .

# Install any additional dependencies required for the seeding script
# RUN npm install some-package

# Set permissions for the seeding script if needed
# RUN chmod +x seed-data.js

# Define the command to execute your seeding script (assuming it's a Node.js script)
# CMD ["node", "seed-data.js"]
