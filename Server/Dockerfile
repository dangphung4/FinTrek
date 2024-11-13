FROM node:20.9.0-slim

# Set the working directory
WORKDIR /server

# Copy only package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci && \
    npm prune --production

# Copy specific files and folders needed to run the app
COPY server.js ./
COPY config/ config/
COPY controllers/ controllers/
COPY middleware/ middleware/
COPY routes/ routes/
COPY services/ services/

# Set environment variables
ENV PORT=8080

# Expose the port the app runs on
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
