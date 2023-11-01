FROM node:21

WORKDIR /app
COPY package.json /app
RUN npm install
COPY ./*.js /app/
RUN git clone https://github.com/scraly/gophers.git

USER node

EXPOSE 8080
CMD node index.js
