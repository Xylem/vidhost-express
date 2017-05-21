FROM node:7-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/

RUN npm install --production

COPY src /usr/src/app/src

EXPOSE 3000
CMD [ "npm", "start" ]
