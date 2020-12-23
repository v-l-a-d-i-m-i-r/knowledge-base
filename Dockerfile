FROM node:12.16.2-alpine

RUN npm i -g http-server@0.12.3 nodemon@2.0.3
WORKDIR /www

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm i

COPY ./generator/package.json ./generator/package.json
COPY ./generator/package-lock.json ./generator/package-lock.json

# hook to avoid isssue with "npm install --prefix generator" command
RUN cd ./generator && npm i

COPY . .
