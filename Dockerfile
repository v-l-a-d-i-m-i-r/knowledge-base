FROM node:12.16.2-alpine

# ENV SASS_BINARY_NAME=linux-x64-57

# RUN apk add --update \
#     python \
#     python-dev \
#     py-pip \
#   && rm -rf /var/cache/apk/*

RUN npm i -g http-server@0.12.3 nodemon@2.0.3
WORKDIR /www

COPY . .

RUN npm i
