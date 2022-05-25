FROM node:16-alpine

# and mount application
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ /usr/src/app

RUN npm ci

USER node
EXPOSE 3000

CMD ["npm", "run", "dev"]
