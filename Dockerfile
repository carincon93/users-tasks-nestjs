FROM node:20

WORKDIR /var/www

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
