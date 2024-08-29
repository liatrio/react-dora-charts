# Use the official Node.js image with version 18.20.4
FROM node:18.20.4

# Set the working directory to /app
WORKDIR /app

# Install Playwright Browsers
RUN npx playwright install --with-deps && \
  chown -R node /app

# Set the user to 'node'
USER node

# Copy the package.json file to the working directory
COPY --chown=node package*.json ./

# Install the dependencies
RUN npm install && npx playwright install

# Copy the rest of the application code to the working directory
COPY --chown=node . .

# Don't attempt to open the browser to show the test report
ENV PLAYWRIGHT_HTML_OPEN=never

# Run the command to start the Playwright tests
CMD ["npm", "run", "playwright", "--config=playwright.config.js"]
