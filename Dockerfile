FROM node:12.16.2-alpine

RUN npm i -g nodemon@2.0.3 live-server@1.2.2 concurrently@7.3.0
WORKDIR /www

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

COPY ./generator/package.json ./generator/package.json
COPY ./generator/package-lock.json ./generator/package-lock.json

RUN npm i

# hook to avoid isssue with "npm install --prefix generator" command
RUN cd ./generator && npm i

COPY . .
