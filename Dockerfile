FROM node:latest

MAINTAINER Shaun Burdick <docker@shaunburdick.com>

ENV NODE_ENV=production \
    ZALGO_VALIDATION_TOKEN=

ADD . /usr/src/myapp

WORKDIR /usr/src/myapp

RUN ["npm", "install"]

EXPOSE 3000

CMD ["npm", "start"]
