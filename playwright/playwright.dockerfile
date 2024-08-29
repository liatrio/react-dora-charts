# Use the official Node.js image with version 18.20.4
FROM node:18.20.4

# Set the working directory to /app
WORKDIR /app

# Copy the package.json file to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install && npx playwright install --with-deps

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port for Storybook (if needed)
EXPOSE 6006

# Run the command to start the Playwright tests
CMD ["npm", "run", "playwright"]
