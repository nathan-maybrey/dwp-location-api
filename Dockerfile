FROM node:16.8.0-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY . .
RUN npm ci

EXPOSE 3000

# Run command
CMD [ "node", "server.js" ]
