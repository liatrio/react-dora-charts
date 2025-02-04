FROM node:18.20.4-slim

WORKDIR /app

COPY package*.json ./
RUN yarn install

RUN npx playwright install --with-deps

# Copy code & config
COPY . .

ENV PLAYWRIGHT_HTML_OPEN=never
CMD ["yarn", "playwright", "--config=playwright.config.js"]
