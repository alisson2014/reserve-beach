FROM node:lts-alpine
RUN apk add --no-cache git
RUN git config --global --add safe.directory /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]