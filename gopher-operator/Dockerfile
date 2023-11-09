FROM node:21

WORKDIR /app
COPY ./package.json ./tsconfig.json /app/
COPY ./dist /app/dist/
COPY ./src /app/src/

RUN npm install

USER node

CMD node dist/index.js
