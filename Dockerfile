FROM node:14.10.1-alpine3.12

WORKDIR /usr/src/app

RUN rm -rf node_modules

COPY package.json ./

#RUN npm cache clean --force


RUN npm install
RUN npm dedupe

EXPOSE 8080
CMD [ "npm", "start" ]
