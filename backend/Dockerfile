FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Dev command: use ts-node with proper ES module support
CMD ["sh", "-c", "NODE_OPTIONS='--loader ts-node/esm' nodemon --watch './src' --ext ts,js --exec 'node --loader ts-node/esm src/server.ts'"]
