FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy 'package.json' and 'package-lock.json' (if available)
COPY ./ui/package*.json ./

# Install project dependencies
RUN npm install

# Copy project files and folders to the current working directory (i.e. 'app' folder)
COPY ./ui .

# Build the app
RUN npm run build

# Expose port 5173 for the Vite server
EXPOSE 5173

# Start the app
CMD [ "npm", "run", "dev" ]