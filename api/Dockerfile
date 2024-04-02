FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy 'package.json' and 'package-lock.json' (if available)
COPY ./api/package*.json ./

# Install project dependencies
RUN npm install

# Copy project files and folders to the current working directory (i.e. 'app' folder)
COPY ./api .

# Expose port 3000 for the Hono server
EXPOSE 3000

# Start the app
CMD [ "npm", "start" ]