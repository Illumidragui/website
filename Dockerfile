FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG DOCUSAURUS_CONF_URL=https://shengjunye.me
ARG DOCKER_IMAGE_TAG=latest
ENV DOCUSAURUS_CONF_URL=$DOCUSAURUS_CONF_URL
ENV DOCKER_IMAGE_TAG=$DOCKER_IMAGE_TAG

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80