FROM node:lts-alpine3.16 as builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json .
RUN pnpm install --shamefully-hoist

COPY . .
RUN pnpm run build

FROM node:lts-alpine3.16

WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output

EXPOSE 3000

ENTRYPOINT ["node", ".output/server/index.mjs"]
