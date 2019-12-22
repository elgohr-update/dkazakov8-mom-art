FROM node:alpine

RUN apk add --no-cache --virtual .build-deps \
    ca-certificates \
    wget \
    tar && \
    cd /usr/local/bin && \
    wget https://yarnpkg.com/latest.tar.gz && \
    tar zvxf latest.tar.gz && \
    ln -s /usr/local/bin/dist/bin/yarn.js /usr/local/bin/yarn.js && \
    apk del .build-deps

# The way to pass env variables on docker build via --build-arg
ARG GIT_COMMIT="default"
ARG SESSION_SECRET="default"
ARG ALLOWED_EMAILS="default"
ARG YANDEX_STORAGE_ACCESS_KEY_ID="default"
ARG YANDEX_STORAGE_SECRET_ACCESS_KEY="default"

ENV GIT_COMMIT=${GIT_COMMIT}
ENV SESSION_SECRET=${SESSION_SECRET}
ENV ALLOWED_EMAILS=${ALLOWED_EMAILS}
ENV YANDEX_STORAGE_ACCESS_KEY_ID=${YANDEX_STORAGE_ACCESS_KEY_ID}
ENV YANDEX_STORAGE_SECRET_ACCESS_KEY=${YANDEX_STORAGE_SECRET_ACCESS_KEY}

WORKDIR /srv/momart

COPY . .
RUN cp example.prod.env .env
RUN yarn install --pure-lockfile
RUN yarn build
RUN yarn install --pure-lockfile --production

ENTRYPOINT yarn start
