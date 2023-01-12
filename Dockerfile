FROM node:16-alpine

WORKDIR /app

ENV PORT 5000

# Copy package.json and package-lock.json files
COPY package*.json ./

# Copy generated prisma files
COPY prisma ./prisma/

# Copy environment variables
COPY .env ./

# Copy tsconfig.json file
COPY tsconfig.json ./

# Copy all other project files
COPY . .

# Install all dependencies
RUN npm install

# TODO: Generate prisma client

# Run and expose the server on port 5000
EXPOSE 5000

CMD npm start
