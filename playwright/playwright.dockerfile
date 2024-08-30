# Stage 1: Install Playwright browsers
FROM node:18.20.4-slim AS base
WORKDIR /app
RUN npx playwright install --with-deps && \
  chown -R node /app
USER node
RUN npx playwright install


# Stage 2: Build the project
FROM base
WORKDIR /app
USER node
COPY --chown=node package*.json ./
RUN npm install
COPY --chown=node . .
ENV PLAYWRIGHT_HTML_OPEN=never
CMD ["npm", "run", "playwright", "--config=playwright.config.js"]
