FROM node

RUN npm install express request
RUN npm install rabbit.js sockjs primus.io substream
RUN npm install js-data js-data-mongodb bson gridfs-stream

COPY ./ /work
WORKDIR /work

EXPOSE 8080
ENV PORT=8080

CMD node run.js
