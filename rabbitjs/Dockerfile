FROM node

RUN npm install express request bluebird bhttp
RUN npm install rabbit.js sockjs primus.io substream
RUN npm install js-data
RUN npm install js-data-mongodb bson gridfs-locking-stream

COPY ./ /work
WORKDIR /work

EXPOSE 8080
ENV PORT=8080

CMD node run.js
