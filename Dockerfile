FROM node:latest AS build

ENV SRC_DIR=/usr/src/app
RUN mkdir -p $SRC_DIR
WORKDIR $SRC_DIR

COPY . .
RUN npm update
RUN npm run build

FROM caddy:2.9.1-alpine

COPY ./Caddyfile /etc/caddy/Caddyfile
COPY --from=build /usr/src/app/dist /srv

ENTRYPOINT ["caddy", "file-server"]
