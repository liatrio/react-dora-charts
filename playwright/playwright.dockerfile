FROM node:18.20.6-slim

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn install

RUN npx playwright install --with-deps

# Copy code & config
COPY . .

ENV PLAYWRIGHT_HTML_OPEN=never
CMD ["yarn", "playwright", "--config=playwright.config.js"]
