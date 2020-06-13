FROM node:alpine

RUN apk add --no-cache --virtual .build-deps \
    ca-certificates \
    wget \
    tar && \
    cd /usr/local/bin && \
    wget https://classic.yarnpkg.com/latest.tar.gz && \
    tar zvxf latest.tar.gz && \
    ln -s /usr/local/bin/dist/bin/yarn.js /usr/local/bin/yarn.js && \
    apk del .build-deps

# The way to pass env variables on docker build via --build-arg
ARG GIT_COMMIT="default"
ARG SESSION_SECRET="default"
ARG ALLOWED_EMAILS="default"
ARG CDN_ACCESS_KEY_ID="default"
ARG CDN_SECRET_ACCESS_KEY="default"

ENV GIT_COMMIT=${GIT_COMMIT}
ENV SESSION_SECRET=${SESSION_SECRET}
ENV ALLOWED_EMAILS=${ALLOWED_EMAILS}
ENV CDN_ACCESS_KEY_ID=${CDN_ACCESS_KEY_ID}
ENV CDN_SECRET_ACCESS_KEY=${CDN_SECRET_ACCESS_KEY}

WORKDIR /srv/momart

COPY . .
RUN cp example.prod.env .env
RUN yarn install --pure-lockfile --ignore-optional
RUN yarn build
RUN yarn install --pure-lockfile --ignore-optional --production

ENTRYPOINT yarn start
