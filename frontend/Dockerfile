FROM node:6.2.1-slim

ENV BASE_DIR /usr/app
ENV SOURCE_DIR ${BASE_DIR}/src

# Create app directory
RUN mkdir -p ${SOURCE_DIR}

COPY ./package.json ${SOURCE_DIR}
COPY ./.babelrc ${SOURCE_DIR}
COPY ./index.js ${SOURCE_DIR}

ADD . ${SOURCE_DIR}

WORKDIR ${SOURCE_DIR}
RUN npm install